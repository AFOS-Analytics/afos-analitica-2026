import type { Metadata } from 'next'
import { locales, isValidLocale, type Locale } from '../i18n/config'

const BASE_URL = 'https://afos-analytics.com'

interface PageContent {
  metaTitle: string
  desc: string
  h1: string
  intro: string
  features: string[]
  cta: string
  ctaHref: string
  icon: string
}

export function InstitutionalPage(slug: string, content: Record<string, PageContent>) {
  async function generateStaticParams() {
    return locales.map((locale) => ({ locale }))
  }

  async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params
    const loc = isValidLocale(locale) ? locale : 'en'
    const c = content[loc] || content['en']
    const languages: Record<string, string> = {}
    for (const l of locales) languages[l] = `${BASE_URL}/${l}/${slug}`
    languages['x-default'] = `${BASE_URL}/en/${slug}`
    return {
      title: c.metaTitle,
      description: c.desc,
      alternates: { canonical: `${BASE_URL}/${loc}/${slug}`, languages },
      openGraph: { title: c.metaTitle, description: c.desc, url: `${BASE_URL}/${loc}/${slug}` },
    }
  }

  async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const loc = (isValidLocale(locale) ? locale : 'en') as Locale
    const c = content[loc] || content['en']

    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <a href={c.ctaHref.replace('{locale}', loc)} className="text-primary text-sm hover:underline mb-8 inline-block">{c.cta}</a>
          <h1 className="text-3xl md:text-5xl font-extrabold text-dark mb-4">{c.h1}</h1>
          <p className="text-lg text-gray-600 mb-10">{c.intro}</p>
          <div className="space-y-4 mb-12">
            {c.features.map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-primary font-bold text-lg mt-0.5">{c.icon}</span>
                <p className="text-dark">{f}</p>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-3 gap-3 mb-12">
            <a href={`/${loc}/for-investors`} className="bg-light-bg border border-light-border rounded-lg p-3 text-sm font-semibold text-dark hover:border-primary transition-colors text-center">→ {loc === 'pt-BR' ? 'Para Investidores' : loc === 'es' ? 'Para Inversores' : 'For Investors'}</a>
            <a href={`/${loc}/political-risk`} className="bg-light-bg border border-light-border rounded-lg p-3 text-sm font-semibold text-dark hover:border-primary transition-colors text-center">→ {loc === 'pt-BR' ? 'Risco Político' : loc === 'es' ? 'Riesgo Político' : 'Political Risk'}</a>
            <a href={`/${loc}/election-intelligence`} className="bg-light-bg border border-light-border rounded-lg p-3 text-sm font-semibold text-dark hover:border-primary transition-colors text-center">→ {loc === 'pt-BR' ? 'Inteligência Eleitoral' : loc === 'es' ? 'Inteligencia Electoral' : 'Election Intelligence'}</a>
          </div>
          <a href={c.ctaHref.replace('{locale}', loc)} className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors">{c.cta}</a>
        </div>
      </div>
    )
  }

  return { generateStaticParams, generateMetadata, Page }
}
