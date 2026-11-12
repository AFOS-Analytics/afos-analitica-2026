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
  // Tabela vazia vira arquivo vazio no backup: sem cabeçalho, sem linha.
  if (linhas.length === 0) return []
  const cols = linhas.shift()!
  // Linha com número de colunas diferente do cabeçalho era descartada CALADA.
  // Agora é contada, e qualquer descarte reprova a trava (12/Nov/2026, EVAL).
  const boas = linhas.filter((l) => l.length === cols.length)
  linhasDescartadas += linhas.length - boas.length
  return boas.map((l) => Object.fromEntries(cols.map((c, i) => [c, l[i]])))
}

let linhasDescartadas = 0

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

  const tabelasOk = await conferirTabelas(prisma)
  const seriesOk = await conferirSeriesVivas(prisma)

  await prisma.$disconnect()
  process.exit(bate && tabelasOk && seriesOk ? 0 : 1)
}

/**
 * 🔴 TODAS AS TABELAS, não só o mercado do Brasil (12/Nov/2026, EVAL).
 *
 * A pergunta do pico de gap acima lê só `brazil-presidential-election`, que
 * está congelado desde 02/Nov. Sozinha, a trava passava verde com qualquer
 * outra série quebrada: kalshiPreco, marketPrice da França e dos EUA. Aqui,
 * para cada tabela do backup:
 *   - nenhuma linha descartada pelo leitor de CSV;
 *   - tabela com carimbo de tempo: o banco tem EXATAMENTE as mesmas linhas até
 *     o último carimbo do backup (o que entrou depois é do cron, não falta);
 *   - tabela sem carimbo: mesma contagem, com folga só para crescimento.
 * ⚠️ O campo `linhas` do MANIFEST NÃO é usado: ele conta quebra de linha dentro
 * de campo e diverge do número real de registros (analysisReport/2026-08: 967
 * contra 175).
 */
const COLUNAS_DE_TEMPO = ['snapshotAt', 'createdAt', 'startedAt', 'publishedAt']
const FOLGA_SEM_CARIMBO = 5

function tabelasDoBackup(): string[] {
  return readdirSync(RAIZ)
    .filter((n) => existsSync(join(RAIZ, n)) && (n.endsWith('.csv.gz') || !n.includes('.')))
    .map((n) => n.replace(/\.csv\.gz$/, ''))
    .sort()
}

async function conferirTabelas(prisma: any): Promise<boolean> {
  console.log('\nTODAS AS TABELAS DO BACKUP contra o banco')
  let ok = true
  for (const tabela of tabelasDoBackup()) {
    const antes = linhasDescartadas
    const linhas = carregar(tabela)
    const descartadas = linhasDescartadas - antes
    const modelo = prisma[tabela]
    if (!modelo?.count) {
      console.log(`  ❌ ${tabela}: não existe modelo Prisma com esse nome`)
      ok = false
      continue
    }
    if (descartadas > 0) {
      console.log(`  ❌ ${tabela}: ${descartadas} linha(s) do CSV descartada(s) por número de colunas`)
      ok = false
    }
    const col = linhas.length ? COLUNAS_DE_TEMPO.find((c) => c in linhas[0] && linhas[0][c]) : undefined
    const particionada = !existsSync(join(RAIZ, `${tabela}.csv.gz`))
    if (particionada && col) {
      const maxBackup = linhas.reduce((m, l) => (l[col] > m ? l[col] : m), '')
      const corte = new Date(maxBackup)
      // `lt corte + 1 ms`: o banco guarda microssegundo e o CSV, milissegundo.
      const noBanco: number = await modelo.count({ where: { [col]: { lt: new Date(corte.getTime() + 1) } } })
      const agg = await modelo.aggregate({ _max: { [col]: true } })
      const maxBanco: Date | null = agg?._max?.[col] ?? null
      const atrasoMin = maxBanco ? (maxBanco.getTime() - corte.getTime()) / 60000 : 0
      const bate = noBanco === linhas.length
      if (!bate) ok = false
      console.log(
        `  ${bate ? '✅' : '❌'} ${tabela.padEnd(18)} backup ${String(linhas.length).padStart(7)} · banco até ${maxBackup} ${String(noBanco).padStart(7)}` +
        `  [${col}; banco vai até ${maxBanco ? maxBanco.toISOString() : 'n/d'}${atrasoMin > 120 ? `, ⚠️ ${atrasoMin.toFixed(0)} min além do backup` : ''}]`,
      )
    } else {
      const noBanco: number = await modelo.count()
      const bate = noBanco >= linhas.length && noBanco - linhas.length <= FOLGA_SEM_CARIMBO
      if (!bate) ok = false
      console.log(`  ${bate ? '✅' : '❌'} ${tabela.padEnd(18)} backup ${String(linhas.length).padStart(7)} · banco ${String(noBanco).padStart(7)}  [sem carimbo]`)
    }
  }
  console.log(ok ? '  ✅ Todas as tabelas conferem.' : '  ❌ Há tabela que o backup não reproduz.')
  return ok
}

/**
 * As séries VIVAS: o último preço de cada contrato precisa ser o mesmo no
 * backup e no banco. Janela de 7 dias até o último carimbo do backup, igual
 * dos dois lados. marketPrice dos mercados com `enabled` no registro, e
 * kalshiPreco por ticker.
 */
const JANELA_SERIE_MS = 7 * 864e5

type Ultimo = { em: string; preco: number }
function ultimosPorChave(linhas: Array<{ chave: string; em: string; preco: number }>): Map<string, Ultimo> {
  const m = new Map<string, Ultimo>()
  for (const l of linhas) {
    const a = m.get(l.chave)
    if (!a || l.em > a.em) m.set(l.chave, { em: l.em, preco: l.preco })
  }
  return m
}

function compararUltimos(rotulo: string, doBackup: Map<string, Ultimo>, doBanco: Map<string, Ultimo>): boolean {
  const erros: string[] = []
  for (const [k, b] of doBanco) {
    const x = doBackup.get(k)
    if (!x) erros.push(`${k}: no banco (${b.em} ${b.preco}) e ausente no backup`)
    else if (x.em !== b.em || Math.abs(x.preco - b.preco) > 1e-9) erros.push(`${k}: backup ${x.em} ${x.preco} · banco ${b.em} ${b.preco}`)
  }
  for (const k of doBackup.keys()) if (!doBanco.has(k)) erros.push(`${k}: no backup e ausente no banco`)
  const ok = erros.length === 0
  console.log(`  ${ok ? '✅' : '❌'} ${rotulo}: ${doBanco.size} contrato(s) com o último preço conferido`)
  for (const e of erros.slice(0, 10)) console.log(`     ${e}`)
  if (erros.length > 10) console.log(`     ... e mais ${erros.length - 10}`)
  return ok
}

async function conferirSeriesVivas(prisma: any): Promise<boolean> {
  console.log('\nSÉRIES VIVAS: último preço por contrato, backup contra banco')
  const { ELECTION_REGISTRY } = await import('../app/lib/polymarket/country-market-map')
  const vivos = new Set(ELECTION_REGISTRY.filter((e) => e.enabled !== false).map((e) => e.slug))
  let ok = true

  // --- marketPrice dos mercados vivos ---
  const precos = carregar('marketPrice')
  if (precos.length) {
    const corte = precos.reduce((m, l) => (l.snapshotAt > m ? l.snapshotAt : m), '')
    const inicio = new Date(new Date(corte).getTime() - JANELA_SERIE_MS).toISOString()
    const slugPorMercado = new Map(carregar('market').map((m) => [m.id, m.slug]))
    const doBackup = ultimosPorChave(
      precos
        .filter((p) => vivos.has(slugPorMercado.get(p.marketId) ?? '') && p.snapshotAt >= inicio && p.snapshotAt <= corte)
        .map((p) => ({ chave: p.outcomeId, em: p.snapshotAt, preco: Number(p.price) })),
    )
    const vivoNoBanco: Array<{ outcomeId: string; snapshotAt: Date; price: number }> = await prisma.marketPrice.findMany({
      where: { market: { slug: { in: [...vivos] } }, snapshotAt: { gte: new Date(inicio), lt: new Date(new Date(corte).getTime() + 1) } },
      select: { outcomeId: true, snapshotAt: true, price: true },
    })
    const doBanco = ultimosPorChave(vivoNoBanco.map((p) => ({ chave: p.outcomeId, em: p.snapshotAt.toISOString(), preco: p.price })))
    if (!compararUltimos(`marketPrice (${vivos.size} mercado(s) vivo(s))`, doBackup, doBanco)) ok = false
  }

  // --- kalshiPreco por ticker ---
  const kalshi = carregar('kalshiPreco')
  if (kalshi.length) {
    const corte = kalshi.reduce((m, l) => (l.snapshotAt > m ? l.snapshotAt : m), '')
    const inicio = new Date(new Date(corte).getTime() - JANELA_SERIE_MS).toISOString()
    const doBackup = ultimosPorChave(
      kalshi
        .filter((p) => p.snapshotAt >= inicio && p.snapshotAt <= corte)
        .map((p) => ({ chave: `${p.eventTicker}:${p.ticker}`, em: p.snapshotAt, preco: Number(p.preco) })),
    )
    const noBanco: Array<{ eventTicker: string; ticker: string; snapshotAt: Date; preco: number }> = await prisma.kalshiPreco.findMany({
      where: { snapshotAt: { gte: new Date(inicio), lt: new Date(new Date(corte).getTime() + 1) } },
      select: { eventTicker: true, ticker: true, snapshotAt: true, preco: true },
    })
    const doBanco = ultimosPorChave(noBanco.map((p) => ({ chave: `${p.eventTicker}:${p.ticker}`, em: p.snapshotAt.toISOString(), preco: p.preco })))
    if (!compararUltimos('kalshiPreco', doBackup, doBanco)) ok = false
  }
  return ok
}

main().catch((e) => { console.error('ERRO:', (e as Error).message.slice(0, 400)); process.exit(1) })
