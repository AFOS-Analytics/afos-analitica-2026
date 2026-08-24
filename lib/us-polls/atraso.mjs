/**
 * Medidor do ATRASO da base do generic ballot dos EUA.
 *
 * 🔴 POR QUE EXISTE, decidido pelo André em 24/Ago/2026.
 *
 * A Tradeoff EUA №5 saiu do rascunho dizendo, em quatro lugares, que a base
 * estava "parada há vinte dias" e que aquilo era "limitação declarada, não
 * silêncio do eleitorado". Ele leu e cortou, com o argumento que decide:
 *
 *   "Nos EUA tem publicação de pesquisas TODOS OS DIAS. Nós falarmos isso é
 *    evidente que temos alguma deficiência em nosso sistema de coleta."
 *
 * Ele estava certo, e a apuração confirmou. O parse NÃO está quebrado e a
 * página NÃO está abandonada: ela foi editada em 21/Ago, mas em outras seções.
 * A tabela do generic ballot é que não recebe linha nova desde o campo de
 * 03-04/Ago. E as pesquisas existem: no artigo dedicado da Câmara, os
 * agregadores mostram campo até 17/Ago.
 *
 * ⛔ Trocar de fonte pela óbvia não resolve: aquela seção é só de AGREGADOR
 * (RealClearPolitics, Silver Bulletin, VoteHub, Decision Desk HQ), e média de
 * agregador não entra, por regra da casa.
 *
 * ✅ A DECISÃO: medir o atraso e NÃO publicá-lo. A casa precisa saber quando a
 * fonte congela; o leitor não precisa ler que a nossa base está velha.
 *
 * 🚨 A REGRA QUE ESTE ARQUIVO SERVE, e ela é permanente:
 *   NUNCA publicar frase que atribui ao MUNDO o que é propriedade da NOSSA
 *   coleta. Se a base está velha, isso é nosso.
 *   Ver memory/feedback_descrever_o_metodo_sim_relatar_a_falha_nao.md
 *
 * ⚠️ POR ISSO ESTE VALOR NÃO ENTRA NO OBJETO `dados`. O mesmo objeto que o cron
 * grava no Neon é o que o script escreve em `public/us-polls-data.json`, e esse
 * arquivo é SERVIDO PUBLICAMENTE em /us-polls-data.json. Acrescentar um campo
 * ali seria publicar exatamente o que o André mandou parar de publicar.
 * O atraso vive em log de operador e em alerta por email, e em nenhum outro
 * lugar.
 */

/** Dias inteiros entre a data de campo mais recente da base e `agora`. */
export function medirAtraso(dados, agora = new Date()) {
  const datas = (dados?.polls ?? [])
    .map((p) => p?.campoFim)
    .filter((d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort()

  if (!datas.length) return { campoMaisRecente: null, atrasoDias: null, nPolls: 0 }

  const maisRecente = datas[datas.length - 1]
  const ms = agora.getTime() - new Date(`${maisRecente}T00:00:00Z`).getTime()
  return {
    campoMaisRecente: maisRecente,
    atrasoDias: Math.floor(ms / 86_400_000),
    nPolls: datas.length,
  }
}

/**
 * Marcos em que o alerta dispara, e a razão de serem marcos EXATOS.
 *
 * O atraso cresce 1 por dia enquanto a fonte não recebe linha nova. Alertar por
 * NÍVEL (`>= 14`) dispararia todo santo dia a partir do 14º, e trava que avisa
 * todo dia é trava que alguém aprende a ignorar. Comparando por igualdade, cada
 * marco dispara UMA vez, sem precisar guardar estado em lugar nenhum.
 *
 * ⚠️ O preço disso: se o cron pular um dia exatamente em cima de um marco, o
 * marco é pulado. É trade-off consciente contra guardar estado, e o marco
 * seguinte pega.
 */
export const MARCOS_DE_ATRASO = [7, 14, 21, 30, 45, 60, 90]

export function cruzouMarco(atrasoDias) {
  return typeof atrasoDias === 'number' && MARCOS_DE_ATRASO.includes(atrasoDias)
}
