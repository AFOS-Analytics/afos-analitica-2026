/**
 * redigir-cpf-neon.ts — remove CPF de pessoa física do texto livre JÁ GRAVADO no
 * Neon, na tabela que a API pública serve.
 *
 * Uso:
 *   npx tsx scripts/redigir-cpf-neon.ts            # ENSAIO, não grava
 *   npx tsx scripts/redigir-cpf-neon.ts --apply    # grava
 *
 * 🔴 POR QUE ISTO EXISTE (22/Ago/2026). A redação de CPF de 04/Ago (ERR-2026-002)
 * foi instalada no caminho do Hugging Face (`redigir-cpf-tse-registry.mjs`) e no
 * backup (`backup-neon.ts`). O caminho de ESCRITA no banco ficou de fora, e
 * `/api/polls/tse` devolve `methodology`, `samplingPlan`, `statistician` e
 * `controlSystem`, que é o texto livre onde o TSE publica o CPF do estatístico
 * responsável. Medido antes da correção: 7 registros com CPF no banco e 2 CPFs
 * VÁLIDOS sendo servidos pela API, um deles na janela padrão de 15 dias.
 *
 * ✅ O `lib/tse/persist.ts` já redige na ORIGEM desde 22/Ago, então nada NOVO
 * entra sujo. Este script trata o passivo, que a trava nova não alcança.
 *
 * ⚖️ POR QUE AQUI SE REESCREVE, se a regra 1 de feedback_cpf_regras_permanentes
 * manda PRESERVAR o publicado: aquela regra foi escrita para o histórico do git
 * e para as revisões do Hugging Face, onde reescrever é destrutivo, quebra todo
 * clone existente e o próprio remédio chama atenção para o dado. Banco vivo
 * servindo API é o caso oposto: a linha corrigida passa a ser servida na próxima
 * leitura, nenhum consumidor quebra, e ninguém fica sabendo. O espírito da regra
 * (minimização silenciosa protege mais a pessoa) manda redigir aqui.
 * ⛔ Decidido pelo André em 22/Ago. Não estender a outras tabelas sem ordem.
 *
 * 🧩 Importa o PRIMITIVO ÚNICO. Não reimplementar: foi cópia divergente da regra
 * que deixou CPF cru três meses no backup público.
 * ⚖️ CNPJ FICA (identifica empresa). NOME do estatístico FICA (atuação
 * profissional). Sai só o CPF.
 */
import { config } from 'dotenv'
config({ path: '.env.local' })

import { acharCpf, redigirCpf } from './lib/cpf.mjs'

// Os campos de texto livre nas duas cópias do payload. `rawPayload` usa os nomes
// do TSE em português; `normalizedPayload` usa os nomes da API, que são os que
// vazam. Os dois são tratados: deixar o raw sujo manteria o dado no banco e no
// próximo backup.
const CAMPOS_RAW = ['metodologia', 'planoAmostral', 'sistemaControle', 'estatistico']
const CAMPOS_NORM = ['methodology', 'samplingPlan', 'controlSystem', 'statistician']

const APLICAR = process.argv.includes('--apply')

function limpar(obj: Record<string, unknown> | null, campos: string[]) {
  if (!obj) return { novo: obj, n: 0 }
  let n = 0
  const novo: Record<string, unknown> = { ...obj }
  for (const c of campos) {
    if (typeof novo[c] !== 'string') continue
    const r = redigirCpf(novo[c] as string)
    if (r.n > 0) { novo[c] = r.saida; n += r.n }
  }
  return { novo, n }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL ausente. Nada foi lido nem gravado.')
    process.exit(1)
  }
  const { PrismaClient } = await import('@prisma/client')
  const { PrismaNeon } = await import('@prisma/adapter-neon')
  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }) })

  console.log(APLICAR ? '💾 GRAVANDO' : '🔵 ENSAIO: nada será gravado')

  const todos = await prisma.researchFinding.findMany({
    select: { id: true, title: true, rawPayload: true, normalizedPayload: true },
  })
  console.log(`   registros lidos: ${todos.length}`)

  const alvos: { id: string; title: string; raw: unknown; norm: unknown; n: number }[] = []
  for (const r of todos) {
    const raw = limpar(r.rawPayload as Record<string, unknown> | null, CAMPOS_RAW)
    const norm = limpar(r.normalizedPayload as Record<string, unknown> | null, CAMPOS_NORM)
    const n = raw.n + norm.n
    if (n > 0) alvos.push({ id: r.id, title: r.title, raw: raw.novo, norm: norm.novo, n })
  }

  console.log(`   registros com CPF: ${alvos.length}  (${alvos.reduce((s, a) => s + a.n, 0)} ocorrências)`)
  for (const a of alvos) console.log(`     ${a.title}  ${a.n} ocorrência(s)`)

  if (!alvos.length) { console.log('✅ nada a redigir.'); await prisma.$disconnect(); return }
  if (!APLICAR) { console.log('\n🔵 ENSAIO encerrado. Repita com --apply para gravar.'); await prisma.$disconnect(); return }

  let gravados = 0
  for (const a of alvos) {
    await prisma.researchFinding.update({
      where: { id: a.id },
      data: { rawPayload: a.raw as never, normalizedPayload: a.norm as never },
    })
    gravados++
  }
  console.log(`✅ ${gravados} registro(s) atualizado(s).`)

  // 🔒 Conferência DEPOIS de gravar, relendo do banco. Confiar no que acabei de
  // escrever é comparar a leitura consigo mesma.
  const reler = await prisma.researchFinding.findMany({
    where: { id: { in: alvos.map((a) => a.id) } },
    select: { title: true, rawPayload: true, normalizedPayload: true },
  })
  let restante = 0
  for (const r of reler) {
    const txt = [...CAMPOS_RAW.map((c) => String((r.rawPayload as never as Record<string, unknown>)?.[c] ?? '')),
                 ...CAMPOS_NORM.map((c) => String((r.normalizedPayload as never as Record<string, unknown>)?.[c] ?? ''))].join('\n')
    restante += acharCpf(txt).length
  }
  console.log(restante === 0 ? '✅ conferido relendo do banco: 0 CPF restante.' : `❌ ainda restam ${restante}. NÃO tratar como concluído.`)
  await prisma.$disconnect()
  if (restante > 0) process.exit(1)
}

main().catch((e) => { console.error('❌ falhou:', e?.message ?? e); process.exit(1) })
