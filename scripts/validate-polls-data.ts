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

// Hardening firmed 30/Mai pós-EVAL D+15: validar approvalData e polymarketComparison.
// Antes, regressões nessas seções passavam pelo gate de pre-commit e quebravam dashboard
// em ApprovalSection ou candidate cards.
if (data.approvalData !== undefined) {
  const ad = data.approvalData
  if (typeof ad !== 'object' || ad === null) {
    errors.push(`approvalData: deve ser objeto (got ${typeof ad})`)
  } else {
    if (ad.results !== undefined) {
      if (typeof ad.results !== 'object' || ad.results === null) {
        errors.push(`approvalData.results: deve ser objeto`)
      } else {
        if (typeof ad.results.aprovacao !== 'number') errors.push(`approvalData.results.aprovacao: deve ser number`)
        if (typeof ad.results.desaprovacao !== 'number') errors.push(`approvalData.results.desaprovacao: deve ser number`)
        const sum = (ad.results.aprovacao || 0) + (ad.results.desaprovacao || 0)
        if (sum > 101 || sum < 99) warnings.push(`approvalData.results: aprovacao + desaprovacao = ${sum} (esperado ≈100)`)
      }
    }
    if (ad.historicalComparison !== undefined && !Array.isArray(ad.historicalComparison)) {
      errors.push(`approvalData.historicalComparison: deve ser array`)
    }
  }
}

if (data.polymarketComparison !== undefined) {
  const pc = data.polymarketComparison
  if (typeof pc !== 'object' || pc === null) {
    errors.push(`polymarketComparison: deve ser objeto`)
  } else if (pc.candidates !== undefined) {
    if (!Array.isArray(pc.candidates)) {
      errors.push(`polymarketComparison.candidates: DEVE ser array (got ${typeof pc.candidates})`)
    } else {
      pc.candidates.forEach((c: any, i: number) => {
        const cl = `polymarketComparison.candidates[${i}] (${c?.name || 'sem-nome'})`
        if (typeof c?.name !== 'string') errors.push(`${cl}: name ausente/inválido`)
        if (typeof c?.polymarket !== 'string') errors.push(`${cl}: polymarket deve ser string (formato 'XX.XX%')`)
        if (c?.odds !== undefined && typeof c.odds !== 'number') errors.push(`${cl}: odds deve ser number quando presente`)
        if (c?.percentage !== undefined && typeof c.percentage !== 'number') errors.push(`${cl}: percentage deve ser number quando presente`)
      })
    }
  }
}

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

console.log(`✅ polls-data.json OK — ${data.polls.length} entradas validadas + approvalData + polymarketComparison`)
