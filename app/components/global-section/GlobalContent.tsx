'use client';

import dynamic from 'next/dynamic';
import { useTranslation, useLocale } from '../../i18n/context';
import type { CountryMarketSummary } from '../../types/global-map';
import { COUNTRIES_SEO } from '../../../lib/seo/countries';

const GlobalElectionMap = dynamic(
  () => import('../global-map/GlobalElectionMap').then(mod => mod.GlobalElectionMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full flex items-center justify-center py-20 bg-[#07111f] rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    ),
  }
);

interface GlobalContentProps {
  mapData: CountryMarketSummary[];
  expandedElection: number | null;
  setExpandedElection: (idx: number | null) => void;
  variant?: 'modal' | 'page';
}

export function GlobalContent({ mapData, expandedElection, setExpandedElection, variant = 'modal' }: GlobalContentProps) {
  const { t } = useTranslation();
  const locale = useLocale();
  const slugFor = (iso3: string) => COUNTRIES_SEO.find((x) => x.iso3 === iso3)?.slug[locale];
  const viewLabel = locale === 'pt-BR' ? 'Ver análise →' : locale === 'es' ? 'Ver análisis →' : 'View analysis →';
  const mapHeight = variant === 'page' ? 'min(520px, 70vh)' : '400px';

  return (
    <div>
      <div className="rounded-xl overflow-hidden mb-5" style={{ height: mapHeight, background: '#07111f' }}>
        {mapData.length > 0 ? (
          <GlobalElectionMap countries={mapData} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-400 text-sm">{t('modal.mapLoading')}</p>
          </div>
        )}
      </div>

      <div className="mb-5">
        <h3 className="text-sm font-bold text-primary mb-3">{t('modal.calendarTitle')}</h3>
        <div className="flex flex-wrap gap-2">
          {mapData.map((c, i) => (
            <div key={i} className="bg-light-bg border border-light-border rounded-lg px-3 py-2 text-xs cursor-pointer hover:border-primary hover:bg-blue-50 transition-all flex items-center gap-1.5"
              onClick={() => setExpandedElection(expandedElection === i ? null : i)}>
              <img src={`/flags/${c.flag}.svg`} alt={c.countryName} width={20} height={14} loading="lazy" decoding="async" className="rounded-sm object-cover" style={{ width: 20, height: 14 }} />
              <span className="font-semibold">{c.countryName}</span>
              <span className="text-gray-400">,  {c.electionDate}</span>
            </div>
          ))}
        </div>
      </div>

      <h3 className="text-sm font-bold text-primary mb-3">{t('modal.electionsWithData')}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        {mapData
          .filter(c => c.candidates && c.candidates.length > 0 && c.status === 'live')
          .sort((a, b) => (b.volumeUsd || 0) - (a.volumeUsd || 0))
          .map((c, i) => {
          const idx = mapData.indexOf(c);
          const isExpanded = expandedElection === idx;
          const vol = c.volumeUsd || 0;
          const volStr = vol > 1e6 ? '$'+(vol/1e6).toFixed(1)+'M' : '$'+(vol/1e3).toFixed(0)+'K';
          const colors = ['#0F52BA','#1a6dd4','#3b82f6','#60a5fa','#93c5fd'];
          return (
            <div key={i}
              className={`bg-light-bg border rounded-xl p-4 cursor-pointer transition-all duration-300 ${isExpanded ? 'border-primary shadow-lg' : 'border-light-border hover:border-primary hover:shadow-md'}`}
              onClick={() => setExpandedElection(isExpanded ? null : idx)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <img src={`/flags/${c.flag}.svg`} alt={c.countryName} width={28} height={19} loading="lazy" decoding="async" className="rounded-sm object-cover" style={{ width: 28, height: 19 }} />
                  <div>
                    <div className="font-bold text-dark text-sm">{c.countryName}</div>
                    <div className="text-[10px] text-gray-500">{c.electionType}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full">{c.electionDate}</div>
                  <div className="text-[9px] text-gray-400 mt-1">{volStr}{c.marketCount && c.marketCount > 1 ? ` (somatorio ${c.marketCount} mercados)` : ''}</div>
                </div>
              </div>

              <div className="space-y-1.5">
                {c.candidates.slice(0, isExpanded ? undefined : 3).map((cand, j) => {
                  const pct = cand.probability.toFixed(1);
                  return (
                    <div key={j}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-dark font-medium truncate mr-2">{cand.name}</span>
                        <span className="font-bold flex-shrink-0" style={{color: colors[Math.min(j,4)]}}>{pct}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-full rounded-full transition-all duration-500" style={{width:`${Math.min(parseFloat(pct),100)}%`, backgroundColor: colors[Math.min(j,4)]}}/>
                      </div>
                    </div>
                  );
                })}
              </div>

              {!isExpanded && c.candidates.length > 3 && (
                <div className="text-[10px] text-primary text-center mt-2 font-medium">{t('modal.clickToSee')} {c.candidates.length} {t('modal.candidates')} ▼</div>
              )}
              {isExpanded && (
                <div className="text-[10px] text-gray-400 text-center mt-2">{t('modal.totalVol')}: {volStr} | {c.candidates.length} {t('modal.candidates')} ▲</div>
              )}
              {slugFor(c.iso3) && (
                <a href={`/${locale}/country/${slugFor(c.iso3)}`} onClick={(e) => e.stopPropagation()} className="mt-2 block text-center text-[11px] font-semibold text-primary hover:underline">{viewLabel}</a>
              )}
            </div>
          );
        })}
      </div>

      {mapData.filter(c => c.status !== 'live').length > 0 && (
        <div className="mb-4">
          <h3 className="text-xs font-bold text-gray-400 mb-2">{t('modal.upcomingElections')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {mapData.filter(c => c.status !== 'live').map((c, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-xs text-center">
                <img src={`/flags/${c.flag}.svg`} alt={c.countryName} width={24} height={16} loading="lazy" decoding="async" className="rounded-sm object-cover mx-auto" style={{ width: 24, height: 16 }} />
                <div className="font-semibold text-dark">{c.countryName}</div>
                <div className="text-gray-400">{c.electionDate} | {c.electionType}</div>
                {slugFor(c.iso3) && (
                  <a href={`/${locale}/country/${slugFor(c.iso3)}`} className="mt-1 block text-[10px] font-semibold text-primary hover:underline">{viewLabel}</a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-[10px] text-gray-400 text-center mb-6">{t('modal.dataSource')}</p>

      <div className="space-y-6 text-sm text-dark leading-relaxed border-t border-light-border pt-6">

        <div>
          <p className="mb-3">{t('global.introDesc')}</p>
          <p className="mb-2">{t('global.introDesc2')}</p>
          <ul className="space-y-1.5 text-gray-600 ml-4 mb-3">
            {t('global.introList').split(',').map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
          <p className="font-semibold text-primary">{t('global.introFooter')}</p>
        </div>

        <div className="border-t border-light-border pt-5">
          <h4 className="font-bold text-primary mb-3">{t('global.dataTitle')}</h4>
          <p className="mb-2">{t('global.dataDesc')}</p>
          <ul className="space-y-1.5 text-gray-600 ml-4">
            {t('global.dataList').split(',').map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>

        <div className="border-t border-light-border pt-5">
          <h4 className="font-bold text-primary mb-3">{t('global.howTitle')}</h4>
          <p className="mb-3">{t('global.howDesc')}</p>
          <p className="mb-2">{t('global.howDesc2')}</p>
          <ul className="space-y-1.5 text-gray-600 ml-4 mb-3">
            {t('global.howColorsList').split(',').map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
          <p className="text-gray-500 italic">{t('global.howFooter')}</p>
        </div>

        <div className="border-t border-light-border pt-5">
          <h4 className="font-bold text-primary mb-3">{t('global.clickTitle')}</h4>
          <p className="mb-2">{t('global.clickDesc')}</p>
          <ul className="space-y-1.5 text-gray-600 ml-4 mb-3">
            {t('global.clickList').split(',').map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
          <p className="font-semibold text-dark">{t('global.clickFooter')}</p>
        </div>

        <div className="border-t border-light-border pt-5">
          <h4 className="font-bold text-primary mb-3">{t('global.calendarTitle')}</h4>
          <p className="mb-3">{t('global.calendarDesc')}</p>
          <p className="mb-2">{t('global.calendarDesc2')}</p>
          <ul className="space-y-1.5 text-gray-600 ml-4 mb-3">
            {t('global.calendarList').split(',').map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
          <p className="font-semibold text-dark">{t('global.calendarFooter')}</p>
        </div>

        <div className="border-t border-light-border pt-5">
          <h4 className="font-bold text-primary mb-3">{t('global.purposeTitle')}</h4>
          <p className="mb-2">{t('global.purposeDesc')}</p>
          <p className="mb-2">{t('global.purposeIntro')}</p>
          <ul className="space-y-1.5 text-gray-600 ml-4">
            {t('global.purposeList').split(',').map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>

        <div className="border-t border-light-border pt-5">
          <div className="bg-primary/5 border border-primary/15 rounded-xl p-5">
            <h4 className="font-bold text-primary mb-3">{t('global.execTitle')}</h4>
            <p className="text-gray-600 mb-1">{t('global.execLine1')}</p>
            <p className="text-gray-600 mb-4">{t('global.execLine2')}</p>
            <p className="mb-3">{t('global.execDesc')}</p>
            <div className="flex gap-4 justify-center">
              {t('global.execList').split(',').map((item, i) => (
                <span key={i} className="bg-white rounded-lg px-5 py-2.5 shadow-sm font-semibold text-primary text-base">{item}</span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
