'use client'

import { useTranslation } from '../i18n/context'

/**
 * Cartão de apresentação do painel dos EUA, no topo da página.
 *
 * 🔴 O QUE ELE SUBSTITUI: até 31/Jul este espaço tinha um aviso de obra dizendo
 * "esta página ainda não está publicada e não deve ser divulgada". Aquilo era
 * andaime, endereçado ao André e não ao leitor, e ocupava o PRIMEIRO espaço da
 * ordem de seções aprovada em 28/Jul, que é do cartão do Tradeoff EUA. Como o
 * Tradeoff dos EUA ainda não existe, o André escolheu pôr aqui uma
 * apresentação até ele existir.
 *
 * ⚠️ ESCRITO PARA SOBREVIVER À PUBLICAÇÃO SEM EDIÇÃO. Esse é o teste que o
 * texto anterior não passava: ele precisava ser removido no dia da publicação,
 * e texto que precisa ser lembrado é texto que um dia é esquecido. Nada aqui
 * fala de obra, de rascunho ou de não divulgar.
 *
 * A contagem de dias é calculada, não escrita. Número de prazo digitado à mão
 * envelhece calado.
 */

const ELEICAO_UTC = Date.UTC(2026, 10, 3) // 3 de novembro de 2026

const T = {
  'pt-BR': {
    titulo: 'Painel Estados Unidos',
    subtitulo: 'Eleições de meio de mandato · 3 de novembro de 2026',
    faltam: (d: number) => (d > 0 ? `faltam ${d} dias` : d === 0 ? 'é hoje' : 'eleição realizada'),
    oQueE:
      'Este painel põe lado a lado o que o mercado de previsão precifica e o que as pesquisas medem sobre a disputa pelo Congresso americano.',
    regra:
      'As duas coisas não são somadas nem subtraídas, porque medem grandezas diferentes: o mercado dá a probabilidade de um partido controlar a casa, e a pesquisa dá a vantagem em pontos de voto. O que se cruza aqui é direção e movimento, nunca nível.',
    naoFaz:
      'O AFOS relata o cruzamento. Não faz previsão, não recomenda posição e não diz quem vai ganhar.',
    fonte:
      'Mercado do Polymarket. Pesquisas atribuídas ao instituto que as publicou, cada uma com link para a fonte primária.',
  },
  en: {
    titulo: 'United States panel',
    subtitulo: 'Midterm elections · November 3, 2026',
    faltam: (d: number) => (d > 0 ? `${d} days to go` : d === 0 ? 'today' : 'election held'),
    oQueE:
      'This panel places side by side what the prediction market prices and what the polls measure about the race for the American Congress.',
    regra:
      'The two are neither added nor subtracted, because they measure different quantities: the market gives the probability of a party controlling the chamber, and the poll gives the lead in vote points. What is crossed here is direction and movement, never level.',
    naoFaz:
      'AFOS reports the crossing. It does not forecast, does not recommend a position, and does not say who will win.',
    fonte:
      'Market from Polymarket. Polls attributed to the pollster that published them, each with a link to the primary source.',
  },
  es: {
    titulo: 'Panel Estados Unidos',
    subtitulo: 'Elecciones de medio término · 3 de noviembre de 2026',
    faltam: (d: number) => (d > 0 ? `faltan ${d} días` : d === 0 ? 'es hoy' : 'elección realizada'),
    oQueE:
      'Este panel pone lado a lado lo que el mercado de predicción fija y lo que las encuestas miden sobre la disputa por el Congreso estadounidense.',
    regra:
      'Las dos cosas no se suman ni se restan, porque miden magnitudes distintas: el mercado da la probabilidad de que un partido controle la cámara, y la encuesta da la ventaja en puntos de voto. Lo que se cruza aquí es dirección y movimiento, nunca nivel.',
    naoFaz:
      'El AFOS relata el cruce. No hace pronósticos, no recomienda posiciones y no dice quién va a ganar.',
    fonte:
      'Mercado de Polymarket. Encuestas atribuidas a la encuestadora que las publicó, cada una con enlace a la fuente primaria.',
  },
}

export function UsIntroCard() {
  const { locale } = useTranslation()
  const k = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as keyof typeof T
  const t = T[k]

  const hoje = new Date()
  const hojeUtc = Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate())
  const dias = Math.round((ELEICAO_UTC - hojeUtc) / 86400000)

  return (
    <section className="rounded-xl border border-light-border bg-light-bg p-5">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-xl font-bold text-primary">{t.titulo}</h1>
        <span className="text-sm text-gray-600">{t.subtitulo}</span>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          {t.faltam(dias)}
        </span>
      </div>

      <p className="mt-3 text-sm leading-snug text-gray-800">{t.oQueE}</p>

      {/* A regra do cruzamento aparece já aqui, e não só na ressalva mais
          abaixo, porque é o que distingue este painel de um agregador comum. */}
      <p className="mt-2 text-sm leading-snug text-gray-700">{t.regra}</p>

      <p className="mt-3 border-t border-light-border pt-3 text-xs leading-snug text-gray-600">
        <strong className="text-dark">{t.naoFaz}</strong> {t.fonte}
      </p>
    </section>
  )
}
