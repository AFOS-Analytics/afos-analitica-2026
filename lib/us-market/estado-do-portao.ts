/**
 * ❓ A distribuição reprovou hoje. ISSO MERECE NOTA, ou é o que ela faz sempre?
 *
 * ─── POR QUE ESTE ARQUIVO EXISTE ────────────────────────────────────────────
 *
 * A régua já estava escrita, no `/atualizar-usa`, com estas palavras:
 *
 *     "Reprovação intermitente é o estado NORMAL desses dois, não notícia.
 *      Quem decide é a série das últimas 24h, não o instante."
 *
 * E nada na rodada media isso. O passo 1 imprime `❌ REPROVADO` e a decisão de
 * publicar ou não ficava com quem estivesse rodando, de cabeça ou rodando o
 * `check-distribuicao.ts` uma vez por mercado.
 *
 * 🔴 Medido em 15/Set/2026, e custou quatro comandos à mão: `governors` caiu de
 * 98,25% para 94,20% e cruzou o corte. Para saber se aquilo era notícia era
 * preciso descobrir que aquele book fecha em 433 de 536 capturas (80,78%), o
 * que faz da reprovação um EVENTO, enquanto `houseSeats` reprovando é o estado
 * normal dele, porque fecha em 36,17%. Os dois saem com o mesmo `❌` na tela.
 *
 * 🔑 Regra escrita que ninguém mede na rodada é regra que não roda.
 * Ver memory/feedback_regra_que_depende_de_numero_que_ninguem_grava.md
 *
 * ─── AS DUAS COISAS QUE ELE SEPARA, E ELAS SÃO DIFERENTES ───────────────────
 *
 * 1. **O corte está dentro do ruído?** Medido em 10/Ago/2026, o portão virou
 *    SEIS vezes em dez capturas do book do Senado, e o trecho do meio foi
 *    104,90 → 106,00 → 105,40 → 104,40: o livro mal se moveu e o quadro trocou
 *    de identidade três vezes. Publicar isso como troca de estado é vender
 *    ruído por notícia.
 *    Ver memory/reference_portao_de_corte_duro_em_grandeza_ruidosa.md
 *
 * 2. **Este veredito é o minoritário DESTE book?** Reprovação é rotina em uns
 *    e evento em outros, e o `❌` é o mesmo nos dois.
 *
 * ⛔ O que ele NÃO faz: não decide publicar. Distribuição reprovada não vai ao
 * ar como se valesse em nenhuma das leituras, e isso não está em discussão. Ele
 * decide se a reprovação entra no RELATÓRIO como movimento.
 *
 * ⚠️ E ele não redeclara 95 e 105: importa do `portao.ts`, que é o dono da
 * régua desde 10/Ago. Duas cópias convivem sem incidente até o dia em que uma é
 * corrigida e a outra não.
 */
import { fechaOPortao, SOMA_MIN, SOMA_MAX } from './portao'

/** Uma captura da série: o instante e a soma das faixas naquele instante. */
export interface CapturaDaSoma {
  /** epoch em ms */
  t: number
  /** soma das faixas, em pontos percentuais */
  soma: number
}

export type LeituraDoPortao =
  | 'ESTADO NORMAL'
  | 'EVENTO'
  | 'OSCILANDO'
  | 'NA BORDA'
  | 'TRAVESSIA NAO CONFIRMADA'
  | 'INDETERMINADO'

export interface EstadoDoPortao {
  veredito: 'PASSOU' | 'REPROVOU'
  soma: number
  /** pp até o corte mais próximo, 95 ou 105 */
  distanciaDaBorda: number
  naBorda: boolean
  janela: {
    horas: number
    n: number
    passou: number
    reprovou: number
    /** quantas vezes o veredito trocou dentro da janela */
    viradas: number
    /** soma da última menos a da primeira, na janela. null com menos de 2 capturas */
    derivaPp: number | null
  }
  historico: { n: number; passou: number; taxaPassagem: number } | null
  leitura: LeituraDoPortao
  motivo: string
}

/**
 * Mínimo de capturas na janela para dizer qualquer coisa sobre ela.
 *
 * Com três capturas, "virou uma vez" e "oscila" são indistinguíveis. Abaixo
 * disso o honesto é INDETERMINADO, nunca ESTADO NORMAL.
 */
export const MINIMO_NA_JANELA = 4

/**
 * Mínimo de capturas na série inteira para dizer o que é NORMAL neste book.
 *
 * ⚠️ Um book novo, com seis capturas, daria "reprova sempre" com uma confiança
 * que seis pontos não sustentam. Foi exatamente o que aconteceu em 10/Ago: esta
 * casa publicou um ranking de solidez com 6 capturas e a série de 37 dias o
 * DESMENTIU em 04/Set.
 */
export const MINIMO_NO_HISTORICO = 20

/** Dentro disto do corte, a leitura pode virar por ruído de sobrepreço. */
export const BORDA_PP = 1

/**
 * ⭐ A deriva que TIRA a borda de cena, e este limiar nasceu de um caso real.
 *
 * `NA BORDA` existe para impedir que meio ponto de sobrepreço vire manchete de
 * troca de estado. Ele supõe que o valor está perto do corte por oscilação.
 *
 * 🔴 Em 15/Set/2026 essa suposição falhou: `governors` fechou a 94,20%, a
 * 0,80pp do corte, o que é borda pela distância. Só que ele veio de 101,30% e
 * caiu de forma quase monótona ao longo das 24h, com UMA travessia. Sete pontos
 * numa direção só não são ruído de sobrepreço: é o livro se esvaziando, e
 * chamar aquilo de "na borda" apagaria o movimento.
 *
 * 📐 O limiar é o DOBRO da própria faixa de borda: se o livro andou mais do que
 * duas vezes a zona que a casa chama de ruído, a travessia não é ruído. Abaixo
 * disso a borda continua mandando.
 *
 * ⚠️ A distância do corte NÃO some quando isto dispara: `naBorda` segue
 * verdadeiro no resultado, e quem imprime tem de dizer as duas coisas. Uma
 * travessia por movimento real que parou a 0,80pp do corte pode voltar amanhã.
 */
export const DERIVA_QUE_DOMINA_A_BORDA = 2 * BORDA_PP

const HORAS_DA_JANELA = 24
const HORA_MS = 3_600_000

/**
 * @param soma       a soma de AGORA, que vem da leitura ao vivo e ainda não
 *                   está na série gravada
 * @param capturas   a série gravada inteira, em qualquer ordem
 * @param agora      instante de referência, injetável para o teste
 */
export function classificarPortao(
  soma: number,
  capturas: CapturaDaSoma[] | null | undefined,
  opts: { agora?: Date; horasDaJanela?: number } = {},
): EstadoDoPortao {
  const { agora = new Date(), horasDaJanela = HORAS_DA_JANELA } = opts

  const veredito: 'PASSOU' | 'REPROVOU' = fechaOPortao(soma) ? 'PASSOU' : 'REPROVOU'
  const distanciaDaBorda = Math.min(Math.abs(soma - SOMA_MIN), Math.abs(soma - SOMA_MAX))
  const naBorda = distanciaDaBorda <= BORDA_PP

  const todas = (capturas ?? [])
    .filter((c) => c && Number.isFinite(c.t) && Number.isFinite(c.soma))
    .slice()
    .sort((a, b) => a.t - b.t)

  const corte = agora.getTime() - horasDaJanela * HORA_MS
  const naJanela = todas.filter((c) => c.t >= corte)

  let viradas = 0
  for (let i = 1; i < naJanela.length; i++) {
    if (fechaOPortao(naJanela[i].soma) !== fechaOPortao(naJanela[i - 1].soma)) viradas++
  }

  const janela = {
    horas: horasDaJanela,
    n: naJanela.length,
    passou: naJanela.filter((c) => fechaOPortao(c.soma)).length,
    reprovou: naJanela.filter((c) => !fechaOPortao(c.soma)).length,
    viradas,
    derivaPp:
      naJanela.length >= 2
        ? Number((naJanela[naJanela.length - 1].soma - naJanela[0].soma).toFixed(2))
        : null,
  }

  const passouNoTodo = todas.filter((c) => fechaOPortao(c.soma)).length
  const historico =
    todas.length > 0
      ? { n: todas.length, passou: passouNoTodo, taxaPassagem: passouNoTodo / todas.length }
      : null

  const base = { veredito, soma, distanciaDaBorda: Number(distanciaDaBorda.toFixed(2)), naBorda, janela, historico }

  // ── 1. anti-silêncio: sem material, não se diz "normal" ────────────────
  if (janela.n < MINIMO_NA_JANELA) {
    return {
      ...base,
      leitura: 'INDETERMINADO',
      motivo: `${janela.n} captura(s) nas ultimas ${horasDaJanela}h, abaixo do minimo de ${MINIMO_NA_JANELA}: nao da para dizer se virou`,
    }
  }
  if (!historico || historico.n < MINIMO_NO_HISTORICO) {
    return {
      ...base,
      leitura: 'INDETERMINADO',
      motivo: `serie com ${historico?.n ?? 0} captura(s), abaixo do minimo de ${MINIMO_NO_HISTORICO}: nao da para dizer o que e NORMAL neste book`,
    }
  }

  // ── 2. UMA leitura não é um estado ─────────────────────────────────────
  //
  // ⭐ Aprendido no dia em que este arquivo nasceu, 15/Set/2026. Às 16:11Z a
  // leitura ao vivo de `governors` deu 94,20%, abaixo do corte, e a série de 24h
  // tinha 14 capturas TODAS acima. Meia hora depois a leitura ao vivo deu
  // 95,50% e passou. A travessia existiu num instante que a grade de 30 minutos
  // nunca gravou, e chamá-la de EVENTO teria posto no relatório um movimento
  // que não se sustentou.
  //
  // 🔑 A casa já tem essa régua para PREÇO: a trava de captura faz duas leituras
  // a 8 minutos porque uma leitura sozinha é um book em trânsito, não um preço.
  // O portão das distribuições nunca teve o equivalente. Isto é ele.
  //
  // ⚠️ A ambiguidade é real e não se resolve aqui: pode ser ruído, e pode ser o
  // primeiro instante de um movimento de verdade. Por isso o veredito é NÃO
  // CONFIRMADA e a ação é reler, nunca "ignorar".
  const vereditoDaJanela: 'PASSOU' | 'REPROVOU' | null =
    janela.passou === janela.n ? 'PASSOU' : janela.reprovou === janela.n ? 'REPROVOU' : null
  if (vereditoDaJanela && veredito !== vereditoDaJanela) {
    return {
      ...base,
      leitura: 'TRAVESSIA NAO CONFIRMADA',
      motivo: `a leitura de agora ${veredito === 'PASSOU' ? 'fecha' : 'reprova'} e as ${janela.n} capturas gravadas nas ultimas ${horasDaJanela}h fizeram o CONTRARIO, todas: uma leitura nao e um estado, RELER antes de relatar`,
    }
  }

  // ── 3. o corte dentro do ruído vence tudo ──────────────────────────────
  if (viradas >= 2) {
    return {
      ...base,
      leitura: 'OSCILANDO',
      motivo: `o portao virou ${viradas}x em ${horasDaJanela}h: o corte esta DENTRO do ruido do livro, nao publicar troca de estado como movimento`,
    }
  }
  const derivaDomina = janela.derivaPp != null && Math.abs(janela.derivaPp) > DERIVA_QUE_DOMINA_A_BORDA
  if (naBorda && !derivaDomina) {
    return {
      ...base,
      leitura: 'NA BORDA',
      motivo: `a ${base.distanciaDaBorda}pp do corte e a serie andou ${janela.derivaPp ?? 0}pp em ${horasDaJanela}h: a proxima leitura pode virar por sobrepreco, entao a troca de estado nao e fato sobre a disputa`,
    }
  }

  // ── 4. este veredito é rotina ou minoria neste book? ───────────────────
  const maioria: 'PASSOU' | 'REPROVOU' = historico.taxaPassagem >= 0.5 ? 'PASSOU' : 'REPROVOU'
  const pct = (historico.taxaPassagem * 100).toFixed(2).replace('.', ',')
  // ⚠️ A borda não some quando a deriva manda: ela vira ressalva na frase, e
  // quem imprime tem de repetir as duas coisas. Travessia por movimento real
  // que parou a menos de 1pp do corte pode voltar amanhã.
  const ressalvaDaBorda = naBorda
    ? ` ⚠️ ainda a ${base.distanciaDaBorda}pp do corte, entao pode voltar`
    : ''
  if (veredito === maioria) {
    return {
      ...base,
      leitura: 'ESTADO NORMAL',
      motivo: `este book ${maioria === 'PASSOU' ? 'fecha' : 'reprova'} na maioria das capturas (passa em ${pct}% de ${historico.n}): hoje ele fez o de sempre${ressalvaDaBorda}`,
    }
  }
  const comoAtravessou = derivaDomina
    ? `, e a serie andou ${janela.derivaPp}pp em ${horasDaJanela}h, o que e movimento do livro e nao ruido de sobrepreco`
    : ''
  return {
    ...base,
    leitura: 'EVENTO',
    motivo: `este book ${maioria === 'PASSOU' ? 'fecha' : 'reprova'} na maioria das capturas (passa em ${pct}% de ${historico.n}) e hoje fez o CONTRARIO${comoAtravessou}: merece nota${ressalvaDaBorda}`,
  }
}
