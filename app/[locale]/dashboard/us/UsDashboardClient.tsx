'use client';

import { useState } from 'react';
import { useTranslation } from '../../../i18n/context';
import { VisitorStateProvider } from '../../../hooks/useVisitorState';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { ModalAbout } from '../../../components/ModalAbout';
import { ModalMetas } from '../../../components/ModalMetas';
import { LazyAboutMessages } from '../../../components/LazyAboutMessages';
import { CountrySelector } from '../../../components/CountrySelector';

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

function UsDashboardContent() {
  const { locale } = useTranslation();
  const tKey = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as keyof typeof T;
  const t = T[tKey];

  const [showSobre, setShowSobre] = useState(false);
  const [showMetas, setShowMetas] = useState(false);

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
      </main>

      <Footer />
    </div>
  );
}

export function UsDashboardClient() {
  return (
    <VisitorStateProvider>
      <UsDashboardContent />
    </VisitorStateProvider>
  );
}
