/**
 * Country ↔ Market Mapping Engine
 *
 * Maps Polymarket event slugs to ISO 3166-1 Alpha-3 country codes.
 * Handles: multiple markets per country, name normalization, disambiguation.
 */

// ─── Types ──────────────────────────────────────────────────────────

export interface ElectionRegistryEntry {
  slug: string;
  iso3: string;
  countryName: string;
  flag: string;
  electionDate: string;
  electionType: string;
  isPrimary: boolean; // Whether this is the "who wins" market for the country
}

// ─── Static Registry ────────────────────────────────────────────────
// Manually curated — single source of truth for slug → country mapping.
// isPrimary = true means this is the main "winner" market shown on the map.

export const ELECTION_REGISTRY: ElectionRegistryEntry[] = [
  // ── Brazil ─────────────────────────────
  { slug: 'brazil-presidential-election', iso3: 'BRA', countryName: 'Brazil', flag: '🇧🇷', electionDate: '2026-10-04', electionType: 'Presidential', isPrimary: true },
  { slug: 'brazil-presidential-election-first-round-2nd-place', iso3: 'BRA', countryName: 'Brazil', flag: '🇧🇷', electionDate: '2026-10-04', electionType: 'Presidential 1T — 2nd Place', isPrimary: false },
  { slug: 'brazil-presidential-election-first-round-3rd-place', iso3: 'BRA', countryName: 'Brazil', flag: '🇧🇷', electionDate: '2026-10-04', electionType: 'Presidential 1T — 3rd Place', isPrimary: false },
  { slug: 'any-brazil-stf-justice-removed-by-impeachment-before-2027', iso3: 'BRA', countryName: 'Brazil', flag: '🇧🇷', electionDate: '2027-01-01', electionType: 'STF Impeachment', isPrimary: false },
  { slug: 'next-brazil-senate-election-most-seats-won', iso3: 'BRA', countryName: 'Brazil', flag: '🇧🇷', electionDate: '2026-10-04', electionType: 'Senate', isPrimary: false },
  { slug: 'brazil-annual-inflation-2026', iso3: 'BRA', countryName: 'Brazil', flag: '🇧🇷', electionDate: '2026-12-31', electionType: 'Inflation 2026', isPrimary: false },

  // ── France ─────────────────────────────
  { slug: '2027-french-presidential-election', iso3: 'FRA', countryName: 'France', flag: '🇫🇷', electionDate: '2027-04-10', electionType: 'Presidential', isPrimary: true },

  // ── Germany ────────────────────────────
  { slug: 'next-german-chancellor', iso3: 'DEU', countryName: 'Germany', flag: '🇩🇪', electionDate: '2025-02-23', electionType: 'Federal Election', isPrimary: true },

  // ── United Kingdom ────────────────────
  { slug: 'next-uk-prime-minister', iso3: 'GBR', countryName: 'United Kingdom', flag: '🇬🇧', electionDate: '2029-01-01', electionType: 'General Election', isPrimary: true },

  // ── Canada ─────────────────────────────
  { slug: 'canadian-federal-election-winner', iso3: 'CAN', countryName: 'Canada', flag: '🇨🇦', electionDate: '2025-04-28', electionType: 'Federal Election', isPrimary: true },

  // ── Australia ──────────────────────────
  { slug: 'next-australian-federal-election', iso3: 'AUS', countryName: 'Australia', flag: '🇦🇺', electionDate: '2025-05-03', electionType: 'Federal Election', isPrimary: true },

  // ── South Korea ────────────────────────
  { slug: 'next-south-korean-presidential-election', iso3: 'KOR', countryName: 'South Korea', flag: '🇰🇷', electionDate: '2025-06-03', electionType: 'Presidential', isPrimary: true },

  // ── Philippines ────────────────────────
  { slug: 'philippines-midterm-elections-2025-senate', iso3: 'PHL', countryName: 'Philippines', flag: '🇵🇭', electionDate: '2025-05-12', electionType: 'Midterm Senate', isPrimary: true },

  // ── Chile ──────────────────────────────
  { slug: '2025-chilean-presidential-election', iso3: 'CHL', countryName: 'Chile', flag: '🇨🇱', electionDate: '2025-11-16', electionType: 'Presidential', isPrimary: true },

  // ── Colombia ───────────────────────────
  { slug: '2026-colombian-presidential-election', iso3: 'COL', countryName: 'Colombia', flag: '🇨🇴', electionDate: '2026-05-31', electionType: 'Presidential', isPrimary: true },

  // ── India ──────────────────────────────
  { slug: 'next-indian-general-election', iso3: 'IND', countryName: 'India', flag: '🇮🇳', electionDate: '2029-04-01', electionType: 'General Election', isPrimary: true },

  // ── Mexico ─────────────────────────────
  { slug: 'next-mexican-presidential-election', iso3: 'MEX', countryName: 'Mexico', flag: '🇲🇽', electionDate: '2030-06-01', electionType: 'Presidential', isPrimary: true },

  // ── Nigeria ────────────────────────────
  { slug: '2027-nigerian-presidential-election', iso3: 'NGA', countryName: 'Nigeria', flag: '🇳🇬', electionDate: '2027-02-25', electionType: 'Presidential', isPrimary: true },
];

// ─── Country Name Aliases ───────────────────────────────────────────
// For fuzzy matching of event titles when slugs are unknown.

const COUNTRY_ALIASES: Record<string, string> = {
  'united states': 'USA', 'us': 'USA', 'america': 'USA', 'usa': 'USA',
  'united kingdom': 'GBR', 'uk': 'GBR', 'great britain': 'GBR', 'britain': 'GBR',
  'south korea': 'KOR', 'korea': 'KOR', 'republic of korea': 'KOR',
  'brazil': 'BRA', 'brasil': 'BRA',
  'france': 'FRA', 'french': 'FRA',
  'germany': 'DEU', 'german': 'DEU',
  'canada': 'CAN', 'canadian': 'CAN',
  'australia': 'AUS', 'australian': 'AUS',
  'india': 'IND', 'indian': 'IND',
  'mexico': 'MEX', 'mexican': 'MEX',
  'colombia': 'COL', 'colombian': 'COL',
  'chile': 'CHL', 'chilean': 'CHL',
  'nigeria': 'NGA', 'nigerian': 'NGA',
  'philippines': 'PHL', 'philippine': 'PHL', 'filipino': 'PHL',
  'japan': 'JPN', 'japanese': 'JPN',
  'argentina': 'ARG', 'argentine': 'ARG',
  'italy': 'ITA', 'italian': 'ITA',
  'spain': 'ESP', 'spanish': 'ESP',
  'south africa': 'ZAF',
  'turkey': 'TUR', 'türkiye': 'TUR', 'turkish': 'TUR',
  'indonesia': 'IDN', 'indonesian': 'IDN',
  'poland': 'POL', 'polish': 'POL',
  'romania': 'ROU', 'romanian': 'ROU',
  'ukraine': 'UKR', 'ukrainian': 'UKR',
  'egypt': 'EGY', 'egyptian': 'EGY',
  'thailand': 'THA', 'thai': 'THA',
  'peru': 'PER', 'peruvian': 'PER',
  'venezuela': 'VEN', 'venezuelan': 'VEN',
  'ecuador': 'ECU', 'ecuadorian': 'ECU',
};

// ─── Lookup Functions ───────────────────────────────────────────────

/**
 * Get all registry entries for a country.
 */
export function getEntriesByCountry(iso3: string): ElectionRegistryEntry[] {
  return ELECTION_REGISTRY.filter(e => e.iso3 === iso3);
}

/**
 * Get the primary election entry for a country.
 */
export function getPrimaryEntry(iso3: string): ElectionRegistryEntry | undefined {
  return ELECTION_REGISTRY.find(e => e.iso3 === iso3 && e.isPrimary);
}

/**
 * Get all unique country ISO3 codes in the registry.
 */
export function getTrackedCountries(): string[] {
  return Array.from(new Set(ELECTION_REGISTRY.map(e => e.iso3)));
}

/**
 * Get all slugs that need to be fetched from Polymarket.
 */
export function getAllSlugs(): string[] {
  return ELECTION_REGISTRY.map(e => e.slug);
}

/**
 * Get all PRIMARY slugs (one per country — the main "who wins" market).
 */
export function getPrimarySlugs(): string[] {
  return ELECTION_REGISTRY.filter(e => e.isPrimary).map(e => e.slug);
}

/**
 * Lookup registry entry by slug.
 */
export function getEntryBySlug(slug: string): ElectionRegistryEntry | undefined {
  return ELECTION_REGISTRY.find(e => e.slug === slug);
}

/**
 * Attempt to resolve a country from an event title (fuzzy matching).
 * Used as fallback when a market slug is not in the registry.
 *
 * Returns ISO3 or null if ambiguous/unresolvable.
 */
export function resolveCountryFromTitle(title: string): string | null {
  const normalized = title.toLowerCase().replace(/[^a-z\s]/g, '');

  for (const [alias, iso3] of Object.entries(COUNTRY_ALIASES)) {
    // Word boundary match to avoid "india" matching "indiana"
    const regex = new RegExp(`\\b${alias}\\b`, 'i');
    if (regex.test(normalized)) {
      return iso3;
    }
  }

  return null;
}

/**
 * Get country metadata by ISO3 code.
 * Falls back to the registry for name/flag.
 */
export function getCountryMeta(iso3: string): { countryName: string; flag: string } | null {
  const entry = ELECTION_REGISTRY.find(e => e.iso3 === iso3);
  if (entry) return { countryName: entry.countryName, flag: entry.flag };
  return null;
}
