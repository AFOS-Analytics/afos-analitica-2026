/**
 * Mapa EN de 05/Ago para polls-data.json.
 * Ponto decimal, vírgula de milhar, datas "Aug 3". "pesquisa" vira "poll".
 */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/en/glossary#${id})`

construir('polls-data', 'en', {
  'polls[0].method': 'In person, 120 municipalities',

  'polls[0].note':
    `${G('Genial/Quaest', 'quaest')} national poll published Aug 5 (G1, CNN Brasil, Folha de S.Paulo, Valor Econômico, O Globo, Estadão, VEJA, JOTA, Money Times, Poder360, Brasil de Fato). ${G('First round', 'primeiro-turno')} Lula 39% x Flávio 30% (gap +9pp), with Caiado 4%, Renan Santos 4%, Zema 2%, Augusto Cury 1%, Cabo Daciolo 1%, Samara Martins 1%, blank and void 8%, undecided 10%. ${G('Runoff', 'segundo-turno')} Lula 44% x Flávio 39% (gap +5pp, blank and void 13%, undecided 4%); Lula 46% x Zema 34%; Lula 45% x Caiado 37%; Lula 45% x Renan Santos 35%. Lula wins all four runoff scenarios. REJECTION: 54% would not vote for Flávio and 41% would; 52% would not vote for Lula and 45% would. WITHIN-HOUSE COMPARISON, which is the only valid one: in the Jul 15 round it was 40% x 28%, a +12pp gap, and in the runoff 45% x 37%, a +8pp gap. So the first-round gap fell 3pp and the runoff gap fell 3pp, and the movement belongs to the challenger, who gains 2pp in the first round and 2pp in the runoff while Lula gives up 1pp in each. GOVERNMENT APPROVAL: 48% approve and 47% disapprove, with 5% no answer, numbers IDENTICAL to its own Jul 15 round. Administration ratings also repeat exactly: 36% positive, 26% average, 36% negative, 2% no answer. Two rounds by the same house with the same number on both indicators describe immobility, not a trend. Fieldwork Jul 31 to Aug 3, n=2,004, in person, 2pp margin, 95% confidence, commissioned by Banco Genial, ${G('TSE', 'tse')} registration BR-06591/2026.`,

  'polls[0].source':
    'Genial/Quaest via G1, CNN Brasil, Folha de S.Paulo, Valor Econômico, O Globo, Estadão, JOTA, Money Times Aug 5',

  'polls[1].note':
    `Meio/Ideia (Instituto Ideia with Canal Meio) national poll published Aug 5 (Exame, Gazeta do Povo, JOTA, Estadão, Valor Econômico, Folha de S.Paulo, CartaCapital, Congresso em Foco). ${G('First round', 'primeiro-turno')} Lula 43% x Flávio 35% (gap +8pp), with Caiado 5.7%, Renan Santos 4.7%, Zema 2.6%, Augusto Cury 1.7%, Cabo Daciolo 0.6%, Samara Martins 0.3%, Edmilson Costa 0.2%, Hertz Dias and Rui Costa Pimenta 0.1% each, blank and void 2%, don't know 4%. UNPROMPTED VOTE, which is a different question and does not mix with the prompted one: Lula 34.4%, Flávio 23%, undecided 27.7%. ${G('Runoff', 'segundo-turno')} Lula 48.5% x Flávio 43% (gap +5.5pp); Lula 48.5% x Zema 37%; Lula 48.5% x Caiado 40%; Lula 48% x Renan Santos 34.7%. Lula wins all four. WITHIN-HOUSE COMPARISON: in the Jul 8 round it was 40.4% x 32%, a +8.4pp gap, and in the runoff 45% x 40%, a +5pp gap. The first-round gap barely moved, from +8.4pp to +8pp, and neither did the runoff, from +5pp to +5.5pp. What rose were BOTH: Lula from 40.4% to 43% and Flávio from 32% to 35%, which describes vote concentrating on the top two rather than an advantage for either. Fieldwork Jul 31 to Aug 3, n=1,500, telephone, 2.5pp margin, 95% confidence, ${G('TSE', 'tse')} registration BR-04579/2026.`,

  'polls[1].source':
    'Meio/Ideia via Exame, Gazeta do Povo, JOTA, Estadão, Valor Econômico, Folha de S.Paulo Aug 5',

  'approvalData.note':
    `FRESH APPROVAL, FROM ANOTHER HOUSE, AND THE FINDING REPEATS: IMMOBILITY. ${G('Genial/Quaest', 'quaest')} on Aug 5 (n=2,004, fieldwork Jul 31 to Aug 3, in person, 2pp margin, BR-06591/2026) gives 48% government approval against 47% disapproval, with 5% no answer. On administration ratings, which is a different question and does not mix with approval, 36% positive, 26% average, 36% negative and 2% no answer. ⚠️ THE NUMBER IS IDENTICAL TO ITS OWN JUL 15 ROUND, on both indicators: it was the same 48% x 47% approval and the same 36% x 26% x 36% split on the administration. Two rounds by the same house, three weeks apart, with the same number on both indicators. That describes immobility, not a trend. THE TWO RECENT HOUSES DISAGREE ON THE SIGN AND AGREE ON THE STANDSTILL. ${G('BTG/Nexus', 'nexus-btg')} on Aug 3 gave 47% approval against 48% disapproval, the mirror image of Quaest, and in its own series approval has been at 47% for three rounds: 47% x 47% on Jul 13, 47% x 49% on Jul 27 and 47% x 48% on Aug 3. So one house measures a positive balance of 1pp and the other a negative balance of 1pp, both inside the margin, and neither records movement. The panel does not arbitrate which is right: it records that both describe an electorate split down the middle and stable. The valid comparison is always a house against itself, and both, done that way, give the same result. PoderData/Aya on Jul 30 remains the harshest reading of the set, with 43% x 49% personal approval and 34% x 47% on the administration, and it still points the other way.`,

  'approvalData.source':
    'Genial/Quaest Aug 5, 2026 (fieldwork Jul 31 to Aug 3, n=2,004, in person, 120 municipalities, 2pp margin, 95% confidence, commissioned by Banco Genial, BR-06591/2026), released by G1, CNN Brasil, Folha de S.Paulo, Valor Econômico, O Globo, Estadão, Money Times and Poder360. Within-house comparison against the Genial/Quaest round of Jul 15 (fieldwork Jul 10 to Jul 13, n=2,004, BR-07181/2026), via Poder360. The BTG/Nexus reading of Aug 3 (BR-02874/2026) is kept in the text as the second house.',

  'polymarketComparison.note':
    `⚠️ THE PRICES IN THIS SECTION ARE FROM THE AUG 3 READING, AT 19:11 UTC, AND NOT FROM TODAY. AFOS only publishes a price that two independent readings confirm, and there is no fresh market reading on Aug 4 and Aug 5. THE POLLING SIDE IS FROM TODAY, and that is where the day's fact sits. --- TWO NATIONAL POLLS CAME OUT TODAY AND BOTH TIGHTENED THE RACE, each at its own level. ${G('Genial/Quaest', 'quaest')} (n=2,004, BR-06591/2026) gives a ${G('first round', 'primeiro-turno')} of 39% x 30%, a +9pp gap, and a ${G('runoff', 'segundo-turno')} of 44% x 39%, a +5pp gap. Meio/Ideia (n=1,500, BR-04579/2026) gives 43% x 35%, a +8pp gap, and a runoff of 48.5% x 43%, a +5.5pp gap. Both were fielded in the same window, Jul 31 to Aug 3. --- THE COMPARISON THAT COUNTS IS WITHIN THE HOUSE, and it separates who moved from who did not. At Quaest, the first-round gap fell from +12pp to +9pp and the runoff gap from +8pp to +5pp, with Lula giving up 1pp and Flávio gaining 2pp in each. At Ideia, the gap held almost exactly, from +8.4pp to +8pp, and BOTH rose, Lula from 40.4% to 43% and Flávio from 32% to 35%, which describes vote concentrating on the top two rather than an advantage for either. --- AND YESTERDAY'S QUESTION IS NOW ANSWERED. ${G('BTG/Nexus', 'nexus-btg')} on Aug 3 had measured a 4pp first-round gap, the tightest of the set. With Quaest at 9pp and Ideia at 8pp, the picture for national polls since Jul 29 looks like this: ${G('AtlasIntel', 'atlasintel')} 9.1pp, PoderData 6pp, Vox Brasil 9.3pp, Nexus 4pp, Quaest 9pp and Ideia 8pp. The 4pp level still belongs to one house alone. DIRECTION, that one is confirmed: Quaest tightened 3pp within its own series. --- GOVERNMENT APPROVAL REPEATS THE EXACT NUMBER FROM THREE WEEKS EARLIER. At Quaest, 48% x 47% today and 48% x 47% on Jul 15, with the administration at 36% x 26% x 36% in both. Nexus gives the mirror image, 47% x 48%, and has been stuck at 47% for three rounds. Two houses disagree on the sign of the balance, both inside the margin, and neither records movement. --- ON THE BOARD, FLÁVIO CLOSED HIS TICKET on the last day of the convention deadline: the running mate is Alfredo Gaspar, a ${G('PL', 'pl')} congressman from Alagoas and rapporteur of the INSS joint congressional inquiry. It is a single-party ticket, after ${G('Republicanos', 'republicanos')}, PP, Podemos and União Brasil declared neutrality. Seven parties are now out of the presidential race. The panel records the fact and does not estimate an effect, because there is no confirmed price to measure it.`,

  'polymarketComparison.sources':
    `${G('Polymarket', 'polymarket')} prices via the AFOS proxy, locked capture at 19:11 UTC on Aug 3 (scripts/capture-guard.ts). There is no confirmed market reading on Aug 4 and Aug 5. Polls: Genial/Quaest BR-06591/2026 and Meio/Ideia BR-04579/2026, both from Aug 5, fieldwork Jul 31 to Aug 3, released by G1, CNN Brasil, Folha de S.Paulo, Valor Econômico, O Globo, Estadão, Exame, Gazeta do Povo and JOTA. TSE sweep on Aug 5: 537 registrations, none newly inserted.`,

  'polymarketComparison.candidates[0].pesquisaRange': '39-46%',

  'polymarketComparison.candidates[0].tendenciaPesquisa':
    `TWO FRESH NATIONAL POLLS TODAY, both with him ahead in every scenario. ${G('Genial/Quaest', 'quaest')} (n=2,004, fieldwork Jul 31 to Aug 3, in person, 2pp margin, BR-06591/2026): 39% in the ${G('first round', 'primeiro-turno')} and 44% x 39% in the ${G('runoff', 'segundo-turno')} against Flávio, also beating Zema 46% x 34%, Caiado 45% x 37% and Renan Santos 45% x 35%. Meio/Ideia (n=1,500, telephone, 2.5pp margin, BR-04579/2026): 43% in the first round and 48.5% x 43% in the runoff, winning all four scenarios. WITHIN THE HOUSE, which is the valid comparison: at Quaest he gives up 1pp in the first round, from 40% to 39%, and 1pp in the runoff, from 45% to 44%, both inside the 2pp margin; at Ideia he RISES, from 40.4% to 43%. The two houses give him movements of opposite sign in the same fieldwork window, which is information about method and not about the electorate. APPROVAL at 48% against 47% at Quaest, a number identical to its own Jul 15 round, with administration ratings repeating 36% positive, 26% average and 36% negative.`,

  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `[Aug 3 price] At 65.50% (vol USD 7.92M), from the locked capture at 19:11 UTC. There is no confirmed market reading on Aug 4 and Aug 5. What the daily series records is that his high remains 66.50%, from the Aug 1 close, and that the maximum gap is +41.80pp, from the same date. The series covers 88 days, from May 8 to today, which is why the panel speaks of the high of the available series and not the high of the cycle.`,

  'polymarketComparison.candidates[1].pesquisaRange': '30-39%',

  'polymarketComparison.candidates[1].tendenciaPesquisa':
    `TODAY'S TWO NATIONAL POLLS put him up within his own house. At ${G('Genial/Quaest', 'quaest')} he goes from 28% to 30% in the ${G('first round', 'primeiro-turno')} and from 37% to 39% in the ${G('runoff', 'segundo-turno')}, a 2pp gain in each, which sits at the edge of the 2pp margin and therefore cannot be separated from noise with confidence. At Meio/Ideia he goes from 32% to 35% in the first round and from 40% to 43% in the runoff, a 3pp gain, above the 2.5pp margin. The gap against Lula lands at 9pp at Quaest and 8pp at Ideia, against the 4pp that ${G('BTG/Nexus', 'nexus-btg')} measured on Aug 3: the 4pp level still belongs to one house alone, and what today's two rounds confirm is DIRECTION, not level. REJECTION in the Quaest round: 54% say they would not vote for him and 41% would. Lula has 52% rejection and 45% voting intention. Among the TOP TWO CANDIDATES in this round, the only ones whose rejection figures were released, his is the higher. The round did not publish rejection for the other names, so the panel does not extend the comparison to the rest of the field.`,

  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `[Aug 3 price] At 25.45% (vol USD 7.86M), from the locked capture at 19:11 UTC. No confirmed reading on Aug 4 and Aug 5. The series caveat still stands and matters more than any daily move: over the available 88-day series his high is 44.30%, from May 8, and his low is 22.00%, from Jul 3. On the second-place contract he was at 80.50% in the Aug 3 reading.`,

  'polymarketComparison.candidates[2].pesquisaRange': '4-4.7%',

  'polymarketComparison.candidates[2].tendenciaPesquisa':
    `Today's two national polls measure him in the same narrow band: 4% at ${G('Genial/Quaest', 'quaest')}, against 3% in its own Jul 15 round, and 4.7% at Meio/Ideia, against 2% in its own Jul 8 round. In the runoffs he is the worst placed of both rounds: he loses to Lula 45% x 35% at Quaest and 48% x 34.7% at Ideia. With that, six consecutive national polls measure him between 3% and 4.7%, after the 7.8% from ${G('AtlasIntel', 'atlasintel')} on Jul 29, and the isolated high reading remains the exception of the set. He declared on Wednesday that, if elected, he will not comply with single-justice ${G('STF', 'stf')} rulings and that he will deal with the Centrão.`,

  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `[Aug 3 price] At 7.45% (vol USD 8.86M), from the locked capture at 19:11 UTC, with no confirmed reading on Aug 4 and Aug 5. The distance between the 7.45% price and the polling, which today sits between 4% and 4.7%, lands between 2.75pp and 3.45pp, and it is on the price side. His accumulated volume remains above Lula's, USD 8.86M against USD 7.92M, at a price that is one eighth: volume measures traded history, not current conviction.`,

  'polymarketComparison.candidates[3].pesquisaRange': '4-5.7%',

  'polymarketComparison.candidates[3].tendenciaPesquisa':
    `${G('Genial/Quaest', 'quaest')} gives 4% in the ${G('first round', 'primeiro-turno')}, the same as its own Jul 15 round, and Meio/Ideia gives 5.7%, against 4% in its own Jul 8 round. In the runoffs he loses to Lula 45% x 37% at Quaest and 48.5% x 40% at Ideia. The disagreement between houses about him remains open inside the same fieldwork window: 4% at one house and 5.7% at the other, with both fielding from Jul 31 to Aug 3. He mocked Lula and Flávio on Wednesday, saying both are more worried about saving the family than the country.`,

  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `[Aug 3 price] At 1.15% (vol USD 5.30M), from the locked capture at 19:11 UTC, with no confirmed reading on Aug 4 and Aug 5. He remains the second name on the first-round third-place contract, which stood at 25.00% in the Aug 3 reading.`,

  'polymarketComparison.candidates[4].tendenciaPesquisa':
    `Neither ${G('Genial/Quaest', 'quaest')} nor Meio/Ideia tests him in any presidential scenario, first round or runoff. Absence of testing in two national polls on the same day is information the panel records, instead of repeating old data as if it were new. He is running for RE-ELECTION as governor of São Paulo, made official by ${G('Republicanos', 'republicanos')} on Aug 1.`,

  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `[Aug 3 price] At 0.05% (vol USD 13.70M), from the locked capture at 19:11 UTC, with no confirmed reading on Aug 4 and Aug 5. He remains the legacy anomaly of the presidential book: the largest accumulated volume of all and the lowest price among the names cited. It works as a permanent method reminder, because volume measures traded history and not current conviction. The panel records the level and does NOT compare it with his own history: the AFOS series has few points for this name and does not support a claim of an extreme.`,

  'polymarketComparison.candidates[5].pesquisaRange': '2-2.6%',

  'polymarketComparison.candidates[5].tendenciaPesquisa':
    `${G('Genial/Quaest', 'quaest')} gives 2% in the ${G('first round', 'primeiro-turno')}, the same as its own Jul 15 round, and Meio/Ideia gives 2.6%, against 2.5% in its own Jul 8 round. In the runoffs he is the opponent Lula beats by the widest margin at Quaest, 46% x 34%, and he loses 48.5% x 37% at Ideia. In the polling he is flat at both houses. He closed his ticket on Aug 4 with senator Eduardo Girão, of ${G('Novo', 'novo')}, and was the first of the third-way names to settle the running mate.`,

  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `[Aug 3 price] At 0.25% (vol USD 4.66M), from the locked capture at 19:11 UTC, with no confirmed reading on Aug 4 and Aug 5. On the first-round third-place book he stood at 4.60% in that reading. The series caveat is a large one: his maximum is 10.10%, from Apr 26, so 0.25% is a small fraction of that level and moves in this range carry almost no informational value.`,

  'polymarketComparison.candidates[6].tendenciaPesquisa':
    `Neither ${G('Genial/Quaest', 'quaest')} nor Meio/Ideia tests him in any scenario, first round or runoff, so he still has no polling. The caveat stands and needs to be said plainly: he is NOT a presidential candidate, he is running for governor of São Paulo, and any scenario including him is a poll hypothesis, not a candidacy under way.`,

  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `[Aug 3 price] At 0.15% (vol USD 6.64M), from the locked capture at 19:11 UTC, with no confirmed reading on Aug 4 and Aug 5. He is not a candidate, so the contract prices a replacement scenario on the ${G('PT', 'pt')} ticket and not a race under way.`,
})
