/**
 * TSE PesqEle Ingest — AFOS Analytics
 *
 * Baixa CSV de pesquisas eleitorais do CDN do TSE (dados abertos).
 * Extrai pesquisas presidenciais do arquivo BRASIL.csv.
 * Fonte: https://dadosabertos.tse.jus.br
 */

import JSZip from 'jszip'

const TSE_CDN = 'https://cdn.tse.jus.br/estatistica/sead/odsele/pesquisa_eleitoral'
const CURRENT_YEAR = 2026

export interface TSEPoll {
  protocolo: string
  registroDate: string
  instituto: string
  institutoFantasia: string
  cnpj: string
  cargo: string
  campoInicio: string
  campoFim: string
  divulgacao: string
  amostra: number
  uf: string
  metodologia: string
  planoAmostral: string
  valorPesquisa: number
  estatistico: string
}

/**
 * Baixa e parseia pesquisas presidenciais do TSE.
 *
 * TSE CDN (Cloudflare-fronted) pode retornar 503/504 transient. 2 attempts
 * com 5s de backoff + timeout 30s/attempt. Fail-fast em 4xx (URL errada /
 * arquivo ausente) e em "ZIP estrutural" — não retenta esses.
 */
export async function fetchTSEPolls(year: number = CURRENT_YEAR): Promise<TSEPoll[]> {
  const url = `${TSE_CDN}/pesquisa_eleitoral_${year}.zip`

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30000) })
      if (!res.ok) throw new Error(`TSE CDN returned ${res.status}`)

      const zip = await JSZip.loadAsync(await res.arrayBuffer())
      const brasilFile = zip.file(`pesquisa_eleitoral_${year}_BRASIL.csv`)
      if (!brasilFile) throw new Error('BRASIL.csv not found in ZIP')

      return parseCSV(await brasilFile.async('text'))
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      // Fail-fast: 4xx (URL errada) ou ZIP estrutural — não adianta retentar
      const isFailFast = /returned 4\d\d|not found in ZIP/.test(msg)
      if (isFailFast || attempt === 2) throw err
      console.warn(`[tse/ingest] attempt ${attempt} failed (${msg}); retry em 5s`)
      await new Promise(r => setTimeout(r, 5000))
    }
  }
  throw new Error('TSE CDN fetch unreachable') // for TS — loop sempre termina via return ou throw
}

function parseCSV(csv: string): TSEPoll[] {
  const lines = csv.split('\n').filter(l => l.trim())
  if (lines.length < 2) return []

  const polls: TSEPoll[] = []

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i])
    if (fields.length < 22) continue

    const cargo = cleanField(fields[14])

    // Filtrar: apenas pesquisas que incluem Presidente
    if (!cargo.toLowerCase().includes('presidente')) continue

    polls.push({
      protocolo: cleanField(fields[8]),
      registroDate: cleanField(fields[9]).slice(0, 10),
      instituto: cleanField(fields[12]),
      institutoFantasia: cleanField(fields[13]),
      cnpj: cleanField(fields[11]),
      cargo,
      campoInicio: cleanField(fields[15]).slice(0, 10),
      campoFim: cleanField(fields[16]).slice(0, 10),
      divulgacao: cleanField(fields[17]).slice(0, 10),
      amostra: parseInt(cleanField(fields[18])) || 0,
      uf: cleanField(fields[5]),
      metodologia: cleanField(fields[22]).slice(0, 500),
      planoAmostral: cleanField(fields[23]).slice(0, 500),
      valorPesquisa: parseFloat(cleanField(fields[21]).replace(',', '.')) || 0,
      estatistico: cleanField(fields[20]),
    })
  }

  return polls
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === ';' && !inQuotes) {
      fields.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  fields.push(current)
  return fields
}

function cleanField(f: string | undefined): string {
  if (!f) return ''
  return f.replace(/^"|"$/g, '').replace(/#NULO#/g, '').trim()
}

/**
 * Filtra pesquisas dos últimos N dias.
 */
export function filterRecentPolls(polls: TSEPoll[], days: number = 15): TSEPoll[] {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  const cutoffStr = cutoff.toISOString().slice(0, 10)

  return polls.filter(p => p.registroDate >= cutoffStr)
}

/**
 * Filtra pesquisas anteriores ao período recente (históricas).
 */
export function filterHistoricalPolls(polls: TSEPoll[], days: number = 15): TSEPoll[] {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  const cutoffStr = cutoff.toISOString().slice(0, 10)

  return polls.filter(p => p.registroDate < cutoffStr)
}

/**
 * Retorna nome normalizado do instituto para matching.
 */
export function normalizeInstitute(name: string): string {
  const n = name.toUpperCase().trim()
  if (n.includes('DATAFOLHA')) return 'Datafolha'
  if (n.includes('QUAEST')) return 'Quaest'
  if (n.includes('ATLAS')) return 'AtlasIntel'
  if (n.includes('PARANA') && n.includes('PESQUISA')) return 'Paraná Pesquisas'
  if (n.includes('REAL TIME')) return 'Real Time Big Data'
  if (n.includes('IPEC')) return 'Ipec'
  if (n.includes('MDA')) return 'MDA'
  if (n.includes('VERITA')) return 'Veritá'
  if (n.includes('100') && n.includes('CIDADE')) return '100 Cidades'
  if (n.includes('FUTURA')) return 'Futura Inteligência'
  if (n.includes('IDEIA') || n.includes('CANAL MEIO')) return 'Ideia/Canal Meio'
  if (n.includes('GERP')) return 'Gerp'
  if (n.includes('PHOENIX')) return 'Phoenix'
  if (n.includes('DIVULGA')) return 'Instituto Divulga'
  if (n.includes('DOXA')) return 'Doxa'
  return name.slice(0, 40)
}
