/**
 * reconcile-claims.ts — confronta % numericas no markdown da AFOS Daily
 * com os JSONs autoritativos (analysis-data.json, analysis-criteriosa.json).
 *
 * Origem: Fase 2.2 do guardrail. Cobre tres categorias de erro identificadas
 * no EVAL pos-incidente Vorcaro:
 *   #2 erros numericos (typo de %, transposicao, calculo errado de delta)
 *   #3 polling transposition (instituto X com numero de instituto Y)
 *   #4 polymarket misreading (mercado errado, candidato errado)
 *
 * Estrategia (heuristica conservadora):
 *   1. Extrai pares "X.XX%" e "X.XXpp" do markdown
 *   2. Extrai conjunto de % do JSON (Polymarket, pesquisas, inflacao, Senado)
 *   3. Para cada % no markdown que aparenta ser claim Polymarket/pesquisa,
 *      verifica se aparece no JSON com tolerancia +-0.05pp
 *   4. Reporta divergencias suspeitas
 *
 * Saida:
 *   - exit 0 + "OK" se nenhuma divergencia
 *   - exit 1 + relatorio se houver divergencias
 *
 * Usage:
 *   npx tsx scripts/reconcile-claims.ts 2026-05-01
 *   npx tsx scripts/reconcile-claims.ts 2026-05-01 --strict   # falha em qualquer divergencia
 */
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { isValidDate, readDailyMarkdown } from './lib/daily-files'

const ROOT = process.cwd()
const TOLERANCE_PP = 0.05

interface Claim {
  value: number
  unit: '%' | 'pp'
  context: string
  line: number
}

// Padroes que devem ser EXCLUIDOS do reconcile (geram falso positivo).
// `n=2.000` (sample size), `1.500 entrevistados`, codigos protocolo BR083372026,
// "5/Mai" ou "5 de Maio" (datas), "20:30" (horarios), "n=4.000".
const EXCLUDE_CONTEXT_RE = /\b(?:n\s*=|sample|amostra|entrevistados|protocolo)/i

function extractClaimsFromMarkdown(text: string): Claim[] {
  const claims: Claim[] = []
  const lines = text.split(/\r?\n/)
  // Captura "X.XX%" e "X.XXpp" — same regex shape as JSON extractor.
  const re = /([+-]?\d+(?:\.\d+)?)\s*(%|pp)(?![A-Za-z0-9])/g
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    let m: RegExpExecArray | null
    re.lastIndex = 0
    while ((m = re.exec(line)) !== null) {
      const v = parseFloat(m[1])
      if (Number.isNaN(v)) continue
      // Captura ~80 chars de contexto antes da match
      const start = Math.max(0, m.index - 80)
      const ctx = line.slice(start, m.index + m[0].length).trim()
      // Filtrar contextos que sao falsos positivos (n=, amostra, etc.)
      if (EXCLUDE_CONTEXT_RE.test(ctx)) continue
      claims.push({
        value: v,
        unit: m[2] as '%' | 'pp',
        context: ctx,
        line: i + 1,
      })
    }
  }
  return claims
}

function extractValuesFromJson(obj: unknown, accumulator: Set<number>): void {
  if (obj === null || obj === undefined) return
  if (typeof obj === 'string') {
    // Captura X.XX% e X.XXpp em strings JSON.
    // Sem \b ao final: % e' nao-word, espaco e' nao-word, entao \b nao casa
    // entre eles e a regex original perdia "43.55%" antes de espaco.
    const re = /([+-]?\d+(?:\.\d+)?)\s*(%|pp)(?![A-Za-z0-9])/g
    let m: RegExpExecArray | null
    while ((m = re.exec(obj)) !== null) {
      const v = parseFloat(m[1])
      if (!Number.isNaN(v)) accumulator.add(Math.round(v * 100) / 100)
    }
    return
  }
  if (Array.isArray(obj)) {
    for (const item of obj) extractValuesFromJson(item, accumulator)
    return
  }
  if (typeof obj === 'object') {
    for (const v of Object.values(obj as Record<string, unknown>)) {
      extractValuesFromJson(v, accumulator)
    }
  }
}

function loadJsonValues(): Set<number> {
  const accumulator = new Set<number>()
  const dataPath = join(ROOT, 'public', 'analysis-data.json')
  const critPath = join(ROOT, 'public', 'analysis-criteriosa.json')
  for (const path of [dataPath, critPath]) {
    if (!existsSync(path)) continue
    try {
      const json = JSON.parse(readFileSync(path, 'utf-8'))
      extractValuesFromJson(json, accumulator)
    } catch (err) {
      console.error(`[reconcile] Failed to parse ${path}:`, err)
    }
  }
  return accumulator
}

function valueInSet(v: number, set: Set<number>): boolean {
  // Busca tolerante: aceita +-TOLERANCE_PP. Array.from para evitar problema
  // de iteração direta de Set sob target ES2015 do tsconfig do Next.js.
  const candidates = Array.from(set.values())
  for (const candidate of candidates) {
    if (Math.abs(candidate - v) <= TOLERANCE_PP) return true
  }
  return false
}

function isLikelyPolymarketClaim(context: string): boolean {
  // Heuristica: claim e' provavelmente Polymarket se aparece perto de palavras-chave
  const indicators = /\b(Polymarket|Lula|Flávio|Renan|Zema|Haddad|Caiado|Camilo|STF impeach|PL|União|PSDB|PT|MDB|PSD|Novo|Senado)\b/i
  return indicators.test(context)
}

// Lista de candidatos/entidades para cross-check name×number.
const NAMED_ENTITIES = [
  'Lula', 'Flávio', 'Flavio', 'Renan', 'Zema', 'Haddad', 'Caiado',
  'Camilo', 'Tarcísio', 'Tarcisio', 'Bolsonaro', 'Eduardo Bolsonaro',
  'Michelle', 'Alckmin', 'Eduardo Leite', 'Aldo', 'Ratinho',
  'STF impeach', 'STF', 'PL', 'União', 'Uniao', 'PSDB', 'PT', 'MDB',
  'PSD', 'Novo', 'PSB', 'Republicanos', 'Podemos', 'PP',
]

interface NamedClaim {
  entity: string
  value: number
  unit: '%' | 'pp'
  line: number
  context: string
}

/**
 * Extrai pares (entidade, valor) de um texto. Para cada % ou pp,
 * procura a entidade nominal mais próxima no contexto (mesmo bloco).
 * Retorna apenas claims onde uma entidade foi identificada.
 */
function extractNamedClaims(text: string, source: 'markdown' | 'json'): NamedClaim[] {
  const claims: NamedClaim[] = []
  const lines = source === 'markdown' ? text.split(/\r?\n/) : [text]
  const re = /([+-]?\d+(?:\.\d+)?)\s*(%|pp)(?![A-Za-z0-9])/g

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    let m: RegExpExecArray | null
    re.lastIndex = 0
    while ((m = re.exec(line)) !== null) {
      const v = parseFloat(m[1])
      if (Number.isNaN(v)) continue
      // Procurar entidade nas 80 chars anteriores
      const start = Math.max(0, m.index - 80)
      const before = line.slice(start, m.index)
      let entity: string | null = null
      for (const e of NAMED_ENTITIES) {
        const idx = before.lastIndexOf(e)
        if (idx >= 0 && (entity === null || idx > before.lastIndexOf(entity))) {
          entity = e
        }
      }
      if (!entity) continue
      claims.push({
        entity,
        value: v,
        unit: m[2] as '%' | 'pp',
        line: i + 1,
        context: line.slice(start, m.index + m[0].length).trim().slice(0, 140),
      })
    }
  }
  return claims
}

/**
 * Recursivamente extrai pares (entity, value) de strings em JSON.
 */
function extractNamedClaimsFromJson(obj: unknown, accumulator: Array<{ entity: string; value: number }>): void {
  if (typeof obj === 'string') {
    const claims = extractNamedClaims(obj, 'json')
    for (const c of claims) accumulator.push({ entity: c.entity, value: c.value })
    return
  }
  if (Array.isArray(obj)) {
    for (const item of obj) extractNamedClaimsFromJson(item, accumulator)
    return
  }
  if (obj && typeof obj === 'object') {
    for (const v of Object.values(obj as Record<string, unknown>)) {
      extractNamedClaimsFromJson(v, accumulator)
    }
  }
}

function loadJsonNamedPairs(): Array<{ entity: string; value: number }> {
  const accumulator: Array<{ entity: string; value: number }> = []
  for (const fname of ['analysis-data.json', 'analysis-criteriosa.json']) {
    const path = join(ROOT, 'public', fname)
    if (!existsSync(path)) continue
    try {
      const json = JSON.parse(readFileSync(path, 'utf-8'))
      extractNamedClaimsFromJson(json, accumulator)
    } catch {
      // skip
    }
  }
  return accumulator
}

/**
 * Cross-check entidade×valor: o número V atribuído à entidade E no
 * markdown corresponde a algum (E, ~V) no JSON?
 * Retorna claims do markdown que NÃO encontraram match.
 */
function findMismatchedNamedClaims(markdown: string): NamedClaim[] {
  const markdownClaims = extractNamedClaims(markdown, 'markdown')
  const jsonPairs = loadJsonNamedPairs()
  const mismatched: NamedClaim[] = []
  for (const claim of markdownClaims) {
    const match = jsonPairs.find(
      (p) => p.entity === claim.entity && Math.abs(p.value - claim.value) <= TOLERANCE_PP
    )
    if (!match) mismatched.push(claim)
  }
  return mismatched
}

function main() {
  const date = process.argv[2]
  const strict = process.argv.includes('--strict')

  if (!date || !isValidDate(date)) {
    console.error('Usage: npx tsx scripts/reconcile-claims.ts YYYY-MM-DD [--strict]')
    process.exit(1)
  }

  const markdown = readDailyMarkdown(date)
  if (!markdown) {
    console.error(`File public/afos-daily/${date}.md not found.`)
    process.exit(1)
  }

  const claims = extractClaimsFromMarkdown(markdown)
  const jsonValues = loadJsonValues()

  console.log(`Reconciliacao numerica markdown x JSONs (data ${date})`)
  console.log(`  Claims extraidos do markdown: ${claims.length}`)
  console.log(`  Valores unicos nos JSONs: ${jsonValues.size}`)

  // Filtrar apenas claims que parecem ser Polymarket/pesquisa
  const polymarketClaims = claims.filter((c) => isLikelyPolymarketClaim(c.context))
  console.log(`  Claims com context Polymarket/pesquisa: ${polymarketClaims.length}`)

  const divergent: Claim[] = []
  for (const c of polymarketClaims) {
    if (!valueInSet(c.value, jsonValues)) {
      divergent.push(c)
    }
  }

  // Cross-check name×number (Fase 2.2 robustez): compara pares (entidade, valor)
  // entre markdown e JSONs. Detecta polling transposition (Lula com numero do
  // Flavio, Tarcisio com numero do Bolsonaro, etc.) — falsos negativos do match
  // de valor pelado.
  const namedMismatches = findMismatchedNamedClaims(markdown)
  if (namedMismatches.length > 0) {
    console.log(`\n[NAMED-CHECK] ${namedMismatches.length} pares (entidade, valor) sem match exato no JSON:\n`)
    for (const c of namedMismatches.slice(0, 10)) {
      console.log(`  Linha ${c.line}: ${c.entity} = ${c.value}${c.unit}`)
      console.log(`    Contexto: "${c.context.slice(0, 110)}${c.context.length > 110 ? '...' : ''}"`)
    }
    if (namedMismatches.length > 10) {
      console.log(`  (... +${namedMismatches.length - 10} pares)`)
    }
    console.log('  Note: pode incluir deltas (ex: Flavio +0.55pp), n=pesquisa, contextos editoriais — investigar caso a caso.')
  }

  if (divergent.length === 0) {
    console.log('\n[OK] Todos os claims numericos do markdown batem com algum valor no JSON (tolerancia +-' + TOLERANCE_PP + 'pp).')
    process.exit(namedMismatches.length > 0 && strict ? 1 : 0)
  }

  console.log(`\n[WARN] ${divergent.length} claims divergem dos JSONs (podem ser deltas calculados, n's de pesquisa, ou erros):\n`)
  for (const c of divergent.slice(0, 20)) {
    console.log(`  Linha ${c.line}: ${c.value}${c.unit}`)
    console.log(`    Contexto: "${c.context.slice(0, 120)}${c.context.length > 120 ? '...' : ''}"`)
  }
  if (divergent.length > 20) {
    console.log(`  (... +${divergent.length - 20} divergencias adicionais)`)
  }

  console.log('\nNotas:')
  console.log('  - Tolerancia: +-' + TOLERANCE_PP + 'pp (ajustavel via TOLERANCE_PP)')
  console.log('  - Deltas (ex: "+0.55pp", "-2.5pp") sao calculos sobre valores do JSON; podem ser legitimos')
  console.log('  - n=2.000, sample sizes, datas (28/Abr) podem aparecer aqui — ignore esses falsos positivos')
  console.log('  - Se for erro real (% inventada), corrigir antes de publicar')

  process.exit(strict ? 1 : 0)
}

main()
