/**
 * Build determinístico do dataset aberto AFOS — US 2026 midterms, versão PRÉ-ELEITORAL.
 *
 * ⚠️ Esta é a v1 e ela NÃO é padrão-ouro, de propósito: a eleição é em 03/Nov/2026
 * e não existe `official-result.json` contra o qual validar a divergência. Todos os
 * bundles em padrão-ouro da casa têm esse arquivo, e é ele que fecha o ciclo. A v2,
 * depois da apuração, é que fecha.
 *
 * ENTRADAS (todas versionadas no repo, nada de `.cache` do autor):
 *   backup/neon/market{,Outcome,Price}/  série de preços do Polymarket, backup diário do Neon
 *   public/us-polls-data.json        generic ballot, lido de lib/us-polls/collect.mjs
 *   public/us-press-archive/*.json   coleta de imprensa por lista fixa de veículos
 *
 * SAÍDA: .cache/us2026-dataset/ (staging; a subida ao HF é passo separado e manual)
 *
 * Rodar: node scripts/build-us-2026-dataset.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, copyFileSync } from 'fs'
import { join } from 'path'
import { gunzipSync } from 'zlib'
import { createHash } from 'crypto'

const ROOT = process.cwd()
const OUT = process.env.US2026_OUT || join(ROOT, '.cache', 'us2026-dataset')

// ── os 9 mercados americanos, com a natureza declarada ──────────────────────────
// binario  = probabilidade de um desfecho (soma dos 2 lados ~100)
// faixa    = distribuicao sobre faixas de cadeiras/comparecimento/margem
const MERCADOS = {
  'which-party-will-win-the-house-in-2026': { arquivo: 'house-control', tipo: 'binario' },
  'which-party-will-win-the-senate-in-2026': { arquivo: 'senate-control', tipo: 'binario' },
  'will-the-2026-midterm-elections-happen-as-scheduled': { arquivo: 'election-as-scheduled', tipo: 'binario' },
  'republican-house-seats-after-the-2026-midterm-elections': { arquivo: 'house-seats-distribution', tipo: 'faixa' },
  'republican-senate-seats-after-the-2026-midterm-elections-927': { arquivo: 'senate-seats-distribution', tipo: 'faixa' },
  'how-many-republican-governors-after-the-2026-midterm-elections': { arquivo: 'governors-distribution', tipo: 'faixa' },
  '2026-midterms-house-turnout': { arquivo: 'turnout-distribution', tipo: 'faixa' },
  '2026-midterms-house-popular-vote-margin-of-victory-224': { arquivo: 'popular-vote-margin-distribution', tipo: 'faixa' },
  'texas-republican-senate-primary-winner': { arquivo: 'texas-senate-primary', tipo: 'binario' },
}

const csvEscape = (v) => {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}
const toCSV = (cabecalho, linhas) =>
  [cabecalho.join(','), ...linhas.map((l) => l.map(csvEscape).join(','))].join('\n') + '\n'

function lerCsvGz(caminho) {
  const txt = gunzipSync(readFileSync(caminho)).toString('utf-8')
  const linhas = txt.split('\n').filter((l) => l.trim())
  const hdr = parseLinhaCsv(linhas[0])
  return linhas.slice(1).map((l) => {
    const v = parseLinhaCsv(l)
    return Object.fromEntries(hdr.map((h, i) => [h, v[i]]))
  })
}

// parser de CSV com aspas, porque `split(',')` quebra em titulo com virgula
function parseLinhaCsv(linha) {
  const out = []
  let cur = '', dentro = false
  for (let i = 0; i < linha.length; i++) {
    const c = linha[i]
    if (dentro) {
      if (c === '"' && linha[i + 1] === '"') { cur += '"'; i++ }
      else if (c === '"') dentro = false
      else cur += c
    } else if (c === '"') dentro = true
    else if (c === ',') { out.push(cur); cur = '' }
    else cur += c
  }
  out.push(cur)
  return out
}

function carregaTabela(nome) {
  const dir = join(ROOT, 'backup', 'neon', nome)
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.csv.gz'))
    .sort()
    .flatMap((f) => lerCsvGz(join(dir, f)))
}

mkdirSync(join(OUT, 'data'), { recursive: true })
mkdirSync(join(OUT, 'polls'), { recursive: true })
mkdirSync(join(OUT, 'press'), { recursive: true })
mkdirSync(join(OUT, 'raw'), { recursive: true })

// ── 1. MERCADO ─────────────────────────────────────────────────────────────────
const markets = new Map(carregaTabela('market').map((m) => [m.id, m]))
const outcomes = new Map(carregaTabela('marketOutcome').map((o) => [o.id, o]))
const precos = carregaTabela('marketPrice')

const porMercado = new Map()
for (const p of precos) {
  const m = markets.get(p.marketId)
  if (!m || !MERCADOS[m.slug]) continue
  const o = outcomes.get(p.outcomeId)
  if (!o) continue
  if (!porMercado.has(m.slug)) porMercado.set(m.slug, [])
  porMercado.get(m.slug).push({
    snapshot_at: p.snapshotAt,
    outcome: o.outcomeName,
    outcome_key: o.outcomeKey,
    price_pct: p.price,
    volume_usd: p.volume,
  })
}

const resumoMercado = []
for (const [slug, cfg] of Object.entries(MERCADOS)) {
  const linhas = (porMercado.get(slug) || []).sort(
    (a, b) => a.snapshot_at.localeCompare(b.snapshot_at) || a.outcome.localeCompare(b.outcome)
  )
  if (!linhas.length) { resumoMercado.push([slug, cfg.tipo, 0, '', '']); continue }
  writeFileSync(
    join(OUT, 'data', `${cfg.arquivo}.csv`),
    toCSV(
      ['snapshot_at_utc', 'market_slug', 'market_type', 'outcome_name', 'outcome_key', 'price_pct', 'volume_usd'],
      linhas.map((l) => [l.snapshot_at, slug, cfg.tipo, l.outcome, l.outcome_key, l.price_pct, l.volume_usd])
    )
  )
  resumoMercado.push([slug, cfg.tipo, linhas.length, linhas[0].snapshot_at.slice(0, 10), linhas[linhas.length - 1].snapshot_at.slice(0, 10)])
}

// coerencia das distribuicoes: a soma das faixas por snapshot.
// O portao editorial da casa exige 95-105% para a faixa ir a tela; aqui a coluna
// vai declarada em vez de filtrada, porque reprovacao tambem e medicao.
const coerencia = []
for (const [slug, cfg] of Object.entries(MERCADOS)) {
  if (cfg.tipo !== 'faixa') continue
  const porSnap = new Map()
  for (const l of porMercado.get(slug) || []) {
    porSnap.set(l.snapshot_at, (porSnap.get(l.snapshot_at) || 0) + parseFloat(l.price_pct || '0'))
  }
  for (const [snap, soma] of [...porSnap.entries()].sort()) {
    coerencia.push([snap, slug, soma.toFixed(2), soma >= 95 && soma <= 105 ? 'true' : 'false'])
  }
}
writeFileSync(
  join(OUT, 'data', 'distribution-coherence.csv'),
  toCSV(['snapshot_at_utc', 'market_slug', 'sum_of_buckets_pct', 'passes_95_105_gate'], coerencia)
)

// ── 2. PESQUISAS: generic ballot ───────────────────────────────────────────────
const gb = JSON.parse(readFileSync(join(ROOT, 'public', 'us-polls-data.json'), 'utf-8'))
const polls = [...gb.polls].sort(
  (a, b) => String(a.campoFim).localeCompare(String(b.campoFim)) || String(a.instituto).localeCompare(String(b.instituto))
)
writeFileSync(
  join(OUT, 'polls', 'us-generic-ballot.csv'),
  toCSV(
    ['fieldwork_start', 'fieldwork_end', 'pollster', 'sample_size', 'sample_type', 'margin_of_error', 'dem_pct', 'rep_pct', 'other_pct', 'dem_margin', 'source_url'],
    polls.map((p) => [p.campoInicio, p.campoFim, p.instituto, p.amostra, p.amostraTipo, p.margemErro, p.dem, p.rep, p.outros, p.vantagemDem, p.fontePrimaria])
  )
)

// ── 3. IMPRENSA ────────────────────────────────────────────────────────────────
const dirPress = join(ROOT, 'public', 'us-press-archive')
const press = []
for (const f of readdirSync(dirPress).filter((f) => f.endsWith('.json')).sort()) {
  const j = JSON.parse(readFileSync(join(dirPress, f), 'utf-8'))
  for (const it of j.itens || []) {
    press.push([j.lastUpdate, it.casa, it.titulo, it.publicadoEm || '', it.origem || '', it.trilho || '', it.url])
  }
}
writeFileSync(
  join(OUT, 'press', 'us-press-timeline.csv'),
  toCSV(['collected_on', 'outlet', 'headline', 'published_at', 'link_origin', 'track', 'url'], press)
)

// ── 4. RAW ─────────────────────────────────────────────────────────────────────
copyFileSync(join(ROOT, 'public', 'us-polls-data.json'), join(OUT, 'raw', 'us-polls-data.json'))
const arquivoPress = {}
for (const f of readdirSync(dirPress).filter((f) => f.endsWith('.json')).sort()) {
  arquivoPress[f.replace('.json', '')] = JSON.parse(readFileSync(join(dirPress, f), 'utf-8'))
}
writeFileSync(join(OUT, 'raw', 'us-press-archive.json'), JSON.stringify(arquivoPress, null, 2))

// ── 5. RESUMO PARA O DATASHEET ─────────────────────────────────────────────────
const datasEleitorais = polls.map((p) => p.campoFim).filter(Boolean).sort()
const resumo = {
  build_utc: process.env.US2026_BUILD_STAMP || null,
  election_date: '2026-11-03',
  status: 'pre-electoral',
  official_result_available: false,
  polls: {
    rows: polls.length,
    pollsters: new Set(polls.map((p) => p.instituto)).size,
    fieldwork_from: datasEleitorais[0],
    fieldwork_to: datasEleitorais[datasEleitorais.length - 1],
    with_primary_source: polls.filter((p) => p.fontePrimaria).length,
  },
  markets: resumoMercado.map(([slug, tipo, n, de, ate]) => ({ slug, type: tipo, rows: n, from: de, to: ate })),
  press: { rows: press.length, collections: readdirSync(dirPress).filter((f) => f.endsWith('.json')).length },
}
writeFileSync(join(OUT, 'data', 'us-2026-case-summary.json'), JSON.stringify(resumo, null, 2))

// ── 6. CHECKSUMS ───────────────────────────────────────────────────────────────
function listaArquivos(dir, base = '') {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? listaArquivos(join(dir, d.name), join(base, d.name)) : [join(base, d.name)]
  )
}
const arquivos = listaArquivos(OUT).filter((f) => f !== 'CHECKSUMS.txt').sort()
writeFileSync(
  join(OUT, 'CHECKSUMS.txt'),
  arquivos
    .map((f) => `${createHash('sha256').update(readFileSync(join(OUT, f))).digest('hex')}  ${f.replace(/\\/g, '/')}`)
    .join('\n') + '\n'
)

console.log('staging:', OUT)
console.log('pesquisas: %d linhas, %d institutos, campo de %s a %s',
  resumo.polls.rows, resumo.polls.pollsters, resumo.polls.fieldwork_from, resumo.polls.fieldwork_to)
console.log('imprensa: %d linhas em %d coletas', resumo.press.rows, resumo.press.collections)
console.log('mercados:')
// ⚠️ `padEnd`/`padStart` e NÃO `%-62s`: o `console.log` do Node não implementa a
// largura de campo do printf de C. Ele aceita `%s`, `%d`, `%j` e pouco mais, e
// deixa `%-62s` passar CRU, imprimindo o próprio código e empurrando os
// argumentos para o fim da linha. O log saía ilegível e ninguém percebia porque
// os valores continuavam todos lá, só desalinhados. Defeito meu de 21/Ago.
for (const m of resumo.markets) {
  console.log(`   ${String(m.slug).padEnd(62)} ${String(m.type).padEnd(8)} ${String(m.rows).padStart(5)} linhas  ${m.from || '-'} a ${m.to || '-'}`)
}
console.log('arquivos gerados:', arquivos.length)
