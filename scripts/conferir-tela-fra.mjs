/**
 * CONFERIDOR DA TELA DO PAINEL DA FRANÇA, nos 3 idiomas. SÓ LEITURA.
 * Criado 22/Nov/2026. A ETAPA 6 do /atualizar-fra manda conferir a entrega com
 * navegador, e até aqui isso se fazia com playwright redigitado a cada rodada
 * ("browser 5/5 x3"). `conferir-tela.mjs` é do painel dos EUA (sem --pais ele
 * cai em `us`) e confere só número solto; aqui a pergunta é a da rodada da França.
 *
 *   node scripts/conferir-tela-fra.mjs                       # produção
 *   node scripts/conferir-tela-fra.mjs --velho=<commit>       # também exige que o texto daquele commit SUMIU
 *   node scripts/conferir-tela-fra.mjs --base=http://localhost:3000
 *
 * Lê o TEXTO RENDERIZADO (`innerText` depois de networkidle e folga), não o HTML.
 * Por idioma, confere:
 *  1. HTTP 200;
 *  2. o título em negrito de CADA parágrafo de public/fr/analise.<idioma>.json aparece;
 *  3. com --velho, o título do §2 daquele commit NÃO aparece (o texto velho saiu);
 *  4. EN e ES: nenhuma marca de português na página inteira;
 *  5. mercado: a linha de Marine Le Pen aparece na tabela; a Kalshi aparece ou
 *     espera conforme a prontidão (a coluna "Distância/Gap/Distancia" e nenhum
 *     "em coleta; entra"), e o veredito diz qual dos dois a tela mostra;
 *  6. links de fonte: fora da França, o rótulo "fonte ↗" aparece (dentro da
 *     França ele some por causa da lei 2010-476; esta máquina está fora).
 * 🧪 Mutação conferida em 22/Nov/2026: `--esperar=46782cfc` (exige o texto de
 *    21/11, que já saiu da tela) reprova os 3 idiomas no item 2. Um leitor cego
 *    (página vazia, idioma errado) reprova no item 2 também, porque os títulos
 *    exigidos são os do arquivo, não os da tela.
 * Sai 1 se algum item falhar.
 */
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { chromium } from 'playwright'

const arg = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3)
const BASE = arg('base') ?? 'https://www.afos-analytics.com'
const VELHO = arg('velho')
// --esperar=<commit>: exige o texto DAQUELE commit (mutação: com um commit velho, tem de reprovar).
const ESPERAR = arg('esperar')
const lerTexto = (loc, commit) => JSON.parse(commit
  ? execFileSync('git', ['show', `${commit}:public/fr/analise.${loc}.json`], { encoding: 'utf8' })
  : readFileSync(`public/fr/analise.${loc}.json`, 'utf8'))
const LOCALES = ['pt-BR', 'en', 'es']
const ROTULO = {
  'pt-BR': { dist: 'Distância', espera: 'em coleta; entra', fonte: 'fonte ↗' },
  en: { dist: 'Gap', espera: 'collecting; shown from', fonte: 'source ↗' },
  es: { dist: 'Distancia', espera: 'en recolección; entra', fonte: 'fuente ↗' },
}
// Marcas que só o português tem (EN e ES não podem trazer nenhuma).
const MARCAS_PT = [' não ', 'pesquisas', 'eleição', 'Distância', 'contagens', ' também ', 'campo encerrado', 'ção ', 'ções', 'você']
const titulos = (txt) => txt.paragrafos.map((p) => (p.match(/^\*\*(.+?)\*\*/) ?? [])[1]).filter(Boolean)
const norm = (s) => s.replace(/\s+/g, ' ').replace(/[’]/g, "'")

let falhas = 0
const ok = (cond, msg) => { console.log(`   ${cond ? '✓' : '⛔'} ${msg}`); if (!cond) falhas++ }

const browser = await chromium.launch()
try {
  console.log(`🖥️  TELA DO PAINEL DA FRANÇA · ${BASE} · ${new Date().toISOString()}`)
  for (const loc of LOCALES) {
    const txt = lerTexto(loc, ESPERAR)
    const page = await browser.newPage()
    const r = await page.goto(`${BASE}/${loc}/dashboard/fr`, { waitUntil: 'networkidle', timeout: 90_000 })
    await page.waitForTimeout(4000)
    const corpo = norm(await page.evaluate(() => document.body.innerText))
    console.log(`\n== ${loc} · HTTP ${r?.status()} · ${corpo.length} caracteres`)
    ok(r?.status() === 200, 'responde 200')
    const ts = titulos(txt)
    const faltam = ts.filter((t) => !corpo.includes(norm(t)))
    ok(ts.length > 0 && !faltam.length, `texto de ${txt.updatedAt}: ${ts.length - faltam.length} de ${ts.length} títulos de parágrafo na tela${faltam.length ? ` · faltam: ${faltam.map((t) => `"${t.slice(0, 60)}"`).join(' | ')}` : ''}`)
    if (VELHO) {
      const v = JSON.parse(execFileSync('git', ['show', `${VELHO}:public/fr/analise.${loc}.json`], { encoding: 'utf8' }))
      const t2 = titulos(v)[1]
      if (t2 && ts.includes(t2)) console.log(`   · título do §2 igual ao do commit ${VELHO}: item 3 não se aplica`)
      else ok(!!t2 && !corpo.includes(norm(t2)), `texto velho (${v.updatedAt}) saiu: "${(t2 ?? '').slice(0, 60)}" ausente`)
    }
    if (loc !== 'pt-BR') {
      const achadas = MARCAS_PT.filter((m) => corpo.includes(m))
      ok(!achadas.length, `nenhuma marca de português${achadas.length ? ` · achadas: ${achadas.map((m) => `"${m}"`).join(', ')}` : ''}`)
    }
    ok(/Marine Le Pen/.test(corpo), 'mercado: Marine Le Pen na página')
    const R = ROTULO[loc]
    const temDist = corpo.includes(R.dist), espera = corpo.includes(R.espera)
    ok(temDist !== espera, `Kalshi: ${temDist ? `NA TABELA (coluna "${R.dist}")` : espera ? `em espera ("${R.espera}")` : 'nem coluna nem espera: a tabela não montou'}`)
    ok(corpo.includes(R.fonte), `link de fonte "${R.fonte}" aparece (esta máquina está fora da França)`)
    await page.close()
  }
} finally { await browser.close() }
console.log(`\nVEREDITO: ${falhas ? `⛔ ${falhas} falha(s)` : 'TELA CONFERE nos 3 idiomas'}`)
process.exit(falhas ? 1 : 0)
