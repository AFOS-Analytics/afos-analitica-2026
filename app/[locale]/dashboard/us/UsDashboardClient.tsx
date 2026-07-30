'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '../../../i18n/context';
import { VisitorStateProvider } from '../../../hooks/useVisitorState';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { ModalAbout } from '../../../components/ModalAbout';
import { ModalMetas } from '../../../components/ModalMetas';
import { LazyAboutMessages } from '../../../components/LazyAboutMessages';
import { CountrySelector } from '../../../components/CountrySelector';
import { UsPollsSection } from '../../../components/UsPollsSection';
import { UsMarketSection } from '../../../components/UsMarketSection';
import { UsLimitationsSection } from '../../../components/UsLimitationsSection';
import { CountryGraph } from '../../../components/CountryGraph';
import { SectionTitle } from '../../../components/ui';
import type { CountryContext, CountryDivergence } from '../../../../lib/country-data';
import { StructuralContext } from '../../../components/StructuralContext';
import type { UsMarketData } from '../../../components/UsMarketSection';
import type { UsPollsData } from '../../../../lib/dashboard/us-static-data';

/**
 * Casca do painel dos EUA.
 *
 * ⚠️ NÃO PUBLICADA. A página existe para as peças do bloco 5 irem pousando nela
 * (mercado, pesquisas, grafo, contexto estrutural, imprensa), na ordem de seções
 * que o André aprovou em 28/Jul. Enquanto isso:
 *   - `robots: noindex` no page.tsx,
 *   - fora do sitemap, do llms.txt e do IndexNow,
 *   - e o seletor do painel do Brasil mostra "em breve" SEM link, então nenhum
 *     visitante chega aqui por navegação.
 * Só quem digitar o endereço vê esta tela, que é exatamente o que se quer para
 * trabalhar em cima dela com o site no ar.
 */

const T = {
  'pt-BR': {
    title: 'Painel Estados Unidos',
    building: 'Em construção.',
    body: 'As eleições de meio de mandato são em 3 de novembro de 2026. Esta página ainda não está publicada e não deve ser divulgada.',
  },
  en: {
    title: 'United States panel',
    building: 'Under construction.',
    body: 'The midterm elections are on November 3, 2026. This page is not published yet and should not be shared.',
  },
  es: {
    title: 'Panel Estados Unidos',
    building: 'En construcción.',
    body: 'Las elecciones de medio término son el 3 de noviembre de 2026. Esta página aún no está publicada y no debe difundirse.',
  },
};

function UsDashboardContent({ pollsData, context }: { pollsData: UsPollsData | null; context?: CountryContext }) {
  const { locale } = useTranslation();
  const tKey = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as keyof typeof T;
  const t = T[tKey];

  const tGrafo = {
    'pt-BR': {
      titulo: 'O cruzamento',
      eleicao: 'EUA 2026 · Câmara',
      nota: 'A linha entre o mercado e cada partido é tracejada e não traz número. É de propósito: o mercado precifica a probabilidade de controlar a Câmara e a pesquisa mede vantagem em pontos de voto, então não existe diferença para calcular. A ligação existe, o número não.',
      contexto: 'Contexto estrutural',
      contextoNota: 'Indicadores do Banco Mundial sobre o país, não sobre a eleição. Ficam ao lado do sinal para dar escala ao terreno, e nunca como previsor: nada aqui prevê resultado eleitoral.',
    },
    en: {
      titulo: 'The crossing',
      eleicao: 'US 2026 · House',
      nota: 'The line between the market and each party is dashed and carries no number. That is deliberate: the market prices the probability of controlling the House and the poll measures a lead in vote points, so there is no difference to compute. The link exists, the number does not.',
      contexto: 'Structural context',
      contextoNota: 'World Bank indicators about the country, not about the election. They sit alongside the signal to give scale to the terrain, never as a predictor: nothing here forecasts an electoral result.',
    },
    es: {
      titulo: 'El cruce',
      eleicao: 'EE.UU. 2026 · Cámara',
      nota: 'La línea entre el mercado y cada partido es punteada y no trae número. Es a propósito: el mercado fija la probabilidad de controlar la Cámara y la encuesta mide ventaja en puntos de voto, así que no hay diferencia que calcular. La conexión existe, el número no.',
      contexto: 'Contexto estructural',
      contextoNota: 'Indicadores del Banco Mundial sobre el país, no sobre la elección. Están al lado de la señal para dar escala al terreno, nunca como predictor: nada aquí pronostica un resultado electoral.',
    },
  }[tKey];

  const [showSobre, setShowSobre] = useState(false);
  const [showMetas, setShowMetas] = useState(false);

  // Mercado vem por fetch no cliente, igual ao painel do Brasil: é o único dado
  // desta página que muda de meia em meia hora, e o resto é estático do SSR.
  const [marketData, setMarketData] = useState<UsMarketData | null>(null);
  const [marketLoading, setMarketLoading] = useState(true);

  useEffect(() => {
    let vivo = true;
    fetch('/api/polymarket?country=us')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (vivo) setMarketData(d); })
      .catch(() => { if (vivo) setMarketData(null); })
      .finally(() => { if (vivo) setMarketLoading(false); });
    return () => { vivo = false; };
  }, []);

  /**
   * Dado do grafo do cruzamento.
   *
   * ⚠️ `iso3` NÃO pode ser 'USA'. Aquele código dispara no `CountryGraph` o ramo
   * do caso VALIDADO de 2024, que acrescenta nós de colégio eleitoral, de voto
   * popular, de resultado real e a aresta "mercado errou" ligada à Harris. As
   * midterms são eleição ATIVA e sem resultado, então o ramo inteiro seria
   * falso. Usar um código próprio mantém o grafo no caminho de eleição ativa,
   * o mesmo do Brasil.
   *
   * ⚠️ `divergence_pp` fica em 0 e NUNCA é lido: com `divergenciaMuda` a aresta
   * não mostra número e a espessura dela deixa de depender do valor. O número
   * não existe para este par, e é por isso que ele não aparece.
   */
  const usDivergence = useMemo<CountryDivergence | null>(() => {
    const media = pollsData?.mediaAfos;
    const casa = marketData?.house?.markets;
    if (!media || !Array.isArray(casa)) return null;

    const leituraDe = (partido: 'Democratic' | 'Republican'): number | null => {
      const m = casa.find((x) => new RegExp(`Will the ${partido} Party control the House`).test(x.question || ''));
      const p = m && Array.isArray(m.outcomePrices) ? Number(m.outcomePrices[0]) : NaN;
      return Number.isFinite(p) ? p * 100 : null;
    };
    const dem = leituraDe('Democratic');
    const rep = leituraDe('Republican');
    if (dem === null || rep === null) return null;

    const L = (pt: string, en: string, es: string) => (locale === 'en' ? en : locale === 'es' ? es : pt);
    return {
      iso3: 'US26',
      hf: '',
      election: { first_round: '2026-11-03', runoff: '', matchup: L('Câmara', 'House', 'Cámara'), status: 'active' },
      polls_count: media.nPesquisas,
      market_candidates: 2,
      latest_poll: { pollster: '', date: '' },
      headline: {},
      rows: [
        { candidate: L('Democratas', 'Democrats', 'Demócratas'), poll_pct: media.dem, market_pct: dem, divergence_pp: 0 },
        { candidate: L('Republicanos', 'Republicans', 'Republicanos'), poll_pct: media.rep, market_pct: rep, divergence_pp: 0 },
      ],
    } as CountryDivergence;
  }, [pollsData, marketData, locale]);

  return (
    <div className="min-h-screen bg-white">
      <Header
        onShowSobre={() => setShowSobre(true)}
        onShowMetas={() => setShowMetas(true)}
      />

      <LazyAboutMessages>
        <ModalAbout show={showSobre} onClose={() => setShowSobre(false)} />
        <ModalMetas show={showMetas} onClose={() => setShowMetas(false)} />
      </LazyAboutMessages>

      <CountrySelector active="us" />

      <main
        id="main-content"
        className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12"
        role="main"
      >
        <section className="bg-light-bg border border-light-border rounded-xl p-5">
          <h1 className="text-xl font-bold text-primary mb-2">{t.title}</h1>
          <p className="text-sm text-gray-800 leading-snug">
            <strong className="text-dark">{t.building}</strong> {t.body}
          </p>
        </section>

        {/*
          ORDEM DAS SEÇÕES aprovada em 28/Jul: cartão do Tradeoff → Mercado →
          Cadeiras do Senado → RESSALVA → Pesquisas → Grafo → Contexto
          estrutural → Imprensa → Limitações.

          Mercado e Cadeiras do Senado entraram em 30/Jul, no `UsMarketSection`.
          As duas seções ficam EMPILHADAS, nunca lado a lado: dois números
          grandes na mesma linha fazem o olho subtrair sozinho, mesmo com o
          aviso escrito. A ressalva continua embutida no topo das Pesquisas, que
          é onde ela precisa estar, porque é ali que aparece o SEGUNDO número.

          Limitações entrou em 30/Jul e fecha a página de propósito: é onde o
          leitor chega depois de ter visto todos os números.

          Falta: grafo, contexto estrutural e imprensa.
        */}
        <div className="mb-8">
          <UsMarketSection data={marketData} loading={marketLoading} />
        </div>
        <UsPollsSection data={pollsData} />

        {usDivergence && (
          <section>
            <SectionTitle icon="🕸️">{tGrafo.titulo}</SectionTitle>
            <p className="mb-3 text-xs text-gray-500">{tGrafo.nota}</p>
            <CountryGraph
              data={usDivergence}
              electionLabel={tGrafo.eleicao}
              locale={locale}
              divergenciaMuda
            />
          </section>
        )}

        {context && (
          <section>
            <SectionTitle icon="🏛️">{tGrafo.contexto}</SectionTitle>
            <p className="mb-3 text-xs text-gray-500">{tGrafo.contextoNota}</p>
            <StructuralContext context={context} locale={locale} />
          </section>
        )}

        <UsLimitationsSection data={pollsData} />
      </main>

      <Footer />
    </div>
  );
}

export function UsDashboardClient({ pollsData, context }: { pollsData: UsPollsData | null; context?: CountryContext }) {
  return (
    <VisitorStateProvider>
      <UsDashboardContent pollsData={pollsData} context={context} />
    </VisitorStateProvider>
  );
}
