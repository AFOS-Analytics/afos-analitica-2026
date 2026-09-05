/**
 * testar-resolver-google-news.mjs — casos plantados para a resolução do
 * invólucro do Google News, sem rede.
 *
 * 🔑 O caso 3 é o que importa: a resposta do endpoint vem cheia de URL do
 * próprio Google, e pegar a primeira que casa devolve um `gstatic`. Foi assim
 * que o arquivador passou meses preservando casca em vez de matéria, só que
 * pelo caminho antigo. O extrator tem que DESCARTAR o Google.
 *
 * Uso: node scripts/testar-resolver-google-news.mjs
 */

import { extrairAtributos, extrairUrlDoVeiculo, montarPayload } from './wayback-archive.ts'

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

console.log('\n1. Os três atributos, e a exigência de que sejam TRÊS')
{
  const bom = '<c-wiz data-n-a-sg="AbCd123" data-n-a-ts="1757030000" data-n-a-id="XYZ">'
  const a = extrairAtributos(bom)
  conferir('extrai os três', a && a.sg === 'AbCd123' && a.ts === '1757030000' && a.id === 'XYZ', JSON.stringify(a))
  conferir('faltando um, devolve null e não um objeto pela metade', extrairAtributos('<c-wiz data-n-a-sg="x" data-n-a-ts="1">') === null)
  conferir('HTML sem nada devolve null', extrairAtributos('<html><body>nada</body></html>') === null)
}

console.log('\n2. O payload leva o ts como NÚMERO, não como texto')
{
  const p = montarPayload({ sg: 'S', ts: '1757030000', id: 'I' })
  conferir('é JSON válido', (() => { try { JSON.parse(p); return true } catch { return false } })())
  conferir('o ts entra sem aspas', p.includes('1757030000,') || p.includes(',1757030000'), p.slice(0, 120))
  conferir('carrega o método Fbv4je', p.includes('Fbv4je'))
  conferir('e o garturlreq', p.includes('garturlreq'))
}

console.log('\n3. 🔴 O extrator DESCARTA o Google e acha o veículo')
{
  // Forma CRUA, que foi a medida em 04/Set: o endpoint devolveu barra normal.
  const crua = '[["wrb.fr","Fbv4je","[garturlres,https://www.gazetadopovo.com.br/republica/materia-x/]"]]'
  conferir(
    'acha a URL do veículo na forma CRUA',
    extrairUrlDoVeiculo(crua) === 'https://www.gazetadopovo.com.br/republica/materia-x/',
    String(extrairUrlDoVeiculo(crua))
  )

  // 🔴 Forma ESCAPADA, que é JSON dentro de JSON. Montada por concatenação de
  // propósito, para o fixture não depender de eu acertar três camadas de
  // escapada. A primeira versão do extrator parava no primeiro contrabarra e
  // devolvia só o HOST, o que arquivaria a home do veículo.
  const B = String.fromCharCode(92) // uma contrabarra
  const escapada = 'x https:' + B + '/' + B + '/' + 'www.gazetadopovo.com.br' + B + '/republica' + B + '/materia-x' + B + '/ y'
  conferir(
    'e também na forma ESCAPADA, com o CAMINHO inteiro',
    extrairUrlDoVeiculo(escapada) === 'https://www.gazetadopovo.com.br/republica/materia-x/',
    String(extrairUrlDoVeiculo(escapada))
  )

  const comLixo =
    'https://www.gstatic.com/x.js https://fonts.googleapis.com/y https://news.google.com/z https://g1.globo.com/politica/noticia/2026/09/04/materia.ghtml'
  conferir(
    '⚠️ ignora gstatic, googleapis e news.google, mesmo vindo ANTES',
    extrairUrlDoVeiculo(comLixo) === 'https://g1.globo.com/politica/noticia/2026/09/04/materia.ghtml',
    String(extrairUrlDoVeiculo(comLixo))
  )
  conferir('resposta só com Google devolve null, e não uma URL do Google', extrairUrlDoVeiculo('https://www.gstatic.com/a https://news.google.com/b') === null)
  conferir('resposta vazia devolve null', extrairUrlDoVeiculo('') === null)
}

console.log('\n4. As barras escapadas do JSON viram barras de verdade')
{
  const B = String.fromCharCode(92)
  const t = '"https:' + B + '/' + B + '/valor.globo.com' + B + '/politica' + B + '/noticia.ghtml"'
  conferir(
    'nenhuma contrabarra sobra, e a aspa final não entra na URL',
    extrairUrlDoVeiculo(t) === 'https://valor.globo.com/politica/noticia.ghtml',
    String(extrairUrlDoVeiculo(t))
  )
}

console.log('\n5. O que NÃO é invólucro do Google News não passa por aqui')
{
  // A Folha resolve OFFLINE, pelo asterisco, e essa continua sendo a via dela.
  const folha = 'https://redir.folha.com.br/redir/online/poder/rss091/*https://www1.folha.uol.com.br/poder/2026/09/x.shtml'
  const m = folha.match(/^https?:\/\/redir\.folha\.com\.br\/.*?\*(https?:\/\/.+)$/)
  conferir('o padrão da Folha extrai a matéria sem rede', m && m[1] === 'https://www1.folha.uol.com.br/poder/2026/09/x.shtml')
}

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${passes} passaram, ${falhas} falharam.`)
process.exit(falhas === 0 ? 0 : 1)
