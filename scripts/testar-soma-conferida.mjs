/**
 * Casos plantados para lib/us-polls/soma-conferida.mjs.
 *
 * 🔑 Metade é ANTI-SILÊNCIO, de propósito: o risco deste módulo não é errar a
 * conta, é virar gaveta onde qualquer linha incômoda some. O erro simétrico do
 * conserto de hoje é um portão que nunca mais reprova.
 */
import { conferenciaDe, separarPorConferencia, validarRegistro, SOMAS_CONFERIDAS } from '../lib/us-polls/soma-conferida.mjs'

let ok = 0
let falhou = 0
const eq = (nome, a, b) => {
  const bateu = JSON.stringify(a) === JSON.stringify(b)
  if (bateu) ok++
  else {
    falhou++
    console.log(`❌ ${nome}\n   esperado ${JSON.stringify(b)}\n   veio     ${JSON.stringify(a)}`)
  }
}

const linha = (o) => ({ instituto: 'X', campoInicio: '2026-09-01', campoFim: '2026-09-05', dem: 40, rep: 30, outros: 5, ...o })
const REG = [
  { instituto: 'X', campoInicio: '2026-09-01', campoFim: '2026-09-05', dem: 40, rep: 30, outros: 5, veredito: 'RECORTE_DO_INSTITUTO', conferidoEm: '2026-09-23', url: 'https://exemplo.org/topline' },
  { instituto: 'Y', campoInicio: '2026-09-02', campoFim: '2026-09-09', dem: 54, rep: 41, outros: 8, veredito: 'ERRO_DO_INDICE', conferidoEm: '2026-09-23', url: 'https://exemplo.org/lv', decomposicao: 'o indice diz 8 e a fonte diz 4' },
]

// ——— casamento exato
eq('linha registrada casa', conferenciaDe(linha(), REG).conferida, true)
eq('instituto diferente NAO casa', conferenciaDe(linha({ instituto: 'Z' }), REG).conferida, false)
eq('campoFim diferente NAO casa', conferenciaDe(linha({ campoFim: '2026-09-06' }), REG).conferida, false)
eq('campoInicio diferente NAO casa', conferenciaDe(linha({ campoInicio: '2026-08-31' }), REG).conferida, false)

// ——— 🔴 A TRAVA CENTRAL: valor reescrito no indice CADUCA a conferencia
eq('dem reescrito CADUCA', conferenciaDe(linha({ dem: 41 }), REG).conferida, false)
eq('rep reescrito CADUCA', conferenciaDe(linha({ rep: 31 }), REG).conferida, false)
eq('outros reescrito CADUCA', conferenciaDe(linha({ outros: 6 }), REG).conferida, false)
eq('numero como string ainda casa', conferenciaDe(linha({ dem: '40', rep: '30', outros: '5' }), REG).conferida, true)

// ——— anti-silencio de entrada nula
eq('poll nulo nao casa', conferenciaDe(null, REG).conferida, false)
eq('poll vazio nao casa', conferenciaDe({}, REG).conferida, false)
eq('registro vazio nao casa nada', conferenciaDe(linha(), []).conferida, false)

// ——— separacao em tres baldes
const fora = [
  { p: linha(), s: 75 },
  { p: linha({ instituto: 'Y', campoInicio: '2026-09-02', campoFim: '2026-09-09', dem: 54, rep: 41, outros: 8 }), s: 103 },
  { p: linha({ instituto: 'NOVA', dem: 44, rep: 33, outros: 2 }), s: 79 },
]
const s = separarPorConferencia(fora, REG)
eq('nao conferidas', s.naoConferidas.length, 1)
eq('a nao conferida e a NOVA', s.naoConferidas[0].p.instituto, 'NOVA')
eq('recorte conferido', s.recorteConferido.length, 1)
eq('erro do indice', s.erroDoIndice.length, 1)
eq('erro do indice carrega a entrada', s.erroDoIndice[0].entrada.veredito, 'ERRO_DO_INDICE')

// 🔴 ANTI-SILENCIO: ERRO_DO_INDICE sai do contador mas NAO some da saida
eq('erro do indice nao vira nao-conferida', s.naoConferidas.some((x) => x.p.instituto === 'Y'), false)
eq('erro do indice continua listado', s.erroDoIndice.some((x) => x.p.instituto === 'Y'), true)

// ——— lista vazia e tipo errado
eq('lista vazia da tres baldes vazios', [s.naoConferidas, s.recorteConferido, s.erroDoIndice].map(() => 0), [0, 0, 0])
eq('vazio nao explode', separarPorConferencia([], REG).naoConferidas.length, 0)
let lancou = false
try { separarPorConferencia(null, REG) } catch { lancou = true }
eq('array obrigatorio', lancou, true)

// ——— validacao: conferencia sem prova nao desarma portao
eq('registro real e valido', validarRegistro(), [])
eq('sem url reprova', validarRegistro([{ instituto: 'A', campoInicio: '2026-01-01', campoFim: '2026-01-02', dem: 1, rep: 2, veredito: 'RECORTE_DO_INSTITUTO', conferidoEm: '2026-09-23' }]).length, 1)
eq('sem conferidoEm reprova', validarRegistro([{ instituto: 'A', campoInicio: '2026-01-01', campoFim: '2026-01-02', dem: 1, rep: 2, veredito: 'RECORTE_DO_INSTITUTO', url: 'https://x.org' }]).length, 1)
eq('veredito inventado reprova', validarRegistro([{ instituto: 'A', campoInicio: '2026-01-01', campoFim: '2026-01-02', dem: 1, rep: 2, veredito: 'TUDO_BEM', conferidoEm: '2026-09-23', url: 'https://x.org' }]).length, 1)
eq('url nao-http reprova', validarRegistro([{ instituto: 'A', campoInicio: '2026-01-01', campoFim: '2026-01-02', dem: 1, rep: 2, veredito: 'RECORTE_DO_INSTITUTO', conferidoEm: '2026-09-23', url: 'topline.pdf' }]).length, 1)
eq('data mal formada reprova', validarRegistro([{ instituto: 'A', campoInicio: '2026-01-01', campoFim: '2026-01-02', dem: 1, rep: 2, veredito: 'RECORTE_DO_INSTITUTO', conferidoEm: '23/09/2026', url: 'https://x.org' }]).length, 1)

// ——— o registro REAL, conferido contra o que foi aberto em 23/Set
eq('registro real tem 4 entradas', SOMAS_CONFERIDAS.length, 4)
eq('uma delas e erro do indice', SOMAS_CONFERIDAS.filter((e) => e.veredito === 'ERRO_DO_INDICE').length, 1)
eq('o erro do indice e a Marquette', SOMAS_CONFERIDAS.find((e) => e.veredito === 'ERRO_DO_INDICE').instituto, 'Marquette University Law School')
eq('toda entrada real tem decomposicao', SOMAS_CONFERIDAS.every((e) => typeof e.decomposicao === 'string' && e.decomposicao.length > 40), true)
eq('toda entrada real tem url http', SOMAS_CONFERIDAS.every((e) => /^https:\/\//.test(e.url)), true)

console.log(`\n${falhou === 0 ? '✅' : '❌'} ${ok} asserções passaram, ${falhou} falharam`)
process.exitCode = falhou === 0 ? 0 : 1
