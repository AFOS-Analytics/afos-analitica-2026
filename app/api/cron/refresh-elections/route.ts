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

    // Snapshot histórico no Neon. AGUARDADO de propósito, corrigido em 28/Jul/2026.
    //
    // 🔴 O QUE ESTAVA ERRADO: isto era fire-and-forget (sem await) e a resposta
    // voltava antes de a gravação terminar. Em serverless, devolver a resposta
    // autoriza a plataforma a congelar a instância, e o resto da promise morre no
    // meio. O sintoma medido em 28/Jul: 7 mercados NOVOS, que não tinham chave de
    // dedup e portanto tinham obrigação de gravar, saíram do cron com ZERO linha.
    // Como os países são percorridos em ordem, os últimos da fila eram os que mais
    // perdiam. Arquivo histórico não se recupera depois, então perda silenciosa
    // aqui é o pior defeito possível.
    //
    // O caminho quente do usuário já foi escrito no KV ACIMA, logo esperar aqui não
    // atrasa ninguém. Se a gravação falhar ou estourar o tempo, aparece na resposta
    // em vez de sumir.
    const persist = await persistMarketData(result.countries).catch((err) => {
      console.warn('[cron] Neon persist failed:', err instanceof Error ? err.message : err);
      return { persisted: 0, skipped: 0, errors: -1 };
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
        // Sem isto, o resultado da gravação era descartado e ninguém via que ela
        // não estava acontecendo. Observabilidade é parte da correção.
        persist,
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
