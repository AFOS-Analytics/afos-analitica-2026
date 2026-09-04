/**
 * amplitude-do-dia.mjs — lê a série GRAVADA no backup do Neon e diz, por livro
 * do painel do Brasil, quanto ele percorreu no dia e com quanto dinheiro novo.
 *
 * É a ferramenta da régua do `/atualizar-brz` sobre livro bloqueado: sem ela, a
 * decisão de publicar ou não com a faixa ao lado vira palpite, e regra que
 * depende de um número que ninguém mede é regra que não roda.
 * → memory/feedback_regra_que_depende_de_numero_que_ninguem_grava.md
 *
 * ⚠️ Lê o BACKUP, não a API. A API trava em 90 dias, trunca sem avisar e o
 * `country=` casa por prefixo no Brasil, colando os três contratos presidenciais.
 * → memory/feedback_superlativo_se_confere_no_backup_nao_na_api.md
 *
 * Uso:
 *   node scripts/amplitude-do-dia.mjs                      # todos os livros, hoje
 *   node scripts/amplitude-do-dia.mjs --dia=2026-09-04
 *   node scripts/amplitude-do-dia.mjs --slug=any-brazil-stf-justice-removed-by-impeachment-before-2027
 *   node scripts/amplitude-do-dia.mjs --dias=6             # os N ultimos dias
 */

import { readFileSync, readdirSync, existsSync } from 'fs'
import { gunzipSync } from 'zlib'
import { join } from 'path'
import { pathToFileURL } from 'url'
import { faixaDoDia, vereditoBloqueio } from './lib/amplitude-livro.mjs'

const RAIZ = 'backup/neon'
const CAPTURA = '.cache/capture-guard/ultima-br.json'

function lerCsvGz(dir) {
  const caminho = join(RAIZ, dir)
  if (!existsSync(caminho)) return []
  const linhas = []
  for (const f of readdirSync(caminho).filter((x) => x.endsWith('.csv.gz'))) {
    const txt = gunzipSync(readFileSync(join(caminho, f))).toString('utf8')
    const [cab, ...resto] = txt.split(/\r?\n/).filter(Boolean)
    const cols = cab.split(',')
    for (const l of resto) {
      // CSV simples do backup: sem virgula dentro de campo nos que usamos aqui.
      const v = l.split(',')
      const o = {}
      cols.forEach((c, i) => (o[c] = v[i]))
      linhas.push(o)
    }
  }
  return linhas
}

function principal() {
  const dia = process.argv.find((a) => a.startsWith('--dia='))?.slice(6) ?? new Date().toISOString().slice(0, 10)
  const soSlug = process.argv.find((a) => a.startsWith('--slug='))?.slice(7)
  const nDias = Number(process.argv.find((a) => a.startsWith('--dias='))?.slice(7) ?? 1)

  const mercados = lerCsvGz('market')
  const saidas = lerCsvGz('marketOutcome')
  const precos = lerCsvGz('marketPrice')
  if (precos.length === 0) {
    console.error(`❌ nenhum ponto lido em ${RAIZ}/marketPrice. O backup existe e está descompactável?`)
    process.exit(1)
  }

  // Captura certificada, para a leitura de AGORA entrar na faixa.
  let agora = {}
  if (existsSync(CAPTURA)) {
    const snap = JSON.parse(readFileSync(CAPTURA, 'utf8'))
    for (const [k, v] of Object.entries(snap.precos ?? {})) agora[k.split(':').slice(1).join(':')] = v
  }

  const porMercado = new Map(mercados.map((m) => [m.id, m]))
  const outcomeDe = new Map(saidas.map((o) => [o.id, o]))

  const dias = []
  for (let i = 0; i < Math.max(1, nDias); i++) {
    const d = new Date(`${dia}T12:00:00Z`)
    d.setUTCDate(d.getUTCDate() - i)
    dias.push(d.toISOString().slice(0, 10))
  }

  const agrupado = new Map()
  for (const p of precos) {
    const o = outcomeDe.get(p.outcomeId)
    if (!o) continue
    const m = porMercado.get(o.marketId)
    if (!m) continue
    if (soSlug && m.slug !== soSlug) continue
    const d = String(p.snapshotAt).slice(0, 10)
    if (!dias.includes(d)) continue
    const chave = `${m.slug}␟${o.outcomeName}␟${d}`
    if (!agrupado.has(chave)) agrupado.set(chave, [])
    agrupado.get(chave).push({
      hora: String(p.snapshotAt).slice(11, 16),
      preco: Number(p.price),
      volume: Number(p.volume),
    })
  }

  if (agrupado.size === 0) {
    console.log(`\n(nenhum ponto gravado para ${dias.join(', ')}${soSlug ? ` no slug ${soSlug}` : ''})\n`)
    return
  }

  console.log(`\n📉 AMPLITUDE DO DIA, lida no backup em ${RAIZ}/marketPrice`)
  console.log(`   dias: ${dias.join(', ')}\n`)
  console.log('   dia         n   faixa gravada        ampl.   dinheiro novo   veredito')

  const chaves = [...agrupado.keys()].sort()
  for (const chave of chaves) {
    const [slug, nome, d] = chave.split('␟')
    const pontos = agrupado.get(chave).sort((a, b) => a.hora.localeCompare(b.hora))
    const f = faixaDoDia(pontos, agora[nome])
    const v = vereditoBloqueio(f)
    const dinheiro = f.dinheiroNovo == null ? '?' : `USD ${f.dinheiroNovo.toLocaleString('pt-BR')}`
    console.log(
      `   ${d}  ${String(f.n).padStart(2)}  ${f.min.toFixed(2).padStart(6)} a ${f.max.toFixed(2).padStart(6)}  ${String(f.amplitude).padStart(6)}pp  ${dinheiro.padStart(14)}   ${v.veredito}`
    )
    if (chaves.length <= 8) {
      console.log(`        ${nome.slice(0, 62)}  [${slug.slice(0, 46)}]`)
      console.log(`        ${v.motivo}`)
      if (f.agoraEsticouAFaixa) {
        console.log(`        ⚠️ a leitura certificada de AGORA ficou FORA da faixa gravada e a esticou. Publicar assim mostraria número fora da própria faixa.`)
      }
    }
  }

  console.log(
    `\n⚠️ A faixa é um PISO. O backup é gerado 1x por dia e a série cresce de 30 em 30 minutos,\n` +
      `   então entre o último ponto gravado e agora há até 24h sem medição. Escrever "nas leituras\n` +
      `   gravadas do dia variou de X a Y", nunca "percorreu de X a Y", que afirma extremos não medidos.\n`
  )
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) principal()
