/**
 * Controle plantado do leitor de mercado.
 *
 * 🔑 O caso que dá nome a este arquivo é o defeito de 04/Set/2026: `outcomePrices`
 * chega como ARRAY já desserializado e a leitura o tratava como string JSON. Um
 * leitor com esse defeito devolve "0 com preço" em todos os grupos, o que se lê
 * como fonte degradada. Aqui isso tem de sair como leitura ÍNTEGRA.
 *
 * ⭐ E o par que importa é ele com o inverso: o `gamma-api` direto, que é o
 * fallback manual quando o proxy cai, entrega STRING. Um leitor consertado para
 * array e quebrado para string trocaria de defeito em vez de consertar.
 *
 * Uso:  node scripts/testar-ler-mercado.mjs
 */

import { comoLista, precoSim, lerResposta } from './ler-mercado.mjs'

let falhas = 0
const checar = (nome, ok, detalhe = '') => {
  console.log(`${ok ? '✅' : '❌'} ${nome}${ok ? '' : `  → ${detalhe}`}`)
  if (!ok) falhas++
}

// ── comoLista: as duas formas, e as bordas ────────────────────────────────

console.log('\n🔌 a forma dos campos\n')

checar('ARRAY já desserializado (o proxy)', JSON.stringify(comoLista(['0.895', '0.105'])) === '["0.895","0.105"]')
checar('STRING JSON (o gamma-api direto)', JSON.stringify(comoLista('["0.895","0.105"]')) === '["0.895","0.105"]')
checar('array vazio (placeholder do Polymarket)', comoLista([]).length === 0)
checar('string vazia', comoLista('').length === 0)
checar('undefined não lança', comoLista(undefined).length === 0)
checar('string que não é JSON não lança', comoLista('0.895,0.105').length === 0)
checar('JSON que não é array não vira array', comoLista('{"a":1}').length === 0)

// ── precoSim: pega o lado SIM, não o primeiro ─────────────────────────────

console.log('\n💲 o preço do lado SIM\n')

checar(
  'SIM em segundo lugar não devolve o preço do NÃO',
  precoSim({ outcomes: ['No', 'Yes'], outcomePrices: ['0.105', '0.895'] }) === 89.5,
  String(precoSim({ outcomes: ['No', 'Yes'], outcomePrices: ['0.105', '0.895'] }))
)
checar('mercado sem preço devolve null', precoSim({ outcomes: [], outcomePrices: [] }) === null)
checar(
  'faixa de distribuição, sem Sim/Não, usa o primeiro',
  precoSim({ outcomes: ['< 22 gov.'], outcomePrices: ['0.19'] }) === 19
)

// ── O caso de 04/Set, de ponta a ponta ────────────────────────────────────

console.log('\n🔴 o defeito de 04/Set, de ponta a ponta\n')

const bin = (q, sim, nao) => ({ question: q, outcomes: ['Yes', 'No'], outcomePrices: [String(sim), String(nao)], volumeNum: 1000 })
const faixa = (q, v) => ({ question: q, outcomes: [q], outcomePrices: [String(v)], volumeNum: 10 })

const RESPOSTA = {
  fetchedAt: '2026-09-04T05:00:00.000Z',
  degraded: false,
  failedCount: 0,
  house: { markets: [bin('D controla a Câmara?', 0.895, 0.105), bin('R controla a Câmara?', 0.115, 0.885), { question: 'Party A', outcomes: [], outcomePrices: [] }] },
  senate: { markets: [bin('D controla o Senado?', 0.515, 0.485)] },
  asScheduled: { markets: [bin('No prazo?', 0.9685, 0.0315)] },
  houseSeats: { markets: [faixa('a', 0.5), faixa('b', 0.51)] },
  senateSeats: { markets: [faixa('c', 0.9)] },
  governors: { markets: [faixa('d', 0.885)] },
  turnout: { markets: [faixa('e', 0.952)] },
  popularVoteMargin: { markets: [faixa('f', 0.7), faixa('g', 0.81)] },
}

const r = lerResposta(RESPOSTA, 'us')
checar('leitura NÃO fica vazia com array desserializado', r.leituraVazia === false, `comPreco=${r.comPrecoNoTotal}`)
checar('os 2 preços da Câmara são lidos, o placeholder não', r.grupos.house.comPreco === 2 && r.grupos.house.mercados === 3)
checar('o preço do lado SIM é o publicado', r.grupos.house.linhas[0].preco === 89.5)

// a MESMA resposta, com os campos em string, tem de dar o MESMO resultado
const emString = JSON.parse(JSON.stringify(RESPOSTA), (k, v) =>
  (k === 'outcomes' || k === 'outcomePrices') && Array.isArray(v) ? JSON.stringify(v) : v
)
const rs = lerResposta(emString, 'us')
checar(
  '⭐ a mesma resposta em STRING dá resultado IDÊNTICO',
  JSON.stringify(rs.grupos) === JSON.stringify(r.grupos),
  'array e string divergiram'
)

console.log('\n🚦 o portão das distribuições\n')
checar('houseSeats 101,00% passa', r.grupos.houseSeats.passaPortao === true, String(r.grupos.houseSeats.soma))
checar('senateSeats 90,00% reprova', r.grupos.senateSeats.passaPortao === false, String(r.grupos.senateSeats.soma))
checar('popularVoteMargin 151,00% reprova', r.grupos.popularVoteMargin.passaPortao === false, String(r.grupos.popularVoteMargin.soma))
checar('binário não recebe veredito de portão', r.grupos.house.passaPortao === null)

console.log('\n🔍 leitura vazia é defeito de LEITOR, e tem de ser dita\n')
const vazia = lerResposta(
  { fetchedAt: 'x', degraded: false, failedCount: 0, house: { markets: [{ question: 'q', outcomes: [], outcomePrices: [] }] } },
  'us'
)
checar('nenhum preço em nenhum grupo levanta leituraVazia', vazia.leituraVazia === true)

console.log(`\n${falhas === 0 ? '✅' : '❌'} VEREDITO DO TESTE: ${falhas === 0 ? 'todos corretos' : `${falhas} falha(s)`}\n`)
process.exit(falhas === 0 ? 0 : 1)
