import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';
import { useTranslation } from '../i18n/context';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "39.5%", poll: "37% 1T (Quaest, 15/Abr) / 39.2% (CNT/MDA, 15/Abr)", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "39.5% Poly (↓0.5pp) — ATRÁS de Flávio (41.3%), gap 1.8pp. QUAEST (15/Abr): 1T 37% lidera; 2T FLÁVIO 42% × LULA 40% — atrás pela 1ª vez na Quaest. CNT/MDA: 2T Lula 44.9% lidera (único instituto). Rejeição 55% (MÁXIMA do ciclo). Desaprovação governo 52%. MASTER: Lewandowski R$5.93M. CPI Crime REJEITOU relatório contra STF — 'operação abafa' (Estadão)." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "41.3%", poll: "32% 1T (Quaest, 15/Abr) / 35.9% (Veritá — LIDERA)", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "41.3% Poly (↑1.3pp) — ULTRAPASSA LULA, LIDERA pela 1ª vez. 2º lugar Poly: 61% (↑9pp). QUAEST (15/Abr): 2T FLÁVIO 42% × LULA 40% — à frente pela 1ª vez na Quaest. Futura/Apex: 2T 48% × 42.6%. CONVERGÊNCIA: 6/7 institutos. Rejeição 52%. Moraes abre inquérito por calúnia (Maduro/Lula). Senado PL 79.5% (↑7.5pp)." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "6.35%", poll: "4.4% 1T (AtlasIntel, 18-23/Mar) / 1.8% (Veritá, ~40k)", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "3º lugar 34% Polymarket (estável). Quaest (15/Abr): NÃO medido. Veritá: 1.8%. 24.7% entre jovens 16-24. CPI Crime REJEITOU relatório contra STF — 'operação abafa' reforça narrativa anti-establishment. Bipolarização Lula+Flávio = 80.8% Poly — comprime espaço." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Ministro da Fazenda", polymarket: "4.35%", poll: "21-38% (sem Lula)", position: "Centro-esquerda. Plano B do PT se Lula não concorrer. Gestor técnico.", risk: "4.35% Poly (↓0.55pp — em queda). QUAEST (15/Abr): Lula 37% lidera 1T — PT mantém Lula. JOTA: 'dúvidas de Lula sobre candidatura'. Rejeição Lula 55% contamina PT. Camilo Santana surge no Poly com 2.5% — novo concorrente no plano B." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás (renunciou 4/Abr)", polymarket: "2.25%", poll: "6% 1T (Quaest, 15/Abr, ↑1pp) / 5% (Datafolha, 11/Abr)", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "QUAEST (15/Abr): 6% 1T (↑1pp de 5% Datafolha) — CRESCIMENTO CONFIRMADO. Rejeição 32% (2ª menor, Zema 31%). Poly 2.25%. Aliados de Flávio: 'Caiado leva ao 2T' (Folha, 15/Abr). PSDB convida Ciro Gomes — mais concorrência na 3ª via." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais (renunciou 4/Abr)", polymarket: "1.45%", poll: "3% 1T (Quaest, 15/Abr) / 4% (Datafolha, 11/Abr)", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "1.45% Poly (↓0.45pp de 1.9%). QUAEST (15/Abr): 3% no 1T (↓1pp de 4% Datafolha). Rejeição 31% — MENOR de todos (Quaest). 3º lugar Poly: 8%. Descartou ser vice de Flávio (9/Abr). Autônomo na direita. Pré-candidatos a gov. MG em disputa (JOTA, 15/Abr)." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.25%", poll: "33% (cenário solo)", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "0.25% Poly (↓0.1pp). Descartado pelo mercado. Apoia Flávio. Mantém-se em SP. Republicanos no Senado. Nunes Marques (indicado Bolsonaro) eleito presidente TSE (15/Abr) — campo jurídico-político se reorganiza." },
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
