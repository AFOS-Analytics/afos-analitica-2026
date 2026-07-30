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
import { extractOutcomeLabel } from './outcome-label';
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
  /**
   * Situação DESTE mercado, resolvida do evento dele.
   *
   * Antes de 28/Jul/2026 a coleta usava a situação do PAÍS, que vem do mercado
   * primário. Nos EUA o primário é a presidencial de 2028, então um mercado sem
   * relação nenhuma com as midterms decidia se elas eram coletadas ou não. Um
   * primário que fechasse levaria junto a coleta de todos os outros do país.
   */
  status: 'live' | 'upcoming' | 'resolved' | 'no-data';
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
  marketCount: number;
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
//
// A regra mora em `outcome-label.ts`, compartilhada com a tela. Ficou
// duplicada até 30/Jul e as duas cópias divergiram: as faixas americanas
// ganharam regra só do lado da série. Ver o cabeçalho daquele arquivo.

export function extractCandidateName(question: string): string {
  return extractOutcomeLabel(question);
}

// ─── Market → Candidates ────────────────────────────────────────────

/**
 * Piso de ruído. Em mercado de candidato, 0,5% corta a cauda de nomes que não
 * disputam nada. Em mercado de DISTRIBUIÇÃO, a cauda fina é parte do dado: cortar
 * faz a soma das faixas mentir para baixo, e é a soma que diz se o mercado
 * amadureceu. Por isso o piso cai para 0,05% quando o registro declara faixas.
 */
const PISO_RUIDO_CANDIDATO = 0.005;
const PISO_RUIDO_DISTRIBUICAO = 0.0005;

function extractCandidates(markets: ParsedMarket[], isDistribution = false): CandidateSummary[] {
  const candidates: CandidateSummary[] = [];
  const piso = isDistribution ? PISO_RUIDO_DISTRIBUICAO : PISO_RUIDO_CANDIDATO;

  for (const m of markets) {
    if (m.closed) continue;
    if (m.yesPrice < piso) continue; // Filter noise

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

  // 1. Get all enabled slugs from the registry
  const allSlugs = ELECTION_REGISTRY.filter(e => e.enabled !== false).map(e => e.slug);
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

      const candidates = extractCandidates(event.markets, entry.isDistribution === true);
      const summary: MarketSummary = {
        slug: entry.slug,
        title: event.title,
        electionType: entry.electionType,
        isPrimary: entry.isPrimary,
        totalVolume: Math.round(event.totalVolume),
        candidates,
        status: resolveStatus(event, entry),
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
      marketCount: marketSummaries.length,
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
