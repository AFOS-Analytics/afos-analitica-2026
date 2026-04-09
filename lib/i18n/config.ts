/**
 * Configuração central de internacionalização.
 * Única fonte de verdade para locales, default e cookie.
 */

export const locales = ['pt-BR', 'en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'pt-BR';
export const COOKIE_NAME = 'NEXT_LOCALE';

export function isValidLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Mapeamento locale → BCP 47 para html lang e Intl APIs */
export const localeMap: Record<Locale, string> = {
  'pt-BR': 'pt-BR',
  'en': 'en-US',
  'es': 'es-ES',
};

/** Labels para o seletor de idiomas */
export const localeLabels: Record<Locale, { short: string; full: string }> = {
  'pt-BR': { short: 'PT', full: 'Português' },
  'en': { short: 'EN', full: 'English' },
  'es': { short: 'ES', full: 'Español' },
};
