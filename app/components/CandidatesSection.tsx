import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';
import { useTranslation } from '../i18n/context';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "39.5%", poll: "37% 1T (Quaest, 15/Abr) / 39.2% (CNT/MDA, 15/Abr)", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "39.5% Poly (estável) — EMPATE TÉCNICO (Flávio cai para 39.6%, gap -0.1pp). Flávio desinfla após salto 18/Abr. Lula 2º lugar Poly: 17% (↑1pp). VOTO FEMININO VIRA CENTRO: Folha (19/Abr) — 'Lula intensifica agenda voltada às mulheres'. Poder360: 'Mulheres viram foco central das campanhas'. Estratégia debate: 'Lula tratará Flávio como submisso a Trump' (Estadão 19/Abr). Gazeta Povo (18/Abr): 'Como Lula derreteu vantagem de 2022'. Nordeste: queda Lula / crescimento Flávio (BNews 19/Abr). QUAEST: 1T 37% lidera; 2T Flávio 42% × Lula 40%. Rejeição 55%. Paraná Pesquisas SP: 2T Flávio 48.1% × Lula 40.3%. MG: Lula+Aécio mesma aliança? (Estadão 19/Abr). PT RJ apoia Paes + Benedita Senado." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "39.6%", poll: "32% 1T (Quaest, 15/Abr) / 35.9% (Veritá — LIDERA)", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "39.6% Poly (↓0.8pp de 40.4%) — DESINFLA APÓS SALTO. Mantém liderança mínima (+0.1pp sobre Lula) — EMPATE TÉCNICO. 2º lugar consolida 66.5% (↑0.5pp). Paraná Pesquisas SP: 2T 48.1% × Lula 40.3%. Nill Junior (19/Abr): 'Avanço Flávio entre mulheres, jovens e classe média explica empate'. Estratégia debate: 'Flávio atacará falhas Lula economia e segurança' (Estadão 19/Abr). Fissura com Caiado: 'Visão sobre ativismo judicial separa' (Gazeta Povo 19/Abr). Tarcísio (MSN 19/Abr): 'Flávio pode vencer 1T'. PL Senado CAI 76.5% (↓3pp) — mercado desinfla. Zema 3º lugar regride 19% (↓0.5pp). Rejeição 52%. RISCO: Moraes inquérito inelegibilidade possível." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "6.25%", poll: "4.4% 1T (AtlasIntel, 18-23/Mar) / 1.8% (Veritá, ~40k)", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "6.25% Poly (estável). 3º lugar 32% (↑1pp) — RECUPERA de Zema (19% ↓0.5pp). STF impeach Poly CAI 11.5% (↓1.5pp) — boomerang perde força mais 1 dia. BC aprovou controle Master Vorcaro após rejeitar (Jornal Grande Bahia 19/Abr) — novo escândalo institucional. CPMI pede depoimento Vorcaro via STF (MSN). Senado seguirá investigando pós-CPI (n3news). Caiado procurou Ciro (Pleno.News 19/Abr) — 3ª via se reorganiza mas FORA de Renan. Bipolarização Lula+Flávio 79.1% domina." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Pré-candidato Gov. SP", polymarket: "4.1%", poll: "Paraná Pesquisas SP: Tarcísio lidera, diferença CAI", position: "Centro-esquerda. Lula convenceu a disputar governo de SP. Fora da corrida presidencial.", risk: "4.1% Poly (↓0.4pp) — recua após alta. Paraná Pesquisas SP: Tarcísio à frente mas diferença CAI (Metrópoles 18/Abr). Revista Fórum: 'Lula cresce em SP'. 2º lugar Poly: 4.6% (↑0.2pp) — mercado reavalia hipótese PT trocar candidato. PT RJ apoia Eduardo Paes + lança Benedita Senado (Terra/Congresso em Foco 19/Abr) — RJ consolidado. 'PT aposta em influenciadores digitais' (Piauí Hoje 19/Abr)." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás (renunciou 4/Abr)", polymarket: "1.95%", poll: "6% 1T (Quaest, 15/Abr) / 5% (Datafolha, 11/Abr)", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "1.95% Poly (↑0.1pp) — LEVE RECUPERAÇÃO após Zema regredir. PROCUROU CIRO GOMES (Pleno.News 19/Abr) — articulação 3ª via. FISSURA COM FLÁVIO: 'Visão sobre ativismo judicial separa Flávio de Caiado' (Gazeta Povo 19/Abr) — conflito tático dentro da direita. Quaest: 6% 1T. Rejeição 32% menor. 'Exército de prefeitos'. ACM Neto apoio. PSD Senado 5.1% (↑0.15pp)." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais (renunciou 4/Abr)", polymarket: "2.25%", poll: "3% 1T (Quaest, 15/Abr) / 4% (Datafolha, 11/Abr)", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "2.25% Poly (↓0.85pp de 3.1%) — REGRIDE após salto histórico 18/Abr. 3º lugar: 19% (↓0.5pp de 19.5%) — desinfla mas mantém 2ª posição no mercado. Mercado realoca de volta: Renan 32% > Zema 19% > Haddad 3.95%. Partido Novo Senado: 0.4%. Rejeição 31% — MENOR de todos. Quaest: 3% 1T. Nó político MG: Estadão — 'pode empurrar Lula e Aécio para mesma aliança' = complica 2º turno MG." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.35%", poll: "Paraná Pesquisas SP: LIDERA gov, mas diferença cai sobre Haddad", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "0.35% Poly (estável). Paraná Pesquisas SP (18/Abr, Metrópoles): 'Tarcísio continua à frente de Haddad mas diferença CAI'. MSN (19/Abr): Tarcísio reafirma 'Flávio pode vencer Lula no 1T' — sinalização forte apoio ao PL. 3º lugar Poly: 0.75% (↓0.85pp de 1.6%) — mercado retira aposta Tarcísio 3º." },
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
