/** Mapa ES: polls-data, rodada de 07/Set/2026. Notas longas reaproveitam a tradução publicada. */
import { readFileSync } from 'fs'
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/es/glossary#${id})`
const S7 = 'lectura confirmada del 07/Sep, 13:02 BRT'
const S6 = 'lectura confirmada del 06/Sep'
const PISO = 'por debajo del piso de 0,5% de la doble lectura, y esta ronda no publica precio nuevo para él en ese contrato'

const publicado = JSON.parse(readFileSync('public/polls-data.es.json', 'utf-8'))

const trocar = (texto: string, de: string, para: string): string => {
  if (!texto.includes(de)) throw new Error('trecho não encontrado na tradução publicada: ' + de.slice(0, 60))
  return texto.split(de).join(para)
}

const notaVerita = trocar(
  publicado.polls[0].note,
  `⚠️ ESTE LEVANTAMIENTO NO TRAE ESCENARIO DE ${G('SEGUNDA VUELTA', 'segundo-turno')}, y la lectura más reciente de ese par sigue siendo la Datafolha del 03/Sep.`,
  `⭐ EL ESCENARIO DE ${G('SEGUNDA VUELTA', 'segundo-turno')} DE ESTA MISMA RONDA SALIÓ DESPUÉS, y da vuelta el par: Flávio Bolsonaro 48,5% frente a 43,1% de Lula, con 4,9% de blancos y nulos y 3,6% de indecisos. 🏷️ El 06/Sep el panel registró que este levantamiento no traía escenario de segunda vuelta, porque en el momento de la captura no lo traía: la nota de CNN Brasil que lo publica es del 06/Sep a las 13:53 y fue actualizada el 07/Sep a las 00:03. ⚠️ Es la PRIMERA encuesta nacional de la ventana que le entrega la segunda vuelta a Flávio Bolsonaro. Las otras dos que prueban el par van en sentido opuesto: Datafolha del 03/Sep, 46% a 44% para Lula, y Quaest del 02/Sep, 42% a 41%, también para Lula. El rechazo medido en esta misma ronda es de 35% a Lula y 25,8% a Flávio Bolsonaro.`
)

const notaRealTime =
  publicado.polls[4].note +
  ` 🏷️ EL ALCANCE NACIONAL DE ESTE REGISTRO ES DERIVADO POR NOSOTROS, y la evidencia que lo sostiene es débil. Viene del plan muestral, y el plan muestral de esta casa declara universo nacional en 23 de sus 23 encuestas ESTATALES en la ventana de 30 días, con la metodología callada sobre el universo. Un campo que dice nacional en todos los casos no separa nada, así que decir nacional aquí no es evidencia. Esto no afirma que la encuesta sea estatal: afirma que el registro no sostiene la etiqueta, y la página declara la duda en vez de esconderla.`

construir('polls-data', 'es', {
  'polls[0].note': notaVerita,
  'polls[4].note': notaRealTime,

  'polymarketComparison.note': `Precios de Polymarket con el libro presidencial en USD 144,60M, ${S7} (16:02 UTC). ⚠️ EN ESTA RONDA DOS DE LOS CINCO LIBROS RECIBIERON PRECIO NUEVO, el de ganador y el de tercer lugar de la ${G('primera vuelta', 'primeiro-turno')}, que fueron los que se confirmaron en las dos lecturas independientes. Para el de segundo lugar de la primera vuelta, el de destitución en el Supremo y el de mayoría en el Senado no hay lectura nueva el 07/Sep, y sus cifras en esta página son las de la ${S6}. ⭐ Y LA ENCUESTA Y EL PRECIO SE MOVIERON EN DIRECCIONES OPUESTAS POR SEGUNDO DÍA SEGUIDO: el escenario de ${G('segunda vuelta', 'segundo-turno')} de Veritá, divulgado después de la ronda de ayer, pone a Flávio Bolsonaro por delante con 48,5% a 43,1%, y el contrato de ganador abrió la brecha de Lula de 16,80pp a 18,05pp. 📌 Las dos magnitudes no se restan, porque una es intención de voto declarada en la segunda vuelta y la otra es probabilidad implícita de ganar la elección. La página registra que hoy ordenan la disputa al revés, sin arbitrar entre ellas.`,

  'polymarketComparison.candidates[0].polymarket': '57,50%',
  'polymarketComparison.candidates[0].tendenciaPesquisa': `Veritá del 06/Sep (BR-09426/2026, campo del 01 al 04/Sep, n=3.804, margen de 2pp) lo mide en 38,4% en la ${G('primera vuelta', 'primeiro-turno')}, detrás de Flávio Bolsonaro por 0,5 punto, que cabe dentro del margen y por eso es ${G('empate técnico', 'empate-tecnico')}. ⭐ Y EL ESCENARIO DE ${G('SEGUNDA VUELTA', 'segundo-turno')} DE LA MISMA RONDA, QUE SALIÓ DESPUÉS, LO PONE DETRÁS: 43,1% frente a 48,5%. Es la primera encuesta nacional de la ventana que entrega la segunda vuelta a su adversario, frente a Datafolha del 03/Sep (46% a 44%) y Quaest del 02/Sep (42% a 41%), las dos a su favor. El rechazo medido por Veritá es de 35% para él y 25,8% para su adversario.`,
  'polymarketComparison.candidates[0].tendenciaPolymarket': `57,50% (vol USD 9,92M) en el contrato de ganador, ${S7}, un alza de 1,00pp frente a la ${S6}. ⭐ LA BRECHA SOBRE EL SEGUNDO SE ABRIÓ DE 16,80pp A 18,05pp, y es la segunda rueda seguida de apertura. 📌 El precio fue en dirección contraria a la encuesta por segundo día: ayer Veritá empataba la ${G('primera vuelta', 'primeiro-turno')}, hoy lo coloca detrás en la segunda vuelta, y el contrato de ganador subió las dos veces. En el contrato de segundo lugar de la primera vuelta esta ronda no publica precio nuevo. En la serie registrada desde el 14/Abr su contrato va de 34,50% a 67,50%, y el 57,50% de hoy está dentro de esa franja.`,

  'polymarketComparison.candidates[1].polymarket': '39,45%',
  'polymarketComparison.candidates[1].tendenciaPesquisa': `⭐ VERITÁ DEL 06/Sep LO PONE POR DELANTE EN LOS DOS ESCENARIOS: 38,9% frente a 38,4% en la ${G('primera vuelta', 'primeiro-turno')}, dentro del margen y por eso ${G('empate técnico', 'empate-tecnico')}, y 48,5% frente a 43,1% en la ${G('segunda vuelta', 'segundo-turno')}, la primera vez en la ventana que una encuesta nacional le entrega la segunda vuelta. ⚠️ Las otras dos encuestas nacionales que prueban el par van en sentido opuesto: Datafolha del 03/Sep, 46% a 44% para Lula, y Quaest del 02/Sep, 42% a 41%, también para Lula. Veritá tiene confiabilidad 2 en la regla de la casa, la más baja de la ventana.`,
  'polymarketComparison.candidates[1].tendenciaPolymarket': `39,45% (vol USD 9,80M) en el contrato de ganador, ${S7}, una caída de 0,25pp frente a la ${S6}. ⚠️ EL PRECIO FUE CONTRA LA ENCUESTA POR SEGUNDO DÍA SEGUIDO, y esta vez la encuesta le entrega la ${G('segunda vuelta', 'segundo-turno')}. En el contrato de segundo lugar de la ${G('primera vuelta', 'primeiro-turno')} esta ronda no publica precio nuevo para él.`,

  'polymarketComparison.candidates[2].tendenciaPolymarket': `1,15% (vol USD 4,19M) en el contrato de GANADOR, ${S7}, sin variación frente a la ${S6}. ⭐ En el contrato de TERCER LUGAR de la ${G('primera vuelta', 'primeiro-turno')}, que es otro mercado, subió 2,35pp y está en 58,55% (vol USD 126 mil), segunda alza seguida. 📌 El mercado lo consolida como tercer colocado de la primera vuelta y no como candidato a ganar la elección, y sus dos contratos siguen contando historias distintas.`,

  'polymarketComparison.candidates[3].polymarket': '1,55%',
  'polymarketComparison.candidates[3].tendenciaPolymarket': `1,55% (vol USD 12,76M) en el contrato de ganador, ${S7}, una caída de 0,05pp. ⚠️ En el contrato de tercer lugar de la ${G('primera vuelta', 'primeiro-turno')} CEDIÓ 1,50pp y está en 24,50% (vol USD 279 mil), interrumpiendo tres alzas seguidas, el mismo día en que Cury subió 2,35pp en ese mismo libro. 📌 Entre los cuatro nombres por encima de 1% en el contrato de ganador, es el de mayor volumen acumulado, por encima del líder y del segundo colocado, en un contrato con precio por debajo de 2%.`,

  'polymarketComparison.candidates[4].tendenciaPesquisa': `Veritá del 06/Sep lo pone en 1,9% en la ${G('primera vuelta', 'primeiro-turno')}, por debajo del 4% que Datafolha medía el 03/Sep. El levantamiento de Veritá solo trae el par contra Flávio Bolsonaro en la ${G('segunda vuelta', 'segundo-turno')}, así que la lectura más reciente del par contra él sigue siendo la Datafolha, de 46% a 41%.`,
  'polymarketComparison.candidates[4].tendenciaPolymarket': `0,15% (vol USD 7,23M) en el contrato de GANADOR, ${PISO}. En el contrato de TERCER LUGAR de la ${G('primera vuelta', 'primeiro-turno')}, que es otro mercado, cedió 0,50pp y está en 9,50% (vol USD 115 mil), ${S7}.`,

  'polymarketComparison.candidates[5].tendenciaPolymarket': `0,15% (vol USD 3,82M) en el contrato de GANADOR, ${PISO}. En el contrato de TERCER LUGAR de la ${G('primera vuelta', 'primeiro-turno')} cedió 0,40pp y está en 1,85% (vol USD 48 mil), ${S7}.`,

  'polymarketComparison.candidates[6].tendenciaPesquisa': `Veritá del 06/Sep lo mide en 0,3% en la ${G('primera vuelta', 'primeiro-turno')}, por debajo del 2% que Datafolha medía el 03/Sep. El levantamiento de Veritá solo trae el par contra Flávio Bolsonaro en la ${G('segunda vuelta', 'segundo-turno')}, así que la lectura más reciente del par contra él sigue siendo la Datafolha, de 48% a 39%.`,
  'polymarketComparison.candidates[6].tendenciaPolymarket': `0,15% (vol USD 6,56M) en el contrato de GANADOR, ${PISO}. En el contrato de TERCER LUGAR de la ${G('primera vuelta', 'primeiro-turno')} sigue en 0,85% (vol USD 51 mil), sin variación, ${S7}.`,
})
