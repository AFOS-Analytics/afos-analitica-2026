import type { Metadata } from 'next';
import { UsDashboardClient } from './UsDashboardClient';
import { SUPPORTED_LOCALES } from '../../../../lib/afos-daily/loader';
import { buildMetadata } from '../../../../lib/seo/metadata';
import type { Locale } from '../../../../lib/i18n/config';

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map(locale => ({ locale }));
}

// NÃO PUBLICADA enquanto não houver conteúdo. Fora de buscador por enquanto, e
// também fora do sitemap, do llms.txt e do IndexNow. Tirar as três coisas juntas
// no dia em que o painel subir, senão a página existe e ninguém a encontra.
//
// O canônico é declarado aqui, com 'dashboard/us', e NÃO herdado do layout: o
// layout embrulha /br e /us, e um caminho fixo faria esta página apontar para o
// canônico do painel brasileiro.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as Locale;
  const SEO: Record<Locale, { title: string; description: string }> = {
    'pt-BR': {
      title: 'Painel Estados Unidos, AFOS Analytics | Midterms 2026',
      description: 'Painel das eleições de meio de mandato dos Estados Unidos de 3 de novembro de 2026: mercado de previsão e pesquisas lado a lado, sem subtrair grandezas diferentes.',
    },
    en: {
      title: 'United States panel, AFOS Analytics | 2026 Midterms',
      description: 'Panel for the United States midterm elections of November 3, 2026: prediction market and polling side by side, without subtracting different quantities.',
    },
    es: {
      title: 'Panel Estados Unidos, AFOS Analytics | Midterms 2026',
      description: 'Panel de las elecciones de medio término de Estados Unidos del 3 de noviembre de 2026: mercado de predicción y encuestas lado a lado, sin restar magnitudes distintas.',
    },
  };
  return {
    ...buildMetadata({ ...SEO[loc], path: 'dashboard/us' }, loc),
    robots: { index: false, follow: false },
  };
}

export default function UsDashboardPage() {
  return <UsDashboardClient />;
}
