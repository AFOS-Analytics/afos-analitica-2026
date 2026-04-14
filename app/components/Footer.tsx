'use client';

import { useTranslation, useLocale } from '../i18n/context';

const FOOTER_LINKS: Record<string, { regions: { href: string; label: string }[]; institutional: { href: string; label: string }[] }> = {
  'pt-BR': {
    regions: [
      { href: '/pt-BR/latam', label: 'América Latina' },
      { href: '/pt-BR/eu', label: 'Europa' },
    ],
    institutional: [
      { href: '/pt-BR/for-investors', label: 'Investidores' },
      { href: '/pt-BR/for-analysts', label: 'Analistas' },
      { href: '/pt-BR/political-risk', label: 'Risco Político' },
      { href: '/pt-BR/global-election-calendar', label: 'Calendário Global' },
    ],
  },
  en: {
    regions: [
      { href: '/en/latam', label: 'Latin America' },
      { href: '/en/eu', label: 'Europe' },
    ],
    institutional: [
      { href: '/en/for-investors', label: 'Investors' },
      { href: '/en/for-analysts', label: 'Analysts' },
      { href: '/en/political-risk', label: 'Political Risk' },
      { href: '/en/global-election-calendar', label: 'Global Calendar' },
    ],
  },
  es: {
    regions: [
      { href: '/es/latam', label: 'América Latina' },
      { href: '/es/eu', label: 'Europa' },
    ],
    institutional: [
      { href: '/es/for-investors', label: 'Inversores' },
      { href: '/es/for-analysts', label: 'Analistas' },
      { href: '/es/political-risk', label: 'Riesgo Político' },
      { href: '/es/global-election-calendar', label: 'Calendario Global' },
    ],
  },
}

export function Footer() {
  const { t } = useTranslation();
  const locale = useLocale();
  const links = FOOTER_LINKS[locale] || FOOTER_LINKS['en'];

  return (
    <footer className="bg-primary text-white py-6 px-4 sm:px-8" role="contentinfo">
      <div className="max-w-6xl mx-auto">
        {/* Links de navegação SEO */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-xs">
          <div>
            <p className="font-semibold text-white/90 mb-2">{locale === 'pt-BR' ? 'Regiões' : locale === 'es' ? 'Regiones' : 'Regions'}</p>
            {links.regions.map((l) => (
              <a key={l.href} href={l.href} className="block text-white/60 hover:text-white py-0.5">{l.label}</a>
            ))}
          </div>
          <div>
            <p className="font-semibold text-white/90 mb-2">{locale === 'pt-BR' ? 'Institucional' : locale === 'es' ? 'Institucional' : 'Institutional'}</p>
            {links.institutional.map((l) => (
              <a key={l.href} href={l.href} className="block text-white/60 hover:text-white py-0.5">{l.label}</a>
            ))}
          </div>
          <div>
            <p className="font-semibold text-white/90 mb-2">{locale === 'pt-BR' ? 'Inteligência' : locale === 'es' ? 'Inteligencia' : 'Intelligence'}</p>
            <a href={`/${locale}/election-intelligence`} className="block text-white/60 hover:text-white py-0.5">{locale === 'pt-BR' ? 'Inteligência Eleitoral' : locale === 'es' ? 'Inteligencia Electoral' : 'Election Intelligence'}</a>
            <a href={`/${locale}/geopolitical-signals`} className="block text-white/60 hover:text-white py-0.5">{locale === 'pt-BR' ? 'Sinais Geopolíticos' : locale === 'es' ? 'Señales Geopolíticas' : 'Geopolitical Signals'}</a>
            <a href={`/${locale}/emerging-markets-risk`} className="block text-white/60 hover:text-white py-0.5">{locale === 'pt-BR' ? 'Mercados Emergentes' : locale === 'es' ? 'Mercados Emergentes' : 'Emerging Markets'}</a>
          </div>
          <div>
            <p className="font-semibold text-white/90 mb-2">AFOS Analytics</p>
            <a href={`/${locale}/dashboard`} className="block text-white/60 hover:text-white py-0.5">Dashboard</a>
            <a href={`/${locale}/global`} className="block text-white/60 hover:text-white py-0.5">{locale === 'pt-BR' ? 'Mapa Global' : locale === 'es' ? 'Mapa Global' : 'Global Map'}</a>
            <a href="https://github.com/AFOS-Analytics/afos-analitica-2026" target="_blank" rel="noopener noreferrer" className="block text-white/60 hover:text-white py-0.5">GitHub</a>
          </div>
        </div>

        {/* Conteúdo original preservado */}
        <div className="text-center text-xs border-t border-white/20 pt-4">
          <p>{t('footer.description')}</p>
          <p className="mt-1 text-white/70">{t('footer.disclaimer')} <a href="https://polymarket.com/politics/brazil" target="_blank" rel="noopener noreferrer" className="underline hover:text-white" aria-label={t('footer.polymarketLink')}>{t('footer.polymarket')}</a> {t('footer.notAffiliated')}</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/30 text-white/80 hover:text-white hover:bg-white/10 transition-all text-xs font-medium"
            aria-label={t('footer.backToTop')}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 12V2M7 2L2.5 6.5M7 2L11.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('footer.backToTop')}
          </button>
        </div>
      </div>
    </footer>
  );
}
