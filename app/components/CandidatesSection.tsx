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
    poll: "Lula segura o pico: Poly 61.50% (estável, vol USD 7.2M acumulado), com o gap sobre Flávio subindo de leve a +39.30pp, a 0.25pp do recorde de +39.55pp (03/Jul), a 89 dias do 1º turno. Não houve pesquisa presidencial nacional nova (a Gerp sai amanhã, Terra): movimento de momentum. O fluxo do dia pesou no adversário: Flávio discursou numa audiência nos EUA sobre o tarifaço e admitiu que a medida ajudaria Lula (Folha, Estadão, BBC), o governo repudiou e ligou ao Master (Folha, G1), e Moraes deu 10 dias para a PF o ouvir por calúnia contra Lula (Revista Oeste). A consultoria Tendências vê a reeleição de Lula como cenário base (Money Time).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 07/Jul D+54: a 89 dias do 1º turno, mercado colado no pico. Lula ficou estável em 61.50% e o gap subiu de leve a +39.30pp, a 0.25pp do recorde de +39.55pp (03/Jul), sustentando a retomada da véspera. Sem pesquisa nova, momentum. Motor: desgaste externo de Flávio (discurso numa audiência nos EUA sobre o tarifaço admitindo que ajudaria Lula, Folha/Estadão/BBC; governo repudia e liga ao Master, Folha/G1; Moraes dá 10 dias para a PF o ouvir, Revista Oeste). Ressalvas: aprovação online Atlas pior (desaprova 52.3%), RS estadual Flávio 44×25.2 (R7), emendas batem R$ 34 bi, recorde (CNN). Rejeição 49%. STF impeach estável a 2.80%. Volume no presidencial acima de USD 110M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "22.20%",
    poll: "Flávio recua de leve: Poly 22.20% (↓0.25pp, vol USD 7.2M acumulado), com o gap para Lula subindo a +39.30pp (a 0.25pp do recorde). AMPLIA o 2º lugar do 1º turno (81.5%, ↑4.5pp), reforçando a condição de adversário certo. Dia de desgaste externo: discursou numa audiência nos EUA sobre o tarifaço e admitiu que a medida ajudaria Lula (Folha, Estadão, BBC). O governo repudiou a ida e ligou-a ao caso Master (Folha, G1), e Moraes deu 10 dias para a PF o ouvir por calúnia contra Lula (Revista Oeste). No RS, lidera o 1º turno (44% × Lula 25.2%, R7); rejeição a maior do páreo (BTG/Nexus 51%).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 07/Jul: Flávio recuou a 22.20% (↓0.25pp) e o gap para Lula subiu a +39.30pp, a 0.25pp do recorde. AMPLIOU o 2º lugar do 1º turno (81.5%, ↑4.5pp). Desgaste externo: discursou numa audiência nos EUA sobre o tarifaço e admitiu que a medida ajudaria Lula e que o momento é o pior possível (Folha, Estadão, BBC). O governo repudiou a atuação e ligou-a ao caso Master (Folha, G1). Moraes deu 10 dias para a PF o ouvir por calúnia contra Lula (Revista Oeste). No RS, uma estadual o deu à frente no 1º turno (44%×25.2%, R7). Rejeição 51%. STF impeach 2.80%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "9.70%",
    poll: "Renan presidencial Poly 9.70% (↑0.15pp, vol USD 7.9M acumulado) no mercado de vencedor, ainda abaixo de 10%, e AMPLIA o favoritismo ao 3º lugar do 1º turno (67.0%, ↑4.0pp), à frente de Caiado (12.5%) e Zema (3.2%), seguindo com o maior volume acumulado do presidencial. As nacionais o medem em 2-4% no 1º turno, e a divergência do dashboard segue a mais larga (~5.7pp). Vice definido: o tenente-coronel da reserva Aroldo Medina (Folha). Aposta em vaquinha, base do MBL e Faria Lima sem máquina partidária (Estadão).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "07/Jul: Renan subiu no vencedor (9.70%, ↑0.15pp, ainda abaixo de 10%) e ampliou o favoritismo ao 3º lugar do 1º turno (67.0%, ↑4.0pp), à frente de Caiado (12.5%) e Zema (3.2%). As pesquisas o medem a ~4% no 1T, e a divergência do dashboard segue a mais larga (~5.7pp). A leitura segue: provável 3º colocado, sem chance real de vencer (capital de nicho, dependente do tropeço alheio). STF impeach 2.80%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0.90%",
    poll: "Haddad recua a Poly 0.90% (↓0.05pp, vol USD 6.1M acumulado) como nome do PT depois de Lula no mercado presidencial. As nacionais não testam Haddad no presidencial nacional (foco governo de SP). A Datafolha de SP 05/Jul (estadual): no governo, Tarcísio lidera com 46% × Haddad 30%, e Haddad tem a maior rejeição do estado (47%), mas a Folha aponta que o PT ainda vê espaço para ele crescer. Confirmou Márcio França (PSB) como vice na chapa pelo governo de SP, com Tebet e Marina cogitados para o Senado (Folha, Brasil de Fato).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad recua a 0.90% (↓0.05pp), como nome do PT depois de Lula. O mercado não precifica candidatura presidencial dele; o foco é estadual. A Datafolha SP 05/Jul deu o quadro do desafio: no governo, Tarcísio 46% × Haddad 30%, com Haddad na maior rejeição do estado (47%) e aprovação de Tarcísio a 45%; a Folha aponta que o PT ainda vê espaço para Haddad crescer. Confirmou França vice na chapa de SP, com Tebet/Marina ao Senado (Folha, Brasil de Fato). STF impeach 2.80%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0.90%",
    poll: "Caiado cede a Poly 0.90% (↓0.05pp, vol USD 4.7M acumulado) no mercado de vencedor, mantendo o 2º posto no sub-mercado de 3º lugar do 1º turno (12.5%) atrás de Renan (67.0%). Tem chapa pura do PSD formalizada (Kassab vice, Folha, G1) e segue forte no plano estadual: a Paraná Pesquisas mostra sua força em Goiás no governo e no Senado (CartaCapital, VEJA). A BTG/Nexus 29/Jun deu Caiado 5% no 1T, o melhor da 3ª via; a PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno (Poder360, CNN). Num cenário SEM Flávio, a Futura/Apex dá Caiado 16.5% (lidera a 3ª via).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado cede a 0.90% (↓0.05pp, vol USD 4.7M) no vencedor, mantendo o 2º posto no sub-mercado de 3º lugar do 1º turno (12.5%) atrás de Renan (67.0%). Tem chapa pura do PSD (Kassab vice, Folha, G1) e segue forte em Goiás (Paraná Pesquisas, CartaCapital, VEJA). A BTG/Nexus 29/Jun o deu a 5% no 1T (melhor da 3ª via) e a PoderData o pôs em empate técnico com Lula no 2º turno, sinal de competitividade no cenário sem Flávio (Futura 16.5%). No cenário com Flávio, o 'paradoxo da direita' (G1) explica o teto. STF impeach 2.80%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "1.00%",
    poll: "Zema recua a Poly 1.00% (↓0.15pp, vol USD 4.3M) no vencedor, seguindo no piso; recua também no sub-mercado de 3º lugar do 1º turno (3.2%, atrás de Renan a 67.0% e Caiado a 12.5%). A BTG/Nexus 29/Jun deu Zema 3% no 1T. A PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno (CNN). A Datafolha 20/Jun deu 2% no 1T e 2T Lula 48% × Zema 39%. Sem Flávio, a Futura/Apex dá Zema 13.3%. Ainda não anunciou o vice (Estadão).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema recuou a 1.00% (↓0.15pp, vol USD 4.3M) no vencedor, seguindo no piso; recua também no sub-mercado de 3º lugar (3.2%, atrás de Renan a 67.0% e Caiado a 12.5%). A BTG/Nexus 29/Jun o deu a 3% no 1T. A PoderData o pôs em empate técnico com Lula no 2º turno, mas na disputa bipolarizada com Flávio o Novo não encontra tração. No cenário sem Flávio, a Futura/Apex dá Zema 13.3%, fôlego latente. Ainda não anunciou o vice (Estadão). STF impeach 2.80%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~13.2M acumulado, o maior do mercado, anomalia de legado). As nacionais não destacam Tarcísio no presidencial nacional (foco reeleição SP). A Datafolha de SP 05/Jul (estadual): no governo, Tarcísio lidera com 46% × Haddad 30%, com aprovação da gestão a 45% (segurança e saúde empatam como maiores problemas). A Datafolha SP 07/Jul mostrou ainda Marina 18%, Tebet 16% e Salles 13% na disputa ao Senado por SP (Estadão, Folha).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera: a Datafolha 05/Jul o dá no governo com 46% × Haddad 30% e aprovação de 45%. O mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 13.2M). O Estadão aponta que ele tem pouco incentivo para entrar de cabeça na campanha de Flávio. No mercado de Senado por número de cadeiras, o PL segue na liderança (87.5%), sinal de capilaridade institucional da legenda. STF impeach 2.80%."
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
