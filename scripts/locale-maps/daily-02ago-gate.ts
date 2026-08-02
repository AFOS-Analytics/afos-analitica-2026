/**
 * Gate numérico + as 5 checagens da daily de 02/Ago, nas três versões.
 * Varre o CORPO, fora do bloco de fontes, senão título de matéria em português
 * dá falso positivo.
 */
import { readFileSync } from 'fs'
import { join } from 'path'

const base = join(process.cwd(), 'public', 'afos-daily')
const arquivos = { 'pt-BR': '2026-08-02.md', en: '2026-08-02.en.md', es: '2026-08-02.es.md' }

function corpo(txt: string): string {
  return txt.split('## Fontes consultadas')[0].split('## Sources consulted')[0].split('## Fuentes consultadas')[0]
}

/** Número seguido de unidade, normalizado para a convenção do idioma. */
function numeros(txt: string, locale: string): string[] {
  const semUrl = txt.replace(/\]\([^)]*\)/g, ']').replace(/https?:\/\/\S+/g, '')
  const re = /(\d[\d.,]*)\s*(%|pp|M\b|K\b|mil\b)/g
  const out: string[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(semUrl))) {
    let n = m[1]
    // normaliza: EN usa . decimal e , milhar; pt/es usam , decimal e . milhar
    n = locale === 'en' ? n.replace(/,/g, '') : n.replace(/\./g, '').replace(/,/g, '.')
    let u = m[2]
    if (u === 'K') u = 'mil'
    out.push(`${parseFloat(n)}${u}`)
  }
  return out.sort()
}

const CIRILICO = /[Ѐ-ӿ]/

let falhas = 0
const ref = numeros(corpo(readFileSync(join(base, arquivos['pt-BR']), 'utf-8')), 'pt-BR')

for (const [loc, arq] of Object.entries(arquivos)) {
  const txt = readFileSync(join(base, arq), 'utf-8')
  const c = corpo(txt)
  const problemas: string[] = []

  // 1. gate numérico
  const n = numeros(c, loc)
  if (JSON.stringify(n) !== JSON.stringify(ref)) {
    const falta = ref.filter(x => !n.includes(x))
    const sobra = n.filter(x => !ref.includes(x))
    problemas.push(`gate numérico: falta [${falta}] sobra [${sobra}]`)
  }

  // 2. link para outro locale
  const prefixo = loc === 'pt-BR' ? '/pt-BR/' : `/${loc}/`
  const outros = (txt.match(/\/(pt-BR|en|es)\/daily/g) || []).filter(x => !x.startsWith(prefixo))
  if (outros.length) problemas.push(`link para outro locale: ${[...new Set(outros)]}`)

  // 3. homóglifo cirílico
  if (CIRILICO.test(c)) problemas.push('homóglifo cirílico no corpo')

  // 4. separador decimal na coluna de confiança do calendário
  const conf = [...c.matchAll(/\|\s*(0[.,]\d)\s*\|/g)].map(m => m[1])
  const esperado = loc === 'en' ? '.' : ','
  const errados = conf.filter(x => !x.includes(esperado))
  if (errados.length) problemas.push(`separador decimal na tabela: ${[...new Set(errados)]} (esperado "${esperado}")`)

  // 5. tldr com exatamente 3 bullets
  const fm = txt.split('---')[1] || ''
  const bullets = (fm.match(/^\s{2}- "/gm) || []).length
  if (bullets !== 3) problemas.push(`tldr com ${bullets} bullets (esperado 3)`)

  if (problemas.length) {
    falhas++
    console.log(`❌ ${loc}`)
    problemas.forEach(p => console.log(`   ${p}`))
  } else {
    console.log(`✅ ${loc}  (${n.length} números com unidade, conferidos)`)
  }
}

console.log(falhas === 0 ? '\n✅ 5/5 checagens limpas nas três versões.' : `\n❌ ${falhas} versão(ões) com problema.`)
process.exit(falhas === 0 ? 0 : 1)
