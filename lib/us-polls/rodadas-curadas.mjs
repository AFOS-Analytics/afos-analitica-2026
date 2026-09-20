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
