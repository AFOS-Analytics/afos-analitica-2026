/**
 * Mapa ES de 12/Ago para analysis-data.json.
 * Convenções: vírgula decimal e ponto de milhar. "estancado", nunca "parado"; "descontar", nunca "precificar".
 */
import { construir } from '../build-locale-json'

const S = 'lectura confirmada del 12/Ago, 16:41 BRT'

construir('analysis-data', 'es', {
  'cards.sentimento.text1':
    `A 53 días de la primera vuelta, el día NO trajo encuesta nacional nueva, y siguen vigentes las tres del 11/Ago que discrepan entre sí: CNT/MDA (n=2.002, presencial), Futura Inteligência (n=2.000, telefónica) y Gerp (n=2.400, telefónica). Los precios son de la ${S}, confirmados por dos lecturas independientes. 📅 Quaest publica el 14/Ago y PoderData el 13/Ago.`,

  'cards.sentimento.text2':
    `EL MERCADO SE MOVIÓ DONDE LA ELECCIÓN NO SE DECIDE. En el contrato sobre quién gana, casi nada se movió: el líder quedó en el mismo valor por cuarto día seguido y la diferencia se estrechó 0,40pp. En el contrato sobre quién termina segundo en la primera vuelta, el segundo subió 3,50pp, y esa fue la mayor variación del día en cualquier libro seguido. Son preguntas distintas: una es sobre ganar, la otra sobre posición.`,

  'cards.sentimento.text3':
    `LA APROBACIÓN sigue como estaba, porque ninguna casa publicó cifra nueva: 47,3% contra 49,9% en Futura, 53% de desaprobación en Gerp, y evaluación de la gestión en 35% de excelente o buena contra 36% de mala o pésima en CNT/MDA. En siete lecturas de siete días la desaprobación va de 47% a 55%.`,

  'cards.sentimento.direita':
    `El segundo subió 0,40pp en el contrato presidencial, a 27,65%, y la diferencia sobre el líder se estrechó a 35,85pp. Pero su movimiento grande fue otro: en el contrato de segundo lugar de la primera vuelta saltó de 80,50% a 84,00%. En la encuesta nada cambió, porque las tres nacionales del 11/Ago siguen siendo las más recientes, y en ellas va de 28,7% a 38% en la primera vuelta.`,

  'cards.sentimento.esquerda':
    `El líder cerró en 63,50% por CUARTO día seguido en el mismo valor, desde el 9/Ago. En la serie de 90 días, 17 de los 88 días tuvieron un valor igual o superior, con un techo de 66,50% el 1/Ago. La diferencia cayó 0,40pp, a 35,85pp, y la caída vino entera de la punta del adversario, porque su propio precio no se movió.`,

  'cards.sentimento.terceiraVia':
    `EL CRUCE MÁS INTERESANTE DEL DÍA ES EL DE CAIADO, Y APUNTA HACIA LOS DOS LADOS. En el contrato presidencial cayó 0,10pp, a 0,95%, quedando POR DEBAJO de 1% por primera vez desde comienzos de agosto, a 0,05pp del piso de la serie, que es 0,90% del 7/Jul. El mismo día, en el contrato de tercer lugar de la primera vuelta, SUBIÓ 2,00pp, a 31,50%. El mercado bajó su probabilidad de ganar y subió la de terminar tercero. Renan Santos hizo lo inverso y menor: cayó 0,30pp en el presidencial, a 7,45%, y cedió 1,50pp en el contrato de tercer lugar, a 62,50%. Zema sigue en 0,35%, por debajo del corte de 0,5% que separa precio de ruido.`,

  'cards.sentimento.polymarket':
    `Precios de la ${S}: Lula 63,50% (vol USD 8,22M acumulado), Flávio 27,65% (vol USD 8,13M), Renan Santos 7,45% (vol USD 9,48M), Jair Bolsonaro 1,20% (vol USD 5,52M), Caiado 0,95% (vol USD 5,66M), Zema 0,35% (vol USD 5,07M) y Haddad 0,15% (vol USD 7,06M). Volumen total del libro presidencial en USD 122,49M. ⭐ LA MAYOR VARIACIÓN DEL DÍA NO FUE EN EL CONTRATO SOBRE GANAR: en el de segundo lugar de la primera vuelta, Flávio subió 3,50pp, a 84,00% (vol USD 250 mil), mientras que en el presidencial se movió 0,40pp. En el de tercer lugar, Renan marca 62,50% (vol USD 178 mil) y Caiado 31,50% (vol USD 47 mil). En el Senado el PL sigue en 76,50% (vol USD 259 mil). 📌 Vale registrar que Jair Bolsonaro, en 1,20%, pasó a estar descontado POR ENCIMA de Caiado, en 0,95%.`,

  'cards.inss.text1':
    `El caso de los fraudes en descuentos asociativos del INSS sigue siendo un pasivo de gestión, sin cifra nueva el 12/Ago y sin desglose específico en ninguna de las encuestas vigentes.`,

  'cards.inss.text2':
    `La evaluación de gobierno sigue siendo la de las casas del 11/Ago, porque ninguna publicó después: 47,3% de aprobación contra 49,9% de desaprobación en Futura, 53% de desaprobación en Gerp, y gestión en 35% de excelente o buena contra 36% de mala o pésima en CNT/MDA.`,

  'cards.inss.text4':
    `Sin decisión judicial nueva ni cifra nueva sobre el caso el 12/Ago, el panel registra ausencia de medición en lugar de repetir un dato antiguo como si fuera del día.`,

  'cards.inss.impactoGestao':
    `La evaluación de gobierno sigue con saldo negativo en todas las casas vigentes, con tamaños que van de 2,6pp a 10pp. La causa no se atribuye aquí, porque las rondas no miden causa.`,

  'cards.inss.conclusao':
    `El caso sigue en el campo de la gestión y no de la intención de voto. El 12/Ago no hay dato nuevo sobre él, y el panel prefiere decirlo a presentar la cifra de ayer como si fuera la de hoy.`,

  'cards.bancoMaster.text1':
    `El caso del Banco Master tuvo movimiento el 12/Ago, y es de ESTRATEGIA DE DEFENSA, no de decisión. Según O Globo, Daniel Vorcaro amplió su equipo de defensa y ordenó una revisión de archivos para intentar colocar una tercera propuesta de colaboración premiada.`,

  'cards.bancoMaster.text2':
    `Valor Econômico informó que su nuevo abogado tenía una reunión agendada con el ministro André Mendonça, en el Supremo, este miércoles. ⚠️ Ninguno de estos hechos es una decisión: son movimientos de la defensa, y la Procuraduría General ya había cerrado la negociación de delación en junio y julio, lo que el panel registró al no incorporar el asunto el 11/Ago.`,

  'cards.bancoMaster.text3':
    `En un frente aparte, Estadão publicó una grabación en la que un juez sugiere la venta del Banco Santos al Master e indica abogados, en un proceso de quiebra que corre desde hace más de veinte años. Es investigación de prensa con fuente única, y el panel lo registra así.`,

  'cards.bancoMaster.conclusao':
    `El día trajo un movimiento de defensa y una grabación, ninguno de los dos con decisión judicial. El panel registra los hechos con medio y fecha, sin convertirlos en variación de riesgo, porque no hay cifra que sostenga esa conversión.`,

  'cards.stf.analise':
    `EL CONTRATO DE JUICIO POLÍTICO ESTÁ EN 3,90% (vol USD 83 mil), un alza de 0,10pp contra el valor confirmado del 11/Ago. Sigue siendo el contrato más fino entre los seguidos, y la salvedad sobre el tamaño va junto a la cifra a propósito: una variación allí cuesta menos dinero que en cualquier otro libro del panel. ⭐ EL HECHO JUDICIAL DEL DÍA ES GRANDE Y NO TIENE RELACIÓN DIRECTA CON EL CONTRATO: el 12/Ago, los ministros Moraes, Dino, Gilmar Mendes y Zanin determinaron que siete tribunales de justicia devuelvan montos pagados como penduricalhos, citando pagos exorbitantes, y Moraes afirmó que 1.100 magistrados recibieron más de R$ 100 mil mensuales. La decisión alcanza a jueces de seis estados y del Distrito Federal, y fue publicada por Estadão, O Globo, g1 y Valor. Es una decisión de verdad, con ministros nombrados y alcance definido, a diferencia de la cobertura de investigación que dominó los días anteriores. Sigue vigente la decisión de Dino que ordenó a la Policía Federal investigar R$ 55,4 millones en enmiendas Pix señaladas por el TCU. El panel registra los hechos sin convertirlos en riesgo descontado.`,
})
