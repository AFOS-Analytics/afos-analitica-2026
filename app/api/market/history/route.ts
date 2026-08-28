/**
 * API Route: GET /api/market/history
 *
 * Série temporal de odds por candidato.
 *
 * Query params:
 *   candidate — nome (ex: "Lula"), min 2 chars
 *   country   — slug prefix (ex: "brazil"), opcional
 *   days      — janela (default 30, max 90)
 *   before    — ISO opcional: só pontos ANTERIORES a este instante
 *   after     — ISO opcional: só pontos POSTERIORES a este instante
 *
 * 🔑 A resposta DECLARA quando truncou. O teto de 1000 pontos existe desde
 * sempre e cortava calado: `days=90` num contrato movimentado devolvia os 1000
 * pontos mais ANTIGOS da janela e nada dizia, então quem pedisse 90 dias recebia
 * uma série que terminava dias atrás e parecia completa. É por isso que as
 * skills mandam juntar duas janelas à mão. Agora vem `truncated`, `limit`,
 * `windowStart` e `windowEnd`, e `before`/`after` permitem varrer a janela
 * inteira sem estourar o teto. A ordem segue ASCENDENTE, de propósito: inverter
 * só mudaria o cego de lugar, e passaria a cortar o início do ciclo, que é
 * justamente o que a checagem de superlativo usa.
 */

import { NextResponse } from 'next/server'
import { getPrisma } from '../../../../lib/db'

export async function GET(request: Request) {
  const prisma = getPrisma()
  if (!prisma) {
    return NextResponse.json({ error: 'database_unavailable' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const candidate = searchParams.get('candidate')?.trim()
  const country = searchParams.get('country')?.trim().toLowerCase()
  const days = Math.min(Math.max(Number(searchParams.get('days')) || 30, 1), 90)
  const beforeRaw = searchParams.get('before')?.trim()
  const afterRaw = searchParams.get('after')?.trim()

  if (!candidate || candidate.length < 2) {
    return NextResponse.json({ error: 'candidate param required (min 2 chars)' }, { status: 400 })
  }

  const before = beforeRaw ? new Date(beforeRaw) : null
  const after = afterRaw ? new Date(afterRaw) : null
  if ((before && Number.isNaN(before.getTime())) || (after && Number.isNaN(after.getTime()))) {
    return NextResponse.json({ error: 'before/after must be ISO 8601 instants' }, { status: 400 })
  }

  // `startsWith` do Prisma vira LIKE 'valor%' e NÃO escapa curinga: `candidate=%`
  // derrubava o filtro e devolvia a base inteira, com Câmara e Senado colados na
  // mesma série. Escapar aqui mantém o parâmetro literal.
  const BARRA = String.fromCharCode(92)
  const escaparLike = (s: string) => s.split('').map((c) => (c === '%' || c === '_' || c === BARRA ? BARRA + c : c)).join('')
  const candidateLike = escaparLike(candidate)
  const countryLike = country ? escaparLike(country) : undefined

  const LIMITE = 1000

  try {
    const since = new Date()
    since.setDate(since.getDate() - days)

    const prices = await prisma.marketPrice.findMany({
      where: {
        snapshotAt: {
          gte: after && after > since ? after : since,
          ...(before ? { lt: before } : {}),
        },
        outcome: {
          outcomeName: { startsWith: candidateLike, mode: 'insensitive' },
        },
        ...(countryLike ? { market: { slug: { startsWith: countryLike, mode: 'insensitive' } } } : {}),
      },
      select: {
        price: true,
        volume: true,
        snapshotAt: true,
        outcome: { select: { outcomeName: true } },
        market: { select: { slug: true, title: true } },
      },
      orderBy: { snapshotAt: 'asc' },
      take: LIMITE,
    })

    return NextResponse.json(
      {
        candidate,
        country: country || 'all',
        days,
        points: prices.length,
        limit: LIMITE,
        // 🔑 `truncated: true` significa que EXISTEM pontos mais novos que
        // `windowEnd` dentro da janela pedida, e eles não vieram. Paginar com
        // `after=<windowEnd>` para continuar de onde parou.
        truncated: prices.length === LIMITE,
        windowStart: prices.length ? prices[0].snapshotAt : null,
        windowEnd: prices.length ? prices[prices.length - 1].snapshotAt : null,
        data: prices.map((p) => ({
          date: p.snapshotAt,
          probability: p.price,
          volume: p.volume,
          candidate: p.outcome?.outcomeName,
          slug: p.market?.slug,
        })),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'X-Content-Type-Options': 'nosniff',
        },
      }
    )
  } catch (error) {
    console.error('[market/history] Erro:', error)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
