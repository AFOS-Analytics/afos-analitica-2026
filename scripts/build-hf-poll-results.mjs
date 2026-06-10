/**
 * Reconstrói a SÉRIE de resultados de pesquisas eleitorais NACIONAIS a partir do histórico
 * git de public/polls-data.json (as pesquisas saem do JSON após ~30 dias pela regra de frescor,
 * mas a história git preserva todas). DB-FREE — lê só artefato público versionado.
 *
 * Saída em hf-assets/polls/ (commitada; o export-hf-dataset.mjs copia para o HF):
 *   - national-poll-results-firstround.csv  (long: 1 linha por candidato/cenário/pesquisa)
 *   - national-poll-results-secondround.csv (1 linha por confronto de 2º turno)
 *   - national-polls.json                   (array estruturado, deduplicado, completo)
 */
import { execSync } from 'child_process'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const ROOT = process.cwd()
const OUT = join(ROOT, 'hf-assets', 'polls')
mkdirSync(OUT, { recursive: true })

const csvEscape = (v) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
const splitName = (raw) => {
  const m = String(raw ?? '').match(/^(.+?)\s*\((.+)\)\s*$/)
  return m ? { name: m[1].trim(), party: m[2].trim() } : { name: String(raw ?? '').trim(), party: '' }
}
const completeness = (p) =>
  (p.scenarios || []).reduce((a, s) => a + (s.results?.length || 0), 0) + (p.secondRound?.length || 0) * 0.5

const shas = execSync('git log --format=%H -- public/polls-data.json', { cwd: ROOT, encoding: 'utf-8' })
  .trim().split('\n').filter(Boolean)
console.log(`🔎 ${shas.length} versões de polls-data.json no histórico git`)

const byKey = new Map()
for (const sha of shas) {
  let json
  try { json = JSON.parse(execSync(`git show ${sha}:public/polls-data.json`, { cwd: ROOT, encoding: 'utf-8', maxBuffer: 32 * 1024 * 1024 })) }
  catch { continue }
  for (const p of json.polls || []) {
    const key = p.register || `${p.institute}|${p.date}`
    const prev = byKey.get(key)
    if (!prev || completeness(p) > completeness(prev)) byKey.set(key, p)
  }
}
const polls = [...byKey.values()].sort((a, b) => String(a.date).localeCompare(String(b.date)))
console.log(`📊 ${polls.length} pesquisas nacionais distintas reconstruídas`)

// --- 1º turno (long format) ---
const head1 = 'poll_id,register_tse,institute,poll_date,field_dates,sample,margin_pp,method,scenario,candidate,party,percent'
const rows1 = []
for (const p of polls) {
  const pid = p.register || `${p.institute}-${p.date}`
  for (const sc of p.scenarios || []) {
    for (const r of sc.results || []) {
      const { name, party } = splitName(r.candidate)
      rows1.push([pid, p.register || '', p.institute, p.date, p.fieldDates || '', p.sample ?? '', p.margin ?? '', p.method || '', sc.name || '', name, party, r.percent ?? ''])
    }
  }
}
writeFileSync(join(OUT, 'national-poll-results-firstround.csv'),
  [head1, ...rows1.map((r) => r.map(csvEscape).join(','))].join('\n') + '\n')

// --- 2º turno ---
const head2 = 'poll_id,register_tse,institute,poll_date,matchup,candidate1,percent1,candidate2,percent2'
const rows2 = []
for (const p of polls) {
  const pid = p.register || `${p.institute}-${p.date}`
  for (const sr of p.secondRound || []) {
    rows2.push([pid, p.register || '', p.institute, p.date, sr.matchup || '', sr.candidate1 || '', sr.percent1 ?? '', sr.candidate2 || '', sr.percent2 ?? ''])
  }
}
writeFileSync(join(OUT, 'national-poll-results-secondround.csv'),
  [head2, ...rows2.map((r) => r.map(csvEscape).join(','))].join('\n') + '\n')

// --- JSON estruturado completo ---
writeFileSync(join(OUT, 'national-polls.json'), JSON.stringify({
  description: 'National electoral polls (Brazil 2026) with published results, reconstructed from the AFOS dashboard history. Each poll carries its TSE registration number.',
  generated_from: 'public/polls-data.json git history',
  count: polls.length,
  polls,
}, null, 2))

console.log(`✅ ${rows1.length} linhas 1T, ${rows2.length} linhas 2T → hf-assets/polls/`)
