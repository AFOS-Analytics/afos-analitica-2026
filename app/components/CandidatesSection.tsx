import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "41.5%", poll: "39% 1T (Datafolha campo)", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "41.5% Poly (↓0.5pp). Datafolha 2T: EMPATE com Flávio — mudança estrutural. Gap Polymarket 3.55pp (menor desde março). STF impeach CAIU para 14% (↓3pp) — mercado reduz risco institucional. Rejeição candidatura 66% Quaest. Haddad caiu para 4.9% — plano B PT enfraquece." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "37.95%", poll: "33% 1T (Datafolha campo)", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "37.95% Poly (↓0.05pp, gap 3.55pp). FT: 'candidatura forte' (BBC, 07/Abr). Lidera engajamento digital entre presidenciáveis (Revista Oeste, 07/Abr). PL Senado 78.5% (↑6.5pp FORTE). Malafaia: amarra apoio evangélico (Folha, 07/Abr). Tarcísio apoia Flávio contra reeleição (Folha)." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "6.75%", poll: "~3% 1T (Datafolha campo)", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "3º lugar 35% Polymarket. Datafolha campo: ~3% 1T (subregistro vs Atlas 4.4-4.6%). 24.7% entre jovens 16-24. Caiado ameaça 3º lugar. Zema 13.5% de chance de 3º lugar." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Ministro da Fazenda", polymarket: "4.9%", poll: "21-38% (sem Lula)", position: "Centro-esquerda. Plano B do PT se Lula não concorrer. Gestor técnico.", risk: "CAIU 1.1pp (de 6% para 4.9%). Mercado reduz plano B. Lula lidera Datafolha campo 39% 1T — plano B perde urgência. Datafolha 2T: empate Lula×Flávio força PT a manter Lula. Rejeição candidatura Lula 66% contamina alternativa PT." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás", polymarket: "2.3%", poll: "~4% 1T (Datafolha campo)", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "SUBIU 0.3pp (de 2% para 2.3%). Datafolha campo 4% — acima do esperado. 30% de chance de 3º lugar 1T. AtlasIntel MG: ~3.3% (empate Renan/Zema). Resultado completo 11/Abr." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais", polymarket: "1.9%", poll: "4-5% 1T (Datafolha campo)", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "1.9% Poly (↓0.1pp). Datafolha campo: 4-5% 1T. Renunciou MG (06/Abr). Novo condiciona candidatos Senado a voto pró-impeachment. STF impeach caiu para 14% (↓3pp). 13.5% de chance de 3º lugar. AtlasIntel MG: ~3.3% (empate Renan/Caiado)." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.45%", poll: "33% (cenário solo)", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "Descartado pelo mercado (0.45%). Apoia Flávio contra reeleição presidencial (Folha, 07/Abr). Mantém-se em SP (gov.). Republicanos 10% no Senado (Polymarket). TSE: 6 meses para eleições." },
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
