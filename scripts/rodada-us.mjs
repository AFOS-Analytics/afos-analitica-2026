#!/usr/bin/env node
/**
 * PASSADA DO PAINEL US — atalho de ORQUESTRAÇÃO das etapas de MERCADO.
 *
 * ⛔ Sem regra própria, igual ao scripts/rodada-us-polls.mjs. Só chama, na ordem
 *    certa, o que já existe e já é testado.
 *
 * A ORDEM é o ponto, e ela não é óbvia:
 *   1. ler-mercado         a leitura ao vivo, com fresh=1 e país
 *   2. capture-guard       BLOQUEANTE, 8 minutos, e é ele que CERTIFICA a leitura
 *   3. serie-do-contrato   superlativo e par binário, sobre a leitura CERTIFICADA
 *   4. estado-dos-portoes  a reprovação de hoje é evento ou é o de sempre
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
import { ONDE, coletar, decidir, linhaDoVeredito } from './lib/onde-medir-a-serie.mjs'

const argv = process.argv.slice(2)
const semTrava = argv.includes('--sem-trava')

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
console.log(`🇺🇸 PASSADA DO PAINEL US · ${new Date().toISOString()}`)
console.log('   orquestração apenas: nenhuma conta é feita aqui')

rodar('ler-mercado', '1/4 · LEITURA AO VIVO — fresh=1 e país', 'scripts/ler-mercado.mjs', [])

if (semTrava) {
  console.log('')
  console.log(regua)
  console.log('⏭️  2/4 · TRAVA DE CAPTURA')
  console.log('   PULADO por --sem-trava')
  console.log('   ⚠️ Sem certificar, a série do passo 3 usa a certificada ANTERIOR.')
  console.log('      Se ela tiver mais de 2h, o veredito NÃO descreve o preço de agora.')
  resultados.push({ id: 'trava', codigo: null, estado: 'PULADO' })
} else {
  const r = rodar(
    'trava',
    '2/4 · TRAVA DE CAPTURA — BLOQUEANTE, duas leituras a 8 minutos',
    'scripts/capture-guard.ts',
    ['--pais=us'],
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

// ─── ANTES do passo 3: EM QUAL ÁRVORE a série se mede (13/Out/2026) ─────────
//
// 🔴 O passo 3 lê o `backup/neon` da árvore em que ele roda, e NADA conferia se
// esta é a árvore com o backup mais novo. Medido em 13/Out: a principal tinha o
// de 09/Out e a destacada o de 12/Out, e o passo 3 rodou aqui sem uma palavra,
// devolvendo CINCO superlativos sobre série encurtada e um RECORDE do contrato
// de calendário com cauda cega de 120h.
//
// 🕳️ E o portão que existe diagnostica ERRADO este caso, o que é pior do que não
// diagnosticar: a cauda cega mede QUANTO a série está curta e por isso manda
// "regerar o backup". Aqui não há nada a regerar, ele está commitado uma árvore
// ao lado. Medida de tamanho não decide ação.
//
// ⛔ Ele AVISA e não bloqueia, porque DENTRO sobrevive a backup atrasado. Quem
// não sobrevive é RECORDE e PISO, e esses o próprio passo 3 já marca.
{
  const v = decidir(coletar())
  console.log('')
  console.log(regua)
  console.log('📍 ONDE A SÉRIE SE MEDE — antes do passo 3, que lê o backup')
  console.log(regua)
  for (const ln of linhaDoVeredito(v).split(String.fromCharCode(10))) console.log(`   ${ln}`)
  if (v.onde !== ONDE.AQUI) {
    console.log('')
    console.log('   ⚠️ O passo 3 abaixo roda de qualquer jeito, e o veredito dele vale para')
    console.log('      DENTRO. Para RECORDE ou PISO, remedir onde o veredito acima aponta.')
  }
  resultados.push({ id: 'onde-medir', codigo: v.onde === ONDE.AQUI ? 0 : null, estado: v.onde })
}

rodar(
  'serie',
  '3/4 · SÉRIE E PAR BINÁRIO — sobre a leitura CERTIFICADA',
  'scripts/serie-do-contrato.mjs',
  ['--pais=us']
)

// ─── PASSO 3.5, acrescentado em 16/Out/2026 ─────────────────────────────────
//
// 🔴 O passo 3 fecha a cauda cega com a leitura CERTIFICADA, que é UM ponto, e
// um ponto não cobre uma janela. Dois superlativos FALSOS saíram por isso, em
// 09 e 13/Out: no de 13/Out o topo da série foi tocado 57 minutos ANTES da
// certificada, então nem o backup nem ela o viram.
//
// 🔑 Este passo preenche a cauda com os pontos INTRADIÁRIOS da rota, com
// controle positivo por série. Saída 2 quer dizer superlativo PROIBIDO.
rodar(
  'cauda',
  '3.5/4 · CAUDA CEGA — o pedaço que o backup e a certificada não cobrem',
  'scripts/cauda-do-contrato-us.mjs',
  []
)

// ─── PASSO 4, acrescentado em 15/Set/2026 ───────────────────────────────────
//
// 🔑 O passo 1 imprime ❌ e ✅ para cada distribuição e para aí. A régua do
// comando manda decidir pela SÉRIE das últimas 24h, e ninguém media isso na
// rodada: a decisão saía de cabeça, ou de rodar o `check-distribuicao.ts` uma
// vez por mercado.
//
// 🔴 Medido no dia em que este passo entrou: `governors` e `houseSeats` saíram os
// dois com ❌ na mesma leitura e são coisas opostas. `governors` fecha em 80,78%
// das capturas; `houseSeats` fecha em 36,17%. E o `governors` daquele instante
// nem era travessia: meia hora depois a leitura ao vivo voltou a fechar, e as 14
// capturas gravadas da janela estavam todas do outro lado.
//
// ⚠️ Ele sai != 0 quando falta material ou quando existe travessia a reler. É
// SINAL, e a régua do resumo abaixo já diz para ler a seção, não o número.
rodar(
  'portoes',
  '4/4 · ESTADO DOS PORTÕES — a reprovação de hoje merece nota?',
  'scripts/estado-dos-portoes.ts',
  []
)

imprimirEsperado()
imprimirResumo()

function rodar(id, titulo, comando, args, bloqueante = false) {
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

  // 🔴 30/Out/2026: este bloco RELIA o mercado ao vivo e montava o --esperado
  //    com essa releitura, não com a leitura que a trava acabou de certificar.
  //    Medido no dia: a trava certificou Câmara D em 92.50 às 01:11:10Z e o
  //    comando saiu pedindo 93.50, um preço de passagem que nenhuma das duas
  //    leituras viu. Agora vale a CERTIFICADA desta rodada, e a releitura ao
  //    vivo só serve para AVISAR que o livro já andou, nunca para ditar o número.
  const ordem = [['house', /Democratic/], ['house', /Republican/], ['senate', /Democratic/], ['senate', /Republican/], ['asScheduled', /./]]
  const doMapa = (mapa) => ordem.map(([livro, re]) => {
    const k = Object.keys(mapa ?? {}).find((x) => x.startsWith(livro + ':') && re.test(x))
    return k == null ? null : Number(mapa[k]).toFixed(2)
  })
  let precos = []
  let origem = null
  const cert = '.cache/capture-guard/ultima-us.json'
  if (existsSync(cert)) {
    try {
      const c = JSON.parse(readFileSync(cert, 'utf8'))
      const idadeMin = (Date.now() - new Date(c.fetchedAt).getTime()) / 60000
      const p = doMapa(c.precos)
      if (c.ok && idadeMin >= 0 && idadeMin <= 30 && p.every((v) => v != null)) {
        precos = p
        origem = `certificada às ${c.fetchedAt}, há ${idadeMin.toFixed(0)} min`
      }
    } catch {}
  }
  const r = spawnSync(process.execPath, ['scripts/ler-mercado.mjs', '--json'], { encoding: 'utf8' })
  let aoVivo = []
  try {
    const j = JSON.parse(r.stdout)
    for (const chave of ['house', 'senate', 'asScheduled']) {
      for (const linha of j.grupos?.[chave]?.linhas ?? []) aoVivo.push(Number(linha.preco).toFixed(2))
    }
  } catch {}
  if (!precos.length && aoVivo.length) {
    precos = aoVivo
    origem = 'leitura AO VIVO, sem certificada recente: a trava não aprovou nesta rodada, ou foi pulada'
  }
  if (!precos.length) console.log('   ⚠️ não consegui ler a certificada nem reler o mercado: montar o --esperado à mão')
  if (origem) console.log(`   📌 preços: ${origem}`)
  if (origem?.startsWith('certificada') && aoVivo.length === precos.length && aoVivo.some((v, i) => v !== precos[i])) {
    console.log(`   ⚠️ o livro JÁ ANDOU depois da certificação: ao vivo ${aoVivo.join(',')}`)
    console.log('      A tela pode estar mostrando qualquer dos dois. Ler contra a certificada; se reprovar, reler.')
  }

  let media = null
  let lastUpdateArquivo = null
  const arq = 'public/us-polls-data.json'
  if (existsSync(arq)) {
    try {
      const d = JSON.parse(readFileSync(arq, 'utf8'))
      media = Number(d.mediaAfos?.vantagemDem).toFixed(2)
      lastUpdateArquivo = d.lastUpdate ?? null
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
    if (media && media !== 'NaN') {
      // 🔴 Medido em 15/Set/2026: o 6º valor sai do ARQUIVO LOCAL e a tela escolhe
      //    entre o arquivo PUBLICADO e o registro do Neon (lib/dashboard/us-static-data.ts:
      //    o arquivo vence só se o lastUpdate dele for MAIS NOVO). Com a CBS no disco
      //    e ainda sem deploy, a tela servia D+5.09 do Neon e este comando pedia
      //    D+5.36: reprovaria uma tela certa. Depois do deploy, o arquivo novo vence.
      console.log(`   ⚠️ A média (${media}) é a do arquivo LOCAL, lastUpdate ${lastUpdateArquivo ?? '?'}. A tela usa o arquivo`)
      console.log('      PUBLICADO só se ele for mais novo que o registro do Neon. Antes do deploy e antes')
      console.log('      do cron das 07:10Z, ela pode servir a média do registro anterior: reprovar SÓ no')
      console.log('      último valor, nesse intervalo, é essa escolha e não defeito da tela.')
    }
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
