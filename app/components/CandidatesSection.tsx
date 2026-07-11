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
    poll: "Lula segura o topo: Poly 60.50% (↓1.00pp, vol USD 7.3M acumulado), com o gap sobre Flávio estreitando a +37.95pp num dia em que os dois principais cederam de leve, a 86 dias do 1º turno. Sem pesquisa nacional nova com números (BTG/Nexus e Quaest só na próxima semana, Money Times): a base segue a Meio/Ideia 08/Jul (2T 45×40) e a AtlasIntel 01/Jul (2T 48.8×42.3), com Lula à frente em todos os cenários. No noticiário, Caiado atacou Lula e Flávio no debate do tarifaço ('farinha do mesmo saco', Poder360).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 10/Jul D+57: a 86 dias do 1º turno, reversão parcial da 3ª via. Lula recuou de leve a 60.50% (↓1.00pp) e o gap estreitou a +37.95pp por queda dos dois principais. Sem pesquisa nacional nova (BTG/Nexus e Quaest só na próxima semana). Na pauta, o tarifaço dos EUA dominou: Flávio foi a Washington (Estadão vê armadilha) e Caiado atacou Lula e Flávio (Poder360). No caso Master, nova operação da PF (Compliance Zero) contra publicitário de Vorcaro. Ressalvas: 2º turno competitivo (+5 a +6pp nas nacionais; empate em SP), rejeição 49%. STF impeach no piso a 2.75%. Volume no presidencial USD 111.9M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "22.55%",
    poll: "Flávio cede de leve: Poly 22.55% (↓0.40pp, vol USD 7.3M acumulado) após dois dias de alta, com o gap para Lula em +37.95pp. Recuou também no 2º lugar do 1º turno (77.0%, ↓2.5pp), mas segue adversário certo. No dia, foi a Washington pelo tarifaço num movimento que o Estadão vê como possível armadilha, enquanto Caiado o atacou junto com Lula (Poder360) e Milei viria ao Brasil para lançá-lo (Revista Fórum). Nas nacionais segue atrás (Meio/Ideia 08/Jul 2T 40%; AtlasIntel 01/Jul 2T 42.3%); rejeição a maior do páreo (51%).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 10/Jul: Flávio cedeu de leve a 22.55% (↓0.40pp) após dois dias de alta, e recuou no 2º lugar do 1º turno (77.0%, ↓2.5pp). Dia de exposição externa: foi a Washington pelo tarifaço num movimento que o Estadão vê como armadilha, Caiado o atacou junto com Lula (Poder360) e Milei viria ao Brasil para lançá-lo (Revista Fórum). Nas nacionais segue atrás (2T 38-42.3%). Segue o prazo de Moraes para a PF o ouvir por calúnia contra Lula, e aliados discutem adiar a escolha do candidato ao Senado no Rio (Estadão). Rejeição nacional 51%. STF impeach 2.75%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "10.05%",
    poll: "Renan REVERTE e sobe forte: Poly 10.05% (↑1.80pp, vol USD 8.0M acumulado) no mercado de vencedor, a maior variação individual do dia, revertendo a queda de ontem, e RECONQUISTA força no 3º lugar do 1º turno (61.5%, ↑2.0pp), com Caiado recuando (15.5%). Foi reprecificação por momentum na 3ª via, sem evento-motor claro. As nacionais o medem em 2-4% no 1º turno (Meio/Ideia 08/Jul 2%), e a divergência voltou a se alargar, seguindo a mais larga do dashboard. Segue com o maior volume acumulado do presidencial (USD 8.0M).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "10/Jul: Renan teve de novo a maior variação do dia, agora para cima, subindo forte no vencedor (10.05%, ↑1.80pp) e reconquistando o 3º lugar do 1º turno (61.5%, ↑2.0pp), com Caiado devolvendo o ganho (15.5%). Foi reprecificação por momentum na 3ª via, revertendo a queda de ontem, sem evento-motor claro. As nacionais o medem a 2-4% no 1T. A leitura segue: provável 3º colocado, sem chance real de vencer (capital de nicho), com preço volátil na briga secundária com Caiado. STF impeach 2.75%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0.75%",
    poll: "Haddad estável em Poly 0.75% (vol USD 6.2M acumulado) como nome do PT depois de Lula no mercado presidencial. As nacionais não testam Haddad no presidencial (foco governo de SP). O PT reforça a aposta em Alckmin para impulsionar Haddad e Lula no interior de SP após a Datafolha (Folha). No governo de SP, a Datafolha 05/Jul deu Tarcísio 46% × Haddad 30%, com Haddad na maior rejeição do estado (47%). Mantém Márcio França (PSB) como vice na chapa pelo governo de SP.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad estável a 0.75%, como nome do PT depois de Lula. O mercado não precifica candidatura presidencial dele; o foco é estadual. O PT reforça a aposta em Alckmin para impulsioná-lo e a Lula no interior de SP (Folha). No governo de SP, a Datafolha 05/Jul deu Tarcísio 46% × Haddad 30%, com Haddad na maior rejeição do estado (47%). Mantém França vice na chapa de SP. STF impeach 2.75%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.25%",
    poll: "Caiado DEVOLVE o ganho de ontem: Poly 1.25% (↓0.70pp, vol USD 4.8M acumulado) no mercado de vencedor e RECUA no sub-mercado de 3º lugar do 1º turno (15.5%, ↓3.0pp), cedendo espaço de volta a Renan (61.5%). Fora do mercado, foi protagonista da pauta: atacou Lula e Flávio no debate do tarifaço ('farinha do mesmo saco', Poder360) e virou o 3º presidenciável mais citado nas redes. A Meio/Ideia 08/Jul o pôs como melhor da 3ª via no 1T (4%). Tem chapa pura do PSD (Kassab vice); a PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno; num cenário SEM Flávio, a Futura/Apex dá Caiado 16.5% (lidera a 3ª via).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado DEVOLVE o ganho de ontem: cai a 1.25% (↓0.70pp, vol USD 4.8M) no vencedor e recua no 3º lugar do 1º turno (15.5%, ↓3.0pp), cedendo espaço a Renan (61.5%). Fora do mercado, foi protagonista: atacou Lula e Flávio no debate do tarifaço ('não defendem o Brasil', Poder360, Rádio Itatiaia) e virou o 3º mais citado nas redes. Melhor da 3ª via na Meio/Ideia (1T 4%). Chapa pura do PSD (Kassab vice). Empate técnico com Lula no 2º turno (PoderData) e melhor no cenário sem Flávio (Futura 16.5%). STF impeach 2.75%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0.95%",
    poll: "Zema sobe de leve a Poly 0.95% (↑0.05pp, vol USD 4.3M) no vencedor, seguindo no piso, atrás de Renan e Caiado na 3ª via. A Meio/Ideia 08/Jul deu Zema 2.5% no 1T. A PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno (CNN). A Datafolha 20/Jun deu 2% no 1T e 2T Lula 48% × Zema 39%. Sem Flávio, a Futura/Apex dá Zema 13.3%. Ainda não anunciou o vice (Estadão).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema subiu de leve a 0.95% (↑0.05pp, vol USD 4.3M) no vencedor, seguindo no piso, atrás de Renan e Caiado na 3ª via. A Meio/Ideia 08/Jul o deu a 2.5% no 1T. A PoderData o pôs em empate técnico com Lula no 2º turno, mas na disputa bipolarizada com Flávio o Novo não encontra tração. No cenário sem Flávio, a Futura/Apex dá Zema 13.3%, fôlego latente. Ainda não anunciou o vice (Estadão). STF impeach 2.75%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~13.2M acumulado, o maior do mercado, anomalia de legado). As nacionais não destacam Tarcísio no presidencial nacional (foco reeleição SP). A Datafolha de SP 05/Jul (estadual): no governo, Tarcísio lidera com 46% × Haddad 30%, com aprovação da gestão a 45% (segurança e saúde empatam como maiores problemas). A Datafolha SP 07/Jul mostrou ainda Marina 18%, Tebet 16% e Salles 13% na disputa ao Senado por SP (Estadão, Folha).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera: a Datafolha 05/Jul o dá no governo com 46% × Haddad 30% e aprovação de 45%. O mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 13.4M). O Estadão aponta que ele tem pouco incentivo para entrar de cabeça na campanha de Flávio, exposta a desgaste no debate do tarifaço. No mercado de Senado por número de cadeiras, o PL segue na liderança (87.5%), sinal de capilaridade institucional da legenda. STF impeach 2.75%."
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
