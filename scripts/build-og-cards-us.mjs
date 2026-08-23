/**
 * Cartões sociais (OG) dos DOIS produtos dos Estados Unidos.
 *
 * 🔴 POR QUE ESTE ARQUIVO EXISTE: o Weekly (`getOgImageUrl`) e o painel
 * (`socialMeta`) apontavam para o MESMO `/brand/og-en-linkedin-1200x627.png`.
 * Dois posts no mesmo dia mostravam o cartão idêntico no feed.
 *
 * 🎨 COR: safira da marca (#0F52BA), decisão do André em 22/Ago/2026.
 * A régua de feedback_cor_separa_pais_nao_produto manda a COR separar país, e
 * aqui quem separa o país é a BANDEIRA mais o rótulo "US 2026 MIDTERMS", que
 * dizem isso de forma explícita em vez de por convenção de tom. Com o país
 * declarado, a cor volta a ser a da casa. O que separa um cartão do outro é o
 * NÚMERO e a estrutura, nunca a paleta.
 *
 * 🏷️ A manchete e 86,50%, que e `R <= 52`, ou seja PERDER AO MENOS UMA.
 * Medido em 5 leituras: esse numero NAO se moveu uma vez, enquanto o
 * complemento dele (`53 OU MAIS`) oscilou 0,20pp e a soma das faixas junto.
 * 🔴 Faixa fina NAO vai para manchete de cartao: ela deriva sozinha e o
 * cartao fica desencontrado do painel em minutos. A trava de captura exclui
 * distribuicao exatamente por isso.
 *
 * 🧩 UM CONTRATO POR CARTAO. A versao anterior punha a manchete tirada do
 * mercado de CADEIRAS e a barra tirada do binario de CONTROLE, que sao livros
 * diferentes. Como a tese do texto e que os dois DISCORDAM, o cartao entregava
 * a resposta de um deles como se fosse a resposta. Agora tudo sai do mercado
 * de cadeiras, e a barra mostra a fatia do EMPATE, que e o achado.
 *
 * ⚠️ O cartão do PAINEL carrega preço vivo e por isso leva CARIMBO de data.
 * Quando o preço andar, regerar e trocar a data, senão o cartão vira
 * afirmação falsa sobre o mercado de hoje.
 *
 * 🔴 O arquivo é ESTÁTICO em /brand/ de propósito: o robots.ts bloqueia
 * `/api/` para todo agente, e o LinkedInBot recusa buscar imagem servida de
 * lá. Ver o comentário em lib/afos-daily/schema.ts:203.
 */
import { chromium } from 'playwright'
import { writeFileSync } from 'fs'

const W = 1200
const H = 627

/** Estrela de 5 pontas, usada nas 50 da união. */
function estrela(cx, cy, r) {
  const p = []
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    const d = i % 2 === 0 ? r : r * 0.382
    p.push(`${(cx + d * Math.cos(a)).toFixed(2)},${(cy + d * Math.sin(a)).toFixed(2)}`)
  }
  return `<polygon points="${p.join(' ')}" fill="#FFFFFF"/>`
}

/**
 * Bandeira dos EUA desenhada em SVG: 13 listras e as 50 estrelas de verdade,
 * em 9 fileiras alternando 6 e 5. Desenhada e não baixada porque cartão OG não
 * pode depender de imagem externa: o LinkedInBot busca só o arquivo declarado.
 */
function bandeira(w) {
  const h = w / 1.9
  const faixa = h / 13
  const uh = faixa * 7
  const uw = w * 0.4
  let s = ''
  for (let i = 0; i < 13; i++) {
    s += `<rect x="0" y="${i * faixa}" width="${w}" height="${faixa}" fill="${i % 2 === 0 ? '#B22234' : '#FFFFFF'}"/>`
  }
  s += `<rect x="0" y="0" width="${uw}" height="${uh}" fill="#3C3B6E"/>`
  const r = Math.min(uw / 12, uh / 10) * 0.46
  for (let linha = 0; linha < 9; linha++) {
    for (let col = 0; col < 11; col++) {
      if ((linha + col) % 2 !== 0) continue
      s += estrela((uw * (col + 1)) / 12, (uh * (linha + 1)) / 10, r)
    }
  }
  return `<svg class="flag" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${s}</svg>`
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
        border-radius: 999px; padding: 6px 17px; margin-bottom: 12px; }
.big  { font-size: 104px; font-weight: 800; letter-spacing: -4px; line-height: 1; }
.sub  { font-size: 29px; font-weight: 600; color: #BFDBFE; line-height: 1.30; margin-top: 10px; }
.foot { display: flex; justify-content: space-between; align-items: baseline;
        padding-top: 14px; border-top: 2px solid rgba(255,255,255,.22); }
.url  { font-size: 23px; font-weight: 600; color: #93C5FD; }
.trio { font-size: 23px; color: rgba(255,255,255,.62); }
.meta { font-size: 21px; color: rgba(255,255,255,.62); margin-top: 12px; }
.split { display: flex; gap: 40px; align-items: flex-start; }
.left  { flex: 1; }
.card  { width: 420px; background: rgba(255,255,255,.09); border: 2px solid rgba(255,255,255,.24);
         border-radius: 16px; padding: 22px 28px; }
.card .n { font-size: 58px; font-weight: 800; color: #93C5FD; line-height: 1; }
.card .l { font-size: 25px; color: #DBEAFE; line-height: 1.32; margin-top: 8px; }
.card .s { font-size: 19px; color: rgba(255,255,255,.6); margin-top: 10px; }
.thesis { font-size: 34px; font-weight: 700; line-height: 1.28; margin-top: 26px; }
.bar { display: flex; gap: 6px; margin-top: 8px; }
.bar div { height: 46px; border-radius: 7px; display: flex; align-items: center;
           font-size: 24px; font-weight: 700; letter-spacing: .6px; }
.bar .d { background: #BFDBFE; color: #0A3573; justify-content: flex-start; padding-left: 20px; }
.bar .r { background: rgba(255,255,255,.10); border: 2px solid rgba(255,255,255,.34); color: #fff;
          justify-content: flex-end; padding-right: 20px; }
.line { font-size: 29px; font-weight: 700; line-height: 1.24; margin-top: 16px; }
.barcap { font-size: 19px; color: rgba(255,255,255,.6); margin-top: 14px; letter-spacing: .4px; }
.bar .t { background: rgba(255,255,255,.30); color: #062B63; justify-content: center; font-size: 20px; }
`

const frame = (body) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${BASE}</style></head>
<body><div class="og">
  <div class="head">
    <div class="mark">AFOS ANALYTICS</div>
    <div class="pais">${bandeira(60)}<div class="prod">US 2026 MIDTERMS</div></div>
  </div>
  <div class="body">${body}</div>
  <div class="foot"><div class="url">afos-analytics.com</div><div class="trio">Prediction markets &middot; Polls &middot; Press</div></div>
</div></body></html>`

// ── A · o caso do Wisconsin, que fecha o Weekly No. 3 ───────────────────────
const cartaoA = frame(`
  <div class="pill">AFOS WEEKLY &middot; ISSUE No. 3</div>
  <div class="split">
    <div class="left">
      <div class="big">95.8%</div>
      <div class="sub">the price the market paid<br>the day before, on the<br>candidate who lost</div>
    </div>
    <div class="card">
      <div class="n">34%</div>
      <div class="l">undecided in the very poll<br>the market was following</div>
      <div class="s">Marquette Law School, n=407, &plusmn;6.6pp</div>
    </div>
  </div>
  <div class="thesis">The market did not inherit the poll&rsquo;s error.<br>It inherited its average and discarded its uncertainty.</div>
  <div class="meta">Wisconsin Democratic primary for governor &middot; settled August 11, 2026</div>`)

// ── B · o Senado, no painel dos EUA ────────────────────────────────────────
const cartaoB = frame(`
  <div class="pill">UNITED STATES PANEL</div>
  <div class="big">86.50%</div>
  <div class="sub">what the market pays on Republicans losing at least one<br>of the 53 Senate seats they hold today</div>
  <div class="line">And one in eight scenarios ends 50 to 50,<br>with the Vice President breaking it</div>
  <div class="barcap">how the seat market splits the majority</div>
  <div class="bar">
    <div class="d" style="flex:53.00">DEMOCRATS 53.00%</div>
    <div class="t" style="flex:12.50">TIE 12.50%</div>
    <div class="r" style="flex:35.45">REPUBLICANS 35.45%</div>
  </div>
  <div class="meta">Seat market, bands sum to 100.95% &middot; confirmed August 23, 2026</div>`)

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
const page = await ctx.newPage()
const DEST = process.argv[2] || 'public/brand'
for (const [nome, html] of [
  ['og-us-weekly-wisconsin-1200x627.png', cartaoA],
  ['og-us-senate-panel-1200x627.png', cartaoB],
]) {
  await page.setContent(html, { waitUntil: 'load' })
  const buf = await page.locator('.og').screenshot({ type: 'png' })
  writeFileSync(`${DEST}/${nome}`, buf)
  console.log(`  ${DEST}/${nome}  ${(buf.length / 1024).toFixed(0)} KB`)
}
await browser.close()
