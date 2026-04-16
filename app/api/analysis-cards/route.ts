import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { persistAnalysisSnapshot } from '../../../lib/analysis/persist'

export const revalidate = 7200

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'analysis-data.json')
    if (!existsSync(filePath)) {
      return NextResponse.json({ updatedAt: '', cards: {} })
    }
    const data = JSON.parse(readFileSync(filePath, 'utf-8'))

    // Fire-and-forget: persiste no Neon sem bloquear resposta
    persistAnalysisSnapshot('analysis-cards', data).catch(() => {})

    return NextResponse.json(data)
  } catch (error) {
    console.error('[analysis-cards] Erro:', error)
    return NextResponse.json({ updatedAt: '', cards: {} })
  }
}
