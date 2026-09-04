/**
 * amplitude-livro.mjs — a AMPLITUDE do dia de um contrato, e o veredito de se o
 * bloqueio da trava é ESTRUTURAL ou passageiro.
 *
 * 🔴 POR QUE ISTO EXISTE. Em 04/Set/2026 a trava de captura bloqueou o contrato
 * de impeachment no Supremo em DUAS rodadas seguidas, e a página estava servindo
 * 7,40% de 03/Set enquanto o livro andava perto de 16%. O André mandou publicar.
 *
 * A série gravada mostrou que o bloqueio não era acidente: naquele dia o
 * contrato percorreu 8,70pp com USD 28 de dinheiro novo. Duas leituras a oito
 * minutos NUNCA vão concordar dentro de 0,20pp num livro assim, então esperar
 * não resolve. Já o Senado, bloqueado por 0,70pp na mesma rodada, passou na
 * seguinte: aquele era passageiro.
 *
 * 🔑 A DISTINÇÃO É MENSURÁVEL, e é ela que decide o que fazer:
 *   • amplitude do dia GRANDE contra a tolerância → estrutural, publicar com a
 *     faixa ao lado e a exceção declarada;
 *   • amplitude PEQUENA → passageiro, recapturar, que é a régua de sempre.
 *
 * ⚠️ A CAUDA CEGA DO BACKUP ENTRA NA CONTA. O backup do Neon é gerado uma vez
 * por dia e a série viva cresce de 30 em 30 minutos, então entre o último ponto
 * gravado e a captura de agora há até 24h sem medição. Consequências, as duas
 * obrigatórias:
 *   1. a leitura de AGORA entra na faixa, senão o painel mostra um número FORA
 *      da própria faixa que publica;
 *   2. a faixa é um PISO, não os extremos do dia. O texto tem de dizer "nas
 *      leituras gravadas", nunca "percorreu de X a Y", que afirma extremos que
 *      ninguém mediu.
 * → memory/feedback_o_backup_tem_uma_cauda_cega_de_ate_um_dia.md
 */

/** Um ponto: { hora, preco, volume }. */
export function faixaDoDia(pontos, leituraAgora = null) {
  const todos = [...pontos]
  if (leituraAgora != null && Number.isFinite(leituraAgora)) {
    todos.push({ hora: 'agora', preco: leituraAgora, volume: null })
  }
  if (todos.length === 0) return null

  const precos = todos.map((p) => p.preco).filter(Number.isFinite)
  if (precos.length === 0) return null
  const vols = pontos.map((p) => p.volume).filter((v) => Number.isFinite(v))

  const min = Math.min(...precos)
  const max = Math.max(...precos)
  return {
    n: pontos.length,
    nComAgora: todos.length,
    min: Number(min.toFixed(2)),
    max: Number(max.toFixed(2)),
    amplitude: Number((max - min).toFixed(2)),
    dinheiroNovo: vols.length >= 2 ? Math.round(Math.max(...vols) - Math.min(...vols)) : null,
    // 🔑 A leitura de agora esta DENTRO da faixa gravada? Se nao, ela e que
    // esticou a faixa, e isso precisa ser dito, nao escondido.
    agoraEsticouAFaixa:
      leituraAgora != null && precos.length > 1
        ? leituraAgora < Math.min(...pontos.map((p) => p.preco)) || leituraAgora > Math.max(...pontos.map((p) => p.preco))
        : false,
  }
}

/**
 * O bloqueio é estrutural?
 *
 * ⛔ `fator` NÃO é enfeite: com 1 a régua diria que qualquer bloqueio é
 * estrutural, e a exceção viraria a norma. O padrão 10 quer dizer que o livro
 * atravessa, num dia, dez vezes o que a trava tolera em oito minutos.
 *
 * ⚠️ Devolve INDETERMINADO quando a amostra do dia é pequena demais. Amplitude
 * calculada sobre 2 pontos não é amplitude, é a distância entre dois pontos.
 * → memory/feedback_superlativo_de_serie_vs_hora_da_captura.md
 */
export function vereditoBloqueio(faixa, toleranciaPp = 0.2, fator = 10, minPontos = 6) {
  if (!faixa) return { veredito: 'SEM_SERIE', motivo: 'sem pontos gravados para o dia' }
  if (faixa.n < minPontos) {
    return {
      veredito: 'INDETERMINADO',
      motivo: `só ${faixa.n} ponto(s) gravado(s) no dia, abaixo do mínimo de ${minPontos}. Amplitude sobre amostra curta não decide nada.`,
    }
  }
  const limite = Number((toleranciaPp * fator).toFixed(2))
  if (faixa.amplitude >= limite) {
    return {
      veredito: 'ESTRUTURAL',
      limite,
      motivo: `o livro percorreu ${faixa.amplitude}pp no dia, contra tolerância de ${toleranciaPp}pp em oito minutos. Recapturar não resolve.`,
    }
  }
  return {
    veredito: 'PASSAGEIRO',
    limite,
    motivo: `amplitude de ${faixa.amplitude}pp no dia, abaixo de ${limite}pp. Recapturar, que é a régua de sempre.`,
  }
}
