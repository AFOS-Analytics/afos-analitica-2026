/**
 * Mapa EN de 09/Ago para analysis-data.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 9".
 */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/en/glossary#${id})`

construir('analysis-data', 'en', {
  'cards.sentimento.text1':
    `With 56 days to the ${G('first round', 'primeiro-turno')}, the leader's price moved again and the polling has gone four days without measurement. No new national poll has come out since Aug 5: what still stands is ${G('Genial/Quaest', 'quaest')} (n=2,004, in person, 2pp margin, BR-06591/2026) with a first round of 39% x 30% and a runoff of 44% x 39%, and Meio/Ideia (n=1,500, telephone, 2.5pp margin, BR-04579/2026) with 43% x 35% and 48.5% x 43%. Today's coverage of Quaest carries cuts by education and by political placement, which are readings of that same Aug 5 round, not fresh measurement.`,

  'cards.sentimento.text2':
    `THE GAP NARROWED AGAIN, AND FROM ONE SIDE ONLY. It went to +36.55pp, against +37.55pp yesterday, because LULA FELL 1.00pp, to 63.50%, breaking below the five-day plateau that had held since Aug 4. Flávio stood still at 26.95% for the third day. The distinction matters: when the gap narrows from both ends there is a transfer between the two names; when it narrows only because the leader gives way, what exists is a loss of price in the favourite, and the probability may not have gone to the runner-up. Since Aug 1 the gap has fallen on SEVEN of the eight days, with a single flat day, coming down from +41.80pp.`,

  'cards.sentimento.text3':
    `THE SECOND MOVE OF THE DAY IS IN THE THIRD PLACE BOOK, AND IT CONTRADICTS YESTERDAY'S. Renan Santos jumped 6.00pp, to 64.50%, and Caiado fell 5.50pp, to 25.50%, in an almost exact mirror. Yesterday Caiado fell 2.50pp and Renan did NOT rise, and the panel recorded that the probability was leaving the book instead of migrating inside it. Today it migrated. The direction was the same on both days and the mechanism was not, which is why the panel describes them separately rather than adding them into a trend. In the runner-up book, Flávio stopped at 81.50% after losing 6.00pp in two days.`,

  'cards.sentimento.direita':
    `THE OPPOSITION'S DAY WAS PAPERWORK AND CUTS, WITH NO FRESH MARKET FACT. Flávio completed his third day flat at 26.95%, and the ground he gained over the leader came from the leader's fall, not from a move of his own. A ${G('Genial/Quaest', 'quaest')} cut published on Aug 9 shows Flávio widening his advantage among voters with secondary and higher education, with the caveat that it is a reading of the Aug 5 round, not a new poll. In the paperwork, Zema declared R$ 178.7 million to the ${G('TSE', 'tse')} and his running mate, Girão, R$ 34.1 million. And the structural picture closed with a figure: 2026 has 92.3% single-party tickets, the highest proportion since redemocratisation, with his rival's ticket the only one carrying more than one party.`,

  'cards.sentimento.esquerda':
    `LULA DECLARED HIS ASSETS TO THE ${G('TSE', 'tse')}, around R$ 4.7 million, 35% less than he reported in 2022, with Alckmin declaring R$ 3.3 million. Poder360 calculates a 60% fall in real terms since 2018. The outlets diverge on the decimal, between R$ 4.7 million and R$ 4.8 million, and the panel records the divergence rather than picking a number. On the map, a survey published on Aug 9 counts 26 state platforms organised for him against 16 for his rival, which is the state-level face of the same asymmetry that already showed in the composition of the ticket. The official campaign launch is still set for Aug 16, at Vila Euclides, and the candidacy registration window closes on Aug 15.`,

  'cards.sentimento.terceiraVia':
    `THE SPACE SHRANK AGAIN, AND THE MOVEMENT WAS ALL CAIADO'S. He fell for the third day running in both books: presidential from 1.35% to 1.25%, and ${G('first round', 'primeiro-turno')} third place from 31.00% to 25.50%. In that book alone that is 10.00pp in three days, from 33.50% on Aug 6. Zema fell 0.10pp, to 0.45%, and moved back BELOW the 0.5% cut the panel uses to separate price from noise, having stayed above it for a single day. Haddad remains at 0.05%. In the polling nothing changed: Caiado with 4% at Quaest and 5.7% at Ideia, Renan Santos with 4% and 4.7%, Zema with 2% and 2.6%. The three together are worth 1.75% in the winner contract, against 26.95% for the runner-up, and that proportion shrank again.`,

  'cards.sentimento.polymarket':
    `Prices from the Aug 9 reading, at 17:34 UTC: Lula 63.50% (vol USD 8.18M cumulative), Flávio 26.95% (vol USD 8.09M), Renan Santos 7.80% (vol USD 9.27M), Caiado 1.25% (vol USD 5.60M), Zema 0.45% (vol USD 5.02M), Haddad 0.05%, STF impeachment 3.60% (vol USD 83 thousand). Total volume of the presidential book at USD 121.32M. Lula's gap over Flávio at +36.55pp, against +37.55pp yesterday, and the narrowing came only from the leader's fall. AFOS only publishes a price that two independent readings confirm, taken eight minutes apart, and the one that counts is always the most recent. IN THE PLACEMENT BOOKS: in the runner-up one, Flávio stopped at 81.50%, and Renan Santos opened up over Lula, with 8.25% against 6.75%, a 1.50pp distance when yesterday it was 0.10pp. In the third place one, Renan Santos JUMPED to 64.50% and Caiado fell to 25.50%. In the Senate, the ${G('PL', 'pl')} rose to 74.50% (vol USD 259 thousand).`,

  'cards.inss.text1':
    `The earmarks axis had no fresh decision today. What still stands is Dino's order for the ${G('PF', 'pf')} to investigate evidence of crime in R$ 55.4 million of Pix earmarks flagged by a TCU audit, and the list reaches both sides of the race.`,

  'cards.inss.text2':
    `THE LIST HAS THREE NAMES THAT MATTER FOR THIS PANEL, AND CITING ONLY ONE WOULD BE PICKING A SIDE. Alfredo Gaspar, Flávio Bolsonaro's running mate, with R$ 6.2 million sent to São José da Laje, in Alagoas, that the audit could not trace. Hugo Motta, president of the Chamber. And Rogério Carvalho, former ${G('PT', 'pt')} leader in the Senate. Six other federal deputies, two senators and four former lawmakers also appear.`,

  'cards.inss.text3':
    `TODAY'S COVERAGE OF THE AXIS IS ANALYSIS, NOT A FRESH FACT, and the panel records it as such. Pieces came out about how easily money can be diverted in the design of the Pix earmark and about the volume of mentions of the president's son's case on social media, with 397.3 thousand in one week according to a survey published on Aug 9. None of them reports a decision, an indictment or a fresh charge.`,

  'cards.inss.text4':
    `TWO HIGH-IMPACT STORIES WERE VERIFIED AND DID NOT GO IN. The first, about Moraes referring the matter to the PGR after Flávio failed to appear at the ${G('PF', 'pf')}, circulated on the aggregators today, but the EVENT is from July: the hearing was set for Jul 28 and the primary articles are from July. The second, about the advance of the investigations against the president's son at the ${G('STF', 'stf')}, has a single source. The panel requires two independent sources for a high-impact event, and neither cleared that bar today.`,

  'cards.inss.impactoLula':
    `His son's case remains the most cited vector of damage, and today it appeared through the volume of mentions on social media, not through a procedural act. The ${G('PT', 'pt')} had already petitioned the ${G('STF', 'stf')} demanding an inquiry into the leak of audio to his rival, which turns the episode into a procedural dispute before any outcome. In the price, the day brought a 1.00pp fall in his contract, without any of the pieces published today carrying a fact capable of explaining the fall, and the panel does not assign a cause.`,

  'cards.inss.impactoGestao':
    `Approval is still measured at 48% against 47% in the Aug 5 ${G('Genial/Quaest', 'quaest')}, and at 37% excellent or good against 43% poor or terrible in the Aug 3 BTG/Nexus. The two houses measure the administration differently and the panel records both without arbitrating, because the valid comparison is of each house with itself. Neither has been updated since.`,

  'cards.inss.conclusao':
    `With 56 days to the election, the price moved and the polling is still standing still. The gap went to +36.55pp, the seventh day of falls in eight since Aug 1, and this time the narrowing came only from the leader's fall, with the runner-up motionless for the third day. In the placement books yesterday's reading was inverted: the transfer between Renan Santos and Caiado in the third place contract, which had stopped yesterday, came back in an almost exact mirror. THE TEST STARTS TOMORROW: THREE national polls are registered for Aug 10, among them Palver with n=5,000, plus two on Aug 11 and one on Aug 13. That is six in four days, and none has a result yet.`,

  'cards.bancoMaster.text1':
    `The Master case had no fact of its own today. The latest record remains the liquidation of Daniel Vorcaro's holding company in the Cayman Islands, reported on Aug 7 and Aug 8, with the liquidator advancing in the search for assets and obtaining a sweep of apartments in the United States.`,

  'cards.bancoMaster.text2':
    `The institutional friction between the Federal Police and André Mendonça, rapporteur of the inquiry, has no fresh development. The record that reduces the alarm still holds: officers heard by the press on Aug 8 say the environment turned hostile and that even so they see no risk to the investigations. The justice minister is trying to mediate.`,

  'cards.bancoMaster.text3':
    `THE SPECIFIC QUERY FOR MASTER, VORCARO, STF, INSS AND CPI CAME BACK EMPTY TODAY, and that was checked before it became a claim. The subject appears in two items from other feeds, one of them the Cayman Islands liquidation itself, already recorded yesterday. In other words it is a day without news on that axis and not a reading failure, and the panel notes the difference instead of treating the two as the same thing. Jaques Wagner's testimony to the ${G('PF', 'pf')} remains postponed and the writ of mandamus on the CPI is still undecided.`,

  'cards.bancoMaster.conclusao':
    `The contract on the impeachment of an ${G('STF', 'stf')} justice ROSE 0.50pp, to 3.60% (vol USD 83 thousand), in the Aug 9 reading at 17:34 UTC, the first change after two days flat at 3.10%. It is the thinnest contract among those the panel publishes, with cumulative volume that does not reach a thousandth of the presidential book. On a day with no fresh judicial decision, the price moved; yesterday, on a day with the judiciary on four fronts, it stood still. The panel records both side by side precisely because the sequence shows that movement in this contract does not track the news cycle, and it draws no conclusion from it.`,

  'cards.stf.toffoli':
    `Toffoli still has no fresh individual act captured this Sunday.`,

  'cards.stf.moraes':
    `No fresh act this Sunday. The meeting between Lula and Alcolumbre at his home, recorded on Aug 4, returned to the opinion pages. A story about him referring to the PGR the absence of Flávio Bolsonaro at the ${G('PF', 'pf')} circulated on the aggregators today, but the event is from July and the panel does not record it as a fact of the day.`,

  'cards.stf.gilmar':
    `No fresh act this Sunday. What still stands is the Aug 7 record, when he said he does not know Alfredo Gaspar, Flávio Bolsonaro's running mate, and his proposed binding precedent to block ${G('pauta-bomba', 'pauta-bomba')} bills, which other justices have signalled support for.`,

  'cards.stf.dino':
    `No fresh act this Sunday. What still stands is the Aug 8 order for the ${G('PF', 'pf')} to investigate evidence of crime in R$ 55.4 million of Pix earmarks flagged by the TCU, with Flávio Bolsonaro's running mate, the president of the Chamber and a former ${G('PT', 'pt')} leader in the Senate on the same list, plus six other deputies, two senators and four former lawmakers.`,

  'cards.stf.mendonca':
    `No fresh act this Sunday. A survey published today points to him leading the granting of habeas corpus in the first half of the year, which is profile data and not an act of the day. He remains rapporteur of the Master case inquiry, and vice-president of the ${G('TSE', 'tse')}, in which capacity he ordered on Aug 8 the delivery of data on a ${G('PT', 'pt')} meeting and on the Porta-Vozes de Lula project.`,

  'cards.stf.nexo':
    `The thread of this Sunday is the ABSENCE of any fresh judicial act, on a day when the price moved. None of the five justices tracked took a new decision, and the news on the axis was analysis and profile: the design of the Pix earmark, the volume of mentions of the president's son's case on social media, the habeas corpus ranking. In parallel, the impeachment contract ROSE 0.50pp and the leader's presidential contract FELL 1.00pp. The panel does not connect one to the other, because there is no event to connect, and it records that the day's price movement has no identifiable judicial trigger.`,

  'cards.stf.analise':
    `THE IMPEACHMENT CONTRACT ROSE 0.50pp, to 3.60% (vol USD 83 thousand), the first change after two days at 3.10%. The sequence of the two days is the record that matters and it rules out an easy reading: YESTERDAY, with the judiciary appearing on four distinct fronts, the price did not move; TODAY, with no fresh decision at all, it rose. With USD 83 thousand cumulative, this is the thinnest contract among those the panel publishes, and a 0.50pp change in it costs less money than any other in the panel. The caveat is repeated on purpose, because it is the last place anyone should look for confirmation of a political thesis.`,
})
