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
 *  5b. PRIMÁRIA (19/Nov/2026): lista da base que cita ficha de primária
 *     (rótulo "primaire"). A coleta já tira da tela lista sem a forma da
 *     presidencial (`formaDaLista`); esta seção pega a que tem a forma;
 *  6. as fichas pendentes e a tela como está (lista principal e média);
 *  7. PENDENTES PELO TEXTO (17/Nov/2026): fichas recentes SEM selo de intenção
 *     no rótulo e sem lista na base cuja ficha traz a PERGUNTA de intenção de
 *     voto. Ver `pendentesPeloTexto`. Ficha do dia sem texto no índice: lê o
 *     PDF (19/Nov/2026), com controle positivo próprio. Pergunta que é toda
 *     sobre uma PRIMÁRIA sai com selo próprio (19/Nov/2026, `detectar`).
 *  8. VALORES DA BASE NA FICHA (19/Nov/2026): cada porcentagem das listas da
 *     janela de 45 dias procurada no texto da ficha, e a lista inteira num
 *     mesmo bloco. Ver `valoresNaFicha`.
 *  9. A JANELA ANDA SEM PESQUISA NOVA (21/Nov/2026): o que saiu da média e das
 *     contagens desde o dia do texto do painel e o que sai nos próximos 7 dias,
 *     com as funções da tela. Ver `aJanelaAnda`.
 * 10. PUBLICADA SEM FICHA (22/Nov/2026): pesquisa que já está na imprensa (pela
 *     Wikipedia EN e FR, só como detector) e ainda não tem ficha na Commission
 *     nem lista na base. Ver `publicadaSemFicha`.
 * 11. RECURSO DO CAMPO (23/Nov/2026): ficha cujo texto não dá o campo (Harris)
 *     se relê em ordem de leitura, com controle positivo nas citadas; e "campo
 *     não lido" deixou de virar "OUTRO campo" na seção 10 (a amostra casa, ou
 *     sai "PODE SER ELA"). Ver `extrairComRecurso`.
 *
 * ⛔ País fixo: França. Nada aqui grava no banco, nem lê o Brasil ou os EUA.
 *    O único arquivo escrito é o cache local `.cache/fr-fichas-texto.json`.
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { coletarPesquisasFr, baixar, lerListagem, formaDaLista, URL_LISTAGEM } from '../lib/fr-polls/collect.mjs'
import { listaPrincipalPorInstituto, mediaPorCandidato, duelosSegundoTurno, rodadaDe, type FrPollsData, type FrPesquisa, type MediaCandidato } from '../lib/fr/painel'
import { estatisticasPorCandidato, type EstatCandidato } from '../lib/fr/candidatos'

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
  listaForaDaForma: '⚠️ lista sem a forma da presidencial (turno desconhecido, 1º turno com menos de 6 nomes, duelo sem 2): fica fora; ver FORA DA TELA e PRIMÁRIA',
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
  // Seção 9: o registro que a tela mostrava no dia do texto do painel.
  const txt = JSON.parse(readFileSync('public/fr/analise.pt-BR.json', 'utf8')) as { updatedAt: string; paragrafos: string[] }
  const rTexto = await prisma.analysisReport.findFirst({
    where: { slug: { startsWith: 'fr-polls-' }, publishedAt: { lte: new Date(`${txt.updatedAt.slice(0, 10)}T23:59:59.999Z`) } }, orderBy: { publishedAt: 'desc' },
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
    // Pendentes também mudam a assinatura: em 20/Nov/2026 o registro novo veio
    // só pela 10392, e a linha dizia "novas 0 · saíram 0 · editadas 0" sem
    // dizer por que houve gravação.
    const numsA = new Set((A.pendentes ?? []).map((f) => f.numero)), numsU = new Set((N.pendentes ?? []).map((f) => f.numero))
    const pendDif = [...[...numsU].filter((n) => !numsA.has(n)).map((n) => `+${n}`), ...[...numsA].filter((n) => !numsU.has(n)).map((n) => `-${n}`)]
    console.log(`\n== DESDE O REGISTRO ANTERIOR (${rAnt.slug}, gravado ${rAnt.publishedAt?.toISOString()}): publicáveis ${pa.size} → ${pu.size} · novas ${novas.length} · saíram ${saidas.length} · editadas ${editadas.length} · pendentes ${numsA.size} → ${numsU.size}${pendDif.length ? ` (${pendDif.join(' ')})` : ''}`)
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
    const mudou = a === undefined ? '  (campo novo, o registro do Neon não o tem)' : a !== b ? '  (mudou)' : ''
    console.log(`   ${k.padEnd(20)} ${String(a ?? '—').padStart(5)} → ${String(b).padStart(5)}${mudou}${nota}`)
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
    const forma = formaDaLista(p)
    const porque = [
      p.ficha.status !== 'confere' ? `${p.ficha.status}: ${p.ficha.motivo}` : '',
      p.somaConfere === false ? `soma ${p.soma} fora de 97 a 103` : '',
      forma ? `forma: ${forma}` : '',
    ].filter(Boolean).join(' · ') || 'motivo não identificado (conferir à mão)'
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

  // ── 5b. Primária (19/Nov/2026) ─────────────────────────────────────────────
  // A trava de forma (`formaDaLista`) segura lista curta; uma primária com 6 ou
  // mais nomes passaria por ela. Aqui, pelo RÓTULO: lista da base que cita
  // ficha de primária ("primaire", fora "post primaire", que na 10314 é a
  // presidencial depois da primária). Contar as fichas de primária da listagem
  // é o controle: com zero, o filtro não foi exercitado.
  const ehPrimaria = (r: string) => /primaire/i.test(r) && !/post.?primaire/i.test(r)
  const fichasPrim = (lerListagem(fichasHtml) as { numero: string; rotulo: string }[]).filter((f) => ehPrimaria(f.rotulo))
  const numsPrim = new Set(fichasPrim.map((f) => f.numero))
  const citaPrim = V.pesquisas.filter((p) => p.ficha.numero && numsPrim.has(p.ficha.numero))
  const pubPrim = citaPrim.filter((p) => p.publicavel)
  console.log(`\n== PRIMÁRIA: ${fichasPrim.length} ficha(s) de primária na listagem${fichasPrim.length ? ` (${fichasPrim.map((f) => f.numero).join(' ')})` : ', o filtro NÃO foi exercitado'} · listas da base citando uma delas: ${pubPrim.length} publicável(is), ${citaPrim.length - pubPrim.length} fora`)
  for (const p of pubPrim) console.log(`   ⚠️ PUBLICÁVEL citando ficha de primária: ${p.pollId} ${p.instituto}/${p.cliente} ficha ${p.ficha.numero} T${p.turno} ${p.intencoes.length} nomes → conferir no PDF se a lista é da PRESIDENCIAL; se for da primária, ela está na tela: avisar o André`)

  // ── 6. Pendentes e a tela ──────────────────────────────────────────────────
  console.log(`\n== PENDENTES (ficha oficial sem lista na base): ${V.pendentes.length}`)
  for (const f of V.pendentes) console.log(`   ⏳ ${f.rotulo} · ${f.url}`)
  await oQueAPendenteDiz(V)
  await pendentesPeloTexto(V, fichasHtml)
  await publicadaSemFicha(V)
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
  aJanelaAnda(V, txt, rTexto)
}

/**
 * 🗓️ 9. A JANELA ANDA SEM PESQUISA NOVA (criado 21/Nov/2026).
 *
 * A média da tela é de 30 dias; listas principais, 1º lugar, top-2 e duelos são
 * de 45. Os dois cortes saem da data UTC de AGORA (`recentes` em
 * lib/fr/painel.ts), então à meia-noite UTC uma rodada antiga sai da tela sem
 * pesquisa nova nenhuma, e o texto do painel envelhece calado. Em 21/Nov/2026 o
 * texto de 20/11 dizia "18,1 de média em 47 listas de 7 institutos" para
 * Mélenchon e a tela já contava 42 listas. O medidor do texto (`medidas-fra.ts`)
 * só roda no /atualizar-fra; aqui, a cada rodada de pesquisas:
 *  (a) DESDE O TEXTO: o registro `fr-polls` que a tela mostrava no dia do texto
 *      (`updatedAt` de analise.pt-BR.json, estado do dia UTC), contra a tela de
 *      agora. Mostra o que saiu pela janela e o que entrou por pesquisa nova;
 *  (b) PRÓXIMOS 7 DIAS, com os dados de agora e sem pesquisa nova: em que
 *      meia-noite UTC cada rodada sai e o que muda na média e nas contagens.
 * `[no texto]` = o valor que deixa de valer está entre os números do texto
 * publicado (pode ser coincidência; conferir a frase).
 * 🧪 Dois controles. (1) As listas que a simulação tira em cada dia têm de ser
 * as que a conta direta tira (fim do campo + 31 dias na média, + 46 nas
 * contagens). (2) Coerência com a tela: por candidato, as listas e os duelos da
 * janela daqui têm de ser os que `mediaPorCandidato` e
 * `estatisticasPorCandidato` contam. Se um falhar, a seção sai SEM VALOR.
 * Mutação conferida: corte da média em 31 dias aqui dá NÃO CONFERE nos dois.
 * A tela é ISR de 30 min: a mudança aparece até meia hora depois da meia-noite.
 */
const DIA = 864e5
const corteEm = (d: Date, dias: number) => new Date(d.getTime() - dias * DIA).toISOString().slice(0, 10)
const maisDias = (iso: string, n: number) => new Date(new Date(`${iso}T00:00:00Z`).getTime() + n * DIA).toISOString().slice(0, 10)
const chaveInst = (p: { instituto: string }) => p.instituto.trim().toLowerCase()
const nPt = (v: number) => String(v).replace('.', ',')
const SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
interface Estado {
  media: Map<string, MediaCandidato>; est: Map<string, EstatCandidato>; faixa: Map<string, [number, number]>
  r30: Map<string, FrPesquisa[]>; r45: Map<string, FrPesquisa[]>; ids30: Set<string>; ids45: Set<string>
  rodadas30: number; inst30: number; l45: number; inst45: number; d45: number; principais: Set<string>; duelosTela: number
  /** a janela daqui conta, por candidato, as mesmas listas e duelos que as funções da tela */
  coerente: boolean
}
function estadoEm(pesquisas: readonly FrPesquisa[], d: Date): Estado {
  const pub = pesquisas.filter((p) => p.publicavel)
  const c30 = corteEm(d, 30), c45 = corteEm(d, 45)
  const agrupa = (ps: FrPesquisa[]) => {
    const m = new Map<string, FrPesquisa[]>()
    for (const p of ps) m.set(rodadaDe(p.pollId), [...(m.get(rodadaDe(p.pollId)) ?? []), p])
    return m
  }
  const l30 = pub.filter((p) => p.turno === 1 && p.campo.fim >= c30)
  const j45 = pub.filter((p) => p.campo.fim >= c45)
  const l45 = j45.filter((p) => p.turno === 1)
  const d45 = j45.filter((p) => p.turno === 2 && p.intencoes.length === 2)
  const faixa = new Map<string, [number, number]>()
  for (const p of l45) for (const i of p.intencoes) {
    const f = faixa.get(i.candidato)
    faixa.set(i.candidato, f ? [Math.min(f[0], i.pct), Math.max(f[1], i.pct)] : [i.pct, i.pct])
  }
  const media = new Map(mediaPorCandidato(pesquisas, d, 30).map((m) => [m.candidato, m]))
  const est = new Map(estatisticasPorCandidato(pesquisas, d, 45).map((e) => [e.candidato, e]))
  // Coerência com a TELA: os cortes daqui são uma cópia dos de `recentes`; se a
  // tela mudar o corte, a contagem por candidato deixa de bater e a seção acusa.
  const conta = (ps: FrPesquisa[]) => { const m = new Map<string, number>(); for (const p of ps) for (const i of p.intencoes) m.set(i.candidato, (m.get(i.candidato) ?? 0) + 1); return m }
  const bate = (x: Map<string, number>, y: Map<string, number>) => x.size === y.size && [...x].every(([c, n]) => y.get(c) === n)
  const coerente = bate(conta(l30), new Map([...media].map(([c, m]) => [c, m.listas])))
    && bate(conta(l45), new Map([...est].filter(([, e]) => e.listas > 0).map(([c, e]) => [c, e.listas])))
    && bate(conta(d45), new Map([...est].filter(([, e]) => e.duelos > 0).map(([c, e]) => [c, e.duelos])))
  return {
    media, est, coerente,
    faixa, r30: agrupa(l30), r45: agrupa(j45),
    ids30: new Set(l30.map((p) => p.pollId)), ids45: new Set(j45.map((p) => p.pollId)),
    rodadas30: agrupa(l30).size, inst30: new Set(l30.map(chaveInst)).size,
    l45: l45.length, inst45: new Set(l45.map(chaveInst)).size, d45: d45.length,
    principais: new Set(listaPrincipalPorInstituto(pesquisas, d, 45).map(chaveInst)),
    duelosTela: duelosSegundoTurno(pesquisas, d, 45).length,
  }
}
/** O que muda de `a` para `b`: rodadas que saem/entram, totais e, por candidato, cada contagem. */
function mudancas(a: Estado, b: Estado, noTexto: Set<string>): string[] {
  const marca = (velho: string) => (noTexto.has(velho) ? ' [no texto]' : '')
  const rod = (ps: FrPesquisa[]) => {
    const t1 = ps.filter((p) => p.turno === 1).length, t2 = ps.length - t1
    return `${ps[0].instituto}/${ps[0].cliente} (campo até ${ps[0].campo.fim}, ficha ${ps[0].ficha.numero}, ${t1} lista(s)${t2 ? `, ${t2} duelo(s)` : ''})`
  }
  const dif = (x: Map<string, FrPesquisa[]>, y: Map<string, FrPesquisa[]>) => [...x].filter(([k]) => !y.has(k)).map(([, ps]) => rod(ps))
  const out: string[] = []
  const s30 = dif(a.r30, b.r30), s45 = dif(a.r45, b.r45), e30 = dif(b.r30, a.r30), e45 = dif(b.r45, a.r45)
  if (s30.length) out.push(`sai da média de 30 dias: ${s30.join(' · ')}`)
  if (s45.length) out.push(`sai das contagens de 45 dias: ${s45.join(' · ')}`)
  if (e30.length || e45.length) out.push(`entrou por pesquisa nova: ${[...new Set([...e45, ...e30])].join(' · ')}`)
  for (const k of a.principais) if (!b.principais.has(k)) out.push(`↳ a lista principal de "${k}" SAI da tela (nenhuma rodada dele em 45 dias)`)
  for (const k of b.principais) if (!a.principais.has(k)) out.push(`↳ a lista principal de "${k}" ENTRA na tela`)
  const tot: string[] = []
  const t = (rot: string, x: number, y: number) => { if (x !== y) tot.push(`${rot} ${x}→${y}${marca(nPt(x))}`) }
  t('rodadas na média', a.rodadas30, b.rodadas30); t('institutos na média', a.inst30, b.inst30)
  t('listas de 1º turno em 45 dias', a.l45, b.l45); t('institutos em 45 dias', a.inst45, b.inst45)
  t('duelos em 45 dias', a.d45, b.d45); t('listas principais', a.principais.size, b.principais.size); t('duelos na tela', a.duelosTela, b.duelosTela)
  if (tot.length) out.push(`totais: ${tot.join(' · ')}`)
  const topo = (e: Estado) => [...e.media.values()].slice(0, 12).map((m) => m.candidato)
  for (const c of [...new Set([...topo(a), ...topo(b)])]) {
    const ma = a.media.get(c), mb = b.media.get(c), ea = a.est.get(c), eb = b.est.get(c), fa = a.faixa.get(c), fb = b.faixa.get(c)
    const campos: string[] = []
    const p = (rot: string, x: string, y: string) => { if (x !== y) campos.push(`${rot} ${x}→${y}${marca(x)}`) }
    p('média', ma ? ma.media.toFixed(1).replace('.', ',') : 'sem lista', mb ? mb.media.toFixed(1).replace('.', ',') : 'sem lista')
    p('listas 30d', nPt(ma?.listas ?? 0), nPt(mb?.listas ?? 0)); p('inst. 30d', nPt(ma?.institutos ?? 0), nPt(mb?.institutos ?? 0))
    p('mín 30d', ma ? nPt(ma.minimo) : '-', mb ? nPt(mb.minimo) : '-'); p('máx 30d', ma ? nPt(ma.maximo) : '-', mb ? nPt(mb.maximo) : '-')
    p('listas 45d', nPt(ea?.listas ?? 0), nPt(eb?.listas ?? 0)); p('1º lugar', nPt(ea?.primeiro ?? 0), nPt(eb?.primeiro ?? 0)); p('top-2', nPt(ea?.top2 ?? 0), nPt(eb?.top2 ?? 0))
    p('mín 45d', fa ? nPt(fa[0]) : '-', fb ? nPt(fb[0]) : '-'); p('máx 45d', fa ? nPt(fa[1]) : '-', fb ? nPt(fb[1]) : '-')
    p('duelos', nPt(ea?.duelos ?? 0), nPt(eb?.duelos ?? 0)); p('duelos vencidos', nPt(ea?.duelosVencidos ?? 0), nPt(eb?.duelosVencidos ?? 0))
    if (campos.length) out.push(`${c}: ${campos.join(' · ')}`)
  }
  return out
}
/**
 * 🧭 O texto diário do painel SAIU DA TELA em 23/Nov/2026 (decisão do André: no
 * topo, os cartões das edições e um cartão de apresentação sem número). Sem
 * texto na tela, (a) "desde o texto" e a marca `[no texto]` só dariam alarme
 * falso de "texto velho". Ficam desligados; (b) continua, porque diz o que a
 * janela muda na TELA no dia da Weekly (segunda) e do Tradeoff (quinta).
 * Voltar o texto à tela = `true` aqui e `FrAnaliseSection` no FrDashboardClient.
 */
const TEXTO_DO_PAINEL_NA_TELA = false

function aJanelaAnda(V: FrPollsData, txt: { updatedAt: string; paragrafos: string[] }, rTexto: { slug: string; bodyMarkdown: string; publishedAt: Date | null } | null) {
  const noTexto = TEXTO_DO_PAINEL_NA_TELA ? new Set(txt.paragrafos.join(' ').replace(/\d+[ºª]/g, '').match(/\d+(?:,\d+)?/g) ?? []) : new Set<string>()
  const agoraEst = estadoEm(V.pesquisas, agora)
  let coerente = agoraEst.coerente
  console.log('\n== A JANELA ANDA SEM PESQUISA NOVA (cortes da tela: média 30 dias, contagens 45 dias, pela data UTC; a tela muda até 30 min depois da meia-noite UTC)')

  // (a) desde o texto
  if (!TEXTO_DO_PAINEL_NA_TELA) {
    console.log('   DESDE O TEXTO DO PAINEL: o texto diário saiu da tela em 23/11/2026 (decisão do André); nada a reescrever. O que mudou desde o registro anterior está na seção DESDE O REGISTRO ANTERIOR.')
  } else {
  const diaTexto = txt.updatedAt.slice(0, 10)
  const D = rTexto ? (JSON.parse(rTexto.bodyMarkdown) as FrPollsData) : V
  const doTexto = estadoEm(D.pesquisas, new Date(`${diaTexto}T12:00:00Z`))
  coerente &&= doTexto.coerente
  const linhasTexto = mudancas(doTexto, agoraEst, noTexto)
  console.log(`   DESDE O TEXTO DO PAINEL (analise.pt-BR.json de ${diaTexto}; tela daquele dia = ${rTexto ? `${rTexto.slug}, gravado ${rTexto.publishedAt?.toISOString()}` : 'SEM registro do dia no Neon, refeita com os dados de agora'}):` +
    (linhasTexto.length ? '' : ' nada mudou'))
  for (const l of linhasTexto) console.log(`      ${l}`)
  if (linhasTexto.some((l) => l.includes('[no texto]'))) console.log('      ⚠️ o texto do painel cita valor que a tela de agora já não mostra: rodar /atualizar-fra se o André pedir (o medidor do texto é o medidas-fra.ts)')
  }

  // (b) próximos 7 dias
  const hoje0 = new Date(`${agora.toISOString().slice(0, 10)}T00:00:00Z`)
  let controleOk = true
  const dias: { d: Date; linhas: string[] }[] = []
  for (let k = 1; k <= 7; k++) {
    const d = new Date(hoje0.getTime() + k * DIA)
    const antes = estadoEm(V.pesquisas, new Date(d.getTime() - 1)), depois = estadoEm(V.pesquisas, d)
    coerente &&= antes.coerente && depois.coerente
    // Controle: a conta direta (fim + 31 na média, fim + 46 nas contagens) tem de dar as mesmas listas.
    const iso = d.toISOString().slice(0, 10)
    const pub = V.pesquisas.filter((p) => p.publicavel)
    const conta30 = new Set(pub.filter((p) => antes.ids30.has(p.pollId) && maisDias(p.campo.fim, 31) === iso).map((p) => p.pollId))
    const conta45 = new Set(pub.filter((p) => antes.ids45.has(p.pollId) && maisDias(p.campo.fim, 46) === iso).map((p) => p.pollId))
    const sim30 = new Set([...antes.ids30].filter((x) => !depois.ids30.has(x))), sim45 = new Set([...antes.ids45].filter((x) => !depois.ids45.has(x)))
    const igual = (x: Set<string>, y: Set<string>) => x.size === y.size && [...x].every((v) => y.has(v))
    if (!igual(conta30, sim30) || !igual(conta45, sim45)) controleOk = false
    const linhas = mudancas(antes, depois, noTexto)
    if (linhas.length) dias.push({ d, linhas })
  }
  const saidas = dias.length
  console.log(`   PRÓXIMOS 7 DIAS (dados de agora, nenhuma pesquisa nova): ${saidas ? `${saidas} meia(s)-noite(s) mudam a tela` : 'nada sai da tela'} · controle (conta direta fim+31 e fim+46 = simulação) → ${controleOk ? 'CONFERE' : '⛔ NÃO CONFERE'} · coerência (listas e duelos por candidato = funções da tela) → ${coerente ? 'CONFERE' : '⛔ NÃO CONFERE'}${controleOk && coerente ? '' : ': esta seção inteira está SEM VALOR'}`)
  for (const { d, linhas } of dias) {
    console.log(`   em ${d.toISOString().slice(0, 10)} 00:00 UTC (${SEMANA[d.getUTCDay()]}):`)
    for (const l of linhas) console.log(`      ${l}`)
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
/**
 * 🗳️ De que eleição é a pergunta (19/Nov/2026). A 10387 (Ifop para Le Figaro)
 * pergunta "le plus de chances que vous votiez" sobre o "premier tour de cette
 * primaire de la droite et du centre": o detector acusa com razão, mas a tela
 * mostra só a presidencial. Só é PRIMÁRIA quando TODA ocorrência do detector
 * tem a primária nos 200 caracteres antes; ficha com UMA pergunta da
 * presidencial segue ⚠️. A primária não some: sai listada com outro selo.
 */
const CONTEXTO_PRIMARIA = /(?:tour|vote|voter|votiez|participer) (?:de|a) (?:cette|la|une) (?:eventuelle )?primaire/
const CHAVE_DETECTOR = `${DETECTOR_IV.source} | ${CONTEXTO_PRIMARIA.source}`
function detectar(texto: string): { intencao: boolean; trecho: string; primaria: boolean } {
  const n = normalizaTexto(texto)
  const ms = [...n.matchAll(new RegExp(DETECTOR_IV.source, 'g'))]
  if (!ms.length) return { intencao: false, trecho: '', primaria: false }
  const primaria = ms.every((m) => CONTEXTO_PRIMARIA.test(n.slice(Math.max(0, (m.index ?? 0) - 200), m.index)))
  return { intencao: true, trecho: ms[0][0], primaria }
}
type Lida = { arquivo: string; intencao: boolean; trecho: string; primaria?: boolean }
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
    return (cache[caminho] = { arquivo: caminho, ...detectar(await t.text()) })
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
  return { arquivo: caminho, ...detectar(t) }
}

/**
 * PDF da Commission → texto, ou o motivo de não ter lido. `layout` (padrão)
 * guarda as colunas lado a lado, que é o que a conferência de valores precisa;
 * `leitura` (pdftotext sem `-layout`) segue a ordem de leitura, que é o que o
 * extrator do CAMPO precisa nas fichas da Harris (23/Nov/2026, 10393: em layout
 * sai "du 18 au 19   Méthode des quotas…" numa linha e "novembre 2026." na outra).
 */
async function textoDoPdf(caminho: string, modo: 'layout' | 'leitura' = 'layout'): Promise<string | { erro: string }> {
  try {
    const r = await fetch(`https://www.commission-des-sondages.fr/notices/files/notices/${caminho}.pdf`, { headers: { 'User-Agent': UA_FICHA }, signal: AbortSignal.timeout(30_000) })
    if (!r.ok) return { erro: `PDF HTTP ${r.status}` }
    const buf = Buffer.from(await r.arrayBuffer())
    if (buf.subarray(0, 5).toString('latin1') !== '%PDF-') return { erro: 'a resposta não é um PDF' }
    mkdirSync('.cache/fr-fichas-pdf', { recursive: true })
    const arq = `.cache/fr-fichas-pdf/${caminho.replace(/[^A-Za-z0-9._-]+/g, '_')}.pdf`
    writeFileSync(arq, buf)
    const texto = execFileSync('pdftotext', [...(modo === 'layout' ? ['-layout'] : []), '-enc', 'UTF-8', arq, '-'], { encoding: 'utf8', timeout: 60_000, stdio: ['ignore', 'pipe', 'ignore'] })
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

/**
 * 📄 O QUE A FICHA PENDENTE DIZ (criado 20/Nov/2026). Antes, a pendente saía só
 * com o rótulo, e campo, amostra e o lugar na tela se liam à mão no PDF (20/Nov:
 * a 10392 Ifop/Sud Radio, publicada em 20/11, tem campo de 2 a 4/11, ANTERIOR à
 * rodada da Ifop que a tela já mostra). Aqui se lê a ficha (índice ou PDF), se
 * tira o campo e as amostras citadas, e se diz onde as listas entrariam quando
 * a base as estruturar. Nada daqui vai para a tela: nenhum número de pesquisa é
 * digitado à mão.
 *
 * 📏 Medido em 20/Nov/2026 nas 24 fichas citadas de 60 dias: o fim do campo saiu
 * em 20 e bateu com a base nas 20; nas outras 4 (Harris, cujo texto intercala
 * "du 3 au 5" e "novembre 2026" com a amostra) não sai nada, e a linha manda ler
 * à mão. A amostra da base está entre as citadas em 24 de 24. Contar perguntas
 * NÃO entra: YouGov e Elabe não usam a frase da Ifop e da Harris.
 *
 * 🧪 Controle positivo: o MESMO extrator roda nas 5 fichas citadas mais
 * recentes. Fim de campo extraído diferente do da base, ou amostra da base fora
 * das citadas, deixa a extração das pendentes SEM VALOR.
 */
const MESES: Record<string, string> = { janvier: '01', fevrier: '02', mars: '03', avril: '04', mai: '05', juin: '06', juillet: '07', aout: '08', septembre: '09', octobre: '10', novembre: '11', decembre: '12' }
type Extraido = { campo: string | null; fim: string | null; amostras: number[] }
function extrairFicha(texto: string): Extraido {
  const n = normalizaTexto(texto)
  const c = n.match(/(?:du|entre le) (\d{1,2})(?:er)?(?: (\w+))?(?: (\d{4}))?(?: a partir de \d{1,2}h)? (?:au|et le) (\d{1,2})(?:er)? (\w+) (\d{4})/)
    ?? n.match(/les (\d{1,2})(?:er)?()() et (\d{1,2})(?:er)? (\w+) (\d{4})/)
  const fim = c && MESES[c[5]] ? `${c[6]}-${MESES[c[5]]}-${c[4].padStart(2, '0')}` : null
  // "N personnes", fora dos exemplos da tabela de margem ("1 100 personnes, si le pourcentage").
  const amostras = [...new Set([...n.matchAll(/(\d[\d  .]{1,7}\d) (?:personnes|individus|francais)(?!, si le pourcentage)/g)].map((m) => Number(m[1].replace(/[^\d]/g, ''))).filter((x) => x >= 300))]
  return { campo: c ? c[0] : null, fim, amostras }
}
const descreve = (e: Extraido) => `campo ${e.campo ? `"${e.campo}" (fim ${e.fim})` : 'NÃO extraído, ler à mão'} · amostras citadas (as 3 primeiras): ${e.amostras.slice(0, 3).join(', ') || 'nenhuma'}`

/**
 * 🔁 RECURSO DO CAMPO (criado 23/Nov/2026). Nas fichas da Harris o texto do
 * índice e o do `pdftotext -layout` põem "du 18 au 19" numa linha e "novembre
 * 2026." na outra, com a coluna vizinha no meio, e o extrator não acha o campo.
 * Em 23/Nov isso levou a seção PUBLICADA SEM FICHA a dizer que a ficha 10393
 * (Toluna Harris vaga 10, campo 18-19/11) tinha "OUTRO campo": era "campo não
 * lido" virando "campo diferente". Aqui, sem campo no 1º texto, o PDF se relê
 * em ORDEM DE LEITURA (pdftotext sem `-layout`), onde a frase sai inteira.
 * Controle positivo: todas as fichas citadas de 60 dias que o 1º texto não
 * resolve passam pelo recurso, e o fim tem de bater com a base em todas. Sem
 * caso para controlar, ou com um que não bate, o campo vindo do recurso sai
 * SEM VALOR (vale só a amostra).
 */
type ExtraidoVia = Extraido & { via: string }
async function extrairComRecurso(t: { texto: string; origem: string; caminho: string }): Promise<ExtraidoVia> {
  const e = extrairFicha(t.texto)
  if (e.fim) return { ...e, via: t.origem }
  const p = await textoDoPdf(t.caminho, 'leitura')
  if (typeof p !== 'string') return { ...e, via: t.origem }
  const e2 = extrairFicha(p)
  return e2.fim ? { campo: e2.campo, fim: e2.fim, amostras: [...new Set([...e.amostras, ...e2.amostras])], via: 'PDF em ordem de leitura' } : { ...e, via: t.origem }
}
let controleRecurso: Promise<{ ok: boolean; linha: string }> | null = null
function controleDoRecurso(V: FrPollsData) {
  controleRecurso ??= (async () => {
    const corte = corteEm(agora, 60)
    const porFicha = new Map<string, FrPesquisa>()
    for (const p of V.pesquisas.filter((x) => x.publicavel && x.ficha.url && x.ficha.numero && x.campo.fim >= corte)) {
      if (!porFicha.has(p.ficha.numero as string)) porFicha.set(p.ficha.numero as string, p)
    }
    let casos = 0, batem = 0
    const falhas: string[] = []
    for (const p of porFicha.values()) {
      const t = await textoDaFicha(p.ficha.url as string)
      if ('erro' in t || extrairFicha(t.texto).fim) continue
      casos++
      const e = await extrairComRecurso(t)
      if (e.fim === p.campo.fim) batem++
      else falhas.push(`${p.ficha.numero}: ${e.fim ?? 'nada'} pelo recurso, ${p.campo.fim} na base`)
    }
    const ok = casos > 0 && batem === casos
    return { ok, linha: `controle do recurso (fichas citadas de 60 dias sem campo no 1º texto, relidas em ordem de leitura): ${batem} de ${casos} com o fim da base${falhas.length ? ` · ⛔ ${falhas.join(' · ')}` : ''} → ${ok ? 'CONFERE' : casos ? '⛔ campo pelo recurso SEM VALOR' : 'sem caso para controlar: campo pelo recurso SEM VALOR'}` }
  })()
  return controleRecurso
}
/** Campo da ficha com o recurso, já sem valor se o controle do recurso não passou. */
async function campoDaFicha(V: FrPollsData, t: { texto: string; origem: string; caminho: string }): Promise<ExtraidoVia & { recursoSemValor: boolean }> {
  const e = await extrairComRecurso(t)
  if (e.via !== 'PDF em ordem de leitura' || (await controleDoRecurso(V)).ok) return { ...e, recursoSemValor: false }
  return { ...e, campo: null, fim: null, recursoSemValor: true }
}

async function oQueAPendenteDiz(V: FrPollsData) {
  if (!V.pendentes.length) return
  // Controle: as 5 fichas citadas mais recentes, lidas pelo mesmo caminho.
  const porFicha = new Map<string, FrPesquisa>()
  for (const p of V.pesquisas.filter((x) => x.publicavel && x.ficha.url && x.ficha.numero).sort((a, b) => b.campo.fim.localeCompare(a.campo.fim))) {
    if (!porFicha.has(p.ficha.numero as string)) porFicha.set(p.ficha.numero as string, p)
  }
  const falhas: string[] = []
  let lidas = 0, comFim = 0
  for (const p of [...porFicha.values()].slice(0, 5)) {
    const t = await textoDaFicha(p.ficha.url as string)
    if ('erro' in t) { falhas.push(`${p.ficha.numero} não lida (${t.erro})`); continue }
    const e = extrairFicha(t.texto)
    lidas++
    if (e.fim) { comFim++; if (e.fim !== p.campo.fim) falhas.push(`${p.ficha.numero}: fim ${e.fim} na ficha, ${p.campo.fim} na base`) }
    if (p.amostra != null && !e.amostras.includes(p.amostra)) falhas.push(`${p.ficha.numero}: amostra da base ${p.amostra} fora das citadas (${e.amostras.join(', ')})`)
  }
  const controleOk = lidas > 0 && comFim > 0 && !falhas.length
  console.log(`   controle do extrator (5 fichas citadas mais recentes): ${lidas} lidas, fim do campo extraído em ${comFim} e igual ao da base em ${comFim - falhas.filter((f) => f.includes(' fim ')).length}${falhas.length ? ` · ⛔ ${falhas.join(' · ')}` : ''} → ${controleOk ? 'CONFERE' : '⛔ extração das pendentes SEM VALOR, ler à mão'}`)
  console.log(`   ${(await controleDoRecurso(V)).linha}`)
  const ultimaPorInst = new Map<string, string>()
  for (const p of V.pesquisas.filter((x) => x.publicavel && x.turno === 1)) {
    const k = semAcento(p.instituto).split(/\s+/)[0] // "harris interactive" → "harris", "ipsos bva" → "ipsos"
    if ((ultimaPorInst.get(k) ?? '') < p.campo.fim) ultimaPorInst.set(k, p.campo.fim)
  }  for (const f of V.pendentes as { numero: string; rotulo: string; url: string }[]) {
    const t = await textoDaFicha(f.url)
    if ('erro' in t) { console.log(`   📄 ${f.numero}: ficha NÃO lida (${t.erro}) → ler o PDF à mão`); continue }
    const e = await campoDaFicha(V, t)
    console.log(`   📄 ${f.numero} (${e.via}${controleOk ? '' : ', SEM VALOR'}): ${descreve(e)}${e.recursoSemValor ? ' (o recurso achou um campo, mas o controle dele não passou)' : ''}`)
    const inst = [...ultimaPorInst.keys()].find((k) => semAcento(f.rotulo).includes(k))
    if (e.fim) {
      const ate = (d: number) => new Date(new Date(e.fim + 'T00:00:00Z').getTime() + d * 864e5).toISOString().slice(0, 10)
      const lugar = !inst ? 'instituto sem rodada na tela: entraria como lista principal NOVA'
        : e.fim === ultimaPorInst.get(inst) ? `campo termina no MESMO dia da rodada da tela (${inst}): a lista principal sai da ordem dos pollIds, conferir na tela`
        : e.fim > (ultimaPorInst.get(inst) as string) ? `campo mais recente que a rodada da tela (${inst}, fim ${ultimaPorInst.get(inst)}): passaria a ser a lista principal do instituto`
        : `campo ANTERIOR à rodada da tela (${inst}, fim ${ultimaPorInst.get(inst)}): NÃO muda a lista principal, entra só na média e nas contagens`
      console.log(`      ↳ ${lugar} · na média de 30 dias até ${ate(30)}, nas contagens de 45 dias até ${ate(45)}`)
    }
    try {
      const r = await fetch(`https://api.github.com/search/issues?q=repo:MieuxVoter/presidentielle2027+${f.numero}`, { headers: { 'User-Agent': UA_FICHA, Accept: 'application/vnd.github+json' }, signal: AbortSignal.timeout(15_000) })
      const j = r.ok ? (await r.json()) as { items: { number: number; state: string; title: string; pull_request?: unknown; created_at: string }[] } : null
      const itens = (j?.items ?? []).map((i) => `${i.pull_request ? 'PR' : 'issue'} #${i.number} ${i.state} ${i.created_at.slice(0, 16)}Z "${i.title.slice(0, 70)}"`)
      console.log(`      ↳ base MieuxVoter: ${j ? (itens.length ? itens.join(' · ') : 'nada menciona a ficha ainda') : `busca HTTP ${r.status}`}`)
    } catch (err) { console.log(`      ↳ base MieuxVoter: busca falhou (${err instanceof Error ? err.message : String(err)})`) }
  }
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
      // Sobrenome composto quebrado na tabela ("Nicolas Dupont-" / "Aignan", ficha
      // 10392 da Ifop, 26/Nov/2026): também vale uma das partes com 4+ letras.
      const partes = [s, ...s.split('-').filter((x) => x.length >= 4 && x !== s)]
      const idx = linhas.map((x, k) => (partes.some((pt) => x.includes(pt)) ? k : -1)).filter((k) => k >= 0)
      const mesmaLinha = idx.filter((k) => numerosDa(linhas[k]).includes(it.pct))
      // NOME QUEBRADO EM DUAS LINHAS com o valor numa linha SÓ DE NÚMERO entre elas
      // ("Jean-Luc" / "18" / "Melenchon", ficha 10392): a linha do valor, a até 2
      // linhas do sobrenome, não pode ter letra nenhuma, então nunca é o valor de
      // outro candidato (esses vêm na linha do próprio nome). Mutação conferida:
      // Mélenchon e Glucksmann trocados na 10392 continuam VALOR NÃO ACHADO.
      const soNumero = (k: number) => k >= 0 && k < linhas.length && !/[a-z]/.test(linhas[k]) && numerosDa(linhas[k]).includes(it.pct)
      const quebrado = mesmaLinha.length ? [] : idx.flatMap((k) => [k - 1, k + 1, k - 2, k + 2].filter(soNumero))
      const comValor = mesmaLinha.length ? mesmaLinha : quebrado
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
    if (c.detector === CHAVE_DETECTOR && c.fichas) cache = c.fichas
  } catch { /* primeira rodada */ }
  const fila = [...controle, ...alvo]
  const res = new Map<string, Leitura>()
  let i = 0
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (i < fila.length) { const f = fila[i++]; res.set(f.numero, await lerFicha(f.url, cache, !controle.includes(f))) }
  }))
  try { mkdirSync('.cache', { recursive: true }); writeFileSync(CACHE_TEXTO, JSON.stringify({ detector: CHAVE_DETECTOR, fichas: cache }, null, 1)) } catch { /* cache é conveniência */ }

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
  // Controle NEGATIVO da primária: as citadas são da presidencial; marcada como primária = classificador largo demais.
  const controlePrim = lidasControle.filter((r) => r.primaria).length
  if (lidasControle.length) console.log(`   controle da primária: ${controlePrim} de ${lidasControle.length} citadas (presidencial) marcadas como primária` +
    (controlePrim ? '  ⚠️ CLASSIFICADOR LARGO: as marcadas como primária abaixo se leem à mão como possíveis pendentes' : ''))
  const de = (tipo: 'intencao' | 'semTexto' | 'erro') => alvo.filter((f) => { const r = res.get(f.numero); return !!r && tipo in r && (tipo !== 'intencao' || (r as Lida).intencao) })
  const achou = de('intencao'), semTexto = de('semTexto'), erro = de('erro')
  if (viaPdf.size) {
    const c = controlePdf?.leitura
    const veredito = !c ? 'indisponível (nenhuma citada lida)' : 'intencao' in c ? (c.intencao ? 'acusada' : 'NÃO acusada') : `não lida (${'erro' in c ? c.erro : c.semTexto})`
    console.log(`   controle do PDF: citada ${controlePdf?.numero ?? 'n/d'} lida pelo PDF → ${veredito}` +
      (pdfEnxerga ? '' : '  ⛔ o caminho do PDF está CEGO: as fichas lidas pelo PDF abaixo NÃO valem como "sem pendente", ler à mão'))
  }
  const origem = (n: string) => (viaPdf.has(n) ? ' [lida do PDF]' : '')
  for (const f of achou.filter((f) => !(res.get(f.numero) as Lida).primaria)) console.log(`   ⚠️ INTENÇÃO DE VOTO NO TEXTO, sem selo no rótulo: ${f.rotulo} · ${f.url} · "${(res.get(f.numero) as Lida).trecho}"${origem(f.numero)} → pendente que o rótulo não acusa: listar ao André`)
  for (const f of achou.filter((f) => (res.get(f.numero) as Lida).primaria)) console.log(`   🗳️ INTENÇÃO DE VOTO EM PRIMÁRIA no texto (toda ocorrência do detector é sobre a primária): ${f.rotulo} · ${f.url} · "${(res.get(f.numero) as Lida).trecho}"${origem(f.numero)} → fora do universo da tela (1º e 2º turno da presidencial): listar ao André como primária${controlePrim ? '; ⚠️ controle da primária falhou, ler à mão' : ''}`)
  for (const f of semTexto) console.log(`   ⏳ texto ainda não arquivado no índice e PDF não lido, ler à mão: ${f.rotulo} · ${f.url} · ${(res.get(f.numero) as { semTexto: string }).semTexto}`)
  for (const f of erro) console.log(`   ⛔ não lida: ${f.rotulo} · ${(res.get(f.numero) as { erro: string }).erro}`)
  const lidas = alvo.length - semTexto.length - erro.length
  const lidasPdf = alvo.filter((f) => viaPdf.has(f.numero) && !(res.get(f.numero) as Lida).intencao)
  if (!achou.length) console.log(`   nenhuma das ${lidas} lidas traz a pergunta de intenção de voto` +
    (lidasPdf.length ? ` (${lidasPdf.length} pelo PDF: ${lidasPdf.map((f) => f.numero).join(' ')}${pdfEnxerga ? '' : ', SEM VALOR: controle do PDF falhou'})` : ''))

  /**
   * 🆕 FICHAS NOVAS NA LISTAGEM (criado 26/Nov/2026). A seção acima só imprime a
   * ficha que ACUSA; a que ela lê e descarta (barômetro, popularidade, primária)
   * não aparecia em lugar nenhum. Em 24/Nov eu disse ao André que o barômetro
   * Odoxa dos duelos de preferência "não tem ficha", e a 10395 já estava na
   * listagem. Aqui, toda ficha mais nova que a última citada pela base sai com
   * rótulo, link e veredito, para nenhuma ficha nova passar calada.
   */
  const maiorCitada = Math.max(...[...citadas].map((n) => parseInt(n, 10)).filter(Number.isFinite))
  const novas = fichas.filter((f) => parseInt(f.numero, 10) > maiorCitada).sort((a, b) => parseInt(b.numero, 10) - parseInt(a.numero, 10))
  console.log(`\n== FICHAS NOVAS NA LISTAGEM (acima da ${maiorCitada}, a mais nova citada pela base): ${novas.length}`)
  for (const f of novas) {
    const r = res.get(f.numero)
    const v = f.intencao ? '⏳ SELO de intenção de voto no rótulo: pendente (seção PENDENTES)'
      : !r ? 'fora da leitura (abaixo do piso da janela)'
      : 'intencao' in r ? (r.intencao ? (r.primaria ? '🗳️ intenção de voto em PRIMÁRIA: fora do universo' : '⚠️ INTENÇÃO DE VOTO NO TEXTO: pendente') : `lida${origem(f.numero) || ' do índice'}, sem a pergunta de intenção de voto da presidencial${viaPdf.has(f.numero) && !pdfEnxerga ? ' (SEM VALOR: controle do PDF falhou)' : ''}`)
      : 'semTexto' in r ? '⏳ não lida (sem texto no índice e PDF não lido): ler à mão'
      : `⛔ não lida (${r.erro})`
    console.log(`   ${f.rotulo} · ${f.url}\n      → ${v}`)
  }
}

/**
 * 📰 10. PUBLICADA SEM FICHA (criado 22/Nov/2026).
 *
 * As seções acima só enxergam pesquisa que JÁ tem ficha na Commission. Em
 * 22/Nov/2026 (domingo, véspera da Weekly №1) a vaga 10 da Toluna Harris
 * Interactive para M6, RTL e L'Express (campo 18-19/11, 2.088 inscritos) já
 * estava no PDF da Toluna e na Wikipedia EN, e a listagem da Commission parava
 * na 10392: o atalho dizia "1 pendente" e não via a pesquisa nova.
 *
 * Aqui as tabelas de 1º turno da Wikipedia EN e FR servem SÓ de detector de
 * existência (instituto, fim do campo, amostra, link). Nenhum número delas vai
 * para lugar nenhum: a Wikipedia tem erros, e nenhum número de pesquisa é
 * digitado à mão. Cada rodada com campo nos últimos 21 dias é casada com a
 * base (mesmo instituto, fim do campo a até 1 dia) e, se não está nela, com as
 * fichas pendentes (mesmo instituto, fim do campo lido da ficha). Sobrou:
 * `📰 PUBLICADA SEM FICHA NEM LISTA NA BASE` = listar ao André; entra na tela
 * sozinha quando a Commission publicar a ficha e a base estruturar.
 * 🧪 Controle positivo por fonte: as rodadas de 1º turno publicáveis da base
 * nos mesmos 21 dias têm de ser achadas na tabela. Fonte que não acha nenhuma
 * sai `CEGA` e não conta; as duas cegas = nada da seção vale.
 */
const URL_WIKI: Record<'EN' | 'FR', string> = {
  EN: 'https://en.wikipedia.org/w/index.php?title=Opinion_polling_for_the_2027_French_presidential_election&action=raw',
  FR: 'https://fr.wikipedia.org/w/index.php?title=Liste_de_sondages_sur_l%27%C3%A9lection_pr%C3%A9sidentielle_fran%C3%A7aise_de_2027&action=raw',
}
const MES_EN: Record<string, string> = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' }
type LinhaWiki = { fonte: 'EN' | 'FR'; inst: string; nome: string; fim: string; amostra: number | null; link: string }
/** "Toluna Harris Interactive" → "harris", "Ipsos BVA" → "ipsos", "IFOP-Fiducial" → "ifop", "Cluster 17" → "cluster17". */
const chaveInstituto = (s: string) => {
  const t = semAcento(s).replace(/cluster\s+17/g, 'cluster17').replace(/\btoluna\b/g, ' ').split(/[^a-z0-9]+/).filter(Boolean)[0] ?? ''
  return t === 'bva' ? 'ipsos' : t
}
/** Instituto pelo RÓTULO da ficha ("10392 Pres IV IFOP Sud Radio 20 novembre" → "ifop"), procurando as grafias conhecidas. */
const GRAFIAS_ROTULO: [RegExp, string][] = [[/\bifop\b/, 'ifop'], [/\b(?:toluna|harris)\b/, 'harris'], [/\belabe\b/, 'elabe'], [/\b(?:ipsos|bva)\b/, 'ipsos'], [/\bopinionway\b/, 'opinionway'], [/\bcluster\s?17\b/, 'cluster17'], [/\byougov\b/, 'yougov'], [/\bodoxa\b/, 'odoxa'], [/\bverian\b/, 'verian'], [/\bcsa\b/, 'csa'], [/\bviavoice\b/, 'viavoice']]
const instDoRotulo = (r: string) => GRAFIAS_ROTULO.find(([re]) => re.test(semAcento(r)))?.[1] ?? ''
const diasEntre = (a: string, b: string) => Math.round(Math.abs(new Date(`${a}T00:00:00Z`).getTime() - new Date(`${b}T00:00:00Z`).getTime()) / DIA)
const amostraDe = (s: string | undefined) => {
  const m = (s ?? '').replace(/\{\{[Ff]ormatnum[:|]/, '').match(/(\d[\d,.  ]*\d)/)
  const n = m ? Number(m[1].replace(/[^\d]/g, '')) : NaN
  return Number.isFinite(n) && n >= 300 ? n : null
}
/**
 * Lê as linhas de instituto da tabela do 1º turno. Linha de instituto = célula
 * com link `[http… Nome]` (EN: `style="background…"`; FR: `{{Sondeur|…}}`);
 * a célula seguinte é o campo, a outra a amostra. EN: `{{Opdrts|d1|d2|Mon|aaaa|year}}`
 * (ou `|d1|Mon1|d2|Mon2|aaaa|`); FR: "12-17 novembre", ano do título da seção.
 */
function lerWiki(fonte: 'EN' | 'FR', texto: string): LinhaWiki[] {
  const [ini, fim] = fonte === 'EN' ? ['== First round ==', '== Second round =='] : ['== Sondages concernant le premier tour ==', '== Sondages concernant le second tour ==']
  const a = texto.indexOf(ini), b = texto.indexOf(fim, a + 1)
  if (a < 0 || b < 0) return []
  const ls = texto.slice(a, b).split('\n')
  const out: LinhaWiki[] = []
  let ano: string | null = null
  for (let i = 0; i < ls.length; i++) {
    const l = ls[i]
    const h = l.match(/^=+[^=]*?(\d{4})[^=]*=+\s*$/)
    if (h) { ano = h[1]; continue }
    if (!/^\|/.test(l) || !(fonte === 'EN' ? /background/.test(l) : /Sondeur\|/.test(l))) continue
    const lk = l.match(/\[(https?:\/\/\S+)\s+([^\]]+)\]/)
    if (!lk) continue
    let fimCampo: string | null = null
    const d = ls[i + 1] ?? ''
    if (fonte === 'EN') {
      const o = d.match(/\{\{[Oo]pdrts\|([^}]*)\}\}/)
      const p = o ? o[1].split('|').map((x) => x.trim()) : []
      // |d1|d2|Mon|aaaa|year (mesmo mês) ou |d1|Mon1|d2|Mon2|aaaa|year
      const [dia, mes, aaaa] = p.length >= 6 && /^\D/.test(p[1]) ? [p[2], p[3], p[4]] : [p[1], p[2], p[3]]
      const mm = mes ? MES_EN[mes.slice(0, 3).toLowerCase()] : undefined
      if (mm && /^\d{4}$/.test(aaaa ?? '') && /^\d{1,2}$/.test(dia ?? '')) fimCampo = `${aaaa}-${mm}-${dia.padStart(2, '0')}`
    } else {
      const ds = [...semAcento(d.replace(/^.*\|/, '')).matchAll(/(\d{1,2})(?:er)?\s+([a-z]+)/g)]
      const u = ds[ds.length - 1]
      if (u && MESES[u[2]] && ano) fimCampo = `${ano}-${MESES[u[2]]}-${u[1].padStart(2, '0')}`
    }
    if (!fimCampo) continue
    out.push({ fonte, inst: chaveInstituto(lk[2]), nome: lk[2].trim(), fim: fimCampo, amostra: amostraDe((ls[i + 2] ?? '').replace(/^.*\|/, '')), link: lk[1] })
  }
  return out
}

async function publicadaSemFicha(V: FrPollsData) {
  const desde = corteEm(agora, 21)
  const lidas: LinhaWiki[] = [], falhas: string[] = []
  for (const fonte of ['EN', 'FR'] as const) {
    try {
      const r = await fetch(URL_WIKI[fonte], { headers: { 'User-Agent': UA_FICHA }, signal: AbortSignal.timeout(30_000) })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      const ls = lerWiki(fonte, await r.text())
      if (!ls.length) throw new Error('nenhuma linha de instituto lida (a tabela mudou de forma?)')
      lidas.push(...ls)
    } catch (e) { falhas.push(`${fonte}: ${e instanceof Error ? e.message : String(e)}`) }
  }
  // Rodadas de 1º turno publicáveis da base nos 21 dias: o controle positivo.
  const rodBase = new Map<string, { inst: string; fim: string; nome: string }>()
  for (const p of V.pesquisas.filter((x) => x.publicavel && x.turno === 1 && x.campo.fim >= desde)) {
    rodBase.set(`${chaveInstituto(p.instituto)}|${p.campo.fim}`, { inst: chaveInstituto(p.instituto), fim: p.campo.fim, nome: p.instituto })
  }
  const naBase = (inst: string, fim: string, tol: number) => V.pesquisas.find((p) => chaveInstituto(p.instituto) === inst && diasEntre(p.campo.fim, fim) <= tol)
  const fontes = (['EN', 'FR'] as const).map((f) => {
    const ls = lidas.filter((l) => l.fonte === f)
    const achadas = [...rodBase.values()].filter((rb) => ls.some((l) => l.inst === rb.inst && diasEntre(l.fim, rb.fim) <= 1))
    return { f, ls, achadas, cega: !ls.length || (rodBase.size > 0 && !achadas.length) }
  })
  const vivas = fontes.filter((x) => !x.cega)
  const recentes = new Map<string, LinhaWiki[]>()
  for (const x of vivas) for (const l of x.ls.filter((l) => l.fim >= desde)) recentes.set(`${l.inst}|${l.fim}`, [...(recentes.get(`${l.inst}|${l.fim}`) ?? []), l])
  console.log(`\n== PUBLICADA SEM FICHA (tabelas do 1º turno da Wikipedia EN e FR, só como detector de existência; campo desde ${desde}): ${recentes.size} rodada(s) na Wikipedia`)
  for (const x of fontes) {
    const falta = [...rodBase.values()].filter((rb) => !x.achadas.includes(rb))
    console.log(`   controle ${x.f}: ${x.ls.length} linha(s) de instituto lidas · ${x.achadas.length} de ${rodBase.size} rodadas publicáveis da base achadas` +
      (falta.length && !x.cega ? ` (sem: ${falta.map((rb) => `${rb.nome} fim ${rb.fim}`).join(', ')}; Wikipedia atrasada ou com outra data)` : '') +
      (x.cega ? ' → ⛔ CEGA: esta fonte não vale' : ' → CONFERE'))
  }
  for (const f of falhas) console.log(`   ⛔ ${f}`)
  if (!vivas.length) { console.log('   ⛔ LEITURA CEGA nas duas fontes: nada desta seção vale como "nenhuma publicada sem ficha"; procurar à mão'); return }
  // Fim do campo de cada ficha pendente, lido da própria ficha.
  // 23/Nov/2026: "fim não lido" NÃO é "outro campo". Sem o fim, a amostra decide
  // (a da Wikipedia entre as citadas na ficha); sem as duas, "pode ser ela".
  const pend: { numero: string; rotulo: string; inst: string; fim: string | null; amostras: number[] }[] = []
  for (const f of V.pendentes as { numero: string; rotulo: string; url: string }[]) {
    const t = await textoDaFicha(f.url)
    const e = 'erro' in t ? null : await campoDaFicha(V, t)
    pend.push({ numero: f.numero, rotulo: f.rotulo, inst: instDoRotulo(f.rotulo), fim: e?.fim ?? null, amostras: e?.amostras ?? [] })
  }
  const ultimaPorInst = new Map<string, string>()
  for (const p of V.pesquisas.filter((x) => x.publicavel && x.turno === 1)) {
    const k = chaveInstituto(p.instituto)
    if ((ultimaPorInst.get(k) ?? '') < p.campo.fim) ultimaPorInst.set(k, p.campo.fim)
  }
  let casadas = 0
  for (const [, ls] of [...recentes].sort((x, y) => y[1][0].fim.localeCompare(x[1][0].fim))) {
    const l = ls[0], quem = `${l.nome} · campo até ${l.fim} · n=${ls.find((x) => x.amostra)?.amostra ?? 'n/d'} · Wikipedia ${[...new Set(ls.map((x) => x.fonte))].join('+')}`
    const b = naBase(l.inst, l.fim, 1)
    if (b) { casadas++; continue }
    const perto = naBase(l.inst, l.fim, 3)
    if (perto) { console.log(`   ≈ ${quem}: na base com fim do campo ${perto.campo.fim} (ficha ${perto.ficha.numero ?? 'sem número'}); data diferente entre as fontes, conferir`); continue }
    const pf = pend.find((p) => p.inst === l.inst && p.fim && diasEntre(p.fim, l.fim) <= 1)
    if (pf) { console.log(`   ⏳ ${quem}: é a ficha pendente ${pf.numero} ("${pf.rotulo}", fim do campo na ficha ${pf.fim}): aguarda a base`); continue }
    const amostraWiki = ls.find((x) => x.amostra)?.amostra ?? null
    const pa = pend.find((p) => p.inst === l.inst && !p.fim && amostraWiki != null && p.amostras.includes(amostraWiki))
    if (pa) { console.log(`   ⏳ ${quem}: é a ficha pendente ${pa.numero} ("${pa.rotulo}"), casada pela AMOSTRA ${amostraWiki} citada na ficha (fim do campo não lido nela): aguarda a base`); continue }
    const semFim = pend.find((p) => p.inst === l.inst && !p.fim)
    if (semFim) { console.log(`   ❓ ${quem}: há ficha pendente do mesmo instituto (${semFim.numero}, "${semFim.rotulo}") com o campo NÃO LIDO e sem a amostra ${amostraWiki ?? 'n/d'} entre as citadas: PODE SER ELA, ler o PDF à mão · ${l.link}`); continue }
    const pi = pend.find((p) => p.inst === l.inst)
    const ult = ultimaPorInst.get(l.inst)
    const ate = (d: number) => maisDias(l.fim, d)
    const lugar = !ult ? 'instituto sem rodada na tela: entraria como lista principal NOVA'
      : l.fim > ult ? `campo mais recente que a rodada da tela (fim ${ult}): passaria a ser a lista principal do instituto`
      : `campo não é mais recente que a rodada da tela (fim ${ult}): entraria só na média e nas contagens`
    console.log(`   📰 PUBLICADA SEM FICHA NEM LISTA NA BASE: ${quem} · ${l.link}`)
    console.log(`      ↳ ${pi ? `há ficha pendente do mesmo instituto (${pi.numero}, fim ${pi.fim} lido na ficha) com OUTRO campo: não é ela · ` : ''}aguarda a ficha da Commission e a lista da base; nenhum número entra à mão · quando entrar: ${lugar} · na média de 30 dias até ${ate(30)}, nas contagens de 45 dias até ${ate(45)} → listar ao André`)
  }
  console.log(`   ${casadas} rodada(s) da Wikipedia já estão na base`)
}

main().catch((e) => { console.error(e); process.exit(1) })
