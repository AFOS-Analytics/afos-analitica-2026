'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { locales, localeLabels, COOKIE_NAME, type Locale } from '../../../lib/i18n/config';
import { useLocale } from '../../i18n/context';

const localeFlags: Record<Locale, string> = {
  'pt-BR': '🇧🇷',
  'en': '🇺🇸',
  'es': '🇪🇸',
};

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
    try {
      document.cookie = `${COOKIE_NAME}=${newLocale};path=/;max-age=${365*24*60*60};SameSite=Lax;Secure`;
    } catch {}

    const segments = pathname.split('/').filter(Boolean);
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
        className="flex items-center justify-center border border-white/30 hover:bg-white/10 text-white p-2 rounded-lg transition-all"
        aria-label="Idioma"
        aria-expanded={open}
      >
        <span className="text-lg leading-none" aria-hidden="true">🌐</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl overflow-hidden z-50 min-w-[160px] border border-gray-200">
          {locales.map(loc => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2.5 ${
                locale === loc
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-base leading-none">{localeFlags[loc]}</span>
              <span className="font-mono text-xs">{localeLabels[loc].short}</span>
              <span className="text-gray-500 text-xs">—</span>
              <span className="text-xs">{localeLabels[loc].full}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
