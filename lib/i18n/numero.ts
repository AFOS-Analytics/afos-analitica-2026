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
 * Sufixo de 10⁹ em notação compacta.
 *
 * 🔴 Em espanhol, "B" é billón = 10¹² (régua de tradução da casa), e o PIB já
 * sai assim em `fmtUsdCompacto`. Por isso 10⁹ em espanhol é "mil M" (milhar de
 * milhões, do CLDR espanhol), e não "B": senão a mesma letra vale 10⁹ no volume
 * e 10¹² no PIB, na mesma página. PT-BR e EN seguem com "B".
 */
export function sufixoBilhao(locale: string | undefined): string {
  return locale === 'es' ? ' mil M' : 'B'
}

/**
 * Volume em dólar, compacto (`$1,2M`, `$1,24B`), com a vírgula do idioma.
 *
 * O prefixo é sempre `$`, que é o que o Polymarket usa e o que o painel já
 * mostrava; o que muda aqui é só o separador decimal.
 */
export function fmtVolumeUsd(usd: number | null | undefined, locale: string | undefined): string {
  if (usd === null || usd === undefined || Number.isNaN(usd)) return '—'
  if (usd >= 1_000_000_000) return `$${fmtDecimal(usd / 1_000_000_000, locale, 2)}${sufixoBilhao(locale)}`
  if (usd >= 1_000_000) return `$${fmtDecimal(usd / 1_000_000, locale, 1)}M`
  if (usd >= 1_000) return `$${fmtDecimal(usd / 1_000, locale, 0)}K`
  return `$${Math.round(usd)}`
}

/**
 * Dólar em notação compacta (PIB: "US$ 3,16 tri", "$3.16T", "3,16 B US$").
 *
 * 🔴 O ESPANHOL TEM REGRA PRÓPRIA (08/Nov/2026). A notação compacta de moeda do
 * `Intl` em es-ES muda entre versões do ICU: o Node da Vercel escreve
 * "28,75 B US$" e o Chrome 147 (e o Node 25) "28,75 BUS$", sem espaço. No
 * contexto estrutural, servidor e navegador desenhavam textos diferentes e TODO
 * painel em /es/ dava o erro de hidratação React #418. Escrito à mão, o texto é
 * o mesmo nos dois lados. "B" é billón = 10¹² (régua de tradução da casa); "mil
 * M" é o milhar de milhões do próprio CLDR espanhol. PT-BR e EN saem iguais nos
 * dois ICU (medido) e seguem no Intl.
 *
 * Usado pelo StructuralContext e pelo CountryGraph: duas cópias da mesma regra
 * divergem, e a primeira correção deixou o grafo com "BUS$" ao lado do quadro
 * já certo.
 */
export function fmtUsdCompacto(v: number, tag: string): string {
  if (tag !== 'es-ES') {
    return new Intl.NumberFormat(tag, { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2 }).format(v)
  }
  const n = (x: number) => new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 }).format(x)
  const a = Math.abs(v)
  if (a >= 1e12) return `${n(v / 1e12)}\u00a0B\u00a0US$`
  if (a >= 1e9) return `${n(v / 1e9)}\u00a0mil\u00a0M\u00a0US$`
  if (a >= 1e6) return `${n(v / 1e6)}\u00a0M\u00a0US$`
  return `${n(v)}\u00a0US$`
}

/**
 * Dólar inteiro ("US$ 2.592", "$2,592", "2.592 US$").
 *
 * 🔑 O espanhol é escrito à mão pelo mesmo motivo de `fmtMilhar`: o ICU em
 * es-ES não agrupa quatro dígitos e devolvia "2592 US$" ao lado de
 * "84.534 US$" no mesmo quadro. O formato (número, espaço fixo, "US$") é o que
 * o próprio ICU espanhol escreve; só o agrupamento muda.
 */
export function fmtUsdInteiro(v: number, tag: string): string {
  if (tag !== 'es-ES') {
    return new Intl.NumberFormat(tag, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)
  }
  return `${fmtMilhar(Math.round(v), 'es')}\u00a0US$`
}

/**
 * Contagem compacta (população: "1,5 bi", "1.5B", "1.450,9 M").
 *
 * 🔑 Em espanhol o ICU escreve milhões sem agrupar ("1450,9 M"), contra a
 * régua da casa. De 10⁶ para cima, o espanhol é escrito à mão com o ponto de
 * milhar; abaixo disso, e em PT-BR e EN, segue o Intl.
 */
export function fmtContagemCompacta(v: number, tag: string): string {
  if (tag === 'es-ES' && Math.abs(v) >= 1e6) {
    const n = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(v / 1e6)
    return `${n}\u00a0M`
  }
  return new Intl.NumberFormat(tag, { notation: 'compact', maximumFractionDigits: 1 }).format(v)
}
