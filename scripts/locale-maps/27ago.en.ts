/**
 * Mapa EN de 27/Ago/2026 para os três JSONs do painel do Brasil.
 * Convenções EN: PONTO decimal e VÍRGULA de milhar.
 * ⛔ `updatedAt` e `lastUpdate` NÃO se traduzem.
 * 🏷️ `pesquisa` é `poll`, nunca `research`; `urna` é `polling`.
 */
import { construir } from '../build-locale-json'

const G = (termo: string, id: string) => `[${termo}](/en/glossary#${id})`
const S = 'confirmed reading of Aug 27, 9:46 PM BRT (12:46 AM UTC on Aug 28)'
const CURY = 'Augusto Cury’s outright-winner contract opened on Thursday and this round does not publish a price for it. His second-place and third-place contracts do confirm, and those are the ones shown on the panel.'

// ─────────────────────────────────────────────── analysis-data
construir('analysis-data', 'en', {
  'cards.sentimento.text1':
    `The presidential book has accumulated USD 137.47M and the price on this page is from the ${S}. The day brought one new national poll, PoderData/Aya, with a ${G('technical tie', 'empate-tecnico')} in both rounds, and it brought a NEW name getting contracts in the price book.`,
  'cards.sentimento.text2':
    `On price, the leader gave up 5.00pp and fell to 57.50%, his lowest level since Jul 1, with the decline coming across five successive readings through the day. The runner-up rose 0.30pp, to 35.85%, his highest since May 13. The distance between the two narrowed from 26.95pp to 21.65pp, and it narrowed from the top: the one who moved was the first.`,
  'cards.sentimento.text3':
    `The largest move of the day is not in the outright-winner contract. It is in the placement contracts, where three names gave ground at once: Renan Santos lost 9.00pp in the third-place contract for the ${G('first round', 'primeiro-turno')}, to 36.50%, Ronaldo Caiado lost 5.50pp, to 33.50%, and Flávio Bolsonaro lost 3.00pp in the second-place contract, to 84.50%. On the same day ${G('Polymarket', 'polymarket')} opened contracts for Augusto Cury, who shows up at 23.50% in the third-place book and 4.00% in the second. The panel records the simultaneity and does not claim a transfer.`,
  'cards.sentimento.direita':
    `Flávio Bolsonaro at 35.85% in the presidential book, up 0.30pp, and his highest level since May 13, checked in the backup against the full record since Apr 14. In the second-place contract for the first round he gave up 3.00pp, to 84.50%. In the polling, PoderData puts him 3 points back in the first round, 35% against 38%, and 1 point back in the ${G('runoff', 'segundo-turno')}, 44% against 45%, both inside the 2pp margin, with a rejection rate of 49%, level with the leader.`,
  'cards.sentimento.esquerda':
    `Lula at 57.50%, down 5.00pp and his lowest level since Jul 1. In the polling, PoderData measures him at 38% in the first round, against 41% from the same house on Aug 13, and keeps him ahead in all four runoff scenarios tested. Government approval comes in at 42% against 50% disapproval in the same round, and the administration is rated poor or terrible by 48% against great or good by 33%.`,
  'cards.sentimento.terceiraVia':
    `Here is the new development of the day. Polymarket opened contracts for Augusto Cury on Thursday, at 12:30 AM UTC, and the market has already formed a price on where he lands: 23.50% to finish third in the first round and 4.00% to finish second. ${CURY} Renan Santos fell to 1.65% in the outright-winner contract, the floor of his entire series, and Ronaldo Caiado fell to 0.15%. In the polling, PoderData gives all three of them 4%, level with each other, and puts Caiado and Zema in a technical tie with the leader in the runoff, 43% to 44% each.`,
  'cards.sentimento.polymarket':
    `Prices from the ${S}. AFOS only publishes a price that two independent readings, taken eight minutes apart, confirm within 0.20pp, and the confirmation is done contract by contract. ${CURY} Names below 0.5% stay outside that watch, because in a thin book the swing does not tell movement from noise.`,
  'cards.inss.text1':
    `⭐ THE NEW FACT OF AUG 27 IS THAT THE CASE REACHED THE TELEVISED INTERVIEW. Lula went on Jornal Nacional on Thursday, called the accusations against his son insinuations, said Lulinha will prove his innocence and denied shielding him, according to O Globo. Allies had prepared him to break away from the case and aim at his opponent, according to Estadão.`,
  'cards.inss.text2':
    `The investigation advanced on three fronts on the same day. The ${G('PF', 'pf')} is looking into a lobbyist’s request for Lulinha to act on behalf of the man known as Careca do ${G('INSS', 'inss')}, according to Folha de S.Paulo. The son’s lawyer asked the PF to investigate leaks, naming the opponent, his running mate and his campaign coordinator, according to O Globo. And Spain’s public prosecutor is reviewing a complaint about a company linked to the case, according to Gazeta do Povo.`,
  'cards.inss.text3':
    `The case also turned into an institutional dispute. The clash between André Mendonça and the Federal Police leadership created a deadlock in the investigations, according to Gazeta do Povo, and Lula tried to contain the crisis by calling for a meeting to smooth things over, according to O Globo. In Congress, lawmakers are working to open a joint inquiry into the case, according to Gazeta do Povo, while the government aims for a positive agenda to shift the focus, according to CNN Brasil.`,
  'cards.inss.text4':
    `⚠️ The case is still live and unresolved. The distinction the panel has kept from the start still holds: the effect on how the government is rated is one thing, the effect on voting intention is another, and the two do not move together by default.`,
  'cards.inss.impactoLula':
    `Not separable, and today’s round lets us say so with the cleanest comparison available, which is a house against itself. PoderData measures the leader at 38% in the first round now and measured 41% on Aug 13, with the same method, the same sample and the same margin. That is three points between two rounds from the same house, and no effect of any case is separable inside that.`,
  'cards.inss.impactoGestao':
    `The rating still carries a negative balance, and now across four readings in one week: 42% approval against 50% disapproval in today’s PoderData, 46% against 50% in Indexa/Broadcast of Aug 26, 43% against 51% in Gerp of Aug 26, and 48% against 49% in ${G('BTG/Nexus', 'nexus-btg')} of Aug 24. All four agree on the sign and disagree on the size, with six points of spread on approval.`,
  'cards.inss.conclusao':
    `On Aug 27 the case enters the highest-audience interview of the campaign and at the same time stalls its own investigation, with the clash between the reporting justice at the ${G('STF', 'stf')} and the Federal Police leadership. The panel records both moves and converts neither into a vote forecast: PoderData shows a technical tie in both rounds on the same day the leader’s price gives up 5.00pp, and those are two different measurements that merely landed on the same date.`,
  'cards.bancoMaster.text1':
    `⭐ THE NEW FACT OF AUG 27 IS THAT THE TESTIMONY HAPPENED. Daniel Vorcaro testified to the Federal Police on Thursday, by video link, from the unit where he is held, according to Jornal de Brasília and ND Mais. The testimony had been set for Aug 20, was postponed at the defense’s request and was rescheduled for today.`,
  'cards.bancoMaster.text2':
    `⚠️ The inquiry focuses on how two former supervision directors at the Central Bank acted on behalf of ${G('Master', 'banco-master')} while the institution faced a liquidity crisis. It is the former controller’s first formal statement after two plea-bargain proposals were rejected by the PF and by the Prosecutor General’s Office, according to Portal Salvador FM.`,
  'cards.bancoMaster.text3':
    `The Dark Horse case, which runs in parallel, saw three moves on Thursday: the production company asked André Mendonça to take the investigation out of São Paulo and bring the case to the STF, according to G1, Folha de S.Paulo and Valor Econômico; Flavio Dino widened the PF’s access to the evidence, according to G1; and the distributor decided to release the film after the election, according to O Globo.`,
  'cards.bancoMaster.conclusao':
    `⭐ AND HERE IS THE CROSSING OF THE DAY. The testimony went ahead, the Dark Horse case advanced against the runner-up on two judicial fronts, and his price in the outright-winner contract still rose 0.30pp, to the highest level since May 13. In the second-place contract for the first round, though, he gave up 3.00pp. The day before, the CEO of Indexa had told Estadão that he had been winning voters back after the Master case. The panel records both sides on the same date and does not decide which explains the other.`,
  'cards.stf.toffoli':
    `Extended the inquiry investigating Banco Master. Voted with Zanin to keep the Marco Civil requirement on user data.`,
  'cards.stf.moraes': `No new substantive individual ruling on Aug 27.`,
  'cards.stf.gilmar': `No new individual ruling captured on Aug 27.`,
  'cards.stf.dino':
    `Widened the Federal Police’s access to the evidence in the Dark Horse case, and investigators are weighing whether to concentrate the inquiry at the STF, according to G1.`,
  'cards.stf.mendonca':
    `⭐ HE IS THE NAME OF THE DAY AT THE COURT FOR THE SECOND DAY RUNNING, and now over an open clash. He is facing the Federal Police leadership in the inquiry about the president’s son, and the deadlock created there could set the pace of the investigations inside the campaign, according to O Globo and Gazeta do Povo. On the same Thursday the Dark Horse production company asked him to take the investigation out of São Paulo and bring the case to the STF. His proposed test for deepfakes stirred debate at the ${G('TSE', 'tse')}, and justices judge that the scope of the ban needs defining.`,
  'cards.stf.nexo':
    `⭐ THE THREAD OF THE DAY IS JURISDICTION, NOT MERITS. The campaign’s two biggest disputes, the Lulinha case and the Dark Horse case, both ran on Thursday into the question of who investigates and where: the clash between the reporting justice and the PF leadership in one, and the request to move the other from São Paulo to the STF. In both, what is at stake is the venue, and the venue is what sets the timetable of the investigations inside the electoral period.`,
  'cards.stf.analise':
    `The contract on a Supreme Court justice leaving by impeachment before 2027 sits at 3.40% (vol USD 84,000), unchanged in the ${S}. That is the fourth day running at the same level. On Thursday the court sat at the center of the campaign’s two biggest disputes, over jurisdiction and over access to evidence, and the price still did not move. The market for that contract is small, with 84,000 dollars in accumulated volume, so the panel does not treat the absence of movement as an answer to anything: it treats it as an absence of trading.`,
})

// ─────────────────────────────────────────────── analysis-criteriosa
construir('analysis-criteriosa', 'en', {
  subtitle:
    `Crossing of Aug 27, 2026: Polymarket price in the ${S}, presidential book at USD 137.47M, against PoderData/Aya released on Thursday (BR-04974/2026, fieldwork Aug 23 to 26, n=2,400), which brings a TECHNICAL TIE in both rounds, and against Gerp and Indexa/Broadcast of Aug 26, which contradict each other. BTG/Nexus of Aug 24 (BR-09028/2026, n=2,006) remains the most reliable in the window on the house’s own ruler. News reviewed across 1,152 items collected on Thursday.`,
  'candidates[0].header':
    `PRICE: 57.50% (vol USD 9.27M accumulated), ${S}. Down 5.00pp on the day, the largest move on the panel in the outright-winner contract, and the lowest level since Jul 1.`,
  'candidates[0].fortes[0]':
    `Today’s PoderData/Aya (n=2,400, telephone, fieldwork Aug 23 to 26, BR-04974/2026) still puts him AHEAD in the first round, at 38% against 35%, and winning all FOUR runoff scenarios tested: 45% to 44% against Flávio Bolsonaro, 44% to 43% against Romeu Zema, 44% to 43% against Ronaldo Caiado and 44% to 37% against Renan Santos.`,
  'candidates[0].fortes[1]':
    `BTG/Nexus of Aug 24, the most reliable poll in the window, keeps him at 41% in the first round and winning the runoff 46% to 45%. The week’s three national polls put him ahead or level, and none of them puts him behind by more than 1 point.`,
  'candidates[0].fortes[2]':
    `Even after the drop, his price is still the largest in the book by a wide margin, and the runner-up is 21.65pp behind.`,
  'candidates[0].fortes[3]':
    `He went on the Jornal Nacional interview on Thursday, called the accusations against his son insinuations and said Lulinha will prove his innocence, denying that he shielded him, according to O Globo. Allies had prepared him to break away from the case and aim at his opponent, according to Estadão.`,
  'candidates[0].fortes[4]':
    `Free-to-air campaign advertising starts without Lulinha and with the opponent naming the case, according to O Globo, which moves the contest onto ground where the incumbent has more screen time.`,
  'candidates[0].fracos[0]':
    `⚠️ PoderData brings a TECHNICAL TIE in BOTH rounds for the first time in the house’s own series. In the first round its gap fell from 6pp on Aug 13 (41% x 35%) to 3pp now (38% x 35%), and in the runoff it stays at 1pp (45% x 44%, against 46% x 45%). Same house, same method and same sample: the first round narrowed by half in two weeks.`,
  'candidates[0].fracos[1]':
    `The price gave up 5.00pp in a single day, from 62.50% to 57.50%, and the decline was continuous, across five successive readings through Thursday.`,
  'candidates[0].fracos[2]':
    `⚠️ 57.50% is the lowest level since Jul 1. The last reading below that was on Jun 30 at 4:30 PM UTC, at 55.50%, checked in the database backup against the full record since Apr 14.`,
  'candidates[0].fracos[3]':
    `Rejection at 49%, level with the runner-up, according to Poder360. Government approval comes in at 42% against 50% disapproval in the same round, and the administration is rated poor or terrible by 48% against great or good by 33%, according to CNN Brasil.`,
  'candidates[0].fracos[4]':
    `⚠️ The Lulinha case gained three new fronts on Thursday: the PF is looking into a lobbyist’s request for him to act on behalf of the man known as Careca do INSS, according to Folha de S.Paulo; the son’s lawyer asked for an inquiry into leaks naming the opponent and his campaign coordinator, according to O Globo; and Spain’s public prosecutor is reviewing a complaint about a company linked to the case, according to Gazeta do Povo.`,
  'candidates[0].analise':
    `The day flips the shape of the one before. On Aug 26 his price stood still and the one moving was the runner-up; on Thursday the one who moved was him, and downward: 5.00pp across five successive readings, from 62.50% to 57.50%, the lowest level since Jul 1. On the same day PoderData/Aya published the first round from that house with a technical tie in both rounds, with the first round narrowing from 6pp to 3pp in two weeks and the runoff at 1pp. The two landed on the same date and the panel records the coincidence without assigning cause, because probability of winning and voting intention measure different things, and the same round that narrows the first round also keeps him ahead in all four runoff scenarios tested. The book also changed composition on Thursday, with contracts opening for a name that until yesterday carried no price. Even so his price is still the largest in the book by a wide margin, and the distance to the runner-up, now 21.65pp, remains the widest between any two names in the contest. ${S}.`,
  'candidates[1].header':
    `PRICE: 35.85% (vol USD 9.10M accumulated), ${S}. Up 0.30pp and his highest level since May 13.`,
  'candidates[1].fortes[0]':
    `⭐ 35.85% is his highest price since May 13. The last point above that was on May 13 at 2:00 AM UTC, at 42.80%, checked in the database backup against the full record since Apr 14. The series top is still 45.50%, from May 6.`,
  'candidates[1].fortes[1]':
    `Today’s PoderData/Aya puts him 3 points back in the first round, 35% against 38%, inside the 2pp margin, and 1 point back in the runoff, 44% against 45%. It is a technical tie in both.`,
  'candidates[1].fortes[2]':
    `The price distance to the leader fell from 26.95pp to 21.65pp in a single day, and this time it narrowed from the top, with the leader giving ground.`,
  'candidates[1].fortes[3]':
    `Rejection at 49%, the same level as the leader, according to Poder360. He went to the TSE on Thursday to bar the use of the Alvorada palace in his opponent’s campaign content, according to Folha de S.Paulo and G1.`,
  'candidates[1].fortes[4]':
    `His broadcast advertising will highlight household debt, the Lulinha case and the crisis at Casas Bahia, according to Valor Econômico, and it names his father, public safety and an appeal to women voters, according to O Globo.`,
  'candidates[1].fracos[0]':
    `In the second-place contract for the first round he gave up 3.00pp, from 87.50% to 84.50%. It is the second largest move on the panel today, and it happened on the same day a new name started carrying a price in that contract.`,
  'candidates[1].fracos[1]':
    `His gain in the outright-winner contract was 0.30pp. The gap to the leader closed by 5.30pp on the day, and 5.00pp of that came from the other side falling, not from him rising.`,
  'candidates[1].fracos[2]':
    `⚠️ The Dark Horse case advanced against him on three fronts on Thursday: the production company asked André Mendonça to take the investigation out of São Paulo and bring the case to the STF, according to G1, Folha de S.Paulo and Valor Econômico; Flavio Dino widened the PF’s access to the evidence, according to G1; and he outsourced the accounting, with the transfer from a United States fund still undetailed, according to Folha de S.Paulo.`,
  'candidates[1].fracos[3]':
    `The distributor decided to release the film after the election, according to O Globo, and PT members asked for an investigation into the relationship between his office and a target of the INSS operation, also according to O Globo.`,
  'candidates[1].analise':
    `His price closed at 35.85%, the highest since May 13, and the distance to the leader is the narrowest of the recent cycle, 21.65pp. The precise reading is that he did not do that narrowing on his own: he rose 0.30pp on a day the leader gave up 5.00pp. In the polling, PoderData/Aya puts him 3 points back in the first round and 1 point back in the runoff, both inside the 2pp margin, and the rejection of the two is level at 49%. In the second-place contract for the first round, though, he gave up 3.00pp, to 84.50%, and that happened on the same day Augusto Cury’s contract in that book came to be worth 4.00%: probability entering a new name comes out of somewhere, and it came mostly out of his. In the news, the Dark Horse case advanced by court ruling and by the production company’s request to move the inquiry to the STF, and the accounting is still missing the detail on the foreign transfer. The panel records the rise in the outright-winner contract, the fall in the second-place one and the advance of the case side by side, on the same date, and does not decide which explains what. ${S}.`,
  'candidates[2].header':
    `PRICE: 1.65% (vol USD 11.63M accumulated), ${S}. Down 1.10pp and the FLOOR of the entire series: none of the 346 points recorded since Apr 14 sits below this.`,
  'candidates[2].fortes[0]':
    `Today’s PoderData/Aya measures him at 4% in the first round, level with Ronaldo Caiado and Augusto Cury, and at 37% in the runoff against the leader. In the polling he is where he was in earlier rounds.`,
  'candidates[2].fortes[1]':
    `He is still the most expensive name in the third-place contract for the first round, at 36.50%, ahead of Ronaldo Caiado and Augusto Cury.`,
  'candidates[2].fortes[2]':
    `The accumulated volume in his outright-winner contract, USD 11.63M, is one of the largest in the presidential book, behind only names whose price sits at zero.`,
  'candidates[2].fortes[3]':
    `He was interviewed on Jornal Nacional on Thursday, in the network’s series of interviews with the presidential candidates, according to BBC.`,
  'candidates[2].fracos[0]':
    `⚠️ 1.65% is the ABSOLUTE FLOOR of his series. None of the 346 points recorded since Apr 14 sits below that, and the fall comes in a straight line: 3.10% on Aug 25, 3.00% on Aug 26, 2.70% in the early hours of Thursday and 1.65% now. The series top is 49.60%, from Apr 28.`,
  'candidates[2].fracos[1]':
    `⚠️ In the third-place contract for the first round he gave up 9.00pp, from 45.50% to 36.50%, the largest single move on the panel today. It is his lowest level in that contract since May 27.`,
  'candidates[2].fracos[2]':
    `In the second-place contract for the first round he gave up 0.50pp and sits at 1.50%, behind the 4.00% of the name that started carrying a price on Thursday.`,
  'candidates[2].fracos[3]':
    `On the Jornal Nacional interview he said he will impose a state of exception in favelas and argued that Brazil should have a nuclear bomb, according to Folha de S.Paulo. A CartaCapital assessment gave him a 2.6 score, pointing to a fluid delivery and authoritarian proposals.`,
  'candidates[2].analise':
    `His outright-winner contract recorded the lowest price of the entire series today: 1.65%, with none of the 346 points since Apr 14 below that. The fall is not a single day, it is a sequence, and it went from 3.10% on Aug 25 to 1.65% now with no rebound. In the third-place contract for the first round the loss was larger still, 9.00pp, from 45.50% to 36.50%, his lowest level in that contract since May 27, and he is still the most expensive name there. In the polling the reading is different: PoderData/Aya measures him at 4%, level with Caiado and Cury, exactly where he was in earlier rounds. The distance between the two measurements is what the panel exists to show, and it does not resolve by averaging. On the same day he went on Jornal Nacional and argued for a state of exception in favelas and for nuclear weapons. The panel records both on the same date and assigns no cause. ${S}.`,
  'candidates[3].header':
    `PRICE: Ronaldo Caiado at 0.15% (vol USD 6.80M accumulated), Romeu Zema at 0.05% (vol USD 6.13M accumulated) and Fernando Haddad at 0.05% (vol USD 7.30M accumulated) in the outright-winner contract, ${S}. All three below the 0.5% floor of the double reading.`,
  'candidates[3].subtitle':
    `The back of the pack in the ${S}. All three sit below the 0.5% floor at which the double reading tells movement from noise, so none of their swings is treated as a signal by the panel. ⭐ And on Thursday the pack gained a fourth name: Polymarket opened contracts for Augusto Cury, who shows up at 23.50% in the third-place contract for the first round and 4.00% in the second-place one.`,
  'candidates[3].caiado.label':
    `CAIADO (PSD), Poly presidential 0.15% (vol USD 6.80M accumulated, ${S}), down 0.30pp. In the third-place contract for the first round he gave up 5.50pp and sits at 33.50%, his lowest level there since Aug 14.`,
  'candidates[3].caiado.fortes':
    `Today’s PoderData/Aya measures him at 4% in the first round, level with Renan Santos and Augusto Cury, and puts him in a TECHNICAL TIE with the leader in the runoff, 43% to 44%, inside the 2pp margin. It is the second closest runoff scenario of the round, behind only the one with Flávio Bolsonaro. He is still the second most expensive name in the third-place contract for the first round.`,
  'candidates[3].caiado.fracos':
    `He gave ground in both contracts he is tracked in: 0.30pp in the outright-winner one, which takes him to 0.15% and below the watch floor, and 5.50pp in the third-place contract for the first round. Indexa of Aug 26 measured him at 5% and Gerp at 3%, and the week’s three houses disagree on his size.`,
  'candidates[3].zema.label':
    `ZEMA (Novo), Poly presidential 0.05% (vol USD 6.13M accumulated, ${S}), down 0.10pp.`,
  'candidates[3].zema.fortes':
    `PoderData/Aya puts him in a TECHNICAL TIE with the leader in the runoff, 43% to 44%, the same scenario as Ronaldo Caiado. He is still tested by the national polls, unlike Tarcísio and Haddad, and the same round measures him at 2% in the first round.`,
  'candidates[3].zema.fracos':
    `He gave up 0.10pp in the outright-winner contract and sits at 0.05%, pinned to zero and below the watch floor. In the polling, Gerp and Indexa of Aug 26 measured him at 1% each and BTG/Nexus of Aug 24 at 3%, so today’s 2% sits in the middle of that spread.`,
  'candidates[3].haddad.label':
    `HADDAD (PT), Poly presidential 0.05% (vol USD 7.30M accumulated, ${S}), unchanged.`,
  'candidates[3].haddad.fortes':
    `He is still not tested in the first round by any national poll, which keeps him out of the divergence graph on purpose. The JOTA poll released on Aug 26 (BR-07806/2026, 6,000 online interviews, fieldwork Jul 27 to Aug 24) declared a runoff scenario with him in the leader’s place against Flávio Bolsonaro.`,
  'candidates[3].haddad.fracos':
    `The figures from the JOTA scenario did not come out in a source the panel can reach, so nothing from it went into the table. His outright-winner contract has sat at 0.05% for weeks, with USD 7.30M in accumulated volume: high volume with a price pinned to zero is an old position unwound, not an active contract.`,
  'candidates[3].fortes[0]':
    `⭐ AUGUSTO CURY (Avante) STARTED CARRYING A PRICE ON THURSDAY. His contracts opened in the presidential book at 12:30 AM UTC, and he is already the third most expensive name in the third-place contract for the first round, at 23.50%, behind only Renan Santos and Ronaldo Caiado. In the second-place one he marks 4.00%, ahead of Renan Santos.`,
  'candidates[3].fortes[1]':
    `In the polling, today’s PoderData/Aya measures Cury at 4% in the first round, level with Renan Santos and Ronaldo Caiado. Those are his highest 4% anywhere in the panel’s table, which gathers the national polls of the last 30 days and had measured him between 1% and 3% until now.`,
  'candidates[3].fortes[2]':
    `He was the most searched presidential candidate on Google during the debate and the one with the largest growth in followers and searches, according to CNN Brasil and Pleno.News, and he gained 2 million followers, according to SpaceMoney. He is the ${G('Avante', 'avante')} candidate, confirmed at a convention on Aug 3, with Júlio Delgado as running mate.`,
  'candidates[3].fortes[3]':
    `Ronaldo Caiado and Romeu Zema are in a technical tie with the leader in the PoderData runoff, 43% to 44% each, both inside the 2pp margin.`,
  'candidates[3].fracos[0]': `⚠️ ${CURY}`,
  'candidates[3].fracos[1]':
    `Ronaldo Caiado gave up 0.30pp in the outright-winner contract and sits at 0.15%, below the 0.5% floor of the double reading, and gave up 5.50pp in the third-place contract for the first round.`,
  'candidates[3].fracos[2]':
    `Romeu Zema gave up 0.10pp and sits at 0.05% in the outright-winner contract, also below the watch floor.`,
  'candidates[3].fracos[3]':
    `The third way is still measured in the polling and barely priced in the outright-winner contract: the names in it with a confirmed price add up to less than half a point, against 93.35% for the top two.`,
  'candidates[3].analise':
    `The structural news of the day is here. Polymarket opened contracts for Augusto Cury on Thursday, at 12:30 AM UTC, and the market has already formed a price on WHERE he lands: 23.50% to finish third in the first round, which puts him behind only Renan Santos and Ronaldo Caiado, and 4.00% to finish second. ${CURY} In the polling he is not a new name: PoderData/Aya measures him at 4% in the first round, level with the other two names of the third way, and those 4% are his highest anywhere in the panel’s table, which had measured him between 1% and 3% until now. Caiado and Zema go the other way, giving ground in the outright-winner contract, and Caiado also gave up 5.50pp in the third-place one. PoderData puts both in a technical tie with the leader in the runoff, 43% to 44% each, and that is the distance between the two measurements the panel exists to show: in the polling they tie in the runoff, and in the outright-winner price the two of them together do not reach half a point. ${S}.`,
  'quadroComparativo[0].p':
    `Today’s PoderData/Aya has him at 38% in the first round, ahead by 3 points, and winning all four runoff scenarios tested, the tightest of them 45% to 44%. Gerp of Aug 26 had him at 37% and Indexa at 39%. BTG/Nexus of Aug 24, which feeds the figure in this block, keeps him at 41%.`,
  'quadroComparativo[0].m':
    `57.50% (vol USD 9.27M), ${S}. Down 5.00pp, the largest move on the panel in the outright-winner contract, and the lowest level since Jul 1.`,
  'quadroComparativo[0].t': `gives up 5.00pp across five successive readings and returns to the Jul 1 level`,
  'quadroComparativo[0].s':
    `He went on the Jornal Nacional interview, called the accusations against his son insinuations and denied shielding him. The PF is looking into a lobbyist’s request for the son to act on behalf of the man known as Careca do INSS.`,
  'quadroComparativo[1].p':
    `PoderData/Aya has him at 35% in the first round, 3 points back, and at 44% in the runoff, 1 point back. Both inside the 2pp margin. Gerp of Aug 26 had him ahead with 38% and Indexa behind with 34%.`,
  'quadroComparativo[1].m':
    `35.85% (vol USD 9.10M), ${S}. Up 0.30pp and his highest level since May 13. In the second-place contract he gave up 3.00pp, to 84.50%.`,
  'quadroComparativo[1].t': `the highest price since May 13, and the gap to the leader narrowed from the top`,
  'quadroComparativo[1].s':
    `He went to the TSE to bar the use of the Alvorada palace in his opponent’s campaign content. The Dark Horse production company asked Mendonça to bring the case to the STF, and Dino widened the PF’s access to the evidence.`,
  'quadroComparativo[2].p':
    `Today’s PoderData/Aya measures him at 4% in the first round, level with Renan Santos and Ronaldo Caiado, and it is his highest figure anywhere in the panel’s table. Avante candidate, confirmed at a convention on Aug 3.`,
  'quadroComparativo[2].m':
    `23.50% (vol USD 33,000) in the third-place contract for the first round and 4.00% in the second-place one, ${S}. His contracts opened on Thursday, at 12:30 AM UTC. The outright-winner one still has no confirmed price.`,
  'quadroComparativo[2].t': `a new name in the book, and the market has already formed a price on where he lands`,
  'quadroComparativo[2].s':
    `He was the most searched presidential candidate on Google during the debate and the one with the largest growth in followers, according to CNN Brasil and Pleno.News.`,
  'quadroComparativo[3].p':
    `PoderData/Aya has him at 4% in the first round, level with Caiado and Cury, and at 37% in the runoff against the leader. Gerp of Aug 26 had him at 3% and Indexa at 4%.`,
  'quadroComparativo[3].m':
    `1.65% (vol USD 11.63M), ${S}. Down 1.10pp and the FLOOR of the entire series: none of the 346 points since Apr 14 sits below this. In the third-place contract he gave up 9.00pp, to 36.50%, the largest single move on the panel today.`,
  'quadroComparativo[3].t': `the floor of the whole series in the outright-winner contract`,
  'quadroComparativo[3].s':
    `He went on Jornal Nacional, said he will impose a state of exception in favelas and argued that Brazil should have a nuclear bomb.`,
  'quadroComparativo[4].p':
    `PoderData/Aya has him at 4% in the first round, level with Renan Santos and Cury, and in a technical tie with the leader in the runoff, 43% to 44%.`,
  'quadroComparativo[4].m':
    `0.15% (vol USD 6.80M), ${S}. Down 0.30pp, below the 0.5% floor of the double reading. In the third-place contract he gave up 5.50pp, to 33.50%, his lowest level there since Aug 14.`,
  'quadroComparativo[4].t': `gives ground in both contracts and drops below the watch floor in the outright-winner one`,
  'quadroComparativo[4].s':
    `The day before he argued for the possibility of impeaching Supreme Court justices and asked for the secrecy to be lifted on the Master, INSS and Carbono Oculto cases.`,
  'quadroComparativo[5].p':
    `PoderData/Aya measures him at 3% in the first round. Gerp of Aug 26 had him at 4% and Indexa at 2%, and he is still the name with the largest relative divergence between institutes in the window.`,
  'quadroComparativo[5].m': `0.15% (vol USD 3.03M), ${S}. Unchanged, and below the 0.5% floor of the double reading.`,
  'quadroComparativo[5].s': `He does not appear in Thursday’s news among the names with a fact of their own.`,
  'quadroComparativo[6].m': `3.40% (vol USD 84,000), ${S}. Unchanged on the day, and it is the fourth day running at the same level.`,
  'quadroComparativo[6].t': `flat for the fourth day`,
  'quadroComparativo[6].s':
    `The clash between André Mendonça and the PF leadership in the inquiry about the president’s son is the court’s fact on Thursday. The Dark Horse production company asked for the inquiry to go to the STF, and Dino widened the PF’s access to the evidence.`,
  cruzamento:
    `Aug 27 has one polling fact and three market facts, and they all landed on the same date. In the polling, PoderData/Aya (BR-04974/2026, fieldwork Aug 23 to 26, n=2,400, telephone) brought a technical tie in BOTH rounds: 38% to 35% in the first and 45% to 44% in the second, both inside the 2pp margin. The comparison that counts here is with the house itself, because method and sample are the same: on Aug 13 it measured 41% to 35% in the first round, six points, and it now measures three. The runoff was at one point and stays at one. The same round gives the leader a technical tie against Romeu Zema and against Ronaldo Caiado as well, 44% to 43% each, and a seven-point lead over Renan Santos. Rejection level at 49% for the top two, and government approval at 42% against 50% disapproval. On price, Thursday’s confirmed reading has the leader at 57.50%, down 5.00pp on the day. The fall was continuous, across five successive readings, and it took the contract to its lowest level since Jul 1: the last reading below that was on Jun 30 at 4:30 PM UTC, at 55.50%, checked in the database backup against the full record since Apr 14. The runner-up rose 0.30pp, to 35.85%, his highest since May 13. The distance between the two fell from 26.95pp to 21.65pp, and it narrowed from the top: 5.00pp of the 5.30pp came from the first one falling. ⚠️ The panel does NOT call that the narrowest gap of anything, because it is not: 387 of the 691 points in the series sit below 21.65pp, and in May the runner-up was ahead of the leader, with the gap reaching minus 8.00pp on May 6. The second market fact is structural: Polymarket opened contracts for Augusto Cury on Thursday, at 12:30 AM UTC, and the market has already formed a price on where he lands, with 23.50% to finish third in the first round and 4.00% to finish second. ${CURY} In the polling he is not a new name, because PoderData measures him at 4%, level with the other two of the third way, and those 4% are his highest anywhere in the panel’s table, which had measured him between 1% and 3% until now. The third fact is a floor, and it came with the largest move of the day: Renan Santos closed the outright-winner contract at 1.65%, and none of the 346 points in his series since Apr 14 sits below that, while in the third-place contract he gave up 9.00pp, to 36.50%. Ronaldo Caiado gave up 5.50pp in that same contract, to 33.50%, and Flávio Bolsonaro gave up 3.00pp in the second-place one, to 84.50%. All three lost probability in the placement contracts on the same day a fourth name started carrying a price in them, and the panel records the simultaneity without asserting a transfer. In the news, Daniel Vorcaro testified to the Federal Police on Thursday by video link, in the inquiry into how former Central Bank directors acted on behalf of Master; the Dark Horse case saw the production company ask for it to go to the STF and Dino widen the PF’s access to the evidence; and the Lulinha case gained fronts at the PF, in Congress and at Spain’s public prosecutor. All of these facts are from the same date, and the panel records the coincidence without assigning cause. Probability of winning and voting intention measure different things, and the panel does not subtract one from the other. ${S}.`,
})

// ─────────────────────────────────────────────── polls-data
construir('polls-data', 'en', {
  'polls[0].note':
    `PoderData/Aya national poll released on Aug 27 (Poder360, Gazeta do Povo, CNN Brasil, Exame, UOL, CartaCapital, Jornal de Brasília, Pleno.News). First round Lula 38% x Flávio 35%, a distance of 3pp, a technical tie by the 2pp margin; Renan Santos, Ronaldo Caiado and Augusto Cury at 4% each, Pablo Marçal at 3% and Romeu Zema at 2%. Runoff Lula 45% x Flávio 44%, also a technical tie. Fieldwork Aug 23 to 26, n=2,400, telephone across 555 municipalities in the 27 federal units, 2pp margin, 95% confidence, registration BR-04974/2026. ⭐ THE COMPARISON THAT COUNTS IS WITH THE HOUSE ITSELF, AND IT SHOWS THE FIRST ROUND NARROWING BY HALF: it was 6pp on Jul 16 (40% x 34%), 6pp on Jul 30 (41% x 35%), 6pp on Aug 13 (41% x 35%) and it is 3pp now (38% x 35%). The runoff stays at 1pp, as on Aug 13. Same house, same method and same sample, with the first round narrowing and the runoff flat, the reverse of what the house’s series had been showing. REJECTION level at 49% for each of them (Poder360). The same round gives the leader a technical tie against Romeu Zema (44% x 43%) and against Ronaldo Caiado (44% x 43%), and a 7-point lead over Renan Santos (44% x 37%). ⭐ And Augusto Cury’s 4% is his highest figure anywhere in the panel’s table, which gathers the national polls of the last 30 days and had measured him between 1% and 3% until now. APPROVAL of the government at 42% against 50% disapproval, and the administration is rated poor or terrible by 48% against great or good by 33% (CNN Brasil). NATIONAL SCOPE confirmed in the release, which states 555 municipalities across the 27 federal units.`,
  'polls[0].source':
    `PoderData/Aya, released on Aug 27 by Poder360, Gazeta do Povo, CNN Brasil, Exame, UOL Notícias, CartaCapital, Jornal de Brasília and Pleno.News. TSE registration BR-04974/2026.`,
  'approvalData.note':
    `🏷️ THE STRUCTURED FIGURES IN THIS BLOCK ARE FROM GENIAL/QUAEST OF AUG 14, and they are: 46% approval against 48% disapproval, with 6% undecided, and 36% great or good, 25% fair and 37% poor or terrible. The panel keeps ONE house per block on purpose, so as not to add up rulers from different institutes. ⭐ NEW READING ON AUG 27, declared here and NOT mixed into the figures above: PoderData/Aya brings 42% approval against 50% disapproval, and the administration is rated poor or terrible by 48% against great or good by 33%, according to Poder360 and CNN Brasil. 📌 The week’s three earlier readings: Indexa/Broadcast of Aug 26 with 46% against 50%, according to Estadão and CNN Brasil; Gerp of Aug 26 with 43% against 51%, according to CNN Brasil and Diário de São Paulo; and BTG/Nexus of Aug 24 with 48% against 49%, and 35% great or good against 43% poor or terrible. ⚠️ ALL FOUR HOUSES AGREE ON THE SIGN AND DISAGREE ON THE SIZE: disapproval runs from 49% to 51% and approval from 42% to 48%, that is six points of spread between institutes on the same question in the same week. The panel does not average them.`,
  'polymarketComparison.note':
    `Polymarket prices from the ${S}, with the presidential book at USD 137.47M. ⭐ THE DAY HAS ONE NEW POLL AND ONE NEW NAME IN THE BOOK. PoderData/Aya (BR-04974/2026, fieldwork Aug 23 to 26, n=2,400) brings a technical tie in BOTH rounds, 38% to 35% in the first and 45% to 44% in the second, and the comparison with the house itself shows the first round narrowing from 6pp to 3pp in two weeks. On price, the leader gave up 5.00pp and fell to 57.50%, his lowest level since Jul 1, with the decline coming across five successive readings through the day; the runner-up rose 0.30pp, to 35.85%, his highest since May 13. The distance between the two fell from 26.95pp to 21.65pp and narrowed from the top. ⚠️ That is NOT the narrowest gap of anything: 387 of the 691 points in the series sit below it, and in May the runner-up was ahead of the leader. ⭐ The largest move of the day is in the PLACEMENT contracts: Renan Santos gave up 9.00pp in the third-place contract for the first round, to 36.50%, and also marked the floor of his entire series in the outright-winner one, at 1.65%; Ronaldo Caiado gave up 5.50pp in that same contract, to 33.50%; and Flávio Bolsonaro gave up 3.00pp in the second-place one, to 84.50%. On the same day Polymarket opened contracts for Augusto Cury, who shows up at 23.50% in the third-place book and 4.00% in the second. ${CURY} That is why he does not yet have a line of his own in this block, which carries the outright-winner price.`,
  'polymarketComparison.sources':
    `Polymarket prices via the AFOS proxy, and the panel only publishes a price that two independent readings, taken eight minutes apart, confirm within 0.20pp. The confirmation is done contract by contract. On Aug 27 there is a fresh confirmed reading for the presidential book, for the second-place and third-place contracts of the first round, for the STF impeachment one and for the Senate one. ${CURY} Polls filed with the TSE and released by the institutes, as reported by Poder360, Gazeta do Povo, CNN Brasil, Exame, UOL, CartaCapital, G1, Folha de S.Paulo, O Globo, Estadão, Valor Econômico, VEJA, BBC and Jornal de Brasília. PoderData/Aya of Aug 27 was checked against two sources, with the TSE registration number matching and with the national scope confirmed in the release, which states 555 municipalities across the 27 federal units. Series superlatives checked in the Neon backup, in backup/neon/marketPrice, which holds the full record since Apr 14.`,
  'polymarketComparison.candidates[0].polymarket': `57.50%`,
  'polymarketComparison.candidates[0].tendenciaPesquisa':
    `A NEW POLL TODAY, AND IT BRINGS A TECHNICAL TIE IN BOTH ROUNDS. PoderData/Aya (BR-04974/2026, fieldwork Aug 23 to 26, n=2,400) has him at 38% in the first round against 35%, and at 45% against 44% in the second, both inside the 2pp margin. The comparison with the house itself is what informs: it was 6pp in the first round on Aug 13 and it is 3pp now. He still wins all four runoff scenarios tested. BTG/Nexus of Aug 24, the most reliable national poll in the window, keeps him at 41% and is the one that feeds the figure in this block.`,
  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `57.50% (vol USD 9.27M) in the ${S}, down 5.00pp on the day, the largest move on the panel in the outright-winner contract. The fall was continuous, across five successive readings. ⚠️ It is the lowest level since Jul 1: the last reading below that was on Jun 30 at 4:30 PM UTC, at 55.50%, checked in the backup against the full series since Apr 14. The series top is still 67.50%, from Aug 16. His distance to the runner-up fell to 21.65pp, and it narrowed from the top.`,
  'polymarketComparison.candidates[1].polymarket': `35.85%`,
  'polymarketComparison.candidates[1].tendenciaPesquisa':
    `Today’s PoderData/Aya has him at 35% in the first round, 3 points back, and at 44% in the second, 1 point back, both inside the 2pp margin. His rejection stands at 49%, level with the leader. Gerp of Aug 26 had him ahead in the first round with 38% and Indexa/Broadcast had him behind with 34%, and both measured in the same week.`,
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `35.85% (vol USD 9.10M) in the ${S}, up 0.30pp. ⭐ It is his highest level since May 13: the last point above that was on May 13 at 2:00 AM UTC, at 42.80%, checked in the backup. The series top is still 45.50%, from May 6. The gap to the leader closed by 5.30pp on the day, and 5.00pp of that came from the other side falling. In the second-place contract for the first round he gave up 3.00pp, to 84.50%.`,
  'polymarketComparison.candidates[2].polymarket': `1.65%`,
  'polymarketComparison.candidates[2].tendenciaPesquisa':
    `PoderData/Aya measures him at 4% in the first round, level with Ronaldo Caiado and Augusto Cury, and at 37% in the runoff against the leader. Gerp of Aug 26 had him at 3% and Indexa at 4%. In the polling he is where he was; in the price, he is not.`,
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `1.65% (vol USD 11.63M) in the ${S}, down 1.10pp. ⚠️ It is the FLOOR of the entire series: none of the 346 points recorded since Apr 14 sits below that, checked in the backup. The descent is a straight line, from 3.10% on Aug 25 to 1.65% now, with no rebound. The series top is 49.60%, from Apr 28. In the third-place contract for the first round he gave up 9.00pp, to 36.50%, the largest single move on the panel today, and he is still the most expensive name in that contract.`,
  'polymarketComparison.candidates[3].tendenciaPesquisa':
    `PoderData/Aya measures him at 4% in the first round, level with Renan Santos and Augusto Cury, and puts him in a technical tie with the leader in the runoff, 43% to 44%. Indexa of Aug 26 had him at 5% and Gerp at 3%.`,
  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `0.15% (vol USD 6.80M) in the ${S}, down 0.30pp, which puts him below the 0.5% floor of the double reading. In the third-place contract for the first round he gave up 5.50pp, to 33.50%, his lowest level there since Aug 14.`,
  'polymarketComparison.candidates[4].tendenciaPesquisa':
    `PoderData/Aya measures him at 3% in the first round. Gerp of Aug 26 had him at 4% and Indexa at 2%, both measuring in the same week, and he is still the name with the largest relative divergence between institutes in the window.`,
  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `0.15% (vol USD 3.03M) in the ${S}, unchanged, and below the 0.5% floor of the double reading.`,
  'polymarketComparison.candidates[5].tendenciaPesquisa':
    `No national poll tests him for president, including today’s PoderData/Aya. That is why he shows no polling range in this block, and the panel does not turn absence of testing into absence of intention.`,
  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `0.05% (vol USD 14.06M) in the ${S}, unchanged. It is the largest accumulated volume in the presidential book, and he has been below the watch floor for weeks: high volume with a price pinned to zero is an old position unwound, not an active contract.`,
  'polymarketComparison.candidates[6].tendenciaPesquisa':
    `PoderData/Aya measures him at 2% in the first round and puts him in a technical tie with the leader in the runoff, 43% to 44%. Gerp and Indexa of Aug 26 measured him at 1% each, and BTG/Nexus of Aug 24 at 3%.`,
  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `0.05% (vol USD 6.13M) in the ${S}, down 0.10pp, and below the 0.5% floor of the double reading.`,
  'polymarketComparison.candidates[7].tendenciaPesquisa':
    `No national poll tests him for president. The JOTA poll released on Aug 26 declared a runoff scenario with him in the leader’s place, but the figures from that scenario were not released in a source the panel can reach, and so they do not enter here.`,
  'polymarketComparison.candidates[7].tendenciaPolymarket':
    `0.05% (vol USD 7.30M) in the ${S}, unchanged.`,
})
