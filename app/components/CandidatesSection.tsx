import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';
import { useTranslation } from '../i18n/context';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "40%", poll: "39% 1T (Datafolha, 11/Abr) / 40.4% (Meio/Ideia, 8/Abr)", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "40% Poly (↓1pp) — EMPATE COM FLÁVIO (ambos 40%), gap 4pp zerado. DATAFOLHA (11/Abr): 1T 39% lidera; 2T FLÁVIO 46% × LULA 45% (empate técnico). QUAEST (10/Abr): 2T empatam. Rejeição 48% (máxima). Desaprovação governo 51% (Datafolha, 11/Abr). MASTER: Lewandowski (ex-Min.Justiça) R$5.93M + Mantega pagos — contamina campo aliado. Quaest (5/Abr): 66% rejeitam candidatura. Quaest nova: result. AMANHÃ 15/Abr." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "40%", poll: "35% 1T (Datafolha, 11/Abr) / 35.9% (Veritá — LIDERA)", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "40% Poly (↑3pp) — EMPATA LULA PELA 1ª VEZ neste ciclo eleitoral. Gap 4pp zerado. 2º lugar Poly: 52% (estável). DATAFOLHA (11/Abr): 2T FLÁVIO 46% × LULA 45% — À FRENTE. QUAEST (10/Abr): 2T empatam — 5º instituto. Rejeição 46% (2pp abaixo de Lula). CPI STF-MASTER (10/Abr): 40 assinaturas Senado — narrativa anti-STF alimenta campo direita. FLÁVIO (11/Abr): 'Todos os perseguidos subirão a rampa do Planalto'. Senado PL 72%. Quaest nova: result. AMANHÃ 15/Abr." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "6.75%", poll: "4.4% 1T (AtlasIntel, 18-23/Mar) / 1.8% (Veritá, ~40k)", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "3º lugar 33% Polymarket (estável) — Caiado mantém liderança (36%). POLY empate Lula/Flávio (40%×40%): bipolarização cresce, comprime espaço de 3º via. Datafolha (11/Abr): NÃO medido. Veritá: 1.8%. 24.7% entre jovens 16-24. CPI STF-MASTER (10/Abr): 40 assinaturas alimentam narrativa anti-sistema. Quaest nova: result. AMANHÃ 15/Abr — medição decisiva para 3º lugar." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Ministro da Fazenda", polymarket: "4.9%", poll: "21-38% (sem Lula)", position: "Centro-esquerda. Plano B do PT se Lula não concorrer. Gestor técnico.", risk: "4.9% Poly (estável). DATAFOLHA (11/Abr): Lula 39% lidera 1T — PT mantém Lula, plano B sem urgência. MASTER: Mantega (ex-Min.Fazenda Lula, predecessor de Haddad) pagou — contexto desgastante para PT. Quaest (5/Abr): 66% rejeitam Lula. VORCARO: impacto bilateral potencial." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás (renunciou 4/Abr)", polymarket: "2.3%", poll: "5% 1T (Datafolha, 11/Abr) / 6.5% (Meio/Ideia, 8/Abr)", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "3º lugar Poly: 36% LIDERA (estável) — mantém vantagem sobre Renan (33%). DATAFOLHA (11/Abr): 5% 1T. 2T Lula 45% × Caiado 42% (Lula vence). REJEIÇÃO 16% (menor de todos). Poly 2.3% (vencedor). Quaest nova: result. AMANHÃ 15/Abr — 1ª com Caiado incluído, medição DECISIVA para consolidar posição." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais (renunciou 4/Abr)", polymarket: "1.9%", poll: "4% 1T (Datafolha, 11/Abr) / 3.1% (AtlasIntel)", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "1.9% Poly, 13.5% chance 3º lugar. DATAFOLHA (11/Abr): 4% no 1T. Rejeição Zema 17% (Datafolha). Renunciou MG em 4/Abr. DESCARTA SER VICE DE FLÁVIO (9/Abr): 'Levarei candidatura até o final' (Rádio Gaúcha). Autônomo na direita — comprometido com anti-Lula no 2T." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.35%", poll: "33% (cenário solo)", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "Descartado pelo mercado (0.35%). Apoia Flávio explicitamente. Mantém-se em SP para 2026. Republicanos 10% Senado Polymarket. FLÁVIO (11/Abr): 'todos perseguidos subirão a rampa' — inclui agenda de anistia que Tarcísio também defende." },
];

export function CandidatesSection() {
  const { t } = useTranslation();
  return (
    <section>
      <SectionTitle icon="👤">{t('sections.candidates')}</SectionTitle>
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
