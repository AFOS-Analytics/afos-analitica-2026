/**
 * Mapa ES, complemento de 17/Ago: Marçal entra, estado eleitoral declarado.
 * Índices novos: 0 Lula, 1 Flávio, 2 Renan, 3 Caiado, 4 Marçal, 5 Tarcísio, 6 Zema, 7 Haddad.
 */
import { construir } from '../build-locale-json'

const CAR = 'lectura confirmada del 17 de ago, 18:48 BRT (21:48 UTC)'

construir('polls-data', 'es', {
  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `🔴 CAÍDA DE 2,00pp EL 17 DE AGO, de 66,50% a 64,50% (vol USD 8,52M acumulado), ${CAR}, con la traba de captura aprobada en DOS pasadas separadas. Devolvió exactamente lo que había subido la víspera. La distancia hacia el segundo SE CERRÓ de 37,05pp a 33,05pp, o sea 4,00pp en cerca de 26 horas. ⛔ Sin superlativo: desde el 19 de may la serie marcó 66,50% como máximo, el 1 de ago, y 5 de los 90 días registrados están por encima del cierre de hoy.`,

  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `🔴 CAÍDA: pasó de 4,70% a 4,05% (vol USD 9,95M acumulado), ${CAR}, y el valor queda POR DEBAJO del piso de 4,80% registrado en la serie de 90 días. ⚠️ SALVEDAD DE FORMA: su book es fino y osciló entre 3,75% y 4,15% en menos de diez minutos durante la captura, así que el movimiento merece una lectura más floja que la de los dos primeros. En el contrato de tercer lugar cedió de 53,00% a 52,50%.`,

  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `⭐ EL CRUCE DE CONTRATO SE REPITE Y CAMBIA DE SIGNO: pasó de 0,60% a 0,25% en la VICTORIA (vol USD 6,07M acumulado), por debajo del piso de 0,50% de la serie, y SUBIÓ de 37,50% a 38,50% en el contrato de TERCER LUGAR de la primera vuelta. Su distancia hacia el primero de ese book se cerró de 15,50pp a 14,00pp. Son preguntas distintas y el panel no las suma.`,

  // ---- MARÇAL, linha nova ----
  'polymarketComparison.candidates[4].polymarket': `0,90%`,
  'polymarketComparison.candidates[4].pesquisaRange': `no testeado`,
  'polymarketComparison.candidates[4].tendenciaPesquisa':
    `🔴 NINGUNA de las 19 encuestas del panel lo testea, y ninguna nacional de la ventana lo incluye en escenario presidencial. 📅 La Datafolha prevista para el 21 de ago será la PRIMERA en incluirlo, según Valor Econômico. ⚠️ Mientras tanto el panel registra ausencia de medición, que es distinto de una medición igual a cero, y por eso queda fuera del grafo de cruce hasta que exista encuesta.`,
  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `En 0,90% (vol USD 1,21M acumulado), ${CAR}. Es el único book en el que aparece: no tiene contrato de segundo ni de tercer lugar. 🏷️ SITUACIÓN ELECTORAL DECLARADA: pidió el registro y está entre los 13 que lo hicieron, y una MEDIDA CAUTELAR habilitó la campaña, pero está INELEGIBLE hasta 2032 y el registro sigue PENDIENTE de una decisión de la justicia electoral, según BBC, G1 y Folha de S.Paulo. ⭐ El cruce que produce es el más nítido del panel hoy: el mercado ya le atribuye precio y más de un millón de dólares de volumen, y la urna todavía no lo midió ni una sola vez.`,

  // ---- TARCÍSIO, agora índice 5 ----
  'polymarketComparison.candidates[5].pesquisaRange': `no testeado`,
  'polymarketComparison.candidates[5].tendenciaPesquisa':
    `🏷️ NO ES CANDIDATO A LA PRESIDENCIA: abrió campaña por la REELECCIÓN a la gobernación de São Paulo el 16 de ago, según O Globo y Folha de S.Paulo. Ninguna nacional de la ventana lo testea en escenario presidencial, y la ausencia de test es información que el panel registra en vez de repetir un dato viejo como si fuera nuevo.`,
  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `En 0,05% (vol USD 13,93M acumulado), ${CAR}, estable y por debajo del corte de 0,5% que el panel usa para separar precio de ruido. ⭐ Y acá está la razón de que la fila PERMANEZCA en el panel aun con él fuera de la disputa presidencial: en la captura del 17 de ago tiene el volumen acumulado más alto entre los 18 contratos con precio del book presidencial, por encima del propio líder, que tiene USD 8,52M. Alcance declarado: la comparación se hace en esta captura, no a lo largo de la serie. Volumen alto con probabilidad en el piso, sobre alguien que ya registró candidatura a otro cargo, es convicción descontada en un desenlace que la realidad descartó. El panel muestra eso en vez de borrar la fila.`,

  // ---- ZEMA, agora índice 6 ----
  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `ALZA de 0,10pp: pasó de 0,15% a 0,25% (vol USD 5,62M acumulado), ${CAR}. El precio sigue por debajo del corte de 0,5% que el panel usa para separar precio de ruido. En el contrato de tercer lugar tiene 4,95%.`,

  // ---- HADDAD, agora índice 7 ----
  'polymarketComparison.candidates[7].pesquisaRange': `no testeado`,
  'polymarketComparison.candidates[7].tendenciaPesquisa':
    `🏷️ NO ES CANDIDATO A LA PRESIDENCIA: abrió campaña a la GOBERNACIÓN DE SÃO PAULO el 16 de ago, según O Globo y Times Brasil. Ninguna nacional de la ventana lo incluye en escenario presidencial, y cualquier escenario que lo incluyera sería una hipótesis de encuesta, no una candidatura en curso.`,
  'polymarketComparison.candidates[7].tendenciaPolymarket':
    `En 0,05% (vol USD 7,20M acumulado), ${CAR}, estable y por debajo del corte de 0,5%. El contrato sigue abierto y negociado aun con él disputando otro cargo, y el panel mantiene la fila para registrar ese hecho en vez de esconderlo.`,

  'polymarketComparison.note':
    `⭐ EL DÍA TIENE UNA DIVERGENCIA DE DIRECCIÓN ENTRE LOS DOS UNIVERSOS, y ese es el hallazgo. La BTG/Nexus del 17 de ago (n=2.003, campo del 14 al 16 de ago, margen de 2pp) mostró ESTABILIDAD: el líder pasó de 40% a 41%, el segundo de 35% a 36%, la distancia quedó en los mismos 5 puntos y el balotaje repitió 47 a 44. El mismo día el precio CERRÓ 4,00pp de esa distancia, de 37,05pp a 33,05pp. ` +
    `⛔ El panel no afirma que el precio reaccionó a la encuesta: la encuesta no achicó nada, así que no explica un achicamiento de 4 puntos. ` +
    `⭐ Y hay un segundo cruce, sobre quién es el tercero: la encuesta pone a Caiado en 5% y a Renan Santos en 4%, mientras el mercado le da 4,05% a Renan y 0,25% a Caiado, y en el contrato de tercer lugar 52,50% contra 38,50%. Los dos universos no coinciden sobre el orden del pelotón. ` +
    `📌 Captura confirmada por DOS pasadas independientes de la traba, en ventanas separadas. ` +
    `🏷️ ESTADO ELECTORAL DECLARADO POR FILA, desde el 17 de ago: Pablo Marçal entra en la tabla porque es candidato registrado habilitado a hacer campaña por una medida cautelar, aunque INELEGIBLE hasta 2032 y con el registro pendiente ante la justicia electoral. Tarcísio de Freitas y Fernando Haddad PERMANECEN pese a no disputar la Presidencia, porque sus contratos siguen abiertos y negociados, y el del primero carga, en la captura del 17 de ago, el volumen acumulado más alto entre los 18 contratos con precio del book presidencial. ⛔ El panel no borra una fila para quedar prolijo: declara el estado de cada una.`,
})
