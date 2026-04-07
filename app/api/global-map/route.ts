/**
 * API Route: /api/global-map
 *
 * Returns aggregated election data from Polymarket, normalized by country.
 * Multi-layer cache: Vercel CDN (5min) → downstream CDN (2min) → browser (1min).
 *
 * Payload is optimized: only fields the frontend needs, no raw market data.
 */

import { NextResponse } from 'next/server';
import { aggregateElectionData, type CountryAggregation } from '../../lib/polymarket/bootstrap';
import { buildCacheHeaders, buildNoCacheHeaders, CACHE_GLOBAL_MAP } from '../../lib/cache/headers';

export const revalidate = 300; // 5 minutes ISR (Vercel page cache)

// In-memory fallback for degraded mode
let lastGoodResult: ReturnType<typeof optimizePayload> | null = null;
let lastGoodAt: string | null = null;

/**
 * Strip fields the frontend doesn't need to reduce payload size.
 * Full market data is available via /api/global-map/[iso3] (future endpoint).
 */
function optimizePayload(countries: CountryAggregation[]) {
  return countries.map(c => ({
    iso3: c.iso3,
    n: c.countryName,         // short key to save bytes
    f: c.flag,
    d: c.electionDate,
    t: c.electionType,
    p: c.probability,         // lead candidate probability (0-100 or null)
    lc: c.leadCandidate,      // lead candidate name
    v: c.volumeUsd,           // total volume across all markets
    s: c.status,              // 'live' | 'upcoming' | 'resolved' | 'no-data'
    mc: c.markets.length,     // market count for this country
    // Top 5 candidates from primary market only (saves ~60% payload)
    cs: c.markets
      .find(m => m.isPrimary)?.candidates
      .slice(0, 5)
      .map(cd => ({ n: cd.name, p: cd.probability, v: cd.volumeUsd })) || [],
  }));
}

export async function GET() {
  try {
    const result = await aggregateElectionData();

    if (result.fetchedMarkets > 0) {
      lastGoodResult = optimizePayload(result.countries);
      lastGoodAt = result.updatedAt;
    }

    // Zero markets but have cache → serve stale
    if (result.fetchedMarkets === 0 && lastGoodResult) {
      console.warn('[api/global-map] Zero markets — serving cached');
      return NextResponse.json(
        { c: lastGoodResult, at: new Date().toISOString(), stale: true, _cachedFrom: lastGoodAt },
        { status: 200, headers: buildCacheHeaders(CACHE_GLOBAL_MAP, 'stale') }
      );
    }

    const payload = optimizePayload(result.countries);

    return NextResponse.json(
      { c: payload, at: result.updatedAt, stale: result.staleData },
      { status: 200, headers: buildCacheHeaders(CACHE_GLOBAL_MAP, result.staleData ? 'partial' : 'fresh') }
    );
  } catch (error) {
    console.error('[api/global-map] Error:', error);

    if (lastGoodResult) {
      return NextResponse.json(
        { c: lastGoodResult, at: new Date().toISOString(), stale: true, _error: true },
        { status: 200, headers: buildCacheHeaders(CACHE_GLOBAL_MAP, 'error-fallback') }
      );
    }

    return NextResponse.json(
      { c: [], at: new Date().toISOString(), stale: true, error: 'unavailable' },
      { status: 503, headers: { ...buildNoCacheHeaders(), 'Retry-After': '300' } }
    );
  }
}
