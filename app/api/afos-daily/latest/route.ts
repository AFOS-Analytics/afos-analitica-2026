/**
 * GET /api/afos-daily/latest
 * Returns metadata of the most recent AFOS Daily synthesis (date, title, lede).
 * Used by the dashboard hero card. Static at build time.
 */

import { NextResponse } from 'next/server'
import { getLatestDate, loadDaily, getAdjacentDates } from '../../../../lib/afos-daily/loader'

export const dynamic = 'force-static'
export const revalidate = 3600

export function GET() {
  const date = getLatestDate()
  if (!date) {
    return NextResponse.json({ ok: false, reason: 'no-daily' }, { status: 404 })
  }

  const data = loadDaily(date)
  if (!data) {
    return NextResponse.json({ ok: false, reason: 'load-failed' }, { status: 500 })
  }

  const adjacent = getAdjacentDates(date)

  return NextResponse.json(
    {
      ok: true,
      date: data.date,
      title: data.title,
      lede: data.lede,
      updatedAt: data.updatedAt,
      previousDate: adjacent.previous ?? null,
    },
    { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' } }
  )
}
