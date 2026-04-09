import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "41.5%", poll: "40.4% 1T (Meio/Ideia, 8/Abr)", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "43% Poly (↑1.5pp). Gap 3pp (↓0.55pp). Meio/Ideia (8/Abr): 1T 40.4% vs Flávio 37% — liderança 3.4pp. MAS 2T: Flávio 45.8% vs Lula 45.5% (Flávio frente p/ 0.3pp). STF impeach 17%. Focus (6/Abr): IPCA 2026 = 4.36% (4ª alta, Selic 12.50%, dólar R$5,40) — pressão econômica. Rejeição 50.6% (AtlasIntel). 51.4% dizem que podem mudar o voto." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "37%", poll: "37% 1T (Meio/Ideia, 8/Abr)", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "40% Poly (↑2.05pp). Gap 3pp. Meio/Ideia (8/Abr): 2T 45.8% vs Lula 45.5% — à frente. 51.4% podem mudar voto — eleitorado mais volátil do ciclo. PL Senado 72% (↓6.5pp). STF impeach 17% (↑3pp) — narrativa anti-STF reforçada. Flávio diz que candidatura é 'irreversível' (CNN Brasil)." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "6.85%", poll: "~3-4.6% 1T (Datafolha/Atlas)", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "3º lugar 35% Polymarket. 24.7% entre jovens 16-24. Meio/Ideia: Caiado 6.5% ameaça 3º lugar. Zema 13.5% de chance de 3º lugar. 51.4% podem mudar voto — volatilidade favorece outsiders." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Ministro da Fazenda", polymarket: "5.45%", poll: "21-38% (sem Lula)", position: "Centro-esquerda. Plano B do PT se Lula não concorrer. Gestor técnico.", risk: "4.9% Poly (estável). Meio/Ideia: Lula 40.4% 1T — plano B perde urgência. 2T: Lula vs Flávio empatam — PT mantém Lula. PF Operação Recidiva (8/Abr) contra fraudes INSS mantém pressão sobre governo." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás (renunciou 4/Abr)", polymarket: "2.45%", poll: "6.5% 1T (Meio/Ideia, 8/Abr)", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "Meio/Ideia (8/Abr): FORTE ALTA — 6.5% 1T (maior resultado presencial até agora). Poly 2.3% (estável). 30% de chance de 3º lugar. Renunciou ao governo de Goiás em 4/Abr (desincompatibilização). Caiado enterra 'fantasia da terceira via' e mira eleitorado da direita. Datafolha 11/Abr: resultado decisivo." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais (renunciou 4/Abr)", polymarket: "1.75%", poll: "4-5% 1T (institutos)", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "1.9% Poly (estável). Renunciou MG em 4/Abr (desincompatibilização). Novo condiciona candidatos Senado a voto pró-impeachment STF. STF impeach 17%. 13.5% de chance de 3º lugar. Caiado (6.5% Meio/Ideia) pressiona espaço. Focus (6/Abr): IPCA 4.36% alinha com pauta fiscal do Novo." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.35%", poll: "33% (cenário solo)", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "Descartado pelo mercado (0.45%). Apoia Flávio contra reeleição. Republicanos 10% Senado Polymarket. Mantém-se em SP. Tarcísio buscou Flávio e Eduardo Bolsonaro por André do Prado no Senado." },
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
