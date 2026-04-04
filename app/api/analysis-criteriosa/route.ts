import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export const revalidate = 7200;

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'analysis-criteriosa.json');
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ updatedAt: '', candidates: [], quadroComparativo: [] }, { status: 500 });
  }
}
