import { config } from 'dotenv'
config({ path: '.env.local' })

import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

async function main() {
  const url = (process.env.DATABASE_URL || '').replace(/\\n$/, '').replace(/\n$/, '').trim()
  if (!url) { console.error('No DATABASE_URL'); process.exit(1) }

  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: url }) })

  const dbSize: any = await prisma.$queryRawUnsafe(
    `SELECT pg_size_pretty(pg_database_size(current_database())) as size,
            pg_database_size(current_database())::text as bytes`
  )
  console.log('=== TAMANHO BANCO ===')
  console.log('  ', dbSize[0].size, '(' + dbSize[0].bytes + ' bytes)')

  console.log('\n=== TOP TABELAS POR TAMANHO ===')
  const tables: any = await prisma.$queryRawUnsafe(`
    SELECT schemaname || '.' || tablename as name,
           pg_size_pretty(pg_total_relation_size((schemaname || '.' || tablename)::regclass)) as size,
           pg_total_relation_size((schemaname || '.' || tablename)::regclass)::text as bytes
    FROM pg_tables
    WHERE schemaname NOT IN ('pg_catalog','information_schema')
    ORDER BY pg_total_relation_size((schemaname || '.' || tablename)::regclass) DESC
    LIMIT 12
  `)
  for (const t of tables) console.log('  ', t.size.padEnd(12), t.name)

  console.log('\n=== CONTAGENS ===')
  const reports: any = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::text as n FROM "AnalysisReport"`)
  console.log('  AnalysisReport:', reports[0].n)

  try {
    const polls: any = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::text as n FROM polls."tse_polls"`)
    console.log('  polls.tse_polls:', polls[0].n)
  } catch {}

  try {
    const audits: any = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::text as n FROM governance."audit_logs"`)
    console.log('  audit_logs:', audits[0].n)
  } catch {}

  try {
    const visitors: any = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::text as n FROM "VisitorSession"`)
    console.log('  VisitorSession:', visitors[0].n)
  } catch {}

  await prisma.$disconnect()
}

main().catch((e) => { console.error('ERROR:', e.message || e); process.exit(1) })
