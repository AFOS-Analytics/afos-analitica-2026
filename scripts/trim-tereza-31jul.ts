/**
 * Tira a repetição que a correção do enquadramento Tereza Cristina deixou.
 *
 * O bloco VETO já diz "e o caso fechou no mesmo dia" e já fecha com o prazo de
 * 05/Ago. As frases de entrada que eu escrevi repetiam as duas coisas, e em dois
 * campos o prazo de 05/Ago aparecia duas vezes em sequência.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const erros: string[] = []
const P_AC = 'public/analysis-criteriosa.json'
const P_AD = 'public/analysis-data.json'
const P_PD = 'public/polls-data.json'
const oAc = JSON.parse(readFileSync(P_AC, 'utf-8'))
const oAd = JSON.parse(readFileSync(P_AD, 'utf-8'))
const oPd = JSON.parse(readFileSync(P_PD, 'utf-8'))

function troca(raiz: any, caminho: string, de: string, para: string, rot: string) {
  const partes = caminho.match(/[^.[\]]+/g)!
  let no = raiz
  for (const p of partes.slice(0, -1)) no = no?.[p]
  const u = partes[partes.length - 1]
  if (typeof no?.[u] !== 'string') { erros.push(`${rot}: campo inexistente`); return }
  if (!no[u].includes(de)) { erros.push(`${rot}: trecho não encontrado`); return }
  no[u] = no[u].replace(de, para)
}

const DUP_PRAZO = ' O prazo de 05/Ago para definição de vice está a menos de uma semana.'

// entradas que repetiam "o caso fechou"
troca(oAd, 'cards.sentimento.direita', 'O dia foi de arranjo de chapa e o caso fechou nele. O PP VETOU', 'O dia foi de arranjo de chapa. O PP VETOU', 'AD.direita.entrada')
troca(oAc, 'candidates[1].analise', 'O DIA DELE FOI DE ARRANJO DE CHAPA, e o caso começou e terminou nele. O PP VETOU', 'O DIA DELE FOI DE ARRANJO DE CHAPA. O PP VETOU', 'AC.c1.entrada')
troca(oAc, 'quadroComparativo[1].p', 'No arranjo de chapa, o dia começou e terminou. O PP VETOU', 'No arranjo de chapa: o PP VETOU', 'AC.q1.entrada')
troca(oPd, 'polymarketComparison.candidates[1].tendenciaPesquisa', 'O dia dele, porém, foi de arranjo de chapa e o caso fechou nele. O PP VETOU', 'O dia dele, porém, foi de arranjo de chapa. O PP VETOU', 'PD.tp.entrada')
troca(oAc, 'subtitle', 'TEREZA CRISTINA aparece em 0,55% no contrato presidencial num dia em que o assunto começou e terminou. O PP VETOU', 'TEREZA CRISTINA aparece em 0,55% no contrato presidencial. O PP VETOU', 'AC.subtitle.entrada')

// prazo de 05/Ago repetido no fecho
troca(oAd, 'cards.sentimento.direita', DUP_PRAZO, '', 'AD.direita.prazo')
troca(oAc, 'candidates[1].analise', DUP_PRAZO, '', 'AC.c1.prazo')

// gate: nenhuma das repetições pode sobreviver
const alvo = JSON.stringify({ oAc, oAd, pmc: oPd.polymarketComparison })
for (const s of ['caso fechou nele. O PP VETOU', 'terminou nele. O PP VETOU', 'começou e terminou. O PP VETOU', 'assunto começou e terminou. O PP VETOU']) {
  if (alvo.includes(s)) erros.push(`repetição sobreviveu: "${s}"`)
}
for (const [rot, txt] of [
  ['AD.direita', oAd.cards.sentimento.direita],
  ['AC.c1.analise', oAc.candidates[1].analise],
] as Array<[string, string]>) {
  const n = (txt.match(/O prazo de 05\/Ago/g) ?? []).length
  if (n !== 1) erros.push(`${rot}: "O prazo de 05/Ago" aparece ${n}x, esperado 1`)
}
if (!alvo.includes('PP VETOU')) erros.push('a moldura nova sumiu')

if (erros.length) {
  console.error('❌ ABORTADO, nada escrito:')
  erros.forEach(e => console.error('   • ' + e))
  process.exit(1)
}

writeFileSync(P_AC, JSON.stringify(oAc, null, 2) + '\n', 'utf-8')
writeFileSync(P_AD, JSON.stringify(oAd, null, 2) + '\n', 'utf-8')
writeFileSync(P_PD, JSON.stringify(oPd, null, 2) + '\n', 'utf-8')
console.log('✅ repetições removidas nos 3 arquivos pt-BR')
