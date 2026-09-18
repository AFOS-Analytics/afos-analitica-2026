/**
 * testar-leaner-us.mjs — casos plantados para a dimensão "com ou sem leaners".
 *
 * 🔑 Os casos que importam são os anti-silêncio. Os dois defeitos reais desta
 *    peça, os dois meus, produziram ZERO em vez de erro:
 *      · casar por `vantagemDem`, que `incluidas` não tem, devolveu
 *        "0 de 10 rodadas servidas" quando a primeira da lista tinha;
 *      · tratar ausente como `false` parearia linha curada com linha do índice.
 *    Zero se lê como medição, e é por isso que ele precisa de caso plantado.
 *
 * Uso: node scripts/testar-leaner-us.mjs
 */

import { MARCADOR_LEANER, chaveDeRodada, parearPorLeaner, acharServida } from '../lib/us-polls/leaner.mjs'

let falhas = 0
let passes = 0
function conferir(nome, cond, detalhe) {
  if (cond) {
    passes++
    console.log(`  ✅ ${nome}`)
  } else {
    falhas++
    console.log(`  ❌ ${nome}${detalhe ? `\n     ${detalhe}` : ''}`)
  }
}

const linha = (o) => ({
  instituto: 'Casa X',
  campoInicio: '2026-09-15',
  campoFim: '2026-09-17',
  amostraTipo: 'LV',
  amostra: 1007,
  dem: 46,
  rep: 40,
  vantagemDem: 6,
  comLeaners: false,
  ...o,
})

console.log('\n1. O MARCADOR, nas formas em que ele aparece de verdade')
{
  conferir('forma canônica', MARCADOR_LEANER.test('{{efn|name="lean"}}'))
  conferir('com espaços', MARCADOR_LEANER.test('{{efn | name = "lean" }}'))
  conferir('dentro de célula com valor', MARCADOR_LEANER.test(`|{{party shading/Democratic}}|'''48%'''{{efn|name="lean"}}`))
  // ⛔ O que NÃO pode casar: outra nota qualquer.
  conferir('outra nota não casa', !MARCADOR_LEANER.test('{{Efn|"Other party" with 4%}}'))
  conferir('nota com outro nome não casa', !MARCADOR_LEANER.test('{{efn|name="turnout"}}'))
  conferir('célula limpa não casa', !MARCADOR_LEANER.test(`|'''46%'''`))
}

console.log('\n2. O par real de 18/Set: John Zogby, duas linhas, mesma margem')
{
  const r = parearPorLeaner([
    linha({ dem: 46, rep: 40, vantagemDem: 6, comLeaners: false }),
    linha({ dem: 48, rep: 42, vantagemDem: 6, comLeaners: true }),
  ])
  conferir('achou 1 par', r.pares.length === 1, JSON.stringify(r.pares.length))
  conferir('delta zero, porque a margem é a mesma', r.pares[0]?.delta === 0, String(r.pares[0]?.delta))
  conferir('as duas contam como medidas', r.medidas === 2)
  conferir('nenhuma sem campo', r.semCampo === 0)
}

console.log('\n3. 🔴 AUSENTE NÃO É `false`: linha curada não pareia')
{
  const curada = linha({ dem: 49.7, rep: 42.8, vantagemDem: 6.9 })
  delete curada.comLeaners
  const r = parearPorLeaner([curada, linha({ dem: 48, rep: 42, vantagemDem: 6, comLeaners: true })])
  conferir('a curada é contada como SEM CAMPO', r.semCampo === 1, `semCampo=${r.semCampo}`)
  conferir('e fica fora das medidas', r.medidas === 1, `medidas=${r.medidas}`)
  conferir('🔑 e NÃO vira par com a do índice', r.pares.length === 0, `pares=${r.pares.length}`)
}

console.log('\n4. A chave separa RECORTE e AMOSTRA, senão soma duas diferenças')
{
  const lv = linha({ amostraTipo: 'LV', amostra: 1007, vantagemDem: 6, comLeaners: false })
  const rv = linha({ amostraTipo: 'RV', amostra: 2000, vantagemDem: 8, comLeaners: true })
  conferir('chaves diferentes', chaveDeRodada(lv) !== chaveDeRodada(rv))
  const r = parearPorLeaner([lv, rv])
  conferir('🔑 LV sem leaners NÃO pareia com RV com leaners', r.pares.length === 0, `pares=${r.pares.length}`)
  // E o par legítimo, mesmo recorte e mesma amostra, ainda funciona.
  const r2 = parearPorLeaner([lv, linha({ amostraTipo: 'LV', amostra: 1007, vantagemDem: 9, comLeaners: true })])
  conferir('mesmo recorte e amostra ainda pareia', r2.pares.length === 1 && r2.pares[0].delta === 3, JSON.stringify(r2.pares[0]?.delta))
}

console.log('\n5. 🔴 A SERVIDA se acha por dem e rep, nunca por vantagemDem')
{
  const linhas = [
    linha({ dem: 46, rep: 40, vantagemDem: 6, comLeaners: false }),
    linha({ dem: 48, rep: 42, vantagemDem: 6, comLeaners: true }),
  ]
  // A forma REAL de `mediaAfos.incluidas`: sem `vantagemDem`.
  const inc = { instituto: 'Casa X', campoFim: '2026-09-17', amostraTipo: 'LV', dem: 46, rep: 40 }
  const achada = acharServida(linhas, inc)
  conferir('acha a linha servida', achada !== null)
  conferir('e é a SEM leaners, que é a que entrou', achada?.comLeaners === false, String(achada?.comLeaners))
  // ⛔ O defeito original: se o casamento dependesse de vantagemDem, as duas
  //    linhas empatariam e a busca por um campo ausente devolveria nada.
  conferir('as duas linhas têm a MESMA vantagemDem', linhas[0].vantagemDem === linhas[1].vantagemDem)
  conferir('e mesmo assim dem e rep as separam', linhas[0].dem !== linhas[1].dem)
  const naoExiste = acharServida(linhas, { instituto: 'Casa Y', campoFim: '2026-09-17', amostraTipo: 'LV', dem: 46, rep: 40 })
  conferir('instituto que não existe devolve null, não a primeira', naoExiste === null)
}

console.log('\n6. Base vazia não finge medição')
{
  const r = parearPorLeaner([])
  conferir('zero pares', r.pares.length === 0)
  conferir('zero medidas', r.medidas === 0)
  conferir('zero grupos', r.grupos === 0)
}

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${passes} passaram, ${falhas} falharam.\n`)
process.exit(falhas === 0 ? 0 : 1)
