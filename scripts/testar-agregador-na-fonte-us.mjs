#!/usr/bin/env node
/**
 * Teste do leitor de rótulo do agregador na fonte.
 *
 * 🔴 O CASO QUE FEZ ESTE ARQUIVO NASCER, medido em 19/Set/2026: o rótulo do
 *    Race to the WH traz a NOTA da casa entre parênteses, e `\bA\b` casa com o
 *    "A" de "(A+)", porque "(" e "+" não são caractere de palavra. A NYT/Siena,
 *    que o rótulo declara como **1503 LV**, saía do leitor como recorte **A**,
 *    e a Quinnipiac, que é 970 RV, também.
 *
 * 🕳️ E ele passava CALADO: o casamento com a nossa base é por CASA e DATA, não
 *    por recorte, então o veredito de "falta" continuava certo. O erro só
 *    aparecia na linha impressa, que é justamente a que alguém transcreve à mão
 *    para escrever a entrada curada. Defeito que não muda veredito nenhum e
 *    ainda assim produz número errado no arquivo é o tipo que este repositório
 *    já viu várias vezes.
 */
import { lerRotulo, APELIDOS, CHAVE_GENERIC_BALLOT, BASE_LIVE } from './agregador-na-fonte-us.mjs'

let ok = 0
let falhas = 0

function eq(achado, esperado, nome) {
  if (achado === esperado) {
    ok++
    return
  }
  falhas++
  console.error(`  ❌ ${nome}\n       esperado ${JSON.stringify(esperado)}\n       achado   ${JSON.stringify(achado)}`)
}

console.log('\n🧪 lerRotulo — recorte contra a NOTA da casa\n')

// ── os quatro casos reais do dia, com a nota colada ──────────────────────────
const siena = lerRotulo('Sep 8 - 13: NYT/Siena (A+), 1503 LV')
eq(siena?.recorte, 'LV', 'NYT/Siena (A+): a nota A+ NAO pode virar recorte A')
eq(siena?.amostra, 1503, 'NYT/Siena: amostra')
eq(siena?.campoFim, '2026-09-13', 'NYT/Siena: fim de campo')
eq(siena?.casaCompleta, 'NYT/Siena', 'NYT/Siena: a NOTA sai da chave de casamento')

const quinn = lerRotulo('Sep 3 - 6: Quinnipiac (A-), 970 RV')
eq(quinn?.recorte, 'RV', 'Quinnipiac (A-): a nota A- NAO pode virar recorte A')
eq(quinn?.amostra, 970, 'Quinnipiac: amostra')

const foca = lerRotulo('Aug 28 - Sep 2: Focaldata (B-), 2178 A')
eq(foca?.recorte, 'A', 'Focaldata: recorte A de VERDADE continua saindo A')
eq(foca?.amostra, 2178, 'Focaldata: amostra')
eq(foca?.campoFim, '2026-09-02', 'Focaldata: intervalo que CRUZA o mes')

const acti = lerRotulo('Aug 31 - Sep 10: Activote (B+), 1000 LV')
eq(acti?.recorte, 'LV', 'Activote: recorte')
eq(acti?.campoFim, '2026-09-10', 'Activote: cruza o mes, fim em setembro e nao em agosto')

// ── a nota do outro lado, e a casa com DOIS parenteses ───────────────────────
const bgsu = lerRotulo('Aug 25 - Sep 1: YouGov (BGSU) (B+), 566 LV')
eq(bgsu?.recorte, 'LV', 'YouGov (BGSU) (B+): dois parenteses, recorte intacto')
// ⭐ O caso que separa as duas coisas: a NOTA sai e o QUALIFICADOR fica. Se a
//    limpeza fosse por "qualquer parêntese", esta casa viraria "YouGov" e
//    passaria a casar com a CBS News/YouGov, que é outra instituição.
eq(bgsu?.casaCompleta, 'YouGov (BGSU)', 'YouGov (BGSU): a nota sai, o qualificador FICA')
eq(bgsu?.casa, 'YouGov', 'YouGov (BGSU): nome curto e so para exibicao')

// ── ANTI-SILENCIO: sem amostra, a varredura solta e o que sobra, e ela vale ──
// menos. Mas ela nao pode DESAPARECER: rotulo sem numero ainda declara recorte.
const semN = lerRotulo('Sep 1 - 3: Casa Qualquer, LV')
eq(semN?.recorte, 'LV', 'sem amostra: o recorte ainda e lido pela varredura solta')
eq(semN?.amostra, null, 'sem amostra: amostra e NULA, nunca inventada')

// ✅ O LIMITE DECLARADO EM 19/SET FECHOU em 25/Set, e este caso mudou de lado.
//    Ele estava escrito de proposito para quebrar se alguem mexesse, e quebrou:
//    com a nota removida antes de qualquer leitura, "Casa (A+), sem numero" nao
//    tem mais nenhum A para a varredura solta achar. O recorte sai NULO, que e a
//    resposta honesta, em vez de sair "A" inventado.
//    Caso real: a Strength In #s, que o agregador publica sem amostra, saia como
//    recorte A enquanto o indice a traz como LV.
const semNcomNota = lerRotulo('Sep 1 - 3: Casa (A+), sem numero')
eq(semNcomNota?.recorte, null, 'sem amostra E sem nota sobrando: recorte NULO, nao inventado')
eq(semNcomNota?.casaCompleta, 'Casa', 'sem amostra: a casa sai sem a nota')

// ── forma: o que nao e rotulo tem de sair NULO, nunca meio-lido ──────────────
eq(lerRotulo(''), null, 'string vazia')
eq(lerRotulo(null), null, 'null')
eq(lerRotulo(undefined), null, 'undefined')
eq(lerRotulo('Last Updated on Sep 19'), null, 'linha de carimbo nao e rodada')
eq(lerRotulo('Xyz 8 - 13: Casa, 100 LV'), null, 'mes inexistente sai NULO, nao vira janeiro')

// ── a chave e a base sao constantes exportadas, e mudar uma delas sem querer ──
eq(CHAVE_GENERIC_BALLOT, '79287655-1e6e-4a3a-9ca3-13883c9a7496', 'chave do grafico do generic ballot')
eq(BASE_LIVE, 'https://live-data.jifo.co/', 'base do live-data')
eq(Array.isArray(APELIDOS), true, 'APELIDOS e tabela explicita')

// ── APELIDOS: apelido que falta vira buraco que NAO existe ───────────────────
// 🔴 Em 20/Set/2026 o conferidor imprimiu Focaldata, UMass Amherst e McLaughlin
//    como faltando LOGO DEPOIS de eu as ingerir, porque o rotulo delas nao
//    estava na tabela, e ainda dizia "a casa NAO tem UMA linha no arquivo".
//    Falso buraco manda cacar de novo o que acabou de ser escrito.
const apelidar = (casa) => (APELIDOS.find(([re]) => re.test(casa)) || [null, casa])[1]

eq(apelidar('Focaldata (B-)'), 'Focaldata/Financial Times', 'Focaldata casa com o nome do indice')
eq(apelidar('McLaughlin (D)'), 'McLaughlin & Associates (R)', 'McLaughlin: a letra do agregador nao decide o nome')
eq(apelidar('Yougov (Amherst) (B+)'), 'UMass Amherst/YouGov', 'YouGov Amherst')
eq(apelidar('YouGov (BGSU) (B+)'), 'BGSU/YouGov', 'YouGov BGSU')

// ⛔ E as YouGov de universidade NAO podem colidir entre si nem com as de
//    midia: fundir series de instituicoes distintas e pior que nao casar
//    nenhuma. Amherst e Lowell sao a mesma UNIVERSIDADE ESTADUAL e campi
//    diferentes, com pesquisas diferentes, e e o par mais facil de fundir.
const distintos = ['Yougov (Amherst) (B+)', 'YouGov (BGSU) (B+)', 'UMass Lowell', 'YouGov (CBS)', 'YouGov (Economist)'].map(
  apelidar
)
eq(new Set(distintos).size, 5, 'as 5 YouGov de instituicoes diferentes continuam 5 nomes diferentes')
eq(apelidar('UMass Lowell'), 'UMass Lowell/YouGov', 'Lowell NAO vira Amherst')

// ── A NOTA NA CHAVE DE CASAMENTO, os casos reais de 25/Set/2026 ──────────────
// 🔴 O conferidor imprimiu 9 rodadas faltando e, para 6 delas, "a casa NAO tem
//    UMA linha no arquivo". As 6 estavam no arquivo, com a data de campo exata.
//    A causa era a nota entrar na chave: "Emerson College (A+)" nunca e igual a
//    "Emerson College". Estes casos sao os rotulos reais daquele dia.
console.log('\n🧪 a NOTA do agregador fora da chave de casamento\n')

for (const [rotulo, esperado] of [
  ['Sep 21 - 22: Emerson College (A+), 1000 LV', 'Emerson College'],
  ['Sep 17 - 21: Echelon Insights (A), 1002 LV', 'Echelon Insights'],
  ['Sep 16 - 17: CNN/SSRS (B), 867 RV', 'CNN/SSRS'],
  ['Sep 14 - 15: Marist College (A), 1280 RV', 'Marist College'],
  ['Sep 11 - 15: Hart/POS (A), 1000 RV', 'Hart/POS'],
  ['Sep 16 - 21: Strength In #s (A-)', 'Strength In #s'],
  ['Sep 16 - 22: McLaughlin (D), 1000 LV', 'McLaughlin'],
  ['Jul 1 - 2: Public Sentiment Inst. (D), 979 LV', 'Public Sentiment Inst.'],
]) {
  eq(lerRotulo(rotulo)?.casaCompleta, esperado, `nota fora da chave: ${esperado}`)
}

// ⛔ ANTI-EXCESSO: parentese INFORMATIVO tem de sobreviver. Limpar "qualquer
//    parentese" fundiria instituicoes distintas, que e defeito pior que o buraco
//    falso. Sao 3 letras ou mais, e nenhum deles e uma nota.
for (const [rotulo, esperado] of [
  ['Sep 18 - 21: YouGov (Economist) (B+), 975 LV', 'YouGov (Economist)'],
  ['Sep 8 - 11: YouGov (CBS) (B+), 1750 LV', 'YouGov (CBS)'],
  ['Aug 21 - 26: Yougov (Amherst) (B+), 1000 A', 'Yougov (Amherst)'],
  ['Jun 8 - 11: GSG (Dem) (B-), 1000 LV', 'GSG (Dem)'],
  ['Aug 7 - 11: Wave Polling (Verasight) (A-), 1591 RV', 'Wave Polling (Verasight)'],
  ['Jul 11 - 12: HarrisX (Harvard) (B-)', 'HarrisX (Harvard)'],
]) {
  eq(lerRotulo(rotulo)?.casaCompleta, esperado, `qualificador preservado: ${esperado}`)
}

// 🔑 O (D) e a NOTA, e a filiacao vem num parentese SEPARADO e no fim. Este e o
//    rotulo real que resolveu a ambiguidade do (D).
const mcl = lerRotulo('Jul 15 - 21: McLaughlin (D), 1000 LV (GOP)')
eq(mcl?.casaCompleta, 'McLaughlin', 'McLaughlin: a nota D sai da chave')
eq(mcl?.recorte, 'LV', 'McLaughlin: recorte intacto com nota E filiacao no rotulo')
eq(mcl?.amostra, 1000, 'McLaughlin: amostra intacta')

// ⛔ E a filiacao NAO pode ser confundida com nota: "(GOP)" e "(Dem)" tem 3+
//    letras e nao casam com [A-F] com sinal.
eq(lerRotulo('Aug 28 - 30: HarrisX (B-) (GOP)')?.casaCompleta, 'HarrisX (GOP)', 'HarrisX: a nota sai e a filiacao FICA')

// ── APELIDOS novos de 25/Set: os tres que a remocao da nota NAO resolve ──────
// Nome que difere de verdade entre os dois lados precisa de apelido, e e o unico
// caso em que apelido e a resposta certa.
eq(apelidar('Marist College'), apelidar('Marist University'), 'Marist: College e University sao a MESMA casa')
eq(
  apelidar('Hart/POS'),
  apelidar('Hart Research Associates (D)/ Public Opinion Strategies (R)'),
  'Hart/POS casa com o nome inteiro do indice'
)
eq(
  apelidar('Strength In #s'),
  apelidar('Strength In Numbers/Verasight'),
  'Strength In #s casa com Strength In Numbers/Verasight'
)

// ⛔ ANTI-EXCESSO do apelido novo: "Wave Polling (Verasight)" e casa DIFERENTE.
//    Apelidar por "verasight" fundiria duas series, e por isso o apelido e por
//    "strength in".
eq(
  apelidar('Wave Polling (Verasight)') === apelidar('Strength In Numbers/Verasight'),
  false,
  'Wave Polling NAO se funde com Strength In Numbers'
)
eq(apelidar('Wave Polling (Verasight)'), 'Wave Polling (Verasight)', 'Wave Polling passa intacta, sem apelido')

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${ok} asserção(ões) passaram, ${falhas} falharam\n`)
process.exit(falhas === 0 ? 0 : 1)
