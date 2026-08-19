/**
 * CORREÇÃO do painel publicado às 17:33 de 31/Jul.
 *
 * O painel enquadrou o caso Tereza Cristina como "TRÊS versões do mesmo fato,
 * em aberto". É INCOMPLETO: o assunto foi FECHADO na manhã do mesmo dia.
 *
 * Sequência verificada (O Tempo, O Globo, G1, Estadão, Valor, Veja, Gazeta do
 * Povo, CartaCapital, Metrópoles):
 *   30/Jul: Tereza confirma reunião, tema do vice levantado, nada decidido.
 *   31/Jul manhã: Flávio diz que ela aceitou na noite anterior.
 *   31/Jul, minutos depois: o PP ANUNCIA NEUTRALIDADE, consultou diretórios
 *     estaduais e decidiu NÃO convocar Convenção Nacional. Isso VETA a chapa.
 *   Tereza compartilha a nota do partido e ACATA.
 *   Flávio responde: "Respeito, mas não desisto nunca".
 *
 * ⚠️ COMO O ERRO ACONTECEU, para não repetir: havia 14 itens sobre a
 * neutralidade do PP no próprio news-cache do dia. O filtro que usei foi
 * /Tereza Cristina|Alckmin|chapa/ e não incluía "neutralidade" nem "veta",
 * então peguei as três manchetes do "ela aceitou" e perdi o desfecho.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const erros: string[] = []
const P_AC = 'public/analysis-criteriosa.json'
const P_AD = 'public/analysis-data.json'
const P_PD = 'public/polls-data.json'
const oAc = JSON.parse(readFileSync(P_AC, 'utf-8'))
const oAd = JSON.parse(readFileSync(P_AD, 'utf-8'))
const oPd = JSON.parse(readFileSync(P_PD, 'utf-8'))

const VETO = 'O PP VETOU, e o caso fechou no mesmo dia. Na manhã de 31/Jul, Flávio Bolsonaro disse que Tereza Cristina aceitara o convite para vice na noite anterior, com a ressalva de que as conversas seguiam para saber se o partido avançaria. Minutos depois, o PP anunciou NEUTRALIDADE nas eleições, informando que consultou os diretórios estaduais e decidiu não convocar Convenção Nacional, o que barra a chapa. A senadora, que lidera o PP no Senado, compartilhou a nota do partido e acatou. Flávio respondeu que respeita e que não desiste. O prazo de 05/Ago segue com a vice indefinida, agora com uma porta fechada.'

function troca(raiz: any, caminho: string, de: RegExp, para: string, rot: string) {
  const partes = caminho.match(/[^.[\]]+/g)!
  let no = raiz
  for (const p of partes.slice(0, -1)) { if (no == null) { erros.push(`${rot}: caminho quebrado`); return } no = no[p] }
  const u = partes[partes.length - 1]
  if (typeof no?.[u] !== 'string') { erros.push(`${rot}: campo inexistente ${caminho}`); return }
  if (!de.test(no[u])) { erros.push(`${rot}: trecho não encontrado em ${caminho}`); return }
  no[u] = no[u].replace(de, para)
}

// ── analysis-criteriosa ──
troca(oAc, 'subtitle',
  /TEREZA CRISTINA aparece em 0,55%[^]*?a cúpula do PP descarta\./,
  `TEREZA CRISTINA aparece em 0,55% no contrato presidencial num dia em que o assunto começou e terminou. ${VETO}`,
  'AC.subtitle')

troca(oAc, 'candidates[1].fortes[2]',
  /^Anunciou que Tereza Cristina[^]*$/,
  'Anunciou na manhã de 31/Jul que Tereza Cristina aceitara ser vice, mas o PP declarou neutralidade minutos depois e vetou a chapa; ele respondeu que respeita a decisão e que não desiste.',
  'AC.c1.fortes2')

troca(oAc, 'candidates[1].fracos[1]',
  /^A senadora Tereza Cristina não confirmou[^]*$/,
  'O PP anunciou NEUTRALIDADE nas eleições poucos minutos depois do anúncio dele, vetando a chapa, e a senadora acatou a decisão do partido publicamente.',
  'AC.c1.fracos1')

troca(oAc, 'candidates[1].fracos[2]',
  /^A cúpula do PP avalia que ela aceitou[^]*$/,
  'A cúpula do PP avalia que ela aceitou o convite justamente por saber que o partido barraria a chapa, leitura que o desfecho do mesmo dia tornou plausível.',
  'AC.c1.fracos2')

troca(oAc, 'candidates[1].analise',
  /HIS DAY|SEU DIA|HIS |O DIA DELE, porém, foi de arranjo de chapa, e há TRÊS versões do mesmo fato[^]*?não escolhe\./,
  `O DIA DELE FOI DE ARRANJO DE CHAPA, e o caso começou e terminou nele. ${VETO}`,
  'AC.c1.analise')

troca(oAc, 'candidates[3].analise',
  /TEREZA CRISTINA aparece em 0,55%[^]*?e o PP descartou\./,
  'TEREZA CRISTINA aparece em 0,55% no contrato presidencial no dia em que Flávio disse que ela aceitara ser vice e o PP, minutos depois, anunciou neutralidade e vetou a chapa, com a senadora acatando.',
  'AC.c3.analise')

troca(oAc, 'quadroComparativo[1].p',
  /Nas estaduais e no arranjo de chapa[^]*$|No arranjo de chapa[^]*$|On state races[^]*$|nas estaduais e no arranjo de chapa, o dia foi movimentado[^]*$/i,
  `No arranjo de chapa, o dia começou e terminou. ${VETO}`,
  'AC.q1.p')

troca(oAc, 'cruzamento',
  /O EIXO PARTIDÁRIO foi o do dia, e ele tem TRÊS versões do mesmo fato[^]*?não escolhe\./,
  `O EIXO PARTIDÁRIO foi o do dia. ${VETO}`,
  'AC.cruzamento')

// ── analysis-data ──
troca(oAd, 'cards.sentimento.direita',
  /O dia foi movimentado no arranjo de chapa[^]*?o painel registra as três\./,
  `O dia foi de arranjo de chapa e o caso fechou nele. ${VETO}`,
  'AD.direita')

troca(oAd, 'cards.inss.text1',
  /O dia político foi de arranjo de chapa, não de economia[^]*?o partido barraria\./,
  `O dia político foi de arranjo de chapa, não de economia. ${VETO}`,
  'AD.inss.text1')

troca(oAd, 'cards.stf.nexo',
  /Flávio Bolsonaro afirmou que Tereza Cristina aceitou[^]*?sem escolher\./,
  VETO,
  'AD.stf.nexo')

// ── polls-data ──
troca(oPd, 'polymarketComparison.candidates[1].tendenciaPesquisa',
  /O dia dele, porém, foi de arranjo de chapa e tem TRÊS versões do mesmo fato[^]*$/,
  `O dia dele, porém, foi de arranjo de chapa e o caso fechou nele. ${VETO}`,
  'PD.c1.tp')

// gate: a moldura antiga não pode sobreviver em lugar nenhum
const alvo = JSON.stringify({ oAc, oAd, pmc: oPd.polymarketComparison })
for (const s of ['TRÊS versões do mesmo fato', 'três versões do mesmo fato', 'se confirmado pelos partidos']) {
  if (alvo.includes(s)) erros.push(`moldura antiga sobreviveu: "${s}"`)
}
if (!alvo.includes('PP VETOU')) erros.push('a moldura nova não entrou em lugar nenhum')

if (erros.length) {
  console.error('❌ ABORTADO, nada escrito:')
  erros.forEach(e => console.error('   • ' + e))
  process.exit(1)
}

writeFileSync(P_AC, JSON.stringify(oAc, null, 2) + '\n', 'utf-8')
writeFileSync(P_AD, JSON.stringify(oAd, null, 2) + '\n', 'utf-8')
writeFileSync(P_PD, JSON.stringify(oPd, null, 2) + '\n', 'utf-8')
console.log('✅ enquadramento do caso Tereza Cristina corrigido nos 3 arquivos pt-BR')
