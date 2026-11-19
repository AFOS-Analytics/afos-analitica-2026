/**
 * ATALHO do /atualizar-pesquisas-fra: o estado das pesquisas da França numa
 * chamada só. SÓ LEITURA: roda a coleta AO VIVO sem gravar e compara com o
 * último registro `fr-polls` do Neon (o que a tela mostra). Criado 09/Nov/2026.
 *
 *   npx tsx scripts/pesquisas-fra.ts          # precisa de .env.local (lê o Neon)
 *
 * Responde, antes de disparar o cron:
 *  1. a coleta ao vivo mudaria o registro? (assinatura igual = disparar não grava)
 *  1b. o que a ÚLTIMA gravação mudou na tela (19/Nov/2026): listas novas, que
 *     saíram e EDITADAS (mesmo pollId, conteúdo diferente), registro anterior →
 *     último. Sem ela, a rodada que chega depois do cron vê "entrariam 0";
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
 *     voto. Ver `pendentesPeloTexto`. Ficha do dia sem texto no índice: lê o
 *     PDF (19/Nov/2026), com controle positivo próprio.
 *  8. VALORES DA BASE NA FICHA (19/Nov/2026): cada porcentagem das listas da
 *     janela de 45 dias procurada no texto da ficha, e a lista inteira num
 *     mesmo bloco. Ver `valoresNaFicha`.
 *
 * ⛔ País fixo: França. Nada aqui grava no banco, nem lê o Brasil ou os EUA.
 *    O único arquivo escrito é o cache local `.cache/fr-fichas-texto.json`.
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

import { execFileSync } from 'node:child_process'
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
  // O registro ANTERIOR ao último (outro dia, porque o cron regrava o do mesmo
  // dia): a seção 1b diz o que a ÚLTIMA gravação mudou na tela. Sem isso, uma
  // rodada que chega depois do cron vê "entrariam 0" e não sabe o que entrou.
  const rAnt = r ? await prisma.analysisReport.findFirst({
    where: { slug: { startsWith: 'fr-polls-', not: r.slug } }, orderBy: { publishedAt: 'desc' },
    select: { slug: true, bodyMarkdown: true, publishedAt: true },
  }) : null
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

  const pub = (d: FrPollsData) => new Map(d.pesquisas.filter((p) => p.publicavel).map((p) => [p.pollId, p]))

  // ── 1b. O que a última gravação mudou (registro anterior → último) ─────────
  // Compara também o CONTEÚDO de cada lista que segue na tela: a base pode
  // editar uma lista antiga (candidato, porcentagem, campo, ficha) sem mudar
  // o pollId, e a comparação só por pollId deixaria isso passar calado.
  if (rAnt) {
    const A = JSON.parse(rAnt.bodyMarkdown) as FrPollsData
    const pa = pub(A), pu = pub(N)
    const novas = [...pu.values()].filter((p) => !pa.has(p.pollId))
    const saidas = [...pa.values()].filter((p) => !pu.has(p.pollId))
    const chave = (p: FrPesquisa) => JSON.stringify([p.campo, p.amostra, p.turno, p.hipotese, p.ficha.numero, p.instituto, p.cliente,
      [...p.intencoes].sort((x, y) => x.candidato.localeCompare(y.candidato)).map((i) => [i.candidato, i.pct])])
    const editadas = [...pu.values()].filter((p) => pa.has(p.pollId) && chave(p) !== chave(pa.get(p.pollId)!))
    console.log(`\n== DESDE O REGISTRO ANTERIOR (${rAnt.slug}, gravado ${rAnt.publishedAt?.toISOString()}): publicáveis ${pa.size} → ${pu.size} · novas ${novas.length} · saíram ${saidas.length} · editadas ${editadas.length}`)
    const porRod = (ps: FrPesquisa[]) => {
      const m = new Map<string, FrPesquisa[]>()
      for (const p of ps) m.set(rodadaDe(p.pollId), [...(m.get(rodadaDe(p.pollId)) ?? []), p])
      return m
    }
    for (const [rod, ps] of porRod(novas)) {
      const p = ps[0], t1 = ps.filter((x) => x.turno === 1).length
      console.log(`   + ${rod}: ${p.instituto}/${p.cliente} · campo ${p.campo.inicio}..${p.campo.fim} · n=${p.amostra ?? 'n/d'} · ficha ${p.ficha.numero} · ${t1} lista(s) de 1º turno, ${ps.length - t1} duelo(s)`)
    }
    for (const [rod, ps] of porRod(saidas)) console.log(`   - ${rod}: ${ps[0].instituto}/${ps[0].cliente} · ${ps.length} lista(s) SAÍRAM da tela`)
    for (const p of editadas) {
      const a = pa.get(p.pollId)!
      const ia = new Map(a.intencoes.map((i) => [i.candidato, i.pct])), iu = new Map(p.intencoes.map((i) => [i.candidato, i.pct]))
      const dif = [...new Set([...ia.keys(), ...iu.keys()])].filter((c) => ia.get(c) !== iu.get(c)).map((c) => `${c} ${ia.get(c) ?? '∅'}→${iu.get(c) ?? '∅'}`)
      const outros = (['campo', 'amostra', 'turno', 'hipotese', 'instituto', 'cliente'] as const).filter((k) => JSON.stringify(a[k]) !== JSON.stringify(p[k]))
      if (a.ficha.numero !== p.ficha.numero) outros.push('ficha' as never)
      const mostra = (k: string) => k === 'ficha' ? `ficha ${a.ficha.numero}→${p.ficha.numero}` : `${k} ${JSON.stringify(a[k as keyof FrPesquisa])}→${JSON.stringify(p[k as keyof FrPesquisa])}`
      console.log(`   ~ ${p.pollId} ${p.instituto}/${p.cliente}: ${[...dif, ...outros.map(mostra)].join(' · ')}`)
    }
  } else console.log('\n== DESDE O REGISTRO ANTERIOR: não há registro anterior no Neon')

  // ── 2. Entra / sai da tela ─────────────────────────────────────────────────
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
  await valoresNaFicha(V)

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
    const m = normalizaTexto(await t.text()).match(DETECTOR_IV)
    return (cache[caminho] = { arquivo: caminho, intencao: !!m, trecho: m?.[0] ?? '' })
  } catch (e) { return { erro: e instanceof Error ? e.message : String(e) } }
}

const normalizaTexto = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’`]/g, "'").replace(/\s+/g, ' ').toLowerCase()

/**
 * Ficha do DIA ainda sem texto no índice (19/Nov/2026): lê o PDF da própria
 * Commission com `pdftotext -layout` e roda o MESMO detector. Antes, a seção
 * só dizia "ler o PDF" e a leitura era à mão em toda rodada no dia da ficha.
 * Sem cache: quando o índice arquivar, a leitura passa a ser a do índice.
 * O caminho do PDF tem controle positivo próprio (uma ficha CITADA lida também
 * pelo PDF), porque o texto do pdftotext não é o texto do índice.
 */
async function lerPdf(caminho: string): Promise<Leitura> {
  const t = await textoDoPdf(caminho)
  if (typeof t !== 'string') return t
  const m = normalizaTexto(t).match(DETECTOR_IV)
  return { arquivo: caminho, intencao: !!m, trecho: m?.[0] ?? '' }
}

/** PDF da Commission → texto (`pdftotext -layout`), ou o motivo de não ter lido. */
async function textoDoPdf(caminho: string): Promise<string | { erro: string }> {
  try {
    const r = await fetch(`https://www.commission-des-sondages.fr/notices/files/notices/${caminho}.pdf`, { headers: { 'User-Agent': UA_FICHA }, signal: AbortSignal.timeout(30_000) })
    if (!r.ok) return { erro: `PDF HTTP ${r.status}` }
    const buf = Buffer.from(await r.arrayBuffer())
    if (buf.subarray(0, 5).toString('latin1') !== '%PDF-') return { erro: 'a resposta não é um PDF' }
    mkdirSync('.cache/fr-fichas-pdf', { recursive: true })
    const arq = `.cache/fr-fichas-pdf/${caminho.replace(/[^A-Za-z0-9._-]+/g, '_')}.pdf`
    writeFileSync(arq, buf)
    const texto = execFileSync('pdftotext', ['-layout', '-enc', 'UTF-8', arq, '-'], { encoding: 'utf8', timeout: 60_000, stdio: ['ignore', 'pipe', 'ignore'] })
    if (texto.replace(/\s/g, '').length < 200) return { erro: 'PDF sem camada de texto (imagem?): ler à mão' }
    return texto
  } catch (e) { return { erro: `pdftotext: ${e instanceof Error ? e.message.split('\n')[0] : String(e)}` } }
}

/** Ficha → texto inteiro: o do índice, ou o do PDF quando o índice ainda não arquivou. */
async function textoDaFicha(url: string): Promise<{ texto: string; origem: 'índice' | 'PDF'; caminho: string } | { erro: string }> {
  try {
    const r = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': UA_FICHA }, signal: AbortSignal.timeout(20_000) })
    const caminho = (r.headers.get('location') ?? '').match(/\/notices\/files\/notices\/(\d{4}\/[^/]+\/[^/]+)\.pdf$/i)?.[1]
    if (!caminho) return { erro: `a ficha não aponta para um PDF (HTTP ${r.status})` }
    const t = await fetch(URL_INDICE_TXT + caminho + '.txt', { signal: AbortSignal.timeout(20_000) })
    if (t.ok) return { texto: await t.text(), origem: 'índice', caminho }
    if (t.status !== 404) return { erro: `índice HTTP ${t.status}` }
    const p = await textoDoPdf(caminho)
    return typeof p === 'string' ? { texto: p, origem: 'PDF', caminho } : p
  } catch (e) { return { erro: e instanceof Error ? e.message : String(e) } }
}

type Conferencia = { valores: number; achados: number; convencao: number; emBloco: number; falhas: string[]; foraDoBloco: string[] }
const sobrenomeDe = (c: string) => semAcento(c).split(/\s+/).filter((w) => !['de', 'du', 'le', 'la'].includes(w)).slice(-1)[0] ?? ''
const numerosDa = (linha: string) => (linha.match(/\d+(?:[.,]\d+)?/g) ?? []).map((v) => Number(v.replace(',', '.')))
const ehConvencao = (pct: number, linhas: string[]) =>
  (pct === 0.5 && linhas.some((x) => /<\s*1\s*%?/.test(x))) || (pct === 0 && linhas.some((x) => /(^|\s)[-–]($|\s)/.test(x)))

/** As listas de uma ficha contra o texto dela: valor por linha do sobrenome, e a lista inteira num bloco. */
function conferirNoTexto(texto: string, ls: FrPesquisa[]): Conferencia {
  const linhas = semAcento(texto).split(/\r?\n/)
  const c: Conferencia = { valores: 0, achados: 0, convencao: 0, emBloco: 0, falhas: [], foraDoBloco: [] }
  for (const l of ls) {
    const ondeAcha: number[][] = []
    for (const it of l.intencoes) {
      c.valores++
      const s = sobrenomeDe(it.candidato)
      const idx = linhas.map((x, k) => (x.includes(s) ? k : -1)).filter((k) => k >= 0)
      const comValor = idx.filter((k) => numerosDa(linhas[k]).includes(it.pct))
      if (comValor.length) { c.achados++; ondeAcha.push(comValor) }
      else if (ehConvencao(it.pct, idx.map((k) => linhas[k]))) { c.convencao++; ondeAcha.push(idx) }
      else { c.falhas.push(`${l.pollId} ${it.candidato} ${it.pct}`); ondeAcha.push([]) }
    }
    // Bloco: uma janela de linhas que contém TODOS os candidatos da lista com o seu valor.
    const W = Math.max(25, Math.ceil(l.intencoes.length * 2.5))
    const inicios = new Set(ondeAcha.flat())
    if (ondeAcha.every((a) => a.length) && [...inicios].some((s0) => ondeAcha.every((a) => a.some((k) => k >= s0 && k < s0 + W)))) c.emBloco++
    else c.foraDoBloco.push(l.pollId)
  }
  return c
}

/**
 * 🔢 8. VALORES DA BASE CONFERIDOS NA FICHA (criado 19/Nov/2026).
 *
 * A coleta confere que a lista cita uma ficha que existe e é do mesmo
 * instituto; NUNCA conferiu as porcentagens. Aqui, para cada lista publicável
 * com campo nos últimos 45 dias, cada (sobrenome, porcentagem) da base é
 * procurado numa linha da ficha que traz o sobrenome; e a lista INTEIRA é
 * procurada num mesmo BLOCO de linhas (uma hipótese trocada com outra passaria
 * no teste por valor, porque os números das duas hipóteses estão na ficha).
 * Medido em 19/Nov/2026: 873 de 903 valores achados; os 30 restantes eram
 * convenção (a ficha escreve "<1%" e a base 0,5; a ficha "-" e a base 0) ou a
 * ficha da Odoxa 10310, que traz só o questionário, sem tabela de resultado.
 * O controle positivo é o próprio conjunto: se nenhuma lista for achada em
 * bloco, a seção diz CEGA em vez de "tudo confere".
 */
async function valoresNaFicha(V: FrPollsData) {
  const corte = new Date(agora.getTime() - 45 * 864e5).toISOString().slice(0, 10)
  const listas = V.pesquisas.filter((p) => p.publicavel && p.campo.fim >= corte && p.ficha.numero)
  const porFicha = new Map<string, FrPesquisa[]>()
  for (const l of listas) porFicha.set(l.ficha.numero!, [...(porFicha.get(l.ficha.numero!) ?? []), l])
  type Veredito = ({ num: string; rotulo: string; origem: string; listas: number } & Conferencia) | { num: string; rotulo: string; erro: string }
  const fila = [...porFicha.keys()].sort()
  const res: Veredito[] = []
  let i = 0
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (i < fila.length) {
      const num = fila[i++], ls = porFicha.get(num)!
      const rotulo = `${num} ${ls[0].instituto}/${ls[0].cliente}`
      const url = ls[0].ficha.url
      if (!url) { res.push({ num, rotulo, erro: 'lista sem URL de ficha' }); continue }
      const tx = await textoDaFicha(url)
      if ('erro' in tx) { res.push({ num, rotulo, erro: tx.erro }); continue }
      let c = conferirNoTexto(tx.texto, ls), origem: string = tx.origem
      // O texto do ÍNDICE pode desalinhar rótulo e linha da tabela (10318 OpinionWay,
      // hipótese 1: "Marine Le Pen 4%" e "Eric Zemmour 35%" no índice; o PDF lido
      // aqui traz Zemmour 4% e Le Pen 35%, como a base). Não fechou → refaz pelo PDF.
      if (tx.origem === 'índice' && c.achados > 0 && (c.falhas.length || c.foraDoBloco.length)) {
        const p = await textoDoPdf(tx.caminho)
        if (typeof p === 'string') {
          const cp = conferirNoTexto(p, ls)
          if (cp.falhas.length + cp.foraDoBloco.length < c.falhas.length + c.foraDoBloco.length) { c = cp; origem = 'PDF, o texto do índice não fechou' }
        }
      }
      res.push({ num, rotulo, origem, listas: ls.length, ...c })
    }
  }))
  res.sort((a, b) => a.num.localeCompare(b.num))

  // Ficha sem tabela legível (nenhum valor achado, ex.: Odoxa só com o questionário) não entra na conta.
  const lidas = res.filter((r): r is Extract<Veredito, { valores: number }> => 'valores' in r && r.achados > 0)
  const tot = lidas.reduce((s, r) => s + r.valores, 0), ach = lidas.reduce((s, r) => s + r.achados, 0)
  const conv = lidas.reduce((s, r) => s + r.convencao, 0)
  const blocoTot = lidas.reduce((s, r) => s + r.emBloco, 0), listasTot = lidas.reduce((s, r) => s + r.listas, 0)
  const semTabela = res.filter((r) => 'valores' in r && r.achados === 0).length
  console.log(`\n== VALORES DA BASE NA FICHA (listas publicáveis, campo nos últimos 45 dias), nas ${lidas.length} fichas com tabela legível: ${ach} de ${tot} valores achados, ${conv} por convenção ("<1%"→0,5, "-"→0) · ${blocoTot} de ${listasTot} listas inteiras num mesmo bloco` +
    (semTabela ? ` · ${semTabela} ficha(s) sem tabela, não conferíveis` : ''))
  if (!blocoTot) console.log('   ⛔ CONFERÊNCIA CEGA: nenhuma lista achada em bloco. O formato do texto mudou? NADA abaixo vale como "confere"')
  for (const r of res) {
    if ('erro' in r) { console.log(`   ⛔ ${r.rotulo}: não lida (${r.erro})`); continue }
    if (r.achados === 0) { console.log(`   · ${r.rotulo} (${r.origem}): ficha sem tabela de resultado legível, ${r.valores} valores NÃO conferíveis${blocoTot ? ' (não é divergência)' : ''}`); continue }
    const ok = r.falhas.length === 0 && r.emBloco === r.listas
    console.log(`   ${ok ? '✓' : '⚠️'} ${r.rotulo} (${r.origem}): ${r.achados + r.convencao}/${r.valores} valores · ${r.emBloco}/${r.listas} listas em bloco`)
    for (const f of r.falhas.slice(0, 10)) console.log(`      ↳ VALOR NÃO ACHADO NA FICHA: ${f} → conferir à mão; se a ficha diverge da base, registrar (não corrigir aqui)`)
    if (r.falhas.length === 0 && r.foraDoBloco.length) console.log(`      ↳ lista sem bloco único na ficha: ${r.foraDoBloco.join(" ")} (valores todos achados, mas espalhados: conferir se a hipótese é a mesma)`)
    if (r.falhas.length > 10) console.log(`      ↳ e mais ${r.falhas.length - 10}`)
  }
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

  // Sem texto no índice → PDF, com controle positivo do caminho do PDF numa citada.
  const viaPdf = new Set<string>()
  let controlePdf: { numero: string; leitura: Leitura } | null = null
  const semIndice = alvo.filter((f) => { const r = res.get(f.numero); return !!r && 'semTexto' in r })
  if (semIndice.length) {
    const citadaLida = controle.find((f) => { const r = res.get(f.numero); return !!r && 'intencao' in r })
    if (citadaLida) controlePdf = { numero: citadaLida.numero, leitura: await lerPdf((res.get(citadaLida.numero) as Lida).arquivo) }
    for (const f of semIndice) {
      const r = await lerPdf((res.get(f.numero) as { semTexto: string }).semTexto)
      if (!('erro' in r)) { res.set(f.numero, r); viaPdf.add(f.numero) }
      else res.set(f.numero, { semTexto: `${(res.get(f.numero) as { semTexto: string }).semTexto} (${r.erro})` })
    }
  }
  const pdfEnxerga = !!controlePdf && 'intencao' in controlePdf.leitura && controlePdf.leitura.intencao

  console.log(`\n== PENDENTES PELO TEXTO (fichas desde a ${piso} sem selo de intenção no rótulo e sem lista na base): ${alvo.length}`)
  const lidasControle = controle.map((f) => res.get(f.numero)).filter((r): r is Lida => !!r && 'intencao' in r)
  const acusadas = lidasControle.filter((r) => r.intencao).length
  if (!lidasControle.length) console.log('   ⚠️ controle positivo indisponível (nenhuma ficha citada com texto arquivado): a seção não sabe se enxerga')
  else console.log(`   controle positivo: ${acusadas} de ${lidasControle.length} fichas CITADAS acusadas (${controle.map((f) => f.numero).join(' ')})` +
    (acusadas === 0 ? '  ⛔ DETECTOR CEGO: o formato do texto mudou? NADA abaixo vale como "sem pendente"' : acusadas < lidasControle.length ? '  ⚠️ o detector perdeu uma citada: ler à mão as fichas abaixo' : ''))
  const de = (tipo: 'intencao' | 'semTexto' | 'erro') => alvo.filter((f) => { const r = res.get(f.numero); return !!r && tipo in r && (tipo !== 'intencao' || (r as Lida).intencao) })
  const achou = de('intencao'), semTexto = de('semTexto'), erro = de('erro')
  if (viaPdf.size) {
    const c = controlePdf?.leitura
    const veredito = !c ? 'indisponível (nenhuma citada lida)' : 'intencao' in c ? (c.intencao ? 'acusada' : 'NÃO acusada') : `não lida (${'erro' in c ? c.erro : c.semTexto})`
    console.log(`   controle do PDF: citada ${controlePdf?.numero ?? 'n/d'} lida pelo PDF → ${veredito}` +
      (pdfEnxerga ? '' : '  ⛔ o caminho do PDF está CEGO: as fichas lidas pelo PDF abaixo NÃO valem como "sem pendente", ler à mão'))
  }
  const origem = (n: string) => (viaPdf.has(n) ? ' [lida do PDF]' : '')
  for (const f of achou) console.log(`   ⚠️ INTENÇÃO DE VOTO NO TEXTO, sem selo no rótulo: ${f.rotulo} · ${f.url} · "${(res.get(f.numero) as Lida).trecho}"${origem(f.numero)} → pendente que o rótulo não acusa: listar ao André`)
  for (const f of semTexto) console.log(`   ⏳ texto ainda não arquivado no índice e PDF não lido, ler à mão: ${f.rotulo} · ${f.url} · ${(res.get(f.numero) as { semTexto: string }).semTexto}`)
  for (const f of erro) console.log(`   ⛔ não lida: ${f.rotulo} · ${(res.get(f.numero) as { erro: string }).erro}`)
  const lidas = alvo.length - semTexto.length - erro.length
  const lidasPdf = alvo.filter((f) => viaPdf.has(f.numero) && !(res.get(f.numero) as Lida).intencao)
  if (!achou.length) console.log(`   nenhuma das ${lidas} lidas traz a pergunta de intenção de voto` +
    (lidasPdf.length ? ` (${lidasPdf.length} pelo PDF: ${lidasPdf.map((f) => f.numero).join(' ')}${pdfEnxerga ? '' : ', SEM VALOR: controle do PDF falhou'})` : ''))
}

main().catch((e) => { console.error(e); process.exit(1) })
