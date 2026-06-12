import { DashboardClient } from './DashboardClient';
import { loadPollsData, loadAnalysisCards, loadAnalysisCriteriosa } from '../../../lib/dashboard/static-data';

// Server component: lê os 3 JSONs estáticos (pesquisas + cards) no servidor e os
// passa como props iniciais → renderizam no 1º paint, sem o spinner global que
// bloqueava a tela até 5 fetches client (LCP = spinner). Polymarket (odds) e News
// seguem buscados no client (live), de forma não-bloqueante.
//
// ISR: esses JSONs só mudam no /atualizar (commit + deploy ~diário); 7200s (2h)
// é folgado e bate com o revalidate dos /api/* correspondentes.
export const revalidate = 7200;

export default function DashboardPage() {
  return (
    <DashboardClient
      initialPolls={loadPollsData()}
      initialAc={loadAnalysisCards()}
      initialCrit={loadAnalysisCriteriosa()}
    />
  );
}
