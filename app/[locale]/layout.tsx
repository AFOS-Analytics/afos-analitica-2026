import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '../../lib/i18n/config';
import { getMessages } from '../../lib/i18n/get-messages';
import { buildMetadata, PAGE_SEO } from '../../lib/seo/metadata';
import { websiteSchema } from '../../lib/seo/schema';
import { JsonLd } from '../components/JsonLd';
import { I18nProvider } from '../i18n/context';
import { HtmlLangSync } from '../components/layout/HtmlLangSync';
import { ChatWidget } from '../components/ChatWidget';
import { DocumentoRaiz, metadataRaiz, viewportRaiz } from '../components/layout/DocumentoRaiz';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

/*
 * 🔴 LAYOUT RAIZ das páginas com idioma (12/Nov/2026). Monta `<html lang>` com o
 * idioma de `params`, que é estático. Antes o `<html>` vinha de app/layout.tsx,
 * que lia o idioma com `await headers()` e com isso deixava o site INTEIRO
 * dinâmico: `revalidate` e `generateStaticParams` não valiam e toda página
 * respondia `no-store`. NÃO usar headers(), cookies() nem searchParams aqui.
 * As rotas sem idioma (`/`, `/welcome`) têm layout raiz próprio em app/(raiz)/.
 */
export const viewport: Viewport = viewportRaiz;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  // A base que antes vinha do layout pai (app/layout.tsx). O espalhamento troca
  // chave a chave, como o Next faz ao juntar o metadata de pai e filho.
  if (!isValidLocale(locale)) return metadataRaiz;
  return { ...metadataRaiz, ...buildMetadata(PAGE_SEO.home[locale], locale) };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const messages = await getMessages(locale as Locale);
  const loc = locale as Locale;

  return (
    <DocumentoRaiz lang={loc}>
      <I18nProvider initialLocale={loc} initialMessages={messages}>
        <HtmlLangSync />
        {/* Schema.org per locale: WebSite + Breadcrumb. FAQPage NÃO entra aqui (era injetado
            site-wide → risco de spam de structured-data; Google exige FAQ visível na página).
            O FAQ fica só em /how-it-works, que renderiza as perguntas. (SEO EVAL 06/Jun) */}
        <JsonLd data={[websiteSchema(loc)]} />
        {children}
        <ChatWidget locale={loc} />
      </I18nProvider>
    </DocumentoRaiz>
  );
}
