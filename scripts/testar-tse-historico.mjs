/**
 * testar-tse-historico.mjs — casos plantados para a subtração do registro do TSE.
 *
 * 🔑 O que este teste protege é a conta, não a formatação. Cada caso planta um
 * par de rodadas com uma história CONHECIDA e cobra o número que essa história
 * obriga. Dois deles existem porque o resultado esperado é ZERO, e zero é
 * exatamente o valor que um medidor mudo também devolve.
 * → memory/feedback_o_conferidor_que_eu_escrevo_tambem_e_um_medidor.md
 *
 * Uso: node scripts/testar-tse-historico.mjs
 */

import { lerHistorico, ultimoRegistro, compararRodadas } from './lib/tse-historico.mjs'

let falhas = 0
let passes = 0

function conferir(nome, condicao, detalhe) {
  if (condicao) {
    passes++
    console.log(`  ✅ ${nome}`)
  } else {
    falhas++
    console.log(`  ❌ ${nome}${detalhe ? `\n     ${detalhe}` : ''}`)
  }
}

const r = (quando, arquivo, banco, fantasmas, inseridas) => ({
  quando,
  arquivo,
  banco,
  fantasmas,
  inseridas,
  jaExistiam: arquivo - inseridas,
})

console.log('\n1. Dia normal: o arquivo cresce exatamente o que entrou, ninguém saiu')
{
  const ontem = r('2026-01-01', 700, 700, 0, 5)
  const hoje = r('2026-01-02', 710, 710, 0, 10)
  const c = compararRodadas(ontem, hoje)
  conferir('crescimento do arquivo é 10', c.crescimentoArquivo === 10, `veio ${c.crescimentoArquivo}`)
  conferir('subtração dá 0 retiradas', c.porSubtracao === 0, `veio ${c.porSubtracao}`)
  conferir('fantasmas dá 0 retiradas', c.porFantasmas === 0, `veio ${c.porFantasmas}`)
  conferir('as duas contas CONCORDAM', c.concordam === true)
  conferir('nenhum aviso', c.avisos.length === 0, JSON.stringify(c.avisos))
}

console.log('\n2. O caso de 02/Set/2026, que abriu o assunto: arquivo +1 e 4 entraram')
{
  // Medido: 756 no arquivo em 01/Set, 757 em 02/Set, 4 inseridas, fantasmas de 72 para 75.
  const ontem = r('2026-09-01', 756, 828, 72, 6)
  const hoje = r('2026-09-02', 757, 832, 75, 4)
  const c = compararRodadas(ontem, hoje)
  conferir('o arquivo cresceu só 1', c.crescimentoArquivo === 1)
  conferir('subtração acusa 3 retiradas', c.porSubtracao === 3, `veio ${c.porSubtracao}`)
  conferir('fantasmas acusam as mesmas 3', c.porFantasmas === 3, `veio ${c.porFantasmas}`)
  conferir('concordam, então a retirada é REAL e não erro de conta', c.concordam === true)
}

console.log('\n3. Rodada NÃO registrada no meio: a subtração fica sem sentido e tem de DIZER isso')
{
  // Exatamente o buraco de 04/Set/2026: entre 02/Set e 04/Set houve uma
  // ingestão em 03/Set que ninguém anotou.
  const ontem = r('2026-09-02', 757, 832, 75, 4)
  const hoje = r('2026-09-04', 784, 860, 76, 16)
  const c = compararRodadas(ontem, hoje)
  conferir('o arquivo cresceu 27', c.crescimentoArquivo === 27)
  conferir('a subtração dá um número ABSURDO, negativo', c.porSubtracao === -11, `veio ${c.porSubtracao}`)
  conferir('os fantasmas dão a retirada real: 1', c.porFantasmas === 1, `veio ${c.porFantasmas}`)
  conferir('as contas NÃO concordam', c.concordam === false)
  conferir('acusa 12 linhas sem rodada registrada', c.naoRegistradas === 12, `veio ${c.naoRegistradas}`)
  conferir(
    'e o aviso aparece na tela',
    c.avisos.some((a) => a.includes('SEM rodada registrada')),
    JSON.stringify(c.avisos),
  )
}

console.log('\n4. Protocolo que VOLTA ao arquivo: os fantasmas caem, e isso não é retirada negativa')
{
  const ontem = r('2026-02-01', 700, 780, 80, 3)
  const hoje = r('2026-02-02', 703, 783, 78, 3)
  const c = compararRodadas(ontem, hoje)
  conferir('fantasmas caem 2', c.porFantasmas === -2, `veio ${c.porFantasmas}`)
  conferir('o aviso de retorno aparece', c.avisos.some((a) => a.includes('VOLTARAM')), JSON.stringify(c.avisos))
}

console.log('\n5. 🔴 Banco PERDEU linha: inseriu mais do que o arquivo explica')
{
  // Invariante do projeto: o banco nunca apaga. Se apagar, tem de gritar.
  const ontem = r('2026-03-01', 700, 780, 80, 2)
  const hoje = r('2026-03-02', 702, 770, 68, 10)
  const c = compararRodadas(ontem, hoje)
  conferir('acusa diferença negativa', c.naoRegistradas < 0, `veio ${c.naoRegistradas}`)
  conferir(
    'e o alarme vermelho aparece',
    c.avisos.some((a) => a.includes('🔴') && a.includes('PERDEU')),
    JSON.stringify(c.avisos),
  )
}

console.log('\n6. Campo AUSENTE não pode virar zero: o medidor precisa se declarar mudo')
{
  const ontem = { quando: '2026-04-01', arquivo: 700, inseridas: 5 } // sem `fantasmas`
  const hoje = r('2026-04-02', 710, 710, 0, 10)
  const c = compararRodadas(ontem, hoje)
  conferir('a conta dos fantasmas vem NULA, não zero', c.porFantasmas === null, `veio ${c.porFantasmas}`)
  conferir('a subtração ainda funciona', c.porSubtracao === 0)
  conferir('concordam fica indefinido', c.concordam === null, `veio ${c.concordam}`)
  conferir('e ele avisa que não deu para calcular', c.avisos.some((a) => a.includes('indisponível')))
}

console.log('\n7. Primeira rodada: não inventa subtração contra o nada')
{
  const c = compararRodadas(null, r('2026-05-01', 700, 700, 0, 700))
  conferir('marca como primeira', c.primeira === true)
  conferir('não devolve número de retirada', c.porSubtracao === undefined)
}

console.log('\n8. Leitura do JSONL: ordem do arquivo não decide qual é o último')
{
  const texto = [
    '{"quando":"2026-09-04","arquivo":784}',
    '',
    '{"quando":"2026-09-02","arquivo":757}',
    '',
  ].join('\n')
  const h = lerHistorico(texto)
  conferir('linha em branco não vira registro', h.length === 2, `veio ${h.length}`)
  conferir('o último é o de data maior, não o último do arquivo', ultimoRegistro(h).quando === '2026-09-04')
  conferir('histórico vazio devolve null', ultimoRegistro([]) === null)
}

console.log('\n9. Linha quebrada ABORTA, não é pulada em silêncio')
{
  let lancou = false
  try {
    lerHistorico('{"quando":"2026-09-04"}\n{isto nao e json}\n')
  } catch (e) {
    lancou = e.message.includes('linha 2')
  }
  conferir('lança apontando a linha 2', lancou)
}

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${passes} passaram, ${falhas} falharam.`)
process.exit(falhas === 0 ? 0 : 1)
