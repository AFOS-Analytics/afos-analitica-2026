/**
 * Cartões sociais do AFOS Weekly dos ESTADOS UNIDOS, edição nº 6, em TRÊS formatos.
 *
 * 🔴 POR QUE ESTE ARQUIVO EXISTE: medido em 10/Set/2026 nos `<meta>`, e não na
 * tela. A edição do Weekly e a AFOS Daily do MESMO dia serviam as duas o
 * `/brand/og-en-linkedin-1200x627.png`, o cartão genérico da marca, cada uma com
 * `og:title` correto e específico. É o defeito de
 * feedback_dois_produtos_apontando_para_o_mesmo_cartao_social: a tag CERTA
 * apontando para o arquivo de todo mundo. Nenhum portão vê, porque distinção é
 * propriedade do CONJUNTO e não do arquivo, e no feed dois links publicados no
 * mesmo dia com a mesma arte são lidos como repost do primeiro.
 *
 * 📐 TRÊS FORMATOS, cada um por uma razão medida no feed, não por gosto:
 *   1200x627   prévia de link, que é a proporção lida da tag `og:image`
 *   1200x1200  ANEXO no LinkedIn, que sai de borda a borda no feed
 *   1600x900   ANEXO no X e no Bluesky, proporção nativa das duas linhas
 *
 * ⛔ NÃO é a mesma arte esticada: o quadrado REFLUI, com o cartão lateral
 * descendo para baixo do número grande em largura cheia.
 *
 * 🧩 UM CONTRATO POR CARTÃO. Tudo aqui sai do livro de CONTROLE DA CÂMARA, os
 * dois lados dele. ⛔ O Senado e a média das pesquisas ficam FORA: são outro
 * livro e outro instrumento, e misturá-los num cartão foi o defeito corrigido
 * no cartão dos EUA em 22/Ago.
 *
 * 🔢 OS NÚMEROS SÃO DE SEMANA FECHADA, de 3 a 10/Set/2026, e todos saem da
 * edição PUBLICADA em `public/afos-weekly/us/2026-09-10.md`. Cartão anexado a
 * post não pode envelhecer, então nada aqui é leitura viva.
 *
 * 🔢 DECIMAL COM PONTO nos três idiomas, que é a régua do Weekly.
 *
 * 🎨 COR: safira da marca. Quem separa país é a BANDEIRA mais o rótulo
 * "US 2026 MIDTERMS", explícitos em vez de por convenção de tom. A bandeira vem
 * IMPORTADA de `build-og-cards-us.mjs`, nunca copiada: duas cópias do mesmo
 * desenho divergem no dia em que uma é corrigida e a outra não.
 *
 * 🔴 Os arquivos são ESTÁTICOS em /brand/ de propósito: o robots.ts bloqueia
 * `/api/` para todo agente, e o LinkedInBot recusa buscar imagem servida de lá.
 *
 * Uso: node scripts/build-og-card-us-weekly.mjs [destino]
 */
import { chromium } from 'playwright'
import { writeFileSync } from 'fs'
import { bandeira } from './build-og-cards-us.mjs'

/** Os três formatos. `quadrado` liga o refluxo vertical. */
const FORMATOS = [
  { nome: 'og-us-weekly-6-1200x627.png', W: 1200, H: 627, s: 1.0, quadrado: false },
  { nome: 'og-us-weekly-6-1200x1200.png', W: 1200, H: 1200, s: 1.18, quadrado: true },
  { nome: 'og-us-weekly-6-1600x900.png', W: 1600, H: 900, s: 1.34, quadrado: false },
]

const px = (n, s) => `${(n * s).toFixed(1)}px`

function css({ W, H, s, quadrado }) {
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
/* 🔴 line-height 1 CORTA o descendente. Medido na arte, nao no CSS. */
.big  { font-size: ${px(quadrado ? 150 : 118, s)}; font-weight: 800; letter-spacing: ${px(-4, s)}; line-height: ${quadrado ? 1.14 : 1.04}; }
.sub  { font-size: ${px(29, s)}; font-weight: 600; color: #BFDBFE; line-height: 1.32; margin-top: ${px(12, s)}; }
.foot { display: flex; justify-content: space-between; align-items: baseline;
        padding-top: ${px(14, s)}; border-top: ${px(2, s)} solid rgba(255,255,255,.22); }
.url  { font-size: ${px(23, s)}; font-weight: 600; color: #93C5FD; }
.trio { font-size: ${px(23, s)}; color: rgba(255,255,255,.62); }
.meta { font-size: ${px(22, s)}; color: rgba(255,255,255,.62); margin-top: ${px(16, s)}; }
.split { display: flex; ${quadrado ? 'flex-direction: column;' : ''} gap: ${px(quadrado ? 28 : 40, s)}; align-items: ${quadrado ? 'stretch' : 'flex-start'}; }
.left  { flex: 1; }
.card  { ${quadrado ? 'width: 100%;' : `width: ${px(430, s)};`} background: rgba(255,255,255,.09);
         border: ${px(2, s)} solid rgba(255,255,255,.24);
         border-radius: ${px(16, s)}; padding: ${px(22, s)} ${px(28, s)}; }
.card .n { font-size: ${px(58, s)}; font-weight: 800; color: #93C5FD; line-height: 1; }
.card .l { font-size: ${px(24, s)}; color: #DBEAFE; line-height: 1.32; margin-top: ${px(8, s)}; }
.card .s { font-size: ${px(19, s)}; color: rgba(255,255,255,.6); margin-top: ${px(10, s)}; }
/* 🔴 No 1200x627 a tese a 32px quebrava em TRES linhas e empurrava o rodape
   para FORA do cartao: a marca e a URL sumiam. Medido na arte de 10/Set/2026,
   olhando o PNG, nao o CSS. O quadrado tem altura de sobra e mantem os 32. */
.thesis { font-size: ${px(quadrado ? 32 : 29, s)}; font-weight: 700; line-height: 1.28; margin-top: ${px(quadrado ? 24 : 20, s)}; }
`
}

/** 🔑 No quadrado o texto respira, então as quebras manuais mudam. */
const corpo = (quadrado) => `
  <div class="pill">AFOS WEEKLY &middot; US &middot; ISSUE No. 6</div>
  <div class="split">
    <div class="left">
      <div class="big">14.50%</div>
      <div class="sub">the highest reading the Republican${quadrado ? ' ' : '<br>'}House series holds, above the${quadrado ? ' ' : '<br>'}13.50% of July 29</div>
    </div>
    <div class="card">
      <div class="n">86.50%</div>
      <div class="l">where the Democratic side closed,${quadrado ? ' ' : '<br>'}down 3.00pp on the week</div>
      <div class="s">1.00pp above the series floor of 85.50%</div>
    </div>
  </div>
  <div class="thesis">The clearest news ran the other way, on the Missouri map.<br>Both facts are measured. The link between them is not.</div>
  <div class="meta">US House control contract &middot; week of September 3 to September 10, 2026</div>`

const html = (f) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css(f)}</style></head>
<body><div class="og">
  <div class="head">
    <div class="mark">AFOS ANALYTICS</div>
    <div class="pais">${bandeira(62 * f.s)}<div class="prod">US 2026 MIDTERMS</div></div>
  </div>
  <div class="body">${corpo(f.quadrado)}</div>
  <div class="foot"><div class="url">afos-analytics.com</div><div class="trio">Prediction markets &middot; Polls &middot; Press</div></div>
</div></body></html>`

const browser = await chromium.launch()
const DEST = process.argv[2] || 'public/brand'
for (const f of FORMATOS) {
  const ctx = await browser.newContext({ viewport: { width: f.W, height: f.H }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  await page.setContent(html(f), { waitUntil: 'load' })
  const buf = await page.locator('.og').screenshot({ type: 'png' })
  writeFileSync(`${DEST}/${f.nome}`, buf)
  console.log(`  ${DEST}/${f.nome}  ${f.W}x${f.H}  ${(buf.length / 1024).toFixed(0)} KB`)
  await ctx.close()
}
await browser.close()
