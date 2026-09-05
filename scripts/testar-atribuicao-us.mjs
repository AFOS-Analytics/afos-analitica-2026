/**
 * testar-atribuicao-us.mjs — casos plantados para `lib/us-polls/atribuicao.mjs`,
 * a regra que separa COMPOSIÇÃO de movimento na média do generic ballot.
 * Sem rede, sem tocar em arquivo do projeto.
 *
 * 🔑 O caso 2 é o que importa, e ele usa o FIXTURE REAL de 04/Set/2026: a
 * The Economist/YouGov aparece QUATRO vezes na mesma janela, com quatro campos
 * diferentes. Um comparador chaveado só pelo nome do instituto colapsa as quatro
 * numa e anuncia saída onde não houve. Foi exatamente esse o defeito do
 * comparador de deltas do Brasil, achado horas antes no mesmo dia, e lá o meu
 * teste passou POR SORTE porque o fixture usava nomes diferentes por livro.
 * Aqui o fixture é o de verdade, então a mutação é pega.
 *
 * Uso: node scripts/testar-atribuicao-us.mjs
 */

import { chaveDe, comparar, conferirSubtracao, mediaDe, mudou, veredito } from '../lib/us-polls/atribuicao.mjs'

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

const p = (instituto, campoFim, dem, rep, amostraTipo = 'RV') => ({ instituto, campoFim, amostraTipo, dem, rep })

// Fixture REAL: as 13 rodadas que entraram na média de 04/Set/2026.
const HOJE = [
  p('The Economist/YouGov', '2026-08-31', 46, 40),
  p('The Economist/YouGov', '2026-08-24', 46, 40),
  p('Echelon Insights', '2026-08-17', 50, 45, 'LV'),
  p('Emerson College', '2026-08-17', 51, 43, 'LV'),
  p('Reuters/Ipsos', '2026-08-17', 41, 36),
  p('The Bullfinch Group', '2026-08-17', 42, 37),
  p('The Economist/YouGov', '2026-08-17', 46, 39),
  p('Morning Consult', '2026-08-16', 46, 42),
  p('Focaldata/Financial Times', '2026-08-11', 51, 45, 'LV'),
  p('AlphaROC', '2026-08-10', 41, 37, 'A'),
  p('The Economist/YouGov', '2026-08-10', 46, 40),
  p('Morning Consult', '2026-08-09', 47, 42),
  p('Cygnal (R)', '2026-08-07', 49, 42, 'LV'),
]
// A véspera é a mesma lista MAIS a Zogby, que era D+11.00 e saiu pela borda.
const ONTEM = [p('John Zogby Strategies', '2026-08-05', 51, 40, 'LV'), ...HOJE]

console.log('\n1. A média reproduz, e é ela que confere o que o arquivo declara')
{
  const m = mediaDe(HOJE)
  conferir('as 13 linhas reais dão D+5.69', m.vantagemDem === 5.69 && m.dem === 46.31 && m.rep === 40.62, JSON.stringify(m))
  conferir('as 14 da véspera dão D+6.07', mediaDe(ONTEM).vantagemDem === 6.07, String(mediaDe(ONTEM).vantagemDem))
  conferir('lista vazia devolve null, e não NaN disfarçado de média', mediaDe([]) === null)
}

console.log('\n2. 🔴 A chave é instituto + campoFim, porque a MESMA casa repete na janela')
{
  const d = comparar(ONTEM, HOJE)
  conferir('saiu exatamente 1, e é a Zogby', d.sairam.length === 1 && d.sairam[0].instituto === 'John Zogby Strategies', JSON.stringify(d.sairam.map(chaveDe)))
  conferir('não entrou ninguém', d.entraram.length === 0, JSON.stringify(d.entraram.map(chaveDe)))
  conferir('nada foi corrigido', d.mudaram.length === 0)
  conferir(
    '⚠️ as 4 rodadas da YouGov continuam sendo 4 chaves distintas',
    new Set(HOJE.filter((x) => x.instituto === 'The Economist/YouGov').map(chaveDe)).size === 4
  )

  // A MUTAÇÃO: chavear só pelo instituto. O dano dela é ENGOLIR rodada, e é
  // isso que se mede aqui, não uma consequência que eu gostaria que existisse.
  const chaveRuim = (x) => x.instituto
  const A = new Map(ONTEM.map((x) => [chaveRuim(x), x]))
  const D = new Map(HOJE.map((x) => [chaveRuim(x), x]))
  conferir(
    '🔴 chavear só pelo instituto ENGOLE rodada: 14 viram 10 e 13 viram 9',
    ONTEM.length === 14 && HOJE.length === 13 && A.size === 10 && D.size === 9,
    `A=${A.size} D=${D.size}`
  )
  conferir(
    '⛔ e aí a média não reproduz mais: 9 linhas contra as 13 que o arquivo declara',
    mediaDe([...D.values()]).n !== HOJE.length && mediaDe([...D.values()]).vantagemDem !== 5.69,
    JSON.stringify(mediaDe([...D.values()]))
  )
  // 📌 Nesse fixture a chave ruim ainda acerta "saiu a Zogby", por sorte: a
  // última YouGov de cada lista é a mesma linha. Sorte não é portão, e é por
  // isso que a asserção que vale é a de cima, sobre as rodadas engolidas.
  const saidasRuins = [...A.values()].filter((x) => !D.has(chaveRuim(x)))
  conferir('a saída certa aqui é COINCIDÊNCIA, e fica registrada como tal', saidasRuins.length === 1)
}

console.log('\n3. O veredito separa composição de movimento')
{
  const soComposicao = comparar(ONTEM, HOJE)
  conferir(
    'saiu pela borda e nada entrou -> COMPOSICAO',
    veredito(soComposicao, -0.38).join('+') === 'COMPOSICAO',
    veredito(soComposicao, -0.38).join('+')
  )

  const comNova = comparar(HOJE, [p('Quinnipiac', '2026-09-03', 49, 42, 'RV'), ...HOJE])
  conferir('rodada nova -> PESQUISA_NOVA', veredito(comNova, 0.31).includes('PESQUISA_NOVA'))
  conferir('e sem saída não vira COMPOSICAO', !veredito(comNova, 0.31).includes('COMPOSICAO'))

  const corrigida = HOJE.map((x, i) => (i === 0 ? { ...x, dem: 47 } : x))
  const comCorrecao = comparar(HOJE, corrigida)
  conferir('valor corrigido na origem -> CORRECAO', veredito(comCorrecao, 0.08).join('+') === 'CORRECAO')

  // 🔑 Recorte trocado sem mudar os números TAMBÉM é correção: o instituto
  // republicou a mesma rodada com outro universo, e isso muda o significado.
  const outroRecorte = HOJE.map((x, i) => (i === 0 ? { ...x, amostraTipo: 'LV' } : x))
  conferir('recorte trocado também conta como CORRECAO', comparar(HOJE, outroRecorte).mudaram.length === 1)

  conferir(
    '⛔ conjunto idêntico com a média mexendo -> INCONSISTENTE',
    veredito(comparar(HOJE, HOJE), 0.4).join('+') === 'INCONSISTENTE'
  )
  conferir('conjunto idêntico com média parada -> PARADO', veredito(comparar(HOJE, HOJE), 0).join('+') === 'PARADO')

  // Entrou E saiu na mesma rodada: é movimento misturado com borda, e os dois
  // rótulos têm de aparecer, senão a narrativa credita tudo à pesquisa nova.
  const misto = comparar(ONTEM, [p('Quinnipiac', '2026-09-03', 49, 42), ...HOJE])
  conferir(
    'entrou E saiu -> PESQUISA_NOVA + borda-rolou, e nunca só um dos dois',
    veredito(misto, 0.2).join('+') === 'PESQUISA_NOVA+borda-rolou',
    veredito(misto, 0.2).join('+')
  )
}

console.log('\n4. A subtração de atribuição fecha em cima do fixture real')
{
  const d = comparar(ONTEM, HOJE)
  conferir('a subtração de atribuição fecha nos dois campos', conferirSubtracao(ONTEM, HOJE, d).length === 0)
  // 🔁 E a mesma função tem de ACUSAR quando não fecha, senão ela é um zero que
  // não mede nada. Aqui a lista de saídas é escondida dela de propósito.
  const cega = { entraram: [], sairam: [], mudaram: [] }
  conferir('e ACUSA quando a saída é escondida dela', conferirSubtracao(ONTEM, HOJE, cega).length === 2)
  // A conta que eu fiz na mão em 04/Set, agora plantada como caso.
  const reproduzido = Number(((6.07 * 14 - 11.0) / 13).toFixed(2))
  conferir('(6.07 x 14 - 11.00) / 13 = 5.69, a média nova sem a Zogby', reproduzido === 5.69, String(reproduzido))
}

console.log('\n5. 🔴 O PONTO CEGO da regra antiga, que comparava NOMES de casa')
{
  // Caso medido sobre o arquivo real de 04/Set/2026: uma onda NOVA da YouGov com
  // campo 28/Ago. A casa JÁ está na lista e o campo mais recente do arquivo segue
  // sendo 31/Ago, então a regra por conjunto de institutos via "ninguém entrou" e
  // imprimia "ZERO informação nova" no dia em que uma pesquisa entrou de verdade.
  const depois = [p('The Economist/YouGov', '2026-08-28', 48, 39), ...HOJE]

  const antesNomes = new Set(HOJE.map((x) => x.instituto))
  const agoraNomes = new Set(depois.map((x) => x.instituto))
  conferir(
    'a regra ANTIGA não via nada: o conjunto de institutos é idêntico',
    [...agoraNomes].filter((x) => !antesNomes.has(x)).length === 0
  )
  conferir(
    'e o campo mais recente do arquivo também não mexia',
    depois.map((x) => x.campoFim).sort().at(-1) === HOJE.map((x) => x.campoFim).sort().at(-1)
  )
  conferir(
    '✅ a regra NOVA vê a rodada entrando',
    comparar(HOJE, depois).entraram.length === 1 && comparar(HOJE, depois).entraram[0].campoFim === '2026-08-28'
  )
  conferir(
    '⚠️ e o veredito deixa de ser COMPOSICAO, que era a frase falsa',
    veredito(comparar(HOJE, depois), 0.24).includes('PESQUISA_NOVA') &&
      !veredito(comparar(HOJE, depois), 0.24).includes('COMPOSICAO')
  )
  conferir(
    'o efeito era real: D+5.69 iria a D+5.93',
    mediaDe(HOJE).vantagemDem === 5.69 && mediaDe(depois).vantagemDem === 5.93,
    String(mediaDe(depois).vantagemDem)
  )
}

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${passes} passaram, ${falhas} falharam.`)
process.exit(falhas === 0 ? 0 : 1)
