/**
 * Quando o arquivo da data CORRENTE da imprensa dos EUA pode ser criado.
 *
 * 🔴 POR QUE EXISTE, medido em 05/Set e reencontrado em 15/Set/2026.
 *
 * O arquivador congela o que o Neon tiver na hora em que roda, e o contrato é
 * que data encerrada nunca é reescrita. Então o arquivo de um dia é, para
 * sempre, a coleta do INSTANTE em que foi criado, a não ser que alguém rode de
 * novo antes de o dia UTC virar. Medido sobre 38 datas em 05/Set: arquivo tirado
 * às 19:20Z ou depois bateu com o banco 10 de 10; tirado às 02:28Z bateu 0 de 10;
 * e 24 dos 38 tinham sido escritos antes do último cron do dia.
 *
 * A regra operacional ("rodar depois das 19:20 UTC") existia só como texto
 * impresso pelo `defasagem-do-arquivo-imprensa.ts`, e nenhum código a aplicava.
 * Em 15/Set, às 01:10Z, o ensaio propôs criar `2026-09-15.json` com a coleta da
 * madrugada: exatamente o caso 0 de 10.
 *
 * ✅ A decisão: data corrente SEM arquivo, antes do último cron do dia mais uma
 * folga, é ADIADA. Nada se perde, porque o Neon guarda o registro do dia e a
 * próxima passada, de qualquer dia, cria o arquivo a partir dele já completo.
 * Data corrente COM arquivo continua sendo REGERADA: trocar parcial por parcial
 * mais nova só melhora.
 *
 * 🔑 O horário do último cron sai do `vercel.json`, não de uma constante: a
 * agenda muda sem avisar quem copiou o número. Agenda ilegível adia, porque
 * adiar é a direção que não congela nada.
 */

/** Minutos de folga depois do último cron, para a coleta terminar de gravar. */
export const FOLGA_MIN = 10

/**
 * `"20 7,13,19 * * *"` -> `{ hora: 19, minuto: 20 }`. Só entende minuto fixo e
 * lista de horas, que é a forma que a agenda da imprensa usa. Qualquer outra
 * forma devolve null, e quem chama trata null como "não sei", nunca como "já
 * passou".
 */
export function ultimoCronDoDia(schedule) {
  if (typeof schedule !== 'string') return null
  const partes = schedule.trim().split(/\s+/)
  if (partes.length !== 5) return null
  const [min, horas, dia, mes, semana] = partes
  if (!/^\d{1,2}$/.test(min) || !/^\d{1,2}(,\d{1,2})*$/.test(horas)) return null
  if (dia !== '*' || mes !== '*' || semana !== '*') return null
  const minuto = Number(min)
  const lista = horas.split(',').map(Number)
  if (minuto > 59 || lista.some((h) => h > 23)) return null
  return { hora: Math.max(...lista), minuto }
}

/** Lê a agenda de uma rota dentro do conteúdo do `vercel.json`. */
export function agendaDaRota(vercelJson, rota) {
  const crons = vercelJson?.crons
  if (!Array.isArray(crons)) return null
  return crons.find((c) => c?.path === rota)?.schedule ?? null
}

export const ACOES = { CRIAR: 'CRIAR', REGERAR: 'REGERAR', ADIAR: 'ADIAR' }

/**
 * Decide o que fazer com a data CORRENTE (`iso` igual ao dia UTC de `agora`).
 * Datas passadas não passam por aqui: elas seguem a regra de data encerrada.
 */
export function decidirDataCorrente({ jaExiste, agora, ultimoCron, forcar = false }) {
  if (jaExiste) {
    return { acao: ACOES.REGERAR, motivo: 'data corrente com arquivo: regerar só troca parcial por parcial mais nova' }
  }
  if (forcar) {
    return { acao: ACOES.CRIAR, motivo: 'criação forçada com --dia-corrente, ciente de que pode congelar parcial' }
  }
  if (!ultimoCron) {
    return { acao: ACOES.ADIAR, motivo: 'agenda do cron ilegível: adiar é a direção que não congela nada' }
  }
  const t = agora instanceof Date ? agora : new Date(agora)
  if (Number.isNaN(t.getTime())) {
    return { acao: ACOES.ADIAR, motivo: 'relógio ilegível: adiar' }
  }
  const minutosDoDia = t.getUTCHours() * 60 + t.getUTCMinutes()
  const limite = ultimoCron.hora * 60 + ultimoCron.minuto + FOLGA_MIN
  if (minutosDoDia < limite) {
    const hh = String(Math.floor(limite / 60)).padStart(2, '0')
    const mm = String(limite % 60).padStart(2, '0')
    return {
      acao: ACOES.ADIAR,
      motivo: `antes de ${hh}:${mm} UTC (último cron ${String(ultimoCron.hora).padStart(2, '0')}:${String(ultimoCron.minuto).padStart(2, '0')} + ${FOLGA_MIN} min): criar agora congelaria a coleta parcial`,
    }
  }
  return { acao: ACOES.CRIAR, motivo: 'depois do último cron do dia: a coleta está completa' }
}
