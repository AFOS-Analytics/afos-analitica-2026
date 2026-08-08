/**
 * Mapa EN de 08/Ago para polls-data.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 8".
 */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/en/glossary#${id})`

construir('polls-data', 'en', {
  'polymarketComparison.note':
    `THE PRICES IN THIS SECTION ARE FROM THE AUG 8 READING, AT 17:32 UTC. AFOS only publishes a price that two independent readings confirm, taken eight minutes apart. THE SIX-DAY RUN OF NARROWING IN THE GAP DID NOT CONTINUE: it came from +41.80pp on Aug 1 and fell every day through Aug 7, and today it held at +37.55pp, with Lula flat at 64.50% for the fifth day and Flávio flat at 26.95%. Neither gave back ground. THE MOVE OF THE DAY IS IN THE PLACEMENT BOOKS, and it contradicts yesterday's reading: in the ${G('first round', 'primeiro-turno')} runner-up book, Flávio fell for the second day running, from 87.50% on Aug 6 to 81.50% today, and this time his winner price did not rise alongside; in the third place book, Caiado fell 2.50pp and Renan Santos did NOT rise, he held at 58.50%, so the probability left the book instead of migrating inside it. Also in the runner-up book, Renan Santos sits at 8.30% against Lula's 8.20%, a 0.10pp difference between two low values, and being above the president there is the pattern of the series, not news: it happened on 75 of the 89 days. THE POLLING SIDE IS NOT FROM TODAY: there is no new national poll since Aug 5. Six national polls are registered with the ${G('TSE', 'tse')} for Aug 10, Aug 11 and Aug 13, and none has a result yet.`,

  'polymarketComparison.sources':
    `${G('Polymarket', 'polymarket')} prices via the AFOS proxy, capture confirmed by two readings, the most recent at 17:32 UTC on Aug 8 (scripts/capture-guard.ts). Polls: Genial/Quaest BR-06591/2026 and Meio/Ideia BR-04579/2026, both from Aug 5, fielded Jul 31 to Aug 3, reported by G1, CNN Brasil, Folha de S.Paulo, Valor Econômico, O Globo, Estadão, Exame, Gazeta do Povo and JOTA. TSE sweep of Aug 8: 565 records, none newly inserted by the manual run, and SIX national polls in the release queue: Palver (n=5,000), Gerp (n=2,400) and BTG/Nexus (n=2,000) on Aug 10, MDA (n=2,002) and 100 Cidades (n=2,000) on Aug 11, and PoderData (n=2,400, BR-06868/2026) on Aug 13.`,

  'polymarketComparison.candidates[0].tendenciaPesquisa':
    `NO NEW NATIONAL POLL since Aug 5. What still stands are the two from that day: ${G('Genial/Quaest', 'quaest')} (n=2,004, fielded Jul 31 to Aug 3, in person, 2pp margin, BR-06591/2026) with 39% in the ${G('first round', 'primeiro-turno')} and 44% x 39% in the runoff against Flávio, also beating Zema 46% x 34%, Caiado 45% x 37% and Renan Santos 45% x 35%; and Meio/Ideia (n=1,500, telephone, 2.5pp margin, BR-04579/2026) with 43% and 48.5% x 43%. In the Quaest crosstabs he leads among the elderly, among Catholics and among those with no religion, and opens more than 16 points among women. APPROVAL stays at 48% against 47%. ON THE BOARD, he filed his candidacy with the ${G('TSE', 'tse')} on the night of Aug 7, with Alckmin as running mate, under the Brasil Pronto Pra Mais coalition, which brings together seven parties and is the only ticket in the race with more than one.`,

  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `[Aug 8 reading, 17:32 UTC] At 64.50% (vol USD 8.12M cumulative). FLAT at the same value for the FIFTH day running, Aug 4 to Aug 8. The gap over Flávio held at +37.55pp and the six-day run of narrowing did not continue. On the 88-day series, May 10 to Aug 7, his high is 66.50%, from Aug 1, and only 8 of the 88 days had a value equal to or above the current one.`,

  'polymarketComparison.candidates[1].tendenciaPesquisa':
    `NO NEW NATIONAL POLL. What still stands is the 30% in the ${G('first round', 'primeiro-turno')} at ${G('Genial/Quaest', 'quaest')}, against 28% in that house's own Jul 15 round, and the 35% at Meio/Ideia, against 32% in its own Jul 8 round, with runoffs of 39% and 43%. The gap against Lula is 9pp at Quaest and 8pp at Ideia. In the crosstabs he wins among evangelicals, the only large segment where he comes out ahead. REJECTION stays at 54%, against 52% for Lula. ON THE BOARD, his ticket closed the picture in which 2026 becomes the first election this century with no woman on a competitive presidential ticket, and his running mate is on the list of Pix earmarks Dino ordered the ${G('PF', 'pf')} to investigate.`,

  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `[Aug 8 reading, 17:32 UTC] At 26.95% (vol USD 8.08M cumulative). IT STOPPED after six days of gains, at the same value as Aug 7, and gave back no ground. It is not extreme: 29 of the 88 days in the series had a value equal to or above it, with a high of 43.30% on May 12 and a low of 22.00% on Jul 3. IN THE RUNNER-UP CONTRACT HE FELL FOR THE SECOND DAY, from 87.50% on Aug 6 to 83.00% on Aug 7 and 81.50% today.`,

  'polymarketComparison.candidates[2].polymarket': `7.65%`,

  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `[Aug 8 reading, 17:32 UTC] At 7.65% (vol USD 9.23M cumulative). Up 0.40pp, second day running of gains, and with the polling flat between 4% and 4.7% the gap to declared intention widened again, running from 2.95pp to 3.65pp, always on the price side. In the ${G('first round', 'primeiro-turno')} runner-up contract he sits at 8.30% against Lula's 8.20%, a 0.10pp difference, and being above the president there is the pattern of the series, on 75 of the 89 days. On the 88-day series his high is 17.90% and his low is 5.50%.`,

  'polymarketComparison.candidates[3].polymarket': `1.35%`,

  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `[Aug 8 reading, 17:32 UTC] At 1.35% (vol USD 5.59M cumulative). DOWN for the second day running in both books: 0.20pp in the presidential one and 2.50pp in the ${G('first round', 'primeiro-turno')} third place one, from 33.50% to 31.00%. Over two days that is 4.50pp lost in that contract, and this time Renan Santos held at 58.50%, so it was not a transfer between the two.`,

  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `[Aug 8 reading, 17:32 UTC] At 0.05% (vol USD 13.87M cumulative). No change against Aug 7. The level is low enough that moves in this band carry almost no informational value.`,

  'polymarketComparison.candidates[5].polymarket': `0.55%`,

  'polymarketComparison.candidates[5].tendenciaPesquisa':
    `NO NEW NATIONAL POLL. What still stands is the 2% at ${G('Genial/Quaest', 'quaest')}, the same as that house's own Jul 15 round, and the 2.6% at Meio/Ideia, against 2.5% in its own Jul 8 round. In the runoffs he is the rival Lula beats by the widest margin at Quaest, 46% x 34%, and he loses 48.5% x 37% at Ideia. He filed his candidacy with the ${G('TSE', 'tse')} on Aug 6, declaring R$ 178.7 million in assets, and is still the only one of the pack with a candidacy filed, in a window that runs to Aug 15.`,

  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `[Aug 8 reading, 17:32 UTC] At 0.55% (vol USD 5.01M cumulative). Up 0.10pp and back above the 0.5% cut the panel uses to separate price from noise. In the ${G('first round', 'primeiro-turno')} third place contract he fell from 3.70% to 3.40%. The series caveat still applies: his high was 10.10%, on Apr 26.`,

  'polymarketComparison.candidates[6].polymarket': `0.05%`,

  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `[Aug 8 reading, 17:32 UTC] At 0.05% (vol USD 6.78M cumulative). Down 0.10pp, reaching the floor of the band the market prices. At that level, a move carries almost no informational value.`,
})
