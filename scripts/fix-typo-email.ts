import { config } from 'dotenv'
config({ path: '.env.local' })

import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const WRONG = '***redacted-email***'
const CORRECT = '***redacted-email***'

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) { console.error('❌ DATABASE_URL não configurada'); process.exit(1) }

  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: url }) })

  const existing = await prisma.lead.findUnique({ where: { email: WRONG } })
  if (!existing) {
    console.log(`ℹ️  Lead "${WRONG}" não encontrado — nada a corrigir.`)
    await prisma.$disconnect()
    return
  }
  console.log(`🔍 Encontrado: ${existing.email} (id=${existing.id.slice(0, 8)}…)`)

  const conflict = await prisma.lead.findUnique({ where: { email: CORRECT }, select: { id: true } })
  if (conflict) {
    console.log(`⚠️  Já existe lead com "${CORRECT}" (id=${conflict.id.slice(0, 8)}…). Removendo o typo e mantendo o correto.`)
    await prisma.lead.delete({ where: { email: WRONG } })
    console.log(`✅ Lead typo removido.`)
  } else {
    await prisma.lead.update({ where: { email: WRONG }, data: { email: CORRECT } })
    console.log(`✅ Email atualizado: ${WRONG} → ${CORRECT}`)
  }

  await prisma.$disconnect()
}

main().catch((e) => { console.error(e); process.exit(1) })
