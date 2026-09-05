/**
 * testar-serie-contrato.mjs — casos plantados para `lib/serie-contrato.mjs`,
 * a regra que decide se um superlativo pode ser escrito. Sem rede.
 *
 * 🔑 Os dois casos que mais importam são o 3 e o 4, e os dois nasceram de
 * defeitos MEDIDOS em 04/Set/2026, não imaginados:
 *
 *   3. A janela de 90 dias da API esconde o começo da série do Senado e mesmo
 *      assim devolve `truncated: false`. O topo real, 57,50 de 16/Abr, aparece
 *      como 52,50. Superlativo falso não dá erro.
 *   4. A chave da captura certificada é a PERGUNTA e a do backup é o DESFECHO.
 *      Sem mapa nada casa; com mapa e leitura velha, casa e MENTE, que é pior.
 *
 * Uso: node scripts/testar-serie-contrato.mjs
 */

import {
  agruparPorLivro,
  casarCaptura,
  estaEncerrada,
  extremos,
  idadeEmHoras,
  instantesSuspeitos,
  janela,
  oQueAJanelaEsconde,
  serieDe,
  vereditoSuperlativo,
} from './lib/serie-contrato.mjs'

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

const HOJE = new Date('2026-09-05T02:00:00.000Z')
const ponto = (t, v, slug = 'senado', outcome = 'Democratas') => ({ t, v, slug, outcome })

console.log('\n1. A leitura do backup: junção por id e igualdade EXATA de slug')
{
  const mercados = new Map([
    ['m1', { id: 'm1', slug: 'brazil-presidential-election' }],
    ['m2', { id: 'm2', slug: 'brazil-presidential-election-first-round-2nd-place' }],
  ])
  const saidas = new Map([
    ['o1', { id: 'o1', marketId: 'm1', outcomeName: 'Renan Santos' }],
    ['o2', { id: 'o2', marketId: 'm2', outcomeName: 'Renan Santos' }],
  ])
  const precos = [
    { outcomeId: 'o1', price: '5.00', snapshotAt: '2026-09-01T10:00:00Z' },
    { outcomeId: 'o2', price: '60.20', snapshotAt: '2026-09-01T10:00:00Z' },
  ]
  const s = serieDe(precos, saidas, mercados, { slug: 'brazil-presidential-election' })
  conferir('o mesmo nome vive em DOIS livros e o filtro exato pega só um', s.length === 1 && s[0].v === 5, JSON.stringify(s))
  conferir(
    '🔴 se o filtro fosse por PREFIXO, o 60,20 do 2º lugar entraria como se fosse o de vencedor',
    serieDe(precos, saidas, mercados, {}).length === 2
  )
  conferir('agrupa por livro + desfecho', agruparPorLivro(serieDe(precos, saidas, mercados, {})).size === 2)
  conferir('preço vem em pontos percentuais, não em fração', s[0].v === 5.0)
}

console.log('\n2. Extremos e veredito')
{
  const s = [ponto('2026-08-01T00:00:00Z', 45), ponto('2026-08-15T00:00:00Z', 52.5), ponto('2026-09-01T00:00:00Z', 48)]
  const e = extremos(s)
  conferir('acha topo e piso com as DATAS deles', e.max === 52.5 && e.maxEm.startsWith('2026-08-15') && e.min === 45)
  conferir('série vazia devolve null e não um objeto de zeros', extremos([]) === null)

  conferir('valor acima do topo -> RECORDE', vereditoSuperlativo(53, e).veredito === 'RECORDE')
  conferir('valor abaixo do piso -> PISO', vereditoSuperlativo(44, e).veredito === 'PISO')
  conferir('valor no meio -> DENTRO, sem autorizar superlativo', vereditoSuperlativo(48, e).veredito === 'DENTRO')
  conferir(
    '⚠️ EMPATAR com o topo NÃO é recorde, e a distância sai 0.00pp',
    vereditoSuperlativo(52.5, e).veredito === 'DENTRO' && vereditoSuperlativo(52.5, e).motivo.includes('0.00pp do topo'),
    vereditoSuperlativo(52.5, e).motivo
  )
  conferir('sem série, o veredito é SEM_SERIE e não DENTRO', vereditoSuperlativo(50, null).veredito === 'SEM_SERIE')
}

console.log('\n2b. 🔴 A SÉRIE QUE ACABOU, achada conferindo a própria ferramenta')
{
  // Caso real: o PODEMOS no Senado brasileiro, último ponto em 23/Jun. A
  // ferramenta imprimia "DENTRO: 0.70 está a 29.70pp do topo", como se 0,70
  // fosse o preço de agora. Livro sem ponto novo não tem preço de agora.
  const morta = [ponto('2026-05-11T00:00:00Z', 30.4), ponto('2026-06-12T00:00:00Z', 0.5), ponto('2026-06-23T21:00:00Z', 0.7)]
  const viva = [ponto('2026-08-30T00:00:00Z', 30.4), ponto('2026-09-04T16:30:00Z', 0.7)]

  conferir('série parada há 2 meses é ENCERRADA', estaEncerrada(extremos(morta), { agora: HOJE }))
  conferir('⭐ série com ponto de ontem NÃO é encerrada', estaEncerrada(extremos(viva), { agora: HOJE }) === false)
  conferir(
    'o corte é de 7 dias, e 6 dias ainda é viva',
    estaEncerrada(extremos([ponto('2026-08-30T02:00:00Z', 5)]), { agora: HOJE }) === false
  )
  conferir(
    'e 8 dias já é encerrada',
    estaEncerrada(extremos([ponto('2026-08-27T00:00:00Z', 5)]), { agora: HOJE }) === true
  )
  conferir('sem série, não é encerrada nem por acidente', estaEncerrada(null) === false)

  const v = vereditoSuperlativo(0.7, extremos(morta), { encerrada: true })
  conferir('⏹ o veredito vira SERIE_ENCERRADA', v.veredito === 'SERIE_ENCERRADA')
  conferir('e ele diz a DATA do último ponto e nega ser preço de agora', v.motivo.includes('2026-06-23') && v.motivo.includes('NÃO é preço de agora'))
  conferir(
    '⛔ sem a marca, o mesmo valor sairia como DENTRO a 29.70pp do topo',
    vereditoSuperlativo(0.7, extremos(morta)).veredito === 'DENTRO' &&
      vereditoSuperlativo(0.7, extremos(morta)).motivo.includes('29.70pp do topo')
  )
}

console.log('\n2c. 🔴 O portão que NÃO PODIA disparar: comparar contra a série SEM o ponto julgado')
{
  // Achado em 04/Set conferindo a ferramenta depois de subi-la. O CLI montava a
  // série COM o valor de agora dentro e comparava o valor contra ela. Aí
  // `agora > max` é impossível por construção, e RECORDE nunca saía. Os testes
  // do bloco 2 passavam porque usam um valor que NÃO está no fixture.
  const gravados = [ponto('2026-08-01T00:00:00Z', 45), ponto('2026-08-15T00:00:00Z', 52.5)]
  const agora = 56.0 // preço novo, acima de tudo que foi gravado

  const comAgora = [...gravados, ponto('2026-09-05T02:00:00Z', agora)]
  conferir(
    '⛔ comparando contra a série COM o ponto dentro, o recorde some',
    vereditoSuperlativo(agora, extremos(comAgora)).veredito === 'DENTRO',
    vereditoSuperlativo(agora, extremos(comAgora)).veredito
  )
  conferir(
    '✅ comparando contra os pontos ANTERIORES, ele aparece',
    vereditoSuperlativo(agora, extremos(gravados)).veredito === 'RECORDE',
    vereditoSuperlativo(agora, extremos(gravados)).veredito
  )
  conferir(
    'e o mesmo vale para o piso',
    vereditoSuperlativo(40, extremos(gravados)).veredito === 'PISO' &&
      vereditoSuperlativo(40, extremos([...gravados, ponto('2026-09-05T02:00:00Z', 40)])).veredito === 'DENTRO'
  )
  // ⭐ Controle: sem leitura viva, o valor julgado é o ÚLTIMO GRAVADO, e ele
  // também precisa sair da série antes da comparação.
  conferir(
    '⭐ sem leitura viva, o último gravado se compara contra os anteriores a ele',
    vereditoSuperlativo(52.5, extremos(gravados.slice(0, -1))).veredito === 'RECORDE'
  )
}

console.log('\n3. 🔴 O que a janela de 90 dias da API ESCONDE (caso medido em 04/Set)')
{
  // Fixture com as datas e os valores reais do Senado dos EUA.
  const s = [
    ponto('2026-04-14T00:00:00Z', 50.0),
    ponto('2026-04-16T00:00:00Z', 57.5), // 🔑 o topo real, fora da janela
    ponto('2026-06-29T00:00:00Z', 39.5), // o piso, dentro da janela
    ponto('2026-07-15T00:00:00Z', 45.0),
    ponto('2026-08-20T00:00:00Z', 52.5), // o topo APARENTE de quem só vê 90 dias
    ponto('2026-09-04T15:00:00Z', 51.5),
  ]
  const esc = oQueAJanelaEsconde(s, 90, HOJE)
  conferir('a janela de 90d não cobre a série, e isso é reportado', esc !== null)
  conferir('diz quantos pontos ficam de fora', esc.pontosFora === 2, JSON.stringify(esc))
  conferir(
    '🔑 e diz que o TOPO REAL 57.50 apareceria como 52.50',
    esc.escondeMax && esc.escondeMax.real === 57.5 && esc.escondeMax.aparente === 52.5,
    JSON.stringify(esc.escondeMax)
  )
  conferir('o piso está DENTRO da janela, então não é reportado como escondido', esc.escondeMin === null)

  // O erro que isso evita, escrito como asserção.
  const dentroDaJanela = extremos(janela(s, 90, HOJE))
  conferir(
    '⛔ quem usasse só a API diria "1.00pp do topo"; a série diz 6.00pp',
    Number((dentroDaJanela.max - 51.5).toFixed(2)) === 1.0 && Number((extremos(s).max - 51.5).toFixed(2)) === 6.0
  )
  conferir(
    '⚠️ e o pior: pela janela, 52.50 seria RECORDE; pela série é DENTRO',
    vereditoSuperlativo(53, dentroDaJanela).veredito === 'RECORDE' && vereditoSuperlativo(53, extremos(s)).veredito === 'DENTRO'
  )

  // ⭐ Controle NEGATIVO: série curta cabe na janela e não pode gerar alarme.
  const curta = [ponto('2026-07-29T00:00:00Z', 85.5), ponto('2026-08-30T00:00:00Z', 89.5), ponto('2026-09-04T00:00:00Z', 87.5)]
  conferir('⭐ série que CABE na janela não dispara alarme nenhum', oQueAJanelaEsconde(curta, 90, HOJE) === null)
}

console.log('\n4. 🔴 A junção da captura certificada, e a leitura VELHA que mente')
{
  // As chaves reais gravadas por scripts/capture-guard.ts --pais=us.
  const precos = {
    'house:the Democratic Party control the House after the 2026 Midterm elections': 87.5,
    'house:the Republican Party control the House after the 2026 Midterm elections': 11.5,
    'senate:the Democratic Party control the Senate after the 2026 Midterm elections': 51.5,
    'senate:the Republican Party control the Senate after the 2026 Midterm elections': 49.5,
    'asScheduled:the 2026 Midterm Elections happen as scheduled': 96.8,
  }
  const { casadas, orfas } = casarCaptura(precos, 'us')
  conferir('as 5 chaves casam com livro + desfecho do backup', casadas.size === 5 && orfas.length === 0, JSON.stringify(orfas))
  conferir(
    'e casam no livro CERTO: Senado democrata é 51.5, não a Câmara',
    casadas.get('which-party-will-win-the-senate-in-2026␟Democratas') === 51.5 &&
      casadas.get('which-party-will-win-the-house-in-2026␟Democratas') === 87.5
  )
  conferir(
    '🔴 chave que não acha casa vira ÓRFÃ e aparece, em vez de sumir',
    (() => {
      const r = casarCaptura({ ...precos, 'governors:algo novo do Polymarket': 12 }, 'us')
      return r.orfas.length === 1 && r.orfas[0].startsWith('governors:')
    })()
  )
  conferir(
    'no Brasil não há mapa: a chave já é o nome do desfecho',
    casarCaptura({ 'presidential:Luiz Inácio Lula da Silva': 60.5 }, 'br').casadas.get('Luiz Inácio Lula da Silva') === 60.5
  )

  // 🕳️ A idade. Uma leitura que casa e está velha passa por atual.
  conferir('leitura de agora tem idade ~0', Math.abs(idadeEmHoras('2026-09-05T02:00:00.000Z', HOJE)) < 0.01)
  conferir(
    '🔴 a leitura da véspera que quase virou "agora" tinha 20.8h',
    Math.abs(idadeEmHoras('2026-09-04T05:11:37.397Z', HOJE) - 20.81) < 0.05,
    String(idadeEmHoras('2026-09-04T05:11:37.397Z', HOJE))
  )
  conferir('carimbo ausente devolve null, e não zero disfarçado de fresco', idadeEmHoras(null) === null)
  conferir('carimbo ilegível também devolve null', idadeEmHoras('ontem de manhã') === null)

  // O efeito concreto que a idade evita: com o valor velho, 89.5, o veredito
  // dizia "0.00pp do topo"; com o valor de agora, 87.5, diz 2.00pp.
  const camara = [ponto('2026-07-29T00:00:00Z', 85.5), ponto('2026-08-30T00:00:00Z', 89.5)]
  const e = extremos(camara)
  conferir(
    '⛔ o valor velho 89.5 dizia "0.00pp do topo"; o de agora, 87.5, diz 2.00pp',
    vereditoSuperlativo(89.5, e).motivo.includes('0.00pp do topo') &&
      vereditoSuperlativo(87.5, e).motivo.includes('2.00pp do topo')
  )
}

console.log('\n5. 🔴 A QUARENTENA do instante contaminado (28/Abr/2026)')
{
  const pt = (t, v) => ({ snapshotAt: t, price: String(v) })
  // Instante normal: um livro perto de 50 e o resto espalhado. É o caso comum,
  // e a mediana do backup real é ZERO por cento perto de 50.
  const normal = []
  for (let i = 0; i < 30; i++) normal.push(pt('2026-06-01T10:00:00Z', i === 0 ? 50.0 : (i % 25) + 1))
  conferir('⭐ instante normal, com 1 de 30 perto de 50, NÃO é quarentenado', instantesSuspeitos(normal).size === 0)

  // Instante contaminado: quase tudo perto de 50, como em 28/Abr 11:45:34.
  const ruim = []
  for (let i = 0; i < 30; i++) ruim.push(pt('2026-04-28T11:45:34Z', i < 28 ? 49.5 + (i % 5) * 0.2 : 3.4))
  const s = instantesSuspeitos(ruim)
  conferir('🔴 instante com 93% perto de 50 é quarentenado', s.size === 1 && s.has('2026-04-28T11:45:34'), JSON.stringify([...s]))
  conferir('e ele reporta a fração medida, não só o veredito', s.get('2026-04-28T11:45:34').frac > 0.9)

  // ⚠️ Instante pequeno não é julgado: 3 de 4 perto de 50 é ruído de amostra.
  const curto = [pt('2026-05-05T10:00:00Z', 50), pt('2026-05-05T10:00:00Z', 50), pt('2026-05-05T10:00:00Z', 50), pt('2026-05-05T10:00:00Z', 2)]
  conferir('⚠️ instante com menos de 20 pontos não é julgado', instantesSuspeitos(curto).size === 0)

  // 🔑 A hipótese FROUXA que eu testei primeiro e descartei: "mesmo preço em 3
  // livros no mesmo segundo". No backup real isso acontece 379 vezes, quase toda
  // em azarão de 1%, então ela daria falso positivo em massa. O caso abaixo é
  // legítimo e a regra boa tem de deixá-lo passar.
  const azarao = []
  for (let i = 0; i < 40; i++) azarao.push(pt('2026-07-10T08:00:00Z', i < 30 ? 1.0 : 20 + i))
  conferir(
    '⭐ 30 azarões empatados em 1,00% não são quarentenados: a regra olha perto de 50, não coincidência',
    instantesSuspeitos(azarao).size === 0
  )

  // O efeito concreto sobre o extremo, que é o motivo de tudo isto existir.
  const stf = [
    ponto('2026-04-20T00:00:00Z', 12.0, 'stf', 'Yes'),
    ponto('2026-04-28T11:45:34Z', 50.0, 'stf', 'Yes'), // o ponto de recuo
    ponto('2026-06-08T00:00:00Z', 2.1, 'stf', 'Yes'),
    ponto('2026-09-04T00:00:00Z', 19.3, 'stf', 'Yes'),
  ]
  conferir(
    '⛔ com o ponto de recuo, o topo do STF seria 50.00; sem ele, é 19.30',
    extremos(stf).max === 50 && extremos(stf.filter((p) => !p.t.startsWith('2026-04-28T11:45:34'))).max === 19.3
  )
}

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${passes} passaram, ${falhas} falharam.`)
process.exit(falhas === 0 ? 0 : 1)
