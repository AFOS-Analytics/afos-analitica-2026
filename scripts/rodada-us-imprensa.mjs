#!/usr/bin/env node
/**
 * RODADA DA IMPRENSA DOS EUA — atalho de ORQUESTRAÇÃO da ETAPA 3 do /atualizar-usa.
 *
 * ⛔ Este arquivo NÃO tem regra própria e não pode ganhar nenhuma. Ele chama a
 *    rota do cron, que é quem coleta, e o `snapshot-us-press.ts`, que é quem
 *    arquiva. Toda régua vive lá. Se uma conta aparecer aqui, ela vira a segunda
 *    cópia de uma regra que já existe, que foi o defeito que custou os rótulos de
 *    faixa do mercado em 29/Jul/2026.
 *
 * 🔴 POR QUE EXISTE, medido em 10/Set/2026. As duas etapas eram redigitadas a
 *    cada passada: a chamada com o segredo lido do `.env.local`, com o
 *    `tr -d '\r'` que existe porque o CR do Windows derruba a autenticação com um
 *    401 que se confunde com segredo errado, e depois o snapshot em dois passos,
 *    ensaio e `--apply`. Comando redigitado é chance nova de esquecer um pedaço,
 *    e foi assim que o `conferir-us-polls` passou um mês sem ser rodado.
 *
 * ⚠️ ELE ESCREVE EM PRODUÇÃO. A rota do cron grava no Neon sob a chave `us-press`.
 *    É por isso que o `rodada-us.mjs` não a chama, e é por isso que este script é
 *    separado: quem roda tem de saber que está escrevendo lá fora.
 *
 * ⛔ Não commita e não faz deploy. Isso é decisão de quem lê.
 *
 * Uso:
 *   node scripts/rodada-us-imprensa.mjs             coleta e arquiva (grava em disco)
 *   node scripts/rodada-us-imprensa.mjs --ensaio    coleta e mostra o que arquivaria
 *   node scripts/rodada-us-imprensa.mjs --sem-cron  não chama produção, só arquiva
 */

import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const argv = process.argv.slice(2)
const ensaio = argv.includes('--ensaio')
const semCron = argv.includes('--sem-cron')
const regua = '─'.repeat(72)

/**
 * O segredo vive no `.env.local`, que NÃO é carregado no ambiente. O `\r` do fim
 * de linha do Windows entra no cabeçalho e derruba a autenticação com 401.
 */
function segredo() {
  const linha = readFileSync('.env.local', 'utf8')
    .split(/\r?\n/)
    .find((l) => l.startsWith('CRON_SECRET='))
  if (!linha) return null
  return linha.slice('CRON_SECRET='.length).replace(/^["']|["']$/g, '').replace(/\r/g, '').trim()
}

console.log('')
console.log(`📰 RODADA DA IMPRENSA DOS EUA · ${new Date().toISOString()}`)
console.log('   orquestração apenas: nenhuma conta é feita aqui')

let coleta = null

if (semCron) {
  console.log('')
  console.log(regua)
  console.log('⏭️  1/2 · COLETA pulada por --sem-cron (nada foi escrito em produção)')
} else {
  console.log('')
  console.log(regua)
  console.log('▶️  1/2 · COLETA — chama o cron em PRODUÇÃO, grava no Neon em `us-press`')
  console.log(regua)

  const s = segredo()
  if (!s) {
    console.log('❌ CRON_SECRET não encontrado no .env.local: sem ele a rota devolve 401.')
    process.exit(1)
  }

  const res = await fetch('https://www.afos-analytics.com/api/cron/refresh-us-press', {
    headers: { Authorization: `Bearer ${s}` },
  })
  const texto = await res.text()
  let j = null
  try { j = JSON.parse(texto) } catch { /* resposta não-JSON é tratada abaixo */ }

  if (!j) {
    console.log(`❌ HTTP ${res.status}, resposta não-JSON: ${texto.slice(0, 300)}`)
    process.exit(1)
  }

  /**
   * ⚠️ 401 e 502 querem coisas OPOSTAS, e confundir os dois faz perder uma rodada:
   * o 401 é o segredo não ter chegado, e repetir com a chamada certa é o certo; o
   * 502 com `motivo` é o portão da rota funcionando, e ali nada foi sobrescrito.
   */
  if (res.status === 401) {
    console.log('❌ 401: o segredo não chegou. Não é a rota, é a chamada. Conferir o .env.local.')
    process.exit(1)
  }
  if (!j.ok) {
    console.log(`⚠️ HTTP ${res.status} · motivo: ${j.motivo ?? '(sem motivo declarado)'}`)
    console.log('   Se veio motivo, o portão funcionou e NADA foi sobrescrito: olhar a origem, não repetir.')
    process.exit(1)
  }

  coleta = j.qualidade ?? {}
  console.log(`✅ ok · lastUpdate ${j.lastUpdate}`)
  console.log(`   lidos ${coleta.lidos} · na lista ${coleta.naLista} · publicados ${coleta.publicados} de ${coleta.veiculosRepresentados} veículos`)
  console.log(`   procedência: ${coleta.publicadosComLinkCanonico} de link canônico · ${coleta.publicadosViaGoogleNews} via Google News`)
  console.log(`   feeds próprios: ${coleta.feedsProprios} · entregaram ${coleta.lidosEmFeedProprio} antes do filtro`)
  const falhas = coleta.consultasComFalha ?? []
  console.log(`   consultas com falha: ${falhas.length}${falhas.length ? ' → ' + falhas.join(', ') : ''}`)

  /**
   * 📌 A régua do comando: canônico em ZERO é ALARME, não resultado. Quer dizer
   * que os feeds próprios não entregaram nada e tudo veio do agregador, e a causa
   * costuma ser feed que mudou de endereço, não semana sem notícia.
   */
  if (coleta.publicadosComLinkCanonico === 0 && coleta.publicados > 0) {
    console.log('   🔴 ZERO canônico: os feeds próprios não entregaram nada. Isso é alarme, não resultado.')
  }
}

console.log('')
console.log(regua)
console.log(`▶️  2/2 · ARQUIVO — ${ensaio ? 'ENSAIO, nada é gravado' : 'grava public/us-press-archive/{data}.json e o piso de leitura'}`)
console.log(regua)

/**
 * O contrato do arquivo é do `snapshot-us-press.ts`: a data CORRENTE pode ser
 * regerada, porque o cron roda 3x ao dia, e data ENCERRADA nunca é reescrita.
 * Erro em data passada se corrige por errata.
 */
/**
 * ⚠️ O comando vai como UMA STRING, e não como executável mais array.
 *
 * Com `shell: true` e array de argumentos o Node dispara o aviso DEP0190, que
 * existe porque os argumentos não são escapados, só concatenados. E sem shell o
 * Node se recusa a executar um `.cmd` no Windows desde a correção de 2024, que é
 * o que o `npx` é aqui: a segunda tentativa deste script morreu em silêncio, com
 * a saída do snapshot inteira sumida. Os argumentos são fixos e escritos nesta
 * linha, então não há entrada de fora a escapar.
 */
const cmd = 'npx tsx scripts/snapshot-us-press.ts' + (ensaio ? '' : ' --apply')
const r = spawnSync(cmd, { stdio: 'inherit', shell: true })
if (r.error) console.log('❌ o arquivamento nem chegou a rodar: ' + r.error.message)

console.log('')
console.log(regua)
console.log('📋 FIM DA RODADA DA IMPRENSA')
console.log('   ⛔ Nada foi commitado nem publicado. O arquivo novo entra no commit da ETAPA 6.')
console.log('')

process.exitCode = r.status ?? 0
