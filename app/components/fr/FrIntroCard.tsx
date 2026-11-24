'use client'

import { useTranslation } from '../../i18n/context'

/**
 * Cartão de apresentação do painel da FRANÇA (23/Nov/2026, decisão do André).
 *
 * Substitui o texto diário do painel (`FrAnaliseSection`, ~1.000 palavras), que
 * envelhecia sozinho à meia-noite UTC quando a janela de 45 dias andava. A
 * leitura cruzada da semana passou para as edições (Weekly às segundas,
 * Tradeoff às quintas), cujos cartões ficam logo acima deste.
 *
 * Molde: `UsIntroCard`. Regra do molde: ESCRITO PARA NÃO ENVELHECER. Nenhum
 * preço, média ou contagem aqui. As únicas datas são as dos turnos, e a
 * contagem de dias é calculada, não escrita.
 */

const PRIMEIRO_TURNO_UTC = Date.UTC(2027, 3, 18) // 18 de abril de 2027
const SEGUNDO_TURNO_UTC = Date.UTC(2027, 4, 2) // 2 de maio de 2027

const T = {
  'pt-BR': {
    titulo: 'Painel França',
    subtitulo: 'Eleição presidencial · 1º turno em 18 de abril e 2º turno em 2 de maio de 2027',
    faltam1: (d: number) => (d === 0 ? '1º turno é hoje' : `faltam ${d} dias para o 1º turno`),
    faltam2: (d: number) => (d === 0 ? '2º turno é hoje' : `faltam ${d} dias para o 2º turno`),
    realizada: 'eleição realizada',
    oQueE:
      'Este painel põe lado a lado três medições da eleição presidencial francesa: o preço em dois mercados de previsão, Polymarket e Kalshi; as pesquisas de intenção de voto, cada uma conferida com a ficha oficial da Commission des sondages; e a cobertura da imprensa francesa.',
    regra:
      'Nada é somado nem posto em média. Os dois mercados aparecem lado a lado, com a distância entre eles em pontos, e o preço nunca é subtraído da pesquisa: o mercado paga a vitória na eleição, e a pesquisa mede a intenção de voto num turno, numa dada lista de candidatos.',
    naoFaz: 'O AFOS relata o cruzamento. Não faz previsão, não recomenda posição e não diz quem vai ganhar.',
    lei: 'No sábado e no domingo de cada turno, pesquisas e preços ficam congelados, como manda a lei francesa de 1977.',
  },
  en: {
    titulo: 'France panel',
    subtitulo: 'Presidential election · first round on April 18 and runoff on May 2, 2027',
    faltam1: (d: number) => (d === 0 ? 'first round is today' : `${d} days to the first round`),
    faltam2: (d: number) => (d === 0 ? 'runoff is today' : `${d} days to the runoff`),
    realizada: 'election held',
    oQueE:
      'This panel places three measurements of the French presidential election side by side: the price in two prediction markets, Polymarket and Kalshi; the voting-intention polls, each checked against its official notice at the Commission des sondages; and the coverage in the French press.',
    regra:
      'Nothing is added up or averaged. The two markets appear side by side, with the gap between them in points, and the price is never subtracted from a poll: the market pays on winning the election, and the poll measures voting intention in one round, for a given list of candidates.',
    naoFaz: 'AFOS reports the crossing. It does not forecast, does not recommend a position, and does not say who will win.',
    lei: 'On the Saturday and Sunday of each round, polls and prices are frozen, as French law of 1977 requires.',
  },
  es: {
    titulo: 'Panel Francia',
    subtitulo: 'Elección presidencial · primera vuelta el 18 de abril y segunda vuelta el 2 de mayo de 2027',
    faltam1: (d: number) => (d === 0 ? 'la primera vuelta es hoy' : `faltan ${d} días para la primera vuelta`),
    faltam2: (d: number) => (d === 0 ? 'la segunda vuelta es hoy' : `faltan ${d} días para la segunda vuelta`),
    realizada: 'elección realizada',
    oQueE:
      'Este panel pone lado a lado tres mediciones de la elección presidencial francesa: el precio en dos mercados de predicción, Polymarket y Kalshi; las encuestas de intención de voto, cada una cotejada con su ficha oficial en la Commission des sondages; y la cobertura de la prensa francesa.',
    regra:
      'Nada se suma ni se promedia. Los dos mercados aparecen lado a lado, con la distancia entre ellos en puntos, y el precio nunca se resta de una encuesta: el mercado paga la victoria en la elección, y la encuesta mide la intención de voto en una vuelta, para una lista dada de candidatos.',
    naoFaz: 'El AFOS relata el cruce. No hace pronósticos, no recomienda posiciones y no dice quién va a ganar.',
    lei: 'El sábado y el domingo de cada vuelta, encuestas y precios quedan congelados, como manda la ley francesa de 1977.',
  },
}

export function FrIntroCard() {
  const { locale } = useTranslation()
  const k = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as keyof typeof T
  const t = T[k]

  const hoje = new Date()
  const hojeUtc = Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate())
  const d1 = Math.round((PRIMEIRO_TURNO_UTC - hojeUtc) / 86400000)
  const d2 = Math.round((SEGUNDO_TURNO_UTC - hojeUtc) / 86400000)
  const pilula = d1 >= 0 ? t.faltam1(d1) : d2 >= 0 ? t.faltam2(d2) : t.realizada

  return (
    <section className="rounded-xl border border-light-border bg-light-bg p-5">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-xl font-bold text-primary">{t.titulo}</h1>
        <span className="text-sm text-gray-600">{t.subtitulo}</span>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary" suppressHydrationWarning>
          {pilula}
        </span>
      </div>

      <p className="mt-3 text-sm leading-snug text-gray-800">{t.oQueE}</p>
      <p className="mt-2 text-sm leading-snug text-gray-700">{t.regra}</p>

      <p className="mt-3 border-t border-light-border pt-3 text-xs leading-snug text-gray-600">
        <strong className="text-dark">{t.naoFaz}</strong> {t.lei}
      </p>
    </section>
  )
}
