'use client'

import { useEffect, useState } from 'react'
import { VisitorStateProvider } from '../../../hooks/useVisitorState'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { ModalAbout } from '../../../components/ModalAbout'
import { ModalMetas } from '../../../components/ModalMetas'
import { LazyAboutMessages } from '../../../components/LazyAboutMessages'
import { CountrySelector } from '../../../components/CountrySelector'
import { SectionErrorBoundary } from '../../../components/SectionErrorBoundary'
import { useTranslation } from '../../../i18n/context'
import { FrAnaliseSection, type FrAnalise } from '../../../components/fr/FrAnaliseSection'
import { FrMarketSection, type KalshiFra, type PolyFra } from '../../../components/fr/FrMarketSection'
import { FrPollsSection, type FrPollsView } from '../../../components/fr/FrPollsSection'
import { FrPressSection } from '../../../components/fr/FrPressSection'
import { FrSilencioBanner } from '../../../components/fr/FrSilencioBanner'
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
}

function Conteudo(props: FrDashboardProps) {
  const { locale } = useTranslation()
  const [showSobre, setShowSobre] = useState(false)
  const [showMetas, setShowMetas] = useState(false)
  const [silencio] = useState(() => emSilencioEleitoral(new Date()))

  const [poly, setPoly] = useState<PolyFra>(null)
  const [polyLoading, setPolyLoading] = useState(true)
  const [kalshi, setKalshi] = useState<KalshiFra>(null)

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
                <FrMarketSection poly={poly} polyLoading={polyLoading} kalshi={kalshi} kalshiPronto={props.kalshiPronto} kalshiProntoEm={props.kalshiProntoEm} />
              </SectionErrorBoundary>
            </div>
            <div id="sec-pesquisas" className="scroll-mt-20">
              <SectionErrorBoundary locale={locale} name="Pesquisas"><FrPollsSection v={props.polls} /></SectionErrorBoundary>
            </div>
          </>
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
