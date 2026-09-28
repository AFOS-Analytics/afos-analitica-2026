#!/usr/bin/env node
/**
 * NÚMEROS DO POST · midterms EUA 2026
 *
 * 🔑 POR QUE EXISTE: post agendado é número que envelhece. Entre escrever o
 *    rascunho e apertar publicar passam horas, e o Polymarket é arbitrado em
 *    minutos. Este script remede, em UM comando, exatamente os números que o
 *    post carrega, para conferir antes de publicar.
 *
 *   node scripts/numeros-do-post-usa.mjs
 *
 * ⛔ Ele NÃO publica nada e NÃO grava nada. Só lê e imprime.
 *
 * 📐 A conta do limiar, e ela é o assunto do post: o controle da Câmara se
 *    decide em 218 cadeiras, e 218 cai DENTRO da faixa "215 a 219" que o
 *    contrato de distribuição usa. Distribuição com o limiar no INTERIOR de um
 *    balde não soma o desfecho, só o CERCA: o piso são as faixas inteiramente
 *    acima, o teto é o piso mais a faixa ambígua.
 *
 * ⚠️ Distribuição só se publica se as faixas somarem entre 95% e 105%. Se o
 *    portão reprovar, o script diz NÃO PUBLICAR e o post não sai com esse número.
 */
const BASE = process.env.AFOS_BASE || 'https://www.afos-analytics.com'
const arr = (v) => {
  if (Array.isArray(v)) return v
  if (typeof v === 'string' && v.trim()) { try { const p = JSON.parse(v); return Array.isArray(p) ? p : [] } catch { return [] } }
  return []
}
const pct = (g) => (g?.markets || []).map((m) => {
  const p = arr(m.outcomePrices)
  return p.length ? { q: String(m.question || m.groupItemTitle || ''), v: Number(p[0]) * 100 } : null
}).filter(Boolean)

const r = await fetch(`${BASE}/api/polymarket?country=us&fresh=1`, { signal: AbortSignal.timeout(60000) })
if (!r.ok) { console.error(`\n⚠️ NÃO LEU: HTTP ${r.status}. A medição não aconteceu.`); process.exit(4) }
const d = await r.json()

const hs = pct(d.houseSeats)
if (!hs.length) { console.error('\n⚠️ NÃO LEU: zero faixa com preço na distribuição da Câmara.'); process.exit(4) }

const soma = hs.reduce((a, b) => a + b.v, 0)
const acima = hs.filter((x) => /between 220|between 225|230 or more/i.test(x.q)).reduce((a, b) => a + b.v, 0)
const amb = hs.find((x) => /between 215 and 219/i.test(x.q))
if (!amb) { console.error('\n⚠️ NÃO LEU: a faixa 215-219 sumiu do livro. A conta do limiar depende dela.'); process.exit(4) }

const bh = pct(d.house)
const R = bh.find((x) => /Republican/i.test(x.q))?.v
const D = bh.find((x) => /Democratic/i.test(x.q))?.v
if (R == null || D == null) { console.error('\n⚠️ NÃO LEU: binário da Câmara sem preço.'); process.exit(4) }

const cruLo = acima, cruHi = acima + amb.v
const nrmLo = 100 * cruLo / soma, nrmHi = 100 * cruHi / soma
const passa = soma >= 95 && soma <= 105
const f = (x) => x.toFixed(2).replace('.', ',')

console.log(`\n📐 NÚMEROS DO POST · midterms EUA 2026`)
console.log(`   carimbo da leitura: ${d.fetchedAt}   (fresh=1, country=us)`)
console.log(`\n   CÂMARA · distribuição de cadeiras republicanas`)
console.log(`     soma das faixas          ${f(soma)}%   portão 95 a 105: ${passa ? '✅ PASSA' : '❌ REPROVA'}`)
console.log(`     faixas acima de 219      ${f(acima)}%   (controle republicano CERTO)`)
console.log(`     faixa 215 a 219          ${f(amb.v)}%   (218 cai DENTRO dela)`)
console.log(`\n   O intervalo que a distribuição CERCA:`)
console.log(`     cru                      ${f(cruLo)}%  a  ${f(cruHi)}%`)
console.log(`     normalizado por ${f(soma)}   ${f(nrmLo)}%  a  ${f(nrmHi)}%`)
console.log(`\n   CÂMARA · binário, que responde com UM número`)
console.log(`     Democratas ${f(D)}%   Republicanos ${f(R)}%   soma do par ${f(D + R)}%`)
const dentroCru = R >= cruLo && R <= cruHi
const dentroNrm = R >= nrmLo && R <= nrmHi
console.log(`\n   🔑 O binário cai dentro do intervalo?   cru: ${dentroCru ? 'SIM' : 'NÃO'}   ·   normalizado: ${dentroNrm ? 'SIM' : 'NÃO'}`)

console.log(`\n────────────────────────────────────────────────────────`)
// ---- o TERCEIRO instrumento: a media do generic ballot ----
// Ela NAO se subtrai do mercado, porque as unidades sao diferentes. Entra no
// post como instrumento paralelo, e o que se publica dela e o NIVEL com
// procedencia, nunca a variacao: numa janela movel de 30 dias o nivel anda
// quando uma rodada velha SAI, e isso e composicao de janela, nao eleitorado.
let pesquisa = null
try {
  const rp = await fetch(BASE + '/us-polls-data.json', { signal: AbortSignal.timeout(45000) })
  if (rp.ok) {
    const a = await rp.json()
    const inc = (a && a.mediaAfos && a.mediaAfos.incluidas) || []
    const campos = inc.map((x) => x.campoFim).filter(Boolean).sort()
    pesquisa = {
      media: a && a.mediaAfos ? a.mediaAfos.vantagemDem : null,
      rodadas: inc.length,
      institutos: a && a.mediaAfos ? a.mediaAfos.nInstitutos : null,
      de: campos[0], ate: campos[campos.length - 1],
      lastUpdate: a ? a.lastUpdate : null,
    }
  }
} catch { /* fica null, e o veredito avisa */ }

console.log('')
console.log('   PESQUISA . media do generic ballot, o instrumento que NAO responde a pergunta')
if (!pesquisa || pesquisa.media == null) {
  console.log('     AVISO: NAO LEU a media publicada. O post cita esse numero: conferir a mao.')
} else {
  console.log('     D+' + String(pesquisa.media).replace('.', ',') + '  sobre ' + pesquisa.rodadas + ' rodadas de ' + pesquisa.institutos + ' institutos')
  console.log('     campo de ' + pesquisa.de + ' a ' + pesquisa.ate + '  .  janela movel de 30 dias  .  arquivo de ' + pesquisa.lastUpdate)
  console.log('     PUBLICAR o NIVEL com esta procedencia. NAO publicar VARIACAO da semana:')
  console.log('     a media sobe sozinha quando rodada velha sai da janela, e isso e composicao.')
}
console.log('')
console.log('--------------------------------------------------------')

if (!passa) {
  console.log(`⛔ VEREDITO: NÃO PUBLICAR o número da distribuição.`)
  console.log(`   As faixas somam ${f(soma)}%, fora do portão de 95 a 105.`)
  process.exit(1)
}
if (!dentroCru || !dentroNrm) {
  console.log(`🟡 VEREDITO: PUBLICÁVEL, mas o TEXTO MUDA.`)
  console.log(`   O binário deixou de cair dentro do intervalo, e o post diz que cai.`)
  console.log(`   Reescrever a frase do fecho antes de publicar.`)
  process.exit(1)
}
console.log(`✅ VEREDITO: os números do post CONFEREM.`)
console.log(`   Trocar no texto: ${f(cruLo)}% e ${f(cruHi)}% (cru), ${f(nrmLo)}% e ${f(nrmHi)}% (normalizado),`)
console.log(`   soma ${f(soma)}%, e binário republicano ${f(R)}%.`)
