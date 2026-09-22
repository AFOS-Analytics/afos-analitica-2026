#!/usr/bin/env node
/**
 * Testa `lib/us-polls/instrumento-medido.mjs` e o corte que ele faz dentro do
 * `exposicao.mjs`.
 *
 * 🔴 O DEFEITO QUE ELE GUARDA. A exposição projeta as rodadas que faltam pela
 *    CADÊNCIA da casa, e cadência não vê instrumento. Em 15/Set/2026 isso foi
 *    diagnosticado e escrito na memória; em 22/Set a mesma casa estava com três
 *    ondas seguidas medidas como NOMINAIS e a exposição ainda as cobrava,
 *    deslocando a linha interna em 0,10pp a mais e a amplitude em 0,36pp.
 *
 * ⚖️ Metade dos casos é ANTI-EXCESSO, porque o erro simétrico deste conserto é
 *    calar buraco real: a casa segue devendo tudo que é anterior à troca, e
 *    casa sem registro segue devendo tudo.
 */
import { deveRodada, INSTRUMENTO_TROCADO } from '../lib/us-polls/instrumento-medido.mjs'

let ok = 0
let mau = 0
const eq = (nome, a, b) => {
  const bate = JSON.stringify(a) === JSON.stringify(b)
  if (bate) ok++
  else {
    mau++
    console.log(`  ❌ ${nome}\n     esperado ${JSON.stringify(b)}\n     veio     ${JSON.stringify(a)}`)
  }
}

console.log('\n🔬 instrumento-medido · deveRodada\n')

const CASA = 'The Economist/YouGov'
const reg = INSTRUMENTO_TROCADO[CASA]

// ── o registro é dado declarado, com prova ─────────────────────────────────
eq('o registro existe', !!reg, true)
eq('tem data de medição', /^\d{4}-\d{2}-\d{2}$/.test(reg.medidoEm), true)
eq('tem prova em URL', /^https?:\/\//.test(reg.prova), true)
eq('tem a ressalva literal', reg.ressalva.includes('names of candidates running'), true)
eq('desde é o INÍCIO do campo da 1ª onda', reg.desde, '2026-09-04')

// ── o corte, por ONDA e não por casa ───────────────────────────────────────
eq('slot dentro da 1ª onda nominal NÃO é devido', deveRodada(CASA, '2026-09-07').deve, false)
eq('slot da 2ª onda NÃO é devido', deveRodada(CASA, '2026-09-14').deve, false)
eq('slot da 3ª onda NÃO é devido', deveRodada(CASA, '2026-09-21').deve, false)
eq('o próprio início do campo NÃO é devido', deveRodada(CASA, '2026-09-04').deve, false)

// ── ANTI-EXCESSO: o passado segue sendo cobrado ────────────────────────────
eq('véspera da troca AINDA é devida', deveRodada(CASA, '2026-09-03').deve, true)
eq('agosto AINDA é devido', deveRodada(CASA, '2026-08-31').deve, true)
eq('julho AINDA é devido', deveRodada(CASA, '2026-07-01').deve, true)

// ── ANTI-EXCESSO: casa sem registro deve tudo ──────────────────────────────
eq('casa fora do registro deve', deveRodada('Morning Consult', '2026-09-20').deve, true)
eq('casa fora do registro deve, data futura', deveRodada('Morning Consult', '2026-12-01').deve, true)
eq('casa desconhecida deve', deveRodada('Instituto Que Nao Existe', '2026-09-21').deve, true)

// ── anti-silêncio de tipo ──────────────────────────────────────────────────
eq('data ausente NÃO vira exclusão', deveRodada(CASA, null).deve, true)
eq('data vazia NÃO vira exclusão', deveRodada(CASA, '').deve, true)
eq('data undefined NÃO vira exclusão', deveRodada(CASA, undefined).deve, true)

// ── o motivo viaja junto, para a saída poder declarar ──────────────────────
const v = deveRodada(CASA, '2026-09-21')
eq('o motivo nomeia o veredito NOMINAL', /NOMINAL/.test(v.motivo), true)
eq('o motivo traz a data da medição', v.motivo.includes(reg.medidoEm), true)
eq('quem deve não carrega motivo', deveRodada(CASA, '2026-08-01').motivo, null)
eq('o registro viaja para quem não deve', v.registro === reg, true)

console.log(`\n${mau ? '❌' : '✅'} ${ok} passaram, ${mau} falharam\n`)
if (mau) process.exit(1)
