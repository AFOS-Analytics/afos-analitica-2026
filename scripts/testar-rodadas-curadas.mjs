/**
 * Teste das rodadas curadas e, principalmente, da DEDUPLICAÇÃO.
 *
 * 🔑 O risco de ingerir da listagem do instituto não é a linha estar errada, é
 * ela entrar DUAS VEZES no dia em que a Wikipédia finalmente indexar a onda. Aí
 * a mesma rodada conta pelo índice e pela curadoria, o n infla e a média puxa
 * para a casa duplicada. A deduplicação é o que torna a exceção segura, e por
 * isso ela é o que mais se testa aqui.
 *
 * ⭐ O caso que mais importa é o de APOSENTADORIA: quando o índice alcança todas
 * as ondas, NENHUMA curada pode entrar. Sem essa propriedade, alguém teria de
 * lembrar de apagar este arquivo à mão, e ninguém lembra.
 *
 * Uso:  node scripts/testar-rodadas-curadas.mjs
 */

import { RODADAS_CURADAS, mesclarCuradas, ORIGEM_CURADA, ORIGEM_INDICE } from '../lib/us-polls/rodadas-curadas.mjs'

const PCT_MIN = 15
const PCT_MAX = 70
const SOMA_MIN = 97
const SOMA_MAX = 102

let falhas = 0
const checar = (nome, condicao, detalhe = '') => {
  console.log(`${condicao ? '✅' : '❌'} ${nome}${condicao ? '' : `  → ${detalhe}`}`)
  if (!condicao) falhas++
}

/** Linha do índice, do jeito que o parser a entrega. */
const doIndice = (o = {}) => ({
  instituto: 'Outra Casa',
  campoInicio: '2026-08-01',
  campoFim: '2026-08-03',
  amostra: 1200,
  amostraTipo: 'RV',
  margemErro: 3,
  dem: 45,
  rep: 41,
  outros: 14,
  vantagemDem: 4,
  fontePrimaria: 'https://exemplo.org/y',
  ...o,
})

// ── 1. Os dados escritos à mão obedecem às regras da própria casa ─────────

console.log('\n📋 as 6 linhas escritas à mão\n')

checar('são 6 linhas, 3 ondas em 2 recortes', RODADAS_CURADAS.length === 6, `são ${RODADAS_CURADAS.length}`)

for (const p of RODADAS_CURADAS) {
  const id = `${p.campoFim} ${p.amostraTipo}`
  checar(
    `${id}: passa a régua de valor ${PCT_MIN}-${PCT_MAX}%`,
    p.dem >= PCT_MIN && p.dem <= PCT_MAX && p.rep >= PCT_MIN && p.rep <= PCT_MAX && p.dem + p.rep <= 100,
    `D ${p.dem} R ${p.rep}`
  )
  const soma = p.dem + p.rep + p.outros
  checar(`${id}: soma D+R+outros = ${soma}, dentro de ${SOMA_MIN}-${SOMA_MAX}`, soma >= SOMA_MIN && soma <= SOMA_MAX)
  // Conferência de TRANSCRIÇÃO: `outros` tem de ser a soma das opções lidas na
  // crosstab. É o que pega um dígito trocado ao copiar do PDF.
  const somaOpcoes = p.opcoes.other + p.opcoes.naoSabe + p.opcoes.naoVotara
  checar(`${id}: outros (${p.outros}) = other+naoSabe+naoVotara (${somaOpcoes})`, p.outros === somaOpcoes)
  checar(`${id}: vantagemDem (${p.vantagemDem}) = dem - rep`, p.vantagemDem === p.dem - p.rep)
  checar(`${id}: campoInicio antes de campoFim`, p.campoInicio < p.campoFim)
  checar(`${id}: tem link da fonte primária`, /^https:\/\/.+\.pdf$/.test(p.fontePrimaria ?? ''))
}

// ── 2. A deduplicação ─────────────────────────────────────────────────────

console.log('\n🔁 deduplicação, que é o que torna a exceção segura\n')

{
  const r = mesclarCuradas([])
  checar('índice vazio: as 6 entram', r.aceitas.length === 6 && r.duplicadas.length === 0)
  checar('toda linha aceita vem etiquetada', r.aceitas.every((p) => p.origem === ORIGEM_CURADA))
}

{
  const indice = [doIndice({ instituto: 'The Economist/YouGov', campoInicio: '2026-08-14', campoFim: '2026-08-17', amostraTipo: 'RV' })]
  const r = mesclarCuradas(indice)
  checar(
    'índice já tem UMA onda no mesmo recorte: aquela é descartada, as outras 5 entram',
    r.duplicadas.length === 1 && r.aceitas.length === 5,
    `dup=${r.duplicadas.length} aceitas=${r.aceitas.length}`
  )
  checar('a linha do índice é preservada e etiquetada', r.pesquisas.some((p) => p.origem === ORIGEM_INDICE))
}

{
  // RV e A da mesma onda convivem de propósito: a `media()` escolhe um dos dois
  // pela hierarquia. Descartar os dois porque um chegou seria perder o recorte.
  const indice = [doIndice({ instituto: 'The Economist/YouGov', campoInicio: '2026-08-14', campoFim: '2026-08-17', amostraTipo: 'A' })]
  const r = mesclarCuradas(indice)
  checar(
    'índice tem a onda em OUTRO recorte: só o recorte igual é descartado',
    r.duplicadas.length === 1 && r.duplicadas[0].amostraTipo === 'A' && r.aceitas.some((p) => p.campoFim === '2026-08-17' && p.amostraTipo === 'RV'),
    `dup=${r.duplicadas.map((d) => d.amostraTipo)}`
  )
}

{
  // ⭐ o caso da aposentadoria
  const indice = RODADAS_CURADAS.map((p) => doIndice({ ...p }))
  const r = mesclarCuradas(indice)
  checar(
    '⭐ índice alcançou TODAS: nenhuma curada entra, a curadoria se aposenta sozinha',
    r.aceitas.length === 0 && r.duplicadas.length === 6,
    `aceitas=${r.aceitas.length} dup=${r.duplicadas.length}`
  )
  checar('e o total servido não infla', r.pesquisas.length === 6)
}

{
  // Quase-encontro: mesma casa, mesmo recorte, campo a 1 dia. Pode ser a MESMA
  // onda com data ligeiramente diferente, e a deduplicação exata não pega.
  const indice = [doIndice({ instituto: 'The Economist/YouGov', campoInicio: '2026-08-15', campoFim: '2026-08-18', amostraTipo: 'RV' })]
  const r = mesclarCuradas(indice)
  checar(
    'quase-encontro a 1 dia: entra, mas é DENUNCIADO em suspeitas',
    r.suspeitas.length >= 1 && r.suspeitas[0].distanciaDias === 1,
    `suspeitas=${r.suspeitas.length}`
  )
}

{
  const indice = [doIndice({ instituto: 'The Economist/YouGov', campoFim: '2026-06-01', amostraTipo: 'RV' })]
  const r = mesclarCuradas(indice)
  checar('onda distante da mesma casa NÃO vira suspeita', r.suspeitas.length === 0, `suspeitas=${r.suspeitas.length}`)
}

console.log(`\n${falhas === 0 ? '✅' : '❌'} VEREDITO DO TESTE: ${falhas === 0 ? 'todos corretos' : `${falhas} falha(s)`}\n`)
process.exit(falhas === 0 ? 0 : 1)
