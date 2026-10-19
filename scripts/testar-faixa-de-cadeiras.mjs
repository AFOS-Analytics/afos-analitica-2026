#!/usr/bin/env node
/**
 * Testa `scripts/lib/faixa-de-cadeiras.mjs`.
 *
 * 🔴 POR QUE ELE NASCEU EM 19/OUT/2026: a regra dos limites vivia DENTRO do
 *    `check-distribuicao.ts`, sem teste nenhum, e o comentário dela já citava
 *    um defeito real de 11/Ago/2026, em que ler o formato errado devolvia zero
 *    faixa legível e o conferidor dava VERDE sem ter medido nada. Quando a
 *    Tradeoff passou a precisar da mesma leitura para ordenar as faixas, a
 *    regra virou lib compartilhada, e regra que DECIDE A CONTA sem teste é
 *    convite a reordenar os casamentos sem perceber.
 *
 * 🔑 A ORDEM dos casamentos É a regra, e metade deste arquivo existe para
 *    travá-la. Os dois casos que morrem em qualquer reordenação são:
 *      · o rótulo em PAR antes do valor ÚNICO
 *      · o valor ÚNICO por ÚLTIMO, senão `< 190 cad.` vira a faixa [190,190]
 */
import { limitesDaFaixa, ordenarPorLimite } from './lib/faixa-de-cadeiras.mjs'

let ok = 0
let falhas = 0
function eq(nome, achado, esperado) {
  const a = JSON.stringify(achado)
  const e = JSON.stringify(esperado)
  if (a === e) {
    ok++
    return
  }
  falhas++
  console.log(`  ❌ ${nome}`)
  console.log(`     esperado ${e}`)
  console.log(`     veio     ${a}`)
}
const lim = (s) => {
  const r = limitesDaFaixa(s)
  if (!r) return null
  // Infinity nao sobrevive ao JSON, entao vira rotulo legivel
  return { lo: r.lo === -Infinity ? '-inf' : r.lo, hi: r.hi === Infinity ? '+inf' : r.hi }
}

console.log('\n🔬 faixa-de-cadeiras\n')

// ══ OS DOIS FORMATOS, que diferem e os dois chegam ═══════════════════════
eq('API: "between 190 and 194"', lim('Will the GOP hold between 190 and 194 House seats after 2026?'), { lo: 190, hi: 194 })
eq('banco: travessao tipografico U+2013', lim('190–194 cad.'), { lo: 190, hi: 194 })
eq('banco: travessao longo U+2014', lim('190—194 cad.'), { lo: 190, hi: 194 })
eq('banco: hifen comum', lim('190-194 cad.'), { lo: 190, hi: 194 })
eq('faixa de UMA cadeira por intervalo', lim('49–49 cad.'), { lo: 49, hi: 49 })

// ══ AS ABERTAS, nas duas pontas ══════════════════════════════════════════
eq('"< 190 cad." abre a esquerda e o hi e 189', lim('< 190 cad.'), { lo: '-inf', hi: 189 })
eq('"below 190"', lim('below 190 seats'), { lo: '-inf', hi: 189 })
eq('"fewer than 190"', lim('fewer than 190 seats'), { lo: '-inf', hi: 189 })
eq('"under 190"', lim('under 190 seats'), { lo: '-inf', hi: 189 })
eq('"≥ 230 cad." abre a direita', lim('≥ 230 cad.'), { lo: 230, hi: '+inf' })
eq('"at least 230"', lim('at least 230 seats'), { lo: 230, hi: '+inf' })
eq('"230 or more"', lim('230 or more seats'), { lo: 230, hi: '+inf' })
eq('"≤ 47 cad." INCLUI o 47', lim('≤ 47 cad.'), { lo: '-inf', hi: 47 })
eq('"47 or fewer" INCLUI o 47', lim('47 or fewer seats'), { lo: '-inf', hi: 47 })
eq('"at most 47" INCLUI o 47', lim('at most 47 seats'), { lo: '-inf', hi: 47 })

// 🔑 A fronteira que separa "menos de" de "no maximo": um EXCLUI o numero e o
//    outro o INCLUI. Trocar os dois desloca a particao em uma cadeira e o
//    verificador passa a acusar buraco onde nao ha.
eq('🔑 "< 190" e "≤ 190" NAO sao a mesma faixa', [lim('< 190 cad.').hi, lim('≤ 190 cad.').hi], [189, 190])

// ══ EXATO e PAR ══════════════════════════════════════════════════════════
eq('"exactly 50"', lim('exactly 50 seats'), { lo: 50, hi: 50 })
eq('par em portugues, "22 ou 23 cad."', lim('22 ou 23 cad.'), { lo: 22, hi: 23 })
eq('par em ingles, "24 or 25"', lim('24 or 25 seats'), { lo: 24, hi: 25 })

// ══ VALOR UNICO, que e o ultimo recurso ══════════════════════════════════
eq('"48 cad."', lim('48 cad.'), { lo: 48, hi: 48 })
eq('"50 seats"', lim('50 seats'), { lo: 50, hi: 50 })

// ══ 🔴 A ORDEM DOS CASAMENTOS, que E a regra ═════════════════════════════
// Estes dois sao os que reprovam qualquer reordenacao, e cada um nomeia o
// defeito que a reordenacao produz.
eq('🔴 "< 190 cad." NAO pode virar [190,190]: o valor unico vem por ULTIMO', lim('< 190 cad.'), { lo: '-inf', hi: 189 })
eq('🔴 "22 ou 23 cad." NAO pode virar [22,22]: o par vem ANTES do valor unico', lim('22 ou 23 cad.'), { lo: 22, hi: 23 })
eq('e "≥ 230 cad." NAO pode virar [230,230]', lim('≥ 230 cad.'), { lo: 230, hi: '+inf' })
eq('e "≤ 47 cad." NAO pode virar [47,47]', lim('≤ 47 cad.'), { lo: '-inf', hi: 47 })

// ══ ANTI-EXCESSO: o que NAO e faixa devolve null ═════════════════════════
// ⛔ Devolver um numero aqui e pior que devolver null: quem chama ordena e
//    conta em cima disso, e rotulo que nao e faixa entraria na particao.
eq('rotulo sem numero devolve null', lim('Yes'), null)
eq('nome de partido devolve null', lim('Democrats'), null)
eq('vazio devolve null', lim(''), null)
eq('nulo devolve null, sem estourar', lim(null), null)
eq('indefinido devolve null, sem estourar', lim(undefined), null)
eq('numero NO MEIO do texto, sem forma de faixa, nao casa o inicio', lim('seats of 48'), null)

// ══ A ORDENACAO ══════════════════════════════════════════════════════════
{
  const reais = ['215–219 cad.', '< 190 cad.', '≥ 230 cad.', '205–209 cad.', '190–194 cad.']
  eq(
    'ordena pelo limite inferior, com a aberta a esquerda primeiro',
    ordenarPorLimite(reais.map((nome) => ({ nome }))).map((x) => x.nome),
    ['< 190 cad.', '190–194 cad.', '205–209 cad.', '215–219 cad.', '≥ 230 cad.']
  )
  // 📌 Rotulo ilegivel vai para o FIM e nao se mistura: sumir com ele
  //    esconderia particao quebrada, que e defeito de coleta.
  eq(
    '📌 rotulo que NAO e faixa vai para o fim, e nao desaparece',
    ordenarPorLimite([{ nome: 'Outro' }, { nome: '48 cad.' }, { nome: '≤ 47 cad.' }]).map((x) => x.nome),
    ['≤ 47 cad.', '48 cad.', 'Outro']
  )
  eq('lista vazia ordena para lista vazia', ordenarPorLimite([]), [])
  eq(
    'desempata pelo limite SUPERIOR quando o inferior empata',
    ordenarPorLimite([{ nome: '50–52 cad.' }, { nome: '50 cad.' }]).map((x) => x.nome),
    ['50 cad.', '50–52 cad.']
  )
  eq(
    'aceita extrator de nome proprio',
    ordenarPorLimite([{ r: '48 cad.' }, { r: '≤ 47 cad.' }], (x) => x.r).map((x) => x.r),
    ['≤ 47 cad.', '48 cad.']
  )
}

// ══ OS ROTULOS REAIS dos DOIS livros, porque regra sem caso real nao mede ═
{
  const camara = ['< 190 cad.', '190–194 cad.', '195–199 cad.', '200–204 cad.', '205–209 cad.', '210–214 cad.', '215–219 cad.', '220–224 cad.', '225–229 cad.', '≥ 230 cad.']
  eq('as 10 faixas da Camara sao TODAS legiveis', camara.filter((n) => !limitesDaFaixa(n)).length, 0)
  eq('e ja vem na ordem certa', ordenarPorLimite(camara.map((nome) => ({ nome }))).map((x) => x.nome), camara)
  // 🔑 A particao da Camara nao tem buraco nem sobreposicao, e isto o prova.
  const ls = camara.map((n) => limitesDaFaixa(n))
  let furos = 0
  for (let i = 1; i < ls.length; i++) if (ls[i].lo !== ls[i - 1].hi + 1) furos++
  eq('🔑 e a particao da Camara fecha sem furo nem sobreposicao', furos, 0)

  const senado = ['≤ 47 cad.', '48 cad.', '49 cad.', '50 cad.', '51 cad.', '52 cad.', '53 cad.', '54 cad.', '55 cad.', '56 cad.', '≥ 57 cad.']
  eq('as 11 faixas do Senado sao TODAS legiveis', senado.filter((n) => !limitesDaFaixa(n)).length, 0)
  eq('e ja vem na ordem certa', ordenarPorLimite(senado.map((nome) => ({ nome }))).map((x) => x.nome), senado)
  const ls2 = senado.map((n) => limitesDaFaixa(n))
  let furos2 = 0
  for (let i = 1; i < ls2.length; i++) if (ls2[i].lo !== ls2[i - 1].hi + 1) furos2++
  eq('🔑 e a particao do Senado tambem fecha', furos2, 0)
}

console.log(`\n${falhas === 0 ? '✅ APROVADO' : '❌ REPROVADO'}: ${ok} passaram, ${falhas} falharam\n`)
process.exit(falhas === 0 ? 0 : 1)
