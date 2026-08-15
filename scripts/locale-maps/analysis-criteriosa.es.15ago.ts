/**
 * Mapa ES de 15/Ago para analysis-criteriosa.json.
 * Convenções: vírgula decimal e ponto de milhar, como no pt-BR. Datas "15 de ago".
 */
import { construir } from '../build-locale-json'

const NOVO = 'lectura confirmada del 15 de ago, 13:33 BRT (16:33 UTC)'
const VELHO = 'lectura confirmada del 14 de ago, 14:46 BRT'

construir('analysis-criteriosa', 'es', {
  subtitle:
    `ACTUALIZACIÓN 15 de ago, a 50 días de la primera vuelta. PRECIO: hay lectura confirmada nueva para el líder y para el segundo, ${NOVO}. Para Renan Santos, para el pelotón y para los contratos de segundo y tercer lugar, el del Senado y el de impeachment en el STF no hay lectura nueva el 15 de ago, y siguen valiendo los valores del 14 de ago, 14:46 BRT. ENCUESTAS: la Quaest se divulgó el 14 de ago a las 21:00, después de la captura de ayer, con 38% x 31% en la primera vuelta y 43% x 40% en el balotaje (n=2.004, BR-06773/2026). REGISTRO: el plazo de registro de candidaturas termina hoy, 15 de ago.`,

  'candidates[0].header':
    `PRECIO CON LECTURA NUEVA EL 15 DE AGO: 64,50% (vol USD 8,29M acumulado). El precio pasó de 63,50% el 14 de ago a 64,50% ahora, un alza de 1,00pp, rompiendo un nivel en el que estaba desde hacía siete días. ENCUESTAS: la Quaest del 14 de ago le da 38% en la primera vuelta y 43% en el balotaje, el piso de la ventana en el primer caso.`,
  'candidates[0].fortes[0]': `Rompió hacia arriba después de siete días detenido en 63,50%, con alza de 1,00pp, y volvió al nivel visto por última vez el 8 de ago.`,
  'candidates[0].fortes[1]': `Sigue al frente en las nueve nacionales desde el 5 de ago, en ambas vueltas, sin excepción.`,
  'candidates[0].fortes[2]': `La Quaest del 14 de ago muestra la aprobación del gobierno en empate técnico, 46% contra 48%, su mejor saldo desde el 5 de ago y bastante por encima del 43% contra 50% de la PoderData del 13 de ago.`,
  'candidates[0].fortes[3]': `Su rechazo es MENOR que el de su adversario en la Quaest, 52% contra 54%, y es la primera nacional de la ventana en separar a los dos en ese indicador.`,
  'candidates[0].fortes[4]': `El volumen acumulado de su contrato subió a USD 8,29M, y la distancia hacia el segundo se AMPLIÓ en el precio aun cuando las encuestas la estrecharon.`,
  'candidates[0].fracos[0]': `El 38% de la Quaest es el PISO de las nueve nacionales desde el 5 de ago, cuyo rango va de 38% a 44%.`,
  'candidates[0].fracos[1]': `Contra la propia Quaest del 5 de ago cedió 1 punto en la primera vuelta y 1 punto en el balotaje, y las dos distancias se estrecharon 2pp.`,
  'candidates[0].fracos[2]': `En el balotaje de la Quaest la diferencia es de 3pp, con margen de 2pp, es decir, cerca del límite del empate técnico.`,
  'candidates[0].fracos[3]': `Salvedad de serie: entre los 174 puntos registrados desde el 18 de may, 17 tuvieron un valor igual o superior a 64,50%, con un máximo de 66,50% el 1 de ago.`,
  'candidates[0].fracos[4]': `La desaprobación del gobierno sigue por encima de la aprobación en todas las casas de la ventana, con un saldo entre 2pp y 7pp negativos.`,
  'candidates[0].analise':
    `EL PRECIO ROMPIÓ Y LAS ENCUESTAS ESTRECHARON, Y LOS DOS ANDUVIERON EN SENTIDOS OPUESTOS. En el mercado pasó de 63,50%, donde estaba desde hacía siete días, a 64,50% (vol USD 8,29M acumulado), un alza de 1,00pp, y volvió al nivel visto por última vez el 8 de ago. En las encuestas ocurrió lo contrario: la Quaest divulgada el 14 de ago a las 21:00 muestra las dos distancias ESTRECHÁNDOSE contra la propia casa, de 9pp a 7pp en la primera vuelta y de 5pp a 3pp en el balotaje, y el movimiento es simétrico, con él cediendo 1 punto y el adversario ganando 1 punto en cada vuelta. Su 38% es el piso de las nueve nacionales desde el 5 de ago. ⚠️ El panel registra los dos movimientos y no los concilia: son instrumentos distintos midiendo preguntas distintas, y la divergencia es el dato, no el problema. Salvedad de serie: entre los 174 puntos registrados desde el 18 de may, 17 tuvieron un valor igual o superior al de hoy, y el máximo sigue en 66,50%, del 1 de ago. En el indicador de rechazo la Quaest trae la primera separación de la ventana: 52% para él contra 54% del adversario, cuando la PoderData del 13 de ago los empataba en 48%.`,

  'candidates[1].header':
    `PRECIO CON LECTURA NUEVA EL 15 DE AGO: 28,15% (vol USD 8,23M acumulado). El precio pasó de 27,85% el 14 de ago a 28,15% ahora, un alza de 0,30pp. ENCUESTAS: la Quaest del 14 de ago le da 31% en la primera vuelta y 40% en el balotaje, estrechando las dos distancias contra la propia casa.`,
  'candidates[1].fortes[0]': `Subió por segundo día seguido, con 0,30pp el 15 de ago después de 0,20pp el 14 de ago.`,
  'candidates[1].fortes[1]': `La Quaest del 14 de ago es la primera nacional que lo muestra estrechando las DOS vueltas contra la propia casa, de 9pp a 7pp y de 5pp a 3pp.`,
  'candidates[1].fortes[2]': `En el balotaje de la Quaest está a 3pp del líder, con margen de 2pp, y la Gerp del 11 de ago sigue siendo la única nacional de la ventana que lo pone al frente.`,
  'candidates[1].fortes[3]': `En las nueve nacionales desde el 5 de ago fue de 30% a 38% en la primera vuelta, y la Quaest lo coloca en 31%, por encima del piso de la propia casa.`,
  'candidates[1].fortes[4]': `Su candidatura presidencial fue registrada el 14 de ago, horas después de que Nunes Marques restableciera su afiliación al PL, lo que cierra el episodio registral antes del plazo del 15 de ago.`,
  'candidates[1].fracos[0]': `Aun subiendo, su distancia hacia el líder se AMPLIÓ en el precio, de 35,65pp a 36,35pp, porque el líder subió más que él.`,
  'candidates[1].fracos[1]': `La Quaest le da el MAYOR rechazo del cuadro, 54%, por encima del 52% del líder, y es la primera nacional de la ventana en separar a los dos.`,
  'candidates[1].fracos[2]': `Salvedad de serie: entre los 172 puntos registrados desde el 18 de may, 23 tuvieron un valor igual o superior a 28,15%, con un máximo de 33,20% el 2 de jun y un piso de 22,00% el 3 de jul.`,
  'candidates[1].fracos[3]': `La amplitud entre casas sobre él sigue por encima de 8pp en la ventana, de 30% a 38% en la primera vuelta.`,
  'candidates[1].fracos[4]': `En la primera vuelta de la Quaest tiene 31%, contra el 41% que la PoderData del 13 de ago da al líder en el mismo indicador, y la distancia entre casas sobre su propia posición es grande.`,
  'candidates[1].analise':
    `SUBIÓ EN LAS ENCUESTAS Y SUBIÓ EN EL PRECIO, Y AUN ASÍ QUEDÓ MÁS LEJOS. El precio pasó de 27,85% a 28,15% (vol USD 8,23M acumulado), un alza de 0,30pp y segundo día seguido de subida. En las encuestas, la Quaest del 14 de ago es la primera nacional que lo muestra estrechando las dos vueltas contra la propia casa: de 9pp a 7pp en la primera vuelta y de 5pp a 3pp en el balotaje, con un movimiento simétrico de 1 punto de cada lado. ⚠️ Y aquí está el cruce del día: pese a las dos subidas, su distancia hacia el líder en el precio se AMPLIÓ, de 35,65pp a 36,35pp, porque el líder subió 1,00pp contra sus 0,30pp. Las encuestas los acercaron y el precio los alejó, en el mismo par de días. Salvedad de serie: entre los 172 puntos registrados desde el 18 de may, 23 tuvieron un valor igual o superior al de hoy, y el máximo sigue en 33,20%, del 2 de jun. En el registro el episodio se cerró: la candidatura fue registrada el 14 de ago, horas después de que Nunes Marques restableciera la afiliación al PL, y el plazo de registro termina el 15 de ago. ⛔ La Quaest le da el mayor rechazo del cuadro, 54%, y el panel lo registra junto a las subidas, sin elegir cuál de los dos cuenta más.`,

  'candidates[2].header':
    `NO HAY LECTURA CONFIRMADA NUEVA PARA ÉL EL 15 DE AGO, y el valor exhibido es el de la última lectura confirmada, del 14 de ago, 14:46 BRT, en 7,15% (vol USD 9,59M acumulado). ENCUESTAS: la Quaest del 14 de ago le da 4% en la primera vuelta, el mismo valor que la casa le dio el 5 de ago.`,
  'candidates[2].fortes[0]': `Mantiene el mayor volumen acumulado del libro presidencial entre los nombres por encima de 1%, con USD 9,59M en la última lectura confirmada.`,
  'candidates[2].fortes[1]': `La Quaest del 14 de ago lo mantiene en 4% en la primera vuelta, exactamente el mismo valor del 5 de ago, sin pérdida contra la propia casa.`,
  'candidates[2].fortes[2]': `Su precio sigue ENTRE los dos métodos de las encuestas, por encima del 4% del teléfono y del presencial y por debajo del 10% de Palver por internet.`,
  'candidates[2].fortes[4]': `Gazeta do Povo publicó su plan de gobierno esta semana, y su partido no fue señalado como autor en el episodio registral del TSE.`,
  'candidates[2].fracos[0]': `No hay lectura confirmada nueva para él el 15 de ago, así que el panel no publica movimiento.`,
  'candidates[2].fracos[1]': `Empató consigo mismo en la Quaest, con 4% el 5 de ago y 4% el 14 de ago, sin avance en nueve días.`,
  'candidates[2].fracos[2]': `En la PoderData del 13 de ago es el único del pelotón al que el líder VENCE en el balotaje, mientras los otros tres empatan.`,
  'candidates[2].fracos[3]': `En las nacionales por teléfono y presenciales queda entre 4% y 5%, por debajo de lo que el precio le atribuye.`,
  'candidates[2].fracos[4]': `El efecto de método sigue siendo la lectura sobre él: el mismo nombre va de 4% a 10% según el ambiente de la entrevista.`,
  'candidates[2].analise':
    `NO HAY LECTURA CONFIRMADA NUEVA PARA ÉL EL 15 DE AGO, y el valor exhibido es el del 14 de ago, 14:46 BRT, en 7,15% (vol USD 9,59M acumulado). En las encuestas, la Quaest del 14 de ago lo mantiene en 4% en la primera vuelta, exactamente el mismo valor que la casa le dio el 5 de ago, lo que significa nueve días sin avance contra la propia regla. Sigue con el mayor volumen acumulado del libro presidencial entre los nombres por encima de 1%, y el precio continúa posicionado entre los dos métodos de las encuestas, por encima del 4% del teléfono y del presencial y por debajo del 10% de Palver por internet. El efecto de método permanece como la lectura central sobre él, y la salvedad fue declarada por la propia Palver. En el escenario de balotaje de la PoderData del 13 de ago él es el único de los cuatro probados al que el líder vence, mientras Caiado, Zema y el segundo empatan.`,

  'candidates[3].header':
    `NO HAY LECTURA CONFIRMADA NUEVA EL 15 DE AGO para ningún nombre del pelotón, y los valores exhibidos son los del 14 de ago, 14:46 BRT. ENCUESTAS: la Quaest del 14 de ago da 4% a CAIADO, 2% a ZEMA y trae un dato nuevo sobre el primero, con rechazo de 35% y alto desconocimiento.`,
  'candidates[3].subtitle':
    `15 de ago, a 50 días de la primera vuelta: sin lectura de precio nueva para el pelotón, y la Quaest agrega la pieza que faltaba sobre Caiado, que es el rechazo de 35% en un cuadro donde los dos primeros pasan de 50%.`,
  'candidates[3].caiado.label':
    `CAIADO (PSD), Poly presidencial 1,05% (vol USD 5,70M acumulado, ${VELHO}), sin lectura nueva el 15 de ago | encuestas vigentes: Quaest 4%, Gerp 4%, Meio/Ideia 5,7%, BTG/Nexus 5% | RECHAZO de 35% en la Quaest del 14 de ago`,
  'candidates[3].caiado.fortes':
    `La Quaest del 14 de ago le da 4% en la primera vuelta, lo mismo que la Gerp y que la propia Quaest del 5 de ago, y trae el dato que faltaba sobre él: RECHAZO de 35%, muy por debajo del 54% y del 52% de los dos primeros, con desconocimiento alto. Sigue empatando con el líder en el balotaje de la PoderData del 13 de ago, según CNN Brasil y Bnews, su segundo empate en cuatro días.`,
  'candidates[3].caiado.fracos':
    `No hay lectura de precio nueva para él el 15 de ago. Rechazo bajo con desconocimiento alto no es lo mismo que aceptación: significa que la mayor parte del electorado aún no formó opinión, y una opinión no formada puede ir hacia cualquier lado. Sigue en 4% a 5,7% en la primera vuelta contra poco más de 1% de precio de victoria.`,
  'candidates[3].zema.label':
    `ZEMA (Novo), Poly presidencial 0,35% (vol USD 5,07M acumulado, ${VELHO}), sin lectura nueva el 15 de ago y por debajo del corte de 0,5% | encuestas vigentes: Quaest 2%, Gerp 2%, Meio/Ideia 2,6%, BTG/Nexus 3%`,
  'candidates[3].zema.fortes':
    `La Quaest del 14 de ago lo mantiene en 2% en la primera vuelta, el mismo valor del 5 de ago. Sigue siendo el único del pelotón con registro de candidatura ya presentado ante el TSE, hecho el 6 de ago con R$ 178,7 millones declarados, y por eso el plazo que termina el 15 de ago no lo presiona.`,
  'candidates[3].zema.fracos':
    `No hay lectura nueva para él el 15 de ago, y el precio sigue por debajo del corte de 0,5% que el panel usa para separar precio de ruido. En las encuestas va de 2% a 3% en la primera vuelta, la franja más estrecha del pelotón, y empató consigo mismo en la Quaest entre el 5 y el 14 de ago.`,
  'candidates[3].haddad.label':
    `HADDAD (PT), Poly presidencial 0,15% (vol USD 7,06M acumulado, ${VELHO}), sin lectura nueva el 15 de ago y por debajo del corte de 0,5% | NO probado por las nacionales vigentes, porque compite por la gobernación de São Paulo`,
  'candidates[3].haddad.fracos':
    `La Quaest del 14 de ago no lo prueba en escenario presidencial, y ninguna nacional de la ventana lo incluye. La salvedad de fondo permanece y debe decirse con claridad: él NO es candidato a la Presidencia, compite por la gobernación de São Paulo, y cualquier escenario que lo incluya es hipótesis de encuesta, no candidatura en curso.`,
  'candidates[3].fortes[0]': `La Quaest del 14 de ago trae la pieza que faltaba sobre Caiado: rechazo de 35%, contra 54% y 52% de los dos primeros.`,
  'candidates[3].fortes[1]': `Caiado sigue en 4% a 5,7% en la primera vuelta según la casa, por delante de los demás nombres del pelotón.`,
  'candidates[3].fortes[2]': `Zema es el único del pelotón con registro de candidatura ya presentado ante el TSE, hecho el 6 de ago, y por eso está fuera del apretón del plazo que termina el 15 de ago.`,
  'candidates[3].fortes[3]': `Ni Caiado ni Zema perdieron terreno contra la propia Quaest entre el 5 y el 14 de ago; los dos repitieron sus valores anteriores.`,
  'candidates[3].fracos[0]': `No hay lectura de precio confirmada nueva para ningún nombre del pelotón el 15 de ago.`,
  'candidates[3].fracos[1]': `La distancia entre encuestas y precio sigue siendo la mayor del panel: de 4% a 5,7% de intención declarada para Caiado contra poco más de 1% de precio de victoria.`,
  'candidates[3].fracos[2]': `Rechazo bajo con desconocimiento alto no es aceptación, y la Quaest declara ese desconocimiento para Caiado.`,
  'candidates[3].fracos[3]': `Ningún nombre del pelotón pasa de 5,7% en la primera vuelta en ninguna nacional de la ventana, y ninguno avanzó contra la propia casa.`,
  'candidates[3].fracos[4]': `Haddad no es candidato a la Presidencia y compite por la gobernación de São Paulo, así que su contrato mide una hipótesis, no una candidatura.`,
  'candidates[3].analise':
    `⭐ LA QUAEST DEL 14 DE AGO TRAJO LA PIEZA QUE FALTABA SOBRE EL PELOTÓN, Y NO ES INTENCIÓN DE VOTO. ES RECHAZO: Caiado aparece con 35%, contra 54% del segundo y 52% del líder, y la propia casa declara que el desconocimiento sobre él es alto. ⚠️ Las dos cosas van juntas y no se separan: quien no es conocido no es rechazado, y una opinión no formada puede ir hacia cualquier lado. El panel registra el número y la salvedad en el mismo aliento, porque publicar solo el rechazo bajo sería sugerir un techo que el dato no sostiene. En intención de voto nada cambió: Caiado repitió el 4% y Zema el 2% que la propia Quaest les dio el 5 de ago, es decir, nueve días sin movimiento contra la misma regla. No hay lectura de precio confirmada nueva para ninguno de ellos el 15 de ago, y los valores exhibidos son los del 14 de ago. La distancia entre encuestas y precio sigue siendo la mayor del panel.`,

  'quadroComparativo[0].p': `ENCUESTA NACIONAL NUEVA: Quaest del 14 de ago (n=2.004, campo del 10 al 13 de ago, BR-06773/2026) con 38% en la primera vuelta y 43% en el balotaje. Contra la propia casa del 5 de ago cede 1 punto en ambas. Rechazo en 52%, por debajo del 54% del adversario. Aprobación del gobierno en 46% contra 48% de desaprobación.`,
  'quadroComparativo[0].m': `64,50% (vol USD 8,29M acumulado), ${NOVO}`,
  'quadroComparativo[0].t': `ROMPIÓ HACIA ARRIBA después de siete días en 63,50%, con alza de 1,00pp, y volvió al nivel del 8 de ago. SALVEDAD DE SERIE: entre los 174 puntos registrados desde el 18 de may, 17 tuvieron un valor igual o superior a 64,50%, con un máximo de 66,50% el 1 de ago y un piso de 39,50% el 26 de may. La distancia hacia el segundo se AMPLIÓ, de 35,65pp a 36,35pp.`,
  'quadroComparativo[0].s': `50 días de la elección. El 38% de la Quaest es el piso de las nueve nacionales desde el 5 de ago. 📅 Nexus publica el 17 de ago y Real Time Big Data el 19 de ago.`,
  'quadroComparativo[1].p': `ENCUESTA NACIONAL NUEVA: la Quaest del 14 de ago le da 31% en la primera vuelta y 40% en el balotaje, ganando 1 punto en ambas contra la propia casa del 5 de ago. RECHAZO de 54%, el mayor del cuadro y por encima del 52% del líder.`,
  'quadroComparativo[1].m': `28,15% (vol USD 8,23M acumulado), ${NOVO}`,
  'quadroComparativo[1].t': `SEGUNDO DÍA SEGUIDO DE SUBIDA, con 0,30pp el 15 de ago después de 0,20pp el 14 de ago. ⚠️ Aun subiendo quedó MÁS LEJOS del líder, porque el líder subió 1,00pp. SALVEDAD DE SERIE: entre los 172 puntos desde el 18 de may, 23 tuvieron un valor igual o superior a 28,15%, con un máximo de 33,20% el 2 de jun y un piso de 22,00% el 3 de jul.`,
  'quadroComparativo[1].s': `Su candidatura presidencial fue registrada el 14 de ago, horas después de que Nunes Marques restableciera su afiliación al PL, según Brasil de Fato. El plazo de registro termina hoy, 15 de ago.`,
  'quadroComparativo[2].p': `La Quaest del 14 de ago lo mantiene en 4% en la primera vuelta, el mismo valor que la casa le dio el 5 de ago. Siguen el 5% de la Gerp, el 4% de BTG/Nexus, el 4,7% de Meio/Ideia y el 10% de Palver por internet.`,
  'quadroComparativo[2].m': `7,15% (vol USD 9,59M acumulado), ${VELHO}`,
  'quadroComparativo[2].t': `NO HAY LECTURA CONFIRMADA NUEVA PARA ÉL EL 15 DE AGO. El valor exhibido es el de la última lectura confirmada, del 14 de ago, 14:46 BRT. Sigue con el mayor volumen acumulado del libro presidencial entre los nombres por encima de 1%, y el precio continúa ENTRE los dos métodos de las encuestas.`,
  'quadroComparativo[2].s': `Gazeta do Povo publicó su plan de gobierno esta semana. Empató consigo mismo en la Quaest entre el 5 y el 14 de ago, con 4% en ambas.`,
  'quadroComparativo[3].p': `La Quaest del 14 de ago le da 4% en la primera vuelta, lo mismo que el 5 de ago, y trae el dato nuevo: RECHAZO de 35%, con alto desconocimiento declarado por la casa. Sigue empatando con el líder en el balotaje de la PoderData del 13 de ago.`,
  'quadroComparativo[3].m': `1,05% (vol USD 5,70M acumulado), ${VELHO}`,
  'quadroComparativo[3].t': `NO HAY LECTURA CONFIRMADA NUEVA PARA ÉL EL 15 DE AGO. El valor exhibido es el del 14 de ago, 14:46 BRT. La distancia entre encuestas y precio sigue siendo la mayor del panel: de 4% a 5,7% de intención declarada contra poco más de 1% de precio de victoria.`,
  'quadroComparativo[3].s': `⚠️ Un rechazo de 35% con desconocimiento alto no es aceptación: significa que la mayor parte del electorado aún no formó opinión sobre él, y una opinión no formada puede ir hacia cualquier lado.`,
  'quadroComparativo[4].p': `La Quaest del 14 de ago lo mantiene en 2% en la primera vuelta, el mismo valor del 5 de ago. Siguen el 2% de la Gerp, el 3% de BTG/Nexus y el 2,6% de Meio/Ideia. Empata con el líder en el balotaje de la PoderData del 13 de ago.`,
  'quadroComparativo[4].m': `0,35% (vol USD 5,07M acumulado), ${VELHO}`,
  'quadroComparativo[4].t': `NO HAY LECTURA NUEVA PARA ÉL EL 15 DE AGO, y el precio sigue por debajo del corte de 0,5% que el panel usa para separar precio de ruido. El valor exhibido es el del 14 de ago, 14:46 BRT.`,
  'quadroComparativo[4].s': `Sigue siendo el único del pelotón con registro de candidatura ya presentado ante el TSE, hecho el 6 de ago con R$ 178,7 millones declarados, y por eso el plazo que termina hoy no lo presiona.`,
  'quadroComparativo[5].m': `3,90% (vol USD 83 mil), ${VELHO}`,
  'quadroComparativo[5].t': `NO HAY LECTURA NUEVA PARA ESTE CONTRATO EL 15 DE AGO. El valor exhibido es el del 14 de ago, 14:46 BRT. Sigue siendo el contrato más delgado entre los acompañados, y cualquier movimiento en él exige esa salvedad.`,
  'quadroComparativo[5].s': `El STF suspendió la condena de Romero Jucá, que queda habilitado para competir, según O Globo. El ministro Mendonça se comprometió a conducir los casos Master e INSS con imparcialidad, según G1, y la PF abrió una investigación sobre la sospecha de interferencia de un senador en una pesquisa en Maranhão, según Folha de S.Paulo.`,

  cruzamento:
    `EL DÍA TIENE UN CRUCE LIMPIO, Y APUNTA HACIA LADOS OPUESTOS. En las encuestas, la Quaest divulgada el 14 de ago a las 21:00 muestra las dos distancias ESTRECHÁNDOSE contra la propia casa: en la primera vuelta de 9pp a 7pp, con el líder cediendo 1 punto y el segundo ganando 1 punto, y en el balotaje de 5pp a 3pp, por el mismo movimiento simétrico. En el precio ocurrió lo contrario: la distancia se AMPLIÓ, de 35,65pp a 36,35pp, porque el líder subió 1,00pp y el segundo subió 0,30pp. ⭐ Los dos instrumentos se movieron en el mismo par de días y en sentidos opuestos, y esa divergencia es el dato. El panel no la concilia ni elige cuál de los dos vale, porque miden preguntas distintas: intención de voto declarada y probabilidad de victoria. ⛔ Sin superlativo: la distancia de 36,35pp es ordinaria en la serie, con 32 de los 88 días registrados marcando un valor igual o mayor, y el pico sigue en 41,80pp, del 1 de ago. El líder en 64,50% tampoco es un extremo, con 17 de los 174 puntos en un nivel igual o superior y un máximo de 66,50%, del 1 de ago. Lo que es un hecho es la ruptura: estaba en 63,50% desde hacía siete días y volvió al nivel visto por última vez el 8 de ago. La Quaest también separó a los dos en el rechazo por primera vez en la ventana, con 54% para el segundo y 52% para el líder, cuando la PoderData del 13 de ago los empataba en 48%, y trajo la aprobación del gobierno a 46% contra 48%, el mejor saldo desde el 5 de ago. ⚠️ Dos nacionales en dos días discrepando en el signo del rechazo y en 5 puntos en el saldo de aprobación es efecto de casa, no un cambio de opinión pública, y el panel prefiere mostrar la distancia entre las casas a elegir una de ellas. En el registro electoral el plazo de registro de candidaturas termina hoy, 15 de ago, y a partir de mañana la ausencia de registro deja de ser pendencia y pasa a ser hecho.`,
})
