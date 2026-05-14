import { chromium } from 'playwright'
import { writeFileSync, readFileSync } from 'fs'

const W = 1200
const TARGET_H = 627
const SOURCE_H = 630
const CROP_TOP = Math.floor((SOURCE_H - TARGET_H) / 2) // crop 1px do topo, 2px do fundo (centralizado)

const variants = [
  { src: 'public/brand/og-image-en-1200x630.png', dst: 'public/brand/og-en-linkedin-1200x627.png' },
  { src: 'public/brand/og-image-pt-1200x630.png', dst: 'public/brand/og-pt-linkedin-1200x627.png' },
  { src: 'public/brand/og-image-es-1200x630.png', dst: 'public/brand/og-es-linkedin-1200x627.png' },
]

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: W, height: TARGET_H }, deviceScaleFactor: 1 })
const page = await ctx.newPage()

for (const { src, dst } of variants) {
  const b64 = readFileSync(src).toString('base64')
  const html = `<!DOCTYPE html><html><head><style>
    *{margin:0;padding:0;}
    body{width:${W}px;height:${TARGET_H}px;overflow:hidden;}
    img{display:block;width:${W}px;height:${SOURCE_H}px;margin-top:-${CROP_TOP}px;}
  </style></head><body><img src="data:image/png;base64,${b64}"/></body></html>`
  await page.setContent(html, { waitUntil: 'load' })
  const buf = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: W, height: TARGET_H } })
  writeFileSync(dst, buf)
  console.log(`Saved ${dst}`)
}

await browser.close()
