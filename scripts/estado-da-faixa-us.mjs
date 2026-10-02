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
  // ⚠️ Arquivo de OUTRA faixa na árvore não é problema meu, mas muda o que eu
  //    posso publicar: o `vercel --prod` leva o diretório inteiro.
  // 📌 `wayback` entrou em 02/Out: ele roda ANTES da daily, que é do Brasil, e
  //    na estreia saía rotulado como EUA. O rótulo errado aqui é barato mas
  //    engana sobre de quem é a árvore, que é o que decide se dá para publicar.
  const outros = arquivos.filter((l) => /tse|brz|analysis-|afos-daily|wayback|polls-data\.json|polls-data\.(en|es)/.test(l))
  const meus = arquivos.filter((l) => !outros.includes(l))
  if (!arquivos.length) linha('✅', 'árvore', 'limpa')
  else {
    linha(meus.length ? '⚠️' : '·', 'árvore', `${arquivos.length} arquivo(s) modificado(s)`)
    for (const l of meus) console.log(`        ${c.aviso}EUA${c.fim}    ${l.trim()}`)
    for (const l of outros) console.log(`        outra faixa  ${l.trim()}`)
    if (outros.length) anota('árvore tem arquivo de OUTRA faixa: deploy daqui levaria o trabalho dela junto')
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
    // ⏳ A data corrente só nasce depois do último cron do dia mais 10 min, que
    //    é 19:30Z. Antes disso, não ter o arquivo de HOJE é o comportamento
    //    certo e não defasagem. Ver lib/us-press/data-corrente.mjs.
    const passouDaJanela = agora.getUTCHours() * 60 + agora.getUTCMinutes() >= 19 * 60 + 30
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
    if (!passouDaJanela) console.log(`        ⏳ antes das 19:30Z a data corrente é ADIADA por desenho, não é atraso`)
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
