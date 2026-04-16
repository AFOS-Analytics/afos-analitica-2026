import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';
import { useTranslation } from '../i18n/context';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "39.5%", poll: "37% 1T (Quaest, 15/Abr) / 39.2% (CNT/MDA, 15/Abr)", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "39.5% Poly (estável) — EMPATE restaurado com Flávio (39.55%), gap 0.05pp. Inquérito Moraes corrigiu Flávio ↓1.75pp. QUAEST: 1T 37% lidera; 2T Flávio 42% × Lula 40%. CNT/MDA: 2T 44.9% lidera (único instituto). Rejeição 55% (máxima). Evangélicos 68%. Desaprovação 52%. PF prendeu ex-presidente BRB (16/Abr). Haddad sai da corrida — vai para SP." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "39.55%", poll: "32% 1T (Quaest, 15/Abr) / 35.9% (Veritá — LIDERA)", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "39.55% Poly (↓1.75pp de 41.3%) — CORRIGIU após inquérito Moraes. Empate com Lula (0.05pp). SBT: condenação por calúnia pode torná-lo INELEGÍVEL. 2º lugar Poly: 65% (↑4pp). QUAEST: 2T 42% × Lula 40% — à frente. 6/7 institutos. Rejeição 52%. STF contra-ataca: limitar CPIs + Gilmar investiga relator." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "6.35%", poll: "4.4% 1T (AtlasIntel, 18-23/Mar) / 1.8% (Veritá, ~40k)", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "3º lugar 34% Poly (estável). Quaest: NÃO medido. STF contra-ataca (limitar CPIs + Gilmar investiga relator) — combustível anti-establishment. PF prendeu ex-BRB — sistema exposto. Rejeição Lula 55% + Flávio 52% = espaço. Bipolarização 79% Poly comprime." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Pré-candidato Gov. SP", polymarket: "4.45%", poll: "Paraná Pesquisas SP: atrás de Tarcísio", position: "Centro-esquerda. Lula convenceu a disputar governo de SP. Sai da corrida presidencial.", risk: "SAI DA CORRIDA PRESIDENCIAL — vai disputar governo SP (BPMoney, 15/Abr). Paraná Pesquisas (16/Abr): Tarcísio lidera todos cenários. Plano B PT para presidente: Camilo Santana (2.6% Poly). PT mira 90 deputados + 14 senadores. Poly 4.45% residual." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás (renunciou 4/Abr)", polymarket: "2.15%", poll: "6% 1T (Quaest, 15/Abr) / 5% (Datafolha, 11/Abr)", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "Quaest: 6% 1T. Rejeição 32% (2ª menor). Sem palanque grandes estados — aposta em 'exército de prefeitos' (16/Abr). ACM Neto sugere apoio. Poly 2.15%. PSDB convida Ciro — fragmentação 3ª via." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais (renunciou 4/Abr)", polymarket: "1.4%", poll: "3% 1T (Quaest, 15/Abr) / 4% (Datafolha, 11/Abr)", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "1.4% Poly (↓0.05pp). Quaest: 3% 1T. Rejeição 31% — MENOR de todos. 3º lugar Poly: 7% (↓1pp). Descartou vice de Flávio. Autônomo na direita." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.35%", poll: "Paraná Pesquisas SP: LIDERA todos cenários gov.", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "0.35% Poly (↑0.1pp). Paraná Pesquisas SP (16/Abr): LIDERA todos cenários ao governo (CNN). Haddad vai disputar SP contra ele. Marina lidera Senado SP. Nunes Marques presidente TSE." },
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
