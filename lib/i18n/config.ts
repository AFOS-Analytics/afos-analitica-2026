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

/**
 * Grava a escolha de idioma do leitor no cookie que a raiz e o middleware
 * respeitam. Só no navegador. Todo seletor de idioma chama esta função: um
 * seletor que só troca o href deixava o cookie antigo de pé, e a raiz desfazia
 * a escolha na visita seguinte.
 */
export function gravarIdioma(locale: Locale): void {
  try {
    document.cookie = `${COOKIE_NAME}=${locale};path=/;max-age=${365 * 24 * 60 * 60};SameSite=Lax;Secure`;
  } catch {}
}

/** Case-insensitive: normaliza para locale válido ou retorna null */
export function normalizeLocale(value: string): Locale | null {
  const lower = value.toLowerCase();
  for (const loc of locales) {
    if (loc.toLowerCase() === lower) return loc;
  }
  return null;
}

/** Labels para o seletor de idiomas */
export const localeLabels: Record<Locale, { short: string; full: string }> = {
  'pt-BR': { short: 'PT', full: 'Português' },
  'en': { short: 'EN', full: 'English' },
  'es': { short: 'ES', full: 'Español' },
};
