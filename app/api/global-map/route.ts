/**
 * API Route: /api/global-map
 *
 * CAMINHO RÁPIDO (KV):   request → read KV (<1ms) → response
 * CAMINHO FALLBACK:      request → Polymarket direct → response
 * ÚLTIMO RECURSO:        503 com Retry-After (cliente tenta de novo)
 *
 * KV é escrito pelo cron /api/cron/refresh-elections a cada 5min.
 */

import { NextResponse } from 'next/server';
import { readGlobalMapData, isKvAvailable } from '../../lib/kv';
import { aggregateElectionData } from '../../lib/polymarket/bootstrap';
import { optimizePayload } from '../../lib/polymarket/normalize';
import { buildCacheHeaders, buildNoCacheHeaders, CACHE_GLOBAL_MAP } from '../../lib/cache/headers';

// Edge runtime: latência ~3x menor que serverless, custo menor.
// Safe — rota só usa fetch() (Upstash REST + Polymarket). Zero APIs Node.
// Cache via Cache-Control headers (buildCacheHeaders), não ISR.
export const runtime = 'edge';

export async function GET() {
  // ─── CAMINHO 1: KV (rápido) ────────────────────────────────────────
  if (isKvAvailable()) {
    try {
      const kvResult = await readGlobalMapData<Record<string, unknown>>();
      if (kvResult?.data) {
        return NextResponse.json(kvResult.data, {
          status: 200,
          headers: {
            ...buildCacheHeaders(CACHE_GLOBAL_MAP, 'fresh'),
            'X-Source': 'kv',
            'X-KV-Timestamp': kvResult.timestamp,
          },
        });
      }
      console.warn('[api/global-map] KV vazio — fallback direto ao Polymarket');
    } catch (error) {
      console.error('[api/global-map] KV read falhou:', error);
    }
  }

  // ─── CAMINHO 2: Polymarket direto (fallback) ──────────────────────
  try {
    const result = await aggregateElectionData();
    if (result.fetchedMarkets > 0) {
      return NextResponse.json(
        { c: optimizePayload(result.countries), at: result.updatedAt, stale: result.staleData },
        {
          status: 200,
          headers: {
            ...buildCacheHeaders(CACHE_GLOBAL_MAP, result.staleData ? 'partial' : 'fresh'),
            'X-Source': 'direct',
          },
        },
      );
    }
    console.warn('[api/global-map] Polymarket retornou 0 mercados');
  } catch (error) {
    console.error('[api/global-map] Fallback direto falhou:', error);
  }

  // ─── CAMINHO 3: Sem dados (503 com Retry-After) ───────────────────
  return NextResponse.json(
    { c: [], at: new Date().toISOString(), stale: true, error: 'unavailable' },
    { status: 503, headers: { ...buildNoCacheHeaders(), 'Retry-After': '60' } },
  );
}
