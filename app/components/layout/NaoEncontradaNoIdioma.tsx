'use client'

import { useLocale } from '../../i18n/context'
import { PaginaNaoEncontrada } from './PaginaNaoEncontrada'

/**
 * A 404 dentro de /[idioma]. O idioma sai do I18nProvider de app/[locale]/layout.tsx,
 * que embrulha o not-found do segmento, e não de cabeçalho: ler `headers()` aqui
 * tornaria dinâmica toda página que chama `notFound()`.
 */
export function NaoEncontradaNoIdioma() {
  const locale = useLocale()
  return <PaginaNaoEncontrada locale={locale} />
}
