import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';
import { LogicLink } from './LogicLink';
import { useTranslation } from '../i18n/context';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "35.5%", poll: "**Nexus/BTG 27/Abr: 1T 41% LIDERA / 2T 46% × Flávio 45% (empate técnico)** | Vox SP 2T 38.1% / Paraná RJ 2T 40.5%", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "35.5% Poly (↓2pp de 37.5% ontem) — **DESPENCA**, gap -4.8pp Flávio (era -1.65pp — AMPLIA muito, maior do ciclo). 2º lugar 17% estável. **NEXUS/BTG PACTUAL 27/Abr — primeira grande nacional do dia-bomba**: 1T Lula 41% × Flávio 36% (LIDERA por 5pp); 2T empate técnico Lula 46% × Flávio 45% (CNN+Folha+Estadão+Estado Minas+Poder360 27/Abr 11:00-13:00). Empate técnico Lula com Flávio, Zema E Caiado no 2T (CNN+O Tempo). Rejeição ambos 48% (CNN). **STF impeach DESPENCA 11% (↓5pp de 16%)** — pico do ciclo desfeito (Messias aprovação confortável + Ação CPI Master parada 1 mês STF). PT Senado RECUPERA 2.65% (↑1.65pp de 1%). MAS: **Tarcísio: 'Flávio será o próximo presidente'** (CNN 15:11, G1 19:24). PL nega Flávio Master após vídeo PT (Diário Povo 20:17)." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "40.30%", poll: "**Nexus/BTG 27/Abr: 1T 36% / 2T 45% (empate técnico Lula)** | Vox SP 2T 50.4% / Paraná RJ 2T 47% / Quaest 2T 42%", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "40.30% Poly (↑1.15pp de 39.15%) — **DISPARA, atinge 40%+ pela 1ª vez no ciclo**. Gap -4.8pp Flávio (era -1.65pp — maior do ciclo). 2º lugar 66.5% (↑0.5pp). **3º lugar Flávio 5.25% (↑1.6pp)**. **FLÁVIO + TARCÍSIO 1º ATO PRÉ-CAMPANHA JUNTOS** (G1+Folha 17:13+Estadão+CNN 27/Abr). **TARCÍSIO: 'Flávio será o próximo presidente'** (G1 19:24, CNN 15:11). PL Senado 81.5% (↓2pp leve). MAS: **Nexus 1T Lula 41% × Flávio 36%** — 1ª grande nacional adversa. **PL reage a 'BolsoMaster': desempenho Flávio causa desconforto governo** (SBT 21:51). **STF impeach DESPENCA 11%** — combustível anti-STF reduzido." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "5.5%", poll: "Nexus 27/Abr 2T: empate técnico Lula × Renan/Zema/Caiado", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "5.5% Poly (↑0.2pp leve). **3º lugar Renan 26.5% (↑1.5pp recupera leve)** × Zema 40.5% × Caiado 24% (↓3pp devolve). **STF IMPEACH DESPENCA 11% (↓5pp de 16%)** — combustível anti-STF do ciclo desfeito. **Ação CPI Master parada 1 mês STF** (Agenda do Poder 11:47). **Ministros STF apostam Messias aprovação próximo a Dino** (SBT 19:40) — Corte coesa precificada. Renan 11º dia sem peça pública." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Pré-candidato Gov. SP", polymarket: "3.6%", poll: "Tarcísio lidera SP 48.2% × Haddad em 2T (mantido)", position: "Centro-esquerda. Lula convenceu a disputar governo de SP. Fora da corrida presidencial.", risk: "3.6% Poly (↑0.25pp). **2º lugar Poly Haddad RECUPERA FORTE: 5.8% (↑3.4pp de 2.4%)** — volta a patamar competitivo. 3º lugar 4% (↑0.75pp). **PT Senado RECUPERA: 2.65% (↑1.65pp de 1%)** — devolve queda. Tarcísio chama Flávio 'próximo presidente' (CNN+G1) — confronto SP intensifica. Marina+Derrite+Tebet+Do Prado Senado SP mantido." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás (renunciou 4/Abr)", polymarket: "1.75%", poll: "**Nexus 27/Abr 2T: empate técnico Lula × Caiado** | 6% 1T Quaest (15/Abr)", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "1.75% Poly (↓0.1pp leve). **3º lugar Poly devolve 24% (↓3pp de 27%)** mas mantém posição forte. **PSD Senado RECUPERA FORTE 6.55% (↑2.7pp de 3.85%)** — recupera queda massiva ontem. **NEXUS 27/Abr: empate técnico 2T Lula × Caiado** — primeira evidência institucional viabilidade Caiado 2T. Quaest gov GO em digestão." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais (renunciou 4/Abr)", polymarket: "9.45%", poll: "**Nexus 27/Abr 2T: empate técnico Lula × Zema** | 3% 1T Quaest", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "9.45% Poly (↓0.4pp de 9.85%) — leve recuo, segue abaixo dos 10%. **3º lugar 40.5% (↑3pp — DISPARA AINDA MAIS, nova máxima do ciclo)**. **NEXUS 27/Abr: empate técnico 2T Lula × Zema** — primeira evidência institucional viabilidade 2T Zema. ZEMA promete privatizar Petrobras+BB mantido. STF impeach DESPENCA 11% — combustível anti-STF reduz mas Zema mantém liderança absoluta 3ª via." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.25%", poll: "Tarcísio lidera SP gov 48.2% mantido", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "0.25% Poly (estável). **TARCÍSIO + FLÁVIO 1º ATO PRÉ-CAMPANHA JUNTOS** (G1+Folha+Estadão+CNN 27/Abr 17:13) — alinhamento total ao projeto Flávio. **'Flávio será o próximo presidente'** (G1 19:24). **'Tarcísio tem capacidade de ser presidente e será um dia'** (CNN 15:11). **'Senado SP: Flávio elogia André do Prado'** (G1 17:16). Inflexão estratégica de 'lideranças envelhecidas' (26/Abr) confirmada com ação concreta." },
];

export function CandidatesSection() {
  const { t } = useTranslation();
  return (
    <section>
      <SectionTitle icon="👤" rightSlot={<LogicLink anchor="perfil-candidatos" />}>{t('sections.candidates')}</SectionTitle>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.map(c => (
          <Card key={c.name} className="flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div>
                <h4 className="font-bold text-dark">{c.name}</h4>
                <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: partyColor[c.party] || '#94A3B8' }}>{c.party}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-2">{c.role} · {c.age} {t('candidates.age')}</div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-500">Polymarket</div>
                <div className="font-bold text-primary">{c.polymarket}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-500">{t('candidates.poll')}</div>
                <div className="font-bold text-dark">{c.poll}</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-2"><strong>{t('candidates.position')}:</strong> {c.position}</p>
            <p className="text-xs text-red-600"><strong>⚠️ {t('candidates.risk')}:</strong> {c.risk}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
