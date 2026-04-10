import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | null
}

function createPrismaClient(): PrismaClient | null {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.warn('[db] DATABASE_URL não configurada — banco indisponível')
    return null
  }

  const adapter = new PrismaNeon({ connectionString: url })

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })
}

export const prisma: PrismaClient | null =
  globalForPrisma.prisma ?? createPrismaClient()

if (prisma && process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
