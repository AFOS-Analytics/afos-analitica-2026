'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { I18N_CONFIG, type Locale, isValidLocale } from './config';

type Messages = Record<string, Record<string, string>>;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallback?: string) => string;
  messages: Messages;
}

const I18nContext = createContext<I18nContextType | null>(null);

const messagesCache = new Map<Locale, Messages>();

// Mensagens mínimas inline para evitar tela branca
const FALLBACK_MESSAGES: Messages = {
  common: { loading: 'Carregando...', error: 'Erro', retry: 'Recarregar' },
  header: { title: 'AFOS Analytics', about: 'Sobre', goals: 'Metas', global: 'Global', updated: 'Atualizado', subtitle: '', skipToMain: 'Pular para conteúdo principal' },
  footer: { backToTop: 'Voltar ao topo', description: '', disclaimer: '', polymarket: '', notAffiliated: '', polymarketLink: '' },
  language: { label: 'Idioma', 'pt-BR': 'Português', en: 'English', es: 'Español' },
};

async function loadMessages(locale: Locale): Promise<Messages> {
  if (messagesCache.has(locale)) return messagesCache.get(locale)!;
  try {
    const mod = await import(`../../messages/${locale}.json`);
    const messages = mod.default as Messages;
    if (typeof messages !== 'object' || messages === null) throw new Error('Invalid JSON');
    messagesCache.set(locale, messages);
    return messages;
  } catch (err) {
    console.error(`[i18n] Falha ao carregar ${locale}:`, err);
    if (locale !== 'pt-BR') return loadMessages('pt-BR');
    return FALLBACK_MESSAGES;
  }
}

function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return I18N_CONFIG.defaultLocale;
  try {
    const cookie = document.cookie.split('; ').find(c => c.startsWith(`${I18N_CONFIG.cookieName}=`));
    if (cookie) {
      const val = cookie.split('=')[1];
      if (isValidLocale(val)) return val;
    }
    const langs = navigator.languages || [navigator.language];
    for (const lang of langs) {
      if (lang.startsWith('es')) return 'es';
      if (lang.startsWith('en')) return 'en';
      if (lang.startsWith('pt')) return 'pt-BR';
    }
  } catch { /* modo sandboxed */ }
  return I18N_CONFIG.defaultLocale;
}

function safeSetCookie(locale: Locale): void {
  try {
    document.cookie = `${I18N_CONFIG.cookieName}=${locale};path=/;max-age=${365 * 24 * 60 * 60};SameSite=Lax`;
  } catch { /* modo privado */ }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(I18N_CONFIG.defaultLocale);
  const [messages, setMessages] = useState<Messages>(FALLBACK_MESSAGES);
  const [ready, setReady] = useState(false);
  const loadIdRef = useRef(0); // Previne race condition

  useEffect(() => {
    const stored = getStoredLocale();
    setLocaleState(stored);
    const id = ++loadIdRef.current;
    loadMessages(stored).then(msgs => {
      if (loadIdRef.current === id) { // Só aplica se for o request mais recente
        setMessages(msgs);
        setReady(true);
      }
    });
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    if (!isValidLocale(newLocale)) return;
    setLocaleState(newLocale);
    safeSetCookie(newLocale);
    const id = ++loadIdRef.current; // Cancela loads anteriores
    loadMessages(newLocale).then(msgs => {
      if (loadIdRef.current === id) setMessages(msgs);
    });
  }, []);

  const t = useCallback((key: string, fallback?: string): string => {
    const parts = key.split('.');
    if (parts.length !== 2) return fallback || key;
    const [section, field] = parts;
    const value = messages[section]?.[field];
    if (value) return value;
    // Fallback inline
    const fb = FALLBACK_MESSAGES[section]?.[field];
    if (fb) return fb;
    return fallback || key;
  }, [messages]);

  // Renderiza children imediatamente com fallback (sem tela branca)
  return (
    <I18nContext.Provider value={{ locale: ready ? locale : I18N_CONFIG.defaultLocale, setLocale, t, messages }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider');
  return ctx;
}

export function useLocale(): Locale {
  const ctx = useContext(I18nContext);
  return ctx?.locale || I18N_CONFIG.defaultLocale;
}
