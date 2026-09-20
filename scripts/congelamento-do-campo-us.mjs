#!/usr/bin/env node
/**
 * CONGELAMENTO DO CAMPO — a data de campo está travada há N registros. N é muito?
 *
 * Responde a pergunta que o `historico-us-polls.mjs` levanta e não fecha.
 * ⛔ USO INTERNO. A régua mora em lib/us-polls/congelamento-do-campo.mjs.
 *
 * Uso:
 *   node scripts/congelamento-do-campo-us.mjs
 *   node scripts/congelamento-do-campo-us.mjs --n=90
 */
import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { diagnosticarSerie } from '../lib/us-polls/historico.mjs'
import { medirCongelamento, VEREDITOS } from '../lib/us-polls/congelamento-do-campo.mjs'

config({ path: '.env.local' })

const opt = (nome, padrao) => {
  const a = process.argv.find((x) => x.startsWith(`--${nome}=`))
  return a ? a.slice(nome.length + 3) : padrao
}
const N = Number(opt('n', '90'))

async function main() {
  const url = (process.env.DATABASE_URL || '').replace(/\n$/, '').trim()
  if (!url) {
    console.error('❌ DATABASE_URL ausente. Ela vive no .env.local.')
    process.exit(1)
  }
  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: url }) })
  const rows = await prisma.analysisReport.findMany({
    where: { slug: { contains: 'us-generic-ballot' } },
    orderBy: { updatedAt: 'desc' },
    take: N,
    select: { slug: true, updatedAt: true, bodyMarkdown: true },
  })
  await prisma.$disconnect()

  const d = diagnosticarSerie(rows, new Date())
  const m = medirCongelamento(d.registros)

  console.log(`\n🧊 CONGELAMENTO DA DATA DE CAMPO  [USO INTERNO, nao publicar]`)
  console.log(`   ${d.total} registro(s) lidos do Neon (teto ${N})`)
  if (d.total === N) console.log(`   ⚠️ a consulta ENCOSTOU no teto: pode haver travamento mais antigo fora desta leitura`)

  if (!m.atual) {
    console.log(`\n⚠️  ${m.veredito}: ${m.motivo}\n`)
    process.exit(0)
  }

  console.log(`\n   ATUAL: campo travado em ${m.atual.campo} ha ${m.atual.n} registro(s), desde ${m.atual.de}`)
  console.log(`   ⚠️ e este bloco esta ABERTO: ele ainda vai crescer, entao comparar com blocos ja fechados favorece o atual`)

  if (m.anteriores?.length) {
    console.log(`\n   TRAVAMENTOS ANTERIORES completos, do mais recente para tras:`)
    for (const b of m.anteriores.slice().reverse().slice(0, 12)) {
      console.log(`      ${String(b.n).padStart(2)} registro(s)  em ${b.campo}  (${b.de} a ${b.ate})`)
    }
    if (m.cortadoNaBorda) {
      console.log(`      ⚠️ o bloco MAIS ANTIGO da leitura ficou de fora: ele comeca antes do primeiro registro lido, entao o tamanho dele e PISO`)
    }
  }

  const icone = m.veredito === VEREDITOS.DENTRO ? '✅' : m.veredito === VEREDITOS.INDETERMINADO ? '⚠️ ' : '🔴'
  console.log(`\n${icone} VEREDITO: ${m.veredito}`)
  console.log(`   ${m.motivo}`)

  console.log(`\n   ⛔ Isto descreve a cadencia com que o INDICE recebe pesquisa, nao a`)
  console.log(`      cadencia com que os institutos publicam. Travamento curto nao prova`)
  console.log(`      que o mundo parou, e travamento longo nao prova que o indice falhou.\n`)

  process.exit(0)
}

main().catch((e) => {
  console.error(`❌ NAO MEDIU: ${e?.message ?? e}`)
  process.exit(1)
})
