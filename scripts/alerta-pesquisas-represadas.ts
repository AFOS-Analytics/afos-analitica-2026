/**
 * alerta-pesquisas-represadas.ts — dispara o alerta de PESQUISA NACIONAL NOVA
 * para as que entraram numa ingestão MANUAL, onde o aviso não saiu na hora.
 *
 * Uso:
 *   npx tsx scripts/alerta-pesquisas-represadas.ts                 # ENSAIO
 *   npx tsx scripts/alerta-pesquisas-represadas.ts --apply         # envia
 *   npx tsx scripts/alerta-pesquisas-represadas.ts --apply --para=x@y.com
 *
 * 🔴 POR QUE ISTO EXISTE (22/Ago/2026). O `alertNewNationalPolls` nasce DENTRO
 * do cron, recebendo o que o `persistPolls` acabou de devolver. Quando a
 * ingestão roda pelo caminho manual (`ingest-tse-local.ts`), aquele retorno é
 * consumido e descartado, e o aviso simplesmente não acontece. Com a borda do
 * TSE bloqueando datacenter desde 18/Ago, o caminho manual deixou de ser
 * exceção, então o buraco deixou de ser teórico.
 *
 * 🔑 RECONSTRÓI do banco em vez de reclassificar. O escopo já foi decidido por
 * `classifyScope()` no momento da gravação e está em `normalizedPayload.scope`.
 * Reclassificar aqui seria a segunda cópia da regra, que é o defeito que a
 * própria assinatura de `alertNewNationalPolls` avisa para não cometer.
 *
 * ✅ O dedup por protocolo (Redis, 45 dias) continua valendo, então rodar duas
 * vezes não manda dois avisos. É ele que torna seguro reprocessar uma janela.
 *
 * ⚠️ `--para=` existe porque teste que escreve na caixa de produção é teste que
 * suja: o correio é Zoho, o projeto só tem chave de ENVIO e não há como apagar
 * mensagem entregue. Sem `--apply`, nada sai e o corpo é impresso na tela.
 */
import { config } from 'dotenv'
config({ path: '.env.local' })

const APLICAR = process.argv.includes('--apply')
const PARA = process.argv.find((a) => a.startsWith('--para='))?.slice('--para='.length)
const HORAS = Number(process.argv.find((a) => a.startsWith('--horas='))?.slice('--horas='.length) ?? 24)

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL ausente. Nada lido, nada enviado.')
    process.exit(1)
  }
  const { PrismaClient } = await import('@prisma/client')
  const { PrismaNeon } = await import('@prisma/adapter-neon')
  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }) })

  const desde = new Date(Date.now() - HORAS * 3600 * 1000)
  const achados = await prisma.researchFinding.findMany({
    where: { countryCode: 'BRA', createdAt: { gte: desde } },
    select: { title: true, rawPayload: true, normalizedPayload: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })
  console.log(`   inseridas nas últimas ${HORAS}h: ${achados.length}`)

  // Reconstrói o formato que o alerta espera. O escopo vem do banco, não de
  // uma segunda classificação.
  const polls = achados
    .map((a) => {
      const raw = (a.rawPayload ?? {}) as Record<string, unknown>
      const norm = (a.normalizedPayload ?? {}) as Record<string, unknown>
      return {
        protocolo: a.title,
        instituto: String(raw.instituto ?? norm.institute ?? ''),
        campoInicio: String(raw.campoInicio ?? norm.fieldStart ?? ''),
        campoFim: String(raw.campoFim ?? norm.fieldEnd ?? ''),
        amostra: Number(raw.amostra ?? norm.sampleSize ?? 0),
        divulgacao: String(raw.divulgacao ?? norm.publicationDate ?? ''),
        scope: String(norm.scope ?? 'unknown'),
      }
    })
    .filter((p) => p.scope === 'national')

  console.log(`   de escopo NACIONAL: ${polls.length}`)
  if (!polls.length) { console.log('✅ nada a avisar.'); await prisma.$disconnect(); return }

  for (const p of polls) {
    console.log(`     • ${p.instituto} | ${p.protocolo} | campo ${p.campoInicio} a ${p.campoFim} | n=${p.amostra} | divulgação ${p.divulgacao}`)
  }

  if (!APLICAR) {
    console.log('\n🔵 ENSAIO: nenhum email enviado. Repita com --apply.')
    await prisma.$disconnect()
    return
  }

  const { alertNewNationalPolls } = await import('../app/lib/cron/poll-alerts')
  const { EMAIL_ALERTS } = await import('../app/lib/contacts')
  const destino = PARA ?? EMAIL_ALERTS
  console.log(`\n📧 enviando 1 email para ${destino}…`)
  const n = await alertNewNationalPolls(polls as never, destino)
  console.log(n > 0
    ? `✅ aviso enviado cobrindo ${n} pesquisa(s). As demais já estavam na trava de dedup.`
    : '⚠️ zero avisadas: todas já constavam na trava de dedup do Redis (45 dias). Nenhum email saiu.')
  await prisma.$disconnect()
}

main().catch((e) => { console.error('❌ falhou:', e?.message ?? e); process.exit(1) })
