import type { Metadata } from 'next';
import { UsDashboardClient } from './UsDashboardClient';
import { loadUsPollsDataFresh } from '../../../../lib/dashboard/us-static-data';
import { loadUsPressData } from '../../../../lib/dashboard/us-press-data';
import { SUPPORTED_LOCALES } from '../../../../lib/afos-daily/loader';
import { buildMetadata } from '../../../../lib/seo/metadata';
import type { Locale } from '../../../../lib/i18n/config';
import usaCase from '../../../../lib/country-data/usa.json';
import type { CountryContext } from '../../../../lib/country-data';

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map(locale => ({ locale }));
}

// PUBLICADA em 01/Ago/2026. As 5 chaves foram viradas no mesmo commit — robots,
// sitemap, llms.txt, IndexNow e o `ready` do seletor de país — porque virar
// uma só deixa a página existindo sem ninguém a encontrar, ou anunciada em
// lugar nenhum. Se algum dia precisar despublicar, são as mesmas 5.
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
  // 🎨 Cartão próprio, e a cor dele vem do PAÍS (verde-azulado = EUA), nunca
  // do produto. Antes daqui o painel e o AFOS Weekly apontavam para o MESMO
  // /brand/og-en-linkedin-1200x627.png, e dois posts no mesmo dia apareciam
  // com a imagem idêntica no feed.
  // ⚠️ O cartão carrega PREÇO e leva carimbo de data dentro da arte. Quando o
  // preço andar, regerar com scripts/build-og-cards-us.mjs e trocar a data.
  return buildMetadata({ ...SEO[loc], path: 'dashboard/us', image: '/brand/og-us-senate-panel-1200x627.png' }, loc);
}

// O generic ballot é lido no SERVIDOR e passa como prop, igual ao painel do
// Brasil: assim a tabela aparece no 1º paint em vez de piscar um spinner.
// ISR de 2h acompanha a cadência do script, que roda uma vez por dia.
export const revalidate = 7200;

// O contexto estrutural do Banco Mundial vem do MESMO arquivo do caso validado
// de 2024 (`lib/country-data/usa.json`), e isso é de propósito: WGI e WDI são
// indicadores DO PAÍS, não da eleição, então manter duas cópias só criaria
// chance de divergirem. Mesma safra do contexto do Brasil: WGI, população, PIB
// e inflação em 2024.
export default async function UsDashboardPage() {
  return (
    <UsDashboardClient
      pollsData={await loadUsPollsDataFresh()}
      pressData={await loadUsPressData()}
      context={(usaCase as { context?: unknown }).context as CountryContext | undefined}
    />
  );
}
