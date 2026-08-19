import type { AfosTradeoffData } from './loader'
import { cleanMarkdownText } from './utils'
import { updatedAtToIso } from '../frontmatter/updated-at'

const SITE = 'https://www.afos-analytics.com'
const ORG_LOGO = `${SITE}/brand/logo-icon-512.png`
const OG_IMAGE = `${SITE}/brand/footer-preview.png`

function parseUpdatedAt(updatedAt: string, dateIso: string): string {
  // Regra única em lib/frontmatter/updated-at.ts. Esta cópia local devolvia
  // `2026-16-08T...`, mês 16, para um updatedAt escrito em MM/DD.
  return updatedAtToIso(updatedAt, dateIso)
}

// NewsArticle JSON-LD for a Tradeoff edition. Same shape as the Daily schema
// so GEO crawlers (Perplexity, ChatGPT, Claude) recognize both as journalistic
// primary source. articleBody assembled from sinalDaSemana + execSummaryIntro
// + scenarios + methodology, capped at 8000 chars to fit LLM token budgets.
/**
 * 🔴 `pais` É OBRIGATÓRIO, e é posicional de propósito: assim o TypeScript
 * recusa no build qualquer chamador que esqueça, em vez de o esquecimento
 * virar URL errada no dado estruturado.
 *
 * Medido em produção em 06/Ago/2026, na Edição №2 dos EUA: o JSON-LD declarava
 * `url` e `mainEntityOfPage` como `/en/tradeoff/2026-08-03`, que é a rota
 * ANTIGA e responde 307 para o BRASIL, entregando a Edição №11 brasileira. A
 * manchete americana ficava amarrada ao endereço da peça de outro país, e em
 * conflito com o canonical da própria página, que já trazia `/us/`.
 *
 * É para crawler de busca e de GEO que este schema existe, então declarar a
 * URL errada é pior que não declarar nada.
 */
export function buildArticleSchema(data: AfosTradeoffData, locale: string, pais: string) {
  const url = `${SITE}/${locale}/tradeoff/${pais}/${data.date}`
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
    // ⚠️ POR PAÍS. Ficava fixo em "Brazil 2026 election" e a edição dos EUA
    // anunciava ao crawler a eleição errada, no mesmo objeto em que a URL já
    // apontava para o Brasil. Espelha o TAGS_POR_PAIS da página da edição.
    keywords: [
      ...(pais === 'us'
        ? ['US 2026 midterms', 'US Senate', 'US House']
        : ['Brazil 2026 election', 'Brazilian politics']),
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
/**
 * ⚠️ AS DUAS POSIÇÕES PRECISAM DO PAÍS, não só a última.
 *
 * Consertar só a posição 3 deixaria o vazamento na 2: `/{idioma}/tradeoff` sem
 * país também responde 307 e cai no índice do BRASIL. O breadcrumb da edição
 * americana ficaria com o pai apontando para o Brasil, e a posição 2 deixaria
 * de ser prefixo da 3, que é justamente o que um breadcrumb precisa ser.
 */
export function buildBreadcrumbSchema(date: string, locale: string, pais: string) {
  const safeLocale = locale === 'en' || locale === 'es' ? locale : 'pt-BR'
  const homeName = safeLocale === 'pt-BR' ? 'Início' : safeLocale === 'es' ? 'Inicio' : 'Home'
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeName, item: `${SITE}/${safeLocale}` },
      { '@type': 'ListItem', position: 2, name: 'AFOS Tradeoff', item: `${SITE}/${safeLocale}/tradeoff/${pais}` },
      { '@type': 'ListItem', position: 3, name: date, item: `${SITE}/${safeLocale}/tradeoff/${pais}/${date}` },
    ],
  }
}

export function getOgImageUrl(locale?: string): string {
  // Reuses the generic /api/og endpoint — Daily uses the same. Per-edition
  // OG image is a post-launch backlog item (project_post_launch_visualizations.md).
  const safe = (locale === 'en' || locale === 'es') ? locale : 'pt-BR'
  // 🔴 Arquivo ESTÁTICO, não `/api/og`. O robots.ts bloqueia `/api/` para todo
  // agente, então o LinkedInBot e o facebookexternalhit recusavam buscar a
  // imagem e o cartão de TODA peça saía sem ela. É a mesma troca que
  // lib/seo/schema.ts:91 já tinha feito. Medido em 19/Ago/2026.
  const arquivo = safe === 'pt-BR' ? 'pt' : safe
  return `${SITE}/brand/og-${arquivo}-linkedin-1200x627.png`
}

export { parseUpdatedAt }
