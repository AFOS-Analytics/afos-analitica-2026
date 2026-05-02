/**
 * check-recurrence.ts — Cross-reference temporal automatizado
 *
 * Origem: Verificação 1 do FACT-CHECK GATE (ETAPA 1.5 da skill /afos-daily).
 * Substitui o "Claude precisa lembrar de ler 5-7 arquivos" por mecânica:
 * faz grep case-insensitive de keyword(s) nas últimas N dailies (default 7)
 * e retorna timeline de menções com data + linha + contexto curto.
 *
 * Usage:
 *   npx tsx scripts/check-recurrence.ts "Vorcaro"
 *   npx tsx scripts/check-recurrence.ts "Vorcaro" "Master"
 *   npx tsx scripts/check-recurrence.ts "Renan Santos" --window=14
 *
 * Output esperado para keyword com histórico (ex: "Vorcaro" em 02/Mai):
 *   📅 Timeline de menções a "Vorcaro" — últimas 7 dailies
 *
 *   2026-04-25.md (linha 59): "delação Vorcaro" como bomba atômica...
 *   2026-04-26.md (linha 44): "comissão Senado cancelou sessão Vorcaro"...
 *   ...
 *
 *   ⚠️ DECISÃO: NÃO tratar como evento NOVO. Caso em curso há 7+ dias.
 *   ⚠️ Verificar tipo do artigo (explainer/perfil vs. evento real do dia)
 *
 * Output para keyword inédita:
 *   ✅ "{keyword}" não aparece em nenhuma das últimas 7 dailies — possível novidade.
 *   ⚠️ AINDA verificar via fetch do corpo do artigo (Verificação 2 do gate).
 */
import { readdirSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

const DAILY_DIR = join(process.cwd(), 'public', 'afos-daily')
const DATE_RE = /^\d{4}-\d{2}-\d{2}\.md$/
const DEFAULT_WINDOW = 7

function parseArgs(argv: string[]): { keywords: string[]; window: number } {
  const keywords: string[] = []
  let window = DEFAULT_WINDOW
  for (const arg of argv) {
    if (arg.startsWith('--window=')) {
      const v = parseInt(arg.split('=')[1], 10)
      if (!isNaN(v) && v > 0) window = v
    } else if (!arg.startsWith('--')) {
      keywords.push(arg)
    }
  }
  return { keywords, window }
}

function listRecentCanonicalDailies(window: number): string[] {
  if (!existsSync(DAILY_DIR)) return []
  return readdirSync(DAILY_DIR)
    .filter((f) => DATE_RE.test(f))
    .sort()
    .slice(-window)
}

function findMentions(filePath: string, keyword: string): Array<{ line: number; context: string }> {
  const content = readFileSync(filePath, 'utf-8')
  const re = new RegExp(escapeRegex(keyword), 'i')
  const lines = content.split(/\r?\n/)
  const out: Array<{ line: number; context: string }> = []
  for (let i = 0; i < lines.length; i++) {
    if (re.test(lines[i])) {
      const ctx = lines[i].trim().slice(0, 140) + (lines[i].length > 140 ? '…' : '')
      out.push({ line: i + 1, context: ctx })
    }
  }
  return out
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function main() {
  const { keywords, window } = parseArgs(process.argv.slice(2))
  if (keywords.length === 0) {
    console.error('❌ Usage: npx tsx scripts/check-recurrence.ts "keyword1" ["keyword2" ...] [--window=N]')
    console.error('   Default window: last 7 dailies (canonical PT-BR only).')
    process.exit(1)
  }
  // Validar que keywords não são strings vazias ou só whitespace — regex // matches everything
  const validKeywords = keywords.filter((k) => k.trim().length > 0)
  if (validKeywords.length === 0) {
    console.error('❌ Erro: todos os keywords passados são vazios. Forneça pelo menos 1 keyword não-vazio.')
    process.exit(1)
  }
  if (validKeywords.length < keywords.length) {
    console.error(`⚠️  ${keywords.length - validKeywords.length} keyword(s) vazios ignorados.`)
  }

  const files = listRecentCanonicalDailies(window)
  if (files.length === 0) {
    console.error('❌ No dailies found in public/afos-daily/')
    process.exit(1)
  }

  console.log(`🔎 Cross-reference temporal — janela: últimas ${files.length} dailies (${files[0].replace('.md', '')} → ${files[files.length - 1].replace('.md', '')})\n`)

  let anyMentionAcross = false

  for (const keyword of validKeywords) {
    console.log(`📅 Timeline de menções a "${keyword}":`)
    let mentionCount = 0
    for (const file of files) {
      const path = join(DAILY_DIR, file)
      const mentions = findMentions(path, keyword)
      if (mentions.length > 0) {
        mentionCount += mentions.length
        const date = file.replace('.md', '')
        for (const { line, context } of mentions.slice(0, 3)) {
          console.log(`   ${date}.md (linha ${line}): ${context}`)
        }
        if (mentions.length > 3) console.log(`   ${date}.md (+${mentions.length - 3} menções adicionais)`)
      }
    }
    if (mentionCount === 0) {
      console.log(`   ✅ Nenhuma menção em ${files.length} dailies.`)
      console.log(`   ⚠️  Possível novidade — AINDA verificar via fetch do artigo (Verificação 2 do gate).`)
    } else {
      console.log(`   ⚠️  ${mentionCount} menções totais. NÃO tratar como evento novo sem confirmar via fetch (Verificação 2).`)
      anyMentionAcross = true
    }
    console.log()
  }

  if (anyMentionAcross) {
    console.log('🚨 DECISÃO: pelo menos um keyword tem histórico. Antes de incorporar como divisor de águas, fetch corpo do artigo e confirmar TIPO (evento real vs. explainer/perfil/desdobramento).')
  }
}

main()
