'use client';

/**
 * "Casos validados" — faixa de destaque no topo do /global.
 * Lê os bundles COUNTRY_DIVERGENCE (eleições já realizadas, com divergência mercado × pesquisa
 * cruzada contra o resultado real). Cresce sozinho conforme novos países ganham bundle.
 * Separa explicitamente o que é "analisado a fundo" do "só odds ao vivo" (abaixo, no GlobalContent).
 */
import { COUNTRY_DIVERGENCE } from '../../../lib/country-data';
import { COUNTRIES_SEO } from '../../../lib/seo/countries';

type Locale = 'pt-BR' | 'en' | 'es';

// emoji de bandeira não renderiza no Windows (vira "PE"/"CO") → usar SVG, como o resto da plataforma
const ISO3_TO_CC: Record<string, string> = { BRA: 'br', FRA: 'fr', DEU: 'de', GBR: 'gb', CAN: 'ca', AUS: 'au', KOR: 'kr', COL: 'co', PER: 'pe', CHL: 'cl', IND: 'in', MEX: 'mx', NGA: 'ng', PHL: 'ph', USA: 'us' };

const LABELS: Record<Locale, { title: string; subtitle: string; analysis: string; poll: string; market: string; completed: string; firstRound: string }> = {
  'pt-BR': { title: 'Casos validados', subtitle: 'O método contra o resultado real — eleições já realizadas, com divergência mercado × pesquisa cruzada e dataset aberto.', analysis: 'Ver análise de divergência', poll: 'pesquisas', market: 'candidatos no mercado', completed: 'Encerrada', firstRound: '1º turno · resultado conhecido' },
  en: { title: 'Validated cases', subtitle: 'The method against the real result — already-held elections, with cross-referenced market × poll divergence and an open dataset.', analysis: 'See divergence analysis', poll: 'polls', market: 'market candidates', completed: 'Completed', firstRound: 'First round · result known' },
  es: { title: 'Casos validados', subtitle: 'El método contra el resultado real — elecciones ya realizadas, con divergencia mercado × encuesta cruzada y dataset abierto.', analysis: 'Ver análisis de divergencia', poll: 'encuestas', market: 'candidatos en el mercado', completed: 'Finalizada', firstRound: '1ª vuelta · resultado conocido' },
};

const TAGLINE: Record<string, Record<Locale, string>> = {
  PER: {
    'pt-BR': 'O favorito do mercado por meses (López Aliaga) ficou em 3º e não foi ao 2º turno — divergência sustentada, não ruído.',
    en: "The market's months-long favorite (López Aliaga) placed 3rd and missed the runoff — sustained divergence, not noise.",
    es: 'El favorito del mercado por meses (López Aliaga) quedó 3º y no llegó al balotaje — divergencia sostenida, no ruido.',
  },
  COL: {
    'pt-BR': 'O mercado precificou a vitória de De la Espriella (43,5%) e ele venceu o 1º turno (43,7%) — divergência quase nula no líder de votos.',
    en: 'The market priced De la Espriella to win (43.5%) and he won the first round (43.7%) — near-zero divergence on the vote leader.',
    es: 'El mercado valoró la victoria de De la Espriella (43,5%) y ganó la primera vuelta (43,7%) — divergencia casi nula en el líder de votos.',
  },
  CHL: {
    'pt-BR': 'Jara liderou o voto de 1º turno, mas o mercado precificava Kast em ~66% para vencer — e Kast venceu o runoff 58×42. A diferença foi o sinal.',
    en: 'Jara led the first-round vote, but the market priced Kast at ~66% to win — and Kast won the runoff 58–42. The gap was the signal.',
    es: 'Jara lideró el voto de primera vuelta, pero el mercado valoró a Kast en ~66% para ganar — y Kast ganó el balotaje 58–42. La brecha fue la señal.',
  },
  DEU: {
    'pt-BR': 'A AfD foi 2º em votos (~21%), mas o mercado lhe dava só ~3% de vencer (mais cadeiras) — voto não é vitória. A CDU/CSU venceu, como o mercado (~97%) cravava.',
    en: 'The AfD was 2nd in votes (~21%) but the market gave it only ~3% to win the most seats — vote share is not winning. CDU/CSU won, as the market (~97%) called.',
    es: 'La AfD fue 2ª en votos (~21%) pero el mercado le daba solo ~3% de ganar más escaños — el voto no es la victoria. La CDU/CSU ganó, como el mercado (~97%) anticipaba.',
  },
};

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
          const tag = TAGLINE[c.iso3]?.[locale] || c.election.matchup;
          const badge = c.election.status === 'completed' ? l.completed : l.firstRound;
          return (
            <a key={c.iso3} href={`/${locale}/country/${slug}`} className="block border border-light-border rounded-xl p-4 bg-light-bg hover:border-primary/40 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-2 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {cc && <img src={`/flags/${cc}.svg`} alt="" aria-hidden="true" width={24} height={16} className="rounded-sm object-cover shadow-sm flex-shrink-0" style={{ width: 24, height: 16 }} />}
                  <span className="font-bold text-dark text-sm truncate">{name}</span>
                </div>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium flex-shrink-0 whitespace-nowrap">{badge}</span>
              </div>
              <p className="text-xs text-gray-600 leading-snug mb-3">{tag}</p>
              <div className="flex items-center justify-between text-[11px] gap-2">
                <span className="text-primary font-semibold whitespace-nowrap">{l.analysis} →</span>
                <span className="text-gray-400 text-right">{c.polls_count} {l.poll} · {c.market_candidates} {l.market}</span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
