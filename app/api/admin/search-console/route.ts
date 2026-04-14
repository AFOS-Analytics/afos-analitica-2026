/**
 * API Route: GET /api/admin/search-console
 *
 * Dados do Google Search Console — impressões, cliques, CTR, posição.
 * Inclui seção especial "seoGeo" com performance das páginas de país.
 *
 * Auth: Bearer CRON_SECRET (timing-safe).
 * Query params:
 *   ?days=28  (padrão 28, max 90)
 */

import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { fetchFullReport, isGSCConfigured } from '../../../../lib/google/search-console'
import { audit } from '../../../../lib/audit'

function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a)
    const bufB = Buffer.from(b)
    if (bufA.length !== bufB.length) return false
    return timingSafeEqual(bufA, bufB)
  } catch { return false }
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return NextResponse.json({ error: 'not_configured' }, { status: 503 })

  const authHeader = request.headers.get('authorization') || ''
  if (!safeCompare(authHeader, `Bearer ${secret}`)) {
    audit('auth_failure', 'api.admin.search-console', 'n/a', {
      ip: request.headers.get('x-forwarded-for') || undefined,
    })
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  if (!isGSCConfigured()) {
    return NextResponse.json({
      error: 'gsc_not_configured',
      setup: {
        envVars: [
          'GOOGLE_SERVICE_ACCOUNT_EMAIL',
          'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY',
          'GOOGLE_SEARCH_CONSOLE_SITE_URL',
        ],
        steps: [
          '1. Google Cloud Console → criar projeto → habilitar "Search Console API"',
          '2. IAM → Service Accounts → criar conta → gerar chave JSON',
          '3. Copiar client_email e private_key para env vars',
          '4. GSC (search.google.com/search-console) → Configurações → Usuários → adicionar o email da service account como Proprietário',
          '5. GOOGLE_SEARCH_CONSOLE_SITE_URL = "https://afos-analytics.com"',
        ],
      },
    }, { status: 503 })
  }

  const url = new URL(request.url)
  const days = Math.min(Math.max(parseInt(url.searchParams.get('days') || '28'), 1), 90)

  try {
    const report = await fetchFullReport(days)

    return NextResponse.json(report, {
      headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
    })
  } catch (error) {
    console.error('[search-console] Error:', error)
    return NextResponse.json(
      { error: 'gsc_query_failed', message: error instanceof Error ? error.message : 'unknown' },
      { status: 500 }
    )
  }
}
