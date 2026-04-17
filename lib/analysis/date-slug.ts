const PT_BR_DATE = /^(\d{2})\/(\d{2})\/(\d{4})/
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})/

export function deriveDateSlug(
  data: Record<string, unknown>,
  fallbackIsoDate?: string,
): string {
  const updatedAt = typeof data.updatedAt === 'string' ? data.updatedAt : undefined

  if (updatedAt) {
    const pt = updatedAt.match(PT_BR_DATE)
    if (pt) return `${pt[1]}-${pt[2]}-${pt[3]}`
    const iso = updatedAt.match(ISO_DATE)
    if (iso) return `${iso[3]}-${iso[2]}-${iso[1]}`
  }

  const iso = (fallbackIsoDate && ISO_DATE.test(fallbackIsoDate))
    ? fallbackIsoDate
    : new Date().toISOString().slice(0, 10)
  const m = iso.match(ISO_DATE) as RegExpMatchArray
  return `${m[3]}-${m[2]}-${m[1]}`
}

export function truncate(s: string, max = 500): string {
  return s.length <= max ? s : s.slice(0, max - 1) + '…'
}
