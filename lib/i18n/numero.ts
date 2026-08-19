/**
 * Formatação de número por idioma, em UM lugar só.
 *
 * A régua da casa: **pt-BR e ES usam vírgula decimal e ponto de milhar; EN usa
 * ponto decimal e vírgula de milhar.**
 *
 * ⚠️ EXCEÇÃO DECLARADA: o produto AFOS Tradeoff usa PONTO decimal nos três
 * idiomas, por decisão de 02/Ago/2026. Ele não usa este módulo, e é assim de
 * propósito.
 *
 * 🔴 Por que isto existe. A mesma regra estava copiada em pelo menos quatro
 * componentes e AUSENTE em outros seis, e o resultado era visível na mesma tela:
 * no painel do Brasil, o 1º turno saía `42,4%` e o 2º turno saía `46.5%`, lado a
 * lado, porque um passava por um helper e o outro era interpolado cru.
 *
 * 🔴 E o caso do espanhol, que nenhuma leitura de código pega sem medir: o ICU
 * NÃO agrupa milhar de quatro dígitos em espanhol. `(2003).toLocaleString('es')`
 * devolve `"2003"`, sem ponto, então uma amostra de 2.003 entrevistados era
 * impressa ao lado de uma data e se lia como ANO. Por isso `fmtMilhar` manda o
 * espanhol para a tag `pt-BR`, que produz o ponto de milhar que a régua pede.
 */

/** Tag de locale para `Intl`, a partir do idioma da rota. */
export function tagLocale(locale: string | undefined): string {
  return locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'pt-BR'
}

/**
 * Número com casas decimais fixas. `null`/`undefined` viram travessão.
 *
 * ⚠️ Só para EXIBIÇÃO. Nunca use o retorno em `width` de CSS nem em conta: a
 * vírgula quebra os dois. Quando o mesmo valor alimenta barra e rótulo, guarde
 * duas variáveis, uma crua e uma formatada.
 */
export function fmtDecimal(n: number | null | undefined, locale: string | undefined, casas = 1): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—'
  const s = n.toFixed(casas)
  return locale === 'en' ? s : s.replace('.', ',')
}

/**
 * Número com separador de milhar.
 *
 * 🔑 O espanhol vai para `pt-BR` de propósito, não por descuido: `'es'` e
 * `'es-ES'` não agrupam quatro dígitos, e a régua da casa pede ponto de milhar
 * em espanhol. Medido, não suposto.
 */
export function fmtMilhar(n: number | null | undefined, locale: string | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—'
  return n.toLocaleString(locale === 'en' ? 'en-US' : 'pt-BR')
}

/**
 * Volume em dólar, compacto (`$1,2M`, `$1,24B`), com a vírgula do idioma.
 *
 * O prefixo é sempre `$`, que é o que o Polymarket usa e o que o painel já
 * mostrava; o que muda aqui é só o separador decimal.
 */
export function fmtVolumeUsd(usd: number | null | undefined, locale: string | undefined): string {
  if (usd === null || usd === undefined || Number.isNaN(usd)) return '—'
  if (usd >= 1_000_000_000) return `$${fmtDecimal(usd / 1_000_000_000, locale, 2)}B`
  if (usd >= 1_000_000) return `$${fmtDecimal(usd / 1_000_000, locale, 1)}M`
  if (usd >= 1_000) return `$${fmtDecimal(usd / 1_000, locale, 0)}K`
  return `$${Math.round(usd)}`
}
