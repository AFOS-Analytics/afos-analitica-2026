/**
 * GET /api/afos-daily/latest?locale=pt-BR|en|es
 * Returns metadata of the most recent AFOS Daily synthesis (date, title, lede).
 * Used by the dashboard hero card. Loader falls back to PT-BR if the locale
 * variant ({date}.{locale}.md) doesn't exist yet.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getLatestDate, loadDaily, getAdjacentDates, isValidLocale } from '../../../../lib/afos-daily/loader'

export const dynamic = 'force-dynamic'

export function GET(req: NextRequest) {
  const localeParam = req.nextUrl.searchParams.get('locale') ?? 'pt-BR'
  const locale = isValidLocale(localeParam) ? localeParam : 'pt-BR'

  const date = getLatestDate()
  if (!date) {
    return NextResponse.json({ ok: false, reason: 'no-daily' }, { status: 404 })
  }

  const data = loadDaily(date, locale)
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
    {
      headers: {
        // Cache 1h. Vary: Accept-Language is defensive — the locale itself
        // comes from ?locale= which is already part of the CDN cache key,
        // but Vary protects against any proxy that might not include the
        // query string in its cache key.
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Vary': 'Accept-Language',
      },
    }
  )
}
