/**
 * 🧪 A MESMA RODADA SOB DOIS NOMES — casos plantados.
 *
 * 🔴 Os três casos reais de 25/Set/2026, que estavam na média publicada:
 *    Beacon/Shaw e Fox News, mesma rodada sob quem EXECUTA e quem ENCOMENDA;
 *    Marquette University Law School e Marquette Law School, mesmo nome com uma
 *    palavra a menos; ActiVote e Activote, diferença só de maiúscula e com
 *    valores DIFERENTES. Preço medido: D+7.98 contra D+7.89 sem as idênticas.
 *
 * ⚖️ Metade dos casos é ANTI-EXCESSO, porque o erro simétrico deste conserto é
 * juntar duas casas que só coincidiram de medir na mesma janela.
 */
import { duplicatas, assinatura, normalizarNome, jaConferida, conferirCarga } from '../lib/us-polls/duplicata-de-rodada.mjs'

let ok = 0
let falhas = 0
const eq = (achado, esperado, nome) => {
  if (JSON.stringify(achado) === JSON.stringify(esperado)) { ok++; return }
  falhas++
  console.error(`  ❌ ${nome}\n       esperado ${JSON.stringify(esperado)}\n       achado   ${JSON.stringify(achado)}`)
}

const r = (instituto, campoInicio, campoFim, amostra, amostraTipo, dem, rep) =>
  ({ instituto, campoInicio, campoFim, amostra, amostraTipo, dem, rep, vantagemDem: dem - rep })

console.log('\n🧪 a mesma rodada sob dois nomes de casa\n')

// ── OS TRES CASOS REAIS DE 25/SET ───────────────────────────────────────────
const reais = [
  r('Beacon Research (D)/ Shaw & Co. Research (R)', '2026-09-11', '2026-09-14', 1211, 'RV', 48, 41),
  r('Fox News', '2026-09-11', '2026-09-14', 1211, 'RV', 48, 41),
  r('Marquette University Law School', '2026-09-02', '2026-09-09', 581, 'LV', 54, 41),
  r('Marquette Law School', '2026-09-02', '2026-09-09', 581, 'LV', 54, 41),
  r('ActiVote', '2026-08-31', '2026-09-10', 1000, 'LV', 50, 46),
  r('Activote', '2026-08-31', '2026-09-10', 1000, 'LV', 50.3, 45.7),
]
const g = duplicatas(reais, [])
eq(g.length, 3, 'os tres pares reais sao achados')
eq(g.find((x) => x.nomes.includes('Fox News'))?.classe, 'IDENTICA', 'Fox News e Beacon: mesma rodada, classe IDENTICA')
eq(g.find((x) => x.nomes.includes('Marquette Law School'))?.classe, 'IDENTICA', 'Marquette: classe IDENTICA')
eq(g.find((x) => x.nomes.includes('ActiVote'))?.classe, 'DIVERGE', 'ActiVote: valores diferentes, classe DIVERGE')
eq(g.find((x) => x.nomes.includes('ActiVote'))?.mesmaCasa, true, 'ActiVote e Activote sao a MESMA casa')
eq(g.find((x) => x.nomes.includes('Fox News'))?.mesmaCasa, false, 'Fox News e Beacon sao casas DIFERENTES com a mesma rodada')

// ── ANTI-EXCESSO: nao juntar quem so coincidiu ──────────────────────────────
// 🔑 Amostra diferente e rodada diferente, por mais que o campo bata.
eq(duplicatas([
  r('Casa A', '2026-09-01', '2026-09-05', 1000, 'LV', 50, 45),
  r('Casa B', '2026-09-01', '2026-09-05', 1200, 'LV', 50, 45),
], []).length, 0, 'ANTI-EXCESSO: amostra diferente NAO e a mesma rodada')

eq(duplicatas([
  r('Casa A', '2026-09-01', '2026-09-05', 1000, 'LV', 50, 45),
  r('Casa A', '2026-09-08', '2026-09-12', 1000, 'LV', 51, 44),
], []).length, 0, 'ANTI-EXCESSO: mesma casa em ondas diferentes nao e duplicata')

eq(duplicatas([
  r('Casa A', '2026-09-01', '2026-09-05', 1000, 'LV', 50, 45),
  r('Casa B', '2026-09-01', '2026-09-05', 1000, 'RV', 50, 45),
], []).length, 0, 'ANTI-EXCESSO: recorte diferente nao e a mesma rodada')

// 🔴 O caso mais perigoso: SEM amostra declarada, duas casas diferentes na mesma
//    janela colidiriam sozinhas. So conta quando o nome normalizado bate.
eq(duplicatas([
  r('Strength In Numbers', '2026-09-16', '2026-09-21', null, 'LV', 52, 42),
  r('Morning Consult', '2026-09-16', '2026-09-21', null, 'LV', 49, 44),
], []).length, 0, 'ANTI-EXCESSO: sem amostra, casas DIFERENTES nao colidem')
eq(duplicatas([
  r('Strength In Numbers', '2026-09-16', '2026-09-21', null, 'LV', 52, 42),
  r('strength in numbers', '2026-09-16', '2026-09-21', null, 'LV', 52, 42),
], []).length, 1, 'sem amostra, a MESMA casa em duas grafias ainda conta')

// ── ANTI-SILENCIO: forma ────────────────────────────────────────────────────
eq(duplicatas([], []).length, 0, 'lista vazia nao quebra')
eq(duplicatas(null, []).length, 0, 'lista nula nao quebra')
eq(duplicatas([
  r('Casa A', '2026-09-01', null, 1000, 'LV', 50, 45),
  r('Casa B', '2026-09-01', null, 1000, 'LV', 50, 45),
], []).length, 0, 'linha sem fim de campo fica FORA: sem onda nao ha rodada')

// ── normalizarNome ──────────────────────────────────────────────────────────
eq(normalizarNome('McLaughlin & Associates (R)'), normalizarNome('McLaughlin & Associates'), 'o sufixo de partido sai do nome normalizado')
eq(normalizarNome('ActiVote'), normalizarNome('Activote'), 'maiuscula nao faz casa nova')
eq(normalizarNome('Fox News') === normalizarNome('Beacon Research'), false, 'nomes de casas diferentes seguem diferentes')

// ── O REGISTRO, e a CADUCIDADE ──────────────────────────────────────────────
const grupo = duplicatas(reais, [])[0]
const entrada = {
  assinatura: grupo.assinatura,
  nomes: grupo.nomes,
  valores: grupo.linhas.map((l) => `${l.dem}/${l.rep}`),
  conferidoEm: '2026-09-25',
  motivo: 'caso plantado',
}
eq(jaConferida(grupo, [entrada]), true, 'par conferido e reconhecido')
eq(jaConferida(grupo, [{ ...entrada, valores: ['99/1'] }]), false, 'CADUCIDADE: se o indice reescreve o valor, a conferencia perde efeito')
eq(jaConferida(grupo, [{ ...entrada, assinatura: 'outra' }]), false, 'assinatura diferente nao e o mesmo par')

// ⛔ Conferencia sem prova e opiniao, e opiniao nao desarma portao.
eq(conferirCarga([{ ...entrada, conferidoEm: undefined }]).length > 0, true, 'entrada sem conferidoEm reprova a carga')
eq(conferirCarga([{ ...entrada, motivo: undefined }]).length > 0, true, 'entrada sem motivo reprova a carga')
eq(conferirCarga([{ ...entrada, valores: undefined }]).length > 0, true, 'entrada sem valores reprova: a conferencia nunca caducaria')
eq(conferirCarga([entrada]).length, 0, 'entrada completa passa')

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${ok} asserção(ões) passaram, ${falhas} falharam\n`)
process.exit(falhas === 0 ? 0 : 1)
