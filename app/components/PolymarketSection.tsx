'use client';

import type { PolyData, PolyEvent } from '../types';
import { extractCandidateName } from '../lib/utils';
import { Card, HBar } from './ui';
import { useTranslation } from '../i18n/context';

interface Props {
  poly: PolyData | null;
}

const POLYMARKET_BASE = 'https://polymarket.com/event/';

export function PolymarketSection({ poly }: Props) {
  const { t } = useTranslation();
  function renderMarkets(event: PolyEvent | null | undefined, title: string, topN?: number) {
    if (!event || !event.markets?.length) return (
      <Card className="mb-4">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-gray-500 text-sm">{t('sections.dataUnavailable')}</p>
      </Card>
    );

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
          {totalVol > 0 && <span className="text-xs text-gray-500">{t('sections.volume')}: ${(totalVol / 1e6).toFixed(2)}M</span>}
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
      <h2 className="font-bold text-dark mb-4 flex items-center gap-2 text-sm sm:text-base md:text-lg lg:text-xl">
        <span className="flex-shrink-0" aria-hidden="true">📊</span>
        <span className="hidden sm:inline">{t('sections.polymarket')}</span>
        <span className="sm:hidden leading-snug">{t('sections.polymarketMobile')}<br/>{t('sections.polymarketMobileLine2')}</span>
      </h2>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 mb-4 mx-0">
        <div className="mb-2">
          <a href="https://polymarket.com/politics/brazil" target="_blank" rel="noopener noreferrer" className="text-primary font-bold underline hover:text-primary-dark text-sm sm:text-base" aria-label="Polymarket (abre em nova aba)">polymarket.com</a>
        </div>
        <p className="text-xs sm:text-sm text-dark leading-relaxed">
          {t('sections.polymarketDesc')}
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {renderMarkets(poly?.presidential, `🏆 ${t('sections.presidential')}`, 10)}
        {renderMarkets(poly?.secondPlace, `🥈 ${t('sections.secondPlace')}`, 8)}
        {renderMarkets(poly?.thirdPlace, `🥉 ${t('sections.thirdPlace')}`, 8)}
        {renderMarkets(poly?.stf, `⚖️ ${t('sections.stfMarket')}`)}
        {renderMarkets(poly?.senate, `🏛️ ${t('sections.senate')}`, 8)}
        {renderMarkets(poly?.inflation, `📈 ${t('sections.inflation')}`)}
      </div>
    </section>
  );
}
