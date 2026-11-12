import type { AfosWeeklyData } from './loader'
import { LOCALE_ORIGEM } from './loader'
import { updatedAtToIso } from '../frontmatter/updated-at'

/**
 * JSON-LD de uma edição do AFOS Weekly: NewsArticle e BreadcrumbList.
 *
 * Molde: lib/afos-tradeoff/schema.ts. Criado em 12/Nov/2026: a edição era
 * indexável desde 27/Ago e não declarava dado estruturado nenhum, ao contrário
 * da Daily e do Tradeoff. Só JSON-LD; nada aqui aparece no corpo da página.
 *
 * ⚠️ `pais` é posicional e obrigatório pelo mesmo motivo do Tradeoff: a URL do
 * dado estruturado tem de ser a do país certo.
 *
 * 🔴 Quando a tradução não existe, a página serve o texto de ORIGEM (inglês) e
 * declara como canônica a URL em inglês. O schema segue a mesma regra, para
 * não amarrar o texto inglês a um endereço que se diz em outro idioma.
 */
const SITE = 'https://www.afos-analytics.com'

const NOME_PAIS: Record<string, Record<string, string>> = {
  us: { 'pt-BR': 'EUA', en: 'US', es: 'EE. UU.' },
  fr: { 'pt-BR': 'França', en: 'France', es: 'Francia' },
}

const PALAVRAS_POR_PAIS: Record<string, string[]> = {
  us: ['US 2026 midterms', 'US Senate', 'US House'],
  fr: ['France 2027 presidential election', 'French politics'],
}

function limpa(s: string): string {
  return s
    .replace(/\*\*/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

export function buildWeeklyArticleSchema(data: AfosWeeklyData, locale: string, pais: string, imagem: string) {
  const servido = data.servedLocale === locale ? locale : LOCALE_ORIGEM
  const url = `${SITE}/${servido}/weekly/${pais}/${data.date}`
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: data.title,
    description: limpa(data.tldr[0] ?? '').slice(0, 300),
    datePublished: `${data.date}T00:00:00-03:00`,
    dateModified: updatedAtToIso(data.updatedAt, data.date),
    inLanguage: servido,
    isAccessibleForFree: true,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@id': `${SITE}/#organization` },
    publisher: { '@id': `${SITE}/#organization` },
    isPartOf: { '@id': `${SITE}/#website` },
    image: { '@type': 'ImageObject', url: imagem, width: 1200, height: 627 },
    articleSection: 'Politics',
    keywords: [
      ...(PALAVRAS_POR_PAIS[pais] ?? []),
      'prediction markets',
      'electoral polls',
      'political risk',
      'AFOS Weekly',
      'weekly analysis',
    ],
  }
}

export function buildWeeklyBreadcrumbSchema(date: string, locale: string, pais: string) {
  const homeName = locale === 'pt-BR' ? 'Início' : locale === 'es' ? 'Inicio' : 'Home'
  const nomePais = NOME_PAIS[pais]?.[locale] ?? NOME_PAIS[pais]?.en ?? pais.toUpperCase()
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeName, item: `${SITE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: `AFOS Weekly ${nomePais}`, item: `${SITE}/${locale}/weekly/${pais}` },
      { '@type': 'ListItem', position: 3, name: date, item: `${SITE}/${locale}/weekly/${pais}/${date}` },
    ],
  }
}
