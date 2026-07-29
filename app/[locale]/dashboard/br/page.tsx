import type { Metadata } from 'next';
import { DashboardClient } from './DashboardClient';
import { loadPollsData, loadAnalysisCards, loadAnalysisCriteriosa } from '../../../../lib/dashboard/static-data';
import brazilContext from '../../../../lib/dashboard/brazil-context.json';
import type { CountryContext } from '../../../../lib/country-data';
import { SUPPORTED_LOCALES } from '../../../../lib/afos-daily/loader'
import { buildMetadata } from '../../../../lib/seo/metadata';
import type { Locale } from '../../../../lib/i18n/config';
import { DASHBOARD_SEO } from '../layout';

// O canônico e o hreflang vivem AQUI, não no layout compartilhado com /us: o
// caminho tem de ser 'dashboard/br', senão a página se declara canônica em
// /[locale]/dashboard, que redireciona desde 29/Jul. Os textos vêm do layout
// para não existirem em dois lugares.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as Locale;
  return buildMetadata({ ...DASHBOARD_SEO[loc], path: 'dashboard/br' }, loc);
}

// Sem isto o Next nao sabe quais locales pre-renderizar e serve a pagina sob
// demanda a cada requisicao, mesmo ela sendo conteudo estatico. Instalado
// 25/Jul/2026, ao medir que 11 paginas caiam nesse caso.
export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map(locale => ({ locale }))
}


// Server component: lê os 3 JSONs estáticos (pesquisas + cards) no servidor e os
// passa como props iniciais → renderizam no 1º paint, sem o spinner global que
// bloqueava a tela até 5 fetches client (LCP = spinner). Polymarket (odds) e News
// seguem buscados no client (live), de forma não-bloqueante.
//
// ISR: esses JSONs só mudam no /atualizar (commit + deploy ~diário); 7200s (2h)
// é folgado e bate com o revalidate dos /api/* correspondentes.
export const revalidate = 7200;

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  // A análise editorial tem variante por idioma (analysis-data.en.json etc.),
  // gerada no /atualizar. Se a tradução do dia não existir, o loader devolve
  // pt-BR em vez de quebrar: é melhor servir português do que número errado.
  const { locale } = await params;
  return (
    <DashboardClient
      brazilContext={brazilContext as CountryContext}
      initialPolls={loadPollsData(locale)}
      initialAc={loadAnalysisCards(locale)}
      initialCrit={loadAnalysisCriteriosa(locale)}
    />
  );
}
