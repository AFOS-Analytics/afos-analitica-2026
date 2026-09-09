#!/usr/bin/env node
/**
 * PASSADA DO PAINEL US — atalho de ORQUESTRAÇÃO das etapas de MERCADO.
 *
 * ⛔ Sem regra própria, igual ao scripts/rodada-us-polls.mjs. Só chama, na ordem
 *    certa, o que já existe e já é testado.
 *
 * A ORDEM é o ponto, e ela não é óbvia:
 *   1. ler-mercado        a leitura ao vivo, com fresh=1 e país
 *   2. capture-guard      BLOQUEANTE, 8 minutos, e é ele que CERTIFICA a leitura
 *   3. serie-do-contrato  superlativo e par binário, sobre a leitura CERTIFICADA
 *
 * 🔑 O passo 3 depende do passo 2 e não o contrário. Medido em 09/Set/2026: rodei
 *    a série antes de a trava terminar e ela respondeu com a certificada da
 *    VÉSPERA, 21,1h de idade, imprimindo em toda linha que aquilo NÃO era o preço
 *    de agora e que o par binário dava +0,00pp em tudo. Veredito tecnicamente
 *    correto e inútil, do tipo que se lê como "nada se moveu".
 *
 * ⛔ O que este atalho NÃO faz, de propósito:
 *   · não chama o cron da imprensa, que ESCREVE em produção (ETAPA 3 à mão)
 *   · não roda o conferidor de tela: ele IMPRIME o comando pronto, com os valores
 *     já extraídos da leitura. O motivo é que a tela serve CACHE e a leitura sai
 *     com fresh=1, então as duas podem discordar por minutos sem nada estar
 *     errado. Portão que reprova o que está certo gasta o crédito do portão, e
 *     essa decisão é de quem lê, não do orquestrador.
 *   · não commita, não publica e não força nada.
 *
 * Uso:
 *   node scripts/rodada-us.mjs
 *   node scripts/rodada-us.mjs --sem-trava    (pula os 8 minutos; a série sai DEGRADADA)
 */

import { spawnSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'

const argv = process.argv.slice(2)
const semTrava = argv.includes('--sem-trava')

const regua = '─'.repeat(72)
const resultados = []

console.log('')
console.log(`🇺🇸 PASSADA DO PAINEL US · ${new Date().toISOString()}`)
console.log('   orquestração apenas: nenhuma conta é feita aqui')

rodar('ler-mercado', '1/3 · LEITURA AO VIVO — fresh=1 e país', 'scripts/ler-mercado.mjs', [])

if (semTrava) {
  console.log('')
  console.log(regua)
  console.log('⏭️  2/3 · TRAVA DE CAPTURA')
  console.log('   PULADO por --sem-trava')
  console.log('   ⚠️ Sem certificar, a série do passo 3 usa a certificada ANTERIOR.')
  console.log('      Se ela tiver mais de 2h, o veredito NÃO descreve o preço de agora.')
  resultados.push({ id: 'trava', codigo: null, estado: 'PULADO' })
} else {
  const r = rodar(
    'trava',
    '2/3 · TRAVA DE CAPTURA — BLOQUEANTE, duas leituras a 8 minutos',
    'npx',
    ['tsx', 'scripts/capture-guard.ts', '--pais=us'],
    true
  )
  if (r !== 0) {
    console.log('')
    console.log(regua)
    console.log('🛑 PASSADA ABORTADA na trava.')
    console.log('')
    console.log('   ⚠️ LER A ÚLTIMA LINHA da trava, não este código de saída.')
    console.log('      A linha VEREDITO: é a fonte de verdade. Já houve ambiente em que')
    console.log('      TODO comando voltava 1, inclusive `true`. Desempate: rodar `true`.')
    console.log('')
    console.log('   Se o veredito foi BLOQUEADO de verdade: não publicar preço, recapturar.')
    console.log('   Persistindo em duas rodadas, o certo é registrar book instável.')
    imprimirResumo()
    process.exit(1)
  }
}

rodar(
  'serie',
  '3/3 · SÉRIE E PAR BINÁRIO — sobre a leitura CERTIFICADA',
  'scripts/serie-do-contrato.mjs',
  ['--pais=us']
)

imprimirEsperado()
imprimirResumo()

function rodar(id, titulo, comando, args, bloqueante = false) {
  console.log('')
  console.log(regua)
  console.log(`▶️  ${titulo}`)
  console.log(regua)
  const ehNode = comando.endsWith('.mjs')
  const r = spawnSync(ehNode ? process.execPath : comando, ehNode ? [comando, ...args] : args, {
    stdio: 'inherit',
    shell: !ehNode,
  })
  if (r.error) {
    console.log(`\n❌ ${id}: não foi possível executar (${r.error.message})`)
    resultados.push({ id, codigo: null, estado: 'NAO EXECUTOU' })
    return 1
  }
  const codigo = r.status
  resultados.push({ id, codigo, estado: codigo === 0 ? 'ok' : bloqueante ? 'BLOQUEOU' : 'saiu != 0' })
  return codigo
}

/**
 * Monta o comando do conferidor de tela com os valores já extraídos, e NÃO o roda.
 * A escolha de quais valores vão aqui não é nova: são os 5 preços que o painel
 * publica, exatamente os que a trava vigia, mais a média servida do generic ballot.
 */
function imprimirEsperado() {
  console.log('')
  console.log(regua)
  console.log('🖥️  CONFERIDOR DE TELA — comando pronto, para rodar à mão')
  console.log('')

  const r = spawnSync(process.execPath, ['scripts/ler-mercado.mjs', '--json'], { encoding: 'utf8' })
  let precos = []
  try {
    const j = JSON.parse(r.stdout)
    for (const chave of ['house', 'senate', 'asScheduled']) {
      for (const linha of j.grupos?.[chave]?.linhas ?? []) precos.push(Number(linha.preco).toFixed(2))
    }
  } catch {
    console.log('   ⚠️ não consegui reler o mercado em JSON: montar o --esperado à mão')
  }

  let media = null
  const arq = 'public/us-polls-data.json'
  if (existsSync(arq)) {
    try {
      media = Number(JSON.parse(readFileSync(arq, 'utf8')).mediaAfos?.vantagemDem).toFixed(2)
    } catch {}
  }

  const valores = [...precos, ...(media && media !== 'NaN' ? [media] : [])]
  if (valores.length) {
    console.log(`   node scripts/conferir-tela.mjs --pais=us --esperado=${valores.join(',')}`)
    console.log('')
    console.log('   ⚠️ Valores na convenção do INGLÊS, com ponto: ele converte sozinho para')
    console.log('      vírgula no pt-BR e no ES.')
    console.log('   ⚠️ A tela serve CACHE e estes vieram com fresh=1. Reprovar aqui pode ser')
    console.log('      só defasagem de cache: reler o mercado e comparar antes de acusar.')
  }
}

function imprimirResumo() {
  console.log('')
  console.log(regua)
  console.log('📋 RESUMO DA PASSADA')
  console.log('')
  for (const r of resultados) {
    const marca = r.estado === 'PULADO' ? '⏭️ ' : r.codigo === 0 ? '✅' : '⚠️ '
    const cod = r.codigo === null ? '  -' : String(r.codigo).padStart(3)
    console.log(`   ${marca} ${r.id.padEnd(12)} saída ${cod}   ${r.estado}`)
  }
  console.log('')
  console.log('   ⛔ Falta à mão: ETAPA 3 (imprensa) e a publicação da ETAPA 6.')
  console.log('   ⛔ Nada foi commitado, publicado nem forçado.')
  console.log('')
}
