/**
 * 🧪 PORTÃO DE GRAVAÇÃO DO GENERIC BALLOT — casos plantados
 *
 * 🔴 O caso real, 25/Set/2026. A rota do cron se declarava à prova de leitura
 *    vazia e gravou `lidas 0 · pub 29 · n 12 · D+7.70` por cima de
 *    `lidas 430 · pub 449 · n 38 · D+7.98`, com `ok: true` e HTTP 200, porque o
 *    teste era `!polls.length || !mediaAfos`, que é a SAÍDA, e o que colapsou
 *    foi a ENTRADA. As 29 rodadas curadas seguravam `polls.length` acima de
 *    zero: elas são lista declarada e existem esteja a Wikipédia de pé ou não.
 *
 * ⚖️ Metade dos casos é ANTI-EXCESSO de propósito. O erro simétrico deste
 *    conserto é um portão que recusa todo dia, e trava que bloqueia sempre é
 *    trava que alguém aprende a pular. A regra é ZERO, nunca "pouco".
 */
import { avaliarGravacao } from '../lib/us-polls/portao-gravacao.mjs'

let ok = 0
let falhas = 0
const eq = (achado, esperado, nome) => {
  if (JSON.stringify(achado) === JSON.stringify(esperado)) {
    ok++
    return
  }
  falhas++
  console.error(`  ❌ ${nome}\n       esperado ${JSON.stringify(esperado)}\n       achado   ${JSON.stringify(achado)}`)
}

const coleta = (q, extra = {}) => ({
  qualidade: q,
  polls: new Array(q.publicadas ?? 1).fill({ instituto: 'x' }),
  mediaAfos: { vantagemDem: 8.06, nPesquisas: 39 },
  ...extra,
})

console.log('\n🧪 portao de gravacao: a ENTRADA, nao a saida\n')

// ── O CASO REAL de 25/Set/2026 ───────────────────────────────────────────────
const real = avaliarGravacao(coleta({ linhasLidas: 0, publicadas: 29, curadas: 29 }))
eq(real.gravar, false, 'CASO REAL: indice em zero com 29 curadas NAO grava')
eq(real.http, 502, 'CASO REAL: responde 502, nao 200')
eq(real.lidas, 0, 'CASO REAL: a resposta declara lidas 0')
eq(real.curadas, 29, 'CASO REAL: a resposta declara quantas eram curadas')
eq(/ÍNDICE/.test(real.motivo), true, 'CASO REAL: o motivo nomeia QUEM falhou, o indice')

// ── A coleta boa de hoje, depois do conserto do coletor ──────────────────────
const boa = avaliarGravacao(coleta({ linhasLidas: 431, publicadas: 450, curadas: 19 }))
eq(boa.gravar, true, 'coleta boa grava')
eq(boa.http, 200, 'coleta boa responde 200')
eq(boa.motivo, null, 'coleta boa nao tem motivo de recusa')

// ── ANTI-EXCESSO: a regra e ZERO, nunca "pouco" ─────────────────────────────
// 🔑 Uma linha lida e leitura de verdade, por magra que seja. Quem julga queda
//    parcial e o conferir-us-polls, que compara contra a base do git. Se este
//    portao passasse a julgar tamanho, seriam duas regras para a mesma pergunta.
eq(avaliarGravacao(coleta({ linhasLidas: 1, publicadas: 20, curadas: 19 })).gravar, true, 'ANTI-EXCESSO: 1 linha lida ainda e leitura')
eq(avaliarGravacao(coleta({ linhasLidas: 431, publicadas: 431, curadas: 0 })).gravar, true, 'ANTI-EXCESSO: zero curadas nao e problema nenhum')
eq(avaliarGravacao(coleta({ linhasLidas: 5, publicadas: 5, curadas: 0 })).gravar, true, 'ANTI-EXCESSO: leitura pequena e sem curada grava')

// ── ANTI-SILENCIO: os jeitos de nao ter leitura, e todos recusam ─────────────
eq(avaliarGravacao(coleta({ linhasLidas: 0, publicadas: 0, curadas: 0 })).gravar, false, 'tudo em zero recusa')
eq(avaliarGravacao({ qualidade: { linhasLidas: 431, publicadas: 450 }, polls: [], mediaAfos: {} }).gravar, false, 'polls vazio recusa mesmo com lidas alto')
eq(avaliarGravacao({ qualidade: { linhasLidas: 431, publicadas: 450 }, polls: [1], mediaAfos: null }).gravar, false, 'media nula recusa')

// 🕳️ O guarda e de TIPO. `Number(true)` e 1 e `Number(null)` e 0, os dois
//    finitos: contador que chegou assim NAO e contagem, e passar valendo 1 seria
//    gravar sobre dado bom com base numa coercao.
eq(avaliarGravacao({ qualidade: { publicadas: 450 }, polls: [1], mediaAfos: {} }).gravar, false, 'linhasLidas AUSENTE recusa, e nao vira zero silencioso')
eq(avaliarGravacao({ qualidade: { linhasLidas: null, publicadas: 450 }, polls: [1], mediaAfos: {} }).gravar, false, 'linhasLidas null recusa')
eq(avaliarGravacao({ qualidade: { linhasLidas: true, publicadas: 450 }, polls: [1], mediaAfos: {} }).gravar, false, 'linhasLidas true recusa, e nao vale 1')
eq(avaliarGravacao({ qualidade: { linhasLidas: '431', publicadas: 450 }, polls: [1], mediaAfos: {} }).gravar, false, 'linhasLidas em TEXTO recusa')
eq(avaliarGravacao({ qualidade: { linhasLidas: NaN, publicadas: 450 }, polls: [1], mediaAfos: {} }).gravar, false, 'linhasLidas NaN recusa')
eq(avaliarGravacao({ polls: [1], mediaAfos: {} }).gravar, false, 'coleta sem bloco de qualidade recusa')
eq(avaliarGravacao(null).gravar, false, 'coleta nula recusa')
eq(avaliarGravacao(undefined).gravar, false, 'coleta undefined recusa')

// ⛔ E recusa sempre sai com HTTP de recusa, senao o chamador le 200 e segue.
for (const mau of [null, { polls: [1], mediaAfos: {} }, coleta({ linhasLidas: 0, publicadas: 29, curadas: 29 })]) {
  eq(avaliarGravacao(mau).http, 502, 'toda recusa responde 502')
}

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${ok} asserção(ões) passaram, ${falhas} falharam\n`)
process.exit(falhas === 0 ? 0 : 1)
