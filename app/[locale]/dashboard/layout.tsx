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
  'pt-BR': {
    title: 'Dashboard, AFOS Analytics | Inteligência de Risco Político Eleitoral Global',
    description: 'Dashboard interativo: cruzamento de mercados de previsão (Polymarket) com pesquisas eleitorais de 17+ institutos, notícias ao vivo e análises estratégicas. Eleições Brasil 2026 e cobertura de 15 países.',
  },
  en: {
    title: 'Dashboard, AFOS Analytics | Political Election Risk Intelligence',
    description: 'Interactive dashboard: crossing prediction markets (Polymarket) with electoral polls from 17+ institutes, live news and strategic analysis. Brazil 2026 elections and 15-country coverage.',
  },
  es: {
    title: 'Dashboard, AFOS Analytics | Inteligencia Global de Riesgo Político Electoral',
    description: 'Dashboard interactivo: cruce de mercados de predicción (Polymarket) con encuestas electorales de 17+ institutos, noticias en vivo y análisis estratégicos. Elecciones Brasil 2026 y cobertura de 15 países.',
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
