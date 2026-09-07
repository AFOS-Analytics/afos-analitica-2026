/**
 * Cartões sociais da edição do AFOS Tradeoff dos ESTADOS UNIDOS, em TRÊS formatos.
 *
 * 🔴 POR QUE ESTE ARQUIVO EXISTE: a página da edição serve
 * `/brand/og-en-linkedin-1200x627.png`, que é o cartão genérico da marca.
 * Medido em 06/Set/2026: a edição do BRASIL e a dos EUA da MESMA data serviam
 * esse mesmo arquivo, com `og:title` correto e específico nas duas. É o defeito
 * de feedback_dois_produtos_apontando_para_o_mesmo_cartao_social: a tag CERTA
 * apontando para o arquivo de todo mundo, que nenhum portão vê porque
 * distinção é propriedade do CONJUNTO e não do arquivo.
 *
 * 📐 TRÊS FORMATOS, e cada um existe por uma razão MEDIDA, não por gosto:
 *
 *   1200x627  `og`      prévia de link. É a proporção que o LinkedIn e o
 *                       Bluesky leem da tag `og:image`.
 *   1200x1200 `li`      ANEXO no feed do LinkedIn. 🔴 ATENÇÃO: este formato
 *                       NÃO resolveu a borda preta. Postado em 06/Set/2026, ele
 *                       saiu com tarja nas LATERAIS, ou seja a borda mudou de
 *                       lugar em vez de sumir. A frase que estava aqui, de que
 *                       "quadrado preenche a coluna inteira, sem faixa", era
 *                       INFERÊNCIA minha escrita como medição, e está errada.
 *                       Hipótese de pé: post de VÁRIAS imagens força um quadro
 *                       comum e coloca tarja em quem não bate. Teste que decide:
 *                       publicar como imagem ÚNICA.
 *                       → memory/feedback_o_quadrado_nao_tirou_a_borda_preta_do_linkedin.md
 *   1600x900  `x`       ANEXO no X e no Bluesky. 16:9 é a proporção que as
 *                       duas linhas do tempo mostram inteira. Registrado em
 *                       31/Ago que o 1200x627 saiu no X "inteiro e sem tarja",
 *                       então lá o risco é baixo; 16:9 é o formato nativo e
 *                       tira o resto do risco.
 *
 * ⛔ NÃO é a mesma arte esticada. O quadrado REFLUI: o cartão lateral desce
 * para baixo do número grande, em largura cheia. Esticar 1.91:1 para 1:1
 * deformaria a tipografia, e cortar perderia metade do conteúdo.
 *
 * 🎨 COR: safira da marca (#0F52BA). A régua manda a COR separar país, e quem
 * separa aqui é a BANDEIRA mais o rótulo "US 2026 MIDTERMS", explícitos em vez
 * de por convenção de tom. A bandeira vem IMPORTADA de `build-og-cards-us.mjs`
 * em vez de copiada: duas cópias do mesmo desenho divergem no dia em que uma
 * é corrigida e a outra não.
 *
 * 🔢 OS NÚMEROS SÃO DE SEMANA FECHADA, e isso é decisão de projeto: cartão
 * anexado a post não pode envelhecer. Nada aqui é leitura viva.
 *
 * 🧩 UM CONTRATO POR CARTÃO. Tudo sai do BINÁRIO DE CONTROLE DO SENADO, os
 * dois lados dele. ⛔ As 59 leituras e os USD 63.454 da edição somam Câmara
 * MAIS Senado e por isso ficam FORA: misturar dois livros num cartão foi
 * exatamente o defeito corrigido no cartão dos EUA em 22/Ago.
 *
 * ✅ CONFERIDO em 06/Set/2026 no `backup/neon`, fechamentos diários de 31/Ago
 * a 04/Set, com corte de dia em UTC:
 *   - lado republicano: 49,50 nas 29 leituras da semana, amplitude 0,00pp;
 *   - lado democrata: 50,50 → 51,50, +1,00pp cru;
 *   - o par abriu de 100,00% para 101,00% no fechamento de 02/Set e ficou;
 *   - normalizado, 50,50% → 50,99%, ou seja +0,49pp;
 *   - dinheiro novo na perna republicana na semana: USD 23.812.
 *
 * ⛔ É "+0.49pp normalizado", e o que falta são "0.51pp". Nunca "a metade":
 * 1,00 → 0,49 é 49%, e escrever metade arredonda a favor da manchete.
 *
 * 🔴 Os arquivos são ESTÁTICOS em /brand/ de propósito: o robots.ts bloqueia
 * `/api/` para todo agente, e o LinkedInBot recusa buscar imagem servida de lá.
 *
 * Uso: node scripts/build-og-card-us-tradeoff.mjs [destino]
 */
import { chromium } from 'playwright'
import { writeFileSync } from 'fs'
import { bandeira } from './build-og-cards-us.mjs'

/** Os três formatos. `quadrado` liga o refluxo vertical. */
const FORMATOS = [
  { nome: 'og-us-tradeoff-7-1200x627.png', W: 1200, H: 627, s: 1.0, quadrado: false },
  { nome: 'og-us-tradeoff-7-1200x1200.png', W: 1200, H: 1200, s: 1.18, quadrado: true },
  { nome: 'og-us-tradeoff-7-1600x900.png', W: 1600, H: 900, s: 1.34, quadrado: false },
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
/* 🔴 line-height 1 CORTA o descendente do p. A 150px no quadrado, o "pp" de
   "0.00pp" invadia a linha de baixo. Medido na arte, nao no CSS. */
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
.thesis { font-size: ${px(32, s)}; font-weight: 700; line-height: 1.28; margin-top: ${px(24, s)}; }
`
}

/** 🔑 No quadrado o texto respira, então as quebras manuais mudam. */
const corpo = (quadrado) => `
  <div class="pill">AFOS TRADEOFF &middot; US &middot; ISSUE No. 7</div>
  <div class="split">
    <div class="left">
      <div class="big">0.00pp</div>
      <div class="sub">how much the Republican Senate${quadrado ? ' ' : '<br>'}contract moved in 29 of 29 readings,${quadrado ? ' ' : '<br>'}across five sessions</div>
    </div>
    <div class="card">
      <div class="n">+0.49pp</div>
      <div class="l">what the Democratic +1.00pp is${quadrado ? ' ' : '<br>'}worth once the pair is normalized</div>
      <div class="s">The pair opened from 100.00% to 101.00% at the September 2 close</div>
    </div>
  </div>
  <div class="thesis">The leg that never ticked took USD 23,812 of new money.<br>The other side's gain went into the sum, not into the counterparty.</div>
  <div class="meta">US Senate control contract &middot; daily closes, August 31 to September 4, 2026</div>`

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
