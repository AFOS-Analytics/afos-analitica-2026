/**
 * estado-da-faixa-us.mjs · o que está DEFASADO na faixa dos EUA, agora.
 *
 * ─── POR QUE ESTE ARQUIVO EXISTE (01/Out/2026) ──────────────────────────────
 *
 * 🔴 A imprensa ficou TRÊS DIAS sem arquivo e nada alarmou. A sessão de 29/Set
 * terminou antes das 19:30Z, que é quando o arquivador deixa a data corrente
 * nascer, e as de 30/Set e 01/Out foram atrás. Os crons seguiram gravando no
 * Neon o tempo todo, então nenhum portão tinha o que reclamar: o que ficou para
 * trás foi o PISO VERSIONADO, e piso não reclama.
 *
 * Só apareceu porque eu fui olhar. E o custo real não é o comando que eu digito,
 * é a RECONSTITUIÇÃO: toda sessão que começa depois de um intervalo gasta cinco
 * ou seis sondagens para responder "o que já foi feito hoje e o que falta".
 *
 * ─── O QUE ELE FAZ, E O QUE ELE NÃO FAZ ─────────────────────────────────────
 *
 * ✅ FAZ: compara, artefato por artefato, o VIVO contra o VERSIONADO, e diz onde
 *    os dois se separaram. É leitura pura.
 *
 * ⛔ NÃO FAZ: não decide, não escreve, não commita, não publica e não tem regra
 *    própria. Ele não reimplementa portão nenhum: lê o que os portões e os
 *    arquivos já declaram. Mesma disciplina do `rodada-us.mjs`, que é
 *    orquestração sem conta própria, porque segunda cópia de regra é o defeito
 *    que esta casa mais repete.
 *
 * ⚠️ E ele NÃO substitui a passada. Dizer "a imprensa está em dia" é diferente
 *    de dizer "a coleta de hoje está correta": a primeira é esta ferramenta, a
 *    segunda é o `/atualizar-usa`.
 *
 * 📌 É `.mjs` de propósito. O `npm run build` faz type-check de `scripts/`, e um
 *    erro de tipo num script auxiliar trava o deploy de TODAS as faixas, que foi
 *    o que aconteceu em 29/Set com o `calibrar-direcionalidade.ts`.
 */

import { config } from 'dotenv'
import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'
// 🕘 A FRONTEIRA DA DATA CORRENTE É IMPORTADA, NUNCA REESCRITA AQUI.
//
// 🔴 Até 03/Out/2026 este arquivo tinha a conta inline, como
// `>= 19 * 60 + 30`, e o comentário ao lado APONTAVA para este módulo enquanto
// o código o reimplementava. A skill diz, literal, que "o horário sai do
// `vercel.json`, não de constante", e a régua de 29/Set diz que nenhum medidor
// recomputa regra que já tem dona.
//
// 🔑 O que a cópia literal não tinha, e é o que importa: `ultimoCronDoDia`
// devolve `null` para agenda ilegível, e o dono trata null como ADIAR, que é a
// direção que não congela nada. O `19 * 60 + 30` escrito à mão seguiria
// afirmando 19:30Z depois de a agenda mudar, e erraria em SILÊNCIO.
import { FOLGA_MIN, agendaDaRota, ultimoCronDoDia } from '../lib/us-press/data-corrente.mjs'
// 🧭 De quem é cada arquivo modificado. A regra vive fora daqui porque ela
//    decide se dá para publicar, e regra que decide publicação tem teste.
import { FAIXA_EUA, faixaDaLinha, caminhoDoStatus } from '../lib/faixa-do-arquivo.mjs'
import { rotaDoBackup, ROTAS } from '../lib/rota-do-backup.mjs'

const ROTA_IMPRENSA = '/api/cron/refresh-us-press'

/** A fronteira da data corrente, em minutos do dia UTC, lida de onde ela é declarada. */
function fronteiraDaDataCorrente(raizDoProjeto) {
  try {
    const v = JSON.parse(readFileSync(join(raizDoProjeto, 'vercel.json'), 'utf8'))
    const cron = ultimoCronDoDia(agendaDaRota(v, ROTA_IMPRENSA))
    if (!cron) return null
    return { minutos: cron.hora * 60 + cron.minuto + FOLGA_MIN, cron }
  } catch {
    return null
  }
}

const hhmm = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

// 🔑 O DATABASE_URL vive no `.env.local` e NÃO está no ambiente do shell.
config({ path: '.env.local' })
config()

const ROOT = process.cwd()
const hoje = new Date().toISOString().slice(0, 10)
const agora = new Date()

const c = {
  ok: '\x1b[32m',
  mau: '\x1b[31m',
  aviso: '\x1b[33m',
  fim: '\x1b[0m',
}
const linha = (icone, rotulo, texto) => console.log(`   ${icone} ${rotulo.padEnd(14)} ${texto}`)
const pendencias = []
const anota = (txt) => pendencias.push(txt)

const diasEntre = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000)
const sh = (cmd) => {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return null
  }
}

console.log(`\n🇺🇸 ESTADO DA FAIXA · midterms 2026 · ${agora.toISOString().slice(0, 16).replace('T', ' ')}Z  [USO INTERNO]`)
console.log(`   vivo x versionado, artefato por artefato. Leitura pura: nada é escrito.\n`)

// ── 1 · ÁRVORE ────────────────────────────────────────────────────────────
// A regra de uma árvore e dois terminais vale antes de qualquer publicação.
{
  const sujo = sh('git status --short') || ''
  const atras = sh('git rev-list --count HEAD..origin/main')
  const arquivos = sujo.split('\n').filter(Boolean)
  // ⚠️ Arquivo que não é meu na árvore não é problema meu, mas muda o que eu
  //    posso publicar: o `vercel --prod` leva o diretório inteiro.
  //
  // 🔴 A CLASSIFICAÇÃO INVERTEU DE SENTIDO em 04/Out/2026, e a regra saiu daqui
  //    para `lib/faixa-do-arquivo.mjs`, onde ela tem teste.
  //
  //    Antes isto era uma lista do que é da OUTRA faixa, e tudo que não casava
  //    virava MEU. Medido no dia: o terminal do Brasil tinha SETE arquivos em
  //    `hf-assets/` e CINCO saíram rotulados como EUA, porque só os dois de
  //    `tse-registry` continham uma palavra da lista. E o aviso disparou POR
  //    ACIDENTE, só porque dois dos sete casaram: com os outros cinco sozinhos,
  //    o medidor teria dito que a árvore era toda minha.
  //
  // 🔑 Agora a lista é do que é MEU, e o desconhecido cai em FORA. A direção do
  //    erro passa a ser um aviso a mais, nunca uma publicação indevida.
  const meus = arquivos.filter((l) => faixaDaLinha(l) === FAIXA_EUA)
  const fora = arquivos.filter((l) => faixaDaLinha(l) !== FAIXA_EUA)
  if (!arquivos.length) linha('✅', 'árvore', 'limpa')
  else {
    linha(meus.length ? '⚠️' : '·', 'árvore', `${arquivos.length} arquivo(s) modificado(s)`)
    for (const l of meus) console.log(`        ${c.aviso}EUA${c.fim}           ${l.trim()}`)
    for (const l of fora) console.log(`        FORA da faixa  ${l.trim()}`)
    if (fora.length)
      anota(
        `${fora.length} arquivo(s) FORA da faixa US declarada: pode ser de outra faixa ou compartilhado, e o deploy daqui leva tudo junto`,
      )
  }
  if (atras && Number(atras) > 0) {
    linha('🔴', 'remoto', `${atras} commit(s) à frente: dar git pull ANTES de medir qualquer coisa local`)
    anota(`árvore está ${atras} commit(s) atrás do remoto`)
  } else if (atras !== null) linha('✅', 'remoto', 'em dia')
}

// ── 2 · IMPRENSA: o arquivo versionado acompanha os dias? ─────────────────
{
  const dir = join(ROOT, 'public', 'us-press-archive')
  if (!existsSync(dir)) linha('🔴', 'imprensa', 'pasta de arquivo AUSENTE')
  else {
    const datas = readdirSync(dir)
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .map((f) => f.slice(0, 10))
      .sort()
    const ultima = datas.at(-1)
    const atraso = diasEntre(ultima, hoje)
    // ⏳ A data corrente só nasce depois do último cron do dia mais a folga, e
    //    esse horário vem de `vercel.json` pela regra de `data-corrente.mjs`.
    //    Antes dele, não ter o arquivo de HOJE é o comportamento certo.
    //    ⛔ Agenda ilegível conta como janela FECHADA, que é a direção que não
    //    acusa atraso falso, igual ao ADIAR do dono da regra.
    const fronteira = fronteiraDaDataCorrente(ROOT)
    const agoraMin = agora.getUTCHours() * 60 + agora.getUTCMinutes()
    const passouDaJanela = fronteira ? agoraMin >= fronteira.minutos : false
    const esperado = passouDaJanela ? 0 : 1
    if (atraso <= esperado) linha('✅', 'imprensa', `${datas.length} data(s), a mais recente ${ultima}`)
    else {
      linha('🔴', 'imprensa', `${datas.length} data(s), a mais recente ${ultima} · ${atraso} dia(s) de atraso`)
      const faltando = []
      for (let d = 1; d <= atraso - esperado; d++) {
        const dia = new Date(Date.parse(hoje) - (d - (passouDaJanela ? 0 : 1)) * 86400000).toISOString().slice(0, 10)
        if (!datas.includes(dia)) faltando.push(dia)
      }
      if (faltando.length) console.log(`        faltam: ${faltando.join(', ')}`)
      anota(`imprensa ${atraso} dia(s) atrás: rodar node scripts/rodada-us-imprensa.mjs --sem-cron`)
    }
    if (!fronteira) {
      console.log(`        ⚠️ agenda do cron da imprensa ILEGÍVEL em vercel.json: contando a janela como FECHADA`)
    } else if (!passouDaJanela) {
      const faltam = fronteira.minutos - agoraMin
      console.log(
        `        ⏳ data corrente ADIADA por desenho, não é atraso: a janela abre ${hhmm(fronteira.minutos)}Z` +
          ` (último cron ${hhmm(fronteira.cron.hora * 60 + fronteira.cron.minuto)}Z + ${FOLGA_MIN} min de folga),` +
          ` faltam ${Math.floor(faltam / 60)}h${String(faltam % 60).padStart(2, '0')}`
      )
    } else {
      console.log(`        ✅ janela da data corrente ABERTA desde ${hhmm(fronteira.minutos)}Z`)
    }
  }
}

// ── 3 · PESQUISAS: o piso local bate com o que o cron gravou? ────────────
{
  const p = join(ROOT, 'public', 'us-polls-data.json')
  if (!existsSync(p)) linha('🔴', 'pesquisas', 'arquivo AUSENTE')
  else {
    const a = JSON.parse(readFileSync(p, 'utf-8'))
    const m = a.mediaAfos ?? {}
    const atraso = a.lastUpdate ? diasEntre(a.lastUpdate, hoje) : null
    const campo = m.incluidas?.length
      ? m.incluidas.map((x) => x.campoFim).sort().at(-1)
      : null
    const icone = atraso === 0 ? '✅' : atraso === 1 ? '⚠️' : '🔴'
    linha(icone, 'pesquisas', `D+${m.vantagemDem} sobre ${m.nPesquisas} rodadas de ${m.nInstitutos} · ${a.qualidade?.publicadas} publicadas · lastUpdate ${a.lastUpdate}`)
    if (campo) console.log(`        campo mais recente ${campo} · atraso da fonte ${diasEntre(campo, hoje)} dia(s)`)
    if (atraso > 0) anota(`piso das pesquisas é de ${a.lastUpdate}: rodar npm run polls:usa`)
  }
}

// ── 4 · PRODUTOS COM DATA MARCADA ────────────────────────────────────────
// 🔑 A Weekly sai quinta e o Tradeoff segunda. Edição vencida e AUSENTE é o
//    único caso que esta seção reporta: ela não julga conteúdo.
{
  const diaDaSemana = (d) => new Date(d + 'T12:00:00Z').getUTCDay() // 0=dom
  const ultimoDiaDaSemana = (alvo) => {
    const d = new Date(agora)
    while (d.getUTCDay() !== alvo) d.setUTCDate(d.getUTCDate() - 1)
    return d.toISOString().slice(0, 10)
  }
  const produtos = [
    { nome: 'Weekly', dir: join(ROOT, 'public', 'afos-weekly', 'us'), dia: 4, rotulo: 'quinta' },
    { nome: 'Tradeoff', dir: join(ROOT, 'public', 'afos-tradeoff', 'us'), dia: 1, rotulo: 'segunda' },
  ]
  for (const pr of produtos) {
    if (!existsSync(pr.dir)) {
      linha('·', pr.nome, 'pasta ausente')
      continue
    }
    const edicoes = readdirSync(pr.dir)
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
      .map((f) => f.slice(0, 10))
      .sort()
    const ultima = edicoes.at(-1)
    const devida = ultimoDiaDaSemana(pr.dia)
    if (edicoes.includes(devida)) linha('✅', pr.nome, `${edicoes.length} edições, a de ${devida} (${pr.rotulo}) existe`)
    else {
      linha('🔴', pr.nome, `${edicoes.length} edições, a mais recente ${ultima} · a de ${devida} (${pr.rotulo}) NÃO existe`)
      anota(`${pr.nome} de ${devida} não escrita`)
    }
  }
}

// ── 5 · O QUE DEPENDE DO BANCO ───────────────────────────────────────────
// 📌 O cliente é montado AQUI com o adaptador Neon, que é o padrão dos outros
//    `.mjs` da casa. O `lib/db` é TypeScript e `node` puro não o importa, e
//    passar o script para `.ts` só para importá-lo o colocaria no type-check do
//    build, que é o que travou o deploy de todas as faixas em 29/Set.
//
// ⛔ Sem banco NÃO quer dizer que está tudo em ordem: quer dizer que não deu
//    para olhar. A mensagem diz isso com todas as letras, de propósito.
async function comBanco() {
  const url = (process.env.DATABASE_URL || '').replace(/\n$/, '').trim()
  if (!url) {
    linha('⚠️', 'banco', 'DATABASE_URL ausente: o Neon e o mercado NÃO foram olhados, o que não é o mesmo que estarem em ordem')
    return
  }
  const { PrismaClient } = await import('@prisma/client')
  const { PrismaNeon } = await import('@prisma/adapter-neon')
  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: url }) })
  // pesquisas: o registro do cron de hoje
  const reg = await prisma.analysisReport.findFirst({
    where: { slug: { contains: 'us-generic-ballot' } },
    orderBy: { updatedAt: 'desc' },
  })
  if (reg) {
    const d = JSON.parse(reg.bodyMarkdown ?? '{}')
    const m = d.mediaAfos ?? {}
    const local = JSON.parse(readFileSync(join(ROOT, 'public', 'us-polls-data.json'), 'utf-8'))
    const bate = Number(m.vantagemDem) === Number(local.mediaAfos?.vantagemDem) && m.nPesquisas === local.mediaAfos?.nPesquisas
    linha(bate ? '✅' : '🔴', 'neon x piso', `Neon D+${m.vantagemDem} sobre ${m.nPesquisas} (${reg.slug}) · piso D+${local.mediaAfos?.vantagemDem} sobre ${local.mediaAfos?.nPesquisas}`)
    if (!bate) anota('o piso versionado das pesquisas DIVERGE do registro do Neon')
  }
  // 🔴 E O PISO PUBLICADO, que é o terceiro lugar e o que esta ferramenta QUASE
  //    deixou passar na estreia. Em 01/Out ela imprimiu "✅ pesquisas" com o piso
  //    de PRODUÇÃO dois dias atrás (lastUpdate 2026-09-29, D+7.58 sobre 34),
  //    porque comparava vivo contra LOCAL e nunca local contra PUBLICADO.
  //
  // ⚠️ São TRÊS cópias e não duas: Neon (vivo), disco (versionado) e o que o
  //    deploy levou (publicado). O piso só serve para quando o Neon não responde,
  //    e é exatamente aí que ninguém vai estar olhando.
  for (const [rotulo, caminho, ler] of [
    ['piso pesquisas', '/us-polls-data.json', (a) => `lastUpdate ${a.lastUpdate} · D+${a.mediaAfos?.vantagemDem} sobre ${a.mediaAfos?.nPesquisas}`],
    ['piso imprensa', '/us-press-data.json', (a) => `${a.data ?? a.lastUpdate ?? '?'} · ${(a.itens ?? []).length} itens`],
  ]) {
    try {
      const base = process.env.AFOS_BASE || 'https://www.afos-analytics.com'
      const r = await fetch(base + caminho, { signal: AbortSignal.timeout(30000) })
      const pub = await r.json()
      const local = JSON.parse(readFileSync(join(ROOT, 'public', caminho.slice(1)), 'utf-8'))
      const dataPub = pub.lastUpdate ?? pub.data ?? null
      const dataLoc = local.lastUpdate ?? local.data ?? null
      const atraso = dataPub && dataLoc ? diasEntre(dataPub, dataLoc) : null
      linha(atraso === 0 ? '✅' : '🔴', rotulo, `publicado ${ler(pub)}`)
      if (atraso !== 0) {
        console.log(`        local ${ler(local)} · ${atraso} dia(s) à frente do publicado`)
        anota(`${rotulo} em PRODUÇÃO está ${atraso} dia(s) atrás: se o Neon cair, o painel serve isso. Falta deploy`)
      }
    } catch (e) {
      linha('⚠️', rotulo, `não deu para ler o publicado: ${String(e.message).slice(0, 60)}`)
    }
  }

  // mercado: o último ponto gravado
  const ultimo = await prisma.marketPrice.findFirst({ orderBy: { snapshotAt: 'desc' }, select: { snapshotAt: true } })
  if (ultimo) {
    const h = (agora - ultimo.snapshotAt) / 3600000
    linha(h <= 2 ? '✅' : h <= 6 ? '⚠️' : '🔴', 'mercado', `último ponto gravado ${ultimo.snapshotAt.toISOString().slice(0, 16).replace('T', ' ')}Z · ${h.toFixed(1)}h atrás`)
    if (h > 2) anota(`série de mercado com ${h.toFixed(1)}h sem ponto novo: o cron de 30 min pode ter parado`)
  }
  await prisma.$disconnect()
}

await comBanco().catch((e) => linha('⚠️', 'banco', `não deu para olhar: ${String(e.message).slice(0, 80)}`))

// ── 6 · A ESPERA DO DATASET: o backup do dia já chegou? ──────────────────
//
// 🔴 POR QUE EXISTE, medido em 02 e 03/Out/2026. Esta passada tem DUAS travas
// de horário e nada as media: a da imprensa, logo acima, e esta. Nos dois dias
// eu calculei o tempo que faltava À MÃO, e em 02/Out quase subi o dataset antes
// do backup, o que publica as dez séries de mercado um dia atrás.
//
// 🔑 A trava é de DEPENDÊNCIA, não de cautela: o `build-us-2026-dataset.mjs` lê
// `backup/neon/`, e quem escreve ali é o workflow `backup-neon.yml`, que CHEGA
// COMO COMMIT. Então a pergunta "o backup de hoje chegou?" é a pergunta "existe
// commit de hoje tocando backup/neon?".
//
// ⛔ E a resposta tem TRÊS estados, não dois: pode estar aqui, pode estar no
// remoto sem ter sido trazido, e pode não existir. O estado do meio é o que
// engana, porque `--ensaio` leria o backup de ontem e diria +0 com toda a
// confiança. Ver memory/feedback_o_portao_do_hf_confere_contra_staging_e_nao_contra_o_banco.md
//
// 🔴 E O ESTADO DO MEIO SE PARTE EM TRÊS, medido em 06/Out/2026, porque até
// aqui ele mandava dar `git pull` e naquele dia o `git pull` era IMPOSSÍVEL.
//
// A árvore é compartilhada entre dois terminais, e o outro tinha 25 arquivos
// modificados sem commit. O merge aborta antes de começar quando um caminho que
// ele precisa escrever está sujo localmente, então a instrução "dar git pull"
// não era conselho ruim: era conselho INEXECUTÁVEL. ⛔ Medidor que manda fazer
// o que não se pode fazer é pior que medidor calado, porque gasta a confiança
// de quem lê e empurra para a gambiarra.
//
// 🔑 A pergunta "o pull passa?" se responde sem tentar o pull: é a INTERSEÇÃO
// entre os caminhos que os commits de entrada escrevem e os caminhos sujos
// aqui. Interseção vazia, o pull passa; não vazia, ele aborta nela.
//
// ✅ E quando ele não passa, existe saída que NÃO toca no trabalho alheio:
// trazer só `backup/neon` do remoto. Ela é segura por uma razão medida e não
// por otimismo, e é por isso que este bloco a CONFERE antes de sugerir: se
// aquele caminho está limpo aqui, trazer a versão do remoto não pode perder
// trabalho nenhum, por construção. Se estiver sujo, a saída não existe e o
// bloco manda PARAR em vez de entregar um comando que descartaria alteração.
{
  const dataDoBackup = (ref) => {
    const out = sh(`git log -1 --format=%cI ${ref} -- backup/neon`)
    return out ? out.slice(0, 10) : null
  }
  // 📌 O script LÊ o git; quem DECIDE é `lib/rota-do-backup.mjs`, que tem 26
  //    asserções no CI. A primeira versão desta decisão nasceu inline aqui e já
  //    trazia dois defeitos: refazia à mão o recorte de caminho que o
  //    `caminhoDoStatus` já faz testado (e sem tratar o ` -> ` de renomeação), e
  //    usava `startsWith('backup/neon')`, que casa `backup/neonologia/`.
  const base = sh('git merge-base HEAD origin/main')
  const deEntrada = (sh(`git diff --name-only ${base ?? 'HEAD'} origin/main`) ?? '').split('\n').filter(Boolean)
  const sujos = (sh('git status --porcelain') ?? '').split('\n').filter(Boolean).map(caminhoDoStatus).filter(Boolean)
  const local = dataDoBackup('HEAD')
  // 🔑 A árvore BATE com o remoto em backup/neon? É a pergunta do DATASET, que
  //    lê arquivo e não commit.  sai 0 quando não há diferença,
  //    e o  devolve null quando o comando sai != 0, então null aqui é
  //    "difere" e string vazia é "idêntico".
  const bate = sh('git diff --quiet origin/main -- backup/neon && echo igual')
  const { rota, colidem, motivo } = rotaDoBackup({
    local,
    remoto: dataDoBackup('origin/main'),
    hoje,
    deEntrada,
    sujos,
    arvoreBateComRemoto: bate === 'igual' ? true : bate === null ? false : null,
  })

  if (rota === ROTAS.AQUI || rota === ROTAS.AQUI_SEM_COMMIT) {
    linha('✅', 'backup', `o backup de hoje está AQUI (${motivo}): a ETAPA 6.1 pode subir`)
  } else if (rota === ROTAS.INDETERMINADO) {
    linha('⚠️', 'backup', `${motivo}: NÃO subir o dataset às cegas`)
    anota('não deu para olhar o histórico de backup/neon: NÃO subir o dataset')
  } else if (rota === ROTAS.PULL) {
    linha('🔴', 'backup', `o backup de hoje está no REMOTO e não aqui (local: ${local ?? 'nenhum'})`)
    console.log(`        · ${motivo}: dar \`git pull --no-rebase\` ANTES de subir`)
    anota('backup do dia está no remoto: dar git pull ANTES de subir o dataset, senão sobe a série de ontem')
  } else if (rota === ROTAS.SO_BACKUP) {
    linha('🔴', 'backup', `o backup de hoje está no REMOTO e não aqui (local: ${local ?? 'nenhum'})`)
    console.log(`        🔴 o \`git pull\` NÃO passa: ${colidem.length} caminho(s) sujo(s) que o merge precisa escrever`)
    console.log(`           ${colidem.slice(0, 4).join(' · ')}${colidem.length > 4 ? ` · e mais ${colidem.length - 4}` : ''}`)
    console.log(`        ✅ saída que NÃO toca trabalho alheio, porque backup/neon está LIMPO aqui:`)
    console.log(`           git checkout origin/main -- backup/neon/`)
    anota(`backup do dia está no remoto e o git pull NÃO passa (${colidem.length} caminho(s) sujo(s)): trazer só backup/neon com git checkout origin/main -- backup/neon/`)
  } else if (rota === ROTAS.PARAR) {
    linha('🔴', 'backup', `o backup de hoje está no REMOTO e não há saída segura`)
    console.log(`        ${motivo}`)
    console.log(`        ⛔ NÃO subir o dataset: resolver a árvore primeiro`)
    anota('backup do dia está no remoto, o git pull não passa e backup/neon está sujo: NÃO subir o dataset')
  } else {
    // ⏰ A FAIXA É OBSERVAÇÃO, NÃO PROMESSA, e ela já me enganou no dia em que
    //    eu a escrevi. Em 03/Out publiquei "19:43 a 20:59Z" a partir de 4
    //    rodadas, e naquela tarde o backup caiu às 18:28Z, fora dela.
    // 🔑 Quem decide é o COMMIT, nunca o relógio.
    linha('⏳', 'backup', `o backup de hoje ainda não chegou · ${motivo} · faixa observada 18:12 a 20:59Z em 8 rodadas`)
    console.log(`        a ETAPA 6.1 sobe DEPOIS dele: subir antes publica as 10 séries de mercado um dia atrás`)
  }
}

// ── FECHO ────────────────────────────────────────────────────────────────
console.log()
if (!pendencias.length) {
  console.log(`   ${c.ok}✅ nada defasado na faixa.${c.fim} Isto NÃO diz que a coleta de hoje está correta: quem responde isso é a passada.\n`)
} else {
  console.log(`   ${c.mau}🔴 ${pendencias.length} pendência(s):${c.fim}`)
  for (const p of pendencias) console.log(`      · ${p}`)
  console.log()
}
console.log(`   ⛔ Nada foi escrito, commitado nem publicado.\n`)
