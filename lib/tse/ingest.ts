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
  conre: string
  metodologia: string
  planoAmostral: string
  controlSystem: string
  dadoMunicipio: string
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

      // O CSV do TSE é latin-1. Decodificar como UTF-8 (default do JSZip em 'text')
      // corrompe todo acento, e o classificador de escopo perde os sinais acentuados
      // de universo nacional ("todas as regiões do Brasil", "âmbito nacional").
      // Estadual sobrevive porque seus sinais são sem acento. Resultado: nacionais
      // viravam scope=unknown e sumiam do dashboard (incidente Gerp BR-03067/2026).
      const bytes = await brasilFile.async('uint8array')
      return parseCSV(new TextDecoder('windows-1252').decode(bytes))
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
  // Parser char-stream: respeita aspas que envolvem campos com ';' E '\n' embutidos.
  // (metodologia/plano amostral do TSE são textos multi-linha de até ~4k chars — um split
  //  ingênuo por '\n' fragmentava o registro e perdia o plano amostral inteiro.)
  const rows = parseRows(csv)
  if (rows.length < 2) return []

  const polls: TSEPoll[] = []

  for (let i = 1; i < rows.length; i++) {
    const fields = rows[i]
    if (fields.length < 26) continue

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
      conre: cleanField(fields[19]),
      estatistico: cleanField(fields[20]),
      valorPesquisa: parseFloat(cleanField(fields[21]).replace(',', '.')) || 0,
      metodologia: cleanField(fields[22]),       // completo, sem truncar
      planoAmostral: cleanField(fields[23]),     // desenho de ponderação demográfica/geográfica
      controlSystem: cleanField(fields[24]),
      dadoMunicipio: cleanField(fields[25]),
    })
  }

  return polls
}

/** Parser CSV completo (arquivo inteiro): quebra registros em '\n' só FORA de aspas. */
function parseRows(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let q = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (q) {
      if (ch === '"') { if (text[i + 1] === '"') { field += '"'; i++ } else q = false }
      else field += ch
    } else if (ch === '"') q = true
    else if (ch === ';') { row.push(field); field = '' }
    else if (ch === '\r') { /* ignora */ }
    else if (ch === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else field += ch
  }
  if (field.length || row.length) { row.push(field); rows.push(row) }
  return rows
}

function cleanField(f: string | undefined): string {
  if (!f) return ''
  return f.replace(/^"|"$/g, '').replace(/#NULO#/g, '').replace(/\s+/g, ' ').trim()
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

// Classificação de escopo (nacional × estadual) — FONTE ÚNICA em ./scope.mjs,
// compartilhada com o backfill (Neon) e o builder do dataset HF/Zaid (DB-free).
export { detectScope, classifyScope } from './scope.mjs'
export type { PollScope, ScopeSource } from './scope.mjs'

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
