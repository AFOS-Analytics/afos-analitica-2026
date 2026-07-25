import { parseNumeric } from './numeric'

/**
 * Gate numérico para tradução de JSON editorial.
 *
 * REGRA DO PROJETO (24/Jul/2026): a tradução NUNCA pode alterar um número.
 * Se alterar, ela é descartada e o locale serve o pt-BR daquele dia. Melhor
 * mostrar português do que publicar número traduzido errado.
 *
 * Por que isso é obrigatório aqui: a tradução é hoje a maior fonte de defeito
 * do pipeline. Na daily de 24/Jul foram 37 defeitos, entre eles vírgula decimal
 * escapando no TL;DR do inglês e "inquérito" virando "poll". Num arquivo de
 * dashboard, o equivalente seria 61,50% virar 6150% ou 61.50 virar 6150.
 *
 * O que o gate compara: o MULTICONJUNTO de valores numéricos com unidade
 * (%, pp, USD) de cada string. Ordem pode mudar (a sintaxe do idioma muda),
 * mas o conjunto de números tem que ser idêntico.
 */

/**
 * Captura número com unidade. Ignora número solto (n=2.000, datas, protocolo).
 *
 * ⚠️ A ORDEM DA ALTERNÂNCIA DE ESCALA IMPORTA: as formas mais longas vêm
 * primeiro. Com (MM|M|mi|mil|...) o "mi" casava dentro de "mil" e 77 mil virava
 * 77 milhões, o que gerava divergência falsa contra a tradução correta.
 *
 * As escalas dos três idiomas entram juntas de propósito: "83 mil" em pt e
 * "83 thousand" ou "83k" em en são o MESMO valor, e o gate não pode reprovar
 * uma tradução por ter escrito a escala no idioma certo.
 */
const ESCALAS = 'bilhões|bilhoes|bilhão|bilhao|billion|millones|milhões|milhoes|milhão|milhao|million|thousand|mil|MM|bi|mi|M|k|B'
const TOKEN_RE =
  new RegExp(String.raw`(?<![\w.,])([+\-−↑↓]?)\s*(\d+(?:[.,]\d+)*)\s*(${ESCALAS})?\s*(%|pp|p\.p\.)?`, 'giu')

function tokensDe(texto: string, locale: 'pt' | 'en'): number[] {
  const out: number[] = []
  // URLs carregam dígitos que não são dado editorial.
  const limpo = texto.replace(/https?:\/\/[^\s)\]]+/g, ' ')
  for (const m of limpo.matchAll(TOKEN_RE)) {
    const [, sinal, num, escala, unidade] = m
    const antes = limpo.slice(Math.max(0, (m.index ?? 0) - 12), m.index ?? 0)
    const moeda = /(USD|R\$|US\$)\s*$/i.test(antes)
    if (!unidade && !moeda) continue          // número sem unidade: fora
    const base = parseNumeric((sinal || '') + num, locale)
    if (base === null) continue
    const e = (escala ?? '').toLowerCase()
    const fator =
      /^(mil|k|thousand)$/.test(e) ? 1e3
      : /^(bilh|billion|bi|b)/.test(e) ? 1e9
      : /^(milh|million|millones|mm|mi|m)/.test(e) ? 1e6
      : 1
    out.push(Number((base * fator).toFixed(4)))
  }
  return out.sort((a, b) => a - b)
}

export interface DivergenciaNumerica {
  caminho: string
  original: number[]
  traduzido: number[]
  trechoOriginal: string
  trechoTraduzido: string
}

/**
 * Percorre os dois objetos em paralelo e compara os números de cada string.
 * @param locOrigem convenção decimal do arquivo de origem (sempre 'pt' aqui)
 * @param locDestino 'en' usa ponto decimal, 'es' usa vírgula como o pt
 */
export function compararNumeros(
  original: unknown,
  traduzido: unknown,
  locDestino: 'en' | 'es',
  caminho = '',
): DivergenciaNumerica[] {
  const out: DivergenciaNumerica[] = []
  const locT: 'pt' | 'en' = locDestino === 'en' ? 'en' : 'pt'

  if (typeof original === 'string') {
    if (typeof traduzido !== 'string') {
      out.push({ caminho, original: [], traduzido: [], trechoOriginal: original.slice(0, 80), trechoTraduzido: '(não é string)' })
      return out
    }
    const a = tokensDe(original, 'pt')
    const b = tokensDe(traduzido, locT)
    if (a.length !== b.length || a.some((v, i) => Math.abs(v - b[i]) > 0.0001)) {
      out.push({
        caminho,
        original: a,
        traduzido: b,
        trechoOriginal: original.slice(0, 110),
        trechoTraduzido: traduzido.slice(0, 110),
      })
    }
    return out
  }

  if (Array.isArray(original)) {
    if (!Array.isArray(traduzido) || traduzido.length !== original.length) {
      out.push({ caminho, original: [], traduzido: [], trechoOriginal: `array[${original.length}]`, trechoTraduzido: Array.isArray(traduzido) ? `array[${traduzido.length}]` : String(typeof traduzido) })
      return out
    }
    original.forEach((item, i) => out.push(...compararNumeros(item, traduzido[i], locDestino, `${caminho}[${i}]`)))
    return out
  }

  if (original && typeof original === 'object') {
    const o = original as Record<string, unknown>
    const t = (traduzido ?? {}) as Record<string, unknown>
    for (const k of Object.keys(o)) {
      out.push(...compararNumeros(o[k], t[k], locDestino, caminho ? `${caminho}.${k}` : k))
    }
    return out
  }

  // number, boolean, null: têm que ser idênticos
  if (original !== traduzido) {
    out.push({ caminho, original: [], traduzido: [], trechoOriginal: String(original), trechoTraduzido: String(traduzido) })
  }
  return out
}
