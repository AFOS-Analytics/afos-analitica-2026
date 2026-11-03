'use client'

// Aviso no topo do painel do Brasil depois do congelamento de 02/Nov/2026: a
// cobertura terminou em 01/Nov, os textos ficam como estavam na noite da
// apuração (com o resultado final do TSE) e o preço é uma leitura única.
import { useTranslation } from '../i18n/context'

const HARVARD_DOI_URL = 'https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/2D0UK7'

const T = {
  'pt-BR': {
    titulo: 'Cobertura encerrada em 01/11/2026.',
    texto: 'Este painel está congelado. Os textos são os da noite da apuração, 25/10, com o resultado final do TSE, e os preços do Polymarket são a leitura de 02/11.',
    relatorio: 'Ler o relatório final',
    dados: 'Dados no Harvard Dataverse',
  },
  en: {
    titulo: 'Coverage closed on Nov 1, 2026.',
    texto: 'This panel is frozen. The texts are those of election night, Oct 25, with the TSE final result, and the Polymarket prices are the Nov 2 reading.',
    relatorio: 'Read the final report',
    dados: 'Data on Harvard Dataverse',
  },
  es: {
    titulo: 'Cobertura cerrada el 01/11/2026.',
    texto: 'Este panel está congelado. Los textos son los de la noche del escrutinio, 25/10, con el resultado final del TSE, y los precios de Polymarket son la lectura del 02/11.',
    relatorio: 'Leer el informe final',
    dados: 'Datos en Harvard Dataverse',
  },
}

export function CoberturaEncerradaBanner() {
  const { locale } = useTranslation()
  const tKey = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as keyof typeof T
  const t = T[tKey]

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-8 mt-5 sm:mt-6">
      <div role="status" className="border border-primary/20 bg-primary/5 rounded-xl px-4 py-3 md:px-5 text-sm text-dark leading-relaxed">
        <span className="font-bold text-primary">{t.titulo}</span>{' '}
        <span>{t.texto}</span>{' '}
        <span className="inline-flex flex-wrap gap-x-3 gap-y-1">
          <a href={`/${tKey}/report/brazil-2026`} className="font-semibold text-primary underline underline-offset-2 hover:no-underline">{t.relatorio}</a>
          <a href={HARVARD_DOI_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-2 hover:no-underline">{t.dados}</a>
        </span>
      </div>
    </div>
  )
}
