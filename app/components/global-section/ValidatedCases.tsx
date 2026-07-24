'use client';

/**
 * "Casos validados", faixa de destaque no topo do /global.
 * Lê os bundles COUNTRY_DIVERGENCE (eleições já realizadas, com divergência mercado × pesquisa
 * cruzada contra o resultado real). Cresce sozinho conforme novos países ganham bundle.
 * Separa explicitamente o que é "analisado a fundo" do "só odds ao vivo" (abaixo, no GlobalContent).
 */
import { COUNTRY_DIVERGENCE } from '../../../lib/country-data';
import { COUNTRIES_SEO, ISO3_TO_CC } from '../../../lib/seo/countries';

type Locale = 'pt-BR' | 'en' | 'es';

const LABELS: Record<Locale, { title: string; subtitle: string; analysis: string; poll: string; market: string; completed: string; firstRound: string }> = {
  'pt-BR': { title: 'Casos validados', subtitle: 'O método contra o resultado real: eleições já realizadas, com divergência mercado × pesquisa cruzada e dataset aberto.', analysis: 'Ver análise de divergência', poll: 'pesquisas', market: 'candidatos no mercado', completed: 'Encerrada', firstRound: '1º turno · resultado conhecido' },
  en: { title: 'Validated cases', subtitle: 'The method against the real result: already-held elections, with cross-referenced market × poll divergence and an open dataset.', analysis: 'See divergence analysis', poll: 'polls', market: 'market candidates', completed: 'Completed', firstRound: 'First round · result known' },
  es: { title: 'Casos validados', subtitle: 'El método contra el resultado real: elecciones ya realizadas, con divergencia mercado × encuesta cruzada y dataset abierto.', analysis: 'Ver análisis de divergencia', poll: 'encuestas', market: 'candidatos en el mercado', completed: 'Finalizada', firstRound: '1ª vuelta · resultado conocido' },
};

const TAGLINE: Record<string, Record<Locale, string>> = {
  USA: {
    'pt-BR': 'O caso mais honesto do acervo: os dois mercados discordaram. O de vencedor (colégio eleitoral, **~US$ 3,7 bi**, o maior mercado eleitoral da história) dava Trump em ~56% contra o empate técnico das pesquisas, e acertou; o de voto popular dava Harris em ~74% e errou (Trump venceu o voto popular). A AFOS mostra o acerto e o erro do mercado lado a lado.',
    en: 'The most honest case here: the two markets disagreed. The winner market (electoral college, **~US$3.7bn**, the largest election market in history) gave Trump ~56% against a poll near-tie, and was right; the popular-vote market gave Harris ~74% and was wrong (Trump won the popular vote too). AFOS shows the market’s hit and its miss side by side.',
    es: 'El caso más honesto del acervo: los dos mercados se contradijeron. El de ganador (colegio electoral, **~US$3,7bn**, el mayor mercado electoral de la historia) daba a Trump ~56% frente al empate de las encuestas, y acertó; el de voto popular daba a Harris ~74% y se equivocó (Trump también ganó el voto popular). AFOS muestra el acierto y el error lado a lado.',
  },
  PER: {
    'pt-BR': 'O favorito do mercado por meses (López Aliaga) ficou em 3º e não foi ao 2º turno: divergência sustentada, não ruído. No 2º turno (07/jun) o mercado deu Fujimori a ~68% enquanto as pesquisas viam empate técnico, e ela venceu por ~0,27pp: a JNE proclamou Keiko Fujimori (50,135% × 49,865%) em 03/jul. Acertou a direção, superestimou a folga. Volume total do mercado: **~US$107M**.',
    en: "The market's months-long favorite (López Aliaga) placed 3rd and missed the runoff: sustained divergence, not noise. In the June 7 runoff the market gave Fujimori ~68% while polls saw a technical tie, and she won by ~0.27pp: the JNE proclaimed Keiko Fujimori (50.135% × 49.865%) on July 3. Right on direction, overstated the margin. Total market volume: **~US$107M**.",
    es: 'El favorito del mercado por meses (López Aliaga) quedó 3º y no llegó al balotaje: divergencia sostenida, no ruido. En el balotaje del 7 jun el mercado dio a Fujimori ~68% mientras las encuestas veían empate técnico, y ganó por ~0,27pp: el JNE proclamó a Keiko Fujimori (50,135% × 49,865%) el 3 jul. Acertó la dirección, sobreestimó la ventaja. Volumen total del mercado: **~US$107M**.',
  },
  COL: {
    'pt-BR': 'De la Espriella venceu o 1º turno (31/mai, 43,7%), com o mercado já o precificando favorito (43,5%): divergência quase nula. No 2º turno (21/jun) venceu por ~0,96pp (49,66% × 48,70%), mas o mercado dava vitória quase certa (88,5%): acertou o vencedor, superestimou a folga. Volume total do mercado: **~US$ 37M**.',
    en: 'De la Espriella won the first round (May 31, 43.7%), with the market already pricing him favorite (43.5%): near-zero divergence. In the June 21 runoff he won by ~0.96pp (49.66% × 48.70%), though the market gave near-certain victory (88.5%): right winner, overstated margin. Total market volume: **~US$37M**.',
    es: 'De la Espriella ganó la primera vuelta (31/may, 43,7%), con el mercado ya valorándolo favorito (43,5%): divergencia casi nula. En el balotaje del 21/jun ganó por ~0,96pp (49,66% × 48,70%), aunque el mercado le daba victoria casi segura (88,5%): acertó el ganador, sobreestimó la ventaja. Volumen total del mercado: **~US$37M**.',
  },
  CHL: {
    'pt-BR': 'Jara liderou o voto de 1º turno, mas o mercado precificava Kast em ~66% para vencer, e Kast venceu o runoff 58×42. A diferença foi o sinal. Volume total do mercado: **~US$ 49M**.',
    en: 'Jara led the first-round vote, but the market priced Kast at ~66% to win, and Kast won the runoff 58×42. The gap was the signal. Total market volume: **~US$49M**.',
    es: 'Jara lideró el voto de primera vuelta, pero el mercado valoró a Kast en ~66% para ganar, y Kast ganó el balotaje 58×42. La brecha fue la señal. Volumen total del mercado: **~US$49M**.',
  },
  DEU: {
    'pt-BR': 'A AfD foi 2º em votos (~21%), mas o mercado lhe dava só ~3% de vencer (mais cadeiras). Voto não é vitória. A CDU/CSU venceu, como o mercado (~97%) cravava. Volume total do mercado: **~US$ 106M**.',
    en: 'The AfD was 2nd in votes (~21%) but the market gave it only ~3% to win the most seats. Vote share is not winning. CDU/CSU won, as the market (~97%) called. Total market volume: **~US$106M**.',
    es: 'La AfD fue 2ª en votos (~21%) pero el mercado le daba solo ~3% de ganar más escaños. El voto no es la victoria. La CDU/CSU ganó, como el mercado (~97%) anticipaba. Volumen total del mercado: **~US$106M**.',
  },
  CAN: {
    'pt-BR': 'O mercado virou ~85% Conservadores (jan) → ~80% Liberais (abr) com o voto quase empatado, e os Liberais venceram (169×144). A virada foi o sinal. Volume total do mercado: **~US$ 12M**.',
    en: 'The market swung ~85% Conservative (Jan) → ~80% Liberal (Apr) with the vote near-tied, and the Liberals won (169×144). The swing was the signal. Total market volume: **~US$12M**.',
    es: 'El mercado viró ~85% Conservadores (ene) → ~80% Liberales (abr) con el voto casi empatado, y los Liberales ganaron (169×144). El vuelco fue la señal. Volumen total del mercado: **~US$12M**.',
  },
  GBR: {
    'pt-BR': 'O Labour de Starmer venceu com 411 das 650 cadeiras. O mercado dava cerca de 99% de ter a maior bancada e a pesquisa media cerca de 40% de voto: o sistema distrital virou 33,7% dos votos em 63% das cadeiras. O Reform foi 3º em votos e levou só 5 cadeiras. Volume total do mercado: **~US$ 1,76M**.',
    en: "Starmer's Labour won 411 of 650 seats. The market gave it about 99% to win the most seats while polls measured about 40% of the vote: first-past-the-post turned 33.7% of votes into 63% of seats. Reform was third in votes yet took only 5 seats. Total market volume: **~US$1.76M**.",
    es: 'El Laborismo de Starmer ganó 411 de 650 escaños. El mercado le daba cerca del 99% de lograr la mayor bancada y la encuesta medía cerca del 40% del voto: el sistema convirtió 33,7% de los votos en 63% de los escaños. Reform fue 3º en votos y obtuvo solo 5 escaños. Volumen total del mercado: **~US$1,76M**.',
  },
  MEX: {
    'pt-BR': 'Sheinbaum venceu a presidência de 2024 com cerca de 59,8%, a maior votação da história do México. Desde janeiro o mercado já a dava em cerca de 90% de vencer, enquanto a pesquisa media seu voto em torno de 50%. O mercado cravou o desfecho cedo e o resultado superou as pesquisas. Volume total do mercado: **~US$ 2,08M**.',
    en: "Sheinbaum won the 2024 presidency with about 59.8%, the largest vote count in Mexican history. From January the market already gave her about 90% to win, while polls measured her vote share around 50%. The market called the outcome early and the result outran the polls. Total market volume: **~US$2.08M**.",
    es: 'Sheinbaum ganó la presidencia de 2024 con cerca del 59,8%, la mayor votación en la historia de México. Desde enero el mercado ya la daba en cerca del 90% de ganar, mientras la encuesta medía su voto en torno al 50%. El mercado fijó el desenlace temprano y el resultado superó a las encuestas. Volumen total del mercado: **~US$2,08M**.',
  },
  KOR: {
    'pt-BR': 'Lee Jae-myung venceu a presidencial antecipada de 2025, convocada após a crise da lei marcial. O mercado deu a Lee cerca de 95% de vencer e cravou até a margem (faixa de 8 a 11pp; a real foi 8,27pp), enquanto a pesquisa media seu voto em torno de 49%. Um dos maiores mercados eleitorais já vistos fora dos EUA (**~US$ 290M**).',
    en: 'Lee Jae-myung won the 2025 snap election, called after the martial-law crisis. The market gave Lee about 95% to win and even nailed the margin (the 8-to-11pp band; the actual margin was 8.27pp), while polls measured his vote share around 49%. One of the largest election markets ever outside the US (**~US$290M**).',
    es: 'Lee Jae-myung ganó la elección anticipada de 2025, convocada tras la crisis de la ley marcial. El mercado dio a Lee cerca del 95% de ganar e incluso acertó el margen (la franja de 8 a 11pp; el real fue 8,27pp), mientras la encuesta medía su voto en torno al 49%. Uno de los mayores mercados electorales fuera de EE. UU. (**~US$290M**).',
  },
  FRA: {
    'pt-BR': 'Por PARTIDO isolado, o RN de Le Pen foi a maior bancada (143 cadeiras), e o mercado mais fundo (**~US$ 917k**) precificou isso em ~99% e acertou. O que virou foi o GOVERNO: a coligação de esquerda NFP fez a maior bancada por coligação (182) via front républicain. O hype de uma quase-maioria do RN (230-270 cadeiras) viveu nas pesquisas e nos mercados rasos e não sobreviveu no volume.',
    en: 'By SINGLE party, Le Pen’s RN was the largest group (143 seats), and the deepest market (**~US$917k**) priced that at ~99% and was right. What flipped was the GOVERNMENT: the left-wing NFP coalition held the most seats by coalition (182) via the front républicain. The near-RN-majority hype (230-270 seats) lived in polls and thin markets and did not survive at volume.',
    es: 'Por PARTIDO individual, el RN de Le Pen fue la mayor bancada (143 escaños), y el mercado más profundo (**~US$917k**) lo valoró en ~99% y acertó. Lo que se dio vuelta fue el GOBIERNO: la coalición de izquierda NFP tuvo la mayor bancada por coalición (182) vía front républicain. El hype de casi-mayoría del RN (230-270 escaños) vivió en encuestas y mercados finos y no sobrevivió al volumen.',
  },
  IND: {
    'pt-BR': 'A maior eleição da história (~980 milhões de eleitores aptos). O mercado (**~US$ 835 mil**) e as pesquisas concordaram entre si e superestimaram juntos: acertaram o vencedor (a NDA, de Modi) e erraram muito o tamanho, previram 350 a 400 das 543 cadeiras e deu ~293. O BJP perdeu a maioria que governava sozinho (240). No voto foi quase-empate (43,8% × 41,48%): a oposição se uniu, e o voto estável de Modi virou derrota de cadeira.',
    en: 'The largest election in history (~980M eligible voters). The market (**~US$835k**) and the polls agreed with each other and overestimated together: right on the winner (Modi’s NDA), very wrong on the size, projecting 350 to 400 of 543 seats against ~293. The BJP lost the single-party majority it governed with (240). The vote was a near-tie (43.8% × 41.48%): the opposition unified, and Modi’s stable vote became a seat defeat.',
    es: 'La mayor elección de la historia (~980 millones de electores). El mercado (**~US$835k**) y las encuestas coincidieron entre sí y sobreestimaron juntos: acertaron el ganador (la NDA, de Modi) y erraron mucho el tamaño, proyectaron 350 a 400 de 543 escaños y fueron ~293. El BJP perdió la mayoría propia (240). En votos fue casi empate (43,8% × 41,48%): la oposición se unió y el voto estable de Modi se volvió derrota de escaños.',
  },
};

// Renderiza a tagline com suporte a **negrito** (marcador markdown simples), bolando o destaque de volume.
function renderTag(s: string) {
  return s.split('**').map((seg, i) => (i % 2 === 1 ? <strong key={i} className="font-bold text-dark">{seg}</strong> : seg));
}

export function ValidatedCases({ locale }: { locale: Locale }) {
  const l = LABELS[locale] || LABELS['pt-BR'];
  const cases = Object.values(COUNTRY_DIVERGENCE);
  if (!cases.length) return null;
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-primary mb-0.5">⭐ {l.title}</h2>
      <p className="text-xs text-gray-500 mb-4 max-w-2xl leading-relaxed">{l.subtitle}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cases.map((c) => {
          const seo = COUNTRIES_SEO.find((s) => s.iso3 === c.iso3);
          const slug = seo?.slug[locale] || seo?.slug['en'] || '';
          const name = seo?.name[locale] || seo?.name['en'] || c.iso3;
          const cc = ISO3_TO_CC[c.iso3] || '';
          const tag = TAGLINE[c.iso3]?.[locale] || c.election?.matchup || '';
          const year = c.election?.first_round?.slice(0, 4) || '';
          const badge = c.election?.status === 'completed' ? l.completed : l.firstRound;
          return (
            <a key={c.iso3} href={`/${locale}/country/${slug}`} className="block border border-light-border rounded-xl p-4 bg-light-bg hover:border-primary/40 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-2 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {cc && <img src={`/flags/${cc}.svg`} alt="" aria-hidden="true" width={24} height={16} loading="lazy" decoding="async" className="rounded-sm object-cover shadow-sm flex-shrink-0" style={{ width: 24, height: 16 }} />}
                  <div className="flex items-baseline gap-1.5 min-w-0">
                    <span className="font-bold text-dark text-sm truncate">{name}</span>
                    {year && <span className="text-xs font-semibold text-dark flex-shrink-0">{year}</span>}
                  </div>
                </div>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium flex-shrink-0 whitespace-nowrap">{badge}</span>
              </div>
              <p className="text-xs text-gray-600 leading-snug mb-3">{renderTag(tag)}</p>
              <div className="flex items-center justify-between text-[11px] gap-2">
                <span className="text-primary font-semibold whitespace-nowrap">{l.analysis} →</span>
                <span className="text-gray-400 text-right">{c.polls_count ?? 0} {l.poll} · {c.market_candidates ?? 0} {l.market}</span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
