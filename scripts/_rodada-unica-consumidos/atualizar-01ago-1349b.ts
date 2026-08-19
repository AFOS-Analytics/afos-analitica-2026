/** /atualizar-brz 01/Ago 13:49 — parte B: analysis-data, polls-data e CandidatesSection. */
import { readFileSync, writeFileSync } from 'node:fs'

const erros: string[] = []
const P_AD = 'public/analysis-data.json'
const P_PD = 'public/polls-data.json'
const P_TSX = 'app/components/CandidatesSection.tsx'
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

oAd.updatedAt = '01/08/2026, 13:49'
oPd.lastUpdate = '2026-08-01'

const TRAVA = 'A trava de dupla leitura reprovou a primeira rodada, com Renan Santos em trânsito de 7,15% para 7,60% e o 3º lugar de Caiado entre 22,00% e 22,50%, e APROVOU a segunda. Todos os preços entram firmes, sem faixa declarada. Captura ao vivo 01/Ago 16:49 UTC.'
const RENAN = 'RENAN SANTOS caiu 0,55pp e foi a 7,60% (vol USD 8,72M), o menor valor dele desde 14/Mai, e a queda é de sequência: 12,00% em 23/Jul, com 4,40pp cedidos em nove rodadas. Antes de 14/Mai a série registra valores menores, por isso a janela é declarada.'

// ─────────────────────────── analysis-data ───────────────────────────
set(oAd, 'cards.sentimento.text1',
'A 64 dias do 1º turno NÃO houve urna nacional nova. A última segue sendo a Vox Brasil de 31/Jul (n=2.100, campo 26 a 28/Jul, margem de 2,15pp, 95% de confiança, BR-01084/2026): Lula 40,5% x Flávio Bolsonaro 31,2% no 1º turno, com Caiado 5,5%, Zema 3,2% e Renan Santos 3,0%, e 47,5% x 41,1% no returno. A pesquisa do dia é ESTADUAL e por isso não entra no painel nacional: a Datafolha de Pernambuco dá Lula 57% x Flávio 22% no estado, e na disputa pelo governo mostra Raquel Lyra com 48% e João Campos com 42%. Somando a semana, três nacionais mediram o gap do 1º turno em 9,1pp, 6pp e 9,3pp, e a que destoa segue sendo a PoderData.',
  'AD.sent.text1')
set(oAd, 'cards.sentimento.text2',
`O cruzamento do dia repete o de ontem e vai além. Lula SUBIU 1,00pp e foi a 65,50%, MÁXIMO da série do AFOS pelo segundo dia seguido, e o gap ABRIU de +40,15pp para +40,75pp, também máximo. Nos dois dias o adversário subiu junto, o que descreve demanda pelo favorito e não deterioração do outro lado. A assimetria que fica registrada é esta: o preço andou 2,00pp em dois pregões SEM nenhuma urna nacional no intervalo, então não há leitura de intenção de voto para acompanhar o movimento e o painel não atribui causa. ${RENAN}`,
  'AD.sent.text2')
set(oAd, 'cards.sentimento.text3',
'No mercado, Lula SUBIU 1,00pp e foi a 65,50% (vol USD 7,82M), máximo da série do AFOS. Flávio subiu 0,40pp, para 24,75% (vol USD 7,79M), e mesmo assim o gap ABRIU para +40,75pp. Renan Santos caiu 0,55pp, para 7,60% (vol USD 8,72M). O pelotão inteiro cedeu: Caiado caiu 0,25pp, para 1,35% (vol USD 5,24M), Jair Bolsonaro caiu 0,30pp, para 0,55%, Camilo Santana devolveu 0,90pp e foi a 0,45% (vol USD 4,19M), Alckmin cedeu 0,10pp, para 0,35%, e Zema ficou estável em 0,35%. Haddad e Michelle seguem em 0,25%, Tereza Cristina subiu 0,05pp, para 0,25%, e Tarcísio de Freitas está em 0,05%, com USD 13,69M de volume acumulado, o maior do book. O volume total acumulado no presidencial soma USD 117,52M.',
  'AD.sent.text3')
set(oAd, 'cards.sentimento.direita',
'Flávio subiu 0,40pp, para 24,75% (vol USD 7,79M), sexto pregão seguido sem queda, e ainda assim viu o gap ABRIR para +40,75pp, porque Lula subiu mais. Nos sub-mercados o sinal foi favorável a ele: SOBE 1,00pp no 2º lugar do 1º turno, para 79,50% (vol USD 216 mil), a maior marca dele naquele contrato no acompanhamento do painel, e cede para 4,95% no 3º lugar. Somados, os dois movimentos dizem que a posição de returno ficou mais consolidada, não menos. No arranjo de chapa, porém, ele segue SEM vice a quatro dias do prazo de 05/Ago. Tereza Cristina lamentou publicamente o fim da articulação depois da negativa do PP, dizendo que o que foi está posto, e ele agradeceu e afirmou que negocia com outros partidos, sem anunciar nome. Neste sábado o Republicanos oficializou a candidatura de Tarcísio de Freitas à REELEIÇÃO no governo de São Paulo, com Flávio presente, mas o próprio Tarcísio manteve o foco no estado e evitou nacionalizar o discurso. O painel separa as duas coisas: a convenção de hoje é estadual, e a nacional, que decide aliança presidencial, está marcada para 04/Ago.',
  'AD.sent.direita')
set(oAd, 'cards.sentimento.esquerda',
'Lula SUBIU 1,00pp e foi a 65,50% (vol USD 7,82M), máximo da série do AFOS pelo segundo dia seguido, e o gap ABRIU para +40,75pp, também máximo. O movimento veio com Flávio subindo junto nos dois dias, o que afasta a leitura de deterioração do adversário. Não houve urna nacional nova no intervalo, então o preço andou 2,00pp em dois pregões sem nenhuma leitura de intenção de voto para acompanhar, e o painel registra a assimetria sem explicá-la. No campo dele, o mercado desfez o movimento da véspera: Camilo Santana devolveu 0,90pp e foi a 0,45%, menor valor dele na série, abaixo dos 0,50% de 30/Jul, e Alckmin cedeu 0,10pp, para 0,35%. O apoio formal do PCdoB continua valendo e o preço voltou ao ponto de partida em 24 horas, o que basta para o painel não ligar uma coisa à outra. No calendário, o PT oficializa a candidatura dele em convenção nacional em 02/Ago, depois das estaduais do Ceará, em 31/Jul, e da Bahia, hoje. E o campo dele levou um fato judicial novo: em 31/Jul à tarde, André Mendonça autorizou um SEGUNDO inquérito sobre Lulinha, agora quanto à atuação junto à Dataprev, um dia depois do primeiro. Inquérito não é condenação.',
  'AD.sent.esquerda')
set(oAd, 'cards.sentimento.terceiraVia',
'O pelotão inteiro encolheu, e essa é a diferença em relação a ontem, quando os sinais eram cruzados. CAIADO caiu 0,25pp no vencedor, para 1,35% (vol USD 5,24M), e DESABOU 5,00pp no book de 3º lugar do 1º turno, de 27,50% para 22,50% (vol USD 37 mil), desfazendo em um pregão a alta da véspera. A ressalva de série cabe e não descreve colapso: o mínimo dele é 0,90%, de 09/Jul, então 1,35% segue acima do piso, ainda que abaixo da faixa de 1,80% a 2,40% em que oscilou entre 22 e 30/Jul. RENAN SANTOS caiu 0,55pp, para 7,60%, o menor valor dele desde 14/Mai, e cedeu 0,80pp no 2º lugar do 1º turno, para 8,55%, ficando ESTÁVEL em 61,50% no 3º lugar. Com o preço em 7,60% e a urna em 3,0%, a distância entre mercado e urna FECHOU de 5,15pp para 4,60pp, e fechou pelo lado do preço. CAMILO SANTANA devolveu 0,90pp e foi a 0,45%, menor valor dele na série. ZEMA ficou ESTÁVEL em 0,35%, interrompendo quatro pregões seguidos de queda, e subiu para 4,60% no book de 3º lugar. Tarcísio de Freitas está em 0,05%, com o maior volume acumulado do book, USD 13,69M, e a série do AFOS tem só três dias para esse nome, então o painel registra o nível sem afirmar superlativo.',
  'AD.sent.terceiraVia')
set(oAd, 'cards.sentimento.polymarket',
`Lula 65,50% (alta 1,00pp, vol USD 7,82M), Flávio 24,75% (alta 0,40pp, vol USD 7,79M), Renan Santos 7,60% (queda 0,55pp, vol USD 8,72M), Caiado 1,35% (queda 0,25pp, vol USD 5,24M), Jair 0,55% (queda 0,30pp), Camilo Santana 0,45% (queda 0,90pp, vol USD 4,19M), Alckmin 0,35% (queda 0,10pp), Zema 0,35% (estável), Haddad 0,25%, Michelle 0,25%, Tereza Cristina 0,25% (alta 0,05pp), Tarcísio 0,05% (vol USD 13,69M). Gap Lula sobre Flávio em +40,75pp, contra +40,15pp em 31/Jul, máximo da série iniciada em 03/Mai. Volume total acumulado no presidencial em USD 117,52M. Sub-mercados: 2º lugar do 1º turno com Flávio 79,50% (alta 1,00pp, vol USD 216 mil), Renan Santos 8,55% (queda 0,80pp, vol USD 1,09M) e Lula 8,40%; 3º lugar com Renan 61,50% (estável, vol USD 165 mil), Caiado 22,50% (QUEDA de 5,00pp, vol USD 37 mil), Flávio 4,95% e Zema 4,60%; impeachment de ministro do STF ESTÁVEL em 3,10% (vol USD 83 mil); Senado com PL 72,50% (alta 0,50pp, vol USD 259 mil) e MDB 21,35%, abaixo da faixa de 24,65% a 26,65% publicada ontem; inflação com a faixa de 5,00% a 5,49% em 38,20% e a de 4,50% a 4,99% em 34,00% (alta 0,30pp). ${TRAVA}`,
  'AD.sent.polymarket')

set(oAd, 'cards.inss.text1',
'A pauta fiscal não teve fato novo neste sábado, com o Senado em recesso e o Orçamento como próxima frente de atrito. O dia político foi de CONVENÇÃO. O Republicanos oficializou a candidatura de Tarcísio de Freitas à reeleição no governo de São Paulo, com Flávio Bolsonaro presente ao palanque e com o próprio Tarcísio evitando nacionalizar o discurso; a convenção nacional do partido, que decide aliança presidencial, é só em 04/Ago. Do outro lado, o PT realizou convenções estaduais no Ceará, em 31/Jul, com Lula presente, e na Bahia neste sábado, onde oficializou Jerônimo Rodrigues, Jaques Wagner e Rui Costa, e oficializa a candidatura de Lula em convenção nacional em 02/Ago. Michelle Bolsonaro não cravou a candidatura ao Senado e disse que decide com Jair Bolsonaro.',
  'AD.inss.text1')
set(oAd, 'cards.inss.text2',
`O mercado repetiu o movimento da véspera e o ampliou: Lula subiu 1,00pp, para 65,50%, máximo da série do AFOS pelo segundo dia seguido, e o gap foi a +40,75pp, também máximo. Todo o resto do book cedeu ou ficou parado. ${RENAN} O pelotão inteiro encolheu, com Caiado em 1,35%, Camilo Santana em 0,45%, que é o menor valor dele na série, e Jair Bolsonaro em 0,55%. A assimetria do dia é que nada disso teve urna nacional para acompanhar: a última segue sendo a Vox Brasil de 31/Jul.`,
  'AD.inss.text2')
set(oAd, 'cards.inss.text3',
'O mercado de impeachment de ministro do STF ficou ESTÁVEL em 3,10% (vol USD 83 mil), sem variação nas leituras das duas rodadas da trava de captura de hoje, no terceiro pregão seguido no mesmo valor. O eixo judicial produziu fato novo, o segundo inquérito sobre Lulinha, mas ele mira um particular e não integrante da Corte, então preço parado ali não é resposta do mercado ao que saiu. Com USD 83 mil de volume acumulado contra USD 117,52M do presidencial, este contrato só é registrável quando se move de forma sustentada.',
  'AD.inss.text3')
set(oAd, 'cards.inss.text4',
'No Senado, o PL SUBIU 0,50pp e foi a 72,50% (vol USD 259 mil), e o MDB CAIU para 21,35%, saindo por baixo da faixa de 24,65% a 26,65% em que o painel o publicou ontem, num book de USD 8 mil que não sustenta leitura de reprecificação. Somando os dois, o contrato passa de 93% de probabilidade atribuída a apenas duas legendas, o que por si só indica spread largo. Na inflação, a faixa modal segue em 5,00% a 5,49%, com 38,20%, e a de 4,50% a 4,99% subiu 0,30pp, para 34,00%, num book de USD 81 mil que NÃO é coberto pela trava.',
  'AD.inss.text4')
set(oAd, 'cards.inss.conclusao',
'A 64 dias da eleição, o dia foi de repetição no mercado e de calendário na política. O preço do favorito rompeu o próprio topo pelo segundo pregão seguido, indo a 65,50%, e o gap foi a +40,75pp, ambos máximos da série do AFOS. Não houve urna nacional nova para acompanhar, e o painel registra que o preço andou 2,00pp em dois dias sem leitura de intenção de voto no intervalo. Na política, o dia foi de convenção: Tarcísio oficializado à reeleição em São Paulo pelo Republicanos com Flávio no palanque, PT em convenções estaduais no Ceará e na Bahia antes da nacional de 02/Ago, e Michelle Bolsonaro ainda sem cravar a candidatura ao Senado. Flávio segue sem vice a quatro dias do prazo. Nenhuma dessas leituras é atribuída a causa: o painel registra a coincidência de datas e não afirma que o preço subiu por causa delas.',
  'AD.inss.conclusao')

set(oAd, 'cards.bancoMaster.text1',
'Neste sábado o caso Master não teve ato judicial novo, e o registro é de desdobramento do que saiu em 31/Jul. O Novo protocolou a representação contra o senador Jaques Wagner no Conselho de Ética do Senado, dando seguimento ao pedido anunciado na véspera. O que sustenta a representação é o relatório da Polícia Federal tornado público quando André Mendonça retirou o sigilo de parte da investigação: 74 ligações entre o senador e Augusto Lima, ex-sócio do banco, entre novembro de 2023 e maio de 2025, somando mais de cinco horas e trinta minutos de conversa em 555 dias.',
  'AD.master.text1')
set(oAd, 'cards.bancoMaster.text2',
'No mesmo dia em que a representação foi protocolada, o PT oficializou o nome de Jaques Wagner na convenção estadual da Bahia, ao lado de Jerônimo Rodrigues e Rui Costa, com lideranças do partido exaltando o legado dele. O painel registra os dois fatos lado a lado e não os transforma um no outro: representação partidária no Conselho de Ética e oficialização em convenção são processos distintos, e nenhum dos dois decide o outro. Wagner disse publicamente que vai provar inocência. Nada disso é condenação.',
  'AD.master.text2')
set(oAd, 'cards.bancoMaster.text3',
'Na frente legislativa não houve novidade, e a ausência segue sendo o fato: o mandado de segurança sobre a instalação da CPI do Banco Master continua há mais de quatro meses no gabinete de Kassio Nunes Marques. Sobre o preço, o registro é de imobilidade: o mercado de impeachment de ministro do STF ficou ESTÁVEL em 3,10%, num book de USD 83 mil, no terceiro pregão seguido no mesmo valor. Vale repetir a ressalva de ontem, porque ela continua valendo: esse contrato NÃO precifica o caso Wagner, que corre contra um senador e não contra um ministro.',
  'AD.master.text3')
set(oAd, 'cards.bancoMaster.conclusao',
'As frentes do caso Master seguem em trilhos separados. A criminal, no STF sob relatoria de André Mendonça, teve seu maior movimento em 31/Jul, com o sigilo levantado e o relatório da PF vindo a público, e neste sábado não produziu ato novo. A patrimonial segue na Justiça do Rio, com bloqueios. A legislativa segue parada há mais de quatro meses. A partidária ganhou passo: o Novo protocolou representação contra Jaques Wagner no Conselho de Ética. E a frente que divide a mesma relatoria, mas não é do Master, ficou mais pesada: Mendonça autorizou em 31/Jul um SEGUNDO inquérito sobre Lulinha, agora quanto à Dataprev, um dia depois do primeiro. O painel registra que o mesmo ministro concentra as apurações e não extrai disso leitura de intenção.',
  'AD.master.conclusao')

set(oAd, 'cards.stf.mendonca',
'Segue como relator do inquérito aberto em 23/Jul sobre os repasses de Vorcaro para o filme sobre Jair Bolsonaro e concentra as apurações de maior impacto do período. Em 30/Jul autorizou o primeiro inquérito sobre tráfico de influência de Fábio Luís Lula da Silva, o Lulinha, junto ao Ministério da Saúde; em 31/Jul à tarde autorizou um SEGUNDO, sobre a atuação dele junto à Dataprev; e no mesmo 31/Jul retirou o sigilo de parte da investigação sobre o senador Jaques Wagner no caso Master e autorizou monitorar a localização do celular dele. Neste sábado não houve ato novo.',
  'AD.stf.mendonca')
set(oAd, 'cards.stf.nexo',
'O nexo deste sábado é de CALENDÁRIO PARTIDÁRIO, e o eixo judicial entra como herança do dia anterior. O Republicanos oficializou Tarcísio de Freitas à reeleição no governo de São Paulo, com Flávio Bolsonaro no palanque e sem que o próprio Tarcísio nacionalizasse o discurso; a convenção nacional do partido, que trata de aliança presidencial, é em 04/Ago. O PT fez convenções estaduais no Ceará e na Bahia e oficializa Lula em 02/Ago. Michelle Bolsonaro não cravou a candidatura ao Senado. Flávio segue sem vice a quatro dias do prazo de 05/Ago, depois da negativa do PP a Tereza Cristina. No eixo judicial, o fato de 31/Jul que se estende para hoje é o segundo inquérito sobre Lulinha, autorizado por Mendonça, e a representação do Novo contra Jaques Wagner no Conselho de Ética.',
  'AD.stf.nexo')
set(oAd, 'cards.stf.analise',
'O mercado de impeachment de ministro do STF antes de 2027 ficou ESTÁVEL em 3,10% (vol USD 83 mil), sem variação nas leituras das duas rodadas da trava de captura de hoje. É o terceiro pregão seguido no mesmo valor. O eixo judicial produziu fato no período, com dois inquéritos sobre Lulinha e a quebra de sigilo sobre um senador, mas nenhum deles aponta para remoção de integrante da Corte, que é o objeto deste contrato. Num book de USD 83 mil contra USD 117,52M do presidencial, preço parado diante de fato que não toca o objeto é o comportamento esperado.',
  'AD.stf.analise')

// ─────────────────────────── polls-data ───────────────────────────
const PRECOS: Array<[string, string, number]> = [
  ['Lula', '65,50%', 65.5], ['Flávio Bolsonaro', '24,75%', 24.75], ['Renan Santos', '7,60%', 7.6],
  ['Ronaldo Caiado', '1,35%', 1.35], ['Tarcísio', '0,05%', 0.05], ['Romeu Zema', '0,35%', 0.35],
  ['Fernando Haddad', '0,25%', 0.25],
]
const TEND: Record<string, string> = {
  'Lula': 'SUBIU 1,00pp e foi a 65,50% (vol USD 7,82M), MÁXIMO da série do AFOS pelo segundo dia seguido. O gap sobre Flávio ABRIU de +40,15pp para +40,75pp, também máximo da série que tem os dois nomes, iniciada em 03/Mai. Nos dois dias o recorde veio com o adversário subindo junto, o que descreve demanda pelo favorito e não deterioração do outro lado. E o preço andou 2,00pp em dois pregões SEM nenhuma urna nacional no intervalo, assimetria que o painel registra sem atribuir causa.',
  'Flávio Bolsonaro': 'SOBE 0,40pp e vai a 24,75% (vol USD 7,79M), sexto pregão seguido sem queda, e ainda assim vê o gap ABRIR para +40,75pp, porque Lula subiu mais. Nos sub-mercados o sinal foi favorável: SOBE 1,00pp no book de 2º lugar do 1º turno, que passa a 79,50% num contrato de USD 216 mil, a maior marca dele ali no acompanhamento do painel, e cede para 4,95% no de 3º lugar. A posição de returno ficou mais consolidada, não menos. No arranjo político, segue SEM vice a quatro dias do prazo de 05/Ago.',
  'Renan Santos': 'CAI 0,55pp e vai a 7,60% (vol USD 8,72M), o menor valor dele desde 14/Mai, no quinto pregão seguido de queda. A queda é de sequência, não de pregão: em 23/Jul ele estava em 12,00% e desde então cedeu em oito das nove rodadas, somando 4,40pp. Antes de 14/Mai a série registra valores menores, por isso a janela é declarada. No book de 2º lugar do 1º turno cede 0,80pp, para 8,55%, terceira direção em três pregões naquele contrato, e fica ESTÁVEL em 61,50% no de 3º lugar. Com a urna em 3,0%, a distância entre mercado e urna FECHOU de 5,15pp para 4,60pp, pelo lado do preço.',
  'Ronaldo Caiado': 'CAI 0,25pp e vai a 1,35% (vol USD 5,24M), e DESABA 5,00pp no book de 3º lugar do 1º turno, de 27,50% para 22,50% num contrato de USD 37 mil, desfazendo em um único pregão toda a alta que o painel registrou na véspera. A ressalva de série é obrigatória e não descreve colapso: o mínimo dele na série do AFOS é 0,90%, de 09/Jul, então 1,35% segue acima do piso, ainda que abaixo da faixa de 1,80% a 2,40% em que oscilou entre 22 e 30/Jul. A realocação de ontem, do vencedor para o terceiro lugar, foi desfeita em 24 horas, e agora ele cede nos dois books ao mesmo tempo.',
  'Tarcísio': 'Vai a 0,05%, com o maior volume acumulado do book presidencial, USD 13,69M. É a anomalia de legado que serve de lembrete permanente de método: volume mede história negociada e não convicção atual. Neste sábado o Republicanos oficializou a candidatura dele à REELEIÇÃO no governo de São Paulo. O painel registra o nível e NÃO afirma que é o menor dele: a série do AFOS tem apenas três dias para esse nome, entre 28/Abr e 14/Mai, e não sustenta superlativo.',
  'Romeu Zema': 'Fica ESTÁVEL em 0,35% (vol USD 4,61M), interrompendo quatro pregões seguidos de queda no contrato de ganhador, e SOBE para 4,60% no book de 3º lugar do 1º turno. Ressalva de série, e ela é grande: o máximo dele na série do AFOS é 10,10%, de 26/Abr, então 0,35% é menos de um vigésimo daquele nível e movimentos nessa faixa têm valor informativo quase nulo. Segue SEM vice, com o prazo de 05/Ago a quatro dias.',
  'Fernando Haddad': 'Fica ESTÁVEL em 0,25% e mantém 1,00% no book de 2º lugar do 1º turno, interrompendo a sequência de alta sem ceder. A ressalva de escala continua valendo: nesse nível de preço, movimento de 0,05pp ou 0,10pp tem valor informativo quase nulo, e o painel registra o nível, não a oscilação.',
}
// tendenciaPesquisa só muda onde ela cita PREÇO, porque não houve urna nacional nova
const TEND_PESQ: Record<string, string> = {
  'Renan Santos': 'TRÊS institutos seguidos o cortaram, e é a sequência que importa, não o número isolado: 7,8% na AtlasIntel de 29/Jul, 4% na PoderData de 30/Jul e 3,0% na Vox Brasil de 31/Jul. Não houve urna nacional nova desde então, mas o preço andou: com o mercado agora em 7,60%, a distância entre mercado e urna FECHOU de 5,15pp para 4,60pp, e fechou pelo lado do preço, não da urna. Em 29/Jul este painel registrou essa mesma distância em 0,90pp e a chamou de convergência; ela chegou a quadruplicar e agora recua, e fica registrado que a leitura de 29/Jul não se sustentou. A dispersão entre casas deixou de ser dispersão: as três leituras mais recentes são também as três mais baixas, o que descreve tendência de queda.',
  'Flávio Bolsonaro': 'Vox Brasil de 31/Jul (n=2.100, campo 26 a 28/Jul, margem de 2,15pp, BR-01084/2026) o traz em 31,2% no 1º turno e 41,1% no returno. Os 6,4pp que o separam de Lula ficam fora da margem somada, o que afasta a leitura de empate técnico que a PoderData sustentava em 30/Jul. Sem urna nacional nova desde então. No arranjo de chapa, o PP anunciou NEUTRALIDADE e com isso barrou a chapa que teria Tereza Cristina como vice; ela lamentou o fim da articulação, dizendo que o que foi está posto, e ele agradeceu e afirmou que negocia com outros partidos. Neste sábado o Republicanos oficializou Tarcísio de Freitas à REELEIÇÃO no governo de São Paulo, com ele presente ao palanque, mas a convenção nacional do partido, que decide aliança presidencial, é só em 04/Ago. O prazo de 05/Ago segue com a vice indefinida.',
}
for (const c of oPd.polymarketComparison.candidates) {
  const p = PRECOS.find(x => x[0] === c.name)
  if (!p) { erros.push(`PD: candidato inesperado "${c.name}"`); continue }
  c.polymarket = p[1]; c.odds = p[2]; c.value = p[2]
  if (TEND[c.name]) c.tendenciaPolymarket = TEND[c.name]; else erros.push(`PD: sem tendência nova para ${c.name}`)
  if (TEND_PESQ[c.name]) c.tendenciaPesquisa = TEND_PESQ[c.name]
}
set(oPd, 'polymarketComparison.note',
`Cruzamento de 01/Ago, captura das 13:49: segundo dia seguido de topo novo. Lula SUBIU 1,00pp e foi a 65,50% (vol USD 7,82M), MÁXIMO da série do AFOS, que cobre de 14/Abr a hoje. Flávio SUBIU 0,40pp, para 24,75% (vol USD 7,79M), e mesmo assim o gap ABRIU de +40,15pp para +40,75pp, também máximo da série que tem os dois nomes, iniciada em 03/Mai. Nos dois dias o recorde veio com o adversário subindo junto. SEM URNA NOVA: nenhuma nacional foi publicada desde a Vox Brasil de 31/Jul (n=2.100, campo 26 a 28/Jul, margem de 2,15pp, BR-01084/2026), então o preço andou 2,00pp em dois pregões sem leitura de intenção de voto no intervalo, e o painel não atribui causa. ${RENAN} Com a urna dele em 3,0%, a distância entre mercado e urna FECHOU de 5,15pp para 4,60pp, pelo lado do preço. O pelotão inteiro encolheu: Caiado a 1,35%, com queda de 5,00pp no book de 3º lugar, e Camilo Santana a 0,45%, menor valor dele na série. No arranjo político, Flávio segue sem vice a quatro dias do prazo de 05/Ago e o Republicanos oficializou Tarcísio à reeleição em São Paulo, deixando a decisão de aliança presidencial para a convenção nacional de 04/Ago. ${TRAVA}`,
  'PD.note')
set(oPd, 'polymarketComparison.sources',
'Polymarket via proxy AFOS (captura ao vivo 01/Ago 16:49 UTC, degraded false, failedCount 0, scripts/capture-guard.ts em DUAS rodadas: a primeira reprovada, com Renan Santos em trânsito de 7,15% para 7,60% e o 3º lugar de Caiado entre 22,00% e 22,50%, e a segunda APROVADA, com todos os books dentro de 0,20pp) + Vox Brasil 31/Jul (BR-01084/2026, n=2.100, campo 26-28/Jul, margem 2,15pp, última nacional) + PoderData/Aya 30/Jul (BR-07845/2026, n=2.400) + AtlasIntel/Bloomberg 29/Jul (BR-08602/2026, n=5.021, maior amostra do recorte) + BTG/Nexus 27/Jul (BR-01489/2026) + Datafolha 24/Jul (BR-01166/2026) + Gerp 22/Jul (BR-05026/2026) + Indexa 21/Jul (BR-02904/2026) + Real Time Big Data 21/Jul (BR-09247/2026) + PoderData/Aya 16/Jul (BR-00059/2026) + Genial/Quaest 15/Jul (BR-07181/2026) + Futura/Apex 14/Jul (BR-07294/2026) + AtlasIntel 01/Jul (BR-04582/2026). Série do AFOS conferida em scripts/check-superlativo.ts, direto no Neon, sem cap de janela: máximo de Lula em 65,50% (01/Ago) e máximo do gap em +40,75pp (01/Ago); Renan Santos com 7,60% hoje, menor desde 14/Mai, e máximo de 17,90% em 09/Jun; máximo de Camilo Santana em 4,10% (03/Mai) e mínimo agora em 0,45% (01/Ago); mínimo de Caiado em 0,90% (09/Jul); máximo de Zema em 10,10% (26/Abr). Para Tarcísio de Freitas a série tem apenas três dias, entre 28/Abr e 14/Mai, e por isso nenhum superlativo é afirmado sobre ele.',
  'PD.sources')

// ─────────────────────── CandidatesSection.tsx ───────────────────────
const linhas = tsx.split('\n')
const alvo: Record<number, string> = { 18: '65,50%', 28: '24,75%', 38: '7,60%', 48: '0,25%', 58: '1,35%', 68: '0,35%', 78: '0,05%' }
for (const [ln, v] of Object.entries(alvo)) {
  const i = +ln - 1
  if (!/polymarket:\s*"/.test(linhas[i])) { erros.push(`TSX linha ${ln} não é polymarket: ${linhas[i]}`); continue }
  linhas[i] = linhas[i].replace(/polymarket:\s*"[^"]+"/, `polymarket: "${v}"`)
}
tsx = linhas.join('\n')

if (erros.length) { console.error('❌ ABORTADO:'); erros.forEach(e => console.error('   • ' + e)); process.exit(1) }

// Gate de duas camadas (lição de 30/Jul): valor de ontem SOZINHO é sobrevivente;
// valor de ontem ao lado do de hoje na MESMA string é base de delta, e é legítimo.
const PROIBIDO = ['64,50%', '8,15%', '117,06M', '24,35%']
const SO_COM_PAR: Array<[string, string]> = [
  ['+40,15pp', '+40,75pp'], ['5,15pp', '4,60pp'], ['0,50% de 30/Jul', '0,45%'], ['12,00%', '7,60%'],
  ['27,50%', '22,50%'], ['9,35%', '8,55%'], ['78,50%', '79,50%'],
]
const textos: string[] = []
;(function walk(o: any) { for (const k of Object.keys(o)) { const v = o[k]; if (typeof v === 'string') textos.push(v); else if (v && typeof v === 'object') walk(v) } })({ oAd, pmc: oPd.polymarketComparison })
const alvoJson = textos.join('\n')
for (const s of PROIBIDO) {
  if (alvoJson.includes(s)) { console.error(`❌ valor de ontem sobreviveu: "${s}"`); process.exit(1) }
}
for (const [velho, novo] of SO_COM_PAR) {
  for (const t of textos) if (t.includes(velho) && !t.includes(novo)) {
    console.error(`❌ DELTA ÓRFÃO: "${velho}" sem "${novo}" no mesmo campo:\n   ${t.slice(0, 160)}`); process.exit(1)
  }
}
for (const s of ['65,50%', '+40,75pp', '7,60%', '117,52M']) {
  if (!alvoJson.includes(s)) { console.error(`❌ valor novo não entrou: "${s}"`); process.exit(1) }
}

writeFileSync(P_AD, JSON.stringify(oAd, null, 2) + '\n', 'utf-8')
writeFileSync(P_PD, JSON.stringify(oPd, null, 2) + '\n', 'utf-8')
writeFileSync(P_TSX, tsx, 'utf-8')
console.log('✅ analysis-data, polls-data e CandidatesSection atualizados para 01/Ago 13:49')
