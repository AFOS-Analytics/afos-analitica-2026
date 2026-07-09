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
    poll: "Lula segura o topo: Poly 61.50% (estável, vol USD 7.3M acumulado), com o gap sobre Flávio recuando a +38.55pp (Flávio recuperando por 2 dias), a 87 dias do 1º turno. Sem pesquisa nacional nova (a 'nova Quaest' na imprensa é re-cobertura da onda de 10/Jun): a base segue a Meio/Ideia 08/Jul (2T 45×40) e a Quaest 10/Jun (2T 44×38), com Lula à frente em todos os cenários. A consultoria Eurasia elevou a chance de reeleição de Lula a 60% (Diário do Centro do Mundo). No campo adversário, Aécio desistiu da Presidência (Folha) e a União-PP avalia neutralidade (Estadão).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 09/Jul D+56: a 87 dias do 1º turno, rearranjo na 3ª via. Lula ficou estável em 61.50% e o gap recuou a +38.55pp, com Flávio recuperando por 2 dias. Sem pesquisa nacional nova (Quaest é re-cobertura de 10/Jun). A Eurasia elevou a chance de reeleição a 60% (Diário do Centro do Mundo), convergindo com o mercado, e o campo adversário se fragmentou (Aécio desiste, União-PP avalia neutralidade). Ressalvas: 2º turno competitivo (+5 a +6pp nas nacionais; empate em SP), rejeição 49%, agenda travada antes do recesso. STF impeach estável a 2.80%. Volume no presidencial USD 111.7M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "22.95%",
    poll: "Flávio segue recuperando: Poly 22.95% (↑0.50pp, vol USD 7.3M acumulado), 2º dia de alta, estreitando o gap para Lula a +38.55pp. Mantém a maior fatia do 2º lugar do 1º turno (79.5%), reforçando a condição de adversário certo. Mas a articulação enfraqueceu: a federação União-PP avalia ficar neutra na eleição nacional, o que fragilizaria seus apoios (Estadão), e o PL avalia apoio a Ciro Gomes no Ceará (Folha). Nas nacionais segue atrás (Meio/Ideia 08/Jul 2T 40%; Quaest 10/Jun 2T 38%); rejeição a maior do páreo (51%).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 09/Jul: Flávio seguiu recuperando a 22.95% (↑0.50pp), 2º dia de alta, estreitando o gap para Lula a +38.55pp. Mantém o 2º lugar do 1º turno (79.5%). Mas a articulação enfraqueceu: a União-PP avalia ficar neutra na eleição nacional, fragilizando apoios (Estadão), e Aécio desistiu da Presidência (Folha), deixando o campo de centro-direita indefinido. Nas nacionais segue atrás (2T 38-40%). Segue o prazo de Moraes para a PF o ouvir por calúnia contra Lula. Rejeição nacional 51%. STF impeach 2.80%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "8.25%",
    poll: "Renan CAI forte: Poly 8.25% (↓1.40pp, vol USD 7.9M acumulado) no mercado de vencedor, a maior variação individual do dia, e PERDE força no 3º lugar do 1º turno (59.5%, ↓9.5pp), com Caiado se aproximando (18.5%). Foi rearranjo/momentum na 3ª via, sem evento-motor claro. As nacionais o medem em 2-4% no 1º turno (Meio/Ideia 08/Jul 2%), e a divergência do dashboard, embora menor hoje, segue a mais larga. Vice definido: o tenente-coronel da reserva Aroldo Medina (Folha). Segue com o maior volume acumulado do presidencial.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "09/Jul: Renan teve a maior variação do dia, caindo forte no vencedor (8.25%, ↓1.40pp) e perdendo 9.5pp no 3º lugar do 1º turno (59.5%), com Caiado se aproximando (18.5%). Foi rearranjo/momentum na 3ª via, sem evento-motor claro. As nacionais o medem a 2-4% no 1T. A leitura segue: provável 3º colocado, sem chance real de vencer (capital de nicho), mas a dianteira dele na briga secundária virou disputável por Caiado. STF impeach 2.80%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0.75%",
    poll: "Haddad recua a Poly 0.75% (↓0.10pp, vol USD 6.1M acumulado) como nome do PT depois de Lula no mercado presidencial. As nacionais não testam Haddad no presidencial (foco governo de SP). Em SP, a Datafolha 08/Jul deu Lula e Flávio empatados no presidencial (35x35), leitura estadual. No governo de SP, a Datafolha 05/Jul deu Tarcísio 46% × Haddad 30%, com Haddad na maior rejeição do estado (47%). Colocou-se aberto a debater critérios para verba estatal à imprensa (Brasil de Fato). Confirmou Márcio França (PSB) como vice na chapa pelo governo de SP (Folha, Brasil de Fato).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad recua a 0.75% (↓0.10pp), como nome do PT depois de Lula. O mercado não precifica candidatura presidencial dele; o foco é estadual. Em SP, a Datafolha 08/Jul deu empate 35x35 no presidencial; no governo, a Datafolha 05/Jul deu Tarcísio 46% × Haddad 30%, com Haddad na maior rejeição do estado (47%). Confirmou França vice na chapa de SP (Folha, Brasil de Fato). STF impeach 2.80%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.95%",
    poll: "Caiado SOBE a Poly 1.95% (↑0.60pp, vol USD 4.8M acumulado) no mercado de vencedor, 2º dia seguido de avanço, e AVANÇA no sub-mercado de 3º lugar do 1º turno (18.5%, ↑8.5pp), se aproximando de Renan (59.5%). O impulso vem do plano estadual: uma pesquisa o dá liderando em Goiás contra Lula e Flávio (Poder360, VEJA). A Meio/Ideia 08/Jul o pôs como melhor da 3ª via no 1T (4%). Tem chapa pura do PSD (Kassab vice, Folha, G1); a PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno; num cenário SEM Flávio, a Futura/Apex dá Caiado 16.5% (lidera a 3ª via).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado SOBE a 1.95% (↑0.60pp, vol USD 4.8M) no vencedor, 2º dia de avanço, e SALTA no 3º lugar do 1º turno (18.5%, ↑8.5pp), se aproximando de Renan (59.5%). Impulso do plano estadual: lidera em Goiás contra Lula e Flávio (Poder360, VEJA). Melhor da 3ª via na Meio/Ideia (1T 4%). Chapa pura do PSD (Kassab vice). Empate técnico com Lula no 2º turno (PoderData) e melhor no cenário sem Flávio (Futura 16.5%). Com Aécio desistindo do Planalto (Folha), a briga pela 3ª posição se concentra entre Renan e Caiado. STF impeach 2.80%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0.90%",
    poll: "Zema recua de leve a Poly 0.90% (↓0.05pp, vol USD 4.3M) no vencedor, seguindo no piso, agora bem atrás de Caiado na 3ª via após o avanço do rival. A Meio/Ideia 08/Jul deu Zema 2.5% no 1T. A PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno (CNN). A Datafolha 20/Jun deu 2% no 1T e 2T Lula 48% × Zema 39%. Sem Flávio, a Futura/Apex dá Zema 13.3%. Ainda não anunciou o vice (Estadão).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema recuou de leve a 0.90% (↓0.05pp, vol USD 4.3M) no vencedor, seguindo no piso, bem atrás de Caiado na 3ª via. A Meio/Ideia 08/Jul o deu a 2.5% no 1T. A PoderData o pôs em empate técnico com Lula no 2º turno, mas na disputa bipolarizada com Flávio o Novo não encontra tração. No cenário sem Flávio, a Futura/Apex dá Zema 13.3%, fôlego latente. Ainda não anunciou o vice (Estadão). STF impeach 2.80%."
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
