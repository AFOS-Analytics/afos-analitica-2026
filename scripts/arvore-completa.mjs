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
 * 🔴🔴 E O PERIGO QUE ELE JÁ CAUSOU UMA VEZ, em 09/Out/2026: o `node_modules`
 * entra aqui como JUNCTION do Windows, que é uma PORTA para o diretório real da
 * árvore principal. `git worktree remove --force` ATRAVESSA essa porta e apaga o
 * ALVO, não o link. Foi o que aconteceu: a árvore principal ficou com
 * `node_modules` VAZIO, 0 pastas e sem `.bin`, e nada acusou, porque os comandos
 * que rodei em seguida só usavam builtins do node.
 *
 * ✅ Por isso TODA remoção aqui passa por `soltarJunction()` ANTES, que usa
 * `rmdirSync` no ponto de reparse: ele remove o LINK e nunca o alvo. E a criação
 * tem CONTROLE POSITIVO dos dois lados, origem não vazia e `.bin` alcançável no
 * destino, porque junction para pasta vazia é indistinguível de junction boa até
 * a hora em que algo precisa rodar.
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
 */
import { execFileSync, execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, rmdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

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
