/**
 * Shared payload optimization for global map data.
 *
 * Used by both /api/global-map (fallback) and /api/cron/refresh-elections
 * to produce the same compact JSON shape for the frontend.
 */

import type { CountryAggregation } from './bootstrap';

export function optimizePayload(countries: CountryAggregation[]) {
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
