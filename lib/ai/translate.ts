/**
 * Módulo de tradução assistida por IA.
 *
 * Provider: Anthropic (default) ou OpenAI.
 * Cache: in-memory com LRU 500 (tabelas AI serão estendidas em fase futura).
 */

import { SYSTEM_PROMPT, uiTranslationPrompt, editorialTranslationPrompt, afosDailyTranslationPrompt } from './prompts'
import { shieldLinks, unshieldLinks, stripNestedGlossaryLinks, anchorTranslationPrompt } from './link-shield'
import { createHash } from 'crypto'
import { prisma } from '../db'

export interface TranslationRequest {
  sourceText: string
  sourceLocale: string
  targetLocale: string
  type: 'ui' | 'editorial' | 'afos-daily'
  /** For type='afos-daily' only — terms to keep in PT and link to glossary */
  glossaryEntries?: Array<{ term: string; id: string }>
}

export interface TranslationResult {
  translatedText: string
  cached: boolean
  provider: string
  meta?: { tokensIn?: number; tokensOut?: number; latencyMs?: number }
}

// ─── Hash ──────────────────────────────────────────────────────────

function hashKey(req: TranslationRequest): string {
  const raw = `${req.sourceLocale}:${req.targetLocale}:${req.type}:${req.sourceText}`
  return createHash('sha256').update(raw).digest('hex').slice(0, 32)
}

// ─── In-memory cache — LRU 500 ────────────────────────────────────

const MEM_CACHE_LIMIT = 500
const cache = new Map<string, { text: string; at: number }>()
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

function getCached(key: string): string | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.at > CACHE_TTL_MS) { cache.delete(key); return null }
  return entry.text
}

function setCache(key: string, text: string) {
  if (cache.size >= MEM_CACHE_LIMIT) {
    const oldest = cache.keys().next().value
    if (oldest) cache.delete(oldest)
  }
  cache.set(key, { text, at: Date.now() })
}

// ─── Provider abstraction ──────────────────────────────────────────

type Provider = 'anthropic' | 'openai'

// ─── Erro do provedor: status + o que a API respondeu ──────────────
//
// Até 24/Jul/2026 qualquer resposta não-ok virava `anthropic_400` e o CORPO da
// resposta era jogado fora. Naquela noite as 3 rodadas de tradução do dashboard
// falharam com esse código, e só foi possível descobrir o motivo real repetindo
// a chamada à mão com curl: era saldo zerado na conta de API. Um número de
// status sozinho não distingue "sem crédito" de "chave revogada" de "body
// malformado", e as três pedem providências diferentes. Agora o motivo vem
// junto, na primeira falha.

export interface ErroProvedor extends Error {
  status?: number
  /** `error.type` devolvido pela API (ex.: invalid_request_error). */
  tipoApi?: string
  /** `error.message` devolvido pela API, já limpo e truncado. */
  detalhe?: string
}

const SEM_CREDITO_RE = /credit balance|insufficient (?:credit|quota|funds)|purchase credits|billing/i

/** Traduz o status em uma frase que diz O QUE FAZER, não só o que houve. */
function explicarFalha(status: number, detalhe: string): string {
  if (SEM_CREDITO_RE.test(detalhe)) {
    return 'SEM CRÉDITO na conta de API. Recarregar saldo em console.anthropic.com, seção Plans & Billing. ' +
      'Atenção: a assinatura mensal do Claude é outra conta e NÃO abastece esse saldo.'
  }
  if (status === 429) return 'rate_limited: limite de requisições do provedor; repetir com espera.'
  if (status === 401) return 'chave de API inválida ou revogada. Conferir TRANSLATION_API_KEY / ANTHROPIC_API_KEY no .env.local.'
  if (status === 403) return 'a chave não tem permissão para este modelo ou workspace.'
  if (status === 404) return 'modelo inexistente ou endpoint errado.'
  if (status === 413) return 'requisição grande demais: reduzir o tamanho do texto enviado.'
  if (status >= 500) return 'falha do lado do provedor, provavelmente transitória; repetir resolve.'
  return 'requisição rejeitada pelo provedor.'
}

/** Lê o corpo da resposta com falha e monta o erro já explicado. */
async function falhaDoProvedor(res: Response, provider: Provider): Promise<ErroProvedor> {
  let tipoApi: string | undefined
  let detalhe = ''
  try {
    const corpo = await res.text()
    try {
      const j = JSON.parse(corpo)
      tipoApi = j?.error?.type
      detalhe = j?.error?.message ?? corpo
    } catch {
      detalhe = corpo
    }
  } catch {
    // Corpo ilegível: sobra o status, que já é mais do que tínhamos antes.
  }
  detalhe = String(detalhe).replace(/\s+/g, ' ').trim().slice(0, 300)

  // O prefixo `provider_status` é preservado de propósito: logs, greps e o
  // backoff do translate-afos-tradeoff-chunked (que casa por `includes`)
  // continuam funcionando como antes.
  const err = new Error(
    `${provider}_${res.status}: ${explicarFalha(res.status, detalhe)}` +
    (detalhe ? ` [API: ${detalhe}]` : ''),
  ) as ErroProvedor
  err.status = res.status
  err.tipoApi = tipoApi
  err.detalhe = detalhe
  return err
}

/**
 * true quando repetir NÃO adianta: saldo zerado, chave inválida, sem permissão.
 * Quem chama em lote usa isso para abortar a rodada inteira em vez de queimar
 * uma falha por arquivo e por idioma.
 */
export function falhaDeConta(err: unknown): boolean {
  const e = err as ErroProvedor | undefined
  if (!e) return false
  if (e.tipoApi === 'authentication_error' || e.tipoApi === 'permission_error') return true
  if (e.status === 401 || e.status === 403) return true
  return SEM_CREDITO_RE.test(String(e.detalhe ?? e.message ?? ''))
}

function getProvider(): { provider: Provider; apiKey: string } | null {
  const key = process.env.TRANSLATION_API_KEY ?? process.env.ANTHROPIC_API_KEY
  if (!key) return null
  const provider = (process.env.TRANSLATION_PROVIDER || 'anthropic') as Provider
  return { provider, apiKey: key }
}

async function callProvider(
  systemPrompt: string,
  userPrompt: string,
  provider: Provider,
  apiKey: string,
  maxTokens = 2048,
  timeoutMs = 30000
): Promise<{ text: string; tokensIn?: number; tokensOut?: number }> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    if (provider === 'anthropic') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: maxTokens,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        }),
        signal: controller.signal,
      })
      if (!res.ok) throw await falhaDoProvedor(res, 'anthropic')
      const data = await res.json()
      return {
        text: (data.content?.[0]?.text || '').trim(),
        tokensIn: data.usage?.input_tokens,
        tokensOut: data.usage?.output_tokens,
      }
    }

    if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: maxTokens,
          temperature: 0.1,
        }),
        signal: controller.signal,
      })
      if (!res.ok) throw await falhaDoProvedor(res, 'openai')
      const data = await res.json()
      return {
        text: (data.choices?.[0]?.message?.content || '').trim(),
        tokensIn: data.usage?.prompt_tokens,
        tokensOut: data.usage?.completion_tokens,
      }
    }

    throw new Error(`unknown_provider: ${provider}`)
  } finally {
    clearTimeout(timeout)
  }
}

// ─── LLM run tracking + guardrails (fire-and-forget) ───────────────

import { assessRisk, recordModelOutput } from './guardrails'

function trackLlmRun(provider: string, inputText: string, inputHash: string, outputText: string, outputHash: string) {
  if (!prisma) return

  const riskFlags = assessRisk(inputText, outputText)

  prisma.llmRun
    .create({
      data: {
        runType: 'translation',
        modelName: provider === 'anthropic' ? 'claude-haiku-4-5-20251001' : 'gpt-4o-mini',
        promptVersion: '1.0',
        inputHash,
        outputHash,
        riskFlags: {
          injectionDetected: riskFlags.injectionDetected,
          hallucinationRisk: riskFlags.hallucinationRisk,
          piiDetected: riskFlags.piiDetected,
          contentTooLong: riskFlags.contentTooLong,
          requiresHumanReview: riskFlags.requiresHumanReview,
        },
      },
    })
    .then((run) => {
      recordModelOutput(run.id, outputText)
    })
    .catch((err) => {
      console.warn('[llm-tracking] Failed:', err instanceof Error ? err.message : err)
    })
}

// ─── Public API ────────────────────────────────────────────────────

export async function translate(req: TranslationRequest): Promise<TranslationResult> {
  const key = hashKey(req)
  const cached = getCached(key)
  if (cached) {
    return { translatedText: cached, cached: true, provider: 'cache' }
  }

  const config = getProvider()
  if (!config) throw new Error('translation_not_configured')

  // Injection scan (flag, não bloqueia)
  const { detectInjection } = await import('./guardrails')
  const injectionDetected = detectInjection(req.sourceText)
  if (injectionDetected) {
    console.warn('[translate] Injection pattern detected in input, proceeding with flag')
  }

  // ── LINK SHIELD ─────────────────────────────────────────────────────────────
  // O modelo NÃO vê URL. Todo destino de link vira token opaco (⟦U0⟧, ⟦U1⟧…) antes
  // da chamada e é restaurado do original depois. Sem isso o modelo corrompe tokens
  // base64, sequestra link externo para âncora de glossário, aninha link e derruba
  // link, tudo em silêncio. Ver lib/ai/link-shield.ts para o histórico completo.
  const { masked: shieldedText, links: shieldedLinks } = shieldLinks(req.sourceText)

  // ── COLISÃO GLOSSÁRIO × ÂNCORA (bug determinístico, diagnosticado 14/Jul/2026) ──
  // A v2 do shield resolveu a âncora que CONTÉM termo de glossário ("2º lugar do 1º turno").
  // Faltava o caso inverso: a âncora que É um termo de glossário.
  //
  // Quando o texto traz [Polymarket](url) e o glossário manda "para cada ocorrência de
  // Polymarket, escreva [Polymarket](/en/glossary#polymarket)", as duas regras se excluem.
  // O modelo obedece ao glossário e DESCARTA o token do shield: o link externo morre.
  // Sintoma observado: 4 tentativas seguidas derrubaram os MESMOS 6 links, e todas as
  // âncoras perdidas eram termos do glossário (Polymarket, TSE, Quaest) enquanto TODAS as
  // que sobreviveram não eram (Gerp, BTG/Nexus, Futura/Apex, BR-07294/2026).
  //
  // Conserto: um termo que já está servindo de ÂNCORA neste texto sai da regra de glossário
  // DESTE texto. Não se pede ao modelo que faça duas coisas incompatíveis com a mesma palavra.
  // Trade-off assumido e correto: se "Polymarket" aparecer também em texto puro no mesmo chunk,
  // ele perde a tag de glossário ali. Integridade de link externo vale mais que tag de glossário.
  const ancoras = new Set(shieldedLinks.map((l) => l.anchor.trim().toLowerCase()).filter(Boolean))
  const glossarioSemColisao = (req.glossaryEntries ?? []).filter((e) => !ancoras.has(e.term.trim().toLowerCase()))
  const removidos = (req.glossaryEntries ?? []).length - glossarioSemColisao.length
  if (removidos > 0) {
    console.warn(
      `[link-shield] ${removidos} termo(s) de glossário saíram da regra neste chunk por colidirem com âncoras de link: ` +
      (req.glossaryEntries ?? []).filter((e) => ancoras.has(e.term.trim().toLowerCase())).map((e) => e.term).join(', '),
    )
  }

  const userPrompt =
    req.type === 'ui'
      ? uiTranslationPrompt(shieldedText, req.sourceLocale, req.targetLocale)
      : req.type === 'afos-daily'
        ? afosDailyTranslationPrompt(shieldedText, req.sourceLocale, req.targetLocale, glossarioSemColisao)
        : editorialTranslationPrompt(shieldedText, req.sourceLocale, req.targetLocale)

  // AFOS Daily syntheses are 600-900 words and contain dense markdown — give them more budget.
  const maxTokens = req.type === 'afos-daily' ? 8192 : 2048
  // 120s timeout: dailies grandes (>15k chars com seção "Fontes consultadas") podem levar 80-100s no Haiku 4.5.
  const timeoutMs = req.type === 'afos-daily' ? 120000 : 30000

  // ── TRADUÇÃO DAS ÂNCORAS (passada dedicada, SEM regra de glossário) ─────────
  // As âncoras não vão na chamada principal: se fossem, o modelo aplicaria a regra 5
  // DENTRO delas, destruiria o link externo e ainda erraria o sentido
  // ("2º lugar" virou "2º turno" em 13/Jul). Aqui elas viajam sozinhas, com um prompt
  // que proíbe markdown e glossário e exige tradução literal.
  //
  // Fica FORA do laço de integridade abaixo: as âncoras vêm do texto-fonte e não
  // dependem da chamada principal, então repeti-la a cada tentativa seria desperdício.
  const anchors = shieldedLinks.map((l) => l.anchor)
  let translatedAnchors: string[] = []
  if (anchors.some((a) => a)) {
    try {
      const ares = await callProvider(
        SYSTEM_PROMPT,
        anchorTranslationPrompt(anchors, req.targetLocale),
        config.provider, config.apiKey, 2048, 60000,
      )
      const linhas = ares.text.split('\n').map((l) => l.replace(/^\s*\d+\.\s*/, '').trim()).filter(Boolean)
      if (linhas.length === anchors.length) {
        translatedAnchors = linhas
      } else {
        console.warn(
          `[link-shield] passada de âncoras devolveu ${linhas.length} linhas para ${anchors.length} âncoras; ` +
          'mantendo as âncoras originais em português (link intacto, só o rótulo não traduzido).',
        )
      }
    } catch (err) {
      console.warn('[link-shield] passada de âncoras falhou; mantendo âncoras originais:',
        err instanceof Error ? err.message : err)
    }
  }

  // ── LAÇO DE INTEGRIDADE: repetir sob verificação ────────────────────────────
  // O modelo é ESTOCÁSTICO com os tokens do shield. Em 14/Jul, um chunk com 11 links
  // em 3.042 chars (um token a cada ~276 chars) derrubou 6 tokens numa passada, e
  // preservou os 11 numa passada idêntica logo em seguida. Não é defeito determinístico
  // de prompt: é variância do modelo sob alta densidade de tokens.
  //
  // Antes, `link_lost` abortava a tradução inteira na primeira falha, e o operador tinha
  // que rodar de novo à mão. Agora repetimos a chamada principal, e cada tentativa passa
  // pelo MESMO gate. Repetir é seguro justamente porque o shield verifica: nunca sai daqui
  // uma tradução com link perdido ou inventado. O gate não afrouxou, só ganhou paciência.
  const MAX_TENTATIVAS_INTEGRIDADE = 4
  let cleanText: string | null = null
  let latencyMs = 0
  let ultimaFalha = ''
  // Contadores da tentativa que PASSOU no gate (o `result` vive dentro do laço).
  let tokensIn: number | undefined
  let tokensOut: number | undefined

  for (let tentativa = 1; tentativa <= MAX_TENTATIVAS_INTEGRIDADE; tentativa++) {
    const start = Date.now()

    // Retry interno: falhas TRANSITÓRIAS de rede/API (429, 5xx, timeout).
    // 3 tentativas: 0ms, 1500ms, 4500ms.
    let result: Awaited<ReturnType<typeof callProvider>> | null = null
    let lastErr: unknown = null
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        result = await callProvider(SYSTEM_PROMPT, userPrompt, config.provider, config.apiKey, maxTokens, timeoutMs)
        break
      } catch (err) {
        lastErr = err
        // 4xx que não seja 429 (chave ruim, sem saldo, body malformado) nunca se recupera.
        //
        // A classificação lê o campo `status` do erro, não o texto da mensagem.
        // O texto agora carrega o motivo devolvido pela API, e a regra antiga
        // (`/_(429|5\d\d)$/`, ancorada no FIM) deixaria de casar assim que o
        // motivo fosse anexado: 429 e 5xx parariam de ser repetidos em silêncio.
        // As checagens por texto ficam como rede para erros de outra origem.
        const status = (err as ErroProvedor)?.status
        const msg = err instanceof Error ? err.message : String(err)
        const name = err instanceof Error ? err.name : ''
        const transient =
          status === 429 ||
          (typeof status === 'number' && status >= 500) ||
          (status === undefined && (msg === 'rate_limited' || /_(429|5\d\d)\b/.test(msg))) ||
          name === 'AbortError' ||
          name === 'TimeoutError'
        if (!transient || attempt === 2) throw err
        await new Promise((r) => setTimeout(r, 1500 * 3 ** attempt))
      }
    }
    if (!result) throw lastErr ?? new Error('translate_failed')
    if (!result.text) throw new Error('empty_translation')

    // ── REMONTAGEM DOS LINKS + GATE DE ADULTERAÇÃO ───────────────────────────
    const { text: unshielded, report } = unshieldLinks(result.text, shieldedLinks, translatedAnchors)

    if (report.hallucinated.length === 0 && report.lost.length === 0) {
      // Aninhamento de glossário dentro de outro link quebra o parser markdown.
      cleanText = stripNestedGlossaryLinks(unshielded)
      latencyMs = Date.now() - start
      tokensIn = result.tokensIn
      tokensOut = result.tokensOut
      if (tentativa > 1) {
        console.warn(`[link-shield] integridade OK na tentativa ${tentativa}/${MAX_TENTATIVAS_INTEGRIDADE}.`)
      }
      break
    }

    ultimaFalha = [
      report.lost.length > 0
        ? `${report.lost.length} link(s) destruído(s): ${report.lost.map((l) => `[${l.anchor}](${l.url})`).join(', ')}`
        : '',
      report.hallucinated.length > 0
        ? `${report.hallucinated.length} URL(s) inventada(s): ${report.hallucinated.join(', ')}`
        : '',
    ].filter(Boolean).join(' | ')

    console.warn(
      `[link-shield] tentativa ${tentativa}/${MAX_TENTATIVAS_INTEGRIDADE} REPROVADA no gate. ${ultimaFalha}`,
    )
    if (tentativa < MAX_TENTATIVAS_INTEGRIDADE) {
      await new Promise((r) => setTimeout(r, 1000 * tentativa))
    }
  }

  // Falhar ALTO depois de esgotar as tentativas. Melhor abortar do que publicar link morto.
  if (!cleanText) {
    throw new Error(
      `link_integrity_failed: o gate reprovou as ${MAX_TENTATIVAS_INTEGRIDADE} tentativas. Última falha: ${ultimaFalha}`,
    )
  }

  setCache(key, cleanText)

  const outputHash = createHash('sha256').update(cleanText).digest('hex').slice(0, 32)
  trackLlmRun(config.provider, req.sourceText, key, cleanText, outputHash)

  return {
    translatedText: cleanText,
    cached: false,
    provider: config.provider,
    meta: { tokensIn, tokensOut, latencyMs },
  }
}
