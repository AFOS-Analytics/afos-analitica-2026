/**
 * Seed mínimo para desenvolvimento.
 *
 * Cria dados de teste nos schemas iam, crm, governance, ai e research.
 * Seguro para rodar múltiplas vezes (upsert por email/slug).
 *
 * Uso: npx tsx scripts/seed-dev.ts
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) { console.error('❌ DATABASE_URL não configurada'); process.exit(1) }

  const adapter = new PrismaNeon({ connectionString: url })
  const prisma = new PrismaClient({ adapter })

  console.log('\n🌱 Seed dev\n')

  // ── IAM ──
  const user = await prisma.user.upsert({
    where: { email: 'dev@afos-analytics.com' },
    update: {},
    create: { email: 'dev@afos-analytics.com', name: 'Dev User', locale: 'pt-BR', status: 'active' },
  })
  console.log('  ✅ iam.users:', user.email)

  await prisma.userPreference.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id, locale: 'pt-BR', timezone: 'America/Sao_Paulo', marketingOptIn: false },
  })
  console.log('  ✅ iam.user_preferences')

  await prisma.userConsent.create({
    data: {
      userId: user.id,
      email: user.email,
      consentType: 'data_processing',
      granted: true,
      policyVersion: '1.0',
      source: 'seed',
      locale: 'pt-BR',
    },
  })
  console.log('  ✅ iam.user_consents')

  // ── CRM ──
  const lead = await prisma.lead.upsert({
    where: { email: 'lead@example.com' },
    update: {},
    create: { email: 'lead@example.com', captureSource: 'seed', locale: 'pt-BR', status: 'active' },
  })
  console.log('  ✅ crm.leads:', lead.email)

  await prisma.contactEvent.create({
    data: { leadId: lead.id, eventType: 'subscribed', eventPayload: { source: 'seed' } },
  })
  console.log('  ✅ crm.contact_events')

  // ── Research ──
  const source = await prisma.source.create({
    data: { name: 'Datafolha', type: 'polling', originUrl: 'https://datafolha.folha.uol.com.br', credibilityScore: 5 },
  })
  console.log('  ✅ research.sources:', source.name)

  const report = await prisma.analysisReport.upsert({
    where: { slug: 'seed-test-report' },
    update: {},
    create: {
      slug: 'seed-test-report',
      title: 'Relatório de Teste',
      locale: 'pt-BR',
      status: 'draft',
      executiveSummary: 'Resumo executivo de teste.',
      bodyMarkdown: '# Teste\n\nConteúdo de teste para desenvolvimento.',
    },
  })
  console.log('  ✅ research.analysis_reports:', report.slug)

  // ── Governance ──
  await prisma.auditLog.create({
    data: { actorType: 'system', action: 'seed_executed', entityType: 'system', entityId: 'seed-dev' },
  })
  console.log('  ✅ governance.audit_logs')

  // ── AI ──
  await prisma.llmRun.create({
    data: {
      runType: 'translation',
      modelName: 'claude-haiku-4-5-20251001',
      promptVersion: '1.0',
      inputHash: 'seed-test-input-hash',
    },
  })
  console.log('  ✅ ai.llm_runs')

  console.log('\n📊 Seed completo\n')
  await prisma.$disconnect()
}

main().catch((err) => { console.error('💥', err); process.exit(1) })
