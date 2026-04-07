import type { AnalysisSection } from '../types';
import { SectionTitle, Card } from './ui';

interface Props {
  bancoMaster: AnalysisSection | undefined;
  updatedAt: string | undefined;
}

export function BancoMasterSection({ bancoMaster: bm, updatedAt }: Props) {
  return (
    <section>
      <SectionTitle icon="🏦">Impacto do Escândalo Banco Master</SectionTitle>
      {updatedAt && <p className="text-[10px] text-gray-400 -mt-3 mb-3">🔄 Análise atualizada: {updatedAt} BRT</p>}
      <Card className="border-l-4 border-l-primary">
        <p className="text-sm text-dark leading-relaxed mb-3">{bm?.text1 || ''}</p>
        <p className="text-sm text-dark leading-relaxed mb-3">{bm?.text2 || ''}</p>
        <p className="text-sm text-dark leading-relaxed mb-3">{bm?.text3 || ''}</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
          <p className="text-xs text-primary font-semibold">📌 {bm?.conclusao || ''}</p>
        </div>
      </Card>
    </section>
  );
}
