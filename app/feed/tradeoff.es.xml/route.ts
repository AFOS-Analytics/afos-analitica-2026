/** RSS 2.0 feed for AFOS Tradeoff BRASIL (ES). See lib/feeds/rss.ts. */
import { buildTradeoffFeed, rssResponse } from '../../../lib/feeds/rss'

export const dynamic = 'force-static'
export const revalidate = 3600

export function GET() {
  return rssResponse(buildTradeoffFeed('es', 'br'))
}
