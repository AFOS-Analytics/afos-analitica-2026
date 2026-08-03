/**
 * Arquiva a coleta de imprensa dos EUA em disco, a partir do que está no Neon.
 *
 * POR QUE EXISTE
 * Duas necessidades diferentes, atendidas pelo mesmo passo:
 *
 * 1. **Dataset.** A coleta de imprensa é sinal do AFOS como as pesquisas e o
 *    mercado, e até 03/Ago/2026 ela só existia em linha de banco. Linha de banco
 *    é sobrescrita pelo upsert do dia e não dá diff. O arquivo datado dá.
 *
 * 2. **Piso de leitura.** `lib/dashboard/us-press-data.ts` cai para
 *    `public/us-press-data.json` quando não consegue ler o banco, em vez de
 *    apagar a seção do painel. Sem este script aquele piso nunca existiria.
 *
 * CONTRATO, igual ao do dataset do Hugging Face
 * O arquivo da data **corrente** pode ser regerado no dia, porque a coleta roda
 * mais de uma vez. **Data encerrada nunca é reescrita.** Erro em data passada se
 * corrige por errata, não por reescrita, senão a série deixa de ser auditável.
 *
 * Uso:
 *   npx tsx scripts/snapshot-us-press.ts            # ensaio, não escreve
 *   npx tsx scripts/snapshot-us-press.ts --apply
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

const APLICAR = process.argv.includes('--apply')
const DIR_ARQUIVO = join(process.cwd(), 'public', 'us-press-archive')
const PISO = join(process.cwd(), 'public', 'us-press-data.json')

/** `us-press-02-08-2026` → `2026-08-02`, para o arquivo ordenar sozinho. */
function isoDoSlug(slug: string): string | null {
  const m = slug.match(/^us-press-(\d{2})-(\d{2})-(\d{4})$/)
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null
}

function hojeUtc(): string {
  return new Date().toISOString().slice(0, 10)
}

async function main() {
  const { prisma } = await import('../lib/db')
  if (!prisma) { console.error('SEM BANCO: DATABASE_URL ausente ou inválida'); process.exit(1) }

  const rows = await prisma.analysisReport.findMany({
    where: { slug: { startsWith: 'us-press-' } },
    select: { slug: true, bodyMarkdown: true, publishedAt: true },
    orderBy: { slug: 'asc' },
  })

  console.log(`\n${APLICAR ? '✍️  APLICANDO' : '🧪 ENSAIO'} — ${rows.length} coletas no Neon\n`)
  if (!rows.length) { console.log('nada a arquivar'); await prisma.$disconnect(); return }

  if (APLICAR && !existsSync(DIR_ARQUIVO)) mkdirSync(DIR_ARQUIVO, { recursive: true })

  const hoje = hojeUtc()
  let novos = 0, regerados = 0, preservados = 0, invalidos = 0
  let maisRecente: { iso: string; payload: unknown } | null = null

  for (const r of rows) {
    const iso = isoDoSlug(r.slug)
    if (!iso) { console.log(`  ⏭️  ${r.slug}  slug fora do padrão`); continue }

    let payload: Record<string, unknown>
    try {
      payload = JSON.parse(r.bodyMarkdown ?? '{}')
    } catch {
      console.log(`  ⛔ ${iso}  bodyMarkdown ilegível`); invalidos++; continue
    }
    const itens = Array.isArray(payload.itens) ? payload.itens.length : -1
    const veics = Array.isArray(payload.veiculos) ? payload.veiculos.length : -1
    if (itens < 0 || veics < 0) { console.log(`  ⛔ ${iso}  forma inválida`); invalidos++; continue }

    if (!maisRecente || iso > maisRecente.iso) maisRecente = { iso, payload }

    const destino = join(DIR_ARQUIVO, `${iso}.json`)
    const jaExiste = existsSync(destino)

    if (jaExiste && iso !== hoje) {
      // Data encerrada. Não se reescreve, nem que o conteúdo tenha mudado.
      const atual = readFileSync(destino, 'utf-8')
      const novo = JSON.stringify(payload, null, 2) + '\n'
      const marca = atual === novo ? 'idêntico' : '⚠️  DIFERE do banco, preservado'
      console.log(`  🔒 ${iso}  ${String(itens).padStart(3)} itens  data encerrada, ${marca}`)
      preservados++
      continue
    }

    const acao = jaExiste ? 'regerado (data corrente)' : 'NOVO'
    console.log(`  ${jaExiste ? '♻️ ' : '✅'} ${iso}  ${String(itens).padStart(3)} itens · ${veics} veículos  ${acao}`)
    if (APLICAR) writeFileSync(destino, JSON.stringify(payload, null, 2) + '\n', 'utf-8')
    if (jaExiste) regerados++; else novos++
  }

  if (maisRecente) {
    console.log(`\npiso de leitura: public/us-press-data.json ← coleta de ${maisRecente.iso}`)
    if (APLICAR) writeFileSync(PISO, JSON.stringify(maisRecente.payload, null, 2) + '\n', 'utf-8')
  }

  console.log(`\n${novos} novos · ${regerados} regerados · ${preservados} preservados · ${invalidos} inválidos`)
  if (APLICAR) {
    const total = readdirSync(DIR_ARQUIVO).filter(f => f.endsWith('.json')).length
    console.log(`arquivo em disco: ${total} coletas`)
  } else {
    console.log('\nrodar de novo com --apply para gravar\n')
  }

  await prisma.$disconnect()
}

main().catch(e => { console.error('ERRO:', (e as Error).message.slice(0, 400)); process.exit(1) })
