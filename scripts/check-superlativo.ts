/**
 * Confere superlativo contra a série INTEIRA, direto no Neon.
 *
 * POR QUE EXISTE
 * O Guardrail #3 do /atualizar manda verificar "o maior do ciclo" com
 * /api/market/history. Esse endpoint NÃO consegue provar isso:
 *
 *   - `days` é travado em 90 por Math.min (app/api/market/history/route.ts:23),
 *     então days=365 devolve exatamente a mesma janela que days=90;
 *   - o take:1000 pega os pontos mais ANTIGOS da janela, então uma janela larga
 *     ainda por cima corta o lado NOVO da série.
 *
 * Resultado: quem confere "do ciclo" por ali está medindo 90 dias e chamando de
 * ciclo. Em 25/Jul/2026 o banco tinha série desde 14/Abr, 12 dias além do que a
 * API mostrava. Foi um superlativo mal verificado que foi errado a produção em
 * 19/Jul ("a mais larga do ciclo" quando o pico era 4,65pp maior e a série vinha
 * estreitando havia duas semanas).
 *
 * Uso:
 *   npx tsx scripts/check-superlativo.ts               # gap Lula-Flávio
 *   npx tsx scripts/check-superlativo.ts "Renan Santos"
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

const SLUG = 'brazil-presidential-election'

/** O banco persiste o nome CURTO ("Lula"); a API ao vivo devolve o completo. */
function ehLula(nome: string) { return /^(Lula|Luiz In)/i.test(nome) }
function ehFlavio(nome: string) { return /^Fl.vio Bolsonaro/i.test(nome) }

async function main() {
  const alvo = process.argv[2]?.trim()
  const { prisma } = await import('../lib/db')
  if (!prisma) { console.error('SEM BANCO: DATABASE_URL ausente ou inválida'); process.exit(1) }

  const pontos = await prisma.marketPrice.findMany({
    where: { market: { slug: SLUG } },
    select: { price: true, snapshotAt: true, outcome: { select: { outcomeName: true } } },
    orderBy: { snapshotAt: 'asc' },
  })

  // Fechamento de cada dia: em ordem asc, o último a escrever vence.
  const fecha = new Map<string, Record<string, number>>()
  for (const p of pontos) {
    const nome = p.outcome?.outcomeName ?? ''
    const dia = p.snapshotAt.toISOString().slice(0, 10)
    if (!fecha.has(dia)) fecha.set(dia, {})
    fecha.get(dia)![nome] = p.price
  }
  const dias = [...fecha.keys()].sort()
  if (dias.length === 0) { console.error('série vazia'); process.exit(1) }

  const serie: Array<{ dia: string; v: number }> = []
  for (const dia of dias) {
    const linha = fecha.get(dia)!
    let v: number | null = null
    if (alvo) {
      const k = Object.keys(linha).find(n => n.toLowerCase().startsWith(alvo.toLowerCase()))
      if (k) v = linha[k]
    } else {
      const kl = Object.keys(linha).find(ehLula)
      const kf = Object.keys(linha).find(ehFlavio)
      if (kl && kf) v = linha[kl] - linha[kf]
    }
    if (v != null) serie.push({ dia, v })
  }

  const rotulo = alvo ? `preço de ${alvo}` : 'gap Lula − Flávio'
  const ordenada = [...serie].sort((a, b) => b.v - a.v)
  const hoje = serie[serie.length - 1]

  console.log(`\nSÉRIE INTEIRA (sem cap de janela) — ${rotulo}`)
  console.log(`  cobertura : ${serie[0].dia} a ${hoje.dia}  (${serie.length} dias com dado)`)
  console.log(`  MÁXIMO    : ${ordenada[0].v.toFixed(2)}pp em ${ordenada[0].dia}`)
  console.log(`  mínimo    : ${ordenada[ordenada.length - 1].v.toFixed(2)}pp em ${ordenada[ordenada.length - 1].dia}`)
  console.log(`  último    : ${hoje.v.toFixed(2)}pp em ${hoje.dia}`)
  console.log('\n  --- 8 maiores ---')
  for (const t of ordenada.slice(0, 8)) console.log(`    ${t.dia}   ${t.v.toFixed(2)}`)
  console.log('\n  --- 10 últimos ---')
  for (const t of serie.slice(-10)) console.log(`    ${t.dia}   ${t.v.toFixed(2)}`)

  console.log(
    '\n⚠️  A janela desta série é a do BANCO, não a do mercado. O Polymarket pode ter\n' +
    `   aberto antes de ${serie[0].dia}. Escreva "o maior desde ${serie[0].dia}", que é\n` +
    '   verificável, e NÃO "o maior do ciclo", que esta série não prova.\n'
  )
  await prisma.$disconnect()
}

main().catch(e => { console.error('ERRO:', (e as Error).message.slice(0, 400)); process.exit(1) })
