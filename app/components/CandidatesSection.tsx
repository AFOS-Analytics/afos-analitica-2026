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
    polymarket: "51.50%",
    poll: "Lula vai a um novo pico do ciclo: Poly 51.50% (↑2.00pp, vol USD 6.48M acumulado), com o gap sobre Flávio em +25.95pp, o mais largo já medido. O gatilho é a BTG/Nexus 15/Jun (n=2.017, campo 12-14/Jun, margem 2pp, BR-06645/2026: 1T Lula 42% × Flávio 33%, gap +9pp; 2T 49% × 43%, gap +6pp), que ainda traz a aprovação do governo superando a desaprovação pela 1ª vez no ciclo (48% × 47%) e a rejeição de Flávio em 52%. Próximo teste: a Datafolha 19/Jun, com Aécio Neves e Joaquim Barbosa entre os nomes testados (G1).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 15/Jun D+32: a BTG/Nexus deu o gatilho para o novo pico, com Lula ampliando a vantagem no 1º e no 2º turno e a aprovação superando a desaprovação pela 1ª vez no ciclo (48% × 47%, JOTA, Estadão). O mercado levou Lula a 51.50% (↑2.00pp) e abriu o gap para Flávio a +25.95pp, o recorde do ciclo. A trajetória de aprovação confirma três rodadas de melhora (42% × 52% na RTBD 01/Jun, 47% × 48% na Quaest 10/Jun, 48% × 47% agora). Volume total no presidencial USD 100.28M. STF impeach estável a 3.50% (vol baixo)."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "25.55%",
    poll: "Flávio recua em Poly 25.55% (↓1.10pp, vol USD 6.64M acumulado), com o gap para Lula em +25.95pp, o recorde do ciclo. A BTG/Nexus 15/Jun o mostra mais pressionado pela rejeição, que sobe a 52% (JOTA, VEJA): 1T 33% (gap -9pp); 2T 43% (perde 49% × 43%). No STF, a negativa de todos os 589 pedidos de suspeição e impedimento de ministros (Estadão) esvazia o pedido dele contra Moraes. O PL só pretende oficializar a candidatura no fim de julho em SP (Gazeta do Povo).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 15/Jun: a BTG/Nexus mostra Flávio mais pressionado pela rejeição (52%) enquanto Lula amplia a liderança no 1º e no 2º turno (JOTA, VEJA, Estadão). No STF, a negativa de todos os 589 pedidos de suspeição e impedimento de ministros (Estadão) fecha mais uma via jurídica contra Moraes, e Moro defende a CPI do Master mas evita dizer se está confortável com Flávio no palanque (ES Brasil). No mercado, Flávio recuou a 25.55% (↓1.10pp), com o gap para Lula no recorde do ciclo (+25.95pp). STF impeach 3.50%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "11.65%",
    poll: "Renan presidencial Poly 11.65% (↓3.00pp, vol USD 7.04M acumulado), devolvendo a alta especulativa da véspera, mas ainda com o maior volume acumulado do mercado presidencial. Com o recuo, a divergência mercado × pesquisa estreita de ~11.65pp para ~8.65pp (11.65% × 3% da Quaest 10/Jun), mas segue a maior do dashboard. A BTG/Nexus 15/Jun não o destaca no cenário principal, e o movimento corrige a aposta de ontem em torno do MBL, que não encontrou lastro nas pesquisas.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "15/Jun: Renan devolveu a alta de ontem e caiu a 11.65% (↓3.00pp), estreitando a divergência ante a Quaest (3% no 1T) de ~11.65pp para ~8.65pp, ainda a maior do dashboard. É o mercado se autocorrigindo quando a aposta não encontra lastro: a BTG/Nexus 15/Jun não destaca Renan no cenário principal e o 'paradoxo da direita' (G1) reforça que nenhum nome anti-Lula converteu a fraqueza de Flávio em voto. Sinal a monitorar: a Datafolha 19/Jun, que confirme ou não o patamar de 3% no 1T. STF impeach 3.50%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "1.95%",
    poll: "Haddad recua de leve a Poly 1.95% (↓0.10pp, vol USD 5.72M acumulado), à frente de Camilo Santana (1.75%) como nome do PT no mercado presidencial. BTG/Nexus 15/Jun e Genial/Quaest 10/Jun não listam Haddad no presidencial nacional (foco SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad segue como nome do PT depois de Lula no mercado presidencial (1.95%, à frente de Camilo Santana 1.75%). Como ministro da Fazenda, no centro da disputa do PIX/tarifaço e do INSS, mas o mercado não precifica candidatura presidencial dele. A aprovação do governo sobe na BTG/Nexus 15/Jun (48% × 47%, supera a desaprovação pela 1ª vez no ciclo), reforço da gestão econômica em que ele é peça central. STF impeach 3.50%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.50%",
    poll: "Caiado sobe de leve em Poly 1.50% (↑0.15pp, vol USD 4.10M acumulado), único nome da 3ª via a subir no dia, mas ainda no piso. Genial/Quaest 10/Jun: 1T Caiado 3% (empatado com Renan na 3ª via, abaixo dos 6.9% da Vox 05/Jun). Caiado domina entre os bolsonaristas em recorte da própria Quaest (Jornal Opção). No 2T, Lula vence todos os cenários.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado subiu de leve a 1.50% (↑0.15pp), único da 3ª via a subir, mas seguindo no piso das apostas. O 'paradoxo da direita' da Quaest (G1) explica o teto: mesmo liderando entre os bolsonaristas (Jornal Opção), não herda o voto anti-Lula que Flávio perde. A Datafolha 19/Jun, que passa a testar Aécio e Joaquim Barbosa (G1), acirra a disputa pelo mesmo nicho. Mantém o argumento de competitividade no 2T (PoderData/AYA 29/Mai, empate técnico). STF impeach 3.50%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "1.25%",
    poll: "Zema recua a Poly 1.25% (↓0.70pp, vol USD 3.69M), devolvendo a alta da véspera e voltando ao piso da 3ª via. Genial/Quaest 10/Jun: 1T Zema 2%. Eduardo Bolsonaro defende ruptura entre PL e Novo após nova fala de Zema sobre Flávio e Vorcaro, atrito que expõe a dificuldade de convergência da direita. O Novo se equilibra entre a candidatura de Zema e alianças com o PL nos estados.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema recuou no mercado (1.25%, ↓0.70pp), devolvendo a alta de ontem, e a 3ª via segue sem tração na disputa bipolarizada Lula × Flávio. Eduardo Bolsonaro defende ruptura entre PL e Novo após nova fala de Zema sobre Flávio e Vorcaro, sinal do atrito que dificulta qualquer convergência da oposição. O recuo de hoje é reacomodação no piso. STF impeach 3.50%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~12.7M acumulado, o maior do mercado, anomalia de legado). BTG/Nexus 15/Jun e Genial/Quaest 10/Jun não destacam Tarcísio no presidencial nacional (foco reeleição SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera, e o mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 12.7M). No mercado de Senado por número de cadeiras, o PL lidera com folga (73%), sinal de capilaridade institucional da legenda. STF impeach 3.50%."
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
