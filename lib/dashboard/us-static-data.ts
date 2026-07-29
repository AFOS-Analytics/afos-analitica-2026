/**
 * Leitura SERVER-SIDE do generic ballot dos EUA, gerado por
 * `scripts/parse-us-generic-ballot.mjs`.
 *
 * Mesma guarda de forma do `static-data.ts` do Brasil: devolve `null` em arquivo
 * ausente, JSON inválido ou forma errada, e a seção trata o null mostrando que o
 * dado não está disponível, em vez de quebrar a página.
 *
 * ⚠️ NÃO tem variante por idioma, e isso é de propósito. O arquivo é dado
 * medido, não prosa: nome de instituto, data de campo, amostra e percentual não
 * se traduzem. O texto ao redor é que muda de idioma, e ele vive no componente.
 */
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export interface UsPoll {
  instituto: string
  campoInicio: string | null
  campoFim: string | null
  amostra: number | null
  amostraTipo: string | null
  margemErro: number | null
  dem: number
  rep: number
  outros: number | null
  vantagemDem: number
  fontePrimaria: string | null
}

export interface UsMediaAfos {
  janelaDias: number
  desde: string
  nPesquisas: number
  nInstitutos: number
  dem: number
  rep: number
  vantagemDem: number
  metodo: string
  institutos: string[]
}

export interface UsPollsData {
  lastUpdate: string
  fetchedAt: string
  eleicao: { pais: string; data: string; cargo: string }
  procedencia: {
    indice: string
    licencaIndice: string
    regra: string
    agregadoresIgnorados: string[]
    motivoIgnorar: string
  }
  ressalvas: string[]
  mediaAfos: UsMediaAfos | null
  qualidade: {
    linhasLidas: number
    publicadas: number
    descartadasPorForma: number
    motivoDescarte: string
    semFontePrimaria: number
  }
  polls: UsPoll[]
}

export function loadUsPollsData(): UsPollsData | null {
  try {
    const p = join(process.cwd(), 'public', 'us-polls-data.json')
    if (!existsSync(p)) return null
    const d = JSON.parse(readFileSync(p, 'utf-8')) as UsPollsData
    if (!Array.isArray(d?.polls)) return null
    return d
  } catch {
    return null
  }
}
