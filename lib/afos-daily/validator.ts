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
const FOOTER_SOURCES_RE = /\*\*(?:Fontes citadas|Sources cited|Fuentes citadas):?\*\*[^\n]*/i
const PARAGRAPH_BREAK_RE = /\n\n+/
const SOURCES_BULLET_RE = /^- \[/
const HR_OR_HEADING_RE = /^(?:#{1,6}\s|[-*_]{3,}$)/

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
    substantial++
    const hasExternal = extractAllLinks(trimmed).some((l) => !isInternalUrl(l.url))
    if (hasExternal) withLink++
  }
  return { substantialParagraphs: substantial, paragraphsWithLink: withLink }
}

export function validateBody(body: string): Violation[] {
  const violations: Violation[] = []
  const allLinks = extractAllLinks(body)

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
