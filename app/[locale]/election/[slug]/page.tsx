import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locales, isValidLocale, type Locale } from '../../../../lib/i18n/config'
import { getElectionBySlug, COUNTRIES_SEO } from '../../../../lib/seo/countries'

const BASE_URL = 'https://afos-analytics.com'

const META_TEMPLATES: Record<string, { title: string; desc: string }> = {
  'pt-BR': {
    title: 'Eleição {country} {year} — {type} | AFOS Analytics',
    desc: 'Inteligência eleitoral em tempo real para {country} {year}. Odds de mercados de previsão, pesquisas e sinais políticos.',
  },
  en: {
    title: '{country} {year} {type} Election | AFOS Analytics',
    desc: 'Real-time election intelligence for {country} {year}. Prediction market odds, polls, and political signals.',
  },
  es: {
    title: 'Elección {country} {year} — {type} | AFOS Analytics',
    desc: 'Inteligencia electoral en tiempo real para {country} {year}. Odds de mercados de predicción, encuestas y señales políticas.',
  },
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = []
  for (const loc of locales) {
    for (const c of COUNTRIES_SEO) {
      for (const e of c.elections) {
        params.push({ locale: loc, slug: e.slug })
      }
    }
  }
  return params
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const loc = isValidLocale(locale) ? locale : 'pt-BR'
  const result = getElectionBySlug(slug)
  if (!result) return {}

  const { country, election } = result
  const name = country.name[loc] || country.name['en']
  const type = election.type[loc] || election.type['en']
  const tpl = META_TEMPLATES[loc] || META_TEMPLATES['en']

  const title = tpl.title.replace('{country}', name).replace('{year}', String(election.year)).replace('{type}', type)
  const description = tpl.desc.replace('{country}', name).replace('{year}', String(election.year))

  const languages: Record<string, string> = {}
  for (const l of locales) {
    languages[l] = `${BASE_URL}/${l}/election/${slug}`
  }
  languages['x-default'] = `${BASE_URL}/en/election/${slug}`

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/${loc}/election/${slug}`, languages },
    openGraph: { title, description, url: `${BASE_URL}/${loc}/election/${slug}` },
  }
}

export default async function ElectionPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const loc = (isValidLocale(locale) ? locale : 'pt-BR') as Locale
  const result = getElectionBySlug(slug)
  if (!result) notFound()

  const { country, election } = result
  const name = country.name[loc] || country.name['en']
  const type = election.type[loc] || election.type['en']
  const labels = {
    'pt-BR': { type: 'Tipo', date: 'Data', status: 'Status', market: 'Mercado de previsão', backToCountry: '← Ver país', signals: 'Sinais e tendências', sentiment: 'Sentimento de mercado', context: 'Contexto político', contextText: `A eleição ${type.toLowerCase()} de ${name} em ${election.year} é monitorada pela AFOS Analytics com dados de mercados de previsão, pesquisas eleitorais e análise de eventos críticos.`, implications: 'Implicações de mercado', implicationsText: `Resultados eleitorais em ${name} impactam diretamente percepção de risco soberano, fluxos de capital e decisões de investidores globais. Mercados de previsão precificam cenários prováveis em tempo real.`, institutional: 'Relevância institucional', institutionalText: `Fundos, bancos e consultorias estratégicas usam sinais eleitorais para antecipar movimentos de mercado. A AFOS Analytics consolida esses sinais em uma interface acessível.`, whyPrediction: 'Por que mercados de previsão', whyPredictionText: 'Mercados de previsão com dinheiro real (como Polymarket) são historicamente mais precisos que pesquisas tradicionais. Refletem onde as pessoas colocam seu dinheiro — não apenas sua opinião.' },
    en: { type: 'Type', date: 'Date', status: 'Status', market: 'Prediction market', backToCountry: '← View country', signals: 'Signals & trends', sentiment: 'Market sentiment', context: 'Political context', contextText: `The ${type.toLowerCase()} election in ${name} ${election.year} is monitored by AFOS Analytics with prediction market data, electoral polls, and critical event analysis.`, implications: 'Market implications', implicationsText: `Election outcomes in ${name} directly impact sovereign risk perception, capital flows, and global investor decisions. Prediction markets price likely scenarios in real time.`, institutional: 'Institutional relevance', institutionalText: `Funds, banks, and strategic consultancies use election signals to anticipate market movements. AFOS Analytics consolidates these signals into an accessible interface.`, whyPrediction: 'Why prediction markets', whyPredictionText: 'Real-money prediction markets (like Polymarket) are historically more accurate than traditional polls. They reflect where people put their money — not just their opinion.' },
    es: { type: 'Tipo', date: 'Fecha', status: 'Estado', market: 'Mercado de predicción', backToCountry: '← Ver país', signals: 'Señales y tendencias', sentiment: 'Sentimiento de mercado', context: 'Contexto político', contextText: `La elección ${type.toLowerCase()} de ${name} en ${election.year} es monitoreada por AFOS Analytics con datos de mercados de predicción, encuestas electorales y análisis de eventos críticos.`, implications: 'Implicaciones de mercado', implicationsText: `Los resultados electorales en ${name} impactan directamente la percepción de riesgo soberano, flujos de capital y decisiones de inversores globales. Los mercados de predicción precifican escenarios probables en tiempo real.`, institutional: 'Relevancia institucional', institutionalText: `Fondos, bancos y consultorías estratégicas usan señales electorales para anticipar movimientos de mercado. AFOS Analytics consolida esas señales en una interfaz accesible.`, whyPrediction: 'Por qué mercados de predicción', whyPredictionText: 'Los mercados de predicción con dinero real (como Polymarket) son históricamente más precisos que las encuestas tradicionales. Reflejan dónde las personas ponen su dinero — no solo su opinión.' },
  }
  const l = labels[loc] || labels['en']

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <a href={`/${loc}/country/${country.slug[loc]}`} className="text-primary text-sm hover:underline mb-6 inline-block">{l.backToCountry}</a>

        <h1 className="text-3xl md:text-4xl font-extrabold text-dark mb-2">
          {country.flag} {name} — {type} {election.year}
        </h1>
        <p className="text-gray-500 mb-8">{l.date}: {election.date} · {l.status}: <span className="capitalize">{election.status}</span></p>

        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-primary mb-3">{l.market}</h2>
            <p className="text-sm text-gray-600">
              {election.polymarketSlug
                ? <a href={`https://polymarket.com/event/${election.polymarketSlug}`} target="_blank" rel="noopener noreferrer" className="text-primary underline">Polymarket →</a>
                : '—'
              }
            </p>
          </div>
          <div className="bg-light-bg border border-light-border rounded-xl p-6">
            <h2 className="text-lg font-bold text-dark mb-3">{l.signals}</h2>
            <p className="text-sm text-gray-600">{l.sentiment}</p>
          </div>
        </div>

        {/* Conteúdo SEO estruturado */}
        <div className="space-y-6 mb-8">
          <div>
            <h2 className="text-lg font-bold text-primary mb-2">{l.context}</h2>
            <p className="text-sm text-dark leading-relaxed">{l.contextText}</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary mb-2">{l.implications}</h2>
            <p className="text-sm text-dark leading-relaxed">{l.implicationsText}</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary mb-2">{l.institutional}</h2>
            <p className="text-sm text-dark leading-relaxed">{l.institutionalText}</p>
          </div>
          <div>
            <h3 className="text-base font-bold text-dark mb-2">{l.whyPrediction}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{l.whyPredictionText}</p>
          </div>
        </div>

        {/* Internal links */}
        <div className="grid sm:grid-cols-2 gap-3">
          <a href={`/${loc}/country/${country.slug[loc]}`} className="bg-light-bg border border-light-border rounded-lg p-3 text-sm font-semibold text-dark hover:border-primary transition-colors">→ {country.flag} {name}</a>
          <a href={`/${loc}/political-risk`} className="bg-light-bg border border-light-border rounded-lg p-3 text-sm font-semibold text-dark hover:border-primary transition-colors">→ {loc === 'pt-BR' ? 'Risco Político' : loc === 'es' ? 'Riesgo Político' : 'Political Risk'}</a>
          <a href={`/${loc}/for-investors`} className="bg-light-bg border border-light-border rounded-lg p-3 text-sm font-semibold text-dark hover:border-primary transition-colors">→ {loc === 'pt-BR' ? 'Para Investidores' : loc === 'es' ? 'Para Inversores' : 'For Investors'}</a>
          <a href={`/${loc}/election-intelligence`} className="bg-light-bg border border-light-border rounded-lg p-3 text-sm font-semibold text-dark hover:border-primary transition-colors">→ {loc === 'pt-BR' ? 'Inteligência Eleitoral' : loc === 'es' ? 'Inteligencia Electoral' : 'Election Intelligence'}</a>
        </div>
      </div>
    </div>
  )
}
