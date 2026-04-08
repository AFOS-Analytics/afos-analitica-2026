import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { readLiveData } from '../../lib/draft';

export const revalidate = 7200;

export async function GET() {
  try {
    // 1. Tentar ler dados aprovados do Redis (draft system)
    const liveData = await readLiveData('criteriosa');
    if (liveData) {
      return NextResponse.json(liveData, {
        headers: { 'X-Source': 'redis-live' },
      });
    }

    // 2. Fallback: ler JSON estatico
    const filePath = join(process.cwd(), 'public', 'analysis-criteriosa.json');
    if (!existsSync(filePath)) {
      console.error('[analysis-criteriosa] Arquivo nao encontrado');
      return NextResponse.json({ updatedAt: '', candidates: [], quadroComparativo: [] }, { status: 404 });
    }

    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    return NextResponse.json(data, {
      headers: { 'X-Source': 'static-json' },
    });
  } catch (error) {
    console.error('[analysis-criteriosa] Erro:', error);
    return NextResponse.json({ updatedAt: '', candidates: [], quadroComparativo: [] }, { status: 500 });
  }
}
