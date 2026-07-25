/** Mapa EN de analysis-criteriosa.json — /atualizar 25/Jul/2026. */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/en/glossary#${id})`

construir('analysis-criteriosa', 'en', {
  subtitle:
    `UPDATE Jul 25, 3:51pm BRT, 71 days from the ${G('first round', 'primeiro-turno')}. The polling drought is over: ${G('Datafolha', 'datafolha')} (Tier 1) was released on the evening of Jul 24, with n=2,004, fieldwork Jul 22 to 24, a 2pp margin and ${G('TSE', 'tse')} filing BR-01166/2026, and what it shows is STABILITY, not a reversal. Against the June Datafolha, Lula goes from 41% to 40% in the first round and Flávio from 31% to 32%, while in the head-to-head runoff Lula goes from 47% to 48% and Flávio stays at 43%: the two readings moved in opposite directions and both inside the margin, which is the signature of sampling noise and not of a trend. Rejection came in identical to June for both names, Flávio 48% and Lula 46%. On the same day the ${G('PL', 'pl')} formalized Flávio's candidacy in São Paulo, with a speech by Argentine president Javier Milei on the platform, the market moved the other way: Lula rose 1.00pp and closed the capture at 62.50%, his highest price in the entire AFOS series, which begins on Apr 14, and Flávio fell 0.10pp to 22.85%, close to the 22.00% floor he set on Jul 3. The gap went to +39.65pp and passed the +39.50pp of Jul 3, becoming the widest of the 99 days of series available. Mandatory caveat: coinciding on the calendar is not causing, and AFOS has no way to attribute the move to the event. Renan Santos lost 1.40pp and fell to 10.35%, on the same day Datafolha measured him at 3%, which puts three of the four recent national polls in the same place and leaves Real Time's 9% isolated. On the institutional front, Itamaraty denied visas to two US State Department officials who intended to come to Brazil to question the electoral system, and Lula replied that anyone who meddles in the Brazilian election will take a beating. Total accumulated volume in the presidential market at USD 115.79M. Cross-check with live ${G('Polymarket', 'polymarket')} Jul 25, 6:51pm UTC, confirmed by double reading.`,

  'candidates[0].header':
    `Polymarket 62.50% (up 1.00pp, vol USD 7.64M accumulated), 71 days from the election. It is his highest price across the entire AFOS series, which covers 99 days since Apr 14 and whose previous top was 61.50%, set on Jul 3 and matched on Jul 24. The gap over Flávio went to +39.65pp and also became the widest in the series, above the +39.50pp of Jul 3. In the polling, the Datafolha of Jul 24 gives him 40% in the first round and 48% in the head-to-head runoff against 43% for Flávio.`,
  'candidates[0].fortes[0]':
    'He broke the series ceiling: 62.50% is his highest price in the 99 days of AFOS history, above the 61.50% of Jul 3 that had been the upper limit.',
  'candidates[0].fortes[1]':
    'The +39.65pp gap passed the previous peak of +39.50pp (Jul 3) and is the widest in the available series. The window is declared on purpose: the series begins on Apr 14 and proves nothing before that.',
  'candidates[0].fortes[2]':
    'The Datafolha of Jul 24 keeps him ahead in all three runoff scenarios tested: 48% x 43% against Flávio, 47% x 40% against Caiado and 48% x 40% against Zema.',
  'candidates[0].fortes[3]':
    'Personal approval at 49% against 48% disapproval in the Datafolha, with the two ends swapping places relative to June, when it was 48% x 49%.',
  'candidates[0].fortes[4]':
    'The rise came on the day his main opponent held his launch convention, meaning the market did not respond to the event on the other side with any transfer of price.',
  'candidates[0].fracos[0]':
    'The swap of approval and disapproval is 1pp in a survey with a 2pp margin: it is a statistical tie in both rounds and not a reversal. Treat it as stability.',
  'candidates[0].fracos[1]':
    'The assessment of the ADMINISTRATION remains negative and is a different question from personal approval: 38% consider the government poor or terrible against 32% excellent or good.',
  'candidates[0].fracos[2]':
    'The distance between price and polling persists: 62.50% of implied probability coexisting with a Datafolha that gives a 5pp lead in the runoff, a difference that fits within the sum of the margins.',
  'candidates[0].fracos[3]':
    'In the first round, Datafolha shows Lula falling from 41% to 40% and Flávio rising from 31% to 32%, meaning the only reading that narrowed was precisely the declared vote.',
  'candidates[0].fracos[4]':
    'There is no way to attribute the rise to the day\'s event. The capture is from 3:51pm and the convention ran during the afternoon: a coincidence of dates does not establish cause, and a move without a documented cause unwinds as easily as it came.',
  'candidates[0].analise':
    `The day delivered the two halves that had been missing, and they do not point the same way. The polling came back after two days of drought and what it says is stability: the Datafolha of Jul 24 (n=2,004, fieldwork Jul 22 to 24, 2pp margin, BR-01166/2026) puts Lula at 40% in the first round against 41% in June, and at 48% in the runoff against 47% in June. The two readings moved 1pp in OPPOSITE directions, both inside the margin, which is the classic signature of sampling noise. Rejection did not move for either name, coming in identical to June. The market, over the same interval, did the opposite of standing still: it rose 1.00pp and closed at 62.50%, breaking the 61.50% that had been the ceiling of the entire AFOS series since Apr 14, and took the gap to +39.65pp, above the previous peak of +39.50pp of Jul 3. That window has to be stated precisely, and for a practical reason: the AFOS public API caps history queries at 90 days, so anyone checking a superlative through it measures 90 days and calls it a cycle. The check was run directly against the base, which holds 99 days, and in it today's figure is the highest. What the base does NOT prove is what happened before Apr 14, and that is why this reads widest of the series, not widest of the cycle. On cause, AFOS goes no further than the data supports: the rise happened on the day of the convention that formalized the opponent, with a foreign head of state on the platform, but the capture is from 3:51pm and there is no way to separate reaction to an event from continuation of a trend, since the gap had been rising since Jul 20, when it stood at +33.60pp. The coincidence is recorded and that is all. His accumulated volume is USD 7.64M, in a presidential market totalling USD 115.79M.`,

  'candidates[1].header':
    `Polymarket 22.85% (down 0.10pp, vol USD 7.65M accumulated), on the day the PL formalized his candidacy in São Paulo with a speech by Javier Milei. The price sits close to the 22.00% floor he set on Jul 3, the lowest of the entire 99-day series. In the polling, the Datafolha of Jul 24 gives him 32% in the first round and 43% in the head-to-head runoff against 48% for Lula.`,
  'candidates[1].fortes[0]':
    'Datafolha records the only move in his favour on the day: he rose from 31% to 32% in the first round against the June round, even if inside the margin.',
  'candidates[1].fortes[1]':
    'In the head-to-head runoff he stays at 43%, the same level as June, meaning he lost no declared ground despite the run of procedural developments in recent weeks.',
  'candidates[1].fortes[2]':
    'He recovered 2.50pp in the sub-market for second place in the first round, going to 76.50%, which consolidates his position as the one who reaches the runoff if there is one.',
  'candidates[1].fortes[3]':
    'The convention came with explicit international backing: Milei spoke from the platform and said he trusts him to stop Lula, giving the launch press reach no other pre-candidate in the field has had.',
  'candidates[1].fortes[4]':
    'The candidacy was formalized, which closes the pre-candidacy phase and opens the campaign calendar.',
  'candidates[1].fracos[0]':
    'The price fell on the very day of the launch convention: 22.85%, just 0.85pp above the historic floor of 22.00% set on Jul 3.',
  'candidates[1].fracos[1]':
    'Rejection did not give an inch: 48% in the Datafolha of Jul 24, exactly the same figure as June, and the highest among all names tested, above Lula\'s 46%.',
  'candidates[1].fracos[2]':
    'He reached the convention WITHOUT a running mate. Tereza Cristina declined the invitation, and her price in the presidential book remains at 0.15%.',
  'candidates[1].fracos[3]':
    'The gap against Lula went to the widest value in the series, +39.65pp, precisely on the date he should have been capitalizing on the launch.',
  'candidates[1].fracos[4]':
    'Milei\'s presence came together with a direct attack on a Supreme Court justice, called "bald garbage" from the platform, which shifts coverage of the launch onto institutional friction.',
  'candidates[1].analise':
    `The day was built for him and the price did not follow. The PL formalized the candidacy in São Paulo, with an AI-generated video of Jair Bolsonaro, backing from Michelle and a roughly 30-minute speech by Argentine president Javier Milei, who said he trusts him to stop Lula and referred to Alexandre de Moraes as "bald garbage" for not authorizing his visit to Jair under house arrest (Folha de S.Paulo, O Globo, CartaCapital, Metrópoles, Jul 25). The market closed the capture with him at 22.85%, down 0.10pp, less than 1pp above the floor of the entire series. The polling, measured BEFORE the convention, is the good part: the Datafolha of Jul 24 puts him at 32% in the first round, a point above June, and holds the 43% of the runoff. But it also shows the ceiling: his rejection came in at 48%, without moving a digit against June, and it is the highest in the field. That is the figure that explains why rising in the first round does not bring him closer to the runoff. Two structural problems crossed the convention unresolved. The first is the running mate: he reached the launch with no name settled, after Tereza Cristina declined the invitation, and his stated preference for a woman still has no taker. The second is the ${G('centrão', 'centrao')}, with the União Progressista federation having declared neutrality on Jul 22. In the second-place sub-market there was a real gain, of 2.50pp to 76.50%, but that book is worth USD 202 thousand, against USD 7.65M for his main price, and the difference in size calls for caution. The contrast on record, with no value judgment: the candidacy was launched with international backing and real money moved the other way on the same day.`,

  'candidates[2].header':
    `Polymarket 10.35% in the winner market (down 1.40pp, vol USD 8.50M accumulated), the sharpest drop in the presidential book on the day. The Datafolha of Jul 24 measured him at 3% in the first round, and with that three of the four recent national polls put him at that level. The distortion between price and polling narrowed for the first time in days, but through a move in the price and not in the poll.`,
  'candidates[2].fortes[0]':
    'He still holds the third-highest price in the presidential book and the largest accumulated volume among the competitive names, USD 8.50M, above Lula and Flávio.',
  'candidates[2].fortes[1]':
    'He holds 66.00% in the sub-market for third place in the first round, meaning the market still treats his position in the chasing pack as settled.',
  'candidates[2].fortes[2]':
    'He rose 0.60pp for second place in the first round, to 12.00%, keeping the runoff scenario alive despite the fall in his main price.',
  'candidates[2].fortes[3]':
    'His rejection in the Datafolha is 12%, a quarter of Flávio\'s, which preserves room to grow that the top two candidates do not have.',
  'candidates[2].fracos[0]':
    'He lost 1.40pp on the day, the sharpest drop in the book, and fell back into the 10% range.',
  'candidates[2].fracos[1]':
    'Datafolha, the heaviest polling reading in the set, measured him at 3%, confirming Gerp Jul 22 and Indexa Jul 21 and isolating the 9% from Real Time Jul 21.',
  'candidates[2].fracos[2]':
    'The distortion against the polling remains the widest on the panel: 10.35% of price against 3% of declared vote in the three converging readings.',
  'candidates[2].fracos[3]':
    'Measured against the whole series, 10.35% sits well below the 17.90% peak of Jun 9, so today\'s price is not a high point, it is a retreat from a level already lost.',
  'candidates[2].analise':
    `The missing test arrived and it went the way the other polls had been pointing. The Datafolha of Jul 24, the heaviest national poll in the set, measured Renan Santos at 3% in the first round. With that, three of the four most recent national polls (Datafolha Jul 24, Gerp Jul 22 and Indexa Jul 21) put him at 3%, and the 9% from Real Time on Jul 21 stands alone. The market answered the same day: the price fell 1.40pp, the sharpest drop in the presidential book, back to 10.35%. It is worth recording precisely what happened to the distortion AFOS has been tracking: it narrowed, but the thing that moved was the PRICE, not the poll. The distance between the 10.35% of implied probability and the 3% of declared vote is still the widest on the panel, and it is still a comparison between different quantities, probability of victory against vote intention, which calls for caution in any reading of error. The internal rearrangement of the sub-markets ran contrary to the main price: he rose 0.60pp for second place, to 12.00%, and gave up 1.00pp for third place, to 66.00%. Series caveat, measured against the whole base and not the short window: 10.35% is neither his high nor his low. The peak was 17.90% on Jun 9 and the series floor is 5.30% on Apr 26. He holds the largest accumulated volume among the competitive names in the book, USD 8.50M, which means traded history, not current conviction.`,

  'candidates[3].header':
    `Polymarket: Caiado 1.90% (up 0.15pp, vol USD 5.12M), Michelle 1.15% (up 0.30pp, vol USD 9.25M), Jair 1.25% (up 0.20pp, vol USD 5.24M), Zema 0.75% (down 0.20pp, vol USD 4.53M), Haddad 0.65% (up 0.30pp, vol USD 6.35M), Tarcísio 0.15%. In the Datafolha of Jul 24, Caiado has 4%, Zema 3% and both lose the runoff to Lula, 47x40 and 48x40.`,
  'candidates[3].subtitle':
    `Jul 25, 71 days out: the polling came back and gave the chasing pack its most complete measurement in weeks. The Datafolha of Jul 24 puts Caiado at 4%, Zema at 3% and Augusto Cury at 2%, and in the runoffs tested Lula beats Caiado 47% to 40% and Zema 48% to 40%, margins WIDER than the 5pp against Flávio. In the book the day brought broad gains: Caiado at 1.90% (up 0.15pp), Michelle at 1.15% (up 0.30pp), Jair at 1.25% (up 0.20pp) and Haddad at 0.65% (up 0.30pp), with Zema the only one to fall, 0.20pp to 0.75%.`,
  'candidates[3].caiado.label':
    'CAIADO (PSD), presidential Polymarket 1.90% (up 0.15pp, vol USD 5.12M) | third place in the first round 16.00% (flat) | Datafolha Jul 24 first round 4% and runoff Lula 47% x Caiado 40%, rejection 12% | Gerp Jul 22 first round 3% | Indexa Jul 21 first round 6% | Real Time Jul 21 first round 7%',
  'candidates[3].caiado.fortes':
    'He is the best-polling name in the chasing pack in the Datafolha of Jul 24, with 4% in the first round, and has one of the lowest rejection rates in the field, 12%, against 48% for Flávio and 46% for Lula. That room to grow is precisely what the market prices when it keeps him alive despite the low declared vote. He gave back the previous day\'s fall, rising 0.15pp to 1.90%, and held 16.00% for third place in the first round. He keeps a pure PSD ticket (Kassab as running mate) with a base in Goiás.',
  'candidates[3].caiado.fracos':
    'Datafolha dismantled the competitive-runoff thesis: Lula beats him 47% to 40%, seven points, a margin WIDER than the five points against Flávio. In other words, the reading that a centrist name would be the stronger opponent does not hold up in this poll. He measures 4% of declared vote and is worth 1.90% in the winner book, a contrast that persists with no sign of correction.',
  'candidates[3].haddad.label':
    'HADDAD (PT), presidential Polymarket 0.65% (up 0.30pp, vol USD 6.35M) | not tested for president by any national poll, including the Datafolha of Jul 24 | focus on the São Paulo state government | ticket formalized on Jul 25 with Márcio França (PSB) as running mate',
  'candidates[3].haddad.fortes':
    'His ticket for the São Paulo state government was formalized at a PT convention in Campinas on Jul 25, with Márcio França (PSB) as running mate and Lula in attendance, ending months of negotiation (Poder360, CartaCapital, Estadão). He remains the PT\'s leading figure in the country\'s largest electorate and rose 0.30pp in the presidential book, to 0.65%.',
  'candidates[3].haddad.fracos':
    'No national poll tests him for president, including the Datafolha of Jul 24, so his price is the residue of a well-known name and has no polling basis in the office being priced. The 0.30pp rise coincided with the state convention, but the coincidence is recorded without attributing cause, not least because the office is a different one. The São Paulo race does not enter this panel, which is national in scope.',
  'candidates[3].zema.label':
    'ZEMA (Novo), presidential Polymarket 0.75% (down 0.20pp, vol USD 4.53M) | Datafolha Jul 24 first round 3% and runoff Lula 48% x Zema 40%, rejection 13% | Gerp Jul 22 first round 3% | Indexa Jul 21 first round 3% | no running mate announced, and Michelle ruled out the slot',
  'candidates[3].zema.fortes':
    'He keeps rejection low by the standards of this field, 13% in the Datafolha of Jul 24, in a race where the top two candidates are above 45%. He polls 3% consistently in the recent national surveys (Datafolha, Gerp and Indexa), plus 3.7% in Futura/Apex Jul 14 and 4% in BTG/Nexus Jul 13, meaning his level is stable and not erratic. He advocates privatizing Petrobras and Banco do Brasil in a possible government (Jornal do Brasil), a position that sets him apart in the chasing pack.',
  'candidates[3].zema.fracos':
    'He was the ONLY one in the chasing pack to fall on the day, giving back 0.20pp of the Jul 24 jump and returning to 0.75%, while Caiado, Michelle, Jair and Haddad all rose. In the Datafolha he loses the runoff to Lula 48% to 40%, the widest margin among the three runoff scenarios tested, and his 13% rejection is the highest in the chasing pack. Michelle Bolsonaro publicly ruled out being his running mate, and the ticket still has no number two with conventions running until Aug 5.',
  'candidates[3].analise':
    `Datafolha gave the chasing pack its most complete measurement in weeks, and the result is a clear ceiling. Caiado comes in at 4% in the first round, Zema at 3% and Augusto Cury at 2%. In the runoffs tested, Lula beats Caiado 47% to 40% and Zema 48% to 40%, margins WIDER than the 5pp against Flávio, which cuts against the thesis that a centrist name would be the more competitive opponent. The figure that supports the opposite thesis, and which has to be recorded alongside, is rejection: Caiado at 12% and Zema at 13%, against 48% for Flávio and 46% for Lula, meaning they have room to grow that the top two do not, and it is that room the market prices when it keeps them alive despite the low declared vote. In the book, the day brought broad gains in the chasing pack: Caiado rose 0.15pp, Michelle 0.30pp, Jair 0.20pp and Haddad 0.30pp, with Zema the only one to fall, 0.20pp. Michelle rising on the day she appeared backing Flávio at the convention is a record of coincidence, not of cause. Haddad had his São Paulo state ticket formalized at a PT convention in Campinas, with Márcio França as running mate and Lula in attendance, but that is a state race and does not enter the national panel, which covers the presidential office only. The same methodological caveat applies across the chasing pack: these are prices from 0.65% to 1.90% in a book where the favourite is worth 62.50%, so a move in percentage points looks large in relative terms and is small in money.`,
  'candidates[3].fortes[0]':
    'Caiado is the best-polling name in the chasing pack in the Datafolha, with 4% in the first round, and has the second-lowest rejection in the field, 12%.',
  'candidates[3].fortes[1]':
    'Michelle rose 0.30pp on the day of the convention where she appeared backing Flávio, the largest relative gain among the names in the chasing pack.',
  'candidates[3].fortes[2]':
    'Zema keeps rejection low, 13% in the Datafolha, in a field where the top two candidates are above 45%.',
  'candidates[3].fortes[3]':
    'Haddad rose 0.30pp, to 0.65%, on the day of the convention that formalized his São Paulo state ticket with Márcio França as running mate.',
  'candidates[3].fracos[0]':
    'None of them passes 4% in the Datafolha, and the two tested in the runoff lose by 7pp and 8pp, margins wider than Flávio\'s.',
  'candidates[3].fracos[1]':
    'Zema fell 0.20pp and was the only one in the chasing pack to retreat on the day, reaching the conventions still without a running mate.',
  'candidates[3].fracos[2]':
    'Caiado polls 4% and is worth 1.90% in the winner book, a contrast that persists with no sign of correction.',
  'candidates[3].fracos[3]':
    'Haddad still has no national basis: no poll tests him for president, and the price is the residue of a well-known name.',
  'candidates[3].fracos[4]':
    'Tarcísio remains at 0.15% in the presidential market with the largest individual volume in the book, a reminder that accumulated volume measures traded history and not current conviction.',

  'quadroComparativo[0].p':
    'Datafolha Jul 24 (n=2,004, fieldwork Jul 22-24, BR-01166/2026): 40% in the first round and 48% in the head-to-head runoff against 43% for Flávio. He also beats Caiado (47x40) and Zema (48x40). Personal approval 49% x 48%, administration 32% excellent or good against 38% poor or terrible. Against the June Datafolha, he fell 1pp in the first round and rose 1pp in the runoff, both inside the 2pp margin.',
  'quadroComparativo[0].m': '62.50% (vol USD 7.64M accumulated)',
  'quadroComparativo[0].t':
    'UP 1.00pp to 62.50%, his highest price in the entire AFOS series, which covers 99 days since Apr 14 and had a ceiling of 61.50%. The gap over Flávio went to +39.65pp and passed the previous peak of +39.50pp (Jul 3).',
  'quadroComparativo[0].s':
    '71 days from the election. The rise came on the day of the convention that formalized the opponent, with Milei on the platform, but the capture is from 3:51pm and a coincidence of dates does not establish cause. The gap had been widening since Jul 20, when it stood at +33.60pp. Live Polymarket Jul 25, 6:51pm UTC, double reading.',
  'quadroComparativo[1].p':
    'Datafolha Jul 24: 32% in the first round, a point above June, and 43% in the head-to-head runoff, the same level as June. Rejection of 48%, identical to June and the highest among all names tested. The three previous national polls kept him between 30% and 38% in the first round.',
  'quadroComparativo[1].m': '22.85% (vol USD 7.65M accumulated)',
  'quadroComparativo[1].t':
    'DOWN 0.10pp to 22.85% on the very day of the launch convention, 0.85pp above the series floor of 22.00% (Jul 3). In compensation he rises 2.50pp for second place in the first round, to 76.50%.',
  'quadroComparativo[1].s':
    'The PL formalized the candidacy in São Paulo with an AI-generated video of Jair, backing from Michelle and a speech by Milei, who called Moraes "bald garbage". He reached the launch WITHOUT a running mate: Tereza Cristina declined the invitation. The União Progressista federation has been neutral since Jul 22.',
  'quadroComparativo[2].p':
    'The Datafolha of Jul 24 measures him at 3% in the first round, confirming Gerp Jul 22 and Indexa Jul 21. Three of the four recent national polls put him at 3%, and the 9% from Real Time Jul 21 is left isolated. Rejection of 12%, a quarter of Flávio\'s.',
  'quadroComparativo[2].m': '10.35% (vol USD 8.50M accumulated)',
  'quadroComparativo[2].t':
    'DOWN 1.40pp to 10.35%, the sharpest drop in the presidential book on the day, responding to the Datafolha that put him at 3%. He rises 0.60pp for second place (12.00%) and gives up 1.00pp for third place (66.00%).',
  'quadroComparativo[2].s':
    'The distortion against the polling narrowed, but through a move in the PRICE and not in the poll, and it remains the widest on the panel. Series caveat: 10.35% is neither a high nor a low. The peak was 17.90% on Jun 9 and the floor 5.30% on Apr 26.',
  'quadroComparativo[3].p':
    'Datafolha Jul 24: 4% in the first round, the best in the chasing pack, and he loses the runoff to Lula 47% to 40%, a margin wider than Flávio\'s. Rejection of 12%, among the lowest in the field, which preserves room to grow.',
  'quadroComparativo[3].m': '1.90% (vol USD 5.12M)',
  'quadroComparativo[3].t':
    'UP 0.15pp to 1.90%, giving back the previous day\'s fall, and holds 16.00% for third place in the first round.',
  'quadroComparativo[3].s':
    'He polls 4% of declared vote and is worth 1.90% in the winner market. The competitive runoff against Lula was not confirmed in the Datafolha, which gave the opponent a 7pp lead.',
  'quadroComparativo[4].p':
    'She is not a declared pre-candidate for the presidency and is not tested in the main first-round scenario by the national polls.',
  'quadroComparativo[4].m': '1.15% (vol USD 9.25M)',
  'quadroComparativo[4].t':
    'UP 0.30pp to 1.15%, back above the 1% mark on the day she appeared backing Flávio at the PL convention.',
  'quadroComparativo[4].s':
    'The coincidence of dates is recorded, with no attribution of cause. Her accumulated volume, USD 9.25M, is the largest in the presidential book among names other than Tarcísio, despite a price below 1.5%.',
  'quadroComparativo[5].p':
    'No polling. Market on the impeachment of a Supreme Court justice before 2027.',
  'quadroComparativo[5].m': '3.50% (vol USD 83 thousand)',
  'quadroComparativo[5].t':
    'DOWN 0.05pp to 3.50%, essentially flat, neither giving back nor extending the 0.60pp rise of Jul 24.',
  'quadroComparativo[5].s':
    'Decisive methodological caveat: with USD 83 thousand in accumulated volume, against USD 115.79M in the presidential market, the move does not support a narrative. Standing still on the day Milei attacked Moraes by name from the platform is the record that matters.',

  cruzamento:
    `Jul 25 delivered the sharpest cross-check of the month, and it is one of DIVERGENCE between what the polling measures and what real money prices. Start with the polling, because it is the new thing: after two days of drought, Datafolha was released on the evening of Jul 24 (n=2,004, fieldwork Jul 22 to 24, 2pp margin, 95% confidence, BR-01166/2026) and what it shows is stability. Lula 40% and Flávio 32% in the first round, against 41% and 31% in June. In the head-to-head runoff, Lula 48% and Flávio 43%, against 47% and 43%. The two readings moved a point in OPPOSITE directions, both inside the margin: the first round narrowed and the runoff widened. When two cuts of the same poll move in opposite directions and both fit inside the margin, the correct reading is sampling noise, not a trend. Rejection reinforces it: Flávio 48% and Lula 46%, figures identical to June, without a digit of difference. Now the market, on the same day. Lula rose 1.00pp and closed the capture at 62.50%, breaking the 61.50% that had been the ceiling of the entire AFOS series. Flávio fell 0.10pp to 22.85%, less than 1pp above the series floor. The gap went to +39.65pp, above the previous peak of +39.50pp of Jul 3, and became the widest of the 99 days of base available. The window has to be named, and here is the technical reason: the AFOS public history API caps queries at 90 days, so any superlative checked through it measures 90 days and calls it a cycle. Today's check was run directly against the base, which holds 99 days since Apr 14, and in it the figure is the highest. What the base does not prove is what happened before Apr 14, and that is why AFOS records widest of the series, never widest of the cycle. Add the context and the divergence becomes plain: all of this happened on the day the PL formalized Flávio in São Paulo, with an AI-generated video of Jair Bolsonaro, backing from Michelle and a speech by Javier Milei, who asked for votes to stop Lula and called Alexandre de Moraes "bald garbage". The candidacy was launched with the backing of a foreign head of state and the candidate's price fell in the same session. AFOS reports the coincidence and does NOT attribute cause: the capture is from 3:51pm, the convention ran during the afternoon, and the gap had already been widening since Jul 20, when it stood at +33.60pp. Separating reaction to an event from continuation of a trend is not possible with the data available. The day's third axis was institutional and it intersects with the other two. Itamaraty denied visas to two US State Department officials, assistant secretary Riley M. Barnes and deputy assistant secretary Samuel Samson, who applied on Jul 20 and intended to discuss the Brazilian electoral system (Washington Post, Correio Braziliense, Estadão, SBT News). Lula replied at a PT convention that anyone coming from abroad to meddle in the Brazilian election will take a beating, noting that 157 million voters decide the outcome. The fourth axis, in the Master case, is the freeze of up to R$ 135 million ordered by the Rio courts on Jul 23 against the bank, Trustee, Axor Asset and two partners, over Rioprevidência's losses in a fund concentrated in Ambipar shares. Finally, a contrast of scale the panel has to keep in view: in the Senate seats market the PL rose 2.00pp, to 70.50%, and the MDB 1.80pp, to 17.25%, but that entire book totals USD 290 thousand, against USD 115.79M for the presidential market. A large percentage move in a thin market is not big money, and it is not a signal. The summary, with no value judgment of any kind: the polling says the race is flat and tight in the runoff, the market says it is at the most lopsided point of the entire series, and both were measured in the same week.`,
})
