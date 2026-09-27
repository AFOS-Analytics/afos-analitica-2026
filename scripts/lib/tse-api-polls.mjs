/**
 * tse-api-polls.mjs — o que a resposta de `/api/polls/tse` NÃO diz sozinha.
 *
 * Duas perguntas, as duas nascidas da rodada de 14/Set/2026:
 *
 * 1. 🔴 A RESPOSTA ESTÁ INTEIRA? A rota faz `take: 200` ordenado por
 *    `eventDate desc` e devolve `total: findings.length`, ou seja, o "total
 *    declarado" é o tamanho do que veio e NUNCA pode divergir dele. Medido no
 *    Neon em 14/Set: a janela de 30 dias tinha 351 linhas, a API serviu 200, e
 *    as 151 cortadas eram as de divulgação MAIS ANTIGA (20/Ago a 03/Set), 16
 *    delas nacionais. O conferidor de escopo roda em 30 dias e mediu sobre essa
 *    base: "Real Time contradiz em 25 de 25" era 38 de 38, e 2 rótulos graves
 *    estavam invisíveis. Nenhum portão via, porque "total" = "linhas".
 *
 *    ⭐ Como a ordem é por divulgação decrescente, o corte tem BORDA: toda data
 *    DEPOIS da menor data servida está inteira, e toda data igual ou anterior a
 *    ela pode ter perdido linhas (empates na borda também são cortados). Isso
 *    deixa cada leitor dizer exatamente qual pedaço dele é confiável, em vez de
 *    um "talvez cortado" genérico que ninguém consegue usar.
 *
 * 2. 📣 QUEM DIVULGA HOJE? O relatório tinha "divulgação PREVISTA" com `> hoje`
 *    e "vencida" com `<= hoje`, e o dia de hoje caía só numa CONTAGEM, sem nome.
 *    Em 14/Set NEXUS e Quaest divulgavam naquele dia, a ingestão inseriu zero, e
 *    a rodada terminava com "Nenhuma NACIONAL entrou" e "rodar /atualizar-brz
 *    se algo nacional entrou". O gatilho do painel é a DIVULGAÇÃO, não a
 *    ingestão: as duas tinham entrado em 09/Set.
 *
 * ⛔ Nada aqui lê rede nem banco. Funções puras, testadas em
 *    `scripts/testar-tse-api-polls.mjs`.
 */

/** O `take` PADRÃO de `app/api/polls/tse/route.ts`, o que ela serve sem `?limit=`. */
export const TETO_API_POLLS = 200

/**
 * 📏 27/Set/2026: a rota passou a aceitar `?limit=` (teto 1.000) e a declarar
 * `limit`, `total` REAL (por count) e `truncated`. Decisão do André, no dia em
 * que a folga do gatilho caiu de 67 para 19 e a projeção foi a ~30/Set, antes
 * do 1º turno. O padrão público continua 200: quem pede mais são os leitores.
 */
export const LIMITE_PEDIDO = 1000

/** A URL que os leitores internos usam: sempre com o limite declarado. */
export function urlApiPolls(base, dias) {
  return `${base}/api/polls/tse?days=${dias}&limit=${LIMITE_PEDIDO}`
}

/**
 * O teto que valeu PARA ESTA resposta.
 *
 * 🔴 Não é a constante: é o que a rota declarou. Se os leitores pedissem 1.000
 *    contra uma rota que ainda serve 200 e comparassem com 1.000, 200 linhas
 *    pareceriam "abaixo do teto, janela inteira", em silêncio. Sem o campo, a
 *    resposta é da rota antiga e o teto é o 200 de sempre.
 */
export function tetoDaResposta(resposta) {
  const l = resposta?.limit
  return Number.isInteger(l) && l > 0 ? l : TETO_API_POLLS
}

/**
 * Onde o corte pegou ESTA resposta. Usa o `truncated` declarado quando a rota o
 * traz (é o único que distingue "exatamente no teto" de "cortada"); sem ele,
 * cai na regra de sempre, linhas contra o teto.
 */
export function bordaDaResposta(resposta, linhas) {
  if (typeof resposta?.truncated === 'boolean') {
    if (!resposta.truncated) return null
    const datas = (linhas ?? []).map(dataDeDivulgacao).filter(Boolean).sort()
    return datas.length ? datas[0] : '9999-12-31'
  }
  return bordaDoCorte(linhas, tetoDaResposta(resposta))
}

const ISO_DIA = /^\d{4}-\d{2}-\d{2}$/

/** Data de divulgação em AAAA-MM-DD, ou '' quando ausente ou fora do formato. */
export function dataDeDivulgacao(linha) {
  const d = String(linha?.publicationDate ?? linha?.divulgacao ?? '').slice(0, 10)
  return ISO_DIA.test(d) ? d : ''
}

/**
 * Onde o teto cortou a resposta.
 *
 * @returns {string|null} null quando a resposta veio ABAIXO do teto e está
 *   inteira. Senão, a menor data de divulgação servida: toda data <= borda pode
 *   estar incompleta. Resposta no teto sem nenhuma data legível devolve
 *   '9999-12-31', porque aí nada pode ser dado como inteiro.
 */
export function bordaDoCorte(linhas, teto = TETO_API_POLLS) {
  if (!Array.isArray(linhas)) throw new Error('bordaDoCorte exige um array de linhas')
  if (linhas.length < teto) return null
  const datas = linhas.map(dataDeDivulgacao).filter(Boolean).sort()
  return datas.length ? datas[0] : '9999-12-31'
}

/** O dia `dia` está inteiro na resposta? Só se não houve corte ou se ele fica depois da borda. */
export function diaInteiro(dia, borda) {
  if (!ISO_DIA.test(String(dia))) throw new Error(`diaInteiro exige AAAA-MM-DD, veio ${dia}`)
  return borda === null || dia > borda
}

/**
 * Nacionais com divulgação marcada para HOJE, separando as que já saíram do
 * registro do TSE, e o veredito sobre o gatilho do /atualizar-brz.
 *
 * @template T
 * @param {T[]}    linhas   resposta da API
 * @param {string} hoje     AAAA-MM-DD, injetado para o teste
 * @param {{ehFantasma?: (linha: T) => boolean, borda?: string|null}} [opcoes]
 * @returns {{vivas: T[], fantasmas: T[], gatilho: 'DISPARA'|'NAO_DISPARA'|'INDETERMINADO'}}
 */
export function divulgamHoje(linhas, hoje, { ehFantasma = () => false, borda = null } = {}) {
  if (!ISO_DIA.test(String(hoje))) throw new Error(`divulgamHoje exige hoje em AAAA-MM-DD, veio ${hoje}`)
  // Base vazia não é "ninguém divulga hoje", é leitura que não aconteceu.
  if (!Array.isArray(linhas) || linhas.length === 0) throw new Error('divulgamHoje sem linhas: zero aqui seria o medidor mudo')

  const doDia = linhas.filter((l) => l?.scope === 'national' && dataDeDivulgacao(l) === hoje)
  const vivas = doDia.filter((l) => !ehFantasma(l))
  const fantasmas = doDia.filter((l) => ehFantasma(l))

  // Achar uma é afirmação mesmo sobre base cortada. NÃO achar só vale se o dia
  // de hoje está inteiro na resposta.
  const gatilho = vivas.length > 0 ? 'DISPARA' : diaInteiro(hoje, borda) ? 'NAO_DISPARA' : 'INDETERMINADO'
  return { vivas, fantasmas, gatilho }
}

/**
 * Quanto falta para o teto começar a cortar o dia de HOJE.
 *
 * 📈 Medido em 16/Set/2026: o corte chegou à janela padrão de 15 dias (borda em
 * 08/Set), que em 14/Set ainda vinha inteira. O gatilho `📣` só depende das
 * linhas com divulgação de hoje em diante, e a rota corta das mais antigas
 * primeiro, então ele quebra quando ESSAS linhas passam do teto. Naquele dia
 * eram 88 de 200. A régua escrita em prosa ("remedir a cada rodada") é régua que
 * alguém pula; a conta sai aqui.
 *
 * 🔑 Enquanto a borda fica ANTES de hoje, nenhuma linha de hoje em diante foi
 * cortada e a contagem é exata. Com a borda em hoje ou depois, ela é PISO, e
 * quem imprime tem de dizer isso.
 *
 * @returns {{aFrente: number, teto: number, folga: number, exata: boolean}}
 */
export function folgaDoGatilho(linhas, hoje, teto = TETO_API_POLLS) {
  if (!ISO_DIA.test(String(hoje))) throw new Error(`folgaDoGatilho exige hoje em AAAA-MM-DD, veio ${hoje}`)
  if (!Array.isArray(linhas) || linhas.length === 0) throw new Error('folgaDoGatilho sem linhas: zero aqui seria o medidor mudo')
  const aFrente = linhas.filter((l) => {
    const d = dataDeDivulgacao(l)
    return d && d >= hoje
  }).length
  const borda = bordaDoCorte(linhas, teto)
  return { aFrente, teto, folga: teto - aFrente, exata: borda === null || borda < hoje }
}
