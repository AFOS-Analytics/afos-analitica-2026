/**
 * Traduz os JSONs editoriais do dashboard para EN e ES.
 *
 * POR QUE EXISTE
 * Até 24/Jul/2026 o /en/dashboard e o /es/dashboard renderizavam a análise
 * inteira em português: os 3 JSONs eram únicos e servidos aos três idiomas.
 * O leitor internacional via a moldura traduzida e o conteúdo não.
 *
 * REGRA NÃO NEGOCIÁVEL
 * A tradução NUNCA pode alterar um número. O gate compara o multiconjunto de
 * valores com unidade (%, pp, USD) de cada string. Divergiu, o arquivo do
 * locale NÃO é escrito e o dashboard cai para pt-BR (ver readLocalized em
 * lib/dashboard/static-data.ts). Melhor servir português do que publicar
 * número traduzido errado: tradução é a maior fonte de defeito do pipeline.
 *
 * USO
 *   npx tsx scripts/translate-dashboard-json.ts            # en e es
 *   npx tsx scripts/translate-dashboard-json.ts en         # só um locale
 *   npx tsx scripts/translate-dashboard-json.ts --dry-run  # não escreve
 */
import { config as dotenv } from 'dotenv'
dotenv({ path: '.env.local' })

import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs'
import { join } from 'path'
import { translate, falhaDeConta } from '../lib/ai/translate'
import { loadGlossary } from '../lib/glossary/loader'
import { compararNumeros } from './lib/json-number-gate'

/** Falha de conta (saldo, chave, permissão) aborta a rodada: repetir não muda nada. */
class FalhaDeConta extends Error {}

const ROOT = process.cwd()
const ARQUIVOS = (process.env.SO_ARQUIVO ? [process.env.SO_ARQUIVO] : ['analysis-data.json', 'analysis-criteriosa.json', 'polls-data.json'])
const LOCALES = ['en', 'es'] as const
type Locale = typeof LOCALES[number]

/** Chaves cujo valor é identificador ou dado bruto: nunca traduzir. */
const CHAVES_LITERAIS = new Set([
  'name', 'n', 'institute', 'register', 'protocolo', 'source', 'sources', 'date',
  'fieldDates', 'lastUpdate', 'updatedAt', 'polymarket', 'pc', 'mc', 'color',
  'party', 'candidate', 'candidate1', 'candidate2', 'matchup', 'rank', 'slug',
])

/**
 * Chaves de EXIBIÇÃO: valor curto, mas que aparece na tela e mistura número com
 * palavra. Traduz SEMPRE, ignorando o filtro `ehTextoEditorial`.
 *
 * Existe por causa do `m` do quadroComparativo, renderizado em PollsSection
 * como "Polymarket: {r.m}". O valor é "61.50% (vol USD 7,63M acumulado)":
 *   1. "acumulado" é português e apareceria cru no /en/dashboard;
 *   2. pior, "7,63M" com vírgula seria lido pelo gate em convenção inglesa
 *      como 763 milhões, divergindo dos 7,63 milhões do português. O arquivo
 *      EN inteiro seria DESCARTADO e o dashboard cairia para pt-BR.
 * O filtro editorial sozinho não pegava: a string tem só uma palavra de 4+
 * letras e era rejeitada como "não é texto".
 *
 * `method`, `type`, `note` e `pesquisaRange` entraram pelo mesmo motivo, em
 * 25/Jul: são rótulos de tela CURTOS ("Presencial", "Telefônica (CATI)",
 * "Misto", "sem dados nacionais", "Metodologia digital.") e o piso de 25
 * caracteres do filtro os deixava em português no /en/dashboard. Valor sem
 * nada a traduzir, como "38-46%", volta idêntico e o gate deixa passar.
 */
const CHAVES_DISPLAY = new Set(['m', 'method', 'type', 'note', 'pesquisaRange'])

/**
 * Vale a pena traduzir? Exige texto de verdade, não rótulo nem número formatado.
 * "61.50% (vol USD 7,63M)" fica de fora; "SOBE 1,00pp para 61,50%..." entra.
 */
function ehTextoEditorial(s: string): boolean {
  if (s.length < 25) return false
  const palavras = s.match(/[A-Za-zÀ-ÿ]{4,}/g) ?? []
  return palavras.length >= 3
}

interface Item { caminho: string; texto: string }

function coletar(obj: unknown, caminho = '', out: Item[] = []): Item[] {
  if (typeof obj === 'string') {
    if (ehTextoEditorial(obj)) out.push({ caminho, texto: obj })
    return out
  }
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => coletar(v, `${caminho}[${i}]`, out))
    return out
  }
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (CHAVES_LITERAIS.has(k) && typeof v === 'string') continue
      if (CHAVES_DISPLAY.has(k) && typeof v === 'string') {
        out.push({ caminho: caminho ? `${caminho}.${k}` : k, texto: v })
        continue
      }
      coletar(v, caminho ? `${caminho}.${k}` : k, out)
    }
  }
  return out
}

function aplicar(obj: unknown, mapa: Map<string, string>, caminho = ''): unknown {
  if (typeof obj === 'string') return mapa.get(caminho) ?? obj
  if (Array.isArray(obj)) return obj.map((v, i) => aplicar(v, mapa, `${caminho}[${i}]`))
  if (obj && typeof obj === 'object') {
    const saida: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      saida[k] = (CHAVES_LITERAIS.has(k) && typeof v === 'string')
        ? v
        : aplicar(v, mapa, caminho ? `${caminho}.${k}` : k)
    }
    return saida
  }
  return obj
}

/**
 * Traduz CAMPO A CAMPO, com concorrência limitada.
 *
 * A primeira versão mandava lotes separados por marcador e remontava pela
 * ordem. Falhou na primeira execução real: o modelo devolveu 10 blocos para 12
 * enviados, o que desalinharia texto e campo silenciosamente. Um campo com o
 * texto de outro é pior que campo não traduzido, então o lote saiu.
 *
 * Campo a campo não tem esse modo de falha: cada resposta pertence, por
 * construção, ao campo que a originou.
 */
async function traduzirCampos(itens: Item[], locale: Locale, concorrencia = 3): Promise<Map<string, string>> {
  // Glossário INTEIRO, como o Daily faz (translate-afos-daily-chunked.ts).
  // Termo brasileiro sem tradução fica em português e vira link para o verbete.
  // Sem isto o script apagaria os links a cada /atualizar.
  const glossaryEntries = loadGlossary().map(e => ({ term: e.term, id: e.id }))
  const mapa = new Map<string, string>()
  let feitos = 0
  let erro: Error | null = null

  const fila = [...itens]
  const trabalhador = async () => {
    while (fila.length && !erro) {
      const item = fila.shift()!
      try {
        const r = await translate({
          sourceText: item.texto,
          sourceLocale: 'pt-BR',
          targetLocale: locale,
          // 'editorial' e não 'afos-daily': aqui não há frontmatter nem chunking
          // de markdown, é prosa de análise. O glossário vale nos dois.
          type: 'editorial',
          glossaryEntries,
        })
        const txt = r.translatedText.trim()
        if (!txt) throw new Error(`campo ${item.caminho} voltou vazio`)
        mapa.set(item.caminho, txt)
      } catch (e) {
        erro = falhaDeConta(e)
          ? new FalhaDeConta(e instanceof Error ? e.message : String(e))
          : (e instanceof Error ? e : new Error(String(e)))
        return
      }
      feitos++
      if (feitos % 10 === 0 || feitos === itens.length) {
        process.stdout.write(`    ${feitos}/${itens.length}\n`)
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concorrencia, itens.length) }, trabalhador))
  if (erro) throw erro
  return mapa
}

async function processar(arquivo: string, locale: Locale, dryRun: boolean): Promise<boolean> {
  const origem = join(ROOT, 'public', arquivo)
  const destino = join(ROOT, 'public', arquivo.replace(/\.json$/, `.${locale}.json`))
  const original = JSON.parse(readFileSync(origem, 'utf-8'))

  const itens = coletar(original)
  console.log(`  ${arquivo} -> ${locale}: ${itens.length} textos`)

  let traduzido: unknown
  try {
    const mapa = await traduzirCampos(itens, locale)
    traduzido = aplicar(original, mapa)
  } catch (err) {
    console.error(`  DESCARTADO: ${err instanceof Error ? err.message : String(err)}`)
    if (existsSync(destino) && !dryRun) { unlinkSync(destino); console.error(`  removido ${destino} (evita servir tradução velha)`) }
    if (err instanceof FalhaDeConta) throw err   // não adianta tentar o próximo arquivo
    return false
  }

  // GATE: nenhum número pode ter mudado.
  const divs = compararNumeros(original, traduzido, locale)
  if (divs.length > 0) {
    console.error(`  DESCARTADO: ${divs.length} divergência(s) numérica(s). O locale servirá pt-BR.`)
    divs.slice(0, 5).forEach(d => {
      console.error(`    ${d.caminho}`)
      console.error(`      pt : [${d.original.join(', ')}]  "${d.trechoOriginal}"`)
      console.error(`      ${locale} : [${d.traduzido.join(', ')}]  "${d.trechoTraduzido}"`)
    })
    if (divs.length > 5) console.error(`    ... e mais ${divs.length - 5}`)
    if (existsSync(destino) && !dryRun) { unlinkSync(destino); console.error(`  removido ${destino}`) }
    return false
  }

  if (dryRun) { console.log(`  OK (dry-run, não escrito)`); return true }
  writeFileSync(destino, JSON.stringify(traduzido, null, 2) + '\n', 'utf-8')
  console.log(`  OK -> ${arquivo.replace(/\.json$/, `.${locale}.json`)}`)
  return true
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const alvos = (args.filter(a => LOCALES.includes(a as Locale)) as Locale[])
  const locales = alvos.length ? alvos : [...LOCALES]

  let falhas = 0
  let abortada: FalhaDeConta | null = null
  fora:
  for (const locale of locales) {
    console.log(`\n=== ${locale.toUpperCase()} ===`)
    for (const arquivo of ARQUIVOS) {
      try {
        const ok = await processar(arquivo, locale, dryRun)
        if (!ok) falhas++
      } catch (err) {
        if (err instanceof FalhaDeConta) { abortada = err; falhas++; break fora }
        throw err
      }
    }
  }

  console.log('')
  if (abortada) {
    console.log('RODADA ABORTADA por falha de CONTA, não de tradução:')
    console.log(`  ${abortada.message}`)
    console.log('Os locales restantes nem foram tentados: o resultado seria o mesmo erro.')
    console.log('Enquanto o saldo não voltar, /en/dashboard e /es/dashboard servem pt-BR.')
  }

  if (falhas === 0) {
    console.log('Todas as traduções passaram no gate numérico.')
  } else if (!abortada) {
    console.log(`${falhas} arquivo(s) descartado(s). Esses locales servirão pt-BR, que é o comportamento desejado.`)
  }
  // Descarte NÃO é falha do pipeline: o fallback para pt-BR é a decisão de projeto.
  process.exit(0)
}

main().catch(err => {
  console.error('translate-dashboard-json falhou:', err instanceof Error ? err.message : err)
  process.exit(1)
})
