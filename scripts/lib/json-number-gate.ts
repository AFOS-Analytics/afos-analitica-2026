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
 *
 * ⚠️ COMPOSTO DO ESPANHOL: "mil millones" é bilhão. Em espanhol "billón" é um
 * MILHÃO de milhões, então a tradução correta de "R$ 145 bi" é "R$ 145 mil
 * millones", nunca "145 billones". Sem o composto na frente da alternância, o
 * gate casava só o "mil" e lia 145 mil contra 145 bilhões do português: uma
 * divergência falsa que descartaria uma tradução correta e mandaria o leitor
 * espanhol de volta para o português. Detectado em 25/Jul/2026, antes de gerar
 * o primeiro ES.
 */
/**
 * UMA fonte para a alternância do regex E para o cálculo do fator.
 *
 * Antes eram duas estruturas que precisavam ficar em sincronia à mão: a string
 * de alternância e uma cadeia de ifs, ambas com ordenação load-bearing
 * garantida só por comentário. Acrescentar uma escala na posição errada
 * reintroduzia o bug silenciosamente. Agora a ordem é DERIVADA (mais longa
 * primeiro, ver ESCALAS abaixo), então o invariante é do código, não da
 * disciplina de quem edita.
 */
const ESCALA_FATOR: ReadonlyArray<readonly [string, number]> = [
  // Composto do espanhol: "mil millones" é bilhão. Precisa vencer "mil", e
  // vence por ser mais longo.
  ['mil millones', 1e9], ['mil millón', 1e9], ['mil milhões', 1e9], ['mil milhoes', 1e9],
  // "billón" entra aqui com 1e9 e é SOBRESCRITO para 1e12 quando o idioma é
  // espanhol (ver fatorDe). Em pt e en, "billion"/"bilhão" são 1e9 mesmo.
  ['billones', 1e9], ['billón', 1e9], ['billon', 1e9],
  ['bilhões', 1e9], ['bilhoes', 1e9], ['bilhão', 1e9], ['bilhao', 1e9], ['billion', 1e9],
  ['millones', 1e6], ['milhões', 1e6], ['milhoes', 1e6], ['milhão', 1e6], ['milhao', 1e6], ['million', 1e6],
  ['thousand', 1e3], ['mil', 1e3],
  ['MM', 1e6], ['bi', 1e9], ['mi', 1e6], ['M', 1e6], ['k', 1e3], ['B', 1e9],
]

/** Mais longa primeiro: sem isso "mi" casa dentro de "mil" e 77 mil vira 77 milhões. */
const ESCALAS = [...ESCALA_FATOR]
  .sort((a, b) => b[0].length - a[0].length)
  .map(([forma]) => forma.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  .join('|')

const FATOR = new Map(ESCALA_FATOR.map(([forma, f]) => [forma.toLowerCase(), f]))

/**
 * FALSO AMIGO CARO: "billón" em espanhol é um MILHÃO de milhões (1e12), não
 * 1e9. Antes o gate lia "145 billones" como 145 bilhões e APROVAVA uma
 * tradução que dizia mil vezes o valor certo.
 */
const BILHAO_ES = /^(billones|billón|billon)$/

function fatorDe(escala: string, locale: 'pt' | 'en' | 'es'): number {
  // Espaço interno normalizado: a escala pode vir com espaço duplo do texto.
  const e = escala.toLowerCase().replace(/\s+/g, ' ').trim()
  if (!e) return 1
  if (locale === 'es' && BILHAO_ES.test(e)) return 1e12
  return FATOR.get(e) ?? 1
}

const TOKEN_RE =
  new RegExp(String.raw`(?<![\w.,])([+\-−↑↓]?)\s*(\d+(?:[.,]\d+)*)\s*(${ESCALAS})?\s*(%|pp|p\.p\.)?`, 'giu')

function tokensDe(texto: string, locale: 'pt' | 'en' | 'es'): number[] {
  // Separador decimal: o espanhol segue a convenção do português (vírgula).
  // A ESCALA, porém, NÃO segue, e é por isso que o idioma real chega aqui.
  const decimal: 'pt' | 'en' = locale === 'en' ? 'en' : 'pt'
  const out: number[] = []
  // URLs carregam dígitos que não são dado editorial.
  const limpo = texto.replace(/https?:\/\/[^\s)\]]+/g, ' ')
  for (const m of limpo.matchAll(TOKEN_RE)) {
    const [, sinal, num, escala, unidade] = m
    const antes = limpo.slice(Math.max(0, (m.index ?? 0) - 12), m.index ?? 0)
    const moeda = /(USD|R\$|US\$)\s*$/i.test(antes)
    if (!unidade && !moeda) continue          // número sem unidade: fora
    const base = parseNumeric((sinal || '') + num, decimal)
    if (base === null) continue
    out.push(Number((base * fatorDe(escala ?? '', locale)).toFixed(4)))
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

  if (typeof original === 'string') {
    // IGUAL BYTE A BYTE: a tradução não tocou nesta string, logo não pode ter
    // alterado número nenhum, e comparar seria comparar a string consigo mesma
    // sob duas convenções decimais diferentes.
    //
    // Sem isto, os campos que o script mantém em português de propósito
    // (`source`, `protocolo`, `institute`, metadados de procedência que nenhum
    // componente renderiza) reprovavam o arquivo inglês inteiro: o
    // `approvalData.source` de polls-data.json traz "aprova 45,9%", que lido em
    // convenção inglesa vira 459 contra os 45,9 do português. Uma divergência
    // que não existe descartaria a tradução e mandaria o /en/dashboard de volta
    // para o português. Detectado em 25/Jul/2026.
    //
    // LIMITE ACEITO: se o tradutor devolvesse uma string LONGA sem tocar em
    // nada, o gate não acusaria a vírgula decimal não convertida. Na prática
    // prosa traduzida nunca volta idêntica; campo de dado, sim, e é justamente
    // esse o caso que se quer deixar passar.
    if (original === traduzido) return out

    if (typeof traduzido !== 'string') {
      out.push({ caminho, original: [], traduzido: [], trechoOriginal: original.slice(0, 80), trechoTraduzido: '(não é string)' })
      return out
    }
    const a = tokensDe(original, 'pt')
    // O idioma REAL do destino, não o mapeamento para a convenção decimal:
    // o tokenizador precisa saber que é espanhol para tratar "billón" como 1e12.
    const b = tokensDe(traduzido, locDestino)
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
    // Chave que existe SÓ no traduzido não era vista: o laço acima percorre as
    // chaves do original. Campo inventado pela tradução entraria no arquivo
    // publicado sem passar por conferência nenhuma. Chave a menos já era pega
    // (vira `undefined` do lado traduzido); chave a mais, não.
    if (traduzido && typeof traduzido === 'object' && !Array.isArray(traduzido)) {
      for (const k of Object.keys(t)) {
        if (Object.prototype.hasOwnProperty.call(o, k)) continue
        out.push({
          caminho: caminho ? `${caminho}.${k}` : k,
          original: [],
          traduzido: [],
          trechoOriginal: '(chave não existe no original)',
          trechoTraduzido: String(t[k]).slice(0, 80),
        })
      }
    }
    return out
  }

  // number, boolean, null: têm que ser idênticos
  if (original !== traduzido) {
    out.push({ caminho, original: [], traduzido: [], trechoOriginal: String(original), trechoTraduzido: String(traduzido) })
  }
  return out
}
