/**
 * expurgar-precos-contaminados.ts · remove do Neon um DIA inteiro da série de
 * preços, depois de gravar a trilha de auditoria do que sai.
 *
 * 🔴 POR QUE EXISTE, e o único caso até hoje: 28/Abr/2026.
 *
 * Achado em 04/Set/2026 ao construir o `serie-do-contrato.mjs`. Naquele dia,
 * a partir das 11:45 UTC, o coletor passou a gravar valores perto de 50% para
 * livros sem relação nenhuma entre si, no mesmo segundo: Aldo Rebelo, o STF,
 * Colômbia, Rússia, primária republicana do Texas, eleição suplementar
 * australiana, e os DOIS lados do Senado americano ao mesmo tempo.
 *
 * 📏 A assinatura, medida sobre os 971 instantes do backup com 20 pontos ou
 * mais: a fração de pontos entre 49% e 51% tem mediana 0,0% e p99 8,7%. Nos
 * instantes de 28/Abr ela chega a 91,8% e 100,0%.
 *
 * 🕳️ E NÃO é um valor fixo de recuo: é um SALTO para ~50 seguido de DECAIMENTO
 * de volta, com duração diferente por livro. Medido:
 *
 *   PSDB no Senado   0,6 -> 49,5 (12:40) -> 24,1 -> 13,3 -> estabiliza ~9   (3h)
 *   Lula no 3º lugar 0,6 -> 49,5 (11:45) -> 49,5 -> 8,8 -> 5,3 -> 0,8       (5h)
 *   Inflação 5,5-6%  6,0 -> 50,0 (12:10) -> 50,0 -> 45,6 -> 21,5 -> 12,7    (8h)
 *
 * ⚠️ É por isso que o corte é o DIA e não uma janela de horas. Qualquer
 * fronteira dentro do dia é arbitrária, porque cada livro termina de decair
 * numa hora diferente, e separar cauda de movimento real não tem teste. A
 * fronteira do dia não é arbitrária, e o custo é 1 dia numa série de ~145.
 *
 * ⛔ Decisão do André em 04/Set/2026: dia inteiro, DELETE físico.
 *
 * 🔑 O QUE ESTE SCRIPT GARANTE
 * - ensaio por padrão; só grava com `--apply`
 * - grava a trilha ANTES de apagar, e se recusa a apagar sem ela
 * - recusa dia recente, para não morder a série viva por engano
 * - recusa contagem zero, que seria data errada digitada
 *
 * Uso:
 *   npx tsx scripts/expurgar-precos-contaminados.ts --dia=2026-04-28
 *   npx tsx scripts/expurgar-precos-contaminados.ts --dia=2026-04-28 --apply
 */

import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const DIR_ERRATA = 'data/erratas'
/** Dia com menos de 30 dias é série viva: não se expurga por script. */
const DIAS_DE_PROTECAO = 30

function arg(n: string): string | undefined {
  return process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3)
}

async function principal() {
  const dia = arg('dia')
  const aplicar = process.argv.includes('--apply')
  const motivo =
    arg('motivo') ??
    'salto simultaneo para ~50% em livros sem relacao, seguido de decaimento; medido em 04/Set/2026'

  if (!dia || !/^\d{4}-\d\d-\d\d$/.test(dia)) {
    console.error('❌ passar --dia=YYYY-MM-DD. Este script nunca escolhe a data sozinho.')
    process.exit(1)
  }

  const idadeDias = (Date.now() - Date.parse(`${dia}T00:00:00Z`)) / 86400000
  if (idadeDias < DIAS_DE_PROTECAO) {
    console.error(
      `❌ ${dia} tem ${idadeDias.toFixed(0)} dia(s) e a proteção é de ${DIAS_DE_PROTECAO}.\n` +
        `   Série recente não se expurga por script: o defeito recente se conserta na coleta.`
    )
    process.exit(1)
  }

  const { getPrisma } = await import('../lib/db')
  const prisma = getPrisma()
  if (!prisma) {
    console.error('❌ SEM BANCO: DATABASE_URL ausente ou inválida')
    process.exit(1)
  }

  const de = new Date(`${dia}T00:00:00.000Z`)
  const ate = new Date(de.getTime() + 86400000)
  const janela = { snapshotAt: { gte: de, lt: ate } }

  const total = await prisma.marketPrice.count()
  const alvo = await prisma.marketPrice.count({ where: janela })

  console.log(`\n🧹 EXPURGO DE PREÇOS CONTAMINADOS · ${dia} UTC\n`)
  console.log(`   banco: ${total.toLocaleString('pt-BR')} pontos no total`)
  console.log(`   alvo:  ${alvo.toLocaleString('pt-BR')} pontos em ${dia}  (${((100 * alvo) / total).toFixed(2)}% da série)`)

  if (alvo === 0) {
    console.log(`\n   ⚠️ nenhum ponto nesse dia. Data errada, ou o expurgo já rodou.\n`)
    await prisma.$disconnect()
    return
  }

  // A trilha leva a linha INTEIRA, mais o nome do livro e do desfecho, para o
  // registro fazer sentido sem precisar do banco que acabou de perder a linha.
  const linhas = await prisma.marketPrice.findMany({
    where: janela,
    orderBy: { snapshotAt: 'asc' },
    include: { market: { select: { slug: true, title: true } }, outcome: { select: { outcomeName: true } } },
  })

  const livros = new Set(linhas.map((l) => l.market?.slug ?? '?'))
  const perto50 = linhas.filter((l) => l.price >= 49 && l.price <= 51).length
  console.log(`   livros afetados: ${livros.size}`)
  console.log(`   pontos entre 49% e 51%: ${perto50} (${((100 * perto50) / alvo).toFixed(1)}%), contra mediana 0,0% e p99 8,7% da série`)

  if (!existsSync(DIR_ERRATA)) mkdirSync(DIR_ERRATA, { recursive: true })
  const caminho = join(DIR_ERRATA, `precos-${dia}.json`)
  const trilha = {
    dia,
    removidoEm: new Date().toISOString(),
    motivo,
    decisao: 'André, 04/Set/2026: dia inteiro, DELETE físico',
    totalRemovido: alvo,
    totalNoBancoAntes: total,
    livrosAfetados: [...livros].sort(),
    pontosEntre49e51: perto50,
    linhas: linhas.map((l) => ({
      id: l.id,
      slug: l.market?.slug ?? null,
      outcome: l.outcome?.outcomeName ?? null,
      price: l.price,
      volume: l.volume,
      liquidity: l.liquidity,
      snapshotAt: l.snapshotAt.toISOString(),
      sourceType: l.sourceType,
      dedupHash: l.dedupHash,
      marketId: l.marketId,
      outcomeId: l.outcomeId,
    })),
  }

  if (!aplicar) {
    console.log(`\n   ENSAIO. Nada foi gravado e nada foi apagado.`)
    console.log(`   A trilha iria para ${caminho}, com as ${alvo} linhas inteiras.`)
    console.log(`\n   rodar de novo com --apply para expurgar\n`)
    await prisma.$disconnect()
    return
  }

  // 🔑 A trilha vai ao disco ANTES do DELETE. Sem ela, o expurgo não acontece.
  writeFileSync(caminho, JSON.stringify(trilha, null, 2), 'utf8')
  if (!existsSync(caminho)) {
    console.error(`❌ a trilha não foi gravada em ${caminho}. NADA foi apagado.`)
    await prisma.$disconnect()
    process.exit(1)
  }
  console.log(`\n   💾 trilha gravada: ${caminho}  (${alvo} linhas inteiras)`)

  const r = await prisma.marketPrice.deleteMany({ where: janela })
  const depois = await prisma.marketPrice.count()
  console.log(`   🧹 removidos: ${r.count.toLocaleString('pt-BR')}`)
  console.log(`   banco agora: ${depois.toLocaleString('pt-BR')} pontos  (${total - depois} a menos)`)

  const sobrou = await prisma.marketPrice.count({ where: janela })
  console.log(`   ${sobrou === 0 ? '✅' : '❌'} pontos restantes em ${dia}: ${sobrou}`)

  console.log(`\n   ⚠️ Falta regerar o backup versionado:  npx tsx scripts/backup-neon.ts --apply\n`)
  await prisma.$disconnect()
  process.exit(sobrou === 0 ? 0 : 1)
}

principal().catch((e) => {
  console.error('❌', e)
  process.exit(1)
})
