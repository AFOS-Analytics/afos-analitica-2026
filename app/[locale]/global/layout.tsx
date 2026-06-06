import type { Metadata } from 'next';
import { buildMetadata, PAGE_SEO } from '../../../lib/seo/metadata';
import type { Locale } from '../../../lib/i18n/config';

// /global é client-component (mapa interativo) sem generateMetadata próprio, então herdava
// a metadata da home → canonical apontando pra "/" (Google trataria /global como duplicata da
// home, apesar do sitemap promovê-la a 0.9). Este layout aplica o PAGE_SEO.global JÁ EXISTENTE
// (sem texto novo) com canonical/hreflang corretos pra /global. (SEO EVAL 06/Jun)
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as Locale;
  return buildMetadata(PAGE_SEO.global[loc], loc);
}

export default function GlobalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
