#!/usr/bin/env tsx
/**
 * validate-afos-daily.ts
 *
 * Camada 4 — Gate técnico.
 * Valida public/afos-daily/{date}.md detectando violações de URL/qualidade.
 * Exit 1 se errors críticos (bloqueia commit/Write via hook PreToolUse).
 *
 * Uso:
 *   npx tsx scripts/validate-afos-daily.ts 2026-05-07
 *   npx tsx scripts/validate-afos-daily.ts 2026-05-07 --locale=en
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { validateBody, formatViolations, hasErrors } from '../lib/afos-daily/validator'

function main() {
  const args = process.argv.slice(2)
  const date = args.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a))
  const localeArg = args.find((a) => a.startsWith('--locale='))
  const locale = localeArg ? localeArg.split('=')[1] : 'pt-BR'

  if (!date) {
    console.error('Usage: validate-afos-daily.ts YYYY-MM-DD [--locale=en|es]')
    process.exit(1)
  }

  const filename = locale === 'pt-BR' ? `${date}.md` : `${date}.${locale}.md`
  const path = join(process.cwd(), 'public', 'afos-daily', filename)

  if (!existsSync(path)) {
    console.error(`File not found: ${path}`)
    process.exit(1)
  }

  const content = readFileSync(path, 'utf-8')
  const violations = validateBody(content)

  console.log(`Validating ${filename}:`)
  console.log(formatViolations(violations))

  if (hasErrors(violations)) {
    console.error('\n✗ Validação falhou. Corrija os erros críticos antes de prosseguir.')
    process.exit(1)
  }

  console.log('\n✓ Validação OK.')
}

main()
