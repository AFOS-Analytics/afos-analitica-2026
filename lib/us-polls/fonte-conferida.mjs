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
  // 🔒 LOCALIZADO e FECHADO, que difere de NAO_ENCONTRADO em algo que muda o que
  // a próxima passada deve FAZER: aqui o documento tem endereço, e quem recusa é
  // o host. `NAO_ENCONTRADO` manda procurar de novo, porque o instituto pode
  // publicar amanhã; isto manda PARAR de procurar, porque bloqueio de host não
  // se resolve insistindo, e nunca forjando user-agent.
  //
  // ⚠️ Ele nasceu em 08/Out/2026 de uma condição que o registro IRMÃO declarou.
  // Em 05/Out a Impact Research caiu em `soma-conferida.mjs` com o veredito de
  // soma, e a nota dela dizia: "isto estica o FONTE_NAO_SUSTENTA de 'abri e não
  // sustenta' para 'não deu para abrir' ... se o caso se repetir, vale separar
  // num veredito próprio". A Cygnal repetiu, e com a soma FECHANDO em 101, ou
  // seja sem nenhum pretexto de soma para entrar no registro vizinho. O lugar
  // dela sempre foi aqui, e o que faltava era este nome.
  //
  // 🧪 Ele EXIGE `acesso` com status medido, data e CONTROLE POSITIVO, porque
  // 403 de host que bloqueia é indistinguível de 403 de leitor quebrado, e esta
  // casa já pagou por isso: numa rede com inspeção de TLS todo leitor local caía
  // e o diagnóstico natural era "o host caiu". Sem controle, "inacessível" é
  // opinião, e opinião não fecha nem abre dívida.
  FONTE_INACESSIVEL: 'o documento foi LOCALIZADO e não abriu: o host recusa leitor automatizado, ou cobra',
}

/**
 * 🔒 Cada entrada guarda os VALORES. Se o índice reescrever D ou R, a
 * conferência CADUCA sozinha e a linha volta a contar como não conferida, que é
 * o que impede uma leitura de ontem de calar um número de hoje.
 */
export const FONTE_CONFERIDA = [
  {
    // 🔴 O BURACO DE COBERTURA FECHOU E O DE PROVA ABRIU, no mesmo dia.
    //
    // 🧭 Em 17/Out esta rodada era o buraco mais grave que o conferidor sabe
    //    acusar: a casa estava em ZERO linhas de 495, e ela publica generic
    //    ballot nacional. Foi registrada em `buraco-conhecido.mjs` como
    //    FONTE_INACESSIVEL, com revisão marcada para 20/Out.
    //
    // ✅ Em 18/Out ela ENTROU pelo índice, sozinha, com D 46 x R 39 x outros
    //    15 sobre n=2.021 RV e ±2,3, levando a média a D+7.56. A caducidade do
    //    registro de buracos veio de graça: ele só é consultado para rodada que
    //    FALTA, e esta deixou de faltar sem ninguém tocar em nada.
    //
    // 🔴 Mas o acesso NÃO melhorou, e agora a linha é SERVIDA. É o mesmo arco
    //    da Cygnal de 02/Out: cobertura fecha, prova não.
    //
    // 🧪 Medido em 18/Out, segundo dia seguido, com controle positivo:
    //    artigo, raiz, listagem /research/ e o PRÓPRIO robots.txt devolvem 429,
    //    enquanto poll.qu.edu/robots.txt responde 200 no mesmo cliente e no
    //    mesmo minuto. O arquivo que existe para declarar o que robô pode fazer
    //    é negado ao robô, então a leitura honesta é "recusa automatizada" e
    //    nunca "proibido por política que eu li".
    //
    // 🕰️ E a rota do Wayback aqui responde de verdade, ao contrário do caso da
    //    Cygnal: a API de disponibilidade devolveu **200 com
    //    `archived_snapshots: {}`**, ou seja NÃO EXISTE cópia arquivada. Isso é
    //    medição, e não o 429 indeterminado daquele caso.
    //
    // ⚠️ `curl -o` GRAVOU no 429: 34.223 bytes começando em `<!DOCTYPE`, que é
    //    a página de erro. Conferir o download pelo tamanho diria que deu certo.
    instituto: 'Change Research (D)',
    campoInicio: '2026-09-15',
    campoFim: '2026-09-24',
    valores: '46/39',
    conferidoEm: '2026-10-18',
    resultado: 'FONTE_INACESSIVEL',
    url: 'https://changeresearch.com/research/2026/2026-10-07-what-voter-motivation-reveals-about-2026',
    acesso: {
      status: 429,
      hostTodo: true,
      medidoEm: '2026-10-18',
      controlePositivo:
        'no mesmo cliente e no mesmo minuto, poll.qu.edu/robots.txt devolveu 200, enquanto changeresearch.com devolveu 429 no artigo, na RAIZ, na listagem /research/ e no proprio robots.txt',
      observado:
        '429 e limite de taxa e nao recusa de politica, e ele persistiu por dois dias seguidos. A API de disponibilidade do Wayback respondeu 200 com archived_snapshots vazio, entao NAO existe copia arquivada, o que aqui e medicao e nao indeterminado',
    },
    confirmado: [],
    naoConfirmado: [
      'o topline D 46 x R 39 que servimos, e portanto a vantagem de D+7,00',
      'o recorte de 2.021 eleitores registrados',
      'a margem de ±2,3',
      'o campo de 15 a 24/Set/2026',
      'o residual de 15 pontos, que é o maior da janela e por isso o que mais pediria conferência',
    ],
    nota: '⛔ Nada foi alterado e a linha segue valendo pelo índice, com a procedência declarada. 📌 Fontes secundárias falam em D+7 no agregado, o que BATE com o índice, mas resumo de busca não é nem índice e não fecha conferência. 🔑 O residual de 15 pontos é o campo que mais importa aqui: ele é alto para a janela, e é exatamente o tipo de número que o teste da soma usa para achar coluna deslizada. Sem o documento, ele fica sem decomposição. ⏳ Revisar quando o host abrir; o caminho do Wayback está fechado por ausência de cópia, não por bloqueio.',
  },
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
  {
    // 🔒 A PRIMEIRA `FONTE_INACESSIVEL`, e ela é a rodada que FECHOU o único
    // buraco de cobertura que estava aberto: em 07/Out a Cygnal de 02/Out era
    // cobrada como buraco real numa casa que bloqueia a própria listagem, e em
    // 08/Out ela entrou pelo ÍNDICE, sozinha, levando a média de D+7.54 sobre 44
    // para D+7.57 sobre 45. O buraco de COBERTURA fechou; o de PROVA não.
    //
    // 📏 E o 403 não cega uma linha, cega a SÉRIE: a Cygnal tem 13 rodadas na
    // base, tracker mensal de 1.500 prováveis votantes, e DEZ delas citam um PDF
    // em cygn.al. Nenhuma das dez pode ser conferida enquanto o host recusar.
    //
    // 🧪 Medido em 08/Out, com controle positivo, e o bloqueio é do HOST TODO: o
    // próprio `robots.txt` devolve 403, ou seja o arquivo que existe para
    // declarar o que robô pode fazer é negado ao robô. Não há como ler a
    // permissão, e por isso a leitura é "recusa automatizada" e não "proibido por
    // política que eu li".
    //
    // 🛣️ AS ROTAS HONESTAS FORAM TENTADAS, e ficam declaradas para a próxima
    // passada não refazê-las:
    //   · data.ddhq.io responde 200 e é host que o próprio índice já usou para
    //     esta casa, na onda de Mai/2026, mas não tem a rodada de outubro e a
    //     raiz dele é 404, então não há listagem para consultar.
    //   · o Wayback devolveu 429 na API de disponibilidade. 🔴 Isso é
    //     INDETERMINADO e NÃO "não existe cópia": 429 é limite de taxa, e a régua
    //     da casa é que bloqueio de host não se resolve insistindo. Quem ler esta
    //     entrada como "o Wayback não tem" vai afirmar o que ninguém mediu.
    //   · matéria de veículo NÃO serve, e isso já é precedente deste registro: a
    //     Morning Consult de 10-15/Set está aqui como CONFIRMA_PARCIAL porque a
    //     matéria descreve a direção em palavras e não publica um percentual.
    //
    // ⛔ O número NÃO se mexe e a linha NÃO sai. Ela segue valendo pelo índice,
    // com a procedência declarada, que é o que este registro sempre fez.
    instituto: 'Cygnal (R)',
    campoInicio: '2026-10-01',
    campoFim: '2026-10-02',
    valores: '52/43',
    conferidoEm: '2026-10-08',
    resultado: 'FONTE_INACESSIVEL',
    url: 'https://www.cygn.al/wp-content/uploads/2026/10/24822-Cygnal-National-Early-Oct26-NVT-Deck-Midterm-Political.pdf',
    acesso: {
      status: 403,
      hostTodo: true,
      medidoEm: '2026-10-08',
      // 🔑 O que prova que o leitor estava bom quando viu o 403.
      controlePositivo:
        'npm run rede:afos deu VEREDITO LIMPA, e no mesmo cliente e no mesmo minuto poll.qu.edu/robots.txt e harvardharrispoll.com responderam 200, enquanto cygn.al devolveu 403 na raiz, no robots.txt, na listagem e no PDF',
      // ⚠️ `curl -o` GRAVA mesmo no 403, e o arquivo de 6.059 bytes começa com
      // "<!DOCTYP": é a página de erro. Conferir que baixou pelo tamanho, ou pela
      // existência do arquivo, diria que deu certo.
      observado: 'o corpo devolvido é HTML de erro, 6.059 bytes, não PDF',
    },
    confirmado: [],
    naoConfirmado: [
      'o topline D 52 x R 43',
      'o recorte de 1.500 prováveis votantes',
      'a margem de ±2,53',
      'o campo 01-02/Out/2026',
      'o residual de 6 pontos',
    ],
    nota:
      'A rodada entrou pelo ÍNDICE em 08/Out e fechou o único buraco de cobertura aberto, mas o topline do instituto não pôde ser aberto: cygn.al devolve 403 ao leitor automatizado no host TODO, inclusive no próprio robots.txt, conferido com controle positivo em dois outros institutos no mesmo minuto. ⛔ Não forjei user-agent, que é regra permanente da casa. 🛣️ Rotas tentadas e declaradas: DDHQ responde 200 e não tem a rodada de outubro, com a raiz em 404 e portanto sem listagem; o Wayback devolveu 429, que é INDETERMINADO e não ausência de cópia; e matéria de veículo não é topline, pelo precedente da Morning Consult neste mesmo registro. 📏 O alcance do bloqueio é a SÉRIE e não a linha: 10 das 13 rodadas da Cygnal na base citam PDF neste host. 📉 Efeito na média: a rodada ENTRA e vale D+9.00 contra uma média de D+7.57, ou seja ela é das mais favoráveis aos democratas na janela, e isso é exatamente o motivo para a dívida ficar impressa em vez de fechada.',
  },
  {
    // ⭐ A PRIMEIRA rodada de 13/Out, e a unica das TRES que abriu. O artigo da
    //    propria casa, 200 e 73 KB, lido ancorando no ROTULO da pergunta e nao no
    //    par de numeros, que e a regua que a Pew comprou caro em 09/Out.
    //
    // 🔑 O que ele sustenta e a MARGEM, e o que ele nao publica e a DECOMPOSICAO.
    //    A frase e "extended their lead in the generic ballot to 8 points among
    //    likely voters", e 52 x 44 nao aparece em lugar nenhum do texto.
    //
    // ⚠️ E a amostra NAO se contradiz, ela e outro objeto: a fonte declara
    //    "a sample size of 2,553 US adults" e o indice gravou 2.201 LV. Um subgrupo
    //    de provaveis votantes de 2.201 dentro de 2.553 adultos e aritmeticamente
    //    coerente, entao o documento nao REFUTA o 2.201; ele simplesmente nao o
    //    publica. E o mesmo padrao da Harvard/Harris neste registro, em que o N da
    //    coluna LV nao existe no documento e a linha segue com amostra nao
    //    confirmada.
    instituto: 'Focaldata',
    campoInicio: '2026-10-02',
    campoFim: '2026-10-05',
    valores: '52/44',
    conferidoEm: '2026-10-13',
    resultado: 'CONFIRMA_PARCIAL',
    url: 'https://www.focaldata.com/blog/democrats-further-extend-generic-ballot-lead-as-midterms-approach',
    confirmado: [
      'a PERGUNTA: o texto diz "generic ballot" tres vezes, e o titulo e "Democrats further extend generic ballot lead as midterms approach"',
      'a MARGEM de 8 pontos: "have extended their lead in the generic ballot to 8 points", que e exatamente o 52 menos 44 do indice',
      'o RECORTE de provaveis votantes: "among likely voters", na mesma frase da margem',
      'o CAMPO: "Fieldwork was conducted between 2 and 5 October 2026", identico ao que o indice gravou',
      'quem EXECUTA e quem ENCOMENDA: "the latest Focaldata-Financial Times poll", que confirma a equivalencia de nome ja declarada em casas.mjs',
    ],
    naoConfirmado: [
      'a DECOMPOSICAO D 52 x R 44: o artigo publica a margem em pontos e nenhum percentual por partido',
      'a amostra de 2.201 LV: a fonte declara 2.553 US adults, que e o total e nao o subgrupo. O 2.201 nao e refutado, apenas nao publicado',
      'o campo outros em 4: consequencia aritmetica de uma decomposicao que a fonte nao da',
      'a margem de erro: o indice gravou null e a fonte nao declara nenhuma',
    ],
    nota: 'A rodada entrou pelo INDICE em 13/Out, junto com outras duas, e foi a unica das tres cujo documento abriu. ⭐ Ela TRINCOU a parada de oito dias: o campo mais recente da base saiu de 05/Out e foi a 11/Out nesta passada. 📍 E ela e a unica das tres que acrescenta INSTITUTO a janela, levando de 30 a 31, porque Morning Consult e Cygnal ja estavam dentro. 📉 Efeito na media: vale D+8.00 contra uma janela de D+7.50, ou seja meio ponto acima, e as tres juntas levaram a media a D+7.54.',
  },
  {
    // 🔴 SEGUNDA Cygnal com o documento recusado, e o host repetiu o padrao de
    //    cinco dias antes. Entrada propria porque a conferencia e por RODADA: a de
    //    01-02/Out ja esta neste registro e nao fala por esta.
    //
    // 🧪 CONTROLE POSITIVO medido no mesmo minuto: npm run rede:afos deu
    //    VEREDITO LIMPA, focaldata.com respondeu 200 na raiz e 200 no artigo, e
    //    morningconsult.com respondeu 200 com 207 KB. O leitor funciona.
    instituto: 'Cygnal (R)',
    campoInicio: '2026-10-07',
    campoFim: '2026-10-10',
    valores: '51/42',
    conferidoEm: '2026-10-13',
    resultado: 'FONTE_INACESSIVEL',
    url: 'https://www.cygn.al/wp-content/uploads/2026/10/Cygnal-National-Poll-on-Foreign-Conflicts-Oct-2026.pdf',
    acesso: {
      status: 403,
      hostTodo: true,
      medidoEm: '2026-10-13',
      controlePositivo: 'no mesmo cliente e no mesmo minuto, focaldata.com devolveu 200 na raiz e 200 no artigo com 73 KB, e morningconsult.com devolveu 200 com 207 KB, enquanto cygn.al devolveu 403 tanto no PDF quanto na RAIZ do host',
      observado: 'o corpo do 403 e HTML de 6.018 bytes no PDF e 5.647 na raiz, e comeca com <title>Just a moment...</title>, que e interstitial de desafio e nao pagina de erro do servidor',
    },
    confirmado: [],
    naoConfirmado: [
      'o topline D 51 x R 42',
      'o recorte de 1.500 provaveis votantes',
      'a margem de mais ou menos 2,5',
      'o campo 07-10/Out/2026',
      'o residual de 7 pontos',
    ],
    nota: '⛔ Nao forjei user-agent, que e regra permanente da casa, e o bloqueio e deliberado do host. 📍 O que esta entrada ACRESCENTA a de 08/Out nao e o bloqueio, que ja era conhecido, e que ele PERSISTE cinco dias depois e num arquivo de nome completamente diferente: o alcance e do host, nao de um ativo. 📉 Efeito na media: vale D+9.00 contra uma janela de D+7.50, ou seja e a mais favoravel aos democratas das tres que entraram hoje, e por isso a divida fica impressa em vez de fechada.',
  },
  {
    // 🔴 E a TERCEIRA, com um 403 de natureza DIFERENTE, e a diferenca importa
    //    porque muda o alcance que se pode declarar.
    //
    // 🔑 Na Cygnal a RAIZ do host tambem recusa, entao hostTodo: true. Aqui a
    //    raiz responde 200 e o subdominio pro. tambem: quem recusa e o caminho do
    //    ATIVO em pro-assets. Declarar hostTodo aqui seria afirmar mais do que foi
    //    medido, e a proxima rodada da casa pode muito bem abrir.
    instituto: 'Morning Consult',
    campoInicio: '2026-10-05',
    campoFim: '2026-10-11',
    valores: '50/43',
    conferidoEm: '2026-10-13',
    resultado: 'FONTE_INACESSIVEL',
    url: 'https://pro-assets.morningconsult.com/wp-uploads/2026/09/MCPI-Midterm-Ballot.html',
    acesso: {
      status: 403,
      hostTodo: false,
      medidoEm: '2026-10-13',
      controlePositivo: 'no mesmo cliente e no mesmo minuto, morningconsult.com devolveu 200 com 207.747 bytes e pro.morningconsult.com devolveu 200 com 67.152 bytes, enquanto o caminho do ativo em pro-assets devolveu 403 com 5.829 bytes',
      observado: 'o corpo do 403 e HTML de 5.829 bytes com comentarios condicionais de IE no topo, ou seja pagina de bloqueio servida pela borda, e nao o tracker',
    },
    confirmado: [],
    naoConfirmado: [
      'o topline D 50 x R 43',
      'o recorte de 17.654 provaveis votantes',
      'a margem de mais ou menos 1',
      'o campo 05-11/Out/2026',
      'o residual de 7 pontos',
    ],
    nota: '⛔ Nao forjei user-agent. 🔍 E uma suspeita minha foi MEDIDA e dissolvida antes de virar frase: n=17.654 provaveis votantes e grande o bastante para eu ter pensado em agregacao de ondas, pela regua de que amostra grande demais para o instituto e sinal de agregar. Mas as outras ondas da Morning Consult NA MESMA JANELA tem 18.786, 18.336 e 17.659: cerca de 17 a 19 mil e o normal desta casa, que roda tracker de painel grande, e a regua fala de amostra grande demais PARA O INSTITUTO. 📍 O alcance do bloqueio e o CAMINHO e nao o host, conferido na raiz e no subdominio. 📉 Efeito na media: vale D+7.00 contra uma janela de D+7.50, ou seja ela puxa a media para BAIXO, e e a unica das tres nessa direcao.',
  },
  {
    // 🆕 CASA NOVA no índice, primeira aparição: a TrueDot não existia em
    //    nenhuma linha do arquivo antes de 14/Out e não está declarada em
    //    casas.mjs. Rodada única, então ainda não há par de nomes a decidir.
    //
    // 🔴 E ela é o caso em que BLOQUEIO e INEXISTÊNCIA se somam, que são coisas
    //    diferentes e eu medi as duas, porque uma manda tentar de novo e a
    //    outra manda parar:
    //
    //    1. a fontePrimaria que o índice declara é a The Hill, e o host todo
    //       recusa: 403 no artigo E na raiz, 6.520 bytes nos dois, com
    //       <meta name="description" content="px-captcha"> e o título "Access
    //       to this page has been denied". É PerimeterX, bloqueio deliberado.
    //    2. o WAYBACK não tem cópia: a API de disponibilidade devolveu
    //       "archived_snapshots": {} para aquela URL. Não é bloqueio de host do
    //       arquivo, é ausência de captura, então insistir ali não resolve.
    //    3. e a casa que EXECUTOU publica, mas não isto: truedot.ai/news abriu
    //       com 200 e lista apenas pesquisas da Califórnia de 2025, nenhuma
    //       nacional de outubro de 2026.
    //    4. o encomendante também abriu e também não serve: a página nacional
    //       do generic ballot do DDHQ (votes.decisiondeskhq.com) devolve 200 e
    //       publica a MÉDIA DELES, D 48.90 x R 41.10, mas a lista de rodadas
    //       individuais está atrás do paywall Pro. Rolei a página dez vezes e
    //       o texto ficou nos mesmos 2.848 caracteres.
    //
    // 🔑 O que isto permite afirmar e o que não permite. O RÓTULO da pergunta
    //    está confirmado por duas vias independentes, porque o slug da The Hill
    //    é "democrats-lead-congressional-ballot-ddhq" e a página do DDHQ
    //    enuncia "If the election for Congress were being held today, who would
    //    Americans vote for?", que é generic ballot. ⛔ Mas rótulo não é
    //    topline: D 49 x R 42, o n=974 LV e os ±3.2 seguem SEM confirmação.
    instituto: 'TrueDot',
    campoInicio: '2026-10-05',
    campoFim: '2026-10-09',
    valores: '49/42',
    conferidoEm: '2026-10-14',
    resultado: 'FONTE_INACESSIVEL',
    url: 'https://thehill.com/homenews/campaign/6143963-democrats-lead-congressional-ballot-ddhq/',
    acesso: {
      status: 403,
      hostTodo: true,
      medidoEm: '2026-10-14',
      controlePositivo: 'no mesmo cliente e no mesmo minuto, focaldata.com devolveu 200 com 134.593 bytes, www.truedot.ai devolveu 200 com 1.395.344 bytes e www.decisiondeskhq.com devolveu 200 com 52.167 bytes, enquanto thehill.com devolveu 403 tanto no artigo quanto na RAIZ do host, com 6.520 bytes nos dois',
      observado: 'o corpo do 403 traz <meta name="description" content="px-captcha"> e <title>Access to this page has been denied</title>, mais window._pxUuid: e desafio do PerimeterX, nao pagina de erro do servidor',
    },
    // ⛔ VAZIO por regra do registro, e a regra esta CERTA: FONTE_INACESSIVEL nao
    // pode confirmar nada, porque o veredito descreve o que A URL DECLARADA
    // sustentou, e ela nao abriu. A prova do ROTULO existe, mas vem de OUTRAS
    // fontes, e por isso ela mora na nota. Conferido: conferirCarga reprovou a
    // primeira versao desta entrada, que punha o rotulo aqui.
    confirmado: [],
    naoConfirmado: [
      'o topline D 49 x R 42',
      'o recorte de 974 prováveis votantes',
      'a margem de ±3,2',
      'o campo 05-09/Out/2026',
      'o residual de 8 pontos, que fecha a soma em 99',
    ],
    nota: '⛔ Não forjei user-agent, e o bloqueio da The Hill é captcha deliberado do host. 🔎 O que esta entrada acrescenta a um 403 comum é ter medido as QUATRO portas e separado bloqueio de ausência: a The Hill RECUSA, o Wayback NÃO TEM cópia, e as duas casas envolvidas ABREM e não publicam esta rodada. Dívida de topline contra a origem, não contra o leitor. 📉 Efeito na média: vale D+7.00 contra uma janela de D+7.54, então ela puxa para baixo, e é a ÚNICA rodada que entrou nesta passada. 🏷️ O RÓTULO da pergunta, porém, está corroborado por duas vias que ABRIRAM, e isso não entra em `confirmado` porque não foi a URL declarada que o sustentou: o slug do artigo é "democrats-lead-congressional-ballot-ddhq" e a página nacional do DDHQ enuncia "If the election for Congress were being held today, who would Americans vote for?". ⛔ Rótulo não é topline, e o topline segue em aberto. 🆕 Casa nova, e por isso o nome dela não tem par declarado em casas.mjs ainda.',
  },
  {
    // ✅ Fonte ABERTA, 200, e ela confirma a linha com MAIS precisão do que o
    //    índice: 53,3 x 46,7, que o índice arredondou para 53 x 47.
    //
    // ⚠️ E é por isso que isto é PARCIAL e não total: a casa calcula a vantagem
    //    a partir do D e do R já ARREDONDADOS, então servimos D+6,00 enquanto a
    //    fonte, sem arredondar, dá 6,6. Não é erro de ninguém, é consequência
    //    declarada da convenção de produção, e o lugar de dizer isso é aqui.
    instituto: 'ActiVote',
    campoInicio: '2026-10-04',
    campoFim: '2026-10-14',
    valores: '53/47',
    conferidoEm: '2026-10-15',
    resultado: 'CONFIRMA_PARCIAL',
    url: 'https://www.activote.net/polls/generic-ballot/2026-10-14/',
    confirmado: [
      'o RECORTE: "1000 likely midterm voters", que é exatamente o n=1.000 LV do índice',
      'a MARGEM: ±3,1%, idêntica',
      'o CAMPO: de 4 a 14 de outubro, idêntico, e a fonte ainda acrescenta a data mediana de campo em 9 de outubro, que o índice não traz',
      'os VALORES à arredondação: 53,3% para os democratas e 46,7% para os republicanos, que arredondam para os 53 e 47 do índice',
      'a AUSÊNCIA de indeciso: a fonte não reporta categoria de indeciso nem de outros, o que sustenta o campo `outros` vazio e a soma de dois sentidos fechando em 100',
    ],
    naoConfirmado: [
      'a VANTAGEM de 6,00 que a casa serve: a fonte, sem arredondar, dá 53,3 menos 46,7, ou seja 6,6. A diferença de 0,6 é consequência da convenção de arredondar D e R ANTES de subtrair, e não de leitura errada',
    ],
    nota: '⭐ Das três rodadas que entraram em 15/Out, esta é a ÚNICA cuja fonte abriu e confirmou o recorte que servimos. 📐 E ela é a mais limpa do ponto de vista de recorte: a ActiVote publica apenas LV e força a escolha em dois sentidos, então não existe segundo painel para escolher, que é exatamente o problema das outras duas. 📉 Efeito na média: vale D+6,00 contra uma janela de D+7,58, então puxa para baixo.',
  },
  {
    // ✅ Fonte ABERTA e confirma a linha tabulada. 🔴 MAS ela revela um SEGUNDO
    //    RECORTE que o índice NÃO tabulou, e que a régua da casa PREFERE.
    //
    // 🔑 O artigo da Fox dá o resultado principal em eleitores REGISTRADOS,
    //    54 x 45, que é o que servimos, e informa que entre os prováveis
    //    votantes, os certos de votar, a vantagem é de 52 x 46, ou seja D+6,00
    //    contra os D+9,00 que estão na nossa base.
    //
    // ⛔ Não mexi em valor nenhum. Trocar de recorte aqui seria INGERIR uma
    //    linha que o índice não tem, o que é CURADORIA e muda a procedência.
    //    Decisão do André, e ela está declarada na nota.
    instituto: 'Beacon Research (D)/ Shaw & Co. Research (R)',
    campoInicio: '2026-10-09',
    campoFim: '2026-10-12',
    valores: '54/45',
    conferidoEm: '2026-10-15',
    resultado: 'CONFIRMA_PARCIAL',
    url: 'https://www.foxnews.com/politics/fox-news-poll-cost-living-concerns-weigh-gop-midterms',
    // 🔑 ESTRUTURADO de propósito, em 15/Out/2026: a prosa do naoConfirmado diz
    //    que existe outro recorte, mas prosa não se mede. Com o campo, o medidor
    //    de efeito do recorte deixa de ser cego ao que existe só na FONTE.
    //    ⏳ A caducidade vem de graça: `fonteDa` casa por `valores`, então se o
    //    índice reescrever o número esta declaração para de valer sozinha.
    recorteAlternativo: {
      tipo: 'LV',
      dem: 52,
      rep: 46,
      prova: 'o artigo diz, sobre os prováveis votantes, aqueles certos de votar: "52%-46%" de vantagem democrata, ao lado do resultado principal em eleitores registrados que é 54 x 45',
    },
    confirmado: [
      'o TOPLINE que servimos: "54% of voters say they would back the Democratic candidate in their House district and 45% would support the Republican"',
      'a AMOSTRA e o RECORTE: 1.202 eleitores registrados, idêntico ao índice',
      'a MARGEM: ±2,5 pontos percentuais para a amostra cheia',
      'o CAMPO: 9 a 12 de outubro de 2026, idêntico',
      'quem EXECUTOU: "Beacon Research (D) and Shaw & Company Research (R)", que confirma o par de nomes que o índice usa e a equivalência com a Fox News já declarada em casas.mjs',
    ],
    naoConfirmado: [
      'o campo `outros` em 1: o artigo não publica categoria residual, e o 1 é o que fecha 54 mais 45 em 100',
      '🔴 e o mais importante, que NÃO é uma falha da fonte e sim uma escolha nossa: existe um recorte de PROVÁVEIS VOTANTES, 52 x 46, que a régua LV > RV > A preferiria, e que a nossa base não carrega porque o índice tabulou o recorte RV',
    ],
    nota: '🔴 ESTA ENTRADA EXISTE SOBRETUDO PELO SEGUNDO RECORTE. O índice tabula RV e a fonte publica também LV, 52 x 46, que dá D+6,00 contra os D+9,00 servidos. A hierarquia declarada da casa é LV > RV > A, então estamos servindo o recorte NÃO preferido, por 3 pontos. ⛔ Nada foi alterado: ingerir o LV seria curadoria, muda a procedência e é decisão do André. 📐 E note a DIREÇÃO: aqui o LV é MENOR que o RV, enquanto na RMG da mesma leva o LV é MAIOR. As duas não empurram para o mesmo lado, então não há viés de uma direção só, há exposição.',
  },
  {
    // 🔴 FONTE INALCANÇÁVEL, e o diagnóstico é do NOSSO lado, não do host.
    //
    // 🧪 Não é 403 e não é recusa: `napolitannews.org` RESOLVE PARA 127.0.0.1,
    //    e o curl devolve HTTP 000 com 0 byte no artigo E na raiz. O controle
    //    positivo no mesmo minuto mostra focaldata.com em 200 com 134.593 bytes
    //    e activote.net em 200 com 62.497, e o nslookup de focaldata.com devolve
    //    endereço real. Ou seja: DNS apontando para loopback, que é bloqueio ou
    //    falha de resolução na nossa ponta.
    //
    // 🚪 As outras portas da mesma casa, medidas: rmgresearch.com devolve 403,
    //    scottrasmussen.com devolve 401, e napolitaninstitute.org ABRE com 200 e
    //    88.913 bytes, mas a home dele não publica a tabela do generic ballot.
    //
    // 🔑 E o que esta entrada registra de mais valioso é o ÍNDICE SE
    //    CONTRADIZENDO: a linha tabulada é `2,000 (RV)` com D 51 x R 43, e o
    //    TÍTULO da citação que ela mesma carrega é "Generic Ballot, Likely
    //    Voters: Dem 54, GOP 43". A régua da casa prefere LV, e o LV que o
    //    próprio índice cita dá D+11,00 contra os D+8,00 servidos.
    instituto: 'RMG Research',
    campoInicio: '2026-10-13',
    campoFim: '2026-10-14',
    valores: '51/43',
    conferidoEm: '2026-10-15',
    resultado: 'FONTE_INACESSIVEL',
    url: 'https://napolitannews.org/posts/generic-ballot-likely-voters-dem-54-gop-43',
    // ⚠️ ESTRUTURADO, mas com a PROVA MAIS FRACA das duas, e isso fica dito no
    //    campo: aqui o LV não foi lido no documento, que não abre, e sim no
    //    TÍTULO da citação que o próprio índice carrega. É mais forte que nada
    //    e mais fraco que abrir a fonte, e quem ler o medidor precisa saber.
    recorteAlternativo: {
      tipo: 'LV',
      dem: 54,
      rep: 43,
      prova: 'TÍTULO da citação do índice, não o documento: "Generic Ballot, Likely Voters: Dem 54, GOP 43". O host não abre, resolve para 127.0.0.1',
    },
    acesso: {
      status: 0,
      hostTodo: true,
      medidoEm: '2026-10-15',
      controlePositivo: 'no mesmo cliente e no mesmo minuto, focaldata.com devolveu 200 com 134.593 bytes e activote.net devolveu 200 com 62.497 bytes, enquanto napolitannews.org devolveu HTTP 000 com 0 byte tanto no artigo quanto na RAIZ. E o nslookup separa as duas coisas: focaldata.com resolve para 198.202.211.1 e napolitannews.org resolve para 127.0.0.1',
      observado: 'nao e 403 e nao e recusa do host: o nome resolve para LOOPBACK, entao a conexao morre na nossa ponta antes de sair. E falha de resolucao ou bloqueio de DNS local, e insistir no mesmo cliente nao resolve',
    },
    confirmado: [],
    naoConfirmado: [
      'o topline D 51 x R 43 que servimos',
      'o recorte de 2.000 eleitores registrados',
      'a margem de ±2,2',
      'o campo 13-14/Out/2026',
      'o residual de 6 pontos',
      '🔴 e o recorte LV de 54 x 43 que o TÍTULO da citação do índice anuncia: ele não foi lido no documento, só no título',
    ],
    nota: '⛔ Não forjei user-agent e não mexi em DNS: o veredito é sobre o alcance a partir daqui. 🔎 Quatro portas medidas, e três fecharam: o artigo e a raiz em HTTP 000 por loopback, rmgresearch.com em 403, scottrasmussen.com em 401, e só napolitaninstitute.org abriu, sem trazer a tabela. 🔴 O ACHADO PRINCIPAL não é o bloqueio, é o índice se contradizendo: ele tabula RV e cita um artigo cujo título é o número LV, e a régua da casa prefere LV. Serviríamos D+11,00 em vez de D+8,00. ⚠️ E a evidência do LV é o TÍTULO da citação, não o documento, o que é mais fraco do que abrir a fonte e mais forte do que nada. 🧊 E uma observação que fica em aberto: a linha RV desta onda é IDÊNTICA à da onda de 08-15/Set, D 51, R 43, outros 6, n=2.000, ±2,2, enquanto o título LV andou de "Dems Ahead 6" para "Dem 54, GOP 43". Pode ser estabilidade real do recorte RV ou linha repetida no índice, e sem abrir o documento eu não separo as duas.',
  },
  {
    // ✅ Topline aberto e LIDO pelo rótulo da pergunta (TM3287Y24), não pelo
    //    par de números. 🔴 E ele mostra que o índice TROCOU as margens entre
    //    os dois recortes da mesma onda: a linha RV saiu com a margem do total
    //    e a linha A com a margem de RV.
    instituto: 'Reuters/Ipsos',
    campoInicio: '2026-10-16',
    campoFim: '2026-10-19',
    valores: '47/35',
    conferidoEm: '2026-10-21',
    resultado: 'CONFIRMA_PARCIAL',
    url: 'https://www.ipsos.com/sites/default/files/ct/news/documents/2026-10/Reuters%20Ipsos%20News%20Issue%20Survey%20October%202026%20Topline_2.pdf',
    confirmado: [
      'a PERGUNTA, TM3287Y24: "if the election for U.S. Congress were held today, would you vote for the Democratic candidate or the Republican candidate in your district where you live?". As opções são o candidato democrata e o republicano, sem nomes, então é generic ballot',
      'o TOPLINE na coluna RV: Democratic candidate 47%, Republican candidate 35%',
      'a AMOSTRA e o RECORTE: a coluna RV declara N=1,279, idêntico ao índice',
      'o CAMPO: "Interview dates: October 16-19, 2026", idêntico',
      'o campo `outros` em 19: outro partido 3, não sabe 11, não vota 4 e pulou 1, que fecham a coluna RV em 101 por arredondamento',
      'a linha de ADULTOS que o índice também tabula: Total N=1,679, D 40 x R 29, e o resto fecha 31',
    ],
    naoConfirmado: [
      '🔴 a MARGEM de ±2,4 da linha RV: o documento dá ±2,4 para "all respondents" e ±2,8 para "Registered Voters". O índice trocou as duas, porque a linha de adultos saiu com ±2,8',
      'um recorte LV: o cabeçalho declara margem para "Likely Voters" (±2,9), mas a pergunta não traz coluna LV, então não existe topline LV publicado para esta onda',
    ],
    nota: '⚠️ A troca de margem é de campo SECUNDÁRIO e não toca a média: D e R estão corretos, então a vantagem D+12 é a da fonte. Mesma família da CBS News/YouGov de 15/Set e da Quinnipiac, em que a margem do índice não é a do recorte. 📐 D+12 é a maior margem entre as rodadas que entraram nesta semana, e ela não sai de outro instrumento: a pergunta é a mesma TM3287Y24 que a casa usa desde fevereiro. 📌 Os leaners da TM3287Y24_2 (base "Don\'t know", N=195) não entram em nenhuma das duas linhas, e o índice não os soma.',
  },
  {
    // ✅ Topline aberto, e a pergunta Q.13 é generic ballot. 🔴 O índice
    //    escreveu 50 x 41 somando as parcelas JÁ ARREDONDADAS (48+2 e 38+3).
    //    O instituto publica o TOTAL, 49 x 41, e o memo repete "49-to-41".
    instituto: 'GBAO (D)',
    campoInicio: '2026-09-17',
    campoFim: '2026-09-24',
    valores: '50/41',
    conferidoEm: '2026-10-21',
    resultado: 'CONFIRMA_PARCIAL',
    url: 'https://uploads.thirdway.org/downloads/voters-are-clear-costs-are-the-signal/Third-Way-GBAO-National-Framing-Survey-Toplines-September-2026.pdf',
    confirmado: [
      'a PERGUNTA, Q.13: "If the November election for U.S. Congress were being held today, for whom would you vote?", com "The Democratic candidate" e "The Republican candidate" como opções, sem nomes',
      'o CAMPO e a AMOSTRA: o cabeçalho diz "September 17 – 24, 2026" e "2,000 Registered Voters", idênticos ao índice',
      'a VANTAGEM de 9 que servimos: a linha "Democratic candidate - Republican candidate" do topline diz 9',
      'o R em 41: "Total Republican candidate ... 41"',
      'o `outros` em 10: Other 1 e Undecided 9',
    ],
    naoConfirmado: [
      '🔴 o D em 50: o topline publica "Total Democratic candidate ... 49", e o memo repete "Democrats enjoy a 49-to-41 point lead". O 50 é a soma de "The Democratic candidate 48" com "Lean The Democratic candidate 2", parcelas já arredondadas',
      'a MARGEM de erro: nem o topline nem o memo declaram uma, e o índice a deixa vazia, que é o comportamento honesto',
    ],
    nota: '📐 A própria casa não fecha a conta: total D 49 menos total R 41 dá 8, e a linha líquida dela diz 9, porque a diferença é calculada antes de arredondar. O índice escolheu as parcelas e chegou a 50 x 41, que reproduz a líquida de 9 e não o total publicado. 📉 Efeito na média se servíssemos o total da casa, 49 x 41: D+8 em vez de D+9, cerca de -0,03pp numa janela de 34 rodadas. ⛔ Nada foi alterado: o valor servido é o do índice, e trocá-lo muda a procedência. 🧬 E a casa aparece no arquivo com DOIS nomes, `GBAO (D)` nesta onda e `GBAO (D)/Third Way (D)` na de abril, e `casas.mjs` não junta os dois. Hoje isso não dobra contagem, porque abril está fora da janela; a junção é decisão do André.',
  },
  {
    // ✅ Página datada da casa aberta (HTTP 200). Recorte, margem e campo batem.
    // 🔴 Os VALORES não: a fonte publica 53,7 x 46,3, que arredonda para 54 x 46,
    //    e o índice escreveu 53 x 47 com vantagem de 6, IGUAIS aos da onda
    //    anterior (04-14/Out). O wikitext traz `53%`, `47%` e `6%` literais,
    //    então a leitura nossa transcreveu certo e o desvio é do índice.
    instituto: 'ActiVote',
    campoInicio: '2026-10-15',
    campoFim: '2026-10-21',
    valores: '53/47',
    conferidoEm: '2026-10-22',
    resultado: 'CONFIRMA_PARCIAL',
    url: 'https://www.activote.net/polls/generic-ballot/2026-10-21/',
    confirmado: [
      'a PERGUNTA: "Generic Congressional Ballot", com as opções "Generic Democrat" e "Generic Republican", sem nomes',
      'o RECORTE: "1000 likely midterm voters", idêntico ao n=1.000 LV do índice',
      'a MARGEM: ±3,1%, idêntica',
      'o CAMPO: "in the field between October 15 and October 21 (median field date of October 18)", idêntico',
      'a AUSÊNCIA de indeciso: a fonte só publica os dois lados, o que sustenta `outros` vazio',
    ],
    naoConfirmado: [
      '🔴 o D em 53 e o R em 47: a fonte publica "53.7% Generic Democrat 46.3% Generic Republican", que arredonda para 54 x 46, e não para 53 x 47',
      '🔴 a VANTAGEM de 6 que servimos: a fonte declara "D+7.4%", e 54 menos 46 dá 8 pela convenção da casa',
    ],
    nota: '🧊 O 53 / 47 / 6 desta linha é IDÊNTICO ao da onda anterior da mesma casa (04-14/Out, fonte 53,3 x 46,7, que arredonda corretamente para 53 x 47). É compatível com a linha de cima ter sido copiada no índice, e isso NÃO está provado: prova só que o valor não é o que a fonte publica. 📉 Efeito medido com a media() de produção, controle reproduzindo D+7.71 sobre 32: com 54 x 46 a média iria a D+7.79, com 53,7 x 46,3 a D+7.77, ou seja +0,06 a +0,08pp. ⛔ DECIDIDO em 22/Out/2026, por delegação do André: o valor servido FICA o do índice. A regra permanente de 16/Out serve o que o índice tabula e nunca corrige contra ele, porque mexer à mão quebra a procedência, e o tamanho do efeito não é o argumento. Esta entrada CADUCA sozinha se o índice reescrever o número. 📌 O agregador (racetothewh) tabula esta onda como 54 x 46, D+7, mas com "400 LV" e campo 17-21/Out, o que a fonte também não sustenta.',
  },
  {
    // ✅ Matéria da CNN aberta (HTTP 200) em 21 e 22/Out. 🔒 O link que o índice
    //    cita, no DocumentCloud, devolve 403 com o host da API também em 403.
    instituto: 'CNN/SSRS',
    campoInicio: '2026-10-15',
    campoFim: '2026-10-18',
    valores: '49/39',
    conferidoEm: '2026-10-22',
    resultado: 'CONFIRMA_PARCIAL',
    url: 'https://edition.cnn.com/2026/10/21/politics/cnn-poll-trump-democrats-republicans-midterms',
    confirmado: [
      'o TOPLINE: "Democrats’ 49% to 39% advantage among registered voters nationally"',
      'a PERGUNTA: o candidato do partido "in their district", sem nomes',
      'a AMOSTRA e o RECORTE: "1,701 US adults ... including 1,206 registered voters", e o 1.206 do índice é o subgrupo RV',
      'a MARGEM: "it is 3.3 points among registered voters", idêntica',
      'o CAMPO: "conducted by SSRS from October 15-18", idêntico',
    ],
    naoConfirmado: [
      'o `outros` em 11: a matéria não decompõe o residual, e 49 + 39 deixa 12, não 11',
      'o documento que o índice cita (documentcloud.org/documents/28825702), que devolve 403, assim como a API dele, enquanto a matéria da CNN abriu no mesmo minuto',
    ],
    nota: '📌 O n=1.206 é IGUAL ao da onda de setembro e mede outra grandeza: em setembro era a amostra TOTAL, aqui é o subgrupo RV de 1.701 adultos. 🔎 A matéria traz dois recortes que o índice não tabula e que NÃO são outro recorte de amostra: quem já votou (cerca de 13%) vai 70 x 29, e quem ainda não votou 46 x 41. ⛔ Nada foi alterado.',
  },
  {
    // 🔒 Matéria e topline do NYT em 403. 🔴 E a nota do INSTITUTO EXECUTOR, que
    //    abriu, diz que a pergunta foi feita COM OS NOMES dos candidatos. É a
    //    mesma troca de instrumento da YouGov (Set) e da Pew (Out), e a onda de
    //    setembro desta casa, pela mesma fonte, era genérica.
    instituto: 'The New York Times/Siena University',
    campoInicio: '2026-10-12',
    campoFim: '2026-10-19',
    valores: '52/41',
    conferidoEm: '2026-10-22',
    resultado: 'FONTE_INACESSIVEL',
    url: 'https://www.nytimes.com/interactive/2026/10/21/polls/times-siena-poll-toplines.html',
    acesso: {
      status: 403,
      hostTodo: false,
      medidoEm: '2026-10-22',
      controlePositivo:
        'no mesmo cliente e no mesmo minuto, poll.qu.edu/robots.txt devolveu 200 e sri.siena.edu devolveu 200 com 79.843 bytes, enquanto o topline e a matéria do NYT devolveram 403 com 771 bytes. O nytimes.com/robots.txt responde 200, então não é o host todo',
      observado:
        'o Wayback não tem cópia do topline (archived_snapshots vazio). A nota do executor abriu e não traz a pergunta nem os percentuais por partido',
    },
    confirmado: [],
    naoConfirmado: [
      'o topline D 52 x R 41 entre LV e o D 51 x R 39 entre RV',
      '🔴 que a pergunta tabulada seja GENÉRICA: a nota do executor (sri.siena.edu/2026/10/21/new-york-times-siena-national-survey) cita o diretor, "Democrats lead Republicans by 10 points in a Congressional toss-up when we provided the names of every candidate"',
      'a amostra de 3.494 LV e a margem de ±1,9: a nota fala em "over 3,000 voters"',
      '⚠️ a coerência dos números: a nota diz 10 pontos, e o índice dá 11 (LV) e 12 (RV). Pode haver uma pergunta genérica E uma nominal na mesma onda, e sem o topline não se sabe qual o índice tabulou',
    ],
    nota: '🔬 A onda de SETEMBRO desta casa (08-13/Set, 1.503 LV, D 51 x R 43), pela nota do mesmo executor, é "Likely Voters Favor the Democratic Candidate for Congress in their District", sem menção a nomes. A de OUTUBRO diz "when we provided the names of every candidate". Se a linha tabulada for a nominal, é OUTRO instrumento e a régua de 26/Set a tira da média, como fez com YouGov e Pew. 📉 Medido com a media() de produção: sem esta onda a média iria de D+7.71 sobre 32 para D+7.61 sobre 31 (−0,10pp). ✅ DECIDIDO em 22/Out/2026, por delegação do André (\"você decide o que é mais acertado tecnicamente\"): a onda ENTROU em instrumento-medido.mjs como NOMINAL, pela frase literal do executor, e sai da média. A pergunta não foi lida (topline em 403), e o salto de 10 para 11 pontos cabe no arredondamento. Desfaz-se se a linha tabulada se mostrar uma pergunta genérica separada. 🧬 E a casa está na base com DOIS nomes: "New York Times/Siena College" em setembro e "The New York Times/Siena University" agora. Hoje não dobra, porque setembro está fora da janela.',
  },
  {
    // A linha RV da mesma onda: mesma porta fechada, mesma ressalva de instrumento.
    instituto: 'The New York Times/Siena University',
    campoInicio: '2026-10-12',
    campoFim: '2026-10-19',
    valores: '51/39',
    conferidoEm: '2026-10-22',
    resultado: 'FONTE_INACESSIVEL',
    url: 'https://www.nytimes.com/interactive/2026/10/21/polls/times-siena-poll-rv-crosstabs.html',
    acesso: {
      status: 403,
      hostTodo: false,
      medidoEm: '2026-10-22',
      controlePositivo:
        'o mesmo da linha LV: poll.qu.edu/robots.txt e sri.siena.edu em 200 no mesmo minuto, nytimes.com/robots.txt em 200',
    },
    confirmado: [],
    naoConfirmado: [
      'o topline D 51 x R 39 entre RV',
      '🔴 que a pergunta seja genérica, pela mesma frase do diretor citada na linha LV',
    ],
    nota: 'Recorte RV da onda acima; a média usa o LV pela hierarquia LV > RV > A. Ver a entrada LV para a prova e o efeito.',
  },
  {
    // ✅ Topline aberto (HTTP 200, começa em %PDF) e lido com pdftotext. Estava em
    //    buraco-conhecido como AGUARDANDO_INDICE desde 22/Out e o índice a
    //    recebeu em 23/Out.
    instituto: 'University of Massachusetts Lowell/YouGov',
    campoInicio: '2026-10-02',
    campoFim: '2026-10-04',
    valores: '52/43',
    conferidoEm: '2026-10-23',
    resultado: 'CONFIRMA',
    url: 'https://www.uml.edu/docs/2026-October-National-Topline_tcm18-423714.pdf',
    confirmado: [
      'a PERGUNTA 1: "If the 2026 election for U.S. House of Representatives were held today, would you vote for the Democratic candidate or the Republican candidate?", sem nomes, então é generic ballot',
      'o CAMPO: "Field Dates: October 2 – October 4, 2026", idêntico',
      'a AMOSTRA e o RECORTE: "N=1,000 U.S. Likely Voters", idêntico ao 1.000 LV do índice',
      'a MARGEM: "Adjusted Margin of Error: +/- 3.84%", idêntica',
      'os VALORES na coluna Total: "Democratic candidate 52%" e "Republican candidate 43%"',
      'o campo `outros` em 6: "Another candidate 1%", "Undecided 4%" e "I would not vote 1%", que fecham a coluna em 101 por arredondamento',
    ],
    naoConfirmado: [],
    nota: '✅ A segunda CONFIRMA total do ledger depois da AlphaROC. 📌 O topline foi publicado em 22/Out, quase três semanas depois do fim do campo, e o índice o recebeu um dia depois. 🧬 A casa tem outra onda na base como "UMass Lowell/YouGov" (Mar/2026, adultos), e as duas grafias foram declaradas como a mesma série em casas.mjs no mesmo dia.',
  },
  {
    // 🔒 A CNBC recusa o host TODO, e também o fm.cnbc.com, que é onde a série
    //    publicou o topline de Abr/2025. Os sites dos dois executores abrem e
    //    não publicam a onda.
    instituto: 'Hart Research Associates (D)/ Public Opinion Strategies (R)',
    campoInicio: '2026-10-14',
    campoFim: '2026-10-18',
    valores: '52/45',
    conferidoEm: '2026-10-23',
    resultado: 'FONTE_INACESSIVEL',
    url: 'https://www.cnbc.com/2026/10/22/trump-economic-approval-rating-midterms-poll.html',
    acesso: {
      status: 403,
      hostTodo: true,
      medidoEm: '2026-10-23',
      controlePositivo:
        'no mesmo cliente e no mesmo minuto, poll.qu.edu/robots.txt devolveu 200, enquanto a matéria, www.cnbc.com/robots.txt e o topline de Abr/2025 da mesma série em fm.cnbc.com devolveram 403',
      observado:
        'não forjei user-agent. hartresearch.com abre (200) e não tem listagem de pesquisas. pos.org abre (200), e a busca do WordPress dele por "CNBC" devolve posts até Out/2025, nenhum desta onda',
    },
    confirmado: [],
    naoConfirmado: [
      'o topline D 52 x R 45 e a vantagem de D+7,00',
      'o recorte de 1.000 eleitores registrados: os posts do POS sobre ondas anteriores da CNBC falam em amostra de ADULTOS, então o RV do índice pode ser um subgrupo, e isso não foi lido',
      'a margem de ±3,1',
      'o campo de 14 a 18/Out/2026',
      'o `outros` em 3',
    ],
    nota: '⛔ Nada foi alterado e a linha segue valendo pelo índice, com a procedência declarada. Estava em buraco-conhecido como FONTE_INACESSIVEL desde 22/Out, e o índice a recebeu em 23/Out: o buraco de COBERTURA fechou e o de PROVA continua aberto, como na Cygnal de 08/Out. 📌 A onda entrou com rótulo sem o espaço depois da barra, e a grafia foi declarada em casas.mjs no mesmo dia.',
  },
  {
    // ✅ PDF da onda aberto (HTTP 200, começa em %PDF-1.7) e lido com pdftotext.
    // 🔴 O ÍNDICE ERROU O CAMPO: gravou 19 a 26/Out, e o documento diz 19 a 20/Out.
    instituto: 'NPR/PBS/Marist University',
    campoInicio: '2026-10-19',
    campoFim: '2026-10-26',
    valores: '52/44',
    conferidoEm: '2026-10-27',
    resultado: 'CONFIRMA_PARCIAL',
    url: 'https://maristpoll.marist.edu/wp-content/uploads/2026/10/NPR_PBS-News_Marist-Poll_USA-NOS-and-Tables_202610211808AS.pdf',
    campoNaFonte: { inicio: '2026-10-19', fim: '2026-10-20' },
    confirmado: [
      'a PERGUNTA, USCNGS01: "If November\'s election for Congress were held today, which party\'s candidate are you more likely to vote for in your district", com as opções Democrat e Republican, sem nomes, então é generic ballot',
      'os VALORES entre prováveis votantes: "National Likely Voters" Democrat 52% e Republican 44%',
      'o campo `outros` em 5: Another party\'s candidate 2%, Vol: Unsure 1% e Vol: No response 2%, fechando em 101',
      'a MARGEM: "Results for likely voters are statistically significant within ±3.8 percentage points", idêntica',
      'a AMOSTRA em branco: os prováveis votantes são um PESO aplicado sobre os 1.289 registrados, sem n próprio, e o índice deixou o n vazio, que é o certo',
    ],
    naoConfirmado: [
      '🔴 o FIM DE CAMPO em 26/Out: o documento diz "conducted October 19th through October 20th, 2026" em todas as tabelas, e o nome do próprio PDF carrega 21/10. O índice gravou 26/Out',
    ],
    nota: '📅 Primeira entrada com `campoNaFonte`: a data errada do índice fazia o conferidor do agregador acusar o Marist de 19-20/Out como rodada FALTANDO, todo dia até a onda sair da janela. ⛔ O campoFim servido continua o do índice (26/Out), porque a casa não corrige o índice à mão. Efeito na média de hoje: nenhum; a data só pesa na BORDA, e esta onda sairia da janela em 20/Nov pela fonte e em 26/Nov pelo índice, as duas depois de 03/Nov. 🧬 A casa tem ondas anteriores como "Marist University" (15/Set e antes), hoje fora da janela.',
  },
  {
    instituto: 'NPR/PBS/Marist University',
    campoInicio: '2026-10-19',
    campoFim: '2026-10-26',
    valores: '52/42',
    conferidoEm: '2026-10-27',
    resultado: 'CONFIRMA_PARCIAL',
    url: 'https://maristpoll.marist.edu/wp-content/uploads/2026/10/NPR_PBS-News_Marist-Poll_USA-NOS-and-Tables_202610211808AS.pdf',
    campoNaFonte: { inicio: '2026-10-19', fim: '2026-10-20' },
    confirmado: [
      'os VALORES entre registrados: "National Registered Voters" Democrat 52% e Republican 42%, com outros 6 (2 + 1 + 3)',
      'a AMOSTRA de 1.289 registrados e a MARGEM de ±3,7, idênticas',
    ],
    naoConfirmado: ['🔴 o FIM DE CAMPO em 26/Out: o documento diz 19 a 20/Out'],
    nota: 'Recorte RV da mesma onda; a média usa o LV pela hierarquia LV > RV > A. Ver a entrada LV.',
  },
  {
    // ✅ Topline aberto (HTTP 200, começa em %PDF-1.7) e lido com pdftotext.
    instituto: 'Reuters/Ipsos',
    campoInicio: '2026-10-22',
    campoFim: '2026-10-26',
    valores: '53/44',
    conferidoEm: '2026-10-27',
    resultado: 'CONFIRMA',
    url: 'https://www.ipsos.com/sites/default/files/ct/news/documents/2026-10/Reuters%20Ipsos%20October%20Core%20Political%20Topline%2010.26%20release.pdf',
    confirmado: [
      'a PERGUNTA, TM3287Y24_Combined [Base: Likely Voters]: o candidato democrata ou republicano "in your district where you live", sem nomes, com a pergunta de seguimento para quem não sabe ("would you say you lean more to...")',
      'os VALORES: Democratic candidate/Lean 53% e Republican candidate/Lean 44%, coluna "Likely Voters (N=1,164)"',
      'o campo `outros` em 4: outro partido 2% e Skipped 2%',
      'a AMOSTRA de 1.164 prováveis votantes e a MARGEM de ±2,9 "for Likely Voters", idênticas',
      'o CAMPO: "Interview dates: October 22-26, 2026", idêntico',
    ],
    naoConfirmado: [],
    nota: '✅ CONFIRMA total. ⚠️ INSTRUMENTO: esta onda publica a versão "_Combined", que SOMA os que tendem a um lado. A onda de 16-19/Out (D 47 x R 35, RV) publicava a pergunta sem os leaners e deixava 19% fora dos dois partidos. Continua sendo generic ballot, como o da CBS, que também soma leaners; mas parte da diferença entre as duas ondas da casa é a pergunta de seguimento, e não o eleitorado. É também a primeira onda da casa com coluna LV para esta pergunta.',
  },
  {
    instituto: 'Reuters/Ipsos',
    campoInicio: '2026-10-22',
    campoFim: '2026-10-26',
    valores: '50/41',
    conferidoEm: '2026-10-27',
    resultado: 'CONFIRMA',
    url: 'https://www.ipsos.com/sites/default/files/ct/news/documents/2026-10/Reuters%20Ipsos%20October%20Core%20Political%20Topline%2010.26%20release.pdf',
    confirmado: [
      'os VALORES: coluna "Registered Voters (N=1,280)", Democratic candidate/Lean 50% e Republican candidate/Lean 41%',
      'o campo `outros` em 9: outro partido 3%, não pretende votar 3% e Skipped 3%',
      'a AMOSTRA de 1.280 e a MARGEM de ±2,8 "for Registered Voters", idênticas',
    ],
    naoConfirmado: [],
    nota: 'Recorte RV da onda acima; a média usa o LV pela hierarquia.',
  },
  {
    // ✅ PDF aberto (HTTP 200, começa em %PDF-1.5) e lido com pdftotext.
    instituto: 'CBS News/YouGov',
    campoInicio: '2026-10-21',
    campoFim: '2026-10-23',
    valores: '53/45',
    conferidoEm: '2026-10-27',
    resultado: 'CONFIRMA',
    url: 'https://assets1.cbsnewsstatic.com/hub/cms/prod_cms_alt/file/2026/10/25/8ad451c3-2d1f-4f7f-a3c8-97f923271e92/cbsnews_20261025_sun.pdf',
    confirmado: [
      'a PERGUNTA 9: "[If the election for U.S. House of Representatives were being held today/In the election for U.S. House of Representatives,] who [would/did] you vote for in the district where you live?", com as opções "Democratic candidate" e "Republican candidate", sem nomes, então é generic ballot',
      'o RECORTE e os VALORES: "Among likely voters, including those leaning toward a Democratic or Republican candidate", Democratic candidate 53% e Republican candidate 45%',
      'o campo `outros` em 1: Other 1%, Not sure 0% e Nonvoter 0%, fechando a coluna em 99',
      'a AMOSTRA: "Weighted N (1,749)" na coluna total das tabelas de prováveis votantes, idêntico ao 1.749 LV do índice',
      'o CAMPO: "CBS News Poll – October 21–23, 2026" e "conducted between October 21-23, 2026", idêntico',
    ],
    naoConfirmado: [],
    nota: '✅ CONFIRMA total. 📌 A margem de ±2,6 que o documento declara é a da amostra inteira de 2.355 ADULTOS, e ele não declara margem para o subgrupo de prováveis votantes; o índice deixou a margem desta linha em branco, que é o comportamento honesto, então não há número a confirmar nem a refutar ali. 🧬 O índice escreveu a casa como "CBS/YouGov" nesta onda, e a grafia foi declarada em casas.mjs no mesmo dia, porque sem ela a média contava a casa duas vezes na contagem de institutos.',
  },
  {
    // ✅ Planilha de dados da onda aberta (HTTP 200, começa em PK, é um .xlsx),
    //    linkada no próprio post do blog como "Data tables for this survey".
    instituto: 'Focaldata',
    campoInicio: '2026-10-16',
    campoFim: '2026-10-20',
    valores: '53/44',
    conferidoEm: '2026-10-27',
    resultado: 'CONFIRMA',
    url: 'https://landing.focaldata.com/hubfs/Marketing%20content/Focaldata_US_Midterms_Poll_Oct2026_wave2_all.xlsx',
    confirmado: [
      'a PERGUNTA, Q66: "In the elections for the U.S. Congress (House of Representatives) on November 3rd, who do you intend to vote for in the district where you live?", com as opções "The Democratic Party candidate" e "The Republican Party candidate", sem nomes, então é generic ballot; a aba "Headline results" a chama de "House generic ballot"',
      'o RECORTE e os VALORES: na coluna "Likely voters" da aba "Headline results", Democratic 53,03% e Republican 43,99%, que arredondam para os 53 e 44 do índice',
      'o campo `outros` em 3: "Other" 2,99% na mesma coluna',
      'a AMOSTRA: "Sample size (n)" 1.594 na coluna de prováveis votantes, idêntico ao índice',
      'a MARGEM: "Margin of error (95%)" 0,0296 na mesma coluna, ou seja ±2,96, que o índice arredonda para ±3',
      'o CAMPO: "Fieldwork dates 16-20 October 2026", idêntico, e o post do blog repete "Fieldwork was conducted between 16 and 20 October 2026"',
    ],
    naoConfirmado: [],
    nota: '✅ CONFIRMA total, a primeira da casa: a onda de 02-05/Out ficou em CONFIRMA_PARCIAL porque o post daquela onda só dava a margem em pontos, e esta traz a planilha. 📌 O post diz "a sample size of 1,845 US adults", que é o total; o 1.594 é o n da coluna de prováveis votantes, igual ao da coluna "Registered voters (excl. WNV)", porque o LV aqui é ponderação sobre a mesma base e não subamostra. A planilha traz também as colunas de adultos (49,1 x 40,0) e de eleitores registrados (50,8 x 41,4), e a média usa o LV pela hierarquia LV > RV > A.',
  },
  {
    // ✅ PDF de resultados aberto (HTTP 200, começa em %PDF-1.7) e lido com pdftotext.
    instituto: 'Harvard/Harris Poll/HarrisX',
    campoInicio: '2026-10-24',
    campoFim: '2026-10-26',
    valores: '52/48',
    conferidoEm: '2026-10-29',
    resultado: 'CONFIRMA',
    url: 'https://harvardharrispoll.com/assets/uploads/2026/09/HHP_Oct2026_KeyResults.pdf',
    confirmado: [
      'a PERGUNTA, CON2026B: "If the congressional election were held today would you be more likely to vote for a Democrat or a Republican for Congress?", sem nomes, então é generic ballot',
      'o RECORTE e os VALORES: "Among Likely Voters", Democrat 52% e Republican 48%, com o título "Dem + 4"',
      'o CAMPO: "Field Dates: October 24-26, 2026", idêntico',
    ],
    naoConfirmado: [],
    nota: '✅ CONFIRMA total. 📌 O estudo é de 2.700 ELEITORES REGISTRADOS com margem de ±1,9 para a amostra inteira; o documento não publica n nem margem para o subgrupo de prováveis votantes, e o índice deixou amostra, margem e outros em branco, que é o comportamento honesto. A pergunta força a escolha entre os dois partidos, por isso a soma fecha em 100. ⚠️ O caminho do PDF diz "2026/09" e o arquivo é a onda de OUTUBRO: a pasta é do sistema de upload da casa, não a data do campo.',
  },
  {
    // ✅ Comunicado do patrocinador aberto (HTTP 200) e topline aberto
    //    (HTTP 200, começa em %PDF-1.4), lido com pdftotext.
    instituto: 'Echelon Insights',
    campoInicio: '2026-10-16',
    campoFim: '2026-10-23',
    valores: '51/46',
    conferidoEm: '2026-10-29',
    resultado: 'CONFIRMA_PARCIAL',
    url: 'https://netchoice.org/wp-content/uploads/2026/10/NetChoice-October-2026-Antitrust-Tech-Survey-Topline.pdf',
    confirmado: [
      'a PERGUNTA 7, QGenericCongressional: "If the election for Congress were held today and you had to make a choice, for whom would you vote?", com seguimento QGenericCongressionalLeaner para quem não escolheu ("the Republican candidate or the Democratic candidate"), sem nomes, então é generic ballot',
      'os VALORES na coluna Total: DEFINITELY/PROBABLY/LEAN THE DEMOCRATIC CANDIDATE 51% e REPUBLICAN 46%',
      'a AMOSTRA: "N=3,644 voters in likely electorate nationally, with a base sample of 1,004 voters" e oversamples em 6 estados, que o comunicado diz serem "weighted down to the proportion in the population"; o 3.644 LV do índice é o n declarado do total nacional',
      'a MARGEM: "±3.2 percentage points nationally", idêntica',
      'o CAMPO: "from October 16 to 23, 2026", idêntico',
    ],
    naoConfirmado: [
      'o campo `outros` em 3: a fonte publica "Unsure 4%", e 51 + 46 + 4 fecha em 101 por arredondamento. O 3 do índice é 100 menos D e R, não um número publicado. Campo secundário, sem efeito na vantagem',
    ],
    nota: '🔎 Esta é a onda NetChoice, que a passada de 27/Out listou como lacuna sem diagnóstico (Echelon 16-23/Out, 3.644 LV). Ela entrou pelo índice em 28/Out e a lacuna fechou sozinha. ⚠️ Não confundir com a Echelon de 15-19/Out (1.010 LV), outra onda que o agregador tem e o índice não. 📌 A pergunta SOMA os leaners ("LEAN THE ... CANDIDATE" 1% e *%), e a linha do índice traz `comLeaners: false`; o campo não entra em conta nenhuma hoje.',
  },
  {
    // ✅ Post aberto (HTTP 200) e planilha de toplines baixada pelo link do
    //    próprio post (Google Drive, HTTP 200, começa em PK, é um .xlsx).
    instituto: 'Prolific',
    campoInicio: '2026-10-21',
    campoFim: '2026-10-22',
    valores: '53/42',
    conferidoEm: '2026-10-29',
    resultado: 'CONFIRMA_PARCIAL',
    url: 'https://docs.google.com/spreadsheets/d/1MsvLv0UnkXC4EyEKjAvpcc5iuTMpiB-k/edit',
    confirmado: [
      'a PERGUNTA: a aba "A1 Headline" se chama "House vote intention (generic congressional ballot)", e a nota diz que quem respondeu "Not sure" foi perguntado sobre o partido a que tende e contado com ele',
      'o RECORTE e os VALORES: linha "Likely voters", Democrat 52,59% e Republican 41,87%, que arredondam para os 53 e 42 do índice; o post repete "Democrats at 53% and Republicans at 42% among likely voters"',
      'a AMOSTRA de 713: é o n PONDERADO dos prováveis votantes, porque o modelo fixa o comparecimento em 47% dos 1.518 entrevistados (0,47 × 1.518 = 713). A planilha publica o n não ponderado (1.518) e o efetivo (856), e define o ponderado como "weight × probability of voting"',
      'o CAMPO: "October 21–22, 2026", idêntico',
    ],
    naoConfirmado: [
      'o campo `outros` em 5: a fonte publica "Other / not sure / won\'t vote" 5,54%, que arredonda para 6. O 5 do índice é 100 menos D e R. Campo secundário, sem efeito na vantagem',
    ],
    nota: '🆕 Casa nova na base, um painel online de pesquisa acadêmica e comercial. 📌 A peça declara que o resultado vai de cerca de D+5 a D+15 conforme as escolhas de ponderação e de modelo de comparecimento, e publica a escolha preferida (D+10,7 LV). O índice tabulou a preferida, e é ela que entra. ⚠️ O LV aqui NÃO é subamostra: todo entrevistado entra com a sua probabilidade de votar, então o n "maior" do LV (1.518) contra o RV (1.329) não é erro.',
  },
  {
    instituto: 'Prolific',
    campoInicio: '2026-10-21',
    campoFim: '2026-10-22',
    valores: '50/40',
    conferidoEm: '2026-10-29',
    resultado: 'CONFIRMA_PARCIAL',
    url: 'https://docs.google.com/spreadsheets/d/1MsvLv0UnkXC4EyEKjAvpcc5iuTMpiB-k/edit',
    confirmado: [
      'os VALORES: linha "Registered voters", Democrat 50,30% e Republican 39,68%, que arredondam para 50 e 40; o post diz "Democrats at 50% and Republicans at 40% among registered voters"',
      'a AMOSTRA de 1.118: o n PONDERADO, porque os registrados são 73,62% dos adultos na ponderação (0,7362 × 1.518 = 1.118). O não ponderado publicado é 1.329',
      'o campo `outros` em 10: "Other / not sure / won\'t vote" 10,02%',
    ],
    naoConfirmado: [
      'a MARGEM: a fonte publica ±2,4 para a parcela democrata e ±4,2 para a diferença, e o índice deixou a margem em branco; não há um número único a confirmar',
    ],
    nota: 'Recorte RV da onda acima; a média usa o LV pela hierarquia.',
  },
  {
    // ✅ Matéria do PATROCINADOR aberta (HTTP 200). A Deseret News é coautora da
    //    pesquisa, junto do Hinckley Institute, e a Morning Consult executa.
    instituto: 'Morning Consult',
    campoInicio: '2026-10-13',
    campoFim: '2026-10-20',
    valores: '48/42',
    conferidoEm: '2026-10-29',
    resultado: 'CONFIRMA_PARCIAL',
    url: 'https://www.deseret.com/politics/2026/10/27/voters-confidence-trump-approval-iran-war-midterms/',
    confirmado: [
      'os VALORES nacionais: "Democrats are faring better nationally, topping Republicans 48% to 42% on a generic ballot", numa pesquisa "Deseret News/Hinckley Institute of Politics poll conducted by Morning Consult"',
      'a AMOSTRA, o RECORTE e a MARGEM: "the national poll surveyed 2,050 registered voters with a margin of error of 2 percentage points", idênticos',
      'o CAMPO: "between Oct. 13-20", idêntico',
    ],
    naoConfirmado: [
      'a redação da PERGUNTA: a matéria só a chama de "generic ballot", e não publica o texto nem o topline',
      'o campo `outros` em 10: a matéria não decompõe o resto',
    ],
    nota: '⚠️ A mesma matéria traz a amostra de UTAH (875 RV, R 50 x D 39), que é outro universo e não entra. 📌 Esta rodada é encomenda de veículo e é PÚBLICA; não é o tracker pago da casa, que segue fora do conferidor de defasagem por desenho.',
  },
  {
    // ✅ Página aberta (HTTP 200) e topline aberto pelo link "Download Toplines"
    //    (HTTP 200, começa em %PDF-1.4), lido com pdftotext.
    instituto: 'The Rainey Center',
    campoInicio: '2026-10-14',
    campoFim: '2026-10-20',
    valores: '52/44',
    conferidoEm: '2026-10-29',
    resultado: 'CONFIRMA_PARCIAL',
    url: 'https://cdn.prod.website-files.com/663a60b91deeae06e8ae1d1c/6ae1465ac44e704850db0357_Rainey_Center_October_Toplines_Final_Site.pdf',
    confirmado: [
      'a PERGUNTA, Q5: "If the 2026 Congressional elections were held today, would you vote for the Republican or Democratic candidate?", sem nomes, então é generic ballot',
      'os VALORES: Definitely 41% + Probably 11% Democratic = 52, e Definitely 32% + Probably 12% Republican = 44',
      'a AMOSTRA, o RECORTE, a MARGEM e o CAMPO: "1,279 registered voters via online panel from October 14 to October 20, 2026", "±3.6 percentage points", idênticos',
    ],
    naoConfirmado: [
      'o campo `outros` em 4: a fonte publica "I would not vote" 2% e "Not sure" 3%, que somam 5, e 52 + 44 + 5 fecha em 101 por arredondamento. O 4 do índice é 100 menos D e R. Campo secundário, sem efeito na vantagem',
    ],
    nota: '🔎 O n de 1.279 RV é IGUAL ao da Reuters/Ipsos de 16-19/Out, e isso pedia conferência antes de aceitar como coincidência: o topline da Rainey declara 1.279 por conta própria, em todas as perguntas. São duas pesquisas diferentes com o mesmo n. 🆕 Casa nova na janela. 📌 A pergunta não tem seguimento para indecisos ("Probably" não é leaner), e a linha do índice traz `comLeaners: true`; o campo não entra em conta nenhuma hoje.',
  },
  {
    // 🔒 O host da Cygnal recusa o leitor INTEIRO, como em 08 e 29/Out: o PDF
    //    citado pelo índice devolve 403 com a página de erro.
    instituto: 'Cygnal (R)',
    campoInicio: '2026-10-23',
    campoFim: '2026-10-24',
    valores: '52/43',
    conferidoEm: '2026-10-30',
    resultado: 'FONTE_INACESSIVEL',
    url: 'https://www.cygn.al/wp-content/uploads/2026/10/Cygnal-National-Late-Oct26-NVT-Deck-Public.pdf',
    acesso: {
      status: 403,
      hostTodo: true,
      medidoEm: '2026-10-30',
      controlePositivo:
        'no mesmo cliente e no mesmo minuto (00:21Z), poll.qu.edu/robots.txt devolveu 200 e claritycampaigns.com devolveu 200, enquanto o PDF em www.cygn.al devolveu 403 com 5.972 bytes começando em <!DOCTYPE html>',
      observado:
        'não forjei user-agent. Em 29/Out a raiz, /insights/ e o robots.txt do mesmo host já davam 403 (buraco-conhecido.mjs)',
    },
    confirmado: [],
    naoConfirmado: [
      'o topline D 52 x R 43 e a vantagem de D+9',
      'o recorte de 1.500 prováveis votantes e a margem de ±2,5',
      'o campo de 23 a 24/Out/2026',
      'o `outros` em 5',
    ],
    nota: '⛔ Nada foi alterado e a linha segue valendo pelo índice, com a procedência declarada. Estava em buraco-conhecido como FONTE_INACESSIVEL em 29/Out, e o índice a recebeu em 30/Out: o buraco de COBERTURA fechou e o de PROVA continua aberto, como nas ondas de 02/Out e 10/Out da mesma casa.',
  },
  {
    // ✅ PDF público da onda aberto (HTTP 200, começa em %PDF, 95 páginas),
    //    achado no HTML da página citada pelo índice. Os gráficos são IMAGEM:
    //    o texto extraído traz só o método, e os valores se leem renderizando.
    instituto: 'Clarity Campaign Labs',
    campoInicio: '2026-10-15',
    campoFim: '2026-10-21',
    valores: '52/44',
    conferidoEm: '2026-10-30',
    resultado: 'CONFIRMA_PARCIAL',
    url: 'https://clarity-public-web.s3.us-east-1.amazonaws.com/Clarity+Omnibus+Overview+-+October+2026+-+PUBLIC.pdf',
    confirmado: [
      'o CAMPO: "conducted from October 15-21st via national online public opinion panels", idêntico',
      'a AMOSTRA e a MARGEM: "1,016 respondents were matched to the voter file. The margin of error of this poll is +/-3.1%", idênticas',
      'o RECORTE: "weighted to a national universe of likely 2026 General election voters", o que sustenta o LV do índice',
      'a PERGUNTA é generic ballot com leaners: a página 37 cruza a motivação para votar com a "Generic Vote Choice (w/ Leaners)", com as opções "Republican candidate" e "Democratic candidate", sem nomes',
    ],
    naoConfirmado: [
      'o topline D 52 x R 44: a página com o total não estava entre as 12 renderizadas e lidas (5 a 7, 18, 29 a 31, 33, 35 a 37), e o texto extraído não traz o valor',
      'o `outros` em 5',
    ],
    nota: '📌 A página citada pelo índice (claritycampaigns.com/clarity-omnibus-2026-oct) é montada no cliente e o texto dela não tem números; o PDF está num link de S3 dentro do HTML. Estava em buraco-conhecido como FONTE_NAO_LOCALIZADA em 29/Out, por eu ter lido a página de go.claritycampaigns.com, que não traz o PDF.',
  },
]

/** Vereditos em que o documento FOI lido, então `acesso` ali é contradição. */
const LIDOS = ['CONFIRMA', 'CONFIRMA_PARCIAL', 'NAO_CONTEM_A_PERGUNTA']
/** Vereditos que não podem confirmar coisa nenhuma. */
const SEM_CONFIRMACAO = ['NAO_CONTEM_A_PERGUNTA', 'NAO_ENCONTRADO', 'FONTE_INACESSIVEL']

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
    if (SEM_CONFIRMACAO.includes(e.resultado) && e.confirmado.length)
      erros.push(`${onde}: ${e.resultado} não pode confirmar nada`)
    if (e.resultado === 'FONTE_INACESSIVEL') {
      // ⛔ A prova aqui não é o conteúdo, que ninguém leu: é a MEDIÇÃO do acesso.
      if (!e.acesso || typeof e.acesso.status !== 'number' || !e.acesso.medidoEm)
        erros.push(`${onde}: FONTE_INACESSIVEL exige acesso com status numérico e medidoEm`)
      else if (!e.acesso.controlePositivo)
        erros.push(`${onde}: FONTE_INACESSIVEL exige controlePositivo: 403 de bloqueio é igual a 403 de leitor quebrado`)
      if (!e.naoConfirmado.length)
        erros.push(`${onde}: FONTE_INACESSIVEL tem de dizer o que fica SEM confirmação`)
    } else if (e.acesso && LIDOS.includes(e.resultado)) {
      // 🕳️ O jeito silencioso de este veredito se espalhar é alguém anexar
      // `acesso` a uma entrada cujo documento FOI lido, e aí o registro passa a
      // declarar bloqueio sobre página que abriu.
      erros.push(`${onde}: ${e.resultado} quer dizer que o documento FOI lido, e acesso descreve documento que não abriu`)
    }
    // 📅 O CAMPO QUE A FONTE DECLARA, quando contradiz o do índice (27/Out/2026).
    //    Só quem LEU o documento pode afirmar a data dele, e declarar a mesma
    //    data do índice não diz nada: as duas coisas reprovam a carga.
    if (e.campoNaFonte !== undefined) {
      const c = e.campoNaFonte
      const iso = (x) => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x)
      if (!['CONFIRMA', 'CONFIRMA_PARCIAL'].includes(e.resultado))
        erros.push(`${onde}: campoNaFonte exige documento LIDO e confirmado em parte, não ${e.resultado}`)
      else if (!c || !iso(c.inicio) || !iso(c.fim) || c.inicio > c.fim)
        erros.push(`${onde}: campoNaFonte precisa de inicio e fim no formato AAAA-MM-DD, com inicio <= fim`)
      else if (c.inicio === e.campoInicio && c.fim === e.campoFim)
        erros.push(`${onde}: campoNaFonte igual ao campo do índice não declara divergência nenhuma`)
    }
  })
  return erros
}

/**
 * O FIM DE CAMPO que o documento do instituto declara, quando a conferência
 * registrou que ele difere do índice. `null` se não houver conferência, se ela
 * caducou (o índice reescreveu os valores) ou se ela não declarou divergência.
 *
 * ⛔ Não corrige nada no arquivo servido: o `campoFim` da linha continua o do
 * índice. Serve a quem PAREIA rodadas por data, como o conferidor do agregador,
 * para a data errada do índice não abrir um buraco falso todo dia.
 */
export function campoFimNaFonte(poll, registro = FONTE_CONFERIDA) {
  return fonteDa(poll, registro)?.campoNaFonte?.fim ?? null
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
