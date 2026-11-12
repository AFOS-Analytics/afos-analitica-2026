import type { MetadataRoute } from 'next'
import { COUNTRIES_SEO } from '../lib/seo/countries'
import { RELATORIO_LOCALES, relatorioExiste } from '../lib/relatorio-final/loader'
import { listPublishedDailies, dailyExists } from '../lib/afos-daily/loader'
import { listPublishedTradeoffs, tradeoffExists, PAISES_TRADEOFF, PAIS_PADRAO } from '../lib/afos-tradeoff/loader'
import { listPublishedWeeklies, weeklyExistsStrict, PAISES_WEEKLY } from '../lib/afos-weekly/loader'
import { paineisOrdenados } from '../lib/paineis.mjs'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.afos-analytics.com'
  const locales = ['pt-BR', 'en', 'es']
  // dynamic: páginas com cron a cada 30min (landing, painel ao vivo, global)
  const dynamicLastMod = new Date()
  // static: data padrão das páginas sem mudança de conteúdo desde 03/Mai/2026.
  const staticLastMod = new Date('2026-05-03T00:00:00-03:00')
  // Data da ÚLTIMA mudança de conteúdo de cada página estática. ⚠️ Subir a data
  // daqui no MESMO commit que mexe no texto da página; página fora do mapa usa
  // `staticLastMod`. Datas conferidas no `git log` em 12/Nov/2026.
  const STATIC_LASTMOD: Record<string, string> = {
    'white-paper': '2026-08-23',
    country: '2026-08-19',
    'data-sources': '2026-08-19',
    'methodology/automated-governance': '2026-08-19',
    'how-it-works': '2026-11-12',
    glossary: '2026-11-12',
    privacy: '2026-06-21',
    chat: '2026-06-20',
  }
  const lastModDe = (page: string) =>
    STATIC_LASTMOD[page] ? new Date(`${STATIC_LASTMOD[page]}T00:00:00-03:00`) : staticLastMod
  const entries: MetadataRoute.Sitemap = []

  // Hoisted: drive the /daily and /tradeoff index lastmod from the latest edition
  // date (it only moves when a real new edition lands — not every crawl).
  const dailyDates = listPublishedDailies()
  const latestDate = dailyDates.length ? dailyDates[dailyDates.length - 1] : null
  const tradeoffDates = listPublishedTradeoffs()
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

  // Dashboard por país: /[idioma]/dashboard/{br,us,fr}
  // O endereço canônico tem país. O /dashboard sem país continua vivo por
  // redirecionamento, mas NÃO entra no sitemap: sitemap lista destino final, não atalho.
  // Estado, ordem e peso saem de `lib/paineis.mjs` (lugar único desde 12/Nov/2026):
  // painel AO VIVO tem coleta a cada 30 min, então lastmod de agora, 'hourly' e 0.95;
  // painel ENCERRADO tem lastmod na data de encerramento, 'monthly' e 0.7.
  for (const painel of paineisOrdenados()) {
    const vivo = painel.estado === 'ao-vivo'
    const lastModified = !vivo && painel.encerradoEm
      ? new Date(`${painel.encerradoEm}T00:00:00-03:00`)
      : dynamicLastMod
    for (const loc of locales) {
      entries.push({
        url: `${baseUrl}/${loc}/dashboard/${painel.code}`,
        lastModified,
        changeFrequency: vivo ? 'hourly' : 'monthly',
        priority: vivo ? 0.95 : 0.7,
        alternates: { languages: hreflang((l) => `/${l}/dashboard/${painel.code}`) },
      })
    }
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
        lastModified: lastModDe('country'),
        changeFrequency: 'daily',
        priority: 0.8,
        alternates: { languages: hreflang((l) => `/${l}/country/${country.slug[l]}`) },
      })
    }
  }

  // Election pages: /[locale]/election/[slug]
  // Eleição 'active' com data por vir é dynamic. Eleição com data já passada não é
  // dynamic, mesmo marcada 'active' em countries.ts (o campo vira selo visível, por
  // isso não se mexe nele aqui): lastmod na data da eleição e 'monthly'. Demais, static.
  const hoje = new Date().toISOString().slice(0, 10)
  for (const country of COUNTRIES_SEO) {
    for (const election of country.elections) {
      const passou = election.date < hoje
      const isActive = election.status === 'active' && !passou
      const dataEleicao = new Date(`${election.date}T00:00:00-03:00`)
      const lastModified = isActive
        ? dynamicLastMod
        : passou && election.status === 'active' && dataEleicao > staticLastMod
          ? dataEleicao
          : staticLastMod
      for (const loc of locales) {
        entries.push({
          url: `${baseUrl}/${loc}/election/${election.slug}`,
          lastModified,
          changeFrequency: isActive ? 'hourly' : passou ? 'monthly' : 'daily',
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
        lastModified: lastModDe(page),
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
      lastModified: lastModDe('how-it-works'),
      changeFrequency: 'weekly',
      priority: 0.85,
      alternates: { languages: hreflang((l) => `/${l}/how-it-works`) },
    })
  }

  // Methodology — Automated Governance (static)
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}/methodology/automated-governance`,
      lastModified: lastModDe('methodology/automated-governance'),
      changeFrequency: 'monthly',
      priority: 0.75,
      alternates: { languages: hreflang((l) => `/${l}/methodology/automated-governance`) },
    })
  }

  // White Paper — project goals and method (static, citable research artifact)
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}/white-paper`,
      lastModified: lastModDe('white-paper'),
      changeFrequency: 'monthly',
      priority: 0.85,
      alternates: { languages: hreflang((l) => `/${l}/white-paper`) },
    })
  }

  // Relatório de fechamento Brasil 2026: só os idiomas com o HTML publicado
  {
    const rel = RELATORIO_LOCALES.filter((l) => relatorioExiste(l))
    for (const loc of rel) {
      entries.push({
        url: `${baseUrl}/${loc}/report/brazil-2026`,
        lastModified: new Date('2026-10-31T23:59:00-03:00'),
        changeFrequency: 'monthly',
        priority: 0.9,
        alternates: { languages: Object.fromEntries(rel.map((l) => [l, `${baseUrl}/${l}/report/brazil-2026`])) },
      })
    }
  }

  // Relatório de fechamento EUA 2026 (06/11/2026): só os idiomas com o HTML publicado
  {
    const rel = RELATORIO_LOCALES.filter((l) => relatorioExiste(l, 'usa-2026'))
    for (const loc of rel) {
      entries.push({
        url: `${baseUrl}/${loc}/report/usa-2026`,
        lastModified: new Date('2026-11-06T18:00:00-03:00'),
        changeFrequency: 'monthly',
        priority: 0.9,
        alternates: { languages: Object.fromEntries(rel.map((l) => [l, `${baseUrl}/${l}/report/usa-2026`])) },
      })
    }
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
      lastModified: lastModDe('glossary'),
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
      lastModified: lastModDe('chat'),
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
        lastModified: lastModDe(page),
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

  // AFOS Tradeoff dos demais países (EUA desde 31/Jul; França a partir da №1).
  // Laço sobre PAISES_TRADEOFF: país novo no loader entra aqui sem editar este
  // arquivo. O índice `/tradeoff/{país}` só entra quando há ao menos uma edição
  // publicada; cada edição leva hreflang só dos idiomas que existem em disco.
  for (const pais of PAISES_TRADEOFF) {
    if (pais === PAIS_PADRAO) continue // Brasil: blocos próprios, acima e abaixo
    const datas = listPublishedTradeoffs(pais)
    if (!datas.length) continue
    for (const loc of locales) {
      entries.push({
        url: `${baseUrl}/${loc}/tradeoff/${pais}`,
        lastModified: new Date(`${datas[datas.length - 1]}T00:00:00-03:00`),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: { languages: hreflang((l) => `/${l}/tradeoff/${pais}`) },
      })
    }
    for (const date of datas) {
      for (const loc of locales) {
        entries.push({
          url: `${baseUrl}/${loc}/tradeoff/${pais}/${date}`,
          lastModified: new Date(`${date}T00:00:00-03:00`),
          changeFrequency: 'monthly',
          priority: 0.6,
          alternates: { languages: hreflangIf((l) => `/${l}/tradeoff/${pais}/${date}`, (loc) => tradeoffExists(date, loc, pais)) },
        })
      }
    }
  }

  // AFOS Weekly: índice e permalinks por edição, para cada país de PAISES_WEEKLY.
  // EUA entrou em 27/Ago/2026, junto com a saída do `noindex`. O índice
  // `/weekly/{país}` só entra quando há ao menos uma edição publicada.
  // 🔴 hreflang por `weeklyExistsStrict`, NUNCA por `weeklyExists`: o segundo
  // devolve `true` sempre, por causa da cascata para o inglês, e o sitemap
  // declararia traduções que não existem em disco.
  for (const pais of PAISES_WEEKLY) {
    const datas = listPublishedWeeklies(pais)
    if (!datas.length) continue
    for (const loc of locales) {
      entries.push({
        url: `${baseUrl}/${loc}/weekly/${pais}`,
        lastModified: new Date(`${datas[datas.length - 1]}T00:00:00-03:00`),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: { languages: hreflang((l) => `/${l}/weekly/${pais}`) },
      })
    }
    for (const date of datas) {
      for (const loc of locales) {
        entries.push({
          url: `${baseUrl}/${loc}/weekly/${pais}/${date}`,
          lastModified: new Date(`${date}T00:00:00-03:00`),
          changeFrequency: 'monthly',
          priority: 0.6,
          alternates: { languages: hreflangIf((l) => `/${l}/weekly/${pais}/${date}`, (loc) => weeklyExistsStrict(date, loc, pais)) },
        })
      }
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
