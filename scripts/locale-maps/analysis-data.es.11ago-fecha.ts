/**
 * Mapa ES do REBASELINE de 11/Ago (leitura de fechamento, 18:22 BRT) para analysis-data.json.
 * Convenções: vírgula decimal e ponto de milhar. "estancado", nunca "parado".
 */
import { construir } from '../build-locale-json'

const S = 'lectura confirmada del 11/Ago, 18:22 BRT'

construir('analysis-data', 'es', {
  'cards.sentimento.text1':
    `A 54 días de la primera vuelta, tres encuestas nacionales fueron publicadas el mismo día y discrepan entre sí más que en cualquier otro día de esta ventana. CNT/MDA (n=2.002, presencial, campo del 5 al 8/Ago, registro BR-06935/2026) da 42,4% x 28,7% en la primera vuelta y 48% x 39% en la segunda. Futura Inteligência (n=2.000, telefónica, campo del 3 al 7/Ago) da 38,8% x 34,1% y 46,5% x 44%. Gerp (n=2.400, telefónica, campo del 6 al 10/Ago, registro BR-08045/2026) da empate en 38% x 38% y 45% x 43% para el segundo. Los precios de este panel son de la ${S}, confirmados por dos lecturas independientes.`,

  'cards.sentimento.direita':
    `El día trajo el mejor y el peor dato de la ventana para el segundo, y los dos salieron juntos. Gerp lo pone por delante en la segunda vuelta, con 45% contra 43%, y es la primera nacional del período en hacerlo, con la propia difusión tratando la diferencia de 2pp como empate técnico. El mismo día CNT/MDA lo pone nueve puntos por detrás. En la primera vuelta va de 28,7% a 38% entre las tres de hoy, y el 28,7% abrió un piso nuevo en la ventana. EN EL PRECIO EL DÍA FUE DE IDA Y VUELTA: marcó 26,95% a las 16:27 y cerró en 27,25%, exactamente donde estaba el 10/Ago.`,

  'cards.sentimento.esquerda':
    `El líder sigue por delante o empatado en las siete nacionales de la ventana, y la CNT/MDA de hoy trae su mejor lectura del período, con 13,7pp de ventaja en la primera vuelta. El contrapeso está en Gerp, que es la primera nacional en ponerlo por detrás en la segunda vuelta, y en la evaluación de gobierno, que sigue con saldo negativo en todas las casas del día. En el precio quedó estancado por CUARTA jornada seguida, en 63,50%, y la diferencia cerró en +36,25pp, el mismo valor del 10/Ago.`,

  'cards.sentimento.terceiraVia':
    `EL TERCERO FUE LO ÚNICO QUE SE MOVIÓ EN TODO EL DÍA, Y VOLVIÓ: subió hasta 8,40% en la lectura de las 16:27 y cerró en 7,75%, terminando 0,10pp por encima del 10/Ago. Las dos lecturas fueron confirmadas, cada una por dos capturas, así que no es que una esté equivocada, es que el día siguió. En la serie de 90 días, 78 tuvieron un valor igual o superior a 7,75%, con un techo de 17,90% el 9/Jun y un piso de 6,90% el 6/Ago. En la encuesta Gerp le da 5%, el segundo mayor valor de la ventana, por detrás solo del 10% que Palver midió por internet, y el efecto de método sigue siendo la lectura sobre él. Caiado, Zema y Haddad cedieron 0,10pp cada uno, cerrando en 1,05%, 0,35% y 0,05%.`,

  'cards.sentimento.polymarket':
    `Precios de la ${S}: Lula 63,50% (vol USD 8,21M acumulado), Flávio 27,25% (vol USD 8,12M), Renan Santos 7,75% (vol USD 9,44M), Caiado 1,05% (vol USD 5,63M), Zema 0,35% (vol USD 5,05M) y Haddad 0,05% (vol USD 7,01M). Volumen total del libro presidencial en USD 122,17M. En el Senado el PL marca 76,50% (vol USD 259 mil), y en el contrato de segundo lugar de la primera vuelta Flávio está en 80,50% (vol USD 245 mil). ⭐ EL CRUCE CENTRAL DEL DÍA ES DE RÉGIMEN, Y NO DE NIVEL: tres institutos abrieron once puntos de distancia entre sí en la segunda vuelta, y el libro presidencial CERRÓ EL DÍA DONDE EMPEZÓ, con el líder estancado, el segundo de vuelta al valor de ayer y la diferencia idéntica a la del 10/Ago. Los dos instrumentos midieron la misma semana, y uno de ellos está mucho más incierto que el otro. El panel registra la diferencia de régimen sin decir cuál está en lo cierto.`,

  'cards.bancoMaster.text1':
    `El caso del Banco Master tuvo un hecho propio el 11/Ago, y es de estancamiento administrativo, no de decisión judicial. El Fondo Garantizador de Créditos dijo al Supremo que no es parte del acuerdo en discusión y que no recibió el balance del BRB, documento sin el cual el préstamo de rescate al banco no avanza.`,

  'cards.bancoMaster.text2':
    `La información salió en tres grupos de prensa independientes entre sí el mismo día, y el BRB respondió que solo difundirá los estados financieros de 2025 una vez concluido el proceso de capitalización. Es un estancamiento circular: el préstamo depende del balance y el balance depende de la capitalización. También el 11/Ago, el liquidador del Master amplió el cerco a los bienes de Daniel Vorcaro en Estados Unidos.`,

  'cards.bancoMaster.text3':
    `📌 DOS COSAS QUE CIRCULARON HOY NO SON DE HOY, y el panel prefiere decirlo a heredar una fecha equivocada: el operativo de la Policía Federal sobre el fondo de pensiones de Maceió es del 10/Ago, y la liquidación de la holding de Vorcaro en un paraíso fiscal ya constaba el 8/Ago. En el plano electoral, el segundo afirmó el 11/Ago que irá a los debates y que no debe explicaciones sobre el caso.`,

  'cards.bancoMaster.conclusao':
    `El hecho del día es un estancamiento sobre un documento, no una decisión. El panel registra el estancamiento con fuente y fecha, separa lo que es del 11/Ago de lo que viene de días anteriores, y no convierte investigación en variación de riesgo, porque no hay cifra nueva que sostenga esa conversión.`,

  'cards.stf.analise':
    `EL CONTRATO DE JUICIO POLÍTICO ESTÁ EN 3,80% (vol USD 83 mil), contra el último valor confirmado, que era 3,60% el 9/Ago. Con ese volumen acumulado, sigue siendo el contrato más fino entre los seguidos, y la salvedad sobre el tamaño del libro va junto a la cifra a propósito: una variación de 0,20pp allí cuesta menos dinero que cualquier otra del panel, y este es el último lugar donde alguien debería buscar confirmación de una tesis política. EN EL PLANO DE LOS HECHOS, el día tuvo estancamiento administrativo y no una decisión judicial. El Fondo Garantizador de Créditos afirmó al Supremo que no es parte del acuerdo en discusión y que no recibió el balance del BRB, sin el cual el préstamo de rescate no avanza, y el BRB respondió que solo difunde los estados de 2025 tras la capitalización. El liquidador del Banco Master amplió el cerco a los bienes de Vorcaro en Estados Unidos. Sigue vigente la decisión de Dino que ordenó a la Policía Federal investigar R$ 55,4 millones en enmiendas Pix señaladas por el TCU. El panel registra los hechos sin convertirlos en riesgo descontado, porque ninguno de ellos es una decisión judicial.`,
})
