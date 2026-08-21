/**
 * Mapa EN de 20/Ago/2026 para os três JSONs do painel do Brasil.
 * Convenções EN: PONTO decimal e VÍRGULA de milhar.
 * ⛔ `updatedAt` e `lastUpdate` NÃO se traduzem: ficam iguais ao pt-BR, como nas
 *    publicações anteriores. Por isso não entram no mapa.
 */
import { construir } from '../build-locale-json'

const STAMP = 'confirmed reading of Aug 20, 11:19 PM BRT (Aug 21, 2:19 AM UTC)'
const READ = 'reading of Aug 20, 11:19 PM BRT (Aug 21, 2:19 AM UTC)'
const NEXUS = 'BTG/Nexus of Aug 17 (n=2,003, field Aug 14 to 16, TSE registration BR-03317/2026)'

// ─────────────────────────────────────────────── analysis-data
construir('analysis-data', 'en', {
  'cards.sentimento.text1':
    `The distance between LULA and FLÁVIO BOLSONARO narrowed for a FOURTH straight day and closed at 30.65pp on the ${STAMP}. It was 37.05pp on Aug 16, 33.05pp on Aug 17, 31.45pp on Aug 18 and 30.95pp on Aug 19: that is 6.40pp in four days.`,
  'cards.sentimento.text2':
    `The move still has only one side to it, and that is what the week shows. Lula repeated 63.50% for a THIRD straight day, losing no price at all, and the entire approach came from the runner-up rising 0.30pp. ⛔ And it is not a record: in the joined series of 175 readings since May 23, only 2 print 32.85% or above, and both are 33.20%, from Jun 2 and Aug 18.`,
  'cards.sentimento.text3':
    `⭐ The story of the day came from outside the leading pack. PABLO MARÇAL filed his candidacy through the PRTB, using an opening created by the TSE (Folha, Aug 20), and on the same day the Public Prosecutor's Office asked the TSE to bar the candidacy and keep him out of debates (Folha, Aug 19), while the TSE granted an injunction barring him from using official resources in the campaign (TSE, Aug 20). The ballot remains silent: no new national poll since Aug 17. The Datafolha of Aug 21 is the first taken after candidacy registration and the first to measure Marçal.`,
  'cards.sentimento.direita':
    `The runner-up rose 0.30pp, from 32.55% to 32.85% (vol USD 8.68M accumulated), ${STAMP}, on his fourth straight day closing the distance. In the second-place contract he stands at 87.50% (vol USD 308 thousand). ⚠️ Away from the price, he praised Pablo Marçal as "a good guy, prepared and well-intentioned" (Estadão, Aug 20), and said he looks at the Supreme Court "with disgust", talking about being a transition president (Folha, Aug 20).`,
  'cards.sentimento.esquerda':
    `The leader repeated 63.50% for a THIRD straight day (vol USD 8.74M accumulated), ${STAMP}, losing no price at all. The high of the series is 67.50%, from Aug 16, and 63.50% is its most repeated value: 20 of the 175 readings since May 23 print exactly that number.`,
  'cards.sentimento.terceiraVia':
    `⭐ THE PACK MOVED IN TWO OPPOSITE DIRECTIONS. Renan Santos rose 0.40pp, from 4.05% to 4.45% (vol USD 10.28M), the largest move of the day, and in the third-place contract he stands at 55.50% against 34.50% for Ronaldo Caiado. 📉 Pablo Marçal, meanwhile, fell from 0.75% to 0.25% and Caiado from 0.55% to 0.35%. ⚠️ Both sit below 0.5%, the floor watched by the double reading, so they are book readings and not confirmed prices. 🔑 And the third-place disagreement holds: the market pays more on Renan Santos, while the latest national poll, from Aug 17, gives 5% to Caiado against 4% to him.`,
  'cards.sentimento.polymarket':
    `${STAMP.charAt(0).toUpperCase() + STAMP.slice(1)}. Lula 63.50%, Flávio Bolsonaro 32.85%, Renan Santos 4.45%, Ronaldo Caiado 0.35% and Pablo Marçal 0.25%. The presidential book holds USD 129.90M.`,

  'cards.inss.text1':
    `⭐ NEW DEVELOPMENT ON Aug 20, AND IT COMES FROM THE PROSECUTION. The Prosecutor General's Office stated that the man known as the "Careca do INSS" did not close deals with the Lula government and pointed to imprecision in a Federal Police conclusion, according to Estadão, in a petition sent to Justice André Mendonça.`,
  'cards.inss.text2':
    `On the same day the case became litigation between the two sides of the race: Fábio Luís Lula da Silva sued Flávio Bolsonaro and sought damages over a video made with artificial intelligence about suspected diversions, according to O Globo, Aug 20. Earlier on Aug 20, Flávio cited the case and treated the Dark Horse episode as a closed chapter, according to Folha.`,
  'cards.inss.text3':
    `The distinction this panel has kept from the start still holds: the effect on how the administration is rated is one thing, the effect on voting intention is another. ⛔ The panel does NOT attribute the 6.40pp narrowing over four days to the case, because no measurement isolates that.`,
  'cards.inss.text4':
    `⚠️ The most recent government rating is still the one from ${NEXUS}, with 42% poor or very poor against 34% excellent or good, and 23% fair. 📌 Folha reported on Aug 21, in Mônica Bergamo's column, that INTERNAL PT polling would indicate a reduction in Lula's lead. ⛔ The panel does not publish numbers from a party's internal polling: there is no registration, sample or methodology disclosed.`,
  'cards.inss.impactoLula':
    `Not isolable. The latest national measurement is from Aug 17 and puts him at 41% in the first round, up 1 point against the same house's previous wave. No price move since then has a new poll that explains it.`,
  'cards.inss.impactoGestao':
    `The rating still carries a negative balance: 42% poor or very poor against 34% excellent or good in the ${NEXUS}, a distance of 8 points. The panel records the balance and does not project an electoral effect from it.`,
  'cards.inss.conclusao':
    `On Aug 20 the case gained two new layers of different natures: the Prosecutor General's Office contested part of the Federal Police's conclusion, and the president's son went to court against his opponent over content generated with artificial intelligence. It remains without a judicial outcome, and the panel converts neither into voting intention.`,

  'cards.bancoMaster.text1':
    `⭐ THE NEW DEVELOPMENT ON Aug 20 IS ABOUT A PLEA DEAL. Investigators are willing to reopen negotiations with Daniel Vorcaro, but demand a complete plea agreement and a precise listing of assets held abroad, according to Folha de S.Paulo.`,
  'cards.bancoMaster.text2':
    `On the same day his defence asked to postpone his testimony to the Federal Police, citing a new lawyer joining the team, according to O Globo. ⚠️ The case also entered the campaign by another route: Justice André Mendonça, at the TSE, ordered the removal of a video made with artificial intelligence linking Flávio Bolsonaro to Vorcaro, and recorded that satire does not lift the prohibition. Reported independently by O Globo and G1, both on Aug 20.`,
  'cards.bancoMaster.text3':
    `⚠️ The panel keeps the two things apart on purpose. Negotiating a plea deal is an investigative step and is not a conviction, and the case remains without a judicial outcome. Removing the video is an electoral ruling about campaign advertising, not a judgment on the merits of the banking case.`,
  'cards.bancoMaster.conclusao':
    `On Aug 20 the case produced movement on two fronts: plea negotiations were reopened with a demand for assets abroad, and the Electoral Court ordered the takedown of a campaign piece using Vorcaro's name against the runner-up. It remains unresolved.`,

  'cards.stf.toffoli': `No new individual act captured on Aug 20.`,
  'cards.stf.moraes':
    `⚠️ He appears on Aug 20 in a criticism of method, not in a new act: a Folha column that day records a series of errors by him and by Dino in a case involving a journalist from Maranhão.`,
  'cards.stf.gilmar': `No new individual act on Aug 20.`,
  'cards.stf.dino': `No new individual act on Aug 20. He appears in the same Folha column cited above, alongside Moraes.`,
  'cards.stf.mendonca':
    `⭐ THE MOST PRESENT JUSTICE OF THE DAY, AND IN BOTH ROLES. As a Supreme Court justice, he intends to use the court's precedents to keep the investigations into Fábio Luís Lula da Silva under his purview (Folha, Aug 20). As a TSE justice, he ordered the removal of the artificial intelligence video linking Flávio Bolsonaro to Daniel Vorcaro (O Globo and G1, Aug 20).`,
  'cards.stf.nexo':
    `⭐ THE THROUGH-LINE ON Aug 20 IS ONE NAME IN TWO SEATS. André Mendonça rules, on the same day, on the case touching the son of the man leading the polls and on the campaign piece targeting the runner-up. 📌 The panel records the institutional coincidence and does NOT attribute intent to it: these are distinct jurisdictions, one at the Supreme Court and one at the Electoral Court, exercised by the same person. ⚠️ And the impeachment contract reacted to none of it.`,
  'cards.stf.analise':
    `Supreme Court justice impeachment contract, ${STAMP}: 3.35% (vol USD 84 thousand), down 0.05pp against the 3.40% of Aug 19. 📌 The book is small, USD 84 thousand accumulated, and a move of that size in it does not support reading a trend.`,
})

// ─────────────────────────────────────────────── analysis-criteriosa
construir('analysis-criteriosa', 'en', {
  subtitle:
    `UPDATE Aug 20, 45 days out from the first round and on the FIFTH DAY OF THE OFFICIAL CAMPAIGN. THE DISTANCE BETWEEN LULA AND FLÁVIO BOLSONARO NARROWED FOR A FOURTH STRAIGHT DAY and closed at 30.65pp, against 37.05pp on Aug 16, in a presidential book holding USD 129.90M. And the four-day pattern held: LULA stayed put at 63.50% for a THIRD day, and the one who moved was FLÁVIO BOLSONARO. ⭐ THE STORY OF THE DAY CAME FROM OUTSIDE THE LEADING PACK: PABLO MARÇAL filed his candidacy through the PRTB and, on the same day, the Public Prosecutor's Office asked the TSE to bar it. His price fell from 0.75% to 0.25%. NO new national poll: the latest is still the ${NEXUS}. The national Datafolha publishes on Aug 21 and is the first to measure Pablo Marçal.`,

  'candidates[0].header': `PRICE: 63.50% (vol USD 8.74M accumulated), ${STAMP}`,
  'candidates[0].fortes[0]':
    `The latest national poll, the ${NEXUS}, puts him at 41% in the first round, up 1 point against the same house's previous wave, which had him at 40%.`,
  'candidates[0].fortes[4]':
    `The high of the series is 67.50%, printed on Aug 16 at 9:00 PM. The Aug 20 reading, 63.50%, is the most repeated value of the series: 20 of the 175 readings since May 23 print exactly that number.`,
  'candidates[0].fracos[2]':
    `The government rating in the BTG/Nexus of Aug 17 has 42% poor or very poor against 34% excellent or good, with 23% fair.`,
  'candidates[0].fracos[3]':
    `⛔ No upside superlative applies: the high of the series is 67.50%, from Aug 16, and the Aug 20 reading sits 4.00pp below it.`,
  'candidates[0].analise':
    `PRICE at 63.50% (vol USD 8.74M accumulated), ${STAMP}, UNCHANGED for a THIRD straight day. ⭐ THE DISTANCE to the runner-up narrowed another 0.30pp to 30.65pp, on the FOURTH straight day of approach, adding up to 6.40pp since Aug 16. 🔑 And the narrowing still does not come from him: over three days he lost no price at all, and the entire approach is the opponent rising. 📌 The ballot remains silent on this: no new national poll since Aug 17, when the BTG/Nexus measured the distance between the two at 5 points.`,

  'candidates[1].header': `PRICE: 32.85% (vol USD 8.68M accumulated), ${STAMP}`,
  'candidates[1].fortes[2]':
    `The BTG/Nexus of Aug 17 takes him from 35% to 36% in the first round, and in the runoff he repeats the previous wave's 44%.`,
  'candidates[1].fracos[0]':
    `⛔ Not a record: in the joined series of 175 readings since May 23, only 2 print 32.85% or above, and both are 33.20%, from Jun 2 and Aug 18. The Aug 20 reading is the third highest of the series.`,
  'candidates[1].analise':
    `PRICE at 32.85% (vol USD 8.68M accumulated), ${STAMP}, up 0.30pp and a fourth straight day closing the distance to the leader. ⛔ NO SUPERLATIVE: 32.85% is NOT a record. In the joined series of 175 readings since May 23, only 2 print 32.85% or above, and both are 33.20%, from Jun 2 and Aug 18. Today is the third highest reading of the series, not the top. 📌 In the second-place contract he stands at 87.50% (vol USD 308 thousand). ⚠️ And there is a move to his right that does not pass through price: he publicly praised Pablo Marçal, calling him "a good guy, prepared and well-intentioned" (Estadão, Aug 20), on the day the Public Prosecutor's Office asked the TSE to bar the other man's candidacy.`,

  'candidates[2].header': `PRICE: 4.45% (vol USD 10.28M accumulated), ${STAMP}`,
  'candidates[2].fortes[2]':
    `The BTG/Nexus of Aug 17 keeps him at 4% in the first round, the same level as recent national polls.`,
  'candidates[2].fracos[3]':
    `🔴 IN THE POLL HE IS BEHIND CAIADO: the BTG/Nexus of Aug 17 gives 5% to Caiado and 4% to him, while the market pays 55.50% on him and 34.50% on Caiado in the third-place contract.`,
  'candidates[2].fracos[4]':
    `The high of his series is 17.90%, from Jun 9, so the Aug 20 reading, 4.45%, is a quarter of that value.`,
  'candidates[2].analise':
    `PRICE at 4.45% (vol USD 10.28M accumulated), ${STAMP}, up 0.40pp, the largest relative move in the leading pack today. ⭐ In the THIRD-PLACE contract he stands at 55.50% (vol USD 186 thousand), against 34.50% for Ronaldo Caiado: the market puts him as the likely third-place finisher, even though declared voting intention in the BTG/Nexus of Aug 17 has him at 4%, BEHIND Caiado's 5%. 🔑 It is the cleanest divergence on the panel today: price and ballot disagree on WHO IS THIRD. 📌 He told Valor, on Aug 21, that Lula and Flávio are "completely burned" by corruption scandals. ⚠️ And the PSOL went to the TSE against him over repeated "clip championships" (CartaCapital, Aug 20).`,

  'candidates[3].header':
    `PRICE for the whole pack, ${READ}: Pablo Marçal 0.25% (vol USD 2.04M), Ronaldo Caiado 0.35% (vol USD 6.37M), Romeu Zema 0.15% (vol USD 5.75M), Fernando Haddad 0.05% (vol USD 7.28M). ⚠️ All four sit BELOW 0.5%, which is the floor the capture guard watches, so they are book readings and not prices confirmed by a double reading.`,
  'candidates[3].subtitle':
    `Aug 20, fifth day of the campaign: the pack's move was all DOWNWARD in the price of victory, and the name that moved most was the one that just entered the race.`,
  'candidates[3].caiado.label':
    `CAIADO (PSD), presidential Poly 0.35% (vol USD 6.37M accumulated, ${READ}), down 0.20pp | third place in the first round at 34.50% | ⚠️ below the 0.5% cut watched by the double reading | ballot in force: BTG/Nexus of Aug 17 with 5% in the first round`,
  'candidates[3].haddad.label':
    `HADDAD (PT), presidential Poly 0.05% (vol USD 7.28M accumulated), ${READ}, below the 0.5% cut`,
  'candidates[3].zema.label':
    `ZEMA (Novo), presidential Poly 0.15% (vol USD 5.75M accumulated, ${READ}), unchanged and below the 0.5% cut | third place in the first round at 4.35%`,
  'candidates[3].fortes[1]':
    `In the BTG/Nexus of Aug 17, Caiado has 5% in the first round, ABOVE Renan Santos's 4%, inverting the order the market prices.`,
  'candidates[3].fortes[4]':
    `⭐ PABLO MARÇAL FILED HIS CANDIDACY through the PRTB, using an opening created by the TSE, according to Folha, Aug 20. On the same day the Public Prosecutor's Office asked the TSE to bar the candidacy and keep him out of debates (Folha, Aug 19), and the TSE granted an injunction barring the use of official resources in his campaign (TSE, Aug 20). 📉 On price he fell from 0.75% to 0.25% (vol USD 2.04M accumulated). ⚠️ He sits below the 0.5% cut and his series holds 6 readings, all between 0.60% and 1.10%, starting Aug 17. He remains INELIGIBLE until 2032 and the registration awaits a TSE decision. The Datafolha of Aug 21 is the first to measure him.`,
  'candidates[3].fracos[0]':
    `🔻 Caiado fell again in the victory contract, from 0.55% to 0.35%, and is now BELOW the 0.5% cut watched by the double reading. In the third-place contract he stands at 34.50%, behind Renan Santos's 55.50%.`,
  'candidates[3].analise':
    `⭐ THE PACK HAD THE MOST RELEVANT MOVE OF THE DAY, AND IT BELONGS TO PABLO MARÇAL. He filed his presidential candidacy through the PRTB, using an opening created by the TSE (Folha, Aug 20), and on the same day the Public Prosecutor's Office asked the TSE to bar the candidacy and keep him out of debates (Folha, Aug 19). The TSE also granted an injunction barring the use of official resources in his campaign (TSE, Aug 20). 📉 The price followed: from 0.75% on Aug 19 to 0.25% in today's reading. ⚠️ METHOD CAVEAT: 0.25% sits below the 0.5% floor the capture guard watches, so it is a book reading and not a confirmed price. His series holds only 6 readings, all between 0.60% and 1.10%, and starts on Aug 17. 📌 RONALDO CAIADO gave up ground from 0.55% to 0.35%, and in the third-place contract stands at 34.50%, behind Renan Santos's 55.50%. ROMEU ZEMA repeated 0.15% and FERNANDO HADDAD repeated 0.05%.`,

  'quadroComparativo[0].p': `NO NEW NATIONAL POLL. The most recent is still the ${NEXUS}, margin of 2pp, which measures him at 41% in the first round.`,
  'quadroComparativo[0].m': `63.50% (vol USD 8.74M), ${STAMP}. Unchanged for a third day.`,
  'quadroComparativo[1].p': `NO NEW NATIONAL POLL. The BTG/Nexus of Aug 17 measures him at 36% in the first round and 44% in the runoff.`,
  'quadroComparativo[1].m': `32.85% (vol USD 8.68M), ${STAMP}. Up 0.30pp, fourth day narrowing.`,
  'quadroComparativo[2].p': `NO NEW NATIONAL POLL. The BTG/Nexus of Aug 17 keeps him at 4% in the first round, BEHIND Caiado's 5%.`,
  'quadroComparativo[2].m': `4.45% (vol USD 10.28M), ${STAMP}. Up 0.40pp. In third place, 55.50%.`,
  'quadroComparativo[3].p': `NO NEW NATIONAL POLL. The BTG/Nexus of Aug 17 gives him 5% in the first round, ABOVE Renan Santos's 4%.`,
  'quadroComparativo[3].m': `0.35% (vol USD 6.37M), ${READ}. Below the 0.5% guard floor. In third place, 34.50%.`,
  'quadroComparativo[4].n': `Pablo Marçal (PRTB)`,
  'quadroComparativo[4].p': `NO NATIONAL POLL that includes him. The Datafolha of Aug 21 is the first to measure him.`,
  'quadroComparativo[4].m': `0.25% (vol USD 2.04M), ${READ}. Below the 0.5% guard floor. Series of 6 readings, since Aug 17.`,
  'quadroComparativo[5].m': `3.35% (vol USD 84 thousand), ${STAMP}.`,

  // ⚠️ `t` (trend) e `s` (context) fazem parte do schema e eu os havia derrubado
  // ao reescrever o bloco. O pre-commit `check-json-structure` bloqueou.
  'quadroComparativo[0].t': `➖ UNCHANGED for a THIRD straight day, at 63.50%. The distance to the runner-up narrowed another 0.30pp to 30.65pp, on the FOURTH straight day of approach, adding up to 6.40pp since Aug 16. The high of the series is 67.50%, from Aug 16.`,
  'quadroComparativo[0].s': `Fifth day of the official campaign, 45 days out from the first round. The case involving his son gained two layers on Aug 20: the Prosecutor General's Office contested part of the Federal Police's conclusion, according to Estadão, and he sued his opponent over a video made with artificial intelligence, according to O Globo.`,
  'quadroComparativo[1].t': `🔺 UP 0.30pp, from 32.55% to 32.85%, a fourth straight day closing the distance. ⛔ Not a record: in the joined series of 175 readings since May 23, only 2 print 32.85% or above, and both are 33.20%, from Jun 2 and Aug 18.`,
  'quadroComparativo[1].s': `He praised Pablo Marçal as "a good guy, prepared and well-intentioned", according to Estadão on Aug 20, on the same day the Public Prosecutor's Office asked the TSE to bar the other man's candidacy. And he said he looks at the Supreme Court "with disgust", talking about being a transition president, according to Folha.`,
  'quadroComparativo[2].t': `🔺 UP 0.40pp, from 4.05% to 4.45%, the largest move of this reading among the three names above 1%. The high of his series is 17.90%, from Jun 9.`,
  'quadroComparativo[2].s': `📌 The divergence with the ballot continues and nobody resolved it: the market pays 55.50% on him in the third-place contract against 34.50% on Caiado, while the BTG/Nexus of Aug 17 gives 5% to Caiado and 4% to him. He told Valor, on Aug 21, that Lula and Flávio are "completely burned".`,
  'quadroComparativo[3].t': `🔻 DOWN 0.20pp, from 0.55% to 0.35%, and now BELOW the 0.5% cut the double reading watches. In that band the variation is thin-book noise and does not support reading a trend.`,
  'quadroComparativo[3].s': `In declared voting intention he stays ahead of Renan Santos, 5% against 4%, and on price he is far behind: 0.35% against 4.45%. It is the inversion the panel has recorded since this week's first measurement.`,
  'quadroComparativo[4].t': `🔻 DOWN 0.50pp, from 0.75% to 0.25%, below the 0.5% cut. ⚠️ His series holds only 6 readings, all between 0.60% and 1.10%, and starts on Aug 17. It is a move to follow, not a firm measurement.`,
  'quadroComparativo[4].s': `He filed his candidacy through the PRTB, using an opening created by the TSE, according to Folha on Aug 20. On the same day the Public Prosecutor's Office asked the TSE to bar the candidacy and keep him out of debates, and the TSE granted an injunction barring the use of official resources. He remains ineligible until 2032.`,
  'quadroComparativo[5].t': `🔻 DOWN 0.05pp, from 3.40% to 3.35%. 📌 The book holds USD 84 thousand, and a move of that size in it does not support reading a trend.`,
  'quadroComparativo[5].s': `Contract on the impeachment of a Supreme Court justice before 2027, kept on the panel as an institutional thermometer. On Aug 20 Justice André Mendonça ruled on both sides of the race, at the Supreme Court and at the Electoral Court, and the contract did not move because of it.`,

  cruzamento:
    `⭐ THE FOUR-DAY PATTERN HELD, AND A NEW NAME ENTERED THE COUNT. On the ${STAMP}, LULA repeated 63.50% (vol USD 8.74M), unchanged for a THIRD straight day, and FLÁVIO BOLSONARO rose 0.30pp to 32.85% (vol USD 8.68M). The distance between the two narrowed to 30.65pp, on the FOURTH straight day of approach: it was 37.05pp on Aug 16, 33.05pp on Aug 17, 31.45pp on Aug 18 and 30.95pp on Aug 19, that is 6.40pp in four days. 🔑 THE ONE CLOSING THE DISTANCE IS STILL NOT THE ONE FALLING. The leader lost no price at all over three days. ⛔ NO SUPERLATIVE: 32.85% is NOT a record. In the joined series of 175 readings since May 23, only 2 print 32.85% or above, and both are 33.20%, from Jun 2 and Aug 18. ⭐ THE NEW FACT IS PABLO MARÇAL. He filed his candidacy through the PRTB using an opening created by the TSE (Folha, Aug 20); the Public Prosecutor's Office asked the TSE to bar the candidacy and keep him out of debates (Folha, Aug 19); the TSE granted an injunction barring the use of official resources in the campaign (TSE, Aug 20); and FLÁVIO BOLSONARO publicly praised him, "a good guy, prepared and well-intentioned" (Estadão, Aug 20). His price fell from 0.75% to 0.25%. ⚠️ CAVEAT: 0.25% sits below the 0.5% floor the guard watches, and his series holds 6 readings. It is a move to follow, not a firm measurement. 📌 THE CLEANEST DIVERGENCE ON THE PANEL IS STILL ABOUT THIRD PLACE: the market pays 55.50% on Renan Santos and 34.50% on Caiado, while the latest national poll, the BTG/Nexus of Aug 17, puts Caiado at 5% and Renan at 4%. Price and ballot disagree on who is third. 📊 The polls of the day are STATE-LEVEL and do not enter the national panel: AtlasIntel in Pará (Lula 48.9% x Flávio 37.4% in the first round) and Ipsos-Ipec in Ceará (Ciro Gomes 43% x Elmano 35% for governor). ⏭️ THE NATIONAL DATAFOLHA PUBLISHES ON Aug 21 and is the first taken after candidacy registration, and the first to include Pablo Marçal.`,
})

// ─────────────────────────────────────────────── polls-data
construir('polls-data', 'en', {
  'polymarketComparison.note':
    `Confirmed reading of Aug 20, 11:19 PM BRT, approved by two independent readings eight minutes apart. The distance between Lula and Flávio Bolsonaro narrowed for a FOURTH straight day and closed at 30.65pp, against 37.05pp on Aug 16. The leader repeated 63.50% for a third day, and the entire approach came from the runner-up rising. ⛔ No superlative: 32.85% is not a record, and in the joined series of 175 readings since May 23 only 2 print that value or above, both at 33.20%, from Jun 2 and Aug 18. ⚠️ Ronaldo Caiado, Pablo Marçal, Romeu Zema, Tarcísio and Fernando Haddad sit below 0.5%, the floor watched by the double reading, so they are book readings and not confirmed prices.`,
  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `➖ UNCHANGED for a THIRD straight day, at 63.50% (vol USD 8.74M accumulated), confirmed reading of Aug 20, 11:19 PM BRT. The distance to the runner-up narrowed another 0.30pp to 30.65pp, on the FOURTH straight day of approach, adding up to 6.40pp since Aug 16. 🔑 The narrowing still does not come from him: over three days he lost no price at all. The high of the series is 67.50%, from Aug 16, and 63.50% is its most repeated value, in 20 of the 175 readings since May 23.`,
  'polymarketComparison.candidates[1].polymarket': `32.85%`,
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `🔺 UP 0.30pp, from 32.55% to 32.85% (vol USD 8.68M accumulated), confirmed reading of Aug 20, 11:19 PM BRT, on his fourth straight day closing the distance to the leader. ⛔ Not a record: in the joined series of 175 readings since May 23, only 2 print 32.85% or above, and both are 33.20%, from Jun 2 and Aug 18. In the second-place contract he stands at 87.50%.`,
  'polymarketComparison.candidates[2].polymarket': `4.45%`,
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `🔺 UP 0.40pp, from 4.05% to 4.45% (vol USD 10.28M accumulated), confirmed reading of Aug 20, 11:19 PM BRT, the largest move of this reading among the three names above 1%, against 0.30pp for Flávio Bolsonaro and 0.00pp for Lula. ⭐ In the THIRD-PLACE contract he stands at 55.50%, against 34.50% for Ronaldo Caiado, while the latest national poll, from Aug 17, gives 5% to Caiado and 4% to him: price and ballot disagree on who is third. The high of his series is 17.90%, from Jun 9.`,
  'polymarketComparison.candidates[3].polymarket': `0.35%`,
  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `🔻 DOWN 0.20pp, from 0.55% to 0.35% (vol USD 6.37M accumulated), reading of Aug 20, 11:19 PM BRT. ⚠️ He sits below 0.5%, the floor watched by the double reading, so this is a book reading and not a confirmed price. In the third-place contract he stands at 34.50%.`,
  'polymarketComparison.candidates[4].polymarket': `0.25%`,
  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `🔻 DOWN 0.50pp, from 0.75% to 0.25% (vol USD 2.04M accumulated), reading of Aug 20, 11:19 PM BRT, on the day he filed his candidacy through the PRTB and the Public Prosecutor's Office asked the TSE to bar it. ⚠️ He sits below the 0.5% floor of the double reading, and his series holds only 6 readings, all between 0.60% and 1.10%, starting on Aug 17. It is a move to follow, not a firm measurement.`,
  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `➖ UNCHANGED, at 0.05% (vol USD 13.93M accumulated), reading of Aug 20, 11:19 PM BRT. ⚠️ Below the 0.5% floor of the double reading. He leads accumulated volume in the presidential book in this reading, with USD 13.93M against USD 10.44M for the second, Eduardo Bolsonaro, and sits among the lowest prices.`,
  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `➖ UNCHANGED, at 0.15% (vol USD 5.75M accumulated), reading of Aug 20, 11:19 PM BRT. ⚠️ Below the 0.5% floor of the double reading. In the third-place contract he stands at 4.35%.`,
  'polymarketComparison.candidates[7].tendenciaPolymarket':
    `➖ UNCHANGED, at 0.05% (vol USD 7.28M accumulated), reading of Aug 20, 11:19 PM BRT. ⚠️ Below the 0.5% floor of the double reading.`,
})
