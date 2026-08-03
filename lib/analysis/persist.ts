import { deriveDateSlug, truncate } from './date-slug'
import type { PrismaClient } from '@prisma/client'

export type AnalysisType = 'analysis-cards' | 'analysis-criteriosa' | 'afos-hoje' | 'afos-daily' | 'afos-tradeoff' | 'afos-weekly' | 'us-generic-ballot' | 'us-press'

export function buildSummary(type: AnalysisType, data: Record<string, unknown>): string {
  if (type === 'us-press') {
    const q = data.qualidade as { publicados?: number; lidos?: number; foraDaLista?: number; veiculosRepresentados?: number } | undefined
    return `Imprensa EUA: ${q?.publicados ?? 0} matérias de ${q?.veiculosRepresentados ?? 0} veículos | ${q?.lidos ?? 0} lidos, ${q?.foraDaLista ?? 0} fora da lista`
  }
  if (type === 'us-generic-ballot') {
    const m = data.mediaAfos as { dem?: number; rep?: number; vantagemDem?: number; nPesquisas?: number; nInstitutos?: number } | null
    const q = data.qualidade as { publicadas?: number; linhasLidas?: number } | undefined
    if (!m) return `Generic ballot sem média | ${q?.publicadas ?? 0} de ${q?.linhasLidas ?? 0} linhas`
    return `Generic ballot: Dem ${m.dem}% x Rep ${m.rep}% (D+${m.vantagemDem}) sobre ${m.nPesquisas} pesquisas de ${m.nInstitutos} institutos | ${q?.publicadas ?? 0} de ${q?.linhasLidas ?? 0} linhas lidas`
  }
  if (type === 'analysis-cards') {
    const cards = data.cards as Record<string, unknown> | undefined
    if (!cards) return 'Sem dados'
    return `Cards: ${Object.keys(cards).join(', ')} | Atualizado: ${data.updatedAt || 'N/A'}`
  }
  if (type === 'afos-hoje' || type === 'afos-daily' || type === 'afos-tradeoff' || type === 'afos-weekly') {
    const lede = data.lede as string | undefined
    const fallback =
      type === 'afos-daily' ? 'AFOS Daily'
      : type === 'afos-tradeoff' ? 'AFOS Tradeoff'
      : type === 'afos-weekly' ? 'AFOS Weekly'
      : 'AFOS Hoje'
    return lede ? lede.slice(0, 200) : `${fallback} — ${data.updatedAt || data.date || 'N/A'}`
  }
  const candidates = data.candidates as Array<{ name: string }> | undefined
  if (!candidates) return 'Sem dados'
  return `Candidatos: ${candidates.map(c => c.name).join(', ')} | Atualizado: ${data.updatedAt || 'N/A'}`
}

export function buildTitle(type: AnalysisType, updatedAtLabel: string): string {
  if (type === 'us-generic-ballot') return `US generic ballot — ${updatedAtLabel}`
  if (type === 'us-press') return `Imprensa EUA — ${updatedAtLabel}`
  if (type === 'analysis-cards') return `Análise Cards — ${updatedAtLabel}`
  if (type === 'afos-hoje') return `AFOS Hoje — ${updatedAtLabel}`
  if (type === 'afos-daily') return `AFOS Daily — ${updatedAtLabel}`
  if (type === 'afos-tradeoff') return `AFOS Tradeoff — ${updatedAtLabel}`
  // O Weekly passa `titleOverride`, então este ramo é só a rede de segurança.
  if (type === 'afos-weekly') return `AFOS Weekly — ${updatedAtLabel}`
  return `Análise Criteriosa — ${updatedAtLabel}`
}

type UpsertOpts = {
  createdBy?: string
  publishedAt?: Date
  fallbackIsoDate?: string
  /**
   * Data ISO que MANDA no slug, ignorando `updatedAt`.
   *
   * Existe por causa do Tradeoff, o único tipo em que a data da edição e a data
   * da captura são diferentes por desenho: a edição sai na segunda e o snapshot
   * de mercado é do domingo. Sem isto o slug saía da captura, e a edição de
   * 03/Ago virava `afos-tradeoff-02-08-2026`.
   *
   * Os outros tipos NÃO devem passar este campo: para daily, cards e os produtos
   * dos EUA o `updatedAt` é a data certa, e `deriveDateSlug` depende dele para
   * não criar registro novo quando a rodada cruza a virada do dia UTC.
   */
  slugIsoDate?: string
  /**
   * Título pronto, que substitui o do `buildTitle`.
   *
   * Mesma razão do `slugIsoDate`: no Tradeoff a data da edição e a da captura
   * são dias diferentes, e o título montado a partir de `updatedAt` sozinho não
   * diz DE QUE a data é. O campo não é lido por nenhuma tela, mas vai para o
   * backup público do Neon, então quem audita o arquivo lê esse rótulo.
   *
   * Os outros tipos NÃO devem passar: para eles captura e produto são o mesmo
   * dia e o `buildTitle` já está certo.
   */
  titleOverride?: string
  /**
   * 🌍 Pedaço que entra no slug ENTRE o tipo e a data, para separar países.
   *
   * 🔴 EXISTE POR CAUSA DE UMA COLISÃO REAL, em 03/Ago/2026. O Tradeoff virou
   * multipaís e passou a ter duas edições na MESMA data: o Brasil publica na
   * segunda e os EUA também. Sem qualificador, as duas geram
   * `afos-tradeoff-03-08-2026`, e como o upsert é por slug **a segunda apaga a
   * primeira sem erro nenhum**.
   *
   * ⚠️ O BRASIL NÃO PASSA ESTE CAMPO, e isso é de propósito. As 11 edições
   * brasileiras já arquivadas usam o slug sem país; acrescentar 'br' agora
   * criaria 11 registros novos e deixaria os antigos órfãos. Mesma assimetria
   * da pasta, em que o Brasil fica na raiz e cada país novo ganha subpasta.
   *
   * 📌 O AFOS Weekly tem a MESMA armadilha esperando: hoje só existe `us`, então
   * o slug dele ainda é `afos-weekly-DD-MM-YYYY`. No dia em que entrar um
   * segundo país, ele precisa passar por aqui antes de arquivar.
   */
  slugQualifier?: string
}

export async function upsertAnalysisReport(
  prisma: PrismaClient,
  type: AnalysisType,
  data: Record<string, unknown>,
  opts: UpsertOpts = {},
) {
  const iso = opts.slugIsoDate?.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  const qual = opts.slugQualifier ? `-${opts.slugQualifier}` : ''
  const slug = iso
    ? `${type}${qual}-${iso[3]}-${iso[2]}-${iso[1]}`
    : `${type}${qual}-${deriveDateSlug(data, opts.fallbackIsoDate)}`
  const updatedAtLabel = (data.updatedAt as string) || new Date().toISOString()
  const title = opts.titleOverride ?? buildTitle(type, updatedAtLabel)
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
