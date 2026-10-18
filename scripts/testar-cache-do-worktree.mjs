#!/usr/bin/env node
/**
 * Teste da sincronização do news-cache entre worktree e árvore principal.
 * Os dois erros caros: sobrescrever o cache recém-coletado com o velho, e
 * devolver à principal um arquivo MENOR que o dela (perde manchete).
 */
import { planejar } from './lib/cache-do-worktree.mjs'

let ok = 0
let falhas = 0
const eq = (a, b, nome) => {
  if (JSON.stringify(a) === JSON.stringify(b)) return void ok++
  falhas++
  console.error(`  ❌ ${nome}\n       esperado ${JSON.stringify(b)}\n       achado   ${JSON.stringify(a)}`)
}

const aqui = { '2026-10-18.json': 900 }
const la = { '2026-10-03.json': 50, '2026-10-15.json': 500, '2026-10-16.json': 600, '2026-10-17.json': 700, '2026-10-18.json': 400, 'notas.txt': 1 }
const p = planejar(aqui, la, { desde: '2026-10-04' })

console.log('\n🧪 planejar: worktree recém-criado com o dia de hoje\n')
eq(p.trazer, ['2026-10-15.json', '2026-10-16.json', '2026-10-17.json'], 'traz os dias que faltam, dentro da janela')
eq(p.trazer.includes('2026-10-18.json'), false, 'NÃO traz o dia que já existe aqui (o daqui é o recém-coletado)')
eq(p.trazer.includes('2026-10-03.json'), false, 'dia antes de `desde` fica fora')
eq(p.trazer.includes('notas.txt'), false, 'arquivo que não tem forma de data fica fora')
eq(p.devolver, ['2026-10-18.json'], 'devolve o de hoje, que é MAIOR aqui (900 contra 400)')

const menor = planejar({ '2026-10-18.json': 300 }, { '2026-10-18.json': 400 }, { desde: '2026-10-04' })
eq(menor.devolver, [], 'NÃO devolve arquivo menor que o da principal')
const falta = planejar({ '2026-10-18.json': 300 }, {}, { desde: '2026-10-04' })
eq(falta.devolver, ['2026-10-18.json'], 'devolve quando a principal não tem o dia')

console.log(`\n${falhas ? '🔴' : '✅'} ${ok} ok, ${falhas} falha(s)\n`)
process.exit(falhas ? 1 : 0)
