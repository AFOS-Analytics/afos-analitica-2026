'use client';

import { useTranslation } from '../i18n/context';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary text-white py-4 px-4 sm:px-8 text-center text-xs" role="contentinfo">
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
    </footer>
  );
}
