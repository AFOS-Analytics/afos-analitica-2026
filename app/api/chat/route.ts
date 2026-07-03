/**
 * POST /api/chat — chatbot AFOS-Analytics (OpenRouter / DeepSeek V4 Flash).
 *
 * Pipeline:
 *   1. Rate-limit por IP (Redis, 20/h) + validação do payload.
 *   2. Monta system prompt (trilíngue) + histórico saneado + mensagem do usuário.
 *   3. Loop de tool-calling: chama o modelo em streaming; se ele pedir ferramentas,
 *      executa contra as libs internas (Polymarket/TSE/casos validados/notícias/Daily)
 *      e repete; quando responder texto, faz stream dos deltas ao cliente.
 *
 * Resposta: SSE (text/event-stream). Cada linha `data: {json}` com:
 *   { type: 'tool', name }     — uma ferramenta começou a rodar
 *   { type: 'delta', text }    — pedaço da resposta final
 *   { type: 'done' }           — fim
 *   { type: 'error', message } — falha
 *
 * Runtime Node (Prisma + crypto). Não-cacheável.
 */

import { isValidLocale, type Locale } from '../../../lib/i18n/config'
import { isRateLimited } from '../../../lib/rate-limit'
import { detectInjection } from '../../../lib/ai/guardrails'
import { buildSystemPrompt } from '../../../lib/ai/agent-prompt'
import { TOOL_SPECS, executeTool, type ToolContext } from '../../../lib/ai/agent-tools'
import { streamCompletion, isConfigured, type ChatMessage } from '../../../lib/ai/openrouter'
import { logChatTurn } from '../../../lib/ai/chat-log'
import { clientIp } from '../../../lib/net/client-ip'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_MESSAGES = 16
const MAX_CONTENT_CHARS = 6000
const MAX_TOOL_ROUNDS = 4
const TOOL_RESULT_CAP = 12_000

interface IncomingMessage {
  role: 'user' | 'assistant'
  content: string
}

// Garantia determinística anti-IA: remove travessões (em-dash U+2014 e en-dash
// U+2013) do texto visível, trocando por vírgula. Hífen comum (-) é preservado.
// Defesa em profundidade — o system prompt já proíbe travessão, isto cobre o que escapar.
function stripDashes(s: string): string {
  return s.replace(/\s*[—–]\s*/g, ', ')
}

export async function POST(req: Request): Promise<Response> {
  if (!isConfigured()) {
    return Response.json({ error: 'chat_not_configured' }, { status: 503 })
  }

  // ─── Rate-limit (fail-open se Redis ausente) ──────────────────────
  const ip = clientIp(req.headers)
  if (await isRateLimited(`chat:${ip}`, 20, 3600)) {
    return Response.json({ error: 'rate_limited', message: 'Muitas mensagens. Tente novamente em alguns minutos.' }, { status: 429 })
  }

  // ─── Validação do payload ─────────────────────────────────────────
  let body: { messages?: unknown; locale?: unknown; sessionId?: unknown }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 })
  }

  const locale: Locale = typeof body.locale === 'string' && isValidLocale(body.locale) ? body.locale : 'pt-BR'
  // sessionId: UUID efêmero do cliente, só agrupa a conversa no arquivo anônimo (NÃO identifica pessoa).
  const sessionId = typeof body.sessionId === 'string' ? body.sessionId : ''

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return Response.json({ error: 'messages_required' }, { status: 400 })
  }

  const history: IncomingMessage[] = body.messages
    .filter(
      (m): m is IncomingMessage =>
        !!m &&
        typeof (m as IncomingMessage).content === 'string' &&
        ((m as IncomingMessage).role === 'user' || (m as IncomingMessage).role === 'assistant'),
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CONTENT_CHARS) }))

  const lastUser = [...history].reverse().find((m) => m.role === 'user')
  if (!lastUser || !lastUser.content.trim()) {
    return Response.json({ error: 'empty_message' }, { status: 400 })
  }
  // Injeção é apenas sinalizada (o system prompt já instrui a ignorar) — não bloqueia.
  if (detectInjection(lastUser.content)) {
    console.warn('[api/chat] injection pattern flagged from', ip)
  }

  // ─── Montagem das mensagens ───────────────────────────────────────
  const ctx: ToolContext = { locale }
  const messages: ChatMessage[] = [
    { role: 'system', content: buildSystemPrompt(locale) },
    ...history.map((m) => ({ role: m.role, content: m.content })),
  ]

  // ─── Stream SSE ───────────────────────────────────────────────────
  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false
      let finalAnswer = ''
      const toolsUsed: string[] = []
      const send = (obj: unknown) => {
        if (closed) return
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`))
      }

      try {
        for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
          let assistantText = ''
          let toolCalls: import('../../../lib/ai/openrouter').ToolCall[] = []

          for await (const ev of streamCompletion(messages, TOOL_SPECS, req.signal)) {
            if (ev.type === 'text') {
              assistantText += ev.text
              send({ type: 'delta', text: stripDashes(ev.text) })
            } else {
              toolCalls = ev.toolCalls
            }
          }

          // Sem ferramentas → resposta final.
          if (toolCalls.length === 0) {
            finalAnswer = assistantText
            send({ type: 'done' })
            break
          }

          // Última volta e ainda quer ferramenta: encerra com o que tiver.
          if (round === MAX_TOOL_ROUNDS - 1) {
            finalAnswer = assistantText
            if (!assistantText) {
              send({ type: 'delta', text: locale === 'en'
                ? 'I gathered the data but hit the tool-call limit. Please rephrase or ask a narrower question.'
                : locale === 'es'
                  ? 'Reuní los datos pero alcancé el límite de llamadas a herramientas. Reformula o acota la pregunta.'
                  : 'Reuni os dados, mas atingi o limite de chamadas de ferramenta. Reformule ou faça uma pergunta mais específica.' })
            }
            send({ type: 'done' })
            break
          }

          // Registra a fala do assistente (com os tool_calls) e executa cada ferramenta.
          messages.push({ role: 'assistant', content: assistantText || null, tool_calls: toolCalls })
          for (const tc of toolCalls) {
            toolsUsed.push(tc.function.name)
            send({ type: 'tool', name: tc.function.name })
            let result: unknown
            try {
              result = await executeTool(tc.function.name, tc.function.arguments, ctx)
            } catch (err) {
              console.error('[api/chat] tool execution failed:', tc.function.name, err)
              result = { error: 'tool_execution_failed' }
            }
            messages.push({
              role: 'tool',
              tool_call_id: tc.id,
              name: tc.function.name,
              content: JSON.stringify(result).slice(0, TOOL_RESULT_CAP),
            })
          }
        }
      } catch (err) {
        console.error('[api/chat] stream error:', err)
        const msg = err instanceof Error ? err.message : 'unknown_error'
        send({ type: 'error', message: msg.startsWith('openrouter') ? 'O serviço de IA está indisponível no momento.' : 'Ocorreu um erro ao processar sua mensagem.' })
      } finally {
        // Arquivo ANÔNIMO da conversa (fail-open). Awaited antes de fechar para
        // garantir a escrita no runtime serverless; não bloqueia o que o usuário já viu.
        if (sessionId) {
          await logChatTurn({ sessionId, locale, userText: lastUser.content, assistantText: finalAnswer, tools: toolsUsed })
        }
        closed = true
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
