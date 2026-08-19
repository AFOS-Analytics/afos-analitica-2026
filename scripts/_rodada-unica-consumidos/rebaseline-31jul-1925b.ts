/**
 * Rebaseline 19:25 — parte B: analysis-data, polls-data e CandidatesSection.
 * Inclui a CORREÇÃO do cartão do Master, que dizia "não trouxe ato novo".
 */
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

oAd.updatedAt = '31/07/2026, 19:25'
oPd.lastUpdate = '2026-07-31'

const TRAVA = 'A trava de dupla leitura rodou QUATRO rodadas hoje e reprovou todas. A terceira reprovou justamente porque Lula estava em trânsito de 63,50% para 64,50%; a quarta repetiu o contrato presidencial inteiro e reprovou um book só, o do MDB no Senado. Por isso o presidencial entra FIRME, incluindo os 64,50%, e o MDB entra como FAIXA declarada de 24,65% a 26,65%. Captura ao vivo 31/Jul 22:25 UTC.'

// ─────────────────────────── analysis-data ───────────────────────────
set(oAd, 'cards.sentimento.text2',
'O cruzamento do dia mudou de figura entre a tarde e o começo da noite. Às 17:33 o favorito estava parado em 63,50%; na captura das 19:25 ele SUBIU 1,00pp e foi a 64,50%, rompendo um teto que a série do AFOS vinha igualando sem superar em 26, 28, 30 e 31/Jul. Flávio subiu 0,40pp, para 24,35%, e ainda assim o gap ABRIU de +39,55pp para +40,15pp, o mais largo desde 03/Mai, início da série que tem os dois nomes, e o primeiro acima de 40pp. TRÊS institutos seguidos cortaram Renan Santos, e é a sequência que importa, não o número isolado: AtlasIntel 7,8% em 29/Jul, PoderData 4% em 30/Jul e Vox Brasil 3,0% em 31/Jul. Com o preço em 8,15%, a distância entre mercado e urna vai a 5,15pp, a maior do recorte. Em 29/Jul o painel registrou essa distância em 0,90pp e chamou de convergência. Três institutos depois, ela quadruplicou.',
  'AD.sent.text2')

set(oAd, 'cards.sentimento.text3',
'No mercado, Lula SUBIU 1,00pp e foi a 64,50% (vol USD 7,77M), o maior valor da série do AFOS desde 14/Abr. Flávio subiu 0,40pp, para 24,35% (vol USD 7,76M), e mesmo assim o gap ABRIU de +39,55pp para +40,15pp, porque o favorito subiu mais. Renan Santos caiu 0,30pp, para 8,15% (vol USD 8,63M). Caiado caiu 0,95pp contra 30/Jul, para 1,60% (vol USD 5,22M). Camilo Santana subiu 0,85pp, para 1,35% (vol USD 4,17M), e Geraldo Alckmin ficou em 0,45% (vol USD 4,98M). Jair Bolsonaro caiu para 0,85%, Zema caiu 0,20pp para 0,35%, Haddad subiu 0,10pp para 0,25%, Michelle ficou em 0,25% e Tereza Cristina em 0,20%. Tarcísio de Freitas segue em 0,15% (vol USD 13,68M), ainda o maior volume acumulado do book. O volume total acumulado no presidencial soma USD 117,06M.',
  'AD.sent.text3')

set(oAd, 'cards.sentimento.direita',
'Flávio subiu 0,40pp, para 24,35% (vol USD 7,76M), e ainda assim viu o gap ABRIR para +40,15pp, porque Lula subiu 1,00pp no mesmo pregão. Nos sub-mercados ele CAIU 0,50pp no 2º lugar do 1º turno, para 78,50% (vol USD 216 mil), e ficou em 5,65% no 3º lugar. A contrapartida da queda no book de 2º lugar é a alta de 3,25pp de Renan Santos no mesmo contrato, o que sugere realocação interna e não leitura nova sobre o returno. Na urna, a Vox o traz em 31,2% no 1º turno e 41,1% no returno, com os 6,4pp de diferença ficando fora da margem somada. E o dia político dele foi de portas se fechando, duas delas. O PP anunciou NEUTRALIDADE nas eleições, informando que consultou os diretórios estaduais e decidiu não convocar Convenção Nacional, o que barra a chapa e elimina Tereza Cristina como vice; a senadora, que lidera o PP no Senado, compartilhou a nota do partido e acatou, e Flávio respondeu que respeita e que não desiste. Horas depois, o Republicanos marcou convenção nacional para 04/Ago com a maioria dos diretórios estaduais consultados defendendo neutralidade, encaminhando a recusa de aliança. Os verbos não são iguais e o painel não os iguala: o PP DECIDIU, o Republicanos ainda NÃO decidiu. Em 24/Jul esta série registrou que, sem a federação União-PP, Flávio buscava Republicanos e Podemos. O prazo de 05/Ago segue com a vice indefinida.',
  'AD.sent.direita')

set(oAd, 'cards.sentimento.esquerda',
'Lula SUBIU 1,00pp e foi a 64,50% (vol USD 7,77M), superando pela primeira vez desde 14/Abr os 63,50% que a série vinha igualando sem romper. O gap ABRIU para +40,15pp, o mais largo desde 03/Mai e o primeiro acima de 40pp, e abriu com Flávio TAMBÉM subindo, o que descreve demanda pelo favorito e não deterioração do adversário. Na Vox Brasil ele tem 40,5% no 1º turno e 47,5% no returno, com 6,4pp de vantagem que ficam fora da margem somada. O instituto registra que, entre maio e julho, Lula cresceu 7,3pp e Flávio recuou 2,7pp na série da própria casa, invertendo uma vantagem que era do senador, e o painel reproduz isso como afirmação do instituto, porque é comparação interna dele. No campo dele, Camilo Santana subiu 0,85pp, de 0,50% para 1,35%, e Alckmin ficou em 0,45%, no dia em que o PCdoB formalizou apoio à chapa Lula-Alckmin. O painel registra a coincidência e não afirma causa. Sobre Camilo, a ressalva de série é obrigatória: 1,35% NÃO é recorde, o máximo dele é 4,10%, de 03/Mai, e o que houve foi recuperação do MÍNIMO da série, 0,50%, marcado em 30/Jul. E o campo dele levou um fato judicial novo no mesmo dia: o inquérito autorizado por André Mendonça em 30/Jul para apurar tráfico de influência de Fábio Luís Lula da Silva, o Lulinha, junto ao Ministério da Saúde e à Presidência. Lula disse que o filho terá de provar inocência e que não usará o cargo para protegê-lo.',
  'AD.sent.esquerda')

set(oAd, 'cards.sentimento.terceiraVia',
'O pelotão teve o dia mais movimentado da semana e nenhum movimento aponta para o mesmo lado. CAIADO caiu 0,95pp contra os 2,55% de 30/Jul e foi a 1,60% (vol USD 5,22M), devolvendo mais do que a alta de dois dias, e ao mesmo tempo SUBIU 2,00pp no 3º lugar do 1º turno, para 27,50%. A ressalva de série desfaz a leitura de colapso, porque 1,60% está dentro da faixa dele desde 22/Jul. Na urna, a Vox lhe dá 5,5%, a melhor leitura nacional dele no recorte, acima dos 5% da PoderData e bem acima dos 3,1% da AtlasIntel, e a divergência entre institutos sobre ele segue aberta em quatro níveis no mesmo mês. RENAN SANTOS caiu 0,30pp no vencedor, para 8,15% (vol USD 8,63M), mas SUBIU 3,25pp no 2º lugar do 1º turno, para 9,35%, recuperando dois terços do que perdera na véspera. É a contradição do dia: a urna o corta pelo terceiro instituto seguido e o dinheiro devolve parte da chance de returno que tinha retirado 24 horas antes. CAMILO SANTANA subiu 0,85pp, para 1,35%. ZEMA caiu 0,20pp, para 0,35%, no quarto pregão seguido de queda, num dia em que Marcelo Aro deixou a chapa dele ao Senado para disputar o governo de Minas, movimento que Zema chamou publicamente de traição.',
  'AD.sent.terceiraVia')

set(oAd, 'cards.sentimento.polymarket',
`Lula 64,50% (alta 1,00pp, vol USD 7,77M), Flávio 24,35% (alta 0,40pp, vol USD 7,76M), Renan Santos 8,15% (queda 0,30pp, vol USD 8,63M), Caiado 1,60% (queda 0,95pp, vol USD 5,22M), Camilo Santana 1,35% (alta 0,85pp, vol USD 4,17M), Jair 0,85%, Alckmin 0,45% (vol USD 4,98M), Zema 0,35% (queda 0,20pp), Haddad 0,25% (alta 0,10pp), Michelle 0,25%, Tereza Cristina 0,20%, Tarcísio 0,15% (vol USD 13,68M). Gap Lula sobre Flávio em +40,15pp, contra +39,55pp em 30/Jul, o mais largo desde 03/Mai. Volume total acumulado no presidencial em USD 117,06M. Sub-mercados: 2º lugar do 1º turno com Flávio 78,50% (queda 0,50pp, vol USD 216 mil), Renan Santos 9,35% (ALTA de 3,25pp, vol USD 1,09M) e Lula 8,75%; 3º lugar com Renan 61,50% (vol USD 164 mil), Caiado 27,50% (alta 2,00pp, vol USD 37 mil), Flávio 5,65% e Zema 4,45%; impeachment de ministro do STF ESTÁVEL em 3,10% (vol USD 83 mil); Senado com PL 72,00% (alta 6,50pp, vol USD 258 mil) e MDB em FAIXA declarada de 24,65% a 26,65%; inflação com a faixa de 5,00% a 5,49% em 38,30% e a de 4,50% a 4,99% em 33,70% (alta 1,20pp). ${TRAVA}`,
  'AD.sent.polymarket')

// ── cartão do Master: CORREÇÃO DE FATO ──
set(oAd, 'cards.bancoMaster.text1',
'A sexta-feira trouxe o maior volume de fato novo do caso Master desde a abertura do inquérito, e o painel registra que a leitura publicada às 17:33, de que o dia não tinha ato novo, estava errada. André Mendonça retirou o sigilo de parte da investigação que apura se o senador Jaques Wagner (PT-BA) recebeu vantagem indevida para atuar em favor de interesses do Banco Master em matérias do Senado. Com o sigilo levantado, veio a público um relatório da Polícia Federal que identificou 74 ligações entre o senador e Augusto Lima, ex-sócio do banco, entre novembro de 2023 e maio de 2025, somando mais de cinco horas e trinta minutos de conversa em 555 dias, o equivalente a uma chamada a cada oito dias.',
  'AD.master.text1')
set(oAd, 'cards.bancoMaster.text2',
'O relatório aponta ainda preferência do senador e do ex-sócio por chamadas de voz dentro de aplicativos de mensagem em vez de texto, padrão que, segundo a PF, reduz a rastreabilidade das interações. Na mesma decisão, Mendonça autorizou a PF a monitorar a localização do celular do senador, apontando risco de vazamento da operação e registrando que Wagner pediu audiência no gabinete dele no mesmo dia em que a PF protocolou o pedido da operação. O Novo pediu abertura de processo contra o senador no Conselho de Ética do Senado. Wagner disse publicamente que vai provar inocência. Nenhum desses atos é condenação, e o painel não os trata como tal: são inquérito, quebra de sigilo e representação partidária.',
  'AD.master.text2')
set(oAd, 'cards.bancoMaster.text3',
'Na frente legislativa não houve novidade, e a ausência segue sendo o fato. O mandado de segurança que discute a instalação da CPI do Banco Master continua há mais de quatro meses no gabinete de Kassio Nunes Marques, e o pedido de quatro senadores para afastá-lo da relatoria foi rejeitado. Sobre o preço, o registro é de imobilidade: o mercado de impeachment de ministro do STF ficou ESTÁVEL em 3,10%, num book de USD 83 mil, sem variação em nenhuma das oito leituras das quatro rodadas da trava de hoje. Vale sublinhar que esse contrato NÃO precifica o caso Wagner, que corre contra um senador e não contra um ministro, então preço parado ali não é resposta do mercado ao que saiu hoje.',
  'AD.master.text3')
set(oAd, 'cards.bancoMaster.conclusao',
'As frentes do caso Master seguem em trilhos separados e não devem ser somadas. A criminal, no STF sob relatoria de André Mendonça, ganhou nesta sexta o seu maior movimento desde a abertura: sigilo levantado e um relatório da PF que descreve 74 contatos entre o ex-sócio do banco e um senador da base do governo, além do monitoramento autorizado do celular dele. A patrimonial segue na Justiça do Rio, com bloqueios. A legislativa segue parada há mais de quatro meses no gabinete de Nunes Marques. E há uma frente nova, que não é do Master mas divide a mesma relatoria: o inquérito autorizado em 30/Jul por Mendonça para apurar tráfico de influência de Fábio Luís Lula da Silva, o Lulinha, junto ao Ministério da Saúde e à Presidência. O painel registra que o mesmo ministro concentra as duas apurações e não extrai disso nenhuma leitura de intenção.',
  'AD.master.conclusao')

set(oAd, 'cards.stf.mendonca',
'Segue como relator do inquérito aberto em 23/Jul sobre os repasses de Vorcaro para o filme sobre Jair Bolsonaro, e nesta sexta teve o dia mais ativo do eixo judicial. Retirou o sigilo de parte da investigação sobre o senador Jaques Wagner no caso Master e autorizou a PF a monitorar a localização do celular do senador, apontando risco de vazamento da operação. Em 30/Jul havia autorizado a abertura de inquérito para apurar tráfico de influência de Fábio Luís Lula da Silva, o Lulinha. A avaliação da PF sobre pedir à Interpol a inclusão de Flávio Bolsonaro e de Daniel Vorcaro na difusão prateada, registrada em 30/Jul, segue como AVALIAÇÃO: a PF não pediu e a Interpol não decidiu.',
  'AD.stf.mendonca')
set(oAd, 'cards.stf.analise',
'O mercado de impeachment de ministro do STF antes de 2027 ficou ESTÁVEL em 3,10% (vol USD 83 mil), sem variação em nenhuma das oito leituras das quatro rodadas da trava de captura de hoje. É o segundo pregão seguido no mesmo valor, e ele não se moveu num dia em que o eixo judicial produziu bastante fato, porque nenhum desses fatos aponta para remoção de ministro: apuram senador e particular, não integrante da Corte. Num book de USD 83 mil contra USD 117,06M do presidencial, preço parado diante de fato que não toca o objeto do contrato é o comportamento esperado.',
  'AD.stf.analise')
set(oAd, 'cards.stf.nexo',
'O nexo desta sexta tem dois eixos e eles não se tocam. No PARTIDÁRIO, Flávio perdeu duas portas no mesmo dia: o PP anunciou NEUTRALIDADE nas eleições, informando que consultou os diretórios estaduais e decidiu não convocar Convenção Nacional, o que barra a chapa e elimina Tereza Cristina como vice, e a senadora acatou; horas depois, o Republicanos marcou convenção para 04/Ago com a maioria dos diretórios consultados defendendo neutralidade, encaminhando a recusa. O PP DECIDIU, o Republicanos ainda NÃO. No JUDICIAL, Mendonça retirou o sigilo da investigação sobre Jaques Wagner no caso Master e autorizou monitorar a localização do celular do senador, um dia depois de autorizar o inquérito sobre Lulinha. Do outro lado, o PCdoB formalizou apoio à chapa Lula-Alckmin. O prazo de 05/Ago para definição de vices organiza os próximos dias.',
  'AD.stf.nexo')

set(oAd, 'cards.inss.text1',
'A pauta fiscal teve dado novo de rotina e nenhum fato político: o Banco Central divulgou as estatísticas de junho, com déficit primário de R$ 55,3 bilhões no mês e dívida bruta subindo acima do esperado, no dia seguinte ao resultado do semestre. O Senado segue em recesso e o Orçamento continua como próxima frente de atrito com o governo. O dia político correu no arranjo de chapa e no eixo judicial. O PP anunciou NEUTRALIDADE e vetou a chapa que teria Tereza Cristina como vice de Flávio, o Republicanos marcou convenção para 04/Ago encaminhando a mesma recusa, e no campo do governo Mendonça autorizou em 30/Jul inquérito sobre tráfico de influência de Lulinha. Em Minas Gerais, Marcelo Aro deixou a chapa de Romeu Zema ao Senado para disputar o governo estadual, e Zema chamou o movimento de traição. O PCdoB formalizou apoio à chapa Lula-Alckmin.',
  'AD.inss.text1')

set(oAd, 'cards.inss.text2',
'O mercado mudou de figura entre a tarde e o começo da noite. Às 17:33 o favorito estava parado em 63,50%; na captura das 19:25 Lula SUBIU 1,00pp e foi a 64,50%, rompendo o topo da série do AFOS, e Flávio subiu 0,40pp, para 24,35%, com o gap ABRINDO para +40,15pp. Renan caiu 0,30pp, Caiado caiu 0,95pp contra 30/Jul e Camilo Santana subiu 0,85pp. TRÊS institutos seguidos cortaram Renan Santos, e é a sequência que importa, não o número isolado: AtlasIntel 7,8% em 29/Jul, PoderData 4% em 30/Jul e Vox Brasil 3,0% em 31/Jul. Com o preço em 8,15%, a distância entre mercado e urna vai a 5,15pp, a maior do recorte. Em 29/Jul o painel registrou essa distância em 0,90pp e chamou de convergência. Três institutos depois, ela quadruplicou.',
  'AD.inss.text2')
set(oAd, 'cards.inss.conclusao',
'A 65 dias da eleição, o dia terminou com o favorito onde ele nunca tinha estado: Lula subiu 1,00pp e foi a 64,50%, rompendo os 63,50% que a série vinha igualando sem superar, e o gap foi a +40,15pp, o mais largo desde 03/Mai e o primeiro acima de 40pp. A urna nova, a Vox Brasil de 31/Jul (n=2.100, campo 26 a 28/Jul, margem de 2,15pp, 95% de confiança, BR-01084/2026), dá 40,5% x 31,2% no 1º turno e 47,5% x 41,1% no returno, e essa diferença de 6,4pp fica fora da margem somada, ao contrário do que a PoderData mediu na véspera. Três casas na mesma semana deram 9,1pp, 6pp e 9,3pp de gap no 1º turno, e o painel registra que a fora da curva é a PoderData. TRÊS institutos seguidos cortaram Renan Santos, e com o preço em 8,15% a distância entre mercado e urna vai a 5,15pp, contra os 0,90pp que este painel chamou de convergência em 29/Jul. No plano político, Flávio perdeu duas portas no mesmo dia, o PP por decisão e o Republicanos por encaminhamento, e o eixo judicial produziu o maior volume de fato novo do caso Master desde a abertura do inquérito. Nenhuma dessas leituras é atribuída a causa: o painel registra que o preço subiu no mesmo dia e não afirma que subiu por causa disso.',
  'AD.inss.conclusao')

// ─────────────────────────── polls-data ───────────────────────────
const PRECOS: Array<[string, string, number]> = [
  ['Lula', '64,50%', 64.5], ['Flávio Bolsonaro', '24,35%', 24.35], ['Renan Santos', '8,15%', 8.15],
  ['Ronaldo Caiado', '1,60%', 1.6], ['Tarcísio', '0,15%', 0.15], ['Romeu Zema', '0,35%', 0.35],
  ['Fernando Haddad', '0,25%', 0.25],
]
const TEND: Record<string, string> = {
  'Lula': 'SUBIU 1,00pp e foi a 64,50% (vol USD 7,77M), superando pela primeira vez desde 14/Abr os 63,50% que a série do AFOS vinha igualando sem ultrapassar em 26, 28, 30 e 31/Jul. O gap sobre Flávio ABRIU de +39,55pp para +40,15pp, o mais largo da série que tem os dois nomes, iniciada em 03/Mai, cujo máximo anterior era +39,80pp de 26/Jul, e a primeira leitura acima de 40pp. O gap abriu com o adversário TAMBÉM subindo, o que descreve demanda pelo favorito e não deterioração do outro lado.',
  'Flávio Bolsonaro': 'SOBE 0,40pp e vai a 24,35% (vol USD 7,76M), quinto pregão seguido sem queda, e mesmo assim VÊ O GAP ABRIR para +40,15pp, porque Lula subiu mais no mesmo pregão. Nos sub-mercados o sinal é CRUZADO: cede 0,50pp no book de 2º lugar do 1º turno, que passa a 78,50% num contrato de USD 216 mil, e fica em 5,65% no de 3º lugar. A contrapartida da queda no book de 2º lugar é a alta de 3,25pp de Renan Santos no mesmo contrato, o que sugere realocação interna e não leitura nova sobre o returno.',
  'Renan Santos': 'CAI 0,30pp e vai a 8,15% (vol USD 8,63M), quarto pregão seguido de queda no contrato de vencedor. Mas o movimento do dia é o oposto no book de colocação: SOBE 3,25pp no de 2º lugar do 1º turno, de 6,10% para 9,35% num contrato de USD 1,09M, recuperando dois terços do que perdera na véspera, e fica em 61,50% no de 3º lugar. Em 30/Jul o painel registrou que o dinheiro o havia reclassificado, tirando dele a chance de returno; hoje o mesmo dinheiro devolveu boa parte dela, no dia em que a urna o cortou pela terceira vez seguida. As duas direções ficam registradas e nenhuma é arbitrada. Mantém, nesta captura, o maior volume acumulado entre os nomes competitivos do presidencial, USD 8,63M.',
  'Ronaldo Caiado': 'CAI 0,95pp contra os 2,55% de 30/Jul e vai a 1,60% (vol USD 5,22M), devolvendo mais do que a alta acumulada em dois dias. A ressalva de série é obrigatória e corta para os dois lados: 1,60% está dentro da faixa normal dele desde 22/Jul, quando a série do AFOS registrou 1,80%, e os 2,55% de 30/Jul é que eram o desvio para cima. Não houve colapso, houve devolução de desvio. E o sinal é cruzado, porque no book de 3º lugar do 1º turno ele SOBE 2,00pp, passando a 27,50% num contrato de USD 37 mil. A leitura que se sustenta é de realocação: o mercado o move de candidato a vencedor para candidato a terceiro colocado, e a urna não acompanha, porque lhe deu justamente hoje a melhor marca do recorte.',
  'Tarcísio': 'ESTÁVEL em 0,15%, com o maior volume acumulado do book presidencial nesta captura, USD 13,68M. É a anomalia de legado que serve de lembrete permanente de método: volume mede história negociada e não convicção atual. O contrato acumulou esse valor ao longo de meses em que ele era tratado como candidato provável, e o preço de hoje diz que o mercado não o considera mais na disputa.',
  'Romeu Zema': 'CAI 0,20pp e vai a 0,35% (vol USD 4,59M), no QUARTO pregão seguido de queda no contrato de vencedor, e fica em 4,45% no book de 3º lugar do 1º turno. Ressalva de série, e ela é grande: o máximo dele na série do AFOS é 10,10%, de 26/Abr, então 0,35% é menos de um vigésimo daquele nível, e movimentos de 0,20pp nessa faixa têm valor informativo quase nulo.',
  'Fernando Haddad': 'SOBE 0,10pp e vai a 0,25%, e fica em 1,00% no book de 2º lugar do 1º turno. A ressalva de escala é obrigatória: num preço de 0,25%, uma alta de 0,10pp tem valor informativo quase nulo, e o movimento só é registrado porque é o terceiro dia seguido na mesma direção.',
}
for (const c of oPd.polymarketComparison.candidates) {
  const p = PRECOS.find(x => x[0] === c.name)
  if (!p) { erros.push(`PD: candidato inesperado "${c.name}"`); continue }
  c.polymarket = p[1]; c.odds = p[2]; c.value = p[2]
  if (TEND[c.name]) c.tendenciaPolymarket = TEND[c.name]
  else erros.push(`PD: sem tendenciaPolymarket nova para "${c.name}"`)
}
set(oPd, 'polymarketComparison.note',
`Cruzamento de 31/Jul, captura das 19:25: o favorito ROMPEU o topo da série. Lula SUBIU 1,00pp e foi a 64,50% (vol USD 7,77M), superando pela primeira vez desde 14/Abr os 63,50% que a série do AFOS vinha igualando sem ultrapassar em 26, 28, 30 e 31/Jul. Flávio SUBIU 0,40pp, para 24,35% (vol USD 7,76M), e mesmo assim o gap ABRIU de +39,55pp para +40,15pp, o mais largo da série que tem os dois nomes, iniciada em 03/Mai, e o primeiro acima de 40pp. A URNA: Vox Brasil de 31/Jul (n=2.100, campo 26 a 28/Jul, margem de 2,15pp, BR-01084/2026) dá Lula 40,5% x Flávio 31,2% no 1º turno e 47,5% x 41,1% no returno, e os 6,4pp do returno ficam fora da margem somada, então esta leitura não descreve empate técnico. Renan Santos foi cortado por TRÊS institutos seguidos, 7,8%, 4% e 3,0%, e com o preço em 8,15% a distância entre mercado e urna vai a 5,15pp, contra os 0,90pp que este painel chamou de convergência em 29/Jul. No dia, Flávio perdeu o PP, que anunciou neutralidade e vetou a chapa com Tereza Cristina, e o Republicanos marcou convenção para 04/Ago encaminhando a mesma recusa. ${TRAVA}`,
  'PD.note')

// ─────────────────────── CandidatesSection.tsx ───────────────────────
const TSXP: Array<[string, string]> = [
  ['63.5%', '64.5%'], ['24.3%', '24.35%'], ['8.15%', '8.15%'], ['1.75%', '1.6%'], ['0.45%', '0.35%'],
]
for (const [de, para] of TSXP) { if (de !== para && tsx.includes(de)) tsx = tsx.replace(de, para) }

if (erros.length) { console.error('❌ ABORTADO, nada escrito:'); erros.forEach(e => console.error('   • ' + e)); process.exit(1) }

// gate: nenhum valor antigo do presidencial pode sobreviver nos textos
const alvo = JSON.stringify({ oAd, pmc: oPd.polymarketComparison })
for (const s of ['não trouxe ato novo no caso Master', 'Lula não se mexeu', '+39,20pp', 'ESTÁVEL em 63,50%']) {
  if (alvo.includes(s)) { console.error(`❌ moldura antiga sobreviveu: "${s}"`); process.exit(1) }
}
if (!alvo.includes('64,50%') || !alvo.includes('+40,15pp')) { console.error('❌ os números novos não entraram'); process.exit(1) }

writeFileSync(P_AD, JSON.stringify(oAd, null, 2) + '\n', 'utf-8')
writeFileSync(P_PD, JSON.stringify(oPd, null, 2) + '\n', 'utf-8')
writeFileSync(P_TSX, tsx, 'utf-8')
console.log('✅ analysis-data, polls-data e CandidatesSection rebaseados para 19:25')
