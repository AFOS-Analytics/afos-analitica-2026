/**
 * 🚧 O PORTÃO DE GRAVAÇÃO DO GENERIC BALLOT
 *
 * Ele decide se uma coleta pode ser gravada por cima do registro anterior no
 * Neon. A regra vive AQUI, e não dentro da rota, por um motivo medido: enquanto
 * ela era um `if` no meio do handler, ninguém a testava, e ela passou meses
 * medindo a coisa errada.
 *
 * 🔴 O DEFEITO QUE A TROUXE PARA CÁ, 25/Set/2026.
 *
 * A rota se declarava à prova de leitura vazia, e o teste dela era
 * `!polls.length || !mediaAfos`, ou seja a SAÍDA. O índice é a ENTRADA.
 *
 * As rodadas CURADAS entram depois dos dois portões de linha: são uma lista
 * declarada em `rodadas-curadas.mjs` e existem esteja a Wikipédia de pé ou não.
 * Naquele dia a Wikipédia moveu a tabela do generic ballot para uma subpágina
 * transcluída, `?action=raw` deixou de trazê-la, e a coleta saiu com
 * `linhasLidas = 0` e `publicadas = 29`. Vinte e nove é mais que zero, então o
 * portão que existe para recusar leitura vazia deixou passar leitura NENHUMA.
 *
 * 📊 Gravado no Neon: `lidas 0 · pub 29 · n 12 · D+7.70 · campo 2026-09-14`,
 *    por cima de `lidas 430 · pub 449 · n 38 · D+7.98 · campo 2026-09-21`. A
 *    rota devolveu `ok: true` e HTTP 200, e o painel passou a servir a média de
 *    12 rodadas curadas como se fosse a média da casa.
 *
 * ⚠️ Registro degradado é PIOR que rota caída, porque tem a forma do dado bom:
 *    dia novo, média presente, resposta 200. Nada na série acusa a ausência do
 *    índice, a não ser a coluna `lidas`, que era justamente a que ninguém lia.
 *
 * 🔑 A curada é EXCEÇÃO DECLARADA, nunca SUBSTITUTA. Índice em zero não é
 *    leitura fraca: é a lista, e publicar a lista como leitura troca a
 *    procedência da média sem dizer a ninguém.
 */

/**
 * @param {any} dados  o objeto devolvido por `coletarGenericBallot`
 * @returns {{ gravar: boolean, motivo: string|null, http: number, lidas: number, publicadas: number, curadas: number }}
 */
export function avaliarGravacao(dados) {
  // 🕳️ O guarda é de TIPO, não de valor, e a diferença não é estilo:
  //    `Number(null)` é 0 e `Number(true)` é 1, os dois finitos. Sem exigir
  //    `typeof === 'number'`, um contador que veio `true` passaria valendo 1 e um
  //    que veio `null` seria indistinguível de índice vazio de verdade. É a
  //    mesma família do `new Date(null)` que devolve 1970 sem reclamar.
  const numOk = (v) => typeof v === 'number' && Number.isFinite(v)
  const cruLidas = dados?.qualidade?.linhasLidas
  const cruPub = dados?.qualidade?.publicadas ?? dados?.polls?.length
  const lidas = numOk(cruLidas) ? cruLidas : NaN
  const publicadas = numOk(cruPub) ? cruPub : NaN
  const curadas = numOk(dados?.qualidade?.curadas) ? dados.qualidade.curadas : 0
  const base = { http: 502, lidas: numOk(lidas) ? lidas : 0, publicadas: numOk(publicadas) ? publicadas : 0, curadas }

  // ⛔ Forma antes de valor. `linhasLidas` ausente ou não numérica não é zero
  //    nem é ok: é coleta que não sabe dizer quanto leu, e isso não se grava.
  //    Sem esta guarda, `undefined === 0` é falso e a coleta passaria inteira.
  if (!dados || !numOk(lidas) || !numOk(publicadas)) {
    return { ...base, gravar: false, motivo: 'coleta sem contador de qualidade legível; nada foi gravado' }
  }

  if (!dados.polls?.length || !dados.mediaAfos) {
    return { ...base, gravar: false, motivo: 'leitura vazia ou sem média; nada foi gravado' }
  }

  if (lidas === 0) {
    return {
      ...base,
      gravar: false,
      motivo: 'o ÍNDICE devolveu zero linha; as curadas não substituem o índice e nada foi gravado',
    }
  }

  return { ...base, gravar: true, motivo: null, http: 200 }
}
