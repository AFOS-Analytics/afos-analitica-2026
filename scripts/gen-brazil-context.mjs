/**
 * Gera o bloco de Contexto estrutural do BRASIL (World Bank WGI + WDI, keyless)
 * para a seção do dashboard. Mesma metodologia do .cache/gen-country-context.mjs,
 * mas grava num arquivo standalone (Brasil não tem lib/country-data/brazil.json).
 *
 * Uso: node scripts/gen-brazil-context.mjs
 * Saída: lib/dashboard/brazil-context.json
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'lib', 'dashboard', 'brazil-context.json')
const ISO3 = 'BRA'

const WGI = [
  { code: 'GOV_WGI_PV', key: 'political_stability' },
  { code: 'GOV_WGI_VA', key: 'voice_accountability' },
  { code: 'GOV_WGI_RL', key: 'rule_of_law' },
  { code: 'GOV_WGI_GE', key: 'government_effectiveness' },
  { code: 'GOV_WGI_RQ', key: 'regulatory_quality' },
  { code: 'GOV_WGI_CC', key: 'control_of_corruption' },
]
const WDI = [
  { code: 'SP.POP.TOTL', key: 'population' },
  { code: 'NY.GDP.MKTP.CD', key: 'gdp_usd' },
  { code: 'NY.GDP.PCAP.CD', key: 'gdp_per_capita_usd' },
  { code: 'FP.CPI.TOTL.ZG', key: 'inflation_pct' },
]
const EDU = [
  { code: 'SE.XPD.TOTL.GD.ZS', key: 'gov_expenditure_pct_gdp' },
  { code: 'SE.SCH.LIFE', key: 'expected_years_schooling' },
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchJson(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } })
      if (res.ok) return res.json()
      if (res.status >= 500 || res.status === 429 || res.status === 400) { await sleep(600 * (i + 1)); continue }
      throw new Error(`HTTP ${res.status} for ${url}`)
    } catch (e) {
      if (i === tries - 1) throw e
      await sleep(600 * (i + 1))
    }
  }
  throw new Error(`falhou após ${tries} tentativas: ${url}`)
}

async function fetchWGI(iso3, code) {
  const url = `https://data360api.worldbank.org/data360/data?DATABASE_ID=WB_WGI&INDICATOR=${code}&REF_AREA=${iso3}&timePeriodFrom=2018&timePeriodTo=2024`
  const json = await fetchJson(url)
  const rows = (json?.value || []).filter((r) => r.OBS_VALUE != null && (r.COMP_BREAKDOWN_1 === 'WGI_SC' || r.COMP_BREAKDOWN_1 == null))
  if (!rows.length) return null
  rows.sort((a, b) => Number(b.TIME_PERIOD) - Number(a.TIME_PERIOD))
  return { value: Math.round(Number(rows[0].OBS_VALUE) * 10) / 10, year: Number(rows[0].TIME_PERIOD) }
}

async function fetchWDI(iso3, code) {
  const url = `https://api.worldbank.org/v2/country/${iso3}/indicator/${code}?format=json&date=2010:2024&per_page=100`
  const json = await fetchJson(url)
  const rows = (json?.[1] || []).filter((r) => r.value != null)
  if (!rows.length) return null
  rows.sort((a, b) => Number(b.date) - Number(a.date))
  return { value: Number(rows[0].value), year: Number(rows[0].date) }
}

async function buildContext(iso3) {
  const governance = {}
  for (const g of WGI) { try { const r = await fetchWGI(iso3, g.code); if (r) governance[g.key] = r } catch (e) { console.warn(`  ! ${iso3} ${g.code}: ${e.message}`) } }
  const macro = {}
  for (const m of WDI) { try { const r = await fetchWDI(iso3, m.code); if (r) macro[m.key] = r } catch (e) { console.warn(`  ! ${iso3} ${m.code}: ${e.message}`) } }
  const education = {}
  for (const m of EDU) { try { const r = await fetchWDI(iso3, m.code); if (r) education[m.key] = r } catch (e) { console.warn(`  ! ${iso3} ${m.code}: ${e.message}`) } }
  const years = [...Object.values(governance), ...Object.values(macro), ...Object.values(education)].map((x) => x.year)
  return {
    governance, macro, education,
    sources: { wgi: 'https://www.worldbank.org/en/publication/worldwide-governance-indicators', wdi: 'https://data.worldbank.org/' },
    latest_year: years.length ? Math.max(...years) : null,
  }
}

const ctx = await buildContext(ISO3)
console.log(JSON.stringify(ctx, null, 2))
writeFileSync(OUT, JSON.stringify(ctx, null, 2) + '\n')
console.log(`\nOK -> ${OUT}`)
