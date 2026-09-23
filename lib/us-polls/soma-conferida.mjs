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

/** @typedef {'RECORTE_DO_INSTITUTO'|'ERRO_DO_INDICE'} Veredito */

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
]

const obrigatorios = ['instituto', 'campoInicio', 'campoFim', 'dem', 'rep', 'veredito', 'conferidoEm', 'url']

/** Conferência sem prova não desarma portão: a carga recusa entrada incompleta. */
export function validarRegistro(registro = SOMAS_CONFERIDAS) {
  const problemas = []
  registro.forEach((e, i) => {
    for (const c of obrigatorios) {
      if (e[c] === undefined || e[c] === null || e[c] === '') problemas.push(`entrada ${i}: falta "${c}"`)
    }
    if (e.veredito && !['RECORTE_DO_INSTITUTO', 'ERRO_DO_INDICE'].includes(e.veredito)) {
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
 * Separa as linhas de soma fora da faixa em três baldes, e só o primeiro deve
 * pesar na regra do "CRESCEU".
 *
 * @param {Array<{p: object, s: number}>} somaFora linhas já filtradas pela faixa
 * @returns {{naoConferidas: Array, recorteConferido: Array, erroDoIndice: Array}}
 */
export function separarPorConferencia(somaFora, registro = SOMAS_CONFERIDAS) {
  if (!Array.isArray(somaFora)) throw new Error('separarPorConferencia exige um array')
  const naoConferidas = []
  const recorteConferido = []
  const erroDoIndice = []
  for (const x of somaFora) {
    const { conferida, entrada } = conferenciaDe(x.p, registro)
    if (!conferida) naoConferidas.push(x)
    else if (entrada.veredito === 'ERRO_DO_INDICE') erroDoIndice.push({ ...x, entrada })
    else recorteConferido.push({ ...x, entrada })
  }
  return { naoConferidas, recorteConferido, erroDoIndice }
}
