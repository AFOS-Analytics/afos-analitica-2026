import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export const revalidate = 7200;

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'analysis-data.json');
    if (!existsSync(filePath)) {
      console.error('[analysis-cards] Arquivo nao encontrado');
      return NextResponse.json({ updatedAt: '', cards: {} });
    }
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    return NextResponse.json(data);
  } catch (error) {
    console.error('[analysis-cards] Erro:', error);
    return NextResponse.json({ updatedAt: '', cards: {} });
  }
}
