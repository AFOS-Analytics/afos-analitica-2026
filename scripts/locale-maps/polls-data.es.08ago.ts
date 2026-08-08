/**
 * Mapa ES de 08/Ago para polls-data.json.
 * Convenções: vírgula decimal e ponto de milhar, como o pt. Datas "8/Ago".
 */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/es/glossary#${id})`
const PV = G('primera vuelta', 'primeiro-turno')

construir('polls-data', 'es', {
  'polymarketComparison.candidates[2].polymarket': `7,65%`,
  'polymarketComparison.candidates[3].polymarket': `1,35%`,
  'polymarketComparison.candidates[5].polymarket': `0,55%`,
  'polymarketComparison.candidates[6].polymarket': `0,05%`,

  'polymarketComparison.note':
    `LOS PRECIOS DE ESTA SECCIÓN SON DE LA LECTURA DEL 8/Ago, DE LAS 17:32 UTC. AFOS solo publica precio que dos lecturas independientes confirmen, tomadas con ocho minutos de intervalo. LA RACHA DE SEIS DÍAS DE ESTRECHAMIENTO DE LA BRECHA NO CONTINUÓ: venía de +41,80pp el 1/Ago y cayó todos los días hasta el 7/Ago, y hoy quedó en +37,55pp, con Lula estancado en 64,50% por quinto día y Flávio estancado en 26,95%. Ninguno de los dos devolvió terreno. EL MOVIMIENTO DEL DÍA ESTÁ EN LOS LIBROS DE COLOCACIÓN, y contradice la lectura de ayer: en el de segundo lugar de la ${PV}, Flávio cayó por segundo día consecutivo, de 87,50% el 6/Ago a 81,50% hoy, y esta vez su precio de ganador no subió junto; en el de tercer lugar, Caiado cayó 2,50pp y Renan Santos NO subió, quedó en 58,50%, así que la probabilidad salió del libro en vez de migrar dentro de él. También en el de segundo lugar, Renan Santos está en 8,30% contra 8,20% de Lula, diferencia de 0,10pp entre dos valores bajos, y estar por encima del presidente allí es el patrón de la serie, no una novedad: ocurrió en 75 de los 89 días. EL LADO DE LAS ENCUESTAS NO ES DE HOY: no hay encuesta nacional nueva desde el 5/Ago. Seis nacionales están registradas en el ${G('TSE', 'tse')} para el 10, el 11 y el 13/Ago, y ninguna tiene resultado todavía.`,

  'polymarketComparison.sources':
    `Precios de ${G('Polymarket', 'polymarket')} vía el proxy de AFOS, captura confirmada por dos lecturas, la más reciente a las 17:32 UTC del 8/Ago (scripts/capture-guard.ts). Encuestas: Genial/Quaest BR-06591/2026 y Meio/Ideia BR-04579/2026, ambas del 5/Ago, campo del 31/Jul al 3/Ago, divulgadas por G1, CNN Brasil, Folha de S.Paulo, Valor Econômico, O Globo, Estadão, Exame, Gazeta do Povo y JOTA. Barrido del TSE del 8/Ago: 565 registros, ninguno insertado nuevo por la ronda manual, y SEIS nacionales en la fila de divulgación: Palver (n=5.000), Gerp (n=2.400) y BTG/Nexus (n=2.000) el 10/Ago, MDA (n=2.002) y 100 Cidades (n=2.000) el 11/Ago, y PoderData (n=2.400, BR-06868/2026) el 13/Ago.`,

  'polymarketComparison.candidates[0].tendenciaPesquisa':
    `SIN ENCUESTA NACIONAL NUEVA desde el 5/Ago. Siguen vigentes las dos de ese día: ${G('Genial/Quaest', 'quaest')} (n=2.004, campo del 31/Jul al 3/Ago, presencial, margen 2pp, BR-06591/2026) con 39% en la ${PV} y 44% x 39% en el balotaje contra Flávio, ganando también a Zema por 46% x 34%, a Caiado por 45% x 37% y a Renan Santos por 45% x 35%; y Meio/Ideia (n=1.500, telefónica, margen 2,5pp, BR-04579/2026) con 43% y 48,5% x 43%. En los cruces de Quaest lidera entre los mayores, entre los católicos y entre quienes no tienen religión, y abre más de 16 puntos entre las mujeres. La APROBACIÓN sigue en 48% contra 47%. EN EL TABLERO, registró su candidatura en el ${G('TSE', 'tse')} la noche del 7/Ago, con Alckmin de compañero de fórmula, por la coalición Brasil Pronto Pra Mais, que reúne siete partidos y es la única fórmula de la disputa con más de uno.`,

  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `[lectura del 8/Ago, 17:32 UTC] En 64,50% (vol USD 8,12M acumulado). ESTANCADO en el mismo valor por QUINTO día consecutivo, del 4 al 8/Ago. La brecha sobre Flávio quedó en +37,55pp y la racha de seis días de estrechamiento no continuó. En la serie de 88 días, del 10/May al 7/Ago, su techo es 66,50%, del 1/Ago, y solo 8 de los 88 días tuvieron valor igual o mayor que el actual.`,

  'polymarketComparison.candidates[1].tendenciaPesquisa':
    `SIN ENCUESTA NACIONAL NUEVA. Siguen vigentes los 30% en la ${PV} de ${G('Genial/Quaest', 'quaest')}, contra 28% en la propia ronda del 15/Jul de esa casa, y los 35% de Meio/Ideia, contra 32% en su propia ronda del 8/Jul, con balotajes de 39% y 43%. La brecha contra Lula queda en 9pp en Quaest y 8pp en Ideia. En los cruces gana entre los evangélicos, el único segmento grande en el que aparece por delante. El RECHAZO sigue en 54%, contra 52% de Lula. EN EL TABLERO, su fórmula cerró el cuadro en que 2026 se vuelve la primera elección del siglo sin mujer en fórmula presidencial competitiva, y su compañero de fórmula está en la lista de enmiendas Pix que Dino ordenó investigar a la ${G('PF', 'pf')}.`,

  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `[lectura del 8/Ago, 17:32 UTC] En 26,95% (vol USD 8,08M acumulado). SE DETUVO después de seis días de alza, en el mismo valor del 7/Ago, y no devolvió terreno. No es extremo: 29 de los 88 días de la serie tuvieron valor igual o mayor, con techo de 43,30% el 12/May y piso de 22,00% el 3/Jul. EN EL CONTRATO DE SEGUNDO LUGAR CAYÓ POR SEGUNDO DÍA, de 87,50% el 6/Ago a 83,00% el 7/Ago y 81,50% hoy.`,

  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `[lectura del 8/Ago, 17:32 UTC] En 7,65% (vol USD 9,23M acumulado). Subió 0,40pp, segundo día consecutivo de alza, y con las encuestas estancadas entre 4% y 4,7% el vano hacia la intención declarada volvió a crecer, yendo de 2,95pp a 3,65pp, siempre del lado del precio. En el contrato de segundo lugar de la ${PV} está en 8,30% contra 8,20% de Lula, diferencia de 0,10pp, y estar por encima del presidente allí es el patrón de la serie, en 75 de los 89 días. En la serie de 88 días su máximo es 17,90% y su mínimo 5,50%.`,

  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `[lectura del 8/Ago, 17:32 UTC] En 1,35% (vol USD 5,59M acumulado). CAYÓ por segundo día consecutivo en los dos libros: 0,20pp en el presidencial y 2,50pp en el de tercer lugar de la ${PV}, de 33,50% a 31,00%. En dos días son 4,50pp perdidos en ese contrato, y esta vez Renan Santos quedó en 58,50%, así que no fue transferencia entre los dos.`,

  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `[lectura del 8/Ago, 17:32 UTC] En 0,05% (vol USD 13,87M acumulado). Sin variación contra el 7/Ago. El nivel es lo bastante bajo para que las variaciones en esta banda tengan valor informativo casi nulo.`,

  'polymarketComparison.candidates[5].tendenciaPesquisa':
    `SIN ENCUESTA NACIONAL NUEVA. Siguen vigentes los 2% de ${G('Genial/Quaest', 'quaest')}, lo mismo que en su propia ronda del 15/Jul, y los 2,6% de Meio/Ideia, contra 2,5% en su propia ronda del 8/Jul. En los balotajes es el rival al que Lula gana con más holgura en Quaest, por 46% x 34%, y pierde por 48,5% x 37% en Ideia. Registró su candidatura en el ${G('TSE', 'tse')} el 6/Ago, declarando R$ 178,7 millones de patrimonio, y sigue siendo el único del pelotón con candidatura presentada, en un plazo que va hasta el 15/Ago.`,

  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `[lectura del 8/Ago, 17:32 UTC] En 0,55% (vol USD 5,01M acumulado). Subió 0,10pp y volvió a pasar el corte de 0,5% que el panel usa para separar precio de ruido. En el contrato de tercer lugar de la ${PV} cayó de 3,70% a 3,40%. La salvedad de serie sigue vigente: su máximo fue 10,10%, el 26/Abr.`,

  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `[lectura del 8/Ago, 17:32 UTC] En 0,05% (vol USD 6,78M acumulado). Cayó 0,10pp y llegó al piso de la banda que el mercado descuenta. En ese nivel, una variación tiene valor informativo casi nulo.`,
})
