/**
 * Shared RSS 2.0 feed builder for AFOS Daily and AFOS Tradeoff, per locale.
 *
 * One codepath emits the PT-BR, EN, and ES feeds. Locale variants only list
 * dates that actually have a translation on disk (dailyExists/tradeoffExists),
 * so subscribers never get a link to a page that 404s in their language, * same hreflang-truthfulness principle used across the platform.
 *
 * Feed URLs:
 *   PT-BR : /feed/daily.xml        /feed/tradeoff.xml     /feed/tradeoff-us.xml
 *   EN    : /feed/daily.en.xml     /feed/tradeoff.en.xml  /feed/tradeoff-us.en.xml
 *   ES    : /feed/daily.es.xml     /feed/tradeoff.es.xml  /feed/tradeoff-us.es.xml
 *
 * 🔴 PAÍS NO TRADEOFF, consertado em 10/Ago/2026. Até aqui `buildTradeoffFeed`
 * chamava `listPublishedTradeoffs()` SEM país, caía no default `br` e o feed
 * emitia só o Brasil. Resultado medido: as três edições dos EUA existiam desde
 * 31/Jul e NUNCA foram distribuídas por RSS. O sitemap já passava `'us'`
 * explicitamente, então uma cópia da regra estava certa e a outra não.
 *
 * ⚠️ O sintoma é OMISSÃO, não valor errado, e por isso nenhum portão pegou:
 * portão confere o que foi publicado, e a edição foi publicada. Ausência não
 * gera divergência.
 *
 * ⛔ `/feed/tradeoff.xml` CONTINUA SIGNIFICANDO BRASIL. Já existem assinantes
 * apontados para ele, e mudar o sentido de um feed vivo quebra quem assinou.
 * É a mesma razão pela qual o slug do Neon ficou sem qualificador do lado
 * brasileiro. Os EUA entram em endereço próprio, com o sufixo `-us`.
 *
 * 🔑 O país é POSICIONAL E OBRIGATÓRIO em `buildTradeoffFeed` e em
 * `feedPath('tradeoff', ...)`. Esquecer não compila, que é a única defesa que
 * funciona contra padrão silencioso de país.
 */

import { listPublishedDailies, loadDaily, dailyExists } from '../afos-daily/loader'
import { listPublishedTradeoffs, loadTradeoff, tradeoffExists } from '../afos-tradeoff/loader'
import { cleanMarkdownText as cleanDaily } from '../afos-daily/utils'
import { cleanMarkdownText as cleanTradeoff } from '../afos-tradeoff/utils'

const SITE = 'https://www.afos-analytics.com'

export type FeedLocale = 'pt-BR' | 'en' | 'es'
export type FeedKind = 'daily' | 'tradeoff'
/** Países com edição de Tradeoff própria. O Daily só existe para o Brasil. */
export type FeedCountry = 'br' | 'us'

/**
 * Caminho do feed RSS. O Daily não tem país; o Tradeoff EXIGE país.
 *
 * O Brasil mantém o endereço histórico sem qualificador (`/feed/tradeoff.xml`)
 * porque já tem assinantes; os demais países ganham sufixo (`-us`).
 */
export function feedPath(kind: 'daily', loc: FeedLocale): string
export function feedPath(kind: 'tradeoff', loc: FeedLocale, pais: FeedCountry): string
export function feedPath(kind: FeedKind, loc: FeedLocale, pais?: FeedCountry): string {
  const base = kind === 'tradeoff' && pais !== 'br' ? `${kind}-${pais}` : kind
  return `/feed/${base}${loc === 'pt-BR' ? '' : '.' + loc}.xml`
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toRfc822(dateIso: string, updatedAt: string): string {
  const m = updatedAt.match(/^(\d{2})\/(\d{2})\/(\d{4}),?\s+(\d{2}):(\d{2})$/)
  let d: Date
  if (m) {
    const [, dd, mm, yyyy, hh, mi] = m
    d = new Date(`${yyyy}-${mm}-${dd}T${hh}:${mi}:00-03:00`)
  } else {
    d = new Date(`${dateIso}T00:00:00-03:00`)
  }
  return d.toUTCString()
}

const DAILY_DESC: Record<FeedLocale, string> = {
  'pt-BR': 'Síntese narrativa diária cruzando mercados de previsão, pesquisas eleitorais e notícias. AFOS Analytics, eleição presidencial Brasil 2026.',
  en: 'Daily narrative synthesis cross-referencing prediction markets, electoral polls, and news. AFOS Analytics, Brazil 2026 presidential election.',
  es: 'Síntesis narrativa diaria que cruza mercados de predicción, encuestas electorales y noticias. AFOS Analytics, elección presidencial Brasil 2026.',
}

const TRADEOFF_DESC: Record<FeedCountry, Record<FeedLocale, string>> = {
  br: {
    'pt-BR': 'Leitura técnica semanal cruzando mercados de previsão, pesquisas eleitorais e notícias, sem médias suavizadas. AFOS Analytics, eleição presidencial Brasil 2026.',
    en: 'Weekly technical reading cross-referencing prediction markets, electoral polls, and news, no smoothed averages. AFOS Analytics, Brazil 2026 presidential election.',
    es: 'Lectura técnica semanal que cruza mercados de predicción, encuestas electorales y noticias, sin promedios suavizados. AFOS Analytics, elección presidencial Brasil 2026.',
  },
  us: {
    'pt-BR': 'Leitura técnica semanal cruzando mercados de previsão, pesquisas de intenção de voto e notícias, sem médias suavizadas. AFOS Analytics, eleições de meio de mandato dos Estados Unidos, 03/Nov/2026.',
    en: 'Weekly technical reading cross-referencing prediction markets, generic ballot polling, and news, no smoothed averages. AFOS Analytics, United States midterm elections, Nov 3, 2026.',
    es: 'Lectura técnica semanal que cruza mercados de predicción, encuestas de intención de voto y noticias, sin promedios suavizados. AFOS Analytics, elecciones de medio término de Estados Unidos, 03/Nov/2026.',
  },
}

/** Título do canal e categoria geográfica dos itens, por país. */
const TRADEOFF_CANAL: Record<FeedCountry, { titulo: string; categoria: string }> = {
  br: { titulo: 'AFOS Tradeoff', categoria: 'Brazil 2026' },
  us: { titulo: 'AFOS Tradeoff US', categoria: 'US Midterms 2026' },
}

function channel(opts: {
  title: string
  desc: string
  loc: FeedLocale
  pageUrl: string
  feedUrl: string
  ttl: number
  items: string
}): string {
  const lastBuild = new Date().toUTCString()
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${opts.title}</title>
    <link>${opts.pageUrl}</link>
    <atom:link href="${opts.feedUrl}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(opts.desc)}</description>
    <language>${opts.loc}</language>
    <copyright>AFOS Analytics, Apache 2.0, content under CC BY 4.0</copyright>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <generator>AFOS Analytics, afos-analytics.com</generator>
    <ttl>${opts.ttl}</ttl>
    <image>
      <url>${SITE}/brand/logo-icon-512.png</url>
      <title>${opts.title}</title>
      <link>${opts.pageUrl}</link>
    </image>
${opts.items}
  </channel>
</rss>`
}

export function buildDailyFeed(loc: FeedLocale): string {
  const feedUrl = `${SITE}${feedPath('daily', loc)}`
  const pageUrl = `${SITE}/${loc}/daily`

  const dates = listPublishedDailies()
    .slice()
    .reverse()
    .filter(date => dailyExists(date, loc))

  const items = dates
    .map(date => {
      const data = loadDaily(date, loc)
      if (!data) return ''
      const url = `${SITE}/${loc}/daily/${date}`
      const description = cleanDaily(data.lede).slice(0, 500)
      return `    <item>
      <title>${escapeXml(data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRfc822(data.date, data.updatedAt)}</pubDate>
      <dc:creator>AFOS Analytics</dc:creator>
      <category>Politics</category>
      <category>Brazil 2026</category>
      <description>${escapeXml(description)}</description>
    </item>`
    })
    .filter(Boolean)
    .join('\n')

  return channel({ title: 'AFOS Daily', desc: DAILY_DESC[loc], loc, pageUrl, feedUrl, ttl: 1440, items })
}

export function buildTradeoffFeed(loc: FeedLocale, pais: FeedCountry): string {
  const feedUrl = `${SITE}${feedPath('tradeoff', loc, pais)}`
  // País no endereço desde 31/Jul. Apontar para a rota curta faria cada item
  // do feed passar por um 307, e leitor de RSS não deve seguir redirect à toa.
  const pageUrl = `${SITE}/${loc}/tradeoff/${pais}`
  const { titulo, categoria } = TRADEOFF_CANAL[pais]

  // ⚠️ O `pais` aqui não é enfeite: sem ele esta chamada cai no default `br` e
  // o feed do país novo sai VAZIO reportando sucesso. Ver o cabeçalho.
  const dates = listPublishedTradeoffs(pais)
    .slice()
    .reverse()
    .filter(date => tradeoffExists(date, loc, pais))

  const items = dates
    .map(date => {
      const data = loadTradeoff(date, loc, pais)
      if (!data) return ''
      const url = `${SITE}/${loc}/tradeoff/${pais}/${date}`
      const description = cleanTradeoff(data.sinalDaSemana).slice(0, 500)
      return `    <item>
      <title>${escapeXml(data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRfc822(data.date, data.updatedAt)}</pubDate>
      <dc:creator>AFOS Analytics</dc:creator>
      <category>Politics</category>
      <category>${categoria}</category>
      <category>Weekly Analysis</category>
      <description>${escapeXml(description)}</description>
    </item>`
    })
    .filter(Boolean)
    .join('\n')

  return channel({ title: titulo, desc: TRADEOFF_DESC[pais][loc], loc, pageUrl, feedUrl, ttl: 10080, items })
}

const RSS_HEADERS = {
  'Content-Type': 'application/rss+xml; charset=utf-8',
  'Cache-Control': 'public, max-age=3600, s-maxage=3600',
} as const

export function rssResponse(xml: string): Response {
  return new Response(xml, { headers: RSS_HEADERS })
}
