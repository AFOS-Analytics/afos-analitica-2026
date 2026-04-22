'use client';

import { useState } from 'react';
import { useDashboardData, useGlobalElections } from '../../hooks/useDashboardData';
import { useTranslation } from '../../i18n/context';
import { VisitorStateProvider } from '../../hooks/useVisitorState';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ModalAbout } from '../../components/ModalAbout';
import { ModalMetas } from '../../components/ModalMetas';
import { ModalGlobal } from '../../components/ModalGlobal';
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

function DashboardContent() {
  const { t, locale } = useTranslation();
  const { poly, polls, news, ac, crit, loading, error } = useDashboardData();
  const { globalData, mapCountries, fetchGlobal } = useGlobalElections();

  const [showSobre, setShowSobre] = useState(false);
  const [showMetas, setShowMetas] = useState(false);
  const [showGlobal, setShowGlobal] = useState(false);
  const [expandedElection, setExpandedElection] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-primary font-semibold">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-danger font-semibold text-lg mb-2">{t('common.error')}</p>
          <p className="text-gray-500 text-sm">{t('common.tryAgain')}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">{t('common.retry')}</button>
        </div>
      </div>
    );
  }

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
          onShowGlobal={() => { setShowGlobal(true); fetchGlobal(); }}
        />

        <ModalAbout show={showSobre} onClose={() => setShowSobre(false)} />
        <ModalMetas show={showMetas} onClose={() => setShowMetas(false)} />
        <ModalGlobal
          show={showGlobal}
          onClose={() => setShowGlobal(false)}
          globalData={globalData}
          mapCountries={mapCountries}
          expandedElection={expandedElection}
          setExpandedElection={setExpandedElection}
        />

        <main id="main-content" className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12" role="main">
          <PolymarketSection poly={poly} />
          <PollsSection polls={polls} crit={crit} />
          <CandidatesSection />

          {/* SEO internal links — country pages */}
          <section className="bg-light-bg border border-light-border rounded-xl p-4">
            <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
              <p className="text-xs font-semibold text-primary">{t('map.countries')}</p>
              <LogicLink anchor="paises" />
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { code: 'br', slug: locale === 'en' ? 'brazil' : 'brasil', name: 'Brasil' },
                { code: 'fr', slug: locale === 'en' ? 'france' : locale === 'es' ? 'francia' : 'franca', name: locale === 'en' ? 'France' : locale === 'es' ? 'Francia' : 'Franca' },
                { code: 'de', slug: locale === 'en' ? 'germany' : locale === 'es' ? 'alemania' : 'alemanha', name: locale === 'en' ? 'Germany' : locale === 'es' ? 'Alemania' : 'Alemanha' },
                { code: 'gb', slug: locale === 'en' ? 'united-kingdom' : 'reino-unido', name: locale === 'en' ? 'United Kingdom' : 'Reino Unido' },
                { code: 'ca', slug: 'canada', name: locale === 'en' ? 'Canada' : 'Canada' },
                { code: 'co', slug: 'colombia', name: locale === 'en' ? 'Colombia' : 'Colombia' },
                { code: 'cl', slug: 'chile', name: 'Chile' },
                { code: 'kr', slug: locale === 'en' ? 'south-korea' : locale === 'es' ? 'corea-del-sur' : 'coreia-do-sul', name: locale === 'en' ? 'South Korea' : locale === 'es' ? 'Corea del Sur' : 'Coreia do Sul' },
                { code: 'au', slug: 'australia', name: locale === 'en' ? 'Australia' : locale === 'es' ? 'Australia' : 'Australia' },
                { code: 'in', slug: locale === 'en' ? 'india' : 'india', name: locale === 'en' ? 'India' : locale === 'es' ? 'India' : 'India' },
                { code: 'mx', slug: 'mexico', name: locale === 'en' ? 'Mexico' : 'Mexico' },
                { code: 'ng', slug: 'nigeria', name: locale === 'en' ? 'Nigeria' : locale === 'es' ? 'Nigeria' : 'Nigeria' },
                { code: 'ph', slug: locale === 'en' ? 'philippines' : 'filipinas', name: locale === 'en' ? 'Philippines' : 'Filipinas' },
              ].map((c) => (
                <a key={c.slug} href={`/${locale}/country/${c.slug}`} className="flex items-center gap-1.5 bg-white border border-light-border rounded-lg px-3 py-1.5 text-xs font-medium text-dark hover:border-primary hover:text-primary transition-colors">
                  <img src={`/flags/${c.code}.svg`} alt={c.name} width={18} height={12} className="rounded-sm object-cover" style={{ width: 18, height: 12 }} />{c.name}
                </a>
              ))}
            </div>
          </section>

          <NewsSection news={news} />
          <SentimentSection sentimento={sentimento} updatedAt={ac?.updatedAt} />
          <InssSection inss={inss} updatedAt={ac?.updatedAt} />
          <BancoMasterSection bancoMaster={bancoMaster} updatedAt={ac?.updatedAt} />
          <StfSection stf={stf} updatedAt={ac?.updatedAt} polyStf={poly?.stf} />
        </main>

        <Footer />
      </div>
    </DashboardGate>
    <EmailPopup />
    </>
  );
}

export default function DashboardPage() {
  return (
    <VisitorStateProvider>
      <DashboardContent />
    </VisitorStateProvider>
  );
}
