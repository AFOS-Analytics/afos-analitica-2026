import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale } from '../../../lib/afos-daily/loader'
import { StaticPageHeader } from '../../components/StaticPageHeader'
import { Footer } from '../../components/Footer'
import { buildMetadata } from '../../../lib/seo/metadata'
import type { Locale } from '../../../lib/i18n/config'

interface Props { params: { locale: string } }

const CONTENT = {
  'pt-BR': {
    title: 'Termos de Uso | AFOS Analytics',
    description: 'Termos de uso da plataforma AFOS Analytics.',
    h1: 'Termos de Uso',
    updated: 'Última atualização: 1 de maio de 2026',
    sections: [
      ['Natureza do serviço', 'AFOS Analytics é uma plataforma de inteligência eleitoral que cruza dados públicos (Polymarket, pesquisas TSE, cobertura jornalística). O conteúdo é informativo e não constitui aconselhamento eleitoral, financeiro, jurídico ou de investimento.'],
      ['Licenciamento', 'O código-fonte da plataforma é disponibilizado sob licença Apache 2.0. O conteúdo editorial (sínteses AFOS Daily, análises) é disponibilizado sob CC BY 4.0, pode ser reproduzido com atribuição.'],
      ['Conteúdo de terceiros', 'Dados de Polymarket são propriedade de Polymarket. Pesquisas eleitorais são propriedade dos respectivos institutos. Notícias citadas pertencem aos respectivos veículos. AFOS Analytics não é afiliada a nenhuma dessas fontes.'],
      ['Limitação de responsabilidade', 'AFOS Analytics fornece informações com base em dados auditáveis públicos, sem garantia de precisão, completude ou atualidade. Decisões tomadas com base no conteúdo são de responsabilidade exclusiva do usuário. AFOS Analytics não se responsabiliza por perdas decorrentes de uso da plataforma.'],
      ['Uso permitido', 'Permitido: leitura, citação com atribuição, embed em sites próprios, uso em pesquisa acadêmica. Não permitido: scraping automatizado em larga escala, redistribuição comercial sem permissão, uso para construir produto concorrente.'],
      ['Alterações nos termos', 'Estes termos podem ser atualizados a qualquer momento. Mudanças significativas serão comunicadas aos subscritores por email.'],
    ],
  },
  en: {
    title: 'Terms of Use | AFOS Analytics',
    description: 'Terms of use for the AFOS Analytics platform.',
    h1: 'Terms of Use',
    updated: 'Last updated: May 1, 2026',
    sections: [
      ['Service nature', 'AFOS Analytics is an electoral intelligence platform that cross-references public data (Polymarket, TSE polls, journalistic coverage). Content is informational and does not constitute electoral, financial, legal or investment advice.'],
      ['Licensing', 'Platform source code is licensed under Apache 2.0. Editorial content (AFOS Daily syntheses, analyses) is licensed under CC BY 4.0, may be reproduced with attribution.'],
      ['Third-party content', 'Polymarket data is property of Polymarket. Electoral polls are property of respective institutes. Cited news belongs to respective outlets. AFOS Analytics is not affiliated with any of these sources.'],
      ['Limitation of liability', 'AFOS Analytics provides information based on publicly auditable data, without guarantee of accuracy, completeness or timeliness. Decisions made based on content are sole responsibility of the user. AFOS Analytics is not liable for losses arising from use of the platform.'],
      ['Permitted use', 'Permitted: reading, citation with attribution, embed in own sites, academic research. Not permitted: large-scale automated scraping, commercial redistribution without permission, use to build competing product.'],
      ['Changes to terms', 'These terms may be updated at any time. Significant changes will be communicated to subscribers via email.'],
    ],
  },
  es: {
    title: 'Términos de Uso | AFOS Analytics',
    description: 'Términos de uso de la plataforma AFOS Analytics.',
    h1: 'Términos de Uso',
    updated: 'Última actualización: 1 de mayo de 2026',
    sections: [
      ['Naturaleza del servicio', 'AFOS Analytics es una plataforma de inteligencia electoral que cruza datos públicos (Polymarket, encuestas TSE, cobertura periodística). El contenido es informativo y no constituye asesoría electoral, financiera, jurídica ni de inversión.'],
      ['Licenciamiento', 'El código fuente de la plataforma se distribuye bajo licencia Apache 2.0. El contenido editorial (síntesis AFOS Daily, análisis) se distribuye bajo CC BY 4.0, puede ser reproducido con atribución.'],
      ['Contenido de terceros', 'Los datos de Polymarket son propiedad de Polymarket. Las encuestas electorales son propiedad de los respectivos institutos. Las noticias citadas pertenecen a los respectivos medios. AFOS Analytics no está afiliada a ninguna de estas fuentes.'],
      ['Limitación de responsabilidad', 'AFOS Analytics proporciona información basada en datos auditables públicos, sin garantía de precisión, completitud o actualidad. Las decisiones tomadas con base en el contenido son responsabilidad exclusiva del usuario. AFOS Analytics no se responsabiliza por pérdidas derivadas del uso de la plataforma.'],
      ['Uso permitido', 'Permitido: lectura, cita con atribución, embed en sitios propios, uso en investigación académica. No permitido: scraping automatizado a gran escala, redistribución comercial sin permiso, uso para construir producto competidor.'],
      ['Cambios en los términos', 'Estos términos pueden actualizarse en cualquier momento. Cambios significativos serán comunicados a los suscriptores por email.'],
    ],
  },
} as const

export function generateMetadata({ params }: Props): Metadata {
  const c = CONTENT[params.locale as keyof typeof CONTENT] ?? CONTENT['pt-BR']
  return buildMetadata({ title: c.title, description: c.description, path: 'terms' }, params.locale as Locale)
}

export default function TermsPage({ params }: Props) {
  if (!isValidLocale(params.locale)) notFound()
  const c = CONTENT[params.locale as keyof typeof CONTENT] ?? CONTENT['pt-BR']
  return (
    <div className="min-h-screen bg-light-bg flex flex-col">
      <StaticPageHeader />
      <main id="main-content" className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-dark mb-2">{c.h1}</h1>
        <p className="text-xs text-gray-500 mb-10">{c.updated}</p>
        <div className="space-y-8">
          {c.sections.map(([heading, body]) => (
            <section key={heading} className="bg-white border border-light-border rounded-xl p-6 shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold text-primary mb-3">{heading}</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{body}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
