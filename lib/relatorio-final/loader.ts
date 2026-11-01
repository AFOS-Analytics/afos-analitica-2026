// Relatório de fechamento Brasil 2026: o HTML aprovado de cada idioma mora em
// data/relatorio-final/brasil-2026.{locale}.html, o mesmo arquivo que gerou o PDF.
// A página mostra o <body> dele; o <style> de impressão fica de fora, e a tela usa
// o CSS escopado do RelatorioFinalTemplate, que troca só as variáveis de cor por tema.
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

export const RELATORIO_LOCALES = ['pt-BR', 'en', 'es'] as const
export type RelatorioLocale = (typeof RELATORIO_LOCALES)[number]

export const RELATORIO_VERSAO = '1.1'
export const RELATORIO_DATA = '2026-10-31'

// PDF de cada idioma, servido de public/relatorios/.
export const RELATORIO_PDF: Record<RelatorioLocale, string> = {
  'pt-BR': '/relatorios/relatorio-final-brasil-2026-v1.1-31out.pdf',
  en: '/relatorios/brazil-2026-closing-report-v1.1-31oct.pdf',
  es: '/relatorios/informe-de-cierre-brasil-2026-v1.1-31oct.pdf',
}

export const HARVARD_BR2026_URL = 'https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/2D0UK7'

function arquivo(locale: RelatorioLocale) {
  return join(process.cwd(), 'data', 'relatorio-final', `brasil-2026.${locale}.html`)
}

export function relatorioExiste(locale: string): locale is RelatorioLocale {
  return (RELATORIO_LOCALES as readonly string[]).includes(locale) && existsSync(arquivo(locale as RelatorioLocale))
}

export function carregarRelatorio(locale: RelatorioLocale): { titulo: string; corpo: string } | null {
  if (!relatorioExiste(locale)) return null
  const html = readFileSync(arquivo(locale), 'utf8')
  const titulo = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || 'AFOS Analytics'
  const corpo = (html.match(/<body[^>]*>([\s\S]*)<\/body>/) || [])[1]
  if (!corpo) return null
  return { titulo, corpo }
}
