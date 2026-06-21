/**
 * Leitura SERVER-SIDE dos 3 JSONs estáticos do dashboard (pesquisas + cards de
 * análise), para o /[locale]/dashboard renderizá-los no 1º paint (SSR/ISR) em vez
 * de buscar via /api no client (que causava "LCP = spinner").
 *
 * Replica a guarda do /api/polls (exige polls[] array), a defesa de 4 camadas
 * continua: aqui é a 1ª (shape guard), e as seções client mantêm Array.isArray.
 * Retorna `T | null`: null em arquivo ausente/JSON inválido/shape errado, exatamente
 * o que as seções já tratam hoje quando o fetch falha. Os routes /api/* seguem
 * intactos (polymarket/news ainda usam fetch client).
 */
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import type { PollData, AnalysisData, CritData } from '../../app/types'

function readJson(file: string): unknown | null {
  try {
    const p = join(process.cwd(), 'public', file)
    if (!existsSync(p)) return null
    return JSON.parse(readFileSync(p, 'utf-8'))
  } catch {
    return null
  }
}

/** Pesquisas (polls-data.json), mesma guarda do /api/polls: exige polls[] array. */
export function loadPollsData(): PollData | null {
  const data = readJson('polls-data.json')
  if (!data || typeof data !== 'object' || !Array.isArray((data as { polls?: unknown }).polls)) return null
  return data as PollData
}

/** Cards de análise (analysis-data.json). */
export function loadAnalysisCards(): AnalysisData | null {
  const data = readJson('analysis-data.json')
  if (!data || typeof data !== 'object') return null
  return data as AnalysisData
}

/** Análise criteriosa (analysis-criteriosa.json). */
export function loadAnalysisCriteriosa(): CritData | null {
  const data = readJson('analysis-criteriosa.json')
  if (!data || typeof data !== 'object') return null
  return data as CritData
}
