/**
 * preparar-traducao.ts — arma o par da memória de tradução antes de traduzir.
 *
 * Uso:
 *   npx tsx scripts/preparar-traducao.ts               # confere e prepara a partir do HEAD
 *   npx tsx scripts/preparar-traducao.ts --check       # só confere, não escreve
 *   npx tsx scripts/preparar-traducao.ts --ref=9b2f177 # a partir de OUTRA publicação
 *
 * 🔴 O `--ref` existe porque HEAD NEM SEMPRE É A PUBLICAÇÃO CERTA, e a primeira
 * versão deste script errava o conselho por supor que era. Em 04/Set/2026 o pt-BR
 * tinha avançado duas rodadas (a daily reescreveu os JSONs) enquanto os
 * `.en/.es` no disco ainda eram de uma publicação anterior. O par não fechava, o
 * script acusou certo e mandou "restaurar o .en.json do HEAD", o que não conserta
 * nada: o .en.json do HEAD JÁ ERA aquele. O conserto certo é o inverso, apontar o
 * `tmp-head` para o commit cujo pt-BR casa com as traduções que estão no disco.
 *
 * 🔑 A regra: `--ref` é o ÚLTIMO commit que tocou os arquivos `.en/.es`. Achar com
 *   git log -1 --format=%h -- public/polls-data.en.json
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
const REF = process.argv.find((a) => a.startsWith('--ref='))?.slice(6) ?? 'HEAD'
let falhas = 0

function doRef(caminho: string): string {
  return execFileSync('git', ['show', `${REF}:${caminho}`], { encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024 })
}

/** O último commit que tocou o arquivo. É ele o `--ref` certo quando o par não fecha. */
function ultimoCommitDe(caminho: string): string {
  try {
    return execFileSync('git', ['log', '-1', '--format=%h %s', '--', caminho], { encoding: 'utf-8' }).trim().slice(0, 72)
  } catch {
    return '(desconhecido)'
  }
}

/** Conta os caminhos de string, que é a unidade que a memória casa. */
function formaDe(o: unknown, p = '', saida: string[] = []): string[] {
  if (typeof o === 'string') saida.push(p)
  else if (o && typeof o === 'object') for (const k of Object.keys(o as object)) formaDe((o as any)[k], `${p}.${k}`, saida)
  return saida
}

function main() {
  if (!existsSync(DESTINO)) mkdirSync(DESTINO, { recursive: true })
  console.log(`\n🧷 Preparando o par da memória de tradução a partir de ${REF}${somenteConferir ? ' (só conferindo)' : ''}.\n`)

  for (const arq of ARQUIVOS) {
    const bruto = doRef(`public/${arq}.json`)
    const head = JSON.parse(bruto)
    const atual = JSON.parse(readFileSync(`public/${arq}.json`, 'utf-8'))

    if (!somenteConferir) writeFileSync(join(DESTINO, `${arq}.json`), bruto, 'utf-8')

    const carimboHead = head.updatedAt ?? head.lastUpdate ?? '?'
    const carimboAtual = atual.updatedAt ?? atual.lastUpdate ?? '?'
    console.log(`📄 ${arq}`)
    console.log(`   ${REF} (a publicação de referência): ${carimboHead}`)
    console.log(`   disco (a rodada em curso)          : ${carimboAtual}`)

    // 🔑 A conferência que importa: a FORMA da referência tem de bater com a forma
    // dos arquivos de idioma no disco. É esse par que a memória casa por caminho.
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
        console.log(`   ✅ ${loc}: mesma forma de ${REF}, o par fecha.`)
      } else {
        const a = new Set(formaDe(head))
        const b = new Set(formaDe(trad))
        const soHead = [...a].filter((x) => !b.has(x))
        const soTrad = [...b].filter((x) => !a.has(x))
        console.log(`   ❌ ${loc}: FORMA DIFERENTE de ${REF}. A memória casaria caminho com caminho errado.`)
        if (soHead.length) console.log(`        só em ${REF} (${soHead.length}): ${soHead.slice(0, 5).join(', ')}`)
        if (soTrad.length) console.log(`        só no ${loc} (${soTrad.length}): ${soTrad.slice(0, 5).join(', ')}`)
        // ⚠️ O conserto quase nunca é mexer no arquivo de idioma. Se o pt-BR avançou
        // uma rodada e as traduções não, a referência é que está errada: ela tem de
        // ser o commit em que aquelas traduções foram escritas.
        console.log(`        o ${loc} no disco foi escrito em: ${ultimoCommitDe(p)}`)
        console.log(`        conserto provável: repetir com --ref=<esse commit>, e NÃO restaurar o ${loc}.`)
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
