/**
 * Amplitude da SOMA DAS FAIXAS de um mercado de distribuição, nas últimas 24h.
 *
 * 🔴 POR QUE ISTO EXISTE, medido em 10/Ago/2026.
 *
 * O portão de coerência decide se um quadro de distribuição mostra número ou só
 * a forma, e ele decide olhando UMA leitura. Só que a soma das faixas oscila
 * muito, e o corte em 105% é um penhasco. No book de cadeiras do Senado, em dez
 * capturas seguidas:
 *
 *     07/Ago 10:30  104.40%  passa
 *     08/Ago 06:31  104.90%  passa
 *     09/Ago 03:00  106.00%  REPROVA
 *     09/Ago 23:01  105.40%  reprova
 *     10/Ago 17:30  130.00%  reprova
 *     10/Ago 21:01  104.40%  PASSA
 *     10/Ago 22:30  100.00%  passa
 *
 * O portão virou seis vezes, e três dessas viradas foram por menos de um ponto
 * e meio de sobrepreço. Quem atualiza a página duas vezes no mesmo dia vê dois
 * painéis diferentes sem que nada eleitoral tenha mudado.
 *
 * Esta rota é o PASSO INTERMEDIÁRIO acordado com o André: não muda a regra do
 * portão, e sim publica a instabilidade ao lado da soma, para o leitor ver a
 * oscilação em vez de tropeçar nela. É a continuação da decisão de 06/Ago, de
 * que a soma das faixas é MÉTRICA e não desculpa: ela mede liquidez e qualidade
 * do livro, e quase ninguém publica isso.
 *
 * ⚠️ O preço fica gravado por faixa e por captura em `market_prices`, então a
 * série já existia. Nada de coleta nova.
 */

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
// 🔑 A régua vem de UM lugar. Ver o cabeçalho de `lib/us-market/portao.ts`.
import { fechaOPortao, type AmplitudeFaixas } from '../../../../lib/us-market/portao'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/** Janela padrão. 24h cobre várias capturas do cron sem virar série histórica. */
const HORAS = 24

export type { AmplitudeFaixas } from '../../../../lib/us-market/portao'

export async function GET(req: NextRequest) {
  const slugs = (req.nextUrl.searchParams.get('slugs') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  if (!slugs.length) return NextResponse.json({}, { status: 200 })

  const url = process.env.DATABASE_URL
  if (!url) return NextResponse.json({}, { status: 200 })

  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: url }) })
  try {
    const desde = new Date(Date.now() - HORAS * 3600_000)
    const mercados = (await prisma.market.findMany({
      where: { slug: { in: slugs } },
      select: { id: true, slug: true },
    })).filter((m): m is { id: string; slug: string } => typeof m.slug === 'string')

    const saida: Record<string, AmplitudeFaixas> = {}

    for (const m of mercados) {
      const precos = await prisma.marketPrice.findMany({
        where: { marketId: m.id, snapshotAt: { gte: desde } },
        select: { snapshotAt: true, price: true },
      })
      if (!precos.length) continue

      // Uma soma por captura. A chave é o instante, que é como o cron grava.
      const porCaptura = new Map<number, number>()
      for (const p of precos) {
        const k = p.snapshotAt.getTime()
        porCaptura.set(k, (porCaptura.get(k) || 0) + p.price)
      }

      // ⚠️ Defesa contra as duas escalas: o preço é gravado em pontos
      // percentuais, mas se algum dia vier em 0..1 a soma cairia perto de 1 e o
      // número publicado seria absurdo. Normaliza pela ordem de grandeza.
      const somas = [...porCaptura.values()].map((s) => (s <= 2 ? s * 100 : s))
      if (!somas.length) continue

      saida[m.slug] = {
        min: Number(Math.min(...somas).toFixed(2)),
        max: Number(Math.max(...somas).toFixed(2)),
        n: somas.length,
        dentro: somas.filter(fechaOPortao).length,
      }
    }

    return NextResponse.json(saida, {
      headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300' },
    })
  } catch {
    // 🔑 Falha aqui NÃO pode derrubar a seção de mercado: a amplitude é
    // informação adicional, e a ausência dela deixa o quadro exatamente como
    // era antes desta rota existir. Devolve vazio, sem erro.
    return NextResponse.json({}, { status: 200 })
  } finally {
    await prisma.$disconnect().catch(() => {})
  }
}
