/**
 * /atualizar-brz de 01/Ago/2026, captura das 13:49 BRT (16:49 UTC).
 *
 * TRAVA: reprovou a 1a rodada (Renan em trânsito de 7,15% para 7,60% e Caiado
 * do 3o lugar entre 22,00% e 22,50%) e APROVOU a 2a. Publicando os valores da
 * 2a leitura, como manda a ETAPA 1.7.
 *
 * SÉRIES CONFERIDAS em scripts/check-superlativo.ts, direto no Neon:
 *   Lula      máx 65,50% em 01/Ago (NOVO TOPO, 2o dia seguido rompendo)
 *   gap       máx +40,75pp em 01/Ago (NOVO MÁXIMO, 2o dia seguido)
 *   Renan     7,60% é o menor desde 14/Mai; antes disso houve valores menores
 *             em abril, por isso a janela é "desde 14/Mai" e não "da série"
 *   Camilo    mín da série era 0,50% em 30/Jul; 0,45% de hoje é NOVO MÍNIMO
 *   Caiado    mín da série 0,90% em 09/Jul, então 1,35% NÃO é mínimo
 *   Tarcísio  a série tem só 3 dias (28/Abr a 14/Mai). NÃO afirmar superlativo
 */
import { readFileSync, writeFileSync } from 'node:fs'

const erros: string[] = []
const P_AC = 'public/analysis-criteriosa.json'
const P_AD = 'public/analysis-data.json'
const P_PD = 'public/polls-data.json'
const P_TSX = 'app/components/CandidatesSection.tsx'
const oAc = JSON.parse(readFileSync(P_AC, 'utf-8'))
const oAd = JSON.parse(readFileSync(P_AD, 'utf-8'))
const oPd = JSON.parse(readFileSync(P_PD, 'utf-8'))
let tsx = readFileSync(P_TSX, 'utf-8')

function set(raiz: any, caminho: string, valor: string, rot: string) {
  const partes = caminho.match(/[^.[\]]+/g)!
  let no = raiz
  for (const p of partes.slice(0, -1)) no = no?.[p]
  const u = partes[partes.length - 1]
  if (typeof no?.[u] !== 'string') { erros.push(`${rot}: campo inexistente ${caminho}`); return }
  no[u] = valor
}

const HORA = '01/08/2026, 13:49'
oAc.updatedAt = HORA
oAd.updatedAt = HORA
oPd.lastUpdate = '2026-08-01'

const TRAVA = 'A trava de dupla leitura reprovou a primeira rodada, com Renan Santos em trânsito de 7,15% para 7,60% e o 3º lugar de Caiado oscilando entre 22,00% e 22,50%, e APROVOU a segunda. Todos os preços entram firmes, sem faixa declarada. Captura ao vivo 01/Ago 16:49 UTC.'
const TARCISIO = 'Tarcísio de Freitas aparece em 0,05% no contrato presidencial, com USD 13,69M de volume acumulado, o maior do book. O painel registra o nível e não afirma que é o menor dele: a série do AFOS tem apenas três dias para esse nome, entre 28/Abr e 14/Mai, e não sustenta superlativo.'
const RENAN = 'RENAN SANTOS caiu 0,55pp e foi a 7,60% (vol USD 8,72M), o menor valor dele desde 14/Mai. A queda é de sequência, não de pregão: em 23/Jul ele estava em 12,00% e desde então cedeu em oito das nove rodadas, somando 4,40pp. Antes de 14/Mai a série registra valores menores, por isso a janela é declarada e não se escreve "da série".'
const PORTAS = 'No arranjo de chapa, Flávio Bolsonaro segue sem vice a quatro dias do prazo de 05/Ago. Tereza Cristina lamentou publicamente o fim da articulação depois da negativa do PP, dizendo que o que foi está posto, e ele agradeceu e afirmou que negocia com outros partidos. O Republicanos oficializou neste sábado a candidatura de Tarcísio de Freitas à REELEIÇÃO no governo de São Paulo, com Flávio presente ao palanque, mas o próprio Tarcísio manteve o foco no estado e evitou nacionalizar o discurso. São coisas distintas e o painel não as junta: a convenção de hoje é estadual e trata do governo de São Paulo; a convenção nacional do partido, que decide sobre aliança presidencial, está marcada para 04/Ago.'

// ─────────────────────────── analysis-criteriosa ───────────────────────────
set(oAc, 'subtitle',
`ATUALIZAÇÃO 01/Ago 13:49 BRT, a 64 dias do 1º turno. SEGUNDO DIA SEGUIDO DE TOPO NOVO. Lula subiu 1,00pp e foi a 65,50% (vol USD 7,82M), máximo da série do AFOS, que cobre de 14/Abr a hoje. Flávio Bolsonaro subiu 0,40pp, para 24,75% (vol USD 7,79M), e mesmo assim o gap ABRIU de +40,15pp para +40,75pp, também máximo da série que tem os dois nomes, iniciada em 03/Mai. Os dois recordes foram rompidos em 31/Jul e rompidos de novo hoje, e nas duas vezes com o adversário subindo junto: o movimento é de demanda pelo favorito e não de deterioração do outro lado. ${RENAN} O PELOTÃO ENCOLHEU TODO: Caiado caiu 0,25pp, para 1,35% (vol USD 5,24M), Jair Bolsonaro caiu 0,30pp, para 0,55%, Alckmin caiu 0,10pp, para 0,35%, e CAMILO SANTANA devolveu tudo o que ganhara na véspera, caindo 0,90pp para 0,45% (vol USD 4,19M), que é o menor valor dele na série do AFOS, abaixo dos 0,50% de 30/Jul. ${TARCISIO} NOS BOOKS DE COLOCAÇÃO, Flávio subiu 1,00pp no 2º lugar do 1º turno, para 79,50%, enquanto Renan cedeu 0,80pp, para 8,55%, e no 3º lugar Caiado DESABOU 5,00pp, de 27,50% para 22,50% (vol USD 37 mil), desfazendo em um pregão a alta que o painel registrara ontem. ${PORTAS} NO EIXO JUDICIAL, André Mendonça autorizou na tarde de 31/Jul um SEGUNDO inquérito contra Fábio Luís Lula da Silva, o Lulinha, desta vez sobre a atuação dele junto à Dataprev, depois do primeiro, sobre o Ministério da Saúde, autorizado em 30/Jul. A urna nacional segue sendo a Vox Brasil de 31/Jul (n=2.100, campo 26 a 28/Jul, margem de 2,15pp, 95% de confiança, BR-01084/2026), sem rodada nacional nova desde então. Volume total acumulado no presidencial em USD 117,52M. ${TRAVA}`,
  'AC.subtitle')

set(oAc, 'candidates[0].header',
'Polymarket 65,50% (alta 1,00pp, vol USD 7,82M acumulado), a 64 dias da eleição, no MÁXIMO da série do AFOS pelo segundo dia seguido. O gap sobre Flávio abre para +40,75pp, também máximo da série. Sem urna nacional nova: a última segue sendo a Vox Brasil de 31/Jul (n=2.100), com 40,5% no 1º turno e 47,5% x 41,1% no returno.',
  'AC.c0.header')
set(oAc, 'candidates[0].fortes[0]',
'SUPEROU o próprio topo pelo segundo dia seguido, indo de 64,50% para 65,50%, o maior valor da série do AFOS, que cobre de 14/Abr a hoje.', 'AC.c0.f0')
set(oAc, 'candidates[0].fracos[0]',
'O gap de +40,75pp é máximo da série, mas abriu num dia em que Flávio TAMBÉM subiu 0,40pp, o que afasta a leitura de deterioração do adversário.', 'AC.c0.fr0')
set(oAc, 'candidates[0].analise',
`O dia dele repetiu o de ontem e foi mais longe. O contrato de vencedor SUBIU 1,00pp e foi a 65,50% (vol USD 7,82M), segundo topo de série em dois pregões, e o gap ABRIU para +40,75pp, também máximo. Nos dois dias o movimento veio com Flávio subindo junto, o que descreve demanda pelo favorito e não deterioração do outro lado. SEM URNA NOVA. Nenhuma nacional foi publicada desde a Vox Brasil de 31/Jul, então o preço andou 2,00pp em dois pregões sem nenhuma leitura de intenção de voto para acompanhar. É o quinto pregão em nove dias em que isso acontece, e o painel registra a assimetria sem explicá-la. NO CAMPO DELE, o mercado desfez o movimento da véspera: Camilo Santana devolveu 0,90pp e foi a 0,45%, menor valor dele na série do AFOS, abaixo dos 0,50% de 30/Jul, e Alckmin cedeu 0,10pp, para 0,35%. A leitura fácil seria ligar isso ao PCdoB de ontem, e o painel não faz: o apoio formal continua valendo e o preço voltou ao ponto de partida em 24 horas. NO CALENDÁRIO PARTIDÁRIO, o PT oficializa a candidatura dele em convenção nacional neste domingo, 02/Ago, depois de convenções estaduais no Ceará, em 31/Jul, e na Bahia, hoje. E o campo dele levou um fato judicial novo: em 31/Jul à tarde, André Mendonça autorizou um SEGUNDO inquérito sobre Lulinha, agora quanto à atuação junto à Dataprev, um dia depois do primeiro. Inquérito não é condenação e o painel não o trata como tal.`,
  'AC.c0.analise')

set(oAc, 'candidates[1].header',
'Polymarket 24,75% (alta 0,40pp, vol USD 7,79M acumulado), mas o gap ABRE para +40,75pp porque Lula subiu mais. SOBE 1,00pp no 2º lugar do 1º turno, para 79,50%, e CAI para 4,95% no 3º lugar. Segue SEM vice a quatro dias do prazo de 05/Ago, depois da negativa do PP.',
  'AC.c1.header')
set(oAc, 'candidates[1].fortes[0]',
'SOBE 0,40pp no contrato de vencedor, para 24,75%, sexto pregão seguido sem queda naquele contrato.', 'AC.c1.f0')
set(oAc, 'candidates[1].fortes[3]',
'SOBE 1,00pp no book de 2º lugar do 1º turno, para 79,50%, a maior marca dele naquele contrato no acompanhamento do painel.', 'AC.c1.f3')
set(oAc, 'candidates[1].fracos[0]',
'SUBIU no contrato de vencedor e mesmo assim viu o gap ABRIR de +40,15pp para +40,75pp, porque Lula subiu 1,00pp no mesmo pregão.', 'AC.c1.fr0')
set(oAc, 'candidates[1].fracos[3]',
'Segue SEM vice a quatro dias do prazo de 05/Ago. Tereza Cristina lamentou o fim da articulação após a negativa do PP e ele afirma negociar com outros partidos, sem nome novo anunciado.', 'AC.c1.fr3')
set(oAc, 'candidates[1].analise',
`O sinal dele hoje é de alta no preço e de aperto no arranjo político, e as duas coisas não se anulam. SOBE 0,40pp no contrato de vencedor, para 24,75% (vol USD 7,79M), sexto pregão seguido sem queda, e ainda assim VÊ O GAP ABRIR para +40,75pp, porque Lula subiu mais. Nos books de colocação ele SOBE 1,00pp no 2º lugar do 1º turno, para 79,50% (vol USD 216 mil), a maior marca dele ali no acompanhamento do painel, e cede no 3º lugar, para 4,95%. Somados, os dois movimentos dizem que a posição de returno dele ficou mais consolidada, não menos. ${PORTAS} O painel registra ainda, como cobertura e não como número, que a imprensa atribui parte da resistência do Centrão à exposição dele ao caso Master, sem que exista medida de mercado para isso. Na urna, a leitura mais recente segue sendo a Vox Brasil de 31/Jul, com 31,2% no 1º turno e 41,1% no returno.`,
  'AC.c1.analise')

set(oAc, 'candidates[2].header',
'Polymarket 7,60% no vencedor (queda 0,55pp, vol USD 8,72M acumulado), o menor valor dele desde 14/Mai. A queda é de sequência: 12,00% em 23/Jul, 4,40pp cedidos em nove rodadas. No 2º lugar do 1º turno CAI 0,80pp, para 8,55%, e no 3º lugar fica ESTÁVEL em 61,50%.',
  'AC.c2.header')
set(oAc, 'candidates[2].fortes[0]',
'Fica ESTÁVEL em 61,50% no book de 3º lugar do 1º turno, e a folga sobre Caiado AUMENTOU, porque o adversário caiu 5,00pp ali.', 'AC.c2.f0')
set(oAc, 'candidates[2].fortes[1]',
'Mantém o maior volume acumulado entre os nomes competitivos do presidencial, USD 8,72M, acima de Lula e de Flávio.', 'AC.c2.f1')
set(oAc, 'candidates[2].fracos[0]',
'CAI 0,55pp no contrato de vencedor, para 7,60%, o menor valor dele desde 14/Mai e o quinto pregão seguido de queda.', 'AC.c2.fr0')
set(oAc, 'candidates[2].fracos[1]',
'Cedeu 4,40pp em nove rodadas, de 12,00% em 23/Jul para 7,60% hoje, com alta em apenas uma delas.', 'AC.c2.fr1')
set(oAc, 'candidates[2].analise',
`${RENAN} E o movimento de hoje resolve, para um lado, a contradição que o painel registrou ontem. Em 30/Jul o dinheiro tinha tirado dele a chance de returno, derrubando o book de 2º lugar de 11,70% para 6,10%; em 31/Jul devolveu boa parte, levando a 9,35%; hoje tirou de novo 0,80pp, para 8,55%. Três direções em três pregões no mesmo book, com o contrato de vencedor caindo em todos eles. A leitura que sobrevive é a do vencedor, que é onde o volume está: USD 8,72M, o maior entre os nomes competitivos. No 3º lugar ele ficou ESTÁVEL em 61,50% e a folga sobre Caiado aumentou, porque o adversário desabou 5,00pp ali. Sobre a urna, nada mudou: a última nacional segue sendo a Vox Brasil de 31/Jul, que lhe deu 3,0%. Com o preço agora em 7,60%, a distância entre mercado e urna FECHOU de 5,15pp para 4,60pp, e fechou pelo lado do preço, não da urna.`,
  'AC.c2.analise')

set(oAc, 'candidates[3].header',
'Polymarket: Caiado 1,35% (queda 0,25pp, vol USD 5,24M), Jair 0,55% (queda 0,30pp), Camilo Santana 0,45% (queda 0,90pp, mínimo da série), Alckmin 0,35% (queda 0,10pp), Zema 0,35% (estável), Haddad 0,25%, Michelle 0,25%, Tereza Cristina 0,25%, Tarcísio 0,05%. Todo o pelotão cedeu ou ficou parado, e nenhum nome passa de 1,35%.',
  'AC.c3.header')
set(oAc, 'candidates[3].fortes[0]',
'Caiado segue com a melhor urna nacional do recorte, os 5,5% da Vox Brasil de 31/Jul, acima dos 5% da PoderData e dos 3,1% da AtlasIntel.', 'AC.c3.f0')
set(oAc, 'candidates[3].fortes[1]',
'Caiado mantém o segundo lugar no book de 3º colocado do 1º turno, com 22,50%, atrás apenas de Renan Santos.', 'AC.c3.f1')
set(oAc, 'candidates[3].fortes[2]',
'Tereza Cristina subiu 0,05pp, para 0,25%, no dia seguinte ao veto do PP à candidatura dela a vice, num contrato que mede Presidência e não a vaga de vice.', 'AC.c3.f2')
set(oAc, 'candidates[3].fracos[0]',
'Caiado CAIU 0,25pp no vencedor, para 1,35%, e DESABOU 5,00pp no book de 3º lugar, de 27,50% para 22,50%, desfazendo em um pregão a alta da véspera.', 'AC.c3.fr0')
set(oAc, 'candidates[3].fracos[1]',
'Nenhum nome do pelotão passa de 1,35% no contrato presidencial, contra 65,50% do favorito.', 'AC.c3.fr1')
set(oAc, 'candidates[3].fracos[4]',
'Camilo Santana devolveu 0,90pp e foi a 0,45%, o menor valor dele na série do AFOS, abaixo dos 0,50% de 30/Jul, desfazendo em um pregão a alta da véspera.', 'AC.c3.fr4')
set(oAc, 'candidates[3].analise',
`O pelotão inteiro encolheu, e essa é a diferença em relação a ontem, quando os sinais eram cruzados. CAIADO caiu 0,25pp no vencedor, para 1,35% (vol USD 5,24M), e DESABOU 5,00pp no book de 3º lugar, de 27,50% para 22,50% (vol USD 37 mil), desfazendo em um pregão exatamente a alta que o painel registrou ontem. A ressalva de série cabe e não é de colapso: o mínimo dele é 0,90%, de 09/Jul, então 1,35% está acima do piso, ainda que abaixo da faixa de 1,80% a 2,40% em que oscilou entre 22 e 30/Jul. CAMILO SANTANA devolveu 0,90pp e foi a 0,45%, menor valor dele na série, abaixo dos 0,50% de 30/Jul: em dois pregões ele subiu do mínimo e voltou para baixo dele. JAIR BOLSONARO caiu 0,30pp, para 0,55%, e ALCKMIN cedeu 0,10pp, para 0,35%. ZEMA ficou ESTÁVEL em 0,35%, interrompendo quatro pregões de queda, e subiu para 4,60% no book de 3º lugar. TEREZA CRISTINA subiu 0,05pp, para 0,25%, no dia seguinte ao veto do PP, num contrato que mede quem ganha a Presidência e não quem ocupa a vaga de vice. ${TARCISIO}`,
  'AC.c3.analise')

// sub-estruturas do pelotão
set(oAc, 'candidates[3].caiado.label',
'CAIADO (PSD), Poly presidencial 1,35% (queda 0,25pp, vol USD 5,24M) | 3º lugar do 1º turno 22,50% (queda 5,00pp, vol USD 37 mil) | 2º lugar 1,00% | candidato oficializado em 26/Jul, com Kassab de vice | última nacional: Vox Brasil 31/Jul, 1T 5,5%',
  'AC.c3.caiado.label')
set(oAc, 'candidates[3].caiado.fortes',
'A melhor urna nacional do recorte segue sendo dele, os 5,5% da Vox Brasil de 31/Jul, acima dos 5% da PoderData de 30/Jul e bem acima dos 3,1% da AtlasIntel de 29/Jul. No book de 3º colocado do 1º turno ele mantém o segundo lugar, com 22,50%, atrás apenas de Renan Santos. E a divergência entre institutos sobre ele segue aberta em QUATRO níveis dentro do mesmo mês, 6% na Nexus, 5,5% na Vox, 5% na PoderData e 3,1% na AtlasIntel.',
  'AC.c3.caiado.fortes')
set(oAc, 'candidates[3].caiado.fracos',
'O contrato de vencedor CAIU 0,25pp, para 1,35%, e o de 3º lugar DESABOU 5,00pp, de 27,50% para 22,50%, desfazendo em um único pregão toda a alta que o painel registrou na véspera. A ressalva de série é obrigatória e não descreve colapso: o mínimo dele na série do AFOS é 0,90%, de 09/Jul, então 1,35% segue acima do piso, ainda que abaixo da faixa de 1,80% a 2,40% em que ele oscilou entre 22 e 30/Jul. O que fica é que a realocação de ontem, do vencedor para o terceiro lugar, foi desfeita em 24 horas, e agora ele cede nos dois books ao mesmo tempo.',
  'AC.c3.caiado.fracos')
set(oAc, 'candidates[3].zema.label',
'ZEMA (Novo), Poly presidencial 0,35% (estável, vol USD 4,61M) | 3º lugar do 1º turno 4,60% | Vox Brasil 31/Jul: 1T 3,2% | oficializado pelo Novo em 27/Jul, ainda SEM vice, prazo até 05/Ago',
  'AC.c3.zema.label')
set(oAc, 'candidates[3].zema.fracos',
'Segue SEM vice definida, com o prazo de 05/Ago a quatro dias, e o Novo descartou Barbosa para a vaga. Ressalva de série, e ela é grande: o máximo dele na série do AFOS é 10,10%, de 26/Abr, então 0,35% é menos de um vigésimo daquele nível e movimentos nessa faixa têm valor informativo quase nulo.',
  'AC.c3.zema.fracos')
set(oAc, 'candidates[3].haddad.label',
'HADDAD (PT), Poly presidencial 0,25% (estável) | 2º lugar do 1º turno 1,00% | não testado pela Vox Brasil em nenhum cenário, porque disputa o governo de São Paulo',
  'AC.c3.haddad.label')
set(oAc, 'candidates[3].haddad.fortes',
'Fica ESTÁVEL em 0,25% no contrato de vencedor e mantém 1,00% no book de 2º lugar do 1º turno, interrompendo a sequência de alta sem ceder.',
  'AC.c3.haddad.fortes')

// quadro comparativo
const Q: Array<[number, string, string]> = [
  [0, '65,50% (vol USD 7,82M acumulado)', 'SUBIU 1,00pp e foi a 65,50%, MÁXIMO da série do AFOS pelo segundo dia seguido. O gap sobre Flávio ABRIU de +40,15pp para +40,75pp, também máximo da série.'],
  [1, '24,75% (vol USD 7,79M acumulado)', 'SOBE 0,40pp para 24,75% e ainda assim vê o gap ABRIR, porque Lula subiu mais. SOBE 1,00pp no 2º lugar do 1º turno, para 79,50%, e cede para 4,95% no 3º lugar.'],
  [2, '7,60% (vol USD 8,72M acumulado)', 'CAI 0,55pp, para 7,60%, o menor valor dele desde 14/Mai, no quinto pregão seguido de queda. Cede 0,80pp no 2º lugar do 1º turno, para 8,55%, e fica ESTÁVEL em 61,50% no 3º lugar.'],
  [3, '1,35% (vol USD 5,24M)', 'CAI 0,25pp no vencedor, para 1,35%, e DESABA 5,00pp no book de 3º lugar, de 27,50% para 22,50%, desfazendo em um pregão a alta da véspera. O mínimo da série dele é 0,90%, de 09/Jul.'],
  [4, '0,35% (vol USD 4,61M)', 'ESTÁVEL em 0,35%, interrompendo quatro pregões seguidos de queda, e SOBE para 4,60% no book de 3º lugar do 1º turno.'],
  [5, '3,10% (vol USD 83 mil)', 'ESTÁVEL em 3,10% pelo terceiro pregão, sem variação nas leituras das duas rodadas da trava de hoje.'],
]
for (const [i, m, t] of Q) { set(oAc, `quadroComparativo[${i}].m`, m, `AC.q${i}.m`); set(oAc, `quadroComparativo[${i}].t`, t, `AC.q${i}.t`) }
set(oAc, 'quadroComparativo[5].s',
'Dia sem fato institucional novo que toque o objeto deste contrato, que mede remoção de MINISTRO do STF. O eixo judicial produziu fato, o segundo inquérito sobre Lulinha, mas ele mira um particular e não integrante da Corte. Com USD 83 mil de volume acumulado contra USD 117,52M do presidencial, preço parado diante de fato que não toca o objeto é o comportamento esperado.',
  'AC.q5.s')

set(oAc, 'cruzamento',
`O CRUZAMENTO DE 01/AGO tem um só eixo no mercado e ele é o mesmo de ontem, agora repetido. Lula SUBIU 1,00pp e foi a 65,50% (vol USD 7,82M), MÁXIMO da série do AFOS, que cobre de 14/Abr a hoje, pelo segundo dia seguido. Flávio Bolsonaro SUBIU 0,40pp, para 24,75% (vol USD 7,79M), e mesmo assim o gap ABRIU de +40,15pp para +40,75pp, também máximo da série que tem os dois nomes, iniciada em 03/Mai. Nos dois dias o recorde veio com o adversário subindo junto, o que descreve demanda pelo favorito e não deterioração do outro lado. `
  + `E há uma assimetria que vale registrar sem explicar: o preço andou 2,00pp em dois pregões SEM nenhuma urna nacional nova. A última segue sendo a Vox Brasil de 31/Jul (n=2.100, campo 26 a 28/Jul, margem de 2,15pp, 95% de confiança, BR-01084/2026), que deu Lula 40,5% x Flávio 31,2% no 1º turno e 47,5% x 41,1% no returno. O painel não atribui causa ao movimento e não tem como: não houve leitura de intenção de voto no intervalo. `
  + `${RENAN} E o movimento de hoje resolve, para um lado, a contradição registrada ontem: em 30/Jul o dinheiro tirou dele a chance de returno, em 31/Jul devolveu boa parte, e hoje tirou de novo 0,80pp no book de 2º lugar, que vai a 8,55%. Três direções em três pregões, com o contrato de vencedor caindo em todos. Com o preço em 7,60% e a urna em 3,0%, a distância entre mercado e urna FECHOU de 5,15pp para 4,60pp, e fechou pelo lado do preço. `
  + `O PELOTÃO ENCOLHEU TODO, e é a diferença em relação a ontem, quando os sinais eram cruzados. CAIADO caiu 0,25pp no vencedor, para 1,35% (vol USD 5,24M), e DESABOU 5,00pp no book de 3º lugar, de 27,50% para 22,50% (vol USD 37 mil), desfazendo em um pregão a alta da véspera; a ressalva de série cabe e não descreve colapso, porque o mínimo dele é 0,90%, de 09/Jul. CAMILO SANTANA devolveu 0,90pp e foi a 0,45% (vol USD 4,19M), menor valor dele na série, abaixo dos 0,50% de 30/Jul: subiu do mínimo e voltou para baixo dele em dois pregões. Jair Bolsonaro caiu 0,30pp, para 0,55%, Alckmin cedeu 0,10pp, para 0,35%, e Zema ficou ESTÁVEL em 0,35%, interrompendo quatro quedas seguidas. ${TARCISIO} `
  + `${PORTAS} Tereza Cristina aparece em 0,25% no contrato PRESIDENCIAL, alta de 0,05pp, e a distinção importa: aquele contrato mede quem ganha a Presidência, não quem ocupa a vaga de vice. `
  + `NO EIXO JUDICIAL, o fato novo é do campo do governo. Em 31/Jul à tarde, André Mendonça autorizou um SEGUNDO inquérito da Polícia Federal sobre Fábio Luís Lula da Silva, o Lulinha, desta vez a respeito da atuação dele junto à Dataprev, um dia depois de autorizar o primeiro, sobre o Ministério da Saúde. Nada disso é condenação e o painel não trata como tal: são dois inquéritos abertos. No caso Master, o Novo protocolou a representação contra o senador Jaques Wagner no Conselho de Ética, dando seguimento ao pedido anunciado na véspera, e o PT oficializou o nome dele na convenção estadual da Bahia neste sábado. `
  + `NO CALENDÁRIO, o PT oficializa a candidatura de Lula em convenção nacional em 02/Ago, e o Republicanos tem convenção nacional marcada para 04/Ago, que é onde se decide a aliança presidencial. O prazo de 05/Ago para definição de vices vale para Flávio e para Zema, e nenhum dos dois tem nome fechado. `
  + `NOS DEMAIS MERCADOS, o impeachment de ministro do STF ficou ESTÁVEL em 3,10% (vol USD 83 mil) pelo terceiro pregão. No Senado, o PL subiu 0,50pp, para 72,50% (vol USD 259 mil), e o MDB CAIU para 21,35%, saindo da faixa de 24,65% a 26,65% em que o painel o publicou ontem, num book de USD 8 mil que não sustenta leitura. Na inflação, a faixa modal segue em 5,00% a 5,49%, com 38,20%, e a de 4,50% a 4,99% subiu 0,30pp, para 34,00%, num book de USD 81 mil. `
  + `${TRAVA} Volume total acumulado no presidencial em USD 117,52M.`,
  'AC.cruzamento')

if (erros.length) { console.error('❌ ABORTADO:'); erros.forEach(e => console.error('   • ' + e)); process.exit(1) }
writeFileSync(P_AC, JSON.stringify(oAc, null, 2) + '\n', 'utf-8')
console.log('✅ analysis-criteriosa.json atualizado para 01/Ago 13:49')
