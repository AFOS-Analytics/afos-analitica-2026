'use client';

import type { AnalysisSection, PolyEvent } from '../types';
import { SectionTitle, Card } from './ui';
import { LogicLink } from './LogicLink';
import { GlossaryText } from './GlossaryText';
import { useTranslation } from '../i18n/context';
import { fmtDecimal } from '../../lib/i18n/numero'

interface Props {
  stf: AnalysisSection | undefined;
  updatedAt: string | undefined;
  polyStf?: PolyEvent | null;
}

export function StfSection({ stf, updatedAt, polyStf }: Props) {
  const { t, locale } = useTranslation();

  // Percentual ao vivo do Polymarket (yesPrice do primeiro market ativo).
  // 2 casas decimais: este mercado se move em centésimos (3,55% -> 3,65%) e o
  // Math.round() anterior achatava tudo para "4%", escondendo o movimento.
  const livePrice = polyStf?.markets?.[0]?.outcomePrices?.[0];
  const liveNum = livePrice == null ? NaN : Number(livePrice);
  // 🔢 Separador por IDIOMA. A vírgula estava fixa e saía também no /en, contra
  // a convenção usada nos outros quatro lugares do painel: EN usa ponto decimal.
  const livePct = Number.isFinite(liveNum)
    ? `${fmtDecimal(liveNum * 100, locale, 2)}%`
    : null;

  // Fallback: percentual citado no texto editorial do dia (dado estático).
  // A classe [.,] é OBRIGATÓRIA. O texto é pt-BR e usa vírgula decimal, então
  // a expressão anterior /(\d+\.?\d*)%/ casava apenas o "55" de "3,55%" e o
  // cartão publicava 55% de probabilidade de impeachment de ministro do STF,
  // quinze vezes o valor real, sem nenhum aviso. Verificado em 24/Jul/2026.
  const fallbackPct = stf?.analise?.match(/\d+(?:[.,]\d+)?\s*%/)?.[0];
  // ⚠️ `null`, não `', '`. Sem preço ao vivo e sem percentual no texto, o padrão
  // anterior publicava uma pílula vermelha contendo apenas ", ", que parece
  // número corrompido. Sem valor, a pílula não se desenha.
  const displayPct = livePct || fallbackPct || null;

  return (
    <section>
      <SectionTitle icon="⚖️" rightSlot={<LogicLink anchor="stf" />}>{t('sections.stf')}</SectionTitle>
      {updatedAt && <p className="text-[10px] text-gray-400 -mt-3 mb-3">🔄 {t('sections.analysisUpdated')}: {updatedAt} BRT</p>}
      <Card className="border-l-4 border-l-danger">
        <div className="flex items-center gap-3 mb-4">
          {displayPct && <div className="bg-red-100 text-red-700 font-bold text-xl px-4 py-2 rounded-lg">{displayPct}</div>}
          <p className="text-sm text-gray-600">{t('sections.stfProb')}</p>
        </div>
        <h4 className="font-bold text-sm text-dark mb-2">{t('sections.stfPressure')}</h4>
        <div className="grid md:grid-cols-2 gap-3 mb-4">
          {[
            { name: 'Dias Toffoli', desc: stf?.toffoli || '' },
            { name: 'Alexandre de Moraes', desc: stf?.moraes || '' },
            { name: 'Gilmar Mendes', desc: stf?.gilmar || '' },
            { name: 'Flávio Dino', desc: stf?.dino || '' },
            ...(stf?.mendonca ? [{ name: 'André Mendonça', desc: stf.mendonca }] : []),
          ].map(m => (
            <div key={m.name} className="bg-red-50 rounded-lg p-3">
              <div className="font-semibold text-sm text-dark">{m.name}</div>
              <p className="text-xs text-gray-600 mt-1"><GlossaryText>{m.desc}</GlossaryText></p>
            </div>
          ))}
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
          <h4 className="font-bold text-xs text-danger mb-2">🏦 {t('sections.stfNexus')}</h4>
          <p className="text-xs text-gray-700 leading-relaxed"><GlossaryText>{stf?.nexo}</GlossaryText></p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-dark leading-relaxed"><GlossaryText>{stf?.analise}</GlossaryText></p>
        </div>
      </Card>
    </section>
  );
}
