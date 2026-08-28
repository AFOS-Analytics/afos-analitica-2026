/**
 * Gera `public/us-polls-data.json` a partir do generic ballot dos EUA.
 *
 * ⚠️ A LÓGICA NÃO MORA MAIS AQUI. Ela está em `lib/us-polls/collect.mjs`, que o
 * cron `/api/cron/refresh-us-polls` também usa. Duas cópias da mesma regra é o
 * defeito que já custou os rótulos de faixa do mercado em 29/Jul: elas convivem
 * sem incidente até o dia em que uma é corrigida e a outra não.
 *
 * Este script continua existindo para a rodada manual e para versionar o
 * arquivo no repositório, que é o que o painel lê quando o Neon não responde.
 *
 * Uso:  node scripts/parse-us-generic-ballot.mjs [--dias=30] [--out=arquivo]
 */

import { writeFileSync } from 'fs'
import { coletarGenericBallot } from '../lib/us-polls/collect.mjs'
import { medirAtraso, medirCadencia } from '../lib/us-polls/atraso.mjs'

const arg = (n, padrao) => {
  const m = process.argv.find((a) => a.startsWith(`--${n}=`))
  return m ? m.split('=')[1] : padrao
}

const dias = Number(arg('dias', '30'))
const saidaPath = arg('out', 'public/us-polls-data.json')

const saida = await coletarGenericBallot({ dias })
writeFileSync(saidaPath, JSON.stringify(saida, null, 2) + '\n', 'utf-8')

console.log(`✅ ${saidaPath}`)
console.log(`   ${saida.qualidade.publicadas} publicadas de ${saida.qualidade.linhasLidas} lidas · ${saida.qualidade.descartadasPorForma} descartada(s) por forma`)
if (saida.mediaAfos) {
  console.log(`   média: Dem ${saida.mediaAfos.dem}% x Rep ${saida.mediaAfos.rep}% (D+${saida.mediaAfos.vantagemDem}) sobre ${saida.mediaAfos.nPesquisas} pesquisas de ${saida.mediaAfos.nInstitutos} institutos`)
}

// ⚠️ ATRASO DA FONTE: medido e IMPRESSO, nunca gravado no arquivo.
// O `saida` acima vira `public/us-polls-data.json`, que é SERVIDO publicamente.
// O atraso é diagnóstico de operador. A regra que isto serve: nunca publicar
// frase que atribui ao MUNDO o que é propriedade da NOSSA coleta.
// Ver lib/us-polls/atraso.mjs e
// memory/feedback_descrever_o_metodo_sim_relatar_a_falha_nao.md
const at = medirAtraso(saida)
if (at.atrasoDias !== null) {
  const sinal = at.atrasoDias >= 14 ? '🔴' : at.atrasoDias >= 7 ? '⚠️' : '·'
  console.log(`   ${sinal} atraso da fonte: ${at.atrasoDias} dia(s), campo mais recente ${at.campoMaisRecente}  [USO INTERNO, nao publicar]`)
}

// ⚠️ CADÊNCIA POR CASA: mesmo regime do atraso acima. Medida, impressa e NUNCA
// gravada no arquivo, que é servido publicamente.
//
// Por que não basta o atraso global: ele mede a PONTA da base e fica verde
// assim que um lote entra, mesmo que o lote tenha pulado a rodada de uma casa.
// Em 24/Ago/2026 entraram 16 linhas de uma vez, o atraso caiu, e a onda de
// 14 a 17/Ago da The Economist/YouGov nunca entrou. Buraco no MEIO da janela
// não mexe na data mais recente, mas mexe na média.
const cad = medirCadencia(saida)
if (cad.atrasadas.length) {
  console.log(`   🔴 ${cad.atrasadas.length} casa(s) fora da própria cadência  [USO INTERNO, nao publicar]`)
  for (const c of cad.atrasadas) {
    console.log(
      `      ${c.instituto}: publica a cada ~${c.cadenciaDias}d, calada há ${c.silencioDias}d (${c.ciclosPerdidos} ciclos), último campo ${c.ultimoCampo}`,
    )
  }
  console.log('      conferir no site do instituto se a rodada existe e ficou fora do índice')
} else if (cad.avaliadas.length) {
  console.log(`   · cadência: ${cad.avaliadas.length} casa(s) avaliada(s), nenhuma fora do próprio ritmo`)
}
