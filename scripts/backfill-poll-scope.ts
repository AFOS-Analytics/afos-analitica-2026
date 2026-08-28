/**
 * Backfill do campo `scope` (nacional×estadual) em research_findings (BRA).
 *
 * MOTIVO: a heurística antiga era `uf !== '' ? 'state' : 'national'`, mas o TSE
 * devolve uf="BR" para TODO o arquivo BRASIL.csv → 100% das pesquisas viravam
 * 'state' e nenhuma jamais 'national'. Pesquisas nacionais (Datafolha, MDA, Quaest,
 * Nexus, Gerp…) ficavam mascaradas como estaduais. Este script recalcula o escopo
 * a partir do universo declarado na metodologia/plano amostral (detectScope).
 *
 * ISOLADO: toca SOMENTE research_findings (countryCode='BRA'). NÃO toca Lead/Peru/Colombia.
 * Idempotente: re-rodar converge para o mesmo resultado.
 *
 * Uso: npx tsx scripts/backfill-poll-scope.ts            (dry-run, só relatório)
 *      npx tsx scripts/backfill-poll-scope.ts --apply    (grava no Neon)
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
import { classifyScope } from '../lib/tse/ingest'

const APPLY = process.argv.includes('--apply')

async function main() {
  const { getPrisma } = await import('../lib/db')
  const prisma = getPrisma()
  if (!prisma) throw new Error('prisma indisponível (DATABASE_URL?)')

  const findings = await prisma.researchFinding.findMany({
    where: { countryCode: 'BRA' },
    select: { id: true, title: true, normalizedPayload: true, rawPayload: true, source: { select: { name: true } } },
  })
  console.log(`research_findings BRA: ${findings.length}`)

  const counts: Record<string, number> = { national: 0, state: 0, unknown: 0 }
  const sourceCounts: Record<string, number> = {}
  const transitions: Record<string, number> = {}
  const nationalExamples: string[] = []
  let changed = 0, updated = 0

  for (const f of findings) {
    const np = (f.normalizedPayload as Record<string, unknown>) || {}
    const raw = (f.rawPayload as Record<string, unknown>) || {}
    const methodology = (np.methodology as string) || ''
    const samplingPlan = (np.samplingPlan as string) || ''
    // dado-município vive no rawPayload (não é espelhado no normalizedPayload).
    const dadoMunicipio = (raw.dadoMunicipio as string) || ''
    const oldScope = (np.scope as string) || '(none)'
    const { scope: newScope, source: newSource } = classifyScope(methodology, samplingPlan, dadoMunicipio)

    counts[newScope] = (counts[newScope] || 0) + 1
    sourceCounts[newSource] = (sourceCounts[newSource] || 0) + 1
    if (newScope === 'national' && nationalExamples.length < 20) {
      nationalExamples.push(`  • ${f.source?.name} [${f.title}] (via ${newSource})`)
    }

    const oldSource = (np.scopeSource as string) || '(none)'
    if (oldScope !== newScope || oldSource !== newSource) {
      changed++
      const key = `${oldScope} → ${newScope}`
      transitions[key] = (transitions[key] || 0) + 1
      if (APPLY) {
        await prisma.researchFinding.update({
          where: { id: f.id },
          data: { normalizedPayload: { ...np, scope: newScope, scopeSource: newSource } },
        })
        updated++
      }
    }
  }

  console.log('\n=== Distribuição recalculada ===')
  console.log(`  national: ${counts.national}`)
  console.log(`  state:    ${counts.state}`)
  console.log(`  unknown:  ${counts.unknown}`)
  console.log('\n=== scope_source (qual fonte decidiu) ===')
  for (const [k, v] of Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k}: ${v}`)
  }
  console.log('\n=== Transições de scope (antigo → novo) ===')
  for (const [k, v] of Object.entries(transitions).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k}: ${v}`)
  }
  console.log(`\n=== Exemplos classificados como NACIONAL (até 20) ===`)
  console.log(nationalExamples.join('\n') || '  (nenhum)')
  console.log(`\nlinhas que mudariam: ${changed}`)
  console.log(APPLY ? `✅ atualizadas: ${updated}` : '🔎 dry-run — use --apply para gravar')
  await prisma.$disconnect?.()
}
main().catch((e) => { console.error(e); process.exit(1) })
