import { config } from 'dotenv'
config({ path: '.env.local' })

import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

async function main() {
  const url = (process.env.DATABASE_URL || '').replace(/\\n$/, '').replace(/\n$/, '').trim()
  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: url }) })

  console.log('=== Estrutura research.research_findings ===')
  const cols: any = await prisma.$queryRawUnsafe(`
    SELECT column_name::text as c, data_type::text as dt
    FROM information_schema.columns
    WHERE table_schema='research' AND table_name='research_findings'
    ORDER BY ordinal_position
  `)
  for (const c of cols) console.log(' ', c.c.padEnd(30), c.dt)

  console.log('\n=== Total registros ===')
  const total: any = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::text as n FROM research.research_findings`)
  console.log('  ', total[0].n)

  console.log('\n=== Por tipo (se houver coluna type/source) ===')
  try {
    const byType: any = await prisma.$queryRawUnsafe(`
      SELECT source_type::text as t, COUNT(*)::text as n
      FROM research.research_findings
      GROUP BY source_type
      ORDER BY COUNT(*) DESC
    `)
    for (const r of byType) console.log(' ', r.n.padEnd(6), r.t)
  } catch (e: any) {
    try {
      const byType: any = await prisma.$queryRawUnsafe(`
        SELECT finding_type::text as t, COUNT(*)::text as n
        FROM research.research_findings
        GROUP BY finding_type
        ORDER BY COUNT(*) DESC
      `)
      for (const r of byType) console.log(' ', r.n.padEnd(6), r.t)
    } catch {}
  }

  console.log('\n=== Range temporal ===')
  try {
    const dt: any = await prisma.$queryRawUnsafe(`
      SELECT MIN(created_at)::text as min_at, MAX(created_at)::text as max_at
      FROM research.research_findings
    `)
    console.log('  ', dt[0].min_at, '→', dt[0].max_at)
  } catch {}

  await prisma.$disconnect()
}

main().catch((e) => { console.error('ERROR:', e.message); process.exit(1) })
