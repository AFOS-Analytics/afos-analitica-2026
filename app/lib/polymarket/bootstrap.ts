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

function extractCandidateName(question: string): string {
  const q = question || '';

  // Inflation ranges
  const inflLess = q.match(/less than (\d+\.\d+%)/);
  if (inflLess) return `< ${inflLess[1]}`;
  const inflRange = q.match(/between (\d+\.\d+%) and (\d+\.\d+%)/);
  if (inflRange) return `${inflRange[1]} – ${inflRange[2]}`;
  const inflAbove = q.match(/at least (\d+\.\d+%)/);
  if (inflAbove) return `≥ ${inflAbove[1]}`;

  // ── Mercados de FAIXA (distribuição), acrescentados em 28/Jul/2026 ─────────
  //
  // 🔴 POR QUE EXISTEM: sem eles, TODAS as faixas de um mesmo mercado voltavam
  // com o MESMO nome. O padrão genérico `Will (.+?) (win|finish|be)` devolvia
  // "the Democratic Party" para as 9 faixas democratas do mercado de margem do
  // voto popular, e "there" para as 12 faixas de comparecimento. Como o nome vira
  // `outcomeKey`, que é chave única por mercado, as faixas COLAPSAVAM: 14 viravam
  // 3, 12 viravam 1. Medido em 28/Jul. A distribuição é justamente o dado desses
  // mercados, e a soma dela é o critério de maturidade do de margem, então
  // colapsar destrói exatamente o que se queria guardar.
  //
  // Vêm ANTES do padrão genérico de propósito, e são específicos o bastante para
  // não tocarem em mercado de candidato (exigem "popular vote", "House seats",
  // "governorships" ou "votes cast").

  // Margem do voto popular: "...by between 2% and 4%?" / "...by 16% or more?"
  const margemRange = q.match(/(Democratic|Republican) Party win the popular vote.*?by between (\d+)% and (\d+)%/);
  if (margemRange) return `${margemRange[1][0]}+${margemRange[2]}–${margemRange[3]}`;
  const margemAcima = q.match(/(Democratic|Republican) Party win the popular vote.*?by (\d+)% or more/);
  if (margemAcima) return `${margemAcima[1][0]}+${margemAcima[2]} ou mais`;

  // Cadeiras e governos: "hold between 190 and 194 House seats" / "fewer than 22
  // governorships" / "exactly 22 or 23 governorships" / "below 190 House seats"
  const unidade = /House seats/.test(q) ? 'cad.' : /governorships/.test(q) ? 'gov.' : /Senate seats/.test(q) ? 'cad.' : null;
  if (unidade) {
    const entre = q.match(/between (\d+) and (\d+)/);
    if (entre) return `${entre[1]}–${entre[2]} ${unidade}`;
    const exato = q.match(/exactly (\d+) or (\d+)/);
    if (exato) return `${exato[1]} ou ${exato[2]} ${unidade}`;
    const abaixo = q.match(/(?:below|fewer than|less than) (\d+)/);
    if (abaixo) return `< ${abaixo[1]} ${unidade}`;
    const acima = q.match(/(?:above|more than|at least) (\d+)/);
    if (acima) return `> ${acima[1]} ${unidade}`;
  }

  // Comparecimento: "between 85m and 90m votes cast" / "less than 85m votes cast"
  if (/votes cast/.test(q)) {
    const entre = q.match(/between (\d+)m and (\d+)m/);
    if (entre) return `${entre[1]}–${entre[2]}m votos`;
    const menos = q.match(/less than (\d+)m/);
    if (menos) return `< ${menos[1]}m votos`;
    const mais = q.match(/more than (\d+)m/);
    if (mais) return `> ${mais[1]}m votos`;
  }

  // "Will any other outcome occur...": existe em todo mercado de faixa e é a
  // válvula de escape da distribuição. Precisa de nome próprio e curto.
  if (/any other outcome/i.test(q)) return 'Outro resultado';

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
