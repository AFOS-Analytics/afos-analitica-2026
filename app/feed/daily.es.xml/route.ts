/** RSS 2.0 feed for AFOS Daily (ES). See lib/feeds/rss.ts. */
import { buildDailyFeed, rssResponse } from '../../../lib/feeds/rss'

export const dynamic = 'force-static'
export const revalidate = 3600

export function GET() {
  return rssResponse(buildDailyFeed('es'))
}
