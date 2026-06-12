'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/context';
import type { CountryMarketSummary } from '../types/global-map';
import { MOCK_ELECTIONS } from '../lib/mock-elections';
import { GlobalContent } from './global-section/GlobalContent';

interface ModalGlobalProps {
  show: boolean;
  onClose: () => void;
  mapCountries?: Record<string, unknown>[] | null;
  expandedElection: number | null;
  setExpandedElection: (idx: number | null) => void;
}

export function ModalGlobal({ show, onClose, mapCountries, expandedElection, setExpandedElection }: ModalGlobalProps) {
  const { t } = useTranslation();
  const [mapData, setMapData] = useState<CountryMarketSummary[]>([]);

  useEffect(() => {
    if (mapCountries && mapCountries.length > 0) {
      const apiData = mapCountries.map((c) => ({
        iso3: c.iso3 as string,
        countryName: c.n as string,
        flag: c.f as string,
        electionDate: c.d as string,
        electionType: c.t as string,
        probability: (c.p as number) || 0,
        leadCandidate: (c.lc as string) || '—',
        volumeUsd: (c.v as number) || 0,
        marketCount: (c.mc as number) || 1,
        status: ((c.s as string) || 'no-data') as CountryMarketSummary['status'],
        candidates: ((c.cs as Array<Record<string, unknown>>) || []).map((cd) => ({
          name: cd.n as string,
          probability: cd.p as number,
          volumeUsd: cd.v as number,
        })),
      })) as CountryMarketSummary[];

      const mockMap = new Map<string, CountryMarketSummary>();
      MOCK_ELECTIONS.forEach(m => mockMap.set(m.iso3, m));

      const merged = apiData.map(c => {
        if ((c.status as string) === 'no-data' || (c.probability === 0 && c.candidates.length === 0)) {
          const mock = mockMap.get(c.iso3);
          if (mock && mock.probability > 0) return mock;
        }
        return c;
      });

      for (const mock of MOCK_ELECTIONS) {
        if (!merged.find(c => c.iso3 === mock.iso3)) {
          merged.push(mock);
        }
      }

      setMapData(merged);
    } else {
      setMapData([...MOCK_ELECTIONS]);
    }
  }, [mapCountries]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-label={t('modal.globalTitle')} onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-5xl w-full my-4 sm:my-8 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="bg-primary text-white p-4 sm:p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold">{t('modal.globalTitle')}</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none" aria-label={t('common.close')}>✕</button>
        </div>
        <div className="p-3 sm:p-6 max-h-[80vh] overflow-y-auto">
          <GlobalContent
            mapData={mapData}
            expandedElection={expandedElection}
            setExpandedElection={setExpandedElection}
            variant="modal"
          />
        </div>
      </div>
    </div>
  );
}
