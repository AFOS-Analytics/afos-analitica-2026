/**
 * testar-tse-fantasmas.mjs — casos plantados para a conta de conjuntos.
 *
 * 🔑 A régua da casa: o conferidor que eu escrevo também é um medidor, e o pior
 * defeito é o portão que NÃO PODE disparar. Por isso há caso cujo resultado
 * certo é ZERO, e há o caso que existe só porque a CONTAGEM não o distingue.
 * → memory/feedback_o_conferidor_que_eu_escrevo_tambem_e_um_medidor.md
 */

import {
  compararFantasmas,
  formatarFantasmas,
  lerFantasmas,
  ultimoFantasmas,
  serializarFantasmas,
} from './lib/tse-fantasmas.mjs'

let passou = 0
let falhou = 0

function ok(nome, condicao, detalhe = '') {
  if (condicao) {
    passou++
  } else {
    falhou++
    console.log(`   ❌ ${nome}${detalhe ? `  ${detalhe}` : ''}`)
    return
  }
  console.log(`   ✅ ${nome}`)
}

const reg = (quando, protocolos) => ({ quando, protocolos })

console.log('\n🧪 CONJUNTO DE FANTASMAS DO TSE\n')

// 1. Primeira rodada: não há contra o que comparar, e a resposta NÃO é "zero saíram".
{
  const r = compararFantasmas(null, ['BR001', 'BR002'])
  ok('primeira rodada devolve primeira:true', r.primeira === true)
  ok('primeira rodada NÃO inventa lista vazia', r.sairam === null && r.voltaram === null)
  ok('primeira rodada guarda os atuais', r.atuais.join(',') === 'BR001,BR002')
}

// 2. Conjunto idêntico: o resultado certo é ZERO nos dois lados.
{
  const r = compararFantasmas(reg('t1', ['BR002', 'BR001']), ['BR001', 'BR002'])
  ok('conjunto idêntico: nenhuma saída', r.sairam.length === 0)
  ok('conjunto idêntico: nenhuma volta', r.voltaram.length === 0)
  ok('conjunto idêntico independe da ORDEM', r.atuais.join(',') === 'BR001,BR002')
}

// 3. Uma retirada nova, que é o caso de 10 e 11/Set.
{
  const r = compararFantasmas(reg('t1', ['BR001']), ['BR001', 'BR002'])
  ok('uma saída é nomeada', r.sairam.join(',') === 'BR002')
  ok('uma saída não inventa volta', r.voltaram.length === 0)
}

// 4. Uma reposição: o TSE devolveu a linha ao arquivo.
{
  const r = compararFantasmas(reg('t1', ['BR001', 'BR002']), ['BR001'])
  ok('uma volta é nomeada', r.voltaram.join(',') === 'BR002')
  ok('uma volta não inventa saída', r.sairam.length === 0)
}

// 5. 🔴 O CASO QUE JUSTIFICA O ARQUIVO: saída E volta na mesma janela.
//    A contagem vai de 2 para 2 e a subtração dá ZERO, ou seja, a contagem
//    afirma "nada aconteceu" enquanto dois protocolos se moveram.
{
  const anterior = reg('t1', ['BR001', 'BR002'])
  const atual = ['BR001', 'BR003']
  const r = compararFantasmas(anterior, atual)
  ok('a CONTAGEM não muda neste caso', anterior.protocolos.length === atual.length)
  ok('saída e volta aparecem separadas', r.sairam.join(',') === 'BR003' && r.voltaram.join(',') === 'BR002')
  const texto = formatarFantasmas(anterior, r).join('\n')
  ok('o relato AVISA que a contagem esconde os dois', texto.includes('se cancelam'))
}

// 6. Duas saídas de uma vez, ordenadas.
{
  const r = compararFantasmas(reg('t1', ['BR005']), ['BR009', 'BR005', 'BR007'])
  ok('duas saídas saem ordenadas', r.sairam.join(',') === 'BR007,BR009')
}

// 7. Duplicata na entrada não vira fantasma a mais.
{
  const r = compararFantasmas(reg('t1', ['BR001']), ['BR001', 'BR002', 'BR002'])
  ok('duplicata é colapsada', r.atuais.length === 2 && r.sairam.join(',') === 'BR002')
}

// 8. Registro anterior SEM o campo `protocolos` é base ausente, não base vazia.
//    Sem isto, um registro velho de outro formato faria toda a base atual
//    aparecer como "saiu agora", que é um alarme inteiro falso.
{
  const r = compararFantasmas({ quando: 't1' }, ['BR001', 'BR002'])
  ok('anterior sem `protocolos` devolve primeira:true', r.primeira === true)
  ok('anterior sem `protocolos` NÃO acusa saída em massa', r.sairam === null)
}

// 9. Leitura do JSONL: linha quebrada ABORTA em vez de virar lista vazia.
{
  let abortou = false
  try {
    lerFantasmas('{"quando":"t1","protocolos":[]}\n{isto não é json}\n')
  } catch {
    abortou = true
  }
  ok('linha quebrada aborta a leitura', abortou)
  ok('texto vazio devolve lista vazia', lerFantasmas('').length === 0)
  const h = lerFantasmas(
    serializarFantasmas(reg('2026-09-11T00:00:00Z', ['BR002'])) + serializarFantasmas(reg('2026-09-10T00:00:00Z', ['BR001'])),
  )
  ok('ultimoFantasmas ordena por `quando`, não pela ordem do arquivo', ultimoFantasmas(h).protocolos.join(',') === 'BR002')
  ok('ultimoFantasmas devolve null em histórico vazio', ultimoFantasmas([]) === null)
}

console.log(`\n   ${passou} asserção(ões) passaram, ${falhou} falharam\n`)
process.exit(falhou === 0 ? 0 : 1)
