/**
 * Carregamento de mensagens por locale e namespace.
 *
 * Estrutura de arquivos:
 *   messages/{locale}/common.json
 *   messages/{locale}/home.json
 *   messages/{locale}/seo.json
 *
 * Uso:
 *   const messages = await getMessages('en');
 *   // Retorna merge de todos os namespaces
 */

import type { Locale } from './config';
import { defaultLocale } from './config';

export type Messages = Record<string, Record<string, string>>;

const NAMESPACES = ['common', 'home', 'seo'] as const;

const cache = new Map<string, Messages>();

async function loadNamespace(locale: Locale, ns: string): Promise<Record<string, Record<string, string>>> {
  try {
    const mod = await import(`../../messages/${locale}/${ns}.json`);
    return mod.default || {};
  } catch {
    if (locale !== defaultLocale) {
      return loadNamespace(defaultLocale, ns);
    }
    return {};
  }
}

/**
 * Carrega e mergea todos os namespaces para um locale.
 * Resultado cacheado em memória.
 */
export async function getMessages(locale: Locale): Promise<Messages> {
  if (cache.has(locale)) return cache.get(locale)!;

  const parts = await Promise.all(
    NAMESPACES.map(ns => loadNamespace(locale, ns))
  );

  const merged: Messages = {};
  for (const part of parts) {
    for (const [section, values] of Object.entries(part)) {
      merged[section] = { ...merged[section], ...values };
    }
  }

  if (Object.keys(merged).length === 0) {
    console.error(`[i18n] Nenhuma mensagem carregada para locale: ${locale}`);
  }

  cache.set(locale, merged);
  return merged;
}
