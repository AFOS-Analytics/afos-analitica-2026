import { chromium } from 'playwright'
import { writeFileSync } from 'fs'

const SIZE = 800
// LinkedIn aplica crop CIRCULAR no profile picture. Safe-zone = círculo
// inscrito no quadrado. Para texto AF/OS ficar SEM corte, mantemos dentro
// de 70% do raio. Eliminamos padding externo, sombra e bordas arredondadas
// (LinkedIn já arredonda em círculo) — logo passa a OCUPAR 100% do frame.
const html = `<!DOCTYPE html>
<html><head><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: ${SIZE}px; height: ${SIZE}px; }
.logo {
  width: ${SIZE}px; height: ${SIZE}px;
  background: linear-gradient(135deg, #0a3d8f 0%, #0F52BA 50%, #1a6edb 100%);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  font-family: 'Segoe UI', Arial, sans-serif;
  color: white; font-weight: 900;
  letter-spacing: 6px;
}
/* Texto maior — 280px em canvas 800 = 35%. Dentro da safe-zone circular. */
.top, .bot { font-size: 280px; line-height: 1; }
.top { margin-bottom: -30px; }
</style></head>
<body><div class="logo"><div class="top">AF</div><div class="bot">OS</div></div></body></html>`

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: SIZE, height: SIZE }, deviceScaleFactor: 1 })
const page = await ctx.newPage()
await page.setContent(html, { waitUntil: 'load' })
const buf = await page.locator('.logo').screenshot({ type: 'png' })
writeFileSync('public/brand/logo-linkedin-800.png', buf)
await browser.close()
console.log('Saved public/brand/logo-linkedin-800.png — 800×800, edge-to-edge, AF/OS dentro da safe-zone circular.')
