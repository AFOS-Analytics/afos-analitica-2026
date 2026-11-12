import type { Locale } from '../../../lib/i18n/config';

/**
 * Textos de SEO do painel, exportados para as páginas de país usarem.
 *
 * ⚠️ O CANÔNICO NÃO PODE SAIR DAQUI. Este layout embrulha /br e /us, e um path
 * fixo 'dashboard' faria as duas declararem canônico para /[locale]/dashboard,
 * que desde 29/Jul REDIRECIONA. Canônico apontando para redirecionamento é
 * sinal ruim justamente na página mais importante do site, e ainda mandaria o
 * painel dos EUA apontar para o canônico do Brasil. Cada página de país declara
 * o próprio, com o país no caminho.
 */
export const DASHBOARD_SEO: Record<Locale, { title: string; description: string }> = {
  // 12/Nov/2026: o texto antigo ("notícias ao vivo", "17+ institutos", "cobertura
  // de 15 países") descrevia o painel do Brasil de antes do congelamento. Só a
  // página /dashboard/br usa este texto; EUA e França declaram o próprio.
  'pt-BR': {
    title: 'Painel Brasil, AFOS Analytics | Eleições 2026, cobertura encerrada',
    description: 'Painel das eleições presidenciais do Brasil de 2026, encerrado em 01/11/2026: mercado de previsão (Polymarket), pesquisas registradas no TSE e imprensa lado a lado, com o resultado final do TSE, o relatório final e os dados no Harvard Dataverse.',
  },
  en: {
    title: 'Brazil panel, AFOS Analytics | 2026 Elections, coverage closed',
    description: "Panel for Brazil's 2026 presidential elections, closed on Nov 1, 2026: prediction market (Polymarket), polls registered with the TSE and the press side by side, with the TSE final result, the final report and the data on Harvard Dataverse.",
  },
  es: {
    title: 'Panel Brasil, AFOS Analytics | Elecciones 2026, cobertura cerrada',
    description: 'Panel de las elecciones presidenciales de Brasil de 2026, cerrado el 01/11/2026: mercado de predicción (Polymarket), encuestas registradas en el TSE y prensa lado a lado, con el resultado final del TSE, el informe final y los datos en Harvard Dataverse.',
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
