/**
 * Mapa EN de 07/Ago para analysis-data.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 7".
 * "pesquisa" vira "poll", nunca "research". "urna" vira "polling".
 */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/en/glossary#${id})`

construir('analysis-data', 'en', {
  'cards.sentimento.text1':
    `With 58 days to the ${G('first round', 'primeiro-turno')}, the day belonged to the market and to the board, not to the polling. No new national poll came out: what still stands is ${G('Genial/Quaest', 'quaest')} (n=2,004, in person, 2pp margin, BR-06591/2026) with a first round of 39% x 30% and a runoff of 44% x 39%, and Meio/Ideia (n=1,500, telephone, 2.5pp margin, BR-04579/2026) with 43% x 35% and 48.5% x 43%, both from Aug 5.`,

  'cards.sentimento.text2':
    `THE MARKET GAP NARROWED FOR THE SIXTH DAY RUNNING, AND THE CAUSE SITS AT ONE END ONLY. The sequence since the high is 41.80pp on Aug 1, 40.90pp, 38.90pp, 38.60pp, 38.50pp, 37.90pp and 37.55pp today. Over those six days Flávio went from 24.70% to 26.95% and Lula has been flat at 64.50% since Aug 4. The narrowing at the tail of the series is the runner-up rising, not the leader falling, and that differs from the first half of the move, when Lula fell from 66.50% to 64.50%.`,

  'cards.sentimento.text3':
    `THE QUAEST CROSSTABS RELEASED ON AUG 6 AND AUG 7 MAP THE GEOGRAPHY OF THE VOTE. Lula leads among the elderly, among Catholics and among those with no religion, and opens more than 16 points of advantage among women. Flávio wins among evangelicals, and that is the only large segment where he comes out ahead (Folha de S.Paulo, Estadão and Revista Fórum, Aug 7). The same round measured that Trump's declared backing of Flávio does NOT expand voting intention for him, and recorded a majority wanting independence from the United States.`,

  'cards.sentimento.direita':
    `THE RUNNING MATE BECAME FLÁVIO'S PROBLEM OF THE WEEK. Alfredo Gaspar's defence asked the PGR and the ${G('STF', 'stf')} for a DNA test within 72 hours to clear a rape accusation (Folha de S.Paulo, Aug 6). The ${G('PL', 'pl')} left an opening for him to run for the Senate again (Pleno.News, Aug 7). O Globo reported on Aug 7 that the pick was last minute, without a call from the candidate himself and with an overnight flight, and used the phrase front candidacy to describe the congressman's earlier registration. Flávio himself said on Aug 6 that he tried to have a woman as running mate and that Gaspar came in at the last moment, blaming the ${G('Centrão', 'centrao')} bosses. And Dino ordered the ${G('PF', 'pf')} to investigate signs of crime in Pix earmarks flagged by the TCU, with a transfer made by the running mate on the list.`,

  'cards.sentimento.esquerda':
    `THE RISK OF THE DAY AGAINST LULA IS JUDICIAL AND IT IS ABOUT THE SON. Estadão published on Aug 7 the reconstruction of the day the PF grew suspicious of Fábio Luís Lula da Silva's business dealings, the PF will summon a former chief of staff of the president to testify about payments from a lobbyist, and the rival campaign is weighing taking the case into the opening of the free broadcast slot. In the polling nothing changed: approval at 48% against 47% at Quaest, and he wins the eight runoff scenarios of the two rounds that still stand. In Congress, the government expects the conversation between him and Alcolumbre on Monday, and the end of the 6x1 shift has already been pushed to after the election.`,

  'cards.sentimento.terceiraVia':
    `THE SPACE ENTERED THE REGISTRATION PHASE AND ZEMA WAS THE FIRST TO FILE, on Aug 7, declaring R$ 178.7 million in assets (Money Times and VEJA, Aug 7), in a window that only closes on Aug 15. On the same day he called the judiciary an incendiary branch, after an interview with g1 and GloboNews on Aug 6 in which he defended privatising everything starting with Petrobras. And, on the very day he filed, the news came out that Nikolas Ferreira is trying to convince him to drop the presidential run and go for the Senate. In the polling nothing moved: Caiado still has 4% at Quaest and 5.7% at Ideia, Renan Santos 4% and 4.7%, Zema 2% and 2.6%.`,

  'cards.sentimento.polymarket':
    `Prices from the Aug 7 reading, at 19:44 UTC: Lula 64.50% (vol USD 8.11M cumulative), Flávio 26.95% (vol USD 8.08M), Renan Santos 7.25% (vol USD 9.19M), Caiado 1.55% (vol USD 5.58M), Zema 0.45% (vol USD 4.83M), Haddad 0.15% (vol USD 6.77M), STF impeachment 3.10% (vol USD 83 thousand). Total volume of the presidential book at USD 120.64M. Lula's gap over Flávio at +37.55pp, the sixth straight narrowing since the +41.80pp of Aug 1. AFOS only publishes a price that two independent readings confirm, taken eight minutes apart, and the one that counts is always the most recent. THE BIGGER MOVE OF THE DAY WAS NOT IN THE WINNER CONTRACT: the ${G('first round', 'primeiro-turno')} runner-up contract fell 4.50pp for Flávio, from 87.50% to 83.00%, while his winner price rose. In the third place contract there was a mirror swap, with Renan Santos up 2.50pp, to 58.50%, and Caiado down 2.00pp, to 33.50%, the exact reverse of what the two did on Aug 6.`,

  'cards.inss.text1':
    `The ${G('INSS', 'inss')} had a fact of its own today, and not only an electoral one. The ${G('PF', 'pf')} indicted six people in the second inquiry into illegal deductions from pensions (Folha de S.Paulo, Aug 6). And the case remains the declared axis of the rival campaign, because Flávio Bolsonaro's running mate is Alfredo Gaspar, rapporteur of the INSS joint congressional inquiry.`,

  'cards.inss.text2':
    `THE RUNNING MATE PICK WENT FROM BET TO LIABILITY IN TWO DAYS. Gaspar's defence asked the PGR and the ${G('STF', 'stf')} for a DNA test within 72 hours to clear a rape accusation. The ${G('PL', 'pl')} left an opening for him to run for the Senate again. O Globo reported that the nomination was last minute, without a call from Flávio himself and with an overnight flight. And Dino ordered the PF to investigate signs of crime in Pix earmarks flagged by the TCU, with a transfer made by him on the list.`,

  'cards.inss.text3':
    `THE GOVERNMENT'S APPROVAL HAS NO FRESH MEASUREMENT. What still stands is ${G('Genial/Quaest', 'quaest')} from Aug 5, at 48% x 47% with administration ratings at 36% positive, 26% average and 36% negative, Meio/Ideia from the same window, at 48.5% x 49%, and ${G('BTG/Nexus', 'nexus-btg')} from Aug 3, at 47% x 48%. All three fall inside any margin of one another, and that is why the sign of the balance depends on the house. PoderData/Aya from Jul 30 still holds the harshest picture of the set, 43% x 49%.`,

  'cards.inss.text4':
    `The market numbers on this panel are from the Aug 7 reading, at 19:44 UTC. The Senate has the ${G('PL', 'pl')} at 73.00% (vol USD 259 thousand), against 75.00% in the Aug 3 reading, and the ${G('MDB', 'mdb')} at 18.70%. The 2026 annual inflation contract is not part of the two-reading confirmation, so the panel publishes the SHARE OF THE BOOK instead of treating each band as a probability: the 5.00% to 5.49% band holds 43.5% of the book, the 5.50% to 5.99% band holds 22.5% and the 4.50% to 4.99% band holds 19.3%. The bands add up to 104.85% in raw price, and that is why the correct reading there is share, not chance.`,

  'cards.inss.impactoLula':
    `No fresh approval measurement. What still stands is the 48% against 47% from the Aug 5 Quaest round, with 5% giving no answer, and the relevant point remains that this number repeated its own Jul 15 round on both indicators. In the polling, Lula leads the four runoff scenarios of the two rounds that still stand and beats Zema, Caiado and Renan Santos in all of them.`,

  'cards.inss.impactoGestao':
    `Administration ratings at 36% positive, 26% average and 36% negative at Quaest on Aug 5, a split identical to Jul 15. At ${G('BTG/Nexus', 'nexus-btg')} on Aug 3 it is 37% excellent or good against 43% poor or terrible. The two houses measure the administration differently and the panel records both without arbitrating, because the valid comparison is each house against itself. BTG/Nexus is back in the field this week, with release scheduled for Aug 10.`,

  'cards.inss.conclusao':
    `With 58 days to the election, the day brought a price move to both sides and bad news to both sides. The gap narrowed for the sixth day running, and the cause sits at one end only: Flávio went from 24.70% to 26.95% since Aug 1, while Lula has been flat at 64.50% since Aug 4. In the news cycle, Flávio took hits over his running mate and Lula took hits over his son, and the market moved 0.10pp in the winner contract. The panel records the facts and the size of the move, and does not claim that one explains the other. THE TEST COMES ON MONDAY AND TUESDAY: five national polls are registered with the ${G('TSE', 'tse')} for Aug 10 and Aug 11, one of them with n=5,000, and four of them were still in the field on Friday.`,

  'cards.bancoMaster.text1':
    `THE FACT OF THE DAY IN THE ${G('MASTER CASE', 'banco-master')} IS INSTITUTIONAL: the tension between the Federal Police and justice André Mendonça, the case rapporteur, reached the point where the justice minister offered to broker a deal between Mendonça and the ${G('PF', 'pf')} director general (news cycle of Aug 7). On Aug 6, Mendonça voiced concern over the independence of the PF in a meeting with the justice minister, and superintendents of the force came out in defence of its leadership.`,

  'cards.bancoMaster.text2':
    `Jaques Wagner's testimony to the PF on the Master case was POSTPONED at the request of the defence, which claimed lack of access to the case files (news cycle of Aug 7). It is the second postponement of an evidentiary step recorded by this panel in this inquiry, and it carries no attributed electoral effect.`,

  'cards.bancoMaster.text3':
    `The writ of mandamus on setting up the congressional inquiry is still undecided, and the absence remains the record. On the legislative axis, Gilmar Mendes proposed a binding precedent to block ${G('pautas-bomba', 'pauta-bomba')} and other justices signalled support (Folha de S.Paulo, Aug 7), which touches the fiscal cost of decisions by Congress and not the inquiry.`,

  'cards.bancoMaster.conclusao':
    `The contract on the impeachment of an ${G('STF', 'stf')} justice sits at 3.10% (vol USD 83 thousand) in the Aug 7 reading, at 19:44 UTC, against 2.75% on Aug 6, a rise of 0.35pp. It is the thinnest contract among those this panel publishes, with cumulative volume that does not reach a thousandth of the presidential book, so moves in it carry less ballast than those in the presidential one. It is on record that the rise happened on the same day the PF and the rapporteur of the Master case came into open friction. The panel records the coincidence of dates and does not claim cause.`,

  'cards.stf.toffoli':
    `Toffoli remains without a new individual act captured this Friday.`,

  'cards.stf.moraes':
    `Moraes had a defeat recorded in the full court: the ${G('STF', 'stf')} opened room to benefit defendants of Jan 8, going against his position (news cycle of Aug 7). The Aug 4 record still stands, when he hosted at home the meeting between Lula and Alcolumbre, at a dinner arranged by him and by Zanin.`,

  'cards.stf.gilmar':
    `HE IS THE JUSTICE OF THE DAY ON THE FISCAL AXIS. Gilmar Mendes proposed a binding precedent to block ${G('pautas-bomba', 'pauta-bomba')}, and other justices signalled support (Folha de S.Paulo, Aug 7). The proposal targets the cost of decisions by Congress, and not the electoral inquiries.`,

  'cards.stf.dino':
    `He ordered the ${G('PF', 'pf')} to investigate signs of crime in Pix earmarks flagged by the TCU, and a transfer made by Flávio Bolsonaro's running mate is on the list (news cycle of Aug 7). He also asked for more time in the gambling ruling, so the case can be examined together with the actions against betting firms. The Aug 4 milestone still stands, when he authorised the third inquiry into Fábio Luís Lula da Silva.`,

  'cards.stf.mendonca':
    `HE IS THE JUSTICE OF THE DAY ON THE CRIMINAL AXIS. His tension with the Federal Police in the ${G('Master', 'banco-master')} and ${G('INSS', 'inss')} investigations reached the point where the justice minister offered to broker a deal between him and the director general of the force. On Aug 6 he voiced concern over the independence of the PF, and superintendents came out in defence of the leadership of the body. He remains rapporteur of the Master case inquiry.`,

  'cards.stf.nexo':
    `The thread this Friday is that the judiciary showed up on BOTH sides of the race on the same day, and through concrete acts, not statements. Against Flávio: Dino ordered an investigation into Pix earmarks with a transfer by the running mate on the list, and the running mate's defence had to petition the PGR and the ${G('STF', 'stf')} asking for a DNA test within 72 hours. Against Lula: the ${G('PF', 'pf')} will summon a former chief of staff of his to testify about payments from a lobbyist, and his son's case returned to the centre of the news cycle. In the background, the PF and the rapporteur of the Master case came into open friction, to the point of requiring mediation by the justice minister. In the polling, none of this has a fresh measurement. In the price, the winner contract moved 0.10pp.`,

  'cards.stf.analise':
    `THE IMPEACHMENT CONTRACT ROSE 0.35pp, from 2.75% to 3.10% (vol USD 83 thousand), in the Aug 7 reading, at 19:44 UTC. The move coincides with the day of sharpest public friction between the Federal Police and the rapporteur of the ${G('Master', 'banco-master')} case, and the panel records the coincidence of dates without claiming cause, because in a contract with USD 83 thousand cumulative the distance between a move and noise is short. The usual caveat still applies and is the reason it is repeated: this is the thinnest contract among those the panel publishes, with volume that does not reach a thousandth of the presidential book, and so it is the last place one should look for confirmation of a political thesis.`,
})
