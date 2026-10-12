/**
 * 🗳️ 1º turno de 2026: o resultado oficial e o retrospecto MEDIDO.
 *
 * Fontes, e nenhum número aqui sai de outro lugar:
 *   - resultado: arquivo oficial do TSE `br-c0001-e006257-u.json`, totalização
 *     100%, `andamento: f`, gerado em 05/10/2026 12:51:47 (Brasília);
 *   - véspera do mercado: último ponto GRAVADO de 03/Out no backup do Neon
 *     (`backup/neon/marketPrice/2026-10.csv.gz`, commit ce20f8d9), não a API;
 *   - véspera das pesquisas: as nove nacionais registradas no TSE e divulgadas
 *     em 03/Out (`public/polls-data.json`).
 *
 * ⛔ Este arquivo é REGISTRO, não se reescreve com dado novo. O 2º turno tem a
 *    própria seção; quem muda aqui é só uma errata, declarada.
 */

export const FONTE_TSE = 'https://resultados.tse.jus.br/oficial/app/index.html'

export const RESULTADO_1T = {
  geradoEm: '2026-10-05T12:51:47-03:00',
  totalizacao: 100,
  segundoTurno: '2026-10-25',
  candidatos: [
    { nome: 'Flávio Bolsonaro', partido: 'PL', pct: 47.03, segundoTurno: true },
    { nome: 'Lula', partido: 'PT', pct: 45.16, segundoTurno: true },
    { nome: 'Augusto Cury', partido: 'Avante', pct: 2.89, segundoTurno: false },
    { nome: 'Renan Santos', partido: 'Missão', pct: 2.24, segundoTurno: false },
    { nome: 'Ronaldo Caiado', partido: 'PSD', pct: 2.18, segundoTurno: false },
  ],
  /**
   * Os outros sete nomes, pela soma dos VOTOS (587.143 de 119.300.788), e não
   * 100 menos os cinco percentuais arredondados, que daria 0,50.
   */
  demais: 0.49,
  eleitorado: 158_745_502,
  comparecimento: { votos: 125_275_835, pct: 78.92 },
  abstencao: { votos: 33_469_244, pct: 21.08 },
  validos: 119_300_788,
  brancos: { votos: 2_300_798, pct: 1.84 },
  nulos: { votos: 3_674_249, pct: 2.93 },
} as const

/**
 * 🗳️ As urnas do dia da votação, acrescentadas em 11/Out a pedido do André.
 *
 * Fonte: TSE, "Números gerais, coletiva das 21h" de 04/10/2026, seção "Urnas e
 * seções" (`URNAS_1T.fonte`). A frase de que a substituição não afetou os votos
 * já registrados é do próprio TSE, na notícia de balanço do 1º turno.
 *
 * ⚠️ O "0,35% do total" do TSE é sobre TODAS as urnas, somando as de
 *    contingência: 1.904 / 549.286 = 0,347%. Sobre as 499.248 de votação seria
 *    0,38%. O cartão calcula sobre a mesma base do TSE e a declara no rodapé,
 *    para o leitor que refizer a conta chegar ao mesmo número.
 *
 * 🏷️ O TSE não publica "urnas com defeito": publica urnas SUBSTITUÍDAS e seções
 *    com votação MANUAL. O cartão usa os termos do tribunal.
 */
export const URNAS_1T = {
  fonte:
    'https://www.tse.jus.br/comunicacao/arquivos/numeros-gerais-eleicoes-2026-1o-turno-coletiva-21h/@@display-file/file/tse-numeros-gerais-eleicoes-2026-1-turno.pdf',
  votacao: 499_248,
  contingencia: 50_038,
  substituidas: 1_904,
  /** "não há votação manual no país neste momento", no balanço das 21h. */
  votacaoManual: 0,
} as const

export type LinhaRetro = {
  id: 'pesquisas' | 'segundo' | 'terceiro' | 'senado' | 'vencedor'
  /** Carimbo do ponto da véspera, em UTC. */
  vesperaEm: string
  slug?: string
  /** O que cada instrumento pagava/media na véspera, do maior para o menor. */
  vespera: { nome: string; valor: number }[]
  /** Desfecho na urna. `null` quando o instrumento ainda não resolveu. */
  urna: string | null
  /** O desfecho mais pago (ou medido) na véspera é o da urna? `null` se não resolveu. */
  confere: boolean | null
}

export const RETROSPECTO_1T: LinhaRetro[] = [
  {
    id: 'pesquisas',
    vesperaEm: '2026-10-03',
    // Diferença Flávio menos Lula no 1º turno, por casa (votos totais).
    vespera: [
      { nome: 'Palver', valor: 4 },
      { nome: 'Futura', valor: 2 },
      { nome: 'Gerp (1ª)', valor: 2 },
      { nome: 'Gerp (2ª)', valor: 2 },
      { nome: 'PoderData', valor: -1 },
      { nome: 'Datafolha', valor: -2 },
      { nome: 'Quaest', valor: -2 },
      { nome: 'AtlasIntel', valor: -2.9 },
      { nome: 'CNT/MDA', valor: -5.1 },
    ],
    urna: 'Flávio Bolsonaro +1.87',
    confere: false,
  },
  {
    id: 'segundo',
    vesperaEm: '2026-10-03T23:00:00Z',
    slug: 'brazil-presidential-election-first-round-2nd-place',
    vespera: [
      { nome: 'Flávio Bolsonaro', valor: 57.5 },
      { nome: 'Lula', valor: 42.4 },
    ],
    urna: 'Lula',
    confere: false,
  },
  {
    id: 'terceiro',
    vesperaEm: '2026-10-03T23:00:00Z',
    slug: 'brazil-presidential-election-first-round-3rd-place',
    vespera: [
      { nome: 'Renan Santos', valor: 47.5 },
      { nome: 'Ronaldo Caiado', valor: 30 },
      { nome: 'Augusto Cury', valor: 23.7 },
    ],
    urna: 'Augusto Cury',
    confere: false,
  },
  {
    id: 'senado',
    vesperaEm: '2026-10-03T21:00:00Z',
    slug: 'next-brazil-senate-election-most-seats-won',
    vespera: [
      { nome: 'PL', valor: 95.8 },
      { nome: 'MDB', valor: 1.6 },
    ],
    urna: 'PL',
    confere: true,
  },
  {
    id: 'vencedor',
    vesperaEm: '2026-10-03T23:00:00Z',
    slug: 'brazil-presidential-election',
    vespera: [
      { nome: 'Flávio Bolsonaro', valor: 64.9 },
      { nome: 'Lula', valor: 35.5 },
    ],
    urna: null,
    confere: null,
  },
]
