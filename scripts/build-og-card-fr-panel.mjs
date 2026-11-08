/**
 * Cartão social (OG) do PAINEL DA FRANÇA, nos 3 idiomas. Criado 08/Nov/2026.
 *
 * 🧊 CARTÃO PERMANENTE, SEM NÚMERO (decisão do André, 08/Nov/2026). A primeira
 * versão trazia o preço de Le Pen lido na hora, com carimbo. Saiu por duas razões:
 *  1. o link do painel é PERMANENTE e circula por semanas; número em cartão
 *     envelhece no dia seguinte;
 *  2. WhatsApp, LinkedIn e X guardam a imagem do primeiro compartilhamento de
 *     cada link e não buscam de novo, então nenhuma atualização chega a quem já
 *     recebeu o link.
 * Número vai no cartão das EDIÇÕES (Weekly, Tradeoff), que têm endereço próprio
 * e para as quais o número daquele dia é o certo para sempre.
 *
 * ⛔ Não pôr aqui nada que mude: preço, contagem de pesquisas, número de
 * veículos. As datas dos turnos podem (fixadas por decreto).
 *
 * Moldura dos EUA (safira da casa, bandeira e país escritos). Regerar só quando
 * o TEXTO mudar: node scripts/build-og-card-fr-panel.mjs [pasta]   (padrão public/brand)
 * Gera og-fr-panel-{en,pt,es}-1200x627.png.
 */
import { chromium } from 'playwright'
import { writeFileSync } from 'fs'

const W = 1200
const H = 627

/** Tricolor desenhada em SVG: o LinkedInBot só busca o arquivo declarado, nada externo. */
function bandeira(w) {
  const h = (w * 2) / 3
  const t = w / 3
  return `<svg class="flag" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${t}" height="${h}" fill="#002395"/>
    <rect x="${t}" y="0" width="${t}" height="${h}" fill="#FFFFFF"/>
    <rect x="${2 * t}" y="0" width="${t}" height="${h}" fill="#ED2939"/>
  </svg>`
}

const T = {
  en: {
    prod: 'FRANCE 2027 · PRESIDENTIAL', pill: 'LIVE PANEL',
    titulo: 'Two prediction markets,<br>the polls and the press,<br>side by side',
    itens: ['Polymarket and Kalshi, never averaged', 'Polls checked against the official notice', 'French press from a fixed list of outlets'],
    datas: 'First round April 18 &middot; runoff May 2, 2027',
    trio: 'Prediction markets &middot; Polls &middot; Press',
  },
  pt: {
    prod: 'FRANÇA 2027 · PRESIDENCIAL', pill: 'PAINEL AO VIVO',
    titulo: 'Dois mercados de previsão,<br>as pesquisas e a imprensa,<br>lado a lado',
    itens: ['Polymarket e Kalshi, nunca em média', 'Pesquisas conferidas na ficha oficial', 'Imprensa francesa de lista fixa'],
    datas: '1º turno em 18 de abril &middot; 2º turno em 2 de maio de 2027',
    trio: 'Mercados de previsão &middot; Pesquisas &middot; Imprensa',
  },
  es: {
    prod: 'FRANCIA 2027 · PRESIDENCIAL', pill: 'PANEL EN VIVO',
    titulo: 'Dos mercados de predicción,<br>las encuestas y la prensa,<br>lado a lado',
    itens: ['Polymarket y Kalshi, nunca promediados', 'Encuestas cotejadas con la ficha oficial', 'Prensa francesa de lista fija'],
    datas: '1ª vuelta el 18 de abril &middot; 2ª vuelta el 2 de mayo de 2027',
    trio: 'Mercados de predicción &middot; Encuestas &middot; Prensa',
  },
}

const CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: ${W}px; height: ${H}px; }
.og { width: ${W}px; height: ${H}px; position: relative;
  background: linear-gradient(135deg, #0F52BA 0%, #072B63 100%);
  font-family: "Segoe UI", Arial, sans-serif; color: #fff;
  padding: 42px 72px 32px 72px; display: flex; flex-direction: column; }
.og::before { content: ""; position: absolute; left: 0; top: 0; width: 10px; height: 100%; background: #93C5FD; }
.head { display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 2px solid rgba(255,255,255,.22); }
.mark { font-size: 23px; font-weight: 700; letter-spacing: 4.2px; color: #BFDBFE; }
.pais { display: flex; align-items: center; gap: 14px; }
.flag { border-radius: 3px; box-shadow: 0 0 0 1px rgba(255,255,255,.45); display: block; }
.prod { font-size: 22px; font-weight: 700; letter-spacing: 2.2px; }
.body { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.pill { display: inline-block; align-self: flex-start; font-size: 20px; font-weight: 700; letter-spacing: 2.4px; color: #BFDBFE;
        border: 2px solid rgba(255,255,255,.3); border-radius: 999px; padding: 7px 18px; margin-bottom: 20px; }
.titulo { font-size: 52px; font-weight: 800; line-height: 1.12; letter-spacing: -1px; }
.itens { margin-top: 22px; display: flex; flex-direction: column; gap: 6px; }
.itens div { font-size: 25px; font-weight: 600; color: #BFDBFE; }
.itens div span { color: #93C5FD; margin-right: 12px; font-size: 18px; vertical-align: 3px; }
.datas { font-size: 22px; color: rgba(255,255,255,.7); margin-top: 18px; }
.foot { display: flex; justify-content: space-between; align-items: baseline; padding-top: 14px; border-top: 2px solid rgba(255,255,255,.22); }
.url { font-size: 23px; font-weight: 600; color: #93C5FD; }
.trio { font-size: 23px; color: rgba(255,255,255,.62); }
`

function html(l) {
  const t = T[l]
  return `<!DOCTYPE html><html lang="${l}"><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="og">
  <div class="head"><div class="mark">AFOS ANALYTICS</div><div class="pais">${bandeira(60)}<div class="prod">${t.prod}</div></div></div>
  <div class="body">
    <div class="pill">${t.pill}</div>
    <div class="titulo">${t.titulo}</div>
    <div class="itens">${t.itens.map((i) => `<div><span>&#9679;</span>${i}</div>`).join('')}</div>
    <div class="datas">${t.datas}</div>
  </div>
  <div class="foot"><div class="url">afos-analytics.com</div><div class="trio">${t.trio}</div></div>
</div></body></html>`
}

const browser = await chromium.launch()
const page = await (await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })).newPage()
const DEST = process.argv[2] || 'public/brand'
for (const l of ['en', 'pt', 'es']) {
  await page.setContent(html(l), { waitUntil: 'load' })
  const buf = await page.locator('.og').screenshot({ type: 'png' })
  writeFileSync(`${DEST}/og-fr-panel-${l}-1200x627.png`, buf)
  console.log(`  ${DEST}/og-fr-panel-${l}-1200x627.png  ${(buf.length / 1024).toFixed(0)} KB`)
}
await browser.close()
