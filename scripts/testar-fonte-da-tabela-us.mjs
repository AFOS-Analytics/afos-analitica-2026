/**
 * 🧪 ONDE A TABELA DO GENERIC BALLOT MORA — casos plantados
 *
 * 🔴 O caso que criou esta regra, 25/Set/2026. A Wikipédia moveu a tabela do
 *    generic ballot do corpo do artigo para uma subpágina e passou a
 *    TRANSCLUÍ-LA. A seção ficou assim, inteira:
 *
 *        ==Polling==
 *        {{2026 United States elections/polling}}
 *
 *    `?action=raw` devolve wikitext NÃO EXPANDIDO, então a tabela simplesmente
 *    não vinha mais: o artigo ficou com ZERO wikitable e a leitura caiu de 424
 *    linhas para 0. O portão de colapso reprovou a passada, que é o certo.
 *
 * 🕳️ E havia um defeito silencioso do nosso lado, no MESMO par de âncoras: o
 *    início (`==Polling==`) era conferido e lançava, e o fim (`\n|}`) não era.
 *    `slice(ini, -1)` é fatia VÁLIDA em JS, então o parser seguia lendo até o
 *    fim do artigo como se aquilo fosse a tabela. Naquele dia não produziu linha
 *    contaminada só porque o pedaço restante não tinha nenhum `|-`.
 *
 * ⚖️ Metade dos casos aqui é ANTI-SILÊNCIO e metade é ANTI-EXCESSO, porque os
 *    dois erros deste conserto são simétricos: devolver vazio calado quando a
 *    origem muda, e seguir uma transclusão que é só moldura de nota de rodapé.
 */
import { localizarFonteDaTabela, paginaDaTransclusao, parseTabela } from '../lib/us-polls/collect.mjs'

let ok = 0
let falhas = 0
const eq = (achado, esperado, nome) => {
  if (JSON.stringify(achado) === JSON.stringify(esperado)) {
    ok++
    return
  }
  falhas++
  console.error(`  ❌ ${nome}\n       esperado ${JSON.stringify(esperado)}\n       achado   ${JSON.stringify(achado)}`)
}
const lanca = (fn, nome) => {
  try {
    fn()
    falhas++
    console.error(`  ❌ ${nome}\n       esperado LANÇAR, e nao lancou`)
  } catch {
    ok++
  }
}

console.log('\n🧪 onde a tabela mora: inline, transcluida, ou lugar nenhum\n')

// ── O caso REAL de 25/Set/2026 ───────────────────────────────────────────────
const real = [
  '==State elections==',
  'texto',
  '==Polling==',
  '{{2026 United States elections/polling}}',
  '',
  '==Elections by state or territory==',
  '{{Div col|colwidth=10em}}',
].join('\n')
const r = localizarFonteDaTabela(real)
eq(r.modo, 'transclusao', 'o caso real: a secao virou transclusao')
eq(r.titulo, 'Template:2026 United States elections/polling', 'o caso real: o titulo resolvido')

// ── INLINE, que e a forma de antes e tem de continuar vencendo ────────────────
const inline = ['==Polling==', '{{sticky header}}', '{| class="wikitable"', '|-', '! Poll source', '|}'].join('\n')
eq(localizarFonteDaTabela(inline).modo, 'inline', 'tabela inline continua sendo lida inline')

// ⭐ INLINE vence a transclusao quando as duas estao na secao: a tabela de
//    verdade e sempre melhor que seguir um link.
const ambos = ['==Polling==', '{{Alguma coisa}}', '{| class="wikitable"', '|-', '|}'].join('\n')
eq(localizarFonteDaTabela(ambos).modo, 'inline', 'com tabela E transclusao, a tabela vence')

// ── ANTI-EXCESSO: a secao termina no PROXIMO cabecalho de nivel 2 ────────────
// 🔑 Tabela de OUTRA secao nao pode fazer esta parecer inline. Delimitar a secao
//    pelo primeiro `|}` seria circular: a tabela e justamente o que pode faltar.
const tabelaDepois = [
  '==Polling==',
  '{{2026 United States elections/polling}}',
  '==Elections by state or territory==',
  '{| class="wikitable"',
  '|-',
  '|}',
].join('\n')
const rd = localizarFonteDaTabela(tabelaDepois)
eq(rd.modo, 'transclusao', 'tabela da secao SEGUINTE nao faz esta parecer inline')
eq(rd.titulo, 'Template:2026 United States elections/polling', 'e o titulo continua o certo')

// ── ANTI-EXCESSO: moldura e nota de rodape NAO sao a fonte ───────────────────
const comMoldura = [
  '==Polling==',
  '{{Main|2026 United States House of Representatives elections}}',
  '{{See also|Generic ballot}}',
  '{{2026 United States elections/polling}}',
].join('\n')
eq(
  localizarFonteDaTabela(comMoldura).titulo,
  'Template:2026 United States elections/polling',
  'hatnote antes da transclusao nao e escolhida'
)

// ⛔ E secao com SO moldura nao tem fonte nenhuma: tem de LANCAR, nunca devolver
//    a moldura como se fosse a tabela.
lanca(
  () => localizarFonteDaTabela(['==Polling==', '{{Main|Outra coisa}}', '==Outra=='].join('\n')),
  'secao com SO hatnote lanca'
)

// ── ANTI-SILENCIO: os tres jeitos de nao ter nada para ler ───────────────────
// 🔑 Zero pesquisa e saida PLAUSIVEL num dia sem divulgacao, e e por isso que
//    cada um destes tem de LANCAR em vez de devolver vazio.
lanca(() => localizarFonteDaTabela('==Federal elections==\ntexto'), 'sem a secao Polling, lanca')
lanca(() => localizarFonteDaTabela(['==Polling==', 'texto solto', '==Outra=='].join('\n')), 'secao sem tabela e sem transclusao, lanca')
lanca(() => localizarFonteDaTabela(''), 'wikitext vazio lanca')

// ── Resolucao de namespace ───────────────────────────────────────────────────
eq(paginaDaTransclusao('2026 United States elections/polling'), 'Template:2026 United States elections/polling', '{{X}} e Template:X')
eq(paginaDaTransclusao(':2026 United States elections'), '2026 United States elections', '{{:X}} e o artigo X')
eq(paginaDaTransclusao('Template:Foo'), 'Template:Foo', 'prefixo explicito passa direto')
eq(paginaDaTransclusao('  Foo  '), 'Template:Foo', 'espaco em volta nao vira parte do titulo')

// ── O FIM DA TABELA tambem e ancora, e era o defeito silencioso ──────────────
console.log('\n🧪 o fim da tabela e ancora, e ele nao era conferido\n')

const boa = ['{| class="wikitable"', '|-', '! a', '|-', '| Casa', '| 50', '|}', 'depois'].join('\n')
eq(Array.isArray(parseTabela(boa)), true, 'tabela bem formada e lida sem lancar')

// 🔴 Este e o caso do dia: `indexOf` devolve -1 e `slice(ini, -1)` NAO da erro.
//    Sem a guarda, o parser lia o resto do artigo como se fosse a tabela.
lanca(
  () => parseTabela(['{| class="wikitable"', '|-', '! a', '|-', '| Casa', '| 50'].join('\n')),
  'tabela SEM o fim (|}) lanca em vez de ler o resto do documento'
)
lanca(() => parseTabela('texto sem tabela nenhuma'), 'fonte sem tabela lanca')

// ⛔ ANTI-EXCESSO: `desde` nao pode achar tabela ANTES do ponto pedido.
lanca(
  () => parseTabela(['{| class="wikitable"', '|-', '|}'].join('\n'), 40),
  'com desde depois da unica tabela, lanca em vez de voltar atras'
)

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${ok} asserção(ões) passaram, ${falhas} falharam\n`)
process.exit(falhas === 0 ? 0 : 1)
