/**
 * CASAS CUJO INSTRUMENTO FOI MEDIDO COMO OUTRO, e por isso não devem rodada
 * a esta média.
 *
 * ─── A PERGUNTA ─────────────────────────────────────────────────────────────
 *
 * O `exposicao.mjs` projeta as rodadas que faltam pela CADÊNCIA da casa: se ela
 * publica a cada sete dias e está calada há vinte e dois, ela "deve" três. A
 * conta está certa para uma casa que segue medindo a mesma coisa, e **errada
 * para uma casa que trocou a pergunta**. Rodada de outro instrumento não é
 * devida a esta média, e somá-la desloca um número interno que ninguém
 * questiona porque ele parece aritmética.
 *
 * ─── POR QUE ESTE ARQUIVO EXISTE, e a data importa ──────────────────────────
 *
 * 🔴 Isto foi DIAGNOSTICADO em 15/Set/2026 e não foi CONSERTADO. A ficha
 *    daquele dia escreveu, com estas palavras, que "o custo não era só de
 *    frase" e que a exposição "cobrava da YouGov 07/Set e 14/Set e somava as
 *    duas na linha servida D+5.36 · com as que faltam D+4.66". O conserto
 *    ficou na memória e nunca chegou ao código.
 *
 * ⚠️ Em 22/Set/2026 a mesma casa estava com **três** ondas seguidas medidas
 *    como NOMINAIS (campo 4-8, 11-14 e 18-21/Set), e a exposição seguia
 *    cobrando três rodadas dela, movendo a linha de D+7.00 para D+6.56.
 *
 * ─── O QUE ESTE ARQUIVO NÃO É ───────────────────────────────────────────────
 *
 * ⛔ Não é heurística e não é opinião: cada entrada nasce de uma medição do
 *    `conferir-instrumento-us.mjs`, que lê o PDF da casa e casa a ressalva da
 *    pergunta. A entrada guarda a data da medição e o documento, para poder ser
 *    conferida e para PODER SER DESFEITA.
 *
 * ⛔ Não exclui a casa da média nem do índice. A média serve o que o índice
 *    tem; isto só impede que a casa seja COBRADA por rodadas que ela não deve.
 *
 * ⚠️ E não é permanente. Casa que volta ao generic ballot volta a dever
 *    rodada, e a entrada sai daqui. Instrumento é propriedade da ONDA, não da
 *    casa, e tratá-lo como permanente é o erro simétrico do que ele conserta.
 */

/**
 * @type {Record<string, { desde: string, medidoEm: string, ondas: string[], ressalva: string, prova: string }>}
 */
export const INSTRUMENTO_TROCADO = {
  'The Economist/YouGov': {
    // 🔑 `desde` é o INÍCIO DO CAMPO da primeira onda nominal, não o fim.
    //
    // A cadência projeta SLOTS (a cada sete dias sobre o último campo
    // indexado), e um slot cai DENTRO da onda que o preenche. Medido em
    // 22/Set/2026: datando pelo fim do campo (08/Set), o slot de 07/Set
    // continuava sendo cobrado, e a onda que o preenche é justamente a de
    // campo 4 a 8/Set, que é nominal. Datar pelo fim cobra a casa por uma
    // rodada que ela publicou com outro instrumento.
    desde: '2026-09-04',
    medidoEm: '2026-09-22',
    ondas: ['2026-09-04 a 2026-09-08', '2026-09-11 a 2026-09-14', '2026-09-18 a 2026-09-21'],
    ressalva: 'Asked using the names of candidates running in the respondent’s district of residence',
    prova: 'https://d3nkl3psvxxpe9.cloudfront.net/documents/econtoplines_87cqd96.pdf',
  },
}

/**
 * A casa deve rodada a esta média na data pedida?
 *
 * 🔑 A comparação é por ONDA e não por casa: uma casa que trocou o instrumento
 *    em setembro seguia devendo as rodadas de agosto, quando ela media a mesma
 *    coisa. Excluir a casa inteira apagaria buraco real do passado.
 *
 * @param {string} instituto nome da casa, já na forma da série
 * @param {string} dataIso   a data da rodada hipotética, `YYYY-MM-DD`
 */
export function deveRodada(instituto, dataIso) {
  const reg = INSTRUMENTO_TROCADO[instituto]
  if (!reg) return { deve: true, motivo: null }
  if (!dataIso || dataIso < reg.desde) return { deve: true, motivo: null }
  return {
    deve: false,
    motivo: `instrumento medido como NOMINAL em ${reg.medidoEm}, cédula com nomes do distrito em campo iniciado desde ${reg.desde}`,
    registro: reg,
  }
}
