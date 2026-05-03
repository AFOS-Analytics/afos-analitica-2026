import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale } from '../../../lib/afos-daily/loader'
import { StaticPageHeader } from '../../components/StaticPageHeader'
import { Footer } from '../../components/Footer'

interface Props { params: { locale: string } }

const CONTENT = {
  'pt-BR': {
    title: 'Sobre o AFOS Analytics | Inteligência Eleitoral Open-Source',
    description: 'AFOS Analytics: plataforma open-source de inteligência eleitoral, cruzando mercados de previsão, pesquisas e notícias. Construída e validada no ciclo eleitoral 2026.',
    h1: 'Sobre o AFOS Analytics',
    sections: [
      ['O que é', 'AFOS Analytics é uma plataforma open-source de inteligência eleitoral em tempo real. Cruza três fontes públicas auditáveis: mercados de previsão (Polymarket), pesquisas de 17+ institutos brasileiros (TSE) e cobertura jornalística. O código é distribuído sob Apache 2.0; o conteúdo editorial sob CC BY 4.0.'],
      ['Por que existe', 'Decisões políticas, eleitorais e de risco geopolítico são tomadas hoje com base em fontes fragmentadas, conflitantes e não-auditáveis. AFOS Analytics consolida três sinais distintos (apostas reais, intenção declarada, narrativa midiática) em um único cruzamento, com cada alegação ligada à fonte primária. Construído e validado durante o ciclo eleitoral 2026 em países da América do Sul, com cobertura de 14 países.'],
      ['Como funciona', 'Um cron unificado de 30 minutos coleta dados do Polymarket (18 mercados) e escreve em Redis (caminho quente para usuários) e Neon (snapshot histórico). Pesquisas TSE são ingeridas diariamente. AFOS Daily é uma síntese narrativa diária assistida por IA com fact-check gate obrigatório (regra das duas fontes, reconciliação JSON×texto) e revisão humana antes de publicar. Detalhes em /how-it-works e /methodology/automated-governance.'],
      ['Princípios editoriais', 'Cada alegação factual com link inline para fonte. Zero adjetivos partidários. Simetria entre candidatos. Tom observacional, não prescritivo. Datas explícitas (nunca "ontem"). Variações em pp sempre citadas. Densidade alvo: 600-900 palavras por daily.'],
      ['Quem mantém', 'Projeto independente desenvolvido por André Felipe, founder solo. Sem afiliação política, sem financiamento de campanha ou PAC. Governança automatizada via código versionado em git (regras, validators, prompts) — minimiza intervenção humana ad-hoc e maximiza auditabilidade. Contribuições via GitHub.'],
      ['Como contribuir', 'Código no GitHub (Apache 2.0). Issues e Pull Requests bem-vindos. CONTRIBUTING.md detalha o processo. Para reportar vulnerabilidades de segurança: security@afos-analytics.com. Para parcerias institucionais: founder@afos-analytics.com.'],
    ],
  },
  en: {
    title: 'About AFOS Analytics | Open-Source Electoral Intelligence',
    description: 'AFOS Analytics: open-source electoral intelligence platform cross-referencing prediction markets, polls and news. Built and validated during the 2026 electoral cycle.',
    h1: 'About AFOS Analytics',
    sections: [
      ['What it is', 'AFOS Analytics is an open-source electoral intelligence platform in real time. Cross-references three auditable public sources: prediction markets (Polymarket), polls from 17+ Brazilian institutes (TSE) and journalistic coverage. Code distributed under Apache 2.0; editorial content under CC BY 4.0.'],
      ['Why it exists', 'Political, electoral and geopolitical risk decisions today are made on fragmented, conflicting and non-auditable sources. AFOS Analytics consolidates three distinct signals (real money bets, declared intent, media narrative) into a single cross-reference, with each claim linked to its primary source. Built and validated during the 2026 electoral cycle across South American countries, covering 14 countries total.'],
      ['How it works', 'A unified 30-minute cron collects Polymarket data (18 markets) and writes to Redis (hot path for users) and Neon (historical snapshot). TSE polls ingested daily. AFOS Daily is an AI-assisted daily narrative synthesis with mandatory fact-check gate (two-source rule, JSON×text reconciliation) and human review before publish. Details at /how-it-works and /methodology/automated-governance.'],
      ['Editorial principles', 'Every factual claim with inline link to source. Zero partisan adjectives. Symmetry across candidates. Observational tone, not prescriptive. Explicit dates (never "yesterday"). Variations in pp always cited. Target density: 600-900 words per daily.'],
      ['Who maintains it', 'Independent project developed by André Felipe, solo founder. No political affiliation, no campaign or PAC funding. Automated governance via git-versioned code (rules, validators, prompts) — minimizes ad-hoc human intervention and maximizes auditability. Contributions via GitHub.'],
      ['How to contribute', 'Code on GitHub (Apache 2.0). Issues and Pull Requests welcome. CONTRIBUTING.md details the process. To report security vulnerabilities: security@afos-analytics.com. For institutional partnerships: founder@afos-analytics.com.'],
    ],
  },
  es: {
    title: 'Sobre AFOS Analytics | Inteligencia Electoral Open-Source',
    description: 'AFOS Analytics: plataforma open-source de inteligencia electoral cruzando mercados de predicción, encuestas y noticias. Construida y validada durante el ciclo electoral 2026.',
    h1: 'Sobre AFOS Analytics',
    sections: [
      ['Qué es', 'AFOS Analytics es una plataforma open-source de inteligencia electoral en tiempo real. Cruza tres fuentes públicas auditables: mercados de predicción (Polymarket), encuestas de 17+ institutos brasileños (TSE) y cobertura periodística. El código se distribuye bajo Apache 2.0; el contenido editorial bajo CC BY 4.0.'],
      ['Por qué existe', 'Las decisiones políticas, electorales y de riesgo geopolítico hoy se toman sobre fuentes fragmentadas, conflictivas y no auditables. AFOS Analytics consolida tres señales distintas (apuestas reales, intención declarada, narrativa mediática) en un único cruce, con cada afirmación enlazada a su fuente primaria. Construido y validado durante el ciclo electoral 2026 en países de América del Sur, con cobertura de 14 países.'],
      ['Cómo funciona', 'Un cron unificado de 30 minutos recolecta datos de Polymarket (18 mercados) y escribe en Redis (camino caliente para usuarios) y Neon (snapshot histórico). Las encuestas TSE se ingieren diariamente. AFOS Daily es una síntesis narrativa diaria asistida por IA con fact-check gate obligatorio (regla de dos fuentes, reconciliación JSON×texto) y revisión humana antes de publicar. Detalles en /how-it-works y /methodology/automated-governance.'],
      ['Principios editoriales', 'Cada afirmación factual con enlace inline a la fuente. Cero adjetivos partidistas. Simetría entre candidatos. Tono observacional, no prescriptivo. Fechas explícitas (nunca "ayer"). Variaciones en pp siempre citadas. Densidad objetivo: 600-900 palabras por daily.'],
      ['Quién lo mantiene', 'Proyecto independiente desarrollado por André Felipe, founder solo. Sin afiliación política, sin financiamiento de campaña o PAC. Gobernanza automatizada vía código versionado en git (reglas, validators, prompts) — minimiza intervención humana ad-hoc y maximiza auditabilidad. Contribuciones vía GitHub.'],
      ['Cómo contribuir', 'Código en GitHub (Apache 2.0). Issues y Pull Requests bienvenidos. CONTRIBUTING.md detalla el proceso. Para reportar vulnerabilidades de seguridad: security@afos-analytics.com. Para alianzas institucionales: founder@afos-analytics.com.'],
    ],
  },
} as const

export function generateMetadata({ params }: Props): Metadata {
  const c = CONTENT[params.locale as keyof typeof CONTENT] ?? CONTENT['pt-BR']
  return {
    title: c.title,
    description: c.description,
    alternates: {
      canonical: `https://afos-analytics.com/${params.locale}/about`,
      languages: {
        'pt-BR': 'https://afos-analytics.com/pt-BR/about',
        en: 'https://afos-analytics.com/en/about',
        es: 'https://afos-analytics.com/es/about',
        'x-default': 'https://afos-analytics.com/pt-BR/about',
      },
    },
  }
}

export default function AboutPage({ params }: Props) {
  if (!isValidLocale(params.locale)) notFound()
  const c = CONTENT[params.locale as keyof typeof CONTENT] ?? CONTENT['pt-BR']
  return (
    <div className="min-h-screen bg-light-bg flex flex-col">
      <StaticPageHeader />
      <main id="main-content" className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-dark mb-10">{c.h1}</h1>
        <div className="space-y-8">
          {c.sections.map(([heading, body]) => (
            <section key={heading} className="bg-white border border-light-border rounded-xl p-6 shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold text-primary mb-3">{heading}</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{body}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
