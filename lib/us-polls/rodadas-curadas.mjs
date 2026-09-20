/**
 * RODADAS CURADAS: pesquisas lidas na listagem do PRÓPRIO instituto, porque o
 * índice não as recebeu.
 *
 * 🔑 POR QUE ISTO EXISTE, E POR QUE ERA PRA NÃO EXISTIR. O `fora-do-indice.mjs`
 * DETECTA rodada que a Wikipédia não indexou e, de propósito, NUNCA ingere: ler
 * valor na listagem do instituto muda a PROCEDÊNCIA da média servida, e isso é
 * decisão, não efeito colateral. Em 04/Set/2026 a decisão foi tomada pelo André,
 * com o índice congelado desde 25/Ago e a média servida a 13 dias de deixar de
 * existir por esvaziamento da janela de 30 dias.
 *
 * ⚠️ ENTÃO ESTE ARQUIVO É EXCEÇÃO DECLARADA, NÃO CAMINHO NOVO. A regra da casa
 * continua sendo: a Wikipédia é o índice. Cada linha aqui é escrita à mão, com
 * a URL da crosstab do instituto e a decomposição das opções, para que o número
 * possa ser reconferido sem buscar nada de novo.
 *
 * ✅ A TRAVA QUE TORNA ISTO SEGURO É A DEDUPLICAÇÃO, E O ÍNDICE SEMPRE VENCE.
 *
 * O risco real não é a linha estar errada, é ela entrar DUAS VEZES: no dia em
 * que a Wikipédia finalmente indexar a onda, a mesma rodada contaria pelo índice
 * e por aqui, inflando o n e puxando a média para a casa duplicada. Por isso a
 * mesclagem descarta a curada quando o índice já tem a mesma onda. A curadoria
 * se APOSENTA sozinha; ninguém precisa lembrar de apagar.
 *
 * ⚠️ E o quase-encontro é AVISADO, nunca resolvido no escuro: se o índice trouxer
 * a mesma casa e o mesmo recorte com campo a poucos dias de distância, pode ser a
 * mesma onda com data ligeiramente diferente, e aí a deduplicação exata não pega.
 * O módulo denuncia e deixa a decisão com quem lê.
 */

/** Duas datas de campo a esta distância ou menos, na mesma casa e no mesmo recorte, são suspeitas de ser a MESMA onda. */
const DIAS_SUSPEITA = 3

/**
 * O conjunto tem DOIS grupos, e cada um traz a sua própria decisão datada: as 3
 * ondas da The Economist/YouGov confirmadas na listagem da casa em 04/Set/2026,
 * em 2 recortes cada, e a rodada da Quantus Insights de 10/Set/2026.
 *
 * As 3 rodadas da The Economist/YouGov com campo posterior ao que o índice
 * alcança, confirmadas na listagem da casa em 04/Set/2026.
 *
 * Números lidos na CROSSTAB da própria YouGov (`econTabReport`), na pergunta
 * "Generic Congressional Vote — In the elections for U.S. Congress in November,
 * who will you vote for in the district where you live?".
 *
 * `outros` é a soma de "Other" + "Not sure" + "I will not vote", que é como o
 * índice preenche a coluna nas linhas desta mesma casa. A decomposição fica em
 * `opcoes` para conferência.
 *
 * O `amostra` do recorte RV é o N NÃO PONDERADO da coluna "Reg Voters", que é o
 * único disponível para o subconjunto. O do recorte A é a amostra declarada no
 * cabeçalho do relatório. A média da casa é simples e não usa amostra, então a
 * escolha não move número nenhum: ela só precisa ser a mesma sempre.
 */
export const RODADAS_CURADAS = [
  // ── onda de campo 14-17/Ago/2026 · margem ±3,4% ──
  {
    instituto: 'The Economist/YouGov',
    campoInicio: '2026-08-14',
    campoFim: '2026-08-17',
    amostra: 1449,
    amostraTipo: 'RV',
    margemErro: 3.4,
    dem: 46,
    rep: 39,
    outros: 14,
    vantagemDem: 7,
    fontePrimaria: 'https://d3nkl3psvxxpe9.cloudfront.net/documents/econTabReport_jNjXIL6.pdf',
    opcoes: { other: 1, naoSabe: 11, naoVotara: 2 },
  },
  {
    instituto: 'The Economist/YouGov',
    campoInicio: '2026-08-14',
    campoFim: '2026-08-17',
    amostra: 1611,
    amostraTipo: 'A',
    margemErro: 3.4,
    dem: 39,
    rep: 32,
    outros: 30,
    vantagemDem: 7,
    fontePrimaria: 'https://d3nkl3psvxxpe9.cloudfront.net/documents/econTabReport_jNjXIL6.pdf',
    opcoes: { other: 1, naoSabe: 13, naoVotara: 16 },
  },
  // ── onda de campo 21-24/Ago/2026 · margem ±3,5% ──
  {
    instituto: 'The Economist/YouGov',
    campoInicio: '2026-08-21',
    campoFim: '2026-08-24',
    amostra: 1377,
    amostraTipo: 'RV',
    margemErro: 3.5,
    dem: 46,
    rep: 40,
    outros: 14,
    vantagemDem: 6,
    fontePrimaria: 'https://d3nkl3psvxxpe9.cloudfront.net/documents/econTabReport_v7iliA1.pdf',
    opcoes: { other: 1, naoSabe: 11, naoVotara: 2 },
  },
  {
    instituto: 'The Economist/YouGov',
    campoInicio: '2026-08-21',
    campoFim: '2026-08-24',
    amostra: 1536,
    amostraTipo: 'A',
    margemErro: 3.5,
    dem: 37,
    rep: 31,
    outros: 32,
    vantagemDem: 6,
    fontePrimaria: 'https://d3nkl3psvxxpe9.cloudfront.net/documents/econTabReport_v7iliA1.pdf',
    opcoes: { other: 1, naoSabe: 9, naoVotara: 22 },
  },
  // ── onda de campo 28-31/Ago/2026 · margem ±3,5% ──
  {
    instituto: 'The Economist/YouGov',
    campoInicio: '2026-08-28',
    campoFim: '2026-08-31',
    amostra: 1434,
    amostraTipo: 'RV',
    margemErro: 3.5,
    dem: 46,
    rep: 40,
    outros: 15,
    vantagemDem: 6,
    fontePrimaria: 'https://d3nkl3psvxxpe9.cloudfront.net/documents/econTabReport_yVe1kKt.pdf',
    opcoes: { other: 2, naoSabe: 10, naoVotara: 3 },
  },
  {
    instituto: 'The Economist/YouGov',
    campoInicio: '2026-08-28',
    campoFim: '2026-08-31',
    amostra: 1592,
    amostraTipo: 'A',
    margemErro: 3.5,
    dem: 36,
    rep: 31,
    outros: 32,
    vantagemDem: 5,
    fontePrimaria: 'https://d3nkl3psvxxpe9.cloudfront.net/documents/econTabReport_yVe1kKt.pdf',
    opcoes: { other: 1, naoSabe: 8, naoVotara: 23 },
  },
  // ── Quantus Insights, onda de campo 26-28/Ago/2026 · margem ±3,2% ──
  /**
   * 📌 A SEGUNDA casa a entrar por aqui, decidida pelo André em 10/Set/2026, e a
   * primeira que não é a YouGov. O índice parou na onda de campo 03-04/Ago desta
   * casa, e o conferidor de defasagem só enxergou a de 28/Ago depois que o feed
   * da casa foi ligado e o marcador passou a reconhecer "congressional
   * environment", que é como o resumo do post chama o generic ballot.
   *
   * Números lidos no RELATÓRIO TÉCNICO da própria Quantus, "Q1 · CONGRESSIONAL
   * BALLOT", pergunta "If the election for Congress in your district were held
   * today, which party's candidate would you vote for?". A decomposição fecha em
   * 100 exatos: 49,7 democrata, 42,8 republicano e 7,5 indeciso. O relatório
   * ainda declara o two-way em 53,7 x 46,3, que NÃO é o que entra: a média da
   * casa usa o percentual sobre a amostra inteira, como em toda linha do índice.
   *
   * ⚠️ É a primeira linha curada com DÉCIMOS, e isso não é detalhe de forma: a
   * casa publica com uma casa decimal e o índice arredonda para inteiro nas
   * linhas dela. Guardar como a casa publicou é o que permite reconferir, e o
   * arredondamento seria nosso, não dela.
   *
   * 🏷️ E `outros` aqui é SÓ o indeciso, porque a Q1 não oferece terceira via nem
   * "não vou votar". Escrever zeros para opções que a crosstab não tem seria
   * inventar estrutura para caber num formato.
   *
   * 🔗 A fonte primária é o arquivo do relatório, não o post: o post traz a
   * frase e o relatório traz o campo, a amostra e a margem.
   */
  {
    instituto: 'Quantus Insights (R)',
    campoInicio: '2026-08-26',
    campoFim: '2026-08-28',
    amostra: 1200,
    amostraTipo: 'LV',
    margemErro: 3.2,
    dem: 49.7,
    rep: 42.8,
    outros: 7.5,
    vantagemDem: 6.9,
    fontePrimaria: 'https://drive.google.com/file/d/14qaFHR-Fd-3Ik_5Ayz5yqeN6UutHANb0/view',
    opcoes: { naoSabe: 7.5 },
  },

  /**
   * 🔴 TERCEIRO GRUPO, decisão do André em 19/Set/2026, e o motivo é novo.
   *
   * Naquele dia o `agregador-na-fonte-us.mjs` leu o Race to the WH no dado
   * VIVO, em vez da cópia da Wikipédia, e achou **29 rodadas na janela de 30
   * dias contra as 10 da nossa média**. O `agregadores-us-polls` tinha saído
   * `EM COMPASSO, 0 dias` no mesmo dia: ele compara a PONTA, e estava certo na
   * ponta e cego no meio.
   *
   * ⛔ E os números do AGREGADOR não foram usados, de propósito. Medido nas 7
   *    rodadas que as duas fontes têm em comum, 3 tinham número DIFERENTE para
   *    a mesma pesquisa: a Zogby de 15-17/Set sai D48 R42 lá e D46 R40 aqui,
   *    que é exatamente a dimensão do LEANER. Ingerir a linha deles misturaria
   *    duas convenções de medição na mesma média.
   *    Ver memory/feedback_a_dimensao_do_leaner_e_uma_escolha_que_ninguem_sabia_estar_fazendo.md
   *
   * ✅ Então cada linha abaixo é lida no RELEASE DO PRÓPRIO INSTITUTO, com a
   *    pergunta conferida como GENÉRICA e a decomposição transcrita.
   */

  /**
   * Marquette Law School Poll, nacional, campo 2-9/Set/2026.
   * Release de 16/Set: "New Marquette Law School national survey finds
   * Democrats expand lead on congressional ballots".
   *
   * ✅ Pergunta conferida e GENÉRICA, sem nomes: "If the election for Congress
   *    were held today, would you vote for the (Democratic) candidate in your
   *    district or the (Republican) candidate in your district?"
   *
   * Tabela 1 (likely voters) e Tabela 2 (registered voters) do press release.
   * A coluna de sobra chama "Neither" e é o que entra em `outros`.
   */
  {
    instituto: 'Marquette Law School',
    campoInicio: '2026-09-02',
    campoFim: '2026-09-09',
    amostra: 581,
    amostraTipo: 'LV',
    margemErro: 4.3,
    dem: 54,
    rep: 41,
    outros: 4,
    vantagemDem: 13,
    fontePrimaria: 'https://law.marquette.edu/assets/community/poll/MLSPSC35/MLSPSC35PressRelease_NationalTopics.pdf',
    opcoes: { neither: 4 },
  },
  {
    instituto: 'Marquette Law School',
    campoInicio: '2026-09-02',
    campoFim: '2026-09-09',
    amostra: 864,
    amostraTipo: 'RV',
    margemErro: 3.6,
    dem: 50,
    rep: 42,
    outros: 7,
    vantagemDem: 8,
    fontePrimaria: 'https://law.marquette.edu/assets/community/poll/MLSPSC35/MLSPSC35PressRelease_NationalTopics.pdf',
    opcoes: { neither: 7 },
  },

  /**
   * Cygnal, National Voter Trends de setembro, campo 1-2/Set/2026.
   * Capa do deck: "Survey of Likely 2026 General Election Voters · National ·
   * September 1 – 2, 2026 | n=1500 | ±2.53%".
   * Texto: "Democrats lead the generic ballot 51% to 42% (D+9)".
   *
   * ⚠️ `outros: 7` é COMPLEMENTO ARITMÉTICO, não leitura. O slide da cédula é
   *    gráfico e o `pdftotext` devolveu os rótulos quebrados ("0. %", "42. %"),
   *    então a divisão entre "outro" e "indeciso" não foi lida. O D e o R vêm
   *    da prosa do próprio deck, que é fonte primária; a sobra é conta minha, e
   *    fica declarada como tal em vez de virar número com cara de medido.
   */
  {
    instituto: 'Cygnal (R)',
    campoInicio: '2026-09-01',
    campoFim: '2026-09-02',
    amostra: 1500,
    amostraTipo: 'LV',
    margemErro: 2.53,
    dem: 51,
    rep: 42,
    outros: 7,
    vantagemDem: 9,
    fontePrimaria: 'https://www.cygn.al/wp-content/uploads/2026/09/24524-Cygnal-National-Sept26-NVT-Deck-Public-1.pdf',
    opcoes: { complementoNaoLido: 7 },
  },

  /**
   * Fox News (Beacon Research (D) + Shaw Company Research (R)), campo
   * 11-14/Set/2026, 1.211 RV de um cadastro nacional de eleitores, ±3.
   * Topline, questão 14, linha "All Voters": D 51, R 44, Other *, Undecided 4.
   * O asterisco é menos de 0,5% e entra como zero.
   *
   * 🎚️ ESTA RODADA É COM LEANER, E ISSO FICA DECLARADO. A pergunta traz
   *    "[IF UNDECIDED: Do you lean closer to one candidate?]", então o 51/44 já
   *    tem os indecisos que pendem alocados. A Fox publica UMA versão só: não
   *    existe a leitura sem o leaner para escolher.
   *
   * ⚠️ É a mesma dimensão achada em 18/Set, quando a Zogby apareceu como D48
   *    R42 no agregador e D46 R40 no índice. A régua de QUAL versão entra na
   *    média segue sendo decisão do André; o que este comentário garante é que
   *    a escolha não seja feita em silêncio.
   *    Ver memory/feedback_a_dimensao_do_leaner_e_uma_escolha_que_ninguem_sabia_estar_fazendo.md
   */
  {
    instituto: 'Fox News',
    campoInicio: '2026-09-11',
    campoFim: '2026-09-14',
    amostra: 1211,
    amostraTipo: 'RV',
    margemErro: 3,
    dem: 51,
    rep: 44,
    outros: 4,
    vantagemDem: 7,
    fontePrimaria:
      'https://static.foxnews.com/foxnews.com/content/uploads/2026/09/fox_september-11-14-2026_national_topline_september-16-release-1.pdf',
    opcoes: { other: 0, naoSabe: 4 },
    comLeaners: true,
  },
  /**
   * Reuters/Ipsos, as TRES ondas do Core Political que o indice nao recebeu,
   * campo 21-24/Ago, 28-31/Ago e 11-14/Set/2026. KnowledgePanel, probabilistico.
   *
   * ✅ Pergunta conferida e GENERICA, identica nas tres (item TM3287Y24):
   *    "Thinking about the elections in 2026, if the election for U.S. Congress
   *    were held today, would you vote for the Democratic candidate or the
   *    Republican candidate in your district where you live?"
   *    ⛔ Sem sonda de leaner e sem nomes de candidato: e a cedula generica.
   *
   * `outros` e a soma de "Candidate from another political party" + "Don’t
   * know" + "Will not/do not plan to vote" + "Skipped", que e como o indice
   * preenche a coluna nas linhas JA existentes desta mesma casa. O `*` do
   * topline vale menos de 0,5% e entra como zero: a soma fecha entre 99 e 101.
   *
   * ⚠️ Os dois recortes entram porque e assim que o indice carrega esta casa,
   *    RV e Total/adultos por onda. A media usa um so, pela hierarquia
   *    LV > RV > A, entao a linha de adultos nao faz a casa pesar o dobro.
   *
   * ⚠️ O rotulo do agregador diz "896 LV" para a onda de setembro, e o proprio
   *    instituto declara a coluna como REGISTERED VOTERS. Vale o instituto.
   */
  {
    instituto: 'Reuters/Ipsos',
    campoInicio: '2026-08-21', campoFim: '2026-08-24',
    amostra: 951, amostraTipo: 'RV', margemErro: 3.3,
    dem: 41, rep: 35, outros: 24, vantagemDem: 6,
    fontePrimaria:
      'https://www.ipsos.com/sites/default/files/ct/news/documents/2026-08/Reuters%20Ipsos%20August%20Core%20Political%20Topline.pdf',
    opcoes: { outroPartido: 4, naoSabe: 14, naoVotara: 5, pulou: 1 },
  },
  {
    instituto: 'Reuters/Ipsos',
    campoInicio: '2026-08-21', campoFim: '2026-08-24',
    amostra: 1215, amostraTipo: 'A', margemErro: 2.9,
    dem: 35, rep: 29, outros: 37, vantagemDem: 6,
    fontePrimaria:
      'https://www.ipsos.com/sites/default/files/ct/news/documents/2026-08/Reuters%20Ipsos%20August%20Core%20Political%20Topline.pdf',
    opcoes: { outroPartido: 4, naoSabe: 16, naoVotara: 16, pulou: 1 },
  },
  {
    instituto: 'Reuters/Ipsos',
    campoInicio: '2026-08-28', campoFim: '2026-08-31',
    amostra: 924, amostraTipo: 'RV', margemErro: 3.3,
    dem: 43, rep: 38, outros: 19, vantagemDem: 5,
    fontePrimaria:
      'https://www.ipsos.com/sites/default/files/ct/news/documents/2026-09/Reuters%20Ipsos%20August%202026%20Poll%20Topline%20FULL%208.31.pdf',
    opcoes: { outroPartido: 2, naoSabe: 14, naoVotara: 3, pulou: 0 },
  },
  {
    instituto: 'Reuters/Ipsos',
    campoInicio: '2026-08-28', campoFim: '2026-08-31',
    amostra: 1167, amostraTipo: 'A', margemErro: 2.9,
    dem: 38, rep: 31, outros: 30, vantagemDem: 7,
    fontePrimaria:
      'https://www.ipsos.com/sites/default/files/ct/news/documents/2026-09/Reuters%20Ipsos%20August%202026%20Poll%20Topline%20FULL%208.31.pdf',
    opcoes: { outroPartido: 3, naoSabe: 14, naoVotara: 13, pulou: 0 },
  },
  {
    instituto: 'Reuters/Ipsos',
    campoInicio: '2026-09-11', campoFim: '2026-09-14',
    amostra: 896, amostraTipo: 'RV', margemErro: 3.4,
    dem: 44, rep: 37, outros: 18, vantagemDem: 7,
    fontePrimaria:
      'https://www.ipsos.com/sites/default/files/ct/news/documents/2026-09/Reuters%20Ipsos%20Survey%20September%202026%20FULL.pdf',
    opcoes: { outroPartido: 2, naoSabe: 12, naoVotara: 4, pulou: 0 },
  },
  {
    instituto: 'Reuters/Ipsos',
    campoInicio: '2026-09-11', campoFim: '2026-09-14',
    amostra: 1143, amostraTipo: 'A', margemErro: 3,
    dem: 39, rep: 31, outros: 29, vantagemDem: 8,
    fontePrimaria:
      'https://www.ipsos.com/sites/default/files/ct/news/documents/2026-09/Reuters%20Ipsos%20Survey%20September%202026%20FULL.pdf',
    opcoes: { outroPartido: 2, naoSabe: 13, naoVotara: 13, pulou: 1 },
  },
  /**
   * ── QUARTO GRUPO, 20/Set/2026: as casas que o agregador tinha e o indice
   *    nao recebeu, depois de LER a pergunta de cada uma antes do numero.
   *
   * 🔑 A leitura da pergunta NAO e cerimonia: ela ja excluiu duas rodadas
   *    neste mesmo lote. A Quinnipiac de 3-6/Set pergunta qual partido o
   *    eleitor quer que VENCA O CONTROLE da Camara, que e outro instrumento,
   *    e as duas ondas da The Economist/YouGov de setembro trocaram a cedula
   *    para NOMINAL. O indice exclui as tres com razao; o agregador e que
   *    esta somando coisas diferentes.
   */

  /**
   * The Honest Poll, onda de campo 29/Ago-01/Set/2026.
   * "September 2026 National Tracking Poll - Generic Ballot".
   *
   * ✅ Pergunta Q3, LIDA no topline: "If the election for U.S. House of
   *    Representatives were held today, would you vote Republican or
   *    Democratic in your district?" Cedula generica, ancorada no distrito.
   *
   * ⚠️ A casa publica DUAS versoes da mesma linha: a Q3 acima e a Q4, rotulada
   *    so como "Leaned GCB", SEM enunciado. Entra a Q3, que e a pergunta
   *    efetivamente feita; a Q4 fica em `opcoes.comLeaners` para conferencia.
   *    E a mesma escolha do caso Zogby, e e ela que mantem a media comparavel.
   *    Ver memory/feedback_a_dimensao_do_leaner_e_uma_escolha_que_ninguem_sabia_estar_fazendo.md
   *
   * ⚠️ `amostra` e o n NAO PONDERADO, que e o do cabecalho da tabela e a mesma
   *    convencao das curadas da YouGov acima. O agregador rotula esta onda
   *    como "812 LV", que e o n PONDERADO da metodologia. Sao o mesmo recorte.
   */
  {
    instituto: 'The Honest Poll',
    campoInicio: '2026-08-29', campoFim: '2026-09-01',
    amostra: 783, amostraTipo: 'LV', margemErro: 3.8,
    dem: 52, rep: 41, outros: 7, vantagemDem: 11,
    fontePrimaria:
      'https://cdn.prod.website-files.com/69dee02bd9a8213e6f823267/6a9b4ff8d7e29e1d65b43064_September%20Tracking%202026%20Toplines.pdf',
    opcoes: { outroCandidato: 2, naoSabe: 5 },
    notas: 'Q4 Leaned GCB: D 53 x R 43, outro 2, nao sabe 2. n ponderado 812.',
  },
  {
    instituto: 'The Honest Poll',
    campoInicio: '2026-08-29', campoFim: '2026-09-01',
    amostra: 951, amostraTipo: 'RV', margemErro: 3.4,
    dem: 50, rep: 40, outros: 10, vantagemDem: 10,
    fontePrimaria:
      'https://cdn.prod.website-files.com/69dee02bd9a8213e6f823267/6a9b4ff8d7e29e1d65b43064_September%20Tracking%202026%20Toplines.pdf',
    opcoes: { outroCandidato: 3, naoSabe: 7 },
    notas: 'Q4 Leaned GCB: D 51 x R 41, outro 3, nao sabe 4.',
  },
  {
    instituto: 'The Honest Poll',
    campoInicio: '2026-08-29', campoFim: '2026-09-01',
    amostra: 1106, amostraTipo: 'A', margemErro: 3.2,
    dem: 47, rep: 38, outros: 15, vantagemDem: 9,
    fontePrimaria:
      'https://cdn.prod.website-files.com/69dee02bd9a8213e6f823267/6a9b4ff8d7e29e1d65b43064_September%20Tracking%202026%20Toplines.pdf',
    opcoes: { outroCandidato: 5, naoSabe: 10 },
    notas: 'Q4 Leaned GCB: D 48 x R 40, outro 5, nao sabe 8.',
  },

  /**
   * The Honest Poll, onda de campo 07-13/Set/2026.
   *
   * ✅ Pergunta Q8, LIDA no topline: "If the election for Congress were held
   *    today, who would you vote for?" Opcoes Republican / Democratic / Some
   *    other candidate / Not sure. Sem sonda de leaner: a Q9 ja muda de tema.
   *
   * ⚠️ ENUNCIADO MAIS FRACO QUE O DA PROPRIA CASA na onda anterior: aqui nao
   *    ha ancora de distrito. E a cedula generica ainda assim, mas nao e a
   *    MESMA formulacao da Q3 de 29/Ago, e as duas linhas convivem no arquivo.
   *
   * ⚠️ E ela mora numa pesquisa PATROCINADA de outro tema: o documento e o
   *    "Take Care of America’s Veterans Act Poll", cliente Veteran Action, e a
   *    Q8 vem depois de quatro perguntas sobre servico militar e sobre qual
   *    pauta de veteranos importa mais, e logo apos a Q7, que pergunta o voto
   *    de 2024. Ordem de pergunta move cedula generica. Fica DECLARADO aqui:
   *    isto nao e motivo para excluir, e e motivo para nao tratar esta linha
   *    como intercambiavel com um tracking de cedula.
   */
  {
    instituto: 'The Honest Poll',
    campoInicio: '2026-09-07', campoFim: '2026-09-13',
    amostra: 1392, amostraTipo: 'LV', margemErro: 2.8,
    dem: 51, rep: 42, outros: 7, vantagemDem: 9,
    fontePrimaria:
      'https://cdn.prod.website-files.com/69dee02bd9a8213e6f823267/6aaac14674387a521054c14e_Veteran%20Action%20September%202026%20TCAVA%20Full%20Toplines.pdf',
    opcoes: { outroCandidato: 3, naoSabe: 4 },
    notas: 'Q8 de pesquisa patrocinada sobre veteranos. n ponderado 1429.',
  },
  {
    instituto: 'The Honest Poll',
    campoInicio: '2026-09-07', campoFim: '2026-09-13',
    amostra: 1633, amostraTipo: 'RV', margemErro: 2.6,
    dem: 50, rep: 40, outros: 10, vantagemDem: 10,
    fontePrimaria:
      'https://cdn.prod.website-files.com/69dee02bd9a8213e6f823267/6aaac14674387a521054c14e_Veteran%20Action%20September%202026%20TCAVA%20Full%20Toplines.pdf',
    opcoes: { outroCandidato: 3, naoSabe: 7 },
    notas: 'Q8 de pesquisa patrocinada sobre veteranos.',
  },

  /**
   * UMass Amherst/YouGov, "August 2026 National Poll", campo 21-26/Ago/2026.
   *
   * ✅ Pergunta LIDA no topline, p.12, rubrica "U.S. House Vote (N=1,000)":
   *    "Looking ahead to the 2026 midterm congressional election, if this
   *    election were being held today, which party’s candidate would you vote
   *    for in your congressional district?" Generica e ancorada no distrito.
   *
   * ⚠️ O release em HTML parafraseia como "if this election were held today".
   *    Vale o PDF.
   *
   * ⚠️ O topline traz DUAS colunas, "Without Leaners" e "With Leaners", e nao
   *    publica o enunciado da sonda. Entra a SEM leaners, pela mesma regra da
   *    Honest Poll acima. A com leaners fica em `opcoes`.
   *
   * 🔴 NAO e a UMass Lowell/YouGov que ja esta no arquivo: sao universidades
   *    DIFERENTES, e o nome tem de separar as duas ou a serie mistura casas.
   */
  {
    instituto: 'UMass Amherst/YouGov',
    campoInicio: '2026-08-21', campoFim: '2026-08-26',
    amostra: 1000, amostraTipo: 'A', margemErro: 3.5,
    dem: 40, rep: 33, outros: 28, vantagemDem: 7,
    fontePrimaria:
      'https://www.umass.edu/poll/sites/default/files/2026-09/August2026NationalPollMidtermCongressToplines.pdf',
    opcoes: { independente: 9, naoSabe: 19 },
    notas: 'Coluna With Leaners: D 42 x R 34, independente 10, nao sabe 14.',
  },

  /**
   * Focaldata/Financial Times, "2026 US midterms poll (September)",
   * campo 28/Ago-02/Set/2026. Tabelas em XLSX, sem PDF.
   *
   * ✅ Pergunta Q69, LIDA na aba Tables: "If the elections for the U.S.
   *    Congress (House of Representatives) were held in the next few weeks,
   *    who would you vote for in the district where you live?"
   *
   * ⚠️ AQUI A REGRA DO LEANER SE INVERTE, e de proposito. Esta casa faz um
   *    SQUEEZE de tres etapas (Q70, Q71, Q72) e publica a manchete ja
   *    resolvida, e o INDICE ja carrega esta casa assim: a onda de 07-11/Ago
   *    esta no arquivo como LV 1857 D51 R45 outros 4, que e exatamente a
   *    coluna pos-squeeze "Registered voters (excl. WNV)". Carregar a Q69 crua
   *    aqui criaria uma DESCONTINUIDADE dentro da serie da propria casa, que e
   *    pior do que a diferenca de convencao entre casas. A regra que vale e
   *    a do indice, e ela e por CASA.
   *    📌 Para quem for conferir: a Q69 CRUA, so em adultos, e D 41,86 x R
   *       34,91. A diferenca para o 46,33 x 40,55 abaixo e o squeeze.
   *
   * ⚠️ A casa nao declara margem de erro em documento nenhum, e o indice
   *    tambem grava `null` nas 20 linhas que ja tem dela. Fica null.
   *
   * ⚠️ A aba Info diz "2,178 US adults" e a aba de resultados diz n=2180.
   *    Vale a tabela, que e onde os percentuais moram. O agregador usa 2178.
   */
  {
    instituto: 'Focaldata/Financial Times',
    campoInicio: '2026-08-28', campoFim: '2026-09-02',
    amostra: 1837, amostraTipo: 'LV', margemErro: null,
    dem: 52, rep: 45, outros: 3, vantagemDem: 7,
    fontePrimaria:
      'https://landing.focaldata.com/hubfs/Marketing%20content/Focaldata_US_Midterms_Poll_Sep2026_formatted.xlsx',
    opcoes: { outro: 3, naoVotara: 0 },
    notas: 'Pos-squeeze, cru D 51,98 x R 44,92 x outro 3,10.',
    comLeaners: true,
  },
  {
    instituto: 'Focaldata/Financial Times',
    campoInicio: '2026-08-28', campoFim: '2026-09-02',
    amostra: 1914, amostraTipo: 'RV', margemErro: null,
    dem: 49, rep: 42, outros: 9, vantagemDem: 7,
    fontePrimaria:
      'https://landing.focaldata.com/hubfs/Marketing%20content/Focaldata_US_Midterms_Poll_Sep2026_formatted.xlsx',
    opcoes: { outro: 4, naoVotara: 5 },
    notas: 'Pos-squeeze, cru D 48,72 x R 42,26.',
    comLeaners: true,
  },
  {
    instituto: 'Focaldata/Financial Times',
    campoInicio: '2026-08-28', campoFim: '2026-09-02',
    amostra: 2180, amostraTipo: 'A', margemErro: null,
    dem: 46, rep: 41, outros: 13, vantagemDem: 5,
    fontePrimaria:
      'https://landing.focaldata.com/hubfs/Marketing%20content/Focaldata_US_Midterms_Poll_Sep2026_formatted.xlsx',
    opcoes: { outro: 4, naoVotara: 9 },
    notas: 'Pos-squeeze, cru D 46,33 x R 40,55. A aba Info declara 2178 adultos.',
    comLeaners: true,
  },

  /**
   * McLaughlin & Associates (R), "National Monthly, August 2026",
   * campo 18-24/Ago/2026, 1.000 general election voters.
   *
   * 🔴 A DATA DO AGREGADOR ESTA ERRADA: ele rotula "Aug 14 - 24", e a capa do
   *    proprio deck diz "Field Dates: August 18th - 24th, 2026". Vale o
   *    instituto. Quatro dias de campo a mais deslocam a rodada na janela.
   *
   * 🔴 O ENUNCIADO NAO E PUBLICADO. O slide se chama so "Generic Ballot: U.S.
   *    Congress" e o deck nao traz a pergunta, embora traga o enunciado de
   *    OUTROS slides. Entao a regra "ler a pergunta antes do numero" NAO foi
   *    cumprida aqui, e esta linha entra por PRECEDENTE DO INDICE, que ja
   *    carrega 6 rodadas desta casa na mesma forma (1000 LV, outros = o
   *    indeciso, margem null), e nao por leitura. Fica escrito como o que e.
   *    ⚠️ E o mesmo deck traz uma cedula ALTERNATIVA e carregada, "A Republican
   *       candidate who supports free-market capitalism, OR, A Democratic
   *       candidate who supports big government socialism", que NAO e esta e
   *       nao pode ser confundida com ela.
   *
   * ⚠️ `comLeaners` porque a propria estrutura de resposta e Definitely /
   *    Probably / Lean nos dois lados: o leaner esta dentro do 48 e do 43,
   *    nao numa segunda pergunta. DEM 48 = 32 + 8 + 7; GOP 43 = 30 + 9 + 5.
   *
   * ⚠️ A margem de +/-3,1pp aparece numa coluna do proprio instituto, NAO no
   *    deck. O indice grava null nas 6 linhas que ja tem. Fica null.
   */
  {
    instituto: 'McLaughlin & Associates (R)',
    campoInicio: '2026-08-18', campoFim: '2026-08-24',
    amostra: 1000, amostraTipo: 'LV', margemErro: null,
    dem: 48, rep: 43, outros: 9, vantagemDem: 5,
    fontePrimaria:
      'https://mclaughlinonline.com/pols/wp-content/uploads/2026/08/National-August-Presentation-RELEASE.pdf',
    opcoes: { indeciso: 9 },
    notas: 'DEM 48 = 32 definitely + 8 probably + 7 lean; GOP 43 = 30 + 9 + 5.',
    comLeaners: true,
  },
]

/** Etiqueta que diz de onde a linha veio. Toda linha servida carrega uma. */
export const ORIGEM_INDICE = 'indice-wikipedia'
export const ORIGEM_CURADA = 'listagem-do-instituto'

const chave = (p) => `${p.instituto}|${p.campoFim}|${p.amostraTipo}`
const dias = (a, b) => Math.abs(new Date(a) - new Date(b)) / 86400000

/**
 * Mescla as curadas com o que veio do índice.
 *
 * O índice SEMPRE vence: rodada que ele já tem descarta a curada equivalente.
 * Devolve também os quase-encontros, que são avisados e não resolvidos aqui.
 */
export function mesclarCuradas(doIndice, curadas = RODADAS_CURADAS) {
  const marcadas = doIndice.map((p) => ({ ...p, origem: p.origem ?? ORIGEM_INDICE }))
  const jaNoIndice = new Set(marcadas.map(chave))

  const aceitas = []
  const duplicadas = []
  const suspeitas = []

  for (const c of curadas) {
    if (jaNoIndice.has(chave(c))) {
      duplicadas.push(c)
      continue
    }
    for (const p of marcadas) {
      if (
        p.instituto === c.instituto &&
        p.amostraTipo === c.amostraTipo &&
        p.campoFim &&
        dias(p.campoFim, c.campoFim) <= DIAS_SUSPEITA
      ) {
        suspeitas.push({ curada: c, doIndice: p, distanciaDias: dias(p.campoFim, c.campoFim) })
      }
    }
    aceitas.push({ ...c, origem: ORIGEM_CURADA })
  }

  return { pesquisas: [...marcadas, ...aceitas], aceitas, duplicadas, suspeitas }
}
