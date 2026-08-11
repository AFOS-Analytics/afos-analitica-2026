/**
 * Mapa EN de 10/Ago (rodada do PREÇO) para analysis-data.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 10".
 */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/en/glossary#${id})`
const S = 'confirmed reading of Aug 10, 21:32 BRT (Aug 11, 00:32 UTC)'

construir('analysis-data', 'en', {
  'cards.sentimento.text1':
    `With 55 days to the ${G('first round', 'primeiro-turno')}, the day brought polling and it brought price, and the two point in different directions. Two national polls were published on Aug 10: BTG/Nexus (n=2,001, telephone, field Aug 7 to Aug 9, 2pp margin, BR-08428/2026), with 40% x 35% in the first round and 47% x 44% in the runoff, and the debut of Palver (n=5,000, online questionnaire, 3pp margin, BR-06596/2026), with 44% x 40% and a tie at 46% x 46%. The prices on this panel are from the ${S}, confirmed by two independent readings.`,

  'cards.sentimento.polymarket':
    `Prices from the ${S}: Lula 63.50% (vol USD 8.20M cumulative), Flávio 27.25% (vol USD 8.11M), Renan Santos 7.65% (vol USD 9.32M), Caiado 1.15% (vol USD 5.62M), Zema 0.45% (vol USD 5.05M) and Haddad 0.15% (vol USD 6.98M). Total volume of the presidential book at USD 121.85M. THE MECHANISM OF THE GAP FLIPPED WITHIN TWENTY-FOUR HOURS, and that is the record of the day: the distance between the top two narrowed to +36.25pp, against +36.55pp yesterday, but YESTERDAY it narrowed because the LEADER gave way 1.00pp with the runner-up flat, and TODAY because the RUNNER-UP rose 0.30pp with the leader flat. The number moves the same way by opposite routes. Flávio was the only name in the chasing pack to rise. Over the window since Aug 3 the gap has fallen on six of the seven sessions, from +38.90pp, with one flat day. THE TARCÍSIO CONTRAST REMAINS THE MOST EXTREME IN THE BOOK: USD 13.90M cumulative, the largest volume in the whole presidential market, with the price at 0.05%. High volume with probability at the floor is conviction already priced in, not movement.`,

  'cards.bancoMaster.text3':
    `Neither of the two national polls of Aug 10 tests the case. AND THIS PANEL PUBLISHES NO NUMBER FOR THE ${G('STF', 'stf')} IMPEACHMENT CONTRACT TODAY: it is the thinnest among those tracked, with USD 83 thousand in cumulative volume, and today's readings did not hold up against each other. AFOS only publishes a price that two independent readings confirm. The last confirmed value is still the one from Aug 9, 3.60%.`,

  'cards.stf.analise':
    `THIS PANEL PUBLISHES NO NUMBER FOR THE IMPEACHMENT CONTRACT TODAY, and the reason is in the data itself. With USD 83 thousand in cumulative volume, it is the thinnest among those tracked, and today's readings did not hold up against each other. AFOS only publishes a price that two independent readings confirm, taken eight minutes apart, and this one did not confirm. The last confirmed value is still the one from Aug 9, 3.60%. THE CAVEAT IS REPEATED ON PURPOSE, because this is the last place anyone should look for confirmation of a political thesis: in a contract this size, a half-point change costs less money than any other in the panel. ON THE FACTS, what still stands is the Dino decision ordering the Federal Police to investigate R$ 55.4 million in Pix earmarks flagged by the TCU, with the runner-up's running mate, the Speaker of the lower house and a former ${G('PT', 'pt')} leader in the Senate on the same list. The panel records the three together because separating them would be choosing one side of the same decision. On Aug 10 there was no fresh judicial act in the case, and what appeared was press coverage of Banco Master, with no decision attached.`,
})
