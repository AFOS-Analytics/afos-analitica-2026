#!/usr/bin/env node
/**
 * PRÉ-CHECK DO WAYBACK — sonda o /save/ UMA vez e GRAVA o bloqueio no ledger.
 *
 * 🔴 POR QUE EXISTE, medido em 26/Set/2026. O veredito da pausa
 *    (`vereditoDaPausa`, em wayback-prioridade.mjs) só conta linhas do ledger
 *    com `abortou: true`. Uma rodada que aborta grava a sua; um PRÉ-CHECK que
 *    devolve 429 não grava nada. Em 15/Set e 21/Set a linha foi escrita à MÃO,
 *    e em 26/Set o pré-check voltou 429 de novo: sem a linha, a próxima sessão
 *    leria "Pausa CUMPRIDA" e sondaria um host que acabou de recusar. Regra que
 *    depende de número que ninguém grava é regra que não roda.
 *
 * 🔑 A sonda é o MESMO pedido que o arquivador faz (`archiveOnce` em
 *    wayback-archive.ts): GET, redirect follow, User-Agent do arquivador. A ficha
 *    registra que curl, raiz e fetch do Node deram três respostas no mesmo minuto
 *    e que só o fetch do Node previu o que a rodada encontraria.
 *
 * ⛔ Ele RECUSA sondar se a pausa ainda não foi cumprida: cada sondagem é uma
 *    requisição contra quem recusa. `--forcar` existe, e não deveria ser usado.
 *
 * Saída: 0 pode rodar · 2 bloqueado (gravado no ledger) · 3 pausa em curso, não sondou
 *
 *   node scripts/wayback-precheck.mjs
 *   node scripts/wayback-precheck.mjs --sem-registro   # sonda e não grava
 */
import { appendFileSync } from 'node:fs'
import { PAUSA_DIAS, vereditoDaPausa } from './wayback-prioridade.mjs'

const LEDGER = 'data/wayback/rodadas.jsonl'
const ALVO = 'https://web.archive.org/save/https://example.com'
const argv = process.argv.slice(2)

// ⚠️ process.exit() com o socket do fetch ainda aberto derruba o Node 25 no Windows
//    (assertion em src\win\async.c) e o código de saída se perde: sai por exitCode.
const fim = (codigo) => { process.exitCode = codigo }

async function principal() {
const veredito = vereditoDaPausa(Date.now())
console.log(`\n🕰️ PRÉ-CHECK DO WAYBACK · pausa de ${PAUSA_DIAS} dia(s)`)
console.log(`   ${veredito.split('\n')[0]}`)
if (veredito.startsWith('⛔') && !argv.includes('--forcar')) {
  console.log('   ⛔ Não sondei. Esperar a pausa é a régua, e sondar agora aprofunda o bloqueio.')
  return fim(3)
}

let status = null
let erro = null
try {
  const r = await fetch(ALVO, {
    method: 'GET',
    redirect: 'follow',
    headers: { 'User-Agent': 'AFOS-Analytics-Wayback-Archiver/1.0' },
    signal: AbortSignal.timeout(45_000),
  })
  status = r.status
} catch (e) {
  erro = String(e?.cause?.code ?? e?.name ?? e)
}

const leitura = status ?? `000 (${erro})`
console.log(`   /save/ com o fetch do arquivador: ${leitura}`)

if (status && status >= 200 && status < 400) {
  console.log('   ✅ PODE RODAR: uma rodada só, da data mais antiga que o wayback-prioridade apontar.')
  console.log('      O disjuntor da rodada é quem protege de verdade; este 200 não garante o resto.')
  return fim(0)
}

console.log('   ⛔ BLOQUEADO: não rodar e não insistir. Avisar o André no começo da sessão.')
if (argv.includes('--sem-registro')) {
  console.log('   (--sem-registro: nada gravado, e a próxima sessão NÃO vai saber deste bloqueio)')
  return fim(2)
}
const linha = {
  quando: new Date().toISOString(),
  urls: 0,
  ok: 0,
  fail: 0,
  abortou: true,
  resolvidas: 0,
  fonte: `PRE-CHECK, nao rodada: fetch do Node no /save/ devolveu ${leitura}, gravado pelo wayback-precheck.mjs. Sem daily de proposito, porque nenhuma URL foi submetida. Registrado para o veredito da pausa nao dizer amanha que ela esta cumprida.`,
}
appendFileSync(LEDGER, JSON.stringify(linha) + '\n')
console.log(`   📓 gravado em ${LEDGER}: a pausa de ${PAUSA_DIAS} dia(s) passa a contar de agora.`)
return fim(2)
}

await principal()
