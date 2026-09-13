/**
 * Teste do medidor ÍNDICE x MUNDO (`lib/us-polls/agregadores.mjs`).
 *
 * 🔴 O QUE ELE EXISTE PARA PEGAR, e são dois lados:
 *
 *   1. que ele ACUSE quando os agregadores declaram campo depois da nossa base
 *      (o caso real de 13/Set/2026: seis de seis em 11/Set, a base em 31/Ago);
 *   2. que ele NÃO diga "em compasso" quando não enxergou: seção sumida, rede
 *      caída, um agregador só, ou tabela parada. Compasso falso é o medidor
 *      mudo, e medidor mudo é indistinguível de medidor quebrado.
 *
 * E um terceiro, que é o que o faria mentir para o outro lado: erro de
 * digitação num agregador só, ou `access-date` de referência, não podem
 * fabricar atraso.
 *
 * Uso:  node scripts/testar-agregadores-us.mjs
 */

import {
  buscarAgregadores,
  compararComBase,
  extrairSecao,
  fimDoIntervalo,
  lerAgregadores,
  limparCelula,
  TOLERANCIA_DIAS,
  VEREDITOS,
} from '../lib/us-polls/agregadores.mjs'

let falhas = 0
let passes = 0

function ok(nome, condicao, detalhe = '') {
  if (condicao) { passes++; console.log(`  ✅ ${nome}`) }
  else { falhas++; console.log(`  ❌ ${nome}${detalhe ? ' — ' + detalhe : ''}`) }
}
const eq = (nome, obtido, esperado) =>
  ok(nome, obtido === esperado, `esperado ${JSON.stringify(esperado)}, veio ${JSON.stringify(obtido)}`)

const HOJE = '2026-09-13'

/** Uma linha de agregador no formato da tabela real. */
const linha = (nome, administrado, atualizado = 'September 13, 2026') => [
  '|-',
  `|${nome}<ref>{{cite web |url=https://exemplo.org/gb|title=Generic Ballot|access-date=October 21, 2025}}</ref>`,
  `|${administrado}`,
  `|${atualizado}`,
  '|41.9%',
  "|{{Party shading/Democratic}} |'''48.6%'''",
  '|9.5%',
  "|{{Party shading/Democratic}} |'''Democrats +6.7%'''",
].join('\n')

const secao = (...linhas) => [
  '==Opinion polling==',
  '<section begin="GenericBallotAgg"/>',
  '{|class="wikitable sortable" style="text-align:center;font-size:90%;line-height:17px"',
  '!Source of poll<br>aggregation',
  '!Dates<br>administered',
  '!Dates<br>updated',
  '!style="width:100px;" |Republicans',
  '!style="width:100px;" |Democrats',
  '!style="width:100px;" |Other/<br>Undecided{{efn |Calculated by taking the difference of 100% and all other candidates combined.|name=|group=}}',
  '!Margin',
  ...linhas,
  '|-',
  "|colspan=2 |'''Average'''",
  '|September 13, 2026',
  '|41.9%',
  "|{{Party shading/Democratic}} |'''48.8%'''",
  '|9.3%',
  "|{{Party shading/Democratic}} |'''Democrats +6.9%'''",
  '|-',
  '|}<section end="GenericBallotAgg" />',
  '',
  '==Crossover seats==',
].join('\n')

/** A tabela como estava em 13/Set/2026. */
const REAL = secao(
  linha('[[Decision Desk HQ]]', 'January 9, 2025 – September 11, 2026'),
  linha('FiftyPlusOne', 'January 9, 2025 – September 11, 2026'),
  linha('[[RealClearPolitics]]', 'August 16 – September 11, 2026'),
  linha('[[Nate Silver|Silver Bulletin]]', 'January 9, 2025 – September 11, 2026'),
  linha('VoteHub', 'January 9, 2025 – September 11, 2026'),
  linha('[[Race to the WH]]', 'January 9, 2025 – September 11, 2026'),
)

console.log('\n📅 fim do intervalo, nas formas da tabela')
eq('ano a ano', fimDoIntervalo('January 9, 2025 – September 11, 2026'), '2026-09-11')
eq('mês a mês no mesmo ano', fimDoIntervalo('August 16 – September 11, 2026'), '2026-09-11')
eq('dia a dia no mesmo mês', fimDoIntervalo('September 2–11, 2026'), '2026-09-11')
eq('virada de mês', fimDoIntervalo('August 30 – September 2, 2026'), '2026-09-02')
eq('data única', fimDoIntervalo('September 11, 2026'), '2026-09-11')
eq('mês abreviado com ponto', fimDoIntervalo('Aug. 16 – Sep. 11, 2026'), '2026-09-11')
eq('travessão em entidade, depois da limpeza', fimDoIntervalo(limparCelula('August 16 &ndash; September 11, 2026')), '2026-09-11')
eq('espaço duro, depois da limpeza', fimDoIntervalo(limparCelula('August 16 – September 11, 2026')), '2026-09-11')
eq('31 de setembro é ilegível, não 1º de outubro', fimDoIntervalo('September 31, 2026'), null)
eq('texto a mais não é garimpado', fimDoIntervalo('September 11, 2026 (est.)'), null)
eq('três pedaços não é intervalo', fimDoIntervalo('June 1 – July 1 – August 1, 2026'), null)
eq('dia sem mês no começo não se inventa', fimDoIntervalo('2 – 11, 2026'), null)
eq('vazio', fimDoIntervalo(''), null)

console.log('\n🧹 limpeza da célula')
eq('link com rótulo', limparCelula('[[Nate Silver|Silver Bulletin]]'), 'Silver Bulletin')
eq('atributo antes do conteúdo', limparCelula('style="text-align:left;" |August 16 – September 11, 2026'), 'August 16 – September 11, 2026')
eq('predefinição como atributo', limparCelula("{{Party shading/Democratic}} |'''48.6%'''"), '48.6%')
eq(
  'access-date da referência NÃO vira data da célula',
  fimDoIntervalo(limparCelula('September 11, 2026<ref>{{cite web|url=x|access-date=October 21, 2025}}</ref>')),
  '2026-09-11',
)

console.log('\n📋 leitura da tabela real de 13/Set')
const lida = lerAgregadores(REAL)
eq('seção encontrada', lida.secaoEncontrada, true)
eq('seis agregadores, sem a linha Average', lida.agregadores.length, 6)
ok('nenhum se chama Average', lida.agregadores.every((a) => !/average/i.test(a.nome)))
eq('nome sem referência nem link', lida.agregadores[0].nome, 'Decision Desk HQ')
eq('rótulo do link', lida.agregadores[3].nome, 'Silver Bulletin')
ok('seis de seis com campo até 11/Set', lida.agregadores.every((a) => a.campoFim === '2026-09-11'))
ok('seis de seis atualizados em 13/Set', lida.agregadores.every((a) => a.atualizadoEm === '2026-09-13'))
eq('extrairSecao não passa do marcador de fim', extrairSecao(REAL).includes('Crossover'), false)

console.log('\n🔴 o caso real: o índice parado em 31/Ago')
const real = compararComBase(lida, '2026-08-31', HOJE)
eq('veredito', real.veredito, VEREDITOS.ATRASADO)
eq('11 dias', real.descompassoDias, 11)
eq('referência', real.referencia, '2026-09-11')
eq('lidos', real.lidos, 6)

console.log('\n⚖️ a borda da tolerância')
eq(`${TOLERANCIA_DIAS} dias é compasso`, compararComBase(lida, '2026-09-08', HOJE).veredito, VEREDITOS.COMPASSO)
eq(`${TOLERANCIA_DIAS + 1} dias é atraso`, compararComBase(lida, '2026-09-07', HOJE).veredito, VEREDITOS.ATRASADO)
eq('mesma data é compasso', compararComBase(lida, '2026-09-11', HOJE).veredito, VEREDITOS.COMPASSO)
eq('base 5 dias à frente, tabela viva', compararComBase(lida, '2026-09-16', '2026-09-16').veredito, VEREDITOS.A_FRENTE)

console.log('\n🛡️ o que NÃO pode fabricar atraso')
const umErro = lerAgregadores(secao(
  linha('A', 'January 9, 2025 – September 12, 2026'),
  linha('B', 'January 9, 2025 – August 31, 2026'),
  linha('C', 'January 9, 2025 – August 31, 2026'),
))
eq('um agregador sozinho à frente não move a referência', compararComBase(umErro, '2026-08-31', HOJE).veredito, VEREDITOS.COMPASSO)
const futuro = lerAgregadores(secao(
  linha('A', 'January 9, 2025 – September 30, 2026'),
  linha('B', 'January 9, 2025 – September 30, 2026'),
  linha('C', 'January 9, 2025 – August 31, 2026'),
  linha('D', 'January 9, 2025 – August 31, 2026'),
))
eq('data de campo no futuro é descartada, mesmo em dois', compararComBase(futuro, '2026-08-31', HOJE).veredito, VEREDITOS.COMPASSO)

console.log('\n⚪ o que NÃO pode virar "em compasso"')
eq('seção sumida', compararComBase(lerAgregadores('==Opinion polling==\nsem tabela'), '2026-08-31', HOJE).veredito, VEREDITOS.INCONCLUSIVO)
eq('marcador de início sem o de fim', compararComBase(lerAgregadores('<section begin="GenericBallotAgg"/>\n{|\n|-\n|A\n|September 11, 2026\n|September 13, 2026'), '2026-08-31', HOJE).veredito, VEREDITOS.INCONCLUSIVO)
eq('nossa base sem data', compararComBase(lida, null, HOJE).veredito, VEREDITOS.INCONCLUSIVO)
const umSo = lerAgregadores(secao(linha('A', 'January 9, 2025 – September 11, 2026'), linha('B', 'a definir')))
eq('um agregador legível só', compararComBase(umSo, '2026-09-11', HOJE).veredito, VEREDITOS.INCONCLUSIVO)
eq('um legível só também não acusa atraso', compararComBase(umSo, '2026-08-01', HOJE).veredito, VEREDITOS.INCONCLUSIVO)

const velha = lerAgregadores(secao(
  linha('A', 'January 9, 2025 – August 31, 2026', 'August 20, 2026'),
  linha('B', 'January 9, 2025 – August 31, 2026', 'August 20, 2026'),
))
eq('tabela parada há 24 dias não prova compasso', compararComBase(velha, '2026-08-31', HOJE).veredito, VEREDITOS.INCONCLUSIVO)
eq('tabela parada também não prova base à frente', compararComBase(velha, '2026-09-10', HOJE).veredito, VEREDITOS.INCONCLUSIVO)
eq('mas ainda prova atraso, porque data não envelhece', compararComBase(velha, '2026-08-01', HOJE).veredito, VEREDITOS.ATRASADO)
const semAtualizacao = lerAgregadores(secao(
  linha('A', 'January 9, 2025 – August 31, 2026', ''),
  linha('B', 'January 9, 2025 – August 31, 2026', ''),
))
eq('sem data de atualização legível, compasso vira inconclusivo', compararComBase(semAtualizacao, '2026-08-31', HOJE).veredito, VEREDITOS.INCONCLUSIVO)

console.log('\n🔌 rede')
const caiu = await buscarAgregadores({ fetchImpl: async () => { throw new Error('ECONNRESET') } })
eq('rede caída vira seção não encontrada', caiu.secaoEncontrada, false)
eq('e o erro é declarado', caiu.erro, 'ECONNRESET')
eq('e o veredito é inconclusivo', compararComBase(caiu, '2026-08-31', HOJE).veredito, VEREDITOS.INCONCLUSIVO)
const barrado = await buscarAgregadores({ fetchImpl: async () => ({ ok: false, status: 403, text: async () => '' }) })
eq('HTTP 403 é inconclusivo', compararComBase(barrado, '2026-08-31', HOJE).veredito, VEREDITOS.INCONCLUSIVO)
const servida = await buscarAgregadores({ fetchImpl: async () => ({ ok: true, status: 200, text: async () => REAL }) })
eq('resposta boa lê a tabela', compararComBase(servida, '2026-08-31', HOJE).veredito, VEREDITOS.ATRASADO)

console.log('\n🔀 células na mesma linha')
const inline = lerAgregadores([
  '<section begin="GenericBallotAgg"/>', '{|', '!a', '|-',
  '|A || January 9, 2025 – September 11, 2026 || September 13, 2026 || 1 || 2',
  '|-',
  '|B || January 9, 2025 – September 11, 2026 || September 13, 2026 || 1 || 2',
  '|}<section end="GenericBallotAgg"/>',
].join('\n'))
eq('dois agregadores lidos com ||', inline.agregadores.length, 2)
eq('e com a data certa', inline.agregadores[1]?.campoFim, '2026-09-11')

console.log(`\n${falhas ? '❌' : '✅'} ${passes} passaram, ${falhas} falharam\n`)
process.exit(falhas ? 1 : 0)
