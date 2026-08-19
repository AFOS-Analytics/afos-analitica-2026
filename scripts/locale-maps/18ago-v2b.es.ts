/** Mapa ES de 18/Ago/2026, parte 2: analysis-data e polls-data. */
import { construir } from '../build-locale-json'

construir('analysis-data', 'es', {
  'cards.sentimento.text1': `La distancia entre LULA y FLÁVIO BOLSONARO se acortó por segundo día seguido y cerró en 31,45pp en la lectura confirmada del 18 de ago, 22:32 BRT. Eran 37,05pp el 16 de ago y 33,05pp el 17 de ago, o sea 5,60pp en dos días, en un libro presidencial que acumula USD 128,96M.`,
  'cards.sentimento.text2': `La urna dice lo contrario. La Nexus/BTG del 17 de ago, la única nacional de la semana, midió a Lula pasando de 40% a 41% y a Flávio de 35% a 36%: la diferencia entre los dos quedó INTACTA en 5 puntos, y cada movimiento de 1 punto cabe dentro del margen de 2pp de la propia casa.`,
  'cards.sentimento.text3': `RONALDO CAIADO se movió en los dos sentidos a la vez: más que triplicó en el contrato de victoria, de 0,25% a 0,80%, y cedió en el de tercer lugar, de 38,50% a 37,00%. Ganar la elección y terminar tercero son preguntas distintas, y el panel no las suma.`,
  'cards.sentimento.polymarket': `Lectura confirmada del 18 de ago, 22:32 BRT. Lula 63,50%, Flávio Bolsonaro 32,05%, Renan Santos 4,40%, Pablo Marçal 0,90% y Ronaldo Caiado 0,80%.`,
})

construir('polls-data', 'es', {
  'polymarketComparison.note': `⭐ LECTURA CONFIRMADA DEL 18 de ago, 22:32 BRT. La distancia entre LULA y FLÁVIO BOLSONARO se acortó 1,60pp y cerró en 31,45pp, SEGUNDO día seguido de acercamiento: eran 37,05pp el 16 de ago y 33,05pp el 17 de ago, sumando 5,60pp en dos días. 🔑 LA URNA DICE LO CONTRARIO: la Nexus/BTG del 17 de ago, la única nacional de la semana, midió a los dos subiendo 1 punto cada uno, lo que deja la diferencia INTACTA en 5 puntos. Una medición que no acorta no explica un acortamiento. ⭐⭐ Y RONALDO CAIADO SE MOVIÓ EN LOS DOS SENTIDOS: más que triplicó en el contrato de VICTORIA, de 0,25% a 0,80%, y CEDIÓ en el de TERCER LUGAR, de 38,50% a 37,00%. 📌 Ninguna encuesta nacional nueva entró. La Datafolha del 21 de ago será la primera en medir a Pablo Marçal.`,

  'polymarketComparison.candidates[0].tendenciaPolymarket': `🔴 CAÍDA de 1,00pp el 18 de ago, de 64,50% a 63,50% (vol USD 8,67M acumulado), lectura confirmada del 18 de ago, 22:32 BRT. La distancia hacia el segundo SE ACORTÓ 1,60pp a 31,45pp, segundo día seguido de acercamiento, sumando 5,60pp desde el 16 de ago. ⛔ Sin superlativo: el máximo de la serie de 88 días sigue en 66,50%, del 1 de ago.`,
  'polymarketComparison.candidates[1].tendenciaPolymarket': `🔺 ALZA de 0,60pp el 18 de ago, de 31,45% a 32,05% (vol USD 8,62M acumulado), quinto día seguido subiendo. En el contrato de segundo lugar marca 88,50%. ⛔ NO es récord: el máximo de la serie de 88 días es 33,20%, del 2 de jun.`,
  'polymarketComparison.candidates[2].tendenciaPolymarket': `🔺 ALZA de 0,35pp en el presidencial, a 4,40% (vol USD 10,11M acumulado). ⭐ El movimiento fuerte fue en la POSICIÓN: en el contrato de tercer lugar saltó de 52,50% a 57,00%, y la distancia hacia Caiado REABRIÓ de 14,00pp a 20,00pp.`,
  'polymarketComparison.candidates[3].tendenciaPolymarket': `⭐ MÁS QUE TRIPLICÓ en el contrato de VICTORIA, de 0,25% a 0,80% (vol USD 6,34M acumulado), y volvió a quedar por encima del corte de 0,5% del panel. Y CEDIÓ en el de TERCER LUGAR, de 38,50% a 37,00%. ⛔ Sin superlativo: es recuperación del piso de la serie, 0,50% el 15 de ago, y el máximo es 2,40%, del 19 de jun.`,
  'polymarketComparison.candidates[4].tendenciaPolymarket': `ESTABLE en 0,90% (vol USD 1,66M acumulado), con el volumen subiendo desde USD 1,21M en un día. 🏷️ ESTADO ELECTORAL, actualizado hoy: pidió al tribunal electoral la corrección de su declaración de bienes y el patrimonio declarado cayó de R$ 7,4 mil millones a R$ 149,9 millones, según G1 y Valor Econômico, del mismo grupo. Sigue INELEGIBLE hasta 2032, campaña habilitada por medida cautelar y registro pendiente. 📅 La Datafolha del 21 de ago es la PRIMERA en medirlo.`,
  'polymarketComparison.candidates[6].tendenciaPolymarket': `CAÍDA de 0,10pp, a 0,15% (vol USD 5,71M acumulado), por debajo del corte de 0,5% que el panel usa para separar precio de ruido. En la urna la Nexus/BTG del 17 de ago le da 4% en la primera vuelta.`,

  'polymarketComparison.candidates[0].polymarket': `63,50%`,
  'polymarketComparison.candidates[1].polymarket': `32,05%`,
  'polymarketComparison.candidates[2].polymarket': `4,40%`,
  'polymarketComparison.candidates[3].polymarket': `0,80%`,
  'polymarketComparison.candidates[4].polymarket': `0,90%`,
  'polymarketComparison.candidates[6].polymarket': `0,15%`,
})
