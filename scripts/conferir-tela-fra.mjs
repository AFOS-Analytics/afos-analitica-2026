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
 *  2. TOPO (desde 23/Nov/2026, decisão do André): o cartão da AFOS Weekly da
 *     França (com "№") e o cartão de apresentação ("Painel França") aparecem,
 *     e o texto diário do painel NÃO: nenhum título de parágrafo de
 *     public/fr/analise.<idioma>.json na tela (o texto saiu da tela; os JSON
 *     ficaram no repositório). Nenhum travessão (—) na página inteira;
 *  3. (aposentado em 23/Nov/2026 com o texto: --velho vale só para os perfis);
 *  4. EN e ES: nenhuma marca de português na página inteira;
 *  5. mercado: a linha de Marine Le Pen aparece na tabela; a Kalshi aparece ou
 *     espera conforme a prontidão (a coluna "Distância/Gap/Distancia" e nenhum
 *     "em coleta; entra"), e o veredito diz qual dos dois a tela mostra;
 *  6. links de fonte: fora da França, o rótulo "fonte ↗" aparece (dentro da
 *     França ele some por causa da lei 2010-476; esta máquina está fora).
 *  7. PERFIS (23/Nov/2026): quantos perfis de public/fr/candidatos.<idioma>.json
 *     aparecem com o texto ATUAL de "candidatura"; com --velho, o perfil que
 *     mudou desde aquele commit não pode mostrar o texto velho. Antes, a rodada
 *     que mexia só em perfil passava com a tela velha;
 *  8. IMPRENSA (23/Nov/2026): nenhuma manchete repetida com e sem rubrica na
 *     seção (`mesmaMateriaComRubrica`, a regra da coleta). Em 23/11 o L'Opinion
 *     ocupou 2 das 10 vagas com a mesma matéria, e este conferidor dizia CONFERE.
 * 🧪 Mutação conferida em 23/Nov/2026: contra a PRODUÇÃO de antes da troca
 *    (texto na tela, sem cartões) o item 2 reprova nos 3 idiomas; um leitor
 *    cego (página vazia) reprova nos cartões, porque o item exige o que
 *    APARECE, não só o que falta.
 * Sai 1 se algum item falhar.
 */
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { chromium } from 'playwright'
import { mesmaMateriaComRubrica } from '../lib/fr-press/collect.mjs'

const arg = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3)
const BASE = arg('base') ?? 'https://www.afos-analytics.com'
const VELHO = arg('velho')
// --esperar=<commit>: exige o texto DAQUELE commit (mutação: com um commit velho, tem de reprovar).
const ESPERAR = arg('esperar')
const lerTexto = (loc, commit) => JSON.parse(commit
  ? execFileSync('git', ['show', `${commit}:public/fr/analise.${loc}.json`], { encoding: 'utf8' })
  : readFileSync(`public/fr/analise.${loc}.json`, 'utf8'))
const LOCALES = ['pt-BR', 'en', 'es']
const R0 = { 'pt-BR': 'Painel França', en: 'France panel', es: 'Panel Francia' }
const ROTULO = {
  'pt-BR': { dist: 'Distância', espera: 'em coleta; entra', fonte: 'fonte ↗' },
  en: { dist: 'Gap', espera: 'collecting; shown from', fonte: 'source ↗' },
  es: { dist: 'Distancia', espera: 'en recolección; entra', fonte: 'fuente ↗' },
}
// Marcas que só o português tem (EN e ES não podem trazer nenhuma).
const MARCAS_PT = [' não ', 'pesquisas', 'eleição', 'Distância', 'contagens', ' também ', 'campo encerrado', 'ção ', 'ções', 'você']
const lerPerfis = (loc, commit) => JSON.parse(commit
  ? execFileSync('git', ['show', `${commit}:public/fr/candidatos.${loc}.json`], { encoding: 'utf8' })
  : readFileSync(`public/fr/candidatos.${loc}.json`, 'utf8')).perfis
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
    // 2. Topo: cartões das edições e apresentação; o texto diário fora da tela.
    const ts = titulos(txt)
    const naTelaTxt = ts.filter((t) => corpo.includes(norm(t)))
    ok(ts.length > 0 && !naTelaTxt.length, `texto diário fora da tela: ${naTelaTxt.length} de ${ts.length} títulos de parágrafo aparecem${naTelaTxt.length ? ` · na tela: ${naTelaTxt.map((t) => `"${t.slice(0, 60)}"`).join(' | ')}` : ''}`)
    ok(/AFOS WEEKLY/i.test(corpo) && corpo.includes('№'), 'cartão da AFOS Weekly com edição no topo')
    ok(corpo.includes(R0[loc]), `cartão de apresentação "${R0[loc]}"`)
    const travessoes = corpo.split(/(?<=[.!?])\s/).filter((f) => f.includes('—'))
    ok(!travessoes.length, `nenhum travessão${travessoes.length ? ` · ${travessoes.map((f) => `"${f.slice(0, 70)}"`).join(' | ')}` : ''}`)
    if (loc !== 'pt-BR') {
      const achadas = MARCAS_PT.filter((m) => corpo.includes(m))
      ok(!achadas.length, `nenhuma marca de português${achadas.length ? ` · achadas: ${achadas.map((m) => `"${m}"`).join(', ')}` : ''}`)
    }
    ok(/Marine Le Pen/.test(corpo), 'mercado: Marine Le Pen na página')
    const R = ROTULO[loc]
    const temDist = corpo.includes(R.dist), espera = corpo.includes(R.espera)
    ok(temDist !== espera, `Kalshi: ${temDist ? `NA TABELA (coluna "${R.dist}")` : espera ? `em espera ("${R.espera}")` : 'nem coluna nem espera: a tabela não montou'}`)
    ok(corpo.includes(R.fonte), `link de fonte "${R.fonte}" aparece (esta máquina está fora da França)`)

    // 7. Perfis: texto atual na tela, e o velho fora.
    const perfis = lerPerfis(loc, ESPERAR)
    const naTela = Object.entries(perfis).filter(([, p]) => corpo.includes(norm(p.candidatura)))
    ok(naTela.length > 0, `perfis: ${naTela.length} com o texto atual na tela (${naTela.map(([n]) => n.split(' ').slice(-1)[0]).join(', ')})`)
    if (VELHO) {
      const velhos = lerPerfis(loc, VELHO)
      for (const [n, p] of Object.entries(perfis)) {
        const v = velhos[n]?.candidatura
        if (!v || v === p.candidatura) continue
        // Texto novo que só ACRESCENTA ao velho contém o velho: aí só se exige o novo.
        const novoNaTela = corpo.includes(norm(p.candidatura)), velhoNaTela = !p.candidatura.includes(v) && corpo.includes(norm(v))
        if (!novoNaTela && !velhoNaTela) { console.log(`   · perfil de ${n} mudou desde ${VELHO}, mas não está entre os exibidos`); continue }
        ok(novoNaTela && !velhoNaTela, `perfil de ${n} mudou desde ${VELHO}: ${novoNaTela ? 'texto novo na tela' : 'texto novo AUSENTE'}${velhoNaTela ? ', texto VELHO ainda na tela' : ''}`)
      }
    }

    // 8. Imprensa: nenhuma manchete repetida com e sem rubrica.
    const manchetes = await page.evaluate(() => [...document.querySelectorAll('a[href^="http"]')]
      .filter((a) => !/afos-analytics|commission-des-sondages|dataverse|huggingface|polymarket|kalshi|wikipedia|github/.test(a.href))
      .map((a) => a.innerText.replace(/\s+/g, ' ').trim()).filter((t) => t.split(' ').length >= 6))
    // Controle positivo da regra: o par real de 23/11 (L'Opinion, feed x Google News) tem de ser acusado.
    ok(mesmaMateriaComRubrica('David Lisnard devance Edouard Philippe dans un sondage pour la première fois', 'Présidentielle 2027 : David Lisnard devance Edouard Philippe dans un sondage pour la première fois'), 'imprensa: a regra acusa o par real de 23/11 (controle positivo)')
    const pares = []
    for (let i = 0; i < manchetes.length; i++) for (let j = i + 1; j < manchetes.length; j++) if (mesmaMateriaComRubrica(manchetes[i], manchetes[j])) pares.push(`"${manchetes[j].slice(0, 50)}"`)
    ok(manchetes.length > 0 && !pares.length, `imprensa: ${manchetes.length} manchete(s), ${pares.length ? `REPETIDAS com e sem rubrica: ${pares.join(' | ')}` : 'nenhuma repetida'}`)
    await page.close()
  }
} finally { await browser.close() }
console.log(`\nVEREDITO: ${falhas ? `⛔ ${falhas} falha(s)` : 'TELA CONFERE nos 3 idiomas'}`)
process.exit(falhas ? 1 : 0)
