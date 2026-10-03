/**
 * 🔗 A FONTE PRIMÁRIA FOI ABERTA, e o que ela sustenta.
 *
 * 🔴 POR QUE EXISTE, medido em 25/Set/2026. O arquivo declara
 * `qualidade.semFontePrimaria`, que conta AUSÊNCIA de link. Nenhum contador vê
 * o caso oposto e mais comum: link PRESENTE que **não sustenta a linha**. A
 * rodada de campo 12-15/Set atribuída a Emerson College/RealClear aponta uma
 * matéria sobre PRIMÁRIAS, sem nenhuma pergunta de generic ballot, e para todo
 * portão da casa ela é uma linha com fonte, porque o campo está preenchido.
 *
 * ⛔ E o custo não é de forma: é a conferência sendo REFEITA toda rodada. Sem
 * registro, a próxima passada busca o mesmo documento, tropeça no mesmo 451 da
 * CNN e no mesmo artigo errado do índice, e chega à mesma conclusão gastando o
 * mesmo tempo. Medir e não gravar é o defeito que a casa mais repete.
 *
 * 🔑 Isto NÃO é portão e não muda número nenhum. É um LEDGER de dívida contra a
 * origem, impresso em toda passada, no mesmo padrão do `soma-conferida.mjs`.
 */

import { serieDaCasa } from './casas.mjs'

export const RESULTADOS = {
  CONFIRMA: 'o documento do instituto sustenta a linha inteira',
  // Exige as duas listas: "parcial" sem dizer o que ficou de fora é opinião.
  CONFIRMA_PARCIAL: 'o documento sustenta parte, e o resto segue valendo pelo índice',
  NAO_CONTEM_A_PERGUNTA: 'o documento existe, foi lido, e NÃO traz a pergunta',
  NAO_ENCONTRADO: 'nenhum documento do executor nem do patrocinador foi achado',
}

/**
 * 🔒 Cada entrada guarda os VALORES. Se o índice reescrever D ou R, a
 * conferência CADUCA sozinha e a linha volta a contar como não conferida, que é
 * o que impede uma leitura de ontem de calar um número de hoje.
 */
export const FONTE_CONFERIDA = [
  {
    // ⭐ A PRIMEIRA `CONFIRMA` TOTAL do ledger, e ela entrou no MESMO dia em que
    //    a rodada entrou na média. Vale notar o que isso custou: um PDF, aberto.
    instituto: 'AlphaROC/The Independent Center',
    campoInicio: '2026-09-25',
    campoFim: '2026-09-28',
    valores: '43/37',
    conferidoEm: '2026-10-03',
    resultado: 'CONFIRMA',
    url: 'https://cdn.prod.website-files.com/68f64c3625044325e169d107/6abeab6856927d619c0317c2_ICV_Wave4_Toplines_Sept2026.pdf',
    confirmado: [
      'a PERGUNTA, sob o título "GENERIC CONGRESSIONAL BALLOT": "2. If the election for U.S. Congress were held today, which party\'s candidate would you vote for in your district?" 🔑 Ela pergunta pelo PARTIDO do candidato do distrito, não pelo NOME dele, então é generic ballot e não cédula nominal, que é a distinção que esta média faz desde 04/Set',
      'o CAMPO: "Field dates: September 25–28, 2026", repetido no rodapé das três páginas',
      'a AMOSTRA e o RECORTE: "Sample: 1,000 U.S. adults" e "n=1,000 U.S. adults", que sustentam o recorte A da nossa linha',
      'a MARGEM: "The sample carries a margin of error of ±3.1 points of the true population value 95% of the time"',
      'os VALORES: "The Democratic candidate 43.4%" e "The Republican candidate 37.1%", que o índice transcreve como 43 e 37',
      'o campo `outros` = 20, que é a SOMA exata das outras duas opções publicadas: "An independent or third-party candidate 6.0%" mais "Undecided 13.5%", ou seja 19,5 arredondado',
      'quem EXECUTA e quem ENCOMENDA: "AlphaROC conducted a survey of n=1,000 U.S. adults on behalf of Independent Center / Independent Center Voice"',
    ],
    naoConfirmado: [],
    nota:
      '✅ O documento fecha em 100,0% nas quatro opções (43,4 + 37,1 + 6,0 + 13,5), então a soma de 100 da nossa linha é a aritmética da fonte e não coincidência. ' +
      '🔢 O índice transcreve em INTEIRO o que a fonte publica com uma decimal, e isso tem preço medido: na LINHA, D+6 contra D+6,3 do documento; na MÉDIA SERVIDA, **0,00pp**, porque `rep` arredondou para cima junto com `dem` e a diferença não se move. ' +
      '⛔ Não se corrige à mão: a Wikipédia é o ÍNDICE e mexer no número muda a procedência, igual ao decimal que a curada da ActiVote levou embora ao se aposentar. ' +
      '📌 O instituto declara "Figures are unweighted", e declara 887 eleitores registrados (88,7%) como SUBGRUPO, que não é o recorte desta linha. ' +
      '🧬 E o documento resolve a pergunta do NOME: quem vai a campo é a AlphaROC e quem encomenda é o Independent Center. As três rodadas anteriores da casa estão no arquivo como `AlphaROC` (27-28/Jun, 13-14/Jul, 08-10/Ago) e esta entrou como `AlphaROC/The Independent Center`. ' +
      '✅ MEDIDO em 03/Out, com os nomes separados e colapsados: a média fica em D+7,86 sobre 34 rodadas de 27 institutos nos DOIS cenários, nenhuma rodada colide (os quatro campos são distintos), e a cadência não avalia a casa sob nome nenhum, então a exposição também não muda. ' +
      '✅ PAR DECLARADO em `casas.mjs` no mesmo dia, por decisão do André: `AlphaROC/The Independent Center` colapsa em `AlphaROC`, pela régua de que fica o nome de quem EXECUTA. ' +
      'O portão leu a troca como **RENOMEACAO**, com +0,00pp, 34 rodadas e 27 institutos nas duas pontas, e o rótulo do índice ficou gravado ao lado em `institutoNoIndice`. ' +
      '📌 A entrada custa zero hoje e fecha o risco dormente que a McLaughlin teve e que se materializou em 26/Set: sem ela, o dia em que duas ondas da casa caíssem na mesma janela de 30 dias elas contariam como duas casas.',
  },
  {
    instituto: 'Morning Consult',
    campoInicio: '2026-09-10',
    campoFim: '2026-09-15',
    valores: '46/43',
    conferidoEm: '2026-10-02',
    resultado: 'CONFIRMA_PARCIAL',
    url: 'https://www.deseret.com/politics/2026/09/29/voters-in-utah-and-nationally-say-economy-and-inflation-are-top-issues-in-november-midterm-elections/',
    confirmado: [
      'que a pergunta EXISTE e a DIREÇÃO nacional: "if the election were held today, which candidate would they vote for. In Utah, voters were more likely to say they\'d cast a ballot for the Republican candidate while nationally, voters say they\'d rather vote for a Democratic candidate"',
      'quem EXECUTOU e quem ENCOMENDOU: "a new Deseret News/Hinckley Institute of Politics survey, conducted by Morning Consult"',
    ],
    naoConfirmado: [
      '🔴 o TOPLINE, D 46 x R 43: a matéria descreve a direção em PALAVRAS e não publica um único percentual do generic ballot. As cadeias "46%", "2,102", "margin of error" e "registered voters" não aparecem nela',
      'a amostra de 2.102 e a margem de ±2, que o índice declara e a matéria não',
    ],
    nota:
      '⚠️ ESTA NÃO É A ONDA DO TRACKER. O tracker semanal da Morning Consult sai com 18.336 LV (±0,9) ou 29.719 RV (±0,6); esta é uma pesquisa de CLIENTE que a Morning Consult apenas CAMPOU para a Deseret News e o Hinckley Institute, com 2.102 RV. ' +
      'O índice a rotula só com o nome de quem EXECUTA, e com isso ela fica indistinguível do tracker. ' +
      '📊 Consequência medida em 02/Out: a Morning Consult carrega **4 de 35 rodadas da média, 11,4%**, o DOBRO de qualquer outra casa, enquanto 23 dos 28 institutos têm uma rodada só. ' +
      '📅 E os campos se SOBREPÕEM: 07-13/Set do tracker e 10-15/Set desta, com quatro dias em comum. Não é duplicata (amostras e valores diferem), são duas pesquisas distintas sob um nome só. ' +
      '📌 A casa já tem a régua do par executor e encomendante em `casas.mjs`, e o próprio índice já usou `Morning Consult/Cato Institute` em Ago: o rótulo com o encomendante existe e não foi aplicado aqui.',
  },
  {
    // ⭐ Rodada NOVA, aberta na fonte no dia em que entrou na média. A ficha do
    //    portão manda conferir toda rodada que entra, e aqui ela conferiu.
    instituto: 'Harvard/Harris Poll/HarrisX',
    campoInicio: '2026-09-26',
    campoFim: '2026-09-28',
    valores: '51/49',
    conferidoEm: '2026-10-01',
    resultado: 'CONFIRMA_PARCIAL',
    url: 'https://harvardharrispoll.com/assets/uploads/2026/09/HHP_Sep2026_KeyResults.pdf',
    confirmado: [
      'a pergunta, CON2026B: "If the congressional election were held today would you be more likely to vote for a Democrat or a Republican for Congress?"',
      'o RECORTE e os valores: o slide diz "THE GENERIC CONGRESSIONAL BALLOT IS A DEAD HEAT, THOUGH DEMS HAVE A 2-POINT EDGE WITH LIKELY VOTERS", e a coluna "Likely midterm voter" traz D 51 x R 49, exatamente o que o índice gravou como LV',
      'o TOTAL, que é empate: D 50 x R 50 sobre 2.200 registered voters',
      'o campo: "Field Dates: September 26-28, 2026"',
    ],
    naoConfirmado: [
      'o N do subgrupo de prováveis votantes: o documento declara 2.200 RV no total e não publica o N da coluna LV, então a amostra desta linha segue desconhecida. O índice a deixa VAZIA, que é o comportamento honesto',
    ],
    nota:
      'É ESCOLHA FORÇADA EM DOIS, "a Democrat or a Republican", então `outros` nulo e soma exata de 100 são a FORMA CORRETA da linha e não falta de dado. 📌 A onda anterior trazia D 51 no total (o próprio slide anota "Aug: 51%") e agora o total empata, enquanto a coluna LV fica em D+2.',
  },
  {
    instituto: 'Quinnipiac University',
    campoInicio: '2026-09-24',
    campoFim: '2026-09-27',
    valores: '51/39',
    conferidoEm: '2026-10-01',
    resultado: 'CONFIRMA_PARCIAL',
    url: 'https://poll.qu.edu/poll-release?releaseid=3968',
    confirmado: [
      'o título da divulgação: "Generic Ballot For Control Of U.S. House: Dems 51%, GOP 39%"',
      'campo e amostra: "1,032 self-identified registered voters nationwide were surveyed from September 24th - 27th"',
      'o recorte RV, declarado como "among registered voters"',
    ],
    naoConfirmado: [
      'a MARGEM: a fonte diz "a margin of error of +/- 3" e o índice gravou ±3,8',
      'o campo `outros`: a fonte diz "9 percent not offering an opinion" e o índice gravou 10',
    ],
    nota:
      '⚠️ As duas divergências são de campo SECUNDÁRIO e não tocam a média: D e R estão corretos, então a vantagem D+12 é a da fonte. Mesma família da UMass Amherst/YouGov (±4,1 do índice contra ±3,5 da fonte) e da Marquette (o `outros` do recorte errado).',
  },
  {
    // 📒 Esta fecha a caçada de 29/Set/2026, que naquele dia virou comentário no
    //    `agregador-na-fonte-us.mjs` porque eu não lembrei que este registro
    //    existia. Ferramenta pronta que eu mesmo não chamei.
    instituto: 'Clarity Campaign Labs (D)',
    campoInicio: '2026-09-11',
    campoFim: '2026-09-16',
    valores: '50/43',
    conferidoEm: '2026-09-29',
    resultado: 'CONFIRMA_PARCIAL',
    url: 'https://go.claritycampaigns.com/hubfs/Omnibus%20Surveys/Clarity%20Omnibus%20Overview%20-%20Sept%202026%20-%20public.pdf',
    confirmado: [
      'o campo: "conducted from September 11th - 16th via national online public opinion panels"',
      'a amostra: "1,046 respondents were matched to the voter file"',
      'a margem de ±3,03%, que o agregador não publica',
      'o recorte LV: "weighted to a national universe of likely 2026 General election voters"',
    ],
    naoConfirmado: [
      '🔴 O DOCUMENTO NÃO CONTÉM A PERGUNTA do generic ballot, e esse é o fato principal desta entrada',
      'o topline D 50 x R 43: as palavras `ballot`, `vote for`, `congress` e `midterm` não aparecem UMA vez no PDF, que é o overview público de metodologia e de inventário de modelos. Os percentuais dele são dos modelos (partidarismo, ansiedade econômica), não de intenção de voto',
    ],
    nota:
      '⛔ Em 29/Set o D 50 x R 43 existia SÓ no agregador e por isso NÃO foi promovido a conferido. ⭐ Em 01/Out a rodada entrou pelo ÍNDICE, sozinha, trazendo a margem de ±3,03 que eu tinha lido na fonte. A amostra sistemática trouxe a linha sem ninguém ingerir à mão, que era exatamente a aposta de não ingerir.',
  },
  {
    // ⭐ A PRIMEIRA entrada CONFIRMA deste registro, e ela nasceu de uma ingestão:
    // a linha entrou por curadoria em 27/Set/2026, e curadoria se escreve DO
    // documento, então o documento já estava aberto quando a linha nasceu.
    instituto: 'BGSU/YouGov',
    campoInicio: '2026-08-25',
    campoFim: '2026-09-01',
    valores: '51/44',
    conferidoEm: '2026-09-27',
    resultado: 'CONFIRMA',
    url: 'https://scholarworks.bgsu.edu/cgi/viewcontent.cgi?article=1024&context=depo',
    confirmado: [
      'a pergunta, questão 4 do topline: "If the 2026 election for U.S. Congress were held today, would you support the Democratic candidate or the Republican candidate on the ballot in your district?"',
      'D 51 x R 44 x Neither 5, somando 100',
      'campo 25/Ago a 01/Set/2026',
      'N de 1.200 prováveis votantes e MOE de ±3,3%',
    ],
    naoConfirmado: [],
    nota:
      'Topline nacional no repositório da própria universidade. 🔴 E o AGREGADOR erra a amostra: ele rotula 566 LV, que é o N não ponderado do subgrupo MASCULINO nas crosstabs (article=1023), lido como se fosse o tamanho do estudo. É N de recorte no lugar do N da pesquisa, a mesma classe do defeito de 01/Ago/2026. ⛔ E um resumo de BUSCA dizia "Democrats 48%, Republicans 47%", ou seja D+1 contra os D+7 do topline: índice e agregador são ÍNDICE, e busca não é nem isso.',
  },
  {
    instituto: 'CNN/SSRS',
    campoInicio: '2026-09-16',
    campoFim: '2026-09-17',
    valores: '49/41',
    conferidoEm: '2026-09-25',
    resultado: 'CONFIRMA_PARCIAL',
    url: 'https://ssrs.com/news/republicans-midterm-outlook-amid-worsened-economic-backdrop/',
    confirmado: ['campo 16-17/Set/2026', 'amostra total de 1.206 e margem de ±3,5 no total', 'a MARGEM, oito pontos para os democratas'],
    naoConfirmado: ['a decomposição 49 x 41 x 10', 'o subgrupo de 867 eleitores registrados e a margem de ±4,1 dele'],
    // 🕳️ BECOS SEM SAÍDA, medidos em 28/Set/2026, para ninguém repetir a busca:
    //  1. O topline no DocumentCloud id 28014525 ("CNN poll conducted by SSRS 2026
    //     Midterms Parties") é a onda de 26-30/MAR/2026, com n=1.201 e ±3,2. NÃO é
    //     esta onda. O texto extraído sai em /documents/28014525/<slug>.txt.
    //  2. O artigo da própria CNN (cnn.com/2026/09/23/politics/cnn-poll-donald-trump-
    //     economy-midterms-vis) devolve HTTP 451 daqui, bloqueio legal por região.
    //  3. web.archive.org está bloqueado para a ferramenta de leitura de página.
    //  4. ssrs.com/news/cnn-poll-donald-trump-economy-midterms/ devolve 404.
    // ⚠️ Um resumo de BUSCA afirmou que a metodologia da CNN traz "867 registered
    //    voters" e "4.1 points among registered voters", o que fecharia metade do
    //    naoConfirmado acima. NÃO foi promovido a confirmado: resumo de busca já
    //    mentiu sobre topline nesta casa, e a régua é ler o documento.
    //    → memory/feedback_afos_daily_translation_review (a família do defeito)
    // 🔑 O que falta é a decomposição por recorte de ELEITORES REGISTRADOS, e o
    //    caminho que sobra é o PDF de topline da CNN daquela semana, que não foi
    //    localizado em nenhum host alcançável.
    nota:
      'A SSRS é quem vai a campo e publica no próprio site, alcançável. Ela declara o campo, a amostra total, a margem do total e a VANTAGEM de 8 pontos, e remete à CNN para a decomposição. A CNN devolve HTTP 451 para leitor automatizado, então os percentuais separados seguem valendo pelo índice. 📌 O que entra na média é a margem, e ela está confirmada no documento de quem executou.',
  },
  {
    instituto: 'Emerson College/RealClear Opinion Research',
    campoInicio: '2026-09-12',
    campoFim: '2026-09-15',
    valores: '37/29',
    conferidoEm: '2026-09-25',
    resultado: 'NAO_CONTEM_A_PERGUNTA',
    url: 'https://www.uniteamerica.org/articles/new-poll-voters-say-primaries-reward-partisan-bases-sideline-ordinary-voters',
    confirmado: [],
    naoConfirmado: ['D 37 x R 29 x outros 35', 'o recorte de 1.500 eleitores registrados', 'a margem de ±2,4', 'as datas de campo'],
    nota:
      'O link que o ÍNDICE aponta é matéria sobre PRIMÁRIAS e não traz pergunta de generic ballot nenhuma. A Emerson publica a onda de 21-22/Set (53 x 42, 1.000 prováveis votantes) no próprio site e NÃO publica nada de 12-15/Set; nada foi achado na RealClear. A metodologia declarada pelo índice (instituto, n, recorte, margem e datas) bate com a da matéria, mas metodologia não é topline. ⛔ Valor do índice não se corrige à mão e excluir rodada é decisão de procedência: a linha fica, declarada como dívida aberta.',
  },
]

/** Entrada sem prova é opinião, e opinião não fecha dívida contra a origem. */
export function conferirCarga(registro = FONTE_CONFERIDA) {
  const erros = []
  registro.forEach((e, i) => {
    const onde = `entrada ${i} (${e.instituto ?? 'sem instituto'} ${e.campoFim ?? ''})`
    if (!e.instituto) erros.push(`${onde}: sem instituto`)
    if (!e.campoInicio || !e.campoFim) erros.push(`${onde}: sem campo completo`)
    if (!e.valores) erros.push(`${onde}: sem valores, a conferência não caducaria`)
    if (!e.conferidoEm) erros.push(`${onde}: sem conferidoEm`)
    if (!RESULTADOS[e.resultado]) erros.push(`${onde}: resultado ${e.resultado} não é um de ${Object.keys(RESULTADOS).join(', ')}`)
    if (!e.url) erros.push(`${onde}: sem url, não diz o que foi aberto`)
    if (!e.nota) erros.push(`${onde}: sem nota`)
    if (!Array.isArray(e.confirmado) || !Array.isArray(e.naoConfirmado)) {
      erros.push(`${onde}: confirmado e naoConfirmado precisam ser listas`)
      return
    }
    // ⛔ "Parcial" sem dizer o que ficou de fora é o mesmo que não conferir.
    if (e.resultado === 'CONFIRMA_PARCIAL' && (!e.confirmado.length || !e.naoConfirmado.length))
      erros.push(`${onde}: CONFIRMA_PARCIAL exige as DUAS listas preenchidas`)
    if (e.resultado === 'CONFIRMA' && e.naoConfirmado.length)
      erros.push(`${onde}: CONFIRMA com algo em naoConfirmado é parcial, não total`)
    if ((e.resultado === 'NAO_CONTEM_A_PERGUNTA' || e.resultado === 'NAO_ENCONTRADO') && e.confirmado.length)
      erros.push(`${onde}: ${e.resultado} não pode confirmar nada`)
  })
  return erros
}

/** A entrada desta linha, se existir E se os valores continuarem os mesmos. */
export function fonteDa(poll, registro = FONTE_CONFERIDA) {
  if (!poll) return null
  return (
    registro.find(
      (e) =>
        serieDaCasa(e.instituto) === serieDaCasa(poll.instituto) &&
        e.campoInicio === poll.campoInicio &&
        e.campoFim === poll.campoFim &&
        e.valores === `${poll.dem}/${poll.rep}`
    ) ?? null
  )
}

/**
 * As dívidas ABERTAS entre as linhas dadas: tudo que não é CONFIRMA.
 * ⛔ Elas nunca saem da saída, nem quando a média não se move por causa delas.
 */
export function dividasAbertas(polls, registro = FONTE_CONFERIDA) {
  return (polls ?? [])
    .map((p) => ({ poll: p, entrada: fonteDa(p, registro) }))
    .filter((x) => x.entrada && x.entrada.resultado !== 'CONFIRMA')
}
