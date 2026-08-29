/** Rebaseline 14:51 BRT: transforma as traduções de 13:27 em vez de retraduzir. O gate numérico confere. */
import { readFileSync } from 'fs'
import { construir } from '../build-locale-json'

const caminhos = (o: any, pre = '', acc: Record<string, string> = {}) => {
  for (const [k, v] of Object.entries(o)) {
    const p = pre ? pre + (Array.isArray(o) ? `[${k}]` : `.${k}`) : Array.isArray(o) ? `[${k}]` : k
    if (typeof v === 'string') acc[p] = v
    else if (v && typeof v === 'object') caminhos(v, p, acc)
  }
  return acc
}

const BLOQ = {
  en: 'This round publishes no new number for the second-place and third-place contracts of the first round.',
  es: 'Esta ronda no publica número nuevo para los contratos de segundo y tercer lugar de la primera vuelta.',
}

// pares COM CONTEXTO, para nao colidir por substring
const subs: Record<'en' | 'es', [string, string][]> = {
  en: [
    ['confirmed reading of Aug 29, 1:27 PM BRT (4:27 PM UTC)', 'confirmed reading of Aug 29, 2:51 PM BRT (5:51 PM UTC)'],
    ['56.50% (vol USD 9.42M accumulated)', '55.50% (vol USD 9.44M accumulated)'],
    ['56.50% (vol USD 9.42M)', '55.50% (vol USD 9.44M)'],
    ['38.95% (vol USD 9.21M accumulated)', '39.35% (vol USD 9.23M accumulated)'],
    ['38.95% (vol USD 9.21M)', '39.35% (vol USD 9.23M)'],
    ['3.15% (vol USD 2.55M accumulated)', '3.25% (vol USD 2.56M accumulated)'],
    ['3.15% (vol USD 2.55M)', '3.25% (vol USD 2.56M)'],
    ['2.25% (vol USD 11.81M accumulated)', '2.25% (vol USD 11.82M accumulated)'],
    ['2.25% (vol USD 11.81M)', '2.25% (vol USD 11.82M)'],
    ['USD 11.81M, the LARGEST', 'USD 11.82M, the LARGEST'],
    ['above the leader at USD 9.42M and the runner-up at USD 9.21M', 'above the leader at USD 9.44M and the runner-up at USD 9.23M'],
    ['has accumulated USD 11.81M', 'has accumulated USD 11.82M'],
    ['USD 138.92M', 'USD 139.02M'],
    ['Down 1.00pp on the day', 'Down 2.00pp on the day'],
    ['gave up 1.00pp, to 56.50%', 'gave up 2.00pp, to 55.50%'],
    ['gave up 1.00pp on Friday and the distance to the runner-up fell to 17.55pp', 'gave up 2.00pp on Friday and the distance to the runner-up fell to 16.15pp'],
    ['Down 1.00pp, and the distance to the runner-up fell to 17.55pp', 'Down 2.00pp, and the distance to the runner-up fell to 16.15pp'],
    ['still sits at 56.50%, more than 17 points above', 'still sits at 55.50%, more than 16 points above'],
    ['Up 3.30pp', 'Up 3.70pp'],
    ['rose 3.30pp on Friday, to 38.95%', 'rose 3.70pp on Friday, to 39.35%'],
    ['rose 3.30pp, to 38.95%', 'rose 3.70pp, to 39.35%'],
    ['The 3.30pp price rise', 'The 3.70pp price rise'],
    ['Down 0.35pp', 'Down 0.25pp'],
    ['gave up 0.35pp in the outright-winner contract, to 3.15%', 'gave up 0.25pp in the outright-winner contract, to 3.25%'],
    ['fell to 17.55pp', 'fell to 16.15pp'],
    ['to 17.55pp', 'to 16.15pp'],
  ],
  es: [
    ['lectura confirmada del 29/Ago, 13:27 BRT (16:27 UTC)', 'lectura confirmada del 29/Ago, 14:51 BRT (17:51 UTC)'],
    ['56,50% (vol USD 9,42M acumulado)', '55,50% (vol USD 9,44M acumulado)'],
    ['56,50% (vol USD 9,42M)', '55,50% (vol USD 9,44M)'],
    ['38,95% (vol USD 9,21M acumulado)', '39,35% (vol USD 9,23M acumulado)'],
    ['38,95% (vol USD 9,21M)', '39,35% (vol USD 9,23M)'],
    ['3,15% (vol USD 2,55M acumulado)', '3,25% (vol USD 2,56M acumulado)'],
    ['3,15% (vol USD 2,55M)', '3,25% (vol USD 2,56M)'],
    ['2,25% (vol USD 11,81M acumulado)', '2,25% (vol USD 11,82M acumulado)'],
    ['2,25% (vol USD 11,81M)', '2,25% (vol USD 11,82M)'],
    ['USD 11,81M, el MAYOR', 'USD 11,82M, el MAYOR'],
    ['por encima del líder, con USD 9,42M, y del segundo, con USD 9,21M', 'por encima del líder, con USD 9,44M, y del segundo, con USD 9,23M'],
    ['acumula USD 11,81M', 'acumula USD 11,82M'],
    ['USD 138,92M', 'USD 139,02M'],
    ['Caída de 1,00pp en el día', 'Caída de 2,00pp en el día'],
    ['cedió 1,00pp, a 56,50%', 'cedió 2,00pp, a 55,50%'],
    ['cedió 1,00pp este viernes y la distancia al segundo cayó a 17,55pp', 'cedió 2,00pp este viernes y la distancia al segundo cayó a 16,15pp'],
    ['Caída de 1,00pp, y la distancia al segundo cayó a 17,55pp', 'Caída de 2,00pp, y la distancia al segundo cayó a 16,15pp'],
    ['sigue en 56,50%, más de 17 puntos por encima', 'sigue en 55,50%, más de 16 puntos por encima'],
    ['Subida de 3,30pp', 'Subida de 3,70pp'],
    ['subió 3,30pp este viernes, a 38,95%', 'subió 3,70pp este viernes, a 39,35%'],
    ['subió 3,30pp, a 38,95%', 'subió 3,70pp, a 39,35%'],
    ['La subida de 3,30pp en el precio', 'La subida de 3,70pp en el precio'],
    ['Caída de 0,35pp', 'Caída de 0,25pp'],
    ['cedió 0,35pp en el contrato de ganador, a 3,15%', 'cedió 0,25pp en el contrato de ganador, a 3,25%'],
    ['cayó a 17,55pp', 'cayó a 16,15pp'],
    ['a 17,55pp', 'a 16,15pp'],
  ],
}

// frases inteiras que sumiram do pt-BR (2o/3o lugar) e viram a frase de bloqueio
const frases: Record<'en' | 'es', RegExp[]> = {
  en: [
    /In the second-place contract for the first round he rose 1\.50pp, to 86\.50%\.?/g,
    /and BOTH of his books moved in the same direction: the second-place one rose 1\.50pp, to 86\.50%\.?/g,
    /This time his two books moved in the SAME direction, the inverse of the day before\.?/g,
    /,? and the second-place contract for the first round rose 1\.50pp, to 86\.50%\.?/g,
    /In the second-place contract he rose 1\.50pp, to 86\.50%, and this time both books moved in the same direction\.?/g,
    /He remains in the leading group of the third-place contract, at 32\.50%, in a field where the top two are 4\.00pp apart\.?/g,
    /He LOST the lead of the third-place contract for the first round, which he had held since Aug 9\. Caiado opened up to 36\.50% and he fell to 32\.50%, a 3\.00pp drop on the day\.?/g,
    /In the third-place contract he gave up 3\.00pp, to 32\.50%, and LOST the lead he had held since Aug 9\.?/g,
    /In the third-place contract he rose 2\.00pp, to 36\.50%, and TOOK the lead( of that book)?\.?/g,
    /Caiado TOOK the lead of the third-place contract for the first round, at 36\.50%\.?/g,
    /This round publishes no new number for Cury in the third-place contract\. The Aug 28 value was 26\.70%\.?/g,
    /This round publishes no new number for him in the third-place contract, which stood at 26\.70% on Aug 28\.?/g,
  ],
  es: [
    /En el contrato de segundo lugar de la primera vuelta subió 1,50pp, a 86,50%\.?/g,
    /y sus DOS libros se movieron en la misma dirección: el de segundo lugar subió 1,50pp, a 86,50%\.?/g,
    /Esta vez sus dos libros se movieron en la MISMA dirección, lo inverso de la víspera\.?/g,
    /,? y el de segundo lugar de la primera vuelta subió 1,50pp, a 86,50%\.?/g,
    /En el contrato de segundo lugar subió 1,50pp, a 86,50%, y esta vez los dos libros se movieron en la misma dirección\.?/g,
    /Sigue en el pelotón de cabeza del contrato de tercer lugar, con 32,50%, en un grupo en que los dos primeros están a 4,00pp uno del otro\.?/g,
    /PERDIÓ el liderazgo del contrato de tercer lugar de la primera vuelta, que ocupaba desde el 09\/Ago\. Caiado abrió a 36,50% y él cayó a 32,50%, una caída de 3,00pp en el día\.?/g,
    /En el contrato de tercer lugar cedió 3,00pp, a 32,50%, y PERDIÓ el liderazgo que (tenía|ocupaba) desde el 09\/Ago\.?/g,
    /En el contrato de tercer lugar subió 2,00pp, a 36,50%, y ASUMIÓ el liderazgo( de ese libro)?\.?/g,
    /Caiado ASUMIÓ el liderazgo del contrato de tercer lugar de la primera vuelta, con 36,50%\.?/g,
    /Esta ronda no publica número nuevo para Cury en el contrato de tercer lugar\. El valor del 28\/Ago era 26,70%\.?/g,
    /Esta ronda no publica número nuevo para él en el contrato de tercer lugar, que estaba en 26,70% el 28\/Ago\.?/g,
  ],
}

for (const loc of ['en', 'es'] as const) {
  const SO = (process.env.SO || '').split(',').filter(Boolean)
  for (const arq of ['analysis-criteriosa', 'analysis-data', 'polls-data'] as const) {
    if (SO.length && !SO.includes(arq + '.' + loc)) continue
    const pt = caminhos(JSON.parse(readFileSync(`public/${arq}.json`, 'utf8')))
    const anterior = caminhos(JSON.parse(readFileSync(`public/${arq}.${loc}.json`, 'utf8')))
    const mapa: Record<string, string> = {}
    for (const [p, v] of Object.entries(pt)) {
      const ant = anterior[p]
      if (ant === undefined) continue
      let novo = ant
      for (const re of frases[loc]) novo = novo.replace(re, '')
      for (const [de, para] of subs[loc]) novo = novo.split(de).join(para)
      novo = novo.replace(/\s{2,}/g, ' ').replace(/ \./g, '.').trim()
      if (novo !== ant) mapa[p] = novo
    }
    // a frase de bloqueio entra onde o pt-BR a tem e a tradução ainda não
    for (const [p, v] of Object.entries(pt)) {
      if (!v.includes('Esta rodada não publica número novo para os contratos de 2º e 3º lugar')) continue
      const base = mapa[p] ?? anterior[p]
      if (base === undefined) continue
      if (!base.includes(BLOQ[loc])) mapa[p] = (base + ' ' + BLOQ[loc]).replace(/\s{2,}/g, ' ').trim()
    }
    // campos curtos de preço no EN
    if (loc === 'en') {
      for (const [p, v] of Object.entries(pt)) {
        if (!/\.polymarket$/.test(p)) continue
        mapa[p] = v.replace(',', '.')
      }
    } else {
      for (const [p, v] of Object.entries(pt)) if (/\.polymarket$/.test(p)) mapa[p] = v
    }
    // Os 4 que a transformação não alcança: o pt-BR mudou, mas a frase que sumiu
    // era a única diferença no idioma, então `novo === ant` e nada entrou no mapa.
    const fixos: Record<'en' | 'es', Record<string, string>> = {
      en: {
        'candidates[3].caiado.fortes':
          'He is the THIRD name in the first round in Vox Brasil of Aug 29, at 5.0%, ahead of Renan Santos at 3.3%, Romeu Zema at 2.8% and Augusto Cury at 2.6%. In the runoff of the same Vox poll he loses to the leader 45.5% to 41.1%, a distance of 4.4 points, the smaller of the two alternative scenarios tested. He debuted on radio campaign advertising on Friday.',
        'quadroComparativo[1].t': 'the largest rise on the panel, and the gap narrows again',
        'quadroComparativo[3].t': 'gives ground in the outright-winner contract',
        'quadroComparativo[4].t': 'third in declared voting intention and eighth on price',
        subtitle:
          'Crossing of Aug 29, 2026: Polymarket price in the confirmed reading of Aug 29, 2:51 PM BRT (5:51 PM UTC), presidential book at USD 139.02M, against Vox Brasil released ON THAT SAME DATE (BR-05519/2026, fieldwork Aug 25 to 27, n=2,100, margin of 2.15pp), the first national poll in two days. It narrows the first round to 2.3pp and changes the side of the runoff against the same pollster, which on Jul 31 had the leader 6.4 points ahead. In the market, the runner-up rose 3.70pp and the distance between the two fell to 16.15pp, the lowest value in the 20-day window. Free campaign advertising also debuted on RADIO.',
        'candidates[0].analise':
          'Poll and price pointed the same way on Friday, and the price pointed first. Vox Brasil of Aug 29 (BR-05519/2026, fieldwork Aug 25 to 27, n=2,100) keeps him ahead in the first round, 37.1% to 34.8%, but narrows the distance to 2.3 points and flips the sign of the runoff, where he appears at 44.5% against 45.1%. It is a technical tie by the 2.15pp margin. Across the two Vox readings the sign of the runoff changed sides: on Jul 31 the leader was 6.4 points ahead and now he is 0.6 point behind. That holds for the Vox series, not for the set of national polls: in the 30-day window of the panel the opponent had already appeared ahead in the runoff in Gerp of Aug 26, in Veritá of Aug 21 and in Gerp of Aug 11. The comparison that carries the reading is with the same pollster: Vox of Jul 31, same in-person method, same sample of 2,100 and same margin, gave 40.5% to 31.2% in the first round and 47.5% to 41.1% in the runoff. In one month the first-round distance fell 7 points and the runoff changed sides. In the market, his outright-winner contract gave up 2.00pp, to 55.50% (vol USD 9.44M accumulated), and the distance to the runner-up fell to 16.15pp, the lowest value in the 20-day window. The series shows that narrowing running since Aug 10, when the distance was 36.40pp. What AFOS records, without saying which instrument is right, is the order: the opponent price started rising on the night of Aug 28 and the poll came out the following day. Which of the two measurements better describes the ballot box only the count can answer.',
        'candidates[1].fracos[4]':
          'This round publishes no new number for the second-place and third-place contracts of the first round.',
        'candidates[1].analise':
          'He was the name that moved the most, and on both instruments. In the market, the outright-winner contract rose 3.70pp, to 39.35% (vol USD 9.23M accumulated), the largest move on the panel. This round publishes no new number for the second-place and third-place contracts of the first round. In the polling, Vox Brasil of Aug 29 puts him at 34.8% in the first round and at 45.1% in the runoff, ahead of the leader by 0.6 point, inside the 2.15pp margin and therefore a technical tie. Across the two Vox readings the sign of the runoff changed sides: on Jul 31 the leader was 6.4 points ahead and now he is 0.6 point behind. That holds for the Vox series, not for the set of national polls: in the 30-day window of the panel he had already appeared ahead in the runoff in Gerp of Aug 26, 47% to 42%, in Veritá of Aug 21, 47.3% to 42%, and in Gerp of Aug 11, 45% to 43%. What gives the reading weight is comparing Vox with itself: on Jul 31, with the same in-person method and the same sample of 2,100, he had 31.2% in the first round and 41.1% in the runoff. In one month he rose 3.6pp and 4.0pp, and the first-round distance between the two fell from 9.3 points to 2.3. The order of events deserves recording: his price started rising on the night of Aug 28 and the poll was released on Aug 29. Both instruments pointed the same way, and the market pointed first. Neither of them is the result, which only the ballot box gives.',
        'candidates[2].header':
          'PRICE: 2.25% (vol USD 11.82M accumulated), confirmed reading of Aug 29, 2:51 PM BRT (5:51 PM UTC). Down 0.65pp in the outright-winner contract. POLLING: Vox Brasil of Aug 29 measures him at 3.3% in the first round.',
        'candidates[2].analise':
          'His day is one of decline in the outright-winner contract: he gave up 0.65pp, to 2.25% (vol USD 11.82M accumulated), giving back the two consecutive rises he had made after the Aug 27 floor. Vox of Aug 29 measures him at 3.3% in the first round, ahead of Zema and Cury, which neither supports nor contradicts the price: they are different quantities, one is declared voting intention and the other is the implied probability of winning. This round publishes no new number for the second-place and third-place contracts of the first round. The point that still holds for him is volume: the book has accumulated USD 11.82M, the largest on the panel, in a contract now worth 2.25%.',
        'candidates[3].subtitle':
          'Trailing field in the confirmed reading of Aug 29, 2:51 PM BRT (5:51 PM UTC). Augusto Cury gives up 0.25pp in the outright-winner contract and Ronaldo Caiado is the third name in the first round in Vox Brasil of Aug 29, at 5.0%. This round publishes no new number for the second-place and third-place contracts of the first round.',
        'candidates[3].caiado.label':
          'CAIADO (PSD), presidential Poly 0.25% (vol USD 6.89M accumulated, confirmed reading of Aug 29, 2:51 PM BRT (5:51 PM UTC)), unchanged, BELOW the 0.5% floor of the double reading.',
        'candidates[3].fortes[0]':
          'RONALDO CAIADO (PSD) is the third name in the first round in Vox of Aug 29, at 5.0%. This round publishes no new number for the second-place and third-place contracts of the first round.',
        'candidates[3].analise':
          'The group has one polling reading and no new price reading in the placement contracts. Vox of Aug 29 gives Ronaldo Caiado 5.0% in the first round, the third name on the table, ahead of Renan Santos, Zema and Cury. In the outright-winner contract, however, Caiado still sits at 0.25% (vol USD 6.89M accumulated), below the 0.5% floor where the double reading certifies movement, and the distance between the 5.0% of declared voting intention and the 0.25% of implied probability is the crossing this panel exists to show. Cury gave up 0.25pp in the outright-winner contract, to 3.25% (vol USD 2.56M accumulated), and the 2.6% Vox gives him sits below the 4% of PoderData of Aug 27. This round publishes no new number for the second-place and third-place contracts of the first round.',
        cruzamento:
          'The day had both measurements moving in the same direction, and the order in which they moved is the record that matters. Vox Brasil released on Aug 29 (BR-05519/2026, fieldwork Aug 25 to 27, n=2,100, margin of 2.15pp, in person) brings the first round at 37.1% to 34.8%, a distance of 2.3 points, and the runoff at 45.1% to 44.5% for the runner-up. The 0.6 point sits inside the margin and so the correct reading is a technical tie, not a lead. Across the two Vox readings the sign of the runoff changed sides: on Jul 31 the leader was 6.4 points ahead and now he is 0.6 point behind. That holds for the Vox series, not for the set of national polls. In the 30-day window of the panel he had already appeared ahead in the runoff in three other national polls: Gerp of Aug 26, 47% to 42%, Veritá of Aug 21, 47.3% to 42%, and Gerp of Aug 11, 45% to 43%. The pollsters disagree with each other about the runoff, and the clearest case is Aug 26, when Gerp gave him 47% to 42% and Indexa/Broadcast gave the leader 46% to 41%, on the SAME day and with opposite signs. The comparison that carries the piece is the pollster against itself: Vox of Jul 31, same in-person method, same sample of 2,100 and same margin, measured 40.5% to 31.2% in the first round and 47.5% to 41.1% in the runoff. In one exact month the first-round distance fell 7 points and the runoff changed sides. In the market, the runner-up outright-winner contract rose 3.70pp, to 39.35%, the largest move on the panel, the leader gave up 2.00pp, to 55.50%, and the distance between the two fell to 16.15pp, the lowest value in the 20-day window. The series shows that narrowing running since Aug 10, when the distance was 36.40pp, without a single day of meaningful reversal. AFOS does not say which of the two instruments is right, and there is a structural reason for that: both are forecasts of the same event and can be wrong together. What the record allows us to state is the sequence. The runner-up price began rising on the night of Aug 28, going from 35.70% at 4:31 PM to 37.60% at 8:30 PM, and the poll was released the following day. Both pointed the same way, and the price pointed first. That proves neither anticipation nor accuracy: it shows only that the market repricing did not wait for declared voting intention to be published. Which of the two measurements better describes the electorate only the count can answer, and that is why the price series and the polling series are kept side by side, to be checked later against the result. Away from the top, this round publishes no new number for the second-place and third-place contracts of the first round. Declared voting intention places Ronaldo Caiado as the third name on the Vox table, at 5.0%. And the contrast between that 5.0% of declared intention and the 0.25% of implied probability in his outright-winner contract is the kind of distance this panel exists to show, without subtracting one from the other, because they are different quantities.',
      },
      es: {
        'candidates[3].caiado.fortes':
          'Es el TERCER nombre de la primera vuelta en la Vox Brasil del 29/Ago, con 5,0%, por delante de Renan Santos, con 3,3%, de Romeu Zema, con 2,8%, y de Augusto Cury, con 2,6%. En la segunda vuelta de la misma Vox pierde ante el líder por 45,5% a 41,1%, una distancia de 4,4 puntos, la menor entre los dos escenarios alternativos probados. Debutó en la propaganda electoral de radio este viernes.',
        'quadroComparativo[1].t': 'la mayor subida del panel, y el vano se estrecha de nuevo',
        'quadroComparativo[3].t': 'cede en el contrato de ganador',
        'quadroComparativo[4].t': 'tercero en la intención declarada y octavo en el precio',
        subtitle:
          'Cruce del 29 de agosto de 2026: precio de Polymarket en lectura confirmada del 29/Ago, 14:51 BRT (17:51 UTC), libro presidencial en USD 139,02M, contra la Vox Brasil divulgada EN ESA MISMA FECHA (BR-05519/2026, campo del 25 al 27/Ago, n=2.100, margen de 2,15pp), la primera nacional en dos días. Estrecha la primera vuelta a 2,3pp y cambia el lado de la segunda vuelta frente a la propia casa, que el 31/Jul daba al líder 6,4 puntos por delante. En el mercado, el segundo subió 3,70pp y la distancia entre ambos cayó a 16,15pp, el menor valor de la ventana de 20 días. También debutó la propaganda electoral gratuita en RADIO.',
        'candidates[0].analise':
          'La encuesta y el precio apuntaron hacia el mismo lado este viernes, y el precio apuntó primero. La Vox Brasil del 29/Ago (BR-05519/2026, campo del 25 al 27/Ago, n=2.100) lo mantiene por delante en la primera vuelta, con 37,1% contra 34,8%, pero estrecha la distancia a 2,3 puntos e invierte el signo de la segunda vuelta, donde aparece con 44,5% contra 45,1%. Es empate técnico por el margen de 2,15pp. En las dos lecturas de Vox el signo de la segunda vuelta cambió de lado: el 31/Jul el líder estaba 6,4 puntos por delante y ahora está 0,6 punto por detrás. Eso vale para la serie de Vox, no para el conjunto de las nacionales: en la ventana de 30 días del panel el adversario ya aparecía por delante en la segunda vuelta en Gerp del 26/Ago, en Veritá del 21/Ago y en Gerp del 11/Ago. La comparación que sostiene la lectura es con la propia casa: la Vox del 31/Jul, mismo método presencial, misma muestra de 2.100 y mismo margen, daba 40,5% a 31,2% en la primera vuelta y 47,5% a 41,1% en la segunda. En un mes la distancia de primera vuelta cayó 7 puntos y la de segunda cambió de lado. En el mercado, su contrato de ganador cedió 2,00pp, a 55,50% (vol USD 9,44M acumulado), y la distancia al segundo cayó a 16,15pp, el menor valor de la ventana de 20 días. La serie muestra ese estrechamiento corriendo desde el 10/Ago, cuando la distancia era de 36,40pp. Lo que AFOS registra, sin decir qué instrumento acierta, es el orden: el precio del adversario empezó a subir la noche del 28/Ago y la encuesta salió al día siguiente. Cuál de las dos mediciones describe mejor las urnas solo lo responde el escrutinio.',
        'candidates[1].fracos[4]':
          'Esta ronda no publica número nuevo para los contratos de segundo y tercer lugar de la primera vuelta.',
        'candidates[1].analise':
          'Fue el nombre que más se movió, y en los dos instrumentos. En el mercado, el contrato de ganador subió 3,70pp, a 39,35% (vol USD 9,23M acumulado), la mayor variación del panel. Esta ronda no publica número nuevo para los contratos de segundo y tercer lugar de la primera vuelta. En la encuesta, la Vox Brasil del 29/Ago lo da en 34,8% en la primera vuelta y en 45,1% en la segunda, por delante del líder por 0,6 punto, dentro del margen de 2,15pp y por lo tanto en empate técnico. En las dos lecturas de Vox el signo de la segunda vuelta cambió de lado: el 31/Jul el líder estaba 6,4 puntos por delante y ahora está 0,6 punto por detrás. Eso vale para la serie de Vox, no para el conjunto de las nacionales: en la ventana de 30 días del panel él ya aparecía por delante en la segunda vuelta en Gerp del 26/Ago, por 47% a 42%, en Veritá del 21/Ago, por 47,3% a 42%, y en Gerp del 11/Ago, por 45% a 43%. Lo que da peso a la lectura es la comparación de Vox consigo misma: el 31/Jul, con el mismo método presencial y la misma muestra de 2.100, tenía 31,2% en la primera vuelta y 41,1% en la segunda. En un mes subió 3,6pp y 4,0pp, y la distancia de primera vuelta entre ambos cayó de 9,3 puntos a 2,3. El orden de los hechos merece registro: su precio empezó a subir la noche del 28/Ago y la encuesta se divulgó el 29/Ago. Los dos instrumentos apuntaron en la misma dirección, y el mercado apuntó antes. Ninguno de los dos es el resultado, que solo las urnas dan.',
        'candidates[2].header':
          'PRECIO: 2,25% (vol USD 11,82M acumulado), lectura confirmada del 29/Ago, 14:51 BRT (17:51 UTC). Caída de 0,65pp en el contrato de ganador. ENCUESTA: la Vox Brasil del 29/Ago lo mide en 3,3% en la primera vuelta.',
        'candidates[2].analise':
          'Su día es de caída en el contrato de ganador: cedió 0,65pp, a 2,25% (vol USD 11,82M acumulado), devolviendo las dos subidas seguidas que había hecho tras el piso del 27/Ago. La Vox del 29/Ago lo mide en 3,3% en la primera vuelta, por delante de Zema y de Cury, lo que no sostiene ni contradice el precio: son magnitudes distintas, una es intención declarada y la otra es probabilidad implícita de ganar. Esta ronda no publica número nuevo para los contratos de segundo y tercer lugar de la primera vuelta. El punto que sigue valiendo para él es el volumen: el libro acumula USD 11,82M, el mayor del panel, en un contrato que hoy vale 2,25%.',
        'candidates[3].subtitle':
          'Pelotón de atrás en lectura confirmada del 29/Ago, 14:51 BRT (17:51 UTC). Augusto Cury cede 0,25pp en el contrato de ganador y Ronaldo Caiado es el tercer nombre de la primera vuelta en la Vox Brasil del 29/Ago, con 5,0%. Esta ronda no publica número nuevo para los contratos de segundo y tercer lugar de la primera vuelta.',
        'candidates[3].caiado.label':
          'CAIADO (PSD), Poly presidencial 0,25% (vol USD 6,89M acumulado, lectura confirmada del 29/Ago, 14:51 BRT (17:51 UTC)), sin variación, POR DEBAJO del piso de 0,5% de la doble lectura.',
        'candidates[3].fortes[0]':
          'RONALDO CAIADO (PSD) es el tercer nombre de la primera vuelta en la Vox del 29/Ago, con 5,0%. Esta ronda no publica número nuevo para los contratos de segundo y tercer lugar de la primera vuelta.',
        'candidates[3].analise':
          'El grupo tiene una lectura de urna y ninguna de precio nueva en los contratos de colocación. La Vox del 29/Ago da a Ronaldo Caiado 5,0% en la primera vuelta, el tercer nombre de la tabla, por delante de Renan Santos, Zema y Cury. En el contrato de ganador, sin embargo, Caiado sigue en 0,25% (vol USD 6,89M acumulado), por debajo del piso de 0,5% en que la doble lectura certifica movimiento, y la distancia entre el 5,0% de la intención declarada y el 0,25% de la probabilidad implícita es el cruce que este panel existe para mostrar. Cury cedió 0,25pp en el contrato de ganador, a 3,25% (vol USD 2,56M acumulado), y el 2,6% que le da Vox queda por debajo del 4% de PoderData del 27/Ago. Esta ronda no publica número nuevo para los contratos de segundo y tercer lugar de la primera vuelta.',
        cruzamento:
          'El día tuvo las dos mediciones moviéndose en la misma dirección, y el orden en que se movieron es el registro que importa. La Vox Brasil divulgada el 29/Ago (BR-05519/2026, campo del 25 al 27/Ago, n=2.100, margen de 2,15pp, presencial) trae la primera vuelta en 37,1% a 34,8%, una distancia de 2,3 puntos, y la segunda vuelta en 45,1% a 44,5% para el segundo. Los 0,6 punto quedan dentro del margen y por eso la lectura correcta es empate técnico, no liderazgo. En las dos lecturas de Vox el signo de la segunda vuelta cambió de lado: el 31/Jul el líder estaba 6,4 puntos por delante y ahora está 0,6 punto por detrás. Eso vale para la serie de Vox, no para el conjunto de las nacionales. En la ventana de 30 días del panel él ya aparecía por delante en la segunda vuelta en otras tres encuestas nacionales: Gerp del 26/Ago, por 47% a 42%, Veritá del 21/Ago, por 47,3% a 42%, y Gerp del 11/Ago, por 45% a 43%. Las casas discrepan entre sí sobre la segunda vuelta, y el caso más claro es el 26/Ago, cuando Gerp le dio 47% a 42% y Indexa/Broadcast le dio 46% a 41% al líder, el MISMO día y con signos opuestos. La comparación que sostiene la pieza es de la casa consigo misma: la Vox del 31/Jul, mismo método presencial, misma muestra de 2.100 y mismo margen, medía 40,5% a 31,2% en la primera vuelta y 47,5% a 41,1% en la segunda. En un mes exacto la distancia de la primera vuelta cayó 7 puntos y la de la segunda cambió de lado. En el mercado, el contrato de ganador del segundo subió 3,70pp, a 39,35%, la mayor variación del panel, el del líder cedió 2,00pp, a 55,50%, y la distancia entre ambos cayó a 16,15pp, el menor valor de la ventana de 20 días. La serie muestra ese estrechamiento corriendo desde el 10/Ago, cuando la distancia era de 36,40pp, sin un solo día de reversión relevante. AFOS no dice cuál de los dos instrumentos está en lo cierto, y hay una razón estructural: ambos son previsiones del mismo evento y pueden equivocarse juntos. Lo que el registro permite afirmar es la secuencia. El precio del segundo empezó a subir la noche del 28/Ago, pasando de 35,70% a las 16h31 a 37,60% a las 20h30, y la encuesta se divulgó al día siguiente. Ambos apuntaron hacia el mismo lado, y el precio apuntó antes. Eso no prueba anticipación ni acierto: muestra solo que la revisión del mercado no esperó la publicación de la intención declarada. Cuál de las dos mediciones describe mejor al electorado solo lo responde el escrutinio, y por eso la serie de precio y la serie de encuesta quedan guardadas lado a lado, para ser cotejadas después contra el resultado. Fuera de la cima, esta ronda no publica número nuevo para los contratos de segundo y tercer lugar de la primera vuelta. La intención declarada coloca a Ronaldo Caiado como tercer nombre de la tabla de Vox, con 5,0%. Y el contraste entre ese 5,0% de intención declarada y el 0,25% de probabilidad implícita en su contrato de ganador es el tipo de distancia que este panel existe para mostrar, sin restar una de la otra, porque son magnitudes distintas.',
      },
    }
    if (arq === 'analysis-criteriosa') for (const [k, v] of Object.entries(fixos[loc])) mapa[k] = v

    // analysis-data: os textos de DATAÇÃO reescritos (Fachin e Vorcaro não são atos de sexta)
    const fixosData: Record<'en' | 'es', Record<string, string>> = {
      en: {
        'cards.inss.text3':
          'The institutional crisis around the case remains escalated. André Mendonça sees no room for a truce with the Federal Police leadership, according to Folha de S.Paulo, and the president of the Supreme Court, Edson Fachin, is working to avoid the escalation, saying it is his duty to preserve institutions, according to SBT News, Brasil 247 and ICL Notícias. The panel does not date Fachin act as Friday: the coverage describes it as an effort under way.',
        'cards.inss.impactoLula':
          'Not isolable, and today new reading does NOT reach the period in question. Vox Brasil of Aug 29 has fieldwork from Aug 25 to 27, before the escalation of the crisis between Mendonça and the Federal Police. The clean comparison it allows is the pollster against itself: 37.1% in the first round against 40.5% on Jul 31, and 44.5% in the runoff against 47.5%. On price, his outright-winner contract gave up 2.00pp on Friday, to 55.50%.',
        'cards.bancoMaster.text1':
          'Daniel Vorcaro testimony to the Federal Police was concluded on Aug 28, and its content came out between the night of Aug 28 and Aug 29. He said he did not corrupt Central Bank staff and again signalled a plea deal, according to Folha de S.Paulo and O Globo. It was his first testimony this year on the suspicion of corruption at the Central Bank.',
        'cards.bancoMaster.conclusao':
          'THE CROSSING OF THE DAY IS IN THE ORDER OF EVENTS, NOT IN THE CAUSE. The case became a central piece of campaign advertising and the content of the testimony came out between Aug 28 and Aug 29, and in the same period the runner-up price rose 3.70pp. The panel does NOT claim one produced the other, and there is a concrete reason not to: his price started rising on the night of Aug 28, before the poll came out. When two measurements move in the same direction, what gets recorded is the sequence, not the mechanism.',
        'cards.stf.nexo':
          'THE COURT PRESIDENCY APPEARS IN THE COVERAGE. Edson Fachin is working to reduce the tension between Mendonça and the Federal Police leadership and met with the Justice Minister, according to Brasil 247 and SBT News. The panel records the effort without dating it as a Friday act, because the coverage describes it as a process under way. Alongside it, the electoral court took X to task and demanded explanations about failures in its algorithm filter, and the runner-up went to that same court against his opponent remarks about campaign accounts, according to Poder360.',
        'cards.sentimento.text3':
          'This round publishes no new number for the second-place and third-place contracts of the first round. Declared voting intention points to the same trailing field by another route: Vox places Ronaldo Caiado as the third name in the first round, at 5.0%, ahead of Renan Santos at 3.3%, Romeu Zema at 2.8% and Augusto Cury at 2.6%.',
        'cards.sentimento.direita':
          'Flávio Bolsonaro at 39.35% (vol USD 9.23M) in the presidential book, up 3.70pp, the largest move on the panel. In Vox of Aug 29 he has 34.8% in the first round and 45.1% in the runoff, and comparing the pollster with itself shows rises of 3.6pp and 4.0pp in one month. In his TV Globo interview he tried to tie Banco Master to his opponent and promised to respect the election result, according to O Globo, and refused to account for the Dark Horse case, according to Folha de S.Paulo. He told the Faria Lima financial district that relations with the Supreme Court improve once he appoints four justices, according to Estadão.',
        'cards.sentimento.esquerda':
          'Lula at 55.50% (vol USD 9.44M), down 2.00pp. In Vox of Aug 29 he has 37.1% in the first round, ahead by 2.3 points, and 44.5% in the runoff, behind by 0.6 point inside the margin. Against Vox own Jul 31 reading he gives up 3.4pp in the first round and 3.0pp in the runoff. His rejection is 52.7%, above the opponent 49.3%, according to CNN Brasil. In the radio advertising debut he focused on education, according to InfoMoney, called his opponent the worst of the Bolsonaros, according to Estadão, and his campaign launched a site tying the rival to militia and to Banco Master, according to Poder360.',
        'cards.sentimento.terceiraVia':
          'Ronaldo Caiado is the third name in the first round in Vox of Aug 29, at 5.0%, and in the outright-winner contract he remains at 0.25% (vol USD 6.89M), below the 0.5% floor of the double reading. Renan Santos at 2.25% (vol USD 11.82M), down 0.65pp. Augusto Cury gave up 0.25pp in the outright-winner contract, to 3.25% (vol USD 2.56M), debuted on radio campaign advertising and gained 2 million followers over the week, according to SpaceMoney. This round publishes no new number for the second-place and third-place contracts of the first round.',
        'cards.sentimento.polymarket':
          'Prices from the confirmed reading of Aug 29, 2:51 PM BRT (5:51 PM UTC). AFOS publishes only prices that two independent readings, taken eight minutes apart, confirm within 0.20pp, and the confirmation is done contract by contract. Names below 0.5% fall outside that watch, because a thin book swings on its own. The presidential book holds USD 139.02M since opening.',
      },
      es: {
        'cards.inss.text3':
          'La crisis institucional en torno al caso sigue escalada. André Mendonça no ve margen para una tregua con la cúpula de la Policía Federal, según Folha de S.Paulo, y el presidente del Supremo, Edson Fachin, articula para evitar la escalada, diciendo que es su deber preservar las instituciones, según SBT News, Brasil 247 e ICL Notícias. El panel no fecha el acto de Fachin como de este viernes: la cobertura lo describe como una articulación en curso.',
        'cards.inss.impactoLula':
          'No aislable, y la lectura nueva de hoy NO alcanza el período en cuestión. La Vox Brasil del 29/Ago tiene campo del 25 al 27/Ago, anterior a la escalada de la crisis entre Mendonça y la Policía Federal. La comparación limpia que permite es de la casa consigo misma: 37,1% en la primera vuelta contra 40,5% el 31/Jul, y 44,5% en la segunda contra 47,5%. En el precio, su contrato de ganador cedió 2,00pp este viernes, a 55,50%.',
        'cards.bancoMaster.text1':
          'La declaración de Daniel Vorcaro a la Policía Federal se concluyó el 28/Ago, y su contenido salió entre la noche del 28 y el día 29. Afirmó que no corrompió a funcionarios del Banco Central y volvió a insinuar una delación premiada, según Folha de S.Paulo y O Globo. Fue su primera declaración del año sobre la sospecha de corrupción en el Banco Central.',
        'cards.bancoMaster.conclusao':
          'EL CRUCE DEL DÍA ESTÁ EN EL ORDEN DE LOS HECHOS, NO EN LA CAUSA. El caso se volvió pieza central de la propaganda y el contenido de la declaración salió entre el 28 y el 29/Ago, y en el mismo período el precio del segundo subió 3,70pp. El panel NO afirma que una cosa causó la otra, y hay un motivo concreto para no afirmarlo: la subida de su precio empezó la noche del 28/Ago, antes de que saliera la encuesta. Cuando dos mediciones se mueven en la misma dirección, lo que se registra es la secuencia, no el mecanismo.',
        'cards.stf.nexo':
          'LA PRESIDENCIA DEL TRIBUNAL APARECE EN LA COBERTURA. Edson Fachin articula para reducir la tensión entre Mendonça y la cúpula de la Policía Federal y se reunió con el ministro de Justicia, según Brasil 247 y SBT News. El panel registra la articulación sin fecharla como acto de este viernes, porque la cobertura la describe como un proceso en curso. Junto a eso, el TSE encuadró a X y exigió explicaciones sobre fallas en el filtro de algoritmo, y el segundo recurrió al propio TSE contra declaraciones de su adversario sobre cuentas de campaña, según Poder360.',
        'cards.sentimento.text3':
          'Esta ronda no publica número nuevo para los contratos de segundo y tercer lugar de la primera vuelta. La intención declarada apunta al mismo pelotón por otro camino: Vox coloca a Ronaldo Caiado como tercer nombre de la primera vuelta, con 5,0%, por delante de Renan Santos, con 3,3%, de Romeu Zema, con 2,8%, y de Augusto Cury, con 2,6%.',
        'cards.sentimento.direita':
          'Flávio Bolsonaro en 39,35% (vol USD 9,23M) en el presidencial, subida de 3,70pp, la mayor variación del panel. En la Vox del 29/Ago tiene 34,8% en la primera vuelta y 45,1% en la segunda, y la comparación de la casa consigo misma muestra subidas de 3,6pp y 4,0pp en un mes. En la entrevista a TV Globo intentó vincular el Banco Master a su adversario y prometió respetar el resultado de la elección, según O Globo, y se negó a rendir cuentas sobre el caso Dark Horse, según Folha de S.Paulo. Dijo a la Faria Lima que la relación con el Supremo mejora cuando nombre a cuatro ministros, según Estadão.',
        'cards.sentimento.esquerda':
          'Lula en 55,50% (vol USD 9,44M), caída de 2,00pp. En la Vox del 29/Ago tiene 37,1% en la primera vuelta, por delante por 2,3 puntos, y 44,5% en la segunda, por detrás por 0,6 punto dentro del margen. Frente a la propia Vox del 31/Jul cede 3,4pp en la primera vuelta y 3,0pp en la segunda. Su rechazo es de 52,7%, por encima del 49,3% del adversario, según CNN Brasil. En el debut del espacio electoral en radio se centró en educación, según InfoMoney, llamó a su adversario el peor de los Bolsonaro, según Estadão, y la campaña lanzó un sitio que vincula al rival con milicia y con el Banco Master, según Poder360.',
        'cards.sentimento.terceiraVia':
          'Ronaldo Caiado es el tercer nombre de la primera vuelta en la Vox del 29/Ago, con 5,0%, y en el contrato de ganador sigue en 0,25% (vol USD 6,89M), por debajo del piso de 0,5% de la doble lectura. Renan Santos en 2,25% (vol USD 11,82M), caída de 0,65pp. Augusto Cury cedió 0,25pp en el contrato de ganador, a 3,25% (vol USD 2,56M), debutó en la propaganda electoral de radio y ganó 2 millones de seguidores en la semana, según SpaceMoney. Esta ronda no publica número nuevo para los contratos de segundo y tercer lugar de la primera vuelta.',
        'cards.sentimento.polymarket':
          'Precios de la lectura confirmada del 29/Ago, 14:51 BRT (17:51 UTC). AFOS solo publica precio que dos lecturas independientes, tomadas con ocho minutos de intervalo, confirmen dentro de 0,20pp, y la confirmación se hace contrato a contrato. Nombres por debajo de 0,5% quedan fuera de esa vigilancia, porque un libro fino oscila solo. El libro presidencial acumula USD 139,02M desde la apertura.',
      },
    }
    if (arq === 'analysis-data') for (const [k, v] of Object.entries(fixosData[loc])) mapa[k] = v

    const fixosPolls: Record<'en' | 'es', Record<string, string>> = {
      en: {
        'polymarketComparison.note':
          'Polymarket prices in the confirmed reading of Aug 29, 2:51 PM BRT (5:51 PM UTC), with the presidential book at USD 139.02M. THE DAY DID BRING A NATIONAL POLL: Vox Brasil (BR-05519/2026, fieldwork Aug 25 to 27, n=2,100, margin of 2.15pp, in person), the first in two days. It brings the first round at 37.1% to 34.8%, a distance of 2.3 points, and the runoff at 45.1% to 44.5% for Flávio Bolsonaro. The 0.6 point sits inside the margin, so the reading is a technical tie and not a lead. Across the two Vox readings the sign of the runoff changed sides: on Jul 31 the leader was 6.4 points ahead and now he is 0.6 point behind. That holds for the Vox series, not for the set of national polls. In the 30-day window of the panel he had already appeared ahead in the runoff in three other national polls: Gerp of Aug 26, 47% to 42%, Veritá of Aug 21, 47.3% to 42%, and Gerp of Aug 11, 45% to 43%. The pollsters disagree with each other about the runoff, and the clearest case is Aug 26, when Gerp gave him 47% to 42% and Indexa/Broadcast gave the leader 46% to 41%, on the SAME day and with opposite signs. The comparison that carries the day is the pollster against itself: on Jul 31 Vox measured 40.5% to 31.2% in the first round and 47.5% to 41.1% in the runoff, with the same in-person method and the same sample of 2,100. In one month the first-round distance fell 7.0 points and the runoff changed sides. In the market, Flávio Bolsonaro outright-winner contract rose 3.70pp, to 39.35%, the largest move on the panel, Lula gave up 2.00pp, to 55.50%, and the distance between the two fell to 16.15pp, the lowest value in the 20-day window. AFOS does not say which of the two instruments is right: both are forecasts of the same event and can be wrong together, and only the count settles it. What the record allows us to state is the sequence, because Flávio Bolsonaro price started rising on the night of Aug 28, before the poll was released on Aug 29. Away from the top, this round publishes no new number for the second-place and third-place contracts of the first round. Vox places Ronaldo Caiado as the third name in the first round, at 5.0%. A poll percentage and a contract price are different quantities and do not subtract: one measures declared voting intention, the other measures the implied probability of winning.',
      },
      es: {
        'polymarketComparison.note':
          'Precios de Polymarket en la lectura confirmada del 29/Ago, 14:51 BRT (17:51 UTC), con el libro presidencial en USD 139,02M. EL DÍA TUVO ENCUESTA NACIONAL DIVULGADA: la Vox Brasil (BR-05519/2026, campo del 25 al 27/Ago, n=2.100, margen de 2,15pp, presencial), la primera en dos días. Trae la primera vuelta en 37,1% a 34,8%, distancia de 2,3 puntos, y la segunda vuelta en 45,1% a 44,5% para Flávio Bolsonaro. Los 0,6 punto quedan dentro del margen, así que la lectura es de empate técnico y no de liderazgo. En las dos lecturas de Vox el signo de la segunda vuelta cambió de lado: el 31/Jul el líder estaba 6,4 puntos por delante y ahora está 0,6 punto por detrás. Eso vale para la serie de Vox, no para el conjunto de las nacionales. En la ventana de 30 días del panel él ya aparecía por delante en la segunda vuelta en otras tres encuestas nacionales: Gerp del 26/Ago, por 47% a 42%, Veritá del 21/Ago, por 47,3% a 42%, y Gerp del 11/Ago, por 45% a 43%. Las casas discrepan entre sí sobre la segunda vuelta, y el caso más claro es el 26/Ago, cuando Gerp le dio 47% a 42% y Indexa/Broadcast le dio 46% a 41% al líder, el MISMO día y con signos opuestos. La comparación que sostiene el día es de la casa consigo misma: el 31/Jul Vox medía 40,5% a 31,2% en la primera vuelta y 47,5% a 41,1% en la segunda, con el mismo método presencial y la misma muestra de 2.100. En un mes la distancia de la primera vuelta cayó 7,0 puntos y la de la segunda cambió de lado. En el mercado, el contrato de ganador de Flávio Bolsonaro subió 3,70pp, a 39,35%, la mayor variación del panel, el de Lula cedió 2,00pp, a 55,50%, y la distancia entre ambos cayó a 16,15pp, el menor valor de la ventana de 20 días. AFOS no dice cuál de los dos instrumentos está en lo cierto: ambos son previsiones del mismo evento y pueden equivocarse juntos, y solo el escrutinio lo resuelve. Lo que el registro permite afirmar es la secuencia, porque el precio de Flávio Bolsonaro empezó a subir la noche del 28/Ago, antes de que la encuesta se divulgara el 29/Ago. Fuera de la cima, esta ronda no publica número nuevo para los contratos de segundo y tercer lugar de la primera vuelta. Vox coloca a Ronaldo Caiado como tercer nombre de la primera vuelta, con 5,0%. Un porcentaje de encuesta y un precio de contrato son magnitudes distintas y no se restan: uno mide intención de voto declarada, el otro mide probabilidad implícita de ganar.',
      },
    }
    if (arq === 'polls-data') for (const [k, v] of Object.entries(fixosPolls[loc])) mapa[k] = v

    console.log(`\n--- ${arq}.${loc}: ${Object.keys(mapa).length} campos transformados`)
    construir(arq, loc, mapa)
  }
}
