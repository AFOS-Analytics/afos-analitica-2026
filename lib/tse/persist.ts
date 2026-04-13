/**
 * TSE Persist — Grava pesquisas no Neon (research schema)
 *
 * sources → institutos de pesquisa
 * research_runs → execução do cron
 * research_findings → cada pesquisa individual
 */

import { prisma } from '../db'
import type { TSEPoll } from './ingest'
import { normalizeInstitute } from './ingest'

/**
 * Grava pesquisas no banco. Idempotente por protocolo TSE.
 * Retorna contagem de novas inseridas.
 */
export async function persistPolls(polls: TSEPoll[], runType: string = 'tse_daily'): Promise<{ inserted: number; skipped: number }> {
  if (!prisma) return { inserted: 0, skipped: 0 }

  // Criar run
  const run = await prisma.researchRun.create({
    data: {
      runType,
      status: 'running',
      locale: 'pt-BR',
    },
  })

  let inserted = 0
  let skipped = 0

  for (const poll of polls) {
    try {
      // Upsert source (instituto)
      const instituteName = normalizeInstitute(poll.instituto)
      let source = await prisma.source.findFirst({
        where: { name: instituteName },
        select: { id: true },
      })
      if (!source) {
        source = await prisma.source.create({
          data: {
            name: instituteName,
            type: 'polling',
            originUrl: 'https://dadosabertos.tse.jus.br',
            credibilityScore: 3,
            active: true,
          },
          select: { id: true },
        })
      }

      // Check duplicata por protocolo
      const existing = await prisma.researchFinding.findFirst({
        where: {
          researchRunId: run.id,
          title: poll.protocolo,
        },
      })

      if (!existing) {
        // Check se protocolo já existe de run anterior
        const existingAny = await prisma.researchFinding.findFirst({
          where: { title: poll.protocolo },
          select: { id: true },
        })

        if (existingAny) {
          skipped++
          continue
        }

        await prisma.researchFinding.create({
          data: {
            researchRunId: run.id,
            sourceId: source.id,
            title: poll.protocolo,
            rawPayload: JSON.parse(JSON.stringify({
              instituto: poll.instituto,
              institutoFantasia: poll.institutoFantasia,
              cnpj: poll.cnpj,
              cargo: poll.cargo,
              campoInicio: poll.campoInicio,
              campoFim: poll.campoFim,
              divulgacao: poll.divulgacao,
              amostra: poll.amostra,
              valorPesquisa: poll.valorPesquisa,
              estatistico: poll.estatistico,
              metodologia: poll.metodologia,
            })),
            normalizedPayload: JSON.parse(JSON.stringify({
              institute: instituteName,
              sampleSize: poll.amostra,
              fieldStart: poll.campoInicio,
              fieldEnd: poll.campoFim,
              publicationDate: poll.divulgacao,
              registrationDate: poll.registroDate,
              cost: poll.valorPesquisa,
            })),
            language: 'pt-BR',
            countryCode: 'BRA',
            eventDate: poll.divulgacao ? new Date(poll.divulgacao) : null,
            confidenceScore: calculateConfidence(poll),
          },
        })
        inserted++
      } else {
        skipped++
      }
    } catch (err) {
      console.warn(`[tse-persist] Failed to persist ${poll.protocolo}:`, err instanceof Error ? err.message : err)
      skipped++
    }
  }

  // Finalizar run
  await prisma.researchRun.update({
    where: { id: run.id },
    data: {
      status: 'completed',
      finishedAt: new Date(),
      summary: `TSE ingest: ${inserted} new, ${skipped} skipped of ${polls.length} total`,
    },
  })

  return { inserted, skipped }
}

/**
 * Score de confiança baseado em metadados da pesquisa.
 */
function calculateConfidence(poll: TSEPoll): number {
  let score = 0.5

  // Amostra grande = mais confiável
  if (poll.amostra >= 2000) score += 0.2
  else if (poll.amostra >= 1000) score += 0.1
  else if (poll.amostra < 500) score -= 0.1

  // Instituto conhecido = mais confiável
  const known = ['DATAFOLHA', 'QUAEST', 'ATLAS', 'PARANA', 'REAL TIME', 'IPEC', 'MDA']
  if (known.some(k => poll.instituto.toUpperCase().includes(k))) score += 0.2

  return Math.max(0, Math.min(1, score))
}
