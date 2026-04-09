'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../i18n/context';
import { I18N_CONFIG, type Locale } from '../i18n/config';

const FLAGS: Record<Locale, string> = {
  'pt-BR': 'PT',
  'en': 'EN',
  'es': 'ES',
};

export function LanguageSelector() {
  const { locale, setLocale, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 border border-white/30 hover:bg-white/10 text-white text-xs sm:text-sm px-3 py-2 rounded-lg transition-all"
        aria-label={t('language.label')}
        aria-expanded={open}
      >
        <span className="font-semibold">{FLAGS[locale]}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl overflow-hidden z-50 min-w-[140px] border border-gray-200">
          {I18N_CONFIG.locales.map(loc => (
            <button
              key={loc}
              onClick={() => { setLocale(loc); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                locale === loc
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="font-mono text-xs w-6">{FLAGS[loc]}</span>
              <span>{t(`language.${loc}`)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
