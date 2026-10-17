/**
 * fora-do-painel-brz.mjs — a nacional que JÁ SAIU está no painel?
 *
 * 🔴 POR QUE ISTO EXISTE, medido em 17/Out/2026: a Gerp BR-05187/2026 (campo
 *    de 14 a 16/Out, n=2.400) foi divulgada na noite de 16/Out, 50 a 45 no
 *    total, em Poder360 e Gazeta do Povo. O protocolo estava no banco desde
 *    08/Out. Nenhum passo da rodada a nomeou como FALTANDO no painel:
 *
 *    - o bloco 📣 do relatório lê a `divulgacao` do registro, e ela dizia
 *      13/Out, ANTES do campo começar, então a pesquisa nunca "divulgava hoje";
 *    - o passo 4.5 acusou "Gerp COM NUMERO", mas por CASA, e a casa tinha outra
 *      onda (13/Out, BR-07877) já no painel e sendo repercutida;
 *    - e o `polls-data.json` nunca era comparado com o registro, protocolo a
 *      protocolo.
 *
 *    No dia seguinte o post do AFOS saiu com "17 nacionais até 16/Out", e eram 18.
 *
 * 🔑 A pergunta deste módulo é outra que a dos irmãos: não "quem prometeu
 *    hoje", mas "quem já terminou o campo e NÃO está no painel". A chave é o
 *    PROTOCOLO, que é a única identidade que o registro e o painel dividem. A
 *    data de divulgação do registro fica fora da decisão de propósito: ela é
 *    compromisso, e em 32 de 1.138 registros vem antes do fim do campo.
 *
 * ⛔ Ele NÃO conclui que a pesquisa saiu. `FORA_COM_NUMERO` quer dizer "há
 *    manchete nacional da casa com percentual desde o fim do campo deste
 *    protocolo", e isso inclui repercussão de onda anterior. É encaminhamento
 *    para o CORPO (`ler-materia.mjs`), nunca ingestão.
 */

import { classificarTitulo, ehNacional, normalizarProtocolo } from './saiu-hoje-brz.mjs'

const ISO = /^\d{4}-\d{2}-\d{2}$/
const PROTOCOLO = /BR-?\d{5}\/?\d{4}/gi

/**
 * Os protocolos que o painel publica, lidos do campo `register` de cada pesquisa.
 *
 * ⚠️ Só o `register`, nunca a `note`: a nota cita protocolo de ONDA ANTERIOR
 *    ("na rodada de 03/Out, registro BR-00509/2026, ..."), e lê-la faria a
 *    onda velha parecer publicada.
 *
 * @returns {{ protocolos: Set<string>, semRegistro: string[] }}
 *          `semRegistro` sai LOUD: pesquisa do painel sem protocolo é pesquisa
 *          que esta conferência não consegue casar, nos dois sentidos.
 */
export function protocolosDoPainel(pollsData) {
  const polls = pollsData?.polls
  if (!Array.isArray(polls)) throw new TypeError('polls-data sem lista `polls`: não adivinhar o formato')
  const protocolos = new Set()
  const semRegistro = []
  for (const p of polls) {
    const achados = String(p?.register ?? '').match(PROTOCOLO) ?? []
    if (!achados.length) semRegistro.push(`${p?.date ?? '?'} ${p?.institute ?? '?'}`)
    for (const a of achados) protocolos.add(normalizarProtocolo(a))
  }
  return { protocolos, semRegistro }
}

/** Percentuais de um texto, normalizados ("50.8" e "50,8" viram "50,8"; "50,0" vira "50"). */
export function percentuais(texto) {
  return [...String(texto ?? '').matchAll(/(\d{1,2}(?:[.,]\d{1,2})?)\s?%/g)].map((m) => m[1].replace('.', ',').replace(/,0+$/, ''))
}

/**
 * Os números que o painel JÁ publica, por casa de imprensa.
 *
 * 🔑 É o que separa REPERCUSSÃO de onda nova, medido no mesmo 17/Out: a
 *    "Futura: Flávio tem 50,8% dos votos válidos" do dia 17 é a onda de 16/Out,
 *    que já está no painel, e acusava a BR-06715, cujo campo acabou no dia 17.
 *    Manchete cujos percentuais estão TODOS numa pesquisa da mesma casa no
 *    painel não é número novo.
 *
 * ⚠️ Lê a `note` também, ao contrário de `protocolosDoPainel`, porque aqui o
 *    risco é o oposto: número de onda anterior citado na nota só pode fazer uma
 *    manchete passar por repercussão, e repercussão de onda anterior É o que ela é.
 */
export function numerosDoPainel(pollsData, casaDe) {
  const porCasa = new Map()
  for (const p of pollsData?.polls ?? []) {
    const nome = casaDe(p?.institute)?.nome
    if (!nome) continue
    const sr = (p.secondRound ?? []).flatMap((c) => [c.percent1, c.percent2]).filter((v) => v != null).map((v) => `${v}%`)
    const set = porCasa.get(nome) ?? new Set()
    for (const x of percentuais([p.note ?? '', ...sr].join(' '))) set.add(x)
    porCasa.set(nome, set)
  }
  return porCasa
}

/** Data civil do Brasil de um `pubDate` RFC 822 / ISO. `null` se ilegível. */
export function diaCivilDoItem(pubDate) {
  const t = Date.parse(pubDate ?? '')
  if (!Number.isFinite(t)) return null
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date(t))
}

/**
 * Classifica cada registro NACIONAL cujo campo terminou desde `desde`.
 *
 * @param registros  linhas da rota `/api/polls/tse` (protocolo, institute, scope, fieldEnd, publicationDate)
 * @param opts.painel     Set de protocolos normalizados do painel
 * @param opts.fantasmas  Set de protocolos normalizados já retirados do TSE, ou null se não lido
 * @param opts.itens      [{ title, pubDate }] do news-cache, todos os dias lidos
 * @param opts.hoje       'AAAA-MM-DD', data civil do Brasil
 * @param opts.desde      'AAAA-MM-DD', fim de campo mínimo considerado
 * @param opts.casaDe     (institute) => { nome, alvos: RegExp[] } | null
 *
 * Estados, em ordem de decisão:
 *   RETIRADA          o TSE já tirou do registro: não se espera número
 *   NO_PAINEL         o protocolo está no `register` de alguma pesquisa do painel
 *   EM_CAMPO          o campo ainda não terminou (fim > hoje)
 *   CASA_SEM_TABELA   a casa não está em CASAS_BRZ: a imprensa dela não é medida
 *   FORA_COM_NUMERO   fora do painel, com manchete nacional da casa com % desde o fim do campo
 *   FORA_SEM_NUMERO   fora do painel, e nada com número NOVO (repercussão sai contada à parte)
 *
 * @param opts.numerosPublicados  Map<casa, Set<percentual>> de `numerosDoPainel`
 */
export function classificarForaDoPainel(registros, opts) {
  const { painel, fantasmas = null, itens = [], hoje, desde, casaDe, numerosPublicados = new Map() } = opts ?? {}
  if (!Array.isArray(registros)) throw new TypeError('registros tem de ser array')
  if (!(painel instanceof Set)) throw new TypeError('painel tem de ser Set de protocolos')
  for (const [n, v] of [['hoje', hoje], ['desde', desde]]) {
    // 🕳️ Mesma guarda de tipo do `medirSaida`: `null` vira 1970 sem reclamar.
    if (typeof v !== 'string' || !ISO.test(v)) throw new TypeError(`${n} tem de ser AAAA-MM-DD, veio ${JSON.stringify(v)}`)
  }
  if (typeof casaDe !== 'function') throw new TypeError('casaDe tem de ser função')

  const datados = itens
    .map((i) => ({ titulo: String(i?.title ?? ''), dia: diaCivilDoItem(i?.pubDate) }))
    .filter((i) => i.titulo && i.dia)

  const linhas = []
  const vistos = new Set()
  for (const r of registros) {
    if (r?.scope !== 'national') continue
    const proto = normalizarProtocolo(r.protocolo ?? r.protocol)
    if (!proto || vistos.has(proto)) continue
    const fim = String(r.fieldEnd ?? '').slice(0, 10)
    if (!ISO.test(fim) || fim < desde) continue
    vistos.add(proto)

    const base = { protocolo: proto, casa: r.institute, n: r.sampleSize ?? null, fim, divulgacao: String(r.publicationDate ?? '').slice(0, 10) }
    if (fantasmas?.has(proto)) { linhas.push({ ...base, estado: 'RETIRADA' }); continue }
    if (painel.has(proto)) { linhas.push({ ...base, estado: 'NO_PAINEL' }); continue }
    if (fim > hoje) { linhas.push({ ...base, estado: 'EM_CAMPO' }); continue }

    const casa = casaDe(r.institute)
    if (!casa) { linhas.push({ ...base, estado: 'CASA_SEM_TABELA' }); continue }

    // 🔑 Só manchete publicada NO DIA do fim do campo ou depois: número de antes
    //    do fim do campo não pode ser desta pesquisa.
    const comNumero = [...new Map(
      datados
        .filter((i) => i.dia >= fim)
        .filter((i) => casa.alvos.some((re) => re.test(i.titulo)))
        .filter((i) => ehNacional(i.titulo))
        .filter((i) => classificarTitulo(i.titulo) === 'COM_NUMERO')
        .map((i) => [i.titulo, i]),
    ).values()]
    const jaPublicados = numerosPublicados.get(casa.nome) ?? new Set()
    const ehRepercussao = (t) => {
      const ps = percentuais(t)
      return ps.length > 0 && ps.every((x) => jaPublicados.has(x))
    }
    const novos = comNumero.filter((i) => !ehRepercussao(i.titulo))
    linhas.push({
      ...base,
      casaImprensa: casa.nome,
      estado: novos.length ? 'FORA_COM_NUMERO' : 'FORA_SEM_NUMERO',
      itens: novos.length,
      repercussao: comNumero.length - novos.length,
      exemplos: novos.slice(0, 3).map((i) => `${i.dia} ${i.titulo}`),
    })
  }

  const conta = (e) => linhas.filter((l) => l.estado === e).length
  const veredito = conta('FORA_COM_NUMERO') ? 'FALTA_NO_PAINEL' : conta('CASA_SEM_TABELA') ? 'CASA_SEM_TABELA' : 'EM_DIA'
  return { linhas, veredito }
}
