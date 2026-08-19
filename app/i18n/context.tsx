'use client';

import { createContext, useContext, useCallback, type ReactNode } from 'react';
import type { Locale } from '../../lib/i18n/config';
import { defaultLocale } from '../../lib/i18n/config';

type MessageValue = string | string[];
type Messages = Record<string, Record<string, MessageValue>>;

interface I18nContextType {
  locale: Locale;
  t: (key: string, fallback?: string) => string;
  tList: (key: string) => string[];
  messages: Messages;
}

const I18nContext = createContext<I18nContextType | null>(null);

interface ProviderProps {
  children: ReactNode;
  initialLocale: Locale;
  initialMessages: Messages;
}

export function I18nProvider({ children, initialLocale, initialMessages }: ProviderProps) {
  /** Retorna string. Para arrays, use tList(). */
  const t = useCallback((key: string, fallback?: string): string => {
    const parts = key.split('.');
    if (parts.length !== 2) return fallback || key;
    const [section, field] = parts;
    const val = initialMessages[section]?.[field];
    if (typeof val === 'string') return val;
    if (Array.isArray(val)) return val.join(', ');
    return fallback || key;
  }, [initialMessages]);

  /**
   * Lista de bullets, SEM serializar.
   *
   * Instalado 19/Ago/2026. Antes disto os componentes faziam
   * `t('about.voterList').split(',')`, e como `t` devolve `val.join(', ')` a
   * conta so fechava enquanto NENHUM item tivesse virgula dentro. Tinham: o
   * `about.voterList` em ingles rendia 6 bullets para uma lista de 4 itens, dois
   * deles fragmentos ("weaknesses", "and context"), e a mesma modal mostrava
   * contagens DIFERENTES em cada idioma, porque a pontuacao muda com a traducao.
   * Nenhuma string de messages/ foi reescrita: so parou de ser cortada.
   */
  const tList = useCallback((key: string): string[] => {
    const parts = key.split('.');
    if (parts.length !== 2) return [];
    const val = initialMessages[parts[0]]?.[parts[1]];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') return val ? [val] : [];
    return [];
  }, [initialMessages]);

  return (
    <I18nContext.Provider value={{ locale: initialLocale, t, tList, messages: initialMessages }}>
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
      tList: () => [],
      messages: {},
    };
  }
  return ctx;
}

export function useLocale(): Locale {
  const ctx = useContext(I18nContext);
  return ctx?.locale || defaultLocale;
}
