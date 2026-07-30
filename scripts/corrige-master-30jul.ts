/**
 * CORREÇÃO do painel publicado às 17:08 de 30/Jul.
 *
 * O card do Banco Master afirma que a quinta-feira "não trouxe fato novo".
 * É FALSO. O gate de fact-check da daily, rodando depois, achou o fato do dia:
 * a Polícia Federal AVALIA pedir à Interpol a inclusão de Flávio Bolsonaro e de
 * Daniel Vorcaro na difusão prateada, para rastrear no exterior os R$ 61 milhões
 * do Banco Master que financiaram o filme "Dark Horse".
 *
 * Confirmado em O Globo (original), InfoMoney, Gazeta do Povo, Brasil 247 e
 * Revista Fórum, todos de 30/Jul.
 *
 * ⚠️ O VERBO É "AVALIA". A PF não pediu e a Interpol não decidiu. Difusão
 * PRATEADA localiza BENS; quem prende é a VERMELHA. O painel não força nenhum
 * dos dois, e o texto abaixo diz isso de forma explícita para o leitor.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const P_AD = 'public/analysis-data.json'
const erros: string[] = []
const oAd = JSON.parse(readFileSync(P_AD, 'utf-8'))

const NOVOS: Record<string, [string, string]> = {
  // caminho: [trecho que precisa existir hoje, texto novo]
  'bancoMaster.text1': [
    'A quinta-feira não trouxe fato novo no caso Master',
    'A quinta-feira trouxe o maior fato do caso Master desde a abertura do inquérito, e ele alcança diretamente a campanha. A Polícia Federal AVALIA pedir à Interpol a inclusão de Flávio Bolsonaro e de Daniel Vorcaro na chamada difusão prateada, instrumento que serve para localizar bens e recursos no exterior e que NÃO é ordem de prisão, ao contrário da difusão vermelha. O objetivo declarado é rastrear o dinheiro do filme Dark Horse, sobre a trajetória de Jair Bolsonaro, que teria recebido R$ 61 milhões do Banco Master de Vorcaro. O verbo importa e o painel não o força: a PF AVALIA, não pediu, e a Interpol não decidiu nada (O Globo, InfoMoney, Gazeta do Povo, 30/Jul). A medida se apoia no inquérito aberto em 23/Jul por André Mendonça e, segundo as reportagens, foi motivada por áudio divulgado pelo The Intercept Brasil em que o filho de Jair Bolsonaro cobra de Vorcaro recursos destinados ao filme.',
  ],
  'bancoMaster.conclusao': [
    'As três frentes do caso Master seguem em trilhos separados',
    'As três frentes do caso Master seguem em trilhos separados e não devem ser somadas, mas nesta quinta a criminal alcançou a campanha. A PF AVALIA pedir à Interpol a inclusão de Flávio Bolsonaro e de Vorcaro na difusão prateada para rastrear no exterior o dinheiro do filme Dark Horse, e deputados do PT acionaram a PF para investigar suposto favorecimento de Flávio ao banco de Vorcaro (O Globo, 30/Jul). A patrimonial segue na Justiça do Rio, com bloqueios, e a legislativa segue parada há mais de quatro meses no gabinete de Kassio Nunes Marques. O único mercado que toca o caso, o de impeachment de ministro do STF, recuou 0,25pp e está em 3,10%, num book de USD 83 mil que não sustenta leitura de reprecificação de risco em nenhuma direção, e que nesta quinta andou na direção OPOSTA à do acúmulo institucional.',
  ],
  'stf.mendonca': [
    'Nenhum ato novo nesta quinta.',
    'Segue como relator do inquérito aberto em 23/Jul sobre os repasses de Vorcaro para o filme sobre Jair Bolsonaro, e é esse inquérito que sustenta o fato do dia: a Polícia Federal AVALIA pedir à Interpol a inclusão de Flávio Bolsonaro e de Daniel Vorcaro na difusão prateada, que localiza bens no exterior e não é ordem de prisão. A PF avalia, não pediu, e a Interpol não decidiu (O Globo, InfoMoney, Gazeta do Povo, 30/Jul). Sobre o rastreamento patrimonial já autorizado, os dois acertos de registro continuam valendo: a decisão foi assinada em MAIO e só se tornou pública em 28/Jul, e a apuração deixou de ser fonte única a partir de 29/Jul.',
  ],
}

for (const [cam, [ancora, novo]] of Object.entries(NOVOS)) {
  const [card, campo] = cam.split('.')
  const atual = oAd.cards?.[card]?.[campo]
  if (typeof atual !== 'string') { erros.push(`caminho inexistente: cards.${cam}`); continue }
  if (!atual.includes(ancora)) { erros.push(`âncora não encontrada em cards.${cam}: "${ancora.slice(0, 50)}…"`); continue }
  oAd.cards[card][campo] = novo
}

// trava: o texto corrigido NÃO pode dizer que a PF pediu, nem citar difusão vermelha como se fosse o caso
const PROIBIDO = ['PF pediu à Interpol', 'PF solicitou', 'incluiu Flávio', 'difusão vermelha contra', 'mandado de prisão']
const alvo = JSON.stringify(oAd.cards)
for (const p of PROIBIDO) if (alvo.includes(p)) erros.push(`verbo forçado: "${p}"`)

if (erros.length) {
  console.error('❌ ABORTADO, nada foi escrito:')
  for (const e of erros) console.error('   • ' + e)
  process.exit(1)
}

writeFileSync(P_AD, JSON.stringify(oAd, null, 2) + '\n', 'utf-8')
console.log('✅ 3 campos corrigidos: bancoMaster.text1, bancoMaster.conclusao, stf.mendonca')
