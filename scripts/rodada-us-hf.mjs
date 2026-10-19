#!/usr/bin/env node
/**
 * SUBIDA DO DATASET US 2026 AO HUGGING FACE — atalho de ORQUESTRAÇÃO.
 *
 * ⛔ Este arquivo NÃO tem regra própria. O build vive nos dois `build-us-2026-*`,
 *    o portão de encolhimento e a conferência depois da subida vivem no
 *    `hf-upload-us2026.py`, com casos plantados em `testar-hf-upload-us2026.py`.
 *
 * 🔴 POR QUE EXISTE, medido em 13/Set/2026. A subida era improvisada a cada
 *    passada, em cinco comandos, e duas coisas decididas em 12/Set não estavam em
 *    lugar nenhum: o conserto do certificado (feito à mão naquele dia) e a
 *    conferência DEPOIS da subida, que é quem responde se publicou, e não a barra
 *    de progresso do envio.
 *
 * A ordem:
 *   1. dados        build-us-2026-dataset.mjs   (backup do Neon, pesquisas, imprensa)
 *   2. metadados    build-us-2026-metadata.mjs  (README, DATASHEET, CHECKSUMS)
 *   3. portão       conferir: nenhum arquivo encolhe, e nenhum fica sem ser lido
 *   4. subir        só se o portão aprovou
 *   5. conferir     --exato: todo arquivo do staging publicado com as mesmas linhas
 *
 * ⚠️ ELE PUBLICA um dataset aberto. Por isso o padrão é `--ensaio` NÃO: quem roda
 *    sem flag sobe. Para só montar e conferir, `--ensaio`.
 *
 * Uso:
 *   node scripts/rodada-us-hf.mjs --ensaio                 monta e confere, não sobe
 *   node scripts/rodada-us-hf.mjs "mensagem do commit"     monta, confere, sobe e reconfere
 *   node scripts/rodada-us-hf.mjs "msg" --declarado=data/erratas/encolhimento-AAAA-MM-DD.json
 */

import { existsSync, readFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { spawnSync } from 'node:child_process'
// 🔑 A janela da imprensa NÃO se recalcula aqui: ela é derivada do `vercel.json`
//    pela regra de `data-corrente.mjs`, que tem 20 casos no CI. Em 03/Out o
//    `estado:usa` tinha essa conta inline, `>= 19 * 60 + 30`, com um comentário
//    ao lado APONTANDO para o módulo dono enquanto o código o reimplementava.
//    Número de horário escrito à mão segue afirmando 19:30Z depois de a agenda
//    mudar, e erra em silêncio.
import { ACOES, agendaDaRota, decidirDataCorrente, ultimoCronDoDia } from '../lib/us-press/data-corrente.mjs'
const ROTA_IMPRENSA = '/api/cron/refresh-us-press'

const argv = process.argv.slice(2)
const ensaio = argv.includes('--ensaio')
const declarado = argv.find((a) => a.startsWith('--declarado='))
const mensagem = argv.find((a) => !a.startsWith('--')) || 'Atualiza serie de mercado, imprensa e metadados'
/**
 * 🐍 O interpretador, RESOLVIDO por execução e nunca pelo nome.
 *
 * 🔴 O DEFEITO, medido em 19/Out/2026: a linha antiga era
 *    `process.env.PYTHON || 'python'` no Windows, e nesta máquina `python` no
 *    PATH é o STUB da Microsoft Store. Ele EXISTE, responde, e imprime
 *    "Python nao foi encontrado; executar sem argumentos para instalar do
 *    Microsoft Store". O passo 3 parou no portão e os passos 4 e 5 não
 *    rodaram, com o resumo dizendo apenas "SEM prova de publicação".
 *
 * ⚠️ E funcionou em 18/Out porque eu tinha exportado `PYTHON` naquele shell.
 *    O shell não guarda env entre chamadas, então a passada dependia de eu
 *    LEMBRAR de exportar, toda vez, e falhava calada quando eu esquecia.
 *
 * 🔑 A régua: nome não é identidade, e quem responde "este é o Python?" é o
 *    próprio binário. Mesma família do `tasklist | grep node` que declarou
 *    MORTO um guardião que era `powershell` e estava vivo.
 *    → memory/feedback_o_grep_que_tira_o_ruido_tira_o_sinal_junto.md
 *       memory/feedback_python_por_stdin_decodifica_cp1252.md
 */
function resolverPython() {
  const candidatos = [
    process.env.PYTHON,
    'C:/Users/afos3/AppData/Local/Python/pythoncore-3.14-64/python.exe',
    process.platform === 'win32' ? 'py' : null,
    'python3',
    'python',
  ].filter(Boolean)
  const tentados = []
  for (const c of candidatos) {
    try {
      const r = spawnSync(c, ['--version'], { encoding: 'utf8' })
      const saida = `${r.stdout ?? ''}${r.stderr ?? ''}`
      // ⛔ A guarda é a FORMA da resposta, não o código de saída: o stub da
      //    Store sai 0 e imprime o convite para instalar.
      if (/^Python 3\.\d/m.test(saida)) return { cmd: c, versao: saida.trim().split(/\r?\n/)[0], tentados }
      tentados.push(`${c}: ${(saida.trim().split(/\r?\n/)[0] || 'sem saída').slice(0, 60)}`)
    } catch (e) {
      tentados.push(`${c}: ${String(e.code ?? e.message).slice(0, 40)}`)
    }
  }
  return { cmd: null, versao: null, tentados }
}

const PY_RESOLVIDO = resolverPython()
if (!PY_RESOLVIDO.cmd) {
  console.error('❌ nenhum Python 3 respondeu. Tentados, na ordem:')
  for (const t of PY_RESOLVIDO.tentados) console.error('   · ' + t)
  console.error('   📌 Exportar PYTHON com o caminho do interpretador real resolve.')
  process.exit(1)
}
const PY = PY_RESOLVIDO.cmd
const env = { ...process.env, PYTHONIOENCODING: 'utf-8' }
const regua = '─'.repeat(72)

const passos = [
  { id: 'dados', titulo: '1/5 · DADOS', cmd: process.execPath, args: ['scripts/build-us-2026-dataset.mjs'], bloqueante: true },
  { id: 'metadados', titulo: '2/5 · METADADOS', cmd: process.execPath, args: ['scripts/build-us-2026-metadata.mjs'], bloqueante: true },
  { id: 'portao', titulo: '3/5 · PORTÃO — nada encolhe, nada fica sem ler', cmd: PY, args: ['scripts/hf-upload-us2026.py', 'conferir', ...(declarado ? [declarado] : [])], bloqueante: true },
  { id: 'subir', titulo: '4/5 · SUBIR', cmd: PY, args: ['scripts/hf-upload-us2026.py', 'subir', mensagem, ...(declarado ? [declarado] : [])], bloqueante: true, pular: ensaio },
  { id: 'conferir', titulo: '5/5 · CONFERIR DEPOIS — publicado = staging', cmd: PY, args: ['scripts/hf-upload-us2026.py', 'conferir', '--exato'], pular: ensaio },
]

const resultados = []
console.log('')
console.log(`🤗 SUBIDA DO DATASET US 2026 · ${new Date().toISOString()}${ensaio ? '  [ENSAIO: não sobe]' : ''}`)

// ── IDADE DO BACKUP, antes de qualquer passo ────────────────────────────────
//
// 🔴 POR QUE, medido em 22/Set/2026. O `build-us-2026-dataset.mjs` lê
//    `backup/neon/`, e quem escreve ali é o workflow `backup-neon.yml`. Ele é
//    AGENDADO para 15:00 UTC e na prática cai entre 17:40 e 19:50, porque o
//    cron do GitHub atrasa. Uma passada rodada às 16:00Z publica um dataset
//    cuja série de mercado termina NO DIA ANTERIOR.
//
// ⛔ E nada dizia isso. O portão de encolhimento compara CONTAGEM DE LINHA, e
//    um dataset sem o dia de hoje não encolhe: ele simplesmente não cresce, o
//    que é indistinguível de um dia sem movimento. O `+0` prova que chegou,
//    nunca que está completo.
//
// 📌 Isto NÃO bloqueia. O dataset é cumulativo e a próxima passada recolhe o
//    dia. O que ele não pode é subir calado, porque quem lê a mensagem do
//    commit no HF assume que ela descreve o dia dela.
function idadeDoBackup() {
  try {
    const mes = new Date().toISOString().slice(0, 7)
    const arq = `backup/neon/marketPrice/${mes}.csv.gz`
    if (!existsSync(arq)) return { erro: `sem ${arq}` }
    const txt = gunzipSync(readFileSync(arq)).toString('utf8')
    const linhas = txt.split('\n').map((l) => l.replace(/\r$/, '')).filter(Boolean)
    const col = linhas[0].split(',').indexOf('snapshotAt')
    if (col < 0) return { erro: 'coluna snapshotAt ausente no backup' }
    let ultimo = ''
    for (const l of linhas.slice(1)) {
      const v = l.split(',')[col]
      if (v && v > ultimo) ultimo = v
    }
    if (!ultimo) return { erro: 'backup sem nenhum snapshotAt legivel' }
    const hoje = new Date().toISOString().slice(0, 10)
    return { ultimo, temHoje: ultimo.startsWith(hoje), horas: (Date.now() - Date.parse(ultimo)) / 3_600_000 }
  } catch (e) {
    return { erro: String(e?.message ?? e) }
  }
}

const bk = idadeDoBackup()
console.log('')
if (bk.erro) {
  console.log(`   ⚠️ IDADE DO BACKUP: INDETERMINADA (${bk.erro}). Não é "está em dia".`)
} else if (bk.temHoje) {
  console.log(`   ✅ backup com o dia de hoje, último ponto ${bk.ultimo} (${bk.horas.toFixed(1)}h)`)
} else {
  console.log(`   🔴 BACKUP SEM O DIA DE HOJE: último ponto ${bk.ultimo} (${bk.horas.toFixed(1)}h atrás)`)
  console.log(`      O backup-neon.yml é agendado para 15:00Z e costuma cair entre 17:40 e 19:50Z.`)
  console.log(`      A série de mercado deste dataset termina no dia ANTERIOR, e o portão de`)
  console.log(`      encolhimento NÃO pega isso, porque ele compara contagem de linha.`)
  console.log(`      📌 Não bloqueia: o dataset é cumulativo. Mas a mensagem do commit não pode`)
  console.log(`         prometer o dia de hoje.`)
}

// ── A IMPRENSA DO DIA, que é a OUTRA espera e não tinha medidor ─────────────
//
// 🔴 POR QUE, medido em 12/Out/2026. A régua do `/atualizar-usa` diz, com estas
//    palavras, que "backup presente não autoriza subir: autoriza subir DEPOIS de
//    a imprensa estar arquivada", porque o `build-us-2026-dataset.mjs` LÊ
//    `public/us-press-archive/`. A consequência está medida: em 03/Out o
//    `press/us-press-timeline.csv` subiu com +10, que são exatamente os 10 itens
//    arquivados minutos antes; sem a ETAPA 3.1 eles só entrariam na passada
//    seguinte.
//
// ⛔ E a assimetria era esta: o backup acima TEM medidor, e a imprensa não tinha
//    NENHUM no ponto da ação. O `estado:usa` declara a janela, mas ele é outro
//    script, rodado em outra hora, e a decisão de subir acontece aqui.
//
// 📌 Não bloqueia, pela mesma razão do backup: o dataset é cumulativo. Mas a
//    diferença de NATUREZA entra no texto, porque muda o que fazer: o backup é
//    robô que ainda não rodou, e a imprensa é uma etapa MINHA que ficou para
//    trás. A primeira se espera, a segunda se roda.
// 🔑 E a DECISÃO não mora aqui: `decidirDataCorrente` já devolve exatamente os
//    três estados de que este aviso precisa, com o motivo redigido e 20 casos no
//    CI. Eu escrevi a comparação de minutos à mão primeiro e isso era a segunda
//    cópia de uma regra existente, o mesmo defeito que este arquivo denuncia no
//    comentário acima. ACOES.ADIAR é "a janela ainda não abriu", ACOES.CRIAR com
//    arquivo ausente é "devida e não feita", e ACOES.REGERAR é "já existe".
function imprensaDoDia() {
  const hoje = new Date().toISOString().slice(0, 10)
  const jaExiste = existsSync(`public/us-press-archive/${hoje}.json`)
  try {
    const v = JSON.parse(readFileSync('vercel.json', 'utf8'))
    const ultimoCron = ultimoCronDoDia(agendaDaRota(v, ROTA_IMPRENSA))
    const d = decidirDataCorrente({ jaExiste, agora: new Date(), ultimoCron })
    return { hoje, jaExiste, ...d }
  } catch (e) {
    return { hoje, jaExiste, erro: String(e.message ?? e) }
  }
}

const im = imprensaDoDia()
if (im.erro) {
  console.log(`   ⚠️ JANELA DA IMPRENSA: INDETERMINADA (${im.erro}). Não é "está em dia".`)
} else if (im.jaExiste) {
  console.log(`   ✅ imprensa de ${im.hoje} ARQUIVADA, o dataset vai levar as matérias do dia`)
} else if (im.acao === ACOES.ADIAR) {
  console.log(`   ⏳ imprensa de ${im.hoje} ainda NÃO É DEVIDA: ${im.motivo}`)
  console.log(`      O dataset vai levar a imprensa até ontem, e isso é correto. A mensagem do`)
  console.log(`      commit no HF não pode prometer as matérias de hoje.`)
} else {
  console.log(`   🔴 IMPRENSA DE ${im.hoje} NÃO ARQUIVADA, e a janela JÁ ABRIU (${im.motivo})`)
  console.log(`      O press/us-press-timeline.csv vai subir SEM as matérias do dia, e elas só`)
  console.log(`      entram na passada seguinte. Isto é etapa SUA que ficou para trás, não robô`)
  console.log(`      atrasado: rodar a ETAPA 3.1 antes.`)
  console.log(`      📌 node scripts/rodada-us-imprensa.mjs --sem-cron`)
}

for (const p of passos) {
  console.log('')
  console.log(regua)
  if (p.pular) {
    console.log(`⏭️  ${p.titulo}  PULADO por --ensaio`)
    resultados.push({ ...p, estado: 'PULADO', codigo: null })
    continue
  }
  console.log(`▶️  ${p.titulo}`)
  console.log(regua)
  const r = spawnSync(p.cmd, p.args, { stdio: 'inherit', env })
  const codigo = r.error ? null : r.status
  resultados.push({ ...p, codigo, estado: codigo === 0 ? 'ok' : r.error ? `não executou (${r.error.message})` : 'saiu != 0' })
  if (p.bloqueante && codigo !== 0) {
    console.log('')
    console.log(`🛑 PARADO em ${p.id}. Nada depois dele rodou.`)
    break
  }
}

console.log('')
console.log(regua)
console.log('📋 RESUMO')
for (const r of resultados) {
  const marca = r.estado === 'PULADO' ? '⏭️ ' : r.codigo === 0 ? '✅' : '❌'
  console.log(`   ${marca} ${r.id.padEnd(10)} ${r.estado}`)
}
const conferido = resultados.find((r) => r.id === 'conferir')
if (conferido && conferido.codigo === 0) console.log('\n   ✅ o publicado confere com o staging, arquivo por arquivo')
else if (!ensaio) console.log('\n   ⚠️ SEM prova de publicação: o passo 5 não aprovou ou não rodou')
console.log('   ⚠️ linha não é conteúdo: rotação do mesmo tamanho sai como +0\n')
process.exit(resultados.every((r) => r.estado === 'PULADO' || r.codigo === 0) ? 0 : 1)
