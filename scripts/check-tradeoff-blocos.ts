/**
 * check-tradeoff-blocos.ts — portão de integridade das edições do Tradeoff.
 *
 * 🔴 POR QUE ESTE ARQUIVO EXISTE, e ele nasce de DOIS incidentes, não de um.
 *
 * O loader do Tradeoff coage o frontmatter, e a coerção falha CALADA de três
 * formas distintas. A régua da casa cobria duas delas, e o portão manual que
 * existia contava blocos. A terceira forma passou por baixo dele.
 *
 *   1. campo OBRIGATÓRIO com nome errado  → o `.filter()` DESCARTA a linha
 *      Aparece como seção menor ou vazia. A contagem de blocos pega.
 *
 *   2. ENUM com valor inválido            → o coercer CAI PARA O PADRÃO
 *      Em 23/Ago/2026 se descobriu que `type: contrarian` não existe, cai para
 *      `base`, e as edições №8 a №13 do Brasil saíram com o cenário CONTRÁRIO
 *      AO PRICING pintado com a cor do cenário BASE, seis vezes seguidas. A
 *      seção tem o tamanho certo e o rótulo certo; só a cor muda.
 *
 *   3. campo ESCALAR com nome errado      → o campo simplesmente SOME
 *      🔴 Descoberto em 30/Ago/2026 na Edição №15: o callout do bloco de
 *      liquidez foi escrito em `anomaly` e o loader lê `anomalyText`. O texto
 *      inteiro do achado desapareceria da página, sem erro e sem log.
 *
 *      ⚠️ E o portão que existia NÃO pegaria, porque ele conta o tamanho de
 *      ARRAY, e nenhum array encolhe quando um campo de texto some. Foi ler a
 *      edição anterior e comparar campo a campo que levantou a suspeita.
 *
 * ✅ Este script cobre as TRÊS formas, comparando o arquivo com o que o loader
 * de fato devolveu: contagem de bloco, valor de enum, e presença de cada campo
 * de TEXTO caminho a caminho.
 *
 * 📌 O corte de 40 caracteres separa texto editorial de rótulo curto, cor e
 * enum, que têm regra própria e já são cobertos pelo teste de enum.
 *
 * Uso:
 *   npx tsx scripts/check-tradeoff-blocos.ts                 # todas as edições, br e us
 *   npx tsx scripts/check-tradeoff-blocos.ts 2026-08-31      # uma data
 *   npx tsx scripts/check-tradeoff-blocos.ts 2026-08-31 us   # uma data de outro país
 *
 * Sai com 1 se qualquer edição reprovar.
 */
import { readdirSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { loadTradeoff } from '../lib/afos-tradeoff/loader'

const RAIZ = join(process.cwd(), 'public', 'afos-tradeoff')
const LOCALES = ['pt-BR', 'en', 'es']
const TIPOS_VALIDOS = ['base', 'bear', 'tail']
const DIRECOES_VALIDAS = ['up', 'down', 'flat']
/** Texto curto é rótulo, cor ou enum, e tem régua própria. */
const MINIMO_TEXTO = 40

const pastaDoPais = (pais: string) => (pais === 'br' ? RAIZ : join(RAIZ, pais))
const arquivoDe = (pais: string, data: string, loc: string) =>
  join(pastaDoPais(pais), loc === 'pt-BR' ? `${data}.md` : `${data}.${loc}.md`)

/** Caminhos de toda string EDITORIAL do objeto, recursivo. */
function caminhosDeTexto(o: unknown, pre = '', acc: string[] = []): string[] {
  if (o == null || typeof o !== 'object') return acc
  for (const [k, v] of Object.entries(o as Record<string, unknown>)) {
    const p = pre ? `${pre}.${k}` : k
    if (typeof v === 'string') { if (v.length > MINIMO_TEXTO) acc.push(p) }
    else if (Array.isArray(v)) v.forEach((x, i) => caminhosDeTexto(x, `${p}.${i}`, acc))
    else if (v && typeof v === 'object') caminhosDeTexto(v, p, acc)
  }
  return acc
}
const pega = (o: unknown, cam: string): unknown =>
  cam.split('.').reduce<unknown>((x, k) => (x == null ? x : (x as Record<string, unknown>)[k]), o)

const contagem = (o: any) =>
  `cards=${o?.summaryCards?.length ?? 0} cenarios=${o?.scenarios?.length ?? 0} grade=${o?.indicatorGrid?.length ?? 0} ` +
  `watch=${o?.watchList?.length ?? 0} calendario=${o?.calendar?.length ?? 0} liquidez=${o?.liquidity?.rows?.length ?? 0} ` +
  `leituras=${o?.additionalReading?.items?.length ?? 0}`

function conferir(pais: string, data: string): string[] {
  const problemas: string[] = []
  for (const loc of LOCALES) {
    const arq = arquivoDe(pais, data, loc)
    if (!existsSync(arq)) continue
    const cru: any = matter(readFileSync(arq, 'utf8')).data
    const carregado: any = loadTradeoff(data, loc, pais)
    if (!carregado) { problemas.push(`${loc}: loader devolveu null`); continue }

    // 1. bloco descartado pelo filter
    if (contagem(cru) !== contagem(carregado)) {
      problemas.push(`${loc}: BLOCO DESCARTADO\n        arquivo: ${contagem(cru)}\n        loader : ${contagem(carregado)}`)
    }
    // 2. enum coagido
    const tipos = (carregado.scenarios ?? []).map((s: any) => s.type)
    const tiposMaus = tipos.filter((x: string) => !TIPOS_VALIDOS.includes(x))
    if (tiposMaus.length) problemas.push(`${loc}: scenarios[].type invalido: ${tiposMaus.join(',')}`)
    const crusTipos = (cru.scenarios ?? []).map((s: any) => s.type)
    const coagidos = crusTipos.filter((x: string) => x && !TIPOS_VALIDOS.includes(x))
    if (coagidos.length) problemas.push(`${loc}: ENUM COAGIDO no arquivo, valor inexistente: ${coagidos.join(',')}`)
    const dirs = [...(carregado.summaryCards ?? []), ...(carregado.indicatorGrid ?? [])].map((x: any) => x.deltaDirection)
    const dirsMaus = dirs.filter((x: string) => x && !DIRECOES_VALIDAS.includes(x))
    if (dirsMaus.length) problemas.push(`${loc}: deltaDirection invalido: ${dirsMaus.join(',')}`)

    // 3. campo ESCALAR de texto que o loader nao consumiu
    const perdidos = caminhosDeTexto(cru).filter((c) => pega(carregado, c) == null)
    if (perdidos.length) problemas.push(`${loc}: CAMPO DE TEXTO IGNORADO PELO LOADER: ${perdidos.join(', ')}`)
  }
  return problemas
}

const [dataArg, paisArg] = process.argv.slice(2)
const paises = paisArg ? [paisArg] : ['br', 'us']
let falhas = 0
let conferidas = 0

for (const pais of paises) {
  const pasta = pastaDoPais(pais)
  if (!existsSync(pasta)) continue
  const datas = dataArg
    ? [dataArg]
    : [...new Set(readdirSync(pasta).filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f)).map((f) => f.slice(0, 10)))].sort()
  for (const d of datas) {
    if (!existsSync(arquivoDe(pais, d, 'pt-BR'))) continue
    conferidas++
    const p = conferir(pais, d)
    if (p.length) { falhas++; console.log(`  ❌ ${pais}/${d}`); p.forEach((x) => console.log(`      ${x}`)) }
  }
}

console.log(
  falhas
    ? `\n❌ check-tradeoff-blocos: ${falhas} de ${conferidas} edicao(oes) com problema.`
    : `\n✅ check-tradeoff-blocos: ${conferidas} edicao(oes) integras. Nenhum bloco descartado, nenhum enum coagido, nenhum campo de texto perdido.`,
)
process.exit(falhas ? 1 : 0)
