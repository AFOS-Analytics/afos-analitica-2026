/**
 * Cron Job: /api/cron/refresh-elections
 *
 * Executado automaticamente pela Vercel a cada 1 minuto.
 * Busca TODOS os mercados do Polymarket em PARALELO e grava no Vercel KV.
 *
 * Fluxo:
 *   Vercel Cron (cada 60s) → esta rota → Polymarket (18 paralelo) → KV
 *   Nenhum usuário é impactado por este processo.
 *   /api/global-map lê do KV (<1ms) em vez de chamar Polymarket.
 *
 * Segurança:
 *   Vercel envia header CRON_SECRET para autenticar.
 *   Em dev local, aceita qualquer request.
 */

import { NextResponse } from 'next/server';
import { aggregateElectionData } from '../../../lib/polymarket/bootstrap';
import { writeGlobalMapData, isKvAvailable } from '../../../lib/kv';
import { buildNoCacheHeaders } from '../../../lib/cache/headers';
import type { CountryAggregation } from '../../../lib/polymarket/bootstrap';

// Otimizar payload antes de gravar no KV (mesmo formato do api/global-map)
function optimizeForKv(countries: CountryAggregation[]) {
  return countries.map(c => ({
    iso3: c.iso3,
    n: c.countryName,
    f: c.flag,
    d: c.electionDate,
    t: c.electionType,
    p: c.probability,
    lc: c.leadCandidate,
    v: c.volumeUsd,
    s: c.status,
    mc: c.markets.length,
    cs: c.markets
      .find(m => m.isPrimary)?.candidates
      .slice(0, 5)
      .map(cd => ({ n: cd.name, p: cd.probability, v: cd.volumeUsd })) || [],
  }));
}

export async function GET(request: Request) {
  const startTime = Date.now();

  // Verificar autenticação do cron (em produção)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    console.warn('[cron] Requisição não autenticada bloqueada');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[cron] Iniciando refresh de dados eleitorais...');

    // 1. Buscar dados do Polymarket
    const result = await aggregateElectionData();

    if (result.fetchedMarkets === 0) {
      console.warn('[cron] ZERO mercados — KV não atualizado');
      return NextResponse.json(
        { ok: false, reason: 'zero-markets', elapsed: Date.now() - startTime },
        { status: 200, headers: buildNoCacheHeaders() }
      );
    }

    // 2. Otimizar e gravar no KV
    const optimized = optimizeForKv(result.countries);
    const payload = {
      c: optimized,
      at: result.updatedAt,
      stale: result.staleData,
      fetched: result.fetchedMarkets,
      total: result.totalMarkets,
    };

    const kvSuccess = await writeGlobalMapData(payload);

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
