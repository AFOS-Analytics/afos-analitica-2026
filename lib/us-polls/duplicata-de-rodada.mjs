/**
 * 🧬 A MESMA RODADA SOB DOIS NOMES DE CASA.
 *
 * 🔴 POR QUE EXISTE, medido em 25/Set/2026. A média é simples e a regra é uma
 * rodada por instituto por onda, e ela é aplicada agrupando pelo campo
 * `instituto`, que é o NOME que o índice escreveu. Só que o índice não garante
 * nome estável, e naquele dia três casas estavam na média DUAS vezes:
 *
 *   Beacon Research (D)/ Shaw & Co. Research (R)  e  Fox News
 *   Marquette University Law School               e  Marquette Law School
 *   ActiVote                                      e  Activote
 *
 * As duas primeiras são a MESMA rodada, com campo, amostra, recorte, D e R
 * idênticos, listada sob o nome de quem EXECUTA e sob o de quem ENCOMENDA. A
 * terceira difere só por maiúscula e traz valores diferentes.
 *
 * 📊 O preço, medido no dia: D+7.98 com as duplicatas e D+7.89 sem as idênticas,
 * com os institutos caindo de 31 para 29. Nove centésimos num número publicado,
 * e uma contagem de institutos inflada em dois.
 *
 * ⛔ ELE NÃO REMOVE NADA E NÃO MUDA A MÉDIA. Decidir qual nome fica é mudar a
 * PROCEDÊNCIA, e isso segue decisão do André, par a par. Aqui se mede e se
 * declara.
 *
 * 🔑 A assinatura é campo + amostra + recorte, e NUNCA o nome, que é justamente
 * a coisa sob suspeita. Quando a amostra é nula o par só conta se os nomes
 * normalizados forem iguais, senão duas casas diferentes que mediram na mesma
 * janela sem declarar amostra colidiriam sozinhas.
 */

/** Assinatura da RODADA. O nome fica de fora de propósito. */
export function assinatura(p) {
  return [p.campoInicio ?? '', p.campoFim ?? '', p.amostra ?? '', p.amostraTipo ?? ''].join('|')
}

/** Nome sem maiúscula, pontuação nem sufixo de partido, só para comparar. */
export function normalizarNome(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/\((d|r)\)/g, ' ')
    .replace(/[^a-z0-9]/g, '')
}

/**
 * 📒 DUPLICATAS JÁ CONFERIDAS, no padrão de `soma-conferida.mjs`: dado
 * declarado, com data e motivo, para poder ser reconferido e DESFEITO.
 *
 * 🔒 A entrada guarda os VALORES. Se o índice reescrever D ou R, a conferência
 * CADUCA sozinha e o par volta a contar, que é o que impede uma decisão de
 * ontem de calar um defeito de hoje.
 */
export const DUPLICATA_CONFERIDA = []

/** Entrada sem prova é opinião, e opinião não desarma portão. */
export function conferirCarga(registro = DUPLICATA_CONFERIDA) {
  const erros = []
  registro.forEach((e, i) => {
    if (!e.conferidoEm) erros.push(`entrada ${i}: sem conferidoEm`)
    if (!e.motivo) erros.push(`entrada ${i}: sem motivo`)
    if (!e.assinatura) erros.push(`entrada ${i}: sem assinatura`)
    if (!Array.isArray(e.nomes) || e.nomes.length < 2) erros.push(`entrada ${i}: nomes precisa ter 2 ou mais`)
    if (!Array.isArray(e.valores)) erros.push(`entrada ${i}: sem valores, a conferência não caducaria`)
  })
  return erros
}

/** true quando o par foi conferido E os valores continuam os mesmos. */
export function jaConferida(grupo, registro = DUPLICATA_CONFERIDA) {
  return registro.some((e) => {
    if (e.assinatura !== grupo.assinatura) return false
    const nomesIguais =
      e.nomes.length === grupo.nomes.length &&
      e.nomes.every((n) => grupo.nomes.some((g) => normalizarNome(g) === normalizarNome(n)))
    if (!nomesIguais) return false
    const agora = grupo.linhas.map((l) => `${l.dem}/${l.rep}`).sort().join(' ')
    const antes = [...e.valores].sort().join(' ')
    return agora === antes
  })
}

/**
 * Agrupa por assinatura e devolve só os grupos com MAIS DE UM nome de casa.
 * `IDENTICA` quando D e R batem em todos: quase certamente uma rodada só.
 * `DIVERGE` quando não batem: pode ser segunda via declarada, e pede olho.
 */
export function duplicatas(polls, registro = DUPLICATA_CONFERIDA) {
  const porAssin = new Map()
  for (const p of polls ?? []) {
    if (!p || !p.campoFim) continue
    const k = assinatura(p)
    if (!porAssin.has(k)) porAssin.set(k, [])
    porAssin.get(k).push(p)
  }
  const saida = []
  for (const [k, linhas] of porAssin) {
    const nomes = [...new Set(linhas.map((l) => l.instituto))]
    if (nomes.length < 2) continue
    // ⛔ ANTI-EXCESSO: sem amostra declarada, só conta se for a MESMA casa.
    const semAmostra = linhas.every((l) => l.amostra == null)
    if (semAmostra && new Set(nomes.map(normalizarNome)).size > 1) continue
    const pares = new Set(linhas.map((l) => `${l.dem}/${l.rep}`))
    const grupo = {
      assinatura: k,
      nomes,
      linhas,
      classe: pares.size === 1 ? 'IDENTICA' : 'DIVERGE',
      mesmaCasa: new Set(nomes.map(normalizarNome)).size === 1,
    }
    grupo.conferida = jaConferida(grupo, registro)
    saida.push(grupo)
  }
  return saida.sort((a, b) => b.assinatura.localeCompare(a.assinatura))
}
