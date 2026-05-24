/**
 * RSS 2.0 feed for AFOS Tradeoff.
 *
 * Available at /feed/tradeoff.xml. Lists all weekly editions in
 * reverse chronological order. Mirror of /feed/daily.xml — same
 * subscriber UX, separate channel so readers can opt in to either
 * cadence independently (daily vs weekly).
 *
 * Auto-discovery: every /[locale]/tradeoff/[date] page declares this
 * feed via <link rel="alternate" type="application/rss+xml">.
 */

import { listPublishedTradeoffs, loadTradeoff } from '../../../lib/afos-tradeoff/loader'
import { cleanMarkdownText } from '../../../lib/afos-tradeoff/utils'

const SITE = 'https://afos-analytics.com'
const FEED_URL = `${SITE}/feed/tradeoff.xml`
const PAGE_URL = `${SITE}/pt-BR/tradeoff`

function escape(s: string): string {
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

export const dynamic = 'force-static'
export const revalidate = 3600

export function GET() {
  const dates = listPublishedTradeoffs().slice().reverse()

  const items = dates
    .map(date => {
      const data = loadTradeoff(date)
      if (!data) return ''
      const url = `${SITE}/pt-BR/tradeoff/${date}`
      const description = cleanMarkdownText(data.sinalDaSemana).slice(0, 500)
      return `    <item>
      <title>${escape(data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRfc822(data.date, data.updatedAt)}</pubDate>
      <dc:creator>AFOS Analytics</dc:creator>
      <category>Politics</category>
      <category>Brazil 2026</category>
      <category>Weekly Analysis</category>
      <description>${escape(description)}</description>
    </item>`
    })
    .filter(Boolean)
    .join('\n')

  const lastBuild = new Date().toUTCString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>AFOS Tradeoff</title>
    <link>${PAGE_URL}</link>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />
    <description>Leitura técnica semanal cruzando mercados de previsão, pesquisas eleitorais e notícias — sem médias suavizadas. AFOS Analytics — eleição presidencial Brasil 2026.</description>
    <language>pt-BR</language>
    <copyright>AFOS Analytics — Apache 2.0 — content under CC BY 4.0</copyright>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <generator>AFOS Analytics — afos-analytics.com</generator>
    <ttl>10080</ttl>
    <image>
      <url>${SITE}/brand/logo-icon-512.png</url>
      <title>AFOS Tradeoff</title>
      <link>${PAGE_URL}</link>
    </image>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
