/**
 * Complemento do /atualizar de 31/Jul: as tendências dos 7 candidatos do
 * polymarketComparison, que a primeira passada não cobriu.
 *
 * ⚠️ Evitar a construção "para X% (vol ...)" ao falar de SUB-MERCADO: é o idioma
 * do preço de VENCEDOR e o validador acusa INCONSISTENTE, com razão.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const P = 'public/polls-data.json'
const erros: string[] = []
const o = JSON.parse(readFileSync(P, 'utf-8'))

const VOX = 'Vox Brasil de 31/Jul (n=2.100, campo 26 a 28/Jul, margem de 2,15pp, BR-01084/2026)'

const T: Record<string, { tp: string; tpm: string }> = {
  'Lula': {
    tp: `${VOX} dá 40,5% no 1º turno e 47,5% x 41,1% no returno. A vantagem de 6,4pp no returno fica FORA da margem somada das duas pontas, então esta leitura NÃO descreve empate técnico, ao contrário da PoderData de 30/Jul, que dava 3pp. O registro que organiza a semana: TRÊS casas mediram o gap do 1º turno em 9,1pp (AtlasIntel, 29/Jul), 6pp (PoderData, 30/Jul) e 9,3pp (Vox, hoje). Duas concordam em torno de 9pp e a que destoa é a PoderData. Esta rodada não publicou aprovação nem rejeição.`,
    tpm: 'ESTÁVEL em 63,50% pelo segundo pregão seguido, mantendo o valor que iguala o topo da série do AFOS, marcado em 26, 28 e 30/Jul. O gap sobre Flávio recuou de +39,55pp para +39,20pp, e recuou por movimento do adversário e não dele. Dois pregões sem qualquer variação no contrato de vencedor, numa semana em que o resto do book se mexeu bastante, e o preço não reagiu a nenhuma das três urnas nacionais publicadas nos últimos três dias.',
  },
  'Flávio Bolsonaro': {
    tp: `${VOX} o traz em 31,2% no 1º turno e 41,1% no returno. Os 6,4pp que o separam de Lula ficam fora da margem somada, o que afasta a leitura de empate técnico que a PoderData sustentava na véspera. O dia dele, porém, foi de arranjo de chapa e tem TRÊS versões do mesmo fato: ele afirmou que Tereza Cristina aceitou ser vice, a senadora disse que houve conversa e que a decisão depende do PL e do PP-União, e a cúpula do PP avalia que ela aceitou por saber que o partido barraria. O prazo de 05/Ago está a menos de uma semana.`,
    tpm: 'SOBE 0,35pp e vai a 24,30% (vol USD 7,76M), e é ele quem estreita o gap, que passa a +39,20pp. Nos sub-mercados o sinal é CRUZADO: cede 1,00pp no book de 2º lugar do 1º turno, que passa a 78,00% num contrato de USD 216 mil, e cede 0,60pp no de 3º lugar, que passa a 5,65%. Subir na chance de ganhar e ceder nas duas de colocação é combinação incomum, e a contrapartida da queda no book de 2º lugar é a alta de 3,25pp de Renan Santos no mesmo contrato, o que sugere realocação interna e não leitura nova sobre o returno.',
  },
  'Renan Santos': {
    tp: 'TRÊS institutos seguidos o cortaram, e é a sequência que importa, não o número isolado: 7,8% na AtlasIntel de 29/Jul, 4% na PoderData de 30/Jul e 3,0% na Vox Brasil de 31/Jul. Com o preço em 8,15%, a distância entre mercado e urna chega a 5,15pp, a maior do recorte. Em 29/Jul este painel registrou essa mesma distância em 0,90pp e a chamou de convergência; três institutos depois, ela quadruplicou, e fica registrado que aquela leitura não se sustentou. A dispersão entre casas deixou de ser dispersão: as três leituras mais recentes são também as três mais baixas, o que descreve tendência de queda.',
    tpm: 'CAI 0,30pp e vai a 8,15% (vol USD 8,63M), quarto pregão seguido de queda no contrato de vencedor. Mas o movimento do dia é o oposto no book de colocação: SOBE 3,25pp no de 2º lugar do 1º turno, de 6,10% para 9,35% num contrato de USD 1,09M, recuperando dois terços do que perdera na véspera, e fica ESTÁVEL em 62,00% no de 3º lugar. Ontem o painel registrou que o dinheiro o havia reclassificado, tirando dele a chance de returno; hoje o mesmo dinheiro devolveu boa parte dela, no dia em que a urna o cortou pela terceira vez seguida. As duas direções ficam registradas e nenhuma é arbitrada. Mantém, nesta captura, o maior volume acumulado entre os nomes competitivos do presidencial, USD 8,63M.',
  },
  'Ronaldo Caiado': {
    tp: `${VOX} lhe dá 5,5% no 1º turno, a MELHOR leitura nacional dele no recorte, acima dos 5% da PoderData de 30/Jul e bem acima dos 3,1% da AtlasIntel de 29/Jul. A divergência entre institutos sobre ele segue aberta em QUATRO níveis dentro do mesmo mês: 6% na Nexus, 5,5% na Vox, 5% na PoderData e 3,1% na AtlasIntel, e a leitura de hoje é a mais alta das quatro.`,
    tpm: 'CAI 0,80pp e vai a 1,75% (vol USD 5,22M), devolvendo em um único pregão toda a alta acumulada em dois dias. A ressalva de série é obrigatória e corta para os dois lados: 1,75% está dentro da faixa normal dele desde 22/Jul, quando a série do AFOS registrou 1,80%, e os 2,55% da véspera é que eram o desvio para cima. Não houve colapso, houve devolução de desvio. E o sinal é cruzado, porque no book de 3º lugar do 1º turno ele SOBE 1,00pp, passando a 26,50% num contrato de USD 37 mil. A leitura que se sustenta é de realocação: o mercado o move de candidato a vencedor para candidato a terceiro colocado, e a urna não acompanha, porque lhe deu justamente hoje a melhor marca do recorte.',
  },
  'Tarcísio': {
    tp: 'A Vox Brasil de 31/Jul não o testa em nenhum cenário presidencial. Em 28/Jul ele liberou aliados e prefeitos da base para apoiarem a candidatura de Caiado, reiterando que o candidato dele segue sendo Flávio.',
    tpm: 'ESTÁVEL em 0,15%, com o maior volume acumulado do book presidencial nesta captura, USD 13,68M. É a anomalia de legado que serve de lembrete permanente de método: volume mede história negociada e não convicção atual. O contrato acumulou esse valor ao longo de meses em que ele era tratado como candidato provável, e o preço de hoje diz que o mercado não o considera mais na disputa.',
  },
  'Romeu Zema': {
    tp: `${VOX} o traz em 3,2% no 1º turno, praticamente os mesmos 3% da PoderData de 30/Jul e acima dos 2,8% da AtlasIntel de 29/Jul. Na urna ele está estável. No arranjo partidário o dia foi ruim: Marcelo Aro deixou a chapa dele ao Senado para disputar o governo de Minas Gerais, movimento que Zema chamou publicamente de traição, e o Novo descartou Barbosa como vice, caminhando para chapa puro-sangue. Segue SEM vice, com o prazo de 05/Ago a menos de uma semana.`,
    tpm: 'CAI 0,10pp e vai a 0,45% (vol USD 4,58M), no TERCEIRO pregão seguido de queda no contrato de vencedor, e fica em 4,45% no book de 3º lugar do 1º turno. Ressalva de série, e ela é grande: o máximo dele na série do AFOS é 10,10%, de 26/Abr, então 0,45% é menos de um vigésimo daquele nível, e movimentos de 0,10pp nessa faixa têm valor informativo quase nulo.',
  },
  'Fernando Haddad': {
    tp: 'A Vox Brasil de 31/Jul NÃO o testa em nenhum cenário, nem de 1º turno nem de returno, então ele não tem urna nova nesta rodada, e ausência de teste numa nacional é informação que o painel registra em vez de repetir o dado da véspera como se fosse novo. O agravante permanece e precisa ser dito com clareza: ele NÃO é candidato à Presidência, disputa o governo de São Paulo, e o cenário que o favorece é hipótese de pesquisa e não candidatura em curso.',
    tpm: 'SOBE 0,15pp e vai a 0,30%, dobrando o valor da véspera, e chega a 1,00% no book de 2º lugar do 1º turno, no segundo pregão seguido de alta naquele contrato. A ressalva de escala é obrigatória: num preço de 0,30%, uma alta de 0,15pp tem valor informativo quase nulo, e o movimento só é registrado porque é o segundo dia seguido na mesma direção.',
  },
}

for (const c of o.polymarketComparison.candidates) {
  const t = T[c.name]
  if (!t) { erros.push(`nome sem tendência: "${c.name}"`); continue }
  c.tendenciaPesquisa = t.tp
  c.tendenciaPolymarket = t.tpm
}

set: {
  const n = o.polymarketComparison.candidates.length
  if (n !== 7) erros.push(`esperava 7 candidatos, achei ${n}`)
}

o.polymarketComparison.note = `Cruzamento de 31/Jul: o favorito não se mexeu e quase todo o resto se mexeu. Lula ESTÁVEL em 63,50% (vol USD 7,77M) pelo segundo pregão, e o gap recua de +39,55pp para +39,20pp porque Flávio SUBIU 0,35pp, indo a 24,30% (vol USD 7,76M). A URNA: ${VOX} dá Lula 40,5% x Flávio 31,2% no 1º turno e 47,5% x 41,1% no returno, e os 6,4pp do returno ficam FORA da margem somada, o que afasta a leitura de empate técnico da véspera. A SEMANA TEM TRÊS GAPS DE 1º TURNO E ELES NÃO CONCORDAM: 9,1pp na AtlasIntel, 6pp na PoderData e 9,3pp na Vox. A fora da curva é a PoderData. O ACHADO É RENAN SANTOS, e é de sequência: TRÊS institutos seguidos o cortaram, de 7,8% para 4% e agora 3,0%, e com preço em 8,15% a distância entre mercado e urna chega a 5,15pp, a maior do recorte, contra os 0,90pp que este painel chamou de convergência em 29/Jul. Aquela leitura não se sustentou. E o mercado se contradisse: no mesmo dia, o book de 2º lugar do 1º turno dele SUBIU 3,25pp, de 6,10% para 9,35%, devolvendo dois terços do que fora retirado na véspera. CAIADO devolveu tudo: caiu 0,80pp, para 1,75%, desfazendo em um pregão a alta de dois dias, e subiu 1,00pp no 3º lugar, passando a 26,50%, no mesmo dia em que a Vox lhe deu 5,5%, a melhor urna nacional dele no recorte. A ressalva de série diz que 1,75% é a faixa normal dele desde 22/Jul e que os 2,55% da véspera é que eram o desvio. CAMILO SANTANA subiu a 2,20% e ALCKMIN a 1,10%, no dia em que o PCdoB formalizou apoio à chapa Lula-Alckmin, e o painel registra a coincidência sem afirmar causa; sobre Camilo, 2,20% NÃO é recorde, o máximo dele é 4,10% de 03/Mai e o movimento é recuperação do mínimo da série, 0,50%, marcado ontem. NOS DEMAIS MERCADOS: impeachment de ministro do STF ESTÁVEL em 3,10% (vol USD 83 mil), sem variação nas quatro leituras da trava; no Senado o PL subiu 6,50pp, indo a 72,00% (vol USD 258 mil), e o MDB entra como FAIXA declarada de 25,20% a 26,60%; na inflação a faixa de 4,50% a 4,99% subiu 1,20pp, para 33,70%. NOTA DE CAPTURA: a trava de dupla leitura REPROVOU as duas rodadas de hoje, e por isso vale a regra de faixa. O único book divergente foi o do MDB no Senado, que oscilou entre 25,20% e 26,60% em três leituras. O contrato presidencial inteiro repetiu nas QUATRO leituras, então o dado principal está firme. Volume total acumulado no presidencial em USD 117,03M.`

o.polymarketComparison.sources = 'Polymarket via proxy AFOS (captura ao vivo 31/Jul 20:33 UTC, degraded false, failedCount 0, scripts/capture-guard.ts em DUAS rodadas, ambas reprovadas; único book divergente foi senate:MDB, publicado como faixa; o presidencial repetiu nas quatro leituras) + Vox Brasil 31/Jul (BR-01084/2026, n=2.100, campo 26-28/Jul, margem 2,15pp, última nacional) + PoderData/Aya 30/Jul (BR-07845/2026, n=2.400) + AtlasIntel/Bloomberg 29/Jul (BR-08602/2026, n=5.021, maior amostra do recorte) + BTG/Nexus 27/Jul (BR-01489/2026) + Datafolha 24/Jul (BR-01166/2026) + Gerp 22/Jul (BR-05026/2026) + Indexa 21/Jul (BR-02904/2026) + Real Time Big Data 21/Jul (BR-09247/2026) + PoderData/Aya 16/Jul (BR-00059/2026) + Genial/Quaest 15/Jul (BR-07181/2026) + Futura/Apex 14/Jul (BR-07294/2026) + AtlasIntel 01/Jul (BR-04582/2026). Série do AFOS conferida em scripts/check-superlativo.ts, direto no Neon, sem cap de janela: máximo de Camilo Santana em 4,10% (03/Mai) e mínimo em 0,50% (30/Jul); faixa de Caiado desde 22/Jul entre 1,80% e 2,10%; máximo de Zema em 10,10% (26/Abr).'

if (erros.length) {
  console.error('❌ ABORTADO:')
  erros.forEach(e => console.error('   • ' + e))
  process.exit(1)
}

writeFileSync(P, JSON.stringify(o, null, 2) + '\n', 'utf-8')
console.log('✅ 7 tendências + note + sources reescritos')
