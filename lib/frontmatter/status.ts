/**
 * Leitura do `status:` do frontmatter, compartilhada pelos três produtos.
 *
 * ─────────────────────────────────────────────────────────────────────
 * 🔴 POR QUE ISTO EXISTE, e por que NÃO fere a regra de módulo isolado.
 * ─────────────────────────────────────────────────────────────────────
 *
 * Em 06/Ago/2026 eu consertei O MESMO defeito TRÊS VEZES no mesmo dia. Os três
 * loaders tinham cópias linha a linha idênticas desta função, com três nomes
 * diferentes (`readStatusFast` no Daily, `readStatusFast` no Tradeoff,
 * `lerStatus` no Weekly), e a única diferença era a chave do cache.
 *
 * A cópia do Weekly leu `slice(0, 500)` e pôs a Edição №1 em produção como
 * `published` devolvendo 404 nos TRÊS idiomas, porque o campo caiu no byte 558.
 * Consertei ali. As outras duas seguiram quebradas até um EVAL achá-las horas
 * depois. Três cópias não são redundância: são três chances de uma delas ficar
 * para trás, e foi exatamente o que aconteceu.
 *
 * ⚠️ A REGRA DE MÓDULO ISOLADO CONTINUA VALENDO e não está sendo furada. Ela
 * diz que um PRODUTO não importa de outro PRODUTO, para que o Weekly, em
 * piloto, não possa derrubar o Daily e o Tradeoff, que estão no ar. Isto aqui
 * não é produto: é um primitivo de leitura de arquivo, sem regra de negócio,
 * sem conhecer edição, país ou idioma. Os três dependem dele; nenhum depende
 * do outro.
 *
 * 🔒 ESTE É O PRIMITIVO DE MAIOR RISCO DA PLATAFORMA. É ele que decide se uma
 * edição aparece em produção. Toda mudança aqui tem que ser provada equivalente
 * sobre o acervo inteiro antes de subir, e o comportamento é FALHAR FECHADO:
 * na dúvida, `draft`, que esconde. O erro caro é o contrário, publicar sem
 * querer.
 */
import { readFileSync, existsSync, statSync } from 'fs'

const STATUS_RE = /^status:\s*([a-z]+)\s*$/im
const VALIDOS = new Set(['published', 'draft', 'archived'])

/**
 * Cache por caminho absoluto e mtime. O caminho já é único entre produtos e
 * países, então não há colisão e cada loader deixa de inventar a própria chave.
 *
 * Existe porque sitemap, feed e llms.txt chamam isto três vezes por rebuild:
 * com 100 edições são 300 leituras de disco a cada build frio.
 */
const cache = new Map<string, { mtime: number; status: string }>()

export type StatusEdicao = 'published' | 'draft' | 'archived'

/**
 * Devolve o `status:` declarado no frontmatter do arquivo, ou `'draft'`.
 *
 * Falha fechado em TODOS os caminhos: arquivo ausente, erro de `stat`, erro de
 * leitura, frontmatter sem `---` de fechamento, campo ausente e valor fora da
 * lista de válidos. Nenhum deles publica.
 */
export function lerStatusDoArquivo(caminhoAbsoluto: string): StatusEdicao {
  if (!existsSync(caminhoAbsoluto)) return 'draft'

  let mtime = 0
  try {
    mtime = statSync(caminhoAbsoluto).mtimeMs
  } catch {
    return 'draft'
  }

  const guardado = cache.get(caminhoAbsoluto)
  if (guardado && guardado.mtime === mtime) return guardado.status as StatusEdicao

  let status: StatusEdicao = 'draft'
  try {
    // 🔴 LER O BLOCO DE FRONTMATTER INTEIRO, nunca uma fatia de tamanho fixo.
    //
    // Isto já leu `slice(0, 500)`. Com um título de 125 caracteres e um bloco
    // de comentário no topo, o `status:` caiu no byte 558 e a edição publicada
    // virou 404. O pt-BR passava por 18 bytes de folga e o espanhol por 10: não
    // era margem, era sorte.
    const bruto = readFileSync(caminhoAbsoluto, 'utf-8')
    const fim = bruto.indexOf('\n---', 3)
    const head = fim > 0 ? bruto.slice(0, fim) : ''
    const m = head.match(STATUS_RE)
    const bruto2 = m ? m[1].toLowerCase() : ''
    if (VALIDOS.has(bruto2)) status = bruto2 as StatusEdicao
  } catch {
    return 'draft'
  }

  cache.set(caminhoAbsoluto, { mtime, status })
  return status
}

/** Só `published` aparece em produção. Rascunho e arquivada, não. */
export function visivelEmProducao(caminhoAbsoluto: string): boolean {
  return lerStatusDoArquivo(caminhoAbsoluto) === 'published'
}
