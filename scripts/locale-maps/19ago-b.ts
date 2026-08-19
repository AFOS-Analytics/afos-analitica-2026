/** Mapa 19/Ago, parte 2: analysis-data e polls-data, EN e ES. */
import { construir } from '../build-locale-json'

// ---------------------------------------------------------------- EN
construir('analysis-data', 'en', {
  'cards.sentimento.text1': `The distance between LULA and FLÁVIO BOLSONARO narrowed for the THIRD day running and closed at 30.95pp in the confirmed reading of Aug 19, 2:58 PM BRT. It was 37.05pp on Aug 16, 33.05pp on Aug 17 and 31.45pp on Aug 18, that is 6.10pp in three days, in a presidential book that has accumulated USD 129.21M.`,
  'cards.sentimento.text2': `The move has only one side, and that is what the day shows. Lula repeated 63.50% for a second day running, losing no price at all, and the entire convergence came from Flávio Bolsonaro rising 0.50pp, on a sixth day running of gains.`,
  'cards.sentimento.text3': `The ballot box stays silent about it: no new national poll since Aug 17, and that one measured the distance between the two UNCHANGED at 5 points. Both polls out today are state polls, from the Federal District and São Paulo, and do not enter the national panel. The national Datafolha comes out on Aug 21.`,
  'cards.sentimento.polymarket': `Confirmed reading of Aug 19, 2:58 PM BRT. Lula 63.50%, Flávio Bolsonaro 32.55%, Renan Santos 4.05%, Pablo Marçal 0.75% and Ronaldo Caiado 0.55%.`,
})

construir('polls-data', 'en', {
  'polymarketComparison.note': `⭐ CONFIRMED READING OF Aug 19, 2:58 PM BRT. The distance between LULA and FLÁVIO BOLSONARO narrowed 0.50pp and closed at 30.95pp, the THIRD day running of convergence: it was 37.05pp on Aug 16, 33.05pp on Aug 17 and 31.45pp on Aug 18, adding up to 6.10pp in three days. 🔑 AND THE MOVE HAS ONLY ONE SIDE: Lula repeated 63.50% for a second day running, losing no price at all, and the entire convergence came from the runner-up rising. 📌 THE BALLOT BOX STAYS SILENT: no new national poll since Aug 17, and that one measured the distance UNCHANGED at 5 points. Both polls out today are STATE polls, from the Federal District and São Paulo. 📅 The national Datafolha of Aug 21 is the first to measure Pablo Marçal.`,
  'polymarketComparison.candidates[0].tendenciaPolymarket': `➖ UNCHANGED for a second day running, at 63.50% (vol USD 8.69M accumulated), confirmed reading of Aug 19, 2:58 PM BRT. The distance to the runner-up narrowed 0.50pp to 30.95pp, the THIRD day running of convergence, adding up to 6.10pp since Aug 16. 🔑 The narrowing did not come from him: the one who rose was the opponent. ⛔ No superlative: the high of the 88-day series is still 66.50%, from Aug 1.`,
  'polymarketComparison.candidates[1].tendenciaPolymarket': `🔺 UP 0.50pp, from 32.05% to 32.55% (vol USD 8.63M accumulated), a SIXTH day running of gains, and solely responsible for the narrowing of the distance. ⛔ NOT a record: of the 88 days in the series since May 22, 2 posted a value equal to or above it, and the high is still 33.20%, from Jun 2.`,
  'polymarketComparison.candidates[2].tendenciaPolymarket': `🔻 DOWN 0.35pp, to 4.05% (vol USD 10.14M accumulated), giving back what he gained the previous day. ⚠️ Close to the low: 86 of the 88 days in the series are above it. ⭐ In the third place contract he was STABLE at 57.00% and still WIDENED his lead, from 20.00pp to 21.00pp, because the one who gave ground was Caiado.`,
  'polymarketComparison.candidates[3].tendenciaPolymarket': `🔻 GAVE BACK what he had gained: from 0.80% to 0.55% (vol USD 6.35M accumulated), undoing the previous day's rise, and in the third place contract he gave ground from 37.00% to 36.00%. ⛔ No superlative: 85 of the 86 days in the series are above 0.55%, and the high is 2.40%, from Jun 19.`,
  'polymarketComparison.candidates[4].tendenciaPolymarket': `🔻 DOWN 0.15pp, to 0.75% (vol USD 1.72M accumulated), with volume still rising, from USD 1.66M in one day. 🏷️ He remains INELIGIBLE until 2032, campaigning allowed by injunction and registration pending. 📅 Datafolha of Aug 21 is the FIRST to measure him: today he has a price and no ballot-box measurement.`,
  'polymarketComparison.candidates[6].tendenciaPolymarket': `➖ UNCHANGED at 0.15% (vol USD 5.72M accumulated), below the 0.5% cut the panel uses to separate price from noise. In the third place contract he marks 4.85%.`,
  'polymarketComparison.candidates[0].polymarket': `63.50%`,
  'polymarketComparison.candidates[1].polymarket': `32.55%`,
  'polymarketComparison.candidates[2].polymarket': `4.05%`,
  'polymarketComparison.candidates[3].polymarket': `0.55%`,
  'polymarketComparison.candidates[4].polymarket': `0.75%`,
  'polymarketComparison.candidates[6].polymarket': `0.15%`,
})

// ---------------------------------------------------------------- ES
construir('analysis-data', 'es', {
  'cards.sentimento.text1': `La distancia entre LULA y FLÁVIO BOLSONARO se acortó por TERCER día seguido y cerró en 30,95pp en la lectura confirmada del 19 de ago, 14:58 BRT. Eran 37,05pp el 16 de ago, 33,05pp el 17 y 31,45pp el 18, o sea 6,10pp en tres días, en un libro presidencial que acumula USD 129,21M.`,
  'cards.sentimento.text2': `El movimiento tiene un solo lado, y eso es lo que el día muestra. Lula repitió 63,50% por segundo día seguido, sin perder precio alguno, y el acercamiento entero vino de Flávio Bolsonaro subiendo 0,50pp, en un sexto día seguido de alza.`,
  'cards.sentimento.text3': `La urna sigue muda al respecto: ninguna encuesta nacional nueva desde el 17 de ago, y aquella midió la distancia entre los dos INALTERADA en 5 puntos. Las dos encuestas de hoy son estatales, del Distrito Federal y de São Paulo, y no entran en el panel nacional. La Datafolha nacional sale el 21 de ago.`,
  'cards.sentimento.polymarket': `Lectura confirmada del 19 de ago, 14:58 BRT. Lula 63,50%, Flávio Bolsonaro 32,55%, Renan Santos 4,05%, Pablo Marçal 0,75% y Ronaldo Caiado 0,55%.`,
})

construir('polls-data', 'es', {
  'polymarketComparison.note': `⭐ LECTURA CONFIRMADA DEL 19 de ago, 14:58 BRT. La distancia entre LULA y FLÁVIO BOLSONARO se acortó 0,50pp y cerró en 30,95pp, TERCER día seguido de acercamiento: eran 37,05pp el 16 de ago, 33,05pp el 17 y 31,45pp el 18, sumando 6,10pp en tres días. 🔑 Y EL MOVIMIENTO TIENE UN SOLO LADO: Lula repitió 63,50% por segundo día seguido, sin perder precio alguno, y el acercamiento entero vino del segundo subiendo. 📌 LA URNA SIGUE MUDA: ninguna encuesta nacional nueva desde el 17 de ago, y aquella midió la distancia INALTERADA en 5 puntos. Las dos encuestas de hoy son ESTATALES, del Distrito Federal y de São Paulo. 📅 La Datafolha nacional del 21 de ago es la primera en medir a Pablo Marçal.`,
  'polymarketComparison.candidates[0].tendenciaPolymarket': `➖ SIN VARIACIÓN por segundo día seguido, en 63,50% (vol USD 8,69M acumulado), lectura confirmada del 19 de ago, 14:58 BRT. La distancia hacia el segundo se acortó 0,50pp a 30,95pp, TERCER día seguido de acercamiento, sumando 6,10pp desde el 16 de ago. 🔑 El acortamiento no vino de él: quien subió fue el adversario. ⛔ Sin superlativo: el máximo de la serie de 88 días sigue en 66,50%, del 1 de ago.`,
  'polymarketComparison.candidates[1].tendenciaPolymarket': `🔺 ALZA de 0,50pp, de 32,05% a 32,55% (vol USD 8,63M acumulado), SEXTO día seguido subiendo, y único responsable del acortamiento de la distancia. ⛔ NO es récord: de los 88 días de la serie desde el 22 de may, 2 marcaron un valor igual o superior, y el máximo sigue en 33,20%, del 2 de jun.`,
  'polymarketComparison.candidates[2].tendenciaPolymarket': `🔻 CAÍDA de 0,35pp, a 4,05% (vol USD 10,14M acumulado), devolviendo lo que subió la víspera. ⚠️ Cerca del piso: 86 de los 88 días de la serie están por encima. ⭐ En el contrato de tercer lugar quedó ESTABLE en 57,00% y aun así ABRIÓ ventaja, de 20,00pp a 21,00pp, porque quien cedió fue Caiado.`,
  'polymarketComparison.candidates[3].tendenciaPolymarket': `🔻 DEVOLVIÓ lo que había subido: de 0,80% a 0,55% (vol USD 6,35M acumulado), deshaciendo el alza de la víspera, y en el contrato de tercer lugar cedió de 37,00% a 36,00%. ⛔ Sin superlativo: 85 de los 86 días de la serie están por encima de 0,55%, y el máximo es 2,40%, del 19 de jun.`,
  'polymarketComparison.candidates[4].tendenciaPolymarket': `🔻 CAÍDA de 0,15pp, a 0,75% (vol USD 1,72M acumulado), con el volumen aún subiendo, desde USD 1,66M en un día. 🏷️ Sigue INELEGIBLE hasta 2032, campaña habilitada por medida cautelar y registro pendiente. 📅 La Datafolha del 21 de ago es la PRIMERA en medirlo: hoy tiene precio y ninguna medición de urna.`,
  'polymarketComparison.candidates[6].tendenciaPolymarket': `➖ SIN VARIACIÓN en 0,15% (vol USD 5,72M acumulado), por debajo del corte de 0,5% que el panel usa para separar precio de ruido. En el contrato de tercer lugar marca 4,85%.`,
  'polymarketComparison.candidates[0].polymarket': `63,50%`,
  'polymarketComparison.candidates[1].polymarket': `32,55%`,
  'polymarketComparison.candidates[2].polymarket': `4,05%`,
  'polymarketComparison.candidates[3].polymarket': `0,55%`,
  'polymarketComparison.candidates[4].polymarket': `0,75%`,
  'polymarketComparison.candidates[6].polymarket': `0,15%`,
})
