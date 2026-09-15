/**
 * Trava o registro dos oito mercados dos EUA.
 *
 * 🔑 A LISTA LITERAL ABAIXO É A QUE ESTAVA EM `app/api/polymarket/route.ts`
 * ANTES da consolidação de 15/Set/2026, copiada byte por byte. O objetivo deste
 * arquivo não é provar que a lista "está certa": é provar que ela não MUDOU ao
 * sair de dentro da rota.
 *
 * ⚠️ E a ORDEM é contrato. A rota consome slug e chave por POSIÇÃO. Um dia em
 * que alguém reordene o registro sem reordenar nada mais, o painel servirá o
 * preço de um livro com a etiqueta de outro, valor certo e etiqueta errada, que
 * é a classe que nenhum validador de JSON pega.
 *
 * 📌 Se um mercado for acrescentado ou retirado de propósito, a lista daqui
 * muda no mesmo commit, à mão, e de olho na ordem. O teste falhando é o aviso
 * de que a mudança precisa ser deliberada.
 */
import { MERCADOS_US, SLUGS_US, KEYS_US, DISTRIBUICOES_US } from '../lib/us-market/mercados'

let passou = 0
let falhou = 0
const falhas: string[] = []

function ok(nome: string, cond: boolean, detalhe = '') {
  if (cond) passou++
  else {
    falhou++
    falhas.push(`${nome}${detalhe ? ` — ${detalhe}` : ''}`)
  }
}
function eq(nome: string, obtido: unknown, esperado: unknown) {
  ok(nome, JSON.stringify(obtido) === JSON.stringify(esperado), `esperado ${JSON.stringify(esperado)}, veio ${JSON.stringify(obtido)}`)
}

// ─── o literal de antes, na ordem de antes ──────────────────────────────────

const SLUGS_DE_ANTES = [
  'which-party-will-win-the-house-in-2026',
  'which-party-will-win-the-senate-in-2026',
  'republican-house-seats-after-the-2026-midterm-elections',
  'republican-senate-seats-after-the-2026-midterm-elections-927',
  'how-many-republican-governors-after-the-2026-midterm-elections',
  '2026-midterms-house-turnout',
  '2026-midterms-house-popular-vote-margin-of-victory-224',
  'will-the-2026-midterm-elections-happen-as-scheduled',
]

const KEYS_DE_ANTES = [
  'house', 'senate', 'houseSeats', 'senateSeats',
  'governors', 'turnout', 'popularVoteMargin', 'asScheduled',
]

eq('os slugs sao os mesmos, na mesma ordem', [...SLUGS_US], SLUGS_DE_ANTES)
eq('as chaves sao as mesmas, na mesma ordem', [...KEYS_US], KEYS_DE_ANTES)
eq('oito mercados', MERCADOS_US.length, 8)

// ─── a integridade do pareamento ────────────────────────────────────────────

eq('slug e chave tem o mesmo comprimento', SLUGS_US.length, KEYS_US.length)
ok('nenhuma chave repetida', new Set(KEYS_US).size === KEYS_US.length, [...KEYS_US].join(','))
ok('nenhum slug repetido', new Set(SLUGS_US).size === SLUGS_US.length, [...SLUGS_US].join(','))
ok(
  'todo slug casa o formato que a rota aceita',
  SLUGS_US.every((s) => /^[a-z0-9-]+$/.test(s)),
  SLUGS_US.filter((s) => !/^[a-z0-9-]+$/.test(s)).join(','),
)
ok('nenhuma chave vazia', KEYS_US.every((k) => k.trim().length > 0))

// ─── quem e distribuicao, e quem nao e ──────────────────────────────────────

// Os tres binarios sao os que a trava de captura vigia; os cinco de faixas sao
// os que passam pelo portao de 95-105%.
eq(
  'as cinco distribuicoes, na ordem',
  DISTRIBUICOES_US.map((m) => m.key),
  ['houseSeats', 'senateSeats', 'governors', 'turnout', 'popularVoteMargin'],
)
eq(
  'os tres binarios, na ordem',
  MERCADOS_US.filter((m) => !m.distribuicao).map((m) => m.key),
  ['house', 'senate', 'asScheduled'],
)
eq('cinco mais tres fecham os oito', DISTRIBUICOES_US.length + MERCADOS_US.filter((m) => !m.distribuicao).length, 8)

// ─── e a derivacao nao pode virar copia solta ───────────────────────────────

ok(
  'SLUGS_US sai do registro, nao de um literal proprio',
  SLUGS_US.every((s, i) => s === MERCADOS_US[i].slug),
)
ok(
  'KEYS_US sai do registro, nao de um literal proprio',
  KEYS_US.every((k, i) => k === MERCADOS_US[i].key),
)

console.log(`\n🧪 MERCADOS US: ${passou} passou · ${falhou} falhou  (${passou + falhou} casos)`)
if (falhou) {
  console.log('\n❌ falhas:')
  for (const f of falhas) console.log(`   ${f}`)
  process.exit(1)
}
console.log('✅ o registro dos oito mercados esta intacto\n')
