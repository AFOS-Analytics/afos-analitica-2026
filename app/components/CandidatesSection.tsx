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
    polymarket: "61.50%",
    poll: "Lula retoma o pico: Poly 61.50% (↑1.00pp, vol USD 7.2M acumulado), com o gap sobre Flávio subindo a +39.05pp (↑0.85pp), a 0.50pp do recorde de +39.55pp (03/Jul), a 90 dias do 1º turno. Não houve pesquisa presidencial nacional nova: movimento de momentum. O fluxo do dia pesou no adversário: a PGR pediu que a PF ouça Flávio por calúnia contra Lula (G1, Estadão), e Lula o chamou de traidor da pátria pela carta aos EUA (Canal MyNews). No caso Master, a mira passou a Ciro Nogueira (CNN, InfoMoney). A consultoria Tendências vê a reeleição de Lula como cenário base (Money Time).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 06/Jul D+53: a 90 dias do 1º turno, RETOMADA rumo ao recorde. Lula voltou ao pico de 61.50% (↑1.00pp) e o gap subiu a +39.05pp (↑0.85pp), a 0.50pp do recorde de +39.55pp (03/Jul), revertendo o give-back do fim de semana. Sem pesquisa nova, momentum. Motor: fluxo institucional adverso a Flávio (PGR pede que a PF o ouça por calúnia contra Lula, G1/Estadão; Lula o chama de traidor da pátria pela carta aos EUA, Canal MyNews); caso Master mira Ciro Nogueira (CNN). Ressalvas: aprovação online Atlas pior (desaprova 52.3%), RS estadual Flávio 44×25.2 (R7), agenda travada no Congresso (Folha PE). Rejeição 49%. STF impeach estável a 2.75%. Volume no presidencial acima de USD 110M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "22.45%",
    poll: "Flávio sobe de leve: Poly 22.45% (↑0.15pp, vol USD 7.2M acumulado), com o gap para Lula subindo a +39.05pp (a 0.50pp do recorde). RECUPERA o 2º lugar do 1º turno (77.0%, ↑4.5pp), reforçando a condição de adversário certo. Dia de fluxo institucional adverso: a PGR pediu que a PF o ouça por calúnia contra Lula (G1, Estadão), e Lula o chamou de traidor da pátria pela carta aos EUA (Canal MyNews). Lançou o 1º jingle da campanha, com foco em batalha espiritual (Gazeta do Povo). No RS, lidera o 1º turno (44% × Lula 25.2%, R7); rejeição a maior do páreo (BTG/Nexus 51%).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 06/Jul: Flávio subiu a 22.45% (↑0.15pp) e o gap para Lula subiu a +39.05pp, a 0.50pp do recorde. RECUPEROU o 2º lugar do 1º turno (77.0%, ↑4.5pp). Nova frente jurídica: a PGR pediu que a PF o ouça numa investigação por calúnia contra Lula (G1, Estadão), e Lula o chamou de traidor da pátria pela carta aos EUA pedindo adiamento do tarifaço (Canal MyNews, Forbes). Lançou o 1º jingle da campanha (Gazeta do Povo). No RS, uma estadual o deu à frente no 1º turno (44%×25.2%, R7). Rejeição 51%. STF impeach 2.75%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "9.55%",
    poll: "Renan presidencial Poly 9.55% (↓0.30pp, vol USD 7.9M acumulado) no mercado de vencedor, abaixo de 10%, mas mantém o favoritismo ao 3º lugar do 1º turno (63.0%), à frente de Caiado (12.5%) e Zema (6.5%), seguindo com o maior volume acumulado do presidencial. As nacionais o medem em 2-4% no 1º turno, e a divergência do dashboard segue a mais larga (~5.5pp). Vice definido: o tenente-coronel da reserva Aroldo Medina (Folha). Aposta em vaquinha, base do MBL e Faria Lima sem máquina partidária (Estadão).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "06/Jul: Renan recuou no vencedor (9.55%, ↓0.30pp, abaixo de 10%), mas manteve o favoritismo ao 3º lugar do 1º turno (63.0%), à frente de Caiado (12.5%) e Zema (6.5%). As pesquisas o medem a ~4% no 1T, e a divergência do dashboard segue a mais larga (~5.5pp). A leitura segue: provável 3º colocado, sem chance real de vencer (capital de nicho, dependente do tropeço alheio). STF impeach 2.75%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0.95%",
    poll: "Haddad sobe a Poly 0.95% (↑0.15pp, vol USD 6.1M acumulado) como nome do PT depois de Lula no mercado presidencial. As nacionais não testam Haddad no presidencial nacional (foco governo de SP). A Datafolha de SP 05/Jul (estadual): no governo, Tarcísio lidera com 46% × Haddad 30%, e Haddad tem a maior rejeição do estado (47%), mas a Folha aponta que o PT ainda vê espaço para ele crescer. Confirmou Márcio França (PSB) como vice na chapa pelo governo de SP, com Tebet e Marina cogitados para o Senado (Folha, Brasil de Fato).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad sobe a 0.95% (↑0.15pp), como nome do PT depois de Lula. O mercado não precifica candidatura presidencial dele; o foco é estadual. A Datafolha SP 05/Jul deu o quadro do desafio: no governo, Tarcísio 46% × Haddad 30%, com Haddad na maior rejeição do estado (47%) e aprovação de Tarcísio a 45%; a Folha aponta que o PT ainda vê espaço para Haddad crescer. Confirmou França vice na chapa de SP, com Tebet/Marina ao Senado (Folha, Brasil de Fato). STF impeach 2.75%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0.95%",
    poll: "Caiado cede a Poly 0.95% (↓0.10pp, vol USD 4.7M acumulado) no mercado de vencedor, mantendo o 2º posto no sub-mercado de 3º lugar do 1º turno (12.5%) atrás de Renan (63.0%). Tem chapa pura do PSD formalizada (Kassab vice, Folha, G1) e segue forte no plano estadual: a Paraná Pesquisas mostra sua força em Goiás no governo e no Senado (CartaCapital, VEJA). A BTG/Nexus 29/Jun deu Caiado 5% no 1T, o melhor da 3ª via; a PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno (Poder360, CNN). Num cenário SEM Flávio, a Futura/Apex dá Caiado 16.5% (lidera a 3ª via).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado cede a 0.95% (↓0.10pp, vol USD 4.7M) no vencedor, mantendo o 2º posto no sub-mercado de 3º lugar do 1º turno (12.5%) atrás de Renan (63.0%). Tem chapa pura do PSD (Kassab vice, Folha, G1) e segue forte em Goiás (Paraná Pesquisas, CartaCapital, VEJA). A BTG/Nexus 29/Jun o deu a 5% no 1T (melhor da 3ª via) e a PoderData o pôs em empate técnico com Lula no 2º turno, sinal de competitividade no cenário sem Flávio (Futura 16.5%). No cenário com Flávio, o 'paradoxo da direita' (G1) explica o teto. STF impeach 2.75%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "1.15%",
    poll: "Zema sobe a Poly 1.15% (↑0.10pp, vol USD 4.3M) no vencedor, o maior avanço da 3ª via no dia, mas segue no piso; recua no sub-mercado de 3º lugar do 1º turno (6.5%, atrás de Renan a 63.0% e Caiado a 12.5%). A BTG/Nexus 29/Jun deu Zema 3% no 1T. A PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno (CNN). A Datafolha 20/Jun deu 2% no 1T e 2T Lula 48% × Zema 39%. Sem Flávio, a Futura/Apex dá Zema 13.3%. Prometeu anunciar o vice (Estadão).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema subiu a 1.15% (↑0.10pp, vol USD 4.3M) no vencedor, o maior avanço da 3ª via, mas segue no piso; recua no sub-mercado de 3º lugar (6.5%, atrás de Renan a 63.0% e Caiado a 12.5%). A BTG/Nexus 29/Jun o deu a 3% no 1T. A PoderData o pôs em empate técnico com Lula no 2º turno, mas na disputa bipolarizada com Flávio o Novo não encontra tração. No cenário sem Flávio, a Futura/Apex dá Zema 13.3%, fôlego latente. Prometeu anunciar o vice (Estadão). STF impeach 2.75%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~13.2M acumulado, o maior do mercado, anomalia de legado). As nacionais não destacam Tarcísio no presidencial nacional (foco reeleição SP). A Datafolha de SP saiu hoje (estadual): no governo, Tarcísio lidera com 46% × Haddad 30%, com aprovação da gestão a 45% (segurança e saúde empatam como maiores problemas). A Vox SP 30/Mai dera 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera: a Datafolha 05/Jul o dá no governo com 46% × Haddad 30% e aprovação de 45%. O mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 13.2M). O Estadão aponta que ele tem pouco incentivo para entrar de cabeça na campanha de Flávio. No mercado de Senado por número de cadeiras, o PL segue na liderança (87.5%), sinal de capilaridade institucional da legenda. STF impeach 2.75%."
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
