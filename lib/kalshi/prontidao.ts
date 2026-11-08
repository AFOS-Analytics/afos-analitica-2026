/**
 * Quando a Kalshi pode ir para a TELA. Decisão do André em 08/Nov/2026:
 * coletar já, mostrar só depois de 14 dias de captura sem defeito.
 *
 * "Sem defeito" tem três partes, todas medidas no diário `kalshi_capturas`:
 *  1. a série existe há pelo menos 14 dias;
 *  2. nenhuma captura dos últimos 14 dias saiu com defeito;
 *  3. nenhum BURACO: entre duas capturas seguidas (e entre a última e agora)
 *     nunca passou mais que `MAX_BURACO_MIN`. O cron roda a cada 30 min, então
 *     75 min = uma rodada perdida tolerada, duas não.
 *
 * Um defeito ou buraco ZERA o relógio: o painel passa a poder mostrar 14 dias
 * depois do último problema. `prontoEm` diz quando, para ninguém ter de contar.
 *
 * Função PURA (recebe as capturas, não abre banco), para ser testada sem Neon.
 * A tela da França, quando existir, só mostra a Kalshi se `pronto` for true.
 */

export const DIAS_MINIMOS = 14
export const MAX_BURACO_MIN = 75

const DIA_MS = 86_400_000

export interface CapturaResumo {
  startedAt: Date
  ok: boolean
  defeitos: string[]
}

export interface Prontidao {
  pronto: boolean
  /** a partir de quando fica pronto, se nada mais der errado */
  prontoEm: Date | null
  motivos: string[]
  capturas: number
  defeituosas: number
  maiorBuracoMin: number | null
}

export function avaliarProntidao(capturasEmQualquerOrdem: readonly CapturaResumo[], agora: Date): Prontidao {
  const capturas = [...capturasEmQualquerOrdem].sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime())
  if (capturas.length === 0) {
    return { pronto: false, prontoEm: null, motivos: ['nenhuma captura registrada'], capturas: 0, defeituosas: 0, maiorBuracoMin: null }
  }

  const motivos: string[] = []
  // O relógio começa na primeira captura e é zerado por defeito ou buraco.
  let relogio = capturas[0].startedAt.getTime()
  let maiorBuraco = 0
  let defeituosas = 0

  for (let i = 0; i < capturas.length; i++) {
    const c = capturas[i]
    const t = c.startedAt.getTime()
    if (i > 0) {
      const buraco = (t - capturas[i - 1].startedAt.getTime()) / 60_000
      maiorBuraco = Math.max(maiorBuraco, buraco)
      if (buraco > MAX_BURACO_MIN) relogio = t
    }
    if (!c.ok) {
      defeituosas++
      // Recomeça DEPOIS do defeito: a próxima captura boa é o novo dia zero.
      relogio = t
    }
  }

  const ultima = capturas.at(-1) as CapturaResumo
  const desdeUltimaMin = (agora.getTime() - ultima.startedAt.getTime()) / 60_000
  if (desdeUltimaMin > MAX_BURACO_MIN) {
    motivos.push(`a última captura foi há ${Math.round(desdeUltimaMin)} min (limite ${MAX_BURACO_MIN}); a coleta parou`)
    relogio = agora.getTime()
  }

  if (!ultima.ok) motivos.push(`a última captura teve defeito: ${ultima.defeitos.join('; ') || 'sem detalhe'}`)

  const prontoEm = new Date(relogio + DIAS_MINIMOS * DIA_MS)
  const dias = (agora.getTime() - relogio) / DIA_MS
  if (dias < DIAS_MINIMOS) {
    motivos.push(`${dias.toFixed(1)} de ${DIAS_MINIMOS} dias limpos; pronto em ${prontoEm.toISOString()} se nada falhar`)
  }

  return {
    pronto: motivos.length === 0,
    prontoEm,
    motivos,
    capturas: capturas.length,
    defeituosas,
    maiorBuracoMin: capturas.length > 1 ? Math.round(maiorBuraco) : null,
  }
}
