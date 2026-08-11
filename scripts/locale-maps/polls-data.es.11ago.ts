/**
 * Mapa ES de 11/Ago para polls-data.json.
 * Convenções: vírgula decimal e ponto de milhar. "estancado", nunca "parado"; "descontar", nunca "precificar".
 */
import { construir } from '../build-locale-json'

const S = 'lectura confirmada del 11/Ago, 16:27 BRT'

construir('polls-data', 'es', {
  'polls[0].note':
    `Encuesta nacional CNT/MDA publicada el 11/Ago, contratada por la Confederación Nacional del Transporte. Primera vuelta Lula 42,4% x Flávio 28,7%, una distancia de 13,7pp. Segunda vuelta Lula 48% x Flávio 39%, 9pp. Campo del 5 al 8/Ago, n=2.002, margen 2,2pp, 95% de confianza, registro BR-06935/2026. ⚠️ ES LA LECTURA MÁS FAVORABLE AL LÍDER ENTRE LAS SIETE NACIONALES DESDE EL 5/Ago, y el mismo día Gerp publicó la más desfavorable, con el adversario por delante en la segunda vuelta. El 28,7% del segundo queda POR DEBAJO del piso que la ventana tenía hasta ayer, que era 30% en Genial/Quaest. EVALUACIÓN DE GOBIERNO: 35% la consideran excelente o buena y 36% mala o pésima, prácticamente empatados.`,
  'polls[0].source':
    `CNT/MDA difundida el 11/Ago por Estadão, UOL, Poder360, CartaCapital, VEJA, Gazeta do Povo, InfoMoney, O Povo y Revista Fórum. Registro TSE BR-06935/2026.`,

  'polls[1].note':
    `Encuesta nacional Gerp publicada el 11/Ago. Primera vuelta EMPATE en 38% x 38%, con Renan Santos 5%, Caiado 4%, Zema 2%, Cabo Daciolo y Augusto Cury 1% cada uno, 7% de indecisos y 4% por ninguno. Segunda vuelta Flávio 45% x Lula 43%. Campo del 6 al 10/Ago, n=2.400, telefónica, margen 2pp, 95% de confianza, registro BR-08045/2026. ⚠️ ES LA PRIMERA NACIONAL DE LA VENTANA EN PONER AL SEGUNDO POR DELANTE EN LA SEGUNDA VUELTA, y la propia difusión trata la diferencia de 2pp como empate técnico dentro del margen. EL MISMO DÍA CNT/MDA publicó al líder 9pp por delante en el mismo escenario, lo que pone las dos lecturas a 11 puntos de distancia. DESAPROBACIÓN del gobierno en 53%. 📌 El registro preveía publicación el 10/Ago y salió el 11/Ago, lo que es un retraso de difusión, no un dato nuevo.`,
  'polls[1].source':
    `Gerp difundida el 11/Ago por Exame, Jovem Pan, Poder360, CNN Brasil y Gazeta do Povo. Registro TSE BR-08045/2026.`,

  'polls[2].note':
    `Encuesta nacional Futura Inteligência publicada el 11/Ago. Primera vuelta Lula 38,8% x Flávio 34,1%, una distancia de 4,7pp. Segunda vuelta Lula 46,5% x Flávio 44%, 2,5pp, que la difusión trata como empate técnico. Campo del 3 al 7/Ago, n=2.000, telefónica, margen 2,2pp, 95% de confianza. RECHAZO con Flávio en 47,1% y Lula en 45,9%, empate técnico también aquí. APROBACIÓN del gobierno en 47,3% contra 49,9% de desaprobación. ⚠️ EL REGISTRO DEL TSE NO SE CERRÓ CON CERTEZA: la ventana lista a 100 Cidades con la misma muestra de n=2.000 y la misma fecha, y las dos marcas publican juntas como 100% Cidades/Futura, pero la correspondencia no fue confirmada en fuente primaria. El panel declara la duda en lugar de afirmar el protocolo. QUEDA EN EL MEDIO DE LAS TRES DE HOY, entre los 9pp de ventaja del líder en CNT/MDA y los 2pp del adversario en Gerp.`,
  'polls[2].source':
    `Futura Inteligência difundida el 11/Ago por CNN Brasil, Exame, Gazeta do Povo, Jornal de Brasília, Brasil 247 y Jornal Opção. Registro TSE no confirmado, ver nota.`,

  'approvalData.note':
    `TRES NACIONALES EL 11/Ago, y la dispersión de la evaluación acompaña a la de la intención de voto. Futura Inteligência: 47,3% aprueban y 49,9% desaprueban, un saldo de 2,6pp negativos. Gerp: 53% de desaprobación. CNT/MDA no publica el par aprueba y desaprueba, sino la evaluación de la gestión, con 35% de excelente o buena contra 36% de mala o pésima. Siguen en el cuadro BTG/Nexus del 10/Ago, con 46% x 49%, Palver del mismo día, con 45% x 55%, y Genial/Quaest del 5/Ago, con 48% x 47%. LO QUE MUESTRA EL CONJUNTO: en siete lecturas de siete días la desaprobación va de 47% a 55%, una distancia de 8pp entre casas, y el saldo va de 1pp positivo a 10pp negativo. ⚠️ PROCEDENCIA DECLARADA: aprobación y desaprobación son de Futura Inteligência del 11/Ago, elegida por ser la única de las tres de hoy que publica el par cerrado; la evaluación de la gestión, con 36% positiva, 26% regular y 36% negativa, sigue siendo la de Genial/Quaest del 5/Ago, porque ninguna casa de hoy publicó ese desglose completo. El panel prefiere declarar la mezcla a esconderla.`,
  'approvalData.source':
    `Aprobación y desaprobación: Futura Inteligência 11/Ago/2026 (campo del 3 al 7/Ago, n=2.000, telefónica, margen 2,2pp), difundida por CNN Brasil, Exame, Gazeta do Povo y Jornal de Brasília. Otras lecturas de la ventana: Gerp 11/Ago (n=2.400), CNT/MDA 11/Ago (n=2.002, evaluación de gestión), BTG/Nexus 10/Ago (BR-08428/2026) y Palver 10/Ago (BR-06596/2026). Evaluación de la gestión: Genial/Quaest 5/Ago/2026 (campo del 31/Jul al 3/Ago, n=2.004, presencial, BR-06591/2026).`,

  'polymarketComparison.note':
    `LOS PRECIOS DE ESTA SECCIÓN SON DE LA LECTURA CONFIRMADA DEL 11/AGO, 16:27 BRT, confirmados por dos lecturas independientes tomadas con ocho minutos de intervalo. EL DÍA TUVO TRES ENCUESTAS NACIONALES Y DISCREPAN ENTRE SÍ MÁS QUE EN CUALQUIER OTRO DÍA DE LA VENTANA. En la segunda vuelta, CNT/MDA da 48% x 39% para el líder, Futura da 46,5% x 44%, y Gerp da 45% x 43% PARA EL SEGUNDO. Son once puntos de distancia entre la lectura más favorable y la más desfavorable, sobre la misma pregunta, el mismo día, y es la primera vez en la ventana que una nacional pone al adversario por delante en la segunda vuelta. En la primera vuelta la distancia es de 9,3pp, entre el 28,7% de CNT/MDA y el 38% de Gerp. ⭐ EL CRUCE CENTRAL ES DE RÉGIMEN, NO DE NIVEL: mientras la encuesta abría esa distancia, el mercado casi no se movió. El líder quedó estancado por tercera jornada, el segundo devolvió 0,30pp, y la mayor variación de todo el libro fue de 0,75pp, en el tercero. Los dos instrumentos midieron la misma semana, y uno de ellos está mucho más incierto que el otro. El panel registra la diferencia de régimen sin decir qué instrumento está en lo cierto, porque no lo sabe, y porque decirlo sería cambiar medición por opinión.`,
  'polymarketComparison.sources':
    `Precios de Polymarket vía proxy AFOS, captura confirmada por dos lecturas independientes tomadas con ocho minutos de intervalo, la más reciente a las 16:27 BRT del 11/Ago (scripts/capture-guard.ts). Encuestas del 11/Ago: CNT/MDA BR-06935/2026 (n=2.002, presencial, campo del 5 al 8/Ago), Gerp BR-08045/2026 (n=2.400, telefónica, campo del 6 al 10/Ago) y Futura Inteligência (n=2.000, telefónica, campo del 3 al 7/Ago, registro no confirmado en fuente primaria). Siguen vigentes Palver BR-06596/2026 y BTG/Nexus BR-08428/2026, del 10/Ago, y Genial/Quaest BR-06591/2026 y Meio/Ideia BR-04579/2026, del 5/Ago. Próxima nacional en la fila de difusión: PoderData (n=2.400, BR-06868/2026) el 13/Ago.`,

  'polymarketComparison.candidates[0].pesquisaRange': `38-44%`,
  'polymarketComparison.candidates[0].tendenciaPesquisa':
    `TRES NACIONALES EL 11/Ago, Y DISCREPAN ENTRE SÍ MÁS QUE EN CUALQUIER DÍA DE LA VENTANA. CNT/MDA (n=2.002, presencial, campo del 5 al 8/Ago, BR-06935/2026): 42,4% en la primera vuelta y 48% x 39% en la segunda, 9pp de ventaja. Futura Inteligência (n=2.000, telefónica, campo del 3 al 7/Ago): 38,8% y 46,5% x 44%, 2,5pp. Gerp (n=2.400, telefónica, campo del 6 al 10/Ago, BR-08045/2026): EMPATE en 38% x 38% en la primera vuelta y DERROTA por 45% x 43% en la segunda. Sumando las siete nacionales desde el 5/Ago va de 38% a 44%, y en la segunda vuelta el resultado va de 9pp a favor a 2pp en contra, es decir, ONCE PUNTOS de distancia entre casas sobre la misma pregunta. APROBACIÓN con 47,3% contra 49,9% en Futura y 53% de desaprobación en Gerp, y CNT/MDA trae la gestión en 35% de excelente o buena contra 36% de mala o pésima. ⚠️ El porcentaje usado en el gráfico es el de Gerp, elegida por ser la ÚNICA de las tres de hoy que publica el campo completo, con todos los nombres; MDA y Futura difundieron solo los dos primeros.`,
  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `[${S}] En 63,50% (vol USD 8,21M acumulado), ESTANCADO por tercera jornada seguida. La diferencia sobre Flávio volvió a +36,55pp, exactamente el valor del 9/Ago, deshaciendo el estrechamiento de ayer, y de nuevo por la punta del adversario, que devolvió los 0,30pp que había ganado. ⚠️ EL CONTRASTE CON LA ENCUESTA ES EL DATO DE LA RONDA: mientras tres institutos publicaban lecturas separadas por once puntos en la segunda vuelta, su precio no se movió, y la mayor variación de todo el libro fue de 0,75pp. En la serie de 89 días el techo es 66,50%, del 1/Ago, y 15 de los 89 días tuvieron un valor igual o superior al actual, así que el nivel no es extremo.`,

  'polymarketComparison.candidates[1].pesquisaRange': `28,7-40%`,
  'polymarketComparison.candidates[1].polymarket': `26,95%`,
  'polymarketComparison.candidates[1].tendenciaPesquisa':
    `SU AMPLITUD CRECIÓ Y AHORA ES DE 11,3pp. En las siete nacionales desde el 5/Ago aparece con 28,7% en la CNT/MDA de hoy, 30% en Genial/Quaest, 34,1% en la Futura de hoy, 35% en Meio/Ideia, 35% en BTG/Nexus, 38% en la Gerp de hoy y 40% en Palver. El 28,7% queda POR DEBAJO del piso que la ventana tenía hasta ayer. EN LA SEGUNDA VUELTA EL DÍA FUE AÚN MÁS EXTREMO: Gerp lo pone POR DELANTE, con 45% contra 43%, y es la primera nacional de la ventana en hacerlo, mientras CNT/MDA lo pone 9pp por detrás el mismo día. Futura queda en el medio, con 44% contra 46,5%. RECHAZO en 47,1% en Futura, empate técnico con el 45,9% del líder. ⚠️ El porcentaje del gráfico es el de Gerp, la misma casa de referencia del primero.`,
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `[${S}] En 26,95% (vol USD 8,12M acumulado). CAYÓ 0,30pp y devolvió exactamente lo que había ganado ayer, llevando la diferencia de vuelta a +36,55pp. ⚠️ EL DÍA MUESTRA LOS DOS INSTRUMENTOS EN REGÍMENES DISTINTOS: en la encuesta varía 11,3pp entre casas y llega a liderar una segunda vuelta; en el precio se movió 0,30pp. No es extremo: 30 de los 89 días de la serie tuvieron un valor igual o superior, con un techo de 34,40% el 13/May y un piso de 22,00% el 3/Jul. En el contrato de segundo lugar cayó 1,50pp, a 80,50%.`,

  'polymarketComparison.candidates[2].polymarket': `8,40%`,
  'polymarketComparison.candidates[2].tendenciaPesquisa':
    `GERP LO PONE EN 5% en la primera vuelta, el segundo mayor valor que obtuvo en la ventana, por detrás solo del 10% de Palver por internet. Siguen vigentes el 4% de Genial/Quaest presencial, el 4,7% de Meio/Ideia por teléfono y el 4% de BTG/Nexus por teléfono. CNT/MDA y Futura no publicaron el campo completo. EL EFECTO DE MÉTODO SIGUE SIENDO LA LECTURA: el mismo nombre va de 4% a 10% según el entorno de la entrevista, y la salvedad fue declarada por la propia Palver, que informó que prueba enfoques para reducir el efecto en encuestas online.`,
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `[${S}] En 8,40% (vol USD 9,43M acumulado). SUBIÓ 0,75pp y fue LA MAYOR VARIACIÓN DE TODO EL LIBRO PRESIDENCIAL en la lectura de hoy. ⭐ Y salió del piso: ayer 84 de los 88 días de la serie tenían un valor igual o superior al suyo, y hoy son 72 de 89. El precio sigue ENTRE los dos métodos de la encuesta, por encima del 4% a 5% del teléfono y del presencial y por debajo del 10% de internet. ⚠️ El panel NO atribuye el alza a la discusión pública sobre método que la prensa hizo el 10 y el 11/Ago, porque no midió nada que ligue las dos cosas, y registra la secuencia sin afirmar causa. Mayor volumen acumulado del libro entre los nombres por encima de 1%.`,

  'polymarketComparison.candidates[3].polymarket': `1,05%`,
  'polymarketComparison.candidates[3].tendenciaPesquisa':
    `La Gerp de hoy le da 4% en la primera vuelta, el mismo valor de Genial/Quaest del 5/Ago, y Meio/Ideia sigue con 5,7%. CNT/MDA y Futura no publicaron el campo completo, y Palver no lo probó, así que la base de comparación sobre él se redujo en esta ventana. Sigue vigente el empate de Lula con él en la segunda vuelta de BTG/Nexus del 10/Ago, que es el mejor resultado que un nombre fuera de los dos primeros obtuvo en el período.`,
  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `[${S}] En 1,05% (vol USD 5,63M acumulado). CAYÓ 0,10pp por tercera jornada seguida, y la distancia entre encuesta y precio sigue siendo la mayor del pelotón: de 4% a 5,7% de intención declarada contra 1,05% de probabilidad descontada. El panel registra la distancia sin restar una magnitud de la otra, porque la encuesta mide intención ahora y el contrato mide probabilidad de ganar al final.`,

  'polymarketComparison.candidates[4].tendenciaPesquisa':
    `Ninguna de las tres rondas del 11/Ago lo prueba en escenario presidencial, y lo mismo valía para las del 10 y del 5/Ago. La ausencia de prueba es información que el panel registra, en lugar de repetir un dato antiguo como si fuera nuevo. Disputa la REELECCIÓN al gobierno de São Paulo, oficializada por Republicanos el 1/Ago, y la cobertura del 11/Ago trae una encuesta estatal que prueba el escenario paulista tras el primer debate.`,
  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `[${S}] En 0,05% (vol USD 13,90M acumulado). ⚠️ Sigue siendo el MAYOR volumen acumulado de todo el libro presidencial, con el precio en el piso. Volumen alto con probabilidad en el piso es convicción ya descontada, no movimiento, y las variaciones en esta franja tienen un valor informativo casi nulo.`,

  'polymarketComparison.candidates[5].polymarket': `0,35%`,
  'polymarketComparison.candidates[5].tendenciaPesquisa':
    `La Gerp de hoy le da 2% en la primera vuelta, y la BTG/Nexus del 10/Ago había dado 3%. Siguen vigentes el 2% de Genial/Quaest y el 2,6% de Meio/Ideia, del 5/Ago. Registró su candidatura ante el TSE el 6/Ago, declarando R$ 178,7 millones de patrimonio, y el plazo de registro de los demás se cierra el 15/Ago.`,
  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `[${S}] En 0,35% (vol USD 5,05M acumulado). CAYÓ 0,10pp y se hundió más por debajo del corte de 0,5% que el panel usa para separar precio de ruido, franja en la que la lectura sobre él sigue suspendida. Salvedad de serie que sigue valiendo: su máximo fue 10,10%, el 26/Abr.`,

  'polymarketComparison.candidates[6].tendenciaPesquisa':
    `Ninguna de las tres rondas del 11/Ago lo prueba en escenario presidencial. El agravante permanece y hay que decirlo con claridad: él NO es candidato a la Presidencia, disputa el gobierno de São Paulo, y cualquier escenario que lo incluya es una hipótesis de encuesta, no una candidatura en curso. La cobertura del 11/Ago lo trae en una encuesta estatal paulista, tras el primer debate en Band.`,
  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `[${S}] En 0,05% (vol USD 7,01M acumulado), de vuelta al piso tras un único día por encima de él. La variación en esta franja no tiene valor informativo.`,
})
