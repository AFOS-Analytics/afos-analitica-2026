/**
 * check-broadcast-audit.ts — lê a trilha de auditoria dos broadcasts.
 *
 * Trilha que ninguém consegue ler não é trilha. Este é o lado da leitura de
 * `scripts/lib/broadcast-audit.ts`.
 *
 *   npx tsx scripts/check-broadcast-audit.ts                  # últimos 30 dias
 *   npx tsx scripts/check-broadcast-audit.ts 2026-08-10       # uma edição
 *   npx tsx scripts/check-broadcast-audit.ts --produto=daily  # um produto
 *   npx tsx scripts/check-broadcast-audit.ts 2026-08-10 --emails   # com e-mail
 *
 * 🔒 O e-mail fica MASCARADO por padrão. `--emails` mostra inteiro, e existe
 * porque reenvio dirigido precisa do endereço. Nunca colar essa saída em
 * lugar público: a tabela é PESSOAL e fica fora do backup do repositório.
 */
import { config as dotenv } from 'dotenv'
dotenv({ path: '.env.local' })

import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

type Payload = {
  produto?: string
  edicao?: string
  pais?: string
  issueNumber?: number
  locale?: string
  messageId?: string
  erro?: string
  backfill?: boolean
  fonte?: string
}

async function main() {
  const args = process.argv.slice(2)
  const edicao = args.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a))
  const produto = args.find((a) => a.startsWith('--produto='))?.split('=')[1]
  const mostrarEmails = args.includes('--emails')
  const dias = Number(args.find((a) => a.startsWith('--dias='))?.split('=')[1]) || 30

  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
  if (!url) {
    console.error('❌ DATABASE_URL não configurada')
    process.exit(1)
  }
  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: url }) })

  const desde = new Date()
  desde.setDate(desde.getDate() - dias)

  const eventos = await prisma.contactEvent.findMany({
    where: {
      eventType: { startsWith: 'broadcast_' },
      ...(edicao ? {} : { createdAt: { gte: desde } }),
    },
    select: {
      eventType: true,
      eventPayload: true,
      createdAt: true,
      lead: { select: { email: true, status: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 5000,
  })

  const filtrados = eventos.filter((e) => {
    const p = (e.eventPayload || {}) as Payload
    if (edicao && p.edicao !== edicao) return false
    if (produto && p.produto !== produto) return false
    return true
  })

  if (filtrados.length === 0) {
    console.log('🧾 nenhum evento de broadcast no recorte.')
    if (edicao) console.log(`   Recorte: edição ${edicao}${produto ? ` · produto ${produto}` : ''}`)
    else console.log(`   Recorte: últimos ${dias} dias${produto ? ` · produto ${produto}` : ''}`)
    console.log('   ⚠️ Ausência aqui NÃO prova que não houve disparo: a trilha só')
    console.log('      começou em 09/Ago/2026. Antes disso não havia registro nenhum.')
    await prisma.$disconnect()
    return
  }

  // agrupa por disparo (produto + edição + país)
  const grupos = new Map<string, typeof filtrados>()
  for (const e of filtrados) {
    const p = (e.eventPayload || {}) as Payload
    const k = `${p.produto ?? '?'} · ${p.edicao ?? '?'} · ${p.pais ?? '?'}`
    if (!grupos.has(k)) grupos.set(k, [])
    grupos.get(k)!.push(e)
  }

  console.log(`🧾 ${filtrados.length} evento(s) em ${grupos.size} disparo(s)\n`)

  for (const [k, lista] of [...grupos.entries()].sort()) {
    const p0 = (lista[0].eventPayload || {}) as Payload
    const enviados = lista.filter((e) => e.eventType.endsWith('_sent')).length
    const falhas = lista.filter((e) => e.eventType.endsWith('_failed')).length
    const pulados = lista.filter((e) => e.eventType.endsWith('_skipped')).length
    const comId = lista.filter((e) => ((e.eventPayload || {}) as Payload).messageId).length
    const backfill = lista.some((e) => ((e.eventPayload || {}) as Payload).backfill)
    const quando = lista.map((e) => e.createdAt).sort()[0]

    const porLocale: Record<string, number> = {}
    for (const e of lista) {
      const loc = ((e.eventPayload || {}) as Payload).locale ?? '?'
      porLocale[loc] = (porLocale[loc] || 0) + 1
    }

    console.log(`▸ ${k}${p0.issueNumber !== undefined ? ` · №${p0.issueNumber}` : ''}${backfill ? '  ⚠️ BACKFILL' : ''}`)
    console.log(`    ${quando.toISOString().replace('T', ' ').slice(0, 19)} UTC`)
    console.log(`    ${enviados} enviados · ${falhas} falharam · ${pulados} pulados`)
    console.log(`    idioma: ${Object.entries(porLocale).map(([l, n]) => `${l}=${n}`).join(' ')}`)
    console.log(`    com messageId do Resend: ${comId} de ${lista.length}${comId < lista.length ? '  (sem id não dá para reconciliar)' : ''}`)
    if (backfill) {
      const f = lista.find((e) => ((e.eventPayload || {}) as Payload).fonte)
      console.log(`    ⚠️ registro reconstruído, não medido no envio. Fonte: ${((f?.eventPayload || {}) as Payload).fonte ?? 'não declarada'}`)
    }
    if (falhas > 0) {
      console.log('    falhas:')
      for (const e of lista.filter((x) => x.eventType.endsWith('_failed'))) {
        const pp = (e.eventPayload || {}) as Payload
        const mail = e.lead?.email ?? '(lead removido)'
        console.log(`      ${mostrarEmails ? mail : mail.slice(0, 3) + '***'} — ${pp.erro ?? 'sem motivo registrado'}`)
      }
    }
    console.log('')
  }

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error('❌ falhou:', e)
  process.exit(1)
})
