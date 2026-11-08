/**
 * Os mercados da Polymarket do painel da FRANÇA (presidencial de 2027): a
 * chave da tela e o slug da coleta, no mesmo objeto. Molde: `lib/us-market/mercados.ts`.
 *
 * Criado em 08/Nov/2026, antes de qualquer tela da França existir. Os slugs
 * foram lidos na gamma-api nesse dia (estudo "França 2027: estudo do painel
 * ao vivo"). O registro serve para a rota `/api/polymarket?country=fra`
 * responder com a França em vez de cair no Brasil, que era o comportamento
 * de qualquer país que não fosse `us`.
 *
 * 📌 A ORDEM é contrato, como nos EUA: a rota casa slugs e chaves por posição.
 *
 * ⚠️ O livro do candidato do RN (`2027-french-presidential-election-national-rally-candidate`)
 * já RESOLVEU (Le Pen = 1) e fica de fora: contrato fechado não é preço.
 */

export interface MercadoFra {
  /** a chave que o JSON da rota entrega para a tela */
  key: string
  /** o slug do Polymarket */
  slug: string
  /**
   * `true` para livro de FAIXAS. Na França nenhum é: todos são livros de
   * candidatos (um contrato Sim/Não por nome). Mantido pelo mesmo contrato do EUA.
   */
  distribuicao: boolean
}

export const MERCADOS_FRA: readonly MercadoFra[] = [
  { key: 'winner', slug: 'next-french-presidential-election', distribuicao: false },
  { key: 'secondRound', slug: 'next-french-presidential-election-who-will-advance-to-the-2nd-round', distribuicao: false },
  { key: 'firstRoundWinner', slug: 'french-presidential-election-first-round-winner', distribuicao: false },
  { key: 'onBallot', slug: '2027-french-presidential-election-who-will-be-on-the-ballot', distribuicao: false },
  { key: 'calledBy', slug: 'french-election-called-by', distribuicao: false },
] as const

/** Os slugs, na ordem. A rota casa com `KEYS_FRA` por posição. */
export const SLUGS_FRA: readonly string[] = MERCADOS_FRA.map((m) => m.slug)

/** As chaves, na ordem. */
export const KEYS_FRA: readonly string[] = MERCADOS_FRA.map((m) => m.key)
