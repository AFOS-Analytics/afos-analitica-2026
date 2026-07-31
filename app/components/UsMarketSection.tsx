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

function BarraFaixa({ nome, pct, max, locale }: { nome: string; pct: number; max: number; locale: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-28 shrink-0 text-right text-gray-600 tabular-nums">{nome}</span>
      <div className="h-3 flex-1 rounded bg-gray-100">
        <div
          className="h-3 rounded bg-slate-500"
          style={{ width: `${max > 0 ? Math.max(1, (pct / max) * 100) : 0}%` }}
        />
      </div>
      <span className="w-14 shrink-0 font-semibold text-dark tabular-nums">{fmt(pct, locale)}%</span>
    </div>
  )
}

function Distribuicao({
  titulo, ev, locale, t,
}: { titulo: string; ev: PolyEvento | null; locale: string; t: (typeof T)['pt-BR'] }) {
  const fs = faixas(ev)
  if (!fs.length) return null

  const soma = fs.reduce((a, f) => a + f.pct, 0)
  const vol = volumeDe(ev)
  const passou = soma >= SOMA_MIN && soma <= SOMA_MAX

  return (
    <Card className={`mb-3 ${linkDo(ev) ? "group relative cursor-pointer transition hover:border-primary/40 hover:shadow-sm" : ""}`}>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <TituloQuadro texto={titulo} href={linkDo(ev)} abrirEm={t.abrirEm} />
        <span className="text-[11px] text-gray-500">
          {t.volume}: ${vol >= 1e6 ? `${fmt(vol / 1e6, locale)}M` : `${Math.round(vol / 1000)}k`} ·{' '}
          {t.soma} {fmt(soma, locale, 1)}%
        </span>
      </div>

      {passou ? (
        <div className="space-y-1.5">
          {fs
            .sort((a, b) => ordemFaixa(a.nome) - ordemFaixa(b.nome))
            .map((f) => (
              <BarraFaixa key={f.nome} nome={f.nome} pct={f.pct} max={Math.max(...fs.map((x) => x.pct))} locale={locale} />
            ))}
        </div>
      ) : (
        <div className="rounded-lg border-l-4 border-amber-400 bg-amber-50 p-3">
          <p className="text-xs font-bold text-amber-900">
            {t.foraDoPortao} {fmt(soma, locale, 1)}%
          </p>
          <p className="mt-1 text-xs leading-snug text-amber-900">
            {t.foraDoPortaoDetalhe(`${fmt(soma, locale, 1)}%`)}
          </p>
        </div>
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
        <SectionTitle icon="📈">{t.titulo}</SectionTitle>
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
      <SectionTitle icon="📈">{t.titulo}</SectionTitle>

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
      <Distribuicao titulo={t.margem} ev={data.popularVoteMargin} locale={locale} t={t} />

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
          </div>
        )}
      </Card>
    </section>
  )
}
