import { DashboardClient } from './DashboardClient';
import { loadPollsData, loadAnalysisCards, loadAnalysisCriteriosa } from '../../../lib/dashboard/static-data';
import brazilContext from '../../../lib/dashboard/brazil-context.json';
import type { CountryContext } from '../../../lib/country-data';

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
