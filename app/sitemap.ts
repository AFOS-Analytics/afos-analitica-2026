import type { MetadataRoute } from 'next'
import { COUNTRIES_SEO } from '../lib/seo/countries'
import { listPublishedDailies, dailyExists } from '../lib/afos-daily/loader'
import { listPublishedTradeoffs, tradeoffExists } from '../lib/afos-tradeoff/loader'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.afos-analytics.com'
  const locales = ['pt-BR', 'en', 'es']
  // dynamic: páginas com cron a cada 30min (landing, dashboard, global, daily index)
  const dynamicLastMod = new Date()
  // static: páginas institucionais sem mudança frequente. Atualizar manualmente
  // quando houver redesign/conteúdo novo. Evita rebanhar tudo a cada deploy.
  const staticLastMod = new Date('2026-05-03T00:00:00-03:00')
  const entries: MetadataRoute.Sitemap = []

  // Hoisted: drive the /daily and /tradeoff index lastmod from the latest edition
  // date (it only moves when a real new edition lands — not every crawl).
  const dailyDates = listPublishedDailies()
  const latestDate = dailyDates.length ? dailyDates[dailyDates.length - 1] : null
  const tradeoffDates = listPublishedTradeoffs()
  const tradeoffDatesUs = listPublishedTradeoffs('us')
  const latestTradeoff = tradeoffDates.length ? tradeoffDates[tradeoffDates.length - 1] : null
  const dailyIndexLastMod = latestDate ? new Date(`${latestDate}T00:00:00-03:00`) : dynamicLastMod
  const tradeoffIndexLastMod = latestTradeoff ? new Date(`${latestTradeoff}T00:00:00-03:00`) : dynamicLastMod

  function hreflang(path: (loc: string) => string, xDefault?: string) {
    const languages: Record<string, string> = {}
    for (const loc of locales) languages[loc] = `${baseUrl}${path(loc)}`
    languages['x-default'] = xDefault || `${baseUrl}${path('pt-BR')}`
    return languages
  }

  // Like hreflang but only declares locales whose localized file actually exists
  // — keeps the per-edition sitemap hreflang identical to the page's truthful guard.
  function hreflangIf(path: (loc: string) => string, includes: (loc: string) => boolean) {
    const languages: Record<string, string> = {}
    let xDefault: string | null = null
    for (const loc of locales) {
      if (!includes(loc)) continue
      languages[loc] = `${baseUrl}${path(loc)}`
      if (loc === 'pt-BR') xDefault = languages[loc]
      else if (!xDefault) xDefault = languages[loc]
    }
    if (xDefault) languages['x-default'] = xDefault
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

  // Dashboard por país: /pt-BR/dashboard/br e /pt-BR/dashboard/us
  // O endereço canônico passou a ter país. O /dashboard sem país continua vivo por
  // redirecionamento, mas NÃO entra no sitemap: sitemap lista destino final, não atalho.
  // O Brasil vem primeiro e com prioridade maior porque tem urna em 2026 e cron de
  // 30min; o dos EUA atualiza em ritmo diário até as midterms de 03/11/2026.
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}/dashboard/br`,
      lastModified: dynamicLastMod,
      changeFrequency: 'hourly',
      priority: 0.95,
      alternates: { languages: hreflang((l) => `/${l}/dashboard/br`) },
    })
  }
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}/dashboard/us`,
      lastModified: dynamicLastMod,
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: { languages: hreflang((l) => `/${l}/dashboard/us`) },
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
        alternates: { languages: hreflang((l) => `/${l}/country/${country.slug[l]}`) },
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
          alternates: { languages: hreflang((l) => `/${l}/election/${election.slug}`) },
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
        alternates: { languages: hreflang((l) => `/${l}/${region}`) },
      })
    }
  }

  // Institutional pages (static — só mudam em redesign)
  const institutional = ['for-investors', 'political-risk', 'election-intelligence', 'for-analysts', 'geopolitical-signals', 'emerging-markets-risk', 'global-election-calendar', 'data-sources']
  for (const page of institutional) {
    for (const loc of locales) {
      entries.push({
        url: `${baseUrl}/${loc}/${page}`,
        lastModified: staticLastMod,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: { languages: hreflang((l) => `/${l}/${page}`) },
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
      alternates: { languages: hreflang((l) => `/${l}/how-it-works`) },
    })
  }

  // Methodology — Automated Governance (static)
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}/methodology/automated-governance`,
      lastModified: staticLastMod,
      changeFrequency: 'monthly',
      priority: 0.75,
      alternates: { languages: hreflang((l) => `/${l}/methodology/automated-governance`) },
    })
  }

  // White Paper — project goals and method (static, citable research artifact)
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}/white-paper`,
      lastModified: staticLastMod,
      changeFrequency: 'monthly',
      priority: 0.85,
      alternates: { languages: hreflang((l) => `/${l}/white-paper`) },
    })
  }

  // AFOS Daily — synthesis index per locale (dynamic — sempre nova daily)
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}/daily`,
      lastModified: dailyIndexLastMod,
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

  // Chat — conversational agent page (indexable, linked from header)
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}/chat`,
      lastModified: staticLastMod,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: hreflang((l) => `/${l}/chat`) },
    })
  }

  // Legal pages — indexable + linked from footer (priority baixa, mudam raramente)
  for (const page of ['privacy', 'terms']) {
    for (const loc of locales) {
      entries.push({
        url: `${baseUrl}/${loc}/${page}`,
        lastModified: staticLastMod,
        changeFrequency: 'yearly',
        priority: 0.3,
        alternates: { languages: hreflang((l) => `/${l}/${page}`) },
      })
    }
  }

  // AFOS Daily — permalinks per date (3 locales × N dates)
  // Latest date gets higher priority. Each entry's lastModified = the date.
  // Published-only filter: drafts must not be discoverable via sitemap.
  for (const date of dailyDates) {
    const isLatest = date === latestDate
    const lastMod = new Date(`${date}T00:00:00-03:00`)
    for (const loc of locales) {
      entries.push({
        url: `${baseUrl}/${loc}/daily/${date}`,
        lastModified: lastMod,
        changeFrequency: 'monthly',
        priority: isLatest ? 0.95 : 0.7,
        alternates: { languages: hreflangIf((l) => `/${l}/daily/${date}`, (loc) => dailyExists(date, loc)) },
      })
    }
  }

  // AFOS Tradeoff — weekly synthesis index per locale
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}/tradeoff/br`,
      lastModified: tradeoffIndexLastMod,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: { languages: hreflang((l) => `/${l}/tradeoff/br`) },
    })
  }

  // AFOS Tradeoff — permalinks per edition (3 locales × N editions)
  // Latest edition gets higher priority. Published-only filter.
  // Tradeoff dos EUA. Entrou no sitemap em 31/Jul, junto com a publicação da
  // Edição №1. O índice `/tradeoff/us` e cada edição, com hreflang só para os
  // idiomas que existem em disco.
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}/tradeoff/us`,
      lastModified: tradeoffDatesUs.length ? new Date(`${tradeoffDatesUs[tradeoffDatesUs.length - 1]}T00:00:00-03:00`) : dynamicLastMod,
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: { languages: hreflang((l) => `/${l}/tradeoff/us`) },
    })
  }
  for (const date of tradeoffDatesUs) {
    for (const loc of locales) {
      entries.push({
        url: `${baseUrl}/${loc}/tradeoff/us/${date}`,
        lastModified: new Date(`${date}T00:00:00-03:00`),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: { languages: hreflangIf((l) => `/${l}/tradeoff/us/${date}`, (loc) => tradeoffExists(date, loc, 'us')) },
      })
    }
  }

  for (const date of tradeoffDates) {
    const isLatest = date === latestTradeoff
    const lastMod = new Date(`${date}T00:00:00-03:00`)
    for (const loc of locales) {
      entries.push({
        url: `${baseUrl}/${loc}/tradeoff/br/${date}`,
        lastModified: lastMod,
        changeFrequency: 'monthly',
        priority: isLatest ? 0.95 : 0.7,
        alternates: { languages: hreflangIf((l) => `/${l}/tradeoff/br/${date}`, (loc) => tradeoffExists(date, loc)) },
      })
    }
  }

  return entries
}
