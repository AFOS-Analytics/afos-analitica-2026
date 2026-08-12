/**
 * Mapa ES de 12/Ago para analysis-criteriosa.json.
 * Convenções: vírgula decimal e ponto de milhar. "estancado", nunca "parado"; "descontar", nunca "precificar".
 */
import { construir } from '../build-locale-json'

const S = 'lectura confirmada del 12/Ago, 16:41 BRT'

construir('analysis-criteriosa', 'es', {
  subtitle:
    `ACTUALIZACIÓN 12/Ago, a 53 días de la primera vuelta. SIN ENCUESTA NACIONAL NUEVA: siguen vigentes CNT/MDA, Futura Inteligência y Gerp, todas del 11/Ago, que discrepan en once puntos en el balotaje. El precio se movió donde la elección no se decide: el libro presidencial casi estancado y el contrato de segundo lugar de la primera vuelta con la mayor variación del día. Precios de la ${S}.`,

  'candidates[0].header':
    `SIN ENCUESTA NUEVA HOY: siguen vigentes CNT/MDA, con 42,4% y victoria por 48% x 39% en el balotaje, Futura, con 38,8% y 46,5% x 44%, y Gerp, con empate en 38% y derrota por 45% x 43%. EN EL PRECIO, el CUARTO día seguido en 63,50% (vol USD 8,22M acumulado), en la ${S}.`,
  'candidates[0].fortes[4]':
    `Precio de la ${S} en 63,50%, con USD 8,22M acumulados, y la serie de 90 días tiene un techo de 66,50%, del 1/Ago.`,
  'candidates[0].fracos[3]':
    `La diferencia cayó 0,40pp, a 35,85pp, y la caída vino entera de la punta del adversario, porque su propio precio no se movió.`,
  'candidates[0].fracos[4]':
    `Salvedad de serie: 17 de los 88 días tuvieron un precio igual o superior a 63,50%, así que el nivel actual no es extremo.`,
  'candidates[0].analise':
    `EL DÍA NO TRAJO ENCUESTA NACIONAL NUEVA, y eso es información: las tres del 11/Ago siguen siendo las más recientes, y discrepan en once puntos en el balotaje, yendo de nueve puntos a su favor en CNT/MDA a dos puntos en contra en Gerp. EN EL PRECIO NO SE MOVIÓ POR CUARTO DÍA SEGUIDO, en 63,50%, con USD 8,22M acumulados. La diferencia cayó 0,40pp, a 35,85pp, y la caída entera vino de la punta del adversario. ⭐ LO QUE CAMBIÓ HOY FUE EN OTRO LUGAR: el contrato sobre quién termina segundo en la primera vuelta tuvo la mayor variación del día, con el adversario subiendo 3,50pp, mientras el contrato sobre quién gana apenas se movió. Son preguntas distintas, y el panel no las suma. En la serie de 90 días, 17 de los 88 días tuvieron un valor igual o superior al de hoy, con un techo de 66,50% el 1/Ago y un piso de 39,50% el 25/May. LA APROBACIÓN sigue siendo la del 11/Ago, porque ninguna casa publicó después: 47,3% contra 49,9% en Futura, 53% de desaprobación en Gerp, y la gestión empatada en CNT/MDA. 📅 PoderData publica el 13/Ago y Quaest el 14/Ago.`,

  'candidates[1].header':
    `SIN ENCUESTA NUEVA HOY: siguen los 28,7% de CNT/MDA, los 34,1% de Futura y los 38% de Gerp, con Gerp poniéndolo por delante en el balotaje por 45% x 43%. EN EL PRECIO subió 0,40pp, a 27,65% (vol USD 8,13M acumulado), en la ${S}. ⭐ Y en el contrato de segundo lugar de la primera vuelta subió 3,50pp, a 84,00%.`,
  'candidates[1].fortes[4]':
    `Precio de la ${S} en 27,65%, con USD 8,13M acumulados, y 22 de los 88 días de la serie tuvieron un valor igual o superior.`,
  'candidates[1].fracos[4]':
    `El alza de 0,40pp en el presidencial es pequeña al lado de los 3,50pp que ganó en el contrato de segundo lugar, lo que describe una revaluación de POSICIÓN y no de victoria.`,
  'candidates[1].analise':
    `SU MOVIMIENTO DE HOY FUE DE POSICIÓN, NO DE VICTORIA, Y LA DIFERENCIA IMPORTA. En el contrato presidencial subió 0,40pp, a 27,65%, con USD 8,13M acumulados, y la diferencia se estrechó a 35,85pp. En el contrato sobre quién termina segundo en la primera vuelta, subió 3,50pp, de 80,50% a 84,00%, y esa fue la MAYOR variación del día en cualquier libro seguido. Ganar la elección y terminar segundo en la primera vuelta son preguntas distintas: la segunda es sobre llegar al balotaje, y ahí es donde se movió el dinero. EN LA ENCUESTA nada cambió, porque no hubo encuesta nacional nueva: siguen los 28,7% de CNT/MDA, los 34,1% de Futura y los 38% de Gerp, con una amplitud de 11,3pp en la ventana. En la serie de 90 días, 22 de los 88 días tuvieron un valor igual o superior a 27,65%, con un techo de 33,20% el 2/Jun y un piso de 22,00% el 2/Jul. EN EL TABLERO, Estadão informó que Tereza Cristina se reunió con su equipo para evaluar su participación en la campaña, y que busca líderes de partidos neutros para armar una plataforma femenina, ya que su vice no es mujer.`,

  'candidates[2].header':
    `CEDIÓ EN LOS DOS CONTRATOS: cayó 0,30pp en el presidencial, a 7,45% (vol USD 9,48M acumulado), y 1,50pp en el de tercer lugar de la primera vuelta, a 62,50%, en la ${S}. En la encuesta nada cambió, porque no hubo encuesta nueva, y sigue entre 4% y 10% según el método.`,
  'candidates[2].fortes[0]':
    `Mantiene el mayor volumen acumulado del libro presidencial entre los nombres por encima de 1%, con USD 9,48M.`,
  'candidates[2].fortes[1]':
    `En la serie de 90 días, más de 80 de los 88 días tuvieron un valor igual o superior, con un piso de 6,80% el 6/Ago.`,
  'candidates[2].analise':
    `CEDIÓ EN LOS DOS CONTRATOS en los que aparece, y el movimiento es pequeño en los dos. En el presidencial cayó 0,30pp, a 7,45%; en el de tercer lugar de la primera vuelta, 1,50pp, a 62,50%. EN LA ENCUESTA NADA CAMBIÓ, porque el día no tuvo encuesta nacional nueva: siguen los 5% de Gerp, los 4% de Genial/Quaest y de BTG/Nexus, los 4,7% de Meio/Ideia y los 10% de Palver por internet. EL EFECTO DE MÉTODO SIGUE SIENDO LA LECTURA CENTRAL SOBRE ÉL, con el mismo nombre yendo de 4% a 10% según el entorno de la entrevista, y la salvedad fue declarada por la propia Palver. El precio sigue ENTRE los dos métodos. En la serie de 90 días, más de 80 de los 88 días tuvieron un valor igual o superior a 7,45%, con un techo de 17,90% el 9/Jun y un piso de 6,80% el 6/Ago, es decir, sigue cerca del fondo de su propia serie incluso tras la oscilación del 11/Ago.`,

  'candidates[3].header':
    `⭐ CAIADO APUNTA HACIA LOS DOS LADOS EL MISMO DÍA: cayó 0,10pp en el contrato sobre ganar, a 0,95%, quedando por debajo de 1%, y SUBIÓ 2,00pp en el de tercer lugar de la primera vuelta, a 31,50%. Valores de la ${S}: Caiado 0,95% (vol USD 5,66M), Zema 0,35% (vol USD 5,07M) y Haddad 0,15% (vol USD 7,06M).`,
  'candidates[3].caiado.label':
    `CAIADO (PSD), Poly presidencial 0,95% (vol USD 5,66M acumulado, ${S}) | tercer lugar de la primera vuelta 31,50% | encuesta vigente: Gerp 4%, Genial/Quaest 4%, Meio/Ideia 5,7%, BTG/Nexus 5%`,
  'candidates[3].caiado.fracos':
    `CAYÓ POR DEBAJO DE 1% EN EL CONTRATO SOBRE GANAR, a 0,95%, quedando a 0,05pp del piso de la serie, que es 0,90% del 7/Jul. Su distancia entre encuesta y precio sigue siendo la mayor del pelotón: de 4% a 5,7% de intención declarada contra 0,95% de probabilidad descontada. ⚠️ Y hay un contraste que vale registrar: Jair Bolsonaro, que es inelegible, está descontado en 1,20%, por encima de él.`,
  'candidates[3].caiado.fortes':
    `SUBIÓ 2,00pp en el contrato de tercer lugar de la primera vuelta, a 31,50%, el mismo día en que cayó en el de ganar. El mercado bajó su probabilidad de ganar y subió la de terminar tercero, y las dos cosas pueden ser verdad a la vez. En la encuesta sigue siendo el nombre mejor colocado del pelotón, con 5,7% en Meio/Ideia y 5% en BTG/Nexus.`,
  'candidates[3].haddad.label':
    `HADDAD (PT), Poly presidencial 0,15% (vol USD 7,06M acumulado, ${S}) | NO probado por las nacionales vigentes, porque disputa el gobierno de São Paulo`,
  'candidates[3].zema.label':
    `ZEMA (Novo), Poly presidencial 0,35% (vol USD 5,07M acumulado, ${S}) | tercer lugar de la primera vuelta 4,00% | encuesta vigente: Gerp 2%, Genial/Quaest 2%, Meio/Ideia 2,6%, BTG/Nexus 3%`,
  'candidates[3].analise':
    `EL PELOTÓN NO TUVO ENCUESTA NUEVA, y lo que se movió fue el precio, en direcciones opuestas para el mismo nombre. CAIADO cayó 0,10pp en el contrato sobre ganar, a 0,95%, quedando por debajo de 1% y a 0,05pp del piso de la serie, y al mismo tiempo subió 2,00pp en el contrato de tercer lugar de la primera vuelta, a 31,50%. Bajar la probabilidad de ganar y subir la de terminar tercero no es una contradicción: son dos preguntas, y el mercado las respondió de forma distinta el mismo día. ⚠️ Vale registrar un contraste de precio: Jair Bolsonaro, que es inelegible, aparece en 1,20%, por encima de Caiado. El panel registra la cifra sin construir tesis sobre ella, porque en esa franja la variación tiene poco valor informativo. ZEMA sigue en 0,35%, por debajo del corte de 0,5%, con 4,00% en el contrato de tercer lugar. HADDAD subió 0,10pp, a 0,15%, y la salvedad permanece: no es candidato a la Presidencia y disputa el gobierno de São Paulo.`,

  'quadroComparativo[0].p':
    `SIN ENCUESTA NUEVA EL 12/Ago. Siguen las tres del 11/Ago: CNT/MDA (n=2.002, presencial, BR-06935/2026) con 42,4% y 48% x 39% en el balotaje; Futura (n=2.000, telefónica, BR-08109/2026) con 38,8% y 46,5% x 44%; y Gerp (n=2.400, telefónica, BR-08045/2026) con empate en 38% y derrota por 45% x 43%.`,
  'quadroComparativo[0].m': `63,50% (vol USD 8,22M acumulado), ${S}`,
  'quadroComparativo[0].t':
    `CUARTO DÍA SEGUIDO en el mismo valor, desde el 9/Ago. La diferencia cayó 0,40pp, a 35,85pp, y la caída vino de la punta del adversario. En la serie de 90 días, 17 de los 88 tuvieron un valor igual o superior.`,
  'quadroComparativo[0].s':
    `53 días de la elección. 📅 PoderData publica el 13/Ago, Quaest el 14/Ago y Nexus el 17/Ago, las tres nacionales.`,
  'quadroComparativo[1].m': `27,65% (vol USD 8,13M), ${S}`,
  'quadroComparativo[1].t':
    `SUBIÓ 0,40pp en el presidencial. ⭐ Y 3,50pp en el contrato de segundo lugar de la primera vuelta, a 84,00%, que fue la mayor variación del día en cualquier libro. No es extremo: 22 de los 88 días tuvieron un valor igual o superior.`,
  'quadroComparativo[1].s':
    `Estadão informó que Tereza Cristina se reunió con su equipo para evaluar su participación en la campaña, y que busca líderes de partidos neutros para una plataforma femenina.`,
  'quadroComparativo[2].m': `7,45% (vol USD 9,48M), ${S}`,
  'quadroComparativo[2].t':
    `CEDIÓ en los dos contratos: 0,30pp en el presidencial y 1,50pp en el de tercer lugar, a 62,50%. En la serie de 90 días, más de 80 de los 88 tuvieron un valor igual o superior.`,
  'quadroComparativo[3].m': `0,95% (vol USD 5,66M), ${S}`,
  'quadroComparativo[3].t':
    `⭐ HACIA LOS DOS LADOS EL MISMO DÍA: cayó 0,10pp en el contrato sobre ganar, quedando por debajo de 1% y a 0,05pp del piso de la serie, y subió 2,00pp en el de tercer lugar, a 31,50%.`,
  'quadroComparativo[4].m': `0,35% (vol USD 5,07M), ${S}`,
  'quadroComparativo[4].t':
    `SIN VARIACIÓN, y sigue por debajo del corte de 0,5% que separa precio de ruido. En el contrato de tercer lugar de la primera vuelta marca 4,00%.`,
  'quadroComparativo[5].m': `3,90% (vol USD 83 mil), ${S}`,
  'quadroComparativo[5].t':
    `SUBIÓ 0,10pp contra el 11/Ago. Sigue siendo el contrato más fino entre los seguidos, y cualquier movimiento en él exige esa salvedad.`,
  'quadroComparativo[5].s':
    `El hecho judicial del día es grande y no tiene relación directa con este contrato: Moraes, Dino, Gilmar Mendes y Zanin ordenaron a siete tribunales de justicia devolver penduricalhos, citando pagos exorbitantes, y Moraes dijo que 1.100 magistrados recibieron más de R$ 100 mil mensuales.`,

  cruzamento:
    `EL DÍA NO TRAJO ENCUESTA NACIONAL NUEVA, Y EL PRECIO SE MOVIÓ DONDE LA ELECCIÓN NO SE DECIDE. Los precios de esta página son de la ${S}, confirmados por dos lecturas independientes tomadas con ocho minutos de intervalo. EN EL CONTRATO SOBRE QUIÉN GANA casi nada se movió: el líder quedó en 63,50% por cuarto día seguido, desde el 9/Ago, y la diferencia se estrechó 0,40pp, a 35,85pp, enteramente por la punta del adversario. ⭐ EN EL CONTRATO SOBRE QUIÉN TERMINA SEGUNDO EN LA PRIMERA VUELTA, el segundo subió 3,50pp, de 80,50% a 84,00%, y esa fue la mayor variación del día en cualquier libro seguido. Ganar y llegar al balotaje son preguntas distintas, y hoy el dinero movió la segunda. ⭐ EL CRUCE MÁS INTERESANTE ES EL DE CAIADO, QUE APUNTA HACIA LOS DOS LADOS: cayó 0,10pp en el contrato sobre ganar, quedando por debajo de 1% y a 0,05pp del piso de la serie, y subió 2,00pp en el de tercer lugar, a 31,50%. Bajar la probabilidad de ganar y subir la de terminar tercero no es una contradicción, son dos preguntas. EN LA ENCUESTA NADA CAMBIÓ, y eso es información: las tres nacionales del 11/Ago siguen siendo las más recientes, a once puntos de distancia en el balotaje, y la próxima es PoderData el 13/Ago. El libro presidencial suma USD 122,49M de volumen acumulado. ⚠️ No se atribuye ninguna causa a los movimientos del día, porque no hay medición que los ligue a un evento identificable.`,
})
