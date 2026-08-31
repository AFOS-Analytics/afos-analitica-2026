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
import { execSync } from 'child_process'
import { join } from 'path'

const ROOT = process.cwd()
const STAGING = process.env.HF_STAGING_DIR || join(ROOT, '.cache', 'hf-dataset')
const HISTORY_DIR = process.env.HF_HISTORY_DIR || '' // raiz do checkout do branch `archive` (contém archive/YYYY-MM-DD/)
const ASSETS = join(ROOT, 'hf-assets')

const readJSON = (p) => JSON.parse(readFileSync(p, 'utf-8'))
const ensure = (d) => mkdirSync(d, { recursive: true })
const writeJSON = (p, o) => writeFileSync(p, JSON.stringify(o, null, 2))
/**
 * Data de um artefato, tirada do PRÓPRIO objeto que ela vai nomear.
 *
 * 🔴 POR QUE ELA ACEITA DOIS FORMATOS, e por que isso importa (31/Ago/2026).
 *
 * Os três artefatos carimbam a data de jeitos diferentes: `analysis-criteriosa`
 * e `analysis-data` usam `updatedAt` em DD/MM/AAAA, e `polls-data` usa
 * `lastUpdate` em AAAA-MM-DD. Antes esta função lia só o primeiro, então o
 * snapshot de pesquisas era nomeado pela data do arquivo EDITORIAL, e bastava
 * publicar a rodada em dois commits para gravar o arquivo de uma data fechada
 * com o conteúdo de outra. Aconteceu em 31/Ago: o push das pesquisas rodou a
 * esteira 23 segundos depois, com o editorial ainda carimbado no dia anterior,
 * e o `polls-data-2026-08-30.json` publicado passou a carregar o dado de 31/Ago.
 *
 * ⛔ NUNCA voltar a nomear um artefato pelo carimbo de um arquivo vizinho.
 * Ver memory/feedback_o_snapshot_datado_do_hf_leva_a_data_de_outro_arquivo.md
 */
function deriveDate(obj) {
  const br = String(obj?.updatedAt || '').match(/^(\d{2})\/(\d{2})\/(\d{4})/)
  if (br) return `${br[3]}-${br[2]}-${br[1]}`
  const iso = String(obj?.lastUpdate || '').match(/^(\d{4}-\d{2}-\d{2})/)
  return iso ? iso[1] : null
}
const csvEscape = (v) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
const num = (v) => { const n = parseFloat(String(v ?? '').replace(',', '.')); return Number.isFinite(n) ? n : null }

// divergência mercado × pesquisa por candidato, a partir do polls-data.json (polymarketComparison)
//
// A coluna `polymarket_date` foi ACRESCENTADA em 05/Ago/2026, por decisão do André.
// Antes, o arquivo tinha só `date`, que é a data do SNAPSHOT, e a procedência do
// preço ficava sem declaração nenhuma. Isso criava assimetria com os outros dois
// arquivos de divergência, que já traziam `polymarket_date`, e era justamente a
// assimetria que deixava o leitor sem saber se o preço era ou não do dia.
//
// A procedência sai do `polymarketComparison.updatedAt` do próprio painel, que já
// dizia "03/08/2026, 19:11 UTC" enquanto o `lastUpdate` do arquivo dizia
// 2026-08-05. O dado estava lá; o extrator antigo não olhava.
function divergenceCsv(polls, date) {
  const cands = polls?.polymarketComparison?.candidates || []
  // data em que o PREÇO foi medido; cai para a data do snapshot se o painel não declarar
  const priceDate = deriveDate(polls?.polymarketComparison) || date
  const head = 'date,candidate,polymarket_pct,poll_pct,divergence_pp,polymarket_date'
  const rows = cands.map((c) => {
    const poly = num(c.value ?? c.polymarket ?? c.odds)
    const poll = num(c.percentage)
    const div = (poly != null && poll != null) ? Math.round((poly - poll) * 100) / 100 : ''
    return [date, c.name, poly ?? '', poll ?? '', div, priceDate]
  }).filter((r) => r[1])
  return [head, ...rows.map((r) => r.map(csvEscape).join(','))].join('\n') + '\n'
}

/**
 * PROCEDÊNCIA DO PREÇO, instalada 05/Ago/2026 depois de defeito PUBLICADO.
 *
 * O `updatedAt` do JSON é a data em que o PAINEL foi atualizado, e NÃO a data em
 * que o preço foi medido. Quando a trava de captura bloqueia, o painel publica
 * de propósito o preço da última leitura confirmada e diz isso no próprio campo
 * `m`, por exemplo "65,50% (vol USD 7,92M acumulado), preço de 03/Ago".
 *
 * O extrator antigo lia o número, DESCARTAVA essa marcação e estampava o
 * `updatedAt`. Resultado medido no dataset publicado: 01, 04 e 05/Ago receberam
 * o preço e o volume de capturas anteriores como se fossem do dia, 6 linhas cada.
 * Em 04 e 05/Ago os seis nomes repetiam 03/Ago valor por valor, volume incluído.
 *
 * Pior no `divergence-timeseries.csv`, que tem coluna `polymarket_date`: ela
 * AFIRMAVA a data errada, e o `divergence_pp` era calculado sobre ela.
 *
 * Consertar aqui arruma os dois arquivos, porque o divergence deriva daqui.
 */
const MESES_PT = { jan: 1, fev: 2, mar: 3, abr: 4, mai: 5, jun: 6, jul: 7, ago: 8, set: 9, out: 10, nov: 11, dez: 12 }

/**
 * Lê a data de procedência declarada no campo `m`. Devolve `YYYY-MM-DD` ou null.
 * Aceita as formas que o painel usa: "preço de 03/Ago", "preços de 03/Ago",
 * "[preço de 03/Ago]", "da leitura de 03/Ago", "captura travada de 03/Ago".
 * O ano vem do snapshot; se a data resultante ficar no futuro, é do ano anterior
 * (vira o ano em dezembro/janeiro).
 */
function precoDeclaradoEm(mRaw, dataDoSnapshot) {
  const m = String(mRaw).match(/(?:pre[çc]os?|leitura|captura)\s+(?:travada\s+)?d[eoa]\s*(\d{1,2})\/([A-Za-zç]{3})/i)
  if (!m) return null
  const dia = Number(m[1])
  const mes = MESES_PT[m[2].toLowerCase()]
  if (!mes || !dia) return null
  let ano = Number(String(dataDoSnapshot).slice(0, 4))
  const iso = (a) => `${a}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
  if (iso(ano) > dataDoSnapshot) ano -= 1
  return iso(ano)
}

// Série temporal de odds de mercado (Polymarket presidencial), minerada do quadroComparativo[].m
// de cada analysis-criteriosa.json. O campo `m` segue o formato "45.50% (vol USD 5.72M acumulado)"
// (ou "39.5% (estável)" no legado pré-22/Mai, sem volume). Extração por regex, sem fabricar números.
function marketRowsFromCrit(crit, date) {
  const q = crit?.quadroComparativo || []
  return q.map((c) => {
    const mRaw = String(c.m ?? '')
    const pct = (mRaw.match(/(\d+(?:[.,]\d+)?)\s*%/) || [])[1]
    const vol = volumeEmMilhoes(mRaw)
    const nm = String(c.n ?? '').match(/^(.+?)\s*\((.+)\)\s*$/)
    // A data da linha é a da MEDIÇÃO, não a da publicação do painel.
    const declarada = precoDeclaradoEm(mRaw, date)
    return {
      date: declarada || date,
      reatribuida: declarada != null && declarada !== date ? date : null,
      candidate: nomeCanonicoSerie(nm ? nm[1].trim() : String(c.n ?? '').trim()),
      party: nm ? nm[2].trim() : '',
      fonte: 'quadro',
      polymarket_pct: pct != null ? num(pct) : null,
      volume_usd_m: vol,
    }
  }).filter((r) => r.candidate && r.polymarket_pct != null)
}

/**
 * Uma linha por (data, candidato). Necessário porque painéis de dias diferentes
 * podem declarar a MESMA captura: sem isto, 04 e 05/Ago reatribuídos a 03/Ago
 * criariam três linhas idênticas para 03/Ago.
 *
 * Em colisão, vence a que veio do painel do PRÓPRIO dia, que é a medição
 * original, em vez da que foi reatribuída de um painel posterior.
 */
// ---------------------------------------------------------------------------
// NOME CANÔNICO DA SÉRIE (17/Ago/2026)
//
// Em 12/Jul o painel renomeou as linhas do quadroComparativo, e a série pública
// partiu cada pessoa em DUAS: "Flávio" até 11/Jul e "Flávio Bolsonaro" a partir
// de 12/Jul, idem "Renan"/"Renan Santos" e "Zema"/"Romeu Zema". Quem filtrasse a
// série por um nome recebia metade dela e nada avisava.
//
// ⚠️ Casamento por chave EXATA normalizada, nunca por substring: "Michelle
// Bolsonaro" e "Jair Bolsonaro" não podem cair em Flávio.
// ⛔ Nome desconhecido NÃO é descartado nem renomeado: passa como veio.
const semAcento = (t) => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
const ALIAS_SERIE = new Map(Object.entries({
  'flavio': 'Flávio Bolsonaro', 'flavio bolsonaro': 'Flávio Bolsonaro',
  'renan': 'Renan Santos', 'renan santos': 'Renan Santos',
  'zema': 'Romeu Zema', 'romeu zema': 'Romeu Zema',
  'caiado': 'Ronaldo Caiado', 'ronaldo caiado': 'Ronaldo Caiado',
  'haddad': 'Fernando Haddad', 'fernando haddad': 'Fernando Haddad',
  'tarcisio': 'Tarcísio', 'tarcisio de freitas': 'Tarcísio',
  'lula': 'Lula', 'luiz inacio lula da silva': 'Lula',
  'michelle': 'Michelle Bolsonaro', 'michelle bolsonaro': 'Michelle Bolsonaro',
  'marcal': 'Pablo Marçal', 'pablo marcal': 'Pablo Marçal',
}))
const nomeCanonicoSerie = (raw) => ALIAS_SERIE.get(semAcento(raw)) || String(raw || '').trim()

// Linhas de mercado vindas de polls-data.json → polymarketComparison.candidates.
//
// 🔑 POR QUE ESTA FONTE EXISTE ao lado do quadroComparativo: o quadro é a TABELA
// EDITORIAL do painel e carrega quem a peça do dia resolveu comparar. O
// polymarketComparison carrega quem TEM CONTRATO. Tarcísio (USD 13,93M, o maior
// volume do livro presidencial) nunca entrou no quadro, e por isso nunca existiu
// na série pública. Marçal entrou no mercado em 17/Ago e também não entraria.
//
// As duas fontes se somam, não se substituem: o quadro tem o contrato de
// impeachment do STF e a Michelle, que o comparativo não tem.
function marketRowsFromComparison(pollsJson, fallbackDate) {
  const cs = pollsJson?.polymarketComparison?.candidates
  if (!Array.isArray(cs)) return []
  return cs.map((c) => {
    // cada candidato declara a data da PRÓPRIA medição; o topo do arquivo é o fallback
    const date = String(c.lastUpdate || pollsJson.lastUpdate || fallbackDate || '').slice(0, 10)
    const pct = c.odds ?? c.value ?? num((String(c.polymarket ?? '').match(/(\d+(?:[.,]\d+)?)\s*%/) || [])[1])
    // o volume só existe na PROSA do campo de tendência; ausente vira null, nunca zero
    const vol = volumeEmMilhoes(c.tendenciaPolymarket)
    return {
      date,
      reatribuida: null,
      candidate: nomeCanonicoSerie(c.name),
      party: '',
      polymarket_pct: pct != null ? num(pct) : null,
      volume_usd_m: vol,
      fonte: 'comparativo',
    }
  }).filter((r) => r.date && r.candidate && r.polymarket_pct != null)
}

// Histórico do polymarketComparison, minerado do git de polls-data.json.
// Mesmo método já usado por build-hf-poll-results.mjs, e pela mesma razão: o
// branch `archive` só guarda os dois analysis-*.json, então este é o ÚNICO
// caminho para o histórico de quem nunca esteve no quadroComparativo.
function marketRowsFromGitHistory() {
  let shas = []
  try {
    shas = execSync('git log --format=%H -- public/polls-data.json', { cwd: ROOT, encoding: 'utf-8' })
      .trim().split('\n').filter(Boolean)
  } catch (e) {
    // Em CI, git indisponível é FALHA, não motivo para devolver série vazia: o
    // resultado seria republicar o dataset truncado. Localmente segue pulando.
    if (process.env.HF_HISTORY_DIR) {
      console.error('❌ git indisponível no CI, histórico do comparativo não pôde ser lido:', e.message)
      process.exit(1)
    }
    console.log('⚠️ git indisponível, histórico do comparativo pulado:', e.message)
    return []
  }
  const linhas = []
  let lidos = 0
  for (const sha of shas) {
    let j
    try { j = JSON.parse(execSync(`git show ${sha}:public/polls-data.json`, { cwd: ROOT, encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024 })) }
    catch { continue }
    const r = marketRowsFromComparison(j, null)
    if (r.length) { linhas.push(...r); lidos++ }
  }
  console.log(`🕰️  histórico do comparativo: ${linhas.length} linha(s) de ${lidos}/${shas.length} versões de polls-data.json`)
  return linhas
}

// Volume acumulado, SEMPRE em milhões de USD, que é o nome da coluna.
//
// 🔴 17/Ago/2026: o regex antigo era /USD\s+([\d.,]+)\s*M/i e casava o "m" de
// "MIL". "vol USD 84 mil" virava 84 na coluna volume_usd_m, ou seja USD 84
// milhões no lugar de USD 84 mil: erro de MIL VEZES, em 24 linhas publicadas da
// série do impeachment do STF. É o mesmo defeito que o gate numérico da daily
// teve no mesmo dia, e a causa é a mesma: `i` num casamento de UNIDADE.
//
// ⚠️ A ordem importa: "mil" tem que ser testado ANTES de "M", senão "84 mil"
// volta a casar como milhão.
function volumeEmMilhoes(texto) {
  const t = String(texto ?? '')
  const mil = t.match(/USD\s+([\d.,]+)\s*(?:mil|thousand|k)\b/i)
  if (mil) { const v = num(mil[1]); return v == null ? null : v / 1000 }
  const mm = t.match(/USD\s+([\d.,]+)\s*M(?![a-zA-Z])/)
  if (mm) return num(mm[1])
  return null
}

function dedupMarketRows(rows) {
  const porChave = new Map()
  let colisoes = 0
  for (const r of rows) {
    const k = `${r.date}|${r.candidate}`
    const atual = porChave.get(k)
    if (!atual) { porChave.set(k, r); continue }
    colisoes++
    // Medição original pesa mais que qualquer outra coisa (regra original).
    // Empatado nisso, vence a linha mais COMPLETA: o quadroComparativo traz
    // partido e volume, o comparativo às vezes traz só o preço.
    const nota = (x) => (x.reatribuida ? 0 : 4) + (x.party ? 2 : 0) + (x.volume_usd_m != null ? 1 : 0)
    if (nota(r) > nota(atual)) porChave.set(k, r)
  }
  return { linhas: [...porChave.values()], colisoes }
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
  // 17/Ago/2026: entrou no livro presidencial (0,90%, USD 1,21M) e a Datafolha de
  // 21/Ago é a primeira a medi-lo. Sem esta linha, o cruzamento dele nasceria vazio.
  ['marçal', 'Pablo Marçal'], ['marcal', 'Pablo Marçal'],
]
// Nome que não casa com CANON é DESCARTADO da série, e por muito tempo isso
// acontecia calado. Instrumentado em 16/Ago/2026: o descarte continua igual, mas
// agora fica registrado quem caiu, para o próximo nome novo aparecer ANTES de
// virar defeito. ⚠️ Isto NÃO altera a saída, só a observabilidade.
const CANON_DESCARTADOS = new Map()
const canon = (raw) => {
  const s = String(raw || '').toLowerCase()
  for (const [k, v] of CANON) if (s.includes(k)) return v
  const nome = String(raw || '').trim()
  if (nome) CANON_DESCARTADOS.set(nome, (CANON_DESCARTADOS.get(nome) || 0) + 1)
  return null
}

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
// 🔑 UMA DATA POR ARTEFATO, cada uma tirada do arquivo que ela nomeia.
// Elas coincidem quando a rodada é publicada num commit só, e é justamente
// quando NÃO coincidem que a regra vale: cada arquivo vai para a sua data.
const dateCrit = deriveDate(crit)
const dateCards = deriveDate(cards)
const datePolls = deriveDate(polls)
if (!dateCrit) { console.error('❌ não consegui derivar a data de analysis-criteriosa.json'); process.exit(1) }
if (!dateCards) { console.error('❌ não consegui derivar a data de analysis-data.json'); process.exit(1) }
// ⛔ Falha FECHADA de propósito: sem data própria, o polls-data NÃO herda a do
// vizinho. Publicar sob a data de outro arquivo é o defeito que esta função
// existe para impedir, e um snapshot ausente é melhor que um mal rotulado.
if (!datePolls) { console.error('❌ não consegui derivar a data de polls-data.json (lastUpdate)'); process.exit(1) }
console.log(`📅 snapshot: criteriosa ${dateCrit} · cards ${dateCards} · polls ${datePolls}`)
if (dateCrit !== datePolls) {
  console.log(`⚠️  os arquivos estão em datas DIFERENTES, e cada um vai para a sua. Isso acontece quando a rodada é publicada em mais de um commit.`)
}

ensure(STAGING)
const dCrit = join(STAGING, 'snapshots', 'analysis-criteriosa'); ensure(dCrit)
const dCards = join(STAGING, 'snapshots', 'analysis-cards'); ensure(dCards)
ensure(join(STAGING, 'polls')); ensure(join(STAGING, 'news')); ensure(join(STAGING, 'data'))

// snapshots de hoje (datados — append puro)
writeJSON(join(dCrit, `${dateCrit}.json`), crit)
writeJSON(join(dCards, `${dateCards}.json`), cards)
writeJSON(join(STAGING, 'polls', `polls-data-${datePolls}.json`), polls)
writeFileSync(join(STAGING, 'data', `divergence-${datePolls}.csv`), divergenceCsv(polls, datePolls))

// série de odds de mercado — começa com hoje, recebe o histórico no backfill abaixo
const marketRows = [
  ...marketRowsFromCrit(crit, dateCrit),
  ...marketRowsFromComparison(polls, datePolls),
]

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
    if (d === dateCrit) continue
    const c = join(archRoot, d, 'analysis-criteriosa.json')
    const k = join(archRoot, d, 'analysis-cards.json')
    if (existsSync(c)) { copyFileSync(c, join(dCrit, `${d}.json`)); n++; try { marketRows.push(...marketRowsFromCrit(readJSON(c), d)) } catch {} }
    if (existsSync(k)) { copyFileSync(k, join(dCards, `${d}.json`)) }
  }
  console.log(`🗄️  backfill: ${n} datas históricas do branch archive`)
} else if (HISTORY_DIR) {
  // 🔴 FALHA FECHADA quando o CI PEDIU o histórico e ele não veio.
  //
  // O passo de checkout do branch `archive` tem `continue-on-error: true`, então
  // uma falha dele era silenciosa: o exportador seguia sem o backfill, montava a
  // série de mercado só com o dia corrente e o mirror PUBLICAVA essa série curta
  // por cima da completa no Hugging Face. O dataset encolhia sem nenhum erro em
  // lugar nenhum, e ninguém veria até alguém contar as datas.
  //
  // `HISTORY_DIR` definido significa "estamos em CI e o histórico foi pedido".
  // Sem ele (rodada local), o comportamento antigo continua valendo.
  console.error('❌ backfill: HF_HISTORY_DIR está definido mas a pasta archive não existe.')
  console.error('   O checkout do branch `archive` falhou. Publicar agora truncaria a série no Hugging Face.')
  process.exit(1)
} else {
  console.log('🗄️  backfill: branch archive ausente (rodada local, sem HF_HISTORY_DIR)')
}

// ---- BACKFILL do comparativo: git de polls-data.json ----
// Recupera quem TEM CONTRATO e nunca esteve na tabela editorial. O quadro cobre
// 108 datas desde 17/Abr; o comparativo cobre 92 desde 01/Abr, e traz Tarcísio,
// Haddad e Marçal, que o quadro não tem.
marketRows.push(...marketRowsFromGitHistory())

// ---- séries temporais agregadas (núcleo da robustez) ----
//
// Dedup por (data, candidato) DEPOIS do backfill: painéis de dias diferentes podem
// declarar a mesma captura, e sem isto a reatribuição criaria linhas repetidas.
const reatribuidas = marketRows.filter((r) => r.reatribuida)
const { linhas: marketRowsFinal, colisoes } = dedupMarketRows(marketRows)

if (reatribuidas.length) {
  const porPar = new Map()
  for (const r of reatribuidas) {
    const k = `${r.reatribuida} -> ${r.date}`
    porPar.set(k, (porPar.get(k) || 0) + 1)
  }
  console.log(`🕐 procedência: ${reatribuidas.length} linha(s) REATRIBUÍDA(S) à data da medição, não à do painel:`)
  for (const [k, n] of porPar) console.log(`     ${k}  (${n} nome(s))`)
  console.log('     Motivo: o campo `m` declara preço de outra data (trava de captura bloqueada).')
}
if (colisoes) console.log(`🔁 dedup: ${colisoes} colisão(ões) de (data, candidato) resolvida(s), preferindo a medição original`)

// ---- PARTIDO: preenche o que a fonte não trouxe, sem inventar ----
// O comparativo não tem campo de partido. O índice sai de quem JÁ declara o
// partido: as linhas do quadroComparativo e o registro de pesquisa do TSE.
// ⛔ Nome sem partido em nenhuma das duas fontes fica VAZIO, não é chutado.
const idxPartido = new Map()
for (const r of marketRowsFinal) if (r.party && !idxPartido.has(r.candidate)) idxPartido.set(r.candidate, r.party)
try {
  const np = readJSON(join(ASSETS, 'polls', 'national-polls.json'))
  for (const pp of np.polls || []) for (const sc of pp.scenarios || []) for (const rr of sc.results || []) {
    const m = String(rr.candidate ?? '').match(/^(.+?)\s*\((.+)\)\s*$/)
    if (!m) continue
    const nome = nomeCanonicoSerie(m[1])
    if (!idxPartido.has(nome)) idxPartido.set(nome, m[2].trim())
  }
} catch {}
let preenchidos = 0
for (const r of marketRowsFinal) if (!r.party && idxPartido.has(r.candidate)) { r.party = idxPartido.get(r.candidate); preenchidos++ }
if (preenchidos) console.log(`🏷️  partido preenchido em ${preenchidos} linha(s) a partir do quadro e do registro TSE`)

// ---- COBERTURA por nome: ausência tem que ser VISÍVEL ----
// O defeito que este bloco existe para não deixar voltar: a série sumia com um
// nome e ninguém via, então "o contrato acabou" e "a tabela parou de listar"
// tinham exatamente a mesma cara para quem baixasse o dataset.
{
  const porNome = new Map()
  for (const r of marketRowsFinal) {
    const e = porNome.get(r.candidate) || { n: 0, primeira: r.date, ultima: r.date, fontes: new Set() }
    e.n++; e.fontes.add(r.fonte || '?')
    if (r.date < e.primeira) e.primeira = r.date
    if (r.date > e.ultima) e.ultima = r.date
    porNome.set(r.candidate, e)
  }
  const ultimaData = marketRowsFinal.reduce((m, r) => (r.date > m ? r.date : m), '')
  console.log(`🔍 cobertura da série, ${porNome.size} nomes:`)
  for (const [nome, e] of [...porNome.entries()].sort((a, b) => b[1].n - a[1].n)) {
    const encerrado = e.ultima < ultimaData ? `  ⚠️ sem linha desde ${e.ultima}` : ''
    console.log(`     ${String(e.n).padStart(4)}x  ${nome.padEnd(22)} ${e.primeira} → ${e.ultima}  [${[...e.fontes].join('+')}]${encerrado}`)
  }
}

writeFileSync(join(STAGING, 'data', 'market-odds-timeseries.csv'), marketTimeseriesCsv(marketRowsFinal))
console.log(`📈 market-odds-timeseries: ${marketRowsFinal.length} linhas, ${new Set(marketRowsFinal.map((r) => r.date)).size} datas`)
try {
  const np = readJSON(join(ASSETS, 'polls', 'national-polls.json'))
  // usa as linhas JÁ corrigidas: assim o `polymarket_date` passa a dizer a data
  // em que o preço foi medido, e o `divergence_pp` para de ser calculado sobre
  // uma contemporaneidade que não existia.
  writeFileSync(join(STAGING, 'data', 'divergence-timeseries.csv'), divergenceTimeseriesCsv(np.polls, marketRowsFinal))
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

// ---- observabilidade do CANON (não altera a saída) ----
if (CANON_DESCARTADOS.size) {
  const lista = [...CANON_DESCARTADOS.entries()].sort((a, b) => b[1] - a[1])
  console.log(`⚠️  canon: ${lista.length} nome(s) fora da lista, ${lista.reduce((s, [, n]) => s + n, 0)} linha(s) descartada(s)`)
  for (const [nome, n] of lista) console.log(`     ${String(n).padStart(4)}x  ${nome}`)
  console.log('     ⛔ Descarte é CORRETO para quem não tem contrato no Polymarket:')
  console.log('        arquivo de DIVERGÊNCIA exige preço, e linha sem preço seria cruzamento fabricado.')
  console.log('        🔴 Só vira defeito se o nome TIVER contrato e mesmo assim cair aqui.')
} else {
  console.log('✅ canon: nenhum nome fora da lista')
}

console.log(`✅ staging pronto em ${STAGING}`)
