import type { Metadata, Viewport } from "next";
import { headers } from 'next/headers';
import { DocumentoRaiz, metadataRaiz, viewportRaiz } from '../components/layout/DocumentoRaiz';

/**
 * Layout raiz das rotas SEM idioma no caminho: `/` e `/welcome`.
 *
 * As duas já eram dinâmicas (leem cookie), então ler o cabeçalho aqui não custa
 * cache nenhum. O middleware injeta `x-pathname-locale` ('en' em /welcome, cujo
 * texto principal é inglês); sem ele, o padrão segue pt-BR, como antes.
 *
 * As páginas com idioma têm o próprio layout raiz, em app/[locale]/layout.tsx,
 * que tira o idioma de `params` e por isso deixa aquelas páginas cachearem.
 * Ver app/components/layout/DocumentoRaiz.tsx.
 */
export const viewport: Viewport = viewportRaiz;
export const metadata: Metadata = metadataRaiz;

export default async function RaizLayout(
  {
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>
) {
  const headersList = await headers();
  const localeFromMiddleware = headersList.get('x-pathname-locale') || 'pt-BR';
  return <DocumentoRaiz lang={localeFromMiddleware}>{children}</DocumentoRaiz>;
}
