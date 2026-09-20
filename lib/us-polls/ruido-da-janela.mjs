/**
 * ruido-da-janela.mjs — quanto do movimento que o painel publica é do MUNDO e
 * quanto é da nossa janela móvel de 30 dias?
 *
 * 🔴 POR QUE ISTO EXISTE, medido em 19/Set/2026: a `projetarJanela` já dizia
 *    que, com ZERO pesquisa nova, a vantagem servida passearia de D+6,00 a
 *    D+8,33, uma amplitude de 2,33pp. E a série gravada no Neon, 45 registros
 *    de 06/Ago a 19/Set, mostrou a vantagem indo de D+5,00 a D+6,69, uma
 *    amplitude de 1,69pp.
 *
 * ⭐ Ou seja: **o mecanismo sozinho alcança mais movimento do que a série
 *    inteira mostrou.** Os dois números existiam há semanas, em dois scripts
 *    diferentes, e ninguém os tinha posto lado a lado.
 *
 * ⛔ ISTO NÃO É "SINAL CONTRA RUÍDO", e chamar assim seria rótulo errado.
 *    A amplitude observada JÁ CONTÉM a mecânica da janela: ela não é sinal
 *    puro. A comparação honesta é entre o movimento TOTAL que a série mostrou
 *    e o movimento que a janela sozinha consegue produzir. Quando o segundo
 *    alcança o primeiro, a conclusão não é "não houve intenção de voto": é que
 *    a série publicada **não permite separar** uma coisa da outra.
 *    Ver memory/feedback_rotulo_diz_do_que_o_numero_e.md
 *
 * 📌 E a projeção é um CONTRAFACTUAL congelado: ela supõe nenhuma pesquisa
 *    nova por 30 dias, o que a seis semanas da eleição não vai acontecer. Ela
 *    mede o que o mecanismo PODE fazer, não o que vai fazer.
 *
 * ⛔ USO INTERNO. Descreve a sensibilidade do nosso método, não o eleitorado.
 *    Publicar isso como leitura de intenção de voto seria atribuir ao mundo o
 *    que é da nossa coleta.
 *    Ver memory/feedback_descrever_o_metodo_sim_relatar_a_falha_nao.md
 */

/** Mínimo de registros do Neon para a amplitude observada significar algo. */
export const MIN_REGISTROS = 10

export const VEREDITOS = {
  MECANISMO_ALCANCA: 'MECANISMO ALCANCA O OBSERVADO',
  OBSERVADO_MAIOR: 'OBSERVADO ACIMA DO MECANISMO',
  INDETERMINADO: 'INDETERMINADO',
}

/**
 * Amplitude da vantagem servida ao longo dos registros gravados.
 *
 * 🕳️ Anti-silêncio: registro ilegível e vantagem não numérica saem da conta e
 *    são CONTADOS. Amplitude calculada sobre base que encolheu sem avisar é a
 *    forma mais fácil de publicar um piso que não existe.
 */
export function amplitudeObservada(registros) {
  if (!Array.isArray(registros)) {
    throw new TypeError('amplitudeObservada espera um array de registros')
  }
  const usaveis = []
  let descartados = 0
  for (const r of registros) {
    const v = r?.vantagemDem
    if (r?.ilegivel || typeof v !== 'number' || !Number.isFinite(v)) {
      descartados++
      continue
    }
    usaveis.push({ dia: r.lastUpdate ?? null, v })
  }
  if (usaveis.length === 0) {
    return { n: 0, descartados, min: null, max: null, amplitudePp: null, emMin: null, emMax: null }
  }
  let min = usaveis[0]
  let max = usaveis[0]
  for (const u of usaveis) {
    if (u.v < min.v) min = u
    if (u.v > max.v) max = u
  }
  return {
    n: usaveis.length,
    descartados,
    min: min.v,
    max: max.v,
    emMin: min.dia,
    emMax: max.dia,
    amplitudePp: Number((max.v - min.v).toFixed(2)),
  }
}

/**
 * Põe as duas amplitudes lado a lado.
 *
 * @param {{amplitudePp: number|null, vantagemMin: number|null, vantagemMax: number|null, esvaziaEm: string|null}} projecao
 *   saída de `projetarJanela`, que já traz a amplitude pronta
 * @param {{n: number, amplitudePp: number|null}} observada  saída de `amplitudeObservada`
 */
export function compararRuido(projecao, observada) {
  const mec = projecao?.amplitudePp
  const obs = observada?.amplitudePp

  if (!Number.isFinite(mec) || !Number.isFinite(obs)) {
    return {
      veredito: VEREDITOS.INDETERMINADO,
      motivo: !Number.isFinite(mec)
        ? 'a projeção não produziu amplitude: base sem data de campo legível ou janela já vazia'
        : 'a série do Neon não produziu amplitude: nenhum registro com vantagem numérica',
      mecanismoPp: Number.isFinite(mec) ? mec : null,
      observadaPp: Number.isFinite(obs) ? obs : null,
      razao: null,
    }
  }

  if (observada.n < MIN_REGISTROS) {
    return {
      veredito: VEREDITOS.INDETERMINADO,
      motivo: `apenas ${observada.n} registro(s) usáveis no Neon, abaixo do mínimo de ${MIN_REGISTROS}. Amplitude sobre série curta é a distância entre dois pontos`,
      mecanismoPp: mec,
      observadaPp: obs,
      razao: null,
    }
  }

  // Razão só existe com denominador não nulo. Série absolutamente parada é
  // caso real (a média pode ficar congelada por dias) e não pode virar
  // divisão por zero disfarçada de número enorme.
  const razao = obs === 0 ? null : Number((mec / obs).toFixed(2))

  return {
    veredito: mec >= obs ? VEREDITOS.MECANISMO_ALCANCA : VEREDITOS.OBSERVADO_MAIOR,
    motivo:
      mec >= obs
        ? `com zero pesquisa nova a janela produz ${mec.toFixed(2)}pp, e a série inteira mostrou ${obs.toFixed(2)}pp. A série publicada não permite separar intenção de voto da mecânica da janela`
        : `a série mostrou ${obs.toFixed(2)}pp e a janela sozinha produz ${mec.toFixed(2)}pp, então há movimento acima do que o mecanismo explica`,
    mecanismoPp: mec,
    observadaPp: obs,
    razao,
  }
}
