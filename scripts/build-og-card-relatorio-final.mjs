/**
 * Cartões sociais do Relatório de fechamento Brasil 2026, nos TRÊS idiomas e nos
 * três formatos da casa (mesma moldura do Weekly e do Tradeoff):
 *   1200x627   prévia de link (og:image da página do relatório)
 *   1200x1200  anexo no LinkedIn
 *   1600x900   anexo no X e no Bluesky
 *
 * O relatório ganha cartão PRÓPRIO porque página com og:title específico e a arte
 * genérica da marca é lida no feed como repost de outra peça.
 *
 * Todo número aqui sai do relatório aprovado (versão 1.1, corte 31/10/2026):
 * 186 dias de cobertura e o resultado oficial do 2º turno no TSE. A frase de
 * baixo é o achado 4 do Resumo, nas palavras dele.
 *
 * 🔢 Decimal no formato de cada versão do relatório: vírgula em PT e ES, ponto em EN.
 *
 * 🇺🇸 Desde 06/11/2026 o mesmo script gera os cartões do Relatório de fechamento
 * EUA 2026 (versão 1.0) com `--pais=us`: textos em `TEXTOS_US`, bandeira americana
 * e prefixo `og-relatorio-final-us-2026-`. Sem o parâmetro, segue sendo o Brasil.
 *
 * Uso: node scripts/build-og-card-relatorio-final.mjs [destino] [--pais=us]
 */
import { chromium } from 'playwright'
import { writeFileSync } from 'fs'
import { bandeira as bandeiraBr } from './lib/bandeira-br.mjs'
import { bandeira as bandeiraUs } from './build-og-cards-us.mjs'

const PAIS = process.argv.includes('--pais=us') ? 'us' : 'br'
const bandeira = PAIS === 'us' ? bandeiraUs : bandeiraBr
// A bandeira dos EUA saiu maior a pedido do André (06/Nov/2026); a do Brasil fica como estava.
const LARGURA_BANDEIRA = PAIS === 'us' ? 104 : 62
// Nos EUA a linha pequena do cartão carrega as cadeiras projetadas, e foi aumentada a pedido
// do André (06/Nov/2026): maior e mais clara. No Brasil fica como estava.
const LINHA_S = PAIS === 'us' ? { tam: 23, cor: 'rgba(255,255,255,.88)', peso: 600, lh: '1.35' } : { tam: 18, cor: 'rgba(255,255,255,.6)', peso: 400, lh: 'normal' }

const TEXTOS = {
  pt: {
    prod: 'BRASIL 2026',
    pill: 'RELATÓRIO FINAL &middot; VERSÃO 1.1',
    big: '186 dias',
    sub: (q) => `de mercado, pesquisas e imprensa${q ? ' ' : '<br>'}registrados lado a lado e comparados${q ? ' ' : '<br>'}com o resultado oficial`,
    cardN: '51,79%',
    cardL: (q) => `Lula reeleito no 2º turno,${q ? ' ' : '<br>'}contra 48,21% de Flávio Bolsonaro`,
    cardS: 'votos válidos, TSE, 100% das seções',
    tese: (q) => `No 2º turno, mercado e pesquisas apontaram para o mesmo lado,${q ? ' ' : '<br>'}e a urna deu o outro.`,
    meta: 'Relatório de fechamento Brasil 2026 &middot; corte 31/10/2026 &middot; Harvard Dataverse',
    trio: 'Mercado de previsão &middot; Pesquisas &middot; Imprensa',
  },
  en: {
    prod: 'BRAZIL 2026',
    pill: 'FINAL REPORT &middot; VERSION 1.1',
    big: '186 days',
    sub: (q) => `of market, polls and press${q ? ' ' : '<br>'}recorded side by side and compared${q ? ' ' : '<br>'}with the official result`,
    cardN: '51.79%',
    cardL: (q) => `Lula re-elected in the runoff,${q ? ' ' : '<br>'}against 48.21% for Flávio Bolsonaro`,
    cardS: 'valid votes, TSE, 100% of sections',
    tese: (q) => `In the runoff, market and polls pointed the same way,${q ? ' ' : '<br>'}and the count went the other.`,
    meta: 'Brazil 2026 Closing Report &middot; cutoff Oct 31, 2026 &middot; Harvard Dataverse',
    trio: 'Prediction markets &middot; Polls &middot; Press',
  },
  es: {
    prod: 'BRASIL 2026',
    pill: 'INFORME FINAL &middot; VERSIÓN 1.1',
    big: '186 días',
    sub: (q) => `de mercado, encuestas y prensa${q ? ' ' : '<br>'}registrados lado a lado y comparados${q ? ' ' : '<br>'}con el resultado oficial`,
    cardN: '51,79%',
    cardL: (q) => `Lula reelecto en la segunda vuelta,${q ? ' ' : '<br>'}frente al 48,21% de Flávio Bolsonaro`,
    cardS: 'votos válidos, TSE, 100% de las secciones',
    tese: (q) => `En la segunda vuelta, mercado y encuestas apuntaron al mismo lado,${q ? ' ' : '<br>'}y las urnas dieron el otro.`,
    meta: 'Informe de cierre Brasil 2026 &middot; corte 31/10/2026 &middot; Harvard Dataverse',
    trio: 'Mercados de predicción &middot; Encuestas &middot; Prensa',
  },
}

// Todo número sai do relatório aprovado em 06/11/2026 (versão 1.0): o preço
// certificado da véspera no Senado e o achado 3 do Resumo, nas palavras dele.
const TEXTOS_US = {
  pt: {
    prod: 'EUA 2026',
    placar: { senado: 'Senado', camara: 'Câmara', maioria: 'maioria', nota: 'projeção NBC, 06/11; 2 e 23 cadeiras em aberto', vespera: 'Na véspera, o <b>Polymarket</b> pagava <strong>76,50</strong> nos democratas no Senado e <strong>94,50</strong> na Câmara' },
    pill: 'RELATÓRIO FINAL &middot; VERSÃO 1.0',
    big: 'Midterms',
    sub: (q) => `mercado, pesquisas e imprensa${q ? ' ' : '<br>'}registrados lado a lado e${q ? ' ' : '<br>'}comparados com o resultado`,
    cardN: '76,50',
    cardL: (q) => `preço dos democratas no Senado${q ? ' ' : '<br>'}na véspera, certificado em 02/11`,
    cardS: (q) => q ? 'Senado 54 D × 44 R · Câmara 250 D × 162 R<br><span class="nota">cadeiras projetadas pela NBC em 06/11</span>' : 'Senado 54 D × 44 R<br>Câmara 250 D × 162 R<br><span class="nota">projeção NBC, 06/11</span>',
    tese: (q) => `Mercado e pesquisas apontaram para o mesmo lado,${q ? ' ' : '<br>'}e o resultado foi esse lado.`,
    meta: 'Relatório de fechamento EUA 2026 &middot; versão 1.0, 06/11/2026 &middot; Harvard Dataverse',
    trio: 'Mercado de previsão &middot; Pesquisas &middot; Imprensa',
  },
  en: {
    prod: 'US 2026',
    placar: { senado: 'Senate', camara: 'House', maioria: 'majority', nota: 'NBC projection, Nov 6; 2 and 23 seats uncalled', vespera: 'On the eve, <b>Polymarket</b> paid <strong>76.50</strong> on Democrats in the Senate and <strong>94.50</strong> in the House' },
    pill: 'FINAL REPORT &middot; VERSION 1.0',
    big: 'Midterms',
    sub: (q) => `market, polls and press${q ? ' ' : '<br>'}recorded side by side and set${q ? ' ' : '<br>'}next to the result`,
    cardN: '76.50',
    cardL: (q) => `the Senate Democrats price${q ? ' ' : '<br>'}on the eve, certified Nov 2`,
    cardS: (q) => q ? 'Senate 54 D × 44 R · House 250 D × 162 R<br><span class="nota">seats projected by NBC, Nov 6</span>' : 'Senate 54 D × 44 R<br>House 250 D × 162 R<br><span class="nota">NBC projection, Nov 6</span>',
    tese: (q) => `Market and polls pointed the same way,${q ? ' ' : '<br>'}and the result went that way.`,
    meta: 'US 2026 Closing Report &middot; version 1.0, Nov 6, 2026 &middot; Harvard Dataverse',
    trio: 'Prediction markets &middot; Polls &middot; Press',
  },
  es: {
    prod: 'EE. UU. 2026',
    placar: { senado: 'Senado', camara: 'Cámara', maioria: 'mayoría', nota: 'proyección NBC, 06/11; 2 y 23 escaños sin definir', vespera: 'En la víspera, <b>Polymarket</b> pagaba <strong>76,50</strong> por los demócratas en el Senado y <strong>94,50</strong> en la Cámara' },
    pill: 'INFORME FINAL &middot; VERSIÓN 1.0',
    big: 'Midterms',
    sub: (q) => `mercado, encuestas y prensa${q ? ' ' : '<br>'}registrados lado a lado y puestos${q ? ' ' : '<br>'}junto al resultado`,
    cardN: '76,50',
    cardL: (q) => q ? 'precio de los demócratas en el Senado en la víspera, certificado el 02/11' : 'precio demócrata en el Senado<br>en la víspera, certificado el 02/11',
    cardS: (q) => q ? 'Senado 54 D × 44 R · Cámara 250 D × 162 R<br><span class="nota">escaños proyectados por NBC el 06/11</span>' : 'Senado 54 D × 44 R<br>Cámara 250 D × 162 R<br><span class="nota">proyección NBC, 06/11</span>',
    tese: (q) => `Mercado y encuestas apuntaron al mismo lado,${q ? ' ' : '<br>'}y el resultado fue ese lado.`,
    meta: 'Informe de cierre EE. UU. 2026 &middot; versión 1.0, 06/11/2026 &middot; Harvard Dataverse',
    trio: 'Mercados de predicción &middot; Encuestas &middot; Prensa',
  },
}

const FORMATOS = (l) => [
  { nome: `og-relatorio-final-${PAIS}-2026-${l}-1200x627.png`, W: 1200, H: 627, s: 1.0, quadrado: false },
  { nome: `og-relatorio-final-${PAIS}-2026-${l}-1200x1200.png`, W: 1200, H: 1200, s: 1.18, quadrado: true },
  { nome: `og-relatorio-final-${PAIS}-2026-${l}-1600x900.png`, W: 1600, H: 900, s: 1.34, quadrado: false },
]

const px = (n, s) => `${(n * s).toFixed(1)}px`

function css({ W, H, s, quadrado }, comPlacar = false) {
  return `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: ${W}px; height: ${H}px; }
.og {
  width: ${W}px; height: ${H}px; position: relative;
  background: linear-gradient(135deg, #0F52BA 0%, #072B63 100%);
  font-family: "Segoe UI", Arial, sans-serif; color: #fff;
  padding: ${px(42, s)} ${px(72, s)} ${px(32, s)} ${px(72, s)};
  display: flex; flex-direction: column;
}
.og::before { content: ""; position: absolute; left: 0; top: 0; width: ${px(10, s)}; height: 100%; background: #93C5FD; }
.head { display: flex; justify-content: space-between; align-items: center;
        padding-bottom: ${px(16, s)}; border-bottom: ${px(2, s)} solid rgba(255,255,255,.22); }
.mark { font-size: ${px(23, s)}; font-weight: 700; letter-spacing: ${px(4.2, s)}; color: #BFDBFE; }
.pais { display: flex; align-items: center; gap: ${px(14, s)}; }
.flag { border-radius: 3px; box-shadow: 0 0 0 1px rgba(255,255,255,.45); display: block; }
.prod { font-size: ${px(22, s)}; font-weight: 700; letter-spacing: ${px(2.2, s)}; color: #fff; }
.body { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.pill { display: inline-block; align-self: flex-start; font-size: ${px(20, s)}; font-weight: 700;
        letter-spacing: ${px(2.4, s)}; color: #BFDBFE; border: ${px(2, s)} solid rgba(255,255,255,.3);
        border-radius: 999px; padding: ${px(7, s)} ${px(18, s)}; margin-bottom: ${px(16, s)}; }
.big  { font-size: ${px(quadrado ? (comPlacar ? 112 : 150) : (comPlacar ? 100 : 112), s)}; font-weight: 800; letter-spacing: ${px(-4, s)}; line-height: ${quadrado ? 1.14 : 1.06}; }
.sub  { font-size: ${px(27, s)}; font-weight: 600; color: #BFDBFE; line-height: 1.32; margin-top: ${px(10, s)}; }
.split { display: flex; ${quadrado ? 'flex-direction: column;' : ''} gap: ${px(quadrado ? 28 : 40, s)}; align-items: ${quadrado ? 'stretch' : 'flex-start'}; }
.left  { flex: 1; }
.card  { ${quadrado ? 'width: 100%;' : `width: ${px(450, s)};`} background: rgba(255,255,255,.09);
         border: ${px(2, s)} solid rgba(255,255,255,.24);
         border-radius: ${px(16, s)}; padding: ${px(22, s)} ${px(28, s)}; }
.card .n { font-size: ${px(58, s)}; font-weight: 800; color: #93C5FD; line-height: 1; }
.card .l { font-size: ${px(23, s)}; color: #DBEAFE; line-height: 1.32; margin-top: ${px(8, s)}; }
.card .s { font-size: ${px(LINHA_S.tam, s)}; color: ${LINHA_S.cor}; font-weight: ${LINHA_S.peso}; line-height: ${LINHA_S.lh}; margin-top: ${px(10, s)}; }
.card.placar { background: #FFFFFF; border-color: rgba(255,255,255,.9); box-shadow: 0 ${px(10, s)} ${px(30, s)} rgba(0,0,0,.28); }
.placar .casa + .casa { margin-top: ${px(quadrado ? 14 : 12, s)}; }
.placar .cl { display: flex; justify-content: space-between; font-size: ${px(19, s)}; font-weight: 700; letter-spacing: ${px(1.5, s)}; color: #1E293B; text-transform: uppercase; }
.placar .cl span { font-weight: 400; letter-spacing: 0; text-transform: none; color: #64748B; }
.placar .nums { display: flex; justify-content: space-between; align-items: center; margin-top: ${px(4, s)}; }
.placar .nums span { display: flex; align-items: center; gap: ${px(10, s)}; font-size: ${px(quadrado ? 54 : 44, s)}; font-weight: 800; line-height: 1.05; }
.placar .pd { color: #1D4ED8; } .placar .pr { color: #DC2626; }
.placar .dot { display: inline-flex; align-items: center; justify-content: center; font-style: normal;
  width: ${px(quadrado ? 42 : 34, s)}; height: ${px(quadrado ? 42 : 34, s)}; border-radius: 50%;
  font-size: ${px(quadrado ? 22 : 18, s)}; font-weight: 800; color: #fff; }
.placar .dot.d { background: #2563EB; } .placar .dot.r { background: #DC2626; }
.placar .bar { position: relative; display: flex; height: ${px(quadrado ? 14 : 11, s)}; margin-top: ${px(8, s)}; border-radius: ${px(3, s)}; overflow: visible; }
.placar .bar b { display: block; height: 100%; }
.placar .bar .bd { background: #2563EB; border-radius: ${px(3, s)} 0 0 ${px(3, s)}; }
.placar .bar .bo { background: #CBD5E1; }
.placar .bar .br { background: #DC2626; border-radius: 0 ${px(3, s)} ${px(3, s)} 0; }
.placar .bar em { position: absolute; top: ${px(-5, s)}; bottom: ${px(-5, s)}; width: ${px(3, s)}; background: #0F172A; }
.placar .pn { font-size: ${px(16, s)}; color: #64748B; margin-top: ${px(quadrado ? 14 : 10, s)}; }
.placar .pv { font-size: ${px(quadrado ? 20 : 18, s)}; color: #1E293B; line-height: 1.35; margin-top: ${px(quadrado ? 12 : 8, s)};
  background: #EAF2FF; border-left: ${px(5, s)} solid #0F52BA; border-radius: ${px(6, s)}; padding: ${px(quadrado ? 10 : 7, s)} ${px(14, s)}; }
.placar .pv b { font-weight: 700; color: #0F172A; }
.placar .pv strong { font-weight: 800; color: #0F52BA; font-size: 1.22em; }
.thesis.lado { font-size: ${px(22, s)}; margin-top: ${px(16, s)}; }
.meta.lado { font-size: ${px(15, s)}; margin-top: ${px(8, s)}; }
.card .s .nota { font-size: ${px(17, s)}; font-weight: 400; color: rgba(255,255,255,.65); }
.thesis { font-size: ${px(quadrado ? 32 : 27, s)}; font-weight: 700; line-height: 1.28; margin-top: ${px(quadrado ? 24 : 18, s)}; }
.meta { font-size: ${px(20, s)}; color: rgba(255,255,255,.62); margin-top: ${px(12, s)}; }
.foot { display: flex; justify-content: space-between; align-items: baseline;
        padding-top: ${px(14, s)}; border-top: ${px(2, s)} solid rgba(255,255,255,.22); }
.url  { font-size: ${px(23, s)}; font-weight: 600; color: #93C5FD; }
.trio { font-size: ${px(23, s)}; color: rgba(255,255,255,.62); }
`
}

// Placar das cadeiras projetadas (EUA): democratas à esquerda, republicanos à direita,
// sem projeção no meio, e a marca da maioria sobre a barra. Números do anexo do relatório.
const CASAS = [
  { k: 'senado', d: 54, r: 44, total: 100, maioria: 51 },
  { k: 'camara', d: 250, r: 162, total: 435, maioria: 218 },
]
function placar(P) {
  const pct = (n, t) => `${(100 * n / t).toFixed(2)}%`
  return CASAS.map((c) => `
        <div class="casa">
          <div class="cl">${P[c.k]}<span>${P.maioria} ${c.maioria}</span></div>
          <div class="nums"><span class="pd"><i class="dot d">D</i>${c.d}</span><span class="pr">${c.r}<i class="dot r">R</i></span></div>
          <div class="bar"><b class="bd" style="width:${pct(c.d, c.total)}"></b><b class="bo" style="width:${pct(c.total - c.d - c.r, c.total)}"></b><b class="br" style="width:${pct(c.r, c.total)}"></b><em style="left:${pct(c.maioria, c.total)}"></em></div>
        </div>`).join('') + `
        <div class="pn">${P.nota}</div>
        <div class="pv">${P.vespera}</div>`
}

const html = (f, t) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css(f, !!t.placar)}</style></head>
<body><div class="og">
  <div class="head">
    <div class="mark">AFOS ANALYTICS</div>
    <div class="pais">${bandeira(LARGURA_BANDEIRA * f.s)}<div class="prod">${t.prod}</div></div>
  </div>
  <div class="body">
    <div class="pill">${t.pill}</div>
    <div class="split">
      <div class="left">
        <div class="big">${t.big}</div>
        <div class="sub">${t.sub(f.quadrado)}</div>${t.placar && !f.quadrado ? `
        <div class="thesis lado">${t.tese(true)}</div>
        <div class="meta lado">${t.meta}</div>` : ''}
      </div>
      <div class="card${t.placar ? ' placar' : ''}">${t.placar ? placar(t.placar) : `
        <div class="n">${t.cardN}</div>
        <div class="l">${t.cardL(f.quadrado)}</div>
        <div class="s">${typeof t.cardS === 'function' ? t.cardS(f.quadrado) : t.cardS}</div>`}
      </div>
    </div>
${t.placar && !f.quadrado ? '' : `    <div class="thesis">${t.tese(f.quadrado)}</div>
    <div class="meta">${t.meta}</div>`}
  </div>
  <div class="foot"><div class="url">afos-analytics.com</div><div class="trio">${t.trio}</div></div>
</div></body></html>`

const browser = await chromium.launch()
const DEST = process.argv.slice(2).find((a) => !a.startsWith('--')) || 'public/brand'
let falhou = false
for (const [l, t] of Object.entries(PAIS === 'us' ? TEXTOS_US : TEXTOS)) {
  for (const f of FORMATOS(l)) {
    const ctx = await browser.newContext({ viewport: { width: f.W, height: f.H }, deviceScaleFactor: 1 })
    const page = await ctx.newPage()
    await page.setContent(html(f, t), { waitUntil: 'load' })
    // Conteúdo que transborda a moldura some sem erro; medir antes de gravar.
    const transborda = await page.evaluate(() => {
      const og = document.querySelector('.og')
      return og.scrollHeight > og.clientHeight + 1 || og.scrollWidth > og.clientWidth + 1
    })
    const buf = await page.locator('.og').screenshot({ type: 'png' })
    writeFileSync(`${DEST}/${f.nome}`, buf)
    console.log(`  ${DEST}/${f.nome}  ${(buf.length / 1024).toFixed(0)} KB${transborda ? '  TRANSBORDA' : ''}`)
    if (transborda) falhou = true
    await ctx.close()
  }
}
await browser.close()
if (falhou) process.exit(1)
