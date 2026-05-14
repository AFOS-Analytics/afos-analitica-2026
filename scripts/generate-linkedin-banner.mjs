import { chromium } from 'playwright'
import { writeFileSync } from 'fs'

const W = 1200
const H = 627
const html = `<!DOCTYPE html>
<html><head><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: ${W}px; height: ${H}px; }
.banner {
  width: ${W}px; height: ${H}px;
  background: linear-gradient(135deg, #0a3d8f 0%, #0F52BA 50%, #1a6edb 100%);
  display: flex; align-items: center;
  padding: 60px 80px;
  font-family: 'Segoe UI', Arial, sans-serif;
  color: white;
}
.logo {
  width: 280px; height: 280px;
  border-radius: 62px;
  background: rgba(255,255,255,0.08);
  border: 4px solid rgba(255,255,255,0.18);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  font-weight: 900; letter-spacing: 4px;
  flex-shrink: 0;
}
.logo .top, .logo .bot { font-size: 96px; line-height: 1; }
.logo .top { margin-bottom: -10px; }
.content {
  margin-left: 60px;
  flex: 1;
}
.title {
  font-size: 56px; font-weight: 800;
  line-height: 1.05; margin-bottom: 18px;
  letter-spacing: -0.5px;
}
.tagline {
  font-size: 26px; font-weight: 400;
  line-height: 1.35; opacity: 0.92;
  margin-bottom: 26px;
}
.url {
  font-size: 22px; font-weight: 600;
  opacity: 0.9; letter-spacing: 0.5px;
}
</style></head>
<body>
  <div class="banner">
    <div class="logo"><div class="top">AF</div><div class="bot">OS</div></div>
    <div class="content">
      <div class="title">AFOS Analytics</div>
      <div class="tagline">Prediction Markets &times; Polling Data &times; News Coverage<br/>Open-source &nbsp;|&nbsp; Global by design</div>
      <div class="url">www.afos-analytics.com</div>
    </div>
  </div>
</body></html>`

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
const page = await ctx.newPage()
await page.setContent(html, { waitUntil: 'load' })
const buf = await page.locator('.banner').screenshot({ type: 'png' })
writeFileSync('public/brand/linkedin-banner-1200x627.png', buf)
await browser.close()
console.log('Saved public/brand/linkedin-banner-1200x627.png')
