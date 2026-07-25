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

/**
 * Escolhe o arquivo do locale, com FALLBACK EXPLÍCITO para pt-BR.
 *
 * O pt-BR é a fonte; en e es são gerados por tradução no /atualizar. Quando a
 * tradução falha ou é descartada pelo gate numérico, o arquivo do locale
 * simplesmente não existe, e o leitor recebe o conteúdo em português.
 *
 * Essa é a decisão de projeto (24/Jul/2026): melhor servir português do que
 * servir um número traduzido errado. Tradução é hoje a maior fonte de defeito
 * do pipeline, e número errado num produto de dado custa mais que idioma errado.
 */
function readLocalized(base: string, locale?: string): unknown | null {
  if (locale && locale !== 'pt-BR') {
    const traduzido = readJson(base.replace(/\.json$/, `.${locale}.json`))
    if (traduzido) return traduzido
  }
  return readJson(base)
}

/** Pesquisas (polls-data.json), mesma guarda do /api/polls: exige polls[] array. */
export function loadPollsData(locale?: string): PollData | null {
  const data = readLocalized('polls-data.json', locale)
  if (!data || typeof data !== 'object' || !Array.isArray((data as { polls?: unknown }).polls)) return null
  return data as PollData
}

/** Cards de análise (analysis-data.json). */
export function loadAnalysisCards(locale?: string): AnalysisData | null {
  const data = readLocalized('analysis-data.json', locale)
  if (!data || typeof data !== 'object') return null
  return data as AnalysisData
}

/** Análise criteriosa (analysis-criteriosa.json). */
export function loadAnalysisCriteriosa(locale?: string): CritData | null {
  const data = readLocalized('analysis-criteriosa.json', locale)
  if (!data || typeof data !== 'object') return null
  return data as CritData
}
