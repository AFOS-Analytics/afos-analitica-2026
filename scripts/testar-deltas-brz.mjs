/**
 * testar-deltas-brz.mjs — casos plantados para a tabela de variação do BR.
 *
 * 🔑 O caso 2 é o incidente de 24/Jul/2026 replantado: DOIS contratos com o
 * sinal invertido. Se o comparador errar o sinal, é ele que tem de falhar aqui,
 * e não o dashboard em produção.
 *
 * Uso: node scripts/testar-deltas-brz.mjs
 */

import { comparar, achatar, lerLinhas, ultimaLeitura } from './deltas-brz.mjs'

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
const L = (livro, pergunta, preco, volume = 1000) => ({ livro, pergunta, preco, volume })
const acha = (arr, p) => arr.find((x) => x.pergunta === p)

console.log('\n1. Movimento simples, com o sinal impresso nos dois sentidos')
{
  const antes = [L('presidential', 'Lula?', 54.5), L('presidential', 'Flávio?', 42.85)]
  const agora = [L('presidential', 'Lula?', 55.5, 1200), L('presidential', 'Flávio?', 40.15, 1200)]
  const r = comparar(antes, agora)
  conferir('Lula sobe +1,00', acha(r.movidos, 'Lula?').delta === 1, JSON.stringify(acha(r.movidos, 'Lula?')))
  conferir('Flávio cai -2,70', acha(r.movidos, 'Flávio?').delta === -2.7, JSON.stringify(acha(r.movidos, 'Flávio?')))
  conferir('os dois entram como movidos', r.movidos.length === 2)
  conferir('nenhum parado', r.parados.length === 0)
}

console.log('\n2. 🔴 O INCIDENTE DE 24/JUL: dois contratos que caíram e foram ao ar em alta')
{
  const antes = [L('presidential', 'Michelle?', 8.0), L('presidential', 'Caiado?', 3.0), L('presidential', 'Lula?', 50.0)]
  const agora = [L('presidential', 'Michelle?', 6.5), L('presidential', 'Caiado?', 2.4), L('presidential', 'Lula?', 50.0)]
  const r = comparar(antes, agora)
  conferir('Michelle é NEGATIVA', acha(r.movidos, 'Michelle?').delta < 0, String(acha(r.movidos, 'Michelle?').delta))
  conferir('Caiado é NEGATIVO', acha(r.movidos, 'Caiado?').delta < 0, String(acha(r.movidos, 'Caiado?').delta))
  conferir('Lula fica em parados, não em movidos', r.parados.length === 1 && r.parados[0].pergunta === 'Lula?')
  conferir('os dois entram na tabela relevante', r.relevantes.length === 2)
}

console.log('\n3. Piso de ruído: book fino não polui a tabela, mas quem CRUZA o piso entra')
{
  const antes = [L('thirdPlace', 'ruído?', 0.2), L('presidential', 'cruza?', 0.4)]
  const agora = [L('thirdPlace', 'ruído?', 0.35), L('presidential', 'cruza?', 1.9)]
  const r = comparar(antes, agora, 0.5)
  conferir('os dois se moveram', r.movidos.length === 2)
  conferir('só o que cruza o piso é relevante', r.relevantes.length === 1 && r.relevantes[0].pergunta === 'cruza?', JSON.stringify(r.relevantes.map((x) => x.pergunta)))
}

console.log('\n4. Contrato que SUMIU do book não pode desaparecer da tabela')
{
  const antes = [L('presidential', 'saiu?', 5), L('presidential', 'ficou?', 10)]
  const agora = [L('presidential', 'ficou?', 11), L('presidential', 'novo?', 2)]
  const r = comparar(antes, agora)
  conferir('acusa 1 sumido', r.sumidos.length === 1 && r.sumidos[0].pergunta === 'saiu?')
  conferir('acusa 1 entrante', r.entrantes.length === 1 && r.entrantes[0].pergunta === 'novo?')
  conferir('entrante NÃO vira movimento de 2,00pp contra zero', !r.movidos.some((x) => x.pergunta === 'novo?'))
}

console.log('\n5. 🔴 Volume acumulado que ENCOLHE é defeito, não notícia')
{
  const antes = [L('presidential', 'A?', 10, 90000), L('presidential', 'B?', 10, 5000)]
  const agora = [L('presidential', 'A?', 11, 87000), L('presidential', 'B?', 12, 6000)]
  const r = comparar(antes, agora)
  conferir('acusa exatamente 1 volume encolhido', r.volumeEncolheu.length === 1, JSON.stringify(r.volumeEncolheu.map((x) => x.pergunta)))
  conferir('e é o contrato A', r.volumeEncolheu[0].pergunta === 'A?')
  conferir('o delta de volume vem negativo', r.volumeEncolheu[0].deltaVolume === -3000, String(r.volumeEncolheu[0].deltaVolume))
}

console.log('\n6. Livro diferente com o MESMO candidato não se mistura na chave')
{
  // 🔴 FIXTURE REAL: o book manda o NOME do candidato, IGUAL nos três livros.
  // A primeira versão deste caso usava "Flávio vence?" e "Flávio em 2º?", textos
  // diferentes por livro, e por isso não pegou a colisão de chave que apareceu
  // na primeira vez que o script rodou contra duas leituras de verdade.
  const antes = [
    L('presidential', 'Flávio Bolsonaro', 42.85),
    L('secondPlace', 'Flávio Bolsonaro', 83.5),
    L('thirdPlace', 'Augusto Cury', 59.5),
    L('presidential', 'Augusto Cury', 1.25),
  ]
  const agora = [
    L('presidential', 'Flávio Bolsonaro', 40.15),
    L('secondPlace', 'Flávio Bolsonaro', 87.5),
    L('thirdPlace', 'Augusto Cury', 54.65),
    L('presidential', 'Augusto Cury', 1.95),
  ]
  const r = comparar(antes, agora)
  const porLivro = (livro, nome) => r.movidos.find((x) => x.livro === livro && x.pergunta === nome)
  conferir('Flávio no vencedor CAI 2,70', porLivro('presidential', 'Flávio Bolsonaro').delta === -2.7)
  conferir('Flávio no 2º lugar SOBE 4,00', porLivro('secondPlace', 'Flávio Bolsonaro').delta === 4)
  conferir('Cury no 3º lugar CAI 4,85', porLivro('thirdPlace', 'Augusto Cury').delta === -4.85, String(porLivro('thirdPlace', 'Augusto Cury').delta))
  conferir('Cury no vencedor SOBE 0,70', porLivro('presidential', 'Augusto Cury').delta === 0.7)
  conferir('🔴 nenhum delta absurdo de cruzamento de livro', r.movidos.every((x) => Math.abs(x.delta) < 10), JSON.stringify(r.movidos.map((x) => [x.livro, x.delta])))
  conferir('nada entrou como novo nem sumiu', r.entrantes.length === 0 && r.sumidos.length === 0)
}

console.log('\n7. Nada se moveu: zero é resultado, e não pode virar tabela vazia sem dizer')
{
  const antes = [L('presidential', 'A?', 10), L('presidential', 'B?', 20)]
  const agora = [L('presidential', 'A?', 10), L('presidential', 'B?', 20)]
  const r = comparar(antes, agora)
  conferir('nenhum movido', r.movidos.length === 0)
  conferir('os dois em parados, e o total fecha', r.parados.length === 2)
}

console.log('\n8. achatar() preserva o livro de origem de cada linha')
{
  const leitura = {
    grupos: {
      presidential: { linhas: [{ pergunta: 'X?', preco: 5, volume: 1 }] },
      stf: { linhas: [{ pergunta: 'Y?', preco: 16.35, volume: 87388 }] },
    },
  }
  const a = achatar(leitura)
  conferir('duas linhas', a.length === 2)
  conferir('cada uma com o livro certo', a[0].livro === 'presidential' && a[1].livro === 'stf')
  conferir('e o volume vem junto', a[1].volume === 87388)
}

console.log('\n9. Leitura do JSONL e escolha da última por carimbo, não por ordem')
{
  const t = '{"fetchedAt":"2026-09-04T22:00:00Z","linhas":[]}\n\n{"fetchedAt":"2026-09-03T22:00:00Z","linhas":[]}\n'
  const h = lerLinhas(t)
  conferir('linha em branco não vira registro', h.length === 2)
  conferir('a última é a de carimbo maior', ultimaLeitura(h).fetchedAt === '2026-09-04T22:00:00Z')
  conferir('vazio devolve null', ultimaLeitura([]) === null)
  let lancou = false
  try {
    lerLinhas('{"fetchedAt":"x"}\n{quebrado}\n')
  } catch (e) {
    lancou = e.message.includes('linha 2')
  }
  conferir('linha quebrada aborta apontando a linha', lancou)
}

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${passes} passaram, ${falhas} falharam.`)
process.exit(falhas === 0 ? 0 : 1)
