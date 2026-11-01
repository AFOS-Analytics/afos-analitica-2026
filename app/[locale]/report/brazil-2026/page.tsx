import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Source_Sans_3, Source_Serif_4 } from 'next/font/google'
import { RelatorioFinalTemplate } from '../../../components/RelatorioFinalTemplate'
import { buildMetadata } from '../../../../lib/seo/metadata'
import type { Locale } from '../../../../lib/i18n/config'
import {
  RELATORIO_LOCALES, RELATORIO_PDF, HARVARD_BR2026_URL, carregarRelatorio, relatorioExiste, type RelatorioLocale,
} from '../../../../lib/relatorio-final/loader'

// As mesmas famílias do PDF, servidas pelo próprio site (o CSP só aceita fonte de 'self').
const sans = Source_Sans_3({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--rel-sans', display: 'swap' })
const serif = Source_Serif_4({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--rel-serif', display: 'swap' })

// Só os idiomas cujo HTML existe: idioma sem tradução é 404, nunca o português
// servido com o rótulo de outro idioma.
export async function generateStaticParams() {
  return RELATORIO_LOCALES.filter((l) => relatorioExiste(l)).map((locale) => ({ locale }))
}
export const dynamicParams = false

interface Props { params: Promise<{ locale: string }> }

const SEO: Record<RelatorioLocale, { title: string; description: string; og: string }> = {
  'pt-BR': {
    title: 'Relatório de fechamento Brasil 2026 | AFOS Analytics',
    description: 'Durante 186 dias o AFOS registrou, lado a lado, o mercado de previsão, as pesquisas registradas no TSE e a imprensa, e comparou essas séries com o resultado oficial dos dois turnos.',
    og: '/brand/og-relatorio-final-br-2026-pt-1200x627.png',
  },
  en: {
    title: 'Brazil 2026 Closing Report | AFOS Analytics',
    description: 'For 186 days AFOS recorded, side by side, the prediction market, the polls registered with the TSE and the press, and compared those series with the official result of both rounds.',
    og: '/brand/og-relatorio-final-br-2026-en-1200x627.png',
  },
  es: {
    title: 'Informe de cierre Brasil 2026 | AFOS Analytics',
    description: 'Durante 186 días AFOS registró, lado a lado, el mercado de predicción, las encuestas registradas en el TSE y la prensa, y comparó esas series con el resultado oficial de las dos vueltas.',
    og: '/brand/og-relatorio-final-br-2026-es-1200x627.png',
  },
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params
  if (!relatorioExiste(locale)) return { title: 'AFOS Analytics', robots: { index: false, follow: false } }
  const s = SEO[locale]
  const meta = buildMetadata({ title: s.title, description: s.description, path: 'report/brazil-2026', image: s.og }, locale as Locale)
  // hreflang só para os idiomas que existem de fato.
  const languages: Record<string, string> = {}
  for (const l of RELATORIO_LOCALES) if (relatorioExiste(l)) languages[l] = `https://www.afos-analytics.com/${l}/report/brazil-2026`
  languages['x-default'] = languages['pt-BR']
  return { ...meta, alternates: { ...meta.alternates, languages } }
}

export default async function RelatorioFinalPage(props: Props) {
  const { locale } = await props.params
  if (!relatorioExiste(locale)) notFound()
  const rel = carregarRelatorio(locale)
  if (!rel) notFound()
  const idiomas = RELATORIO_LOCALES.filter((l) => relatorioExiste(l))
  return (
    <RelatorioFinalTemplate
      locale={locale}
      corpo={rel.corpo}
      pdf={RELATORIO_PDF[locale]}
      harvardUrl={HARVARD_BR2026_URL}
      idiomas={[...idiomas]}
      fontClass={`${sans.variable} ${serif.variable}`}
    />
  )
}
