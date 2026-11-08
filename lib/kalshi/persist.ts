/**
 * Kalshi → Neon. A série do segundo livro, criada 08/Nov/2026 (painel da França).
 *
 * Duas tabelas próprias (ver o comentário no schema):
 *  - `kalshi_capturas`: TODA rodada, com ou sem defeito. É o diário de bordo que
 *    permite afirmar "14 dias de captura sem defeito" (lib/kalshi/prontidao.ts).
 *  - `kalshi_precos`: os preços, só quando a captura passou na avaliação.
 *
 * 📏 Regra de gravação = a da Polymarket (app/lib/polymarket/persist.ts):
 * grava o livro INTEIRO quando qualquer contrato andou 0,5pp, quando aparece
 * contrato novo, ou quando a última gravação tem 4h ou mais. O movimento é
 * medido em todos os contratos, não só no líder (defeito medido em 28/Ago/2026
 * na Polymarket: o líder parado escondia o pico dos outros).
 *
 * ⛔ Captura com DEFEITO não grava preço. Um livro quebrado gravado como série
 * contamina toda conta posterior; o defeito fica registrado na captura.
 */

import { createHash } from 'crypto'
import { getPrisma } from '../db'
import {
  EVENTOS_KALSHI,
  avaliarCaptura,
  lerEventoKalshi,
  preencherUltimasNegociacoes,
  type ContratoKalshi,
  type PaisKalshi,
} from './leitura'

export const LIMIAR_MOVIMENTO_PP = 0.5
export const MAX_STALENESS_MS = 4 * 60 * 60 * 1000

export interface UltimoGravado {
  preco: number
  snapshotAt: Date
}

export type Decisao = { gravar: true; motivo: string } | { gravar: false; motivo: string }

/** Função pura: decide se o livro inteiro vai para a série nesta rodada. */
export function decidirGravacao(
  contratos: readonly Pick<ContratoKalshi, 'ticker' | 'ultimo' | 'candidato'>[],
  ultimos: ReadonlyMap<string, UltimoGravado>,
  agora: Date,
): Decisao {
  const comPreco = contratos.filter((c) => c.ultimo !== null)
  if (comPreco.length === 0) return { gravar: false, motivo: 'nenhum contrato com preço' }
  if (ultimos.size === 0) return { gravar: true, motivo: 'primeira gravação do evento' }

  const novo = comPreco.find((c) => !ultimos.has(c.ticker))
  if (novo) return { gravar: true, motivo: `contrato novo: ${novo.candidato}` }

  let maisRecente = 0
  for (const u of ultimos.values()) maisRecente = Math.max(maisRecente, u.snapshotAt.getTime())
  if (agora.getTime() - maisRecente >= MAX_STALENESS_MS) return { gravar: true, motivo: 'batimento de 4h' }

  let maior = 0
  let quem = ''
  for (const c of comPreco) {
    const d = Math.abs((c.ultimo as number) - (ultimos.get(c.ticker) as UltimoGravado).preco)
    if (d > maior) {
      maior = d
      quem = c.candidato
    }
  }
  if (maior >= LIMIAR_MOVIMENTO_PP) return { gravar: true, motivo: `${quem} andou ${maior.toFixed(2)}pp` }
  return { gravar: false, motivo: `maior movimento ${maior.toFixed(2)}pp, abaixo de ${LIMIAR_MOVIMENTO_PP}` }
}

function dedupHash(ticker: string, snapshotAt: Date): string {
  return createHash('sha256').update(`kalshi|${ticker}|${snapshotAt.toISOString()}`).digest('hex')
}

export interface ResultadoCaptura {
  eventTicker: string
  ok: boolean
  defeitos: string[]
  avisos: string[]
  contratos: number
  gravados: number
  decisao: string
}

/**
 * Uma rodada completa para um país: lê, avalia, decide, grava. Nunca lança:
 * erro vira defeito registrado, porque captura que some sem registro é
 * exatamente o buraco que a prontidão de 14 dias precisa enxergar.
 */
export async function capturarKalshi(pais: PaisKalshi, origem: 'cron' | 'manual' = 'cron'): Promise<ResultadoCaptura[]> {
  const prisma = getPrisma()
  if (!prisma) throw new Error('Neon indisponível: getPrisma() devolveu null')

  const saida: ResultadoCaptura[] = []
  for (const { eventTicker } of EVENTOS_KALSHI[pais]) {
    const startedAt = new Date()
    let resultado: ResultadoCaptura
    let capturaId: string | null = null
    try {
      const evento = await lerEventoKalshi(eventTicker, { fresh: true })
      if (evento) await preencherUltimasNegociacoes(evento)
      const agora = new Date()
      const av = avaliarCaptura(evento, agora)
      const vivos = evento ? evento.contratos.filter((c) => c.status === 'active' && c.ultimo !== null) : []

      let gravados = 0
      let decisao = 'captura com defeito: preço não gravado'
      const captura = await prisma.kalshiCaptura.create({
        data: {
          startedAt,
          pais,
          eventTicker,
          ok: av.ok,
          defeitos: av.defeitos,
          avisos: av.avisos,
          contratos: evento?.contratos.length ?? 0,
          somaPrecos: av.somaPrecos,
          origem,
        },
      })
      capturaId = captura.id

      if (av.ok) {
        const linhas = await prisma.$queryRaw<{ ticker: string; preco: number; snapshot_at: Date }[]>`
          SELECT DISTINCT ON (ticker) ticker, preco, snapshot_at
          FROM market.kalshi_precos
          WHERE event_ticker = ${eventTicker}
          ORDER BY ticker, snapshot_at DESC`
        const ultimos = new Map(linhas.map((l) => [l.ticker, { preco: l.preco, snapshotAt: new Date(l.snapshot_at) }]))
        const d = decidirGravacao(vivos, ultimos, agora)
        decisao = d.motivo
        if (d.gravar) {
          const r = await prisma.kalshiPreco.createMany({
            data: vivos.map((c) => ({
              capturaId: captura.id,
              eventTicker,
              ticker: c.ticker,
              candidato: c.candidato,
              preco: c.ultimo as number,
              compra: c.compra,
              venda: c.venda,
              volumeContratos: c.volumeContratos,
              contratosEmAberto: c.contratosEmAberto,
              ultimaNegociacaoEm: c.ultimaNegociacaoEm ? new Date(c.ultimaNegociacaoEm) : null,
              snapshotAt: agora,
              dedupHash: dedupHash(c.ticker, agora),
            })),
            skipDuplicates: true,
          })
          gravados = r.count
        }
      }

      await prisma.kalshiCaptura.update({
        where: { id: captura.id },
        data: { finishedAt: new Date(), gravados },
      })
      resultado = {
        eventTicker,
        ok: av.ok,
        defeitos: av.defeitos,
        avisos: av.avisos,
        contratos: evento?.contratos.length ?? 0,
        gravados,
        decisao,
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      // A falha também é captura: sem esta linha, um dia de erro de banco
      // pareceria um dia sem rodada, e a prontidão não saberia distinguir.
      try {
        if (capturaId) {
          await prisma.kalshiCaptura.update({
            where: { id: capturaId },
            data: { ok: false, defeitos: { push: `exceção: ${msg}` }, finishedAt: new Date() },
          })
        } else {
          await prisma.kalshiCaptura.create({
            data: { startedAt, finishedAt: new Date(), pais, eventTicker, ok: false, defeitos: [`exceção: ${msg}`], origem },
          })
        }
      } catch (err2) {
        console.error('[kalshi] nem o registro da falha foi gravado:', err2)
      }
      resultado = { eventTicker, ok: false, defeitos: [`exceção: ${msg}`], avisos: [], contratos: 0, gravados: 0, decisao: 'exceção' }
    }
    saida.push(resultado)
  }
  return saida
}
