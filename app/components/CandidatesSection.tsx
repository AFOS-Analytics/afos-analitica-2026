import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "42%", poll: "40.4% 1T (Meio/Ideia, 8/Abr) / 33.2% (Veritá, ~40k)", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "42% Poly (ESTÁVEL). Gap 5pp. 2T: Flávio 45.8% vs Lula 45.5% — empate técnico. VERITÁ (nova, ~40k): 33.2% 1T (atrás de Flávio 35.9%). Quaest (5/Abr): 66% rejeitam candidatura (↑4pp — recorde). Meio/Ideia: 51% desaprovação. LULA ATACA (9/Abr): 'Essa gente vai vender o Brasil' — minerais críticos vs Flávio/Caiado. Datafolha AMANHÃ 11/Abr." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "37%", poll: "37% 1T (Meio/Ideia, 8/Abr) / 35.9% (Veritá — LIDERA)", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "37% Poly (ESTÁVEL). VERITÁ (nova, ~40k): 35.9% LIDERA 1T — maior amostragem do ciclo. Rejeição Veritá: 34.6% vs Lula 43.1% (8.5pp vantagem). 2T: 45.8% à frente (Meio/Ideia, 8/Abr). ZEMA DESCARTA SER VICE (9/Abr): 'Não recebi convite, nem tenho interesse'. Senado PL 72%. Datafolha AMANHÃ 11/Abr." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "6.75%", poll: "4.4% 1T (AtlasIntel, 18-23/Mar) / 1.8% (Veritá, ~40k)", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "3º lugar 35% Polymarket (estável). AtlasIntel (18-23/Mar): 4.4% (3º). VERITÁ (nova, ~40k): 1.8% (empatado com Zema/Caiado na maior amostra). 24.7% entre jovens 16-24. ZEMA DESCARTA VICE FLÁVIO (9/Abr): campo anti-Lula fragmentado. VORCARO: ~45 dias levantamento docs — combustível narrativo futuro." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Ministro da Fazenda", polymarket: "4.9%", poll: "21-38% (sem Lula)", position: "Centro-esquerda. Plano B do PT se Lula não concorrer. Gestor técnico.", risk: "4.9% Poly (estável). Meio/Ideia: Lula 40.4% 1T; Veritá: Lula 33.2% — PT mantém Lula como candidato. Quaest (5/Abr): 66% rejeitam Lula — PT sem alternativa viável. LULA ATIVO (9/Abr): 'venderão o Brasil' — plano B perde urgência. VORCARO: impacto bilateral potencial." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás (renunciou 4/Abr)", polymarket: "2.3%", poll: "6.5% 1T (Meio/Ideia, 8/Abr) / 1.9% (Veritá, ~40k)", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "Divergência: Meio/Ideia 6.5% vs Veritá 1.9% (~40k). Poly 2.3%, 30% chance 3º lugar. Renunciou Goiás em 4/Abr. LULA CITA CAIADO (9/Abr): critica acordo Goiás-EUA para terras raras — coloca Caiado em pauta nacional. DATAFOLHA AMANHÃ 11/Abr (BR-03770/2026): 1ª com Caiado incluído — GRANDE TESTE." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais (renunciou 4/Abr)", polymarket: "1.9%", poll: "3.1% 1T (AtlasIntel, 18-23/Mar) / 1.8% (Veritá)", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "1.9% Poly, 13.5% chance 3º lugar. Veritá: 1.8%. Renunciou MG em 4/Abr. DESCARTA SER VICE DE FLÁVIO (9/Abr): 'Não recebi convite, nem tenho interesse' (O Antagonista); 'Levarei candidatura até o final' (Rádio Gaúcha). Autônomo na direita — comprometido com anti-Lula no 2T." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.35%", poll: "33% (cenário solo)", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "Descartado pelo mercado (0.35%). Apoia Flávio. Mantém-se em SP. Republicanos 10% Senado Polymarket. Polymarket estável — cenário de Tarcísio como apoiador de Flávio confirma-se." },
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
