import { NextResponse } from 'next/server'
import {
  loadWeekly,
  listPublishedWeeklies,
  listWeeklies,
  isValidLocale,
  isValidCountry,
} from '../../../../lib/afos-weekly/loader'

/**
 * Metadados da última edição do Weekly, para o cartão.
 *
 * Espelha /api/afos-tradeoff/latest. Quando ainda não há edição publicada,
 * devolve `hasEdition: false` e a data da primeira, para o cartão mostrar o
 * estado de pré-lançamento em vez de sumir da tela.
 *
 * ⚠️ NO PREVIEW da Vercel a rota também considera RASCUNHO, para o André poder
 * ver o cartão no estado final antes de existir edição publicada. Em produção,
 * só publicado conta, então nada vaza.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PRIMEIRA_EDICAO = '2026-08-06'

export async function GET(request: Request) {
  const url = new URL(request.url)

  const locale = url.searchParams.get('locale') || 'en'
  const safeLocale = isValidLocale(locale) ? locale : 'en'

  const pedido = url.searchParams.get('country') || 'us'
  if (!isValidCountry(pedido)) {
    return NextResponse.json({ ok: false, error: 'invalid_country' }, { status: 400 })
  }

  const emProducao = process.env.VERCEL_ENV === 'production'
  const disponiveis = emProducao ? listPublishedWeeklies(pedido) : listWeeklies(pedido)

  if (disponiveis.length === 0) {
    return NextResponse.json(
      { ok: true, hasEdition: false, firstEditionDate: PRIMEIRA_EDICAO },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  }

  const ultima = disponiveis[disponiveis.length - 1]
  // Penúltima, para o "Ver edição anterior" do cartão. Com uma edição só, vem
  // null e o cartão simplesmente não imprime o link.
  const anterior = disponiveis.length > 1 ? disponiveis[disponiveis.length - 2] : null
  const data = loadWeekly(ultima, safeLocale, pedido)
  if (!data) {
    return NextResponse.json({ ok: false, error: 'load_failed' }, { status: 500 })
  }

  const resumo = (data.tldr[0] || '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .slice(0, 240)

  return NextResponse.json(
    {
      ok: true,
      hasEdition: true,
      date: data.date,
      previousDate: anterior,
      country: pedido,
      issueNumber: data.issueNumber,
      weekStart: data.weekStart,
      weekEnd: data.weekEnd,
      title: data.title,
      resumo,
      updatedAt: data.updatedAt,
      status: data.status,
      servedLocale: data.servedLocale,
    },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
