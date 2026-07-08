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
    poll: "Lula segura o topo: Poly 61.50% (estável, vol USD 7.3M acumulado), com o gap sobre Flávio recuando de leve a +39.05pp, saindo da beira do recorde de +39.55pp (03/Jul), a 88 dias do 1º turno. Base de pesquisa nova: a Meio/Ideia 08/Jul (n=1.500) deu Lula liderando todos os cenários (1T 40.4% × Flávio 32%; 2T 45% × 40%; 2T 45% × Michelle 36%), a 1ª nacional com números desde a AtlasIntel 01/Jul. Em SP, a Datafolha 08/Jul deu empate 35x35 no presidencial (estadual), com Lula em rejeição maior. Dia de digestão da pesquisa: Aécio descartou o PSDB (Estadão) e Camilo Santana virou líder do PT no Senado (Pleno).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 08/Jul D+55: a 88 dias do 1º turno, pesquisa nova e mercado quase parado. Lula ficou estável em 61.50% e o gap recuou de leve a +39.05pp, saindo da beira do recorde, com Flávio se recuperando. A Meio/Ideia 08/Jul confirmou a liderança (1T 40.4×32; 2T 45×40), mas o 2º turno segue competitivo (+5pp) e em SP a Datafolha deu empate 35x35 (estadual). A divergência de nível (mercado +39pp × pesquisa +5pp) persiste. Ressalvas: rejeição 49%, o próprio fundador do Ideia vê a reeleição frágil (UOL), agenda travada (Alcolumbre × PT). STF impeach estável a 2.80%. Volume no presidencial USD 111.2M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "22.45%",
    poll: "Flávio recupera de leve: Poly 22.45% (↑0.25pp, vol USD 7.3M acumulado), estreitando o gap para Lula a +39.05pp e saindo da beira do recorde. Mantém a maior fatia do 2º lugar do 1º turno (80.5%), reforçando a condição de adversário certo. A nova Meio/Ideia 08/Jul o pôs a 2º turno de 40% (Lula 45%) e 1T de 32%, atrás em todos os cenários nacionais. Mas em SP a Datafolha 08/Jul trouxe alívio: empate 35x35 no presidencial, com Lula em rejeição maior (Folha, CNN). Segue o prazo de Moraes para a PF o ouvir por calúnia contra Lula (Consultor Jurídico); rejeição nacional a maior do páreo (51%).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 08/Jul: Flávio recuperou a 22.45% (↑0.25pp) e estreitou o gap para Lula a +39.05pp, saindo da beira do recorde. Mantém o 2º lugar do 1º turno (80.5%). A Meio/Ideia 08/Jul o pôs atrás em todos os cenários (1T 32%, 2T 40% × Lula 45%), mas em SP a Datafolha deu empate 35x35 no presidencial, com Lula em rejeição maior. Segue correndo o prazo de 10 dias de Moraes para a PF o ouvir por calúnia contra Lula (Consultor Jurídico). Rejeição nacional 51%. STF impeach 2.80%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "9.65%",
    poll: "Renan presidencial Poly 9.65% (estável, vol USD 7.9M acumulado) no mercado de vencedor, abaixo de 10%, e AMPLIA o favoritismo ao 3º lugar do 1º turno (69.0%, ↑2.0pp), à frente de Caiado (10.0%), seguindo com o maior volume acumulado do presidencial. As nacionais o medem em 2-4% no 1º turno (Meio/Ideia 08/Jul 2%), e a divergência do dashboard segue a mais larga. Vice definido: o tenente-coronel da reserva Aroldo Medina (Folha). Aposta em vaquinha, base do MBL e Faria Lima sem máquina partidária (Estadão).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "08/Jul: Renan ficou estável no vencedor (9.65%, abaixo de 10%) e ampliou o favoritismo ao 3º lugar do 1º turno (69.0%, ↑2.0pp), à frente de Caiado (10.0%). A Meio/Ideia 08/Jul o mediu a 2% no 1T, e a divergência do dashboard (mercado 9.65% × pesquisa 2-4%) segue a mais larga. A leitura segue: provável 3º colocado, sem chance real de vencer (capital de nicho, dependente do tropeço alheio). STF impeach 2.80%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0.85%",
    poll: "Haddad recua a Poly 0.85% (↓0.05pp, vol USD 6.1M acumulado) como nome do PT depois de Lula no mercado presidencial. As nacionais não testam Haddad no presidencial (foco governo de SP). Em SP, a Datafolha 08/Jul deu Lula e Flávio empatados no presidencial (35x35), leitura estadual. No governo de SP, a Datafolha 05/Jul deu Tarcísio 46% × Haddad 30%, com Haddad na maior rejeição do estado (47%), mas a Folha aponta que o PT ainda vê espaço para ele crescer. Confirmou Márcio França (PSB) como vice na chapa pelo governo de SP, com Tebet e Marina cogitados para o Senado (Folha, Brasil de Fato).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad recua a 0.85% (↓0.05pp), como nome do PT depois de Lula. O mercado não precifica candidatura presidencial dele; o foco é estadual. Em SP, a Datafolha 08/Jul deu empate 35x35 no presidencial; no governo, a Datafolha 05/Jul deu Tarcísio 46% × Haddad 30%, com Haddad na maior rejeição do estado (47%). Confirmou França vice na chapa de SP, com Tebet/Marina ao Senado (Folha, Brasil de Fato). STF impeach 2.80%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.35%",
    poll: "Caiado SOBE a Poly 1.35% (↑0.45pp, vol USD 4.8M acumulado) no mercado de vencedor, o maior avanço da 3ª via no dia, embora recue no sub-mercado de 3º lugar do 1º turno (10.0%) atrás de Renan (69.0%). A Meio/Ideia 08/Jul o pôs como melhor da 3ª via no 1T (4%). Tem chapa pura do PSD (Kassab vice, Folha, G1) e segue forte em Goiás no governo e no Senado (Paraná Pesquisas, CartaCapital, VEJA). A PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno; num cenário SEM Flávio, a Futura/Apex dá Caiado 16.5% (lidera a 3ª via).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado SOBE a 1.35% (↑0.45pp, vol USD 4.8M) no vencedor, o maior avanço da 3ª via, embora recue no 3º lugar do 1º turno (10.0%) atrás de Renan (69.0%). A Meio/Ideia 08/Jul o deu como melhor da 3ª via no 1T (4%). Chapa pura do PSD (Kassab vice) e força em Goiás (Paraná Pesquisas). Empate técnico com Lula no 2º turno (PoderData) e melhor no cenário sem Flávio (Futura 16.5%). No cenário com Flávio, o 'paradoxo da direita' (G1) explica o teto, e Aécio descartou o PSDB (Estadão). STF impeach 2.80%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0.95%",
    poll: "Zema recua de leve a Poly 0.95% (↓0.05pp, vol USD 4.3M) no vencedor, seguindo no piso, agora atrás de Caiado na 3ª via. A Meio/Ideia 08/Jul deu Zema 2.5% no 1T. A PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno (CNN). A Datafolha 20/Jun deu 2% no 1T e 2T Lula 48% × Zema 39%. Sem Flávio, a Futura/Apex dá Zema 13.3%. Ainda não anunciou o vice (Estadão).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema recuou de leve a 0.95% (↓0.05pp, vol USD 4.3M) no vencedor, seguindo no piso, atrás de Caiado na 3ª via. A Meio/Ideia 08/Jul o deu a 2.5% no 1T. A PoderData o pôs em empate técnico com Lula no 2º turno, mas na disputa bipolarizada com Flávio o Novo não encontra tração. No cenário sem Flávio, a Futura/Apex dá Zema 13.3%, fôlego latente. Ainda não anunciou o vice (Estadão). STF impeach 2.80%."
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
