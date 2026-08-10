/**
 * RSS 2.0 feed for AFOS Tradeoff ESTADOS UNIDOS (PT-BR). At /feed/tradeoff-us.xml.
 *
 * EN/ES variants live at /feed/tradeoff-us.en.xml and /feed/tradeoff-us.es.xml.
 * All three share lib/feeds/rss.ts; locale feeds list only weekly editions that
 * have a translation on disk.
 *
 * 🔴 Criado em 10/Ago/2026 para consertar uma OMISSÃO: até aqui só existiam os
 * feeds do Brasil, e as edições dos EUA, publicadas desde 31/Jul, nunca foram
 * distribuídas por RSS. O produto do Brasil segue em /feed/tradeoff.xml, sem
 * qualificador, porque aquele endereço já tem assinantes.
 */

import { buildTradeoffFeed, rssResponse } from '../../../lib/feeds/rss'

export const dynamic = 'force-static'
export const revalidate = 3600

export function GET() {
  return rssResponse(buildTradeoffFeed('pt-BR', 'us'))
}
