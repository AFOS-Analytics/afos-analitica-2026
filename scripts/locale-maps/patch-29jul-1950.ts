/**
 * Aplica aos mapas derivados as frases NOVAS do rebaseline de 19:50, em EN e ES.
 *
 * A derivação (derive-29jul-1950.ts) já acertou os números. Falta o que é texto
 * novo: trava em 3 rodadas, Michelle como faixa, o enquadramento do vídeo de IA,
 * a data do ato do Mendonça, o aval do Tarcísio e a inversão do STF.
 *
 * Roda e imprime o que NÃO casou, para iterar.
 */
import { readFileSync, writeFileSync } from 'fs'

type Par = [string, string]

const EN: Par[] = [
  // ---- trava em 3 rodadas
  ['Capture note: the double-reading guard REJECTED the first round over a 1.00pp divergence in Renan\'s third place and APPROVED the second with no divergence at all, four readings in total across sixteen minutes, so every price enters firm and there is no range.',
   'Capture note: the double-reading guard ran THREE times today. It rejected the first round over a 1.00pp divergence in Renan Santos\'s third place, approved the second with no divergence at all, and on the third, run at 19:50 to check the market before the editorial close, it rejected again, this time ONLY on Michelle Bolsonaro\'s book, which swung between 0.35% and 0.55%. Every other price repeated and enters FIRM; Michelle\'s enters as a declared RANGE.'],
  ['Cross-reading with live [Polymarket](/en/glossary#polymarket) Jul 29, 22:50 UTC: the double-reading guard REJECTED the first round over a 1.00pp divergence in Renan Santos\'s third place and APPROVED the second with no divergence at all, so every price enters firm and there is no range in this update.',
   'Cross-reading with live [Polymarket](/en/glossary#polymarket) Jul 29, 22:50 UTC: the double-reading guard ran THREE times today. It rejected the first round over a 1.00pp divergence in Renan Santos\'s third place, approved the second, and on the third, at 19:50, rejected again, this time ONLY on Michelle Bolsonaro\'s book, which swung between 0.35% and 0.55%. Every other price enters firm; Michelle\'s enters as a RANGE.'],
  ['The double-reading guard REJECTED the first round over a 1.00pp divergence in Renan Santos\'s third place, from 62.50% to 61.50%, and APPROVED the second round with no divergence at all in the five electoral books.',
   'The double-reading guard ran THREE times today. It rejected the first round over a 1.00pp divergence in Renan Santos\'s third place, from 62.50% to 61.50%, approved the second with no divergence at all in the five electoral books, and on the third, run at 19:50 to check the market before the editorial close, rejected again, this time ONLY on Michelle Bolsonaro\'s book, which swung between 0.35% and 0.55%.'],
  ['CAPTURE NOTE: the double-reading guard REJECTED the first round over a 1.00pp divergence in Renan Santos\'s third place (62.50% against 61.50%) and APPROVED the second round with no divergence at all in the five electoral books.',
   'CAPTURE NOTE: the double-reading guard ran THREE times today. It rejected the first round over a 1.00pp divergence in Renan Santos\'s third place (62.50% against 61.50%), approved the second with no divergence at all, and on the third, at 19:50, rejected again, this time ONLY on Michelle Bolsonaro\'s book (0.35% to 0.55%).'],
  ['There were four readings in total, across sixteen minutes, and the 61.50% published is the value that repeated in the last three.',
   'The 61.50% published is the value that repeated in the readings after the first rejection. Every price enters FIRM, with one declared exception: Michelle\'s enters as a RANGE.'],
  ['Capture Jul 29, 22:50 UTC: guard REJECTED in the first round over 1.00pp in Renan\'s third place and APPROVED in the second with no divergences.',
   'Capture Jul 29, 22:50 UTC, on the guard\'s third round, which confirmed every book except Michelle\'s.'],
  // ---- STF: imobilidade -> direção
  ['The market on impeachment of an [STF](/en/glossary#stf) justice rose 0.05pp to 3.35% (vol USD 83,000), which in practice describes a motionless book. And the stillness is the record that matters, because this was the week\'s densest day in institutional facts:',
   'The market on impeachment of an [STF](/en/glossary#stf) justice ROSE 0.55pp to 3.35% (vol USD 83,000), and here the record that matters is the DIRECTION, not the size: the price moved up on the week\'s densest day in institutional facts, after falling 0.60pp the day before. The day carried'],
  ['RISES 0.05pp to 3.35%, which in practice describes a motionless book on the week\'s densest day in institutional facts.',
   'RISES 0.55pp to 3.35%, meaning the price moved UP on the week\'s densest day in institutional facts, after falling 0.60pp the day before.'],
  ['INSTITUTIONAL: the market on impeachment of an [STF](/en/glossary#stf) justice rose 0.05pp, to 3.35% (vol USD 83,000), on the week\'s densest day in institutional facts, which describes a practically motionless book; with USD 83,000 against USD 116.49M in the presidential book, neither the rise nor the stillness sustains a narrative.',
   'INSTITUTIONAL: the market on impeachment of an [STF](/en/glossary#stf) justice rose 0.55pp, to 3.35% (vol USD 83,000), on the week\'s densest day in institutional facts, and the direction followed the pile-up; with USD 83,000 against USD 116.49M in the presidential book, the size sustains no narrative, only the direction is on the record.'],
  ['Faced with all of that, real money did not move.',
   'And here the pattern this panel has recorded since June bends a little: faced with that pile-up, real money DID move, and upward.'],
  ['rose 0.05pp to 3.35%', 'rose 0.55pp to 3.35%'],
  ['rose 0.05pp, to 3.35%', 'rose 0.55pp, to 3.35%'],
  ['ROSE 0.05pp to 3.35%', 'ROSE 0.55pp to 3.35%'],
  ['a 0.05pp change in it sustains no narrative in any direction',
   '0.55pp in it is very little money'],
  ['0.05pp in a book of USD 83,000, against USD 116.49M in the presidential book, is stillness, not repricing.',
   '0.55pp in a book of USD 83,000, against USD 116.49M in the presidential book, is very little money, and does not license talk of repriced risk.'],
  ['A change that size on that volume is practically stillness, and the panel attributes it to NOTHING.',
   'On a volume that size, 0.55pp costs very little money, and the panel attributes the move to NOTHING in particular.'],
  ['moved 0.05pp in a book of USD 83,000', 'moved 0.55pp in a book of USD 83,000'],
  ['a 0.05pp move on USD 83,000 is practically stillness', '0.55pp on USD 83,000 is very little money'],
  ['(up 0.05pp)', '(UP 0.55pp)'],
  ['neither the rise nor the stillness sustains a narrative', 'the size sustains no narrative, only the direction is on the record'],
  ['Real money kept treating all of that as institutional friction, not as risk of removal.',
   'Real money moved in the same direction as the pile-up, in a contract far too small to turn that into repriced removal risk.'],
  ['What real money did was keep treating the whole set as institutional friction, not as risk of a justice being removed.',
   'What real money did was move in the direction of the pile-up, in a contract too small to turn that into priced removal risk.'],
  ['the week\'s densest day produced a 0.05pp move in a book of USD 83,000, which is next to nothing',
   'the week\'s densest day was the only one where real money followed the direction: impeachment of an STF justice rose 0.55pp, to 3.35%, in a book of USD 83,000, where that is very little money'],
  ['it is stillness, not repricing', 'it is very little money, not repricing'],
  // ---- Michelle faixa
  ['Michelle 0.45% (flat, vol USD 9.34M)', 'Michelle in a RANGE of 0.35% to 0.55%, not confirmed by the guard (vol USD 9.34M)'],
  ['Michelle stayed at 0.45%, Jair at 1.05%', 'Michelle had no price confirmed by the guard and enters as a RANGE of 0.35% to 0.55%, Jair stayed at 1.05%'],
  // ---- vídeo de IA
  ['which puts the campaign piece in contradiction with the father',
   'and Moraes had already said that, in that scenario, the piece may amount to a deep fake barred by electoral law, with liability for Flávio and the party'],
  ['which puts his campaign piece in contradiction with his own father',
   'and Moraes had already said that, in that scenario, the piece may amount to a deep fake barred by electoral law, with liability for him and the party'],
  ['and argued that he could not have done so because he is barred from receiving visitors',
   'and argued that he could not have done so because his visits are suspended for thirty days and Flávio is barred from visiting him for ninety, adding that he DOES NOT OBJECT to relatives producing this kind of content, a practice the filing calls notorious and continuous'],
  // ---- Tarcísio
  ['Tarcísio de Freitas cleared allies to back his candidacy', 'Tarcísio de Freitas freed allies and base mayors, on Jul 28, to back his candidacy'],
  ['Tarcísio de Freitas cleared allies to back his presidential candidacy', 'Tarcísio de Freitas freed allies and base mayors, on Jul 28, to back his presidential candidacy'],
  ['Tarcísio de Freitas cleared allies to back Caiado\'s presidential candidacy (CNN Brasil, Jul 29).',
   'Tarcísio de Freitas freed allies and base mayors, on Jul 28, to back Caiado\'s presidential candidacy, while still saying his own candidate remains Flávio (CNN Brasil).'],
  ['he cleared allies to back Caiado in the presidential race (CNN Brasil).',
   'on Jul 28 he freed allies and base mayors to back Caiado, while still saying his own candidate remains Flávio (CNN Brasil).'],
  ['(CNN Brasil, Jul 29)', '(CNN Brasil, Jul 28)'],
  // ---- Mendonça
  ['appeared on Wednesday in Estadão as well, described as authorised international cooperation. In other words, the reporting is no longer single-sourced. Yesterday the panel recorded the item attributed to one outlet and without an independent second source; today that caveat falls away.',
   'appeared on Wednesday across several newsrooms (Gazeta do Povo, Imirante, Diario de Pernambuco, Tribuna da Internet), so the reporting is no longer single-sourced. The correction is the date: the decision was SIGNED IN MAY and only became public on Jul 28. The route is international cooperation under a mutual legal assistance treaty, run by the Justice Ministry\'s asset recovery department, and among the targets cited is a yacht valued at R$ 500 million. Yesterday the panel treated the act as if it were from the previous day; today the correct date goes on the record.'],
  ['appeared on Wednesday in Estadão as well. The single-source caveat the panel recorded yesterday therefore falls away.',
   'appeared on Wednesday across several newsrooms, and the decision itself is from MAY, made public only on Jul 28, under a mutual legal assistance treaty run by the Justice Ministry\'s asset recovery department.'],
  ['appeared on Wednesday in Estadão as well, so it is no longer single-sourced.',
   'appeared on Wednesday across several newsrooms, and with a date correction that matters: the decision was signed in MAY and only became public on Jul 28.'],
  ['now with asset tracing abroad confirmed by two outlets',
   'now with asset tracing abroad confirmed by several newsrooms, in a decision signed in May and revealed on Jul 28'],
  // ---- STF no subtitle e no cruzamento (a inversão de "apenas 0,05pp")
  ['Even so, the market on impeachment of an [STF](/en/glossary#stf) justice rose only 0.05pp, to 3.35%, in a book of USD 83,000.',
   'And the one market that did follow that pile-up was impeachment of an [STF](/en/glossary#stf) justice, which ROSE 0.55pp, to 3.35%, in a book of USD 83,000, where 0.55pp is very little money.'],
  ['Even with all of that piling up, the market on impeachment of an STF justice rose only 0.05pp, to 3.35%, in a book of USD 83,000.',
   'And the one market that followed that pile-up was impeachment of an STF justice, which ROSE 0.55pp, to 3.35%, in a book of USD 83,000, where 0.55pp is very little money.'],
  // ---- Flávio: 2º lugar deixou de estar parado, subiu 0,50pp
  ['He stayed flat at 78.50% in the first-round second-place book for a second session, which means his runoff position remains settled and not in dispute.',
   'He rose 0.50pp in the first-round second-place book, to 78.50%, which means his runoff position remains settled and not in dispute.'],
  ['he stayed FLAT at 78.50% in first-round second place, a second session with no change, and FELL 1.50pp',
   'he ROSE 0.50pp in first-round second place, to 78.50%, and FELL 1.50pp'],
  ['he stayed FLAT at 78.50% in first-round second place for a second session and FELL 1.50pp',
   'he ROSE 0.50pp in first-round second place, to 78.50%, and FELL 1.50pp'],
  ['FLAT at 78.50% in first-round second place for a second session and DOWN 1.50pp',
   'UP 0.50pp in first-round second place, to 78.50%, and DOWN 1.50pp'],
  ['he stayed flat at 78.50% in first-round second place and fell 1.50pp',
   'he rose 0.50pp in first-round second place, to 78.50%, and fell 1.50pp'],
  ['Flávio 78.50% (flat)', 'Flávio 78.50% (up 0.50pp)'],
  ['A name that stays still in the second-place contract and gives way in the third-place one',
   'A name that RISES in the second-place contract and gives way in the third-place one'],
  ['A name motionless in the second-place contract and falling in the third-place one',
   'A name rising in the second-place contract and falling in the third-place one'],
  // ---- Haddad: 0,30pp e não 0,35pp (o 0,35pp do MDB é legítimo, fica)
  ['ROSE 0.35pp in first-round second place, to 1.15%', 'ROSE 0.30pp in first-round second place, to 1.15%'],
  ['RISES 0.35pp in the first-round second-place book, to 1.15%', 'RISES 0.30pp in the first-round second-place book, to 1.15%'],
  ['ROSE 0.35pp, to 1.15%', 'ROSE 0.30pp, to 1.15%'],
  ['rose 0.35pp, to 1.15%', 'rose 0.30pp, to 1.15%'],
  ['Haddad 1.15% (up 0.35pp)', 'Haddad 1.15% (up 0.30pp)'],
  ['1.15% (up 0.35pp) | not tested', '1.15% (up 0.30pp) | not tested'],
  // ---- ajustes finais apontados pelo gate numérico
  ['Decisive method caveat: with USD 83,000 in accumulated volume against USD 116.49M in the presidential book, the size sustains no narrative, only the direction is on the record.',
   'Decisive method caveat: with USD 83,000 in accumulated volume against USD 116.49M in the presidential book, 0.55pp in that book is very little money, so what is on the record is the direction and not the size.'],
  // só o cruzamento (sem link de glossário no STF), para não casar no subtitle
  ['that followed that pile-up was impeachment of an STF justice, which ROSE 0.55pp, to 3.35%, in a book of USD 83,000, where 0.55pp is very little money.',
   'that followed that pile-up was impeachment of an STF justice, which ROSE 0.55pp to 3.35%, in a book of USD 83,000, after falling 0.60pp the day before.'],
]

const ES: Par[] = [
  ['Nota de captura: el candado de doble lectura RECHAZÓ la primera ronda por una divergencia de 1,00pp en el tercer lugar de Renan y APROBÓ la segunda sin ninguna divergencia, cuatro lecturas en total a lo largo de dieciséis minutos, así que todos los precios entran firmes y no hay rango.',
   'Nota de captura: el candado de doble lectura corrió TRES veces hoy. Rechazó la primera ronda por una divergencia de 1,00pp en el tercer lugar de Renan Santos, aprobó la segunda sin ninguna divergencia, y en la tercera, hecha a las 19:50 para revisar el mercado antes del cierre editorial, rechazó de nuevo, ahora SOLO en el libro de Michelle Bolsonaro, que osciló entre 0,35% y 0,55%. Todos los demás precios se repitieron y entran FIRMES; el de Michelle entra como RANGO declarado.'],
  ['Cruce con [Polymarket](/es/glossary#polymarket) en vivo del 29 de julio, 22:50 UTC: el candado de doble lectura RECHAZÓ la primera ronda por una divergencia de 1,00pp en el tercer lugar de Renan Santos y APROBÓ la segunda sin ninguna divergencia, así que todos los precios entran firmes y no hay rango en esta actualización.',
   'Cruce con [Polymarket](/es/glossary#polymarket) en vivo del 29 de julio, 22:50 UTC: el candado de doble lectura corrió TRES veces hoy. Rechazó la primera por una divergencia de 1,00pp en el tercer lugar de Renan Santos, aprobó la segunda, y en la tercera, a las 19:50, rechazó de nuevo, ahora SOLO en el libro de Michelle Bolsonaro, que osciló entre 0,35% y 0,55%. Los demás precios entran firmes; el de Michelle entra como RANGO.'],
  ['El candado de doble lectura RECHAZÓ la primera ronda por una divergencia de 1,00pp en el tercer lugar de Renan Santos, de 62,50% a 61,50%, y APROBÓ la segunda ronda sin ninguna divergencia en los cinco libros electorales.',
   'El candado de doble lectura corrió TRES veces hoy. Rechazó la primera ronda por una divergencia de 1,00pp en el tercer lugar de Renan Santos, de 62,50% a 61,50%, aprobó la segunda sin ninguna divergencia en los cinco libros electorales, y en la tercera, hecha a las 19:50 para revisar el mercado antes del cierre editorial, rechazó de nuevo, ahora SOLO en el libro de Michelle Bolsonaro, que osciló entre 0,35% y 0,55%.'],
  ['NOTA DE CAPTURA: el candado de doble lectura RECHAZÓ la primera ronda por una divergencia de 1,00pp en el tercer lugar de Renan Santos (62,50% contra 61,50%) y APROBÓ la segunda ronda sin ninguna divergencia en los cinco libros electorales.',
   'NOTA DE CAPTURA: el candado de doble lectura corrió TRES veces hoy. Rechazó la primera por una divergencia de 1,00pp en el tercer lugar de Renan Santos (62,50% contra 61,50%), aprobó la segunda sin ninguna divergencia, y en la tercera, a las 19:50, rechazó de nuevo, ahora SOLO en el libro de Michelle Bolsonaro (0,35% a 0,55%).'],
  ['Fueron cuatro lecturas en total, a lo largo de dieciséis minutos, y el 61,50% publicado es el valor que se repitió en las tres últimas.',
   'El 61,50% publicado es el valor que se repitió en las lecturas siguientes al primer rechazo. Todos los precios entran FIRMES, con una excepción declarada: el de Michelle entra como RANGO.'],
  ['Captura del 29 de julio, 21:47 UTC: el candado RECHAZÓ la primera ronda por 1,00pp en el tercer lugar de Renan y APROBÓ la segunda sin divergencias.',
   'Captura del 29 de julio, 22:50 UTC, en la tercera ronda del candado, que confirmó todos los libros menos el de Michelle.'],
  ['Captura del 29 de julio, 22:50 UTC: el candado RECHAZÓ la primera ronda por 1,00pp en el tercer lugar de Renan y APROBÓ la segunda sin divergencias.',
   'Captura del 29 de julio, 22:50 UTC, en la tercera ronda del candado, que confirmó todos los libros menos el de Michelle.'],
  // ---- STF
  ['El mercado de destitución de un ministro del [STF](/es/glossary#stf) subió 0,05pp y llegó a 3,35% (vol USD 83.000), lo que en la práctica describe un libro inmóvil. Y la inmovilidad es el registro que interesa, porque este fue el día más denso de la semana en hecho institucional:',
   'El mercado de destitución de un ministro del [STF](/es/glossary#stf) SUBIÓ 0,55pp y llegó a 3,35% (vol USD 83.000), y aquí el registro que interesa es la DIRECCIÓN, no el tamaño: el precio se movió hacia arriba en el día más denso de la semana en hecho institucional, después de haber caído 0,60pp la víspera. El día trajo'],
  ['SUBE 0,05pp a 3,35%, lo que en la práctica describe un libro inmóvil en el día más denso de la semana en hecho institucional.',
   'SUBE 0,55pp a 3,35%, es decir, el precio se movió HACIA ARRIBA en el día más denso de la semana en hecho institucional, después de caer 0,60pp la víspera.'],
  ['INSTITUCIONAL: el mercado de destitución de un ministro del [STF](/es/glossary#stf) subió 0,05pp, a 3,35% (vol USD 83.000), en el día más denso de la semana en hecho institucional, lo que describe un libro prácticamente inmóvil; con USD 83.000 contra USD 116,49M del presidencial, ni el alza ni la inmovilidad sostienen una narrativa.',
   'INSTITUCIONAL: el mercado de destitución de un ministro del [STF](/es/glossary#stf) subió 0,55pp, a 3,35% (vol USD 83.000), en el día más denso de la semana en hecho institucional, y la dirección acompañó la acumulación; con USD 83.000 contra USD 116,49M del presidencial, el tamaño no sostiene narrativa, solo la dirección es registrable.'],
  ['Frente a todo eso, el dinero real no se movió.',
   'Y aquí el patrón que este panel registra desde junio se quiebra un poco: frente a esa acumulación, el dinero real SÍ se movió, y hacia arriba.'],
  ['subió 0,05pp y llegó a 3,35%', 'subió 0,55pp y llegó a 3,35%'],
  ['subió 0,05pp, a 3,35%', 'subió 0,55pp, a 3,35%'],
  ['SUBIÓ 0,05pp y llegó a 3,35%', 'SUBIÓ 0,55pp y llegó a 3,35%'],
  ['una variación de 0,05pp en él no sostiene ninguna narrativa en ninguna dirección',
   '0,55pp en él es poquísimo dinero'],
  ['0,05pp en un libro de USD 83.000, contra USD 116,49M del presidencial, es inmovilidad, no revalorización.',
   '0,55pp en un libro de USD 83.000, contra USD 116,49M del presidencial, es poquísimo dinero, y no autoriza hablar de riesgo revalorizado.'],
  ['Una variación de ese tamaño en ese volumen es prácticamente inmovilidad, y el panel NO la atribuye a nada.',
   'En un volumen de ese tamaño, 0,55pp cuesta muy poco dinero, y el panel NO atribuye el movimiento a nada en particular.'],
  ['movió 0,05pp en un libro de USD 83.000', 'movió 0,55pp en un libro de USD 83.000'],
  ['una variación de 0,05pp en USD 83.000 es prácticamente inmovilidad', '0,55pp en USD 83.000 es poquísimo dinero'],
  ['(alza 0,05pp)', '(ALZA de 0,55pp)'],
  ['ni el alza ni la inmovilidad sostienen una narrativa', 'el tamaño no sostiene narrativa, solo la dirección es registrable'],
  ['El dinero real siguió tratando todo eso como fricción institucional, no como riesgo de destitución.',
   'El dinero real se movió en la misma dirección que la acumulación, en un contrato demasiado pequeño para convertir eso en riesgo de destitución revalorizado.'],
  ['Lo que el dinero real hizo fue seguir tratando el conjunto como fricción institucional, y no como riesgo de destitución de un ministro.',
   'Lo que el dinero real hizo fue moverse en la dirección de la acumulación, en un contrato demasiado pequeño para convertir eso en riesgo de destitución descontado.'],
  ['el día más denso de la semana produjo un movimiento de 0,05pp en un libro de USD 83.000, es decir casi nada',
   'el día más denso de la semana fue el único en que el dinero real acompañó la dirección: la destitución de un ministro del STF subió 0,55pp, a 3,35%, en un libro de USD 83.000, donde eso es poquísimo dinero'],
  ['es inmovilidad, no revalorización', 'es poquísimo dinero, no revalorización'],
  // ---- Michelle
  ['Michelle 0,45% (estancada, vol USD 9,34M)', 'Michelle en un RANGO de 0,35% a 0,55%, no confirmado por el candado (vol USD 9,34M)'],
  ['Michelle 0,45% (estable, vol USD 9,34M)', 'Michelle en un RANGO de 0,35% a 0,55%, no confirmado por el candado (vol USD 9,34M)'],
  ['Michelle quedó en 0,45%, Jair en 1,05%', 'Michelle no tuvo precio confirmado por el candado y entra como RANGO de 0,35% a 0,55%, Jair quedó en 1,05%'],
  // ---- vídeo de IA
  ['lo que pone la pieza de campaña en contradicción con el padre',
   'y Moraes ya había dicho que, en esa hipótesis, la pieza puede configurar un deep fake vedado por la ley electoral, con responsabilización de Flávio y del partido'],
  ['lo que pone su pieza de campaña en contradicción con el propio padre',
   'y Moraes ya había dicho que, en esa hipótesis, la pieza puede configurar un deep fake vedado por la ley electoral, con responsabilización de él y del partido'],
  ['y sostuvo que no podría haberlo hecho por estar prohibido de recibir visitas',
   'y sostuvo que no podría haberlo hecho por estar con las visitas suspendidas por treinta días y con Flávio prohibido de visitarlo por noventa, agregando que NO SE OPONE a que familiares produzcan ese tipo de contenido, práctica que la petición llama notoria y continua'],
  // ---- Tarcísio
  ['Tarcísio de Freitas dio el aval para que aliados apoyen su candidatura', 'Tarcísio de Freitas liberó, el 28 de julio, a aliados y alcaldes de la base para que apoyen su candidatura'],
  ['Tarcísio de Freitas dio el aval para que aliados apoyen su candidatura presidencial', 'Tarcísio de Freitas liberó, el 28 de julio, a aliados y alcaldes de la base para que apoyen su candidatura presidencial'],
  ['Tarcísio de Freitas dio el aval para que aliados apoyen la candidatura presidencial de Caiado (CNN Brasil, 29 de julio).',
   'Tarcísio de Freitas liberó, el 28 de julio, a aliados y alcaldes de la base para que apoyen la candidatura presidencial de Caiado, sin dejar de decir que su propio candidato sigue siendo Flávio (CNN Brasil).'],
  ['dio el aval para que aliados apoyen a Caiado en la carrera presidencial (CNN Brasil).',
   'el 28 de julio liberó a aliados y alcaldes de la base para que apoyen a Caiado, sin dejar de decir que su propio candidato sigue siendo Flávio (CNN Brasil).'],
  ['(CNN Brasil, 29 de julio)', '(CNN Brasil, 28 de julio)'],
  // ---- Mendonça
  ['apareció este miércoles también en Estadão, con la información descrita como cooperación internacional autorizada. Es decir, la investigación periodística dejó de tener fuente única. Ayer el panel registró el dato con atribución a un medio y sin segunda fuente independiente; hoy esa advertencia cae.',
   'apareció este miércoles en varias redacciones (Gazeta do Povo, Imirante, Diario de Pernambuco, Tribuna da Internet), así que la investigación periodística dejó de tener fuente única. La corrección es la fecha: la decisión fue FIRMADA EN MAYO y solo se hizo pública el 28 de julio. La vía es la de cooperación internacional por acuerdo de asistencia jurídica mutua, conducida por el Departamento de Recuperación de Activos del Ministerio de Justicia, y entre los objetivos citados está un yate valuado en R$ 500 millones. Ayer el panel trató el acto como si fuera de la víspera; hoy la fecha correcta entra en el registro.'],
  ['apareció este miércoles también en Estadão. La advertencia de fuente única que el panel registró ayer, por lo tanto, cae.',
   'apareció este miércoles en varias redacciones, y la decisión en sí es de MAYO, hecha pública solo el 28 de julio, por cooperación internacional vía acuerdo de asistencia jurídica mutua.'],
  ['apareció este miércoles también en Estadão, así que dejó de tener fuente única.',
   'apareció este miércoles en varias redacciones, y con una corrección de fecha que importa: la decisión fue firmada en MAYO y solo se hizo pública el 28 de julio.'],
  ['ahora con rastreo patrimonial en el exterior confirmado por dos medios',
   'ahora con rastreo patrimonial en el exterior confirmado por varias redacciones, en una decisión firmada en mayo y revelada el 28 de julio'],
  // ---- STF no subtitle e no cruzamento
  ['Aun así, el mercado de destitución de un ministro del [STF](/es/glossary#stf) subió apenas 0,05pp, a 3,35%, en un libro de USD 83.000.',
   'Y el único mercado que acompañó esa acumulación fue el de destitución de un ministro del [STF](/es/glossary#stf), que SUBIÓ 0,55pp, a 3,35%, en un libro de USD 83.000, donde 0,55pp es poquísimo dinero.'],
  ['Aun con toda esa acumulación, el mercado de destitución de un ministro del STF subió apenas 0,05pp y llegó a 3,35%, en un libro de USD 83.000.',
   'Y el único mercado que acompañó esa acumulación fue el de destitución de un ministro del STF, que SUBIÓ 0,55pp y llegó a 3,35%, en un libro de USD 83.000, donde 0,55pp es poquísimo dinero.'],
  // ---- Flávio: 2º lugar subió 0,50pp
  ['Quedó estancado en 78,50% en el libro de segundo lugar de la primera vuelta por segunda jornada, es decir, su posición de segunda vuelta sigue consolidada y no en disputa.',
   'Subió 0,50pp en el libro de segundo lugar de la primera vuelta, a 78,50%, es decir, su posición de segunda vuelta sigue consolidada y no en disputa.'],
  ['quedó ESTANCADO en 78,50% en el segundo lugar de la [primera vuelta](/es/glossary#primeiro-turno) por segunda jornada y CAYÓ 1,50pp',
   'SUBIÓ 0,50pp en el segundo lugar de la [primera vuelta](/es/glossary#primeiro-turno), a 78,50%, y CAYÓ 1,50pp'],
  ['quedó ESTANCADO en 78,50% en el segundo lugar de la primera vuelta por segunda jornada y CAYÓ 1,50pp',
   'SUBIÓ 0,50pp en el segundo lugar de la primera vuelta, a 78,50%, y CAYÓ 1,50pp'],
  ['ESTANCADO en 78,50% en el segundo lugar de la primera vuelta por segunda jornada y BAJA 1,50pp',
   'en ALZA de 0,50pp en el segundo lugar de la primera vuelta, a 78,50%, y BAJA 1,50pp'],
  ['quedó estancado en 78,50% en el segundo lugar de la primera vuelta y cayó 1,50pp',
   'subió 0,50pp en el segundo lugar de la primera vuelta, a 78,50%, y cayó 1,50pp'],
  ['quedó ESTANCADO en 78,50% en el segundo lugar de la primera vuelta, segunda jornada sin cambio, y CAYÓ 1,50pp',
   'SUBIÓ 0,50pp en el segundo lugar de la primera vuelta, a 78,50%, y CAYÓ 1,50pp'],
  ['Flávio 78,50% (estancado)', 'Flávio 78,50% (alza 0,50pp)'],
  ['Un nombre que queda inmóvil en el contrato de segundo colocado y cede en el de tercero',
   'Un nombre que SUBE en el contrato de segundo colocado y cede en el de tercero'],
  ['Un nombre inmóvil en el contrato de segundo colocado y en caída en el de tercero',
   'Un nombre que sube en el contrato de segundo colocado y cae en el de tercero'],
  // ---- Haddad: 0,30pp (o 0,35pp do MDB é legítimo)
  ['SUBIÓ 0,35pp en el segundo lugar de la primera vuelta, a 1,15%', 'SUBIÓ 0,30pp en el segundo lugar de la primera vuelta, a 1,15%'],
  ['SUBE 0,35pp en el libro de segundo lugar de la primera vuelta, a 1,15%', 'SUBE 0,30pp en el libro de segundo lugar de la primera vuelta, a 1,15%'],
  ['subió 0,35pp, a 1,15%', 'subió 0,30pp, a 1,15%'],
  ['SUBIÓ 0,35pp, a 1,15%', 'SUBIÓ 0,30pp, a 1,15%'],
  ['Haddad 1,15% (alza 0,35pp)', 'Haddad 1,15% (alza 0,30pp)'],
  ['1,15% (alza 0,35pp) | no medido', '1,15% (alza 0,30pp) | no medido'],
  // ---- ajustes finais apontados pelo gate numérico
  ['Advertencia de método decisiva: con USD 83.000 de volumen acumulado contra USD 116,49M del presidencial, el tamaño no sostiene narrativa, solo la dirección es registrable.',
   'Advertencia de método decisiva: con USD 83.000 de volumen acumulado contra USD 116,49M del presidencial, 0,55pp en ese libro es poquísimo dinero, así que lo registrable es la dirección y no el tamaño.'],
  ['que SUBIÓ 0,55pp y llegó a 3,35%, en un libro de USD 83.000, donde 0,55pp es poquísimo dinero.',
   'que SUBIÓ 0,55pp y llegó a 3,35%, en un libro de USD 83.000, después de caer 0,60pp la víspera.'],
]
for (const [loc, pares] of [['en', EN], ['es', ES]] as const) {
  const arq = `scripts/locale-maps/_derivado.${loc}.json`
  const mapas = JSON.parse(readFileSync(arq, 'utf-8'))
  const naoCasou: string[] = []
  for (const [de, para] of pares) {
    let n = 0
    for (const m of Object.values(mapas) as Record<string, string>[]) {
      for (const k of Object.keys(m)) {
        if (m[k].includes(de)) { m[k] = m[k].split(de).join(para); n++ }
      }
    }
    if (n === 0) naoCasou.push(de.slice(0, 95))
  }
  writeFileSync(arq, JSON.stringify(mapas, null, 2) + '\n', 'utf-8')
  console.log(`\n${loc.toUpperCase()}: ${pares.length - naoCasou.length}/${pares.length} pares aplicados`)
  if (naoCasou.length) { console.log('  não casaram (ok se for variante inexistente):'); for (const s of naoCasou) console.log('   · ' + s) }
}

// -------- sobras proibidas --------
const PROIBIDO = {
  en: ['0.05pp to 3.35', '0.05pp, to 3.35', 'motionless book', 'sixteen minutes', 'Michelle 0.45%', 'cleared allies', 'in Estadão as well', 'contradiction with the father', 'real money did not move', '(CNN Brasil, Jul 29)'],
  es: ['0,05pp y llegó a 3,35', '0,05pp, a 3,35', 'libro inmóvil', 'dieciséis minutos', 'Michelle 0,45%', 'dio el aval', 'también en Estadão', 'contradicción con el padre', 'dinero real no se movió', '(CNN Brasil, 29 de julio)'],
}
let sujo = 0
for (const loc of ['en', 'es'] as const) {
  const mapas = JSON.parse(readFileSync(`scripts/locale-maps/_derivado.${loc}.json`, 'utf-8'))
  for (const [arq, m] of Object.entries(mapas) as [string, Record<string, string>][]) {
    for (const [k, v] of Object.entries(m)) {
      for (const p of PROIBIDO[loc]) if (v.includes(p)) { console.log(`⚠ [${loc}] ${arq}::${k} ainda tem "${p}"`); sujo++ }
    }
  }
}
console.log(sujo ? `\n⚠ ${sujo} sobra(s) para resolver` : '\n✅ nenhuma sobra proibida')
