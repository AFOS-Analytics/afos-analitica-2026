/**
 * Validação automática de tradução.
 *
 * 2 camadas:
 *   1. Validação determinística (regex, contagem) — sempre roda
 *   2. Validação semântica por IA (QA prompt) — opcional, se provider disponível
 */

import { PROTECTED_TERMS, qaPrompt } from './prompts';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ─── Camada 1: Validação determinística ─────────────────────────────

export function validateTranslation(original: string, translated: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!translated || translated.trim().length === 0) {
    errors.push('Tradução vazia');
    return { valid: false, errors, warnings };
  }

  const m = (text: string, re: RegExp): string[] => text.match(re) ?? [];

  // 1. Placeholders preservados
  const originalPlaceholders = m(original, /\{[^}]+\}/g);
  const translatedPlaceholders = m(translated, /\{[^}]+\}/g);
  for (const ph of originalPlaceholders) {
    if (!translatedPlaceholders.includes(ph)) {
      errors.push(`Placeholder ausente: ${ph}`);
    }
  }

  // 2. Números preservados
  const originalNumbers = m(original, /\d+\.?\d*%?/g);
  const translatedNumbers = m(translated, /\d+\.?\d*%?/g);
  for (const num of originalNumbers) {
    if (!translatedNumbers.includes(num)) {
      warnings.push(`Número possivelmente alterado: ${num}`);
    }
  }

  // 3. URLs preservadas
  const urlRegex = /https?:\/\/[^\s"')]+/g;
  const originalUrls = m(original, urlRegex);
  const translatedUrls = m(translated, urlRegex);
  for (const url of originalUrls) {
    if (!translatedUrls.includes(url)) {
      errors.push(`URL ausente: ${url}`);
    }
  }

  // 4. Termos protegidos preservados
  for (const term of PROTECTED_TERMS) {
    if (original.includes(term) && !translated.includes(term)) {
      errors.push(`Termo protegido traduzido: "${term}"`);
    }
  }

  // 5. HTML tags preservadas
  const originalTags = original.match(/<[^>]+>/g) || [];
  const translatedTags = translated.match(/<[^>]+>/g) || [];
  if (originalTags.length !== translatedTags.length) {
    errors.push(`Tags HTML divergem: original ${originalTags.length}, tradução ${translatedTags.length}`);
  }

  // 6. Comprimento razoável (tradução não deve ser <30% ou >300% do original)
  const ratio = translated.length / original.length;
  if (ratio < 0.3) {
    errors.push(`Tradução muito curta (${Math.round(ratio * 100)}% do original)`);
  }
  if (ratio > 3) {
    warnings.push(`Tradução muito longa (${Math.round(ratio * 100)}% do original)`);
  }

  // 7. Caracteres inválidos (control chars exceto newline/tab)
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(translated)) {
    errors.push('Contém caracteres de controle inválidos');
  }

  return { valid: errors.length === 0, errors, warnings };
}

// ─── Camada 2: Validação semântica por IA (opcional) ────────────────

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
    const trimmed = result.trim().toUpperCase();

    if (trimmed === 'PASS' || trimmed.startsWith('PASS')) {
      return { pass: true, reason: 'QA passed' };
    }

    const reason = result.replace(/^FAIL:\s*/i, '').trim() || 'QA failed without reason';
    return { pass: false, reason };
  } catch (err) {
    console.error('[validate-ai] Erro na validação semântica:', err);
    return { pass: true, reason: 'AI QA skipped (error)' };
  }
}
