import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export const GLOSSARY_PATH = join(process.cwd(), 'public', 'glossary', 'entries.json')

export type GlossaryEntryType =
  | 'institutional'
  | 'electoral_concept'
  | 'polling_institute'
  | 'prediction_market'
  | 'political_party'
  | 'neologism'
  | 'scandal'
  | 'event'

export interface GlossaryEntry {
  id: string
  term: string
  type: GlossaryEntryType
  firstSeen?: string
  url?: string
  definitions: {
    'pt-BR': string
    en: string
    es: string
  }
  relatedSources?: Array<{ label: string; url: string; date?: string }>
}

const ID_RE = /^[a-z0-9-]+$/

function readEntries(): Record<string, GlossaryEntry> {
  if (!existsSync(GLOSSARY_PATH)) return {}
  try {
    const raw = readFileSync(GLOSSARY_PATH, 'utf-8')
    return JSON.parse(raw) as Record<string, GlossaryEntry>
  } catch (err) {
    console.error('[glossary] Failed to read entries.json:', err)
    return {}
  }
}

let cached: Record<string, GlossaryEntry> | null = null
function entries(): Record<string, GlossaryEntry> {
  if (cached === null) cached = readEntries()
  return cached
}

export function isValidGlossaryId(id: string): boolean {
  return ID_RE.test(id) && Object.prototype.hasOwnProperty.call(entries(), id)
}

export function loadGlossary(): GlossaryEntry[] {
  return Object.values(entries()).sort((a, b) => a.term.localeCompare(b.term))
}

export function getGlossaryEntry(id: string): GlossaryEntry | null {
  if (!isValidGlossaryId(id)) return null
  return entries()[id]
}

export function listGlossaryIds(): string[] {
  return Object.keys(entries()).sort()
}
