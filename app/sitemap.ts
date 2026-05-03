import type { MetadataRoute } from 'next'
import { COUNTRIES_SEO } from '../lib/seo/countries'
import { listPublishedDailies } from '../lib/afos-daily/loader'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://afos-analytics.com'
  const locales = ['pt-BR', 'en', 'es']
  // dynamic: páginas com cron a cada 30min (landing, dashboard, global, daily index)
  const dynamicLastMod = new Date()
  // static: páginas institucionais sem mudança frequente. Atualizar manualmente
  // quando houver redesign/conteúdo novo. Evita rebanhar tudo a cada deploy.
  const staticLastMod = new Date('2026-05-03T00:00:00-03:00')
  const entries: MetadataRoute.Sitemap = []

  function hreflang(path: (loc: string) => string, xDefault?: string) {
    const languages: Record<string, string> = {}
    for (const loc of locales) languages[loc] = `${baseUrl}${path(loc)}`
    languages['x-default'] = xDefault || `${baseUrl}${path('pt-BR')}`
    return languages
  }

  // Landing page: /pt-BR, /en, /es (dynamic — cron 30min)
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}`,
      lastModified: dynamicLastMod,
      changeFrequency: 'hourly',
      priority: 1,
      alternates: { languages: hreflang((l) => `/${l}`) },
    })
  }

  // Dashboard: /pt-BR/dashboard (dynamic — cron 30min)
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}/dashboard`,
      lastModified: dynamicLastMod,
      changeFrequency: 'hourly',
      priority: 0.95,
      alternates: { languages: hreflang((l) => `/${l}/dashboard`) },
    })
  }

  // Global map: /pt-BR/global (dynamic — cron 30min)
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}/global`,
      lastModified: dynamicLastMod,
      changeFrequency: 'hourly',
      priority: 0.9,
      alternates: { languages: hreflang((l) => `/${l}/global`) },
    })
  }

  // Country pages: /[locale]/country/[country] (static template, dados via fetch)
  for (const country of COUNTRIES_SEO) {
    for (const loc of locales) {
      entries.push({
        url: `${baseUrl}/${loc}/country/${country.slug[loc]}`,
        lastModified: staticLastMod,
        changeFrequency: 'daily',
        priority: 0.8,
        alternates: { languages: hreflang((l) => `/${l}/country/${country.slug[l]}`, `${baseUrl}/en/country/${country.slug['en']}`) },
      })
    }
  }

  // Election pages: /[locale]/election/[slug]
  // Active elections marcam como dynamic (mudam frequentemente); outras static.
  for (const country of COUNTRIES_SEO) {
    for (const election of country.elections) {
      const isActive = election.status === 'active'
      for (const loc of locales) {
        entries.push({
          url: `${baseUrl}/${loc}/election/${election.slug}`,
          lastModified: isActive ? dynamicLastMod : staticLastMod,
          changeFrequency: isActive ? 'hourly' : 'daily',
          priority: isActive ? 0.9 : 0.7,
          alternates: { languages: hreflang((l) => `/${l}/election/${election.slug}`, `${baseUrl}/en/election/${election.slug}`) },
        })
      }
    }
  }

  // Region pages (static template)
  const regions = ['eu', 'latam']
  for (const region of regions) {
    for (const loc of locales) {
      entries.push({
        url: `${baseUrl}/${loc}/${region}`,
        lastModified: staticLastMod,
        changeFrequency: 'daily',
        priority: 0.85,
        alternates: { languages: hreflang((l) => `/${l}/${region}`, `${baseUrl}/en/${region}`) },
      })
    }
  }

  // Institutional pages (static — só mudam em redesign)
  const institutional = ['for-investors', 'political-risk', 'election-intelligence', 'for-analysts', 'geopolitical-signals', 'emerging-markets-risk', 'global-election-calendar']
  for (const page of institutional) {
    for (const loc of locales) {
      entries.push({
        url: `${baseUrl}/${loc}/${page}`,
        lastModified: staticLastMod,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: { languages: hreflang((l) => `/${l}/${page}`, `${baseUrl}/en/${page}`) },
      })
    }
  }

  // How it works (static didactic guide)
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}/how-it-works`,
      lastModified: staticLastMod,
      changeFrequency: 'weekly',
      priority: 0.85,
      alternates: { languages: hreflang((l) => `/${l}/how-it-works`, `${baseUrl}/en/how-it-works`) },
    })
  }

  // Methodology — Automated Governance (static)
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}/methodology/automated-governance`,
      lastModified: staticLastMod,
      changeFrequency: 'monthly',
      priority: 0.75,
      alternates: { languages: hreflang((l) => `/${l}/methodology/automated-governance`, `${baseUrl}/en/methodology/automated-governance`) },
    })
  }

  // AFOS Daily — synthesis index per locale (dynamic — sempre nova daily)
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}/daily`,
      lastModified: dynamicLastMod,
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: { languages: hreflang((l) => `/${l}/daily`) },
    })
  }

  // Glossary (static template, conteúdo evolui ocasionalmente)
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}/glossary`,
      lastModified: staticLastMod,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: hreflang((l) => `/${l}/glossary`) },
    })
  }

  // About — institutional Organization page (E-E-A-T, GEO trust signal)
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}/about`,
      lastModified: staticLastMod,
      changeFrequency: 'monthly',
      priority: 0.85,
      alternates: { languages: hreflang((l) => `/${l}/about`) },
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
