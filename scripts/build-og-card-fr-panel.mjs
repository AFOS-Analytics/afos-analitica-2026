/**
 * Cartão social (OG) do PAINEL DA FRANÇA. Criado 08/Nov/2026.
 *
 * Moldura dos EUA (`build-og-cards-us.mjs`): safira da casa, e quem diz o país
 * é a BANDEIRA mais o rótulo escrito, não a cor.
 *
 * 🔢 DIFERENÇA DELIBERADA EM RELAÇÃO AOS EUA: nenhum número é digitado. O
 * cartão dos EUA tinha o preço escrito à mão e precisava ser regerado e
 * reescrito quando o preço andava. Aqui os três números saem na hora da
 * geração:
 *   - preço da Polymarket de Le Pen VENCER e de ela ESTAR NA CÉDULA, lidos na
 *     rota do AFOS (`/api/polymarket?country=fra&fresh=1`, com carimbo);
 *   - quantas listas de 1º turno dos últimos 45 dias a põem em primeiro, do
 *     coletor de pesquisas conferido contra as fichas oficiais.
 * O carimbo declara dia e HORA da leitura, para o cartão continuar verdadeiro
 * depois que o preço andar.
 *
 * ⛔ Descreve medição, não tese: dois números do mercado e um das pesquisas,
 * lado a lado, sem subtrair um do outro (grandezas diferentes).
 *
 * Uso: node scripts/build-og-card-fr-panel.mjs [pasta-destino]   (padrão public/brand)
 * Gera og-fr-panel-1200x627.png. Regerar antes de publicar a tela e a cada
 * vez que o cartão for anexado a um post.
 */
import { chromium } from 'playwright'
import { writeFileSync } from 'fs'
import { baseDeLeitura } from './lib/base-afos.mjs'
import { coletarPesquisasFr } from '../lib/fr-polls/collect.mjs'

const W = 1200
const H = 627
const DIAS = 45

/** Tricolor desenhada em SVG: o LinkedInBot só busca o arquivo declarado, nada externo. */
function bandeira(w) {
  const h = (w * 2) / 3
  const t = w / 3
  return `<svg class="flag" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${t}" height="${h}" fill="#002395"/>
    <rect x="${t}" y="0" width="${t}" height="${h}" fill="#FFFFFF"/>
    <rect x="${2 * t}" y="0" width="${t}" height="${h}" fill="#ED2939"/>
  </svg>`
}

async function lerMercado() {
  const res = await fetch(`${baseDeLeitura()}/api/polymarket?country=fra&fresh=1`, { signal: AbortSignal.timeout(60000) })
  if (!res.ok) throw new Error(`rota de mercado devolveu HTTP ${res.status}`)
  const j = await res.json()
  if (j.degraded) throw new Error('leitura de mercado DEGRADADA: não gerar cartão com número incompleto')
  const preco = (ev, re) => {
    const m = (ev?.markets ?? []).find((x) => !x.closed && re.test(x.question ?? ''))
    const p = Number(m?.outcomePrices?.[0])
    if (!Number.isFinite(p)) throw new Error(`contrato não encontrado: ${re}`)
    return p * 100
  }
  return {
    vence: preco(j.winner, /^Will Marine Le Pen win\b/),
    cedula: preco(j.onBallot, /^Will Marine Le Pen be on the ballot\b/),
    lidoEm: j.fetchedAt,
  }
}

async function lerPesquisas(agora) {
  const d = await coletarPesquisasFr({ agora })
  if (d.qualidade.falhas.length) throw new Error(`pesquisas: ${d.qualidade.falhas.join(' | ')}`)
  const corte = new Date(agora.getTime() - DIAS * 864e5).toISOString().slice(0, 10)
  const listas = d.pesquisas.filter((p) => p.publicavel && p.turno === 1 && p.campo.fim >= corte)
  const primeira = listas.filter((p) => p.intencoes[0]?.candidato === 'Marine Le Pen').length
  return { listas: listas.length, primeira }
}

const MESES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
function carimbo(iso) {
  const d = new Date(iso)
  return `${MESES[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}, ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')} UTC`
}

const CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: ${W}px; height: ${H}px; }
.og { width: ${W}px; height: ${H}px; position: relative;
  background: linear-gradient(135deg, #0F52BA 0%, #072B63 100%);
  font-family: "Segoe UI", Arial, sans-serif; color: #fff;
  padding: 42px 72px 32px 72px; display: flex; flex-direction: column; }
.og::before { content: ""; position: absolute; left: 0; top: 0; width: 10px; height: 100%; background: #93C5FD; }
.head { display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 2px solid rgba(255,255,255,.22); }
.mark { font-size: 23px; font-weight: 700; letter-spacing: 4.2px; color: #BFDBFE; }
.pais { display: flex; align-items: center; gap: 14px; }
.flag { border-radius: 3px; box-shadow: 0 0 0 1px rgba(255,255,255,.45); display: block; }
.prod { font-size: 22px; font-weight: 700; letter-spacing: 2.2px; }
.body { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.pill { display: inline-block; align-self: flex-start; font-size: 20px; font-weight: 700; letter-spacing: 2.4px; color: #BFDBFE;
        border: 2px solid rgba(255,255,255,.3); border-radius: 999px; padding: 7px 18px; margin-bottom: 16px; }
.split { display: flex; gap: 40px; align-items: flex-start; }
.left { flex: 1; }
.big { font-size: 118px; font-weight: 800; letter-spacing: -4px; line-height: 1; }
.sub { font-size: 29px; font-weight: 600; color: #BFDBFE; line-height: 1.32; margin-top: 12px; }
.card { width: 420px; background: rgba(255,255,255,.09); border: 2px solid rgba(255,255,255,.24); border-radius: 16px; padding: 22px 28px; }
.card .n { font-size: 58px; font-weight: 800; color: #93C5FD; line-height: 1; }
.card .l { font-size: 25px; color: #DBEAFE; line-height: 1.32; margin-top: 8px; }
.card .s { font-size: 19px; color: rgba(255,255,255,.6); margin-top: 10px; }
.thesis { font-size: 32px; font-weight: 700; line-height: 1.28; margin-top: 24px; }
.meta { font-size: 21px; color: rgba(255,255,255,.62); margin-top: 16px; }
.foot { display: flex; justify-content: space-between; align-items: baseline; padding-top: 14px; border-top: 2px solid rgba(255,255,255,.22); }
.url { font-size: 23px; font-weight: 600; color: #93C5FD; }
.trio { font-size: 23px; color: rgba(255,255,255,.62); }
`

function html({ vence, cedula, lidoEm, listas, primeira }) {
  const f2 = (v) => v.toFixed(2)
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="og">
  <div class="head"><div class="mark">AFOS ANALYTICS</div><div class="pais">${bandeira(60)}<div class="prod">FRANCE 2027 PRESIDENTIAL</div></div></div>
  <div class="body">
    <div class="pill">FRANCE PANEL</div>
    <div class="split">
      <div class="left">
        <div class="big">${f2(vence)}%</div>
        <div class="sub">what the market pays on<br>Marine Le Pen winning<br>the presidency</div>
      </div>
      <div class="card">
        <div class="n">${f2(cedula)}%</div>
        <div class="l">that she will be on<br>the ballot at all</div>
        <div class="s">Cour de cassation ruling due by early April 2027</div>
      </div>
    </div>
    <div class="thesis">The polls put her first in ${primeira} of ${listas}<br>first-round lists of the past ${DIAS} days.</div>
    <div class="meta">Polymarket, reading of ${carimbo(lidoEm)} &middot; polls checked against official notices</div>
  </div>
  <div class="foot"><div class="url">afos-analytics.com</div><div class="trio">Prediction markets &middot; Polls &middot; Press</div></div>
</div></body></html>`
}

const agora = new Date()
const [mercado, pesq] = await Promise.all([lerMercado(), lerPesquisas(agora)])
console.log(`🇫🇷 cartão do painel FR · vence ${mercado.vence.toFixed(2)} · cédula ${mercado.cedula.toFixed(2)} · ${pesq.primeira}/${pesq.listas} listas · lido ${mercado.lidoEm}`)
const browser = await chromium.launch()
const page = await (await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })).newPage()
await page.setContent(html({ ...mercado, ...pesq }), { waitUntil: 'load' })
const buf = await page.locator('.og').screenshot({ type: 'png' })
const DEST = process.argv[2] || 'public/brand'
writeFileSync(`${DEST}/og-fr-panel-1200x627.png`, buf)
console.log(`  ${DEST}/og-fr-panel-1200x627.png  ${(buf.length / 1024).toFixed(0)} KB`)
await browser.close()
