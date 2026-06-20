/**
 * Ferramentas (function-calling) do chatbot AFOS-Analytics.
 *
 * Cada ferramenta bate DIRETO nas libs internas do projeto (sem auto-HTTP):
 *   - get_live_market_odds   → Polymarket (client com circuit breaker)
 *   - search_brazil_polls    → pesquisas TSE registradas (Prisma/Neon)
 *   - get_validated_cases    → casos validados + divergência (lib/country-data)
 *   - get_latest_news        → Google News RSS (notícias eleitorais)
 *   - get_afos_daily_latest  → última edição do AFOS Daily (loader)
 *
 * Toda resposta inclui um campo `source` para o agente poder CITAR a origem.
 * Os executores nunca lançam: em erro retornam { error } para o modelo se
 * recuperar (ex.: tentar outra ferramenta ou avisar o usuário).
 */

import type { ToolSpec } from './openrouter'
import { prisma } from '../db'
import { COUNTRY_DIVERGENCE, getCountryDivergence } from '../country-data'
import { getLatestDate, loadDaily } from '../afos-daily/loader'
import { fetchEventsBySlugs } from '../../app/lib/polymarket/client'
import { ELECTION_REGISTRY } from '../../app/lib/polymarket/country-market-map'

export interface ToolContext {
  /** Locale da conversa — escolhe o idioma de headlines/queries de notícia. */
  locale: 'pt-BR' | 'en' | 'es'
}

// ─── Especificações expostas ao modelo ─────────────────────────────

export const TOOL_SPECS: ToolSpec[] = [
  {
    type: 'function',
    function: {
      name: 'get_live_market_odds',
      description:
        'Odds AO VIVO do Polymarket (probabilidades implícitas dos mercados de previsão). ' +
        'Use para a eleição presidencial brasileira de 2026 e outros mercados (Senado, STF, inflação) ' +
        'ou para outros países cobertos. Retorna probabilidade (%) e volume (US$) por desfecho.',
      parameters: {
        type: 'object',
        properties: {
          country: {
            type: 'string',
            description:
              'Filtro opcional por país: código ISO-3 (ex.: "BRA", "COL", "USA") ou nome em inglês. ' +
              'Omitir = mercados do Brasil (padrão).',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_brazil_polls',
      description:
        'Pesquisas eleitorais brasileiras registradas no TSE (dados oficiais ingeridos pelo AFOS). ' +
        'Retorna instituto, datas, credibilidade e os percentuais normalizados por candidato.',
      parameters: {
        type: 'object',
        properties: {
          days: {
            type: 'number',
            description: 'Janela em dias para trás (padrão 30, máximo 365).',
          },
          institute: {
            type: 'string',
            description: 'Filtro opcional por instituto (ex.: "Quaest", "Datafolha").',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_validated_cases',
      description:
        'CASOS VALIDADOS do AFOS — o coração da tese: divergência mercado×pesquisa medida contra o ' +
        'RESULTADO REAL de eleições já realizadas (Brasil, Peru, Colômbia, Chile, Alemanha, Canadá, ' +
        'Reino Unido, México, EUA 2024). Sem argumento: lista resumo de todos. Com iso3: detalhe completo ' +
        '(divergência por candidato, headline, status). A divergência é o SINAL; o validador é o resultado real ' +
        '(pode ser alta divergência OU convergência quase nula).',
      parameters: {
        type: 'object',
        properties: {
          iso3: {
            type: 'string',
            description: 'Código ISO-3 do país (ex.: "USA", "PER", "COL", "DEU", "CAN", "GBR", "MEX", "CHL"). Omitir = resumo de todos.',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_latest_news',
      description:
        'Últimas manchetes da imprensa sobre as eleições brasileiras de 2026 (via Google News RSS). ' +
        'Use para contexto factual recente. Sempre cite o veículo e o link.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Termo de busca opcional (ex.: "Banco Master", "STF impeachment"). Omitir = panorama eleitoral geral.',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_afos_daily_latest',
      description:
        'Metadados da edição mais recente do AFOS Daily (síntese diária do projeto): data, título e lede. ' +
        'Use quando o usuário perguntar "o que houve hoje/recente" ou pedir a leitura do dia.',
      parameters: { type: 'object', properties: {} },
    },
  },
]

// ─── Helpers ────────────────────────────────────────────────────────

function pickLocale(rec: Record<string, string> | undefined, locale: string): string | undefined {
  if (!rec) return undefined
  return rec[locale] ?? rec['en'] ?? rec['pt-BR'] ?? Object.values(rec)[0]
}

function round1(n: number): number {
  return Math.round(n * 1000) / 10 // 0.4231 → 42.3
}

// ─── Executores ──────────────────────────────────────────────────────

// Forma normalizada, comum às duas fontes (gamma direto × proxy de produção).
interface NormEvent {
  title: string
  markets: Array<{ question: string; yesPrice: number; volume: number }>
}

/** Fonte canônica (produção): gamma-api via client com circuit breaker. */
async function fetchOddsFromGamma(slugs: string[]): Promise<Map<string, NormEvent>> {
  const events = await fetchEventsBySlugs(slugs)
  const out = new Map<string, NormEvent>()
  for (const [slug, ev] of events) {
    out.set(slug, {
      title: ev.title,
      markets: ev.markets.map((m) => ({ question: m.question, yesPrice: m.yesPrice, volume: m.volume })),
    })
  }
  return out
}

/**
 * Fallback de DEV: o gamma-api costuma ser instável no ambiente local (a rota
 * /api/polymarket usa o mesmo proxy). Puxa os mercados do Brasil já agregados
 * de produção. Só cobre os slugs do Brasil expostos por aquela rota; os demais
 * caem no gamma. NUNCA usado em produção.
 */
async function fetchOddsFromProdProxy(slugs: string[]): Promise<Map<string, NormEvent>> {
  const out = new Map<string, NormEvent>()
  // Hardcoded em produção de propósito: o objetivo é alcançar o gamma JÁ agregado
  // por prod a partir do dev (usar NEXT_PUBLIC_BASE_URL poderia apontar p/ localhost → loop).
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 12_000)
  try {
    const res = await fetch('https://www.afos-analytics.com/api/polymarket', { headers: { Accept: 'application/json' }, signal: controller.signal })
    if (!res.ok) return out
    const data = (await res.json()) as Record<string, { title?: string; slug?: string; markets?: Array<Record<string, unknown>> }>
    const want = new Set(slugs)
    for (const value of Object.values(data)) {
      if (!value || typeof value !== 'object' || !value.slug || !want.has(value.slug)) continue
      const markets = (value.markets || []).map((m) => {
        const prices = Array.isArray(m.outcomePrices) ? (m.outcomePrices as unknown[]) : []
        return {
          question: String(m.question ?? ''),
          yesPrice: Number(prices[0]) || 0,
          volume: Number(m.volumeNum) || 0,
        }
      })
      out.set(value.slug, { title: String(value.title ?? ''), markets })
    }
  } catch {
    // silencioso — cai no gamma
  } finally {
    clearTimeout(timeout)
  }
  return out
}

async function execMarketOdds(args: { country?: string }): Promise<unknown> {
  const country = (args.country || 'BRA').trim().toUpperCase()
  // Aceita ISO-3 ou nome em inglês.
  const entries = ELECTION_REGISTRY.filter((e) => {
    if (!e.enabled) return false
    return e.iso3.toUpperCase() === country || e.countryName.toUpperCase().includes(country)
  })
  const target = entries.length > 0 ? entries : ELECTION_REGISTRY.filter((e) => e.enabled && e.iso3 === 'BRA')
  const slugs = target.slice(0, 6).map((e) => e.slug)

  // DEV: tenta o proxy de produção primeiro (gamma local é instável). PROD: só gamma.
  const events = new Map<string, NormEvent>()
  let viaProxy = false
  if (process.env.NODE_ENV === 'development') {
    const proxied = await fetchOddsFromProdProxy(slugs)
    for (const [k, v] of proxied) events.set(k, v)
    viaProxy = proxied.size > 0
  }
  const missing = slugs.filter((s) => !events.has(s))
  if (missing.length > 0) {
    try {
      const gamma = await fetchOddsFromGamma(missing)
      for (const [k, v] of gamma) events.set(k, v)
    } catch (err) {
      console.error('[chat-tool:odds] gamma fetch failed:', err)
    }
  }

  const markets = target
    .map((entry) => {
      const ev = events.get(entry.slug)
      if (!ev) return null
      const outcomes = ev.markets
        .map((m) => ({
          outcome: m.question,
          probability_pct: round1(m.yesPrice),
          volume_usd: Math.round(m.volume),
        }))
        .sort((a, b) => b.probability_pct - a.probability_pct)
        .slice(0, 15) // top 15 — corta o ruído de candidatos ~0%
      return {
        country: entry.countryName,
        iso3: entry.iso3,
        election_type: entry.electionType,
        market_title: ev.title,
        outcomes,
      }
    })
    .filter(Boolean)

  if (markets.length === 0) {
    return { error: 'no_market_data', note: 'Nenhum mercado retornou dados (upstream indisponível ou país sem cobertura).' }
  }
  return {
    source: viaProxy
      ? 'Polymarket (via cache de produção AFOS) — probabilidades implícitas, não previsões oficiais'
      : 'Polymarket (gamma-api.polymarket.com) — probabilidades implícitas, não previsões oficiais',
    fetched_at: new Date().toISOString(),
    markets,
  }
}

async function execBrazilPolls(args: { days?: number; institute?: string }): Promise<unknown> {
  if (!prisma) return { error: 'database_unavailable' }
  const daysRaw = Number(args.days)
  const days = Number.isFinite(daysRaw) && daysRaw > 0 ? Math.min(daysRaw, 365) : 30
  const institute = args.institute?.trim().slice(0, 100)
  const since = new Date()
  since.setDate(since.getDate() - days)

  try {
    const findings = await prisma.researchFinding.findMany({
      where: {
        countryCode: 'BRA',
        createdAt: { gte: since },
        ...(institute ? { source: { name: { startsWith: institute, mode: 'insensitive' } } } : {}),
      },
      select: {
        title: true,
        normalizedPayload: true,
        confidenceScore: true,
        eventDate: true,
        source: { select: { name: true, credibilityScore: true } },
      },
      orderBy: { eventDate: 'desc' },
      take: 30,
    })
    return {
      source: 'Pesquisas registradas no TSE, ingeridas pelo AFOS-Analytics (Neon/Prisma)',
      total: findings.length,
      days,
      polls: findings.map((f) => ({
        protocolo: f.title,
        institute: f.source?.name,
        credibility: f.source?.credibilityScore,
        confidence: f.confidenceScore,
        publicationDate: f.eventDate,
        data: f.normalizedPayload,
      })),
    }
  } catch (err) {
    console.error('[chat-tool:polls] error:', err)
    return { error: 'query_failed' }
  }
}

function execValidatedCases(args: { iso3?: string }, ctx: ToolContext): unknown {
  if (args.iso3) {
    const iso3 = args.iso3.trim().toUpperCase()
    const c = getCountryDivergence(iso3)
    if (!c) {
      return {
        error: 'country_not_validated',
        available: Object.keys(COUNTRY_DIVERGENCE),
        note: 'País sem caso validado. Use um dos ISO-3 listados em "available".',
      }
    }
    return {
      source: `Dataset AFOS-Analytics1/${iso3.toLowerCase()}-2026-electoral-divergence (HF) · validado pelo resultado real`,
      iso3: c.iso3,
      election: c.election,
      headline: pickLocale(c.headline, ctx.locale),
      polls_count: c.polls_count,
      market_candidates: c.market_candidates,
      latest_poll: c.latest_poll,
      divergence_rows: c.rows.map((r) => ({
        candidate: r.candidate,
        poll_pct: r.poll_pct,
        market_pct: r.market_pct,
        divergence_pp: r.divergence_pp,
        note: pickLocale(r.note, ctx.locale),
      })),
      market_snapshot: c.market_snapshot,
    }
  }
  // Resumo de todos os casos validados.
  return {
    source: 'Casos validados AFOS — divergência mercado×pesquisa contra o resultado real',
    note: 'A divergência é o SINAL (pode ser alta OU quase nula); o VALIDADOR é o resultado real da eleição.',
    cases: Object.entries(COUNTRY_DIVERGENCE).map(([iso3, c]) => ({
      iso3,
      matchup: c.election.matchup,
      status: c.election.status,
      headline: pickLocale(c.headline, ctx.locale),
      polls_count: c.polls_count,
      max_divergence_pp: c.rows.reduce((mx, r) => Math.max(mx, Math.abs(r.divergence_pp)), 0),
    })),
  }
}

async function execLatestNews(args: { query?: string }, ctx: ToolContext): Promise<unknown> {
  const localeCfg: Record<string, { hl: string; gl: string; ceid: string; q: string }> = {
    'pt-BR': { hl: 'pt-BR', gl: 'BR', ceid: 'BR:pt-419', q: 'eleições 2026 presidente Brasil' },
    en: { hl: 'en-US', gl: 'US', ceid: 'US:en', q: 'Brazil 2026 presidential election' },
    es: { hl: 'es-419', gl: 'US', ceid: 'US:es-419', q: 'elecciones Brasil 2026 presidente' },
  }
  const cfg = localeCfg[ctx.locale] ?? localeCfg['pt-BR']
  const query = (args.query?.trim() || cfg.q).slice(0, 120)
  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${cfg.hl}&gl=${cfg.gl}&ceid=${cfg.ceid}`

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10_000)
    const res = await fetch(rssUrl, { signal: controller.signal })
    clearTimeout(timeout)
    if (!res.ok) return { error: `news_http_${res.status}` }
    const xml = await res.text()

    const items: Array<{ title: string; source: string; url: string; date: string }> = []
    const parts = xml.split('<item>')
    for (let i = 1; i < parts.length && items.length < 8; i++) {
      const block = parts[i]
      const title = block.match(/<title>([^<]+)<\/title>/)?.[1]?.trim() || ''
      const link = block.match(/<link>([^<]+)<\/link>/)?.[1]?.trim() || ''
      const pub = block.match(/<pubDate>([^<]+)<\/pubDate>/)?.[1]?.trim() || ''
      const src = block.match(/<source[^>]*>([^<]+)<\/source>/)?.[1]?.trim() || ''
      if (title && title !== 'Google News' && title !== 'Google Notícias') {
        items.push({
          title: title.replace(/ - [^-]+$/, '').trim(),
          source: src || title.split(' - ').pop() || 'Google News',
          url: link,
          date: pub,
        })
      }
    }
    if (items.length === 0) return { error: 'no_news_found', query }
    return {
      source: 'Google News RSS — manchetes da imprensa; cite o veículo e o link',
      query,
      items,
    }
  } catch (err) {
    console.error('[chat-tool:news] error:', err)
    return { error: 'news_fetch_failed' }
  }
}

function execAfosDailyLatest(ctx: ToolContext): unknown {
  try {
    const date = getLatestDate()
    if (!date) return { error: 'no_daily' }
    const data = loadDaily(date, ctx.locale)
    if (!data) return { error: 'load_failed' }
    return {
      source: 'AFOS Daily — síntese editorial diária do projeto',
      date: data.date,
      title: data.title,
      lede: data.lede,
      read_url: `/${ctx.locale}/daily`,
    }
  } catch (err) {
    console.error('[chat-tool:daily] error:', err)
    return { error: 'daily_failed' }
  }
}

// ─── Dispatcher ──────────────────────────────────────────────────────

export async function executeTool(name: string, rawArgs: string, ctx: ToolContext): Promise<unknown> {
  let args: Record<string, unknown> = {}
  try {
    args = rawArgs ? JSON.parse(rawArgs) : {}
  } catch {
    return { error: 'invalid_arguments', note: 'Os argumentos não eram JSON válido.' }
  }
  switch (name) {
    case 'get_live_market_odds':
      return execMarketOdds(args as { country?: string })
    case 'search_brazil_polls':
      return execBrazilPolls(args as { days?: number; institute?: string })
    case 'get_validated_cases':
      return execValidatedCases(args as { iso3?: string }, ctx)
    case 'get_latest_news':
      return execLatestNews(args as { query?: string }, ctx)
    case 'get_afos_daily_latest':
      return execAfosDailyLatest(ctx)
    default:
      return { error: 'unknown_tool', name }
  }
}
