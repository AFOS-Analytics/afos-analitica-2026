/**
 * Mapa EN de polls-data.json — /atualizar-brz 04/Ago/2026.
 *
 * O dia publica METADE do cruzamento: a urna é de hoje, o preço é de 03/Ago,
 * porque a trava de captura bloqueou quatro rodadas. Os campos
 * `tendenciaPolymarket` só ganharam o prefixo de data, então a tradução deles
 * é derivada do arquivo publicado em vez de reescrita.
 */
import { readFileSync } from 'fs'
import { construir } from '../build-locale-json'

const G = (termo: string, id: string) => `[${termo}](/en/glossary#${id})`
const NEXUS = G('BTG/Nexus', 'nexus-btg')
const ATLAS = G('AtlasIntel', 'atlasintel')
const STF = G('STF', 'stf')
const TSE = G('TSE', 'tse')

// os 7 campos que só ganharam prefixo: reaproveita a tradução já publicada
const anterior = JSON.parse(readFileSync('public/polls-data.en.json', 'utf-8'))
const PREFIXO = '[price as of Aug 3] '
const prefixados: Record<string, string> = {}
anterior.polymarketComparison.candidates.forEach((c: any, i: number) => {
  if (typeof c.tendenciaPolymarket === 'string' && c.tendenciaPolymarket.length) {
    const limpo = c.tendenciaPolymarket.replace(/^\[price as of Aug 3\] /, '')
    prefixados[`polymarketComparison.candidates[${i}].tendenciaPolymarket`] = PREFIXO + limpo
  }
})

construir('polls-data', 'en', {
  ...prefixados,

  'polls[0].note':
    `${NEXUS} national poll released Aug 3, the 8th round in the series, and the first of the four national polls the ${TSE} filing had scheduled between Aug 3 and Aug 5. First round Lula 41% x Flávio 37%, with Caiado at 5%, Renan Santos at 4% and Zema at 3%. Runoff Lula 46% x Flávio 45%, a 1pp difference that falls WITHIN the 2pp margin and is therefore a ${G('statistical tie', 'empate-tecnico')}. Fieldwork Jul 31 to Aug 2, n=2,002, telephone, 2pp margin, 95% confidence, filing BR-02874/2026. WHAT CHANGES THE WEEK IS THE COMPARISON WITH THE INSTITUTE'S OWN PREVIOUS ROUND: the first-round gap FELL FROM 9pp TO 4pp in a single round, against the 42% x 33% of Jul 27. And the move comes almost entirely from one side, because LULA GAVE UP 1pp and FLÁVIO GAINED 4pp. In the runoff the tightening is sharper still, from 4pp to 1pp, with Lula going from 47% to 46% and Flávio from 43% to 45%. The round's other runoffs: Lula 46% x Caiado 42%, Lula 46% x Zema 40% and Lula 47% x Renan Santos 37%. AGAINST THE OTHER HOUSES, among the four national polls released since Jul 29 this is the one showing the tightest first round: 4pp here, against 6pp in PoderData of Jul 30, 9.1pp in ${ATLAS} of Jul 29 and 9.3pp in Vox Brasil of Jul 31. The distance between the highest and the lowest reading reaches 5.3pp and is larger than any price move in the period. ⚠️ REJECTION NOT PUBLISHED BY THIS PANEL: the secondary sources DISAGREE. Poder360, CNN Brasil and Correio Braziliense report 49% for each of the two; Money Times reports 50% for Lula and 51% for Flávio. The institute's release note does not carry the figure, so it could not be settled against a primary source and the number stays out, with the disagreement declared here. ⚠️ CORRECTION PUBLISHED ON Aug 4: this entry said the round had carried no approval figures, and it had. The data came out in the Aug 4 coverage, from the SAME round BR-02874/2026: government approval at 47% against 48% disapproval, and administration ratings at 37% excellent or good, 18% average and 43% poor or terrible. The panel corrects rather than rewriting in silence.`,

  'approvalData.note':
    `FRESH APPROVAL DATA, and the finding is the STILLNESS. ${NEXUS} of Aug 3 gives 47% government approval against 48% disapproval. Inside the institute's own series, approval has been STUCK at 47% for three straight rounds: 47% x 47% on Jul 13, 47% x 49% on Jul 27 and 47% x 48% now. What moved was disapproval, and it moved 2pp up and 1pp back down, inside the 2pp margin both times. In other words, the house series describes a divided and stable electorate, not a trend. ADMINISTRATION RATINGS, which is a different question from approval and does not mix with it: 37% excellent or good, 18% average and 43% poor or terrible, with 2% offering no opinion. Against the institute's Jul 27 round it was 36% and 43%, so also all but still. ⚠️ THE PANEL CHANGED SOURCE ON THIS FIELD: through Aug 3 it carried the Jul 29 reading, and a direct comparison between different houses is not valid, because method and sample frame change. The comparison that holds is Nexus against Nexus, made above. PoderData/Aya of Jul 30, the other recent reading, gave 43% x 49% on personal approval and 34% x 47% on administration, a considerably harsher picture. The two houses keep pointing different ways and the panel records both without arbitrating. NO FRESHER READING SINCE: the ${TSE} sweep of Aug 4 read 537 filings and inserted none. ${G('Quaest', 'quaest')} (n=2,004) and Ideia/Canal Meio (n=1,500) have publication declared for Aug 5.`,
  'approvalData.source':
    `BTG/Nexus Aug 3, 2026 (fieldwork Jul 31 to Aug 2, n=2,002, telephone, 2pp margin, 95% confidence, BR-02874/2026). Approval figures released in the Aug 4 coverage, via Poder360, CNN Brasil, Metrópoles, Correio Braziliense, Terra and Brasil 247.`,

  'polymarketComparison.note':
    `⚠️ THE PRICES IN THIS SECTION ARE FROM Aug 3, FROM THE CAPTURE LOCKED AT 19:11 UTC, AND NOT FROM TODAY. The Aug 4 round publishes no fresh price because the capture lock blocked four times in a row: Caiado's book swung between 1.65% and 2.30% across readings eight minutes apart, and the panel does not publish a price that two independent readings fail to confirm. The POLLING side, that one is from today. --- WHAT THE Aug 3 PRICES SAY: Lula at 65.50% (vol USD 7.92M) and Flávio at 25.45% (vol USD 7.86M), with a gap of +40.05pp. On that day both measurements moved the same way and for the same reason, with the leader standing still and the challenger rising, which is rare on this panel. Worth repeating what that was NOT: convergence in level. The market pays probability of victory and the polling measures share of the vote, and the two do not subtract. --- WHY THE BOOK IS IN TRANSIT TODAY, and this is a record and not an explanation: Aug 4 was the day Zema announced his running mate, Senator Eduardo Girão of the ${G('Novo', 'novo')} party, and the day Flávio received TWO alliance refusals, from Republicanos and Podemos, leaving him without a running mate eleven days from the deadline he himself declared. The third way is precisely where the lock has been blocking. The panel attributes no cause: it records that the repricing is under way and that this is why no number is published. --- THE POLLING, THAT ONE IS FROM TODAY: ${NEXUS} of Aug 3 (BR-02874/2026) published government approval at 47% against 48%, a figure that was not in yesterday's release and came out in today's coverage. Approval has been stuck at 47% for three rounds of the same house.`,
  'polymarketComparison.sources':
    `${G('Polymarket', 'polymarket')} prices via the AFOS proxy, capture locked at 19:11 UTC on Aug 3 (scripts/capture-guard.ts). On Aug 4 the lock blocked four rounds and no fresh price was published. BTG/Nexus poll of Aug 3, TSE filing BR-02874/2026, with the approval figures released in the Aug 4 coverage. TSE sweep of Aug 4: 537 filings, none new.`,

  'polymarketComparison.candidates[0].tendenciaPesquisa':
    `POLLING FROM Aug 3, WITH THE APPROVAL FIGURES RELEASED ON Aug 4. ${NEXUS} (n=2,002, fieldwork Jul 31 to Aug 2, telephone, 2pp margin, BR-02874/2026) gives 41% in the first round, against 42% in the institute's own Jul 27 round, and 46% in the runoff against Flávio, against 47% before. Both declines are 1pp and fall within the margin. What is movement is the other side: Flávio gained 4pp in the first round and 2pp in the runoff, and that is why the gap fell from 9pp to 4pp and the runoff became a statistical tie. GOVERNMENT APPROVAL at 47% against 48% disapproval, and here the finding is the stillness: approval has been stuck at 47% across the house's last three rounds, with disapproval going from 47% to 49% and back to 48%, always inside the margin. Among the four national polls since Jul 29, this is the one showing the tightest first round: 4pp here, 6pp in PoderData, 9.1pp in ${ATLAS} and 9.3pp in Vox Brasil.`,
  'polymarketComparison.candidates[1].tendenciaPesquisa':
    `${NEXUS} of Aug 3 gives 37% in the first round, against 33% in the institute's own Jul 27 round, a 4pp rise that is DOUBLE the 2pp margin and therefore not explained by sampling noise. In the runoff he goes from 43% to 45% and sits 1pp behind Lula, within the margin, which qualifies as a statistical tie. The reading needs house context: the other three national polls since Jul 29 give first-round gaps of 6pp to 9.3pp, so this is the most favourable to him, and the distance between the highest and the lowest reading reaches 5.3pp. On Aug 4 he received TWO alliance refusals, from Republicanos and Podemos, and remains without a running mate.`,
})
