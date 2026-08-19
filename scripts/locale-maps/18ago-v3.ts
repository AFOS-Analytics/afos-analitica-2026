/**
 * Mapa EN e ES de 18/Ago, correção: as linhas 3, 4 e 5 do quadroComparativo
 * tinham ficado com o preço de 17/Ago.
 *
 * 🔴 COMO O DEFEITO APARECEU. O painel dizia Caiado 0,25% e a daily dizia 0,80%,
 * na mesma noite. Quem mostrou foi o DATASET do Hugging Face: a série de mercado
 * é minerada do `quadroComparativo`, então a linha velha vazou para lá e ficou
 * visível ao lado dos preços novos. O painel renderizado não deixava isso óbvio,
 * o CSV deixou.
 *
 * 📌 A lição é de cobertura: atualizei o quadro por um mapa de TRÊS nomes e o
 * quadro tem SEIS linhas. Mapa parcial em estrutura de tamanho fixo não avisa
 * que ficou parcial.
 */
import { construir } from '../build-locale-json'

const CAR_EN = 'confirmed reading of Aug 18, 10:32 PM BRT (01:32 UTC)'
const CAR_ES = 'lectura confirmada del 18 de ago, 22:32 BRT (01:32 UTC)'

construir('analysis-criteriosa', 'en', {
  'quadroComparativo[3].m': `0.80% (vol USD 6.34M accumulated), ${CAR_EN}`,
  'quadroComparativo[3].t': `⭐ MORE THAN TRIPLED, from 0.25% to 0.80%, and returned ABOVE the 0.5% cut the panel uses to separate price from noise. ⚠️ And in the THIRD PLACE contract he GAVE GROUND, from 38.50% to 37.00%: both moves are from the same day and point opposite ways. ⛔ No superlative: it is a recovery from the series low, 0.50% on Aug 15, and the high is 2.40%, from Jun 19; of the 86 days recorded since May 21, 84 had a value equal to or above today's.`,
  'quadroComparativo[3].s': `The PSD confirmed his presidential candidacy, according to Acessa.com. 📌 In declared intention he is still the third name, with 5% in BTG/Nexus of Aug 17 against Renan Santos's 4%.`,

  'quadroComparativo[4].m': `0.15% (vol USD 5.71M accumulated), ${CAR_EN}`,
  'quadroComparativo[4].t': `🔻 DOWN 0.10pp, from 0.25% to 0.15%, below the 0.5% cut the panel uses to separate price from noise. In that range a price move does not sustain interpretation.`,
  'quadroComparativo[4].s': `In the ballot box BTG/Nexus of Aug 17 gives him 4% in the first round, tied with Renan Santos inside the 2pp margin, and that reading stands on its own, independent of the price.`,

  'quadroComparativo[5].m': `3.40% (vol USD 84 thousand), ${CAR_EN}`,
  'quadroComparativo[5].t': `FLAT at 3.40%, unchanged from Aug 17.`,
  'quadroComparativo[5].s': `Contract on a Supreme Court justice being removed by impeachment before 2027, kept in the panel as an institutional thermometer.`,
})

construir('analysis-criteriosa', 'es', {
  'quadroComparativo[3].m': `0,80% (vol USD 6,34M acumulado), ${CAR_ES}`,
  'quadroComparativo[3].t': `⭐ MÁS QUE TRIPLICÓ, de 0,25% a 0,80%, y volvió a quedar POR ENCIMA del corte de 0,5% que el panel usa para separar precio de ruido. ⚠️ Y en el contrato de TERCER LUGAR CEDIÓ, de 38,50% a 37,00%: los dos movimientos son del mismo día y apuntan a lados opuestos. ⛔ Sin superlativo: es recuperación del piso de la serie, 0,50% el 15 de ago, y el máximo es 2,40%, del 19 de jun; de los 86 días registrados desde el 21 de may, 84 tuvieron un valor igual o superior al de hoy.`,
  'quadroComparativo[3].s': `El PSD confirmó su candidatura a la Presidencia, según Acessa.com. 📌 En la intención declarada sigue siendo el tercer nombre, con 5% en la Nexus/BTG del 17 de ago contra 4% de Renan Santos.`,

  'quadroComparativo[4].m': `0,15% (vol USD 5,71M acumulado), ${CAR_ES}`,
  'quadroComparativo[4].t': `🔻 CAÍDA de 0,10pp, de 0,25% a 0,15%, por debajo del corte de 0,5% que el panel usa para separar precio de ruido. En ese rango la variación de precio no sostiene interpretación.`,
  'quadroComparativo[4].s': `En la urna la Nexus/BTG del 17 de ago le da 4% en la primera vuelta, empatado con Renan Santos dentro del margen de 2pp, y esa lectura vale por sí sola, independiente del precio.`,

  'quadroComparativo[5].m': `3,40% (vol USD 84 mil), ${CAR_ES}`,
  'quadroComparativo[5].t': `QUIETO en 3,40%, sin variación respecto al 17 de ago.`,
  'quadroComparativo[5].s': `Contrato sobre la remoción de un ministro del Supremo por impeachment antes de 2027, mantenido en el panel como termómetro institucional.`,
})
