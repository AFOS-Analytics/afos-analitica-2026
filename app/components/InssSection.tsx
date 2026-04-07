import type { AnalysisSection } from '../types';
import { SectionTitle, Card } from './ui';

interface Props {
  inss: AnalysisSection | undefined;
  updatedAt: string | undefined;
}

export function InssSection({ inss, updatedAt }: Props) {
  return (
    <section>
      <SectionTitle icon="🔴">Escândalo INSS e o Caso Lulinha</SectionTitle>
      {updatedAt && <p className="text-[10px] text-gray-400 -mt-3 mb-3">🔄 Análise atualizada: {updatedAt} BRT</p>}
      <Card className="border-l-4 border-l-danger">
        <div className="space-y-3 text-sm text-dark leading-relaxed">
          <p>{inss?.text1 || ''}</p>
          <p>{inss?.text2 || ''}</p>
          <p>{inss?.text3 || ''}</p>
          <p>{inss?.text4 || ''}</p>
          <div className="grid md:grid-cols-2 gap-3 mt-3">
            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
              <div className="font-bold text-danger text-xs mb-1">⚡ IMPACTO NA IMAGEM DE LULA</div>
              <p className="text-xs text-gray-700">{inss?.impactoLula || ''}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
              <div className="font-bold text-danger text-xs mb-1">⚡ IMPACTO NA GESTÃO FEDERAL</div>
              <p className="text-xs text-gray-700">{inss?.impactoGestao || ''}</p>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
            <p className="text-xs text-danger font-semibold">📌 {inss?.conclusao || ''}</p>
          </div>
        </div>
      </Card>
    </section>
  );
}
