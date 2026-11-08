'use client'

import { useTranslation } from '../../i18n/context'
import { SectionTitle, Card } from '../ui'
import { fmtDecimal, fmtVolumeUsd } from '../../../lib/i18n/numero'

/**
 * Mercado de previsão do painel da FRANÇA: Polymarket e Kalshi LADO A LADO,
 * nunca em média (decisão do André, 08/Nov/2026). A distância entre os dois
 * livros é o indicador próprio deste painel.
 *
 * 🔒 Higiene da ANJ (estudo de 08/Nov/2026, lei 2010-476, art. 57): nenhum link
 * para página de negociação, nenhum botão, preço sempre como medição, com a nota
 * de que não é convite a apostar e de que a Polymarket é bloqueada na França.
 *
 * ⏳ A Kalshi só aparece depois de 14 dias de captura sem defeito
 * (lib/kalshi/prontidao.ts). Antes disso a coluna diz quando ela entra.
 */

type MercadoPoly = { question?: string; outcomePrices?: (string | number)[]; volumeNum?: number; closed?: boolean }
export type EventoPoly = { title?: string; markets?: MercadoPoly[] } | null
export type PolyFra = { winner?: EventoPoly; secondRound?: EventoPoly; firstRoundWinner?: EventoPoly; onBallot?: EventoPoly; fetchedAt?: string | null; degraded?: boolean } | null
type ContratoKalshi = { candidato: string; ultimo: number | null; compra: number | null; venda: number | null; volumeContratos: number | null; ultimaNegociacaoEm: string | null }
export type KalshiFra = { winner?: { contratos: ContratoKalshi[]; avaliacao?: { ok: boolean } } | null; fetchedAt?: string | null } | null

const T = {
  'pt-BR': {
    titulo: 'Mercados de previsão',
    vencedor: 'Quem vence a eleição',
    colCand: 'Candidato',
    colDist: 'Distância',
    segundo: 'Quem vai ao 2º turno',
    primeiro: 'Mais votado no 1º turno',
    cedula: 'Quem estará na cédula',
    outro: 'Outro nome',
    kalshiEspera: (d: string) => `em coleta; entra em ${d}`,
    kalshiSemData: 'em coleta',
    nota: 'Preços em pontos de 0 a 100: a probabilidade implícita que o contrato paga. Dado de medição, não é convite a apostar. A Polymarket é bloqueada na França pela ANJ desde 17/07/2026 e a Kalshi também não é autorizada no país, então os preços são formados por quem negocia fora da França.',
    notaDist: 'Distância = Polymarket menos Kalshi, em pontos. Os dois livros nunca são somados nem tirados em média: taxas, liquidez e público são diferentes, e a distância é justamente o que se mede.',
    notaKalshi: 'Kalshi lida desde 08/11/2026. O volume dela é contado em contratos, não em dólares.',
    volume: (v: string) => `Giro acumulado do contrato principal na Polymarket: ${v}. É soma de negócios desde a abertura, não dinheiro em jogo hoje.`,
    confira: 'Confira o dado bruto que o AFOS leu:',
    brutoPoly: 'Polymarket (JSON) ↗',
    brutoKalshi: 'Kalshi (JSON) ↗',
    semLinkDeAposta: 'Para quem acessa da França não há link para as páginas de negociação: lá, exibir cotação com link para o site é tratado como promoção de jogo não autorizado.',
    fonte: 'fonte ↗',
    abrirFonte: (livro: string) => `Abrir o contrato na ${livro} (nova aba)`,
    comLink: 'O nome de cada livro no cabeçalho e cada "fonte" abrem a página do contrato na própria plataforma, para conferir o preço na origem. Não é convite a apostar.',
    carregando: 'Carregando preços…',
    indisponivel: 'Não foi possível ler o mercado agora. Isto é falha de leitura, não ausência de preço.',
    lido: (d: string) => `Lido em ${d}`,
  },
  en: {
    titulo: 'Prediction markets',
    vencedor: 'Who wins the election',
    colCand: 'Candidate',
    colDist: 'Gap',
    segundo: 'Who advances to the runoff',
    primeiro: 'Most votes in the first round',
    cedula: 'Who will be on the ballot',
    outro: 'Another name',
    kalshiEspera: (d: string) => `collecting; shown from ${d}`,
    kalshiSemData: 'collecting',
    nota: 'Prices in points from 0 to 100: the implied probability the contract pays. This is measurement data, not an invitation to bet. Polymarket has been blocked in France by the ANJ since 07/17/2026 and Kalshi is not licensed there either, so prices are set by traders outside France.',
    notaDist: 'Gap = Polymarket minus Kalshi, in points. The two books are never added or averaged: fees, liquidity and users differ, and the gap is exactly what is being measured.',
    notaKalshi: 'Kalshi read since 11/08/2026. Its volume is counted in contracts, not dollars.',
    volume: (v: string) => `Cumulative turnover of the main Polymarket contract: ${v}. It is the sum of trades since opening, not money at stake today.`,
    confira: 'Check the raw data AFOS read:',
    brutoPoly: 'Polymarket (JSON) ↗',
    brutoKalshi: 'Kalshi (JSON) ↗',
    semLinkDeAposta: 'Visitors in France get no link to the trading pages: there, showing odds with a link to the site is treated as promoting unlicensed gambling.',
    fonte: 'source ↗',
    abrirFonte: (livro: string) => `Open the contract on ${livro} (new tab)`,
    comLink: 'Each book name in the header and each "source" open the contract page on the platform itself, so the price can be checked at origin. Not an invitation to bet.',
    carregando: 'Loading prices…',
    indisponivel: 'The market could not be read right now. This is a read failure, not a missing price.',
    lido: (d: string) => `Read at ${d}`,
  },
  es: {
    titulo: 'Mercados de predicción',
    vencedor: 'Quién gana la elección',
    colCand: 'Candidato',
    colDist: 'Distancia',
    segundo: 'Quién pasa a la 2ª vuelta',
    primeiro: 'Más votado en la 1ª vuelta',
    cedula: 'Quién estará en la papeleta',
    outro: 'Otro nombre',
    kalshiEspera: (d: string) => `en recolección; entra el ${d}`,
    kalshiSemData: 'en recolección',
    nota: 'Precios en puntos de 0 a 100: la probabilidad implícita que paga el contrato. Es un dato de medición, no una invitación a apostar. Polymarket está bloqueada en Francia por la ANJ desde el 17/07/2026 y Kalshi tampoco está autorizada en el país, así que los precios los forman quienes operan fuera de Francia.',
    notaDist: 'Distancia = Polymarket menos Kalshi, en puntos. Los dos libros nunca se suman ni se promedian: comisiones, liquidez y público son distintos, y la distancia es justamente lo que se mide.',
    notaKalshi: 'Kalshi leída desde el 08/11/2026. Su volumen se cuenta en contratos, no en dólares.',
    volume: (v: string) => `Volumen acumulado del contrato principal en Polymarket: ${v}. Es la suma de operaciones desde la apertura, no dinero en juego hoy.`,
    confira: 'Revise el dato bruto que leyó el AFOS:',
    brutoPoly: 'Polymarket (JSON) ↗',
    brutoKalshi: 'Kalshi (JSON) ↗',
    semLinkDeAposta: 'Para quien accede desde Francia no hay enlace a las páginas de negociación: allí, mostrar cotizaciones con enlace al sitio se considera promoción de juego no autorizado.',
    fonte: 'fuente ↗',
    abrirFonte: (livro: string) => `Abrir el contrato en ${livro} (nueva pestaña)`,
    comLink: 'El nombre de cada libro en el encabezado y cada "fuente" abren la página del contrato en la propia plataforma, para cotejar el precio en el origen. No es una invitación a apostar.',
    carregando: 'Cargando precios…',
    indisponivel: 'No fue posible leer el mercado ahora. Es una falla de lectura, no ausencia de precio.',
    lido: (d: string) => `Leído el ${d}`,
  },
}

/** Contrato de enchimento ("Candidate A", "Person B") e contrato sem negócio não são preço. */
/**
 * Página do contrato NA PLATAFORMA, para o leitor conferir na origem. Só
 * aparece para visitante fora da França (decisão do André, 08/Nov/2026, opção B;
 * ver app/api/geo/route.ts). `nofollow`: não é recomendação nem parceria.
 */
const FONTE = {
  winner: 'https://polymarket.com/event/next-french-presidential-election',
  secondRound: 'https://polymarket.com/event/next-french-presidential-election-who-will-advance-to-the-2nd-round',
  firstRoundWinner: 'https://polymarket.com/event/french-presidential-election-first-round-winner',
  onBallot: 'https://polymarket.com/event/2027-french-presidential-election-who-will-be-on-the-ballot',
  kalshi: 'https://kalshi.com/markets/kxfrenchpres',
} as const

function LinkFonte({ href, rotulo }: { href: string; rotulo: string }) {
  return (
    <a href={href} target="_blank" rel="nofollow noopener noreferrer" className="ml-2 text-[11px] font-normal text-primary underline decoration-dotted underline-offset-2 hover:decoration-solid">
      {rotulo}
    </a>
  )
}

/**
 * Cabeçalho de coluna do livro (decisão do André, 08/Nov/2026): o NOME do livro,
 * em negrito, é o link para o contrato na fonte. A seta discreta fica sempre à
 * vista, porque no celular não existe hover. Visitante na França (ANJ): só o
 * nome em negrito, sem seta e sem link.
 */
function ColunaLivro({ livro, href, titulo }: { livro: string; href: string | null; titulo: string }) {
  if (!href) return <span className="font-bold text-dark">{livro}</span>
  return (
    <a href={href} target="_blank" rel="nofollow noopener noreferrer" title={titulo} aria-label={titulo}
      className="group inline-flex items-center gap-0.5 font-bold text-dark hover:text-primary hover:underline underline-offset-2">
      {livro}<span aria-hidden="true" className="text-[10px] font-normal text-gray-400 group-hover:text-primary">↗</span>
    </a>
  )
}

const ENCHIMENTO = /^(candidate|person|player)\s+[a-z]$/i

function nomeDaPergunta(q: string | undefined): string | null {
  const m = q?.match(/^Will (.+?) (?:win|advance|be on)\b/)
  return m ? m[1].trim() : null
}

const chave = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

interface Linha { nome: string; pontos: number }

function linhasDe(ev: EventoPoly, outro: string): Linha[] {
  const out: Linha[] = []
  for (const m of ev?.markets ?? []) {
    if (m.closed) continue
    const nome = nomeDaPergunta(m.question)
    const p = Number(m.outcomePrices?.[0])
    if (!nome || !Number.isFinite(p) || !(Number(m.volumeNum) > 0) || ENCHIMENTO.test(nome)) continue
    out.push({ nome: /^another person$/i.test(nome) ? outro : nome, pontos: Math.round(p * 10000) / 100 })
  }
  return out.sort((a, b) => b.pontos - a.pontos)
}

function fmtDataHora(iso: string | null | undefined, locale: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const dd = String(d.getUTCDate()).padStart(2, '0')
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const hh = `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')} UTC`
  return locale === 'en' ? `${mm}/${dd} ${hh}` : `${dd}/${mm} ${hh}`
}

function Tabela({ titulo, linhas, max, locale, fonte }: { titulo: string; linhas: Linha[]; max: number; locale: string; fonte?: { href: string; rotulo: string } }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-dark mb-2">{titulo}{fonte && <LinkFonte href={fonte.href} rotulo={fonte.rotulo} />}</h3>
      <ul className="divide-y divide-light-border text-sm">
        {linhas.slice(0, max).map((l) => (
          <li key={l.nome} className="flex justify-between py-1.5">
            <span className="text-dark">{l.nome}</span>
            <span className="tabular-nums font-medium text-dark">{fmtDecimal(l.pontos, locale, 1)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function FrMarketSection({
  poly,
  polyLoading,
  kalshi,
  kalshiPronto,
  kalshiProntoEm,
  comLinkDeFonte,
}: {
  poly: PolyFra
  polyLoading: boolean
  kalshi: KalshiFra
  kalshiPronto: boolean
  kalshiProntoEm: string | null
  /** true só com visitante FORA da França, confirmado pela rota /api/geo. */
  comLinkDeFonte: boolean
}) {
  const { locale } = useTranslation()
  const k = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as keyof typeof T
  const t = T[k]

  if (polyLoading) {
    return (
      <section>
        <SectionTitle>{t.titulo}</SectionTitle>
        <Card><p className="text-sm text-gray-500">{t.carregando}</p></Card>
      </section>
    )
  }
  if (!poly?.winner) {
    return (
      <section>
        <SectionTitle>{t.titulo}</SectionTitle>
        <Card><p className="text-sm text-gray-600">{t.indisponivel}</p></Card>
      </section>
    )
  }

  const vencedor = linhasDe(poly.winner, t.outro).slice(0, 10)
  const kalshiPorNome = new Map<string, number>()
  if (kalshiPronto) {
    for (const c of kalshi?.winner?.contratos ?? []) if (c.ultimo !== null) kalshiPorNome.set(chave(c.candidato), c.ultimo)
  }
  const volumeTotal = (poly.winner.markets ?? []).reduce((s, m) => s + (Number(m.volumeNum) || 0), 0)

  return (
    <section>
      <SectionTitle>{t.titulo}</SectionTitle>
      <Card>
        <h3 className="text-sm font-semibold text-dark mb-2">
          {t.vencedor}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-gray-500">
                <th className="py-1.5 pr-3 font-semibold">{t.colCand}</th>
                <th className="py-1.5 px-3 text-right"><ColunaLivro livro="Polymarket" href={comLinkDeFonte ? FONTE.winner : null} titulo={t.abrirFonte('Polymarket')} /></th>
                <th className="py-1.5 px-3 text-right"><ColunaLivro livro="Kalshi" href={comLinkDeFonte && kalshiPronto ? FONTE.kalshi : null} titulo={t.abrirFonte('Kalshi')} /></th>
                {kalshiPronto && <th className="py-1.5 pl-3 font-semibold text-right">{t.colDist}</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-light-border">
              {vencedor.map((l) => {
                const ka = kalshiPorNome.get(chave(l.nome))
                const dist = ka !== undefined ? Math.round((l.pontos - ka) * 100) / 100 : null
                return (
                  <tr key={l.nome}>
                    <td className="py-1.5 pr-3 text-dark">{l.nome}</td>
                    <td className="py-1.5 px-3 text-right tabular-nums font-medium">{fmtDecimal(l.pontos, locale, 2)}</td>
                    <td className="py-1.5 px-3 text-right tabular-nums text-gray-600">
                      {kalshiPronto && ka !== undefined ? fmtDecimal(ka, locale, 2) : '–'}
                    </td>
                    {kalshiPronto && (
                      <td className="py-1.5 pl-3 text-right tabular-nums text-gray-600">{dist !== null ? fmtDecimal(dist, locale, 2) : '–'}</td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Tabela titulo={t.segundo} linhas={linhasDe(poly.secondRound ?? null, t.outro)} max={6} locale={locale} fonte={comLinkDeFonte ? { href: FONTE.secondRound, rotulo: t.fonte } : undefined} />
          <Tabela titulo={t.primeiro} linhas={linhasDe(poly.firstRoundWinner ?? null, t.outro)} max={5} locale={locale} fonte={comLinkDeFonte ? { href: FONTE.firstRoundWinner, rotulo: t.fonte } : undefined} />
          <Tabela titulo={t.cedula} linhas={linhasDe(poly.onBallot ?? null, t.outro)} max={8} locale={locale} fonte={comLinkDeFonte ? { href: FONTE.onBallot, rotulo: t.fonte } : undefined} />
        </div>

        <div className="mt-5 space-y-1.5 border-t border-light-border pt-3 text-[11px] leading-snug text-gray-500">
          <p>{t.nota}</p>
          {kalshiPronto && <p>{t.notaDist}</p>}
          {kalshiPronto && <p>{t.notaKalshi}</p>}
          <p>{t.volume(fmtVolumeUsd(volumeTotal, locale))}</p>
          {poly.fetchedAt && <p>{t.lido(fmtDataHora(poly.fetchedAt, locale))}</p>}
          {/* 🔎 Verificação pelo leitor: o JSON que a própria tela leu, servido pelo
              AFOS, para todos. A página do contrato na plataforma só para quem
              está fora da França (ANJ, lei 2010-476, art. 57). */}
          <p>
            {t.confira}{' '}
            <a href="/api/polymarket?country=fra" target="_blank" rel="noopener noreferrer" className="text-primary underline decoration-dotted underline-offset-2">{t.brutoPoly}</a>
            {kalshiPronto && (<>{' · '}<a href="/api/kalshi?country=fra" target="_blank" rel="noopener noreferrer" className="text-primary underline decoration-dotted underline-offset-2">{t.brutoKalshi}</a></>)}
          </p>
          <p>{comLinkDeFonte ? t.comLink : t.semLinkDeAposta}</p>
        </div>
      </Card>
    </section>
  )
}
