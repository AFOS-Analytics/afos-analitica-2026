/**
 * API Route: GET /api/market/history
 *
 * Retorna histórico de odds de candidatos do Neon (market schema).
 *
 * Query params:
 *   candidate  — nome do candidato (ex: "Lula")
 *   country    — ISO3 do país (ex: "BRA"), default: todos
 *   days       — janela em dias (default: 30, max: 90)
 *
 * Ex: /api/market/history?candidate=Lula&days=30
 */

import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'

export async function GET(request: Request) {
  if (!prisma) {
    return NextResponse.json({ error: 'database_unavailable' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const candidate = searchParams.get('candidate')?.trim()
  const country = searchParams.get('country')?.trim().toUpperCase()
  const days = Math.min(Math.max(Number(searchParams.get('days')) || 30, 1), 90)

  if (!candidate || candidate.length < 2) {
    return NextResponse.json(
      { error: 'candidate param required (min 2 chars)' },
      { status: 400 }
    )
  }

  try {
    const since = new Date()
    since.setDate(since.getDate() - days)

    const odds = await prisma.candidateOdd.findMany({
      where: {
        candidate: { startsWith: candidate, mode: 'insensitive' },
        snapshot: {
          fetchedAt: { gte: since },
          ...(country ? { country } : {}),
        },
      },
      select: {
        candidate: true,
        probability: true,
        volume: true,
        snapshot: {
          select: {
            slug: true,
            country: true,
            fetchedAt: true,
          },
        },
      },
      orderBy: { snapshot: { fetchedAt: 'asc' } },
      take: 5000,
    })

    return NextResponse.json(
      {
        candidate,
        country: country || 'all',
        days,
        points: odds.length,
        data: odds.map((o) => ({
          date: o.snapshot.fetchedAt,
          probability: o.probability,
          volume: o.volume,
          country: o.snapshot.country,
          slug: o.snapshot.slug,
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
    return NextResponse.json(
      { error: 'internal_error' },
      { status: 500 }
    )
  }
}
