import { safeJsonLd } from '../../lib/seo/schema'

/**
 * Único ponto de injeção de JSON-LD do app. Encapsula o `dangerouslySetInnerHTML`
 * com escaping seguro (`safeJsonLd`: escapa `</script>` / U+2028 / U+2029), de modo
 * que nenhum site precise (ou possa esquecer de) escapar por conta própria e o
 * número de sinks perigosos a auditar seja UM. Aceita um schema (objeto) ou um
 * array de schemas.
 */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }} />
}
