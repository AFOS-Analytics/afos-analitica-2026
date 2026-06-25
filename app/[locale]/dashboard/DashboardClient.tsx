'use client';

import { useState, useMemo, useCallback } from 'react';
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
import { StructuralContext } from '../../components/StructuralContext';
import { CountryGraph } from '../../components/CountryGraph';
import type { NavGroup } from '../../components/CountryGraph';
import type { CountryContext, CountryDivergence } from '../../../lib/country-data';
import { LogicLink } from '../../components/LogicLink';
import { EmailPopup } from '../../components/EmailPopup';
import { DashboardGate } from '../../components/DashboardGate';
import { SectionErrorBoundary } from '../../components/SectionErrorBoundary';

// Links dos nós de DADO do grafo para o dataset público do Brasil no HF (estilo Obsidian:
// cada nó aponta para a pasta/arquivo que o alimenta, atualizada diariamente).
const BR_HF = 'https://huggingface.co/datasets/AFOS-Analytics1/brazil-2026-electoral-divergence';
const BR_DATA_LINKS = {
  election: BR_HF,
  market: `${BR_HF}/tree/main/data`,
  poll: `${BR_HF}/tree/main/polls`,
  press: `${BR_HF}/tree/main/news`,
  candidate: `${BR_HF}/tree/main/snapshots/analysis-criteriosa`,
  context: '#sec-contexto',
};

interface DashboardClientProps {
  initialPolls: PollData | null;
  initialAc: AnalysisData | null;
  initialCrit: CritData | null;
  brazilContext: CountryContext;
}

function DashboardContent({ initialPolls, initialAc, initialCrit, brazilContext }: DashboardClientProps) {
  const { t, locale } = useTranslation();
  // Estáticos (polls/ac/crit) vêm do SSR via props; só poly/news são fetch client.
  const { poly, polls, news, ac, crit, polyLoading, newsLoading } = useDashboardData({ initialPolls, initialAc, initialCrit });

  const [showSobre, setShowSobre] = useState(false);
  const [showMetas, setShowMetas] = useState(false);

  const sentimento = ac?.cards?.sentimento;
  const inss = ac?.cards?.inss;
  const bancoMaster = ac?.cards?.bancoMaster;
  const stf = ac?.cards?.stf;

  // Grafo do cruzamento (Brasil, eleição ativa): reusa o cruzamento mercado×pesquisa do
  // polls-data (polymarketComparison) + o contexto estrutural. Só candidatos com leitura de
  // pesquisa (>0). Sem nó de resultado (ativa) e rótulos no presente. Memoizado p/ não resetar
  // o grafo a cada render (poly/news carregam async).
  const brazilDivergence = useMemo<CountryDivergence>(() => {
    const pmc = (polls as unknown as { polymarketComparison?: { candidates?: Array<{ name: string; odds: number; percentage: number }> }; polls?: unknown[] });
    const brRows = (pmc?.polymarketComparison?.candidates ?? [])
      .filter((c) => typeof c.percentage === 'number' && c.percentage > 0 && typeof c.odds === 'number')
      .map((c) => ({ candidate: c.name, poll_pct: c.percentage, market_pct: c.odds, divergence_pp: Math.round((c.odds - c.percentage) * 10) / 10 }));
    return {
      iso3: 'BRA', hf: '',
      election: { first_round: '2026-10-04', runoff: '2026-10-25', matchup: 'Presidencial', status: 'active' },
      polls_count: pmc?.polls?.length ?? 0,
      market_candidates: brRows.length,
      latest_poll: { pollster: '', date: '' },
      headline: {},
      rows: brRows,
      context: brazilContext,
    };
  }, [polls, brazilContext]);

  // O grafo do Brasil é um MAPA navegável: nós clicáveis para superfícies (Daily, Tradeoff,
  // Global, Método, White Paper, Governança, Sobre, Metas) e seções do dashboard (âncoras).
  const navGroups = useMemo<NavGroup[]>(() => {
    const p = `/${locale}`;
    const L = (pt: string, en: string, es: string) => (locale === 'en' ? en : locale === 'es' ? es : pt);
    return [
      { id: 'nav_afos', label: L('AFOS · Produtos', 'AFOS · Products', 'AFOS · Productos'), color: '#4f46e5', items: [
        { id: 'n_daily', label: 'AFOS Daily', href: `${p}/daily` },
        { id: 'n_tradeoff', label: 'AFOS Tradeoff', href: `${p}/tradeoff` },
        { id: 'n_global', label: 'AFOS Global', href: `${p}/global` },
        { id: 'n_method', label: L('Método', 'Method', 'Método'), href: `${p}/how-it-works` },
        { id: 'n_wp', label: 'White Paper', href: `${p}/white-paper` },
        { id: 'n_gov', label: L('Governança', 'Governance', 'Gobernanza'), href: `${p}/methodology/automated-governance` },
        { id: 'n_about', label: L('Sobre', 'About', 'Acerca de'), action: 'about' },
        { id: 'n_metas', label: L('Metas', 'Goals', 'Metas'), action: 'metas' },
      ] },
      { id: 'nav_dash', label: L('Análises do dashboard', 'Dashboard analyses', 'Análisis del panel'), color: '#0d9488', items: [
        { id: 'n_crit', label: L('Análise criteriosa', 'In-depth analysis', 'Análisis detallado'), href: '#sec-candidatos' },
        { id: 'n_inst', label: L('Institutos monitorados', 'Monitored pollsters', 'Encuestadoras monitoreadas'), href: '#sec-pesquisas' },
        { id: 'n_cand', label: L('Perfil dos pré-candidatos', 'Pre-candidate profiles', 'Perfil de precandidatos'), href: '#sec-candidatos' },
        { id: 'n_news', label: L("Live Eleições News 120'", "Live Election News 120'", "Live Noticias 120'"), href: '#sec-news' },
        { id: 'n_clima', label: L('Clima Político', 'Political climate', 'Clima político'), href: '#sec-clima' },
        { id: 'n_inss', label: L('Escândalo INSS / Caso Lulinha', 'INSS scandal / Lulinha case', 'Escándalo INSS / Caso Lulinha'), href: '#sec-inss' },
        { id: 'n_master', label: L('Impacto Banco Master', 'Banco Master impact', 'Impacto Banco Master'), href: '#sec-master' },
        { id: 'n_stf', label: L('Credibilidade do STF', 'STF credibility', 'Credibilidad del STF'), href: '#sec-stf' },
      ] },
      { id: 'nav_harvard', label: 'Harvard Dataverse', color: '#A51C30', items: [
        { id: 'h_coll', label: L('Coleção AFOS', 'AFOS collection', 'Colección AFOS'), href: 'https://dataverse.harvard.edu/dataverse/afos-analytics' },
        { id: 'h_br', label: L('DOI Brasil 2026', 'Brazil DOI 2026', 'DOI Brasil 2026'), href: 'https://doi.org/10.7910/DVN/2D0UK7' },
        { id: 'h_us', label: L('DOI EUA 2024', 'USA DOI 2024', 'DOI EE.UU. 2024'), href: 'https://doi.org/10.7910/DVN/3DJCW5' },
      ] },
    ];
  }, [locale]);

  const onNav = useCallback((action: string) => {
    if (action === 'about') setShowSobre(true);
    else if (action === 'metas') setShowMetas(true);
  }, []);

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
          {brazilDivergence.rows.length > 0 && (
            <SectionErrorBoundary name="Grafo do cruzamento">
              <section>
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <h2 className="text-xl font-bold text-primary">{locale === 'en' ? 'Cross-reference graph' : locale === 'es' ? 'Grafo del cruce' : 'Grafo do cruzamento'}</h2>
                  <LogicLink anchor="grafo-cruzamento" />
                </div>
                <p className="text-sm text-gray-500 mb-4">{locale === 'en' ? 'A navigable map of AFOS: Brazil 2026 at the center, the market×poll divergence (colored edge with the Δpp), structural context, and clickable nodes to the products and dashboard sections.' : locale === 'es' ? 'Un mapa navegable de AFOS: Brasil 2026 en el centro, la divergencia mercado×encuesta (línea de color con el Δpp), contexto estructural y nodos clicables a los productos y secciones del panel.' : 'Um mapa navegável do AFOS: Brasil 2026 no centro, a divergência mercado×pesquisa (linha colorida com o Δpp), o contexto estrutural e nós clicáveis para os produtos e seções do dashboard.'}</p>
                <CountryGraph data={brazilDivergence} electionLabel={locale === 'en' ? 'Brazil 2026' : 'Brasil 2026'} locale={locale} isBlue={false} navGroups={navGroups} onNav={onNav} dataLinks={BR_DATA_LINKS} dim />
              </section>
            </SectionErrorBoundary>
          )}
          <div id="sec-contexto" className="scroll-mt-20"><SectionErrorBoundary name="Contexto estrutural"><StructuralContext context={brazilContext} locale={locale} isBlue={false} logicAnchor="contexto-estrutural" /></SectionErrorBoundary></div>
          <div id="sec-pesquisas" className="scroll-mt-20"><SectionErrorBoundary name="Pesquisas"><PollsSection polls={polls} crit={crit} /></SectionErrorBoundary></div>
          <div id="sec-candidatos" className="scroll-mt-20"><SectionErrorBoundary name="Candidatos"><CandidatesSection /></SectionErrorBoundary></div>

          {/* SEO internal links, country pages */}
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

          <div id="sec-news" className="scroll-mt-20"><SectionErrorBoundary name="Notícias"><NewsSection news={news} loading={newsLoading} /></SectionErrorBoundary></div>
          <div id="sec-clima" className="scroll-mt-20"><SectionErrorBoundary name="Sentimento"><SentimentSection sentimento={sentimento} updatedAt={ac?.updatedAt} /></SectionErrorBoundary></div>
          <div id="sec-inss" className="scroll-mt-20"><SectionErrorBoundary name="INSS"><InssSection inss={inss} updatedAt={ac?.updatedAt} /></SectionErrorBoundary></div>
          <div id="sec-master" className="scroll-mt-20"><SectionErrorBoundary name="Banco Master"><BancoMasterSection bancoMaster={bancoMaster} updatedAt={ac?.updatedAt} /></SectionErrorBoundary></div>
          <div id="sec-stf" className="scroll-mt-20"><SectionErrorBoundary name="STF"><StfSection stf={stf} updatedAt={ac?.updatedAt} polyStf={poly?.stf} /></SectionErrorBoundary></div>
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
