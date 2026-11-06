/**
 * Cartões sociais do Relatório de fechamento Brasil 2026, nos TRÊS idiomas e nos
 * três formatos da casa (mesma moldura do Weekly e do Tradeoff):
 *   1200x627   prévia de link (og:image da página do relatório)
 *   1200x1200  anexo no LinkedIn
 *   1600x900   anexo no X e no Bluesky
 *
 * O relatório ganha cartão PRÓPRIO porque página com og:title específico e a arte
 * genérica da marca é lida no feed como repost de outra peça.
 *
 * Todo número aqui sai do relatório aprovado (versão 1.1, corte 31/10/2026):
 * 186 dias de cobertura e o resultado oficial do 2º turno no TSE. A frase de
 * baixo é o achado 4 do Resumo, nas palavras dele.
 *
 * 🔢 Decimal no formato de cada versão do relatório: vírgula em PT e ES, ponto em EN.
 *
 * 🇺🇸 Desde 06/11/2026 o mesmo script gera os cartões do Relatório de fechamento
 * EUA 2026 (versão 1.0) com `--pais=us`: textos em `TEXTOS_US`, bandeira americana
 * e prefixo `og-relatorio-final-us-2026-`. Sem o parâmetro, segue sendo o Brasil.
 *
 * Uso: node scripts/build-og-card-relatorio-final.mjs [destino] [--pais=us]
 */
import { chromium } from 'playwright'
import { writeFileSync } from 'fs'
import { bandeira as bandeiraBr } from './lib/bandeira-br.mjs'
import { bandeira as bandeiraUs } from './build-og-cards-us.mjs'

const PAIS = process.argv.includes('--pais=us') ? 'us' : 'br'
const bandeira = PAIS === 'us' ? bandeiraUs : bandeiraBr

const TEXTOS = {
  pt: {
    prod: 'BRASIL 2026',
    pill: 'RELATÓRIO FINAL &middot; VERSÃO 1.1',
    big: '186 dias',
    sub: (q) => `de mercado, pesquisas e imprensa${q ? ' ' : '<br>'}registrados lado a lado e comparados${q ? ' ' : '<br>'}com o resultado oficial`,
    cardN: '51,79%',
    cardL: (q) => `Lula reeleito no 2º turno,${q ? ' ' : '<br>'}contra 48,21% de Flávio Bolsonaro`,
    cardS: 'votos válidos, TSE, 100% das seções',
    tese: (q) => `No 2º turno, mercado e pesquisas apontaram para o mesmo lado,${q ? ' ' : '<br>'}e a urna deu o outro.`,
    meta: 'Relatório de fechamento Brasil 2026 &middot; corte 31/10/2026 &middot; Harvard Dataverse',
    trio: 'Mercado de previsão &middot; Pesquisas &middot; Imprensa',
  },
  en: {
    prod: 'BRAZIL 2026',
    pill: 'FINAL REPORT &middot; VERSION 1.1',
    big: '186 days',
    sub: (q) => `of market, polls and press${q ? ' ' : '<br>'}recorded side by side and compared${q ? ' ' : '<br>'}with the official result`,
    cardN: '51.79%',
    cardL: (q) => `Lula re-elected in the runoff,${q ? ' ' : '<br>'}against 48.21% for Flávio Bolsonaro`,
    cardS: 'valid votes, TSE, 100% of sections',
    tese: (q) => `In the runoff, market and polls pointed the same way,${q ? ' ' : '<br>'}and the count went the other.`,
    meta: 'Brazil 2026 Closing Report &middot; cutoff Oct 31, 2026 &middot; Harvard Dataverse',
    trio: 'Prediction markets &middot; Polls &middot; Press',
  },
  es: {
    prod: 'BRASIL 2026',
    pill: 'INFORME FINAL &middot; VERSIÓN 1.1',
    big: '186 días',
    sub: (q) => `de mercado, encuestas y prensa${q ? ' ' : '<br>'}registrados lado a lado y comparados${q ? ' ' : '<br>'}con el resultado oficial`,
    cardN: '51,79%',
    cardL: (q) => `Lula reelecto en la segunda vuelta,${q ? ' ' : '<br>'}frente al 48,21% de Flávio Bolsonaro`,
    cardS: 'votos válidos, TSE, 100% de las secciones',
    tese: (q) => `En la segunda vuelta, mercado y encuestas apuntaron al mismo lado,${q ? ' ' : '<br>'}y las urnas dieron el otro.`,
    meta: 'Informe de cierre Brasil 2026 &middot; corte 31/10/2026 &middot; Harvard Dataverse',
    trio: 'Mercados de predicción &middot; Encuestas &middot; Prensa',
  },
}

// Todo número sai do relatório aprovado em 06/11/2026 (versão 1.0): o preço
// certificado da véspera no Senado e o achado 3 do Resumo, nas palavras dele.
const TEXTOS_US = {
  pt: {
    prod: 'EUA 2026',
    pill: 'RELATÓRIO FINAL &middot; VERSÃO 1.0',
    big: 'Midterms',
    sub: (q) => `mercado, pesquisas e imprensa${q ? ' ' : '<br>'}registrados lado a lado e${q ? ' ' : '<br>'}comparados com o resultado`,
    cardN: '76,50',
    cardL: (q) => `preço dos democratas no Senado${q ? ' ' : '<br>'}na véspera, certificado em 02/11`,
    cardS: 'resolvido em 100 em 04/11',
    tese: (q) => `Mercado e pesquisas apontaram para o mesmo lado,${q ? ' ' : '<br>'}e o resultado foi esse lado.`,
    meta: 'Relatório de fechamento EUA 2026 &middot; versão 1.0, 06/11/2026 &middot; Harvard Dataverse',
    trio: 'Mercado de previsão &middot; Pesquisas &middot; Imprensa',
  },
  en: {
    prod: 'US 2026',
    pill: 'FINAL REPORT &middot; VERSION 1.0',
    big: 'Midterms',
    sub: (q) => `market, polls and press${q ? ' ' : '<br>'}recorded side by side and set${q ? ' ' : '<br>'}next to the result`,
    cardN: '76.50',
    cardL: (q) => `the Senate Democrats price${q ? ' ' : '<br>'}on the eve, certified Nov 2`,
    cardS: 'settled at 100 on Nov 4',
    tese: (q) => `Market and polls pointed the same way,${q ? ' ' : '<br>'}and the result went that way.`,
    meta: 'US 2026 Closing Report &middot; version 1.0, Nov 6, 2026 &middot; Harvard Dataverse',
    trio: 'Prediction markets &middot; Polls &middot; Press',
  },
  es: {
    prod: 'EE. UU. 2026',
    pill: 'INFORME FINAL &middot; VERSIÓN 1.0',
    big: 'Midterms',
    sub: (q) => `mercado, encuestas y prensa${q ? ' ' : '<br>'}registrados lado a lado y puestos${q ? ' ' : '<br>'}junto al resultado`,
    cardN: '76,50',
    cardL: (q) => `precio de los demócratas en el Senado${q ? ' ' : '<br>'}en la víspera, certificado el 02/11`,
    cardS: 'liquidado en 100 el 04/11',
    tese: (q) => `Mercado y encuestas apuntaron al mismo lado,${q ? ' ' : '<br>'}y el resultado fue ese lado.`,
    meta: 'Informe de cierre EE. UU. 2026 &middot; versión 1.0, 06/11/2026 &middot; Harvard Dataverse',
    trio: 'Mercados de predicción &middot; Encuestas &middot; Prensa',
  },
}

const FORMATOS = (l) => [
  { nome: `og-relatorio-final-${PAIS}-2026-${l}-1200x627.png`, W: 1200, H: 627, s: 1.0, quadrado: false },
  { nome: `og-relatorio-final-${PAIS}-2026-${l}-1200x1200.png`, W: 1200, H: 1200, s: 1.18, quadrado: true },
  { nome: `og-relatorio-final-${PAIS}-2026-${l}-1600x900.png`, W: 1600, H: 900, s: 1.34, quadrado: false },
]

const px = (n, s) => `${(n * s).toFixed(1)}px`

function css({ W, H, s, quadrado }) {
  return `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: ${W}px; height: ${H}px; }
.og {
  width: ${W}px; height: ${H}px; position: relative;
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
.flag { border-radius: 3px; box-shadow: 0 0 0 1px rgba(255,255,255,.45); display: block; }
.prod { font-size: ${px(22, s)}; font-weight: 700; letter-spacing: ${px(2.2, s)}; color: #fff; }
.body { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.pill { display: inline-block; align-self: flex-start; font-size: ${px(20, s)}; font-weight: 700;
        letter-spacing: ${px(2.4, s)}; color: #BFDBFE; border: ${px(2, s)} solid rgba(255,255,255,.3);
        border-radius: 999px; padding: ${px(7, s)} ${px(18, s)}; margin-bottom: ${px(16, s)}; }
.big  { font-size: ${px(quadrado ? 150 : 112, s)}; font-weight: 800; letter-spacing: ${px(-4, s)}; line-height: ${quadrado ? 1.14 : 1.06}; }
.sub  { font-size: ${px(27, s)}; font-weight: 600; color: #BFDBFE; line-height: 1.32; margin-top: ${px(10, s)}; }
.split { display: flex; ${quadrado ? 'flex-direction: column;' : ''} gap: ${px(quadrado ? 28 : 40, s)}; align-items: ${quadrado ? 'stretch' : 'flex-start'}; }
.left  { flex: 1; }
.card  { ${quadrado ? 'width: 100%;' : `width: ${px(450, s)};`} background: rgba(255,255,255,.09);
         border: ${px(2, s)} solid rgba(255,255,255,.24);
         border-radius: ${px(16, s)}; padding: ${px(22, s)} ${px(28, s)}; }
.card .n { font-size: ${px(58, s)}; font-weight: 800; color: #93C5FD; line-height: 1; }
.card .l { font-size: ${px(23, s)}; color: #DBEAFE; line-height: 1.32; margin-top: ${px(8, s)}; }
.card .s { font-size: ${px(18, s)}; color: rgba(255,255,255,.6); margin-top: ${px(10, s)}; }
.thesis { font-size: ${px(quadrado ? 32 : 27, s)}; font-weight: 700; line-height: 1.28; margin-top: ${px(quadrado ? 24 : 18, s)}; }
.meta { font-size: ${px(20, s)}; color: rgba(255,255,255,.62); margin-top: ${px(12, s)}; }
.foot { display: flex; justify-content: space-between; align-items: baseline;
        padding-top: ${px(14, s)}; border-top: ${px(2, s)} solid rgba(255,255,255,.22); }
.url  { font-size: ${px(23, s)}; font-weight: 600; color: #93C5FD; }
.trio { font-size: ${px(23, s)}; color: rgba(255,255,255,.62); }
`
}

const html = (f, t) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css(f)}</style></head>
<body><div class="og">
  <div class="head">
    <div class="mark">AFOS ANALYTICS</div>
    <div class="pais">${bandeira(62 * f.s)}<div class="prod">${t.prod}</div></div>
  </div>
  <div class="body">
    <div class="pill">${t.pill}</div>
    <div class="split">
      <div class="left">
        <div class="big">${t.big}</div>
        <div class="sub">${t.sub(f.quadrado)}</div>
      </div>
      <div class="card">
        <div class="n">${t.cardN}</div>
        <div class="l">${t.cardL(f.quadrado)}</div>
        <div class="s">${t.cardS}</div>
      </div>
    </div>
    <div class="thesis">${t.tese(f.quadrado)}</div>
    <div class="meta">${t.meta}</div>
  </div>
  <div class="foot"><div class="url">afos-analytics.com</div><div class="trio">${t.trio}</div></div>
</div></body></html>`

const browser = await chromium.launch()
const DEST = process.argv.slice(2).find((a) => !a.startsWith('--')) || 'public/brand'
let falhou = false
for (const [l, t] of Object.entries(PAIS === 'us' ? TEXTOS_US : TEXTOS)) {
  for (const f of FORMATOS(l)) {
    const ctx = await browser.newContext({ viewport: { width: f.W, height: f.H }, deviceScaleFactor: 1 })
    const page = await ctx.newPage()
    await page.setContent(html(f, t), { waitUntil: 'load' })
    // Conteúdo que transborda a moldura some sem erro; medir antes de gravar.
    const transborda = await page.evaluate(() => {
      const og = document.querySelector('.og')
      return og.scrollHeight > og.clientHeight + 1 || og.scrollWidth > og.clientWidth + 1
    })
    const buf = await page.locator('.og').screenshot({ type: 'png' })
    writeFileSync(`${DEST}/${f.nome}`, buf)
    console.log(`  ${DEST}/${f.nome}  ${(buf.length / 1024).toFixed(0)} KB${transborda ? '  TRANSBORDA' : ''}`)
    if (transborda) falhou = true
    await ctx.close()
  }
}
await browser.close()
if (falhou) process.exit(1)
