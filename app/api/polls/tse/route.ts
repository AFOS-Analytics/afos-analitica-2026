/**
 * API Route: GET /api/polls/tse
 *
 * Retorna pesquisas TSE registradas, com opção de filtrar por período.
 * Query params:
 *   days — últimos N dias (default: 15)
 *   institute — filtrar por instituto
 */

import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'

export async function GET(request: Request) {
  if (!prisma) {
    return NextResponse.json({ error: 'database_unavailable' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  // Clamp days to a safe range. Negative or NaN → fallback to default 15;
  // upper bound 365 prevents abusive queries that scan the entire history.
  const daysRaw = Number(searchParams.get('days'))
  const days = Number.isFinite(daysRaw) && daysRaw > 0 ? Math.min(daysRaw, 365) : 15
  // Cap institute filter at 100 chars to bound Prisma query input.
  const institute = searchParams.get('institute')?.trim().slice(0, 100)

  try {
    const since = new Date()
    since.setDate(since.getDate() - days)

    const findings = await prisma.researchFinding.findMany({
      where: {
        countryCode: 'BRA',
        createdAt: { gte: since },
        ...(institute ? {
          source: { name: { startsWith: institute, mode: 'insensitive' } },
        } : {}),
      },
      select: {
        title: true,
        normalizedPayload: true,
        confidenceScore: true,
        eventDate: true,
        createdAt: true,
        source: { select: { name: true, credibilityScore: true } },
      },
      orderBy: { eventDate: 'desc' },
      take: 200,
    })

    return NextResponse.json({
      total: findings.length,
      days,
      polls: findings.map(f => ({
        protocolo: f.title,
        institute: f.source?.name,
        credibility: f.source?.credibilityScore,
        confidence: f.confidenceScore,
        publicationDate: f.eventDate,
        ingestedAt: f.createdAt,
        ...(f.normalizedPayload as Record<string, unknown> || {}),
      })),
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('[polls/tse] Error:', error)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
