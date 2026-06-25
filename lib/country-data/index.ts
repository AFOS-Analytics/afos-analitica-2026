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
import usa from './usa.json'

export interface DivergenceRow {
  candidate: string
  poll_pct: number
  market_pct: number
  divergence_pp: number
  note?: Record<string, string> // ressalva por linha (ex.: spike transitório de mercado fino), trilíngue
}
export interface MarketSnapshotRow { candidate: string; market_pct: number; volume_usd: number }
export interface MarketTrajectory { dates: string[]; series: { name: string; pct: number[] }[] }
export interface ContextMetric { value: number; year: number }
// Contexto estrutural do país (World Bank): governança (WGI, escala 0-100) + macro (WDI).
// Camada complementar à divergência, fonte oficial aberta e citável. Gerado por
// .cache/gen-country-context.mjs. Opcional: só os países enriquecidos exibem a seção.
export interface CountryContext {
  governance: Partial<Record<'political_stability' | 'voice_accountability' | 'rule_of_law' | 'government_effectiveness' | 'regulatory_quality' | 'control_of_corruption', ContextMetric>>
  macro: Partial<Record<'population' | 'gdp_usd' | 'gdp_per_capita_usd' | 'inflation_pct', ContextMetric>>
  education?: Partial<Record<'gov_expenditure_pct_gdp' | 'expected_years_schooling', ContextMetric>>
  sources: { wgi: string; wdi: string }
  latest_year: number | null
}
export interface CountryDivergence {
  iso3: string
  hf: string
  harvard?: string // DOI do dataset no Harvard Dataverse (ex.: USA 2024); só países com depósito acadêmico próprio
  election: { first_round: string; runoff: string; matchup: string; status: string }
  polls_count: number
  market_candidates: number
  latest_poll: { pollster: string; date: string }
  headline: Record<string, string>
  rows: DivergenceRow[]
  market_snapshot?: { date: string; total_volume_usd: number; candidates: MarketSnapshotRow[] }
  market_trajectory?: MarketTrajectory
  context?: CountryContext
}

// chave = iso3 (bate com CountrySEO.iso3). Casos validados: USA PER CHL COL DEU CAN GBR MEX (EUA 2024 add 19/Jun, lidera = maior mercado eleitoral da história).
export const COUNTRY_DIVERGENCE: Record<string, CountryDivergence> = {
  USA: usa as unknown as CountryDivergence,
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

// Allowlist dos países com o pacote novo ligado (grafo do cruzamento + barras de odds no card
// de divergência + textos de SEO ocultos). País fora da lista = inalterado em produção.
// Rollout um de cada vez: adicionar o iso3 após aprovação do preview.
export const GRAPH_ENABLED = new Set<string>(['USA', 'CHL', 'COL', 'PER', 'DEU', 'CAN', 'MEX', 'GBR'])

// Vencedor real de cada caso validado (para o nó "Resultado real" no grafo). O nome deve bater
// com um candidato em `rows`. Países sem entrada não exibem o nó de resultado.
export const ELECTION_WINNER: Record<string, string> = {
  USA: 'Trump',
  CHL: 'José Antonio Kast',
  COL: 'Abelardo de la Espriella',
  DEU: 'CDU/CSU',
  CAN: 'Liberal',
  MEX: 'Sheinbaum',
  GBR: 'Labour',
}
