/**
 * 🗳️ RESULTADO OFICIAL no dataset, a partir do arquivo BRUTO do TSE.
 *
 * Gera `hf-assets/results/` com o card "Totalização do TSE" COMPLETO, como o
 * painel o mostra, mais os votos absolutos de cada candidato e o retrospecto
 * "o que cada instrumento dizia na véspera". Pedido do André em 11/Out/2026:
 * "os dados finais devem ser completos", 1º turno agora e 2º turno quando a
 * eleição terminar.
 *
 * Fontes, e nenhum número sai de outro lugar:
 *   - `data/brz/resultado-oficial-2026/1turno/br-c0001-e006257-u.json`, o
 *     arquivo final do TSE (100% das seções, gerado em 05/10/2026 12:51:47);
 *   - `URNAS_1T` e `RETROSPECTO_1T`, em `lib/brz/primeiro-turno-2026.ts`, que é
 *     o mesmo arquivo de onde o card do painel lê. Um número, um lugar.
 *
 * 🔒 CONTROLE: antes de escrever, ele confere cada número do card
 *    (`RESULTADO_1T`) contra o arquivo bruto do TSE e ABORTA se algum divergir.
 *    Card e dataset não podem dizer coisas diferentes sobre a mesma urna.
 *
 * ⛔ Arquivo de fato encerrado: o 1º turno é escrito uma vez. Rodar de novo só
 *    reescreve igual. O 2º turno entra como `second-round-2026-*`, ao lado.
 *
 * Uso: npx tsx scripts/build-hf-resultado-oficial.ts --turno=1
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { RESULTADO_1T, RETROSPECTO_1T, URNAS_1T, FONTE_TSE } from '../lib/brz/primeiro-turno-2026'

const ROOT = join(__dirname, '..')
const turno = (process.argv.find((a) => a.startsWith('--turno=')) ?? '--turno=1').split('=')[1]
if (turno !== '1') throw new Error('Este script é o do 1º turno. O 2º tem o próprio: npx tsx scripts/build-hf-resultado-oficial-2t.ts')

const BRUTO = join(ROOT, 'data', 'brz', 'resultado-oficial-2026', '1turno', 'br-c0001-e006257-u.json')
const URL_BRUTO = 'https://resultados.tse.jus.br/oficial/ele2026/6257/dados/br/br-c0001-e006257-u.json'
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
const top = 5
const demaisVotos = candidatos.slice(top).reduce((s, c) => s + c.votes, 0)
const demaisPct = Math.round((demaisVotos / validos) * 10000) / 100

// ---- 🔒 controle: o card tem de bater com o arquivo do TSE ----
const falhas: string[] = []
const conf = (rotulo: string, card: number, tse: number) => { if (card !== tse) falhas.push(`${rotulo}: card ${card} x TSE ${tse}`) }
const R = RESULTADO_1T
conf('totalização %', R.totalizacao, pct(d.s.pst))
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
conf('demais %', R.demais, demaisPct)
R.candidatos.forEach((c, i) => conf(`${c.nome} %`, c.pct, candidatos[i].pct_valid))
if (d.and !== 'f') falhas.push(`andamento "${d.and}", não "f": o arquivo não é o final`)
if (falhas.length) { console.error('❌ card e TSE divergem, NADA foi escrito:\n  ' + falhas.join('\n  ')); process.exit(1) }

// ---- escrita ----
mkdirSync(SAIDA, { recursive: true })
const [dia, hora] = [d.dg, d.hg]
const geradoIso = `${dia.split('/').reverse().join('-')}T${hora}-03:00`
const urnasTotal = URNAS_1T.votacao + URNAS_1T.contingencia
const pctSubst = Math.round((URNAS_1T.substituidas / urnasTotal) * 10000) / 100

const oficial = {
  election: 'Brazil 2026 presidential election, first round',
  election_date: '2026-10-04',
  source: {
    tally_file: URL_BRUTO,
    tally_generated_at: geradoIso,
    tally_status: 'final (andamento f)',
    results_page: FONTE_TSE,
    machines_document: URNAS_1T.fonte,
    machines_document_title: 'TSE, Números gerais, coletiva das 21h, 04/10/2026',
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
  other_names: { candidates: candidatos.length - top, votes: demaisVotos, pct_valid: demaisPct },
  runoff: { date: R.segundoTurno, candidates: candidatos.filter((c) => /2º turno/.test(c.status)).map((c) => c.ballot_name) },
  voting_machines: {
    in_use: URNAS_1T.votacao,
    backup: URNAS_1T.contingencia,
    total: urnasTotal,
    replaced_on_election_day: URNAS_1T.substituidas,
    replaced_pct_of_total: pctSubst,
    sections_voting_on_paper: URNAS_1T.votacaoManual,
    reference: 'TSE briefing at 21:00 (Brasília) on 2026-10-04',
    notes: [
      'The percentage is over all 549,286 machines (in use plus backup), the same base as the TSE figure of 0.35%. Over the 499,248 machines in use it would be 0.38%.',
      'According to the TSE, the replacements, mostly caused by power fluctuations, did not affect votes already recorded.',
      'The TSE term is "replaced" (substituídas). The TSE does not publish a count of "defective" machines.',
    ],
  },
  notes: [
    'Candidate percentages are over valid votes. Blank and null are over votes cast. Turnout and abstention are over the electorate.',
    'Other names: the seven candidates below fifth place, summed by votes (not 100 minus the rounded percentages, which would give 0.50).',
  ],
}
writeFileSync(join(SAIDA, 'first-round-2026-official.json'), JSON.stringify(oficial, null, 2) + '\n')

const csv = (linhas: (string | number | boolean | null)[][]) =>
  linhas.map((l) => l.map((v) => {
    const s = v === null ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }).join(',')).join('\n') + '\n'

writeFileSync(join(SAIDA, 'first-round-2026-candidates.csv'), csv([
  ['rank', 'number', 'name', 'ballot_name', 'party', 'coalition', 'coalition_parties', 'votes', 'pct_valid', 'status'],
  ...candidatos.map((c, i) => [i + 1, c.number, c.name, c.ballot_name, c.party, c.coalition, c.coalition_parties, c.votes, c.pct_valid, c.status]),
]))

writeFileSync(join(SAIDA, 'first-round-2026-summary.csv'), csv([
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
  ['other_names_votes', demaisVotos, demaisPct, 'valid_votes', 'tally_file'],
  ['voting_machines_in_use', URNAS_1T.votacao, null, null, 'machines_document'],
  ['voting_machines_backup', URNAS_1T.contingencia, null, null, 'machines_document'],
  ['voting_machines_replaced', URNAS_1T.substituidas, pctSubst, 'voting_machines_in_use + voting_machines_backup', 'machines_document'],
  ['sections_voting_on_paper', URNAS_1T.votacaoManual, null, null, 'machines_document'],
]))

const linhasRetro: (string | number | boolean | null)[][] = [
  ['instrument', 'market_slug', 'eve_time', 'item', 'eve_value', 'unit', 'eve_rank', 'outcome', 'item_is_outcome'],
]
for (const l of RETROSPECTO_1T) {
  const ordenado = [...l.vespera].sort((a, b) => b.valor - a.valor)
  ordenado.forEach((v, i) => {
    if (l.id === 'pesquisas') {
      linhasRetro.push(['national_poll_eve', null, l.vesperaEm, v.nome, v.valor, 'points, Flávio Bolsonaro minus Lula, total votes', i + 1,
        'Flávio Bolsonaro +1.87 (valid votes)', v.valor > 0])
    } else {
      linhasRetro.push([`market_${l.id}`, l.slug ?? null, l.vesperaEm, v.nome, v.valor, 'price, percent', i + 1,
        l.urna ?? 'open, decided on 2026-10-25', l.urna === null ? null : v.nome === l.urna])
    }
  })
}
writeFileSync(join(SAIDA, 'first-round-2026-retrospective.csv'), csv(linhasRetro))

// ---- o card "O que cada instrumento dizia na véspera", uma linha por instrumento ----
// Mesmos rótulos e desfechos do card em inglês (FirstRoundSection, bloco `en`),
// e as leituras calculadas de RETROSPECTO_1T, como o card faz. Pedido do André em
// 11/Out: o resumo do card também entra, não só os itens.
const ROTULO: Record<string, string> = {
  pesquisas: 'Eve-of-vote national polls (9)',
  segundo: 'First-round 2nd-place book',
  terceiro: 'First-round 3rd-place book',
  senado: 'Book on the party with most Senate seats',
  vencedor: 'Election winner contract',
}
const DESFECHO: Record<string, string> = {
  pesquisas: 'Flávio Bolsonaro +1.87',
  segundo: 'Lula 2nd',
  terceiro: 'Augusto Cury 3rd (2.89%), Renan Santos 4th',
  senado: 'PL, with 19 of the 54 seats',
  // Resolvido em 25/Out: o 2º turno elegeu Lula. Até então era 'open, decided on 25 Oct'.
  vencedor: 'Lula, elected in the 25 Oct second round',
}
const URNA_PESQUISAS = 1.87 // Flávio menos Lula nos válidos, da totalização acima
const resumo: (string | number | boolean | null)[][] = [
  ['instrument', 'label', 'market_slug', 'eve_time', 'eve_summary', 'outcome', 'matches_outcome',
    'houses_lula_ahead', 'houses_flavio_ahead', 'range_low', 'range_high', 'majority_matches', 'range_contains_outcome'],
]
for (const l of RETROSPECTO_1T) {
  const confere = l.confere === null ? 'open' : l.confere ? 'yes' : 'no'
  if (l.id === 'pesquisas') {
    const lula = l.vespera.filter((v) => v.valor < 0).length
    const flavio = l.vespera.filter((v) => v.valor > 0).length
    const lo = Math.min(...l.vespera.map((v) => v.valor)), hi = Math.max(...l.vespera.map((v) => v.valor))
    const maioria = flavio > lula // a urna deu Flávio à frente
    resumo.push(['national_poll_eve', ROTULO.pesquisas, null, l.vesperaEm,
      `Lula ahead in ${lula}, Flávio Bolsonaro in ${flavio}. Distance from Lula +${(-lo).toFixed(1)} to Flávio Bolsonaro +${hi.toFixed(1)}`,
      DESFECHO.pesquisas, confere, lula, flavio, lo, hi, maioria, lo <= URNA_PESQUISAS && URNA_PESQUISAS <= hi])
  } else {
    const eve = [...l.vespera].sort((a, b) => b.valor - a.valor).map((v) => `${v.nome} ${v.valor.toFixed(2)}%`).join(' · ')
    resumo.push([`market_${l.id}`, ROTULO[l.id], l.slug ?? null, l.vesperaEm, eve, DESFECHO[l.id], confere, null, null, null, null, null, null])
  }
}
writeFileSync(join(SAIDA, 'first-round-2026-retrospective-summary.csv'), csv(resumo))

console.log(`✅ results/ escrito: ${candidatos.length} candidatos, ${linhasRetro.length - 1} linhas de retrospecto. Card e TSE conferidos em ${12 + R.candidatos.length + 1} números, todos iguais.`)
