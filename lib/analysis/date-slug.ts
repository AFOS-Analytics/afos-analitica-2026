/**
 * Derivação consistente de slug de data para AnalysisReport.
 *
 * Formato canônico: DD-MM-YYYY (para ambientes PT-BR do projeto).
 * Aceita entrada em PT-BR (DD/MM/YYYY) ou ISO (YYYY-MM-DD), sempre
 * devolvendo DD-MM-YYYY. Se nada casar, usa fallback (data atual UTC ou
 * commit date fornecido pelo chamador).
 *
 * Compartilhado entre:
 *   - lib/analysis/persist.ts (cron route)
 *   - scripts/persist-analysis.ts (manual)
 *   - scripts/backfill-analysis.ts (histórico)
 */

const PT_BR_DATE = /^(\d{2})\/(\d{2})\/(\d{4})/
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})/

export function deriveDateSlug(
  data: Record<string, unknown>,
  fallbackIsoDate?: string,
): string {
  const updatedAt = typeof data.updatedAt === 'string' ? data.updatedAt : undefined

  if (updatedAt) {
    const ptMatch = updatedAt.match(PT_BR_DATE)
    if (ptMatch) return `${ptMatch[1]}-${ptMatch[2]}-${ptMatch[3]}`

    const isoMatch = updatedAt.match(ISO_DATE)
    if (isoMatch) return `${isoMatch[3]}-${isoMatch[2]}-${isoMatch[1]}`
  }

  const fallback = fallbackIsoDate || new Date().toISOString().slice(0, 10)
  const isoMatch = fallback.match(ISO_DATE)
  if (isoMatch) return `${isoMatch[3]}-${isoMatch[2]}-${isoMatch[1]}`

  throw new Error(`deriveDateSlug: unable to parse date from updatedAt="${updatedAt}" fallback="${fallback}"`)
}

/**
 * Trunca string para tamanho máximo mantendo sufixo "…" se truncada.
 * Usado em executiveSummary para evitar campos excessivamente longos.
 */
export function truncate(s: string, max = 500): string {
  if (s.length <= max) return s
  return s.slice(0, max - 1) + '…'
}
