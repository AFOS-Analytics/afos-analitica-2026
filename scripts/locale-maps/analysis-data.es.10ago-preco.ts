/**
 * Mapa ES de 10/Ago (rodada do PREÇO) para analysis-data.json.
 * Convenções: vírgula decimal e ponto de milhar. "estancado", nunca "parado".
 */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/es/glossary#${id})`
const S = 'lectura confirmada del 10/Ago, 21:32 BRT (11/Ago, 00:32 UTC)'

construir('analysis-data', 'es', {
  'cards.sentimento.text1':
    `A 55 días de la ${G('primera vuelta', 'primeiro-turno')}, el día trajo encuestas y trajo precio, y los dos apuntan hacia lados distintos. Dos nacionales fueron publicadas el 10/Ago: BTG/Nexus (n=2.001, telefónica, campo del 7 al 9/Ago, margen 2pp, BR-08428/2026), con 40% x 35% en la primera vuelta y 47% x 44% en la segunda, y el estreno de Palver (n=5.000, cuestionario por internet, margen 3pp, BR-06596/2026), con 44% x 40% y empate en 46% x 46%. Los precios de este panel son de la ${S}, confirmados por dos lecturas independientes.`,

  'cards.sentimento.polymarket':
    `Precios de la ${S}: Lula 63,50% (vol USD 8,20M acumulado), Flávio 27,25% (vol USD 8,11M), Renan Santos 7,65% (vol USD 9,32M), Caiado 1,15% (vol USD 5,62M), Zema 0,45% (vol USD 5,05M) y Haddad 0,15% (vol USD 6,98M). Volumen total del libro presidencial en USD 121,85M. EL MECANISMO DE LA DIFERENCIA SE INVIRTIÓ EN VEINTICUATRO HORAS, y ese es el registro del día: la distancia entre los dos primeros se estrechó a +36,25pp, contra +36,55pp de ayer, pero AYER se estrechó porque el LÍDER cedió 1,00pp con el segundo estancado, y HOY porque el SEGUNDO subió 0,30pp con el líder estancado. El número se mueve hacia el mismo lado por caminos opuestos. Flávio fue el único nombre del pelotón que subió. En la ventana desde el 3/Ago la diferencia cayó en seis de las siete jornadas, desde +38,90pp, con un día estancado. EL CONTRASTE DE TARCÍSIO SIGUE SIENDO EL MÁS EXTREMO DEL LIBRO: USD 13,90M acumulados, el mayor volumen de todo el mercado presidencial, con el precio en 0,05%. Volumen alto con probabilidad en el piso es convicción ya descontada, no movimiento.`,

  'cards.bancoMaster.text3':
    `Ninguna de las dos encuestas nacionales del 10/Ago prueba el caso. Y ESTE PANEL NO PUBLICA NÚMERO PARA EL CONTRATO DE DESTITUCIÓN DE UN MINISTRO DEL ${G('STF', 'stf')} HOY: es el más delgado entre los seguidos, con USD 83 mil de volumen acumulado, y las lecturas de hoy no se sostuvieron entre sí. AFOS solo publica un precio que dos lecturas independientes confirmen. El último valor confirmado sigue siendo el del 9/Ago, 3,60%.`,

  'cards.stf.analise':
    `ESTE PANEL NO PUBLICA NÚMERO PARA EL CONTRATO DE DESTITUCIÓN HOY, y la razón está en el propio dato. Con USD 83 mil de volumen acumulado, es el más delgado entre los seguidos, y las lecturas de hoy no se sostuvieron entre sí. AFOS solo publica un precio que dos lecturas independientes confirmen, tomadas con ocho minutos de intervalo, y este no confirmó. El último valor confirmado sigue siendo el del 9/Ago, 3,60%. LA SALVEDAD SE REPITE A PROPÓSITO, porque este es el último lugar donde alguien debería buscar confirmación de una tesis política: en un contrato de este tamaño, una variación de medio punto cuesta menos dinero que cualquier otra del panel. EN EL PLANO DE LOS HECHOS, sigue valiendo la decisión de Dino que ordenó a la Policía Federal investigar R$ 55,4 millones en enmiendas Pix señaladas por el TCU, con el vice del segundo colocado, el presidente de la Cámara y un exlíder del ${G('PT', 'pt')} en el Senado en la misma lista. El panel registra a los tres juntos porque separarlos sería elegir un lado de la misma decisión. El 10/Ago no hubo acto judicial nuevo en el caso, y lo que apareció fue cobertura de prensa sobre el Banco Master, sin decisión asociada.`,
})
