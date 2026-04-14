import type { Metadata } from 'next';
import { buildMetadata } from '../../../lib/seo/metadata';
import type { Locale } from '../../../lib/i18n/config';

const SEO: Record<Locale, { title: string; description: string }> = {
  'pt-BR': {
    title: 'Dashboard — AFOS Analytics | Inteligência de Risco Político Eleitoral',
    description: 'Dashboard interativo: cruzamento de mercados de previsão (Polymarket) com pesquisas eleitorais de 17+ institutos, notícias ao vivo e análises estratégicas. Eleições Brasil 2026 e cobertura de 14 países.',
  },
  en: {
    title: 'Dashboard — AFOS Analytics | Political Election Risk Intelligence',
    description: 'Interactive dashboard: crossing prediction markets (Polymarket) with electoral polls from 17+ institutes, live news and strategic analysis. Brazil 2026 elections and 14-country coverage.',
  },
  es: {
    title: 'Dashboard — AFOS Analytics | Inteligencia de Riesgo Político Electoral',
    description: 'Dashboard interactivo: cruce de mercados de predicción (Polymarket) con encuestas electorales de 17+ institutos, noticias en vivo y análisis estratégicos. Elecciones Brasil 2026 y cobertura de 14 países.',
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
