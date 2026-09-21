/**
 * ruido-da-janela.mjs — quanto do movimento que o painel publica é do MUNDO e
 * quanto é da nossa janela móvel de 30 dias?
 *
 * 🔴 POR QUE ISTO EXISTE, medido em 19/Set/2026: a `projetarJanela` já dizia
 *    que, com ZERO pesquisa nova, a vantagem servida passearia de D+6,00 a
 *    D+8,33, uma amplitude de 2,33pp. E a série gravada no Neon mostrou a
 *    vantagem indo de D+5,00 a D+6,82, uma amplitude de 1,82pp.
 *
 * ⭐ Ou seja: **o mecanismo sozinho alcança mais movimento do que a série
 *    inteira mostrou.** Os dois números existiam há semanas, em dois scripts
 *    diferentes, e ninguém os tinha posto lado a lado.
 *
 * 📏 ERRATA de 20/Set/2026, e ela é da NOSSA consulta: este cabeçalho dizia
 *    "45 registros de 06/Ago a 19/Set" e "1,69pp", e os dois vinham de uma
 *    consulta TRUNCADA. O `take` do script nascia em 45, e em 19/Set a série
 *    já tinha 52 linhas. O que ficou de fora foi 30/Jul, D+6,82, que é o
 *    MÁXIMO da série: o teto cortou exatamente o extremo, como sempre corta.
 *    Amplitude verdadeira 1,82pp e razão 1,28x, não 1,69pp e 1,38x.
 *
 * 🔑 A ASSIMETRIA que torna o conserto barato, e ela é o motivo de haver um
 *    veredito a mais aqui: a consulta pede os N mais RECENTES, então o que o
 *    teto corta é sempre o passado. Acrescentar registros a uma série só pode
 *    baixar o mínimo ou subir o máximo, nunca o contrário, então a amplitude
 *    observada é MONOTÔNICA: truncada, ela é sempre um PISO.
 *      · `OBSERVADO ACIMA DO MECANISMO` sobrevive ao truncamento, porque
 *        destruncar só aumenta o lado que já venceu. A conclusão fica de pé.
 *      · `MECANISMO ALCANCA` NÃO sobrevive: ele compara contra um piso, e o
 *        piso pode subir acima do mecanismo. É o único que pode VIRAR, e por
 *        isso é o único que degrada.
 *    ⛔ Degradar os dois faria o medidor reclamar todo dia, e medidor que
 *       reclama todo dia é medidor que alguém aprende a pular.
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
  /** O mesmo, sobre série TRUNCADA: o observado é piso e o veredito pode virar. */
  MECANISMO_ALCANCA_SOBRE_PISO: 'MECANISMO ALCANCA SOBRE PISO',
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
 * @param {{truncada?: boolean}} [opcoes]  `truncada` quando a consulta ao Neon
 *   encostou no próprio teto, ou seja quando a série pode ser mais longa do que
 *   o que foi medido. Ver a assimetria no cabeçalho: só o veredito que compara
 *   CONTRA o observado degrada, porque só ele pode virar.
 */
export function compararRuido(projecao, observada, opcoes = {}) {
  const mec = projecao?.amplitudePp
  const obs = observada?.amplitudePp
  // Só `true` literal trunca. Qualquer outra coisa (undefined, string, 1) é
  // tratada como série inteira, porque o padrão silencioso aqui tem de ser o
  // veredito FORTE: quem trunca é quem sabe que truncou, e tem de dizer.
  const truncada = opcoes?.truncada === true

  if (!Number.isFinite(mec) || !Number.isFinite(obs)) {
    return {
      veredito: VEREDITOS.INDETERMINADO,
      motivo: !Number.isFinite(mec)
        ? 'a projeção não produziu amplitude: base sem data de campo legível ou janela já vazia'
        : 'a série do Neon não produziu amplitude: nenhum registro com vantagem numérica',
      mecanismoPp: Number.isFinite(mec) ? mec : null,
      observadaPp: Number.isFinite(obs) ? obs : null,
      razao: null,
      truncada,
    }
  }

  if (observada.n < MIN_REGISTROS) {
    return {
      veredito: VEREDITOS.INDETERMINADO,
      motivo: `apenas ${observada.n} registro(s) usáveis no Neon, abaixo do mínimo de ${MIN_REGISTROS}. Amplitude sobre série curta é a distância entre dois pontos`,
      mecanismoPp: mec,
      observadaPp: obs,
      razao: null,
      truncada,
    }
  }

  // Razão só existe com denominador não nulo. Série absolutamente parada é
  // caso real (a média pode ficar congelada por dias) e não pode virar
  // divisão por zero disfarçada de número enorme.
  const razao = obs === 0 ? null : Number((mec / obs).toFixed(2))

  if (mec >= obs) {
    return {
      veredito: truncada ? VEREDITOS.MECANISMO_ALCANCA_SOBRE_PISO : VEREDITOS.MECANISMO_ALCANCA,
      motivo: truncada
        ? `com zero pesquisa nova a janela produz ${mec.toFixed(2)}pp contra os ${obs.toFixed(2)}pp que a consulta viu, mas a consulta ENCOSTOU no próprio teto: ${obs.toFixed(2)}pp é PISO e o veredito VIRA assim que a série inteira passar de ${mec.toFixed(2)}pp. Refazer sem teto antes de usar a frase`
        : `com zero pesquisa nova a janela produz ${mec.toFixed(2)}pp, e a série inteira mostrou ${obs.toFixed(2)}pp. A série publicada não permite separar intenção de voto da mecânica da janela`,
      mecanismoPp: mec,
      observadaPp: obs,
      razao,
      truncada,
    }
  }

  return {
    veredito: VEREDITOS.OBSERVADO_MAIOR,
    motivo:
      `a série mostrou ${obs.toFixed(2)}pp e a janela sozinha produz ${mec.toFixed(2)}pp, então há movimento acima do que o mecanismo explica` +
      (truncada
        ? `. A consulta encostou no teto, e isso só REFORÇA o veredito: destruncar a série só alarga o observado`
        : ''),
    mecanismoPp: mec,
    observadaPp: obs,
    razao,
    truncada,
  }
}
