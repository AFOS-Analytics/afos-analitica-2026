import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '../../lib/i18n/config';
import { getMessages } from '../../lib/i18n/get-messages';
import { I18nProvider } from '../i18n/context';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const messages = await getMessages(locale);
  const seo = messages.seo || {};

  return {
    title: seo.title || 'AFOS Analytics',
    description: seo.description || '',
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale as Locale);

  return (
    <I18nProvider initialLocale={locale as Locale} initialMessages={messages}>
      {children}
    </I18nProvider>
  );
}
