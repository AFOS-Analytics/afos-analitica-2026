/**
 * A dimensão "com ou sem leaners" da mesma rodada.
 *
 * 🔑 A regra pura mora aqui para poder ser TESTADA sem rede e sem arquivo. O
 *    `scripts/efeito-do-leaner-us.mjs` só imprime; quem decide o que é par e o
 *    que não é, é este módulo.
 */

/** O marcador do índice, nas formas em que ele aparece de verdade no wikitext. */
export const MARCADOR_LEANER = /efn\s*\|\s*name\s*=\s*"lean"/

/**
 * Duas linhas só são a MESMA medição vista de dois jeitos quando tudo o mais
 * coincide: instituto, campo, recorte de eleitor e amostra.
 *
 * ⛔ Sem o recorte e a amostra na chave, a LV sem leaners seria pareada com a
 *    RV com leaners, e o delta resultante somaria DUAS diferenças diferentes
 *    como se fosse uma.
 */
export const chaveDeRodada = (p) =>
  `${p.instituto}|${p.campoInicio}|${p.campoFim}|${p.amostraTipo}|${p.amostra}`

/**
 * Pareia as linhas que publicam as duas versões.
 *
 * 🔴 AUSENTE NÃO É `false`. Linha sem o campo `comLeaners` é linha NÃO MEDIDA,
 *    tipicamente curada, que entra por caminho que não passa pelo índice e
 *    portanto não tem `{{efn}}` para ler. Tratá-la como "sem leaners"
 *    inventaria uma versão que ninguém publicou e a parearia com uma versão com
 *    leaners de verdade, fabricando um delta.
 *
 * @param {Array<object>} linhas
 * @returns {{pares: Array<object>, medidas: number, semCampo: number}}
 */
export function parearPorLeaner(linhas) {
  const semCampo = linhas.filter((p) => p.comLeaners === undefined)
  const medidas = linhas.filter((p) => p.comLeaners !== undefined)

  const grupos = new Map()
  for (const p of medidas) {
    const k = chaveDeRodada(p)
    if (!grupos.has(k)) grupos.set(k, [])
    grupos.get(k).push(p)
  }

  const pares = []
  for (const [k, linhasDoGrupo] of grupos) {
    const com = linhasDoGrupo.find((p) => p.comLeaners)
    const sem = linhasDoGrupo.find((p) => !p.comLeaners)
    if (com && sem) {
      pares.push({ k, com, sem, delta: Number((com.vantagemDem - sem.vantagemDem).toFixed(2)) })
    }
  }
  return { pares, grupos: grupos.size, medidas: medidas.length, semCampo: semCampo.length }
}

/**
 * Acha no conjunto de linhas a que foi servida, a partir de uma entrada de
 * `mediaAfos.incluidas`.
 *
 * 🕳️ `incluidas` guarda `instituto`, `campoFim`, `amostraTipo`, `dem` e `rep`,
 *    e **NÃO guarda `vantagemDem`**. A primeira versão disto comparava
 *    `vantagemDem` contra `inc.vantagemDem`, que é `undefined`: `Number(undefined)`
 *    é `NaN`, `NaN === NaN` é falso, e a saída foi um silencioso "0 de 10
 *    rodadas servidas têm a outra versão" quando a primeira da lista tinha.
 *    Casar por campo que não existe devolve zero, e zero se lê como medição.
 */
export function acharServida(linhas, inc) {
  // 🧬 O registro da média grava o nome da SÉRIE, e `polls[]` grava o do índice:
  // desde 25/Set/2026 os dois lados podem ter rótulos diferentes para a mesma
  // linha, e casar pelo canônico devolveria NULL, que aqui se leria como "a casa
  // não publicou a outra versão". Por isso o casamento usa o rótulo do índice
  // quando houve colapso.
  return (
    linhas.find(
      (p) =>
        p.instituto === (inc.institutoNoIndice ?? inc.instituto) &&
        p.campoFim === inc.campoFim &&
        p.amostraTipo === inc.amostraTipo &&
        Number(p.dem) === Number(inc.dem) &&
        Number(p.rep) === Number(inc.rep),
    ) ?? null
  )
}
