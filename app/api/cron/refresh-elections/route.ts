/**
 * Cron Job: /api/cron/refresh-elections
 *
 * Executado automaticamente pela Vercel a cada 30 minutos.
 * Busca TODOS os mercados do Polymarket em PARALELO, grava no Vercel KV
 * (cache rápido para usuários) e persiste snapshot histórico no Neon
 * (arquivo auditável de longo prazo).
 *
 * Cron unificado em 30min após análise de risco/custo: cron de 5min
 * exigia escrita no Redis muito frequente e cron paralelo de 30min para
 * Neon (arquitetura de 2 crons). Com 30min direto, KV e Neon ficam em
 * sincronia, simplifica a operação, reduz pressão em Vercel/Upstash sob
 * tráfego pesado e mantém Neon idle entre ticks (scale-to-zero).
 *
 * Fluxo:
 *   Vercel Cron (30min) → esta rota → Polymarket (18 paralelo) → KV + Neon
 *   Usuários servidos pelo KV (<1ms). Neon usado apenas para arquivo
 *   histórico (não bloqueia leitura do usuário).
 *
 * Segurança:
 *   Vercel envia header CRON_SECRET para autenticar.
 *   Em dev local, aceita qualquer request.
 */

import { NextResponse } from 'next/server';
import { aggregateElectionData } from '../../../lib/polymarket/bootstrap';
import { writeGlobalMapData } from '../../../lib/kv';
import { buildNoCacheHeaders } from '../../../lib/cache/headers';
import { optimizePayload } from '../../../lib/polymarket/normalize';
import { persistMarketData } from '../../../lib/polymarket/persist';

// Polymarket fetch de 18 markets em paralelo + KV write + Neon upserts.
// Timing típico <10s; 60s dá folga se Polymarket ou Neon estiverem lentos.
export const maxDuration = 60;

export async function GET(request: Request) {
  const startTime = Date.now();

  // Autenticação: Vercel injeta header automaticamente em cron jobs.
  // Em produção, bloquear qualquer request que não venha do cron da Vercel.
  const isVercelCron = request.headers.get('x-vercel-cron') === '1';
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  const isAuthorized = isVercelCron || (cronSecret && authHeader === `Bearer ${cronSecret}`);

  if (process.env.VERCEL && !isAuthorized) {
    console.warn('[cron] Requisição não autenticada bloqueada');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[cron] Iniciando refresh de dados eleitorais...');

    // 1. Buscar dados do Polymarket
    const result = await aggregateElectionData();

    if (result.fetchedMarkets === 0) {
      console.warn('[cron] ZERO mercados — KV e Neon não atualizados');
      return NextResponse.json(
        { ok: false, reason: 'zero-markets', elapsed: Date.now() - startTime },
        { status: 200, headers: buildNoCacheHeaders() }
      );
    }

    // 2. Otimizar e gravar no KV (caminho quente — usuários leem aqui)
    const optimized = optimizePayload(result.countries);
    const payload = {
      c: optimized,
      at: result.updatedAt,
      stale: result.staleData,
      fetched: result.fetchedMarkets,
      total: result.totalMarkets,
    };

    const kvSuccess = await writeGlobalMapData(payload);

    // 3. Persistir snapshot histórico no Neon (fire-and-forget — não bloqueia response).
    // shouldPersist() em persist.ts aplica tier inteligente (hot/warm/cold).
    persistMarketData(result.countries).catch((err) => {
      console.warn('[cron] Neon persist failed:', err instanceof Error ? err.message : err)
    })

    const elapsed = Date.now() - startTime;
    console.log(`[cron] Refresh completo — ${result.fetchedMarkets}/${result.totalMarkets} mercados, KV=${kvSuccess ? 'OK' : 'SKIP'}, ${elapsed}ms`);

    return NextResponse.json(
      {
        ok: true,
        markets: `${result.fetchedMarkets}/${result.totalMarkets}`,
        countries: result.countries.length,
        kv: kvSuccess,
        elapsed,
      },
      { status: 200, headers: buildNoCacheHeaders() }
    );
  } catch (error) {
    console.error('[cron] Erro fatal:', error);
    return NextResponse.json(
      { ok: false, error: 'internal', elapsed: Date.now() - startTime },
      { status: 500, headers: buildNoCacheHeaders() }
    );
  }
}
