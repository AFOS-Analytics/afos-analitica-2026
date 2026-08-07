/**
 * Mapa EN de 07/Ago para analysis-criteriosa.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 7".
 * "pesquisa" vira "poll", nunca "research". "urna" vira "polling".
 */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/en/glossary#${id})`

construir('analysis-criteriosa', 'en', {
  subtitle:
    `UPDATE Aug 7, 19:44 UTC, with 58 days to the ${G('first round', 'primeiro-turno')}. THE PRICE IS FROM TODAY: Lula 64.50%, Flávio 26.95%, a gap of +37.55pp. The gap narrowed for the SIXTH day running, since the high of +41.80pp on Aug 1, and the two ends did that on their own, because there is no new national poll: the latest remain ${G('Genial/Quaest', 'quaest')} and Meio/Ideia, both from Aug 5. The board entered the REGISTRATION phase, which runs to Aug 15, and Zema was the first presidential candidate to file, declaring R$ 178.7 million in assets. Five national polls are registered with the ${G('TSE', 'tse')} for Aug 10 and Aug 11.`,

  'candidates[0].header':
    `PRICE FLAT AND POLLING FLAT: ${G('Polymarket', 'polymarket')} 64.50% (vol USD 8.11M cumulative), from the Aug 7 reading at 19:44 UTC, the same value as Aug 4, Aug 5 and Aug 6. In the polling what still stands is 39% in the ${G('first round', 'primeiro-turno')} at Genial/Quaest and 43% at Meio/Ideia, with runoffs of 44% x 39% and 48.5% x 43%. APPROVAL at 48% against 47% at Quaest.`,

  'candidates[0].fortes[0]':
    `His is the only price at the top of the book that has not moved in four straight days, staying at 64.50% from Aug 4 to Aug 7, while the runner-up's rose over the same stretch.`,
  'candidates[0].fortes[1]':
    `He leads BOTH ${G('first round', 'primeiro-turno')} scenarios in force and wins the EIGHT runoff scenarios of the two Aug 5 rounds, without exception: 44% x 39%, 46% x 34%, 45% x 37% and 45% x 35% at Quaest, and 48.5% x 43%, 48.5% x 37%, 48.5% x 40% and 48% x 34.7% at Ideia.`,
  'candidates[0].fortes[2]':
    `The Quaest crosstabs released on Aug 6 and Aug 7 show him ahead among the elderly, among Catholics and among those with no religion, and with more than 16 points of advantage among women (Folha de S.Paulo, Estadão and Revista Fórum, Aug 7).`,
  'candidates[0].fortes[3]':
    `The same round measured that Trump's declared backing of his rival does NOT expand voting intention for him, and recorded a majority wanting independence from the United States (Quaest, released Aug 7).`,
  'candidates[0].fortes[4]':
    `His rejection is LOWER than the runner-up's in the Quaest round: 52% against 54%, with 45% declaring a vote against 41% for Flávio.`,

  'candidates[0].fracos[0]':
    `The investigations into Fábio Luís Lula da Silva became the axis of the day against him: Estadão published on Aug 7 the reconstruction of the day the ${G('PF', 'pf')} grew suspicious of the president's son's business dealings, and the PF will summon a former chief of staff of his to testify about payments from a lobbyist.`,
  'candidates[0].fracos[1]':
    `The rival campaign is weighing taking the case into the opening of the free broadcast slot, which turns an investigation into a piece of propaganda before any judicial outcome.`,
  'candidates[0].fracos[2]':
    `The market gap over the runner-up narrowed for the SIXTH day running, from +41.80pp on Aug 1 to +37.55pp today, and the narrowing came entirely from the other side rising, because his own price did not move.`,
  'candidates[0].fracos[3]':
    `At ${G('Genial/Quaest', 'quaest')} he GAVE UP ground inside the house itself, from 40% to 39% in the ${G('first round', 'primeiro-turno')} and from 45% to 44% in the runoff, and the runoff gap fell from 8pp to 5pp, a drop larger than the margin.`,
  'candidates[0].fracos[4]':
    `Neither of the two rounds in force puts him above 43% in the ${G('first round', 'primeiro-turno')}, so the single-round victory hypothesis still has no support in the available numbers.`,

  'candidates[0].analise':
    `His day is one of flat price and flat polling, with all the movement coming from the judicial news cycle. IN THE MARKET he sits at 64.50% (vol USD 8.11M cumulative), in the Aug 7 reading at 19:44 UTC, and it is the FOURTH straight day at the same value: Aug 4, Aug 5, Aug 6 and Aug 7 all closed at 64.50%. That matters because the gap over Flávio narrowed over those same days, which means the narrowing is not him falling, it is the other side rising. On the 88-day series, May 10 to today, his high remains 66.50%, from the Aug 1 close, and only 8 of the 88 days had a value equal to or above the current 64.50%. IN THE POLLING nothing changed, because no new national poll came out: what stands is ${G('Genial/Quaest', 'quaest')} (n=2,004, fielded Jul 31 to Aug 3, in person across 120 municipalities, 2pp margin, BR-06591/2026) with 39% and a runoff of 44% x 39%, and Meio/Ideia (n=1,500, telephone, 2.5pp margin, BR-04579/2026) with 43% and 48.5% x 43%. WHAT ARRIVED NEW WERE THE CROSSTABS from Quaest, published on Aug 6 and Aug 7, and they describe where each one is strong: he leads among the elderly, among Catholics and among those with no religion, and opens more than 16 points among women; his rival wins among evangelicals. The same round measured that Trump's declared backing of the rival does not expand voting intention, and that a majority wants independence from the United States. THE RISK OF THE DAY IS JUDICIAL AND IT IS ABOUT THE SON. Estadão published the reconstruction of the day the PF grew suspicious of Fábio Luís's business dealings, the PF will summon a former chief of staff of the president to testify about payments from a lobbyist, and the rival campaign is weighing taking the matter into the opening of the free broadcast slot. The panel records that this happened and does not estimate an effect: his price did not move today, and attributing stillness to a cause would be inventing a relationship the data does not show. IN CONGRESS, the government expects the conversation between him and Alcolumbre on Monday, and the end of the 6x1 shift has already been pushed to after the election.`,

  'candidates[1].header':
    `UP AGAIN IN THE PRICE: ${G('Polymarket', 'polymarket')} 26.95% (vol USD 8.08M cumulative), Aug 7 reading at 19:44 UTC, against 26.85% on Aug 6. It is the sixth straight day of closing in. But the runner-up contract WENT THE OTHER WAY, from 87.50% to 83.00%. In the polling what still stands is 30% at Quaest and 35% at Ideia.`,

  'candidates[1].fortes[0]':
    `He is the end that produced the narrowing of the gap: over six days he went from 24.70% on Aug 1 to 26.95% today, while Lula's price stayed flat over the last four.`,
  'candidates[1].fortes[1]':
    `He wins among evangelicals in the ${G('Genial/Quaest', 'quaest')} crosstabs released on Aug 6 and Aug 7, and that is the only large segment where he comes out ahead (Estadão, Aug 7).`,
  'candidates[1].fortes[2]':
    `In the two national polls in force he ROSE inside his own series: from 28% to 30% at Quaest and from 32% to 35% at Ideia, and from 37% to 39% and from 40% to 43% in the respective runoffs.`,
  'candidates[1].fortes[3]':
    `He remains the comfortable favourite of the ${G('first round', 'primeiro-turno')} runner-up contract, at 83.00% (vol USD 237 thousand), which describes a runoff the market treats as near certain.`,
  'candidates[1].fortes[4]':
    `The ticket is closed and the convention deadline has passed, so he enters the registration phase without the loose end he carried through all of July.`,

  'candidates[1].fracos[0]':
    `THE RUNNER-UP CONTRACT FELL 4.50pp IN ONE DAY, from 87.50% on Aug 6 to 83.00% today, and it is the biggest move on the panel since the Aug 6 reading. The winner price rose and the runner-up price fell on the same day.`,
  'candidates[1].fracos[1]':
    `THE RUNNING MATE BECAME THE PROBLEM OF THE WEEK. Alfredo Gaspar's defence asked the PGR and the ${G('STF', 'stf')} for a DNA test within 72 hours to clear a rape accusation (Folha de S.Paulo, Aug 6), and the ${G('PL', 'pl')} left an opening for him to run for the Senate again (Pleno.News, Aug 7).`,
  'candidates[1].fracos[2]':
    `O Globo reported on Aug 7 that the pick was last minute, without a call from the candidate himself and with an overnight flight, and used the phrase front candidacy to describe Gaspar's earlier registration.`,
  'candidates[1].fracos[3]':
    `He himself said on Aug 6 that he TRIED to have a woman as running mate and that Gaspar was chosen at the last moment, blaming the ${G('Centrão', 'centrao')} bosses (Folha de S.Paulo, Aug 6).`,
  'candidates[1].fracos[4]':
    `Dino ordered the ${G('PF', 'pf')} to investigate signs of crime in Pix earmarks flagged by the TCU, and a transfer made by his running mate is on the list (news cycle of Aug 7).`,
  'candidates[1].fracos[5]':
    `Rejection remains the hardest number: 54% say they would not vote for him at Quaest, against 52% for Lula, and he loses the EIGHT runoff scenarios of the two rounds in force.`,

  'candidates[1].analise':
    `His day has two prices moving in opposite directions, and that is the information. IN THE WINNER CONTRACT he rose again, to 26.95% (vol USD 8.08M cumulative) in the Aug 7 reading at 19:44 UTC, against 26.85% on Aug 6. Adding it up since Aug 1, he went from 24.70% to 26.95%, and it is that rise, and not a fall by Lula, that produced SIX straight days of a narrowing gap, from +41.80pp to +37.55pp. IN THE ${G('FIRST ROUND', 'primeiro-turno')} RUNNER-UP CONTRACT he went the other way and fell 4.50pp in a day, from 87.50% to 83.00%. The two moves coexist without arithmetic contradiction, because gaining a chance of winning takes away a chance of finishing second, but 4.50pp is the biggest move on the panel since the Aug 6 reading and deserves to be stated at its true size. WHAT FILLED THE NEWS CYCLE WAS THE RUNNING MATE, and the balance is bad for the campaign. Alfredo Gaspar's defence asked the PGR and the ${G('STF', 'stf')} for a DNA test within 72 hours to clear a rape accusation. The ${G('PL', 'pl')} left an opening for him to run for the Senate again. O Globo reported that the pick was last minute, without a call from Flávio himself and with an overnight flight, and described the congressman's earlier registration as a front candidacy. Flávio himself said he tried to have a woman as running mate and that Gaspar came in at the last moment, blaming the ${G('Centrão', 'centrao')} bosses. And Dino ordered the ${G('PF', 'pf')} to investigate signs of crime in Pix earmarks flagged by the TCU, with a transfer made by the running mate on the list. IN THE POLLING nothing changed, because there is no new national poll: the 30% at Quaest and the 35% at Ideia still stand, and the crosstabs released over the last two days show that the segment he wins is the evangelical one. THE PICTURE OF THE NATIONAL POLLS since Jul 29 remains the same: ${G('AtlasIntel', 'atlasintel')} 9.1pp, PoderData 6pp, Vox Brasil 9.3pp, ${G('Nexus', 'nexus-btg')} 4pp, Quaest 9pp and Ideia 8pp. The five rounds registered for Aug 10 and Aug 11 are the next test of that picture.`,

  'candidates[2].header':
    `UP IN BOTH BOOKS: presidential at 7.25% (vol USD 9.19M cumulative) in the Aug 7 reading at 19:44 UTC, against 6.90% on Aug 6, and ${G('first round', 'primeiro-turno')} third place at 58.50%, against 56.00%. In the polling what still stands is 4% at Quaest and 4.7% at Ideia, so the distance between price and declared intention WIDENED today.`,

  'candidates[2].fortes[0]':
    `He rose 0.35pp in the presidential contract and 2.50pp in the ${G('first round', 'primeiro-turno')} third place one, both in the same direction, which is rare in a thin book.`,
  'candidates[2].fortes[1]':
    `He remains the favourite of the ${G('first round', 'primeiro-turno')} third place contract, at 58.50% (vol USD 176 thousand), ahead of Caiado's 33.50%.`,
  'candidates[2].fortes[2]':
    `He has the largest cumulative volume in the presidential book among names priced above 1%, at USD 9.19M, above Lula's USD 8.11M.`,
  'candidates[2].fortes[3]':
    `In the two national polls in force he rose inside his own series, from 3% to 4% at Quaest and from 2% to 4.7% at Ideia.`,
  'candidates[2].fortes[4]':
    `At Meio/Ideia he comes out ahead of Zema, at 4.7% against 2.6%.`,

  'candidates[2].fracos[0]':
    `THE DISTANCE BETWEEN PRICE AND POLLING GREW TODAY: with 7.25% in the market and 4% to 4.7% in the polls, the gap runs from 2.55pp to 3.25pp, and it sits on the price side.`,
  'candidates[2].fracos[1]':
    `Six national polls in a row put him between 3% and 4.7%, after the 7.8% from ${G('AtlasIntel', 'atlasintel')} on Jul 29. The isolated high reading remains the exception of the set.`,
  'candidates[2].fracos[2]':
    `On the 88-day series of the presidential book, his maximum is 17.90% and his minimum is 5.50%, so today's 7.25% sits in the lower half of his own history.`,
  'candidates[2].fracos[3]':
    `He loses the two runoff scenarios in force by 10pp and by 13.3pp, and he is the rival Lula beats by the widest margin in the Meio/Ideia round.`,
  'candidates[2].fracos[4]':
    `High cumulative volume with a price well below the top of his own history describes an old open position, not current conviction.`,

  'candidates[2].analise':
    `His case remains the largest distance between what the market pays and what the polling measures, and TODAY THAT DISTANCE GREW, because the price rose and the polling stayed where it was. IN THE MARKET he went to 7.25% (vol USD 9.19M cumulative) in the Aug 7 reading at 19:44 UTC, against 6.90% on Aug 6, and in the ${G('first round', 'primeiro-turno')} third place contract he went to 58.50% (vol USD 176 thousand), against 56.00%. Both books moved up on the same day. IN THE POLLING he still sits between 4% at Quaest and 4.7% at Meio/Ideia, and the gap between price and declared intention now runs from 2.55pp to 3.25pp, always on the price side. THE SEQUENCE remains what weighs most against a growth reading: six consecutive national polls put him between 3% and 4.7%, after the 7.8% ${G('AtlasIntel', 'atlasintel')} measured on Jul 29. One isolated high reading against six consistent low ones is the outlier pattern, and the panel records it that way rather than treating the exception as a scenario. THE MARKET SERIES gives the missing yardstick: over 88 days his presidential price ran from a maximum of 17.90% to a minimum of 5.50%, so today's 7.25% does not describe a comeback, it describes oscillation within the lower half of his own history. VOLUME remains the anomaly of the piece: with USD 9.19M cumulative he traded more than Lula, who has USD 8.11M, at a price less than a ninth of his. Volume measures history traded, not current conviction. The five national polls registered for Aug 10 and Aug 11 are the next chance for the polling to close on the price, or for the distance to stay as it is.`,

  'candidates[3].header':
    `Prices from Aug 7 at 19:44 UTC: Caiado 1.55% (vol USD 5.58M), Zema 0.45% (vol USD 4.83M) and Haddad 0.15% (vol USD 6.77M). Caiado FELL 0.30pp in the presidential book and 2.00pp in the third place contract. In the polling what still stands is 4% and 5.7% for Caiado, 2% and 2.6% for Zema, and Haddad is not tested by either round in force.`,

  'candidates[3].subtitle':
    `Aug 7, with 58 days to go: the pack entered the REGISTRATION phase and Zema was the first presidential candidate to file, declaring R$ 178.7 million in assets. On the same day he went back to attacking the ${G('STF', 'stf')}, calling the judiciary an incendiary branch, and a congressman from his own camp is trying to convince him to swap the presidential run for the Senate. The registration window runs to Aug 15.`,

  'candidates[3].caiado.label':
    `CAIADO (${G('PSD', 'psd')}), presidential Poly 1.55% (vol USD 5.58M, Aug 7 reading 19:44 UTC) | ${G('first round', 'primeiro-turno')} third place 33.50% | candidate confirmed in convention, with Kassab as running mate | polling in force: Quaest 4%, Meio/Ideia 5.7%`,
  'candidates[3].caiado.fortes':
    `He is the most voted name of the pack in the two national polls in force: 5.7% at Meio/Ideia, ahead of Renan Santos, and 4% at Quaest, tied with him. In the Meio/Ideia runoff he has 40% against Lula's 48.5%, the SMALLEST distance among the four rivals tested in that round, and in the Quaest one he has 37% against 45%. He remains the second name in the ${G('first round', 'primeiro-turno')} third place contract, at 33.50%. His campaign announced that Roberto Azevêdo will coordinate the international area, the most concrete staffing move of the pack this week.`,
  'candidates[3].caiado.fracos':
    `BOTH OF HIS PRICES FELL TODAY: the presidential one from 1.85% to 1.55%, and the ${G('first round', 'primeiro-turno')} third place one from 35.50% to 33.50%, a move mirrored exactly by Renan Santos's rise in the same book. The disagreement between houses about him is still open inside the same field window, with 4% at one and 5.7% at the other, both fielding Jul 31 to Aug 3, and over the month the spread runs from 3.1% at ${G('AtlasIntel', 'atlasintel')} to 6% at ${G('Nexus', 'nexus-btg')}. He loses both runoffs in force. At Quaest he did not move inside the house itself, staying at the same 4% as Jul 15.`,

  'candidates[3].haddad.label':
    `HADDAD (${G('PT', 'pt')}), presidential Poly 0.15% (vol USD 6.77M, Aug 7 reading 19:44 UTC) | ${G('first round', 'primeiro-turno')} runner-up 0.25% | NOT tested by Quaest or by Meio/Ideia, because he is running for governor of São Paulo`,
  'candidates[3].haddad.fortes':
    `His cumulative volume, USD 6.77M, is larger than that of several names priced above him, which keeps the contract with trading ballast despite the low level.`,
  'candidates[3].haddad.fracos':
    `NEITHER of the two national polls in force tests him, in any scenario, ${G('first round', 'primeiro-turno')} or runoff. The caveat stands and needs to be said plainly: he is NOT a presidential candidate, he is running for governor of São Paulo, and any scenario including him is a poll hypothesis and not a candidacy under way. At a price of 0.15%, moves carry almost no informational value, and high volume measures history traded, not current conviction.`,

  'candidates[3].zema.label':
    `ZEMA (${G('Novo', 'novo')}), presidential Poly 0.45% (vol USD 4.83M, Aug 7 reading 19:44 UTC) | ${G('first round', 'primeiro-turno')} third place 3.70% | polling in force: Quaest 2%, Meio/Ideia 2.6% | ticket with senator Eduardo Girão | FIRST presidential candidate to file registration, on Aug 7`,
  'candidates[3].zema.fortes':
    `HE WAS THE FIRST PRESIDENTIAL CANDIDATE TO FILE REGISTRATION, on Aug 7, declaring R$ 178.7 million in assets (Money Times and VEJA, Aug 7), in a window that only closes on Aug 15. He was the second interviewee in the g1 and GloboNews series with presidential candidates, on Aug 6, and took up large editorial space on two consecutive days. In the polling he is stable at both houses, with 2% at Quaest and 2.6% at Ideia. In the ${G('first round', 'primeiro-turno')} third place book he sits at 3.70%, ahead of the whole pack except Caiado.`,
  'candidates[3].zema.fracos':
    `A CONGRESSMAN FROM HIS OWN CAMP IS TRYING TO PULL HIM OUT OF THE RACE: Nikolas Ferreira is working to convince him to drop the presidential run and go for the Senate (news cycle of Aug 7). He is the rival Lula beats by the WIDEST margin in the Quaest round, 46% x 34%, and he loses 48.5% x 37% at Ideia. In the polling he has not moved in a month at either house. In the winner contract he sits at 0.45%, and the series caveat is large: his high was 10.10%, on Apr 26, so moves in that band carry almost no informational value.`,

  'candidates[3].analise':
    `The pack had the busiest day on the board and the quietest one in the price, and the two together say something. THE BOARD ENTERED THE REGISTRATION PHASE, which runs to Aug 15, and ZEMA WAS THE FIRST PRESIDENTIAL CANDIDATE TO FILE, on Aug 7, declaring R$ 178.7 million in assets. On the same day he went back to attacking the judiciary, calling it an incendiary branch, after an interview with g1 and GloboNews on Aug 6 in which he defended privatising everything starting with Petrobras and retaliating against the United States over the tariff hike. And, on the same day he filed, the news came out that Nikolas Ferreira is trying to convince him to drop the presidential run and go for the Senate. Filing a candidacy and being pressed to abandon it on the same Friday is the portrait of the space he occupies. IN THE PRICE, THE MOVEMENT WAS ALL CAIADO'S, AND DOWNWARD: presidential from 1.85% to 1.55%, and ${G('first round', 'primeiro-turno')} third place from 35.50% to 33.50%. That 2.00pp fall in the third place book is the exact mirror of Renan Santos's 2.50pp rise in the same contract, which describes a transfer of probability between the two names and not a move by the pack as a bloc. Zema stayed flat at 0.45% and Haddad at 0.15%. IN THE POLLING NOTHING CHANGED, because there is no new national poll: Caiado still has 4% at Quaest and 5.7% at Meio/Ideia, Zema 2% and 2.6%, and Haddad is not tested by either. The disagreement between houses about Caiado remains the most interesting piece of data in the pack, with 4% at one and 5.7% at the other fielding in the same window, and a monthly spread from 3.1% to 6%. THE CROSSING THAT MATTERS: the three together are worth 2.15% in the winner contract, against 26.95% for the runner-up, and that proportion did not move with the convention closed, with the ticket settled or with the registration filed. The board moved and the price of the third space did not.`,

  'candidates[3].fortes[0]':
    `CAIADO is the most voted name of the pack in the two national polls in force, with 5.7% at Meio/Ideia and 4% at Quaest, and has the smallest distance to Lula among the four rivals tested at Ideia, at 48.5% x 40%.`,
  'candidates[3].fortes[1]':
    `ZEMA was the first presidential candidate to file registration, on Aug 7, declaring R$ 178.7 million in assets, in a window that runs to Aug 15.`,
  'candidates[3].fortes[2]':
    `In the polling, Zema is stable at both houses, with 2% at Quaest and 2.6% at Ideia, falling at neither.`,
  'candidates[3].fortes[3]':
    `Caiado remains the second name in the ${G('first round', 'primeiro-turno')} third place contract, at 33.50%.`,
  'candidates[3].fortes[4]':
    `Haddad's cumulative volume, USD 6.77M, keeps trading ballast in the contract despite the 0.15% price.`,

  'candidates[3].fracos[0]':
    `None of the three goes above 5.7% in either national poll in force, and Lula wins the six runoff scenarios in which they appear.`,
  'candidates[3].fracos[1]':
    `CAIADO fell in both books today, 0.30pp in the presidential one and 2.00pp in the third place one, from 35.50% to 33.50%, exactly mirroring Renan Santos's rise.`,
  'candidates[3].fracos[2]':
    `ZEMA is the rival Lula beats by the widest margin at Quaest, at 46% x 34%, and he has not moved in the polling for a month at either house.`,
  'candidates[3].fracos[3]':
    `HADDAD is not tested by either round in force, and he is still not a presidential candidate.`,
  'candidates[3].fracos[4]':
    `In the Aug 7 reading the three together were worth 2.15% in the market, against 26.95% for Flávio, which describes a third space the price does not treat as competitive.`,

  'quadroComparativo[0].p':
    `NO NEW NATIONAL POLL. What still stands is ${G('Genial/Quaest', 'quaest')} (n=2,004, BR-06591/2026) with 39% in the ${G('first round', 'primeiro-turno')} and 44% x 39% in the runoff, and Meio/Ideia (n=1,500, BR-04579/2026) with 43% and 48.5% x 43%. APPROVAL 48% x 47% at Quaest. Crosstabs released on Aug 6 and Aug 7: he leads among the elderly, Catholics and those with no religion, and opens more than 16pp among women.`,
  'quadroComparativo[0].m':
    `64.50% (vol USD 8.11M cumulative), Aug 7 reading 19:44 UTC`,
  'quadroComparativo[0].t':
    `Flat for the FOURTH straight day at the same value, Aug 4 to Aug 7. The gap over Flávio went from +37.65pp to +37.55pp, and the narrowing came from the other side rising. On the 88-day series, May 10 to today, his high is 66.50%, from Aug 1, and only 8 of the 88 days had a value equal to or above the current one.`,
  'quadroComparativo[0].s':
    `58 days to the election. The axis of the day against him is judicial: Estadão reconstructed the day the ${G('PF', 'pf')} grew suspicious of Fábio Luís's business dealings, and the PF will summon a former chief of staff of his to testify about payments from a lobbyist. In Congress, the conversation with Alcolumbre is expected on Monday.`,

  'quadroComparativo[1].p':
    `NO NEW NATIONAL POLL. What still stands is 30% at Quaest, against 28% in that house's own Jul 15 round, and 35% at Meio/Ideia, against 32% on Jul 8. Runoffs of 39% and 43%, and he loses both. REJECTION 54%, the highest among the top two. In the crosstabs released on Aug 6 and Aug 7, he wins among evangelicals.`,
  'quadroComparativo[1].m':
    `26.95% (vol USD 8.08M), Aug 7 reading 19:44 UTC`,
  'quadroComparativo[1].t':
    `Up 0.10pp and SIX days of closing in completed, from 24.70% on Aug 1 to 26.95% today. It is not extreme: on the 88-day series, 28 days had a value equal to or above it, with a high of 43.30% on May 12 and a low of 22.00% on Jul 3. In the runner-up contract he FELL 4.50pp, from 87.50% to 83.00%.`,
  'quadroComparativo[1].s':
    `THE RUNNING MATE BECAME THE PROBLEM: Alfredo Gaspar's defence asked the PGR and the ${G('STF', 'stf')} for a DNA test within 72 hours against a rape accusation, the ${G('PL', 'pl')} left an opening for him to return to the Senate race, and Dino ordered the ${G('PF', 'pf')} to investigate Pix earmarks with a transfer of his on the list. Flávio said he tried to have a woman as running mate and blamed the ${G('Centrão', 'centrao')} bosses.`,

  'quadroComparativo[2].p':
    `NO NEW NATIONAL POLL. What still stands is 4% at Quaest, against 3% on Jul 15, and 4.7% at Meio/Ideia, against 2% on Jul 8. With both, SIX national polls in a row put him between 3% and 4.7%. He loses the runoffs 45% x 35% and 48% x 34.7%.`,
  'quadroComparativo[2].m':
    `7.25% (vol USD 9.19M), Aug 7 reading 19:44 UTC`,
  'quadroComparativo[2].t':
    `Up 0.35pp and the gap to the polling WIDENED, running from 2.55pp to 3.25pp, always on the price side. In the ${G('first round', 'primeiro-turno')} third place contract he rose 2.50pp, from 56.00% to 58.50%. On the 88-day series his maximum is 17.90% and his minimum is 5.50%, so today's value sits in the lower half of his own history.`,
  'quadroComparativo[2].s':
    `Largest cumulative volume in the presidential book among names above 1%, at USD 9.19M, above Lula's. His statement that, if elected, he will not comply with single-justice ${G('STF', 'stf')} rulings still stands.`,

  'quadroComparativo[3].p':
    `NO NEW NATIONAL POLL. What still stands is 4% at Quaest, the same as Jul 15, and 5.7% at Meio/Ideia, against 4% on Jul 8. In the runoffs, 37% against 45% and 40% against 48.5%, the latter the smallest distance among the four rivals tested at Ideia.`,
  'quadroComparativo[3].m':
    `1.55% (vol USD 5.58M), Aug 7 reading 19:44 UTC`,
  'quadroComparativo[3].t':
    `He FELL in both books: 0.30pp in the presidential one and 2.00pp in the ${G('first round', 'primeiro-turno')} third place one, from 35.50% to 33.50%. That fall mirrors exactly the rise of Renan Santos in the same contract, which describes a transfer between the two names.`,
  'quadroComparativo[3].s':
    `Roberto Azevêdo will coordinate the international area of his campaign. The disagreement between houses about him is still open inside the same field window: 4% at one and 5.7% at the other.`,

  'quadroComparativo[4].p':
    `NO NEW NATIONAL POLL. What still stands is 2% at Quaest, the same as Jul 15, and 2.6% at Meio/Ideia, practically the 2.5% of Jul 8. In the runoffs, 34% against 46% and 37% against 48.5%, and he is the rival Lula beats by the widest margin at Quaest.`,
  'quadroComparativo[4].m':
    `0.45% (vol USD 4.83M), Aug 7 reading 19:44 UTC`,
  'quadroComparativo[4].t':
    `Flat at the same value as Aug 6. In this band, moves carry almost no informational value. The series caveat still applies: his high was 10.10%, on Apr 26. In the ${G('first round', 'primeiro-turno')} third place book he sits at 3.70%.`,
  'quadroComparativo[4].s':
    `FIRST presidential candidate to file registration, on Aug 7, declaring R$ 178.7 million in assets. On the same day he called the judiciary an incendiary branch, and Nikolas Ferreira is trying to convince him to swap the presidential run for the Senate.`,

  'quadroComparativo[5].p':
    `No poll. Market on the impeachment of an ${G('STF', 'stf')} justice before 2027.`,
  'quadroComparativo[5].m':
    `3.10% (vol USD 83 thousand), Aug 7 reading 19:44 UTC`,
  'quadroComparativo[5].t':
    `Up 0.35pp against Aug 6. It is the thinnest contract among those the panel publishes, with cumulative volume that does not reach a thousandth of the presidential one, so moves in it carry less ballast than those in the presidential book.`,
  'quadroComparativo[5].s':
    `The tension of the day is between the ${G('PF', 'pf')} and Mendonça in the ${G('Master', 'banco-master')} and ${G('INSS', 'inss')} investigations: the justice minister will try to broker a deal between the two, superintendents came out in defence of the PF leadership, and Jaques Wagner's testimony on the Master case was postponed. Gilmar proposed a binding precedent to block ${G('pautas-bomba', 'pauta-bomba')}, with support signalled by other justices.`,

  cruzamento:
    `TODAY THE CROSSING COMES OUT WHOLE, AND THE TWO SIDES SAY DIFFERENT THINGS. The MARKET side is from the Aug 7 reading at 19:44 UTC. The POLLING side is from Aug 5, because no new national poll came out, and it is labelled as such on every line. --- THE GAP NARROWED FOR THE SIXTH DAY RUNNING, AND THE CAUSE SITS AT ONE END ONLY. The sequence since the high is 41.80pp on Aug 1, 40.90pp, 38.90pp, 38.60pp, 38.50pp, 37.90pp and 37.55pp today. Over those six days Flávio's price went from 24.70% to 26.95%, and Lula's has been flat at 64.50% since Aug 4. In other words, the entire narrowing at the tail of the series is the runner-up rising, not the leader falling, and that differs from what happened in the first half of the move, when Lula fell from 66.50% to 64.50%. --- AND THE SAME CANDIDATE WENT BACKWARDS IN THE OTHER BOOK. While the winner contract rose 0.10pp for him, the ${G('first round', 'primeiro-turno')} runner-up contract fell 4.50pp, from 87.50% to 83.00%. There is no arithmetic contradiction, because gaining a chance of winning takes away a chance of finishing second, but 4.50pp is the biggest move on the panel since the Aug 6 reading and deserves to be stated at its true size. --- THIRD PLACE CHANGED HANDS AGAIN, AND IN MIRROR IMAGE. Renan Santos rose 2.50pp, from 56.00% to 58.50%, and Caiado fell 2.00pp, from 35.50% to 33.50%. On Aug 6 the move had been the reverse, with Caiado up 10.50pp and Renan Santos down four steps. Two straight days of transfer between the same two names, in opposite directions, describe a contested book, and the panel records both sides of the move rather than telling only today's. --- THE POLLING DOES NOT ENTER TODAY BECAUSE THERE WAS NO POLLING. ${G('Genial/Quaest', 'quaest')} and Meio/Ideia still stand, both from Aug 5, with gaps of 9pp and 8pp in the ${G('first round', 'primeiro-turno')}. What arrived new were the CROSSTABS from Quaest, released on Aug 6 and Aug 7, and they draw the geography of the vote: Lula leads among the elderly, Catholics and those with no religion, and opens more than 16 points among women; Flávio wins among evangelicals. The same round measured that Trump's declared backing of Flávio does NOT expand voting intention for him. --- THE NEXT TEST HAS A DATE. Five national polls are registered with the ${G('TSE', 'tse')} for release on Aug 10 and Aug 11: Gerp with n=2,400, ${G('BTG/Nexus', 'nexus-btg')} with n=2,000 and Palver with n=5,000 on the 10th, and MDA with n=2,002 and 100 Cidades with n=2,000 on the 11th. Four of them were still in the field on Friday. It is the largest concentration of national polls since the start of the cycle, and it is what will say whether the narrowing in the price has a counterpart in the polling. --- THE BOARD ENTERED THE REGISTRATION PHASE, which runs to Aug 15, and Zema was the first presidential candidate to file, declaring R$ 178.7 million in assets. On the same day, a congressman from his own camp began trying to convince him to swap the presidential run for the Senate. --- ON THE JUDICIAL AXIS, THE DAY WAS HEAVY FOR BOTH FRONT RUNNERS. Against Flávio: the running mate's defence asked the PGR and the ${G('STF', 'stf')} for a DNA test within 72 hours to clear a rape accusation, the ${G('PL', 'pl')} left an opening for the running mate to return to the Senate race, O Globo reported that the pick was last minute and without a call from the candidate himself, and Dino ordered the ${G('PF', 'pf')} to investigate Pix earmarks with a transfer by the running mate on the list. Against Lula: Estadão reconstructed the day the PF grew suspicious of Fábio Luís's business dealings, the PF will summon a former chief of staff of the president to testify about payments from a lobbyist, and the rival campaign is weighing taking the case into the opening of the free broadcast slot. Adding up the two prices, the market moved 0.10pp on a day when both sides took hits. The panel records the facts and the size of the move, and does not claim that one explains the other.`,
})
