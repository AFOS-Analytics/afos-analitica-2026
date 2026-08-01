/**
 * Leitura da imprensa das midterms, gravada pelo cron `/api/cron/refresh-us-press`.
 *
 * Diferente do generic ballot, aqui NÃO existe arquivo de piso no repositório, e
 * é de propósito: notícia velha não é piso, é ruído. Se o banco não responder, a
 * seção some da página em vez de mostrar manchete de uma semana atrás numa
 * página de eleição ao vivo.
 */
export interface UsPressItem {
  titulo: string
  url: string
  casa: string
  publicadoEm: string
  consulta: string
}

export interface UsPressVeiculo {
  casa: string
  tipo: string
}

export interface UsPressData {
  lastUpdate: string
  fetchedAt: string
  regra: string
  veiculos: UsPressVeiculo[]
  qualidade: {
    lidos: number
    naLista: number
    foraDaLista: number
    publicados: number
    descartadosPorAcompanhamento: number
    veiculosRepresentados: number
    tetoPorVeiculo: number
    consultasComFalha: string[]
  }
  itens: UsPressItem[]
}

export async function loadUsPressData(): Promise<UsPressData | null> {
  try {
    const { prisma } = await import('../db')
    if (!prisma) return null
    const reg = await prisma.analysisReport.findFirst({
      where: { slug: { startsWith: 'us-press-' } },
      orderBy: { publishedAt: 'desc' },
      select: { bodyMarkdown: true },
    })
    if (!reg?.bodyMarkdown) return null
    const d = JSON.parse(reg.bodyMarkdown) as UsPressData
    // Forma conferida antes de devolver: registro truncado derrubaria a seção,
    // e a página inteira junto.
    if (!Array.isArray(d?.itens) || d.itens.length === 0) return null
    if (!Array.isArray(d?.veiculos)) return null
    return d
  } catch {
    return null
  }
}
