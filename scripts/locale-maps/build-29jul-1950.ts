/**
 * Constrói os 6 JSON traduzidos a partir dos mapas derivados do rebaseline de 19:50.
 * Uso: npx tsx scripts/locale-maps/build-29jul-1950.ts
 */
import { readFileSync } from 'fs'
import { construir } from '../build-locale-json'

for (const loc of ['en', 'es'] as const) {
  const mapas = JSON.parse(readFileSync(`scripts/locale-maps/_derivado.${loc}.json`, 'utf-8'))
  for (const arq of ['analysis-data', 'analysis-criteriosa', 'polls-data'] as const) {
    construir(arq, loc, mapas[arq])
  }
}
