import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { isValidLocale, defaultLocale } from '../lib/i18n/config'
import { DocumentoRaiz } from './components/layout/DocumentoRaiz'
import { PaginaNaoEncontrada, metadataNaoEncontrada } from './components/layout/PaginaNaoEncontrada'

/**
 * 404 de quem não casa com rota NENHUMA (ex.: /en/xyz, /welcome/xyz).
 * Com dois layouts raiz não há mais app/layout.tsx para embrulhar um not-found de
 * topo, então este arquivo monta o documento inteiro (exige
 * `experimental.globalNotFound` no next.config.mjs, Next 15.4+).
 * O idioma vem do cabeçalho que o middleware injeta ('en' em /en/xyz). Ler o
 * cabeçalho aqui só afeta a própria 404. `notFound()` chamado por página de
 * /[idioma] não chega aqui: vai para app/[locale]/not-found.tsx.
 */
export const metadata: Metadata = metadataNaoEncontrada

export default async function GlobalNotFound() {
  // O middleware propaga o locale da rota via header x-pathname-locale.
  const h = await headers()
  const seg = h.get('x-pathname-locale')
  const locale = seg && isValidLocale(seg) ? seg : defaultLocale

  return (
    <DocumentoRaiz lang={locale}>
      <PaginaNaoEncontrada locale={locale} />
    </DocumentoRaiz>
  )
}
