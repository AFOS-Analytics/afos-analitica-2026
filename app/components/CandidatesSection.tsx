import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "42%", poll: "39% 1T (Datafolha campo)", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "42% Poly (estável). NOVO Datafolha campo (7-9/Abr): 39% 1T vs Flávio 33% — liderança presencial 6pp. Resultado 2T: 11/Abr. Rejeição candidatura 66% (Quaest). Inflação Poly: 5.00-5.49% lidera (39%)." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "37%", poll: "33% 1T (Datafolha campo)", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "37% Poly (estável, gap -5pp). NOVO Datafolha campo: 33% 1T vs Lula 39%. STF impeach ↑17% (+1pp vs 09h). Atlas 2T à frente (47.6% vs 46.6%, 25/Mar). Resultado 2T Datafolha: 11/Abr. PL Senado 72%." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "6.75%", poll: "~3% 1T (Datafolha campo)", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "3º lugar 34.5% Polymarket. NOVO Datafolha campo: ~3% 1T (subregistro vs Atlas 4.4-4.6%). 24.7% entre jovens 16-24. Atlas MG: empatado com Caiado e Zema (~3.3%). Caiado ameaça 3º lugar (30%)." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Ministro da Fazenda", polymarket: "6%", poll: "21-38% (sem Lula)", position: "Centro-esquerda. Plano B do PT se Lula não concorrer. Gestor técnico.", risk: "Consolida 6% (plano B precificado). Lula lidera Datafolha campo (39% 1T) — reduz urgência do plano B. Candidacy rejection Lula 66% contamina alternativa PT. TSE: 6 meses para eleições." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás", polymarket: "2%", poll: "~4% 1T (Datafolha campo)", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "2% Poly. 30% de chance de 3º lugar 1T. NOVO Datafolha campo: ~4% 1T — MELHOR resultado presencial, acima do esperado. Atlas MG: ~3.3% (empate Renan/Zema). Resultado completo 11/Abr." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais", polymarket: "2%", poll: "4-5% 1T (Datafolha campo)", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "NOVO Datafolha campo: 4-5% 1T. Renunciou MG (06/Abr). Novo condiciona candidatos Senado a voto pró-impeachment. STF impeach ↑17% (+1pp). Atlas MG: ~3.3% (empate Renan/Caiado). Entra mais forte." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.45%", poll: "33% (cenário solo)", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "Descartado pelo mercado (0.45%). Campo definido pós-desincompatibilização (04/Abr). Mantém-se em SP (gov.). Republicanos 10% no Senado (Polymarket). TSE: 6 meses para eleições." },
];

export function CandidatesSection() {
  return (
    <section>
      <SectionTitle icon="👤">Perfil dos Pré-Candidatos</SectionTitle>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.map(c => (
          <Card key={c.name} className="flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div>
                <h4 className="font-bold text-[#1a1a1a]">{c.name}</h4>
                <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: partyColor[c.party] || '#94A3B8' }}>{c.party}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-2">{c.role} · {c.age} anos</div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-500">Polymarket</div>
                <div className="font-bold text-[#0F52BA]">{c.polymarket}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-500">Pesquisa</div>
                <div className="font-bold text-[#1a1a1a]">{c.poll}</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-2"><strong>Posição:</strong> {c.position}</p>
            <p className="text-xs text-red-600"><strong>⚠️ Risco:</strong> {c.risk}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
