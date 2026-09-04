/**
 * RODADAS CURADAS: pesquisas lidas na listagem do PRÓPRIO instituto, porque o
 * índice não as recebeu.
 *
 * 🔑 POR QUE ISTO EXISTE, E POR QUE ERA PRA NÃO EXISTIR. O `fora-do-indice.mjs`
 * DETECTA rodada que a Wikipédia não indexou e, de propósito, NUNCA ingere: ler
 * valor na listagem do instituto muda a PROCEDÊNCIA da média servida, e isso é
 * decisão, não efeito colateral. Em 04/Set/2026 a decisão foi tomada pelo André,
 * com o índice congelado desde 25/Ago e a média servida a 13 dias de deixar de
 * existir por esvaziamento da janela de 30 dias.
 *
 * ⚠️ ENTÃO ESTE ARQUIVO É EXCEÇÃO DECLARADA, NÃO CAMINHO NOVO. A regra da casa
 * continua sendo: a Wikipédia é o índice. Cada linha aqui é escrita à mão, com
 * a URL da crosstab do instituto e a decomposição das opções, para que o número
 * possa ser reconferido sem buscar nada de novo.
 *
 * ✅ A TRAVA QUE TORNA ISTO SEGURO É A DEDUPLICAÇÃO, E O ÍNDICE SEMPRE VENCE.
 *
 * O risco real não é a linha estar errada, é ela entrar DUAS VEZES: no dia em
 * que a Wikipédia finalmente indexar a onda, a mesma rodada contaria pelo índice
 * e por aqui, inflando o n e puxando a média para a casa duplicada. Por isso a
 * mesclagem descarta a curada quando o índice já tem a mesma onda. A curadoria
 * se APOSENTA sozinha; ninguém precisa lembrar de apagar.
 *
 * ⚠️ E o quase-encontro é AVISADO, nunca resolvido no escuro: se o índice trouxer
 * a mesma casa e o mesmo recorte com campo a poucos dias de distância, pode ser a
 * mesma onda com data ligeiramente diferente, e aí a deduplicação exata não pega.
 * O módulo denuncia e deixa a decisão com quem lê.
 */

/** Duas datas de campo a esta distância ou menos, na mesma casa e no mesmo recorte, são suspeitas de ser a MESMA onda. */
const DIAS_SUSPEITA = 3

/**
 * As 3 rodadas da The Economist/YouGov com campo posterior ao que o índice
 * alcança, confirmadas na listagem da casa em 04/Set/2026.
 *
 * Números lidos na CROSSTAB da própria YouGov (`econTabReport`), na pergunta
 * "Generic Congressional Vote — In the elections for U.S. Congress in November,
 * who will you vote for in the district where you live?".
 *
 * `outros` é a soma de "Other" + "Not sure" + "I will not vote", que é como o
 * índice preenche a coluna nas linhas desta mesma casa. A decomposição fica em
 * `opcoes` para conferência.
 *
 * O `amostra` do recorte RV é o N NÃO PONDERADO da coluna "Reg Voters", que é o
 * único disponível para o subconjunto. O do recorte A é a amostra declarada no
 * cabeçalho do relatório. A média da casa é simples e não usa amostra, então a
 * escolha não move número nenhum: ela só precisa ser a mesma sempre.
 */
export const RODADAS_CURADAS = [
  // ── onda de campo 14-17/Ago/2026 · margem ±3,4% ──
  {
    instituto: 'The Economist/YouGov',
    campoInicio: '2026-08-14',
    campoFim: '2026-08-17',
    amostra: 1449,
    amostraTipo: 'RV',
    margemErro: 3.4,
    dem: 46,
    rep: 39,
    outros: 14,
    vantagemDem: 7,
    fontePrimaria: 'https://d3nkl3psvxxpe9.cloudfront.net/documents/econTabReport_jNjXIL6.pdf',
    opcoes: { other: 1, naoSabe: 11, naoVotara: 2 },
  },
  {
    instituto: 'The Economist/YouGov',
    campoInicio: '2026-08-14',
    campoFim: '2026-08-17',
    amostra: 1611,
    amostraTipo: 'A',
    margemErro: 3.4,
    dem: 39,
    rep: 32,
    outros: 30,
    vantagemDem: 7,
    fontePrimaria: 'https://d3nkl3psvxxpe9.cloudfront.net/documents/econTabReport_jNjXIL6.pdf',
    opcoes: { other: 1, naoSabe: 13, naoVotara: 16 },
  },
  // ── onda de campo 21-24/Ago/2026 · margem ±3,5% ──
  {
    instituto: 'The Economist/YouGov',
    campoInicio: '2026-08-21',
    campoFim: '2026-08-24',
    amostra: 1377,
    amostraTipo: 'RV',
    margemErro: 3.5,
    dem: 46,
    rep: 40,
    outros: 14,
    vantagemDem: 6,
    fontePrimaria: 'https://d3nkl3psvxxpe9.cloudfront.net/documents/econTabReport_v7iliA1.pdf',
    opcoes: { other: 1, naoSabe: 11, naoVotara: 2 },
  },
  {
    instituto: 'The Economist/YouGov',
    campoInicio: '2026-08-21',
    campoFim: '2026-08-24',
    amostra: 1536,
    amostraTipo: 'A',
    margemErro: 3.5,
    dem: 37,
    rep: 31,
    outros: 32,
    vantagemDem: 6,
    fontePrimaria: 'https://d3nkl3psvxxpe9.cloudfront.net/documents/econTabReport_v7iliA1.pdf',
    opcoes: { other: 1, naoSabe: 9, naoVotara: 22 },
  },
  // ── onda de campo 28-31/Ago/2026 · margem ±3,5% ──
  {
    instituto: 'The Economist/YouGov',
    campoInicio: '2026-08-28',
    campoFim: '2026-08-31',
    amostra: 1434,
    amostraTipo: 'RV',
    margemErro: 3.5,
    dem: 46,
    rep: 40,
    outros: 15,
    vantagemDem: 6,
    fontePrimaria: 'https://d3nkl3psvxxpe9.cloudfront.net/documents/econTabReport_yVe1kKt.pdf',
    opcoes: { other: 2, naoSabe: 10, naoVotara: 3 },
  },
  {
    instituto: 'The Economist/YouGov',
    campoInicio: '2026-08-28',
    campoFim: '2026-08-31',
    amostra: 1592,
    amostraTipo: 'A',
    margemErro: 3.5,
    dem: 36,
    rep: 31,
    outros: 32,
    vantagemDem: 5,
    fontePrimaria: 'https://d3nkl3psvxxpe9.cloudfront.net/documents/econTabReport_yVe1kKt.pdf',
    opcoes: { other: 1, naoSabe: 8, naoVotara: 23 },
  },
]

/** Etiqueta que diz de onde a linha veio. Toda linha servida carrega uma. */
export const ORIGEM_INDICE = 'indice-wikipedia'
export const ORIGEM_CURADA = 'listagem-do-instituto'

const chave = (p) => `${p.instituto}|${p.campoFim}|${p.amostraTipo}`
const dias = (a, b) => Math.abs(new Date(a) - new Date(b)) / 86400000

/**
 * Mescla as curadas com o que veio do índice.
 *
 * O índice SEMPRE vence: rodada que ele já tem descarta a curada equivalente.
 * Devolve também os quase-encontros, que são avisados e não resolvidos aqui.
 */
export function mesclarCuradas(doIndice, curadas = RODADAS_CURADAS) {
  const marcadas = doIndice.map((p) => ({ ...p, origem: p.origem ?? ORIGEM_INDICE }))
  const jaNoIndice = new Set(marcadas.map(chave))

  const aceitas = []
  const duplicadas = []
  const suspeitas = []

  for (const c of curadas) {
    if (jaNoIndice.has(chave(c))) {
      duplicadas.push(c)
      continue
    }
    for (const p of marcadas) {
      if (
        p.instituto === c.instituto &&
        p.amostraTipo === c.amostraTipo &&
        p.campoFim &&
        dias(p.campoFim, c.campoFim) <= DIAS_SUSPEITA
      ) {
        suspeitas.push({ curada: c, doIndice: p, distanciaDias: dias(p.campoFim, c.campoFim) })
      }
    }
    aceitas.push({ ...c, origem: ORIGEM_CURADA })
  }

  return { pesquisas: [...marcadas, ...aceitas], aceitas, duplicadas, suspeitas }
}
