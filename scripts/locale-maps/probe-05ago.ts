/**
 * Sonda de 05/Ago: roda o construtor com mapa VAZIO nos 3 arquivos, nos 2
 * idiomas, só para listar quais campos mudaram e portanto precisam de tradução
 * nova. O construtor aborta no primeiro arquivo, então a sonda chama um por vez
 * via argumento.
 *
 *   npx tsx scripts/locale-maps/probe-05ago.ts analysis-data en
 */
import { construir } from '../build-locale-json'

const arquivo = process.argv[2] as 'analysis-data' | 'analysis-criteriosa' | 'polls-data'
const locale = process.argv[3] as 'en' | 'es'

construir(arquivo, locale, {})
