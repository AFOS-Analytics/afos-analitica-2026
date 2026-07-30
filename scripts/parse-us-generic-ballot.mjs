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
