/**
 * O PORTÃO DE COERÊNCIA das distribuições do painel dos EUA, em UM lugar só.
 *
 * 🔴 POR QUE ESTE ARQUIVO EXISTE. Em 10/Ago/2026 a régua ficou duplicada: o
 * componente `UsMarketSection` decidia se o quadro mostra número, e a rota
 * `api/market/faixas-amplitude` contava quantas capturas da série fecharam.
 * As duas com `95` e `105` escritos à mão.
 *
 * Duas cópias da mesma regra convivem sem incidente até o dia em que uma é
 * corrigida e a outra não. Quando isso acontece aqui, o quadro passa a DECIDIR
 * por um critério e a EXIBIR por outro, sem erro e sem alarme, porque os dois
 * lados continuam internamente coerentes.
 *
 * É a mesma família que custou os rótulos de faixa do mercado em 29/Jul e que,
 * no mesmo 10/Ago, deixou o RSS do Tradeoff sem as edições dos EUA: lá o
 * sitemap passava o país e o feed não.
 *
 * ⚠️ Se um dia a régua mudar, ela muda AQUI e em nenhum outro lugar.
 */

/** Piso do portão, em pontos percentuais. Abaixo disso a causa costuma ser
 *  preço parado ou faixa sem cotação, e NUNCA se normaliza para cima. */
export const SOMA_MIN = 95

/** Teto do portão. Acima disso o excesso é margem de quem opera o livro. */
export const SOMA_MAX = 105

/** A soma das faixas de uma captura fecha o portão? */
export function fechaOPortao(soma: number): boolean {
  return soma >= SOMA_MIN && soma <= SOMA_MAX
}

/**
 * Amplitude da soma das faixas de um mercado numa janela recente, devolvida
 * pela rota `api/market/faixas-amplitude`.
 */
export interface AmplitudeFaixas {
  /** Menor soma observada na janela, em pontos percentuais. */
  min: number
  /** Maior soma observada na janela. */
  max: number
  /** Quantas capturas entraram na conta. */
  n: number
  /**
   * Quantas dessas capturas fecharam o portão.
   *
   * 🔑 É o que permite decidir pela SÉRIE em vez do instante. Sem isto o painel
   * decide por uma leitura só, e o portão vira penhasco: no book de cadeiras do
   * Senado ele virou seis vezes em dez capturas, três delas por menos de 1,5
   * ponto de sobrepreço.
   */
  dentro: number
}
