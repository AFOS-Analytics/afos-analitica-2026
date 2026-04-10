import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { prisma } from '../../../lib/db'

export const revalidate = 7200

const EMPTY = { updatedAt: '', cards: {} }

export async function GET() {
  // 1. Tentar Neon
  try {
    const record = await prisma?.analysis.findFirst({
      where: { type: 'analysis_cards' },
      orderBy: { version: 'desc' },
      select: { content: true },
    })
    if (record?.content) {
      return NextResponse.json(record.content)
    }
  } catch (err) {
    console.warn('[analysis-cards] Neon fallback:', err instanceof Error ? err.message : err)
  }

  // 2. Fallback: JSON file
  try {
    const filePath = join(process.cwd(), 'public', 'analysis-data.json')
    if (!existsSync(filePath)) {
      return NextResponse.json(EMPTY)
    }
    const data = JSON.parse(readFileSync(filePath, 'utf-8'))
    return NextResponse.json(data)
  } catch (error) {
    console.error('[analysis-cards] Erro:', error)
    return NextResponse.json(EMPTY)
  }
}
