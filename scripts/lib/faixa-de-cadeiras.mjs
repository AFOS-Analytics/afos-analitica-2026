/**
 * Os LIMITES de uma faixa de cadeiras, lidos do rótulo.
 *
 * 🔴 ELE ERA CÓPIA ÚNICA DENTRO DO `check-distribuicao.ts`, e em 19/Out/2026 a
 *    Tradeoff precisou da MESMA leitura para ordenar as faixas por data, no
 *    `semana-do-contrato.mjs`. Reescrever ali seria a segunda cópia de uma
 *    regra que DECIDE A CONTA: ela é quem diz quais faixas ficam abaixo da
 *    maioria, e a maioria é o número que a peça publica.
 *    → memory/feedback_duas_copias_da_mesma_regra.md
 *
 * ⚠️ A ORDEM DOS CASAMENTOS É A REGRA, não estilo. Dois exemplos que o arquivo
 *    de origem já carregava, e que se perdem em qualquer reordenação:
 *      · o rótulo em PAR ("22 ou 23 cad.") tem de vir antes do valor ÚNICO,
 *        senão vira [22,22] e o verificador inventa um buraco até 24
 *      · o valor ÚNICO vem por ÚLTIMO, senão "< 190 cad." casa nele e a faixa
 *        aberta à esquerda vira [190,190]
 *
 * 📐 Cobre os DOIS formatos, porque eles diferem:
 *      API do Polymarket : "Will ... hold between 190 and 194 House seats ..."
 *      banco (outcomeName): "190–194 cad." com TRAVESSÃO TIPOGRÁFICO (U+2013),
 *                           "< 190 cad.", "≥ 230 cad."
 *    ⚠️ Ler o formato errado devolve zero faixa legível, e aí quem chama dá
 *    VERDE sem ter medido nada. Foi o que aconteceu em 11/Ago/2026.
 *
 * @param {string} nome rótulo da faixa
 * @returns {{lo: number, hi: number} | null} `null` quando o rótulo não é faixa
 */
export function limitesDaFaixa(nome) {
  const s = String(nome ?? '')
  let m = s.match(/between\s+(\d+)\s+and\s+(\d+)/i)
  if (m) return { lo: +m[1], hi: +m[2] }
  m = s.match(/(\d+)\s*[–—-]\s*(\d+)/) // travessão, meia-risca ou hífen
  if (m) return { lo: +m[1], hi: +m[2] }
  m = s.match(/(?:below|under|fewer than|<)\s*(\d+)/i)
  if (m) return { lo: -Infinity, hi: +m[1] - 1 }
  m = s.match(/(?:≥|at least|>=)\s*(\d+)/i)
  if (m) return { lo: +m[1], hi: Infinity }
  m = s.match(/(?:≤|at most|<=|or fewer)\s*(\d+)/i) || s.match(/(\d+)\s+or\s+fewer/i)
  if (m) return { lo: -Infinity, hi: +m[1] }
  m = s.match(/(\d+)\s+or\s+more/i)
  if (m) return { lo: +m[1], hi: Infinity }
  m = s.match(/exactly\s+(\d+)/i)
  if (m) return { lo: +m[1], hi: +m[1] }
  // rótulo em PAR: "22 ou 23 cad.", "24 or 25". Sem isto, "22 ou 23" vira [22,22]
  // e o verificador inventa um buraco entre 22 e 24 que não existe.
  m = s.match(/(\d+)\s+(?:ou|or)\s+(\d+)/i)
  if (m) return { lo: +m[1], hi: +m[2] }
  // faixa de valor ÚNICO: "48 cad.", "50 seats". Só depois de descartar tudo acima,
  // senão "< 190 cad." casaria aqui e viraria a faixa [190,190].
  m = s.match(/^\s*(\d+)\b/)
  return m ? { lo: +m[1], hi: +m[1] } : null
}

/**
 * Ordena faixas pelo limite INFERIOR, com a aberta à esquerda primeiro.
 *
 * 📌 Rótulo que não é faixa vai para o FIM e não se mistura com as legíveis:
 * sumir com ele esconderia partição quebrada, que é defeito de coleta.
 */
export function ordenarPorLimite(itens, nomeDe = (x) => x.nome) {
  return [...itens].sort((a, b) => {
    const la = limitesDaFaixa(nomeDe(a))
    const lb = limitesDaFaixa(nomeDe(b))
    if (!la && !lb) return 0
    if (!la) return 1
    if (!lb) return -1
    if (la.lo !== lb.lo) return la.lo - lb.lo
    return la.hi - lb.hi
  })
}
