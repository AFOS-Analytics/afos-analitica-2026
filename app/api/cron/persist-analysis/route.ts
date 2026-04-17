/**
 * Cron Job: /api/cron/persist-analysis
 *
 * Persiste snapshots diários das análises no Neon (AnalysisReport — fonte primária).
 * Arquivamento redundante em Git branch é feito por GitHub Actions
 * (workflow: .github/workflows/archive-analysis.yml), não aqui.
 *
 * Execução:
 *   - Cron Vercel (diário às 14h UTC = 11h BRT)
 *   - Ou via Bearer CRON_SECRET (trigger manual)
 *
 * Alertas: falha → email via Resend para ALERT_EMAIL
 */

import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import { persistAnalysisSnapshot } from '../../../../lib/analysis/persist'
import { buildNoCacheHeaders } from '../../../lib/cache/headers'
import { sendSystemAlert } from '../../../lib/email/resend'

export const dynamic = 'force-dynamic'

const ALERT_EMAIL = process.env.ALERT_EMAIL || 'afos2100@gmail.com'

export async function GET(request: Request) {
  const startTime = Date.now()

  const isVercelCron = request.headers.get('x-vercel-cron') === '1'
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  const isAuthorized = isVercelCron || (cronSecret && authHeader === `Bearer ${cronSecret}`)

  if (process.env.VERCEL && !isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: Array<{ type: string; ok: boolean; error?: string }> = []

  for (const job of [
    { type: 'analysis-cards' as const, file: 'analysis-data.json' },
    { type: 'analysis-criteriosa' as const, file: 'analysis-criteriosa.json' },
  ]) {
    try {
      const path = join(process.cwd(), 'public', job.file)
      const data = JSON.parse(readFileSync(path, 'utf-8'))
      await persistAnalysisSnapshot(job.type, data)
      results.push({ type: job.type, ok: true })
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err)
      console.error(`[cron/persist-analysis] ${job.type} failed:`, error)
      results.push({ type: job.type, ok: false, error })
    }
  }

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
