/**
 * RSS 2.0 feed for AFOS Tradeoff BRASIL (PT-BR). Available at /feed/tradeoff.xml.
 *
 * EN/ES variants live at /feed/tradeoff.en.xml and /feed/tradeoff.es.xml. All
 * three share lib/feeds/rss.ts; locale feeds list only weekly editions that
 * have a translation on disk. Auto-discovery: every /[locale]/tradeoff page
 * declares its locale feed via <link rel="alternate" type="application/rss+xml">.
 *
 * ⛔ ESTE ENDEREÇO É O DO BRASIL e continua sendo, mesmo sem `-br` no nome.
 * Ele já tem assinantes, e mudar o sentido de um feed vivo quebra quem assinou.
 * Os Estados Unidos vivem em /feed/tradeoff-us.xml.
 */

import { buildTradeoffFeed, rssResponse } from '../../../lib/feeds/rss'

export const dynamic = 'force-static'
export const revalidate = 3600

export function GET() {
  return rssResponse(buildTradeoffFeed('pt-BR', 'br'))
}
