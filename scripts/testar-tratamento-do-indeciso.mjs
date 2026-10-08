/**
 * Casos plantados para o registro do TRATAMENTO DO INDECISO.
 *
 * 🔑 Metade é anti-silêncio e metade é anti-excesso, e as duas direções de erro
 * aqui são caras de maneiras opostas: um registro que não escolhe nada devolve o
 * defeito que ele existe para corrigir, e um registro que escolhe demais passa a
 * mexer em onda que ninguém conferiu.
 *
 *   node scripts/testar-tratamento-do-indeciso.mjs
 */
import {
  TRATAMENTO_ESCOLHIDO,
  buscar,
  ehEscolhida,
  auditar,
  conferirCarga,
} from '../lib/us-polls/tratamento-do-indeciso.mjs'
import { media } from '../lib/us-polls/collect.mjs'

let ok = 0
const falhas = []
function caso(nome, cond) {
  if (cond) ok++
  else falhas.push(nome)
}

// ── a onda real que criou o registro, como o índice a traz ──
const ANGUS = {
  decidido: { instituto: 'Angus Reid Global', campoInicio: '2026-09-19', campoFim: '2026-09-25', amostra: 919, amostraTipo: 'RV', dem: 56, rep: 40, outros: 4 },
  semApoio: { instituto: 'Angus Reid Global', campoInicio: '2026-09-19', campoFim: '2026-09-25', amostra: 1041, amostraTipo: 'RV', dem: 49, rep: 35, outros: 16 },
  comLeaners: { instituto: 'Angus Reid Global', campoInicio: '2026-09-19', campoFim: '2026-09-25', amostra: 1205, amostraTipo: 'A', dem: 45, rep: 34, outros: 21 },
}
const ONDA = [ANGUS.decidido, ANGUS.semApoio, ANGUS.comLeaners]

// ───────────────────────── CARGA ─────────────────────────

caso('a carga declarada passa', conferirCarga().length === 0)
caso('o registro tem ao menos uma entrada', TRATAMENTO_ESCOLHIDO.length >= 1)

const base = () => JSON.parse(JSON.stringify(TRATAMENTO_ESCOLHIDO))
const semCampo = (campo) => { const r = base(); delete r[0][campo]; return conferirCarga(r) }

// Anti-silêncio: conferência sem prova é opinião, e opinião não escolhe número.
caso('sem prova reprova', semCampo('prova').some((e) => /sem prova/.test(e)))
caso('sem conferidoEm reprova', semCampo('conferidoEm').some((e) => /sem conferidoEm/.test(e)))
caso('sem decididoEm reprova', semCampo('decididoEm').some((e) => /sem decididoEm/.test(e)))
caso('sem motivo reprova', semCampo('motivo').some((e) => /sem motivo/.test(e)))
caso('sem escolha reprova', semCampo('escolha').some((e) => /sem escolha/.test(e)))
caso('sem serie reprova', semCampo('serie').some((e) => /sem serie/.test(e)))
caso('sem campoFim reprova', semCampo('campoFim').some((e) => /campoFim ausente/.test(e)))

caso('campoFim fora de AAAA-MM-DD reprova', (() => { const r = base(); r[0].campoFim = '25/09/2026'; return conferirCarga(r).some((e) => /fora de AAAA-MM-DD/.test(e)) })())
caso('dem não numérico reprova', (() => { const r = base(); r[0].dem = '45'; return conferirCarga(r).some((e) => /dem ou rep não é número/.test(e)) })())
caso('rep não numérico reprova', (() => { const r = base(); r[0].rep = null; return conferirCarga(r).some((e) => /dem ou rep não é número/.test(e)) })())

caso('onda declarada DUAS vezes reprova', (() => { const r = base(); r.push(JSON.parse(JSON.stringify(r[0]))); return conferirCarga(r).some((e) => /duas vezes/.test(e)) })())
caso('menos de 2 painéis reprova', (() => { const r = base(); r[0].paineis = [r[0].paineis[1]]; return conferirCarga(r).some((e) => /menos de 2 painéis/.test(e)) })())
caso('painel sem rótulo reprova', (() => { const r = base(); delete r[0].paineis[0].rotulo; return conferirCarga(r).some((e) => /painel sem rótulo/.test(e)) })())
caso('painel repetido reprova', (() => { const r = base(); r[0].paineis[2].rotulo = r[0].paineis[1].rotulo; return conferirCarga(r).some((e) => /declarado duas vezes/.test(e)) })())
caso('painel sem dem/rep reprova', (() => { const r = base(); r[0].paineis[0].dem = 'x'; return conferirCarga(r).some((e) => /sem dem\/rep/.test(e)) })())

// 🔑 A trava mais importante da carga: escolha que não aponta para um painel
// declarado é escolha sem origem, e aí a decomposição não refaz a conta.
caso('escolha fora dos painéis reprova', (() => { const r = base(); r[0].escolha = 'Outro painel'; return conferirCarga(r).some((e) => /não está entre os painéis/.test(e)) })())
caso('valores da escolha que não batem com o painel reprovam', (() => { const r = base(); r[0].dem = 44; return conferirCarga(r).some((e) => /não são os do painel/.test(e)) })())

// ───────────────────────── BUSCA ─────────────────────────

caso('acha a onda declarada', buscar(ANGUS.comLeaners) !== null)
caso('acha pelas três linhas da mesma onda', [ANGUS.decidido, ANGUS.semApoio, ANGUS.comLeaners].every((p) => buscar(p) !== null))

// Anti-excesso: a entrada vale para UMA onda, não para a casa.
caso('ONDA DIFERENTE da mesma casa não é achada', buscar({ ...ANGUS.comLeaners, campoFim: '2026-08-11' }) === null)
caso('casa diferente não é achada', buscar({ ...ANGUS.comLeaners, instituto: 'Quinnipiac University' }) === null)
caso('linha sem campoFim não é achada', buscar({ ...ANGUS.comLeaners, campoFim: null }) === null)
caso('registro vazio não acha nada', buscar(ANGUS.comLeaners, []) === null)

// ───────────────────────── ESCOLHA ─────────────────────────

caso('a linha com os valores declarados É a escolhida', ehEscolhida(ANGUS.comLeaners) === true)
caso('a linha de decididos NÃO é a escolhida', ehEscolhida(ANGUS.decidido) === false)
caso('a linha sem apoio no documento NÃO é a escolhida', ehEscolhida(ANGUS.semApoio) === false)

// 🔴 A CADUCIDADE, que é a razão de casar por VALOR e não por recorte ou amostra.
caso('se o índice reescrever dem, a escolha CADUCA naquela linha', ehEscolhida({ ...ANGUS.comLeaners, dem: 46 }) === false)
caso('se o índice reescrever rep, a escolha CADUCA naquela linha', ehEscolhida({ ...ANGUS.comLeaners, rep: 35 }) === false)
// Anti-excesso: o que NÃO pode fazer a escolha caducar.
caso('trocar a AMOSTRA não desfaz a escolha', ehEscolhida({ ...ANGUS.comLeaners, amostra: 1206 }) === true)
caso('trocar o RECORTE não desfaz a escolha', ehEscolhida({ ...ANGUS.comLeaners, amostraTipo: 'RV' }) === true)
caso('trocar o OUTROS não desfaz a escolha', ehEscolhida({ ...ANGUS.comLeaners, outros: 20 }) === true)
caso('onda não declarada nunca é escolhida', ehEscolhida({ instituto: 'Quinnipiac University', campoFim: '2026-09-27', dem: 45, rep: 34 }) === false)

// ───────────────────────── AUDITORIA ─────────────────────────

const a = auditar(ONDA)
caso('a auditoria da onda real sai ESCOLHIDA', a?.estado === 'ESCOLHIDA')
caso('a auditoria casa exatamente UMA linha', a?.quantasCasam === 1)
caso('a auditoria diz o rótulo do painel', a?.escolha === 'With leaners')
caso('a auditoria lista as 3 linhas da onda', a?.linhasDaOnda?.length === 3)
caso('a auditoria marca qual linha é a escolhida', a?.linhasDaOnda?.filter((l) => l.escolhida).length === 1)
caso('a linha marcada é a de D45 x R34', a?.linhasDaOnda?.find((l) => l.escolhida)?.dem === 45)
caso('a auditoria carrega a prova', typeof a?.prova === 'string' && a.prova.length > 0)

// 🔴 Anti-silêncio: as duas formas de a escolha falhar TÊM de sair ditas.
const caducou = auditar(ONDA.map((p) => (p.dem === 45 ? { ...p, dem: 46 } : p)))
caso('índice reescreveu o valor: a auditoria diz CADUCOU', caducou?.estado === 'CADUCOU')
caso('CADUCOU conta zero linhas casando', caducou?.quantasCasam === 0)
const ambigua = auditar([...ONDA, { ...ANGUS.comLeaners, amostra: 999 }])
caso('duas linhas com o valor declarado: a auditoria diz AMBIGUA', ambigua?.estado === 'AMBIGUA')
caso('AMBIGUA conta as duas', ambigua?.quantasCasam === 2)

// Anti-excesso: onda não declarada não produz auditoria nenhuma.
caso('onda não declarada devolve null', auditar([{ instituto: 'Quinnipiac University', campoFim: '2026-09-27', dem: 51, rep: 39 }]) === null)
caso('lista vazia devolve null', auditar([]) === null)
caso('lista nula devolve null', auditar(null) === null)

// ───────────────────────── EFEITO NA MÉDIA ─────────────────────────
//
// 🔑 O teste que importa: a escolha tem de MUDAR qual linha representa a rodada
// e NUNCA mudar quantas rodadas existem.

const AGORA = new Date('2026-10-05T12:00:00Z')
const OUTRA = { instituto: 'Quinnipiac University', campoInicio: '2026-09-24', campoFim: '2026-09-27', amostra: 1032, amostraTipo: 'RV', dem: 51, rep: 39, outros: 10 }
const UNIVERSO = [...ONDA, OUTRA]

const comRegistro = media(UNIVERSO, 30, AGORA, undefined, undefined, TRATAMENTO_ESCOLHIDO)
const semRegistro = media(UNIVERSO, 30, AGORA, undefined, undefined, [])

const angusDe = (m) => m.incluidas.find((p) => /Angus/.test(p.instituto))
caso('SEM registro, a hierarquia serve a linha de D49 x R35', angusDe(semRegistro)?.dem === 49)
caso('COM registro, a média serve a linha de D45 x R34', angusDe(comRegistro)?.dem === 45)
caso('a escolha NÃO muda o número de rodadas', comRegistro.nPesquisas === semRegistro.nPesquisas)
caso('a escolha NÃO muda o número de institutos', comRegistro.nInstitutos === semRegistro.nInstitutos)
caso('a escolha MOVE a vantagem servida', comRegistro.vantagemDem !== semRegistro.vantagemDem)
caso('a vantagem cai, porque o painel escolhido tem margem menor', comRegistro.vantagemDem < semRegistro.vantagemDem)
caso('a auditoria entra no objeto da média', Array.isArray(comRegistro.tratamentoDoIndeciso) && comRegistro.tratamentoDoIndeciso.length === 1)
caso('sem onda declarada, a chave nem aparece no objeto', !('tratamentoDoIndeciso' in semRegistro))
caso('a outra casa é a MESMA linha nos dois cenários', comRegistro.incluidas.find((p) => /Quinnipiac/.test(p.instituto))?.dem === 51)

// Anti-excesso: universo sem a onda declarada sai idêntico com e sem registro.
const soOutra = [OUTRA]
caso(
  'universo sem a onda declarada é idêntico com e sem registro',
  JSON.stringify(media(soOutra, 30, AGORA, undefined, undefined, TRATAMENTO_ESCOLHIDO)) ===
    JSON.stringify(media(soOutra, 30, AGORA, undefined, undefined, [])),
)

// 🔑 E quando a escolha CADUCA, a média não pode fingir que escolheu: ela volta à
// hierarquia, e a auditoria tem de dizer CADUCOU no arquivo.
const universoCaducado = UNIVERSO.map((p) => (p.dem === 45 ? { ...p, dem: 46 } : p))
const mCaducado = media(universoCaducado, 30, AGORA, undefined, undefined, TRATAMENTO_ESCOLHIDO)
caso('escolha caducada: a média volta à hierarquia de recorte', angusDe(mCaducado)?.dem === 49)
caso('escolha caducada: o arquivo diz CADUCOU', mCaducado.tratamentoDoIndeciso?.[0]?.estado === 'CADUCOU')


// ───── 🎚️ A SEGUNDA onda declarada: The Argument, com QUATRO paineis (07/Out) ─────
//
// 🔑 Ela difere da Angus Reid no que mais importa: o topline esta atras de
// PAYWALL, entao os rotulos sao DESCRITIVOS e nossos. A decisao saiu da anotacao
// do indice (`comLeaners`) e da CONTINUIDADE da serie, medida nas 7 ondas da casa.
{
  const ONDA = [
    { instituto: 'The Argument/Verasight', campoInicio: '2026-09-16', campoFim: '2026-09-22', amostra: null, amostraTipo: 'LV', dem: 55, rep: 45, outros: null },
    { instituto: 'The Argument/Verasight', campoInicio: '2026-09-16', campoFim: '2026-09-22', amostra: null, amostraTipo: 'LV', dem: 50, rep: 41, outros: 9 },
    { instituto: 'The Argument/Verasight', campoInicio: '2026-09-16', campoFim: '2026-09-22', amostra: 1603, amostraTipo: 'RV', dem: 53, rep: 47, outros: null },
    { instituto: 'The Argument/Verasight', campoInicio: '2026-09-16', campoFim: '2026-09-22', amostra: 1603, amostraTipo: 'RV', dem: 48, rep: 41, outros: 11 },
  ]
  caso('argument: a onda esta declarada', buscar(ONDA[0]) !== null)
  caso('argument: a linha de duas vias LV e a ESCOLHIDA', ehEscolhida(ONDA[0]) === true)
  caso('argument: a de residual LV NAO e', ehEscolhida(ONDA[1]) === false)
  caso('argument: a de duas vias RV NAO e', ehEscolhida(ONDA[2]) === false)
  caso('argument: a de residual RV NAO e', ehEscolhida(ONDA[3]) === false)

  const a = auditar(ONDA)
  caso('argument: a auditoria sai ESCOLHIDA', a?.estado === 'ESCOLHIDA')
  caso('argument: com QUATRO linhas na onda', a?.linhasDaOnda?.length === 4)
  caso('argument: e exatamente UMA casando', a?.quantasCasam === 1)
  caso('argument: a marcada e a de D55 x R45', a?.linhasDaOnda?.find((l) => l.escolhida)?.dem === 55)
  caso('argument: os 4 paineis estao declarados', buscar(ONDA[0])?.paineis?.length === 4)

  // 🔴 A caducidade por VALOR, que e o que protege de o indice reescrever.
  caso('argument: dem reescrito CADUCA', auditar(ONDA.map((p) => (p.dem === 55 ? { ...p, dem: 56 } : p)))?.estado === 'CADUCOU')
  caso('argument: rep reescrito CADUCA', auditar(ONDA.map((p) => (p.rep === 45 && p.dem === 55 ? { ...p, rep: 44 } : p)))?.estado === 'CADUCOU')

  // ⛔ ANTI-EXCESSO: os quatro pares de valores sao DISTINTOS, entao nunca ha
  //    AMBIGUA nesta onda. Se o indice passar a repetir um par, a regua acende.
  const pares = new Set(ONDA.map((p) => p.dem + '/' + p.rep))
  caso('argument ANTI-EXCESSO: os 4 pares sao distintos', pares.size === 4)
  caso(
    'argument ANTI-EXCESSO: par repetido daria AMBIGUA',
    auditar([...ONDA, { ...ONDA[0] }])?.estado === 'AMBIGUA',
  )

  // ⛔ E a declaracao da The Argument NAO pode tocar a da Angus Reid.
  const ANGUS = { instituto: 'Angus Reid Global', campoFim: '2026-09-25', dem: 45, rep: 34 }
  caso('argument ANTI-EXCESSO: a Angus Reid segue escolhida pelo painel dela', ehEscolhida(ANGUS) === true)
  caso('argument ANTI-EXCESSO: e a onda da Angus nao vira a da Argument', buscar(ANGUS)?.serie === 'Angus Reid Global')
  caso('argument ANTI-EXCESSO: outra onda da MESMA casa nao e declarada', buscar({ ...ONDA[0], campoFim: '2026-07-26' }) === null)
  caso('argument: o registro tem as DUAS ondas', TRATAMENTO_ESCOLHIDO.length === 2)
}

// ───────────────────────── CONTROLE POSITIVO ─────────────────────────
//
// Um arnês que não consegue reprovar nada é indistinguível de um arnês verde.
caso('CONTROLE POSITIVO: a carga reprova quando eu a quebro de propósito', conferirCarga([{ serie: 'X' }]).length > 0)
caso('CONTROLE POSITIVO: ehEscolhida sabe dizer NÃO', ehEscolhida({ instituto: 'Angus Reid Global', campoFim: '2026-09-25', dem: 1, rep: 1 }) === false)

console.log(`\n🎚️ TRATAMENTO DO INDECISO · ${ok + falhas.length} asserções`)
if (falhas.length) {
  console.log(`\n❌ ${falhas.length} FALHA(S):`)
  for (const f of falhas) console.log('   · ' + f)
  console.log(`\nVEREDITO: REPROVADO (${ok} passaram)`)
  process.exit(1)
}
console.log(`   ✅ ${ok} de ${ok}`)
console.log('\nVEREDITO: APROVADO')
