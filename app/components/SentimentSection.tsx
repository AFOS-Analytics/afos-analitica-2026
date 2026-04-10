'use client';

import type { AnalysisSection } from '../types';
import { SectionTitle, Card } from './ui';
import { useTranslation } from '../i18n/context';

interface Props {
  sentimento: AnalysisSection | undefined;
  updatedAt: string | undefined;
}

export function SentimentSection({ sentimento: s, updatedAt }: Props) {
  const { t } = useTranslation();
  return (
    <section>
      <SectionTitle icon="📡">Sentimento Popular — Redes Sociais e Internet</SectionTitle>
      {updatedAt && <p className="text-[10px] text-gray-400 -mt-3 mb-3">🔄 {t('sections.analysisUpdated')}: {updatedAt} BRT</p>}
      <Card className="bg-gradient-to-br from-light-bg to-blue-50 border-l-4 border-l-primary">
        <div className="space-y-4 text-sm text-dark leading-relaxed">
          <p>{s?.text1 || ''}</p>
          <p>{s?.text2 || ''}</p>
          <p>{s?.text3 || ''}</p>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 border border-light-border">
              <div className="font-bold text-primary mb-1">{t('sections.right')}</div>
              <p className="text-xs text-gray-600">{s?.direita || ''}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-light-border">
              <div className="font-bold text-danger mb-1">{t('sections.left')}</div>
              <p className="text-xs text-gray-600">{s?.esquerda || ''}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-light-border">
              <div className="font-bold text-[#6B7280] mb-1">{t('sections.thirdWay')}</div>
              <p className="text-xs text-gray-600">{s?.terceiraVia || ''}</p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-primary font-semibold">📌 {s?.polymarket || ''}</p>
          </div>
        </div>
      </Card>
    </section>
  );
}
