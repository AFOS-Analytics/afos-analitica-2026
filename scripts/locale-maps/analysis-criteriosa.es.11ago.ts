/**
 * Mapa ES de 11/Ago para analysis-criteriosa.json.
 * Convenções: vírgula decimal e ponto de milhar. "estancado", nunca "parado"; "descontar", nunca "precificar".
 */
import { construir } from '../build-locale-json'

const S = 'lectura confirmada del 11/Ago, 16:27 BRT'

construir('analysis-criteriosa', 'es', {
  subtitle:
    `ACTUALIZACIÓN 11/Ago, a 54 días de la primera vuelta. TRES NACIONALES NUEVAS y discrepan entre sí: CNT/MDA (n=2.002, presencial), Futura Inteligência (n=2.000, telefónica) y Gerp (n=2.400, telefónica). En la segunda vuelta, el resultado va de 9pp a favor del líder a 2pp a favor del adversario. Precios de la ${S}, confirmados por dos lecturas independientes.`,

  // ---------- Lula ----------
  'candidates[0].header':
    `TRES ENCUESTAS NUEVAS Y DISCREPAN MÁS QUE EN CUALQUIER DÍA DE LA VENTANA: CNT/MDA da 42,4% y victoria por 48% x 39% en la segunda vuelta, Futura da 38,8% y 46,5% x 44%, y Gerp da EMPATE en 38% y DERROTA por 45% x 43%. EN EL PRECIO, ESTANCADO por tercera jornada: 63,50% (vol USD 8,21M acumulado) en la ${S}.`,
  'candidates[0].fortes[0]':
    `Lidera o empata la primera vuelta en las SIETE nacionales desde el 5/Ago, y gana la segunda vuelta en cinco de las seis rondas que la prueban.`,
  'candidates[0].fortes[1]':
    `La CNT/MDA de hoy trae su mejor lectura de toda la ventana: 42,4% en la primera vuelta, con 13,7pp de ventaja, y 48% x 39% en la segunda.`,
  'candidates[0].fortes[4]':
    `Precio de la ${S} en 63,50%, con USD 8,21M de volumen acumulado, y la serie de 89 días tiene un techo de 66,50%, del 1/Ago.`,
  'candidates[0].fracos[0]':
    `GERP ES LA PRIMERA NACIONAL DE LA VENTANA EN PONERLO POR DETRÁS EN LA SEGUNDA VUELTA: 43% contra 45%, dentro del margen de 2pp y tratado como empate técnico por la propia difusión.`,
  'candidates[0].fracos[3]':
    `La diferencia de mercado volvió a +36,55pp, el mismo valor del 9/Ago, deshaciendo el estrechamiento del día anterior.`,
  'candidates[0].fracos[4]':
    `Salvedad de serie: 15 de los 89 días tuvieron un precio igual o superior a 63,50%, así que el nivel actual no es extremo.`,
  'candidates[0].analise':
    `EL DÍA TRAJO TRES ENCUESTAS Y NO CUENTAN LA MISMA HISTORIA. CNT/MDA, presencial, con n=2.002 y campo del 5 al 8/Ago, da 42,4% en la primera vuelta y 48% x 39% en la segunda. Futura Inteligência, telefónica, con n=2.000 y campo del 3 al 7/Ago, da 38,8% y 46,5% x 44%. Gerp, telefónica, con n=2.400 y campo del 6 al 10/Ago, da EMPATE en 38% x 38% y derrota por 45% x 43%. LAS TRES MIDIERON LA MISMA SEMANA, y en la segunda vuelta el resultado va de nueve puntos a favor a dos puntos en contra, es decir, once puntos de distancia sobre la misma pregunta. Sumando las siete nacionales desde el 5/Ago aparece entre 38% y 44%. EN EL PRECIO NO HUBO MOVIMIENTO: 63,50% por tercera jornada seguida, con USD 8,21M acumulados. La diferencia volvió a +36,55pp, el valor del 9/Ago, y esta vez porque el adversario devolvió los 0,30pp que había ganado. ⚠️ EL CRUCE CENTRAL DEL DÍA ES DE RÉGIMEN, NO DE NIVEL: mientras tres institutos abrían once puntos de distancia entre sí, todo el mercado tuvo una variación máxima de 0,75pp, y su precio no se movió. Los dos instrumentos midieron la misma disputa y uno de ellos está mucho más incierto que el otro. El panel registra la diferencia de régimen sin decir cuál está en lo cierto. LA APROBACIÓN acompaña la misma dispersión: 47,3% contra 49,9% en Futura, 53% de desaprobación en Gerp, y gestión en 35% de excelente o buena contra 36% de mala o pésima en CNT/MDA.`,

  // ---------- Flávio ----------
  'candidates[1].header':
    `GERP LO PONE POR DELANTE EN LA SEGUNDA VUELTA, con 45% contra 43%, y es la PRIMERA vez que una nacional de la ventana lo hace. El mismo día CNT/MDA lo pone nueve puntos por detrás. En la primera vuelta va de 28,7% a 38% entre las tres de hoy. EN EL PRECIO CAYÓ 0,30pp, a 26,95% (vol USD 8,12M acumulado), en la ${S}.`,
  'candidates[1].fortes[0]':
    `La Gerp de hoy es la PRIMERA nacional de la ventana en ponerlo por delante en la segunda vuelta, con 45% contra 43%, y el mismo sondeo señala empate en 38% x 38% en la primera vuelta.`,
  'candidates[1].fortes[1]':
    `Sumando Gerp y Palver, son dos rondas en dos días en las que no pierde la segunda vuelta, tras una ventana entera de derrotas.`,
  'candidates[1].fortes[4]':
    `Precio de la ${S} en 26,95%, con USD 8,12M acumulados, y 30 de los 89 días de la serie tuvieron un valor igual o superior.`,
  'candidates[1].fracos[0]':
    `SU AMPLITUD CRECIÓ A 11,3pp: en las siete nacionales desde el 5/Ago aparece con 28,7%, 30%, 34,1%, 35%, 35%, 38% y 40%, y el 28,7% de CNT/MDA queda por debajo del piso anterior de la ventana.`,
  'candidates[1].fracos[4]':
    `En el precio devolvió los 0,30pp que había ganado, y en el contrato de segundo lugar cayó 1,50pp, a 80,50%.`,
  'candidates[1].analise':
    `SU DÍA TIENE EL MEJOR Y EL PEOR DATO DE LA VENTANA, Y LOS DOS SALIERON JUNTOS. Gerp lo pone por delante en la segunda vuelta, con 45% contra 43%, y es la primera nacional del período en hacerlo; la propia difusión trata la diferencia de 2pp como empate técnico dentro del margen. El mismo día CNT/MDA lo pone nueve puntos por detrás, con 39% contra 48%. Futura queda en el medio, con 44% contra 46,5%. EN LA PRIMERA VUELTA LA DISTANCIA ES IGUALMENTE GRANDE: 28,7% en CNT/MDA y 38% en Gerp, 9,3 puntos entre dos lecturas del mismo día. SU AMPLITUD EN LA VENTANA LLEGÓ A 11,3pp, contra 6pp del líder, y el 28,7% abrió un piso nuevo. Elegir una de las tres es elegir la conclusión, y por eso el panel publica el conjunto. EN EL PRECIO EL MOVIMIENTO FUE PEQUEÑO Y CONTRARIO: cayó 0,30pp, a 26,95%, devolviendo exactamente lo que había ganado el día anterior, y la diferencia volvió al valor del 9/Ago. En el contrato de segundo lugar perdió 1,50pp, a 80,50%. EL RECHAZO SIGUE ALTO: 47,1% en Futura, en empate técnico con el 45,9% del líder. EN EL TABLERO, su campaña definió el eslogan el 11/Ago y retomó una frase de 2002 del adversario para hablar de miedo, y afirmó que irá a los debates y que no debe explicaciones sobre el caso Master.`,

  // ---------- Renan Santos ----------
  'candidates[2].header':
    `LA MAYOR VARIACIÓN DE TODO EL LIBRO FUE SUYA: subió 0,75pp, a 8,40% (vol USD 9,43M acumulado), en la ${S}. En la encuesta Gerp le da 5%, el segundo mayor valor de la ventana, por detrás solo del 10% de Palver por internet. El efecto de método sigue siendo la lectura.`,
  'candidates[2].fortes[0]':
    `MAYOR VARIACIÓN DE TODO EL LIBRO PRESIDENCIAL en la lectura de hoy, con un alza de 0,75pp, a 8,40%.`,
  'candidates[2].fortes[1]':
    `Salió del piso de su propia serie: el 10/Ago, 84 de los 88 días tenían un valor igual o superior al suyo, y ahora son 72 de 89.`,
  'candidates[2].fortes[2]':
    `Gerp le da 5% en la primera vuelta, el segundo mayor valor de la ventana, y el precio sigue por encima de todas las lecturas por teléfono y presenciales.`,
  'candidates[2].fracos[2]':
    `El intervalo entre métodos sigue abierto: de 4% a 5% por teléfono y presencial contra 10% por internet, con la salvedad declarada por la propia Palver.`,
  'candidates[2].analise':
    `TUVO LA MAYOR VARIACIÓN DE PRECIO DEL DÍA Y EL SEGUNDO MAYOR VALOR DE ENCUESTA DE LA VENTANA, Y LAS DOS COSAS DEBEN LEERSE POR SEPARADO. En el mercado subió 0,75pp, a 8,40%, y fue el único movimiento por encima de 0,30pp en todo el libro presidencial. En la serie de 89 días salió del piso: el 10/Ago había 84 días con un valor igual o superior al suyo, y ahora son 72. EN LA ENCUESTA Gerp le da 5% en la primera vuelta, por detrás solo del 10% que Palver midió por internet el 10/Ago, y CNT/MDA y Futura no publicaron el campo completo. EL EFECTO DE MÉTODO SIGUE SIENDO LA LECTURA CENTRAL SOBRE ÉL: el mismo nombre va de 4% a 10% según el entorno de la entrevista, y la salvedad no es de este panel, fue declarada por la propia Palver, que informó que prueba enfoques para reducir el efecto en encuestas online. ⚠️ EL PANEL NO ATRIBUYE EL ALZA DE PRECIO A LA DISCUSIÓN PÚBLICA SOBRE MÉTODO que la prensa hizo el 10 y el 11/Ago. No hay medición que ligue las dos cosas, y un movimiento intradiario sin evento identificable es momentum, no reacción. La secuencia queda registrada sin afirmar causa. Sigue con el mayor volumen acumulado del libro entre los nombres por encima de 1%, con USD 9,43M.`,

  // ---------- pelotón ----------
  'candidates[3].header':
    `LA BASE DE COMPARACIÓN SOBRE ELLOS SE REDUJO: de las tres nacionales de hoy, solo Gerp publicó el campo completo, con Caiado en 4% y Zema en 2%. Precios de la ${S}: Caiado 1,05% (vol USD 5,63M), Zema 0,35% (vol USD 5,05M) y Haddad 0,05% (vol USD 7,01M).`,
  'candidates[3].subtitle':
    `11/Ago, a 54 días de la primera vuelta: de las tres nacionales publicadas hoy, solo Gerp difundió el campo completo, y la base de comparación sobre el pelotón se redujo justo en el día de mayor dispersión entre casas. Los tres cayeron en el precio. La fase de registro va hasta el 15/Ago, y Zema, que lo presentó el 6/Ago, sigue siendo el único de los tres con registro presentado.`,
  'candidates[3].caiado.label':
    `CAIADO (PSD), Poly presidencial 1,05% (vol USD 5,63M acumulado, ${S}) | candidato oficializado en convención, con Kassab de vice | encuesta vigente: Gerp 4%, Genial/Quaest 4%, Meio/Ideia 5,7%, BTG/Nexus 5%`,
  'candidates[3].caiado.fortes':
    `La Gerp de hoy le da 4% en la primera vuelta, el mismo valor de Genial/Quaest del 5/Ago, y sigue por delante de Zema en todas las rondas que publican el campo completo. Sigue vigente el empate de Lula con él en la segunda vuelta de BTG/Nexus del 10/Ago, que es el mejor resultado que un nombre fuera de los dos primeros obtuvo en esta ventana. En la Meio/Ideia del 5/Ago es el adversario que más se acerca en la segunda vuelta, con 40% contra 48,5%.`,
  'candidates[3].caiado.fracos':
    `CAYÓ 0,10pp POR TERCERA JORNADA SEGUIDA, a 1,05%. Su distancia entre encuesta y precio sigue siendo la mayor del pelotón: de 4% a 5,7% de intención declarada contra 1,05% de probabilidad descontada. La discrepancia entre institutos sobre él sigue abierta dentro del mismo campo, con 4% en una casa y 5,7% en otra. Dos de las tres nacionales de hoy no publicaron el campo completo, así que la base de comparación sobre él se redujo.`,
  'candidates[3].haddad.label':
    `HADDAD (PT), Poly presidencial 0,05% (vol USD 7,01M acumulado, ${S}) | NO probado por ninguna de las tres nacionales del 11/Ago, porque disputa el gobierno de São Paulo`,
  'candidates[3].haddad.fortes':
    `Su volumen acumulado, USD 7,01M, sigue siendo mayor que el de varios nombres con precio por encima del suyo, lo que mantiene el contrato con respaldo de negociación pese al nivel bajo.`,
  'candidates[3].haddad.fracos':
    `CAYÓ 0,10pp Y VOLVIÓ AL PISO DE 0,05% tras un único día por encima de él. Ninguna de las tres nacionales del 11/Ago lo prueba, en ningún escenario. El agravante permanece y hay que decirlo con claridad: él NO es candidato a la Presidencia, disputa el gobierno de São Paulo, y cualquier escenario que lo incluya es una hipótesis de encuesta y no una candidatura en curso. En ese nivel, la variación tiene un valor informativo casi nulo.`,
  'candidates[3].zema.label':
    `ZEMA (Novo), Poly presidencial 0,35% (vol USD 5,05M acumulado, ${S}) | encuesta vigente: Gerp 2%, Genial/Quaest 2%, Meio/Ideia 2,6%, BTG/Nexus 3% | fórmula con el senador Eduardo Girão | registró su candidatura ante el TSE el 6/Ago`,
  'candidates[3].zema.fortes':
    `Registró su candidatura ante el TSE el 6/Ago, declarando R$ 178,7 millones de patrimonio, y sigue siendo el único del pelotón con registro presentado, en un plazo que se cierra el 15/Ago. En la encuesta está estable en todas las casas que lo prueban, entre 2% y 3%.`,
  'candidates[3].zema.fracos':
    `CAYÓ 0,10pp, a 0,35%, HUNDIÉNDOSE MÁS POR DEBAJO DEL CORTE DE 0,5% que el panel usa para separar precio de ruido, y la lectura sobre él sigue suspendida en esa franja. Es el adversario al que el líder vence con más holgura en las rondas que lo prueban, por 46% x 34% en Quaest y 48,5% x 37% en Ideia. En la encuesta no se mueve desde hace un mes. La salvedad de serie es grande: su máximo fue 10,10%, el 26/Abr.`,
  'candidates[3].fortes[0]':
    `La Gerp de hoy da 4% a Caiado, el mismo valor de Genial/Quaest del 5/Ago, y sigue por delante de Zema en todas las rondas que publican el campo completo.`,
  'candidates[3].fracos[0]':
    `El precio de Caiado cayó 0,10pp por TERCERA jornada seguida, a 1,05%, y su distancia entre encuesta y precio sigue siendo la mayor del pelotón.`,
  'candidates[3].fracos[1]':
    `Zema cayó 0,10pp, a 0,35%, hundiéndose más por debajo del corte de 0,5% que el panel usa para separar precio de ruido.`,
  'candidates[3].fracos[2]':
    `DOS DE LAS TRES NACIONALES DE HOY no publicaron el campo completo, así que la base de comparación entre casas sobre ellos se redujo justo en el día de mayor dispersión.`,
  'candidates[3].analise':
    `SU DATO DE HOY ES UNA AUSENCIA, Y LA AUSENCIA TAMBIÉN ES INFORMACIÓN. De las tres nacionales publicadas el 11/Ago, solo Gerp difundió el campo completo, con Caiado en 4%, Zema en 2%, Cabo Daciolo y Augusto Cury en 1% cada uno, además de 7% de indecisos y 4% que no elegirían a ninguno. CNT/MDA y Futura publicaron solo los dos primeros. En el día en que la dispersión entre institutos fue la mayor de la ventana, la base de comparación sobre el pelotón se hizo menor, y el panel lo registra en lugar de llenar el vacío con cifras antiguas. EN EL PRECIO los tres cayeron: Caiado 0,10pp por tercera jornada seguida, a 1,05%, Zema 0,10pp, a 0,35%, y Haddad 0,10pp, volviendo al piso de 0,05%. LA DISTANCIA DE CAIADO SIGUE SIENDO LA MAYOR DEL PELOTÓN: de 4% a 5,7% de intención declarada contra 1,05% de probabilidad descontada. El panel registra la distancia sin restar una magnitud de la otra, porque la encuesta mide intención ahora y el contrato mide probabilidad de ganar al final. ZEMA sigue por debajo del corte de 0,5% y la lectura sobre él permanece suspendida. HADDAD sigue sin candidatura presidencial, disputando el gobierno de São Paulo, y la cobertura del 11/Ago lo trae en una encuesta estatal paulista tras el primer debate en Band.`,

  // ---------- cuadro comparativo ----------
  'quadroComparativo[0].p':
    `TRES NACIONALES NUEVAS EL 11/Ago y discrepan. CNT/MDA (n=2.002, presencial, BR-06935/2026): 42,4% y 48% x 39% en la segunda vuelta. Futura (n=2.000, telefónica): 38,8% y 46,5% x 44%. Gerp (n=2.400, telefónica, BR-08045/2026): EMPATE en 38% y derrota por 45% x 43%. En las siete rondas desde el 5/Ago va de 38% a 44%.`,
  'quadroComparativo[0].m': `63,50% (vol USD 8,21M acumulado), ${S}`,
  'quadroComparativo[0].t':
    `ESTANCADO por tercera jornada seguida. La diferencia volvió a +36,55pp, el valor del 9/Ago, porque el adversario devolvió los 0,30pp de ayer. En la serie de 89 días, 15 tuvieron un valor igual o superior.`,
  'quadroComparativo[0].s':
    `54 días de la elección. La aprobación también se dispersa: 47,3% x 49,9% en Futura, 53% de desaprobación en Gerp, y gestión en 35% de excelente o buena contra 36% de mala o pésima en CNT/MDA.`,

  'quadroComparativo[1].p':
    `GERP LO PONE POR DELANTE EN LA SEGUNDA VUELTA, 45% x 43%, primera vez en la ventana. CNT/MDA lo pone nueve puntos por detrás el mismo día, con 39% x 48%. Futura queda en el medio, con 44% x 46,5%. En la primera vuelta va de 28,7% a 38% entre las tres, y la amplitud de la ventana llegó a 11,3pp. RECHAZO de 47,1% en Futura.`,
  'quadroComparativo[1].m': `26,95% (vol USD 8,12M), ${S}`,
  'quadroComparativo[1].t':
    `CAYÓ 0,30pp y devolvió lo que había ganado el día anterior. En el contrato de segundo lugar cayó 1,50pp, a 80,50%. No es extremo: 30 de los 89 días tuvieron un valor igual o superior.`,
  'quadroComparativo[1].s':
    `La campaña definió el eslogan el 11/Ago y retomó una frase de 2002 del adversario para hablar de miedo. Afirmó que irá a los debates y que no debe explicaciones sobre el caso Master.`,

  'quadroComparativo[2].p':
    `Gerp le da 5% en la primera vuelta, el segundo mayor valor de la ventana, por detrás solo del 10% de Palver por internet. Siguen vigentes el 4% de Genial/Quaest presencial, el 4,7% de Meio/Ideia y el 4% de BTG/Nexus. CNT/MDA y Futura no publicaron el campo completo.`,
  'quadroComparativo[2].m': `8,40% (vol USD 9,43M), ${S}`,
  'quadroComparativo[2].t':
    `SUBIÓ 0,75pp y fue la MAYOR variación de todo el libro presidencial. Salió del piso de su propia serie: eran 84 de los 88 días por encima de él el 10/Ago, ahora son 72 de 89. El precio sigue ENTRE los dos métodos de la encuesta.`,
  'quadroComparativo[2].s':
    `Mayor volumen acumulado del libro entre los nombres por encima de 1%, con USD 9,43M. La BBC publicó el 11/Ago un reportaje sobre la adhesión de parte del mercado financiero a su campaña.`,

  'quadroComparativo[3].p':
    `Gerp le da 4% en la primera vuelta, el mismo valor de Genial/Quaest del 5/Ago. Meio/Ideia sigue con 5,7%. CNT/MDA y Futura no publicaron el campo completo, y la base de comparación sobre él se redujo.`,
  'quadroComparativo[3].m': `1,05% (vol USD 5,63M), ${S}`,
  'quadroComparativo[3].t':
    `CAYÓ 0,10pp por TERCERA jornada seguida. La distancia entre encuesta y precio sigue siendo la mayor del pelotón: de 4% a 5,7% declarados contra 1,05% descontado.`,
  'quadroComparativo[3].s':
    `Sigue vigente el empate de Lula con él en la segunda vuelta de BTG/Nexus del 10/Ago, el mejor resultado que un nombre fuera de los dos primeros obtuvo en la ventana.`,

  'quadroComparativo[4].p':
    `Gerp le da 2% en la primera vuelta, y la BTG/Nexus del 10/Ago había dado 3%. Siguen vigentes el 2% de Genial/Quaest y el 2,6% de Meio/Ideia, del 5/Ago.`,
  'quadroComparativo[4].m': `0,35% (vol USD 5,05M), ${S}`,
  'quadroComparativo[4].t':
    `CAYÓ 0,10pp y se hundió más por debajo del corte de 0,5% que separa precio de ruido. La lectura sobre él sigue suspendida en esa franja.`,
  'quadroComparativo[4].s':
    `Registró su candidatura ante el TSE el 6/Ago, con R$ 178,7 millones declarados, y el plazo de registro de los demás se cierra el 15/Ago.`,

  'quadroComparativo[5].m': `3,80% (vol USD 83 mil), ${S}`,
  'quadroComparativo[5].t':
    `SUBIÓ 0,20pp contra el último valor confirmado, que era 3,60% el 9/Ago. Sigue siendo el contrato más fino entre los seguidos, y cualquier movimiento en él exige esa salvedad.`,
  'quadroComparativo[5].s':
    `El caso Master volvió a la cobertura el 11/Ago sin decisión judicial nueva: el liquidador amplió el cerco a los bienes de Vorcaro en Estados Unidos, la PF señaló una consultoría que actuó para favorecer al banco en un fondo de pensiones de Maceió, y el FGC afirmó no ser parte del acuerdo en el Supremo sobre el rescate del BRB.`,

  cruzamento:
    `TRES ENCUESTAS NACIONALES EL 11/Ago, Y DISCREPAN ENTRE SÍ MÁS QUE EN CUALQUIER OTRO DÍA DE ESTA VENTANA. Los precios de esta página son de la ${S}, confirmados por dos lecturas independientes tomadas con ocho minutos de intervalo. EN LA SEGUNDA VUELTA, LA DISTANCIA ES DE ONCE PUNTOS: CNT/MDA (n=2.002, presencial, campo del 5 al 8/Ago) da 48% x 39% para el líder; Futura Inteligência (n=2.000, telefónica, campo del 3 al 7/Ago) da 46,5% x 44%; y Gerp (n=2.400, telefónica, campo del 6 al 10/Ago) da 45% x 43% PARA EL SEGUNDO. Es la primera vez en la ventana que una nacional pone al adversario por delante en ese escenario. EN LA PRIMERA VUELTA LA DISTANCIA ES DE 9,3 PUNTOS sobre el mismo nombre: 28,7% en CNT/MDA y 38% en Gerp, con Futura en 34,1%. Sumando las siete nacionales desde el 5/Ago, el líder va de 38% a 44%, una franja de 6pp, y el segundo va de 28,7% a 40%, una franja de 11,3pp, casi el doble. ⭐ EL CRUCE CENTRAL DEL DÍA ES DE RÉGIMEN, Y NO DE NIVEL. Mientras la encuesta abría esa distancia, el mercado casi no se movió: el líder quedó estancado por tercera jornada, en 63,50%, el segundo devolvió 0,30pp y volvió a 26,95%, y la diferencia regresó a +36,55pp, exactamente el valor del 9/Ago. La mayor variación de todo el libro presidencial, que suma USD 122,16M de volumen acumulado, fue de 0,75pp, en el tercero. Los dos instrumentos midieron la misma semana, y uno de ellos está mucho más incierto que el otro. El panel registra la diferencia de régimen y no dice cuál está en lo cierto, porque no lo sabe, y porque decirlo sería cambiar medición por opinión. EL TERCERO CONCENTRA LO QUE QUEDÓ DE MOVIMIENTO: subió 0,75pp, a 8,40%, salió del piso de su propia serie, y sigue con el precio ENTRE los dos métodos de la encuesta, por encima del 4% a 5% del teléfono y del presencial y por debajo del 10% que la encuesta por internet midió el 10/Ago. ⚠️ No se atribuye ninguna causa a ese movimiento, porque no hay medición que lo ligue a la discusión pública sobre método. LA APROBACIÓN SIGUE EL MISMO PATRÓN DE DISPERSIÓN: en siete lecturas de siete días la desaprobación va de 47% a 55%, y el saldo va de 1pp positivo a 10pp negativo.`,
})
