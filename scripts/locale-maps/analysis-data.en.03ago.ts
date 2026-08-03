/**
 * Mapa EN de analysis-data.json — /atualizar-brz 03/Ago/2026.
 * Convenções: ponto decimal, vírgula de milhar. `pesquisa` é poll, `urna` é polling.
 */
import { construir } from '../build-locale-json'

const G = (termo: string, id: string) => `[${termo}](/en/glossary#${id})`

construir('analysis-data', 'en', {
  'cards.sentimento.text1':
    `With 62 days to the ${G('first round', 'primeiro-turno')}, THE FIRST of the four national polls the ${G('TSE', 'tse')} filing had scheduled between Aug 3 and Aug 5 is out, and it tightens the race. ${G('BTG/Nexus', 'nexus-btg')} (n=2,002, fieldwork Jul 31 to Aug 2, telephone, 2pp margin, 95% confidence, BR-02874/2026) gives Lula 41% and Flávio 37% in the first round, with Caiado at 5%, Renan Santos at 4% and Zema at 3%. In the runoff, 46% x 45%, a 1pp difference that falls within the margin and is therefore a ${G('statistical tie', 'empate-tecnico')}.`,
  'cards.sentimento.text2':
    `WHAT CHANGES THE WEEK IS THE COMPARISON WITH THE INSTITUTE'S OWN PREVIOUS ROUND. In the Nexus round of Jul 27 it was 42% x 33%, meaning the first-round gap fell from 9pp to 4pp in a single round, and the runoff gap fell from 4pp to 1pp. The move comes almost entirely from one side: Lula gave up 1pp, within the margin, and Flávio gained 4pp, double it.`,
  'cards.sentimento.text3':
    `IN THE MARKET THE GAP CLOSED TOO, and for the same reason. Lula STOOD STILL at 65.50% (vol USD 7.92M) for a second session, and Flávio ROSE 0.90pp, to 25.45% (vol USD 7.86M), which took the gap from +40.95pp to +40.05pp. In the daily series, it had not been below that since Jul 30, when it marked +39.50pp. Both measurements moved the same way on the same day, which is rare on this panel, but that is coincidence of DIRECTION, not of level: probability of victory and share of the vote do not compare in level.`,
  'cards.sentimento.direita':
    `Flávio ROSE 0.90pp, to 25.45% (vol USD 7.86M), the strongest move of the session among the top two, and closed the gap on his own, without the front-runner giving ground. In the ${G('BTG/Nexus', 'nexus-btg')} polling he gained 4pp, to 37%, and came within 1pp of Lula in the runoff. The series caveat is large: his peak is 45.20%, from May 7, and his floor is 22.00%, from Jul 3, so 25.45% is recovery inside a lowered range. He is the favourite in the second-place contract at 80.50%. He received an explicit endorsement from Milei, who again attacked Lula publicly on Aug 2 and Aug 3.`,
  'cards.sentimento.esquerda':
    `Lula STOOD STILL at 65.50% (vol USD 7.92M) for a second straight session, on the day the polling tightened. The price sits 1.00pp below the series peak, which is 66.50%, from the Aug 1 close. In ${G('BTG/Nexus', 'nexus-btg')} he lost 1pp in the first round and 1pp in the runoff, declines within the 2pp margin that in isolation are not movement. He wins all four runoff scenarios in the round. In his own camp the market gave ground: Camilo Santana is at 0.55% and Haddad pulled back to 0.15% (vol USD 6.64M).`,
  'cards.sentimento.terceiraVia':
    `CONVENTION DAY WITH NO PRICE EFFECT. Caiado and Zema were formally nominated as candidates and neither gained in the market: Caiado is at 1.15% (vol USD 5.30M), above the 0.90% floor the series touched intraday on Aug 2, and Zema holds at 0.25% (vol USD 4.66M). Caiado promised to pardon Bolsonaro and those convicted over Jan 8 and contested the agribusiness vote with Flávio, precisely on the day Flávio rose in both measurements. RENAN SANTOS FELL 0.50pp, to 7.45% (vol USD 8.86M), undoing yesterday's rise, and the Nexus polling gave him 4%, which leaves the distance between price and polling at 3.45pp.`,
  'cards.sentimento.polymarket':
    `Lula 65.50% (flat, vol USD 7.92M), Flávio 25.45% (up 0.90pp, vol USD 7.86M), Renan Santos 7.45% (down 0.50pp, vol USD 8.86M), Caiado 1.15% (vol USD 5.30M), Jair Bolsonaro 0.65% (vol USD 5.34M), Camilo Santana 0.55% (vol USD 4.27M), Alckmin 0.35% (vol USD 5.04M), Zema 0.25% (vol USD 4.66M), Haddad 0.15% (down 0.15pp, vol USD 6.64M). Lula's gap over Flávio +40.05pp. Capture locked at 19:11 UTC, cleared on the third attempt.`,
  'cards.inss.text1':
    `The fiscal agenda produced no fresh development this Monday that moved prices, and the day's record comes from the Focus Bulletin: the market WIDENED its bet on rate cuts and now sees the Selic at 13.75% by the end of 2026 (O Globo, Aug 3). It is the first downward revision to the rate projection since the start of the war in Iran, according to Folha, and the Copom enters a better horizon, though inflation remains the challenge.`,
  'cards.inss.text2':
    `THE PANEL'S INFLATION CONTRACT IS CONSISTENT WITH THAT READING. The 5.00% to 5.49% band holds 36.60%, followed by the 4.50% to 4.99% band at 29.95% and the 5.50% to 5.99% band at 12.00%. The ten bands add to 99.65%, inside the 95% to 105% coherence gate, and the runaway tail is thin: the 7.00% or higher band pays 1.25%. In other words, the market prices persistent inflation above the target midpoint, not a breakdown.`,
  'cards.inss.text3':
    `In the electoral market, the gap closed from +40.95pp to +40.05pp, with Lula STANDING STILL at 65.50% (vol USD 7.92M) and Flávio rising 0.90pp. The move came alongside the ${G('BTG/Nexus', 'nexus-btg')} polling, which cut the first-round gap from 9pp to 4pp. The coincidence of direction is recorded without attributing cause: nothing in the day's fiscal news explains both moves.`,
  'cards.inss.text4':
    `In the Senate, the ${G('PL', 'pl')} ROSE 2.50pp to 75.00% (vol USD 259 thousand), and the ${G('MDB', 'mdb')} FELL 0.15pp, to 18.60%, on a USD 8 thousand book that does not support a fine reading. The contract on the impeachment of an ${G('STF', 'stf')} justice before 2027 held FLAT at 3.10% (vol USD 83 thousand), with no variation across the capture-lock readings.`,
  'cards.inss.impactoLula':
    `Today's ${G('BTG/Nexus', 'nexus-btg')} round did NOT publish approval or disapproval, so the ratings picture has had no fresh reading since Jul 30 and still has two houses pointing opposite ways. The two national polls still outstanding in the window, ${G('Quaest', 'quaest')} and Ideia/Canal Meio, have publication declared for Aug 5, and that is where the picture may be redrawn.`,
  'cards.inss.impactoGestao':
    `No fresh round on administration ratings. The Jul 30 record stands, with PoderData/Aya showing 34% excellent or good against 47% poor or terrible, and poor or terrible rising 10pp in two weeks inside the same house. The panel does not mix that figure with today's voting-intention reading, which comes from another house and another field period.`,
  'cards.inss.conclusao':
    `With 62 days to the election, the day brought fresh polling and a price moving the same way as it, which had not been happening. The gap closed 0.90pp in the market and 5pp in the same institute's polling, and in both the mechanism is identical: the front-runner still and the challenger rising. The caveat that blocks the easy reading is dispersion: the 4pp from Nexus contrasts with 6pp from PoderData, 9.1pp from ${G('AtlasIntel', 'atlasintel')} and 9.3pp from Vox Brasil, all released since Jul 29, and the distance between the highest and the lowest reaches 5.3pp, larger than any price move in the period.`,
  'cards.bancoMaster.text1':
    `The ${G('Banco Master', 'banco-master')} case saw investigative movement this Monday: the Federal Police POSTPONED the deposition of Augusto Lima, former partner of Daniel Vorcaro, after a request from the defence (G1, Aug 3). It is the second postponement in the inquiry's block of hearings, and the panel records the act without inferring intent.`,
  'cards.bancoMaster.text2':
    `On the parallel judicial front, the family of Alexandre de Moraes LOST a suit against a senator who publicly cited his link to Banco Master (VEJA, Aug 3). The record matters because it measures the institutional cost of the case, which has already moved beyond the purely criminal sphere into a reputational dispute between branches of government.`,
  'cards.bancoMaster.text3':
    `On the legislative front there is still nothing new, and the absence remains the fact: the writ on installing the Banco Master congressional inquiry is still undecided. The market priced none of this: the contract on the impeachment of an ${G('STF', 'stf')} justice held FLAT at 3.10% (vol USD 83 thousand) on the same day as those two stories.`,
  'cards.bancoMaster.conclusao':
    `The case's fronts remain on separate tracks and none of them moved a price today. The criminal one advances slowly, with a deposition postponed at the defence's request. The reputational one gained a chapter with the defeat of Moraes's family in court. The legislative one is still stuck on the writ. A day with two stories from the case and ZERO variation in the impeachment contract is the most informative reading here: the market does not treat an isolated judicial development as rupture risk.`,
  'cards.stf.toffoli':
    `Toffoli remains isolated on the ${G('STF', 'stf')} after the Master crisis, with no fresh individual ruling captured this Monday.`,
  'cards.stf.moraes':
    `No fresh ruling from Moraes in the period. The day's record is indirect and comes from outside the court: his family LOST a suit against a senator who cited his link to ${G('Banco Master', 'banco-master')} (VEJA, Aug 3).`,
  'cards.stf.gilmar':
    `No individual ruling from Gilmar in the period. The recent joint vote stands, alongside Dino, Moraes and Zanin, which eased restrictions on asset seizure.`,
  'cards.stf.dino':
    `No fresh ruling this Monday. The deadline set on Jul 29 for the government and Congress to specify responsibility over budget amendments is still running.`,
  'cards.stf.mendonca':
    `Still the rapporteur in the Master case, whose investigation saw movement today: the Federal Police postponed the deposition of Augusto Lima, Vorcaro's former partner, at the defence's request.`,
  'cards.stf.nexo':
    `This Monday's link is TWOFOLD and the two do not cross. On one side, the electoral race had its busiest day of the week, with ${G('BTG/Nexus', 'nexus-btg')} cutting the first-round gap from 9pp to 4pp and the market closing the gap from +40.95pp to +40.05pp. On the other, the judicial axis had three relevant developments: Fachin argued that the ${G('STF', 'stf')} should live with contestation from public opinion, saying it strengthens democracy (Folha and O Globo, Aug 3); the Federal Police asked the STF to open a THIRD inquiry into Lulinha, on suspicion of influence peddling; and the Federal Police postponed a hearing in the Master case. The impeachment contract did not move on any of it.`,
  'cards.stf.analise':
    `The contract on the impeachment of an ${G('STF', 'stf')} justice before 2027 held FLAT at 3.10% (vol USD 83 thousand) for a second straight session, and it held flat on a day carrying three relevant institutional developments: Fachin's statement on contestation of the court, the Federal Police request for a third inquiry into Lulinha, and the postponed hearing in the Master case. It is a small book, so a small move would say little, but NO move on a loaded day is a record in itself: the market separates institutional friction from rupture risk. The usual caveat applies: with USD 83 thousand accumulated, this is the thinnest contract among those the panel publishes, and reading it does not carry the same confidence as the presidential markets, which trade in the millions.`,
})
