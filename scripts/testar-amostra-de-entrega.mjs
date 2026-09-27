#!/usr/bin/env node
/**
 * TESTE da amostra de entrega, com as mutações plantadas.
 *
 * O caso REAL que criou o arquivo, 27/Set/2026: o lote `tradeoff 2026-09-28` tem
 * 21 eventos do Brasil (№19) e 21 dos EUA (№10), e conferir "os EUA" devolvia 42.
 *
 * Metade das asserções é ANTI-SILÊNCIO (o filtro tem de cortar, e o balde sem
 * país tem de aparecer) e metade é ANTI-EXCESSO (omitir país NÃO pode virar erro,
 * e `(sem país)` NÃO pode ser somado a ninguém).
 *
 *   node scripts/testar-amostra-de-entrega.mjs
 */
import { filtrarLote, filtrarPais, quebraPorPais, quebraEmTexto } from './lib/amostra-de-entrega.mjs'

let ok = 0
const falhas = []
function eq(rotulo, achado, esperado) {
  const a = JSON.stringify(achado)
  const b = JSON.stringify(esperado)
  if (a === b) ok++
  else falhas.push(`${rotulo}\n     esperado ${b}\n     achado   ${a}`)
}
function lanca(rotulo, fn) {
  try {
    fn()
    falhas.push(`${rotulo}: devia LANÇAR e não lançou`)
  } catch {
    ok++
  }
}

const ev = (edicao, produto, pais, messageId = 'id') => ({ eventPayload: { edicao, produto, pais, messageId } })
const N = (n, ...args) => Array.from({ length: n }, () => ev(...args))

// O lote real de 28/Set: dois países, mesmo produto, mesma data.
const REAL = [
  ...N(21, '2026-09-28', 'tradeoff', 'br'),
  ...N(21, '2026-09-28', 'tradeoff', 'us'),
  ...N(3, '2026-09-21', 'tradeoff', 'us'),
  ...N(5, '2026-09-28', 'daily', 'br'),
]

// ── 1. O defeito medido, reproduzido ────────────────────────────────────────
const lote = filtrarLote(REAL, '2026-09-28', 'tradeoff')
eq('o LOTE de 28/Set tem os dois países dentro: 42', lote.length, 42)
eq('e é isso que fazia o veredito dizer 42 sobre "os EUA"', quebraEmTexto(lote), 'br=21 · us=21')
eq('filtrado por us, são 21 e não 42', filtrarPais(lote, 'us').length, 21)
eq('filtrado por br, são 21', filtrarPais(lote, 'br').length, 21)
eq('e a quebra do filtrado nomeia um país só', quebraEmTexto(filtrarPais(lote, 'us')), 'us=21')

// ── 2. ANTI-SILÊNCIO: o filtro tem de CORTAR ────────────────────────────────
eq('produto separa: daily não entra no lote de tradeoff', filtrarLote(REAL, '2026-09-28', 'daily').length, 5)
eq('data separa: 21/Set não entra no lote de 28/Set', lote.filter((e) => e.eventPayload.edicao !== '2026-09-28').length, 0)
eq('país que não existe no lote devolve VAZIO, não o lote', filtrarPais(lote, 'ar').length, 0)
eq('país com caixa diferente NÃO casa: "US" não é "us"', filtrarPais(lote, 'US').length, 0)
eq('país como prefixo NÃO casa: "u" não é "us"', filtrarPais(lote, 'u').length, 0)
lanca('sem edição, filtrarLote LANÇA em vez de devolver tudo', () => filtrarLote(REAL, undefined, 'tradeoff'))
lanca('edição vazia também LANÇA', () => filtrarLote(REAL, '', 'tradeoff'))

// ── 3. ANTI-SILÊNCIO: o balde sem país APARECE ──────────────────────────────
const COM_ORFAO = [...N(2, '2026-08-10', 'tradeoff', 'br'), { eventPayload: { edicao: '2026-08-10', produto: 'tradeoff' } }]
const loteOrfao = filtrarLote(COM_ORFAO, '2026-08-10', 'tradeoff')
eq('evento SEM campo país fica no lote', loteOrfao.length, 3)
eq('e aparece declarado na quebra', quebraEmTexto(loteOrfao), 'br=2 · (sem país)=1')
eq('ele NÃO é somado ao país pedido', filtrarPais(loteOrfao, 'br').length, 2)
eq('e pedir "(sem país)" como país não o pesca por acidente', filtrarPais(loteOrfao, '(sem país)').length, 0)
eq('payload nulo não derruba a quebra, vira balde', quebraEmTexto([{ eventPayload: null }]), '(sem país)=1')
eq('evento nulo também não derruba', quebraEmTexto([null]), '(sem país)=1')

// ── 4. ANTI-EXCESSO: omitir país NÃO é erro, e a quebra é que denuncia ──────
eq('sem país, filtrarPais devolve o lote INTEIRO', filtrarPais(lote, undefined).length, 42)
eq('string vazia também devolve o lote inteiro, não zero', filtrarPais(lote, '').length, 42)
eq('amostra vazia sai como texto declarado, não como vazio', quebraEmTexto([]), '(amostra vazia)')
eq('lote sem produto pega os dois produtos da data', filtrarLote(REAL, '2026-09-28').length, 47)

// ── 5. A ordem da quebra é estável, para o texto não dançar entre rodadas ───
eq('empate ordena por nome, não por inserção', quebraPorPais([...N(2, 'd', 'p', 'us'), ...N(2, 'd', 'p', 'br')]), [['br', 2], ['us', 2]])
eq('maior primeiro quando não há empate', quebraPorPais([...N(1, 'd', 'p', 'br'), ...N(4, 'd', 'p', 'us')]), [['us', 4], ['br', 1]])

console.log(`\n🧪 AMOSTRA DE ENTREGA · ${ok} asserção(ões) passaram, ${falhas.length} falharam`)
if (falhas.length > 0) {
  for (const f of falhas) console.log(`   ❌ ${f}`)
  console.log('\nVEREDITO: REPROVADO')
  process.exit(1)
}
console.log('\nVEREDITO: APROVADO')
