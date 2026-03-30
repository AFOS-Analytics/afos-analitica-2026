import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export const revalidate = 7200;

export async function GET() {
  try {
    // Try to read dynamic analysis file first
    const filePath = join(process.cwd(), 'public', 'analysis-data.json');
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    return NextResponse.json(data);
  } catch {
    // Fallback to default
    return NextResponse.json({ updatedAt: '', cards: {} });
  }
}
