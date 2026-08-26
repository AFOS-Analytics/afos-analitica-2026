/**
 * Mapa EN de 26/Ago/2026 para os três JSONs do painel do Brasil.
 * Convenções EN: PONTO decimal e VÍRGULA de milhar.
 * ⛔ `updatedAt` e `lastUpdate` NÃO se traduzem: ficam iguais ao pt-BR.
 * 🏷️ `pesquisa` é `poll`, nunca `research`; `urna` é `polling`, nunca `exit poll`.
 */
import { construir } from '../build-locale-json'

const G = (termo: string, id: string) => `[${termo}](/en/glossary#${id})`
const S = 'confirmed reading of Aug 26, 3:19 PM BRT (6:19 PM UTC)'

// ─────────────────────────────────────────────── analysis-data
construir('analysis-data', 'en', {
  'cards.sentimento.text1':
    `The presidential book has accumulated USD 133.35M and the price on this page comes from the ${S}. The day brought TWO new national polls, Gerp and Indexa/Broadcast, and they reached opposite results on the same contest.`,
  'cards.sentimento.text2':
    `On price, the leader stood still at 62.50% for the third straight day and the runner-up rose 0.90pp, to 35.55%. The distance between the two narrowed to 26.95pp, the tightest since Jun 21, checked in the database backup against the full record since Apr 14. It narrowed from one side only, because the one who moved was the runner-up.`,
  'cards.sentimento.text3':
    `The largest move of the day is not in the winner contract. It is in the third-place contract for the ${G('first round', 'primeiro-turno')}, where Renan Santos gave up 6.00pp to 45.50% and Ronaldo Caiado gave up 3.00pp to 39.00%. Both fell and the gap between them shrank from 9.50pp to 6.50pp. On Wednesday Lula filed with the TSE against both over attacks in the debate, and the two new polls disagreed on which of them is third in the polling. The panel records the coincidence of dates and does not assign a cause.`,
  'cards.sentimento.direita':
    `Flávio Bolsonaro at 35.55% in the presidential book, up 0.90pp, the largest move of the day among the winner contracts, and his highest level since May 13. In the second-place contract for the first round he stood still at 87.50%. In the polling, Gerp puts him ahead in the first round with 38% against 37%, and Indexa puts him behind with 34% against 39%.`,
  'cards.sentimento.esquerda':
    `Lula at 62.50%, unchanged for the third straight day. In the polling, both new polls put him below the 41% of ${G('BTG/Nexus', 'nexus-btg')} of Aug 24: 39% at Indexa, with a five-point lead, and 37% at Gerp, one point behind. Government approval comes out negative in both, at 46% against 50% at Indexa and 43% against 51% at Gerp.`,
  'cards.sentimento.terceiraVia':
    `Here is the move of the day. Renan Santos gave up 6.00pp in the third-place contract and went to 45.50%, while Ronaldo Caiado gave up 3.00pp and went to 39.00%. Both fell, and even so the distance between them shrank from 9.50pp to 6.50pp. In the polling the two houses out today disagree about them: Indexa puts Caiado ahead by 5% to 4% and Gerp has them tied at 3%.`,
  'cards.sentimento.polymarket':
    `Prices from the ${S}. AFOS only publishes a price that two independent readings, taken eight minutes apart, confirm within 0.20pp. Names below 0.5% fall outside that watch, because in a thin book the swing does not separate movement from noise.`,
  'cards.inss.text1':
    `⭐ THE NEW FACT OF Aug 26 IS INVESTIGATIVE AND ARRIVES THROUGH THE GOVERNMENT'S FAMILY FLANK. The Federal Police say a lobbyist asked for action from Lulinha to close deals between the so-called Careca do INSS and the government, according to Folha de S.Paulo. The inquiry points to three failed attempts to land a contract at the Health Ministry, according to O Globo.`,
  'cards.inss.text2':
    `The courts denied Lulinha's request to take down the video in which Flávio Bolsonaro discusses the suspected diversions at the INSS, according to O Globo, and Lula decided to harden his tone on the suspicions surrounding his son, in an attempt to keep the electoral damage at a distance.`,
  'cards.inss.text3':
    `The distinction the panel has kept from the start still holds: the effect on how the government is rated is one thing, the effect on voting intention is another, and the two do not move together by default. On Wednesday the case gained a third layer, the campaign one: Renan Santos wants to press the Lulinha case in the Jornal Nacional interview, according to Folha de S.Paulo.`,
  'cards.inss.text4':
    `⚠️ The case is still live and without an outcome. On the same day the Federal Police launched an operation against benefit fraud with estimated losses of R$ 86 million, and the courts released R$ 2.7 billion to pay INSS arrears. These are facts of different natures and the panel does not add them up.`,
  'cards.inss.impactoLula':
    `Not isolable, and today there are fresh numbers to say so. The two national polls released on Wednesday measure him at 37% and 39% in the first round, against 41% at BTG/Nexus of Aug 24, and all three have fieldwork in overlapping windows. The difference between institutes is larger than any effect one could pin on the case.`,
  'cards.inss.impactoGestao':
    `The rating remains net negative and now across three readings: 46% approval against 50% disapproval at Indexa, 43% against 51% at Gerp, and 48% against 49% at BTG/Nexus of Aug 24. All three agree on the sign and disagree on the size, with five points of spread between them.`,
  'cards.inss.conclusao':
    `On Aug 26 the case advances through police work and through a court decision, and it enters the electoral calendar by a third route, the televised interview. The panel records the advance and does not convert it into a vote forecast: the distance between the day's two polls is ten points, and no case effect is separable inside a spread that size.`,
  'cards.bancoMaster.text1':
    `⭐ THE NEW FACT OF Aug 26 IS A DEPOSITION. Daniel Vorcaro will testify to the Federal Police in the inquiry into the Master fraud, according to O Globo. On the same day the police carried out a search at a municipal pension institute in Campo Grande over money it placed with the bank.`,
  'cards.bancoMaster.text2':
    `⚠️ The Dark Horse case at the Supreme Court involves suspicions about Vorcaro's spending and about parliamentary earmarks, according to O Globo. Ronaldo Caiado on Wednesday asked for the secrecy on the Master-linked cases to be lifted and defended the possibility of impeaching Supreme Court justices.`,
  'cards.bancoMaster.text3':
    `The panel separates the layers on purpose. A deposition is an act of investigation, a search at a municipal pension fund is another fact, and the electoral use of the subject is a third. On Wednesday the three appeared together: Tarcísio de Freitas said Flávio Bolsonaro had already explained his dealings with Vorcaro, and PT supporters began circulating a jingle tying the case to the senator's name.`,
  'cards.bancoMaster.conclusao':
    `⭐ AND HERE IS THE DAY'S CROSS-READING, because this time the one tying the case to the polling is the institute doing the measuring. The CEO of Indexa told Estadão that Flávio Bolsonaro has been winning voters back since the Master case. On the same day his price rose 0.90pp, to the highest level since May 13, and the case returned to the news through a deposition and a police operation. The panel records both side by side and does not decide which explains the other.`,
  'cards.stf.toffoli': `No new individual act captured on Aug 26.`,
  'cards.stf.moraes':
    `No new individual act on the merits on Aug 26. He appears in the coverage over a routine authorisation, allowing a private tutor into Jair Bolsonaro's home to teach the former president's daughter, and in press analysis of his position after the Jan 8 trial.`,
  'cards.stf.gilmar': `No new individual act captured on Aug 26.`,
  'cards.stf.dino':
    `No new individual act on Aug 26. His ruling on parliamentary earmarks, which was Tuesday's relevant act, keeps producing effects in Wednesday's coverage, now entangled with the Dark Horse case, which involves suspicions about Vorcaro's spending and about earmarks.`,
  'cards.stf.mendonca':
    `⭐ HE IS THE NAME OF THE DAY AT THE COURT, on three separate fronts. He proposed to the TSE a test for defining what counts as a deepfake in the election. He said a Supreme Court justice has a good salary but does not live free of financial worries. And he sits at the centre of a standoff with the Federal Police, with the solicitor general under pressure and a risk that an appeal opens the door to a nullity, according to O Globo. A tally shows he is the justice who least often votes in favour of Lula's campaign at the TSE.`,
  'cards.stf.nexo':
    `⭐ TODAY'S LINK IS ELECTORAL, NOT BUDGETARY. The deepfake test proposed to the TSE aims straight at the campaign under way, and the same court received on Wednesday Lula's filing against Renan Santos and Ronaldo Caiado over attacks in the debate. The Supreme Court appears today less as a source of fiscal risk and more as the referee of what may circulate in the contest.`,
  'cards.stf.analise':
    `The contract on a Supreme Court justice leaving by impeachment before 2027 sits at 3.40% (vol USD 84,000), unchanged in the ${S}. That is the third straight day at the same level. On Wednesday a presidential candidate publicly defended the possibility of impeaching justices and asked for secrecy to be lifted on Master-linked cases, and even so the price did not move. That book is small, so the panel does not read the absence of movement as an answer to anything: it reads it as an absence of trading.`,
})

// ─────────────────────────────────────────────── analysis-criteriosa
construir('analysis-criteriosa', 'en', {
  'subtitle':
    `Cross-reading of Aug 26, 2026: Polymarket price from the ${S}, presidential book at USD 133.35M, against TWO new national polls released today that contradict each other, Gerp (BR-03547/2026, fieldwork Aug 21 to 25, n=2,400) and Indexa/Broadcast (BR-06366/2026, fieldwork Aug 20 to 23, n=2,000), plus BTG/Nexus of Aug 24 (BR-09028/2026, n=2,006), which remains the most reliable in the window on the house ruler. News drawn from 1,091 items collected on Wednesday.`,
  'candidates[0].header':
    `PRICE: 62.50% (vol USD 9.03M accumulated), ${S}. No change on the day, THIRD straight day flat. His distance to the runner-up narrowed to 26.95pp, the tightest since Jun 21.`,
  'candidates[0].fortes[0]':
    `Indexa/Broadcast of today (n=2,000, telephone, fieldwork Aug 20 to 23, BR-06366/2026) puts him at 39% in the first round against 34% for the runner-up, and has him winning ALL FOUR runoff scenarios tested: 46% to 41% against Flávio, 45% to 34% against Zema, 44% to 38% against Caiado and 46% to 34% against Renan Santos.`,
  'candidates[0].fortes[1]':
    `BTG/Nexus of Aug 24, the most reliable in the window, keeps him at 41% in the first round without Marçal and winning the runoff 46% to 45%.`,
  'candidates[0].fortes[2]':
    `The price stays at 62.50% for a third day, and the market still pays close to two to one in his favour. The series high is 67.50%, of Aug 16, checked in the backup against the full record since Apr 14.`,
  'candidates[0].fortes[3]':
    `He confirmed the Jornal Nacional interview for Aug 27, according to Valor Econômico and Poder360, after skipping the Band debate on Aug 23.`,
  'candidates[0].fortes[4]':
    `On Wednesday he filed with the TSE against Renan Santos and Ronaldo Caiado over attacks in the debate, asking for posts to be taken down, according to Folha de S.Paulo. On the same day both gave ground in the third-place contract, and the panel records the coincidence of dates without assigning a cause.`,
  'candidates[0].fracos[0]':
    `⚠️ Gerp today puts him BEHIND for the first time in the panel's table: 37% against 38% in the first round, inside the 2pp margin, and losing the runoff 42% to 47%. The only other reading in which he was not ahead is Gerp's own poll of Aug 11, which showed a 38 to 38 tie.`,
  'candidates[0].fracos[1]':
    `BOTH of today's national polls put him below the 41% of BTG/Nexus: 37% at Gerp and 39% at Indexa. The floor of his 30-day range fell from 38% to 37% because of that.`,
  'candidates[0].fracos[2]':
    `Government approval sits in negative ground at both new houses: 46% against 50% at Indexa, according to Estadão and CNN Brasil, and 43% against 51% at Gerp, according to CNN Brasil and Diário de São Paulo.`,
  'candidates[0].fracos[3]':
    `His distance to the runner-up on price is the tightest since Jun 21, and it narrowed without him giving up anything: the one who moved was the other side.`,
  'candidates[0].fracos[4]':
    `⚠️ The INSS case returned to the news through the family flank: the Federal Police say a lobbyist asked for action from Lulinha to close deals between the so-called Careca do INSS and the government, and the inquiry points to three failed attempts at a Health Ministry contract, according to Folha de S.Paulo and O Globo. The courts denied Lulinha's request to take down the video in which Flávio discusses the suspicions.`,
  'candidates[0].analise':
    `The day delivers the cleanest case of the year for the house thesis, and it is not between market and polling: it is between two polls. Gerp and Indexa measured the same contest, in the same week, with overlapping fieldwork windows, and arrived at opposite results in the runoff, one showing the leader losing by 5 and the other showing the leader winning by 5. That is ten points between institutes, with no days in between to explain it. The panel publishes both and does not average them, because averaging readings that invert hides exactly what is informative. On price the move came from one side only: he is flat at 62.50% for a third day and the distance to the runner-up fell to 26.95pp, the tightest since Jun 21. Probability of winning and voting intention measure different things, and the panel does not subtract one from the other.`,
  'candidates[1].header':
    `PRICE: 35.55% (vol USD 8.94M accumulated), ${S}. Up 0.90pp, the largest move of the day among the winner contracts, and his highest level since May 13.`,
  'candidates[1].fortes[0]':
    `⭐ Gerp today (n=2,400, fieldwork Aug 21 to 25, BR-03547/2026) puts him AHEAD in the first round for the first time in the panel's table, with 38% against 37%, and winning the runoff 47% to 42%.`,
  'candidates[1].fortes[1]':
    `The price rose 0.90pp and reached 35.55%, the highest since May 13. Checked in the database backup: no point between that date and today came in above this. The series high is 45.50%, of May 6.`,
  'candidates[1].fortes[2]':
    `In the second-place contract for the first round he stays at 87.50%, unchanged. The market is sure he is the runner-up and is arguing only about what that is worth against the leader.`,
  'candidates[1].fortes[3]':
    `The CEO of Indexa told Estadão that he has been winning voters back since the Master case, and it is the measuring house itself tying the polling move to the case.`,
  'candidates[1].fortes[4]':
    `Comparing Gerp with itself, the runoff distance went from 2 points (45% to 43% in the Aug 11 round, BR-08045/2026) to 5 points now.`,
  'candidates[1].fracos[0]':
    `⚠️ Indexa today puts him at 34% in the scenario without Pablo Marçal and 33% in the one with him, losing the runoff 41% to 46%. The day's two national polls disagree on who wins, and the difference between them is ten points.`,
  'candidates[1].fracos[1]':
    `The Master case came back hard on Wednesday: Daniel Vorcaro will testify to the Federal Police in the fraud inquiry, the police searched a municipal pension institute in Campo Grande over money placed with the bank, and the Dark Horse case at the Supreme Court involves suspicions about Vorcaro's spending and about earmarks, according to O Globo.`,
  'candidates[1].fracos[2]':
    `PT supporters began circulating a jingle tying Vorcaro, the United States and the salary-kickback affair together to attack him, according to O Globo, which shows the subject has entered the other side's campaign repertoire.`,
  'candidates[1].fracos[3]':
    `BTG/Nexus of Aug 24, the most reliable in the window, keeps him at 37% and has him losing the runoff 45% to 46%.`,
  'candidates[1].fracos[4]':
    `His 30-day range stays wide, from 28.7% to 40%, and that spread between institutes is larger than the price move over the same period.`,
  'candidates[1].analise':
    `He was the name that moved on the day, and in both instruments at once. On price, up 0.90pp to 35.55%, the highest level since May 13. In the polling, one of the two new national polls puts him ahead of the leader for the first time since the panel has kept this table. Both point the same way, and it is rare for them to point together. The caveat that comes with it is the same size: the day's other national poll, with overlapping fieldwork, has him losing the runoff by five, and the Master case returned to the news on the very Wednesday the price rose. The CEO of Indexa credits his recovery precisely to the case leaving the centre of the news cycle, and the day showed the opposite of that.`,
  'candidates[2].header':
    `PRICE: 2.75% (vol USD 11.23M accumulated), ${S}. Down 0.20pp in the winner contract. 🔴 In the third-place contract for the first round the loss is 6.00pp, the largest move on the panel this Wednesday.`,
  'candidates[2].fortes[0]':
    `He stays ahead of Ronaldo Caiado in the third-place contract, at 45.50% against 39.00%.`,
  'candidates[2].fortes[1]':
    `Indexa measures him at 4% in the first round, the highest figure he gets among the three national polls in the window.`,
  'candidates[2].fortes[2]':
    `The accumulated volume of his contract in the presidential book is USD 11.23M, the second largest among the names tracked, which describes a market with plenty of people trading the hypothesis.`,
  'candidates[2].fortes[3]':
    `He wants to press the Lulinha case in the Jornal Nacional interview, according to Folha de S.Paulo, and the subject is live in Wednesday's news.`,
  'candidates[2].fracos[0]':
    `🔴 He gave up 6.00pp in the third-place contract, from 51.50% to 45.50%, the largest move on the panel today. His gap to Caiado in that contract fell from 9.50pp to 6.50pp, and this time both gave ground, with him falling twice as much.`,
  'candidates[2].fracos[1]':
    `In the winner contract he gave up 0.20pp and sits at 2.75%.`,
  'candidates[2].fracos[2]':
    `Gerp measures him at 3%, tied with Caiado, and BTG/Nexus of Aug 24 also had him at 3%, behind Caiado's 5%. The two houses out today disagree on who is third in the polling.`,
  'candidates[2].fracos[3]':
    `Lula filed with the TSE against him and against Caiado over attacks in the debate, asking for posts to be taken down, according to Folha de S.Paulo.`,
  'candidates[2].analise':
    `The largest move of the whole day is not in the winner contract, it is in the third-place one, and it is his. A 6.00pp fall in a single day in a contract that size is large, and it came alongside a smaller fall by his direct rival, which shortened the gap between them instead of widening it. In the polling nothing changed level: the three national polls in the window put him between 3% and 4%. It is the kind of day when the price moves more than declared intention, and the panel records both without picking which one is right.`,
  'candidates[3].header':
    `Back of the pack in the ${S}. Ronaldo Caiado gave up 0.10pp and sits at 0.45%, below the 0.5% floor the double reading watches. Romeu Zema gave up 0.10pp and sits at 0.15%. Fernando Haddad stays at 0.05%.`,
  'candidates[3].subtitle':
    `Back of the pack in the ${S}. All three sit below the 0.5% floor at which the double reading separates movement from noise, so the panel treats none of their swings as a signal.`,
  'candidates[3].caiado.label':
    `CAIADO (PSD), presidential Poly 0.45% (vol USD 6.59M accumulated, ${S}), down 0.10pp. In the third-place contract for the first round he gave up 3.00pp and sits at 39.00%, 6.50pp behind Renan Santos.`,
  'candidates[3].caiado.fortes':
    `Indexa today measures him at 5% in the first round, ahead of Renan Santos, and has him losing the runoff to Lula 38% to 44%, the closest of the four scenarios the house tested after the one with Flávio. Even giving up 3.00pp in the third-place contract, he SHORTENED the distance to Renan Santos, because the other fell twice as much. On Wednesday he defended the possibility of impeaching Supreme Court justices and asked for secrecy to be lifted on the Master-linked cases, according to O Globo, and was interviewed by O Globo, CBN and Valor.`,
  'candidates[3].caiado.fracos':
    `Gerp measures him at 3%, tied with Renan Santos, against 5% at Indexa and 5% at BTG/Nexus. He gave up 0.10pp in the winner contract and sits at 0.45%, below the watch floor. Lula filed with the TSE against him and against Renan Santos over attacks in the debate.`,
  'candidates[3].zema.label':
    `ZEMA (Novo), presidential Poly 0.15% (vol USD 5.99M accumulated, ${S}), down 0.10pp.`,
  'candidates[3].zema.fortes':
    `He is still tested by the national polls, unlike Tarcísio and Haddad. Indexa has him losing the runoff to Lula 34% to 45%.`,
  'candidates[3].zema.fracos':
    `Both of today's national polls measure him at 1%, against 3% at BTG/Nexus of Aug 24, and the floor of his 30-day range fell from 1.3% to 1% because of that.`,
  'candidates[3].haddad.label':
    `HADDAD (PT), presidential Poly 0.05% (vol USD 7.30M accumulated, ${S}), unchanged.`,
  'candidates[3].haddad.fortes':
    `The JOTA poll released on Wednesday (BR-07806/2026, 6,000 interviews online, fieldwork Jul 27 to Aug 24) tested a runoff scenario with him in Lula's place against Flávio Bolsonaro.`,
  'candidates[3].haddad.fracos':
    `No national poll tests him in the first round for president, so he does not enter the divergence graph, by design. And the figures from the JOTA scenario did not come out in a form the panel could check against a source, so nothing from it went into the table.`,
  'candidates[3].analise':
    `All three remain below the 0.5% floor in the winner contract, and what moves for them today is the third-place contract, where Caiado gave up 3.00pp and still closed on Renan Santos. In the polling the picture is different: the two national polls out today disagree on who is third, with Indexa putting Caiado ahead 5% to 4% and Gerp showing a 3% tie. That is exactly the pair the third-place contract prices, and it moved on the day the two houses disagreed about it.`,
  'quadroComparativo[0].p':
    `TWO NEW NATIONAL POLLS AND THEY DISAGREE. Gerp (n=2,400, fieldwork Aug 21 to 25) puts him at 37% in the first round, BEHIND by 1 point, and losing the runoff 42% to 47%. Indexa (n=2,000, fieldwork Aug 20 to 23) puts him at 39%, ahead by 5, and winning the runoff 46% to 41%. BTG/Nexus of Aug 24, the most reliable, keeps him at 41%.`,
  'quadroComparativo[0].m':
    `62.50% (vol USD 9.03M), ${S}. Unchanged, third straight day flat. The series high is 67.50%, of Aug 16.`,
  'quadroComparativo[0].t': `flat for a third day, and the gap to the runner-up is the tightest since Jun 21`,
  'quadroComparativo[0].s':
    `Eighth day of the official campaign, 42 days from the first round. Jornal Nacional interview set for Aug 27. On Wednesday he filed with the TSE against Renan Santos and Caiado over attacks in the debate.`,
  'quadroComparativo[1].p':
    `Gerp puts him at 38% in the first round, AHEAD for the first time in the panel's table, and winning the runoff 47% to 42%. Indexa puts him at 34% without Marçal and 33% with him, losing the runoff 41% to 46%. BTG/Nexus of Aug 24 keeps him at 37%.`,
  'quadroComparativo[1].m':
    `35.55% (vol USD 8.94M), ${S}. Up 0.90pp, the largest of the day among the winner contracts, and his highest level since May 13. In the second-place contract he stayed flat at 87.50%.`,
  'quadroComparativo[1].t': `the largest rise of the day, and his highest price since May 13`,
  'quadroComparativo[1].s':
    `Vorcaro will testify to the Federal Police in the Master fraud inquiry, and the CEO of Indexa told Estadão that he has been winning voters back since the case.`,
  'quadroComparativo[2].p':
    `Gerp puts him at 3% and Indexa at 4%. BTG/Nexus of Aug 24 had him at 3%, behind Caiado's 5%. The two houses out today disagree on who is third.`,
  'quadroComparativo[2].m':
    `2.75% (vol USD 11.23M), ${S}. Down 0.20pp in the winner contract and 6.00pp in the third-place one, to 45.50%, the largest move on the panel today.`,
  'quadroComparativo[2].t': `the largest fall of the day, and it is in the third-place contract`,
  'quadroComparativo[2].s':
    `Lula filed with the TSE against him over attacks in the debate. He wants to press the Lulinha case in the Jornal Nacional interview.`,
  'quadroComparativo[3].p':
    `Indexa puts him at 5%, ahead of Renan Santos, and losing the runoff to Lula 38% to 44%. Gerp puts him at 3%, tied with Renan.`,
  'quadroComparativo[3].m':
    `0.45% (vol USD 6.59M), ${S}. Down 0.10pp, below the 0.5% floor. In the third-place contract he gave up 3.00pp to 39.00% and still shortened the distance to Renan Santos.`,
  'quadroComparativo[3].t': `gives ground in both contracts and still closes on the third-placed name`,
  'quadroComparativo[3].s':
    `He defended the possibility of impeaching Supreme Court justices and asked for secrecy to be lifted on the Master-linked cases. He was interviewed by O Globo, CBN and Valor.`,
  'quadroComparativo[4].p':
    `Gerp measures him at 4% and Indexa at 2%, both in the same week. BTG/Nexus of Aug 24 measured him at 4%. He remains the name with the largest relative disagreement between institutes in the window.`,
  'quadroComparativo[4].m':
    `0.15% (vol USD 2.77M), ${S}. Unchanged, and below the 0.5% floor of the double reading.`,
  'quadroComparativo[4].t': `below the watch floor`,
  'quadroComparativo[4].s':
    `The scenario including him takes one point off the runner-up at Indexa and leaves the leader untouched.`,
  'quadroComparativo[5].p':
    `No polling. Market on the impeachment of a Supreme Court justice before 2027.`,
  'quadroComparativo[5].m':
    `3.40% (vol USD 84,000), ${S}. Unchanged on the day.`,
  'quadroComparativo[5].t': `flat`,
  'quadroComparativo[5].s':
    `Caiado defended the possibility of impeaching justices and asked for secrecy to be lifted on the Master-linked cases. Mendonça proposed to the TSE a test for defining what counts as a deepfake in the election, and is in a standoff with the Federal Police.`,
  'cruzamento':
    `Aug 26 delivers the cleanest case of the year for what AFOS measures, and it is not between market and polling: it is between two polls. Gerp and Indexa/Broadcast released national polls on the same day, with overlapping fieldwork windows, and reached opposite results. In the ${G('first round', 'primeiro-turno')} Gerp has 38% to 37% for Flávio Bolsonaro and Indexa has 39% to 34% for Lula. In the runoff Gerp has Flávio winning 47% to 42% and Indexa has Lula winning 46% to 41%. That is ten points between two houses on the same contest, with no days in between to explain the difference. The panel publishes both with the reliability ruler declared and does not average them, because averaging readings that invert erases what is informative about the day. The house ruler gives both a 3, and the most reliable national poll in the window is still BTG/Nexus of Aug 24, which keeps Lula at 41% and is the one feeding the polling side of the divergence graph. On price, the confirmed reading of Aug 26 at 3:19 PM BRT has the leader flat at 62.50% for a third straight day and the runner-up rising 0.90pp to 35.55%, his highest level since May 13. The distance between them fell to 26.95pp, the tightest since Jun 21, checked in the database backup against the full record since Apr 14. It narrowed from one side only, and that matters: the one who moved was the runner-up. The largest move of the day, however, is not in the winner contract. It is in the third-place contract for the first round, where Renan Santos gave up 6.00pp to 45.50% and Ronaldo Caiado gave up 3.00pp to 39.00%. Both fell and the gap between them shrank from 9.50pp to 6.50pp. On that same Wednesday Lula filed with the TSE against both over attacks in the debate, and the two new national polls disagreed on which of them is third in the polling, with Indexa putting Caiado ahead 5% to 4% and Gerp showing a 3% tie. The panel records the coincidence of dates and does not assign a cause. In the background, the Master case returned to the news with Daniel Vorcaro's scheduled deposition to the Federal Police and an operation over money placed by a municipal pension institute, while the INSS case advanced through the government's family flank. Government approval sits in negative ground at both new houses, 46% against 50% at Indexa and 43% against 51% at Gerp, with five points of spread between institutes on the same question in the same week. Probability of winning and voting intention measure different things, and the panel does not subtract one from the other.`,
})

// ─────────────────────────────────────────────── polls-data
construir('polls-data', 'en', {
  'polymarketComparison.note':
    `Polymarket prices from the ${S}, with the presidential book at USD 133.35M. ⭐ THE DAY BROUGHT TWO NEW NATIONAL POLLS AND THEY CONTRADICT EACH OTHER: Gerp (BR-03547/2026, fieldwork Aug 21 to 25, n=2,400) has Flávio ahead in the first round with 38% against 37%, and winning the runoff 47% to 42%; Indexa/Broadcast (BR-06366/2026, fieldwork Aug 20 to 23, n=2,000) has Lula ahead with 39% against 34%, and winning the runoff 46% to 41%. That is ten points between two houses on the same contest, with overlapping fieldwork windows, and the panel publishes both without averaging them. ⚖️ The POLLING side of this block stays on BTG/Nexus of Aug 24, which is the most reliable national poll on the house ruler, and not on either of today's two. The 30-day range was recalculated with them inside, and three floors gave way: Lula from 38% to 37%, Caiado from 3.1% to 3% and Zema from 1.3% to 1%. 📉 ON PRICE, THE DISTANCE BETWEEN THE TOP TWO NARROWED FROM 27.85pp TO 26.95pp, and it is the tightest since Jun 21, checked in the database backup against the series that begins on Apr 14. It narrowed from one side only: the leader is flat at 62.50% for a third straight day and the runner-up rose 0.90pp, to 35.55%, his highest level since May 13. ⭐ AND THE LARGEST MOVE OF THE DAY IS NOT IN THE WINNER CONTRACT: in the third-place contract for the first round, Renan Santos gave up 6.00pp to 45.50% and Ronaldo Caiado gave up 3.00pp to 39.00%. Both fell, and even so the gap between them shortened from 9.50pp to 6.50pp. On Wednesday Lula filed with the TSE against both over attacks in the debate, asking for posts to be taken down. The panel records the coincidence of dates and does not assign a cause. Probability of winning and voting intention measure different things, and the panel does not subtract one from the other.`,
  'polymarketComparison.sources':
    `Polymarket prices via the AFOS proxy, and the panel only publishes a price that two independent readings, taken eight minutes apart, confirm within 0.20pp. On Aug 26 there is a fresh confirmed reading for every contract covered, at 3:19 PM BRT (6:19 PM UTC): presidential, second place, third place, Senate and impeachment at the STF. Polls filed with the TSE and released by the institutes, as reported by G1, CNN Brasil, Folha de S.Paulo, Valor Econômico, Estadão, Poder360, VEJA, InfoMoney, UOL, O Globo, Correio Braziliense, Gazeta do Povo, Money Times and CartaCapital. The two national polls of Aug 26 were each checked against two sources, with the TSE registration number matching, and cross-checked against the Wikipedia table of 2026 presidential polls. Series superlatives checked in the Neon backup, under backup/neon/marketPrice, which holds the full record since Apr 14.`,
  'polymarketComparison.candidates[0].polymarket': `62.50%`,
  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `62.50% (vol USD 9.03M) in the ${S}, unchanged for the THIRD straight day. The series high is 67.50%, of Aug 16, checked in the backup against the full record since Apr 14. ⭐ His distance to the runner-up fell to 26.95pp, and it is the tightest since Jun 21: no point in the series after that date came in below this. And it narrowed without him giving up anything, because the one who moved was the other side.`,
  'polymarketComparison.candidates[0].tendenciaPesquisa':
    `TWO NEW NATIONAL POLLS TODAY, AND THEY DISAGREE ABOUT HIM. Gerp (BR-03547/2026, fieldwork Aug 21 to 25, n=2,400) puts him at 37% in the first round, one point behind Flávio, and losing the runoff 42% to 47%. Indexa/Broadcast (BR-06366/2026, fieldwork Aug 20 to 23, n=2,000) puts him at 39%, ahead by 5, and winning the runoff 46% to 41%. Both come in below the 41% of BTG/Nexus of Aug 24, which remains the most reliable national poll in the window and is the one feeding the figure in this block.`,
  'polymarketComparison.candidates[1].polymarket': `35.55%`,
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `35.55% (vol USD 8.94M) in the ${S}, up 0.90pp, the largest move of the day among the winner contracts. ⭐ It is his highest level since May 13, checked in the backup: no point between that date and today came in above this, and the series high is 45.50%, of May 6. In the second-place contract for the first round he stayed flat at 87.50%.`,
  'polymarketComparison.candidates[1].tendenciaPesquisa':
    `Today's two national polls measure him in opposite places. Gerp puts him at 38% in the first round, AHEAD of Lula for the first time in the panel's table, and winning the runoff 47% to 42%. Indexa puts him at 34% in the scenario without Pablo Marçal and 33% in the one with him, and losing the runoff 41% to 46%. BTG/Nexus of Aug 24, which feeds the figure in this block, keeps him at 37%. 📌 The CEO of Indexa told Estadão that he has been winning voters back since the Master case, and the price moved the same way this Wednesday.`,
  'polymarketComparison.candidates[2].polymarket': `2.75%`,
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `2.75% (vol USD 11.23M) in the ${S}, down 0.20pp. 🔴 In the third-place contract for the first round the loss is far larger: 6.00pp in one day, from 51.50% to 45.50%, the largest move on the panel this Wednesday. His gap to Caiado in that contract fell from 9.50pp to 6.50pp, and this time BOTH gave ground.`,
  'polymarketComparison.candidates[2].tendenciaPesquisa':
    `Gerp puts him at 3% and Indexa at 4%, against the 3% of BTG/Nexus of Aug 24. All three readings place him in the same narrow band, and none of them on its own explains the 6.00pp fall in the third-place contract.`,
  'polymarketComparison.candidates[3].polymarket': `0.45%`,
  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `0.45% (vol USD 6.59M) in the ${S}, down 0.10pp, below the 0.5% floor the double reading watches. In the third-place contract he gave up 3.00pp, from 42.00% to 39.00%, and even so SHORTENED the distance to Renan Santos, because the other fell twice as much.`,
  'polymarketComparison.candidates[3].tendenciaPesquisa':
    `Indexa puts him at 5%, ahead of Renan Santos, and Gerp puts him at 3%, tied with him. BTG/Nexus of Aug 24 kept him at 5%. The two houses out today disagree on who is third in the polling, and that is the pair the third-place contract prices.`,
  'polymarketComparison.candidates[4].polymarket': `0.15%`,
  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `0.15% (vol USD 2.77M) in the ${S}, unchanged. He sits below the 0.5% floor of the double reading, so the panel does not treat movement in that contract as a signal.`,
  'polymarketComparison.candidates[4].tendenciaPesquisa':
    `Gerp puts him at 4% and Indexa at 2%, and both measured in the same week. The disagreement about him remains the largest in relative terms in the window, and a price of 0.15% does not distinguish between 2% and 4% of declared intention.`,
  'polymarketComparison.candidates[5].polymarket': `0.05%`,
  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `0.05% (vol USD 14.06M) in the ${S}, unchanged. It is the largest accumulated volume in the presidential book and the lowest price among the names tracked, which describes a contract where many have already traded and the market now treats the hypothesis as closed.`,
  'polymarketComparison.candidates[5].tendenciaPesquisa':
    `No national poll tests him for president, including today's two. That is why he sits at 0% in this block and drops out of the graph, by design.`,
  'polymarketComparison.candidates[6].polymarket': `0.15%`,
  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `0.15% (vol USD 5.99M) in the ${S}, down 0.10pp, within the noise of a contract below the watch floor.`,
  'polymarketComparison.candidates[6].tendenciaPesquisa':
    `Gerp and Indexa each measure him at 1%, and BTG/Nexus of Aug 24 had him at 3%. The floor of the 30-day range fell to 1% because of today's two.`,
  'polymarketComparison.candidates[7].polymarket': `0.05%`,
  'polymarketComparison.candidates[7].tendenciaPolymarket':
    `0.05% (vol USD 7.30M) in the ${S}, unchanged.`,
  'polymarketComparison.candidates[7].tendenciaPesquisa':
    `No national poll tests him for president. The JOTA poll released today tested a runoff scenario with him in Lula's place, but its figures did not come out in a form the panel could check, so it does not enter the table.`,
  'approvalData.note':
    `🏷️ THE STRUCTURED FIGURES IN THIS BLOCK COME FROM GENIAL/QUAEST OF Aug 14, and they are: 46% approval against 48% disapproval, with 6% who do not know, and 36% excellent or good, 25% average and 37% poor or terrible. The panel keeps ONE house per block on purpose, so as not to add up rulers from different institutes. ⭐ TWO NEW NATIONAL POLLS ON Aug 26, declared here and NOT mixed into the figures above, and both measure the government in negative ground: Indexa/Broadcast has 46% approval against 50% disapproval, according to Estadão and CNN Brasil; Gerp has 43% against 51%, according to CNN Brasil and Diário de São Paulo. 📌 The previous reading, BTG/Nexus of Aug 24 (n=2,006, fieldwork Aug 21 to 23, BR-09028/2026), had 48% approval against 49% disapproval, and 35% excellent or good against 43% poor or terrible. ⚠️ THE THREE HOUSES AGREE ON THE SIGN AND DISAGREE ON THE SIZE: disapproval runs from 49% to 51% and approval from 43% to 48%, that is five points of spread between institutes on the same question in the same week. The panel does not average them.`,
})
