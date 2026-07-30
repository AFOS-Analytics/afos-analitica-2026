/**
 * Export PÚBLICO do dataset AFOS para o Hugging Face (AFOS-Analytics1/brazil-2026-electoral-divergence).
 *
 * ⛔ SALVAGUARDA ANTI-LEAD (LGPD) — NÃO NEGOCIÁVEL:
 *   DB-FREE. Não importa Prisma, não lê DATABASE_URL, NUNCA toca a tabela Lead nem dado de assinante.
 *   Lê SOMENTE artefatos PÚBLICOS já versionados:
 *     - public/analysis-criteriosa.json / public/analysis-data.json
 *     - public/polls-data.json (inclui polymarketComparison → divergência por candidato)
 *     - public/news-cache/{date}.json (apenas links/títulos públicos)
 *     - HF_HISTORY_DIR (opcional): checkout do branch `archive` p/ BACKFILL do legado de snapshots
 *
 * Saída: STAGING (default .cache/hf-dataset) com arquivos DATADOS (append puro, nunca overwrite de
 *        datas passadas) + CSV de divergência por dia + dataset card + LICENSEs. Pronto p/ `hf upload`.
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const ROOT = process.cwd()
const STAGING = process.env.HF_STAGING_DIR || join(ROOT, '.cache', 'hf-dataset')
const HISTORY_DIR = process.env.HF_HISTORY_DIR || '' // raiz do checkout do branch `archive` (contém archive/YYYY-MM-DD/)
const ASSETS = join(ROOT, 'hf-assets')

const readJSON = (p) => JSON.parse(readFileSync(p, 'utf-8'))
const ensure = (d) => mkdirSync(d, { recursive: true })
const writeJSON = (p, o) => writeFileSync(p, JSON.stringify(o, null, 2))
function deriveDate(obj) {
  const m = String(obj?.updatedAt || '').match(/^(\d{2})\/(\d{2})\/(\d{4})/)
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null
}
const csvEscape = (v) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
const num = (v) => { const n = parseFloat(String(v ?? '').replace(',', '.')); return Number.isFinite(n) ? n : null }

// divergência mercado × pesquisa por candidato, a partir do polls-data.json (polymarketComparison)
function divergenceCsv(polls, date) {
  const cands = polls?.polymarketComparison?.candidates || []
  const head = 'date,candidate,polymarket_pct,poll_pct,divergence_pp'
  const rows = cands.map((c) => {
    const poly = num(c.value ?? c.polymarket ?? c.odds)
    const poll = num(c.percentage)
    const div = (poly != null && poll != null) ? Math.round((poly - poll) * 100) / 100 : ''
    return [date, c.name, poly ?? '', poll ?? '', div]
  }).filter((r) => r[1])
  return [head, ...rows.map((r) => r.map(csvEscape).join(','))].join('\n') + '\n'
}

// Série temporal de odds de mercado (Polymarket presidencial), minerada do quadroComparativo[].m
// de cada analysis-criteriosa.json. O campo `m` segue o formato "45.50% (vol USD 5.72M acumulado)"
// (ou "39.5% (estável)" no legado pré-22/Mai, sem volume). Extração por regex, sem fabricar números.
function marketRowsFromCrit(crit, date) {
  const q = crit?.quadroComparativo || []
  return q.map((c) => {
    const mRaw = String(c.m ?? '')
    const pct = (mRaw.match(/(\d+(?:[.,]\d+)?)\s*%/) || [])[1]
    const vol = (mRaw.match(/USD\s+([\d.,]+)\s*M/i) || [])[1]
    const nm = String(c.n ?? '').match(/^(.+?)\s*\((.+)\)\s*$/)
    return {
      date,
      candidate: nm ? nm[1].trim() : String(c.n ?? '').trim(),
      party: nm ? nm[2].trim() : '',
      polymarket_pct: pct != null ? num(pct) : null,
      volume_usd_m: vol != null ? num(vol) : null,
    }
  }).filter((r) => r.candidate && r.polymarket_pct != null)
}
function marketTimeseriesCsv(rows) {
  const head = 'date,candidate,party,polymarket_pct,volume_usd_m'
  const sorted = [...rows].sort((a, b) =>
    a.date === b.date ? (b.polymarket_pct - a.polymarket_pct) : a.date.localeCompare(b.date))
  const body = sorted.map((r) =>
    [r.date, r.candidate, r.party, r.polymarket_pct, r.volume_usd_m ?? ''].map(csvEscape).join(','))
  return [head, ...body].join('\n') + '\n'
}

// Normaliza nomes de candidatos entre as fontes (pesquisa usa nome completo, mercado usa 1º nome).
// 'michelle' antes de qualquer 'bolsonaro' para não colidir com Flávio.
const CANON = [
  ['michelle', 'Michelle Bolsonaro'], ['lula', 'Lula'], ['flávio', 'Flávio'], ['flavio', 'Flávio'],
  ['caiado', 'Caiado'], ['zema', 'Zema'], ['renan', 'Renan'], ['haddad', 'Haddad'],
  ['tarcísio', 'Tarcísio'], ['tarcisio', 'Tarcísio'], ['camilo', 'Camilo Santana'],
  ['ratinho', 'Ratinho Jr'], ['eduardo leite', 'Eduardo Leite'], ['ciro', 'Ciro Gomes'], ['simone', 'Simone Tebet'],
]
const canon = (raw) => { const s = String(raw || '').toLowerCase(); for (const [k, v] of CANON) if (s.includes(k)) return v; return null }

// Divergência mercado × pesquisa por candidato/dia: junta cada resultado de pesquisa nacional (1º turno)
// à odd Polymarket do candidato na data da pesquisa (nearest on-or-before). Reconstrói o sinal-tema.
function divergenceTimeseriesCsv(polls, marketRows) {
  const idx = {}
  for (const r of marketRows) { const k = canon(r.candidate); if (k) (idx[k] ||= []).push({ date: r.date, pct: r.polymarket_pct }) }
  for (const k in idx) idx[k].sort((a, b) => a.date.localeCompare(b.date))
  // nearest market odd ON OR BEFORE the poll date; null if the poll predates the market series
  // (no fabricated contemporaneity — a March poll is never matched to an April price)
  const marketAt = (k, d) => { const arr = idx[k]; if (!arr) return null; let best = null; for (const e of arr) { if (e.date <= d) best = e; else break } return best }
  const head = 'poll_date,institute,register_tse,candidate,poll_pct,polymarket_pct,polymarket_date,divergence_pp'
  const rows = []
  for (const p of polls || []) {
    const sc = (p.scenarios || []).find((s) => /1|primeiro|first|principal/i.test(s.name || '')) || (p.scenarios || [])[0]
    if (!sc) continue
    for (const r of sc.results || []) {
      const k = canon(r.candidate); if (!k) continue
      const m = marketAt(k, p.date); const poll = num(r.percent)
      if (!m || poll == null) continue
      rows.push([p.date, p.institute, p.register || '', k, poll, m.pct, m.date, Math.round((m.pct - poll) * 100) / 100])
    }
  }
  return [head, ...rows.map((r) => r.map(csvEscape).join(','))].join('\n') + '\n'
}

function copyDirInto(srcDir, destDir) {
  if (!existsSync(srcDir)) return 0
  ensure(destDir); let n = 0
  for (const f of readdirSync(srcDir)) { const s = join(srcDir, f); if (statSync(s).isFile()) { copyFileSync(s, join(destDir, f)); n++ } }
  return n
}

// ---- artefatos públicos de hoje ----
const crit = readJSON(join(ROOT, 'public', 'analysis-criteriosa.json'))
const cards = readJSON(join(ROOT, 'public', 'analysis-data.json'))
const polls = readJSON(join(ROOT, 'public', 'polls-data.json'))
const date = deriveDate(crit) || deriveDate(cards)
if (!date) { console.error('❌ não consegui derivar a data de updatedAt'); process.exit(1) }
console.log(`📅 snapshot de hoje: ${date}`)

ensure(STAGING)
const dCrit = join(STAGING, 'snapshots', 'analysis-criteriosa'); ensure(dCrit)
const dCards = join(STAGING, 'snapshots', 'analysis-cards'); ensure(dCards)
ensure(join(STAGING, 'polls')); ensure(join(STAGING, 'news')); ensure(join(STAGING, 'data'))

// snapshots de hoje (datados — append puro)
writeJSON(join(dCrit, `${date}.json`), crit)
writeJSON(join(dCards, `${date}.json`), cards)
writeJSON(join(STAGING, 'polls', `polls-data-${date}.json`), polls)
writeFileSync(join(STAGING, 'data', `divergence-${date}.csv`), divergenceCsv(polls, date))

// série de odds de mercado — começa com hoje, recebe o histórico no backfill abaixo
const marketRows = marketRowsFromCrit(crit, date)

// notícias: SOMENTE metadados públicos de link (sem corpo). `queries` é objeto → Object.values.
try {
  const ncFiles = readdirSync(join(ROOT, 'public', 'news-cache')).filter((f) => f.endsWith('.json')).sort()
  const latest = ncFiles[ncFiles.length - 1]
  if (latest) {
    const nc = readJSON(join(ROOT, 'public', 'news-cache', latest))
    const queries = Array.isArray(nc.queries) ? nc.queries : Object.values(nc.queries || {})
    const allItems = queries.flatMap((q) => (Array.isArray(q) ? q : q?.items) || [])
    const items = [...new Map(allItems.map((i) => [i.link, {
      source: i.sourceName || null, title: i.title || null, url: i.link || null, published: i.pubDate || null,
    }])).values()].filter((i) => i.url)
    const newsDate = latest.replace('.json', '')
    writeJSON(join(STAGING, 'news', `news-${newsDate}.json`), { date: newsDate, count: items.length, items })
    console.log(`📰 news: ${items.length} links públicos (${newsDate})`)
  }
} catch (e) { console.log('⚠️ news-cache indisponível, pulando:', e.message) }

// ---- BACKFILL do legado: snapshots históricos do branch `archive` ----
if (HISTORY_DIR && existsSync(join(HISTORY_DIR, 'archive'))) {
  const archRoot = join(HISTORY_DIR, 'archive')
  let n = 0
  for (const d of readdirSync(archRoot).filter((x) => /^\d{4}-\d{2}-\d{2}$/.test(x)).sort()) {
    if (d === date) continue
    const c = join(archRoot, d, 'analysis-criteriosa.json')
    const k = join(archRoot, d, 'analysis-cards.json')
    if (existsSync(c)) { copyFileSync(c, join(dCrit, `${d}.json`)); n++; try { marketRows.push(...marketRowsFromCrit(readJSON(c), d)) } catch {} }
    if (existsSync(k)) { copyFileSync(k, join(dCards, `${d}.json`)) }
  }
  console.log(`🗄️  backfill: ${n} datas históricas do branch archive`)
} else {
  console.log('🗄️  backfill: branch archive ausente (em CI ele entra via HF_HISTORY_DIR)')
}

// ---- séries temporais agregadas (núcleo da robustez) ----
writeFileSync(join(STAGING, 'data', 'market-odds-timeseries.csv'), marketTimeseriesCsv(marketRows))
console.log(`📈 market-odds-timeseries: ${marketRows.length} linhas, ${new Set(marketRows.map((r) => r.date)).size} datas`)
try {
  const np = readJSON(join(ASSETS, 'polls', 'national-polls.json'))
  writeFileSync(join(STAGING, 'data', 'divergence-timeseries.csv'), divergenceTimeseriesCsv(np.polls, marketRows))
  console.log(`📊 divergence-timeseries reconstruída de ${np.polls?.length || 0} pesquisas nacionais`)
} catch (e) { console.log('⚠️ divergence-timeseries pulado:', e.message) }

// ---- artefatos de pesquisa estáticos (registro TSE + resultados nacionais) ----
console.log(`🗳️  polls estáticos copiados: ${copyDirInto(join(ASSETS, 'polls'), join(STAGING, 'polls'))} arquivos`)

// ---- docs acadêmicos ----
for (const f of ['DATA_DICTIONARY.md', 'CITATION.cff', 'CHANGELOG.md', 'ERRATA.md']) {
  const src = join(ASSETS, f); if (existsSync(src)) copyFileSync(src, join(STAGING, f))
}

// ---- card + LICENSEs ----
copyFileSync(join(ASSETS, 'README.md'), join(STAGING, 'README.md'))
copyFileSync(join(ASSETS, 'LICENSE-CC-BY-4.0'), join(STAGING, 'LICENSE-CC-BY-4.0'))
copyFileSync(join(ROOT, 'LICENSE'), join(STAGING, 'LICENSE-APACHE-2.0'))

console.log(`✅ staging pronto em ${STAGING}`)
