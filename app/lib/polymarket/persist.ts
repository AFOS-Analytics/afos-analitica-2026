/**
 * Polymarket → Neon Persistence
 *
 * Cron inteligente: hot (15min), warm (60min), cold (skip), com ponto diário
 * garantido por MAX_STALENESS_MS.
 * Dedup 2 camadas: Redis timestamp + DB UNIQUE hash.
 *
 * ⚠️ NÃO é mais fire-and-forget. A rota do cron AGUARDA esta função desde
 * 28/Jul/2026, porque sem await a instância serverless congelava antes de a
 * gravação terminar e o arquivo histórico perdia linha em silêncio.
 */

import { createHash } from 'crypto'
import { prisma } from '../../../lib/db'
import { Redis } from '@upstash/redis'
import { ELECTION_REGISTRY } from './country-market-map'
import type { CountryAggregation, MarketSummary, CandidateSummary } from './bootstrap'

// ─── Tier classification ───────────────────────────────────────────

type Tier = 'hot' | 'warm' | 'cold'

const TIER_INTERVALS: Record<Tier, number> = {
  hot: 15 * 60 * 1000,   // 15 min
  warm: 60 * 60 * 1000,  // 60 min
  cold: 0,               // skip prices
}

/**
 * Teto de outcomes gravados quando o registro não declara `maxOutcomes`.
 * Mercado de candidatos raramente passa disso; mercado de FAIXAS passa.
 */
const MAX_OUTCOMES_DEFAULT = 10

/** Mercado de faixas: a distribuição inteira, senão a soma não fecha. */
const MAX_OUTCOMES_DISTRIBUICAO = 20

/**
 * Idade máxima sem gravar. Passou disso, grava mesmo sem o preço ter mexido.
 *
 * POR QUE EXISTE: o filtro de movimento (|Δ| ≥ 0,5pp) transforma a coleta num
 * REGISTRO DE MUDANÇAS, não numa série temporal. Mercado parado o dia inteiro
 * não gerava nenhum ponto, e um buraco no histórico não se recupera depois.
 * Com 20h, cada mercado ao vivo tem pelo menos um ponto por dia, sem alterar a
 * cadência de quem se mexe. Só ACRESCENTA pontos, nunca remove.
 */
const MAX_STALENESS_MS = 20 * 60 * 60 * 1000

function classifyTier(slug: string, status: string): Tier {
  if (status === 'resolved' || status === 'no-data') return 'cold'
  if (status === 'upcoming') return 'cold'
  const entry = ELECTION_REGISTRY.find((e) => e.slug === slug)
  if (entry?.iso3 === 'BRA' && entry.isPrimary) return 'hot'
  return 'warm'
}

// ─── Redis dedup ───────────────────────────────────────────────────

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

async function shouldPersist(
  redis: Redis | null,
  slug: string,
  tier: Tier,
  leadProb: number
): Promise<boolean> {
  if (tier === 'cold') return false
  if (!redis) return true

  const key = `afos:market:last-persist:${slug}`
  try {
    const last = await redis.get<string>(key)
    if (!last) return true

    const [lastProb, lastTs] = last.split('|')
    const elapsed = Date.now() - Number(lastTs)
    if (elapsed < TIER_INTERVALS[tier]) return false
    // Ponto diário garantido: mercado parado também é informação, e buraco de
    // série não se recupera. Ver MAX_STALENESS_MS.
    if (elapsed >= MAX_STALENESS_MS) return true
    if (Math.abs(leadProb - Number(lastProb)) < 0.5) return false

    return true
  } catch {
    return true
  }
}

async function markPersisted(redis: Redis | null, slug: string, prob: number) {
  if (!redis) return
  try {
    await redis.set(`afos:market:last-persist:${slug}`, `${prob}|${Date.now()}`, { ex: 86400 })
  } catch {}
}

// ─── Dedup hash ────────────────────────────────────────────────────

function makeDedupHash(marketDbId: string, candidateName: string, snapshotAt: Date): string {
  const truncated = new Date(snapshotAt)
  truncated.setMinutes(Math.floor(truncated.getMinutes() / 15) * 15, 0, 0)
  return createHash('sha256')
    .update(`${marketDbId}:${candidateName}:${truncated.toISOString()}`)
    .digest('hex')
    .slice(0, 32)
}

// ─── Main persist ──────────────────────────────────────────────────

export async function persistMarketData(
  countries: CountryAggregation[]
): Promise<{ persisted: number; skipped: number; errors: number }> {
  if (!prisma) return { persisted: 0, skipped: 0, errors: 0 }
  // Referência não-nula fixada aqui: dentro dos closures do Promise.all abaixo o
  // TypeScript não consegue provar que a guarda acima já rodou.
  const db = prisma

  const redis = getRedis()
  const now = new Date()
  let persisted = 0
  let skipped = 0
  let errors = 0

  for (const country of countries) {
    for (const mkt of country.markets) {
      const tier = classifyTier(mkt.slug, country.status)
      const leadProb = mkt.candidates[0]?.probability ?? 0

      if (!(await shouldPersist(redis, mkt.slug, tier, leadProb))) {
        skipped++
        continue
      }

      try {
        // Upsert event
        const eventPolyId = `${country.iso3}:${country.electionType}`
        const dbEvent = await prisma.marketEvent.upsert({
          where: { polymarketEventId: eventPolyId },
          update: { title: `${country.countryName} — ${country.electionType}`, active: country.status === 'live', closed: country.status === 'resolved' },
          create: { polymarketEventId: eventPolyId, title: `${country.countryName} — ${country.electionType}`, slug: mkt.slug, active: country.status === 'live', closed: country.status === 'resolved' },
          select: { id: true },
        })

        // Upsert market
        const dbMarket = await prisma.market.upsert({
          where: { polymarketMarketId: mkt.slug },
          update: { title: mkt.title || mkt.slug, active: country.status === 'live', closed: country.status === 'resolved' },
          create: { polymarketMarketId: mkt.slug, eventId: dbEvent.id, slug: mkt.slug, title: mkt.title || mkt.slug, active: country.status === 'live', closed: country.status === 'resolved', category: country.electionType },
          select: { id: true },
        })

        // Per candidate: upsert outcome + insert price.
        // O teto vem do registro: mercado de FAIXAS precisa de todas elas, senão
        // a distribuição não fecha e a soma, que é o critério de maturidade,
        // fica impossível de calcular depois.
        const entrada = ELECTION_REGISTRY.find((e) => e.slug === mkt.slug)
        const maxOutcomes = entrada?.isDistribution ? MAX_OUTCOMES_DISTRIBUICAO : MAX_OUTCOMES_DEFAULT
        const cands = mkt.candidates.slice(0, maxOutcomes)

        // Os upserts de outcome são independentes entre si: em paralelo.
        // Em série, um mercado de 14 faixas custava 14 idas ao banco.
        const outcomes = await Promise.all(
          cands.map(async (cand) => {
            const outcomeKey = cand.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 50)
            const dbOutcome = await db.marketOutcome.upsert({
              where: { marketId_outcomeKey: { marketId: dbMarket.id, outcomeKey } },
              update: { outcomeName: cand.name },
              create: { marketId: dbMarket.id, outcomeKey, outcomeName: cand.name },
              select: { id: true },
            })
            return { cand, outcomeKey, outcomeId: dbOutcome.id }
          })
        )

        // Um createMany por mercado em vez de um create por faixa. `skipDuplicates`
        // faz o mesmo papel do P2002 que era capturado antes, sem N round trips.
        if (tier !== 'cold') {
          const linhas = outcomes
            .filter((o) => o.cand.probability > 0)
            .map((o) => ({
              marketId: dbMarket.id,
              outcomeId: o.outcomeId,
              price: o.cand.probability,
              volume: o.cand.volumeUsd,
              snapshotAt: now,
              sourceType: 'cron',
              dedupHash: makeDedupHash(dbMarket.id, o.outcomeKey, now),
            }))
          if (linhas.length > 0) {
            await prisma.marketPrice.createMany({ data: linhas, skipDuplicates: true })
          }
        }

        await markPersisted(redis, mkt.slug, leadProb)
        persisted++
      } catch (err) {
        errors++
        console.warn(`[persist] ${mkt.slug} failed:`, err instanceof Error ? err.message : err)
      }
    }
  }

  if (persisted > 0 || errors > 0) {
    console.log(`[persist] ${persisted} persisted, ${skipped} skipped, ${errors} errors`)
  }

  return { persisted, skipped, errors }
}
