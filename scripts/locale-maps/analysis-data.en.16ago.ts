/**
 * Mapa EN de 16/Ago para analysis-data.json.
 * Convenções: ponto decimal e vírgula de milhar. R$ preservado, escala traduzida.
 */
import { construir } from '../build-locale-json'

const CAR = 'confirmed reading of Aug 16, 4:56 pm BRT (7:56 pm UTC)'

construir('analysis-data', 'en', {
  'cards.sentimento.text1':
    `49 days from the first round, the day is the FIRST OF THE OFFICIAL CAMPAIGN and the entire move sits in the price, because no new national poll came out. The leader rose 2.00pp and closed at 66.50%, a value that MATCHES the top of a 174-point series running since May 19, with no point above it. The runner-up rose 1.30pp and closed at 29.45%, a third straight day of gains. Even so the gap between them WIDENED, from 36.35pp to 37.05pp, because the first rose more.`,
  'cards.sentimento.text2':
    `⚠️ THE ORDER OF EVENTS IS PART OF THE INFORMATION AND THE PANEL STATES IT. The points that produced this rise were recorded at 5:01 am BRT, BEFORE any campaign rally of the day. In other words, the price moved going into the first day of campaigning, not in reaction to the rallies that followed. ⛔ No undue superlative: the 37.05pp gap is ordinary in the series, with 30 of the 89 days recording an equal or larger value and a peak of 41.80pp on Aug 1, and the runner-up's 29.45% sits below 4 of the 173 points, with a top of 33.20% on Jun 2.`,
  'cards.sentimento.text3':
    `⭐ IN THE POLLING THE NEWS IS ABOUT FIRMNESS, NOT LEVEL. The Quaest of Aug 14 remains the most recent, with 38% x 31% in the first round and 43% x 40% in the runoff. What appeared over the weekend was a crosstab of that same poll, released on Aug 15 by G1: among the leader's voters, 77% call the decision final and 22% say they could still change, and the least convinced electorate in the field belongs to the Novo party candidate. That measures the HARDNESS of the intention rather than its size, and it is a dimension the panel did not have until now.`,
  'cards.sentimento.direita':
    `The runner-up rose for a third straight day, 1.30pp, and closed at 29.45% (vol USD 8.34M cumulative). ⚠️ Even while rising, he ended up further from the leader, because the leader gained 2.00pp. He opened the campaign in Copacabana, and the rally was estimated at 8,900 people by the USP/Cebrap monitor, according to Estadão. 📌 That is the only crowd estimate published on the day, because his rival's rally had no measurement released, so no measured comparison exists between the two rallies. The governor of São Paulo opened his re-election campaign the same day without him present, according to O Globo. Nothing changed in the polling: the 31% and the 40% from the Quaest of Aug 14 still stand, with rejection at 54%, the highest in the field.`,
  'cards.sentimento.esquerda':
    `The leader rose 2.00pp, from 64.50% to 66.50% (vol USD 8.40M cumulative). ⭐ That value MATCHES THE TOP OF THE SERIES: among the 174 points recorded since May 19 none is higher, and the only other day at that level was Aug 1. ⛔ The panel says matches, not beats, because the series does not support the second word. He opened the campaign at the Vila Euclides stadium in São Bernardo do Campo, the ground of the metalworkers' assemblies of the late 1970s, according to Valor Econômico, and promised a Security Ministry, according to G1. In the polling the 38% and the 43% from the Quaest of Aug 14 still stand, with the 38% being the floor of the nine national polls since Aug 5.`,
  'cards.sentimento.terceiraVia':
    `🔴 The whole chasing pack fell in the victory price: its leader at 4.70% (down 2.45pp and a third straight lower close since the 8.00% close of Aug 11), Caiado at 0.60% (down 0.45pp), Zema at 0.15% and Haddad at 0.05%. ⭐ And here is the finding of the day, which is about CONTRACTS rather than levels: in the THIRD-PLACE contract the pack's leader still holds 53.00%, the highest probability in that book, and Caiado ROSE to 37.50%, against 31.00% at the Aug 12 close. In other words, both became more likely on PLACING and less likely on VICTORY, on the same day. ⛔ These are different questions and the panel does not add them together. All three opened their schedules: the university in downtown São Paulo, a mass and a motorcade in Goiás, and a mass in Montes Claros, according to O Globo, G1, Folha de S.Paulo and Valor Econômico.`,
  'cards.sentimento.polymarket':
    `NEW CONFIRMED READING ON AUG 16 for ALL tracked contracts, ${CAR}. Presidential: leader 66.50% (vol USD 8.40M) and runner-up 29.45% (vol USD 8.34M), with a gap of 37.05pp against 36.35pp on Aug 15. Chasing pack: 4.70%, 0.60%, 0.15% and 0.05%. First-round runner-up contract: 87.00% for the runner-up (vol USD 286 thousand). Third-place contract: 53.00% for the pack's leader and 37.50% for Caiado (vol USD 543 thousand in the book). Senate: PL at 77.50% and MDB at 16.10% (vol USD 294 thousand). Supreme Court impeachment: 3.40%, down 0.50pp, on volume of USD 84 thousand. Total volume of the presidential book: USD 124.32M.`,

  'cards.inss.text1':
    `⚠️ THERE IS NO NEW DEVELOPMENT IN THE PENSION-FRAUD CASE ON AUG 16. The day's collection returned no fresh article on the subject, and the panel records the absence instead of repeating an old fact as if it were today's. The last captured movement is from Aug 13, and it is a police matter, not a polling one: Carlos Lopes, head of an association accused of embezzlement and of paying bribes to politicians, was a fugitive, turned himself in to the Federal Police and was arrested. The story ran in G1, O Globo, Folha de S.Paulo and Estadão on that same Aug 13, with independent reporting.`,
  'cards.inss.text2':
    `Also on Aug 13, O Globo reported that FOUR PLEA DEALS in the case are stalled, awaiting a decision from the Federal Police and the Prosecutor General's Office. A stalled plea deal is not an approved one, and the panel records the state of the proceeding without anticipating what it may produce. Nothing in that picture changed between Aug 14 and Aug 16.`,
  'cards.inss.text3':
    `The distinction the panel has kept from the start still holds: one thing is the effect on the assessment of the administration, which is where administrative fraud usually shows up; another is the effect on voting intention, which no poll in the window isolates. No house tested the case as an explanatory variable.`,
  'cards.inss.text4':
    `The most recent government assessment is the Quaest of Aug 14, with 46% approval against 48% disapproval, a negative balance of 2pp inside the margin. It replaced as the reading in force the PoderData/Aya of Aug 13, which marked 43% against 50%. ⚠️ That is two houses in two days with 5 points of difference in the balance, and the panel does not pick between them.`,
  'cards.inss.impactoLula':
    `Not isolable. In the nine national polls since Aug 5 he leads or ties the first round in every one, between 38% and 44%, and none of them tests the pension case as a variable. The arrest of Aug 13 is a procedural fact and there is no measurement linking it to voting intention.`,
  'cards.inss.impactoGestao':
    `The government assessment still carries a negative balance across the houses in force, with sizes ranging between 2pp and 10pp negative. No cause is assigned here, because no poll in the window breaks the balance down by subject.`,
  'cards.inss.conclusao':
    `The case remains in the field of administration and policing, not of voting intention. The last movement is from Aug 13, with an arrest and the record of four stalled plea deals, both with outlet and date, and neither with a measured effect on the ballot. On Aug 16 there was no new development.`,

  'cards.bancoMaster.text1':
    `⭐ THE NEW DEVELOPMENT OF AUG 16 IS A REGULATORY CONSEQUENCE, not a ruling on the merits. Estadão reported that, following losses tied to Banco Master, 85% of pension schemes may now invest only in government bonds. It is the first time the panel records an effect of the case on the RULES governing other people's investments, rather than on the proceeding itself.`,
  'cards.bancoMaster.text2':
    `On Aug 15, Valor Econômico reported that the maker of a R$ 2 billion yacht once owned by Vorcaro was summoned to give testimony in the case. That is an evidentiary step, not a decision.`,
  'cards.bancoMaster.text3':
    `⚠️ The earlier movements still stand and all date from Aug 13: the fund manager who blew the whistle on the bank petitioned the Supreme Court to be included in the victim protection programme, according to O Globo; a Central Bank director told the Federal Police of a hostile environment and fear of leaks around the bank's liquidation, according to Folha de S.Paulo; and the judicial council removed the judge in the Banco Santos case who appears on a recording suggesting the heirs sell to Master, according to Estadão. None of these is a ruling on the conduct of the bank or its controllers.`,
  'cards.bancoMaster.conclusao':
    `On Aug 16 the case produced the first recorded effect on investment rules, with 85% of pension schemes restricted to government bonds according to Estadão, and it still carries no ruling on the merits and no measured effect on voting intention. The panel records the facts with outlet and date and does not turn them into forecasts.`,

  'cards.stf.toffoli': `No new individual act captured on Aug 16.`,
  'cards.stf.moraes':
    `No new individual act on Aug 16. VEJA reported on Sunday that the United States is considering imposing the Magnitsky Act against him again, attributing the information to another newspaper. ⚠️ The panel records the second-hand attribution and does not treat it as a confirmed fact, because there was no independent second source in the window.`,
  'cards.stf.gilmar':
    `No new individual act on Aug 16. The Aug 12 order still stands, in which he, Moraes, Dino and Zanin directed judges in seven courts to return payments deemed excessive, according to Folha de S.Paulo and Estadão.`,
  'cards.stf.dino':
    `No new judicial act on Aug 16. VEJA reported that he again pushed back on false information about the use of official cars. The Aug 15 decision suspending the conviction of Romero Jucá remains in the background, according to O Globo, with the caveat the panel already recorded: it is a single-justice ruling, pending confirmation by the First Panel, and the beneficiary is a pre-candidate for federal deputy for Roraima.`,
  'cards.stf.mendonca':
    `No new individual act on Aug 16. On Aug 15, O Globo published a piece on Messias's strategy to contain the friction between him and the Federal Police. It is analysis, not a judicial act.`,
  'cards.stf.nexo':
    `⭐ THE THREAD OF AUG 16 IS NEW AND IT CHANGES THE NATURE OF THIS SECTION: the court stopped being merely the object of judicial news and became a CAMPAIGN THEME on day one. The Novo party candidate opened his campaign criticising Supreme Court justices, according to Folha de S.Paulo and Valor Econômico. Estadão recorded that criticism of the court marked the start of the campaign, alongside appeals to women voters and talk of making peace with the United States. And G1 reported that the runner-up's strategy for the Senate race is built around confronting the court, while the leader's is built around governability. 📌 The panel records the shift without assigning it any effect on price, because no measurement in the window makes that link.`,
  'cards.stf.analise':
    `NEW CONFIRMED READING ON AUG 16 for the Supreme Court justice impeachment contract, ${CAR}. It stands at 3.40% on cumulative volume of USD 84 thousand, down 0.50pp against the 3.90% of the previous reading, from Aug 14. ⚠️ It remains the thinnest contract among those tracked by this panel, with volume three orders of magnitude below the presidential one, and any movement in it requires that caveat before any reading. ⛔ The panel does not link the fall to the court having become a campaign theme on the same day, because there is no measurement to support that bridge.`,
})
