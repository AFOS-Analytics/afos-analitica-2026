/**
 * ATALHO: o mercado que a TELA da França mostra está em dia? Só leitura.
 * Criado 10/Nov/2026.
 *
 *   node scripts/frescor-tela-fra.mjs
 *
 * 🔴 POR QUE EXISTE. Em 10/Nov/2026 o texto do painel saiu com a leitura
 * certificada das 20:16 UTC e a tabela da tela, logo abaixo, mostrava o preço
 * da captura das 12:30 (Lisnard 14,35 com o mercado a 12,85). Das 20:22 às
 * 22:38 ficou assim, e o `fetchedAt` da rota dizia a hora do PEDIDO, não a do
 * dado. Causa: dois caches com stale-while-revalidate empilhados (o de dados do
 * Next e o da borda da Vercel). Nenhum conferidor olhava isso: o
 * `conferir-tela.mjs` confere se o número está na tela, não se é o número de
 * agora. → memory/project_franca_2027_estudo_painel.md
 *
 * Para Polymarket e Kalshi, três leituras da MESMA rota:
 *   TELA    ?country=fra            o que o navegador do leitor recebe (cache da
 *                                   borda; a borda é por REGIÃO: daqui é gru1, um
 *                                   leitor em Paris passa por outra)
 *   SONDA   ?country=fra&_sonda=N   fura a borda: mostra a camada de dados da função
 *   FRESCA  ?country=fra&fresh=1    a fonte agora
 * e compara por candidato preço e VOLUME. Volume igual = mesmo momento; volume
 * menor na tela = dado velho, mesmo com `fetchedAt` recente.
 *
 * DATA o dado da tela: procura o volume dela na série do backup do Neon
 * (`backup/neon/marketPrice`), que tem cauda cega de até 24h; sem achado, diz.
 *
 * ⛔ País fixo: França. Não grava nada.
 */
import { readFileSync, readdirSync, existsSync } from 'fs'
import { gunzipSync } from 'zlib'

const BASE = process.env.AFOS_BASE ?? 'https://www.afos-analytics.com'
const SLUG_VENCER = 'next-french-presidential-election'

async function ler(caminho) {
  const r = await fetch(BASE + caminho, { signal: AbortSignal.timeout(90000) })
  const h = (n) => r.headers.get(n) ?? '-'
  return { j: await r.json(), age: h('age'), cache: h('x-vercel-cache'), regiao: h('x-vercel-id').split('::').slice(0, 2).join('>') }
}

/** Polymarket: candidato -> { preco, volume } no livro de vitória, como a tela filtra. */
function pm(j) {
  const m = new Map()
  for (const k of j?.winner?.markets ?? []) {
    const nome = k.question?.match(/^Will (.+?) win /)?.[1]?.trim()
    if (nome && !k.closed && Number(k.volumeNum) > 0) m.set(nome, { preco: Number(k.outcomePrices?.[0]) * 100, volume: Math.round(Number(k.volumeNum)) })
  }
  return m
}
/** Kalshi: candidato -> { preco, volume } (volume em contratos). */
function ka(j) {
  const m = new Map()
  for (const c of j?.winner?.contratos ?? []) if (c.ultimo !== null) m.set(c.candidato, { preco: Number(c.ultimo), volume: Math.round(Number(c.volumeContratos)) })
  return m
}

const sonda = () => `_sonda=${Date.now()}${Math.floor(Math.random() * 1e6)}`

function comparar(rot, tela, fresca, n = 8) {
  const top = [...fresca.entries()].sort((a, b) => b[1].preco - a[1].preco).slice(0, n)
  // As leituras saem com segundos de diferença e o mercado negocia no meio: em
  // 10/Nov a Kalshi deu +10 contratos em 470 mil entre a tela e a fonte. Só
  // conta como atraso a diferença acima de 0,1% do volume do contrato.
  let atras = 0, maxDif = 0
  console.log(`   ${'candidato'.padEnd(22)} ${'tela'.padStart(7)} ${'fonte'.padStart(7)}  volume tela -> fonte`)
  for (const [c, f] of top) {
    const t = tela.get(c)
    if (!t) { console.log(`   ${c.padEnd(22)}   ausente na tela`); atras++; continue }
    const dv = f.volume - t.volume
    if (dv > f.volume * 0.001) atras++
    maxDif = Math.max(maxDif, Math.abs(f.preco - t.preco))
    console.log(`   ${c.padEnd(22)} ${t.preco.toFixed(2).padStart(7)} ${f.preco.toFixed(2).padStart(7)}  ${t.volume} -> ${f.volume}${dv > 0 ? `  (+${dv} desde o dado da tela)` : ''}`)
  }
  const veredito = atras < 2 ? 'EM DIA (volume igual ao da fonte, a menos de negócios entre as leituras)' : `ATRASADA: ${atras} de ${top.length} contratos com volume mais de 0,1% abaixo do da fonte; maior diferença de preço ${maxDif.toFixed(2)}pp`
  console.log(`   → ${rot}: ${veredito}`)
  return atras < 2 ? 0 : atras
}

/** Em que captura do Neon estava o volume que a tela mostra? (backup, cauda cega de até 24h) */
function datar(tela) {
  const R = 'backup/neon/'
  if (!existsSync(R + 'marketPrice')) return console.log('   (sem backup/neon neste diretório: rodar da raiz do repo)')
  const linhas = (d) => readdirSync(R + d).filter((f) => f.endsWith('.gz')).flatMap((f) => gunzipSync(readFileSync(R + d + '/' + f)).toString('utf8').split('\n'))
  const csv = (l) => { const o = []; let c = '', q = false; for (const ch of l) { if (ch === '"') q = !q; else if (ch === ',' && !q) { o.push(c); c = '' } else c += ch } o.push(c); return o }
  const mk = linhas('market'), hm = csv(mk[0])
  const idVencer = new Set(mk.slice(1).filter(Boolean).map(csv).filter((c) => c[hm.indexOf('slug')] === SLUG_VENCER).map((c) => c[0]))
  const oc = linhas('marketOutcome'), ho = csv(oc[0])
  const nomePorId = new Map(oc.slice(1).filter(Boolean).map(csv).filter((c) => idVencer.has(c[ho.indexOf('marketId')])).map((c) => [c[0], c[ho.indexOf('outcomeName')]]))
  const alvo = new Map([...tela.entries()].sort((a, b) => b[1].volume - a[1].volume).slice(0, 5).map(([c, v]) => [c, v.volume]))
  const mes = readdirSync(R + 'marketPrice').filter((f) => f.endsWith('.gz')).sort().slice(-1)[0]
  // Conta, por captura, quantos dos 5 maiores contratos da tela batem o volume.
  // Contrato parado (sem negócio) repete o volume em várias capturas e não data
  // nada: a captura que vale é a que bate o MAIOR número de contratos.
  const porCaptura = new Map()
  for (const l of gunzipSync(readFileSync(R + 'marketPrice/' + mes)).toString('utf8').split('\n').slice(1)) {
    if (!l) continue
    const c = csv(l), nome = nomePorId.get(c[2])
    if (nome && alvo.get(nome) === Math.round(Number(c[4]))) porCaptura.set(c[6], [...(porCaptura.get(c[6]) ?? []), nome])
  }
  const ord = [...porCaptura.entries()].sort((a, b) => b[1].length - a[1].length)
  if (!ord.length) return console.log('   volume da tela não está no backup (dado mais novo que o backup, ou cauda cega)')
  const [em, nomes] = ord[0]
  const empate = ord.filter(([, n]) => n.length === nomes.length).length > 1
  console.log(`   ${empate ? 'AMBÍGUO, ' : ''}captura ${em}: ${nomes.length} de ${alvo.size} contratos com o volume da tela (${nomes.join(', ')})`)
  console.log(`   → o dado da tela é de perto dessa captura, cerca de ${((Date.now() - new Date(em).getTime()) / 36e5).toFixed(1)}h antes desta leitura (volume igual vale para o trecho sem negócio em torno dela)`)
}

async function main() {
  console.log(`Frescor da TELA da França · ${new Date().toISOString()} · SÓ LEITURA · ${BASE}`)
  let atrasos = 0
  for (const [rot, rota, ext] of [['POLYMARKET', '/api/polymarket', pm], ['KALSHI', '/api/kalshi', ka]]) {
    const [t, s, f] = [await ler(`${rota}?country=fra`), await ler(`${rota}?country=fra&${sonda()}`), await ler(`${rota}?country=fra&fresh=1`)]
    console.log(`\n== ${rot}`)
    for (const [n, x] of [['TELA  ', t], ['SONDA ', s], ['FRESCA', f]]) console.log(`   ${n} fetchedAt ${x.j.fetchedAt} · x-vercel-cache ${x.cache} · age ${x.age}s · ${x.regiao}`)
    console.log('   -- tela contra a fonte')
    const a = comparar(`${rot} na tela`, ext(t.j), ext(f.j))
    console.log('   -- camada de dados (sonda) contra a fonte')
    comparar(`${rot} na camada de dados`, ext(s.j), ext(f.j))
    if (rot === 'POLYMARKET' && a) { console.log('   -- quando era o dado da tela (série do Neon, backup)'); datar(pm(t.j)) }
    atrasos += a
  }
  console.log(`\nVEREDITO: ${atrasos ? 'TELA ATRASADA (ver acima)' : 'TELA EM DIA'}`)
  console.log('(Kalshi e Polymarket andam a cada negócio: diferença pequena de preço com volume IGUAL é o mercado, não a tela.)')
}

main().catch((e) => { console.error('frescor-tela-fra falhou:', e instanceof Error ? e.message : e); process.exit(1) })
