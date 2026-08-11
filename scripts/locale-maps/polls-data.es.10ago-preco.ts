/**
 * Mapa ES de 10/Ago (rodada do PREÇO) para polls-data.json.
 * Convenções: vírgula decimal e ponto de milhar. "estancado", nunca "parado".
 */
import { construir } from '../build-locale-json'

const S = 'lectura confirmada del 10/Ago, 21:32 BRT (11/Ago, 00:32 UTC)'

construir('polls-data', 'es', {
  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `[${S}] En 63,50% (vol USD 8,20M acumulado), ESTANCADO en el mismo valor de ayer. LA DIFERENCIA SOBRE FLÁVIO SE ESTRECHÓ A +36,25pp, contra +36,55pp de ayer, PERO EL MECANISMO SE INVIRTIÓ: hoy se estrechó porque el adversario SUBIÓ 0,30pp con él estancado, y ayer porque ÉL cedió 1,00pp con el adversario estancado. El número se mueve hacia el mismo lado por caminos opuestos, y tratar los dos días como la misma tendencia borraría la diferencia. En la ventana desde el 3/Ago la diferencia cayó en seis de las siete jornadas, desde +38,90pp, con un día estancado. En la serie de 88 días su techo es 66,50%, del 1/Ago, y 14 de los 88 días tuvieron un valor igual o superior al actual, así que el nivel no es extremo.`,

  'polymarketComparison.candidates[1].polymarket': `27,25%`,
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `[${S}] En 27,25% (vol USD 8,11M acumulado). SUBIÓ 0,30pp y es el ÚNICO nombre del pelotón que subió en la lectura de hoy, tras tres días estancado en 26,95%. Fue esa alza, y no una caída del líder, la que estrechó la diferencia hoy. El alza no cambia el nivel: 26 de los 88 días de la serie tuvieron un valor igual o superior, con un techo de 34,40% el 13/May y un piso de 22,00% el 3/Jul. En el contrato de segundo lugar está en 82,00%.`,

  'polymarketComparison.candidates[2].polymarket': `7,65%`,
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `[${S}] En 7,65% (vol USD 9,32M acumulado). CAYÓ 0,15pp EL MISMO DÍA en que la encuesta online lo puso en 10%. LO QUE HACE EL PRECIO ES QUEDAR ENTRE LOS DOS MÉTODOS: por encima del 4% a 4,7% del teléfono y del presencial, por debajo del 10% de internet. Y al mismo tiempo cerca del PISO de su propia historia: en la serie de 88 días, 84 de ellos tuvieron un valor igual o superior, con un máximo de 17,90% el 9/Jun y un mínimo de 6,80% el 6/Ago. Techo en la encuesta y piso en el precio, en la misma semana, y las dos cosas son verdad. Mayor volumen acumulado del libro presidencial entre los nombres por encima de 1%.`,

  'polymarketComparison.candidates[3].polymarket': `1,15%`,
  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `[${S}] En 1,15% (vol USD 5,62M acumulado). CAYÓ 0,10pp. Y LA DISTANCIA ENTRE ENCUESTA Y PRECIO AUMENTÓ el mismo día en que tuvo su mejor segunda vuelta de la ventana, con empate contra Lula en BTG/Nexus: de 4% a 5,7% de intención declarada contra 1,15% de probabilidad descontada. Es la mayor distancia entre las dos magnitudes en todo el pelotón. El panel registra la distancia sin restar una de la otra, porque la encuesta mide intención ahora y el contrato mide probabilidad de ganar al final.`,

  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `[${S}] En 0,05% (vol USD 13,90M acumulado). EL CONTRASTE QUE VALE REGISTRAR: este es el MAYOR volumen acumulado de todo el libro presidencial, con USD 13,90M, y el precio está en el piso. Volumen alto con probabilidad en el piso es convicción ya descontada, no movimiento, y el nivel es lo bastante bajo para que las variaciones en esta franja tengan un valor informativo casi nulo.`,

  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `[${S}] En 0,45% (vol USD 5,05M acumulado), ESTANCADO. El valor está POR DEBAJO del corte de 0,5% que el panel usa para separar precio de ruido, y la lectura sobre él sigue suspendida mientras esté en esa franja. Salvedad de serie que sigue valiendo: su máximo fue 10,10%, el 26/Abr.`,

  'polymarketComparison.candidates[6].polymarket': `0,15%`,
  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `[${S}] En 0,15% (vol USD 6,98M acumulado), alza de 0,10pp en un nivel en el que la variación no tiene valor informativo. Sigue sin encuesta y sin candidatura presidencial, disputando la gobernación de São Paulo.`,

  'polymarketComparison.note':
    `LOS PRECIOS DE ESTA SECCIÓN SON DE LA ${S.toUpperCase()}, confirmados por dos lecturas independientes tomadas con ocho minutos de intervalo. EL DÍA TRAJO ENCUESTAS Y TRAJO PRECIO, Y LOS DOS APUNTAN HACIA LADOS DISTINTOS. Dos nacionales fueron publicadas, la BTG/Nexus (n=2.001, telefónica) con 40% x 35% en la primera vuelta y 47% x 44% en la segunda, y el estreno de Palver (n=5.000, por internet) con 44% x 40% y empate en 46% x 46%. CUATRO CRUCES SALEN DE AHÍ. El primero es de amplitud: en las cuatro nacionales desde el 5/Ago el segundo colocado varía 10pp, de 30% a 40%, contra 5pp del primero, y en la segunda vuelta la distancia entre ellos va de 0pp a 5,5pp según la casa. El segundo es de método, y fue declarado por el propio instituto: Renan Santos aparece con 4% y 4,7% por teléfono y presencial y con 10% por internet, y Palver evaluó que el formato digital pudo haber impulsado su desempeño, informando que prueba enfoques para reducir el efecto. Su precio, 7,65%, queda entre los dos métodos, y CAYÓ 0,15pp el mismo día, dejándolo cerca del piso de su propia serie, con 84 de los 88 días en un valor igual o superior. El tercero es EL MECANISMO DE LA DIFERENCIA, que se invirtió en veinticuatro horas: la distancia entre los dos primeros se estrechó a +36,25pp, pero hoy fue porque el SEGUNDO subió 0,30pp con el líder estancado, cuando ayer había sido porque el LÍDER cedió 1,00pp con el segundo estancado. Flávio fue el único nombre del pelotón que subió. El cuarto es de dirección entre instrumentos: en la semana en que la diferencia de mercado se estrechó, en seis de las siete últimas jornadas, la de BTG/Nexus se ABRIÓ dentro de su propia casa, de 4pp a 5pp en la primera vuelta y de 1pp a 3pp en la segunda. Dos instrumentos, la misma disputa, sentidos opuestos, y el panel registra el cruce sin decir cuál está en lo cierto.`,
})
