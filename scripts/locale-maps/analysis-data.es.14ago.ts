/**
 * Mapa ES de 14/Ago para analysis-data.json.
 * Convenções: vírgula decimal e ponto de milhar, como no pt-BR. Datas "14 de ago".
 */
import { construir } from '../build-locale-json'

const NOVO = 'lectura confirmada del 14 de ago, 14:46 BRT (17:46 UTC)'
const VELHO = 'última lectura confirmada, del 12 de ago, 16:41 BRT'

construir('analysis-data', 'es', {
  'cards.sentimento.text1':
    `A 51 días de la primera vuelta, el día tuvo lectura de precio nueva y tuvo hecho institucional, y el mayor de los dos no vino ni de las encuestas ni del mercado. El TSE suspendió el procesamiento de nuevas afiliaciones partidarias en todo el país tras identificar el registro falso de Flávio Bolsonaro en el partido Missão y un intento de alterar la afiliación de Lula, según G1, O Globo, Gazeta do Povo, CartaCapital y Money Times. El plazo de registro de candidaturas termina el 15 de ago, es decir, la suspensión cae en la víspera del cierre.`,

  'cards.sentimento.text2':
    `En las encuestas nada cambió desde ayer. Quaest divulga hoy una nacional con 13 candidatos probados, y al momento de esta captura los resultados aún no estaban publicados, así que la nacional vigente sigue siendo la PoderData/Aya del 13 de ago (n=2.400, telefónica, campo del 9 al 12 de ago, BR-06868/2026), con 41% en la primera vuelta para el líder contra 35% del segundo, y 46% x 45% en el balotaje. Rechazo en 48% para ambos, exactamente empatado, lo que impide cualquier lectura fácil sobre quién tiene más techo.`,

  'cards.sentimento.text3':
    `El tercer hecho del día no tiene contrapartida en el precio y es de otro orden: la OEA anunció el 13 de ago que enviará una misión de observación electoral a Brasil, encabezada por un exministro chileno, según G1, CNN Brasil y Folha de S.Paulo. La observación internacional no mide intención de voto ni probabilidad, y por eso no entra en ninguno de los dos instrumentos que este panel cruza, pero es un hecho electoral relevante de la ventana.`,

  'cards.sentimento.direita':
    `El segundo tuvo el día más movido del panel, y por motivos opuestos. En el registro, su vínculo indebido con Missão fue cancelado y su afiliación al PL fue restablecida después de que Nunes Marques acogiera los pedidos presentados, según Folha de S.Paulo y G1, lo que removió el obstáculo formal al registro de su candidatura. En el precio, fue el ÚNICO nombre por encima de 1% que subió, con alza de 0,20pp hasta 27,85% (vol USD 8,20M acumulado). ⚠️ El orden de los hechos está registrado y la causa no: ambos caen en la misma ventana, y eso es coincidencia de calendario hasta que se mida lo contrario.`,

  'cards.sentimento.esquerda':
    `El líder sigue en 63,50% (vol USD 8,25M acumulado) por sexto día consecutivo en la serie registrada, que muestra el mismo valor en todos los días del 9 al 14 de ago. Seis días sin variación en un contrato de ese porte es información, y lo que dice es que el mercado no reaccionó a nada de lo que ocurrió en la semana. El intento de alterar su afiliación al PT fue identificado y bloqueado antes de producir efecto, según G1 y Gazeta do Povo, y su registro partidario no cambió.`,

  'cards.sentimento.terceiraVia':
    `Renan Santos tuvo la mayor caída del pelotón de arriba, con retroceso de 0,30pp hasta 7,15%, aunque mantiene el mayor volumen acumulado del libro presidencial entre los nombres por encima de 1%, con USD 9,59M. Caiado subió 0,10pp y llegó a 1,05% (vol USD 5,70M acumulado), siendo el único del pelotón con lectura nueva. Zema y Haddad siguen por debajo del corte de 0,5% que el panel usa para separar precio de ruido y por eso no reciben lectura nueva. En las encuestas, la PoderData del 13 de ago sigue poniendo a Caiado y a Zema empatados con el líder en el balotaje, según CNN Brasil y Bnews.`,

  'cards.sentimento.polymarket':
    `LECTURA NUEVA EL 14 DE AGO para el mercado presidencial, ${NOVO}: Lula 63,50% (vol USD 8,25M acumulado), Flávio Bolsonaro 27,85% (vol USD 8,20M), Renan Santos 7,15% (vol USD 9,59M) y Ronaldo Caiado 1,05% (vol USD 5,70M). La distancia entre los dos primeros es de 35,65pp, contra 35,85pp el 12 de ago, y todo el estrechamiento vino del segundo. Para los contratos de segundo y tercer lugar, para el Senado y para el impeachment en el STF no hay lectura nueva el 14 de ago, y los valores exhibidos son los de la ${VELHO}. ⛔ Sin superlativo: entre los puntos registrados desde el 16 de may, 51 tuvieron al segundo en un nivel igual o superior al de hoy, con un máximo de 33,20% el 2 de jun.`,

  'cards.stf.analise':
    `NO HAY LECTURA NUEVA EL 14 DE AGO para el contrato de impeachment de un ministro del STF. El valor exhibido es el de la ${VELHO}, en 3,90% sobre un volumen acumulado de USD 83 mil. Sigue siendo el contrato más delgado entre los acompañados por este panel, con un volumen tres órdenes de magnitud por debajo del presidencial, y cualquier movimiento en él exige esa salvedad antes de cualquier lectura. El hilo judicial de la semana sigue siendo el operativo de la PF contra la fuente de un periodista, con base en mensajes que sustentaron reportajes sobre Dino, y la reacción de entidades a la decisión de Moraes en el caso. Sigue vigente la determinación del 12 de ago en la que Moraes, Dino, Gilmar Mendes y Zanin ordenaron a siete tribunales devolver los pagos suplementarios. ⭐ El hecho judicial nuevo de hoy es de otra naturaleza y es electoral: Nunes Marques acogió los pedidos de Flávio Bolsonaro en el caso de la afiliación indebida a Missão, y enseguida el TSE suspendió el procesamiento de nuevas afiliaciones en todo el país.`,
})
