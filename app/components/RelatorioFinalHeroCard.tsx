'use client'

// Card do Relatório de fechamento Brasil 2026 no topo do painel do Brasil, acima
// do AFOS Daily e no mesmo padrão visual dele. O card inteiro leva à página do
// relatório; a pílula do Harvard Dataverse é um link à parte, posto acima do link
// esticado (link dentro de link não é HTML válido).
import { useTranslation } from '../i18n/context'

const HARVARD_DOI_URL = 'https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/2D0UK7'

const T = {
  'pt-BR': {
    eyebrow: 'Relatório final',
    titulo: 'Eleição Brasil 2026',
    texto: 'Durante 186 dias o AFOS registrou, em paralelo, o preço do contrato de vencedor no Polymarket, as pesquisas nacionais registradas no TSE e a cobertura da imprensa. O relatório compara essas séries com o resultado oficial dos dois turnos e reúne, na Parte II, a prorrogação da votação, a contestação e a repercussão no Brasil e no exterior até 31/10.',
    cta: 'Ler relatório',
    updatedAt: 'Atualizado:',
    data: '31/10/2026',
    versao: 'versão 1.1',
    aria: 'Ler o Relatório de fechamento Brasil 2026',
  },
  en: {
    eyebrow: 'Final report',
    titulo: 'Brazil 2026 election',
    texto: 'For 186 days AFOS recorded, side by side, the price of the Polymarket winner contract, the national polls registered with the TSE and the press coverage. The report compares those series with the official result of both rounds and gathers, in Part II, the vote extension, the contestation and the reactions in Brazil and abroad up to Oct 31.',
    cta: 'Read the report',
    updatedAt: 'Updated:',
    data: 'Oct 31, 2026',
    versao: 'version 1.1',
    aria: 'Read the Brazil 2026 Closing Report',
  },
  es: {
    eyebrow: 'Informe final',
    titulo: 'Elección Brasil 2026',
    texto: 'Durante 186 días AFOS registró, en paralelo, el precio del contrato de ganador en Polymarket, las encuestas nacionales registradas en el TSE y la cobertura de prensa. El informe compara esas series con el resultado oficial de las dos vueltas y reúne, en la Parte II, la prórroga de la votación, la impugnación y la repercusión en Brasil y en el exterior hasta el 31/10.',
    cta: 'Leer el informe',
    updatedAt: 'Actualizado:',
    data: '31/10/2026',
    versao: 'versión 1.1',
    aria: 'Leer el Informe de cierre Brasil 2026',
  },
}

export function RelatorioFinalHeroCard() {
  const { locale } = useTranslation()
  const tKey = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as keyof typeof T
  const t = T[tKey]
  const href = `/${tKey}/report/brazil-2026`

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-8 mt-5 sm:mt-6">
      <div className="relative bg-orange-50 hover:bg-orange-100 border border-orange-100 rounded-xl p-4 md:p-5 transition-colors group">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
          <span className="text-base md:text-lg font-extrabold text-primary uppercase tracking-[0.12em]">{t.eyebrow}</span>
          <span className="text-base md:text-lg font-bold text-dark">{t.titulo}</span>
          <a
            href={HARVARD_DOI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-primary/10 text-primary hover:bg-primary/20 border-primary/15 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="currentColor" aria-hidden="true">
              <path d="M4 10 H7 V17 H4 Z M10 10 H13 V17 H10 Z M16 10 H19 V17 H16 Z M2 19 H21 V22 H2 Z M11.5 1 L2 6 V8 H21 V6 Z" />
            </svg>
            Harvard Dataverse
          </a>
          <span className="text-xs text-gray-600 ml-auto">{t.updatedAt} {t.data}</span>
        </div>
        <p className="text-sm text-gray-800 leading-snug line-clamp-2 mb-2">{t.texto}</p>
        <div className="flex items-center justify-between gap-3">
          <a href={href} aria-label={t.aria} className="text-sm font-semibold text-primary group-hover:underline after:absolute after:inset-0 after:rounded-xl after:content-['']">
            {t.cta} →
          </a>
          <span className="text-xs text-gray-500">PDF · {t.versao}</span>
        </div>
      </div>
    </div>
  )
}
