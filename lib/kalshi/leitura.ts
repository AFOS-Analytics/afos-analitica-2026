/**
 * Leitura da Kalshi: UM lugar só, usado pela rota `/api/kalshi` (tela e
 * scripts locais) e pelo coletor `/api/cron/refresh-kalshi` (série no Neon).
 * Criado 08/Nov/2026 para o painel da França.
 *
 * Roda NA VERCEL. O DNS do provedor local não resolve api.elections.kalshi.com
 * (medido em 08/Nov/2026), então script local nunca importa isto para ler a
 * Kalshi direto: lê a rota `/api/kalshi`.
 *
 * 📌 Duas cópias da mesma regra divergem; por isso a normalização, o registro
 * de eventos e a avaliação de defeito moram aqui e em nenhum outro lugar.
 */

export const KALSHI_API = 'https://api.elections.kalshi.com/trade-api/v2'

export type PaisKalshi = 'fra'

/** Lista FECHADA: país → eventos lidos para ele, com a chave da tela. Sem padrão. */
export const EVENTOS_KALSHI: Record<PaisKalshi, readonly { key: string; eventTicker: string }[]> = {
  fra: [{ key: 'winner', eventTicker: 'KXFRENCHPRES-27' }],
}

const ALIAS_PAIS: Record<string, PaisKalshi> = { fra: 'fra', fr: 'fra' }

export const PAISES_ACEITOS = Object.keys(ALIAS_PAIS)

/** `null` para ausente OU desconhecido. Esta leitura NÃO tem país padrão. */
export function resolverPaisKalshi(valor: string | null): PaisKalshi | null {
  if (valor === null) return null
  return ALIAS_PAIS[valor.trim().toLowerCase()] ?? null
}

export interface ContratoKalshi {
  ticker: string
  candidato: string
  subtitulo: string
  status: string
  resultado: string
  /** último negócio, em pontos (0 a 100) */
  ultimo: number | null
  /** melhor oferta de compra do Sim, em pontos */
  compra: number | null
  /** melhor oferta de venda do Sim, em pontos */
  venda: number | null
  anterior: number | null
  volumeContratos: number | null
  volume24hContratos: number | null
  contratosEmAberto: number | null
  fechamento: string | null
  /**
   * ⚠️ Data da última alteração do CADASTRO do contrato (regras, nome), NÃO do
   * preço. Em 08/Nov/2026 dizia 23/Out com o livro negociando no mesmo dia.
   */
  cadastroAtualizadoEm: string | null
  /** hora do último negócio, lida em /markets/trades; só para contratos relevantes */
  ultimaNegociacaoEm: string | null
}

export interface EventoKalshi {
  eventTicker: string
  title: string | null
  contratos: ContratoKalshi[]
}

/** Preço da Kalshi vem como string em dólares ("0.4700"). Devolve em pontos (47.00). */
export function pontos(v: unknown): number | null {
  const n = typeof v === 'string' ? Number(v) : typeof v === 'number' ? v : NaN
  return Number.isFinite(n) ? Number((n * 100).toFixed(2)) : null
}

function numero(v: unknown): number | null {
  const n = typeof v === 'string' ? Number(v) : typeof v === 'number' ? v : NaN
  return Number.isFinite(n) ? n : null
}

export function normalizarContrato(m: Record<string, unknown>): ContratoKalshi {
  return {
    ticker: String(m.ticker ?? ''),
    candidato: String(m.yes_sub_title ?? ''),
    subtitulo: String(m.subtitle ?? '').replace(/^::\s*/, ''),
    status: String(m.status ?? ''),
    resultado: String(m.result ?? ''),
    ultimo: pontos(m.last_price_dollars),
    compra: pontos(m.yes_bid_dollars),
    venda: pontos(m.yes_ask_dollars),
    anterior: pontos(m.previous_price_dollars),
    volumeContratos: numero(m.volume_fp),
    volume24hContratos: numero(m.volume_24h_fp),
    contratosEmAberto: numero(m.open_interest_fp),
    fechamento: typeof m.close_time === 'string' ? m.close_time : null,
    cadastroAtualizadoEm: typeof m.updated_time === 'string' ? m.updated_time : null,
    ultimaNegociacaoEm: null,
  }
}

type Fetch = typeof fetch

/** Lê todos os contratos de um evento. `null` em qualquer falha de transporte ou formato. */
export async function lerEventoKalshi(
  eventTicker: string,
  opcoes: { fresh: boolean; fetcher?: Fetch; revalidateS?: number },
): Promise<EventoKalshi | null> {
  const f = opcoes.fetcher ?? fetch
  // O ticker vem da lista fechada, nunca do pedido; o formato é checado mesmo
  // assim, para um erro de digitação no registro não virar URL estranha.
  if (!/^[A-Z0-9-]+$/.test(eventTicker)) return null

  const contratos: ContratoKalshi[] = []
  let cursor = ''
  let title: string | null = null
  // 200 por página; mais de 1.000 contratos num evento é erro de registro, e o
  // limite de 5 páginas impede laço infinito.
  for (let pagina = 0; pagina < 5; pagina++) {
    const url = `${KALSHI_API}/markets?event_ticker=${eventTicker}&limit=200${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`
    try {
      const res = await f(url, {
        ...(opcoes.fresh ? { cache: 'no-store' as const } : { next: { revalidate: opcoes.revalidateS ?? 1800 } }),
        signal: AbortSignal.timeout(15000),
        headers: { Accept: 'application/json' },
      } as RequestInit)
      if (!res.ok) {
        console.error(`[kalshi] HTTP ${res.status} em ${eventTicker}`)
        return null
      }
      const j = (await res.json()) as { cursor?: string; markets?: Record<string, unknown>[] }
      if (!Array.isArray(j.markets)) return null
      for (const m of j.markets) {
        if (title === null && typeof m.title === 'string') title = m.title
        contratos.push(normalizarContrato(m))
      }
      cursor = j.cursor ?? ''
      if (!cursor) break
    } catch (error) {
      console.error(`[kalshi] falha ao ler ${eventTicker}:`, error)
      return null
    }
  }
  if (contratos.length === 0) return null
  contratos.sort((a, b) => (b.ultimo ?? -1) - (a.ultimo ?? -1))
  return { eventTicker, title, contratos }
}

/**
 * Hora do último negócio de um contrato (/markets/trades, o mais recente).
 * É a trava de frescor de verdade: a Kalshi não carimba o preço, mas carimba
 * cada negócio. `null` = sem negócio registrado ou falha na leitura.
 */
export async function lerUltimaNegociacao(ticker: string, fetcher: Fetch = fetch): Promise<string | null> {
  if (!/^[A-Z0-9-]+$/.test(ticker)) return null
  try {
    const res = await fetcher(`${KALSHI_API}/markets/trades?ticker=${ticker}&limit=1`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return null
    const j = (await res.json()) as { trades?: { created_time?: unknown }[] }
    const t = j.trades?.[0]?.created_time
    return typeof t === 'string' ? t : null
  } catch {
    return null
  }
}

/** Abaixo disto o contrato é ruído de livro fino; não vale a leitura de negócio. */
export const PISO_RELEVANCIA_PONTOS = 1

/** Preenche `ultimaNegociacaoEm` dos contratos com preço relevante, em paralelo. */
export async function preencherUltimasNegociacoes(evento: EventoKalshi, fetcher: Fetch = fetch): Promise<void> {
  const relevantes = evento.contratos.filter((c) => (c.ultimo ?? 0) >= PISO_RELEVANCIA_PONTOS)
  const horas = await Promise.all(relevantes.map((c) => lerUltimaNegociacao(c.ticker, fetcher)))
  relevantes.forEach((c, i) => {
    c.ultimaNegociacaoEm = horas[i]
  })
}

// ─── Avaliação de uma captura: DEFEITO bloqueia, AVISO só registra ────────────

/**
 * Um livro de vencedor (um contrato Sim/Não por candidato) soma perto de 100.
 * Em 08/Nov/2026 a soma dos últimos negócios era 105,8. Fora desta faixa o
 * livro está quebrado ou a leitura veio pela metade.
 */
export const SOMA_MIN = 85
export const SOMA_MAX = 120

/** Líder sem negócio há mais que isto: o preço pode estar parado. */
export const LIDER_PARADO_H = 24

export interface Avaliacao {
  ok: boolean
  defeitos: string[]
  avisos: string[]
  somaPrecos: number | null
}

export function avaliarCaptura(evento: EventoKalshi | null, agora: Date): Avaliacao {
  const defeitos: string[] = []
  const avisos: string[] = []
  if (!evento) {
    return { ok: false, defeitos: ['leitura falhou (transporte ou formato)'], avisos, somaPrecos: null }
  }
  const vivos = evento.contratos.filter((c) => c.status === 'active')
  if (vivos.length === 0) defeitos.push('nenhum contrato ativo')

  const comPreco = vivos.filter((c) => c.ultimo !== null)
  const soma = comPreco.length ? Number(comPreco.reduce((s, c) => s + (c.ultimo ?? 0), 0).toFixed(2)) : null
  if (soma !== null && (soma < SOMA_MIN || soma > SOMA_MAX)) {
    defeitos.push(`soma dos preços ${soma} fora de ${SOMA_MIN} a ${SOMA_MAX}`)
  }

  const lider = comPreco[0]
  if (lider) {
    if (lider.compra === null || lider.venda === null) {
      defeitos.push(`líder ${lider.candidato} sem oferta de compra ou de venda`)
    } else if (lider.venda < lider.compra) {
      defeitos.push(`líder ${lider.candidato} com livro cruzado (compra ${lider.compra} > venda ${lider.venda})`)
    }
    if (lider.ultimaNegociacaoEm === null) {
      avisos.push(`líder ${lider.candidato} sem hora de último negócio`)
    } else {
      const h = (agora.getTime() - Date.parse(lider.ultimaNegociacaoEm)) / 3_600_000
      if (h > LIDER_PARADO_H) avisos.push(`líder ${lider.candidato} sem negócio há ${h.toFixed(1)}h`)
    }
  }
  return { ok: defeitos.length === 0, defeitos, avisos, somaPrecos: soma }
}
