/**
 * Google Search Console API Client
 *
 * Autenticação via Service Account (JWT → Access Token).
 * Sem dependências externas — usa Node.js crypto nativo.
 *
 * Env vars necessárias:
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL   — email da service account
 *   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY — chave privada PEM (com \n escapados)
 *   GOOGLE_SEARCH_CONSOLE_SITE_URL — URL da propriedade no GSC (ex: https://afos-analytics.com)
 *
 * Setup:
 *   1. Google Cloud Console → criar Service Account
 *   2. Habilitar "Search Console API" no projeto
 *   3. GSC → Configurações → Usuários → adicionar email da service account como Proprietário
 */

import crypto from 'crypto'

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GSC_API = 'https://searchconsole.googleapis.com/webmasters/v3'
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly'

// ─── Token Cache (in-memory, 55 min TTL) ────────────────────────────

let cachedToken: { token: string; expiresAt: number } | null = null

// ─── Config ─────────────────────────────────────────────────────────

interface GSCConfig {
  email: string
  privateKey: string
  siteUrl: string
}

function getConfig(): GSCConfig | null {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  const site = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL

  if (!email || !key || !site) return null

  return { email, privateKey: key.replace(/\\n/g, '\n'), siteUrl: site }
}

export function isGSCConfigured(): boolean {
  return getConfig() !== null
}

// ─── JWT + Token Exchange ───────────────────────────────────────────

function createJWT(config: GSCConfig): string {
  const now = Math.floor(Date.now() / 1000)

  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({
    iss: config.email,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  })).toString('base64url')

  const signingInput = `${header}.${payload}`
  const signature = crypto.createSign('RSA-SHA256').update(signingInput).sign(config.privateKey, 'base64url')

  return `${signingInput}.${signature}`
}

async function getAccessToken(config: GSCConfig): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token
  }

  const jwt = createJWT(config)

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Google token exchange failed (${res.status}): ${error}`)
  }

  const data = await res.json() as { access_token: string; expires_in: number }
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000, // 5min de margem
  }

  return cachedToken.token
}

// ─── Search Analytics API ───────────────────────────────────────────

export type GSCDimension = 'query' | 'page' | 'country' | 'device' | 'date'

export interface GSCRow {
  keys: string[]
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export interface GSCQueryParams {
  startDate: string
  endDate: string
  dimensions?: GSCDimension[]
  rowLimit?: number
  dimensionFilterGroups?: Array<{
    filters: Array<{
      dimension: string
      operator: 'contains' | 'equals' | 'notContains' | 'notEquals' | 'includingRegex' | 'excludingRegex'
      expression: string
    }>
  }>
}

export interface GSCResult {
  rows: GSCRow[]
  responseAggregationType?: string
}

export async function querySearchAnalytics(params: GSCQueryParams): Promise<GSCResult> {
  const config = getConfig()
  if (!config) throw new Error('GSC not configured')

  const token = await getAccessToken(config)
  const encodedSite = encodeURIComponent(config.siteUrl)

  const res = await fetch(`${GSC_API}/sites/${encodedSite}/searchAnalytics/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      startDate: params.startDate,
      endDate: params.endDate,
      dimensions: params.dimensions || ['query'],
      rowLimit: params.rowLimit || 100,
      ...(params.dimensionFilterGroups && { dimensionFilterGroups: params.dimensionFilterGroups }),
    }),
    signal: AbortSignal.timeout(15000),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`GSC API error (${res.status}): ${error}`)
  }

  const data = await res.json() as GSCResult
  return { rows: data.rows || [], responseAggregationType: data.responseAggregationType }
}

// ─── Helpers ────────────────────────────────────────────────────────

export function formatDate(d: Date): string {
  return d.toISOString().split('T')[0]
}

function formatRow(r: GSCRow, keyName: string): Record<string, unknown> {
  return {
    [keyName]: r.keys[0],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: Math.round(r.ctr * 10000) / 100,
    position: Math.round(r.position * 10) / 10,
  }
}

/**
 * Busca completa: pages, queries, countries, trend diário, devices.
 * Roda 6 queries em paralelo (incluindo filtro especial para páginas de país).
 */
export async function fetchFullReport(days: number = 28) {
  const end = new Date()
  // GSC tem delay de ~2 dias nos dados
  end.setDate(end.getDate() - 2)
  const start = new Date(end.getTime() - days * 86400000)

  const startDate = formatDate(start)
  const endDate = formatDate(end)
  const base = { startDate, endDate }

  const [byPage, byQuery, byCountry, byDate, byDevice, countryPages] = await Promise.all([
    querySearchAnalytics({ ...base, dimensions: ['page'], rowLimit: 50 }),
    querySearchAnalytics({ ...base, dimensions: ['query'], rowLimit: 50 }),
    querySearchAnalytics({ ...base, dimensions: ['country'], rowLimit: 50 }),
    querySearchAnalytics({ ...base, dimensions: ['date'], rowLimit: 90 }),
    querySearchAnalytics({ ...base, dimensions: ['device'], rowLimit: 10 }),
    // Filtro especial: páginas de país (SEO GEO)
    querySearchAnalytics({
      ...base,
      dimensions: ['page'],
      rowLimit: 30,
      dimensionFilterGroups: [{
        filters: [{
          dimension: 'page',
          operator: 'includingRegex',
          expression: '/country/',
        }],
      }],
    }),
  ])

  const totalClicks = (byDate.rows).reduce((s, r) => s + r.clicks, 0)
  const totalImpressions = (byDate.rows).reduce((s, r) => s + r.impressions, 0)
  const avgPosition = byDate.rows.length > 0
    ? byDate.rows.reduce((s, r) => s + r.position, 0) / byDate.rows.length
    : 0

  return {
    period: { startDate, endDate, days },
    totals: {
      clicks: totalClicks,
      impressions: totalImpressions,
      ctr: totalImpressions > 0 ? Math.round((totalClicks / totalImpressions) * 10000) / 100 : 0,
      avgPosition: Math.round(avgPosition * 10) / 10,
    },
    pages: byPage.rows.map(r => formatRow(r, 'page')),
    queries: byQuery.rows.map(r => formatRow(r, 'query')),
    countries: byCountry.rows.map(r => formatRow(r, 'country')),
    trend: byDate.rows.map(r => formatRow(r, 'date')),
    devices: byDevice.rows.map(r => formatRow(r, 'device')),
    seoGeo: {
      countryPages: countryPages.rows.map(r => formatRow(r, 'page')),
      totalClicks: countryPages.rows.reduce((s, r) => s + r.clicks, 0),
      totalImpressions: countryPages.rows.reduce((s, r) => s + r.impressions, 0),
    },
  }
}
