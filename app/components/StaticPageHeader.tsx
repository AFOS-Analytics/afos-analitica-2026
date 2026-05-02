'use client';

import Link from 'next/link';
import { useTranslation } from '../i18n/context';
import { LanguageSwitcher } from './layout/language-switcher';

export function StaticPageHeader() {
  const { t, locale } = useTranslation();

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded"
        aria-label={t('header.skipToMain')}
      >
        {t('header.skipToMain')}
      </a>
      <header className="bg-primary text-white py-6 px-4 md:px-8" role="banner">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <Link
            href={`/${locale}`}
            aria-label={t('header.backToHome')}
            className="block hover:opacity-90 focus:outline-2 focus:outline-offset-2 focus:outline-white rounded transition-opacity"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {t('header.title')}
            </h1>
            <p className="text-blue-200 mt-1 text-xs md:text-sm">{t('header.subtitle')}</p>
          </Link>

          <nav className="flex items-center gap-3 flex-wrap" aria-label="Navigation">
            <Link
              href={`/${locale}/dashboard`}
              className="border border-white/30 hover:bg-white/10 focus:outline-2 focus:outline-offset-2 focus:outline-white text-white text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg transition-all duration-200"
            >
              Dashboard
            </Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>
    </>
  );
}
