/** RSS 2.0 feed for AFOS Tradeoff UNITED STATES (EN). See lib/feeds/rss.ts. */
import { buildTradeoffFeed, rssResponse } from '../../../lib/feeds/rss'

export const dynamic = 'force-static'
export const revalidate = 3600

export function GET() {
  return rssResponse(buildTradeoffFeed('en', 'us'))
}
