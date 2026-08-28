/**
 * Prova que o backup RESTAURA. Backup que ninguém tentou restaurar não é
 * backup, é esperança comprimida.
 *
 * O teste não confere bytes: confere se a série reconstruída a partir dos CSVs
 * responde a MESMA pergunta que o banco respondeu. A pergunta escolhida é a que
 * o AFOS de fato faz em produção e a que sustentou a manchete de 25/Jul/2026:
 * qual o maior gap Lula menos Flávio da série, e em que dia.
 *
 * Se o backup e o banco divergirem, o backup está inútil e é melhor descobrir
 * agora do que no dia em que o banco sumir.
 *
 * Uso:  npx tsx scripts/check-backup-restauravel.ts
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

import { readFileSync, readdirSync, existsSync } from 'fs'
import { gunzipSync } from 'zlib'
import { join } from 'path'

const RAIZ = 'backup/neon'
const SLUG = 'brazil-presidential-election'

/** CSV com aspas: precisa respeitar campo com vírgula e aspas escapadas. */
function lerCsv(texto: string): Array<Record<string, string>> {
  const linhas: string[][] = []
  let campo = '', linha: string[] = [], dentro = false
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i]
    if (dentro) {
      if (c === '"') { if (texto[i + 1] === '"') { campo += '"'; i++ } else dentro = false }
      else campo += c
    } else if (c === '"') dentro = true
    else if (c === ',') { linha.push(campo); campo = '' }
    else if (c === '\n') { linha.push(campo); linhas.push(linha); linha = []; campo = '' }
    else if (c !== '\r') campo += c
  }
  if (campo || linha.length) { linha.push(campo); linhas.push(linha) }
  const cols = linhas.shift()!
  return linhas.filter((l) => l.length === cols.length).map((l) => Object.fromEntries(cols.map((c, i) => [c, l[i]])))
}

function carregar(tabela: string): Array<Record<string, string>> {
  const dir = join(RAIZ, tabela)
  const solto = join(RAIZ, `${tabela}.csv.gz`)
  const out: Array<Record<string, string>> = []
  if (existsSync(dir)) {
    for (const f of readdirSync(dir).sort()) {
      out.push(...lerCsv(gunzipSync(readFileSync(join(dir, f))).toString('utf-8')))
    }
  } else if (existsSync(solto)) {
    out.push(...lerCsv(gunzipSync(readFileSync(solto)).toString('utf-8')))
  }
  return out
}

function picoDoGap(pontos: Array<{ dia: string; nome: string; preco: number }>) {
  const porDia = new Map<string, Record<string, number>>()
  for (const p of pontos) {
    if (!porDia.has(p.dia)) porDia.set(p.dia, {})
    porDia.get(p.dia)![p.nome] = p.preco     // ordem asc: último vence, é o fechamento
  }
  let max = -Infinity, dia = '', dias = 0
  for (const [d, v] of porDia) {
    const kl = Object.keys(v).find((n) => /^(Lula|Luiz In)/i.test(n))
    const kf = Object.keys(v).find((n) => /^Fl.vio Bolsonaro/i.test(n))
    if (!kl || !kf) continue
    dias++
    const g = v[kl] - v[kf]
    if (g > max) { max = g; dia = d }
  }
  return { max, dia, dias }
}

async function main() {
  // --- lado do BACKUP ---
  const mercados = carregar('market')
  const idsDoPresidencial = new Set(mercados.filter((m) => m.slug === SLUG).map((m) => m.id))
  const outcomes = carregar('marketOutcome')
  const nomePorOutcome = new Map<string, string>()
  for (const o of outcomes) {
    if (idsDoPresidencial.has(o.marketId)) nomePorOutcome.set(o.id, o.outcomeName)
  }
  const precos = carregar('marketPrice')
    .filter((p) => nomePorOutcome.has(p.outcomeId))
    .map((p) => ({ dia: p.snapshotAt.slice(0, 10), nome: nomePorOutcome.get(p.outcomeId)!, preco: Number(p.price) }))
    .sort((a, b) => a.dia.localeCompare(b.dia))
  const doBackup = picoDoGap(precos)

  console.log('RECONSTRUÍDO DO BACKUP (sem tocar no banco)')
  console.log(`  linhas de preço lidas : ${carregar('marketPrice').length.toLocaleString('pt-BR')}`)
  console.log(`  do mercado presidencial: ${precos.length.toLocaleString('pt-BR')}`)
  console.log(`  dias com os dois nomes : ${doBackup.dias}`)
  console.log(`  PICO de gap            : ${doBackup.max.toFixed(2)}pp em ${doBackup.dia}`)

  // --- lado do BANCO ---
  const { getPrisma } = await import('../lib/db')
  const prisma = getPrisma()
  if (!prisma) { console.error('\n⚠️  Sem banco: não dá para comparar. Rode com DATABASE_URL.'); process.exit(1) }
  const vivo = await prisma.marketPrice.findMany({
    where: { market: { slug: SLUG } },
    select: { price: true, snapshotAt: true, outcome: { select: { outcomeName: true } } },
    orderBy: { snapshotAt: 'asc' },
  })
  const doBanco = picoDoGap(vivo.map((p) => ({
    dia: p.snapshotAt.toISOString().slice(0, 10),
    nome: p.outcome?.outcomeName ?? '',
    preco: p.price,
  })))
  console.log('\nDIRETO DO BANCO')
  console.log(`  dias com os dois nomes : ${doBanco.dias}`)
  console.log(`  PICO de gap            : ${doBanco.max.toFixed(2)}pp em ${doBanco.dia}`)

  const bate = doBackup.dias === doBanco.dias
    && doBackup.dia === doBanco.dia
    && Math.abs(doBackup.max - doBanco.max) < 0.0001
  console.log('\n' + (bate
    ? '✅ O backup responde EXATAMENTE o mesmo que o banco. Restauração conferida.'
    : '❌ DIVERGIU. O backup não reproduz a série do banco e não serve para restaurar.'))
  await prisma.$disconnect()
  process.exit(bate ? 0 : 1)
}

main().catch((e) => { console.error('ERRO:', (e as Error).message.slice(0, 400)); process.exit(1) })
