/**
 * LINK SHIELD — o modelo nunca mais vê uma URL.
 *
 * ── Por que isto existe ──────────────────────────────────────────────────────
 * O tradutor pedia ao modelo que fosse o AUTOR dos links (prompts.ts, regra 5:
 * "para cada ocorrência destes termos, use a substituição exata [Termo](/xx/glossary#id)").
 * Enquanto o modelo tem a caneta, ele produz quatro famílias de defeito, TODAS
 * silenciosas (o resultado parece válido e está errado, nenhum validador de formato pega):
 *
 *   1. CORRUPÇÃO DE TOKEN. Altera caracteres dentro da URL. Um token base64 do Google
 *      News teve "dU85" trocado por "dU81". O link continua com cara de válido e NÃO
 *      resolve. Só quebra quando o leitor clica. (9 URLs no Daily de 12/Jul.)
 *   2. SEQUESTRO DE LINK EXTERNO. Vê `[TSE](https://divulgacandcontas...)` e, obedecendo
 *      à regra 5, troca o destino por `/en/glossary#tse`. A fonte primária vira âncora
 *      interna e o leitor perde o documento oficial.
 *   3. LINK ANINHADO. Injeta glossário DENTRO de outro link. Markdown não suporta, o
 *      parser quebra no primeiro `]` e a URL vaza como texto.
 *   4. LINK DERRUBADO. Simplesmente some com o link.
 *
 * O prompt já tinha um aviso longo contra o item 3, e existia um `stripNestedGlossaryTags`
 * como remendo pós-resposta. Ou seja: a batalha já vinha sendo travada na SAÍDA do modelo,
 * e perdida. Prompt não resolve, porque o problema não é falta de instrução, é excesso de
 * poder: o modelo não deveria ter permissão de escrever uma URL.
 *
 * ── O que este módulo faz ────────────────────────────────────────────────────
 * ANTES da chamada: todo destino de link e toda URL nua viram tokens opacos (⟦U0⟧, ⟦U1⟧…).
 * O TEXTO da âncora continua visível, para o modelo traduzir com contexto e sem perder
 * fluência ("segundo a [CartaCapital](⟦U3⟧), ...").
 *
 * DEPOIS da chamada: os tokens são restaurados a partir do original. Com isso:
 *   - (1) e (2) ficam IMPOSSÍVEIS de passar despercebidos: a URL nunca esteve lá para ser
 *     corrompida, e se o modelo trocar o token por um link de glossário, o token SOME e
 *     nós detectamos com certeza e reparamos pela âncora.
 *   - (4) vira erro explícito em vez de perda silenciosa.
 *   - (3) segue tratado pelo strip de aninhamento, agora aplicado a todos os tipos.
 *
 * O modelo CONTINUA podendo criar links de glossário em texto puro (é o recurso desejado):
 * esses nascem com destino real (/xx/glossary#id), não com token, então são distinguíveis
 * de um sequestro.
 */

/** Um destino de link protegido do modelo. */
interface ShieldedLink {
  /** URL original, exatamente como no texto-fonte. */
  url: string
  /** Texto da âncora no original (vazio quando era URL nua). Usado no reparo. */
  anchor: string
}

export interface ShieldResult {
  masked: string
  links: ShieldedLink[]
}

export interface UnshieldReport {
  restored: number
  /** Tokens que o modelo destruiu e que reparamos pela âncora (sequestro de link). */
  repaired: Array<{ anchor: string; url: string; hijackedBy: string }>
  /** URLs que o modelo inventou (não existiam no original). */
  hallucinated: string[]
  /** Tokens perdidos que NÃO foi possível reparar. Se houver, a tradução é inválida. */
  unrecoverable: Array<{ anchor: string; url: string }>
}

const TOKEN = (i: number) => `⟦U${i}⟧`
// Restauração tolerante: o modelo às vezes insere espaço dentro do token.
const TOKEN_RE = /⟦\s*U\s*(\d+)\s*⟧/g
// Link markdown: [âncora](destino). Destino sem parêntese interno (URLs do projeto não têm).
const MD_LINK_RE = /\[([^\]]*)\]\(([^)]+)\)/g
const BARE_URL_RE = /https?:\/\/[^\s)\]<>"']+/g

/**
 * Substitui TODO destino de link e URL nua por tokens opacos.
 * O texto da âncora permanece visível e traduzível.
 */
export function shieldLinks(text: string): ShieldResult {
  const links: ShieldedLink[] = []

  // 1) destinos de links markdown
  let masked = text.replace(MD_LINK_RE, (full, anchor: string, target: string) => {
    // Já é um token (reentrância defensiva): não remascarar.
    if (TOKEN_RE.test(target)) { TOKEN_RE.lastIndex = 0; return full }
    TOKEN_RE.lastIndex = 0
    const i = links.length
    links.push({ url: target, anchor })
    return `[${anchor}](${TOKEN(i)})`
  })

  // 2) URLs nuas remanescentes (fora de link markdown)
  masked = masked.replace(BARE_URL_RE, (url) => {
    const i = links.length
    links.push({ url, anchor: '' })
    return TOKEN(i)
  })

  return { masked, links }
}

/** Normaliza âncora para comparação entre idiomas (TSE, Polymarket, STF são idênticos). */
const norm = (s: string) =>
  s.normalize('NFD').replace(/\p{M}/gu, '').replace(/[^\p{L}\p{N}]/gu, '').toLowerCase()

/**
 * Restaura os destinos originais e reporta toda tentativa de adulteração.
 * Nunca grava link inventado nem link perdido em silêncio.
 */
export function unshieldLinks(translated: string, links: ShieldedLink[]): { text: string; report: UnshieldReport } {
  const report: UnshieldReport = { restored: 0, repaired: [], hallucinated: [], unrecoverable: [] }

  // ⚠️ NÃO retornar cedo quando o original não tem links. O caso mais perigoso é
  // justamente esse: texto SEM link nenhum e o modelo inventando uma URL do nada.
  // (Peguei isso no teste 6 depois de escrever um early-return que pulava a checagem.)

  const seen = new Set<number>()

  // 1) restauração direta dos tokens sobreviventes
  let out = translated.replace(TOKEN_RE, (full, idx: string) => {
    const i = Number(idx)
    const link = links[i]
    if (!link) return full // token inventado pelo modelo: deixa visível para o gate pegar
    seen.add(i)
    report.restored++
    return link.url
  })

  // 2) tokens sumidos = o modelo destruiu o link (tipicamente sequestro para glossário)
  const perdidos = links.map((l, i) => ({ ...l, i })).filter((l) => !seen.has(l.i))

  for (const perdido of perdidos) {
    if (!perdido.anchor) { report.unrecoverable.push({ anchor: '(url nua)', url: perdido.url }); continue }

    // Procurar um link cuja âncora bate com a do original e cujo destino NÃO é nosso token.
    // É o padrão do sequestro: [TSE](⟦U3⟧) virou [TSE](/en/glossary#tse).
    let reparado = false
    out = out.replace(MD_LINK_RE, (full, anchor: string, target: string) => {
      if (reparado) return full
      if (target === perdido.url) { reparado = true; return full } // já está correto
      if (norm(anchor) !== norm(perdido.anchor)) return full
      // Âncora idêntica e destino diferente do original: sequestrado. Reverter.
      reparado = true
      report.repaired.push({ anchor: perdido.anchor, url: perdido.url, hijackedBy: target })
      return `[${anchor}](${perdido.url})`
    })

    if (!reparado) report.unrecoverable.push({ anchor: perdido.anchor, url: perdido.url })
  }

  // 3) URL inventada: o modelo não viu URL nenhuma, então qualquer http que ele tenha
  //    escrito e que não esteja no original é alucinação.
  const conhecidas = new Set(links.map((l) => l.url))
  for (const u of out.match(BARE_URL_RE) ?? []) {
    if (!conhecidas.has(u)) report.hallucinated.push(u)
  }

  return { text: out, report }
}

const GLOSSARY_TAG_RE = /\[([^[\]]+)\]\(\/(?:en|es|pt-BR)\/glossary#[^)]+\)/g

/**
 * Remove link de glossário ANINHADO dentro de outro link (markdown não suporta
 * aninhamento: o parser fecha no primeiro `]` e a URL vaza como texto).
 * Tags standalone (o recurso desejado) são preservadas.
 *
 * Conta `[` não fechados antes do match para saber se está dentro de outro link.
 * Contagem de profundidade, não regex: um regex ingênuo erra quando há MAIS DE UM
 * termo aninhado no mesmo link externo. (Algoritmo herdado do stripNestedGlossaryTags
 * original de translate.ts, que estava certo; só mudou de casa.)
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
    // depth > 0 → está dentro de outro link: manter só o texto do termo.
    result += depth > 0 ? match[1] : match[0]
    lastIdx = match.index + match[0].length
  }
  result += text.slice(lastIdx)
  return result
}
