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
    polymarket: "56.50%",
    poll: "Lula estável na dominância: Poly 56.50% (vol USD 6.9M acumulado), com o gap sobre Flávio reabrindo a +33.55pp (vinha de +33.05pp), perto do recorde, a 100 dias do 1º turno. Num dia de noticiário institucional pesado (caso Master derruba Jaques Wagner da liderança do governo no Senado; STF cheio), o presidencial mal se moveu: o mercado não reprecificou contra Lula. O consenso Tier 1 (Indexa 23/Jun 2T 47% × 40%; Datafolha 20/Jun 2T 47% × 43%; CNT/MDA; BTG/Nexus) dá folga maior que a PoderData/Aya (2T 46% × 43%). Em MG, Lula aparece quase 20pp à frente (Revista Fórum).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 26/Jun D+43: a 100 dias do 1º turno, Lula segue dominante e estável (56.50%, gap +33.55pp). O teste do dia foi institucional: o caso Master alcançou a liderança do governo no Senado (saída de Jaques Wagner, PF apontou ligação; entra Teresa Leitão, Folha/Poder360), e o STF teve dia cheio (inquérito contra Flávio, caso Dark Horse a Mendonça, penduricalhos). Ainda assim, o mercado não reprecificou contra Lula e o STF impeach segue no piso (3.40%, ↑0.85pp). O 2º turno das pesquisas segue apertado (PoderData/Aya 46% × 43%), mas o consenso Tier 1 dá folga maior. Volume no presidencial acima de USD 105M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "22.95%",
    poll: "Flávio recua de leve: Poly 22.95% (↓0.50pp, vol USD 7.1M acumulado), e o gap para Lula reabre a +33.55pp (vinha de +33.05pp). O dia foi STF e família: Moraes abriu inquérito contra ele por post sobre Lula (Migalhas), a campanha passou a apostar em vice mulher para conter o efeito do vídeo de Michelle (Folha) e Bolsonaro chegou ao fim do prazo da prisão domiciliar mais isolado (Folha). O 2º turno competitivo das pesquisas segue como ativo (PoderData/Aya 43% × 46%). Mantém isolado o 2º lugar do 1º turno (78.5%).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 26/Jun: pressão jurídica e familiar. Flávio recuou no mercado (22.95%, ↓0.50pp) e o gap para Lula reabriu a +33.55pp. Moraes abriu inquérito contra ele por post sobre Lula (Migalhas), o efeito do vídeo de Michelle seguiu como passivo (a esquerda se juntou a Michelle nas redes, Folha) e Bolsonaro chegou ao fim do prazo da prisão domiciliar mais isolado (Folha). A campanha reagiu apostando em vice mulher (Folha). Saiu nova AtlasIntel medindo o efeito do episódio (CartaCapital, VEJA). A rejeição segue a maior do páreo (Datafolha 48%, BTG/Nexus 52%). STF impeach a 3.40%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "11.45%",
    poll: "Renan presidencial Poly 11.45% (estável, vol USD 7.5M acumulado) no mercado de vencedor, e seu favoritismo ao 3º lugar do 1º turno RECUPERA a 50% no sub-mercado (vinha de 44%), embora Caiado (21%) e Zema (16%) tenham ganhado corpo atrás, seguindo com o maior volume acumulado do presidencial. A PoderData/Aya deu Renan 4% no 1º turno; as demais nacionais o medem em 2-3%, mantendo a divergência mais larga do dashboard (~7.45pp).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "26/Jun: Renan ficou estável no vencedor (11.45%) e recuperou o favoritismo ao 3º lugar do 1º turno (50%, vinha de 44%), embora Caiado (21%) e Zema (16%) tenham ganhado corpo no sub-mercado. As pesquisas o medem a ~4% no 1T (PoderData/Aya 4%), mantendo a divergência mais larga do dashboard (~7.45pp). A 100 dias, com a 3ª via 'não decolando' (Poder360) e a crise na família Bolsonaro, o espaço anti-Lula segue em disputa. A leitura segue: provável 3º colocado, sem chance real de vencer (capital de nicho, dependente do tropeço alheio). STF impeach 3.40%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "1.25%",
    poll: "Haddad estável a Poly 1.25% (vol USD 6.0M acumulado), na faixa de Camilo Santana (1.15%) como nome do PT depois de Lula no mercado presidencial. As nacionais não testam Haddad no presidencial nacional (foco governo de SP). Na véspera, confirmou Márcio França (PSB) como vice na chapa pelo governo de SP, com Tebet e Marina cogitados para o Senado (Folha, Brasil de Fato), consolidando a aliança de centro-esquerda no estado.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad estável a 1.25%, na faixa de Camilo Santana (1.15%), como nome do PT depois de Lula. O mercado não precifica candidatura presidencial dele; o foco é estadual. Confirmou França vice na chapa de SP, com Tebet/Marina ao Senado (Folha, Brasil de Fato). A Vox SP 30/Mai deu 2T estadual Tarcísio 48.3% × Haddad 36.5%. A saída de Wagner da liderança no Senado adiciona ruído à articulação do PT. STF impeach 3.40%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.45%",
    poll: "Caiado recua de leve a Poly 1.45% (↓0.20pp, vol USD 4.4M acumulado), ainda no piso da 3ª via, mas sobe a 21% no sub-mercado de 3º lugar do 1º turno. A PoderData/Aya 25/Jun deu Caiado 4% no 1T e o pôs em empate técnico com Lula no 2º turno (Poder360, CNN). A Datafolha 20/Jun deu 3% no 1T (2T Lula 47% × Caiado 41%, competitivo). Num cenário SEM Flávio, a Futura/Apex dá Caiado 16.5% (lidera a 3ª via). É o nome posicionado para herdar o voto da direita se Flávio não for.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado recuou de leve a 1.45% (↓0.20pp, vol USD 4.4M), ainda no piso, mas ganhou corpo no sub-mercado de 3º lugar do 1º turno (21%). A PoderData o pôs em empate técnico com Lula no 2º turno, sinal de competitividade no cenário sem Flávio (Futura 16.5%). No cenário com Flávio, o 'paradoxo da direita' (G1) explica o teto, e a 3ª via 'não decolou' a 100 dias (Poder360). STF impeach 3.40%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "1.25%",
    poll: "Zema sobe de leve a Poly 1.25% (↑0.10pp, vol USD 4.0M), saindo do piso da 3ª via, e ganha corpo no sub-mercado de 3º lugar do 1º turno (16%). A PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno (CNN). A Datafolha 20/Jun deu Zema 2% no 1T e 2T Lula 48% × Zema 39%. Sem Flávio, a Futura/Apex dá Zema 13.3% (2º da 3ª via, atrás de Caiado). Na véspera, negou aliança com Flávio e Caiado e prometeu anunciar o vice nesta semana (Estadão).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema subiu de leve a 1.25% (↑0.10pp, vol USD 4.0M), saindo do piso, e ganhou corpo no sub-mercado de 3º lugar (16%). A PoderData o pôs em empate técnico com Lula no 2º turno, mas na disputa bipolarizada com Flávio o Novo não encontra tração. Negou aliança com Flávio e Caiado na véspera (Estadão). No cenário sem Flávio, a Futura/Apex dá Zema 13.3%, fôlego latente. STF impeach 3.40%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~13M acumulado, o maior do mercado, anomalia de legado). As nacionais não destacam Tarcísio no presidencial nacional (foco reeleição SP). Com Haddad confirmando França como vice no PT, a disputa por SP ganha contornos definidos. Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera, e o mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 13M). A disputa por SP se define: Haddad confirmou França como vice (Folha). No mercado de Senado por número de cadeiras, o PL segue na liderança (76.5%), sinal de capilaridade institucional da legenda. STF impeach 3.40%."
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
