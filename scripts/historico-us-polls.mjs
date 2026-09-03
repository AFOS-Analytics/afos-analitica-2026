/**
 * HISTÓRICO do generic ballot dos EUA, lido do Neon.
 *
 * ⚠️ POR QUE ESTE SCRIPT EXISTE. O `public/us-polls-data.json` é uma fotografia:
 * ele diz como a base está, e não diz como ela chegou lá. Quem tem a série é o
 * Neon, um registro por dia, gravado pelo cron das 07:10Z. Em 31/Ago/2026 foi
 * essa série que mostrou que a média tinha caído de 22 pesquisas para 15 sem
 * NENHUMA pesquisa nova entrar: o que se moveu foi a borda da janela.
 *
 * 🔑 LÊ O BANCO VIVO, NÃO O BACKUP. O backup roda uma vez por dia e tem cauda
 * cega de até 24h. Para "desde quando isto está assim", a cauda cega é
 * exatamente o pedaço que importa.
 * Ver memory/feedback_o_backup_tem_uma_cauda_cega_de_ate_um_dia.md
 *
 * ⛔ O QUE ELE NÃO FAZ: não escreve nada, em lugar nenhum. É leitura pura.
 *
 * ✅ E ELE FECHA O CONTROLE DA PROJEÇÃO. Depois de imprimir a série, reaplica a
 * `media()` de produção sobre a base de HOJE nos dias já gravados e põe o
 * resultado ao lado do registrado. Isso só é comparável enquanto `linhasLidas`
 * não muda, então a conferência para sozinha no dia em que a base era outra, em
 * vez de acusar diferença que é da base e não da conta.
 *
 * Uso:
 *   node scripts/historico-us-polls.mjs
 *   node scripts/historico-us-polls.mjs --n=60
 */
import { config } from 'dotenv'
config({ path: '.env.local' })

import { readFileSync } from 'fs'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { diagnosticarSerie, ORIGENS } from '../lib/us-polls/historico.mjs'
import { mediaEm } from '../lib/us-polls/projecao.mjs'

const args = process.argv.slice(2)
const opt = (nome, padrao) => {
  const a = args.find((x) => x.startsWith(`--${nome}=`))
  return a ? a.slice(nome.length + 3) : padrao
}
const N = Number(opt('n', '45'))
const ARQUIVO = opt('arquivo', 'public/us-polls-data.json')

const fmt = (v) => (typeof v !== 'number' ? '  n/d  ' : v >= 0 ? `D+${v.toFixed(2)}` : `R+${Math.abs(v).toFixed(2)}`)

async function main() {
  const url = (process.env.DATABASE_URL || '').replace(/\\n$/, '').replace(/\n$/, '').trim()
  if (!url) {
    console.error('❌ DATABASE_URL ausente. Ela vive no .env.local, que nao e carregado no shell.')
    process.exit(1)
  }
  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: url }) })

  // O tipo nao e coluna: ele esta no slug, montado por deriveDateSlug.
  const rows = await prisma.analysisReport.findMany({
    where: { slug: { contains: 'us-generic-ballot' } },
    orderBy: { updatedAt: 'desc' },
    take: N,
    select: { slug: true, updatedAt: true, bodyMarkdown: true },
  })
  await prisma.$disconnect()

  const d = diagnosticarSerie(rows, new Date())

  console.log(`\n🗂️ HISTORICO DO GENERIC BALLOT NO NEON  [USO INTERNO, nao publicar]`)
  console.log(`   ${d.total} registro(s) lido(s), teto da consulta ${N}`)
  if (d.total === N) console.log(`   ⚠️ a consulta ENCOSTOU no teto: pode haver registro mais antigo fora desta leitura`)
  if (d.ilegiveis) console.log(`   🔴 ${d.ilegiveis} registro(s) com corpo ilegivel, listados abaixo`)

  console.log(`\n   gravado (UTC)       | dia        | lidas | pub | n  | inst | vantagem | desde      | campo+recente`)
  for (const r of d.registros) {
    if (r.ilegivel) {
      console.log(`   ${String(r.gravadoEm).slice(0, 19)} | 🔴 ILEGIVEL ${r.slug}: ${r.motivo}`)
      continue
    }
    console.log(
      `   ${String(r.gravadoEm).slice(0, 19)} | ${r.lastUpdate} | ${String(r.linhasLidas).padStart(5)} | ${String(r.publicadas).padStart(3)} | ${String(r.nPesquisas).padStart(2)} | ${String(r.nInstitutos).padStart(4)} | ${fmt(r.vantagemDem).padStart(8)} | ${r.desde} | ${r.campoMaisRecente}`
    )
  }

  console.log(`\n   📌 gravacao de hoje: ${d.hoje.origem}`)
  console.log(`      ${d.hoje.nota}`)
  if (d.hoje.origem === ORIGENS.AUSENTE) {
    console.log(`      🔴 o painel esta servindo o registro de outro dia. Ver o passo 3 do /atualizar-pesquisas-usa.`)
  }
  if (d.hoje.origem === ORIGENS.AGUARDANDO) {
    console.log(`      ✅ nada a fazer: forcar agora gravaria um registro que o cron sobrescreve as 07:10Z.`)
  }

  if (d.indice) {
    console.log(
      `\n   🧊 indice: ${d.indice.valor} linhas lidas ha ${d.indice.registros} registro(s) seguidos, desde ${d.indice.desde}` +
        (d.indice.cobreASerieInteira ? ' (cobre a serie INTEIRA lida: pode ser mais antigo)' : '')
    )
  } else {
    console.log(`\n   🧊 indice: INDETERMINADO, menos de dois registros legiveis`)
  }
  if (d.campo) {
    console.log(`   🧊 campo mais recente travado em ${d.campo.valor} ha ${d.campo.registros} registro(s), desde ${d.campo.desde}`)
  }
  if (d.lacunas.length) {
    console.log(`   🕳️ ${d.lacunas.length} dia(s) SEM registro no meio da serie: ${d.lacunas.join(', ')}`)
    console.log(`      dia sem registro e dia em que nem o cron gravou nem ninguem forcou.`)
  } else {
    console.log(`   ✅ nenhum dia sem registro no intervalo lido`)
  }

  // ── Controle da projecao: a mesma conta, nos dias que ja foram gravados ──
  let dados
  try {
    dados = JSON.parse(readFileSync(ARQUIVO, 'utf8'))
  } catch (e) {
    console.log(`\n   ⚠️ nao deu para abrir ${ARQUIVO} (${e.message}): o controle da projecao NAO foi feito.`)
    return
  }
  const legiveis = d.registros.filter((r) => !r.ilegivel && r.linhasLidas != null)
  const baseDeHoje = legiveis[0]?.linhasLidas
  const comparaveis = []
  for (const r of legiveis) {
    if (r.linhasLidas !== baseDeHoje) break
    comparaveis.push(r)
  }

  console.log(`\n   🔬 CONTROLE: a regra de hoje reaplicada aos dias ja gravados`)
  console.log(`      comparavel so enquanto linhasLidas = ${baseDeHoje}, o que da ${comparaveis.length} dia(s)`)
  let divergencias = 0
  for (const r of comparaveis) {
    const m = mediaEm(dados.polls ?? [], r.lastUpdate, dados?.mediaAfos?.janelaDias ?? 30)
    const bate = m && m.nPesquisas === r.nPesquisas && m.nInstitutos === r.nInstitutos && m.vantagemDem === r.vantagemDem
    if (!bate) divergencias++
    console.log(
      `      ${bate ? '✅' : '❌'} ${r.lastUpdate}  gravado n=${r.nPesquisas} inst=${r.nInstitutos} ${fmt(r.vantagemDem)}  |  recomputado ${m ? `n=${m.nPesquisas} inst=${m.nInstitutos} ${fmt(m.vantagemDem)}` : 'SEM MEDIA'}`
    )
  }
  if (comparaveis.length < 2) {
    console.log(`      ⚠️ menos de dois dias comparaveis: o controle NAO valida nada hoje.`)
  } else if (divergencias) {
    console.log(`      🔴 ${divergencias} divergencia(s): a projecao de janela NAO esta validada. Nao usar o numero dela.`)
    process.exitCode = 1
  } else {
    console.log(`      ✅ ${comparaveis.length} de ${comparaveis.length}: a mesma conta reproduz o registrado, entao a projecao vale.`)
  }
  console.log('')
}

main().catch((e) => {
  console.error('❌ falhou:', e?.message ?? e)
  process.exit(1)
})
