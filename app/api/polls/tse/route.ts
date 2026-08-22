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
        // 🔴 CORRIGIDO 22/Ago/2026. Estava `public, s-maxage=300,
        // stale-while-revalidate=600`, e o defeito é o que FALTAVA: `s-maxage`
        // só vale para cache COMPARTILHADO. Sem `max-age`, o navegador não
        // recebe prazo nenhum e decide por heurística própria, enquanto o
        // `public` autoriza explicitamente qualquer cache a guardar, incluindo
        // proxy corporativo e navegador de máquina compartilhada.
        //
        // Por que isso importa NESTA rota e não é purismo: ela devolve o texto
        // livre do TSE, e em 22/Ago ela estava servindo 2 CPFs válidos. Depois
        // de redigir no banco, a leitura pública continuou entregando o CPF por
        // mais alguns minutos, de cache. Cache sem prazo no cliente transforma
        // "corrigido agora" em "corrigido quando o navegador resolver".
        //
        // `max-age=0` + `must-revalidate`: o navegador sempre confere antes de
        // reusar. A CDN segue cacheando 5 min, que é o que dá o ganho real, e
        // uma correção na origem passa a valer em minutos e não em heurística.
        // Mesma forma já usada em /api/afos-daily/latest.
        'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=600, must-revalidate',
        // A casa declara o cache de CDN em cabeçalho PRÓPRIO (ver
        // app/lib/cache/headers.ts). Sem eles, a Vercel deriva do Cache-Control
        // e o `max-age=0` acima poderia encurtar o cache de borda sem querer.
        'CDN-Cache-Control': 'max-age=300, stale-while-revalidate=600',
        'Vercel-CDN-Cache-Control': 'max-age=300, stale-while-revalidate=600',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('[polls/tse] Error:', error)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
