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
    poll: "Lula segura o topo: Poly 60.50% (estável, vol USD 7.3M acumulado), com o gap sobre Flávio estreitando a +37.35pp num dia em que a oposição se consolidou em torno de Flávio, a 85 dias do 1º turno. Sem pesquisa nacional nova com números (as nacionais saem entre 13 e 15/Jul): a base segue a Meio/Ideia 08/Jul (2T 45×40) e a AtlasIntel 01/Jul (2T 48.8×42.3), com Lula à frente em todos os cenários. O governo acredita em um capítulo final do tarifaço nos próximos dias.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 11/Jul D+58: a 85 dias do 1º turno, sábado de consolidação da oposição em torno de Flávio. Lula ficou estável a 60.50% e o gap estreitou a +37.35pp, com Flávio recuperando pelo 2º dia. Sem pesquisa nacional nova (nacionais 13-15/Jul). Na pauta, Jair divulgou carta nomeando Flávio porta-voz e candidato (Folha), mas Caiado disse que a candidatura de Flávio está afundando (O Globo). Governo vê capítulo final do tarifaço próximo. Ressalvas: 2º turno competitivo (+5 a +6pp nas nacionais; empate em SP), rejeição 49%, atrito com o STF. STF impeach no piso a 2.75%. Volume no presidencial USD 112.1M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "23.15%",
    poll: "Flávio segue recuperando: Poly 23.15% (↑0.60pp, vol USD 7.3M acumulado), estreitando o gap para Lula a +37.35pp. Mantém a maior fatia do 2º lugar do 1º turno (76.5%). No dia, ganhou um selo de unidade: Jair divulgou uma carta lida por Flávio nomeando-o seu porta-voz e candidato e pedindo união em meio à crise com Michelle (Folha). Mas Caiado elevou o tom dizendo que a candidatura está afundando e comparando-o a um peru de Natal que Lula cuida para o 2º turno (O Globo). Nas nacionais segue atrás (Meio/Ideia 08/Jul 2T 40%; AtlasIntel 01/Jul 2T 42.3%); rejeição a maior do páreo (51%).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 11/Jul: Flávio seguiu recuperando a 23.15% (↑0.60pp), estreitando o gap para Lula a +37.35pp, e mantém o 2º lugar do 1º turno (76.5%). Ganhou um selo de unidade com a carta de Jair nomeando-o porta-voz e candidato e pedindo união em meio à crise com Michelle (Folha). Mas Caiado elevou o tom dizendo que a candidatura está afundando (O Globo) e Renan cresceu na 3ª via. Flávio alertou que a China pode elevar a tarifa da carne a 67% (Poder360). Nas nacionais segue atrás (2T 40-42.3%). Rejeição nacional 51%. STF impeach 2.75%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "11.35%",
    poll: "Renan ESTENDE a alta: Poly 11.35% (↑1.30pp, vol USD 8.0M acumulado) no mercado de vencedor, 2º dia seguido de alta, consolidando dois dígitos folgados. Mantém a liderança do 3º lugar do 1º turno (61.5%), bem à frente de Caiado (16.0%). Foi momentum na 3ª via por 2 dias, sem evento-motor específico, embalado pelo discurso duro contra Flávio. As nacionais o medem em 2-4% no 1º turno (Meio/Ideia 08/Jul 2%), então a divergência ficou ainda mais larga (11.35% x 2-4%), a maior do dashboard. Segue com o maior volume acumulado do presidencial (USD 8.0M).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "11/Jul: Renan ESTENDEU a alta para o 2º dia, subindo a 11.35% (↑1.30pp) e consolidando dois dígitos folgados, e segue líder do 3º lugar do 1º turno (61.5%), bem à frente de Caiado (16.0%). A alta acumulada de 3.10pp em dois dias (de 8.25% a 11.35%) é forte para um nome que as urnas não confirmam (preço esticado). Foi momentum na 3ª via, sem evento-motor específico. As nacionais o medem a 2-4% no 1T. A leitura segue: provável 3º colocado, sem chance real de vencer, com preço agora esticado que depende de lastro futuro. STF impeach 2.75%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0.75%",
    poll: "Haddad estável em Poly 0.75% (vol USD 6.2M acumulado) como nome do PT depois de Lula no mercado presidencial. As nacionais não testam Haddad no presidencial (foco governo de SP). No dia, rebateu Tarcísio após ataques do governador a Marina e Tebet, chamando de agressão gratuita (Revista Fórum). No governo de SP, a Datafolha 05/Jul deu Tarcísio 46% × Haddad 30%, com Haddad na maior rejeição do estado (47%). Mantém Márcio França (PSB) como vice na chapa pelo governo de SP.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad estável a 0.75%, como nome do PT depois de Lula. O mercado não precifica candidatura presidencial dele; o foco é estadual. Rebateu Tarcísio após ataques do governador a Marina e Tebet, chamando de agressão gratuita (Revista Fórum). No governo de SP, a Datafolha 05/Jul deu Tarcísio 46% × Haddad 30%, com Haddad na maior rejeição do estado (47%). Mantém França vice na chapa de SP. STF impeach 2.75%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.65%",
    poll: "Caiado sobe de leve: Poly 1.65% (↑0.40pp, vol USD 4.8M acumulado) no mercado de vencedor, mas RECUA no sub-mercado de 3º lugar do 1º turno (16.0%), atrás de Renan (61.5%). O dia foi de ofensiva retórica: elevou o tom contra Flávio dizendo que a candidatura está afundando, que aliados já pulam fora e comparando-o a um peru de Natal que Lula cuida para o 2º turno (O Globo, Money Times, Bnews). A Meio/Ideia 08/Jul o pôs como melhor da 3ª via no 1T (4%). Tem chapa pura do PSD (Kassab vice); a PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno; num cenário SEM Flávio, a Futura/Apex dá Caiado 16.5% (lidera a 3ª via).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado sobe a 1.65% (↑0.40pp, vol USD 4.8M) no vencedor, mas recua no 3º lugar do 1º turno (16.0%), atrás de Renan (61.5%). Ofensiva retórica: disse que a candidatura de Flávio está afundando, que aliados já pulam fora e o comparou a um peru de Natal que Lula cuida para o 2º turno (O Globo, Money Times, Bnews). Melhor da 3ª via na Meio/Ideia (1T 4%). Chapa pura do PSD (Kassab vice). Empate técnico com Lula no 2º turno (PoderData) e melhor no cenário sem Flávio (Futura 16.5%). STF impeach 2.75%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0.95%",
    poll: "Zema estável a Poly 0.95% (vol USD 4.3M) no vencedor, seguindo no piso, atrás de Renan e Caiado na 3ª via. A Meio/Ideia 08/Jul deu Zema 2.5% no 1T. A PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno (CNN). A Datafolha 20/Jun deu 2% no 1T e 2T Lula 48% × Zema 39%. Sem Flávio, a Futura/Apex dá Zema 13.3%. Ainda não anunciou o vice (Estadão).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema ficou estável a 0.95% (vol USD 4.3M) no vencedor, no piso, atrás de Renan e Caiado na 3ª via. A Meio/Ideia 08/Jul o deu a 2.5% no 1T. A PoderData o pôs em empate técnico com Lula no 2º turno, mas na disputa bipolarizada com Flávio o Novo não encontra tração. No cenário sem Flávio, a Futura/Apex dá Zema 13.3%, fôlego latente. Ainda não anunciou o vice (Estadão). STF impeach 2.75%."
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
