'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { VisitorStateProvider } from '../../../hooks/useVisitorState'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { ModalAbout } from '../../../components/ModalAbout'
import { ModalMetas } from '../../../components/ModalMetas'
import { LazyAboutMessages } from '../../../components/LazyAboutMessages'
import { CountrySelector } from '../../../components/CountrySelector'
import { SectionErrorBoundary } from '../../../components/SectionErrorBoundary'
import { SectionTitle } from '../../../components/ui'
import { CountryGraph, type DataLinks, type NavGroup } from '../../../components/CountryGraph'
import { StructuralContext } from '../../../components/StructuralContext'
import type { CountryContext, CountryDivergence } from '../../../../lib/country-data'
import { useTranslation } from '../../../i18n/context'
import { FrAnaliseSection, type FrAnalise } from '../../../components/fr/FrAnaliseSection'
import { FrMarketSection, type EventoPoly, type KalshiFra, type PolyFra } from '../../../components/fr/FrMarketSection'
import { FrPollsSection, type FrPollsView } from '../../../components/fr/FrPollsSection'
import { FrPressSection } from '../../../components/fr/FrPressSection'
import { FrSilencioBanner } from '../../../components/fr/FrSilencioBanner'
import { FrCandidatosSection, type FrCandidatos } from '../../../components/fr/FrCandidatosSection'
import { montarMedidas, type EstatCandidato } from '../../../../lib/fr/candidatos'
import { emSilencioEleitoral } from '../../../../lib/fr/silencio-eleitoral'
import type { FrPressData } from '../../../../lib/fr/painel'

/**
 * Painel da FRANÇA, presidencial 2027. Criado 08/Nov/2026, na ordem do painel
 * do Brasil: texto, mercado, 1º turno, 2º turno, imprensa.
 *
 * Os dados de pesquisa e de imprensa chegam do servidor (Neon); o mercado é
 * lido no cliente, como no Brasil e nos EUA, porque é o único dado que muda de
 * meia em meia hora.
 *
 * 🔇 Silêncio eleitoral: conferido no SERVIDOR (que nem manda os dados) e de
 * novo aqui, porque uma página em cache pode ser aberta já dentro da janela.
 */

export interface FrDashboardProps {
  analise: FrAnalise | null
  polls: FrPollsView
  press: { estado: 'ok' | 'vazio' | 'indisponivel'; data: FrPressData | null }
  kalshiPronto: boolean
  kalshiProntoEm: string | null
  /** WGI e WDI do Banco Mundial, do MESMO arquivo do caso França 2024 (lib/country-data/france.json). */
  context: CountryContext | null
  /** perfis, grade oficial e textos opcionais (public/fr/candidatos.{locale}.json) */
  candidatos: FrCandidatos | null
  /** contagens de listas e duelos por candidato, feitas no servidor */
  estat: EstatCandidato[]
}

function Conteudo(props: FrDashboardProps) {
  const { locale } = useTranslation()
  const [showSobre, setShowSobre] = useState(false)
  const [showMetas, setShowMetas] = useState(false)
  const [silencio] = useState(() => emSilencioEleitoral(new Date()))

  const [poly, setPoly] = useState<PolyFra>(null)
  const [polyLoading, setPolyLoading] = useState(true)
  const [kalshi, setKalshi] = useState<KalshiFra>(null)
  // 🌍 Link para a página do contrato na plataforma: só com visitante FORA da
  // França, confirmado pela Vercel. Desconhecido (falha, dev local) = sem link.
  const [comLinkDeFonte, setComLinkDeFonte] = useState(false)

  useEffect(() => {
    let vivo = true
    fetch('/api/geo', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { pais?: string | null } | null) => { if (vivo) setComLinkDeFonte(!!d?.pais && d.pais !== 'FR') })
      .catch(() => { if (vivo) setComLinkDeFonte(false) })
    return () => { vivo = false }
  }, [])

  useEffect(() => {
    if (silencio.silencio) return
    let vivo = true
    fetch('/api/polymarket?country=fra')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (vivo) setPoly(d) })
      .catch(() => { if (vivo) setPoly(null) })
      .finally(() => { if (vivo) setPolyLoading(false) })
    // A Kalshi só é lida quando já pode aparecer: antes disso, nenhum preço
    // dela chega ao navegador.
    if (props.kalshiPronto) {
      fetch('/api/kalshi?country=fra')
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => { if (vivo) setKalshi(d) })
        .catch(() => { if (vivo) setKalshi(null) })
    }
    return () => { vivo = false }
  }, [silencio.silencio, props.kalshiPronto])

  /** Mercado por nome, num contrato. Só contrato aberto e com negócio (enchimento fora). */
  const precoPorNome = (ev: EventoPoly | undefined, re: RegExp) => {
    const m = new Map<string, number>()
    for (const k of ev?.markets ?? []) {
      const nome = k.question?.match(re)?.[1]?.trim()
      const p = Number(k.outcomePrices?.[0])
      if (nome && !k.closed && Number(k.volumeNum) > 0 && Number.isFinite(p)) m.set(nome, p * 100)
    }
    return m
  }
  const medidas = useMemo(() => montarMedidas(
    props.polls.medias,
    precoPorNome(poly?.winner, /^Will (.+?) win /),
    precoPorNome(poly?.secondRound, /^Will (.+?) advance /),
    precoPorNome(poly?.onBallot, /^Will (.+?) be on /),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [poly, props.polls.medias])
  const kalshiPorNome = useMemo(() => {
    if (!props.kalshiPronto) return null
    const m = new Map<string, number>()
    for (const c of kalshi?.winner?.contratos ?? []) if (c.ultimo !== null) m.set(c.candidato, c.ultimo)
    return m
  }, [kalshi, props.kalshiPronto])

  const L = (pt: string, en: string, es: string) => (locale === 'en' ? en : locale === 'es' ? es : pt)

  const onNav = useCallback((action: string) => {
    if (action === 'about') setShowSobre(true)
    else if (action === 'metas') setShowMetas(true)
  }, [])

  /**
   * Nós clicáveis, como nos painéis do Brasil e dos EUA. SÓ ENTRA O QUE EXISTE:
   * Weekly e Tradeoff da França entram quando a №1 de cada um for publicada.
   * O Harvard leva ao caso validado França 2024, que existe, e à coleção.
   */
  const navGroups = useMemo<NavGroup[]>(() => {
    const pre = `/${locale}`
    return [
      { id: 'nav_secoes', label: L('Seções deste painel', 'Sections of this panel', 'Secciones de este panel'), color: '#0F52BA', items: [
        { id: 's_mercado', label: L('Mercados de previsão', 'Prediction markets', 'Mercados de predicción'), href: '#sec-mercado' },
        { id: 's_pesquisas', label: L('Pesquisas', 'Polling', 'Encuestas'), href: '#sec-pesquisas' },
        { id: 's_contexto', label: L('Contexto estrutural', 'Structural context', 'Contexto estructural'), href: '#sec-contexto' },
        { id: 's_imprensa', label: L('Imprensa francesa', 'French press', 'Prensa francesa'), href: '#sec-imprensa' },
      ] },
      { id: 'nav_afos', label: 'AFOS', color: '#4f46e5', items: [
        { id: 'a_metodo', label: L('Método', 'Method', 'Método'), href: `${pre}/how-it-works` },
        { id: 'a_global', label: 'AFOS Global', href: `${pre}/global` },
        { id: 'a_gov', label: L('Governança', 'Governance', 'Gobernanza'), href: `${pre}/methodology/automated-governance` },
        { id: 'a_sobre', label: L('Sobre', 'About', 'Acerca de'), action: 'about' },
        { id: 'a_metas', label: L('Metas', 'Goals', 'Metas'), action: 'metas' },
      ] },
      { id: 'nav_harvard', label: 'Harvard Dataverse', color: '#A51C30', items: [
        { id: 'h_fr24', label: L('DOI França 2024', 'France 2024 DOI', 'DOI Francia 2024'), href: 'https://doi.org/10.7910/DVN/N51NQF' },
        { id: 'h_coll', label: L('Coleção AFOS', 'AFOS collection', 'Colección AFOS'), href: 'https://dataverse.harvard.edu/dataverse/afos-analytics' },
      ] },
    ]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  /** Nós de TIPO levam à seção da própria página. Dataset de 2027 ainda não existe: sem link de eleição. */
  const dataLinks = useMemo<DataLinks>(() => ({
    market: '#sec-mercado', poll: '#sec-pesquisas', press: '#sec-imprensa', context: '#sec-contexto',
  }), [])

  /**
   * Dado do grafo. ⚠️ `iso3` é 'FR27', e não 'FRA': o código do país pertence ao
   * caso validado de 2024, e o grafo não pode confundir uma eleição em curso com
   * uma que já tem resultado (o mesmo cuidado dos EUA com 'US26').
   *
   * 🔴 `divergence_pp` fica em 0 e NUNCA é lido: o grafo vai com `divergenciaMuda`.
   * O mercado paga a probabilidade de VENCER a eleição; a pesquisa mede intenção de
   * voto no 1º TURNO. São grandezas diferentes, e subtrair uma da outra daria um
   * número sem unidade (regra dos comandos da França). A ligação existe, o número não.
   *
   * Candidatos: os 6 mais caros no mercado que também têm média de pesquisa.
   */
  const divergencia = useMemo<CountryDivergence | null>(() => {
    const mercado = new Map<string, number>()
    for (const m of poly?.winner?.markets ?? []) {
      const nome = m.question?.match(/^Will (.+?) win\b/)?.[1]?.trim()
      const p = Number(m.outcomePrices?.[0])
      if (nome && Number.isFinite(p) && !m.closed && Number(m.volumeNum) > 0) mercado.set(nome, p * 100)
    }
    const medias = new Map(props.polls.medias.map((x) => [x.candidato, x.media]))
    const rows = [...mercado.entries()]
      .filter(([nome]) => medias.has(nome))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([nome, mkt]) => ({ candidate: nome, poll_pct: medias.get(nome) as number, market_pct: Math.round(mkt * 100) / 100, divergence_pp: 0 }))
    if (rows.length === 0) return null
    return {
      iso3: 'FR27',
      hf: '',
      election: { first_round: '2027-04-18', runoff: '2027-05-02', matchup: L('Presidencial', 'Presidential', 'Presidencial'), status: 'active' },
      // Rodadas que entram na média (30 dias), não as listas do ciclo inteiro:
      // o nó dizia "369 pesquisas" contando listas desde 2024.
      polls_count: props.polls.rodadasDaMedia,
      market_candidates: rows.length,
      latest_poll: { pollster: '', date: '' },
      headline: {},
      rows,
      ...(props.context ? { context: props.context } : {}),
    } as CountryDivergence
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poly, props.polls, props.context, locale])

  const T_GRAFO = {
    'pt-BR': {
      titulo: 'Grafo do cruzamento',
      eleicao: 'França 2027 · Presidencial',
      nota: 'Um mapa navegável: a eleição no centro, os dois lados da medição (mercado e pesquisas), a imprensa, o contexto estrutural e nós clicáveis para as seções e o acervo. A linha entre o mercado e cada candidato é tracejada e não traz número, de propósito: o mercado paga a probabilidade de vencer a eleição e a pesquisa mede intenção de voto no 1º turno. São grandezas diferentes. A ligação existe, o número não.',
      contextoNota: 'Indicadores do Banco Mundial sobre o país, não sobre a eleição: governança (WGI) e economia e educação (WDI). Ficam ao lado do sinal para dar escala ao terreno, nunca como previsor: nada aqui prevê resultado eleitoral.',
    },
    en: {
      titulo: 'Cross-reference graph',
      eleicao: 'France 2027 · Presidential',
      nota: 'A navigable map: the election at the centre, both sides of the measurement (market and polls), the press, the structural context and clickable nodes to the sections and the archive. The line between the market and each candidate is dashed and carries no number, on purpose: the market pays the probability of winning the election and the poll measures first-round voting intention. They are different quantities. The link exists, the number does not.',
      contextoNota: 'World Bank indicators about the country, not about the election: governance (WGI) and economy and education (WDI). They sit alongside the signal to give scale to the terrain, never as a predictor: nothing here forecasts an electoral result.',
    },
    es: {
      titulo: 'Grafo del cruce',
      eleicao: 'Francia 2027 · Presidencial',
      nota: 'Un mapa navegable: la elección en el centro, los dos lados de la medición (mercado y encuestas), la prensa, el contexto estructural y nodos clicables hacia las secciones y el acervo. La línea entre el mercado y cada candidato es punteada y no lleva número, a propósito: el mercado paga la probabilidad de ganar la elección y la encuesta mide la intención de voto en la 1ª vuelta. Son magnitudes distintas. La conexión existe, el número no.',
      contextoNota: 'Indicadores del Banco Mundial sobre el país, no sobre la elección: gobernanza (WGI) y economía y educación (WDI). Están al lado de la señal para dar escala al terreno, nunca como predictor: nada aquí pronostica un resultado electoral.',
    },
  }
  const tGrafo = T_GRAFO[(locale === 'en' || locale === 'es' ? locale : 'pt-BR') as keyof typeof T_GRAFO]

  return (
    <div className="min-h-screen bg-white">
      <Header fetchedAt={poly?.fetchedAt ?? undefined} onShowSobre={() => setShowSobre(true)} onShowMetas={() => setShowMetas(true)} />
      <LazyAboutMessages>
        <ModalAbout show={showSobre} onClose={() => setShowSobre(false)} />
        <ModalMetas show={showMetas} onClose={() => setShowMetas(false)} />
      </LazyAboutMessages>

      <CountrySelector active="fr" />

      <main id="main-content" className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12" role="main">
        <SectionErrorBoundary locale={locale} name="Texto"><FrAnaliseSection analise={props.analise} /></SectionErrorBoundary>

        {silencio.silencio && silencio.turno && silencio.ate ? (
          <FrSilencioBanner turno={silencio.turno} ate={silencio.ate} />
        ) : (
          <>
            <div id="sec-mercado" className="scroll-mt-20">
              <SectionErrorBoundary locale={locale} name="Mercado">
                <FrMarketSection poly={poly} polyLoading={polyLoading} kalshi={kalshi} kalshiPronto={props.kalshiPronto} kalshiProntoEm={props.kalshiProntoEm} comLinkDeFonte={comLinkDeFonte} />
              </SectionErrorBoundary>
            </div>
            <div id="sec-pesquisas" className="scroll-mt-20">
              <SectionErrorBoundary locale={locale} name="Pesquisas"><FrPollsSection v={props.polls} /></SectionErrorBoundary>
            </div>
          </>
        )}

        {!silencio.silencio && !polyLoading && (
          <SectionErrorBoundary locale={locale} name="Candidatos">
            <FrCandidatosSection dados={props.candidatos} medidas={medidas} estat={props.estat} kalshi={kalshiPorNome} agora={new Date()} />
          </SectionErrorBoundary>
        )}

        {!silencio.silencio && divergencia && (
          <SectionErrorBoundary locale={locale} name="Grafo">
            <section>
              <SectionTitle>{tGrafo.titulo}</SectionTitle>
              <p className="mb-3 text-xs text-gray-500">{tGrafo.nota}</p>
              <CountryGraph data={divergencia} electionLabel={tGrafo.eleicao} locale={locale} navGroups={navGroups} onNav={onNav} dataLinks={dataLinks} divergenciaMuda rotuloMercadoMudo={L('vitória', 'win', 'victoria')} />
            </section>
          </SectionErrorBoundary>
        )}

        {/* Sem SectionTitle: o StructuralContext já desenha o próprio título (achado nos EUA em 31/Jul). */}
        {props.context && (
          <section id="sec-contexto" className="scroll-mt-20">
            <p className="mb-3 text-xs text-gray-500">{tGrafo.contextoNota}</p>
            <SectionErrorBoundary locale={locale} name="Contexto"><StructuralContext context={props.context} locale={locale} /></SectionErrorBoundary>
          </section>
        )}

        <div id="sec-imprensa" className="scroll-mt-20">
          <SectionErrorBoundary locale={locale} name="Imprensa"><FrPressSection estado={props.press.estado} data={props.press.data} /></SectionErrorBoundary>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export function FrDashboardClient(props: FrDashboardProps) {
  return (
    <VisitorStateProvider>
      <Conteudo {...props} />
    </VisitorStateProvider>
  )
}
