import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import { persistAnalysisSnapshot, type AnalysisType } from '../../../../lib/analysis/persist'
import { buildNoCacheHeaders } from '../../../lib/cache/headers'
import { sendSystemAlert } from '../../../lib/email/resend'

export const dynamic = 'force-dynamic'
// 2 Neon upserts em paralelo costumam <3s; 20s cobre pico + envio de alerta.
export const maxDuration = 20

const ALERT_EMAIL = process.env.ALERT_EMAIL || 'afos2100@gmail.com'

const JOBS: Array<{ type: AnalysisType; file: string }> = [
  { type: 'analysis-cards', file: 'analysis-data.json' },
  { type: 'analysis-criteriosa', file: 'analysis-criteriosa.json' },
]

export async function GET(request: Request) {
  const startTime = Date.now()

  const isVercelCron = request.headers.get('x-vercel-cron') === '1'
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  const isAuthorized = isVercelCron || (cronSecret && authHeader === `Bearer ${cronSecret}`)
  if (process.env.VERCEL && !isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = await Promise.all(JOBS.map(async job => {
    try {
      const data = JSON.parse(readFileSync(join(process.cwd(), 'public', job.file), 'utf-8'))
      await persistAnalysisSnapshot(job.type, data)
      return { type: job.type, ok: true }
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err)
      console.error(`[cron/persist-analysis] ${job.type} failed:`, error)
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
