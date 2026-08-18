'use client'

import { useState } from 'react'
import { useTranslation } from '../i18n/context'
import { SectionTitle, Card } from './ui'
import { extractCandidateName } from '../lib/utils'
// 🔑 A régua e o tipo vêm de UM lugar. Ver `lib/us-market/portao.ts`.
import { SOMA_MIN, SOMA_MAX, type AmplitudeFaixas } from '../../lib/us-market/portao'

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
    somaPar: 'soma do par',
    normalizado: 'normalizado',
    soForma: 'só a forma, sem número',
    instavelNota: (s: string, fora: number, n: number) => `A soma está em ${s} agora, dentro do portão, mas ficou fora em ${fora} das ${n} leituras das últimas 24 horas. O quadro só mostra número quando o livro fecha em todas elas, para não trocar de estado a cada atualização.`,
    amplitude24h: (a: string, b: string) => `(variou de ${a}% a ${b}% em 24h)`,
    excessoNota: (s: string) => `As faixas somam ${s}, e deveriam somar 100%. O que passa disso não está espalhado por igual: acumula nas faixas de resultado improvável, que costumam negociar caras. Por isso dividir todas pelo mesmo número não conserta. O quadro mostra onde o dinheiro está, não a chance de cada faixa.`,
    faltaNota: (s: string) => `As faixas somam ${s}, e deveriam somar 100%. Faltando, a causa costuma ser preço parado ou faixa que o livro não está cotando. Aumentar todas para fechar a conta daria às outras a parte que está faltando. O quadro mostra onde o dinheiro está, não a chance de cada faixa.`,
    naoParticao: 'Fora da tela, e não é por causa da soma',
    naoParticaoCurto: (s: string) =>
      `As faixas somam ${s} e se sobrepõem: uma delas é "qualquer outro resultado" e as demais são cumulativas. Coletado todo dia; entra quando a estrutura mudar.`,
    metodoFaixasTitulo: 'Quando as faixas não somam 100%',
    metodoFaixas:
      'Cada faixa tem um preço que funciona como uma chance, e como uma delas vai acontecer, todas somadas deveriam dar 100%. Quando não somam, o AFOS mostra a FORMA da distribuição, que é o tamanho relativo das faixas, e NÃO mostra número. Até 10/Ago/2026 o AFOS dividia cada faixa pela soma e trocava a etiqueta. Parou, porque dividir tudo pelo mesmo fator supõe que o sobrepreço está espalhado por igual, e isso dá para testar: se fosse uniforme, a fatia normalizada de um grupo de faixas não mudaria quando a soma bruta mudasse. No book de cadeiras do Senado ela mudou junto, em três leituras, o que localiza o excesso na cauda. Ali dividir por igual não tira o excesso, só o espalha errado. Acima de 100% a causa é a margem de quem opera o livro; abaixo de 100% é outra coisa, preço velho ou faixa sem preço, e nesse caso multiplicar para cima entregaria às demais a massa que falta. A soma bruta fica impressa em cada quadro, para a conta continuar conferível. Há ainda um caso que fica inteiramente fora: quando as faixas se sobrepõem, como no mercado de margem do voto popular, que tem um "qualquer outro resultado" e faixas cumulativas. Nos dois contratos de CONTROLE de cada casa é diferente, e desde 18/Ago/2026 eles mostram as duas leituras lado a lado. Ali são só dois desfechos, um para cada partido, e não existe cauda onde o excesso possa se concentrar, então dividir pela soma é a forma padrão de tirar a margem do livro. O quadro traz o PREÇO, que é quanto o contrato custa, e o NORMALIZADO, que é o preço dividido pela soma do par. A diferença aparece nos dias em que os dois lados andam juntos: em 18/Ago os dois subiram 1,00pp, o preço democrata no Senado "subiu" de 50,50% para 51,50%, e normalizado ele foi de 51,01% para 50,99%. Nenhuma das duas leituras é a certa sozinha, e por isso as duas ficam na tela.',
    clicavel: 'Clique em qualquer ponto de um quadro para abrir a aposta real no Polymarket, com as cotações ao vivo.',
    abrirEm: 'abrir no Polymarket',
    limitacaoTitulo: 'O que este número é, e o que não é',
    limitacao:
      'O volume é do Polymarket, não do mercado americano inteiro. É uma casa entre outras, e o número aqui é a probabilidade que ela precifica, não uma previsão do AFOS. Mercado de faixa fina se move com pouco dinheiro.',
    semDado: 'Dado de mercado não disponível nesta captura.',
    verPorque: 'por que este quadro não mostra número',
    metodoExemploTitulo: 'Como sabemos que o excesso está na ponta',
    metodoExemploCab: ['Soma das faixas', 'Fatia do meio (50 e 51 cadeiras)'],
    metodoExemploNota: 'Se o exagero fosse parelho, a fatia do meio não mudaria quando a soma subisse, porque dividir tudo pelo mesmo número preserva a proporção. Mas quando o livro inflou para 135,2%, o meio encolheu para 24,1%. O ar que entrou não veio do meio, veio das bordas. São três leituras, então isto é indício e não prova.',
    metodoExemploFonte: 'Medido no livro de cadeiras do Senado em 09 e 10/Ago/2026.',
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
    somaPar: 'pair total',
    normalizado: 'normalized',
    soForma: 'shape only, no numbers',
    instavelNota: (s: string, fora: number, n: number) => `The total is ${s} right now, inside the gate, but it fell outside in ${fora} of the ${n} readings over the last 24 hours. The card only shows numbers when the book closes on all of them, so it does not switch state on every refresh.`,
    amplitude24h: (a: string, b: string) => `(ranged from ${a}% to ${b}% in 24h)`,
    excessoNota: (s: string) => `The bands total ${s}, and should total 100%. What goes beyond that is not spread evenly: it piles up on the unlikely bands, which tend to trade rich. So dividing them all by the same number does not fix it. The card shows where the money sits, not the chance of each band.`,
    faltaNota: (s: string) => `The bands total ${s}, and should total 100%. When they fall short, the cause is usually stale prices or a band the book is not quoting. Scaling them all up to close the gap would hand the missing part to the others. The card shows where the money sits, not the chance of each band.`,
    naoParticao: 'Off the screen, and not because of the total',
    naoParticaoCurto: (s: string) =>
      `The bands add to ${s} and overlap: one is "any other outcome" and the rest are cumulative. Collected daily; it appears when the structure changes.`,
    metodoFaixasTitulo: 'When the bands do not add to 100%',
    metodoFaixas:
      'Each band carries a price that works like a chance, and since one of them will happen, all of them together should add to 100%. When they do not, AFOS shows the SHAPE of the distribution, which is the relative size of the bands, and shows NO number. Until Aug 10, 2026 AFOS divided each band by the total and changed the label. It stopped, because dividing everything by the same factor assumes the overpricing is spread evenly, and that can be tested: if it were uniform, the normalized share of a group of bands would not change when the raw total changed. In the Senate seats book it moved along with it, across three readings, which places the excess in the tail. There, dividing evenly does not remove the excess, it just spreads it wrongly. Above 100% the cause is the margin of whoever runs the book; below 100% it is something else, stale prices or a band with no price, and there scaling up would hand the missing mass to the others. The raw total stays printed on every panel, so the arithmetic remains checkable. One case stays out entirely: when the bands overlap, as in the popular-vote margin market, which has an "any other outcome" band alongside cumulative ones. The two CONTROL contracts for each chamber are different, and since 2026-08-18 they show both readings side by side. There are only two outcomes there, one per party, and no tail for the excess to concentrate in, so dividing by the total is the standard way to strip the book operatorâs margin. The card carries the PRICE, which is what the contract costs, and the NORMALIZED value, which is the price divided by the pair total. The difference shows up on days when both sides move together: on 2026-08-18 both rose 1.00pp, the Democratic Senate price "rose" from 50.50% to 51.50%, and normalized it went from 51.01% to 50.99%. Neither reading is the right one on its own, which is why both stay on screen.',
    clicavel: 'Click anywhere on a box to open the real market on Polymarket, with live odds.',
    abrirEm: 'open on Polymarket',
    limitacaoTitulo: 'What this number is, and what it is not',
    limitacao:
      'The volume is Polymarket’s, not the entire American market. It is one venue among others, and the number here is the probability it prices, not an AFOS forecast. Thin band markets move on little money.',
    semDado: 'Market data unavailable in this capture.',
    verPorque: 'why this card shows no number',
    metodoExemploTitulo: 'How we know the excess sits at the edges',
    metodoExemploCab: ['Bands total', 'Middle share (50 and 51 seats)'],
    metodoExemploNota: 'If the overpricing were even, the middle share would not change when the total rose, because dividing everything by the same number preserves the proportion. But when the book inflated to 135.2%, the middle shrank to 24.1%. The air that came in did not come from the middle, it came from the edges. Three readings, so this is an indication and not proof.',
    metodoExemploFonte: 'Measured on the Senate seats book on Aug 09 and 10, 2026.',
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
    somaPar: 'suma del par',
    normalizado: 'normalizado',
    soForma: 'solo la forma, sin números',
    instavelNota: (s: string, fora: number, n: number) => `La suma está en ${s} ahora, dentro de la compuerta, pero quedó fuera en ${fora} de las ${n} lecturas de las últimas 24 horas. El cuadro solo muestra número cuando el libro cierra en todas ellas, para no cambiar de estado en cada actualización.`,
    amplitude24h: (a: string, b: string) => `(varió de ${a}% a ${b}% en 24h)`,
    excessoNota: (s: string) => `Las bandas suman ${s}, y deberían sumar 100%. Lo que pasa de ahí no está repartido por igual: se acumula en las bandas de resultado improbable, que suelen cotizar caras. Por eso dividirlas todas por el mismo número no arregla. El cuadro muestra dónde está el dinero, no la chance de cada banda.`,
    faltaNota: (s: string) => `Las bandas suman ${s}, y deberían sumar 100%. Cuando falta, la causa suele ser precio detenido o una banda que el libro no está cotizando. Subirlas todas para cerrar la cuenta daría a las otras la parte que falta. El cuadro muestra dónde está el dinero, no la chance de cada banda.`,
    naoParticao: 'Fuera de la pantalla, y no por la suma',
    naoParticaoCurto: (s: string) =>
      `Las bandas suman ${s} y se superponen: una es "cualquier otro resultado" y las demás son acumulativas. Se recolecta a diario; entra cuando cambie la estructura.`,
    metodoFaixasTitulo: 'Cuando las bandas no suman 100%',
    metodoFaixas:
      'Cada banda tiene un precio que funciona como una chance, y como una de ellas va a ocurrir, todas sumadas deberían dar 100%. Cuando no suman, AFOS muestra la FORMA de la distribución, que es el tamaño relativo de las bandas, y NO muestra número. Hasta el 10/Ago/2026 AFOS dividía cada banda por la suma y cambiaba la etiqueta. Dejó de hacerlo, porque dividir todo por el mismo factor supone que el sobreprecio está repartido por igual, y eso se puede probar: si fuera uniforme, la participación normalizada de un grupo de bandas no cambiaría cuando cambiara la suma bruta. En el libro de escaños del Senado se movió junto con ella, en tres lecturas, lo que ubica el exceso en la cola. Ahí dividir por igual no saca el exceso, solo lo reparte mal. Por encima de 100% la causa es el margen de quien opera el libro; por debajo de 100% es otra cosa, precio viejo o banda sin precio, y ahí multiplicar hacia arriba entregaría a las demás la masa que falta. La suma bruta queda impresa en cada cuadro, para que la cuenta siga siendo verificable. Hay un caso que queda enteramente fuera: cuando las bandas se superponen, como en el mercado de margen del voto popular, que tiene un "cualquier otro resultado" junto a bandas acumulativas. En los dos contratos de CONTROL de cada cÃ¡mara es distinto, y desde el 18/08/2026 muestran las dos lecturas lado a lado. AllÃ­ son solo dos resultados, uno por partido, y no existe cola donde el exceso pueda concentrarse, asÃ­ que dividir por la suma es la forma estÃ¡ndar de quitar el margen del libro. El cuadro trae el PRECIO, que es cuÃ¡nto cuesta el contrato, y el NORMALIZADO, que es el precio dividido por la suma del par. La diferencia aparece en los dÃ­as en que los dos lados se mueven juntos: el 18/08/2026 los dos subieron 1,00pp, el precio demÃ³crata en el Senado "subiÃ³" de 50,50% a 51,50%, y normalizado fue de 51,01% a 50,99%. Ninguna de las dos lecturas es la correcta por sÃ­ sola, y por eso las dos quedan en pantalla.',
    clicavel: 'Haga clic en cualquier punto de un recuadro para abrir la apuesta real en Polymarket, con las cotizaciones en vivo.',
    abrirEm: 'abrir en Polymarket',
    limitacaoTitulo: 'Qué es este número, y qué no es',
    limitacao:
      'El volumen es de Polymarket, no del mercado estadounidense entero. Es una casa entre otras, y el número aquí es la probabilidad que ella fija, no un pronóstico del AFOS. Un mercado de banda fina se mueve con poco dinero.',
    semDado: 'Dato de mercado no disponible en esta captura.',
    verPorque: 'por qué este cuadro no muestra número',
    metodoExemploTitulo: 'Cómo sabemos que el exceso está en los extremos',
    metodoExemploCab: ['Suma de las bandas', 'Participación del medio (50 y 51 escaños)'],
    metodoExemploNota: 'Si el sobreprecio fuera parejo, la participación del medio no cambiaría cuando la suma subiera, porque dividir todo por el mismo número preserva la proporción. Pero cuando el libro se infló a 135,2%, el medio se encogió a 24,1%. El aire que entró no vino del medio, vino de los bordes. Son tres lecturas, así que esto es indicio y no prueba.',
    metodoExemploFonte: 'Medido en el libro de escaños del Senado el 09 y 10/Ago/2026.',
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
  titulo, ev, locale, t, particao = true, amplitude, onVerPorque,
}: { titulo: string; ev: PolyEvento | null; locale: string; t: (typeof T)['pt-BR']; particao?: boolean; amplitude?: AmplitudeFaixas; onVerPorque?: () => void }) {
  const fs = faixas(ev)
  if (!fs.length) return null

  const soma = fs.reduce((a, f) => a + f.pct, 0)
  const vol = volumeDe(ev)
  const somaTexto = `${fmt(soma, locale, 1)}%`

  /**
   * 🔴 O PORTÃO DECIDE PELA SÉRIE, NÃO PELO INSTANTE. Mudado em 10/Ago/2026.
   *
   * Antes bastava a leitura de agora fechar entre 95 e 105. Só que a soma
   * oscila e o corte é duro, então o quadro trocava de identidade sozinho: no
   * book do Senado o portão virou SEIS vezes em dez capturas, e três dessas
   * viradas foram por menos de 1,5 ponto (104,90 → 106,00 → 105,40 → 104,40).
   * Quem atualizava a página duas vezes no mesmo dia via dois painéis
   * diferentes sem que nada eleitoral tivesse mudado.
   *
   * Agora o quadro só mostra número quando o livro fechou o portão em TODAS as
   * leituras das últimas 24h. A assimetria é proposital e é a favor da
   * desconfiança: **uma leitura ruim tira o número, e recuperá-lo exige 24h
   * limpas**. Rápido para desconfiar, lento para confiar.
   *
   * ⚠️ Sem série (`n === 0`), cai na regra do instante. Mercado recém-listado
   * não pode ficar escondido para sempre por falta de histórico.
   */
  const fechaAgora = soma >= SOMA_MIN && soma <= SOMA_MAX
  const temSerie = !!amplitude && amplitude.n > 0
  const serieLimpa = temSerie && amplitude!.dentro === amplitude!.n
  const passou = temSerie ? serieLimpa : fechaAgora
  /** Fecha agora mas a série não é limpa. Precisa de texto próprio, senão o
   *  leitor vê uma soma dentro do portão e nenhum número, sem explicação. */
  const instavel = fechaAgora && temSerie && !serieLimpa

  // 🔴 NADA DE NORMALIZAR, e o motivo está no bloco acima: o sobrepreço não é
  // uniforme, então dividir pela soma não o remove, apenas o redistribui errado.
  // Partição que reprova entra como FORMA: barras cruas, SEM percentual.
  const soForma = !passou && particao && soma > 0
  const abaixoDoPiso = !passou && soma < SOMA_MIN
  const exibidas = fs
  const mostrarBarras = passou || soForma

  // A faixa das 24h SEMPRE contém a soma de agora. Ver o comentário no cabeçalho.
  const faixa24h = (() => {
    if (!amplitude || amplitude.n < 1) return null
    const min = Math.min(amplitude.min, soma)
    const max = Math.max(amplitude.max, soma)
    // Faixa degenerada não informa nada e só polui o cabeçalho.
    return max - min >= 0.05 ? { min, max } : null
  })()

  return (
    <>
      <Card className={`mb-3 ${linkDo(ev) ? "group relative cursor-pointer transition hover:border-primary/40 hover:shadow-sm" : ""}`}>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <TituloQuadro texto={titulo} href={linkDo(ev)} abrirEm={t.abrirEm} />
        <span className="text-[11px] text-gray-500">
          {t.volume}: ${vol >= 1e6 ? `${fmt(vol / 1e6, locale)}M` : `${Math.round(vol / 1000)}k`} ·{' '}
          {t.soma} {somaTexto}
          {/* 🔴 A AMPLITUDE DAS ÚLTIMAS 24h, publicada ao lado da soma. O portão
              decide por UMA leitura, e a soma oscila: no book do Senado ele virou
              seis vezes em dez capturas, três delas por menos de 1,5 ponto. Em vez
              de esconder isso, o painel mostra.

              ⚠️ A LEITURA DE AGORA ENTRA NA FAIXA. A série vem do banco, que só
              tem o que o cron gravou, e a leitura ao vivo é mais nova que a
              última gravação. Sem isto o quadro chegava a exibir soma de 97,4%
              ao lado de "variou de 102,3% a 164,4%", ou seja, o número mostrado
              ficava FORA da própria faixa. Medido no preview de 10/Ago. */}
          {faixa24h && (
            <> <span className="text-gray-400">{t.amplitude24h(fmt(faixa24h.min, locale, 1), fmt(faixa24h.max, locale, 1))}</span></>
          )}
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
          {instavel
            ? t.instavelNota(somaTexto, amplitude!.n - amplitude!.dentro, amplitude!.n)
            : abaixoDoPiso
              ? t.faltaNota(somaTexto)
              : t.excessoNota(somaTexto)}
        </p>
      )}

      {!mostrarBarras && (
        <p className="rounded-lg bg-gray-50 p-2.5 text-[11px] leading-snug text-gray-600">
          <span className="font-semibold text-gray-700">{t.naoParticao}.</span> {t.naoParticaoCurto(somaTexto)}
        </p>
      )}
      </Card>

      {/* 🔴 O LINK FICA FORA DO CARD, e isto não é detalhe de layout.
          Regra do André de 06/Ago: o card inteiro é área de clique para abrir a
          aposta no Polymarket, via `after:inset-0` no título. Um botão DENTRO
          seria um segundo alvo competindo com o primeiro e roubaria o clique.
          Aqui ele vive abaixo, fora da caixa clicável, e some junto com a nota.

          📌 Ele NÃO abre um texto próprio: chama o bloco "Como o portão
          funciona", que já existe no fim da seção. Uma explicação só, alcançável
          de onde ela é necessária. Três cópias do mesmo texto é como elas
          divergem, e foi o que aconteceu hoje quando o método mudou e os textos
          publicados continuaram descrevendo o método antigo. */}
      {(soForma || !mostrarBarras) && onVerPorque && (
        <div className="-mt-2 mb-3 pl-1">
          <button
            type="button"
            onClick={onVerPorque}
            className="text-[11px] text-gray-500 underline decoration-gray-300 underline-offset-2 hover:text-primary hover:decoration-primary"
          >
            {t.verPorque}
          </button>
        </div>
      )}
    </>
  )
}

export function UsMarketSection({ data, loading, amplitudes }: { data: UsMarketData | null; loading?: boolean; amplitudes?: Record<string, AmplitudeFaixas> }) {
  /** Amplitude da soma nas ultimas 24h, por slug. Ausente = quadro como antes. */
  const amp = (ev: PolyEvento | null) => (ev?.slug && amplitudes ? amplitudes[ev.slug] : undefined)
  const { locale } = useTranslation()
  const k = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as keyof typeof T
  const t = T[k]
  const [verMetodo, setVerMetodo] = useState(false)

  /**
   * Abre o bloco do metodo e rola ate ele. E o destino UNICO do link discreto
   * que aparece abaixo de cada quadro que reprova: em vez de um texto proprio
   * por quadro, todos apontam para a mesma explicacao.
   */
  const abrirMetodo = () => {
    setVerMetodo(true)
    requestAnimationFrame(() => {
      document.getElementById('us-metodo-faixas')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

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

          /**
           * 🔴 O PAR BINÁRIO GANHOU O NORMALIZADO AO LADO DO CRU, em 18/Ago/2026,
           * por decisão do André.
           *
           * O que aconteceu naquele dia: os DOIS lados do Senado subiram 1,00pp
           * cada um, de D 50,50 e R 48,50 para D 51,50 e R 49,50. A soma do par
           * foi de 99,00% para 101,00%. Lido cru, o democrata "subiu 1,00pp".
           * Normalizado pela soma, ele foi de 51,0101% para 50,9901%, ou seja
           * -0,02pp. **O preço subiu um ponto e a probabilidade não subiu nada.**
           *
           * ⚠️ POR QUE AQUI SIM E NA DISTRIBUIÇÃO NÃO. A distribuição parou de
           * ser normalizada em 10/Ago porque o teste do excesso uniforme mostrou
           * que o sobrepreço se concentra na CAUDA, então dividir tudo pelo mesmo
           * número espalha errado em vez de remover. **Num par de dois lados não
           * existe cauda**: são dois desfechos exclusivos que cobrem todos os
           * casos, e dividir pela soma é a remoção padrão da margem.
           *
           * ⛔ Mas o teste do excesso uniforme NÃO É APLICÁVEL a duas faixas: ele
           * precisa de subgrupos para comparar. Ou seja, aqui a hipótese de que a
           * margem se reparte proporcionalmente **não pode ser testada pelo mesmo
           * método**, e por isso as duas leituras aparecem lado a lado em vez de o
           * normalizado substituir o preço. Quem lê decide qual usar.
           *
           * 📌 A soma bruta fica impressa no cabeçalho, como já é na distribuição:
           * nada é consertado em silêncio.
           */
          const somaPar = fs.reduce((a, f) => a + f.pct, 0)
          /**
           * 🔴 A LINHA APARECE SEMPRE, decisão do André em 18/Ago/2026.
           *
           * A primeira versão só mostrava o normalizado quando a soma desviava
           * de 100 em 0,1pp ou mais, para não repetir o mesmo número duas vezes.
           * O efeito colateral era pior que a repetição: **o leitor só descobria
           * que existe uma segunda leitura nos dias em que o livro abre**, e nos
           * outros dias o quadro não dizia que aquele preço já tinha sido
           * conferido contra a soma do par.
           *
           * Agora a linha é permanente. Quando a soma fecha em 100, ela repete o
           * preço, e isso É a informação: diz que naquele dia não havia margem
           * para tirar. Ausência de diferença medida e ausência de medição
           * deixam de ter a mesma cara.
           */
          const valeNormalizar = somaPar > 0

          return (
            <Card key={rotulo} className={linkDo(ev) ? "group relative cursor-pointer transition hover:border-primary/40 hover:shadow-sm" : ""}>
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <TituloQuadro texto={rotulo} href={linkDo(ev)} abrirEm={t.abrirEm} />
                <span className="text-[11px] text-gray-500">
                  {t.volume}: ${fmt(volumeDe(ev) / 1e6, locale)}M
                  {somaPar > 0 && <> · {t.somaPar} {fmt(somaPar, locale, 1)}%</>}
                </span>
              </div>
              <div className="space-y-1.5">
                {fs.map((f) => (
                  <BarraFaixa key={f.nome} nome={f.nome} pct={f.pct} max={100} locale={locale} />
                ))}
              </div>
              {valeNormalizar && (
                <p className="mt-2 text-[11px] leading-snug text-gray-500">
                  {t.normalizado}:{' '}
                  {fs.map((f, i) => (
                    <span key={f.nome}>
                      {i > 0 && ' · '}
                      {f.nome} <span className="font-semibold tabular-nums text-gray-700">{fmt((f.pct / somaPar) * 100, locale)}%</span>
                    </span>
                  ))}
                </p>
              )}
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
      <Distribuicao titulo={t.cadeirasSenado} ev={data.senateSeats} locale={locale} t={t} amplitude={amp(data.senateSeats)} onVerPorque={abrirMetodo} />

      <h3 className="mb-2 mt-4 text-sm font-bold text-dark">{t.distribuicoes}</h3>
      <Distribuicao titulo={t.cadeirasCamara} ev={data.houseSeats} locale={locale} t={t} amplitude={amp(data.houseSeats)} onVerPorque={abrirMetodo} />
      <Distribuicao titulo={t.governadores} ev={data.governors} locale={locale} t={t} amplitude={amp(data.governors)} onVerPorque={abrirMetodo} />
      <Distribuicao titulo={t.comparecimento} ev={data.turnout} locale={locale} t={t} amplitude={amp(data.turnout)} onVerPorque={abrirMetodo} />
      {/* 🔴 O ÚNICO que NÃO é partição: tem faixa "qualquer outro resultado" e
          as demais são cumulativas, que se sobrepõem. Normalizar aqui seria
          inventar significado, então ele segue fora da tela, com motivo próprio. */}
      <Distribuicao titulo={t.margem} ev={data.popularVoteMargin} locale={locale} t={t} particao={false} amplitude={amp(data.popularVoteMargin)} onVerPorque={abrirMetodo} />

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
            <p id="us-metodo-faixas" className="mt-3 scroll-mt-24 text-[11px] font-bold uppercase tracking-wider text-gray-600">
              {t.metodoFaixasTitulo}
            </p>
            <p className="mt-1 text-xs leading-snug text-gray-700">{t.metodoFaixas}</p>

            {/* 🔬 A MEDIÇÃO, e não só a afirmação. Esta tabela é o que convence:
                se o exagero fosse parelho, a fatia do meio seria invariante à
                soma bruta. Ela anda junto, então o excesso está nas pontas.

                ⚠️ O exemplo é DATADO de propósito. Ele é do livro de cadeiras do
                Senado em 09 e 10/Ago/2026, e vai envelhecer. Exemplo medido com
                data vale mais que explicação abstrata, e é o que a casa faz em
                todo lugar; o que não pode é passar por atemporal. */}
            <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-gray-600">
              {t.metodoExemploTitulo}
            </p>
            <table className="mt-1.5 w-full max-w-md text-xs tabular-nums">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-1 pr-4 font-medium">{t.metodoExemploCab[0]}</th>
                  <th className="py-1 font-medium">{t.metodoExemploCab[1]}</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {[['106,1%', '27,8%'], ['135,2%', '24,1%'], ['109,6%', '27,4%']].map(([a, b]) => (
                  <tr key={a} className="border-t border-gray-100">
                    <td className="py-1 pr-4">{a}</td>
                    <td className="py-1">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs leading-snug text-gray-700">{t.metodoExemploNota}</p>
            <p className="mt-1 text-[11px] text-gray-500">{t.metodoExemploFonte}</p>
          </div>
        )}
      </Card>
    </section>
  )
}
