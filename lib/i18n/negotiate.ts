import { locales, type Locale } from './config'

/**
 * Escolhe o idioma a partir do cabeçalho `Accept-Language`, respeitando o
 * q-value e a ordem declarada pelo LEITOR.
 *
 * 🔴 O que existia antes, em duas cópias divergentes: o middleware varria a
 * lista de idiomas do SITE e devolvia o primeiro cujo prefixo aparecesse em
 * qualquer lugar do cabeçalho. Como `pt-BR` é o primeiro da lista, um leitor com
 * `en-US,en;q=0.9,pt;q=0.3` caía em português: a preferência mais fraca dele
 * ganhava da mais forte, porque a ordem consultada era a nossa, não a dele.
 * A raiz do site, por sua vez, só olhava a PRIMEIRA tag e ignorava o resto.
 *
 * ⚠️ O `fallback` é argumento de propósito, e não pode virar constante: as duas
 * portas divergem por decisão. O middleware cai em `pt-BR`; a raiz cai em `en`,
 * porque ela é a face internacional e o próprio metadata dela declara canonical
 * em inglês. Unificar sem parâmetro trocaria calado a porta do visitante
 * estrangeiro.
 */
export function negotiateLocale(acceptLanguage: string | null | undefined, fallback: Locale): Locale {
  const bruto = String(acceptLanguage ?? '').trim()
  if (!bruto) return fallback

  const preferencias = bruto
    .split(',')
    .map((parte, ordem) => {
      const [tagCrua, ...params] = parte.trim().split(';')
      const tag = tagCrua.trim().toLowerCase()
      if (!tag) return null
      const q = params
        .map((p) => p.trim().match(/^q=([0-9.]+)$/i))
        .find(Boolean)
      const peso = q ? Number(q[1]) : 1
      return { tag, peso: Number.isFinite(peso) ? peso : 0, ordem }
    })
    .filter((p): p is { tag: string; peso: number; ordem: number } => p !== null && p.peso > 0)
    // Empate de q mantém a ordem em que o leitor escreveu.
    .sort((a, b) => b.peso - a.peso || a.ordem - b.ordem)

  for (const { tag } of preferencias) {
    if (tag === '*') return fallback
    const base = tag.split('-')[0]
    // Casamento exato primeiro (pt-br bate pt-BR antes de pt bater qualquer pt-*).
    const exato = locales.find((l) => l.toLowerCase() === tag)
    if (exato) return exato
    const porBase = locales.find((l) => l.split('-')[0].toLowerCase() === base)
    if (porBase) return porBase
  }
  return fallback
}
