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
eq(siena?.casaCompleta, 'NYT/Siena (A+)', 'NYT/Siena: nome inteiro preserva o qualificador')

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
eq(bgsu?.casaCompleta, 'YouGov (BGSU) (B+)', 'YouGov (BGSU): nome inteiro')
eq(bgsu?.casa, 'YouGov', 'YouGov (BGSU): nome curto e so para exibicao')

// ── ANTI-SILENCIO: sem amostra, a varredura solta e o que sobra, e ela vale ──
// menos. Mas ela nao pode DESAPARECER: rotulo sem numero ainda declara recorte.
const semN = lerRotulo('Sep 1 - 3: Casa Qualquer, LV')
eq(semN?.recorte, 'LV', 'sem amostra: o recorte ainda e lido pela varredura solta')
eq(semN?.amostra, null, 'sem amostra: amostra e NULA, nunca inventada')

// ⚠️ E o caso que mostra o limite declarado da varredura solta: sem amostra,
//    uma casa com nota A+ volta a poder confundir. Isto esta AQUI de proposito,
//    escrito como o comportamento conhecido, para que mudar isso quebre o teste
//    em vez de passar despercebido.
const semNcomNota = lerRotulo('Sep 1 - 3: Casa (A+), sem numero')
eq(semNcomNota?.recorte, 'A', 'LIMITE DECLARADO: sem amostra, a nota A+ ainda contamina')

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

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${ok} asserção(ões) passaram, ${falhas} falharam\n`)
process.exit(falhas === 0 ? 0 : 1)
