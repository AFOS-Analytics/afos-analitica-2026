import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale } from '../../../lib/afos-daily/loader'
import { StaticPageHeader } from '../../components/StaticPageHeader'
import { Footer } from '../../components/Footer'

interface Props { params: { locale: string } }

const CONTENT = {
  'pt-BR': {
    title: 'Fontes de Dados | AFOS Analytics',
    description: 'Fontes públicas usadas pela plataforma AFOS Analytics: Polymarket, TSE, institutos de pesquisa, veículos jornalísticos.',
    h1: 'Fontes de Dados',
    updated: 'Última atualização: 1 de maio de 2026',
    intro: 'AFOS Analytics opera exclusivamente com fontes públicas auditáveis. Cada alegação na plataforma cita a fonte primária. Esta página lista todas as fontes regulares.',
    sections: [
      ['Mercados de previsão', 'Polymarket (gamma-api.polymarket.com), preços de contratos em USD com dinheiro real. Atualizado a cada 30 minutos via API pública. Eventos cobertos: presidencial 2026, 2º lugar 1º turno, 3º lugar 1º turno, impeachment STF, Senado 2026, inflação 2026.'],
      ['Pesquisas eleitorais', 'Tribunal Superior Eleitoral (TSE), base oficial de pesquisas registradas. Atualizada via cron 3x/dia (06:00, 12:00, 18:00 BRT). Institutos cobertos: AtlasIntel, Quaest/Genial, Datafolha, Real Time Big Data, Paraná Pesquisas, Vox Populi, Ipec, Nexus, Ideia, Datatrends, 100 Cidades, SETA, M B Barros, F. Façanha, A.F. Barbosa, Vox Brasil, e outros (~17 institutos).'],
      ['Cobertura jornalística', 'Google News RSS (news.google.com/rss), agregador. Veículos primários consultados regularmente: Folha de S.Paulo, O Globo, Estadão, Veja, BBC Brasil, CNN Brasil, Poder360, JOTA, Gazeta do Povo, UOL, G1, Bloomberg Línea, Estado de Minas, O POVO, e outros.'],
      ['Calendário eleitoral global', 'IFES (International Foundation for Electoral Systems) e Wikipedia (consolidado). Cobertura de 14 países com eleições nacionais previstas em 2026.'],
      ['Glossário e terminologia', 'Wikipedia, sites oficiais dos órgãos (TSE, STF, Senado, Câmara), e literatura metodológica brasileira (ABEP, FGV, Poder360).'],
    ],
    footer: 'Não somos afiliados a nenhuma das fontes listadas. Dados utilizados conforme termos públicos de cada fonte. Para correções ou solicitações de remoção: contact@afos-analytics.com.',
  },
  en: {
    title: 'Data Sources | AFOS Analytics',
    description: 'Public sources used by the AFOS Analytics platform: Polymarket, TSE, polling institutes, news outlets.',
    h1: 'Data Sources',
    updated: 'Last updated: May 1, 2026',
    intro: 'AFOS Analytics operates exclusively on public, auditable sources. Every claim on the platform cites its primary source. This page lists all regular sources.',
    sections: [
      ['Prediction markets', 'Polymarket (gamma-api.polymarket.com), real-money contract prices in USD. Updated every 30 minutes via public API. Markets covered: 2026 presidential, 1st round 2nd place, 1st round 3rd place, STF impeachment, 2026 Senate, 2026 inflation.'],
      ['Electoral polls', 'Brazilian Superior Electoral Court (TSE), official base of registered polls. Updated via cron 3x/day (06:00, 12:00, 18:00 BRT). Institutes covered: AtlasIntel, Quaest/Genial, Datafolha, Real Time Big Data, Paraná Pesquisas, Vox Populi, Ipec, Nexus, Ideia, Datatrends, 100 Cidades, SETA, M B Barros, F. Façanha, A.F. Barbosa, Vox Brasil, and others (~17 institutes).'],
      ['Journalistic coverage', 'Google News RSS (news.google.com/rss), aggregator. Primary outlets consulted regularly: Folha de S.Paulo, O Globo, Estadão, Veja, BBC Brasil, CNN Brasil, Poder360, JOTA, Gazeta do Povo, UOL, G1, Bloomberg Línea, Estado de Minas, O POVO, and others.'],
      ['Global electoral calendar', 'IFES (International Foundation for Electoral Systems) and Wikipedia (consolidated). Coverage of 14 countries with national elections planned for 2026.'],
      ['Glossary and terminology', 'Wikipedia, official sites of agencies (TSE, STF, Senate, Chamber), and Brazilian methodological literature (ABEP, FGV, Poder360).'],
    ],
    footer: 'We are not affiliated with any of the listed sources. Data used in accordance with each source\'s public terms. For corrections or removal requests: contact@afos-analytics.com.',
  },
  es: {
    title: 'Fuentes de Datos | AFOS Analytics',
    description: 'Fuentes públicas usadas por la plataforma AFOS Analytics: Polymarket, TSE, institutos de encuestas, medios periodísticos.',
    h1: 'Fuentes de Datos',
    updated: 'Última actualización: 1 de mayo de 2026',
    intro: 'AFOS Analytics opera exclusivamente con fuentes públicas auditables. Cada afirmación en la plataforma cita la fuente primaria. Esta página lista todas las fuentes regulares.',
    sections: [
      ['Mercados de predicción', 'Polymarket (gamma-api.polymarket.com), precios de contratos en USD con dinero real. Actualizado cada 30 minutos vía API pública. Mercados cubiertos: presidencial 2026, 2º lugar 1ª vuelta, 3º lugar 1ª vuelta, impeachment STF, Senado 2026, inflación 2026.'],
      ['Encuestas electorales', 'Tribunal Superior Electoral (TSE), base oficial de encuestas registradas. Actualizada vía cron 3x/día (06:00, 12:00, 18:00 BRT). Institutos cubiertos: AtlasIntel, Quaest/Genial, Datafolha, Real Time Big Data, Paraná Pesquisas, Vox Populi, Ipec, Nexus, Ideia, Datatrends, 100 Cidades, SETA, M B Barros, F. Façanha, A.F. Barbosa, Vox Brasil, y otros (~17 institutos).'],
      ['Cobertura periodística', 'Google News RSS (news.google.com/rss), agregador. Medios primarios consultados regularmente: Folha de S.Paulo, O Globo, Estadão, Veja, BBC Brasil, CNN Brasil, Poder360, JOTA, Gazeta do Povo, UOL, G1, Bloomberg Línea, Estado de Minas, O POVO, y otros.'],
      ['Calendario electoral global', 'IFES (International Foundation for Electoral Systems) y Wikipedia (consolidado). Cobertura de 14 países con elecciones nacionales previstas en 2026.'],
      ['Glosario y terminología', 'Wikipedia, sitios oficiales de los órganos (TSE, STF, Senado, Cámara) y literatura metodológica brasileña (ABEP, FGV, Poder360).'],
    ],
    footer: 'No estamos afiliados a ninguna de las fuentes listadas. Datos utilizados conforme a los términos públicos de cada fuente. Para correcciones o solicitudes de eliminación: contact@afos-analytics.com.',
  },
} as const

export function generateMetadata({ params }: Props): Metadata {
  const c = CONTENT[params.locale as keyof typeof CONTENT] ?? CONTENT['pt-BR']
  return {
    title: c.title,
    description: c.description,
    alternates: {
      canonical: `https://afos-analytics.com/${params.locale}/data-sources`,
      languages: {
        'pt-BR': 'https://afos-analytics.com/pt-BR/data-sources',
        en: 'https://afos-analytics.com/en/data-sources',
        es: 'https://afos-analytics.com/es/data-sources',
      },
    },
  }
}

export default function DataSourcesPage({ params }: Props) {
  if (!isValidLocale(params.locale)) notFound()
  const c = CONTENT[params.locale as keyof typeof CONTENT] ?? CONTENT['pt-BR']
  return (
    <div className="min-h-screen bg-light-bg flex flex-col">
      <StaticPageHeader />
      <main id="main-content" className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-dark mb-2">{c.h1}</h1>
        <p className="text-xs text-gray-500 mb-6">{c.updated}</p>
        <p className="text-base text-gray-700 leading-relaxed mb-10">{c.intro}</p>
        <div className="space-y-8">
          {c.sections.map(([heading, body]) => (
            <section key={heading} className="bg-white border border-light-border rounded-xl p-6 shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold text-primary mb-3">{heading}</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{body}</p>
            </section>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-12 italic">{c.footer}</p>
      </main>
      <Footer />
    </div>
  )
}
