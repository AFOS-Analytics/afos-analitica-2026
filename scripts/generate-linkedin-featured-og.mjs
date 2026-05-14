import { chromium } from 'playwright'
import { writeFileSync } from 'fs'

const W = 1200
const H = 627
const OUT = 'public/brand/og-featured-linkedin-1200x627.png'

const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${W}px; height: ${H}px;
    display: flex; align-items: center; justify-content: center;
    background: #ffffff;
    font-family: 'Segoe UI', Arial, sans-serif;
  }
  .wrap { display: flex; align-items: center; gap: 48px; }
  .icon {
    width: 220px; height: 220px;
    border-radius: 48px;
    background: linear-gradient(135deg, #0a3d8f 0%, #0F52BA 50%, #1a6edb 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    color: white; font-weight: 900; letter-spacing: 2px;
    box-shadow: 0 8px 32px rgba(15, 82, 186, 0.28);
    flex-shrink: 0;
  }
  .icon .t { font-size: 76px; line-height: 1; margin-bottom: -6px; }
  .icon .b { font-size: 76px; line-height: 1; }
  .text { display: flex; flex-direction: column; }
  .name {
    font-size: 96px; font-weight: 800; color: #0F52BA;
    letter-spacing: -2px; line-height: 1;
  }
  .tagline {
    font-size: 30px; color: #0F52BA; opacity: 0.75;
    margin-top: 14px; letter-spacing: 0.5px; font-weight: 500;
  }
</style></head>
<body>
  <div class="wrap">
    <div class="icon"><div class="t">AF</div><div class="b">OS</div></div>
    <div class="text">
      <div class="name">AFOS Analytics</div>
      <div class="tagline">Global Political Risk Intelligence</div>
    </div>
  </div>
</body></html>`

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
const page = await ctx.newPage()
await page.setContent(html, { waitUntil: 'load' })
const buf = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: W, height: H } })
writeFileSync(OUT, buf)
console.log(`Saved ${OUT}`)
await browser.close()
