/**
 * Bundles de "Análise de divergência" por país (mercado Polymarket × pesquisas), gerados dos
 * datasets AFOS-Analytics1/{country}-2026-electoral-divergence (eleições já realizadas).
 * Consumido pela página de país (app/[locale]/country/[country]/page.tsx) como enhancement
 * progressivo: só os países com dataset ganham a seção; os demais seguem o template genérico.
 * Gerado por .cache/gen-country-bundles.mjs a partir das CSVs de divergência (fonte da verdade).
 */
import peru from './peru.json'
import chile from './chile.json'
import colombia from './colombia.json'
import germany from './germany.json'
import canada from './canada.json'
import uk from './uk.json'
import mexico from './mexico.json'

export interface DivergenceRow {
  candidate: string
  poll_pct: number
  market_pct: number
  divergence_pp: number
  note?: Record<string, string> // ressalva por linha (ex.: spike transitório de mercado fino), trilíngue
}
export interface MarketSnapshotRow { candidate: string; market_pct: number; volume_usd: number }
export interface MarketTrajectory { dates: string[]; series: { name: string; pct: number[] }[] }
export interface CountryDivergence {
  iso3: string
  hf: string
  election: { first_round: string; runoff: string; matchup: string; status: string }
  polls_count: number
  market_candidates: number
  latest_poll: { pollster: string; date: string }
  headline: Record<string, string>
  rows: DivergenceRow[]
  market_snapshot?: { date: string; total_volume_usd: number; candidates: MarketSnapshotRow[] }
  market_trajectory?: MarketTrajectory
}

// chave = iso3 (bate com CountrySEO.iso3). Casos validados: PER CHL COL DEU CAN GBR MEX (UK+México 2024 add 13/Jun).
export const COUNTRY_DIVERGENCE: Record<string, CountryDivergence> = {
  PER: peru as CountryDivergence,
  CHL: chile as CountryDivergence,
  COL: colombia as CountryDivergence,
  DEU: germany as CountryDivergence,
  CAN: canada as CountryDivergence,
  GBR: uk as CountryDivergence,
  MEX: mexico as CountryDivergence,
}

export function getCountryDivergence(iso3: string): CountryDivergence | null {
  return COUNTRY_DIVERGENCE[iso3] ?? null
}
