/**
 * Mapa ES de 17/Ago para analysis-criteriosa.json.
 * Convenções ES: vírgula decimal e ponto de milhar, como no pt-BR.
 */
import { construir } from '../build-locale-json'

const CAR = 'lectura confirmada del 17 de ago, 18:48 BRT (21:48 UTC)'

construir('analysis-criteriosa', 'es', {
  updatedAt: `17/08/2026, 18:48`,

  subtitle:
    `ACTUALIZACIÓN DEL 17 DE AGO, a 48 días de la primera vuelta y en el SEGUNDO DÍA DE LA CAMPAÑA OFICIAL. ENCUESTA NUEVA: la BTG/Nexus salió hoy (n=2.003, campo del 14 al 16 de ago, registro BR-03317/2026, margen de 2pp), la primera nacional desde la Quaest del 14 de ago. PRECIO: lectura confirmada nueva para todos los contratos, con la traba de captura aprobada en dos pasadas separadas. ⭐ EL CRUCE DEL DÍA: la encuesta no movió la distancia entre los dos primeros, que sigue en 5 puntos, y el precio cerró 4,00pp de esa misma distancia el mismo día.`,

  // ---------------- LULA ----------------
  'candidates[0].header':
    `PRECIO: 64,50% (vol USD 8,52M acumulado), ${CAR}. ENCUESTA: 41% en la primera vuelta y 47% en el balotaje en la BTG/Nexus de hoy.`,
  'candidates[0].fortes[0]':
    `La BTG/Nexus de hoy lo ubica en 41% en la primera vuelta, alza de 1 punto contra la ronda anterior de la misma casa, que lo tenía en 40%.`,
  'candidates[0].fortes[1]':
    `En el balotaje estimulado aparece con 47% contra 44%, resultado IDÉNTICO al de la ronda anterior de la propia casa, manteniendo los 3 puntos de ventaja.`,
  'candidates[0].fortes[2]':
    `La distancia hacia el segundo en la encuesta sigue en 5 puntos, la misma de la ronda anterior, o sea que el avance del rival no achicó el intervalo medido.`,
  'candidates[0].fortes[3]':
    `En el precio sigue muy adelante, con 64,50% contra 31,45%, y su contrato acumula USD 8,52M dentro de un book presidencial de USD 126,85M.`,
  'candidates[0].fortes[4]':
    `De los 90 días de la serie registrada desde el 19 de may, apenas 5 están por encima del cierre de hoy.`,
  'candidates[0].fracos[0]':
    `🔴 CAÍDA de 2,00pp en el precio en un día, de 66,50% a 64,50%, devolviendo exactamente lo que había subido la víspera.`,
  'candidates[0].fracos[1]':
    `La distancia hacia el segundo en el precio SE CERRÓ de 37,05pp a 33,05pp, o sea 4,00pp en cerca de 26 horas.`,
  'candidates[0].fracos[2]':
    `La evaluación del gobierno en la BTG/Nexus de hoy tiene 42% de malo o pésimo contra 34% de excelente o bueno, con 23% de regular.`,
  'candidates[0].fracos[3]':
    `⛔ Ningún superlativo de alza aplica: el máximo de la serie sigue siendo 66,50%, del 1 de ago, y el valor de hoy está por debajo.`,
  'candidates[0].fracos[4]':
    `La Policía Federal encontró un mensaje en el que su hijo y una lobista investigada por fraudes en el INSS tratan de negocios, y el segundo y su hermano usaron el caso el mismo día, según Poder360.`,
  'candidates[0].analise':
    `⭐ EL DÍA ES DE DIVERGENCIA ENTRE LOS DOS UNIVERSOS, y ese es el hallazgo. La encuesta nueva dijo que casi nada cambió: pasó de 40% a 41%, el rival de 35% a 36%, la distancia entre los dos quedó en los mismos 5 puntos y el escenario de balotaje repitió 47 a 44, número por número. Los dos movimientos de 1 punto caben enteros dentro del margen de 2pp declarado por la casa. El mismo día el precio hizo otra cosa: él cedió 2,00pp y el rival ganó 2,00pp, así que la distancia en el mercado se achicó 4,00pp. ⛔ El panel NO afirma que el precio se movió por la encuesta, y el motivo es aritmético: la encuesta no mostró achicamiento alguno, así que no explica un achicamiento de 4 puntos en el precio. Lo que sí se puede registrar es que los dos se movieron en direcciones distintas el mismo día, y que la prensa encuadró la ganancia de 1 punto del rival como avance y disputa más competitiva. 📌 La lectura de precio tampoco viene de un instante suelto: la traba de captura se corrió DOS veces, en ventanas separadas, y aprobó en las dos.`,

  // ---------------- FLÁVIO ----------------
  'candidates[1].header':
    `PRECIO: 31,45% (vol USD 8,46M acumulado), ${CAR}. ENCUESTA: 36% en la primera vuelta y 44% en el balotaje en la BTG/Nexus de hoy.`,
  'candidates[1].fortes[0]':
    `🔴 ALZA DE 2,00pp en el precio en un día, de 29,45% a 31,45%, y es el cuarto día seguido de alza.`,
  'candidates[1].fortes[1]':
    `La distancia hacia el líder en el precio SE CERRÓ 4,00pp en cerca de 26 horas, de 37,05pp a 33,05pp.`,
  'candidates[1].fortes[2]':
    `La BTG/Nexus de hoy lo lleva de 35% a 36% en la primera vuelta, y en el balotaje repite el 44% de la ronda anterior.`,
  'candidates[1].fortes[3]':
    `Domina el contrato de segundo lugar de la primera vuelta con 85,50%, muy por delante del siguiente nombre de ese book.`,
  'candidates[1].fortes[4]':
    `La evaluación negativa del gobierno rival está en 42% de malo o pésimo en la misma BTG/Nexus.`,
  'candidates[1].fracos[0]':
    `⛔ No es récord: de los 90 días de la serie desde el 19 de may, 2 están por encima del cierre de hoy, y el máximo sigue siendo 33,20%, del 2 de jun.`,
  'candidates[1].fracos[1]':
    `En la encuesta la distancia hacia el líder NO cambió: era 5 puntos y sigue siendo 5 puntos, porque los dos subieron 1 punto.`,
  'candidates[1].fracos[2]':
    `La ganancia de 1 punto está dentro del margen de 2pp de la propia casa, así que no se distingue de la estabilidad.`,
  'candidates[1].fracos[3]':
    `En el balotaje sigue atrás por 3 puntos, 44% contra 47%, exactamente como en la ronda anterior.`,
  'candidates[1].fracos[4]':
    `Su campaña pasó el día en disputa con un rival del propio campo: acusó a Caiado de ayudar al líder, después de que Kassab dijera que Caiado tiene cero chance, y Kassab respondió que su campaña está preocupada con Caiado, según Estadão.`,
  'candidates[1].analise':
    `Su precio hizo el mayor movimiento del día entre los contratos grandes, con 2,00pp de alza, y es el cuarto día seguido subiendo. ⚠️ La encuesta nueva NO sostiene ese movimiento como achicamiento: él subió 1 punto, el líder subió 1 punto, y la distancia medida quedó en los mismos 5. En el balotaje el resultado fue idéntico al de la ronda anterior. 📌 La diferencia entre las dos lecturas es el dato: el mercado cerró 4,00pp de distancia en un día en que la encuesta no cerró ninguno. ⛔ Sin superlativo: 31,45% no es el valor más alto de la serie, y dos de los 90 días registrados están por encima. Fuera del precio, su día fue de fricción interna en el campo de la derecha, con el intercambio público con Kassab y con Caiado registrado por Estadão y Folha de S.Paulo.`,

  // ---------------- RENAN SANTOS ----------------
  'candidates[2].header':
    `PRECIO: 4,05% (vol USD 9,95M acumulado), ${CAR}. ENCUESTA: 4% en la primera vuelta en la BTG/Nexus de hoy, DETRÁS de Caiado, que tiene 5%.`,
  'candidates[2].fortes[0]':
    `Sigue adelante en el contrato de tercer lugar de la primera vuelta, con 52,50%, la mayor probabilidad de ese book.`,
  'candidates[2].fortes[1]':
    `Su contrato es el de MAYOR volumen acumulado del presidencial, con USD 9,95M, por encima del propio líder.`,
  'candidates[2].fortes[2]':
    `La BTG/Nexus de hoy lo mantiene en 4% en la primera vuelta, el mismo nivel de las nacionales recientes.`,
  'candidates[2].fortes[3]':
    `Abrió campaña en São Paulo el 16 de ago con discurso de seguridad, según O Globo y G1.`,
  'candidates[2].fortes[4]':
    `Evaluó públicamente que la eventual entrada de Pablo Marçal en la disputa beneficiaría a su rival de la derecha, y no a él.`,
  'candidates[2].fracos[0]':
    `🔴 CAÍDA CONTINUADA en el precio, de 4,70% a 4,05%, y el valor está POR DEBAJO de cualquier cierre registrado en la serie de 90 días, cuyo piso era 4,80%.`,
  'candidates[2].fracos[1]':
    `⚠️ Su book es fino y osciló entre 3,75% y 4,15% en menos de diez minutos durante la captura de hoy. El número publicado es el que la traba confirmó, y esa inestabilidad queda declarada.`,
  'candidates[2].fracos[2]':
    `En el contrato de tercer lugar también cedió, de 53,00% a 52,50%, y la distancia hacia el segundo de ese book se achicó de 15,50pp a 14,00pp.`,
  'candidates[2].fracos[3]':
    `🔴 EN LA ENCUESTA ESTÁ DETRÁS DE CAIADO: la BTG/Nexus de hoy le da 5% a Caiado y 4% a él.`,
  'candidates[2].fracos[4]':
    `El máximo de su serie es 17,90%, del 9 de jun, o sea que el precio de hoy es menos de un cuarto de aquel valor.`,
  'candidates[2].analise':
    `⭐ EL CRUCE MÁS LIMPIO DEL DÍA ESTÁ EN ÉL, y es entre los dos universos. En la ENCUESTA de hoy aparece con 4% y Caiado con 5%, o sea detrás. En el MERCADO tiene 4,05% de victoria contra 0,25% de Caiado, y en el contrato de tercer lugar tiene 52,50% contra 38,50%. 📌 Los dos universos no coinciden sobre quién es el tercer nombre de la disputa, y el panel no arbitra entre ellos: registra que la encuesta mide intención declarada de voto y el contrato mide probabilidad de posición, que son preguntas distintas. ⚠️ Y hay una salvedad de forma que pesa acá: su book es fino, osciló 0,40pp en minutos durante la captura, y por eso el movimiento en su contrato de victoria merece una lectura más floja que la de los dos primeros.`,

  // ---------------- PELOTÃO ----------------
  'candidates[3].header':
    `PRECIO para todo el pelotón, ${CAR}: Caiado 0,25% (vol USD 6,07M), Zema 0,25% (vol USD 5,62M). ⭐ Pablo Marçal aparece en 0,90% y entra en el próximo relevamiento de Datafolha.`,
  'candidates[3].fortes[0]':
    `⭐ CAIADO SUBIÓ EN EL CONTRATO DE POSICIÓN: el tercer lugar de la primera vuelta pasó de 37,50% a 38,50%, y su distancia hacia el primero de ese book se cerró de 15,50pp a 14,00pp.`,
  'candidates[3].fortes[1]':
    `En la BTG/Nexus de hoy Caiado tiene 5% en la primera vuelta, POR ENCIMA del 4% de Renan Santos, invirtiendo el orden que el mercado descuenta.`,
  'candidates[3].fortes[2]':
    `Zema tiene 4% en la misma BTG/Nexus, empatado con Renan Santos dentro del margen de 2pp.`,
  'candidates[3].fortes[3]':
    `La campaña del segundo trató a Caiado como problema el mismo día: Kassab dijo que su campaña está preocupada con Caiado, según Estadão.`,
  'candidates[3].fortes[4]':
    `Pablo Marçal aparece descontado en 0,90% y será incluido en el relevamiento de Datafolha previsto para el 21 de ago, según Valor Econômico.`,
  'candidates[3].fracos[0]':
    `🔴 Caiado CAYÓ en el contrato de victoria, de 0,60% a 0,25%, por debajo del piso de 0,50% registrado en la serie de 90 días.`,
  'candidates[3].fracos[1]':
    `Zema sigue en 0,25%, por debajo del corte de 0,5% que el panel usa para separar precio de ruido.`,
  'candidates[3].fracos[2]':
    `Los dos contratos de victoria del pelotón están en un nivel en el que la variación de una centésima ya cambia el porcentaje relativo, y el panel trata eso como forma, no como señal.`,
  'candidates[3].fracos[3]':
    `Kassab, que es candidato a vice en la fórmula de Caiado, dijo públicamente que él tiene cero chance en la elección, y después afirmó que fue mal interpretado, según Folha de S.Paulo y Estadão.`,
  'candidates[3].fracos[4]':
    `Zema abrió la semana con promesa de una cárcel de máxima seguridad y críticas a ministros del Supremo, y eso sigue sin traducción en precio, con 4,95% en el contrato de tercer lugar.`,
  'candidates[3].analise':
    `El pelotón produjo el movimiento más interesante del día en POSICIÓN, y no en victoria. Caiado cayó en el contrato de ganar, de 0,60% a 0,25%, y subió en el de terminar tercero, de 37,50% a 38,50%. 📌 Son preguntas distintas y el panel no las suma: un contrato pregunta si gana la elección, el otro pregunta en qué posición termina la primera vuelta. ⭐ Y la encuesta de hoy refuerza ese lado: la BTG/Nexus le da 5% a Caiado contra 4% de Renan Santos, o sea que en la intención declarada él ya es el tercer nombre, mientras que en el book de tercer lugar todavía aparece 14,00pp atrás. ⚠️ Todos esos contratos de victoria del pelotón están por debajo de 1%, franja en la que el panel declara ruido y evita lecturas finas.`,

  // ---------------- QUADRO COMPARATIVO ----------------
  'quadroComparativo[0].p':
    `NACIONAL NUEVA: BTG/Nexus del 17 de ago (n=2.003, campo del 14 al 16 de ago, BR-03317/2026, margen de 2pp) con 41% en la primera vuelta, alza de 1 punto contra la propia casa, y 47% en el balotaje, IDÉNTICO a la ronda anterior. La Quaest del 14 de ago sigue en la base con 38%.`,
  'quadroComparativo[0].m': `64,50% (vol USD 8,52M acumulado), ${CAR}`,
  'quadroComparativo[0].t':
    `🔴 CAÍDA de 2,00pp, de 66,50% a 64,50%, devolviendo lo que subió la víspera. La distancia hacia el segundo SE CERRÓ de 37,05pp a 33,05pp. ⛔ Sin superlativo: el máximo de la serie sigue en 66,50%, del 1 de ago, y 5 de los 90 días registrados están por encima del cierre de hoy.`,
  'quadroComparativo[0].s':
    `Segundo día de campaña oficial, a 48 días de la primera vuelta. La Policía Federal encontró un mensaje en el que su hijo y una lobista investigada por fraudes en el INSS tratan de negocios, según Poder360. 📅 Datafolha publica el 21 de ago, incluyendo a Pablo Marçal.`,

  'quadroComparativo[1].p':
    `NACIONAL NUEVA: la BTG/Nexus de hoy lo lleva de 35% a 36% en la primera vuelta y repite 44% en el balotaje. ⚠️ La distancia hacia el líder NO cambió, sigue en 5 puntos, porque los dos subieron 1 punto, y cada movimiento cabe dentro del margen de 2pp.`,
  'quadroComparativo[1].m': `31,45% (vol USD 8,46M acumulado), ${CAR}`,
  'quadroComparativo[1].t':
    `🔴 ALZA de 2,00pp, de 29,45% a 31,45%, cuarto día seguido subiendo y el mayor movimiento del día entre los contratos grandes. ⛔ No es récord: 2 de los 90 días de la serie están por encima, y el máximo es 33,20%, del 2 de jun.`,
  'quadroComparativo[1].s':
    `Pasó el día en fricción dentro de su propio campo: acusó a Caiado de ayudar al líder después de que Kassab dijera que Caiado tiene cero chance, y Kassab respondió que su campaña está preocupada con Caiado, según Estadão.`,

  'quadroComparativo[2].p':
    `NACIONAL NUEVA: la BTG/Nexus de hoy lo mantiene en 4% en la primera vuelta. 🔴 Aparece DETRÁS de Caiado, que tiene 5%, y empatado con Zema, que tiene 4%.`,
  'quadroComparativo[2].m': `4,05% (vol USD 9,95M acumulado), ${CAR}`,
  'quadroComparativo[2].t':
    `🔴 CAÍDA continuada, de 4,70% a 4,05%, y el valor queda POR DEBAJO del piso de 4,80% registrado en la serie de 90 días. ⚠️ El book es fino y osciló entre 3,75% y 4,15% en menos de diez minutos durante la captura, y el número publicado es el que la traba confirmó. En el tercer lugar cedió de 53,00% a 52,50%.`,
  'quadroComparativo[2].s':
    `Abrió campaña en São Paulo el 16 de ago con discurso de seguridad, según O Globo y G1. Dijo que la eventual entrada de Pablo Marçal beneficiaría a su rival de la derecha, y no a él.`,

  'quadroComparativo[3].p':
    `NACIONAL NUEVA: la BTG/Nexus de hoy le da 5% en la primera vuelta, ⭐ POR ENCIMA del 4% de Renan Santos. En la intención declarada ya es el tercer nombre del cuadro.`,
  'quadroComparativo[3].m': `0,25% (vol USD 6,07M acumulado), ${CAR}`,
  'quadroComparativo[3].t':
    `⭐ EL CRUCE DE CONTRATO SE REPITE Y CAMBIA DE SIGNO: cayó de 0,60% a 0,25% en la VICTORIA, por debajo del piso de 0,50% de la serie, y SUBIÓ de 37,50% a 38,50% en la POSICIÓN de tercer lugar. Su distancia hacia el primero de ese book se cerró de 15,50pp a 14,00pp.`,
  'quadroComparativo[3].s':
    `Kassab, candidato a vice en su fórmula, dijo que él tiene cero chance y después afirmó que fue mal interpretado, según Folha de S.Paulo. El mismo día, Kassab dijo que la campaña del segundo está preocupada con él, según Estadão.`,

  'quadroComparativo[4].p':
    `NACIONAL NUEVA: la BTG/Nexus de hoy le da 4% en la primera vuelta, empatado con Renan Santos dentro del margen de 2pp y detrás del 5% de Caiado.`,
  'quadroComparativo[4].m': `0,25% (vol USD 5,62M acumulado), ${CAR}`,
  'quadroComparativo[4].t':
    `ALZA de 0,10pp, de 0,15% a 0,25%, y el precio sigue por debajo del corte de 0,5% que el panel usa para separar precio de ruido. En el contrato de tercer lugar tiene 4,95%.`,
  'quadroComparativo[4].s':
    `Inició la semana de campaña con promesa de una cárcel de máxima seguridad y críticas a ministros del Supremo, según Folha de S.Paulo y Valor Econômico.`,

  'quadroComparativo[5].p': `Sin encuesta. Mercado de impeachment de ministro del Supremo antes de 2027.`,
  'quadroComparativo[5].m': `3,40% (vol USD 84 mil), ${CAR}`,
  'quadroComparativo[5].t':
    `QUIETO en 3,40%, sin variación contra la lectura del 16 de ago. ⚠️ Sigue siendo el contrato más fino entre los seguidos, con volumen tres órdenes de magnitud por debajo del presidencial, y el movimiento en él exige esa salvedad antes de cualquier lectura.`,
  'quadroComparativo[5].s':
    `⭐ El tribunal volvió al noticiero por fuera de la campaña: el gobierno de los Estados Unidos evalúa nuevas sanciones contra el ministro Alexandre de Moraes, según el Financial Times, información publicada en Brasil por Valor Econômico y G1. El colegio de abogados de São Paulo propuso al Supremo un mandato de 12 años para los ministros y una edad mínima de 50 años.`,

  // ---------------- CRUZAMENTO ----------------
  cruzamento:
    `⭐ EL DÍA TIENE UN HALLAZGO ÚNICO Y ES DE DIVERGENCIA ENTRE LOS DOS UNIVERSOS QUE EL PANEL MIDE. La primera encuesta nacional desde el 14 de ago salió hoy, la BTG/Nexus (n=2.003, campo del 14 al 16 de ago, BR-03317/2026, margen de 2pp), y lo que dice es estabilidad: el líder pasó de 40% a 41%, el segundo de 35% a 36%, la DISTANCIA entre los dos quedó en los mismos 5 puntos, y el escenario de balotaje repitió 47 a 44, número por número. Los dos movimientos de 1 punto caben enteros dentro del margen declarado por la casa. El mismo día el mercado hizo lo opuesto: el líder cedió 2,00pp y el segundo ganó 2,00pp, así que la distancia en el precio SE CERRÓ 4,00pp, de 37,05pp a 33,05pp, en cerca de 26 horas. ⛔ El panel NO afirma que el precio reaccionó a la encuesta, y el motivo es aritmético: la encuesta no mostró achicamiento alguno, así que no explica un achicamiento de 4 puntos. Lo que sí se puede registrar, y el panel lo registra, es que la prensa encuadró la ganancia de 1 punto del segundo como avance y disputa más competitiva, y que el precio se movió en la dirección de ese encuadre. La correlación de dirección no es causa, y el panel se detiene acá. ⭐ EL SEGUNDO CRUCE ES SOBRE QUIÉN ES EL TERCERO. En la encuesta de hoy, Caiado tiene 5% y Renan Santos tiene 4%, con Zema también en 4%. En el mercado, Renan Santos tiene 4,05% de ganar contra 0,25% de Caiado, y en el contrato de tercer lugar de la primera vuelta tiene 52,50% contra 38,50%. Los dos universos no coinciden sobre el orden del pelotón, y la discrepancia viene achicándose: ese book estaba 15,50pp separado el 16 de ago y está 14,00pp ahora. 📌 El panel no arbitra entre los dos, porque las preguntas son distintas: la encuesta mide intención declarada de voto en la primera vuelta, el contrato mide probabilidad de terminar en determinada posición. ⚠️ LO QUE DEBILITA LA LECTURA DE HOY, declarado: el contrato de Renan Santos es fino y osciló entre 3,75% y 4,15% en menos de diez minutos durante la captura, así que su movimiento merece una lectura más floja que la de los dos primeros. Y la aprobación del gobierno NO entra en este panel hoy, porque los medios divergieron sobre el número de la BTG/Nexus, entre 47% contra 48% y 46% contra 49%, y el sitio de la casa no trajo el dato. Entra solamente la evaluación, donde la lectura converge: 42% de malo o pésimo, 34% de excelente o bueno y 23% de regular. 📌 La captura de precio de este panel fue confirmada por DOS pasadas independientes de la traba, en ventanas separadas, y las dos aprobaron.`,
})
