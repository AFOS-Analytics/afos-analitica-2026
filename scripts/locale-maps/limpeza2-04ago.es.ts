/** Limpeza ES de 04/Ago, parte 2: analysis-data e polls-data. */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/es/glossary#${id})`
const NEXUS = G('BTG/Nexus', 'nexus-btg')
const STF = G('STF', 'stf')
const NOVO = G('Novo', 'novo')

construir('analysis-data', 'es', {
  'cards.sentimento.text3':
    `⚠️ EL MERCADO NO ENTRA EN ESTA RONDA. Los precios que muestra este panel son de la lectura del 03/Ago, a las 19:11 UTC, y están marcados como tal. AFOS solo publica un precio que dos lecturas independientes confirmen, y el 04/Ago la tercera vía siguió moviéndose.`,
  'cards.sentimento.terceiraVia':
    `EL ESPACIO GANÓ DEFINICIÓN PARTIDARIA HOY. ZEMA anunció a su compañero de fórmula, el senador Eduardo Girão, del partido ${NOVO}, y es el primero de los tres en cerrar fórmula, y encima la cierra dentro de su propio partido. CAIADO es el nombre cuyo precio más se mueve, y esta ronda no publica número nuevo para él. En la encuesta de ${NEXUS} de ayer, Caiado tiene 5% y Zema 3%, y Lula les gana a ambos en la 2ª vuelta, 46% x 42% y 46% x 40%.`,
  'cards.sentimento.polymarket':
    `⚠️ Precios del 03/Ago, de la lectura de las 19:11 UTC, no de hoy: Lula 65,50% (vol USD 7,92M), Flávio 25,45% (vol USD 7,86M), Renan Santos 7,45% (vol USD 8,86M), Caiado 1,15% (vol USD 5,30M), Zema 0,25% (vol USD 4,66M), Haddad 0,15% (vol USD 6,64M), destitución en el ${STF} 3,10% (vol USD 83 mil). Diferencia de Lula sobre Flávio +40,05pp. No hay lectura de mercado nueva el 04/Ago.`,
  'cards.inss.text1':
    `La agenda fiscal no tuvo un hecho que moviera precios este martes, y el mercado no entra en esta ronda: no hay lectura nueva el 04/Ago. El registro del día viene del lado político-partidario, donde el tablero se movió más que la encuesta.`,
  'cards.inss.text4':
    `⚠️ Los números de mercado de este panel son del 03/Ago y están marcados como tal. En aquella lectura, el Senado tenía al ${G('PL', 'pl')} en 75,00% (vol USD 259 mil) y el contrato de inflación anual concentraba 36,60% en la franja de 5,00% a 5,49%, con las franjas sumando 99,65%. El 04/Ago no hay lectura confirmada para comparar.`,
  'cards.inss.conclusao':
    `A 61 días de la elección, el día fue de definición partidaria y de aprobación inmóvil. Zema cerró fórmula, Flávio perdió dos partidos y sigue sin vice, y la aprobación del gobierno no se movió por tercera ronda seguida de la misma casa. El mercado quedó fuera porque no hubo lectura nueva, y la tercera vía, que es donde el tablero más se movió, es justamente donde el precio más se movió. La ronda de mañana, con Quaest e Ideia, es la que va a medir si algo de eso se volvió voto.`,
  'cards.bancoMaster.conclusao':
    `⚠️ El contrato de destitución en el ${STF} NO tiene precio nuevo hoy. En la lectura del 03/Ago estaba en 3,10% (vol USD 83 mil). Queda registrado que, el mismo día, se autorizó un tercer expediente contra el hijo del presidente y el segundo en la disputa defendió públicamente destituir ministros, sin que el panel pueda decir si el mercado descontó alguna de las dos cosas.`,
  'cards.stf.nexo':
    `El nexo de este martes es la distancia entre un tablero que se movió mucho y un mercado que no se pudo medir. En lo político, Zema cerró fórmula con Eduardo Girão y Flávio perdió a Republicanos y Podemos el mismo día. En lo judicial, Dino autorizó el tercer expediente contra Lulinha y Flávio defendió públicamente destituir a tres ministros, nombrándolos. En la encuesta, la aprobación del gobierno no se movió por tercera ronda seguida. Y el precio, que sería el cruce de todo eso, quedó fuera, porque no hubo lectura confirmada el 04/Ago.`,
  'cards.stf.analise':
    `⚠️ SIN PRECIO NUEVO PARA EL CONTRATO DE DESTITUCIÓN en esta ronda. En la lectura del 03/Ago estaba en 3,10% (vol USD 83 mil), y ese es el número que el panel muestra, marcado con su fecha. Vale el registro de método: en un día con la autorización de un expediente contra el hijo del presidente y con el segundo en la disputa nombrando a tres ministros que quiere destituir, sería tentador estimar una reacción. El panel no estima. Sin dos lecturas que coincidan no hay precio, y sin precio no hay cruce. La salvedad de siempre: con USD 83 mil acumulados, este es el contrato más fino que el panel publica.`,
})

construir('polls-data', 'es', {
  'polymarketComparison.note':
    `⚠️ LOS PRECIOS DE ESTA SECCIÓN SON DEL 03/Ago, DE LA LECTURA DE LAS 19:11 UTC, Y NO DE HOY. La ronda del 04/Ago no publica precio nuevo: AFOS solo publica un precio que dos lecturas independientes confirmen, y la tercera vía siguió moviéndose a lo largo del día. El lado de la ENCUESTA, ese sí, es de hoy. --- LO QUE DICEN LOS PRECIOS DEL 03/Ago: Lula en 65,50% (vol USD 7,92M) y Flávio en 25,45% (vol USD 7,86M), con diferencia de +40,05pp. Aquel día las dos mediciones se movieron hacia el mismo lado y por el mismo motivo, con el líder quieto y el rival subiendo, algo raro en este panel. Conviene repetir lo que aquello NO era: convergencia de nivel. El mercado paga probabilidad de victoria y la encuesta mide porción de voto, y las dos no se restan. --- LO QUE PASÓ EN EL TABLERO EL 04/Ago, y esto es registro y no explicación: fue el día en que Zema anunció a su compañero de fórmula, el senador Eduardo Girão, del partido ${NOVO}, y en que Flávio recibió DOS rechazos de alianza, de Republicanos y de Podemos, quedando sin vice a once días del plazo que él mismo declaró. La tercera vía es justamente donde el precio más se mueve. El panel no atribuye causa: registra que el reprecio está ocurriendo y que por eso no publica número. --- LA ENCUESTA, ESA SÍ ES DE HOY: ${NEXUS} del 03/Ago (BR-02874/2026) publicó aprobación del gobierno en 47% contra 48%, un número que no estaba en la divulgación de ayer y salió en la cobertura de hoy. La aprobación está quieta en 47% desde hace tres rondas de la misma casa.`,
  'polymarketComparison.sources':
    `Precios de ${G('Polymarket', 'polymarket')} vía el proxy de AFOS, de la lectura de las 19:11 UTC del 03/Ago. No hay lectura de mercado nueva el 04/Ago. Encuesta BTG/Nexus del 03/Ago, registro TSE BR-02874/2026, con los números de aprobación divulgados en la cobertura del 04/Ago. Barrido del TSE del 04/Ago: 537 registros, ninguno nuevo.`,
})
