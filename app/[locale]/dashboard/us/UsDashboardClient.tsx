'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { UsPressSection } from '../../../components/UsPressSection';
import { UsIntroCard } from '../../../components/UsIntroCard';
import { AfosTradeoffHeroCard } from '../../../components/AfosTradeoffHeroCard';
import type { UsPressData } from '../../../../lib/dashboard/us-press-data';
import { CountryGraph } from '../../../components/CountryGraph';
import { SectionTitle } from '../../../components/ui';
import type { CountryContext, CountryDivergence } from '../../../../lib/country-data';
import type { NavGroup } from '../../../components/CountryGraph';
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


function UsDashboardContent({ pollsData, context, pressData }: { pollsData: UsPollsData | null; context?: CountryContext; pressData: UsPressData | null }) {
  const { locale } = useTranslation();
  const tKey = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as 'pt-BR' | 'en' | 'es';

  const tGrafo = {
    'pt-BR': {
      titulo: 'Grafo do cruzamento',
      eleicao: 'EUA 2026 · Câmara',
      nota: 'A linha entre o mercado e cada partido é tracejada e não traz número. É de propósito: o mercado precifica a probabilidade de controlar a Câmara e a pesquisa mede vantagem em pontos de voto, então não existe diferença para calcular. A ligação existe, o número não.',
      contexto: 'Contexto estrutural',
      contextoNota: 'Indicadores do Banco Mundial sobre o país, não sobre a eleição. Ficam ao lado do sinal para dar escala ao terreno, e nunca como previsor: nada aqui prevê resultado eleitoral.',
    },
    en: {
      titulo: 'Cross-reference graph',
      eleicao: 'US 2026 · House',
      nota: 'The line between the market and each party is dashed and carries no number. That is deliberate: the market prices the probability of controlling the House and the poll measures a lead in vote points, so there is no difference to compute. The link exists, the number does not.',
      contexto: 'Structural context',
      contextoNota: 'World Bank indicators about the country, not about the election. They sit alongside the signal to give scale to the terrain, never as a predictor: nothing here forecasts an electoral result.',
    },
    es: {
      titulo: 'Grafo del cruce',
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
  const onNav = useCallback((action: string) => {
    if (action === 'about') setShowSobre(true);
    else if (action === 'metas') setShowMetas(true);
  }, []);

  /**
   * Nós clicáveis, como no painel do Brasil.
   *
   * ⚠️ SÓ ENTRA O QUE EXISTE. O Tradeoff dos EUA entrou em 31/Jul, quando a
   * Edição №1 foi publicada; antes disso o nó não existia, porque nó que leva a
   * lugar nenhum é pior que nó ausente. O dataset das midterms continua fora,
   * porque não existe. O AFOS Daily também, porque hoje é conteúdo do Brasil e
   * mandar o leitor do painel americano para lá seria desvio, não navegação.
   */
  const navGroups = useMemo<NavGroup[]>(() => {
    const pre = `/${locale}`;
    const L = (pt: string, en: string, es: string) => (locale === 'en' ? en : locale === 'es' ? es : pt);
    return [
      {
        id: 'nav_secoes',
        label: L('Seções deste painel', 'Sections of this panel', 'Secciones de este panel'),
        color: '#0F52BA',
        items: [
          { id: 's_mercado', label: L('Mercado de previsão', 'Prediction market', 'Mercado de predicción'), href: '#sec-mercado' },
          { id: 's_pesquisas', label: L('Pesquisas', 'Polling', 'Encuestas'), href: '#sec-pesquisas' },
          { id: 's_contexto', label: L('Contexto estrutural', 'Structural context', 'Contexto estructural'), href: '#sec-contexto' },
          { id: 's_imprensa', label: L('Imprensa', 'Press', 'Prensa'), href: '#sec-imprensa' },
          { id: 's_limites', label: L('Limitações declaradas', 'Declared limitations', 'Limitaciones declaradas'), href: '#sec-limitacoes' },
        ],
      },
      {
        id: 'nav_afos',
        label: 'AFOS',
        color: '#4f46e5',
        items: [
          { id: 'a_tradeoff', label: 'AFOS Tradeoff', href: `${pre}/tradeoff/us` },
          { id: 'a_metodo', label: L('Método', 'Method', 'Método'), href: `${pre}/how-it-works` },
          { id: 'a_global', label: 'AFOS Global', href: `${pre}/global` },
          { id: 'a_gov', label: L('Governança', 'Governance', 'Gobernanza'), href: `${pre}/methodology/automated-governance` },
          { id: 'a_sobre', label: L('Sobre', 'About', 'Acerca de'), action: 'about' },
          { id: 'a_metas', label: L('Metas', 'Goals', 'Metas'), action: 'metas' },
        ],
      },
    ];
  }, [locale]);

  /**
   * Os nós de tipo levam à seção correspondente da própria página. `election` e
   * `candidate` ficam de fora: no Brasil eles apontam para o dataset publicado,
   * e as midterms ainda não têm dataset.
   */
  const usDataLinks = useMemo(() => ({
    market: '#sec-mercado',
    poll: '#sec-pesquisas',
    press: '#sec-imprensa',
    context: '#sec-contexto',
  }), []);

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
      {/* O horário da leitura do mercado vive no relógio da testeira, o mesmo do
          painel do Brasil, em vez de numa linha própria dentro da seção. O André
          pediu assim em 31/Jul, depois de mandar tirar a linha que o exibia: o
          dado de quando o preço foi capturado continua à vista, e num lugar só. */}
      <Header
        fetchedAt={marketData?.fetchedAt ?? undefined}
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
        {/* O cartão do Tradeoff é o PRIMEIRO item da ordem aprovada em 28/Jul,
            como no painel do Brasil. Ficou vago até 31/Jul porque o Tradeoff dos
            EUA não existia; a Edição №1 destravou. O cartão de apresentação
            desceu uma posição e continua: ele diz o que o painel é, e isso o
            Tradeoff não diz. */}
        <AfosTradeoffHeroCard country="us" semContainer />

        <UsIntroCard />

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
        <div id="sec-mercado" className="mb-8 scroll-mt-20">
          <UsMarketSection data={marketData} loading={marketLoading} />
        </div>
        <div id="sec-pesquisas" className="scroll-mt-20">
          <UsPollsSection data={pollsData} />
        </div>

        {usDivergence && (
          <section>
            <SectionTitle>{tGrafo.titulo}</SectionTitle>
            <p className="mb-3 text-xs text-gray-500">{tGrafo.nota}</p>
            <CountryGraph
              data={usDivergence}
              electionLabel={tGrafo.eleicao}
              locale={locale}
              navGroups={navGroups}
              onNav={onNav}
              dataLinks={usDataLinks}
              divergenciaMuda
            />
          </section>
        )}

        {/* Sem SectionTitle no contexto: o `StructuralContext` já renderiza o
            próprio h2 "Contexto estrutural", e o meu por cima duplicava o
            título na tela. Achado em 31/Jul porque o André contou 6 seções e a
            página tinha 7 cabeçalhos. */}
        {context && (
          <section id="sec-contexto" className="scroll-mt-20">
            <p className="mb-3 text-xs text-gray-500">{tGrafo.contextoNota}</p>
            <StructuralContext context={context} locale={locale} />
          </section>
        )}

        <div id="sec-imprensa" className="scroll-mt-20">
          <UsPressSection data={pressData} />
        </div>

        <div id="sec-limitacoes" className="scroll-mt-20">
          <UsLimitationsSection data={pollsData} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export function UsDashboardClient({ pollsData, context, pressData }: { pollsData: UsPollsData | null; context?: CountryContext; pressData: UsPressData | null }) {
  return (
    <VisitorStateProvider>
      <UsDashboardContent pollsData={pollsData} context={context} pressData={pressData} />
    </VisitorStateProvider>
  );
}
