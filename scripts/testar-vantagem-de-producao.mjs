/**
 * testar-vantagem-de-producao.mjs · a convenção de arredondamento da média tem UMA casa.
 *
 * 🔴 O CASO QUE CRIOU ISTO, 28 e 29/Set/2026. A regra vivia INLINE dentro de
 *    `media()`, então todo medidor que quisesse o mesmo número reescrevia ela.
 *    O `efeito-do-recorte-us.mjs` reescreveu e divergiu em UM CENTÉSIMO, que é o
 *    tamanho exato que não dispara portão nenhum:
 *
 *      produção  : arredonda dem e rep a 2 casas e SÓ ENTÃO subtrai  ->  7.58
 *      a cópia   : média das DIFERENÇAS, arredondada uma vez         ->  7.59
 *
 *    Em 28/Set o cabeçalho do passo 9 dizia D+7.59 contra o D+7.58 do arquivo, do
 *    portão e do passo 8. Em 29/Set, com o cabeçalho já LENDO o arquivo, sobraram
 *    as 18 linhas de contrafactual na conta bruta, e a saída passou a se
 *    contradizer dentro dela mesma: `D+7.59 (+0.00pp)` logo abaixo de
 *    `MÉDIA SERVIDA: D+7.58`. Consertar o campo e deixar o vizinho trocou um erro
 *    coerente por duas verdades na mesma tela.
 *
 * ⚖️ Metade das mutações é ANTI-SILÊNCIO, contra a convenção voltar a divergir.
 *    Metade é ANTI-EXCESSO, porque o erro simétrico deste conserto é uma função
 *    que endurece até recusar entrada legítima, ou que troca a convenção da casa
 *    por outra "mais correta" e quebra a comparabilidade da série inteira.
 */

import { vantagemDeProducao } from '../lib/us-polls/collect.mjs'

let ok = 0
let falhas = 0
const eq = (a, e, nome) => {
  const bate = JSON.stringify(a) === JSON.stringify(e)
  if (bate) ok++
  else {
    falhas++
    console.log(`   ❌ ${nome}\n      esperado ${JSON.stringify(e)}\n      obtido   ${JSON.stringify(a)}`)
  }
}

console.log('\n🔢 VANTAGEM DE PRODUÇÃO — a convenção de arredondamento\n')

// ── 1 · O TRIO PUBLICADO de 28/Set/2026, que é a coerência que a convenção compra
//
// A tela publicou dem 49.29, rep 41.71 e vantagem 7.58, e a propriedade que a
// convenção existe para garantir é esta: quem subtrai os DOIS números da tela
// chega ao TERCEIRO. Nenhum leitor tem acesso às 34 linhas; ele tem os três
// números impressos.
//
// ⚠️ Este caso NÃO separa as duas convenções por si só, e escrever que separava
//    foi o primeiro erro deste arquivo. Quem separa são os dois pares abaixo, e
//    a diferença importa: sem eles o mutante do defeito de 28/Set era pego pela
//    guarda de NaN e não pelo arredondamento, o que daria um teste verde
//    protegendo a coisa errada. Conferidor que eu escrevo também é um medidor.
const casoReal = [
  { dem: 49.29, rep: 41.71 },
  { dem: 49.29, rep: 41.71 },
]
eq(vantagemDeProducao(casoReal), { dem: 49.29, rep: 41.71, vantagemDem: 7.58 }, 'trio publicado 28/Set: 49.29 - 41.71 fecha em 7.58')

// 🔑 OS DOIS SEPARADORES, medidos por varredura e não supostos. Aqui as duas
//    convenções DIVERGEM em um centésimo, e em DIREÇÕES OPOSTAS, para que um
//    mutante que erra sempre para o mesmo lado também caia.
//
//    A conta: arredondar dem e rep separadamente introduz dois erros de até meio
//    centésimo cada, e quando eles apontam para lados contrários a diferença
//    atravessa a borda de arredondamento. Nada disso é defeito: é a convenção,
//    ela é a da série inteira, e trocá-la quebraria a comparabilidade.
const separador = [
  { dem: 50.01, rep: 42.41 },
  { dem: 50.0, rep: 42.43 },
]
const sep = vantagemDeProducao(separador)
eq(sep.dem, 50, 'separador para BAIXO: a media de dem sai 50.00 e nao 50.01')
eq(sep.rep, 42.42, 'separador para BAIXO: a media de rep sai 42.42')
eq(sep.vantagemDem, 7.58, 'separador para BAIXO: producao da 7.58 onde a media das diferencas daria 7.59')

// 📌 A soma vence o literal: `(50.005).toFixed(2)` devolve "50.01", mas
//    `((50.01 + 50.00) / 2).toFixed(2)` devolve "50.00", porque o caminho da soma
//    cai em 50.004999999999995. A convenção é o que a SOMA faz, que é o caminho
//    que a produção percorre, e não o que o literal sugere.
eq(Number(((50.01 + 50.0) / 2).toFixed(2)), 50, 'a soma cai em 50.00, o literal 50.005 iria a 50.01')

const separadorPraCima = [
  { dem: 48, rep: 41.02 },
  { dem: 48, rep: 42.39 },
]
eq(vantagemDeProducao(separadorPraCima).vantagemDem, 6.3, 'separador para CIMA: producao da 6.30 onde a media das diferencas daria 6.29')

// ── 2 · Casos de forma ────────────────────────────────────────────────────
eq(vantagemDeProducao([{ dem: 48, rep: 44 }]), { dem: 48, rep: 44, vantagemDem: 4 }, 'uma rodada só é média válida')
eq(vantagemDeProducao([]), null, 'lista vazia devolve null')
eq(vantagemDeProducao(null), null, 'null devolve null')
eq(vantagemDeProducao(undefined), null, 'undefined devolve null')
eq(vantagemDeProducao('49,41'), null, 'string não é lista')
eq(vantagemDeProducao({ dem: 49, rep: 41 }), null, 'objeto solto não é lista')

// 📌 Endurecimento DECLARADO: com valor em string a soma antiga concatenava e
//    devolvia NaN em silêncio. Aqui ela tem de devolver o número certo.
eq(
  vantagemDeProducao([{ dem: '49.00', rep: '41.00' }]),
  { dem: 49, rep: 41, vantagemDem: 8 },
  'valor em string é convertido, não concatenado'
)
eq(vantagemDeProducao([{ dem: 'x', rep: 41 }]), null, 'valor ilegível devolve null, não NaN')
eq(vantagemDeProducao([{ rep: 41 }]), null, 'campo dem ausente devolve null')

// Vantagem NEGATIVA é resultado legítimo: republicano à frente.
eq(vantagemDeProducao([{ dem: 44.5, rep: 47.5 }]), { dem: 44.5, rep: 47.5, vantagemDem: -3 }, 'R na frente dá vantagem negativa')

// O ponto flutuante não pode vazar: 0.1 + 0.2 nesta conta daria 7.700000000000001.
eq(vantagemDeProducao([{ dem: 49.1, rep: 41.4 }]).vantagemDem, 7.7, 'não vaza resíduo de ponto flutuante')

// A função NÃO filtra, NÃO ordena e NÃO deduplica: ela só arredonda. Quem
// escolhe quais rodadas entram é a `media()`, e misturar as duas coisas aqui
// seria a segunda cópia da regra de deduplicação.
const comRepetida = [
  { dem: 50, rep: 40 },
  { dem: 50, rep: 40 },
  { dem: 50, rep: 40 },
]
eq(vantagemDeProducao(comRepetida).vantagemDem, 10, 'não deduplica: três linhas iguais contam três vezes')

// ── 3 · MUTAÇÕES ──────────────────────────────────────────────────────────
//
// Cada mutante é uma versão plausivelmente errada. O teste EXIGE que cada um
// discorde da função verdadeira em pelo menos um caso.
const mutantes = [
  {
    nome: '🔇 anti-silêncio · média das DIFERENÇAS, arredondada uma vez (o defeito de 28/Set)',
    f: (l) => {
      if (!Array.isArray(l) || !l.length) return null
      const v = Number((l.reduce((s, p) => s + (Number(p.dem) - Number(p.rep)), 0) / l.length).toFixed(2))
      return { dem: Number((l.reduce((s, p) => s + Number(p.dem), 0) / l.length).toFixed(2)), rep: Number((l.reduce((s, p) => s + Number(p.rep), 0) / l.length).toFixed(2)), vantagemDem: v }
    },
  },
  {
    nome: '🔇 anti-silêncio · NÃO arredonda dem e rep antes de subtrair',
    f: (l) => {
      if (!Array.isArray(l) || !l.length) return null
      const d = l.reduce((s, p) => s + Number(p.dem), 0) / l.length
      const r = l.reduce((s, p) => s + Number(p.rep), 0) / l.length
      return { dem: Number(d.toFixed(2)), rep: Number(r.toFixed(2)), vantagemDem: Number((d - r).toFixed(2)) }
    },
  },
  {
    nome: '🔇 anti-silêncio · arredonda a UMA casa',
    f: (l) => {
      if (!Array.isArray(l) || !l.length) return null
      const m = (k) => Number((l.reduce((s, p) => s + Number(p[k]), 0) / l.length).toFixed(1))
      return { dem: m('dem'), rep: m('rep'), vantagemDem: Number((m('dem') - m('rep')).toFixed(1)) }
    },
  },
  {
    nome: '🔇 anti-silêncio · TRUNCA em vez de arredondar',
    f: (l) => {
      if (!Array.isArray(l) || !l.length) return null
      const m = (k) => Math.trunc((l.reduce((s, p) => s + Number(p[k]), 0) / l.length) * 100) / 100
      return { dem: m('dem'), rep: m('rep'), vantagemDem: Number((m('dem') - m('rep')).toFixed(2)) }
    },
  },
  {
    nome: '🔇 anti-silêncio · devolve o resíduo de ponto flutuante',
    f: (l) => {
      if (!Array.isArray(l) || !l.length) return null
      const m = (k) => Number((l.reduce((s, p) => s + Number(p[k]), 0) / l.length).toFixed(2))
      return { dem: m('dem'), rep: m('rep'), vantagemDem: m('dem') - m('rep') }
    },
  },
  {
    nome: '🧨 anti-silêncio · engole valor ilegível e devolve NaN',
    f: (l) => {
      if (!Array.isArray(l) || !l.length) return null
      const m = (k) => Number((l.reduce((s, p) => s + Number(p[k]), 0) / l.length).toFixed(2))
      return { dem: m('dem'), rep: m('rep'), vantagemDem: Number((m('dem') - m('rep')).toFixed(2)) }
    },
  },
  {
    nome: '🚫 anti-excesso · recusa lista de UMA rodada',
    f: (l) => {
      if (!Array.isArray(l) || l.length < 2) return null
      const m = (k) => Number((l.reduce((s, p) => s + Number(p[k]), 0) / l.length).toFixed(2))
      return { dem: m('dem'), rep: m('rep'), vantagemDem: Number((m('dem') - m('rep')).toFixed(2)) }
    },
  },
  {
    nome: '🚫 anti-excesso · devolve zero em vez de null na lista vazia',
    f: (l) => {
      if (!Array.isArray(l) || !l.length) return { dem: 0, rep: 0, vantagemDem: 0 }
      const m = (k) => Number((l.reduce((s, p) => s + Number(p[k]), 0) / l.length).toFixed(2))
      return { dem: m('dem'), rep: m('rep'), vantagemDem: Number((m('dem') - m('rep')).toFixed(2)) }
    },
  },
  {
    nome: '🚫 anti-excesso · DEDUPLICA por conta própria, invadindo a regra da media()',
    f: (l) => {
      if (!Array.isArray(l) || !l.length) return null
      const u = [...new Map(l.map((p) => [`${p.dem}|${p.rep}`, p])).values()]
      const m = (k) => Number((u.reduce((s, p) => s + Number(p[k]), 0) / u.length).toFixed(2))
      return { dem: m('dem'), rep: m('rep'), vantagemDem: Number((m('dem') - m('rep')).toFixed(2)) }
    },
  },
  {
    nome: '🚫 anti-excesso · zera vantagem negativa, como se R na frente fosse defeito',
    f: (l) => {
      if (!Array.isArray(l) || !l.length) return null
      const m = (k) => Number((l.reduce((s, p) => s + Number(p[k]), 0) / l.length).toFixed(2))
      const v = Number((m('dem') - m('rep')).toFixed(2))
      return { dem: m('dem'), rep: m('rep'), vantagemDem: Math.max(0, v) }
    },
  },
]

// As entradas contra as quais cada mutante é medido. `dem: 'x'` existe para o
// mutante do NaN ser pego: ele passa em tudo menos nela.
const entradas = [casoReal, separador, separadorPraCima, [], null, [{ dem: 48, rep: 44 }], [{ dem: 49.1, rep: 41.4 }], comRepetida, [{ dem: 44.5, rep: 47.5 }], [{ dem: 'x', rep: 41 }], [{ dem: '49.00', rep: '41.00' }]]

console.log('\n🧪 MUTAÇÕES\n')
let reprovadas = 0
for (const m of mutantes) {
  let pego = false
  for (const e of entradas) {
    const a = JSON.stringify(vantagemDeProducao(e))
    let b
    try {
      b = JSON.stringify(m.f(e))
    } catch {
      b = 'LANCOU'
    }
    if (a !== b) {
      pego = true
      break
    }
  }
  if (pego) {
    reprovadas++
    console.log(`   ✅ reprovada · ${m.nome}`)
  } else {
    falhas++
    console.log(`   ❌ PASSOU, e não devia · ${m.nome}`)
  }
}

console.log(`\n   ${reprovadas} de ${mutantes.length} mutações reprovadas`)
console.log(`\n${falhas === 0 ? '✅' : '❌'} VEREDITO: ${falhas === 0 ? 'APROVADO' : 'REPROVADO'} · ${ok} asserção(ões) ok, ${falhas} falha(s)\n`)
process.exit(falhas === 0 ? 0 : 1)
