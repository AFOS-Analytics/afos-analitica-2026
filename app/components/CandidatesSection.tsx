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
    poll: "Lula segura o topo: Poly 60.50% (estável pelo 3º dia, vol USD 7.3M acumulado), com o gap sobre Flávio em +37.25pp, a 84 dias do 1º turno. O movimento do dia não foi de preço, foi de dado: entrou no dashboard a Gerp/AESP 08/Jul (n=2.000, BR-03067/2026), nacional que estava ausente por um erro de classificação de escopo na nossa ingestão do TSE, já corrigido. Ela dá EMPATE no 1º turno (36% × 36%) e Flávio vencendo o 2º (45% × 42%). No mesmo dia, a Meio/Ideia deu Lula 45% × 40% no 2º turno: duas nacionais, mesma data, vencedores opostos.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 12/Jul D+59: a 84 dias do 1º turno, domingo de acomodação no mercado e correção na base de pesquisas. Lula ficou estável a 60.50% e o gap fechou em +37.25pp. A novidade é a entrada da Gerp/AESP 08/Jul, que o EMPATA no 1º turno (36% × 36%) e o faz PERDER o 2º (42% × 45%), a primeira nacional do ciclo a pôr Flávio na frente. Ressalva de método: a Gerp é instituto de menor porte (reliability 3) e já era outlier em 24/Jun, destoando do consenso Tier 1. Lula escolheu São Bernardo para a largada da campanha de reeleição (Folha). Ressalvas: aprovação em empate técnico a 48%, rejeição 49%. Semana traz 4 nacionais (13 a 16/Jul). STF impeach no piso a 2.75%. Volume no presidencial USD 112.2M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "23.25%",
    poll: "Flávio sobe de leve: Poly 23.25% (alta 0.10pp, vol USD 7.3M acumulado), 4º dia de recuperação, com o gap para Lula em +37.25pp. AMPLIOU o domínio do 2º lugar do 1º turno para 78.5% (alta 2.0pp). Ganhou a PRIMEIRA nacional do ciclo que o põe vencendo o 2º turno: a Gerp/AESP 08/Jul dá empate no 1º turno (36% × 36%) e Flávio 45% × Lula 42% no returno. Mas a Meio/Ideia, do mesmo 08/Jul, dá Lula 45% × 40%, e a Gerp é outlier conhecido (reliability 3). Rejeição segue a maior do páreo (51%).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 12/Jul: Flávio subiu a 23.25% (alta 0.10pp) e ampliou o 2º lugar do 1º turno para 78.5%. Ganhou a primeira nacional do ciclo que o poe vencendo o 2º turno (Gerp/AESP 08/Jul, 45% × 42%), mas o instituto é outlier conhecido e a Meio/Ideia do mesmo dia dá resultado oposto (perde 45×40). No campo político o dia foi ambíguo: Caiado disse que a carta de Jair mostra a FRAGILIDADE da candidatura (Folha), lendo o gesto como socorro e não coroação, e o Republicanos negou acordo, reforçando a neutralidade em 2026 (Jornal Opção). Do lado positivo, ganhou 3 vezes mais seguidores que Lula no 1º semestre, alta de 5,6 milhões (Poder360). Rejeição nacional 51%, o teto estrutural. STF impeach 2.75%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "10.25%",
    poll: "Renan DEVOLVE a alta: Poly 10.25% (baixa 1.10pp, vol USD 8.0M acumulado), apagando parte do salto de 3.10pp em dois dias, correção esperável num movimento sem evento-motor. Mas não devolveu a posição estrutural: segurou os dois dígitos e AMPLIOU a liderança do 3º lugar do 1º turno para 66.5% (alta 5.0pp), abrindo distância de Caiado (15.5%). As nacionais o medem a 2-4% no 1º turno (a Gerp 08/Jul e a Meio/Ideia 08/Jul o põem em 2%), então a divergência segue a mais larga do dashboard (10.25% × 2-4%).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "12/Jul: Renan devolveu 1.10pp e caiu a 10.25% no vencedor, o que confirma que a alta de dois dias não tinha lastro em evento. Ainda assim segurou os dois dígitos e AMPLIOU o 3º lugar do 1º turno para 66.5% (alta 5.0pp): o mercado corrigiu o preço mas reforçou a leitura de que ele é o nome da 3ª via. Segue com o maior volume acumulado do presidencial (USD 8.0M). Na Gerp 08/Jul perde o 2º turno para Lula por 41% × 30%, a pior margem entre os adversários testados. A leitura não muda: provável 3º colocado, sem chance real de vencer, com preço que depende de lastro futuro. As 4 nacionais de 13 a 16/Jul são o teste. STF impeach 2.75%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0.75%",
    poll: "Haddad estável a Poly 0.75% (vol USD 6.2M acumulado), como nome do PT depois de Lula. Não aparece nos cenários presidenciais da Gerp 08/Jul nem da Meio/Ideia 08/Jul: as nacionais não o testam no presidencial (foco no governo de SP). Na Datafolha SP 05/Jul, Tarcísio lidera com 46% × Haddad 30%, e Haddad tem a maior rejeição do estado (47%). Mantém Márcio França (PSB) como vice na chapa de SP.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad estável a 0.75%, como nome do PT depois de Lula. O mercado não precifica candidatura presidencial dele; o foco é estadual. Não é testado no presidencial pelas nacionais recentes (Gerp e Meio/Ideia 08/Jul não o incluem nos cenários). No governo de SP, a Datafolha 05/Jul deu Tarcísio 46% × Haddad 30%, com Haddad na maior rejeição do estado (47%). Mantém França vice na chapa de SP. STF impeach 2.75%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.60%",
    poll: "Caiado praticamente parado: Poly 1.60% (baixa 0.05pp, vol USD 4.8M acumulado) no vencedor, e RECUOU no sub-mercado de 3º lugar do 1º turno para 15.5%, cedendo espaço a Renan (66.5%). Na Gerp 08/Jul é o melhor da 3ª via no 1º turno (4%) e tem a MENOR margem de derrota no 2º turno contra Lula (40% × 36%), o que sustenta a tese de que é o nome mais competitivo do campo caso Flávio saia da equação. Chapa pura do PSD (Kassab vice).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "12/Jul: Caiado ficou parado no vencedor (1.60%, baixa 0.05pp) e recuou no 3º lugar do 1º turno para 15.5%, atrás de Renan (66.5%). É o mais barulhento da 3ª via e o que menos converte barulho em preço. No dia, disse que a carta de Jair Bolsonaro mostra a FRAGILIDADE da candidatura de Flávio (Folha), leitura que inverte o sentido do gesto. Na Gerp 08/Jul aparece com 4% no 1º turno (melhor da 3ª via) e perde o 2º turno para Lula por 40% × 36%, a menor margem entre os adversários alternativos. Sem Flávio, a Futura/Apex dá 16.5%. STF impeach 2.75%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0.95%",
    poll: "Zema estável a Poly 0.95% (vol USD 4.3M) no vencedor, seguindo no piso, atrás de Renan e Caiado na 3ª via. Na Gerp 08/Jul aparece com 2% no 1º turno e perde o 2º turno para Lula por 41% × 36%. A Meio/Ideia 08/Jul deu 2.5% no 1T. A PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno (CNN). Sem Flávio, a Futura/Apex dá Zema 13.3%. Ainda não anunciou o vice (Estadão).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema ficou estável a 0.95% (vol USD 4.3M) no vencedor, no piso, atrás de Renan e Caiado na 3ª via. Na Gerp 08/Jul aparece com 2% no 1º turno e perde o 2º turno para Lula por 41% × 36%. A PoderData o pôs em empate técnico com Lula no 2º turno, mas na disputa bipolarizada com Flávio o Novo não encontra tração: bons cenários de 2º turno não viram preço. No cenário sem Flávio, a Futura/Apex dá Zema 13.3%, fôlego latente. Ainda não anunciou o vice (Estadão). STF impeach 2.75%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio estável a Poly 0.15% no presidencial (anomalia de legado, vol USD 13.4M acumulado, o maior do book). Não aparece nos cenários presidenciais da Gerp 08/Jul nem da Meio/Ideia 08/Jul: o foco é a reeleição em SP, onde a Datafolha 05/Jul o dá liderando o governo com 46% × Haddad 30% e aprovação de 45%. No mercado de Senado por cadeiras, o PL segue líder (87.5%).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera: a Datafolha 05/Jul o dá no governo com 46% × Haddad 30% e aprovação de 45%. O mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 13.4M). Não é testado no presidencial pelas nacionais recentes. No mercado de Senado por número de cadeiras, o PL segue na liderança (87.5%), sinal de capilaridade institucional da legenda. STF impeach 2.75%."
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
