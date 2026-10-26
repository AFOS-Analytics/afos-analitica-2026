/**
 * 🌙 Noite da apuração do 2º turno (25/10/2026) no dataset do HF, a partir dos
 * arquivos BRUTOS do coletor em `data/brz/noite-2turno-2026/` (fora do git).
 *
 * Escreve em `hf-assets/election-night/`:
 *   - second-round-2026-live.{csv,jsonl}: uma linha por batida do coletor
 *     (a cada 3 min), totalização do TSE (eleição 6258) e preço do contrato de
 *     vencedor na mesma hora, em LEITURA ÚNICA (sem a dupla leitura da trava);
 *   - second-round-2026-trades.csv: as negociações nos dois contratos do
 *     vencedor, com a carteira ANONIMIZADA;
 *   - second-round-2026-holders.csv: os 20 maiores detentores de cada lado de
 *     cada contrato, a cada minuto, também anonimizados.
 *
 * 🔒 ANONIMIZAÇÃO (régua das carteiras): endereço, apelido, nome, bio, imagem e
 *    hash da transação NÃO saem. Cada carteira vira A1, A2... por ordem de
 *    dinheiro negociado na noite (somando os dois contratos); quem só aparece
 *    entre os detentores vem depois, por ordem da maior posição. O mapa fica em
 *    `data/brz/noite-2turno-2026/carteiras/mapa-anonimo.json`, local e fora do git.
 *
 * 📏 COBERTURA declarada por linha: o coletor só ficou completo depois que o v4
 *    passou a paginar até a sobreposição (23:48 UTC) e varreu 13 páginas para
 *    trás. A varredura alcançou 23:15:26 UTC no contrato de Lula e 23:26:32 UTC
 *    no de Flávio Bolsonaro; antes disso a leitura era de 500 por vez e há
 *    buracos. `coverage` = complete a partir desses instantes, partial antes.
 *
 * Uso: node scripts/build-hf-noite-2turno.mjs
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const BRUTO = join(ROOT, 'data', 'brz', 'noite-2turno-2026')
const SAIDA = join(ROOT, 'hf-assets', 'election-night')
const MAPA = join(BRUTO, 'carteiras', 'mapa-anonimo.json')
if (!existsSync(BRUTO)) { console.error('❌ sem os arquivos brutos em ' + BRUTO); process.exit(1) }
if (existsSync(join(BRUTO, 'carteiras', 'lacunas.jsonl'))) { console.error('❌ há lacunas.jsonl: declarar antes de publicar'); process.exit(1) }

const L = (f) => readFileSync(f, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l))
const CONTRATOS = { lula: 'lula', flavio: 'flavio_bolsonaro' }
const COMPLETO_DESDE = { lula: Date.parse('2026-10-25T23:15:26Z') / 1e3, flavio: Date.parse('2026-10-25T23:26:32Z') / 1e3 }
const csv = (linhas) => linhas.map((l) => l.map((v) => {
  const s = v === null || v === undefined ? '' : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}).join(',')).join('\n') + '\n'
const r2 = (n) => Math.round(n * 100) / 100

// ---- negociações, deduplicadas ----
const chave = (t) => [t.transactionHash, t.asset, t.proxyWallet, t.side, t.size, t.price, t.timestamp].join('|')
const trades = []
for (const c of Object.keys(CONTRATOS)) {
  const vistos = new Set()
  for (const t of L(join(BRUTO, 'carteiras', `trades-${c}.jsonl`))) {
    const k = chave(t); if (vistos.has(k)) continue; vistos.add(k)
    trades.push({ c, t })
  }
}
const holders = L(join(BRUTO, 'carteiras', 'holders.jsonl'))

// ---- mapa anônimo ----
const usd = new Map()
for (const { t } of trades) usd.set(t.proxyWallet, (usd.get(t.proxyWallet) ?? 0) + t.size * t.price)
const ordem = [...usd.entries()].sort((a, b) => b[1] - a[1]).map(([w]) => w)
const posMax = new Map()
for (const h of holders) for (const d of h.data) for (const x of d.holders) {
  if (!usd.has(x.proxyWallet)) posMax.set(x.proxyWallet, Math.max(posMax.get(x.proxyWallet) ?? 0, x.amount))
}
ordem.push(...[...posMax.entries()].sort((a, b) => b[1] - a[1]).map(([w]) => w))
const id = new Map(ordem.map((w, i) => [w, `A${i + 1}`]))
writeFileSync(MAPA, JSON.stringify(Object.fromEntries(id), null, 0) + '\n')

// ---- série da noite ----
const serie = L(join(BRUTO, 'serie.jsonl'))
const cab = ['collected_at_utc', 'tse_tally_time_brt', 'tse_sections_tallied', 'tse_sections_tallied_pct', 'tse_mathematically_defined', 'tse_final',
  'valid_lula', 'valid_flavio_bolsonaro', 'votes_lula', 'votes_flavio_bolsonaro', 'valid_votes', 'blank_pct', 'null_pct', 'abstention_pct',
  'market_reading_utc', 'winner_price_lula', 'winner_price_flavio_bolsonaro', 'winner_volume_usd_lula', 'winner_volume_usd_flavio_bolsonaro', 'market_confirmation']
const linhasSerie = serie.map((s) => {
  const T = s.tse ?? {}, P = s.polymarket ?? {}
  return {
    collected_at_utc: s.coletadoEm, tse_tally_time_brt: T.geradoEm ?? null, tse_sections_tallied: T.secoesTotalizadas ?? null,
    tse_sections_tallied_pct: T.pctSecoes ?? null,
    tse_mathematically_defined: T.matematicamenteDefinido === undefined ? null : T.matematicamenteDefinido === 's',
    tse_final: T.totalizacaoFinal === undefined ? null : T.totalizacaoFinal === 's',
    valid_lula: T.lula?.pct ?? null, valid_flavio_bolsonaro: T.flavio?.pct ?? null,
    votes_lula: T.lula?.votos ?? null, votes_flavio_bolsonaro: T.flavio?.votos ?? null, valid_votes: T.validos ?? null,
    blank_pct: T.pctBrancos ?? null, null_pct: T.pctNulos ?? null, abstention_pct: T.pctAbstencao ?? null,
    market_reading_utc: P.fetchedAt ?? null, winner_price_lula: P.lula?.pct ?? null, winner_price_flavio_bolsonaro: P.flavio?.pct ?? null,
    winner_volume_usd_lula: P.lula?.volUsd ?? null, winner_volume_usd_flavio_bolsonaro: P.flavio?.volUsd ?? null,
    market_confirmation: 'single reading',
  }
})
mkdirSync(SAIDA, { recursive: true })
writeFileSync(join(SAIDA, 'second-round-2026-live.csv'), csv([cab, ...linhasSerie.map((r) => cab.map((k) => r[k]))]))
writeFileSync(join(SAIDA, 'second-round-2026-live.jsonl'), linhasSerie.map((r) => JSON.stringify(r)).join('\n') + '\n')

// ---- negociações anonimizadas ----
trades.sort((a, b) => a.t.timestamp - b.t.timestamp || a.c.localeCompare(b.c))
writeFileSync(join(SAIDA, 'second-round-2026-trades.csv'), csv([
  ['timestamp_utc', 'contract', 'outcome', 'side', 'shares', 'price', 'notional_usd', 'wallet', 'coverage'],
  ...trades.map(({ c, t }) => [new Date(t.timestamp * 1e3).toISOString(), CONTRATOS[c], t.outcome, t.side,
    t.size, Math.round(t.price * 10000) / 10000, r2(t.size * t.price), id.get(t.proxyWallet), t.timestamp >= COMPLETO_DESDE[c] ? 'complete' : 'partial']),
]))

// ---- maiores detentores anonimizados ----
const linhasH = [['fetched_at_utc', 'contract', 'outcome', 'rank', 'wallet', 'shares']]
for (const h of holders) for (const d of h.data) {
  const ordenados = [...d.holders].sort((a, b) => b.amount - a.amount)
  ordenados.forEach((x, i) => linhasH.push([h.fetchedAt, CONTRATOS[h.contrato], x.outcomeIndex === 0 ? 'Yes' : 'No', i + 1, id.get(x.proxyWallet), r2(x.amount)]))
}
writeFileSync(join(SAIDA, 'second-round-2026-holders.csv'), csv(linhasH))

// ---- 🔒 controle: nada identificável saiu ----
const saida = ['second-round-2026-live.csv', 'second-round-2026-live.jsonl', 'second-round-2026-trades.csv', 'second-round-2026-holders.csv']
  .map((f) => readFileSync(join(SAIDA, f), 'utf8')).join('\n')
const vaz = [...id.keys()].filter((w) => saida.includes(w.slice(2, 12)))
const nomes = new Set()
for (const { t } of trades) { if (t.name && t.name.length > 5) nomes.add(t.name); if (t.pseudonym) nomes.add(t.pseudonym) }
const vazNome = [...nomes].filter((n) => new RegExp(`(^|[,"])${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([,"\\n]|$)`, 'm').test(saida))
if (/0x[0-9a-f]{40}/i.test(saida) || vaz.length || vazNome.length) {
  console.error('❌ dado identificável na saída', vaz.slice(0, 3), vazNome.slice(0, 3)); process.exit(1)
}

const porC = (c) => trades.filter((x) => x.c === c)
console.log(`✅ série ${linhasSerie.length} batidas; negociações ${trades.length} (Lula ${porC('lula').length}, Flávio ${porC('flavio').length}), ` +
  `USD ${Math.round(trades.reduce((s, x) => s + x.t.size * x.t.price, 0)).toLocaleString('pt-BR')}; carteiras ${id.size} (A1..A${id.size}); ` +
  `detentores ${linhasH.length - 1} linhas; controle de anonimato ok.`)
