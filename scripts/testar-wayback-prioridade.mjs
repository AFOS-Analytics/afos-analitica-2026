/**
 * testar-wayback-prioridade.mjs — casos plantados para a ordenação do passivo
 * do Wayback. Sem rede.
 *
 * 🔑 O caso 3 é o que importa, e ele trava a INVERSÃO de 04/Set/2026. A primeira
 * versão do script ordenava por quantidade de URL arquivável e descontava os
 * invólucros do Google News, porque o diagnóstico era que eles não resolviam.
 * O diagnóstico caiu no mesmo dia: 12 de 12 resolvem, de 3 a 38 dias. Com tudo
 * arquivável, ordenar por quantidade vira ordenar por tamanho da daily, e o
 * caso abaixo exige que a daily ANTIGA e pequena venha antes da NOVA e grande.
 *
 * Uso: node scripts/testar-wayback-prioridade.mjs
 */

import { classificar, custoArchive, custoGoogle, lerLedger, ranquear, urlsDaDaily } from './wayback-prioridade.mjs'

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

const GN = 'https://news.google.com/rss/articles/CBMiK2h0dHBzOi8vZXhlbXBsbw?oc=5'
const FOLHA = 'https://redir.folha.com.br/redir/online/poder/rss091/*https://www1.folha.uol.com.br/poder/x.shtml'
const DIRETA = 'https://www.poder360.com.br/eleicoes/materia-x/'

console.log('\n1. As três formas de chegar na matéria, e nenhuma é impossível')
{
  conferir('invólucro do Google News é resolve-por-rede', classificar(GN) === 'resolve-por-rede')
  conferir('a Folha resolve OFFLINE, pelo asterisco', classificar(FOLHA) === 'resolve-offline')
  conferir('o resto é direta', classificar(DIRETA) === 'direta')
  conferir(
    '⛔ nenhuma classe se chama "opaco": a categoria de inarquivável ACABOU',
    ['resolve-por-rede', 'resolve-offline', 'direta'].every((c) => c !== 'involucro-opaco')
  )
}

console.log('\n2. O custo separa a cota escassa do throughput')
{
  const urls = [GN, GN, FOLHA, DIRETA]
  conferir('archive.org paga 1 por URL, inclusive pelos invólucros', custoArchive(urls) === 4)
  conferir('o Google paga 2 por invólucro, e nada pelo resto', custoGoogle(urls) === 4, String(custoGoogle(urls)))
  conferir('daily sem invólucro não custa nada ao Google', custoGoogle([DIRETA, FOLHA]) === 0)
}

console.log('\n3. 🔴 A INVERSÃO: a ordem é EXPOSIÇÃO, não tamanho')
{
  const antigaPequena = { data: '2026-07-29', urls: [GN, GN] }
  const novaGrande = { data: '2026-09-03', urls: [DIRETA, DIRETA, DIRETA, DIRETA, DIRETA, DIRETA, DIRETA, DIRETA] }
  const r = ranquear([novaGrande, antigaPequena])

  conferir('a ANTIGA vem primeiro, mesmo com 2 URLs contra 8', r[0].data === '2026-07-29', r.map((x) => x.data).join(' '))
  conferir(
    '⛔ pela regra ANTIGA, que contava arquivável e descontava invólucro, ela viria por ÚLTIMO com ZERO',
    antigaPequena.urls.filter((u) => classificar(u) !== 'resolve-por-rede').length === 0
  )
  conferir('e a nova grande continua na fila, atrás', r[1].data === '2026-09-03' && r[1].falta === 8)

  // Empate de data não existe entre dailies, mas o desempate por falta precisa
  // estar certo se um dia duas entrarem com a mesma data.
  const emp = ranquear([
    { data: '2026-08-01', urls: [DIRETA] },
    { data: '2026-08-01', urls: [DIRETA, DIRETA, DIRETA] },
  ])
  conferir('empate de data desempata por quem tem MAIS faltando', emp[0].falta === 3)
}

console.log('\n4. ⚠️ "Rodou" não é "pronto"')
{
  const ledger = lerLedger(
    [
      JSON.stringify({ daily: '2026-09-04', urls: 23, ok: 6, abortou: false }),
      JSON.stringify({ daily: '2026-07-29', urls: 38, ok: 3, abortou: true }),
      JSON.stringify({ daily: '2026-07-29', urls: 38, ok: 4, abortou: false }),
      'linha quebrada que não é JSON',
    ].join('\n')
  )
  conferir('soma as rodadas da MESMA daily, em vez de pegar a última', ledger.get('2026-07-29').ok === 7)
  conferir('conta quantas rodadas houve', ledger.get('2026-07-29').rodadas === 2)
  conferir('e lembra que alguma abortou', ledger.get('2026-07-29').abortou === true)
  conferir('linha quebrada não derruba o resto', ledger.get('2026-09-04').ok === 6)
  conferir('daily sem rodada simplesmente não está no mapa', ledger.get('2026-08-15') === undefined)

  const urls = Array.from({ length: 10 }, () => DIRETA + Math.random())
  const r = ranquear([{ data: '2026-09-04', urls }], ledger)
  conferir('⚠️ a daily que RODOU segue na fila, com 4 faltando de 10', r[0].falta === 4 && r[0].arquivado === 6, JSON.stringify(r[0]))

  // ⭐ Controle: daily inteiramente arquivada SAI da fila.
  const cheio = lerLedger(JSON.stringify({ daily: '2026-08-20', ok: 5 }))
  const r2 = ranquear([{ data: '2026-08-20', urls: [DIRETA, FOLHA, GN, DIRETA + 'a', GN + 'b'] }], cheio)
  conferir('⭐ daily com tudo arquivado fica com falta ZERO', r2[0].falta === 0 && r2[0].arquivado === 5)
  conferir('e ok maior que o total não produz falta negativa', ranquear([{ data: '2026-08-20', urls: [DIRETA] }], cheio)[0].falta === 0)
}

console.log('\n5. A extração de URL da daily')
{
  const md = `texto [A](${DIRETA}) e [B](${GN}) e [C](https://polymarket.com/event/x) e [D](https://www.afos-analytics.com/y) e [A de novo](${DIRETA})`
  const u = urlsDaDaily(md)
  conferir('deduplica a mesma URL citada duas vezes', u.length === 2, JSON.stringify(u))
  conferir('⛔ Polymarket e o próprio site não são matéria a preservar', !u.some((x) => /polymarket|afos-analytics/.test(x)))
  conferir('markdown sem link nenhum devolve lista vazia', urlsDaDaily('só texto').length === 0)
}

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${passes} passaram, ${falhas} falharam.`)
process.exit(falhas === 0 ? 0 : 1)
