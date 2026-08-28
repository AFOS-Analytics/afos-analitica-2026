/**
 * Mapa EN do REBASELINE de 27/Ago 22:49 BRT + correção do Vorcaro.
 * Convenções EN: PONTO decimal e VÍRGULA de milhar.
 */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/en/glossary#${id})`
const S = 'confirmed reading of Aug 27, 10:49 PM BRT (1:49 AM UTC on Aug 28)'

construir('analysis-data', 'en', {
  'cards.sentimento.text1':
    `The presidential book has accumulated USD 137.64M and the price on this page is from the ${S}. The day brought one new national poll, PoderData/Aya, with a ${G('technical tie', 'empate-tecnico')} in both rounds, and it brought a NEW name getting a price in the book.`,
  'cards.sentimento.text2':
    `On price, the leader gave up 5.00pp on the day and closed at 57.50%, his lowest level since Jul 1. The runner-up rose 1.30pp, to 36.85%, his highest since May 13. The distance between the two fell from 26.95pp to 20.65pp, the largest one-day narrowing since the panel began tracking both contracts.`,
  'cards.sentimento.text3':
    `The structural change of the day is Augusto Cury, who carried no price until yesterday and closed at 4.05% (vol USD 2.12M) in the outright-winner contract, ahead of Renan Santos. He also shows 23.75% in the third-place contract for the ${G('first round', 'primeiro-turno')} and 3.70% in the second-place one. In the polling he is not new: PoderData measures him at 4%, level with Renan Santos and Ronaldo Caiado.`,
  'cards.sentimento.direita':
    `Flávio Bolsonaro at 36.85% (vol USD 9.11M) in the presidential book, up 1.30pp, and his highest level since May 13: the last point above that was on May 13 at 2:00 AM UTC, at 42.80%, checked in the backup against the full record since Apr 14. In the polling, PoderData puts him 3 points back in the first round, 35% against 38%, and 1 point back in the ${G('runoff', 'segundo-turno')}, 44% against 45%, both inside the 2pp margin, with a rejection rate of 49%, level with the leader.`,
  'cards.sentimento.esquerda':
    `Lula at 57.50% (vol USD 9.30M), down 5.00pp and his lowest level since Jul 1. In the polling, PoderData measures him at 38% in the first round, against 41% from the same house on Aug 13, and keeps him ahead in all four runoff scenarios tested. Government approval comes in at 42% against 50% disapproval in the same round, and the administration is rated poor or terrible by 48% against great or good by 33%.`,
  'cards.sentimento.terceiraVia':
    `Here is the news of the day, and it has two halves. Augusto Cury started carrying a price and closed at 4.05% (vol USD 2.12M), the third largest in the book. And Renan Santos, who had touched the floor of his entire series in the 9:46 PM capture, at 1.65%, was back at 2.35% (vol USD 11.65M) an hour later. Ronaldo Caiado closed at 0.15% (vol USD 6.80M) and Romeu Zema at 0.15% (vol USD 6.21M). In the polling, PoderData gives Cury, Renan and Caiado 4% each, level with one another, and puts Caiado and Zema in a technical tie with the leader in the runoff, 43% to 44% each.`,
  'cards.sentimento.polymarket':
    `Prices from the ${S}. AFOS only publishes a price that two independent readings, taken eight minutes apart, confirm within 0.20pp, and the confirmation is done contract by contract. In this reading all five books tracked confirmed, including Augusto Cury's contract, which opened on Thursday. Names below 0.5% stay outside that watch, because in a thin book the swing does not tell movement from noise.`,
  'cards.bancoMaster.text1':
    `⭐ THE NEW FACT OF AUG 27 IS THAT THE TESTIMONY DID NOT HAPPEN, FOR THE SECOND TIME. Daniel Vorcaro's hearing was set for 10 AM on Thursday, by video link from the unit where he is held, and it was postponed over an unstable connection, according to CNN Brasil and Gazeta do Povo. The defense said it waited for the signal to come back and that holding the hearing was not possible.`,
  'cards.bancoMaster.text2':
    `⚠️ It is the second postponement of the same testimony. The first was on Aug 20, at the defense's request, because it did not yet have full access to the investigation file; this one was technical. The new date is Friday, Aug 28, and the Federal Police did not confirm a time, according to CNN Brasil.`,
  'cards.bancoMaster.text3':
    `The subject of the inquiry has not changed: how two former supervision directors at the Central Bank acted on behalf of ${G('Master', 'banco-master')} while the institution faced a liquidity crisis. On the same day, a travel agency confirmed to the ${G('PF', 'pf')} a USD 38,000 payment made by Vorcaro for a guided Disney itinerary for a former Central Bank director, according to O Globo.`,
  'cards.bancoMaster.conclusao':
    `⭐ AND HERE IS THE CROSSING OF THE DAY. The investigative act did not happen, but the case entered the campaign by another route: Lula's advertising began circulating on social media with the audio in which Flávio Bolsonaro calls Vorcaro brother while asking him for money, according to Estadão and Terra. The audio is not new, it was revealed in May by Intercept Brasil, and the senator said at the time that the transfers financed the Dark Horse film. What is new is the electoral use. On the same day his price rose 1.30pp, to the highest level since May 13. The panel records both on the same date and does not decide which explains the other.`,
  'cards.stf.analise':
    `The contract on a Supreme Court justice leaving by impeachment before 2027 sits at 3.40% (vol USD 84,000), unchanged in the ${S}. That is the fourth day running at the same level. On Thursday the court sat at the center of the campaign's two biggest disputes, over jurisdiction and over access to evidence, and the price still did not move. The market for that contract is small, with 84,000 dollars in accumulated volume, so the panel does not treat the absence of movement as an answer to anything: it treats it as an absence of trading.`,
})

construir('analysis-criteriosa', 'en', {
  subtitle:
    `Crossing of Aug 27, 2026: Polymarket price in the ${S}, presidential book at USD 137.64M, against PoderData/Aya released on Thursday (BR-04974/2026, fieldwork Aug 23 to 26, n=2,400), which brings a TECHNICAL TIE in both rounds, and against Gerp and Indexa/Broadcast of Aug 26, which contradict each other. BTG/Nexus of Aug 24 (BR-09028/2026, n=2,006) remains the most reliable in the window on the house's own ruler. News reviewed across 1,152 items collected on Thursday.`,
  'candidates[0].header':
    `PRICE: 57.50% (vol USD 9.30M accumulated), ${S}. Down 5.00pp on the day, the largest move on the panel in the outright-winner contract, and the lowest level since Jul 1.`,
  'candidates[0].fortes[2]':
    `Even after the drop, his price is still the largest in the book by a wide margin, and the runner-up is 20.65pp behind.`,
  'candidates[0].analise':
    `The day flips the shape of the one before. On Aug 26 his price stood still and the one moving was the runner-up; on Thursday the one who moved was him, and downward: 5.00pp across five successive readings, from 62.50% to 57.50%, the lowest level since Jul 1. On the same day PoderData/Aya published the first round from that house with a technical tie in both rounds, with the first round narrowing from 6pp to 3pp in two weeks and the runoff at 1pp. The two landed on the same date and the panel records the coincidence without assigning cause, because probability of winning and voting intention measure different things, and the same round that narrows the first round also keeps him ahead in all four runoff scenarios tested. The book also changed composition on Thursday, with a name that carried no price until yesterday closing in third. Even so his price is still the largest in the book by a wide margin, and the distance to the runner-up, now 20.65pp, remains the widest between any two names in the contest. ${S}.`,
  'candidates[1].header':
    `PRICE: 36.85% (vol USD 9.11M accumulated), ${S}. Up 1.30pp, the largest gain of the day among the outright-winner contracts, and his highest level since May 13.`,
  'candidates[1].fortes[0]':
    `⭐ 36.85% is his highest price since May 13. The last point above that was on May 13 at 2:00 AM UTC, at 42.80%, checked in the database backup against the full record since Apr 14. The series top is still 45.50%, from May 6.`,
  'candidates[1].fortes[2]':
    `The price distance to the leader fell from 26.95pp to 20.65pp in a single day, and it narrowed from both sides: the leader gave up 5.00pp and he rose 1.30pp.`,
  'candidates[1].fracos[0]':
    `In the second-place contract for the first round he gave up 3.00pp, from 87.50% to 84.50%, on the same day a new name started carrying a price in that contract, at 3.70%.`,
  'candidates[1].fracos[1]':
    `His gain in the outright-winner contract was 1.30pp and the leader's fall was 5.00pp: of the 6.30pp the gap closed, most came from the other side.`,
  'candidates[1].analise':
    `His price closed at 36.85%, the highest since May 13, and the distance to the leader is the narrowest of the recent cycle, 20.65pp. This time he took part in the narrowing: he rose 1.30pp, the largest gain of the day among the outright-winner contracts, on a day the leader gave up 5.00pp. In the polling, PoderData/Aya puts him 3 points back in the first round and 1 point back in the runoff, both inside the 2pp margin, and the rejection of the two is level at 49%. In the second-place contract for the first round, though, he gave up 3.00pp, to 84.50%, on the same day Augusto Cury's contract in that book came to be worth 3.70%. In the news, the Dark Horse case advanced by court ruling and by the production company's request to move the inquiry to the STF, and his opponent's advertising began circulating with the audio in which he calls Daniel Vorcaro brother while asking him for money. The panel records the price rise and the case advancing side by side, on the same date, and does not decide which explains what. ${S}.`,
  'candidates[2].header':
    `PRICE: 2.35% (vol USD 11.65M accumulated), ${S}. The contract TOUCHED the floor of its entire series on Thursday, at 1.70% in the record and 1.65% in the 9:46 PM capture, and has already climbed back.`,
  'candidates[2].fortes[1]':
    `He is still the most expensive name in the third-place contract for the first round, at 36.00% (vol USD 207,000), ahead of Ronaldo Caiado and Augusto Cury.`,
  'candidates[2].fortes[2]':
    `The accumulated volume in his outright-winner contract, USD 11.65M, is one of the largest in the presidential book, behind only names whose price sits at zero.`,
  'candidates[2].fracos[0]':
    `⚠️ The contract touched the FLOOR of its entire series on Thursday. The record marked 1.70% across four successive readings, between 7:00 PM and 12:00 AM UTC, and none of the 350 points logged since Apr 14 sits below that. The series top is 49.60%, from Apr 28.`,
  'candidates[2].fracos[1]':
    `⚠️ In the third-place contract for the first round he gave up 9.50pp, from 45.50% to 36.00%, the largest single move on the panel today. It is his lowest level in that contract since May 27.`,
  'candidates[2].fracos[2]':
    `In the second-place contract for the first round he gave up 0.45pp and sits at 1.55%, behind the 3.70% of the name that started carrying a price on Thursday.`,
  'candidates[2].analise':
    `His outright-winner contract touched the lowest price of its entire series on Thursday, at 1.70% across four successive readings in the record, and none of the 350 points since Apr 14 sits below that. An hour after the 9:46 PM capture he was already back at 2.35%, which is a recovery inside the day and not a reversal of trend: on Aug 25 he was worth 3.10%. In the third-place contract for the first round the loss was larger, 9.50pp, from 45.50% to 36.00%, his lowest level in that contract since May 27, and he is still the most expensive name there. In the polling the reading is different: PoderData/Aya measures him at 4%, level with Caiado and Cury, exactly where he was in earlier rounds. The distance between the two measurements is what the panel exists to show, and it does not resolve by averaging. On the same day he went on Jornal Nacional and argued for a state of exception in favelas and for nuclear weapons. ${S}.`,
  'candidates[3].header':
    `PRICE: Augusto Cury at 4.05% (vol USD 2.12M accumulated), Ronaldo Caiado at 0.15% (vol USD 6.80M accumulated) and Romeu Zema at 0.15% (vol USD 6.21M accumulated), ${S}. The first got a CONFIRMED price on Thursday and is already the third largest in the book.`,
  'candidates[3].subtitle':
    `The back of the pack in the ${S}, and it changed size on Thursday. Augusto Cury entered the book and closed at 4.05%, the third largest price, while Caiado and Zema remain at 0.15%, below the 0.5% floor at which the double reading tells movement from noise.`,
  'candidates[3].caiado.label':
    `CAIADO (PSD), Poly presidential 0.15% (vol USD 6.80M accumulated, ${S}), down 0.30pp. In the third-place contract for the first round he gave up 5.50pp and sits at 33.50% (vol USD 68,000), his lowest level there since Aug 14.`,
  'candidates[3].haddad.label':
    `HADDAD (PT), Poly presidential 0.05% (vol USD 7.30M accumulated, ${S}), unchanged.`,
  'candidates[3].zema.label':
    `ZEMA (Novo), Poly presidential 0.15% (vol USD 6.21M accumulated, ${S}), unchanged on the day.`,
  'candidates[3].zema.fracos':
    `He remains at 0.15% in the outright-winner contract, below the watch floor. In the polling, Gerp and Indexa of Aug 26 measured him at 1% each and BTG/Nexus of Aug 24 at 3%, so today's 2% from PoderData sits in the middle of that spread.`,
  'candidates[3].fortes[0]':
    `⭐ AUGUSTO CURY (Avante) GOT A CONFIRMED PRICE ON THURSDAY. His contract opened at 12:30 AM UTC and closed at 4.05% (vol USD 2.12M), the third largest price in the presidential book, ahead of Renan Santos and Ronaldo Caiado. In the third-place contract for the first round he marks 23.75% (vol USD 33,000) and in the second-place one, 3.70% (vol USD 57,000).`,
  'candidates[3].fracos[0]':
    `⚠️ His price series has five points, all from Thursday, between 0.80% and 5.00%. In a newly opened contract a swing like that does not tell price from noise, and the panel treats none of his levels as established.`,
  'candidates[3].fracos[2]':
    `Romeu Zema remains at 0.15% in the outright-winner contract, also below the watch floor.`,
  'candidates[3].fracos[3]':
    `Caiado and Zema together are worth 0.30% in the outright-winner contract, against 94.35% for the top two. The third way is still measured in the polling and barely priced in the market.`,
  'candidates[3].analise':
    `The structural news of the day is here, and in this reading it completed itself. Augusto Cury, whose contract opened at 12:30 AM UTC and who spent the day without a price two readings would confirm, closed at 4.05% in the 10:49 PM reading, the third largest in the presidential book. The market has also formed a price on where he lands: 23.75% to finish third in the first round and 3.70% to finish second. In the polling he is not a new name: PoderData/Aya measures him at 4% in the first round, level with the other two names of the third way, and those 4% are his highest anywhere in the panel's table, which had measured him between 1% and 3% until now. Caiado and Zema go the other way, at 0.15% each, and PoderData puts both in a technical tie with the leader in the runoff, 43% to 44% each. That is the distance between the two measurements the panel exists to show: in the polling they tie in the runoff, and in the outright-winner price the two of them together do not reach a third of a point. ${S}.`,
  'quadroComparativo[0].m':
    `57.50% (vol USD 9.30M), ${S}. Down 5.00pp, the largest move on the panel in the outright-winner contract, and the lowest level since Jul 1.`,
  'quadroComparativo[1].m':
    `36.85% (vol USD 9.11M), ${S}. Up 1.30pp, the largest of the day, and his highest level since May 13. In the second-place contract he gave up 3.00pp, to 84.50%.`,
  'quadroComparativo[1].t': `the largest gain of the day, and the highest level since May 13`,
  'quadroComparativo[2].m':
    `4.05% (vol USD 2.12M) in the outright-winner contract, ${S}, the third largest price in the book. Also 23.75% in the third-place contract for the first round and 3.70% in the second-place one. The contract opened on Thursday, at 12:30 AM UTC.`,
  'quadroComparativo[2].t': `a new name in the book, and already third in the outright-winner contract`,
  'quadroComparativo[3].m':
    `2.35% (vol USD 11.65M), ${S}. The contract TOUCHED the floor of its entire series on Thursday, at 1.70% in the record, and has already climbed back. In the third-place one it gave up 9.50pp, to 36.00%, the largest single move on the panel today.`,
  'quadroComparativo[3].t': `touched the floor of the series and came back`,
  'quadroComparativo[4].m':
    `0.15% (vol USD 6.80M), ${S}. Down 0.30pp, below the 0.5% floor of the double reading. In the third-place contract he gave up 5.50pp, to 33.50%, his lowest level there since Aug 14.`,
  'quadroComparativo[5].m': `0.15% (vol USD 3.03M), ${S}. Unchanged, and below the 0.5% floor of the double reading.`,
  'quadroComparativo[6].m': `3.40% (vol USD 84,000), ${S}. Unchanged on the day, and it is the fourth day running at the same level.`,
  cruzamento:
    `Aug 27 has one polling fact and three market facts, and they all landed on the same date. In the polling, PoderData/Aya (BR-04974/2026, fieldwork Aug 23 to 26, n=2,400, telephone) brought a technical tie in BOTH rounds: 38% to 35% in the first and 45% to 44% in the second, both inside the 2pp margin. The comparison that counts here is with the house itself, because method and sample are the same: on Aug 13 it measured 41% to 35% in the first round, six points, and it now measures three. The runoff was at one point and stays at one. The same round gives the leader a technical tie against Romeu Zema and against Ronaldo Caiado as well, 44% to 43% each, and a seven-point lead over Renan Santos. Rejection level at 49% for the top two, and government approval at 42% against 50% disapproval. On price, the confirmed 10:49 PM reading has the leader at 57.50%, down 5.00pp on the day, continuous across five readings, and at his lowest level since Jul 1: the last reading below that was on Jun 30 at 4:30 PM UTC, at 55.50%, checked in the database backup against the full record since Apr 14. The runner-up rose 1.30pp, to 36.85%, the largest gain of the day and his highest level since May 13. The distance between the two fell from 26.95pp to 20.65pp, and this time it narrowed from both sides. ⚠️ The panel does NOT call that the narrowest gap of anything, because it is not: in May the runner-up was ahead of the leader, with the gap reaching minus 8.00pp on May 6. The second market fact is structural: Augusto Cury, whose contract opened at 12:30 AM UTC and who spent the day without a price two readings would confirm, closed at 4.05% and is the third largest price in the book. The market has also formed a price on where he lands, with 23.75% to finish third in the first round and 3.70% to finish second. In the polling he is not a new name, because PoderData measures him at 4%, level with the other two of the third way, and those 4% are his highest anywhere in the panel's table, which had measured him between 1% and 3% until now. The third fact is a floor touched and undone on the same day: Renan Santos marked 1.70% in the record, the lowest of his entire 350-point series since Apr 14, and by 10:49 PM he was at 2.35%. In the third-place contract he gave up 9.50pp, to 36.00%, the largest single move on the panel, and Ronaldo Caiado gave up 5.50pp, to 33.50%. In the news, Daniel Vorcaro's testimony to the Federal Police was postponed for the second time, this time over a technical failure in the video link, and rescheduled for Friday; the Dark Horse case saw the production company ask for it to go to the STF and Dino widen the PF's access to the evidence; and the leader's advertising began circulating with the audio in which the runner-up calls Vorcaro brother while asking him for money, audio revealed in May by Intercept Brasil. All of these facts are from the same date, and the panel records the coincidence without assigning cause. Probability of winning and voting intention measure different things, and the panel does not subtract one from the other. ${S}.`,
})

construir('polls-data', 'en', {
  'polymarketComparison.note':
    `Polymarket prices from the ${S}, with the presidential book at USD 137.64M. ⭐ THE DAY HAS ONE NEW POLL AND ONE NEW NAME IN THE BOOK. PoderData/Aya (BR-04974/2026, fieldwork Aug 23 to 26, n=2,400) brings a technical tie in BOTH rounds, 38% to 35% in the first and 45% to 44% in the second, and the comparison with the house itself shows the first round narrowing from 6pp to 3pp in two weeks. On price, the leader gave up 5.00pp and fell to 57.50%, his lowest level since Jul 1, and the runner-up rose 1.30pp, to 36.85%, his highest since May 13. The distance between the two fell from 26.95pp to 20.65pp and narrowed from both sides. ⚠️ That is NOT the narrowest gap of anything: in May the runner-up was ahead of the leader. ⭐ Augusto Cury got a confirmed price and closed at 4.05%, the third largest in the book, with 23.75% in the third-place contract for the first round and 3.70% in the second-place one. And Renan Santos touched the floor of his entire series, at 1.70% in the record, and was already back at 2.35% by 10:49 PM.`,
  'polymarketComparison.sources':
    `Polymarket prices via the AFOS proxy, and the panel only publishes a price that two independent readings, taken eight minutes apart, confirm within 0.20pp. The confirmation is done contract by contract. On Aug 27 all five books tracked confirmed in the 10:49 PM reading, including Augusto Cury's contract, which opened that same day. Polls filed with the TSE and released by the institutes, as reported by Poder360, Gazeta do Povo, CNN Brasil, Exame, UOL, CartaCapital, G1, Folha de S.Paulo, O Globo, Estadão, Valor Econômico, VEJA, BBC and Jornal de Brasília. PoderData/Aya of Aug 27 was checked against two sources, with the TSE registration number matching and with the national scope confirmed in the release, which states 555 municipalities across the 27 federal units. Series superlatives checked in the Neon backup, in backup/neon/marketPrice, which holds the full record since Apr 14.`,
  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `57.50% (vol USD 9.30M) in the ${S}, down 5.00pp on the day, the largest move on the panel in the outright-winner contract. The fall was continuous, across five successive readings. ⚠️ It is the lowest level since Jul 1: the last reading below that was on Jun 30 at 4:30 PM UTC, at 55.50%, checked in the backup against the full series since Apr 14. The series top is still 67.50%, from Aug 16. His distance to the runner-up fell to 20.65pp.`,
  'polymarketComparison.candidates[1].polymarket': `36.85%`,
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `36.85% (vol USD 9.11M) in the ${S}, up 1.30pp, the largest gain of the day among the outright-winner contracts. ⭐ It is his highest level since May 13: the last point above that was on May 13 at 2:00 AM UTC, at 42.80%, checked in the backup. The series top is still 45.50%, from May 6. In the second-place contract for the first round he gave up 3.00pp, to 84.50%.`,
  'polymarketComparison.candidates[2].polymarket': `4.05%`,
  'polymarketComparison.candidates[2].tendenciaPesquisa':
    `⭐ THE 4% FROM TODAY'S PoderData/Aya IS HIS HIGHEST FIGURE ANYWHERE IN THE PANEL'S TABLE, which gathers the national polls of the last 30 days and had measured him between 1% and 3% until now. He is level with Renan Santos and Ronaldo Caiado in the first round. BTG/Nexus of Aug 24, which feeds the figure in this block, measured him at 2%.`,
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `4.05% (vol USD 2.12M) in the ${S}. ⭐ THE CONTRACT OPENED ON THURSDAY, at 12:30 AM UTC, and he is already the third largest price in the presidential book, ahead of Renan Santos and Ronaldo Caiado. He also marks 23.75% in the third-place contract for the first round and 3.70% in the second-place one. ⚠️ His series has five points, all from today, between 0.80% and 5.00%: in a newly opened contract a swing like that does not tell price from noise.`,
  'polymarketComparison.candidates[3].polymarket': `2.35%`,
  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `2.35% (vol USD 11.65M) in the ${S}. ⚠️ The contract TOUCHED the floor of its entire series on Thursday: the record marked 1.70% across four successive readings and none of the 350 points since Apr 14 sits below that, checked in the backup. An hour later he was already back at 2.35%. The series top is 49.60%, from Apr 28. In the third-place contract for the first round he gave up 9.50pp, to 36.00%, the largest single move on the panel today, and he is still the most expensive name in that contract.`,
  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `0.15% (vol USD 6.80M) in the ${S}, down 0.30pp, which puts him below the 0.5% floor of the double reading. In the third-place contract for the first round he gave up 5.50pp, to 33.50%, his lowest level there since Aug 14.`,
  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `0.15% (vol USD 3.03M) in the ${S}, unchanged, and below the 0.5% floor of the double reading.`,
  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `0.05% (vol USD 14.06M) in the ${S}, unchanged. It is the largest accumulated volume in the presidential book, and he has been below the watch floor for weeks: high volume with a price pinned to zero is an old position unwound, not an active contract.`,
  'polymarketComparison.candidates[7].polymarket': `0.15%`,
  'polymarketComparison.candidates[7].tendenciaPolymarket':
    `0.15% (vol USD 6.21M) in the ${S}, unchanged on the day, and below the 0.5% floor of the double reading.`,
  'polymarketComparison.candidates[8].tendenciaPolymarket':
    `0.05% (vol USD 7.30M) in the ${S}, unchanged.`,
})
