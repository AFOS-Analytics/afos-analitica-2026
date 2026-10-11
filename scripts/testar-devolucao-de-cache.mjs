/**
 * Testes de scripts/lib/devolucao-de-cache.mjs
 *
 * Metade dos casos é ANTI-EXCESSO, porque o erro simétrico deste atalho é
 * devolver sempre, e devolver sempre sobrescreve a certificação do outro país.
 */
import { daFaixa, decidir, escreve, TRAZER, IDENTICO, CANONICO_MAIS_NOVO, SEM_CARIMBO } from './lib/devolucao-de-cache.mjs'

let ok = 0
const falhas = []
const eq = (rotulo, veio, esperado) => {
  if (JSON.stringify(veio) === JSON.stringify(esperado)) ok++
  else falhas.push(`${rotulo}: esperado ${JSON.stringify(esperado)}, veio ${JSON.stringify(veio)}`)
}
const acao = (rotulo, entrada, esperado) => eq(rotulo, decidir(entrada).acao, esperado)

// ── daFaixa: o filtro de país ───────────────────────────────────────
const nomes = [
  'ultima-us.json',
  'ultima-br.json',
  'us-2026-10-11T01-08-16-128Z.json',
  'br-2026-10-11T19-00-00-000Z.json',
  'us-quebrado.json',
  'leia-me.txt',
]
eq('faixa us pega os 3 do prefixo', daFaixa(nomes, 'us').sort(), [
  'ultima-us.json',
  'us-2026-10-11T01-08-16-128Z.json',
  'us-quebrado.json',
].sort())
eq('faixa us NAO pega ultima-br', daFaixa(nomes, 'us').includes('ultima-br.json'), false)
eq('faixa us NAO pega br- com carimbo', daFaixa(nomes, 'us').includes('br-2026-10-11T19-00-00-000Z.json'), false)
eq('faixa br pega os 2 dela', daFaixa(nomes, 'br').sort(), ['br-2026-10-11T19-00-00-000Z.json', 'ultima-br.json'].sort())
eq('prefixo ausente devolve vazio', daFaixa(nomes, undefined), [])
eq('prefixo vazio devolve vazio', daFaixa(nomes, ''), [])
eq('lista ausente devolve vazio', daFaixa(undefined, 'us'), [])
// 🔴 anti-excesso: o prefixo exige o HIFEN, então `us` não casa `usuarios.json`
//    nem `ultima-brus.json`. Primeiro eu esperei `usuarios.json` aqui e o teste
//    reprovou: o filtro estava certo e a minha expectativa, errada. Um arquivo
//    chamado `usuarios.json` não é certificação de captura dos EUA.
eq('exige o hifen: nao casa usuarios.json', daFaixa(['ultima-brus.json', 'usuarios.json'], 'us'), [])
eq('mas casa us- com hifen', daFaixa(['us-x.json', 'usuarios.json'], 'us'), ['us-x.json'])

// ── decidir: os 4 ramos ─────────────────────────────────────────────
acao('ausente no canonico TRAZ', { existeCanonico: false, shaArvore: 'a', carimboArvore: 'x' }, TRAZER)

acao(
  'identico por sha e IDENTICO',
  { existeCanonico: true, shaArvore: 'a', shaCanonico: 'a', carimboArvore: '2026-10-11', carimboCanonico: '2026-10-11' },
  IDENTICO
)

acao(
  'arvore mais nova TRAZ',
  {
    existeCanonico: true,
    shaArvore: 'a',
    shaCanonico: 'b',
    carimboArvore: '2026-10-11T01:08:16.128Z',
    carimboCanonico: '2026-10-09T17:31:12.959Z',
  },
  TRAZER
)

// 🔴 O caso que o atalho existe para NAO fazer.
acao(
  'canonico mais novo RECUSA',
  {
    existeCanonico: true,
    shaArvore: 'a',
    shaCanonico: 'b',
    carimboArvore: '2026-10-09T17:31:12.959Z',
    carimboCanonico: '2026-10-11T01:08:16.128Z',
  },
  CANONICO_MAIS_NOVO
)

// 🔴 EMPATE de carimbo com conteudo diferente: nao se sobrescreve.
acao(
  'carimbo igual e conteudo diferente RECUSA',
  {
    existeCanonico: true,
    shaArvore: 'a',
    shaCanonico: 'b',
    carimboArvore: '2026-10-11T01:08:16.128Z',
    carimboCanonico: '2026-10-11T01:08:16.128Z',
  },
  CANONICO_MAIS_NOVO
)

acao(
  'sem carimbo na arvore RECUSA',
  { existeCanonico: true, shaArvore: 'a', shaCanonico: 'b', carimboArvore: null, carimboCanonico: '2026-10-11' },
  SEM_CARIMBO
)
acao(
  'sem carimbo no canonico RECUSA',
  { existeCanonico: true, shaArvore: 'a', shaCanonico: 'b', carimboArvore: '2026-10-11', carimboCanonico: null },
  SEM_CARIMBO
)
acao('sem carimbo nos dois RECUSA', { existeCanonico: true, shaArvore: 'a', shaCanonico: 'b' }, SEM_CARIMBO)
acao('entrada vazia nao TRAZ por acidente', {}, TRAZER)

// 📌 A entrada vazia cai em TRAZER porque `existeCanonico` falso quer dizer
//    "não há nada a perder lá". É o ramo seguro: escrever onde não havia nada.
eq('entrada vazia tem motivo de ausencia', decidir({}).motivo, 'não existia no cache canônico')

// 🔴 anti-silencio: sha igual mas um dos lados sem sha nao pode virar IDENTICO
acao(
  'sha ausente num lado NAO vira identico',
  { existeCanonico: true, shaArvore: undefined, shaCanonico: undefined, carimboArvore: '2026-10-11', carimboCanonico: '2026-10-09' },
  TRAZER
)

// ── escreve: so TRAZER toca o disco ─────────────────────────────────
eq('escreve TRAZER', escreve(TRAZER), true)
eq('nao escreve IDENTICO', escreve(IDENTICO), false)
eq('nao escreve CANONICO_MAIS_NOVO', escreve(CANONICO_MAIS_NOVO), false)
eq('nao escreve SEM_CARIMBO', escreve(SEM_CARIMBO), false)

// ── os motivos saem preenchidos, porque recusa calada e pior que recusa ──
for (const [rotulo, entrada] of [
  ['ausente', { existeCanonico: false }],
  ['identico', { existeCanonico: true, shaArvore: 'a', shaCanonico: 'a' }],
  ['canonico novo', { existeCanonico: true, shaArvore: 'a', shaCanonico: 'b', carimboArvore: '1', carimboCanonico: '2' }],
  ['sem carimbo', { existeCanonico: true, shaArvore: 'a', shaCanonico: 'b' }],
]) {
  const r = decidir(entrada)
  eq(`motivo preenchido em ${rotulo}`, typeof r.motivo === 'string' && r.motivo.length > 10, true)
}

console.log(`\n🧪 devolucao-de-cache: ${ok} asserção(ões) passaram, ${falhas.length} falharam`)
for (const f of falhas) console.log(`   ❌ ${f}`)
console.log(falhas.length ? '\nVEREDITO: REPROVADO\n' : '\nVEREDITO: APROVADO\n')
process.exit(falhas.length ? 1 : 0)
