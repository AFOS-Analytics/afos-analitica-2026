/**
 * TSE Persist — Grava pesquisas no Neon (research schema)
 *
 * sources → institutos de pesquisa
 * research_runs → execução do cron
 * research_findings → cada pesquisa individual
 *
 * Otimizado: batch source lookup (1 query) + dedup intra-execução em memória
 * + filtro contra protocolos já existentes (1 query). Sem N+1.
 */

import { prisma } from '../db'
import type { TSEPoll, PollScope } from './ingest'
import { normalizeInstitute, classifyScope } from './ingest'

/**
 * Pesquisa recém-inserida, com o escopo JÁ classificado.
 *
 * 🔑 O escopo sai daqui junto com a linha de propósito. Quem consome (o alerta
 * de pesquisa nacional nova) não deve reclassificar por conta própria: duas
 * cópias da mesma regra convivem sem incidente até o dia em que uma é
 * corrigida e a outra não. Ver memory/feedback_duas_copias_da_mesma_regra.md.
 */
export type InsertedPoll = TSEPoll & { scope: PollScope }

export async function persistPolls(polls: TSEPoll[], runType: string = 'tse_daily'): Promise<{ inserted: number; skipped: number; insertedPolls: InsertedPoll[] }> {
  if (!prisma || polls.length === 0) return { inserted: 0, skipped: 0, insertedPolls: [] }

  // Dedup intra-execução: TSE pode retornar mesma pesquisa 2x (correção)
  const seenProtocolos = new Set<string>()
  const uniquePolls: TSEPoll[] = []
  for (const p of polls) {
    if (!p.protocolo || seenProtocolos.has(p.protocolo)) continue
    seenProtocolos.add(p.protocolo)
    uniquePolls.push(p)
  }
  const dedupedSkipped = polls.length - uniquePolls.length

  const run = await prisma.researchRun.create({
    data: { runType, status: 'running', locale: 'pt-BR' },
  })

  // Batch 1: institutos únicos → uma query findMany + criação dos faltantes
  const instituteNames = Array.from(new Set(uniquePolls.map((p) => normalizeInstitute(p.instituto))))
  const existingSources = await prisma.source.findMany({
    where: { name: { in: instituteNames } },
    select: { id: true, name: true },
  })
  const sourceByName = new Map<string, string>(existingSources.map((s) => [s.name, s.id]))

  const missingInstitutes = instituteNames.filter((n) => !sourceByName.has(n))
  if (missingInstitutes.length > 0) {
    await prisma.source.createMany({
      data: missingInstitutes.map((name) => ({
        name,
        type: 'polling',
        originUrl: 'https://dadosabertos.tse.jus.br',
        credibilityScore: 3,
        active: true,
      })),
      skipDuplicates: true,
    })
    const newSources = await prisma.source.findMany({
      where: { name: { in: missingInstitutes } },
      select: { id: true, name: true },
    })
    for (const s of newSources) sourceByName.set(s.name, s.id)
  }

  // Batch 2: protocolos já existentes em qualquer run anterior
  const protocolos = uniquePolls.map((p) => p.protocolo)
  const existingFindings = await prisma.researchFinding.findMany({
    where: { title: { in: protocolos } },
    select: { title: true },
  })
  const existingProtocolos = new Set(existingFindings.map((f) => f.title))

  const toInsert = uniquePolls.filter((p) => !existingProtocolos.has(p.protocolo))
  const skippedByExisting = uniquePolls.length - toInsert.length

  // Classifica o escopo UMA vez por pesquisa. O resultado alimenta o
  // normalizedPayload abaixo E o retorno da função, para que o alerta não
  // reclassifique com uma segunda cópia da regra.
  const classified = toInsert.map((poll) => ({
    poll,
    scopeClass: classifyScope(poll.metodologia, poll.planoAmostral, poll.dadoMunicipio),
  }))

  // Batch 3: createMany com payload completo
  if (toInsert.length > 0) {
    await prisma.researchFinding.createMany({
      data: classified.map(({ poll, scopeClass }) => {
       return {
        researchRunId: run.id,
        sourceId: sourceByName.get(normalizeInstitute(poll.instituto))!,
        title: poll.protocolo,
        rawPayload: {
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
          conre: poll.conre,
          metodologia: poll.metodologia,
          planoAmostral: poll.planoAmostral,
          sistemaControle: poll.controlSystem,
          dadoMunicipio: poll.dadoMunicipio,
        },
        normalizedPayload: {
          institute: normalizeInstitute(poll.instituto),
          sampleSize: poll.amostra,
          fieldStart: poll.campoInicio,
          fieldEnd: poll.campoFim,
          publicationDate: poll.divulgacao,
          registrationDate: poll.registroDate,
          cost: poll.valorPesquisa,
          uf: poll.uf,
          // O TSE devolve uf="BR" para todo o arquivo BRASIL.csv, então `uf` não
          // discrimina nacional×estadual. O escopo real vem do universo declarado
          // na metodologia/plano amostral/dado-município. scopeSource registra qual
          // fonte decidiu (auditoria). Ver classifyScope() em scope.mjs.
          scope: scopeClass.scope,
          scopeSource: scopeClass.source,
          // campos públicos completos do TSE (Lei 9.504/97 art. 33), sem truncar
          cnpj: poll.cnpj,
          statistician: poll.estatistico,
          conre: poll.conre,
          methodology: poll.metodologia,
          samplingPlan: poll.planoAmostral,
          controlSystem: poll.controlSystem,
        },
        language: 'pt-BR',
        countryCode: 'BRA',
        eventDate: poll.divulgacao ? new Date(poll.divulgacao) : null,
        confidenceScore: calculateConfidence(poll),
       }
      }),
      skipDuplicates: true,
    })
  }

  const totalSkipped = dedupedSkipped + skippedByExisting

  await prisma.researchRun.update({
    where: { id: run.id },
    data: {
      status: 'completed',
      finishedAt: new Date(),
      summary: `TSE ingest: ${toInsert.length} new, ${totalSkipped} skipped of ${polls.length} total (${dedupedSkipped} dedup intra, ${skippedByExisting} já existentes)`,
    },
  })

  return {
    inserted: toInsert.length,
    skipped: totalSkipped,
    insertedPolls: classified.map(({ poll, scopeClass }) => ({ ...poll, scope: scopeClass.scope })),
  }
}

function calculateConfidence(poll: TSEPoll): number {
  let score = 0.5
  if (poll.amostra >= 2000) score += 0.2
  else if (poll.amostra >= 1000) score += 0.1
  else if (poll.amostra < 500) score -= 0.1

  const known = ['DATAFOLHA', 'QUAEST', 'ATLAS', 'PARANA', 'REAL TIME', 'IPEC', 'MDA']
  if (known.some((k) => poll.instituto.toUpperCase().includes(k))) score += 0.2

  return Math.max(0, Math.min(1, score))
}
