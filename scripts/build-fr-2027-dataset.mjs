/**
 * Build determinístico do dataset aberto AFOS — FRANCE 2027 presidential. Criado 08/Nov/2026.
 *
 * Molde: `build-us-2026-dataset.mjs`. Versão PRÉ-ELEITORAL: o 1º turno é em
 * 18/Abr/2027 e o 2º em 02/Mai/2027; o resultado oficial entra numa versão
 * posterior, e é ele que fecha o ciclo.
 *
 * ENTRADAS (todas versionadas no repo, nada de `.cache` do autor nem API ao vivo):
 *   backup/neon/market{,Outcome,Price}/  série de preços da Polymarket, backup diário do Neon
 *   backup/neon/analysisReport/          registros `fr-polls-*` (pesquisas conferidas com a
 *                                        ficha oficial) e `fr-press-*` (imprensa, 1 por dia)
 *   public/fr/institutos.json            tabela de institutos que a tela mostra
 *
 * 📒 KALSHI ENTRA desde a v1.1.0, por decisão do André em 08/Nov/2026, tomada
 * sabendo que o Kalshi Developer Agreement v1.1, §3.1, pede autorização escrita
 * para compartilhar dado da API (memory/reference_kalshi_termos_proibem_compartilhar_dado_da_api.md).
 * Livro próprio, arquivos próprios, NUNCA somado nem tirado média com a Polymarket.
 *
 * 🧹 A série da Polymarket começa em 2026-11-08T19:30Z. A captura das 18:30 foi
 * descartada (contratos de enchimento "Candidate A" e rótulos de emergência), e
 * contrato de enchimento nunca é preço: sai em qualquer instante.
 *
 * SAÍDA: .cache/fr2027-dataset/ (staging; a subida é `scripts/hf-upload-fr2027.py`)
 * Rodar: node scripts/build-fr-2027-dataset.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, rmSync } from 'fs'
import { join } from 'path'
import { gunzipSync } from 'zlib'
import { createHash } from 'crypto'

const ROOT = process.cwd()
const OUT = process.env.FR2027_OUT || join(ROOT, '.cache', 'fr2027-dataset')
const INICIO_SERIE = '2026-11-08T19:30'
const ENCHIMENTO = /^(?:Candidate|Person|Player|Option) [A-Z]$/

// binario  = cada contrato é um sim/não próprio (os preços não somam 100)
// exclusivo = só um desfecho acontece (os preços tendem a somar perto de 100)
const MERCADOS = {
  'next-french-presidential-election': { arquivo: 'winner', tipo: 'mutually-exclusive' },
  'french-presidential-election-first-round-winner': { arquivo: 'first-round-winner', tipo: 'mutually-exclusive' },
  'next-french-presidential-election-who-will-advance-to-the-2nd-round': { arquivo: 'advance-to-runoff', tipo: 'independent-binary' },
  '2027-french-presidential-election-who-will-be-on-the-ballot': { arquivo: 'on-the-ballot', tipo: 'independent-binary' },
}

const csvEscape = (v) => {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}
const toCSV = (cab, linhas) => [cab.join(','), ...linhas.map((l) => l.map(csvEscape).join(','))].join('\n') + '\n'

// CSV com aspas e quebra de linha DENTRO do campo (o bodyMarkdown é JSON multilinha).
function parseCsv(txt) {
  const rows = []
  let row = [], cur = '', dentro = false
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i]
    if (dentro) {
      if (c === '"' && txt[i + 1] === '"') { cur += '"'; i++ }
      else if (c === '"') dentro = false
      else cur += c
    } else if (c === '"') dentro = true
    else if (c === ',') { row.push(cur); cur = '' }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = '' }
    else if (c !== '\r') cur += c
  }
  if (cur || row.length) { row.push(cur); rows.push(row) }
  const [hdr, ...corpo] = rows.filter((r) => r.length > 1 || r[0])
  return corpo.map((v) => Object.fromEntries(hdr.map((h, i) => [h, v[i]])))
}
function carregaTabela(nome) {
  const dir = join(ROOT, 'backup', 'neon', nome)
  if (!existsSync(dir)) return []
  return readdirSync(dir).filter((f) => f.endsWith('.csv.gz')).sort()
    .flatMap((f) => parseCsv(gunzipSync(readFileSync(join(dir, f))).toString('utf-8')))
}

rmSync(OUT, { recursive: true, force: true })
for (const d of ['data', 'polls', 'press', 'raw', 'reference']) mkdirSync(join(OUT, d), { recursive: true })

// ── 1. MERCADO ─────────────────────────────────────────────────────────────────
const markets = new Map(carregaTabela('market').map((m) => [m.id, m]))
const outcomes = new Map(carregaTabela('marketOutcome').map((o) => [o.id, o]))
const porMercado = new Map()
let descartesEnchimento = 0, descartesAntes = 0
for (const p of carregaTabela('marketPrice')) {
  const m = markets.get(p.marketId)
  if (!m || !MERCADOS[m.slug]) continue
  const o = outcomes.get(p.outcomeId)
  if (!o) continue
  if (p.snapshotAt < INICIO_SERIE) { descartesAntes++; continue }
  if (ENCHIMENTO.test(o.outcomeName.replace(/^Will (.+?) (?:win|advance|be on).*$/, '$1'))) { descartesEnchimento++; continue }
  if (!porMercado.has(m.slug)) porMercado.set(m.slug, [])
  porMercado.get(m.slug).push([p.snapshotAt, m.slug, MERCADOS[m.slug].tipo, o.outcomeName, o.outcomeKey, p.price, p.volume])
}
const resumoMercado = []
for (const [slug, cfg] of Object.entries(MERCADOS)) {
  const linhas = (porMercado.get(slug) || []).sort((a, b) => a[0].localeCompare(b[0]) || a[3].localeCompare(b[3]))
  writeFileSync(join(OUT, 'data', `${cfg.arquivo}.csv`),
    toCSV(['snapshot_at_utc', 'market_slug', 'market_type', 'outcome_name', 'outcome_key', 'price_pct', 'volume_usd'], linhas))
  resumoMercado.push({ slug, file: `data/${cfg.arquivo}.csv`, type: cfg.tipo, rows: linhas.length,
    snapshots: new Set(linhas.map((l) => l[0])).size, from: linhas[0]?.[0] ?? null, to: linhas.at(-1)?.[0] ?? null })
}

// O dataset é em INGLÊS: status e motivo da conferência saem traduzidos, por tabela fechada.
const STATUS_EN = { confere: 'matches', diverge: 'mismatch', 'sem-numero': 'no-notice-cited', 'fora-da-listagem': 'not-on-2027-listing', 'instituto-sem-mapa': 'pollster-not-mapped' }
const statusEn = (s) => { if (!STATUS_EN[s]) throw new Error('status de ficha sem tradução: ' + s); return STATUS_EN[s] }
function motivoEn(p) {
  const f = p.ficha
  if (f.status === 'diverge') return `the source says ${p.instituto}; notice ${f.numero} is "${f.rotulo}"`
  if (f.status === 'sem-numero') return 'the source cites no notice number'
  if (f.status === 'fora-da-listagem') return `notice ${f.numero} is not on the Commission's 2027 listing`
  if (f.status === 'instituto-sem-mapa') return `pollster "${p.instituto}" is not mapped`
  return ''
}

// ── 1b. KALSHI: livro próprio, com o diário de capturas ao lado ──────────────
const capturasK = carregaTabela('kalshiCaptura').filter((c) => c.pais === 'fra').sort((a, b) => a.startedAt.localeCompare(b.startedAt))
const idsK = new Set(capturasK.map((c) => c.id))
const precosK = carregaTabela('kalshiPreco').filter((k) => idsK.has(k.capturaId))
  .sort((a, b) => a.snapshotAt.localeCompare(b.snapshotAt) || a.candidato.localeCompare(b.candidato))
writeFileSync(join(OUT, 'data', 'kalshi-winner.csv'), toCSV(
  ['snapshot_at_utc', 'event_ticker', 'ticker', 'candidate', 'last_price_pct', 'bid_pct', 'ask_pct', 'volume_contracts', 'open_interest_contracts', 'last_trade_at_utc'],
  precosK.map((k) => [k.snapshotAt, k.eventTicker, k.ticker, k.candidato, k.preco, k.compra, k.venda, k.volumeContratos, k.contratosEmAberto, k.ultimaNegociacaoEm])))
writeFileSync(join(OUT, 'data', 'kalshi-captures.csv'), toCSV(
  ['started_at_utc', 'finished_at_utc', 'event_ticker', 'contracts_read', 'rows_stored', 'sum_of_prices', 'passed_check', 'defects', 'warnings', 'origin'],
  capturasK.map((c) => [c.startedAt, c.finishedAt, c.eventTicker, c.contratos, c.gravados, c.somaPrecos, c.ok, c.defeitos, c.avisos, c.origem])))
const resumoKalshi = { source: 'Kalshi', event: 'KXFRENCHPRES-27', file: 'data/kalshi-winner.csv', captures_file: 'data/kalshi-captures.csv',
  rows: precosK.length, snapshots: new Set(precosK.map((k) => k.snapshotAt)).size, captures: capturasK.length,
  captures_passing_check: capturasK.filter((c) => c.ok === 'true').length,
  from: precosK[0]?.snapshotAt ?? null, to: precosK.at(-1)?.snapshotAt ?? null }

// ── 2. PESQUISAS: o registro fr-polls mais recente (ele é cumulativo) ──────────
const relatorios = carregaTabela('analysisReport')
const ultimoDe = (prefixo) => relatorios.filter((r) => r.slug?.startsWith(prefixo)).sort((a, b) => a.publishedAt.localeCompare(b.publishedAt))
const regPolls = ultimoDe('fr-polls-').at(-1)
if (!regPolls) throw new Error('nenhum registro fr-polls no backup: rodar o backup do Neon antes')
const P = JSON.parse(regPolls.bodyMarkdown)
const pesquisas = [...P.pesquisas].sort((a, b) => a.campo.fim.localeCompare(b.campo.fim) || a.pollId.localeCompare(b.pollId))
writeFileSync(join(OUT, 'polls', 'fr-voting-intentions.csv'), toCSV(
  ['poll_id', 'round', 'hypothesis', 'pollster', 'client', 'fieldwork_start', 'fieldwork_end', 'sample_size',
    'notice_number', 'notice_check', 'notice_url', 'list_sum_pct', 'publishable', 'candidate', 'party', 'intention_pct'],
  pesquisas.flatMap((p) => p.intencoes.map((i) => [p.pollId, p.turno, p.hipotese, p.instituto, p.cliente, p.campo.inicio, p.campo.fim,
    p.amostra ?? '', p.ficha.numero ?? '', statusEn(p.ficha.status), p.ficha.url ?? '', p.soma, p.publicavel, i.candidato, P.partidos?.[i.candidato] ?? '', i.pct]))))
writeFileSync(join(OUT, 'polls', 'fr-notice-mismatches.csv'), toCSV(['poll_id', 'pollster', 'fieldwork_end', 'notice_number_cited', 'notice_check', 'reason'],
  pesquisas.filter((p) => p.ficha.status !== 'confere').map((p) => [p.pollId, p.instituto, p.campo.fim, p.ficha.numero ?? '', statusEn(p.ficha.status), motivoEn(p)])))
writeFileSync(join(OUT, 'polls', 'fr-pending-notices.csv'), toCSV(['notice_number', 'notice_title', 'notice_url'],
  (P.pendentes || []).map((f) => [f.numero, f.rotulo, f.url])))

// ── 3. IMPRENSA: um registro fr-press por dia ──────────────────────────────────
const regsPress = ultimoDe('fr-press-')
const press = []
for (const r of regsPress) {
  const j = JSON.parse(r.bodyMarkdown)
  for (const it of j.itens || []) press.push([j.fetchedAt, it.casa, it.titulo, it.publicadoEm || '', it.origem || '', it.trilho || '', it.url])
}
writeFileSync(join(OUT, 'press', 'fr-press-timeline.csv'),
  toCSV(['collected_at_utc', 'outlet', 'headline', 'published_at', 'link_origin', 'track', 'url'], press))
const veiculos = regsPress.length ? JSON.parse(regsPress.at(-1).bodyMarkdown).veiculos : []
writeFileSync(join(OUT, 'press', 'fr-outlet-list.csv'), toCSV(['outlet', 'type'], veiculos.map((v) => [v.casa, v.tipo])))

// ── 4. RAW e REFERÊNCIA ────────────────────────────────────────────────────────
writeFileSync(join(OUT, 'raw', 'fr-polls-latest.json'), JSON.stringify(P, null, 2))
writeFileSync(join(OUT, 'raw', 'fr-press-archive.json'),
  JSON.stringify(Object.fromEntries(regsPress.map((r) => [r.slug, JSON.parse(r.bodyMarkdown)])), null, 2))
writeFileSync(join(OUT, 'reference', 'pollsters.json'), readFileSync(join(ROOT, 'public', 'fr', 'institutos.json')))

// ── 5. RESUMO ──────────────────────────────────────────────────────────────────
const pub = pesquisas.filter((p) => p.publicavel)
const campos = pub.map((p) => p.campo.fim).sort()
const resumo = {
  build_utc: process.env.FR2027_BUILD_STAMP || null,
  election: { first_round: '2027-04-18', runoff: '2027-05-02' },
  status: 'pre-electoral',
  official_result_available: false,
  kalshi: resumoKalshi,
  markets: { source: 'Polymarket', series_starts_utc: `${INICIO_SERIE}:00Z`, books: resumoMercado,
    dropped_rows: { before_series_start: descartesAntes, placeholder_contracts: descartesEnchimento } },
  polls: {
    record: regPolls.slug, collected_at: P.fetchedAt, lists: pesquisas.length, publishable_lists: pub.length,
    first_round_lists: pub.filter((p) => p.turno === 1).length, runoff_matchups: pub.filter((p) => p.turno === 2).length,
    pollsters: new Set(pub.map((p) => p.instituto.trim().toLowerCase())).size,
    fieldwork_from: campos[0] ?? null, fieldwork_to: campos.at(-1) ?? null,
    lists_failing_notice_check: pesquisas.filter((p) => p.ficha.status !== 'confere').length, pending_notices: (P.pendentes || []).length,
  },
  press: { rows: press.length, daily_records: regsPress.length, outlets_on_list: veiculos.length },
}
writeFileSync(join(OUT, 'data', 'fr-2027-case-summary.json'), JSON.stringify(resumo, null, 2))

// ── 6. CHECKSUMS ───────────────────────────────────────────────────────────────
const lista = (dir, base = '') => readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
  d.isDirectory() ? lista(join(dir, d.name), join(base, d.name)) : [join(base, d.name)])
const arquivos = lista(OUT).filter((f) => f !== 'CHECKSUMS.txt').sort()
writeFileSync(join(OUT, 'CHECKSUMS.txt'), arquivos.map((f) =>
  `${createHash('sha256').update(readFileSync(join(OUT, f))).digest('hex')}  ${f.replace(/\\/g, '/')}`).join('\n') + '\n')

console.log('staging:', OUT)
console.log(`  kalshi ${resumoKalshi.rows} linhas, ${resumoKalshi.snapshots} instantes, ${resumoKalshi.captures} capturas (${resumoKalshi.captures_passing_check} ok), ${resumoKalshi.from} a ${resumoKalshi.to}`)
for (const m of resumoMercado) console.log(`  mercado ${m.file.padEnd(28)} ${String(m.rows).padStart(6)} linhas, ${m.snapshots} instantes, ${m.from ?? '-'} a ${m.to ?? '-'}`)
console.log(`  descartes: ${descartesAntes} antes de ${INICIO_SERIE}Z, ${descartesEnchimento} de enchimento`)
console.log(`  pesquisas: ${pesquisas.length} listas (${pub.length} publicáveis, ${resumo.polls.pollsters} institutos), campo ${resumo.polls.fieldwork_from} a ${resumo.polls.fieldwork_to}`)
console.log(`  imprensa: ${press.length} manchetes em ${regsPress.length} registro(s) diário(s), ${veiculos.length} veículos na lista`)
console.log('  arquivos:', arquivos.length)
