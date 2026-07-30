/**
 * /atualizar 30/Jul/2026, captura 17:08 BRT (20:08 UTC), trava APROVADA sem divergência.
 *
 * ESCRITA ATÔMICA: nada vai a disco antes de todas as asserções passarem.
 * Motivo: em 29/Jul um script equivalente escreveu dentro do laço, morreu na
 * âncora 11 e deixou a árvore meio editada. Aqui o disco só é tocado no fim.
 *
 * Método: substituição de CAMPO INTEIRO por caminho, não casamento de âncora.
 * Se o caminho não existir, aborta.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const P_AC = 'public/analysis-criteriosa.json'
const P_AD = 'public/analysis-data.json'
const P_PD = 'public/polls-data.json'
const P_CS = 'app/components/CandidatesSection.tsx'

const HORA = '30/07/2026, 17:08'
const erros: string[] = []

const oAc = JSON.parse(readFileSync(P_AC, 'utf-8'))
const oAd = JSON.parse(readFileSync(P_AD, 'utf-8'))
const oPd = JSON.parse(readFileSync(P_PD, 'utf-8'))
let sCs = readFileSync(P_CS, 'utf-8')

/** Atribui por caminho, exigindo que o caminho JÁ exista. */
function set(raiz: any, caminho: string, valor: any, rotulo: string) {
  const partes = caminho.split('.')
  let no = raiz
  for (const p of partes.slice(0, -1)) {
    if (no == null || !(p in no)) { erros.push(`${rotulo}: caminho inexistente em "${caminho}" (parou em "${p}")`); return }
    no = no[p]
  }
  const ultima = partes[partes.length - 1]
  if (no == null || !(ultima in no)) { erros.push(`${rotulo}: campo final inexistente "${caminho}"`); return }
  no[ultima] = valor
}

/** Troca literal única no TSX, com contagem exigida. */
function tsx(de: string, para: string, vezes = 1) {
  const n = sCs.split(de).length - 1
  if (n !== vezes) { erros.push(`TSX: "${de.slice(0, 60)}" apareceu ${n}x, esperado ${vezes}x`); return }
  sCs = sCs.split(de).join(para)
}

// ───────────────────────── blocos de texto reaproveitados ─────────────────────────

const TRAVA = 'A trava de dupla leitura rodou uma vez e APROVOU sem nenhuma divergência nos cinco books cobertos, o que não acontecia desde 28/Jul: nas duas rodadas anteriores ela bloqueou. Todos os preços entram FIRMES, sem faixa declarada.'

const PODER = 'PoderData/Aya de 30/Jul (n=2.400, campo 26 a 29/Jul, margem de 2pp, 95% de confiança, BR-07845/2026, telefônica em celular e fixo, 677 municípios nos 27 estados)'

const REGUA = 'A comparação que vale é a da PoderData contra ela mesma, e nela o gap do 1º turno NÃO se mexeu: eram 6pp em 16/Jul (40% x 34%) e são 6pp agora (41% x 35%), com os dois primeiros subindo 1pp, dentro da margem de 2pp. O aperto só aparece se a régua for trocada no meio da medição, comparando a PoderData de hoje com a AtlasIntel de ontem, que deu 9,1pp. Isso é efeito de casa, não movimento, e o painel não soma as duas.'

// ───────────────────────────── analysis-criteriosa ─────────────────────────────

set(oAc, 'updatedAt', HORA, 'AC')

set(oAc, 'subtitle',
`ATUALIZAÇÃO 30/Jul 17:08 BRT, a 66 dias do 1º turno. O PREÇO SUBIU E A URNA NÃO MEXEU. Lula avança 1,00pp e volta a 63,50%, que IGUALA pela terceira vez o topo da série do AFOS (26, 28 e agora 30/Jul) sem superá-lo, e o gap sobre Flávio, parado em 23,95%, abre de +38,55pp para +39,55pp, a 0,25pp do máximo da série, os +39,80pp de 26/Jul. A URNA DO DIA: ${PODER} dá Lula 41% x Flávio 35% no 1º turno, com Caiado 5%, Renan Santos 4%, Zema 3% e Augusto Cury 3%, e Lula 46% x Flávio 43% no returno. ${REGUA} O ACHADO DE MÉTODO ESTÁ EM RENAN SANTOS, e ele desfaz o de ontem. Em 29/Jul o painel registrou a distância entre preço e urna caindo para 0,90pp, com a AtlasIntel dando 7,8%. A PoderData dá 4%, e a distância REABRE para 4,45pp contra os 8,45% de preço. Dentro da própria PoderData ele CAI de 6% para 4%, mesma casa e mesmo método, e o mercado foi na mesma direção no lugar onde isso importa: o book de 2º lugar do 1º turno DESABOU de 11,70% para 6,10%, queda de 5,60pp, enquanto o de 3º lugar SUBIU 0,50pp, para 62,00%. O dinheiro tirou Renan da disputa pelo returno e o cravou no 3º lugar. A convergência de ontem era artefato de um instituto, não tendência. A REJEIÇÃO EMPATOU: a PoderData dá Lula e Flávio nos MESMOS 49%, e a avaliação da gestão piora, com ruim ou péssimo em 47%, alta de 10pp contra a rodada de 22/Jul do instituto. O EIXO INSTITUCIONAL do dia é o PT no TSE: a Federação Brasil da Esperança protocolou nesta quinta uma representação de mais de 200 páginas contra uma rede de 31 perfis que, segundo alega, usa inteligência artificial para atacar Lula, com 1.464.245 seguidores somados, 23.828 publicações e alcance estimado em 10 milhões de contas, e pede remoção de URLs, quebra de anonimato e desmonetização. E o mercado institucional foi para o outro lado: o impeachment de ministro do STF CAIU 0,25pp, para 3,10%, num book de USD 83 mil, desfazendo parte da alta de ontem. Volume total acumulado no presidencial em USD 116,58M. Cruzamento com Polymarket ao vivo 30/Jul 20:08 UTC. ${TRAVA}`,
  'AC.subtitle')

// quadroComparativo
set(oAc, 'quadroComparativo.0.p',
`URNA NOVA: ${PODER} dá 41% no 1º turno e 46% x 43% no returno contra Flávio, um gap de 3pp que cabe dentro da margem de 2pp somada das duas pontas e por isso é empate técnico. ${REGUA} Aprovação pessoal 43% contra 49% de desaprovação, e avaliação do governo 44% x 50%. Rejeição de 49%, EMPATADA com a de Flávio. Nas estaduais desta quinta, a Genial/Quaest publicou dez estados: perde o Rio Grande do Sul por 30% x 32% no 1º turno e 35% x 40% no returno, ganha o Ceará por 55% x 22% e aparece em terceiro em Goiás, com 23%, atrás de Caiado (33%) e de Flávio (27%).`,
  'AC.q0.p')
set(oAc, 'quadroComparativo.0.m', '63,50% (vol USD 7,74M acumulado)', 'AC.q0.m')
set(oAc, 'quadroComparativo.0.t',
'SOBE 1,00pp e volta a 63,50%, que IGUALA pela terceira vez o topo da série do AFOS, marcado em 26, em 28 e agora em 30/Jul, sem superá-lo em nenhuma delas. O gap sobre Flávio abre de +38,55pp para +39,55pp e fica a 0,25pp do máximo da série, os +39,80pp de 26/Jul. O padrão da semana se repete: pela terceira vez em sete dias o preço anda um ponto inteiro num dia cuja evidência de urna, lida dentro da mesma casa, está parada.',
  'AC.q0.t')
set(oAc, 'quadroComparativo.0.s',
'66 dias da eleição. A urna do dia não sustenta o movimento do preço nem o contradiz: dentro da própria PoderData o gap do 1º turno é o mesmo de duas semanas atrás. O painel registra que o preço subiu e que a urna ficou parada, sem afirmar causa. Polymarket ao vivo 30/Jul 20:08 UTC.',
  'AC.q0.s')

set(oAc, 'quadroComparativo.1.p',
`PoderData/Aya de 30/Jul: 35% no 1º turno, 43% no returno contra 46% de Lula, e rejeição de 49%, agora EMPATADA com a de Lula e não mais acima dela, como vinha em todas as leituras recentes exceto a Gerp. Dentro da própria casa ele SOBE de 34% para 35%, dentro da margem de 2pp. Nas estaduais desta quinta lidera o Rio Grande do Sul nos dois turnos, 32% x 30% e 40% x 35%, aparece em segundo em Goiás com 27% e fica em 22% no Ceará.`,
  'AC.q1.p')
set(oAc, 'quadroComparativo.1.m', '23,95% (vol USD 7,71M acumulado)', 'AC.q1.m')
set(oAc, 'quadroComparativo.1.t',
'ESTÁVEL em 23,95%, interrompendo quatro fechamentos diários seguidos de alta. Quem abriu o gap hoje foi Lula, não ele. Nos sub-mercados, SUBIU 0,50pp no 2º lugar do 1º turno, para 79,00%, a maior marca dele naquele book desde que o painel acompanha, e ficou parado em 6,25% no 3º lugar.',
  'AC.q1.t')
set(oAc, 'quadroComparativo.1.s',
'O preço dele não caiu, o do adversário subiu, e a distinção importa: gap que abre por movimento de um lado só não é reprecificação da candidatura. A rejeição empatada da PoderData é a novidade da urna, e ela desfaz, nesta leitura, a assimetria que o painel vinha registrando.',
  'AC.q1.s')

set(oAc, 'quadroComparativo.2.p',
'A PoderData dá 4% e DESFAZ a leitura de ontem. Em 29/Jul a AtlasIntel o tinha em 7,8%, a maior marca dele entre as nacionais, e o painel registrou a distância para o preço caindo a 0,90pp. Hoje a distância REABRE para 4,45pp. Dentro da própria PoderData ele CAI de 6% em 16/Jul para 4%, mesma casa, mesmo método, mesma margem, e essa é a comparação que vale. A dispersão entre institutos segue larga: 7,8% na AtlasIntel, 6% na Nexus, 5% na Indexa, 4% na PoderData e 3% na Datafolha.',
  'AC.q2.p')
set(oAc, 'quadroComparativo.2.m', '8,45% (vol USD 8,59M acumulado)', 'AC.q2.m')
set(oAc, 'quadroComparativo.2.t',
'CAI 0,25pp, para 8,45%, abaixo de todo fechamento diário da última semana na série do AFOS. Mas o movimento do dia não está no book de vencedor, e sim no de 2º lugar do 1º turno, que DESABOU de 11,70% para 6,10%, queda de 5,60pp num book de USD 1,09M, enquanto o de 3º lugar SUBIU 0,50pp, para 62,00% (vol USD 164 mil). O dinheiro não o eliminou, o reclassificou: tirou dele a chance de ir ao returno e o cravou no 3º lugar.',
  'AC.q2.t')
set(oAc, 'quadroComparativo.2.s',
'É a lição de método do dia. Ontem o painel escreveu que a convergência entre preço e urna tinha estreitado pelo lado da URNA. Um instituto depois, a urna voltou para 4% e a distância reabriu para 4,45pp. Convergência medida contra um único levantamento não é tendência, e o painel registra o próprio recuo em vez de deixar a leitura de ontem de pé.',
  'AC.q2.s')

set(oAc, 'quadroComparativo.3.p',
'A melhor urna do pelotão nesta rodada é dele: 5% na PoderData, ante 4% da própria casa em 16/Jul, e ele SOBE num dia em que a AtlasIntel de ontem o tinha cortado a 3,1%. A terceira medição da divergência sobre ele, portanto, NÃO fechou: seguem no ar 6% na Nexus, 5% na PoderData e 3,1% na AtlasIntel. E a estadual do dia traz o descompasso mais nítido da rodada: a Genial/Quaest o dá LIDERANDO Goiás com 33%, à frente de Flávio (27%) e de Lula (23%), no mesmo levantamento em que a desaprovação do governo estadual dele é de 59%.',
  'AC.q3.p')
set(oAc, 'quadroComparativo.3.m', '2,55% (vol USD 5,20M)', 'AC.q3.m')
set(oAc, 'quadroComparativo.3.t',
'SOBE 0,20pp para 2,55% no vencedor, acumulando 0,65pp em dois pregões, de 1,90% em 28/Jul, fica PARADO em 25,50% no 3º lugar do 1º turno (vol USD 37 mil) e sobe 0,30pp no 2º lugar, para 0,90%.',
  'AC.q3.t')
set(oAc, 'quadroComparativo.3.s',
'É o único nome do painel em que preço e urna andaram juntos hoje, os dois para cima. A ressalva é de tamanho: 5% de urna com margem de 2pp e 2,55% de preço são grandezas diferentes medindo coisas diferentes, e coincidência de direção não é confirmação. Governar com 59% de desaprovação no próprio estado e liderar ali a corrida presidencial são fatos compatíveis, e o painel registra os dois sem transformar um no outro.',
  'AC.q3.s')

set(oAc, 'quadroComparativo.4.p',
'PoderData de 30/Jul: CAI de 4% para 3% dentro da própria casa, contra a rodada de 16/Jul. É o segundo instituto seguido a medi-lo abaixo de 3%, depois dos 2,8% da AtlasIntel de 29/Jul, que também o colocou perdendo o returno nacional para Lula por 48,6% a 39,6%. Segue SEM vice definida, com o prazo de 05/Ago a menos de uma semana.',
  'AC.q4.p')
set(oAc, 'quadroComparativo.4.m', '0,55% (vol USD 4,57M)', 'AC.q4.m')
set(oAc, 'quadroComparativo.4.t',
'CAI 0,20pp no contrato presidencial, para 0,55%, e fica em 4,50% no 3º lugar do 1º turno. Devolve exatamente o que tinha subido na véspera.',
  'AC.q4.t')
set(oAc, 'quadroComparativo.4.s',
'Caiu nas duas medidas no mesmo dia, urna e preço, e é o único nome do painel em que isso aconteceu. Ressalva de série, e ela é grande: o máximo dele na série do AFOS é 10,10%, de 26/Abr, então 0,55% está a pouco mais de um vigésimo daquele nível, e movimentos de 0,20pp nessa faixa são de baixíssimo valor informativo.',
  'AC.q4.s')

set(oAc, 'quadroComparativo.5.p', 'Sem pesquisa. Mercado de impeachment de ministro do STF antes de 2027.', 'AC.q5.p')
set(oAc, 'quadroComparativo.5.m', '3,10% (vol USD 83 mil)', 'AC.q5.m')
set(oAc, 'quadroComparativo.5.t',
'CAI 0,25pp para 3,10%, ou seja, o preço foi para o LADO CONTRÁRIO ao acúmulo institucional do dia, desfazendo parte da alta de 0,55pp da véspera.',
  'AC.q5.t')
set(oAc, 'quadroComparativo.5.s',
'Ressalva de método decisiva, e ela vem antes de qualquer leitura: com USD 83 mil de volume acumulado contra USD 116,58M do presidencial, 0,25pp nesse book é pouquíssimo dinheiro. O contexto do dia era de acúmulo: a Federação Brasil da Esperança protocolou no TSE uma representação de mais de 200 páginas contra uma rede de perfis que, segundo alega, usa inteligência artificial contra Lula, e é o terceiro dia seguido em que o eixo institucional é o uso de IA em campanha. Em 29/Jul o preço acompanhou o acúmulo; hoje ele o contraria. Dois dias, duas direções, movimento líquido de 0,30pp para cima. A leitura honesta é que este book não tem tamanho para responder ao noticiário, e ler causa nele em qualquer das duas direções seria construir narrativa sobre ruído.',
  'AC.q5.s')

// candidatos
set(oAc, 'candidates.0.header',
'Polymarket 63,50% (alta 1,00pp, vol USD 7,74M acumulado), a 66 dias da eleição. Iguala pela terceira vez o topo da série do AFOS, sem superá-lo, e abre o gap sobre Flávio para +39,55pp. A urna do dia, PoderData/Aya, dá 41% no 1º turno e 46% x 43% no returno, com o gap da própria casa parado em 6pp desde 16/Jul.',
  'AC.c0.header')
set(oAc, 'candidates.0.analise',
`O dia repete o padrão de 28/Jul: o preço andou um ponto inteiro e a evidência de urna, lida dentro da mesma casa, está parada. ${PODER} dá Lula 41% x Flávio 35% no 1º turno e 46% x 43% no returno. ${REGUA} O que a rodada traz de novo não está na intenção de voto, está na avaliação: a aprovação pessoal cai para 43% contra 49% de desaprovação, queda de 3pp e alta de 2pp contra a rodada de 22/Jul do instituto, e a avaliação da gestão piora forte, com ruim ou péssimo saltando para 47%, alta de 10pp. É o pior número de gestão que o painel registrou em qualquer instituto neste recorte, e contrasta com a AtlasIntel de ontem, que trazia 49,3% pelo mesmo indicador mas com a aprovação SUBINDO. Duas casas, dois sinais opostos na mesma semana, e o painel registra as duas sem arbitrar. A REJEIÇÃO é o outro registro: 49% para Lula e 49% para Flávio, empatados, quando a AtlasIntel de ontem dava 49,4% contra 52,9%. No mercado, os 63,50% igualam o topo da série sem superá-lo, e o gap de +39,55pp fica a 0,25pp do máximo. Nas estaduais desta quinta, a Genial/Quaest publicou dez estados: Lula perde o Rio Grande do Sul nos dois turnos, ganha o Ceará por 55% x 22% e aparece em TERCEIRO em Goiás, com 23%.`,
  'AC.c0.analise')

set(oAc, 'candidates.1.header',
'Polymarket 23,95% (estável, vol USD 7,71M acumulado). A sequência de quatro altas diárias parou. O gap abriu porque Lula subiu, não porque ele caiu. No 2º lugar do 1º turno chegou a 79,00%, alta de 0,50pp. A PoderData o dá em 35% no 1º turno e 43% no returno, com rejeição de 49%, empatada com a de Lula.',
  'AC.c1.header')
set(oAc, 'candidates.1.analise',
'A distinção que organiza o dia dele é entre gap que abre por movimento próprio e gap que abre por movimento do adversário, e hoje foi o segundo caso: ele ficou parado em 23,95% e o gap abriu 1,00pp porque Lula subiu. A sequência de quatro fechamentos diários em alta, que vinha de 22,90% em 25/Jul, foi interrompida sem queda. No sub-mercado de 2º lugar do 1º turno ele SOBE 0,50pp e chega a 79,00% (vol USD 215 mil), a maior marca dele naquele book no acompanhamento do painel, e a contrapartida disso é o desabamento de Renan Santos no mesmo book, de 11,70% para 6,10%: o mercado está concentrando em Flávio a probabilidade de ocupar a segunda vaga do returno. Na urna, a PoderData o traz em 35% no 1º turno, ante 34% da própria casa em 16/Jul, e em 43% no returno, o mesmo valor das duas rodadas anteriores do instituto. A novidade é a REJEIÇÃO: 49%, empatada com a de Lula. Em todas as leituras nacionais recentes, com exceção da Gerp de 22/Jul, a rejeição dele vinha igual ou acima da de Lula, e a AtlasIntel de ontem media 52,9% contra 49,4%. Uma leitura não desfaz a série, mas o painel registra que a assimetria não apareceu nesta. Nas estaduais, lidera o Rio Grande do Sul por 32% x 30% no 1º turno e 40% x 35% no returno, e fica em segundo em Goiás, com 27%. O prazo de 05/Ago para definição de vice segue de pé.',
  'AC.c1.analise')

set(oAc, 'candidates.2.header',
'Polymarket 8,45% no vencedor (queda 0,25pp, vol USD 8,59M acumulado). O número do dia não é esse: é o 2º lugar do 1º turno, que DESABOU de 11,70% para 6,10%, queda de 5,60pp, enquanto o 3º lugar subiu 0,50pp, para 62,00%. E a urna nova o corta de 6% para 4% dentro da mesma casa.',
  'AC.c2.header')
set(oAc, 'candidates.2.analise',
'Este é o verbete que o painel precisa corrigir, e a correção é sobre a leitura de ontem, não sobre um número errado. Em 29/Jul o painel registrou que a distância entre o preço dele e a urna tinha caído a 0,90pp, e sublinhou que dessa vez o estreitamento vinha pelo lado da URNA, que subira a 7,8% na AtlasIntel. Um instituto depois, a PoderData o dá em 4% e a distância REABRE para 4,45pp contra os 8,45% de preço. Mais importante que a comparação entre casas: dentro da PRÓPRIA PoderData ele CAI de 6% em 16/Jul para 4% agora, mesma casa, mesmo método telefônico, mesma margem de 2pp, e essa queda de 2pp é a maior variação individual da rodada. A conclusão de método é que a convergência de ontem era artefato de um levantamento, e o painel a desfaz em vez de deixá-la de pé. O mercado andou na mesma direção, e no lugar exato onde a leitura importa. O book de vencedor cedeu pouco, 0,25pp. O de 2º lugar do 1º turno DESABOU 5,60pp, de 11,70% para 6,10% (vol USD 1,09M). E o de 3º lugar SUBIU 0,50pp, para 62,00% (vol USD 164 mil). Somados, os três movimentos dizem a mesma coisa: o dinheiro não o tirou da eleição, o reclassificou, retirando dele a chance de disputar o returno e consolidando-o como terceiro colocado. A dispersão entre institutos, que o painel vem registrando há semanas, continua sem se resolver e agora tem seis pontos de amplitude no mesmo mês: 7,8%, 6%, 5%, 4% e 3%. Em paralelo, o Estadão registrou nesta quinta que ele é o candidato que mais impulsiona anúncios contra Lula E contra Flávio ao mesmo tempo, o que é coerente com uma candidatura que disputa a terceira posição e não a polarização.',
  'AC.c2.analise')

set(oAc, 'candidates.3.header',
'Polymarket: Caiado 2,55% (alta 0,20pp, vol USD 5,20M), Jair 1,05% (estável), Zema 0,55% (queda 0,20pp), Haddad 0,15% (queda 0,10pp). Na urna, Caiado sobe de 4% para 5% dentro da PoderData e LIDERA Goiás com 33%, à frente de Flávio e de Lula.',
  'AC.c3.analise' in oAc ? 'AC.c3.header' : 'AC.c3.header')
set(oAc, 'candidates.3.analise',
'Caiado é o único nome do pelotão em que preço e urna subiram juntos hoje, e ele o faz depois de uma rodada ruim. A AtlasIntel de ontem o cortou a 3,1%, metade dos 6% da BTG/Nexus, e o painel registrou que a terceira medição tinha ficado do lado da leitura baixa. A PoderData o devolve a 5%, alta de 1pp dentro da própria casa contra 16/Jul, e a divergência sobre ele NÃO fechou: seguem no ar 6% na Nexus, 5% na PoderData e 3,1% na AtlasIntel. No mercado, ele sobe 0,20pp no vencedor, para 2,55%, acumulando 0,65pp em dois pregões, de 1,90% em 28/Jul, fica parado em 25,50% no 3º lugar (vol USD 37 mil) e sobe 0,30pp no 2º lugar, para 0,90%. O dado estadual do dia é o mais informativo do verbete e vale como registro de descompasso entre praça e país: a Genial/Quaest o dá LIDERANDO Goiás com 33%, à frente de Flávio (27%) e de Lula (23%), no mesmo levantamento em que a desaprovação do governo estadual dele é de 59%. Governar mal avaliado e liderar a corrida presidencial no próprio estado são fatos compatíveis, e o painel registra os dois sem transformar um no outro. ZEMA cai nas duas medidas, de 4% para 3% na PoderData e 0,20pp no mercado, para 0,55%. HADDAD segue sem ser testado no 1º turno pelos institutos e cai 0,10pp no mercado, para 0,15%. JAIR não se move, em 1,05%, e é o único do grupo cuja cotação não mudou.',
  'AC.c3.analise')

// fortes / fracos, um set por item para que caminho inexistente aborte
const LISTAS: Record<string, string[]> = {
  'candidates.0.fortes': [
    'Volta a 63,50% e IGUALA pela terceira vez o topo da série do AFOS, marcado em 26, em 28 e agora em 30/Jul, com o gap sobre Flávio a 0,25pp do máximo da série.',
    'Na PoderData mantém 41% x 35% no 1º turno, e o gap da própria casa está parado em 6pp desde 16/Jul, ou seja, a leitura de urna é de estabilidade e não de recuo.',
    'Vence o returno na PoderData por 46% x 43%, e é a nona rodada consecutiva de nacionais em que ele aparece à frente no 2º turno.',
    'Ganha o Ceará por 55% x 22% na Genial/Quaest desta quinta, mantendo a folga no Nordeste que o painel vem registrando.',
    'O PSB formalizou em 29/Jul a indicação de Alckmin como vice, com coligação de PT, PCdoB, PV, PDT, PSol e Rede, e a convenção nacional do PT que o formaliza está marcada para 02/Ago.',
  ],
  'candidates.0.fracos': [
    'A aprovação pessoal CAI para 43% contra 49% de desaprovação, queda de 3pp e alta de 2pp contra a rodada de 22/Jul do próprio instituto.',
    'Na avaliação da GESTÃO, ruim ou péssimo vai a 47%, alta de 10pp dentro da mesma casa, a maior variação de um indicador isolado em qualquer instituto deste recorte.',
    'Os 3pp de vantagem no returno cabem dentro da margem somada das duas pontas, então a PoderData descreve empate técnico e não vantagem.',
    'Perde o Rio Grande do Sul nos dois turnos: 30% a 32% no 1º e 35% a 40% no returno (Genial/Quaest).',
    'Aparece em TERCEIRO em Goiás, com 23%, atrás de Caiado (33%) e de Flávio (27%).',
  ],
  'candidates.1.fortes': [
    'A rejeição medida pela PoderData EMPATA com a de Lula em 49%, quando a AtlasIntel de 29/Jul dava 52,9% contra 49,4%: a assimetria que o painel vinha registrando não apareceu nesta leitura.',
    'SOBE 0,50pp no book de 2º lugar do 1º turno, para 79,00%, a maior marca dele naquele contrato no acompanhamento do painel, com o mercado concentrando nele a segunda vaga do returno.',
    'Sobe de 34% para 35% no 1º turno dentro da própria PoderData, contra a rodada de 16/Jul.',
    'Lidera o Rio Grande do Sul nos DOIS turnos: 32% a 30% no 1º e 40% a 35% no returno (Genial/Quaest).',
    'Os 43% dele no returno da PoderData ficam a 3pp de Lula, diferença que cabe na margem somada e caracteriza empate técnico.',
  ],
  'candidates.1.fracos': [
    'O preço ficou ESTÁVEL em 23,95% e a sequência de quatro fechamentos diários seguidos em alta, que vinha de 22,90% em 25/Jul, foi interrompida.',
    'O gap contra ele abriu 1,00pp no dia, de +38,55pp para +39,55pp, e ficou a 0,25pp do máximo da série do AFOS.',
    'Segue SEM vice definida, com o prazo de 05/Ago a menos de uma semana.',
    'A representação protocolada pela Federação Brasil da Esperança no TSE nesta quinta atribui a ele, entre outros políticos, o impulsionamento do conteúdo da rede de 31 perfis, alegação da federação que o painel não verificou de forma independente.',
    'Ficou parado em 6,25% no book de 3º lugar do 1º turno, sem acompanhar a alta que teve no de 2º lugar.',
  ],
  'candidates.2.fortes': [
    'O book de 3º lugar do 1º turno SUBIU 0,50pp, para 62,00%, e ele segue como o nome mais provável naquele contrato com folga sobre Caiado, que tem 25,50%.',
    'Mantém o maior volume acumulado entre os nomes competitivos do presidencial, USD 8,59M, acima de Lula e de Flávio.',
    'O Estadão registrou nesta quinta que ele é o candidato que mais impulsiona anúncios contra Lula E contra Flávio ao mesmo tempo, o que é coerente com uma candidatura que disputa a terceira posição e não a polarização.',
    'Segue com o terceiro maior preço do book presidencial, à frente de todo o pelotão.',
  ],
  'candidates.2.fracos': [
    'O book de 2º lugar do 1º turno DESABOU de 11,70% para 6,10%, queda de 5,60pp num contrato de USD 1,09M, e é o maior movimento isolado do dia em todo o painel.',
    'A urna nova o corta de 6% para 4% dentro da PRÓPRIA PoderData, mesma casa e mesmo método, a maior variação individual da rodada.',
    'A distância entre preço e urna REABRE de 0,90pp para 4,45pp, o que desfaz a convergência que o painel registrou em 29/Jul com base num único levantamento.',
    'Cai 0,25pp no contrato de vencedor, para 8,45%, abaixo de todo fechamento diário da última semana na série do AFOS.',
    'A dispersão entre institutos não se resolveu e segue com seis pontos de amplitude no mesmo mês: 7,8% na AtlasIntel, 6% na Nexus, 5% na Indexa, 4% na PoderData e 3% na Datafolha.',
  ],
  'candidates.3.fortes': [
    'Caiado é o único nome do painel em que preço e urna subiram juntos: 5% na PoderData, alta de 1pp dentro da casa, e 2,55% no mercado, alta de 0,20pp, acumulando 0,65pp em dois pregões, de 1,90% em 28/Jul.',
    'A Genial/Quaest desta quinta dá Caiado LIDERANDO Goiás com 33%, à frente de Flávio (27%) e de Lula (23%).',
    'A divergência sobre Caiado NÃO fechou a favor da leitura baixa: os 5% da PoderData ficam entre os 6% da Nexus e os 3,1% da AtlasIntel.',
    'Caiado subiu 0,30pp no book de 2º lugar do 1º turno, para 0,90%, além da alta no de vencedor.',
  ],
  'candidates.3.fracos': [
    'Nenhum nome do pelotão passa de 2,55% no contrato presidencial, contra 63,50% do favorito, e nenhum aparece à frente de Lula em qualquer returno nacional publicado.',
    'Zema CAI nas duas medidas no mesmo dia: de 4% para 3% dentro da PoderData e 0,20pp no mercado, para 0,55%, devolvendo o que subira na véspera.',
    'Zema segue SEM vice, com o prazo de 05/Ago a menos de uma semana, e o máximo dele na série do AFOS é 10,10%, de 26/Abr.',
    'Haddad cai 0,10pp no mercado, para 0,15%, e segue sem ser testado no cenário principal de 1º turno pelas nacionais, porque disputa o governo de São Paulo.',
    'Caiado lidera Goiás no levantamento em que a desaprovação do governo estadual dele é de 59%, o que separa a força da praça do julgamento da gestão.',
  ],
}
for (const [cam, itens] of Object.entries(LISTAS)) {
  itens.forEach((txt, i) => set(oAc, `${cam}.${i}`, txt, `AC.${cam}[${i}]`))
}

set(oAc, 'candidates.3.subtitle',
'30/Jul, a 66 dias: o pelotão se separou em dois sinais. Caiado é o único nome do painel em que preço e urna subiram juntos, indo a 5% na PoderData e a 2,55% no mercado, e lidera Goiás com 33%. Zema caiu nos dois, de 4% para 3% na urna e 0,20pp no preço, para 0,55%. Haddad segue fora do cenário principal de 1º turno e cedeu 0,10pp, para 0,15%.',
  'AC.c3.subtitle')

set(oAc, 'candidates.3.caiado.label',
'CAIADO (PSD), Poly presidencial 2,55% (alta 0,20pp, vol USD 5,20M) | 3º lugar do 1º turno 25,50% (estável, vol USD 37 mil) | 2º lugar 0,90% (alta 0,30pp) | candidato oficializado em 26/Jul, com Kassab de vice | última nacional: PoderData 30/Jul, 1T 5%',
  'AC.c3.caiado.label')
set(oAc, 'candidates.3.caiado.fortes',
'É o único nome do painel em que preço e urna andaram juntos hoje, e os dois para cima. Na urna, a PoderData o devolve a 5%, alta de 1pp dentro da própria casa contra a rodada de 16/Jul, e isso vem 24 horas depois de a AtlasIntel o ter cortado a 3,1%, metade dos 6% da BTG/Nexus. A divergência sobre ele, portanto, NÃO fechou a favor da leitura baixa: seguem no ar 6%, 5% e 3,1%. No mercado, sobe 0,20pp no vencedor, para 2,55%, acumulando 0,65pp em dois pregões, de 1,90% em 28/Jul, e sobe 0,30pp no book de 2º lugar do 1º turno, para 0,90%. E o dado estadual do dia é o mais forte do verbete: a Genial/Quaest o dá LIDERANDO Goiás com 33%, à frente de Flávio (27%) e de Lula (23%).',
  'AC.c3.caiado.fortes')
set(oAc, 'candidates.3.caiado.fracos',
'A ressalva é de tamanho e vem antes da leitura: 5% de urna com margem de 2pp e 2,55% de preço são grandezas diferentes medindo coisas diferentes, e a coincidência de direção não é confirmação de nada. O contrato de 3º lugar do 1º turno ficou PARADO em 25,50%, ou seja, a alta do dia não apareceu no book em que ele de fato disputa posição, e Renan Santos subiu 0,50pp naquele mesmo contrato, para 62,00%. No estado onde lidera, a desaprovação do governo dele é de 59% no mesmo levantamento, o que separa a força da praça do julgamento da gestão. E o nível segue baixo: 2,55% no contrato presidencial contra 63,50% do favorito.',
  'AC.c3.caiado.fracos')

set(oAc, 'candidates.3.haddad.label',
'HADDAD (PT), Poly presidencial 0,15% (queda 0,10pp) | 2º lugar do 1º turno 0,85% (queda 0,30pp) | não testado no cenário principal de 1º turno pelas nacionais, porque disputa o governo de São Paulo',
  'AC.c3.haddad.label')
set(oAc, 'candidates.3.haddad.fortes',
'O registro do dia é de ausência: a PoderData não o testa em nenhum cenário, nem de 1º turno nem de returno, e por isso ele não tem urna nova nesta rodada. A leitura favorável mais recente segue sendo a da AtlasIntel de 29/Jul, num dos dois cenários de returno SEM Lula, onde aparece com 44,3% contra 43,7% de Flávio, empate técnico dentro da margem de 1pp.',
  'AC.c3.haddad.fortes')
set(oAc, 'candidates.3.haddad.fracos',
'Caiu nos dois contratos em que aparece: 0,10pp no de vencedor, para 0,15%, e 0,30pp no de 2º lugar do 1º turno, para 0,85%. É o inverso exato do sinal cruzado que o painel registrou em 29/Jul, quando subira no de colocação e ficara parado no de vencedor. O agravante de leitura permanece e precisa ser dito com clareza: ele NÃO é candidato à Presidência, disputa o governo de São Paulo, e o cenário que o favorece é hipótese de pesquisa e não candidatura em curso.',
  'AC.c3.haddad.fracos')

set(oAc, 'candidates.3.zema.label',
'ZEMA (Novo), Poly presidencial 0,55% (queda 0,20pp, vol USD 4,57M) | 3º lugar do 1º turno 4,50% | PoderData 30/Jul: 1T 3%, ante 4% da própria casa em 16/Jul | candidato oficializado pelo Novo em 27/Jul, ainda SEM vice, com prazo até 05/Ago',
  'AC.c3.zema.label')
set(oAc, 'candidates.3.zema.fortes',
'Segue como o terceiro maior preço do pelotão no contrato presidencial e mantém 4,50% no book de 3º lugar do 1º turno, à frente de todos os nomes do pelotão exceto Caiado. Segue oficializado pelo Novo desde 27/Jul, o que o diferencia de nomes ainda tratados como hipótese pelos institutos.',
  'AC.c3.zema.fortes')
set(oAc, 'candidates.3.zema.fracos',
'É o único nome do painel que caiu nas DUAS medidas no mesmo dia: de 4% para 3% dentro da PoderData e 0,20pp no mercado, para 0,55%, devolvendo exatamente o que subira na véspera. É também o segundo instituto seguido a medi-lo abaixo de 3%, depois dos 2,8% da AtlasIntel de 29/Jul, que ainda o colocou perdendo o returno nacional para Lula por 48,6% a 39,6%. Segue sem vice, com o prazo de 05/Ago a menos de uma semana. Ressalva de série, e ela é grande: o máximo dele na série do AFOS é 10,10%, de 26/Abr, então 0,55% está a pouco mais de um vigésimo daquele nível.',
  'AC.c3.zema.fracos')

set(oAc, 'cruzamento',
`O CRUZAMENTO DE 30/JUL tem uma pergunta só, e ela é a mesma de 28/Jul: por que o preço anda um ponto inteiro num dia em que a urna, lida direito, está parada. Lula SOBE 1,00pp e volta a 63,50%, que IGUALA pela terceira vez o topo da série do AFOS (26, 28 e 30/Jul) sem superá-lo em nenhuma das três. Flávio fica em 23,95%, estável, interrompendo quatro altas diárias seguidas. O gap abre de +38,55pp para +39,55pp e fica a 0,25pp do máximo da série, os +39,80pp de 26/Jul. Registrar que o gap abriu por movimento de um lado só é obrigatório: não houve reprecificação da candidatura de Flávio hoje. A URNA. ${PODER} dá Lula 41% x Flávio 35% no 1º turno, com Caiado 5%, Renan Santos 4%, Zema 3% e Augusto Cury 3%, além de 5% de branco ou nulo e 4% que não responderam, e Lula 46% x Flávio 43% no returno. ${REGUA} A tentação era escrever que a urna apertou, porque 6pp da PoderData contra 9,1pp da AtlasIntel parece aperto. Não é: é a mesma diferença de nível entre as duas casas que o painel vem registrando desde 16/Jul, quando a PoderData contradisse a Quaest com Lula IDÊNTICO e toda a discordância no Flávio. O QUE MUDOU NA URNA foi a avaliação, não a intenção de voto. A aprovação pessoal de Lula cai para 43% contra 49% de desaprovação, e a avaliação da GESTÃO piora forte: ruim ou péssimo vai a 47%, alta de 10pp contra a rodada de 22/Jul do instituto, e ótimo ou bom fica em 34%, com 16% de regular. É o pior número de gestão do recorte, e vem 24 horas depois de a AtlasIntel medir a aprovação SUBINDO 1,7pp. Duas casas, dois sinais opostos na mesma semana, pelo mesmo indicador. O painel registra as duas e não arbitra qual está certa, porque não tem como. E a REJEIÇÃO EMPATOU em 49% para Lula e 49% para Flávio, quando ontem a AtlasIntel dava 49,4% contra 52,9%. A assimetria que o painel vinha chamando de restrição estrutural da candidatura de Flávio não apareceu nesta leitura. Uma rodada não desfaz a série, mas fica registrado. O ACHADO DE MÉTODO É RENAN SANTOS, e ele desfaz o achado de ontem. Em 29/Jul o painel escreveu que a distância entre preço e urna tinha caído a 0,90pp e que, pela primeira vez, o estreitamento viera pelo lado da URNA, que subira a 7,8% na AtlasIntel. A PoderData o dá em 4%, e a distância REABRE para 4,45pp. Dentro da PRÓPRIA PoderData ele cai de 6% para 4%, mesma casa e mesmo método, a maior variação individual da rodada. E o mercado foi na mesma direção, no lugar onde isso significa alguma coisa: o book de 2º lugar do 1º turno DESABOU de 11,70% para 6,10%, queda de 5,60pp num book de USD 1,09M, enquanto o de 3º lugar SUBIU 0,50pp, para 62,00%. O dinheiro não o eliminou, o reclassificou. A dispersão entre institutos não se resolveu e tem seis pontos de amplitude no mesmo mês: 7,8%, 6%, 5%, 4% e 3%. CAIADO é o único nome em que preço e urna subiram juntos: 5% na PoderData, alta de 1pp dentro da casa, e 2,55% no mercado, alta de 0,20pp. A divergência sobre ele segue aberta em três níveis, e a estadual do dia traz o descompasso mais nítido da rodada: a Genial/Quaest o dá LIDERANDO Goiás com 33%, à frente de Flávio (27%) e de Lula (23%), no mesmo levantamento em que a desaprovação do governo estadual dele é de 59%. O EIXO INSTITUCIONAL é o PT no TSE. A Federação Brasil da Esperança protocolou nesta quinta uma representação de mais de 200 páginas contra uma rede de 31 perfis que, SEGUNDO ALEGA A FEDERAÇÃO, usa inteligência artificial para atacar Lula, somando 1.464.245 seguidores, 23.828 publicações e alcance estimado em 10 milhões de contas, com pedido de remoção de URLs, quebra de anonimato e desmonetização, e atribuindo impulsionamento a Flávio e a outros políticos (Metrópoles, CNN Brasil, Migalhas). É o terceiro dia seguido em que inteligência artificial em campanha é o eixo institucional, depois das 48 horas dadas por Moraes em 28/Jul e da resposta da defesa de Jair em 29/Jul. E o mercado foi para o LADO CONTRÁRIO ao acúmulo: o impeachment de ministro do STF CAIU 0,25pp, para 3,10% (vol USD 83 mil), desfazendo parte da alta de 0,55pp de ontem. Em dois dias, 0,55pp para cima e 0,25pp para baixo num book de USD 83 mil é ruído, e o painel registra sem construir narrativa. NO CALENDÁRIO PARTIDÁRIO, o PSB formalizou em 29/Jul a indicação de Geraldo Alckmin como vice na chapa de Lula, em Brasília, com a coligação incluindo PT, PCdoB, PV, PDT, PSol e Rede, e a convenção nacional do PT que formaliza Lula está marcada para 02/Ago, em São Paulo. DOIS BOOKS FINOS SE MEXERAM MUITO e merecem a mesma ressalva. No Senado, o PL CAIU 5,50pp, de 71,00% para 65,50%, e o MDB subiu 0,60pp, para 18,20%, num book que soma USD 292 mil no total, com USD 258 mil concentrados no próprio PL. Na inflação, a faixa modal continua em 5,00% a 5,49%, com 38,30%, mas a de 4,50% a 4,99% caiu de 34,90% para 32,50% e a de 5,50% a 5,99% subiu de 4,10% para 5,80%, num book de USD 81 mil que NÃO é coberto pela trava de dupla leitura. Movimento grande em book pequeno é registro, não sinal. NA IMPRENSA, Lula disse que ninguém vai meter o bedelho nas eleições brasileiras, em crítica a Estados Unidos e Argentina, e o Estadão registrou que Renan Santos é o candidato que mais impulsiona anúncios contra os DOIS primeiros colocados ao mesmo tempo. UMA NOTA DE CAPTURA, e desta vez ela é curta. ${TRAVA} Volume total acumulado no presidencial em USD 116,58M.`,
  'AC.cruzamento')

// ─────────────────────────────── analysis-data ───────────────────────────────

set(oAd, 'updatedAt', HORA, 'AD')

set(oAd, 'cards.sentimento.text1',
`A 66 dias do 1º turno, a quinta-feira trouxe urna nacional e ela veio da PoderData. ${PODER} dá Lula 41% x Flávio 35% no 1º turno, com Ronaldo Caiado 5%, Renan Santos 4%, Romeu Zema 3% e Augusto Cury 3%, além de 5% de branco ou nulo e 4% que não responderam. No returno, Lula 46% x Flávio 43%, diferença de 3pp que cabe dentro da margem somada das duas pontas e por isso é empate técnico. A rodada traz ainda aprovação pessoal de Lula em 43% contra 49% de desaprovação, avaliação do governo em 44% x 50%, e rejeição EMPATADA: 49% para Lula e 49% para Flávio.`,
  'AD.sentimento.text1')
set(oAd, 'cards.sentimento.text2',
`O cruzamento do dia repete o de 28/Jul e é ele que organiza a leitura: o preço andou um ponto inteiro e a urna, lida direito, está parada. Lula SOBE 1,00pp e volta a 63,50%, com o gap sobre Flávio abrindo de +38,55pp para +39,55pp. ${REGUA} A tentação era escrever que a urna apertou, porque 6pp contra os 9,1pp da AtlasIntel de ontem parece aperto. Não é. É a mesma diferença de nível entre as duas casas que o painel registra desde 16/Jul, quando a PoderData contradisse a Genial/Quaest com Lula IDÊNTICO nas duas e toda a discordância concentrada no Flávio.`,
  'AD.sentimento.text2')
set(oAd, 'cards.sentimento.text3',
'No mercado, Lula subiu 1,00pp e voltou a 63,50% (vol USD 7,74M), valor que IGUALA pela terceira vez o topo da série do AFOS, marcado em 26, em 28 e agora em 30/Jul, sem superá-lo em nenhuma das três. O gap de +39,55pp fica a 0,25pp do máximo da série, os +39,80pp de 26/Jul. Flávio ficou ESTÁVEL em 23,95% (vol USD 7,71M), interrompendo quatro fechamentos diários seguidos de alta, e a distinção importa: o gap abriu por movimento de um lado só, então não houve reprecificação da candidatura dele hoje. Renan Santos caiu 0,25pp, para 8,45% (vol USD 8,59M), abaixo de todo fechamento diário da última semana, mas o movimento dele não está no book de vencedor. Caiado subiu 0,20pp, para 2,55% (vol USD 5,20M), acumulando 0,65pp em dois pregões, de 1,90% em 28/Jul. Zema caiu 0,20pp, para 0,55%, Haddad caiu 0,10pp, para 0,15%, e Jair ficou parado em 1,05%. O volume total acumulado no presidencial soma USD 116,58M.',
  'AD.sentimento.text3')
set(oAd, 'cards.sentimento.direita',
'Flávio ficou ESTÁVEL em 23,95% (vol USD 7,71M) e a sequência de quatro altas diárias, que vinha de 22,90% em 25/Jul, parou sem queda. Quem abriu o gap hoje foi Lula. Nos sub-mercados ele SUBIU 0,50pp no 2º lugar do 1º turno, para 79,00% (vol USD 215 mil), a maior marca dele naquele book no acompanhamento do painel, e ficou parado em 6,25% no 3º lugar. A contrapartida dessa alta é o desabamento de Renan Santos no mesmo book: o mercado está concentrando em Flávio a probabilidade de ocupar a segunda vaga do returno. Na urna, a PoderData o traz em 35% no 1º turno, ante 34% da própria casa em 16/Jul, e em 43% no returno, o mesmo valor das duas rodadas anteriores do instituto. A novidade é a rejeição: 49%, EMPATADA com a de Lula, quando a AtlasIntel de ontem dava 52,9% contra 49,4%. Em todas as nacionais recentes, com exceção da Gerp de 22/Jul, a rejeição dele vinha igual ou acima. Uma leitura não desfaz a série, mas fica registrado. Nas estaduais desta quinta, lidera o Rio Grande do Sul nos dois turnos, 32% x 30% e 40% x 35%, e fica em segundo em Goiás, com 27%. O prazo de 05/Ago para definição de vice segue valendo.',
  'AD.sentimento.direita')
set(oAd, 'cards.sentimento.esquerda',
'Lula subiu 1,00pp e voltou a 63,50% (vol USD 7,74M), igualando pela terceira vez o topo da série do AFOS sem superá-lo. É o terceiro dia em sete em que o preço anda um ponto inteiro, e o padrão que o painel vem registrando é que esses movimentos não coincidem com movimento de urna. Na PoderData desta quinta ele tem 41% no 1º turno e 46% x 43% no returno, e dentro da própria casa o gap do 1º turno está parado em 6pp desde 16/Jul. O que se mexeu na rodada não foi a intenção de voto, foi a avaliação: a aprovação pessoal cai a 43% contra 49% de desaprovação, e a avaliação da GESTÃO piora forte, com ruim ou péssimo em 47%, alta de 10pp contra a rodada de 22/Jul do instituto. É o pior número de gestão do recorte, e vem 24 horas depois de a AtlasIntel medir a aprovação SUBINDO 1,7pp pelo mesmo tipo de pergunta. Duas casas, dois sinais opostos na mesma semana. Nas estaduais da Genial/Quaest desta quinta, ele perde o Rio Grande do Sul nos dois turnos, ganha o Ceará por 55% x 22% e aparece em TERCEIRO em Goiás, com 23%. No calendário do próprio campo, o PSB formalizou em 29/Jul a indicação de Alckmin como vice, e a convenção nacional do PT que o formaliza está marcada para 02/Ago, em São Paulo.',
  'AD.sentimento.esquerda')
set(oAd, 'cards.sentimento.terceiraVia',
'O pelotão teve o movimento mais informativo do dia, e ele é uma RECLASSIFICAÇÃO de Renan Santos. No book de vencedor ele cedeu pouco, 0,25pp, para 8,45% (vol USD 8,59M). No de 2º lugar do 1º turno DESABOU de 11,70% para 6,10%, queda de 5,60pp num book de USD 1,09M. E no de 3º lugar SUBIU 0,50pp, para 62,00% (vol USD 164 mil). Somados, os três dizem a mesma coisa: o dinheiro não o tirou da eleição, retirou dele a chance de disputar o returno e o consolidou como terceiro colocado. E a urna foi junto. A PoderData o dá em 4%, contra 6% da própria casa em 16/Jul, queda de 2pp que é a maior variação individual da rodada. Isso DESFAZ o achado de ontem, quando o painel registrou a distância entre preço e urna caindo a 0,90pp com base nos 7,8% da AtlasIntel: hoje ela REABRE para 4,45pp. Convergência medida contra um único levantamento não é tendência, e a dispersão entre institutos segue com seis pontos de amplitude no mesmo mês, entre 7,8% e 3%. CAIADO foi na direção oposta e é o único nome em que preço e urna subiram juntos: 5% na PoderData, alta de 1pp dentro da casa, e 2,55% no mercado (vol USD 5,20M), alta de 0,20pp, acumulando 0,65pp em dois pregões, de 1,90% em 28/Jul. A divergência sobre ele não fechou e segue em três níveis: 6% na Nexus, 5% na PoderData, 3,1% na AtlasIntel. O dado estadual do dia é o descompasso mais nítido da rodada: a Genial/Quaest o dá LIDERANDO Goiás com 33%, à frente de Flávio (27%) e de Lula (23%), no mesmo levantamento em que a desaprovação do governo estadual dele é de 59%. ZEMA caiu nas duas medidas, de 4% para 3% na urna e 0,20pp no mercado, para 0,55%.',
  'AD.sentimento.terceiraVia')
set(oAd, 'cards.sentimento.polymarket',
`Lula 63,50% (alta 1,00pp, vol USD 7,74M), Flávio 23,95% (estável, vol USD 7,71M), Renan Santos 8,45% (queda 0,25pp, vol USD 8,59M), Caiado 2,55% (alta 0,20pp, vol USD 5,20M), Jair 1,05% (estável), Zema 0,55% (queda 0,20pp), Michelle 0,45%, Haddad 0,15% (queda 0,10pp). Gap Lula sobre Flávio em +39,55pp, contra +38,55pp em 29/Jul, a 0,25pp do máximo da série. Volume total acumulado no presidencial em USD 116,58M. Sub-mercados: 2º lugar do 1º turno com Flávio 79,00% (alta 0,50pp, vol USD 215 mil) e Renan Santos 6,10% (QUEDA de 5,60pp, vol USD 1,09M); 3º lugar com Renan 62,00% (alta 0,50pp, vol USD 164 mil), Caiado 25,50% (estável, vol USD 37 mil), Flávio 6,25% (estável) e Zema 4,50%; impeachment de ministro do STF em 3,10% (queda 0,25pp, vol USD 83 mil); Senado com PL 65,50% (QUEDA de 5,50pp, vol USD 258 mil) e MDB 18,20% (alta 0,60pp); inflação com a faixa de 5,00% a 5,49% em 38,30%, a de 4,50% a 4,99% em 32,50% (queda 2,40pp) e a de 5,50% a 5,99% em 5,80% (alta 1,70pp). ${TRAVA} Captura ao vivo 30/Jul 20:08 UTC.`,
  'AD.sentimento.polymarket')

set(oAd, 'cards.inss.text1',
'A pauta fiscal entrou no quarto dia sem fato novo: Senado em recesso, projetos prioritários parados e a promulgação da pauta-bomba ainda segurada por Davi Alcolumbre, com o Orçamento como próxima frente de atrito entre a presidência do Senado e o governo. O eixo econômico do dia veio de fora e por declaração, não por medida: Lula disse que ninguém vai meter o bedelho nas eleições brasileiras, em crítica dirigida a Estados Unidos e Argentina, e o governo seguiu tratando a prorrogação da emergência americana sobre o Brasil, assinada em 28/Jul, como possível preparação para novas sanções. Nenhuma medida nova foi anunciada nesta quinta, e o painel registra a ausência.',
  'AD.inss.text1')
set(oAd, 'cards.inss.text2',
`O mercado fez hoje o que já tinha feito em 28/Jul, e a repetição é mais informativa que o movimento isolado. O preço do favorito subiu 1,00pp, para 63,50%, e a urna do dia, lida dentro da própria casa, está parada. ${REGUA} Pela terceira vez em sete dias o preço anda um ponto inteiro sem que a evidência de urna acompanhe. O painel registra o padrão e não afirma causa, porque não tem evento triggador claro para atribuir.`,
  'AD.inss.text2')
set(oAd, 'cards.inss.text3',
'O mercado de impeachment de ministro do STF CAIU 0,25pp e foi a 3,10% (vol USD 83 mil), desfazendo parte da alta de 0,55pp da véspera. Aqui o registro é de tamanho, não de direção: 0,55pp para cima e 0,25pp para baixo em dois pregões, num book de USD 83 mil contra USD 116,58M do presidencial, é ruído. O dia teve acúmulo institucional relevante, com o PT protocolando no TSE uma representação de mais de 200 páginas contra uma rede de perfis que usa inteligência artificial, e o preço foi para o LADO CONTRÁRIO. Isso, por si, não diz nada: num book desse tamanho, a direção não tem lastro suficiente para virar leitura.',
  'AD.inss.text3')
set(oAd, 'cards.inss.text4',
'Dois books finos se mexeram muito hoje e merecem a mesma ressalva. No Senado, o PL CAIU 5,50pp, de 71,00% para 65,50%, e o MDB subiu 0,60pp, para 18,20%, num mercado que soma USD 292 mil no total, com USD 258 mil concentrados no próprio PL. Na inflação, a faixa modal continua em 5,00% a 5,49%, com 38,30%, mas a de 4,50% a 4,99% caiu de 34,90% para 32,50% e a de 5,50% a 5,99% subiu de 4,10% para 5,80%, num book de USD 81 mil que NÃO é coberto pela trava de dupla leitura. Movimento grande em book pequeno é registro, não sinal, e o painel escreve os números sem transformá-los em leitura.',
  'AD.inss.text4')
set(oAd, 'cards.inss.impactoLula',
'Leitura nova e ela vem com dois sinais opostos na mesma semana. A PoderData/Aya de 30/Jul (campo 26 a 29/Jul, n=2.400, telefônica, margem de 2pp, BR-07845/2026) dá aprovação pessoal de Lula em 43% contra 49% de desaprovação, queda de 3pp e alta de 2pp contra a rodada de 22/Jul do próprio instituto, e avaliação do GOVERNO em 44% contra 50%. Vinte e quatro horas antes, a AtlasIntel de 29/Jul (n=5.021, margem de 1pp) media 47,6% contra 51,2%, com a aprovação SUBINDO 1,7pp contra a própria rodada de 01/Jul. As duas casas, portanto, apontam para lados opostos pelo mesmo tipo de pergunta, na mesma semana. O painel continua exibindo a AtlasIntel no medidor, pelo critério que publicou em 29/Jul, a maior amostra e a menor margem do recorte, e registra a PoderData aqui, sem arbitrar qual está certa. Somando as leituras da semana, a aprovação de Lula está numa faixa entre 43% e 49%, mais larga do que a faixa de 47% a 49% que o painel registrou ontem, e é a PoderData que a alarga por baixo.',
  'AD.inss.impactoLula')
set(oAd, 'cards.inss.impactoGestao',
'Aqui está o número mais duro da rodada. Na avaliação da GESTÃO, que é pergunta diferente da aprovação pessoal, a PoderData de 30/Jul traz 34% de ótimo ou bom, 16% de regular e 47% de ruim ou péssimo, com o ruim ou péssimo subindo 10pp contra a rodada de 22/Jul do instituto. É a maior variação de um único indicador em qualquer instituto neste recorte. A AtlasIntel de 29/Jul media 49,3% de ruim ou péssimo, a BTG/Nexus de 27/Jul media 43% e a Datafolha de 24/Jul media 38%. O nível de 47% da PoderData fica dentro dessa faixa; o que chama atenção é o TAMANHO do salto dentro da própria casa. Os quatro institutos seguem concordando no que mais importa: a gestão é avaliada pior do que a pessoa, e a distância entre os dois indicadores persiste.',
  'AD.inss.impactoGestao')
set(oAd, 'cards.inss.conclusao',
`A 66 dias da eleição, o dia repete 28/Jul. O preço do favorito subiu 1,00pp, voltou a 63,50% e igualou pela terceira vez o topo da série do AFOS sem superá-lo, com o gap abrindo para +39,55pp, a 0,25pp do máximo. E a urna do dia, lida dentro da própria casa, está parada. ${REGUA} O que mudou na rodada não foi a intenção de voto, foi a avaliação: aprovação pessoal a 43%, gestão com 47% de ruim ou péssimo, alta de 10pp, e rejeição EMPATADA em 49% para Lula e para Flávio, quando ontem a AtlasIntel dava 49,4% contra 52,9%. A assimetria que o painel vinha chamando de restrição estrutural da candidatura de Flávio não apareceu nesta leitura, e uma rodada não desfaz a série, mas fica registrado. O painel não afirma que o preço subiu por causa de nada: não há evento triggador claro no dia, e três movimentos de um ponto inteiro em sete dias sem urna correspondente é um padrão que o painel prefere registrar a explicar.`,
  'AD.inss.conclusao')

set(oAd, 'cards.bancoMaster.text1',
'A quinta-feira não trouxe fato novo no caso Master, e a ausência é o registro. A frente criminal segue no STF sob relatoria de André Mendonça, com o rastreamento patrimonial no exterior de bens de Daniel Vorcaro autorizado em decisão assinada em MAIO e tornada pública em 28/Jul, já confirmada por mais de uma redação desde 29/Jul. Nenhum despacho novo apareceu nesta quinta. Circulou uma informação de que a Polícia Federal teria recorrido à AGU após decisões de Mendonça, mas ela apareceu em fonte única e de baixa qualidade editorial, e por isso o painel NÃO a incorpora: registra que a viu e que não conseguiu confirmá-la em segunda fonte independente.',
  'AD.bancoMaster.text1')
set(oAd, 'cards.bancoMaster.text2',
'Na frente legislativa, a novidade continua sendo a ausência de decisão. O mandado de segurança que discute a instalação da CPI do Banco Master segue há mais de quatro meses no gabinete de Kassio Nunes Marques, e o pedido de quatro senadores para afastá-lo da relatoria foi rejeitado. Com o Senado em recesso e a pauta de agosto ainda em disputa entre Alcolumbre e o governo, não há prazo à vista. O painel registra o tempo decorrido porque ele é o fato: quatro meses sem decisão sobre a instalação de uma CPI é, em si, uma decisão sobre a instalação dela.',
  'AD.bancoMaster.text2')
set(oAd, 'cards.bancoMaster.text3',
'Sobre o preço, o registro vem com o número exato e com a ressalva antes da leitura: o mercado de impeachment de ministro do STF CAIU 0,25pp e foi a 3,10%, num book de USD 83 mil. Ontem tinha subido 0,55pp. Em dois pregões, portanto, o movimento líquido é de 0,30pp para cima, e num volume desse tamanho isso é ruído. O painel NÃO atribui o movimento a nenhum evento específico, e sublinha que o dia teve acúmulo institucional relevante na direção OPOSTA à do preço, com o PT protocolando no TSE uma representação contra rede de perfis com inteligência artificial. Quando o acúmulo e o preço apontam para lados diferentes num book pequeno, a leitura honesta é que o book não tem tamanho para responder ao acúmulo.',
  'AD.bancoMaster.text3')
set(oAd, 'cards.bancoMaster.conclusao',
'As três frentes do caso Master seguem em trilhos separados e não devem ser somadas: a criminal, no STF sob relatoria de Mendonça, com rastreamento patrimonial no exterior em decisão assinada em maio e revelada em 28/Jul; a patrimonial, na Justiça do Rio, com bloqueios; e a legislativa, parada há mais de quatro meses no gabinete de Nunes Marques. Nenhuma delas produziu ato novo nesta quinta. O único mercado que toca o caso, o de impeachment de ministro do STF, recuou 0,25pp e está em 3,10%, num book de USD 83 mil que não sustenta leitura de reprecificação de risco em nenhuma direção.',
  'AD.bancoMaster.conclusao')

set(oAd, 'cards.stf.toffoli',
'Toffoli segue isolado no STF após a crise do Master, sem ato individual novo capturado nesta quinta.',
  'AD.stf.toffoli')
set(oAd, 'cards.stf.moraes',
'Sem despacho novo de Moraes capturado nesta quinta. A frente aberta por ele segue de pé: em 28/Jul deu 48 horas para a defesa de Jair Bolsonaro explicar o vídeo gerado por inteligência artificial com a imagem e a voz do ex-presidente, montando DUAS hipóteses excludentes, e em 29/Jul a defesa respondeu que ele NÃO autorizou o uso da própria imagem, ressalvando que não se opõe a que familiares produzam esse tipo de conteúdo, prática que chamou de notória e contínua. É defesa contra descumprimento de cautelar, e o efeito dela é deslocar a exposição do pai para o filho e para o partido, pela via do deep fake vedado pela legislação eleitoral. O prazo dado por Moraes venceu e o painel aguarda a decisão seguinte.',
  'AD.stf.moraes')
set(oAd, 'cards.stf.gilmar',
'Sem ato individual de Gilmar no período. Permanece o voto conjunto recente, com Dino, Moraes e Zanin, que reduziu restrições a penduricalhos.',
  'AD.stf.gilmar')
set(oAd, 'cards.stf.dino',
'Sem ato novo nesta quinta. Segue correndo o prazo de 10 dias que ele deu em 29/Jul para que governo e Congresso especifiquem a responsabilidade de parlamentares sobre emendas, com a sinalização de que parlamentar pode ser punido por não fiscalizar emenda que indicou.',
  'AD.stf.dino')
set(oAd, 'cards.stf.mendonca',
'Segue como relator do inquérito aberto em 23/Jul sobre os repasses de Vorcaro para o filme sobre Jair Bolsonaro. Sobre o rastreamento patrimonial no exterior, os dois acertos de registro continuam valendo: a decisão foi assinada em MAIO e só se tornou pública em 28/Jul, e a apuração deixou de ser fonte única a partir de 29/Jul. Nenhum ato novo nesta quinta.',
  'AD.stf.mendonca')
set(oAd, 'cards.stf.nexo',
'O nexo da quinta é o mesmo dos dois dias anteriores, inteligência artificial em campanha, mas agora o movimento partiu de um PARTIDO e não de um ministro. A Federação Brasil da Esperança, que reúne PT, PCdoB e PV, protocolou no TSE uma representação de mais de 200 páginas contra uma rede de 31 perfis que, SEGUNDO ALEGA A FEDERAÇÃO, usa inteligência artificial para atacar Lula. Os números da petição, todos atribuídos à federação e não verificados de forma independente pelo painel, são 1.464.245 seguidores somados, 23.828 publicações e alcance estimado em 10 milhões de contas, com impulsionamento atribuído a Flávio Bolsonaro e a outros políticos. Os pedidos são de remoção de URLs, quebra de anonimato dos responsáveis e suspensão da monetização (Metrópoles, CNN Brasil, Migalhas). É o terceiro dia consecutivo em que o eixo institucional do painel é o uso de inteligência artificial em campanha, e a novidade estrutural é que a disputa deixou de ser só entre o STF e uma defesa e passou a ter um partido como autor no TSE.',
  'AD.stf.nexo')
set(oAd, 'cards.stf.analise',
'O mercado de impeachment de ministro do STF antes de 2027 CAIU 0,25pp e foi a 3,10% (vol USD 83 mil), desfazendo parte da alta de 0,55pp de ontem. A ressalva de método vem antes da leitura e é a mesma de sempre: 0,25pp num book de USD 83 mil, contra USD 116,58M do presidencial, é pouquíssimo dinheiro, e não autoriza falar em reprecificação de risco em nenhuma direção. Feita a ressalva, o registro que interessa é de DESCOMPASSO. O dia teve acúmulo institucional relevante, com um partido protocolando no TSE uma representação de mais de 200 páginas sobre uso de inteligência artificial em campanha, e o preço andou para o lado contrário. Em 29/Jul o painel registrou a direção do preço acompanhando o acúmulo; hoje ela o contraria. Dois dias, duas direções, movimento líquido de 0,30pp para cima. A leitura honesta é que este book não tem tamanho para responder ao noticiário institucional, e que tentar ler causa nele em qualquer das duas direções seria construir narrativa sobre ruído. O painel registra os números e para por aí.',
  'AD.stf.analise')

// ────────────────────────────────── polls-data ──────────────────────────────────

set(oPd, 'lastUpdate', '2026-07-30', 'PD.lastUpdate')

// 1) remover pesquisas com mais de 30 dias
const antes = oPd.polls.length
oPd.polls = oPd.polls.filter((p: any) => {
  const dias = Math.round((Date.parse('2026-07-30') - Date.parse(p.date)) / 864e5)
  return dias <= 30
})
const removidas = antes - oPd.polls.length
if (removidas !== 1) erros.push(`PD: esperava remover 1 pesquisa com mais de 30 dias, removeu ${removidas}`)

// 2) inserir PoderData/Aya 30/Jul no topo, schema canônico copiado da entry do mesmo instituto
oPd.polls.unshift({
  institute: 'PoderData/Aya',
  date: '2026-07-30',
  sample: 2400,
  margin: 2,
  register: 'BR-07845/2026',
  reliability: 3,
  method: 'Telefônico (celular e fixo)',
  fieldDates: '2026-07-26 a 2026-07-29',
  note: 'PoderData/Aya nacional publicada 30/Jul (Poder360, CNN Brasil, Metrópoles, Gazeta do Povo). 1T Lula 41% x Flávio 35% (gap +6pp), com Caiado 5%, Renan Santos 4%, Zema 3% e Augusto Cury 3%, além de 5% de branco ou nulo e 4% que não responderam. 2T Lula 46% x Flávio 43% (gap +3pp), empate técnico pela margem de 2pp. Campo 26-29/Jul, n=2.400, telefônico em celular e fixo, 677 municípios nos 27 estados, margem 2pp, 95% de confiança, registro BR-07845/2026. A COMPARAÇÃO QUE VALE É COM A PRÓPRIA CASA, e nela o gap do 1º turno NÃO se mexeu: eram 6pp em 16/Jul (40% x 34%) e são 6pp agora (41% x 35%), com os dois primeiros subindo 1pp, dentro da margem. Contra a AtlasIntel de 29/Jul, que deu 9,1pp, a diferença é de 3,1pp, mas comparar casas diferentes publicadas com um dia de intervalo e chamar isso de aperto é trocar de régua no meio da medição: é efeito de casa, o mesmo que o painel registrou em 16/Jul, quando a PoderData contradisse a Quaest com Lula IDÊNTICO nas duas e toda a discordância no Flávio. RENAN SANTOS CAI de 6% para 4% dentro da própria casa, a maior variação individual da rodada, e isso DESFAZ a convergência que o painel registrou em 29/Jul com base nos 7,8% da AtlasIntel: a distância entre preço (8,45%) e urna reabre de 0,90pp para 4,45pp. CAIADO sobe de 4% para 5%. ZEMA cai de 4% para 3%. APROVAÇÃO pessoal 43% x 49% de desaprovação (era 46% x 47% na rodada de 22/Jul do instituto, queda de 3pp e alta de 2pp) e avaliação do GOVERNO 44% x 50%. GESTÃO 34% de ótimo ou bom, 16% regular e 47% de ruim ou péssimo, com o ruim ou péssimo subindo 10pp contra 22/Jul, a maior variação de um indicador isolado em qualquer instituto do recorte. REJEIÇÃO: Lula 49% e Flávio 49%, EMPATADOS, quando a AtlasIntel de 29/Jul dava 49,4% x 52,9%. O instituto também reportou empates técnicos no returno contra Zema e contra Caiado, mas o painel NÃO registra esses números porque não conseguiu verificá-los em fonte primária.',
  scenarios: [{
    name: 'Cenário Principal (1º turno, estimulado)',
    results: [
      { candidate: 'Lula (PT)', percent: 41 },
      { candidate: 'Flávio Bolsonaro (PL)', percent: 35 },
      { candidate: 'Ronaldo Caiado (PSD)', percent: 5 },
      { candidate: 'Renan Santos (Missão)', percent: 4 },
      { candidate: 'Romeu Zema (Novo)', percent: 3 },
      { candidate: 'Augusto Cury (Avante)', percent: 3 },
    ],
  }],
  secondRound: [{ matchup: 'Lula vs Flávio', candidate1: 'Lula', percent1: 46, candidate2: 'Flávio Bolsonaro', percent2: 43 }],
  source: 'PoderData/Aya via Poder360, CNN Brasil, Metrópoles, Gazeta do Povo 30/Jul',
})

// 3) aprovação: o medidor CONTINUA na AtlasIntel (critério publicado em 29/Jul:
//    maior amostra e menor margem). A PoderData entra na nota, com a divergência declarada.
const notaAprov = oPd.approvalData.note
if (!notaAprov.startsWith('A leitura nova é a AtlasIntel/Bloomberg de 29/Jul')) {
  erros.push('PD.approvalData.note: abertura mudou, revisar antes de prefixar')
}
set(oPd, 'approvalData.note',
'DUAS CASAS, DOIS SINAIS OPOSTOS NA MESMA SEMANA. A PoderData/Aya de 30/Jul (campo 26-29/Jul, n=2.400, telefônica, margem de 2pp, BR-07845/2026) dá aprovação pessoal de Lula em 43% contra 49% de desaprovação, queda de 3pp e alta de 2pp contra a rodada de 22/Jul do próprio instituto, e avaliação do GOVERNO em 44% contra 50%. Vinte e quatro horas antes, a AtlasIntel media a aprovação SUBINDO 1,7pp. O painel CONTINUA exibindo a AtlasIntel no medidor, pelo critério que publicou em 29/Jul, a maior amostra e a menor margem do recorte, e registra aqui a divergência sem arbitrar qual das duas está certa. Somando as leituras da semana, a aprovação de Lula está numa faixa entre 43% e 49%, mais larga que a de 47% a 49% registrada em 29/Jul, e é a PoderData que a alarga por baixo. Na GESTÃO, a PoderData traz 34% de ótimo ou bom, 16% de regular e 47% de ruim ou péssimo, com o ruim ou péssimo subindo 10pp contra 22/Jul, a maior variação de um indicador isolado em qualquer instituto deste recorte. E a REJEIÇÃO dela EMPATA Lula e Flávio em 49%, quando a AtlasIntel de 29/Jul dava 49,4% contra 52,9%: a assimetria que o painel vinha registrando como restrição estrutural da candidatura de Flávio não apareceu nesta leitura. --- ' + notaAprov,
  'PD.approvalData.note')
set(oPd, 'approvalData.source',
'PoderData/Aya (30/Jul/2026, campo 26-29/Jul, n=2.400, telefônica, margem 2pp, BR-07845/2026, aprova 43% x desaprova 49%, governo 44% x 50%, gestão 34% ótimo/bom x 47% ruim/péssimo x 16% regular, rejeição Lula 49% e Flávio 49%, fontes Poder360, CNN Brasil, Metrópoles, Gazeta do Povo) + ' + oPd.approvalData.source,
  'PD.approvalData.source')

// 4) polymarketComparison
const PM: Record<string, [string, number, number]> = {
  // nome -> [preço exibido, odds, percentual da urna mais recente que testa o nome]
  'Lula': ['63,50%', 63.5, 41],
  'Flávio Bolsonaro': ['23,95%', 23.95, 35],
  'Renan Santos': ['8,45%', 8.45, 4],
  'Ronaldo Caiado': ['2,55%', 2.55, 5],
  'Tarcísio': ['0,15%', 0.15, 0],
  'Romeu Zema': ['0,55%', 0.55, 3],
  'Fernando Haddad': ['0,15%', 0.15, 0],
}
for (const c of oPd.polymarketComparison.candidates) {
  const v = PM[c.name]
  if (!v) { erros.push(`PD.pmc: nome inesperado "${c.name}"`); continue }
  c.polymarket = v[0]
  c.odds = v[1]
  if (v[2] > 0) c.percentage = v[2]
  c.lastUpdate = '2026-07-30'
}

set(oPd, 'polymarketComparison.candidates.0.tendenciaPesquisa',
`URNA NOVA: ${PODER} dá Lula 41% no 1º turno contra 35% de Flávio, e 46% x 43% no returno. ${REGUA} O que se mexeu na rodada não foi a intenção de voto, foi a avaliação: aprovação pessoal cai a 43% contra 49% de desaprovação, e a avaliação da GESTÃO piora forte, com ruim ou péssimo em 47%, alta de 10pp contra a rodada de 22/Jul do instituto. A rejeição EMPATA em 49% com a de Flávio.`,
  'PD.pmc.0.tp')
set(oPd, 'polymarketComparison.candidates.0.tendenciaPolymarket',
'SOBE 1,00pp e volta a 63,50% (vol USD 7,74M), valor que IGUALA pela terceira vez o topo da série do AFOS, marcado em 26, em 28 e agora em 30/Jul, sem superá-lo em nenhuma das três. O gap sobre Flávio abre de +38,55pp para +39,55pp e fica a 0,25pp do máximo da série, os +39,80pp de 26/Jul. É o terceiro dia em sete em que o preço anda um ponto inteiro, e nos três a evidência de urna, lida dentro da mesma casa, estava parada. O painel registra o padrão e não afirma causa: não houve evento triggador claro nesta quinta.',
  'PD.pmc.0.tpm')

set(oPd, 'polymarketComparison.note',
`Cruzamento de 30/Jul: o preço subiu e a urna não mexeu. Lula SOBE 1,00pp e volta a 63,50% (vol USD 7,74M), igualando pela terceira vez o topo da série do AFOS (26, 28 e 30/Jul) sem superá-lo, e o gap sobre Flávio, ESTÁVEL em 23,95% (vol USD 7,71M), abre de +38,55pp para +39,55pp, a 0,25pp do máximo da série. Registrar que o gap abriu por movimento de um lado só é obrigatório: não houve reprecificação da candidatura de Flávio hoje, e a sequência de quatro altas diárias dele foi interrompida sem queda. A URNA: ${PODER} dá Lula 41% x Flávio 35% no 1º turno e 46% x 43% no returno. ${REGUA} O ACHADO DE MÉTODO É RENAN SANTOS, e ele DESFAZ o de ontem. Em 29/Jul o painel registrou a distância entre preço e urna caindo a 0,90pp, com a AtlasIntel dando 7,8%. A PoderData dá 4% e a distância REABRE para 4,45pp. Dentro da própria PoderData ele cai de 6% para 4%, a maior variação individual da rodada, e o mercado foi na mesma direção no lugar onde isso importa: o book de 2º lugar do 1º turno DESABOU de 11,70% para 6,10%, queda de 5,60pp (vol USD 1,09M), enquanto o de 3º lugar SUBIU 0,50pp, para 62,00% (vol USD 164 mil). O dinheiro não o eliminou, o reclassificou. Convergência medida contra um único levantamento não é tendência, e a dispersão entre institutos segue com seis pontos de amplitude no mesmo mês: 7,8%, 6%, 5%, 4% e 3%. CAIADO é o único nome em que preço e urna subiram juntos: 5% na PoderData, alta de 1pp dentro da casa, e 2,55% no mercado (vol USD 5,20M), alta de 0,20pp. A divergência sobre ele não fechou e segue em três níveis. O MERCADO NO DETALHE: Lula 63,50% (alta 1,00pp), Flávio 23,95% (estável), Renan Santos 8,45% (queda 0,25pp, vol USD 8,59M), Caiado 2,55% (alta 0,20pp), Jair 1,05% (estável), Zema 0,55% (queda 0,20pp), Haddad 0,15% (queda 0,10pp). INSTITUCIONAL: o impeachment de ministro do STF CAIU 0,25pp, para 3,10% (vol USD 83 mil), no dia em que a Federação Brasil da Esperança protocolou no TSE uma representação de mais de 200 páginas contra uma rede de perfis que, segundo alega, usa inteligência artificial contra Lula. Preço e acúmulo foram para lados opostos, e num book de USD 83 mil isso é ruído, não sinal. DOIS BOOKS FINOS se mexeram muito: o PL caiu 5,50pp no Senado, para 65,50% (vol USD 258 mil), e na inflação a faixa de 4,50% a 4,99% caiu 2,40pp, para 32,50%, num book de USD 81 mil não coberto pela trava. NOTA DE CAPTURA: ${TRAVA} Volume total acumulado no presidencial em USD 116,58M.`,
  'PD.pmc.note')
set(oPd, 'polymarketComparison.sources',
'Polymarket via proxy AFOS (captura ao vivo 30/Jul 20:08 UTC, degraded false, failedCount 0, scripts/capture-guard.ts em uma rodada, APROVADA sem divergência nos cinco books cobertos) + PoderData/Aya 30/Jul (BR-07845/2026, n=2.400, campo 26-29/Jul, margem 2pp, última nacional) + AtlasIntel/Bloomberg 29/Jul (BR-08602/2026, n=5.021, campo 22-27/Jul, margem 1pp, maior amostra do recorte) + BTG/Nexus 27/Jul (BR-01489/2026, n=2.004) + Datafolha 24/Jul (BR-01166/2026, n=2.004) + Gerp 22/Jul (BR-05026/2026) + Indexa 21/Jul (BR-02904/2026) + Real Time Big Data 21/Jul (BR-09247/2026) + PoderData/Aya 16/Jul (BR-00059/2026) + Genial/Quaest 15/Jul (BR-07181/2026) + Futura/Apex 14/Jul (BR-07294/2026) + AtlasIntel 01/Jul (BR-04582/2026). Estaduais de 30/Jul citadas como contexto e fora do recorte nacional: Genial/Quaest em dez estados, com Rio Grande do Sul, Ceará e Goiás usados no painel. Série do AFOS conferida em scripts/check-superlativo.ts, direto no Neon, sem cap de janela: cobertura de 14/Abr a 30/Jul, topo de Lula em 63,50% (26, 28 e 30/Jul) e maior gap em +39,80pp (26/Jul).',
  'PD.pmc.sources')
set(oPd, 'polymarketComparison.updatedAt', HORA, 'PD.pmc.updatedAt')

// ──────────────────────────── CandidatesSection.tsx ────────────────────────────
// LEGADO CONGELADO: só polymarket, poll e risk. Ponto decimal neste arquivo.

// Ordem no arquivo: Lula, Flávio, Renan, Haddad, Caiado, Zema, Tarcísio.
// Cada linha é [polymarket, poll, risk]. Vírgula decimal, como no resto do arquivo.
const TSX_VALORES: Array<[string, string, string]> = [
  [
    '63,50%',
    'Lula SOBE 1,00pp e volta a Poly 63,50% (vol USD 7,74M acumulado), a 66 dias do 1º turno, com o gap sobre Flávio abrindo de +38,55pp para +39,55pp. O valor IGUALA pela terceira vez o topo da série do AFOS, marcado em 26, em 28 e agora em 30/Jul, sem superá-lo em nenhuma das três. A urna do dia é a PoderData/Aya (n=2.400, campo 26-29/Jul, margem 2pp, BR-07845/2026): 41% x 35% de Flávio no 1º turno e 46% x 43% no returno.',
    'O PREÇO SUBIU E A URNA NÃO MEXEU, e é a terceira vez em sete dias. A comparação que vale é a da PoderData contra ela mesma, e nela o gap do 1º turno está PARADO em 6pp: eram 40% x 34% em 16/Jul, são 41% x 35% agora, com os dois primeiros subindo 1pp dentro da margem de 2pp. O aperto só aparece se a régua for trocada no meio da medição, comparando com os 9,1pp da AtlasIntel de ontem, e isso é efeito de casa, não movimento. O que mudou na rodada foi a avaliação: aprovação pessoal a 43% x 49%, e a GESTÃO com 47% de ruim ou péssimo, alta de 10pp contra a rodada de 22/Jul do instituto, a maior variação de um indicador isolado no recorte. A rejeição EMPATOU em 49% com a de Flávio.',
  ],
  [
    '23,95%',
    'Flávio fica ESTÁVEL em Poly 23,95% (vol USD 7,71M acumulado) e a sequência de quatro fechamentos diários seguidos em alta, que vinha de 22,90% em 25/Jul, foi interrompida sem queda. O gap abriu 1,00pp por movimento do adversário, não dele. Nos sub-mercados, SOBE 0,50pp no 2º lugar do 1º turno, para 79,00% (vol USD 215 mil), a maior marca dele naquele book no acompanhamento do painel, e fica parado em 6,25% no 3º lugar.',
    'A NOVIDADE DA URNA É A REJEIÇÃO EMPATADA. A PoderData dá 49% para ele e 49% para Lula, quando a AtlasIntel de 29/Jul media 52,9% contra 49,4%. Em todas as nacionais recentes, com exceção da Gerp de 22/Jul, a rejeição dele vinha igual ou acima da de Lula, e o painel vinha chamando essa assimetria de restrição estrutural da candidatura. Uma leitura não desfaz a série, mas fica registrado que nesta ela não apareceu. Na intenção de voto ele sobe de 34% para 35% dentro da própria casa. Segue SEM vice, com o prazo de 05/Ago a menos de uma semana, e a representação protocolada pelo PT no TSE nesta quinta atribui a ele impulsionamento do conteúdo da rede de perfis, alegação da federação que o painel não verificou de forma independente.',
  ],
  [
    '8,45%',
    'Renan CAI 0,25pp para Poly 8,45% (vol USD 8,59M acumulado), abaixo de todo fechamento diário da última semana, mas o número dele hoje não é esse. É o book de 2º lugar do 1º turno, que DESABOU de 11,70% para 6,10%, queda de 5,60pp num contrato de USD 1,09M, enquanto o de 3º lugar SUBIU 0,50pp, para 62,00% (vol USD 164 mil). O dinheiro não o eliminou, o RECLASSIFICOU: tirou dele a chance de disputar o returno e o cravou no 3º lugar.',
    'O PAINEL DESFAZ O PRÓPRIO ACHADO DE ONTEM. Em 29/Jul foi registrado que a distância entre preço e urna caíra a 0,90pp e que, pela primeira vez, o estreitamento viera pelo lado da URNA, que subira a 7,8% na AtlasIntel. Um instituto depois, a PoderData o dá em 4% e a distância REABRE para 4,45pp. Mais importante que a comparação entre casas: dentro da PRÓPRIA PoderData ele CAI de 6% em 16/Jul para 4% agora, mesma casa, mesmo método telefônico, mesma margem, e essa queda de 2pp é a maior variação individual da rodada. Convergência medida contra um único levantamento não é tendência. A dispersão entre institutos segue com seis pontos de amplitude no mesmo mês: 7,8%, 6%, 5%, 4% e 3%.',
  ],
  [
    '0,15%',
    'Haddad CAI nos dois contratos em que aparece: 0,10pp no de vencedor, para Poly 0,15%, e 0,30pp no de 2º lugar do 1º turno, para 0,85%. É o inverso exato do sinal cruzado de 29/Jul, quando subira no book de colocação e ficara parado no de vencedor. A PoderData NÃO o testa em nenhum cenário, nem de 1º turno nem de returno, então ele não tem urna nova nesta rodada.',
    'O agravante de leitura permanece e o painel repete com clareza: ele NÃO é candidato à Presidência, disputa o governo de São Paulo, e o cenário que o favorece é hipótese de pesquisa e não candidatura em curso. A leitura favorável mais recente segue sendo a da AtlasIntel de 29/Jul, num dos dois cenários de returno SEM Lula, onde aparece com 44,3% contra 43,7% de Flávio, empate técnico dentro da margem de 1pp. Ausência de teste numa rodada nacional é informação, e o painel a registra em vez de repetir o dado da véspera como se fosse novo.',
  ],
  [
    '2,55%',
    'Caiado é o ÚNICO nome do painel em que preço e urna subiram juntos hoje. No mercado sobe 0,20pp, para Poly 2,55% (vol USD 5,20M), acumulando 0,65pp em dois pregões, de 1,90% em 28/Jul, e sobe 0,30pp no 2º lugar do 1º turno, para 0,90%. No book de 3º lugar fica PARADO em 25,50% (vol USD 37 mil). Na urna, a PoderData o devolve a 5%, alta de 1pp dentro da própria casa contra 16/Jul.',
    'A DIVERGÊNCIA SOBRE ELE NÃO FECHOU. Em 29/Jul o painel registrou que a terceira medição tinha ficado do lado da leitura baixa, com a AtlasIntel cortando-o a 3,1%, metade dos 6% da BTG/Nexus. A PoderData o devolve a 5%, entre as duas, e a dispersão continua de pé. O dado estadual é o descompasso mais nítido da rodada: a Genial/Quaest desta quinta o dá LIDERANDO Goiás com 33%, à frente de Flávio (27%) e de Lula (23%), no mesmo levantamento em que a desaprovação do governo estadual dele é de 59%. Governar mal avaliado e liderar a corrida presidencial no próprio estado são fatos compatíveis, e o painel registra os dois sem transformar um no outro.',
  ],
  [
    '0,55%',
    'Zema CAI 0,20pp para Poly 0,55% (vol USD 4,57M) e fica em 4,50% no 3º lugar do 1º turno, devolvendo exatamente o que subira na véspera. Na urna, a PoderData o corta de 4% para 3% dentro da própria casa, contra a rodada de 16/Jul. É o único nome do painel que caiu nas DUAS medidas no mesmo dia.',
    'É o segundo instituto seguido a medi-lo abaixo de 3%, depois dos 2,8% da AtlasIntel de 29/Jul, que ainda o colocou perdendo o returno nacional para Lula por 48,6% a 39,6%. Segue SEM vice, com o prazo de 05/Ago a menos de uma semana. Ressalva de série, e ela é grande: o máximo dele na série do AFOS é 10,10%, de 26/Abr, então 0,55% está a pouco mais de um vigésimo daquele nível, e movimentos de 0,20pp nessa faixa têm baixíssimo valor informativo.',
  ],
  [
    '0,15%',
    'Tarcísio estável a Poly 0,15% no presidencial, com o volume acumulado mais alto entre todos os nomes com preço vivo no book nesta captura, USD 13,66M. Não aparece nos cenários presidenciais das nacionais: a PoderData de 30/Jul não o testa, e ele reiterou em 28/Jul que o candidato dele segue sendo Flávio, ao liberar aliados e prefeitos da base para apoiarem Caiado.',
    'O presidencial dele em 0,15% com o maior volume acumulado do book é a anomalia de legado que serve de lembrete permanente de método: volume mede história negociada e não convicção atual. O contrato acumulou USD 13,66M ao longo de meses em que ele era tratado como candidato provável, e o preço de hoje diz que o mercado não o considera mais na disputa. Somar volume alto com preço baixo e concluir alguma coisa sobre força de candidatura seria ler o passado do book como se fosse o presente dele.',
  ],
]

{
  const chaves = ['polymarket', 'poll', 'risk'] as const
  const edicoes: Array<{ i: number; f: number; novo: string }> = []
  for (let k = 0; k < chaves.length; k++) {
    const re = new RegExp(`${chaves[k]}: "(?:[^"\\\\]|\\\\.)*"`, 'g')
    const ms = [...sCs.matchAll(re)]
    if (ms.length !== TSX_VALORES.length) {
      erros.push(`TSX: "${chaves[k]}" apareceu ${ms.length}x, esperado ${TSX_VALORES.length}x`)
      continue
    }
    ms.forEach((m, idx) => {
      edicoes.push({ i: m.index!, f: m.index! + m[0].length, novo: `${chaves[k]}: ${JSON.stringify(TSX_VALORES[idx][k])}` })
    })
  }
  // aplicar do fim para o começo, para não invalidar os offsets
  edicoes.sort((a, b) => b.i - a.i)
  for (const e of edicoes) sCs = sCs.slice(0, e.i) + e.novo + sCs.slice(e.f)
}

// ────────────────────────────────── gate final ──────────────────────────────────

/**
 * Duas regras diferentes, porque "número de ontem" nem sempre é erro.
 *
 * PROIBIDO: valor de 29/Jul que não tem mais nenhum uso legítimo. Se aparecer,
 * é texto velho que escapou da reescrita.
 *
 * SÓ_COM_PAR: valor de 29/Jul que É legítimo como base de delta ("de X para Y"),
 * mas só se o valor NOVO estiver na mesma string. Velho sozinho = delta órfão,
 * que é exatamente o defeito que o gate numérico da tradução pegou em 29/Jul.
 */
const PROIBIDO = [
  '62,50%', '8,70%', '2,35%', '3,35%', '78,50%', '39,65pp', '25,50% (queda',
  'AtlasIntel/Bloomberg (n=5.021, campo 22-27/Jul', '67 dias', 'quarta-feira',
  'a quarta inverteu a terça', 'a 3ª rodada', '19:50',
]
const SO_COM_PAR: Array<[string, string]> = [
  ['+38,55pp', '+39,55pp'],
  ['11,70%', '6,10%'],
  ['71,00%', '65,50%'],
  ['34,90%', '32,50%'],
  ['inverso exato', '29/Jul'],
  ['0,55pp', '0,25pp'],
]
function varrer(no: any, cam: string) {
  if (typeof no === 'string') {
    const p = PROIBIDO.filter(s => no.includes(s))
    if (p.length) erros.push(`SOBRA proibida em ${cam}: ${p.join(' , ')}`)
    for (const [velho, novo] of SO_COM_PAR) {
      if (no.includes(velho) && !no.includes(novo)) {
        erros.push(`DELTA ÓRFÃO em ${cam}: cita "${velho}" (29/Jul) sem "${novo}" na mesma string`)
      }
    }
    return
  }
  if (Array.isArray(no)) return no.forEach((v, i) => varrer(v, `${cam}[${i}]`))
  if (no && typeof no === 'object') return Object.keys(no).forEach(k => varrer(no[k], `${cam}.${k}`))
}
varrer(oAc, 'AC')
varrer(oAd, 'AD')
sCs.split('\n').forEach((linha, i) => varrer(linha, `CandidatesSection.tsx:${i + 1}`))

if (erros.length) {
  console.error('❌ rebaseline ABORTADO, nada foi escrito:')
  for (const e of erros) console.error('   • ' + e)
  process.exit(1)
}

writeFileSync(P_AC, JSON.stringify(oAc, null, 2) + '\n', 'utf-8')
writeFileSync(P_AD, JSON.stringify(oAd, null, 2) + '\n', 'utf-8')
writeFileSync(P_PD, JSON.stringify(oPd, null, 2) + '\n', 'utf-8')
writeFileSync(P_CS, sCs, 'utf-8')
console.log('✅ 4 arquivos escritos. Pesquisas no array:', oPd.polls.length, '| removidas por idade:', removidas)
