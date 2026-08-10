/**
 * backfill-broadcast-audit.ts — reconstrói a trilha de um disparo que já saiu.
 *
 * ⚠️ ISTO NÃO É MEDIÇÃO, É RECONSTRUÇÃO. O evento gravado aqui diz que o
 * broadcast foi disparado para a lista de ativos, com base no relatório
 * agregado do terminal, e NÃO em confirmação por destinatário. Todo registro
 * sai marcado `backfill: true` com a `fonte` declarada, e o leitor
 * (`check-broadcast-audit.ts`) mostra o aviso. Procedência é o ponto.
 *
 * Existe para dois casos:
 *  1. Disparos anteriores a 09/Ago/2026, quando não havia trilha nenhuma.
 *  2. Disparo em que o e-mail saiu e a gravação falhou. Nesse caso o próprio
 *     broadcast imprime o comando a rodar.
 *
 *   npx tsx scripts/backfill-broadcast-audit.ts tradeoff 2026-08-10 --pais=br \
 *     --fonte="relatorio do terminal 09/Ago: 20 enviados / 0 falhas / 0 pulados"
 */
import { config as dotenv } from 'dotenv'
dotenv({ path: '.env.local' })

import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { registrarBroadcast, type ResultadoEnvio } from './lib/broadcast-audit'

async function main() {
  const [produto, edicao] = process.argv.slice(2)
  if (!produto || !/^(daily|tradeoff|weekly)$/.test(produto) || !edicao || !/^\d{4}-\d{2}-\d{2}$/.test(edicao)) {
    console.error('Uso: npx tsx scripts/backfill-broadcast-audit.ts <daily|tradeoff|weekly> YYYY-MM-DD [--pais=br] [--issue=N] --fonte="..."')
    process.exit(1)
  }
  const pais = process.argv.find((a) => a.startsWith('--pais='))?.split('=')[1] ?? 'br'
  const issueRaw = process.argv.find((a) => a.startsWith('--issue='))?.split('=')[1]
  const issueNumber = issueRaw ? Number(issueRaw) : undefined
  const fonte = process.argv.find((a) => a.startsWith('--fonte='))?.slice('--fonte='.length)

  if (!fonte) {
    console.error('❌ --fonte é OBRIGATÓRIA. Registro reconstruído sem procedência declarada é pior que registro nenhum,')
    console.error('   porque parece medição. Diga de onde veio o dado.')
    process.exit(1)
  }

  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
  if (!url) { console.error('❌ DATABASE_URL não configurada'); process.exit(1) }
  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: url }) })

  // Idempotência: se já existe trilha para este disparo, não duplicar.
  const existentes = await prisma.contactEvent.findMany({
    where: { eventType: { startsWith: `broadcast_${produto}_` } },
    select: { eventPayload: true },
  })
  const jaTem = existentes.filter((e) => {
    const p = (e.eventPayload || {}) as { edicao?: string; pais?: string }
    return p.edicao === edicao && p.pais === pais
  }).length
  if (jaTem > 0) {
    console.log(`⚠️ já existem ${jaTem} evento(s) para ${produto} ${edicao} ${pais}. Nada a fazer.`)
    console.log('   Para inspecionar: npx tsx scripts/check-broadcast-audit.ts ' + edicao)
    await prisma.$disconnect()
    return
  }

  const leads = await prisma.lead.findMany({
    where: { status: 'active' },
    select: { id: true, preferredLocale: true, locale: true },
  })
  console.log(`📋 ${leads.length} leads ativos AGORA.`)
  console.log('⚠️ A lista de ativos é a de agora, não a do momento do disparo. Se alguém')
  console.log('   entrou ou saiu no intervalo, o backfill herda essa diferença.\n')

  const resultados: ResultadoEnvio[] = leads.map((l) => {
    const raw = (l.preferredLocale || l.locale || 'en').toLowerCase()
    const locale = raw.startsWith('pt') ? 'pt-BR' : raw.startsWith('es') ? 'es' : 'en'
    // sem messageId de propósito: não existe, e inventar seria pior
    return { leadId: l.id, locale, ok: true }
  })

  const r = await registrarBroadcast(
    prisma,
    { produto, edicao, pais, issueNumber, backfill: true, fonte },
    resultados,
  )
  console.log(r.erro ? `❌ ${r.erro}` : `✅ backfill gravado: ${r.gravados} evento(s), todos marcados backfill:true.`)
  await prisma.$disconnect()
}

main().catch((e) => { console.error('❌ falhou:', e); process.exit(1) })
