/**
 * Email domain typo suggestion — lightweight mailcheck alternative.
 *
 * Sugere correção quando o domínio é muito parecido (Levenshtein ≤ 2) a um
 * domínio conhecido. Cobre casos comuns: gamil.com, gmai.com, hotmial.com,
 * yaho.com, outlok.com, etc.
 */

const KNOWN_DOMAINS = [
  'gmail.com',
  'googlemail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com',
  'yahoo.com.br',
  'icloud.com',
  'live.com',
  'msn.com',
  'uol.com.br',
  'bol.com.br',
  'terra.com.br',
  'protonmail.com',
  'proton.me',
  'aol.com',
]

function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  const prev = new Array(b.length + 1)
  for (let j = 0; j <= b.length; j++) prev[j] = j
  for (let i = 1; i <= a.length; i++) {
    let curr = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      const next = Math.min(curr + 1, prev[j] + 1, prev[j - 1] + cost)
      prev[j - 1] = curr
      curr = next
    }
    prev[b.length] = curr
  }
  return prev[b.length]
}

export function suggestEmailCorrection(email: string): string | null {
  if (!email || typeof email !== 'string') return null
  const trimmed = email.trim().toLowerCase()
  const atIdx = trimmed.lastIndexOf('@')
  if (atIdx <= 0 || atIdx === trimmed.length - 1) return null

  const local = trimmed.slice(0, atIdx)
  const domain = trimmed.slice(atIdx + 1)
  if (!domain.includes('.')) return null

  // Exact match — sem sugestão
  if (KNOWN_DOMAINS.includes(domain)) return null

  let best: { domain: string; dist: number } | null = null
  for (const known of KNOWN_DOMAINS) {
    const d = levenshtein(domain, known)
    if (d === 0) return null
    if (d <= 2 && (!best || d < best.dist)) best = { domain: known, dist: d }
  }

  if (!best) return null
  return `${local}@${best.domain}`
}
