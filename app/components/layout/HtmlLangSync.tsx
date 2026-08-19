'use client'

import { useEffect } from 'react'
import { useLocale } from '../../i18n/context'

/**
 * Mantém `<html lang>` alinhado ao idioma na navegação de CLIENTE.
 *
 * O `lang` do primeiro paint vem do servidor, em app/layout.tsx, lido do
 * cabeçalho que o middleware injeta. Só que o layout raiz não re-renderiza numa
 * transição de cliente: quem trocava de /pt-BR para /en pelo seletor continuava
 * com `lang="pt-BR"` no documento, e leitor de tela e tradutor automático usam
 * exatamente esse atributo para escolher a voz e o idioma de origem.
 *
 * Fica dentro do I18nProvider de app/[locale]/layout.tsx, que muda junto com o
 * segmento. Nada regride para rastreador nem para navegação sem JS: o valor do
 * servidor continua sendo o do HTML entregue.
 */
export function HtmlLangSync() {
  const locale = useLocale()
  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.lang = locale
  }, [locale])
  return null
}
