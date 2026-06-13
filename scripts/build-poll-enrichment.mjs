/**
 * Enriquecimento analítico das pesquisas nacionais publicadas (Brasil 2026) para uso de pesquisa
 * (colaboração Zaid Ahmad / Andrew Gelman, Columbia). Três camadas — os "3 🥇":
 *
 *   🥇1  DATAÇÃO POR MEIO DE CAMPO + dias até a eleição. Uma pesquisa deve ser datada pelo
 *        MIDPOINT do trabalho de campo (não pela divulgação). Junta field_start/field_end da
 *        tse-registry por register_tse e calcula field_midpoint, days_to_first_round/runoff.
 *   🥇2  DIVERGÊNCIA AO NÍVEL DA PESQUISA, ancorada no midpoint. Pareia cada pesquisa à odd do
 *        Polymarket vigente no midpoint (nearest ON OR BEFORE). ⚠️ ESCALA: Polymarket precifica
 *        P(VITÓRIA); a pesquisa reporta %VOTO de 1º turno — escalas DIFERENTES. Entregamos as DUAS
 *        cruas + um naive_gap_pp explicitamente NÃO reconciliado de escala (gap_type rotula isso).
 *        A reconciliação é escolha de modelagem do pesquisador. Nada fabricado.
 *   🥇3  DEMOGRAFIA DA AMOSTRA (camada A) estruturada a partir do texto do sampling_plan: cotas/
 *        ponderação por sexo/idade/escolaridade/renda. É COMPOSIÇÃO/PONDERAÇÃO DA AMOSTRA — NÃO é
 *        voto por recorte (crosstab), que não existe no open-data do TSE. Extração best-effort com
 *        quota_detail_level honesto por pesquisa (full_percentages | mentioned_no_pct |
 *        not_in_sampling_text). Onde o instituto não declarou %, fica null — sem inventar.
 *
 * ⛔ DB-FREE (anti-Lead/LGPD): lê só artefatos públicos versionados. Sem Prisma, sem DATABASE_URL.
 * Defensivo: nunca aborta fatal — em erro, loga e sai 0, deixando os artefatos-base intactos.
 *
 * Entradas (env, com defaults da pipeline):
 *   POLLS_JSON   (default hf-assets/polls/national-polls.json)  — já com bloco tse_registration
 *   REGISTRY_JSON(default hf-assets/polls/tse-registry.json)    — 350×20 (tem field_start/end)
 *   MARKET_CSV   (default .cache/hf-dataset/data/market-odds-timeseries.csv) — série de mercado
 *   OUT_DIR      (default hf-assets/polls) · DATA_DIR (default <OUT_DIR>/../data)
 *
 * Saídas:
 *   - national-polls.json            (cada pesquisa ganha field_window, field_midpoint, days_to_*,
 *                                      dating_source e tse_registration.sample_design)
 *   - polls/sample-demographics.csv  (camada A, formato long, com cobertura honesta)
 *   - data/poll-divergence.csv       (🥇2 — pareamento por midpoint, gaps rotulados)
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

const ROOT = process.cwd()
const OUT_DIR = process.env.OUT_DIR || join(ROOT, 'hf-assets', 'polls')
const DATA_DIR = process.env.DATA_DIR || join(OUT_DIR, '..', 'data')
const POLLS_JSON = process.env.POLLS_JSON || join(OUT_DIR, 'national-polls.json')
const REGISTRY_JSON = process.env.REGISTRY_JSON || join(OUT_DIR, 'tse-registry.json')
const MARKET_CSV = process.env.MARKET_CSV || join(ROOT, '.cache', 'hf-dataset', 'data', 'market-odds-timeseries.csv')

// Calendário oficial TSE 2026 (Lei 9.504/97: 1º domingo de out; 2º turno último domingo de out).
const FIRST_ROUND = '2026-10-04'
const RUNOFF = '2026-10-25'

const csvEscape = (v) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
const toCsv = (head, rows) => [head.join(','), ...rows.map((r) => r.map(csvEscape).join(','))].join('\n') + '\n'
const numPct = (s) => { const n = parseFloat(String(s ?? '').replace(',', '.')); return Number.isFinite(n) ? n : null }
const daysBetween = (a, b) => Math.round((Date.parse(a) - Date.parse(b)) / 86400000)
function midpoint(start, end) {
  if (!start || !end) return null
  const t = (Date.parse(start) + Date.parse(end)) / 2
  if (!Number.isFinite(t)) return null
  return new Date(t).toISOString().slice(0, 10)
}

// ---------- 🥇3 — parser da demografia da amostra (camada A) ----------
// Conservador: só extrai % quando o texto declara "Rótulo: x%". Caso contrário marca o nível de
// detalhe honestamente. Tolerante a acentos via classes amplas.
function parseSampleDesign(samplingPlan) {
  const t = String(samplingPlan || '')
  if (!t.trim()) return null
  const has = (re) => re.test(t)
  const control = {
    sex: has(/sexo|g[êe]nero|masculino|feminino|homens|mulheres/i),
    age: has(/idade|faixa\s+et[áa]ria|et[áa]ri[ao]/i),
    education: has(/escolaridade|instru[çc][ãa]o|ensino|educa[çc]/i),
    income: has(/renda|n[íi]vel\s+econ[ôo]mico|classe|sal[áa]rio/i),
    region: has(/regi[ãa]o|geogr[áa]fic|estrato|capital|interior|munic[íi]pio/i),
  }
  // Fatiamento por POSIÇÃO de cabeçalhos "RÓTULO:" — robusto contra o rótulo reaparecer nos valores
  // (ex.: o limite "renda" casaria com "Renda familiar..." e truncaria a própria seção de renda).
  const HEADERS = [
    { dim: 'sex', re: /sexo\s*:/i },
    { dim: 'age', re: /faixa\s+et[áa]ria\s*:/i },
    { dim: 'education', re: /escolaridade\s*:/i },
    { dim: 'income', re: /(?:n[íi]vel\s+econ[ôo]mico|renda)\s*:/i },
  ]
  const found = HEADERS.map((h) => { const m = t.match(h.re); return m ? { dim: h.dim, start: m.index, end: m.index + m[0].length } : null })
    .filter(Boolean).sort((a, b) => a.start - b.start)
  const segmentFor = (dim) => {
    const i = found.findIndex((f) => f.dim === dim); if (i < 0) return ''
    const to = i + 1 < found.length ? found[i + 1].start : t.length
    let chunk = t.slice(found[i].end, to)
    const obs = chunk.search(/obs\./i); if (obs >= 0) chunk = chunk.slice(0, obs)
    return chunk
  }
  // pares "rótulo: x%" — split por ';'/quebra de linha p/ capturar o rótulo INTEIRO (sem cap de chars)
  const pairs = (chunk) => {
    const out = []
    for (const part of String(chunk).split(/[;\n]/)) {
      const m = part.match(/^\s*([^:%]+?):\s*([\d]+(?:[.,]\d+)?)\s*%/)
      if (m) { const p = numPct(m[2]); if (p != null) out.push({ label: m[1].replace(/\s+/g, ' ').trim(), pct: p }) }
    }
    return out.length ? out : null
  }
  // sexo: "Masculino: x%"/"Feminino: y%" e variantes "x% homens"/"x% mulheres"
  let sex_quota = null
  const mM = t.match(/masculino:?\s*([\d]+(?:[.,]\d+)?)\s*%/i) || t.match(/([\d]+(?:[.,]\d+)?)\s*%\s*(?:de\s+)?homens/i)
  const mF = t.match(/feminino:?\s*([\d]+(?:[.,]\d+)?)\s*%/i) || t.match(/([\d]+(?:[.,]\d+)?)\s*%\s*(?:de\s+)?mulheres/i)
  if (mM && mF) sex_quota = { male_pct: numPct(mM[1]), female_pct: numPct(mF[1]) }

  const age_quota = control.age ? pairs(segmentFor('age')) : null
  const education_quota = control.education ? pairs(segmentFor('education')) : null
  const income_quota = control.income ? pairs(segmentFor('income')) : null

  const anyPct = sex_quota || age_quota || education_quota || income_quota
  const anyControl = Object.values(control).some(Boolean)
  const quota_detail_level = anyPct ? 'full_percentages' : (anyControl ? 'mentioned_no_pct' : 'not_in_sampling_text')

  return {
    layer: 'A_sample_design',
    note: 'Sample composition/weighting (quota frame) declared in the TSE registration. This is SAMPLE DESIGN, NOT vote-by-demographic crosstabs (layer B), which are not in TSE open data. Best-effort parse of free text; null where the institute did not declare structured percentages.',
    quota_detail_level,
    control_variables: control,
    sex_quota,
    age_quota,
    education_quota,
    income_quota,
  }
}

// ---------- 🥇2 — leitura da série de mercado + canonização de nomes ----------
// (mesma convenção do export-hf-dataset.mjs: pesquisa usa nome completo; mercado usa 1º nome).
const CANON = [
  ['michelle', 'Michelle Bolsonaro'], ['lula', 'Lula'], ['flávio', 'Flávio'], ['flavio', 'Flávio'],
  ['caiado', 'Caiado'], ['zema', 'Zema'], ['renan', 'Renan'], ['haddad', 'Haddad'],
  ['tarcísio', 'Tarcísio'], ['tarcisio', 'Tarcísio'], ['camilo', 'Camilo Santana'],
  ['ratinho', 'Ratinho Jr'], ['eduardo leite', 'Eduardo Leite'], ['ciro', 'Ciro Gomes'], ['simone', 'Simone Tebet'],
]
const canon = (raw) => { const s = String(raw || '').toLowerCase(); for (const [k, v] of CANON) if (s.includes(k)) return v; return null }

function loadMarketIndex(csvPath) {
  if (!existsSync(csvPath)) { console.log('⚠️  MARKET_CSV ausente — pulando 🥇2 (poll-divergence):', csvPath); return null }
  const lines = readFileSync(csvPath, 'utf-8').trim().split('\n')
  const idx = {}
  for (let i = 1; i < lines.length; i++) {
    // date,candidate,party,polymarket_pct,volume_usd_m
    const c = lines[i].split(',')
    const date = c[0], cand = canon(c[1]), pct = numPct(c[3])
    if (!date || !cand || pct == null) continue
    ;(idx[cand] ||= []).push({ date, pct })
  }
  for (const k in idx) idx[k].sort((a, b) => a.date.localeCompare(b.date))
  return idx
}
// odd de mercado vigente NA OU ANTES da data (sem fabricar contemporaneidade)
const marketAt = (idx, cand, d) => {
  const arr = idx?.[cand]; if (!arr) return null
  let best = null; for (const e of arr) { if (e.date <= d) best = e; else break }
  return best
}
const firstRoundScenario = (p) =>
  (p.scenarios || []).find((s) => /1|primeiro|first|principal/i.test(s.name || '')) || (p.scenarios || [])[0]

// ---------- main ----------
function main() {
  if (!existsSync(POLLS_JSON)) { console.log('⚠️  national-polls.json ausente — nada a enriquecer:', POLLS_JSON); return }
  const data = JSON.parse(readFileSync(POLLS_JSON, 'utf-8'))
  const reg = existsSync(REGISTRY_JSON) ? JSON.parse(readFileSync(REGISTRY_JSON, 'utf-8')) : { records: [] }
  const norm = (s) => (s || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
  const byProto = new Map((reg.records || []).map((r) => [norm(r.register_tse), r]))
  const mkt = loadMarketIndex(MARKET_CSV)

  const demoRows = []
  const divRows = []
  let nMid = 0, nPub = 0, nNoDate = 0, nFull = 0, nMention = 0, nNone = 0, nDivPolls = 0

  for (const p of data.polls || []) {
    const t = p.tse_registration || null
    const rr = t && t.register_tse ? byProto.get(norm(t.register_tse)) : null

    // 🥇1 — datação por midpoint de campo
    const fs_ = rr?.field_start || null, fe_ = rr?.field_end || null
    const mid = midpoint(fs_, fe_)
    let anchor, dating_source
    if (mid) { anchor = mid; dating_source = 'field_midpoint'; nMid++ }
    else if (p.date) { anchor = p.date; dating_source = 'publication_date'; nPub++ }
    else { anchor = null; dating_source = 'unavailable'; nNoDate++ }
    p.field_window = (fs_ && fe_) ? { start: fs_, end: fe_ } : null
    p.field_midpoint = mid
    p.dating_source = dating_source
    p.days_to_first_round = anchor ? daysBetween(FIRST_ROUND, anchor) : null
    p.days_to_runoff = anchor ? daysBetween(RUNOFF, anchor) : null

    // 🥇3 — demografia da amostra (camada A)
    const design = t ? parseSampleDesign(t.sampling_plan) : null
    if (t) t.sample_design = design
    if (design) {
      if (design.quota_detail_level === 'full_percentages') nFull++
      else if (design.quota_detail_level === 'mentioned_no_pct') nMention++
      else nNone++
      const pid = p.register || `${p.institute}-${p.date}`
      const base = [pid, t.register_tse || '', p.institute, p.date, mid || '']
      const emit = (dim, cat, pct) => demoRows.push([...base, dim, cat, pct ?? '', design.quota_detail_level])
      if (design.sex_quota) { emit('sex', 'male', design.sex_quota.male_pct); emit('sex', 'female', design.sex_quota.female_pct) }
      for (const a of design.age_quota || []) emit('age', a.label, a.pct)
      for (const e of design.education_quota || []) emit('education', e.label, e.pct)
      for (const inc of design.income_quota || []) emit('income', inc.label, inc.pct)
      if (design.quota_detail_level === 'mentioned_no_pct') {
        for (const [dim, on] of Object.entries(design.control_variables)) if (on) emit(dim, '(declared, no % in registry)', '')
      }
      if (design.quota_detail_level === 'not_in_sampling_text') emit('(none)', 'no demographic quota in sampling_plan text', '')
    }

    // 🥇2 — divergência ao nível da pesquisa (ancorada no midpoint), se houver série de mercado
    if (mkt && anchor) {
      const sc = firstRoundScenario(p)
      for (const r of sc?.results || []) {
        const k = canon(r.candidate); if (!k) continue
        const m = marketAt(mkt, k, anchor); const poll = numPct(r.percent)
        if (!m || poll == null) continue
        divRows.push([
          p.register || `${p.institute}-${p.date}`, t?.register_tse || '', p.institute, p.date, mid || '',
          p.days_to_first_round ?? '', sc?.name || '', k, poll, m.pct, m.date,
          Math.round((m.pct - poll) * 100) / 100, 'naive_winprob_minus_voteshare',
        ])
      }
      if ((sc?.results || []).some((r) => canon(r.candidate))) nDivPolls++
    }
  }

  // metadados honestos no JSON
  data.enrichment_note = 'Analytical enrichment for research use: (1) field-midpoint dating + days-to-election; (2) poll-level market-vs-poll pairing anchored on the field midpoint — Polymarket prices P(win) while polls report 1st-round vote share, so naive_gap_pp is NOT scale-reconciled (a modeling choice for the researcher); (3) sample_design = sample composition/weighting (layer A) parsed from the TSE sampling_plan, NOT vote-by-demographic crosstabs (layer B, absent from TSE open data). Election dates: 1st round ' + FIRST_ROUND + ', runoff ' + RUNOFF + '.'

  mkdirSync(OUT_DIR, { recursive: true }); mkdirSync(DATA_DIR, { recursive: true })
  writeFileSync(POLLS_JSON, JSON.stringify(data, null, 2))
  writeFileSync(join(OUT_DIR, 'sample-demographics.csv'), toCsv(
    ['poll_id', 'register_tse', 'institute', 'poll_date', 'field_midpoint', 'dimension', 'category', 'pct', 'quota_detail_level'], demoRows))
  if (mkt) writeFileSync(join(DATA_DIR, 'poll-divergence.csv'), toCsv(
    ['poll_id', 'register_tse', 'institute', 'poll_date', 'field_midpoint', 'days_to_first_round', 'scenario', 'candidate', 'poll_pct', 'polymarket_pct', 'polymarket_date', 'naive_gap_pp', 'gap_type'], divRows))

  console.log(`✅ enrichment: dating[midpoint=${nMid} pub=${nPub} none=${nNoDate}] · demografia[full%=${nFull} menção=${nMention} ausente=${nNone}] · poll-divergence[${divRows.length} linhas de ${nDivPolls} pesquisas]`)
}

try { main() } catch (e) { console.error('⚠️  build-poll-enrichment falhou (não-fatal, base intacta):', e.message); process.exit(0) }
