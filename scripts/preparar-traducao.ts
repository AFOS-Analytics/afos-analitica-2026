/**
 * preparar-traducao.ts — arma o par da memória de tradução antes de traduzir.
 *
 * Uso:
 *   npx tsx scripts/preparar-traducao.ts          # confere e prepara
 *   npx tsx scripts/preparar-traducao.ts --check  # só confere, não escreve
 *
 * 🔴 POR QUE ISTO EXISTE. O `build-locale-json` monta a memória de tradução
 * casando, NO MESMO CAMINHO, o texto pt-BR de `scripts/tmp-head/<arq>.json` com
 * a tradução de `public/<arq>.<locale>.json`. Os dois PRECISAM vir da MESMA
 * publicação. Se não vierem, os caminhos não alinham e a memória associa a
 * tradução de um campo ao texto de outro, EM SILÊNCIO: o arquivo é escrito, o
 * gate numérico passa, e o leitor de inglês recebe a frase errada no lugar
 * certo. O próprio `build-locale-json` documenta a armadilha e não a impede.
 *
 * A armadilha morde em dois momentos previsíveis, e os dois já aconteceram
 * nesta casa em 03/Set/2026:
 *   1. Rodar `construir` DUAS VEZES no mesmo dia. Na segunda, `public/*.en.json`
 *      já tem a estrutura nova e o `tmp-head` continua com a antiga.
 *   2. Uma SEGUNDA rodada no mesmo dia, depois de a primeira já ter sido
 *      commitada. Aí o `tmp-head` de manhã está velho e o HEAD é o certo.
 *
 * ✅ O CONSERTO É SEMPRE O MESMO: `tmp-head` sai do HEAD do git, que é a última
 * publicação fechada, e os `.<locale>.json` no disco têm de ser dessa mesma
 * publicação. Este script faz isso e RECUSA quando o par não fecha.
 *
 * ⛔ Não traduz nada e não toca em `public/`. Só prepara e confere.
 */
import { execFileSync } from 'child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const ARQUIVOS = ['analysis-data', 'analysis-criteriosa', 'polls-data'] as const
const DESTINO = 'scripts/tmp-head'
const LOCALES = ['en', 'es'] as const

const somenteConferir = process.argv.includes('--check')
let falhas = 0

function doHead(caminho: string): string {
  return execFileSync('git', ['show', `HEAD:${caminho}`], { encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024 })
}

/** Conta os caminhos de string, que é a unidade que a memória casa. */
function formaDe(o: unknown, p = '', saida: string[] = []): string[] {
  if (typeof o === 'string') saida.push(p)
  else if (o && typeof o === 'object') for (const k of Object.keys(o as object)) formaDe((o as any)[k], `${p}.${k}`, saida)
  return saida
}

function main() {
  if (!existsSync(DESTINO)) mkdirSync(DESTINO, { recursive: true })
  console.log(`\n🧷 Preparando o par da memória de tradução${somenteConferir ? ' (só conferindo)' : ''}.\n`)

  for (const arq of ARQUIVOS) {
    const bruto = doHead(`public/${arq}.json`)
    const head = JSON.parse(bruto)
    const atual = JSON.parse(readFileSync(`public/${arq}.json`, 'utf-8'))

    if (!somenteConferir) writeFileSync(join(DESTINO, `${arq}.json`), bruto, 'utf-8')

    const carimboHead = head.updatedAt ?? head.lastUpdate ?? '?'
    const carimboAtual = atual.updatedAt ?? atual.lastUpdate ?? '?'
    console.log(`📄 ${arq}`)
    console.log(`   HEAD (a publicação fechada): ${carimboHead}`)
    console.log(`   disco (a rodada em curso)  : ${carimboAtual}`)

    // 🔑 A conferência que importa: a FORMA do HEAD tem de bater com a forma dos
    // arquivos de idioma no disco. É esse par que a memória casa por caminho.
    const formaHead = formaDe(head).sort().join('\n')
    for (const loc of LOCALES) {
      const p = `public/${arq}.${loc}.json`
      if (!existsSync(p)) {
        console.log(`   ⚠️  ${loc}: arquivo ausente. Todo campo vai precisar de mapa, e isso é esperado num primeiro build.`)
        continue
      }
      const trad = JSON.parse(readFileSync(p, 'utf-8'))
      const formaTrad = formaDe(trad).sort().join('\n')
      if (formaHead === formaTrad) {
        console.log(`   ✅ ${loc}: mesma forma do HEAD, o par fecha.`)
      } else {
        const a = new Set(formaDe(head))
        const b = new Set(formaDe(trad))
        const soHead = [...a].filter((x) => !b.has(x))
        const soTrad = [...b].filter((x) => !a.has(x))
        console.log(`   ❌ ${loc}: FORMA DIFERENTE do HEAD. A memória casaria caminho com caminho errado.`)
        if (soHead.length) console.log(`        só no HEAD (${soHead.length}): ${soHead.slice(0, 5).join(', ')}`)
        if (soTrad.length) console.log(`        só no ${loc} (${soTrad.length}): ${soTrad.slice(0, 5).join(', ')}`)
        console.log(`        conserto: restaurar ${p} da mesma publicação do HEAD, com`)
        console.log(`        git checkout HEAD -- ${p}`)
        falhas++
      }
    }
    console.log('')
  }

  if (falhas > 0) {
    console.log(`❌ ${falhas} par(es) não fecham. NÃO traduzir antes de resolver: o defeito seria silencioso.`)
    process.exit(1)
  }
  console.log('✅ Par armado. O que mudou desde o HEAD é o que vai pedir mapa:')
  console.log('   npx tsx scripts/locale-probe.ts')
}

main()
