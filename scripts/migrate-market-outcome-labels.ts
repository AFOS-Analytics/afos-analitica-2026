/**
 * Migração dos rótulos de faixa dos mercados dos EUA.
 * Sem `--aplicar` não grava nada.
 *
 * COMO CADA LINHA É DECIDIDA
 *
 * A pergunta passou por três leitores diferentes ao longo de 28 e 29/Jul, e o
 * nome gravado diz qual deles rodou. Então a decisão não pode ser por horário:
 * tem que ser "dá para saber a que faixa este preço pertence?".
 *
 *   MANTEM   → o nome já é o nome novo. Nada a fazer.
 *   MIGRA    → o nome corresponde a UMA pergunta viva só, seja pelo leitor de
 *              28/Jul, seja pelo corte de 50 caracteres. Faixa conhecida.
 *   DESCARTA → o nome corresponde a VÁRIAS perguntas (colapso) ou a nenhuma.
 *              Não se sabe de que faixa é o preço, e chutar seria inventar.
 *
 * Uma exceção nominal, e só uma: a linha "there" do comparecimento. Ver o
 * comentário longo no meio do arquivo. Descarte do primeiro ponto dela
 * autorizado pelo André em 29/Jul.
 *
 * ⛔ O QUE ESTE SCRIPT NÃO FAZ, e a tentativa custou uma rodada de ensaio:
 * NÃO decide por horário nem por "captura com poucas linhas". Numa disputa de
 * duas pontas, captura com uma linha só quer dizer que apenas uma ponta mexeu,
 * e o dedup de 0,5pp pulou a outra. Tratar isso como colapso ia apagar um ponto
 * legítimo da série do Senado, que tem 383 pontos desde 14/Abr.
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { createHash } from 'crypto'
import { extractCandidateName } from '../app/lib/polymarket/bootstrap'

const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: (process.env.DATABASE_URL || '').trim() }) })
const APLICAR = process.argv.includes('--aplicar')

// Leitor de 28/Jul, réplica exata, para reconhecer o que ELE gravou.
function antigo(question: string): string {
  const q = question || ''
  const margemRange = q.match(/(Democratic|Republican) Party win the popular vote.*?by between (\d+)% and (\d+)%/)
  if (margemRange) return `${margemRange[1][0]}+${margemRange[2]}–${margemRange[3]}`
  const margemAcima = q.match(/(Democratic|Republican) Party win the popular vote.*?by (\d+)% or more/)
  if (margemAcima) return `${margemAcima[1][0]}+${margemAcima[2]} ou mais`
  const unidade = /House seats/.test(q) ? 'cad.' : /governorships/.test(q) ? 'gov.' : /Senate seats/.test(q) ? 'cad.' : null
  if (unidade) {
    const entre = q.match(/between (\d+) and (\d+)/)
    if (entre) return `${entre[1]}–${entre[2]} ${unidade}`
    const exato = q.match(/exactly (\d+) or (\d+)/)
    if (exato) return `${exato[1]} ou ${exato[2]} ${unidade}`
    const abaixo = q.match(/(?:below|fewer than|less than) (\d+)/)
    if (abaixo) return `< ${abaixo[1]} ${unidade}`
    const acima = q.match(/(?:above|more than|at least) (\d+)/)
    if (acima) return `> ${acima[1]} ${unidade}`
  }
  if (/votes cast/.test(q)) {
    const entre = q.match(/between (\d+)m and (\d+)m/)
    if (entre) return `${entre[1]}–${entre[2]}m votos`
    const menos = q.match(/less than (\d+)m/)
    if (menos) return `< ${menos[1]}m votos`
    const mais = q.match(/more than (\d+)m/)
    if (mais) return `> ${mais[1]}m votos`
  }
  if (/any other outcome/i.test(q)) return 'Outro resultado'
  const candMatch = q.match(/Will (.+?) (?:win|finish|be)/)
  if (candMatch) return candMatch[1].trim()
  return q.slice(0, 50)
}

const SLUGS = [
  'which-party-will-win-the-house-in-2026',
  'which-party-will-win-the-senate-in-2026',
  'republican-senate-seats-after-the-2026-midterm-elections-927',
  'republican-house-seats-after-the-2026-midterm-elections',
  'how-many-republican-governors-after-the-2026-midterm-elections',
  '2026-midterms-house-popular-vote-margin-of-victory-224',
  '2026-midterms-house-turnout',
  'will-the-2026-midterm-elections-happen-as-scheduled',
]

const chaveDe = (nome: string) => nome.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 50)
const hashDe = (marketId: string, chave: string, quando: Date) => {
  const t = new Date(quando)
  t.setMinutes(Math.floor(t.getMinutes() / 15) * 15, 0, 0)
  return createHash('sha256').update(`${marketId}:${chave}:${t.toISOString()}`).digest('hex').slice(0, 32)
}

async function main() {
  let migra = 0, descarta = 0, mantem = 0, movidos = 0, descartados = 0
  const acoes: { titulo: string; linha: string }[] = []

  for (const slug of SLUGS) {
    const r = await fetch('https://www.afos-analytics.com/api/polymarket/lookup?slug=' + encodeURIComponent(slug))
    const ev: any = (await r.json())?.event
    const m = await prisma.market.findFirst({ where: { slug }, select: { id: true, title: true } })
    if (!ev || !m) { console.log(`\n### ${slug}: SEM DADO`); continue }

    const perguntas: string[] = (ev.markets || []).filter((x: any) => x.outcomePrices).map((x: any) => x.question)
    const nomesNovos = new Set(perguntas.map((q) => extractCandidateName(q)))
    const faixasVivas = perguntas.length

    // candidatos por nome antigo: quantas perguntas produzem ESTE nome?
    const candidatos = new Map<string, string[]>()
    const add = (nome: string, q: string) => {
      const l = candidatos.get(nome) || []
      if (!l.includes(q)) l.push(q)
      candidatos.set(nome, l)
    }
    for (const q of perguntas) { add(antigo(q), q); add(q.slice(0, 50), q) }

    console.log(`\n### ${m.title}   (${faixasVivas} faixas vivas)`)

    const outs = await prisma.marketOutcome.findMany({
      where: { marketId: m.id },
      select: { id: true, outcomeName: true, _count: { select: { prices: true } } },
    })

    for (const o of outs) {
      const n = o._count.prices
      if (nomesNovos.has(o.outcomeName)) { mantem++; continue }

      const cands = candidatos.get(o.outcomeName) || []
      if (cands.length !== 1) {
        descarta++; descartados += n
        const motivo = cands.length === 0 ? 'nome de leitor desconhecido' : `colapsada em ${cands.length} perguntas`
        console.log(`  DESCARTA n=${String(n).padStart(2)}  ${JSON.stringify(o.outcomeName)}  ${motivo}`)
        acoes.push({ titulo: m.title, linha: `descarta ${JSON.stringify(o.outcomeName)} (${n} pontos, ${motivo})` })
        if (APLICAR) { await prisma.marketPrice.deleteMany({ where: { outcomeId: o.id } }); await prisma.marketOutcome.delete({ where: { id: o.id } }) }
        continue
      }

      const destino = extractCandidateName(cands[0])
      const chaveNova = chaveDe(destino)
      const existente = await prisma.marketOutcome.findFirst({ where: { marketId: m.id, outcomeKey: chaveNova }, select: { id: true } })
      const ps = await prisma.marketPrice.findMany({ where: { outcomeId: o.id }, select: { id: true, snapshotAt: true, price: true }, orderBy: { snapshotAt: 'asc' } })

      // ⚠️ ÚNICA EXCEÇÃO, e ela é nominal, não por horário.
      //
      // A linha "there" do comparecimento é a única cujo nome DOIS leitores
      // diferentes produziram com significados diferentes. O leitor mais antigo
      // devolvia "there" para as 12 faixas (todas as perguntas começam com
      // "Will there be"), então o que ele gravou é indecifrável. O leitor de
      // 28/Jul devolvia "there" só para a faixa "at least 130m", que era a única
      // que escapava das regras dele. Logo: o primeiro ponto da linha é da época
      // do colapso e não pertence a faixa nenhuma; os seguintes são da faixa de
      // 130m ou mais. Descarte do primeiro autorizado pelo André em 29/Jul.
      //
      // Nenhuma outra linha precisa disso: todas as outras têm nome que
      // corresponde a UMA pergunta só em qualquer um dos leitores, então todos
      // os pontos delas são atribuíveis, inclusive os de 01:06.
      const ehThereDoComparecimento = o.outcomeName === 'there' && /votes cast|Turnout/i.test(m.title + ' ' + cands[0])
      const ruins = ehThereDoComparecimento ? ps.slice(0, 1) : []
      const bons = ehThereDoComparecimento ? ps.slice(1) : ps
      migra++; movidos += bons.length; descartados += ruins.length
      const nota = ruins.length ? `  ⚠️ descarta ${ruins.length} da janela do colapso: ${ruins.map((c) => c.snapshotAt.toISOString().slice(11, 16) + '=' + c.price.toFixed(2)).join(', ')}` : ''
      console.log(`  MIGRA    n=${String(n).padStart(2)}  ${JSON.stringify(o.outcomeName)} → ${JSON.stringify(destino)}${existente ? ' [funde]' : ' [renomeia]'}${nota}`)
      acoes.push({ titulo: m.title, linha: `${JSON.stringify(o.outcomeName)} → ${JSON.stringify(destino)}, ${bons.length} pontos${ruins.length ? `, descarta ${ruins.length}` : ''}` })

      if (!APLICAR) continue
      if (ruins.length) await prisma.marketPrice.deleteMany({ where: { id: { in: ruins.map((c) => c.id) } } })
      if (existente) {
        for (const p of bons) {
          const hash = hashDe(m.id, chaveNova, p.snapshotAt)
          // A linha de destino já pode ter ponto na MESMA janela de 15 minutos
          // do dedup. Quando tem, o ponto que vem de fora é o mesmo ponto pela
          // régua do próprio sistema, e entrar com ele contaria duas vezes. Foi
          // o caso dos 6 pontos de 01:06 de governadores, que caem na mesma
          // janela dos de 01:12 que já estavam gravados.
          const jaTem = await prisma.marketPrice.findFirst({ where: { dedupHash: hash }, select: { id: true } })
          if (jaTem) { await prisma.marketPrice.delete({ where: { id: p.id } }); continue }
          await prisma.marketPrice.update({ where: { id: p.id }, data: { outcomeId: existente.id, dedupHash: hash } })
        }
        await prisma.marketOutcome.delete({ where: { id: o.id } })
      } else {
        await prisma.marketOutcome.update({ where: { id: o.id }, data: { outcomeKey: chaveNova, outcomeName: destino } })
        for (const p of bons) await prisma.marketPrice.update({ where: { id: p.id }, data: { dedupHash: hashDe(m.id, chaveNova, p.snapshotAt) } })
      }
    }
  }

  console.log(`\n════ ${APLICAR ? 'APLICADO' : 'ENSAIO, nada gravado'} ════`)
  console.log(`  linhas: ${migra} migradas · ${descarta} descartadas · ${mantem} mantidas`)
  console.log(`  pontos: ${movidos} movidos · ${descartados} descartados`)
  await prisma.$disconnect()
}

main().catch((e) => { console.error(String(e).slice(0, 600)); process.exit(1) })
