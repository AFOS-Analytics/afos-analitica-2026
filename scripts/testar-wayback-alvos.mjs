/**
 * testar-wayback-alvos.mjs · casos plantados para a separação da fila do
 * Wayback. Sem rede.
 *
 * 🔑 O caso 2 é o que importa: o controle NEGATIVO. Uma lista de "pular" que
 * cresce por suspeita perde matéria de verdade, e o jeito de impedir isso é
 * exigir que veículo NENHUM entre nela, nem os que devolvem 403 ao nosso robô.
 *
 * Uso: node scripts/testar-wayback-alvos.mjs
 */

import { readFileSync } from 'fs'
import { motivoDePular, separarAlvos, NAO_ARQUIVAVEL } from './lib/wayback-alvos.mjs'

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

console.log('\n1. 🔴 A infraestrutura sai da fila, COM motivo')
{
  const poly = 'https://polymarket.com/event/brazil-presidential-election'
  const tse = 'https://divulgacandcontas.tse.jus.br/divulga/'
  conferir('Polymarket é pulado', motivoDePular(poly) !== null)
  conferir('e o motivo diz POR QUE, não só que pulou', /anti-rob|disjuntor/i.test(motivoDePular(poly)), String(motivoDePular(poly)))
  conferir('TSE é pulado', motivoDePular(tse) !== null)
  conferir('e o motivo cita a borda Akamai', /Akamai/i.test(motivoDePular(tse)))
  conferir('com www também casa', motivoDePular('https://www.polymarket.com/event/x') !== null)
  conferir('http e https casam igual', motivoDePular('http://polymarket.com/event/x') !== null)
}

console.log('\n2. ⭐ O controle NEGATIVO: veículo NENHUM entra na lista')
{
  // Inclusive os que devolvem 403 ao nosso robô. Eles arquivam bem pelo
  // archive.org, e tirá-los daqui por suspeita perderia matéria.
  const veiculos = [
    'https://www.estadao.com.br/politica/materia-x/',
    'https://oglobo.globo.com/politica/noticia/2026/09/04/x.ghtml',
    'https://valor.globo.com/politica/noticia/x.ghtml',
    'https://www.gazetadopovo.com.br/republica/x/',
    'https://www.poder360.com.br/eleicoes/x/',
    'https://news.google.com/rss/articles/CBMiK2h0dHBz?oc=5',
    'https://redir.folha.com.br/redir/online/poder/rss091/*https://www1.folha.uol.com.br/x.shtml',
    'https://www.cnnbrasil.com.br/politica/x/',
  ]
  for (const v of veiculos) {
    conferir(`⭐ ${new URL(v.split('*')[0]).hostname} NÃO é pulado`, motivoDePular(v) === null, String(motivoDePular(v)))
  }
  conferir('a lista de exceção tem só 2 entradas, e não cresce sozinha', NAO_ARQUIVAVEL.length === 2)
}

console.log('\n3. A separação preserva a ORDEM e não perde nada')
{
  // A fila real de 04/Set: PPPPP....T.............
  const fila = [
    'https://polymarket.com/event/a',
    'https://polymarket.com/event/b',
    'https://polymarket.com/event/c',
    'https://polymarket.com/event/d',
    'https://polymarket.com/event/e',
    'https://www.gazetadopovo.com.br/1',
    'https://www.poder360.com.br/2',
    'https://www.estadao.com.br/3',
    'https://oglobo.globo.com/4',
    'https://divulgacandcontas.tse.jus.br/divulga/',
    'https://valor.globo.com/5',
  ]
  const { arquivar, pular } = separarAlvos(fila)
  conferir('6 pulados, 5 arquiváveis, e a soma bate com a fila', pular.length === 6 && arquivar.length === 5 && pular.length + arquivar.length === fila.length)
  conferir('a ordem das que ficam é preservada', arquivar[0].includes('gazetadopovo') && arquivar[4].includes('valor.globo'))
  conferir(
    '🔑 a primeira URL submetida deixa de ser Polymarket, que é o que disparava o disjuntor',
    motivoDePular(arquivar[0]) === null
  )
  conferir('cada pulada carrega a URL e o motivo', pular.every((p) => p.url && p.motivo))

  // ⭐ Controle: fila sem infraestrutura nenhuma não perde uma URL sequer.
  const limpa = ['https://a.com/1', 'https://b.com/2']
  const r = separarAlvos(limpa)
  conferir('⭐ fila sem infraestrutura passa inteira, com zero pulados', r.arquivar.length === 2 && r.pular.length === 0)
  conferir('lista vazia não quebra', separarAlvos([]).arquivar.length === 0)
  conferir('undefined não quebra', separarAlvos(undefined).arquivar.length === 0)
}

console.log('\n4. ⚠️ O efeito medido sobre a DAILY REAL de 04/Set')
{
  // Lê a daily do repositório e refaz a extração como o arquivador faz, para o
  // caso medir o mundo em vez de repetir um número que eu digitei.
  const md = readFileSync('public/afos-daily/2026-09-04.md', 'utf8')
  const re = /\[[^\]]+\]\((https?:\/\/[^)\s]+)\)/g
  const set = new Set()
  let m
  while ((m = re.exec(md)) !== null) if (!m[1].includes('afos-analytics.com')) set.add(m[1])
  const fila = [...set]

  conferir('a daily de 04/Set dá as mesmas 23 URLs da rodada registrada no ledger', fila.length === 23, String(fila.length))

  const { arquivar, pular } = separarAlvos(fila)
  conferir('6 delas são infraestrutura, 26% da cota gasta em URL que não arquiva', pular.length === 6, String(pular.length))
  conferir('sobram 17 de matéria, que é o que a fila deveria ter tentado', arquivar.length === 17, String(arquivar.length))

  // 🔑 A asserção que importa: as N primeiras da fila ORIGINAL são todas
  // puladas e são CONSECUTIVAS. Isso é o gatilho do disjuntor, que aborta com
  // 5 falhas de host seguidas.
  let consecutivas = 0
  while (consecutivas < fila.length && motivoDePular(fila[consecutivas])) consecutivas++
  conferir(
    `🔴 as ${consecutivas} PRIMEIRAS da fila original são infraestrutura, e o disjuntor aborta em 5`,
    consecutivas >= 5,
    `consecutivas=${consecutivas}`
  )
  conferir('✅ depois da separação, a primeira submetida é matéria', motivoDePular(arquivar[0]) === null)
}

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${passes} passaram, ${falhas} falharam.`)
process.exit(falhas === 0 ? 0 : 1)
