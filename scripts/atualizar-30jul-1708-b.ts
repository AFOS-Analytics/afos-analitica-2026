/**
 * Complemento do /atualizar de 30/Jul: as tendências dos seis candidatos que a
 * primeira passada não cobriu, e a retirada de dois superlativos que o validador
 * reprovou por exigirem varredura da série COMPLETA, que eu não fiz.
 *
 * Mesma regra da primeira passada: escrita atômica no fim.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const P_PD = 'public/polls-data.json'
const erros: string[] = []
const oPd = JSON.parse(readFileSync(P_PD, 'utf-8'))

const PODER = 'PoderData/Aya de 30/Jul (n=2.400, campo 26 a 29/Jul, margem de 2pp, BR-07845/2026, telefônica, 677 municípios nos 27 estados)'

const TEND: Record<string, { tp: string; tpm: string }> = {
  'Flávio Bolsonaro': {
    tp: `${PODER} o traz em 35% no 1º turno, ante 34% da própria casa em 16/Jul, e em 43% no returno contra 46% de Lula, diferença de 3pp que cabe na margem somada e caracteriza empate técnico. A NOVIDADE é a REJEIÇÃO: 49%, EMPATADA com a de Lula, quando a AtlasIntel de 29/Jul dava 52,9% contra 49,4%. Em todas as nacionais recentes, com exceção da Gerp de 22/Jul, a rejeição dele vinha igual ou acima da de Lula, e o painel vinha tratando essa assimetria como restrição estrutural da candidatura. Uma leitura não desfaz a série, mas nesta ela não apareceu.`,
    tpm: 'ESTÁVEL em 23,95% (vol USD 7,71M), interrompendo sem queda quatro fechamentos diários seguidos em alta, que vinham de 22,90% em 25/Jul. O gap contra ele abriu 1,00pp no dia, para +39,55pp, por movimento do adversário e não dele: registrar isso é obrigatório, porque gap que abre por um lado só não é reprecificação da candidatura. Nos sub-mercados, SOBE 0,50pp no 2º lugar do 1º turno, para 79,00% (vol USD 215 mil), a maior marca dele naquele contrato no acompanhamento do painel, e fica parado em 6,25% no 3º lugar. A alta no book de 2º lugar tem contrapartida direta no desabamento de Renan Santos no mesmo contrato: o mercado está concentrando nele a segunda vaga do returno.',
  },
  'Renan Santos': {
    tp: `${PODER} o dá em 4%, contra 6% da própria casa em 16/Jul. Essa queda de 2pp é a variação individual mais forte da rodada e, por ser dentro da MESMA casa e do mesmo método, é a comparação que vale. Ela DESFAZ o que o painel registrou em 29/Jul, quando os 7,8% da AtlasIntel tinham estreitado a distância entre preço e urna para 0,90pp: com 4% de urna e 8,45% de preço, a distância REABRE para 4,45pp. A lição de método é que convergência medida contra um único levantamento não é tendência. A dispersão entre institutos segue sem se resolver e tem seis pontos de amplitude no mesmo mês: 7,8% na AtlasIntel, 6% na Nexus, 5% na Indexa, 4% na PoderData e 3% na Datafolha.`,
    tpm: 'CAI 0,25pp no contrato de vencedor, para 8,45% (vol USD 8,59M), abaixo de todo fechamento diário da última semana. Mas o movimento do dia não está aí: está no book de 2º lugar do 1º turno, que DESABOU de 11,70% para 6,10%, queda de 5,60pp num contrato de USD 1,09M, e é o maior movimento isolado do dia em todo o painel. No mesmo pregão, o book de 3º lugar SUBIU 0,50pp, para 62,00% (vol USD 164 mil). Somados, os três dizem a mesma coisa: o dinheiro não o tirou da eleição, o RECLASSIFICOU, retirando dele a chance de disputar o returno e consolidando-o como terceiro colocado. Mantém o maior volume acumulado entre os nomes competitivos do presidencial.',
  },
  'Ronaldo Caiado': {
    tp: `${PODER} o devolve a 5%, alta de 1pp dentro da própria casa contra a rodada de 16/Jul, e isso vem 24 horas depois de a AtlasIntel o ter cortado a 3,1%, metade dos 6% da BTG/Nexus. A divergência sobre ele, portanto, NÃO fechou a favor da leitura baixa: seguem no ar 6%, 5% e 3,1%. O dado estadual da quinta é o descompasso mais nítido da rodada: a Genial/Quaest o dá LIDERANDO Goiás com 33%, à frente de Flávio (27%) e de Lula (23%), no mesmo levantamento em que a desaprovação do governo estadual dele é de 59%.`,
    tpm: 'SOBE 0,20pp no contrato de vencedor, para 2,55% (vol USD 5,20M), acumulando 0,65pp em dois pregões, de 1,90% em 28/Jul. É o ÚNICO nome do painel em que preço e urna subiram juntos hoje. Fica PARADO em 25,50% no book de 3º lugar do 1º turno (vol USD 37 mil), ou seja, a alta não apareceu no contrato em que ele de fato disputa posição, e Renan Santos subiu 0,50pp ali no mesmo pregão. Sobe 0,30pp no book de 2º lugar, para 0,90%. A ressalva de tamanho vem antes de qualquer leitura: 5% de urna com margem de 2pp e 2,55% de preço são grandezas diferentes medindo coisas diferentes, e coincidência de direção não é confirmação.',
  },
  'Romeu Zema': {
    tp: `${PODER} o corta de 4% para 3% dentro da própria casa. É o segundo instituto seguido a medi-lo abaixo de 3%, depois dos 2,8% da AtlasIntel de 29/Jul, que ainda o colocou perdendo o returno nacional para Lula por 48,6% a 39,6%. Segue oficializado pelo Novo desde 27/Jul e SEM vice, com o prazo de 05/Ago a menos de uma semana.`,
    tpm: 'CAI 0,20pp no contrato presidencial, para 0,55% (vol USD 4,57M), devolvendo exatamente o que subira na véspera, e fica em 4,50% no book de 3º lugar do 1º turno. É o único nome do painel que caiu nas DUAS medidas no mesmo dia, urna e preço. Ressalva de série, e ela é grande: o máximo dele na série do AFOS é 10,10%, de 26/Abr, então 0,55% está a pouco mais de um vigésimo daquele nível, e movimentos de 0,20pp nessa faixa têm baixíssimo valor informativo.',
  },
  'Fernando Haddad': {
    tp: 'A PoderData de 30/Jul NÃO o testa em nenhum cenário, nem de 1º turno nem de returno, então ele não tem urna nova nesta rodada, e ausência de teste numa nacional é informação que o painel registra em vez de repetir o dado da véspera como se fosse novo. A leitura favorável mais recente segue sendo a da AtlasIntel de 29/Jul, num dos dois cenários de returno SEM Lula, onde aparece com 44,3% contra 43,7% de Flávio, empate técnico dentro da margem de 1pp. O agravante permanece e precisa ser dito com clareza: ele NÃO é candidato à Presidência, disputa o governo de São Paulo.',
    tpm: 'CAI nos dois contratos em que aparece: 0,10pp no de vencedor, para 0,15%, e 0,30pp no de 2º lugar do 1º turno, para 0,85%. É a inversão do sinal cruzado que o painel registrou em 29/Jul, quando ele subira no book de colocação e ficara parado no de vencedor. Cair nos dois é sinal coerente, e o coerente aqui é para baixo.',
  },
  'Tarcísio': {
    tp: 'Não aparece nos cenários presidenciais das nacionais e a PoderData de 30/Jul não o testa. Em 28/Jul ele liberou aliados e prefeitos da base para apoiarem a candidatura de Caiado, reiterando que o candidato dele segue sendo Flávio.',
    tpm: 'ESTÁVEL em 0,15% no presidencial, com o maior volume acumulado entre todos os nomes com preço vivo no book nesta captura, USD 13,66M. É a anomalia de legado que serve de lembrete permanente de método: volume mede história negociada e não convicção atual. O contrato acumulou esse valor ao longo de meses em que ele era tratado como candidato provável, e o preço de hoje diz que o mercado não o considera mais na disputa.',
  },
}

for (const c of oPd.polymarketComparison.candidates) {
  if (c.name === 'Lula') continue // já reescrito na primeira passada
  const t = TEND[c.name]
  if (!t) { erros.push(`nome sem tendência definida: "${c.name}"`); continue }
  c.tendenciaPesquisa = t.tp
  c.tendenciaPolymarket = t.tpm
}

// Superlativos que o validador reprovou: eu comparei o recorte recente, não a
// série completa, então a afirmação não se sustenta. Sai o superlativo, fica o fato.
const VELHO = ', a maior variação de um indicador isolado em qualquer instituto do recorte'
const VELHO2 = ', a maior variação de um indicador isolado em qualquer instituto deste recorte'
const NOVO = ', um salto grande para duas semanas'
for (const [obj, campo] of [[oPd.polls[0], 'note'], [oPd.approvalData, 'note']] as Array<[any, string]>) {
  const antes = obj[campo]
  const depois = antes.split(VELHO).join(NOVO).split(VELHO2).join(NOVO)
  if (depois === antes) erros.push(`superlativo não encontrado para remover em ${campo}`)
  obj[campo] = depois
}

// e o mesmo superlativo no analysis-data, para não publicar afirmações divergentes
const P_AD = 'public/analysis-data.json'
const oAd = JSON.parse(readFileSync(P_AD, 'utf-8'))
const g = oAd.cards.inss.impactoGestao
const g2 = g.split('É a maior variação de um único indicador em qualquer instituto neste recorte.').join('É um salto grande para duas semanas.')
if (g2 === g) erros.push('superlativo de gestão não encontrado em analysis-data')
oAd.cards.inss.impactoGestao = g2

if (erros.length) {
  console.error('❌ ABORTADO, nada foi escrito:')
  for (const e of erros) console.error('   • ' + e)
  process.exit(1)
}

writeFileSync(P_PD, JSON.stringify(oPd, null, 2) + '\n', 'utf-8')
writeFileSync(P_AD, JSON.stringify(oAd, null, 2) + '\n', 'utf-8')
console.log('✅ tendências dos 6 candidatos reescritas e 3 superlativos retirados.')
