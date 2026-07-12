/**
 * Audita (somente leitura) as transições de escopo entre o que está gravado no Neon
 * e o que o classificador ATUAL produz a partir da fonte TSE. Lista caso a caso, com
 * o texto do universo declarado, para inspeção humana antes de qualquer --apply.
 *
 * Uso: npx tsx scripts/audit-scope-transitions.ts
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
import { fetchTSEPolls, classifyScope } from '../lib/tse/ingest'

async function main() {
  const { prisma } = await import('../lib/db')
  if (!prisma) throw new Error('prisma indisponível (DATABASE_URL?)')

  const polls = await fetchTSEPolls()
  const byProtocolo = new Map(polls.map((p) => [p.protocolo, p]))

  const findings = await prisma.researchFinding.findMany({
    where: { countryCode: 'BRA' },
    select: { title: true, normalizedPayload: true },
  })

  for (const f of findings) {
    const poll = byProtocolo.get(f.title)
    if (!poll) continue
    const np = (f.normalizedPayload as Record<string, unknown>) || {}
    const oldScope = (np.scope as string) || '(none)'
    const { scope: newScope, source } = classifyScope(poll.metodologia, poll.planoAmostral, poll.dadoMunicipio)
    if (oldScope === newScope) continue

    const texto = { methodology: poll.metodologia, sampling_plan: poll.planoAmostral, dado_municipio: poll.dadoMunicipio }[source] || poll.metodologia || poll.dadoMunicipio || ''
    console.log(`\n${oldScope} -> ${newScope}   ${poll.protocolo}  ${poll.instituto}`)
    console.log(`   n=${poll.amostra}  div=${poll.divulgacao}  via=${source}`)
    console.log(`   universo: "${texto.replace(/\s+/g, ' ').slice(0, 180)}"`)
  }
  await prisma.$disconnect?.()
}
main().catch((e) => { console.error(e); process.exit(1) })
