/**
 * RSS 2.0 feed for AFOS Daily.
 *
 * Available at /feed/daily.xml. Lists all daily syntheses in
 * reverse chronological order. Designed to be:
 *  - discoverable by AI engines (Perplexity, ChatGPT) via crawl
 *  - subscribable in feed readers (Feedly, Inoreader)
 *  - usable by automated bots (Discord/Slack/Telegram alerters)
 *
 * Auto-discovery: every /[locale]/daily/[date] page declares this
 * feed via <link rel="alternate" type="application/rss+xml">.
 *
 * EN/ES feeds will be added once translated content exists (Item 5
 * of the launch pipeline).
 */

import { listDailies, loadDaily } from '../../../lib/afos-daily/loader'
import { cleanMarkdownText } from '../../../lib/afos-daily/utils'

const SITE = 'https://afos-analytics.com'
const FEED_URL = `${SITE}/feed/daily.xml`
const PAGE_URL = `${SITE}/pt-BR/daily`

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
  const dates = listDailies().slice().reverse()

  const items = dates
    .map(date => {
      const data = loadDaily(date)
      if (!data) return ''
      const url = `${SITE}/pt-BR/daily/${date}`
      const description = cleanMarkdownText(data.lede).slice(0, 500)
      return `    <item>
      <title>${escape(data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRfc822(data.date, data.updatedAt)}</pubDate>
      <dc:creator>AFOS Analytics</dc:creator>
      <category>Politics</category>
      <category>Brazil 2026</category>
      <description>${escape(description)}</description>
    </item>`
    })
    .filter(Boolean)
    .join('\n')

  const lastBuild = new Date().toUTCString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>AFOS Daily</title>
    <link>${PAGE_URL}</link>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />
    <description>Síntese narrativa diária cruzando mercados de previsão, pesquisas eleitorais e notícias. AFOS Analytics — eleição presidencial Brasil 2026.</description>
    <language>pt-BR</language>
    <copyright>AFOS Analytics — Apache 2.0 — content under CC BY 4.0</copyright>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <generator>AFOS Analytics — afos-analytics.com</generator>
    <ttl>1440</ttl>
    <image>
      <url>${SITE}/brand/logo-icon-512.png</url>
      <title>AFOS Daily</title>
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
