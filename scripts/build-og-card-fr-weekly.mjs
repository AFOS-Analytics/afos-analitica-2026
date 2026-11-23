/**
 * Cartão social da AFOS Weekly da FRANÇA, por edição. Criado 23/Nov/2026, para
 * a Nº 1. Molde: `build-og-card-us-weekly.mjs` (mesmo leiaute, mesmos três
 * formatos, mesma recusa de rodar sem `--edicao`). Sem cartão próprio a edição
 * cai no cartão genérico por idioma, que é o mesmo de outras peças, e quem vê o
 * segundo post acha que é repost do primeiro.
 *
 *   node scripts/build-og-card-fr-weekly.mjs --edicao=1 [destino]
 *
 * ⚖️ França: a lei 2010-476 (art. 57) pune divulgar cotação de site não
 * autorizado "para promovê-lo". O cartão mostra preço como MEDIÇÃO, sem convite,
 * sem endereço de casa de aposta, sempre ao lado do outro livro ou da pesquisa.
 * 🏷️ O rótulo do contrato é declarado por edição (`contrato`), nunca herdado:
 * a Weekly EUA já publicou um cartão com o número de uma casa e a etiqueta da outra.
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'fs'

export const EDICOES = {
  1: {
    contrato: 'Win contract, Polymarket and Kalshi side by side',
    semana: 'week of November 16 to November 23, 2026',
    big: '20.75',
    bigSub: (q) => `David Lisnard on Polymarket, up 4.60,${q ? ' ' : '<br>'}and 20.00 on Kalshi, up 6.00:${q ? ' ' : '<br>'}both his highs since November 8`,
    cardN: '25 of 29',
    cardL: (q) => `first-round poll lists in which${q ? ' ' : '<br>'}Édouard Philippe leads Lisnard`,
    cardS: 'fieldwork ending Oct 9 to Nov 17',
    tese: (q) => `Both markets moved Lisnard up and Philippe down.${q ? ' ' : '<br>'}The polls in our base answer a different question.`,
    // 🌐 23/Nov/2026: cartão por idioma (pedido do André, envio por WhatsApp).
    // Decimal com PONTO nos três, como no corpo da Weekly.
    'pt-BR': {
      contrato: 'Contrato de vitória, Polymarket e Kalshi lado a lado',
      semana: 'semana de 16 a 23 de novembro de 2026',
      big: '20.75',
      bigSub: (q) => `David Lisnard na Polymarket, alta de 4.60,${q ? ' ' : '<br>'}e 20.00 na Kalshi, alta de 6.00:${q ? ' ' : '<br>'}as máximas dele desde 8 de novembro`,
      cardN: '25 de 29',
      cardL: (q) => `listas de 1º turno em que${q ? ' ' : '<br>'}Édouard Philippe está à frente de Lisnard`,
      cardS: 'campo encerrado de 9/out a 17/nov',
      tese: (q) => `Os dois mercados subiram Lisnard e desceram Philippe.${q ? ' ' : '<br>'}As pesquisas da nossa base respondem a outra pergunta.`,
    },
    es: {
      contrato: 'Contrato de victoria, Polymarket y Kalshi lado a lado',
      semana: 'semana del 16 al 23 de noviembre de 2026',
      big: '20.75',
      bigSub: (q) => `David Lisnard en Polymarket, sube 4.60,${q ? ' ' : '<br>'}y 20.00 en Kalshi, sube 6.00:${q ? ' ' : '<br>'}sus máximos desde el 8 de noviembre`,
      cardN: '25 de 29',
      cardL: (q) => `listas de primera vuelta en las que${q ? ' ' : '<br>'}Édouard Philippe va por delante de Lisnard`,
      cardS: 'campo terminado del 9/oct al 17/nov',
      tese: (q) => `Los dos mercados subieron a Lisnard y bajaron a Philippe.${q ? ' ' : '<br>'}Las encuestas de nuestra base responden a otra pregunta.`,
    },
  },
}

/** Rótulos fixos da arte, por idioma. */
const UI = {
  en: { pill: (n) => `AFOS WEEKLY &middot; FRANCE &middot; ISSUE No. ${n}`, prod: 'FRANCE 2027 PRESIDENTIAL', trio: 'Prediction markets &middot; Polls &middot; Press', sufixo: '' },
  'pt-BR': { pill: (n) => `AFOS WEEKLY &middot; FRANÇA &middot; EDIÇÃO Nº ${n}`, prod: 'PRESIDENCIAL FRANÇA 2027', trio: 'Mercados de previsão &middot; Pesquisas &middot; Imprensa', sufixo: '-pt' },
  es: { pill: (n) => `AFOS WEEKLY &middot; FRANCIA &middot; EDICIÓN Nº ${n}`, prod: 'PRESIDENCIAL FRANCIA 2027', trio: 'Mercados de predicción &middot; Encuestas &middot; Prensa', sufixo: '-es' },
}

const formatos = (n, suf) => [
  { nome: `og-fr-weekly-${n}${suf}-1200x627.png`, W: 1200, H: 627, s: 1.0, quadrado: false },
  { nome: `og-fr-weekly-${n}${suf}-1200x1200.png`, W: 1200, H: 1200, s: 1.18, quadrado: true },
  { nome: `og-fr-weekly-${n}${suf}-1600x900.png`, W: 1600, H: 900, s: 1.34, quadrado: false },
]

const px = (n, s) => `${(n * s).toFixed(1)}px`
const BANDEIRA = `data:image/svg+xml;base64,${Buffer.from(readFileSync('public/flags/fr.svg')).toString('base64')}`

function css({ W, H, s, quadrado }) {
  return `
body { width: ${W}px; height: ${H}px; margin: 0; }
.og {
  width: ${W}px; height: ${H}px; position: relative; box-sizing: border-box;
  background: linear-gradient(135deg, #0F52BA 0%, #072B63 100%);
  font-family: "Segoe UI", Arial, sans-serif; color: #fff;
  padding: ${px(42, s)} ${px(72, s)} ${px(32, s)} ${px(72, s)};
  display: flex; flex-direction: column;
}
.og::before { content: ""; position: absolute; left: 0; top: 0; width: ${px(10, s)}; height: 100%; background: #93C5FD; }
.head { display: flex; justify-content: space-between; align-items: center;
        padding-bottom: ${px(16, s)}; border-bottom: ${px(2, s)} solid rgba(255,255,255,.22); }
.mark { font-size: ${px(23, s)}; font-weight: 700; letter-spacing: ${px(4.2, s)}; color: #BFDBFE; }
.pais { display: flex; align-items: center; gap: ${px(14, s)}; }
.flag { border-radius: 3px; box-shadow: 0 0 0 1px rgba(255,255,255,.45); display: block; width: ${px(62, s)}; height: ${px(41.3, s)}; }
.prod { font-size: ${px(22, s)}; font-weight: 700; letter-spacing: ${px(2.2, s)}; color: #fff; }
.body { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.pill { display: inline-block; align-self: flex-start; font-size: ${px(20, s)}; font-weight: 700;
        letter-spacing: ${px(2.4, s)}; color: #BFDBFE; border: ${px(2, s)} solid rgba(255,255,255,.3);
        border-radius: 999px; padding: ${px(7, s)} ${px(18, s)}; margin-bottom: ${px(16, s)}; }
.big  { font-size: ${px(quadrado ? 150 : 118, s)}; font-weight: 800; letter-spacing: ${px(-4, s)}; line-height: ${quadrado ? 1.14 : 1.04}; }
.sub  { font-size: ${px(27, s)}; font-weight: 600; color: #BFDBFE; line-height: 1.32; margin-top: ${px(12, s)}; }
.foot { display: flex; justify-content: space-between; align-items: baseline;
        padding-top: ${px(14, s)}; border-top: ${px(2, s)} solid rgba(255,255,255,.22); }
.url  { font-size: ${px(23, s)}; font-weight: 600; color: #93C5FD; }
.trio { font-size: ${px(23, s)}; color: rgba(255,255,255,.62); }
.meta { font-size: ${px(22, s)}; color: rgba(255,255,255,.62); margin-top: ${px(16, s)}; }
.split { display: flex; ${quadrado ? 'flex-direction: column;' : ''} gap: ${px(quadrado ? 28 : 40, s)}; align-items: ${quadrado ? 'stretch' : 'flex-start'}; }
.left  { flex: 1; }
.card  { ${quadrado ? 'width: 100%;' : `width: ${px(430, s)};`} box-sizing: border-box; background: rgba(255,255,255,.09);
         border: ${px(2, s)} solid rgba(255,255,255,.24);
         border-radius: ${px(16, s)}; padding: ${px(22, s)} ${px(28, s)}; }
.card .n { font-size: ${px(58, s)}; font-weight: 800; color: #93C5FD; line-height: 1.05; }
.card .l { font-size: ${px(24, s)}; color: #DBEAFE; line-height: 1.32; margin-top: ${px(8, s)}; }
.card .s { font-size: ${px(19, s)}; color: rgba(255,255,255,.6); margin-top: ${px(10, s)}; }
.thesis { font-size: ${px(quadrado ? 32 : 29, s)}; font-weight: 700; line-height: 1.28; margin-top: ${px(quadrado ? 24 : 20, s)}; }
`
}

const corpo = (quadrado, n, e, u) => `
  <div class="pill">${u.pill(n)}</div>
  <div class="split">
    <div class="left">
      <div class="big">${e.big}</div>
      <div class="sub">${e.bigSub(quadrado)}</div>
    </div>
    <div class="card">
      <div class="n">${e.cardN}</div>
      <div class="l">${e.cardL(quadrado)}</div>
      <div class="s">${e.cardS}</div>
    </div>
  </div>
  <div class="thesis">${e.tese(quadrado)}</div>
  <div class="meta">${e.contrato} &middot; ${e.semana}</div>`

const html = (f, n, e, u) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css(f)}</style></head>
<body><div class="og">
  <div class="head">
    <div class="mark">AFOS ANALYTICS</div>
    <div class="pais"><img class="flag" src="${BANDEIRA}" alt=""><div class="prod">${u.prod}</div></div>
  </div>
  <div class="body">${corpo(f.quadrado, n, e, u)}</div>
  <div class="foot"><div class="url">afos-analytics.com</div><div class="trio">${u.trio}</div></div>
</div></body></html>`

const N = process.argv.find((a) => a.startsWith('--edicao='))?.split('=')[1]
if (!N || !EDICOES[N]) {
  console.error(`Falta --edicao=N com N em {${Object.keys(EDICOES).join(', ')}}.`)
  process.exit(1)
}
const E = EDICOES[N]
if (!E.contrato) {
  console.error(`Edicao ${N} nao declara "contrato": o rodape diz DE QUE o numero grande e.`)
  process.exit(1)
}

const browser = await chromium.launch()
const DEST = process.argv.slice(2).find((a) => !a.startsWith('--')) || 'public/brand'
console.log(`AFOS Weekly FR, edicao no ${N} - ${E.semana}`)
// O inglês é a raiz do objeto da edição; pt-BR e ES, quando declarados, saem com sufixo.
for (const idioma of ['en', 'pt-BR', 'es'].filter((i) => i === 'en' || E[i])) {
  const e = idioma === 'en' ? E : E[idioma]
  if (!e.contrato) { console.error(`Edicao ${N} (${idioma}) nao declara "contrato".`); process.exitCode = 1; continue }
  const u = UI[idioma]
for (const f of formatos(N, u.sufixo)) {
  const ctx = await browser.newContext({ viewport: { width: f.W, height: f.H }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  await page.setContent(html(f, N, e, u), { waitUntil: 'load' })
  // O cartão não pode transbordar: rodapé fora da arte some sem erro nenhum.
  const transborda = await page.evaluate(() => { const o = document.querySelector('.og'); return o.scrollHeight > o.clientHeight + 1 })
  if (transborda) { console.error(`  ⛔ ${f.nome}: o conteúdo passa da altura do cartão (o rodapé some). Encurtar o texto.`); process.exitCode = 1 }
  const buf = await page.locator('.og').screenshot({ type: 'png' })
  writeFileSync(`${DEST}/${f.nome}`, buf)
  console.log(`  ${DEST}/${f.nome}  ${f.W}x${f.H}  ${(buf.length / 1024).toFixed(0)} KB${transborda ? '  ⛔ TRANSBORDA' : ''}`)
  await ctx.close()
}
}
await browser.close()
