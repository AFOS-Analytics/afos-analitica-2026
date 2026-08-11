/**
 * Mapa EN de 11/Ago para polls-data.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 11".
 */
import { construir } from '../build-locale-json'

const S = 'confirmed reading of Aug 11, 16:27 BRT'

construir('polls-data', 'en', {
  'polls[0].note':
    `CNT/MDA national poll published Aug 11, commissioned by the National Transport Confederation. First round Lula 42.4% x Flávio 28.7%, a distance of 13.7pp. Runoff Lula 48% x Flávio 39%, 9pp. Field Aug 5 to 8, n=2,002, margin 2.2pp, 95% confidence, registration BR-06935/2026. ⚠️ IT IS THE MOST FAVOURABLE READING FOR THE LEADER AMONG THE SEVEN NATIONAL POLLS SINCE AUG 5, and on the same day Gerp published the least favourable one, with the challenger ahead in the runoff. The runner-up's 28.7% falls BELOW the floor the window held until yesterday, which was 30% at Genial/Quaest. GOVERNMENT RATING: 35% rate it excellent or good and 36% poor or terrible, practically tied.`,
  'polls[0].source':
    `CNT/MDA released on Aug 11 by Estadão, UOL, Poder360, CartaCapital, VEJA, Gazeta do Povo, InfoMoney, O Povo and Revista Fórum. TSE registration BR-06935/2026.`,

  'polls[1].note':
    `Gerp national poll published Aug 11. First round TIED at 38% x 38%, with Renan Santos 5%, Caiado 4%, Zema 2%, Cabo Daciolo and Augusto Cury 1% each, 7% undecided and 4% for none. Runoff Flávio 45% x Lula 43%. Field Aug 6 to 10, n=2,400, telephone, margin 2pp, 95% confidence, registration BR-08045/2026. ⚠️ IT IS THE FIRST NATIONAL POLL OF THE WINDOW TO PUT THE RUNNER-UP AHEAD IN THE RUNOFF, and the release itself treats the 2pp difference as a statistical tie within the margin. ON THE SAME DAY CNT/MDA published the leader 9pp ahead in the same scenario, which puts the two readings 11 points apart. GOVERNMENT DISAPPROVAL at 53%. 📌 The registration set publication for Aug 10 and it came out on Aug 11, which is a release delay, not fresh data.`,
  'polls[1].source':
    `Gerp released on Aug 11 by Exame, Jovem Pan, Poder360, CNN Brasil and Gazeta do Povo. TSE registration BR-08045/2026.`,

  'polls[2].note':
    `Futura Inteligência national poll published Aug 11. First round Lula 38.8% x Flávio 34.1%, a distance of 4.7pp. Runoff Lula 46.5% x Flávio 44%, 2.5pp, which the release treats as a statistical tie. Field Aug 3 to 7, n=2,000, telephone, margin 2.2pp, 95% confidence. REJECTION with Flávio at 47.1% and Lula at 45.9%, a statistical tie here too. GOVERNMENT APPROVAL at 47.3% against 49.9% disapproval. ⚠️ THE TSE REGISTRATION WAS NOT CLOSED WITH CERTAINTY: the window lists 100 Cidades with the same sample of n=2,000 and the same date, and the two brands publish together as 100% Cidades/Futura, but the match was not confirmed in a primary source. The panel declares the doubt instead of asserting the protocol. IT SITS IN THE MIDDLE OF TODAY'S THREE, between the leader's 9pp advantage at CNT/MDA and the challenger's 2pp at Gerp.`,
  'polls[2].source':
    `Futura Inteligência released on Aug 11 by CNN Brasil, Exame, Gazeta do Povo, Jornal de Brasília, Brasil 247 and Jornal Opção. TSE registration not confirmed, see note.`,

  'approvalData.note':
    `THREE NATIONAL POLLS ON AUG 11, and the dispersion of the rating tracks that of voting intention. Futura Inteligência: 47.3% approve and 49.9% disapprove, a balance of 2.6pp negative. Gerp: 53% disapproval. CNT/MDA does not publish the approve and disapprove pair, but rather the rating of the administration, with 35% excellent or good against 36% poor or terrible. Also in the frame are BTG/Nexus of Aug 10, with 46% x 49%, Palver of the same day, with 45% x 55%, and Genial/Quaest of Aug 5, with 48% x 47%. WHAT THE SET SHOWS: across seven readings in seven days, disapproval runs from 47% to 55%, a distance of 8pp between houses, and the balance runs from 1pp positive to 10pp negative. ⚠️ DECLARED PROVENANCE: approval and disapproval come from Futura Inteligência of Aug 11, chosen because it is the only one of today's three that publishes the closed pair; the rating of the administration, with 36% positive, 26% fair and 36% negative, remains the one from Genial/Quaest of Aug 5, because no house today published that full breakdown. The panel prefers to declare the mix rather than hide it.`,
  'approvalData.source':
    `Approval and disapproval: Futura Inteligência Aug 11, 2026 (field Aug 3 to 7, n=2,000, telephone, margin 2.2pp), released by CNN Brasil, Exame, Gazeta do Povo and Jornal de Brasília. Other readings in the window: Gerp Aug 11 (n=2,400), CNT/MDA Aug 11 (n=2,002, administration rating), BTG/Nexus Aug 10 (BR-08428/2026) and Palver Aug 10 (BR-06596/2026). Administration rating: Genial/Quaest Aug 5, 2026 (field Jul 31 to Aug 3, n=2,004, in person, BR-06591/2026).`,

  'polymarketComparison.note':
    `THE PRICES IN THIS SECTION ARE FROM THE CONFIRMED READING OF AUG 11, 16:27 BRT, confirmed by two independent readings taken eight minutes apart. THE DAY HAD THREE NATIONAL POLLS AND THEY DISAGREE WITH ONE ANOTHER MORE THAN ON ANY OTHER DAY IN THE WINDOW. In the runoff, CNT/MDA gives 48% x 39% for the leader, Futura gives 46.5% x 44%, and Gerp gives 45% x 43% FOR THE RUNNER-UP. That is eleven points of distance between the most favourable and the least favourable reading, on the same question, on the same day, and it is the first time in the window that a national poll puts the challenger ahead in the runoff. In the first round the distance is 9.3pp, between CNT/MDA's 28.7% and Gerp's 38%. ⭐ THE CENTRAL CROSSING IS ONE OF REGIME, NOT OF LEVEL: while the polling opened that distance, the market barely moved. The leader was flat for the third session, the runner-up gave back 0.30pp, and the largest move in the whole book was 0.75pp, on the third-placed name. The two instruments measured the same week, and one of them is far more uncertain than the other. The panel records the difference in regime without saying which instrument is right, because it does not know, and because saying so would trade measurement for opinion.`,
  'polymarketComparison.sources':
    `Polymarket prices via the AFOS proxy, capture confirmed by two independent readings taken eight minutes apart, the most recent at 16:27 BRT on Aug 11 (scripts/capture-guard.ts). Polls of Aug 11: CNT/MDA BR-06935/2026 (n=2,002, in person, field Aug 5 to 8), Gerp BR-08045/2026 (n=2,400, telephone, field Aug 6 to 10) and Futura Inteligência (n=2,000, telephone, field Aug 3 to 7, registration not confirmed in a primary source). Still in force are Palver BR-06596/2026 and BTG/Nexus BR-08428/2026, of Aug 10, and Genial/Quaest BR-06591/2026 and Meio/Ideia BR-04579/2026, of Aug 5. Next national poll in the release queue: PoderData (n=2,400, BR-06868/2026) on Aug 13.`,

  'polymarketComparison.candidates[0].pesquisaRange': `38-44%`,
  'polymarketComparison.candidates[0].tendenciaPesquisa':
    `THREE NATIONAL POLLS ON AUG 11, AND THEY DISAGREE WITH ONE ANOTHER MORE THAN ON ANY DAY IN THE WINDOW. CNT/MDA (n=2,002, in person, field Aug 5 to 8, BR-06935/2026): 42.4% in the first round and 48% x 39% in the runoff, 9pp of advantage. Futura Inteligência (n=2,000, telephone, field Aug 3 to 7): 38.8% and 46.5% x 44%, 2.5pp. Gerp (n=2,400, telephone, field Aug 6 to 10, BR-08045/2026): TIED at 38% x 38% in the first round and DEFEATED 45% x 43% in the runoff. Adding up the seven national polls since Aug 5 he runs from 38% to 44%, and in the runoff the result runs from 9pp in favour to 2pp against, that is, ELEVEN POINTS of distance between houses on the same question. APPROVAL at 47.3% against 49.9% at Futura and 53% disapproval at Gerp, and CNT/MDA brings the administration at 35% excellent or good against 36% poor or terrible. ⚠️ The percentage used in the graph is Gerp's, chosen because it is the ONLY one of today's three that publishes the full field, with every name; MDA and Futura released only the top two.`,
  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `[${S}] At 63.50% (vol USD 8.21M cumulative), FLAT for the third session running. The gap over Flávio returned to +36.55pp, exactly the Aug 9 value, undoing yesterday's narrowing, and again through the challenger's end, who gave back the 0.30pp he had gained. ⚠️ THE CONTRAST WITH THE POLLING IS THE DATA POINT OF THE ROUND: while three institutes published readings eleven points apart in the runoff, his price did not move, and the largest move in the whole book was 0.75pp. In the 89-day series the peak is 66.50%, from Aug 1, and 15 of the 89 days had a value equal to or above the current one, so the level is not extreme.`,

  'polymarketComparison.candidates[1].pesquisaRange': `28.7-40%`,
  'polymarketComparison.candidates[1].polymarket': `26.95%`,
  'polymarketComparison.candidates[1].tendenciaPesquisa':
    `HIS SPREAD GREW AND IS NOW 11.3pp. Across the seven national polls since Aug 5 he appears with 28.7% at today's CNT/MDA, 30% at Genial/Quaest, 34.1% at today's Futura, 35% at Meio/Ideia, 35% at BTG/Nexus, 38% at today's Gerp and 40% at Palver. The 28.7% falls BELOW the floor the window held until yesterday. IN THE RUNOFF THE DAY WAS EVEN MORE EXTREME: Gerp puts him AHEAD, with 45% against 43%, and it is the first national poll of the window to do so, while CNT/MDA puts him 9pp behind on the same day. Futura sits in the middle, with 44% against 46.5%. REJECTION at 47.1% at Futura, a statistical tie with the leader's 45.9%. ⚠️ The graph percentage is Gerp's, the same reference house as for the front-runner.`,
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `[${S}] At 26.95% (vol USD 8.12M cumulative). FELL 0.30pp and gave back exactly what he had gained yesterday, taking the gap back to +36.55pp. ⚠️ THE DAY SHOWS THE TWO INSTRUMENTS IN DIFFERENT REGIMES: in the polling he varies 11.3pp between houses and even leads a runoff; in the price he moved 0.30pp. It is not extreme: 30 of the 89 days in the series had a value equal to or above it, with a peak of 34.40% on May 13 and a floor of 22.00% on Jul 3. In the runner-up contract he fell 1.50pp, to 80.50%.`,

  'polymarketComparison.candidates[2].polymarket': `8.40%`,
  'polymarketComparison.candidates[2].tendenciaPesquisa':
    `GERP PUTS HIM AT 5% in the first round, the second highest value he has posted in the window, behind only Palver's 10% online. Still in force are Genial/Quaest's 4% in person, Meio/Ideia's 4.7% by telephone and BTG/Nexus's 4% by telephone. CNT/MDA and Futura did not publish the full field. THE METHOD EFFECT REMAINS THE READING: the same name runs from 4% to 10% depending on the interview setting, and the caveat was declared by Palver itself, which stated that it is testing approaches to reduce the effect in online polls.`,
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `[${S}] At 8.40% (vol USD 9.43M cumulative). ROSE 0.75pp and was THE LARGEST MOVE IN THE WHOLE PRESIDENTIAL BOOK in today's reading. ⭐ And he came off the floor: yesterday 84 of the 88 days in the series had a value equal to or above his, and today 72 of 89 do. The price still sits BETWEEN the two polling methods, above the 4% to 5% of telephone and in person and below the 10% of the internet. ⚠️ The panel does NOT attribute the rise to the public discussion about method that the press ran on Aug 10 and 11, because it measured nothing linking the two, and it records the sequence without asserting cause. Largest cumulative volume in the book among the names above 1%.`,

  'polymarketComparison.candidates[3].polymarket': `1.05%`,
  'polymarketComparison.candidates[3].tendenciaPesquisa':
    `Today's Gerp gives him 4% in the first round, the same value as Genial/Quaest of Aug 5, and Meio/Ideia still has 5.7%. CNT/MDA and Futura did not publish the full field, and Palver did not test him, so the basis for comparison on him shrank in this window. Still in force is Lula's tie with him in the BTG/Nexus runoff of Aug 10, which is the best result any name outside the top two has posted in the period.`,
  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `[${S}] At 1.05% (vol USD 5.63M cumulative). FELL 0.10pp for the third session running, and the distance between polling and price remains the largest in the chasing pack: from 4% to 5.7% of declared intention against 1.05% of priced probability. The panel records the distance without subtracting one quantity from the other, because the polling measures intention now and the contract measures the probability of winning at the end.`,

  'polymarketComparison.candidates[4].tendenciaPesquisa':
    `None of the three rounds of Aug 11 tests him in a presidential scenario, and the same held for those of Aug 10 and Aug 5. Absence of testing is information the panel records, rather than repeating old data as if it were fresh. He is running for RE-ELECTION as governor of São Paulo, made official by Republicanos on Aug 1, and the coverage of Aug 11 brings a state poll testing the São Paulo scenario after the first debate.`,
  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `[${S}] At 0.05% (vol USD 13.90M cumulative). ⚠️ It remains the LARGEST cumulative volume in the whole presidential book, with the price at the floor. High volume with probability at the floor is conviction already priced in, not movement, and variations in this band have almost no informational value.`,

  'polymarketComparison.candidates[5].polymarket': `0.35%`,
  'polymarketComparison.candidates[5].tendenciaPesquisa':
    `Today's Gerp gives him 2% in the first round, and BTG/Nexus of Aug 10 had given 3%. Still in force are Genial/Quaest's 2% and Meio/Ideia's 2.6%, of Aug 5. He filed his candidacy with the TSE on Aug 6, declaring R$ 178.7 million in assets, and the filing window for the others closes on Aug 15.`,
  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `[${S}] At 0.35% (vol USD 5.05M cumulative). FELL 0.10pp and sank further below the 0.5% cut the panel uses to separate price from noise, a band in which the reading on him remains suspended. Series caveat that still holds: his maximum was 10.10%, on Apr 26.`,

  'polymarketComparison.candidates[6].tendenciaPesquisa':
    `None of the three rounds of Aug 11 tests him in a presidential scenario. The aggravating factor remains and needs to be said plainly: he is NOT a presidential candidate, he is running for governor of São Paulo, and any scenario that includes him is a polling hypothesis, not a candidacy under way. The coverage of Aug 11 brings him in a São Paulo state poll, after the first debate on Band.`,
  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `[${S}] At 0.05% (vol USD 7.01M cumulative), back at the floor after a single day above it. Variation in this band has no informational value.`,
})
