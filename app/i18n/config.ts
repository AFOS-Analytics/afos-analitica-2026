/**
 * Configuração de internacionalização
 *
 * Locales suportados e default.
 * Cookie-based: locale salvo em cookie, lido pelo middleware.
 */

export const I18N_CONFIG = {
  locales: ['pt-BR', 'en', 'es'] as const,
  defaultLocale: 'pt-BR' as const,
  cookieName: 'afos-locale',
} as const;

export type Locale = (typeof I18N_CONFIG.locales)[number];

export function isValidLocale(locale: string): locale is Locale {
  return (I18N_CONFIG.locales as readonly string[]).includes(locale);
}
