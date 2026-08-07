/**
 * Coerções de frontmatter compartilhadas pelos três produtos.
 *
 * Mesma justificativa do `status.ts` ao lado: `str`, `num`, `arr` e
 * `coerceDate` existiam em cópias nos três loaders, e as cópias JÁ TINHAM
 * DERIVADO entre si. Não é primitivo de produto, é primitivo de leitura de
 * YAML, então os três podem depender daqui sem que um dependa do outro.
 *
 * A regra ao unificar foi sempre pegar a variante MAIS SEGURA das que existiam,
 * nunca a mais permissiva.
 */

/** Só string passa. Qualquer outro tipo cai no fallback. */
export function str(valor: unknown, fallback = ''): string {
  return typeof valor === 'string' ? valor : fallback
}

/** Número finito. `NaN` e `Infinity` caem no fallback. */
export function num(valor: unknown, fallback: number): number {
  return typeof valor === 'number' && Number.isFinite(valor) ? valor : fallback
}

/** Array ou vazio. Nunca devolve `undefined`, para o chamador não precisar guardar. */
export function arr<T>(valor: unknown): T[] {
  return Array.isArray(valor) ? (valor as T[]) : []
}

/**
 * 🔴 YAML SEM ASPAS VIRA `Date`, e um `str()` cru devolveria '' calado.
 *
 * Foi assim que o cabeçalho da Edição №1 do Weekly saiu com "Week of
 * 06/08/2026, 15:19 UTC" em vez do intervalo da semana.
 *
 * ⚠️ A GUARDA DE `isNaN` É DEFESA EM PROFUNDIDADE, e é honesto dizer que não
 * conserta bug vivo: medido em 06/Ago/2026, o YAML NORMALIZA data fora de faixa
 * em vez de produzir `Invalid Date`, então esse caminho não é alcançável pela
 * via do frontmatter hoje. Ela existe porque duas das três cópias não tinham a
 * guarda e `toISOString()` sobre `Invalid Date` LANÇA `RangeError`, o que
 * derrubaria a página inteira em vez de degradar.
 *
 * 📌 Meia-noite UTC não desloca: o YAML lê `2026-08-07` como `T00:00:00Z` e o
 * `slice(0, 10)` devolve a mesma data, sem efeito de fuso. Medido.
 */
export function coerceDate(valor: unknown, fallback = ''): string {
  if (valor instanceof Date && !isNaN(valor.getTime())) return valor.toISOString().slice(0, 10)
  return typeof valor === 'string' ? valor : fallback
}

/**
 * 🔴 O QUE NENHUM LOADER DETECTAVA: data com erro de digitação não dá erro,
 * vira OUTRA DATA VÁLIDA E PLAUSÍVEL.
 *
 * Medido em 06/Ago/2026, com o próprio gray-matter:
 *   escrito 2026-02-30  ->  publica 2026-03-02
 *   escrito 2026-11-31  ->  publica 2026-12-01
 *   escrito 2026-13-45  ->  publica 2027-02-14
 *
 * O valor sai internamente coerente e não reprova portão nenhum, que é a
 * assinatura do defeito mais caro deste projeto. Esta função devolve o que o
 * YAML entendeu junto com um aviso quando a data ENTENDIDA difere da ESCRITA,
 * para o chamador poder registrar em vez de publicar calado.
 *
 * Não bloqueia: só um humano decide se a data certa é a escrita ou a do nome do
 * arquivo. Bloquear aqui derrubaria a publicação por um campo que tem fallback.
 */
export function coerceDateComAviso(
  valor: unknown,
  fallback = ''
): { data: string; normalizada: boolean; escrito?: string } {
  if (valor instanceof Date && !isNaN(valor.getTime())) {
    return { data: valor.toISOString().slice(0, 10), normalizada: false }
  }
  if (typeof valor === 'string') {
    const m = valor.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (m) {
      const [, a, mes, d] = m
      const sonda = new Date(Date.UTC(Number(a), Number(mes) - 1, Number(d)))
      const voltou = sonda.toISOString().slice(0, 10)
      // Se o calendário devolveu outro dia, o que estava escrito não existe.
      if (voltou !== valor) return { data: voltou, normalizada: true, escrito: valor }
    }
    return { data: valor, normalizada: false }
  }
  return { data: fallback, normalizada: false }
}
