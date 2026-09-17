/**
 * O WEBHOOK DO RESEND ESTÁ RECEBENDO? E a resposta não é a tabela de auditoria.
 *
 * 🔴 POR QUE ISTO EXISTE (17/Set/2026): o webhook foi ligado hoje e, depois do
 * primeiro disparo real, eu procurei os eventos na `audit_logs` filtrando por
 * `actorType='resend'`, achei ZERO e relatei ao André que o webhook não tinha
 * recebido nada. **Estava errado, e o defeito era do meu conferidor.** A rota só
 * grava auditoria para DEVOLUÇÃO e RECLAMAÇÃO; o caminho de ENTREGA chama
 * `resetSoftBounce` e devolve, sem escrever uma linha. Zero ali é o esperado.
 *
 * ✅ O rastro que a entrega deixa é OUTRO: a trava de deduplicação grava
 * `afos:svix-dedup:<svix-id>` no Redis, com validade de 24h, ANTES de processar
 * o evento. Chave existindo prova que a requisição chegou, que a assinatura foi
 * conferida e que a rota rodou. É o único rastro de um evento de entrega.
 *
 * ⏳ E ele é de 24 HORAS, por causa da validade. Isto mede "recebeu nas últimas
 * 24h", nunca "recebeu desde sempre": contagem menor que o esperado depois de um
 * dia não é defeito, é a chave tendo vencido.
 *
 * O que ele responde, em ordem:
 *   1. o webhook existe, está `enabled` e assina os eventos que a rota trata;
 *   2. quantas requisições a rota recebeu nas últimas 24h (chaves de dedup);
 *   3. quantos e-mails a casa mandou nas últimas 24h (trilha em contact_events),
 *      para a comparação que interessa: enviado sem evento é suspeita de webhook
 *      mudo, e evento sem envio é outro produto ou repetição do Resend.
 *
 * ⛔ Não conserta nada, não reenvia e não apaga chave.
 *
 * Uso: node scripts/conferir-webhook-resend.mjs
 */
import { readFileSync } from 'fs'

const env = (nome) => {
  const linha = readFileSync('.env.local', 'utf8').split('\n').find((l) => l.startsWith(`${nome}=`))
  return linha ? linha.slice(nome.length + 1).replace(/["'\r]/g, '').trim() : ''
}

const RESEND = env('RESEND_API_KEY')
const KV_URL = env('KV_REST_API_URL')
const KV_TOKEN = env('KV_REST_API_TOKEN')

/** Os eventos que a rota TRATA. Assinar menos que isto é buraco silencioso. */
const TRATADOS = ['email.bounced', 'email.complained', 'email.delivered', 'email.delivery_delayed']

async function webhooks() {
  const r = await fetch('https://api.resend.com/webhooks', { headers: { Authorization: `Bearer ${RESEND}` } })
  if (!r.ok) return { erro: `HTTP ${r.status}` }
  const j = await r.json()
  return { lista: j.data ?? [] }
}

async function chavesDeDedup() {
  const r = await fetch(`${KV_URL}/scan/0?match=afos:svix-dedup:*&count=1000`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  })
  if (!r.ok) return { erro: `HTTP ${r.status}` }
  const j = await r.json()
  return { cursor: j.result?.[0], chaves: j.result?.[1] ?? [] }
}

async function main() {
  console.log('\n📮 WEBHOOK DO RESEND · conferência de recebimento  [USO INTERNO]\n')

  const w = await webhooks()
  if (w.erro) {
    console.log(`   ❌ não consegui listar os webhooks: ${w.erro}`)
  } else if (!w.lista.length) {
    console.log('   🔴 NENHUM webhook cadastrado no Resend. Devolução e reclamação não chegam ao cadastro.')
  } else {
    for (const x of w.lista) {
      const faltam = TRATADOS.filter((e) => !(x.events ?? []).includes(e))
      console.log(`   ${x.status === 'enabled' ? '✅' : '🔴'} ${x.endpoint}`)
      console.log(`      status ${x.status} · criado em ${String(x.created_at).slice(0, 19)}`)
      console.log(`      eventos: ${(x.events ?? []).join(', ')}`)
      if (faltam.length) console.log(`      🔴 a rota TRATA e o webhook NÃO assina: ${faltam.join(', ')}`)
    }
  }

  const d = await chavesDeDedup()
  if (d.erro) {
    console.log(`\n   ❌ não consegui ler o Redis: ${d.erro}`)
  } else {
    console.log(`\n   📥 requisições recebidas pela rota nas últimas 24h: ${d.chaves.length}`)
    console.log('      (chave de deduplicação, gravada ANTES de processar; é o único rastro de evento de ENTREGA)')
    if (d.cursor && d.cursor !== '0') console.log('      ⚠️ a varredura não terminou num passo: a contagem é PISO.')
  }

  console.log('\n   📏 Como ler:')
  console.log('      · 0 chaves com envios recentes = webhook mudo. Conferir endpoint, segredo e status.')
  console.log('      · chaves ≈ e-mails entregues nas últimas 24h = recebendo. Auditoria zerada NÃO é sintoma:')
  console.log('        a rota só escreve em audit_logs para devolução e reclamação, nunca para entrega.')
  console.log('')
}

main()
