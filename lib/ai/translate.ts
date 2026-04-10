/**
 * Módulo de tradução assistida por IA.
 *
 * Provider: Anthropic (default) ou OpenAI.
 * Cache: in-memory com LRU 500 (tabelas AI serão estendidas em fase futura).
 */

import { SYSTEM_PROMPT, uiTranslationPrompt, editorialTranslationPrompt } from './prompts'
import { createHash } from 'crypto'
import { prisma } from '../db'

export interface TranslationRequest {
  sourceText: string
  sourceLocale: string
  targetLocale: string
  type: 'ui' | 'editorial'
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

function getProvider(): { provider: Provider; apiKey: string } | null {
  const key = process.env.TRANSLATION_API_KEY
  if (!key) return null
  const provider = (process.env.TRANSLATION_PROVIDER || 'anthropic') as Provider
  return { provider, apiKey: key }
}

async function callProvider(
  systemPrompt: string,
  userPrompt: string,
  provider: Provider,
  apiKey: string
): Promise<{ text: string; tokensIn?: number; tokensOut?: number }> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

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
          max_tokens: 2048,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        }),
        signal: controller.signal,
      })
      if (res.status === 429) throw new Error('rate_limited')
      if (!res.ok) throw new Error(`anthropic_${res.status}`)
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
          max_tokens: 2048,
          temperature: 0.1,
        }),
        signal: controller.signal,
      })
      if (res.status === 429) throw new Error('rate_limited')
      if (!res.ok) throw new Error(`openai_${res.status}`)
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
        riskFlags: JSON.parse(JSON.stringify(riskFlags)),
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

  const userPrompt =
    req.type === 'ui'
      ? uiTranslationPrompt(req.sourceText, req.sourceLocale, req.targetLocale)
      : editorialTranslationPrompt(req.sourceText, req.sourceLocale, req.targetLocale)

  const start = Date.now()
  const result = await callProvider(SYSTEM_PROMPT, userPrompt, config.provider, config.apiKey)
  const latencyMs = Date.now() - start

  if (!result.text) throw new Error('empty_translation')

  setCache(key, result.text)

  const outputHash = createHash('sha256').update(result.text).digest('hex').slice(0, 32)
  trackLlmRun(config.provider, req.sourceText, key, result.text, outputHash)

  return {
    translatedText: result.text,
    cached: false,
    provider: config.provider,
    meta: { tokensIn: result.tokensIn, tokensOut: result.tokensOut, latencyMs },
  }
}
