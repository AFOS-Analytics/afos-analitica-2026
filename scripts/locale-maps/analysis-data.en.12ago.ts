/**
 * Mapa EN de 12/Ago para analysis-data.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 12".
 */
import { construir } from '../build-locale-json'

const S = 'confirmed reading of Aug 12, 16:41 BRT'

construir('analysis-data', 'en', {
  'cards.sentimento.text1':
    `53 days from the first round, the day brought NO new national poll, and the three from Aug 11 that disagree with one another still stand: CNT/MDA (n=2,002, in person), Futura Inteligência (n=2,000, telephone) and Gerp (n=2,400, telephone). The prices are from the ${S}, confirmed by two independent readings. 📅 Quaest publishes on Aug 14 and PoderData on Aug 13.`,

  'cards.sentimento.text2':
    `THE MARKET MOVED WHERE THE ELECTION IS NOT DECIDED. In the contract about who wins, almost nothing budged: the leader stayed at the same value for the fourth day running and the gap narrowed 0.40pp. In the contract about who finishes second in the first round, the runner-up rose 3.50pp, and that was the largest move of the day in any book tracked. They are different questions: one is about winning, the other about placing.`,

  'cards.sentimento.text3':
    `APPROVAL stands as it was, because no house published a fresh figure: 47.3% against 49.9% at Futura, 53% disapproval at Gerp, and administration rating at 35% excellent or good against 36% poor or terrible at CNT/MDA. Across seven readings in seven days, disapproval runs from 47% to 55%.`,

  'cards.sentimento.direita':
    `The runner-up rose 0.40pp in the presidential contract, to 27.65%, and the gap over the leader narrowed to 35.85pp. But his big move was elsewhere: in the first-round runner-up contract he jumped from 80.50% to 84.00%. In the polling nothing changed, because the three national polls of Aug 11 remain the most recent, and in them he runs from 28.7% to 38% in the first round.`,

  'cards.sentimento.esquerda':
    `The leader closed at 63.50% for the FOURTH day running at the same value, since Aug 9. In the 90-day series, 17 of the 88 days had a value equal to or above it, with a peak of 66.50% on Aug 1. The gap fell 0.40pp, to 35.85pp, and the fall came entirely from the challenger's end, because his own price did not move.`,

  'cards.sentimento.terceiraVia':
    `THE MOST INTERESTING CROSSING OF THE DAY IS CAIADO'S, AND IT POINTS BOTH WAYS. In the presidential contract he fell 0.10pp, to 0.95%, dropping BELOW 1% for the first time since early August, 0.05pp from the floor of the series, which is 0.90% from Jul 7. On the same day, in the first-round third-place contract, he ROSE 2.00pp, to 31.50%. The market lowered his chance of winning and raised his chance of finishing third. Renan Santos did the opposite and smaller: he fell 0.30pp in the presidential, to 7.45%, and gave up 1.50pp in the third-place contract, to 62.50%. Zema remains at 0.35%, below the 0.5% cut that separates price from noise.`,

  'cards.sentimento.polymarket':
    `Prices from the ${S}: Lula 63.50% (vol USD 8.22M cumulative), Flávio 27.65% (vol USD 8.13M), Renan Santos 7.45% (vol USD 9.48M), Jair Bolsonaro 1.20% (vol USD 5.52M), Caiado 0.95% (vol USD 5.66M), Zema 0.35% (vol USD 5.07M) and Haddad 0.15% (vol USD 7.06M). Total volume in the presidential book at USD 122.49M. ⭐ THE LARGEST MOVE OF THE DAY WAS NOT IN THE CONTRACT ABOUT WINNING: in the first-round runner-up one, Flávio rose 3.50pp, to 84.00% (vol USD 250 thousand), while in the presidential he moved 0.40pp. In the third-place one, Renan marks 62.50% (vol USD 178 thousand) and Caiado 31.50% (vol USD 47 thousand). In the Senate the PL remains at 76.50% (vol USD 259 thousand). 📌 Worth recording that Jair Bolsonaro, at 1.20%, is now priced ABOVE Caiado, at 0.95%.`,

  'cards.inss.text1':
    `The case of fraud in association-fee deductions at the INSS remains an administrative liability, with no fresh figure on Aug 12 and no specific breakdown in any of the polls in force.`,

  'cards.inss.text2':
    `The government rating is still the one from the houses of Aug 11, because none has published since: 47.3% approval against 49.9% disapproval at Futura, 53% disapproval at Gerp, and administration rating at 35% excellent or good against 36% poor or terrible at CNT/MDA.`,

  'cards.inss.text4':
    `With no fresh judicial decision and no fresh figure on the case on Aug 12, the panel records an absence of measurement instead of repeating old data as if it were from today.`,

  'cards.inss.impactoGestao':
    `The government rating still carries a negative balance at every house in force, with sizes ranging from 2.6pp to 10pp. The cause is not attributed here, because the rounds do not measure cause.`,

  'cards.inss.conclusao':
    `The case remains in the field of the administration's rating and not of voting intention. On Aug 12 there is no fresh data on it, and the panel would rather say so than present yesterday's figure as if it were today's.`,

  'cards.bancoMaster.text1':
    `The Banco Master case saw movement on Aug 12, and it is one of DEFENCE STRATEGY, not of decision. According to O Globo, Daniel Vorcaro expanded his defence team and ordered a sweep of files in an attempt to land a third plea-bargain proposal.`,

  'cards.bancoMaster.text2':
    `Valor Econômico reported that his new lawyer had a meeting scheduled with Justice André Mendonça, at the Supreme Court, on Wednesday. ⚠️ None of these facts is a decision: they are defence moves, and the Prosecutor General's Office had already closed the plea-bargain negotiation in June and July, which the panel recorded by not incorporating the subject on Aug 11.`,

  'cards.bancoMaster.text3':
    `On a separate front, Estadão published a recording in which a judge suggests selling Banco Santos to Master and names lawyers, in a bankruptcy case that has run for more than twenty years. It is press investigation with a single source, and the panel records it as such.`,

  'cards.bancoMaster.conclusao':
    `The day brought a defence move and a recording, neither of them a judicial decision. The panel records the facts with outlet and date, without converting them into a change in risk, because there is no figure that would support that conversion.`,

  'cards.stf.analise':
    `THE IMPEACHMENT CONTRACT STANDS AT 3.90% (vol USD 83 thousand), up 0.10pp against the confirmed value of Aug 11. It remains the thinnest contract among those tracked, and the caveat about size travels alongside the figure on purpose: a move there costs less money than in any other book on the panel. ⭐ THE JUDICIAL FACT OF THE DAY IS LARGE AND HAS NO DIRECT BEARING ON THE CONTRACT: on Aug 12, Justices Moraes, Dino, Gilmar Mendes and Zanin ordered seven courts of justice to return amounts paid as penduricalhos, citing exorbitant payments, and Moraes stated that 1,100 magistrates received more than R$ 100 thousand a month. The decision reaches judges in six states and the Federal District, and was published by Estadão, O Globo, g1 and Valor. It is an actual decision, with named justices and a defined reach, unlike the investigative coverage that dominated the previous days. Dino's decision ordering the Federal Police to investigate R$ 55.4 million in Pix amendments flagged by the TCU still stands. The panel records the facts without converting them into priced risk.`,
})
