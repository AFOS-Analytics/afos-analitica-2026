/**
 * Validação automática de tradução.
 *
 * Camada 1: Determinística (regex, contagem) — sempre roda
 * Camada 2: Semântica por IA (QA prompt) — opcional
 */

import { PROTECTED_TERMS, qaPrompt } from './prompts';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function safeMatch(text: string, re: RegExp): string[] {
  try { return text.match(re) ?? []; }
  catch { return []; }
}

export function validateTranslation(original: string, translated: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!translated || !translated.trim()) {
    errors.push('Tradução vazia');
    return { valid: false, errors, warnings };
  }

  if (!original || !original.trim()) {
    return { valid: true, errors, warnings };
  }

  // 1. Placeholders
  const origPH = safeMatch(original, /\{[^}]+\}/g);
  const transPH = safeMatch(translated, /\{[^}]+\}/g);
  for (const ph of origPH) {
    if (!transPH.includes(ph)) errors.push(`Placeholder ausente: ${ph}`);
  }

  // 2. Números
  const origNums = safeMatch(original, /\d+\.?\d*%?/g);
  const transNums = safeMatch(translated, /\d+\.?\d*%?/g);
  for (const num of origNums) {
    if (!transNums.includes(num)) warnings.push(`Número alterado: ${num}`);
  }

  // 3. URLs
  const origUrls = safeMatch(original, /https?:\/\/[^\s"')]+/g);
  const transUrls = safeMatch(translated, /https?:\/\/[^\s"')]+/g);
  for (const url of origUrls) {
    if (!transUrls.includes(url)) errors.push(`URL ausente: ${url}`);
  }

  // 4. Termos protegidos
  for (const term of PROTECTED_TERMS) {
    if (original.includes(term) && !translated.includes(term)) {
      errors.push(`Termo protegido traduzido: "${term}"`);
    }
  }

  // 5. HTML tags
  const origTags = safeMatch(original, /<[^>]+>/g);
  const transTags = safeMatch(translated, /<[^>]+>/g);
  if (origTags.length !== transTags.length) {
    errors.push(`Tags HTML: original ${origTags.length} vs tradução ${transTags.length}`);
  }

  // 6. Comprimento
  if (original.length > 0) {
    const ratio = translated.length / original.length;
    if (ratio < 0.3) errors.push(`Tradução muito curta (${Math.round(ratio * 100)}%)`);
    if (ratio > 3) warnings.push(`Tradução muito longa (${Math.round(ratio * 100)}%)`);
  }

  // 7. Caracteres de controle
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(translated)) {
    errors.push('Caracteres de controle inválidos');
  }

  return { valid: errors.length === 0, errors, warnings };
}

// ─── Validação semântica por IA (opcional) ──────────────────────────

export async function validateWithAI(
  original: string,
  translated: string,
  sourceLocale: string,
  targetLocale: string,
  callAI: (prompt: string) => Promise<string>
): Promise<{ pass: boolean; reason: string }> {
  try {
    const prompt = qaPrompt(original, translated, sourceLocale, targetLocale);
    const result = await callAI(prompt);
    const trimmed = result.trim();

    if (trimmed.toUpperCase().startsWith('PASS')) {
      return { pass: true, reason: 'QA passed' };
    }

    return { pass: false, reason: trimmed.replace(/^FAIL:\s*/i, '') || 'QA failed' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
    console.error(`[validate-ai] Erro: ${msg}`);
    // Erro na QA IA = não bloqueia, mas avisa
    return { pass: true, reason: `AI QA skipped: ${msg}` };
  }
}
