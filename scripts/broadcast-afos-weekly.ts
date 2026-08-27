/**
 * broadcast-afos-weekly.ts — Envia o teaser do AFOS Weekly aos assinantes ativos.
 *
 * Construído em 06/Ago/2026, junto da publicação da Edição №1, que foi a
 * decisão do André em 03/Ago: o broadcast se constrói na quinta, com a edição,
 * e a №1 não sai sem ele.
 *
 *   npx tsx scripts/broadcast-afos-weekly.ts 2026-08-06 --pais=us --dry-run
 *   npx tsx scripts/broadcast-afos-weekly.ts 2026-08-06 --pais=us
 *   npx tsx scripts/broadcast-afos-weekly.ts 2026-08-06 --pais=us --email=alguem@dominio.com
 *
 * 🔴 ESPELHA O TRADEOFF NA MECÂNICA E DIVERGE EM TRÊS PONTOS, todos já pagos
 * caro em outro lugar:
 *
 * 1. O INGLÊS É A ORIGEM. O arquivo canônico é `{data}.md` e está EM INGLÊS;
 *    as traduções levam sufixo. No Tradeoff é o contrário. Copiar a tabela de
 *    sufixos de lá faria este script procurar um `.en.md` que não existe e
 *    deixar o inglês de fora em silêncio.
 * 2. A FALTA DE TRADUÇÃO CAI PARA O INGLÊS, nunca para o português. Assinante
 *    americano recebendo português é pior que receber o original.
 * 3. O PAÍS É OBRIGATÓRIO, sem padrão. O script do Tradeoff nasceu preso à raiz
 *    e teria disparado a peça brasileira para a lista inteira reportando
 *    sucesso. Aqui não existe padrão para errar: sem `--pais`, o script para.
 */
import { config as dotenv } from 'dotenv'
dotenv({ path: '.env.local' })

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { sendWeeklyTeaser } from '../app/lib/email/resend'
import { registrarBroadcast, type ResultadoEnvio } from './lib/broadcast-audit'

const PAISES_VALIDOS = ['us']

/** Todo país tem subpasta, inclusive o primeiro. Sem a assimetria do Tradeoff. */
function dirDoPais(pais: string): string {
  return join(process.cwd(), 'public', 'afos-weekly', pais)
}

// Throttle idêntico ao do Tradeoff: o limite real do Resend é 5 req/s, e o
// `interSendMs` é stagger cumulativo dentro do lote. 220ms já bateu 429 no
// primeiro broadcast do Tradeoff; 260ms dá ~3,8/s e folga real.
function pickThrottle(leadCount: number): { batchSize: number; batchDelayMs: number; interSendMs: number } {
  if (leadCount > 200) return { batchSize: 5, batchDelayMs: 1000, interSendMs: 260 }
  if (leadCount > 50) return { batchSize: 8, batchDelayMs: 1000, interSendMs: 260 }
  return { batchSize: 10, batchDelayMs: 1000, interSendMs: 260 }
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

type Locale = 'pt-BR' | 'en' | 'es'

/** 🔴 O INGLÊS É O ARQUIVO SEM SUFIXO. Não copiar isto do Tradeoff. */
const LOCALE_SUFFIX: Record<Locale, string> = { en: '', 'pt-BR': '.pt-BR', es: '.es' }

interface WeeklyContent {
  title: string
  resumo: string
  issueNumber: number
}

function lerFrontmatter(date: string, locale: Locale, pais: string): WeeklyContent | null {
  const path = join(dirDoPais(pais), `${date}${LOCALE_SUFFIX[locale]}.md`)
  if (!existsSync(path)) return null
  const { data } = matter(readFileSync(path, 'utf-8'))
  if (typeof data.title !== 'string' || !Array.isArray(data.tldr) || !data.tldr.length) return null
  // Rascunho não vira e-mail. O portão vale por idioma, e o inglês é quem manda.
  if (data.status !== 'published') return null
  const issueNumber = typeof data.issueNumber === 'number' ? data.issueNumber : 1
  return { title: data.title, resumo: String(data.tldr[0]), issueNumber }
}

async function main() {
  const date = process.argv[2]
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error('Uso: npx tsx scripts/broadcast-afos-weekly.ts YYYY-MM-DD --pais=us [--dry-run]')
    process.exit(1)
  }

  const dryRun = process.argv.includes('--dry-run')
  if (dryRun) console.log('🔵 DRY-RUN: nenhum e-mail será enviado.\n')

  // 🔴 SEM PADRÃO DE PAÍS. Regra do André em 06/Ago: as duas eleições são
  // independentes, e padrão silencioso é o mecanismo que entrega a peça errada.
  const pais = process.argv.find(a => a.startsWith('--pais='))?.split('=')[1]
  if (!pais) {
    console.error('❌ Falta --pais. Este script não tem país padrão de propósito.')
    process.exit(1)
  }
  if (!PAISES_VALIDOS.includes(pais)) {
    console.error(`❌ País inválido: ${pais}. Válidos: ${PAISES_VALIDOS.join(', ')}`)
    process.exit(1)
  }
  const dir = dirDoPais(pais)
  if (!existsSync(dir)) {
    console.error(`❌ SEM PASTA: ${dir}`)
    process.exit(1)
  }
  console.log(`🌍 país=${pais} · pasta=${dir}\n`)

  const content: Record<Locale, WeeklyContent | null> = {
    en: lerFrontmatter(date, 'en', pais),
    'pt-BR': lerFrontmatter(date, 'pt-BR', pais),
    es: lerFrontmatter(date, 'es', pais),
  }

  // 🔴 O INGLÊS É A ORIGEM: sem ele publicado, não há edição para anunciar.
  if (!content.en) {
    console.error(`❌ Edição em INGLÊS não publicada para ${date}.`)
    console.error(`   Publique antes: npx tsx scripts/publish-afos-weekly.ts ${date} --all-locales`)
    process.exit(1)
  }

  console.log(`📰 AFOS Weekly ${date}:`)
  for (const loc of ['en', 'pt-BR', 'es'] as Locale[]) {
    const c = content[loc]
    console.log(`  ${loc.padEnd(6)} ${c ? `№${c.issueNumber} · "${c.title.slice(0, 70)}..."` : '⚠️  NÃO PUBLICADA, cai para o inglês'}`)
  }
  console.log()

  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
  if (!url) {
    console.error('❌ DATABASE_URL não definida')
    process.exit(1)
  }
  const adapter = new PrismaNeon({ connectionString: url })
  const prisma = new PrismaClient({ adapter })

  // 🔴 `--email=` ENVIA PARA UM SÓ, e existe desde 27/Ago/2026 para evitar um
  // dano concreto: quando alguém se cadastra DEPOIS do disparo da semana, a
  // única forma de alcançá-lo era rodar o script de novo, e ele não tem trava
  // contra reenvio. Isso mandaria a MESMA edição uma segunda vez para toda a
  // base que já tinha recebido. O caso que originou isto: um usuário travado
  // pelo bug de cadastro de 27/Ago entrou depois do envio da №4.
  // ⚠️ O alvo precisa estar ATIVO. Sem isso o script viraria caminho para
  // mandar e-mail a quem se descadastrou.
  const alvo = process.argv.find(a => a.startsWith('--email='))?.split('=')[1]?.trim().toLowerCase()

  const leads = await prisma.lead.findMany({
    where: alvo ? { status: 'active', email: alvo } : { status: 'active' },
    select: { id: true, email: true, preferredLocale: true, locale: true, unsubscribeToken: true },
  })

  if (alvo) {
    console.log(`🎯 ENVIO DIRIGIDO a um único destinatário: ${alvo}`)
    if (leads.length === 0) {
      console.error(`❌ ${alvo} não está na base como ATIVO. Nada enviado.`)
      await prisma.$disconnect()
      process.exit(1)
    }
  }
  console.log(`📋 ${leads.length} assinante(s)${alvo ? ' (dirigido)' : ' ativos'}.\n`)

  if (leads.length === 0) {
    console.log('Nenhum assinante ativo. Encerrado.')
    await prisma.$disconnect()
    return
  }

  // Distribuição por idioma ANTES de enviar. É o número que diz qual versão
  // realmente sai, e no dry-run é ele que se confere.
  const porIdioma: Record<Locale, number> = { 'pt-BR': 0, en: 0, es: 0 }
  for (const lead of leads) {
    const raw = (lead.preferredLocale || lead.locale || 'en').toLowerCase()
    porIdioma[raw.startsWith('pt') ? 'pt-BR' : raw.startsWith('es') ? 'es' : 'en']++
  }
  console.log('🌐 Distribuição por idioma:')
  for (const loc of ['en', 'pt-BR', 'es'] as Locale[]) {
    const temTraducao = !!content[loc]
    console.log(`  ${loc.padEnd(6)} ${String(porIdioma[loc]).padStart(4)} assinante(s)${temTraducao ? '' : '  → receberá o INGLÊS'}`)
  }
  console.log()

  let sent = 0
  let failed = 0
  /** Um item por destinatário do LOTE corrente, gravado e zerado a cada lote. */
  const trilhaDoLote: ResultadoEnvio[] = []
  const META_TRILHA = { produto: 'weekly', edicao: date, pais, issueNumber: content.en?.issueNumber }

  const { batchSize: BATCH_SIZE, batchDelayMs: BATCH_DELAY_MS, interSendMs: INTER_SEND_MS } = pickThrottle(leads.length)
  console.log(`🚦 Throttle: lote=${BATCH_SIZE} entreLotes=${BATCH_DELAY_MS}ms entreEnvios=${INTER_SEND_MS}ms\n`)

  for (let i = 0; i < leads.length; i += BATCH_SIZE) {
    const batch = leads.slice(i, i + BATCH_SIZE)
    console.log(`📤 Lote ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(leads.length / BATCH_SIZE)} (${batch.length})...`)

    const results = await Promise.all(batch.map(async (lead, idx) => {
      if (INTER_SEND_MS > 0 && idx > 0) await sleep(INTER_SEND_MS * idx)
      const raw = (lead.preferredLocale || lead.locale || 'en').toLowerCase()
      const locale: Locale = raw.startsWith('pt') ? 'pt-BR' : raw.startsWith('es') ? 'es' : 'en'

      // ⚠️ Cascata INVERTIDA: falta de tradução cai para o INGLÊS, nunca para o
      // português. `content.en` é garantido por causa do portão lá em cima.
      const c = content[locale] ?? content.en!
      const servido: Locale = content[locale] ? locale : 'en'

      if (dryRun) {
        console.log(`  [DRY] ${lead.email.slice(0, 3)}*** → ${locale}${servido !== locale ? ` (servido em ${servido})` : ''}`)
        return { ok: true }
      }

      const r = await sendWeeklyTeaser(
        lead.email,
        { date, locale: servido, title: c.title, resumo: c.resumo, issueNumber: c.issueNumber, pais },
        lead.unsubscribeToken || undefined,
      )
      // `servido` e não `locale`: a trilha registra o que a pessoa RECEBEU,
      // não o que ela preferia. A cascata invertida faz os dois divergirem.
      trilhaDoLote.push({ leadId: lead.id, locale: servido, ok: r.ok, messageId: r.id, erro: r.erro })
      return { ok: r.ok }
    }))

    sent += results.filter(r => r.ok).length
    failed += results.filter(r => !r.ok).length

    // A TRILHA SAI POR LOTE, nao no fim. Ate 19/Ago/2026 era gravada uma vez so,
    // depois do laco inteiro: crash ou 429 no meio deixava ZERO linha, e a lista
    // de quem ja recebeu se perdia. `createMany` e apendice, entao gravar em
    // pedacos equivale a gravar no fim, com a diferenca de sobreviver a queda.
    if (!dryRun && trilhaDoLote.length > 0) {
      await registrarBroadcast(prisma, META_TRILHA, trilhaDoLote)
      trilhaDoLote.length = 0
    }

    if (i + BATCH_SIZE < leads.length) await sleep(BATCH_DELAY_MS)
  }

  console.log(`\n✅ Broadcast ${dryRun ? 'SIMULADO' : 'concluído'}: ${sent} enviados / ${failed} falharam, de ${leads.length} ativos.`)

  if (!dryRun) {
    if (trilhaDoLote.length > 0) await registrarBroadcast(prisma, META_TRILHA, trilhaDoLote)
  } else {
    console.log('🧾 trilha: dry-run não grava evento, por desenho.')
  }

  await prisma.$disconnect()
}

main().catch((err) => {
  console.error('❌ Broadcast falhou:', err)
  process.exit(1)
})
