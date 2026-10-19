#!/usr/bin/env node
/**
 * Testa `scripts/lib/numeros-com-unidade.mjs`.
 *
 * 🔴 POR QUE NASCEU EM 19/OUT/2026: a regra do token numérico decide se uma
 *    TRADUÇÃO publica ou não, e vivia em cópia única dentro do
 *    `gate-weekly-us.ts`. Quando o Tradeoff passou a precisar dela, virou lib.
 *    O Tradeoff publica em três idiomas desde 31/Jul e nunca tinha tido gate
 *    numérico nenhum.
 *
 * 🧪 E o controle positivo do dia é a razão de este arquivo existir: a primeira
 *    versão do gate no portão do Tradeoff media `cru.data`, que era `undefined`
 *    porque `cru` JÁ era o frontmatter, então ela comparava a string `{}` nos
 *    três idiomas e ficava SEMPRE verde. Só uma mutação plantada pegou.
 */
import { numerosComUnidade, compararNumeros } from './lib/numeros-com-unidade.mjs'

let ok = 0
let falhas = 0
function eq(nome, achado, esperado) {
  const a = JSON.stringify(achado)
  const e = JSON.stringify(esperado)
  if (a === e) { ok++; return }
  falhas++
  console.log(`  ❌ ${nome}\n     esperado ${e}\n     veio     ${a}`)
}

console.log('\n🔬 numeros-com-unidade\n')

// ══ as quatro unidades que contam ════════════════════════════════════════
eq('percentual', numerosComUnidade('fechou em 90.50%'), ['90.50%'])
eq('ponto percentual', numerosComUnidade('andou 2.00pp'), ['2.00pp'])
eq('milhao com M', numerosComUnidade('USD 10.75M acumulados'), ['10.75M'])
eq('espaco entre numero e unidade', numerosComUnidade('90.50 %'), ['90.50%'])
eq('varios na mesma frase, ORDENADOS', numerosComUnidade('de 62.50% para 64.50%, ou 2.00pp'), ['2.00pp', '62.50%', '64.50%'])

// ══ 🔑 O MILHAR, que muda de idioma e o decimal, que não ═════════════════
// EN vírgula, pt-BR e ES ponto. Sem normalizar, tradução CORRETA reprovaria.
eq('🔑 milhar com virgula e com ponto dão o MESMO token', [numerosComUnidade('2,633%'), numerosComUnidade('2.633%')], [['2633%'], ['2633%']])
eq('🔑 e o DECIMAL não é milhar: 7.54% fica 7.54%', numerosComUnidade('7.54%'), ['7.54%'])
eq('decimal de duas casas não é tocado', numerosComUnidade('0.73pp'), ['0.73pp'])
eq('milhar duplo', numerosComUnidade('1,032,500%'), ['1032500%'])
// ⛔ A fronteira: 3 digitos depois do separador é milhar, 2 é decimal.
eq('⛔ 103.10% NÃO é milhar, são 103 e 10 centésimos', numerosComUnidade('103.10%'), ['103.10%'])

// ══ o prefixo USD não entra, o sufixo M entra ════════════════════════════
eq('USD sozinho antes do numero não gera token', numerosComUnidade('custou 500 USD'), [])
eq('e em "USD 20.49M" vale o 20.49M', numerosComUnidade('USD 20.49M'), ['20.49M'])

// ══ ANTI-EXCESSO: numero SEM unidade não conta ═══════════════════════════
// ⛔ Contar numero sem unidade traria data, contagem de rodada e id de URL, e
//    o gate reprovaria tradução correta em todo idioma.
eq('data não conta', numerosComUnidade('em 2026-10-19'), [])
eq('contagem de rodada não conta', numerosComUnidade('31 rodadas de 23 institutos'), [])
eq('numero solto não conta', numerosComUnidade('44 leituras'), [])
eq('minusculo m dentro de palavra não conta', numerosComUnidade('USD 276 milhões'), [])
  // 🔑 A unidade é o M MAIUSCULO. Minusculo solto seria metro, nunca milhao, e
  //    e este o caso que distingue a regra sensivel a caixa da insensivel: o
  //    de cima nao distingue, porque em "milhoes" o m nao tem fronteira depois.
  eq('🔑 m minusculo SOLTO não é milhao', numerosComUnidade('andou 3 m'), [])
  eq('🔑 e "5m" minusculo também não', numerosComUnidade('5m de volume'), [])
  eq('🔑 PP maiusculo não é ponto percentual', numerosComUnidade('andou 2.00PP'), [])
  eq('e o M MAIUSCULO solto conta', numerosComUnidade('USD 3 M'), ['3M'])
eq('texto vazio', numerosComUnidade(''), [])
eq('nulo não estoura', numerosComUnidade(null), [])
eq('indefinido não estoura', numerosComUnidade(undefined), [])

// ══ A COMPARAÇÃO é de MULTICONJUNTO, não de conjunto ═════════════════════
{
  eq('iguais', compararNumeros(['1.00pp', '2.00%'], ['2.00%', '1.00pp']).iguais, true)
  const r = compararNumeros(['0.73pp'], ['0.75pp'])
  eq('🔴 valor trocado reprova', r.iguais, false)
  eq('e nomeia o que só existe na origem', r.falta, ['0.73pp'])
  eq('e o que só existe na tradução', r.sobra, ['0.75pp'])
  // 🔑 Esta é a trava que distingue multiconjunto de conjunto: o mesmo número
  //    duas vezes num lado e uma no outro É defeito de tradução.
  const d = compararNumeros(['5.00%', '5.00%'], ['5.00%'])
  eq('🔑 repetição a menos reprova', d.iguais, false)
  eq('e a diferença sai UMA vez, não duas', d.falta, ['5.00%'])
  eq('e a direção inversa também reprova', compararNumeros(['5.00%'], ['5.00%', '5.00%']).iguais, false)
  eq('sobra na tradução é nomeada', compararNumeros(['5.00%'], ['5.00%', '9.00%']).sobra, ['9.00%'])
  eq('duas listas vazias são iguais', compararNumeros([], []).iguais, true)
  eq('nulo contra vazio não estoura', compararNumeros(null, []).iguais, true)
  eq('origem vazia e tradução com número reprova', compararNumeros([], ['1.00%']).iguais, false)
}

// ══ o caso REAL do dia, que o gate pegou na primeira execução ════════════
{
  // 🔴 O pt-BR escrevia `USD 276M` no calendário e `USD 276 milhões` na lista
  //    de fontes, para o MESMO valor, e as traduções usaram a forma em palavras
  //    nas duas. O token sobrava só no original.
  const pt = numerosComUnidade('com USD 276M declarados ... os USD 276 milhões de Musk')
  const en = numerosComUnidade('with USD 276 million declared ... Musk’s USD 276 million')
  eq('🔴 o caso fundador: o pt-BR tinha um token que o EN não tinha', compararNumeros(pt, en).falta, ['276M'])
  eq('e depois de uniformizar o original, fecha', compararNumeros(numerosComUnidade('com USD 276 milhões declarados'), en).iguais, true)
}

console.log(`\n${falhas === 0 ? '✅ APROVADO' : '❌ REPROVADO'}: ${ok} passaram, ${falhas} falharam\n`)
process.exit(falhas === 0 ? 0 : 1)
