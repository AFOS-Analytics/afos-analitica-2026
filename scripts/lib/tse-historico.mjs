/**
 * tse-historico.mjs — a SUBTRAÇÃO que denuncia retirada no registro do TSE,
 * feita contra um histórico persistente em vez de contra a memória.
 *
 * 🔴 POR QUE ISTO EXISTE. A regra está escrita no `/atualizar-pesquisas-brz`
 * desde 02/Set/2026: "se o arquivo cresceu MENOS do que entrou na ingestão,
 * houve retirada nova". Ela precisa do total do arquivo da rodada ANTERIOR, e
 * esse número nunca foi gravado em lugar nenhum: morava só nas fichas de
 * capstone. Em 04/Set/2026 a rodada de 03/Set não tinha ficha com o total, e a
 * subtração teve de ser reconstruída à mão a partir da identidade
 * banco = comum + fantasmas. Regra que depende de um número que ninguém grava
 * é regra que não roda. → memory/feedback_duas_copias_da_mesma_regra.md
 *
 * 🔑 DUAS CONTAS INDEPENDENTES, e o valor está no DESACORDO delas:
 *
 *   1. pela SUBTRAÇÃO   retiradas = inseridas − (arquivo_hoje − arquivo_ontem)
 *   2. pelos FANTASMAS  retiradas = fantasmas_hoje − fantasmas_ontem
 *
 * A conta 1 vale porque arquivo_hoje = inseridas + jaExistiam, e jaExistiam sai
 * do arquivo de ontem menos o que saiu. A conta 2 vale porque o banco NUNCA
 * apaga, então fantasma = protocolo que já esteve no arquivo e não está mais.
 *
 * Quando as duas discordam, a diferença tem NOME e é sempre uma destas três, e
 * nenhuma delas é ruído:
 *   • rodada de ingestão que aconteceu e não foi registrada aqui (diferença > 0);
 *   • protocolo que VOLTOU ao arquivo depois de ter saído (fantasmas caem);
 *   • linha apagada do banco, que quebra a invariante do projeto (diferença < 0).
 *
 * ⚠️ NÃO faz IO. O chamador lê e escreve o arquivo. Assim o teste exercita a
 * conta com casos plantados, sem banco e sem disco.
 * → memory/feedback_o_conferidor_que_eu_escrevo_tambem_e_um_medidor.md
 */

export const CAMINHO_HISTORICO = 'data/tse/historico-arquivo.jsonl'

/** Lê o JSONL em registros, ignorando linha em branco. Linha quebrada ABORTA. */
export function lerHistorico(texto) {
  if (!texto) return []
  const linhas = texto.split('\n').map((l) => l.trim()).filter(Boolean)
  return linhas.map((l, i) => {
    try {
      return JSON.parse(l)
    } catch {
      throw new Error(`historico-arquivo.jsonl: linha ${i + 1} não é JSON. Não adivinhar, conferir à mão.`)
    }
  })
}

export function serializar(registro) {
  return JSON.stringify(registro) + '\n'
}

/** O último registro, ou null. Ordena por `quando` para não depender da ordem do arquivo. */
export function ultimoRegistro(historico) {
  if (!historico.length) return null
  return [...historico].sort((a, b) => String(a.quando).localeCompare(String(b.quando))).pop()
}

const temNumero = (r, campo) => r && typeof r[campo] === 'number' && Number.isFinite(r[campo])

/**
 * Compara duas rodadas. Devolve as duas contas e o diagnóstico do desacordo.
 * `null` em qualquer conta quer dizer "não dá para calcular", nunca zero:
 * zero calculado sobre campo ausente é o medidor mudo.
 */
export function compararRodadas(anterior, atual) {
  if (!anterior) {
    return { primeira: true, avisos: ['primeira rodada registrada, não há contra o que subtrair'] }
  }

  const avisos = []
  const podeSubtrair = temNumero(anterior, 'arquivo') && temNumero(atual, 'arquivo') && temNumero(atual, 'inseridas')
  const podeFantasma = temNumero(anterior, 'fantasmas') && temNumero(atual, 'fantasmas')

  const crescimentoArquivo = podeSubtrair ? atual.arquivo - anterior.arquivo : null
  const porSubtracao = podeSubtrair ? atual.inseridas - crescimentoArquivo : null
  const porFantasmas = podeFantasma ? atual.fantasmas - anterior.fantasmas : null

  if (!podeSubtrair) avisos.push('sem `arquivo` nos dois registros ou sem `inseridas`: conta da subtração indisponível')
  if (!podeFantasma) avisos.push('sem `fantasmas` nos dois registros: conta dos fantasmas indisponível')

  let naoRegistradas = null
  let concordam = null
  if (porSubtracao !== null && porFantasmas !== null) {
    // Quantas linhas ENTRARAM no banco entre os dois registros, pela ótica do arquivo.
    const entradasImplicitas = crescimentoArquivo + porFantasmas
    naoRegistradas = entradasImplicitas - atual.inseridas
    concordam = naoRegistradas === 0
  }

  if (porFantasmas !== null && porFantasmas < 0) {
    avisos.push(`🔁 ${-porFantasmas} protocolo(s) VOLTARAM ao registro do TSE: fantasmas caíram de ${anterior.fantasmas} para ${atual.fantasmas}`)
  }
  if (naoRegistradas !== null && naoRegistradas > 0) {
    avisos.push(`📓 ${naoRegistradas} linha(s) entraram no banco SEM rodada registrada aqui entre ${anterior.quando} e ${atual.quando}: a conta da subtração fica sem sentido até o histórico ficar contínuo`)
  }
  if (naoRegistradas !== null && naoRegistradas < 0) {
    avisos.push(`🔴 ${-naoRegistradas} linha(s) a MAIS foram inseridas do que o arquivo explica. Ou protocolo voltou, ou o banco PERDEU linha, e o banco não deveria perder. Conferir com diff-tse-arquivo-vs-banco.ts ANTES de publicar qualquer contagem`)
  }

  return { primeira: false, crescimentoArquivo, porSubtracao, porFantasmas, naoRegistradas, concordam, avisos }
}

/** Linhas prontas para a tela. Separada da conta de propósito. */
export function formatarComparacao(anterior, atual, r) {
  const L = []
  if (r.primeira) {
    L.push(`\n📓 Histórico do arquivo do TSE iniciado em ${CAMINHO_HISTORICO}.`)
    L.push('   A subtração contra a rodada anterior aparece a partir da próxima.')
    return L
  }
  L.push(`\n🔢 SUBTRAÇÃO contra a rodada de ${anterior.quando}:`)
  if (r.crescimentoArquivo !== null) {
    const sinal = r.crescimentoArquivo >= 0 ? '+' : ''
    L.push(`   arquivo ${anterior.arquivo} → ${atual.arquivo}  (${sinal}${r.crescimentoArquivo})   inseridas nesta rodada: ${atual.inseridas}`)
  }
  if (r.concordam === true) {
    L.push(`   ✅ as duas contas fecham: ${r.porFantasmas} retirada(s) nova(s) no registro do TSE.`)
  } else {
    if (r.porSubtracao !== null) L.push(`   pela subtração: ${r.porSubtracao}`)
    if (r.porFantasmas !== null) L.push(`   pelos fantasmas: ${r.porFantasmas}  (${anterior.fantasmas} → ${atual.fantasmas})`)
  }
  for (const a of r.avisos) L.push(`   ${a}`)
  return L
}
