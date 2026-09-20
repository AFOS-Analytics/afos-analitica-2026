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

/**
 * 🔴 ESTE NÚMERO APODRECEU, e é por isso que ele mudou de forma em 20/Set/2026.
 *
 * A asserção era `RODADAS_CURADAS.length === 7` com a frase "3 ondas da YouGov
 * em 2 recortes e 1 rodada da Quantus" colada nela. Toda entrada nova a deixa
 * vermelha, e ela ficou vermelha por TRÊS commits meus seguidos, enquanto o
 * resto do teste passava e o portão de publicação aprovava. Contador escrito
 * como literal dentro da mensagem é contador que ninguém atualiza: a mensagem
 * descrevia um conjunto que já não existia.
 *
 * ✅ O que se guarda aqui é o que o contador REALMENTE servia para pegar, que é
 * linha sumindo sem querer. Então ele vira um piso declarado e uma trava de
 * duplicata, e a frase descreve a REGRA e não o inventário do dia.
 *
 * ⚠️ O piso é PISO: ele pega remoção acidental e não estorva adição. Quem
 * remover uma linha de propósito baixa este número no mesmo commit.
 */
const PISO_DE_LINHAS = 27

// ── 1. Os dados escritos à mão obedecem às regras da própria casa ─────────

console.log(`\n📋 as ${RODADAS_CURADAS.length} linhas escritas à mão\n`)

checar(
  `são pelo menos ${PISO_DE_LINHAS} linhas: o piso pega remoção acidental`,
  RODADAS_CURADAS.length >= PISO_DE_LINHAS,
  `são ${RODADAS_CURADAS.length}, e o piso é ${PISO_DE_LINHAS}`
)

// 🔴 A trava que o contador nunca foi: DUAS linhas curadas com a mesma chave são
// a duplicação que este arquivo inteiro existe para evitar, e a deduplicação
// contra o índice não a pega, porque ela só compara curada CONTRA índice.
{
  const chaves = RODADAS_CURADAS.map((p) => `${p.instituto}|${p.campoFim}|${p.amostraTipo}`)
  const repetidas = chaves.filter((c, i) => chaves.indexOf(c) !== i)
  checar('nenhuma curada repete instituto+campoFim+recorte', repetidas.length === 0, repetidas.join(' · '))
}

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
  // 🔴 E ANTES DE SOMAR, conferir que dá para somar. Em 20/Set/2026 eu escrevi
  // prosa dentro de `opcoes` (o valor com leaners, o n ponderado, o contexto da
  // pergunta), e a soma virou concatenação de string: a conferência de
  // transcrição parou de conferir nada e o teste morreu com stack trace, que
  // pelo menos é barulhento. Se um dia ela concatenar em silêncio, esta linha é
  // que segura. `opcoes` guarda SÓ a decomposição numérica de `outros`; o resto
  // mora em `notas`.
  const naoNumericas = Object.entries(p.opcoes).filter(([, v]) => typeof v !== 'number' || !Number.isFinite(v))
  checar(
    `${id}: opcoes só tem número, porque ela é a decomposição de outros`,
    naoNumericas.length === 0,
    naoNumericas.map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(' · ')
  )
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
  // ⚠️ E a Focaldata publica as tabelas como XLSX, sem PDF nenhum. Exigir `.pdf`
  // ali obrigaria a citar o POST no lugar da tabela, que é a fonte mais fraca
  // das duas. A regra é "aponta para o DOCUMENTO", nunca "aponta para um PDF".
  const ehDocumento =
    /^https:\/\/.+\.(pdf|xlsx?|csv)$/.test(p.fontePrimaria ?? '') ||
    /^https:\/\/drive\.google\.com\/file\/d\/[\w-]+/.test(p.fontePrimaria ?? '')
  checar(`${id}: tem link do documento da fonte primária`, ehDocumento, String(p.fontePrimaria))
}

// ── 2. A deduplicação ─────────────────────────────────────────────────────

console.log('\n🔁 deduplicação, que é o que torna a exceção segura\n')

{
  const r = mesclarCuradas([])
  // 📌 Contra `RODADAS_CURADAS.length`, e não contra um literal: o que se testa
  // aqui é a PROPRIEDADE (índice vazio não descarta ninguém), e amarrá-la ao
  // tamanho do dia deixa o teste vermelho a cada entrada nova, que foi
  // exatamente o que aconteceu.
  checar(
    'índice vazio: TODAS entram',
    r.aceitas.length === RODADAS_CURADAS.length && r.duplicadas.length === 0,
    `aceitas=${r.aceitas.length} de ${RODADAS_CURADAS.length}, dup=${r.duplicadas.length}`
  )
  checar('toda linha aceita vem etiquetada', r.aceitas.every((p) => p.origem === ORIGEM_CURADA))
}

{
  const indice = [doIndice({ instituto: 'The Economist/YouGov', campoInicio: '2026-08-14', campoFim: '2026-08-17', amostraTipo: 'RV' })]
  const r = mesclarCuradas(indice)
  checar(
    'índice já tem UMA onda no mesmo recorte: aquela é descartada, as outras entram',
    r.duplicadas.length === 1 && r.aceitas.length === RODADAS_CURADAS.length - 1,
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
    r.aceitas.length === 0 && r.duplicadas.length === RODADAS_CURADAS.length,
    `aceitas=${r.aceitas.length} dup=${r.duplicadas.length} de ${RODADAS_CURADAS.length}`
  )
  checar(
    'e o total servido não infla',
    r.pesquisas.length === RODADAS_CURADAS.length,
    `servidas=${r.pesquisas.length} de ${RODADAS_CURADAS.length}`
  )
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
