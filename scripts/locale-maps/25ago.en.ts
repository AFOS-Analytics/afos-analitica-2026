/**
 * Mapa EN de 25/Ago/2026 para os três JSONs do painel do Brasil.
 * Convenções EN: PONTO decimal e VÍRGULA de milhar.
 * ⛔ `updatedAt` e `lastUpdate` NÃO se traduzem: ficam iguais ao pt-BR.
 * 🏷️ `pesquisa` é `poll`, nunca `research`; `urna` é `polling`, nunca `exit poll`.
 */
import { construir } from '../build-locale-json'

const STAMP = 'confirmed reading of Aug 25, 3:22 PM BRT (6:22 PM UTC)'
const NEXUS = 'BTG/Nexus of Aug 24 (n=2,006, field Aug 21 to 23, TSE registration BR-09028/2026)'

// ─────────────────────────────────────────────── analysis-data
construir('analysis-data', 'en', {
  'cards.sentimento.text1':
    `The presidential book has accumulated USD 132.88M and the price on this page is from the ${STAMP}. Lula stands at 62.50% (vol USD 8.97M accumulated) and Flávio Bolsonaro at 34.65% (vol USD 8.89M accumulated), with the distance between the two at 27.85pp.`,
  'cards.sentimento.text2':
    `The day had little movement in the main book and a lot in the third-place one. Lula stood still for a second straight day and Flávio Bolsonaro gave back 0.40pp, returning part of yesterday's 1.80pp rise. The distance between the two widened again, from 27.45pp to 27.85pp, and it widened without the leader gaining anything.`,
  'cards.sentimento.text3':
    `No superlative applies today, and that is the result of checking, not of a slow news day. The biggest move of the day, in the third-place contract, took the gap between Renan Santos and Ronaldo Caiado from 15.00pp to 9.50pp. Against the full series since Apr 14, checked in the database backup, the same book has already been at 3.5pp on Aug 22 at 7:30 PM, so 9.50pp is no floor at all. And there was no new national poll this Tuesday: the batch Quaest released today is entirely state-level.`,
  'cards.sentimento.direita':
    `Flávio Bolsonaro at 34.65% in the presidential book, down 0.40pp, and 87.50% in the first-round second-place contract, up 2.00pp. The two contracts moved in opposite directions on the same day: the market grew more convinced he reaches the runoff and slightly less convinced he wins. Partido Liberal remains at 77.50% in the contract for the largest Senate bench.`,
  'cards.sentimento.esquerda':
    `Lula at 62.50%, unchanged for a second straight day. In the first-round second-place contract he shows 8.05%, up 2.10pp, which is consistent with a market that still sees him finishing first. The most recent poll remains the ${NEXUS}, which puts him at 41% in the first round and ahead in the runoff by 46% to 45%.`,
  'cards.sentimento.terceiraVia':
    `This is where the day's movement is. Renan Santos gave back 2.50pp in the third-place contract and fell to 51.50%, while Ronaldo Caiado rose 3.00pp to 42.00%, the largest gain on the panel today. The gap fell from 15.00pp to 9.50pp. The polling has been saying the opposite of the price on this point, with Caiado at 5% and Renan Santos at 3%, and this Tuesday the price moved toward the polling without the contract's order flipping. In the presidential book both remain on the floor: 2.95% and 0.55%.`,
  'cards.sentimento.polymarket':
    `Prices from the ${STAMP}. AFOS only publishes a price that two independent readings, eight minutes apart, confirm within 0.20pp. Names below 0.5% fall outside that confirmation, because in a thin book the daily variation is noise: today that applies to Pablo Marçal, at 0.15%, Romeu Zema, at 0.25%, and Fernando Haddad, at 0.05%.`,

  'cards.inss.text1':
    `⭐ THE NEW FACT OF AUG 25 IS ABOUT ELECTORAL STRATEGY, not investigation. Folha de S.Paulo reports that the PT's strategy in Maranhão spares a senator named in the INSS fraud, to avoid further damage to Lula. It is the first time in the panel's window that the case appears shaping the assembly of a state ticket.`,
  'cards.inss.text2':
    `On Aug 24 the Federal Court of Accounts placed pension benefits on a high-risk list because of the INSS queue, according to O Globo. It is an external control action about how the agency is run, not about the fraudulent deductions.`,
  'cards.inss.text3':
    `The distinction this panel has kept from the start still holds: one thing is the effect on how the administration is judged, another is the effect on voting intention. They do not add up and do not cancel out, and the panel does not convert one into the other.`,
  'cards.inss.text4':
    `⚠️ The case is still alive in the courts and still without an outcome. Folha of Aug 25 reports that the investigation into the president's son points to three failed attempts to close a contract at the Health Ministry, and his lawyer sought a meeting with Justice André Mendonça and complained to the Federal Police director-general and to the Justice Minister, according to O Globo. These are stages of an inquiry, with no ruling on the merits.`,
  'cards.inss.impactoLula':
    `Not isolable. The ${NEXUS}, still the most recent national poll, puts him at 41% in the first round and ahead in the runoff by 46% to 45%, and in that same round he is the most rejected candidate, at 49% against 48%. No new national poll came out this Tuesday to test whether the Maranhão manoeuvre moved anything.`,
  'cards.inss.impactoGestao':
    `The rating still carries a negative balance: 43% bad or terrible against 35% excellent or good in the ${NEXUS}, a distance of 8 points. The structured block on this page still uses the Genial/Quaest of Aug 14, because the house rule is one pollster per block.`,
  'cards.inss.conclusao':
    `The case remains without a judicial outcome. What Aug 25 adds is of another nature: it turns up inside the electoral calculus of a state ticket and inside a high-risk list from the Court of Accounts. Neither is a ruling on the fraud, and neither moved the price in the presidential book, where the leader stood still today.`,

  'cards.bancoMaster.text1':
    `⭐ THE NEW FACT OF AUG 25 IS POLICE WORK. The Federal Police carried out a search and seizure at the Campo Grande Pension Institute, investigating money placed with Banco Master, according to Folha de S.Paulo and O Globo. It is the first search operation in the panel's window to reach a municipal pension fund.`,
  'cards.bancoMaster.text2':
    `⚠️ The Dark Horse case gained detail at the Supreme Court: O Globo of Aug 25 reports that it involves suspicions about Daniel Vorcaro's spending and about parliamentary earmarks, and the governor of São Paulo said the police will comply with the Supreme Court's decision and send the Federal Police evidence about an NGO tied to the case.`,
  'cards.bancoMaster.text3':
    `The panel keeps the three things apart on purpose. A search and seizure is an investigative act, a ruling on earmarks is budget control, and holding executives liable is a corporate governance procedure. On Aug 24 BRB authorised action against former executives involved in the Master and Reag cases, under article 159 of Law 6,404/1976, which does not amount to a prior finding of liability.`,
  'cards.bancoMaster.conclusao':
    `On Aug 25 the case advances through a police act, after advancing through a shareholder procedure on Aug 24. The day's coverage also records that the top two candidates are avoiding uncontrolled settings so as not to be questioned about Vorcaro and about the president's son, according to Estadão. The Supreme Court impeachment contract stands at 3.40% and did not move on any of it.`,

  'cards.stf.toffoli':
    `No new individual act captured on Aug 25.`,
  'cards.stf.moraes':
    `No new individual act on Aug 25. He appears in the Aug 24 coverage over a congressman's request to investigate an ally of the Bolsonaro family arrested in Bolivia, and for having authorised a visit by Carlos Bolsonaro to his father, according to O Globo.`,
  'cards.stf.gilmar':
    `No new individual act captured on Aug 25.`,
  'cards.stf.dino':
    `⭐ THE RELEVANT ACT IS STILL HIS, and this Tuesday it produced a direct political effect. O Globo of Aug 25 reports that Flávio Bolsonaro is trying to shake off the damage from the Dark Horse case after Flávio Dino's decision, and left the explaining to the production company. The decision reaffirms that earmark designations made by party presidents are void, with a five-working-day deadline and a daily fine of R$ 100 thousand. On Aug 24 Podemos replied to the Supreme Court that the party's national leadership does not control earmarks, according to O Globo.`,
  'cards.stf.mendonca':
    `He appears in the Aug 25 coverage, not in a new act: O Globo reports that the lawyer for the president's son tried to arrange a meeting with him and complained to the Federal Police director-general and to the Justice Minister.`,
  'cards.stf.nexo':
    `⭐ THE LINK IS STILL BUDGETARY, and now it has an electoral address. The ruling on earmarks hits the machinery that funds a congressional base in an election year, and on Aug 25 it reached the runner-up in the presidential race through coverage, not through an act aimed at him. In parallel, Supreme Court justices signalled they may strike down parts of the Anti-Gang Law, according to O Globo of Aug 24.`,
  'cards.stf.analise':
    `The contract on a Supreme Court justice leaving by impeachment before 2027 stands at 3.40% (vol USD 84 thousand), up 0.05pp, on the ${STAMP}. In a book that size, 0.05pp is noise and not signal. The day had three fronts with the Supreme Court in the middle, Dino's ruling on earmarks reaching the Dark Horse case, the Podemos reply on who controls earmarks and the signal on the Anti-Gang Law, and the contract recorded none of them. The panel keeps this market as an institutional thermometer for exactly that reason: it measures the risk of a justice being removed, not the intensity of friction between branches.`,
})

// ─────────────────────────────────────────────── analysis-criteriosa
construir('analysis-criteriosa', 'en', {
  'subtitle':
    `Cross-reading of Aug 25, 2026: Polymarket price from the ${STAMP}, presidential book at USD 132.88M, against the BTG/Nexus of Aug 24, field Aug 21 to 23, which is still the most recent national poll. There was no new national poll this Tuesday: the batch Quaest released today is entirely state-level, and this panel only cross-references national scope. The day's movement is in the third-place contract.`,

  'candidates[0].header':
    `PRICE: 62.50% (vol USD 8.97M accumulated), ${STAMP}. Unchanged on the day, a second straight day standing still.`,
  'candidates[0].fortes[0]':
    `The ${NEXUS}, reliability 4, puts him at 41% in the first round without Pablo Marçal, 40% in the scenario with him, and winning the runoff by 46% to 45%. It is still the most recent national poll, and no new one came out this Tuesday to replace it.`,
  'candidates[0].fortes[1]':
    `His price did not move for a second straight day, at 62.50%, while the runner-up's gave ground. The distance between the two widened again, from 27.45pp to 27.85pp.`,
  'candidates[0].fortes[2]':
    `He leads both first-round scenarios in the most recent round and the runoff tested in it.`,
  'candidates[0].fortes[3]':
    `He confirmed he will attend the Rede Globo interview, according to Valor Econômico of Aug 25. It is his first confirmed appearance in a confrontational format after skipping the Band debate on Aug 23.`,
  'candidates[0].fortes[4]':
    `In the first-round second-place contract he shows 8.05%, up 2.10pp, which is consistent with a market that still sees him finishing first.`,
  'candidates[0].fracos[0]':
    `⚠️ In the ${NEXUS} he comes out as the most rejected candidate, at 49% against 48% for the runner-up, according to Poder360. VEJA notes it is the first time since April that he tops his rival in rejection, and that claim belongs to the magazine, not to this panel.`,
  'candidates[0].fracos[1]':
    `The government rating still carries a negative balance in that same round: 43% bad or terrible against 35% excellent or good, according to CNN Brasil.`,
  'candidates[0].fracos[2]':
    `The runoff lead is 1 point, inside the poll's own 2pp margin, which makes it a statistical tie.`,
  'candidates[0].fracos[3]':
    `📌 Folha of Aug 25 reports that the PT's strategy in Maranhão spares a senator named in the INSS fraud to avoid further damage to him, which shows the case still weighing on electoral bargaining.`,
  'candidates[0].fracos[4]':
    `🏛️ Folha of Aug 25 also reports that the investigation into his son points to three failed attempts to close a contract at the Health Ministry. It is an ongoing inquiry, with no outcome.`,
  'candidates[0].analise':
    `His price has been frozen for two days at 62.50% (vol USD 8.97M accumulated) and the distance to the runner-up widened again, from 27.45pp to 27.85pp, without him gaining anything: it was the other side that gave ground. Against the full series since Apr 14, the narrowest distance ever recorded between the two is negative, 8 points in the runner-up's favour on May 6, so narrowing and widening in this range are ordinary moves for this book and not a change of picture. The most recent poll is still the BTG/Nexus of Aug 24, which puts him at 41% in the first round and ahead in the runoff by 46% to 45%, and this Tuesday there was no new national poll. What the day adds is about the calendar and not about numbers: he confirmed he will attend the Globo interview, after skipping the Aug 23 debate.`,

  'candidates[1].header':
    `PRICE: 34.65% (vol USD 8.89M accumulated), ${STAMP}. Down 0.40pp, giving back part of yesterday's rise.`,
  'candidates[1].fortes[0]':
    `Even after giving back 0.40pp, 34.65% is still his highest level since May 13. Checked against the full series since Apr 14 in the database backup, and not through the API window, which truncates at 90 days.`,
  'candidates[1].fortes[1]':
    `⭐ HE ROSE IN THE SECOND-PLACE CONTRACT: 87.50%, up 2.00pp, his largest move of the day. The market grew more certain he reaches the runoff, at the same time as it grew slightly less certain he wins.`,
  'candidates[1].fortes[2]':
    `The ${NEXUS} gives him 37% in the scenario without Pablo Marçal and 34% in the scenario with him, and 45% in the runoff against 46%.`,
  'candidates[1].fortes[3]':
    `In that same round he is less rejected than the front-runner, at 48% against 49%, according to Poder360.`,
  'candidates[1].fortes[4]':
    `He confirmed he will attend the Rede Globo interview, according to Valor Econômico and VEJA of Aug 25, after having made his presence at the Band debate conditional on his rival showing up.`,
  'candidates[1].fracos[0]':
    `The 0.40pp drop gives back part of yesterday's 1.80pp rise, and the two-day balance is positive by 1.40pp.`,
  'candidates[1].fracos[1]':
    `The top of his series is 45.50%, from May 6, and he sits 10.85pp below it.`,
  'candidates[1].fracos[2]':
    `🏛️ THE DAY'S JUDICIAL ACT REACHES HIM: O Globo of Aug 25 reports that he is trying to shake off the damage from the Dark Horse case after Justice Flávio Dino's decision, and left the explaining to the production company. The case involves suspicions about Daniel Vorcaro's spending and about parliamentary earmarks.`,
  'candidates[1].fracos[3]':
    `Dino's ruling that earmark designations made by party presidents are void cites suspicions about his own party's president, according to Poder360 and CNN Brasil of Aug 23.`,
  'candidates[1].fracos[4]':
    `📌 His distance to the front-runner widened again this Tuesday, from 27.45pp to 27.85pp.`,
  'candidates[1].analise':
    `His day carries two signals pointing opposite ways, and that is the panel's finding today. In the presidential book he gave back 0.40pp to 34.65% (vol USD 8.89M accumulated), returning part of yesterday's 1.80pp rise. In the first-round second-place contract he did the reverse and rose 2.00pp, reaching 87.50%. In other words, the market grew more convinced he makes the runoff and slightly less convinced he wins it. The two contracts measure different things and do not cancel out. Even with the drop, his level is still the highest since May 13, checked against the full series since Apr 14 in the database backup. What weighs against him on the day is judicial: the Aug 25 coverage has him managing the fallout from the Dark Horse case after Flávio Dino's decision.`,

  'candidates[2].header':
    `PRICE: 2.95% (vol USD 11.09M accumulated), ${STAMP}. Up 0.05pp in the presidential book, and down 2.50pp in the third-place contract.`,
  'candidates[2].fortes[0]':
    `He was one of the three candidates who showed up for the first presidential debate, on Aug 23, alongside Ronaldo Caiado and Augusto Cury.`,
  'candidates[2].fortes[1]':
    `BBC of Aug 24 reports that he led attention on social media during the debate, according to a study cited in the piece.`,
  'candidates[2].fortes[2]':
    `In the presidential book he rose 0.05pp, to 2.95%, a move that falls below what the double reading can tell apart from noise.`,
  'candidates[2].fortes[3]':
    `He is still ahead in the third-place contract, at 51.50% against 42.00%, even after giving ground.`,
  'candidates[2].fracos[0]':
    `🔴 THE LARGEST LOSS OF THE DAY IS HIS, and it is in the third-place contract: 51.50%, down 2.50pp, while his direct rival rose 3.00pp.`,
  'candidates[2].fracos[1]':
    `The gap between the two in the third-place contract fell from 15.00pp to 9.50pp in a single day.`,
  'candidates[2].fracos[2]':
    `⚠️ This is NOT a series low: the same book printed 3.5pp on Aug 22 at 7:30 PM, and that day's close read 15.5pp. A daily close hides the floor.`,
  'candidates[2].fracos[3]':
    `The ${NEXUS} puts him at 3%, against 5% for Ronaldo Caiado, his lowest value in the panel's 30-day window.`,
  'candidates[2].fracos[4]':
    `The disagreement between the two instruments over who is third continues, but it shrank today: the price moved toward the order the polling has been showing, without that order flipping.`,
  'candidates[2].analise':
    `His name concentrates the day's movement, and it is not in the presidential book, where he rose an irrelevant 0.05pp to 2.95% (vol USD 11.09M accumulated). It is in the third-place contract, where he gave back 2.50pp to 51.50%, while Ronaldo Caiado rose 3.00pp to 42.00%. The gap between the two fell from 15.00pp to 9.50pp in a single day. ⚠️ And here the panel needs a caveat, because the easy headline would be false: 9.50pp is NOT the narrowest gap in the series. The same book was at 3.5pp on Aug 22 at 7:30 PM, and that day's close read 15.5pp, which shows that looking only at the close hides the floor. What can be stated is what the day did: the price moved toward the order the polling has been showing, which puts Caiado ahead at 5% against 3%, without the contract's order flipping.`,

  'candidates[3].header':
    `PRICE for the whole trailing pack, ${STAMP}: Caiado 0.55%, Zema 0.25%, Haddad 0.05%.`,
  'candidates[3].subtitle':
    `Trailing pack on the ${STAMP}. Ronaldo Caiado gave back 0.15pp and returned to the 0.5% floor at which the double reading confirms a move, and Romeu Zema and Fernando Haddad remain below it. ⭐ The pack's real movement today is not in the presidential book: it is in the first-round third-place contract, where Caiado rose 3.00pp.`,
  'candidates[3].caiado.label':
    `CAIADO (PSD), presidential Poly 0.55% (vol USD 6.59M accumulated, ${STAMP}), down 0.15pp. ⭐ In the first-round third-place contract he ROSE 3.00pp and stands at 42.00%, 9.50pp from Renan Santos.`,
  'candidates[3].caiado.fortes':
    `⭐ THE LARGEST GAIN ON THE PANEL TODAY IS HIS, and it is in the first-round third-place contract: 3.00pp, reaching 42.00%. The move brings the price closer to the order the polling already showed, because the ${NEXUS} keeps him at 5% in the first round against 3% for Renan Santos. That same poll tested him in a runoff against the front-runner and measured 46% to 42%, according to Metrópoles. He took part in the first presidential debate, on Aug 23.`,
  'candidates[3].caiado.fracos':
    `In the presidential book he went the other way and gave back 0.15pp, returning to 0.55%, glued to the 0.5% floor at which the double reading can tell a move apart from noise. ⚠️ And the inversion between the two instruments continues: in the polling he is ahead of Renan Santos, and in the third-place contract his price is still 9.50pp LOWER than his rival's. The gap shrank, but the order did not flip. There was no new national poll this Tuesday to test whether the polling moved along with it.`,
  'candidates[3].haddad.label':
    `HADDAD (PT), presidential Poly 0.05% (vol USD 7.30M accumulated), ${STAMP}, unchanged. 🏷️ He is not a presidential candidate.`,
  'candidates[3].haddad.fortes':
    `His accumulated volume, USD 7.30M, is still larger than that of several names priced above him, which keeps the contract backed by real trading despite the price on the floor. Accumulated volume measures how much money has passed through since the contract opened, not today's probability.`,
  'candidates[3].haddad.fracos':
    `⭐ DATED FACT FROM AUG 16: he formally opened a campaign for the SÃO PAULO STATE GOVERNMENT, according to O Globo and Times Brasil. In other words, he is not running for president, and any presidential scenario that includes him is a polling hypothesis and not a live candidacy. The price is still 0.05%, far below the 0.5% floor of the double reading.`,
  'candidates[3].zema.label':
    `ZEMA (Novo), presidential Poly 0.25% (vol USD 5.98M accumulated, ${STAMP}), down 0.05pp. In the first-round third-place contract he stands at 3.15%.`,
  'candidates[3].zema.fortes':
    `⭐ HIS DAY WAS ABOUT EXPOSURE: he was questioned for about 40 minutes on Jornal Nacional on Aug 25, according to BBC and O Globo, the largest individual exposure in the pack today. The ${NEXUS} keeps him at 3% in the first round, the same level the house has been measuring since Aug 3.`,
  'candidates[3].zema.fracos':
    `The price recorded nothing of the interview: it gave back 0.05pp and settled at 0.25%, below the 0.5% floor of the double reading. In the interview he played down Minas Gerais' fiscal situation, criticised the Supreme Court, said the judiciary is used to do politics, would not guarantee a real increase in the minimum wage and sought to distance himself from accusations linking Cemig to Banco Master, according to O Globo. 🔴 He had WITHDRAWN from the first presidential debate at 12:01 PM on Aug 23, after the two front-runners confirmed they would not attend, according to Gazeta do Povo.`,
  'candidates[3].analise':
    `The pack has one name that genuinely moved today, and it was not in the presidential book. Ronaldo Caiado rose 3.00pp in the third-place contract and reached 42.00%, the largest gain on the panel today, while in the presidential book he gave back 0.15pp to 0.55% (vol USD 6.59M accumulated). The move brings the price closer to the order the polling has been recording, which puts him ahead of Renan Santos by 5% to 3%, without the contract flipping: his rival still holds 51.50%. Romeu Zema, at 0.25% (vol USD 5.98M accumulated), had the day of greatest exposure, with 40 minutes of questioning on Jornal Nacional, and his price recorded none of it. Fernando Haddad remains at 0.05% (vol USD 7.30M accumulated), unchanged.`,
  'candidates[3].fortes[0]':
    `⭐ Ronaldo Caiado posted the largest gain of the day in any book on the panel: 3.00pp in the third-place contract, reaching 42.00%.`,
  'candidates[3].fortes[1]':
    `In the polling he is still ahead of Renan Santos, at 5% against 3% in the ${NEXUS}, and the price of the third-place contract moved today toward that order.`,
  'candidates[3].fortes[2]':
    `Romeu Zema had 40 minutes of questioning on Jornal Nacional on Aug 25, the largest individual exposure in the pack that day.`,
  'candidates[3].fortes[3]':
    `The BTG/Nexus tested Caiado in a runoff against the front-runner and measured 46% to 42%, according to Metrópoles.`,
  'candidates[3].fracos[0]':
    `In the presidential book all three are at or below the 0.5% floor: Caiado at 0.55% after giving back 0.15pp, Zema at 0.25% and Haddad at 0.05%.`,
  'candidates[3].fracos[1]':
    `The inversion between the two instruments on third place continues: in the polling Caiado is ahead, and in the contract his price is still 9.50pp lower than his rival's.`,
  'candidates[3].fracos[2]':
    `⚠️ The 9.50pp gap is not a series floor: the book has already been at 3.5pp on Aug 22.`,
  'candidates[3].fracos[3]':
    `None of the three had a new national poll this Tuesday, because there was none.`,

  'quadroComparativo[0].p':
    `NO NEW NATIONAL POLL THIS TUESDAY. The most recent is still the BTG/Nexus (n=2,006, field Aug 21 to 23, reliability 4), which gives him 41% in the first round without Marçal, 40% in the scenario with him, and 46% in the runoff against 45%. ⚠️ In that same round he is the most rejected, at 49% against 48% for the runner-up, according to Poder360.`,
  'quadroComparativo[0].m':
    `62.50% (vol USD 8.97M), ${STAMP}. Unchanged, a second straight day standing still. His highest reading since Apr 14, when the series starts, is 67.50%, from Aug 16.`,
  'quadroComparativo[0].t':
    `standing still for a second day, 5.00pp below the series high`,
  'quadroComparativo[0].s':
    `Seventh day of the official campaign, 43 days from the first round. He confirmed he will attend the Rede Globo interview, according to Valor Econômico, after skipping the Band debate on Aug 23.`,
  'quadroComparativo[1].p':
    `The BTG/Nexus of Aug 24 gives him 37% in the scenario without Pablo Marçal and 34% in the scenario with him, and 45% in the runoff against 46%. No new national poll came out this Tuesday to update those numbers.`,
  'quadroComparativo[1].m':
    `34.65% (vol USD 8.89M), ${STAMP}. Down 0.40pp, giving back part of yesterday's rise. The level is still the highest since May 13, checked in the backup against the full series since Apr 14. The series high is 45.50%, from May 6. ⭐ In the second-place contract he ROSE 2.00pp and pays 87.50%.`,
  'quadroComparativo[1].t':
    `gives ground in the presidential book and rises in the second-place contract`,
  'quadroComparativo[1].s':
    `He confirmed he will attend the Rede Globo interview, according to Valor Econômico and VEJA. 🏛️ O Globo of Aug 25 reports that he is managing the fallout from the Dark Horse case after Justice Flávio Dino's decision, and left the explaining to the production company.`,
  'quadroComparativo[2].p':
    `The BTG/Nexus puts him at 3%, against 5% for Ronaldo Caiado. It is his lowest value in the panel's 30-day window. He was one of the three who showed up for the Aug 23 debate, and BBC reports he led attention on social media during it.`,
  'quadroComparativo[2].m':
    `2.95% (vol USD 11.09M), ${STAMP}. Up 0.05pp, below what the double reading tells apart from noise. 🔴 In the third-place contract he GAVE BACK 2.50pp and pays 51.50%, against 42.00% for Ronaldo Caiado.`,
  'quadroComparativo[2].t':
    `steady in the presidential book, largest loss of the day in the third-place contract`,
  'quadroComparativo[2].s':
    `📌 The disagreement over third place SHRANK: the gap in the contract fell from 15.00pp to 9.50pp, moving toward the order the polling shows. ⚠️ It is not a series floor: the same book was at 3.5pp on Aug 22 at 7:30 PM.`,
  'quadroComparativo[3].p':
    `The BTG/Nexus keeps him at 5%, ahead of Renan Santos in the polling. That same poll tested the runoff against Lula and measured 46% to 42%, according to Metrópoles. He took part in the Aug 23 debate.`,
  'quadroComparativo[3].m':
    `0.55% (vol USD 6.59M), ${STAMP}. Down 0.15pp, back to the 0.5% floor. ⭐ In the third-place contract he posted the LARGEST GAIN OF THE DAY in any book on the panel: 3.00pp, reaching 42.00%.`,
  'quadroComparativo[3].t':
    `gives ground in the presidential book, largest gain of the day in the third-place contract`,
  'quadroComparativo[3].s':
    `The third-place price moved toward the order the polling already showed, which puts him ahead at 5% to 3%. The contract's order did not flip: his rival still holds 51.50%.`,
  'quadroComparativo[4].p':
    `No new measurement this Tuesday. The window's three national polls disagree with each other: 2% in the Datafolha of Aug 21, 5.2% in the Veritá of the same day and 4% in the BTG/Nexus of Aug 24.`,
  'quadroComparativo[4].m':
    `0.15% (vol USD 2.66M), ${STAMP}. Down 0.10pp, and he sits below the 0.5% floor of the double reading, which makes the daily variation thin-book noise.`,
  'quadroComparativo[4].t':
    `below the monitoring floor`,
  'quadroComparativo[4].s':
    `🏛️ The judicial squeeze was settled on Aug 21: the president of the São Paulo Regional Electoral Court rejected the special appeals from his defence AND from the Electoral Public Prosecutor's Office, upheld his ineligibility until 2032 and the fine of R$ 420 thousand, according to Metrópoles and CNN Brasil. 🔴 The widest distance between the panel's two instruments is still his: the polling puts him fifth at 4% and the price puts him ninth at 0.15%. The two quantities do not subtract from one another, and what the panel records is the ordering, not a difference figure.`,
  'quadroComparativo[5].m':
    `3.40% (vol USD 84 thousand), ${STAMP}. Up 0.05pp, within the noise of a book that size.`,
  'quadroComparativo[5].t':
    `practically flat`,
  'quadroComparativo[5].s':
    `Contract on a Supreme Court justice being impeached before 2027, kept on the panel as an institutional thermometer. On Aug 25 the Dark Horse case gained detail in the coverage, involving suspicions about Daniel Vorcaro's spending and about earmarks, according to O Globo, and the governor of São Paulo said the police will comply with the Supreme Court decision on evidence from an NGO tied to the case. The contract did not move on any of it.`,

  'cruzamento':
    `The day had no new national poll and did have price movement, and the two facts together define the reading. The batch Quaest released this Tuesday is entirely state-level, covering Rio Grande do Norte, Paraná, Rio Grande do Sul, Alagoas, Maranhão and Santa Catarina, and this panel only cross-references national scope. The country's most recent poll is still the BTG/Nexus of Aug 24.\n\nIn the presidential book, which totals USD 132.88M, the front-runner stood still at 62.50% for a second straight day and the runner-up gave back 0.40pp, to 34.65%. The distance between the two widened again, from 27.45pp to 27.85pp, and it widened without the leader gaining anything. Against the full series since Apr 14, checked in the database backup rather than through the API window, the narrowest distance ever recorded between the two is negative, 8 points in the runner-up's favour on May 6. Movement in this range is routine for this book.\n\n⭐ THE FINDING OF THE DAY IS IN THE THIRD-PLACE CONTRACT, and it is about instruments converging. Renan Santos gave back 2.50pp to 51.50%, while Ronaldo Caiado rose 3.00pp to 42.00%, the largest gain on the panel today. The gap between the two fell from 15.00pp to 9.50pp. The polling has been saying the opposite of the price on this point for weeks, with Caiado at 5% and Renan Santos at 3% in the most recent round, and this Tuesday the price moved toward the polling without the contract's order flipping.\n\n⚠️ THE CAVEAT THE SERIES IMPOSES, and without it the reading above becomes a false headline: 9.50pp is not the narrowest gap ever recorded in this contract. The same book was at 3.5pp on Aug 22 at 7:30 PM, and that day's close read 15.5pp. Anyone looking only at daily closes does not see the floor, and would have concluded today is a series low when it is not.\n\nThe runner-up's second contract moved the opposite way from his presidential one: in the first-round second-place book he rose 2.00pp and reached 87.50%. The market grew more convinced he makes the runoff and slightly less convinced he wins. These are different contracts, measuring different outcomes, and the panel does not subtract one from the other.\n\nOn the factual side, the day brought a reversal of plans and an investigative act. The top two candidates confirmed they will attend the Rede Globo interview, according to Valor Econômico and VEJA, after both skipped the Band debate on Aug 23. And the Federal Police carried out a search and seizure at the Campo Grande Pension Institute over money placed with Banco Master, according to Folha de S.Paulo and O Globo. Neither moved a price.`,
})

// ─────────────────────────────────────────────── polls-data
construir('polls-data', 'en', {
  'polymarketComparison.note':
    `Polymarket prices from the ${STAMP}, with the presidential book at USD 132.88M. There was no new national poll this Tuesday: the batch Quaest released today is entirely state-level, and this block only cross-references national scope. The distance between the top two widened again, from 27.45pp to 27.85pp, and it widened because the runner-up gave back 0.40pp, not because the front-runner gained. ⭐ The day's movement is in the first-round third-place contract: Renan Santos gave back 2.50pp to 51.50% and Ronaldo Caiado rose 3.00pp to 42.00%, taking the gap between them from 15.00pp to 9.50pp, toward the order the polling already showed. ⚠️ And that is NOT a series floor: the same book was at 3.5pp on Aug 22 at 7:30 PM, checked in the database backup against the series that starts on Apr 14. Probability of winning and voting intention measure different things, and the panel does not subtract one from the other.`,
  'polymarketComparison.sources':
    `Polymarket prices via the AFOS proxy, and the panel only publishes a price that two independent readings, taken eight minutes apart, confirm within 0.20pp. On Aug 25 there is a new confirmed reading for every contract tracked, at 3:22 PM BRT (6:22 PM UTC): presidential, second place, third place, Senate and Supreme Court impeachment. Polls registered with the TSE and released by the pollsters, with reporting from G1, CNN Brasil, Folha de S.Paulo, Valor Econômico, Estadão, Poder360, VEJA, InfoMoney, UOL, O Globo and Correio Braziliense.`,
  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `62.50% (vol USD 8.97M) on the ${STAMP}, unchanged for a second straight day. His highest reading since Apr 14, when the series starts, is 67.50%, from Aug 16. In the first-round second-place contract he shows 8.05%, up 2.10pp.`,
  'polymarketComparison.candidates[1].polymarket': `34.65%`,
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `34.65% (vol USD 8.89M) on the ${STAMP}, down 0.40pp, giving back part of yesterday's 1.80pp rise. The level is still the highest since May 13, checked in the backup against the full series since Apr 14, and the series high is 45.50%, from May 6. ⭐ In the first-round second-place contract he went the other way and rose 2.00pp, to 87.50%.`,
  'polymarketComparison.candidates[2].polymarket': `2.95%`,
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `2.95% (vol USD 11.09M) on the ${STAMP}, up 0.05pp, which falls below what the double reading tells apart from noise. 🔴 In the first-round third-place contract he posted the panel's largest loss of the day, giving back 2.50pp to 51.50%.`,
  'polymarketComparison.candidates[3].polymarket': `0.55%`,
  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `0.55% (vol USD 6.59M) on the ${STAMP}, down 0.15pp, which returns him to the 0.5% floor of the double reading. ⭐ In the first-round third-place contract he posted the panel's largest gain of the day, rising 3.00pp to 42.00%, which brings the price closer to the order the polling already showed.`,
  'polymarketComparison.candidates[4].polymarket': `0.15%`,
  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `0.15% (vol USD 2.66M) on the ${STAMP}, down 0.10pp. He sits below the 0.5% floor of the double reading, which makes the daily variation thin-book noise.`,
  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `0.05% (vol USD 14.03M accumulated) on the ${STAMP}. It is the largest individual volume in the presidential book and the price is still on the floor, which is consistent with a contract the market has already settled.`,
  'polymarketComparison.candidates[6].polymarket': `0.25%`,
  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `0.25% (vol USD 5.98M) on the ${STAMP}, down 0.05pp, below the 0.5% floor of the double reading. ⭐ He was questioned for 40 minutes on Jornal Nacional on Aug 25, according to BBC and O Globo, and the contract recorded none of it.`,
  'polymarketComparison.candidates[7].tendenciaPolymarket':
    `0.05% (vol USD 7.30M accumulated) on the ${STAMP}, unchanged. No national poll tests him for president.`,
})
