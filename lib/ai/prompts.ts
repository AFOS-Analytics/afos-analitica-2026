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

/**
 * Sanitiza texto do usuário para evitar prompt injection.
 * Escapa delimitadores que a IA pode interpretar como instruções.
 */
function sanitize(text: string): string {
  return text
    .replace(/```/g, '\'\'\'')
    .replace(/---/g, '—')
    .replace(/\n{3,}/g, '\n\n');
}

/** Prompt para tradução curta de UI (labels, botões, títulos) */
export function uiTranslationPrompt(sourceText: string, sourceLocale: string, targetLocale: string): string {
  return `Translate the following UI text from ${sourceLocale} to ${targetLocale}.
Keep it concise (similar length to original). Preserve capitalization pattern.
Return ONLY the translation, nothing else.

<source_text>
${sanitize(sourceText)}
</source_text>`;
}

/**
 * Prompt para tradução editorial longa (descrições, análises).
 *
 * `glossaryEntries` é OPCIONAL e o bloco de glossário só entra quando vem
 * preenchido. Isso é deliberado: /api/translations também usa type 'editorial'
 * para conteúdo avulso, e injetar link de glossário ali mudaria o resultado de
 * um consumidor que não pediu nada. Sem verbetes, o prompt é byte a byte o que
 * era antes de 25/Jul/2026.
 *
 * Quando vem preenchido (JSONs do dashboard), vale a mesma regra do AFOS Daily:
 * termo brasileiro sem tradução fica em português e vira link para o verbete.
 */
export function editorialTranslationPrompt(
  sourceText: string,
  sourceLocale: string,
  targetLocale: string,
  glossaryEntries: Array<{ term: string; id: string }> = []
): string {
  const glossario = glossaryEntries.length === 0 ? '' : `

**Brazilian glossary terms — KEEP IN PORTUGUESE and link to the glossary.** For each occurrence of these terms in plain text, use the exact replacement shown:
${glossaryEntries.map(g => `  - "${g.term}" → [${g.term}](/${targetLocale}/glossary#${g.id})`).join('\n')}
   - Do NOT translate the term itself. The reader gets the Portuguese word plus a link that explains it, which is the AFOS standard.
   - Link ONLY THE FIRST occurrence of each term in this text; leave later occurrences as plain Portuguese, unlinked. These strings render inside small dashboard cards, where repeating the same link three times in one paragraph buries the numbers the reader came for.
   - NEVER nest a glossary link inside another markdown link. Markdown does not support nested links and the output would break the parser.
   - Only the terms listed above. Do NOT invent glossary anchors for other words, and do NOT emit any other kind of URL.`;

  return `Translate the following editorial content from ${sourceLocale} to ${targetLocale}.
Maintain the analytical, institutional tone. Preserve all data points, numbers, percentages, and proper nouns exactly.
Return ONLY the translation, nothing else.${glossario}

<source_text>
${sanitize(sourceText)}
</source_text>`;
}

/** Prompt para tradução de AFOS Daily — preserva markdown + glossário brasileiro */
export function afosDailyTranslationPrompt(
  sourceText: string,
  sourceLocale: string,
  targetLocale: string,
  glossaryEntries: Array<{ term: string; id: string }>
): string {
  const glossaryRules = glossaryEntries
    .map(g => `  - "${g.term}" → [${g.term}](/${targetLocale}/glossary#${g.id})`)
    .join('\n')

  return `Translate the following AFOS Daily synthesis from ${sourceLocale} to ${targetLocale}.

CRITICAL RULES:

1. **Preserve markdown structure exactly** — headings (## ), inline links [text](url), bold (**text**), italic, blockquotes (>), bullet lists (1., 2., -), horizontal rules (---), and line breaks.

2. **Preserve all data points exactly** — numbers (38.50%), percentage variations (↑3.0pp, ↓1.55pp, +6.05pp), counts (n=5.000, n=10.700), times ("18:30 BRT", "07h38"). Never round or rephrase numbers.

3. **Convert dates to target locale conventions:**
   - English (en): "April 28", "April 27, 2026", "January 22"
   - Spanish (es): "28 de abril", "27 de abril de 2026", "22 de enero"
   - Source uses Brazilian conventions like "27/Abr", "22 de abril de 2026" — convert these.

4. **Link targets are OPAQUE TOKENS. Copy them verbatim.** Every link target in the input has been replaced by a token of the form ⟦U0⟧, ⟦U1⟧, ⟦U2⟧… You will NOT see any real URL. Rules, no exceptions:
   - Copy each token EXACTLY as-is, character for character: [texto](⟦U3⟧) becomes [translated text](⟦U3⟧).
   - NEVER replace a token with a URL, a path, or a glossary anchor. A token is not a placeholder to fill in; it is the final value.
   - NEVER delete a link that has a token. Every ⟦Un⟧ in the input must appear exactly once in your output.
   - NEVER write a URL yourself (no http://, no https://). If you emit a URL, the output is rejected.
   - Translate only the [text] portion.

5. **Brazilian glossary terms — KEEP IN PORTUGUESE and link to glossary.** Applies to terms with NO equivalent in the target language (centrão, pauta-bomba, pau-mandado). For "1º turno" and "2º turno", which DO have an equivalent, rule 9 wins: translate the label and keep the link. For each occurrence of these terms, use the exact replacement shown:
${glossaryRules}
   **CRITICAL — Apply ONLY to plain text occurrences (bare terms NOT inside any markdown link).** In particular, if a term already sits inside a link with a token target, such as [TSE](⟦U5⟧), LEAVE IT ALONE: do not swap ⟦U5⟧ for a glossary anchor. That link points to a primary source and the glossary anchor would destroy it. NEVER inject a glossary link inside an existing markdown link of the form [text](url), even if the glossary term appears in the link's [text] portion. Markdown does not support nested links — output like [outer text [Term](glossary-url)](outer-url) breaks the parser, exposing raw URLs to readers. If a glossary term appears anywhere inside an existing [...](...), leave it as plain text within that link. Examples:
   - Correct (term in plain text): "Lula nomeou ministro do STF" becomes "Lula nomeou ministro do [STF](/${targetLocale}/glossary#stf)".
   - Wrong (nested link in body): "[reabrindo a tensão entre STF e Congresso](https://example.com/article)" must NOT become "[reabrindo a tensão entre [STF](/en/glossary#stf) e Congresso](https://example.com/article)" — leave STF as plain text inside the existing link.
   - Wrong (nested link in source list/footer): "[O Globo — PL formaliza chapa](https://...)" must NOT become "[O Globo — [PL](/en/glossary#pl) formaliza chapa](https://...)" — same rule applies in source citation lists.

6. **Preserve proper names exactly:** Lula, Flávio Bolsonaro, Tarcísio de Freitas, Romeu Zema, Ronaldo Caiado, Renan Santos, Fernando Haddad, Ratinho Jr., Eduardo Paes, Cláudio Castro, Benedita da Silva, Sergio Moro, Cleitinho, André do Prado, Kassab, Ciro Nogueira, Alexandre de Moraes, Vorcaro, João Campos, Raquel Lyra, etc. Newspaper names (Folha de S.Paulo, Estadão, CNN Brasil, etc.) and outlet names (G1, SBT News, Valor Econômico, etc.) stay in original Portuguese.

7. **Brand terms NEVER translate:** "AFOS Daily", "AFOS Analytics", "Polymarket".

8. **Maintain observational tone.** NEVER add adjectives like "authoritarian", "corrupt", "savior", "radical", "extremist", "visionary". The source is intentionally non-partisan; the translation must preserve that neutrality.

9. **Convert Brazilian-specific labels, and KEEP the glossary link on the translated label:**
   - "1º turno" → "[first round](/${targetLocale}/glossary#primeiro-turno)"
   - "2º turno" → "[second round](/${targetLocale}/glossary#segundo-turno)" (en) / "[segunda vuelta](/${targetLocale}/glossary#segundo-turno)" (es)
   - These two terms are an EXCEPTION to rule 5: they DO have an equivalent in the target language, so the label is translated. The link stays, because it is what gives a foreign reader the context of the Brazilian two-round system. Never output "[1º turno](...)" with the Portuguese label.

10. **Section headings:** translate the descriptive part but keep the numbering. Example: "## 1. Mercado de previsão" → "## 1. Prediction market" (en) / "## 1. Mercado de predicción" (es).

Return ONLY the translated markdown. No explanations, no preamble, no code fences around the result.

<source_text>
${sanitize(sourceText)}
</source_text>`;
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
