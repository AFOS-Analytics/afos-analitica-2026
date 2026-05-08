import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import { persistAnalysisSnapshot, type AnalysisType } from '../../../../lib/analysis/persist'
import { buildNoCacheHeaders } from '../../../lib/cache/headers'
import { sendSystemAlert } from '../../../lib/email/resend'
import { prisma } from '../../../../lib/db'

export const dynamic = 'force-dynamic'
// 2 Neon upserts em paralelo costumam <3s; 20s cobre pico + envio de alerta.
export const maxDuration = 20

const ALERT_EMAIL = process.env.ALERT_EMAIL || 'alerts@afos-analytics.com'

const JOBS: Array<{ type: AnalysisType; file: string }> = [
  { type: 'analysis-cards', file: 'analysis-data.json' },
  { type: 'analysis-criteriosa', file: 'analysis-criteriosa.json' },
]

// describeError extrai detalhes legíveis de Neon WS ErrorEvent (JSON.stringify
// retorna apenas '[object ErrorEvent]'). Espelha helper do script persist-analysis.
function describeError(err: unknown): string {
  if (err instanceof Error) {
    return `${err.name}: ${err.message}${err.cause ? ` (cause: ${describeError(err.cause)})` : ''}`
  }
  if (err && typeof err === 'object') {
    const e = err as Record<string, unknown>
    const parts: string[] = []
    if (e.type) parts.push(`type=${e.type}`)
    if (e.message) parts.push(`message=${e.message}`)
    if (e.code) parts.push(`code=${e.code}`)
    if (e.error) parts.push(`error=${describeError(e.error)}`)
    if (parts.length === 0) {
      try { return JSON.stringify(err) } catch { return String(err) }
    }
    return parts.join(' | ')
  }
  return String(err)
}

async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
  let lastErr: unknown
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try { return await fn() }
    catch (err) {
      lastErr = err
      if (attempt < maxAttempts) {
        await new Promise(r => setTimeout(r, 500 * Math.pow(2, attempt - 1)))
      }
    }
  }
  throw lastErr
}

export async function GET(request: Request) {
  const startTime = Date.now()

  // Defense in depth: require Bearer secret always. Vercel injects
  // CRON_SECRET as Authorization for scheduled crons. The prior bypass via
  // x-vercel-cron was vulnerable if Vercel's header stripping ever failed.
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  const isAuthorized = !!(cronSecret && authHeader === `Bearer ${cronSecret}`)
  if (process.env.VERCEL && !isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Warm-up Neon WS antes dos upserts. Cold-start adapter Neon serverless
  // dispara [object ErrorEvent] na primeira query após idle. SELECT 1
  // exercita o canal sem alterar dados. Resolve falha recorrente analysis-cards.
  if (prisma) {
    try {
      await withRetry(() => prisma!.$queryRaw`SELECT 1`, 3)
    } catch (err) {
      console.warn('[cron/persist-analysis] warm-up failed, prosseguindo:', describeError(err))
    }
  }

  const results = await Promise.all(JOBS.map(async job => {
    try {
      const data = JSON.parse(readFileSync(join(process.cwd(), 'public', job.file), 'utf-8'))
      await withRetry(() => persistAnalysisSnapshot(job.type, data), 3)
      return { type: job.type, ok: true }
    } catch (err) {
      const error = describeError(err)
      console.error(`[cron/persist-analysis] ${job.type} failed após retries:`, error)
      return { type: job.type, ok: false, error }
    }
  }))

  const failed = results.filter(r => !r.ok)
  const allOk = failed.length === 0

  if (failed.length > 0) {
    const details = failed.map(f => `${f.type}: ${f.error || 'unknown'}`).join('\n')
    await sendSystemAlert(ALERT_EMAIL, {
      type: 'persist-analysis-failure',
      message: `Persistência Neon falhou em ${failed.length}/${results.length} jobs`,
      details: `${details}\n\nTimestamp: ${new Date().toISOString()}\nElapsed: ${Date.now() - startTime}ms`,
    }).catch(err => console.error('[cron/persist-analysis] alert send failed:', err))
  }

  return NextResponse.json(
    { ok: allOk, elapsed: Date.now() - startTime, results },
    { status: allOk ? 200 : 500, headers: buildNoCacheHeaders() },
  )
}
