import type { AfosDailyData } from '../../app/components/AfosDailyTemplate'
import { cleanMarkdownText } from './utils'

const SITE = 'https://afos-analytics.com'
const ORG_LOGO = `${SITE}/brand/logo-icon-512.png`
const OG_IMAGE = `${SITE}/brand/footer-preview.png`

// Static map of common source names to their URLs (for Schema.org mentions).
// Used by NewsArticle JSON-LD to enrich citations with verifiable URLs.
const SOURCE_URLS: Record<string, string> = {
  'Polymarket': 'https://polymarket.com',
  'TSE': 'https://www.tse.jus.br',
  'AtlasIntel': 'https://atlasintel.org',
  'AtlasIntel/Bloomberg': 'https://atlasintel.org',
  'Quaest': 'https://www.quaest.com.br',
  'Quaest/Genial': 'https://www.quaest.com.br',
  'Genial/Quaest': 'https://www.quaest.com.br',
  'Datafolha': 'https://datafolha.folha.uol.com.br',
  'Paraná Pesquisas': 'https://paranapesquisas.com.br',
  'Parana Pesquisas': 'https://paranapesquisas.com.br',
  'Vox Brasil': 'https://voxbrasil.com',
  'Nexus/BTG Pactual': 'https://www.nexusra.com.br',
  'Nexus': 'https://www.nexusra.com.br',
  'CNN Brasil': 'https://www.cnnbrasil.com.br',
  'Folha de S.Paulo': 'https://www.folha.uol.com.br',
  'Estadão': 'https://www.estadao.com.br',
  'Poder360': 'https://www.poder360.com.br',
  'Pleno.News': 'https://pleno.news',
  'InfoMoney': 'https://www.infomoney.com.br',
  'Forbes Brasil': 'https://forbes.com.br',
  'Valor Econômico': 'https://valor.globo.com',
  'Gazeta do Povo': 'https://www.gazetadopovo.com.br',
  'CartaCapital': 'https://www.cartacapital.com.br',
  'VEJA': 'https://veja.abril.com.br',
  'Revista Fórum': 'https://revistaforum.com.br',
  'JOTA': 'https://www.jota.info',
  'Metrópoles': 'https://www.metropoles.com',
  'BBC': 'https://www.bbc.com/portuguese',
  'BBC Brasil': 'https://www.bbc.com/portuguese',
  'Correio Braziliense': 'https://www.correiobraziliense.com.br',
  'Revista Oeste': 'https://revistaoeste.com',
  'SBT News': 'https://www.sbtnews.sbt.com.br',
  'G1': 'https://g1.globo.com',
  'O Globo': 'https://oglobo.globo.com',
  'O Tempo': 'https://www.otempo.com.br',
  'Brasil 247': 'https://www.brasil247.com',
  'Brasil247': 'https://www.brasil247.com',
  'Estado de Minas': 'https://www.em.com.br',
  'Diário do Povo': 'https://www.diariodopovo.com.br',
  'Agenda do Poder': 'https://agendadopoder.com.br',
  'Congresso em Foco': 'https://congressoemfoco.com.br',
  'Terra Brasil Notícias': 'https://www.terra.com.br',
  'Terra': 'https://www.terra.com.br',
  'OpiniãoCE': 'https://opiniaoce.com.br',
  'O Cafezinho': 'https://www.ocafezinho.com',
  'Diário do Estado': 'https://diariodoestadogo.com.br',
  'Blog do BG': 'https://blogdobg.com.br',
  'Exame': 'https://exame.com',
  'Bloomberg': 'https://www.bloomberg.com',
  'CNT': 'https://www.cnt.org.br',
  'Blog do Ricardo Antunes': 'https://www.ricardoantunes.com.br',
  'Ricardo Antunes': 'https://www.ricardoantunes.com.br',
  'OpiniaoCE': 'https://opiniaoce.com.br',
}

// Build a case-insensitive (and accent-folded) lookup index from SOURCE_URLS.
const SOURCE_URLS_NORMALIZED: Record<string, string> = (() => {
  const idx: Record<string, string> = {}
  for (const [name, url] of Object.entries(SOURCE_URLS)) {
    const key = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    idx[key] = url
  }
  return idx
})()

function lookupSourceUrl(name: string): string | undefined {
  const key = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return SOURCE_URLS_NORMALIZED[key]
}

function parseSources(sourcesStr: string): Array<{ name: string; url?: string }> {
  return sourcesStr
    .split(',')
    .map(s => s.trim().replace(/\.$/, ''))
    .filter(Boolean)
    .map(name => {
      const url = lookupSourceUrl(name)
      return url ? { name, url } : { name }
    })
}

function parseUpdatedAt(updatedAt: string, dateIso: string): string {
  // updatedAt format: "DD/MM/YYYY, HH:MM" — convert to ISO 8601 with -03:00 offset (BRT)
  const m = updatedAt.match(/^(\d{2})\/(\d{2})\/(\d{4}),?\s+(\d{2}):(\d{2})$/)
  if (m) {
    const [, dd, mm, yyyy, hh, mi] = m
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}:00-03:00`
  }
  return `${dateIso}T00:00:00-03:00`
}

/**
 * Builds NewsArticle JSON-LD schema for an AFOS Daily synthesis.
 *
 * NewsArticle is preferred over Article for GEO — generative engines
 * (ChatGPT, Perplexity, Claude) treat it as journalistic primary source.
 *
 * Mentions array enriches GEO by linking each cited institute/outlet
 * to its canonical URL — IA can verify and follow citations.
 */
export function buildArticleSchema(data: AfosDailyData, locale: string) {
  const url = `${SITE}/${locale}/daily/${data.date}`
  const description = cleanMarkdownText(data.lede).slice(0, 300)
  const datePublished = `${data.date}T00:00:00-03:00`
  const dateModified = parseUpdatedAt(data.updatedAt, data.date)
  const mentions = parseSources(data.sources).map(s => ({
    '@type': 'Organization',
    name: s.name,
    ...(s.url ? { url: s.url } : {}),
  }))

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
    author: {
      '@type': 'Organization',
      name: 'AFOS Analytics',
      url: SITE,
    },
    publisher: {
      '@type': 'Organization',
      name: 'AFOS Analytics',
      url: SITE,
      logo: {
        '@type': 'ImageObject',
        url: ORG_LOGO,
      },
    },
    image: OG_IMAGE,
    articleSection: 'Politics',
    keywords: [
      'Brazil 2026 election',
      'prediction markets',
      'electoral polls',
      'political risk',
      'AFOS Daily',
    ],
    ...(mentions.length > 0 ? { mentions } : {}),
  }
}

export function getOgImageUrl(locale?: string): string {
  // Per-locale OG image via /api/og (Edge route handler que respeita searchParams).
  // app/opengraph-image.tsx default function não recebe searchParams em runtime edge.
  const safe = (locale === 'en' || locale === 'es') ? locale : 'pt-BR'
  return `${SITE}/api/og?locale=${safe}`
}

export { parseUpdatedAt }
