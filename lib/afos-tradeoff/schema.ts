import type { AfosTradeoffData } from './loader'
import { cleanMarkdownText } from './utils'

const SITE = 'https://www.afos-analytics.com'
const ORG_LOGO = `${SITE}/brand/logo-icon-512.png`
const OG_IMAGE = `${SITE}/brand/footer-preview.png`

function parseUpdatedAt(updatedAt: string, dateIso: string): string {
  const m = updatedAt.match(/^(\d{2})\/(\d{2})\/(\d{4}),?\s+(\d{2}):(\d{2})$/)
  if (m) {
    const [, dd, mm, yyyy, hh, mi] = m
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}:00-03:00`
  }
  return `${dateIso}T00:00:00-03:00`
}

// NewsArticle JSON-LD for a Tradeoff edition. Same shape as the Daily schema
// so GEO crawlers (Perplexity, ChatGPT, Claude) recognize both as journalistic
// primary source. articleBody assembled from sinalDaSemana + execSummaryIntro
// + scenarios + methodology, capped at 8000 chars to fit LLM token budgets.
export function buildArticleSchema(data: AfosTradeoffData, locale: string) {
  const url = `${SITE}/${locale}/tradeoff/${data.date}`
  const description = cleanMarkdownText(data.sinalDaSemana).slice(0, 300)
  const datePublished = `${data.date}T00:00:00-03:00`
  const dateModified = parseUpdatedAt(data.updatedAt, data.date)

  // Assemble a representative excerpt — concatenates the prose sections in
  // reading order so GEO crawlers get a coherent narrative without paying
  // for the full YAML structure.
  const bodyParts: string[] = []
  bodyParts.push(cleanMarkdownText(data.sinalDaSemana))
  if (data.execSummaryIntro) bodyParts.push(cleanMarkdownText(data.execSummaryIntro))
  if (data.antiAvgIntro) bodyParts.push(cleanMarkdownText(data.antiAvgIntro))
  if (data.antiAvgClosing) bodyParts.push(cleanMarkdownText(data.antiAvgClosing))
  if (data.scenariosIntro) bodyParts.push(cleanMarkdownText(data.scenariosIntro))
  if (Array.isArray(data.scenarios)) {
    for (const s of data.scenarios) bodyParts.push(cleanMarkdownText(s.text))
  }
  if (data.methodology) bodyParts.push(cleanMarkdownText(data.methodology))
  const articleBody = bodyParts.filter(Boolean).join(' ').slice(0, 8000)
  const wordCount = articleBody ? articleBody.split(/\s+/).filter(Boolean).length : 0

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: data.title,
    description,
    datePublished,
    dateModified,
    inLanguage: locale,
    isAccessibleForFree: true,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    // Autor = Pessoa identificável (E-E-A-T). Nome público "André Felipe" + LinkedIn pessoal;
    // publisher segue Organization. (SEO/GEO EVAL 06/Jun)
    author: {
      '@type': 'Person',
      name: 'André Felipe',
      url: 'https://www.linkedin.com/in/andre-felipe-afos',
      sameAs: ['https://www.linkedin.com/in/andre-felipe-afos'],
    },
    publisher: {
      '@type': 'Organization',
      name: 'AFOS Analytics',
      url: SITE,
      logo: { '@type': 'ImageObject', url: ORG_LOGO },
    },
    image: {
      '@type': 'ImageObject',
      url: OG_IMAGE,
      width: 2560,
      height: 1300,
    },
    articleSection: 'Politics',
    ...(wordCount > 0 ? { wordCount } : {}),
    ...(articleBody ? { articleBody } : {}),
    keywords: [
      'Brazil 2026 election',
      'prediction markets',
      'electoral polls',
      'political risk',
      'AFOS Tradeoff',
      'weekly analysis',
    ],
    creator: {
      '@type': 'SoftwareApplication',
      name: 'AFOS Editorial Pipeline',
      applicationCategory: 'AnalyticsApplication',
      description: 'AI-assisted weekly technical analysis of Polymarket odds, electoral polls, and news coverage. Three signals reported separately — divergence is the signal, not noise to average away. Human approval required before publish.',
    },
    disambiguatingDescription: 'Weekly technical reading for institutional research, buy-side, and treasury. Cross-references prediction markets, polls, and news without averaging into composite indices. AI-assisted with mandatory human review.',
  }
}

// BreadcrumbList: Home > Tradeoff > {date}
export function buildBreadcrumbSchema(date: string, locale: string) {
  const safeLocale = locale === 'en' || locale === 'es' ? locale : 'pt-BR'
  const homeName = safeLocale === 'pt-BR' ? 'Início' : safeLocale === 'es' ? 'Inicio' : 'Home'
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeName, item: `${SITE}/${safeLocale}` },
      { '@type': 'ListItem', position: 2, name: 'AFOS Tradeoff', item: `${SITE}/${safeLocale}/tradeoff` },
      { '@type': 'ListItem', position: 3, name: date, item: `${SITE}/${safeLocale}/tradeoff/${date}` },
    ],
  }
}

export function getOgImageUrl(locale?: string): string {
  // Reuses the generic /api/og endpoint — Daily uses the same. Per-edition
  // OG image is a post-launch backlog item (project_post_launch_visualizations.md).
  const safe = (locale === 'en' || locale === 'es') ? locale : 'pt-BR'
  return `${SITE}/api/og?locale=${safe}`
}

export { parseUpdatedAt }
