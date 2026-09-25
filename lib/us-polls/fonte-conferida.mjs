/**
 * 🔗 A FONTE PRIMÁRIA FOI ABERTA, e o que ela sustenta.
 *
 * 🔴 POR QUE EXISTE, medido em 25/Set/2026. O arquivo declara
 * `qualidade.semFontePrimaria`, que conta AUSÊNCIA de link. Nenhum contador vê
 * o caso oposto e mais comum: link PRESENTE que **não sustenta a linha**. A
 * rodada de campo 12-15/Set atribuída a Emerson College/RealClear aponta uma
 * matéria sobre PRIMÁRIAS, sem nenhuma pergunta de generic ballot, e para todo
 * portão da casa ela é uma linha com fonte, porque o campo está preenchido.
 *
 * ⛔ E o custo não é de forma: é a conferência sendo REFEITA toda rodada. Sem
 * registro, a próxima passada busca o mesmo documento, tropeça no mesmo 451 da
 * CNN e no mesmo artigo errado do índice, e chega à mesma conclusão gastando o
 * mesmo tempo. Medir e não gravar é o defeito que a casa mais repete.
 *
 * 🔑 Isto NÃO é portão e não muda número nenhum. É um LEDGER de dívida contra a
 * origem, impresso em toda passada, no mesmo padrão do `soma-conferida.mjs`.
 */

import { serieDaCasa } from './casas.mjs'

export const RESULTADOS = {
  CONFIRMA: 'o documento do instituto sustenta a linha inteira',
  // Exige as duas listas: "parcial" sem dizer o que ficou de fora é opinião.
  CONFIRMA_PARCIAL: 'o documento sustenta parte, e o resto segue valendo pelo índice',
  NAO_CONTEM_A_PERGUNTA: 'o documento existe, foi lido, e NÃO traz a pergunta',
  NAO_ENCONTRADO: 'nenhum documento do executor nem do patrocinador foi achado',
}

/**
 * 🔒 Cada entrada guarda os VALORES. Se o índice reescrever D ou R, a
 * conferência CADUCA sozinha e a linha volta a contar como não conferida, que é
 * o que impede uma leitura de ontem de calar um número de hoje.
 */
export const FONTE_CONFERIDA = [
  {
    instituto: 'CNN/SSRS',
    campoInicio: '2026-09-16',
    campoFim: '2026-09-17',
    valores: '49/41',
    conferidoEm: '2026-09-25',
    resultado: 'CONFIRMA_PARCIAL',
    url: 'https://ssrs.com/news/republicans-midterm-outlook-amid-worsened-economic-backdrop/',
    confirmado: ['campo 16-17/Set/2026', 'amostra total de 1.206 e margem de ±3,5 no total', 'a MARGEM, oito pontos para os democratas'],
    naoConfirmado: ['a decomposição 49 x 41 x 10', 'o subgrupo de 867 eleitores registrados e a margem de ±4,1 dele'],
    nota:
      'A SSRS é quem vai a campo e publica no próprio site, alcançável. Ela declara o campo, a amostra total, a margem do total e a VANTAGEM de 8 pontos, e remete à CNN para a decomposição. A CNN devolve HTTP 451 para leitor automatizado, então os percentuais separados seguem valendo pelo índice. 📌 O que entra na média é a margem, e ela está confirmada no documento de quem executou.',
  },
  {
    instituto: 'Emerson College/RealClear Opinion Research',
    campoInicio: '2026-09-12',
    campoFim: '2026-09-15',
    valores: '37/29',
    conferidoEm: '2026-09-25',
    resultado: 'NAO_CONTEM_A_PERGUNTA',
    url: 'https://www.uniteamerica.org/articles/new-poll-voters-say-primaries-reward-partisan-bases-sideline-ordinary-voters',
    confirmado: [],
    naoConfirmado: ['D 37 x R 29 x outros 35', 'o recorte de 1.500 eleitores registrados', 'a margem de ±2,4', 'as datas de campo'],
    nota:
      'O link que o ÍNDICE aponta é matéria sobre PRIMÁRIAS e não traz pergunta de generic ballot nenhuma. A Emerson publica a onda de 21-22/Set (53 x 42, 1.000 prováveis votantes) no próprio site e NÃO publica nada de 12-15/Set; nada foi achado na RealClear. A metodologia declarada pelo índice (instituto, n, recorte, margem e datas) bate com a da matéria, mas metodologia não é topline. ⛔ Valor do índice não se corrige à mão e excluir rodada é decisão de procedência: a linha fica, declarada como dívida aberta.',
  },
]

/** Entrada sem prova é opinião, e opinião não fecha dívida contra a origem. */
export function conferirCarga(registro = FONTE_CONFERIDA) {
  const erros = []
  registro.forEach((e, i) => {
    const onde = `entrada ${i} (${e.instituto ?? 'sem instituto'} ${e.campoFim ?? ''})`
    if (!e.instituto) erros.push(`${onde}: sem instituto`)
    if (!e.campoInicio || !e.campoFim) erros.push(`${onde}: sem campo completo`)
    if (!e.valores) erros.push(`${onde}: sem valores, a conferência não caducaria`)
    if (!e.conferidoEm) erros.push(`${onde}: sem conferidoEm`)
    if (!RESULTADOS[e.resultado]) erros.push(`${onde}: resultado ${e.resultado} não é um de ${Object.keys(RESULTADOS).join(', ')}`)
    if (!e.url) erros.push(`${onde}: sem url, não diz o que foi aberto`)
    if (!e.nota) erros.push(`${onde}: sem nota`)
    if (!Array.isArray(e.confirmado) || !Array.isArray(e.naoConfirmado)) {
      erros.push(`${onde}: confirmado e naoConfirmado precisam ser listas`)
      return
    }
    // ⛔ "Parcial" sem dizer o que ficou de fora é o mesmo que não conferir.
    if (e.resultado === 'CONFIRMA_PARCIAL' && (!e.confirmado.length || !e.naoConfirmado.length))
      erros.push(`${onde}: CONFIRMA_PARCIAL exige as DUAS listas preenchidas`)
    if (e.resultado === 'CONFIRMA' && e.naoConfirmado.length)
      erros.push(`${onde}: CONFIRMA com algo em naoConfirmado é parcial, não total`)
    if ((e.resultado === 'NAO_CONTEM_A_PERGUNTA' || e.resultado === 'NAO_ENCONTRADO') && e.confirmado.length)
      erros.push(`${onde}: ${e.resultado} não pode confirmar nada`)
  })
  return erros
}

/** A entrada desta linha, se existir E se os valores continuarem os mesmos. */
export function fonteDa(poll, registro = FONTE_CONFERIDA) {
  if (!poll) return null
  return (
    registro.find(
      (e) =>
        serieDaCasa(e.instituto) === serieDaCasa(poll.instituto) &&
        e.campoInicio === poll.campoInicio &&
        e.campoFim === poll.campoFim &&
        e.valores === `${poll.dem}/${poll.rep}`
    ) ?? null
  )
}

/**
 * As dívidas ABERTAS entre as linhas dadas: tudo que não é CONFIRMA.
 * ⛔ Elas nunca saem da saída, nem quando a média não se move por causa delas.
 */
export function dividasAbertas(polls, registro = FONTE_CONFERIDA) {
  return (polls ?? [])
    .map((p) => ({ poll: p, entrada: fonteDa(p, registro) }))
    .filter((x) => x.entrada && x.entrada.resultado !== 'CONFIRMA')
}
