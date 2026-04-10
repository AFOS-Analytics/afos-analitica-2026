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
import type { CountryAggregation } from '../../../lib/polymarket/bootstrap';
import { writeGlobalMapData } from '../../../lib/kv';
import { buildNoCacheHeaders } from '../../../lib/cache/headers';
import { optimizePayload } from '../../../lib/polymarket/normalize';
import { prisma } from '../../../../lib/db';

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
      console.warn('[cron] ZERO mercados — KV não atualizado');
      return NextResponse.json(
        { ok: false, reason: 'zero-markets', elapsed: Date.now() - startTime },
        { status: 200, headers: buildNoCacheHeaders() }
      );
    }

    // 2. Otimizar e gravar no KV
    const optimized = optimizePayload(result.countries);
    const payload = {
      c: optimized,
      at: result.updatedAt,
      stale: result.staleData,
      fetched: result.fetchedMarkets,
      total: result.totalMarkets,
    };

    const kvSuccess = await writeGlobalMapData(payload);

    // 3. Gravar histórico no Neon (async, não bloqueia resposta)
    persistSnapshots(result.countries).catch((err) => {
      console.error('[cron] Neon snapshot write failed:', err instanceof Error ? err.message : err)
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

/**
 * Grava snapshots no Neon para histórico (market schema).
 * Cada país com mercado primário gera 1 snapshot + N candidates_odds.
 * Fire-and-forget — falha não impacta o cron.
 */
async function persistSnapshots(countries: CountryAggregation[]) {
  if (!prisma) return

  const now = new Date()

  for (const country of countries) {
    if (country.status === 'no-data') continue

    const primary = country.markets.find((m) => m.isPrimary)
    if (!primary) continue

    try {
      await prisma.marketSnapshot.create({
        data: {
          slug: primary.slug,
          country: country.iso3,
          fetchedAt: now,
          rawData: JSON.parse(JSON.stringify({
            countryName: country.countryName,
            status: country.status,
            probability: country.probability,
            leadCandidate: country.leadCandidate,
            volumeUsd: country.volumeUsd,
          })),
          odds: {
            create: primary.candidates.slice(0, 10).map((c) => ({
              candidate: c.name,
              probability: c.probability,
              volume: c.volumeUsd,
            })),
          },
        },
      })
    } catch (err) {
      console.warn(`[cron] Snapshot ${country.iso3} falhou:`, err instanceof Error ? err.message : err)
    }
  }
}
