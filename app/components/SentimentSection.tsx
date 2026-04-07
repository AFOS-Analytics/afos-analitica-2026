import type { AnalysisSection } from '../types';
import { SectionTitle, Card } from './ui';

interface Props {
  sentimento: AnalysisSection | undefined;
  updatedAt: string | undefined;
}

export function SentimentSection({ sentimento: s, updatedAt }: Props) {
  return (
    <section>
      <SectionTitle icon="📡">Sentimento Popular — Redes Sociais e Internet</SectionTitle>
      {updatedAt && <p className="text-[10px] text-gray-400 -mt-3 mb-3">🔄 Análise atualizada: {updatedAt} BRT</p>}
      <Card className="bg-gradient-to-br from-[#F8FAFC] to-blue-50 border-l-4 border-l-[#0F52BA]">
        <div className="space-y-4 text-sm text-[#1a1a1a] leading-relaxed">
          <p>{s?.text1 || ''}</p>
          <p>{s?.text2 || ''}</p>
          <p>{s?.text3 || ''}</p>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 border border-[#E2E8F0]">
              <div className="font-bold text-[#0F52BA] mb-1">Direita</div>
              <p className="text-xs text-gray-600">{s?.direita || ''}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-[#E2E8F0]">
              <div className="font-bold text-[#DC2626] mb-1">Esquerda</div>
              <p className="text-xs text-gray-600">{s?.esquerda || ''}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-[#E2E8F0]">
              <div className="font-bold text-[#6B7280] mb-1">Terceira Via</div>
              <p className="text-xs text-gray-600">{s?.terceiraVia || ''}</p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-[#0F52BA] font-semibold">📌 {s?.polymarket || ''}</p>
          </div>
        </div>
      </Card>
    </section>
  );
}
