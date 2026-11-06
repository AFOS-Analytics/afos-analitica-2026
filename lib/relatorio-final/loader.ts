// Relatórios de fechamento: o HTML aprovado de cada idioma mora em
// data/relatorio-final/{arquivo}.{locale}.html, o mesmo arquivo que gerou o PDF.
// A página mostra o <body> dele; o <style> de impressão fica de fora, e a tela usa
// o CSS escopado do RelatorioFinalTemplate, que troca só as variáveis de cor por tema.
//
// Desde 06/11/2026 são dois relatórios, Brasil 2026 e EUA 2026. As funções aceitam
// o slug da página e, sem ele, seguem lendo o do Brasil, como antes.
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

export const RELATORIO_LOCALES = ['pt-BR', 'en', 'es'] as const
export type RelatorioLocale = (typeof RELATORIO_LOCALES)[number]

export type RelatorioSlug = 'brazil-2026' | 'usa-2026'

export interface RelatorioDef {
  arquivo: string
  versao: string
  data: string
  pdf: Record<RelatorioLocale, string>
  harvardUrl: string
  harvardDoi: string
}

export const RELATORIOS: Record<RelatorioSlug, RelatorioDef> = {
  'brazil-2026': {
    arquivo: 'brasil-2026',
    versao: '1.1',
    data: '2026-10-31',
    pdf: {
      'pt-BR': '/relatorios/relatorio-final-brasil-2026-v1.1-31out.pdf',
      en: '/relatorios/brazil-2026-closing-report-v1.1-31oct.pdf',
      es: '/relatorios/informe-de-cierre-brasil-2026-v1.1-31oct.pdf',
    },
    harvardUrl: 'https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/2D0UK7',
    harvardDoi: '10.7910/DVN/2D0UK7',
  },
  'usa-2026': {
    arquivo: 'eua-2026',
    versao: '1.0',
    data: '2026-11-06',
    pdf: {
      'pt-BR': '/relatorios/relatorio-final-eua-2026-v1.0-06nov.pdf',
      en: '/relatorios/us-2026-closing-report-v1.0-06nov.pdf',
      es: '/relatorios/informe-de-cierre-eeuu-2026-v1.0-06nov.pdf',
    },
    harvardUrl: 'https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/XRUT8U',
    harvardDoi: '10.7910/DVN/XRUT8U',
  },
}

// Nomes antigos, do tempo em que só havia o relatório do Brasil.
export const RELATORIO_VERSAO = RELATORIOS['brazil-2026'].versao
export const RELATORIO_DATA = RELATORIOS['brazil-2026'].data
export const RELATORIO_PDF = RELATORIOS['brazil-2026'].pdf
export const HARVARD_BR2026_URL = RELATORIOS['brazil-2026'].harvardUrl

function caminho(locale: RelatorioLocale, slug: RelatorioSlug) {
  return join(process.cwd(), 'data', 'relatorio-final', `${RELATORIOS[slug].arquivo}.${locale}.html`)
}

export function relatorioExiste(locale: string, slug: RelatorioSlug = 'brazil-2026'): locale is RelatorioLocale {
  return (RELATORIO_LOCALES as readonly string[]).includes(locale) && existsSync(caminho(locale as RelatorioLocale, slug))
}

export function carregarRelatorio(locale: RelatorioLocale, slug: RelatorioSlug = 'brazil-2026'): { titulo: string; corpo: string } | null {
  if (!relatorioExiste(locale, slug)) return null
  const html = readFileSync(caminho(locale, slug), 'utf8')
  const titulo = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || 'AFOS Analytics'
  const corpo = (html.match(/<body[^>]*>([\s\S]*)<\/body>/) || [])[1]
  if (!corpo) return null
  return { titulo, corpo }
}
