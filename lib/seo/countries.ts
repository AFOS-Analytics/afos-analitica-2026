/**
 * SEO Dataset — Countries + Elections
 *
 * Fonte de dados para geração programática de metadata, sitemap e páginas.
 * Usado por: country/[country], election/[slug], sitemap.ts
 */

export interface CountrySEO {
  slug: Record<string, string> // { 'pt-BR': 'brasil', en: 'brazil', es: 'brasil' }
  name: Record<string, string>
  iso3: string
  flag: string
  region: string
  elections: ElectionSEO[]
}

export interface ElectionSEO {
  slug: string            // ex: 'brazil-2026'
  year: number
  type: Record<string, string> // { 'pt-BR': 'Presidencial', en: 'Presidential', es: 'Presidencial' }
  date: string            // YYYY-MM-DD
  status: 'active' | 'upcoming' | 'completed'
  polymarketSlug?: string // link ao ELECTION_REGISTRY
}

export const COUNTRIES_SEO: CountrySEO[] = [
  {
    slug: { 'pt-BR': 'brasil', en: 'brazil', es: 'brasil' },
    name: { 'pt-BR': 'Brasil', en: 'Brazil', es: 'Brasil' },
    iso3: 'BRA', flag: '🇧🇷', region: 'Americas',
    elections: [
      { slug: 'brazil-2026', year: 2026, type: { 'pt-BR': 'Presidencial', en: 'Presidential', es: 'Presidencial' }, date: '2026-10-04', status: 'active', polymarketSlug: 'brazil-presidential-election' },
    ],
  },
  {
    slug: { 'pt-BR': 'franca', en: 'france', es: 'francia' },
    name: { 'pt-BR': 'França', en: 'France', es: 'Francia' },
    iso3: 'FRA', flag: '🇫🇷', region: 'Europe',
    elections: [
      { slug: 'france-2027', year: 2027, type: { 'pt-BR': 'Presidencial', en: 'Presidential', es: 'Presidencial' }, date: '2027-04-10', status: 'upcoming', polymarketSlug: '2027-french-presidential-election' },
    ],
  },
  {
    slug: { 'pt-BR': 'alemanha', en: 'germany', es: 'alemania' },
    name: { 'pt-BR': 'Alemanha', en: 'Germany', es: 'Alemania' },
    iso3: 'DEU', flag: '🇩🇪', region: 'Europe',
    elections: [
      { slug: 'germany-2025', year: 2025, type: { 'pt-BR': 'Federal', en: 'Federal Election', es: 'Federal' }, date: '2025-02-23', status: 'completed', polymarketSlug: 'next-german-chancellor' },
    ],
  },
  {
    slug: { 'pt-BR': 'reino-unido', en: 'united-kingdom', es: 'reino-unido' },
    name: { 'pt-BR': 'Reino Unido', en: 'United Kingdom', es: 'Reino Unido' },
    iso3: 'GBR', flag: '🇬🇧', region: 'Europe',
    elections: [
      { slug: 'uk-2029', year: 2029, type: { 'pt-BR': 'Geral', en: 'General Election', es: 'General' }, date: '2029-01-01', status: 'upcoming', polymarketSlug: 'next-uk-prime-minister' },
    ],
  },
  {
    slug: { 'pt-BR': 'canada', en: 'canada', es: 'canada' },
    name: { 'pt-BR': 'Canadá', en: 'Canada', es: 'Canadá' },
    iso3: 'CAN', flag: '🇨🇦', region: 'Americas',
    elections: [
      { slug: 'canada-2025', year: 2025, type: { 'pt-BR': 'Federal', en: 'Federal Election', es: 'Federal' }, date: '2025-04-28', status: 'active', polymarketSlug: 'canadian-federal-election-winner' },
    ],
  },
  {
    slug: { 'pt-BR': 'australia', en: 'australia', es: 'australia' },
    name: { 'pt-BR': 'Austrália', en: 'Australia', es: 'Australia' },
    iso3: 'AUS', flag: '🇦🇺', region: 'Asia-Pacific',
    elections: [
      { slug: 'australia-2025', year: 2025, type: { 'pt-BR': 'Federal', en: 'Federal Election', es: 'Federal' }, date: '2025-05-03', status: 'active', polymarketSlug: 'next-australian-federal-election' },
    ],
  },
  {
    slug: { 'pt-BR': 'coreia-do-sul', en: 'south-korea', es: 'corea-del-sur' },
    name: { 'pt-BR': 'Coreia do Sul', en: 'South Korea', es: 'Corea del Sur' },
    iso3: 'KOR', flag: '🇰🇷', region: 'Asia-Pacific',
    elections: [
      { slug: 'south-korea-2025', year: 2025, type: { 'pt-BR': 'Presidencial', en: 'Presidential', es: 'Presidencial' }, date: '2025-06-03', status: 'active', polymarketSlug: 'next-south-korean-presidential-election' },
    ],
  },
  {
    slug: { 'pt-BR': 'colombia', en: 'colombia', es: 'colombia' },
    name: { 'pt-BR': 'Colômbia', en: 'Colombia', es: 'Colombia' },
    iso3: 'COL', flag: '🇨🇴', region: 'Americas',
    elections: [
      { slug: 'colombia-2026', year: 2026, type: { 'pt-BR': 'Presidencial', en: 'Presidential', es: 'Presidencial' }, date: '2026-05-31', status: 'upcoming', polymarketSlug: '2026-colombian-presidential-election' },
    ],
  },
  {
    slug: { 'pt-BR': 'chile', en: 'chile', es: 'chile' },
    name: { 'pt-BR': 'Chile', en: 'Chile', es: 'Chile' },
    iso3: 'CHL', flag: '🇨🇱', region: 'Americas',
    elections: [
      { slug: 'chile-2025', year: 2025, type: { 'pt-BR': 'Presidencial', en: 'Presidential', es: 'Presidencial' }, date: '2025-11-16', status: 'upcoming', polymarketSlug: '2025-chilean-presidential-election' },
    ],
  },
  {
    slug: { 'pt-BR': 'india', en: 'india', es: 'india' },
    name: { 'pt-BR': 'Índia', en: 'India', es: 'India' },
    iso3: 'IND', flag: '🇮🇳', region: 'Asia-Pacific',
    elections: [
      { slug: 'india-2029', year: 2029, type: { 'pt-BR': 'Geral', en: 'General Election', es: 'General' }, date: '2029-04-01', status: 'upcoming', polymarketSlug: 'next-indian-general-election' },
    ],
  },
  {
    slug: { 'pt-BR': 'mexico', en: 'mexico', es: 'mexico' },
    name: { 'pt-BR': 'México', en: 'Mexico', es: 'México' },
    iso3: 'MEX', flag: '🇲🇽', region: 'Americas',
    elections: [
      { slug: 'mexico-2030', year: 2030, type: { 'pt-BR': 'Presidencial', en: 'Presidential', es: 'Presidencial' }, date: '2030-06-01', status: 'upcoming', polymarketSlug: 'next-mexican-presidential-election' },
    ],
  },
  {
    slug: { 'pt-BR': 'nigeria', en: 'nigeria', es: 'nigeria' },
    name: { 'pt-BR': 'Nigéria', en: 'Nigeria', es: 'Nigeria' },
    iso3: 'NGA', flag: '🇳🇬', region: 'Africa',
    elections: [
      { slug: 'nigeria-2027', year: 2027, type: { 'pt-BR': 'Presidencial', en: 'Presidential', es: 'Presidencial' }, date: '2027-02-25', status: 'upcoming', polymarketSlug: '2027-nigerian-presidential-election' },
    ],
  },
  {
    slug: { 'pt-BR': 'filipinas', en: 'philippines', es: 'filipinas' },
    name: { 'pt-BR': 'Filipinas', en: 'Philippines', es: 'Filipinas' },
    iso3: 'PHL', flag: '🇵🇭', region: 'Asia-Pacific',
    elections: [
      { slug: 'philippines-2025', year: 2025, type: { 'pt-BR': 'Legislativa', en: 'Midterm Senate', es: 'Legislativa' }, date: '2025-05-12', status: 'active', polymarketSlug: 'philippines-midterm-elections-2025-senate' },
    ],
  },
]

// ── Helpers ────────────────────────────────────────────────

export function getCountryBySlug(slug: string): CountrySEO | undefined {
  return COUNTRIES_SEO.find((c) =>
    Object.values(c.slug).some((s) => s === slug)
  )
}

export function getElectionBySlug(slug: string): { country: CountrySEO; election: ElectionSEO } | undefined {
  for (const country of COUNTRIES_SEO) {
    const election = country.elections.find((e) => e.slug === slug)
    if (election) return { country, election }
  }
  return undefined
}

export function getAllCountrySlugs(): string[] {
  const slugs: string[] = []
  for (const c of COUNTRIES_SEO) {
    for (const s of Object.values(c.slug)) {
      if (!slugs.includes(s)) slugs.push(s)
    }
  }
  return slugs
}

export function getAllElectionSlugs(): string[] {
  return COUNTRIES_SEO.flatMap((c) => c.elections.map((e) => e.slug))
}

// ── Regions ────────────────────────────────────────────────

export interface RegionSEO {
  slug: string
  name: Record<string, string>
  countryIso3s: string[]
  meta: Record<string, { title: string; desc: string; h1: string; intro: string }>
}

export const REGIONS_SEO: RegionSEO[] = [
  // US region removed — no Polymarket data yet. Re-add when US elections tracked.
  {
    slug: 'eu',
    name: { 'pt-BR': 'Europa', en: 'Europe', es: 'Europa' },
    countryIso3s: ['FRA', 'DEU', 'GBR'],
    meta: {
      'pt-BR': { title: 'Risco Político Europa | Eleições e Mercados de Previsão', desc: 'Inteligência eleitoral europeia: França, Alemanha, Reino Unido. Mercados de previsão e análise de risco político.', h1: 'Risco Político e Inteligência Eleitoral — Europa', intro: 'Monitoramento de eleições e risco político nos principais países europeus.' },
      en: { title: 'Europe Political Risk & Election Intelligence', desc: 'European election intelligence: France, Germany, United Kingdom. Prediction markets and political risk analysis.', h1: 'Political Risk & Election Intelligence — Europe', intro: 'Monitoring elections and political risk across major European countries.' },
      es: { title: 'Riesgo Político Europa | Elecciones y Mercados de Predicción', desc: 'Inteligencia electoral europea: Francia, Alemania, Reino Unido. Mercados de predicción y análisis de riesgo político.', h1: 'Riesgo Político e Inteligencia Electoral — Europa', intro: 'Monitoreo de elecciones y riesgo político en los principales países europeos.' },
    },
  },
  {
    slug: 'latam',
    name: { 'pt-BR': 'América Latina', en: 'Latin America', es: 'América Latina' },
    countryIso3s: ['BRA', 'COL', 'CHL', 'MEX'],
    meta: {
      'pt-BR': { title: 'Inteligência Eleitoral América Latina | AFOS Analytics', desc: 'Eleições na América Latina: Brasil, Colômbia, Chile, México. Mercados de previsão e sinais de risco político.', h1: 'Inteligência Eleitoral — América Latina', intro: 'Hub de inteligência eleitoral para os principais mercados da América Latina.' },
      en: { title: 'Latin America Election Intelligence Hub | AFOS Analytics', desc: 'Latin American elections: Brazil, Colombia, Chile, Mexico. Prediction markets and political risk signals.', h1: 'Election Intelligence — Latin America', intro: 'Election intelligence hub for major Latin American markets.' },
      es: { title: 'Inteligencia Electoral América Latina | AFOS Analytics', desc: 'Elecciones en América Latina: Brasil, Colombia, Chile, México. Mercados de predicción y señales de riesgo político.', h1: 'Inteligencia Electoral — América Latina', intro: 'Hub de inteligencia electoral para los principales mercados de América Latina.' },
    },
  },
]

export function getRegionBySlug(slug: string): RegionSEO | undefined {
  return REGIONS_SEO.find((r) => r.slug === slug)
}

export function getCountriesForRegion(region: RegionSEO): CountrySEO[] {
  return COUNTRIES_SEO.filter((c) => region.countryIso3s.includes(c.iso3))
}
