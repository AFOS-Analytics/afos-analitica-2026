import { config } from 'dotenv'
config({ path: '.env.local' })

import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'

/** O Brasil é o país padrão e o único que fica na RAIZ de `public/afos-tradeoff`. */
const PAIS_PADRAO = 'br'
import matter from 'gray-matter'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { upsertAnalysisReport } from '../lib/analysis/persist'
import { assertDatabaseUrl } from '../lib/db-url-validator'

function parseFrontmatter(md: string): { fm: Record<string, unknown>; body: string } {
  const parsed = matter(md)
  return { fm: parsed.data as Record<string, unknown>, body: parsed.content }
}

function str(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback
}

/**
 * Título do snapshot, com as DUAS datas rotuladas.
 *
 * "AFOS Tradeoff №11 · edição 03/08/2026 · captura 02/08/2026, 19:47"
 *
 * O rótulo existe porque as duas datas diferem por desenho e o formato antigo
 * ("AFOS Tradeoff — 02/08/2026, 19:47") mostrava só a captura, sem dizer que
 * era captura, o que lia como se a edição fosse de 02/08.
 */
export function buildTradeoffTitle(fm: Record<string, unknown>, dateIso: string, pais = PAIS_PADRAO): string {
  const [y, m, d] = dateIso.split('-')
  const edicao = y && m && d ? `${d}/${m}/${y}` : dateIso
  const n = typeof fm.issueNumber === 'number' ? `№${fm.issueNumber} · ` : ''
  const captura = str(fm.updatedAt)
  // O país entra no título porque duas edições podem ter a MESMA data de edição,
  // e sem ele o rótulo do backup público não diz de qual país a peça é.
  const p = pais === PAIS_PADRAO ? '' : `${pais.toUpperCase()} · `
  return `AFOS Tradeoff ${n}${p}edição ${edicao}${captura ? ` · captura ${captura}` : ''}`
}

async function persistOne(prisma: PrismaClient, filePath: string, dateIso: string, pais: string) {
  const raw = readFileSync(filePath, 'utf-8')
  const { fm, body } = parseFrontmatter(raw)

  // Tradeoff stores rich structured frontmatter (summaryCards, antiAvg, scenarios,
  // indicatorGrid, liquidity, calendar, watchList, additionalReading). For Neon
  // persistence, capture the full file (frontmatter + body) so the snapshot
  // preserves everything needed to re-render the edition later if the .md is lost.
  const fullMarkdown = `---\n${Object.entries(fm).map(([k, v]) =>
    typeof v === 'object' && v !== null ? `${k}: ${JSON.stringify(v)}` : `${k}: ${typeof v === 'string' ? JSON.stringify(v) : v}`
  ).join('\n')}\n---\n\n${body}`

  const data = {
    date: dateIso,
    updatedAt: str(fm.updatedAt, dateIso),
    title: str(fm.title, `AFOS Tradeoff — ${dateIso}`),
    locale: str(fm.locale, 'pt-BR'),
    lede: str(fm.sinalDaSemana),
    markdown: fullMarkdown,
  }

  // O slug sai da DATA DA EDIÇÃO (nome do arquivo), não do `updatedAt`. No
  // Tradeoff as duas são diferentes por desenho: a edição sai na segunda e o
  // snapshot de mercado é do domingo, então sem `slugIsoDate` a edição de
  // 03/Ago era gravada como `afos-tradeoff-02-08-2026`.
  const result = await upsertAnalysisReport(prisma, 'afos-tradeoff', data, {
    createdBy: 'afos-tradeoff',
    fallbackIsoDate: dateIso,
    slugIsoDate: dateIso,
    // 🔴 O Brasil NÃO leva qualificador, os outros países levam. Ver o comentário
    // em `lib/analysis/persist.ts`: as edições brasileiras já arquivadas usam o
    // slug sem país, e mudá-lo agora deixaria 11 registros órfãos.
    slugQualifier: pais === PAIS_PADRAO ? undefined : pais,
    titleOverride: buildTradeoffTitle(fm, dateIso, pais),
  })

  return { slug: result.slug, id: result.id }
}

async function main() {
  const url = process.env.DATABASE_URL
  assertDatabaseUrl(url, 'DATABASE_URL')

  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: url }) })
  console.log('\n💾 Persistindo AFOS Tradeoff no Neon\n')

  const args = process.argv.slice(2)
  const targetArg = args.find(a => /^\d{4}-\d{2}-\d{2}$/.test(a))
  const pais = args.find(a => a.startsWith('--pais='))?.split('=')[1] ?? PAIS_PADRAO

  // 📁 Pasta assimétrica, igual à do publicador: o Brasil fica na RAIZ e cada
  // país novo ganha subpasta. Antes deste conserto o script ignorava `--pais` em
  // silêncio, lia a raiz e, num dia em que Brasil e EUA publicam na mesma data,
  // respondia "✅ persistido" tendo regravado a edição BRASILEIRA.
  const dir = pais === PAIS_PADRAO
    ? join(process.cwd(), 'public', 'afos-tradeoff')
    : join(process.cwd(), 'public', 'afos-tradeoff', pais)

  if (!existsSync(dir)) {
    console.error(`SEM PASTA: ${dir}`)
    process.exit(1)
  }

  let files: string[]
  if (targetArg) {
    files = [`${targetArg}.md`]
    if (!existsSync(join(dir, files[0]))) {
      console.error(`SEM ARQUIVO: ${join(dir, files[0])}`)
      process.exit(1)
    }
  } else {
    files = readdirSync(dir).filter(f => f.endsWith('.md') && !f.includes('.en.') && !f.includes('.es.')).sort()
  }

  console.log(`   país=${pais} · pasta=${dir}\n`)

  let ok = 0
  for (const f of files) {
    const dateIso = f.replace('.md', '')
    const path = join(dir, f)
    try {
      const { slug, id } = await persistOne(prisma, path, dateIso, pais)
      console.log(`✅ ${f.padEnd(18)} slug=${slug} (id=${id.slice(0, 8)}…)`)
      ok++
    } catch (e) {
      console.error(`❌ ${f}: ${e instanceof Error ? e.message : e}`)
    }
  }

  console.log(`\n✨ ${ok}/${files.length} persistidos no Neon.\n`)
  await prisma.$disconnect()
}

// ⚠️ NÃO chamar main() no topo sem guarda. Este módulo exporta
// `buildTradeoffTitle`, e em 02/Ago/2026 um script de ENSAIO importou essa
// função só para comparar títulos: o import executou o main() e a rodada de
// conferência GRAVOU no Neon. Ensaio que escreve não é ensaio. Com a guarda,
// importar o módulo é livre de efeito e só a execução direta persiste.
const executadoDireto = /persist-afos-tradeoff\.ts$/.test(process.argv[1] ?? '')
if (executadoDireto) {
  main().catch((e) => { console.error(e); process.exit(1) })
}
