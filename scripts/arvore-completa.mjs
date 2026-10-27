#!/usr/bin/env node
/**
 * 🌳 UMA ÁRVORE DESTACADA COM O TRABALHO DAS DUAS FAIXAS, sem tocar nesta.
 *
 * 🔴 POR QUE EXISTE, medido em 08 e 09/Out/2026. Os dois terminais compartilham
 * o repositório, e o outro mantém dezenas de arquivos NÃO COMMITADOS. Efeito: o
 * `git pull` ABORTA, e esta árvore fica sem o `backup/neon` do dia, que já está
 * no remoto. Quem lê o backup passa a medir uma série ENCURTADA:
 *
 *   · em 09/Out a ETAPA 4 do /atualizar-usa deu o topo do contrato de calendário
 *     como 98,40 de 19/Set, a 0,05pp da leitura. Com o backup completo o topo é
 *     98,50 de 07/Out e a distância é 0,15pp, TRÊS VEZES maior.
 *   · e série encurtada só FABRICA superlativo, nunca o esconde.
 *
 * A saída é uma árvore de trabalho DESTACADA em `C:/temp`, com o merge de
 * `origin/main`, pronta para medir, construir, publicar e subir dataset.
 *
 * ⚠️ SOBRE A JUNCTION DO `node_modules`, e isto e uma CORRECAO. Em 09/Out/2026
 * este comentario afirmava que `git worktree remove --force` havia atravessado a
 * junction e apagado o `node_modules` da arvore principal. **Estava errado.** A
 * pasta tinha sido DESIDRATADA pelo OneDrive, que gerencia o projeto inteiro:
 * ReparsePoint 0x9000a01a, e `attrib +P -U` devolveu 561 itens em 15 segundos.
 * Conteudo apagado nao volta com mudanca de atributo.
 *
 * ⛔ `node_modules` vazio aqui: tentar `attrib +P -U` ANTES de `npm install`.
 * O `npm install` conserta sob as duas hipoteses, entao nao distingue nada, e
 * destroi a evidencia que distinguiria.
 * → memory/feedback_o_mesmo_sintoma_tinha_duas_causas_e_a_prova_estava_na_outra_faixa
 *
 * ✅ O `soltarJunction()` abaixo FICA, mas como guarda PREVENTIVA e nao como
 * conserto de incidente: apagar recursivamente um diretorio que contem junction
 * e risco real do Windows, e soltar o link antes custa nada. Ele nao consertou
 * aquilo, porque aquilo nao foi ele.
 *
 * ⛔ O QUE ELE NÃO FAZ, de propósito: não commita, não empurra, não cria ramo,
 * não roda build nem deploy e NÃO TOCA na árvore principal. Orquestração apenas,
 * sem regra própria: toda medição segue nos scripts que rodam lá dentro.
 *
 * 🔑 E A ESCOLHA DO MERGE É DECLARADA, que é o conserto do defeito de 08/Out.
 * Naquele dia usei `-X theirs` e ele comeu, CALADO, duas entradas minhas do
 * README onde os dois lados tinham mexido. Aqui o padrão é merge LIMPO: havendo
 * conflito o script ABORTA o merge, devolve a árvore a HEAD e IMPRIME os
 * caminhos. `--deles` é opt-in e imprime, um a um, o que foi decidido por eles.
 *
 * Uso:
 *   node scripts/arvore-completa.mjs                 # merge limpo, aborta em conflito
 *   node scripts/arvore-completa.mjs --deles         # conflito resolvido por THEIRS, declarado
 *   node scripts/arvore-completa.mjs --sem-merge     # só HEAD, sem trazer o remoto
 *   node scripts/arvore-completa.mjs --remover       # devolve o espaço e sai
 *   node scripts/arvore-completa.mjs --dir=C:/temp/x
 *
 *   node scripts/arvore-completa.mjs --devolver-cache
 *       traz a certificação da trava que rodou LÁ para o `.cache` canônico,
 *       porque o bloco 4 COPIA o cache em vez de ligá-lo, e a árvore morre com
 *       a leitura do dia dentro. Só o prefixo da faixa (`--prefixo=us`), e só
 *       o que é mais novo POR CONTEÚDO. Nunca apaga.
 *
 *       🔴 RODAR ANTES de `--remover` E ANTES de recriar a árvore, medido em
 *       11/Out/2026 usando o próprio atalho. A invocação SEM flag apaga o
 *       diretório (`rmSync`) e copia o cache da árvore principal de volta por
 *       cima, então recriar destrói a certificação do dia tão bem quanto
 *       remover. A ordem certa é: rodar a trava lá, `--devolver-cache`, e só
 *       então recriar ou remover.
 */
import { execFileSync, execSync } from 'node:child_process'
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmdirSync, rmSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, resolve } from 'node:path'
import { daFaixa, decidir, escreve, IDENTICO } from './lib/devolucao-de-cache.mjs'

const args = process.argv.slice(2)
const flag = (n) => args.includes(`--${n}`)
const valor = (n, padrao) => {
  const a = args.find((x) => x.startsWith(`--${n}=`))
  return a ? a.slice(n.length + 3) : padrao
}

const RAIZ = process.cwd()
const DIR = valor('dir', 'C:/temp/afos-arvore-completa')
const sh = (c, cwd = RAIZ) => execSync(c, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
const shq = (c, cwd = RAIZ) => {
  try {
    return { ok: true, saida: sh(c, cwd) }
  } catch (e) {
    return { ok: false, saida: `${e.stdout ?? ''}${e.stderr ?? ''}`.trim() }
  }
}

const linha = (i, t) => console.log(`   ${i} ${t}`)

/**
 * 🚪 Solta a junction do `node_modules` SEM atravessá-la.
 * `rmdirSync` num ponto de reparse do Windows remove o LINK; `rmSync` recursivo
 * e o `git worktree remove --force` descem por ele e apagam o ALVO.
 * ⛔ Chamar isto ANTES de qualquer remoção da árvore. Não é zelo: é o conserto
 * de um estrago medido em 09/Out/2026.
 */
const soltarJunction = (dir) => {
  const nm = join(dir, 'node_modules')
  if (!existsSync(nm)) return false
  try {
    rmdirSync(nm)
    return true
  } catch {
    // Pasta de verdade, ou já solta. Nos dois casos não há porta a fechar.
    return false
  }
}

console.log(`\n🌳 ÁRVORE COMPLETA · ${new Date().toISOString()}`)
console.log('   orquestração apenas: nenhuma medição é feita aqui\n')

// ── remover e sair ──────────────────────────────────────────────────
if (flag('remover')) {
  if (soltarJunction(DIR)) linha('🚪', 'junction do node_modules SOLTA antes de remover a árvore')
  const r = shq(`git worktree remove --force "${DIR}"`)
  shq('git worktree prune')
  linha(r.ok ? '✅' : '⚠️', r.ok ? `removida: ${DIR}` : `nada a remover em ${DIR}`)
  if (existsSync(DIR)) rmSync(DIR, { recursive: true, force: true })
  console.log()
  process.exit(0)
}

// ── devolver a certificação e sair ──────────────────────────────────
/**
 * 🔴 POR QUE EXISTE, medido em 11/Out/2026. O bloco 4 abaixo COPIA o
 * `.cache/capture-guard` para a árvore descartável, em vez de ligá-lo. Isso é
 * deliberado: junction ali seria uma porta para o cache real, e `--remover`
 * apaga recursivamente. O preço é que a trava rodada LÁ grava a certificação
 * do dia só lá, e a árvore morre com ela dentro.
 *
 * Efeito medido: em 10/Out rodei a trava na árvore completa, e o `.cache`
 * canônico ficou com a última certificação dos EUA de 09/Out. Quem lê a série
 * da árvore principal no dia seguinte compara contra uma certificação de dois
 * dias, e a idade sai impressa mas o operador já leu o número.
 *
 * ⛔ AS DUAS TRAVAS, e a segunda é a que importa:
 *   1. só o prefixo da faixa deste terminal (`us-`, `ultima-us.json`), porque
 *      a árvore levou uma CÓPIA do `ultima-br.json` e devolvê-la às cegas
 *      sobrescreveria uma certificação do Brasil MAIS NOVA pela cópia velha.
 *   2. decide por CONTEÚDO (`fetchedAt` de dentro), nunca por mtime: o
 *      `cpSync` reescreve mtime, então todo arquivo da árvore parece mais novo.
 *
 * Ele nunca apaga, e imprime arquivo por arquivo o que decidiu e por quê.
 */
if (flag('devolver-cache')) {
  const prefixo = valor('prefixo', 'us')
  const de = join(DIR, '.cache', 'capture-guard')
  const para = join(RAIZ, '.cache', 'capture-guard')
  // 🔴 ORIGEM IGUAL A DESTINO, medido em 27/Out/2026. `RAIZ` é o diretório de
  //    onde o comando é CHAMADO. Chamado de DENTRO da árvore descartável, `de` e
  //    `para` são a mesma pasta: cada arquivo é comparado consigo mesmo, a
  //    saída diz "60 de 60 idênticos" e NADA volta ao cache canônico. Em 25 e
  //    26/Out foi assim, e as certificações daqueles dias morreram com as
  //    árvores. O controle por sha256 abaixo não pega: arquivo contra ele mesmo
  //    sempre bate. Recusar é a única saída honesta.
  if (resolve(de).toLowerCase() === resolve(para).toLowerCase()) {
    linha('❌', `origem e destino são a MESMA pasta (${resolve(de)}): o comando foi chamado de dentro da árvore descartável`)
    linha('·', `chamar da árvore PRINCIPAL: cd <repo principal> && node <arvore>/scripts/arvore-completa.mjs --dir=${DIR} --devolver-cache`)
    console.log()
    process.exit(1)
  }
  if (!existsSync(de)) {
    linha('⚠️', `a árvore descartável não tem .cache/capture-guard: nada a devolver (${de})`)
    console.log()
    process.exit(0)
  }
  mkdirSync(para, { recursive: true })
  const carimboDe = (caminho) => {
    try {
      const j = JSON.parse(readFileSync(caminho, 'utf8'))
      return j.fetchedAt ?? j.carimbo ?? null
    } catch {
      return null
    }
  }
  const sha = (caminho) => createHash('sha256').update(readFileSync(caminho)).digest('hex')
  // 🔑 A REGRA vive em scripts/lib/devolucao-de-cache.mjs, com 27 asserções no
  //    CI. Aqui só entra a leitura do disco e a escrita, que é o que orquestração
  //    pode fazer. Segunda cópia desta decisão é o defeito que a casa persegue.
  const meus = daFaixa(readdirSync(de), prefixo)
  let trouxe = 0
  let pulou = 0
  for (const nome of meus) {
    const a = join(de, nome)
    const b = join(para, nome)
    const existeCanonico = existsSync(b)
    const { acao, motivo } = decidir({
      existeCanonico,
      shaArvore: sha(a),
      shaCanonico: existeCanonico ? sha(b) : null,
      carimboArvore: carimboDe(a),
      carimboCanonico: existeCanonico ? carimboDe(b) : null,
    })
    if (escreve(acao)) {
      copyFileSync(a, b)
      trouxe++
      linha('⬅️', `${nome}: ${motivo}`)
    } else {
      pulou++
      if (acao !== IDENTICO) linha('⛔', `${nome}: ${motivo}`)
    }
  }
  // 🧪 controle positivo: não basta copiar, tem de bater por hash depois
  let conferidos = 0
  for (const nome of meus) {
    const b = join(para, nome)
    if (existsSync(b) && sha(join(de, nome)) === sha(b)) conferidos++
  }
  console.log()
  linha('📋', `${meus.length} arquivo(s) da faixa "${prefixo}": ${trouxe} trazido(s), ${pulou} pulado(s)`)
  linha(conferidos === meus.length ? '✅' : '⚠️', `${conferidos} de ${meus.length} idênticos por sha256 ao fim`)
  if (conferidos !== meus.length) {
    linha('·', 'quem não bate é o que o canônico tinha mais novo, e isso é o comportamento certo')
  }
  linha('⛔', 'nada foi apagado, e a outra faixa não foi tocada')
  console.log()
  process.exit(0)
}

// ── 1. o remoto, para o merge valer alguma coisa ────────────────────
const f = shq('git fetch origin')
linha(f.ok ? '✅' : '🔴', f.ok ? 'fetch origin' : `fetch FALHOU: ${f.saida.slice(0, 160)}`)
if (!f.ok) {
  console.log('\n   ⛔ sem fetch o merge traria um remoto velho, que é pior que não trazer nada.\n')
  process.exit(1)
}

const head = sh('git rev-parse --short HEAD')
const atras = Number(sh('git rev-list --count HEAD..origin/main') || 0)
const afrente = Number(sh('git rev-list --count origin/main..HEAD') || 0)
linha('·', `HEAD ${head} · ${afrente} commit(s) à frente · ${atras} atrás do remoto`)

// ── 2. a árvore destacada ───────────────────────────────────────────
if (soltarJunction(DIR)) linha('🚪', 'junction do node_modules SOLTA antes de recriar a árvore')
shq(`git worktree remove --force "${DIR}"`)
shq('git worktree prune')
if (existsSync(DIR)) rmSync(DIR, { recursive: true, force: true })
const w = shq(`git worktree add --detach "${DIR}" HEAD`)
if (!w.ok) {
  linha('🔴', `worktree add FALHOU: ${w.saida.slice(0, 200)}`)
  process.exit(1)
}
linha('✅', `árvore destacada em ${DIR}`)

// ── 3. o merge, e a ESCOLHA declarada ───────────────────────────────
let mergeFeito = false
if (!flag('sem-merge') && atras > 0) {
  const ident = '-c user.name=AFOS -c user.email=afos2100@gmail.com'
  const m = shq(`git ${ident} merge --no-edit origin/main`, DIR)
  const conflitados = shq('git diff --name-only --diff-filter=U', DIR).saida.split('\n').filter(Boolean)

  if (m.ok && !conflitados.length) {
    mergeFeito = true
    linha('✅', `merge limpo: HEAD ${head} → ${sh('git rev-parse --short HEAD', DIR)}, 0 conflito`)
  } else if (flag('deles')) {
    // 🔑 Opt-in, e cada arquivo decidido por eles sai NOMEADO. Em 08/Out o
    //    `-X theirs` calado descartou duas entradas minhas do README.
    shq('git merge --abort', DIR)
    const m2 = shq(`git ${ident} merge -X theirs --no-edit origin/main`, DIR)
    const c2 = shq('git diff --name-only --diff-filter=U', DIR).saida.split('\n').filter(Boolean)
    if (!m2.ok || c2.length) {
      linha('🔴', `nem com --deles o merge fechou: ${c2.length} conflito(s)`)
      c2.forEach((p) => linha(' ', `   ${p}`))
      process.exit(1)
    }
    mergeFeito = true
    linha('✅', `merge com --deles: HEAD → ${sh('git rev-parse --short HEAD', DIR)}`)
    linha('⚠️', `${conflitados.length} arquivo(s) foram decididos por ELES, e o seu lado foi descartado NESTA árvore:`)
    conflitados.forEach((p) => linha(' ', `   ${p}`))
    linha('📌', 'o seu lado segue nos commits da árvore principal: isto aqui é descartável.')
  } else {
    shq('git merge --abort', DIR)
    linha('🔴', `merge ABORTADO: ${conflitados.length} conflito(s), e a árvore voltou a HEAD`)
    conflitados.forEach((p) => linha(' ', `   ${p}`))
    linha('📌', 'resolver no repositório, ou repetir com --deles para decidir por eles AQUI, declarado.')
    process.exit(1)
  }
} else if (atras === 0) {
  linha('·', 'nada a trazer: já estamos em dia com o remoto')
} else {
  linha('·', '--sem-merge: a árvore ficou em HEAD, sem o remoto')
}

// ── 4. o que a árvore precisa para RODAR ────────────────────────────
// 🧪 CONTROLE POSITIVO NA ORIGEM, antes de ligar a porta: junction para pasta
//    vazia é indistinguível de junction boa, e pasta vazia é exatamente a
//    assinatura do estrago de 09/Out.
const nmRaiz = join(RAIZ, 'node_modules')
const itensRaiz = existsSync(nmRaiz) ? readdirSync(nmRaiz).length : 0
if (itensRaiz < 50) {
  linha('🔴', `node_modules da árvore PRINCIPAL tem ${itensRaiz} item(ns): ela está VAZIA ou incompleta`)
  linha('⛔', 'não vou ligar junction para pasta vazia. Rodar `npm install` na árvore principal antes.')
  process.exit(1)
}
try {
  execFileSync('cmd', ['/c', 'mklink', '/J', join(DIR, 'node_modules'), nmRaiz], { stdio: 'ignore' })
} catch {
  // silencioso de propósito: quem decide é o controle positivo abaixo, não o
  // código de saída do mklink, que já mentiu nesta casa.
}
// 🧪 E CONTROLE POSITIVO NO DESTINO: o que importa não é o link existir, é um
//    binário real ser alcançável através dele.
const bin = join(DIR, 'node_modules', '.bin')
if (existsSync(bin) && readdirSync(bin).length > 0) {
  linha('✅', `node_modules por junction · ${itensRaiz} pacotes na origem, .bin alcançável`)
} else {
  linha('🔴', 'junction do node_modules NÃO resolve: os scripts não vão rodar lá')
  linha('⛔', 'parando, porque árvore sem dependência produz erro que parece defeito de dado.')
  process.exit(1)
}
for (const peca of ['.env.local', '.vercel']) {
  if (existsSync(join(RAIZ, peca))) {
    cpSync(join(RAIZ, peca), join(DIR, peca), { recursive: true })
    linha('✅', peca)
  } else linha('⚠️', `${peca} não existe aqui, e a árvore vai sem ele`)
}
const cg = join(RAIZ, '.cache', 'capture-guard')
if (existsSync(cg)) {
  mkdirSync(join(DIR, '.cache', 'capture-guard'), { recursive: true })
  cpSync(cg, join(DIR, '.cache', 'capture-guard'), { recursive: true })
  linha('✅', '.cache/capture-guard, para a leitura certificada ser alcançável')
}

// ── 5. a PROVA de que valeu a pena: a data do backup nas duas ───────
const dataBackup = (cwd) => shq('git log -1 --format=%ad --date=short -- backup/neon', cwd).saida || '(nenhuma)'
const aqui = dataBackup(RAIZ)
const la = dataBackup(DIR)
console.log()
linha('📅', `backup/neon · árvore principal: ${aqui} · árvore completa: ${la}`)
if (mergeFeito && la > aqui) linha('⭐', `a árvore completa tem ${la}, que a principal NÃO tem: medir a série LÁ`)
else if (la === aqui) linha('·', 'as duas veem o mesmo backup: medir aqui dá no mesmo')

console.log(`\n   cd ${DIR}\n`)
console.log('   ⛔ nada foi commitado, empurrado nem publicado. A árvore é DESCARTÁVEL,\n   mas NÃO a remova com `git worktree remove` direto: a junction é uma porta\n   para o node_modules real. Remover SEMPRE por aqui:')
console.log(`   node scripts/arvore-completa.mjs --remover\n`)
