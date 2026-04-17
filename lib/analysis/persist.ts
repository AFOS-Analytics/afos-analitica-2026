/**
 * Analysis Persistence — AFOS Analytics
 *
 * Persiste análises (cards + criteriosa) no Neon Postgres via AnalysisReport.
 * Fire-and-forget: não bloqueia a resposta da API.
 * Cada snapshot diário gera um registro único (slug = tipo + data).
 *
 * Chamado a partir de /api/cron/persist-analysis e scripts locais.
 */

import { deriveDateSlug, truncate } from './date-slug'

type AnalysisType = 'analysis-cards' | 'analysis-criteriosa'

/**
 * Persiste um snapshot de análise no banco.
 * Usa upsert por slug — se já existe para a mesma data, atualiza.
 * Chamada em background (não await no caller).
 */
export async function persistAnalysisSnapshot(
  type: AnalysisType,
  data: Record<string, unknown>,
): Promise<void> {
  try {
    const { prisma } = await import('../db')
    if (!prisma) return

    const dateSlug = deriveDateSlug(data)
    const slug = `${type}-${dateSlug}`
    const updatedAtLabel = (data.updatedAt as string) || new Date().toISOString()

    const title = type === 'analysis-cards'
      ? `Análise Cards — ${updatedAtLabel}`
      : `Análise Criteriosa — ${updatedAtLabel}`

    const executiveSummary = truncate(
      type === 'analysis-cards'
        ? buildCardsSummary(data)
        : buildCriteriaSummary(data),
    )

    await prisma.analysisReport.upsert({
      where: { slug },
      create: {
        slug,
        title,
        locale: 'pt-BR',
        status: 'published',
        executiveSummary,
        bodyMarkdown: JSON.stringify(data),
        createdBy: 'system:update',
        publishedAt: new Date(),
      },
      update: {
        title,
        executiveSummary,
        bodyMarkdown: JSON.stringify(data),
        publishedAt: new Date(),
      },
    })
  } catch (err) {
    console.error(`[persist-analysis] ${type} failed:`, err)
    throw err
  }
}

function buildCardsSummary(data: Record<string, unknown>): string {
  const cards = data.cards as Record<string, unknown> | undefined
  if (!cards) return 'Sem dados'
  return `Cards: ${Object.keys(cards).join(', ')} | Atualizado: ${data.updatedAt || 'N/A'}`
}

function buildCriteriaSummary(data: Record<string, unknown>): string {
  const candidates = data.candidates as Array<{ name: string }> | undefined
  if (!candidates) return 'Sem dados'
  return `Candidatos: ${candidates.map(c => c.name).join(', ')} | Atualizado: ${data.updatedAt || 'N/A'}`
}
