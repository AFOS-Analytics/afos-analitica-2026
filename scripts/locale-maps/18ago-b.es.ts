/** Mapa ES de 18/Ago/2026, parte 2: analysis-data e polls-data. */
import { construir } from '../build-locale-json'

construir('analysis-data', 'es', {
  'cards.sentimento.text1': `⛔ El panel NO publica precio nuevo hoy, y el motivo es la propia traba del AFOS: hace dos lecturas separadas por 8 minutos y solo libera si concuerdan dentro de 0,20pp. Corrió CINCO veces entre las 20:30 y las 21:37 BRT del 18 de ago y bloqueó las cinco. Los precios en pantalla son la captura confirmada del 17 de ago, 18:48 BRT.`,
  'cards.sentimento.text2': `🔑 La inestabilidad estaba en los contratos FINOS, no en el líder. En las diez lecturas de la noche el primero quedó en 63,50% todas las veces, amplitud de 0,00pp, y Renan Santos y Ronaldo Caiado tampoco se movieron en el presidencial. Quien discrepó entre muestras fue el segundo, entre 32,45% y 32,75%, y Pablo Marçal, entre 0,65% y 1,15%.`,
  'cards.sentimento.text3': `⚠️ Una amplitud de 0,50pp en un contrato que vale 1% es casi la mitad de su propio valor, y eso es espesor de mercado, no señal electoral: un libro fino se mueve con poco dinero. El panel registra la diferencia en vez de publicar un número que dos lecturas no confirman.`,
  'cards.sentimento.polymarket': `Lectura confirmada del 17 de ago, 18:48 BRT. El 18 de ago la traba bloqueó cinco veces y ningún precio nuevo fue certificado.`,
})

construir('polls-data', 'es', {
  'polymarketComparison.note': `⛔ SIN PRECIO CERTIFICADO EL 18 de ago, y los valores de esta tabla son la captura confirmada del 17 de ago, 18:48 BRT. La traba de captura del AFOS hace dos lecturas separadas por 8 minutos y solo libera si concuerdan dentro de 0,20pp; corrió CINCO veces entre las 20:30 y las 21:37 del 18 de ago y bloqueó las cinco. 🔑 La inestabilidad estaba en los contratos FINOS: en las diez lecturas de la noche el líder quedó en 63,50% todas las veces, con amplitud de 0,00pp, mientras Pablo Marçal fue leído entre 0,65% y 1,15%, o sea 0,50pp en un contrato que vale cerca de 1%. Un libro fino se mueve con poco dinero, así que esto es espesor de mercado y no señal electoral. 📌 ENCUESTAS: ninguna nacional nueva. La última es la Nexus/BTG del 17 de ago, y la Datafolha del 21 de ago será la primera en medir a Marçal.`,

  'polymarketComparison.candidates[0].tendenciaPolymarket': `⛔ SIN LECTURA CONFIRMADA el 18 de ago. En las diez lecturas entre las 20:30 y las 21:37 apareció en 63,50% en TODAS, amplitud de 0,00pp, el contrato más estable del libro, pero la traba certifica la captura entera o ninguna. El valor al lado es el del 17 de ago, 18:48 BRT. ⛔ Sin superlativo: el máximo de la serie de 88 días es 66,50%, del 1 de ago.`,

  'polymarketComparison.candidates[1].tendenciaPolymarket': `⛔ SIN LECTURA CONFIRMADA el 18 de ago. Fue uno de los contratos que bloquearon la certificación: leído entre 32,45% y 32,75% en el presidencial y entre 86,50% y 87,50% en el libro de segundo lugar. ⛔ Sin superlativo: el máximo de la serie de 88 días es 33,20%, del 2 de jun, y ninguna lectura de esta noche lo superó.`,

  'polymarketComparison.candidates[2].tendenciaPolymarket': `⛔ SIN LECTURA CONFIRMADA el 18 de ago. En el presidencial quedó quieto en 3,95% en las diez lecturas; fue en los contratos de POSICIÓN donde se movió, 0,50pp en el de tercer lugar. 📏 El piso de la serie de 88 días se tocó el 18 de ago, con 3,60%.`,

  'polymarketComparison.candidates[3].tendenciaPolymarket': `⛔ SIN LECTURA CONFIRMADA el 18 de ago. Quedó ESTABLE en 0,45% en el presidencial en las diez lecturas, y osciló 0,50pp en el contrato de tercer lugar, entre 37,00% y 37,50%. 📌 La encuesta y el precio siguen discrepando sobre quién es el tercero: la Nexus/BTG del 17 de ago le da 5%, por encima del 4% de Renan Santos.`,

  'polymarketComparison.candidates[4].tendenciaPolymarket': `⛔ SIN LECTURA CONFIRMADA el 18 de ago, y fue el contrato MÁS INESTABLE de la noche: leído entre 0,65% y 1,15%, o sea 0,50pp de amplitud en un contrato que vale cerca de 1%. 🏷️ ESTADO ELECTORAL, actualizado hoy: pidió al tribunal electoral la corrección de su declaración de bienes y el patrimonio declarado cayó de R$ 7,4 mil millones a R$ 149,9 millones, según G1, Valor y O Globo, todos del mismo grupo. Sigue INELEGIBLE hasta 2032, campaña habilitada por medida cautelar y registro aún pendiente. 📅 La Datafolha del 21 de ago es la PRIMERA en medirlo.`,
})
