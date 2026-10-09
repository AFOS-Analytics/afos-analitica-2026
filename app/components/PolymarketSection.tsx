'use client';

import type { PolyData, PolyEvent } from '../types';
import { extractCandidateName } from '../lib/utils';
import { Card, HBar } from './ui';
import { LogicLink } from './LogicLink';
import { useTranslation } from '../i18n/context';
import { fmtVolumeUsd } from '../../lib/i18n/numero'

interface Props {
  poly: PolyData | null;
  loading?: boolean;
}

const POLYMARKET_BASE = 'https://polymarket.com/event/';

export function PolymarketSection({ poly, loading }: Props) {
  const { t, locale } = useTranslation();
  function renderMarkets(event: PolyEvent | null | undefined, title: string, topN?: number) {
    if (!event || !event.markets?.length) return (
      <Card className="mb-4">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        {loading ? (
          <div className="space-y-2 animate-pulse" aria-hidden="true">
            <div className="h-3 w-3/4 rounded bg-gray-200" />
            <div className="h-3 w-1/2 rounded bg-gray-200" />
            <div className="h-3 w-2/3 rounded bg-gray-200" />
          </div>
        ) : (
          <p className="text-gray-500 text-sm">{t('sections.dataUnavailable')}</p>
        )}
      </Card>
    );

    // 🗳️ LIVRO RESOLVIDO, 05/Out/2026. Com todos os contratos fechados, o filtro
    // abaixo esvazia o cartão e ele ia ao ar só com título e volume, sem barra
    // nenhuma (2º e 3º lugar e Senado, no dia seguinte ao 1º turno). Agora o
    // cartão diz que o livro resolveu e qual foi o desfecho.
    if (event.markets.every(m => m.closed)) {
      const venc = event.markets.find(m => Array.isArray(m.outcomePrices) && Number(m.outcomePrices[0]) >= 0.99);
      const vol = event.markets.reduce((s, m) => s + (m.volumeNum || 0), 0);
      const L = (pt: string, en: string, es: string) => (locale === 'en' ? en : locale === 'es' ? es : pt);
      const url = /^[a-z0-9-]+$/.test(event.slug || '') ? `${POLYMARKET_BASE}${event.slug}` : null;
      return (
        <Card className="mb-4 opacity-90">
          <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
            {url ? (
              <a href={url} target="_blank" rel="noopener noreferrer" className="font-bold text-lg text-dark hover:text-primary transition-colors">{title} <span className="text-xs text-gray-400">↗</span></a>
            ) : <h3 className="font-bold text-lg text-dark">{title}</h3>}
            <span className="text-[11px] font-semibold rounded px-2 py-0.5 bg-gray-100 text-gray-600">{L('resolvido', 'resolved', 'resuelto')}</span>
          </div>
          <p className="text-sm text-dark">
            {venc
              ? <>{L('Desfecho', 'Outcome', 'Desenlace')}: <strong>{extractCandidateName(venc.question)}</strong></>
              : L('Todos os contratos fechados.', 'All contracts closed.', 'Todos los contratos cerrados.')}
          </p>
          {vol > 0 && <p className="text-xs text-gray-500 mt-1">{t('sections.volume')}: {fmtVolumeUsd(vol, locale)}</p>}
        </Card>
      );
    }

    const items: { name: string; odds: number; vol: number }[] = [];
    event.markets.forEach(m => {
      if (m.closed) return;
      const yesPrice = Array.isArray(m.outcomePrices) ? Number(m.outcomePrices[0]) : 0;
      if (yesPrice > 0.005) {
        const name = extractCandidateName(m.question);
        items.push({ name, odds: yesPrice * 100, vol: m.volumeNum || 0 });
      }
    });
    items.sort((a, b) => b.odds - a.odds);
    const display = topN ? items.slice(0, topN) : items;
    const maxOdds = display.length > 0 ? Math.max(...display.map(d => d.odds)) : 100;
    const totalVol = event.markets.reduce((s, m) => s + (m.volumeNum || 0), 0);
    const isValidSlug = /^[a-z0-9-]+$/.test(event.slug || '');
    const eventUrl = isValidSlug ? `${POLYMARKET_BASE}${event.slug}` : null;

    return (
      <Card className="mb-4">
        <div className="flex flex-wrap justify-between items-center mb-3">
          {eventUrl ? (
            <a href={eventUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-lg text-dark hover:text-primary transition-colors group" aria-label={`${title} (${t('sections.opensOnPolymarket')})`}>
              {title} <span className="text-xs text-gray-400 group-hover:text-primary transition-colors">↗</span>
            </a>
          ) : (
            <h3 className="font-bold text-lg text-dark">{title}</h3>
          )}
          {totalVol > 0 && <span className="text-xs text-gray-500">{t('sections.volume')}: {fmtVolumeUsd(totalVol, locale)}</span>}
        </div>
        {display.map((item, i) => (
          <HBar
            key={item.name + i}
            value={item.odds}
            max={maxOdds * 1.1}
            color={i < 2 ? '#0F52BA' : '#94A3B8'}
            label={item.name}
          />
        ))}
      </Card>
    );
  }

  return (
    <section>
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-4">
        <h2 className="font-bold text-dark flex items-center gap-2 text-sm sm:text-base md:text-lg lg:text-xl">
          <span className="flex-shrink-0" aria-hidden="true">📊</span>
          <span className="hidden sm:inline">{t('sections.polymarket')}</span>
          <span className="sm:hidden leading-snug">{t('sections.polymarketMobile')}<br/>{t('sections.polymarketMobileLine2')}</span>
        </h2>
        <LogicLink anchor="cards-polymarket" />
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 mb-4 mx-0">
        <div className="mb-2">
          <a href="https://polymarket.com/politics/brazil" target="_blank" rel="noopener noreferrer" className="text-primary font-bold underline hover:text-primary-dark text-sm sm:text-base" aria-label={`Polymarket (${t('sections.opensOnPolymarket')})`}>polymarket.com</a>
        </div>
        <p className="text-xs sm:text-sm text-dark leading-relaxed">
          {t('sections.polymarketDesc')}
        </p>
      </div>
      {(() => {
        const livros: [PolyEvent | null | undefined, string, number?][] = [
          [poly?.presidential, `🏆 ${t('sections.presidential')}`, 10],
          [poly?.stf, `⚖️ ${t('sections.stfMarket')}`],
          [poly?.inflation, `📈 ${t('sections.inflation')}`],
          [poly?.secondPlace, `🥈 ${t('sections.secondPlace')}`, 8],
          [poly?.thirdPlace, `🥉 ${t('sections.thirdPlace')}`, 8],
          [poly?.senate, `🏛️ ${t('sections.senate')}`, 8],
        ];
        const resolvido = (e: PolyEvent | null | undefined) => !!e?.markets?.length && e.markets.every(m => m.closed);
        const vivos = livros.filter(([e]) => !resolvido(e));
        const fechados = livros.filter(([e]) => resolvido(e));
        return (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              {vivos.map(([e, titulo, n]) => <div key={titulo}>{renderMarkets(e, titulo, n)}</div>)}
            </div>
            {fechados.length > 0 && (
              <>
                <h3 className="font-semibold text-sm text-gray-600 mt-2 mb-3">
                  {locale === 'en' ? 'Books resolved in the first round' : locale === 'es' ? 'Libros resueltos en la primera vuelta' : 'Livros resolvidos no 1º turno'}
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {fechados.map(([e, titulo, n]) => <div key={titulo}>{renderMarkets(e, titulo, n)}</div>)}
                </div>
              </>
            )}
          </>
        );
      })()}
    </section>
  );
}
