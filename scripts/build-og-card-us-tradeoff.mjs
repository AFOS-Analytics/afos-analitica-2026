/**
 * Cartão social (OG) de uma edição do AFOS Tradeoff dos ESTADOS UNIDOS.
 *
 * 🔴 POR QUE ESTE ARQUIVO EXISTE: a página da edição serve
 * `/brand/og-en-linkedin-1200x627.png`, que é o cartão genérico da marca.
 * Medido em 06/Set/2026: a edição do BRASIL e a dos EUA da MESMA data serviam
 * esse mesmo arquivo, com `og:title` correto e específico nas duas. É o defeito
 * de feedback_dois_produtos_apontando_para_o_mesmo_cartao_social: a tag certa
 * apontando para o arquivo de todo mundo, que nenhum portão vê porque
 * distinção é propriedade do CONJUNTO e não do arquivo.
 *
 * Espelha `build-og-card-br-tradeoff.mjs`, que resolveu o mesmo no Brasil.
 *
 * 🎨 COR: safira da marca (#0F52BA). A régua manda a COR separar país, e quem
 * separa aqui é a BANDEIRA mais o rótulo "US 2026 MIDTERMS", explícitos em vez
 * de por convenção de tom. A bandeira vem IMPORTADA de `build-og-cards-us.mjs`
 * em vez de copiada: duas cópias do mesmo desenho divergem no dia em que uma
 * é corrigida e a outra não.
 *
 * 🔢 OS NÚMEROS SÃO DE SEMANA FECHADA, e isso é decisão de projeto: cartão
 * anexado a post não pode envelhecer. Nada aqui é leitura viva.
 *
 * 🧩 UM CONTRATO POR CARTÃO. Tudo sai do BINÁRIO DE CONTROLE DO SENADO, os
 * dois lados dele. ⛔ Os 59 leituras e os USD 63.454 da edição somam Câmara
 * MAIS Senado e por isso ficam FORA: misturar dois livros num cartão foi
 * exatamente o defeito corrigido no cartão dos EUA em 22/Ago.
 *
 * ✅ CONFERIDO em 06/Set/2026 no `backup/neon`, fechamentos diários de 31/Ago
 * a 04/Set, com corte de dia em UTC:
 *   - lado republicano: 49,50 nas 29 leituras da semana, amplitude 0,00pp;
 *   - lado democrata: 50,50 → 51,50, +1,00pp cru;
 *   - o par abriu de 100,00% para 101,00% no fechamento de 02/Set e ficou;
 *   - normalizado, 50,50% → 50,99%, ou seja +0,49pp;
 *   - dinheiro novo na perna republicana na semana: USD 23.812.
 *
 * ⛔ É "+0.49pp normalizado", nunca "a metade": 1,00 → 0,49 é 49%, e escrever
 * metade tornaria a arte falsa por arredondamento a favor da manchete.
 *
 * 🔴 O arquivo é ESTÁTICO em /brand/ de propósito: o robots.ts bloqueia
 * `/api/` para todo agente, e o LinkedInBot recusa buscar imagem servida de lá.
 */
import { chromium } from 'playwright'
import { writeFileSync } from 'fs'
import { bandeira } from './build-og-cards-us.mjs'

const W = 1200
const H = 627

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
    <div class="pais">${bandeira(62)}<div class="prod">US 2026 MIDTERMS</div></div>
  </div>
  <div class="body">${body}</div>
  <div class="foot"><div class="url">afos-analytics.com</div><div class="trio">Prediction markets &middot; Polls &middot; Press</div></div>
</div></body></html>`

// ── Tradeoff №7 · a semana de 31 de agosto a 4 de setembro ─────────────────
const cartao = frame(`
  <div class="pill">AFOS TRADEOFF &middot; US &middot; ISSUE No. 7</div>
  <div class="split">
    <div class="left">
      <div class="big">0.00pp</div>
      <div class="sub">how much the Republican Senate<br>contract moved in 29 of 29 readings,<br>across five sessions</div>
    </div>
    <div class="card">
      <div class="n">+0.49pp</div>
      <div class="l">what the Democratic +1.00pp is<br>worth once the pair is normalized</div>
      <div class="s">The pair opened from 100.00% to 101.00% at the September 2 close</div>
    </div>
  </div>
  <div class="thesis">The leg that never ticked took USD 23,812 of new money.<br>The other side's gain went into the sum, not into the counterparty.</div>
  <div class="meta">US Senate control contract &middot; daily closes, August 31 to September 4, 2026</div>`)

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
const page = await ctx.newPage()
const DEST = process.argv[2] || 'public/brand'
await page.setContent(cartao, { waitUntil: 'load' })
const buf = await page.locator('.og').screenshot({ type: 'png' })
writeFileSync(`${DEST}/og-us-tradeoff-7-1200x627.png`, buf)
console.log(`  ${DEST}/og-us-tradeoff-7-1200x627.png  ${(buf.length / 1024).toFixed(0)} KB`)
await browser.close()
