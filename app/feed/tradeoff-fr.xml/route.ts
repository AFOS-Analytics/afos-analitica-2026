/**
 * RSS 2.0 feed for AFOS Tradeoff FRANÇA (PT-BR). At /feed/tradeoff-fr.xml.
 *
 * EN/ES variants live at /feed/tradeoff-fr.en.xml and /feed/tradeoff-fr.es.xml.
 * All three share lib/feeds/rss.ts; locale feeds list only weekly editions that
 * have a translation on disk.
 *
 * Criado em 08/Nov/2026 com o produto da França, a partir do feed dos EUA.
 */

import { buildTradeoffFeed, rssResponse } from '../../../lib/feeds/rss'

export const dynamic = 'force-static'
export const revalidate = 3600

export function GET() {
  return rssResponse(buildTradeoffFeed('pt-BR', 'fr'))
}
