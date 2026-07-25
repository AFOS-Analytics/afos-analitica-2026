/**
 * Bateria do gate numérico, que é o que decide se uma tradução vai ao ar.
 *
 * Cada caso aqui corresponde a um defeito REAL encontrado em 24 e 25/Jul/2026,
 * não a hipótese: vírgula decimal não convertida no inglês, "billón" espanhol
 * lido como 1e9 (mil vezes o valor), "mi" casando dentro de "mil", campo
 * literal idêntico reprovando o arquivo inteiro, chave inventada pela tradução.
 *
 * Roda no pre-commit quando o gate é tocado. Se falhar, NÃO relaxe o caso:
 * o gate é a única coisa entre uma tradução errada e o leitor.
 *
 * Uso:  npx tsx scripts/test-json-number-gate.ts
 */
import { readFileSync } from 'fs'
import { compararNumeros } from './lib/json-number-gate'

type Caso = [string, unknown, unknown, 'en' | 'es', boolean]

const escala: Caso[] = [
  ['ES: R$ 145 bi -> mil millones', { t: 'de R$ 145 bi' }, { t: 'de R$ 145 mil millones' }, 'es', true],
  ['EN: R$ 145 bi -> billion', { t: 'de R$ 145 bi' }, { t: 'of R$ 145 billion' }, 'en', true],
  ['ES: 145 bi -> 145 millones (bloqueia)', { t: 'de R$ 145 bi' }, { t: 'de R$ 145 millones' }, 'es', false],
  ['ES: 145 bi -> 145 billones (bloqueia, 1e12)', { t: 'de R$ 145 bi' }, { t: 'de R$ 145 billones' }, 'es', false],
  ['EN: 145 bi -> 145 billion NAO vira 1e12', { t: 'de R$ 145 bi' }, { t: 'of R$ 145 billion' }, 'en', true],
  ['mil simples 1e3', { t: 'vol USD 292 mil' }, { t: 'vol USD 292 mil' }, 'es', true],
  ['mil -> thousand', { t: 'vol USD 83 mil' }, { t: 'vol USD 83 thousand' }, 'en', true],
  ['M de milhao', { t: 'vol USD 7,63M' }, { t: 'vol USD 7,63M' }, 'es', true],
  ['MM de milhao', { t: 'vol USD 7,63MM' }, { t: 'vol USD 7,63MM' }, 'es', true],
  ['k de mil', { t: 'vol USD 83k' }, { t: 'vol USD 83k' }, 'es', true],
  ['mi vs mil nao se confundem', { t: 'vol USD 77 mil' }, { t: 'vol USD 77 mil' }, 'es', true],
  ['campo literal identico com virgula pt', { source: 'aprova 45,9% x 52,3%' }, { source: 'aprova 45,9% x 52,3%' }, 'en', true],
  ['virgula NAO convertida no EN (bloqueia)', { t: 'gap de +38,55pp' }, { t: 'gap of +38,55pp' }, 'en', false],
]

const borda: Caso[] = [
  ['milhar multi-grupo', { t: 'USD 1.234.567 no book' }, { t: 'USD 1,234,567 in the book' }, 'en', true],
  ['milhar multi-grupo alterado (bloqueia)', { t: 'USD 1.234.567' }, { t: 'USD 1,234,568' }, 'en', false],
  ['negativo', { t: 'caiu -2,50pp' }, { t: 'fell -2.50pp' }, 'en', true],
  ['seta', { t: 'Lula ↑1,00pp' }, { t: 'Lula ↑1.00pp' }, 'en', true],
  ['sinal invertido (bloqueia)', { t: 'caiu -2,50pp' }, { t: 'rose +2.50pp' }, 'en', false],
  ['chave ausente (bloqueia)', { a: 'Lula 61,50%', b: 'Flávio 22,95%' }, { a: 'Lula 61.50%' }, 'en', false],
  ['chave a mais (bloqueia)', { a: 'Lula 61,50%' }, { a: 'Lula 61.50%', z: 'inventado 99,00%' }, 'en', false],
  ['array menor (bloqueia)', { c: ['a 61,50%', 'b 22,95%'] }, { c: ['a 61.50%'] }, 'en', false],
  ['aninhado profundo', { a: { b: { c: 'gap +38,55pp' } } }, { a: { b: { c: 'gap +38.55pp' } } }, 'en', true],
  ['aninhado alterado (bloqueia)', { a: { b: { c: 'gap +38,55pp' } } }, { a: { b: { c: 'gap +38.65pp' } } }, 'en', false],
  ['null preservado', { x: null }, { x: null }, 'en', true],
  ['null virou string (bloqueia)', { x: null }, { x: 'nulo' }, 'en', false],
  ['boolean alterado (bloqueia)', { x: true }, { x: false }, 'en', false],
  ['numero cru alterado (bloqueia)', { odds: 61.5 }, { odds: 61.6 }, 'en', false],
  ['p.p. como unidade', { t: 'subiu 1,00 p.p.' }, { t: 'rose 1.00 p.p.' }, 'en', true],
  ['numero sem unidade ignorado', { t: 'n=2.004 e 61,50%' }, { t: 'n=2,004 and 61.50%' }, 'en', true],
  ['string vazia', { t: '' }, { t: '' }, 'en', true],
  ['sem numero nenhum', { t: 'o mercado nao declara' }, { t: 'the market does not declare' }, 'en', true],
]

let ok = 0, bad = 0
for (const [nome, o, t, loc, espera] of [...escala, ...borda]) {
  const passou = compararNumeros(o, t, loc).length === 0
  if (passou === espera) { ok++ } else { bad++; console.log(`  FALHA ${nome}: esperava ${espera ? 'passar' : 'bloquear'}`) }
}
console.log(`suite de casos: ${ok}/${ok + bad} corretos`)

let arqFalha = 0
for (const arquivo of ['analysis-data.json', 'analysis-criteriosa.json', 'polls-data.json']) {
  const pt = JSON.parse(readFileSync(`public/${arquivo}`, 'utf-8'))
  for (const loc of ['en', 'es'] as const) {
    const trad = JSON.parse(readFileSync(`public/${arquivo.replace(/\.json$/, `.${loc}.json`)}`, 'utf-8'))
    const d = compararNumeros(pt, trad, loc)
    if (d.length) { arqFalha++; console.log(`  FALHA ${arquivo} -> ${loc}: ${d.length}`) }
  }
}
console.log(`arquivos em producao: ${6 - arqFalha}/6 sem divergencia`)
process.exit(bad === 0 && arqFalha === 0 ? 0 : 1)
