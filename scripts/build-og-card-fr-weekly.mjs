/**
 * Cartão social da AFOS Weekly da FRANÇA, GERADO DA PRÓPRIA EDIÇÃO.
 *
 * Criado 23/Nov/2026 para a Nº 1 (números escritos à mão no script) e, no
 * mesmo dia, refeito por decisão do André (opção 3): os preços da Weekly mudam
 * toda semana, e digitar os números do cartão a cada edição é trabalho e risco
 * de cartão diferente do texto. Agora o cartão lê o frontmatter de cada idioma:
 *
 *   número grande  = o card de preço com a MAIOR variação da semana (|delta|)
 *   abaixo dele    = o rótulo desse card e a variação, como estão no texto
 *   quadro lateral = a dispersão das pesquisas (amplitude, maior e menor)
 *   frase          = o trecho em negrito do 1º marcador do TL;DR
 *   rodapé         = a semana da edição (weekStart a weekEnd)
 *
 * Por que cartão POR EDIÇÃO e não um fixo: a edição é uma foto datada e não
 * muda depois de publicada, então o número dela não envelhece; com um cartão
 * só, toda edição sai com a mesma imagem e parece repost. (O PAINEL é outra
 * coisa: é ao vivo, e o cartão dele é fixo e sem número, decisão de 08/Nov.)
 *
 *   node scripts/build-og-card-fr-weekly.mjs --data=AAAA-MM-DD            # gera e grava ogImage nos idiomas
 *   node scripts/build-og-card-fr-weekly.mjs --data=AAAA-MM-DD --sem-gravar [destino]
 *   node scripts/build-og-card-fr-weekly.mjs --data=AAAA-MM-DD --refazer  # sobrescreve cartão existente
 *
 * ⛔ Cartão que já existe NÃO é refeito sem --refazer: o WhatsApp guarda a
 *    imagem do primeiro compartilhamento, e trocar a arte de uma edição já
 *    divulgada deixa duas imagens circulando para o mesmo link.
 * 🧪 Conferência: todo número que entra na arte tem de estar no texto do
 *    idioma; se não estiver, o script reprova e não grava nada.
 * ⚖️ Lei 2010-476 (art. 57): preço como MEDIÇÃO, sem convite nem endereço de
 *    casa de aposta; o rótulo do card já diz o livro e o contrato.
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import matter from 'gray-matter'

const arg = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.split('=')[1]
const DATA = arg('data')
if (!DATA || !/^\d{4}-\d{2}-\d{2}$/.test(DATA)) {
  console.error('Uso: node scripts/build-og-card-fr-weekly.mjs --data=AAAA-MM-DD [--sem-gravar] [--refazer] [destino]')
  process.exit(1)
}
const GRAVAR = !process.argv.includes('--sem-gravar')
const REFAZER = process.argv.includes('--refazer')
const DEST = process.argv.slice(2).find((a) => !a.startsWith('--')) || 'public/brand'

const MESES = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  'pt-BR': ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
}
const dm = (iso) => ({ d: Number(iso.slice(8, 10)), m: Number(iso.slice(5, 7)) - 1, a: iso.slice(0, 4) })
/** Rótulos fixos da arte e a forma da semana, por idioma. */
const UI = {
  en: {
    arquivo: '', sufixo: '',
    pill: (n) => `AFOS WEEKLY &middot; FRANCE &middot; ISSUE No. ${n}`,
    prod: 'FRANCE 2027 PRESIDENTIAL', trio: 'Prediction markets &middot; Polls &middot; Press',
    disp: 'spread between each pollster’s first list',
    semana: (a, b) => { const x = dm(a), y = dm(b); return `week of ${MESES.en[x.m]} ${x.d} to ${MESES.en[y.m]} ${y.d}, ${y.a}` },
  },
  'pt-BR': {
    arquivo: '.pt-BR', sufixo: '-pt',
    pill: (n) => `AFOS WEEKLY &middot; FRANÇA &middot; EDIÇÃO Nº ${n}`,
    prod: 'PRESIDENCIAL FRANÇA 2027', trio: 'Mercados de previsão &middot; Pesquisas &middot; Imprensa',
    disp: 'distância entre a primeira lista de cada instituto',
    semana: (a, b) => { const x = dm(a), y = dm(b); return x.m === y.m ? `semana de ${x.d} a ${y.d} de ${MESES['pt-BR'][y.m]} de ${y.a}` : `semana de ${x.d} de ${MESES['pt-BR'][x.m]} a ${y.d} de ${MESES['pt-BR'][y.m]} de ${y.a}` },
  },
  es: {
    arquivo: '.es', sufixo: '-es',
    pill: (n) => `AFOS WEEKLY &middot; FRANCIA &middot; EDICIÓN Nº ${n}`,
    prod: 'PRESIDENCIAL FRANCIA 2027', trio: 'Mercados de predicción &middot; Encuestas &middot; Prensa',
    disp: 'distancia entre la primera lista de cada instituto',
    semana: (a, b) => { const x = dm(a), y = dm(b); return x.m === y.m ? `semana del ${x.d} al ${y.d} de ${MESES.es[y.m]} de ${y.a}` : `semana del ${x.d} de ${MESES.es[x.m]} al ${y.d} de ${MESES.es[y.m]} de ${y.a}` },
  },
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const semNegrito = (s) => String(s).replace(/\*\*/g, '')
const numDelta = (s) => { const m = String(s ?? '').match(/[+-]?\d+(?:\.\d+)?/); return m ? Math.abs(Number(m[0])) : -1 }

/** O conteúdo da arte, só com o que está no frontmatter do idioma. */
function conteudo(fm, u) {
  const cards = fm.cards ?? []
  if (!cards.length) throw new Error('edição sem cards de preço')
  const c = cards.reduce((best, x) => (numDelta(x.delta) > numDelta(best.delta) ? x : best), cards[0])
  const tese = semNegrito((String(fm.tldr?.[0] ?? '').match(/^\*\*(.+?)\*\*/) ?? [])[1] ?? '')
  if (!tese) throw new Error('1º marcador do TL;DR sem trecho em negrito no início')
  const d = fm.dispersion
  return {
    big: c.headline,
    bigSub: `${esc(c.label)}<br>${esc(c.delta)}`,
    cardN: d ? esc(d.amplitude) : '',
    cardL: d ? `${esc(d.high)}<br>${esc(d.low)}` : '',
    cardS: d ? u.disp : '',
    tese: esc(tese),
    meta: u.semana(fm.weekStart, fm.weekEnd),
    pill: u.pill(fm.issueNumber),
    numeros: [c.headline, c.delta, d?.amplitude, d?.high, d?.low, tese].filter(Boolean).join(' '),
  }
}

const formatos = (n, suf) => [
  { nome: `og-fr-weekly-${n}${suf}-1200x627.png`, W: 1200, H: 627, s: 1.0, quadrado: false, og: true },
  { nome: `og-fr-weekly-${n}${suf}-1200x1200.png`, W: 1200, H: 1200, s: 1.18, quadrado: true },
  { nome: `og-fr-weekly-${n}${suf}-1600x900.png`, W: 1600, H: 900, s: 1.34, quadrado: false },
]

const px = (n, s) => `${(n * s).toFixed(1)}px`
const BANDEIRA = `data:image/svg+xml;base64,${Buffer.from(readFileSync('public/flags/fr.svg')).toString('base64')}`

function css({ W, H, s, quadrado }) {
  return `
body { width: ${W}px; height: ${H}px; margin: 0; }
.og {
  width: ${W}px; height: ${H}px; position: relative; box-sizing: border-box;
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
.flag { border-radius: 3px; box-shadow: 0 0 0 1px rgba(255,255,255,.45); display: block; width: ${px(62, s)}; height: ${px(41.3, s)}; }
.prod { font-size: ${px(22, s)}; font-weight: 700; letter-spacing: ${px(2.2, s)}; color: #fff; }
.body { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.pill { display: inline-block; align-self: flex-start; font-size: ${px(20, s)}; font-weight: 700;
        letter-spacing: ${px(2.4, s)}; color: #BFDBFE; border: ${px(2, s)} solid rgba(255,255,255,.3);
        border-radius: 999px; padding: ${px(7, s)} ${px(18, s)}; margin-bottom: ${px(16, s)}; }
.big  { font-size: ${px(quadrado ? 150 : 118, s)}; font-weight: 800; letter-spacing: ${px(-4, s)}; line-height: ${quadrado ? 1.14 : 1.04}; }
.sub  { font-size: calc(${px(27, s)} * var(--k, 1)); font-weight: 600; color: #BFDBFE; line-height: 1.32; margin-top: ${px(12, s)}; }
.foot { display: flex; justify-content: space-between; align-items: baseline;
        padding-top: ${px(14, s)}; border-top: ${px(2, s)} solid rgba(255,255,255,.22); }
.url  { font-size: ${px(23, s)}; font-weight: 600; color: #93C5FD; }
.trio { font-size: ${px(23, s)}; color: rgba(255,255,255,.62); }
.meta { font-size: ${px(22, s)}; color: rgba(255,255,255,.62); margin-top: ${px(16, s)}; }
.split { display: flex; ${quadrado ? 'flex-direction: column;' : ''} gap: ${px(quadrado ? 28 : 40, s)}; align-items: ${quadrado ? 'stretch' : 'flex-start'}; }
.left  { flex: 1; }
.card  { ${quadrado ? 'width: 100%;' : `width: ${px(430, s)};`} box-sizing: border-box; background: rgba(255,255,255,.09);
         border: ${px(2, s)} solid rgba(255,255,255,.24);
         border-radius: ${px(16, s)}; padding: ${px(22, s)} ${px(28, s)}; }
.card .n { font-size: calc(${px(58, s)} * var(--k, 1)); font-weight: 800; color: #93C5FD; line-height: 1.05; }
.card .l { font-size: calc(${px(22, s)} * var(--k, 1)); color: #DBEAFE; line-height: 1.32; margin-top: ${px(8, s)}; }
.card .s { font-size: ${px(19, s)}; color: rgba(255,255,255,.6); margin-top: ${px(10, s)}; }
.thesis { font-size: calc(${px(quadrado ? 32 : 29, s)} * var(--k, 1)); font-weight: 700; line-height: 1.28; margin-top: ${px(quadrado ? 24 : 20, s)}; }
`
}

const html = (f, e, u) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css(f)}</style></head>
<body><div class="og">
  <div class="head">
    <div class="mark">AFOS ANALYTICS</div>
    <div class="pais"><img class="flag" src="${BANDEIRA}" alt=""><div class="prod">${u.prod}</div></div>
  </div>
  <div class="body">
    <div class="pill">${e.pill}</div>
    <div class="split">
      <div class="left"><div class="big">${esc(e.big)}</div><div class="sub">${e.bigSub}</div></div>
      ${e.cardN ? `<div class="card"><div class="n">${e.cardN}</div><div class="l">${e.cardL}</div><div class="s">${e.cardS}</div></div>` : ''}
    </div>
    <div class="thesis">${e.tese}</div>
    <div class="meta">${e.meta}</div>
  </div>
  <div class="foot"><div class="url">afos-analytics.com</div><div class="trio">${u.trio}</div></div>
</div></body></html>`

/** Grava (ou troca) a linha `ogImage:` do frontmatter, logo depois de `updatedAt:`. */
function gravarOgImage(arq, caminho) {
  const s = readFileSync(arq, 'utf8')
  const linha = `ogImage: "${caminho}"`
  const novo = /^ogImage:.*$/m.test(s) ? s.replace(/^ogImage:.*$/m, linha) : s.replace(/^(updatedAt:.*)$/m, `$1\n${linha}`)
  if (!novo.includes(linha)) throw new Error(`${arq}: não consegui gravar ogImage (frontmatter sem updatedAt?)`)
  writeFileSync(arq, novo)
}

let falhas = 0
const browser = await chromium.launch()
try {
  for (const [idioma, u] of Object.entries(UI)) {
    const arq = `public/afos-weekly/fr/${DATA}${u.arquivo}.md`
    if (!existsSync(arq)) { console.log(`· ${idioma}: ${arq} não existe (ainda não traduzido): sem cartão neste idioma`); continue }
    const bruto = readFileSync(arq, 'utf8')
    const fm = matter(bruto).data
    const e = conteudo(fm, u)
    // 🧪 Todo número da arte tem de estar no texto do idioma.
    const fora = [...new Set(e.numeros.match(/[+-]?\d+(?:[.,]\d+)?/g) ?? [])].filter((n) => !bruto.includes(n.replace(/^\+/, '')))
    if (fora.length) { console.error(`  ⛔ ${idioma}: número no cartão que não está no texto: ${fora.join(' ')}`); falhas++; continue }
    const fs = formatos(fm.issueNumber, u.sufixo)
    const og = fs.find((f) => f.og)
    if (existsSync(`${DEST}/${og.nome}`) && !REFAZER) {
      console.log(`· ${idioma}: ${og.nome} já existe; não refaço sem --refazer (o WhatsApp guarda a 1ª imagem)`)
    } else {
      for (const f of fs) {
        const ctx = await browser.newContext({ viewport: { width: f.W, height: f.H }, deviceScaleFactor: 1 })
        const page = await ctx.newPage()
        await page.setContent(html(f, e, u), { waitUntil: 'load' })
        // Texto longo (o pt-BR costuma ser): reduz a letra do texto corrido em passos até caber, até 70%.
        let transborda = true
        for (const k of [1, 0.92, 0.85, 0.78, 0.7]) {
          transborda = await page.evaluate((kk) => { document.documentElement.style.setProperty('--k', String(kk)); const o = document.querySelector('.og'); return o.scrollHeight > o.clientHeight + 1 }, k)
          if (!transborda) break
        }
        const buf = await page.locator('.og').screenshot({ type: 'png' })
        writeFileSync(`${DEST}/${f.nome}`, buf)
        console.log(`  ${idioma} ${DEST}/${f.nome}  ${f.W}x${f.H}  ${(buf.length / 1024).toFixed(0)} KB${transborda ? '  ⛔ TRANSBORDA: encurtar o texto' : ''}`)
        if (transborda) falhas++
        await ctx.close()
      }
    }
    if (GRAVAR && !falhas) { gravarOgImage(arq, `/brand/${og.nome}`); console.log(`  ${idioma}: ogImage → /brand/${og.nome}`) }
  }
} finally { await browser.close() }
process.exit(falhas ? 1 : 0)
