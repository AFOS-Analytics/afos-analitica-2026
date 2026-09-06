/**
 * Controle plantado do conferidor de tela dos EUA (`conferir-tela-us.mjs`).
 *
 * 🔑 Os DOIS primeiros casos são os defeitos que o próprio conferidor teve na
 * estreia, em 06/Set/2026, e que só apareceram porque ele foi rodado contra a
 * produção. Ficam aqui plantados para não voltarem:
 *
 *   1. SEPARADOR DECIMAL. A primeira versão comparava `87.50` contra as três
 *      telas. O pt-BR e o ES escrevem `87,50`, então ele reprovou DUAS telas
 *      corretas e aprovou só o inglês. Falso positivo que manda consertar o que
 *      está bom é pior que falso negativo, porque gasta o crédito do portão.
 *
 *   2. SUBSTRING. `texto.includes('51.50')` deu verdadeiro numa tela pt-BR que
 *      nem usa ponto decimal, porque o pedaço aparecia dentro de outro número.
 *      Acerto por acaso é indistinguível de acerto de verdade no relatório.
 *
 * ⭐ E o caso que mais importa é o NEGATIVO: o conferidor tem de recusar o
 * número que aparece dentro de outro. Sem ele, um portão que diz "sim" para
 * tudo passa em todos os outros casos.
 *
 * Uso:  node scripts/testar-conferir-tela-us.mjs
 */
import { achou, naConvencao } from './conferir-tela-us.mjs'

const CASOS = [
  // ── 1. o defeito do separador decimal, nos dois sentidos
  ['pt-BR escreve com vírgula', 'Democratas 87,50% na Câmara', '87.50', 'pt-BR', true],
  ['ES escreve com vírgula', 'Demócratas 87,50% en la Cámara', '87.50', 'es', true],
  ['EN escreve com ponto', 'Democrats at 87.50% in the House', '87.50', 'en', true],
  ['pt-BR NÃO deve casar a forma inglesa', 'Democratas 87.50% na Câmara', '87.50', 'pt-BR', false],
  ['EN NÃO deve casar a forma brasileira', 'Democrats at 87,50% in the House', '87.50', 'en', false],

  // ── 2. o defeito do substring: os NEGATIVOS que sustentam o portão
  ['não casa dentro de número maior', 'volume 187,502 negociado', '87.50', 'pt-BR', false],
  ['não casa com milhar antes', 'USD 1.187,50 acumulado', '87.50', 'pt-BR', false],
  ['não casa com dígito depois', 'a média foi 5,143 pontos', '5.14', 'pt-BR', false],
  ['inteiro não casa dentro de outro inteiro', 'n=140 pesquisas', '14', 'pt-BR', false],
  ['inteiro casa sozinho', 'n=14 pesquisas de 10 institutos', '14', 'pt-BR', true],

  // ── 3. o caso real da rodada de estreia
  ['a média do generic ballot em pt-BR', 'vantagem D+5,14 sobre 14 rodadas', '5.14', 'pt-BR', true],
  ['a média do generic ballot em EN', 'margin D+5.14 over 14 rounds', '5.14', 'en', true],
  ['o contrato de calendário', 'acontece no prazo: 97,15%', '97.15', 'pt-BR', true],
  ['ausência de verdade é ausência', 'a tela não trouxe o número', '97.15', 'pt-BR', false],

  // ── 4. borda: fim de linha e começo de texto contam como fronteira
  ['casa no fim do texto', 'o preço fechou em 49,50', '49.50', 'pt-BR', true],
  ['casa no começo do texto', '49,50 foi o fechamento', '49.50', 'pt-BR', true],
]

let falhas = 0
for (const [rot, texto, valor, locale, esperado] of CASOS) {
  const r = achou(texto, valor, locale)
  const ok = r === esperado
  if (!ok) falhas++
  console.log(`${ok ? '✅' : '❌'} ${rot}${ok ? '' : `  → esperava ${esperado}, veio ${r}`}`)
}

// a conversão sozinha, porque ela é a peça reusável
const conv = [
  ['87.50 em pt-BR vira 87,50', naConvencao('87.50', 'pt-BR') === '87,50'],
  ['87.50 em en fica 87.50', naConvencao('87.50', 'en') === '87.50'],
  ['87,50 em en vira 87.50', naConvencao('87,50', 'en') === '87.50'],
  ['inteiro atravessa sem mudar', naConvencao('14', 'pt-BR') === '14'],
]
for (const [rot, ok] of conv) {
  if (!ok) falhas++
  console.log(`${ok ? '✅' : '❌'} ${rot}`)
}

const total = CASOS.length + conv.length
console.log(`\n${falhas === 0 ? '✅' : '❌'} VEREDITO DO TESTE: ${total - falhas}/${total} corretos\n`)
process.exit(falhas === 0 ? 0 : 1)
