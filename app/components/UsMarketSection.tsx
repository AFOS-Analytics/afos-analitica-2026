'use client'

import { useState } from 'react'
import { useTranslation } from '../i18n/context'
import { SectionTitle, Card } from './ui'
import { extractCandidateName } from '../lib/utils'

/**
 * Mercado das midterms dos EUA no painel.
 *
 * ⚠️ AS REGRAS DE DESENHO, que são de método e não de estilo:
 *
 *  1. Esta seção mostra SÓ número de mercado. Não calcula divergência, não
 *     exibe Δpp e não encosta em número de pesquisa. O mercado dá PROBABILIDADE
 *     de um partido controlar a casa; a pesquisa dá VANTAGEM EM PONTOS de voto.
 *     Subtrair uma da outra produz número sem significado: em 2012 os
 *     democratas tiveram mais votos e menos cadeiras.
 *  2. Fica EM CIMA da seção de pesquisas, nunca ao lado. É a mesma regra escrita
 *     no `UsPollsSection`: dois números grandes na mesma linha fazem o olho
 *     subtrair sozinho, mesmo com o aviso escrito ao lado.
 *  3. 🔴 PORTÃO DA DISTRIBUIÇÃO. Mercado de faixa só aparece se as faixas
 *     somarem entre 95% e 105%. Não é capricho: a margem do voto popular, que é
 *     justamente o mercado que permitiria o cruzamento limpo, soma perto de
 *     146%. Uma distribuição que soma 146 não é uma distribuição, e mostrar as
 *     faixas dela como probabilidade seria publicar número que não significa o
 *     que o leitor vai achar que significa. O portão roda em cima do dado ao
 *     vivo: se o mercado amadurecer, ele aparece sozinho; se degradar, some
 *     sozinho. Não há lista de mercado escondido no código.
 *
 * O piso de VOLUME que o registro também menciona ainda não tem número
 * definido, então aqui o volume é EXIBIDO e não filtra nada. Exibir sem filtrar
 * é honesto; filtrar por um piso que eu inventei não seria.
 */

const SOMA_MIN = 95
const SOMA_MAX = 105

const T = {
  'pt-BR': {
    titulo: 'Mercado de Previsão: midterms',
    subtitulo: 'Probabilidade implícita no Polymarket · eleição de 03/11/2026',
    controle: 'Probabilidade de controlar cada casa',
    camara: 'Câmara',
    senado: 'Senado',
    distribuicoes: 'Distribuições',
    cadeirasCamara: 'Cadeiras republicanas na Câmara',
    cadeirasSenado: 'Cadeiras republicanas no Senado',
    governadores: 'Governos republicanos',
    comparecimento: 'Comparecimento',
    margem: 'Margem do voto popular',
    prazo: 'A eleição acontece na data prevista',
    volume: 'Volume',
    soma: 'soma das faixas',
    soForma: 'só a forma, sem número',
    excessoNota: (s: string) => `As faixas somam ${s}. O excesso não está espalhado por igual, ele se concentra na cauda, então dividir tudo pelo mesmo fator não o remove. Fica a forma, onde o dinheiro se concentra, e não o nível de cada faixa.`,
    faltaNota: (s: string) => `As faixas somam ${s}, abaixo de 100%. Aqui a causa não é margem da casa: é preço velho ou faixa sem preço no livro. Multiplicar para cima entregaria a massa que falta às demais, então fica só a forma.`,
    porQue: 'Por que não é probabilidade',
    porQueTexto: (s: string) =>
      `Cada faixa tem um preço que funciona como uma chance, e como uma delas vai acontecer, todas somadas deveriam dar 100%. Aqui somam ${s}. Este quadro mostra a FORMA, ou seja, o tamanho relativo de cada faixa, e não mostra número, porque o nível não vale. O AFOS já dividiu cada faixa pela soma e parou de fazer isso: dividir supõe que o sobrepreço está espalhado por igual, e a medição mostrou que ele se concentra na cauda.`,
    naoParticao: 'Fora da tela, e não é por causa da soma',
    naoParticaoCurto: (s: string) =>
      `As faixas somam ${s} e se sobrepõem: uma delas é "qualquer outro resultado" e as demais são cumulativas. Coletado todo dia; entra quando a estrutura mudar.`,
    metodoFaixasTitulo: 'Quando as faixas não somam 100%',
    metodoFaixas:
      'Cada faixa tem um preço que funciona como uma chance, e como uma delas vai acontecer, todas somadas deveriam dar 100%. Quando não somam, o AFOS mostra a FORMA da distribuição, que é o tamanho relativo das faixas, e NÃO mostra número. Até 10/Ago/2026 o AFOS dividia cada faixa pela soma e trocava a etiqueta. Parou, porque dividir tudo pelo mesmo fator supõe que o sobrepreço está espalhado por igual, e isso dá para testar: se fosse uniforme, a fatia normalizada de um grupo de faixas não mudaria quando a soma bruta mudasse. No book de cadeiras do Senado ela mudou junto, em três leituras, o que localiza o excesso na cauda. Ali dividir por igual não tira o excesso, só o espalha errado. Acima de 100% a causa é a margem de quem opera o livro; abaixo de 100% é outra coisa, preço velho ou faixa sem preço, e nesse caso multiplicar para cima entregaria às demais a massa que falta. A soma bruta fica impressa em cada quadro, para a conta continuar conferível. Há ainda um caso que fica inteiramente fora: quando as faixas se sobrepõem, como no mercado de margem do voto popular, que tem um "qualquer outro resultado" e faixas cumulativas.',
    clicavel: 'Clique em qualquer ponto de um quadro para abrir a aposta real no Polymarket, com as cotações ao vivo.',
    abrirEm: 'abrir no Polymarket',
    foraDoPortao: 'Este mercado não entra na tela porque os preços dele não fecham',
    foraDoPortaoDetalhe: (s: string) =>
      `Cada faixa tem um preço que funciona como uma chance. Como uma delas vai acontecer, todas somadas deveriam dar 100%. Aqui somam ${s}. É como uma previsão do tempo que anuncia 80% de chance de sol e 70% de chance de chuva: as duas não cabem no mesmo dia. Quando as contas não fecham assim, é sinal de mercado com pouco dinheiro e pouca negociação, e mostrar essas faixas como probabilidade daria ao leitor um número que não significa o que parece. O AFOS continua guardando este mercado todo dia, e ele aparece sozinho no dia em que as contas fecharem.`,
    limitacaoTitulo: 'O que este número é, e o que não é',
    limitacao:
      'O volume é do Polymarket, não do mercado americano inteiro. É uma casa entre outras, e o número aqui é a probabilidade que ela precifica, não uma previsão do AFOS. Mercado de faixa fina se move com pouco dinheiro.',
    semDado: 'Dado de mercado não disponível nesta captura.',
    verMetodo: 'Como o portão funciona',
    atualizado: (d: string) => `Leitura de ${d}`,
    degradado: 'Leitura parcial: parte dos mercados não respondeu nesta captura.',
  },
  en: {
    titulo: 'Prediction market: midterms',
    subtitulo: 'Implied probability on Polymarket · election of 11/03/2026',
    controle: 'Probability of controlling each chamber',
    camara: 'House',
    senado: 'Senate',
    distribuicoes: 'Distributions',
    cadeirasCamara: 'Republican House seats',
    cadeirasSenado: 'Republican Senate seats',
    governadores: 'Republican governorships',
    comparecimento: 'Turnout',
    margem: 'Popular vote margin',
    prazo: 'The election happens as scheduled',
    volume: 'Volume',
    soma: 'bands total',
    soForma: 'shape only, no numbers',
    excessoNota: (s: string) => `The bands total ${s}. The excess is not spread evenly, it concentrates in the tail, so dividing everything by the same factor does not remove it. What remains is the shape, where the money sits, not the level of each band.`,
    faltaNota: (s: string) => `The bands total ${s}, below 100%. Here the cause is not the house margin: it is stale prices or a band with no price in the book. Scaling everything up would hand the missing mass to the others, so only the shape remains.`,
    porQue: 'Why this is not probability',
    porQueTexto: (s: string) =>
      `Each band carries a price that works like a chance, and since one of them will happen, all of them together should add to 100%. Here they add to ${s}. This card shows the SHAPE, that is, the relative size of each band, and shows no number, because the level does not hold. AFOS used to divide each band by the total and stopped: dividing assumes the overpricing is spread evenly, and measurement showed it concentrates in the tail.`,
    naoParticao: 'Off the screen, and not because of the total',
    naoParticaoCurto: (s: string) =>
      `The bands add to ${s} and overlap: one is "any other outcome" and the rest are cumulative. Collected daily; it appears when the structure changes.`,
    metodoFaixasTitulo: 'When the bands do not add to 100%',
    metodoFaixas:
      'Each band carries a price that works like a chance, and since one of them will happen, all of them together should add to 100%. When they do not, AFOS shows the SHAPE of the distribution, which is the relative size of the bands, and shows NO number. Until Aug 10, 2026 AFOS divided each band by the total and changed the label. It stopped, because dividing everything by the same factor assumes the overpricing is spread evenly, and that can be tested: if it were uniform, the normalized share of a group of bands would not change when the raw total changed. In the Senate seats book it moved along with it, across three readings, which places the excess in the tail. There, dividing evenly does not remove the excess, it just spreads it wrongly. Above 100% the cause is the margin of whoever runs the book; below 100% it is something else, stale prices or a band with no price, and there scaling up would hand the missing mass to the others. The raw total stays printed on every panel, so the arithmetic remains checkable. One case stays out entirely: when the bands overlap, as in the popular-vote margin market, which has an "any other outcome" band alongside cumulative ones.',
    clicavel: 'Click anywhere on a box to open the real market on Polymarket, with live odds.',
    abrirEm: 'open on Polymarket',
    foraDoPortao: 'This market stays off the screen because its prices do not add up',
    foraDoPortaoDetalhe: (s: string) =>
      `Each band carries a price that works like a chance. Since one of them will happen, all of them together should add to 100%. Here they add to ${s}. It is like a forecast announcing an 80% chance of sun and a 70% chance of rain: the two do not fit in the same day. When the arithmetic breaks like this, it signals a market with little money and little trading, and showing these bands as probability would hand the reader a number that does not mean what it appears to. AFOS keeps collecting this market every day, and it appears on its own the day the arithmetic closes.`,
    limitacaoTitulo: 'What this number is, and what it is not',
    limitacao:
      'The volume is Polymarket’s, not the entire American market. It is one venue among others, and the number here is the probability it prices, not an AFOS forecast. Thin band markets move on little money.',
    semDado: 'Market data unavailable in this capture.',
    verMetodo: 'How the gate works',
    atualizado: (d: string) => `Read at ${d}`,
    degradado: 'Partial read: some markets did not respond in this capture.',
  },
  es: {
    titulo: 'Mercado de Predicción: midterms',
    subtitulo: 'Probabilidad implícita en Polymarket · elección del 03/11/2026',
    controle: 'Probabilidad de controlar cada cámara',
    camara: 'Cámara',
    senado: 'Senado',
    distribuicoes: 'Distribuciones',
    cadeirasCamara: 'Escaños republicanos en la Cámara',
    cadeirasSenado: 'Escaños republicanos en el Senado',
    governadores: 'Gobernaciones republicanas',
    comparecimento: 'Participación',
    margem: 'Margen del voto popular',
    prazo: 'La elección ocurre en la fecha prevista',
    volume: 'Volumen',
    soma: 'suma de las bandas',
    soForma: 'solo la forma, sin números',
    excessoNota: (s: string) => `Las bandas suman ${s}. El exceso no está repartido por igual, se concentra en la cola, así que dividir todo por el mismo factor no lo remueve. Queda la forma, donde está el dinero, y no el nivel de cada banda.`,
    faltaNota: (s: string) => `Las bandas suman ${s}, por debajo de 100%. Aquí la causa no es el margen de la casa: es precio viejo o una banda sin precio en el libro. Multiplicar hacia arriba entregaría la masa que falta a las demás, así que queda solo la forma.`,
    porQue: 'Por qué no es probabilidad',
    porQueTexto: (s: string) =>
      `Cada banda tiene un precio que funciona como una chance, y como una de ellas va a ocurrir, todas sumadas deberían dar 100%. Aquí suman ${s}. Este cuadro muestra la FORMA, es decir, el tamaño relativo de cada banda, y no muestra número, porque el nivel no vale. AFOS dividía cada banda por la suma y dejó de hacerlo: dividir supone que el sobreprecio está repartido por igual, y la medición mostró que se concentra en la cola.`,
    naoParticao: 'Fuera de la pantalla, y no por la suma',
    naoParticaoCurto: (s: string) =>
      `Las bandas suman ${s} y se superponen: una es "cualquier otro resultado" y las demás son acumulativas. Se recolecta a diario; entra cuando cambie la estructura.`,
    metodoFaixasTitulo: 'Cuando las bandas no suman 100%',
    metodoFaixas:
      'Cada banda tiene un precio que funciona como una chance, y como una de ellas va a ocurrir, todas sumadas deberían dar 100%. Cuando no suman, AFOS muestra la FORMA de la distribución, que es el tamaño relativo de las bandas, y NO muestra número. Hasta el 10/Ago/2026 AFOS dividía cada banda por la suma y cambiaba la etiqueta. Dejó de hacerlo, porque dividir todo por el mismo factor supone que el sobreprecio está repartido por igual, y eso se puede probar: si fuera uniforme, la participación normalizada de un grupo de bandas no cambiaría cuando cambiara la suma bruta. En el libro de escaños del Senado se movió junto con ella, en tres lecturas, lo que ubica el exceso en la cola. Ahí dividir por igual no saca el exceso, solo lo reparte mal. Por encima de 100% la causa es el margen de quien opera el libro; por debajo de 100% es otra cosa, precio viejo o banda sin precio, y ahí multiplicar hacia arriba entregaría a las demás la masa que falta. La suma bruta queda impresa en cada cuadro, para que la cuenta siga siendo verificable. Hay un caso que queda enteramente fuera: cuando las bandas se superponen, como en el mercado de margen del voto popular, que tiene un "cualquier otro resultado" junto a bandas acumulativas.',
    clicavel: 'Haga clic en cualquier punto de un recuadro para abrir la apuesta real en Polymarket, con las cotizaciones en vivo.',
    abrirEm: 'abrir en Polymarket',
    foraDoPortao: 'Este mercado no entra en la pantalla porque sus precios no cierran',
    foraDoPortaoDetalhe: (s: string) =>
      `Cada banda tiene un precio que funciona como una probabilidad. Como una de ellas va a ocurrir, todas sumadas deberían dar 100%. Aquí suman ${s}. Es como un pronóstico que anuncia 80% de probabilidad de sol y 70% de lluvia: las dos no caben en el mismo día. Cuando las cuentas no cierran así, es señal de un mercado con poco dinero y poca negociación, y mostrar estas bandas como probabilidad le daría al lector un número que no significa lo que parece. El AFOS sigue guardando este mercado todos los días, y aparece solo el día en que las cuentas cierren.`,
    limitacaoTitulo: 'Qué es este número, y qué no es',
    limitacao:
      'El volumen es de Polymarket, no del mercado estadounidense entero. Es una casa entre otras, y el número aquí es la probabilidad que ella fija, no un pronóstico del AFOS. Un mercado de banda fina se mueve con poco dinero.',
    semDado: 'Dato de mercado no disponible en esta captura.',
    verMetodo: 'Cómo funciona la compuerta',
    atualizado: (d: string) => `Lectura del ${d}`,
    degradado: 'Lectura parcial: parte de los mercados no respondió en esta captura.',
  },
}

interface PolyMercado {
  question: string
  outcomePrices?: string[] | number[]
  volumeNum?: number
  closed?: boolean
}
interface PolyEvento {
  title: string
  slug: string
  markets: PolyMercado[]
}
export interface UsMarketData {
  house: PolyEvento | null
  senate: PolyEvento | null
  houseSeats: PolyEvento | null
  senateSeats: PolyEvento | null
  governors: PolyEvento | null
  turnout: PolyEvento | null
  popularVoteMargin: PolyEvento | null
  asScheduled: PolyEvento | null
  fetchedAt: string | null
  degraded?: boolean
}

/**
 * Endereço da aposta real no Polymarket. O slug é validado antes de virar URL:
 * slug estranho vindo do proxy não pode montar link para qualquer lugar.
 */
const POLYMARKET_BASE = 'https://polymarket.com/event/'
function linkDo(ev: PolyEvento | null): string | null {
  const slug = ev?.slug
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) return null
  return POLYMARKET_BASE + slug
}

/**
 * Título do quadro. Vira link quando existe o mercado real do outro lado, e o
 * link abre em aba nova: o leitor está no meio de uma leitura e não deve perder
 * o lugar dela.
 *
 * 🔴 O CARD INTEIRO É CLICÁVEL, e a técnica importa. O `after:absolute
 * after:inset-0` estica uma camada invisível DESTA âncora por cima de todo o
 * card, que é `relative`. Resultado: clicar em qualquer ponto do card abre o
 * mercado.
 *
 * ⚠️ POR QUE NÃO EMBRULHAR O CARD NUM <a>, que seria o caminho óbvio: o link
 * passaria a ter como nome acessível TODO o texto de dentro. Num quadro de
 * distribuição isso vira um link chamado "Cadeiras republicanas no Senado ≤ 47
 * cad. 23,50% 48 cad. 11,50%..." e quem usa leitor de tela ouve a tabela
 * inteira como se fosse o nome do link. Com a camada esticada, o nome
 * continua sendo só o título.
 */
function TituloQuadro({ texto, href, abrirEm }: { texto: string; href: string | null; abrirEm: string }) {
  if (!href) return <h4 className="text-sm font-bold text-dark">{texto}</h4>
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm font-bold text-dark after:absolute after:inset-0 after:content-[''] group-hover:text-primary"
      title={abrirEm}
    >
      {texto}{' '}
      <span aria-hidden="true" className="text-xs font-normal text-gray-400 group-hover:text-primary">↗</span>
      <span className="sr-only"> ({abrirEm})</span>
    </a>
  )
}

function fmt(n: number, locale: string, casas = 2): string {
  const s = n.toFixed(casas)
  return locale === 'en' ? s : s.replace('.', ',')
}

/** Faixas de um evento, já com o rótulo legível e o preço em pontos percentuais. */
function faixas(ev: PolyEvento | null): { nome: string; pct: number }[] {
  if (!ev?.markets?.length) return []
  return ev.markets
    .filter((m) => !m.closed && Array.isArray(m.outcomePrices) && m.outcomePrices.length > 0)
    .map((m) => ({
      nome: extractCandidateName(m.question),
      pct: Number(m.outcomePrices![0]) * 100,
    }))
}

function volumeDe(ev: PolyEvento | null): number {
  if (!ev?.markets?.length) return 0
  return ev.markets.reduce((s, m) => s + (m.volumeNum || 0), 0)
}

/**
 * Ordem de leitura de uma faixa. Distribuição se lê na ordem do eixo, não por
 * tamanho: ordenar por probabilidade embaralharia "< 190" com "≥ 230" e a forma
 * da distribuição, que é o dado, sumiria.
 */
function ordemFaixa(nome: string): number {
  if (/Outro resultado/i.test(nome)) return 1e9
  const negativo = /^R\+/.test(nome) ? -1 : 1
  const n = nome.match(/(\d+)/)
  if (!n) return 1e8
  return negativo * Number(n[1])
}

/**
 * ⚠️ `mostrarValor=false` é o modo "forma sem número", usado quando a soma das
 * faixas reprova o portão. A barra fica, porque o tamanho relativo É a forma e
 * ela sobrevive ao sobrepreço; o percentual sai, porque seria lido como
 * probabilidade e o nível é justamente o que não vale.
 *
 * 📌 Note que a barra crua já era a forma: normalizar é reescala uniforme e não
 * muda tamanho relativo nenhum. Ou seja, tirar a normalização não tirou
 * informação da tela, tirou só o número que não podia ser lido como chance.
 */
function BarraFaixa({ nome, pct, max, locale, mostrarValor = true }: { nome: string; pct: number; max: number; locale: string; mostrarValor?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-28 shrink-0 text-right text-gray-600 tabular-nums">{nome}</span>
      <div className="h-3 flex-1 rounded bg-gray-100">
        <div
          className={`h-3 rounded ${mostrarValor ? 'bg-slate-500' : 'bg-slate-300'}`}
          style={{ width: `${max > 0 ? Math.max(1, (pct / max) * 100) : 0}%` }}
        />
      </div>
      {mostrarValor && <span className="w-14 shrink-0 font-semibold text-dark tabular-nums">{fmt(pct, locale)}%</span>}
    </div>
  )
}

/**
 * 🔴 A DISTINÇÃO QUE O PORTÃO SOZINHO NÃO FAZIA: PARTIÇÃO ou NÃO.
 *
 * Até 06/Ago/2026 toda distribuição que somasse fora de 95-105 recebia o mesmo
 * bloco âmbar de sete linhas, e o leitor saía sem número nenhum. O André leu a
 * tela e disse o que ela comunicava: descrédito, sem dado.
 *
 * O ponto técnico é que somar mais de 100% inutiliza o NÍVEL, não a FORMA. E há
 * dois casos diferentes caindo no mesmo balde:
 *
 *   PARTIÇÃO (cadeiras no Senado, na Câmara, governos, comparecimento): as
 *   faixas são exclusivas e cobrem todos os desfechos.
 *
 *   NÃO PARTIÇÃO (margem do voto popular): tem um "qualquer outro resultado" e
 *   faixas cumulativas que se sobrepõem. Aqui normalizar inventaria significado,
 *   então continua fora, com o motivo ESPECÍFICO no lugar do texto genérico.
 *
 * ⚠️ A soma BRUTA continua impressa no cabeçalho em todos os casos. O leitor
 * recebe o dado e a ressalva no mesmo lugar, e nada é consertado em silêncio.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * 🔴 REVISÃO DE 10/Ago/2026: A NORMALIZAÇÃO SAIU. Partição que reprova passa a
 * mostrar FORMA SEM NÚMERO.
 *
 * De 06 a 10/Ago, partição reprovada entrava dividida pela soma, com a etiqueta
 * trocada para "participação no livro". Isso assume que o sobrepreço está
 * espalhado POR IGUAL entre as faixas, e essa hipótese nunca tinha sido testada.
 * Foi, e não se sustenta.
 *
 * O TESTE, que não precisa de dado externo: se o excesso fosse uniforme, a fatia
 * normalizada de qualquer subconjunto de faixas seria INVARIANTE à soma bruta,
 * porque dividir tudo pelo mesmo fator preserva proporção interna. No book de
 * cadeiras do Senado, em três leituras desde 09/Ago:
 *
 *     soma 106.10%  ->  centros (50 e 51) somam 27.80%
 *     soma 135.15%  ->  24.05%
 *     soma 109.55%  ->  27.38%
 *
 * Monotônico. Logo o excesso NÃO é uniforme: ele mora na CAUDA, o padrão
 * conhecido como viés de azarão, contrato barato negociando rico. Na mesma foto,
 * 87.74% do volume estava fora dos dois resultados centrais.
 *
 * ⚠️ n=3 é indício, não prova. Basta para parar de tirar número dali, e não
 * basta para afirmar o tamanho do artefato.
 *
 * O QUE MUDA NA TELA: as barras ficam, porque a forma sobrevive; sai o
 * PERCENTUAL ao lado de cada barra, que era o número que o leitor levaria como
 * probabilidade.
 *
 * ⛔ E ABAIXO DO PISO NUNCA SE NORMALIZA, nem que a regra volte. Acima de 100 o
 * excesso é margem da casa e dividir é padrão de mercado. Abaixo de 100 a causa
 * é outra: preço velho ou FAIXA SEM PREÇO no livro. Medido em 10/Ago, o único
 * mercado abaixo de 100 era o comparecimento, e era o único com faixa sem preço
 * (11 de 12). Multiplicar todo mundo para cima entregaria a massa da faixa
 * ausente às demais, ou seja, inventaria probabilidade onde havia ausência de
 * dado. Piso e teto são falhas de natureza oposta e por isso `faltaNota` existe
 * separada de `excessoNota`.
 */
function Distribuicao({
  titulo, ev, locale, t, particao = true,
}: { titulo: string; ev: PolyEvento | null; locale: string; t: (typeof T)['pt-BR']; particao?: boolean }) {
  const fs = faixas(ev)
  if (!fs.length) return null

  const soma = fs.reduce((a, f) => a + f.pct, 0)
  const vol = volumeDe(ev)
  const passou = soma >= SOMA_MIN && soma <= SOMA_MAX
  const somaTexto = `${fmt(soma, locale, 1)}%`

  // 🔴 NADA DE NORMALIZAR, e o motivo está no bloco acima: o sobrepreço não é
  // uniforme, então dividir pela soma não o remove, apenas o redistribui errado.
  // Partição que reprova entra como FORMA: barras cruas, SEM percentual.
  const soForma = !passou && particao && soma > 0
  const abaixoDoPiso = !passou && soma < SOMA_MIN
  const exibidas = fs
  const mostrarBarras = passou || soForma

  return (
    <Card className={`mb-3 ${linkDo(ev) ? "group relative cursor-pointer transition hover:border-primary/40 hover:shadow-sm" : ""}`}>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <TituloQuadro texto={titulo} href={linkDo(ev)} abrirEm={t.abrirEm} />
        <span className="text-[11px] text-gray-500">
          {t.volume}: ${vol >= 1e6 ? `${fmt(vol / 1e6, locale)}M` : `${Math.round(vol / 1000)}k`} ·{' '}
          {t.soma} {somaTexto}
          {soForma && <> · <span className="font-semibold text-gray-600">{t.soForma}</span></>}
        </span>
      </div>

      {mostrarBarras && (
        <div className="space-y-1.5">
          {exibidas
            .sort((a, b) => ordemFaixa(a.nome) - ordemFaixa(b.nome))
            .map((f) => (
              <BarraFaixa key={f.nome} nome={f.nome} pct={f.pct} max={Math.max(...exibidas.map((x) => x.pct))} locale={locale} mostrarValor={passou} />
            ))}
        </div>
      )}

      {/* 🔴 NADA DE ELEMENTO INTERATIVO DENTRO DO CARD, e isto é regra do André
          em 06/Ago/2026: o card inteiro é área de clique para abrir a aposta no
          Polymarket, via `after:inset-0` no título. Um "por quê" que abre seria
          um segundo alvo competindo com o primeiro, e roubaria o clique numa
          faixa do quadro. Aqui vai só texto estático, curto. A explicação longa
          vive UMA vez em "Como o portão funciona", no fim da seção, em vez de
          ser repetida palavra por palavra em cada card que reprova. */}
      {soForma && (
        <p className="mt-2.5 border-t border-gray-100 pt-2 text-[11px] leading-snug text-gray-500">
          {abaixoDoPiso ? t.faltaNota(somaTexto) : t.excessoNota(somaTexto)}
        </p>
      )}

      {!mostrarBarras && (
        <p className="rounded-lg bg-gray-50 p-2.5 text-[11px] leading-snug text-gray-600">
          <span className="font-semibold text-gray-700">{t.naoParticao}.</span> {t.naoParticaoCurto(somaTexto)}
        </p>
      )}
    </Card>
  )
}

export function UsMarketSection({ data, loading }: { data: UsMarketData | null; loading?: boolean }) {
  const { locale } = useTranslation()
  const k = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as keyof typeof T
  const t = T[k]
  const [verMetodo, setVerMetodo] = useState(false)

  if (!data || (!data.house && !data.senate)) {
    return (
      <section>
        <SectionTitle>{t.titulo}</SectionTitle>
        <Card>
          {loading ? (
            <div className="space-y-2 animate-pulse" aria-hidden="true">
              <div className="h-3 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-200" />
            </div>
          ) : (
            <p className="text-sm text-gray-600">{t.semDado}</p>
          )}
        </Card>
      </section>
    )
  }

  const controle = [
    { rotulo: t.camara, ev: data.house },
    { rotulo: t.senado, ev: data.senate },
  ]
  const prazo = faixas(data.asScheduled)[0]

  return (
    <section>
      <SectionTitle>{t.titulo}</SectionTitle>

      <p className="mb-4 text-xs leading-snug text-gray-600">{t.clicavel}</p>

      {data.degraded && (
        <p className="mb-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-900">{t.degradado}</p>
      )}

      <h3 className="mb-2 text-sm font-bold text-dark">{t.controle}</h3>
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        {controle.map(({ rotulo, ev }) => {
          const fs = faixas(ev).sort((a, b) => b.pct - a.pct)
          if (!fs.length) return null
          return (
            <Card key={rotulo} className={linkDo(ev) ? "group relative cursor-pointer transition hover:border-primary/40 hover:shadow-sm" : ""}>
              <div className="mb-2 flex items-baseline justify-between gap-2">
                <TituloQuadro texto={rotulo} href={linkDo(ev)} abrirEm={t.abrirEm} />
                <span className="text-[11px] text-gray-500">
                  {t.volume}: ${fmt(volumeDe(ev) / 1e6, locale)}M
                </span>
              </div>
              <div className="space-y-1.5">
                {fs.map((f) => (
                  <BarraFaixa key={f.nome} nome={f.nome} pct={f.pct} max={100} locale={locale} />
                ))}
              </div>
            </Card>
          )
        })}
      </div>

      {/*
        Cadeiras do Senado vem PRIMEIRO entre as distribuições, e sozinha, porque
        é assim na ordem de seções que o André aprovou em 28/Jul: Mercado →
        Cadeiras do Senado → ressalva → Pesquisas. É a peça sem análogo no
        Brasil, e é a que responde "por quanto", não só "quem".
      */}
      <Distribuicao titulo={t.cadeirasSenado} ev={data.senateSeats} locale={locale} t={t} />

      <h3 className="mb-2 mt-4 text-sm font-bold text-dark">{t.distribuicoes}</h3>
      <Distribuicao titulo={t.cadeirasCamara} ev={data.houseSeats} locale={locale} t={t} />
      <Distribuicao titulo={t.governadores} ev={data.governors} locale={locale} t={t} />
      <Distribuicao titulo={t.comparecimento} ev={data.turnout} locale={locale} t={t} />
      {/* 🔴 O ÚNICO que NÃO é partição: tem faixa "qualquer outro resultado" e
          as demais são cumulativas, que se sobrepõem. Normalizar aqui seria
          inventar significado, então ele segue fora da tela, com motivo próprio. */}
      <Distribuicao titulo={t.margem} ev={data.popularVoteMargin} locale={locale} t={t} particao={false} />

      {prazo && (
        <Card className={`mb-3 ${linkDo(data.asScheduled) ? "group relative cursor-pointer transition hover:border-primary/40 hover:shadow-sm" : ""}`}>
          <div className="flex items-baseline justify-between gap-2">
            <TituloQuadro texto={t.prazo} href={linkDo(data.asScheduled)} abrirEm={t.abrirEm} />
            <span className="text-lg font-bold text-dark tabular-nums">{fmt(prazo.pct, locale)}%</span>
          </div>
        </Card>
      )}

      <Card>
        <button
          type="button"
          onClick={() => setVerMetodo((v) => !v)}
          className="text-xs font-semibold text-primary hover:underline"
          aria-expanded={verMetodo}
        >
          {verMetodo ? '▾' : '▸'} {t.verMetodo}
        </button>
        {verMetodo && (
          <div className="mt-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
              {t.limitacaoTitulo}
            </p>
            <p className="mt-1 text-xs leading-snug text-gray-700">{t.limitacao}</p>
            {/* A explicação longa das faixas vive AQUI, uma vez. Antes ela era
                repetida palavra por palavra dentro de cada quadro que reprovava,
                e dois blocos idênticos de sete linhas dominavam a seção. */}
            <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-gray-600">
              {t.metodoFaixasTitulo}
            </p>
            <p className="mt-1 text-xs leading-snug text-gray-700">{t.metodoFaixas}</p>
          </div>
        )}
      </Card>
    </section>
  )
}
