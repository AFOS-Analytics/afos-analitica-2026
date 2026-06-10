/**
 * Gera o REGISTRO oficial de pesquisas eleitorais do TSE (tabela researchFinding, Neon)
 * como artefato ESTÁTICO público em hf-assets/polls/ (metadado de registro: instituto, amostra,
 * escopo, UF, datas de campo, protocolo, custo — SEM resultados por candidato, SEM demografia).
 *
 * Este script É db-backed (usa Prisma) DE PROPÓSITO — ele NÃO é o export do HF. O export
 * (export-hf-dataset.mjs) permanece DB-free e apenas COPIA o arquivo gerado aqui.
 * researchFinding é metadado PÚBLICO do TSE, não contém PII nem dado de assinante (Lead).
 *
 * Uso: DATABASE_URL="..." node .cache/build-tse-registry.mjs
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const OUT = join(process.cwd(), 'hf-assets', 'polls')
mkdirSync(OUT, { recursive: true })
const csvEscape = (v) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: url }) })
const rows = await prisma.researchFinding.findMany({
  where: { countryCode: 'BRA' },
  select: { title: true, normalizedPayload: true, confidenceScore: true, eventDate: true, createdAt: true, source: { select: { name: true, credibilityScore: true } } },
  orderBy: { eventDate: 'desc' },
})
console.log(`📋 ${rows.length} registros TSE (researchFinding, BRA)`)

const flat = rows.map((r) => {
  const p = (typeof r.normalizedPayload === 'string' ? JSON.parse(r.normalizedPayload) : r.normalizedPayload) || {}
  return {
    register_tse: r.title || '',
    institute: p.institute || '',
    scope: p.scope || '',
    uf: p.uf || '',
    sample_size: p.sampleSize ?? '',
    field_start: p.fieldStart || '',
    field_end: p.fieldEnd || '',
    publication_date: p.publicationDate || '',
    registration_date: p.registrationDate || '',
    cost: p.cost ?? '',
    confidence_score: r.confidenceScore ?? '',
    source_name: r.source?.name || '',
    source_credibility: r.source?.credibilityScore ?? '',
    event_date: r.eventDate ? r.eventDate.toISOString().slice(0, 10) : '',
  }
})

const cols = Object.keys(flat[0])
writeFileSync(join(OUT, 'tse-registry.csv'),
  [cols.join(','), ...flat.map((o) => cols.map((c) => csvEscape(o[c])).join(','))].join('\n') + '\n')
writeFileSync(join(OUT, 'tse-registry.json'), JSON.stringify({
  description: 'Official TSE electoral-poll REGISTRY metadata (Brazil 2026). Registration-sheet fields only — no per-candidate results, no demographic crosstabs.',
  source: 'TSE public registry (divulgacandcontas.tse.jus.br) ingested into AFOS researchFinding table',
  count: flat.length,
  records: flat,
}, null, 2))
console.log(`✅ tse-registry.csv + .json (${flat.length} registros) → hf-assets/polls/`)
await prisma.$disconnect()
