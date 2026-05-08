/**
 * Cron Job: /api/cron/refresh-polls
 *
 * Executado diariamente pela Vercel.
 * Baixa pesquisas eleitorais do TSE (dados abertos), persiste no Neon,
 * e gera cruzamento com Polymarket.
 *
 * Fluxo:
 *   Vercel Cron (diário) → TSE CDN → parse CSV → Neon (research schema)
 *   Pesquisas recentes (15 dias) cruzadas com odds Polymarket
 *   Pesquisas históricas armazenadas para consulta futura
 */

import { NextResponse } from 'next/server'
import { fetchTSEPolls, filterRecentPolls, filterHistoricalPolls } from '../../../../lib/tse/ingest'
import { persistPolls } from '../../../../lib/tse/persist'
import { generateCrossAnalysis } from '../../../../lib/tse/cross-polymarket'
import { buildNoCacheHeaders } from '../../../lib/cache/headers'
import { audit } from '../../../../lib/audit'

export async function GET(request: Request) {
  const startTime = Date.now()

  // Auth — defense in depth: require Bearer always. Vercel injects CRON_SECRET
  // automatically for scheduled crons. Removed x-vercel-cron bypass.
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  const isAuthorized = !!(cronSecret && authHeader === `Bearer ${cronSecret}`)

  if (process.env.VERCEL && !isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('[cron/refresh-polls] Starting TSE ingest...')

    // 1. Baixar e parsear pesquisas do TSE
    const allPolls = await fetchTSEPolls(2026)
    console.log(`[cron/refresh-polls] TSE returned ${allPolls.length} presidential polls`)

    // 2. Separar recentes (15 dias) vs históricas
    const recentPolls = filterRecentPolls(allPolls, 15)
    const historicalPolls = filterHistoricalPolls(allPolls, 15)

    // 3. Persistir TODAS no banco (idempotente por protocolo)
    const { inserted, skipped } = await persistPolls(allPolls, 'tse_daily')

    // 4. Buscar odds atuais do Polymarket para cruzamento
    let polyOdds: { candidate: string; probability: number }[] = []
    try {
      const polyRes = await fetch(
        process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}/api/polymarket`
          : 'http://localhost:3000/api/polymarket',
        { signal: AbortSignal.timeout(10000) }
      )
      if (polyRes.ok) {
        const polyData = await polyRes.json()
        const markets = polyData?.presidential?.markets || []
        // /api/polymarket retorna outcomePrices: [yesStr, noStr] — não yesPrice numérico.
        // Bug fix 08/Mai: extrair yesPrice de outcomePrices[0] antes de filtrar/mapear.
        polyOdds = markets
          .map((m: { question?: string; outcomePrices?: string[]; closed?: boolean }) => ({
            question: m.question || '',
            yesPrice: parseFloat(m.outcomePrices?.[0] ?? '0'),
            closed: !!m.closed,
          }))
          .filter((m: { yesPrice: number; closed: boolean }) => m.yesPrice > 0.005 && !m.closed)
          .map((m: { question: string; yesPrice: number }) => ({
            candidate: m.question.replace(/^Will\s+/i, '').replace(/\s+(win|finish|be).*/i, '').trim(),
            probability: Math.round(m.yesPrice * 1000) / 10,
          }))
          .slice(0, 10)
      }
    } catch {
      console.warn('[cron/refresh-polls] Polymarket fetch failed, cross-analysis without odds')
    }

    // 5. Gerar cruzamento
    const cross = generateCrossAnalysis(recentPolls, polyOdds)

    audit('tse_ingest_completed', 'research', 'cron', {
      after: { total: allPolls.length, recent: recentPolls.length, inserted, skipped },
    })

    const elapsed = Date.now() - startTime

    return NextResponse.json({
      ok: true,
      elapsed,
      total: allPolls.length,
      recent: recentPolls.length,
      historical: historicalPolls.length,
      inserted,
      skipped,
      crossAnalysis: {
        totalRecent: cross.totalPolls,
        topInstitutes: cross.topInstitutes.slice(0, 5),
        polymarketCandidates: cross.polymarketSnapshot.length,
        freshPolls: cross.recentPolls.filter(p => p.status === 'fresh').length,
      },
    }, { headers: buildNoCacheHeaders() })
  } catch (error) {
    console.error('[cron/refresh-polls] Error:', error)
    return NextResponse.json(
      { ok: false, error: 'ingest_failed', elapsed: Date.now() - startTime },
      { status: 500, headers: buildNoCacheHeaders() }
    )
  }
}
