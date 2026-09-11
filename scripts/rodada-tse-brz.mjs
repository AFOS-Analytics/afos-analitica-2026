#!/usr/bin/env node
/**
 * RODADA DE PESQUISAS DO BRASIL — atalho de ORQUESTRAÇÃO.
 *
 * ⛔ Sem regra própria, igual a scripts/rodada-us-polls.mjs e scripts/rodada-us.mjs.
 *    Só chama, na ordem certa, o que já existe e já é testado.
 *
 * A ordem, e ela tem duas dependências reais:
 *   0. sonda do arquivo    várias leituras ANTES de baixar, e ela PARA o --apply
 *   1. ingestão (--rede)   ENSAIO por padrão, grava só com --apply
 *   2. relatório           lê a API e o Neon, então tem de rodar DEPOIS de gravar
 *   3. conferidor de escopo  o portão de RÓTULO, que nenhum portão de valor pega
 *   4. sonda de fechamento  a fonte trocou DURANTE a rodada?
 *
 * 🔴 O PASSO 0 E O PASSO 4 NASCERAM EM 11/Set/2026, DE UM DIA PERDIDO. Em
 *    10/Set a mesma URL do TSE devolveu 851 e 863 presidenciais alternando
 *    entre chamadas. Eu afirmei uma retirada como fato, depois desafirmei, e as
 *    duas vezes com UMA leitura. A dupla contagem desta rodada resolveu o caso
 *    DEPOIS, e resolveu bem, mas ela só fala quando a ingestão já gravou.
 *    A sonda fala antes, e custa 1 byte por leitura.
 *    → memory/feedback_sumico_numa_leitura_so_nao_e_retirada_o_cdn_serve_dois_retratos.md
 *
 * 🔑 E os dois passos medem coisas diferentes. O passo 0 pergunta se a fonte
 *    está servindo dois retratos AGORA; o passo 4 pergunta se ela trocou de
 *    retrato enquanto a rodada corria, que é exatamente a janela em que o
 *    download da ingestão aconteceu e onde nenhuma leitura minha estava.
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
 *   node scripts/rodada-tse-brz.mjs --apply --leituras=11   # sonda mais funda
 *   node scripts/rodada-tse-brz.mjs --apply --sem-sonda     # ⛔ só com motivo
 */

import { spawnSync } from 'node:child_process'

const argv = process.argv.slice(2)
const aplicar = argv.includes('--apply')
const semSonda = argv.includes('--sem-sonda')
const dias = (argv.find((a) => a.startsWith('--dias=')) ?? '--dias=30').slice(7)
const leituras = (argv.find((a) => a.startsWith('--leituras=')) ?? '--leituras=5').slice(11)

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

// 0/4 · A SONDA, e ela é PORTÃO no --apply, não aviso.
//
// ⛔ Discordância aqui NÃO é "a rede está ruim", é a fonte servindo dois
//    arquivos na mesma URL. Gravar em cima disso produz uma linha no
//    historico-arquivo.jsonl com um total que pode ser o do retrato errado, e
//    ESSA linha é a base da subtração de amanhã. Um número falso no histórico
//    não se percebe depois: ele vira o "ontem" contra o qual tudo se mede.
if (!semSonda) {
  const sonda = rodar(
    'sonda',
    `0/4 · SONDA do arquivo do TSE — ${leituras} leituras antes de baixar`,
    'scripts/sondar-arquivo-tse.ts',
    [`--leituras=${leituras}`]
  )
  if (sonda !== 0 && aplicar) {
    console.log('')
    console.log(regua)
    console.log('🛑 A SONDA NÃO LIBEROU, e o --apply PARA AQUI. Nada foi gravado.')
    console.log('')
    console.log('   Saída 2: a fonte está servindo mais de um retrato. Esperar e sondar de novo.')
    console.log('   Saída 1: a borda recusou. Modo ARQUIVO, e NÃO insistir na rede.')
    console.log('')
    console.log('   Para seguir mesmo assim, e só com motivo: --sem-sonda.')
    console.log('')
    resultados.push({ id: 'ingestao', codigo: null, estado: 'NAO RODOU (sonda)' })
    resultados.push({ id: 'relatorio', codigo: null, estado: 'NAO RODOU (sonda)' })
    resultados.push({ id: 'escopo', codigo: null, estado: 'NAO RODOU (sonda)' })
    imprimirResumo()
    process.exit(2)
  }
} else {
  console.log('   ⛔ --sem-sonda: o passo 0 foi PULADO por escolha, e o 4 também.')
  resultados.push({ id: 'sonda', codigo: null, estado: 'PULADO (--sem-sonda)' })
}

rodar(
  'ingestao',
  `1/4 · INGESTÃO do registro do TSE${aplicar ? ' (GRAVA no Neon)' : ' (ensaio)'}`,
  'scripts/ingest-tse-local.ts',
  ['--rede', ...(aplicar ? ['--apply'] : [])]
)

if (!aplicar) {
  console.log('')
  console.log(regua)
  console.log('⏭️  2/4, 3/4 e 4/4 · RELATÓRIO, CONFERIDOR DE ESCOPO e SONDA DE FECHAMENTO')
  console.log('   NÃO RODAM no ensaio, de propósito.')
  console.log('')
  console.log('   O relatório lê a API e o Neon. Rodá-lo agora mostraria o banco SEM')
  console.log('   as linhas que o ensaio acabou de listar, ou seja, um retrato que não')
  console.log('   é o de antes nem o de depois. Ler a lista acima e repetir com --apply.')
  resultados.push({ id: 'relatorio', codigo: null, estado: 'PULADO (ensaio)' })
  resultados.push({ id: 'escopo', codigo: null, estado: 'PULADO (ensaio)' })
  resultados.push({ id: 'fechamento', codigo: null, estado: 'PULADO (ensaio)' })
  imprimirResumo()
  process.exit(0)
}

rodar('relatorio', '2/4 · RELATÓRIO, calendário e mercado do Brasil', 'scripts/relatorio-pesquisas-brz.ts', [])

const escopo = rodar(
  'escopo',
  '3/4 · CONFERIDOR DE ESCOPO — o portão de RÓTULO',
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

// 4/4 · A SONDA DE FECHAMENTO, e ela AVISA, não desfaz.
//
// 🔑 Ela responde a pergunta que o passo 0 não pode responder: a fonte trocou
//    de retrato DEPOIS que eu sondei e enquanto a ingestão baixava? Se trocou,
//    a contagem desta rodada pode ser de qualquer um dos dois arquivos, e a
//    linha que acabou de entrar no histórico não sustenta afirmação de
//    retirada nem de crescimento. Nada é desfeito: a ingestão é aditiva e o
//    banco nunca perde. O que muda é o que se PODE dizer da contagem.
let fechamento = 0
if (!semSonda) {
  fechamento = rodar(
    'fechamento',
    '4/4 · SONDA DE FECHAMENTO — a fonte trocou durante a rodada?',
    'scripts/sondar-arquivo-tse.ts',
    ['--leituras=3', '--intervalo=800', '--comparar-com-ultima']
  )
  if (fechamento !== 0) {
    console.log('')
    console.log(regua)
    console.log('🔴 A FONTE MUDOU DE RETRATO DURANTE ESTA RODADA, ou está em trânsito agora.')
    console.log('')
    console.log('   ⛔ NÃO publicar contagem, retirada nem calendário com base nesta rodada')
    console.log('      sem sondar de novo até estabilizar e conferir a subtração à mão.')
    console.log('      O que entrou no banco está gravado e não se perde: o que não se')
    console.log('      sustenta é a AFIRMAÇÃO sobre o total do arquivo.')
    console.log('      Detalhe por protocolo: npx tsx scripts/diff-tse-arquivo-vs-banco.ts')
  }
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
  console.log('   🔍 Na sonda, 2 é a fonte servindo dois retratos e 1 é a borda recusando:')
  console.log('      um manda ESPERAR, o outro manda ir ao modo ARQUIVO. No passo 0 ela')
  console.log('      PARA a gravação; no passo 4 ela só avisa, porque ali já está gravado.')
  console.log('')
  console.log('   ⛔ Nada foi publicado nem commitado. Se algo NACIONAL entrou e já foi')
  console.log('      DIVULGADO, o próximo passo é o /atualizar-brz, à mão.')
  console.log('')
}
