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
    poll: "Lula segue no platô do ciclo: Poly 51.50% (estável, vol USD 6.57M acumulado), com o gap sobre Flávio REABRINDO a +26.45pp, que reata o recorde de 17/Jun. A Datafolha 20/Jun (n=2.004, campo 17-19/Jun, BR-09956/2026) confirma a liderança: 1T 41% × Flávio 31%; 2T 47% × 43% (gap +4pp); 47% × Caiado 41%; 48% × Zema 39%, vence todos os cenários (G1, Folha). Rejeição de Flávio (48%) maior que a de Lula (46%). Em linha com as três nacionais de 15-16/Jun (CNT/MDA 2T 49.3% × 36.8%, Futura/Apex 48.1% × 42.9%, BTG/Nexus 49% × 43%).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 20/Jun D+37: dia da Datafolha, com divergência clara entre pesquisa e mercado. A Datafolha deu a Flávio o 2º turno mais competitivo do recorte (47% × 43%, gap +4pp) e a imprensa falou em 'cara de 2º turno' (Folha), mas o mercado foi na direção OPOSTA: Lula ficou estável a 51.50% e o gap reabriu a +26.45pp, reatando o recorde, pelo recuo do adversário. No pano de fundo, o caso Master segue sem desfecho (Wagner muda de tom sobre deixar a liderança no Senado, o PT vai medir o impacto, Folha/CNN Brasil; Alckmin diz que Lula conduzirá bem, Estadão). Volume total no presidencial USD 102.55M. STF impeach estável a 3.60%."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "25.05%",
    poll: "Flávio recua em Poly 25.05% (↓0.70pp, vol USD 6.76M acumulado) mesmo no dia em que a Datafolha lhe traz o melhor 2º turno do recorte. A Datafolha 20/Jun deu 1T 31% (gap -10pp) e 2T 47% × 43% (gap -4pp), o mais competitivo entre as nacionais recentes, e a imprensa lê que ele 'estancou o prejuízo' e que a eleição já tem 'cara de 2º turno' (Folha). Mas a rejeição (48%) segue a maior do páreo (Lula 46%), e o gap para Lula reabriu a +26.45pp, reatando o recorde. Segue isolado na frente do 2º lugar do 1º turno (68.5%, ↓1pp).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 20/Jun: o paradoxo do dia. A Datafolha deu a Flávio o melhor 2º turno do recorte (47% × 43%, gap -4pp) e a imprensa falou em 'estancar o prejuízo' (Folha), MAS o mercado foi na direção oposta: Flávio recuou a 25.05% (↓0.70pp) e o gap para Lula reabriu a +26.45pp, reatando o recorde. A divergência é o sinal: a pesquisa mostra a corrida estreitando no 2º turno, o mercado crava a dominância de Lula no topo. A rejeição (48%, a maior do páreo) segue como teto, e o racha na direita persiste (Zema negou proximidade, Estadão). STF impeach estável a 3.60%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "14.35%",
    poll: "Renan presidencial Poly 14.35% (↑0.20pp, vol USD 7.27M acumulado) no mercado de vencedor, e segue cravado como favorito ao 3º lugar do 1º turno (54% no sub-mercado), com o maior volume acumulado do presidencial. A Datafolha 20/Jun mediu Renan a 3% no 1T, empatado com Caiado e à frente de Zema/Aécio (2%) e Joaquim Barbosa (1%). A divergência mercado × pesquisa segue a maior do dashboard, em ~11.35pp (14.35% × 3% na Datafolha), levemente menor que ontem porque a Datafolha mede Renan um ponto acima da CNT/MDA. A Times Brasil/CNBC resume: a terceira via não decola (Vinícius Torres Freire).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "20/Jun: Renan subiu de leve no vencedor (14.35%, ↑0.20pp) e segue cravado como favorito ao 3º lugar do 1º turno (54% no sub-mercado). A Datafolha o mediu a 3% no 1T, um ponto acima da CNT/MDA, estreitando de leve a divergência para ~11.35pp, ainda a maior do dashboard. A leitura é de um mercado que o precifica como provável 3º colocado, mas sem chance real de vencer (capital de nicho, não de vitória). A Datafolha confirma o campo anti-Lula embolado no piso (Caiado e Renan 3%, Zema e Aécio 2%). A Times Brasil reforça que a 3ª via não decola. STF impeach 3.60%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "2.15%",
    poll: "Haddad sobe a Poly 2.15% (↑0.20pp, vol USD 5.83M acumulado), à frente de Camilo Santana (1.75%) como nome do PT depois de Lula no mercado presidencial. A Datafolha 20/Jun não testa Haddad no presidencial nacional (foco SP). No dia, comentou o caso Wagner dizendo que a PF está 'no papel dela de investigar' (Folha). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad sobe a 2.15% (↑0.20pp), à frente de Camilo Santana (1.75%), como nome do PT depois de Lula. Como ministro da Fazenda, no centro do PIX/tarifaço e do INSS, mas o mercado não precifica candidatura presidencial dele. A operação da PF no caso Master mira Jaques Wagner, líder do governo no Senado, sem desfecho (Wagner muda de tom sobre a liderança, Folha), o que pressiona a articulação do PT no Congresso. Haddad comentou o caso com tom institucional (Folha). A aprovação do governo segue acima da desaprovação (Nexus 48% × 47%). STF impeach 3.60%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "2.25%",
    poll: "Caiado recua de leve a Poly 2.25% (↓0.10pp, vol USD 4.26M acumulado), ainda no piso da 3ª via. A Datafolha 20/Jun deu Caiado 3% no 1T (empatado com Renan) e 2T Lula 47% × Caiado 41% (gap -6pp, competitivo). A CNT/MDA deu 4% no 1T; e a Futura/Apex, num cenário SEM Flávio, dá Caiado 16.5% (lidera a 3ª via). Disse que Flávio 'perdeu a chance' de vencer Lula (G1). Caiado domina entre os bolsonaristas em recorte da Quaest (Jornal Opção): é o nome posicionado para herdar o voto da direita se Flávio não for.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado recuou de leve a 2.25% (↓0.10pp, vol USD 4.26M), ainda no piso das apostas: o mercado precifica baixa a hipótese de Flávio sair da disputa. A Datafolha 20/Jun o manteve a 3% no 1T. No cenário sem Flávio, a Futura/Apex dá Caiado 16.5%, sinal de quanto voto da direita está represado em Flávio. No cenário com Flávio, o 'paradoxo da direita' (G1) explica o teto, e a Times Brasil reforça que a 3ª via não decola. A estreia de Aécio na Datafolha disputa o mesmo nicho. STF impeach 3.60%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "1.45%",
    poll: "Zema fica estável a Poly 1.45% (vol USD 3.74M), segue no piso da 3ª via. A Datafolha 20/Jun deu Zema 2% no 1T e 2T Lula 48% × Zema 39% (gap -9pp, o mais largo da 3ª via testada). No dia, NEGOU proximidade com Flávio e reacendeu a briga na direita (Estadão), atrito que dificulta a convergência da oposição. Sem Flávio, a Futura/Apex dá Zema 13.3% (2º da 3ª via, atrás de Caiado). O Novo se equilibra entre a candidatura de Zema e alianças com o PL nos estados.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema ficou estável a 1.45%, e a 3ª via segue sem tração na disputa bipolarizada Lula × Flávio. A Datafolha 20/Jun o mediu a 2% no 1T e deu 2T Lula 48% × Zema 39%. No dia, NEGOU proximidade com Flávio e reacendeu a briga na direita (Estadão), sinal do atrito do Novo com o bolsonarismo justamente quando o campo tentaria se unificar. No cenário sem Flávio, a Futura/Apex dá Zema 13.3%, fôlego latente. STF impeach 3.60%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~12.85M acumulado, o maior do mercado, anomalia de legado). A Datafolha 20/Jun e as nacionais de 16/Jun não destacam Tarcísio no presidencial nacional (foco reeleição SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera, e o mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 12.85M). No mercado de Senado por número de cadeiras, o PL segue na liderança (77.5%), sinal de capilaridade institucional da legenda. STF impeach 3.60%."
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
