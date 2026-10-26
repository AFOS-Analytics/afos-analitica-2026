/**
 * 🗳️ 2º turno de 2026: o resultado oficial e o retrospecto MEDIDO, no molde de
 * `primeiro-turno-2026.ts`.
 *
 * Fontes, e nenhum número aqui sai de outro lugar:
 *   - resultado: arquivo oficial do TSE `br-c0001-e006258-u.json` (eleição 6258),
 *     guardado BRUTO em `data/brz/resultado-oficial-2026/2turno/`. `RESULTADO_2T`
 *     é gerado dele por script; enquanto `final` for false, é a PARCIAL e o cartão
 *     diz isso;
 *   - urnas: relatório de ocorrências do TSE com o registrado até as 20h de
 *     25/10, URL e SHA-256 em `2turno/FONTES.md` (`URNAS_2T`);
 *   - véspera do mercado: último ponto GRAVADO de 24/Out no backup do Neon
 *     (`backup/neon/marketPrice/2026-10.csv.gz`), 22:30 UTC, não a API;
 *   - véspera das pesquisas: as nacionais registradas no TSE e divulgadas em
 *     24/Out com o total de votos, e as 55 feitas depois do 1º turno
 *     (`public/polls-data.json`).
 *
 * ⛔ Este arquivo é REGISTRO. Quando o TSE fechar 100%, roda-se de novo o gerador
 *    e só `RESULTADO_2T` muda; o resto é errata declarada.
 */

export const FONTE_TSE_2T = 'https://resultados.tse.jus.br/oficial/app/index.html'

export const RESULTADO_2T = {
  /** Totalização FINAL do TSE: andamento `f`, totalização final `s`, 499248 de 499248 seções. */
  geradoEm: '2026-10-25T23:27:02-03:00',
  final: true,
  totalizacao: 100,
  secoes: { totalizadas: 499248, total: 499248 },
  candidatos: [
    { nome: 'Lula', partido: 'PT', pct: 51.79, votos: 64256232, eleito: true },
    { nome: 'Flávio Bolsonaro', partido: 'PL', pct: 48.21, votos: 59826041, eleito: false },
  ],
  eleitorado: 158745502,
  comparecimento: { votos: 128236074, pct: 80.78 },
  abstencao: { votos: 30509005, pct: 19.22 },
  validos: 124082273,
  brancos: { votos: 1430496, pct: 1.12 },
  nulos: { votos: 2723305, pct: 2.12 },
} as const

/**
 * 🗳️ Urnas do dia da votação, como no cartão do 1º turno.
 *
 * Fonte: TSE, 5º Boletim Informativo do 2º turno (20h de 25/10/2026), "Relatório
 * de Ocorrências de Urnas Substituídas e Votação Manual", ocorrências registradas
 * até 20:00, relatório gerado às 20:01:27. O PDF fica fora do repositório (o
 * `.gitignore` exclui todo PDF); URL e SHA-256 estão em
 * `data/brz/resultado-oficial-2026/2turno/FONTES.md`, com o "Quadro Geral de
 * Quantitativos", que confere 499.248 e 48.815.
 *
 * ⚠️ O 0,28% do TSE é sobre TODAS as urnas, somando as de contingência:
 *    1.551 / 548.063 = 0,283%, a mesma base do 1º turno. Sobre as 499.248 de
 *    votação seria 0,31%.
 *
 * 📌 Às 18h o TSE divulgou 1.516; o relatório das 20h soma 35 trocas a mais.
 *    A votação terminou às 17h, então o das 20h cobre o dia inteiro.
 */
export const URNAS_2T = {
  fonte:
    'https://www.tse.jus.br/eleicoes/eleicoes-2026-content/boletim-de-urna-2o-turno/20-00/relatorio_ocorrencias_urnas_substituidas_votacao_manual',
  votacao: 499_248,
  contingencia: 48_815,
  substituidas: 1_551,
  votacaoManual: 0,
} as const

export type LinhaRetro2T = {
  id: 'pesquisasVespera' | 'pesquisasTurno' | 'vencedor'
  /** Carimbo do ponto da véspera: data (pesquisas) ou ISO em UTC (mercado). */
  vesperaEm: string
  slug?: string
  /**
   * Pesquisas: diferença Flávio Bolsonaro MENOS Lula, por casa, em votos TOTAIS.
   * Mercado: preço de cada desfecho no último ponto gravado da véspera.
   */
  vespera: { nome: string; valor: number }[]
  /** O desfecho mais pago (ou medido) na véspera é o da urna? */
  confere: boolean
}

export const RETROSPECTO_2T: LinhaRetro2T[] = [
  {
    id: 'pesquisasVespera',
    vesperaEm: '2026-10-24',
    // As dez nacionais divulgadas em 24/Out com o total de votos (polls-data.json).
    vespera: [
      { nome: 'Gerp', valor: 3 },
      { nome: 'Veritá', valor: 2.98 },
      { nome: 'AtlasIntel', valor: 1.5 },
      { nome: 'CNT/MDA', valor: 1.3 },
      { nome: 'Datafolha', valor: 1 },
      { nome: 'Quaest', valor: 1 },
      { nome: 'Palver', valor: 1 },
      { nome: 'BTG/Nexus', valor: 1 },
      { nome: 'Futura/100% Cidades', valor: 0.3 },
      { nome: 'Colectta', valor: -0.5 },
    ],
    confere: false,
  },
  {
    id: 'pesquisasTurno',
    vesperaEm: '2026-10-24',
    // As 55 nacionais feitas depois do 1º turno: Flávio Bolsonaro à frente em 50,
    // Lula em 4 e empate em 1 (a PoderData/Aya de 16/Out, nos válidos).
    vespera: [
      { nome: 'Flávio Bolsonaro', valor: 50 },
      { nome: 'Lula', valor: 4 },
      { nome: 'empate', valor: 1 },
    ],
    confere: false,
  },
  {
    id: 'vencedor',
    vesperaEm: '2026-10-24T22:30:00Z',
    slug: 'brazil-presidential-election',
    vespera: [
      { nome: 'Flávio Bolsonaro', valor: 83.4 },
      { nome: 'Lula', valor: 16.5 },
    ],
    confere: false,
  },
]
