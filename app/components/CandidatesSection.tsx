'use client';

import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';
import { LogicLink } from './LogicLink';
import { useTranslation } from '../i18n/context';

// Os campos `polymarket`, `poll` e `risk` são atualizados pela skill /atualizar
// (a cada execução, o markdown dos JSONs e este arquivo são reescritos com
// dados frescos).
const candidates: CandidateProfile[] = [
  {
    name: "Lula",
    party: "PT",
    age: 80,
    role: "Presidente da República",
    polymarket: "47.50%",
    poll: "Lula consolida o favoritismo: Poly 47.50% (↑3.00pp em ~48h, vol USD 6.38M acumulado), digerindo a Quaest 10/Jun e uma nova Pesquisa Alfa que reforça sua recuperação (VEJA). Genial/Quaest 10/Jun (n=2.004, campo 05-08/Jun, margem 2pp): 1T Lula 39% × Flávio 29% (gap +10pp); 2T Lula 44% × Flávio 38% (gap +6pp), Lula vence todos os cenários e abre 13pp entre independentes; aprovação 47% × 48%. Recorte da Quaest aponta Lula +7pp entre evangélicos (Folha). O gap Lula × Flávio no mercado abriu a +21.00pp, o mais largo do ciclo.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 12/Jun D+29: o mercado seguiu reprecificando o favoritismo de Lula, que subiu a 47.50% (↑3.00pp em 48h) e abriu o gap para Flávio a +21.00pp, bem mais largo que o 1T da Quaest (+10pp). Motor: a digestão da Quaest 10/Jun (Lula +7pp e Flávio -9pp entre evangélicos, Folha) e a nova Alfa confirmando a recuperação. No flanco do governo, crises próprias: pressão da 6x1 sobre Alcolumbre e nova crise de credibilidade nas bets (Gazeta), TCU manda o INSS mudar concessão automática. STF impeach 2.30%."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "26.50%",
    poll: "Flávio recua a Poly 26.50% (↓1.50pp em 48h, vol USD 6.58M acumulado) com a digestão da Quaest. Genial/Quaest 10/Jun: 1T 29% (gap -10pp); 2T 38% (perde 44% × 38%); 12% dizem que a relação com Vorcaro diminui a vontade de votar nele. Recorte da Quaest aponta queda de 9pp entre evangélicos (Folha/Mônica Bergamo), apontada como motor do recuo. Lidera o 2º lugar no mercado a 66.50% (↑2.00pp). Rejeição 46% > Lula 45% (Datafolha 22/Mai).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 12/Jun: o recorte da Quaest virou a manchete do dia, com Flávio caindo 9pp entre evangélicos (Folha), e o embate simbólico da camiseta da Seleção alimentando a queda de braço. O mercado cedeu a 26.50% (↓1.50pp em 48h) e o gap para Lula abriu a +21.00pp. Mantém a liderança do 2º lugar (66.50%). A oposição segue fragmentada e o Estadão fala em sinal amarelo. STF impeach 2.30%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "13.70%",
    poll: "Renan presidencial Poly 13.70% (↓2.00pp em 48h, vol USD 6.93M acumulado), 3º no mercado de vencedor. Genial/Quaest 10/Jun mediu Renan em 3% no 1T, embolado com Caiado (3%), Aécio (2%) e Zema (2%): a divergência mercado × pesquisa segue a maior do dashboard (~10.70pp, 13.70% × 3%). No mercado, lidera o 3º lugar do 1º turno a 51.50% e segue 2º no do 2º colocado (16.50%, atrás de Flávio 66.50%).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "12/Jun: Renan recuou no mercado de vencedor a 13.70% (↓2.00pp em 48h), estreitando um pouco a divergência com a pesquisa (a Quaest cravou 3% no 1T, G1), mas ela segue a maior do dashboard (~10.70pp). No pódio do 1º turno, mantém o favoritismo isolado do 3º lugar (51.50%). Sinal a monitorar: se as próximas Tier 1 (MDA/IPESPE/AtlasIntel, registradas p/ 15-16/Jun) confirmarem os 3%, cresce o risco de reprecificação para baixo. STF impeach 2.30%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "1.90%",
    poll: "Haddad recua a Poly 1.90% (↓0.95pp em 48h, vol USD 5.69M acumulado), 5º nome presidencial atrás de Camilo Santana (2.80%). Genial/Quaest 10/Jun não lista Haddad no presidencial nacional (foco SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad segue atrás de Camilo Santana no mercado presidencial. Como ministro da Fazenda, no centro da disputa do PIX/tarifaço e do INSS (TCU manda mudar a concessão automática de aposentadorias), mas o mercado não precifica candidatura presidencial dele. A ala do PT-SP pressiona por Simone Tebet na vice no projeto estadual de SP. STF impeach 2.30%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.60%",
    poll: "Caiado estável no piso: Poly 1.60% (vol USD 4.00M acumulado). Genial/Quaest 10/Jun: 1T Caiado 3% (empatado com Renan na 3ª via, abaixo dos 6.9% da Vox 05/Jun), o que reduz a inversão poll × mercado. Caiado domina entre os bolsonaristas em recorte da própria Quaest (Jornal Opção). No 2T, Lula vence todos os cenários.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "A Quaest 10/Jun aproximou Caiado do que o mercado já precificava: 3% no 1T (contra 6.9% da Vox 05/Jun). Segue no piso das apostas (1.60%), mas mantém o argumento de maior teto na direita não-Bolsonaro ao liderar entre os bolsonaristas (Jornal Opção), recorte que ganha peso com a queda de Flávio entre evangélicos. STF impeach 2.30%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "1.20%",
    poll: "Zema presidencial Poly 1.20% (↓0.40pp em 48h, vol USD 3.59M), no piso da 3ª via. Genial/Quaest 10/Jun: 1T Zema 2%, embolado na base da disputa anti-Lula. No mercado de 3º lugar do 1º turno, Zema é 2º a 19.00%, atrás de Renan (51.50%). 3ª via sem tração com a disputa bipolarizada Lula × Flávio.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema segue no piso (↓0.40pp em 48h), a 3ª via não reabre com a disputa bipolarizada Lula × Flávio dominando o ciclo. A Quaest 10/Jun deu Zema 2% no 1T e Lula vencendo todos os cenários no 2T. No mercado de 3º lugar do 1º turno, é 2º a 19.00%, atrás de Renan (51.50%). STF impeach 2.30%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~12.5M acumulado, anomalia de legado). PL Senado em 72.50% (↓0.50pp, vol USD 243k). Genial/Quaest 10/Jun não destaca Tarcísio no presidencial nacional (foco reeleição SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio foi o fiador do realinhamento de 02/Jun (apoio a Flávio), mas a Quaest 10/Jun mostrou Flávio perdendo os dois turnos e caindo 9pp entre evangélicos, com o mercado cedendo a 26.50%. Tarcísio segue focado na reeleição em SP, onde lidera. PL lidera o Senado a 72.50%. STF impeach 2.30%."
  },
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
