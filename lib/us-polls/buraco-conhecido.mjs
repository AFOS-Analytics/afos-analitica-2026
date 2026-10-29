/**
 * BURACO JÁ DIAGNOSTICADO: a rodada que o agregador tem, a nossa base não, e
 * que alguém JÁ investigou, com prova e data.
 *
 * ─── O DEFEITO QUE ELE MATA ─────────────────────────────────────────────────
 *
 * 🔴 O passo 7.5 imprime "N rodadas que o agregador tem e a nossa base NÃO", e
 *    ele imprime a MESMA lista todo dia, em branco. Em 16/Out eu gastei a
 *    conferência inteira da AP-NORC; em 17/Out, a da Change Research; e as duas
 *    voltariam amanhã sem uma palavra do que já se sabe sobre elas.
 *
 * 📌 É o mesmo defeito que criou o `fonte-conferida.mjs`: sem registro, a
 *    próxima passada busca o mesmo documento, tropeça no mesmo bloqueio e chega
 *    à mesma conclusão gastando o mesmo tempo.
 *
 * ─── A DIFERENÇA PARA O `instrumento-medido.mjs`, e ela é o ponto ───────────
 *
 * ⛔ Aquele registro REMOVE a rodada da contagem de buraco, porque a rodada
 *    mede outra coisa e nunca foi nossa para ter. Este aqui **NÃO REMOVE
 *    NADA**. O buraco segue contado como buraco; o que muda é que ele passa a
 *    sair com o diagnóstico ao lado.
 *
 * 🔑 **Anotar não é silenciar**, e a fronteira entre as duas coisas é a razão
 *    de serem dois arquivos. Um buraco que some porque alguém o explicou uma
 *    vez é pior que um buraco barulhento: o barulhento ainda é verdade.
 *
 * ─── E TODO DIAGNÓSTICO VENCE ───────────────────────────────────────────────
 *
 * ⏳ `revisarApos` é OBRIGATÓRIO. Um 429 é limite de taxa e é temporário por
 *    natureza; uma fonte não localizada hoje pode ser publicada amanhã. Depois
 *    da data o diagnóstico sai como **VENCIDO** e manda reconferir, em vez de
 *    ser acreditado para sempre.
 *
 * 📌 E a caducidade pela ENTRADA vem de graça: este registro só é consultado
 *    para rodada que está FALTANDO. No dia em que o índice a receber, ninguém
 *    pergunta mais por ela.
 */

import { serieDaCasa } from './casas.mjs'

const FORMA_ISO = /^\d{4}-\d{2}-\d{2}$/

/**
 * 🏷️ As situações DECLARADAS, com o que cada uma manda a próxima passada fazer.
 *
 * ⛔ Não existe padrão: situação fora desta tabela reprova a carga e a entrada
 *    fica INERTE, porque diagnóstico que ninguém sabe ler não é diagnóstico.
 */
export const SITUACOES = {
  FONTE_INACESSIVEL: {
    descricao: 'o documento da casa foi localizado e o host recusa a leitura',
    acao: 'NÃO procurar de novo no mesmo caminho até a data de revisão; o bloqueio não se resolve insistindo',
    exigeAcesso: true,
  },
  FONTE_NAO_LOCALIZADA: {
    descricao: 'a publicação da própria casa não foi encontrada, só o registro do agregador',
    acao: 'procurar de novo na data de revisão, por outro caminho que não o já tentado',
    exigeAcesso: false,
  },
  FONTE_SEM_A_PERGUNTA: {
    descricao: 'a publicação da casa foi LOCALIZADA, ABRIU e foi lida, e ela não publica esta pergunta para esta onda',
    acao: 'NÃO procurar de novo no mesmo caminho, que já foi lido. O buraco segue contado contra o AGREGADOR, cujo número não tem publicação atrás dele',
    exigeLeitura: true,
  },
  AGUARDANDO_INDICE: {
    descricao: 'a rodada existe, é generic ballot e está conferida, e o índice simplesmente ainda não a recebeu',
    acao: 'nada a fazer: esperar o índice, ou levar a ingestão curada ao André',
    exigeAcesso: false,
  },
}

/**
 * @type {{casa: string, campoInicio: string, campoFim: string, amostra?: number, recorte?: string, situacao: keyof typeof SITUACOES, medidoEm: string, revisarApos: string, acesso?: object, leitura?: object, nota: string}[]}
 */
export const BURACOS_CONHECIDOS = [
  {
    // 🔴 A casa NÃO tem UMA linha em 495, e desta vez o buraco é REAL: ela
    //    publica generic ballot nacional. Fontes secundárias dão 2.021
    //    eleitores registrados, campo de 15 a 24/Set, D+7 no agregado.
    //
    // ⛔ Mas resumo de busca NÃO É NEM ÍNDICE, então o número não entra e a
    //    conferência fica aberta. O que impede fechá-la é o acesso.
    //
    // 🧪 Medido em 17/Out com controle positivo: o artigo E a raiz devolvem
    //    429, enquanto emersoncollegepolling.com e poll.qu.edu respondem 200 no
    //    mesmo cliente e no mesmo minuto. Não é o nosso leitor.
    //
    // ⚠️ E o `curl -o` GRAVOU no 429: 34.218 bytes começando em `<!DOCTYPE`,
    //    que é a página de erro. Conferir o download pelo tamanho diria que deu
    //    certo. Conferir os PRIMEIROS BYTES.
    //
    // ⏳ 429 é limite de taxa, não política: por isso a revisão é curta.
    casa: 'Change Research',
    campoInicio: '2026-09-15',
    campoFim: '2026-09-24',
    amostra: 2021,
    recorte: 'RV',
    situacao: 'FONTE_INACESSIVEL',
    medidoEm: '2026-10-17',
    revisarApos: '2026-10-20',
    acesso: {
      status: 429,
      hostTodo: true,
      medidoEm: '2026-10-17',
      controlePositivo:
        'no mesmo cliente e no mesmo minuto, emersoncollegepolling.com devolveu 200 e poll.qu.edu/robots.txt devolveu 200, enquanto changeresearch.com devolveu 429 tanto no artigo quanto na RAIZ',
      observado:
        '429 e limite de taxa, nao recusa de politica: ele e temporario por natureza e nao se resolve insistindo, entao a revisao e curta e o veredito NAO vira permanente',
    },
    // ✅ RESOLVIDA EM 18/OUT, e pelo caminho que esta ficha prevê: a rodada
    //    ENTROU pelo índice sozinha, com D 46 x R 39 sobre 2.021 RV, e o
    //    registro parou de ser consultado para ela sem ninguém tocar em nada.
    //    É a caducidade por ENTRADA funcionando.
    //
    // 🔴 A entrada FICA aqui, e não é apagada, por dois motivos: ela guarda o
    //    histórico de acesso, e se o índice um dia retirar a rodada o buraco
    //    volta com o diagnóstico à mão, já VENCIDO, o que manda reconferir.
    //
    // ⛔ O buraco de COBERTURA fechou e o de PROVA não: o host seguia em 429 em
    //    18/Out e a linha agora é SERVIDA. A dívida mudou de registro e vive em
    //    `fonte-conferida.mjs`, no mesmo arco da Cygnal de 02/Out.
    nota: '✅ RESOLVIDA em 18/Out: a rodada entrou pelo índice e a casa deixou de estar em zero linhas. ⛔ Mas o acesso não melhorou e a linha agora é servida, então a dívida de prova migrou para fonte-conferida.mjs. 📌 Mantida aqui pelo histórico de acesso e para o caso de o índice retirar a rodada.',
  },
  {
    // 🔎 Aqui a casa EXISTE na base, com duas ondas do mesmo tamanho (12-16/Ago
    //    e 01-04/Jun, as duas ~2.500 RV), e o índice não recebeu a de outubro.
    //
    // ⛔ Em 16/Out isto era `FONTE_NAO_LOCALIZADA`: o blog da casa lista só
    //    pesquisas ESTADUAIS (Arizona, Nevada, Utah, Califórnia) e a nacional
    //    não aparece nele. A ficha mandou tentar, na revisão, a listagem de
    //    IMPRENSA da casa em vez do blog.
    //
    // ✅ 19/Out: o caminho estava nas NOSSAS PRÓPRIAS LINHAS. As duas ondas que
    //    já servimos citam `thecentersquare.com` como fonte primária, e é lá
    //    que a parceria publica: The Center Square Voters' Voice Poll, com a
    //    Noble Predictive Insights a campo. A fonte não estava escondida, estava
    //    no campo `fontePrimaria` das linhas da própria casa.
    //
    // 🧪 E a onda de outubro EXISTE: campo "Oct. 5-7", n=2.527, publicada em 5
    //    matérias de 14 a 19/Out (data centers, inflação, prévias de 2028).
    //    Então o diagnóstico de "não localizada" caducou pela medição, e não
    //    pelo prazo.
    //
    // 🔴 O que NÃO existe é a pergunta. A série de generic ballot da parceria é
    //    um gráfico Datawrapper no painel, `EahTR`, titulado "Congressional
    //    Race", e o dado dele termina em **Ago/2026 com R 42% x D 47%**, que é
    //    exatamente a onda de 12-16/Ago que já está na nossa base. Não há ponto
    //    de outubro. E nas 5 matérias toda menção a Congresso é contexto
    //    editorial, nunca pergunta de pesquisa.
    //
    // ⚠️ E isto é o achado que fecha o caso: o D 47 x R 42 que circula para a
    //    onda de OUTUBRO é idêntico, dígito por dígito, ao da onda de AGOSTO
    //    que já servimos. O n difere (2.527 contra 2.533), então o agregador
    //    tem registro de onda própria e o número dela não tem publicação
    //    atrás. ⛔ Isso NÃO prova arrasto de valor, e afirmar que prova seria
    //    inventar medição: prova que o valor é indistinguível do que já temos.
    //
    // 🕳️ DEFEITO MEU, no caminho: a primeira varredura do painel listou 7
    //    títulos e NÃO trouxe o "Congressional Race", porque o meu regex exigia
    //    20 caracteres e ele tem 18. O filtro que eu escrevi para achar escondeu
    //    justamente o que eu procurava, e por um minuto eu quase escrevi que a
    //    pergunta não estava publicada em lugar nenhum.
    casa: 'Noble Predictive',
    campoInicio: '2026-10-05',
    campoFim: '2026-10-07',
    amostra: 2527,
    recorte: 'RV',
    //
    // 🔁 29/Out/2026: o diagnóstico de 19/Out CADUCOU, e a revisão existia para
    //    isto. O gráfico ganhou versões: a /1/ termina em Ago/2026; a /2/ traz
    //    "Aug 2026" DUAS vezes; a /3/ renomeia a segunda para "Oct 2026", com
    //    R 42% x D 47%. A /4/ dá 404, então a /3/ é a publicada.
    casa: 'Noble Predictive',
    campoInicio: '2026-10-05',
    campoFim: '2026-10-07',
    amostra: 2527,
    recorte: 'RV',
    situacao: 'AGUARDANDO_INDICE',
    medidoEm: '2026-10-29',
    revisarApos: '2026-11-01',
    nota: '🔁 Reconferido em 29/Out/2026, 00:17Z: a série "Congressional Race" da casa (https://datawrapper.dwcdn.net/EahTR/3/dataset.csv, HTTP 200) passou a trazer "Oct 2026" com The Republican Candidate 42% e The Democratic Candidate 47%, sem nomes. O D 47 x R 42 do agregador agora TEM publicação atrás, e o buraco passa a ser do índice. Campo "Oct. 5-7" e n=2.527 vêm das 5 matérias do veículo lidas em 19/Out; o recorte RV é do agregador e não foi lido na fonte. ⚠️ O ponto de outubro tem os MESMOS valores do de agosto (onda de 12-16/Ago, que já servimos), e o histórico das versões mostra a linha de agosto duplicada na /2/ e renomeada na /3/. Isso NÃO prova arrasto de valor; prova que a publicação veio por edição da linha de agosto, e o número segue indistinguível do de agosto. Histórico: em 19/Out era FONTE_SEM_A_PERGUNTA, com leitura de 7 endereços (painel thecentersquare.com/polls, EahTR/1 e 5 matérias).',
  },
  // 📅 21/Out/2026: as QUATRO rodadas abaixo entraram no agregador no mesmo dia,
  //    todas marcadas "Added Oct 21", a partir de matérias publicadas no dia.
  //    Não é atraso acumulado do índice: é o intervalo normal entre publicar e
  //    tabular. Conferidas na véspera para que a entrada, quando vier, já
  //    chegue sabendo o que a fonte sustenta. Revisão curta, porque o índice
  //    costuma absorver em 24h (os três buracos de 20/Out entraram assim).
  {
    // ✅ Topline aberto: [QGenericCongressional], "If the election for Congress
    //    were held today and you had to make a choice, for whom would you vote?",
    //    opções "the Republican candidate" e "the Democratic candidate", sem
    //    nomes. O total DEFINITELY/PROBABLY/LEAN dá D 50 x R 45.
    //
    // 🔎 E uma propriedade nova do instrumento: quem JÁ VOTOU responde a
    //    [QGenericHouseVoted], e a resposta é RECODIFICADA para dentro da
    //    QGenericCongressional. Continua sendo generic ballot, sem nomes, mas o
    //    número mistura intenção com voto já dado.
    casa: 'Echelon Insights',
    campoInicio: '2026-10-15',
    campoFim: '2026-10-19',
    amostra: 1010,
    recorte: 'LV',
    situacao: 'AGUARDANDO_INDICE',
    medidoEm: '2026-10-29',
    revisarApos: '2026-11-01',
    nota: '🔁 Reconferido em 29/Out/2026, 00:17Z: o topline segue no ar (HTTP 200, começa em %PDF, "N=1,010" e "October 15-19, 2026" relidos), controle positivo poll.qu.edu/robots.txt 200 no mesmo minuto, e o índice segue SEM a rodada (517 linhas lidas). ⚠️ Não confundir com a onda NetChoice da mesma casa (16-23/Out, 3.644 LV), que o índice recebeu em 28/Out. 🔁 Reconferido em 24/Out/2026, 19:43Z: a fonte segue no ar (HTTP 200, primeiros bytes conferidos, controle positivo poll.qu.edu/robots.txt 200 no mesmo minuto) e o índice segue SEM a rodada (500 linhas lidas). Diagnóstico de 21/Out mantido. ✅ Conferida no topline da casa (https://echeloninsights.com/hubfs/_Media%20for%20Insights%20Blog/October%202026%20-%20Voter%20Omnibus%20Topline%20-%20External.pdf): N=1.010 "voters in the Likely Electorate", campo 15-19/Out, ±3,6, D 50 x R 45 com leaners, terceiro partido 1, unsure 5. Generic, sem nomes. 📌 Quem já votou entra recodificado de QGenericHouseVoted, o que é novo nesta fase da campanha e vale anotar na ficha quando a linha entrar.',
  },
  {
    // ✅ Matéria da CNN aberta (HTTP 200). A onda é NOVA: o n=1.206 do
    //    agregador é IGUAL ao da onda de setembro, mas lá 1.206 era a amostra
    //    TOTAL e aqui é o subgrupo de eleitores REGISTRADOS, sobre 1.701
    //    adultos. Mesmo número, grandezas diferentes.
    casa: 'CNN/SSRS',
    campoInicio: '2026-10-15',
    campoFim: '2026-10-18',
    amostra: 1206,
    recorte: 'RV',
    situacao: 'AGUARDANDO_INDICE',
    medidoEm: '2026-10-21',
    revisarApos: '2026-10-23',
    nota: '✅ Conferida na matéria (https://edition.cnn.com/2026/10/21/politics/cnn-poll-trump-democrats-republicans-midterms): "conducted by SSRS from October 15-18 among a random national sample of 1,701 US adults ... including 1,206 registered voters", margem ±3,3 entre RV, e "Democrats\' 49% to 39% advantage among registered voters". A pergunta é pelo candidato do partido "in their district", sem nomes. ⚠️ O residual de 12 não está decomposto na matéria; o topline da SSRS é a fonte a procurar, porque a CNN costuma recusar leitor automatizado e hoje abriu.',
  },
  {
    // ✅ Post da Strength In Numbers aberto (HTTP 200, gelliottmorris.com). A
    //    casa publica DOIS recortes: RV 52 x 41 e LV 54 x 42. O agregador
    //    tabula o LV, que é o que a régua LV > RV > A prefere.
    //
    // ⚠️ O post lido é a PRÉVIA pública: ela traz os valores e a pergunta e
    //    NÃO traz campo nem amostra. O 13-19/Out e o 1.824 são do agregador.
    casa: 'Verasight',
    campoInicio: '2026-10-13',
    campoFim: '2026-10-19',
    amostra: 1824,
    recorte: 'LV',
    situacao: 'AGUARDANDO_INDICE',
    medidoEm: '2026-10-29',
    revisarApos: '2026-11-01',
    nota: '🔁 Reconferido em 29/Out/2026, 00:17Z: o post segue no ar (HTTP 200, HTML, "52% say they would vote for the Democratic candidate" e "Democrats lead 54% to 42%" relidos), controle positivo poll.qu.edu/robots.txt 200 no mesmo minuto, e o índice segue SEM a rodada (517 linhas lidas). 🔁 Reconferido em 24/Out/2026, 19:43Z: a fonte segue no ar (HTTP 200, primeiros bytes conferidos, controle positivo poll.qu.edu/robots.txt 200 no mesmo minuto) e o índice segue SEM a rodada (500 linhas lidas). Diagnóstico de 21/Out mantido. ✅ Conferida em parte (https://www.gelliottmorris.com/p/2026-10-21-october-strength-in-numbers-verasight-poll-release): "52% say they would vote for the Democratic candidate for the House in their district and 41% for the Republican" entre RV, e "Among likely voters, Democrats lead 54% to 42%". Generic, sem nomes. ⛔ Campo e amostra NÃO foram lidos na fonte, só no agregador. 🧬 Na base a casa se chama "Strength In Numbers/Verasight", com três recortes por onda.',
  },
  {
    // 🔒 O NYT devolve 403 para o nosso leitor. Controle positivo no mesmo
    //    minuto: poll.qu.edu/robots.txt em 200. Não forjei user-agent.
    //
    // ⚠️ E o tamanho da amostra pede olho quando a linha entrar: 3.494 LV é
    //    mais que o dobro da onda de setembro (1.503 LV). Pode ser amostra
    //    nacional ampliada, ou nacional somada a reforços por distrito. Se as
    //    perguntas por distrito vierem com NOMES, é a mesma armadilha da
    //    YouGov e da Pew, e a onda pode ser de outro instrumento.
    casa: 'NYT/Siena',
    campoInicio: '2026-10-12',
    campoFim: '2026-10-19',
    amostra: 3494,
    recorte: 'LV',
    situacao: 'FONTE_INACESSIVEL',
    medidoEm: '2026-10-21',
    revisarApos: '2026-10-23',
    acesso: {
      status: 403,
      hostTodo: false,
      medidoEm: '2026-10-21',
      controlePositivo:
        'no mesmo cliente e no mesmo minuto, poll.qu.edu/robots.txt devolveu 200, echeloninsights.com 200 e edition.cnn.com 200, enquanto a matéria do NYT devolveu 403 com 771 bytes',
      observado:
        'só a matéria foi testada, não o host todo; o crosstab da Siena (siena.edu/scri) é o caminho a tentar na revisão',
    },
    nota: '🔒 Matéria em 403 (https://www.nytimes.com/2026/10/21/upshot/times-siena-poll-trump-midterms.html). O agregador dá D 52 x R 41 sobre 3.494 LV. ⚠️ A amostra é mais que o dobro da onda de setembro, então, quando a linha entrar, conferir se o generic ballot é nacional e sem nomes antes de aceitar a onda como a mesma medição.',
  },
  {
    // ✅ Topline da casa aberto (PDF, HTTP 200, começa em %PDF). Publicada em
    //    22/Out, quase três semanas depois do fim do campo, e o índice ainda não
    //    a recebeu.
    casa: 'UMass Lowell/YouGov',
    campoInicio: '2026-10-02',
    campoFim: '2026-10-04',
    amostra: 1000,
    recorte: 'LV',
    situacao: 'AGUARDANDO_INDICE',
    medidoEm: '2026-10-22',
    revisarApos: '2026-10-26',
    nota: '✅ Conferida no topline (https://www.uml.edu/docs/2026-October-National-Topline_tcm18-423714.pdf): "Field Dates: October 2 – October 4, 2026", "N=1,000 U.S. Likely Voters", margem ajustada ±3,84. A pergunta 1 é "If the 2026 election for U.S. House of Representatives were held today, would you vote for the Democratic candidate or the Republican candidate?", sem nomes: D 52, R 43, outro 1, indeciso 4, não votaria 1. 🧬 Na base a casa tem linhas como "UMass Lowell/YouGov" (A, março), e a UMass AMHERST/YouGov é outra casa.',
  },
  {
    // 🔒 A CNBC recusa o host TODO: raiz, matéria e robots.txt em 403. É a
    //    pesquisa All-America da CNBC, de Hart (D) e Public Opinion Strategies
    //    (R), e não a da NBC, embora as duas usem o mesmo par de executores.
    casa: 'Hart/POS',
    campoInicio: '2026-10-14',
    campoFim: '2026-10-18',
    amostra: 1000,
    recorte: 'RV',
    situacao: 'FONTE_INACESSIVEL',
    medidoEm: '2026-10-22',
    revisarApos: '2026-10-26',
    acesso: {
      status: 403,
      hostTodo: true,
      medidoEm: '2026-10-22',
      controlePositivo:
        'no mesmo cliente e no mesmo minuto, poll.qu.edu/robots.txt devolveu 200, enquanto www.cnbc.com, www.cnbc.com/robots.txt e a matéria devolveram 403 "Access Denied"',
      observado:
        'não forjei user-agent. A rota a tentar na revisão é o site dos executores (hartresearch.com, pos.org), ou esperar o índice, que costuma tabular esta casa pela matéria',
    },
    nota: '🔒 Matéria em 403 (https://www.cnbc.com/2026/10/22/trump-economic-approval-rating-midterms-poll.html). O agregador dá D 52 x R 45 sobre 1.000 RV, campo 14-18/Out, publicada em 22/Out. Na base a casa é "Hart Research Associates (D)/ Public Opinion Strategies (R)", com as ondas da CNBC de julho e da NBC de setembro sob o mesmo nome.',
  },
]

/** A entrada da casa, pela SÉRIE, como no resto da esteira. */
function mesmaCasa(a, b) {
  return serieDaCasa(a) === serieDaCasa(b)
}

/**
 * 🔎 A carga se confere, no mesmo padrão dos registros irmãos.
 *
 * ⛔ Ela NÃO lança: entrada malformada não pode derrubar a passada. Ela fica
 * INERTE, o buraco volta a sair sem diagnóstico, que é o estado seguro, e esta
 * lista acusa em toda passada.
 */
export function conferirCarga(registro = BURACOS_CONHECIDOS) {
  const problemas = []
  for (const e of registro ?? []) {
    const quem = `${e?.casa ?? '(sem casa)'} ${e?.campoInicio ?? '?'}..${e?.campoFim ?? '?'}`
    if (!e || typeof e !== 'object') {
      problemas.push('entrada vazia')
      continue
    }
    if (!e.casa) problemas.push(`${quem}: sem 'casa'`)
    if (!FORMA_ISO.test(e.campoInicio ?? '')) problemas.push(`${quem}: 'campoInicio' fora de AAAA-MM-DD`)
    if (!FORMA_ISO.test(e.campoFim ?? '')) problemas.push(`${quem}: 'campoFim' fora de AAAA-MM-DD`)
    const s = SITUACOES[e.situacao]
    if (!s) problemas.push(`${quem}: situação ${JSON.stringify(e.situacao)} não está declarada em SITUACOES`)
    if (!FORMA_ISO.test(e.medidoEm ?? '')) problemas.push(`${quem}: 'medidoEm' fora de AAAA-MM-DD`)
    // ⏳ Sem prazo, o diagnóstico vira crença permanente. É o defeito que este
    //    campo existe para impedir, então ele é obrigatório.
    if (!FORMA_ISO.test(e.revisarApos ?? '')) problemas.push(`${quem}: sem 'revisarApos', e diagnóstico sem prazo vira crença`)
    if (!e.nota) problemas.push(`${quem}: sem 'nota', e diagnóstico sem o que foi feito não poupa a próxima passada`)
    if (s?.exigeAcesso) {
      const a = e.acesso
      if (!a || typeof a !== 'object') problemas.push(`${quem}: ${e.situacao} exige 'acesso'`)
      else {
        // Guarda de TIPO e não de valor: `status: 0` é medição legítima de host
        // que não resolve, e `!a.status` rejeitaria justamente esse caso.
        if (typeof a.status !== 'number') problemas.push(`${quem}: 'acesso.status' tem de ser número`)
        if (!a.controlePositivo) problemas.push(`${quem}: sem 'acesso.controlePositivo', e sem ele bloqueio do host é indistinguível de leitor quebrado`)
        if (!FORMA_ISO.test(a.medidoEm ?? '')) problemas.push(`${quem}: 'acesso.medidoEm' fora de AAAA-MM-DD`)
      }
    } else if (e.acesso) {
      // ⛔ Mesma fronteira do `fonte-conferida`: anexar status de acesso a uma
      //    situação que não é de bloqueio faz o registro declarar bloqueio onde
      //    não houve.
      problemas.push(`${quem}: ${e.situacao} NÃO aceita 'acesso', que declararia bloqueio onde não houve`)
    }
    if (s?.exigeLeitura) {
      const l = e.leitura
      if (!l || typeof l !== 'object') problemas.push(`${quem}: ${e.situacao} exige 'leitura'`)
      else {
        const urls = Array.isArray(l.urls) ? l.urls.filter((u) => typeof u === 'string' && u) : []
        if (!urls.length) problemas.push(`${quem}: 'leitura.urls' tem de dizer O QUE foi lido`)
        // 🧪 CONTROLE POSITIVO desta situação. "Abri e a pergunta não está lá"
        //    sem dizer o que ESTÁ lá é indistinguível de não ter aberto, que é
        //    a mesma lógica do `controlePositivo` do bloqueio.
        if (!l.oQueTem) problemas.push(`${quem}: sem 'leitura.oQueTem', e "a pergunta não está lá" sem dizer o que ESTÁ é indistinguível de não ter lido`)
        if (typeof l.status !== 'number') problemas.push(`${quem}: 'leitura.status' tem de ser número`)
        // ⚠️ Aqui a guarda É de valor, e de propósito: `curl -o` GRAVA no 403 e
        //    no 429, então página de erro lida inteira passaria por documento.
        //    Declarar que a pergunta não está no documento exige que o que se
        //    leu TENHA sido o documento. É o oposto do caso do `status: 0`,
        //    onde o valor era a própria medição.
        else if (l.status < 200 || l.status > 299) problemas.push(`${quem}: 'leitura.status' ${l.status} não é leitura do documento, e página de erro lida não refuta pergunta nenhuma`)
        if (!FORMA_ISO.test(l.medidoEm ?? '')) problemas.push(`${quem}: 'leitura.medidoEm' fora de AAAA-MM-DD`)
      }
    } else if (e.leitura) {
      // ⛔ A fronteira simétrica à do `acesso`: anexar leitura a uma situação
      //    que não é de documento lido faz o registro declarar leitura que não
      //    houve, e é assim que este veredito vazaria.
      problemas.push(`${quem}: ${e.situacao} NÃO aceita 'leitura', que declararia documento lido onde não houve`)
    }
  }
  return problemas
}

/**
 * O diagnóstico de UMA rodada faltante, ou `null` se ninguém a investigou.
 *
 * ⛔ Ele NUNCA diz para tirar a rodada da contagem. O buraco segue buraco: o
 * que volta aqui é o que já se sabe sobre ele, para a próxima passada não
 * refazer a investigação.
 *
 * @param {string} casa        nome da casa como o agregador escreve
 * @param {string} campoInicio `AAAA-MM-DD`
 * @param {string} campoFim    `AAAA-MM-DD`
 * @param {Date|string} hoje
 */
export function diagnosticoDe(casa, campoInicio, campoFim, registro = BURACOS_CONHECIDOS, hoje = new Date()) {
  if (!casa || !campoInicio || !campoFim) return null
  const e = (registro ?? []).find(
    (x) => x && mesmaCasa(x.casa, casa) && x.campoInicio === campoInicio && x.campoFim === campoFim
  )
  if (!e) return null
  const s = SITUACOES[e.situacao]
  // Entrada malformada fica INERTE: sem diagnóstico é o estado seguro.
  if (!s || !FORMA_ISO.test(e.revisarApos ?? '')) return null
  const dia = typeof hoje === 'string' ? hoje.slice(0, 10) : new Date(hoje).toISOString().slice(0, 10)
  const vencido = dia > e.revisarApos
  return {
    situacao: e.situacao,
    descricao: s.descricao,
    acao: vencido ? 'DIAGNÓSTICO VENCIDO: reconferir, porque crença velha não é medição' : s.acao,
    medidoEm: e.medidoEm,
    revisarApos: e.revisarApos,
    vencido,
    acesso: e.acesso ?? null,
    leitura: e.leitura ?? null,
    nota: e.nota,
  }
}
