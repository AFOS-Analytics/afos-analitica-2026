/**
 * Country ↔ Market Mapping Engine
 *
 * Maps Polymarket event slugs to ISO 3166-1 Alpha-3 country codes.
 * SLUGS VERIFIED against gamma-api.polymarket.com on 2026-04-13.
 */

// ─── Types ──────────────────────────────────────────────────────────

export interface ElectionRegistryEntry {
  slug: string;
  iso3: string;
  countryName: string;
  flag: string;
  electionDate: string;
  electionType: string;
  isPrimary: boolean;
  enabled: boolean;
}

// ─── Static Registry ────────────────────────────────────────────────
// Manually curated — single source of truth for slug → country mapping.
// isPrimary = true means this is the main "winner" market shown on the map.
// VERIFIED: each slug returns data from gamma-api.polymarket.com/events?slug=XXX

// ISO3 → ISO2 for SVG flag paths (/flags/{iso2}.svg)
const ISO3_TO_ISO2: Record<string, string> = {
  BRA: 'br', COL: 'co', USA: 'us', HUN: 'hu', RUS: 'ru',
  AUS: 'au', FRA: 'fr', GBR: 'gb', CHL: 'cl',
};

export function getFlagPath(iso3: string): string {
  return `/flags/${ISO3_TO_ISO2[iso3] || iso3.toLowerCase().slice(0, 2)}.svg`;
}

export const ELECTION_REGISTRY: ElectionRegistryEntry[] = [
  // ── Brazil (6 markets) ────────────────
  { slug: 'brazil-presidential-election', iso3: 'BRA', countryName: 'Brazil', flag: 'br', electionDate: '2026-10-04', electionType: 'Presidential', isPrimary: true, enabled: true },
  { slug: 'brazil-presidential-election-first-round-2nd-place', iso3: 'BRA', countryName: 'Brazil', flag: 'br', electionDate: '2026-10-04', electionType: 'Presidential 1T — 2nd Place', isPrimary: false, enabled: true },
  { slug: 'brazil-presidential-election-first-round-3rd-place', iso3: 'BRA', countryName: 'Brazil', flag: 'br', electionDate: '2026-10-04', electionType: 'Presidential 1T — 3rd Place', isPrimary: false, enabled: true },
  { slug: 'any-brazil-stf-justice-removed-by-impeachment-before-2027', iso3: 'BRA', countryName: 'Brazil', flag: 'br', electionDate: '2027-01-01', electionType: 'STF Impeachment', isPrimary: false, enabled: true },
  { slug: 'next-brazil-senate-election-most-seats-won', iso3: 'BRA', countryName: 'Brazil', flag: 'br', electionDate: '2026-10-04', electionType: 'Senate', isPrimary: false, enabled: true },
  { slug: 'brazil-annual-inflation-2026', iso3: 'BRA', countryName: 'Brazil', flag: 'br', electionDate: '2026-12-31', electionType: 'Inflation 2026', isPrimary: false, enabled: true },

  // ── Colombia (2 markets) ──────────────
  { slug: 'colombia-presidential-election', iso3: 'COL', countryName: 'Colombia', flag: 'co', electionDate: '2026-06-21', electionType: 'Presidential', isPrimary: true, enabled: true },
  { slug: 'colombia-presidential-election-1st-round-winner', iso3: 'COL', countryName: 'Colombia', flag: 'co', electionDate: '2026-05-31', electionType: 'Presidential 1st Round', isPrimary: false, enabled: true },

  // ── United States (3 markets) ─────────
  { slug: 'presidential-election-winner-2028', iso3: 'USA', countryName: 'United States', flag: 'us', electionDate: '2028-11-03', electionType: 'Presidential', isPrimary: true, enabled: true },
  { slug: 'republican-presidential-nominee-2028', iso3: 'USA', countryName: 'United States', flag: 'us', electionDate: '2028-11-03', electionType: 'Republican Nominee', isPrimary: false, enabled: true },
  { slug: 'democratic-presidential-nominee-2028', iso3: 'USA', countryName: 'United States', flag: 'us', electionDate: '2028-11-03', electionType: 'Democratic Nominee', isPrimary: false, enabled: true },

  // ── Hungary ───────────────────────────
  { slug: 'next-prime-minister-of-hungary', iso3: 'HUN', countryName: 'Hungary', flag: 'hu', electionDate: '2026-04-01', electionType: 'Prime Minister', isPrimary: true, enabled: true },

  // ── Russia ────────────────────────────
  { slug: 'russia-parliamentary-election-winner', iso3: 'RUS', countryName: 'Russia', flag: 'ru', electionDate: '2026-09-20', electionType: 'Parliamentary', isPrimary: true, enabled: true },

  // ── Australia ──────────────────────────
  { slug: 'farrer-by-election-winner', iso3: 'AUS', countryName: 'Australia', flag: 'au', electionDate: '2026-05-09', electionType: 'By-Election Farrer', isPrimary: true, enabled: true },

  // ── France ────────────────────────────
  { slug: 'french-election-called-by', iso3: 'FRA', countryName: 'France', flag: 'fr', electionDate: '2027-04-10', electionType: 'Election Timeline', isPrimary: true, enabled: true },

  // ── United Kingdom ────────────────────
  { slug: 'uk-election-called-by', iso3: 'GBR', countryName: 'United Kingdom', flag: 'gb', electionDate: '2029-01-01', electionType: 'Election Timeline', isPrimary: true, enabled: true },

  // ── US Senate 2026 ────────────────────
  { slug: 'which-party-will-win-the-senate-in-2026', iso3: 'USA', countryName: 'United States', flag: 'us', electionDate: '2026-11-03', electionType: 'Senate 2026', isPrimary: false, enabled: true },
  { slug: 'texas-republican-senate-primary-winner', iso3: 'USA', countryName: 'United States', flag: 'us', electionDate: '2026-03-03', electionType: 'Texas Senate Primary', isPrimary: false, enabled: true },

  // ── Chile ─────────────────────────────
  { slug: 'chile-presidential-election', iso3: 'CHL', countryName: 'Chile', flag: 'cl', electionDate: '2025-11-16', electionType: 'Presidential', isPrimary: true, enabled: true },
];

// ─── Lookup Functions ───────────────────────────────────────────────

export function getEntriesByCountry(iso3: string): ElectionRegistryEntry[] {
  return ELECTION_REGISTRY.filter(e => e.iso3 === iso3);
}

export function getPrimaryEntry(iso3: string): ElectionRegistryEntry | undefined {
  return ELECTION_REGISTRY.find(e => e.iso3 === iso3 && e.isPrimary);
}

export function getTrackedCountries(): string[] {
  return Array.from(new Set(ELECTION_REGISTRY.map(e => e.iso3)));
}
