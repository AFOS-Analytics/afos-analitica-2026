/**
 * Reparo de ENCODING + reclassificação de `scope` em research_findings (BRA).
 *
 * MOTIVO (incidente 12/Jul/2026): `lib/tse/ingest.ts` lia o CSV do TSE (latin-1) como
 * UTF-8 (`brasilFile.async('text')`). Todo acento virava caractere de substituição.
 * O classificador `scope.mjs` normaliza acentos, mas não consegue normalizar lixo,
 * então os sinais ACENTUADOS de universo nacional ("todas as regiões do Brasil",
 * "âmbito nacional", "país") nunca casavam. Os sinais de universo ESTADUAL são em
 * sua maioria sem acento ("no estado", "residentes no estado") e continuavam casando.
 * Efeito: viés sistemático que apagava NACIONAIS (viravam scope=unknown) e preservava
 * estaduais. A Gerp BR-03067/2026 (nacional, publicada 08/Jul) sumiu do dashboard assim.
 *
 * O `backfill-poll-scope.ts` NÃO resolve: ele reclassifica lendo o texto JÁ GRAVADO no
 * Neon, que está corrompido. E o cron de ingestão pula protocolos existentes
 * (`toInsert` filtra por protocolo), então re-rodar o refresh não reescreve o passado.
 * Este script rebusca da FONTE com o encoding corrigido e reescreve os payloads.
 *
 * ISOLADO: toca SOMENTE research_findings (countryCode='BRA'). Idempotente.
 *
 * Uso: npx tsx scripts/repair-tse-encoding-scope.ts            (dry-run, só relatório)
 *      npx tsx scripts/repair-tse-encoding-scope.ts --apply    (grava no Neon)
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
import { fetchTSEPolls, classifyScope } from '../lib/tse/ingest'

const APPLY = process.argv.includes('--apply')

// Caractere de substituição (U+FFFD) = marca do mojibake latin-1 lido como UTF-8.
const isMojibake = (s: string) => s.includes('�')

async function main() {
  const { getPrisma } = await import('../lib/db')
  const prisma = getPrisma()
  if (!prisma) throw new Error('prisma indisponível (DATABASE_URL?)')

  console.log('Rebuscando o CSV do TSE com encoding corrigido (latin-1)...')
  const polls = await fetchTSEPolls()
  console.log(`pesquisas presidenciais no CSV: ${polls.length}`)

  const byProtocolo = new Map(polls.map((p) => [p.protocolo, p]))

  const findings = await prisma.researchFinding.findMany({
    where: { countryCode: 'BRA' },
    select: { id: true, title: true, normalizedPayload: true, rawPayload: true },
  })
  console.log(`research_findings BRA no Neon: ${findings.length}\n`)

  const transitions: Record<string, number> = {}
  const recovered: string[] = []
  let mojibakeFixed = 0
  let scopeChanged = 0
  let updated = 0
  let notInCsv = 0

  for (const f of findings) {
    const poll = byProtocolo.get(f.title)
    if (!poll) { notInCsv++; continue }

    const np = (f.normalizedPayload as Record<string, unknown>) || {}
    const raw = (f.rawPayload as Record<string, unknown>) || {}

    const oldScope = (np.scope as string) || '(none)'
    const oldSource = (np.scopeSource as string) || '(none)'
    const oldMethodology = (np.methodology as string) || ''

    const { scope: newScope, source: newSource } = classifyScope(
      poll.metodologia, poll.planoAmostral, poll.dadoMunicipio,
    )

    const hadMojibake = isMojibake(oldMethodology) || isMojibake((np.samplingPlan as string) || '')
    const scopeMoved = oldScope !== newScope || oldSource !== newSource

    if (!hadMojibake && !scopeMoved) continue

    if (hadMojibake) mojibakeFixed++
    if (scopeMoved) {
      scopeChanged++
      const key = `${oldScope} → ${newScope}`
      transitions[key] = (transitions[key] || 0) + 1
      if (newScope === 'national' && oldScope !== 'national') {
        recovered.push(`  • ${poll.protocolo}  ${poll.instituto}  n=${poll.amostra}  div=${poll.divulgacao}  (via ${newSource})`)
      }
    }

    if (APPLY) {
      await prisma.researchFinding.update({
        where: { id: f.id },
        data: {
          rawPayload: {
            ...raw,
            metodologia: poll.metodologia,
            planoAmostral: poll.planoAmostral,
            sistemaControle: poll.controlSystem,
            dadoMunicipio: poll.dadoMunicipio,
            instituto: poll.instituto,
            estatistico: poll.estatistico,
          },
          normalizedPayload: {
            ...np,
            methodology: poll.metodologia,
            samplingPlan: poll.planoAmostral,
            controlSystem: poll.controlSystem,
            statistician: poll.estatistico,
            scope: newScope,
            scopeSource: newSource,
          },
        },
      })
      updated++
    }
  }

  console.log('=== Reparo de encoding ===')
  console.log(`  registros com mojibake no texto: ${mojibakeFixed}`)
  console.log(`  protocolos do Neon ausentes no CSV atual: ${notInCsv}`)
  console.log('\n=== Transições de scope (antigo → novo) ===')
  const ts = Object.entries(transitions).sort((a, b) => b[1] - a[1])
  console.log(ts.length ? ts.map(([k, v]) => `  ${k}: ${v}`).join('\n') : '  (nenhuma)')
  console.log(`\n=== NACIONAIS RECUPERADAS (estavam invisíveis) : ${recovered.length} ===`)
  console.log(recovered.join('\n') || '  (nenhuma)')
  console.log(`\nlinhas que mudariam: ${mojibakeFixed + scopeChanged > 0 ? Math.max(mojibakeFixed, scopeChanged) : 0} (mojibake ${mojibakeFixed} / scope ${scopeChanged})`)
  console.log(APPLY ? `✅ atualizadas: ${updated}` : '🔎 dry-run (use --apply para gravar)')
  await prisma.$disconnect?.()
}
main().catch((e) => { console.error(e); process.exit(1) })
