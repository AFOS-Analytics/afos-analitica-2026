/**
 * 🔁 A REGRA de devolver a certificação da árvore descartável ao cache canônico.
 *
 * 🔴 POR QUE EXISTE, medido em 11/Out/2026. O `arvore-completa.mjs` COPIA o
 * `.cache/capture-guard` para a árvore descartável em vez de ligá-lo, e isso é
 * deliberado: junction ali seria porta para o cache real, e `--remover` apaga
 * recursivamente. O preço é que a trava rodada LÁ grava a certificação do dia
 * só lá, e a árvore morre com ela dentro. Em 10/Out foi o que aconteceu: rodei
 * a trava na árvore completa e o cache canônico ficou com a última leitura dos
 * EUA de 09/Out, 22h velha, que é justamente a cauda cega que inverte
 * superlativo.
 *
 * ⛔ E ela mora AQUI, e não no `arvore-completa.mjs`, porque o cabeçalho dele
 * declara "orquestração apenas, sem regra própria". Decidir qual arquivo é mais
 * novo é regra, com dois ramos que RECUSAM, e regra sem teste é opinião.
 */

/** Os vereditos possíveis, e cada um pede ação diferente. */
export const TRAZER = 'TRAZER'
export const IDENTICO = 'IDENTICO'
export const CANONICO_MAIS_NOVO = 'CANONICO_MAIS_NOVO'
export const SEM_CARIMBO = 'SEM_CARIMBO'

/**
 * 🏷️ Os arquivos da faixa, e o filtro é por PREFIXO porque o cache é
 * compartilhado entre os dois países.
 *
 * ⛔ A árvore descartável levou uma CÓPIA do `ultima-br.json`. Devolvê-la às
 * cegas sobrescreveria uma certificação do Brasil MAIS NOVA pela cópia velha,
 * e o Brasil não é faixa deste terminal.
 */
export function daFaixa(nomes, prefixo) {
  if (!prefixo || typeof prefixo !== 'string') return []
  return (nomes ?? []).filter((n) => n === `ultima-${prefixo}.json` || n.startsWith(`${prefixo}-`))
}

/**
 * ⚖️ A decisão, para UM arquivo.
 *
 * `entrada` traz o que o chamador leu do disco, e nada é lido aqui de propósito:
 *   { existeCanonico, shaArvore, shaCanonico, carimboArvore, carimboCanonico }
 *
 * 🔑 Decide por CONTEÚDO (o `fetchedAt` de dentro), NUNCA por mtime: o `cpSync`
 * reescreve mtime, então todo arquivo da árvore descartável parece mais novo.
 * Decidir por mtime devolveria sempre, que é o erro simétrico e o pior dos dois.
 */
export function decidir(entrada = {}) {
  const { existeCanonico, shaArvore, shaCanonico, carimboArvore, carimboCanonico } = entrada
  if (!existeCanonico) return { acao: TRAZER, motivo: 'não existia no cache canônico' }
  if (shaArvore && shaCanonico && shaArvore === shaCanonico) {
    return { acao: IDENTICO, motivo: 'idêntico por sha256 nos dois lados' }
  }
  if (!carimboArvore || !carimboCanonico) {
    return { acao: SEM_CARIMBO, motivo: 'sem carimbo legível nos dois lados, e mtime não decide nada aqui' }
  }
  if (carimboArvore <= carimboCanonico) {
    return { acao: CANONICO_MAIS_NOVO, motivo: `o canônico é mais novo (${carimboCanonico} contra ${carimboArvore})` }
  }
  return { acao: TRAZER, motivo: `${carimboCanonico} → ${carimboArvore}` }
}

/** Só `TRAZER` escreve. Os outros três não tocam o disco. */
export const escreve = (acao) => acao === TRAZER
