/**
 * VOLUME ACUMULADO OBRIGATÓRIO nas edições da FRANÇA (Weekly e Tradeoff).
 * Regra do André em 23/Nov/2026, refeita em 24/Nov/2026 ("a Kalshi também em
 * dólares; número de contrato não significa nada para os usuários"): o volume
 * acumulado do contrato de vitória nos dois livros, os dois em USD, lado a lado
 * e NUNCA somados.
 *
 * Os dois na convenção que as duas plataformas mostram: volume NOCIONAL,
 * contratos negociados x US$ 1. O `volumeNum` da Polymarket já é isso (medido
 * em 24/Nov/2026: soma dos contratos do lado tomador, não dinheiro); a Kalshi
 * informa contratos, e US$ 1 é o `notional_value_dollars` dela. Atalho que dá
 * os números e a frase pronta: `node scripts/volume-acumulado-fra.mjs`.
 *
 * Vale a partir das edições datadas de 24/11/2026 em diante. A Weekly №1
 * (23/11/2026) fica como foi publicada, por decisão do André.
 *
 * O teste é por FRASE: uma mesma frase diz "acumulado" (ou "cumulative"), cita
 * a Polymarket e a Kalshi e traz pelo menos DOIS valores em USD. A frase da
 * semana de um candidato ("USD 0.59M e 187.236 contratos") não passa, e a forma
 * antiga, com a Kalshi em contratos, também não.
 */
export const VOLUME_OBRIGATORIO_DESDE = '2026-11-24'

const frases = (txt) => txt.replace(/\*\*/g, '').split(/(?<=[.!?;])\s+|\n+/)
const valoresUsd = (f) => (f.match(/(?:USD|US\$)\s?\d[\d.,]*/g) ?? []).length

export function fraseDoVolumeAcumulado(txt) {
  return frases(txt).find((f) =>
    /cumulative|acumulad/i.test(f) && /Polymarket/.test(f) && /Kalshi/.test(f) && valoresUsd(f) >= 2,
  ) ?? null
}

/** Controle positivo e negativo da própria regra: se falhar, o portão não vale. */
export function controleDaRegra() {
  const sim = 'Cumulative volume in the win contract, at USD 1 per contract traded: USD 182.7M on Polymarket and USD 7.46M on Kalshi, side by side and never added up.'
  const semana = 'Traded in the week: USD 0.59M and 187,236 contracts.'
  const antiga = 'Cumulative volume in the win contract: USD 182.7M traded on Polymarket and 7.42M contracts on Kalshi, never added up.'
  return fraseDoVolumeAcumulado(sim) !== null && fraseDoVolumeAcumulado(semana) === null && fraseDoVolumeAcumulado(antiga) === null
}
