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
    poll: "Lula estável num sábado parado: Poly 60.50% (vol USD 7.2M acumulado), com o gap sobre Flávio subindo de leve a +38.20pp (↑0.10pp), ainda abaixo do pico de +39.55pp (03/Jul), a 91 dias do 1º turno. Não houve pesquisa presidencial nacional nova: a base segue a AtlasIntel 01/Jul (Lula ampliando, 1T 46.3% × 36.6%; 2T 48.8% × 42.3%) e a Datafolha nacional 17-19/Jun (2T 47% × 43%). A Datafolha de SP saiu hoje (estadual): no governo, Tarcísio 46% × Haddad 30%. O noticiário foi o tarifaço (Flávio nos EUA critica Lula, dizendo que ele quer a taxa por ganho político, O Globo) e o calendário (defeso em vigor, propaganda partidária liberada hoje).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 05/Jul D+52: a 91 dias do 1º turno, sábado de mercado parado. Lula ficou estável a 60.50% e o gap subiu de leve a +38.20pp (↑0.10pp), ainda abaixo do pico de +39.55pp (03/Jul). Sem pesquisa presidencial nova, movimento mínimo de mercado. Motor: tarifaço (Flávio nos EUA critica Lula, O Globo), disputa por segurança pública (presídios de máxima, O Globo), defeso em vigor e propaganda partidária liberada hoje (Portal O Dia). Novidade estadual: Datafolha SP dá Tarcísio 46% × Haddad 30% no governo. Ressalvas: aprovação online Atlas pior (desaprova 52.3%), parte das presenciais ainda vê 2º turno apertado (RJ 41.6×38.6, Band/Poder360). Rejeição 49%. Caso Master esfriou. STF impeach estável a 2.75%. Volume no presidencial acima de USD 110M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "22.30%",
    poll: "Flávio cede de leve: Poly 22.30% (↓0.10pp, vol USD 7.2M acumulado), com o gap para Lula subindo a +38.20pp num sábado parado. PERDE parte do 2º lugar do 1º turno (72.5%, ↓6.0pp) para Renan (11.4%), mas segue o adversário certo. Desembarcou nos EUA para uma audiência sobre o tarifaço e criticou Lula, dizendo que ele quer a taxa de Trump por ganho político (O Globo). A crise com Michelle segue no radar (BBC), e o Estadão aponta que Tarcísio tem pouco incentivo para entrar de cabeça na campanha dele. O PL segue líder do Senado (87.5%); rejeição a maior do páreo (BTG/Nexus 51%).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 05/Jul: Flávio cedeu a 22.30% (↓0.10pp) e o gap para Lula subiu a +38.20pp, ainda abaixo do pico de +39.55pp. PERDEU parte do 2º lugar do 1º turno (72.5%, ↓6.0pp) para Renan. Sem pesquisa nova, o pano de fundo foi o tarifaço: foi aos EUA para uma audiência sobre a taxa e acusou Lula de querê-la por ganho político (O Globo), depois de já ter pedido a Trump para adiá-la (Folha). A crise com Michelle segue (BBC), e o Estadão aponta que Tarcísio, o palanque mais forte da direita, tem pouco incentivo para entrar de cabeça na campanha dele. Rejeição 51%. STF impeach 2.75%. Datafolha SP saiu hoje (governo Tarcísio 46% × Haddad 30%)."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "9.85%",
    poll: "Renan presidencial Poly 9.85% (↓0.10pp, vol USD 7.8M acumulado) no mercado de vencedor, abaixo de 10%, e mantém o favoritismo ao 3º lugar do 1º turno (62.5%), à frente de Caiado (12.5%) e Zema (6.5%), seguindo com o maior volume acumulado do presidencial. No sub-mercado de 2º lugar do 1º turno subiu a 11.4%, herdando parte do que Flávio cedeu. As nacionais o medem em 2-4% no 1º turno, e a divergência do dashboard segue a mais larga (~6pp). Vice definido: o tenente-coronel da reserva Aroldo Medina (Folha). Aposta em vaquinha, base do MBL e Faria Lima sem máquina partidária (Estadão).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "05/Jul: Renan recuou de leve no vencedor (9.85%, ↓0.10pp, abaixo de 10%), mas subiu no sub-mercado de 2º lugar do 1º turno a 11.4% (herdando parte do que Flávio cedeu) e manteve o favoritismo ao 3º lugar (62.5%), à frente de Caiado (12.5%) e Zema (6.5%). As pesquisas o medem a ~4% no 1T, e a divergência do dashboard segue a mais larga (~6pp). A leitura segue: provável 3º colocado, sem chance real de vencer (capital de nicho, dependente do tropeço alheio). STF impeach 2.75%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0.80%",
    poll: "Haddad estável a Poly 0.80% (vol USD 6.1M acumulado) como nome do PT depois de Lula no mercado presidencial. As nacionais não testam Haddad no presidencial nacional (foco governo de SP). A Datafolha de SP saiu hoje (estadual): no governo, Tarcísio lidera com 46% × Haddad 30%, e Haddad tem a maior rejeição do estado (47%), mas a Folha aponta que o PT ainda vê espaço para ele crescer. Confirmou Márcio França (PSB) como vice na chapa pelo governo de SP, com Tebet e Marina cogitados para o Senado (Folha, Brasil de Fato).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad estável a 0.80%, como nome do PT depois de Lula. O mercado não precifica candidatura presidencial dele; o foco é estadual. A Datafolha SP 05/Jul deu o quadro do desafio: no governo, Tarcísio 46% × Haddad 30%, com Haddad na maior rejeição do estado (47%) e aprovação de Tarcísio a 45%; a Folha aponta que o PT ainda vê espaço para Haddad crescer. Confirmou França vice na chapa de SP, com Tebet/Marina ao Senado (Folha, Brasil de Fato). STF impeach 2.75%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.05%",
    poll: "Caiado estável a Poly 1.05% (vol USD 4.6M acumulado) no mercado de vencedor, mantendo o 2º posto no sub-mercado de 3º lugar do 1º turno (12.5%) atrás de Renan (62.5%). Tem chapa pura do PSD formalizada (Kassab vice, Folha, G1). A BTG/Nexus 29/Jun deu Caiado 5% no 1T, o melhor da 3ª via; a PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno (Poder360, CNN). Num cenário SEM Flávio, a Futura/Apex dá Caiado 16.5% (lidera a 3ª via). É o nome posicionado para herdar o voto da direita se Flávio não for.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado estável a 1.05% (vol USD 4.6M) no vencedor, mantendo o 2º posto no sub-mercado de 3º lugar do 1º turno (12.5%) atrás de Renan (62.5%). Tem chapa pura do PSD formalizada (Kassab vice, Folha, G1). A BTG/Nexus 29/Jun o deu a 5% no 1T (melhor da 3ª via) e a PoderData o pôs em empate técnico com Lula no 2º turno, sinal de competitividade no cenário sem Flávio (Futura 16.5%). No cenário com Flávio, o 'paradoxo da direita' (G1) explica o teto. STF impeach 2.75%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "1.05%",
    poll: "Zema estável a Poly 1.05% (vol USD 4.2M) no vencedor, mas recua no sub-mercado de 3º lugar do 1º turno (6.5%, ↓1.0pp, atrás de Renan a 62.5% e Caiado a 12.5%). A BTG/Nexus 29/Jun deu Zema 3% no 1T. A PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno (CNN). A Datafolha 20/Jun deu 2% no 1T e 2T Lula 48% × Zema 39%. Sem Flávio, a Futura/Apex dá Zema 13.3%. Prometeu anunciar o vice (Estadão).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema estável a 1.05% (vol USD 4.2M) no vencedor, mas recuou no sub-mercado de 3º lugar (6.5%, ↓1.0pp, atrás de Renan a 62.5% e Caiado a 12.5%). A BTG/Nexus 29/Jun o deu a 3% no 1T. A PoderData o pôs em empate técnico com Lula no 2º turno, mas na disputa bipolarizada com Flávio o Novo não encontra tração. No cenário sem Flávio, a Futura/Apex dá Zema 13.3%, fôlego latente. Prometeu anunciar o vice (Estadão). STF impeach 2.75%."
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
