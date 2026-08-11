/**
 * Mapa EN do REBASELINE de 11/Ago (leitura de fechamento, 18:22 BRT) para analysis-data.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 11".
 */
import { construir } from '../build-locale-json'

const S = 'confirmed reading of Aug 11, 18:22 BRT'

construir('analysis-data', 'en', {
  'cards.sentimento.text1':
    `54 days from the first round, three national polls were published on the same day and they disagree with one another more than on any other day in this window. CNT/MDA (n=2,002, in person, field Aug 5 to 8, registration BR-06935/2026) gives 42.4% x 28.7% in the first round and 48% x 39% in the runoff. Futura Inteligência (n=2,000, telephone, field Aug 3 to 7) gives 38.8% x 34.1% and 46.5% x 44%. Gerp (n=2,400, telephone, field Aug 6 to 10, registration BR-08045/2026) gives a tie at 38% x 38% and 45% x 43% for the runner-up. The prices on this panel are from the ${S}, confirmed by two independent readings.`,

  'cards.sentimento.direita':
    `The day brought the best and the worst data point of the window for the runner-up, and the two came out together. Gerp puts him ahead in the runoff, with 45% against 43%, and it is the first national poll of the period to do so, with the release itself treating the 2pp difference as a statistical tie. On the same day CNT/MDA puts him nine points behind. In the first round he runs from 28.7% to 38% across today's three, and the 28.7% opened a new floor for the window. IN THE PRICE THE DAY WAS A ROUND TRIP: he marked 26.95% at 16:27 and closed at 27.25%, exactly where he stood on Aug 10.`,

  'cards.sentimento.esquerda':
    `The leader remains ahead or tied in the seven national polls of the window, and today's CNT/MDA brings his best reading of the period, with 13.7pp of advantage in the first round. The counterweight is Gerp, the first national poll to put him behind in the runoff, and the government rating, which still carries a negative balance at every house of the day. In the price he was flat for the FOURTH session running, at 63.50%, and the gap closed at +36.25pp, the same value as Aug 10.`,

  'cards.sentimento.terceiraVia':
    `THE THIRD-PLACED NAME WAS THE ONLY THING THAT MOVED ALL DAY, AND HE CAME BACK: he rose as far as 8.40% in the 16:27 reading and closed at 7.75%, finishing 0.10pp above Aug 10. Both readings were confirmed, each by two captures, so it is not that one of them is wrong, it is that the day kept going. In the 90-day series, 78 had a value equal to or above 7.75%, with a peak of 17.90% on Jun 9 and a floor of 6.90% on Aug 6. In the polling Gerp gives him 5%, the second highest value of the window, behind only the 10% Palver measured online, and the method effect remains the reading on him. Caiado, Zema and Haddad each gave up 0.10pp, closing at 1.05%, 0.35% and 0.05%.`,

  'cards.sentimento.polymarket':
    `Prices from the ${S}: Lula 63.50% (vol USD 8.21M cumulative), Flávio 27.25% (vol USD 8.12M), Renan Santos 7.75% (vol USD 9.44M), Caiado 1.05% (vol USD 5.63M), Zema 0.35% (vol USD 5.05M) and Haddad 0.05% (vol USD 7.01M). Total volume in the presidential book at USD 122.17M. In the Senate the PL marks 76.50% (vol USD 259 thousand), and in the first-round runner-up contract Flávio stands at 80.50% (vol USD 245 thousand). ⭐ THE CENTRAL CROSSING OF THE DAY IS ONE OF REGIME, NOT OF LEVEL: three institutes opened eleven points of distance between themselves in the runoff, and the presidential book CLOSED THE DAY WHERE IT STARTED, with the leader flat, the runner-up back at yesterday's value and the gap identical to Aug 10. The two instruments measured the same week, and one of them is far more uncertain than the other. The panel records the difference in regime without saying which one is right.`,

  'cards.bancoMaster.text1':
    `The Banco Master case had a fact of its own on Aug 11, and it is one of administrative deadlock, not of judicial decision. The Credit Guarantee Fund told the Supreme Court that it is not a party to the deal under discussion and that it has not received BRB's balance sheet, the document without which the rescue loan to the bank cannot move forward.`,

  'cards.bancoMaster.text2':
    `The information ran in three mutually independent press groups on the same day, and BRB replied that it will only release its 2025 financial statements once the capitalisation process is complete. It is a circular deadlock: the loan depends on the balance sheet and the balance sheet depends on the capitalisation. Also on Aug 11, Master's liquidator widened the net around Daniel Vorcaro's assets in the United States.`,

  'cards.bancoMaster.text3':
    `📌 TWO THINGS THAT CIRCULATED TODAY ARE NOT FROM TODAY, and the panel would rather say so than inherit the wrong date: the Federal Police operation over the Maceió pension fund is from Aug 10, and the winding-up of Vorcaro's holding company in a tax haven already appeared on Aug 8. On the electoral front, the runner-up stated on Aug 11 that he will attend the debates and that he owes no explanations about the case.`,

  'cards.bancoMaster.conclusao':
    `The fact of the day is a deadlock over a document, not a decision. The panel records the deadlock with source and date, separates what is from Aug 11 from what came from earlier days, and does not convert investigation into a change in risk, because there is no fresh figure that would support that conversion.`,

  'cards.stf.analise':
    `THE IMPEACHMENT CONTRACT STANDS AT 3.80% (vol USD 83 thousand), against the last confirmed value, which was 3.60% on Aug 9. With that cumulative volume, it remains the thinnest contract among those tracked, and the caveat about book size travels alongside the figure on purpose: a 0.20pp move there costs less money than any other on the panel, and this is the last place anyone should look for confirmation of a political thesis. ON THE FACTUAL SIDE, the day brought administrative deadlock and not a judicial decision. The Credit Guarantee Fund told the Supreme Court that it is not a party to the deal under discussion and that it has not received BRB's balance sheet, without which the rescue loan cannot move forward, and BRB replied that it only releases its 2025 statements after the capitalisation. Banco Master's liquidator widened the net around Vorcaro's assets in the United States. Dino's decision ordering the Federal Police to investigate R$ 55.4 million in Pix amendments flagged by the TCU still stands. The panel records the facts without converting them into priced risk, because none of them is a judicial decision.`,
})
