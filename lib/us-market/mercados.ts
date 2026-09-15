/**
 * Os OITO mercados do painel dos EUA: a chave da tela e o slug da coleta, no
 * mesmo objeto.
 *
 * ─── POR QUE ESTE ARQUIVO EXISTE ────────────────────────────────────────────
 *
 * Até 15/Set/2026 esse pareamento vivia dentro de `app/api/polymarket/route.ts`
 * em DOIS arrays casados POR POSIÇÃO:
 *
 *   const slugsUs = ['which-party-will-win-the-house-in-2026', ...]
 *   const keysUs  = ['house', ...]
 *
 * 🔴 Inserir um slug no meio de um e esquecer o outro desloca TODAS as chaves
 * seguintes. O resultado é o painel servindo o preço do Senado com a etiqueta
 * da Câmara: valor correto, etiqueta errada. O próprio `/atualizar-usa` diz que
 * essa é a classe que segue sem portão, porque "o valor está certo e o que
 * falta é a etiqueta", e nenhum validador de JSON a pega.
 *
 * 🔑 Objeto único elimina a classe: não existe estado em que a chave e o slug
 * se separem, porque eles são o mesmo registro.
 *
 * ⚠️ E ele era privado do arquivo, então quem precisasse do pareamento fora da
 * rota tinha de copiá-lo. Duas cópias convivem sem incidente até o dia em que
 * uma é corrigida e a outra não, que é o defeito de 29/Jul dos rótulos de faixa
 * e o mesmo que o `portao.ts` foi criado para fechar em 10/Ago.
 *
 * 📌 A ORDEM é contrato: a rota consome os dois arrays derivados por posição, e
 * `scripts/testar-mercados-us.ts` trava a lista literal, na ordem, exatamente
 * como ela estava antes desta mudança.
 */

export interface MercadoUs {
  /** a chave que o JSON da rota entrega para a tela */
  key: string
  /** o slug do Polymarket, o mesmo do ELECTION_REGISTRY, que manda na coleta */
  slug: string
  /**
   * `true` para livro de FAIXAS, que passa pelo portão de 95-105%.
   * `false` para binário, que é vigiado pela trava de captura.
   */
  distribuicao: boolean
}

export const MERCADOS_US: readonly MercadoUs[] = [
  { key: 'house', slug: 'which-party-will-win-the-house-in-2026', distribuicao: false },
  { key: 'senate', slug: 'which-party-will-win-the-senate-in-2026', distribuicao: false },
  { key: 'houseSeats', slug: 'republican-house-seats-after-the-2026-midterm-elections', distribuicao: true },
  { key: 'senateSeats', slug: 'republican-senate-seats-after-the-2026-midterm-elections-927', distribuicao: true },
  { key: 'governors', slug: 'how-many-republican-governors-after-the-2026-midterm-elections', distribuicao: true },
  { key: 'turnout', slug: '2026-midterms-house-turnout', distribuicao: true },
  { key: 'popularVoteMargin', slug: '2026-midterms-house-popular-vote-margin-of-victory-224', distribuicao: true },
  { key: 'asScheduled', slug: 'will-the-2026-midterm-elections-happen-as-scheduled', distribuicao: false },
] as const

/** Os slugs, na ordem. A rota casa com `KEYS_US` por posição. */
export const SLUGS_US: readonly string[] = MERCADOS_US.map((m) => m.slug)

/** As chaves, na ordem. */
export const KEYS_US: readonly string[] = MERCADOS_US.map((m) => m.key)

/** Só os livros de faixas, que é quem passa pelo portão de coerência. */
export const DISTRIBUICOES_US: readonly MercadoUs[] = MERCADOS_US.filter((m) => m.distribuicao)
