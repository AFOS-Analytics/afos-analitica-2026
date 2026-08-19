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
        // 🔴 `max-age=0` no NAVEGADOR e a validade no CDN. Antes eram 3600 nos
        // dois: uma correção publicada ficava até uma hora invisível para quem
        // já tinha aberto a página, sem nenhum jeito de furar o cache dele.
        // O `s-maxage` mantém o alívio de carga, e o `stale-while-revalidate`
        // serve o antigo enquanto busca o novo.
        'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=600, must-revalidate',
        'Vary': 'Accept-Language',
      },
    }
  )
}
