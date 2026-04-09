'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { locales, localeLabels, COOKIE_NAME, type Locale } from '../../../lib/i18n/config';
import { useLocale } from '../../i18n/context';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  function switchLocale(newLocale: Locale) {
    // Save cookie
    try {
      document.cookie = `${COOKIE_NAME}=${newLocale};path=/;max-age=${365*24*60*60};SameSite=Lax;Secure`;
    } catch {}

    // Navigate: replace current locale segment with new one
    // pathname = /pt-BR/global → /en/global
    const segments = pathname.split('/').filter(Boolean);
    // First segment should be current locale
    if (segments.length > 0) {
      segments[0] = newLocale;
    } else {
      segments.push(newLocale);
    }
    const newPath = '/' + segments.join('/');

    setOpen(false);
    router.push(newPath);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 border border-white/30 hover:bg-white/10 text-white text-xs sm:text-sm px-3 py-2 rounded-lg transition-all"
        aria-label="Idioma"
        aria-expanded={open}
      >
        <span className="font-semibold">{localeLabels[locale].short}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl overflow-hidden z-50 min-w-[140px] border border-gray-200">
          {locales.map(loc => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                locale === loc
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="font-mono text-xs w-6">{localeLabels[loc].short}</span>
              <span>{localeLabels[loc].full}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
