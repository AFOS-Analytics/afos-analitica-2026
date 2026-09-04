/**
 * 3a passada de 03/Set/2026: a soma das pontas SIM, conferida no backup.
 *
 * Só uma frase mudou em cada um dos três arquivos. Em vez de redigitar campos de
 * 2.500 caracteres cheios de número, este mapa PARTE da tradução já publicada e
 * troca o trecho. Redigitar dado numérico para mexer numa frase cria risco sem
 * necessidade, e o gate numérico é justamente quem cobra isso.
 *
 * Uso: npx tsx scripts/locale-maps/03set-r3-soma.ts
 */
import { readFileSync } from 'fs'
import { construir } from '../build-locale-json'

const lido = (a: string, l: string) => JSON.parse(readFileSync(`public/${a}.${l}.json`, 'utf-8'))

const CONF = {
  es: `⚠️ ESTO NO ES ANOMALÍA, Y FUE VERIFICADO EN EL BACKUP DE LA SERIE: sumando solo los cuatro nombres por encima del piso de 0,5%, que es la magnitud que la serie guarda, el total fue de 97,95% a 100,10%, y en las 20 capturas anteriores esa misma suma anduvo entre 98,00% y 101,60%, con 13 de ellas por encima de 100%. Por encima de 100 es el comportamiento ordinario de este libro.`,
  en: `⚠️ THIS IS NOT AN ANOMALY, AND IT WAS CHECKED IN THE SERIES BACKUP: summing only the four names above the 0.5% floor, which is the quantity the series stores, the total went from 97.95% to 100.10%, and across the 20 previous captures that same sum ranged from 98.00% to 101.60%, with 13 of them above 100%. Above 100 is this book's ordinary behaviour.`,
}

const DE = {
  es: 'la suma de las puntas SÍ pasó de 99,20% a 101,35%.',
  en: 'the sum of the YES legs went from 99.20% to 101.35%.',
}
const PARA = {
  es: (c: string) => `la suma de las puntas SÍ de los 19 contratos pasó de 99,20% a 101,35%. ${c}`,
  en: (c: string) => `the sum of the YES legs across the 19 contracts went from 99.20% to 101.35%. ${c}`,
}

function trocar(texto: string, loc: 'en' | 'es'): string {
  const n = texto.split(DE[loc]).length - 1
  if (n !== 1) throw new Error(`esperava 1 ocorrência em ${loc}, achei ${n}`)
  return texto.replace(DE[loc], PARA[loc](CONF[loc]))
}

for (const loc of ['es', 'en'] as const) {
  construir('analysis-data', loc, {
    'cards.sentimento.text3': trocar(lido('analysis-data', loc).cards.sentimento.text3, loc),
  })
  construir('analysis-criteriosa', loc, {
    cruzamento: trocar(lido('analysis-criteriosa', loc).cruzamento, loc),
  })
  construir('polls-data', loc, {
    'polymarketComparison.note': trocar(lido('polls-data', loc).polymarketComparison.note, loc),
  })
}
