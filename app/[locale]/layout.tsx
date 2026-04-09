import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '../../lib/i18n/config';
import { getMessages } from '../../lib/i18n/get-messages';
import { buildMetadata, PAGE_SEO } from '../../lib/seo/metadata';
import { websiteSchema, faqSchema, breadcrumbSchema, combineSchemas } from '../../lib/seo/schema';
import { I18nProvider } from '../i18n/context';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return buildMetadata(PAGE_SEO.home[locale], locale);
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const messages = await getMessages(locale as Locale);
  const loc = locale as Locale;

  return (
    <I18nProvider initialLocale={loc} initialMessages={messages}>
      {/* Schema.org per locale: WebSite + FAQ + Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: combineSchemas(
            websiteSchema(loc),
            faqSchema(loc),
            breadcrumbSchema(loc, [{ name: 'AFOS Analytics', path: '' }])
          ),
        }}
      />
      {children}
    </I18nProvider>
  );
}
