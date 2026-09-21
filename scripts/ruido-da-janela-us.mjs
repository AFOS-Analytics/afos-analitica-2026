#!/usr/bin/env node
/**
 * RUÍDO DA JANELA — a mecânica dos 30 dias alcança o movimento que a série mostrou?
 *
 * Põe lado a lado dois números que já existiam em scripts diferentes e nunca
 * tinham sido comparados:
 *   · a amplitude que `projetar-janela-us.mjs` produz com ZERO pesquisa nova
 *   · a amplitude que a série gravada no Neon efetivamente mostrou
 *
 * ⛔ USO INTERNO, não publicar. A regra mora em lib/us-polls/ruido-da-janela.mjs,
 *    e o porquê inteiro está no cabeçalho dela.
 *
 * Uso:
 *   node scripts/ruido-da-janela-us.mjs
 *   node scripts/ruido-da-janela-us.mjs --n=90          # ENCURTA a serie de proposito, para exercitar o piso
 *   node scripts/ruido-da-janela-us.mjs --arquivo=x.json
 */
import { readFileSync } from 'fs'
import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { projetarJanela } from '../lib/us-polls/projecao.mjs'
import { diagnosticarSerie } from '../lib/us-polls/historico.mjs'
import { amplitudeObservada, compararRuido, VEREDITOS } from '../lib/us-polls/ruido-da-janela.mjs'

// O .env.local nao e carregado no shell: quem le o Neon carrega por conta.
config({ path: '.env.local' })

const opt = (nome, padrao) => {
  const a = process.argv.find((x) => x.startsWith(`--${nome}=`))
  return a ? a.slice(nome.length + 3) : padrao
}
// 🔴 O teto NAO e o tamanho da serie de hoje, e essa foi a licao de 20/Set/2026.
// Ele nascia em 45 porque 45 era o que a consulta devolvia em 19/Set, e a serie
// ja tinha 52: o corte comeu 30/Jul, que era o MAXIMO, e a amplitude publicada
// saiu 1,69pp quando a verdadeira era 1,82pp. Teto calibrado no comprimento de
// hoje ja nasce cortando amanha, porque a serie cresce 1 linha por dia.
// 400 e folga deliberada, mais de um ano de gravacao diaria, e quem o alcancar
// vai ser avisado: o veredito degrada em vez de sair inteiro sobre base cortada.
const N = Number(opt('n', '400'))
const ARQUIVO = opt('arquivo', 'public/us-polls-data.json')

const fmt = (v) => (typeof v !== 'number' ? 'n/d' : v >= 0 ? `D+${v.toFixed(2)}` : `R+${Math.abs(v).toFixed(2)}`)

async function main() {
  const url = (process.env.DATABASE_URL || '').replace(/\n$/, '').trim()
  if (!url) {
    console.error('❌ DATABASE_URL ausente. Ela vive no .env.local, que nao e carregado no shell.')
    process.exit(1)
  }

  let dados
  try {
    dados = JSON.parse(readFileSync(ARQUIVO, 'utf8'))
  } catch (e) {
    console.error(`❌ NAO LEU ${ARQUIVO}: ${e.message}`)
    process.exit(1)
  }

  const proj = projetarJanela(dados)

  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: url }) })
  const rows = await prisma.analysisReport.findMany({
    where: { slug: { contains: 'us-generic-ballot' } },
    orderBy: { updatedAt: 'desc' },
    take: N,
    select: { slug: true, updatedAt: true, bodyMarkdown: true },
  })
  await prisma.$disconnect()

  const d = diagnosticarSerie(rows, new Date())
  const obs = amplitudeObservada(d.registros)
  // A consulta pede os N mais recentes: devolver exatamente N quer dizer que
  // pode haver mais passado atras do teto, e a amplitude observada e um PISO.
  const truncada = d.total === N
  const cmp = compararRuido(proj, obs, { truncada })

  console.log(`\n🎚️ RUIDO DA JANELA x MOVIMENTO OBSERVADO  [USO INTERNO, nao publicar]`)
  console.log(`   arquivo ${ARQUIVO} · janela de ${proj.janelaDias} dias · ${N} registro(s) pedidos ao Neon`)

  console.log(`\n   🔮 MECANISMO, com ZERO pesquisa nova (contrafactual congelado)`)
  console.log(`      a vantagem servida passearia de ${fmt(proj.vantagemMin)} a ${fmt(proj.vantagemMax)}`)
  console.log(`      amplitude: ${proj.amplitudePp === null ? 'n/d' : proj.amplitudePp.toFixed(2) + 'pp'}`)
  if (proj.esvaziaEm) console.log(`      e a janela esvazia em ${proj.esvaziaEm}`)

  console.log(`\n   📊 OBSERVADO, na serie gravada no Neon`)
  console.log(`      ${obs.n} registro(s) usaveis${obs.descartados ? `, ${obs.descartados} descartado(s) por ilegivel ou vantagem nao numerica` : ''}`)
  if (obs.n > 0) {
    console.log(`      de ${fmt(obs.min)} em ${obs.emMin} a ${fmt(obs.max)} em ${obs.emMax}`)
    console.log(`      amplitude: ${obs.amplitudePp.toFixed(2)}pp`)
  }
  if (truncada) {
    console.log(`      ⚠️ a consulta ENCOSTOU no teto de ${N}: a serie real pode ser mais longa, e a amplitude observada e PISO`)
    console.log(`         refazer com --n=${N * 4} antes de usar qualquer frase daqui`)
  }

  const ICONES = {
    [VEREDITOS.MECANISMO_ALCANCA]: '🔴',
    [VEREDITOS.MECANISMO_ALCANCA_SOBRE_PISO]: '⚠️ ',
    [VEREDITOS.OBSERVADO_MAIOR]: '✅',
    [VEREDITOS.INDETERMINADO]: '⚠️ ',
  }
  const icone = ICONES[cmp.veredito] ?? '⚠️ '
  console.log(`\n${icone} VEREDITO: ${cmp.veredito}`)
  console.log(`   ${cmp.motivo}`)
  if (cmp.razao !== null) console.log(`   o mecanismo alcanca ${cmp.razao}x a amplitude observada`)

  console.log(`\n   ⛔ ISTO NAO E "sinal contra ruido". A amplitude observada JA CONTEM a`)
  console.log(`      mecanica da janela, entao ela nao e sinal puro. E a projecao e um`)
  console.log(`      contrafactual congelado: supoe nenhuma pesquisa nova por 30 dias, o`)
  console.log(`      que a seis semanas da eleicao nao vai acontecer. Ela mede o que o`)
  console.log(`      mecanismo PODE fazer, nao o que vai fazer.\n`)

  // Saída 0 sempre: isto é medidor, não portão. Nada aqui reprova publicação.
  process.exit(0)
}

main().catch((e) => {
  console.error(`❌ NAO MEDIU: ${e?.message ?? e}`)
  process.exit(1)
})
