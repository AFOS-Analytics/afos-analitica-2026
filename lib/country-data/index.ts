/**
 * Bundles de "Análise de divergência" por país (mercado Polymarket × pesquisas), gerados dos
 * datasets AFOS-Analytics1/{country}-2026-electoral-divergence (eleições já realizadas).
 * Consumido pela página de país (app/[locale]/country/[country]/page.tsx) como enhancement
 * progressivo: só os países com dataset ganham a seção; os demais seguem o template genérico.
 * Gerado por .cache/gen-country-bundles.mjs a partir das CSVs de divergência (fonte da verdade).
 */
import peru from './peru.json'
import colombia from './colombia.json'

export interface DivergenceRow {
  candidate: string
  poll_pct: number
  market_pct: number
  divergence_pp: number
}
export interface CountryDivergence {
  iso3: string
  hf: string
  election: { first_round: string; runoff: string; matchup: string; status: string }
  polls_count: number
  market_candidates: number
  latest_poll: { pollster: string; date: string }
  headline: Record<string, string>
  rows: DivergenceRow[]
}

// chave = iso3 (bate com CountrySEO.iso3)
export const COUNTRY_DIVERGENCE: Record<string, CountryDivergence> = {
  PER: peru as CountryDivergence,
  COL: colombia as CountryDivergence,
}

export function getCountryDivergence(iso3: string): CountryDivergence | null {
  return COUNTRY_DIVERGENCE[iso3] ?? null
}
