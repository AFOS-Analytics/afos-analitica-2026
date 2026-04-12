'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/context';
import type { GlobalData, GlobalElection } from '../types';
import type { CountryMarketSummary } from '../types/global-map';

// D3 map carregado dinamicamente (nunca no server bundle)
const GlobalElectionMap = dynamic(
  () => import('./global-map/GlobalElectionMap').then(mod => mod.GlobalElectionMap),
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

interface ModalGlobalProps {
  show: boolean;
  onClose: () => void;
  globalData: GlobalData | null;
  expandedElection: number | null;
  setExpandedElection: (idx: number | null) => void;
}

/**
 * Converte os dados do /api/global-elections (formato antigo)
 * para CountryMarketSummary[] (formato do mapa D3).
 */
function convertToMapData(elections: GlobalElection[]): CountryMarketSummary[] {
  return elections.map(e => {
    const hasData = e.polymarket && e.polymarket.markets?.length > 0;
    const markets = e.polymarket?.markets || [];
    const topMarket = markets.length > 0 ? markets[0] : null;

    return {
      iso3: e.country.slice(0, 3).toUpperCase(), // Fallback — será sobrescrito se possível
      countryName: e.country,
      flag: e.flag,
      probability: topMarket ? Math.round(topMarket.yesPrice * 1000) / 10 : 0,
      volumeUsd: e.polymarket?.volume || 0,
      status: hasData ? 'live' as const : 'upcoming' as const,
      electionDate: e.date,
      electionType: e.type,
      leadCandidate: topMarket
        ? (topMarket.question || '').replace(/^Will\s+/i, '').replace(/\s+(win|finish|be).*/i, '').trim()
        : '—',
      candidates: markets.slice(0, 5).map(m => ({
        name: (m.question || '').replace(/^Will\s+/i, '').replace(/\s+(win|finish|be).*/i, '').trim(),
        probability: Math.round(m.yesPrice * 1000) / 10,
        volumeUsd: m.volume || 0,
      })),
    };
  });
}

// Mapeamento nome do país → ISO3 para o mapa D3
const COUNTRY_TO_ISO3: Record<string, string> = {
  'Brasil': 'BRA', 'Brazil': 'BRA',
  'EUA': 'USA', 'Estados Unidos': 'USA', 'United States': 'USA',
  'França': 'FRA', 'France': 'FRA',
  'Alemanha': 'DEU', 'Germany': 'DEU',
  'Reino Unido': 'GBR', 'United Kingdom': 'GBR',
  'Canadá': 'CAN', 'Canada': 'CAN',
  'Austrália': 'AUS', 'Australia': 'AUS',
  'Coreia do Sul': 'KOR', 'South Korea': 'KOR',
  'Filipinas': 'PHL', 'Philippines': 'PHL',
  'Chile': 'CHL',
  'Colômbia': 'COL', 'Colombia': 'COL',
  'Índia': 'IND', 'India': 'IND',
  'México': 'MEX', 'Mexico': 'MEX',
  'Nigéria': 'NGA', 'Nigeria': 'NGA',
  'Argentina': 'ARG',
  'Itália': 'ITA', 'Italy': 'ITA',
  'Japão': 'JPN', 'Japan': 'JPN',
};

export function ModalGlobal({ show, onClose, globalData, expandedElection, setExpandedElection }: ModalGlobalProps) {
  const { t } = useTranslation();
  const [mapData, setMapData] = useState<CountryMarketSummary[]>([]);

  useEffect(() => {
    if (globalData?.elections) {
      const converted = convertToMapData(globalData.elections);
      // Resolver ISO3 pelo nome do país
      const resolved = converted.map(c => ({
        ...c,
        iso3: COUNTRY_TO_ISO3[c.countryName] || c.iso3,
      }));
      setMapData(resolved);
    }
  }, [globalData]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Eleições globais" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-5xl w-full my-4 sm:my-8 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="bg-primary text-white p-4 sm:p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold">{t('modal.globalTitle')}</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none" aria-label={t('common.close')}>✕</button>
        </div>
        <div className="p-3 sm:p-6 max-h-[80vh] overflow-y-auto">

          {/* MAPA D3 */}
          <div className="rounded-xl overflow-hidden mb-5" style={{ height: '400px', background: '#07111f' }}>
            {mapData.length > 0 ? (
              <GlobalElectionMap countries={mapData} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-400 text-sm">{t('modal.mapLoading')}</p>
              </div>
            )}
          </div>

          {/* CALENDÁRIO COM BANDEIRAS */}
          <div className="mb-5">
            <h3 className="text-sm font-bold text-primary mb-3">{t('modal.calendarTitle')}</h3>
            <div className="flex flex-wrap gap-2">
              {globalData?.elections?.map((e: GlobalElection, i: number) => (
                <div key={i} className="bg-light-bg border border-light-border rounded-lg px-3 py-2 text-xs cursor-pointer hover:border-primary hover:bg-blue-50 transition-all flex items-center gap-1.5"
                  onClick={() => setExpandedElection(expandedElection === i ? null : i)}>
                  <span className="text-base">{e.flag}</span>
                  <span className="font-semibold">{e.country}</span>
                  <span className="text-gray-400">— {e.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ELECTION CARDS COM DADOS POLYMARKET */}
          <h3 className="text-sm font-bold text-primary mb-3">{t('modal.electionsWithData')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
            {globalData?.elections?.filter((e: GlobalElection) => e.polymarket && e.polymarket.markets?.length > 0)
              .sort((a: GlobalElection, b: GlobalElection) => (b.polymarket?.volume || 0) - (a.polymarket?.volume || 0))
              .map((e: GlobalElection, i: number) => {
              const idx = globalData.elections.indexOf(e);
              const isExpanded = expandedElection === idx;
              const vol = e.polymarket?.volume || 0;
              const volStr = vol > 1e6 ? '$'+(vol/1e6).toFixed(1)+'M' : '$'+(vol/1e3).toFixed(0)+'K';
              const colors = ['#0F52BA','#1a6dd4','#3b82f6','#60a5fa','#93c5fd'];
              return (
                <div key={i}
                  className={`bg-light-bg border rounded-xl p-4 cursor-pointer transition-all duration-300 ${isExpanded ? 'border-primary shadow-lg' : 'border-light-border hover:border-primary hover:shadow-md'}`}
                  onClick={() => setExpandedElection(isExpanded ? null : idx)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{e.flag}</span>
                      <div>
                        <div className="font-bold text-dark text-sm">{e.country}</div>
                        <div className="text-[10px] text-gray-500">{e.type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full">{e.date}</div>
                      <div className="text-[9px] text-gray-400 mt-1">{volStr}</div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {e.polymarket!.markets.slice(0, isExpanded ? undefined : 3).map((m: { question: string; yesPrice: number; volume: number }, j: number) => {
                      const nm = (m.question||'').replace(/^Will\s+/i,'').replace(/\s+(win|finish|be).*/i,'').trim();
                      const pct = (m.yesPrice * 100).toFixed(1);
                      return (
                        <div key={j}>
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-dark font-medium truncate mr-2">{nm}</span>
                            <span className="font-bold flex-shrink-0" style={{color: colors[Math.min(j,4)]}}>{pct}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="h-full rounded-full transition-all duration-500" style={{width:`${Math.min(parseFloat(pct),100)}%`, backgroundColor: colors[Math.min(j,4)]}}/>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {!isExpanded && e.polymarket!.markets.length > 3 && (
                    <div className="text-[10px] text-primary text-center mt-2 font-medium">Clique para ver {e.polymarket!.markets.length} candidatos ▼</div>
                  )}
                  {isExpanded && (
                    <div className="text-[10px] text-gray-400 text-center mt-2">Vol. total: {volStr} | {e.polymarket!.markets.length} candidatos ▲</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ELEIÇÕES SEM DADOS */}
          {(globalData?.elections?.filter((e: GlobalElection) => !e.polymarket || !e.polymarket.markets?.length)?.length ?? 0) > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-bold text-gray-400 mb-2">{t('modal.upcomingElections')}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {globalData?.elections?.filter((e: GlobalElection) => !e.polymarket || !e.polymarket.markets?.length).map((e: GlobalElection, i: number) => (
                  <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-xs text-center">
                    <div className="text-lg">{e.flag}</div>
                    <div className="font-semibold text-dark">{e.country}</div>
                    <div className="text-gray-400">{e.date} | {e.type}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-[10px] text-gray-400 text-center mb-6">{t('modal.dataSource')}</p>

          {/* TEXTO EXPLICATIVO */}
          <div className="space-y-6 text-sm text-dark leading-relaxed border-t border-light-border pt-6">

            <div>
              <p className="mb-3">{t('global.introDesc')}</p>
              <p className="mb-2">{t('global.introDesc2')}</p>
              <ul className="space-y-1.5 text-gray-600 ml-4 mb-3">
                {t('global.introList').split(',').map((item, i) => <li key={i}>• {item}</li>)}
              </ul>
              <p className="text-gray-500 italic">{t('global.introFooter')}</p>
            </div>

            <div className="border-t border-light-border pt-5">
              <h4 className="font-bold text-primary mb-3">{t('global.howTitle')}</h4>
              <p className="mb-3">{t('global.howDesc')}</p>
              <p className="mb-2">{t('global.howDesc2')}</p>
              <ul className="space-y-1.5 text-gray-600 ml-4 mb-3">
                {t('global.howList').split(',').map((item, i) => <li key={i}>• {item}</li>)}
              </ul>
              <p className="text-gray-500 italic">{t('global.howFooter')}</p>
            </div>

            <div className="border-t border-light-border pt-5">
              <h4 className="font-bold text-primary mb-3">{t('global.mapTitle')}</h4>
              <p className="mb-2">{t('global.mapDesc')}</p>
              <ul className="space-y-1.5 text-gray-600 ml-4 mb-3">
                {t('global.mapColorsList').split(',').map((item, i) => <li key={i}>• {item}</li>)}
              </ul>
              <p className="text-gray-500 italic">{t('global.mapFooter')}</p>
            </div>

            <div className="border-t border-light-border pt-5">
              <h4 className="font-bold text-primary mb-3">{t('global.clickTitle')}</h4>
              <p className="mb-2">{t('global.clickDesc')}</p>
              <ul className="space-y-1.5 text-gray-600 ml-4 mb-3">
                {t('global.clickList').split(',').map((item, i) => <li key={i}>• {item}</li>)}
              </ul>
              <p className="text-gray-500 italic">{t('global.clickFooter')}</p>
            </div>

            <div className="border-t border-light-border pt-5">
              <h4 className="font-bold text-primary mb-3">{t('global.calendarTitle')}</h4>
              <p className="mb-3">{t('global.calendarDesc')}</p>
              <p className="mb-2">{t('global.calendarDesc2')}</p>
              <ul className="space-y-1.5 text-gray-600 ml-4 mb-3">
                {t('global.calendarList').split(',').map((item, i) => <li key={i}>• {item}</li>)}
              </ul>
              <p className="text-gray-500 italic">{t('global.calendarFooter')}</p>
            </div>

            <div className="border-t border-light-border pt-5">
              <h4 className="font-bold text-primary mb-3">{t('global.purposeTitle')}</h4>
              <p className="mb-2">{t('global.purposeDesc')}</p>
              <ul className="space-y-1.5 text-gray-600 ml-4">
                {t('global.purposeList').split(',').map((item, i) => <li key={i}>• {item}</li>)}
              </ul>
            </div>

            <div className="border-t border-light-border pt-5">
              <div className="bg-primary/5 border border-primary/15 rounded-xl p-5">
                <h4 className="font-bold text-primary mb-3">{t('global.simpleTitle')}</h4>
                <p className="mb-3">{t('global.simpleDesc')}</p>
                <p className="mb-2">{t('global.simpleDesc2')}</p>
                <div className="flex gap-4 justify-center my-3">
                  {t('global.simpleList').split(',').map((item, i) => (
                    <span key={i} className="bg-white rounded-lg px-4 py-2 shadow-sm font-semibold text-primary">{item}</span>
                  ))}
                </div>
                <p className="text-gray-500 italic text-center">{t('global.simpleFooter')}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
