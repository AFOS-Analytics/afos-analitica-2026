/**
 * paridade-readme.mjs — a conta da PARIDADE dos achados datados entre o
 * `README.md` (inglês) e o `README.pt-BR.md`.
 *
 * 🔴 POR QUE ISTO EXISTE. Em 11/Set/2026 eu contei os achados com um regex de
 * uma linha, achei 54 em inglês contra 55 em português e anunciei ao André que
 * havia uma dívida: um achado de 24/Ago existiria só em português. **Não
 * existia.** O achado estava lá em inglês o tempo todo, e o que diferia era o
 * FORMATO da data: `(Aug 24, 2026)` em vez de `(24/Aug/2026)`, em 1 de 55.
 *
 * 🔑 Ou seja, o defeito era do MEDIDOR, e ele produziu uma dívida inexistente
 * que eu levei ao usuário como fato. Um contador que reconhece só uma das
 * formas em uso não mede paridade, mede a própria régua.
 * → memory/feedback_o_conferidor_que_eu_escrevo_tambem_e_um_medidor.md
 *
 * ⭐ E a paridade se confere por DATA, nunca pelo total. Dois arquivos com 55
 * cada podem ter um achado de 24/Ago a mais de um lado e um de 06/Set a mais do
 * outro: o total fecha e o conteúdo não. É o mesmo motivo pelo qual a subtração
 * do TSE usa duas contas independentes em vez de um número só.
 *
 * ⚠️ NÃO faz IO. O chamador lê os arquivos, para que o teste exercite a conta
 * com textos plantados.
 */

const MES_EN = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 }
const MES_PT = { Jan: 1, Fev: 2, Mar: 3, Abr: 4, Mai: 5, Jun: 6, Jul: 7, Ago: 8, Set: 9, Out: 10, Nov: 11, Dez: 12 }

/**
 * As DUAS formas em uso no repositório, de propósito.
 *
 * ⛔ Não remover a segunda porque "só havia uma ocorrência": ela existiu, e um
 * contador que a ignora acusa dívida onde não há. Se um dia todas forem
 * normalizadas, a forma continua reconhecida e o custo é zero.
 */
function datasDe(texto, mapaMes) {
  const meses = Object.keys(mapaMes).join('|')
  const out = []
  // forma A: (DD/Mmm/AAAA).**
  const reA = new RegExp(`\\((\\d{1,2})\\/(${meses})\\/(\\d{4})\\)\\.\\*\\*`, 'g')
  for (const m of texto.matchAll(reA)) out.push({ dia: +m[1], mes: mapaMes[m[2]], ano: +m[3], forma: 'A' })
  // forma B: (Mmm DD, AAAA).**
  const reB = new RegExp(`\\((${meses})\\s+(\\d{1,2}),\\s*(\\d{4})\\)\\.\\*\\*`, 'g')
  for (const m of texto.matchAll(reB)) out.push({ dia: +m[2], mes: mapaMes[m[1]], ano: +m[3], forma: 'B' })
  return out
}

export const chave = (d) => `${d.ano}-${String(d.mes).padStart(2, '0')}-${String(d.dia).padStart(2, '0')}`

export function acharDatasEN(texto) {
  return datasDe(texto, MES_EN)
}
export function acharDatasPT(texto) {
  return datasDe(texto, MES_PT)
}

/**
 * Compara os dois conjuntos POR DATA. `divergencias` vazio é o único verde.
 * `forasDoPadrao` conta quantos usam a forma B, que é legítima mas inconsistente.
 */
export function compararParidade(textoEN, textoPT) {
  const en = acharDatasEN(textoEN)
  const pt = acharDatasPT(textoPT)
  const conta = (arr) => arr.reduce((o, d) => ((o[chave(d)] = (o[chave(d)] || 0) + 1), o), {})
  const ce = conta(en)
  const cp = conta(pt)
  const divergencias = []
  for (const d of [...new Set([...Object.keys(ce), ...Object.keys(cp)])].sort()) {
    const a = ce[d] || 0
    const b = cp[d] || 0
    if (a !== b) divergencias.push({ data: d, en: a, pt: b })
  }
  return {
    totalEN: en.length,
    totalPT: pt.length,
    divergencias,
    forasDoPadrao: { en: en.filter((d) => d.forma === 'B').length, pt: pt.filter((d) => d.forma === 'B').length },
  }
}

/** Linhas prontas para a tela. Separada da conta de propósito. */
export function formatarParidade(r) {
  const L = []
  L.push(`📄 achados datados: EN ${r.totalEN} · pt-BR ${r.totalPT}`)
  if (r.forasDoPadrao.en || r.forasDoPadrao.pt) {
    L.push(`   ⚠️ fora do padrão \`(DD/Mmm/AAAA)\`: EN ${r.forasDoPadrao.en}, pt-BR ${r.forasDoPadrao.pt}`)
    L.push('      Contados na paridade, e é por isso que eles NÃO produzem dívida falsa.')
  }
  if (!r.divergencias.length) {
    L.push('✅ paridade fecha em TODAS as datas, não só no total.')
    return L
  }
  L.push(`🔴 ${r.divergencias.length} data(s) sem paridade:`)
  for (const d of r.divergencias) L.push(`   ${d.data}   EN ${d.en} · pt-BR ${d.pt}`)
  L.push('   ⛔ Conferir o TEXTO antes de concluir que falta tradução: o achado pode')
  L.push('      existir dos dois lados com a data escrita de outro jeito.')
  return L
}
