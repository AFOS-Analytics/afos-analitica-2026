#!/usr/bin/env node
/**
 * RODADA DE PESQUISAS DO BRASIL — atalho de ORQUESTRAÇÃO.
 *
 * ⛔ Sem regra própria, igual a scripts/rodada-us-polls.mjs e scripts/rodada-us.mjs.
 *    Só chama, na ordem certa, o que já existe e já é testado.
 *
 * A ordem, e ela tem duas dependências reais:
 *   1. ingestão (--rede)   ENSAIO por padrão, grava só com --apply
 *   2. relatório           lê a API e o Neon, então tem de rodar DEPOIS de gravar
 *   3. conferidor de escopo  o portão de RÓTULO, que nenhum portão de valor pega
 *
 * 🔑 Por isso o ensaio NÃO segue para os passos 2 e 3: o relatório leria o banco
 *    sem as linhas que o ensaio mostrou, e entregaria um retrato que não é nem o
 *    de antes nem o de depois.
 *
 * 🏷️ E o passo 3 existe encadeado por um motivo medido: em 07/Set/2026 o
 *    conferidor de escopo estava escrito, testado e NUNCA era chamado por quem
 *    publica. Régua citada em prosa é régua que alguém pula.
 *
 * ⛔ Não roda /atualizar-brz, não publica e não commita.
 *
 * Uso:
 *   node scripts/rodada-tse-brz.mjs            # ensaio, não grava nada
 *   node scripts/rodada-tse-brz.mjs --apply    # grava, relata e confere o rótulo
 *   node scripts/rodada-tse-brz.mjs --apply --dias=30
 */

import { spawnSync } from 'node:child_process'

const argv = process.argv.slice(2)
const aplicar = argv.includes('--apply')
const dias = (argv.find((a) => a.startsWith('--dias=')) ?? '--dias=30').slice(7)

/**
 * O Node 25 recusa spawnar `.cmd` sem shell, e com `shell: true` ele avisa que
 * os argumentos são concatenados e não escapados. A saída é não passar por `npx`:
 * um `.ts` roda pelo cli do tsx que já está em node_modules, e um `.mjs` roda
 * direto. Nos dois casos o executável é o próprio node, sem shell nenhum.
 */
function argumentosDeNode(script, args) {
  const TSX = 'node_modules/tsx/dist/cli.mjs'
  return script.endsWith('.ts') ? [TSX, script, ...args] : [script, ...args]
}

const regua = '─'.repeat(72)
const resultados = []

console.log('')
console.log(`🇧🇷 RODADA DE PESQUISAS DO TSE · ${new Date().toISOString()}`)
console.log('   orquestração apenas: nenhuma conta é feita aqui')
if (!aplicar) console.log('   🔵 ENSAIO: nada será gravado, e os passos 2 e 3 não rodam')

rodar(
  'ingestao',
  `1/3 · INGESTÃO do registro do TSE${aplicar ? ' (GRAVA no Neon)' : ' (ensaio)'}`,
  'scripts/ingest-tse-local.ts',
  ['--rede', ...(aplicar ? ['--apply'] : [])]
)

if (!aplicar) {
  console.log('')
  console.log(regua)
  console.log('⏭️  2/3 e 3/3 · RELATÓRIO e CONFERIDOR DE ESCOPO')
  console.log('   NÃO RODAM no ensaio, de propósito.')
  console.log('')
  console.log('   O relatório lê a API e o Neon. Rodá-lo agora mostraria o banco SEM')
  console.log('   as linhas que o ensaio acabou de listar, ou seja, um retrato que não')
  console.log('   é o de antes nem o de depois. Ler a lista acima e repetir com --apply.')
  resultados.push({ id: 'relatorio', codigo: null, estado: 'PULADO (ensaio)' })
  resultados.push({ id: 'escopo', codigo: null, estado: 'PULADO (ensaio)' })
  imprimirResumo()
  process.exit(0)
}

rodar('relatorio', '2/3 · RELATÓRIO, calendário e mercado do Brasil', 'scripts/relatorio-pesquisas-brz.ts', [])

const escopo = rodar(
  'escopo',
  '3/3 · CONFERIDOR DE ESCOPO — o portão de RÓTULO',
  'scripts/conferir-escopo-derivado.mjs',
  [`--dias=${dias}`]
)

if (escopo !== 0) {
  console.log('')
  console.log(regua)
  console.log('🏷️  ATENÇÃO: o conferidor de ESCOPO reprovou com GRAVE no calendário vivo.')
  console.log('')
  console.log('   Isto NÃO desfaz a ingestão e não é defeito de valor: o número está certo')
  console.log('   e quem não se sustenta é o RÓTULO de nacional. Nenhum portão de valor')
  console.log('   pega isso, e é por isso que ele roda aqui.')
  console.log('')
  console.log('   Antes de publicar qualquer um desses registros como NACIONAL, conferir')
  console.log('   o escopo na divulgação. Rótulo frágil já vencido é dívida de dataset.')
}

imprimirResumo()

function rodar(id, titulo, comando, args) {
  console.log('')
  console.log(regua)
  console.log(`▶️  ${titulo}`)
  console.log(regua)
  const r = spawnSync(process.execPath, argumentosDeNode(comando, args), { stdio: 'inherit' })
  if (r.error) {
    console.log(`\n❌ ${id}: não foi possível executar (${r.error.message})`)
    resultados.push({ id, codigo: null, estado: 'NAO EXECUTOU' })
    return 1
  }
  resultados.push({ id, codigo: r.status, estado: r.status === 0 ? 'ok' : 'saiu != 0' })
  return r.status
}

function imprimirResumo() {
  console.log('')
  console.log(regua)
  console.log('📋 RESUMO DA RODADA')
  console.log('')
  for (const r of resultados) {
    const marca = r.estado.startsWith('PULADO') ? '⏭️ ' : r.codigo === 0 ? '✅' : '⚠️ '
    const cod = r.codigo === null ? '  -' : String(r.codigo).padStart(3)
    console.log(`   ${marca} ${r.id.padEnd(10)} saída ${cod}   ${r.estado}`)
  }
  console.log('')
  console.log('   ⚠️ Saída != 0 no escopo é SINAL, não queda: quer dizer GRAVE no')
  console.log('      calendário vivo. O relatório sai != 0 só quando um PORTÃO quebra,')
  console.log('      nunca porque o mundo é feio.')
  console.log('')
  console.log('   ⛔ Nada foi publicado nem commitado. Se algo NACIONAL entrou e já foi')
  console.log('      DIVULGADO, o próximo passo é o /atualizar-brz, à mão.')
  console.log('')
}
