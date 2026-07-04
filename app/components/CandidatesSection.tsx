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
    polymarket: "60.50%",
    poll: "Lula devolve parte do recorde: Poly 60.50% (↓1.00pp, vol USD 7.2M acumulado), com o gap sobre Flávio recuando a +38.10pp (↓1.45pp), abaixo do pico de +39.55pp (03/Jul), a 92 dias do 1º turno. Não houve pesquisa nacional nova: a base segue a AtlasIntel 01/Jul (Lula ampliando, 1T 46.3% × 36.6%; 2T 48.8% × 42.3%) e a Datafolha 17-18/Jun (2T 47% × 43%). O noticiário foi o calendário: o defeso eleitoral começou hoje (vedações, G1) e a janela partidária fortaleceu o PL (Gazeta do Povo), com Lula voltando a criticar Flávio no tarifaço (ano da verdade, Poder360).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 04/Jul D+51: a 92 dias do 1º turno, REVERSÃO. Lula recuou a 60.50% (↓1.00pp) e o gap caiu a +38.10pp (↓1.45pp), abaixo do pico de +39.55pp (03/Jul), devolvendo parte do recorde. Sem pesquisa nova, movimento de mercado. Motor: defeso eleitoral começou hoje (vedações a Lula e governadores, G1), janela partidária fortalece o PL (Gazeta do Povo), e Lula criticou Flávio no tarifaço (ano da verdade, Poder360). Ressalvas: aprovação online Atlas pior (desaprova 52.3%), parte das presenciais ainda vê 2º turno apertado (RJ 41.6×38.6, Band/Poder360). Rejeição 49%. STF impeach estável a 2.80%. Volume no presidencial acima de USD 110M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "22.40%",
    poll: "Flávio sobe de leve: Poly 22.40% (↑0.45pp, vol USD 7.2M acumulado), com o gap para Lula recuando a +38.10pp (Lula devolve parte do recorde). RECUPERA o 2º lugar do 1º turno (78.5%, ↑5.5pp), reforçando a condição de adversário certo. A crise com Michelle segue cobrando preço (BBC), e Lula voltou a atacá-lo no tarifaço (ano da verdade, Poder360). A janela partidária fortaleceu o PL e pressiona o Centrão (Gazeta do Povo); rejeição a maior do páreo (BTG/Nexus 51%).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 04/Jul: Flávio subiu a 22.40% (↑0.45pp) e o gap para Lula recuou a +38.10pp, abaixo do pico de +39.55pp. RECUPEROU o 2º lugar do 1º turno (78.5%, ↑5.5pp). Sem pesquisa nova, o pano de fundo segue a crise familiar (Michelle × Flávio, BBC) e o tarifaço (Lula voltou a criticá-lo, ano da verdade, Poder360). A janela partidária fortaleceu o PL (Gazeta do Povo), e uma comissão do Congresso dos EUA acusou Moraes de censura (Gazeta do Povo). Rejeição 51%. STF impeach 2.80%. Próximo teste: Datafolha SP a partir de 05/Jul."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "9.95%",
    poll: "Renan presidencial Poly 9.95% (↓0.10pp, vol USD 7.8M acumulado) no mercado de vencedor, de volta abaixo de 10%, e mantém o favoritismo ao 3º lugar do 1º turno (62.5%), à frente de Caiado (12.5%) e Zema (7.8%), seguindo com o maior volume acumulado do presidencial. As nacionais o medem em 2-4% no 1º turno, e a divergência do dashboard segue a mais larga (~6pp). Definiu o vice: o tenente-coronel da reserva Aroldo Medina (Folha). Aposta em vaquinha, base do MBL e Faria Lima sem máquina partidária (Estadão).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "04/Jul: Renan recuou de leve no vencedor (9.95%, ↓0.10pp, de volta abaixo de 10%) e manteve o favoritismo ao 3º lugar do 1º turno (62.5%), à frente de Caiado (12.5%) e Zema (7.8%). As pesquisas o medem a ~4% no 1T, e a divergência do dashboard segue a mais larga (~6pp). A leitura segue: provável 3º colocado, sem chance real de vencer (capital de nicho, dependente do tropeço alheio). STF impeach 2.80%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0.80%",
    poll: "Haddad cede a Poly 0.75% (↓0.30pp, vol USD 6.1M acumulado) como nome do PT depois de Lula no mercado presidencial. As nacionais não testam Haddad no presidencial nacional (foco governo de SP). Confirmou Márcio França (PSB) como vice na chapa pelo governo de SP, com Tebet e Marina cogitados para o Senado (Folha, Brasil de Fato), consolidando a aliança de centro-esquerda no estado. A Datafolha divulga pesquisa presidencial/governo/Senado em SP a partir de domingo 05/Jul (G1).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad cede a 0.75% (↓0.30pp), como nome do PT depois de Lula. O mercado não precifica candidatura presidencial dele; o foco é estadual. Confirmou França vice na chapa de SP, com Tebet/Marina ao Senado (Folha, Brasil de Fato). A Datafolha divulga pesquisa presidencial/governo/Senado em SP a partir de domingo 05/Jul (G1). Só 3 de 13 pré-candidatos definiram vice (G1). STF impeach 2.80%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.05%",
    poll: "Caiado cede a Poly 1.05% (↓0.20pp, vol USD 4.6M acumulado) no mercado de vencedor, mas SOBE no sub-mercado de 3º lugar do 1º turno (12.5%, ↓3.5pp), recuperando o 2º posto atrás de Renan (62.5%). Tem chapa pura do PSD formalizada (Kassab vice, Folha, G1). A BTG/Nexus 29/Jun deu Caiado 5% no 1T, o melhor da 3ª via; a PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno (Poder360, CNN). Num cenário SEM Flávio, a Futura/Apex dá Caiado 16.5% (lidera a 3ª via). É o nome posicionado para herdar o voto da direita se Flávio não for.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado cede a 1.05% (↓0.20pp, vol USD 4.6M) no vencedor, mas SOBE no sub-mercado de 3º lugar do 1º turno (12.5%, ↓3.5pp), recuperando o 2º posto atrás de Renan (62.5%). Tem chapa pura do PSD formalizada (Kassab vice, Folha, G1). A BTG/Nexus 29/Jun o deu a 5% no 1T (melhor da 3ª via) e a PoderData o pôs em empate técnico com Lula no 2º turno, sinal de competitividade no cenário sem Flávio (Futura 16.5%). No cenário com Flávio, o 'paradoxo da direita' (G1) explica o teto. STF impeach 2.80%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "1.05%",
    poll: "Zema recua a Poly 1.05% (↓0.60pp, vol USD 4.2M), devolvendo o avanço da véspera, mas recua no sub-mercado de 3º lugar do 1º turno (7.5%, ↓1.0pp, atrás de Renan a 62.5% e Caiado a 12.5%). A BTG/Nexus 29/Jun deu Zema 3% no 1T. A PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno (CNN). A Datafolha 20/Jun deu 2% no 1T e 2T Lula 48% × Zema 39%. Sem Flávio, a Futura/Apex dá Zema 13.3%. Prometeu anunciar o vice (Estadão).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema recuou a 1.05% (↓0.60pp, vol USD 4.2M), devolvendo o avanço da véspera, mas recuou no sub-mercado de 3º lugar (7.5%, ↓1.0pp, atrás de Renan a 62.5% e Caiado a 12.5%). A BTG/Nexus 29/Jun o deu a 3% no 1T. A PoderData o pôs em empate técnico com Lula no 2º turno, mas na disputa bipolarizada com Flávio o Novo não encontra tração. No cenário sem Flávio, a Futura/Apex dá Zema 13.3%, fôlego latente. Prometeu anunciar o vice (Estadão). STF impeach 2.80%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~13.2M acumulado, o maior do mercado, anomalia de legado). As nacionais não destacam Tarcísio no presidencial nacional (foco reeleição SP). A Datafolha divulga pesquisa presidencial/governo/Senado em SP a partir de domingo 05/Jul (G1), com Haddad confirmando França como vice no PT. Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera, e o mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 13.2M). A disputa por SP ganha um teste a partir de domingo 05/Jul (Datafolha presidencial/governo/Senado, G1), com Haddad confirmando França como vice (Folha). No mercado de Senado por número de cadeiras, o PL segue na liderança (87.5%), sinal de capilaridade institucional da legenda. STF impeach 2.80%."
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
