/**
 * Mapa EN de 08/Ago para analysis-data.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 8".
 */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/en/glossary#${id})`

construir('analysis-data', 'en', {
  'cards.sentimento.text1':
    `With 57 days to the ${G('first round', 'primeiro-turno')}, both sides of the crossing stood still and what moved was the board. No new national poll has come out since Aug 5: what still stands is ${G('Genial/Quaest', 'quaest')} (n=2,004, in person, 2pp margin, BR-06591/2026) with a first round of 39% x 30% and a runoff of 44% x 39%, and Meio/Ideia (n=1,500, telephone, 2.5pp margin, BR-04579/2026) with 43% x 35% and 48.5% x 43%.`,

  'cards.sentimento.text2':
    `THE SIX-DAY RUN OF NARROWING IN THE GAP DID NOT CONTINUE. It came from +41.80pp on Aug 1 and fell every day through Aug 7; today the gap held at +37.55pp, with Lula flat at 64.50% for the fifth day running and Flávio flat at 26.95%. Neither gave back ground, which is information too: the runner-up's new level held without a fresh poll to confirm it.`,

  'cards.sentimento.text3':
    `THE MOVE OF THE DAY IS IN THE PLACEMENT BOOKS, AND IT CONTRADICTS YESTERDAY'S READING. In the ${G('first round', 'primeiro-turno')} runner-up contract, Flávio fell for the second day running, adding up to 6.00pp in two days, and this time his winner price did not rise alongside. And in the third place contract the transfer stopped: Caiado fell 2.50pp and Renan Santos did NOT rise, he stood still. On the two previous days the two moved as mirror images. Today the probability left the book instead of migrating inside it.`,

  'cards.sentimento.direita':
    `FLÁVIO'S TICKET CLOSED A STRUCTURAL PICTURE: 2026 is the first election this century with no woman on a competitive presidential ticket, counting as competitive the ticket whose party holds seats in Congress (CNN Brasil and Jornal de Brasília, Aug 8). Since 2002 there has always been at least one, and in this cycle women appear only on tickets of parties without a bench. He answered the subject by talking about appointing women to the ${G('STF', 'stf')} at an event with female allies (Folha de S.Paulo, Aug 8). The running mate remains the problem: he is on the list of Pix earmarks Dino ordered the ${G('PF', 'pf')} to investigate, with R$ 6.2 million sent to São José da Laje that the TCU audit could not trace, Gilmar Mendes said he does not know him, and the ${G('PL', 'pl')} minutes leave an opening for him to run for the Senate again if the ticket changes.`,

  'cards.sentimento.esquerda':
    `LULA FILED HIS CANDIDACY with the ${G('TSE', 'tse')} on the night of Aug 7, with Alckmin as running mate, under the Brasil Pronto Pra Mais coalition, which brings together seven parties: PDT, PSB, the PT, PCdoB and PV federation, and the PSOL and Rede federation. It is the ONLY ticket in the race with more than one party, in a picture described as the one with the most single-party tickets since redemocratisation (G1, Aug 8). The official launch is set for Aug 16, at Vila Euclides. On the judicial axis, the ${G('PT', 'pt')} petitioned the STF demanding an inquiry into the leak of audio of the president's son to his rival, and Mendonça ordered the delivery of data on a party meeting and on the Porta-Vozes de Lula project.`,

  'cards.sentimento.terceiraVia':
    `THE SPACE HAD NO FACT OF ITS OWN, AND WHAT REACHES IT COMES FROM THE WIDER PICTURE. In the price, the movement was all Caiado's and downward for the second day: presidential from 1.55% to 1.35%, and ${G('first round', 'primeiro-turno')} third place from 33.50% to 31.00%. Zema rose 0.10pp, to 0.55%, and moved back above the 0.5% cut that separates price from noise. Haddad fell to 0.05%. In the polling nothing changed: Caiado still has 4% at Quaest and 5.7% at Ideia, Renan Santos 4% and 4.7%, Zema 2% and 2.6%. Zema, who filed his registration on Aug 6, is still the only one of the three with a candidacy filed, in a window that runs to Aug 15.`,

  'cards.sentimento.polymarket':
    `Prices from the Aug 8 reading, at 17:32 UTC: Lula 64.50% (vol USD 8.12M cumulative), Flávio 26.95% (vol USD 8.08M), Renan Santos 7.65% (vol USD 9.23M), Caiado 1.35% (vol USD 5.59M), Zema 0.55% (vol USD 5.01M), Haddad 0.05% (vol USD 6.78M), STF impeachment 3.10% (vol USD 83 thousand). Total volume of the presidential book at USD 121.06M. Lula's gap over Flávio at +37.55pp, and the six-day run of narrowing stopped here. AFOS only publishes a price that two independent readings confirm, taken eight minutes apart, and the one that counts is always the most recent. IN THE PLACEMENT BOOKS: in the runner-up one, Flávio fell to 81.50%, second day running, and Renan Santos sits at 8.30% against Lula's 8.20%, a 0.10pp difference between two low values. In the third place one, Renan Santos stood still at 58.50% and Caiado fell to 31.00%.`,

  'cards.inss.text1':
    `The ${G('INSS', 'inss')} came in today through the earmarks, not through the pension fraud. Dino ordered the Federal Police to investigate signs of crime in R$ 55.4 million of Pix earmarks flagged by a TCU audit, and the list reaches both sides of the race.`,

  'cards.inss.text2':
    `THE LIST HAS THREE NAMES THAT MATTER FOR THIS PANEL, AND NAMING ONLY ONE WOULD BE PICKING A SIDE. Alfredo Gaspar, Flávio Bolsonaro's running mate, with R$ 6.2 million sent to São José da Laje, in Alagoas, which the audit could not trace. Hugo Motta, president of the Chamber. And Rogério Carvalho, former ${G('PT', 'pt')} leader in the Senate. Six other federal deputies, two senators and four former lawmakers also appear.`,

  'cards.inss.text3':
    `THE GOVERNMENT'S APPROVAL STILL HAS NO FRESH MEASUREMENT. What stands is ${G('Genial/Quaest', 'quaest')} from Aug 5, at 48% x 47% with administration ratings at 36% positive, 26% average and 36% negative, Meio/Ideia from the same window, at 48.5% x 49%, and ${G('BTG/Nexus', 'nexus-btg')} from Aug 3, at 47% x 48%. All three fall inside any margin of one another, and that is why the sign of the balance depends on the house.`,

  'cards.inss.text4':
    `The market numbers on this panel are from the Aug 8 reading, at 17:32 UTC. The Senate has the ${G('PL', 'pl')} at 73.50% (vol USD 259 thousand), against 73.00% on Aug 7, and the ${G('MDB', 'mdb')} at 18.45%. The 2026 annual inflation contract is not part of the two-reading confirmation, so the panel publishes the SHARE OF THE BOOK instead of treating each band as a probability: the 5.00% to 5.49% band holds 40.8% of the book, the 5.50% to 5.99% band holds 22.9% and the 4.50% to 4.99% band holds 19.7%. The bands add up to 105.55% in raw price, and that is why the correct reading there is share, not chance.`,

  'cards.inss.impactoLula':
    `No fresh approval measurement. What stands is the 48% against 47% from the Aug 5 Quaest round, with 5% giving no answer. In the polling, Lula leads the four runoff scenarios of the two rounds in force and beats Zema, Caiado and Renan Santos in all of them. What changed today was the filing: his candidacy was registered with the ${G('TSE', 'tse')} on the night of Aug 7, with Alckmin as running mate.`,

  'cards.inss.impactoGestao':
    `Administration ratings at 36% positive, 26% average and 36% negative at Quaest on Aug 5, a split identical to Jul 15. At ${G('BTG/Nexus', 'nexus-btg')} on Aug 3 it is 37% excellent or good against 43% poor or terrible. The two houses measure the administration differently and the panel records both without arbitrating, because the valid comparison is each house against itself. BTG/Nexus is back in the field, with release scheduled for Aug 10.`,

  'cards.inss.conclusao':
    `With 57 days to the election, the day stopped the price and moved the board. The gap held at +37.55pp and the six-day run of narrowing did not continue, with both ends still. What moved were the placement books, and there yesterday's reading did not repeat: the transfer between Renan Santos and Caiado in the third place contract stopped, and the probability left the book instead of migrating inside it. THE TEST COMES ON MONDAY, TUESDAY AND THURSDAY: six national polls are registered with the ${G('TSE', 'tse')} for Aug 10, Aug 11 and Aug 13, one of them with n=5,000, and none has a result yet.`,

  'cards.bancoMaster.text1':
    `The ${G('Master case', 'banco-master')} moved on assets, not on the inquiry. The press reported that Daniel Vorcaro's holding company was liquidated in the Cayman Islands, and that the liquidator advanced in the hunt for assets, obtaining a sweep of apartments in the United States (news cycle of Aug 7 and Aug 8).`,

  'cards.bancoMaster.text2':
    `The institutional friction between the Federal Police and André Mendonça, the inquiry rapporteur, stayed in the news, but with a record that lowers the alarm: officers heard by the press say the environment turned hostile and that even so they see no risk to the investigations (news cycle of Aug 8). The justice minister is trying to mediate.`,

  'cards.bancoMaster.text3':
    `Jaques Wagner's testimony to the ${G('PF', 'pf')} on the Master case is still postponed, at the request of the defence, which claimed lack of access to the case files. The writ of mandamus on setting up the congressional inquiry remains undecided, and the absence is still the record. The specific query on Master, Vorcaro, STF, INSS and the inquiry brought low flow today, with one item, which is information about the day and is noted as such rather than turned into silence.`,

  'cards.bancoMaster.conclusao':
    `The contract on the impeachment of an ${G('STF', 'stf')} justice held at 3.10% (vol USD 83 thousand) in the Aug 8 reading, at 17:32 UTC, the same value as Aug 7. It is the thinnest contract among those this panel publishes, with cumulative volume that does not reach a thousandth of the presidential book. On a day when the judiciary appeared on four fronts, from Pix earmarks to a denied visit request, the price did not move. The panel records both things side by side and concludes nothing from the absence of movement in a contract of that size.`,

  'cards.stf.toffoli':
    `Toffoli remains without a new individual act captured this Saturday.`,

  'cards.stf.moraes':
    `He denied Jair Bolsonaro's request to receive a visit from his children on Father's Day (news cycle of Aug 8). The Aug 4 record still stands, when he hosted at home the meeting between Lula and Alcolumbre, an episode that returned to the opinion pages this weekend.`,

  'cards.stf.gilmar':
    `He said he does not know Alfredo Gaspar, Flávio Bolsonaro's running mate (news cycle of Aug 7). His proposal for a binding precedent to block ${G('pautas-bomba', 'pauta-bomba')}, which other justices signalled they support, still stands.`,

  'cards.stf.dino':
    `HE IS THE JUSTICE OF THE DAY. He ordered the ${G('PF', 'pf')} to investigate signs of crime in R$ 55.4 million of Pix earmarks flagged by a TCU audit. The list reaches Flávio Bolsonaro's running mate, with R$ 6.2 million untraced, the president of the Chamber, Hugo Motta, and Rogério Carvalho, former ${G('PT', 'pt')} leader in the Senate, plus six other deputies, two senators and four former lawmakers.`,

  'cards.stf.mendonca':
    `As vice president of the ${G('TSE', 'tse')}, he ordered the delivery of data on a PT meeting and on the Porta-Vozes de Lula project (news cycle of Aug 8). He remains rapporteur of the ${G('Master', 'banco-master')} case inquiry, and his friction with the PF stays in the news, with the justice minister trying to mediate.`,

  'cards.stf.nexo':
    `The thread this Saturday is that the day's furthest-reaching decision hits both sides through the SAME act. Dino ordered an investigation into Pix earmarks and the list has the runner-up's running mate, the president of the Chamber and a former ${G('PT', 'pt')} leader in the Senate. It is not a decision against one camp, it is an audit that caught lawmakers from several. In parallel, the PT petitioned the ${G('STF', 'stf')} over the leak of audio of the president's son, Mendonça asked for data on a party meeting, Moraes denied Bolsonaro a visit from his children and Gilmar said he does not know Flávio's running mate. In the price, the winner contract did not move.`,

  'cards.stf.analise':
    `THE IMPEACHMENT CONTRACT HELD at 3.10% (vol USD 83 thousand), the same as Aug 7. On a day when the judiciary appeared on four distinct fronts, the price did not react, and the panel does not treat that as a signal: with USD 83 thousand cumulative, this is the thinnest contract among those the panel publishes, and absence of movement in it means as little as movement would. The caveat is repeated on purpose, because it is the last place one should look for confirmation of a political thesis.`,
})
