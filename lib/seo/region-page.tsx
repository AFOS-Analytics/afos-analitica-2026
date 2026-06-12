import type { Metadata } from 'next'
import { locales, isValidLocale, type Locale } from '../i18n/config'
import { getRegionBySlug, getCountriesForRegion, ISO3_TO_CC, type RegionSEO } from './countries'
import { breadcrumbSchema } from './schema'

const BASE_URL = 'https://www.afos-analytics.com'

const STATUS_STYLE: Record<string, string> = { active: 'bg-green-100 text-green-700', completed: 'bg-gray-200 text-gray-600', upcoming: 'bg-blue-100 text-blue-700' }

const LABELS: Record<string, { countries: string; elections: string; risk: string; relatedElections: string; institutional: string; viewCountry: string; viewElection: string; status: Record<string, string> }> = {
  'pt-BR': { countries: 'Países monitorados', elections: 'Eleições', risk: 'Risco político', relatedElections: 'Eleições relacionadas', institutional: 'Inteligência institucional', viewCountry: 'Ver país', viewElection: 'Ver eleição', status: { active: 'Em andamento', completed: 'Encerrada', upcoming: 'Futura' } },
  en: { countries: 'Monitored countries', elections: 'Elections', risk: 'Political risk', relatedElections: 'Related elections', institutional: 'Institutional intelligence', viewCountry: 'View country', viewElection: 'View election', status: { active: 'Active', completed: 'Completed', upcoming: 'Upcoming' } },
  es: { countries: 'Países monitoreados', elections: 'Elecciones', risk: 'Riesgo político', relatedElections: 'Elecciones relacionadas', institutional: 'Inteligencia institucional', viewCountry: 'Ver país', viewElection: 'Ver elección', status: { active: 'En curso', completed: 'Finalizada', upcoming: 'Próxima' } },
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
    const ogImage = `${BASE_URL}/brand/og-${loc === 'pt-BR' ? 'pt' : loc}-linkedin-1200x627.png`
    return {
      title: m.title,
      description: m.desc,
      alternates: { canonical: `${BASE_URL}/${loc}/${regionSlug}`, languages },
      openGraph: {
        type: 'website',
        title: m.title,
        description: m.desc,
        url: `${BASE_URL}/${loc}/${regionSlug}`,
        siteName: 'AFOS Analytics',
        locale: loc === 'pt-BR' ? 'pt_BR' : loc === 'es' ? 'es_ES' : 'en_US',
        images: [{ url: ogImage, width: 1200, height: 627, alt: m.title }],
      },
      twitter: { card: 'summary_large_image', title: m.title, description: m.desc, images: [ogImage] },
    }
  }

  async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const loc = (isValidLocale(locale) ? locale : 'en') as Locale
    if (!region) return <div>Region not found</div>

    const m = region.meta[loc] || region.meta['en']
    const l = LABELS[loc] || LABELS['en']
    const countries = getCountriesForRegion(region)
    const breadcrumb = breadcrumbSchema(loc, [{ name: m.h1, path: regionSlug }])

    return (
      <div className="min-h-screen bg-white">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between gap-3 mb-8">
            <a href={`/${loc}`} aria-label="AFOS Analytics, Home" className="text-base sm:text-lg font-extrabold tracking-tight text-primary">AFOS Analytics</a>
            <a href={`/${loc}/dashboard`} className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary/90">Dashboard</a>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-dark mb-4">{m.h1}</h1>
          <p className="text-lg text-gray-600 mb-10">{m.intro}</p>

          {/* Países da região */}
          {countries.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-primary mb-4">{l.countries}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {countries.map((c) => {
                  const cc = ISO3_TO_CC[c.iso3] || ''
                  return (
                    <a key={c.iso3} href={`/${loc}/country/${c.slug[loc]}`}
                       className="group flex flex-col bg-light-bg border border-light-border rounded-xl p-5 hover:border-primary hover:shadow-md transition-all">
                      <div className="flex items-center gap-2.5 mb-2">
                        {cc
                          ? <img src={`/flags/${cc}.svg`} alt="" aria-hidden="true" width={28} height={19} className="rounded-sm object-cover shadow-sm flex-shrink-0" style={{ width: 28, height: 19 }} />
                          : <span className="text-2xl" aria-hidden="true">{c.flag}</span>}
                        <h3 className="font-bold text-dark">{c.name[loc] || c.name['en']}</h3>
                      </div>
                      <p className="text-xs text-gray-500">{c.region}</p>
                      {c.elections[0] && (
                        <p className="text-xs text-gray-600 mt-1">{l.elections}: {c.elections[0].type[loc] || c.elections[0].type['en']} {c.elections[0].year}</p>
                      )}
                      <span className="mt-3 inline-flex items-center text-sm font-semibold text-primary group-hover:underline">{l.viewCountry} →</span>
                    </a>
                  )
                })}
              </div>
            </section>
          )}

          {/* Eleições da região */}
          {countries.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-primary mb-4">{l.relatedElections}</h2>
              <div className="space-y-3">
                {countries.flatMap((c) => {
                  const cc = ISO3_TO_CC[c.iso3] || ''
                  return c.elections.map((e) => (
                    <a key={e.slug} href={`/${loc}/election/${e.slug}`}
                       className="group flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors">
                      {cc
                        ? <img src={`/flags/${cc}.svg`} alt="" aria-hidden="true" width={28} height={19} className="rounded-sm object-cover shadow-sm flex-shrink-0" style={{ width: 28, height: 19 }} />
                        : <span className="text-xl flex-shrink-0" aria-hidden="true">{c.flag}</span>}
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-dark">{c.name[loc] || c.name['en']} — {e.type[loc] || e.type['en']} {e.year}</span>
                        <span className={`ml-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[e.status] || STATUS_STYLE.upcoming}`}>{l.status[e.status] || e.status}</span>
                      </div>
                      <span className="flex-shrink-0 whitespace-nowrap text-sm font-semibold text-primary group-hover:underline">{l.viewElection} →</span>
                    </a>
                  ))
                })}
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
              <a href={`/${loc}/geopolitical-signals`} className="bg-light-bg border border-light-border rounded-lg p-4 hover:border-primary transition-colors text-sm font-semibold text-dark">→ {loc === 'pt-BR' ? 'Sinais Geopolíticos' : loc === 'es' ? 'Señales Geopolíticas' : 'Geopolitical Signals'}</a>
              <a href={`/${loc}/emerging-markets-risk`} className="bg-light-bg border border-light-border rounded-lg p-4 hover:border-primary transition-colors text-sm font-semibold text-dark">→ {loc === 'pt-BR' ? 'Mercados Emergentes' : loc === 'es' ? 'Mercados Emergentes' : 'Emerging Markets'}</a>
              <a href={`/${loc}/global-election-calendar`} className="bg-light-bg border border-light-border rounded-lg p-4 hover:border-primary transition-colors text-sm font-semibold text-dark">→ {loc === 'pt-BR' ? 'Calendário Eleitoral' : loc === 'es' ? 'Calendario Electoral' : 'Election Calendar'}</a>
            </div>
          </section>
        </div>
      </div>
    )
  }

  return { generateStaticParams, generateMetadata, Page }
}
