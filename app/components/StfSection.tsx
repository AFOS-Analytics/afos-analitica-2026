'use client';

import type { AnalysisSection, PolyEvent } from '../types';
import { SectionTitle, Card } from './ui';
import { LogicLink } from './LogicLink';
import { useTranslation } from '../i18n/context';

interface Props {
  stf: AnalysisSection | undefined;
  updatedAt: string | undefined;
  polyStf?: PolyEvent | null;
}

export function StfSection({ stf, updatedAt, polyStf }: Props) {
  const { t } = useTranslation();

  // Percentual ao vivo do Polymarket (yesPrice do primeiro market ativo)
  const livePrice = polyStf?.markets?.[0]?.outcomePrices?.[0];
  const livePct = livePrice != null ? `${Math.round(Number(livePrice) * 100)}%` : null;
  // Fallback: regex do texto editorial (dado estático)
  const displayPct = livePct || stf?.analise?.match(/(\d+\.?\d*)%/)?.[0] || '—';

  return (
    <section>
      <SectionTitle icon="⚖️" rightSlot={<LogicLink anchor="stf" />}>{t('sections.stf')}</SectionTitle>
      {updatedAt && <p className="text-[10px] text-gray-400 -mt-3 mb-3">🔄 {t('sections.analysisUpdated')}: {updatedAt} BRT</p>}
      <Card className="border-l-4 border-l-danger">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 text-red-700 font-bold text-xl px-4 py-2 rounded-lg">{displayPct}</div>
          <p className="text-sm text-gray-600">{t('sections.stfProb')}</p>
        </div>
        <h4 className="font-bold text-sm text-dark mb-2">{t('sections.stfPressure')}</h4>
        <div className="grid md:grid-cols-2 gap-3 mb-4">
          {[
            { name: 'Dias Toffoli', desc: stf?.toffoli || '' },
            { name: 'Alexandre de Moraes', desc: stf?.moraes || '' },
            { name: 'Gilmar Mendes', desc: stf?.gilmar || '' },
            { name: 'Flávio Dino', desc: stf?.dino || '' },
          ].map(m => (
            <div key={m.name} className="bg-red-50 rounded-lg p-3">
              <div className="font-semibold text-sm text-dark">{m.name}</div>
              <p className="text-xs text-gray-600 mt-1">{m.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
          <h4 className="font-bold text-xs text-danger mb-2">🏦 {t('sections.stfNexus')}</h4>
          <p className="text-xs text-gray-700 leading-relaxed">{stf?.nexo || ''}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-dark leading-relaxed">{stf?.analise || ''}</p>
        </div>
      </Card>
    </section>
  );
}
