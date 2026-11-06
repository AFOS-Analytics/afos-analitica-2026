/**
 * Casos plantados de `lib/us-market/livros-da-trava.ts`.
 *
 * O caso fundador é o de 05/Nov/2026: os três livros americanos resolvidos em
 * 100, zero preço nas duas leituras, e a trava terminando em BLOQUEADO com o
 * conselho de registrar book instável. Metade dos casos é ANTI-EXCESSO: o
 * conserto não pode transformar leitor quebrado, livro sumido ou leitura
 * repetida em "resolvido".
 */
import { classificarLivros, leituraVazia, vereditoDaTrava, type LeituraDosLivros } from '../lib/us-market/livros-da-trava'

let passou = 0
let falhou = 0
const falhas: string[] = []

function ok(nome: string, cond: boolean, detalhe = '') {
  if (cond) passou++
  else {
    falhou++
    falhas.push(`${nome}${detalhe ? ` (${detalhe})` : ''}`)
  }
}

const BOOKS = ['house', 'senate', 'asScheduled'] as const
const leitura = (precos: Record<string, number>, fechados: Record<string, number>): LeituraDosLivros => ({
  precos: new Map(Object.entries(precos)),
  fechados: new Map(Object.entries(fechados)),
})

// ── 1. O caso de 05/Nov: tudo resolvido ────────────────────────────────────
const resolvidaA = leitura({}, { house: 2, senate: 2, asScheduled: 1 })
const resolvidaB = leitura({}, { house: 2, senate: 2, asScheduled: 1 })
ok('05/Nov: leitura só com fechados NÃO é leitura vazia', !leituraVazia(resolvidaA))
const c1 = classificarLivros(BOOKS, resolvidaA, resolvidaB)
ok('05/Nov: os três livros saem resolvidos', c1.livrosResolvidos.length === 3, c1.livrosResolvidos.join(','))
ok('05/Nov: nenhum motivo de livro', c1.motivos.length === 0, c1.motivos.join(' | '))
ok('05/Nov: veredito RESOLVIDO', vereditoDaTrava(BOOKS, c1.livrosResolvidos, c1.motivos) === 'RESOLVIDO')

// ── 2. Anti-excesso: leitor quebrado continua bloqueando ───────────────────
const vazia = leitura({}, {})
ok('leitura sem preço e sem fechado É vazia', leituraVazia(vazia))
const c2 = classificarLivros(BOOKS, vazia, vazia)
ok('livro sem nada nas duas leituras vira motivo', c2.motivos.length === 3)
ok('e nenhum sai resolvido', c2.livrosResolvidos.length === 0)
ok('veredito BLOQUEADO', vereditoDaTrava(BOOKS, c2.livrosResolvidos, c2.motivos) === 'BLOQUEADO')

// ── 3. Anti-excesso: fechado só numa das leituras não é resolvido ──────────
const c3 = classificarLivros(BOOKS, resolvidaA, leitura({}, { house: 2, senate: 2 }))
ok('asScheduled fechado só na 1a leitura bloqueia', c3.motivos.some(m => m.startsWith('asScheduled:')))
ok('e sai do resolvido', !c3.livrosResolvidos.includes('asScheduled'))
ok('veredito BLOQUEADO', vereditoDaTrava(BOOKS, c3.livrosResolvidos, c3.motivos) === 'BLOQUEADO')

// ── 4. Anti-excesso: motivo GLOBAL vence o tudo resolvido ──────────────────
// Leitura degradada ou com o mesmo fetchedAt: a trava não leu duas vezes.
ok('tudo resolvido + motivo global = BLOQUEADO',
  vereditoDaTrava(BOOKS, ['house', 'senate', 'asScheduled'], ['As duas leituras têm o mesmo fetchedAt']) === 'BLOQUEADO')

// ── 5. Parcial: um livro resolvido e os outros vivos é APROVADO ────────────
const parcialA = leitura({ 'house:Democratic': 99.5, 'house:Republican': 0.5, 'asScheduled:x': 99.7 }, { senate: 2 })
const parcialB = leitura({ 'house:Democratic': 99.5, 'house:Republican': 0.5, 'asScheduled:x': 99.7 }, { senate: 2 })
const c5 = classificarLivros(BOOKS, parcialA, parcialB)
ok('parcial: só o Senado resolvido', c5.livrosResolvidos.join(',') === 'senate', c5.livrosResolvidos.join(','))
ok('parcial: veredito APROVADO, não RESOLVIDO', vereditoDaTrava(BOOKS, c5.livrosResolvidos, c5.motivos) === 'APROVADO')
ok('parcial: leitura com preço não é vazia', !leituraVazia(parcialA))

// ── 6. Anti-excesso: livro com preço não sai resolvido por ter um fechado ──
// O lado R da Câmara fechou antes do D em 04/Nov: o livro segue vivo.
const meioA = leitura({ 'house:Democratic': 99.9 }, { house: 1, senate: 2, asScheduled: 1 })
const c6 = classificarLivros(BOOKS, meioA, meioA)
ok('livro com UM contrato vivo não é resolvido', !c6.livrosResolvidos.includes('house'))
ok('e o veredito não é RESOLVIDO', vereditoDaTrava(BOOKS, c6.livrosResolvidos, c6.motivos) === 'APROVADO')

// ── 7. Leitura com preço e sem fechado não é vazia ──────────────────────────
ok('leitura viva sem nenhum fechado não é vazia', !leituraVazia(leitura({ 'house:Democratic': 92.5 }, {})))

// ── 8. Preço em UMA das leituras basta para o livro estar vivo ─────────────
// Fechou entre as duas leituras: a 1a viu preço, a 2a só fechado. Não é
// resolvido nas duas leituras, e quem cobra a ausência é o "presente na 1a e
// ausente na 2a" do capture-guard, não esta classificação.
const antes = leitura({ 'house:Democratic': 99.9 }, { house: 1, senate: 2, asScheduled: 1 })
const depois = leitura({}, { house: 2, senate: 2, asScheduled: 1 })
const c8 = classificarLivros(BOOKS, antes, depois)
ok('fechou no meio: house não sai resolvido', !c8.livrosResolvidos.includes('house'), c8.livrosResolvidos.join(','))
ok('fechou no meio: veredito não é RESOLVIDO', vereditoDaTrava(BOOKS, c8.livrosResolvidos, c8.motivos) !== 'RESOLVIDO')

// ── 9. Anti-silêncio: lista de livros vazia nunca é RESOLVIDO ──────────────
ok('sem livro vigiado, não há RESOLVIDO no vazio', vereditoDaTrava([], [], []) !== 'RESOLVIDO')

console.log(`\n${passou} passaram, ${falhou} falharam.`)
if (falhou) {
  for (const f of falhas) console.log(`  ❌ ${f}`)
  process.exit(1)
}
