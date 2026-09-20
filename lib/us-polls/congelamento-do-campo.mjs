/**
 * congelamento-do-campo.mjs — a data de campo mais recente está travada há N
 * registros. **N é muito?**
 *
 * 🔴 POR QUE ISTO EXISTE, medido em 19/Set/2026: o `historico-us-polls.mjs`
 *    imprime `🧊 campo mais recente travado em 2026-09-17 ha 2 registro(s)` e
 *    para aí. Dois registros parecem pouco ou muito conforme o humor de quem
 *    lê, e naquele dia a pergunta chegou como "estranho, não temos nenhuma
 *    pesquisa nova?".
 *
 * ⭐ A resposta estava na própria série e ninguém a tinha medido: no mesmo mês
 *    o campo ficou travado em **31/Ago por 11 registros** e em **17/Ago por
 *    10**. Dois é o tipo mais CURTO de travamento que essa série produz.
 *
 * 🔑 A régua que sai daqui: travamento só quer dizer alguma coisa contra a
 *    DISTRIBUIÇÃO dos travamentos anteriores. Contar o atual e não comparar é
 *    produzir um número sem escala, e número sem escala vira susto ou
 *    tranquilidade conforme quem lê.
 *
 * ⛔ USO INTERNO. Isto descreve a cadência com que o ÍNDICE recebe pesquisa,
 *    não a cadência com que os institutos publicam. Travamento curto não prova
 *    que o mundo parou, e travamento longo não prova que o índice falhou.
 *    Ver memory/feedback_descrever_o_metodo_sim_relatar_a_falha_nao.md
 */

/** Abaixo disto a distribuição não tem escala para comparar nada. */
export const MIN_TRAVAMENTOS = 3

export const VEREDITOS = {
  DENTRO: 'DENTRO DO NORMAL',
  LONGO: 'MAIS LONGO QUE O NORMAL',
  RECORDE: 'O MAIS LONGO DA SÉRIE',
  INDETERMINADO: 'INDETERMINADO',
}

/**
 * Agrupa a série em blocos consecutivos com a mesma `campoMaisRecente`.
 *
 * ⚠️ A série chega do Neon em ordem DECRESCENTE. Agrupar sem ordenar produz
 *    blocos certos com datas de início erradas, que é defeito que passa
 *    despercebido porque o tamanho do bloco fica igual.
 *
 * 🕳️ Registro ilegível ou sem campo QUEBRA o bloco em vez de ser ignorado: um
 *    buraco no meio não pode ser costurado como se fosse continuidade, senão
 *    dois travamentos separados viram um só, o dobro do tamanho.
 */
export function blocosDeCongelamento(registros) {
  if (!Array.isArray(registros)) {
    throw new TypeError('blocosDeCongelamento espera um array de registros')
  }
  const ordenados = registros
    // ⚠️ ilegível NÃO é filtrado aqui: ele precisa sobreviver até o laço para
    // QUEBRAR o bloco. Filtrar costuraria dois travamentos separados num só,
    // inflando a distribuição e fazendo um travamento longo parecer normal.
    .filter((r) => r && typeof r.lastUpdate === 'string')
    .slice()
    .sort((a, b) => (a.lastUpdate < b.lastUpdate ? -1 : a.lastUpdate > b.lastUpdate ? 1 : 0))

  const blocos = []
  let atual = null
  for (const r of ordenados) {
    const campo = !r.ilegivel && typeof r.campoMaisRecente === 'string' && r.campoMaisRecente ? r.campoMaisRecente : null
    if (campo === null) {
      atual = null // buraco quebra o bloco, de propósito
      continue
    }
    if (atual && atual.campo === campo) {
      atual.n++
      atual.ate = r.lastUpdate
    } else {
      atual = { campo, n: 1, de: r.lastUpdate, ate: r.lastUpdate }
      blocos.push(atual)
    }
  }
  return blocos
}

/**
 * Põe o travamento ATUAL contra a distribuição dos ANTERIORES.
 *
 * ⚠️ O bloco atual fica FORA da distribuição contra a qual ele é comparado.
 *    Incluí-lo seria comparar um número consigo mesmo, e num conjunto pequeno
 *    isso puxa a mediana para o próprio valor.
 *
 * ⚠️ E o bloco atual está ABERTO: ele ainda vai crescer. Um travamento de 2
 *    que ainda não terminou não é comparável a um de 11 que terminou, e o
 *    campo `aindaAberto` existe para a frase dizer isso.
 */
export function medirCongelamento(registros) {
  const blocos = blocosDeCongelamento(registros)
  if (blocos.length === 0) {
    return { veredito: VEREDITOS.INDETERMINADO, motivo: 'nenhum bloco legível na série', atual: null, anteriores: [] }
  }

  const atual = blocos[blocos.length - 1]
  const anteriores = blocos.slice(0, -1)

  // O bloco MAIS ANTIGO pode estar cortado pela borda da consulta: ele começa
  // antes do primeiro registro lido, então o tamanho dele é PISO e não serve
  // para a distribuição.
  const usaveis = anteriores.slice(1)
  const cortadoNaBorda = anteriores.length > 0

  if (usaveis.length < MIN_TRAVAMENTOS) {
    return {
      veredito: VEREDITOS.INDETERMINADO,
      motivo: `apenas ${usaveis.length} travamento(s) anterior(es) completo(s), abaixo do mínimo de ${MIN_TRAVAMENTOS}`,
      atual,
      anteriores: usaveis,
      cortadoNaBorda,
    }
  }

  const tamanhos = usaveis.map((b) => b.n).sort((a, b) => a - b)
  const meio = Math.floor(tamanhos.length / 2)
  const mediana = tamanhos.length % 2 ? tamanhos[meio] : (tamanhos[meio - 1] + tamanhos[meio]) / 2
  const maximo = tamanhos[tamanhos.length - 1]

  const veredito = atual.n > maximo ? VEREDITOS.RECORDE : atual.n > mediana ? VEREDITOS.LONGO : VEREDITOS.DENTRO

  return {
    veredito,
    motivo:
      veredito === VEREDITOS.RECORDE
        ? `o travamento atual de ${atual.n} passa o maior anterior, de ${maximo}`
        : veredito === VEREDITOS.LONGO
          ? `${atual.n} está acima da mediana de ${mediana}, mas abaixo do máximo de ${maximo}`
          : `${atual.n} está na mediana ou abaixo dela (mediana ${mediana}, máximo ${maximo})`,
    atual,
    anteriores: usaveis,
    mediana,
    maximo,
    cortadoNaBorda,
    aindaAberto: true,
  }
}
