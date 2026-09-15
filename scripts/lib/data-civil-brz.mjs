/**
 * A data civil do BRASIL, e por que ela não é `toISOString().slice(0, 10)`.
 *
 * ─── POR QUE ESTE ARQUIVO EXISTE ────────────────────────────────────────────
 *
 * 🔴 Achado em 14/Set/2026 e deixado aberto naquele dia: três leitores da rodada
 * do TSE calculavam "hoje" como `new Date().toISOString().slice(0, 10)`, que é a
 * data **UTC**. O `relatorio-pesquisas-brz.ts`, o `conferir-escopo-derivado.mjs`
 * e o `calendario-pesquisas-brz.mjs`, os três.
 *
 * ⛔ E o campo com que esse "hoje" é comparado é a `divulgacao` do registro do
 * TSE, que é **data civil brasileira**. Comparar as duas é comparar coisas de
 * fusos diferentes, e das 21h BRT em diante elas divergem.
 *
 * 🔑 O QUE ISSO CUSTA, e não é cosmético: o bloco `📣 DIVULGAM HOJE` do
 * relatório é o **gatilho do `/atualizar-brz`**. Rodando a rodada às 23h30 BRT:
 *
 *   · as nacionais que divulgaram HOJE saem do bloco e caem em "vencidas",
 *     então o painel não é atualizado por pesquisa que já está publicada;
 *   · e as de AMANHÃ entram como "divulgam hoje", então o gatilho dispara para
 *     pesquisa que ainda não saiu.
 *
 * O erro anda nas duas direções, e nenhuma delas dá erro. Medido em
 * 15/Set/2026: `2026-09-16T02:30:00Z` é **15/Set no Brasil** e 16/Set em UTC.
 *
 * ⚠️ E a rodada roda em hora variada de propósito: a passada dos EUA de
 * 15/Set/2026 foi certificada às 01:07Z, que é 22:07 BRT do dia anterior.
 *
 * ─── POR QUE `Intl`, E NÃO MENOS TRÊS HORAS ─────────────────────────────────
 *
 * O Brasil aboliu o horário de verão em 2019, então hoje `America/Sao_Paulo` é
 * UTC−3 o ano inteiro e subtrair 3 horas daria o mesmo resultado. Mesmo assim a
 * conta é feita pelo fuso NOMEADO, por dois motivos:
 *
 *   1. Se o horário de verão voltar, `-3` passa a errar um dia por verão, em
 *      silêncio, e a data de divulgação é o gatilho de publicação.
 *   2. `-3` escreve uma regra de política pública dentro de uma aritmética, e
 *      quem ler o código não tem como saber se é decisão ou descuido.
 *
 * 📌 Conferido neste ambiente: `Intl.DateTimeFormat` resolve
 * `America/Sao_Paulo` com os dados de fuso do Node. ⚠️ O `TZ=America/Sao_Paulo`
 * do shell Git Bash desta máquina NÃO resolve, e devolve UTC: é do shell, não
 * do Node, e por isso a conta é feita aqui e não com o `date` do sistema.
 */

/** O fuso do horário oficial de Brasília, que é o do registro do TSE. */
export const FUSO_BRASIL = 'America/Sao_Paulo'

/**
 * `en-CA` porque ele formata data como `AAAA-MM-DD`, que é exatamente o formato
 * que o registro do TSE usa e que as comparações de string deste projeto
 * esperam. Montar o ISO à mão a partir de `partes` seria uma segunda regra de
 * formatação para manter.
 */
const FORMATADOR = new Map()

function formatador(fuso) {
  if (!FORMATADOR.has(fuso)) {
    FORMATADOR.set(
      fuso,
      new Intl.DateTimeFormat('en-CA', { timeZone: fuso, year: 'numeric', month: '2-digit', day: '2-digit' }),
    )
  }
  return FORMATADOR.get(fuso)
}

/**
 * A data civil, em `AAAA-MM-DD`, no fuso do Brasil.
 *
 * ⛔ Lança em data inválida em vez de devolver algo. Devolver a data de hoje, ou
 * `null` que o chamador transforma em hoje, é a forma mais fácil de o defeito
 * que este arquivo conserta voltar por outra porta: um "hoje" errado e calado.
 *
 * @param {Date|number|string} [agora]
 * @param {string} [fuso]
 * @returns {string} `AAAA-MM-DD`
 */
export function dataCivilBrasil(agora = new Date(), fuso = FUSO_BRASIL) {
  // 🔴 A GUARDA DE TIPO vem antes do parse, e ela não é zelo: `new Date(null)`,
  // `new Date(true)` e `new Date([])` devolvem a ÉPOCA de 1970, que é uma data
  // perfeitamente válida. Sem isto, um `null` que chegasse aqui viraria
  // "1970-01-01" em silêncio, e "hoje" errado e calado é exatamente o defeito
  // que este arquivo existe para fechar, entrando por uma porta de tipo.
  const tipoOk =
    agora instanceof Date ||
    (typeof agora === 'number' && Number.isFinite(agora)) ||
    (typeof agora === 'string' && agora.trim() !== '')
  if (!tipoOk) {
    throw new TypeError(
      `dataCivilBrasil: tipo invalido (${Object.prototype.toString.call(agora)}); nao existe "hoje" seguro para devolver aqui`,
    )
  }
  const d = agora instanceof Date ? agora : new Date(agora)
  if (Number.isNaN(d.getTime())) {
    throw new TypeError(`dataCivilBrasil: instante invalido (${String(agora)}); nao existe "hoje" seguro para devolver aqui`)
  }
  const iso = formatador(fuso).format(d)
  if (!ehFormatoIso(iso)) {
    throw new Error(`dataCivilBrasil: formato inesperado "${iso}" para o fuso ${fuso}`)
  }
  return iso
}

/**
 * A forma que o resto do projeto espera: `AAAA-MM-DD`, e nada mais.
 *
 * ⚠️ Exportada para poder ser TESTADA. A guarda que a usa só dispararia se o
 * locale ou o ICU mudassem de ideia, ou seja, ela não tem caso de falha
 * alcançável pela função de cima, e guarda sem caso é guarda que ninguém sabe
 * se funciona. Medido em 15/Set/2026: apagar a guarda inteira não reprovava
 * nenhum caso plantado.
 */
export function ehFormatoIso(s) {
  return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s)
}

/**
 * As duas datas lado a lado, para quem imprime poder AVISAR que elas divergem.
 *
 * 🔑 A troca de fuso não pode ser silenciosa. Se a rodada às 23h30 passa a usar
 * a data de ontem em relação ao UTC, quem lê o relatório precisa ver isso, ou o
 * conserto de hoje vira a confusão de amanhã.
 *
 * @returns {{br: string, utc: string, diverge: boolean}}
 */
export function datasDeHoje(agora = new Date(), fuso = FUSO_BRASIL) {
  const d = agora instanceof Date ? agora : new Date(agora)
  const br = dataCivilBrasil(d, fuso)
  const utc = d.toISOString().slice(0, 10)
  return { br, utc, diverge: br !== utc }
}
