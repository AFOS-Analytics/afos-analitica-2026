import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';
import { LogicLink } from './LogicLink';
import { useTranslation } from '../i18n/context';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "38.5%", poll: "39% 1T Datafolha (21/Abr) / 44% 2T CNT (21/Abr) / 28.2% RS (22/Abr Diário do Poder)", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "38.5% Poly (estável) — gap com Flávio ENCURTA para -0.45pp (Flávio caiu 38.95%). 2º lugar Poly Lula RECUA 14.5% (↓1.5pp de 16%). 3º lugar cai 0.75% (↓0.35pp). STF impeach VOLTA A SUBIR LEVE: 12% (↑1pp, parcial reversão do despenque da manhã) — Flávio ativa narrativa: 'Zema é vítima de militância do Judiciário' (Folha 22/Abr), pede 'não haja interferência' (Valor 22/Abr). Campanha Lula pediu retirada de vídeo de Flávio que associa presidente à corrupção (Folha 22/Abr). PT usa Bíblia em ofensiva contra Flávio (Metrópoles 22/Abr). RS: Flávio 42.2% × Lula 28.2% (Diário do Poder 22/Abr) — deficit sul pesado. Expressão Brasiliense: 'palmeira de Sidônio balança' (crítica interna ao governo). Senado pediu STF rejeitar antidelação PT de Moraes (O Globo 22/Abr)." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "38.95%", poll: "35% 1T Datafolha (21/Abr) / 40% 2T CNT (21/Abr) / 42.2% RS (22/Abr Diário do Poder)", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "38.95% Poly (↓0.45pp de 39.4%) — LEVE RECUO mas mantém liderança isolada (+0.45pp sobre Lula). 2º lugar Poly CAI FORTE: 64.5% (↓3.5pp de 68%) — mercado reduz consolidação 2T. PL Senado RETOMA 83% (↑2pp de 81%). Flávio ATIVA narrativa STF: 'Zema é vítima de militância do Judiciário', pede 'não haja interferência' (Folha + Valor Econômico 22/Abr). RS FORTÍSSIMO: 42.2% × Lula 28.2% (Diário do Poder 22/Abr). 'Gazeta Povo: Flávio pode ficar fora da eleição de 2026?' (23/Abr) — título provocativo sobre inelegibilidade volta à pauta. Mauro (MT) promete 70% dos votos a Flávio (Rdnews 22/Abr). PL SP lança Alesp→Senado, Eduardo Bolsonaro decisor (CNN Brasil 22/Abr). PT usa Bíblia em ofensiva (Metrópoles). Aécio propõe aliança a Ciro no CE após disputa com Michelle (Gazeta Povo 22/Abr)." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "6.05%", poll: "4.4% 1T (AtlasIntel) / 1.8% (Veritá) / N/A Quaest", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "6.05% Poly (↑0.05pp, praticamente estável) — Zema recua 1ª vez após 3 dias de alta (6.15%), Renan e Zema praticamente empatados no presidencial. 3º lugar MUITO APERTADO: Renan 28% (↓0.5pp) × Zema 27.5% (↑1.5pp) — gap apenas 0.5pp, pode inverter a qualquer momento. STF impeach Poly VOLTA A SUBIR LEVE: 12% (↑1pp) — Flávio reativa tema STF dando combustível parcial a tese anti-establishment. Senado pediu STF rejeitar antidelação PT de Moraes (O Globo 22/Abr) — dinâmica STF × Congresso aquece. Vorcaro passa mal durante negociação de delação na PF (Conexão Política 22/Abr). Ex-presidente BRB troca defesa e quer delatar (SBT News 22/Abr). Renan ainda sem peça pública." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Pré-candidato Gov. SP", polymarket: "3.35%", poll: "Paraná Pesquisas SP: Tarcísio lidera, diferença CAI", position: "Centro-esquerda. Lula convenceu a disputar governo de SP. Fora da corrida presidencial.", risk: "3.35% Poly (↓0.1pp) — leve recuo presidencial. 2º LUGAR POLY SOBE FORTE: 6.1% (↑2.75pp de 3.35%) — movimento inesperado, mercado considerando Haddad como 2º colocado alternativo? 3º lugar 3.85% (↑0.15pp). Rede apoia Marina Senado SP + Haddad gov (Folha 21/Abr mantido). PEC 6x1 comissão será instalada (Congresso em Foco 22/Abr) — agenda econômica favorável ao discurso PT. Tarcísio trabalha superar resistência Flávio SP (Metrópoles 22/Abr) — fragilidade adversário confirmada. Senado PT leve recuo 2.85% (↓0.1pp)." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás (renunciou 4/Abr)", polymarket: "1.85%", poll: "6% 1T (Quaest) / 5% (Datafolha)", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "1.85% Poly (estável). PSD Senado RETOMA 5.65% (↑0.7pp de 4.95%). 2º lugar estável 1.5%. Sem peça pública relevante hoje. Aécio Neves propõe aliança a Ciro no CE após disputa com Michelle (Gazeta Povo 22/Abr) — afetará arranjo PSD localmente. Caiado fora do radar nacional do dia." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais (renunciou 4/Abr)", polymarket: "6.15%", poll: "3% 1T (Quaest) / 4% (Datafolha)", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "6.15% Poly (↓1pp de 7.15%) — 1º RECUO após 3 dias de alta consecutiva (correção esperada). 3º lugar CONTINUA SUBINDO: 27.5% (↑1.5pp de 26%) — AMEAÇA CRÍTICA a Renan (28%, gap apenas 0.5pp). Zema defende candidatura própria: 'O que existe são 3 candidaturas e vou levar a minha até o final' (Estadão 22/Abr) — responde à pressão para ser vice de Flávio. Flávio DEFENDE Zema: 'Zema é vítima de militância do Judiciário', critica STF, pede que não haja 'interferência na eleição' (Folha + Valor Econômico 22/Abr) — aliança tática anti-STF. Sinal importante: mesmo com leve recuo presidencial, 3º lugar continua firme." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.35%", poll: "Paraná Pesquisas SP: LIDERA gov, mas diferença cai sobre Haddad", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "0.35% Poly (estável). 3º lugar 0.45% (↓0.85pp de 1.3% — mercado devolve alta de manhã). Tarcísio trabalha superar resistência a Flávio em SP (Metrópoles 22/Abr) — esforço público para consolidar Flávio no estado-chave. Após 'bênção' de Eduardo Bolsonaro, PL define candidato ao Senado em SP (Revista Fórum 23/Abr) — movimento articulado pelo próprio Tarcísio." },
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
