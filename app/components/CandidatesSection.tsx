import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';
import { LogicLink } from './LogicLink';
import { useTranslation } from '../i18n/context';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "38.5%", poll: "39% 1T Datafolha (21/Abr) / 44% 2T CNT (21/Abr) / 51.4% PE (21/Abr)", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "38.5% Poly (estável vs 21/Abr) — segue atrás de Flávio (gap -0.9pp). 2º lugar Poly SOBE 16.0% (↑0.5pp). 3º lugar Poly cai 1.1% (↓0.3pp). STF IMPEACH DESPENCA: 11% (↓2.5pp de 13.5%) — reversão forte, CPI Master esfriando esvazia caso. Estratégia: Lula intensifica contraponto a Trump mirando desgaste de Flávio (Folha 22/Abr). Lula quer explorar Flávio como 'Opala velho' e mostrar Brasil 'radioativo' sob Jair (Estadão 22/Abr). Sabatina Jorge Messias STF ADIADA (Diário do Estado 22/Abr) — atraso indicação. Wellington Dias aposta experiência Lula em eleição polarizada (CidadeVerde 21/Abr). Datafolha 21/Abr mantém: 1T 39% × Flávio 35%. Reforma Judiciário vira pauta 2026 (Metrópoles 22/Abr)." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "39.4%", poll: "35% 1T Datafolha (21/Abr) / 40% 2T CNT (21/Abr)", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "39.4% Poly (estável vs 21/Abr) — MANTÉM LIDERANÇA ISOLADA (+0.9pp sobre Lula 38.5%). 2º lugar LEVE RECUO: 68% (↓1pp de 69%) mas ainda CONSOLIDA. PL Senado RECUA 81% (↓1.5pp de 82.5%) — devolve parte da alta. Vereadora de Fortaleza cotada para vice Flávio (G1 22/Abr) — expansão estratégia VP para Nordeste feminino. PL SP lança presidente da Alesp ao Senado; Eduardo Bolsonaro como decisor (CNN Brasil 22/Abr). Tarcísio trabalha superar resistência Flávio em SP (Metrópoles 22/Abr) — ainda há reticência intra-direita. Flávio: Lula 'não está nem aí para os pobres' (Poder360 22/Abr). Clan Bolsonaro simpatiza com Pivetta e prevê shifts MT (Rdnews 22/Abr). Lula e Flávio travam guerra de narrativas em eleição marcada pela rejeição (Tribuna Internet 22/Abr)." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "6.0%", poll: "4.4% 1T (AtlasIntel) / 1.8% (Veritá) / N/A Quaest", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "6.0% Poly (↓0.35pp de 6.35%) — leve recuo presidencial. 3º lugar: 28.5% (↓0.5pp) — AMEAÇA CRÍTICA de Zema que SOBE 26% (↑3.5pp, gap agora só 2.5pp). Se continuar ritmo, Zema ultrapassa Renan no 3º lugar em 1-2 dias. STF IMPEACH DESPENCA 11% (↓2.5pp) — combustível anti-STF PERDE força significativa: CPI Master esfriou (Kassio deve negar), sabatina Messias adiada, crise institucional esfriando. PT+Dino reforma Judiciário (Metrópoles 22/Abr: 'Crise STF vira pauta 2026') — institucional migra para legislativo. Renan sem movimentação pública significativa hoje." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Pré-candidato Gov. SP", polymarket: "3.45%", poll: "Paraná Pesquisas SP: Tarcísio lidera, diferença CAI", position: "Centro-esquerda. Lula convenceu a disputar governo de SP. Fora da corrida presidencial.", risk: "3.45% Poly (↓0.35pp de 3.8%) — recua 2º dia consecutivo. 2º lugar Poly Haddad 3.35% (↓0.45pp). 3º lugar 3.7% (↓0.25pp). Rede formaliza apoio a Marina no Senado SP + Haddad gov (Folha 21/Abr). Tarcísio trabalha superar resistência dos paulistas a Flávio (Metrópoles 22/Abr) — confirma fragilidade do adversário em SP. Lula intensifica contraponto a Trump pela campanha (Folha 22/Abr) — apoio indireto. Haddad sem peça própria hoje." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás (renunciou 4/Abr)", polymarket: "1.85%", poll: "6% 1T (Quaest) / 5% (Datafolha)", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "1.85% Poly (↓0.05pp, praticamente estável). PSD Senado cai 4.95% (↓0.4pp vs 21/Abr). 2º lugar estável 1.5%. Sem movimentação pública significativa hoje. 'As cartas na manga que Flávio e Lula devem usar' (Gazeta Povo 22/Abr) — Caiado fora do radar nacional nesta cobertura. Eleições 2026: Lula, Flávio e Caiado esquecem violência (Gazeta Povo 22/Abr) — menção de agenda ausente." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais (renunciou 4/Abr)", polymarket: "7.15%", poll: "3% 1T (Quaest) / 4% (Datafolha)", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "7.15% Poly (↑2.35pp de 4.8%) — 3º DIA DE ALTA CONSECUTIVO presidencial, movimento composto total ↑3.35pp em 3 dias. ULTRAPASSA RENAN (6.0%) e vira 3º colocado isolado no mercado presidencial. 3º lugar Poly: 26% (↑3.5pp de 22.5%) — AMEAÇA LIDERANÇA Renan (28.5%, gap só 2.5pp). Reforma Judiciário vira pauta (Metrópoles 22/Abr) — narrativa Zema anti-STF ganha tração institucional. Crise STF esfriada (CPI Master, Messias adiada) deveria reduzir combustível mas Zema SUSTENTA momentum — sinal que mercado vê algo além da narrativa anti-STF. Rejeição Quaest 31% mantida menor." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.35%", poll: "Paraná Pesquisas SP: LIDERA gov, mas diferença cai sobre Haddad", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "0.35% Poly (estável). 3º lugar Poly SOBE: 1.3% (↑1.2pp de 0.1%) — mercado volta a precificar minimamente como 3ª via. Tarcísio projeta voto estratégico e trabalha superar resistência a Flávio (Metrópoles 22/Abr) — peça pública importante, confirma esforço para consolidar candidato PL em SP. Sem outra movimentação significativa." },
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
