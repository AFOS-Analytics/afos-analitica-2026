import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { prisma } from '../../../lib/db'

export const revalidate = 7200

const EMPTY = { updatedAt: '', candidates: [], quadroComparativo: [] }

export async function GET() {
  // 1. Tentar Neon
  try {
    const record = await prisma?.analysis.findFirst({
      where: { type: 'analysis_criteriosa' },
      orderBy: { version: 'desc' },
      select: { content: true },
    })
    if (record?.content) {
      return NextResponse.json(record.content)
    }
  } catch (err) {
    console.warn('[analysis-criteriosa] Neon fallback:', err instanceof Error ? err.message : err)
  }

  // 2. Fallback: JSON file
  try {
    const filePath = join(process.cwd(), 'public', 'analysis-criteriosa.json')
    if (!existsSync(filePath)) {
      return NextResponse.json(EMPTY, { status: 404 })
    }
    const data = JSON.parse(readFileSync(filePath, 'utf-8'))
    return NextResponse.json(data)
  } catch (error) {
    console.error('[analysis-criteriosa] Erro:', error)
    return NextResponse.json(EMPTY, { status: 500 })
  }
}
