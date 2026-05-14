import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'fs'
import { marked } from 'marked'

const FILES = [
  { in: 'docs/launch-texts/00-manual-dday-pt-br.md',             out: 'docs/launch-texts/00-manual-dday-pt-br.pdf',             title: '00 — MANUAL DDAY [PT-BR]' },
  { in: 'docs/launch-texts/01-x-twitter-en.md',                  out: 'docs/launch-texts/01-x-twitter-en.pdf',                  title: '01 — X / Twitter [EN]' },
  { in: 'docs/launch-texts/02-linkedin-en.md',                   out: 'docs/launch-texts/02-linkedin-en.pdf',                   title: '02 — LinkedIn [EN]' },
  { in: 'docs/launch-texts/03-bluesky-en.md',                    out: 'docs/launch-texts/03-bluesky-en.pdf',                    title: '03 — Bluesky [EN]' },
  { in: 'docs/launch-texts/04-product-hunt-en.md',               out: 'docs/launch-texts/04-product-hunt-en.pdf',               title: '04 — Product Hunt [EN]' },
  { in: 'docs/launch-texts/05-response-templates-pt-br.md',      out: 'docs/launch-texts/05-response-templates-pt-br.pdf',      title: '05 — Response Templates [PT-BR]' },
  { in: 'docs/launch-texts/06-email-tier1-teaser-d1-en-pt-br.md',    out: 'docs/launch-texts/06-email-tier1-teaser-d1-en-pt-br.pdf',    title: '06 — Email Tier 1 TEASER D-1 [EN+PT-BR]' },
  { in: 'docs/launch-texts/07-email-tier1-launch-dday-en-pt-br.md',  out: 'docs/launch-texts/07-email-tier1-launch-dday-en-pt-br.pdf',  title: '07 — Email Tier 1 LAUNCH D-Day [EN+PT-BR]' },
  { in: 'docs/launch-texts/08-email-tier2-h1-d7-en-pt-br.md',        out: 'docs/launch-texts/08-email-tier2-h1-d7-en-pt-br.pdf',        title: '08 — Email Tier 2 H.1 D+7 [EN+PT-BR]' },
  { in: 'docs/launch-texts/09-x-twitter-pt-br.md',               out: 'docs/launch-texts/09-x-twitter-pt-br.pdf',               title: '09 — X / Twitter [PT-BR]' },
  { in: 'docs/launch-texts/10-email-cold-3lines-en-pt-br.md',    out: 'docs/launch-texts/10-email-cold-3lines-en-pt-br.pdf',    title: '10 — Cold Email Template 3 linhas [EN+PT-BR]' },
  { in: 'docs/launch-texts/11-linkedin-pt-br.md',                out: 'docs/launch-texts/11-linkedin-pt-br.pdf',                title: '11 — LinkedIn [PT-BR]' },
  { in: 'docs/launch-texts/12-bluesky-pt-br.md',                 out: 'docs/launch-texts/12-bluesky-pt-br.pdf',                 title: '12 — Bluesky [PT-BR]' },
  { in: 'docs/launch-texts/13-response-templates-en.md',         out: 'docs/launch-texts/13-response-templates-en.pdf',         title: '13 — Response Templates [EN]' },
]

const CSS = `
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', -apple-system, Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 30px; color: #1f2937; line-height: 1.55; font-size: 13px; }
  h1 { color: #0F52BA; border-bottom: 3px solid #0F52BA; padding-bottom: 12px; margin-top: 0; font-size: 26px; }
  h2 { color: #0a3d8f; margin-top: 28px; border-left: 4px solid #0F52BA; padding-left: 12px; font-size: 19px; }
  h3 { color: #0a3d8f; margin-top: 20px; font-size: 16px; }
  blockquote { background: #eff6ff; border-left: 4px solid #0F52BA; padding: 14px 18px; margin: 14px 0; border-radius: 4px; }
  blockquote p { margin: 6px 0; }
  code { background: #f1f5f9; padding: 2px 6px; border-radius: 3px; font-family: 'Consolas', monospace; font-size: 12px; color: #be185d; }
  pre { background: #1e293b; color: #f1f5f9; padding: 16px; border-radius: 6px; overflow-x: auto; font-size: 11.5px; line-height: 1.5; }
  pre code { background: transparent; color: inherit; padding: 0; }
  table { border-collapse: collapse; width: 100%; margin: 14px 0; font-size: 12px; }
  th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
  th { background: #f8fafc; font-weight: 700; color: #0a3d8f; }
  ul, ol { padding-left: 22px; }
  li { margin: 4px 0; }
  hr { border: none; border-top: 1px solid #cbd5e1; margin: 24px 0; }
  a { color: #0F52BA; }
  strong { color: #0a3d8f; }
  .meta { background: #fef3c7; border: 1px solid #f59e0b; padding: 8px 14px; border-radius: 4px; font-size: 11px; color: #92400e; margin-bottom: 18px; }
`

function buildHtml(md, title) {
  const html = marked.parse(md, { gfm: true, breaks: true })
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${title}</title><style>${CSS}</style></head>
<body>
<div class="meta">📄 AFOS Analytics — Launch 14/Mai/2026 — Confidencial (não distribuir publicamente)</div>
${html}
</body></html>`
}

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1200, height: 1600 } })
const page = await ctx.newPage()

for (const f of FILES) {
  const md = readFileSync(f.in, 'utf-8')
  const html = buildHtml(md, f.title)
  await page.setContent(html, { waitUntil: 'load' })
  await page.pdf({
    path: f.out,
    format: 'A4',
    margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
    printBackground: true,
  })
  console.log(`✅ ${f.out}`)
}

await browser.close()
console.log(`\n${FILES.length}/${FILES.length} PDFs gerados.`)
