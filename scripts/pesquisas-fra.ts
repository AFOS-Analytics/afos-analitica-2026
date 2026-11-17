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
 *  6. as fichas pendentes e a tela como está (lista principal e média);
 *  7. PENDENTES PELO TEXTO (17/Nov/2026): fichas recentes SEM selo de intenção
 *     no rótulo e sem lista na base cuja ficha traz a PERGUNTA de intenção de
 *     voto. Ver `pendentesPeloTexto`.
 *
 * ⛔ País fixo: França. Nada aqui grava no banco, nem lê o Brasil ou os EUA.
 *    O único arquivo escrito é o cache local `.cache/fr-fichas-texto.json`.
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { coletarPesquisasFr, baixar, lerListagem, URL_LISTAGEM } from '../lib/fr-polls/collect.mjs'
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
  // `baixar` LANÇA em status fora de 2xx. Antes, uma página de erro (403, 503)
  // virava HTML sem fichas, e a seção 4 dava para cada 'diverge' o laudo falso
  // "sem ficha de mesmo nome na listagem".
  const fichasHtml = await (baixar(URL_LISTAGEM) as Promise<string>).catch((e: unknown) => {
    throw new Error(`listagem da Commission não pôde ser relida (${e instanceof Error ? e.message : String(e)}); diagnóstico abortado, nada concluído sobre renumeração`)
  })

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
  const csvTexto = await (baixar(URL_CSV) as Promise<string>).catch((e: unknown) => {
    throw new Error(`CSV da MieuxVoter não pôde ser relido (${e instanceof Error ? e.message : String(e)}); diagnóstico abortado`)
  })
  const linhasCsv = lerCsv(csvTexto) as { poll_id: string; filename: string }[]
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
  await pendentesPeloTexto(V, fichasHtml)

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

/**
 * 🔎 7. PENDENTES QUE O RÓTULO NÃO ACUSA (criado 17/Nov/2026).
 *
 * `pendentes` da coleta só lê o RÓTULO da ficha (IV, Présitrack, baromètre
 * élection). Medido em 17/Nov/2026 nas fichas de setembro a novembro: 6 das 26
 * fichas de intenção de voto NÃO têm selo no rótulo (10262 enquête électorale
 * Ipsos BVA, 10264 OpinionWay, 10277 Toluna Harris, 10292 Ifop vote blanc,
 * 10314 Ifop climat politique, 10325 Cluster17 focus droite et centre). A base
 * já tinha as seis; se atrasasse, o atalho diria "nada pendente" com pesquisa
 * nova publicada.
 *
 * Aqui se lê o TEXTO de cada ficha recente sem selo e sem lista na base, no
 * índice MieuxVoter/sondages-commission-index (arquiva o texto 1x por dia), e
 * se procura a PERGUNTA de intenção de voto. Medido nas 114 fichas arquivadas
 * de set-nov/2026: acusou 26 de 26 citadas pela base e, das 88 não citadas, só
 * as 2 pendentes reais (10375 Elabe, 10372 Présitrack). ⛔ "pour lequel des
 * candidats" NÃO entra no detector: é a pergunta do voto de 2022 que toda
 * ficha da CSA traz (20 falsos positivos na primeira medição).
 *
 * 🧪 Controle positivo: o mesmo detector roda em fichas CITADAS da mesma
 * janela. Se não acusar nenhuma, a seção diz que está CEGA em vez de "nada".
 */
const DETECTOR_IV = /plus de chances? que vous votiez|exprime(?:e|es)? une intention de vote|intentions? de vote (?:au|du|pour le) (?:premier|1er) tour|intentions? de vote (?:a|pour) l'election presidentielle(?: de)? 2027|questions d'intentions? de vote/
const URL_INDICE_TXT = 'https://raw.githubusercontent.com/MieuxVoter/sondages-commission-index/main/archives_txt/'
const CACHE_TEXTO = '.cache/fr-fichas-texto.json'
const UA_FICHA = 'AFOS-Analytics/1.0 (https://www.afos-analytics.com; pesquisa academica aberta)'
type Lida = { arquivo: string; intencao: boolean; trecho: string }
type Leitura = Lida | { semTexto: string } | { erro: string }

/**
 * Ficha → texto arquivado → detector. O cache é por ARQUIVO (a Commission já trocou o PDF de número uma vez).
 * O CONTROLE lê sem cache: lido do cache, ele passaria com o detector quebrado.
 */
async function lerFicha(url: string, cache: Record<string, Lida>, usarCache = true): Promise<Leitura> {
  try {
    const r = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': UA_FICHA }, signal: AbortSignal.timeout(20_000) })
    const caminho = (r.headers.get('location') ?? '').match(/\/notices\/files\/notices\/(\d{4}\/[^/]+\/[^/]+)\.pdf$/i)?.[1]
    if (!caminho) return { erro: `a ficha não aponta para um PDF (HTTP ${r.status})` }
    if (usarCache && cache[caminho]) return cache[caminho]
    const t = await fetch(URL_INDICE_TXT + caminho + '.txt', { signal: AbortSignal.timeout(20_000) })
    if (t.status === 404) return { semTexto: caminho }
    if (!t.ok) return { erro: `índice HTTP ${t.status}` }
    const texto = (await t.text()).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’`]/g, "'").replace(/\s+/g, ' ').toLowerCase()
    const m = texto.match(DETECTOR_IV)
    return (cache[caminho] = { arquivo: caminho, intencao: !!m, trecho: m?.[0] ?? '' })
  } catch (e) { return { erro: e instanceof Error ? e.message : String(e) } }
}

async function pendentesPeloTexto(V: FrPollsData, fichasHtml: string) {
  const fichas = lerListagem(fichasHtml) as { numero: string; rotulo: string; url: string; intencao: boolean }[]
  const citadas = new Set(V.pesquisas.map((p) => p.ficha.numero).filter((n): n is string => !!n))
  // MESMO universo de `pendentes` na coleta: ficha acima da menor citada por lista com campo nos últimos 45 dias.
  const limite = new Date(agora.getTime() - 45 * 864e5).toISOString().slice(0, 10)
  const recentes = V.pesquisas.filter((p) => p.campo.fim >= limite && p.ficha.numero)
  const piso = recentes.length ? Math.min(...recentes.map((p) => parseInt(p.ficha.numero as string, 10))) : Infinity
  const naJanela = fichas.filter((f) => parseInt(f.numero, 10) >= piso)
  const alvo = naJanela.filter((f) => !f.intencao && !citadas.has(f.numero))
  // Controle: até 3 fichas CITADAS da janela, as sem selo primeiro (o caso difícil).
  const controle = [...naJanela.filter((f) => citadas.has(f.numero) && !f.intencao), ...naJanela.filter((f) => citadas.has(f.numero) && f.intencao)].slice(0, 3)

  // O cache leva o detector junto: detector mudado (ou mutado num teste) descarta os vereditos velhos.
  let cache: Record<string, Lida> = {}
  try {
    const c = JSON.parse(readFileSync(CACHE_TEXTO, 'utf8')) as { detector?: string; fichas?: Record<string, Lida> }
    if (c.detector === DETECTOR_IV.source && c.fichas) cache = c.fichas
  } catch { /* primeira rodada */ }
  const fila = [...controle, ...alvo]
  const res = new Map<string, Leitura>()
  let i = 0
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (i < fila.length) { const f = fila[i++]; res.set(f.numero, await lerFicha(f.url, cache, !controle.includes(f))) }
  }))
  try { mkdirSync('.cache', { recursive: true }); writeFileSync(CACHE_TEXTO, JSON.stringify({ detector: DETECTOR_IV.source, fichas: cache }, null, 1)) } catch { /* cache é conveniência */ }

  console.log(`\n== PENDENTES PELO TEXTO (fichas desde a ${piso} sem selo de intenção no rótulo e sem lista na base): ${alvo.length}`)
  const lidasControle = controle.map((f) => res.get(f.numero)).filter((r): r is Lida => !!r && 'intencao' in r)
  const acusadas = lidasControle.filter((r) => r.intencao).length
  if (!lidasControle.length) console.log('   ⚠️ controle positivo indisponível (nenhuma ficha citada com texto arquivado): a seção não sabe se enxerga')
  else console.log(`   controle positivo: ${acusadas} de ${lidasControle.length} fichas CITADAS acusadas (${controle.map((f) => f.numero).join(' ')})` +
    (acusadas === 0 ? '  ⛔ DETECTOR CEGO: o formato do texto mudou? NADA abaixo vale como "sem pendente"' : acusadas < lidasControle.length ? '  ⚠️ o detector perdeu uma citada: ler à mão as fichas abaixo' : ''))
  const de = (tipo: 'intencao' | 'semTexto' | 'erro') => alvo.filter((f) => { const r = res.get(f.numero); return !!r && tipo in r && (tipo !== 'intencao' || (r as Lida).intencao) })
  const achou = de('intencao'), semTexto = de('semTexto'), erro = de('erro')
  for (const f of achou) console.log(`   ⚠️ INTENÇÃO DE VOTO NO TEXTO, sem selo no rótulo: ${f.rotulo} · ${f.url} · "${(res.get(f.numero) as Lida).trecho}" → pendente que o rótulo não acusa: listar ao André`)
  for (const f of semTexto) console.log(`   ⏳ texto ainda não arquivado no índice (roda 1x por dia), ler o PDF: ${f.rotulo} · ${f.url}`)
  for (const f of erro) console.log(`   ⛔ não lida: ${f.rotulo} · ${(res.get(f.numero) as { erro: string }).erro}`)
  const lidas = alvo.length - semTexto.length - erro.length
  if (!achou.length) console.log(`   nenhuma das ${lidas} lidas traz a pergunta de intenção de voto`)
}

main().catch((e) => { console.error(e); process.exit(1) })
