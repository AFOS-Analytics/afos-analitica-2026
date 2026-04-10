'use client';

import { useTranslation } from '../i18n/context';
import { LanguageSwitcher } from './layout/language-switcher';

interface HeaderProps {
  fetchedAt?: string;
  onShowSobre: () => void;
  onShowMetas: () => void;
  onShowGlobal: () => void;
}

export function Header({ fetchedAt, onShowSobre, onShowMetas, onShowGlobal }: HeaderProps) {
  const { t, locale } = useTranslation();

  const dateLocale = locale === 'es' ? 'es-ES' : locale === 'en' ? 'en-US' : 'pt-BR';

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded" aria-label={t('header.skipToMain')}>{t('header.skipToMain')}</a>
      <header className="bg-primary text-white py-6 px-4 md:px-8" role="banner">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t('header.title')}</h1>
              <p className="text-blue-200 mt-1 text-sm md:text-base">{t('header.subtitle')}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0 items-end sm:items-center">
              <button onClick={onShowSobre} aria-label={t('header.about')} className="border border-white/30 hover:bg-white/10 focus:outline-2 focus:outline-offset-2 focus:outline-white text-white text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 w-full sm:w-auto text-center">
                {t('header.about')}
              </button>
              <button onClick={onShowMetas} aria-label={t('header.goals')} className="border border-white/30 hover:bg-white/10 focus:outline-2 focus:outline-offset-2 focus:outline-white text-white text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 w-full sm:w-auto text-center">
                {t('header.goals')}
              </button>
              <button onClick={onShowGlobal} aria-label={t('header.global')} className="border border-white/30 hover:bg-white/10 focus:outline-2 focus:outline-offset-2 focus:outline-white text-white text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 w-full sm:w-auto text-center">
                {t('header.global')}
              </button>
              <LanguageSwitcher />
            </div>
          </div>
          <p className="text-blue-300 text-xs mt-2">
            {t('header.updated')}: {fetchedAt ? new Date(fetchedAt).toLocaleString(dateLocale, { timeZone: 'America/Sao_Paulo' }) : new Date().toLocaleString(dateLocale)}
          </p>
        </div>
      </header>
    </>
  );
}
