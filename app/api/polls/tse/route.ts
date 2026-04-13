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
  const days = Math.min(Number(searchParams.get('days')) || 15, 365)
  const institute = searchParams.get('institute')?.trim()

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
