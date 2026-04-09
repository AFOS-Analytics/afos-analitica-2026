'use client';

import { createContext, useContext, useCallback, type ReactNode } from 'react';
import type { Locale } from '../../lib/i18n/config';
import { defaultLocale } from '../../lib/i18n/config';

type Messages = Record<string, Record<string, string>>;

interface I18nContextType {
  locale: Locale;
  t: (key: string, fallback?: string) => string;
  messages: Messages;
}

const I18nContext = createContext<I18nContextType | null>(null);

interface ProviderProps {
  children: ReactNode;
  initialLocale: Locale;
  initialMessages: Messages;
}

export function I18nProvider({ children, initialLocale, initialMessages }: ProviderProps) {
  const t = useCallback((key: string, fallback?: string): string => {
    const parts = key.split('.');
    if (parts.length !== 2) return fallback || key;
    const [section, field] = parts;
    return initialMessages[section]?.[field] || fallback || key;
  }, [initialMessages]);

  return (
    <I18nContext.Provider value={{ locale: initialLocale, t, messages: initialMessages }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    return {
      locale: defaultLocale as Locale,
      t: (key: string, fallback?: string) => fallback || key,
      messages: {},
    };
  }
  return ctx;
}

export function useLocale(): Locale {
  const ctx = useContext(I18nContext);
  return ctx?.locale || defaultLocale;
}
