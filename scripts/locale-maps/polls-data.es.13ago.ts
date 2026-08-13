/**
 * Mapa ES de 13/Ago para polls-data.json.
 * Convenções: vírgula decimal e ponto de milhar, como no pt-BR. Datas "13 de ago".
 */
import { construir } from '../build-locale-json'

const S = 'última lectura confirmada, del 12 de ago, 16:41 BRT'
const P = `[sin lectura de mercado nueva el 13 de ago; valor de la ${S}]`

construir('polls-data', 'es', {
  'polls[0].note':
    `Encuesta nacional PoderData/Aya publicada el 13 de ago (Poder360, CNN Brasil, Exame, R7, Jovem Pan, Brasil 247, Gazeta do Povo). Primera vuelta Lula 41% x Flávio 35%, una distancia de 6pp. Balotaje Lula 46% x Flávio 45%, 1pp, empate técnico por el margen de 2pp. Campo del 9 al 12 de ago, n=2.400, telefónica, margen 2pp, 95% de confianza, registro BR-06868/2026. ⭐ LA COMPARACIÓN QUE VALE ES CON LA PROPIA CASA, Y SEPARA LAS DOS VUELTAS: en la primera vuelta la distancia NO se movió en cuatro semanas, fueron 6pp el 16 de jul (40% x 34%), 6pp el 30 de jul (41% x 35%) y son 6pp ahora, con los dos primeros repitiendo exactamente los mismos valores de la ronda anterior; en el balotaje la distancia cayó de 3pp a 1pp en el mismo intervalo. Misma casa, mismo método y misma muestra, con la primera vuelta detenida y el balotaje estrechándose. RECHAZO empatado en 48% para cada uno (Poder360). CNN Brasil y Bnews registran que Lula empata también con Zema y con Caiado en el balotaje y vence a Renan Santos; los porcentajes de esos cruces no fueron publicados en las notas capturadas y por eso no entran aquí.`,
  'polls[0].source':
    `PoderData/Aya divulgada el 13 de ago por Poder360, CNN Brasil, Exame, R7, Jovem Pan, Brasil 247, Gazeta do Povo, Rádio Itatiaia y Portal Salvador FM. Registro TSE BR-06868/2026.`,

  'approvalData.note':
    `ENCUESTA NACIONAL NUEVA EL 13 DE AGO, la primera desde el 11 de ago. PoderData/Aya: 43% aprueban y 50% desaprueban el trabajo de Lula, un saldo de 7pp negativos, contra 47,3% x 49,9% de Futura Inteligência del 11 de ago, que era el par vigente hasta ayer. ⚠️ SON DOS PREGUNTAS DISTINTAS EN EL MISMO DÍA, y el panel no las suma: la Revista Oeste informó 51% de desaprobación DEL GOBIERNO en el mismo relevamiento, número que no es el mismo que el 50% de desaprobación del TRABAJO DE LULA publicado por Poder360, CNN Brasil y Rádio Itatiaia. RECHAZO empatado en 48% para Lula y 48% para Flávio Bolsonaro. Siguen en el cuadro la Gerp del 11 de ago con 53% de desaprobación, BTG/Nexus del 10 de ago con 46% x 49%, Palver del mismo día con 45% x 55% y Genial/Quaest del 5 de ago con 48% x 47%. LO QUE MUESTRA EL CONJUNTO: en ocho lecturas de nueve días la desaprobación va de 47% a 55%, una distancia de 8pp entre casas, y el saldo va de 1pp positivo a 10pp negativo. Ninguna casa cambió de lado, y la nueva entra dentro del rango que ya existía. ⚠️ PROCEDENCIA DECLARADA: aprobación y desaprobación son de PoderData/Aya del 13 de ago (campo del 9 al 12 de ago, n=2.400, telefónica, margen 2pp, registro BR-06868/2026), por ser la lectura nacional más reciente; el 7% restante es el residuo aritmético entre los dos valores publicados, y no un número que la casa haya divulgado con esa etiqueta. La evaluación de la gestión, con 36% positiva, 26% regular y 36% negativa, sigue siendo la de Genial/Quaest del 5 de ago, porque ninguna casa posterior publicó esa apertura completa. El panel prefiere declarar la mezcla que esconderla.`,
  'approvalData.source':
    `Aprobación y desaprobación: PoderData/Aya 13 de ago de 2026 (campo del 9 al 12 de ago, n=2.400, telefónica, margen 2,0pp, registro TSE BR-06868/2026), divulgada por Poder360, CNN Brasil, Exame, Rádio Itatiaia y Portal Salvador FM. Evaluación de la gestión (óptimo/bueno, regular, malo/pésimo): Genial/Quaest 5 de ago de 2026. La desaprobación del gobierno en 51% en el mismo relevamiento, según Revista Oeste, es una pregunta distinta y está declarada en la nota.`,

  'polymarketComparison.note':
    `ACTUALIZACIÓN DEL 13 DE AGO. LA ENCUESTA SE MOVIÓ Y EL PRECIO NO TIENE LECTURA NUEVA. PoderData/Aya publicó la primera nacional desde el 11 de ago, y el hallazgo está en la casa comparada consigo misma: en la primera vuelta la distancia entre los dos primeros no se movió en cuatro semanas, fueron 6pp el 16 de jul, 6pp el 30 de jul y 6pp ahora, con ambos repitiendo exactamente los mismos porcentajes; en el balotaje, en el mismo intervalo, la distancia cayó de 3pp a 1pp. Una vuelta detenida y la otra estrechándose, en la misma casa, con el mismo método y la misma muestra. El rechazo salió empatado en 48% para los dos. Y el pelotón tuvo su mejor día de la ventana en el balotaje, con Caiado y Zema empatando con el líder y solo Renan Santos perdiendo, según CNN Brasil y Bnews. ⚠️ PROCEDENCIA DE LOS PRECIOS: no hay lectura de mercado nueva el 13 de ago, y los valores de esta sección son los de la ${S}. AFOS solo publica precio que dos lecturas independientes confirmen. Las salvedades de serie de esta ronda fueron medidas sobre todos los puntos registrados, y no sobre el último punto de cada día, porque guardar solo el último punto descarta el extremo intradiario y desplaza el máximo y el piso.`,

  'polymarketComparison.sources':
    `Precios de Polymarket vía proxy AFOS, y el panel solo publica precio que dos lecturas independientes, tomadas con ocho minutos de intervalo, confirmen. No hay lectura confirmada nueva el 13 de ago, así que los valores exhibidos son los de la ${S}. ✅ ENCUESTA NACIONAL NUEVA EL 13 DE AGO: PoderData/Aya, n=2.400, registro BR-06868/2026, campo del 9 al 12 de ago. Siguen vigentes la CNT/MDA BR-06935/2026, la Gerp BR-08045/2026 y la Futura Inteligência BR-08109/2026, todas del 11 de ago, más la Palver BR-06596/2026 y la BTG/Nexus BR-08428/2026, del 10 de ago, y la Genial/Quaest BR-06591/2026 y la Meio/Ideia BR-04579/2026, del 5 de ago. Próximas nacionales en la fila: Quaest (n=2.004, BR-06773/2026) el 14 de ago y Nexus (n=2.000, BR-03317/2026) el 17 de ago.`,

  'polymarketComparison.candidates[0].tendenciaPesquisa':
    `ENCUESTA NACIONAL NUEVA EL 13 DE AGO, la primera desde el 11 de ago. PoderData/Aya (n=2.400, telefónica, campo del 9 al 12 de ago, BR-06868/2026): 41% en la primera vuelta y 46% x 45% en el balotaje contra Flávio Bolsonaro. ⭐ EL HALLAZGO ESTÁ EN LA CASA COMPARADA CONSIGO MISMA, Y SEPARA LAS DOS VUELTAS: en la primera vuelta la distancia no se movió en cuatro semanas, fueron 6pp el 16 de jul (40% x 34%), 6pp el 30 de jul (41% x 35%) y son 6pp ahora, con los dos primeros repitiendo exactamente los valores de la ronda anterior; en el balotaje la distancia cayó de 3pp a 1pp en el mismo intervalo. Misma casa, mismo método, misma muestra. CNN Brasil y Bnews registran que empata también con Zema y con Caiado en el balotaje y vence a Renan Santos. RECHAZO en 48%, empatado con el de su adversario. APROBACIÓN PERSONAL en 43% contra 50% de desaprobación, y la Revista Oeste informa 51% de desaprobación DEL GOBIERNO en el mismo relevamiento, que es una pregunta distinta. Sumando las ocho nacionales desde el 5 de ago va de 38% a 44% en la primera vuelta, y en el balotaje el resultado va de 9pp a favor a 2pp en contra.`,
  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `${P} En 63,50% (vol USD 8,22M acumulado). SALVEDAD DE SERIE, medida sobre todos los puntos registrados y no sobre el último de cada día: entre los 173 puntos desde el 16 de may, 29 tuvieron un valor igual o superior a 63,50%, con un máximo de 66,50% el 1 de ago a las 23:00 y un piso de 39,50% el 26 de may. El movimiento del día vino de la encuesta, no del precio.`,

  'polymarketComparison.candidates[1].pesquisaRange': `28,7-38%`,
  'polymarketComparison.candidates[1].polymarket': `27,65%`,
  'polymarketComparison.candidates[1].tendenciaPesquisa':
    `ENCUESTA NACIONAL NUEVA EL 13 DE AGO. PoderData/Aya le da 35% en la primera vuelta y 45% en el balotaje, a 1pp de Lula, dentro del margen de 2pp. ⭐ CONTRA LA PROPIA CASA NO SE MOVIÓ EN LA PRIMERA VUELTA, repitiendo el 35% del 30 de jul, pero ACORTÓ EL BALOTAJE de 43% a 45%. Exame lo resumió como crecimiento de él en el balotaje. RECHAZO en 48%, exactamente igual al del líder, que es el dato que impide una lectura fácil sobre quién tiene mayor techo. En las ocho nacionales desde el 5 de ago va de 28,7% a 38% en la primera vuelta, y la amplitud entre casas sigue siendo de más de 9pp sobre la misma pregunta.`,
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `${P} En 27,65% (vol USD 8,13M acumulado). SALVEDAD DE SERIE, medida sobre todos los puntos registrados: entre los 172 puntos desde el 16 de may, 51 tuvieron un valor igual o superior, con un máximo de 33,20% el 2 de jun a las 19:30 y un piso de 22,00% el 3 de jul a las 01:00.`,

  'polymarketComparison.candidates[2].polymarket': `7,45%`,
  'polymarketComparison.candidates[2].tendenciaPesquisa':
    `PoderData del 13 de ago lo probó en el balotaje y, según Bnews, es el único del pelotón al que Lula VENCE en ese escenario, mientras empata con los otros tres. Sus porcentajes de primera vuelta en esta ronda no aparecieron en las notas capturadas, así que siguen valiendo el 5% de la Gerp del 11 de ago, el 4% de Genial/Quaest y de BTG/Nexus, el 4,7% de Meio/Ideia y el 10% de Palver por internet. El efecto de método sigue siendo la lectura sobre él: el mismo nombre va de 4% a 10% según el ambiente de la entrevista, salvedad declarada por la propia Palver.`,
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `${P} En 7,45% (vol USD 9,48M acumulado). Mantiene el mayor volumen acumulado del libro entre los nombres por encima de 1%. El precio sigue ENTRE los dos métodos de la encuesta, por encima del 4% a 5% del teléfono y el presencial y por debajo del 10% de internet.`,

  'polymarketComparison.candidates[3].polymarket': `0,95%`,
  'polymarketComparison.candidates[3].tendenciaPesquisa':
    `PoderData del 13 de ago lo pone en EMPATE con Lula en el balotaje, según CNN Brasil y Bnews, lo que lo coloca junto a Flávio Bolsonaro y a Zema en ese escenario. Sus porcentajes de primera vuelta en esta ronda no aparecieron en las notas capturadas, y siguen valiendo el 4% de la Gerp y de Genial/Quaest, el 5,7% de Meio/Ideia y el 5% de BTG/Nexus. El empate en el balotaje es el segundo en cuatro días, después del de BTG/Nexus del 10 de ago, y es el mejor resultado que un nombre fuera de los dos primeros viene obteniendo en la ventana.`,
  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `${P} En 0,95% (vol USD 5,66M acumulado). ⚠️ SU CONTRASTE CRECIÓ HOY, Y QUIEN LO AMPLIÓ FUE LA ENCUESTA: empata con el líder en el balotaje por segunda vez en cuatro días, y el precio de victoria vigente está por debajo de 1%. Empatar en un balotaje y ganar la elección son preguntas distintas, y el panel no las suma.`,

  'polymarketComparison.candidates[4].polymarket': `0,05%`,
  'polymarketComparison.candidates[4].tendenciaPesquisa':
    `PoderData del 13 de ago no lo prueba en escenario presidencial, y lo mismo valía para las tres del 11 de ago y las del 10 y del 5 de ago. La ausencia de prueba es información que el panel registra, en vez de repetir un dato antiguo como si fuera nuevo. Compite por la REELECCIÓN en la gobernación de São Paulo, oficializada por Republicanos el 1 de ago. EN EL TABLERO DE HOY acudió al Supremo contra Lula después de que el préstamo del Banco do Brasil a São Paulo fuera citado en un debate, y Valor Econômico informó que Hacienda liberó la operación enseguida.`,
  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `${P} En 0,05% (vol USD 13,91M acumulado). Sigue siendo el mayor volumen acumulado de todo el libro presidencial, con el precio en el piso. Volumen alto con probabilidad en el piso es convicción ya descontada, no movimiento, y las variaciones en esta franja tienen valor informativo casi nulo.`,

  'polymarketComparison.candidates[5].tendenciaPesquisa':
    `PoderData del 13 de ago lo pone en EMPATE con Lula en el balotaje, según CNN Brasil y Bnews, y es la primera vez en la ventana que aparece en esa condición. Sus porcentajes de primera vuelta en esta ronda no aparecieron en las notas capturadas, y siguen valiendo el 2% de la Gerp del 11 de ago, el 3% de BTG/Nexus del 10 de ago, el 2% de Genial/Quaest y el 2,6% de Meio/Ideia. ⚠️ La distancia entre un empate en el balotaje y el 2% a 3% de la primera vuelta es grande, y ambos miden preguntas distintas: llegar al balotaje y ganarlo.`,
  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `${P} En 0,35% (vol USD 5,07M acumulado), por debajo del corte de 0,5% que el panel usa para separar precio de ruido. ⚠️ EL CONTRASTE DEL DÍA ES SUYO: empata con el líder en el balotaje y está valorado en 0,35% para ganar la elección.`,

  'polymarketComparison.candidates[6].polymarket': `0,15%`,
  'polymarketComparison.candidates[6].tendenciaPesquisa':
    `PoderData del 13 de ago no lo prueba en escenario presidencial. La salvedad permanece y debe decirse con claridad: él NO es candidato a la Presidencia, compite por la gobernación de São Paulo, y cualquier escenario que lo incluya es hipótesis de encuesta, no candidatura en curso.`,
  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `${P} En 0,15% (vol USD 7,06M acumulado). Una variación en esta franja no tiene valor informativo, y la salvedad de fondo permanece: él NO es candidato a la Presidencia y compite por la gobernación de São Paulo.`,
})
