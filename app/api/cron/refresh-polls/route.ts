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
import { requireCronAuth } from '../../../../lib/cron/auth'
import { alertNewNationalPolls } from '../../../lib/cron/poll-alerts'
import { redigirSegredo } from '../../../../lib/cron/redigir'
import { avisarFalhaDeCron } from '../../../../lib/cron/alerta'

// Cron baixa CSV TSE + cruza com Polymarket. TSE CDN às vezes lento (10-30s),
// + Polymarket fetch (10s timeout) + persist Neon. Sem maxDuration explícito,
// Vercel Hobby aborta em 60s. 90s cobre pior caso TSE+Polymarket+persist.
export const maxDuration = 90

export async function GET(request: Request) {
  const unauthorized = requireCronAuth(request)
  if (unauthorized) return unauthorized
  const startTime = Date.now()

  try {
    console.log('[cron/refresh-polls] Starting TSE ingest...')

    // 1. Baixar e parsear pesquisas do TSE
    const allPolls = await fetchTSEPolls(2026)
    console.log(`[cron/refresh-polls] TSE returned ${allPolls.length} presidential polls`)

    // 2. Separar recentes (15 dias) vs históricas
    const recentPolls = filterRecentPolls(allPolls, 15)
    const historicalPolls = filterHistoricalPolls(allPolls, 15)

    // 3. Persistir TODAS no banco (idempotente por protocolo)
    const { inserted, skipped, insertedPolls } = await persistPolls(allPolls, 'tse_daily')

    // 3.1 Avisar por email as NACIONAIS novas. Nasce aqui, dentro de quem
    // insere a linha, e não numa rotina na nuvem que precisaria sair para a
    // internet buscar o próprio dado deste sistema (e falhava na lista de
    // egresso). Ver app/lib/cron/poll-alerts.ts.
    // ⚠️ Best-effort: alerta que falha NÃO derruba a ingestão. Gravar a
    // pesquisa importa mais que avisar sobre ela.
    let alertadas = 0
    try {
      alertadas = await alertNewNationalPolls(insertedPolls)
    } catch (err) {
      console.error('[cron/refresh-polls] alerta de pesquisa nacional falhou:', err)
    }

    // 4. Buscar odds atuais do Polymarket para cruzamento
    // Resolução de base URL com 3 fallbacks:
    //   1. VERCEL_PROJECT_PRODUCTION_URL — set em todos os deploys, aponta sempre ao prod canonical
    //   2. VERCEL_URL — deployment-specific (preview/branch); pode estar vazio fora da Vercel
    //   3. localhost — dev local
    // Hardcoded afos-analytics.com como último guard contra cron silenciosamente sem dados em prod.
    const baseUrl = (() => {
      if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
      if (process.env.VERCEL_ENV === 'production') return 'https://www.afos-analytics.com'
      return 'http://localhost:3000'
    })()
    let polyOdds: { candidate: string; probability: number }[] = []
    try {
      const polyRes = await fetch(
        `${baseUrl}/api/polymarket`,
        { signal: AbortSignal.timeout(10000) }
      )
      if (polyRes.ok) {
        const polyData = await polyRes.json()
        const markets = polyData?.presidential?.markets || []
        // outcomePrices é tuple [yesStr, noStr]; índice 0 é a probabilidade YES.
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
      // quantas das inseridas eram NACIONAIS e geraram email. Zero é o
      // resultado normal: na maioria dos dias não entra nacional nova.
      alertadasNacionais: alertadas,
      crossAnalysis: {
        totalRecent: cross.totalPolls,
        topInstitutes: cross.topInstitutes.slice(0, 5),
        polymarketCandidates: cross.polymarketSnapshot.length,
        freshPolls: cross.recentPolls.filter(p => p.status === 'fresh').length,
      },
    }, { headers: buildNoCacheHeaders() })
  } catch (error) {
    // Alerta por email. Este cron falhava em SILENCIO: dos sete declarados,
    // so `persist-analysis` avisava alguem. Nao bloqueia nem derruba nada.
    void avisarFalhaDeCron('refresh-polls', 'excecao nao tratada', error)
    /**
     * 🔑 O MOTIVO REAL VIAJA NA RESPOSTA, instalado em 19/Ago/2026.
     *
     * O QUE ACONTECIA. A rota devolvia só `{ok:false, error:'ingest_failed'}` e
     * jogava fora a mensagem da exceção. Em 19/Ago a ingestão falhou e levou
     * vinte minutos de investigação POR FORA para descobrir o que a rota já
     * sabia: `TSE CDN returned 403`, um bloqueio de borda da Akamai que atingia
     * até o robots.txt do domínio. Com o motivo na resposta, o mesmo diagnóstico
     * é uma linha.
     *
     * ⛔ ISTO NÃO APARECE NO PAINEL, e é decisão do André em 19/Ago. Esta rota é
     * endpoint de cron, chamada com CRON_SECRET, e nenhum componente a consome:
     * conferido por varredura em `app/`, `lib/`, `components/` e `scripts/`. O
     * leitor nunca vê relato de falha nossa, que é a regra de
     * `feedback_descrever_o_metodo_sim_relatar_a_falha_nao`.
     *
     * ⚠️ REDAÇÃO ANTES DE DEVOLVER. Mensagem de exceção pode carregar URL com
     * token, e corpo de resposta é lugar onde segredo vaza sem ninguém ver.
     *
     * 🔑 A regra mora em `lib/cron/redigir.ts` desde 19/Ago/2026. Ela nasceu
     * aqui e ficou SÓ aqui: as outras quatro rotas de cron devolviam a exceção
     * crua, e proteção que existe numa rota e falta na irmã é pior que a
     * ausência em todas, porque parece que o problema foi tratado.
     */
    const motivo = redigirSegredo(error)

    console.error('[cron/refresh-polls] Error:', error)
    return NextResponse.json(
      { ok: false, error: 'ingest_failed', motivo, elapsed: Date.now() - startTime },
      { status: 500, headers: buildNoCacheHeaders() }
    )
  }
}
