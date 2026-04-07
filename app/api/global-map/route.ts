/**
 * API Route: /api/global-map
 *
 * Returns aggregated election data from Polymarket, normalized by country.
 * Implements ISR caching (1 hour) with stale-while-revalidate.
 *
 * Response shape:
 * {
 *   countries: CountryAggregation[],
 *   updatedAt: string (ISO),
 *   fetchedMarkets: number,
 *   totalMarkets: number,
 *   staleData: boolean,
 *   errors: string[],
 * }
 */

import { NextResponse } from 'next/server';
import { aggregateElectionData } from '../../lib/polymarket/bootstrap';

export const revalidate = 3600; // 1 hour ISR

// In-memory cache for degraded mode
let lastSuccessfulResult: Awaited<ReturnType<typeof aggregateElectionData>> | null = null;

export async function GET() {
  try {
    const result = await aggregateElectionData();

    // Cache successful results for degraded mode
    if (result.fetchedMarkets > 0) {
      lastSuccessfulResult = result;
    }

    // If aggregation returned zero markets but we have cached data
    if (result.fetchedMarkets === 0 && lastSuccessfulResult) {
      console.warn('[api/global-map] Zero markets fetched — serving cached data');
      return NextResponse.json(
        {
          ...lastSuccessfulResult,
          staleData: true,
          _cached: true,
          _originalUpdatedAt: lastSuccessfulResult.updatedAt,
          updatedAt: new Date().toISOString(),
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
            'X-Data-Status': 'stale',
          },
        }
      );
    }

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        'X-Data-Status': result.staleData ? 'partial' : 'fresh',
      },
    });
  } catch (error) {
    console.error('[api/global-map] Unhandled error:', error);

    // Serve cached data if available
    if (lastSuccessfulResult) {
      console.warn('[api/global-map] Serving cached data after error');
      return NextResponse.json(
        {
          ...lastSuccessfulResult,
          staleData: true,
          _cached: true,
          _error: true,
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
            'X-Data-Status': 'error-fallback',
          },
        }
      );
    }

    // No cache, no data — return empty structure
    return NextResponse.json(
      {
        countries: [],
        updatedAt: new Date().toISOString(),
        fetchedMarkets: 0,
        totalMarkets: 0,
        staleData: true,
        errors: ['Aggregation failed and no cached data available'],
      },
      {
        status: 503,
        headers: {
          'Retry-After': '300',
          'X-Data-Status': 'unavailable',
        },
      }
    );
  }
}
