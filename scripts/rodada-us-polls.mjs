#!/usr/bin/env node
/**
 * RODADA COMPLETA DO GENERIC BALLOT (EUA) — atalho de ORQUESTRAÇÃO.
 *
 * ⛔ Este arquivo NÃO tem regra própria e não pode ganhar nenhuma.
 *    Ele só chama, em ordem, os scripts que já existem e já são testados.
 *    Toda medição vive nos scripts chamados; se alguma conta aparecer aqui,
 *    viraria a SEGUNDA cópia de uma regra que já existe, que foi o defeito
 *    que custou os rótulos de faixa do mercado em 29/Jul/2026.
 *
 * A ordem não é estética:
 *   1. coletar          escreve public/us-polls-data.json
 *   2. conferir         PORTÃO BLOQUEANTE: colapso, contaminação e atribuição
 *   3. projetar         o futuro da janela, se nada entrar
 *   4. histórico        a série no Neon, e se o registro de hoje é do cron
 *   5. defasagem        o instituto publicou algo que o índice não tem?
 *   6. efeito do recorte  quanto a hierarquia LV > RV > A move o número
 *
 * O passo 2 aborta a passada de propósito: os passos 3 e 6 LEEM o arquivo que
 * o passo 1 acabou de escrever, então rodá-los sobre arquivo reprovado produz
 * número que não se pode usar para nada. Reprovou, para tudo.
 *
 * ⛔ Não commita, não faz deploy e não força o cron. Isso é decisão de quem lê.
 *
 * Uso:
 *   node scripts/rodada-us-polls.mjs
 *   node scripts/rodada-us-polls.mjs --sem-coleta   (não recoleta, só confere e mede)
 *   node scripts/rodada-us-polls.mjs --sem-rede     (pula a defasagem, que sai à internet)
 *   node scripts/rodada-us-polls.mjs --dias=30      (repassa a janela ao coletor)
 *   node scripts/rodada-us-polls.mjs --arquivo=X --base=Y
 *        confere um arquivo isolado contra outra base git. Implica --sem-coleta,
 *        porque coletar escreveria no arquivo de produção enquanto o portão olha
 *        para outro. É por aqui que se exercita o portão DISPARANDO.
 */

import { spawnSync } from 'node:child_process'

const argv = process.argv.slice(2)
const temFlag = (f) => argv.includes(f)
const valorDe = (nome) => {
  const achado = argv.find((a) => a.startsWith(`--${nome}=`))
  return achado ? achado.slice(nome.length + 3) : null
}

const arquivoAlvo = valorDe('arquivo')
const baseAlvo = valorDe('base')
const semColeta = temFlag('--sem-coleta') || Boolean(arquivoAlvo)
const semRede = temFlag('--sem-rede')
const dias = valorDe('dias')

const ARQUIVO = arquivoAlvo || 'public/us-polls-data.json'

// O --arquivo/--base só vai ao PORTÃO, que é quem sabe recebê-los. Os medidores
// leem o arquivo de produção, então com alvo isolado eles não têm o que medir.
const argsPortao = [
  ...(arquivoAlvo ? [`--arquivo=${arquivoAlvo}`] : []),
  ...(baseAlvo ? [`--base=${baseAlvo}`] : []),
]
const soPortao = Boolean(arquivoAlvo)

const passos = [
  {
    id: 'coletar',
    titulo: `1/6 · COLETA — escreve ${ARQUIVO}`,
    script: 'scripts/parse-us-generic-ballot.mjs',
    args: dias ? [`--dias=${dias}`] : [],
    pular: semColeta,
    motivoPulo: arquivoAlvo ? '--arquivo (alvo isolado)' : '--sem-coleta',
  },
  {
    id: 'conferir',
    titulo: '2/6 · PORTÃO — colapso, contaminação e atribuição da variação',
    script: 'scripts/conferir-us-polls.mjs',
    args: argsPortao,
    bloqueante: true,
  },
  {
    id: 'projetar',
    titulo: '3/6 · PROJEÇÃO — o futuro da janela, se nada entrar  [USO INTERNO]',
    script: 'scripts/projetar-janela-us.mjs',
    args: [],
    pular: soPortao,
    motivoPulo: '--arquivo (alvo isolado)',
  },
  {
    id: 'historico',
    titulo: '4/6 · SÉRIE NO NEON — e se o registro de hoje é do cron',
    script: 'scripts/historico-us-polls.mjs',
    args: [],
    pular: soPortao,
    motivoPulo: '--arquivo (alvo isolado)',
  },
  {
    id: 'defasagem',
    titulo: '5/6 · DEFASAGEM — o instituto publicou algo que o índice não tem?',
    script: 'scripts/check-us-polls-defasagem.mjs',
    args: [],
    pular: semRede || soPortao,
    motivoPulo: soPortao ? '--arquivo (alvo isolado)' : '--sem-rede',
  },
  {
    id: 'recorte',
    titulo: '6/6 · EFEITO DO RECORTE — o preço da hierarquia LV > RV > A  [USO INTERNO]',
    script: 'scripts/efeito-do-recorte-us.mjs',
    args: [],
    pular: soPortao,
    motivoPulo: '--arquivo (alvo isolado)',
  },
]

const regua = '─'.repeat(72)
const resultados = []

console.log('')
console.log(`🇺🇸 RODADA DO GENERIC BALLOT · ${new Date().toISOString()}`)
console.log('   orquestração apenas: nenhuma conta é feita aqui')

for (const passo of passos) {
  console.log('')
  console.log(regua)
  if (passo.pular) {
    console.log(`⏭️  ${passo.titulo}`)
    console.log(`   PULADO por ${passo.motivoPulo}`)
    resultados.push({ ...passo, codigo: null, estado: 'PULADO' })
    continue
  }
  console.log(`▶️  ${passo.titulo}`)
  console.log(regua)

  const r = spawnSync(process.execPath, [passo.script, ...passo.args], {
    stdio: 'inherit',
  })

  if (r.error) {
    console.log('')
    console.log(`❌ ${passo.id}: não foi possível executar (${r.error.message})`)
    resultados.push({ ...passo, codigo: null, estado: 'NAO EXECUTOU' })
    if (passo.bloqueante) {
      abortar(passo)
    }
    continue
  }

  const codigo = r.status
  resultados.push({ ...passo, codigo, estado: codigo === 0 ? 'ok' : 'saiu != 0' })

  if (passo.bloqueante && codigo !== 0) {
    abortar(passo)
  }
}

imprimirResumo()

function abortar(passo) {
  console.log('')
  console.log(regua)
  console.log('🛑 PASSADA ABORTADA no portão bloqueante.')
  console.log('')
  console.log(`   O ${passo.script} REPROVOU, e os medidores seguintes leem`)
  console.log(`   o ${ARQUIVO} que a coleta acabou de escrever.`)
  console.log('   Rodá-los agora produziria número que não se pode usar.')
  console.log('')
  console.log('   O arquivo NÃO foi desfeito de propósito: desfazer apaga a prova')
  console.log('   de que a origem mudou. Ler a saída acima, decidir, e só então:')
  console.log('')
  console.log(`      git checkout -- ${ARQUIVO}`)
  console.log('')
  imprimirResumo()
  process.exit(1)
}

function imprimirResumo() {
  console.log('')
  console.log(regua)
  console.log('📋 RESUMO DA PASSADA')
  console.log('')
  for (const r of resultados) {
    const marca = r.estado === 'PULADO' ? '⏭️ ' : r.codigo === 0 ? '✅' : '⚠️ '
    const cod = r.codigo === null ? '  -' : String(r.codigo).padStart(3)
    console.log(`   ${marca} ${r.id.padEnd(10)} saída ${cod}   ${r.estado}`)
  }
  console.log('')
  console.log('   ⚠️ Saída != 0 fora do portão é SINAL, não queda:')
  console.log('      projetar sai 1 quando a base não tem data de campo legível,')
  console.log('      histórico sai 1 quando o controle diverge e a projeção não vale.')
  console.log('      Ler a seção do passo, não o número.')
  console.log('')
  console.log('   ⛔ Nada foi commitado, publicado nem forçado no Neon.')
  console.log('')
}
