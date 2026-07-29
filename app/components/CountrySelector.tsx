'use client'

import { useTranslation } from '../i18n/context'

/**
 * Seletor de país do painel.
 *
 * Navegação entre /[locale]/dashboard/br e /[locale]/dashboard/us sem passar por
 * tela intermediária: painel é porta de entrada, e pôr escolha na frente de quem
 * quer ver dado é atrito puro (decisão de 27/Jul).
 *
 * ⚠️ UM LUGAR SÓ PARA LIGAR OS EUA: a flag `ready` abaixo. Enquanto ela for false,
 * o item aparece como "em breve" e NÃO é clicável, então nenhum visitante do painel
 * do Brasil é mandado para uma página em construção. Ligar quando o painel dos EUA
 * tiver conteúdo publicável.
 */

type CountryCode = 'br' | 'us'

interface CountryEntry {
  code: CountryCode
  ready: boolean
  label: { 'pt-BR': string; en: string; es: string }
}

const COUNTRIES: CountryEntry[] = [
  { code: 'br', ready: true, label: { 'pt-BR': 'Brasil', en: 'Brazil', es: 'Brasil' } },
  { code: 'us', ready: false, label: { 'pt-BR': 'Estados Unidos', en: 'United States', es: 'Estados Unidos' } },
]

const T = {
  'pt-BR': { heading: 'Painel por país', soon: 'em breve' },
  en: { heading: 'Panel by country', soon: 'coming soon' },
  es: { heading: 'Panel por país', soon: 'próximamente' },
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

        {COUNTRIES.map((c) => {
          const name = c.label[tKey]
          const isActive = c.code === active
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
              className="rounded-sm object-cover"
              style={{ width: 18, height: 12 }}
            />
          )

          // A ordem importa: a página do país sendo montado ainda tem `ready: false`,
          // e mesmo assim precisa se marcar como a atual quando alguém a abre direto.
          if (!c.ready && !isActive) {
            return (
              <span
                key={c.code}
                className="flex items-center gap-1.5 bg-light-bg border border-light-border rounded-lg px-3 py-1.5 text-xs font-medium text-gray-400 cursor-default select-none"
              >
                {flag}
                {name}
                <span className="text-[10px] uppercase tracking-wider text-gray-400">
                  · {t.soon}
                </span>
              </span>
            )
          }

          if (isActive) {
            return (
              <span
                key={c.code}
                aria-current="page"
                className="flex items-center gap-1.5 bg-primary border border-primary rounded-lg px-3 py-1.5 text-xs font-semibold text-white cursor-default select-none"
              >
                {flag}
                {name}
              </span>
            )
          }

          return (
            <a
              key={c.code}
              href={`/${tKey}/dashboard/${c.code}`}
              className="flex items-center gap-1.5 bg-white border border-light-border rounded-lg px-3 py-1.5 text-xs font-medium text-dark hover:border-primary hover:text-primary transition-colors"
            >
              {flag}
              {name}
            </a>
          )
        })}
      </div>
    </nav>
  )
}
