/**
 * Camada 2 — Validator para public/polls-data.json.
 *
 * Garante que toda entrada em polls[] tem shape canônico (scenarios[] + secondRound[] arrays).
 * Existe porque PollsSection.tsx fazia poll.scenarios.map / poll.secondRound.map sem guard,
 * o que crashava o dashboard inteiro quando entry vinha com results.firstRound/results.secondRound
 * como objeto (incidentes AtlasIntel 19/Mai e Vox Brasil 21/Mai).
 *
 * Uso:
 *   npx tsx scripts/validate-polls-data.ts
 *   (exit 0 = OK, exit 1 = schema violation)
 */
import { readFileSync } from 'fs'
import { join } from 'path'

const path = join(process.cwd(), 'public', 'polls-data.json')
const raw = readFileSync(path, 'utf-8')

let data: any
try {
  data = JSON.parse(raw)
} catch (err) {
  console.error(`❌ JSON inválido: ${err instanceof Error ? err.message : err}`)
  process.exit(1)
}

const errors: string[] = []
const warnings: string[] = []

if (!Array.isArray(data?.polls)) {
  console.error('❌ polls-data.json: campo polls[] ausente ou não-array')
  process.exit(1)
}

data.polls.forEach((p: any, idx: number) => {
  const label = `polls[${idx}] (${p?.institute || 'sem-instituto'} ${p?.date || 'sem-data'})`

  if (!p || typeof p !== 'object') {
    errors.push(`${label}: entrada não é objeto`)
    return
  }

  if (typeof p.institute !== 'string' || !p.institute) errors.push(`${label}: institute ausente`)
  if (typeof p.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(p.date)) errors.push(`${label}: date deve ser YYYY-MM-DD`)
  if (typeof p.sample !== 'number') warnings.push(`${label}: sample não é number`)

  if (!Array.isArray(p.scenarios)) {
    errors.push(`${label}: scenarios DEVE ser array (got ${typeof p.scenarios}). Shape canônico exige scenarios[] mesmo que vazio.`)
  } else {
    p.scenarios.forEach((s: any, si: number) => {
      if (!Array.isArray(s?.results)) errors.push(`${label}.scenarios[${si}]: results deve ser array`)
      else {
        s.results.forEach((r: any, ri: number) => {
          if (typeof r?.candidate !== 'string') errors.push(`${label}.scenarios[${si}].results[${ri}]: candidate ausente/inválido`)
          if (typeof r?.percent !== 'number') errors.push(`${label}.scenarios[${si}].results[${ri}]: percent não é number`)
        })
      }
    })
  }

  if (!Array.isArray(p.secondRound)) {
    errors.push(`${label}: secondRound DEVE ser array (got ${typeof p.secondRound}). Shape canônico exige secondRound[] mesmo que vazio.`)
  } else {
    p.secondRound.forEach((sr: any, sri: number) => {
      if (typeof sr?.matchup !== 'string') errors.push(`${label}.secondRound[${sri}]: matchup ausente`)
      if (typeof sr?.candidate1 !== 'string') errors.push(`${label}.secondRound[${sri}]: candidate1 ausente`)
      if (typeof sr?.percent1 !== 'number') errors.push(`${label}.secondRound[${sri}]: percent1 não é number`)
      if (typeof sr?.candidate2 !== 'string') errors.push(`${label}.secondRound[${sri}]: candidate2 ausente`)
      if (typeof sr?.percent2 !== 'number') errors.push(`${label}.secondRound[${sri}]: percent2 não é number`)
    })
  }

  const forbiddenKeys = ['sampleSize', 'results']
  forbiddenKeys.forEach(k => {
    if (k in p) errors.push(`${label}: chave proibida '${k}' presente — schema canônico não permite. Use 'sample' (não sampleSize) e mova 1T/2T para scenarios[]/secondRound[]`)
  })
})

if (warnings.length > 0) {
  console.warn(`⚠️  ${warnings.length} warning(s):`)
  warnings.forEach(w => console.warn(`   ${w}`))
}

if (errors.length > 0) {
  console.error(`\n❌ ${errors.length} erro(s) de schema em polls-data.json:`)
  errors.forEach(e => console.error(`   ${e}`))
  console.error('\nSchema canônico em: memory/feedback_polls_data_canonical_schema.md')
  process.exit(1)
}

console.log(`✅ polls-data.json OK — ${data.polls.length} entradas validadas`)
