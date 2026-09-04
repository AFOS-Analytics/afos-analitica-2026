/**
 * testar-amplitude-livro.mjs — casos plantados para a régua de livro bloqueado.
 *
 * 🔑 Os casos 3 e 4 são os dois lados reais de 04/Set/2026: o contrato do STF,
 * que bloqueou duas vezes e percorreu 8,70pp no dia, e o Senado, que bloqueou
 * por 0,70pp e passou na rodada seguinte. Uma régua que só acertasse o primeiro
 * transformaria a exceção em norma.
 *
 * Uso: node scripts/testar-amplitude-livro.mjs
 */

import { faixaDoDia, vereditoBloqueio } from './lib/amplitude-livro.mjs'

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
const P = (hora, preco, volume) => ({ hora, preco, volume })

console.log('\n1. A faixa sai dos pontos gravados')
{
  const f = faixaDoDia([P('00:01', 10.6, 87231), P('04:01', 19.3, 87259), P('17:01', 15.0, 87259)])
  conferir('mínimo 10,60', f.min === 10.6)
  conferir('máximo 19,30', f.max === 19.3)
  conferir('amplitude 8,70pp', f.amplitude === 8.7, String(f.amplitude))
  conferir('dinheiro novo USD 28', f.dinheiroNovo === 28, String(f.dinheiroNovo))
}

console.log('\n2. 🔑 A leitura de AGORA entra na faixa, e diz quando ela a estica')
{
  const pontos = [P('00:01', 10.6, 1), P('04:01', 19.3, 1), P('17:01', 15.0, 1)]
  const dentro = faixaDoDia(pontos, 15.85)
  conferir('leitura dentro não muda a faixa', dentro.min === 10.6 && dentro.max === 19.3)
  conferir('e não é marcada como esticadora', dentro.agoraEsticouAFaixa === false)

  const fora = faixaDoDia(pontos, 21.4)
  conferir('leitura acima ESTICA o máximo', fora.max === 21.4, String(fora.max))
  conferir('⚠️ e isso é declarado, não escondido', fora.agoraEsticouAFaixa === true)
  conferir('o n com agora é maior que o n gravado', fora.nComAgora === fora.n + 1)
}

console.log('\n3. 🔴 O STF de 04/Set: bloqueio ESTRUTURAL, recapturar não resolve')
{
  const pontos = [
    P('00:01', 10.6, 87231), P('01:30', 12.0, 87231), P('02:31', 17.2, 87259),
    P('04:01', 19.3, 87259), P('05:30', 17.3, 87259), P('06:30', 17.9, 87259),
    P('10:00', 16.6, 87259), P('13:00', 18.8, 87259), P('17:01', 15.0, 87259),
  ]
  const v = vereditoBloqueio(faixaDoDia(pontos, 15.85))
  conferir('veredito ESTRUTURAL', v.veredito === 'ESTRUTURAL', JSON.stringify(v))
  conferir('o limite é 2,00pp com tolerância 0,20 e fator 10', v.limite === 2)
}

console.log('\n4. 🔴 O Senado de 04/Set: bloqueio PASSAGEIRO, e ele passou na rodada seguinte')
{
  const pontos = [
    P('00:00', 11.3, 8900), P('03:00', 11.4, 8900), P('06:00', 11.5, 8905),
    P('09:00', 11.6, 8905), P('12:00', 12.0, 8909), P('17:00', 12.1, 8909),
  ]
  const v = vereditoBloqueio(faixaDoDia(pontos, 12.25))
  conferir('veredito PASSAGEIRO', v.veredito === 'PASSAGEIRO', JSON.stringify(v))
  conferir('⛔ e por isso NÃO ganha a exceção da faixa', v.veredito !== 'ESTRUTURAL')
}

console.log('\n5. Amostra curta não decide, e isso é dito')
{
  const v = vereditoBloqueio(faixaDoDia([P('06:00', 3.4, 1), P('20:00', 19.0, 1)]))
  conferir('veredito INDETERMINADO com 2 pontos', v.veredito === 'INDETERMINADO', JSON.stringify(v))
  conferir(
    '⚠️ mesmo com amplitude enorme, porque 2 pontos não são amplitude',
    !String(v.veredito).includes('ESTRUTURAL')
  )
  conferir('sem série nenhuma também não decide', vereditoBloqueio(null).veredito === 'SEM_SERIE')
  conferir('e faixaDoDia de lista vazia devolve null', faixaDoDia([]) === null)
}

console.log('\n6. O fator não pode ser 1, senão a exceção vira a norma')
{
  const pontos = Array.from({ length: 8 }, (_, i) => P(`0${i}:00`, 10 + i * 0.05, 100))
  const f = faixaDoDia(pontos)
  conferir('amplitude pequena, 0,35pp', f.amplitude === 0.35, String(f.amplitude))
  conferir('com fator 10 é passageiro', vereditoBloqueio(f, 0.2, 10).veredito === 'PASSAGEIRO')
  conferir(
    '⛔ com fator 1 viraria estrutural, que é o erro que o padrão evita',
    vereditoBloqueio(f, 0.2, 1).veredito === 'ESTRUTURAL'
  )
}

console.log('\n7. Volume que não cresce devolve zero, e volume ausente devolve null')
{
  conferir('parado dá 0', faixaDoDia([P('a', 1, 500), P('b', 2, 500)]).dinheiroNovo === 0)
  conferir(
    'sem volume dá null, não 0',
    faixaDoDia([P('a', 1, undefined), P('b', 2, undefined)]).dinheiroNovo === null
  )
}

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${passes} passaram, ${falhas} falharam.`)
process.exit(falhas === 0 ? 0 : 1)
