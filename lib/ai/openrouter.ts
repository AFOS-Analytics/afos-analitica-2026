/**
 * Cliente OpenRouter (API compatível com OpenAI) — chatbot AFOS-Analytics.
 *
 * Modelo padrão: deepseek/deepseek-v4-flash (1M de contexto, tool-calling).
 * Faz UMA completion em streaming por chamada e expõe os eventos como um
 * async generator: o orquestrador (app/api/chat/route.ts) roda o loop de
 * rounds (tool-calling) por cima disto.
 *
 * Sem dependência de AI SDK — fetch cru + parsing de SSE, igual ao padrão de
 * lib/ai/translate.ts. Chave em OPENROUTER_API_KEY (.env.local, gitignored).
 */

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const DEFAULT_MODEL = 'deepseek/deepseek-v4-flash'

// ─── Tipos (subset OpenAI chat) ────────────────────────────────────

export interface ToolCall {
  id: string
  type: 'function'
  function: { name: string; arguments: string }
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string | null
  tool_calls?: ToolCall[]
  tool_call_id?: string
  name?: string
}

export interface ToolSpec {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: Record<string, unknown>
  }
}

export type StreamEvent =
  | { type: 'text'; text: string }
  | { type: 'done'; toolCalls: ToolCall[]; finishReason: string | null; usage?: Usage }

export interface Usage {
  prompt_tokens?: number
  completion_tokens?: number
  total_tokens?: number
}

export function getModel(): string {
  return process.env.OPENROUTER_CHAT_MODEL || DEFAULT_MODEL
}

export function isConfigured(): boolean {
  return !!process.env.OPENROUTER_API_KEY
}

// ─── Acumulador de tool_calls em streaming ─────────────────────────
// Os deltas chegam por índice; precisamos colar name + arguments incrementais.

interface PartialToolCall {
  id: string
  name: string
  arguments: string
}

function mergeToolCallDelta(acc: Map<number, PartialToolCall>, deltas: unknown[]): void {
  for (const raw of deltas) {
    const d = raw as { index?: number; id?: string; function?: { name?: string; arguments?: string } }
    const idx = typeof d.index === 'number' ? d.index : 0
    const cur = acc.get(idx) ?? { id: '', name: '', arguments: '' }
    if (d.id) cur.id = d.id
    if (d.function?.name) cur.name = d.function.name
    if (d.function?.arguments) cur.arguments += d.function.arguments
    acc.set(idx, cur)
  }
}

/**
 * Roda uma completion em streaming. Faz yield de deltas de texto à medida que
 * chegam e, ao final, de um evento `done` com os tool_calls completos e o
 * finishReason. Lança em erro de configuração / HTTP não-2xx / timeout.
 */
export async function* streamCompletion(
  messages: ChatMessage[],
  tools: ToolSpec[],
  signal?: AbortSignal,
  timeoutMs = 60_000,
): AsyncGenerator<StreamEvent> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error('openrouter_not_configured')

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  // Aborta também se o cliente desconectar.
  if (signal) signal.addEventListener('abort', () => controller.abort(), { once: true })

  let res: Response
  try {
    res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        // Atribuição opcional do OpenRouter (aparece no painel deles).
        'HTTP-Referer': process.env.NEXT_PUBLIC_BASE_URL || 'https://www.afos-analytics.com',
        'X-Title': 'AFOS-Analytics Chatbot',
      },
      body: JSON.stringify({
        model: getModel(),
        messages,
        tools: tools.length > 0 ? tools : undefined,
        tool_choice: tools.length > 0 ? 'auto' : undefined,
        temperature: 0.3,
        max_tokens: 1500,
        stream: true,
        stream_options: { include_usage: true },
      }),
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timeout)
    const name = err instanceof Error ? err.name : ''
    if (name === 'AbortError') throw new Error('openrouter_timeout')
    throw err
  }

  if (!res.ok || !res.body) {
    clearTimeout(timeout)
    const body = await res.text().catch(() => '')
    throw new Error(`openrouter_${res.status}: ${body.slice(0, 200)}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  const toolAcc = new Map<number, PartialToolCall>()
  let finishReason: string | null = null
  let usage: Usage | undefined
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      // SSE: eventos separados por \n\n; cada linha "data: {...}".
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) continue
        const payload = trimmed.slice(5).trim()
        if (payload === '[DONE]') continue
        let chunk: {
          choices?: Array<{
            delta?: { content?: string | null; tool_calls?: unknown[] }
            finish_reason?: string | null
          }>
          usage?: Usage
        }
        try {
          chunk = JSON.parse(payload)
        } catch {
          continue
        }
        if (chunk.usage) usage = chunk.usage
        const choice = chunk.choices?.[0]
        if (!choice) continue
        const delta = choice.delta
        if (delta?.content) yield { type: 'text', text: delta.content }
        if (delta?.tool_calls) mergeToolCallDelta(toolAcc, delta.tool_calls)
        if (choice.finish_reason) finishReason = choice.finish_reason
      }
    }
  } finally {
    clearTimeout(timeout)
    reader.releaseLock()
  }

  const toolCalls: ToolCall[] = [...toolAcc.values()]
    .filter((t) => t.name)
    .map((t) => ({
      id: t.id || `call_${t.name}`,
      type: 'function' as const,
      function: { name: t.name, arguments: t.arguments || '{}' },
    }))

  yield { type: 'done', toolCalls, finishReason, usage }
}
