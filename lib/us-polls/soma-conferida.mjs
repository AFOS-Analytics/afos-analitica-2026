/**
 * SOMA CONFERIDA NA FONTE: linhas cuja soma D+R+outros não fecha em 97-102 e que
 * JÁ foram abertas no topline do próprio instituto.
 *
 * 🔑 POR QUE ISTO EXISTE (23/Set/2026). O portão de contaminação reprova quando a
 * contagem de somas fora da faixa CRESCE, porque crescer é a assinatura de a
 * origem ter mudado de formato. A régua é certa e pegou o defeito de 01/Ago.
 *
 * 🔴 Só que ela é uma CONTAGEM BRUTA, e o próprio conferidor já sabe separar
 * deslize de recorte: ele imprime "recorte do instituto" linha a linha e depois
 * ignora a própria classificação na hora de decidir. Então uma linha legítima,
 * uma vez conferida na fonte, volta a reprovar a passada TODO DIA enquanto
 * estiver na janela. E trava que bloqueia todo dia é trava que alguém aprende a
 * pular, que é a régua de `/atualizar-usa` sobre a ETAPA 1.7.
 *
 * ✅ O conserto NÃO é afrouxar a faixa nem subir o limite: é registrar a
 * CONFERÊNCIA, com prova e data, do mesmo jeito que `instrumento-medido.mjs`
 * registra a troca de instrumento. Contagem bruta vira contagem do que ninguém
 * abriu ainda.
 *
 * ⛔ AS TRÊS TRAVAS ANTI-SILÊNCIO, porque o risco deste arquivo é virar gaveta:
 *
 *   1. A entrada casa pelos VALORES (dem, rep, outros), não só por casa e campo.
 *      Se o índice reescrever qualquer um deles, a conferência CADUCA sozinha e
 *      a linha volta a contar. É o mesmo princípio da curadoria que se aposenta.
 *   2. `ERRO_DO_INDICE` nunca é silenciado: ele sai do CONTADOR (porque já foi
 *      investigado e não é formato novo) e entra num bloco PRÓPRIO, impresso em
 *      toda passada, porque é dívida aberta contra a origem.
 *   3. Entrada sem `url` e sem `conferidoEm` é recusada na carga. Conferência
 *      sem prova é opinião, e opinião não desarma portão.
 *
 * 📌 E o que isto NÃO faz: não altera valor nenhum do arquivo publicado. A linha
 * da Marquette continua indo ao ar com o `outros` que o índice declara, porque
 * a Wikipédia é o ÍNDICE e corrigir número à mão muda a procedência. O registro
 * diz que o erro é conhecido, não o conserta.
 */

/**
 * @typedef {'RECORTE_DO_INSTITUTO'|'ERRO_DO_INDICE'|'FONTE_NAO_SUSTENTA'} Veredito
 *
 * 🔴 O TERCEIRO VEREDITO É DE 29/Set/2026, e ele nasceu porque os dois anteriores
 *    obrigavam a MENTIR sobre uma linha de verdade.
 *
 * Abri o topline da Reuters/Ipsos de 13-16/Fev, que é a `fontePrimaria` que a
 * própria linha declara. O documento é a onda CERTA, com as datas CERTAS, e
 * responde HTTP 200. E ele **não sustenta a linha**: é uma pesquisa de adultos
 * 18+, N=1.117, com o generic ballot em D 36 x R 32. A nossa linha diz recorte
 * **RV**, amostra **846**, **D 41 x R 37**. As cadeias `846`, `RV` e `registered`
 * não aparecem UMA vez no PDF, nem na extração com layout, nem sem, nem no
 * binário. (O topline de SETEMBRO da mesma casa TEM coluna RV, com `979` 65 vezes,
 * então não é formato que a casa nunca use.)
 *
 * | veredito | por que não serve aqui |
 * |---|---|
 * | `RECORTE_DO_INSTITUTO` | seria promover a CONFIRMADO um número que o documento não mostra, que é exatamente o que a régua da CNN/SSRS proíbe |
 * | `ERRO_DO_INDICE` | seria acusar a origem sem prova: a Ipsos pode publicar o recorte RV num arquivo de crosstabs que eu não achei |
 *
 * ✅ `FONTE_NAO_SUSTENTA` diz o que de fato aconteceu: **a fonte foi aberta e ela
 *    não sustenta nem refuta**. Sai do contador do "ninguém abriu ainda", porque
 *    alguém abriu, e entra num bloco PRÓPRIO impresso em toda passada, do mesmo
 *    jeito que `ERRO_DO_INDICE`, porque segue sendo dívida.
 *
 * ⛔ E ele NÃO desarma nada além do contador: não corrige valor, não tira a linha
 *    do arquivo e não autoriza usar o número como conferido.
 */

/**
 * Cada entrada foi aberta no topline do instituto, com o documento citado.
 * A decomposição existe para que o número possa ser reconferido sem buscar nada.
 */
export const SOMAS_CONFERIDAS = [
  {
    instituto: 'Reuters/Ipsos',
    campoInicio: '2026-09-17',
    campoFim: '2026-09-20',
    dem: 43,
    rep: 35,
    outros: 9,
    veredito: 'RECORTE_DO_INSTITUTO',
    conferidoEm: '2026-09-23',
    url: 'https://www.ipsos.com/sites/default/files/ct/news/documents/2026-09/Reuters%20Ipsos%20September%20Core%20Political%20Topline.pdf',
    decomposicao:
      'TM3287Y24, coluna RV (N=979): D 43, R 35, outro partido 3, não sabe 14, não vota 5, pulou 1. ' +
      'O "outros" do índice soma 3+5+1=9 e deixa os 14 de indecisos FORA, por isso a soma dá 87.',
  },
  {
    instituto: 'Reuters/Ipsos',
    campoInicio: '2026-09-17',
    campoFim: '2026-09-20',
    dem: 37,
    rep: 29,
    outros: 19,
    veredito: 'RECORTE_DO_INSTITUTO',
    conferidoEm: '2026-09-23',
    url: 'https://www.ipsos.com/sites/default/files/ct/news/documents/2026-09/Reuters%20Ipsos%20September%20Core%20Political%20Topline.pdf',
    decomposicao:
      'TM3287Y24, coluna Total adultos (N=1.277): D 37, R 29, outro partido 3, não sabe 13, não vota 15, pulou 1. ' +
      'O "outros" soma 3+15+1=19 e deixa os 13 de indecisos fora, soma 85.',
  },
  {
    instituto: 'UMass Amherst/YouGov',
    campoInicio: '2026-08-21',
    campoFim: '2026-08-26',
    dem: 42,
    rep: 34,
    outros: 14,
    veredito: 'RECORTE_DO_INSTITUTO',
    conferidoEm: '2026-09-23',
    url: 'https://www.umass.edu/poll/about/reports/2026-09-national-public-opinion-poll-0',
    decomposicao:
      'Voto para a Câmara com leaners: D 42, R 34, independente 10, não sabe 14, fechando 100 na fonte. ' +
      'O "outros" do índice traz o NÃO SABE (14) e declara o independente (10) em nota, por isso a soma dá 90. ' +
      '⚠️ A margem diverge: o índice declara ±4.1 e a fonte declara ±3.5.',
  },
  {
    instituto: 'Marquette University Law School',
    campoInicio: '2026-09-02',
    campoFim: '2026-09-09',
    dem: 54,
    rep: 41,
    outros: 8,
    veredito: 'ERRO_DO_INDICE',
    conferidoEm: '2026-09-23',
    url: 'https://law.marquette.edu/assets/community/poll/MLSPSC35/MLSPSC35ToplinesLV.html',
    decomposicao:
      'Topline de LIKELY VOTERS: D 315 (54%), R 242 (41%), Neither 25 (4%), web blank 1 (0%), fechando 99. ' +
      'O índice publica outros=8%, que é o "Neither" do recorte de ADULTOS (D 48, R 39, Neither 8). ' +
      '🔴 E a própria Wikipédia se contradiz: a célula diz 8% e anexa a nota chamada "Neither4", cujo texto é "Neither" with 4%. ' +
      'D e R estão CORRETOS, então a vantagem D+13 e a média NÃO são afetadas: o erro está só no campo secundário.',
  },
  {
    instituto: 'RMG Research',
    campoInicio: '2026-04-06',
    campoFim: '2026-04-09',
    dem: 45,
    rep: 42,
    outros: 7,
    veredito: 'RECORTE_DO_INSTITUTO',
    conferidoEm: '2026-09-29',
    url: 'https://napolitannews.org/posts/generic-ballot-dem-45-percent-gop-42-dems-also-more-enthusiastic',
    decomposicao:
      'A fonte sustenta o principal, com as palavras dela: "If the election were held today, 45% of registered voters say they would ' +
      'vote for the Democrat from their district, and 42% say they would vote for the Republican", numa "survey of 2,000 Registered ' +
      'Voters conducted online by Scott Rasmussen, April 6-9, 2026". D, R, amostra, recorte e datas BATEM, então não é coluna deslizada: ' +
      'a assinatura de deslize é a amostra ou a margem aparecerem COMO intenção de voto, e aqui D e R são os da fonte. ' +
      '🔎 O que NÃO foi conferido é a decomposição do residual: 45+42 dá 87 e o índice publica outros=7, fechando 94. Os 6 que faltam ' +
      'estão nos "Mini-Toplines" listados como documento de apoio, que ficam atrás da assinatura (a seção do texto é rotulada "Public Content"). ' +
      '⚠️ E a MARGEM diverge: o índice declara ±2.2 e a fonte declara "a margin of error of +/- 3.1", o mesmo gênero da divergência ' +
      'já registrada na UMass Amherst/YouGov.',
  },
  {
    instituto: 'Reuters/Ipsos',
    campoInicio: '2026-02-13',
    campoFim: '2026-02-16',
    dem: 41,
    rep: 37,
    outros: 14,
    veredito: 'FONTE_NAO_SUSTENTA',
    conferidoEm: '2026-09-29',
    url: 'https://www.ipsos.com/sites/default/files/ct/news/documents/2026-02/Reuters%20Ipsos%20Core%20Political%20Topline%20February%202026_1.pdf',
    decomposicao:
      'O documento é a onda CERTA e as datas batem: "Reuters/Ipsos Core Political February 2026", "Interview dates: February 13-16, 2026". ' +
      'Mas ele é "a survey of the American general population (ages 18+)", N=1.117, e o generic ballot (TM3287Y24) sai ' +
      'D 36, R 32, outro partido 3, não sabe 14, não vota 15, pulou *, fechando 100 sobre ADULTOS. ' +
      '🔴 A nossa linha diz recorte RV, amostra 846 e D 41 x R 37, e as cadeias "846", "RV" e "registered" NÃO aparecem ' +
      'uma vez no PDF, nem na extração com layout, nem sem ela, nem no binário. As únicas colunas são Total, Republican, Democrat e Independent. ' +
      '📌 Não é formato que a casa nunca use: o topline de SETEMBRO da mesma Reuters/Ipsos TEM coluna RV, com "979" aparecendo 65 vezes. ' +
      '⛔ Portanto D 41 x R 37 NÃO foi confirmado e o índice NÃO foi refutado: falta o arquivo de crosstabs, se existir. ' +
      '📉 Sem efeito na média servida: o campo de 16/Fev está muito fora da janela de 30 dias. O efeito é no dataset e no registro histórico.',
  },
]

/** 🔑 UMA lista, e ela é a dona da régua: a validação e o balde leem daqui. */
export const VEREDITOS = ['RECORTE_DO_INSTITUTO', 'ERRO_DO_INDICE', 'FONTE_NAO_SUSTENTA']

const obrigatorios = ['instituto', 'campoInicio', 'campoFim', 'dem', 'rep', 'veredito', 'conferidoEm', 'url']

/** Conferência sem prova não desarma portão: a carga recusa entrada incompleta. */
export function validarRegistro(registro = SOMAS_CONFERIDAS) {
  const problemas = []
  registro.forEach((e, i) => {
    for (const c of obrigatorios) {
      if (e[c] === undefined || e[c] === null || e[c] === '') problemas.push(`entrada ${i}: falta "${c}"`)
    }
    if (e.veredito && !VEREDITOS.includes(e.veredito)) {
      problemas.push(`entrada ${i}: veredito desconhecido "${e.veredito}"`)
    }
    if (e.url && !/^https?:\/\//.test(e.url)) problemas.push(`entrada ${i}: url não é http(s)`)
    if (e.conferidoEm && !/^\d{4}-\d{2}-\d{2}$/.test(e.conferidoEm)) problemas.push(`entrada ${i}: conferidoEm não é AAAA-MM-DD`)
  })
  return problemas
}

const n = (v) => (v === null || v === undefined || v === '' ? null : Number(v))

/**
 * A conferência vale para ESTA linha com ESTES valores. Índice reescreveu? caduca.
 * @returns {{conferida: boolean, entrada?: object}}
 */
export function conferenciaDe(poll, registro = SOMAS_CONFERIDAS) {
  if (!poll) return { conferida: false }
  const e = registro.find(
    (r) =>
      r.instituto === poll.instituto &&
      r.campoInicio === poll.campoInicio &&
      r.campoFim === poll.campoFim &&
      n(r.dem) === n(poll.dem) &&
      n(r.rep) === n(poll.rep) &&
      n(r.outros) === n(poll.outros)
  )
  return e ? { conferida: true, entrada: e } : { conferida: false }
}

/**
 * Separa as linhas de soma fora da faixa em QUATRO baldes, e só o primeiro deve
 * pesar na regra do "CRESCEU".
 *
 * 🔴 O `else` FINAL ERA PEGA-TUDO, e isso era defeito silencioso esperando data.
 *    Quem acrescentasse um veredito novo sem mexer aqui teria a linha caindo em
 *    `recorteConferido`, ou seja tratada como **confirmada e legítima**, que é o
 *    pior destino possível para um veredito que não confirma nada. Descoberto em
 *    29/Set/2026 ao acrescentar `FONTE_NAO_SUSTENTA`.
 *
 * ✅ Agora cada veredito tem ramo PRÓPRIO e o desconhecido LANÇA. Falhar alto num
 *    registro declarado é barato: ele é lista escrita à mão e o erro aparece na
 *    primeira execução, enquanto o balde errado aparece meses depois, como número.
 *
 * @param {Array<{p: object, s: number}>} somaFora linhas já filtradas pela faixa
 * @returns {{naoConferidas: Array, recorteConferido: Array, erroDoIndice: Array, fonteNaoSustenta: Array}}
 */
export function separarPorConferencia(somaFora, registro = SOMAS_CONFERIDAS) {
  if (!Array.isArray(somaFora)) throw new Error('separarPorConferencia exige um array')
  const naoConferidas = []
  const recorteConferido = []
  const erroDoIndice = []
  const fonteNaoSustenta = []
  for (const x of somaFora) {
    const { conferida, entrada } = conferenciaDe(x.p, registro)
    if (!conferida) {
      naoConferidas.push(x)
      continue
    }
    switch (entrada.veredito) {
      case 'RECORTE_DO_INSTITUTO':
        recorteConferido.push({ ...x, entrada })
        break
      case 'ERRO_DO_INDICE':
        erroDoIndice.push({ ...x, entrada })
        break
      case 'FONTE_NAO_SUSTENTA':
        fonteNaoSustenta.push({ ...x, entrada })
        break
      default:
        throw new Error(
          `separarPorConferencia: veredito desconhecido "${entrada.veredito}" em ${entrada.instituto} ${entrada.campoFim}. ` +
            `Acrescente o ramo dele aqui e em VEREDITOS: cair no balde de conferido seria trata-lo como confirmado.`
        )
    }
  }
  return { naoConferidas, recorteConferido, erroDoIndice, fonteNaoSustenta }
}
