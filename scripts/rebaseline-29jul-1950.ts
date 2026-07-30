/**
 * Rebaseline do snapshot de 18:47 para o de 19:50 BRT — 29/Jul/2026.
 *
 * POR QUE EXISTE
 * O re-fetch obrigatório da ETAPA 1.1 do /afos-daily achou o impeachment de
 * ministro do STF em 3,35% contra os 2,85% publicados no painel às 18:47. O
 * presidencial não se moveu, mas o texto dizia "praticamente imobilidade" e "o
 * dinheiro real não se mexeu", o que a 3,35% deixa de ser verdade.
 *
 * A trava confirmou 3,35% nas duas leituras da rodada das 19:50 e reprovou
 * APENAS o book de Michelle Bolsonaro (0,35% contra 0,55%). Regra aplicada:
 * feedback_trava_captura_bloqueou_duas_rodadas — firme o que repetiu, FAIXA o
 * que divergiu.
 *
 * 3 CORREÇÕES DE ATRIBUIÇÃO do gate de fact-check entram na mesma passada:
 *  1. Vídeo de IA: a defesa disse que NÃO autorizou mas que NÃO SE OPÕE a
 *     familiares produzirem. Não é o pai desmentindo o filho. E Moraes montou
 *     duas hipóteses: autorizou = cautelar violada; não autorizou = deep fake
 *     eleitoral, com exposição de Flávio e do PL.
 *  2. Tarcísio: aval é de 28/Jul, ele LIBEROU aliados e segue com Flávio.
 *  3. Mendonça/Vorcaro: decisão assinada em MAIO, pública em 28/Jul, via MLAT
 *     conduzido pelo DRCI.
 *
 * ESCRITA ATÔMICA: nada vai a disco antes de todas as asserções passarem.
 */
import { readFileSync, writeFileSync } from 'fs'

const P_AD = 'public/analysis-data.json'
const P_AC = 'public/analysis-criteriosa.json'
const P_PD = 'public/polls-data.json'
const P_TSX = 'app/components/CandidatesSection.tsx'

const ad = JSON.parse(readFileSync(P_AD, 'utf-8'))
const ac = JSON.parse(readFileSync(P_AC, 'utf-8'))
const pd = JSON.parse(readFileSync(P_PD, 'utf-8'))
let tsx = readFileSync(P_TSX, 'utf-8')

const erros: string[] = []

// ═══════════════════════ 1. CAMPOS REESCRITOS POR CAMINHO ═══════════════════════

const NOTA_TRAVA =
  'a trava de dupla leitura rodou TRÊS vezes hoje. Reprovou a 1ª por 1,00pp de divergência no 3º lugar de ' +
  'Renan Santos, aprovou a 2ª sem divergência nenhuma, e na 3ª, feita às 19:50 para conferir o mercado antes do ' +
  'fechamento editorial, reprovou de novo, agora APENAS no book de Michelle Bolsonaro, que oscilou entre 0,35% e ' +
  '0,55%. Todos os demais preços repetiram e entram FIRMES; o de Michelle entra como FAIXA declarada.'

ad.cards.sentimento.text3 =
  'No mercado, Lula caiu 1,00pp para 62,50% (vol USD 7,73M), e vale a ressalva de nível: não é queda de patamar, é ' +
  'o mesmo valor de 25 e de 27/Jul, com o topo da série do AFOS tendo marcado 63,50% em 26 e em 28/Jul. Flávio ' +
  'subiu 0,10pp para 23,95% (vol USD 7,70M), e o fechamento diário da série registra o QUARTO avanço seguido dele, ' +
  'saindo de 22,90% em 25/Jul. Renan Santos caiu 0,05pp para 8,70% (vol USD 8,59M), mas o número dele que importa ' +
  'hoje é outro: com 7,8% na urna, a distância entre preço e voto declarado ficou em 0,90pp, e nesta rodada ela ' +
  'estreitou pelo lado da URNA, que subiu, e não pelo lado do preço, como vinha acontecendo desde junho. Caiado ' +
  'inverteu o sinal dos dois pregões anteriores: subiu 0,45pp no vencedor, para 2,35%, e caiu 1,00pp no 3º lugar do ' +
  '1º turno, para 25,50%, com Renan recuperando 1,00pp naquele book, para 61,50%. Zema subiu 0,20pp, para 0,75%. ' +
  'Volume total acumulado no presidencial em USD 116,49M. Nota de captura: ' + NOTA_TRAVA

ad.cards.sentimento.polymarket =
  'Lula 62,50% (queda 1,00pp, vol USD 7,73M), Flávio 23,95% (alta 0,10pp, vol USD 7,70M), Renan Santos 8,70% ' +
  '(queda 0,05pp, vol USD 8,59M), Caiado 2,35% (alta 0,45pp, vol USD 5,20M), Jair 1,05% (estável, vol USD 5,26M), ' +
  'Zema 0,75% (alta 0,20pp, vol USD 4,57M), Michelle numa FAIXA de 0,35% a 0,55%, não confirmada pela trava (vol ' +
  'USD 9,34M), Alckmin 0,35% (alta 0,10pp, vol USD 4,94M), Camilo Santana 0,35% (queda 0,05pp), Haddad 0,25% ' +
  '(estável, vol USD 6,38M), Tereza Cristina 0,25% (alta 0,10pp), Tarcísio 0,15% (estável, vol USD 13,66M). Gap ' +
  'Lula sobre Flávio em +38,55pp, queda de 1,10pp contra ontem, e o maior gap da série do AFOS segue sendo ' +
  '+39,80pp, de 26/Jul. Sub-mercados: 2º lugar do 1º turno com Flávio 78,50% (alta 0,50pp), Renan 11,70% (queda ' +
  '0,45pp) e Haddad 1,15% (alta 0,30pp); 3º lugar com Renan 61,50% (alta 1,00pp), Caiado 25,50% (queda 1,00pp), ' +
  'Flávio 6,25% (queda 1,50pp) e Zema 4,50% (queda 0,10pp). Senado por cadeiras: PL 71,00% (estável) e MDB 17,60% ' +
  '(alta 0,35pp). Impeachment de ministro do STF em 3,35% (ALTA de 0,55pp). Volume total acumulado no presidencial ' +
  'em USD 116,49M. Captura 29/Jul 22:50 UTC, na terceira rodada da trava, que confirmou todos os books menos o de ' +
  'Michelle.'

ad.cards.inss.text3 =
  'O mercado de impeachment de ministro do STF SUBIU 0,55pp e foi a 3,35% (vol USD 83 mil), e aqui o registro que ' +
  'interessa é a DIREÇÃO, não o tamanho: o preço andou para cima no dia mais denso da semana em fato ' +
  'institucional, depois de ter caído 0,60pp na véspera. O dia teve a defesa de Jair Bolsonaro respondendo a ' +
  'Moraes que ele não autorizou o vídeo de inteligência artificial exibido na convenção do PL, ministros do TSE ' +
  'passando a ver abuso no uso de IA em campanha e o STF se preparando para agir caso o TSE não puna. A ressalva ' +
  'de método continua valendo e vem antes de qualquer leitura: com USD 83 mil de volume acumulado contra USD ' +
  '116,49M do presidencial, esse book se move com pouquíssimo dinheiro, e 0,55pp nele não sustenta narrativa de ' +
  'reprecificação. O que o painel registra, portanto, é que a direção acompanhou o acúmulo do dia, e nada além disso.'

ad.cards.bancoMaster.text3 =
  'Sobre o preço, o registro vale com o número exato: o mercado de impeachment de ministro do STF subiu 0,55pp e ' +
  'foi a 3,35%, num book de USD 83 mil. Num volume desse tamanho, 0,55pp custa muito pouco dinheiro, e o painel ' +
  'NÃO atribui o movimento a nenhum evento específico. A quarta teve o desdobramento do vídeo de inteligência ' +
  'artificial no STF, a leitura do governo sobre a prorrogação da emergência americana, a decisão de Dino sobre ' +
  'emendas e três pesquisas estaduais. Escolher qual desses eventos moveu 0,55pp num book de USD 83 mil seria ' +
  'inventar precisão que o dado não tem.'

ad.cards.stf.analise =
  'O mercado de impeachment de ministro do STF antes de 2027 SUBIU 0,55pp e foi a 3,35% (vol USD 83 mil). A ' +
  'ressalva de método vem antes da leitura: 0,55pp num book de USD 83 mil, contra USD 116,49M do presidencial, é ' +
  'pouquíssimo dinheiro, e não autoriza falar em reprecificação do risco. Feita a ressalva, o registro é o ' +
  'seguinte. Este foi o dia mais denso da semana em fato institucional: a defesa do ex-presidente informou ao STF ' +
  'que ele não autorizou o vídeo de inteligência artificial exibido na convenção do próprio filho, e Moraes já ' +
  'havia dito que, nessa hipótese, a peça pode configurar deep fake vedado pela lei eleitoral, com ' +
  'responsabilização de Flávio e do PL; ministros do TSE passaram a ver abuso e querem frear IA em campanha; o ' +
  'STF se prepara para agir caso o TSE não puna; Dino deu prazo ao Congresso no eixo das emendas; e o presidente ' +
  'da República reclamou publicamente de corporativismo de juízes e procuradores. E aqui o padrão que este painel ' +
  'registra desde junho se quebra um pouco: diante desse acúmulo, o dinheiro real SE MEXEU, e para cima. A ' +
  'direção acompanhou o dia; o tamanho do book impede chamar isso de risco de remoção reprecificado.'

ad.cards.stf.moraes =
  'O frente mais ativa do dia, e ela nasceu dentro da convenção do PL. Em 28/Jul, Moraes deu 48 horas para a ' +
  'defesa de Jair Bolsonaro explicar o vídeo gerado por inteligência artificial com a imagem e a voz do ' +
  'ex-presidente, e montou DUAS hipóteses excludentes: se houve autorização, a divulgação pode caracterizar novo ' +
  'descumprimento das medidas cautelares que sustentam a prisão domiciliar, com risco de volta ao regime fechado; ' +
  'se não houve, a peça pode configurar deep fake vedado pela legislação eleitoral, com responsabilização de ' +
  'Flávio Bolsonaro e do partido. Nesta quarta a defesa respondeu que ele NÃO autorizou o uso da própria imagem e ' +
  'voz, e acrescentou que NÃO SE OPÕE a familiares produzirem esse tipo de conteúdo, prática que a petição ' +
  'descreve como notória e contínua, sustentando ainda que não poderia ter autorizado porque está com visitas ' +
  'suspensas por trinta dias e Flávio está proibido de visitá-lo por noventa (CNN Brasil, Metrópoles, Folha de ' +
  'S.Paulo, 29/Jul). Ou seja, a resposta não é o pai desmentindo o filho: ela move a exposição da primeira ' +
  'hipótese para a segunda. No mesmo dia, a campanha de Flávio disse ao TSE que o vídeo é legal e não engana o ' +
  'eleitorado, e o PT acionou o TSE por outra peça de IA, em que Flávio pilota um caça ao lado de Javier Milei. O ' +
  'painel registra as posições e não projeta desfecho.'

ad.cards.bancoMaster.text1 =
  'A quarta trouxe promoção de status e uma correção de data, e as duas coisas importam para o método deste ' +
  'painel. O que a véspera registrou como reportagem exclusiva do Valor Econômico, a saber que André Mendonça ' +
  'autorizou o rastreamento no exterior de bens de Daniel Vorcaro e de outros envolvidos, apareceu em várias ' +
  'redações (Gazeta do Povo, Imirante, Diario de Pernambuco, Tribuna da Internet), então a apuração deixou de ser ' +
  'fonte única. A correção é a data: a decisão foi ASSINADA EM MAIO e só se tornou pública em 28/Jul. A via é a de ' +
  'cooperação internacional por acordo de assistência jurídica mútua, conduzida pelo Departamento de Recuperação ' +
  'de Ativos do Ministério da Justiça, e entre os alvos citados está um iate avaliado em R$ 500 milhões. Ontem o ' +
  'painel tratou o ato como se fosse da véspera; hoje a data correta entra no registro.'

ad.cards.stf.mendonca =
  'Segue como relator do inquérito aberto em 23/Jul sobre os repasses de Vorcaro para o filme sobre Jair ' +
  'Bolsonaro. Sobre o rastreamento patrimonial no exterior, dois acertos de registro: a decisão foi assinada em ' +
  'MAIO e só se tornou pública em 28/Jul, e a apuração, que entrou ontem como exclusiva do Valor Econômico, ' +
  'apareceu nesta quarta em várias redações. A via é a de cooperação internacional por acordo de assistência ' +
  'jurídica mútua, conduzida pelo Departamento de Recuperação de Ativos do Ministério da Justiça.'

ac.quadroComparativo[5].t =
  'SOBE 0,55pp para 3,35%, ou seja, o preço andou para CIMA no dia mais denso da semana em fato institucional, ' +
  'depois de cair 0,60pp na véspera.'

ac.quadroComparativo[5].s =
  'Ressalva de método decisiva: com USD 83 mil de volume acumulado contra USD 116,49M do presidencial, 0,55pp ' +
  'nesse book é pouquíssimo dinheiro, então o registrável é a direção e não o tamanho. O contexto do dia: a ' +
  'defesa de Jair Bolsonaro respondeu a Moraes que ele não autorizou o vídeo de IA da convenção do PL, e Moraes ' +
  'já havia dito que, nessa hipótese, a peça pode configurar deep fake eleitoral, com responsabilização de Flávio ' +
  'e do PL; ministros do TSE veem abuso e querem frear o uso de IA em campanha; o STF se prepara para agir caso o ' +
  'TSE não puna; e Lula reclamou publicamente de corporativismo de juízes e procuradores. Diante desse acúmulo, o ' +
  'dinheiro real se moveu na mesma direção, num contrato pequeno demais para transformar isso em risco de remoção ' +
  'precificado.'

ac.candidates[1].fracos[3] =
  'A defesa de Jair Bolsonaro informou ao STF que ele NÃO autorizou o uso da própria imagem e voz no vídeo de ' +
  'inteligência artificial exibido na convenção do PL, e Moraes já havia dito que, nessa hipótese, a peça pode ' +
  'configurar deep fake vedado pela lei eleitoral, com responsabilização dele e do partido.'

// ═══════════════════════ 2. TROCAS MECÂNICAS VERIFICADAS ═══════════════════════

const TROCAS: Array<[string, string]> = [
  // Renan 8,60 -> 8,70 e distância 0,80 -> 0,90
  ['queda 0,15pp, vol USD 8,59M', 'queda 0,05pp, vol USD 8,59M'],
  ['CAI 0,15pp para 8,60%', 'CAI 0,05pp para 8,70%'],
  ['caiu 0,15pp para 8,60%', 'caiu 0,05pp para 8,70%'],
  ['caiu 0,15pp e foi a 8,60%', 'caiu 0,05pp e foi a 8,70%'],
  ['Caiu 0,15pp no contrato de vencedor', 'Caiu 0,05pp no contrato de vencedor'],
  ['CAI 0,15pp', 'CAI 0,05pp'],
  ['queda 0,15pp', 'queda 0,05pp'],
  ['8,60%', '8,70%'],
  ['0,80pp', '0,90pp'],
  // 2º lugar
  ['ficou PARADO em 78,00% no 2º lugar do 1º turno pelo segundo pregão e CAIU 1,50pp no 3º lugar',
   'SUBIU 0,50pp no 2º lugar do 1º turno, para 78,50%, e CAIU 1,50pp no 3º lugar'],
  ['PARADO em 78,00% no 2º lugar do 1º turno, pelo segundo pregão sem mudança, e CAIU 1,50pp',
   'em ALTA de 0,50pp no 2º lugar do 1º turno, para 78,50%, e em QUEDA de 1,50pp'],
  ['Ficou parado em 78,00% no book de 2º lugar do 1º turno pelo segundo pregão, ou seja, a posição de returno segue consolidada e não em disputa.',
   'Subiu 0,50pp no book de 2º lugar do 1º turno, para 78,50%, ou seja, a posição de returno segue consolidada e não em disputa.'],
  ['PARADO em 78,00% no 2º lugar do 1º turno pelo segundo pregão e CAI 1,50pp',
   'SOBE 0,50pp no 2º lugar do 1º turno, para 78,50%, e CAI 1,50pp'],
  ['ficou parado em 78,00% no 2º lugar do 1º turno e caiu 1,50pp',
   'subiu 0,50pp no 2º lugar do 1º turno, para 78,50%, e caiu 1,50pp'],
  ['ficou PARADO em 78,00%', 'SUBIU 0,50pp, para 78,50%,'],
  ['parado em 78,00%', 'em alta de 0,50pp, a 78,50%,'],
  ['78,00%', '78,50%'],
  ['Renan 11,75% (queda 0,40pp)', 'Renan 11,70% (queda 0,45pp)'],
  ['caiu 0,40pp no 2º lugar do 1º turno, para 11,75%', 'caiu 0,45pp no 2º lugar do 1º turno, para 11,70%'],
  ['caiu 0,40pp no 2º lugar, para 11,75%', 'caiu 0,45pp no 2º lugar, para 11,70%'],
  ['queda de 0,40pp no 2º lugar do 1º turno, para 11,75%', 'queda de 0,45pp no 2º lugar do 1º turno, para 11,70%'],
  ['e 0,40pp no de 2º lugar do 1º turno', 'e 0,45pp no de 2º lugar do 1º turno'],
  ['0,40pp no 2º lugar do 1º turno, para 11,75%', '0,45pp no 2º lugar do 1º turno, para 11,70%'],
  ['11,75%', '11,70%'],
  ['1,20% (alta 0,35pp)', '1,15% (alta 0,30pp)'],
  ['SOBE 0,35pp no book de 2º lugar do 1º turno, para 1,20%', 'SOBE 0,30pp no book de 2º lugar do 1º turno, para 1,15%'],
  ['ALTA de 0,35pp no book de 2º lugar do 1º turno, para 1,20%', 'ALTA de 0,30pp no book de 2º lugar do 1º turno, para 1,15%'],
  ['SUBIU 0,35pp no 2º lugar do 1º turno, para 1,20%', 'SUBIU 0,30pp no 2º lugar do 1º turno, para 1,15%'],
  ['subiu 0,35pp, para 1,20%', 'subiu 0,30pp, para 1,15%'],
  ['1,20%', '1,15%'],
  // Tereza
  ['Tereza Cristina 0,20% (alta 0,05pp)', 'Tereza Cristina 0,25% (alta 0,10pp)'],
  ['Tereza Cristina 0,20%', 'Tereza Cristina 0,25%'],
  // Inflação
  ['34,70%', '34,90%'],
  ['37,95%', '38,30%'],
  ['3,55%', '4,10%'],
  ['USD 80 mil', 'USD 81 mil'],
  // Michelle -> faixa
  ['Michelle 0,45% (estável, vol USD 9,34M)', 'Michelle numa FAIXA de 0,35% a 0,55%, não confirmada pela trava (vol USD 9,34M)'],
  ['Michelle ficou em 0,45%, Jair em 1,05%', 'Michelle não teve preço confirmado pela trava e entra como FAIXA de 0,35% a 0,55%, Jair ficou em 1,05%'],
  ['Michelle 0,45%', 'Michelle numa faixa de 0,35% a 0,55%'],
  // Horário
  ['21:47', '22:50'],
  ['18:47', '19:50'],
  // Nota da trava
  ['a trava de dupla leitura REPROVOU a 1ª rodada por 1,00pp de divergência no 3º lugar de Renan Santos e APROVOU a 2ª rodada sem nenhuma divergência nos cinco books eleitorais. Foram quatro leituras no total, ao longo de dezesseis minutos, e os 61,50% publicados são o valor que repetiu nas três últimas. Todos os preços desta atualização entram como firmes e não há faixa.',
   NOTA_TRAVA + ' Os 61,50% do 3º lugar de Renan são o valor que repetiu nas leituras seguintes à primeira reprovação.'],
  ['a trava de dupla leitura REPROVOU a 1ª rodada por 1,00pp de divergência no 3º lugar de Renan Santos e APROVOU a 2ª sem nenhuma divergência, então todos os preços entram como firmes e não há faixa nesta atualização.',
   NOTA_TRAVA],
  ['a trava REPROVOU a 1ª rodada por 1,00pp de divergência no 3º lugar de Renan Santos e APROVOU a 2ª rodada sem nenhuma divergência nos cinco books eleitorais. Foram quatro leituras no total, e os 61,50% publicados são o valor que repetiu nas três últimas.',
   NOTA_TRAVA],
  ['REPROVOU a 1ª rodada por 1,00pp de divergência no 3º lugar de Renan e APROVOU a 2ª sem nenhuma divergência, num total de quatro leituras ao longo de dezesseis minutos, então todos os preços entram firmes e não há faixa.',
   'rodou TRÊS vezes: reprovou a 1ª por 1,00pp no 3º lugar de Renan, aprovou a 2ª, e na 3ª, às 19:50, reprovou apenas o book de Michelle Bolsonaro, que oscilou entre 0,35% e 0,55%. Os demais preços entram firmes; o de Michelle entra como faixa declarada.'],
  ['REPROVOU a 1ª rodada por 1,00pp de divergência no 3º lugar de Renan Santos e APROVOU a 2ª sem nenhuma divergência nos cinco books eleitorais, num total de quatro leituras ao longo de dezesseis minutos, então todos os preços entram firmes e não há faixa.',
   'rodou TRÊS vezes: reprovou a 1ª por 1,00pp no 3º lugar de Renan Santos, aprovou a 2ª, e na 3ª, às 19:50, reprovou apenas o book de Michelle Bolsonaro (0,35% a 0,55%). Os demais entram firmes; Michelle entra como faixa.'],
  ['trava REPROVADA na 1ª rodada por 1,00pp no 3º lugar de Renan e APROVADA na 2ª sem divergências.',
   'trava em três rodadas, com a 3ª reprovando apenas o book de Michelle Bolsonaro, publicado como faixa.'],
  ['a trava de dupla leitura REPROVOU a 1ª rodada por 1,00pp no 3º lugar de Renan Santos e APROVOU a 2ª sem divergências.',
   'a trava rodou três vezes; a 3ª, às 19:50, reprovou apenas o book de Michelle Bolsonaro, que entra como faixa de 0,35% a 0,55%.'],
  ['scripts/capture-guard.ts reprovado na 1ª rodada apenas no 3º lugar de Renan Santos e APROVADO na 2ª sem divergências',
   'scripts/capture-guard.ts em três rodadas: reprovada a 1ª no 3º lugar de Renan Santos, aprovada a 2ª, e reprovada a 3ª às 19:50 apenas no book de Michelle Bolsonaro, publicado como faixa'],
  // Correção 1 (sobras)
  ['o que coloca a peça de campanha em contradição com o próprio pai',
   'e, na hipótese que Moraes desenhou para esse cenário, a peça pode configurar deep fake vedado pela lei eleitoral'],
  ['o que coloca a peça de campanha em contradição com o pai',
   'e, na hipótese que Moraes desenhou para esse cenário, a exposição migra do pai para Flávio e o PL'],
  ['e sustentou que não poderia tê-lo feito por estar proibido de receber visitas',
   'e sustentou que não poderia tê-lo feito por estar com visitas suspensas por trinta dias e com Flávio proibido de visitá-lo por noventa, acrescentando que NÃO SE OPÕE a familiares produzirem esse tipo de conteúdo'],
  ['e sustentou que ele não poderia tê-lo feito por estar proibido de receber visitas',
   'e sustentou que ele não poderia tê-lo feito por estar com visitas suspensas por trinta dias, acrescentando que NÃO SE OPÕE a familiares produzirem esse tipo de conteúdo'],
  // Correção 2
  ['Tarcísio de Freitas deu aval para aliados apoiarem', 'Tarcísio de Freitas liberou, em 28/Jul, aliados e prefeitos da base para apoiarem'],
  ['(CNN Brasil, 29/Jul)', '(CNN Brasil, 28/Jul)'],
  ['ele deu aval para aliados apoiarem Caiado na disputa presidencial (CNN Brasil)',
   'ele liberou, em 28/Jul, aliados e prefeitos da base para apoiarem Caiado, sem deixar de dizer que o candidato dele segue sendo Flávio (CNN Brasil)'],
  // Correção 3 (sobras)
  ['a autorização para a Polícia Federal rastrear no exterior bens do ex-banqueiro e de outros envolvidos, publicada como exclusiva pelo Valor Econômico em 28/Jul, apareceu nesta quarta também no Estadão',
   'a autorização para rastrear no exterior bens do ex-banqueiro e de outros envolvidos, publicada como exclusiva pelo Valor Econômico em 28/Jul, apareceu nesta quarta em várias redações, e a decisão em si é de MAIO, tornada pública só em 28/Jul'],
  ['agora com rastreamento patrimonial no exterior confirmado por dois veículos',
   'agora com rastreamento patrimonial no exterior confirmado por várias redações, em decisão assinada em maio e revelada em 28/Jul'],
  ['a saber que André Mendonça autorizou a Polícia Federal a rastrear no exterior bens de Daniel Vorcaro e de outros envolvidos, apareceu nesta quarta também no Estadão',
   'a saber que André Mendonça autorizou o rastreamento no exterior de bens de Daniel Vorcaro e de outros envolvidos, apareceu nesta quarta em várias redações, com um acerto de data que importa: a decisão foi assinada em MAIO e só se tornou pública em 28/Jul'],
  ['que André Mendonça autorizou a Polícia Federal a rastrear no exterior bens de Daniel Vorcaro',
   'que André Mendonça autorizou o rastreamento no exterior de bens de Daniel Vorcaro, em decisão de maio revelada em 28/Jul,'],
  // Sobras encontradas na 1ª passada (strings longas, casadas verbatim)
  ['A trava de dupla leitura REPROVOU a 1ª rodada por uma divergência de 1,00pp no 3º lugar de Renan Santos, de 62,50% para 61,50%, e APROVOU a 2ª rodada sem nenhuma divergência nos cinco books eleitorais. Foram quatro leituras no total, ao longo de dezesseis minutos, e os 61,50% publicados são o valor que repetiu nas três últimas. Todos os preços desta atualização entram como firmes e não há faixa.',
   'A trava de dupla leitura rodou TRÊS vezes hoje. Reprovou a 1ª por uma divergência de 1,00pp no 3º lugar de Renan Santos, de 62,50% para 61,50%, aprovou a 2ª sem nenhuma divergência nos cinco books, e na 3ª, feita às 19:50 para conferir o mercado antes do fechamento editorial, reprovou de novo, agora APENAS no book de Michelle Bolsonaro, que oscilou entre 0,35% e 0,55%. Os 61,50% publicados são o valor que repetiu nas leituras seguintes à primeira reprovação. Todos os preços entram FIRMES, com uma exceção declarada: o de Michelle entra como FAIXA.'],
  ['Mesmo com todo esse acúmulo, o mercado de impeachment de ministro do STF subiu apenas 0,05pp e foi a 2,85%, num book de USD 83 mil. Registrar a direção é obrigatório; construir narrativa sobre ela, não, porque uma variação de 0,05pp em USD 83 mil é praticamente imobilidade.',
   'E aqui vem o único ponto em que o dinheiro real acompanhou o acúmulo: o mercado de impeachment de ministro do STF SUBIU 0,55pp e foi a 3,35%, num book de USD 83 mil, depois de ter caído 0,60pp na véspera. Registrar a direção é obrigatório; construir narrativa sobre ela, não, porque 0,55pp em USD 83 mil é pouquíssimo dinheiro.'],
  ['o mercado de impeachment de ministro do STF subiu 0,05pp, para 2,85% (vol USD 83 mil), no dia mais denso da semana em fato institucional, o que descreve um book praticamente imóvel; com USD 83 mil contra USD 116,49M do presidencial, nem a alta nem a estabilidade sustentam narrativa.',
   'o mercado de impeachment de ministro do STF subiu 0,55pp, para 3,35% (vol USD 83 mil), no dia mais denso da semana em fato institucional, e a direção acompanhou o acúmulo; com USD 83 mil contra USD 116,49M do presidencial, o tamanho não sustenta narrativa, só a direção é registrável.'],
  ['ele deu aval para aliados apoiarem a candidatura presidencial de Caiado (CNN Brasil, 28/Jul)',
   'ele liberou, em 28/Jul, aliados e prefeitos da base para apoiarem Caiado, sem deixar de dizer que o candidato dele segue sendo Flávio (CNN Brasil)'],
  // STF: sobras de valor
  ['2,85%', '3,35%'],
]

function aplicar(txt: string): string {
  let t = txt
  for (const [de, para] of TROCAS) t = t.split(de).join(para)
  return t
}

let sAd = aplicar(JSON.stringify(ad, null, 2))
let sAc = aplicar(JSON.stringify(ac, null, 2))
let sPd = aplicar(JSON.stringify(pd, null, 2))
tsx = aplicar(tsx)

// ═══════════════════════ 3. ASSERÇÕES DE SOBRA ═══════════════════════
const SOBRAS = ['2,85%', '8,60%', '11,75%', '78,00%', '34,70%', '37,95%', '0,80pp', 'USD 80 mil',
  '18:47', '21:47', 'contradição com o próprio pai', 'contradição com o pai', 'deu aval para aliados',
  'dezesseis minutos', 'imobilidade', 'praticamente imóvel', 'não se mexeu']
for (const [nome, s] of [['analysis-data', sAd], ['analysis-criteriosa', sAc], ['polls-data', sPd], ['CandidatesSection', tsx]] as const) {
  for (const alvo of SOBRAS) if (s.includes(alvo)) erros.push(`${nome}: sobrou "${alvo}"`)
}
// coerência: o novo valor tem de estar presente
for (const [nome, s] of [['analysis-data', sAd], ['analysis-criteriosa', sAc], ['polls-data', sPd], ['CandidatesSection', tsx]] as const) {
  if (!s.includes('3,35%')) erros.push(`${nome}: não tem 3,35%`)
  if (!s.includes('8,70%')) erros.push(`${nome}: não tem 8,70%`)
}

if (erros.length) {
  console.error('\n❌ rebaseline ABORTADO, nada foi escrito:')
  for (const e of erros) console.error('   ' + e)
  process.exit(1)
}

// ═══════════════════════ 4. ESCRITA ATÔMICA ═══════════════════════
// updatedAt vira o horário da captura confirmada
const oAd = JSON.parse(sAd); oAd.updatedAt = '29/07/2026, 19:50'
const oAc = JSON.parse(sAc); oAc.updatedAt = '29/07/2026, 19:50'
const oPd = JSON.parse(sPd); oPd.polymarketComparison.updatedAt = '29/07/2026, 19:50'

writeFileSync(P_AD, JSON.stringify(oAd, null, 2) + '\n', 'utf-8')
writeFileSync(P_AC, JSON.stringify(oAc, null, 2) + '\n', 'utf-8')
writeFileSync(P_PD, JSON.stringify(oPd, null, 2) + '\n', 'utf-8')
writeFileSync(P_TSX, tsx, 'utf-8')

console.log('✅ rebaseline 18:47 -> 19:50 aplicado nos 4 arquivos, zero sobra da baseline antiga')
