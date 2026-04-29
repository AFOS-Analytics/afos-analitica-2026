import { isValidDate, isValidLocale, listDailies, loadDaily, getLatestDate } from '../lib/afos-daily/loader'
import { loadGlossary, getGlossaryEntry, isValidGlossaryId, listGlossaryIds } from '../lib/glossary/loader'

let pass = 0
let fail = 0
function check(label: string, actual: unknown, expected: unknown) {
  const ok = actual === expected
  if (ok) {
    pass++
    console.log(`  ✓ ${label}`)
  } else {
    fail++
    console.log(`  ✗ ${label} — expected ${expected}, got ${actual}`)
  }
}

console.log('\nisValidDate edge cases:')
check('valid 2026-04-28', isValidDate('2026-04-28'), true)
check('valid 2024-02-29 (leap)', isValidDate('2024-02-29'), true)
check('invalid 2026-13-01', isValidDate('2026-13-01'), false)
check('invalid 2026-02-30', isValidDate('2026-02-30'), false)
check('invalid 2026-04-31', isValidDate('2026-04-31'), false)
check('invalid 2025-02-29 (non-leap)', isValidDate('2025-02-29'), false)
check('invalid bad-format', isValidDate('bad-format'), false)
check('invalid path traversal', isValidDate('../../etc/passwd'), false)
check('invalid empty', isValidDate(''), false)
check('invalid null-ish 0000-00-00', isValidDate('0000-00-00'), false)

console.log('\nisValidLocale edge cases:')
check('valid pt-BR', isValidLocale('pt-BR'), true)
check('valid en', isValidLocale('en'), true)
check('valid es', isValidLocale('es'), true)
check('invalid fr', isValidLocale('fr'), false)
check('invalid PT-BR (uppercase)', isValidLocale('PT-BR'), false)
check('invalid empty', isValidLocale(''), false)
check('invalid traversal', isValidLocale('../en'), false)

console.log('\nlistDailies and getLatestDate:')
const all = listDailies()
console.log(`  found ${all.length} dailies`)
console.log(`  latest: ${getLatestDate()}`)
check('all entries are valid dates', all.every(isValidDate), true)
check('sorted ascending', JSON.stringify(all) === JSON.stringify([...all].sort()), true)

console.log('\nloadDaily edge cases:')
const ok = loadDaily('2026-04-28')
check('valid date returns object', !!ok, true)
check('  has title', !!ok?.title, true)
check('  has lede', !!ok?.lede, true)
check('  has body', !!ok?.body, true)
check('  has sources', !!ok?.sources, true)
check('invalid date returns null', loadDaily('2026-13-45'), null)
check('path traversal returns null', loadDaily('../../etc/passwd'), null)
check('non-existent date returns null', loadDaily('1999-01-01'), null)
check('empty string returns null', loadDaily(''), null)

console.log('\nGlossary edge cases:')
const glossary = loadGlossary()
console.log(`  found ${glossary.length} entries`)
check('non-empty glossary', glossary.length > 0, true)
check('all entries have id', glossary.every(e => typeof e.id === 'string' && e.id.length > 0), true)
check('all entries have term', glossary.every(e => typeof e.term === 'string' && e.term.length > 0), true)
check('all entries have pt-BR definition', glossary.every(e => typeof e.definitions['pt-BR'] === 'string' && e.definitions['pt-BR'].length > 0), true)
check('all entries have en definition', glossary.every(e => typeof e.definitions.en === 'string' && e.definitions.en.length > 0), true)
check('all entries have es definition', glossary.every(e => typeof e.definitions.es === 'string' && e.definitions.es.length > 0), true)
check('all ids are URL-safe', glossary.every(e => /^[a-z0-9-]+$/.test(e.id)), true)
check('listGlossaryIds matches loadGlossary count', listGlossaryIds().length, glossary.length)
check('valid id returns entry', !!getGlossaryEntry('tse'), true)
check('invalid id returns null', getGlossaryEntry('nonexistent'), null)
check('path traversal in id returns null', getGlossaryEntry('../../etc/passwd'), null)
check('uppercase id returns null (URL-safe enforce)', getGlossaryEntry('TSE'), null)
check('empty id returns null', getGlossaryEntry(''), null)
check('isValidGlossaryId rejects path traversal', isValidGlossaryId('../tse'), false)

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail > 0 ? 1 : 0)
