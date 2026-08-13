/**
 * Mapa EN de 13/Ago para polls-data.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 13".
 */
import { construir } from '../build-locale-json'

const S = 'last confirmed reading, from Aug 12, 16:41 BRT'
const P = (v: string) => `[no new market reading on Aug 13; value from the ${S}]`

construir('polls-data', 'en', {
  'polls[0].note':
    `PoderData/Aya national poll published Aug 13 (Poder360, CNN Brasil, Exame, R7, Jovem Pan, Brasil 247, Gazeta do Povo). First round Lula 41% x Flávio 35%, a distance of 6pp. Runoff Lula 46% x Flávio 45%, 1pp, a statistical tie given the 2pp margin. Fieldwork Aug 9 to Aug 12, n=2,400, telephone, margin 2pp, 95% confidence, registration BR-06868/2026. ⭐ THE COMPARISON THAT COUNTS IS WITH THE HOUSE ITSELF, AND IT SEPARATES THE TWO ROUNDS: in the first round the gap did NOT move in four weeks, it was 6pp on Jul 16 (40% x 34%), 6pp on Jul 30 (41% x 35%) and it is 6pp now, with the top two repeating exactly the same values as the previous round; in the runoff the gap fell from 3pp to 1pp over the same span. Same house, same method and same sample, with the first round frozen and the runoff narrowing. REJECTION tied at 48% each (Poder360). CNN Brasil and Bnews record that Lula also ties with Zema and with Caiado in the runoff and beats Renan Santos; the percentages of those match-ups were not published in the articles captured and therefore do not appear here.`,
  'polls[0].source':
    `PoderData/Aya published on Aug 13 by Poder360, CNN Brasil, Exame, R7, Jovem Pan, Brasil 247, Gazeta do Povo, Rádio Itatiaia and Portal Salvador FM. TSE registration BR-06868/2026.`,

  'approvalData.note':
    `NEW NATIONAL POLL ON Aug 13, the first since Aug 11. PoderData/Aya: 43% approve and 50% disapprove of Lula's work, a balance of 7pp negative, against 47.3% x 49.9% from Futura Inteligência of Aug 11, which was the pair in force until yesterday. ⚠️ THESE ARE TWO DIFFERENT QUESTIONS ON THE SAME DAY, and the panel does not add them: Revista Oeste reported 51% disapproval OF THE GOVERNMENT in the same survey, a figure that is not the same as the 50% disapproval of LULA'S WORK published by Poder360, CNN Brasil and Rádio Itatiaia. REJECTION tied at 48% for Lula and 48% for Flávio Bolsonaro. Also in the frame are Gerp of Aug 11 with 53% disapproval, BTG/Nexus of Aug 10 with 46% x 49%, Palver of the same day with 45% x 55% and Genial/Quaest of Aug 5 with 48% x 47%. WHAT THE SET SHOWS: across eight readings in nine days disapproval runs from 47% to 55%, a distance of 8pp between houses, and the balance runs from 1pp positive to 10pp negative. No house changed sides, and the new one falls inside the range that already existed. ⚠️ PROVENANCE DECLARED: approval and disapproval are from PoderData/Aya of Aug 13 (fieldwork Aug 9 to Aug 12, n=2,400, telephone, margin 2pp, registration BR-06868/2026), as the most recent national reading; the remaining 7% is the arithmetic residual between the two published values, and not a figure the house released under that label. The administration rating, at 36% positive, 26% fair and 36% negative, is still Genial/Quaest's of Aug 5, because no later house has published that full breakdown. The panel prefers to declare the mixture than to hide it.`,
  'approvalData.source':
    `Approval and disapproval: PoderData/Aya Aug 13, 2026 (fieldwork Aug 9 to Aug 12, n=2,400, telephone, margin 2.0pp, TSE registration BR-06868/2026), published by Poder360, CNN Brasil, Exame, Rádio Itatiaia and Portal Salvador FM. Administration rating (excellent/good, fair, poor/terrible): Genial/Quaest Aug 5, 2026. Government disapproval at 51% in the same survey, per Revista Oeste, is a distinct question and is declared in the note.`,

  'polymarketComparison.note':
    `UPDATE OF Aug 13. THE POLLING MOVED AND THE PRICE HAS NO NEW READING. PoderData/Aya published the first national poll since Aug 11, and the finding is in the house compared with itself: in the first round the distance between the top two has not moved in four weeks, it was 6pp on Jul 16, 6pp on Jul 30 and 6pp now, with both repeating exactly the same percentages; in the runoff, over the same span, the distance fell from 3pp to 1pp. One round frozen and the other narrowing, at the same house, with the same method and the same sample. Rejection came out tied at 48% for the two. And the chasing pack had its best day of the window in the runoff, with Caiado and Zema tying with the leader and only Renan Santos losing, according to CNN Brasil and Bnews. ⚠️ PROVENANCE OF THE PRICES: there is no new market reading on Aug 13, and the values in this section are from the ${S}. AFOS only publishes a price that two independent readings confirm. The series caveats in this round were measured over all recorded points, and not over the last point of each day, because keeping only the last point discards the intraday extreme and shifts the peak and the floor.`,

  'polymarketComparison.sources':
    `Polymarket prices via the AFOS proxy, and the panel only publishes a price that two independent readings, taken eight minutes apart, confirm. There is no new confirmed reading on Aug 13, so the values shown are from the ${S}. ✅ NEW NATIONAL POLL ON Aug 13: PoderData/Aya, n=2,400, registration BR-06868/2026, fieldwork Aug 9 to Aug 12. Still in force are CNT/MDA BR-06935/2026, Gerp BR-08045/2026 and Futura Inteligência BR-08109/2026, all of Aug 11, plus Palver BR-06596/2026 and BTG/Nexus BR-08428/2026, of Aug 10, and Genial/Quaest BR-06591/2026 and Meio/Ideia BR-04579/2026, of Aug 5. Next national polls in the queue: Quaest (n=2,004, BR-06773/2026) on Aug 14 and Nexus (n=2,000, BR-03317/2026) on Aug 17.`,

  'polymarketComparison.candidates[0].tendenciaPesquisa':
    `NEW NATIONAL POLL ON Aug 13, the first since Aug 11. PoderData/Aya (n=2,400, telephone, fieldwork Aug 9 to Aug 12, BR-06868/2026): 41% in the first round and 46% x 45% in the runoff against Flávio Bolsonaro. ⭐ THE FINDING IS IN THE HOUSE COMPARED WITH ITSELF, AND IT SEPARATES THE TWO ROUNDS: in the first round the distance did not move in four weeks, it was 6pp on Jul 16 (40% x 34%), 6pp on Jul 30 (41% x 35%) and it is 6pp now, with the top two repeating exactly the values of the previous round; in the runoff the distance fell from 3pp to 1pp over the same span. Same house, same method, same sample. CNN Brasil and Bnews record that he also ties with Zema and with Caiado in the runoff and beats Renan Santos. REJECTION at 48%, tied with his opponent's. PERSONAL APPROVAL at 43% against 50% disapproval, and Revista Oeste reports 51% disapproval OF THE GOVERNMENT in the same survey, which is a distinct question. Across the eight national polls since Aug 5 he runs from 38% to 44% in the first round, and in the runoff the result runs from 9pp in favour to 2pp against.`,
  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `${P('')} At 63.50% (vol USD 8.22M cumulative). SERIES CAVEAT, measured over all recorded points and not over the last of each day: among the 173 points since May 16, 29 had a value equal to or above 63.50%, with a peak of 66.50% on Aug 1 at 23:00 and a floor of 39.50% on May 26. The day's movement came from the polling, not from the price.`,

  'polymarketComparison.candidates[1].pesquisaRange': `28.7-38%`,
  'polymarketComparison.candidates[1].polymarket': `27.65%`,
  'polymarketComparison.candidates[1].tendenciaPesquisa':
    `NEW NATIONAL POLL ON Aug 13. PoderData/Aya gives him 35% in the first round and 45% in the runoff, 1pp from Lula, inside the 2pp margin. ⭐ AGAINST THE HOUSE ITSELF HE DID NOT MOVE IN THE FIRST ROUND, repeating the 35% of Jul 30, but he SHORTENED THE RUNOFF from 43% to 45%. Exame summarised it as growth for him in the runoff. REJECTION at 48%, exactly equal to the leader's, which is the figure that prevents an easy reading about who has the higher ceiling. Across the eight national polls since Aug 5 he runs from 28.7% to 38% in the first round, and the spread between houses remains more than 9pp on the same question.`,
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `${P('')} At 27.65% (vol USD 8.13M cumulative). SERIES CAVEAT, measured over all recorded points: among the 172 points since May 16, 51 had a value equal to or above it, with a peak of 33.20% on Jun 2 at 19:30 and a floor of 22.00% on Jul 3 at 01:00.`,

  'polymarketComparison.candidates[2].polymarket': `7.45%`,
  'polymarketComparison.candidates[2].tendenciaPesquisa':
    `PoderData of Aug 13 tested him in the runoff and, according to Bnews, he is the only one of the chasing pack Lula BEATS in that scenario, while tying with the other three. His first-round percentages in this round did not appear in the articles captured, so the 5% from Gerp of Aug 11, the 4% from Genial/Quaest and BTG/Nexus, the 4.7% from Meio/Ideia and the 10% from Palver online still stand. The method effect remains the reading on him: the same name runs from 4% to 10% depending on the interview environment, a caveat declared by Palver itself.`,
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `${P('')} At 7.45% (vol USD 9.48M cumulative). He keeps the largest cumulative volume in the book among names above 1%. The price remains BETWEEN the two polling methods, above the 4% to 5% of telephone and in-person and below the 10% of online.`,

  'polymarketComparison.candidates[3].polymarket': `0.95%`,
  'polymarketComparison.candidates[3].tendenciaPesquisa':
    `PoderData of Aug 13 puts him in a TIE with Lula in the runoff, according to CNN Brasil and Bnews, which places him alongside Flávio Bolsonaro and Zema in that scenario. His first-round percentages in this round did not appear in the articles captured, and the 4% from Gerp and Genial/Quaest, the 5.7% from Meio/Ideia and the 5% from BTG/Nexus still stand. The runoff tie is the second in four days, after BTG/Nexus of Aug 10, and it is the best result any name outside the top two has been getting in the window.`,
  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `${P('')} At 0.95% (vol USD 5.66M cumulative). ⚠️ HIS CONTRAST GREW TODAY, AND IT WAS THE POLLING THAT WIDENED IT: he ties with the leader in the runoff for the second time in four days, and the winning price in force is below 1%. Tying in a runoff and winning the election are different questions, and the panel does not add them together.`,

  // 🔴 CORREÇÃO: o arquivo EN de 12/Ago trazia 0.15% aqui, que é o valor do
  // Haddad. O gate numérico pegou a divergência contra o pt-BR (0,05%).
  'polymarketComparison.candidates[4].polymarket': `0.05%`,

  'polymarketComparison.candidates[4].tendenciaPesquisa':
    `PoderData of Aug 13 does not test him in a presidential scenario, and the same held for the three of Aug 11 and those of Aug 10 and Aug 5. The absence of a test is information the panel records, instead of repeating old data as if it were new. He is running for RE-ELECTION as governor of São Paulo, made official by Republicanos on Aug 1. ON THE BOARD TODAY he went to the Supreme Court against Lula after the Banco do Brasil loan to São Paulo was mentioned in a debate, and Valor Econômico reported that the Finance Ministry released the operation shortly afterwards.`,
  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `${P('')} At 0.05% (vol USD 13.91M cumulative). It remains the largest cumulative volume in the whole presidential book, with the price at the floor. High volume with probability at the floor is conviction already priced in, not movement, and moves in this range have almost no informational value.`,

  'polymarketComparison.candidates[5].tendenciaPesquisa':
    `PoderData of Aug 13 puts him in a TIE with Lula in the runoff, according to CNN Brasil and Bnews, and it is the first time in the window he appears in that condition. His first-round percentages in this round did not appear in the articles captured, and the 2% from Gerp of Aug 11, the 3% from BTG/Nexus of Aug 10, the 2% from Genial/Quaest and the 2.6% from Meio/Ideia still stand. ⚠️ The distance between a runoff tie and 2% to 3% in the first round is large, and the two measure different questions: reaching the runoff and winning it.`,
  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `${P('')} At 0.35% (vol USD 5.07M cumulative), below the 0.5% cut the panel uses to separate price from noise. ⚠️ THE CONTRAST OF THE DAY IS HIS: he ties with the leader in the runoff and is priced at 0.35% to win the election.`,

  'polymarketComparison.candidates[6].polymarket': `0.15%`,
  'polymarketComparison.candidates[6].tendenciaPesquisa':
    `PoderData of Aug 13 does not test him in a presidential scenario. The caveat remains and must be stated plainly: he is NOT a candidate for the presidency, he is running for the governorship of São Paulo, and any scenario including him is a polling hypothesis, not a candidacy under way.`,
  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `${P('')} At 0.15% (vol USD 7.06M cumulative). A move in this range has no informational value, and the underlying caveat remains: he is NOT a candidate for the presidency and is running for the governorship of São Paulo.`,
})
