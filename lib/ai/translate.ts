/**
 * Módulo de tradução assistida por IA.
 *
 * Provider: Anthropic (default) ou OpenAI.
 * Cache: Neon ai.translations (persistente, sobrevive redeploy).
 * Fallback: in-memory se Neon indisponível.
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

// ─── In-memory fallback (se Neon indisponível) — LRU 500 ──────────

const MEM_CACHE_LIMIT = 500
const memCache = new Map<string, string>()

// ─── Cache: Neon first, in-memory fallback ─────────────────────────

async function getCached(hash: string, targetLocale: string): Promise<string | null> {
  // Neon
  try {
    const record = await prisma?.translation.findUnique({
      where: { sourceHash_targetLocale: { sourceHash: hash, targetLocale } },
      select: { translatedText: true },
    })
    if (record) return record.translatedText
  } catch {}

  // In-memory fallback
  return memCache.get(`${hash}:${targetLocale}`) ?? null
}

async function setCache(
  hash: string,
  req: TranslationRequest,
  translatedText: string,
  provider: string
): Promise<void> {
  const key = `${hash}:${req.targetLocale}`
  if (memCache.size >= MEM_CACHE_LIMIT) {
    const oldest = memCache.keys().next().value
    if (oldest) memCache.delete(oldest)
  }
  memCache.set(key, translatedText)

  // Neon (fire-and-forget)
  try {
    await prisma?.translation.upsert({
      where: { sourceHash_targetLocale: { sourceHash: hash, targetLocale: req.targetLocale } },
      update: { translatedText, provider },
      create: {
        sourceHash: hash,
        sourceLocale: req.sourceLocale,
        targetLocale: req.targetLocale,
        sourceText: req.sourceText.slice(0, 5000),
        translatedText,
        provider,
      },
    })
  } catch {}
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

// ─── Public API ────────────────────────────────────────────────────

export async function translate(req: TranslationRequest): Promise<TranslationResult> {
  const hash = hashKey(req)

  const cached = await getCached(hash, req.targetLocale)
  if (cached) {
    return { translatedText: cached, cached: true, provider: 'cache' }
  }

  const config = getProvider()
  if (!config) throw new Error('translation_not_configured')

  const userPrompt =
    req.type === 'ui'
      ? uiTranslationPrompt(req.sourceText, req.sourceLocale, req.targetLocale)
      : editorialTranslationPrompt(req.sourceText, req.sourceLocale, req.targetLocale)

  const start = Date.now()
  const result = await callProvider(SYSTEM_PROMPT, userPrompt, config.provider, config.apiKey)
  const latencyMs = Date.now() - start

  if (!result.text) throw new Error('empty_translation')

  await setCache(hash, req, result.text, config.provider)

  return {
    translatedText: result.text,
    cached: false,
    provider: config.provider,
    meta: { tokensIn: result.tokensIn, tokensOut: result.tokensOut, latencyMs },
  }
}
