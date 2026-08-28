/**
 * Enriquece o Neon (schema research) com os campos públicos completos do TSE:
 * metodologia (sem truncar), plano amostral, sistema de controle, estatístico, CONRE, CNPJ —
 * mesclados no normalizedPayload de cada research_finding, casados por protocolo (title).
 *
 * ISOLADO: toca SOMENTE research_findings (countryCode='BRA'). NÃO toca Lead, Peru, Colombia.
 * Idempotente: re-rodar só sobrescreve os mesmos campos.
 *
 * Uso: npx tsx scripts/enrich-neon-tse.ts [--apply]   (sem --apply = dry-run)
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
import { readFileSync } from 'fs'
import { join } from 'path'

const APPLY = process.argv.includes('--apply')
const norm = (s: string) => (s || '').toUpperCase().replace(/[^A-Z0-9]/g, '')

async function main() {
  const { getPrisma } = await import('../lib/db')
  const prisma = getPrisma()
  if (!prisma) throw new Error('prisma indisponível (DATABASE_URL?)')
  const reg = JSON.parse(readFileSync(join(process.cwd(), 'hf-assets', 'polls', 'tse-registry.json'), 'utf-8')).records as any[]
  const byP = new Map(reg.map((r) => [norm(r.register_tse), r]))

  const findings = await prisma.researchFinding.findMany({
    where: { countryCode: 'BRA' },
    select: { id: true, title: true, normalizedPayload: true },
  })
  console.log(`research_findings BRA: ${findings.length} | registry: ${reg.length}`)

  let matched = 0, updated = 0
  for (const f of findings) {
    const r = byP.get(norm(f.title || ''))
    if (!r) continue
    matched++
    const enrich = {
      cnpj: r.cnpj || null,
      statistician: r.statistician || null,
      conre: r.conre || null,
      ownPoll: r.own_poll === 'S',
      methodology: r.methodology || null,       // completo, sem truncar
      samplingPlan: r.sampling_plan || null,     // desenho de ponderação demográfica/geográfica
      controlSystem: r.control_system || null,
      tseEnrichedFrom: 'dadosabertos.tse.jus.br (Lei 9.504/97 art. 33)',
    }
    if (APPLY) {
      const merged = { ...(f.normalizedPayload as object || {}), ...enrich }
      await prisma.researchFinding.update({ where: { id: f.id }, data: { normalizedPayload: merged } })
      updated++
    }
  }
  console.log(`casados por protocolo: ${matched}/${findings.length}`)
  console.log(APPLY ? `✅ atualizados: ${updated}` : '🔎 dry-run (use --apply para gravar)')
  await prisma.$disconnect?.()
}
main().catch((e) => { console.error(e); process.exit(1) })
