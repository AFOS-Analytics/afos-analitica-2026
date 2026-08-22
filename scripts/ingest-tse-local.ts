/**
 * Ingestão das pesquisas do TSE rodando NA MÁQUINA, e não na nuvem.
 *
 * 🔴 POR QUE ELE EXISTE (22/Ago/2026): o TSE pôs proteção anti-robô em toda a
 * propriedade e devolve 403 para qualquer cliente vindo de faixa de DATACENTER.
 * O cron `/api/cron/refresh-polls` roda na Vercel e o espelho roda no GitHub
 * Actions, então os dois apanham. Medido: último sucesso em 18/Ago 18:02 UTC,
 * 403 constante desde 19/Ago 00:50 UTC.
 *
 * ⭐ E o corte NÃO é entre humano e robô, como se registrou primeiro. Do IP de
 * uma casa o cliente do Node PASSA e baixa o ZIP inteiro; o `curl` apanha de
 * qualquer lugar. O que decide é a origem de rede somada à assinatura do
 * cliente. Por isso este script existe: mesma lógica, outra origem.
 *
 * ⛔ NÃO forja user-agent, e isso não se negocia. Ele usa o `fetch` do Node como
 * está, que é o mesmo cliente do cron. A única diferença é de onde a chamada sai.
 *
 * 📧 NÃO dispara o alerta de pesquisa nacional nova, de propósito. A rota do
 * cron dispara a cada rodada, com uma pesquisa ou duas; aqui há dias represados,
 * e mandar tudo de uma vez seria enxurrada na caixa do assinante. Quem decide
 * isso é o André, não este script.
 *
 * Rodar:  npx tsx scripts/ingest-tse-local.ts [--ensaio]
 *   --ensaio  baixa e conta, sem escrever nada no banco
 */
import { config } from 'dotenv'
config({ path: '.env.local' })

import { fetchTSEPolls } from '../lib/tse/ingest'
import { acharCpf } from './lib/cpf.mjs'

// ⚠️ `lib/tse/persist` puxa `lib/db`, que cria o cliente do Prisma NO MOMENTO DO
// IMPORT. Import estático é içado para antes de qualquer linha deste arquivo,
// inclusive do `config()` do dotenv, e o cliente nascia sem `DATABASE_URL`:
// "banco indisponível", e o `persistPolls` devolveria 0 inserções SEM ERRO.
// Carga tardia, depois do env montado. Pego no ensaio, que é para isso que ele
// serve.
const carregarPersist = () => import('../lib/tse/persist')

const ENSAIO = process.argv.includes('--ensaio')

async function main() {
  console.log(ENSAIO ? '🧪 ENSAIO: nada será escrito no banco' : '💾 ingestão real')
  console.log('⬇️  baixando do TSE…')
  const polls = await fetchTSEPolls(2026)
  console.log(`   TSE devolveu ${polls.length} pesquisas presidenciais`)

  // 🆔 Conferência de CPF ANTES de gravar. A redação vive no persist, na origem;
  // esta contagem existe para o número aparecer no relatório em vez de ficar
  // implícito. Trava que age calada não deixa ninguém saber que agiu.
  let comCpf = 0
  for (const p of polls) {
    const alvo = `${p.metodologia ?? ''}\n${p.planoAmostral ?? ''}\n${p.controlSystem ?? ''}\n${p.estatistico ?? ''}`
    if (acharCpf(alvo).length) comCpf++
  }
  console.log(`   com CPF no texto livre da origem: ${comCpf} (serão redigidos pelo persist)`)

  if (ENSAIO) {
    const protos = polls.slice(0, 3).map((p) => p.protocolo).join(', ')
    console.log(`   amostra de protocolos: ${protos}`)
    console.log('🧪 ensaio encerrado, nada gravado.')
    return
  }

  console.log('💾 gravando (idempotente por protocolo)…')
  const { persistPolls } = await carregarPersist()
  const { inserted, skipped } = await persistPolls(polls, 'tse_manual_local')
  console.log(`✅ inseridas ${inserted} | já existentes ${skipped} | total lido ${polls.length}`)
  if (inserted === 0 && skipped === 0) {
    // 🔴 Falha FECHADA: `persistPolls` devolve 0/0 quando o cliente do Prisma é
    // nulo, e isso é indistinguível de "não havia nada novo" no relatório.
    console.error('::error::0 inseridas E 0 existentes com ' + polls.length + ' lidas: o banco não respondeu. NÃO tratar como rodada sem novidade.')
    process.exit(1)
  }
}

main().catch((e) => {
  console.error('❌ falhou:', e?.message ?? e)
  process.exit(1)
})
