/**
 * Conferência (dry-run) dos rótulos de faixa. Não grava nada.
 * Compara o rótulo ANTIGO (regra de 28/Jul) com o NOVO para cada pergunta viva
 * dos mercados de EUA e Brasil, e reprova se sobrar nome de emergência.
 */
import { extractCandidateName } from '../app/lib/polymarket/bootstrap'

// Réplica exata da função ANTES da correção de 29/Jul, para comparar.
function antigo(question: string): string {
  const q = question || ''
  const inflLess = q.match(/less than (\d+\.\d+%)/)
  if (inflLess) return `< ${inflLess[1]}`
  const inflRange = q.match(/between (\d+\.\d+%) and (\d+\.\d+%)/)
  if (inflRange) return `${inflRange[1]} – ${inflRange[2]}`
  const inflAbove = q.match(/at least (\d+\.\d+%)/)
  if (inflAbove) return `≥ ${inflAbove[1]}`
  const margemRange = q.match(/(Democratic|Republican) Party win the popular vote.*?by between (\d+)% and (\d+)%/)
  if (margemRange) return `${margemRange[1][0]}+${margemRange[2]}–${margemRange[3]}`
  const margemAcima = q.match(/(Democratic|Republican) Party win the popular vote.*?by (\d+)% or more/)
  if (margemAcima) return `${margemAcima[1][0]}+${margemAcima[2]} ou mais`
  const unidade = /House seats/.test(q) ? 'cad.' : /governorships/.test(q) ? 'gov.' : /Senate seats/.test(q) ? 'cad.' : null
  if (unidade) {
    const entre = q.match(/between (\d+) and (\d+)/)
    if (entre) return `${entre[1]}–${entre[2]} ${unidade}`
    const exato = q.match(/exactly (\d+) or (\d+)/)
    if (exato) return `${exato[1]} ou ${exato[2]} ${unidade}`
    const abaixo = q.match(/(?:below|fewer than|less than) (\d+)/)
    if (abaixo) return `< ${abaixo[1]} ${unidade}`
    const acima = q.match(/(?:above|more than|at least) (\d+)/)
    if (acima) return `> ${acima[1]} ${unidade}`
  }
  if (/votes cast/.test(q)) {
    const entre = q.match(/between (\d+)m and (\d+)m/)
    if (entre) return `${entre[1]}–${entre[2]}m votos`
    const menos = q.match(/less than (\d+)m/)
    if (menos) return `< ${menos[1]}m votos`
    const mais = q.match(/more than (\d+)m/)
    if (mais) return `> ${mais[1]}m votos`
  }
  if (/any other outcome/i.test(q)) return 'Outro resultado'
  const partyMatch = q.match(/Will (.+?) \((\w+)\) win the most seats/)
  if (partyMatch) return partyMatch[2]
  if (/STF|Justice.*removed.*impeachment/i.test(q)) return 'Yes (Impeachment)'
  const candMatch = q.match(/Will (.+?) (?:win|finish|be)/)
  if (candMatch) {
    const name = candMatch[1]
    if (name.includes('Carlos Roberto Massa')) return 'Ratinho Jr.'
    if (name.includes('Luiz Inácio Lula da Silva')) return 'Lula'
    return name.trim()
  }
  return q.slice(0, 50)
}

const SLUGS = [
  // EUA — midterms
  'which-party-will-win-the-house-in-2026',
  'which-party-will-win-the-senate-in-2026',
  'republican-senate-seats-after-the-2026-midterm-elections-927',
  'republican-house-seats-after-the-2026-midterm-elections',
  'how-many-republican-governors-after-the-2026-midterm-elections',
  '2026-midterms-house-popular-vote-margin-of-victory-224',
  '2026-midterms-house-turnout',
  'will-the-2026-midterm-elections-happen-as-scheduled',
  // Brasil — as 6, para provar que não regrediu
  'brazil-presidential-election',
  'brazil-presidential-election-first-round-2nd-place',
  'brazil-presidential-election-first-round-3rd-place',
  'any-brazil-stf-justice-removed-by-impeachment-before-2027',
  'next-brazil-senate-election-most-seats-won',
  'brazil-annual-inflation-2026',
]

const BASE = 'https://www.afos-analytics.com/api/polymarket/lookup?slug='

async function main() {
  let mudou = 0
  let emergencia = 0
  let colisoes = 0
  let brasilMudou = 0

  for (const slug of SLUGS) {
    const r = await fetch(BASE + encodeURIComponent(slug))
    const j: any = await r.json()
    const ev = j?.event
    if (!ev) {
      console.log(`\n### ${slug}\n  SEM RESPOSTA do proxy`)
      continue
    }
    const eBrasil = slug.startsWith('brazil') || slug.includes('brazil')
    console.log(`\n### ${ev.title}  ${eBrasil ? '[BR]' : '[US]'}`)
    const chaves = new Map<string, string>()
    for (const m of ev.markets || []) {
      if (!m.outcomePrices) continue // faixa sem preço, o proxy não traz
      const a = antigo(m.question)
      const n = extractCandidateName(m.question)
      const ehEmergencia = n.includes('…#')
      if (ehEmergencia) emergencia++
      if (chaves.has(n)) {
        colisoes++
        console.log(`  🔴 COLISÃO: "${n}" já usado por "${chaves.get(n)}"`)
      }
      chaves.set(n, m.question)
      const marca = a === n ? '     ' : ' MUDA'
      if (a !== n) {
        mudou++
        if (eBrasil) brasilMudou++
      }
      console.log(`  ${marca} ${ehEmergencia ? '🔴EMERG ' : ''}${(a || '(vazio)').padEnd(52)} →  ${n}`)
    }
  }

  console.log(`\n════ RESUMO ════`)
  console.log(`  rótulos que MUDAM: ${mudou}   (destes, no Brasil: ${brasilMudou})`)
  console.log(`  nomes de emergência restantes: ${emergencia}`)
  console.log(`  colisões de chave: ${colisoes}`)
  const ok = emergencia === 0 && colisoes === 0 && brasilMudou === 0
  console.log(ok ? '  ✅ PASSOU' : '  ❌ REPROVOU')
  process.exit(ok ? 0 : 1)
}

main().catch((e) => {
  console.error(String(e).slice(0, 500))
  process.exit(1)
})
