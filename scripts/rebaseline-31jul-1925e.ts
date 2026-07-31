/**
 * Rebaseline 19:25 — parte E: CORRIGE UMA AFIRMAÇÃO FALSA MINHA.
 *
 * Escrevi, em cinco campos, que "1,60% está dentro da faixa normal dele desde
 * 22/Jul". É FALSO. A série do AFOS mostra que desde 22/Jul o Caiado oscilou
 * entre 1,80% e 2,40%, então 1,60% fica ABAIXO dessa faixa, e não dentro dela.
 *
 * Eu tinha herdado a frase do painel das 17:33, onde ela era verdadeira porque
 * o preço era 1,75%, e reciclei sem reconferir depois que o preço caiu para
 * 1,60%. Série conferida: cobertura 14/Abr a 31/Jul, máximo 2,40%, mínimo
 * 0,90% em 09/Jul.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const P_AC = 'public/analysis-criteriosa.json'
const P_AD = 'public/analysis-data.json'
const P_PD = 'public/polls-data.json'
const oAc = JSON.parse(readFileSync(P_AC, 'utf-8'))
const oAd = JSON.parse(readFileSync(P_AD, 'utf-8'))
const oPd = JSON.parse(readFileSync(P_PD, 'utf-8'))

const CERTO = '1,60% é o menor valor dele desde 22/Jul e fica ABAIXO da faixa de 1,80% a 2,40% em que oscilou nesse período, mas segue bem acima do mínimo da série, 0,90%, de 09/Jul'

/** troca a FRASE inteira que começa na afirmação falsa, seja qual for a variante */
const FRASE_FALSA = /1,60% está dentro da faixa[^.]*\./g
const PARES: Array<[RegExp | string, string]> = [
  [FRASE_FALSA, `${CERTO}.`],
  ['A ressalva de série desfaz a leitura de colapso, porque ', 'A ressalva de série não desfaz a leitura de queda desta vez: '],
  ['A ressalva de série vale: ', 'A ressalva de série vale e não suaviza: '],
  ['Ou seja, não houve colapso hoje, houve devolução de um desvio.', 'Os 2,55% de 30/Jul eram desvio para cima, e o preço devolveu esse desvio e ainda perdeu o piso recente.'],
  ['então não houve colapso, houve devolução de desvio.', 'e os 2,55% de 30/Jul eram o desvio para cima, então o preço devolveu o desvio e ainda perdeu o piso recente.'],
  ['Não houve colapso, houve devolução de desvio.', 'Os 2,55% de 30/Jul eram desvio para cima, e o preço devolveu esse desvio e ainda perdeu o piso recente.'],
  ['faixa de Caiado desde 22/Jul entre 1,80% e 2,10%', 'faixa de Caiado entre 22/Jul e 30/Jul de 1,80% a 2,40%, com mínimo da série em 0,90% (09/Jul)'],
]

let n = 0
const walk = (o: any) => {
  for (const k of Object.keys(o)) {
    const v = o[k]
    if (typeof v === 'string') {
      let s = v
      for (const [a, b] of PARES) {
        if (a instanceof RegExp) { if (a.test(s)) { s = s.replace(a, b); n++ }; a.lastIndex = 0 }
        else if (s.includes(a)) { s = s.split(a).join(b); n++ }
      }
      o[k] = s
    }
    else if (v && typeof v === 'object') walk(v)
  }
}
walk(oAc); walk(oAd); walk(oPd.polymarketComparison)

const tudo = JSON.stringify({ oAc, oAd, pmc: oPd.polymarketComparison })
if (/1,60% está dentro da faixa/.test(tudo)) { console.error('❌ a afirmação falsa sobreviveu em algum campo'); process.exit(1) }
if (n === 0) { console.error('❌ nenhuma troca aplicada, os textos não bateram'); process.exit(1) }

writeFileSync(P_AC, JSON.stringify(oAc, null, 2) + '\n', 'utf-8')
writeFileSync(P_AD, JSON.stringify(oAd, null, 2) + '\n', 'utf-8')
writeFileSync(P_PD, JSON.stringify(oPd, null, 2) + '\n', 'utf-8')
console.log(`✅ afirmação sobre a faixa do Caiado corrigida em ${n} lugar(es)`)
