import type { AnalysisSection } from '../types';
import { SectionTitle, Card } from './ui';

interface Props {
  stf: AnalysisSection | undefined;
  updatedAt: string | undefined;
}

export function StfSection({ stf, updatedAt }: Props) {
  return (
    <section>
      <SectionTitle icon="⚖️">Credibilidade do STF — Impacto Eleitoral</SectionTitle>
      {updatedAt && <p className="text-[10px] text-gray-400 -mt-3 mb-3">🔄 Análise atualizada: {updatedAt} BRT</p>}
      <Card className="border-l-4 border-l-[#DC2626]">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 text-red-700 font-bold text-xl px-4 py-2 rounded-lg">13.5%</div>
          <p className="text-sm text-gray-600">Probabilidade de impeachment de ministro do STF até 2027 (Polymarket, 06/Abr)</p>
        </div>
        <h4 className="font-bold text-sm text-[#1a1a1a] mb-2">Ministros sob pressão:</h4>
        <div className="grid md:grid-cols-2 gap-3 mb-4">
          {[
            { name: 'Dias Toffoli', desc: stf?.toffoli || '' },
            { name: 'Alexandre de Moraes', desc: stf?.moraes || '' },
            { name: 'Gilmar Mendes', desc: stf?.gilmar || '' },
            { name: 'Flávio Dino', desc: stf?.dino || '' },
          ].map(m => (
            <div key={m.name} className="bg-red-50 rounded-lg p-3">
              <div className="font-semibold text-sm text-[#1a1a1a]">{m.name}</div>
              <p className="text-xs text-gray-600 mt-1">{m.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
          <h4 className="font-bold text-xs text-[#DC2626] mb-2">🏦 NEXO STF × BANCO MASTER</h4>
          <p className="text-xs text-gray-700 leading-relaxed">{stf?.nexo || ''}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-[#1a1a1a] leading-relaxed">{stf?.analise || ''}</p>
        </div>
      </Card>
    </section>
  );
}
