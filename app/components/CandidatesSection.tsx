import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';
import { useTranslation } from '../i18n/context';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "39.5%", poll: "37% 1T (Quaest, 15/Abr) / 39.2% (CNT/MDA, 15/Abr)", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "39.5% Poly (estável) — PERDE LIDERANÇA (Flávio ↑1.25pp), gap -0.9pp. Novo Datafolha: confirma liderança Lula (O Cafezinho). Tom muda 18/Abr: 'extremismo segue vivo' / 'fascistas' (CNN/Fórum) — contraste com 'temos que aceitar' (17/Abr). Wellington Dias: 'eleições mais fáceis que 2022'. QUAEST: 1T 37% lidera; 2T Flávio 42% × Lula 40%. Rejeição 55%. Evangélicos 68%. Paraná Pesquisas SP: 2T Flávio 48.1% × Lula 40.3%. PT+União coligação MG. Lula fim 6x1 + anti-bets = evangélicos (Folha)." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "40.4%", poll: "32% 1T (Quaest, 15/Abr) / 35.9% (Veritá — LIDERA)", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "40.4% Poly (↑1.25pp de 39.15%) — RETOMA LIDERANÇA. Gap +0.9pp sobre Lula. 2º lugar consolida 66% (↑3pp). Paraná Pesquisas SP (18/Abr): 2T 48.1% × Lula 40.3%. O Globo: 'transferência 2T favorece Flávio, isola Lula'. Tarcísio (MSN): 'Flávio pode vencer 1T'. Zema 3º lugar dispara 19.5% (↑11pp) — aliança direita. QUAEST 2T: 42% × 40% à frente. Rejeição 52%. CONVERGÊNCIA 6/7 institutos. RISCO: Brasil 247 — Moraes inquérito inelegibilidade possível." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "6.25%", poll: "4.4% 1T (AtlasIntel, 18-23/Mar) / 1.8% (Veritá, ~40k)", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "6.25% Poly (estável). 3º lugar 31% (↓0.5pp) — ZEMA DISPARA 19.5% (↑11pp) COMPRIME RENAN. Quaest: NÃO medido. STF impeach Poly CAI 13% (↓3pp) — mercado recua boomerang, dilui combustível anti-establishment. Delação Vorcaro dificultada tecnicamente (Gazeta Povo). Bipolarização Lula+Flávio 79.9% domina." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Pré-candidato Gov. SP", polymarket: "4.5%", poll: "Paraná Pesquisas SP: Tarcísio lidera, diferença CAI", position: "Centro-esquerda. Lula convenceu a disputar governo de SP. Fora da corrida presidencial.", risk: "4.5% Poly (↑0.15pp). Paraná Pesquisas 18/Abr: Tarcísio ainda à frente em SP MAS diferença CAI (Metrópoles). Revista Fórum: 'Lula cresce em SP'. 2º lugar Poly: 4.4% (↓1.55pp) — mercado recua hipótese PT trocar candidato. Plano B PT presidente: Camilo 2.25% (fraco). Marina lidera Senado SP." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás (renunciou 4/Abr)", polymarket: "1.85%", poll: "6% 1T (Quaest, 15/Abr) / 5% (Datafolha, 11/Abr)", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "1.85% Poly (↓0.3pp) — PERDE espaço. Mercado REALOCA 3ª via de Caiado para Zema. Quaest: 6% 1T. Rejeição 32% menor. 'Exército de prefeitos'. ACM Neto apoio. PSDB convida Ciro — mais fragmentação. Sem palanque grandes estados." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais (renunciou 4/Abr)", polymarket: "3.1%", poll: "3% 1T (Quaest, 15/Abr) / 4% (Datafolha, 11/Abr)", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "3.1% Poly (↑1.15pp de 1.95%) — SOBE FORTE. 3º LUGAR DISPARA: 19.5% (↑11pp de 8.5%) — SALTO HISTÓRICO, MAIOR MOVIMENTO DO DIA. Mercado precifica Zema vice Flávio (NSC Total 17/Abr) OU 3ª via autônoma. Rejeição 31% — MENOR de todos. Quaest: 3% 1T." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.35%", poll: "Paraná Pesquisas SP: LIDERA gov, mas diferença cai sobre Haddad", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "0.35% Poly (estável). Paraná Pesquisas SP (18/Abr, Metrópoles): 'Tarcísio continua à frente de Haddad mas diferença CAI'. MSN: Tarcísio afirma 'Flávio pode vencer Lula no 1T' — sinalização forte apoio. 3º lugar Poly: 1.6% (↓0.2pp)." },
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
