import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { assertDatabaseUrl } from './db-url-validator'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | null
  prismaInitError: string | null
}

function createPrismaClient(): PrismaClient | null {
  const url = process.env.DATABASE_URL
  if (!url) {
    globalForPrisma.prismaInitError = 'DATABASE_URL is not set'
    console.warn('[db] DATABASE_URL não configurada — banco indisponível')
    return null
  }
  try {
    assertDatabaseUrl(url, 'DATABASE_URL')
  } catch (e) {
    const msg = (e as Error).message
    globalForPrisma.prismaInitError = `assertDatabaseUrl: ${msg}`
    console.error('[db] DATABASE_URL inválida:', msg)
    return null
  }

  try {
    const adapter = new PrismaNeon({ connectionString: url })
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    })
  } catch (e) {
    const msg = (e as Error).message
    globalForPrisma.prismaInitError = `client init: ${msg}`
    console.error('[db] PrismaClient init failed:', msg)
    return null
  }
}

export function getPrismaInitError(): string | null {
  return globalForPrisma.prismaInitError ?? null
}

export const prisma: PrismaClient | null =
  globalForPrisma.prisma ?? createPrismaClient()

if (prisma && process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
