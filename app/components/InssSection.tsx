'use client';

import type { AnalysisSection } from '../types';
import { SectionTitle, Card } from './ui';
import { LogicLink } from './LogicLink';
import { GlossaryText } from './GlossaryText';
import { useTranslation } from '../i18n/context';

interface Props {
  inss: AnalysisSection | undefined;
  updatedAt: string | undefined;
}

export function InssSection({ inss, updatedAt }: Props) {
  const { t } = useTranslation();
  return (
    <section>
      <SectionTitle icon="🔴" rightSlot={<LogicLink anchor="inss-lulinha" />}>{t('sections.inss')}</SectionTitle>
      {updatedAt && <p className="text-[10px] text-gray-400 -mt-3 mb-3">🔄 {t('sections.analysisUpdated')}: {updatedAt} BRT</p>}
      <Card className="border-l-4 border-l-danger">
        <div className="space-y-3 text-sm text-dark leading-relaxed">
          <p><GlossaryText>{inss?.text1}</GlossaryText></p>
          <p><GlossaryText>{inss?.text2}</GlossaryText></p>
          <p><GlossaryText>{inss?.text3}</GlossaryText></p>
          <p><GlossaryText>{inss?.text4}</GlossaryText></p>
          <div className="grid md:grid-cols-2 gap-3 mt-3">
            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
              <div className="font-bold text-danger text-xs mb-1">⚡ {t('sections.impactLula')}</div>
              <p className="text-xs text-gray-700"><GlossaryText>{inss?.impactoLula}</GlossaryText></p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
              <div className="font-bold text-danger text-xs mb-1">⚡ {t('sections.impactGovt')}</div>
              <p className="text-xs text-gray-700"><GlossaryText>{inss?.impactoGestao}</GlossaryText></p>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
            <p className="text-xs text-danger font-semibold">📌 <GlossaryText>{inss?.conclusao}</GlossaryText></p>
          </div>
        </div>
      </Card>
    </section>
  );
}
