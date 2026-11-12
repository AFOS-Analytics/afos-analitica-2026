import { RELATORIOS, type RelatorioSlug } from './loader'

/**
 * JSON-LD do relatório de fechamento (/[idioma]/report/{slug}): um nó Report
 * com a versão e a data da versão, e `isBasedOn` apontando para o dataset aberto
 * no Hugging Face e o depósito na Harvard Dataverse.
 *
 * Criado em 12/Nov/2026: os relatórios eram indexáveis e não declaravam dado
 * estruturado nenhum. Só JSON-LD; nada aqui aparece no corpo da página.
 *
 * ⚠️ Versão nova do relatório = mudar `versao` e `data` em loader.ts, que já é
 * a fonte do PDF e do selo; este nó acompanha sozinho.
 */
const SITE = 'https://www.afos-analytics.com'

const DATASET_HF: Record<RelatorioSlug, string> = {
  'brazil-2026': 'https://huggingface.co/datasets/AFOS-Analytics1/brazil-2026-electoral-divergence',
  'usa-2026': 'https://huggingface.co/datasets/AFOS-Analytics1/usa-2026-midterms-divergence',
}

export function relatorioSchema(slug: RelatorioSlug, locale: string, titulo: string, descricao: string) {
  const def = RELATORIOS[slug]
  const url = `${SITE}/${locale}/report/${slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Report',
    name: titulo,
    headline: titulo,
    description: descricao,
    inLanguage: locale,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    version: def.versao,
    datePublished: `${def.data}T00:00:00-03:00`,
    isAccessibleForFree: true,
    author: { '@id': `${SITE}/#organization` },
    publisher: { '@id': `${SITE}/#organization` },
    isPartOf: { '@id': `${SITE}/#website` },
    isBasedOn: [
      { '@type': 'Dataset', url: DATASET_HF[slug] },
      { '@type': 'Dataset', url: def.harvardUrl, identifier: `https://doi.org/${def.harvardDoi}` },
    ],
  }
}
