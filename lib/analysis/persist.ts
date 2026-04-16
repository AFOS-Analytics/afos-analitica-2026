/**
 * Analysis Persistence — AFOS Analytics
 *
 * Persiste análises (cards + criteriosa) no Neon Postgres via AnalysisReport.
 * Fire-and-forget: não bloqueia a resposta da API.
 * Cada snapshot diário gera um registro único (slug = tipo + data).
 */

type AnalysisType = 'analysis-cards' | 'analysis-criteriosa'

/**
 * Persiste um snapshot de análise no banco.
 * Usa upsert por slug — se já existe para a mesma data, atualiza.
 * Chamada em background (não await no caller).
 */
export async function persistAnalysisSnapshot(
  type: AnalysisType,
  data: Record<string, unknown>
): Promise<void> {
  try {
    const { prisma } = await import('../db')
    if (!prisma) return

    const updatedAt = (data.updatedAt as string) || new Date().toISOString()
    const dateSlug = updatedAt.slice(0, 10).replace(/\//g, '-')
    const slug = `${type}-${dateSlug}`

    const title = type === 'analysis-cards'
      ? `Análise Cards — ${updatedAt}`
      : `Análise Criteriosa — ${updatedAt}`

    const executiveSummary = type === 'analysis-cards'
      ? buildCardsSummary(data)
      : buildCriteriaSummary(data)

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
    // Fire-and-forget: log e segue — nunca quebra a API
    console.error(`[persist-analysis] ${type} failed:`, err)
  }
}

function buildCardsSummary(data: Record<string, unknown>): string {
  const cards = data.cards as Record<string, unknown> | undefined
  if (!cards) return 'Sem dados'
  const sections = Object.keys(cards)
  return `Cards: ${sections.join(', ')} | Atualizado: ${data.updatedAt || 'N/A'}`
}

function buildCriteriaSummary(data: Record<string, unknown>): string {
  const candidates = data.candidates as Array<{ name: string }> | undefined
  if (!candidates) return 'Sem dados'
  const names = candidates.map(c => c.name)
  return `Candidatos: ${names.join(', ')} | Atualizado: ${data.updatedAt || 'N/A'}`
}
