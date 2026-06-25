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
    poll: "Lula recua na reversão: Poly 56.50% (↓1.00pp, vol USD 6.9M acumulado), devolvendo parte do pico recorde de ontem, com o gap sobre Flávio fechando a +33.05pp (vinha de +34.60pp). A devolução veio no dia em que a PoderData/Aya apertou a corrida (1T Lula 40% × Flávio 36%; 2T empate técnico Lula 46% × Flávio 43%, Poder360/CNN). O mercado corrigiu o gap esticado, mas segue cravando Lula dominante, bem acima do 2º turno apertado das pesquisas. O consenso Tier 1 (Indexa 23/Jun 2T 47% × 40%; Datafolha 20/Jun 2T 47% × 43%; CNT/MDA; BTG/Nexus) dá folga maior que a PoderData.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 25/Jun D+42: reversão parcial. O Polymarket devolveu parte do recorde de ontem (Lula 56.50%, ↓1.00pp; gap +33.05pp) no dia em que a PoderData/Aya apertou o 2º turno (empate técnico Lula 46% × Flávio 43%, Lula também empata com Zema e Caiado). É a 2ª pesquisa seguida (após a Gerp) com 2º turno apertado, mas o consenso Tier 1 dá a Lula folga maior, e é esse consenso que o mercado precifica. No pano de fundo, a narrativa de interferência de Trump nas eleições (assessor de Lula diz que pode ter efeito contrário, BBC) e o drama Michelle/Flávio. STF impeach a 2.55%. Inflação esperada cedendo (banda baixa 4.50-4.99% lidera a 44.85%). Volume no presidencial acima de USD 105M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "23.45%",
    poll: "Flávio recupera de leve: Poly 23.45% (↑0.55pp, vol USD 7.0M acumulado) na reversão, e o gap para Lula fecha a +33.05pp (vinha do recorde +34.60pp). A alta acompanhou a PoderData/Aya, que lhe deu empate técnico no 2º turno (43% × 46%) e a 4pp no 1º (36% × 40%, Poder360/CNN). No dia, porém, o foco foi pessoal: pediu desculpas após o vídeo de Michelle, negou humilhação e disse não ser correspondido por ela (Folha, BBC). Mantém isolado o 2º lugar do 1º turno (78.5%).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 25/Jun: drama pessoal domina o dia. Flávio recuperou de leve no mercado (23.45%, ↑0.55pp) acompanhando a PoderData/Aya, que lhe deu empate técnico no 2º turno (43% × 46%), mas o gap para Lula segue largo (+33.05pp). O dia dele foi pessoal: pediu desculpas após o vídeo de Michelle, negou humilhação e admitiu não ser correspondido (Folha, BBC), episódio que expôs atritos na família Bolsonaro. A narrativa de que 'com Flávio, Trump interfere nas eleições' ganhou tração (BBC, GGN). A rejeição segue a maior do páreo (Datafolha 48%, BTG/Nexus 52%). STF impeach a 2.55%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "11.45%",
    poll: "Renan presidencial Poly 11.45% (↓0.90pp, vol USD 7.5M acumulado) no mercado de vencedor, e seu favoritismo ao 3º lugar do 1º turno CAIU a 44% no sub-mercado (vinha de 58.5%), com Caiado (12.5%) e Zema (11%) ganhando terreno, embora siga o maior volume acumulado do presidencial. A PoderData/Aya deu Renan 4% no 1º turno; as demais nacionais o medem em 2-3%, mantendo a divergência mais larga do dashboard (~7.45pp).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "25/Jun: Renan recuou no vencedor (11.45%, ↓0.90pp) e seu favoritismo ao 3º lugar do 1º turno caiu de 58.5% para 44% no sub-mercado, com Caiado e Zema ganhando terreno. As pesquisas o medem a ~4% no 1T (PoderData/Aya 4%), mantendo a divergência mais larga do dashboard (~7.45pp). Tanto o vencedor quanto o sub-mercado de 3º lugar recuaram, sinal de que o espaço da direita está mais disputado. A leitura segue: provável 3º colocado, sem chance real de vencer (capital de nicho, dependente do tropeço alheio). STF impeach 2.55%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "1.25%",
    poll: "Haddad recua de leve a Poly 1.25% (↓0.20pp, vol USD 5.9M acumulado), na faixa de Camilo Santana (1.15%) como nome do PT depois de Lula no mercado presidencial. As nacionais não testam Haddad no presidencial nacional (foco governo de SP). No dia, confirmou Márcio França (PSB) como vice na chapa pelo governo de SP, com Tebet e Marina cogitados para o Senado (Folha, Brasil de Fato), consolidando a aliança de centro-esquerda no estado.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad recuou de leve a 1.25% (↓0.20pp), na faixa de Camilo Santana (1.15%), como nome do PT depois de Lula. O mercado não precifica candidatura presidencial dele; o foco é estadual. No dia, confirmou Márcio França (PSB) como vice na chapa de SP, com Tebet/Marina ao Senado (Folha, Brasil de Fato). A Vox SP 30/Mai deu 2T estadual Tarcísio 48.3% × Haddad 36.5%. STF impeach 2.55%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.65%",
    poll: "Caiado sobe de leve a Poly 1.65% (↑0.20pp, vol USD 4.4M acumulado), ainda no piso da 3ª via. A PoderData/Aya 25/Jun deu Caiado 4% no 1T e o pôs em empate técnico com Lula no 2º turno (Poder360, CNN). A Datafolha 20/Jun deu 3% no 1T (2T Lula 47% × Caiado 41%, competitivo). Num cenário SEM Flávio, a Futura/Apex dá Caiado 16.5% (lidera a 3ª via). É o nome posicionado para herdar o voto da direita se Flávio não for.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado subiu de leve a 1.65% (↑0.20pp, vol USD 4.4M), ainda no piso: o mercado precifica baixa a hipótese de Flávio sair. A PoderData o pôs em empate técnico com Lula no 2º turno, sinal de competitividade no cenário sem Flávio (Futura 16.5%). No cenário com Flávio, o 'paradoxo da direita' (G1) explica o teto, e o recuo do favoritismo de Renan ao 3º lugar (44%) mostra a briga pelo mesmo espaço. STF impeach 2.55%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "1.15%",
    poll: "Zema sobe de leve a Poly 1.15% (↑0.20pp, vol USD 3.9M), saindo do piso da 3ª via. A PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno (CNN). A Datafolha 20/Jun deu Zema 2% no 1T e 2T Lula 48% × Zema 39%. Sem Flávio, a Futura/Apex dá Zema 13.3% (2º da 3ª via, atrás de Caiado). No dia, negou aliança com Flávio e Caiado e prometeu anunciar o vice na próxima semana (Estadão).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema subiu de leve a 1.15% (↑0.20pp, vol USD 3.9M), saindo do piso. A PoderData o pôs em empate técnico com Lula no 2º turno, mas na disputa bipolarizada com Flávio o Novo não encontra tração. No dia, negou aliança com Flávio e Caiado e prometeu o vice na próxima semana (Estadão). No cenário sem Flávio, a Futura/Apex dá Zema 13.3%, fôlego latente. STF impeach 2.55%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~13M acumulado, o maior do mercado, anomalia de legado). As nacionais não destacam Tarcísio no presidencial nacional (foco reeleição SP). Com Haddad confirmando França como vice no PT, a disputa por SP ganha contornos definidos. Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera, e o mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 13M). A disputa por SP se define: Haddad confirmou França como vice (Folha). No mercado de Senado por número de cadeiras, o PL segue na liderança (76.5%), sinal de capilaridade institucional da legenda. STF impeach 2.55%."
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
