import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';
import { useTranslation } from '../i18n/context';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "39.5%", poll: "37% 1T (Quaest, 15/Abr) / 39.2% (CNT/MDA, 15/Abr)", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "39.5% Poly (estável) — LIDERA NOVAMENTE (Flávio ↓0.4pp 2º dia), gap +0.35pp. Folha: favorito por 48% apesar da queda. Mônica Bergamo: 'ainda favorito em 2026'. 'Temos que aceitar' vitória Flávio (O Globo, 17/Abr). QUAEST: 1T 37% lidera; 2T Flávio 42% × Lula 40%. CNT/MDA: 2T 44.9% lidera (único). Rejeição 55%. Evangélicos 68%. Governo muda estratégia Master — tenta paternidade. Fachin desengaveta antidelação PT por Moraes." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "39.15%", poll: "32% 1T (Quaest, 15/Abr) / 35.9% (Veritá — LIDERA)", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "39.15% Poly (↓0.4pp de 39.55%) — 2º DIA DE CORREÇÃO. Total -2.15pp em 48h. Atrás de Lula 0.35pp. Brasil 247: novo inquérito Moraes pode torná-lo INELEGÍVEL. Tarcísio: 'pode vencer no 1T' (Estadão). 2º lugar Poly: 63% (↓2pp). QUAEST: 2T 42% × Lula 40% — à frente. 6/7 institutos. Zema decide sobre ser vice (NSC Total). VEJA: plano eleitores católicos. Apelo Cristina Graeml — unir direita Senado." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "6.25%", poll: "4.4% 1T (AtlasIntel, 18-23/Mar) / 1.8% (Veritá, ~40k)", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "6.25% Poly (↓0.1pp). 3º lugar 31.5% (↓2.5pp) — PERDE FORÇA para Zema (8.5%, ↑1.5pp). Quaest: NÃO medido. DELAÇÃO VORCARO COMEÇOU + PF relatório STF + Fachin desengaveta antidelação PT + STF impeach Poly 16% (↑1.5pp) — combustível MÁXIMO anti-establishment. Bipolarização 78.65% comprime." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Pré-candidato Gov. SP", polymarket: "4.35%", poll: "Paraná Pesquisas SP: Tarcísio vantagem CAI sobre Haddad", position: "Centro-esquerda. Lula convenceu a disputar governo de SP. Fora da corrida presidencial.", risk: "4.35% Poly (↓0.1pp). Paraná Pesquisas SP (17/Abr, UOL): vantagem de Tarcísio CAI — Haddad 'encurta folga'. Marina lidera Senado SP. 2º lugar Poly: 5.95% (↑1.1pp) — mercado considera hipótese troca candidato. Plano B PT presidente: Camilo Santana 2.5% (fraco)." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás (renunciou 4/Abr)", polymarket: "2.15%", poll: "6% 1T (Quaest, 15/Abr) / 5% (Datafolha, 11/Abr)", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "2.15% Poly (estável). Quaest: 6% 1T. Rejeição 32%. Aposta em 'exército de prefeitos'. ACM Neto sugere apoio. Sem palanque grandes estados. Zema pode virar vice Flávio (NSC Total) — fragmentação 3ª via. PSDB convida Ciro." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais (renunciou 4/Abr)", polymarket: "1.95%", poll: "3% 1T (Quaest, 15/Abr) / 4% (Datafolha, 11/Abr)", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "1.95% Poly (↑0.55pp de 1.4%) — SOBE FORTE. 3º lugar Poly: 8.5% (↑1.5pp de 7%). DECIDE sobre ser vice Flávio (NSC Total, 17/Abr) — sinalização forte aliança direita. Rejeição 31% — MENOR de todos. Quaest: 3% 1T." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.35%", poll: "Paraná Pesquisas SP: LIDERA, mas vantagem cai sobre Haddad", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "0.35% Poly (estável). Paraná Pesquisas SP (17/Abr, UOL): LIDERA gov SP, mas vantagem CAI sobre Haddad. Marina lidera Senado SP. Estadão (17/Abr): 'Flávio pode vencer Lula no 1T' — sinalização forte de apoio a Flávio. 3º lugar Poly presidencial: 1.8% (↓1.2pp)." },
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
