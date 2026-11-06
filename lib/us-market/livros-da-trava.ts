/**
 * 🗳️ A DECISÃO DA TRAVA DE CAPTURA SOBRE LIVROS, fora do `main()` para poder
 * ser testada. Quem lê e espera os 8 minutos continua sendo o
 * `scripts/capture-guard.ts`; aqui só mora a regra.
 *
 * 🔴 O CASO, 05/Nov/2026, dois dias depois das midterms. Os três livros
 * vigiados nos EUA (Câmara, Senado e calendário) resolveram em 100. O proxy
 * servia todos os contratos com `closed: true`, a leitura saiu com ZERO
 * preços, e o portão de leitura vazia, que existe para pegar nome de livro
 * errado, disparou como motivo GLOBAL. A trava imprimiu os três livros como
 * RESOLVIDOS e terminou em `VEREDITO: BLOQUEADO`, e a rodada aconselhou
 * "recapturar" e "registrar book instável". As duas coisas eram falsas: não
 * havia book nenhum em trânsito, havia mercado encerrado.
 *
 * 🔑 Três desfechos, e não dois:
 *   - APROVADO: algum livro vivo, e todo livro vivo concordou.
 *   - BLOQUEADO: algum motivo, de livro ou global.
 *   - RESOLVIDO: TODOS os livros vigiados resolvidos nas duas leituras, sem
 *     motivo nenhum. Nada a certificar, e nada instável a registrar.
 *
 * ⛔ O que NÃO muda: livro sem contrato nenhum, nem aberto nem fechado, segue
 * bloqueando (é o leitor que falhou), e leitura degradada ou com o mesmo
 * `fetchedAt` segue bloqueando mesmo com tudo resolvido, porque aí a trava não
 * leu duas vezes de verdade.
 */

export interface LeituraDosLivros {
  precos: Map<string, number>
  fechados: Map<string, number>
}

export type Veredito = 'APROVADO' | 'BLOQUEADO' | 'RESOLVIDO'

/**
 * O portão de leitura vazia da 1a leitura. Zero preço só é defeito do leitor
 * quando também não veio contrato FECHADO nenhum: com contratos fechados, quem
 * decide é a classificação por livro, que separa resolvido de não medido.
 */
export function leituraVazia(l: LeituraDosLivros): boolean {
  const fechados = [...l.fechados.values()].reduce((s, n) => s + n, 0)
  return l.precos.size === 0 && fechados === 0
}

export function classificarLivros(
  books: readonly string[],
  a: LeituraDosLivros,
  b: LeituraDosLivros,
): { livrosResolvidos: string[]; motivos: string[] } {
  const precosDe = (l: LeituraDosLivros, book: string) => [...l.precos.keys()].filter(k => k.startsWith(`${book}:`)).length
  const livrosResolvidos: string[] = []
  const motivos: string[] = []
  for (const book of books) {
    if (precosDe(a, book) > 0 || precosDe(b, book) > 0) continue
    if ((a.fechados.get(book) ?? 0) > 0 && (b.fechados.get(book) ?? 0) > 0) livrosResolvidos.push(book)
    else motivos.push(`${book}: nenhum contrato, nem aberto nem fechado, nas duas leituras. O livro não foi medido.`)
  }
  return { livrosResolvidos, motivos }
}

export function vereditoDaTrava(
  books: readonly string[],
  livrosResolvidos: readonly string[],
  motivos: readonly string[],
): Veredito {
  if (motivos.length > 0) return 'BLOQUEADO'
  const tudoResolvido = books.length > 0 && books.every(bk => livrosResolvidos.includes(bk))
  return tudoResolvido ? 'RESOLVIDO' : 'APROVADO'
}
