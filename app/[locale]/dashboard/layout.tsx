import type { Metadata } from 'next';
import { buildMetadata } from '../../../lib/seo/metadata';
import type { Locale } from '../../../lib/i18n/config';

const SEO: Record<Locale, { title: string; description: string }> = {
  'pt-BR': {
    title: 'Dashboard — AFOS Analytics | Inteligencia Eleitoral em Tempo Real',
    description: 'Dashboard interativo: Polymarket, pesquisas eleitorais de 17+ institutos, noticias ao vivo e analises estrategicas. Eleicoes Brasil 2026 e mundo.',
  },
  en: {
    title: 'Dashboard — AFOS Analytics | Real-Time Election Intelligence',
    description: 'Interactive dashboard: Polymarket, polls from 17+ institutes, live news and strategic analysis. Brazil 2026 elections and global coverage.',
  },
  es: {
    title: 'Dashboard — AFOS Analytics | Inteligencia Electoral en Tiempo Real',
    description: 'Dashboard interactivo: Polymarket, encuestas de 17+ institutos, noticias en vivo y analisis estrategicos. Elecciones Brasil 2026 y mundo.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as Locale;
  const seo = SEO[loc];
  return buildMetadata({ ...seo, path: 'dashboard' }, loc);
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
