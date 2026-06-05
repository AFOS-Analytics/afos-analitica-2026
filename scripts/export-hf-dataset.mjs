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
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, readdirSync } from 'fs'
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
    if (existsSync(c)) { copyFileSync(c, join(dCrit, `${d}.json`)); n++ }
    if (existsSync(k)) { copyFileSync(k, join(dCards, `${d}.json`)) }
  }
  console.log(`🗄️  backfill: ${n} datas históricas do branch archive`)
} else {
  console.log('🗄️  backfill: branch archive ausente (em CI ele entra via HF_HISTORY_DIR)')
}

// ---- card + LICENSEs ----
copyFileSync(join(ASSETS, 'README.md'), join(STAGING, 'README.md'))
copyFileSync(join(ASSETS, 'LICENSE-CC-BY-4.0'), join(STAGING, 'LICENSE-CC-BY-4.0'))
copyFileSync(join(ROOT, 'LICENSE'), join(STAGING, 'LICENSE-APACHE-2.0'))

console.log(`✅ staging pronto em ${STAGING}`)
