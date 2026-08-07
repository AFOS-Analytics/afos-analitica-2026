/**
 * ERRATA EN de 07/Ago. Três defeitos publicados no painel e corrigidos:
 *  1. Zema registrou candidatura em 06/Ago, não em 07/Ago.
 *  2. Ele NÃO foi o primeiro presidenciável registrado no TSE: foi Renan Santos.
 *  3. candidates[3].fortes e .fracos tinham sumido do arquivo. Repostos.
 */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/en/glossary#${id})`

construir('analysis-criteriosa', 'en', {
  subtitle:
    `UPDATE Aug 7, 19:44 UTC, with 58 days to the ${G('first round', 'primeiro-turno')}. THE PRICE IS FROM TODAY: Lula 64.50%, Flávio 26.95%, a gap of +37.55pp. The gap narrowed for the SIXTH day running, since the high of +41.80pp on Aug 1, and the two ends did that on their own, because there is no new national poll: the latest remain ${G('Genial/Quaest', 'quaest')} and Meio/Ideia, both from Aug 5. The board entered the REGISTRATION phase, which runs to Aug 15, and Zema filed his candidacy on Aug 6, declaring R$ 178.7 million in assets. Five national polls are registered with the ${G('TSE', 'tse')} for Aug 10 and Aug 11.`,

  'candidates[3].subtitle':
    `Aug 7, with 58 days to go: the pack is in the REGISTRATION phase, which runs to Aug 15, and Zema filed his candidacy on Aug 6, declaring R$ 178.7 million in assets. On Friday he went back to attacking the ${G('STF', 'stf')}, calling the judiciary an incendiary branch, and a congressman from his own camp began trying to convince him to swap the presidential run for the Senate. The first presidential candidate registered with the TSE was Renan Santos.`,

  'candidates[3].zema.label':
    `ZEMA (${G('Novo', 'novo')}), presidential Poly 0.45% (vol USD 4.83M, Aug 7 reading 19:44 UTC) | ${G('first round', 'primeiro-turno')} third place 3.70% | polling in force: Quaest 2%, Meio/Ideia 2.6% | ticket with senator Eduardo Girão | filed his candidacy with the TSE on Aug 6`,

  'candidates[3].zema.fortes':
    `HE FILED HIS CANDIDACY WITH THE TSE ON AUG 6, declaring R$ 178.7 million in assets (Diário do Grande ABC and A Crítica, Aug 6), in a window that only closes on Aug 15. He was the second interviewee in the g1 and GloboNews series with presidential candidates, on Aug 6, and took up large editorial space on two consecutive days. In the polling he is stable at both houses, with 2% at Quaest, the same as Jul 15, and 2.6% at Ideia, practically the 2.5% of Jul 8. In the ${G('first round', 'primeiro-turno')} third place book he sits at 3.70%, ahead of the whole pack except Caiado.`,

  'candidates[3].analise':
    `The pack had the busiest day on the board and the quietest one in the price, and the two together say something. THE BOARD IS IN THE REGISTRATION PHASE, which runs to Aug 15, and ZEMA FILED HIS CANDIDACY ON AUG 6, declaring R$ 178.7 million in assets. The first presidential candidate registered with the TSE was Renan Santos, not him. On that same Aug 6 Zema gave an interview to g1 and GloboNews defending privatising everything starting with Petrobras and retaliating against the United States over the tariff hike, and on Friday he went back to attacking the judiciary, calling it an incendiary branch. Also on Friday came the news that Nikolas Ferreira is trying to convince him to drop the presidential run and go for the Senate. Filing a candidacy on Thursday and being pressed to abandon it on Friday is the portrait of the space he occupies. IN THE PRICE, THE MOVEMENT WAS ALL CAIADO'S, AND DOWNWARD: presidential from 1.85% to 1.55%, and ${G('first round', 'primeiro-turno')} third place from 35.50% to 33.50%. That 2.00pp fall in the third place book is the exact mirror of Renan Santos's 2.50pp rise in the same contract, which describes a transfer of probability between the two names and not a move by the pack as a bloc. Zema stayed flat at 0.45% and Haddad at 0.15%. IN THE POLLING NOTHING CHANGED, because there is no new national poll: Caiado still has 4% at Quaest and 5.7% at Meio/Ideia, Zema 2% and 2.6%, and Haddad is not tested by either. The disagreement between houses about Caiado remains the most interesting piece of data in the pack, with 4% at one and 5.7% at the other fielding in the same window, and a monthly spread from 3.1% to 6%. THE CROSSING THAT MATTERS: the three together are worth 2.15% in the winner contract, against 26.95% for the runner-up, and that proportion did not move with the convention closed, with the ticket settled or with the registration filed. The board moved and the price of the third space did not.`,

  'candidates[3].fortes[0]':
    `CAIADO is the most voted name of the pack in the two national polls in force, with 5.7% at Meio/Ideia and 4% at Quaest, and has the smallest distance to Lula among the four rivals tested at Ideia, at 48.5% x 40%.`,
  'candidates[3].fortes[1]':
    `ZEMA filed his candidacy with the TSE on Aug 6, declaring R$ 178.7 million in assets, in a window that runs to Aug 15.`,
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

  'quadroComparativo[4].s':
    `He filed his candidacy with the TSE on Aug 6, declaring R$ 178.7 million in assets. The first presidential candidate registered with the TSE was Renan Santos. On Friday he called the judiciary an incendiary branch, and Nikolas Ferreira is trying to convince him to swap the presidential run for the Senate.`,

  cruzamento:
    `TODAY THE CROSSING COMES OUT WHOLE, AND THE TWO SIDES SAY DIFFERENT THINGS. The MARKET side is from the Aug 7 reading at 19:44 UTC. The POLLING side is from Aug 5, because no new national poll came out, and it is labelled as such on every line. --- THE GAP NARROWED FOR THE SIXTH DAY RUNNING, AND THE CAUSE SITS AT ONE END ONLY. The sequence since the high is 41.80pp on Aug 1, 40.90pp, 38.90pp, 38.60pp, 38.50pp, 37.90pp and 37.55pp today. Over those six days Flávio's price went from 24.70% to 26.95%, and Lula's has been flat at 64.50% since Aug 4. In other words, the entire narrowing at the tail of the series is the runner-up rising, not the leader falling, and that differs from what happened in the first half of the move, when Lula fell from 66.50% to 64.50%. --- AND THE SAME CANDIDATE WENT BACKWARDS IN THE OTHER BOOK. While the winner contract rose 0.10pp for him, the ${G('first round', 'primeiro-turno')} runner-up contract fell 4.50pp, from 87.50% to 83.00%. There is no arithmetic contradiction, because gaining a chance of winning takes away a chance of finishing second, but 4.50pp is the biggest move on the panel since the Aug 6 reading and deserves to be stated at its true size. --- THIRD PLACE CHANGED HANDS AGAIN, AND IN MIRROR IMAGE. Renan Santos rose 2.50pp, from 56.00% to 58.50%, and Caiado fell 2.00pp, from 35.50% to 33.50%. On Aug 6 the move had been the reverse, with Caiado up 10.50pp and Renan Santos down four steps. Two straight days of transfer between the same two names, in opposite directions, describe a contested book, and the panel records both sides of the move rather than telling only today's. --- THE POLLING DOES NOT ENTER TODAY BECAUSE THERE WAS NO POLLING. ${G('Genial/Quaest', 'quaest')} and Meio/Ideia still stand, both from Aug 5, with gaps of 9pp and 8pp in the ${G('first round', 'primeiro-turno')}. What arrived new were the CROSSTABS from Quaest, released on Aug 6 and Aug 7, and they draw the geography of the vote: Lula leads among the elderly, Catholics and those with no religion, and opens more than 16 points among women; Flávio wins among evangelicals. The same round measured that Trump's declared backing of Flávio does NOT expand voting intention for him. --- THE NEXT TEST HAS A DATE. Five national polls are registered with the ${G('TSE', 'tse')} for release on Aug 10 and Aug 11: Gerp with n=2,400, ${G('BTG/Nexus', 'nexus-btg')} with n=2,000 and Palver with n=5,000 on the 10th, and MDA with n=2,002 and 100 Cidades with n=2,000 on the 11th. Four of them were still in the field on Friday. It is the largest concentration of national polls since the start of the cycle, and it is what will say whether the narrowing in the price has a counterpart in the polling. --- THE BOARD IS IN THE REGISTRATION PHASE, which runs to Aug 15. Zema filed his candidacy on Aug 6, declaring R$ 178.7 million in assets, and the first presidential candidate registered with the TSE was Renan Santos. On Friday, a congressman from his own camp began trying to convince him to swap the presidential run for the Senate. --- ON THE JUDICIAL AXIS, THE DAY WAS HEAVY FOR BOTH FRONT RUNNERS. Against Flávio: the running mate's defence asked the PGR and the ${G('STF', 'stf')} for a DNA test within 72 hours to clear a rape accusation, the ${G('PL', 'pl')} left an opening for the running mate to return to the Senate race, O Globo reported that the pick was last minute and without a call from the candidate himself, and Dino ordered the ${G('PF', 'pf')} to investigate Pix earmarks with a transfer by the running mate on the list. Against Lula: Estadão reconstructed the day the PF grew suspicious of Fábio Luís's business dealings, the PF will summon a former chief of staff of the president to testify about payments from a lobbyist, and the rival campaign is weighing taking the case into the opening of the free broadcast slot. Adding up the two prices, the market moved 0.10pp on a day when both sides took hits. The panel records the facts and the size of the move, and does not claim that one explains the other.`,
})

construir('analysis-data', 'en', {
  'cards.sentimento.terceiraVia':
    `THE SPACE IS IN THE REGISTRATION PHASE AND ZEMA FILED HIS CANDIDACY ON AUG 6, declaring R$ 178.7 million in assets (Diário do Grande ABC and A Crítica, Aug 6), in a window that only closes on Aug 15. The first presidential candidate registered with the ${G('TSE', 'tse')} was Renan Santos. On that same Aug 6 Zema gave an interview to g1 and GloboNews defending privatising everything starting with Petrobras, and on Friday he called the judiciary an incendiary branch. Also on Friday came the news that Nikolas Ferreira is trying to convince him to drop the presidential run and go for the Senate. In the polling nothing moved: Caiado still has 4% at Quaest and 5.7% at Ideia, Renan Santos 4% and 4.7%, Zema 2% and 2.6%.`,
})

construir('polls-data', 'en', {
  'polymarketComparison.candidates[5].tendenciaPesquisa':
    `NO NEW NATIONAL POLL. What still stands is the 2% at ${G('Genial/Quaest', 'quaest')}, the same as that house's own Jul 15 round, and the 2.6% at Meio/Ideia, against 2.5% in its own Jul 8 round. In the runoffs he is the rival Lula beats by the widest margin at Quaest, 46% x 34%, and he loses 48.5% x 37% at Ideia. HE FILED HIS CANDIDACY WITH THE ${G('TSE', 'tse')} ON AUG 6, declaring R$ 178.7 million in assets, in a window that runs to Aug 15. The first presidential candidate registered with the TSE was Renan Santos. On Friday, Nikolas Ferreira began trying to convince him to swap the presidential run for the Senate.`,
})
