/**
 * gate-traducao-daily.ts — gate numérico e checagens de forma da AFOS Daily nas três versões.
 *
 * Uso:
 *   npx tsx scripts/gate-traducao-daily.ts 2026-09-16
 *
 * 🔴 POR QUE ISTO EXISTE, medido em 16/Set/2026. A ETAPA 3.7 do /afos-daily
 * manda rodar "o gate numérico e as 5 checagens" antes do preview, e a única
 * implementação em disco era `scripts/locale-maps/daily-02ago-gate.ts`, com a
 * data de 02/Ago FIXA no código. Três lacunas vinham junto:
 *   1. a checagem de âncora de glossário inexistente, que o comando lista, não
 *      existia no script;
 *   2. "USD 91 mil" (pt e es) e "USD 91 thousand" (en) viravam unidades
 *      diferentes, então o gate reprovaria toda daily com volume em milhares;
 *   3. travessão, emoji e teto de palavras, réguas duras da casa, eram
 *      conferidos por comandos soltos copiados do texto do comando.
 *
 * Varre o CORPO, fora do bloco de fontes, senão título de matéria em português
 * dá falso positivo. Os rótulos do rodapé ficam em português nos três idiomas,
 * porque o loader os extrai pelo texto literal.
 */
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const data = process.argv.slice(2).find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a))
if (!data) {
  console.error('uso: npx tsx scripts/gate-traducao-daily.ts AAAA-MM-DD')
  process.exit(2)
}

const base = join(process.cwd(), 'public', 'afos-daily')
const arquivos: Record<string, string> = { 'pt-BR': `${data}.md`, en: `${data}.en.md`, es: `${data}.es.md` }
const TETO_PALAVRAS = 1100

export function corpo(txt: string): string {
  return txt.split('## Fontes consultadas')[0]
}

/** Número seguido de unidade, normalizado para uma forma comum aos três idiomas. */
export function numeros(txt: string, locale: string): string[] {
  const semUrl = txt.replace(/\]\([^)]*\)/g, ']').replace(/https?:\/\/\S+/g, '')
  const re = /(\d[\d.,]*)\s*(%|pp|M\b|K\b|mil\b|thousand\b)/g
  const out: string[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(semUrl))) {
    let n = m[1].replace(/[.,]$/, '')
    n = locale === 'en' ? n.replace(/,/g, '') : n.replace(/\./g, '').replace(/,/g, '.')
    let u = m[2]
    if (u === 'K' || u === 'thousand') u = 'mil'
    out.push(`${parseFloat(n)}${u}`)
  }
  return out.sort()
}

export function palavras(txt: string): number {
  const c = corpo(txt).replace(/^---[\s\S]*?\n---\n/, '')
  const s = c
    .split('\n')
    .filter((l) => !l.trim().startsWith('|'))
    .join('\n')
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/https?:\/\/\S+/g, '')
  return s.split(/\s+/).filter(Boolean).length
}

const CIRILICO = /[Ѐ-ӿ]/
const EMOJI = /[\u{1F300}-\u{1FAFF}☀-➿⬀-⯿️]/gu
const glossario = JSON.parse(readFileSync(join(process.cwd(), 'public', 'glossary', 'entries.json'), 'utf-8')) as Record<string, unknown>

let falhas = 0
for (const arq of Object.values(arquivos)) {
  if (!existsSync(join(base, arq))) {
    console.error(`❌ falta ${arq}: idioma ausente não passa em silêncio`)
    process.exit(1)
  }
}
const ref = numeros(corpo(readFileSync(join(base, arquivos['pt-BR']), 'utf-8')), 'pt-BR')

for (const [loc, arq] of Object.entries(arquivos)) {
  const txt = readFileSync(join(base, arq), 'utf-8')
  const c = corpo(txt)
  const problemas: string[] = []
  const avisos: string[] = []

  // 1. gate numérico
  const n = numeros(c, loc)
  if (JSON.stringify(n) !== JSON.stringify(ref)) {
    const falta = ref.filter((x) => !n.includes(x))
    const sobra = n.filter((x) => !ref.includes(x))
    problemas.push(`gate numérico: ${n.length} contra ${ref.length}; falta [${falta}] sobra [${sobra}]`)
  }

  // 2. link para outro locale, na daily ou no glossário
  const prefixo = `/${loc}/`
  const outros = (txt.match(/\/(pt-BR|en|es)\/(daily|glossary)/g) || []).filter((x) => !x.startsWith(prefixo))
  if (outros.length) problemas.push(`link para outro locale: ${[...new Set(outros)]}`)

  // 3. âncora de glossário inexistente
  const ancoras = [...txt.matchAll(/\/glossary#([a-z0-9-]+)/g)].map((m) => m[1])
  const mortas = ancoras.filter((a) => !(a in glossario))
  if (mortas.length) problemas.push(`âncora de glossário inexistente: ${[...new Set(mortas)]}`)

  // 4. homóglifo cirílico
  if (CIRILICO.test(c)) problemas.push('homóglifo cirílico no corpo')

  // 5. separador decimal na coluna de confiança do calendário, quando ela existe
  const conf = [...c.matchAll(/\|\s*(0[.,]\d)\s*\|/g)].map((m) => m[1])
  const esperado = loc === 'en' ? '.' : ','
  const errados = conf.filter((x) => !x.includes(esperado))
  if (errados.length) problemas.push(`separador decimal na tabela: ${[...new Set(errados)]} (esperado "${esperado}")`)

  // 6. tldr com exatamente 3 bullets
  const fm = txt.split('---')[1] || ''
  const bullets = (fm.match(/^\s{2}- "/gm) || []).length
  if (bullets !== 3) problemas.push(`tldr com ${bullets} bullets (esperado 3)`)

  // 7. travessão e emoji, zero na peça inteira
  const trav = (txt.match(/[—–]/g) || []).length
  if (trav) problemas.push(`${trav} travessão(ões)`)
  const emo = txt.match(EMOJI) || []
  if (emo.length) problemas.push(`${emo.length} emoji(s): ${emo.join(' ')}`)

  // 8. status draft antes da aprovação, e locale certo
  if (!new RegExp(`^locale: ${loc}$`, 'm').test(txt)) problemas.push(`locale do frontmatter não é ${loc}`)
  if (!/^status: (draft|published)$/m.test(txt)) problemas.push('status ausente')

  // palavras: o teto é régua do pt-BR; nos outros idiomas o tamanho varia e só avisa
  const p = palavras(txt)
  if (loc === 'pt-BR' && p > TETO_PALAVRAS) problemas.push(`${p} palavras, teto ${TETO_PALAVRAS}`)
  else if (p > TETO_PALAVRAS * 1.15) avisos.push(`${p} palavras`)

  if (problemas.length) {
    falhas++
    console.log(`❌ ${loc}`)
    problemas.forEach((x) => console.log(`   ${x}`))
  } else {
    console.log(`✅ ${loc}  ${n.length} números com unidade · ${p} palavras · ${ancoras.length} âncora(s) de glossário`)
  }
  avisos.forEach((x) => console.log(`   ⚠️ ${x}`))
}

console.log(falhas === 0 ? '\n✅ gate limpo nas três versões.' : `\n❌ ${falhas} versão(ões) com problema.`)
process.exit(falhas === 0 ? 0 : 1)
