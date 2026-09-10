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

console.log('\n📋 as 7 linhas escritas à mão\n')

checar('são 7 linhas: 3 ondas da YouGov em 2 recortes e 1 rodada da Quantus', RODADAS_CURADAS.length === 7, `são ${RODADAS_CURADAS.length}`)

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
  //
  // 🏷️ A soma é sobre as opções QUE EXISTEM, e não sobre três nomes fixos. A Q1
  // da Quantus, entrada em 10/Set/2026, só oferece indeciso: não tem terceira via
  // nem "não vou votar". Somar `other + naoSabe + naoVotara` ali dava NaN, e a
  // saída errada seria escrever zeros para opções que a crosstab não tem.
  const somaOpcoes = Object.values(p.opcoes).reduce((a, b) => a + b, 0)
  checar(`${id}: outros (${p.outros}) = soma das opções (${somaOpcoes.toFixed(2)})`, Math.abs(p.outros - somaOpcoes) < 1e-9)
  // ⚠️ TOLERÂNCIA, e ela nasceu de um caso real: `49.7 - 42.8` dá
  // 6.900000000000006 em ponto flutuante, então igualdade exata reprovaria a
  // linha CERTA e empurraria para arredondar o número que a casa publicou. A
  // conferência é de transcrição, e um bilionésimo continua pegando dígito
  // trocado.
  checar(`${id}: vantagemDem (${p.vantagemDem}) = dem - rep`, Math.abs(p.vantagemDem - (p.dem - p.rep)) < 1e-9)
  checar(`${id}: campoInicio antes de campoFim`, p.campoInicio < p.campoFim)
  // 🔗 O link tem de ser o do DOCUMENTO, não o do post. A Quantus publica o
  // relatório técnico como arquivo no Drive, sem extensão na URL, e exigir
  // `.pdf` obrigaria a citar o post no lugar da crosstab, que é a fonte mais
  // fraca das duas.
  const ehDocumento =
    /^https:\/\/.+\.pdf$/.test(p.fontePrimaria ?? '') ||
    /^https:\/\/drive\.google\.com\/file\/d\/[\w-]+/.test(p.fontePrimaria ?? '')
  checar(`${id}: tem link do documento da fonte primária`, ehDocumento, String(p.fontePrimaria))
}

// ── 2. A deduplicação ─────────────────────────────────────────────────────

console.log('\n🔁 deduplicação, que é o que torna a exceção segura\n')

{
  const r = mesclarCuradas([])
  checar('índice vazio: as 7 entram', r.aceitas.length === 7 && r.duplicadas.length === 0)
  checar('toda linha aceita vem etiquetada', r.aceitas.every((p) => p.origem === ORIGEM_CURADA))
}

{
  const indice = [doIndice({ instituto: 'The Economist/YouGov', campoInicio: '2026-08-14', campoFim: '2026-08-17', amostraTipo: 'RV' })]
  const r = mesclarCuradas(indice)
  checar(
    'índice já tem UMA onda no mesmo recorte: aquela é descartada, as outras 6 entram',
    r.duplicadas.length === 1 && r.aceitas.length === 6,
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
    r.aceitas.length === 0 && r.duplicadas.length === 7,
    `aceitas=${r.aceitas.length} dup=${r.duplicadas.length}`
  )
  checar('e o total servido não infla', r.pesquisas.length === 7)
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
