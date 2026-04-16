import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export const revalidate = 7200

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'analysis-criteriosa.json')
    if (!existsSync(filePath)) {
      return NextResponse.json({ updatedAt: '', candidates: [], quadroComparativo: [] }, { status: 404 })
    }
    const data = JSON.parse(readFileSync(filePath, 'utf-8'))
    return NextResponse.json(data)
  } catch (error) {
    console.error('[analysis-criteriosa] Erro:', error)
    return NextResponse.json({ updatedAt: '', candidates: [], quadroComparativo: [] }, { status: 500 })
  }
}
