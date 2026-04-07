import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "42%", poll: "19-47.6%", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "Estável 42% (07/Abr). Datafolha EM CAMPO hoje (7-9/Abr) — resultado 11/Abr. Atlas/CNN: +4pp 2T (recente). Rejeição 56% Quaest. Focus: inflação 4.36% (4ª semana alta)." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "37%", poll: "30-56%", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "Estável 37% (07/Abr). STF impeach RECUOU 16% (↓1pp). Atlas 2T à frente 1ª vez (47.6% vs 46.6%, 25/Mar). Datafolha presencial (11/Abr) pode reverter. PL Senado 72%." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "6.75%", poll: "1-4.6%", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "3º lugar 34.5% Polymarket. AtlasIntel: 4.4-4.6%, 24.7% entre jovens 16-24. Datafolha (7-9/Abr) testará força real. Caiado ameaça 3º lugar (30%)." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Ministro da Fazenda", polymarket: "6%", poll: "21-38% (sem Lula)", position: "Centro-esquerda. Plano B do PT se Lula não concorrer. Gestor técnico.", risk: "Consolida 6% (plano B precificado). TSE: 6 meses para eleições. Candidacy rejection Lula 66% contamina alternativa PT." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Governador de Goiás", polymarket: "2%", poll: "3-5%", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "2% Polymarket. 30% de chance de 3º lugar 1T. Datafolha (7-9/Abr): 1ª pesquisa presencial com Caiado — resultado 11/Abr. 3ª via comprimida (Lula+Flávio 79%)." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais", polymarket: "2%", poll: "3-6%", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "Renunciou ao governo MG (06/Abr). Novo condiciona candidatos Senado a voto pró-impeachment STF. STF impeach 16% (↓1pp). Entra mais forte na campanha." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.45%", poll: "33% (cenário solo)", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "Descartado pelo mercado. Campo definido pós-desincompatibilização (04/Abr). Mantém-se em SP. TSE: 6 meses para eleições." },
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
