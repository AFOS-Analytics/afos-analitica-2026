/**
 * wayback-alvos.mjs · separa o que vale submeter ao archive.org do que só
 * queima cota.
 *
 * 🔴 POR QUE EXISTE, medido em 05/Set/2026 ao investigar as 17 falhas da rodada
 * de 04/Set. A composição das 23 URLs daquela daily:
 *
 *   5  polymarket.com              infraestrutura, domínio anti-robô
 *   1  divulgacandcontas.tse       infraestrutura, borda Akamai desde 23/Ago
 *   7  invólucro do Google News    matéria
 *   3  redirect da Folha           matéria
 *   7  URL direta de veículo       matéria
 *
 * 🕳️ E a ORDEM é o que transforma isso em defeito, porque ela é sistemática:
 *
 *   2026-09-04  PPPPP....T.............
 *   2026-09-03  PPPPP....T...........
 *   2026-08-28  PPPPPP....T.............
 *   2026-07-29  PPPPPP..........T.....................
 *
 * As cinco ou seis PRIMEIRAS URLs de toda daily são do Polymarket, porque o
 * bloco de fontes técnicas cita o mercado antes das matérias. O disjuntor
 * aborta com 5 falhas de host seguidas. Ou seja: **toda rodada começa gastando
 * a cota em URL que não arquiva, e depois dispara o próprio disjuntor.**
 *
 * A rodada de 29/Jul registrou exatamente isso: 3 arquivadas, 5 falhas,
 * abortada. Cinco falhas é o número de URLs do Polymarket.
 *
 * 📌 Isto NÃO é palpite sobre o Polymarket: o comando já documentava o domínio
 * como anti-robô desde 31/Jul, e a ficha do disjuntor também. O que faltava era
 * a consequência, que é não submetê-lo.
 *
 * ⚠️ Pular não é esconder. O que sai da fila sai COM MOTIVO, é impresso na tela
 * e vai para o ledger, senão a rodada passa a mentir sobre a própria cobertura.
 */

/**
 * Domínios que não são matéria a preservar e que comprovadamente não arquivam.
 *
 * ⛔ Esta lista é curta de propósito. Ela não é lugar para "veículo que costuma
 * falhar": veículo que devolve 403 ao nosso robô pode arquivar bem pelo
 * archive.org, e tirá-lo daqui por suspeita perderia matéria de verdade.
 * Só entra aqui o que é INFRAESTRUTURA da casa, não jornalismo.
 */
export const NAO_ARQUIVAVEL = [
  {
    re: /^https?:\/\/(www\.)?polymarket\.com\//i,
    motivo: 'infraestrutura, e domínio anti-robô: são as 5 primeiras da fila e é o que dispara o disjuntor',
  },
  {
    re: /^https?:\/\/divulgacandcontas\.tse\.jus\.br/i,
    motivo: 'infraestrutura, e o TSE está atrás da borda Akamai desde 23/Ago/2026, host inteiro',
  },
]

/** Devolve o motivo de pular, ou `null` quando a URL deve ser submetida. */
export function motivoDePular(url) {
  for (const r of NAO_ARQUIVAVEL) if (r.re.test(url)) return r.motivo
  return null
}

/**
 * Separa a fila em duas, preservando a ordem original.
 *
 * 🔑 Devolve as duas listas, e não só a de arquivar, porque o que foi pulado
 * precisa aparecer no relatório e no ledger.
 */
export function separarAlvos(urls) {
  const arquivar = []
  const pular = []
  for (const u of urls ?? []) {
    const motivo = motivoDePular(u)
    if (motivo) pular.push({ url: u, motivo })
    else arquivar.push(u)
  }
  return { arquivar, pular }
}
