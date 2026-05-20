import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export const revalidate = 7200

const DEGRADED_SHAPE = { lastUpdate: '', polls: [], institutes: [], degraded: true } as const

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'polls-data.json')
    if (!existsSync(filePath)) {
      return NextResponse.json({ ...DEGRADED_SHAPE, reason: 'file_not_found' }, { status: 404 })
    }
    const raw = readFileSync(filePath, 'utf-8')
    let data: unknown
    try {
      data = JSON.parse(raw)
    } catch {
      console.error('[polls] JSON parse failed — returning degraded shape')
      return NextResponse.json({ ...DEGRADED_SHAPE, reason: 'parse_error' }, { status: 200 })
    }
    // Shape guard: enforce minimal frontend contract (avoid 500 on schema drift)
    if (!data || typeof data !== 'object' || !Array.isArray((data as { polls?: unknown }).polls)) {
      console.error('[polls] Schema invalid — returning degraded shape')
      return NextResponse.json({ ...DEGRADED_SHAPE, reason: 'schema_invalid' }, { status: 200 })
    }
    return NextResponse.json(data)
  } catch (error) {
    console.error('[polls] Erro inesperado:', error)
    return NextResponse.json({ ...DEGRADED_SHAPE, reason: 'unexpected_error' }, { status: 500 })
  }
}
