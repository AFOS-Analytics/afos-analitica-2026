/**
 * persist-afos-weekly.ts — arquiva edições do AFOS Weekly no Neon.
 *
 * Uso:
 *   npx tsx scripts/persist-afos-weekly.ts 2026-08-06
 *   npx tsx scripts/persist-afos-weekly.ts               # todas as edições
 *   npx tsx scripts/persist-afos-weekly.ts 2026-08-06 --pais=us
 *
 * ⚠️ DUAS DIFERENÇAS em relação ao `persist-afos-tradeoff.ts`, e as duas seguem
 * o desenho deste produto:
 *
 * 1. 🔴 **O arquivo de origem está em INGLÊS.** `{data}.md` é o canônico e as
 *    traduções levam sufixo `.pt-BR` / `.es`. Este script arquiva a ORIGEM, que
 *    é a peça que existe sempre.
 * 2. 📁 **Todo país tem subpasta**, inclusive o primeiro.
 *
 * 📌 RASCUNHO TAMBÉM É ARQUIVADO, de propósito. O snapshot registra o que a
 * edição era naquele momento, incluindo `status: draft`. Arquivar só o publicado
 * perderia a versão que foi revisada e discutida, que é justamente a que explica
 * decisões editoriais depois.
 *
 * Slug pela DATA DA EDIÇÃO, não pela captura, mesma correção aplicada ao
 * Tradeoff em 03/Ago/2026: os dois produtos publicam num dia e medem no anterior.
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { upsertAnalysisReport } from '../lib/analysis/persist'
import { assertDatabaseUrl } from '../lib/db-url-validator'

const RAIZ = join(process.cwd(), 'public', 'afos-weekly')
const PAIS_PADRAO = 'us'

function str(v: unknown, fb = ''): string {
  return typeof v === 'string' ? v : fb
}

/** "AFOS Weekly №1 · US · edição 06/08/2026 · captura 03/08/2026, 06:24 UTC" */
export function buildWeeklyTitle(fm: Record<string, unknown>, dateIso: string, pais: string): string {
  const [y, m, d] = dateIso.split('-')
  const edicao = y && m && d ? `${d}/${m}/${y}` : dateIso
  const n = typeof fm.issueNumber === 'number' ? `№${fm.issueNumber} · ` : ''
  const captura = str(fm.updatedAt)
  return `AFOS Weekly ${n}${pais.toUpperCase()} · edição ${edicao}${captura ? ` · captura ${captura}` : ''}`
}

async function persistOne(prisma: PrismaClient, path: string, dateIso: string, pais: string) {
  const parsed = matter(readFileSync(path, 'utf-8'))
  const fm = parsed.data as Record<string, unknown>

  const completo = `---\n${Object.entries(fm)
    .map(([k, v]) =>
      typeof v === 'object' && v !== null
        ? `${k}: ${JSON.stringify(v)}`
        : `${k}: ${typeof v === 'string' ? JSON.stringify(v) : v}`,
    )
    .join('\n')}\n---\n\n${parsed.content}`

  const tldr = Array.isArray(fm.tldr) ? (fm.tldr as string[]) : []

  const data = {
    date: dateIso,
    pais,
    updatedAt: str(fm.updatedAt, dateIso),
    title: str(fm.title, `AFOS Weekly — ${dateIso}`),
    locale: str(fm.locale, 'en'),
    status: str(fm.status, 'draft'),
    // O primeiro marcador do TL;DR é o resumo da edição, equivalente do lede.
    lede: tldr[0] ?? '',
    markdown: completo,
  }

  const r = await upsertAnalysisReport(prisma, 'afos-weekly', data, {
    createdBy: 'afos-weekly',
    fallbackIsoDate: dateIso,
    slugIsoDate: dateIso,
    // 🔴 Os EUA NÃO levam qualificador, os outros países levam, igual ao
    // `persist-afos-tradeoff.ts`. Sem esta linha o slug era `afos-weekly-DD-MM-AAAA`
    // para QUALQUER país: como o upsert é por slug, um Weekly de outro país na
    // mesma quinta sobrescreveria o americano sem erro nenhum. Aqui é no-op
    // enquanto `us` for o padrão, e as edições №1 a №3 já arquivadas seguem
    // com o slug sem país, sem virar órfãs.
    slugQualifier: pais === PAIS_PADRAO ? undefined : pais,
    titleOverride: buildWeeklyTitle(fm, dateIso, pais),
  })
  return { slug: r.slug, id: r.id, status: data.status }
}

async function main() {
  const url = process.env.DATABASE_URL
  assertDatabaseUrl(url, 'DATABASE_URL')

  const args = process.argv.slice(2)
  const alvo = args.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a))
  const pais = args.find((a) => a.startsWith('--pais='))?.split('=')[1] ?? PAIS_PADRAO
  const dir = join(RAIZ, pais)

  if (!existsSync(dir)) {
    console.error(`SEM PASTA: ${dir}`)
    process.exit(1)
  }

  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: url }) })
  console.log(`\n💾 Arquivando AFOS Weekly ${pais.toUpperCase()} no Neon\n`)

  const arquivos = alvo
    ? [`${alvo}.md`]
    : readdirSync(dir)
        .filter((f) => f.endsWith('.md') && !f.includes('.pt-BR.') && !f.includes('.es.'))
        .sort()

  let ok = 0
  for (const f of arquivos) {
    const dateIso = f.replace('.md', '')
    try {
      const { slug, id, status } = await persistOne(prisma, join(dir, f), dateIso, pais)
      console.log(`✅ ${f.padEnd(16)} slug=${slug} (id=${id.slice(0, 8)}…) status=${status}`)
      ok++
    } catch (e) {
      console.error(`❌ ${f}: ${e instanceof Error ? e.message : e}`)
    }
  }

  console.log(`\n✨ ${ok}/${arquivos.length} arquivados.\n`)
  await prisma.$disconnect()
}

// Guarda contra efeito de import, mesma razão do persist do Tradeoff: este
// módulo exporta `buildWeeklyTitle`, e sem isto um script de ensaio que a
// importasse dispararia a gravação.
if (/persist-afos-weekly\.ts$/.test(process.argv[1] ?? '')) {
  main().catch((e) => {
    console.error(e)
    process.exit(1)
  })
}
