/**
 * Mapa ES de 15/Ago para analysis-data.json.
 * Convenções: vírgula decimal e ponto de milhar, como no pt-BR. Datas "15 de ago".
 */
import { construir } from '../build-locale-json'

const NOVO = 'lectura confirmada del 15 de ago, 13:33 BRT (16:33 UTC)'

construir('analysis-data', 'es', {
  'cards.sentimento.text1':
    `A 50 días de la primera vuelta, el día tiene un cruce limpio y apunta hacia lados opuestos. La Quaest divulgada el 14 de ago a las 21:00, después de la captura de ayer, muestra las dos distancias ESTRECHÁNDOSE contra la propia casa: en la primera vuelta de 9pp a 7pp, con Lula en 38% y Flávio Bolsonaro en 31%, y en el balotaje de 5pp a 3pp, con 43% contra 40%. El movimiento es simétrico, con uno cediendo 1 punto y el otro ganando 1 punto en cada vuelta. Campo del 10 al 13 de ago, n=2.004, registro BR-06773/2026.`,

  'cards.sentimento.text2':
    `En el precio ocurrió lo contrario. La distancia entre los dos se AMPLIÓ, de 35,65pp a 36,35pp, porque Lula subió 1,00pp y Flávio Bolsonaro subió 0,30pp. ⭐ Los dos instrumentos se movieron en el mismo par de días y en sentidos opuestos, y esa divergencia es el hallazgo del día. El panel no la concilia ni elige cuál de los dos vale, porque miden preguntas distintas: intención de voto declarada y probabilidad de victoria.`,

  'cards.sentimento.text3':
    `La Quaest trajo además dos piezas que la PoderData del 13 de ago no traía. La primera es el RECHAZO separado por primera vez en la ventana: 54% para Flávio Bolsonaro y 52% para Lula, cuando la PoderData los empataba en 48%. La segunda es el rechazo de Caiado, en 35%, con alto desconocimiento declarado por la propia casa. ⚠️ Dos nacionales en dos días discrepando en el signo del rechazo es efecto de casa, no un cambio de opinión pública, y el panel prefiere mostrar la distancia entre las casas a elegir una de ellas.`,

  'cards.sentimento.direita':
    `Flávio Bolsonaro subió en los dos instrumentos y aun así quedó más lejos. En el precio está en 28,15% (vol USD 8,23M acumulado), un alza de 0,30pp y segundo día seguido de subida. En las encuestas, la Quaest es la primera nacional que lo muestra estrechando las dos vueltas contra la propia casa. ⚠️ Pero su distancia hacia el líder en el precio se AMPLIÓ, porque el líder subió más. En el registro el episodio se cerró: su candidatura presidencial fue registrada el 14 de ago, horas después de que Nunes Marques restableciera su afiliación al PL, y el plazo de registro termina hoy, 15 de ago. La Quaest le da el mayor rechazo del cuadro, 54%.`,

  'cards.sentimento.esquerda':
    `Lula rompió hacia arriba después de siete días detenido. El precio pasó de 63,50%, donde estaba desde el 9 de ago, a 64,50% (vol USD 8,29M acumulado), un alza de 1,00pp, volviendo al nivel visto por última vez el 8 de ago. ⛔ Sin superlativo: entre los 174 puntos registrados desde el 18 de may, 17 tuvieron un valor igual o superior a 64,50%, y el máximo sigue en 66,50%, del 1 de ago. En las encuestas, la Quaest le da 38% en la primera vuelta, el PISO de las nueve nacionales desde el 5 de ago, y aprobación del gobierno en 46% contra 48% de desaprobación, su mejor saldo desde el 5 de ago.`,

  'cards.sentimento.terceiraVia':
    `No hay lectura de precio confirmada nueva para Renan Santos ni para el pelotón el 15 de ago, y los valores exhibidos son los del 14 de ago, 14:46 BRT. En las encuestas, la Quaest del 14 de ago mantuvo a los tres detenidos contra la propia casa del 5 de ago: Renan Santos en 4%, Caiado en 4% y Zema en 2%, sin avance en nueve días. ⭐ El dato nuevo sobre el pelotón no es intención de voto, es rechazo: Caiado aparece con 35%, contra 54% y 52% de los dos primeros, con alto desconocimiento declarado por la casa. Rechazo bajo con desconocimiento alto no es aceptación, y el panel dice las dos cosas juntas.`,

  'cards.sentimento.polymarket':
    `LECTURA CONFIRMADA NUEVA EL 15 DE AGO para el líder y para el segundo, ${NOVO}: Lula 64,50% (vol USD 8,29M acumulado) y Flávio Bolsonaro 28,15% (vol USD 8,23M). La distancia entre los dos es de 36,35pp, contra 35,65pp el 14 de ago, y se AMPLIÓ en el mismo par de días en que las encuestas la estrecharon. Para Renan Santos, para el pelotón y para los contratos de segundo y tercer lugar, el del Senado y el de impeachment en el STF no hay lectura nueva el 15 de ago, y siguen valiendo los valores del 14 de ago, 14:46 BRT. ⛔ Sin superlativo: la distancia de 36,35pp es ordinaria en la serie, con 32 de los 88 días registrados en un nivel igual o superior, y el pico sigue en 41,80pp, del 1 de ago.`,

  'cards.stf.analise':
    `NO HAY LECTURA NUEVA EL 15 DE AGO para el contrato de impeachment de un ministro del STF. El valor exhibido es el de la última lectura confirmada, del 14 de ago, 14:46 BRT, en 3,90% sobre un volumen acumulado de USD 83 mil. Sigue siendo el contrato más delgado entre los acompañados por este panel, con un volumen tres órdenes de magnitud por debajo del presidencial, y cualquier movimiento en él exige esa salvedad antes de cualquier lectura. ⭐ El hilo judicial del 15 de ago tiene efecto electoral directo: el STF suspendió la condena de Romero Jucá, que queda habilitado para competir, según O Globo. El ministro Mendonça se comprometió a conducir los casos Master e INSS con imparcialidad y defendió cambios en el STF, según G1 y Folha de S.Paulo, y la PF abrió una investigación sobre la sospecha de que un senador intentó interferir en una pesquisa en Maranhão, también según Folha. Sigue vigente la determinación del 12 de ago en la que Moraes, Dino, Gilmar Mendes y Zanin ordenaron a siete tribunales devolver los pagos suplementarios.`,
})
