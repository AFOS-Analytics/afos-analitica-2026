/**
 * AFOS Daily — Validador de URLs e qualidade de fontes
 *
 * Camada 4 da arquitetura URL-primária:
 * Gate técnico que valida o markdown antes de Write em public/afos-daily/*.md.
 * Bloqueia commit se violações críticas são detectadas — substitui dependência
 * de cuidado humano por gate automático.
 *
 * Implementado em 07/Mai/2026 após incidente daily 06/Mai (homepages em vez de
 * URLs específicas, gamma-api.polymarket.com em vez de polymarket.com/event/).
 *
 * Severidade:
 *  - error: bloqueia Write (não-recuperável sem ação humana)
 *  - warning: relata mas não bloqueia (passa Write, fica visível)
 */

export type ViolationSeverity = 'error' | 'warning'

export interface Violation {
  severity: ViolationSeverity
  rule: string
  detail: string
}

// URLs externas (http/https) — apenas estas contam para regras de qualidade.
// URLs relativas tipo `/en/glossary#tse` ou `/pt-BR/dashboard` são links internos
// (glossário, página própria) e NÃO devem ser contadas como "matérias citadas".
const EXTERNAL_URL_REGEX = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g
const ALL_URL_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g
const FOOTER_SOURCES_RE = /\*\*(?:Fontes citadas|Sources cited|Fuentes citadas):?\*\*[^\n]*/i

function extractAllLinks(body: string): { text: string; url: string }[] {
  const links: { text: string; url: string }[] = []
  const re = new RegExp(EXTERNAL_URL_REGEX.source, 'g')
  let m: RegExpExecArray | null
  while ((m = re.exec(body)) !== null) {
    links.push({ text: m[1], url: m[2] })
  }
  return links
}

// Identifica URLs internas do próprio AFOS — não contam para "matérias externas".
function isInternalUrl(url: string): boolean {
  if (!/^https?:/.test(url)) return true  // relative path = interno
  return /^https?:\/\/(?:www\.)?afos-analytics\.(?:com|one|info|news|xyz)/.test(url)
}

function isBareHomepage(url: string): boolean {
  // True se URL é só `https://{domain}` ou `https://{domain}/` sem path
  // Exclui: subdomínios `news.*` (agregadores como news.google.com) e `api.*` (já tem regra própria)
  // Exclui: domínios próprios AFOS (já filtrados como internos)
  if (isInternalUrl(url)) return false
  const m = url.match(/^https?:\/\/([^/]+)\/?$/)
  if (!m) return false
  const host = m[1].toLowerCase()
  if (host.startsWith('news.') || host.startsWith('api.')) return false
  return true
}

function isAllowedPolymarketUrl(url: string): boolean {
  // Apenas polymarket.com/event/{slug} ou Google News redirect
  if (/^https?:\/\/(?:www\.)?polymarket\.com\/event\//.test(url)) return true
  if (/^https?:\/\/news\.google\.com/.test(url)) return true
  return false
}

// Conta parágrafos substantivos no body (>= 80 caracteres, ignora headings, hr, blockquote-only).
// Cada parágrafo substantivo deveria ter >= 1 link inline (regra editorial 22/Abr).
function countParagraphsAndLinks(body: string): { substantialParagraphs: number; paragraphsWithLink: number } {
  const blocks = body.split(/\n\n+/)
  let substantial = 0
  let withLink = 0
  for (const block of blocks) {
    const trimmed = block.trim()
    if (!trimmed) continue
    // Skip headings (# ## ###), hr (---), e blocks só de bullets de fontes
    if (/^#{1,6}\s/.test(trimmed)) continue
    if (/^[-*_]{3,}$/.test(trimmed)) continue
    if (trimmed.length < 80) continue  // muito curto para ser parágrafo substantivo
    // Skip if é lista de bullets (matérias da seção "Fontes consultadas")
    if (/^- \[/.test(trimmed)) continue
    substantial++
    // Tem pelo menos 1 link externo (não interno)?
    const re = new RegExp(EXTERNAL_URL_REGEX.source, 'g')
    let hasExternalLink = false
    let m: RegExpExecArray | null
    while ((m = re.exec(trimmed)) !== null) {
      if (!isInternalUrl(m[2])) {
        hasExternalLink = true
        break
      }
    }
    if (hasExternalLink) withLink++
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

  // W1. Razão de homepages bare > 30% (medida apenas em links externos com >=10 amostras)
  // 30% threshold escolhido empiricamente: daily 05/Mai (boa) tinha ~20%, daily 06/Mai inicial (ruim) tinha 68%.
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
  const polyLinks = allLinks.filter((l) => /polymarket\.com/.test(l.url))
  for (const { url } of polyLinks) {
    if (!isAllowedPolymarketUrl(url)) {
      violations.push({
        severity: 'warning',
        rule: 'polymarket-non-event-url',
        detail: `Link Polymarket fora do padrão polymarket.com/event/{slug}: ${url}`,
      })
    }
  }

  // W3. Link-density: cada parágrafo substantivo deveria ter ≥1 link externo.
  // Regra editorial firmada no template 22/Abr. Threshold: >=80% dos parágrafos substantivos com link.
  const { substantialParagraphs, paragraphsWithLink } = countParagraphsAndLinks(body)
  if (substantialParagraphs >= 5) {
    const ratio = paragraphsWithLink / substantialParagraphs
    if (ratio < 0.8) {
      violations.push({
        severity: 'warning',
        rule: 'low-link-density',
        detail: `${paragraphsWithLink}/${substantialParagraphs} parágrafos substantivos (${Math.round(ratio * 100)}%) têm link externo. Regra editorial: ≥80% (cada alegação factual com fonte linkada).`,
      })
    }
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
