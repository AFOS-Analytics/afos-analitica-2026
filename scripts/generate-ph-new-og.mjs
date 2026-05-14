import { chromium } from 'playwright'
import { writeFileSync } from 'fs'

const W = 1200
const H = 627
const OUT = 'public/brand/og-PH-new-1200x627.png'

// Safe zone: LinkedIn "Em destaque" card crops ~15% from each side.
// All content stays within the inner 800px centered band.
const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: ${W}px; height: ${H}px; font-family: 'Segoe UI', Arial, sans-serif; }
.card {
  width: ${W}px; height: ${H}px;
  background:
    radial-gradient(circle at 18% 28%, rgba(255,107,53,0.18) 0%, transparent 38%),
    radial-gradient(circle at 82% 78%, rgba(15,82,186,0.30) 0%, transparent 42%),
    linear-gradient(160deg, #0a1628 0%, #0d2244 60%, #0a1628 100%);
  background-color: #0a1628;
  position: relative;
  display: flex; align-items: center; justify-content: center;
  color: white;
  overflow: hidden;
}
.dots {
  position: absolute; inset: 0;
  background-image: radial-gradient(rgba(255,255,255,0.06) 1.2px, transparent 1.2px);
  background-size: 28px 28px;
  pointer-events: none;
}
.inner {
  width: 820px;
  display: flex; flex-direction: column; align-items: center;
  text-align: center;
  z-index: 2;
}
.row-top { display: flex; align-items: center; gap: 18px; margin-bottom: 36px; }
.logo {
  width: 80px; height: 80px;
  border-radius: 18px;
  background: linear-gradient(135deg, #0F52BA 0%, #1a6edb 100%);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  font-weight: 900; letter-spacing: 1.5px; color: white;
  box-shadow: 0 6px 20px rgba(15,82,186,0.4);
}
.logo .t, .logo .b { font-size: 26px; line-height: 1; }
.logo .t { margin-bottom: -3px; }
.brand-text { display: flex; flex-direction: column; align-items: flex-start; }
.brand-name { font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
.brand-sub { font-size: 13px; opacity: 0.65; letter-spacing: 1.4px; text-transform: uppercase; margin-top: 4px; }

.headline {
  font-size: 60px; font-weight: 800;
  line-height: 1.05; letter-spacing: -1.5px;
  background: linear-gradient(90deg, #ffffff 0%, #cfe0ff 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
}
.tagline {
  font-size: 22px; font-weight: 400;
  opacity: 0.78; margin-top: 18px; line-height: 1.4;
  max-width: 720px;
}
.chips { display: flex; gap: 12px; margin-top: 32px; }
.chip {
  padding: 9px 18px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 100px;
  font-size: 14px; font-weight: 500;
  letter-spacing: 0.3px;
}
.cta {
  font-size: 15px; font-weight: 600;
  color: #ff6b35;
  letter-spacing: 0.8px;
  margin-top: 24px;
}
</style></head>
<body>
<div class="card">
  <div class="dots"></div>
  <div class="inner">
    <div class="row-top">
      <div class="logo"><div class="t">AF</div><div class="b">OS</div></div>
      <div class="brand-text">
        <div class="brand-name">AFOS Analytics</div>
        <div class="brand-sub">Open by design</div>
      </div>
    </div>
    <div class="headline">Civic intelligence,<br/>open to everyone.</div>
    <div class="tagline">Prediction markets, polling data and verified news, cross-referenced in real time across the Americas.</div>
    <div class="chips">
      <div class="chip">Prediction Markets</div>
      <div class="chip">Polling Data</div>
      <div class="chip">Verified News</div>
    </div>
    <div class="cta">→ afos-analytics.com</div>
  </div>
</div>
</body></html>`

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
const page = await ctx.newPage()
await page.setContent(html, { waitUntil: 'load' })
const buf = await page.locator('.card').screenshot({ type: 'png' })
writeFileSync(OUT, buf)
console.log(`Saved ${OUT}`)
await browser.close()
