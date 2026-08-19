/**
 * Constrói o REGISTRO TSE ENRIQUECIDO direto do TSE Dados Abertos e enriquece as 22
 * pesquisas com resultados — TODOS os campos públicos, SEM truncar.
 *
 * ⛔ DB-FREE (anti-Lead/LGPD): não importa Prisma, não lê DATABASE_URL, não toca Lead.
 *    Lê só a fonte pública do TSE + os artefatos públicos em hf-assets/polls/.
 *
 * Fonte: https://cdn.tse.jus.br/.../pesquisa_eleitoral_2026.zip → pesquisa_eleitoral_2026_BRASIL.csv
 * Base legal: Lei 9.504/1997 art. 33; Resolução TSE 23.600/2019.
 *
 * Saídas (hf-assets/polls/):
 *   - tse-registry.csv / tse-registry.json   (350 presidenciais, 20 campos públicos)
 *   - national-polls.json                    (cada poll ganha o bloco `tse_registration`)
 *
 * Roda no mirror HF DEPOIS de build-hf-poll-results.mjs (que regenera national-polls.json),
 * para que o enriquecimento seja reaplicado a cada espelhamento (sem drift).
 */
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import JSZip from 'jszip'
import { classifyScope } from '../lib/tse/scope.mjs'

/**
 * Decodificacao do CSV do TSE, IGUAL a de lib/tse/ingest.ts.
 *
 * As duas copias tinham divergido: aqui era 'latin1' e la 'windows-1252'. Elas
 * so coincidem nos bytes 0x00-0x7F e 0xA0-0xFF; a faixa 0x80-0x9F e onde moram
 * aspas curvas, travessao e reticencias do Windows, que em latin1 viram
 * caractere de controle e somem do nome do instituto.
 *
 * Fica windows-1252, que e a copia com incidente documentado (Gerp
 * BR-03067/2026, comentario em lib/tse/ingest.ts). Achado da auditoria EVAL.
 */
function decodificar(buf) {
  return new TextDecoder('windows-1252').decode(buf)
}


const TSE_URL = 'https://cdn.tse.jus.br/estatistica/sead/odsele/pesquisa_eleitoral/pesquisa_eleitoral_2026.zip'
const CSV_NAME = 'pesquisa_eleitoral_2026_BRASIL.csv'
const OUT = join(process.cwd(), 'hf-assets', 'polls')
const CACHE = join(process.cwd(), '.cache', 'tse-extract', CSV_NAME)

// O TSE Dados Abertos é instável (ConnectTimeout/502 intermitentes). Sem retry, um único
// timeout derruba o mirror inteiro antes do upload — dataset público fica defasado no dia.
// Retry com backoff + timeout por tentativa generoso; o caller trata o esgotamento como
// degradação graciosa (mantém o registry já versionado), nunca como falha do workflow.
async function fetchTseZip(url, { attempts = 4, perAttemptMs = 30000 } = {}) {
  const backoff = [0, 3000, 8000, 15000]
  let lastErr
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(perAttemptMs) })
      if (!res.ok) throw new Error(`TSE HTTP ${res.status}`)
      return Buffer.from(await res.arrayBuffer())
    } catch (e) {
      lastErr = e
      console.log(`⚠️  TSE tentativa ${i}/${attempts} falhou: ${e.message}`)
      if (i < attempts) await new Promise((r) => setTimeout(r, backoff[i] ?? 15000))
    }
  }
  throw lastErr
}

async function loadCsv() {
  // usa cache local se existir (rodadas manuais); senão baixa do TSE (CI)
  if (existsSync(CACHE)) { console.log('📄 usando CSV em cache:', CACHE); return decodificar(readFileSync(CACHE)) }
  console.log('⬇️  baixando do TSE Dados Abertos…')
  const zip = await JSZip.loadAsync(await fetchTseZip(TSE_URL))
  const file = zip.file(CSV_NAME)
  if (!file) throw new Error(`${CSV_NAME} ausente no ZIP`)
  const buf = await file.async('nodebuffer')
  return decodificar(buf)
}

// parser CSV completo: respeita aspas com ';' E '\n' embutidos (campos de texto multi-linha)
function parseCSV(text) {
  const rows = []; let row = [], field = '', q = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { field += '"'; i++ } else q = false } else field += ch }
    else if (ch === '"') q = true
    else if (ch === ';') { row.push(field); field = '' }
    else if (ch === '\r') { /* skip */ }
    else if (ch === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else field += ch
  }
  if (field.length || row.length) { row.push(field); rows.push(row) }
  return rows
}

const clean = (f) => (f || '').replace(/^"|"$/g, '').replace(/#NULO#/g, '').replace(/\s+/g, ' ').trim()
const d = (f) => clean(f).slice(0, 10)
const csvEsc = (v) => { const s = String(v ?? ''); return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }

const COLS = ['register_tse', 'registration_date', 'own_poll', 'cnpj', 'institute', 'institute_trade_name', 'office', 'field_start', 'field_end', 'publication_date', 'sample_size', 'conre', 'statistician', 'cost_brl', 'methodology', 'sampling_plan', 'control_system', 'municipality_data', 'uf', 'electoral_unit', 'scope', 'scope_source']

function buildRegistry(rows) {
  const recs = []
  for (let i = 1; i < rows.length; i++) {
    const f = rows[i]
    if (f.length < 26) continue
    if (!clean(f[14]).toLowerCase().includes('presidente')) continue
    const methodology = clean(f[22]), sampling_plan = clean(f[23]), municipality_data = clean(f[25])
    // Escopo (nacional×estadual) inferido do universo declarado — fonte única scope.mjs.
    // uf=SG_UF é sempre "BR" no BRASIL.csv, então não discrimina; ver scope.mjs.
    const { scope, source: scope_source } = classifyScope(methodology, sampling_plan, municipality_data)
    recs.push({
      register_tse: clean(f[8]), registration_date: d(f[9]), own_poll: clean(f[10]), cnpj: clean(f[11]),
      institute: clean(f[12]), institute_trade_name: clean(f[13]), office: clean(f[14]),
      field_start: d(f[15]), field_end: d(f[16]), publication_date: d(f[17]),
      sample_size: parseInt(clean(f[18])) || '', conre: clean(f[19]), statistician: clean(f[20]),
      cost_brl: parseFloat(clean(f[21]).replace(',', '.')) || '',
      methodology, sampling_plan, control_system: clean(f[24]),
      municipality_data, uf: clean(f[5]), electoral_unit: clean(f[7]),
      scope, scope_source,
    })
  }
  recs.sort((a, b) => (b.registration_date || '').localeCompare(a.registration_date || ''))
  writeFileSync(join(OUT, 'tse-registry.csv'),
    [COLS.join(','), ...recs.map((r) => COLS.map((c) => csvEsc(r[c])).join(','))].join('\n') + '\n')
  writeFileSync(join(OUT, 'tse-registry.json'), JSON.stringify({
    description: 'Official TSE electoral-poll REGISTRY (Brazil 2026, presidential) — FULL public fields from TSE Open Data: registration metadata + methodology + sampling/weighting design + internal control system + responsible statistician. Registration-design fields only; NO per-candidate results, NO result crosstabs (the institute publishes those). The complete questionnaire (art. 33 VI) is a PesqEle attachment, not in the open-data file.',
    source: 'https://dadosabertos.tse.jus.br — pesquisa_eleitoral_2026_BRASIL.csv',
    legal_basis: 'Lei 9.504/1997 art. 33; Resolução TSE 23.600/2019',
    count: recs.length, fields: COLS, records: recs,
  }, null, 2))
  console.log(`✅ tse-registry: ${recs.length} presidenciais, ${COLS.length} campos (metodologia/plano sem truncar)`)
  return recs
}

function enrich22(reg) {
  const POLLS = join(OUT, 'national-polls.json')
  if (!existsSync(POLLS)) { console.log('⚠️ national-polls.json ausente — pulando enriquecimento das 22'); return }
  const data = JSON.parse(readFileSync(POLLS, 'utf-8'))
  const norm = (s) => (s || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
  const byProto = new Map(reg.map((r) => [norm(r.register_tse), r]))
  const days = (a, b) => Math.abs((new Date(a) - new Date(b)) / 86400000)
  const TOKEN = (inst) => {
    const u = (inst || '').toUpperCase()
    if (u.includes('REAL TIME') || u.includes('BIG DATA')) return ['REAL TIME', 'BIG DATA']
    if (u.includes('DATAFOLHA')) return ['DATAFOLHA']
    if (u.includes('QUAEST') || u.includes('GENIAL')) return ['QUAEST']
    if (u.includes('PARAN')) return ['PARAN']
    if (u.includes('ATLAS')) return ['ATLAS']
    if (u.includes('VOX')) return ['VOX']
    if (u.includes('NEXUS')) return ['NEXUS']
    if (u.includes('INDEXA')) return ['INDEXA']
    if (u.includes('GERP')) return ['GERP']
    if (u.includes('MEIO') || u.includes('IDEIA') || u.includes('IDEA')) return ['IDEIA', 'IDEA', 'MEIO']
    return [u.split(/[\/ ]/)[0]]
  }
  const pack = (r, mb) => ({
    register_tse: r.register_tse, cnpj: r.cnpj, institute_full: r.institute,
    statistician: r.statistician, conre: r.conre, cost_brl: r.cost_brl, own_poll: r.own_poll === 'S',
    methodology: r.methodology, sampling_plan: r.sampling_plan, control_system: r.control_system, matched_by: mb,
  })
  let nP = 0, nF = 0, nN = 0
  for (const p of data.polls) {
    const np = norm(p.register)
    let hit = /^BR\d+$/.test(np) ? byProto.get(np) : null, mb = 'protocol'
    if (hit) nP++
    else {
      const toks = TOKEN(p.institute)
      const c = reg.filter((r) => toks.some((t) => r.institute.toUpperCase().includes(t)))
        .map((r) => ({ r, dd: Math.min(days(r.publication_date, p.date), days(r.field_end, p.date)) }))
        .filter((x) => x.dd <= 5).sort((a, b) => a.dd - b.dd)
      if (c.length) { hit = c[0].r; mb = `institute+date(±${c[0].dd.toFixed(0)}d)`; nF++ } else nN++
    }
    p.tse_registration = hit ? pack(hit, mb) : null
  }
  if (!/tse_registration/.test(data.description || '')) {
    data.description = (data.description || '') + ' — Each poll is enriched with its full public TSE registration (methodology, sampling/weighting design, responsible statistician, CONRE, CNPJ, internal control system) via field `tse_registration`, matched by TSE protocol or institute+date.'
  }
  data.enriched_at_note = 'tse_registration sourced from TSE Open Data (Lei 9.504/97 art. 33). Null where no confident registry match. For institute+date matches the methodology/design is the institute standard (stable across waves), not a claim of identical protocol.'
  writeFileSync(POLLS, JSON.stringify(data, null, 2))
  console.log(`✅ national-polls enriquecido: ${nP} protocolo + ${nF} instituto+data + ${nN} sem match`)
}

// Degradação graciosa: se o TSE estiver indisponível mesmo após os retries, NÃO derruba o
// mirror. O tse-registry.csv/json e o national-polls.json já versionados em hf-assets/polls/
// permanecem intactos, e o export do dia segue com eles (dados de mercado/pesquisa/divergência
// do dia publicam normalmente; só o registro TSE fica na versão anterior). Mesmo princípio
// defensivo do build-poll-enrichment.mjs. Exit 0.
try {
  const csv = await loadCsv()
  const rows = parseCSV(csv)
  const reg = buildRegistry(rows)
  enrich22(reg)
  console.log('🏁 build-tse-registry-full concluído.')
} catch (e) {
  console.log(`::warning::TSE Dados Abertos indisponível (${e.message}). Mantendo tse-registry/national-polls já versionados; o mirror segue com os dados do dia. Sem fail.`)
  process.exit(0)
}
