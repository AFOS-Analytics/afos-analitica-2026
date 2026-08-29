/** Mapa EN de 29/Ago/2026, parte C: os 13 campos que faltaram em polls-data. */
import { readFileSync } from 'fs'
import { construir } from '../build-locale-json'

const S = 'confirmed reading of Aug 29, 1:27 PM BRT (4:27 PM UTC)'
const DISC =
  "In the panel's 30-day window he had already appeared ahead in the runoff in three other national polls: Gerp of Aug 26, 47% to 42%, Veritá of Aug 21, 47.3% to 42%, and Gerp of Aug 11, 45% to 43%. The pollsters disagree with each other about the runoff, and the clearest case is Aug 26, when Gerp gave him 47% to 42% and Indexa/Broadcast gave the leader 46% to 41%, on the SAME day and with opposite signs."
const VIRADA =
  'Across the two Vox readings the sign of the runoff changed sides: on Jul 31 the leader was 6.4 points ahead and now he is 0.6 point behind.'
const G = (t: string, id: string) => `[${t}](/en/glossary#${id})`

// A nota da PoderData mudou UMA frase (o superlativo do Cury virou intervalo).
// Reaproveitar a tradução publicada e trocar só aquela frase é mais seguro do
// que redigitar 1.400 caracteres de números.
const anterior = JSON.parse(readFileSync('public/polls-data.en.json', 'utf8'))
const notaPoder = anterior.polls.find((p: { register: string }) => p.register === 'BR-04974/2026')?.note as string
if (!notaPoder) throw new Error('nota da PoderData nao encontrada na traducao anterior')
const DE = '⭐ And Augusto Cury’s 4% is his highest figure in the whole panel table, which gathers the national polls of the last 30 days and has measured him between 1% and 3% until now.'
const DE2 = "⭐ And Augusto Cury's 4% is his highest figure in the whole panel table, which gathers the national polls of the last 30 days and has measured him between 1% and 3% until now."
const PARA = "⭐ And Augusto Cury's 4% sits at the top of the range in which the panel's 11 readings measure him, from 1% to 4%."
let notaNova = notaPoder.includes(DE) ? notaPoder.replace(DE, PARA) : notaPoder.replace(DE2, PARA)
if (notaNova === notaPoder) {
  // a frase inglesa não bateu; localiza pelo trecho estável e corta até o ponto final
  const i = notaPoder.indexOf('⭐ And Augusto Cury')
  if (i < 0) throw new Error('frase do Cury nao localizada na traducao anterior')
  const j = notaPoder.indexOf('.', notaPoder.indexOf('until now', i) >= 0 ? notaPoder.indexOf('until now', i) : i + 60)
  notaNova = notaPoder.slice(0, i) + PARA + notaPoder.slice(j + 1)
}

construir('polls-data', 'en', {
  'polls[1].note': notaNova,
  'polymarketComparison.candidates[0].polymarket': '56.50%',
  'polymarketComparison.candidates[0].pesquisaRange': '37.1-38%',
  'polymarketComparison.candidates[1].polymarket': '38.95%',
  'polymarketComparison.candidates[1].pesquisaRange': '34.8-35%',
  'polymarketComparison.candidates[2].polymarket': '3.15%',
  'polymarketComparison.candidates[2].pesquisaRange': '2.6-4%',
  'polymarketComparison.candidates[3].polymarket': '2.25%',
  'polymarketComparison.candidates[3].pesquisaRange': '3.3-4%',
  'polymarketComparison.candidates[4].polymarket': '0.25%',
  'polymarketComparison.candidates[4].pesquisaRange': '4-5%',
  'polymarketComparison.candidates[6].pesquisaRange': '1-2.8%',
  'polymarketComparison.candidates[8].tendenciaPesquisa': 'He is not tested as a presidential candidate in the national polls in the window.',
  // repete os da parte B, porque o `construir` monta o arquivo inteiro de uma vez
  'polls[0].note': anterior.polls[0]?.register === 'BR-05519/2026' ? (anterior.polls[0].note as string) : PLACEHOLDER_VOX(),
  'polls[0].source': 'Vox Brasil released on Aug 29 by Metrópoles, CNN Brasil, VEJA, Exame, JOTA and Alagoas 24 Horas. TSE registration BR-05519/2026.',
  'polymarketComparison.note': PLACEHOLDER_NOTE(),
  'polymarketComparison.candidates[0].tendenciaPesquisa': `Vox Brasil of Aug 29 (BR-05519/2026, fieldwork Aug 25 to 27, n=2,100) puts him at 37.1% in the first round, 2.3 points ahead, and at 44.5% in the runoff against 45.1%, behind by 0.6 point inside the 2.15pp margin. Against Vox's own Jul 31 reading he gives up 3.4pp in the first round and 3.0pp in the runoff.`,
  'polymarketComparison.candidates[0].tendenciaPolymarket': `56.50% (vol USD 9.42M) in the ${S}. Down 1.00pp, and the distance to the runner-up fell to 17.55pp, the lowest value in the 20-day window, after twenty days of near-continuous narrowing since the 36.40pp of Aug 10.`,
  'polymarketComparison.candidates[1].tendenciaPesquisa': `Vox Brasil of Aug 29 puts him at 34.8% in the first round and at 45.1% in the runoff, ahead of the leader by 0.6 point and inside the 2.15pp margin, that is, a technical tie. ${VIRADA} ${DISC} Against Vox's own Jul 31 reading he rises 3.6pp in the first round and 4.0pp in the runoff, with the same in-person method and the same sample.`,
  'polymarketComparison.candidates[1].tendenciaPolymarket': `38.95% (vol USD 9.21M) in the ${S}. Up 3.30pp, the LARGEST move on the panel. In the second-place contract for the first round he rose 1.50pp, to 86.50%, and this time both books moved in the same direction.`,
  'polymarketComparison.candidates[2].tendenciaPesquisa': `Vox Brasil of Aug 29 measures him at 2.6% in the first round, the sixth name on the table, below the 4% PoderData/Aya gave him on Aug 27.`,
  'polymarketComparison.candidates[2].tendenciaPolymarket': `3.15% (vol USD 2.55M) in the ${S}. Down 0.35pp. This round publishes no new number for him in the third-place contract, which stood at 26.70% on Aug 28.`,
  'polymarketComparison.candidates[3].tendenciaPesquisa': `Vox Brasil of Aug 29 measures him at 3.3% in the first round, the fourth name on the table, ahead of Zema and Cury and behind Caiado.`,
  'polymarketComparison.candidates[3].tendenciaPolymarket': `2.25% (vol USD 11.81M) in the ${S}. Down 0.65pp. In the third-place contract he gave up 3.00pp, to 32.50%, and LOST the lead he had held since Aug 9.`,
  'polymarketComparison.candidates[4].tendenciaPesquisa': `Vox Brasil of Aug 29 puts him at 5.0% in the first round, the THIRD name on the table. In the runoff he loses to the leader 45.5% to 41.1%, a distance of 4.4 points.`,
  'polymarketComparison.candidates[4].tendenciaPolymarket': `0.25% (vol USD 6.89M) in the ${S}. Unchanged, and below the 0.5% floor of the double reading. In the third-place contract he rose 2.00pp, to 36.50%, and TOOK the lead of that book.`,
  'polymarketComparison.candidates[5].tendenciaPesquisa': `Vox Brasil of Aug 29 does not carry him in the released first-round table. PoderData/Aya of Aug 27 measured him at 3% in the first round.`,
  'polymarketComparison.candidates[5].tendenciaPolymarket': `0.15% (vol USD 3.06M) in the ${S}. Unchanged, and below the 0.5% floor of the double reading.`,
  'polymarketComparison.candidates[6].tendenciaPesquisa': `Vox Brasil of Aug 29 measures him at 2.8% in the first round and tests a runoff scenario in which he loses to the leader 45.5% to 39.3%.`,
  'polymarketComparison.candidates[6].tendenciaPolymarket': `0.05% (vol USD 6.32M) in the ${S}. Down 0.10pp, and below the 0.5% floor of the double reading.`,
  'polymarketComparison.candidates[7].tendenciaPesquisa': `He is not tested as a presidential candidate in the national polls in the window.`,
  'polymarketComparison.candidates[7].tendenciaPolymarket': `0.05% (vol USD 14.06M) in the ${S}. Unchanged. He is not a presidential candidate: he is running for re-election in São Paulo.`,
  'polymarketComparison.candidates[8].tendenciaPolymarket': `0.05% (vol USD 7.41M) in the ${S}. Unchanged. He is not a presidential candidate: he is running for governor of São Paulo.`,
})

function PLACEHOLDER_VOX(): string {
  return `Vox Brasil national poll published Aug 29 (Metrópoles, CNN Brasil, VEJA, Exame, JOTA, Alagoas 24 Horas). First round Lula 37.1% x Flávio Bolsonaro 34.8%, a distance of 2.3pp, a technical tie by the 2.15pp margin; Ronaldo Caiado 5.0%, Renan Santos 3.3%, Romeu Zema 2.8%, Augusto Cury 2.6%, others 4.1%, blank and null 3.5% and don't know 6.8%. The table closes at 100.0. Runoff Flávio 45.1% x Lula 44.5%, also a technical tie. Fieldwork Aug 25 to 27, n=2,100, in person, margin 2.15pp, 95% confidence, registration BR-05519/2026, funded by the institute's own resources. ⭐ THE COMPARISON THAT COUNTS IS WITH THE POLLSTER ITSELF, SAME METHOD AND SAME SAMPLE, AND IT SHOWS THE RUNOFF FLIPPING IN ONE MONTH: on Jul 31 Vox measured first round Lula 40.5% x Flávio 31.2%, a distance of 9.3pp, and runoff Lula 47.5% x Flávio 41.1%, a distance of 6.4pp outside the margin. Now the first-round distance is 2.3pp and the runoff has changed sides, with 0.6pp for Flávio. That is 7.0 points of narrowing in the first round and 7.0 points of reversal in the runoff, which Exame also reported. ⚠️ THIS HOLDS FOR THE VOX SERIES, NOT FOR THE SET OF NATIONAL POLLS. ${VIRADA} ${DISC} REJECTION of 52.7% for Lula and 49.3% for Flávio (CNN Brasil). Exame records disapproval of Lula at 53.3% in the same round. NATIONAL SCOPE confirmed on release. ⚠️ Fieldwork closed on Aug 27, BEFORE campaign advertising debuted on Aug 28, so this poll does not measure any advertising effect.`
}
function PLACEHOLDER_NOTE(): string {
  return `Polymarket prices in the ${S}, with the presidential book at USD 138.92M. THE DAY DID BRING A NATIONAL POLL: Vox Brasil (BR-05519/2026, fieldwork Aug 25 to 27, n=2,100, margin of 2.15pp, in person), the first in two days. It brings the first round at 37.1% to 34.8%, a distance of 2.3 points, and the runoff at 45.1% to 44.5% for Flávio Bolsonaro. The 0.6 point sits inside the margin, so the reading is a ${G('technical tie', 'empate-tecnico')} and not a lead. ${VIRADA} That holds for the Vox series, not for the set of national polls. ${DISC} The comparison that carries the day is the pollster against itself: on Jul 31 Vox measured 40.5% to 31.2% in the first round and 47.5% to 41.1% in the runoff, with the same in-person method and the same sample of 2,100. In one month the first-round distance fell 7.0 points and the runoff changed sides. In the market, Flávio Bolsonaro's outright-winner contract rose 3.30pp, to 38.95%, the largest move on the panel, Lula's gave up 1.00pp, to 56.50%, and the distance between the two fell to 17.55pp, the lowest value in the 20-day window. AFOS does not say which of the two instruments is right: both are forecasts of the same event and can be wrong together, and only the count settles it. What the record allows us to state is the sequence, because Flávio Bolsonaro's price started rising on the night of Aug 28, before the poll was released on Aug 29. Away from the top, the third-place contract for the first round changed leaders: Ronaldo Caiado rose to 36.50% and Renan Santos fell to 32.50%, ending a lead that had lasted since Aug 9, and Vox points the same way by placing Caiado as the third name in the first round, at 5.0%. ⚠️ A poll percentage and a contract price are different quantities and do not subtract: one measures declared voting intention, the other measures the implied probability of winning.`
}
