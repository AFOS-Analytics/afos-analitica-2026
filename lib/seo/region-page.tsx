import type { Metadata } from 'next'
import { locales, isValidLocale, type Locale } from '../i18n/config'
import { getRegionBySlug, getCountriesForRegion, type RegionSEO } from './countries'

const BASE_URL = 'https://afos-analytics.com'

const LABELS: Record<string, { countries: string; elections: string; risk: string; cta: string; relatedElections: string; institutional: string }> = {
  'pt-BR': { countries: 'Países monitorados', elections: 'Eleições', risk: 'Risco político', cta: '← Dashboard', relatedElections: 'Eleições relacionadas', institutional: 'Inteligência institucional' },
  en: { countries: 'Monitored countries', elections: 'Elections', risk: 'Political risk', cta: '← Dashboard', relatedElections: 'Related elections', institutional: 'Institutional intelligence' },
  es: { countries: 'Países monitoreados', elections: 'Elecciones', risk: 'Riesgo político', cta: '← Dashboard', relatedElections: 'Elecciones relacionadas', institutional: 'Inteligencia institucional' },
}

export function RegionPage(regionSlug: string) {
  const region = getRegionBySlug(regionSlug)

  async function generateStaticParams() {
    return locales.map((locale) => ({ locale }))
  }

  async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params
    const loc = isValidLocale(locale) ? locale : 'en'
    if (!region) return {}
    const m = region.meta[loc] || region.meta['en']
    const languages: Record<string, string> = {}
    for (const l of locales) languages[l] = `${BASE_URL}/${l}/${regionSlug}`
    languages['x-default'] = `${BASE_URL}/en/${regionSlug}`
    return {
      title: m.title,
      description: m.desc,
      alternates: { canonical: `${BASE_URL}/${loc}/${regionSlug}`, languages },
      openGraph: { title: m.title, description: m.desc, url: `${BASE_URL}/${loc}/${regionSlug}` },
    }
  }

  async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const loc = (isValidLocale(locale) ? locale : 'en') as Locale
    if (!region) return <div>Region not found</div>

    const m = region.meta[loc] || region.meta['en']
    const l = LABELS[loc] || LABELS['en']
    const countries = getCountriesForRegion(region)

    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <a href={`/${loc}`} className="text-primary text-sm hover:underline mb-6 inline-block">{l.cta}</a>

          <h1 className="text-3xl md:text-5xl font-extrabold text-dark mb-4">{m.h1}</h1>
          <p className="text-lg text-gray-600 mb-10">{m.intro}</p>

          {/* Países da região */}
          {countries.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-primary mb-4">{l.countries}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {countries.map((c) => (
                  <a key={c.iso3} href={`/${loc}/country/${c.slug[loc]}`}
                     className="bg-light-bg border border-light-border rounded-xl p-5 hover:border-primary hover:shadow-md transition-all">
                    <div className="text-2xl mb-2">{c.flag}</div>
                    <h3 className="font-bold text-dark">{c.name[loc] || c.name['en']}</h3>
                    <p className="text-xs text-gray-500 mt-1">{c.region}</p>
                    {c.elections[0] && (
                      <p className="text-xs text-primary mt-2">{l.elections}: {c.elections[0].type[loc] || c.elections[0].type['en']} {c.elections[0].year}</p>
                    )}
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Eleições da região */}
          {countries.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-primary mb-4">{l.relatedElections}</h2>
              <div className="space-y-3">
                {countries.flatMap((c) => c.elections.map((e) => (
                  <a key={e.slug} href={`/${loc}/election/${e.slug}`}
                     className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors">
                    <span className="text-xl">{c.flag}</span>
                    <div>
                      <span className="font-semibold text-dark">{c.name[loc] || c.name['en']} — {e.type[loc] || e.type['en']} {e.year}</span>
                      <span className="text-xs text-gray-500 ml-2 capitalize">{e.status}</span>
                    </div>
                  </a>
                )))}
              </div>
            </section>
          )}

          {/* Links institucionais */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-primary mb-4">{l.institutional}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <a href={`/${loc}/for-investors`} className="bg-light-bg border border-light-border rounded-lg p-4 hover:border-primary transition-colors text-sm font-semibold text-dark">→ {loc === 'pt-BR' ? 'Para Investidores' : loc === 'es' ? 'Para Inversores' : 'For Investors'}</a>
              <a href={`/${loc}/political-risk`} className="bg-light-bg border border-light-border rounded-lg p-4 hover:border-primary transition-colors text-sm font-semibold text-dark">→ {loc === 'pt-BR' ? 'Risco Político' : loc === 'es' ? 'Riesgo Político' : 'Political Risk'}</a>
              <a href={`/${loc}/election-intelligence`} className="bg-light-bg border border-light-border rounded-lg p-4 hover:border-primary transition-colors text-sm font-semibold text-dark">→ {loc === 'pt-BR' ? 'Inteligência Eleitoral' : loc === 'es' ? 'Inteligencia Electoral' : 'Election Intelligence'}</a>
              <a href={`/${loc}/for-analysts`} className="bg-light-bg border border-light-border rounded-lg p-4 hover:border-primary transition-colors text-sm font-semibold text-dark">→ {loc === 'pt-BR' ? 'Para Analistas' : loc === 'es' ? 'Para Analistas' : 'For Analysts'}</a>
            </div>
          </section>
        </div>
      </div>
    )
  }

  return { generateStaticParams, generateMetadata, Page }
}
