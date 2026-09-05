/**
 * defasagem-do-arquivo-imprensa.ts · o arquivo da imprensa guarda o dia INTEIRO
 * ou o instante em que alguém rodou o arquivador?
 *
 * 🔑 POR QUE EXISTE. O `snapshot-us-press.ts` avisa "⚠️ DIFERE do banco,
 * preservado" e essa linha não diz se a diferença é de um carimbo ou do
 * CONTEÚDO. Medido em 05/Set/2026: são as MATÉRIAS. Em 2 de 38 datas o arquivo
 * e o banco não têm uma única URL em comum.
 *
 * ⚙️ A mecânica, e ela não é defeito de ninguém: o cron coleta 3x por dia
 * (07:20, 13:20 e 19:20 UTC) e o arquivador congela o que existir NA HORA em
 * que é chamado. Sessão que roda de madrugada BRT cai no começo do dia UTC, e
 * aquela data fecha guardando a PRIMEIRA coleta, não a última. A correlação é
 * direta: arquivo tirado às 19:20 ou depois bate 10/10; tirado às 02:00 bate
 * 0/10.
 *
 * ⛔ NÃO CONSERTA NADA, e isso é deliberado. O contrato da casa é que data
 * encerrada não se reescreve, e correção de data passada é ERRATA. Este script
 * só torna a divergência visível e mensurável, para a decisão ser tomada com
 * número na mão.
 *
 * ✅ Reusa `isoDoSlug` do próprio arquivador, em vez de redigitar a conversão
 * de slug DD-MM-AAAA para ISO.
 *
 * Uso:
 *   npx tsx scripts/defasagem-do-arquivo-imprensa.ts
 *   npx tsx scripts/defasagem-do-arquivo-imprensa.ts --so-divergentes
 */
import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'
import { isoDoSlug } from './snapshot-us-press'

const DIR = join(process.cwd(), 'public', 'us-press-archive')
const SO_DIVERGENTES = process.argv.includes('--so-divergentes')
const ULTIMO_CRON_UTC = 19 // o terceiro e último cron do dia

type Item = { url?: string; link?: string }

async function main() {
  const { getPrisma } = await import('../lib/db')
  const prisma = getPrisma()
  if (!prisma) { console.error('SEM BANCO: DATABASE_URL ausente ou inválida'); process.exit(1) }

  const rows = await prisma.analysisReport.findMany({
    where: { slug: { startsWith: 'us-press-' } },
    select: { slug: true, bodyMarkdown: true },
  })
  const banco = new Map<string, Record<string, unknown>>()
  for (const r of rows) {
    const iso = isoDoSlug(r.slug)
    if (!iso) continue
    try { banco.set(iso, JSON.parse(r.bodyMarkdown ?? '{}')) } catch { /* linha ilegível, o arquivador já reclama dela */ }
  }

  if (!existsSync(DIR)) { console.error(`sem ${DIR}`); process.exit(1) }
  const arquivos = readdirSync(DIR).filter(f => f.endsWith('.json')).sort()

  console.log('\n📰 DEFASAGEM DO ARQUIVO DA IMPRENSA (EUA)')
  console.log(`   ${arquivos.length} arquivo(s) em disco · ${banco.size} coleta(s) no banco\n`)
  console.log('   data        arquivo   banco     URLs em comum   atraso')

  let iguais = 0, parciais = 0, zerados = 0, semPar = 0
  const horas: number[] = []

  for (const f of arquivos) {
    const iso = f.replace('.json', '')
    const b = banco.get(iso)
    if (!b) { semPar++; continue }
    const a = JSON.parse(readFileSync(join(DIR, f), 'utf-8'))
    const ua = ((a.itens ?? []) as Item[]).map(i => i.url ?? i.link)
    const ub = ((b.itens ?? []) as Item[]).map(i => i.url ?? i.link)
    const comuns = ua.filter(u => ub.includes(u)).length
    const ha = new Date(String(a.fetchedAt)), hb = new Date(String(b.fetchedAt))
    const atraso = (hb.getTime() - ha.getTime()) / 3600000
    horas.push(ha.getUTCHours())

    if (comuns === ua.length && ua.length === ub.length) iguais++
    else if (comuns === 0) zerados++
    else parciais++

    if (SO_DIVERGENTES && comuns === ua.length && ua.length === ub.length) continue
    const marca = comuns === 0 ? '🔴' : comuns === ua.length ? '✅' : '⚠️ '
    console.log(`   ${marca} ${iso}  ${ha.toISOString().slice(11, 16)}     ${hb.toISOString().slice(11, 16)}     ${String(comuns).padStart(2)}/${String(ua.length).padEnd(2)}          ${atraso.toFixed(1)}h`)
  }

  const cedo = horas.filter(h => h < ULTIMO_CRON_UTC).length
  console.log(`\n   ${iguais} idênticas em URL · ${parciais} parciais · ${zerados} com ZERO matéria em comum${semPar ? ` · ${semPar} sem par no banco` : ''}`)
  console.log(`   ${cedo} de ${horas.length} arquivos foram tirados ANTES das ${ULTIMO_CRON_UTC}:20 UTC, que é o último cron do dia`)
  console.log(`\n   📌 O arquivo guarda o instante da chamada, não o fecho do dia. Rodar o`)
  console.log(`      arquivador DEPOIS das ${ULTIMO_CRON_UTC}:20 UTC é o que faz a data encerrar completa.`)
  console.log(`   ⛔ Data encerrada NÃO se reescreve: divergência passada é assunto de errata.\n`)

  await prisma.$disconnect()
}

main().catch(e => { console.error('ERRO:', (e as Error).message.slice(0, 400)); process.exit(1) })
