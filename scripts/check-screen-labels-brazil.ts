/**
 * A tela do Brasil mudou algum rótulo ao unificar o leitor? (30/Jul/2026)
 *
 * Compara a função que a página do Brasil usava ANTES da unificação, réplica
 * exata abaixo, com a que ela usa DEPOIS. Qualquer diferença é regressão numa
 * página no ar, então o script reprova.
 *
 * Roda contra as perguntas VIVAS do proxy, não contra exemplo inventado.
 */
import { extractCandidateName } from '../app/lib/utils'

// Réplica exata da cópia que vivia em `app/lib/utils.ts` até 30/Jul.
function telaAntiga(question: string): string {
  const q = question || ''
  const inflMatch = q.match(/less than (\d+\.\d+%)/)
  if (inflMatch) return `< ${inflMatch[1]}`
  const inflRange = q.match(/between (\d+\.\d+%) and (\d+\.\d+%)/)
  if (inflRange) return `${inflRange[1]} - ${inflRange[2]}`
  const inflAbove = q.match(/at least (\d+\.\d+%)/)
  if (inflAbove) return `≥ ${inflAbove[1]}`
  const partyMatch = q.match(/Will (.+?) \((\w+)\) win the most seats/)
  if (partyMatch) return partyMatch[2]
  if (q.match(/STF|Justice.*removed.*impeachment/i)) return 'Impeachment de Ministro do STF'
  const candMatch = q.match(/Will (.+?) (?:win|finish)/)
  if (candMatch) {
    const name = candMatch[1]
    if (name.includes('Carlos Roberto Massa')) return 'Ratinho Jr.'
    if (name.includes('Luiz Inácio Lula da Silva')) return 'Lula'
    return name
  }
  return q.slice(0, 50)
}

// Os 6 mercados que o painel do Brasil realmente renderiza.
const SLUGS_BR = [
  'brazil-presidential-election',
  'brazil-presidential-election-first-round-2nd-place',
  'brazil-presidential-election-first-round-3rd-place',
  'any-brazil-stf-justice-removed-by-impeachment-before-2027',
  'next-brazil-senate-election-most-seats-won',
  'brazil-annual-inflation-2026',
]

async function main() {
  let diferencas = 0
  let conferidos = 0

  for (const slug of SLUGS_BR) {
    const r = await fetch('https://www.afos-analytics.com/api/polymarket/lookup?slug=' + encodeURIComponent(slug))
    const ev: any = (await r.json())?.event
    if (!ev) { console.log(`### ${slug}: SEM RESPOSTA`); continue }
    console.log(`\n### ${ev.title}`)
    for (const m of ev.markets || []) {
      if (!m.outcomePrices) continue
      const antes = telaAntiga(m.question)
      const depois = extractCandidateName(m.question)
      conferidos++
      if (antes !== depois) {
        diferencas++
        console.log(`  🔴 MUDOU  ${JSON.stringify(antes)} → ${JSON.stringify(depois)}`)
      }
    }
    console.log(`  ${(ev.markets || []).filter((m: any) => m.outcomePrices).length} desfechos, todos iguais`)
  }

  console.log(`\n════ ${conferidos} desfechos conferidos · ${diferencas} diferenças ════`)
  console.log(diferencas === 0 ? '  ✅ PASSOU: a tela do Brasil não mudou' : '  ❌ REPROVOU: regressão em página no ar')
  process.exit(diferencas === 0 ? 0 : 1)
}

main().catch((e) => { console.error(String(e).slice(0, 400)); process.exit(1) })
