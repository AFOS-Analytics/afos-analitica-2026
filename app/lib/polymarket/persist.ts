/**
 * Polymarket → Neon Persistence
 *
 * Cron inteligente: hot (15min), warm (60min), cold (skip).
 * Dedup 2 camadas: Redis timestamp + DB UNIQUE hash.
 * Fire-and-forget — falha não impacta dashboard.
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

        // Per candidate: upsert outcome + insert price
        for (const cand of mkt.candidates.slice(0, 10)) {
          const outcomeKey = cand.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 50)

          const dbOutcome = await prisma.marketOutcome.upsert({
            where: { marketId_outcomeKey: { marketId: dbMarket.id, outcomeKey } },
            update: { outcomeName: cand.name },
            create: { marketId: dbMarket.id, outcomeKey, outcomeName: cand.name },
            select: { id: true },
          })

          if (tier !== 'cold' && cand.probability > 0) {
            const hash = makeDedupHash(dbMarket.id, outcomeKey, now)
            try {
              await prisma.marketPrice.create({
                data: {
                  marketId: dbMarket.id,
                  outcomeId: dbOutcome.id,
                  price: cand.probability,
                  volume: cand.volumeUsd,
                  snapshotAt: now,
                  sourceType: 'cron',
                  dedupHash: hash,
                },
              })
            } catch (err) {
              if ((err as { code?: string }).code !== 'P2002') throw err
              // P2002 = dedup working
            }
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
