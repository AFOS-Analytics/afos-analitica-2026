/**
 * Atualização do public/polls-data.json em 02/Ago/2026.
 *
 * Troca por CAMINHO, copiando byte a byte tudo que não está no mapa. O arquivo
 * tem 67 KB e quase tudo é número de pesquisa; redigitá-lo para mexer em 20
 * campos cria risco sem necessidade.
 *
 * Preços da captura travada de 02/Ago 19:42 UTC (capture-guard aprovou, 0 motivos).
 * Séries conferidas em scripts/check-superlativo.ts, direto no Neon, 14/Abr a 02/Ago.
 */
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const path = join(process.cwd(), 'public', 'polls-data.json')
const data = JSON.parse(readFileSync(path, 'utf-8'))

// ── raiz ────────────────────────────────────────────────────────────
data.lastUpdate = '2026-08-02'

// ── approvalData: nenhuma nacional nova publicou avaliação. Só entra o
//    aviso de que quatro estão em campo, para o cartão não parecer parado
//    por falta de coleta quando na verdade é falta de publicação. ──────
data.approvalData.note =
  'SEM LEITURA NACIONAL NOVA, E COM QUATRO EM CAMPO. Nenhuma pesquisa nacional publicou aprovação ou desaprovação desde 30/Jul, e a varredura do TSE de 02/Ago leu 538 registros sem inserir nenhum novo. Quatro nacionais estão com campo aberto agora, duas da Nexus, uma da Quaest e uma da Ideia/Canal Meio, com publicação declarada entre 03 e 05/Ago, o que deve refazer este quadro dentro da semana. Data declarada no registro não é publicação. --- ' +
  data.approvalData.note

// ── polymarketComparison ────────────────────────────────────────────
const pm = data.polymarketComparison
pm.updatedAt = '02/08/2026, 16:45'

pm.note =
  'Cruzamento de 02/Ago, captura travada das 19:42 UTC: o gap abriu pelo OUTRO lado. Lula ficou ESTÁVEL em 65,50% (vol USD 7,90M) e o gap sobre Flávio ABRIU para +40,95pp, contra +40,75pp na captura publicada em 01/Ago, mas abriu porque FLÁVIO CAIU 0,20pp, e não porque o favorito subiu. Nos dois pregões anteriores o gap abria com o adversário subindo junto; hoje é o contrário. O TOPO DA SÉRIE FICOU PARA TRÁS: o máximo de Lula é 66,50% e o do gap é +41,80pp, ambos do FECHAMENTO de 01/Ago, e ambos acima do que este painel publica hoje. A série cobre de 14/Abr a 02/Ago, 108 dias, conferida direto no banco. RENAN SANTOS é o movimento do dia: SUBIU 0,35pp e foi a 7,95% (vol USD 8,82M), INTERROMPENDO nove rodadas de queda, no mesmo domingo em que o Missão oficializou a candidatura dele, e o painel registra a coincidência de datas sem afirmar causa. Com a urna dele parada em 3,0%, a distância entre mercado e urna VOLTOU A ABRIR, de 4,60pp para 4,95pp, pelo lado do preço. O pelotão se DIVIDIU: Camilo Santana, Jair Bolsonaro e Haddad subiram, Caiado, Zema, Michelle e Tereza Cristina caíram. CAIADO tocou o piso da série dentro do próprio dia, com 0,90% na coleta das 11:30 UTC, que iguala o menor valor desde 14/Abr, e 1,15% na captura travada. SEM URNA NOVA: a última nacional segue sendo a Vox Brasil de 31/Jul (n=2.100, campo 26 a 28/Jul, margem de 2,15pp, BR-01084/2026), e quatro nacionais publicam entre 03 e 05/Ago. No dia político, o PT oficializou Lula com Alckmin em São Paulo e o Missão oficializou Renan, enquanto Flávio esteve na convenção do PL em Santa Catarina; os dois principais pediram voto antes do prazo legal, que abre em 16/Ago, e seguem sem ampliar alianças, com o Centrão neutro. A trava de dupla leitura APROVOU a rodada sem nenhum motivo de bloqueio. Todos os preços entram firmes, sem faixa declarada. Captura ao vivo 02/Ago 19:42 UTC.'

pm.sources =
  'Polymarket via proxy AFOS (captura ao vivo 02/Ago 19:42 UTC, degraded false, failedCount 0, scripts/capture-guard.ts APROVADO em rodada única, com as duas leituras dentro de 0,20pp em todos os books vigiados e nenhum motivo de bloqueio) + Vox Brasil 31/Jul (BR-01084/2026, n=2.100, campo 26-28/Jul, margem 2,15pp, última nacional publicada) + PoderData/Aya 30/Jul (BR-07845/2026, n=2.400) + AtlasIntel/Bloomberg 29/Jul (BR-08602/2026, n=5.021, maior amostra do recorte) + BTG/Nexus 27/Jul (BR-01489/2026) + Datafolha 24/Jul (BR-01166/2026) + Gerp 22/Jul (BR-05026/2026) + Indexa 21/Jul (BR-02904/2026) + Real Time Big Data 21/Jul (BR-09247/2026) + PoderData/Aya 16/Jul (BR-00059/2026) + Genial/Quaest 15/Jul (BR-07181/2026) + Futura/Apex 14/Jul (BR-07294/2026) + AtlasIntel 01/Jul (BR-04582/2026). Em campo agora, sem publicação: Nexus (BR-05573/2026, n=1.200, campo 30/Jul a 02/Ago, publicação declarada 04/Ago), Nexus (BR-02874/2026, n=2.000, campo 31/Jul a 02/Ago, publicação declarada 03/Ago), Quaest (BR-06591/2026, n=2.004, campo 31/Jul a 03/Ago, publicação declarada 05/Ago) e Ideia/Canal Meio (BR-04579/2026, n=1.500, campo 31/Jul a 03/Ago, publicação declarada 05/Ago). Série do AFOS conferida em scripts/check-superlativo.ts, direto no Neon, sem cap de janela, cobertura de 14/Abr a 02/Ago com 108 dias de dado: máximo de Lula em 66,50% (01/Ago) e mínimo em 35,50% (27/Abr); máximo do gap em +41,80pp (01/Ago) e mínimo em -7,80pp (05/Mai); Renan Santos com máximo de 17,90% (09/Jun) e mínimo de 5,30% (26/Abr); piso de Caiado em 0,90%, tocado entre 05 e 09/Jul e de novo em 02/Ago às 11:30 UTC; máximo de Camilo Santana em 4,10% (03/Mai); máximo de Zema em 10,10% (26/Abr). RESSALVA DE COLETA, do painel e não do mercado: a série não tem ponto de 01/Ago para Camilo Santana nem ponto depois de 30/Jul para Zema, e por isso nenhum superlativo é afirmado sobre os dois. Para Tarcísio de Freitas a série tem apenas três dias, entre 28/Abr e 14/Mai, e também não sustenta superlativo.'

/** name -> [odds, texto de mercado] da captura travada de 02/Ago 19:42 UTC. */
const MERCADO: Record<string, [number, string]> = {
  Lula: [
    65.5,
    'Fica ESTÁVEL em 65,50% (vol USD 7,90M) no dia em que o PT oficializou a candidatura dele em convenção nacional. O gap sobre Flávio ABRIU para +40,95pp, mas abriu por queda do adversário, e não por alta dele, o que inverte o mecanismo dos dois pregões anteriores. O TOPO FICOU PARA TRÁS e a janela precisa ser dita: o máximo da série é 66,50%, do fechamento de 01/Ago, e o preço de hoje está 1,00pp abaixo dele. A série do AFOS cobre de 14/Abr a hoje, 108 dias.',
  ],
  'Flávio Bolsonaro': [
    24.55,
    'CAI 0,20pp e vai a 24,55% (vol USD 7,82M), interrompendo seis pregões sem queda, e é a própria queda dele que ABRE o gap para +40,95pp, porque Lula ficou parado. Nos sub-mercados o sinal é o inverso: SOBE 1,00pp no book de 2º lugar do 1º turno, que passa a 80,50% num contrato de USD 217 mil, a maior marca dele ali no acompanhamento do painel, e fica praticamente parado no 3º lugar, em 4,90%. Cede na chance de ganhar e sobe na de chegar ao returno, no mesmo pregão, e o painel não escolhe entre os dois.',
  ],
  'Renan Santos': [
    7.95,
    'SOBE 0,35pp e vai a 7,95% (vol USD 8,82M), INTERROMPENDO uma sequência de queda que durava nove rodadas, no mesmo domingo em que o Missão oficializou a candidatura dele em São Paulo. O painel registra a coincidência de datas e não afirma causa. A alta foi geral nos três books: 0,20pp no 2º lugar do 1º turno, para 8,75%, e 2,00pp no 3º lugar, para 63,50%, onde é favorito isolado. A virada NÃO desfaz o arco: saiu de 12,00% em 23/Jul e tocou 7,10% no fechamento de 01/Ago. Não é mínimo de série, que é 5,30%, de 26/Abr, nem máximo, que é 17,90%, de 09/Jun.',
  ],
  'Ronaldo Caiado': [
    1.15,
    'CAI 0,20pp e vai a 1,15% (vol USD 5,27M), no quarto pregão seguido de queda, e SOBE 2,00pp no book de 3º lugar do 1º turno, para 24,50% num contrato de USD 37 mil, recuperando a queda da véspera. O registro de série é intradiário e o painel publica os dois lados: a coleta das 11:30 UTC gravou 0,90%, que IGUALA o menor valor desde 14/Abr, já registrado entre 05 e 09/Jul, e a captura travada das 19:42 UTC traz 1,15%. O painel publica a travada e registra o piso do dia em vez de escolher um dos dois.',
  ],
  'Tarcísio': [
    0.05,
    'Fica ESTÁVEL em 0,05%, com o maior volume acumulado do book presidencial, USD 13,70M. É a anomalia de legado que serve de lembrete permanente de método: volume mede história negociada e não convicção atual. Foi oficializado pelo Republicanos em 01/Ago à REELEIÇÃO no governo de São Paulo, e a convenção nacional do partido, que decide aliança presidencial, é em 04/Ago. O painel registra o nível e NÃO afirma que é o menor dele: a série do AFOS tem apenas três dias para esse nome, entre 28/Abr e 14/Mai, e não sustenta superlativo.',
  ],
  'Romeu Zema': [
    0.25,
    'CAI 0,10pp e vai a 0,25% (vol USD 4,64M), e fica ESTÁVEL em 4,60% no book de 3º lugar do 1º turno. Ressalva de série, e ela é grande: o máximo dele é 10,10%, de 26/Abr, então 0,25% é menos de um quarentavo daquele nível e movimentos nessa faixa têm valor informativo quase nulo. Ressalva de coleta, e ela é do painel e não do mercado: a série do AFOS NÃO tem ponto depois de 30/Jul para esse nome, então o preço entra pela captura travada e sem comparação com fechamento de série. Segue SEM vice, com o prazo de 05/Ago a três dias.',
  ],
  'Fernando Haddad': [
    0.3,
    'SOBE 0,05pp e vai a 0,30% (vol USD 6,63M), e mantém 1,05% no book de 2º lugar do 1º turno. A ressalva de escala continua valendo: nesse nível de preço, movimento de 0,05pp tem valor informativo quase nulo, e o painel registra o nível, não a oscilação. O volume acumulado dele é maior que o de vários nomes com preço acima do dele, o que mede história negociada e não convicção atual.',
  ],
}

/** name -> tendência de urna. Só muda onde há fato novo a registrar. */
const URNA: Record<string, string> = {
  Lula:
    'SEM URNA NACIONAL NOVA. A última segue sendo a Vox Brasil de 31/Jul (n=2.100, campo 26 a 28/Jul, margem de 2,15pp, BR-01084/2026), com 40,5% no 1º turno e 47,5% x 41,1% no returno. A vantagem de 6,4pp no returno fica FORA da margem somada das duas pontas, então esta leitura NÃO descreve empate técnico. A varredura do TSE de hoje leu 538 registros e não inseriu nenhum novo, o que confirma pelo lado do registro o que a imprensa confirma pelo lado da publicação. QUATRO nacionais estão com campo aberto, duas da Nexus, uma da Quaest e uma da Ideia/Canal Meio, com publicação declarada entre 03 e 05/Ago. Data declarada no registro não é publicação. As pesquisas do dia são ESTADUAIS e não entram aqui: a Datafolha de Pernambuco dá 57% a ele no estado, e a Genial/Quaest o mostra à frente em quatro estados.',
  'Flávio Bolsonaro':
    'Vox Brasil de 31/Jul (n=2.100, campo 26 a 28/Jul, margem de 2,15pp, BR-01084/2026) o traz em 31,2% no 1º turno e 41,1% no returno. Os 6,4pp que o separam de Lula ficam fora da margem somada, o que afasta a leitura de empate técnico que a PoderData sustentava em 30/Jul. Sem urna nacional nova desde então, e quatro em campo com publicação declarada entre 03 e 05/Ago. No arranjo de chapa, segue SEM vice a três dias do prazo de 05/Ago, depois de o PP declarar neutralidade e vetar a chapa com Tereza Cristina, e o Valor Econômico registra que ele e Lula chegaram à reta final das convenções sem ampliar alianças, com o Centrão ainda neutro. A convenção nacional do Republicanos, que decide aliança presidencial, é em 04/Ago. Na convenção do PL em Santa Catarina ele pediu voto antes do prazo legal, que só abre em 16/Ago, e usou um novo vídeo com Jair Bolsonaro depois de ser questionado por Moraes sobre o anterior, gerado por inteligência artificial.',
  'Renan Santos':
    'TRÊS institutos seguidos o cortaram, e é a sequência que importa, não o número isolado: 7,8% na AtlasIntel de 29/Jul, 4% na PoderData de 30/Jul e 3,0% na Vox Brasil de 31/Jul. Não houve urna nacional nova desde então, mas o preço subiu: com o mercado agora em 7,95%, a distância entre mercado e urna VOLTOU A ABRIR, de 4,60pp para 4,95pp, e abriu pelo lado do preço, do mesmo jeito que havia fechado. Em 29/Jul este painel registrou essa mesma distância em 0,90pp e a chamou de convergência; ela quadruplicou, recuou e agora volta a abrir, e fica registrado que a leitura de 29/Jul não se sustentou. Neste domingo o Missão oficializou a candidatura dele em São Paulo, e ele atacou Lula e Flávio, chamou Moro de vassalo, disse que vai tirar Flávio do returno e prometeu matar quem roubar.',
  'Ronaldo Caiado':
    'Vox Brasil de 31/Jul (n=2.100, campo 26 a 28/Jul, margem de 2,15pp, BR-01084/2026) lhe dá 5,5% no 1º turno, a MELHOR leitura nacional dele no recorte, acima dos 5% da PoderData de 30/Jul e bem acima dos 3,1% da AtlasIntel de 29/Jul. Sem urna nova desde então. A divergência entre institutos sobre ele segue aberta em QUATRO níveis dentro do mesmo mês: 6% na Nexus, 5,5% na Vox, 5% na PoderData e 3,1% na AtlasIntel. Nesta semana ele disse que Lula e Flávio brincam de esconde-esconde e preferem discutir Trump a discutir educação.',
  'Tarcísio':
    'A Vox Brasil de 31/Jul não o testa em nenhum cenário presidencial. Em 01/Ago o Republicanos oficializou a candidatura dele à REELEIÇÃO no governo de São Paulo, com Flávio Bolsonaro no palanque, e ele manteve o foco no estado e evitou nacionalizar o discurso. A convenção nacional do partido, que trata de aliança presidencial, é em 04/Ago.',
  'Romeu Zema':
    'Vox Brasil de 31/Jul (n=2.100, campo 26 a 28/Jul, margem de 2,15pp, BR-01084/2026) o traz em 3,2% no 1º turno, praticamente os mesmos 3% da PoderData de 30/Jul e acima dos 2,8% da AtlasIntel de 29/Jul. Na urna ele está estável, e não houve nacional nova desde então. No arranjo partidário, segue SEM vice com o prazo de 05/Ago a três dias, depois de o Novo descartar Barbosa para a vaga e de Marcelo Aro deixar a chapa dele ao Senado para disputar o governo de Minas Gerais, movimento que Zema chamou publicamente de traição.',
  'Fernando Haddad':
    'A Vox Brasil de 31/Jul NÃO o testa em nenhum cenário, nem de 1º turno nem de returno, e nenhuma nacional foi publicada desde então, então ele segue sem urna nova. Ausência de teste numa nacional é informação que o painel registra em vez de repetir o dado da véspera como se fosse novo. O agravante permanece e precisa ser dito com clareza: ele NÃO é candidato à Presidência, disputa o governo de São Paulo, e o cenário que o favorece é hipótese de pesquisa e não candidatura em curso.',
}

let tocados = 0
for (const c of pm.candidates) {
  const m = MERCADO[c.name]
  if (!m) throw new Error(`candidato sem preço no mapa: ${c.name}`)
  const [odds, tendencia] = m

  // `value` alimenta o dataset do HF e `odds`/`polymarket` alimentam a tela.
  // Os três precisam sair do MESMO número travado, senão o dataset e o painel
  // divergem em silêncio.
  c.odds = odds
  c.value = odds
  c.polymarket = odds.toFixed(2).replace('.', ',') + '%'
  c.tendenciaPolymarket = tendencia

  const u = URNA[c.name]
  if (u) c.tendenciaPesquisa = u

  // `percentage` alimenta o grafo de divergência e é a URNA, não o mercado.
  // Nenhuma nacional nova publicou, então ele NÃO muda hoje, e o lastUpdate
  // de cada candidato continua marcando a data da urna que o alimenta.
  tocados++
}

writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf-8')
console.log(`polls-data.json atualizado: ${tocados} candidatos, lastUpdate=${data.lastUpdate}`)
console.log('percentage e lastUpdate por candidato preservados (nenhuma urna nacional nova).')
