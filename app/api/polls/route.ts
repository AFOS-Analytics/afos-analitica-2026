import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { prisma } from '../../../lib/db'

export const revalidate = 7200

const EMPTY = { lastUpdate: '', polls: [], institutes: [] }

export async function GET() {
  // 1. Tentar Neon
  try {
    const record = await prisma?.analysis.findFirst({
      where: { type: 'polls_data' },
      orderBy: { version: 'desc' },
      select: { content: true },
    })
    if (record?.content) {
      return NextResponse.json(record.content)
    }
  } catch (err) {
    console.warn('[polls] Neon fallback:', err instanceof Error ? err.message : err)
  }

  // 2. Fallback: JSON file
  try {
    const filePath = join(process.cwd(), 'public', 'polls-data.json')
    if (!existsSync(filePath)) {
      return NextResponse.json(EMPTY, { status: 404 })
    }
    const data = JSON.parse(readFileSync(filePath, 'utf-8'))
    return NextResponse.json(data)
  } catch (error) {
    console.error('[polls] Erro:', error)
    return NextResponse.json(EMPTY, { status: 500 })
  }
}
