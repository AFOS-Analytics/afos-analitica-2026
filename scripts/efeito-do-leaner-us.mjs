#!/usr/bin/env node
/**
 * O PREÇO DA ESCOLHA "COM OU SEM LEANERS", que ninguém estava medindo.
 *
 * 🔴 POR QUE EXISTE, medido em 18/Set/2026. O índice marca com
 *    `{{efn|name="lean"}}` a linha em que os indecisos que PENDEM para um lado
 *    já foram alocados. A nota diz "With voters who lean towards a given
 *    candidate". Quando o instituto publica as duas versões, a Wikipédia lista
 *    DUAS linhas com o mesmo instituto, o mesmo campo, a mesma amostra, o mesmo
 *    recorte e a mesma margem, distinguidas só por essa nota.
 *
 * ⛔ O `limpar()` do coletor apagava o `{{efn}}` antes de qualquer leitura,
 *    então ele era ESTRUTURALMENTE CEGO à distinção e ficava com a linha que
 *    viesse primeiro no artigo. A hierarquia `LV > RV > A` não resolve nada
 *    aqui: ela ordena o RECORTE DE ELEITOR, e as duas linhas têm o mesmo.
 *
 * ⭐ É a irmã do `efeito-do-recorte-us.mjs`. Lá o preço medido é o da régua
 *    `LV > RV > A`, que é escolha declarada. Aqui o preço é de uma escolha que
 *    NÃO ERA ESCOLHA, porque ninguém sabia que estava sendo feita.
 *
 * ⛔ Este script NÃO reimplementa a janela: lê `mediaAfos.incluidas`, que é o
 *    que o coletor de fato usou. E NÃO decide nada: trocar a régua de escolha é
 *    decisão do André, e sem medida não há decisão.
 *
 * ⚠️ Saída de USO INTERNO, como a do recorte. Ela descreve a sensibilidade do
 *    NOSSO método, não o eleitorado. Publicar isso como leitura de intenção de
 *    voto seria atribuir ao mundo o que é da nossa coleta.
 *
 * Uso: node scripts/efeito-do-leaner-us.mjs [--arquivo=public/us-polls-data.json]
 */

import { readFileSync } from 'node:fs'
import { chaveDeRodada as chave, parearPorLeaner, acharServida } from '../lib/us-polls/leaner.mjs'

const caminho =
  process.argv.slice(2).find((a) => a.startsWith('--arquivo='))?.slice(10) ?? 'public/us-polls-data.json'

let a
try {
  a = JSON.parse(readFileSync(caminho, 'utf8'))
} catch (e) {
  console.error(`\n⚠️ NÃO LEU ${caminho}: ${e.message}. A medição não aconteceu.`)
  process.exit(4)
}

// 🔑 AUSENTE NÃO É "SEM LEANERS", É NÃO MEDIDO, e a diferença importa: as
//    linhas CURADAS entram por outro caminho, que não passa pelo índice e
//    portanto não tem `{{efn}}` para ler. Tratá-las como `false` inventaria uma
//    versão sem leaners que ninguém publicou, e ela poderia ser pareada com uma
//    versão com leaners de verdade, fabricando um delta.
const semCampo = a.polls.filter((p) => p.comLeaners === undefined)
const medidas = a.polls.filter((p) => p.comLeaners !== undefined)

if (medidas.length === 0) {
  console.error('\n⚠️ nenhuma linha tem o campo `comLeaners`. Regerar com parse-us-generic-ballot.mjs.')
  process.exit(4)
}


const { pares, grupos: nGrupos } = parearPorLeaner(medidas)

console.log(`\n🎚️  EFEITO DO LEANER  [USO INTERNO, nao publicar]`)
console.log(`   ${caminho} · ${a.polls.length} linhas, ${medidas.length} medidas e ${semCampo.length} sem o campo (curadas, fora do índice)`)
console.log(`   ${medidas.filter((p) => p.comLeaners).length} marcada(s) COM leaners pelo índice`)
console.log(`   ${nGrupos} combinação(ões) de instituto, campo, recorte e amostra`)
console.log(`   ${pares.length} delas publicam AS DUAS versões, com e sem leaners`)

if (pares.length > 0) {
  const abs = pares.map((p) => Math.abs(p.delta)).sort((x, y) => x - y)
  const mediana = abs[Math.floor(abs.length / 2)]
  const trocaSinal = pares.filter((p) => Math.sign(p.com.vantagemDem) !== Math.sign(p.sem.vantagemDem) && p.delta !== 0)
  console.log(`\n   |delta| mediano ${mediana.toFixed(2)}pp · máximo ${abs[abs.length - 1].toFixed(2)}pp`)
  console.log(`   trocas de SINAL: ${trocaSinal.length}`)
  console.log('\n   as maiores diferenças:')
  for (const p of [...pares].sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta)).slice(0, 8)) {
    const [inst, ini, fim, tipo] = p.k.split('|')
    console.log(
      `      ${inst.slice(0, 32).padEnd(32)} ${ini}→${fim} ${String(tipo).padEnd(3)}  sem ${sinal(p.sem.vantagemDem)}  com ${sinal(p.com.vantagemDem)}  Δ ${p.delta >= 0 ? '+' : ''}${p.delta.toFixed(2)}pp`,
    )
  }
}

// ── o que isso vale na média SERVIDA ────────────────────────────────
const media = a.mediaAfos
if (!media?.incluidas?.length) {
  console.log('\n   ⚠️ `mediaAfos.incluidas` ausente: sem ela não dá para medir a média servida.')
  process.exit(0)
}

const servidas = media.incluidas
console.log(`\n   ── na média servida, ${media.vantagemDem >= 0 ? 'D+' : 'R+'}${Math.abs(media.vantagemDem).toFixed(2)} sobre ${servidas.length} rodada(s)`)

let trocaveis = 0
const alternativas = []
for (const inc of servidas) {
  // 🕳️ `incluidas` guarda `instituto`, `campoFim`, `amostraTipo`, `dem` e
  //    `rep`, e NÃO guarda `vantagemDem`. A primeira versão deste casamento
  //    comparava `vantagemDem` contra `inc.vantagemDem`, que é `undefined`:
  //    `Number(undefined)` é `NaN`, `NaN === NaN` é falso, e o resultado foi um
  //    honesto e silencioso "0 de 10 rodadas servidas têm a outra versão",
  //    quando a primeira da lista tem. Casar por campo que não existe devolve
  //    zero, e zero se lê como medição.
  const linha = acharServida(a.polls, inc)
  if (!linha) continue
  const irma = a.polls.find((p) => chave(p) === chave(linha) && p.comLeaners !== linha.comLeaners)
  if (!irma) continue
  trocaveis++
  alternativas.push({ linha, irma, delta: Number((irma.vantagemDem - linha.vantagemDem).toFixed(2)) })
}

console.log(`      ${trocaveis} de ${servidas.length} rodada(s) servidas têm a outra versão disponível`)
if (trocaveis === 0) {
  console.log('      nenhuma troca possível hoje: a escolha não está movendo a média servida nesta leitura.')
  console.log('      ⚠️ Isso vale para HOJE. A dimensão continua existindo e sem régua declarada.')
  process.exit(0)
}

const n = servidas.length
for (const alt of alternativas) {
  const nova = (media.vantagemDem * n - alt.linha.vantagemDem + alt.irma.vantagemDem) / n
  console.log(
    `      ${alt.linha.instituto.slice(0, 32).padEnd(32)} ${alt.linha.campoFim}  ${sinal(alt.linha.vantagemDem)} → ${sinal(alt.irma.vantagemDem)}  ` +
      `média ${sinal(media.vantagemDem)} → ${sinal(Number(nova.toFixed(2)))}  (${alt.delta >= 0 ? '+' : ''}${(nova - media.vantagemDem).toFixed(2)}pp)`,
  )
}

console.log('\n   ⛔ Nenhum destes números se publica. É a sensibilidade do MÉTODO, não medição do eleitorado.')
console.log('   📌 E a régua de escolha entre as duas versões ainda NÃO EXISTE: hoje fica a que vier primeiro no artigo.')

function sinal(v) {
  return `${v >= 0 ? 'D+' : 'R+'}${Math.abs(v).toFixed(2)}`
}
