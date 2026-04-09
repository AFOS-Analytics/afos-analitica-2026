/**
 * API Route: POST /api/translations
 *
 * Pipeline de tradução assistida por IA.
 *
 * Fluxo:
 *   1. Validar input + autenticação
 *   2. Traduzir via IA (cache-first)
 *   3. Validar tradução (determinística + IA opcional)
 *   4. Retornar resultado (ou fallback para última versão aprovada)
 *
 * Auth: Bearer token via TRANSLATION_AUTH_TOKEN
 * Provider: TRANSLATION_API_KEY + TRANSLATION_PROVIDER (anthropic|openai)
 */

import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { isValidLocale } from '../../../lib/i18n/config';
import { translate } from '../../../lib/ai/translate';
import { validateTranslation } from '../../../lib/ai/validate-translation';

const MAX_TEXT_LENGTH = 10_000;
const approvedCache = new Map<string, string>();

function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch { return false; }
}

export async function POST(request: Request) {
  // ─── 1. Autenticação (timing-safe) ────────────────────────────
  const authToken = process.env.TRANSLATION_AUTH_TOKEN;
  if (!authToken) {
    console.error('[translations] TRANSLATION_AUTH_TOKEN não configurado');
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }

  const authHeader = request.headers.get('authorization') || '';
  const expected = `Bearer ${authToken}`;
  if (!safeCompare(authHeader, expected)) {
    console.warn('[translations] Tentativa não autorizada');
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // ─── 2. Validar input ───────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const sourceText = typeof body.sourceText === 'string' ? body.sourceText.trim() : '';
  const sourceLocale = typeof body.sourceLocale === 'string' ? body.sourceLocale : '';
  const targetLocale = typeof body.targetLocale === 'string' ? body.targetLocale : '';
  const namespace = typeof body.namespace === 'string' ? body.namespace : 'common';
  const contentKey = typeof body.contentKey === 'string' ? body.contentKey : '';
  const type = body.type === 'editorial' ? 'editorial' as const : 'ui' as const;

  if (!sourceText) {
    return NextResponse.json({ error: 'sourceText required' }, { status: 400 });
  }
  if (sourceText.length > MAX_TEXT_LENGTH) {
    return NextResponse.json({ error: `text exceeds ${MAX_TEXT_LENGTH} chars` }, { status: 400 });
  }
  if (!isValidLocale(sourceLocale)) {
    console.warn(`[translations] Locale inválido: ${sourceLocale}`);
    return NextResponse.json({ error: 'invalid sourceLocale' }, { status: 400 });
  }
  if (!isValidLocale(targetLocale)) {
    console.warn(`[translations] Locale inválido: ${targetLocale}`);
    return NextResponse.json({ error: 'invalid targetLocale' }, { status: 400 });
  }
  if (sourceLocale === targetLocale) {
    return NextResponse.json({ error: 'source and target are the same' }, { status: 400 });
  }

  const fallbackKey = `${sourceLocale}:${targetLocale}:${contentKey || sourceText.slice(0, 50)}`;

  // ─── 3. Traduzir ───────────────────────────────────────────────
  let result;
  try {
    result = await translate({ sourceText, sourceLocale, targetLocale, type });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
    console.error(`[translations] Tradução falhou: ${msg}`);

    // Fallback para última versão aprovada
    const fallback = approvedCache.get(fallbackKey);
    if (fallback) {
      console.log('[translations] Usando fallback aprovado');
      return NextResponse.json({
        translatedText: fallback,
        cached: true,
        fallback: true,
        provider: 'fallback',
        validation: { valid: true, errors: [], warnings: ['Usando tradução anterior aprovada'] },
      });
    }

    return NextResponse.json({ error: 'translation_failed', detail: msg }, { status: 502 });
  }

  // ─── 4. Validar ────────────────────────────────────────────────
  const validation = validateTranslation(sourceText, result.translatedText);

  if (validation.warnings.length > 0) {
    console.warn(`[translations] Warnings:`, validation.warnings);
  }

  if (!validation.valid) {
    console.warn(`[translations] Validação falhou:`, validation.errors);

    // Fallback
    const fallback = approvedCache.get(fallbackKey);
    if (fallback) {
      return NextResponse.json({
        translatedText: fallback,
        cached: true,
        fallback: true,
        provider: 'fallback',
        validation: {
          ...validation,
          warnings: [...validation.warnings, 'Tradução nova rejeitada, usando anterior aprovada'],
        },
      });
    }

    return NextResponse.json({
      error: 'validation_failed',
      validation,
      translatedText: result.translatedText,
    }, { status: 422 });
  }

  // ─── 5. Aprovar e cachear ──────────────────────────────────────
  approvedCache.set(fallbackKey, result.translatedText);

  console.log(`[translations] Sucesso: ${sourceLocale}→${targetLocale} [${type}] ${result.cached ? 'cache' : result.provider} (${namespace}${contentKey ? ':' + contentKey : ''})`);

  return NextResponse.json({
    translatedText: result.translatedText,
    cached: result.cached,
    fallback: false,
    provider: result.provider,
    validation,
  });
}
