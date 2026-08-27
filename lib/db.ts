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

/**
 * 🔴 POR QUE ESTE GETTER EXISTE, medido em 27/Ago/2026.
 *
 * Um usuário relatou que o cadastro falhava com "Serviço temporariamente
 * indisponível" no desktop E no celular. Essa mensagem tem UMA origem só:
 * `storage_unavailable`, que sai quando `prisma` é `null`.
 *
 * E o `prisma` era criado UMA VEZ, na avaliação do módulo. Se aquela única
 * tentativa falhasse por qualquer motivo, a instância inteira ficava
 * envenenada: **todo request subsequente daquele lambda devolvia
 * `storage_unavailable` pelo resto da vida dele**, mesmo depois de o banco
 * voltar. Isso explica o relato: quem cai numa instância ruim falha sempre,
 * inclusive trocando de aparelho, enquanto quem cai numa boa nem percebe.
 *
 * ✅ `getPrisma()` REPETE a criação quando ela falhou antes, e guarda o
 * sucesso. Falha de inicialização passa a ser um evento, não uma sentença.
 *
 * ⚠️ O `export const prisma` abaixo continua, para não quebrar os pontos que
 * já o importam, mas ele carrega o defeito por natureza: é uma leitura só, do
 * momento do import. **Caminho novo usa `getPrisma()`.**
 */
export function getPrisma(): PrismaClient | null {
  if (globalForPrisma.prisma) return globalForPrisma.prisma
  const client = createPrismaClient()
  if (client) {
    globalForPrisma.prisma = client
    globalForPrisma.prismaInitError = null
  }
  return client
}

export const prisma: PrismaClient | null = getPrisma()
