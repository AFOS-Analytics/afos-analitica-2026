/**
 * Cron Job: /api/cron/persist-elections
 *
 * Executado automaticamente pela Vercel a cada 30 minutos.
 * Busca dados frescos do Polymarket e persiste snapshot histórico no Neon.
 *
 * Desacoplado de /api/cron/refresh-elections (5min, KV-only) para reduzir
 * compute hours do Neon — escrever a cada 5min mantinha o banco sempre
 * acordado (idle threshold = 5min). Com 30min, Neon fica idle ~25min entre
 * ticks e desliga automaticamente.
 *
 * Fluxo:
 *   Vercel Cron (30min) → esta rota → Polymarket (18 paralelo) → Neon upserts
 *   Usuários NÃO dependem deste processo (KV serve dados ao vivo a cada 5min).
 *
 * Segurança:
 *   Vercel envia header CRON_SECRET para autenticar.
 *   Em dev local, aceita qualquer request.
 */

import { NextResponse } from 'next/server';
import { aggregateElectionData } from '../../../lib/polymarket/bootstrap';
import { persistMarketData } from '../../../lib/polymarket/persist';
import { buildNoCacheHeaders } from '../../../lib/cache/headers';

// Polymarket fetch + Neon upserts. Timing típico ~10-20s.
export const maxDuration = 60;

export async function GET(request: Request) {
  const startTime = Date.now();

  const isVercelCron = request.headers.get('x-vercel-cron') === '1';
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  const isAuthorized = isVercelCron || (cronSecret && authHeader === `Bearer ${cronSecret}`);

  if (process.env.VERCEL && !isAuthorized) {
    console.warn('[persist-cron] Requisição não autenticada bloqueada');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[persist-cron] Iniciando snapshot histórico...');

    const result = await aggregateElectionData();

    if (result.fetchedMarkets === 0) {
      console.warn('[persist-cron] ZERO mercados — Neon não atualizado');
      return NextResponse.json(
        { ok: false, reason: 'zero-markets', elapsed: Date.now() - startTime },
        { status: 200, headers: buildNoCacheHeaders() }
      );
    }

    const persistResult = await persistMarketData(result.countries);

    const elapsed = Date.now() - startTime;
    console.log(`[persist-cron] Snapshot completo — persisted=${persistResult.persisted}, skipped=${persistResult.skipped}, errors=${persistResult.errors}, ${elapsed}ms`);

    return NextResponse.json(
      {
        ok: true,
        markets: `${result.fetchedMarkets}/${result.totalMarkets}`,
        countries: result.countries.length,
        persisted: persistResult.persisted,
        skipped: persistResult.skipped,
        errors: persistResult.errors,
        elapsed,
      },
      { status: 200, headers: buildNoCacheHeaders() }
    );
  } catch (error) {
    console.error('[persist-cron] Erro fatal:', error);
    return NextResponse.json(
      { ok: false, error: 'internal', elapsed: Date.now() - startTime },
      { status: 500, headers: buildNoCacheHeaders() }
    );
  }
}
