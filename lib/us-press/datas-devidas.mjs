/**
 * 📅 QUAIS datas de imprensa estão DEVIDAS, e não quantos dias de atraso.
 *
 * 🔴 POR QUE EXISTE, medido em 09/Out/2026 às 00:00Z. O `estado-da-faixa-us.mjs`
 * tinha a conta INLINE e ela estava com o ternário INVERTIDO:
 *
 *     const dia = new Date(Date.parse(hoje) - (d - (passouDaJanela ? 0 : 1)) * 86400000)
 *
 * `esperado` já desconta o dia corrente quando a janela não abriu, então a
 * enumeração devia COMEÇAR em ontem. Com o ternário trocado ela começava em
 * HOJE, e o resultado foi o pior possível para quem lê a lista antes de agir:
 *
 * | janela | o que estava devido | o que a lista disse |
 * |---|---|---|
 * | não passou (o caso real) | **2026-10-08**, que eu podia arquivar | `2026-10-09`, que falta 19h30 |
 * | passou | 10-09 e 10-08 | 10-08 e 10-07 |
 *
 * 🕳️ E o que a manteve CALADA foi uma guarda: `if (!datas.includes(dia))` só
 * deixa passar data realmente ausente, então **todo item impresso era
 * verdadeiro** enquanto a LISTA estava errada. A guarda LAVA o erro de um dia,
 * em vez de denunciá-lo. Defeito só visível na borda, que é justamente hoje.
 *
 * 🔑 E os dois números DISCORDAVAM na mesma tela: o cabeçalho dizia "2 dia(s) de
 * atraso" e a lista trazia uma data só. Atraso em DIAS e datas DEVIDAS são
 * contas diferentes, porque o dia corrente adiado entra num e não no outro.
 * Quem manda é a lista, porque é ela que diz o que fazer.
 */

const DIA_MS = 86400000

const soData = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s)

/** Soma dias em UTC, sem passar por fuso local. */
export const somarDias = (iso, n) =>
  new Date(Date.parse(`${iso}T00:00:00Z`) + n * DIA_MS).toISOString().slice(0, 10)

/**
 * As datas que DEVIAM estar arquivadas e não estão, em ordem.
 *
 * @param {object} o
 * @param {string[]} o.datas    as datas que já existem em disco, `YYYY-MM-DD`
 * @param {string}   o.hoje     o dia UTC corrente, `YYYY-MM-DD`
 * @param {boolean}  o.janelaPassou  se o último cron do dia + folga já passou
 *
 * ⛔ Lista VAZIA quando `datas` é vazia, e isso é de propósito: sem nenhuma data
 * não há de onde começar a enumerar, e inventar um início seria fabricar dívida.
 * Quem responde "o arquivo está vazio" é o chamador, que tem esse caso à parte.
 *
 * 📌 A enumeração começa na PRIMEIRA data existente, nunca antes dela, então
 * arquivo que começa tarde não passa a dever o passado inteiro. E ela acha
 * buraco no MEIO da sequência, não só na cauda.
 */
export function datasDevidas({ datas, hoje, janelaPassou } = {}) {
  if (!soData(hoje)) return []
  const existentes = new Set((datas ?? []).filter(soData))
  // ⚠️ ESTA guarda e a de baixo (`inicio > limite`) sao REDUNDANTES, e isso
  //    foi MEDIDO e nao suposto: a condicao do laco sozinha devolve lista vazia
  //    nos dois casos, porque `undefined <= '2026-10-09'` e falso e
  //    `'2026-07-30' <= '2026-07-01'` tambem. As duas sobreviveram a mutacao por
  //    EQUIVALENCIA, nunca por buraco no teste, e ficam porque dizem a intencao
  //    e porque protegem de um refatoramento futuro em que `inicio` undefined
  //    deixaria de ser inofensivo. ⛔ Nao as confundir com codigo morto achado:
  //    elas estao aqui declaradas como o que sao.
  if (!existentes.size) return []

  // 🔑 O dia corrente só é devido DEPOIS de a janela abrir. Antes disso, não ter
  //    o arquivo de hoje é o comportamento certo, e é o `data-corrente.mjs` que
  //    manda nisso: ele ADIA. Aqui só se respeita a decisão dele.
  const limite = somarDias(hoje, janelaPassou ? 0 : -1)
  const inicio = [...existentes].sort()[0]
  if (inicio > limite) return []

  const devidas = []
  for (let d = inicio; d <= limite; d = somarDias(d, 1)) {
    if (!existentes.has(d)) devidas.push(d)
  }
  return devidas
}
