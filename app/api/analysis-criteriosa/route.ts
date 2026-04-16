import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { persistAnalysisSnapshot } from '../../../lib/analysis/persist'

export const revalidate = 7200

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'analysis-criteriosa.json')
    if (!existsSync(filePath)) {
      return NextResponse.json({ updatedAt: '', candidates: [], quadroComparativo: [] }, { status: 404 })
    }
    const data = JSON.parse(readFileSync(filePath, 'utf-8'))

    // Fire-and-forget: persiste no Neon sem bloquear resposta
    persistAnalysisSnapshot('analysis-criteriosa', data).catch(() => {})

    return NextResponse.json(data)
  } catch (error) {
    console.error('[analysis-criteriosa] Erro:', error)
    return NextResponse.json({ updatedAt: '', candidates: [], quadroComparativo: [] }, { status: 500 })
  }
}
