/**
 * Mapa ES de 11/Ago para analysis-data.json.
 * Convenções: vírgula decimal e ponto de milhar. "estancado", nunca "parado"; "descontar", nunca "precificar".
 */
import { construir } from '../build-locale-json'

const S = 'lectura confirmada del 11/Ago, 16:27 BRT'

construir('analysis-data', 'es', {
  'cards.sentimento.text1':
    `A 54 días de la primera vuelta, tres encuestas nacionales fueron publicadas el mismo día y discrepan entre sí más que en cualquier otro día de esta ventana. CNT/MDA (n=2.002, presencial, campo del 5 al 8/Ago, registro BR-06935/2026) da 42,4% x 28,7% en la primera vuelta y 48% x 39% en la segunda. Futura Inteligência (n=2.000, telefónica, campo del 3 al 7/Ago) da 38,8% x 34,1% y 46,5% x 44%. Gerp (n=2.400, telefónica, campo del 6 al 10/Ago, registro BR-08045/2026) da empate en 38% x 38% y 45% x 43% para el segundo. Los precios de este panel son de la ${S}, confirmados por dos lecturas independientes.`,

  'cards.sentimento.text2':
    `EN LA SEGUNDA VUELTA LA DISTANCIA ENTRE LAS TRES ES DE ONCE PUNTOS, sobre la misma pregunta y en la misma semana, y es la primera vez en la ventana que una nacional pone al adversario por delante en ese escenario. En la primera vuelta la distancia llega a 9,3 puntos sobre el mismo nombre, entre el 28,7% de CNT/MDA y el 38% de Gerp. Sumando las siete nacionales desde el 5/Ago, el líder va de 38% a 44%, una franja de 6pp, y el segundo va de 28,7% a 40%, una franja de 11,3pp, casi el doble.`,

  'cards.sentimento.text3':
    `LA APROBACIÓN SIGUE EL MISMO PATRÓN: 47,3% contra 49,9% en Futura, 53% de desaprobación en Gerp, y evaluación de la gestión en 35% de excelente o buena contra 36% de mala o pésima en CNT/MDA. En siete lecturas de siete días la desaprobación va de 47% a 55%, una distancia de 8pp entre casas, y el saldo va de 1pp positivo a 10pp negativo. El rechazo también empata dentro del margen: 47,1% para el segundo y 45,9% para el líder, en Futura.`,

  'cards.sentimento.direita':
    `El día trajo el mejor y el peor dato de la ventana para el segundo, y los dos salieron juntos. Gerp lo pone por delante en la segunda vuelta, con 45% contra 43%, y es la primera nacional del período en hacerlo, con la propia difusión tratando la diferencia de 2pp como empate técnico. El mismo día CNT/MDA lo pone nueve puntos por detrás. En la primera vuelta va de 28,7% a 38% entre las tres de hoy, y el 28,7% abrió un piso nuevo en la ventana. En el precio cayó 0,30pp, a 26,95%, devolviendo lo que había ganado el día anterior.`,

  'cards.sentimento.esquerda':
    `El líder sigue por delante o empatado en las siete nacionales de la ventana, y la CNT/MDA de hoy trae su mejor lectura del período, con 13,7pp de ventaja en la primera vuelta. El contrapeso está en Gerp, que es la primera nacional en ponerlo por detrás en la segunda vuelta, y en la evaluación de gobierno, que sigue con saldo negativo en todas las casas del día. En el precio quedó estancado por tercera jornada seguida, en 63,50%, y la diferencia volvió al valor del 9/Ago.`,

  'cards.sentimento.terceiraVia':
    `LA MAYOR VARIACIÓN DE TODO EL LIBRO FUE DEL TERCERO: subió 0,75pp, a 8,40%, y salió del piso de su propia serie, donde 84 de los 88 días tenían un valor igual o superior el 10/Ago y ahora son 72 de 89. En la encuesta Gerp le da 5%, el segundo mayor valor de la ventana, por detrás solo del 10% que Palver midió por internet. El efecto de método sigue siendo la lectura sobre él, y la salvedad fue declarada por la propia Palver. Caiado cayó 0,10pp por tercera jornada, a 1,05%, y Zema cayó a 0,35%, por debajo del corte de 0,5% que separa precio de ruido.`,

  'cards.sentimento.polymarket':
    `Precios de la ${S}: Lula 63,50% (vol USD 8,21M acumulado), Flávio 26,95% (vol USD 8,12M), Renan Santos 8,40% (vol USD 9,43M), Caiado 1,05% (vol USD 5,63M), Zema 0,35% (vol USD 5,05M) y Haddad 0,05% (vol USD 7,01M). Volumen total del libro presidencial en USD 122,16M. En el Senado el PL marca 76,50% (vol USD 259 mil), y en el contrato de segundo lugar de la primera vuelta Flávio cayó 1,50pp, a 80,50% (vol USD 245 mil). EL CRUCE CENTRAL DEL DÍA ES DE RÉGIMEN, Y NO DE NIVEL: mientras tres institutos abrían once puntos de distancia entre sí en la segunda vuelta, la mayor variación de todo el mercado fue de 0,75pp, y el precio del líder no se movió. Los dos instrumentos midieron la misma semana, y uno de ellos está mucho más incierto que el otro. El panel registra la diferencia de régimen sin decir cuál está en lo cierto.`,

  'cards.inss.text1':
    `El caso de los fraudes en descuentos asociativos del INSS sigue siendo un pasivo de gestión, y ninguna de las tres encuestas nacionales del 11/Ago publicó un desglose específico sobre él en fuente cerrada.`,

  'cards.inss.text2':
    `Lo que existe de medición nueva es indirecto y viene de la evaluación de gobierno, que se dispersó como todo lo demás: 47,3% de aprobación contra 49,9% de desaprobación en Futura, 53% de desaprobación en Gerp, y evaluación de la gestión en 35% de excelente o buena contra 36% de mala o pésima en CNT/MDA.`,

  'cards.inss.text3':
    `La distinción que el panel mantiene desde el inicio sigue valiendo: una cosa es el efecto sobre la evaluación de la gestión, que es donde el fraude administrativo suele aparecer; otra es el efecto sobre la intención de voto, que sigue mostrando al presidente por delante o empatado en las siete nacionales de la ventana.`,

  'cards.inss.text4':
    `Sin decisión judicial nueva ni cifra nueva sobre el caso el 11/Ago, el panel registra ausencia de medición en lugar de repetir un dato antiguo como si fuera del día.`,

  'cards.inss.impactoLula':
    `No aislable. En las siete nacionales desde el 5/Ago lidera o empata la primera vuelta en todas, entre 38% y 44%, y ninguna de ellas prueba el caso del INSS como variable.`,

  'cards.inss.impactoGestao':
    `La evaluación de gobierno tiene saldo negativo en todas las casas del 11/Ago, pero el tamaño varía: 2,6pp negativos en Futura y una lectura más dura en Gerp. La causa no se atribuye aquí, porque las rondas no miden causa.`,

  'cards.inss.conclusao':
    `El caso sigue en el campo de la gestión y no de la intención de voto, y la lectura honesta el 11/Ago es que no hay dato nuevo sobre él. Lo que hay es una evaluación de gobierno negativa en todas las casas del día, con tamaños que varían bastante entre ellas.`,

  'cards.bancoMaster.text1':
    `El caso del Banco Master volvió a la cobertura el 11/Ago con tres hechos nuevos, todos de investigación y ninguno de decisión judicial. El liquidador del banco amplió el cerco a los bienes de Daniel Vorcaro en Estados Unidos.`,

  'cards.bancoMaster.text2':
    `La Policía Federal señaló que una consultoría actuó para favorecer a Master en un fondo de pensiones de Maceió, y el Fondo Garantizador de Créditos afirmó no ser parte del acuerdo en discusión en el Supremo, alegando falta de documentos para el rescate del BRB. En paralelo, un paraíso fiscal liquidó la holding de Vorcaro tras el pedido de una empresa de cripto que reclama una deuda.`,

  'cards.bancoMaster.text3':
    `En el plano electoral, el segundo afirmó el 11/Ago que irá a los debates y que no debe explicaciones sobre el caso. Ninguna de las tres encuestas nacionales del día prueba el asunto.`,

  'cards.bancoMaster.conclusao':
    `El caso ganó tres hechos nuevos de investigación y ninguno de decisión. El panel registra los hechos con fuente y fecha, y no convierte investigación en variación de riesgo, porque no hay cifra nueva que sostenga esa conversión.`,

  'cards.stf.analise':
    `EL CONTRATO DE JUICIO POLÍTICO SUBIÓ 0,20pp, a 3,80% (vol USD 83 mil), contra el último valor confirmado, que era 3,60% el 9/Ago. Con ese volumen acumulado, sigue siendo el contrato más fino entre los seguidos, y la salvedad sobre el tamaño del libro va junto a la cifra a propósito: una variación de 0,20pp allí cuesta menos dinero que cualquier otra del panel, y este es el último lugar donde alguien debería buscar confirmación de una tesis política. EN EL PLANO DE LOS HECHOS, el día tuvo investigación y no decisión. El liquidador del Banco Master amplió el cerco a los bienes de Vorcaro en Estados Unidos, la Policía Federal señaló una consultoría que actuó para favorecer al banco en un fondo de pensiones de Maceió, y el Fondo Garantizador de Créditos afirmó no ser parte del acuerdo en discusión en el Supremo sobre el rescate del BRB. Sigue vigente la decisión de Dino que ordenó a la Policía Federal investigar R$ 55,4 millones en enmiendas Pix señaladas por el TCU. El panel registra los hechos sin convertirlos en riesgo descontado, porque ninguno de ellos es una decisión judicial.`,
})
