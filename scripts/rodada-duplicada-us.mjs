/**
 * 🧬 A MESMA RODADA SOB DOIS NOMES DE CASA, no generic ballot dos EUA.
 *
 * A regra mora em `lib/us-polls/duplicata-de-rodada.mjs`, com casos plantados em
 * `scripts/testar-duplicata-us.mjs`. Aqui é só leitura e impressão.
 *
 * ⛔ NÃO remove linha, NÃO muda a média e NÃO decide qual nome fica: isso é
 * mudar a PROCEDÊNCIA e segue decisão do André, par a par.
 *
 * Saída 1 quando existe par NÃO CONFERIDO dentro da janela da média, porque aí
 * o número publicado conta uma casa duas vezes. Par já conferido sai do
 * contador e continua impresso.
 *
 * Uso: node scripts/rodada-duplicada-us.mjs [--arquivo=public/us-polls-data.json]
 */
import { readFileSync } from 'fs'
import { duplicatas, conferirCarga, DUPLICATA_CONFERIDA } from '../lib/us-polls/duplicata-de-rodada.mjs'
import { media } from '../lib/us-polls/collect.mjs'

const arg = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3)
const ARQ = arg('arquivo') ?? 'public/us-polls-data.json'
const DIAS = Number(arg('dias') ?? 30)

const erros = conferirCarga()
if (erros.length) {
  console.error('❌ registro de duplicatas conferidas INVÁLIDO, nada foi medido:')
  erros.forEach((e) => console.error('   ' + e))
  process.exit(2)
}

let a
try {
  a = JSON.parse(readFileSync(ARQ, 'utf8'))
} catch (e) {
  console.error(`❌ não li ${ARQ}: ${e.message}`)
  process.exit(2)
}

console.log(`\n🧬 MESMA RODADA SOB DOIS NOMES  [USO INTERNO, nao publicar]`)
console.log(`   arquivo ${ARQ} · ${a.polls?.length ?? 0} linhas · janela de ${DIAS} dias\n`)

const grupos = duplicatas(a.polls)
const naMedia = new Set((a.mediaAfos?.incluidas ?? []).map((x) => `${x.instituto}|${x.campoFim}|${x.amostraTipo ?? ''}`))
const dentro = (l) => naMedia.has(`${l.instituto}|${l.campoFim}|${l.amostraTipo ?? ''}`)

if (!grupos.length) {
  console.log('   ✅ nenhuma assinatura de rodada aparece sob mais de um nome de casa.\n')
  process.exit(0)
}

let porConferir = 0
for (const g of grupos) {
  const nsDentro = g.linhas.filter(dentro)
  const marca = g.conferida ? '📒 CONFERIDA' : g.classe === 'IDENTICA' ? '🔴 IDENTICA' : '⚠️  DIVERGE'
  const [ini, fim, amo, rec] = g.assinatura.split('|')
  console.log(`   ${marca}  campo ${ini} a ${fim} · ${amo || 'sem amostra'} ${rec}`)
  for (const l of g.linhas) {
    const sinal = l.vantagemDem >= 0 ? 'D+' : 'R+'
    console.log(`       ${(sinal + Math.abs(l.vantagemDem).toFixed(2)).padStart(8)}  ${dentro(l) ? 'NA MEDIA' : '  fora  '}  ${l.instituto}`)
  }
  if (nsDentro.length > 1 && !g.conferida) {
    porConferir++
    console.log(`       🔴 a casa entra ${nsDentro.length}x na media de hoje`)
    console.log(`          decidir qual nome fica e registrar em lib/us-polls/duplicata-de-rodada.mjs`)
  } else if (nsDentro.length > 1) {
    console.log(`       📒 entra ${nsDentro.length}x na media, e isso ja foi conferido e declarado`)
  }
  console.log('')
}

// 📊 O PREÇO. Só as IDENTICAS entram na conta: par que DIVERGE pode ser segunda
// via declarada, e tirá-la aqui seria decidir o que este script não decide.
const vistos = new Set()
const semIdenticas = (a.polls ?? []).filter((p) => {
  const g = grupos.find((x) => x.classe === 'IDENTICA' && x.linhas.includes(p))
  if (!g) return true
  if (vistos.has(g.assinatura + '|' + p.instituto)) return true
  if (vistos.has(g.assinatura)) return false
  vistos.add(g.assinatura)
  return true
})
const agora = new Date()
const com = media(a.polls, DIAS, agora)
const sem = media(semIdenticas, DIAS, agora)
console.log(`   📊 o que isso custa no número publicado`)
console.log(`      como está          D+${com.vantagemDem.toFixed(2)} · ${com.nPesquisas} rodadas · ${com.nInstitutos} institutos`)
console.log(`      sem as IDENTICAS   D+${sem.vantagemDem.toFixed(2)} · ${sem.nPesquisas} rodadas · ${sem.nInstitutos} institutos   (${(sem.vantagemDem - com.vantagemDem >= 0 ? '+' : '') + (sem.vantagemDem - com.vantagemDem).toFixed(2)}pp)`)
console.log('')
console.log(`   ⛔ NADA foi removido. Qual nome fica é PROCEDENCIA, e segue decisao do Andre.`)
console.log(`   📌 IDENTICA e mesma rodada sob dois nomes, tipicamente quem EXECUTA e quem`)
console.log(`      ENCOMENDA. DIVERGE e mesma onda com valores diferentes, que pode ser`)
console.log(`      segunda via declarada e precisa de olho humano.\n`)

console.log(porConferir ? `🔴 ${porConferir} par(es) NAO conferido(s) dentro da media` : '✅ nenhum par por conferir dentro da media')
process.exit(porConferir ? 1 : 0)
