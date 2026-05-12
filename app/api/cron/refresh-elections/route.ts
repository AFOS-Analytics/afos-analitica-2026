/**
 * Cron Job: /api/cron/refresh-elections
 *
 * Vercel cron (30min) → Polymarket (18 paralelo) → KV (caminho quente) + Neon (arquivo histórico).
 * Usuários leem do KV em <1ms. Neon write é fire-and-forget — falha não bloqueia.
 */

import { NextResponse } from 'next/server';
import { aggregateElectionData } from '../../../lib/polymarket/bootstrap';
import { writeGlobalMapData } from '../../../lib/kv';
import { buildNoCacheHeaders } from '../../../lib/cache/headers';
import { optimizePayload } from '../../../lib/polymarket/normalize';
import { persistMarketData } from '../../../lib/polymarket/persist';
import { requireCronAuth } from '../../../../lib/cron/auth';

export const maxDuration = 60;

export async function GET(request: Request) {
  const unauthorized = requireCronAuth(request);
  if (unauthorized) return unauthorized;
  const startTime = Date.now();

  try {
    console.log('[cron] Iniciando refresh de dados eleitorais...');

    const result = await aggregateElectionData();

    if (result.fetchedMarkets === 0) {
      console.warn('[cron] ZERO mercados — KV e Neon não atualizados');
      // 503 garante alerta no monitoring/UptimeRobot (200 seria silencioso).
      const { sendCronFailureAlert } = await import('../../../lib/cron/health-alerts')
      sendCronFailureAlert('refresh-elections', 'zero-markets', Date.now() - startTime).catch(() => {})
      return NextResponse.json(
        { ok: false, reason: 'zero-markets', elapsed: Date.now() - startTime },
        { status: 503, headers: buildNoCacheHeaders() }
      );
    }

    const payload = {
      c: optimizePayload(result.countries),
      at: result.updatedAt,
      stale: result.staleData,
      fetched: result.fetchedMarkets,
      total: result.totalMarkets,
    };

    const kvSuccess = await writeGlobalMapData(payload);

    // Snapshot histórico no Neon — fire-and-forget. shouldPersist() em
    // persist.ts aplica tier inteligente (hot/warm/cold) por mercado.
    persistMarketData(result.countries).catch((err) => {
      console.warn('[cron] Neon persist failed:', err instanceof Error ? err.message : err);
    });

    const elapsed = Date.now() - startTime;
    const status = kvSuccess ? 'OK' : 'FAIL';
    console.log(`[cron] Refresh ${status} — ${result.fetchedMarkets}/${result.totalMarkets} mercados, ${elapsed}ms`);

    // HTTP 500 quando KV falha: monitoring (Vercel/UptimeRobot) captura.
    // Usuários cairão no fallback Polymarket direto até KV se recuperar.
    const httpStatus = kvSuccess ? 200 : 500;
    return NextResponse.json(
      {
        ok: kvSuccess,
        ...(kvSuccess ? {} : { reason: 'kv-write-failed' }),
        markets: `${result.fetchedMarkets}/${result.totalMarkets}`,
        countries: result.countries.length,
        kv: kvSuccess,
        elapsed,
      },
      { status: httpStatus, headers: buildNoCacheHeaders() }
    );
  } catch (error) {
    console.error('[cron] Erro fatal:', error);
    return NextResponse.json(
      { ok: false, error: 'internal', elapsed: Date.now() - startTime },
      { status: 500, headers: buildNoCacheHeaders() }
    );
  }
}
