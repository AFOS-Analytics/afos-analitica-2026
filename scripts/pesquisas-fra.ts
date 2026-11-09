/**
 * ATALHO do /atualizar-pesquisas-fra: o estado das pesquisas da França numa
 * chamada só. SÓ LEITURA: roda a coleta AO VIVO sem gravar e compara com o
 * último registro `fr-polls` do Neon (o que a tela mostra). Criado 09/Nov/2026.
 *
 *   npx tsx scripts/pesquisas-fra.ts          # precisa de .env.local (lê o Neon)
 *
 * Responde, antes de disparar o cron:
 *  1. a coleta ao vivo mudaria o registro? (assinatura igual = disparar não grava)
 *  2. que listas entrariam ou sairiam da tela;
 *  3. a tabela de `qualidade` inteira, com o que fazer em cada campo;
 *  4. por que cada lista ficou fora, agrupado por rodada;
 *  5. DIAGNÓSTICO DE RENUMERAÇÃO: quando a base cita a ficha N e a ficha N da
 *     listagem é de outro instituto, procura na listagem uma ficha com o MESMO
 *     nome de arquivo e outro número. Em 09/Nov/2026 foi o caso da Ifop/LCI:
 *     a Commission publicou o PDF como 10352 em 04/Nov e o republicou como
 *     10351 em 05/Nov; a base guardou o primeiro. O diagnóstico NÃO muda o que
 *     é publicável (regra do comando: registrar, não corrigir); só diz a causa.
 *  6. as fichas pendentes e a tela como está (lista principal e média).
 *
 * ⛔ País fixo: França. Nada aqui grava, nem lê o Brasil ou os EUA.
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

import { coletarPesquisasFr } from '../lib/fr-polls/collect.mjs'
import { listaPrincipalPorInstituto, mediaPorCandidato, rodadaDe, type FrPollsData, type FrPesquisa } from '../lib/fr/painel'

const agora = new Date()
const horas = (iso: string | Date) => ((agora.getTime() - new Date(iso).getTime()) / 36e5).toFixed(1) + 'h'
const semAcento = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
/** "10351 Pres IV IFOP LCI 3 novembre" ou "10352-pres-iv-ifop-lci-3-novembre.pdf" → "pres-iv-ifop-lci-3-novembre". */
const corpoDoNome = (s: string) => semAcento(s).replace(/\.pdf$/, '').replace(/^\d+[a-z]?[\s-]+/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const O_QUE_FAZER: Record<string, string> = {
  fichaDiverge: 'a base cita ficha de OUTRA pesquisa: fica fora, registrar, não corrigir à mão',
  fichaForaDaListagem: 'ficha antiga de outro tema da Commission (2024): normal',
  semNumero: 'a base não cita ficha (barômetros Odoxa): fica fora',
  institutoSemMapa: '⚠️ INSTITUTO NOVO: acrescentar ao mapa INSTITUTOS em lib/fr-polls/collect.mjs',
  somaForaDaFaixa: 'lista não soma 97 a 103: candidato faltando ou linha duplicada; fica fora',
  pendentes: 'ficha de intenção de voto ainda sem dado na base: listar ao André',
}

async function main() {
  console.log(`Pesquisas FRA · agora ${agora.toISOString()} · SÓ LEITURA`)
  const { getPrisma } = await import('../lib/db')
  const prisma = getPrisma()
  if (!prisma) throw new Error('SEM BANCO: DATABASE_URL ausente (copiar .env.local para o worktree)')
  const r = await prisma.analysisReport.findFirst({
    where: { slug: { startsWith: 'fr-polls-' } }, orderBy: { publishedAt: 'desc' },
    select: { slug: true, bodyMarkdown: true, publishedAt: true },
  })
  await prisma.$disconnect()
  if (!r) throw new Error('nenhum registro fr-polls no Neon')
  const N = JSON.parse(r.bodyMarkdown) as FrPollsData & { assinatura?: string; qualidade: Record<string, unknown> }

  const V = await coletarPesquisasFr({ agora }) as unknown as FrPollsData & {
    assinatura: string; qualidade: Record<string, unknown> & { falhas: string[] }
    divergencias: { pollId: string; instituto: string; fim: string; status: string; numero: string | null; motivo: string }[]
  }
  const fichasHtml = await (await fetch('https://www.commission-des-sondages.fr/notices/medias/fichiers/bytag/14/2027-Presidentielle', {
    headers: { 'User-Agent': 'AFOS-Analytics/1.0 (https://www.afos-analytics.com; pesquisa academica aberta)' }, signal: AbortSignal.timeout(20000),
  })).text()

  // ── 1. Mudaria? ────────────────────────────────────────────────────────────
  console.log(`\n== NEON: ${r.slug} gravado ${r.publishedAt?.toISOString()} (${r.publishedAt ? horas(r.publishedAt) : 'n/d'})`)
  if (V.qualidade.falhas.length) console.log(`   ⛔ coleta ao vivo com falha: ${V.qualidade.falhas.join(' | ')} (o cron falharia fechado, nada gravaria)`)
  const igual = N.assinatura === V.assinatura
  console.log(`   assinatura Neon ${N.assinatura} · ao vivo ${V.assinatura} → ${igual ? 'IGUAL: disparar o cron NÃO grava' : 'MUDOU: disparar o cron GRAVA conteúdo novo'}`)

  // ── 2. Entra / sai da tela ─────────────────────────────────────────────────
  const pub = (d: FrPollsData) => new Map(d.pesquisas.filter((p) => p.publicavel).map((p) => [p.pollId, p]))
  const pn = pub(N), pv = pub(V)
  const entra = [...pv.values()].filter((p) => !pn.has(p.pollId))
  const sai = [...pn.values()].filter((p) => !pv.has(p.pollId))
  console.log(`\n== TELA: publicáveis Neon ${pn.size} · ao vivo ${pv.size} · entrariam ${entra.length} · sairiam ${sai.length}`)
  const desc = (p: FrPesquisa) => `${p.pollId} ${p.instituto}/${p.cliente} campo ${p.campo.inicio}..${p.campo.fim} ficha ${p.ficha.numero} T${p.turno} ${p.hipotese ?? ''}`.trim()
  for (const p of entra) console.log(`   + ${desc(p)}`)
  for (const p of sai) console.log(`   - ${desc(p)}`)

  // ── 3. Qualidade ───────────────────────────────────────────────────────────
  console.log('\n== QUALIDADE (Neon → ao vivo)')
  for (const k of Object.keys(V.qualidade)) {
    if (k === 'falhas') continue
    const a = N.qualidade[k], b = V.qualidade[k]
    const nota = O_QUE_FAZER[k] && Number(b) > 0 ? `  · ${O_QUE_FAZER[k]}` : ''
    console.log(`   ${k.padEnd(20)} ${String(a).padStart(5)} → ${String(b).padStart(5)}${a !== b ? '  (mudou)' : ''}${nota}`)
  }

  // ── 4 e 5. Por que ficou fora, e renumeração ───────────────────────────────
  const fichas = [...fichasHtml.matchAll(/href="(\/notices\/medias\/fichiers\/add\/\d+)"[^>]*>\s*([^<]+?)\s*</g)]
    .map((m) => ({ rotulo: m[2].replace(/\s+/g, ' ').trim(), href: m[1] }))
  // O CSV cita o NOME DO ARQUIVO da ficha; a coleta guarda só o número. Lê de novo o CSV para o nome.
  const { lerCsv, URL_CSV } = await import('../lib/fr-polls/collect.mjs')
  const linhasCsv = lerCsv(await (await fetch(URL_CSV, { signal: AbortSignal.timeout(20000) })).text()) as { poll_id: string; filename: string }[]
  const arquivoDaBase = new Map(linhasCsv.filter((l) => l.poll_id).map((l) => [l.poll_id, l.filename]))
  const corte = new Date(agora.getTime() - 45 * 864e5).toISOString().slice(0, 10)
  const fora = V.pesquisas.filter((p) => !p.publicavel && p.campo.fim >= corte)
  console.log(`\n== FORA DA TELA com campo nos últimos 45 dias: ${fora.length} listas`)
  const porRodada = new Map<string, FrPesquisa[]>()
  for (const p of fora) porRodada.set(rodadaDe(p.pollId), [...(porRodada.get(rodadaDe(p.pollId)) ?? []), p])
  for (const [rod, ps] of porRodada) {
    const p = ps[0] as FrPesquisa & { ficha: { status: string; motivo?: string; numero: string | null }; somaConfere?: boolean; soma?: number }
    const porque = p.ficha.status !== 'confere' ? `${p.ficha.status}: ${p.ficha.motivo}` : `soma ${p.soma} fora de 97 a 103`
    console.log(`   ${rod} (${ps.length} lista${ps.length > 1 ? 's' : ''}) ${p.instituto}/${p.cliente} ${p.campo.inicio}..${p.campo.fim}: ${porque}`)
    if (p.ficha.status === 'diverge') {
      const arquivo = arquivoDaBase.get(p.pollId) ?? ''
      const corpo = corpoDoNome(arquivo)
      const mesmoNome = fichas.filter((f) => corpo && corpoDoNome(f.rotulo) === corpo)
      if (mesmoNome.length) {
        for (const f of mesmoNome) console.log(`      ↳ RENUMERAÇÃO: a base cita "${arquivo}"; a listagem tem o MESMO nome com outro número: "${f.rotulo}". A Commission republicou a ficha; a base guardou a versão antiga. Pedir à base, não corrigir aqui.`)
      } else console.log(`      ↳ sem ficha de mesmo nome na listagem (a base cita "${arquivo}")`)
    }
  }

  // ── 6. Pendentes e a tela ──────────────────────────────────────────────────
  console.log(`\n== PENDENTES (ficha oficial sem lista na base): ${V.pendentes.length}`)
  for (const f of V.pendentes) console.log(`   ⏳ ${f.rotulo} · ${f.url}`)

  console.log('\n== LISTA PRINCIPAL POR INSTITUTO (como a tela vai mostrar com a coleta ao vivo)')
  for (const l of listaPrincipalPorInstituto(V.pesquisas, agora)) {
    console.log(`   ${l.instituto}/${l.cliente} · campo ${l.campo.inicio}..${l.campo.fim} · n=${l.amostra} · ficha ${l.ficha.numero} · ${l.listasNaRodada} lista(s) na rodada`)
    console.log('      ' + l.intencoes.slice(0, 6).map((i) => `${i.candidato} ${i.pct}`).join(' · '))
  }
  console.log('\n== MÉDIA POR CANDIDATO (30 dias, como a tela)')
  for (const m of mediaPorCandidato(V.pesquisas, agora).slice(0, 10)) {
    console.log(`   ${m.candidato.padEnd(22)} ${m.media.toFixed(1)} (${m.listas} listas, ${m.institutos} institutos, ${m.minimo} a ${m.maximo})`)
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
