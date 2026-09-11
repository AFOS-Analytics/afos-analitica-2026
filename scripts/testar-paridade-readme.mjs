/**
 * testar-paridade-readme.mjs — casos plantados para a conta de paridade.
 *
 * 🔑 O caso 3 é o que justifica o arquivo inteiro: ele reproduz o erro de
 * 11/Set/2026, em que o mesmo achado existia dos dois lados com a data escrita
 * de outro jeito e o contador anunciou dívida onde não havia.
 */

import { compararParidade, formatarParidade, acharDatasEN, acharDatasPT, chave } from './lib/paridade-readme.mjs'

let passou = 0
let falhou = 0
const ok = (nome, cond, det = '') => {
  if (cond) { passou++; console.log(`   ✅ ${nome}`) } else { falhou++; console.log(`   ❌ ${nome}${det ? '  ' + det : ''}`) }
}

console.log('\n🧪 PARIDADE DOS ACHADOS DATADOS DOS READMEs\n')

// 1. Paridade trivial.
{
  const r = compararParidade('**A (24/Aug/2026).** x', '**A (24/Ago/2026).** x')
  ok('um de cada lado, mesma data: fecha', r.divergencias.length === 0)
  ok('conta os dois totais', r.totalEN === 1 && r.totalPT === 1)
}

// 2. Falta de verdade.
{
  const r = compararParidade('**A (24/Aug/2026).** x', '**A (24/Ago/2026).** x\n**B (06/Set/2026).** y')
  ok('achado só em pt-BR é acusado', r.divergencias.length === 1 && r.divergencias[0].data === '2026-09-06')
  ok('e o lado que falta é o inglês', r.divergencias[0].en === 0 && r.divergencias[0].pt === 1)
}

// 3. 🔴 O ERRO DE 11/Set: mesma data, formato diferente. NÃO é dívida.
{
  const r = compararParidade('**A (Aug 24, 2026).** x', '**A (24/Ago/2026).** x')
  ok('forma "Mmm DD, AAAA" é reconhecida e NÃO vira dívida falsa', r.divergencias.length === 0)
  ok('mas ela é CONTADA como fora do padrão', r.forasDoPadrao.en === 1)
  ok('o relato avisa sobre o formato', formatarParidade(r).join('\n').includes('fora do padrão'))
}

// 4. 🔑 Totais iguais com conteúdo diferente: o caso que um contador de TOTAL aprova.
{
  const en = '**A (24/Aug/2026).** x\n**B (24/Aug/2026).** y'
  const pt = '**A (24/Ago/2026).** x\n**C (06/Set/2026).** z'
  const r = compararParidade(en, pt)
  ok('totais iguais', r.totalEN === 2 && r.totalPT === 2)
  ok('e MESMO ASSIM acusa, porque compara por data', r.divergencias.length === 2)
}

// 5. Dia com um dígito, nas duas formas.
{
  const r = compararParidade('**A (Sep 6, 2026).** x', '**A (6/Set/2026).** x')
  ok('dia de um dígito casa nas duas formas', r.divergencias.length === 0)
}

// 6. Texto sem achado nenhum devolve zero, e zero aqui é resultado.
{
  const r = compararParidade('sem achados', 'sem achados')
  ok('nenhum achado dos dois lados: fecha', r.divergencias.length === 0 && r.totalEN === 0)
}

// 7. Mês em português não pode ser lido como inglês e vice-versa.
{
  ok('"Ago" não conta como mês inglês', acharDatasEN('**A (24/Ago/2026).** x').length === 0)
  ok('"Aug" não conta como mês português', acharDatasPT('**A (24/Aug/2026).** x').length === 0)
  // "Mar", "Jun", "Jul" e "Nov" existem nos dois idiomas, e isso é correto.
  ok('"Mar" vale nos dois, e é a mesma data', chave(acharDatasEN('**A (03/Mar/2026).** x')[0]) === chave(acharDatasPT('**A (03/Mar/2026).** x')[0]))
}

// 8. Só conta o que é CABEÇALHO de achado, não qualquer data no texto.
{
  ok('data solta no meio da prosa não é achado', acharDatasEN('o preço de (24/Aug/2026) subiu').length === 0)
  ok('exige o fecho em negrito', acharDatasEN('**A (24/Aug/2026)** sem ponto').length === 0)
}

console.log(`\n   ${passou} asserção(ões) passaram, ${falhou} falharam\n`)
process.exit(falhou === 0 ? 0 : 1)
