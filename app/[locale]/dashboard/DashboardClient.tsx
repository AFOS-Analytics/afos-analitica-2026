'use client';

import { useState } from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useTranslation } from '../../i18n/context';
import { VisitorStateProvider } from '../../hooks/useVisitorState';
import type { PollData, AnalysisData, CritData } from '../../types';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { DailyHeroCard } from '../../components/DailyHeroCard';
import { AfosTradeoffHeroCard } from '../../components/AfosTradeoffHeroCard';
import { ModalAbout } from '../../components/ModalAbout';
import { ModalMetas } from '../../components/ModalMetas';
import { LazyAboutMessages } from '../../components/LazyAboutMessages';
import { PolymarketSection } from '../../components/PolymarketSection';
import { PollsSection } from '../../components/PollsSection';
import { CandidatesSection } from '../../components/CandidatesSection';
import { NewsSection } from '../../components/NewsSection';
import { SentimentSection } from '../../components/SentimentSection';
import { InssSection } from '../../components/InssSection';
import { BancoMasterSection } from '../../components/BancoMasterSection';
import { StfSection } from '../../components/StfSection';
import { LogicLink } from '../../components/LogicLink';
import { EmailPopup } from '../../components/EmailPopup';
import { DashboardGate } from '../../components/DashboardGate';
import { SectionErrorBoundary } from '../../components/SectionErrorBoundary';

interface DashboardClientProps {
  initialPolls: PollData | null;
  initialAc: AnalysisData | null;
  initialCrit: CritData | null;
}

function DashboardContent({ initialPolls, initialAc, initialCrit }: DashboardClientProps) {
  const { t, locale } = useTranslation();
  // Estáticos (polls/ac/crit) vêm do SSR via props; só poly/news são fetch client.
  const { poly, polls, news, ac, crit, polyLoading, newsLoading } = useDashboardData({ initialPolls, initialAc, initialCrit });

  const [showSobre, setShowSobre] = useState(false);
  const [showMetas, setShowMetas] = useState(false);

  const sentimento = ac?.cards?.sentimento;
  const inss = ac?.cards?.inss;
  const bancoMaster = ac?.cards?.bancoMaster;
  const stf = ac?.cards?.stf;

  return (
    <>
    <DashboardGate>
      <div className="min-h-screen bg-white">
        <Header
          fetchedAt={poly?.fetchedAt}
          onShowSobre={() => setShowSobre(true)}
          onShowMetas={() => setShowMetas(true)}
        />

        <LazyAboutMessages>
          <ModalAbout show={showSobre} onClose={() => setShowSobre(false)} />
          <ModalMetas show={showMetas} onClose={() => setShowMetas(false)} />
        </LazyAboutMessages>

        <DailyHeroCard />
        <AfosTradeoffHeroCard />

        <main id="main-content" className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12" role="main">
          <SectionErrorBoundary name="Polymarket"><PolymarketSection poly={poly} loading={polyLoading} /></SectionErrorBoundary>
          <SectionErrorBoundary name="Pesquisas"><PollsSection polls={polls} crit={crit} /></SectionErrorBoundary>
          <SectionErrorBoundary name="Candidatos"><CandidatesSection /></SectionErrorBoundary>

          {/* SEO internal links — country pages */}
          <section className="bg-light-bg border border-light-border rounded-xl p-4">
            <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
              <p className="text-xs font-semibold text-primary">{t('map.countries')}</p>
              <div className="flex items-center gap-3">
                <a href={`/${locale}/global`} className="text-[11px] font-semibold text-primary hover:underline">{locale === 'en' ? 'See global coverage' : locale === 'es' ? 'Ver cobertura global' : 'Ver cobertura global'} →</a>
                <LogicLink anchor="paises" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { code: 'br', slug: locale === 'en' ? 'brazil' : 'brasil', name: 'Brasil' },
                { code: 'fr', slug: locale === 'en' ? 'france' : locale === 'es' ? 'francia' : 'franca', name: locale === 'en' ? 'France' : locale === 'es' ? 'Francia' : 'Franca' },
                { code: 'de', slug: locale === 'en' ? 'germany' : locale === 'es' ? 'alemania' : 'alemanha', name: locale === 'en' ? 'Germany' : locale === 'es' ? 'Alemania' : 'Alemanha' },
                { code: 'gb', slug: locale === 'en' ? 'united-kingdom' : 'reino-unido', name: locale === 'en' ? 'United Kingdom' : 'Reino Unido' },
                { code: 'ca', slug: 'canada', name: locale === 'en' ? 'Canada' : 'Canada' },
                { code: 'co', slug: 'colombia', name: locale === 'en' ? 'Colombia' : 'Colombia' },
                { code: 'pe', slug: 'peru', name: locale === 'es' ? 'Perú' : 'Peru' },
                { code: 'cl', slug: 'chile', name: 'Chile' },
                { code: 'kr', slug: locale === 'en' ? 'south-korea' : locale === 'es' ? 'corea-del-sur' : 'coreia-do-sul', name: locale === 'en' ? 'South Korea' : locale === 'es' ? 'Corea del Sur' : 'Coreia do Sul' },
                { code: 'au', slug: 'australia', name: locale === 'en' ? 'Australia' : locale === 'es' ? 'Australia' : 'Australia' },
                { code: 'in', slug: locale === 'en' ? 'india' : 'india', name: locale === 'en' ? 'India' : locale === 'es' ? 'India' : 'India' },
                { code: 'mx', slug: 'mexico', name: locale === 'en' ? 'Mexico' : 'Mexico' },
                { code: 'ng', slug: 'nigeria', name: locale === 'en' ? 'Nigeria' : locale === 'es' ? 'Nigeria' : 'Nigeria' },
                { code: 'ph', slug: locale === 'en' ? 'philippines' : 'filipinas', name: locale === 'en' ? 'Philippines' : 'Filipinas' },
                { code: 'us', slug: locale === 'en' ? 'united-states' : 'estados-unidos', name: locale === 'en' ? 'United States' : 'Estados Unidos' },
              ].map((c) => (
                <a key={c.slug} href={`/${locale}/country/${c.slug}`} className="flex items-center gap-1.5 bg-white border border-light-border rounded-lg px-3 py-1.5 text-xs font-medium text-dark hover:border-primary hover:text-primary transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/flags/${c.code}.svg`} alt="" aria-hidden={true} width={18} height={12} className="rounded-sm object-cover" style={{ width: 18, height: 12 }} />{c.name}
                </a>
              ))}
            </div>
          </section>

          <SectionErrorBoundary name="Notícias"><NewsSection news={news} loading={newsLoading} /></SectionErrorBoundary>
          <SectionErrorBoundary name="Sentimento"><SentimentSection sentimento={sentimento} updatedAt={ac?.updatedAt} /></SectionErrorBoundary>
          <SectionErrorBoundary name="INSS"><InssSection inss={inss} updatedAt={ac?.updatedAt} /></SectionErrorBoundary>
          <SectionErrorBoundary name="Banco Master"><BancoMasterSection bancoMaster={bancoMaster} updatedAt={ac?.updatedAt} /></SectionErrorBoundary>
          <SectionErrorBoundary name="STF"><StfSection stf={stf} updatedAt={ac?.updatedAt} polyStf={poly?.stf} /></SectionErrorBoundary>
        </main>

        <Footer />
      </div>
    </DashboardGate>
    <EmailPopup />
    </>
  );
}

export function DashboardClient(props: DashboardClientProps) {
  return (
    <VisitorStateProvider>
      <DashboardContent {...props} />
    </VisitorStateProvider>
  );
}
