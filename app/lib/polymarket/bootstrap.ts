/**
 * Data Aggregator
 *
 * Orchestrates the full pipeline:
 * 1. Fetch all registered markets from Polymarket
 * 2. Map markets to countries via the registry
 * 3. Aggregate into CountryMarketSummary[]
 * 4. Handle partial failures gracefully
 */

import type { ParsedEvent, ParsedMarket } from './client';
import { fetchEventsBySlugs } from './client';
import {
  ELECTION_REGISTRY,
  getTrackedCountries,
  getEntriesByCountry,
  type ElectionRegistryEntry,
} from './country-market-map';

// ─── Output Types ───────────────────────────────────────────────────

export interface MarketSummary {
  slug: string;
  title: string;
  electionType: string;
  isPrimary: boolean;
  totalVolume: number;
  candidates: CandidateSummary[];
}

export interface CandidateSummary {
  name: string;
  probability: number; // 0-100
  volumeUsd: number;
}

export interface CountryAggregation {
  iso3: string;
  countryName: string;
  flag: string;
  electionDate: string;
  electionType: string; // From primary market
  probability: number | null; // Lead candidate % from primary market
  leadCandidate: string | null;
  volumeUsd: number; // Sum of all markets for this country
  status: 'live' | 'upcoming' | 'resolved' | 'no-data';
  markets: MarketSummary[];
}

export interface AggregationResult {
  countries: CountryAggregation[];
  updatedAt: string;
  fetchedMarkets: number;
  totalMarkets: number;
  staleData: boolean;
  errors: string[];
}

// ─── Candidate Name Extraction ──────────────────────────────────────

function extractCandidateName(question: string): string {
  const q = question || '';

  // Inflation ranges
  const inflLess = q.match(/less than (\d+\.\d+%)/);
  if (inflLess) return `< ${inflLess[1]}`;
  const inflRange = q.match(/between (\d+\.\d+%) and (\d+\.\d+%)/);
  if (inflRange) return `${inflRange[1]} – ${inflRange[2]}`;
  const inflAbove = q.match(/at least (\d+\.\d+%)/);
  if (inflAbove) return `≥ ${inflAbove[1]}`;

  // Senate / party markets
  const partyMatch = q.match(/Will (.+?) \((\w+)\) win the most seats/);
  if (partyMatch) return partyMatch[2]; // Return party abbreviation

  // STF / impeachment
  if (/STF|Justice.*removed.*impeachment/i.test(q)) return 'Yes (Impeachment)';

  // Standard "Will X win/finish..."
  const candMatch = q.match(/Will (.+?) (?:win|finish|be)/);
  if (candMatch) {
    let name = candMatch[1];
    if (name.includes('Carlos Roberto Massa')) return 'Ratinho Jr.';
    if (name.includes('Luiz Inácio Lula da Silva')) return 'Lula';
    return name.trim();
  }

  return q.slice(0, 50);
}

// ─── Market → Candidates ────────────────────────────────────────────

function extractCandidates(markets: ParsedMarket[]): CandidateSummary[] {
  const candidates: CandidateSummary[] = [];

  for (const m of markets) {
    if (m.closed) continue;
    if (m.yesPrice < 0.005) continue; // Filter noise

    candidates.push({
      name: extractCandidateName(m.question),
      probability: Math.round(m.yesPrice * 1000) / 10, // e.g. 0.42 → 42.0
      volumeUsd: Math.round(m.volume),
    });
  }

  // Sort by probability descending
  candidates.sort((a, b) => b.probability - a.probability);
  return candidates;
}

// ─── Status Resolution ──────────────────────────────────────────────

function resolveStatus(
  event: ParsedEvent | null,
  entry: ElectionRegistryEntry
): 'live' | 'upcoming' | 'resolved' | 'no-data' {
  if (!event) return 'no-data';
  if (event.closed) return 'resolved';
  if (!event.active) return 'upcoming';

  const hasActiveCandidates = event.markets.some(m => !m.closed && m.yesPrice > 0.005);
  if (!hasActiveCandidates) return 'upcoming';

  return 'live';
}

// ─── Main Aggregation ───────────────────────────────────────────────

export async function aggregateElectionData(): Promise<AggregationResult> {
  const startTime = Date.now();
  const errors: string[] = [];

  // 1. Get all slugs from the registry
  const allSlugs = ELECTION_REGISTRY.map(e => e.slug);
  const totalMarkets = allSlugs.length;

  console.log(`[bootstrap] Starting aggregation — ${totalMarkets} markets across ${getTrackedCountries().length} countries`);

  // 2. Fetch all events from Polymarket
  const eventMap = await fetchEventsBySlugs(allSlugs);
  const fetchedMarkets = eventMap.size;

  if (fetchedMarkets === 0) {
    console.error('[bootstrap] ZERO markets fetched — returning no-data fallback');
    errors.push('All Polymarket requests failed');
  }

  const staleData = fetchedMarkets < totalMarkets * 0.5; // Less than 50% = stale
  if (staleData) {
    console.warn(`[bootstrap] Stale data: only ${fetchedMarkets}/${totalMarkets} markets fetched`);
  }

  // 3. Aggregate by country
  const countries: CountryAggregation[] = [];

  for (const iso3 of getTrackedCountries()) {
    const entries = getEntriesByCountry(iso3);
    if (entries.length === 0) continue;

    const primaryEntry = entries.find(e => e.isPrimary) || entries[0];
    const marketSummaries: MarketSummary[] = [];
    let totalCountryVolume = 0;

    for (const entry of entries) {
      const event = eventMap.get(entry.slug);
      if (!event) continue;

      const candidates = extractCandidates(event.markets);
      const summary: MarketSummary = {
        slug: entry.slug,
        title: event.title,
        electionType: entry.electionType,
        isPrimary: entry.isPrimary,
        totalVolume: Math.round(event.totalVolume),
        candidates,
      };

      marketSummaries.push(summary);
      totalCountryVolume += event.totalVolume;
    }

    // Determine status from primary market
    const primaryEvent = eventMap.get(primaryEntry.slug) || null;
    const status = resolveStatus(primaryEvent, primaryEntry);

    // Get lead candidate from primary market
    const primaryMarket = marketSummaries.find(m => m.isPrimary);
    const leadCandidate = primaryMarket?.candidates[0]?.name || null;
    const probability = primaryMarket?.candidates[0]?.probability || null;

    countries.push({
      iso3,
      countryName: primaryEntry.countryName,
      flag: primaryEntry.flag,
      electionDate: primaryEntry.electionDate,
      electionType: primaryEntry.electionType,
      probability,
      leadCandidate,
      volumeUsd: Math.round(totalCountryVolume),
      status,
      markets: marketSummaries,
    });
  }

  // Sort: live first, then by volume
  countries.sort((a, b) => {
    const statusOrder = { live: 0, upcoming: 1, 'no-data': 2, resolved: 3 };
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    return (b.volumeUsd || 0) - (a.volumeUsd || 0);
  });

  const elapsed = Date.now() - startTime;
  console.log(`[bootstrap] Aggregation complete — ${countries.length} countries, ${fetchedMarkets}/${totalMarkets} markets, ${elapsed}ms`);

  return {
    countries,
    updatedAt: new Date().toISOString(),
    fetchedMarkets,
    totalMarkets,
    staleData,
    errors,
  };
}
