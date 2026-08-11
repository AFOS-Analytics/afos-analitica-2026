/**
 * Mapa ES de 10/Ago (rodada do PREÇO) para analysis-criteriosa.json.
 * Convenções: vírgula decimal e ponto de milhar. "estancado", nunca "parado".
 */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/es/glossary#${id})`
const S = 'lectura confirmada del 10/Ago, 21:32 BRT (11/Ago, 00:32 UTC)'

construir('analysis-criteriosa', 'es', {
  subtitle:
    `ACTUALIZACIÓN 10/Ago, a 55 días de la ${G('primera vuelta', 'primeiro-turno')}. DOS NACIONALES NUEVAS: BTG/Nexus (n=2.001, telefónica, BR-08428/2026) y el estreno de Palver (n=5.000, online, BR-06596/2026), ambas publicadas hoy. Precios de la ${S}, confirmados por dos lecturas independientes.`,

  // ================= LULA =================
  'candidates[0].header':
    `DOS ENCUESTAS NUEVAS Y DISCREPAN ENTRE SÍ: BTG/Nexus le da 40% en la primera vuelta y Palver le da 44%, con segundas vueltas de 47% x 44% y de 46% x 46%. En las cuatro nacionales desde el 5/Ago varía de 39% a 44%, un rango de 5pp. EN EL PRECIO, ESTANCADO: 63,50% (vol USD 8,20M acumulado) en la ${S}, el mismo valor de ayer.`,
  'candidates[0].fortes[4]':
    `Precio de la ${S} en 63,50%, con USD 8,20M de volumen acumulado, y la serie de 88 días tiene un techo de 66,50%, del 1/Ago.`,
  'candidates[0].fracos[3]':
    `LA DIFERENCIA SE ESTRECHÓ DE NUEVO, Y AHORA POR OTRO MOTIVO: fue a +36,25pp, contra +36,55pp de ayer, y esta vez porque el adversario SUBIÓ 0,30pp mientras él quedó estancado. Ayer se había estrechado porque él mismo cayó.`,
  'candidates[0].fracos[4]':
    `Salvedad de serie que sigue valiendo: 14 de los 88 días tuvieron un precio igual o superior a 63,50%, así que el nivel actual no es extremo.`,
  'candidates[0].analise':
    `EL DÍA TRAJO ENCUESTAS Y TRAJO PRECIO, Y LOS DOS APUNTAN HACIA LADOS DISTINTOS. Salieron dos nacionales y miden la misma disputa con resultados distintos: BTG/Nexus, telefónica, da 40% x 35% en la primera vuelta y 47% x 44% en la segunda; Palver, online y con n=5.000, da 44% x 40% y empate en 46% x 46%. Sumadas a las dos del 5/Ago, son cuatro nacionales en seis días, y él aparece entre 39% y 44%. LO QUE MUESTRA LA COMPARACIÓN DENTRO DE LA CASA es lo inverso de lo que mostró la semana pasada: el 3/Ago BTG/Nexus había estrechado la primera vuelta de 9pp a 4pp, y ahora se abrió de nuevo, a 5pp, con los dos cediendo y el adversario cediendo más. En la segunda vuelta de la misma casa la distancia pasó de 1pp a 3pp. EN EL PRECIO QUEDÓ ESTANCADO en 63,50%, el mismo valor de la lectura de ayer, con USD 8,20M de volumen acumulado. Y EL MECANISMO DE LA DIFERENCIA SE INVIRTIÓ, que es el detalle que importa: la distancia sobre el segundo colocado se estrechó a +36,25pp, pero esta vez porque el ADVERSARIO subió 0,30pp, y no porque el líder cediera. Ayer fue al revés. Cuando solo el líder cae, lo que existe es pérdida de precio en el favorito y la probabilidad puede no haber ido a nadie; cuando solo el segundo sube, hubo compra de su lado. LA APROBACIÓN SE MOVIÓ PARA EL OTRO LADO, y en las dos lecturas: 46% contra 49% en Nexus y 45% contra 55% en Palver. En cinco lecturas de ocho días el saldo va de 1pp positivo a 10pp negativo. EL CRUCE QUE INTERESA es de dirección: en la misma semana en que la diferencia de mercado se estrechó en seis de las siete últimas jornadas, la diferencia de BTG/Nexus se abrió en las dos vueltas. Los dos instrumentos se movieron en sentidos opuestos, y el panel lo registra sin decir cuál está en lo cierto.`,

  // ================= FLÁVIO =================
  'candidates[1].header':
    `SUBIÓ EN EL PRECIO Y ES EL ÚNICO DEL PELOTÓN QUE SUBIÓ: 27,25% (vol USD 8,11M acumulado) en la ${S}, alza de 0,30pp contra ayer. En la encuesta, la dispersión sigue siendo su número: en las cuatro nacionales desde el 5/Ago aparece con 30%, 35%, 35% y 40% en la primera vuelta, un rango de 10pp, el doble que el del líder.`,
  'candidates[1].fortes[4]':
    `Precio de la ${S} en 27,25%, con USD 8,11M de volumen acumulado, alza de 0,30pp y el ÚNICO nombre del pelotón que subió en la lectura de hoy.`,
  'candidates[1].fracos[4]':
    `El alza de 0,30pp no cambia el nivel: 26 de los 88 días de la serie tuvieron un valor igual o superior, con un techo de 34,40% el 13/May y un piso de 22,00% el 3/Jul.`,
  'candidates[1].analise':
    `EL NÚMERO MÁS INFORMATIVO SOBRE ÉL EN LA ENCUESTA NO ES UN NÚMERO, ES UN RANGO. En las cuatro nacionales publicadas desde el 5/Ago aparece con 30%, 35%, 35% y 40% en la primera vuelta, y la distancia entre la lectura más alta y la más baja llega a 10pp. Del lado del líder ese mismo rango es de 5pp. Es decir, la incertidumbre de medición está concentrada en él, y cualquier titular que fije un valor está eligiendo una casa. LAS DOS DE HOY ILUSTRAN LA DISTANCIA: BTG/Nexus, telefónica, da 35% y derrota en la segunda vuelta por 47% x 44%; Palver, online, da 40% y EMPATE en 46% x 46%, que es el mejor escenario que ha obtenido en la ventana. DENTRO DE SU PROPIA CASA el movimiento fue en su contra: BTG/Nexus tenía 37% el 3/Ago y ahora tiene 35%, y la diferencia de la primera vuelta se abrió de 4pp a 5pp precisamente por eso. EN EL PRECIO EL MOVIMIENTO FUE A FAVOR, y es el único del pelotón que subió: 27,25% en la lectura de hoy, alza de 0,30pp, con USD 8,11M acumulados. LA DIFERENCIA RESPECTO A AYER ES EL MECANISMO, y hay que decirla: ayer la diferencia se estrechó porque el líder cayó y él quedó estancado; hoy se estrechó porque él subió y el líder quedó estancado. Son cosas distintas, aunque el número final se mueva hacia el mismo lado. EL RECHAZO SIGUE SIENDO EL TECHO: 50% en Nexus y 51% en Palver, y en ambas queda en la cima o a un punto de ella. EN EL TABLERO, Folha de S.Paulo informó el 10/Ago que el presidente de la Cámara declaró apoyo a su adversario después de que su propio partido rechazara una coalición con él, y Estadão y O Globo publicaron un recorte estatal de Ideia/ACSP en São Paulo en el que hace 44% contra 39% en la segunda vuelta, dato de alcance estatal y que por eso no entra en el panel nacional.`,

  // ================= RENAN =================
  'candidates[2].header':
    `EL CASO DE MÉTODO DEL DÍA ES ÉL, Y QUIEN LO DECLARÓ FUE EL INSTITUTO: Palver, online, le da 10%, contra 4% en BTG/Nexus por teléfono el mismo día, y 4% y 4,7% en las dos del 5/Ago. La propia Palver evaluó que el formato digital pudo haber impulsado su desempeño. EN EL PRECIO CAYÓ 0,15pp, a 7,65% (vol USD 9,32M acumulado), en la ${S}.`,
  'candidates[2].fortes[1]':
    `Mayor volumen acumulado del libro presidencial entre los nombres por encima de 1%, con USD 9,32M en la lectura de hoy, por encima del volumen del propio líder.`,
  'candidates[2].fortes[2]':
    `El precio de mercado, en 7,65%, sigue estando POR ENCIMA de todas las lecturas por teléfono y presenciales, que quedan entre 4% y 4,7%.`,
  'candidates[2].fracos[2]':
    `El mercado lo descuenta cerca del PISO de su propia serie y lo empujó más hacia él: cayó 0,15pp hoy, a 7,65%, y 84 de los 88 días tuvieron un valor igual o superior, con un mínimo de 6,80% el 6/Ago.`,
  'candidates[2].analise':
    `ESTE ES EL CRUCE MÁS LIMPIO QUE EL PANEL PUEDE MOSTRAR, Y NO DEPENDE DE NINGÚN JUICIO. El mismo nombre, en la misma semana, aparece con 4% en Genial/Quaest presencial del 5/Ago, con 4,7% en Meio/Ideia por teléfono del mismo día, con 4% en BTG/Nexus por teléfono hoy, y con 10% en Palver por internet, también hoy. La diferencia entre la lectura más alta y la más baja es de 6pp en un candidato que ninguna casa pone en dos dígitos por teléfono. LA SALVEDAD NO ES NUESTRA, ES DE LA CASA: Palver evaluó que el formato digital pudo haber impulsado su desempeño, ya que mantiene una base activa en ese entorno, y dijo que prueba enfoques para reducir ese efecto en encuestas online. El panel repite su declaración en lugar de juzgar el número, porque medir y juzgar son cosas distintas. Y EL PRECIO SIGUE QUEDANDO ENTRE LOS DOS MÉTODOS: 7,65% en la lectura de hoy, por encima del 4% a 4,7% del teléfono y del presencial, por debajo del 10% de internet. PERO SE MOVIÓ HACIA ABAJO EL MISMO DÍA EN QUE LA ENCUESTA ONLINE LO PUSO EN SU TECHO: cayó 0,15pp, y 84 de los 88 días de la serie tuvieron un valor igual o superior, con un máximo de 17,90% el 9/Jun. Techo en la encuesta y piso en el precio, en la misma semana, y las dos cosas son verdad al mismo tiempo.`,

  // ================= CAIADO / HADDAD / ZEMA =================
  'candidates[3].header':
    `CAIADO EMPATA CON LULA EN LA SEGUNDA VUELTA DE BTG/NEXUS, y es el dato que cambia la lectura sobre él: la misma ronda que da derrota de 47% x 44% al segundo colocado apunta a un empate en el enfrentamiento contra Caiado. En la primera vuelta tiene 5% en Nexus. Precios de la ${S}: Caiado 1,15% (vol USD 5,62M), Zema 0,45% (vol USD 5,05M) y Haddad 0,15% (vol USD 6,98M).`,
  'candidates[3].fracos[0]':
    `El precio de Caiado CAYÓ de nuevo, 0,10pp, a 1,15%, y sigue siendo decenas de veces menor que su intención declarada, que va de 4% a 5,7% en las nacionales de la ventana.`,
  'candidates[3].fracos[1]':
    `Zema quedó estancado en 0,45%, POR DEBAJO del corte de 0,5% que el panel usa para separar precio de ruido, y la lectura sobre él sigue suspendida.`,
  'candidates[3].analise':
    `EL DATO NUEVO ES DE CAIADO Y VIENE DE LA SEGUNDA VUELTA. La BTG/Nexus de hoy apunta a un empate de Lula con él, en la misma ronda en la que el líder vence al segundo colocado por 47% x 44%. Sumado a los 40% contra 48,5% en la Meio/Ideia del 5/Ago, el cuadro es el de un tercer nombre que aparece mejor en el enfrentamiento directo que en la largada, y es exactamente lo opuesto de lo que muestra el precio: 1,15% en la lectura de hoy, tras otra caída de 0,10pp, contra 4% a 5,7% de intención declarada. EL PANEL NO RESTA UNO DEL OTRO, porque las dos magnitudes no son la misma: la encuesta mide intención ahora y el contrato mide probabilidad de ganar al final. Lo que el panel registra es que la distancia entre ellas es la mayor del pelotón, y que AUMENTÓ hoy, porque el precio cayó mientras la encuesta trajo su mejor segunda vuelta de la ventana. ZEMA quedó estancado en 0,45% y sigue por debajo del corte de 0,5% que el panel usa para separar precio de ruido. HADDAD subió 0,10pp, a 0,15%, en un nivel en el que la variación no tiene valor informativo, y sigue sin encuesta y sin candidatura presidencial, disputando la gobernación de São Paulo. LA AUSENCIA TAMBIÉN ES INFORMACIÓN: Palver, que es la mayor muestra del día con n=5.000, no publicó escenario con Caiado ni con Zema, y el panel registra la ausencia en lugar de repetir un número antiguo como si fuera nuevo.`,

  // ================= CUADRO COMPARATIVO =================
  'quadroComparativo[0].m': `63,50% (vol USD 8,20M acumulado), ${S}`,
  'quadroComparativo[0].t':
    `ESTANCADO en el mismo valor de ayer. La diferencia sobre Flávio se estrechó a +36,25pp, pero esta vez porque el ADVERSARIO subió 0,30pp, y no porque él cediera. En la ventana desde el 3/Ago la diferencia cayó en seis de las siete jornadas, desde +38,90pp, con un día estancado.`,

  'quadroComparativo[1].m': `27,25% (vol USD 8,11M), ${S}`,
  'quadroComparativo[1].t':
    `SUBIÓ 0,30pp y es el ÚNICO nombre del pelotón que subió en la lectura de hoy, tras tres días estancado en 26,95%. Fue esa alza, y no una caída del líder, la que estrechó la diferencia hoy.`,

  'quadroComparativo[2].m': `7,65% (vol USD 9,32M), ${S}`,
  'quadroComparativo[2].t':
    `CAYÓ 0,15pp el mismo día en que la encuesta online lo puso en 10%. El precio sigue quedando ENTRE los dos métodos, por encima del 4% a 4,7% del teléfono y del presencial y por debajo del 10% de internet, y cerca del piso de su propia serie: 84 de los 88 días tuvieron un valor igual o superior.`,

  'quadroComparativo[3].m': `1,15% (vol USD 5,62M), ${S}`,
  'quadroComparativo[3].t':
    `CAYÓ 0,10pp, y la distancia entre encuesta y precio AUMENTÓ el mismo día en que tuvo su mejor segunda vuelta de la ventana. Es la mayor distancia entre las dos magnitudes en todo el pelotón.`,

  'quadroComparativo[4].m': `0,45% (vol USD 5,05M), ${S}`,
  'quadroComparativo[4].t':
    `ESTANCADO en 0,45%, POR DEBAJO del corte de 0,5% que el panel usa para separar precio de ruido. La lectura sobre él sigue suspendida mientras esté en esa franja.`,

  'quadroComparativo[5].m': `sin número publicado en esta ronda, ver la observación`,
  'quadroComparativo[5].t':
    `ESTE PANEL NO PUBLICA NÚMERO PARA ESTE CONTRATO HOY, y la razón es el propio dato: es el más delgado entre los seguidos, con USD 83 mil de volumen acumulado, y las lecturas de hoy no se sostuvieron entre sí. AFOS solo publica un precio que dos lecturas independientes confirmen, y este no confirmó. El último valor confirmado sigue siendo el del 9/Ago, 3,60%.`,

  cruzamento:
    `EL DÍA TRAJO ENCUESTAS Y TRAJO PRECIO, Y LOS DOS APUNTAN HACIA LADOS DISTINTOS. Los precios de esta página son de la ${S}, confirmados por dos lecturas independientes tomadas con ocho minutos de intervalo. SALIERON DOS NACIONALES, y lo que muestran juntas vale más que cada una por separado. BTG/Nexus, telefónica, n=2.001, da una primera vuelta de 40% x 35% y una segunda de 47% x 44%. Palver, que estrena en el panel con n=5.000 y cuestionario por internet, da 44% x 40% y EMPATE en 46% x 46%. Las dos midieron la misma semana. LO PRIMERO QUE HAY QUE REGISTRAR ES EL RANGO, NO EL PUNTO: sumando las cuatro nacionales desde el 5/Ago, Lula va de 39% a 44% y Flávio va de 30% a 40%. La incertidumbre de medición está concentrada en el segundo colocado, con el doble de amplitud que el primero, y en la segunda vuelta la distancia entre ellos va de 0pp a 5,5pp según la casa. Elegir una encuesta es elegir una conclusión, y por eso el panel publica el conjunto. LO SEGUNDO ES UN EFECTO DE MÉTODO DECLARADO POR LA PROPIA CASA QUE LO PRODUJO. Renan Santos aparece con 4% en Quaest presencial, 4,7% en Ideia por teléfono, 4% en BTG/Nexus por teléfono y 10% en Palver por internet. Palver evaluó que el formato digital pudo haber impulsado su desempeño, ya que mantiene una base activa en ese entorno, e informó que prueba enfoques para reducir ese efecto. Su precio, 7,65%, queda ENTRE los dos métodos, y CAYÓ 0,15pp el mismo día en que la encuesta online lo puso en su techo: 84 de los 88 días de la serie tuvieron un valor igual o superior. LO TERCERO ES EL MECANISMO DE LA DIFERENCIA, Y SE INVIRTIÓ EN VEINTICUATRO HORAS. La distancia entre los dos primeros se estrechó de nuevo, a +36,25pp contra +36,55pp de ayer, y en la ventana desde el 3/Ago cayó en seis de las siete jornadas, desde +38,90pp. Pero AYER se estrechó porque el LÍDER cedió 1,00pp con el segundo estancado; HOY se estrechó porque el SEGUNDO subió 0,30pp con el líder estancado. El número se mueve hacia el mismo lado por caminos opuestos, y tratar los dos días como la misma tendencia borraría la diferencia. Flávio fue el único nombre del pelotón que subió en la lectura de hoy. LO CUARTO ES DE DIRECCIÓN ENTRE INSTRUMENTOS: en la semana en que la diferencia de mercado se estrechó, la de BTG/Nexus se ABRIÓ dentro de su propia casa, de 4pp a 5pp en la primera vuelta y de 1pp a 3pp en la segunda. Dos instrumentos, la misma disputa, sentidos opuestos, y el panel no dice cuál está en lo cierto. LO QUINTO ES LA APROBACIÓN, que empeoró en las dos lecturas de hoy y amplió la dispersión: 46% x 49% en BTG/Nexus, contra 47% x 48% en la propia ronda del 3/Ago, y 45% x 55% en Palver. En cinco lecturas de ocho días el saldo va de 1pp positivo a 10pp negativo y la desaprobación aislada va de 47% a 55%. Antes el SIGNO del saldo ya dependía de la casa; ahora el TAMAÑO también depende.`,
})
