import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { loadGlossary, type GlossaryEntry } from '../../../lib/glossary/loader'
import { isValidLocale, SUPPORTED_LOCALES } from '../../../lib/afos-daily/loader'

interface PageProps {
  params: { locale: string }
}

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map(locale => ({ locale }))
}

const T = {
  'pt-BR': {
    backToDashboard: '← Voltar ao Dashboard',
    eyebrow: 'Glossário',
    title: 'Termos políticos brasileiros',
    subtitle: 'Conceitos institucionais, partidos, expressões e termos cunhados durante o ciclo eleitoral 2026.',
    firstSeenLabel: 'Primeiro uso:',
    relatedSourcesLabel: 'Fontes relacionadas:',
    homeAriaLabel: 'AFOS Analytics — página inicial',
    types: {
      institutional: 'Instituição',
      electoral_concept: 'Conceito eleitoral',
      polling_institute: 'Instituto de pesquisa',
      prediction_market: 'Mercado de previsão',
      political_party: 'Partido político',
      neologism: 'Neologismo',
      scandal: 'Escândalo',
      event: 'Evento',
    },
    methodLabel: 'Sobre o glossário:',
    methodText: 'este glossário lista termos brasileiros sem tradução direta para EN/ES. Em vez de inventar equivalências, o AFOS Daily mantém o termo em português e linka para esta página explicando-o nos três idiomas. Padrão acadêmico (Stanford, Harvard Brazil studies).',
  },
  en: {
    backToDashboard: '← Back to Dashboard',
    eyebrow: 'Glossary',
    title: 'Brazilian political terms',
    subtitle: 'Institutional concepts, parties, expressions, and terms coined during the 2026 electoral cycle.',
    firstSeenLabel: 'First seen:',
    relatedSourcesLabel: 'Related sources:',
    homeAriaLabel: 'AFOS Analytics — homepage',
    types: {
      institutional: 'Institution',
      electoral_concept: 'Electoral concept',
      polling_institute: 'Polling institute',
      prediction_market: 'Prediction market',
      political_party: 'Political party',
      neologism: 'Neologism',
      scandal: 'Scandal',
      event: 'Event',
    },
    methodLabel: 'About this glossary:',
    methodText: 'this glossary lists Brazilian terms without direct EN/ES translation. Rather than inventing equivalents, AFOS Daily keeps the original Portuguese term and links here for context in all three languages. Standard academic practice (Stanford, Harvard Brazil studies).',
  },
  es: {
    backToDashboard: '← Volver al Dashboard',
    eyebrow: 'Glosario',
    title: 'Términos políticos brasileños',
    subtitle: 'Conceptos institucionales, partidos, expresiones y términos acuñados durante el ciclo electoral 2026.',
    firstSeenLabel: 'Primera mención:',
    relatedSourcesLabel: 'Fuentes relacionadas:',
    homeAriaLabel: 'AFOS Analytics — página principal',
    types: {
      institutional: 'Institución',
      electoral_concept: 'Concepto electoral',
      polling_institute: 'Instituto de encuestas',
      prediction_market: 'Mercado de predicciones',
      political_party: 'Partido político',
      neologism: 'Neologismo',
      scandal: 'Escándalo',
      event: 'Evento',
    },
    methodLabel: 'Sobre el glosario:',
    methodText: 'este glosario lista términos brasileños sin traducción directa al EN/ES. En lugar de inventar equivalencias, AFOS Daily mantiene el término original en portugués y enlaza aquí para contexto en los tres idiomas. Práctica académica estándar (Stanford, Harvard Brazil studies).',
  },
}

export function generateMetadata({ params }: PageProps): Metadata {
  if (!isValidLocale(params.locale)) {
    return { title: 'Glossary | AFOS Analytics' }
  }
  const locale = params.locale as keyof typeof T
  const t = T[locale]
  return {
    title: `${t.title} | AFOS Analytics`,
    description: t.subtitle,
    robots: { index: false, follow: false },
    alternates: {
      canonical: `https://afos-analytics.com/${locale}/glossary`,
      languages: SUPPORTED_LOCALES.reduce<Record<string, string>>((acc, l) => {
        acc[l] = `https://afos-analytics.com/${l}/glossary`
        return acc
      }, { 'x-default': `https://afos-analytics.com/pt-BR/glossary` }),
    },
    openGraph: {
      type: 'website',
      title: t.title,
      description: t.subtitle,
      url: `https://afos-analytics.com/${locale}/glossary`,
      siteName: 'AFOS Analytics',
      locale,
    },
  }
}

function buildDefinedTermsSchema(entries: GlossaryEntry[], locale: 'pt-BR' | 'en' | 'es') {
  return {
    '@context': 'https://schema.org',
    '@graph': entries.map(e => ({
      '@type': 'DefinedTerm',
      '@id': `https://afos-analytics.com/${locale}/glossary#${e.id}`,
      name: e.term,
      description: e.definitions[locale],
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        name: 'AFOS Analytics — Brazilian political terms glossary',
        url: `https://afos-analytics.com/${locale}/glossary`,
      },
      ...(e.url ? { url: e.url } : {}),
    })),
  }
}

export default function GlossaryPage({ params }: PageProps) {
  if (!isValidLocale(params.locale)) notFound()
  const locale = params.locale as keyof typeof T
  const t = T[locale]
  const items = loadGlossary()
  const schema = buildDefinedTermsSchema(items, locale)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="min-h-screen bg-slate-50">
        <article className="max-w-[760px] mx-auto px-5 md:px-10 py-12 md:py-14">
          <nav className="mb-10 text-sm">
            <a href={`/${locale}/dashboard`} className="text-primary hover:underline">{t.backToDashboard}</a>
          </nav>

          <div className="flex justify-center mb-6">
            <a href={`/${locale}`} aria-label={t.homeAriaLabel} className="hover:opacity-90 transition-opacity">
              <span className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">AFOS Analytics</span>
            </a>
          </div>

          <p className="text-center text-xs font-extrabold text-primary uppercase tracking-[0.25em] mb-2">{t.eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary text-center mb-3 tracking-tight leading-tight">
            {t.title}
          </h1>
          <p className="text-center text-gray-600 text-base font-medium mb-12 max-w-[600px] mx-auto">
            {t.subtitle}
          </p>

          <dl className="space-y-8">
            {items.map(entry => (
              <div key={entry.id} id={entry.id} className="border-l-4 border-blue-100 pl-5 py-2 scroll-mt-24">
                <dt className="flex flex-wrap items-baseline gap-3 mb-2">
                  <span className="text-2xl font-bold text-dark">{entry.term}</span>
                  <span className="text-xs font-medium uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {t.types[entry.type]}
                  </span>
                  {entry.firstSeen && (
                    <span className="text-xs text-gray-400">
                      {t.firstSeenLabel} {entry.firstSeen}
                    </span>
                  )}
                </dt>
                <dd className="text-gray-700 leading-relaxed mb-2">
                  {entry.definitions[locale]}
                </dd>
                {entry.url && (
                  <p className="text-xs">
                    <a href={entry.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {entry.url}
                    </a>
                  </p>
                )}
                {entry.relatedSources && entry.relatedSources.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    <strong>{t.relatedSourcesLabel}</strong>{' '}
                    {entry.relatedSources.map((s, i) => (
                      <span key={s.url}>
                        {i > 0 && ' · '}
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {s.label}
                        </a>
                        {s.date && <span className="text-gray-400"> ({s.date})</span>}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            ))}
          </dl>

          <div className="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
            <p>
              <strong className="text-gray-700">{t.methodLabel}</strong> {t.methodText}
            </p>
          </div>
        </article>
      </div>
    </>
  )
}
