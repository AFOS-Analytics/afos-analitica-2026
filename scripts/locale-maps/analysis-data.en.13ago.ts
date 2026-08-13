/**
 * Mapa EN de 13/Ago para analysis-data.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 13".
 */
import { construir } from '../build-locale-json'

const S = 'last confirmed reading, from Aug 12, 16:41 BRT'

construir('analysis-data', 'en', {
  'cards.sentimento.text1':
    `52 days from the first round, the day brought a NEW NATIONAL POLL, the first since Aug 11. PoderData/Aya, n=2,400, telephone, fieldwork Aug 9 to Aug 12, registration BR-06868/2026: 41% in the first round for the leader against 35% for the runner-up, and 46% x 45% in the runoff. CNN Brasil and Bnews report that the leader also ties with Zema and with Caiado in the runoff, and beats Renan Santos.`,

  'cards.sentimento.text2':
    `THE FINDING IS IN THE HOUSE COMPARED WITH ITSELF, AND IT SEPARATES THE TWO ROUNDS. In the first round the distance between the top two has not moved in four weeks: 6pp on Jul 16 (40% x 34%), 6pp on Jul 30 (41% x 35%) and 6pp now, with both repeating exactly the percentages of the previous round. In the runoff, over the same span, the distance fell from 3pp to 1pp. Same house, same method, same sample: one round frozen and the other narrowing.`,

  'cards.sentimento.text3':
    `REJECTION CAME OUT TIED AT 48% FOR THE TOP TWO, according to Poder360, and it is the figure that removes the basis for any easy reading about who has more room to grow. PERSONAL APPROVAL of the president at 43% against 50% disapproval. ⚠️ Revista Oeste reported 51% disapproval OF THE GOVERNMENT in the same survey, which is a different question from the previous one and does not add to it.`,

  'cards.sentimento.direita':
    `🔴 THE POLITICAL FACT OF THE DAY IS THE RUNNER-UP'S REGISTRATION. Folha de S.Paulo and G1 report that he appears in the TSE records affiliated with Missão, the party the fourth-placed candidate runs for, without his knowledge, and that this blocked the formal registration of his presidential candidacy by the PL. G1 records that the PL speaks of fraud. The registration deadline closes on Aug 15. He opened his campaign in Rio and again criticised Justice Moraes after a Federal Police operation against a journalist's source.`,

  'cards.sentimento.esquerda':
    `The leader launched his re-election campaign at Vila Euclides Stadium, in São Bernardo, the cradle of trade unionism in the ABC region, according to TVT News and G1, on the same day his opponent opened his in Rio. In the polling, PoderData keeps him ahead in both rounds, with the runoff distance cut to 1pp, inside the poll's 2pp margin.`,

  'cards.sentimento.terceiraVia':
    `THE CHASING PACK HAD ITS BEST DAY OF THE WINDOW IN THE RUNOFF. According to CNN Brasil and Bnews, Caiado and Zema TIE with the leader in PoderData's runoff, and Renan Santos is the only one of the four who loses. For Caiado it is the second tie in four days, after BTG/Nexus on Aug 10. ⚠️ The first-round percentages for these names in this round did not appear in the articles captured, and the panel does not estimate them: the figures from earlier houses still stand.`,

  'cards.sentimento.polymarket':
    `NO NEW MARKET READING ON Aug 13. The prices shown on this page are from the ${S}: Lula 63.50% (vol USD 8.22M cumulative), Flávio Bolsonaro 27.65% (vol USD 8.13M), Renan Santos 7.45% (vol USD 9.48M), Ronaldo Caiado 0.95% (vol USD 5.66M), Romeu Zema 0.35% (vol USD 5.07M), Fernando Haddad 0.15% (vol USD 7.06M) and Tarcísio de Freitas 0.05% (vol USD 13.91M). AFOS only publishes a price that two independent readings confirm.`,

  'cards.inss.text1':
    `The case of fraud in association-fee deductions at the INSS had a NEW AND RELEVANT FACT on Aug 13, and it belongs to policing, not to polling. Carlos Lopes, president of an association accused of diversions and of paying bribes to politicians, was a fugitive and turned himself in to the Federal Police, and was arrested. The information ran in G1, O Globo, Folha de S.Paulo and Estadão on the same day, with independent reporting.`,

  'cards.inss.text2':
    `O Globo further reported that FOUR PLEA DEALS in the case are stalled, awaiting a decision from the Federal Police and the Prosecutor General's Office. A stalled plea deal is not an approved one, and the panel records the state of the process without anticipating what it may produce.`,

  'cards.inss.text3':
    `The distinction the panel has kept from the start still holds: one thing is the effect on the government rating, which is where administrative fraud usually shows up; another is the effect on voting intention, which no poll in the window isolates. PoderData today carries no specific breakdown on the case.`,

  'cards.inss.text4':
    `The most recent government rating is PoderData's own, from Aug 13, with 43% personal approval against 50% disapproval. No house in the window tested the INSS case as an explanatory variable, and so the panel attributes to it no share of that balance.`,

  'cards.inss.impactoLula':
    `Not isolable. Across the eight national polls since Aug 5 he leads or ties the first round in all of them, between 38% and 44%, and none tests the INSS case as a variable. Today's arrest is a procedural fact and there is no measurement linking it to voting intention.`,

  'cards.inss.impactoGestao':
    `The government rating still shows a negative balance at every house in force, with sizes ranging from 1pp positive to 10pp negative across eight readings in nine days. Cause is not attributed here, because no poll in the window breaks the balance down by topic.`,

  'cards.inss.conclusao':
    `The case remains in the field of administration and policing, not of voting intention. On Aug 13 it produced an arrest and the record of four stalled plea deals, both with outlet and date, and neither with a measured effect on the ballot.`,

  'cards.bancoMaster.text1':
    `The Banco Master case had THREE distinct movements on Aug 13, and none of them is a decision on the merits. O Globo reported that the fund manager who denounced the bank went to the Supreme Court asking to be included in the victim protection programme, which shifts the discussion to the safety of the person who came forward.`,

  'cards.bancoMaster.text2':
    `Folha de S.Paulo reported that a Central Bank director told the Federal Police of a hostile environment and fear of leaks around the bank's liquidation. And Estadão reported that the CNJ REMOVED the judge in the Banco Santos case who appears in a recording suggesting to the heirs the sale to Master and a change of lawyers, a direct follow-on from the recording published on Aug 12.`,

  'cards.bancoMaster.text3':
    `⚠️ The three facts have outlet and date, and none of them is a decision on the conduct of the bank or its controllers. Removal by the CNJ is an administrative measure concerning a magistrate, not a judgment of the case. The panel records the facts without converting them into a forecast.`,

  'cards.bancoMaster.conclusao':
    `The day brought a protection request from the whistleblower, a report of hostility inside the Central Bank and the removal of a judge by the CNJ. None of them decides the merits, and the case remains without a measured effect on voting intention.`,

  'cards.stf.toffoli':
    `No new individual act captured this Thursday.`,

  'cards.stf.moraes':
    `His decision in the case of the Maranhão journalist was the judicial thread of the day. According to Folha de S.Paulo, the order caused concern and doubts among specialists and drew a reaction from professional bodies, and the targeted journalist said he had not monitored Justice Dino. The runner-up in the presidential race criticised him again after the operation against the source, according to Correio Braziliense.`,

  'cards.stf.gilmar':
    `No new individual act this Thursday. The Aug 12 order still stands, in which he, Moraes, Dino and Zanin instructed judges of seven courts to return payments considered exorbitant, as reported by Folha de S.Paulo and Estadão.`,

  'cards.stf.dino':
    `He said he is the target of aggression and injustice after the Federal Police operation against a journalist's source, according to O Globo, which reported that the source was targeted after an exchange of messages that underpinned reports about him. The International Association of Broadcasting asked for protection of the practice of journalism in the case, according to G1.`,

  'cards.stf.mendonca':
    `O Globo published two pieces this Thursday on his conduct, one pointing to an error that Supreme Court justices identify in the crisis with the Federal Police and another on what his role is. They are analysis pieces, not judicial acts.`,

  'cards.stf.nexo':
    `The thread this Thursday is the CONCENTRATION of judicial coverage on a single episode, the Federal Police operation against a journalist's source, which involves two of the five justices tracked in different roles: one as author of the decision and the other as the subject of the reports that gave rise to it. In parallel, the governor of São Paulo went to the Supreme Court against the president over a loan mentioned in a debate, and Valor Econômico reported that the Finance Ministry released the operation shortly afterwards.`,

  'cards.stf.analise':
    `NO NEW MARKET READING ON Aug 13 for the contract on the impeachment of a Supreme Court justice. The value shown is from the ${S}, at 3.90% on cumulative volume of USD 83 thousand. It remains the thinnest contract among those tracked, and any move in it requires that caveat about size. ⚠️ Worth separating: the day's episode is large in the news and has no direct bearing on the question this contract asks, which is the departure of a justice by impeachment before 2027.`,
})
