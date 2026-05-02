import type { MetadataRoute } from 'next'
import { COUNTRIES_SEO } from '../lib/seo/countries'
import { listPublishedDailies } from '../lib/afos-daily/loader'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://afos-analytics.com'
  const locales = ['pt-BR', 'en', 'es']
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  function hreflang(path: (loc: string) => string, xDefault?: string) {
    const languages: Record<string, string> = {}
    for (const loc of locales) languages[loc] = `${baseUrl}${path(loc)}`
    languages['x-default'] = xDefault || `${baseUrl}${path('pt-BR')}`
    return languages
  }

  // Landing page: /pt-BR, /en, /es
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1,
      alternates: { languages: hreflang((l) => `/${l}`) },
    })
  }

  // Dashboard: /pt-BR/dashboard, /en/dashboard, /es/dashboard
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}/dashboard`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.95,
      alternates: { languages: hreflang((l) => `/${l}/dashboard`) },
    })
  }

  // Global map: /pt-BR/global, /en/global, /es/global
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}/global`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
      alternates: { languages: hreflang((l) => `/${l}/global`) },
    })
  }

  // Country pages: /[locale]/country/[country]
  for (const country of COUNTRIES_SEO) {
    for (const loc of locales) {
      entries.push({
        url: `${baseUrl}/${loc}/country/${country.slug[loc]}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.8,
        alternates: { languages: hreflang((l) => `/${l}/country/${country.slug[l]}`, `${baseUrl}/en/country/${country.slug['en']}`) },
      })
    }
  }

  // Election pages: /[locale]/election/[slug]
  for (const country of COUNTRIES_SEO) {
    for (const election of country.elections) {
      for (const loc of locales) {
        entries.push({
          url: `${baseUrl}/${loc}/election/${election.slug}`,
          lastModified: now,
          changeFrequency: election.status === 'active' ? 'hourly' : 'daily',
          priority: election.status === 'active' ? 0.9 : 0.7,
          alternates: { languages: hreflang((l) => `/${l}/election/${election.slug}`, `${baseUrl}/en/election/${election.slug}`) },
        })
      }
    }
  }

  // Region pages
  const regions = ['eu', 'latam'] // us removido (sem dados), america-latina canonical → latam
  for (const region of regions) {
    for (const loc of locales) {
      entries.push({
        url: `${baseUrl}/${loc}/${region}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.85,
        alternates: { languages: hreflang((l) => `/${l}/${region}`, `${baseUrl}/en/${region}`) },
      })
    }
  }

  // Institutional pages
  const institutional = ['for-investors', 'political-risk', 'election-intelligence', 'for-analysts', 'geopolitical-signals', 'emerging-markets-risk', 'global-election-calendar']
  for (const page of institutional) {
    for (const loc of locales) {
      entries.push({
        url: `${baseUrl}/${loc}/${page}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: { languages: hreflang((l) => `/${l}/${page}`, `${baseUrl}/en/${page}`) },
      })
    }
  }

  // How it works (didactic guide)
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}/how-it-works`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
      alternates: { languages: hreflang((l) => `/${l}/how-it-works`, `${baseUrl}/en/how-it-works`) },
    })
  }

  // Methodology — Automated Governance
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}/methodology/automated-governance`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
      alternates: { languages: hreflang((l) => `/${l}/methodology/automated-governance`, `${baseUrl}/en/methodology/automated-governance`) },
    })
  }

  // AFOS Daily — synthesis index per locale (always redirects to latest)
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}/daily`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: { languages: hreflang((l) => `/${l}/daily`) },
    })
  }

  // Glossary — Brazilian political terms (3 locales)
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}/glossary`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: hreflang((l) => `/${l}/glossary`) },
    })
  }

  // AFOS Daily — permalinks per date (3 locales × N dates)
  // Latest date gets higher priority. Each entry's lastModified = the date.
  // Published-only filter: drafts must not be discoverable via sitemap.
  const dailyDates = listPublishedDailies()
  const latestDate = dailyDates.length ? dailyDates[dailyDates.length - 1] : null
  for (const date of dailyDates) {
    const isLatest = date === latestDate
    const lastMod = new Date(`${date}T00:00:00-03:00`)
    for (const loc of locales) {
      entries.push({
        url: `${baseUrl}/${loc}/daily/${date}`,
        lastModified: lastMod,
        changeFrequency: 'monthly',
        priority: isLatest ? 0.95 : 0.7,
        alternates: { languages: hreflang((l) => `/${l}/daily/${date}`) },
      })
    }
  }

  return entries
}
