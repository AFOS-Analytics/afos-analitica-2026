/**
 * testar-linhas-fora-de-rodada.ts — a regra que separa as linhas da PRÓPRIA última
 * rodada (gravadas instantes antes do carimbo dela) das que entraram por fora.
 * Caso real plantado: 06/Out/2026, 3 inserções às 17:27:48 e carimbo às 17:27:49.
 */
import { linhasDaRodada } from './linhas-fora-de-rodada-brz'

let ok = 0
let falhou = 0
function conferir(nome: string, cond: boolean, detalhe = '') {
  if (cond) ok++
  else falhou++
  console.log(`  ${cond ? '✅' : '❌'} ${nome}${cond ? '' : '  ' + detalhe}`)
}
const d = (s: string) => new Date(s)
const ate = d('2026-10-06T17:27:49.188Z')
const cron = Array(5).fill(d('2026-10-05T18:00:11.659Z'))
const rodada = Array(3).fill(d('2026-10-06T17:27:48.363Z'))

const r1 = linhasDaRodada([...cron, ...rodada], ate, 3)
conferir('caso de 06/Out: as 3 da rodada saem como rodada', r1.size === 3 && [5, 6, 7].every((i) => r1.has(i)), [...r1].join(','))
conferir('e nenhuma do cron entra', [0, 1, 2, 3, 4].every((i) => !r1.has(i)))

const r2 = linhasDaRodada([...cron, ...rodada], ate, 2)
conferir('a rodada declarou 2: só 2 saem, a 3ª continua acusada', r2.size === 2)

const r3 = linhasDaRodada([...cron], ate, 3)
conferir('linha a mais de 10 min do carimbo NÃO é da rodada', r3.size === 0, [...r3].join(','))

const r4 = linhasDaRodada([...cron, ...rodada], null, 3)
conferir('sem carimbo final (--desde), ninguém é da rodada', r4.size === 0)

const r5 = linhasDaRodada([...rodada, d('2026-10-06T17:30:00Z')], ate, 3)
conferir('linha DEPOIS do carimbo não é da rodada e corta a contagem', r5.size === 0, [...r5].join(','))

console.log(`\n${falhou ? '❌' : '✅'} ${ok} passaram, ${falhou} falharam.`)
process.exit(falhou ? 1 : 0)
