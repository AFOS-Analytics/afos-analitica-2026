/**
 * Mapa EN de 07/Ago para polls-data.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 7".
 */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/en/glossary#${id})`

construir('polls-data', 'en', {
  'polymarketComparison.note':
    `THE PRICES IN THIS SECTION ARE FROM THE AUG 7 READING, AT 19:44 UTC. AFOS only publishes a price that two independent readings confirm, taken eight minutes apart. LULA'S GAP OVER FLÁVIO NARROWED FOR THE SIXTH DAY RUNNING, from +41.80pp on Aug 1 to +37.55pp today, and the cause sits at one end only: Flávio went from 24.70% to 26.95% over the period and Lula has been flat at 64.50% since Aug 4. THE BIGGEST MOVE OF THE DAY WAS NOT IN THE WINNER CONTRACT: the ${G('first round', 'primeiro-turno')} runner-up contract fell 4.50pp for Flávio, from 87.50% to 83.00%, while his winner price rose. In the third place contract there was a mirror swap, with Renan Santos up 2.50pp, to 58.50%, and Caiado down 2.00pp, to 33.50%, the exact reverse of what the two did on Aug 6. THE POLLING SIDE IS NOT FROM TODAY: there is no new national poll since Aug 5, when ${G('Genial/Quaest', 'quaest')} and Meio/Ideia came out. Five national polls are registered with the ${G('TSE', 'tse')} for Aug 10 and Aug 11, and four of them were still in the field on Friday.`,

  'polymarketComparison.sources':
    `${G('Polymarket', 'polymarket')} prices via the AFOS proxy, capture confirmed by two readings, the most recent at 19:44 UTC on Aug 7 (scripts/capture-guard.ts). Polls: Genial/Quaest BR-06591/2026 and Meio/Ideia BR-04579/2026, both from Aug 5, fielded Jul 31 to Aug 3, reported by G1, CNN Brasil, Folha de S.Paulo, Valor Econômico, O Globo, Estadão, Exame, Gazeta do Povo and JOTA. Genial/Quaest crosstabs released on Aug 6 and Aug 7 by Folha de S.Paulo, Estadão and G1. TSE sweep of Aug 7: 559 records, none newly inserted, 11 national polls in the 15-day window and five of them scheduled for release on Aug 10 and Aug 11.`,

  'polymarketComparison.candidates[0].tendenciaPesquisa':
    `NO NEW NATIONAL POLL. What still stands are the two from Aug 5: ${G('Genial/Quaest', 'quaest')} (n=2,004, fielded Jul 31 to Aug 3, in person, 2pp margin, BR-06591/2026) with 39% in the ${G('first round', 'primeiro-turno')} and 44% x 39% in the runoff against Flávio, also beating Zema 46% x 34%, Caiado 45% x 37% and Renan Santos 45% x 35%; and Meio/Ideia (n=1,500, telephone, 2.5pp margin, BR-04579/2026) with 43% and 48.5% x 43%, winning all four scenarios. WHAT ARRIVED NEW WERE THE CROSSTABS from Quaest, released on Aug 6 and Aug 7: he leads among the elderly, among Catholics and among those with no religion, and opens more than 16 points of advantage among women. The same round measured that Trump's declared backing of his rival does NOT expand voting intention. APPROVAL stays at 48% against 47% at Quaest, with administration ratings at 36% positive, 26% average and 36% negative.`,

  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `[Aug 7 reading, 19:44 UTC] At 64.50% (vol USD 8.11M cumulative). FLAT at the same value for the fourth day running, Aug 4 to Aug 7. The gap over Flávio went from +37.65pp to +37.55pp, the sixth straight narrowing since the high of +41.80pp on Aug 1, and at this tail end the entire narrowing comes from the other side rising. On the 88-day series, May 10 to today, his high is 66.50%, from Aug 1, and only 8 of the 88 days had a value equal to or above the current one.`,

  'polymarketComparison.candidates[1].polymarket': `26.95%`,

  'polymarketComparison.candidates[1].tendenciaPesquisa':
    `NO NEW NATIONAL POLL. What still stands is the 30% in the ${G('first round', 'primeiro-turno')} at ${G('Genial/Quaest', 'quaest')}, against 28% in that house's own Jul 15 round, and the 35% at Meio/Ideia, against 32% in its own Jul 8 round, with runoffs of 39% and 43%. The gap against Lula is 9pp at Quaest and 8pp at Ideia, against the 4pp measured by ${G('BTG/Nexus', 'nexus-btg')} on Aug 3: the 4pp level remains one house on its own. IN THE CROSSTABS released on Aug 6 and Aug 7 he wins among evangelicals, and that is the only large segment where he comes out ahead. REJECTION stays at 54%, against 52% for Lula, and among the top two, the only ones with rejection released in that round, his is the highest.`,

  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `[Aug 7 reading, 19:44 UTC] At 26.95% (vol USD 8.08M cumulative). Up 0.10pp against Aug 6 and six days of closing in completed, from 24.70% on Aug 1 to 26.95% today. It is not extreme: 28 of the 88 days in the series had a value equal to or above it, with a high of 43.30% on May 12 and a low of 22.00% on Jul 3. IN THE RUNNER-UP CONTRACT HE FELL 4.50pp, from 87.50% to 83.00%, the biggest move on the panel since the Aug 6 reading.`,

  'polymarketComparison.candidates[2].polymarket': `7.25%`,

  'polymarketComparison.candidates[2].tendenciaPesquisa':
    `NO NEW NATIONAL POLL. What still stands is the 4% at ${G('Genial/Quaest', 'quaest')}, against 3% in that house's own Jul 15 round, and the 4.7% at Meio/Ideia, against 2% in its own Jul 8 round. In the runoffs he is the weakest of the two rounds: he loses to Lula 45% x 35% at Quaest and 48% x 34.7% at Ideia. With that, six national polls in a row put him between 3% and 4.7%, after the 7.8% from ${G('AtlasIntel', 'atlasintel')} on Jul 29, and the isolated high reading remains the exception of the set.`,

  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `[Aug 7 reading, 19:44 UTC] At 7.25% (vol USD 9.19M cumulative). Up 0.35pp against Aug 6, and in the ${G('first round', 'primeiro-turno')} third place contract up 2.50pp, from 56.00% to 58.50%. With the polling flat between 4% and 4.7%, the gap between price and declared intention WIDENED today, running from 2.55pp to 3.25pp, always on the price side. On the 88-day series his high is 17.90% and his low is 5.50%.`,

  'polymarketComparison.candidates[3].polymarket': `1.55%`,

  'polymarketComparison.candidates[3].tendenciaPesquisa':
    `NO NEW NATIONAL POLL. What still stands is the 4% at ${G('Genial/Quaest', 'quaest')}, the same as that house's own Jul 15 round, and the 5.7% at Meio/Ideia, against 4% in its own Jul 8 round. In the runoffs he loses to Lula 45% x 37% at Quaest and 48.5% x 40% at Ideia. The disagreement between houses about him is still open inside the same field window: 4% at one and 5.7% at the other, with both fielding Jul 31 to Aug 3. His campaign announced that Roberto Azevêdo will coordinate the international area.`,

  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `[Aug 7 reading, 19:44 UTC] At 1.55% (vol USD 5.58M cumulative). DOWN in both books: 0.30pp in the presidential one and 2.00pp in the ${G('first round', 'primeiro-turno')} third place one, from 35.50% to 33.50%. That fall mirrors exactly the rise of Renan Santos in the same contract, which describes a transfer between the two names and not a move by the pack.`,

  'polymarketComparison.candidates[4].tendenciaPesquisa':
    `Neither ${G('Genial/Quaest', 'quaest')} nor Meio/Ideia tests him in any presidential scenario, ${G('first round', 'primeiro-turno')} or runoff, and there has been no new national poll since. Absence of testing is information the panel records, rather than repeating old data as if it were new. He is running for RE-ELECTION as governor of São Paulo, made official by ${G('Republicanos', 'republicanos')} on Aug 1.`,

  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `[Aug 7 reading, 19:44 UTC] At 0.05% (vol USD 13.87M cumulative). No change against Aug 6. The level is low enough that moves in this band carry almost no informational value.`,

  'polymarketComparison.candidates[5].tendenciaPesquisa':
    `NO NEW NATIONAL POLL. What still stands is the 2% at ${G('Genial/Quaest', 'quaest')}, the same as that house's own Jul 15 round, and the 2.6% at Meio/Ideia, against 2.5% in its own Jul 8 round. In the runoffs he is the rival Lula beats by the widest margin at Quaest, 46% x 34%, and he loses 48.5% x 37% at Ideia. HE WAS THE FIRST PRESIDENTIAL CANDIDATE TO FILE HIS REGISTRATION, on Aug 7, declaring R$ 178.7 million in assets, in a window that runs to Aug 15. On the same day, Nikolas Ferreira began trying to convince him to swap the presidential run for the Senate.`,

  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `[Aug 7 reading, 19:44 UTC] At 0.45% (vol USD 4.83M cumulative). Flat at the same value as Aug 6, and in this band moves carry almost no informational value. In the ${G('first round', 'primeiro-turno')} third place contract he sits at 3.70%. The series caveat still applies: his high was 10.10%, on Apr 26.`,

  'polymarketComparison.candidates[6].tendenciaPesquisa':
    `Neither ${G('Genial/Quaest', 'quaest')} nor Meio/Ideia tests him in any scenario, ${G('first round', 'primeiro-turno')} or runoff, and there has been no new national poll since, so he still has no polling of his own. The caveat stands and needs to be said plainly: he is NOT a presidential candidate, he is running for governor of São Paulo, and any scenario including him is a poll hypothesis, not a candidacy under way.`,

  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `[Aug 7 reading, 19:44 UTC] At 0.15% (vol USD 6.77M cumulative). No change against Aug 6. The level is low enough that moves in this band carry almost no informational value.`,
})
