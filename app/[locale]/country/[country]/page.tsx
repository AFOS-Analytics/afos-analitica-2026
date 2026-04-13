import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locales, isValidLocale, type Locale } from '../../../../lib/i18n/config'
import { getCountryBySlug, COUNTRIES_SEO } from '../../../../lib/seo/countries'

const BASE_URL = 'https://afos-analytics.com'

const META_TEMPLATES: Record<string, { title: string; desc: string }> = {
  'pt-BR': {
    title: '{country} — Eleições {year} | Risco Político e Mercados de Previsão',
    desc: 'Dados eleitorais em tempo real, sinais de risco político e mercados de previsão para {country}. AFOS Analytics.',
  },
  en: {
    title: '{country} Election {year} | Political Risk & Prediction Markets',
    desc: 'Real-time election data, political risk signals, and prediction markets for {country}. AFOS Analytics.',
  },
  es: {
    title: '{country} — Elecciones {year} | Riesgo Político y Mercados de Predicción',
    desc: 'Datos electorales en tiempo real, señales de riesgo político y mercados de predicción para {country}. AFOS Analytics.',
  },
}

export async function generateStaticParams() {
  const params: { locale: string; country: string }[] = []
  for (const loc of locales) {
    for (const c of COUNTRIES_SEO) {
      params.push({ locale: loc, country: c.slug[loc] })
    }
  }
  return params
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; country: string }> }): Promise<Metadata> {
  const { locale, country: slug } = await params
  const loc = isValidLocale(locale) ? locale : 'pt-BR'
  const country = getCountryBySlug(slug)
  if (!country) return {}

  const name = country.name[loc] || country.name['en']
  const year = country.elections[0]?.year || ''
  const tpl = META_TEMPLATES[loc] || META_TEMPLATES['en']

  const title = tpl.title.replace('{country}', name).replace('{year}', String(year))
  const description = tpl.desc.replace('{country}', name)

  const languages: Record<string, string> = {}
  for (const l of locales) {
    languages[l] = `${BASE_URL}/${l}/country/${country.slug[l]}`
  }
  languages['x-default'] = `${BASE_URL}/en/country/${country.slug['en']}`

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/${loc}/country/${slug}`, languages },
    openGraph: { title, description, url: `${BASE_URL}/${loc}/country/${slug}` },
  }
}

export default async function CountryPage({ params }: { params: Promise<{ locale: string; country: string }> }) {
  const { locale, country: slug } = await params
  const loc = (isValidLocale(locale) ? locale : 'pt-BR') as Locale
  const country = getCountryBySlug(slug)
  if (!country) notFound()

  const name = country.name[loc] || country.name['en']
  const election = country.elections[0]
  const elType = election?.type[loc] || election?.type['en'] || ''
  const labels = {
    'pt-BR': { region: 'Região', type: 'Tipo', date: 'Data', status: 'Status', elections: 'Eleições monitoradas', backToDashboard: '← Dashboard', overview: 'Visão geral', overviewText: `Acompanhe a eleição de ${name} com dados de mercados de previsão, pesquisas eleitorais e análise de risco político em tempo real.`, risk: 'Risco Político', riskText: `O cenário político de ${name} é monitorado continuamente com sinais de mercados de previsão, sentimento público e eventos críticos que podem impactar câmbio, investimentos e governança.`, market: 'Relevância para o Mercado', marketText: `Eleições em ${name} impactam diretamente fluxos de capital, câmbio e percepção de risco soberano. Mercados de previsão oferecem sinais antecipados sobre cenários prováveis.`, why: 'Por que acompanhar', whyText: `${name} é um dos mercados monitorados pela AFOS Analytics. Dados eleitorais em tempo real permitem decisões mais informadas para investidores, analistas e cidadãos.` },
    en: { region: 'Region', type: 'Type', date: 'Date', status: 'Status', elections: 'Monitored elections', backToDashboard: '← Dashboard', overview: 'Overview', overviewText: `Track ${name}'s election with prediction market data, electoral polls, and real-time political risk analysis.`, risk: 'Political Risk', riskText: `${name}'s political landscape is continuously monitored with prediction market signals, public sentiment, and critical events that may impact FX, investments, and governance.`, market: 'Market Relevance', marketText: `Elections in ${name} directly impact capital flows, FX, and sovereign risk perception. Prediction markets offer early signals on likely scenarios.`, why: 'Why monitor', whyText: `${name} is one of the markets monitored by AFOS Analytics. Real-time election data enables more informed decisions for investors, analysts, and citizens.` },
    es: { region: 'Región', type: 'Tipo', date: 'Fecha', status: 'Estado', elections: 'Elecciones monitoreadas', backToDashboard: '← Dashboard', overview: 'Visión general', overviewText: `Siga la elección de ${name} con datos de mercados de predicción, encuestas electorales y análisis de riesgo político en tiempo real.`, risk: 'Riesgo Político', riskText: `El escenario político de ${name} es monitoreado continuamente con señales de mercados de predicción, sentimiento público y eventos críticos que pueden impactar divisas, inversiones y gobernanza.`, market: 'Relevancia de Mercado', marketText: `Las elecciones en ${name} impactan directamente flujos de capital, tipo de cambio y percepción de riesgo soberano. Los mercados de predicción ofrecen señales anticipadas sobre escenarios probables.`, why: 'Por qué monitorear', whyText: `${name} es uno de los mercados monitoreados por AFOS Analytics. Datos electorales en tiempo real permiten decisiones más informadas para inversores, analistas y ciudadanos.` },
  }
  const l = labels[loc] || labels['en']

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <a href={`/${loc}`} className="text-primary text-sm hover:underline mb-6 inline-block">{l.backToDashboard}</a>

        <h1 className="text-3xl md:text-4xl font-extrabold text-dark mb-2">
          {country.flag} {name}
        </h1>
        <p className="text-gray-500 mb-8">{l.region}: {country.region}</p>

        {election && (
          <div className="bg-light-bg border border-light-border rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-primary mb-4">{l.elections}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500 uppercase">{l.type}</span>
                <p className="font-semibold text-dark">{elType} {election.year}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase">{l.date}</span>
                <p className="font-semibold text-dark">{election.date}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase">{l.status}</span>
                <p className="font-semibold text-dark capitalize">{election.status}</p>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo SEO estruturado */}
        <div className="space-y-6 mb-8">
          <div>
            <h2 className="text-lg font-bold text-primary mb-2">{l.overview}</h2>
            <p className="text-sm text-dark leading-relaxed">{l.overviewText}</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary mb-2">{l.risk}</h2>
            <p className="text-sm text-dark leading-relaxed">{l.riskText}</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary mb-2">{l.market}</h2>
            <p className="text-sm text-dark leading-relaxed">{l.marketText}</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary mb-2">{l.why}</h2>
            <p className="text-sm text-dark leading-relaxed">{l.whyText}</p>
          </div>
        </div>

        {/* Internal links — eleições deste país */}
        {country.elections.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-3">{l.elections}</h2>
            <div className="space-y-2">
              {country.elections.map((el) => (
                <a key={el.slug} href={`/${loc}/election/${el.slug}`} className="block bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors">
                  <span className="font-semibold text-dark">{el.type[loc] || el.type['en']} {el.year}</span>
                  <span className="text-xs text-gray-500 ml-2 capitalize">{el.status}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Internal links — institutional */}
        <div className="grid sm:grid-cols-2 gap-3">
          <a href={`/${loc}/political-risk`} className="bg-light-bg border border-light-border rounded-lg p-3 text-sm font-semibold text-dark hover:border-primary transition-colors">→ {loc === 'pt-BR' ? 'Risco Político' : loc === 'es' ? 'Riesgo Político' : 'Political Risk'}</a>
          <a href={`/${loc}/for-investors`} className="bg-light-bg border border-light-border rounded-lg p-3 text-sm font-semibold text-dark hover:border-primary transition-colors">→ {loc === 'pt-BR' ? 'Para Investidores' : loc === 'es' ? 'Para Inversores' : 'For Investors'}</a>
        </div>
      </div>
    </div>
  )
}
