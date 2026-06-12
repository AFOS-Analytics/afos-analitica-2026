import { RegionPage } from '../../../lib/seo/region-page'

// Alias de /latam. Usa a metadata COMPLETA de RegionPage('latam') (title/desc/OG
// localizados), cujo canonical + hreflang já apontam para /latam — evita
// duplicate content sem deixar a página com metadata vazia / idioma errado.
const rp = RegionPage('latam')
export const { generateStaticParams, generateMetadata } = rp
export default rp.Page
