/**
 * Cron Job: /api/cron/persist-analysis
 *
 * Persiste snapshots diários das análises (cards + criteriosa) no Neon.
 * Lê os JSONs públicos e grava via AnalysisReport (upsert por slug).
 *
 * Execução:
 *   - Cron Vercel (diário às 14h UTC = 11h BRT, após updates manuais)
 *   - Ou via Bearer CRON_SECRET (trigger manual pelo skill /atualizar)
 */

import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import { persistAnalysisSnapshot } from '../../../../lib/analysis/persist'
import { buildNoCacheHeaders } from '../../../lib/cache/headers'

export const dynamic = 'force-dynamic'

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

  const allOk = results.every(r => r.ok)
  return NextResponse.json(
    { ok: allOk, elapsed: Date.now() - startTime, results },
    { status: allOk ? 200 : 500, headers: buildNoCacheHeaders() },
  )
}
