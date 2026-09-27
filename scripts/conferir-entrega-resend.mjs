#!/usr/bin/env node
/**
 * CONFERIR ENTREGA NO RESEND, id a id.
 *
 * 🔑 POR QUE EXISTE: `check-broadcast-audit` prova que o Resend ACEITOU o envio,
 *    porque grava o `messageId` devolvido por ele. Aceite não é entrega. E o
 *    webhook, medido em 17/Set/2026, **não escreve auditoria para entrega**: a
 *    rota só grava em `audit_logs` para devolução e reclamação, então zero ali é
 *    o esperado e não é sintoma. O `conferir-webhook-resend.mjs` mostra que a
 *    rota está recebendo, mas por CONTAGEM de chave de dedup em 24h, que é
 *    volume e não destinatário.
 *
 * ⭐ A única prova por destinatário é perguntar ao Resend o `last_event` de cada
 *    `messageId`. Isso foi feito À MÃO na Weekly dos EUA de 17/Set, com 21 de 21
 *    `delivered`, e à mão de novo depois. Duas vezes à mão é atalho que faltava.
 *
 * Uso:
 *   node scripts/conferir-entrega-resend.mjs 2026-09-18
 *   node scripts/conferir-entrega-resend.mjs 2026-09-18 --produto=daily
 *   node scripts/conferir-entrega-resend.mjs 2026-09-28 --produto=tradeoff --pais=us
 *
 * 🔴 O `--pais` NASCEU EM 27/Set/2026, e a falta dele misturava as duas eleições.
 *    Brasil e EUA publicam Tradeoff na MESMA data e disparam no MESMO dia, então
 *    o filtro por `edicao` + `produto` juntava os dois: conferir a edição
 *    americana de 28/Set devolvia **42 de 42 entregues**, que são 21 dos EUA mais
 *    21 do Brasil. O `--pais=us` era aceito e ignorado em silêncio, porque este
 *    script nunca leu esse argumento, e o veredito saía com cara de específico.
 *    Numa casa cuja primeira regra é que país não se mistura, o conferidor de
 *    entrega misturava.
 *
 * ⛔ E o conserto NÃO é exigir `--pais`. Sem ele o padrão segue sendo todos os
 *    países, porque conferir a lista inteira de um dia é uso legítimo. O que
 *    mudou é que **o veredito agora sempre diz de que países é a amostra**: é a
 *    quebra por país no cabeçalho que torna impossível ler "42 de 42" como se
 *    fosse de um país só. Filtro errado some; contagem declarada não.
 *
 * Saída: 0 todos entregues · 1 algum não entregue · 4 não leu
 */

import { readFileSync } from 'node:fs'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
// A regra de "de quem é a amostra" mora numa peça só, com teste e mutações:
// `node scripts/testar-amostra-de-entrega.mjs`. Segunda cópia aqui é o defeito
// que a casa passa a vida evitando.
import { filtrarLote, filtrarPais, quebraEmTexto } from './lib/amostra-de-entrega.mjs'

const argv = process.argv.slice(2)
const edicao = argv.find((a) => !a.startsWith('--'))
const produto = argv.find((a) => a.startsWith('--produto='))?.slice(10)
const pais = argv.find((a) => a.startsWith('--pais='))?.slice(7)

if (!edicao) {
  console.error('Uso: node scripts/conferir-entrega-resend.mjs AAAA-MM-DD [--produto=daily|weekly|tradeoff] [--pais=br|us]')
  process.exit(2)
}
if (pais !== undefined && !pais) {
  console.error('⚠️ --pais= vazio. Ou se passa um país, ou se omite o argumento: o vazio não é "todos".')
  process.exit(2)
}

function doEnv(chave) {
  if (process.env[chave]) return process.env[chave]
  try {
    const m = readFileSync('.env.local', 'utf8').match(new RegExp(`^${chave}=(.*)$`, 'm'))
    return m ? m[1].trim().replace(/^["']|["']$/g, '').replace(/\r$/, '') : null
  } catch {
    return null
  }
}

const apiKey = doEnv('RESEND_API_KEY')
const dbUrl = doEnv('DATABASE_URL') ?? doEnv('POSTGRES_URL')
if (!apiKey || !dbUrl) {
  console.error(`\n⚠️ NÃO LEU: ${!apiKey ? 'RESEND_API_KEY' : 'DATABASE_URL'} ausente. A medição não aconteceu.`)
  process.exit(4)
}

const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: dbUrl }) })

let eventos
try {
  eventos = await prisma.contactEvent.findMany({
    where: { eventType: { startsWith: 'broadcast_' } },
    select: { eventPayload: true, lead: { select: { email: true } } },
    orderBy: { createdAt: 'desc' },
    take: 5000,
  })
} catch (e) {
  console.error(`\n⚠️ NÃO LEU o banco: ${e.message}`)
  process.exit(4)
} finally {
  await prisma.$disconnect()
}

// A edição e o produto delimitam o LOTE; o país delimita a ELEIÇÃO, e são coisas
// diferentes porque o mesmo lote de data e produto tem os dois países dentro.
const doLote = filtrarLote(eventos, edicao, produto)
const alvo = filtrarPais(doLote, pais)

const comId = alvo.filter((e) => e.eventPayload?.messageId)
console.log(`\n📬 ENTREGA NO RESEND · edição ${edicao}${produto ? ` · ${produto}` : ''}${pais ? ` · país ${pais}` : ''}`)
console.log(`   ${alvo.length} evento(s) de broadcast, ${comId.length} com messageId`)
console.log(`   país na amostra: ${quebraEmTexto(alvo)}`)

if (pais) {
  // ⛔ Anti-silêncio do próprio filtro: o que ele TIROU tem de aparecer, senão
  //    `--pais=xx` escrito errado devolve "0 de 0" com cara de lote inexistente.
  const fora = doLote.filter((e) => (e.eventPayload ?? {}).pais !== pais)
  if (fora.length > 0) console.log(`   ⏭️  fora do filtro de país: ${quebraEmTexto(fora)}`)
  if (alvo.length === 0 && doLote.length > 0) {
    console.error(
      `\n⚠️ NÃO LEU: o lote ${edicao} existe com ${doLote.length} evento(s), e NENHUM é do país "${pais}". ` +
        `Ou o país está errado, ou esse broadcast não gravou país. A medição não aconteceu.`,
    )
    process.exit(4)
  }
}

if (comId.length === 0) {
  console.error('\n⚠️ nenhum messageId: sem ele não dá para perguntar ao Resend. A medição não aconteceu.')
  process.exit(4)
}
if (comId.length < alvo.length) {
  console.log(`   ⚠️ ${alvo.length - comId.length} sem messageId ficam FORA da conta, e isso não é entrega provada.`)
}

const contagem = new Map()
const naoEntregues = []
let erros = 0

for (const e of comId) {
  const id = e.eventPayload.messageId
  try {
    const r = await fetch(`https://api.resend.com/emails/${id}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(20000),
    })
    if (!r.ok) {
      erros++
      naoEntregues.push({ email: e.lead?.email, id, estado: `HTTP ${r.status}` })
      continue
    }
    const j = await r.json()
    // 🔑 `last_event` é o estado MAIS RECENTE conhecido pelo Resend, então
    //    "sent" quer dizer aceito e ainda sem confirmação de entrega, e não
    //    entregue. Tratar os dois como sucesso esconderia justamente o caso
    //    que esta conferência existe para achar.
    const estado = j.last_event ?? 'sem last_event'
    contagem.set(estado, (contagem.get(estado) ?? 0) + 1)
    if (estado !== 'delivered') naoEntregues.push({ email: e.lead?.email, id, estado })
  } catch (err) {
    erros++
    naoEntregues.push({ email: e.lead?.email, id, estado: `erro: ${err.message}` })
  }
}

console.log('\n   estado por last_event do Resend:')
for (const [k, v] of [...contagem.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`      ${k === 'delivered' ? '✅' : '🟡'} ${String(v).padStart(3)}  ${k}`)
}

const entregues = contagem.get('delivered') ?? 0
if (naoEntregues.length > 0) {
  console.log(`\n   🟡 ${naoEntregues.length} sem confirmação de entrega:`)
  for (const n of naoEntregues.slice(0, 15)) {
    const mail = n.email ? `${n.email.slice(0, 3)}***` : '(sem lead)'
    console.log(`      ${mail}  ${n.estado}  ${n.id}`)
  }
}

// 🔑 O país entra no VEREDITO, não só no cabeçalho: quem copia esta linha para um
//    relatório copia a última, e foi ela que em 27/Set disse "42 de 42" sobre uma
//    amostra de dois países.
const deQuem = pais ? ` · país ${pais}` : ` · ${quebraEmTexto(comId, ' e ')}`
console.log(
  entregues === comId.length
    ? `\n✅ VEREDITO: ${entregues} de ${comId.length} ENTREGUES${deQuem}, confirmado id a id no Resend.`
    : `\n🟡 VEREDITO: ${entregues} de ${comId.length} entregues${deQuem}. O resto não está provado como entregue.`,
)
if (erros > 0) console.log(`   ⚠️ ${erros} consulta(s) falharam: esses não são "não entregues", são não medidos.`)

process.exit(entregues === comId.length ? 0 : 1)
