/**
 * 🗳️ RESULTADO OFICIAL do 2º turno no dataset, no MESMO formato do 1º
 * (`build-hf-resultado-oficial.ts`), a partir do arquivo BRUTO do TSE.
 *
 * Gera `hf-assets/results/second-round-2026-*`: o card "Totalização do TSE"
 * completo, os votos de cada candidato e o retrospecto "o que cada instrumento
 * dizia na véspera", como o painel mostra (`SecondRoundSection`).
 *
 * Fontes, e nenhum número sai de outro lugar:
 *   - `data/brz/resultado-oficial-2026/2turno/br-c0001-e006258-u.json`, o
 *     arquivo final do TSE (100% das seções, gerado em 25/10/2026 23:27:02);
 *   - `RESULTADO_2T`, `URNAS_2T` e `RETROSPECTO_2T`, em
 *     `lib/brz/segundo-turno-2026.ts`, o mesmo arquivo de onde o card lê.
 *
 * 🔒 CONTROLE: confere cada número do card contra o bruto e ABORTA se divergir,
 *    e aborta se o arquivo não for o final (`andamento f`).
 *
 * Uso: npx tsx scripts/build-hf-resultado-oficial-2t.ts
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { RESULTADO_2T, RETROSPECTO_2T, URNAS_2T, FONTE_TSE_2T } from '../lib/brz/segundo-turno-2026'

const ROOT = join(__dirname, '..')
const BRUTO = join(ROOT, 'data', 'brz', 'resultado-oficial-2026', '2turno', 'br-c0001-e006258-u.json')
const URL_BRUTO = 'https://resultados.tse.jus.br/oficial/ele2026/6258/dados/br/br-c0001-e006258-u.json'
const SAIDA = join(ROOT, 'hf-assets', 'results')

type Cand = { n: string; nm: string; nmu: string; vap: string; pvap: string; st: string }
type Agr = { nm: string; com: string; par: { sg: string; cand: Cand[] }[] }
const d = JSON.parse(readFileSync(BRUTO, 'utf8')) as {
  dg: string; hg: string; and: string
  s: { ts: string; st: string; pst: string }
  e: { te: string; c: string; pc: string; a: string; pa: string }
  v: { tv: string; vv: string; vb: string; pvb: string; tvn: string; ptvn: string }
  carg: { agr: Agr[] }[]
}
const num = (s: string) => Number(s)
const pct = (s: string) => Number(s.replace(',', '.'))

// ---- extração ----
const candidatos = d.carg[0].agr
  .flatMap((a) => a.par.flatMap((p) => p.cand.map((c) => ({
    number: Number(c.n), name: c.nm, ballot_name: c.nmu, party: p.sg,
    coalition: a.nm, coalition_parties: a.com,
    votes: num(c.vap), pct_valid: pct(c.pvap), status: c.st,
  }))))
  .sort((x, y) => y.votes - x.votes)
const validos = num(d.v.vv)

// ---- 🔒 controle: o card tem de bater com o arquivo do TSE ----
const falhas: string[] = []
const conf = (rotulo: string, card: number, tse: number) => { if (card !== tse) falhas.push(`${rotulo}: card ${card} x TSE ${tse}`) }
const R = RESULTADO_2T
if (!R.final) falhas.push('RESULTADO_2T.final é false: rodar o gerador do card com o arquivo final antes')
if (d.and !== 'f') falhas.push(`andamento "${d.and}", não "f": o arquivo não é o final`)
conf('totalização %', R.totalizacao, pct(d.s.pst))
conf('seções totalizadas', R.secoes.totalizadas, num(d.s.st))
conf('seções', R.secoes.total, num(d.s.ts))
conf('eleitorado', R.eleitorado, num(d.e.te))
conf('comparecimento', R.comparecimento.votos, num(d.e.c))
conf('comparecimento %', R.comparecimento.pct, pct(d.e.pc))
conf('abstenção', R.abstencao.votos, num(d.e.a))
conf('abstenção %', R.abstencao.pct, pct(d.e.pa))
conf('válidos', R.validos, validos)
conf('brancos', R.brancos.votos, num(d.v.vb))
conf('brancos %', R.brancos.pct, pct(d.v.pvb))
conf('nulos', R.nulos.votos, num(d.v.tvn))
conf('nulos %', R.nulos.pct, pct(d.v.ptvn))
R.candidatos.forEach((c, i) => {
  conf(`${c.nome} %`, c.pct, candidatos[i].pct_valid)
  conf(`${c.nome} votos`, c.votos, candidatos[i].votes)
})
conf('seções = urnas de votação', URNAS_2T.votacao, num(d.s.ts))
if (falhas.length) { console.error('❌ card e TSE divergem, NADA foi escrito:\n  ' + falhas.join('\n  ')); process.exit(1) }

// ---- escrita ----
mkdirSync(SAIDA, { recursive: true })
const geradoIso = `${d.dg.split('/').reverse().join('-')}T${d.hg}-03:00`
const urnasTotal = URNAS_2T.votacao + URNAS_2T.contingencia
const pctSubst = Math.round((URNAS_2T.substituidas / urnasTotal) * 10000) / 100
const lula = candidatos.find((c) => /LULA/.test(c.ballot_name))!
const flavio = candidatos.find((c) => /FL[AÁ]VIO/.test(c.ballot_name))!
// Flávio menos Lula nos válidos, a mesma convenção das pesquisas da véspera.
const URNA_DIFF = Math.round((flavio.pct_valid - lula.pct_valid) * 100) / 100
const URNA_TXT = `Lula +${(-URNA_DIFF).toFixed(2)}`

const oficial = {
  election: 'Brazil 2026 presidential election, second round',
  election_date: '2026-10-25',
  source: {
    tally_file: URL_BRUTO,
    tally_generated_at: geradoIso,
    tally_status: 'final (andamento f)',
    results_page: FONTE_TSE_2T,
    machines_document: URNAS_2T.fonte,
    machines_document_title: 'TSE, Relatório de Ocorrências de Urnas Substituídas e Votação Manual, 5º Boletim do 2º turno, ocorrências até 20:00 de 25/10/2026',
  },
  sections: { total: num(d.s.ts), tallied: num(d.s.st), tallied_pct: pct(d.s.pst) },
  electorate: num(d.e.te),
  turnout: { votes: num(d.e.c), pct_of_electorate: pct(d.e.pc) },
  abstention: { votes: num(d.e.a), pct_of_electorate: pct(d.e.pa) },
  votes_cast: num(d.v.tv),
  valid_votes: validos,
  blank: { votes: num(d.v.vb), pct_of_votes_cast: pct(d.v.pvb) },
  null: { votes: num(d.v.tvn), pct_of_votes_cast: pct(d.v.ptvn) },
  candidates: candidatos,
  elected: lula.ballot_name,
  margin_valid_pp: { value: -URNA_DIFF, leader: lula.ballot_name },
  voting_machines: {
    in_use: URNAS_2T.votacao,
    backup: URNAS_2T.contingencia,
    total: urnasTotal,
    replaced_on_election_day: URNAS_2T.substituidas,
    replaced_pct_of_total: pctSubst,
    sections_voting_on_paper: URNAS_2T.votacaoManual,
    reference: 'TSE report of incidents recorded up to 20:00 (Brasília) on 2026-10-25; voting closed at 17:00',
    notes: [
      `The percentage is over all ${urnasTotal.toLocaleString('en-US')} machines (in use plus backup), the same base as the TSE figure of 0.28% and as the first round. Over the ${URNAS_2T.votacao.toLocaleString('en-US')} machines in use it would be ${(Math.round((URNAS_2T.substituidas / URNAS_2T.votacao) * 10000) / 100).toFixed(2)}%.`,
      'The TSE had released 1,516 replacements at 18:00; the 20:00 report adds 35 more.',
      'The TSE term is "replaced" (substituídas). The TSE does not publish a count of "defective" machines.',
    ],
  },
  notes: [
    'Candidate percentages are over valid votes. Blank and null are over votes cast. Turnout and abstention are over the electorate.',
  ],
}
writeFileSync(join(SAIDA, 'second-round-2026-official.json'), JSON.stringify(oficial, null, 2) + '\n')

const csv = (linhas: (string | number | boolean | null)[][]) =>
  linhas.map((l) => l.map((v) => {
    const s = v === null ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }).join(',')).join('\n') + '\n'

writeFileSync(join(SAIDA, 'second-round-2026-candidates.csv'), csv([
  ['rank', 'number', 'name', 'ballot_name', 'party', 'coalition', 'coalition_parties', 'votes', 'pct_valid', 'status'],
  ...candidatos.map((c, i) => [i + 1, c.number, c.name, c.ballot_name, c.party, c.coalition, c.coalition_parties, c.votes, c.pct_valid, c.status]),
]))

writeFileSync(join(SAIDA, 'second-round-2026-summary.csv'), csv([
  ['metric', 'value', 'pct', 'pct_base', 'source'],
  ['sections_total', num(d.s.ts), null, null, 'tally_file'],
  ['sections_tallied', num(d.s.st), pct(d.s.pst), 'sections_total', 'tally_file'],
  ['electorate', num(d.e.te), null, null, 'tally_file'],
  ['turnout', num(d.e.c), pct(d.e.pc), 'electorate', 'tally_file'],
  ['abstention', num(d.e.a), pct(d.e.pa), 'electorate', 'tally_file'],
  ['votes_cast', num(d.v.tv), null, null, 'tally_file'],
  ['valid_votes', validos, null, null, 'tally_file'],
  ['blank', num(d.v.vb), pct(d.v.pvb), 'votes_cast', 'tally_file'],
  ['null', num(d.v.tvn), pct(d.v.ptvn), 'votes_cast', 'tally_file'],
  ['voting_machines_in_use', URNAS_2T.votacao, null, null, 'machines_document'],
  ['voting_machines_backup', URNAS_2T.contingencia, null, null, 'machines_document'],
  ['voting_machines_replaced', URNAS_2T.substituidas, pctSubst, 'voting_machines_in_use + voting_machines_backup', 'machines_document'],
  ['sections_voting_on_paper', URNAS_2T.votacaoManual, null, null, 'machines_document'],
]))

// ---- retrospecto, item a item ----
const linhasRetro: (string | number | boolean | null)[][] = [
  ['instrument', 'market_slug', 'eve_time', 'item', 'eve_value', 'unit', 'eve_rank', 'outcome', 'item_is_outcome'],
]
for (const l of RETROSPECTO_2T) {
  const ordenado = [...l.vespera].sort((a, b) => b.valor - a.valor)
  ordenado.forEach((v, i) => {
    if (l.id === 'pesquisasVespera') {
      linhasRetro.push(['national_poll_eve', null, l.vesperaEm, v.nome, v.valor, 'points, Flávio Bolsonaro minus Lula, total votes', i + 1,
        `${URNA_TXT} (valid votes)`, v.valor < 0])
    } else if (l.id === 'pesquisasTurno') {
      linhasRetro.push(['national_polls_since_first_round', null, '2026-10-08/2026-10-25', v.nome === 'empate' ? 'tie' : v.nome, v.valor,
        'count of national polls with this leader', i + 1, 'Lula', v.nome === 'Lula'])
    } else {
      linhasRetro.push([`market_${l.id === 'vencedor' ? 'winner' : l.id}`, l.slug ?? null, l.vesperaEm, v.nome, v.valor, 'price, percent', i + 1,
        'Lula', v.nome === 'Lula'])
    }
  })
}
writeFileSync(join(SAIDA, 'second-round-2026-retrospective.csv'), csv(linhasRetro))

// ---- o card "O que cada instrumento dizia na véspera", uma linha por instrumento ----
// Mesmos rótulos do card em inglês (SecondRoundSection, bloco `en`).
const resumo: (string | number | boolean | null)[][] = [
  ['instrument', 'label', 'market_slug', 'eve_time', 'eve_summary', 'outcome', 'matches_outcome',
    'houses_lula_ahead', 'houses_flavio_ahead', 'range_low', 'range_high', 'majority_matches', 'range_contains_outcome'],
]
for (const l of RETROSPECTO_2T) {
  const confere = l.confere ? 'yes' : 'no'
  if (l.id === 'pesquisasVespera') {
    const nL = l.vespera.filter((v) => v.valor < 0).length
    const nF = l.vespera.filter((v) => v.valor > 0).length
    const lo = Math.min(...l.vespera.map((v) => v.valor)), hi = Math.max(...l.vespera.map((v) => v.valor))
    resumo.push(['national_poll_eve', `National polls released on the eve (${l.vespera.length})`, null, l.vesperaEm,
      `Flávio Bolsonaro ahead in ${nF}, Lula in ${nL}. Distance from Lula +${(-lo).toFixed(1)} to Flávio Bolsonaro +${hi.toFixed(1)}`,
      URNA_TXT, confere, nL, nF, lo, hi, nL > nF, lo <= URNA_DIFF && URNA_DIFF <= hi])
  } else if (l.id === 'pesquisasTurno') {
    const n = (k: string) => l.vespera.find((v) => v.nome === k)?.valor ?? 0
    const total = l.vespera.reduce((s, v) => s + v.valor, 0)
    resumo.push(['national_polls_since_first_round', `National polls conducted after the first round (${total})`, null, '2026-10-08/2026-10-25',
      `Flávio Bolsonaro ahead in ${n('Flávio Bolsonaro')}, Lula in ${n('Lula')}, tie in ${n('empate')}`,
      'Lula', confere, n('Lula'), n('Flávio Bolsonaro'), null, null, n('Lula') > n('Flávio Bolsonaro'), null])
  } else {
    const eve = [...l.vespera].sort((a, b) => b.valor - a.valor).map((v) => `${v.nome} ${v.valor.toFixed(2)}%`).join(' · ')
    resumo.push(['market_winner', 'Election winner contract', l.slug ?? null, l.vesperaEm, eve, 'Lula', confere, null, null, null, null, null, null])
  }
}
writeFileSync(join(SAIDA, 'second-round-2026-retrospective-summary.csv'), csv(resumo))

console.log(`✅ second-round-2026-* escrito: ${candidatos.length} candidatos, ${linhasRetro.length - 1} linhas de retrospecto, urna ${URNA_TXT}. Card e TSE conferidos, todos iguais.`)
