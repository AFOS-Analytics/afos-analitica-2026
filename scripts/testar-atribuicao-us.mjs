/**
 * testar-atribuicao-us.mjs · casos plantados para `lib/us-polls/atribuicao.mjs`,
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

import {
  TOLERANCIA_DE_ORDEM,
  chaveDe,
  comparar,
  conferirSubtracao,
  decompor,
  mediaDe,
  mudou,
  veredito,
} from '../lib/us-polls/atribuicao.mjs'
import { vantagemDeProducao } from '../lib/us-polls/collect.mjs'

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


console.log('\n8. RENOMEACAO, DEDUPLICACAO e DUPLICOU (25/Set/2026)')
{
  const EXEC = 'Beacon Research (D)/ Shaw & Co. Research (R)'
  const base = [...HOJE, p('Fox News', '2026-09-14', 51, 44)]
  const exec = [...HOJE, p(EXEC, '2026-09-14', 51, 44)]

  // 1) RENOMEACAO: saiu sob um rotulo, entrou sob o outro, mesma casa e onda.
  const ren = comparar(base, exec)
  conferir('renomeacao: 1 par, e nenhuma entrada nem saida', ren.renomeadas.length === 1 && ren.entraram.length === 0 && ren.sairam.length === 0)
  conferir('renomeacao: o veredito NAO diz PESQUISA_NOVA', !veredito(ren, 0).includes('PESQUISA_NOVA'), veredito(ren, 0).join('+'))
  conferir('renomeacao: o veredito NAO diz COMPOSICAO', !veredito(ren, 0).includes('COMPOSICAO'))
  conferir('renomeacao: o veredito diz RENOMEACAO', veredito(ren, 0).includes('RENOMEACAO'))
  conferir('renomeacao: a subtracao fecha', conferirSubtracao(base, exec, ren).length === 0)

  // 2) DEDUPLICACAO: a casa estava DUAS vezes e passou a estar uma.
  const duplo = [...HOJE, p(EXEC, '2026-09-14', 51, 44), p('Fox News', '2026-09-14', 51, 44)]
  const dedup = comparar(duplo, exec)
  conferir('deduplicacao: 1 deduplicada e ZERO saidas', dedup.deduplicadas.length === 1 && dedup.sairam.length === 0)
  conferir('deduplicacao: o veredito NAO diz COMPOSICAO', !veredito(dedup, -0.01).includes('COMPOSICAO'), veredito(dedup, -0.01).join('+'))
  conferir('deduplicacao: o veredito diz DEDUPLICACAO', veredito(dedup, -0.01).includes('DEDUPLICACAO'))
  conferir('deduplicacao: a subtracao fecha', conferirSubtracao(duplo, exec, dedup).length === 0)

  // 3) 🔴 DUPLICOU: o sentido inverso, que NAO pode se calar.
  const dup = comparar(exec, duplo)
  conferir('duplicou: 1 duplicada e ZERO entradas', dup.duplicaram.length === 1 && dup.entraram.length === 0)
  conferir('duplicou: o veredito GRITA DUPLICOU', veredito(dup, 0.01)[0] === 'DUPLICOU', veredito(dup, 0.01).join('+'))
  conferir('duplicou: e NAO se disfarca de PESQUISA_NOVA', !veredito(dup, 0.01).includes('PESQUISA_NOVA'))
  conferir('duplicou: a subtracao fecha', conferirSubtracao(exec, duplo, dup).length === 0)

  // ⛔ ANTI-EXCESSO: o que NAO pode ser confundido com renomeacao nem duplicata.
  const casaNova = comparar(HOJE, [p('Quinnipiac', '2026-09-14', 49, 42), ...HOJE])
  conferir('casa DIFERENTE entrando segue PESQUISA_NOVA', veredito(casaNova, 0.2).includes('PESQUISA_NOVA') && casaNova.duplicaram.length === 0)
  const outraOnda = comparar(exec, [p(EXEC, '2026-09-21', 52, 43), ...exec])
  conferir('a MESMA casa em outra ONDA segue PESQUISA_NOVA', veredito(outraOnda, 0.2).includes('PESQUISA_NOVA') && outraOnda.duplicaram.length === 0)
  const semTabela = comparar([...HOJE, p('Casa Sem Tabela', '2026-09-14', 51, 44)], [...HOJE, p('Outra Casa Qualquer', '2026-09-14', 51, 44)])
  conferir('nomes NAO declarados nao viram renomeacao', semTabela.renomeadas.length === 0 && semTabela.entraram.length === 1 && semTabela.sairam.length === 1)
}

// ─────────────────────────────────────────────────────────────────────────────
// ⚖️ O PESO DE CADA CAUSA, `decompor`. Casos com números feitos à mão.
// ─────────────────────────────────────────────────────────────────────────────
{
  console.log('\n⚖️ decompor: o peso de cada causa')

  // 🔢 A DELEGAÇÃO: `mediaDe` tinha a convenção de arredondamento INLINE, e a
  // régua de 29/Set manda importar a de produção. Se alguém reescrever a conta
  // aqui dentro outra vez, estas asserções caem.
  const amostras = [
    [p('A', '2026-09-28', 50, 40)],
    [p('A', '2026-09-28', 50, 40), p('B', '2026-09-27', 52, 42)],
    [p('A', '2026-09-28', 50.01, 42.41), p('B', '2026-09-27', 50.0, 42.43)],
    [p('A', '2026-09-28', 48, 41.02), p('B', '2026-09-27', 48, 42.39)],
  ]
  conferir(
    'mediaDe DELEGA a vantagemDeProducao em dem, rep e vantagem',
    amostras.every((l) => {
      const a = mediaDe(l)
      const b = vantagemDeProducao(l)
      return a.dem === b.dem && a.rep === b.rep && a.vantagemDem === b.vantagemDem
    }),
  )
  conferir('mediaDe segue devolvendo o n', mediaDe(amostras[1]).n === 2)

  // ── CASO 1: UMA causa só. O peso dela É o total, e a ordem não existe.
  const base1 = [p('X', '2026-09-20', 50, 40), p('Y', '2026-09-19', 50, 40)]
  const dep1 = [...base1, p('Z', '2026-09-28', 40, 40)]
  const c1 = comparar(base1, dep1)
  const d1 = decompor(base1, dep1, c1)
  conferir('1 causa: total -3.33pp', d1.total === -3.33, `total=${d1.total}`)
  conferir('1 causa: o peso dela é o TOTAL', d1.causas[0].sozinha === -3.33 && d1.causas[0].porUltimo === -3.33)
  conferir('1 causa: fecha e a ordem NÃO importa', d1.fecha === true && d1.ordemImporta === false)
  // ⛔ ANTI-EXCESSO: causa que não acendeu não aparece.
  conferir('1 causa: só UMA causa na saída', d1.causas.length === 1 && d1.causas[0].causa === 'entraram')
  conferir('1 causa: `sairam` NÃO aparece', !d1.causas.some((c) => c.causa === 'sairam'))

  // ── CASO 2: DUAS causas, e é o caso que separa FECHAR de ORDEM IMPORTAR.
  //    base dem 50 / rep 40 → D+10.00
  //    depois dem 47.33 / rep 40.67 → D+6.66, total −3.34pp
  //    saída: sozinha 0.00 (sobram A e B, D+10.00) · por último −0.84
  //    entrada: sozinha −2.50 · por último −3.34
  //    meios −0.42 e −2.92 somam −3.34, que FECHA, e ainda assim as duas
  //    ordens discordam em 0.84pp, então número único seria desonesto.
  const A2 = p('A', '2026-09-20', 50, 40)
  const B2 = p('B', '2026-09-19', 52, 42)
  const C2 = p('C', '2026-09-18', 48, 38)
  const base2 = [A2, B2, C2]
  const dep2 = [A2, B2, p('D', '2026-09-28', 40, 40)]
  const c2 = comparar(base2, dep2)
  const d2 = decompor(base2, dep2, c2)
  const saiu2 = d2.causas.find((c) => c.causa === 'sairam')
  const entrou2 = d2.causas.find((c) => c.causa === 'entraram')
  conferir('2 causas: total -3.34pp', d2.total === -3.34, `total=${d2.total}`)
  conferir('2 causas: a saída vai de 0.00 a -0.84', saiu2.sozinha === 0 && saiu2.porUltimo === -0.84, JSON.stringify(saiu2))
  conferir('2 causas: a entrada vai de -2.50 a -3.34', entrou2.sozinha === -2.5 && entrou2.porUltimo === -3.34, JSON.stringify(entrou2))
  conferir('2 causas: os meios SOMAM o total', d2.fecha === true && d2.somaDosMeios === d2.total)
  conferir('2 causas: e mesmo FECHANDO, a ORDEM IMPORTA', d2.ordemImporta === true)
  conferir('2 causas: a faixa sai ordenada', saiu2.faixa[0] <= saiu2.faixa[1] && entrou2.faixa[0] <= entrou2.faixa[1])

  // ── CASO 3 (ANTI-SILÊNCIO): peso ZERO é ACHADO, não motivo para sumir.
  //    Sai uma D+10 e entra outra D+10: a média não se move, e as duas causas
  //    acenderam. Omitir a de peso zero é o que faria o relato citar uma causa
  //    que não moveu nada como se tivesse movido.
  const base3 = [p('X', '2026-09-20', 50, 40), p('Y', '2026-09-01', 50, 40)]
  const dep3 = [p('X', '2026-09-20', 50, 40), p('Z', '2026-09-28', 50, 40)]
  const d3 = decompor(base3, dep3, comparar(base3, dep3))
  conferir('peso zero: total 0.00pp', d3.total === 0)
  conferir('peso zero: as DUAS causas seguem na saída', d3.causas.length === 2, JSON.stringify(d3.causas.map((c) => c.causa)))
  conferir('peso zero: e as duas valem 0.00pp', d3.causas.every((c) => c.sozinha === 0 && c.porUltimo === 0))
  conferir('peso zero: fecha, e a ordem não importa', d3.fecha === true && d3.ordemImporta === false)

  // ── CASO 4 (ANTI-SILÊNCIO): cenário que fica com ZERO rodada é
  //    INDETERMINADO, nunca 0.00pp. Média de lista vazia não existe, e chamá-la
  //    de zero é inventar medida.
  const base4 = [p('X', '2026-09-20', 50, 40)]
  const dep4 = [p('Z', '2026-09-28', 40, 40)]
  const d4 = decompor(base4, dep4, comparar(base4, dep4))
  const saiu4 = d4.causas.find((c) => c.causa === 'sairam')
  conferir('zero rodada: a saída sai INDETERMINADA', saiu4.indeterminado === true, JSON.stringify(saiu4))
  conferir('zero rodada: e NÃO sai valendo 0.00pp', saiu4.sozinha === undefined && saiu4.porUltimo === undefined)
  conferir('zero rodada: a causa é nomeada em `indeterminadas`', d4.indeterminadas.includes('sairam'))
  // ⛔ E com causa indeterminada ele NÃO pode alegar que a conta fechou: a
  //    interação carrega o total inteiro, porque nada foi medido.
  conferir('zero rodada: NÃO alega que fecha', d4.fecha === false && d4.ordemImporta === true, JSON.stringify({ fecha: d4.fecha, interacao: d4.interacao }))

  // ── CASO 5: a IDENTIDADE que não pode quebrar nunca.
  for (const [rotulo, d] of [['1 causa', d1], ['2 causas', d2], ['peso zero', d3], ['zero rodada', d4]]) {
    conferir(
      `identidade (${rotulo}): soma dos meios + interação = total`,
      Math.abs(d.somaDosMeios + d.interacao - d.total) < 1e-9,
      `meios=${d.somaDosMeios} interacao=${d.interacao} total=${d.total}`,
    )
  }

  // ── CASO 6: a TROCA (correção de valor) também é causa e também é medida.
  const base6 = [p('A', '2026-09-20', 50, 40), p('B', '2026-09-19', 50, 40)]
  const dep6 = [p('A', '2026-09-20', 50, 40), p('B', '2026-09-19', 44, 40)]
  const d6 = decompor(base6, dep6, comparar(base6, dep6))
  conferir('troca: `mudaram` aparece como causa', d6.causas.some((c) => c.causa === 'mudaram'), JSON.stringify(d6.causas.map((c) => c.causa)))
  conferir('troca: e carrega o total, -3.00pp', d6.total === -3 && d6.causas[0].sozinha === -3)

  // ── CASO 7 (ANTI-EXCESSO): entrada ruim não derruba, devolve null.
  conferir('null: decompor(null,null,null) é null', decompor(null, null, null) === null)
  conferir('null: lista vazia é null', decompor([], [], { entraram: [], sairam: [] }) === null)
  conferir('null: sem o resultado de comparar é null', decompor(base1, dep1, null) === null)

  // ── CASO 8: a TOLERÂNCIA é meio centésimo, que é o que não existe na tela.
  conferir('a tolerância de ordem é 0.005', TOLERANCIA_DE_ORDEM === 0.005)
}

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${passes} passaram, ${falhas} falharam.`)
process.exit(falhas === 0 ? 0 : 1)
