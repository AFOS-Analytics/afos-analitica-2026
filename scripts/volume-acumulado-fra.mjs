/**
 * ATALHO (24/Nov/2026): VOLUME ACUMULADO DOS DOIS LIVROS da França, contrato de
 * vitória, em DÓLARES, e a frase pronta para a Weekly e o Tradeoff. SÓ LEITURA.
 *
 *   node scripts/volume-acumulado-fra.mjs                          # agora
 *   node scripts/volume-acumulado-fra.mjs --de=2026-11-16 --ate=2026-11-23   # + quanto andou na semana (Neon)
 *   node scripts/volume-acumulado-fra.mjs --base=https://<preview>.vercel.app
 *
 * Regra (André, 23-24/Nov/2026): obrigatório no painel, na Weekly e no
 * Tradeoff; os dois em USD, lado a lado, NUNCA somados. Convenção das duas
 * plataformas: volume NOCIONAL, contratos negociados x US$ 1. O `volumeNum` da
 * Polymarket já é isso (medido em 24/Nov: Sylvain Durif 88.386 de volume =
 * 88.386 contratos do lado tomador, USD 88 pagos); a Kalshi informa contratos e
 * `notional_value_dollars` = 1.0000. O portão das edições confere a frase
 * (`scripts/lib/volume-acumulado-fr.mjs`).
 *
 * 🌐 VIA VERCEL (EUA): o DNS desta máquina, no Brasil, não resolve a Kalshi nem
 * a Polymarket. Os números saem das rotas do AFOS na Vercel, que são as que a
 * tela lê. O CONTROLE vai às fontes direto, pelo atalho de DNS da Cloudflare
 * (`scripts/lib/fetch-sem-bloqueio.mjs`): a soma da rota tem de bater com a
 * soma da fonte (tolerância 0,5%, negócio que entra entre as duas leituras).
 */
import { getJson } from './lib/fetch-sem-bloqueio.mjs'

const arg = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3)
const BASE = (arg('base') ?? 'https://www.afos-analytics.com').replace(/\/$/, '')
const DE = arg('de'), ATE = arg('ate') ?? (DE ? new Date().toISOString().slice(0, 10) : null)
const M = (v) => `USD ${(v / 1e6).toFixed(2)}M`
const ptM = (v) => `USD ${(v / 1e6).toFixed(2)} mi`
const pct = (a, b) => (b ? `${(((a - b) / b) * 100).toFixed(2)}%` : 'n/d')

console.log(`💰 VOLUME ACUMULADO · FRANÇA · contrato de vitória · ${new Date().toISOString()}`)
console.log(`   rotas: ${BASE} (Vercel) · convenção: contratos negociados x US$ 1 (nocional), nos dois livros\n`)

// 1. O que a tela lê.
const poly = getJson(`${BASE}/api/polymarket?country=fra&fresh=1`)
const kal = getJson(`${BASE}/api/kalshi?country=fra&fresh=1`)
const polyUsd = (poly.winner?.markets ?? []).reduce((s, m) => s + (Number(m.volumeNum) || 0), 0)
const kalUsd = (kal.winner?.contratos ?? []).reduce((s, c) => s + (Number(c.volumeContratos) || 0), 0)
console.log(`   Polymarket ${M(polyUsd).padStart(16)}   (${(poly.winner?.markets ?? []).length} contratos · lido ${poly.fetchedAt})`)
console.log(`   Kalshi     ${M(kalUsd).padStart(16)}   (${(kal.winner?.contratos ?? []).length} contratos · lido ${kal.fetchedAt})`)

// 2. Controle contra as fontes, direto.
let falhas = 0
const confere = (nome, rota, fonte) => {
  const ok = fonte > 0 && Math.abs(rota - fonte) / fonte <= 0.005
  if (!ok) falhas++
  console.log(`   controle ${nome}: rota ${M(rota)} · fonte ${M(fonte)} · ${pct(rota, fonte)} ${ok ? '✓' : '⛔ NÃO BATE'}`)
}
console.log('')
try {
  const ev = getJson('https://gamma-api.polymarket.com/events?slug=next-french-presidential-election')[0]
  confere('Polymarket', polyUsd, (ev.markets ?? []).reduce((s, m) => s + (Number(m.volumeNum) || 0), 0))
} catch (e) { falhas++; console.log(`   controle Polymarket: ⛔ fonte não lida (${String(e.message).slice(0, 120)})`) }
try {
  const { markets = [] } = getJson('https://api.elections.kalshi.com/trade-api/v2/markets?event_ticker=KXFRENCHPRES-27&limit=200')
  const face = new Set(markets.map((m) => m.notional_value_dollars))
  confere('Kalshi', kalUsd, markets.reduce((s, m) => s + (Number(m.volume_fp) || 0) * (Number(m.notional_value_dollars) || 0), 0))
  if (face.size !== 1 || !face.has('1.0000')) { falhas++; console.log(`   ⛔ valor de face da Kalshi não é US$ 1 em todos os contratos: ${[...face].join(', ')}`) }
} catch (e) { falhas++; console.log(`   controle Kalshi: ⛔ fonte não lida (${String(e.message).slice(0, 120)})`) }

// 3. Semana, do Neon (opcional).
let semana = null
if (DE) {
  const { config } = await import('dotenv')
  config({ path: '.env.local' }); config({ path: '.env' })
  if (!process.env.DATABASE_URL) { console.error('❌ --de sem DATABASE_URL (copiar .env.local para o worktree)'); process.exit(1) }
  const { PrismaClient } = await import('@prisma/client')
  const { PrismaNeon } = await import('@prisma/adapter-neon')
  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }) })
  const fim = (d) => new Date(`${d}T23:59:59.999Z`)
  try {
    const mk = await prisma.market.findFirst({ where: { slug: 'next-french-presidential-election' }, select: { id: true } })
    const ps = mk ? await prisma.marketPrice.findMany({ where: { marketId: mk.id, snapshotAt: { lte: fim(ATE) } }, select: { outcomeId: true, volume: true, snapshotAt: true }, orderBy: { snapshotAt: 'asc' } }) : []
    const ks = await prisma.kalshiPreco.findMany({ where: { captura: { pais: 'fra', ok: true }, eventTicker: 'KXFRENCHPRES-27', snapshotAt: { lte: fim(ATE) } }, select: { ticker: true, volumeContratos: true, snapshotAt: true }, orderBy: { snapshotAt: 'asc' } })
    // Acumulado num instante = soma, por contrato, do último volume gravado até ele.
    const somaAte = (linhas, chave, campo, t) => { const ult = new Map(); for (const l of linhas) if (l.snapshotAt <= t && l[campo] != null) ult.set(l[chave], l[campo]); return [...ult.values()].reduce((s, v) => s + v, 0) }
    semana = {
      poly: [somaAte(ps, 'outcomeId', 'volume', fim(DE)), somaAte(ps, 'outcomeId', 'volume', fim(ATE))],
      kal: [somaAte(ks, 'ticker', 'volumeContratos', fim(DE)), somaAte(ks, 'ticker', 'volumeContratos', fim(ATE))],
    }
    console.log(`\n   SEMANA (Neon, fechamento de ${DE} ao de ${ATE}, mesma borda do Δ de preço):`)
    console.log(`   Polymarket ${M(semana.poly[0])} → ${M(semana.poly[1])} · andou ${M(semana.poly[1] - semana.poly[0])}`)
    console.log(`   Kalshi     ${M(semana.kal[0])} → ${M(semana.kal[1])} · andou ${M(semana.kal[1] - semana.kal[0])}`)
  } finally { await prisma.$disconnect() }
}

// 4. Frase pronta (o portão exige: "acumulado/cumulative", os dois livros, dois valores em USD).
const r2 = (v) => (v / 1e6).toFixed(2)
const sem = semana ? { p: r2(semana.poly[1] - semana.poly[0]), k: r2(semana.kal[1] - semana.kal[0]) } : null
console.log('\n   FRASE PRONTA (números da rota; na edição, usar os da leitura certificada do dia):')
console.log(`   EN: Cumulative volume in the win contract, at USD 1 per contract traded: USD ${r2(polyUsd)}M on Polymarket and USD ${r2(kalUsd)}M on Kalshi, side by side and never added up${sem ? `; USD ${sem.p}M and USD ${sem.k}M of it traded this week` : ''}.`)
console.log(`   PT: Volume acumulado no contrato de vitória, a USD 1 por contrato negociado: USD ${r2(polyUsd)}M na Polymarket e USD ${r2(kalUsd)}M na Kalshi, lado a lado e nunca somados${sem ? `; USD ${sem.p}M e USD ${sem.k}M deles na semana` : ''}.`)
console.log(`   ES: Volumen acumulado en el contrato de victoria, a USD 1 por contrato negociado: USD ${r2(polyUsd)}M en Polymarket y USD ${r2(kalUsd)}M en Kalshi, lado a lado y nunca sumados${sem ? `; USD ${sem.p}M y USD ${sem.k}M de ellos en la semana` : ''}.`)
console.log(`\nVEREDITO: ${falhas ? `⛔ ${falhas} controle(s) falharam: número não vale até conferir` : 'CONFERE com as duas fontes'}`)
process.exit(falhas ? 1 : 0)
