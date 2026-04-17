import { deriveDateSlug, truncate } from './date-slug'
import type { PrismaClient } from '@prisma/client'

export type AnalysisType = 'analysis-cards' | 'analysis-criteriosa'

export function buildSummary(type: AnalysisType, data: Record<string, unknown>): string {
  if (type === 'analysis-cards') {
    const cards = data.cards as Record<string, unknown> | undefined
    if (!cards) return 'Sem dados'
    return `Cards: ${Object.keys(cards).join(', ')} | Atualizado: ${data.updatedAt || 'N/A'}`
  }
  const candidates = data.candidates as Array<{ name: string }> | undefined
  if (!candidates) return 'Sem dados'
  return `Candidatos: ${candidates.map(c => c.name).join(', ')} | Atualizado: ${data.updatedAt || 'N/A'}`
}

export function buildTitle(type: AnalysisType, updatedAtLabel: string): string {
  return type === 'analysis-cards'
    ? `Análise Cards — ${updatedAtLabel}`
    : `Análise Criteriosa — ${updatedAtLabel}`
}

type UpsertOpts = {
  createdBy?: string
  publishedAt?: Date
  fallbackIsoDate?: string
}

export async function upsertAnalysisReport(
  prisma: PrismaClient,
  type: AnalysisType,
  data: Record<string, unknown>,
  opts: UpsertOpts = {},
) {
  const slug = `${type}-${deriveDateSlug(data, opts.fallbackIsoDate)}`
  const updatedAtLabel = (data.updatedAt as string) || new Date().toISOString()
  const title = buildTitle(type, updatedAtLabel)
  const executiveSummary = truncate(buildSummary(type, data))
  const bodyMarkdown = JSON.stringify(data)
  const publishedAt = opts.publishedAt ?? new Date()

  return prisma.analysisReport.upsert({
    where: { slug },
    create: {
      slug, title, locale: 'pt-BR', status: 'published',
      executiveSummary, bodyMarkdown,
      createdBy: opts.createdBy ?? 'system:update',
      publishedAt,
    },
    update: { title, executiveSummary, bodyMarkdown, publishedAt },
  })
}

export async function persistAnalysisSnapshot(
  type: AnalysisType,
  data: Record<string, unknown>,
): Promise<void> {
  const { prisma } = await import('../db')
  if (!prisma) throw new Error('prisma not initialized')
  await upsertAnalysisReport(prisma, type, data)
}
