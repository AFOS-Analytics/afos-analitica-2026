/**
 * TSE × Polymarket Cross-Analysis
 *
 * Cruza pesquisas recentes (últimos 15 dias) com odds atuais do Polymarket.
 * Gera análise comparativa: o que as pesquisas dizem vs o que o mercado precifica.
 */

import type { TSEPoll } from './ingest'
import { normalizeInstitute } from './ingest'

export interface PollCrossAnalysis {
  // Pesquisa
  institute: string
  protocolo: string
  sampleSize: number
  fieldStart: string
  fieldEnd: string
  publicationDate: string
  confidence: number

  // Polymarket (snapshot atual)
  polymarketOdds: { candidate: string; probability: number }[]

  // Metadata
  daysAgo: number
  status: 'fresh' | 'recent' | 'aging'
}

export interface CrossSummary {
  totalPolls: number
  recentPolls: PollCrossAnalysis[]
  topInstitutes: { name: string; count: number; avgSample: number }[]
  polymarketSnapshot: { candidate: string; probability: number }[]
  generatedAt: string
}

/**
 * Gera resumo cruzado: pesquisas dos últimos 15 dias vs Polymarket.
 */
export function generateCrossAnalysis(
  recentPolls: TSEPoll[],
  polymarketOdds: { candidate: string; probability: number }[]
): CrossSummary {
  const now = new Date()

  const analyses: PollCrossAnalysis[] = recentPolls.map(p => {
    const regDate = new Date(p.registroDate)
    const daysAgo = Math.floor((now.getTime() - regDate.getTime()) / 86400000)

    return {
      institute: normalizeInstitute(p.instituto),
      protocolo: p.protocolo,
      sampleSize: p.amostra,
      fieldStart: p.campoInicio,
      fieldEnd: p.campoFim,
      publicationDate: p.divulgacao,
      confidence: calculateCrossConfidence(p),
      polymarketOdds,
      daysAgo,
      status: daysAgo <= 3 ? 'fresh' : daysAgo <= 7 ? 'recent' : 'aging',
    }
  })

  // Top institutos por frequência
  const instituteMap = new Map<string, { count: number; totalSample: number }>()
  for (const a of analyses) {
    const existing = instituteMap.get(a.institute) || { count: 0, totalSample: 0 }
    existing.count++
    existing.totalSample += a.sampleSize
    instituteMap.set(a.institute, existing)
  }

  const topInstitutes = Array.from(instituteMap.entries())
    .map(([name, { count, totalSample }]) => ({
      name,
      count,
      avgSample: Math.round(totalSample / count),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return {
    totalPolls: recentPolls.length,
    recentPolls: analyses.sort((a, b) => a.daysAgo - b.daysAgo),
    topInstitutes,
    polymarketSnapshot: polymarketOdds,
    generatedAt: now.toISOString(),
  }
}

function calculateCrossConfidence(poll: TSEPoll): number {
  let score = 0.5
  if (poll.amostra >= 2000) score += 0.2
  else if (poll.amostra >= 1000) score += 0.1
  const known = ['DATAFOLHA', 'QUAEST', 'ATLAS', 'PARANA', 'REAL TIME', 'IPEC']
  if (known.some(k => poll.instituto.toUpperCase().includes(k))) score += 0.2
  return Math.max(0, Math.min(1, score))
}
