import { NextResponse } from 'next/server'
import { loadTradeoff, listPublishedTradeoffs, isValidLocale, isValidCountry, PAIS_PADRAO } from '../../../../lib/afos-tradeoff/loader'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Returns metadata for the latest published Tradeoff edition. When no edition
// is published yet (pre-launch), returns hasEdition:false so the card can
// render the "first edition coming" placeholder. Mirrors the shape of
// /api/afos-daily/latest for symmetry.
export async function GET(request: Request) {
  const url = new URL(request.url)
  const locale = url.searchParams.get('locale') || 'pt-BR'
  const safeLocale = isValidLocale(locale) ? locale : 'pt-BR'
  // País no endereço desde 31/Jul. Sem o parâmetro, responde o Brasil, que é
  // quem já consumia esta rota.
  // Sem o parâmetro, responde o Brasil, que é quem já consumia esta rota antes
  // de o país existir no endereço. Isso é compatibilidade e continua valendo.
  const pedido = url.searchParams.get('country') || PAIS_PADRAO
  /**
   * 🔴 País PEDIDO e INVÁLIDO é erro, não é Brasil.
   *
   * Isto caía em `PAIS_PADRAO`, então quem pedisse `?country=usa` (em vez de
   * `us`) recebia os dados do BRASIL com `ok: true` e nunca saberia. Regra do
   * André em 06/Ago/2026: as duas eleições são independentes e não se
   * misturam. Ausência de parâmetro é compatibilidade; parâmetro errado é
   * defeito, e defeito tem que aparecer. Espelha o 400 da rota do Weekly.
   */
  if (!isValidCountry(pedido)) {
    return NextResponse.json({ ok: false, error: 'invalid_country' }, { status: 400 })
  }
  const pais = pedido

  const published = listPublishedTradeoffs(pais)
  if (published.length === 0) {
    return NextResponse.json({
      ok: true,
      hasEdition: false,
      firstEditionDate: '2026-05-25',  // canonical N.01 publish date (Seg 25/Mai)
    }, {
      headers: { 'Cache-Control': 'no-store' },
    })
  }

  const latestDate = published[published.length - 1]
  const previousDate = published.length > 1 ? published[published.length - 2] : null
  const data = loadTradeoff(latestDate, safeLocale, pais)
  if (!data) {
    return NextResponse.json({ ok: false, error: 'load_failed' }, { status: 500 })
  }

  // Truncate sinalDaSemana for card preview (first 240 chars, strip markdown)
  const sinalPlain = data.sinalDaSemana
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .slice(0, 240)

  return NextResponse.json({
    ok: true,
    hasEdition: true,
    date: data.date,
    issueNumber: data.issueNumber,
    weekStart: data.weekStart,
    weekEnd: data.weekEnd,
    title: data.title,
    sinalDaSemana: sinalPlain,
    updatedAt: data.updatedAt,
    previousDate,
  }, {
    headers: { 'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600' },
  })
}
