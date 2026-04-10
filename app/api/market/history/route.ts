/**
 * API Route: GET /api/market/history
 *
 * Série temporal de odds por candidato.
 *
 * Query params:
 *   candidate — nome (ex: "Lula"), min 2 chars
 *   country   — slug prefix (ex: "brazil"), opcional
 *   days      — janela (default 30, max 90)
 */

import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'

export async function GET(request: Request) {
  if (!prisma) {
    return NextResponse.json({ error: 'database_unavailable' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const candidate = searchParams.get('candidate')?.trim()
  const country = searchParams.get('country')?.trim().toLowerCase()
  const days = Math.min(Math.max(Number(searchParams.get('days')) || 30, 1), 90)

  if (!candidate || candidate.length < 2) {
    return NextResponse.json({ error: 'candidate param required (min 2 chars)' }, { status: 400 })
  }

  try {
    const since = new Date()
    since.setDate(since.getDate() - days)

    const prices = await prisma.marketPrice.findMany({
      where: {
        snapshotAt: { gte: since },
        outcome: {
          outcomeName: { startsWith: candidate, mode: 'insensitive' },
        },
        ...(country ? { market: { slug: { startsWith: country, mode: 'insensitive' } } } : {}),
      },
      select: {
        price: true,
        volume: true,
        snapshotAt: true,
        outcome: { select: { outcomeName: true } },
        market: { select: { slug: true, title: true } },
      },
      orderBy: { snapshotAt: 'asc' },
      take: 1000,
    })

    return NextResponse.json(
      {
        candidate,
        country: country || 'all',
        days,
        points: prices.length,
        data: prices.map((p) => ({
          date: p.snapshotAt,
          probability: p.price,
          volume: p.volume,
          candidate: p.outcome?.outcomeName,
          slug: p.market.slug,
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
