import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export const revalidate = 7200;

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'polls-data.json');

    if (!existsSync(filePath)) {
      console.error(`[polls] Data file not found: ${filePath}`);
      return NextResponse.json({ lastUpdate: '', polls: [], institutes: [] }, { status: 404 });
    }

    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    return NextResponse.json(data);
  } catch (error) {
    console.error('[polls] Error reading polls data:', error);
    return NextResponse.json({ lastUpdate: '', polls: [], institutes: [] }, { status: 500 });
  }
}
