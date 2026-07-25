/**
 * Conversão de literal numérico ciente da convenção decimal do arquivo.
 *
 * NUNCA usar parseFloat direto neste projeto:
 *
 *   parseFloat('22,95')  === 22     perde a parte decimal inteira
 *   parseFloat('1.500')  === 1.5    lê separador de milhar como decimal
 *
 * O primeiro caso é o que quebrava o reconcile-claims.ts. Ele tinha DOIS
 * efeitos, e o segundo é pior que o primeiro:
 *
 *   RUÍDO      "22,95%" virava 22 e não batia com o JSON. 46% dos claims
 *              viravam falso positivo, e a saída ficou impossível de ler.
 *   CEGUEIRA   como os dois lados truncavam igual, "11,95%" e "11,75%"
 *              viravam ambos 11 e CASAVAM. O erro real de 24/Jul (valor
 *              obsoleto sobrevivendo ao rebaseline) era invisível para a
 *              ferramenta que existe justamente para pegá-lo.
 *
 * Convenções por origem:
 *   'pt'  JSONs de public/, markdown pt-BR e es  (vírgula decimal)
 *   'en'  CandidatesSection.tsx e markdown .en.md (ponto decimal)
 */
export type DecimalLocale = 'pt' | 'en'

export function parseNumeric(raw: string, locale: DecimalLocale): number | null {
  let s = String(raw).trim().replace(/[\s  ]/g, '')

  // Aceita menos ASCII, menos unicode e as setas usadas nos deltas do painel.
  const neg = /^[-−↓]/.test(s)
  s = s.replace(/^[+\-−↑↓]/, '')
  if (!/^[\d.,]+$/.test(s)) return null

  const lastDot = s.lastIndexOf('.')
  const lastComma = s.lastIndexOf(',')
  let intPart = s
  let fracPart = ''

  if (lastDot >= 0 && lastComma >= 0) {
    // Ambos presentes: o ÚLTIMO separador é o decimal.
    // Resolve '1.234,56' (pt) e '1,234.56' (en) pelo mesmo caminho.
    const cut = Math.max(lastDot, lastComma)
    intPart = s.slice(0, cut).replace(/[.,]/g, '')
    fracPart = s.slice(cut + 1)
  } else if (lastComma >= 0) {
    // Só vírgula: em pt é sempre decimal; em en é separador de milhar.
    if (locale === 'pt') {
      intPart = s.slice(0, lastComma)
      fracPart = s.slice(lastComma + 1)
    } else {
      intPart = s.replace(/,/g, '')
    }
  } else if (lastDot >= 0) {
    // Só ponto: ambíguo em pt. Grupo de milhar canônico = \d{1,3}(\.\d{3})+
    //   '1.500' -> 1500        (grupo de milhar)
    //   '61.50' -> 61.5        (2 casas, não é grupo de milhar)
    if (locale === 'pt' && /^\d{1,3}(\.\d{3})+$/.test(s)) {
      intPart = s.replace(/\./g, '')
    } else {
      intPart = s.slice(0, lastDot)
      fracPart = s.slice(lastDot + 1)
    }
  }

  if (!/^\d*$/.test(intPart) || !/^\d*$/.test(fracPart)) return null
  const n = Number((intPart || '0') + (fracPart ? '.' + fracPart : ''))
  if (!Number.isFinite(n)) return null
  return neg ? -n : n
}

/** Sufixo de escala: 'M' -> 1e6, 'mil'/'k' -> 1e3, 'bi' -> 1e9. */
export function scaleFactor(suffix?: string): number {
  if (!suffix) return 1
  const s = suffix.toLowerCase().replace(/\./g, '')
  if (/^(mil|k)$/.test(s)) return 1e3          // antes do prefixo 'm', senão 'mil' vira milhão
  if (/^(b|bi|bilh)/.test(s)) return 1e9
  if (/^(mm|mi|m|milh)/.test(s)) return 1e6
  return 1
}
