/**
 * AFOS Daily — Validador de URLs e qualidade de fontes.
 * Bloqueia Write se URLs proibidas; emite warnings para sinais de qualidade.
 *
 *  - error: bloqueia Write (irrecuperável sem ação humana)
 *  - warning: relata mas não bloqueia
 */

export type ViolationSeverity = 'error' | 'warning'

export interface Violation {
  severity: ViolationSeverity
  rule: string
  detail: string
}

const MARKDOWN_LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g
const FOOTER_SOURCES_RE = /\*\*(?:Fontes citadas|Sources cited|Cited sources|Fuentes citadas):?\*\*[^\n]*/i
const PARAGRAPH_BREAK_RE = /\n\n+/
const SOURCES_BULLET_RE = /^- \[/
const HR_OR_HEADING_RE = /^(?:#{1,6}\s|[-*_]{3,}$)/
// Rótulo estrutural do rodapé, do tipo "**matérias secundárias (...):**". É legenda
// de subseção, não prosa, e não pode carregar link por definição. Em pt-BR ele tem
// 78 caracteres e escapava do corte de 80; em EN e ES passa de 80 e era contado como
// parágrafo sem fonte, rebaixando a densidade dos dois idiomas em toda daily.
const BOLD_LABEL_RE = /^\*\*[^*\n]+:\*\*$/

function extractAllLinks(body: string): { text: string; url: string }[] {
  return Array.from(body.matchAll(MARKDOWN_LINK_RE), (m) => ({ text: m[1], url: m[2] }))
}

function isInternalUrl(url: string): boolean {
  if (!/^https?:/.test(url)) return true
  return /^https?:\/\/(?:www\.)?afos-analytics\.(?:com|one|info|news|xyz)/.test(url)
}

function isBareHomepage(url: string): boolean {
  if (isInternalUrl(url)) return false
  const m = url.match(/^https?:\/\/([^/]+)\/?$/)
  if (!m) return false
  const host = m[1].toLowerCase()
  // news.* (agregadores como news.google.com) e api.* têm regras próprias
  return !host.startsWith('news.') && !host.startsWith('api.')
}

function isAllowedPolymarketUrl(url: string): boolean {
  return (
    /^https?:\/\/(?:www\.)?polymarket\.com\/event\//.test(url) ||
    /^https?:\/\/news\.google\.com/.test(url)
  )
}

// Regra editorial template 22/Abr: cada parágrafo substantivo (>=80 chars,
// não-heading, não-hr, não-bullet) deveria ter >=1 link externo inline.
function countParagraphsAndLinks(body: string): { substantialParagraphs: number; paragraphsWithLink: number } {
  let substantial = 0
  let withLink = 0
  for (const block of body.split(PARAGRAPH_BREAK_RE)) {
    const trimmed = block.trim()
    if (trimmed.length < 80) continue
    if (HR_OR_HEADING_RE.test(trimmed)) continue
    if (SOURCES_BULLET_RE.test(trimmed)) continue
    if (BOLD_LABEL_RE.test(trimmed)) continue
    substantial++
    const hasExternal = extractAllLinks(trimmed).some((l) => !isInternalUrl(l.url))
    if (hasExternal) withLink++
  }
  return { substantialParagraphs: substantial, paragraphsWithLink: withLink }
}

export function validateBody(body: string, locale?: string): Violation[] {
  const violations: Violation[] = []
  const allLinks = extractAllLinks(body)

  // E0. SEPARADOR DECIMAL coerente com o idioma.
  //
  // 🔴 A ficha de memória do travessão já avisava que a coluna "Conf." do
  // calendário "já escapou uma vez". Ela escapou DE NOVO em 04/Set/2026: o
  // pt-BR saiu com `| 0.7 |` onde a véspera usava `| 0,7 |`, e a minha
  // varredura à mão não pegou porque só olhava decimal de DUAS casas, e a
  // confiança tem UMA. Checagem ad hoc herda o vão de quem a escreveu.
  //
  // ⚠️ Só roda no CORPO, fora do bloco de fontes: título de matéria em
  // português dentro de um arquivo em inglês daria falso positivo em toda daily.
  // E ignora o que estiver colado em mais dígitos, para não pegar milhar.
  if (locale) {
    const corpo = body.split(/^## Fontes consultadas/m)[0]
    const errado =
      locale === 'en'
        ? corpo.match(/(?<![\d,])\d+,\d{1,2}(?![\d])/g) // vírgula decimal no inglês
        : corpo.match(/(?<![\d.])\d+\.\d{1,2}(?![\d])/g) // ponto decimal no pt-BR e no es
    if (errado && errado.length > 0) {
      const esperado = locale === 'en' ? 'ponto' : 'vírgula'
      violations.push({
        severity: 'error',
        rule: 'decimal-separator-mismatch',
        detail:
          `${errado.length} número(s) com separador decimal errado para o locale ${locale}, que usa ${esperado}: ` +
          `${Array.from(new Set(errado)).slice(0, 6).join(', ')}. ` +
          `Conferir inclusive a coluna "Conf." do calendário, que é onde isto escapa.`,
      })
    }
  }

  // ====== ERRORS (bloqueiam Write) ======

  // E1. URL gamma-api.polymarket.com (URL de API, não interface humana)
  for (const { url } of allLinks) {
    if (/^https?:\/\/gamma-api\.polymarket\.com/.test(url)) {
      violations.push({
        severity: 'error',
        rule: 'forbidden-gamma-api-url',
        detail: `gamma-api.polymarket.com é URL de API REST, não interface humana. Use polymarket.com/event/{slug}. URL: ${url}`,
      })
    }
  }

  // E2. Linha "Fontes citadas" no rodapé contém markdown links
  // (template renderiza data.sources como texto plano — markdown vira texto literal)
  const footerMatch = body.match(FOOTER_SOURCES_RE)
  if (footerMatch) {
    const footerLine = footerMatch[0]
    if (/\[[^\]]+\]\(https?:\/\/[^)]+\)/.test(footerLine)) {
      violations.push({
        severity: 'error',
        rule: 'sources-footer-has-markdown',
        detail: 'A linha "Fontes citadas:" contém markdown [Texto](URL) que aparece como texto literal no template (renderizado como plain). Use texto plano separado por vírgulas.',
      })
    }
  }

  // E3. Template placeholders {{var}} unfilled (incidente daily 18/Mai)
  // {{algo}} dentro de markdown link gera URL inválida que renderiza como 404 relativo
  const placeholderMatches = body.match(/\{\{[^}]+\}\}/g)
  if (placeholderMatches) {
    const unique = Array.from(new Set(placeholderMatches))
    violations.push({
      severity: 'error',
      rule: 'unfilled-template-placeholder',
      detail: `${placeholderMatches.length} placeholder(s) {{var}} não preenchido(s): ${unique.join(', ')}. Substituir por URL real ou remover o link/bullet inteiro.`,
    })
  }

  // E3.5. TRAVESSÃO ZERO na peça, ordem do André em 04/Set/2026: "todos os
  // textos sem travessões anti-ia".
  //
  // 🔴 POR QUE ISTO É PORTÃO E NÃO LEMBRETE. A régua já existia desde 21/Jun e
  // a ficha de memória já nomeava os TRÊS pontos em que o template reintroduz o
  // travessão: o `title` do frontmatter, a coluna "Conf." do calendário e os
  // rótulos `[Veículo — Título]` do rodapé. A prescrição era "rodar um strip
  // antes de publicar", ou seja, um passo manual lembrado. Ele reincidiu em
  // 04/Set com 20 travessões na peça, e NENHUM era prosa: os 20 vinham do
  // template. Prescrição que depende de lembrar não roda.
  //
  // ⚠️ Confere o arquivo INTEIRO, frontmatter incluído, porque o `title` é
  // justamente uma das três posições e ele vive no frontmatter.
  const travessoes = body.match(/[—–]/g)
  if (travessoes) {
    const linhas = body
      .split('\n')
      .map((l, i) => [i + 1, l] as const)
      .filter(([, l]) => /[—–]/.test(l))
      .slice(0, 5)
      .map(([n, l]) => `linha ${n}: ${l.trim().slice(0, 70)}`)
    violations.push({
      severity: 'error',
      rule: 'em-dash-forbidden',
      detail:
        `${travessoes.length} travessão(ões) na peça. Ordem do André: nenhum texto do produto leva travessão. ` +
        `Usar o ponto do meio (·) como separador, ou vírgula. Primeiras ocorrências: ${linhas.join(' | ')}`,
    })
  }

  // E4. Seções obrigatórias do template — todas devem aparecer com ^## N. heading
  // Template aprovado 22/Abr exige Seções 1-4 numeradas
  const requiredSections = [
    { re: /^## 1\. /m, label: '## 1. Mercado de previsão / Prediction market / Mercado de predicción' },
    { re: /^## 2\. /m, label: '## 2. O que os institutos / What the polling institutes / Lo que registraron los institutos' },
    { re: /^## 3\. /m, label: '## 3. O que a imprensa cobriu / What the press covered / Lo que la prensa cubrió' },
    { re: /^## 4\. /m, label: '## 4. Divergências do dia / Day\'s divergences / Divergencias del día' },
  ]
  for (const { re, label } of requiredSections) {
    if (!re.test(body)) {
      violations.push({
        severity: 'error',
        rule: 'missing-required-section',
        detail: `Seção obrigatória ausente: ${label}. Headers concatenados sem newline anterior também caem nesta regra (^## com 'm' exige começo de linha).`,
      })
    }
  }

  // ====== WARNINGS (relatam mas não bloqueiam) ======

  // W1. Razão de homepages bare em links externos. Threshold 30% calibrado
  // empiricamente — ajustar se passar a falsar dailies de qualidade conhecida.
  const externalLinks = allLinks.filter((l) => !isInternalUrl(l.url))
  const homepageCount = externalLinks.filter((l) => isBareHomepage(l.url)).length
  if (externalLinks.length >= 10 && homepageCount / externalLinks.length > 0.3) {
    violations.push({
      severity: 'warning',
      rule: 'high-homepage-ratio',
      detail: `${homepageCount}/${externalLinks.length} links externos (${Math.round((homepageCount / externalLinks.length) * 100)}%) são homepage sem path. Ideal ≤30%. Use Google News redirect (news.google.com/rss/articles/...) do news-cache do dia.`,
    })
  }

  // W2. URLs Polymarket fora do padrão polymarket.com/event/{slug}
  for (const { url } of allLinks) {
    if (/polymarket\.com/.test(url) && !isAllowedPolymarketUrl(url)) {
      violations.push({
        severity: 'warning',
        rule: 'polymarket-non-event-url',
        detail: `Link Polymarket fora do padrão polymarket.com/event/{slug}: ${url}`,
      })
    }
  }

  // W3. Link-density: regra editorial template 22/Abr — cada parágrafo
  // substantivo precisa de >=1 link externo. Threshold 80%.
  const { substantialParagraphs, paragraphsWithLink } = countParagraphsAndLinks(body)
  if (substantialParagraphs >= 5 && paragraphsWithLink / substantialParagraphs < 0.8) {
    const ratio = paragraphsWithLink / substantialParagraphs
    violations.push({
      severity: 'warning',
      rule: 'low-link-density',
      detail: `${paragraphsWithLink}/${substantialParagraphs} parágrafos substantivos (${Math.round(ratio * 100)}%) têm link externo. Regra editorial: ≥80% (cada alegação factual com fonte linkada).`,
    })
  }

  // W4. Em-dash usado como separador entre seções (bug do translator)
  // Linha contendo apenas — ou ——+ não é interpretada como horizontal rule pelo react-markdown
  const emDashSeparators = body.match(/^—+$/gm)
  if (emDashSeparators && emDashSeparators.length > 0) {
    violations.push({
      severity: 'warning',
      rule: 'em-dash-separator',
      detail: `${emDashSeparators.length} linha(s) usando — como separador. Substituir por --- (triple hyphen ASCII) para render como <hr>. Causa: auto-replacement do translator.`,
    })
  }

  // W5. Table separator com em-dashes (bug translator) — quebra render GFM
  if (/^\|[—\-\s]+\|[—\-\s]+\|[—\-\s]+\|[—\-\s]+\|[—\-\s]+\|[—\-\s]+\|$/m.test(body)) {
    if (/—/.test(body.match(/^\|[—\-\s]+\|[—\-\s]+\|[—\-\s]+\|[—\-\s]+\|[—\-\s]+\|[—\-\s]+\|$/m)?.[0] || '')) {
      violations.push({
        severity: 'warning',
        rule: 'table-separator-em-dash',
        detail: 'Separator de tabela GFM contém em-dashes (—) em vez de hyphens ASCII (-). Tabela renderiza como texto plano em vez de tabela. Substituir |---|---|...| ASCII.',
      })
    }
  }

  // W6. Headers ## colados ao parágrafo anterior sem blank line
  if (/[^\n]\n## /.test(body)) {
    violations.push({
      severity: 'warning',
      rule: 'header-no-blank-line',
      detail: 'Pelo menos um header ## está concatenado ao parágrafo anterior sem blank line. Markdown exige \\n\\n antes de heading para renderizar como h2 (não texto inline).',
    })
  }

  // W7. Densidade de citação de volume USD na Seção 1.
  // Protocolo firmado 17/Mai (feedback_afos_daily_volume_polymarket.md):
  // toda Seção 1 deve citar volume USD inline por sub-mercado (1T, 2L, 3L, STF,
  // Senado, inflação). 18/Mai aplicou 12 vezes; 19-21/Mai regrediram para 0-1.
  // Threshold ≥4 menções 'USD' na Seção 1 captura aplicação consistente
  // (>=1 menção em pelo menos 4 dos 6 sub-mercados) sem ser tão estrito
  // que pegue toda variação editorial.
  const sec1Match = body.match(/## 1\.[^]*?(?=\n## 2\.)/m)
  if (sec1Match) {
    const usdCount = (sec1Match[0].match(/\bUSD\b/g) || []).length
    if (usdCount < 4) {
      violations.push({
        severity: 'warning',
        rule: 'volume-usd-citation-thin',
        detail: `Seção 1 cita volume USD apenas ${usdCount}× (protocolo 17/Mai: ≥4 menções, formato inline XX,XX% (USD X,XXM)). Aplicar ao mercado presidencial, 2L, 3L, STF, Senado, inflação — reforça "dinheiro real" e contextualiza distorções de baixa liquidez.`,
      })
    }

    // W8. Volume TOTAL acumulado do mercado presidencial obrigatório na Seção 1.
    // Regra firmada 14/Jun (feedback_afos_daily_volume_polymarket.md "Mercado total
    // (sempre)"): além do volume por candidato, citar o volume total acumulado do
    // presidencial (~USD XXM). Faltou no Daily 14/Jun → enforcement adicionado.
    // i18n: PT (volume total / total acumulado / negociado), EN (total/accumulated volume), ES (volumen total/acumulado).
    const hasTotalVolume = /(volume total|total acumulad|total negociad|total accumulated|accumulated volume|total volume|volumen total|volumen acumulad)[^.]*\bUSD\b/i.test(sec1Match[0])
    if (!hasTotalVolume) {
      violations.push({
        severity: 'warning',
        rule: 'volume-total-missing',
        detail: 'Seção 1 não cita o VOLUME TOTAL acumulado do mercado presidencial (~USD XXM). Regra "Mercado total (sempre)": somar volumeNum de todos os candidatos e citar inline, ex.: "volume total acumulado no presidencial soma ~USD 99,6M".',
      })
    }
  }

  // W9. O Lede (frontmatter) deve citar o volume TOTAL acumulado (USD XXM).
  // Regra firmada 14/Jun: o volume total é a assinatura "dinheiro real" do AFOS e
  // entra no Lede (o número total, não os volumes por candidato). Exceção explícita
  // à diretriz "evitar excesso técnico no Lede" — só o total agregado.
  const ledeMatch = body.match(/^lede:\s*"([^"]*)"/m)
  if (ledeMatch && !/\bUSD\b/.test(ledeMatch[1])) {
    violations.push({
      severity: 'warning',
      rule: 'lede-volume-total-missing',
      detail: 'O Lede não cita o volume TOTAL acumulado do mercado presidencial (~USD XXM). Regra 14/Jun: incluir o total agregado no Lede como assinatura de "dinheiro real" (apenas o total, não volumes por candidato).',
    })
  }

  return violations
}

export function formatViolations(violations: Violation[]): string {
  if (violations.length === 0) return '✓ Nenhuma violação detectada.'
  const errors = violations.filter((v) => v.severity === 'error')
  const warnings = violations.filter((v) => v.severity === 'warning')
  const lines: string[] = []
  if (errors.length > 0) {
    lines.push(`✗ ${errors.length} erro(s) crítico(s) — Write bloqueado:`)
    errors.forEach((v, i) => lines.push(`  ${i + 1}. [${v.rule}] ${v.detail}`))
  }
  if (warnings.length > 0) {
    lines.push(`⚠ ${warnings.length} warning(s):`)
    warnings.forEach((v, i) => lines.push(`  ${i + 1}. [${v.rule}] ${v.detail}`))
  }
  return lines.join('\n')
}

export function hasErrors(violations: Violation[]): boolean {
  return violations.some((v) => v.severity === 'error')
}
