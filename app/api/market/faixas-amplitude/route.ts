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
import { prisma } from '../../../../lib/db'
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

  // 🔑 Os três "vazios" desta rota são estados DIFERENTES, e o corpo é o mesmo
  // `{}` nos três, de propósito: a amplitude é informação adicional e a ausência
  // dela deixa o quadro como era antes desta rota existir. O que faltava era
  // conseguir DISTINGUIR os três em log e em rede, então o motivo vai num
  // cabeçalho, sem tocar no contrato do corpo.
  const vazio = (motivo: string) =>
    NextResponse.json({}, { status: 200, headers: { 'X-AFOS-Motivo': motivo } })

  if (!slugs.length) return vazio('sem-slugs')
  // Teto de sanidade: o consumidor pede cinco. Lista aberta viraria varredura.
  if (slugs.length > 25) return vazio('slugs-demais')
  if (!prisma) return vazio('sem-banco')

  try {
    const desde = new Date(Date.now() - HORAS * 3600_000)
    const mercados = (await prisma.market.findMany({
      where: { slug: { in: slugs } },
      select: { id: true, slug: true },
    })).filter((m): m is { id: string; slug: string } => typeof m.slug === 'string')

    const saida: Record<string, AmplitudeFaixas> = {}
    if (!mercados.length) return vazio('slug-desconhecido')

    // ⚠️ UMA consulta para todos os mercados, não uma por mercado. O laço
    // anterior fazia N+1 e só não doía porque o painel pede exatamente cinco
    // slugs; a rota, porém, aceita a lista que vier.
    const precos = await prisma.marketPrice.findMany({
      where: { marketId: { in: mercados.map((m) => m.id) }, snapshotAt: { gte: desde } },
      select: { marketId: true, snapshotAt: true, price: true },
    })

    const porMercado = new Map<string, Map<number, number>>()
    for (const p of precos) {
      const capturas = porMercado.get(p.marketId) ?? new Map<number, number>()
      // Uma soma por captura. A chave é o instante, que é como o cron grava.
      const k = p.snapshotAt.getTime()
      capturas.set(k, (capturas.get(k) || 0) + p.price)
      porMercado.set(p.marketId, capturas)
    }

    for (const m of mercados) {
      const porCaptura = porMercado.get(m.id)
      if (!porCaptura?.size) continue

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
  } catch (e) {
    // 🔑 Falha aqui NÃO pode derrubar a seção de mercado: a amplitude é
    // informação adicional, e a ausência dela deixa o quadro exatamente como
    // era antes desta rota existir. Devolve vazio, sem erro.
    //
    // ⚠️ Mas o erro é REGISTRADO. O `catch` anterior era mudo, e falha calada
    // aqui era indistinguível de "não há dado na janela".
    console.error('[market/faixas-amplitude] falhou:', e)
    return vazio('erro')
  }
  // ⛔ SEM `$disconnect`. O cliente agora é o compartilhado de lib/db.ts, que é
  // cacheado no globalThis: desconectá-lo derrubaria a conexão das OUTRAS rotas.
  // O `new PrismaClient` por requisição que existia aqui montava um pool novo a
  // cada visita, com o mesmo adaptador Neon que o singleton já usa.
}
