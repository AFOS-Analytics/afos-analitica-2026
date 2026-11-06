import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Source_Sans_3, Source_Serif_4 } from 'next/font/google'
import { RelatorioFinalTemplate } from '../../../components/RelatorioFinalTemplate'
import { buildMetadata } from '../../../../lib/seo/metadata'
import type { Locale } from '../../../../lib/i18n/config'
import { RELATORIO_LOCALES, RELATORIOS, carregarRelatorio, relatorioExiste, type RelatorioLocale } from '../../../../lib/relatorio-final/loader'

// Relatório de fechamento EUA 2026, mesma página do relatório do Brasil.
const SLUG = 'usa-2026' as const
const DEF = RELATORIOS[SLUG]

// As mesmas famílias do PDF, servidas pelo próprio site (o CSP só aceita fonte de 'self').
const sans = Source_Sans_3({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--rel-sans', display: 'swap' })
const serif = Source_Serif_4({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--rel-serif', display: 'swap' })

// Só os idiomas cujo HTML existe: idioma sem tradução é 404, nunca o português
// servido com o rótulo de outro idioma.
export async function generateStaticParams() {
  return RELATORIO_LOCALES.filter((l) => relatorioExiste(l, SLUG)).map((locale) => ({ locale }))
}
export const dynamicParams = false

interface Props { params: Promise<{ locale: string }> }

const SEO: Record<RelatorioLocale, { title: string; description: string; og: string }> = {
  'pt-BR': {
    title: 'Relatório de fechamento EUA 2026 | AFOS Analytics',
    description: 'De abril à eleição de 3 de novembro, o AFOS registrou lado a lado os preços do Polymarket sobre o controle da Câmara e do Senado, as pesquisas nacionais e a imprensa, e pôs essas séries ao lado do resultado e da repercussão no mundo.',
    og: '/brand/og-relatorio-final-us-2026-pt-1200x627.png',
  },
  en: {
    title: 'US 2026 Closing Report | AFOS Analytics',
    description: 'From April to the November 3 election, AFOS recorded side by side the Polymarket prices on control of the House and the Senate, the national polls and the press, and set those series next to the result and the reaction around the world.',
    og: '/brand/og-relatorio-final-us-2026-en-1200x627.png',
  },
  es: {
    title: 'Informe de cierre EE. UU. 2026 | AFOS Analytics',
    description: 'De abril a la elección del 3 de noviembre, AFOS registró lado a lado los precios de Polymarket sobre el control de la Cámara y del Senado, las encuestas nacionales y la prensa, y puso esas series junto al resultado y a la repercusión en el mundo.',
    og: '/brand/og-relatorio-final-us-2026-es-1200x627.png',
  },
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params
  if (!relatorioExiste(locale, SLUG)) return { title: 'AFOS Analytics', robots: { index: false, follow: false } }
  const s = SEO[locale]
  const meta = buildMetadata({ title: s.title, description: s.description, path: `report/${SLUG}`, image: s.og }, locale as Locale)
  // hreflang só para os idiomas que existem de fato; o padrão é o inglês, público da eleição.
  const languages: Record<string, string> = {}
  for (const l of RELATORIO_LOCALES) if (relatorioExiste(l, SLUG)) languages[l] = `https://www.afos-analytics.com/${l}/report/${SLUG}`
  languages['x-default'] = languages.en ?? languages['pt-BR']
  return { ...meta, alternates: { ...meta.alternates, languages } }
}

export default async function RelatorioFinalEuaPage(props: Props) {
  const { locale } = await props.params
  if (!relatorioExiste(locale, SLUG)) notFound()
  const rel = carregarRelatorio(locale, SLUG)
  if (!rel) notFound()
  const idiomas = RELATORIO_LOCALES.filter((l) => relatorioExiste(l, SLUG))
  return (
    <RelatorioFinalTemplate
      slug={SLUG}
      locale={locale}
      corpo={rel.corpo}
      pdf={DEF.pdf[locale]}
      harvardUrl={DEF.harvardUrl}
      harvardDoi={DEF.harvardDoi}
      idiomas={[...idiomas]}
      fontClass={`${sans.variable} ${serif.variable}`}
    />
  )
}
