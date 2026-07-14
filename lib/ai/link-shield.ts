/**
 * LINK SHIELD — o modelo nunca vê uma URL, nem a âncora de um link.
 *
 * ── Por que isto existe ──────────────────────────────────────────────────────
 * O tradutor pedia ao modelo que fosse o AUTOR dos links (prompts.ts, regra 5:
 * "para cada ocorrência destes termos, use [Termo](/xx/glossary#id)"). Enquanto o
 * modelo tem a caneta, ele produz defeitos SILENCIOSOS (o resultado parece válido e
 * está errado; nenhum validador de formato pega):
 *
 *   1. CORRUPÇÃO DE TOKEN. Altera caracteres dentro da URL (um token base64 do Google
 *      News teve "dU85" trocado por "dU81"). O link continua com cara de válido e NÃO
 *      resolve. Só quebra quando o leitor clica.
 *   2. SEQUESTRO. Vê [TSE](https://divulgacandcontas...) e troca o destino por
 *      /en/glossary#tse. A fonte primária vira âncora interna.
 *   3. ANINHAMENTO. Injeta glossário DENTRO de outro link. Markdown não suporta.
 *   4. DERRUBADA + ERRO FACTUAL. Este é o pior, e só apareceu quando o shield v1
 *      (que protegia só a URL) abortou uma tradução em 13/Jul/2026. Diagnóstico:
 *
 *        entrada : [2º lugar do 1º turno](⟦U0⟧)
 *        saída   : [2º turno](/en/glossary#segundo-turno) sub-market of
 *                  [1º turno](/en/glossary#primeiro-turno)
 *
 *      A ÂNCORA continha termos do glossário. O modelo aplicou a regra 5 DENTRO dela,
 *      destruiu o link externo e, de quebra, trocou "2º lugar" (segunda colocação) por
 *      "2º turno" (returno). Erro FACTUAL, não só link quebrado.
 *
 * ── Conclusão de arquitetura ─────────────────────────────────────────────────
 * Proteger só a URL não basta: enquanto a ÂNCORA for prosa visível, a regra de
 * glossário briga com o nosso link. O link inteiro precisa ser opaco.
 *
 * ANTES da chamada: cada link vira UM token (⟦L0⟧, ⟦L1⟧…). O modelo traduz a prosa ao
 * redor e não tem como tocar em nada do link.
 * DEPOIS: as âncoras são traduzidas numa passada PRÓPRIA, sem regra de glossário, e o
 * link é remontado com a URL original. Token que sumir ABORTA: melhor falhar alto do
 * que publicar link morto ou fato errado.
 *
 * O glossário em TEXTO PURO continua funcionando: é o recurso desejado e não colide
 * com nada, porque ali não há link a destruir.
 */

interface ShieldedLink {
  /** URL original, exatamente como no texto-fonte. */
  url: string
  /** Texto da âncora no original. Vazio quando era URL nua. */
  anchor: string
}

export interface ShieldResult {
  masked: string
  links: ShieldedLink[]
}

export interface UnshieldReport {
  restored: number
  /** URLs que o modelo inventou (ele não viu URL nenhuma). */
  hallucinated: string[]
  /** Tokens que o modelo destruiu. Se houver, a tradução é inválida. */
  lost: Array<{ anchor: string; url: string }>
}

const TOKEN = (i: number) => `⟦L${i}⟧`
/** Restauração tolerante: o modelo às vezes insere espaço dentro do token. */
const TOKEN_RE = /⟦\s*L\s*(\d+)\s*⟧/g
const MD_LINK_RE = /\[([^\]]*)\]\(([^)]+)\)/g
const BARE_URL_RE = /https?:\/\/[^\s)\]<>"']+/g

/** Substitui CADA LINK INTEIRO (âncora + destino) por um token opaco. */
export function shieldLinks(text: string): ShieldResult {
  const links: ShieldedLink[] = []

  let masked = text.replace(MD_LINK_RE, (_full, anchor: string, target: string) => {
    const i = links.length
    links.push({ url: target, anchor })
    return TOKEN(i)
  })

  // URLs nuas remanescentes (fora de link markdown)
  masked = masked.replace(BARE_URL_RE, (url) => {
    const i = links.length
    links.push({ url, anchor: '' })
    return TOKEN(i)
  })

  return { masked, links }
}

/**
 * Remonta os links com as âncoras traduzidas e as URLs ORIGINAIS.
 * `translatedAnchors` é paralelo a `links`; entrada vazia ou ausente cai na âncora original.
 */
export function unshieldLinks(
  translated: string,
  links: ShieldedLink[],
  translatedAnchors: string[] = [],
): { text: string; report: UnshieldReport } {
  const report: UnshieldReport = { restored: 0, hallucinated: [], lost: [] }

  const seen = new Set<number>()
  const out = translated.replace(TOKEN_RE, (full, idx: string) => {
    const i = Number(idx)
    const link = links[i]
    if (!link) return full // token inventado: cai no gate de perdidos/alucinação
    seen.add(i)
    report.restored++
    if (!link.anchor) return link.url // era URL nua
    const anchor = (translatedAnchors[i] || '').trim() || link.anchor
    return `[${anchor}](${link.url})`
  })

  // Token que sumiu = o modelo destruiu o link. Sem ambiguidade, sem reparo heurístico.
  links.forEach((l, i) => {
    if (!seen.has(i)) report.lost.push({ anchor: l.anchor || '(url nua)', url: l.url })
  })

  // O modelo não viu URL nenhuma: qualquer http na saída que não seja nossa é invenção.
  const conhecidas = new Set(links.map((l) => l.url))
  for (const u of out.match(BARE_URL_RE) ?? []) {
    if (!conhecidas.has(u)) report.hallucinated.push(u)
  }

  return { text: out, report }
}

const GLOSSARY_TAG_RE = /\[([^[\]]+)\]\(\/(?:en|es|pt-BR)\/glossary#[^)]+\)/g

/**
 * Remove link de glossário ANINHADO dentro de outro link (markdown não suporta:
 * o parser fecha no primeiro `]` e a URL vaza como texto). Tags standalone ficam.
 *
 * Contagem de profundidade, não regex: um regex ingênuo erra quando há MAIS DE UM
 * termo aninhado no mesmo link externo.
 */
export function stripNestedGlossaryLinks(text: string): string {
  let result = ''
  let lastIdx = 0
  let match: RegExpExecArray | null
  GLOSSARY_TAG_RE.lastIndex = 0
  while ((match = GLOSSARY_TAG_RE.exec(text)) !== null) {
    const before = text.slice(0, match.index)
    let depth = 0
    for (let i = 0; i < before.length; i++) {
      if (before[i] === '[') depth++
      else if (before[i] === ']' && depth > 0) depth--
    }
    result += text.slice(lastIdx, match.index)
    result += depth > 0 ? match[1] : match[0]
    lastIdx = match.index + match[0].length
  }
  result += text.slice(lastIdx)
  return result
}

/**
 * Prompt da passada dedicada de tradução de âncoras.
 * SEM regra de glossário, SEM markdown: só o texto do rótulo. É isso que impede o
 * modelo de transformar "2º lugar do 1º turno" em dois links de glossário e, de quebra,
 * em "2º turno".
 */
export function anchorTranslationPrompt(anchors: string[], targetLocale: string): string {
  const lang = targetLocale === 'es' ? 'Spanish (es)' : 'English (en)'
  const numbered = anchors.map((a, i) => `${i + 1}. ${a}`).join('\n')
  return `Translate each link label below from Brazilian Portuguese to ${lang}.

RULES, no exceptions:
- Output EXACTLY ${anchors.length} lines, numbered "1." to "${anchors.length}.", in the same order. Nothing else.
- Translate LITERALLY and PRECISELY. These are link labels; a wrong word breaks a factual claim.
  Critical: "2º lugar" means SECOND PLACE (ranking), NOT "2º turno" (runoff). Never swap them.
- Keep proper nouns in Portuguese: person names, party names, outlet names (Folha de S.Paulo, O Globo,
  G1, VEJA, Poder360, Estadão), institution names (TSE, STF, Polymarket), institute names.
- NEVER output markdown, brackets, parentheses with URLs, or glossary links. Plain text only.
- If a label is a news headline, translate it as a headline.

Labels:
${numbered}`
}
