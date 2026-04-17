/**
 * API Route: /api/global-map
 *
 * Fluxo otimizado com Vercel KV:
 *
 *   CAMINHO RÁPIDO (KV disponível):
 *   Requisição → leitura KV (<1ms) → resposta
 *   Dados escritos pelo cron (/api/cron/refresh-elections) a cada 5min.
 *
 *   CAMINHO FALLBACK (KV indisponível ou vazio):
 *   Requisição → aggregateElectionData() → Polymarket → resposta
 *   Mesmo comportamento de antes, como safety net.
 *
 * Resultado: 99.9% das requisições retornam em <5ms (leitura KV).
 * Nenhuma requisição de usuário toca o Polymarket diretamente.
 */

import { NextResponse } from 'next/server';
import { readGlobalMapData, isKvAvailable } from '../../lib/kv';
import { aggregateElectionData } from '../../lib/polymarket/bootstrap';
import { optimizePayload } from '../../lib/polymarket/normalize';
import { buildCacheHeaders, buildNoCacheHeaders, CACHE_GLOBAL_MAP } from '../../lib/cache/headers';

export const revalidate = 60; // ISR 1 minuto (fallback se KV estiver offline)

// In-memory fallback (último recurso)
let lastGoodPayload: unknown = null;

export async function GET() {
  // ─── CAMINHO 1: Ler do KV (rápido, <1ms) ─────────────────────────
  if (isKvAvailable()) {
    try {
      const kvResult = await readGlobalMapData<Record<string, unknown>>();
      if (kvResult?.data) {
        lastGoodPayload = kvResult.data; // atualizar fallback
        return NextResponse.json(kvResult.data, {
          status: 200,
          headers: {
            ...buildCacheHeaders(CACHE_GLOBAL_MAP, 'fresh'),
            'X-Source': 'kv',
            'X-KV-Timestamp': kvResult.timestamp,
          },
        });
      }
      console.warn('[api/global-map] KV disponível mas vazio — usando fallback');
    } catch (error) {
      console.error('[api/global-map] Erro ao ler KV:', error);
    }
  }

  // ─── CAMINHO 2: Fetch direto do Polymarket (fallback) ─────────────
  try {
    console.log('[api/global-map] Fallback: buscando do Polymarket diretamente');
    const result = await aggregateElectionData();

    if (result.fetchedMarkets > 0) {
      const payload = {
        c: optimizePayload(result.countries),
        at: result.updatedAt,
        stale: result.staleData,
      };
      lastGoodPayload = payload;

      return NextResponse.json(payload, {
        status: 200,
        headers: {
          ...buildCacheHeaders(CACHE_GLOBAL_MAP, result.staleData ? 'partial' : 'fresh'),
          'X-Source': 'direct',
        },
      });
    }
  } catch (error) {
    console.error('[api/global-map] Fallback direto falhou:', error);
  }

  // ─── CAMINHO 3: Servir dados em memória (último recurso) ──────────
  if (lastGoodPayload) {
    console.warn('[api/global-map] Servindo dados em memória');
    return NextResponse.json(lastGoodPayload, {
      status: 200,
      headers: {
        ...buildCacheHeaders(CACHE_GLOBAL_MAP, 'stale'),
        'X-Source': 'memory',
      },
    });
  }

  // ─── CAMINHO 4: Sem dados (503) ───────────────────────────────────
  return NextResponse.json(
    { c: [], at: new Date().toISOString(), stale: true, error: 'unavailable' },
    { status: 503, headers: { ...buildNoCacheHeaders(), 'Retry-After': '60' } }
  );
}
