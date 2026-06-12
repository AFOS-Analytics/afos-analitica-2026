/**
 * RSS 2.0 feed for AFOS Daily (PT-BR). Available at /feed/daily.xml.
 *
 * EN/ES variants live at /feed/daily.en.xml and /feed/daily.es.xml. All three
 * share lib/feeds/rss.ts; locale feeds list only dates that have a translation
 * on disk. Auto-discovery: every /[locale]/daily page declares its locale feed
 * via <link rel="alternate" type="application/rss+xml">.
 */

import { buildDailyFeed, rssResponse } from '../../../lib/feeds/rss'

export const dynamic = 'force-static'
export const revalidate = 3600

export function GET() {
  return rssResponse(buildDailyFeed('pt-BR'))
}
