/**
 * /atualizar 31/Jul/2026, captura 17:33 BRT (20:33 UTC).
 *
 * TRAVA REPROVADA NAS DUAS RODADAS. Aplicada a regra de 29/Jul: FIRME o que
 * repetiu, FAIXA o que divergiu. Único book divergente: MDB no Senado, que
 * oscilou 26,35 -> 26,60 -> 25,20. O presidencial inteiro repetiu nas 4 leituras.
 *
 * ESCRITA ATÔMICA: nada vai a disco antes de todas as asserções passarem.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const P_AC = 'public/analysis-criteriosa.json'
const P_AD = 'public/analysis-data.json'
const P_PD = 'public/polls-data.json'
const P_CS = 'app/components/CandidatesSection.tsx'

const HORA = '31/07/2026, 17:33'
const erros: string[] = []

const oAc = JSON.parse(readFileSync(P_AC, 'utf-8'))
const oAd = JSON.parse(readFileSync(P_AD, 'utf-8'))
const oPd = JSON.parse(readFileSync(P_PD, 'utf-8'))
let sCs = readFileSync(P_CS, 'utf-8')

function set(raiz: any, caminho: string, valor: any, rotulo: string) {
  const partes = caminho.split('.')
  let no = raiz
  for (const p of partes.slice(0, -1)) {
    if (no == null || !(p in no)) { erros.push(`${rotulo}: caminho inexistente "${caminho}" (parou em "${p}")`); return }
    no = no[p]
  }
  const ult = partes[partes.length - 1]
  if (no == null || !(ult in no)) { erros.push(`${rotulo}: campo final inexistente "${caminho}"`); return }
  no[ult] = valor
}

// ───────────────────────── blocos reaproveitados ─────────────────────────

const VOX = 'Vox Brasil de 31/Jul (n=2.100, campo 26 a 28/Jul, margem de 2,15pp, 95% de confiança, BR-01084/2026)'

const TRAVA = 'A trava de dupla leitura reprovou as DUAS rodadas de hoje, e por isso vale a regra de faixa. O que repetiu entra FIRME e o que divergiu entra como FAIXA declarada. Divergiu um book só, o do MDB no Senado, que oscilou entre 25,20% e 26,60% em três leituras. O contrato presidencial inteiro repetiu nas QUATRO leituras, então o dado principal do painel está firme.'

const RENAN3 = 'TRÊS institutos seguidos cortaram Renan Santos, e é a sequência que importa, não o número isolado: AtlasIntel 7,8% em 29/Jul, PoderData 4% em 30/Jul e Vox Brasil 3,0% em 31/Jul. Com o preço em 8,15%, a distância entre mercado e urna vai a 5,15pp, a maior do recorte. Em 29/Jul o painel registrou essa distância em 0,90pp e chamou de convergência. Três institutos depois, ela quadruplicou.'

// ───────────────────────────── analysis-criteriosa ─────────────────────────────

set(oAc, 'updatedAt', HORA, 'AC')

set(oAc, 'subtitle',
`ATUALIZAÇÃO 31/Jul 17:33 BRT, a 65 dias do 1º turno. LULA NÃO SE MEXEU E O RESTO DO TABULEIRO SE MEXEU MUITO. O favorito segue em 63,50% pelo segundo dia, e o gap sobre Flávio, que subiu 0,35pp para 24,30%, recua de +39,55pp para +39,20pp. A URNA DO DIA: ${VOX} dá Lula 40,5% x Flávio 31,2% no 1º turno, com Caiado 5,5%, Zema 3,2% e Renan Santos 3,0%, e Lula 47,5% x Flávio 41,1% no returno. São 9,3pp de gap no 1º turno e 6,4pp no returno. O ACHADO É RENAN SANTOS, e ele é de sequência. ${RENAN3} E há uma contradição DENTRO do próprio mercado que o painel registra sem resolver: no mesmo dia em que o contrato de vencedor dele cede 0,30pp, o book de 2º lugar do 1º turno SOBE 3,25pp, de 6,10% para 9,35%. CAIADO DEVOLVEU TUDO: caiu 0,80pp e voltou a 1,75%, desfazendo em um pregão a alta de dois dias, e a série do AFOS mostra que 1,75% é a faixa normal dele desde 22/Jul, enquanto os 2,55% de ontem é que eram o desvio. No mesmo dia, a Vox lhe dá 5,5%, a melhor urna nacional dele no recorte. DOIS NOMES DO CAMPO DO LULA SUBIRAM JUNTOS: Camilo Santana foi a 2,20% e Geraldo Alckmin a 1,10%, no dia em que o PCdoB formalizou apoio à chapa Lula-Alckmin. Sobre o Camilo, a ressalva de série é obrigatória e desfaz a leitura fácil: 2,20% NÃO é recorde dele, o máximo da série é 4,10%, de 03/Mai, e o que houve foi recuperação do MÍNIMO histórico, que era 0,50% e foi marcado ontem. TEREZA CRISTINA aparece em 0,55% no contrato presidencial no dia em que Flávio Bolsonaro diz que ela aceitou ser vice dele, ela mesma diz que conversou e que a chapa depende do PL e do PP-União, e a cúpula do PP descarta. Volume total acumulado no presidencial em USD 117,03M. Cruzamento com Polymarket ao vivo 31/Jul 20:33 UTC. ${TRAVA}`,
  'AC.subtitle')

set(oAc, 'quadroComparativo.0.p',
`URNA NOVA: ${VOX} dá 40,5% no 1º turno e 47,5% x 41,1% no returno, gap de 6,4pp que fica fora da margem somada e por isso não é empate técnico. Na semana, três casas mediram o gap do 1º turno em 9,1pp (AtlasIntel), 6pp (PoderData) e 9,3pp (Vox), o que coloca a PoderData como a fora da curva e não a Vox. O instituto registra ainda que, entre maio e julho, Lula cresceu 7,3pp e Flávio recuou 2,7pp na série da própria casa, invertendo uma vantagem que era do senador. O painel reproduz essa comparação como afirmação do instituto, porque é série interna dele.`,
  'AC.q0.p')
set(oAc, 'quadroComparativo.0.m', '63,50% (vol USD 7,77M acumulado)', 'AC.q0.m')
set(oAc, 'quadroComparativo.0.t',
'ESTÁVEL em 63,50% pelo segundo pregão seguido, mantendo o valor que iguala o topo da série do AFOS. O gap sobre Flávio recuou de +39,55pp para +39,20pp, e recuou por movimento do adversário, não dele. Segundo dia consecutivo sem mudança no contrato de vencedor, o que é raro numa semana em que o resto do book se mexeu bastante.',
  'AC.q0.t')
set(oAc, 'quadroComparativo.0.s',
'65 dias da eleição. A urna nova amplia o gap contra o que a PoderData mediu na véspera, e o preço não reagiu a nenhuma das duas. O painel registra a estabilidade do preço diante de duas leituras de urna que discordam entre si em 3,3pp no mesmo recorte semanal. Polymarket ao vivo 31/Jul 20:33 UTC.',
  'AC.q0.s')

set(oAc, 'quadroComparativo.1.p',
'Vox Brasil de 31/Jul: 31,2% no 1º turno e 41,1% no returno contra 47,5% de Lula. A diferença de 6,4pp no returno fica fora da margem somada, então esta leitura NÃO descreve empate técnico, ao contrário da PoderData da véspera, que dava 3pp. Nas estaduais e no arranjo de chapa, o dia foi movimentado: ele afirmou que Tereza Cristina aceitou ser vice, a senadora disse que conversou e que a decisão depende do PL e do PP-União, e a cúpula do PP avalia que ela aceitou sabendo que o partido barraria.',
  'AC.q1.p')
set(oAc, 'quadroComparativo.1.m', '24,30% (vol USD 7,76M acumulado)', 'AC.q1.m')
set(oAc, 'quadroComparativo.1.t',
'SOBE 0,35pp para 24,30% e estreita o gap, que vai de +39,55pp para +39,20pp. Nos sub-mercados o sinal é cruzado: CAI 1,00pp no 2º lugar do 1º turno, para 78,00%, e CAI 0,60pp no 3º lugar, para 5,65%. Ou seja, sobe na chance de ganhar e cede nas duas de colocação.',
  'AC.q1.t')
set(oAc, 'quadroComparativo.1.s',
'Subir no vencedor e cair no 2º lugar ao mesmo tempo é combinação incomum e o painel registra sem explicar. A contrapartida da queda dele no book de 2º lugar é a alta de 3,25pp de Renan Santos no mesmo contrato, o que sugere realocação dentro daquele book e não leitura nova sobre o returno.',
  'AC.q1.s')

set(oAc, 'quadroComparativo.2.p',
'A Vox dá 3,0% e fecha a sequência: TRÊS institutos seguidos o cortaram, de 7,8% na AtlasIntel de 29/Jul para 4% na PoderData de 30/Jul e 3,0% agora. Com preço em 8,15%, a distância entre mercado e urna chega a 5,15pp, a maior do recorte. A dispersão entre institutos, que o painel vinha registrando, deixou de ser dispersão e virou tendência de queda: as três leituras mais recentes são também as três mais baixas.',
  'AC.q2.p')
set(oAc, 'quadroComparativo.2.m', '8,15% (vol USD 8,63M acumulado)', 'AC.q2.m')
set(oAc, 'quadroComparativo.2.t',
'CAI 0,30pp no vencedor, para 8,15%, mas o movimento do dia é o oposto no book de colocação: SOBE 3,25pp no 2º lugar do 1º turno, de 6,10% para 9,35%, recuperando dois terços do que perdera na véspera, e fica ESTÁVEL em 62,00% no 3º lugar. O mercado desfez parte da reclassificação que fizera ontem.',
  'AC.q2.t')
set(oAc, 'quadroComparativo.2.s',
'É a contradição do dia e ela é interna ao próprio mercado: a urna o corta pelo terceiro instituto seguido enquanto o dinheiro devolve a ele parte da chance de returno que tinha retirado 24 horas antes. O painel registra as duas direções e não arbitra qual está certa.',
  'AC.q2.s')

set(oAc, 'quadroComparativo.3.p',
'A Vox dá 5,5%, a melhor urna nacional dele no recorte, acima dos 5% da PoderData e bem acima dos 3,1% da AtlasIntel. E o mercado fez o contrário no mesmo dia. A divergência sobre ele segue aberta em quatro níveis no mês: 6% na Nexus, 5,5% na Vox, 5% na PoderData e 3,1% na AtlasIntel.',
  'AC.q3.p')
set(oAc, 'quadroComparativo.3.m', '1,75% (vol USD 5,22M)', 'AC.q3.m')
set(oAc, 'quadroComparativo.3.t',
'CAI 0,80pp para 1,75% e DEVOLVE em um pregão toda a alta de dois dias. A ressalva de série desfaz a leitura de colapso: 1,75% está dentro da faixa normal dele desde 22/Jul, quando a série registrou 1,80%, e os 2,55% de ontem é que eram o desvio. No 3º lugar do 1º turno ele SOBE 1,00pp, para 26,50%, o que torna o sinal cruzado.',
  'AC.q3.t')
set(oAc, 'quadroComparativo.3.s',
'Sobe na urna e cai no preço de vencedor, no mesmo dia, e ainda sobe no book de terceiro colocado. Três sinais, duas direções. A leitura honesta é que o mercado o realocou de candidato a vencedor para candidato a terceiro lugar, e que a urna não acompanhou essa realocação.',
  'AC.q3.s')

set(oAc, 'quadroComparativo.4.p',
'Vox Brasil de 31/Jul: 3,2% no 1º turno, praticamente o mesmo dos 3% da PoderData e acima dos 2,8% da AtlasIntel. O dia foi ruim no arranjo partidário: Marcelo Aro deixou a chapa dele ao Senado para disputar o governo de Minas Gerais, movimento que Zema chamou publicamente de traição, e o Novo descartou Barbosa como vice, caminhando para uma chapa puro-sangue. O prazo de 05/Ago para definição de vice está a menos de uma semana.',
  'AC.q4.p')
set(oAc, 'quadroComparativo.4.m', '0,45% (vol USD 4,58M)', 'AC.q4.m')
set(oAc, 'quadroComparativo.4.t',
'CAI 0,10pp para 0,45% e fica em 4,45% no 3º lugar do 1º turno. Terceiro pregão seguido de queda no contrato de vencedor.',
  'AC.q4.t')
set(oAc, 'quadroComparativo.4.s',
'A urna o mantém estável em torno de 3% enquanto o preço cede pelo terceiro dia. Ressalva de série, e ela é grande: o máximo dele na série do AFOS é 10,10%, de 26/Abr, então 0,45% é menos de um vigésimo daquele nível e movimentos de 0,10pp nessa faixa têm valor informativo quase nulo.',
  'AC.q4.s')

set(oAc, 'quadroComparativo.5.p', 'Sem pesquisa. Mercado de impeachment de ministro do STF antes de 2027.', 'AC.q5.p')
set(oAc, 'quadroComparativo.5.m', '3,10% (vol USD 83 mil)', 'AC.q5.m')
set(oAc, 'quadroComparativo.5.t',
'ESTÁVEL em 3,10% pelo segundo pregão, sem nenhuma variação nas quatro leituras da trava de hoje.',
  'AC.q5.t')
set(oAc, 'quadroComparativo.5.s',
'Dia sem fato institucional novo no eixo do STF, e o preço acompanhou a ausência. Com USD 83 mil de volume acumulado contra USD 117,03M do presidencial, este book só é registrável quando se move de forma sustentada, e hoje ele não se moveu.',
  'AC.q5.s')

// candidatos
set(oAc, 'candidates.0.header',
`Polymarket 63,50% (estável, vol USD 7,77M acumulado) pelo segundo pregão seguido, a 65 dias da eleição. O gap sobre Flávio recua para +39,20pp por movimento do adversário. A urna do dia, ${VOX}, dá 40,5% no 1º turno e 47,5% x 41,1% no returno.`,
  'AC.c0.header')
set(oAc, 'candidates.0.analise',
`O dia dele é o de quem não se moveu enquanto o resto do tabuleiro se movia. O contrato de vencedor ficou em 63,50% pelo segundo pregão seguido, mantendo o valor que iguala o topo da série do AFOS, e o gap recuou para +39,20pp porque Flávio subiu, não porque ele caiu. A URNA. ${VOX} dá 40,5% x 31,2% no 1º turno e 47,5% x 41,1% no returno. A vantagem de 6,4pp no returno fica FORA da margem somada das duas pontas, então esta leitura não descreve empate técnico, ao contrário da PoderData de 30/Jul, que dava 3pp. E aqui está o registro que organiza a semana: TRÊS casas mediram o gap do 1º turno em 9,1pp (AtlasIntel, 29/Jul), 6pp (PoderData, 30/Jul) e 9,3pp (Vox, 31/Jul). Duas delas concordam em torno de 9pp e uma destoa, e a que destoa é a PoderData. O painel registra isso sem descartar nenhuma. O instituto informa ainda que, entre maio e julho, Lula cresceu 7,3pp e Flávio recuou 2,7pp na série da própria casa, invertendo uma vantagem que era do senador; reproduzimos como afirmação do instituto, porque é comparação interna dele e não conferimos a série. DOIS NOMES DO CAMPO DELE SUBIRAM NO MERCADO no mesmo dia, Camilo Santana a 2,20% e Geraldo Alckmin a 1,10%, e o PCdoB formalizou apoio à chapa Lula-Alckmin. O painel registra a coincidência e não afirma causa. Sobre Camilo, a ressalva de série é obrigatória e desfaz a leitura fácil: 2,20% NÃO é recorde dele, o máximo da série é 4,10%, de 03/Mai, e o que houve foi recuperação do MÍNIMO histórico, 0,50%, marcado ontem mesmo.`,
  'AC.c0.analise')

set(oAc, 'candidates.1.header',
'Polymarket 24,30% (alta 0,35pp, vol USD 7,76M acumulado). Estreita o gap para +39,20pp, mas CAI nos dois books de colocação: 1,00pp no 2º lugar do 1º turno, para 78,00%, e 0,60pp no 3º lugar, para 5,65%. A Vox Brasil o dá em 31,2% no 1º turno e 41,1% no returno.',
  'AC.c1.header')
set(oAc, 'candidates.1.analise',
'O sinal dele hoje é cruzado e vale registrar assim, sem resolver. SOBE 0,35pp no contrato de vencedor, para 24,30%, e é ele quem estreita o gap, que vai de +39,55pp para +39,20pp. E ao mesmo tempo CAI 1,00pp no book de 2º lugar do 1º turno, para 78,00% (vol USD 216 mil), e CAI 0,60pp no de 3º lugar, para 5,65%. Subir na chance de ganhar e ceder nas duas de colocação é combinação incomum. A contrapartida da queda no book de 2º lugar é a alta de 3,25pp de Renan Santos no mesmo contrato, o que sugere realocação interna daquele book e não leitura nova sobre quem vai ao returno. NA URNA, a Vox o traz em 31,2% no 1º turno e 41,1% no returno, e os 6,4pp que o separam de Lula ficam fora da margem somada, o que afasta a leitura de empate técnico que a PoderData sustentava na véspera. O DIA DELE, porém, foi de arranjo de chapa, e há TRÊS versões do mesmo fato. Ele afirmou que Tereza Cristina aceitou ser vice na chapa dele. A senadora disse que houve conversa e que a decisão depende do PL e do PP-União. E a cúpula do PP avalia que ela aceitou justamente por saber que o partido barraria. O painel registra as três e não escolhe. No mercado, Tereza Cristina aparece em 0,55% no contrato PRESIDENCIAL, e a distinção importa: aquele contrato mede quem ganha a Presidência, não quem ocupa a vaga de vice, então o movimento é de nome em circulação e não de cargo. O prazo de 05/Ago para definição de vice está a menos de uma semana.',
  'AC.c1.analise')

set(oAc, 'candidates.2.header',
'Polymarket 8,15% no vencedor (queda 0,30pp, vol USD 8,63M acumulado). TRÊS institutos seguidos o cortaram, de 7,8% para 4% e agora 3,0% na Vox, e a distância entre preço e urna vai a 5,15pp, a maior do recorte. Mas o book de 2º lugar do 1º turno SOBE 3,25pp, para 9,35%, contradizendo a urna no mesmo dia.',
  'AC.c2.header')
set(oAc, 'candidates.2.analise',
`Este é o verbete do dia e ele tem duas partes que apontam para lados opostos. A PRIMEIRA é a urna, e ela é uma sequência, não um número isolado. ${RENAN3} Em 29/Jul este painel escreveu que a distância tinha caído a 0,90pp e chamou aquilo de convergência, sublinhando que o estreitamento vinha pelo lado da urna. Três institutos depois, a distância quadruplicou. Fica registrado que a leitura de 29/Jul não se sustentou, e que a dispersão que o painel vinha chamando de dispersão virou outra coisa: as três leituras mais recentes são também as três mais baixas do recorte, o que descreve tendência de queda e não ruído entre casas. A SEGUNDA parte é o mercado, e ele contradisse a si mesmo. No contrato de vencedor ele cedeu 0,30pp, para 8,15%. No book de 2º lugar do 1º turno, porém, SUBIU 3,25pp, de 6,10% para 9,35% (vol USD 1,09M), recuperando dois terços do que havia perdido 24 horas antes. E ficou ESTÁVEL em 62,00% no 3º lugar (vol USD 164 mil). Ontem o painel escreveu que o dinheiro o havia reclassificado, tirando dele a chance de returno e cravando-o em terceiro. Hoje o mesmo dinheiro devolveu boa parte dessa chance, no dia em que a urna o cortou pela terceira vez seguida. O painel registra as duas direções e não arbitra qual está certa, porque não tem como. Ele mantém o maior volume acumulado entre os nomes competitivos do presidencial, USD 8,63M, acima de Lula e de Flávio.`,
  'AC.c2.analise')

set(oAc, 'candidates.3.header',
'Polymarket: Caiado 1,75% (queda 0,80pp, vol USD 5,22M), Camilo Santana 2,20% (vol USD 4,16M), Alckmin 1,10% (vol USD 4,98M), Jair 0,95%, Tereza Cristina 0,55%, Zema 0,45% (queda 0,10pp), Haddad 0,30% (alta 0,15pp). Na urna, a Vox dá a Caiado 5,5%, a melhor leitura nacional dele no recorte.',
  'AC.c3.header')
set(oAc, 'candidates.3.subtitle',
'31/Jul, a 65 dias: o pelotão teve o dia mais movimentado da semana, e nenhum dos movimentos aponta na mesma direção. Caiado devolveu em um pregão a alta de dois dias no mesmo dia em que recebeu a melhor urna do recorte. Camilo Santana e Alckmin subiram juntos, no dia do apoio formal do PCdoB à chapa Lula-Alckmin. Zema caiu pelo terceiro pregão seguido, num dia em que perdeu o cabeça de chapa ao Senado em Minas.',
  'AC.c3.subtitle')
set(oAc, 'candidates.3.caiado.label',
'CAIADO (PSD), Poly presidencial 1,75% (queda 0,80pp, vol USD 5,22M) | 3º lugar do 1º turno 26,50% (alta 1,00pp, vol USD 37 mil) | 2º lugar 0,90% | candidato oficializado em 26/Jul, com Kassab de vice | última nacional: Vox Brasil 31/Jul, 1T 5,5%',
  'AC.c3.caiado.label')
set(oAc, 'candidates.3.caiado.fortes',
'A urna do dia é a MELHOR leitura nacional dele no recorte. A Vox Brasil lhe dá 5,5% no 1º turno, acima dos 5% da PoderData de 30/Jul e bem acima dos 3,1% da AtlasIntel de 29/Jul. E o book de 3º lugar do 1º turno acompanhou: SOBE 1,00pp, para 26,50%, a maior marca dele naquele contrato no acompanhamento do painel. A divergência entre institutos sobre ele segue aberta em QUATRO níveis dentro do mesmo mês, 6% na Nexus, 5,5% na Vox, 5% na PoderData e 3,1% na AtlasIntel, e a leitura de hoje é a mais alta das quatro.',
  'AC.c3.caiado.fortes')
set(oAc, 'candidates.3.caiado.fracos',
'O contrato de vencedor CAIU 0,80pp, para 1,75%, e devolveu em um único pregão toda a alta acumulada em dois dias. A ressalva de série é obrigatória e ela corta para os dois lados: 1,75% está dentro da faixa normal dele desde 22/Jul, quando a série do AFOS registrou 1,80%, e os 2,55% de ontem é que eram o desvio para cima. Ou seja, não houve colapso hoje, houve devolução de um desvio. O que fica é a leitura de que o mercado o realocou de candidato a vencedor para candidato a terceiro colocado, subindo no book de colocação e caindo no de vitória, e que a urna não acompanhou essa realocação: ela lhe deu justamente hoje a melhor marca do recorte.',
  'AC.c3.caiado.fracos')
set(oAc, 'candidates.3.haddad.label',
'HADDAD (PT), Poly presidencial 0,30% (alta 0,15pp) | 2º lugar do 1º turno 1,00% | não testado pela Vox Brasil em nenhum cenário, porque disputa o governo de São Paulo',
  'AC.c3.haddad.label')
set(oAc, 'candidates.3.haddad.fortes',
'SOBE 0,15pp no contrato de vencedor, para 0,30%, dobrando o valor da véspera, e vai a 1,00% no book de 2º lugar do 1º turno. É o segundo pregão seguido de alta no book de colocação.',
  'AC.c3.haddad.fortes')
set(oAc, 'candidates.3.haddad.fracos',
'A Vox Brasil não o testa em nenhum cenário, nem de 1º turno nem de returno, então ele não tem urna nova nesta rodada, e ausência de teste numa nacional é informação que o painel registra em vez de repetir o dado da véspera como se fosse novo. O agravante de leitura permanece e precisa ser dito com clareza: ele NÃO é candidato à Presidência, disputa o governo de São Paulo, e o cenário que o favorece nas pesquisas é hipótese e não candidatura em curso. Num preço de 0,30%, uma alta de 0,15pp tem valor informativo quase nulo.',
  'AC.c3.haddad.fracos')
set(oAc, 'candidates.3.zema.label',
'ZEMA (Novo), Poly presidencial 0,45% (queda 0,10pp, vol USD 4,58M) | 3º lugar do 1º turno 4,45% | Vox Brasil 31/Jul: 1T 3,2% | oficializado pelo Novo em 27/Jul, ainda SEM vice, prazo até 05/Ago',
  'AC.c3.zema.label')
set(oAc, 'candidates.3.zema.fortes',
'Na urna ele fica estável: os 3,2% da Vox são praticamente os mesmos 3% da PoderData de 30/Jul e ficam acima dos 2,8% da AtlasIntel de 29/Jul. Mantém 4,45% no book de 3º lugar do 1º turno, à frente de todo o pelotão exceto Caiado, e segue oficializado pelo Novo desde 27/Jul.',
  'AC.c3.zema.fortes')
set(oAc, 'candidates.3.zema.fracos',
'CAI 0,10pp no contrato de vencedor, para 0,45%, no TERCEIRO pregão seguido de queda. E o dia foi ruim no arranjo partidário: Marcelo Aro deixou a chapa dele ao Senado para disputar o governo de Minas Gerais, movimento que Zema chamou publicamente de traição, e o Novo descartou Barbosa como vice, caminhando para uma chapa puro-sangue. Segue SEM vice definida, com o prazo de 05/Ago a menos de uma semana. Ressalva de série, e ela é grande: o máximo dele na série do AFOS é 10,10%, de 26/Abr, então 0,45% é menos de um vigésimo daquele nível e movimentos de 0,10pp nessa faixa têm valor informativo quase nulo.',
  'AC.c3.zema.fracos')
set(oAc, 'candidates.3.analise',
'O pelotão teve o dia mais movimentado da semana e nenhum dos movimentos aponta na mesma direção. CAIADO caiu 0,80pp no vencedor, para 1,75%, devolvendo em um pregão a alta de dois dias, e SUBIU 1,00pp no 3º lugar, para 26,50%, no mesmo dia em que a Vox lhe deu 5,5%, a melhor urna nacional dele no recorte. Três sinais, duas direções. A leitura que se sustenta é que o mercado o realocou de candidato a vencedor para candidato a terceiro colocado, e que a urna não acompanhou. CAMILO SANTANA subiu a 2,20% e GERALDO ALCKMIN a 1,10%, os dois no dia em que o PCdoB formalizou apoio à chapa Lula-Alckmin, e o painel registra a coincidência sem afirmar causa. Sobre Camilo cabe a ressalva de série, que desfaz a leitura fácil: 2,20% não é recorde, o máximo dele é 4,10%, de 03/Mai, e o que houve foi recuperação do MÍNIMO da série, 0,50%, marcado ontem. TEREZA CRISTINA aparece em 0,55% no contrato presidencial no dia em que Flávio disse que ela aceitou ser vice dele, ela disse que conversou e que depende do PL e do PP-União, e o PP descartou. O contrato mede quem ganha a Presidência, não quem é vice, então isso é nome em circulação e não cargo. ZEMA caiu pelo terceiro pregão seguido, para 0,45%, perdendo no mesmo dia o cabeça de chapa ao Senado em Minas. HADDAD subiu 0,15pp, para 0,30%, e segue sem ser testado pelas nacionais.',
  'AC.c3.analise')

const LISTAS: Record<string, string[]> = {
  'candidates.0.fortes': [
    'Segundo pregão seguido ESTÁVEL em 63,50%, mantendo o valor que iguala o topo da série do AFOS, marcado em 26, 28 e 30/Jul.',
    'A Vox Brasil dá 47,5% x 41,1% no returno, e os 6,4pp ficam FORA da margem somada, então esta leitura NÃO descreve empate técnico.',
    'Duas das três casas da semana medem o gap do 1º turno em torno de 9pp, 9,1pp na AtlasIntel e 9,3pp na Vox, e a que destoa é a PoderData, com 6pp.',
    'O PCdoB formalizou apoio à chapa Lula-Alckmin, somando-se ao PSB, que oficializou Alckmin como vice em 29/Jul.',
    'O instituto registra que, entre maio e julho, Lula cresceu 7,3pp e Flávio recuou 2,7pp na série da própria casa, invertendo uma vantagem que era do senador.',
  ],
  'candidates.0.fracos': [
    'O gap recuou de +39,55pp para +39,20pp, e recuou porque o adversário subiu, não por movimento dele.',
    'Os 40,5% da Vox no 1º turno seguem abaixo dos 50% mais um voto, ou seja, a leitura descreve returno e não vitória direta.',
    'A rodada da Vox NÃO publicou aprovação nem rejeição, então o quadro de avaliação segue o de 30/Jul, com duas casas apontando para lados opostos na mesma semana.',
    'Os 40,5% ficam abaixo dos 44,9% que a AtlasIntel mediu em 29/Jul, e a comparação entre casas diferentes não autoriza chamar isso de queda.',
    'O preço não reagiu a nenhuma das três urnas da semana, o que deixa o painel sem qualquer evidência de que o mercado esteja lendo essas pesquisas.',
  ],
  'candidates.1.fortes': [
    'SOBE 0,35pp no contrato de vencedor, para 24,30%, e é ele quem estreita o gap, que vai a +39,20pp.',
    'Os 41,1% dele no returno da Vox ficam a 6,4pp de Lula, e é a segunda melhor marca de returno dele no recorte.',
    'Anunciou que Tereza Cristina aceitou ser vice na chapa dele, movimento que, se confirmado pelos partidos, resolveria o prazo de 05/Ago.',
    'Mantém 78,00% no book de 2º lugar do 1º turno, ou seja, a posição de returno segue consolidada e não em disputa.',
    'O PL subiu 6,50pp no mercado do Senado, para 72,00%, a maior marca da legenda naquele contrato no acompanhamento do painel.',
  ],
  'candidates.1.fracos': [
    'CAI 1,00pp no book de 2º lugar do 1º turno, para 78,00%, e CAI 0,60pp no de 3º lugar, para 5,65%: sobe na vitória e cede nas duas colocações.',
    'A senadora Tereza Cristina não confirmou o que ele afirmou: disse que houve conversa e que a decisão depende do PL e do PP-União.',
    'A cúpula do PP avalia que ela aceitou o convite justamente por saber que o partido barraria a chapa, o que esvazia o anúncio.',
    'Os 31,2% da Vox no 1º turno ficam abaixo dos 35,8% da AtlasIntel e dos 35% da PoderData, ainda que a comparação seja entre casas diferentes.',
    'Segue SEM vice efetivamente definida, com o prazo de 05/Ago a menos de uma semana.',
  ],
  'candidates.2.fortes': [
    'SOBE 3,25pp no book de 2º lugar do 1º turno, para 9,35%, recuperando dois terços do que havia perdido na véspera.',
    'Fica ESTÁVEL em 62,00% no book de 3º lugar do 1º turno, mantendo folga sobre Caiado, que tem 26,50%.',
    'Mantém o maior volume acumulado entre os nomes competitivos do presidencial, USD 8,63M, acima de Lula e de Flávio.',
    'Segue com o terceiro maior preço do book presidencial, à frente de todo o pelotão.',
  ],
  'candidates.2.fracos': [
    'TRÊS institutos seguidos o cortaram: 7,8% na AtlasIntel de 29/Jul, 4% na PoderData de 30/Jul e 3,0% na Vox de 31/Jul.',
    'A distância entre preço e urna chega a 5,15pp, a maior do recorte, contra os 0,90pp que este painel registrou em 29/Jul e chamou de convergência.',
    'As três leituras mais recentes são também as três mais baixas do recorte, o que descreve tendência de queda e não dispersão entre casas.',
    'CAI 0,30pp no contrato de vencedor, para 8,15%, o quarto pregão seguido de queda naquele contrato.',
    'O mercado contradisse a si mesmo no caso dele em 24 horas, o que enfraquece qualquer leitura de reprecificação estável.',
  ],
  'candidates.3.fortes': [
    'Caiado recebeu a MELHOR urna nacional do recorte, 5,5% na Vox, acima dos 5% da PoderData e dos 3,1% da AtlasIntel.',
    'Caiado SOBE 1,00pp no book de 3º lugar do 1º turno, para 26,50%, a maior marca dele naquele contrato no acompanhamento do painel.',
    'Camilo Santana subiu a 2,20% e Alckmin a 1,10% no dia em que o PCdoB formalizou apoio à chapa Lula-Alckmin.',
    'Haddad subiu 0,15pp no vencedor e chegou a 1,00% no book de 2º lugar do 1º turno.',
  ],
  'candidates.3.fracos': [
    'Caiado CAIU 0,80pp no contrato de vencedor e devolveu em um pregão toda a alta de dois dias.',
    'Nenhum nome do pelotão passa de 2,20% no contrato presidencial, contra 63,50% do favorito.',
    'Zema caiu pelo TERCEIRO pregão seguido, para 0,45%, e perdeu Marcelo Aro da chapa ao Senado em Minas, movimento que chamou de traição.',
    'Zema segue SEM vice, com o prazo de 05/Ago a menos de uma semana, e o Novo descartou Barbosa para a vaga.',
    'Os 2,20% de Camilo Santana NÃO são recorde: o máximo da série é 4,10%, de 03/Mai, e o movimento é recuperação do mínimo histórico marcado ontem.',
  ],
}
for (const [cam, itens] of Object.entries(LISTAS)) {
  itens.forEach((txt, i) => set(oAc, `${cam}.${i}`, txt, `AC.${cam}[${i}]`))
}

set(oAc, 'cruzamento',
`O CRUZAMENTO DE 31/JUL tem uma assimetria como marca: o favorito não se mexeu e quase todo o resto do tabuleiro se mexeu. Lula ficou ESTÁVEL em 63,50% (vol USD 7,77M) pelo segundo pregão seguido, mantendo o valor que iguala o topo da série do AFOS. Flávio SUBIU 0,35pp, para 24,30% (vol USD 7,76M), e o gap recuou de +39,55pp para +39,20pp por movimento dele. A URNA. ${VOX} dá Lula 40,5% x Flávio 31,2% no 1º turno, com Caiado 5,5%, Zema 3,2% e Renan Santos 3,0%, e Lula 47,5% x Flávio 41,1% no returno. A vantagem de 6,4pp no returno fica FORA da margem somada, então esta leitura NÃO descreve empate técnico, ao contrário da PoderData de 30/Jul. E o registro que organiza a semana é este: TRÊS casas mediram o gap do 1º turno em 9,1pp, 6pp e 9,3pp. Duas concordam em torno de 9pp e a que destoa é a PoderData. Em 30/Jul o painel escreveu, corretamente, que comparar casas diferentes e chamar a diferença de movimento é trocar de régua; a Vox de hoje reforça essa disciplina por outro caminho, mostrando que a PoderData é que estava fora do conjunto. O ACHADO É RENAN SANTOS, e ele é de sequência, não de número isolado. ${RENAN3} Em 29/Jul este painel chamou aquela distância de convergência e sublinhou que ela estreitava pelo lado da urna. Três institutos depois, ela quadruplicou. Fica registrado que a leitura de 29/Jul não se sustentou. E há uma contradição DENTRO do próprio mercado: no mesmo dia em que a urna o corta pela terceira vez, o book de 2º lugar do 1º turno SOBE 3,25pp, de 6,10% para 9,35% (vol USD 1,09M), devolvendo dois terços do que fora retirado na véspera, enquanto o de 3º lugar fica ESTÁVEL em 62,00%. Ontem o painel escreveu que o dinheiro o havia reclassificado; hoje o mesmo dinheiro desfez parte disso. As duas direções ficam registradas e nenhuma é arbitrada. CAIADO DEVOLVEU TUDO: caiu 0,80pp, para 1,75% (vol USD 5,22M), desfazendo em um pregão a alta de dois dias, e SUBIU 1,00pp no 3º lugar, para 26,50%. A ressalva de série corta para os dois lados e é necessária: 1,75% está dentro da faixa normal dele desde 22/Jul e os 2,55% de ontem é que eram o desvio, então não houve colapso, houve devolução de desvio. No mesmo dia, a Vox lhe deu 5,5%, a melhor urna nacional dele no recorte, e a divergência entre institutos sobre ele segue aberta em QUATRO níveis no mesmo mês: 6%, 5,5%, 5% e 3,1%. DOIS NOMES DO CAMPO DO GOVERNO SUBIRAM JUNTOS, Camilo Santana a 2,20% (vol USD 4,16M) e Geraldo Alckmin a 1,10% (vol USD 4,98M), no dia em que o PCdoB formalizou apoio à chapa Lula-Alckmin. O painel registra a coincidência e não afirma causa. Sobre Camilo, a ressalva de série é obrigatória: 2,20% NÃO é recorde, o máximo dele é 4,10%, de 03/Mai, e o movimento é recuperação do MÍNIMO da série, 0,50%, marcado ontem. O EIXO PARTIDÁRIO foi o do dia, e ele tem TRÊS versões do mesmo fato. Flávio afirmou que Tereza Cristina aceitou ser vice dele; a senadora disse que houve conversa e que a decisão depende do PL e do PP-União; e a cúpula do PP avalia que ela aceitou por saber que o partido barraria. O painel registra as três e não escolhe. No mercado ela aparece em 0,55% no contrato PRESIDENCIAL, e a distinção importa: aquele contrato mede quem ganha a Presidência, não quem ocupa a vaga de vice. Em Minas Gerais, Marcelo Aro deixou a chapa de Zema ao Senado para disputar o governo, movimento que Zema chamou publicamente de traição, e o Novo descartou Barbosa como vice. O prazo de 05/Ago para definição de vices organiza os próximos dias e vale para Flávio e para Zema. NOS DEMAIS MERCADOS, o impeachment de ministro do STF ficou ESTÁVEL em 3,10% (vol USD 83 mil), sem variação nas quatro leituras da trava, num dia sem fato institucional novo nesse eixo. No Senado, o PL SUBIU 6,50pp, para 72,00% (vol USD 258 mil), e o MDB entra como FAIXA declarada de 25,20% a 26,60%: somados, os dois passam de 97% de probabilidade atribuída a apenas duas legendas, o que por si só indica spread largo. Na inflação, a faixa modal segue em 5,00% a 5,49%, com 38,30%, e a de 4,50% a 4,99% subiu 1,20pp, para 33,70%, num book de USD 81 mil não coberto pela trava. UMA NOTA DE CAPTURA, e ela é a razão da faixa. ${TRAVA} Volume total acumulado no presidencial em USD 117,03M.`,
  'AC.cruzamento')

// ─────────────────────────────── analysis-data ───────────────────────────────

set(oAd, 'updatedAt', HORA, 'AD')

set(oAd, 'cards.sentimento.text1',
`A 65 dias do 1º turno, a urna do dia é a ${VOX}: Lula 40,5% x Flávio Bolsonaro 31,2% no 1º turno, com Ronaldo Caiado 5,5%, Romeu Zema 3,2% e Renan Santos 3,0%. No returno, Lula 47,5% x Flávio 41,1%. São 9,3pp de gap no 1º turno e 6,4pp no returno, e essa diferença de returno fica FORA da margem somada, então esta leitura não descreve empate técnico. Somando a semana, três casas mediram o gap do 1º turno em 9,1pp, 6pp e 9,3pp, o que coloca a PoderData de 30/Jul como a leitura fora da curva, não a Vox.`,
  'AD.sentimento.text1')

set(oAd, 'cards.sentimento.text2',
`O cruzamento do dia tem uma assimetria clara: Lula não se mexeu e o resto do tabuleiro se mexeu muito. O contrato de vencedor dele ficou em 63,50% pelo segundo pregão seguido, enquanto Flávio subiu 0,35pp, Renan Santos caiu 0,30pp, Caiado caiu 0,80pp, Camilo Santana subiu 1,70pp e Alckmin subiu 0,75pp. ${RENAN3}`,
  'AD.sentimento.text2')

set(oAd, 'cards.sentimento.text3',
'No mercado, Lula ficou ESTÁVEL em 63,50% (vol USD 7,77M) pelo segundo dia. Flávio subiu 0,35pp, para 24,30% (vol USD 7,76M), e o gap recuou de +39,55pp para +39,20pp, por movimento dele e não do favorito. Renan Santos caiu 0,30pp, para 8,15% (vol USD 8,63M). Caiado caiu 0,80pp, para 1,75% (vol USD 5,22M), devolvendo em um pregão a alta de dois dias. Camilo Santana subiu para 2,20% (vol USD 4,16M) e Geraldo Alckmin para 1,10% (vol USD 4,98M). Jair Bolsonaro ficou em 0,95%, Tereza Cristina em 0,55%, Zema caiu 0,10pp para 0,45% e Haddad subiu 0,15pp para 0,30%. Tarcísio de Freitas segue em 0,15% (vol USD 13,68M), ainda o maior volume acumulado do book. O volume total acumulado no presidencial soma USD 117,03M.',
  'AD.sentimento.text3')

set(oAd, 'cards.sentimento.direita',
'Flávio subiu 0,35pp, para 24,30% (vol USD 7,76M), e estreitou o gap para +39,20pp. Nos sub-mercados o sinal é cruzado e vale registrar: CAIU 1,00pp no 2º lugar do 1º turno, para 78,00% (vol USD 216 mil), e CAIU 0,60pp no 3º lugar, para 5,65%. Subir na chance de ganhar e ceder nas duas de colocação é combinação incomum, e a contrapartida da queda no book de 2º lugar é a alta de 3,25pp de Renan Santos no mesmo contrato, o que sugere realocação interna e não leitura nova sobre o returno. Na urna, a Vox o traz em 31,2% no 1º turno e 41,1% no returno, com os 6,4pp de diferença ficando fora da margem somada. O dia foi movimentado no arranjo de chapa: ele afirmou que Tereza Cristina aceitou ser vice, a senadora disse que conversou e que a decisão depende do PL e do PP-União, e a cúpula do PP avalia que ela aceitou sabendo que o partido barraria. Três versões do mesmo fato, e o painel registra as três. O prazo de 05/Ago para definição de vice está a menos de uma semana.',
  'AD.sentimento.direita')

set(oAd, 'cards.sentimento.esquerda',
'Lula ficou ESTÁVEL em 63,50% (vol USD 7,77M) pelo segundo pregão seguido, mantendo o valor que iguala o topo da série do AFOS. O gap recuou para +39,20pp por movimento do adversário. Na Vox Brasil ele tem 40,5% no 1º turno e 47,5% no returno, com 6,4pp de vantagem que ficam fora da margem somada. O instituto registra que, entre maio e julho, Lula cresceu 7,3pp e Flávio recuou 2,7pp na série da própria casa, invertendo uma vantagem que era do senador, e o painel reproduz isso como afirmação do instituto, porque é comparação interna dele. Dois nomes do campo dele subiram no mercado no mesmo dia: Camilo Santana foi a 2,20% e Geraldo Alckmin a 1,10%, no dia em que o PCdoB formalizou apoio à chapa Lula-Alckmin. O painel registra a coincidência e não afirma causa. Sobre Camilo, a ressalva de série é obrigatória: 2,20% NÃO é recorde, o máximo dele é 4,10%, de 03/Mai, e o que houve foi recuperação do MÍNIMO da série, 0,50%, marcado ontem.',
  'AD.sentimento.esquerda')

set(oAd, 'cards.sentimento.terceiraVia',
'O pelotão teve o dia mais movimentado da semana. CAIADO devolveu tudo: caiu 0,80pp, para 1,75% (vol USD 5,22M), desfazendo em um pregão a alta de dois dias. A ressalva de série desfaz a leitura de colapso, porque 1,75% está dentro da faixa normal dele desde 22/Jul e os 2,55% de ontem é que eram o desvio. E ele SOBE 1,00pp no 3º lugar do 1º turno, para 26,50%, o que torna o sinal cruzado. Na urna, a Vox lhe dá 5,5%, a melhor leitura nacional dele no recorte, acima dos 5% da PoderData e bem acima dos 3,1% da AtlasIntel. A divergência sobre ele segue aberta em quatro níveis no mesmo mês. RENAN SANTOS caiu 0,30pp no vencedor, para 8,15% (vol USD 8,63M), mas SUBIU 3,25pp no 2º lugar do 1º turno, para 9,35%, recuperando dois terços do que perdera na véspera. É a contradição do dia: a urna o corta pelo terceiro instituto seguido e o dinheiro devolve parte da chance de returno que tinha retirado 24 horas antes. CAMILO SANTANA subiu a 2,20% e ALCKMIN a 1,10%, os dois no dia do apoio formal do PCdoB à chapa Lula-Alckmin. ZEMA caiu 0,10pp, para 0,45%, no terceiro pregão seguido de queda, num dia em que Marcelo Aro deixou a chapa dele ao Senado para disputar o governo de Minas, movimento que Zema chamou publicamente de traição.',
  'AD.sentimento.terceiraVia')

set(oAd, 'cards.sentimento.polymarket',
`Lula 63,50% (estável, vol USD 7,77M), Flávio 24,30% (alta 0,35pp, vol USD 7,76M), Renan Santos 8,15% (queda 0,30pp, vol USD 8,63M), Camilo Santana 2,20% (vol USD 4,16M), Caiado 1,75% (queda 0,80pp, vol USD 5,22M), Alckmin 1,10% (vol USD 4,98M), Jair 0,95%, Tereza Cristina 0,55%, Zema 0,45% (queda 0,10pp), Haddad 0,30% (alta 0,15pp). Gap Lula sobre Flávio em +39,20pp, contra +39,55pp em 30/Jul. Volume total acumulado no presidencial em USD 117,03M. Sub-mercados: 2º lugar do 1º turno com Flávio 78,00% (queda 1,00pp, vol USD 216 mil), Renan Santos 9,35% (ALTA de 3,25pp, vol USD 1,09M) e Lula 8,25%; 3º lugar com Renan 62,00% (estável, vol USD 164 mil), Caiado 26,50% (alta 1,00pp, vol USD 37 mil), Flávio 5,65% (queda 0,60pp) e Zema 4,45%; impeachment de ministro do STF ESTÁVEL em 3,10% (vol USD 83 mil); Senado com PL 72,00% (alta 6,50pp, vol USD 258 mil) e MDB em FAIXA declarada de 25,20% a 26,60%; inflação com a faixa de 5,00% a 5,49% em 38,30% e a de 4,50% a 4,99% em 33,70% (alta 1,20pp). ${TRAVA} Captura ao vivo 31/Jul 20:33 UTC.`,
  'AD.sentimento.polymarket')

set(oAd, 'cards.inss.text1',
'A pauta fiscal seguiu sem fato novo, com o Senado em recesso e o Orçamento como próxima frente de atrito entre a presidência do Senado e o governo. O dia político foi de arranjo de chapa, não de economia: Flávio Bolsonaro afirmou que Tereza Cristina aceitou ser vice dele, a senadora disse que conversou e que a decisão depende do PL e do PP-União, e a cúpula do PP avalia que ela aceitou sabendo que o partido barraria. Em Minas Gerais, Marcelo Aro deixou a chapa de Romeu Zema ao Senado para disputar o governo estadual, e Zema chamou o movimento de traição. O PCdoB formalizou apoio à chapa Lula-Alckmin.',
  'AD.inss.text1')

set(oAd, 'cards.inss.text2',
`O mercado teve a assimetria como marca do dia: o favorito não se mexeu e quase todo o resto se mexeu. Lula ficou em 63,50% pelo segundo pregão, enquanto Flávio subiu 0,35pp, Renan caiu 0,30pp, Caiado caiu 0,80pp e dois nomes do campo do governo subiram. ${RENAN3}`,
  'AD.inss.text2')

set(oAd, 'cards.inss.text3',
'O mercado de impeachment de ministro do STF ficou ESTÁVEL em 3,10% (vol USD 83 mil), sem nenhuma variação nas quatro leituras da trava de captura de hoje. Dia sem fato institucional novo nesse eixo, e o preço acompanhou a ausência. Com USD 83 mil de volume acumulado contra USD 117,03M do presidencial, este contrato só é registrável quando se move de forma sustentada, e hoje ele simplesmente não se moveu.',
  'AD.inss.text3')

set(oAd, 'cards.inss.text4',
'No Senado, o PL SUBIU 6,50pp e foi a 72,00% (vol USD 258 mil), e o MDB entra hoje como FAIXA declarada, de 25,20% a 26,60%, porque foi o único book que a trava de captura reprovou nas duas rodadas. Somando os dois, o contrato passa de 97% de probabilidade atribuída a apenas duas legendas, o que por si só indica spread largo naquele book. Na inflação, a faixa modal segue em 5,00% a 5,49%, com 38,30%, e a de 4,50% a 4,99% subiu 1,20pp, para 33,70%, num book de USD 81 mil que NÃO é coberto pela trava. Movimento grande em book pequeno é registro, não sinal.',
  'AD.inss.text4')

set(oAd, 'cards.inss.impactoLula',
'A Vox Brasil de 31/Jul não publicou aprovação e desaprovação nesta rodada, então o quadro de avaliação segue o de 30/Jul, com as duas leituras opostas da semana ainda de pé: a PoderData mediu a aprovação pessoal caindo a 43% contra 49% de desaprovação, e a AtlasIntel, 24 horas antes, mediu subindo 1,7pp, para 47,6% contra 51,2%. O painel continua exibindo a AtlasIntel no medidor pelo critério publicado em 29/Jul, a maior amostra e a menor margem do recorte. A faixa da semana segue entre 43% e 49%.',
  'AD.inss.impactoLula')

set(oAd, 'cards.inss.conclusao',
`A 65 dias da eleição, o dia foi de assimetria: o preço do favorito ficou parado em 63,50% pelo segundo pregão e quase todo o resto do tabuleiro se moveu. A urna nova, a ${VOX}, dá 40,5% x 31,2% no 1º turno e 47,5% x 41,1% no returno, e essa diferença de 6,4pp fica fora da margem somada, ao contrário do que a PoderData mediu na véspera. Três casas na mesma semana deram 9,1pp, 6pp e 9,3pp de gap no 1º turno, e o painel registra que a fora da curva é a PoderData. ${RENAN3} E o mercado contradisse a si mesmo no caso dele, devolvendo no book de 2º lugar parte do que tirara 24 horas antes. CAIADO devolveu integralmente a alta de dois dias no mesmo dia em que recebeu a melhor urna nacional do recorte. Nenhuma dessas leituras é atribuída a causa, porque o dia não teve evento que as explique.`,
  'AD.inss.conclusao')

set(oAd, 'cards.bancoMaster.text1',
'A sexta-feira não trouxe ato novo no caso Master, e o registro é o de continuidade com um verbo travado. A avaliação da Polícia Federal sobre pedir à Interpol a inclusão de Flávio Bolsonaro e de Daniel Vorcaro na difusão prateada, registrada em 30/Jul, segue exatamente como estava: a PF AVALIA, não pediu, e a Interpol não decidiu. Difusão prateada localiza bens e recursos no exterior e NÃO é ordem de prisão, ao contrário da difusão vermelha. O alvo declarado é rastrear os R$ 61 milhões do Banco Master que teriam financiado o filme sobre a trajetória de Jair Bolsonaro.',
  'AD.bancoMaster.text1')
set(oAd, 'cards.bancoMaster.text2',
'Na frente legislativa, a novidade segue sendo a ausência de decisão. O mandado de segurança que discute a instalação da CPI do Banco Master continua há mais de quatro meses no gabinete de Kassio Nunes Marques, e o pedido de quatro senadores para afastá-lo da relatoria foi rejeitado. Com o Senado em recesso e a pauta de agosto ainda em disputa, não há prazo à vista. O painel registra o tempo decorrido porque ele é o fato: quatro meses sem decisão sobre a instalação de uma CPI é, em si, uma decisão sobre a instalação dela.',
  'AD.bancoMaster.text2')
set(oAd, 'cards.bancoMaster.text3',
'Sobre o preço, o registro é de imobilidade e ele vale uma frase: o mercado de impeachment de ministro do STF ficou ESTÁVEL em 3,10%, num book de USD 83 mil, sem variação em nenhuma das quatro leituras da trava de captura de hoje. Num dia sem fato institucional novo, preço parado é o comportamento esperado. O painel não constrói leitura sobre ausência de movimento em contrato desse tamanho.',
  'AD.bancoMaster.text3')
set(oAd, 'cards.bancoMaster.conclusao',
'As três frentes do caso Master seguem em trilhos separados e não devem ser somadas: a criminal, no STF sob relatoria de André Mendonça, com o rastreamento patrimonial autorizado em decisão de maio e com a avaliação sobre a Interpol ainda em AVALIAÇÃO; a patrimonial, na Justiça do Rio, com bloqueios; e a legislativa, parada há mais de quatro meses no gabinete de Nunes Marques. Nenhuma delas produziu ato novo nesta sexta. O único mercado que toca o caso, o de impeachment de ministro do STF, ficou parado em 3,10%, num book de USD 83 mil que não sustenta leitura de reprecificação de risco em nenhuma direção.',
  'AD.bancoMaster.conclusao')
set(oAd, 'cards.inss.impactoGestao',
'A rodada da Vox Brasil de 31/Jul NÃO publicou avaliação de gestão, então o quadro segue o de 30/Jul e as duas leituras da semana continuam de pé, apontando para lados opostos. A PoderData de 30/Jul trouxe 34% de ótimo ou bom, 16% de regular e 47% de ruim ou péssimo, com o ruim ou péssimo subindo 10pp contra a rodada de 22/Jul do instituto. A AtlasIntel de 29/Jul media 49,3% de ruim ou péssimo, a BTG/Nexus de 27/Jul media 43% e a Datafolha de 24/Jul media 38%. Os quatro institutos seguem concordando no que mais importa: a gestão é avaliada pior do que a pessoa, e a distância entre os dois indicadores persiste.',
  'AD.inss.impactoGestao')

set(oAd, 'cards.stf.toffoli', 'Toffoli segue isolado no STF após a crise do Master, sem ato individual novo capturado nesta sexta.', 'AD.stf.toffoli')
set(oAd, 'cards.stf.gilmar', 'Sem ato individual de Gilmar no período. Permanece o voto conjunto recente, com Dino, Moraes e Zanin, que reduziu restrições a penduricalhos.', 'AD.stf.gilmar')
set(oAd, 'cards.stf.moraes', 'Sem despacho novo de Moraes capturado nesta sexta. Segue aberta a frente do vídeo gerado por inteligência artificial exibido na convenção do PL, com o prazo de 48 horas já vencido e a decisão seguinte pendente.', 'AD.stf.moraes')
set(oAd, 'cards.stf.dino', 'Sem ato novo nesta sexta. Segue correndo o prazo de 10 dias dado em 29/Jul para que governo e Congresso especifiquem a responsabilidade de parlamentares sobre emendas.', 'AD.stf.dino')
set(oAd, 'cards.stf.mendonca', 'Segue como relator do inquérito aberto em 23/Jul sobre os repasses de Vorcaro para o filme sobre Jair Bolsonaro. Sem ato novo nesta sexta. A avaliação da Polícia Federal sobre pedir à Interpol a inclusão de Flávio Bolsonaro e de Daniel Vorcaro na difusão prateada, registrada em 30/Jul, segue como AVALIAÇÃO: a PF não pediu e a Interpol não decidiu.', 'AD.stf.mendonca')
set(oAd, 'cards.stf.nexo',
'O nexo desta sexta saiu do eixo judicial e foi para o eixo partidário, e ele é de composição de chapa. Flávio Bolsonaro afirmou que Tereza Cristina aceitou ser vice na chapa dele; a senadora disse que houve conversa e que a decisão depende do PL e do PP-União; e a cúpula do PP avalia que ela aceitou justamente por saber que o partido barraria. São três versões do mesmo fato, e o painel registra as três sem escolher. Do outro lado, o PCdoB formalizou apoio à chapa Lula-Alckmin, e em Minas Gerais Marcelo Aro deixou a chapa de Zema ao Senado para disputar o governo, movimento que Zema chamou de traição. O prazo de 05/Ago para definição de vice está a menos de uma semana e é o que organiza o calendário dos próximos dias.',
  'AD.stf.nexo')
set(oAd, 'cards.stf.analise',
'O mercado de impeachment de ministro do STF antes de 2027 ficou ESTÁVEL em 3,10% (vol USD 83 mil), sem variação em nenhuma das quatro leituras da trava de captura de hoje. É o segundo pregão seguido no mesmo valor. A leitura é curta e é essa: dia sem fato institucional novo nesse eixo, preço parado. Num book de USD 83 mil contra USD 117,03M do presidencial, ausência de movimento diante de ausência de fato é o comportamento esperado, e registrá-lo custa uma frase.',
  'AD.stf.analise')

// ────────────────────────────────── polls-data ──────────────────────────────────

set(oPd, 'lastUpdate', '2026-07-31', 'PD.lastUpdate')

const antes = oPd.polls.length
oPd.polls = oPd.polls.filter((p: any) => Math.round((Date.parse('2026-07-31') - Date.parse(p.date)) / 864e5) <= 30)
if (antes - oPd.polls.length !== 0) erros.push(`PD: esperava remover 0 pesquisas, removeu ${antes - oPd.polls.length}`)

oPd.polls.unshift({
  institute: 'Vox Brasil',
  date: '2026-07-31',
  sample: 2100,
  margin: 2.15,
  register: 'BR-01084/2026',
  reliability: 3,
  method: 'Presencial',
  fieldDates: '2026-07-26 a 2026-07-28',
  note: 'Vox Brasil nacional publicada 31/Jul (Metrópoles, Revista Fórum, Contracs). 1T Lula 40,5% x Flávio 31,2% (gap +9,3pp), com Caiado 5,5%, Zema 3,2% e Renan Santos 3,0%. 2T Lula 47,5% x Flávio 41,1% (gap +6,4pp), diferença que fica FORA da margem somada e por isso NÃO é empate técnico, ao contrário da PoderData de 30/Jul, que dava 3pp. Campo 26-28/Jul, n=2.100, margem 2,15pp, 95% de confiança, registro BR-01084/2026. A SEMANA TEM TRÊS LEITURAS DE GAP NO 1º TURNO E ELAS NÃO CONCORDAM: 9,1pp na AtlasIntel de 29/Jul, 6pp na PoderData de 30/Jul e 9,3pp aqui. A fora da curva é a PoderData, não a Vox. RENAN SANTOS a 3,0% fecha a sequência de TRÊS institutos seguidos cortando: 7,8% na AtlasIntel, 4% na PoderData e 3,0% agora. Com preço em 8,15%, a distância entre mercado e urna vai a 5,15pp, a maior do recorte, contra os 0,90pp que o painel registrou em 29/Jul. CAIADO a 5,5% tem aqui a MELHOR urna nacional do recorte, acima dos 5% da PoderData e dos 3,1% da AtlasIntel, no mesmo dia em que o preço dele caiu 0,80pp. O instituto informa ainda que, entre maio e julho, Lula cresceu 7,3pp e Flávio recuou 2,7pp na série da própria casa, invertendo uma vantagem que era do senador; o painel reproduz como afirmação do instituto, porque é comparação interna dele. Esta rodada NÃO publicou aprovação nem rejeição.',
  scenarios: [{
    name: 'Cenário Principal (1º turno, estimulado)',
    results: [
      { candidate: 'Lula (PT)', percent: 40.5 },
      { candidate: 'Flávio Bolsonaro (PL)', percent: 31.2 },
      { candidate: 'Ronaldo Caiado (PSD)', percent: 5.5 },
      { candidate: 'Romeu Zema (Novo)', percent: 3.2 },
      { candidate: 'Renan Santos (Missão)', percent: 3.0 },
    ],
  }],
  secondRound: [{ matchup: 'Lula vs Flávio', candidate1: 'Lula', percent1: 47.5, candidate2: 'Flávio Bolsonaro', percent2: 41.1 }],
  source: 'Vox Brasil via Metrópoles, Revista Fórum, Contracs 31/Jul',
})

const PM: Record<string, [string, number]> = {
  'Lula': ['63,50%', 40.5],
  'Flávio Bolsonaro': ['24,30%', 31.2],
  'Renan Santos': ['8,15%', 3.0],
  'Ronaldo Caiado': ['1,75%', 5.5],
  'Tarcísio': ['0,15%', 0],
  'Romeu Zema': ['0,45%', 3.2],
  'Fernando Haddad': ['0,30%', 0],
}
for (const c of oPd.polymarketComparison.candidates) {
  const v = PM[c.name]
  if (!v) { erros.push(`PD.pmc: nome inesperado "${c.name}"`); continue }
  const n = Number(v[0].replace('%', '').replace(',', '.'))
  c.polymarket = v[0]; c.odds = n; c.value = n
  if (v[1] > 0) c.percentage = v[1]
  c.lastUpdate = '2026-07-31'
}

set(oPd, 'polymarketComparison.updatedAt', HORA, 'PD.pmc.updatedAt')

// ──────────────────────────── CandidatesSection.tsx ────────────────────────────
{
  const VAL: Array<[string, string, string]> = [
    ['63,50%',
     'Lula fica ESTÁVEL em Poly 63,50% (vol USD 7,77M acumulado) pelo segundo pregão seguido, a 65 dias do 1º turno, e o gap sobre Flávio recua de +39,55pp para +39,20pp por movimento do adversário. A urna do dia é a Vox Brasil (n=2.100, campo 26-28/Jul, margem 2,15pp, BR-01084/2026): 40,5% x 31,2% no 1º turno e 47,5% x 41,1% no returno.',
     'A SEMANA TEM TRÊS LEITURAS DE GAP E ELAS NÃO CONCORDAM: 9,1pp na AtlasIntel de 29/Jul, 6pp na PoderData de 30/Jul e 9,3pp na Vox de hoje. A fora da curva é a PoderData, não a Vox, e o preço não reagiu a nenhuma das três. Os 6,4pp de vantagem no returno da Vox ficam FORA da margem somada, então esta leitura não descreve empate técnico. Dois nomes do campo dele subiram no mercado hoje, Camilo Santana a 2,20% e Alckmin a 1,10%, no dia do apoio formal do PCdoB à chapa Lula-Alckmin, e o painel registra a coincidência sem afirmar causa.'],
    ['24,30%',
     'Flávio SOBE 0,35pp para Poly 24,30% (vol USD 7,76M acumulado) e estreita o gap para +39,20pp. Nos sub-mercados o sinal é cruzado: CAI 1,00pp no 2º lugar do 1º turno, para 78,00%, e CAI 0,60pp no 3º lugar, para 5,65%. Sobe na chance de ganhar e cede nas duas de colocação.',
     'O DIA DELE FOI DE ARRANJO DE CHAPA, e há três versões do mesmo fato. Ele afirmou que Tereza Cristina aceitou ser vice; a senadora disse que houve conversa e que a decisão depende do PL e do PP-União; e a cúpula do PP avalia que ela aceitou por saber que o partido barraria. O painel registra as três sem escolher. O prazo de 05/Ago está a menos de uma semana. Na urna, a Vox o traz em 31,2% no 1º turno e 41,1% no returno.'],
    ['8,15%',
     'Renan CAI 0,30pp para Poly 8,15% (vol USD 8,63M acumulado), mas o movimento do dia é o oposto no book de colocação: SOBE 3,25pp no 2º lugar do 1º turno, de 6,10% para 9,35%, recuperando dois terços do que perdera na véspera, e fica estável em 62,00% no 3º lugar.',
     'TRÊS INSTITUTOS SEGUIDOS O CORTARAM, e é a sequência que importa: 7,8% na AtlasIntel de 29/Jul, 4% na PoderData de 30/Jul e 3,0% na Vox de hoje. Com preço em 8,15%, a distância entre mercado e urna vai a 5,15pp, a maior do recorte, contra os 0,90pp que este painel registrou em 29/Jul e chamou de convergência. A dispersão deixou de ser dispersão e virou tendência: as três leituras mais recentes são também as três mais baixas. E o mercado contradisse a si mesmo, devolvendo no book de 2º lugar parte do que tirara 24 horas antes.'],
    ['0,30%',
     'Haddad SOBE 0,15pp para Poly 0,30% e vai a 1,00% no 2º lugar do 1º turno. A Vox Brasil não o testa em nenhum cenário, nem de 1º turno nem de returno, então ele não tem urna nova nesta rodada.',
     'O agravante de leitura permanece e o painel repete: ele NÃO é candidato à Presidência, disputa o governo de São Paulo, e o cenário que o favorece é hipótese de pesquisa e não candidatura em curso. Ausência de teste numa nacional é informação, e o painel a registra em vez de repetir o dado da véspera como se fosse novo.'],
    ['1,75%',
     'Caiado CAI 0,80pp para Poly 1,75% (vol USD 5,22M) e DEVOLVE em um pregão toda a alta de dois dias. No 3º lugar do 1º turno ele SOBE 1,00pp, para 26,50%, o que torna o sinal cruzado. Na urna, a Vox lhe dá 5,5%, a melhor leitura nacional dele no recorte.',
     'A RESSALVA DE SÉRIE DESFAZ A LEITURA DE COLAPSO: 1,75% está dentro da faixa normal dele desde 22/Jul, quando a série do AFOS registrou 1,80%, e os 2,55% de ontem é que eram o desvio. O que se lê é que o mercado o realocou de candidato a vencedor para candidato a terceiro colocado, e que a urna não acompanhou essa realocação: a divergência sobre ele segue aberta em quatro níveis no mesmo mês, 6% na Nexus, 5,5% na Vox, 5% na PoderData e 3,1% na AtlasIntel.'],
    ['0,45%',
     'Zema CAI 0,10pp para Poly 0,45% (vol USD 4,58M), no terceiro pregão seguido de queda, e fica em 4,45% no 3º lugar do 1º turno. A Vox o traz em 3,2% no 1º turno, praticamente o mesmo dos 3% da PoderData.',
     'O DIA FOI RUIM NO ARRANJO PARTIDÁRIO. Marcelo Aro deixou a chapa dele ao Senado para disputar o governo de Minas Gerais, movimento que Zema chamou publicamente de traição, e o Novo descartou Barbosa como vice, caminhando para chapa puro-sangue. Segue SEM vice, com o prazo de 05/Ago a menos de uma semana. Ressalva de série, e ela é grande: o máximo dele na série do AFOS é 10,10%, de 26/Abr, então 0,45% é menos de um vigésimo daquele nível.'],
    ['0,15%',
     'Tarcísio estável a Poly 0,15% no presidencial, com o maior volume acumulado do book nesta captura, USD 13,68M. Não é testado pela Vox Brasil em nenhum cenário presidencial.',
     'O presidencial dele em 0,15% com o maior volume acumulado do book é a anomalia de legado que serve de lembrete permanente de método: volume mede história negociada e não convicção atual. O contrato acumulou esse valor ao longo de meses em que ele era tratado como candidato provável, e o preço de hoje diz que o mercado não o considera mais na disputa.'],
  ]
  const chaves = ['polymarket', 'poll', 'risk'] as const
  const edicoes: Array<{ i: number; f: number; novo: string }> = []
  for (let k = 0; k < chaves.length; k++) {
    const re = new RegExp(`${chaves[k]}: "(?:[^"\\\\]|\\\\.)*"`, 'g')
    const ms = [...sCs.matchAll(re)]
    if (ms.length !== VAL.length) { erros.push(`TSX: "${chaves[k]}" apareceu ${ms.length}x, esperado ${VAL.length}x`); continue }
    ms.forEach((m, idx) => edicoes.push({ i: m.index!, f: m.index! + m[0].length, novo: `${chaves[k]}: ${JSON.stringify(VAL[idx][k])}` }))
  }
  edicoes.sort((a, b) => b.i - a.i)
  for (const e of edicoes) sCs = sCs.slice(0, e.i) + e.novo + sCs.slice(e.f)
}

// ────────────────────────────────── gate final ──────────────────────────────────

// PROIBIDO: só o que NÃO tem uso legítimo hoje. Valor de ontem citado como base
// de delta é legítimo e vai para SO_COM_PAR, que exige o valor novo na mesma string.
const PROIBIDO = ['66 dias', 'quinta-feira', '116,58M']
const SO_COM_PAR: Array<[string, string]> = [
  ['+39,55pp', '+39,20pp'],
  ['6,10%', '9,35%'],
  ['18,20%', '25,20%'],
  ['32,50%', '33,70%'],
  ['2,55%', '1,75%'],
  ['8,45%', '8,15%'],
  ['23,95%', '24,30%'],
]
function varrer(no: any, cam: string) {
  if (typeof no === 'string') {
    const p = PROIBIDO.filter(s => no.includes(s))
    if (p.length) erros.push(`SOBRA proibida em ${cam}: ${p.join(' , ')}`)
    for (const [velho, novo] of SO_COM_PAR) {
      if (no.includes(velho) && !no.includes(novo)) erros.push(`DELTA ÓRFÃO em ${cam}: "${velho}" sem "${novo}"`)
    }
    return
  }
  if (Array.isArray(no)) return no.forEach((v, i) => varrer(v, `${cam}[${i}]`))
  if (no && typeof no === 'object') return Object.keys(no).forEach(k => varrer(no[k], `${cam}.${k}`))
}
varrer(oAc, 'AC'); varrer(oAd, 'AD')
sCs.split('\n').forEach((l, i) => varrer(l, `CandidatesSection.tsx:${i + 1}`))

if (erros.length) {
  console.error('❌ ABORTADO, nada foi escrito:')
  erros.forEach(e => console.error('   • ' + e))
  process.exit(1)
}

writeFileSync(P_AC, JSON.stringify(oAc, null, 2) + '\n', 'utf-8')
writeFileSync(P_AD, JSON.stringify(oAd, null, 2) + '\n', 'utf-8')
writeFileSync(P_PD, JSON.stringify(oPd, null, 2) + '\n', 'utf-8')
writeFileSync(P_CS, sCs, 'utf-8')
console.log('✅ 4 arquivos escritos. Pesquisas no array:', oPd.polls.length)
