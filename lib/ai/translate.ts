/**
 * Módulo de tradução assistida por IA.
 *
 * Abstrai o provider (OpenAI, Claude, etc.) atrás de uma interface única.
 * Env var: TRANSLATION_API_KEY (provider configurado via TRANSLATION_PROVIDER)
 *
 * Fluxo:
 *   texto original → tradução IA → validação automática → cache → retorno
 */

import { SYSTEM_PROMPT, uiTranslationPrompt, editorialTranslationPrompt } from './prompts';

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

// ─── Cache por hash ─────────────────────────────────────────────────

function hashKey(req: TranslationRequest): string {
  const raw = `${req.sourceLocale}:${req.targetLocale}:${req.type}:${req.sourceText}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash + raw.charCodeAt(i)) | 0;
  }
  return `tr:${hash.toString(36)}`;
}

const cache = new Map<string, { text: string; at: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

function getCached(key: string): string | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.at > CACHE_TTL_MS) { cache.delete(key); return null; }
  return entry.text;
}

function setCache(key: string, text: string): void {
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
    });
    if (!res.ok) throw new Error(`Anthropic API ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.content?.[0]?.text?.trim() || '';
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
    });
    if (!res.ok) throw new Error(`OpenAI API ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || '';
  }

  throw new Error(`Provider desconhecido: ${provider}`);
}

// ─── Public API ─────────────────────────────────────────────────────

export async function translate(req: TranslationRequest): Promise<TranslationResult> {
  // 1. Check cache
  const key = hashKey(req);
  const cached = getCached(key);
  if (cached) {
    return { translatedText: cached, cached: true, provider: 'cache' };
  }

  // 2. Get provider
  const config = getProvider();
  if (!config) {
    console.error('[translate] TRANSLATION_API_KEY não configurada');
    throw new Error('translation_not_configured');
  }

  // 3. Build prompt
  const userPrompt = req.type === 'ui'
    ? uiTranslationPrompt(req.sourceText, req.sourceLocale, req.targetLocale)
    : editorialTranslationPrompt(req.sourceText, req.sourceLocale, req.targetLocale);

  // 4. Call provider
  const translatedText = await callProvider(SYSTEM_PROMPT, userPrompt, config.provider, config.apiKey);

  if (!translatedText) {
    throw new Error('empty_translation');
  }

  // 5. Cache result
  setCache(key, translatedText);

  return { translatedText, cached: false, provider: config.provider };
}
