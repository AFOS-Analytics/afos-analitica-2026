import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "42%", poll: "40.4% 1T (Meio/Ideia, 8/Abr)", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "42% Poly (↓1pp). Gap REABRE 5pp (↑2pp — Flávio cedeu 3pp). 2T: Flávio 45.8% vs Lula 45.5% — empate técnico. Quaest (5/Abr): 66% rejeitam candidatura (↑4pp — recorde). Meio/Ideia: 51% desaprovação. STF impeach 17% estável. VORCARO IMINENTE: delação pode fechar semana de 7-11/Abr. Datafolha 11/Abr: resultado decisivo." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "37%", poll: "37% 1T (Meio/Ideia, 8/Abr)", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "37% Poly (↓3pp — MAIOR QUEDA DIÁRIA, realização pós-pico 40%). Gap 5pp. 2T: 45.8% à frente (Meio/Ideia, 8/Abr). Expogrande Campo Grande + visita ao pai (9/Abr). Reuniu lideranças (União Brasil, PP, PL) em 8/Abr. Financial Times: candidato competitivo. PL Senado REVERTE para 79% (↑7pp). VORCARO IMINENTE esta semana." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "6.75%", poll: "~3-4.6% 1T (AtlasIntel/Datafolha)", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "3º lugar 35% Polymarket (estável). AtlasIntel Paraná (2/Abr): 3%. 24.7% entre jovens 16-24. Caiado 6.5% Meio/Ideia: ameaça 3º lugar nos presenciais. Zema 13.5% de chance 3º. VORCARO IMINENTE: combustível narrativo anti-establishment." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Ministro da Fazenda", polymarket: "4.9%", poll: "21-38% (sem Lula)", position: "Centro-esquerda. Plano B do PT se Lula não concorrer. Gestor técnico.", risk: "4.9% Poly (estável). Meio/Ideia: Lula 40.4% 1T — plano B perde urgência. Quaest (5/Abr): 66% rejeitam candidatura Lula (↑4pp) — PT sem alternativa viável. VORCARO IMINENTE: impacto bilateral potencial." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás (renunciou 4/Abr)", polymarket: "2.3%", poll: "6.5% 1T (Meio/Ideia, 8/Abr)", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "Meio/Ideia (8/Abr): 6.5% 1T — maior resultado presencial do ciclo, supera Renan nos institutos físicos. Poly 2.3% (estável). 30% chance 3º lugar. Renunciou Goiás em 4/Abr. Quaest: 66% rejeição Lula = espaço para direita tradicional. Datafolha 11/Abr: grande teste." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais (renunciou 4/Abr)", polymarket: "1.9%", poll: "4-5% 1T (institutos)", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "1.9% Poly (estável). 13.5% de chance de 3º lugar. Renunciou MG em 4/Abr. AtlasIntel Paraná (2/Abr): 4.8%. Novo condiciona candidatos Senado a voto pró-impeachment STF. VORCARO IMINENTE: narrativa anti-sistema pode beneficiar. PL Senado 79% (↑7pp)." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.35%", poll: "33% (cenário solo)", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "Descartado pelo mercado (0.35%). Apoia Flávio. Mantém-se em SP. Republicanos ~10% Senado Polymarket. Flávio cedeu 3pp hoje — não muda cenário de Tarcísio como apoiador." },
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
                <h4 className="font-bold text-dark">{c.name}</h4>
                <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: partyColor[c.party] || '#94A3B8' }}>{c.party}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-2">{c.role} · {c.age} anos</div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-500">Polymarket</div>
                <div className="font-bold text-primary">{c.polymarket}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-500">Pesquisa</div>
                <div className="font-bold text-dark">{c.poll}</div>
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
