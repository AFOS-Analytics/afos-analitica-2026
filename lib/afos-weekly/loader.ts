/**
 * AFOS Weekly — carregador das edições.
 *
 * ⚠️ MÓDULO ISOLADO DE PROPÓSITO. Ele espelha o desenho do `afos-tradeoff`, mas
 * NÃO importa nada dele e nada dele importa daqui. Produto novo não pode ter
 * como poder quebrar dois produtos que já estão no ar, e um carregador
 * compartilhado seria exatamente esse risco.
 *
 * 🔴 A DIFERENÇA QUE MAIS IMPORTA: AQUI O INGLÊS É A ORIGEM.
 *
 * No Daily e no Tradeoff o arquivo canônico é o português (`{data}.md`) e as
 * traduções levam sufixo. Aqui é o contrário: o canônico é `{data}.md` escrito
 * EM INGLÊS, e as traduções são `{data}.pt-BR.md` e `{data}.es.md`.
 *
 * Consequência prática, decidida pelo André em 01/Ago/2026: quando falta
 * tradução, o leitor cai para o INGLÊS, nunca para o português. Um leitor
 * americano recebendo português seria pior que recebendo a peça original.
 *
 * 📌 PASTA: `public/afos-weekly/{país}/`. Aqui NÃO existe a assimetria do
 * Tradeoff (Brasil na raiz), porque este produto nasceu multipaís: todo país
 * tem subpasta, inclusive o primeiro.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

export const PAISES_WEEKLY = ['us'] as const
export type PaisWeekly = (typeof PAISES_WEEKLY)[number]

export function isValidCountry(c: string): c is PaisWeekly {
  return (PAISES_WEEKLY as readonly string[]).includes(c)
}

/** 🔴 O inglês é a ORIGEM deste produto, não uma tradução. */
export const LOCALE_ORIGEM = 'en' as const
export const SUPPORTED_LOCALES = ['en', 'pt-BR', 'es'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export function isValidLocale(loc: string): loc is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(loc)
}

export function isValidDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date)
}

const RAIZ = join(process.cwd(), 'public', 'afos-weekly')

/** Todo país tem subpasta, sem exceção. */
export function dirDoPais(pais: string): string {
  return join(RAIZ, pais)
}

// ─── Formato de uma edição ──────────────────────────────────────────

export interface WeeklyCard {
  label: string
  headline: string
  unit?: string
  delta?: string
  deltaDirection?: 'up' | 'down' | 'flat'
  desc?: string
}

export interface WeeklyClaim {
  outlet: string
  claim: string
  link?: string
}

/**
 * A Seção 4. ⛔ NÃO carrega rótulo de inclinação política, e isso é decisão do
 * André em 01/Ago/2026: o AFOS não classifica veículo. O que se compara são
 * AFIRMAÇÕES CONFERÍVEIS, com a nossa medição ao lado.
 */
export interface WeeklyCoverage {
  subject: string
  /**
   * 🔴 OBRIGATÓRIO. O que a imprensa cobriu na janela, atribuído por veículo,
   * no modelo da Seção 3 do AFOS Daily.
   *
   * ⚠️ MUDOU EM 03/Ago/2026, por decisão do André. Até aqui a seção tinha
   * `noDivergence` como INTERRUPTOR DE CONTEÚDO: quando ligava, o template
   * trocava a seção inteira por um parágrafo dizendo que não houve divergência.
   * Ou seja, com 22 veículos monitorados e matéria coletada, o leitor recebia
   * uma desculpa. Divergência é o caso EXTRA, nunca a condição para a seção
   * existir.
   *
   * Cada parágrafo atribui o que afirma ao veículo que publicou, com data
   * explícita. Sem juízo de valor e sem rótulo de inclinação.
   */
  narrative: string[]
  /**
   * Divergência conferível, quando existir. Vazio é estado normal e não gera
   * texto de desculpa: a seção já tem a narrativa acima.
   */
  claims: WeeklyClaim[]
  /** O número medido pela casa, que fica ao lado das afirmações divergentes. */
  measurement?: string
}

export interface WeeklyCrossing {
  label: string
  text: string
}

export interface AfosWeeklyData {
  date: string
  issueNumber: number
  weekStart: string
  weekEnd: string
  updatedAt: string
  title: string
  locale: string
  status: string
  /** Idioma realmente servido, que pode ser o de origem se faltar tradução. */
  servedLocale: string
  tldr: string[]
  moneyIntro: string
  cards: WeeklyCard[]
  pollsIntro: string
  dispersion?: { high: string; low: string; amplitude: string; note?: string }
  coverage?: WeeklyCoverage
  crossings: WeeklyCrossing[]
  howToRead?: { title: string; text: string }
  sources: { label: string; items: { source: string; description: string; link: string; paywall?: boolean; hideUrl?: boolean }[] }[]
  methodology: string
}

// ─── Listagem e status ──────────────────────────────────────────────

export function listWeeklies(pais: string): string[] {
  const dir = dirDoPais(pais)
  if (!existsSync(dir)) return []
  try {
    return readdirSync(dir)
      .filter(f => f.endsWith('.md') && !f.includes('.pt-BR.') && !f.includes('.es.'))
      .map(f => f.replace('.md', ''))
      .filter(isValidDate)
      .sort()
  } catch (err) {
    console.error('[afos-weekly] falhou ao listar edições:', err)
    return []
  }
}

const STATUS_RE = /^status:\s*([a-z]+)\s*$/im
const VALIDOS = new Set(['published', 'draft', 'archived'])
const statusCache = new Map<string, { mtime: number; status: string }>()

function lerStatus(date: string, pais: string): string {
  const path = join(dirDoPais(pais), `${date}.md`)
  if (!existsSync(path)) return 'draft'
  let mtime = 0
  try {
    mtime = statSync(path).mtimeMs
  } catch {
    return 'draft'
  }
  const chave = `${pais}:${date}`
  const cached = statusCache.get(chave)
  if (cached && cached.mtime === mtime) return cached.status
  try {
    const head = readFileSync(path, 'utf-8').slice(0, 500)
    const m = head.match(STATUS_RE)
    const status = m && VALIDOS.has(m[1].toLowerCase()) ? m[1].toLowerCase() : 'draft'
    statusCache.set(chave, { mtime, status })
    return status
  } catch {
    return 'draft'
  }
}

export function listPublishedWeeklies(pais: string): string[] {
  return listWeeklies(pais).filter(d => lerStatus(d, pais) === 'published')
}

export function isVisibleInProduction(date: string, pais: string): boolean {
  return lerStatus(date, pais) === 'published'
}

export function getLatestDate(pais: string): string | null {
  const todas = listPublishedWeeklies(pais)
  return todas.length ? todas[todas.length - 1] : null
}

export function getAdjacentDates(date: string, pais: string): { previous?: string; next?: string } {
  const pub = listPublishedWeeklies(pais)
  const todas = pub.includes(date) ? pub : [...pub, date].sort()
  const i = todas.indexOf(date)
  if (i === -1) return {}
  return { previous: i > 0 ? todas[i - 1] : undefined, next: i < todas.length - 1 ? todas[i + 1] : undefined }
}

// ─── Leitura ────────────────────────────────────────────────────────

function str(v: unknown, fb = ''): string {
  return typeof v === 'string' ? v : fb
}
function num(v: unknown, fb: number): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fb
}
function arr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : []
}

/**
 * 🔴 A CASCATA DE IDIOMA, e ela é o inverso da dos outros produtos.
 *
 * Pedido em pt-BR ou es → tenta `{data}.{locale}.md`; faltando, cai para o
 * ORIGEM `{data}.md`, que está em inglês. Pedido em inglês → vai direto ao
 * origem. Nunca se cai para português.
 */
function caminhoDoLocale(date: string, locale: string, pais: string): { path: string; servido: string } | null {
  const dir = dirDoPais(pais)
  if (locale !== LOCALE_ORIGEM) {
    const traduzido = join(dir, `${date}.${locale}.md`)
    if (existsSync(traduzido)) return { path: traduzido, servido: locale }
  }
  const origem = join(dir, `${date}.md`)
  if (existsSync(origem)) return { path: origem, servido: LOCALE_ORIGEM }
  return null
}

export function weeklyExists(date: string, locale: string, pais: string): boolean {
  return caminhoDoLocale(date, locale, pais) !== null
}

export function loadWeekly(date: string, locale: string, pais: string): AfosWeeklyData | null {
  if (!isValidDate(date) || !isValidCountry(pais)) return null
  const alvo = caminhoDoLocale(date, locale, pais)
  if (!alvo) return null

  let fm: Record<string, unknown>
  try {
    fm = matter(readFileSync(alvo.path, 'utf-8')).data as Record<string, unknown>
  } catch (err) {
    console.error(`[afos-weekly] frontmatter ilegível em ${alvo.path}:`, err)
    return null
  }

  // Sem estes quatro a edição não é edição. Descartar é melhor que renderizar
  // uma casca com campos vazios, que o leitor leria como conteúdo faltando.
  if (!fm.date || !fm.title || !fm.issueNumber || !Array.isArray(fm.tldr)) {
    console.warn(`[afos-weekly] ${alvo.path} sem campo obrigatório (date/title/issueNumber/tldr)`)
    return null
  }

  return {
    date: str(fm.date, date),
    issueNumber: num(fm.issueNumber, 1),
    weekStart: str(fm.weekStart),
    weekEnd: str(fm.weekEnd),
    updatedAt: str(fm.updatedAt),
    title: str(fm.title),
    locale: str(fm.locale, alvo.servido),
    status: str(fm.status, 'draft'),
    servedLocale: alvo.servido,
    tldr: arr<string>(fm.tldr).map(x => String(x)),
    moneyIntro: str(fm.moneyIntro),
    cards: arr<WeeklyCard>(fm.cards),
    pollsIntro: str(fm.pollsIntro),
    dispersion: (fm.dispersion as AfosWeeklyData['dispersion']) || undefined,
    coverage: (fm.coverage as WeeklyCoverage) || undefined,
    crossings: arr<WeeklyCrossing>(fm.crossings),
    howToRead: (fm.howToRead as AfosWeeklyData['howToRead']) || undefined,
    sources: arr<AfosWeeklyData['sources'][number]>(fm.sources),
    methodology: str(fm.methodology),
  }
}
