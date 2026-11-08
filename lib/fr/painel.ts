/**
 * Dados do painel da FRANÇA (presidencial 2027): leitura no servidor e os
 * resumos de pesquisa que a tela mostra. Criado 08/Nov/2026.
 *
 * Tudo aqui é da França e só da França: nada lê o Brasil ou os EUA, e nenhum
 * leitor dos outros países importa este módulo.
 *
 * 📏 Resumo de pesquisa, decisão do André em 08/Nov/2026: (a) a lista
 * PRINCIPAL de cada instituto, com (b) a MÉDIA por candidato ao lado. A média
 * junta listas diferentes de candidatos e vem rotulada assim na tela; ela não é
 * previsão nem "a" intenção de voto, é o centro do que as listas mediram.
 *
 * Só entra pesquisa `publicavel` (ficha oficial confere e a lista soma 97 a 103,
 * ver `lib/fr-polls/collect.mjs`).
 */

import { avaliarProntidao, type Prontidao } from '../kalshi/prontidao'

// ─── Tipos do que os coletores gravam ────────────────────────────────────────

export interface FrIntencao { candidato: string; pct: number }

export interface FrPesquisa {
  pollId: string
  instituto: string
  cliente: string
  campo: { inicio: string; fim: string }
  amostra: number | null
  turno: 1 | 2
  hipotese: string
  ficha: { status: string; numero: string | null; rotulo?: string; url?: string; motivo?: string }
  intencoes: FrIntencao[]
  soma: number
  publicavel: boolean
}

export interface FrPollsData {
  fetchedAt: string
  assinatura: string
  partidos: Record<string, string>
  qualidade: { pesquisas: number; publicaveis: number; fichaDiverge: number; pendentes: number }
  divergencias: { pollId: string; instituto: string; fim: string; numero: string | null; motivo?: string }[]
  pendentes: { numero: string; rotulo: string; url: string }[]
  pesquisas: FrPesquisa[]
}

export interface FrPressItem { titulo: string; url: string; casa: string; publicadoEm: string; origem: string; trilho: 'disputa' | 'metodo' }

export interface FrPressData {
  fetchedAt: string
  veiculos: { casa: string; tipo: string }[]
  qualidade: { publicados: number; naLista: number; foraDaLista: number; veiculosRepresentados: number; tetoPorVeiculo: number; descartadosPorAcompanhamento: number }
  itens: FrPressItem[]
}

export type Leitura<T> = { estado: 'ok'; data: T } | { estado: 'vazio' | 'indisponivel'; data: null }

// ─── Leitura no servidor ─────────────────────────────────────────────────────

async function ultimoRelatorio<T>(prefixo: string, valido: (d: unknown) => d is T): Promise<Leitura<T>> {
  try {
    const { getPrisma } = await import('../db')
    const prisma = getPrisma()
    if (!prisma) return { estado: 'indisponivel', data: null }
    const reg = await prisma.analysisReport.findFirst({
      where: { slug: { startsWith: prefixo } },
      orderBy: { publishedAt: 'desc' },
      select: { bodyMarkdown: true },
    })
    if (!reg) return { estado: 'vazio', data: null }
    const d = JSON.parse(reg.bodyMarkdown) as unknown
    return valido(d) ? { estado: 'ok', data: d } : { estado: 'indisponivel', data: null }
  } catch (e) {
    console.error(`[fr] leitura de ${prefixo} falhou:`, e)
    return { estado: 'indisponivel', data: null }
  }
}

const ehPolls = (d: unknown): d is FrPollsData => !!d && Array.isArray((d as FrPollsData).pesquisas)
const ehPress = (d: unknown): d is FrPressData => !!d && Array.isArray((d as FrPressData).itens) && Array.isArray((d as FrPressData).veiculos)

export const carregarPesquisasFr = () => ultimoRelatorio('fr-polls-', ehPolls)
export const carregarImprensaFr = () => ultimoRelatorio('fr-press-', ehPress)

/** Prontidão da Kalshi lida do diário de capturas. Falha de leitura = NÃO pronto. */
export async function carregarProntidaoKalshi(agora = new Date()): Promise<Prontidao> {
  try {
    const { getPrisma } = await import('../db')
    const prisma = getPrisma()
    if (!prisma) throw new Error('sem banco')
    const capturas = await prisma.kalshiCaptura.findMany({
      where: { pais: 'fra' },
      select: { startedAt: true, ok: true, defeitos: true },
      orderBy: { startedAt: 'asc' },
    })
    return avaliarProntidao(capturas, agora)
  } catch (e) {
    console.error('[fr] prontidão da Kalshi ilegível:', e)
    return { pronto: false, prontoEm: null, motivos: ['diário de capturas ilegível'], capturas: 0, defeituosas: 0, maiorBuracoMin: null }
  }
}

// ─── Resumos de pesquisa (funções puras, testáveis) ──────────────────────────

const DIA = 864e5

/** "20261027_1029_if_A" → "20261027_1029_if": as listas da MESMA rodada de um instituto. */
export const rodadaDe = (pollId: string) => pollId.replace(/_[^_]+$/, '')

/** Sufixo da lista dentro da rodada. A lista "A" é a que o instituto publica primeiro. */
const sufixo = (pollId: string) => pollId.slice(pollId.lastIndexOf('_') + 1)

function recentes(pesquisas: readonly FrPesquisa[], turno: 1 | 2, agora: Date, dias: number) {
  const corte = new Date(agora.getTime() - dias * DIA).toISOString().slice(0, 10)
  return pesquisas.filter((p) => p.publicavel && p.turno === turno && p.campo.fim >= corte)
}

export interface ListaPrincipal {
  instituto: string
  cliente: string
  campo: { inicio: string; fim: string }
  amostra: number | null
  ficha: FrPesquisa['ficha']
  listasNaRodada: number
  intencoes: FrIntencao[]
}

/**
 * (a) A lista PRINCIPAL de cada instituto: a rodada mais recente dele e, dentro
 * dela, a primeira lista publicada (sufixo "A", ou a menor em ordem). Uma por
 * instituto, mais recente primeiro.
 */
export function listaPrincipalPorInstituto(pesquisas: readonly FrPesquisa[], agora: Date, dias = 45): ListaPrincipal[] {
  const porInstituto = new Map<string, FrPesquisa[]>()
  for (const p of recentes(pesquisas, 1, agora, dias)) {
    const k = p.instituto.trim().toLowerCase()
    porInstituto.set(k, [...(porInstituto.get(k) ?? []), p])
  }
  const saida: ListaPrincipal[] = []
  for (const lista of porInstituto.values()) {
    const fim = lista.reduce((m, p) => (p.campo.fim > m ? p.campo.fim : m), '')
    const daUltima = lista.filter((p) => p.campo.fim === fim)
    const rodada = rodadaDe([...daUltima].sort((a, b) => a.pollId.localeCompare(b.pollId))[0].pollId)
    const daRodada = daUltima.filter((p) => rodadaDe(p.pollId) === rodada).sort((a, b) => sufixo(a.pollId).localeCompare(sufixo(b.pollId)))
    const p = daRodada[0]
    saida.push({ instituto: p.instituto, cliente: p.cliente, campo: p.campo, amostra: p.amostra, ficha: p.ficha, listasNaRodada: daRodada.length, intencoes: p.intencoes })
  }
  return saida.sort((a, b) => b.campo.fim.localeCompare(a.campo.fim))
}

export interface MediaCandidato { candidato: string; media: number; minimo: number; maximo: number; listas: number; institutos: number }

/**
 * (b) MÉDIA por candidato, sobre TODAS as listas recentes em que ele aparece.
 * Leva junto o número de listas e de institutos, porque uma média de 2 listas
 * e uma de 40 não valem o mesmo e a tela tem de dizer isso.
 */
export function mediaPorCandidato(pesquisas: readonly FrPesquisa[], agora: Date, dias = 30): MediaCandidato[] {
  const acc = new Map<string, { soma: number; n: number; min: number; max: number; inst: Set<string> }>()
  for (const p of recentes(pesquisas, 1, agora, dias)) {
    for (const i of p.intencoes) {
      const a = acc.get(i.candidato) ?? { soma: 0, n: 0, min: Infinity, max: -Infinity, inst: new Set<string>() }
      a.soma += i.pct
      a.n++
      a.min = Math.min(a.min, i.pct)
      a.max = Math.max(a.max, i.pct)
      a.inst.add(p.instituto.trim().toLowerCase())
      acc.set(i.candidato, a)
    }
  }
  return [...acc.entries()]
    .map(([candidato, a]) => ({ candidato, media: Math.round((a.soma / a.n) * 10) / 10, minimo: a.min, maximo: a.max, listas: a.n, institutos: a.inst.size }))
    .sort((x, y) => y.media - x.media)
}

export interface Duelo { instituto: string; fim: string; ficha: FrPesquisa['ficha']; a: FrIntencao; b: FrIntencao }

/** 2º turno: os duelos da rodada mais recente de cada instituto. */
export function duelosSegundoTurno(pesquisas: readonly FrPesquisa[], agora: Date, dias = 45): Duelo[] {
  const lista = recentes(pesquisas, 2, agora, dias).filter((p) => p.intencoes.length === 2)
  const ultimaPorInstituto = new Map<string, string>()
  for (const p of lista) {
    const k = p.instituto.trim().toLowerCase()
    if ((ultimaPorInstituto.get(k) ?? '') < p.campo.fim) ultimaPorInstituto.set(k, p.campo.fim)
  }
  return lista
    .filter((p) => ultimaPorInstituto.get(p.instituto.trim().toLowerCase()) === p.campo.fim)
    .map((p) => ({ instituto: p.instituto, fim: p.campo.fim, ficha: p.ficha, a: p.intencoes[0], b: p.intencoes[1] }))
    .sort((x, y) => y.fim.localeCompare(x.fim) || x.instituto.localeCompare(y.instituto))
}
