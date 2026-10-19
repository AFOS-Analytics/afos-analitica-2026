/**
 * NÚMERO COM UNIDADE, normalizado para comparar entre idiomas.
 *
 * 🔴 ELE ERA CÓPIA ÚNICA DENTRO DO `gate-weekly-us.ts`, e em 19/Out/2026 a
 *    Tradeoff precisou da MESMA regra. O Tradeoff publica em três idiomas desde
 *    31/Jul e NUNCA teve gate numérico: a regra existia escrita para a Weekly e
 *    o outro produto traduzido não tinha medidor nenhum. Reescrevê-la no portão
 *    do Tradeoff seria a segunda cópia de uma regra que decide se uma tradução
 *    publica ou não.
 *
 * 🔢 O decimal é PONTO nos três idiomas, por decisão de 02/Ago/2026. O que muda
 *    é o separador de MILHAR: EN vírgula, pt-BR e ES ponto. Por isso o milhar é
 *    removido antes de comparar, senão `2,633` e `2.633` sairiam como números
 *    diferentes e o portão reprovaria tradução CORRETA.
 *
 * 📌 `USD` conta como unidade para casar o token, mas o prefixo sozinho não
 *    entra na lista: em `USD 20.49M` o que vale é `20.49M`.
 *
 * ⛔ Ela não corrige nada e não opina: devolve a lista ordenada, e quem compara
 *    é o portão.
 *
 * @param {string} texto
 * @returns {string[]} os tokens, ordenados, prontos para comparação de multiconjunto
 */
export function numerosComUnidade(texto) {
  const achados = []
  const re = /(\d[\d.,]*)\s*(%|pp|M\b|USD)/g
  let m
  while ((m = re.exec(String(texto ?? '')))) {
    let n = m[1]
    // Só o que TEM forma de milhar perde o separador. `7.54` não é milhar.
    if (/^\d{1,3}([.,]\d{3})+$/.test(n)) n = n.replace(/[.,]/g, '')
    achados.push(`${n}${m[2]}`)
  }
  return achados.filter((x) => !x.endsWith('USD')).sort()
}

/**
 * A DIFERENÇA entre dois multiconjuntos de token, nas duas direções.
 *
 * 🔑 Ela é de MULTICONJUNTO e não de conjunto: um número que aparece duas vezes
 * num idioma e uma no outro é defeito de tradução, e comparar conjuntos o
 * esconderia.
 *
 * @returns {{falta: string[], sobra: string[], iguais: boolean}}
 */
export function compararNumeros(origem, traducao) {
  const conta = (xs) => {
    const m = new Map()
    for (const x of xs ?? []) m.set(x, (m.get(x) ?? 0) + 1)
    return m
  }
  const a = conta(origem)
  const b = conta(traducao)
  const falta = []
  const sobra = []
  for (const [k, n] of a) {
    const d = n - (b.get(k) ?? 0)
    for (let i = 0; i < d; i++) falta.push(k)
  }
  for (const [k, n] of b) {
    const d = n - (a.get(k) ?? 0)
    for (let i = 0; i < d; i++) sobra.push(k)
  }
  return { falta, sobra, iguais: falta.length === 0 && sobra.length === 0 }
}
