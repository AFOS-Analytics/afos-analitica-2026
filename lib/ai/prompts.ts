/**
 * Prompts internos do pipeline de tradução.
 *
 * Regras aplicadas em todos os prompts:
 * - Neutralidade política absoluta
 * - Zero alucinação (não inventar dados)
 * - Preservar semântica, não traduzir literalmente
 * - Manter termos de marca inalterados
 * - Preservar placeholders, números, odds, URLs
 */

/** Termos que NUNCA devem ser traduzidos */
export const PROTECTED_TERMS = [
  'AFOS Analytics', 'Polymarket', 'Dashboard', 'Open Source',
  'STF', 'INSS', 'TSE', 'PL', 'PT', 'PSD', 'MDB',
  'Lula', 'Flávio Bolsonaro', 'Renan Santos', 'Caiado', 'Haddad',
  'Datafolha', 'AtlasIntel', 'Quaest', 'Paraná Pesquisas',
  'Google News', 'Firecrawl',
];

/** System prompt para o tradutor */
export const SYSTEM_PROMPT = `You are a professional translator for AFOS Analytics, a global election intelligence platform.

RULES:
1. Translate accurately. Never add, remove, or alter meaning.
2. Never translate brand terms: ${PROTECTED_TERMS.slice(0, 10).join(', ')}, and other proper nouns.
3. Preserve ALL placeholders like {name}, {count}, {{variable}}.
4. Preserve ALL numbers, percentages, odds, dates, and URLs exactly as they appear.
5. Preserve ALL HTML tags and Markdown formatting.
6. Maintain political neutrality. Never add editorial commentary.
7. Use formal but accessible tone. Institutional, analytical, not academic.
8. If a term has no direct equivalent, keep the original in italics or parentheses.
9. Never hallucinate. If you are unsure, keep the original text.
10. Return ONLY the translated text. No explanations, no notes.`;

/** Prompt para tradução curta de UI (labels, botões, títulos) */
export function uiTranslationPrompt(sourceText: string, sourceLocale: string, targetLocale: string): string {
  return `Translate this UI text from ${sourceLocale} to ${targetLocale}.
Keep it concise (similar length to original). Preserve capitalization pattern.

Text: "${sourceText}"`;
}

/** Prompt para tradução editorial longa (descrições, análises) */
export function editorialTranslationPrompt(sourceText: string, sourceLocale: string, targetLocale: string): string {
  return `Translate this editorial content from ${sourceLocale} to ${targetLocale}.
Maintain the analytical, institutional tone. Preserve all data points, numbers, percentages, and proper nouns exactly.

Text:
${sourceText}`;
}

/** Prompt para QA de tradução (validação semântica) */
export function qaPrompt(originalText: string, translatedText: string, sourceLocale: string, targetLocale: string): string {
  return `Compare these two texts and answer ONLY "PASS" or "FAIL: [reason]".

Check:
1. Same meaning preserved?
2. All numbers, percentages, and dates identical?
3. All brand terms (AFOS Analytics, Polymarket, etc.) unchanged?
4. No added or removed information?
5. Appropriate ${targetLocale} grammar and spelling?
6. All placeholders preserved?

Original (${sourceLocale}):
${originalText}

Translation (${targetLocale}):
${translatedText}`;
}
