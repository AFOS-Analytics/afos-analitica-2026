import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export const revalidate = 7200;

export async function GET() {
  try {
    // Try to read dynamic analysis file first
    const filePath = join(process.cwd(), 'public', 'analysis-data.json');

    if (!existsSync(filePath)) {
      console.error(`[analysis-cards] Data file not found: ${filePath}`);
      return NextResponse.json({ updatedAt: '', cards: {} });
    }

    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    return NextResponse.json(data);
  } catch (error) {
    console.error('[analysis-cards] Error reading analysis data:', error);
    // Fallback to default
    return NextResponse.json({ updatedAt: '', cards: {} });
  }
}
