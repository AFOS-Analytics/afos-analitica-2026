/**
 * AMOSTRA DE ENTREGA: de QUEM é o lote que se confere no Resend.
 *
 * 🔴 Extraído do `conferir-entrega-resend.mjs` em 27/Set/2026, e o motivo é um
 * defeito medido: o conferidor filtrava por `edicao` + `produto` e NÃO por país.
 * Brasil e EUA publicam Tradeoff na mesma data e disparam no mesmo dia, então
 * conferir a edição americana de 28/Set devolvia **42 de 42 entregues**, que são
 * 21 dos EUA mais 21 do Brasil. O `--pais=us` era aceito e ignorado em silêncio.
 *
 * ⭐ A decisão de desenho: o conserto NÃO é exigir país. É fazer o veredito
 * DECLARAR de que países é a amostra, sempre. Filtro que erra some; contagem
 * declarada não. Por isso `quebraPorPais` é a peça central deste arquivo, e não
 * um enfeite do cabeçalho.
 */

/** O LOTE: uma data e, opcionalmente, um produto. Os dois países cabem aqui dentro. */
export function filtrarLote(eventos, edicao, produto = undefined) {
  if (!edicao) throw new Error('filtrarLote: edicao é obrigatória, e sem ela o lote seria "tudo"')
  return eventos.filter((e) => {
    const p = e?.eventPayload ?? {}
    if (p.edicao !== edicao) return false
    if (produto && p.produto !== produto) return false
    return true
  })
}

/**
 * A ELEIÇÃO: um país dentro do lote.
 *
 * ⛔ Casa por igualdade estrita e NÃO trata ausência de campo como coincidência:
 * evento sem `pais` não pertence a país nenhum, e fingir que pertence ao pedido
 * é o defeito que se está consertando, do outro lado.
 */
export function filtrarPais(doLote, pais) {
  if (!pais) return doLote
  return doLote.filter((e) => (e?.eventPayload ?? {}).pais === pais)
}

/**
 * A quebra por país, com balde DECLARADO para quem não tem o campo.
 *
 * 🔑 `(sem país)` existe porque broadcast antigo pode não ter gravado país, e
 * isso é dívida a mostrar. Somar essas linhas a um país, ou descartá-las, seriam
 * as duas formas de mentir sobre a amostra.
 */
export function quebraPorPais(lista) {
  const m = new Map()
  for (const e of lista) {
    const k = (e?.eventPayload ?? {}).pais ?? '(sem país)'
    m.set(k, (m.get(k) ?? 0) + 1)
  }
  return [...m.entries()].sort((a, b) => (b[1] - a[1]) || String(a[0]).localeCompare(String(b[0])))
}

/** A quebra como texto de uma linha, que é o que entra no cabeçalho e no veredito. */
export function quebraEmTexto(lista, separador = ' · ') {
  const q = quebraPorPais(lista)
  return q.length === 0 ? '(amostra vazia)' : q.map(([k, v]) => `${k}=${v}`).join(separador)
}
