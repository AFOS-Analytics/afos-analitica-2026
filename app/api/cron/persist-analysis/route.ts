/**
 * Cron Job: /api/cron/persist-analysis
 *
 * Persiste snapshots diários das análises (cards + criteriosa):
 *   1. Neon (AnalysisReport — fonte primária, queryable)
 *   2. Vercel Blob (backup redundante acessível via URL pública)
 *
 * Execução:
 *   - Cron Vercel (diário às 14h UTC = 11h BRT)
 *   - Ou via Bearer CRON_SECRET (trigger manual)
 *
 * Alertas: falha em qualquer job → email via Resend para ALERT_EMAIL
 */

import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import { persistAnalysisSnapshot } from '../../../../lib/analysis/persist'
import { backupToBlob } from '../../../../lib/analysis/blob-backup'
import { buildNoCacheHeaders } from '../../../lib/cache/headers'
import { sendSystemAlert } from '../../../lib/email/resend'

export const dynamic = 'force-dynamic'

const ALERT_EMAIL = process.env.ALERT_EMAIL || 'afos2100@gmail.com'

type JobResult = {
  type: string
  neon: { ok: boolean; error?: string }
  blob: { ok: boolean; url?: string; error?: string }
}

export async function GET(request: Request) {
  const startTime = Date.now()

  const isVercelCron = request.headers.get('x-vercel-cron') === '1'
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  const isAuthorized = isVercelCron || (cronSecret && authHeader === `Bearer ${cronSecret}`)

  if (process.env.VERCEL && !isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: JobResult[] = []

  for (const job of [
    { type: 'analysis-cards' as const, file: 'analysis-data.json' },
    { type: 'analysis-criteriosa' as const, file: 'analysis-criteriosa.json' },
  ]) {
    const path = join(process.cwd(), 'public', job.file)
    let data: Record<string, unknown>
    try {
      data = JSON.parse(readFileSync(path, 'utf-8'))
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err)
      results.push({
        type: job.type,
        neon: { ok: false, error: `read failed: ${error}` },
        blob: { ok: false, error: 'skipped (read failed)' },
      })
      continue
    }

    const [neonRes, blobRes] = await Promise.allSettled([
      persistAnalysisSnapshot(job.type, data).then(() => ({ ok: true })),
      backupToBlob(job.type, data),
    ])

    results.push({
      type: job.type,
      neon: neonRes.status === 'fulfilled'
        ? neonRes.value
        : { ok: false, error: String(neonRes.reason) },
      blob: blobRes.status === 'fulfilled'
        ? blobRes.value
        : { ok: false, error: String(blobRes.reason) },
    })
  }

  const neonFailures = results.filter(r => !r.neon.ok)
  const allNeonOk = neonFailures.length === 0

  if (neonFailures.length > 0) {
    const message = `Persistência Neon falhou em ${neonFailures.length}/${results.length} jobs`
    const details = neonFailures
      .map(f => `${f.type}: ${f.neon.error || 'unknown'}`)
      .join('\n')
    await sendSystemAlert(ALERT_EMAIL, {
      type: 'persist-analysis-failure',
      message,
      details: `${details}\n\nTimestamp: ${new Date().toISOString()}\nElapsed: ${Date.now() - startTime}ms`,
    }).catch(err => console.error('[cron/persist-analysis] alert send failed:', err))
  }

  return NextResponse.json(
    { ok: allNeonOk, elapsed: Date.now() - startTime, results },
    { status: allNeonOk ? 200 : 500, headers: buildNoCacheHeaders() },
  )
}
