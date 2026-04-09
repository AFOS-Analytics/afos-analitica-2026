/**
 * Módulo de tradução assistida por IA.
 *
 * Provider: Anthropic (default) ou OpenAI.
 * Cache: in-memory com TTL 24h e limite de 500 entradas (LRU).
 */

import { SYSTEM_PROMPT, uiTranslationPrompt, editorialTranslationPrompt } from './prompts';
import { createHash } from 'crypto';

export interface TranslationRequest {
  sourceText: string;
  sourceLocale: string;
  targetLocale: string;
  type: 'ui' | 'editorial';
}

export interface TranslationResult {
  translatedText: string;
  cached: boolean;
  provider: string;
}

// ─── Cache com TTL + limite LRU ─────────────────────────────────────

const MAX_CACHE_SIZE = 500;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function hashKey(req: TranslationRequest): string {
  const raw = `${req.sourceLocale}:${req.targetLocale}:${req.type}:${req.sourceText}`;
  return 'tr:' + createHash('sha256').update(raw).digest('hex').slice(0, 16);
}

const cache = new Map<string, { text: string; at: number }>();

function getCached(key: string): string | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.at > CACHE_TTL_MS) { cache.delete(key); return null; }
  return entry.text;
}

function setCache(key: string, text: string): void {
  // LRU: se atingiu limite, remove a entrada mais antiga
  if (cache.size >= MAX_CACHE_SIZE) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
  cache.set(key, { text, at: Date.now() });
}

// ─── Provider abstraction ───────────────────────────────────────────

type Provider = 'anthropic' | 'openai';

function getProvider(): { provider: Provider; apiKey: string } | null {
  const key = process.env.TRANSLATION_API_KEY;
  if (!key) return null;
  const provider = (process.env.TRANSLATION_PROVIDER || 'anthropic') as Provider;
  return { provider, apiKey: key };
}

async function callProvider(systemPrompt: string, userPrompt: string, provider: Provider, apiKey: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

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
      });
      if (res.status === 429) throw new Error('rate_limited');
      if (!res.ok) throw new Error(`anthropic_${res.status}`);
      const data = await res.json();
      return (data.content?.[0]?.text || '').trim();
    }

    if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
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
      });
      if (res.status === 429) throw new Error('rate_limited');
      if (!res.ok) throw new Error(`openai_${res.status}`);
      const data = await res.json();
      return (data.choices?.[0]?.message?.content || '').trim();
    }

    throw new Error(`unknown_provider: ${provider}`);
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Public API ─────────────────────────────────────────────────────

export async function translate(req: TranslationRequest): Promise<TranslationResult> {
  const key = hashKey(req);
  const cached = getCached(key);
  if (cached) {
    return { translatedText: cached, cached: true, provider: 'cache' };
  }

  const config = getProvider();
  if (!config) throw new Error('translation_not_configured');

  const userPrompt = req.type === 'ui'
    ? uiTranslationPrompt(req.sourceText, req.sourceLocale, req.targetLocale)
    : editorialTranslationPrompt(req.sourceText, req.sourceLocale, req.targetLocale);

  const translatedText = await callProvider(SYSTEM_PROMPT, userPrompt, config.provider, config.apiKey);

  if (!translatedText || !translatedText.trim()) {
    throw new Error('empty_translation');
  }

  setCache(key, translatedText);
  return { translatedText, cached: false, provider: config.provider };
}
