/**
 * Cartões sociais de uma edição do AFOS Tradeoff do BRASIL, em inglês, em TRÊS formatos.
 *
 * 🔴 POR QUE ESTE ARQUIVO EXISTE: a página da edição serve
 * `/brand/og-en-linkedin-1200x627.png`, que é o cartão genérico da marca. A
 * prévia automática de um post sobre a №15 saía sem número nenhum. Espelha
 * `build-og-card-us-tradeoff.mjs`, que resolveu o mesmo problema nos EUA.
 *
 * 📐 TRÊS FORMATOS desde a №17 (13/Set/2026), pela mesma razão medida do cartão
 * dos EUA: 1200x627 é a prévia de link (`og`), 1200x1200 é o ANEXO do LinkedIn,
 * conferido no FEED de borda a borda, e 1600x900 é o anexo do X e do Bluesky.
 * O quadrado REFLUI em vez de esticar. Até a №15 este script só gerava o 1200x627.
 *
 * 🎨 COR: safira da marca (#0F52BA). Quem separa o país é a BANDEIRA mais o
 * rótulo "BRAZIL 2026", explícitos.
 *
 * 🔢 OS NÚMEROS SÃO DE SEMANA FECHADA: cartão anexado a post não pode envelhecer.
 *
 * ✅ CONFERIDO EM 13/Set/2026 no `backup/neon`, fechamentos com corte de dia em
 * UTC, de segunda a sexta, que é a borda que a №17 publicada usa:
 *   - vão Flávio menos Lula: -18.60 no fechamento de 07/Set, +6.70 no de 11/Set;
 *     deslocamento de 25.30pp, o MAIOR das semanas completas desde 14/Abr, e o
 *     segundo é 18.00pp em 11-15/Mai (de +2.00 para -16.00);
 *   - 576 capturas pareadas de Flávio e Lula na série;
 *   - contrato de 2º lugar do 1º turno: Flávio 88.50 → 75.50 (-13.00pp),
 *     Lula 8.40 → 23.40 (+15.00pp).
 *
 * ⛔ É "since the series began on April 14", nunca "ever" nem "of the cycle".
 *
 * 🔴 Os arquivos são ESTÁTICOS em /brand/ de propósito: o robots.ts bloqueia
 * `/api/` para todo agente, e o LinkedInBot recusa buscar imagem servida de lá.
 *
 * Uso: node scripts/build-og-card-br-tradeoff.mjs [destino]
 */
import { chromium } from 'playwright'
import { writeFileSync } from 'fs'

const EDICAO = 17

/** Os três formatos. `quadrado` liga o refluxo vertical. */
const FORMATOS = [
  { nome: `og-br-tradeoff-${EDICAO}-1200x627.png`, W: 1200, H: 627, s: 1.0, quadrado: false },
  { nome: `og-br-tradeoff-${EDICAO}-1200x1200.png`, W: 1200, H: 1200, s: 1.18, quadrado: true },
  { nome: `og-br-tradeoff-${EDICAO}-1600x900.png`, W: 1600, H: 900, s: 1.34, quadrado: false },
]

/**
 * Bandeira do Brasil em SVG: campo verde, losango amarelo, globo azul e a
 * faixa branca em arco. Desenhada e não baixada porque cartão OG não pode
 * depender de imagem externa. As estrelas viram pontos brancos: em 62px de
 * largura, desenhar as 27 de verdade vira sujeira em vez de detalhe.
 */
function bandeira(w) {
  const h = w * 0.7
  const cx = w / 2, cy = h / 2
  const r = w * 0.175
  const estrelas = [[-0.45, -0.30], [0.28, -0.42], [0.50, 0.10], [-0.20, 0.46], [0.05, -0.05], [-0.62, 0.18], [0.62, -0.15]]
    .map(([dx, dy]) => `<circle cx="${(cx + dx * r).toFixed(2)}" cy="${(cy + dy * r).toFixed(2)}" r="${(r * 0.075).toFixed(2)}" fill="#FFFFFF"/>`)
    .join('')
  return `<svg class="flag" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs><clipPath id="globo"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>
    <rect x="0" y="0" width="${w}" height="${h}" fill="#009B3A"/>
    <polygon points="${w * 0.05},${cy} ${cx},${h * 0.07} ${w * 0.95},${cy} ${cx},${h * 0.93}" fill="#FEDF00"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#002776"/>
    <g clip-path="url(#globo)">${estrelas}
      <circle cx="${cx}" cy="${cy + r * 1.35}" r="${r * 1.5}" fill="none" stroke="#FFFFFF" stroke-width="${r * 0.26}"/>
    </g>
  </svg>`
}

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
/* line-height 1 corta o descendente do p em "pp"; medido na arte do cartão dos EUA. */
.big  { font-size: ${px(quadrado ? 150 : 118, s)}; font-weight: 800; letter-spacing: ${px(-4, s)}; line-height: ${quadrado ? 1.14 : 1.04}; }
.sub  { font-size: ${px(27, s)}; font-weight: 600; color: #BFDBFE; line-height: 1.32; margin-top: ${px(12, s)}; }
.foot { display: flex; justify-content: space-between; align-items: baseline;
        padding-top: ${px(14, s)}; border-top: ${px(2, s)} solid rgba(255,255,255,.22); }
.url  { font-size: ${px(23, s)}; font-weight: 600; color: #93C5FD; }
.trio { font-size: ${px(23, s)}; color: rgba(255,255,255,.62); }
.meta { font-size: ${px(22, s)}; color: rgba(255,255,255,.62); margin-top: ${px(16, s)}; }
.split { display: flex; ${quadrado ? 'flex-direction: column;' : ''} gap: ${px(quadrado ? 28 : 40, s)}; align-items: ${quadrado ? 'stretch' : 'flex-start'}; }
.left  { flex: 1; }
.card  { ${quadrado ? 'width: 100%;' : `width: ${px(430, s)};`} background: rgba(255,255,255,.09);
         border: ${px(2, s)} solid rgba(255,255,255,.24);
         border-radius: ${px(16, s)}; padding: ${px(22, s)} ${px(28, s)}; }
.card .n { font-size: ${px(58, s)}; font-weight: 800; color: #93C5FD; line-height: 1; }
.card .l { font-size: ${px(24, s)}; color: #DBEAFE; line-height: 1.32; margin-top: ${px(8, s)}; }
.card .s { font-size: ${px(19, s)}; color: rgba(255,255,255,.6); margin-top: ${px(10, s)}; }
.thesis { font-size: ${px(30, s)}; font-weight: 700; line-height: 1.28; margin-top: ${px(24, s)}; }
`
}

// ── Tradeoff №17 · a semana de 07 a 11 de setembro ─────────────────────────
/** 🔑 No quadrado o texto respira, então as quebras manuais somem. */
const quebra = (quadrado) => (quadrado ? ' ' : '<br>')
const corpo = (quadrado) => `
  <div class="pill">AFOS TRADEOFF &middot; BRAZIL &middot; ISSUE No. ${EDICAO}</div>
  <div class="split">
    <div class="left">
      <div class="big">25.30pp</div>
      <div class="sub">how far the gap between Lula and${quebra(quadrado)}Flávio Bolsonaro moved in five sessions,${quebra(quadrado)}from Lula +18.60 to Flávio +6.70</div>
    </div>
    <div class="card">
      <div class="n">+15.00pp</div>
      <div class="l">Lula's probability of finishing${quebra(quadrado)}SECOND in round one,${quadrado ? '<br>' : ' '}while${quebra(quadrado)}Flávio's fell 13.00pp</div>
      <div class="s">A separate contract, moving in mirror</div>
    </div>
  </div>
  <div class="thesis">The largest weekly move since the series began on April 14.<br>A second, independent book confirmed it.</div>
  <div class="meta">Brazilian presidential contract &middot; daily closes, September 7 to 11, 2026</div>`

const html = (f) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css(f)}</style></head>
<body><div class="og">
  <div class="head">
    <div class="mark">AFOS ANALYTICS</div>
    <div class="pais">${bandeira(62 * f.s)}<div class="prod">BRAZIL 2026</div></div>
  </div>
  <div class="body">${corpo(f.quadrado)}</div>
  <div class="foot"><div class="url">afos-analytics.com</div><div class="trio">Prediction markets &middot; Polls &middot; Press</div></div>
</div></body></html>`

const browser = await chromium.launch()
const DEST = process.argv[2] || 'public/brand'
for (const f of FORMATOS) {
  const ctx = await browser.newContext({ viewport: { width: f.W, height: f.H }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  await page.setContent(html(f), { waitUntil: 'load' })
  // Conteúdo que transborda a moldura some sem erro; medir antes de gravar.
  const transborda = await page.evaluate(() => {
    const og = document.querySelector('.og')
    return og.scrollHeight > og.clientHeight + 1 || og.scrollWidth > og.clientWidth + 1
  })
  const buf = await page.locator('.og').screenshot({ type: 'png' })
  writeFileSync(`${DEST}/${f.nome}`, buf)
  console.log(`  ${DEST}/${f.nome}  ${(buf.length / 1024).toFixed(0)} KB${transborda ? '  ⚠️ TRANSBORDA' : ''}`)
  await ctx.close()
}
await browser.close()
