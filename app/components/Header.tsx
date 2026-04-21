'use client';

import Link from 'next/link';
import { useTranslation } from '../i18n/context';
import { LanguageSwitcher } from './layout/language-switcher';

const HOW_IT_WORKS_LABEL: Record<string, string> = {
  'pt-BR': 'O Método',
  en: 'The Method',
  es: 'El Método',
};

interface HeaderProps {
  fetchedAt?: string;
  onShowSobre: () => void;
  onShowMetas: () => void;
  onShowGlobal: () => void;
}

export function Header({ fetchedAt, onShowSobre, onShowMetas, onShowGlobal }: HeaderProps) {
  const { t, locale } = useTranslation();

  const dateLocale = locale === 'es' ? 'es-ES' : locale === 'en' ? 'en-US' : 'pt-BR';

  const btnClass = "border border-white/30 hover:bg-white/10 focus:outline-2 focus:outline-offset-2 focus:outline-white text-white text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 w-full sm:w-auto text-center";

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded" aria-label={t('header.skipToMain')}>{t('header.skipToMain')}</a>
      <header className="bg-primary text-white py-6 px-4 md:px-8" role="banner">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-4xl font-extrabold tracking-tight">{t('header.title')}</h1>
              <p className="text-blue-200 mt-1 text-sm md:text-base">{t('header.subtitle')}</p>
            </div>

            {/* Desktop: botões em linha + globo no final */}
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={onShowSobre} aria-label={t('header.about')} className={btnClass}>
                {t('header.about')}
              </button>
              <button onClick={onShowMetas} aria-label={t('header.goals')} className={btnClass}>
                {t('header.goals')}
              </button>
              <button onClick={onShowGlobal} aria-label={t('header.global')} className={btnClass}>
                {t('header.global')}
              </button>
              <LanguageSwitcher />
            </div>

            {/* Mobile: globo + botões empilhados */}
            <div className="flex sm:hidden items-start gap-2">
              <LanguageSwitcher />
              <div className="flex flex-col gap-2">
                <button onClick={onShowSobre} aria-label={t('header.about')} className={btnClass}>
                  {t('header.about')}
                </button>
                <button onClick={onShowMetas} aria-label={t('header.goals')} className={btnClass}>
                  {t('header.goals')}
                </button>
                <button onClick={onShowGlobal} aria-label={t('header.global')} className={btnClass}>
                  {t('header.global')}
                </button>
              </div>
            </div>
          </div>
          <p className="text-blue-300 text-xs mt-2">
            <Link href={`/${locale}/how-it-works`} className="hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-white transition-colors">
              {HOW_IT_WORKS_LABEL[locale] ?? HOW_IT_WORKS_LABEL['pt-BR']}
            </Link>
            {' · '}
            {t('header.updated')}: {fetchedAt ? new Date(fetchedAt).toLocaleString(dateLocale, { timeZone: 'America/Sao_Paulo' }) : new Date().toLocaleString(dateLocale)}
          </p>
        </div>
      </header>
    </>
  );
}
