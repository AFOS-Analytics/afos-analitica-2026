/**
 * Teste do conferidor de defasagem (`lib/us-polls/defasagem.mjs`).
 *
 * 🔴 O QUE ELE EXISTE PARA PEGAR, e são DUAS coisas opostas:
 *
 *   1. que o alarme toque quando não há pesquisa nova (o defeito de 07/Set);
 *   2. que o alarme EMUDEÇA quando há (o defeito que o conserto pode criar).
 *
 * O segundo é o que importa mais. Apertar a régua para calar um falso positivo é
 * a maneira mais fácil de transformar um conferidor barulhento num conferidor
 * inútil, e um conferidor calado é indistinguível de um conferidor quebrado.
 * Por isso o caso do generic ballot de verdade está aqui em três formas.
 *
 * 📌 O seam é a função `veredito` mais a leitura de datas, ou seja tudo menos a
 * rede. O script `check-us-polls-defasagem.mjs` não pode ser importado: ele tem
 * `await` no topo e importá-lo dispara as requisições.
 *
 * Uso:  node scripts/testar-defasagem-us.mjs
 */

import {
  datasDe,
  datasDoTemaEmHtml,
  trechoDaData,
  veredito,
  ocorrenciasDe,
  VEREDITOS,
  JANELA_ITEM,
} from '../lib/us-polls/defasagem.mjs'

const HOJE = '2026-09-07'
let falhas = 0
let passes = 0

function ok(nome, condicao, detalhe = '') {
  if (condicao) { passes++; console.log(`  ✅ ${nome}`) }
  else { falhas++; console.log(`  ❌ ${nome}${detalhe ? ' — ' + detalhe : ''}`) }
}

const eq = (nome, obtido, esperado) =>
  ok(nome, obtido === esperado, `esperado ${JSON.stringify(esperado)}, veio ${JSON.stringify(obtido)}`)

/** Enche espaço para afastar dois trechos por um número medido de caracteres. */
const vao = (n) => ' palavra'.repeat(Math.ceil(n / 8)).slice(0, n)

/**
 * A PÁGINA DA BIG DATA POLL, na forma que ela tinha em 07/Set/2026: o post mais
 * novo é de tema local, e o "Generic Ballot" é item do catálogo de projetos, a
 * mais de 2.000 caracteres dali.
 */
const PAGINA_CATALOGO =
  'Polling Blog Majority in Springfield, Ohio Want Ex-TPS Haitians Deported Big Data Poll ' +
  'August 27, 2026 Trump Approval Hits New Low July 30, 2026 How Would Americans Handle ' +
  'Alien Disclosure July 5, 2026 Trump Bump Voters Support Peace Deal June 29, 2026' +
  vao(2200) +
  'Projects Presidential Job Approval Political Party Affiliation Political Generic Ballot ' +
  'Political Direction of Country Political Economic Confidence Index'

/** A mesma casa, mas com um generic ballot de verdade no topo da listagem. */
const PAGINA_COM_RODADA_NOVA =
  'Polling Blog Democrats Lead Generic Congressional Ballot by Six Big Data Poll ' +
  'August 27, 2026 Trump Approval Hits New Low July 30, 2026 How Would Americans Handle ' +
  'Alien Disclosure July 5, 2026 Trump Bump Voters Support Peace Deal June 29, 2026' +
  vao(2200) +
  'Projects Presidential Job Approval Political Generic Ballot Political Direction of Country'

console.log('\n🔬 LEITURA DE DATAS\n')

eq('lê as quatro datas da listagem', datasDe(PAGINA_CATALOGO, HOJE).length, 4)
eq('a mais recente é a do post do topo', datasDe(PAGINA_CATALOGO, HOJE).pop(), '2026-08-27')
eq('data futura não entra', datasDe('Poll of October 20, 2027 and July 5, 2026', HOJE).length, 1)
eq('formato ISO também é lido', datasDe('campo 2026-08-14 e 2026-08-02 e 2026-07-30', HOJE).length, 3)
eq('formato barra também é lido', datasDe('7/29/2026 e 6/28/2026 e 5/28/2026', HOJE).length, 3)
ok('a ocorrência traz posição, que é o que amarra data a assunto',
  ocorrenciasDe(PAGINA_CATALOGO, HOJE).every((o) => Number.isInteger(o.index)))

console.log('\n🔴 O DEFEITO DE 07/Set: catálogo longe não é item do tema\n')

eq('nenhuma data do catálogo vira data do tema',
  datasDoTemaEmHtml(PAGINA_CATALOGO, HOJE).length, 0)

const vCatalogo = veredito({
  conhecido: '2026-07-29',
  datas: datasDe(PAGINA_CATALOGO, HOJE),
  datasDoTema: datasDoTemaEmHtml(PAGINA_CATALOGO, HOJE),
  temaNaPagina: true,
  granularidade: 'proximidade',
})
eq('veredicto vira TEMA LONGE DA DATA, não POSSIVEL NOVIDADE', vCatalogo.veredicto, VEREDITOS.TEMA_LONGE)
ok('e NÃO vira EM DIA, que seria fechar a suspeita com verde',
  vCatalogo.veredicto !== VEREDITOS.EM_DIA)

console.log('\n⛔ CONTROLE ANTI-SILÊNCIO: rodada de verdade continua acusada\n')

eq('a data do post de generic ballot é data do tema',
  datasDoTemaEmHtml(PAGINA_COM_RODADA_NOVA, HOJE).pop(), '2026-08-27')
eq('veredicto volta a ser POSSIVEL NOVIDADE', veredito({
  conhecido: '2026-07-29',
  datas: datasDe(PAGINA_COM_RODADA_NOVA, HOJE),
  datasDoTema: datasDoTemaEmHtml(PAGINA_COM_RODADA_NOVA, HOJE),
  temaNaPagina: true,
  granularidade: 'proximidade',
}).veredicto, VEREDITOS.POSSIVEL_NOVIDADE)

eq('marcador logo antes da data conta', datasDoTemaEmHtml(
  'House of Representatives poll released August 27, 2026 and July 5, 2026 and June 1, 2026', HOJE).length, 3)
eq('marcador na borda da janela ainda conta', datasDoTemaEmHtml(
  `generic ballot${vao(JANELA_ITEM - 40)} August 27, 2026`, HOJE).length, 1)
eq('marcador além da janela não conta', datasDoTemaEmHtml(
  `generic ballot${vao(JANELA_ITEM + 400)} August 27, 2026`, HOJE).length, 0)

console.log('\n📐 CONTROLE POSITIVO E TOLERÂNCIA\n')

const cheia = ['2026-07-01', '2026-07-15', '2026-08-27']
eq('página com menos de 3 datas é INCONCLUSIVO, não EM DIA', veredito({
  conhecido: '2026-07-29', datas: ['2026-08-27', '2026-08-01'], datasDoTema: ['2026-08-27'],
  temaNaPagina: true, granularidade: 'proximidade',
}).veredicto, VEREDITOS.INCONCLUSIVO)

eq('sem base nossa o veredicto é SEM BASE', veredito({
  conhecido: undefined, datas: cheia, datasDoTema: cheia, temaNaPagina: true,
}).veredicto, VEREDITOS.SEM_BASE)

eq('página que não fala do tema é SEM ITEM DO TEMA', veredito({
  conhecido: '2026-07-29', datas: cheia, datasDoTema: [], temaNaPagina: false,
  granularidade: 'proximidade',
}).veredicto, VEREDITOS.SEM_ITEM_DO_TEMA)

eq('item do tema 5 dias mais novo cabe na tolerância e é EM DIA', veredito({
  conhecido: '2026-07-29', datas: ['2026-07-01', '2026-07-20', '2026-08-03'],
  datasDoTema: ['2026-08-03'], temaNaPagina: true, granularidade: 'proximidade',
}).veredicto, VEREDITOS.EM_DIA)

eq('item do tema 9 dias mais novo estoura a tolerância e acusa', veredito({
  conhecido: '2026-07-29', datas: ['2026-07-01', '2026-07-20', '2026-08-07'],
  datasDoTema: ['2026-08-07'], temaNaPagina: true, granularidade: 'proximidade',
}).veredicto, VEREDITOS.POSSIVEL_NOVIDADE)

console.log('\n📡 O CAMINHO DE RSS NÃO MUDA: ali a amarração é exata\n')

/**
 * O caso da Emerson, 19/Ago: o feed tem itens novos, mas são pesquisas
 * ESTADUAIS, e o generic ballot nacional é antigo. Com granularidade de item,
 * EM DIA é legítimo, e o rebaixamento novo não pode invadir este caminho.
 */
eq('feed com item novo estadual e tema antigo segue EM DIA', veredito({
  conhecido: '2026-07-23', datas: ['2026-07-23', '2026-08-06', '2026-08-13'],
  datasDoTema: ['2026-07-23'], temaNaPagina: true, granularidade: 'item',
}).veredicto, VEREDITOS.EM_DIA)

ok('o rebaixamento é exclusivo do HTML', veredito({
  conhecido: '2026-07-23', datas: ['2026-07-23', '2026-08-06', '2026-08-13'],
  datasDoTema: ['2026-07-23'], temaNaPagina: true, granularidade: 'item',
}).veredicto !== VEREDITOS.TEMA_LONGE)

console.log('\n⭐ O TRECHO, que é o atalho para o humano\n')

const trecho = trechoDaData(PAGINA_CATALOGO, '2026-08-27', HOJE)
ok('o trecho mostra o título do item, e não o catálogo', /Springfield/.test(trecho) && !/Generic Ballot/.test(trecho),
  String(trecho))
eq('data ausente devolve nulo em vez de trecho errado', trechoDaData(PAGINA_CATALOGO, '2026-09-01', HOJE), null)

console.log('')
console.log(`${passes} passaram, ${falhas} falharam`)
console.log(falhas ? 'VEREDITO: REPROVADO' : 'VEREDITO: APROVADO')
