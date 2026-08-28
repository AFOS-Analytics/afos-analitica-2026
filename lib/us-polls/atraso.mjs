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

/**
 * ─── CADÊNCIA POR CASA ──────────────────────────────────────────────────────
 *
 * 🔴 POR QUE ISTO EXISTE, e por que `medirAtraso` acima NÃO bastava.
 *
 * Medido em 28/Ago/2026. O André duvidou de "nenhuma pesquisa nova entrou",
 * com o argumento de sempre: nos EUA há divulgação todo dia. A apuração deu
 * razão a ele por um caminho que nenhum medidor da casa enxergava.
 *
 * Em 24/Ago a tabela recebeu 16 linhas de uma vez. O `medirAtraso` global caiu
 * para 7 dias e ficou verde. Só que a onda de 14 a 17/Ago da The Economist/
 * YouGov NUNCA entrou, embora outras quatro casas com o MESMO dia de campo
 * tenham entrado. Ou seja: a tabela como um todo parecia fresca e faltava uma
 * pesquisa DENTRO da janela que a média usa.
 *
 * 🔑 O atraso global mede a PONTA da base. Ele é cego a buraco no meio, e
 * buraco no meio é o que muda a média sem mudar a data mais recente.
 *
 * ✅ O que este medidor faz: cada casa é comparada com ELA MESMA. Uma casa que
 * publicou 13 rodadas de 7 em 7 dias e está calada há 18 é anomalia; uma casa
 * que publica de 28 em 28 dias e está calada há 18 é rotina. Comparar casa com
 * casa não diria nada, porque as cadências são diferentes por natureza.
 *
 * ⚠️ ISTO NÃO É PORTÃO DE BLOQUEIO, é aviso. Casa calada não corrompe dado
 * nenhum: o que já está no arquivo segue certo. Bloquear a publicação por algo
 * que não podemos consertar do nosso lado só criaria trava que se aprende a
 * ignorar.
 *
 * ⛔ E, como o atraso global, NÃO entra no objeto `dados`. Mesmo motivo, mesma
 * regra: `public/us-polls-data.json` é servido em público, e "a YouGov está
 * calada há 18 dias" é fato sobre a NOSSA coleta, não sobre a eleição.
 * Ver memory/feedback_descrever_o_metodo_sim_relatar_a_falha_nao.md
 */

/** Rodadas de menos não definem cadência: dois intervalos não têm mediana útil. */
export const MIN_RODADAS_PARA_CADENCIA = 5

/**
 * Só olha o passado recente. Casa que era semanal em março e virou mensal em
 * julho tem de ser cobrada pela cadência de julho, senão o medidor acusa uma
 * mudança de rotina como se fosse buraco.
 */
export const JANELA_CADENCIA_DIAS = 180

/** Dois ciclos perdidos. Um só é atraso banal de publicação. */
export const CICLOS_PARA_ATRASO = 2

const DIA_MS = 86_400_000
const soData = (d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)
const emDias = (de, ate) => Math.floor((ate - new Date(`${de}T00:00:00Z`).getTime()) / DIA_MS)

/**
 * Cadência de cada casa e há quanto tempo ela está calada, contado em CICLOS
 * dela mesma. `ciclosPerdidos` é o número que importa: 2,6 quer dizer que ela
 * já deixou de publicar duas rodadas e meia do próprio ritmo.
 */
export function medirCadencia(dados, agora = new Date()) {
  const t = agora.getTime()
  const limite = new Date(t - JANELA_CADENCIA_DIAS * DIA_MS).toISOString().slice(0, 10)

  // Uma casa pode publicar vários recortes da MESMA rodada (LV, RV, adultos).
  // Contar linha em vez de rodada inflaria a frequência e faria toda casa
  // parecer mais atrasada do que é. A unidade é a data de campo distinta.
  const rodadasPorCasa = new Map()
  for (const p of dados?.polls ?? []) {
    if (!p?.instituto || !soData(p.campoFim) || p.campoFim < limite) continue
    if (!rodadasPorCasa.has(p.instituto)) rodadasPorCasa.set(p.instituto, new Set())
    rodadasPorCasa.get(p.instituto).add(p.campoFim)
  }

  const avaliadas = []
  for (const [instituto, set] of rodadasPorCasa) {
    const datas = [...set].sort()
    if (datas.length < MIN_RODADAS_PARA_CADENCIA) continue

    const intervalos = []
    for (let i = 1; i < datas.length; i++) {
      intervalos.push(emDias(datas[i - 1], new Date(`${datas[i]}T00:00:00Z`).getTime()))
    }
    intervalos.sort((a, b) => a - b)
    // Mediana, não média: uma pausa de férias no meio da série puxaria a média
    // para cima e o medidor pararia de enxergar o silêncio seguinte.
    const cadenciaDias = Math.max(1, intervalos[Math.floor(intervalos.length / 2)])

    const ultimoCampo = datas[datas.length - 1]
    const silencioDias = emDias(ultimoCampo, t)
    avaliadas.push({
      instituto,
      rodadas: datas.length,
      cadenciaDias,
      ultimoCampo,
      silencioDias,
      ciclosPerdidos: Number((silencioDias / cadenciaDias).toFixed(1)),
    })
  }

  avaliadas.sort((a, b) => b.ciclosPerdidos - a.ciclosPerdidos)
  return {
    avaliadas,
    atrasadas: avaliadas.filter((c) => c.ciclosPerdidos >= CICLOS_PARA_ATRASO),
  }
}

/**
 * Quais casas alertam HOJE.
 *
 * Mesmo problema do atraso global: o silêncio cresce 1 por dia e alertar por
 * nível mandaria email todo santo dia enquanto a casa estiver parada. Aqui o
 * marco é o fim de cada CICLO dela: `silencioDias % cadenciaDias === 0` acende
 * uma vez a cada cadência, isto é, uma vez por semana para uma casa semanal.
 *
 * ⚠️ Mesmo preço consciente do `cruzouMarco`: se o cron pular exatamente o dia
 * do marco, o marco é pulado e o próximo ciclo pega. É de propósito, para não
 * ter de guardar estado.
 */
export function cadenciaCruzouMarco(c) {
  return (
    c &&
    c.ciclosPerdidos >= CICLOS_PARA_ATRASO &&
    c.cadenciaDias > 0 &&
    c.silencioDias % c.cadenciaDias === 0
  )
}
