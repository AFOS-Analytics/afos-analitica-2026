'use client'

import { SubscribeForm } from './SubscribeForm'

/**
 * Bloco de inscrição no FIM das edições publicadas (AFOS Daily e Tradeoff).
 *
 * Por que existe (22/Jul/2026): o Daily e o Tradeoff eram os únicos conteúdos
 * recorrentes da plataforma SEM caminho de assinatura na própria página. O
 * formulário só vivia na landing, no popup e no portão do dashboard, ou seja,
 * o leitor terminava o texto já convencido e não tinha onde deixar o e-mail.
 *
 * Arquitetura reusada, não duplicada: o mesmo <SubscribeForm> da landing, logo
 * herda honeypot, validação, consentimento LGPD, correção de typo e o redirect
 * para /welcome, que é onde o assinante ESCOLHE o idioma em que quer receber.
 *
 * `captureSource` separa 'daily' e 'tradeoff' das demais origens para medir se
 * o conteúdo converte, sem depender de tracking em e-mail.
 */

const T = {
  'pt-BR': {
    eyebrow: 'Receba por e-mail',
    daily: 'Todos os dias, o AFOS Daily cruza mercados de previsão, pesquisas registradas no TSE, imprensa e a cobertura do dia.',
    tradeoff: 'O AFOS Tradeoff é a leitura semanal de risco político do Brasil, para quem decide com base em dado, não em manchete.',
    weekly: 'O AFOS Weekly acompanha as midterms dos EUA toda quinta, para o eleitor: onde o mercado de previsão, as pesquisas e a imprensa discordam, e o que cada um mede.',
    langNote: 'Depois do cadastro você escolhe se quer receber em português, inglês ou espanhol.',
  },
  en: {
    eyebrow: 'Get it by email',
    daily: 'Every day, AFOS Daily cross-references prediction markets, polls registered with the Brazilian electoral court, the press and the day’s coverage.',
    tradeoff: 'AFOS Tradeoff is the weekly read on Brazilian political risk, for people who decide on data rather than headlines.',
    weekly: 'AFOS Weekly follows the US midterms every Thursday, written for voters: where the prediction market, the polls and the press disagree, and what each one measures.',
    langNote: 'After signing up you choose whether to receive it in English, Portuguese or Spanish.',
  },
  es: {
    eyebrow: 'Recíbelo por correo',
    daily: 'Todos los días, AFOS Daily cruza mercados de predicción, encuestas registradas en el TSE, la prensa y la cobertura del día.',
    tradeoff: 'AFOS Tradeoff es la lectura semanal de riesgo político de Brasil, para quien decide con datos y no con titulares.',
    weekly: 'AFOS Weekly sigue las midterms de EE. UU. cada jueves, escrito para el votante: dónde el mercado de predicción, las encuestas y la prensa discrepan, y qué mide cada uno.',
    langNote: 'Después del registro eliges si quieres recibirlo en español, portugués o inglés.',
  },
} as const

type Loc = keyof typeof T

interface InlineSubscribeProps {
  locale: string
  /** Tema da página hospedeira: o Sapphire Blue do Daily/Tradeoff. */
  isBlue: boolean
  /** Define a cópia e a origem registrada do cadastro. */
  product: 'daily' | 'tradeoff' | 'weekly'
  /** País da edição. Só o Tradeoff precisa: ele roda BR e US no mesmo template. */
  country?: string
}

export function InlineSubscribe({ locale, isBlue, product, country }: InlineSubscribeProps) {
  const loc: Loc = locale === 'en' || locale === 'es' ? locale : 'pt-BR'
  const t = T[loc]

  // A cópia continua vindo do `product`; só a ORIGEM registrada é qualificada,
  // e apenas para o Tradeoff, que é o único que roda dois países no mesmo
  // template. Sem isto, não dá para medir qual dos dois converte.
  const origem = product === 'tradeoff' && (country === 'br' || country === 'us')
    ? (`tradeoff-${country}` as const)
    : product

  const shell = isBlue
    ? 'bg-white/10 border-white/20'
    : 'bg-slate-50 border-slate-200'
  const eyebrowColor = isBlue ? 'text-blue-200' : 'text-primary'
  const bodyColor = isBlue ? 'text-blue-100' : 'text-gray-700'
  const noteColor = isBlue ? 'text-blue-200/80' : 'text-gray-500'

  return (
    <section
      aria-labelledby={`subscribe-${product}`}
      className={`mt-14 rounded-2xl border px-6 py-7 sm:px-8 sm:py-8 text-center ${shell}`}
    >
      <p id={`subscribe-${product}`} className={`text-[13px] font-semibold uppercase tracking-[0.16em] mb-3 ${eyebrowColor}`}>
        {t.eyebrow}
      </p>
      <p className={`text-sm leading-relaxed mb-6 max-w-[58ch] mx-auto ${bodyColor}`}>
        {product === 'daily' ? t.daily : product === 'weekly' ? t.weekly : t.tradeoff}
      </p>

      {/* Formulário centralizado; o rótulo de consentimento segue alinhado à
          esquerda dentro dele, que é o comportamento correto para caixa de marcar. */}
      <div className="max-w-md mx-auto text-left">
        <SubscribeForm captureSource={origem} />
      </div>

      <p className={`text-xs mt-3 ${noteColor}`}>{t.langNote}</p>
    </section>
  )
}
