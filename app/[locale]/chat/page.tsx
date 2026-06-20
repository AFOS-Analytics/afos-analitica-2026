import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '../../../lib/i18n/config'
import { StaticPageHeader } from '../../components/StaticPageHeader'
import { Footer } from '../../components/Footer'
import { ChatPanel } from '../../components/ChatPanel'
import { buildMetadata } from '../../../lib/seo/metadata'

interface Props {
  params: Promise<{ locale: string }>
}

const META = {
  'pt-BR': {
    title: 'Chat AFOS-Analytics | Converse com o agente eleitoral',
    description:
      'Converse com o agente do AFOS-Analytics: odds do Polymarket ao vivo, pesquisas TSE, casos validados e divergência mercado×pesquisa da eleição de 2026.',
    h1: 'Chat AFOS-Analytics',
  },
  en: {
    title: 'AFOS-Analytics Chat | Talk to the election agent',
    description:
      'Chat with the AFOS-Analytics agent: live Polymarket odds, TSE polls, validated cases and market×poll divergence for the 2026 election.',
    h1: 'AFOS-Analytics Chat',
  },
  es: {
    title: 'Chat AFOS-Analytics | Habla con el agente electoral',
    description:
      'Conversa con el agente del AFOS-Analytics: odds de Polymarket en vivo, encuestas TSE, casos validados y divergencia mercado×encuesta de la elección de 2026.',
    h1: 'Chat AFOS-Analytics',
  },
} as const

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params
  const m = META[locale as keyof typeof META] ?? META['pt-BR']
  return buildMetadata({ title: m.title, description: m.description, path: 'chat' }, locale as Locale)
}

export default async function ChatPage(props: Props) {
  const { locale } = await props.params
  if (!isValidLocale(locale)) notFound()
  const m = META[locale as keyof typeof META] ?? META['pt-BR']

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark flex flex-col">
      <StaticPageHeader />
      <main id="main-content" className="flex-1 w-full flex flex-col">
        <h1 className="sr-only">{m.h1}</h1>
        <ChatPanel locale={locale as Locale} />
      </main>
      <Footer />
    </div>
  )
}
