'use client'

import { useTranslation } from '../i18n/context'

/**
 * Seletor de país do painel.
 *
 * Navegação entre os painéis (/[locale]/dashboard/<país>) sem passar por
 * tela intermediária: painel é porta de entrada, e pôr escolha na frente de quem
 * quer ver dado é atrito puro (decisão de 27/Jul).
 *
 * 🧭 ORDEM E ESTADO vêm de `lib/paineis.mjs` (desde 12/Nov/2026, decisão do
 * André): painel ao vivo primeiro; encerrado depois, visível e clicável, com selo
 * "encerrado". País em montagem não entra no registro: a página dele não aparece
 * nas outras, e ninguém é mandado para uma página em construção.
 */

import { paineisOrdenados, type CodigoPainel } from '../../lib/paineis.mjs'

type CountryCode = CodigoPainel

const T = {
  'pt-BR': { heading: 'Painel por país', live: 'ao vivo', closed: 'encerrado', closedTitle: 'Cobertura encerrada, com relatório final publicado' },
  en: { heading: 'Panel by country', live: 'live', closed: 'closed', closedTitle: 'Coverage closed, final report published' },
  es: { heading: 'Panel por país', live: 'en vivo', closed: 'cerrado', closedTitle: 'Cobertura cerrada, con informe final publicado' },
}

export function CountrySelector({ active }: { active: CountryCode }) {
  const { locale } = useTranslation()
  const tKey = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as keyof typeof T
  const t = T[tKey]

  return (
    <nav
      aria-label={t.heading}
      className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-8 mt-3 sm:mt-4"
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mr-1">
          {t.heading}
        </span>

        {paineisOrdenados().map((c) => {
          const name = c.label[tKey]
          const isActive = c.code === active
          const encerrado = c.estado === 'encerrado'
          const flag = (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/flags/${c.code}.svg`}
              alt=""
              aria-hidden={true}
              width={18}
              height={12}
              loading="lazy"
              decoding="async"
              className={`rounded-sm object-cover${encerrado && !isActive ? ' opacity-60' : ''}`}
              style={{ width: 18, height: 12 }}
            />
          )
          const selo = encerrado ? (
            <span className={`text-[10px] uppercase tracking-wider ${isActive ? 'text-white/80' : 'text-gray-400'}`}>· {t.closed}</span>
          ) : (
            <span className={`flex items-center gap-1 text-[10px] uppercase tracking-wider ${isActive ? 'text-white/90' : 'text-red-600'}`}>
              <span aria-hidden={true} className={`inline-block w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-red-600'}`} />
              {t.live}
            </span>
          )

          if (isActive) {
            return (
              <span
                key={c.code}
                aria-current="page"
                className="flex items-center gap-1.5 bg-primary border border-primary rounded-lg px-3 py-1.5 text-xs font-semibold text-white cursor-default select-none"
              >
                {flag}
                {name}
                {selo}
              </span>
            )
          }

          return (
            <a
              key={c.code}
              href={`/${tKey}/dashboard/${c.code}`}
              title={encerrado ? t.closedTitle : undefined}
              className={`flex items-center gap-1.5 border rounded-lg px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary transition-colors ${encerrado ? 'bg-light-bg border-light-border text-gray-500' : 'bg-white border-light-border text-dark'}`}
            >
              {flag}
              {name}
              {selo}
            </a>
          )
        })}
      </div>
    </nav>
  )
}
