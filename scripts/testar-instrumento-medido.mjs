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
import { deveRodada, ehOutroInstrumento, motivoDoInstrumento, conferirRegistro, TIPOS, INSTRUMENTO_TROCADO } from '../lib/us-polls/instrumento-medido.mjs'

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


// ══ O TIPO DECLARADO, de 16/Out/2026 ══════════════════════════════════════
//
// 🔴 O defeito guardado aqui: o motivo era a frase SOLDADA "cédula com nomes
//    do distrito", e a terceira casa do registro, a AP-NORC, não é nominal:
//    ela pergunta qual partido o eleitor PREFERE que controle a Câmara. Sem
//    tipo, a exclusão certa sairia com o rótulo errado.
//
// ⚖️ Metade anti-silêncio (carga malformada tem de ser acusada) e metade
//    anti-excesso (entrada sem tipo NÃO pode excluir rodada).

// ── a carga do registro real ──────────────────────────────────────────────
eq('o registro real passa na conferência de carga', conferirRegistro(), [])
eq('os dois tipos estão declarados', Object.keys(TIPOS).sort(), ['NOMINAL', 'PREFERENCIA_DE_CONTROLE'])

// ── anti-silêncio: carga malformada é ACUSADA, uma causa por vez ──────────
const base = { tipo: 'NOMINAL', desde: '2026-01-01', medidoEm: '2026-01-02', ressalva: 'x', prova: 'u' }
const sem = (campo, valor) => conferirRegistro({ Casa: { ...base, [campo]: valor } })
eq('sem tipo é acusado', sem('tipo', undefined).length, 1)
eq('tipo inventado é acusado', sem('tipo', 'CHUTE').length, 1)
eq('o aviso de tipo NOMEIA o campo', /tipo/.test(sem('tipo', 'CHUTE')[0]), true)
eq('sem prova é acusado', sem('prova', '').length, 1)
eq('sem ressalva é acusado', sem('ressalva', '').length, 1)
eq('desde fora de AAAA-MM-DD é acusado', sem('desde', '01/01/2026').length, 1)
eq('medidoEm fora de AAAA-MM-DD é acusado', sem('medidoEm', '').length, 1)
eq('entrada vazia é acusada', conferirRegistro({ Casa: null }).length, 1)
eq('carga boa não acusa nada', conferirRegistro({ Casa: base }), [])

// ── anti-excesso: tipo não declarado deixa a entrada INERTE ───────────────
//    A direção do erro se escolhe pela consequência: o lado que PUBLICA é o
//    que exclui rodada por um motivo que ninguém sabe dizer.
const torto = { Casa: { ...base, tipo: 'CHUTE' } }
eq('tipo inventado NÃO exclui a rodada', deveRodada('Casa', '2026-06-01', torto).deve, true)
eq('tipo inventado não inventa motivo', deveRodada('Casa', '2026-06-01', torto).motivo, null)
eq('tipo inventado sai DECLARADO', deveRodada('Casa', '2026-06-01', torto).tipoNaoDeclarado, true)
eq('tipo inventado NÃO tira a rodada da média',
  ehOutroInstrumento({ instituto: 'Casa', campoInicio: '2026-06-01' }, torto), false)
eq('tipo declarado TIRA a rodada da média',
  ehOutroInstrumento({ instituto: 'Casa', campoInicio: '2026-06-01' }, { Casa: base }), true)

// ── o rótulo diz DE QUE a exclusão é, que é o defeito consertado ──────────
const ap = deveRodada('AP-NORC', '2026-10-08')
eq('a AP-NORC de 08/Out não deve rodada', ap.deve, false)
eq('o motivo dela NOMEIA preferência de controle', /PREFERENCIA_DE_CONTROLE/.test(ap.motivo), true)
eq('🔴 e NÃO diz que ela é nominal', /NOMINAL/.test(ap.motivo), false)
eq('o motivo dela traz a descrição do tipo', ap.motivo.includes('CONTROLAR'), true)
eq('a nominal segue dizendo NOMINAL', /NOMINAL/.test(deveRodada(CASA, '2026-09-21').motivo), true)

// ── anti-excesso: o corte segue sendo por ONDA, não por casa ──────────────
eq('AP-NORC ANTES de 08/Out segue devendo', deveRodada('AP-NORC', '2026-10-07').deve, true)
eq('casa fora do registro segue devendo', deveRodada('Casa Que Nao Existe', '2026-10-08').deve, true)

// ── o motivo estruturado carrega o tipo, para quem quiser ler sem regex ───
const mot = motivoDoInstrumento({ instituto: 'AP-NORC', campoInicio: '2026-10-08' })
eq('motivoDoInstrumento traz o tipo', mot.tipo, 'PREFERENCIA_DE_CONTROLE')
eq('motivoDoInstrumento traz a descrição', mot.descricao, TIPOS.PREFERENCIA_DE_CONTROLE)
eq('motivoDoInstrumento traz a prova', mot.prova.startsWith('https://apnorc.org/'), true)
eq('e a ressalva é a frase LITERAL da MT1', mot.ressalva.startsWith('MT1. Thinking about the outcome'), true)

console.log(`\n${mau ? '❌' : '✅'} ${ok} passaram, ${mau} falharam\n`)
if (mau) process.exit(1)
