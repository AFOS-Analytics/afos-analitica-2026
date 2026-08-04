/** Limpeza EN de 04/Ago, parte 2: analysis-data e polls-data. */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/en/glossary#${id})`
const NEXUS = G('BTG/Nexus', 'nexus-btg')
const STF = G('STF', 'stf')
const NOVO = G('Novo', 'novo')

construir('analysis-data', 'en', {
  'cards.sentimento.text3':
    `⚠️ THE MARKET DOES NOT ENTER THIS ROUND. The prices this panel shows are from the Aug 3 reading, at 19:11 UTC, and they are marked as such. AFOS only publishes a price that two independent readings confirm, and on Aug 4 the third way kept moving.`,
  'cards.sentimento.terceiraVia':
    `THE SPACE GAINED PARTY DEFINITION TODAY. ZEMA announced his running mate, Senator Eduardo Girão of the ${NOVO} party, and he is the first of the three to close a ticket, and to close it inside his own party at that. CAIADO is the name whose price moves most, and this round publishes no fresh figure for him. In yesterday's ${NEXUS} polling, Caiado has 5% and Zema 3%, and Lula beats both in the runoff, 46% x 42% and 46% x 40%.`,
  'cards.sentimento.polymarket':
    `⚠️ Prices from Aug 3, from the 19:11 UTC reading, not from today: Lula 65.50% (vol USD 7.92M), Flávio 25.45% (vol USD 7.86M), Renan Santos 7.45% (vol USD 8.86M), Caiado 1.15% (vol USD 5.30M), Zema 0.25% (vol USD 4.66M), Haddad 0.15% (vol USD 6.64M), ${STF} impeachment 3.10% (vol USD 83 thousand). Lula's gap over Flávio +40.05pp. There is no fresh market reading on Aug 4.`,
  'cards.inss.text1':
    `The fiscal agenda produced no development that moved prices this Tuesday, and the market does not enter this round: there is no fresh reading on Aug 4. The day's record comes from the party-political side, where the board moved more than the polling did.`,
  'cards.inss.text4':
    `⚠️ This panel's market figures are from Aug 3 and are marked as such. In that reading, the Senate had the ${G('PL', 'pl')} at 75.00% (vol USD 259 thousand) and the annual inflation contract concentrated 36.60% in the 5.00% to 5.49% band, with the bands adding to 99.65%. On Aug 4 there is no confirmed reading to compare against.`,
  'cards.inss.conclusao':
    `With 61 days to the election, the day was one of party definition and immobile approval. Zema closed his ticket, Flávio lost two parties and remains without a running mate, and government approval did not move for the third straight round of the same house. The market stayed out because there was no fresh reading, and the third way, where the board moved most, is precisely where the price moved most. Tomorrow's round, with Quaest and Ideia, is the one that will measure whether any of it turned into votes.`,
  'cards.bancoMaster.conclusao':
    `⚠️ The ${STF} impeachment contract has NO fresh price today. In the Aug 3 reading it stood at 3.10% (vol USD 83 thousand). It is on the record that, on the same day, a third inquiry into the president's son was authorised and the runner-up in the race publicly defended impeaching justices, without the panel being able to say whether the market priced either.`,
  'cards.stf.nexo':
    `This Tuesday's link is the distance between a board that moved a great deal and a market that could not be measured. Politically, Zema closed his ticket with Eduardo Girão and Flávio lost Republicanos and Podemos on the same day. Judicially, Dino authorised the third inquiry into Lulinha and Flávio publicly defended impeaching three justices, naming them. In the polling, government approval did not move for the third straight round. And the price, which would be the crossing of all of it, stayed out, because there was no confirmed reading on Aug 4.`,
  'cards.stf.analise':
    `⚠️ NO FRESH PRICE FOR THE IMPEACHMENT CONTRACT this round. In the Aug 3 reading it was at 3.10% (vol USD 83 thousand), and that is the figure the panel shows, marked with its date. Worth recording as method: on a day carrying the authorisation of an inquiry into the president's son and the runner-up naming three justices he wants impeached, it would be tempting to estimate a reaction. The panel does not estimate. Without two readings that agree there is no price, and without a price there is no crossing. The usual caveat: at USD 83 thousand accumulated, this is the thinnest contract the panel publishes.`,
})

construir('polls-data', 'en', {
  'polymarketComparison.note':
    `⚠️ THE PRICES IN THIS SECTION ARE FROM Aug 3, FROM THE 19:11 UTC READING, AND NOT FROM TODAY. The Aug 4 round publishes no fresh price: AFOS only publishes a price that two independent readings confirm, and the third way kept moving through the day. The POLLING side, that one is from today. --- WHAT THE Aug 3 PRICES SAY: Lula at 65.50% (vol USD 7.92M) and Flávio at 25.45% (vol USD 7.86M), with a gap of +40.05pp. On that day both measurements moved the same way and for the same reason, with the leader standing still and the challenger rising, which is rare on this panel. Worth repeating what that was NOT: convergence in level. The market pays probability of victory and the polling measures share of the vote, and the two do not subtract. --- WHAT HAPPENED ON THE BOARD ON Aug 4, and this is a record and not an explanation: it was the day Zema announced his running mate, Senator Eduardo Girão of the ${NOVO} party, and the day Flávio received TWO alliance refusals, from Republicanos and Podemos, leaving him without a running mate eleven days from the deadline he himself declared. The third way is precisely where the price moves most. The panel attributes no cause: it records that the repricing is under way and that this is why no number is published. --- THE POLLING, THAT ONE IS FROM TODAY: ${NEXUS} of Aug 3 (BR-02874/2026) published government approval at 47% against 48%, a figure that was not in yesterday's release and came out in today's coverage. Approval has been stuck at 47% for three rounds of the same house.`,
  'polymarketComparison.sources':
    `${G('Polymarket', 'polymarket')} prices via the AFOS proxy, from the 19:11 UTC reading on Aug 3. There is no fresh market reading on Aug 4. BTG/Nexus poll of Aug 3, TSE filing BR-02874/2026, with the approval figures released in the Aug 4 coverage. TSE sweep of Aug 4: 537 filings, none new.`,
})
