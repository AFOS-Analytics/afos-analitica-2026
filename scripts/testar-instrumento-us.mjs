/**
 * Casos plantados do classificador de INSTRUMENTO.
 *
 * Os trechos GENERICO e NOMINAL sao recortes REAIS dos toplines e crosstabs da
 * The Economist/YouGov lidos em 15/Set/2026 com `pdftotext -layout`. Caso
 * plantado escrito de cabeca testa a minha ideia do documento; recorte real
 * testa o documento.
 *
 * ⚠️ Metade dos casos e ANTI-SILENCIO e ANTI-ALARME, nesta ordem de risco:
 *   - ANTI-SILENCIO: documento ilegivel NAO pode sair AUSENTE nem GENERICO
 *   - ANTI-ALARME:   ressalva da pergunta SEGUINTE nao pode virar ressalva desta
 *
 * Ver memory/feedback_o_conferidor_que_eu_escrevo_tambem_e_um_medidor.md
 */
import {
  campoParaIso,
  classificarInstrumento,
  classificarLote,
  VEREDITOS_INSTRUMENTO as V,
} from '../lib/us-polls/instrumento.mjs'

let passou = 0
let falhou = 0
const falhas = []

function ok(nome, condicao, detalhe = '') {
  if (condicao) {
    passou++
  } else {
    falhou++
    falhas.push(`${nome}${detalhe ? ` — ${detalhe}` : ''}`)
  }
}

function eq(nome, obtido, esperado) {
  ok(nome, obtido === esperado, `esperado ${JSON.stringify(esperado)}, veio ${JSON.stringify(obtido)}`)
}

// ─── RECORTES REAIS ─────────────────────────────────────────────────────────

/** topline econtoplines_ZLmkpUi.pdf — 28-31/Ago, ja CURADA na nossa base */
const AGO_28_31 = `The Economist/YouGov Poll
August 28 - 31, 2026 - 1592 U.S. Adult citizens

 Sample                      1592 U.S. Adult citizens
 Conducted                   August 28 - 31, 2026
 Margin of Error             ±3.5%

  16. Approval of Congress
           Approve . . . . . . . . . . . . . . . . . . . . . . . . . 21%
           Disapprove . . . . . . . . . . . . . . . . . . . . . . . 58%
           Not sure . . . . . . . . . . . . . . . . . . . . . . . . 21%

  17. In the elections for U.S. Congress in November, who will you vote for in the district where you live?
           The Democratic candidate . . . . . . . . . . . . . . . . . . . . . 36%
           The Republican candidate . . . . . . . . . . . . . . . . . . . . . 31%
           Other . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1%
           Not sure . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8%
           I will not vote . . . . . . . . . . . . . . . . . . . . . . . . . . . . 23%

  18. How sure are you of your vote in the 2026 midterm elections?
  Asked of those who aren't voting third-party
           My mind is made up about who I will vote for . . . . . . 60%
           I might change my mind . . . . . . . . . . . . . . . . . . . . . 40%
`

/** topline econtoplines_B94Xkmi.pdf — 4-8/Set, FORA do indice */
const SET_04_08 = `The Economist/YouGov Poll
September 4 - 8, 2026 - 1469 U.S. Registered Voters

 Sample                      1469 U.S. Registered Voters
 Conducted                   September 4 - 8, 2026
 Margin of Error             ±3.4%

  22. Approval of the Supreme Court of the United States
           Approve . . . . . . . . . . . . . . . . . . . . . . . . . 31%
           Disapprove . . . . . . . . . . . . . . . . . . . . . . . 52%

  23. In the elections for U.S. Congress in November, who will you vote for in the district where you live?
  Asked using the names of candidates running in the respondent's district of residence
           The Democratic candidate . . . . . . . . . . . . . . . . . . . . . 42%
           The Republican candidate . . . . . . . . . . . . . . . . . . . . . 35%
           Other . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3%
           Not sure . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 16%
           I will not vote . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4%

  24. Would you consider voting for a different candidate, or is your mind made up?
           My mind is made up . . . . . . . . . . . . . . . . . . . . . . . . 70%
`

/** topline econtoplines_Vglw52E.pdf — 11-14/Set, FORA do indice */
const SET_11_14 = `The Economist/YouGov Poll
September 11 - 14, 2026 - 1461 U.S. Registered Voters

 Sample                      1461 U.S. Registered Voters
 Conducted                   September 11 - 14, 2026
 Margin of Error             ±3.4%

  40. Which party do you think will have a majority in the U.S. Senate after the elections in November?
           Democratic Party . . . . . . . . . . . . . . . . . . . . 34%
           Republican Party . . . . . . . . . . . . . . . . . . . . 35%

  41. In the elections for U.S. Congress in November, who will you vote for in the district where you live?
  Asked using the names of candidates running in the respondent's district of residence
         The Democratic candidate . . . . . . . . . . . . . . . . . . . . . 44%
         The Republican candidate . . . . . . . . . . . . . . . . . . . . . 39%
         Other . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3%
         Not sure . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10%
         I will not vote . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4%
`

/** crosstab econTabReport_ZmVljW6.pdf — 11-14/Set: relatorio de RV, SEM a tabela */
const SET_11_14_CROSSTAB = `The Economist/YouGov Poll
September 11 - 14, 2026 - 1461 U.S. Registered Voters

List of Tables
   1. Direction of Country . . . . . . . . . . . . . . . . . . . . . . . . . . 2
   2. Country Under Control . . . . . . . . . . . . . . . . . . . . . . . . . 3
   3. Self-Description . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4

31. Satisfaction with House Candidates
How satisfied are you with the candidates running for U.S. House of Representatives in the district where you live?

                                                   Total     Male     Female
Very satisfied                                       12%       13%       11%
Somewhat satisfied                                   33%       31%       35%
Unweighted N                                      (1,461)    (700)     (761)

32. Expected House Majority
Which party do you think will have a majority in the U.S. House of Representatives after the elections in November?

                                                   Total     Male     Female
Democratic Party                                     43%       41%       45%
Republican Party                                     31%       35%       27%
`

// ─── 1. AS ONDAS REAIS ──────────────────────────────────────────────────────

const rAgo = classificarInstrumento(AGO_28_31)
eq('28-31/Ago e GENERICO', rAgo.veredito, V.GENERICO)
eq('28-31/Ago nao acha ressalva', rAgo.ressalva, null)
eq('28-31/Ago le a amostra', rAgo.amostra?.n, 1592)
eq('28-31/Ago le o tipo de amostra', rAgo.amostra?.tipo, 'Adult citizens')
eq('28-31/Ago le a margem', rAgo.margemErro, 3.5)
eq('28-31/Ago le o campo', rAgo.campo, 'August 28 - 31, 2026')
eq('28-31/Ago le o D', rAgo.numeros?.dem, 36)
eq('28-31/Ago le o R', rAgo.numeros?.rep, 31)
eq('28-31/Ago soma 99', rAgo.numeros?.soma, 99)

const rSet1 = classificarInstrumento(SET_04_08)
eq('4-8/Set e NOMINAL', rSet1.veredito, V.NOMINAL)
ok('4-8/Set carrega o texto da ressalva', /names of candidates/i.test(rSet1.ressalva ?? ''), rSet1.ressalva ?? '(null)')
eq('4-8/Set le a amostra', rSet1.amostra?.n, 1469)
eq('4-8/Set le o tipo', rSet1.amostra?.tipo, 'Registered Voters')
eq('4-8/Set le o D', rSet1.numeros?.dem, 42)
eq('4-8/Set le o R', rSet1.numeros?.rep, 35)

const rSet2 = classificarInstrumento(SET_11_14)
eq('11-14/Set e NOMINAL', rSet2.veredito, V.NOMINAL)
eq('11-14/Set le o D', rSet2.numeros?.dem, 44)
eq('11-14/Set le o R', rSet2.numeros?.rep, 39)
eq('11-14/Set le a amostra', rSet2.amostra?.n, 1461)

const rCross = classificarInstrumento(SET_11_14_CROSSTAB)
eq('crosstab de RV de setembro e AUSENTE', rCross.veredito, V.AUSENTE)
eq('crosstab AUSENTE ainda le a amostra', rCross.amostra?.n, 1461)

// ─── 2. ANTI-SILENCIO: o que NAO pode sair AUSENTE nem GENERICO ─────────────

eq('texto vazio e INDETERMINADO', classificarInstrumento('').veredito, V.INDETERMINADO)
eq('null e INDETERMINADO', classificarInstrumento(null).veredito, V.INDETERMINADO)
eq('undefined e INDETERMINADO', classificarInstrumento(undefined).veredito, V.INDETERMINADO)
eq('numero e INDETERMINADO', classificarInstrumento(12345).veredito, V.INDETERMINADO)
eq('pagina de erro curta e INDETERMINADO', classificarInstrumento('404 Not Found').veredito, V.INDETERMINADO)
eq(
  'PDF que extraiu so o cabecalho e INDETERMINADO',
  classificarInstrumento('The Economist/YouGov Poll\nSeptember 11 - 14, 2026').veredito,
  V.INDETERMINADO,
)
ok(
  'INDETERMINADO diz que a extracao falhou, nao que a pergunta falta',
  /extracao falhou/.test(classificarInstrumento('').motivo),
  classificarInstrumento('').motivo,
)

// ─── 3. ANTI-ALARME: ressalva da pergunta seguinte nao e desta ──────────────

// A Q18 real de 28-31/Ago tem "Asked of those who aren't voting third-party" e
// a nossa Q17 nao tem. Se a janela da ressalva fosse frouxa, 28-31/Ago sairia
// COM_RESSALVA e a onda ja curada viraria suspeita.
eq('ressalva da Q18 nao contamina a Q17', rAgo.veredito, V.GENERICO)

const RESSALVA_LONGE = AGO_28_31.replace(
  '  18. How sure are you',
  '  17b. Filler question one.\n           Yes . . . 50%\n           No . . . 50%\n  17c. Filler question two.\n           Yes . . . 50%\n           No . . . 50%\n  17d. Filler question three.\n           Yes . . . 50%\n           No . . . 50%\n  18. How sure are you',
)
eq('ressalva a muitos caracteres de distancia nao conta', classificarInstrumento(RESSALVA_LONGE).veredito, V.GENERICO)

const NOMES_LONGE = `${AGO_28_31}\n\n  99. Do you recognize the names of candidates in your state?\n           Yes . . . 40%\n           No . . . 60%\n`
eq('"names of candidates" longe da pergunta nao vira NOMINAL', classificarInstrumento(NOMES_LONGE).veredito, V.GENERICO)

// ─── 4. FORMA DO DOCUMENTO: o leitor nao pode depender da quebra de linha ───

const EMBRULHADA = SET_11_14.replace(
  '  41. In the elections for U.S. Congress in November, who will you vote for in the district where you live?',
  '  41. In the elections for U.S. Congress in November, who will you\n      vote for in the district where you live?',
)
eq('pergunta embrulhada em duas linhas ainda casa', classificarInstrumento(EMBRULHADA).veredito, V.NOMINAL)

const RESSALVA_EMBRULHADA = SET_11_14.replace(
  "  Asked using the names of candidates running in the respondent's district of residence",
  "  Asked using the names of candidates running in the\n  respondent's district of residence",
)
eq('ressalva embrulhada ainda e NOMINAL', classificarInstrumento(RESSALVA_EMBRULHADA).veredito, V.NOMINAL)

// O crosstab de agosto traz a pergunta sob o titulo "Generic Congressional
// Vote" e com a tabela inteira depois dela, nao a lista do topline.
const CROSSTAB_AGO = `The Economist/YouGov Poll
August 14 - 17, 2026 - 1611 U.S. Adult Citizens

41. Generic Congressional Vote
In the elections for U.S. Congress in November, who will you vote for in the district where you live?

                                                     Total     Male     Female       White        Black
The Democratic candidate                             39%        33%          44%         35%       57%
The Republican candidate                             32%        35%          29%         40%        7%
Other                                                 1%         2%           1%          1%        0%
Not sure                                              9%         8%          11%          9%       10%
I will not vote                                      19%        22%          15%         15%       26%
Unweighted N                                       (1,611)     (750)      (861)      (1,100)      (190)
`
const rCrossAgo = classificarInstrumento(CROSSTAB_AGO)
eq('crosstab de agosto e GENERICO', rCrossAgo.veredito, V.GENERICO)
eq('crosstab de agosto ve o titulo da tabela', rCrossAgo.tituloDeTabela, true)
eq('crosstab de agosto le o D da coluna Total', rCrossAgo.numeros?.dem, 39)
eq('crosstab de agosto le o R da coluna Total', rCrossAgo.numeros?.rep, 32)
eq('topline nao tem titulo de tabela', rAgo.tituloDeTabela, false)

// 🔑 O CASO QUE PRENDE O `achatar`, e ele e real.
//
// Nos crosstabs a tabela ATRAVESSA a quebra de pagina, e o gerador repete o
// cabecalho do relatorio no meio dela. Medido no econTabReport_yVe1kKt.pdf:
// da pergunta ate o rotulo "The Democratic candidate" vao 402 caracteres de
// puro espacamento de coluna numa pagina so. Com a quebra no meio, o rotulo
// cai depois de mais de mil, e a janela de conteudo passaria longe dele.
//
// Sem achatar, as janelas deste arquivo deixam de medir CONTEUDO e passam a
// medir o espacamento que o gerador do PDF escolheu, que nao e propriedade do
// documento nem do instituto.
const ESPACO = ' '.repeat(190)
const CABECALHO_REPETIDO = `${ESPACO}24
The Economist/YouGov Poll
August 14 - 17, 2026 - 1611 U.S. Adult Citizens

41. Generic Congressional Vote (continuacao)
`
const CROSSTAB_QUEBRA_DE_PAGINA = `The Economist/YouGov Poll
August 14 - 17, 2026 - 1611 U.S. Adult Citizens

 Sample                      1611 U.S. Adult Citizens
 Conducted                   August 14 - 17, 2026
 Margin of Error             ±3.4%

41. Generic Congressional Vote
In the elections for U.S. Congress in November, who will you vote for in the district where you live?
${ESPACO}
${ESPACO}
${CABECALHO_REPETIDO}
${ESPACO}Sex                         Race                             Age
${ESPACO}
${ESPACO}Total     Male     Female       White        Black   Hispanic
${ESPACO}
The Democratic candidate                           39%        33%          44%         35%       57%       46%
The Republican candidate                             32%        35%          29%         40%        7%       22%
Other                                                 1%         2%           1%          1%        0%        3%
Not sure                                              9%         8%          11%          9%       10%        9%
I will not vote                                      19%        22%          15%         15%       26%       20%
`
const bruto = CROSSTAB_QUEBRA_DE_PAGINA
const posPergunta = bruto.indexOf('where you live?') + 'where you live?'.length
ok(
  'o caso da quebra de pagina de fato poe o rotulo FORA da janela crua',
  bruto.slice(posPergunta).indexOf('The Democratic candidate') > 1400,
  `distancia crua ${bruto.slice(posPergunta).indexOf('The Democratic candidate')}, precisa passar de 1400`,
)
const rQuebra = classificarInstrumento(CROSSTAB_QUEBRA_DE_PAGINA)
eq('tabela com quebra de pagina ainda e GENERICO', rQuebra.veredito, V.GENERICO)
eq('tabela com quebra de pagina ainda le o D', rQuebra.numeros?.dem, 39)
eq('tabela com quebra de pagina ainda le o R', rQuebra.numeros?.rep, 32)
eq('tabela com quebra de pagina soma 100', rQuebra.numeros?.soma, 100)

// E o mesmo, com a ressalva empurrada para longe pelo espacamento: sem
// achatar, ela sairia da janela de 260 e o documento passaria por GENERICO.
const COM_RESSALVA_APOS_ESPACO = CROSSTAB_QUEBRA_DE_PAGINA.replace(
  'where you live?\n',
  `where you live?\n${ESPACO}\n${ESPACO}\nAsked using the names of candidates running in the respondent's district of residence\n`,
)
eq('ressalva depois de muito espacamento ainda e NOMINAL', classificarInstrumento(COM_RESSALVA_APOS_ESPACO).veredito, V.NOMINAL)

// ─── 5. RESSALVA DESCONHECIDA: nao se engole e nao se chama de nominal ──────

const RESSALVA_OUTRA = SET_11_14.replace(
  "Asked using the names of candidates running in the respondent's district of residence",
  'Asked of those who say they are certain to vote',
)
const rOutra = classificarInstrumento(RESSALVA_OUTRA)
eq('ressalva desconhecida e COM_RESSALVA', rOutra.veredito, V.COM_RESSALVA)
eq('ressalva desconhecida NAO e NOMINAL', rOutra.veredito === V.NOMINAL, false)
ok('COM_RESSALVA carrega o texto', /certain to vote/.test(rOutra.ressalva ?? ''), rOutra.ressalva ?? '(null)')
ok('COM_RESSALVA pede olho humano', /olho humano/.test(rOutra.motivo), rOutra.motivo)

// ─── 6. O LOTE separa as tres pilhas, e nao as soma ─────────────────────────

const lote = classificarLote([
  { rotulo: '28-31/Ago', texto: AGO_28_31 },
  { rotulo: '4-8/Set', texto: SET_04_08 },
  { rotulo: '11-14/Set', texto: SET_11_14 },
  { rotulo: 'crosstab RV', texto: SET_11_14_CROSSTAB },
  { rotulo: 'ilegivel', texto: '' },
  { rotulo: 'ressalva nova', texto: RESSALVA_OUTRA },
])
eq('lote: 1 comparavel', lote.comparaveis.length, 1)
eq('lote: 3 nao comparaveis', lote.naoComparaveis.length, 3)
eq('lote: 2 nao concluidos', lote.naoConcluidos.length, 2)
eq('lote: nada se perde', lote.resultados.length, 6)
ok(
  'lote: o ilegivel NAO entra em nao-comparavel',
  !lote.naoComparaveis.some((r) => r.rotulo === 'ilegivel'),
  'INDETERMINADO virou descarte',
)
ok(
  'lote: a ressalva nova NAO entra em comparavel',
  !lote.comparaveis.some((r) => r.rotulo === 'ressalva nova'),
  'COM_RESSALVA virou comparavel',
)
eq('lote vazio nao quebra', classificarLote(undefined).resultados.length, 0)

// ─── 6b. A PODA da ressalva e cosmetica: nao pode mudar veredito ────────────

// Achatado, a ressalva cola na tabela. O que se imprime tem de ser a frase, e
// a frase tem de continuar bastando para o veredito.
ok(
  'ressalva podada nao arrasta a tabela',
  !/\d%/.test(rSet2.ressalva ?? '') && !/Democratic candidate/.test(rSet2.ressalva ?? ''),
  rSet2.ressalva ?? '(null)',
)
ok('ressalva podada ainda contem a frase inteira', /district of residence$/.test(rSet2.ressalva ?? ''), rSet2.ressalva ?? '(null)')
eq('e o veredito sobre a podada segue NOMINAL', rSet2.veredito, V.NOMINAL)

const CROSSTAB_NOMINAL = `The Economist/YouGov Poll
September 11 - 14, 2026 - 1461 U.S. Registered Voters

 Sample                      1461 U.S. Registered Voters
 Conducted                   September 11 - 14, 2026
 Margin of Error             ±3.3%

41. Generic Congressional Vote
In the elections for U.S. Congress in November, who will you vote for in the district where you live?
Asked using the names of candidates running in the respondent's district of residence

                                                     Sex                    Race
                                        Total     Male     Female       White        Black
The Democratic candidate                 44%       40%        48%         38%          62%
The Republican candidate                 39%       43%        35%         46%          11%
Other                                     3%        3%         3%          3%           2%
Not sure                                 10%        9%        11%          9%          20%
I will not vote                           4%        5%         3%          4%           5%
`
const rCN = classificarInstrumento(CROSSTAB_NOMINAL)
eq('crosstab NOMINAL e NOMINAL', rCN.veredito, V.NOMINAL)
ok('crosstab: ressalva podada no primeiro rotulo de coluna', !/Total|Sex|%/.test(rCN.ressalva ?? ''), rCN.ressalva ?? '(null)')
eq('crosstab NOMINAL le o D da coluna Total', rCN.numeros?.dem, 44)
eq('crosstab NOMINAL le o R da coluna Total', rCN.numeros?.rep, 39)

// ─── 7. A DATA DO CAMPO em ISO, que e o que casa com a nossa base ───────────

const j = (x) => JSON.stringify(x)
eq('intervalo no mesmo mes', j(campoParaIso('September 11 - 14, 2026')), j({ inicio: '2026-09-11', fim: '2026-09-14' }))
eq('intervalo com travessao longo', j(campoParaIso('August 28 – 31, 2026')), j({ inicio: '2026-08-28', fim: '2026-08-31' }))
eq(
  'virada de MES: o dia final e de outro mes',
  j(campoParaIso('August 31 - September 3, 2026')),
  j({ inicio: '2026-08-31', fim: '2026-09-03' }),
)
eq(
  'virada de ANO: o inicio e do ano anterior',
  j(campoParaIso('December 29 - January 2, 2027')),
  j({ inicio: '2026-12-29', fim: '2027-01-02' }),
)
eq('um dia so', j(campoParaIso('September 14, 2026')), j({ inicio: '2026-09-14', fim: '2026-09-14' }))
// O pdftotext de coluna estreita devolve espaco antes da virgula. Se isto
// voltasse a dar null, a onda ja ingerida pareceria onda que falta.
eq(
  'espaco antes da virgula ainda casa',
  j(campoParaIso('  September   4  -  8 ,  2026 ')),
  j({ inicio: '2026-09-04', fim: '2026-09-08' }),
)
eq('mes inventado devolve null', campoParaIso('Smarch 4 - 8, 2026'), null)
eq('texto solto devolve null', campoParaIso('quando deu'), null)
eq('null devolve null', campoParaIso(null), null)
eq('numero devolve null', campoParaIso(20260914), null)

// e o campo sai da ficha, nos dois formatos de documento
eq('topline: campoIso lido da linha Conducted', j(rSet2.campoIso), j({ inicio: '2026-09-11', fim: '2026-09-14' }))
eq('crosstab: campoIso lido do CABECALHO, que nao tem Conducted', j(rCrossAgo.campoIso), j({ inicio: '2026-08-14', fim: '2026-08-17' }))
eq('crosstab sem a pergunta ainda entrega o campo', j(rCross.campoIso), j({ inicio: '2026-09-11', fim: '2026-09-14' }))

// ─── RESULTADO ──────────────────────────────────────────────────────────────

console.log(`\n🧪 INSTRUMENTO: ${passou} passou · ${falhou} falhou  (${passou + falhou} casos)`)
if (falhou) {
  console.log('\n❌ falhas:')
  for (const f of falhas) console.log(`   ${f}`)
  process.exit(1)
}
console.log('✅ todos os casos passaram\n')
