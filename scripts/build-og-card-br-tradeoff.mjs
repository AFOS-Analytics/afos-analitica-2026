/**
 * Cartão social (OG) de uma edição do AFOS Tradeoff do BRASIL, em inglês.
 *
 * 🔴 POR QUE ESTE ARQUIVO EXISTE: a página da edição serve
 * `/brand/og-en-linkedin-1200x627.png`, que é o cartão genérico da marca. A
 * prévia automática de um post sobre a №15 saía sem número nenhum, e o vão
 * estava registrado como conhecido desde 30/Ago sem nunca ter sido fechado.
 * Espelha `build-og-cards-us.mjs`, que resolveu o mesmo problema nos EUA.
 *
 * 🎨 COR: safira da marca (#0F52BA). A régua manda a COR separar país, e aqui
 * quem separa é a BANDEIRA mais o rótulo "BRAZIL 2026", explícitos em vez de
 * por convenção de tom. Mesma decisão do cartão dos EUA em 22/Ago/2026.
 *
 * 🔢 OS NÚMEROS SÃO DE SEMANA FECHADA, e isso é decisão de projeto: cartão
 * anexado a post não pode envelhecer. O vão VIVO fica de fora, porque ele se
 * move sozinho e transformaria a arte em afirmação falsa em horas.
 *
 * ✅ CONFERIDO EM 05/Set/2026 no `backup/neon` JÁ EXPURGADO do dia 28/Abr,
 * com corte de dia em UTC, que é o que a edição publicada usa:
 *   - fechamentos 29,60 · 27,30 · 26,90 · 23,00 · 19,90, sem uma reversão;
 *   - compressão de 9,70pp, a maior da série que começa em 20/Abr, e a
 *     seguinte é 3,80pp em 17-21/Ago;
 *   - líder −5,00pp (62,50 para 57,50), segundo +4,70pp (32,90 para 37,60).
 *
 * ⛔ É "maior COMPRESSÃO", nunca "maior movimento", e a diferença é medida:
 * a semana de 11 a 15/Mai ALARGOU 14,00pp, de −2,00 para 16,00, atravessando
 * o sinal. Em movimento absoluto ela é maior que esta. Trocar a palavra
 * tornaria a arte falsa.
 *
 * 🔴 O arquivo é ESTÁTICO em /brand/ de propósito: o robots.ts bloqueia
 * `/api/` para todo agente, e o LinkedInBot recusa buscar imagem servida
 * de lá. Mesma razão do cartão dos EUA.
 */
import { chromium } from 'playwright'
import { writeFileSync } from 'fs'

const W = 1200
const H = 627

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

const BASE = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: ${W}px; height: ${H}px; }
.og {
  width: ${W}px; height: ${H}px; position: relative;
  background: linear-gradient(135deg, #0F52BA 0%, #072B63 100%);
  font-family: "Segoe UI", Arial, sans-serif; color: #fff;
  padding: 42px 72px 32px 72px; display: flex; flex-direction: column;
}
.og::before { content: ""; position: absolute; left: 0; top: 0; width: 10px; height: 100%; background: #93C5FD; }
.head { display: flex; justify-content: space-between; align-items: center;
        padding-bottom: 16px; border-bottom: 2px solid rgba(255,255,255,.22); }
.mark { font-size: 23px; font-weight: 700; letter-spacing: 4.2px; color: #BFDBFE; }
.pais { display: flex; align-items: center; gap: 14px; }
.flag { border-radius: 3px; box-shadow: 0 0 0 1px rgba(255,255,255,.45); display: block; }
.prod { font-size: 22px; font-weight: 700; letter-spacing: 2.2px; color: #fff; }
.body { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.pill { display: inline-block; align-self: flex-start; font-size: 20px; font-weight: 700;
        letter-spacing: 2.4px; color: #BFDBFE; border: 2px solid rgba(255,255,255,.3);
        border-radius: 999px; padding: 7px 18px; margin-bottom: 16px; }
.big  { font-size: 118px; font-weight: 800; letter-spacing: -4px; line-height: 1; }
.sub  { font-size: 29px; font-weight: 600; color: #BFDBFE; line-height: 1.32; margin-top: 12px; }
.foot { display: flex; justify-content: space-between; align-items: baseline;
        padding-top: 14px; border-top: 2px solid rgba(255,255,255,.22); }
.url  { font-size: 23px; font-weight: 600; color: #93C5FD; }
.trio { font-size: 23px; color: rgba(255,255,255,.62); }
.meta { font-size: 22px; color: rgba(255,255,255,.62); margin-top: 16px; }
.split { display: flex; gap: 40px; align-items: flex-start; }
.left  { flex: 1; }
.card  { width: 430px; background: rgba(255,255,255,.09); border: 2px solid rgba(255,255,255,.24);
         border-radius: 16px; padding: 22px 28px; }
.card .n { font-size: 58px; font-weight: 800; color: #93C5FD; line-height: 1; }
.card .l { font-size: 24px; color: #DBEAFE; line-height: 1.32; margin-top: 8px; }
.card .s { font-size: 19px; color: rgba(255,255,255,.6); margin-top: 10px; }
.thesis { font-size: 32px; font-weight: 700; line-height: 1.28; margin-top: 24px; }
`

const frame = (body) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${BASE}</style></head>
<body><div class="og">
  <div class="head">
    <div class="mark">AFOS ANALYTICS</div>
    <div class="pais">${bandeira(62)}<div class="prod">BRAZIL 2026</div></div>
  </div>
  <div class="body">${body}</div>
  <div class="foot"><div class="url">afos-analytics.com</div><div class="trio">Prediction markets &middot; Polls &middot; Press</div></div>
</div></body></html>`

// ── Tradeoff №15 · a semana de 24 a 28 de agosto ───────────────────────────
const cartao = frame(`
  <div class="pill">AFOS TRADEOFF &middot; ISSUE No. 15</div>
  <div class="split">
    <div class="left">
      <div class="big">9.70pp</div>
      <div class="sub">how much the presidential gap<br>closed in five sessions, the largest<br>weekly compression of the series</div>
    </div>
    <div class="card">
      <div class="n">10.00pp</div>
      <div class="l">between two national polls of the<br>same runoff, published on the<br>same day</div>
      <div class="s">Gerp 47&ndash;42 &middot; Indexa/Broadcast 46&ndash;41</div>
    </div>
  </div>
  <div class="thesis">The gap closed on all five sessions without one reversal.<br>The declared ballot could not agree on who leads.</div>
  <div class="meta">Brazilian presidential contract &middot; daily closes, August 24 to 28, 2026</div>`)

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
const page = await ctx.newPage()
const DEST = process.argv[2] || 'public/brand'
await page.setContent(cartao, { waitUntil: 'load' })
const buf = await page.locator('.og').screenshot({ type: 'png' })
writeFileSync(`${DEST}/og-br-tradeoff-15-1200x627.png`, buf)
console.log(`  ${DEST}/og-br-tradeoff-15-1200x627.png  ${(buf.length / 1024).toFixed(0)} KB`)
await browser.close()
