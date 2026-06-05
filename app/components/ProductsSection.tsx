'use client'

type Locale = 'pt-BR' | 'en' | 'es'

interface Props {
  locale: Locale
  isBlue?: boolean
}

const T = {
  'pt-BR': {
    sectionLabel: 'Nossas análises',
    sectionTitle: 'Para você ler sobre risco político eleitoral',
    sectionTitleMobileLine1: 'Para você ler sobre',
    sectionTitleMobileLine2: 'risco político eleitoral',
    daily: {
      title: 'AFOS Daily',
      badge: 'Diário',
      desc: 'Síntese narrativa do dia cruzando Polymarket, pesquisas TSE e imprensa. Lê em 5 minutos.',
      cta: 'Ler último Daily',
    },
    tradeoff: {
      title: 'AFOS Tradeoff',
      badge: 'Semanal · Segundas',
      desc: 'Brief técnico semanal sem médias suavizadas. Audiência: research, buy-side, treasury.',
      cta: 'Ler tradeoff',
    },
    global: {
      title: 'AFOS Global',
      badge: '14+ países',
      desc: 'Mapa interativo de eleições cobertas globalmente. Brasil 2026 e além.',
      cta: 'Explorar mapa',
    },
    metodo: {
      title: 'O Método',
      badge: 'Comece aqui',
      desc: 'Guia didático de como o AFOS cruza mercados, pesquisas e imprensa — e por que sinaliza divergências.',
      cta: 'Como funciona',
    },
  },
  en: {
    sectionLabel: 'Our analyses',
    sectionTitle: 'For you to read about electoral political risk',
    sectionTitleMobileLine1: 'For you to read about',
    sectionTitleMobileLine2: 'electoral political risk',
    daily: {
      title: 'AFOS Daily',
      badge: 'Daily',
      desc: 'Narrative synthesis cross-referencing Polymarket, polls, and news. Reads in 5 minutes.',
      cta: 'Read latest Daily',
    },
    tradeoff: {
      title: 'AFOS Tradeoff',
      badge: 'Weekly · Mondays',
      desc: 'Technical weekly brief without smoothed averages. Audience: research, buy-side, treasury.',
      cta: 'Read Tradeoff',
    },
    global: {
      title: 'AFOS Global',
      badge: '14+ countries',
      desc: 'Interactive map of elections covered globally. Brazil 2026 and beyond.',
      cta: 'Explore map',
    },
    metodo: {
      title: 'The Method',
      badge: 'Start here',
      desc: 'A didactic guide to how AFOS cross-references markets, polls and press — and why it flags divergences.',
      cta: 'How it works',
    },
  },
  es: {
    sectionLabel: 'Nuestros análisis',
    sectionTitle: 'Para que leas sobre riesgo político electoral',
    sectionTitleMobileLine1: 'Para que leas sobre',
    sectionTitleMobileLine2: 'riesgo político electoral',
    daily: {
      title: 'AFOS Daily',
      badge: 'Diario',
      desc: 'Síntesis narrativa diaria cruzando Polymarket, encuestas y prensa. Se lee en 5 minutos.',
      cta: 'Leer último Daily',
    },
    tradeoff: {
      title: 'AFOS Tradeoff',
      badge: 'Semanal · Lunes',
      desc: 'Brief técnico semanal sin promedios suavizados. Audiencia: research, buy-side, treasury.',
      cta: 'Leer Tradeoff',
    },
    global: {
      title: 'AFOS Global',
      badge: '14+ países',
      desc: 'Mapa interactivo de elecciones cubiertas globalmente. Brasil 2026 y más.',
      cta: 'Explorar mapa',
    },
    metodo: {
      title: 'El Método',
      badge: 'Empieza aquí',
      desc: 'Guía didáctica de cómo AFOS cruza mercados, encuestas y prensa — y por qué señala divergencias.',
      cta: 'Cómo funciona',
    },
  },
}

export function ProductsSection({ locale, isBlue = false }: Props) {
  const t = T[locale]
  const dailyUrl = `/${locale}/daily`
  const tradeoffUrl = `/${locale}/tradeoff`
  const globalUrl = `/${locale}/global`
  const metodoUrl = `/${locale}/how-it-works`

  // Inverted color scheme by user request (23/Mai noite):
  // Light theme (page is white) → cards are dark Sapphire Blue → standout
  // Sapphire Blue theme (page is blue) → cards are light → standout
  // Goal: cards always contrast with page bg for first-view visibility
  const cardBg = isBlue
    ? 'bg-white hover:bg-blue-50 border-white'
    : 'bg-primary hover:bg-primary-dark border-primary'
  const titleColor = isBlue ? 'text-primary' : 'text-white'
  const badgeColor = isBlue ? 'text-dark bg-blue-100' : 'text-white bg-white/15'
  const descColor = isBlue ? 'text-gray-700' : 'text-white/90'
  const ctaColor = isBlue ? 'text-primary' : 'text-white'
  const sectionLabelColor = isBlue ? 'text-blue-200' : 'text-primary'
  const sectionTitleColor = isBlue ? 'text-white' : 'text-dark'

  return (
    <section className="pt-1 pb-4 sm:pt-2 sm:pb-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <p className={`text-xs font-bold tracking-[0.18em] uppercase mb-2 ${sectionLabelColor}`}>
            {t.sectionLabel}
          </p>
          <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${sectionTitleColor}`}>
            {/* Mobile: 2 linhas controladas (Opções para você ler o / mercado eleitoral) */}
            <span className="sm:hidden">
              {t.sectionTitleMobileLine1}<br />{t.sectionTitleMobileLine2}
            </span>
            {/* Desktop/tablet: linha única */}
            <span className="hidden sm:inline">{t.sectionTitle}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href={metodoUrl}
            className={`block rounded-xl px-5 py-2.5 border ${cardBg} transition-colors group`}
            aria-label={`${t.metodo.title}: ${t.metodo.cta}`}
          >
            <div className="flex items-baseline gap-2.5 mb-1 flex-wrap">
              <span className={`text-base font-extrabold uppercase tracking-[0.12em] ${titleColor}`}>{t.metodo.title}</span>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded whitespace-nowrap ${badgeColor}`}>{t.metodo.badge}</span>
            </div>
            <p className={`text-sm leading-snug mb-1.5 ${descColor}`}>{t.metodo.desc}</p>
            <span className={`text-sm font-semibold group-hover:underline ${ctaColor}`}>{t.metodo.cta} →</span>
          </a>

          <a
            href={dailyUrl}
            className={`block rounded-xl px-5 py-2.5 border ${cardBg} transition-colors group`}
            aria-label={`${t.daily.title}: ${t.daily.cta}`}
          >
            <div className="flex items-baseline gap-2.5 mb-1 flex-wrap">
              <span className={`text-base font-extrabold uppercase tracking-[0.12em] ${titleColor}`}>{t.daily.title}</span>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded whitespace-nowrap ${badgeColor}`}>{t.daily.badge}</span>
            </div>
            <p className={`text-sm leading-snug mb-1.5 ${descColor}`}>{t.daily.desc}</p>
            <span className={`text-sm font-semibold group-hover:underline ${ctaColor}`}>{t.daily.cta} →</span>
          </a>

          <a
            href={tradeoffUrl}
            className={`block rounded-xl px-5 py-2.5 border ${cardBg} transition-colors group`}
            aria-label={`${t.tradeoff.title}: ${t.tradeoff.cta}`}
          >
            <div className="flex items-baseline gap-2.5 mb-1 flex-wrap">
              <span className={`text-base font-extrabold uppercase tracking-[0.12em] ${titleColor}`}>{t.tradeoff.title}</span>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded whitespace-nowrap ${badgeColor}`}>{t.tradeoff.badge}</span>
            </div>
            <p className={`text-sm leading-snug mb-1.5 ${descColor}`}>{t.tradeoff.desc}</p>
            <span className={`text-sm font-semibold group-hover:underline ${ctaColor}`}>{t.tradeoff.cta} →</span>
          </a>

          <a
            href={globalUrl}
            className={`block rounded-xl px-5 py-2.5 border ${cardBg} transition-colors group`}
            aria-label={`${t.global.title}: ${t.global.cta}`}
          >
            <div className="flex items-baseline gap-2.5 mb-1 flex-wrap">
              <span className={`text-base font-extrabold uppercase tracking-[0.12em] ${titleColor}`}>{t.global.title}</span>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded whitespace-nowrap ${badgeColor}`}>{t.global.badge}</span>
            </div>
            <p className={`text-sm leading-snug mb-1.5 ${descColor}`}>{t.global.desc}</p>
            <span className={`text-sm font-semibold group-hover:underline ${ctaColor}`}>{t.global.cta} →</span>
          </a>
        </div>
      </div>
    </section>
  )
}
