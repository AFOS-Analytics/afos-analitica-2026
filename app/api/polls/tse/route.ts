/**
 * API Route: GET /api/polls/tse
 *
 * Retorna pesquisas TSE registradas, com opção de filtrar por período.
 * Query params:
 *   days — últimos N dias (default: 15)
 *   institute — filtrar por instituto
 */

import { NextResponse } from 'next/server'
import { getPrisma } from '../../../../lib/db'

/**
 * 🔴 LISTA BRANCA do `normalizedPayload`, instalada 22/Ago/2026.
 *
 * Antes daqui a rota fazia `...(f.normalizedPayload || {})`, espalhando o objeto
 * INTEIRO. **Foi esse espalhamento que pôs CPF no ar:** o `samplingPlan` passou
 * a ser gravado com o texto livre do TSE e virou campo público da API sem que
 * nenhuma linha de código dissesse "sirva o plano amostral". O campo não foi
 * exposto por decisão, foi exposto por ausência de decisão.
 *
 * 🔑 A régua: o que a API publica é ESCOLHA declarada, não consequência de onde
 * o dado foi parar. Campo novo no payload não aparece aqui sozinho; alguém
 * precisa acrescentá-lo nesta lista, e nesse momento pensa se deve.
 *
 * ⚖️ Esta lista tem EXATAMENTE os 18 campos que a rota já servia em 22/Ago,
 * conferidos contra os 708 registros do banco. Nada foi removido de propósito:
 * a correção é do mecanismo, não do conteúdo, e tirar campo é outra decisão.
 * `ownPoll` e `tseEnrichedFrom` só existem em 350 registros e por isso não
 * apareciam numa amostra pequena; estão aqui porque foram MEDIDOS, não vistos.
 *
 * ⚠️ Os quatro campos de texto livre do TSE (`methodology`, `samplingPlan`,
 * `controlSystem`, `statistician`) continuam saindo, porque é deles que vem a
 * auditabilidade do registro. Quem impede o CPF é a redação na ORIGEM, em
 * lib/tse/persist.ts, não a omissão do campo.
 */
const CAMPOS_PUBLICOS = [
  'institute', 'sampleSize', 'fieldStart', 'fieldEnd', 'publicationDate',
  'registrationDate', 'cost', 'uf', 'scope', 'scopeSource',
  'cnpj', 'statistician', 'conre', 'methodology', 'samplingPlan',
  'controlSystem', 'ownPoll', 'tseEnrichedFrom',
] as const

function apenasPublicos(payload: unknown): Record<string, unknown> {
  const p = (payload ?? {}) as Record<string, unknown>
  const out: Record<string, unknown> = {}
  for (const c of CAMPOS_PUBLICOS) if (c in p) out[c] = p[c]
  return out
}

export async function GET(request: Request) {
  const prisma = getPrisma()
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
        ...apenasPublicos(f.normalizedPayload),
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
