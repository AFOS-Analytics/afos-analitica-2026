import { chromium } from 'playwright'
import { writeFileSync } from 'fs'

const W = 1200
const H = 627

const COPY = {
  en: {
    title: 'AFOS Analytics',
    subtitle: 'Open-Source Electoral Intelligence',
    chips: ['Prediction market', '17 Institutes', 'Live News', 'Analysis'],
    footer: 'Built and validated during the 2026 electoral cycle across South American countries + 14 countries. Daily analyses.',
  },
  'pt-BR': {
    title: 'AFOS Analytics',
    subtitle: 'Inteligência Eleitoral Open-Source',
    chips: ['Mercado de previsão', '17 Institutos', 'Notícias ao Vivo', 'Análises'],
    footer: 'Construído e validado durante o ciclo eleitoral 2026 em países na América do Sul + 14 países. Análises diárias.',
  },
  es: {
    title: 'AFOS Analytics',
    subtitle: 'Inteligencia Electoral Open-Source',
    chips: ['Mercado de predicción', '17 Institutos', 'Noticias en Vivo', 'Análisis'],
    footer: 'Construido y validado durante el ciclo electoral 2026 en países de América del Sur + 14 países. Análisis diarios.',
  },
}

function buildHtml(locale) {
  const c = COPY[locale]
  return `<!DOCTYPE html>
<html><head><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: ${W}px; height: ${H}px; }
.og {
  width: ${W}px; height: ${H}px;
  background: linear-gradient(135deg, #0F52BA 0%, #0a3d8f 100%);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 60px;
  font-family: 'Segoe UI', Arial, sans-serif;
  color: white;
  position: relative;
}
.title { font-size: 72px; font-weight: 800; letter-spacing: -2px; margin-bottom: 16px; }
.subtitle { font-size: 32px; opacity: 0.92; text-align: center; max-width: 900px; line-height: 1.4; }
.chips { font-size: 24px; opacity: 0.75; margin-top: 24px; display: flex; gap: 24px; }
.footer { font-size: 22px; margin-top: 32px; font-weight: 600; max-width: 1000px; line-height: 1.4; text-align: center; }
.url { position: absolute; bottom: 32px; font-size: 18px; opacity: 0.55; letter-spacing: 0.3px; }
</style></head>
<body><div class="og">
  <div class="title">${c.title}</div>
  <div class="subtitle">${c.subtitle}</div>
  <div class="chips">${c.chips.map(x => `<span>${x}</span>`).join('')}</div>
  <div class="footer">${c.footer}</div>
  <div class="url">afos-analytics.com</div>
</div></body></html>`
}

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
const page = await ctx.newPage()
for (const locale of ['en', 'pt-BR', 'es']) {
  await page.setContent(buildHtml(locale), { waitUntil: 'load' })
  const buf = await page.locator('.og').screenshot({ type: 'png' })
  const suffix = locale === 'pt-BR' ? 'pt' : locale
  const out = `public/brand/linkedin-og-${suffix}-1200x627.png`
  writeFileSync(out, buf)
  console.log(`Saved ${out}`)
}
await browser.close()
