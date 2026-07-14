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
    poll: "Lula estável pelo 4º dia: Poly 60.50% (vol USD 7,3M acumulado), com o gap sobre Flávio estreitando a +36.65pp (↓0,60pp), a 83 dias do 1º turno. Mas o dado do dia é a pesquisa: a BTG/Nexus (n=2.003, campo 10-12/Jul, margem 2pp, BR-07981/2026) o dá com 40% no 1º turno, queda de 2pp ante os 42% de 29/Jun, e com 47% x 44% de Flávio no 2º turno, três pontos e dentro da margem, ou seja, EMPATE TÉCNICO. Confirma o estreitamento que a Gerp de 08/Jul sinalizou, agora vindo do primeiro escalão. O voto decidido caiu de 74% para 70%.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 13/Jul D+60: a 83 dias do 1º turno, o dia teve pesquisa nova E decisão do STF, e o mercado se moveu pela segunda. Lula ficou estável a 60.50% e o gap fechou em +36.65pp. A BTG/Nexus o põe em EMPATE TÉCNICO no 2º turno (47% x 44%) e o faz cair 2pp no 1º (42% para 40%). A Gerp de 08/Jul deixou de estar isolada: o estreitamento agora vem de instituto do primeiro escalão. O leque do 2º turno vai de derrota por 3pp (Gerp) a vitória por 6,5pp (AtlasIntel), a maior dispersão do ciclo. Ressalvas: voto decidido caiu de 74% para 70%, e sustentar 60,50% de probabilidade com um returno dentro da margem exige convergência que ainda não veio. Faltam três nacionais (100 Cidades 14/Jul, Quaest 15/Jul, PoderData 16/Jul). STF impeach no piso a 2.75%. Volume no presidencial USD 112,5M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "23.85%",
    poll: "Flávio sobe: Poly 23.85% (↑0,60pp, vol USD 7,4M acumulado) e SALTA no 2º lugar do 1º turno para 83.50% (↑5,0pp), a maior variação individual do dia. Nas urnas, a BTG/Nexus 13/Jul o mantém em 34% no 1º turno e o põe a apenas 3pp de Lula no 2º (44% x 47%), dentro da margem: empate técnico. Somada à Gerp de 08/Jul, que o dá VENCENDO o returno (45% x 42%), são duas nacionais consecutivas que o colocam a 3pp ou menos. Rejeição segue a maior do páreo.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 13/Jul: Flávio subiu a 23.85% e saltou no 2º lugar do 1º turno para 83.50%. Nas urnas, duas nacionais consecutivas o põem a 3pp ou menos de Lula no returno (BTG/Nexus 44x47 empate técnico; Gerp 45x42 vencendo). Mas o dia foi de desgaste institucional: MORAES SUSPENDEU POR 90 DIAS suas visitas a Jair Bolsonaro, por entender que ele usou o direito de visita para produzir e divulgar a carta política lida em 11/Jul, violando a proibição de o pai se manifestar por terceiros. Fica barrado até meados de outubro, prazo que cobre a reta final da campanha, e a defesa tem 48h para explicar. A prisão domiciliar NÃO foi revogada. O gesto que buscava consagrar a sucessão cortou o acesso ao consagrador. No partido, Valdemar e Michelle cercam a candidatura e Damares diz que ele AINDA é sua pré-candidata. Michelle dobrou no mercado (2.25%). Milei confirmou agenda em 25/Jul. STF impeach 2.75%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "10.05%",
    poll: "Renan parado no vencedor: Poly 10.05% (↓0,20pp, vol USD 8,1M acumulado, o maior volume individual entre os contendores vivos), mas AMPLIOU o favoritismo ao 3º lugar do 1º turno para 70.50% (↑4,0pp). As urnas discordam: a BTG/Nexus 13/Jul o mede em 4% no 1º turno, ATRÁS de Caiado (5%) e empatado com Zema (4%). O favorito folgado do mercado ao 3º lugar é o TERCEIRO nome da 3ª via na pesquisa mais recente.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "13/Jul: Renan ficou parado a 10.05% no vencedor e AMPLIOU o 3º lugar do 1º turno para 70.50% (↑4,0pp). A divergência não se estreitou, se APROFUNDOU: mercado 10,05% contra 4% na BTG/Nexus, onde ele aparece ATRÁS de Caiado (5%). É a mais larga do dashboard. Nenhuma nacional o mediu acima de 4% no ciclo inteiro. Segue com o maior volume acumulado individual entre os contendores vivos (USD 8,1M), o que dá densidade ao preço mas não substitui lastro eleitoral. Faltam três nacionais nesta semana: se ele não aparecer acima de 4% em nenhuma, o preço de dois dígitos fica descoberto. Perde o 2º turno para Lula por larga margem em todos os cenários (Gerp 08/Jul: 41% x 30%). STF impeach 2.75%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0.75%",
    poll: "Haddad estável a Poly 0.75% (vol USD 6,2M acumulado), como nome do PT depois de Lula. Não aparece nos cenários presidenciais da BTG/Nexus 13/Jul nem das nacionais de 08/Jul: as pesquisas não o testam no presidencial (foco no governo de SP). Na Datafolha SP 05/Jul, Tarcísio lidera com 46% x Haddad 30%, com Haddad na maior rejeição do estado (47%).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad estável a 0.75%, como nome do PT depois de Lula. O mercado não precifica candidatura presidencial dele; o foco é estadual. Não é testado no presidencial por nenhuma das nacionais recentes (BTG/Nexus 13/Jul, Gerp e Meio/Ideia 08/Jul). No governo de SP, a Datafolha 05/Jul deu Tarcísio 46% x Haddad 30%, com Haddad na maior rejeição do estado (47%). Mantém França vice na chapa de SP. STF impeach 2.75%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.45%",
    poll: "Caiado recua de leve no vencedor: Poly 1.45% (↓0,15pp, vol USD 4,9M acumulado), mas sobe no 3º lugar do 1º turno (16.50%, ↑1,0pp). E é o MELHOR da 3ª via na BTG/Nexus 13/Jul, com 5% no 1º turno, à frente de Renan (4%) e Zema (4%). Na Gerp 08/Jul tem a MENOR margem de derrota no 2º turno contra Lula entre os adversários alternativos (40% x 36%). Chapa pura do PSD (Kassab vice).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "13/Jul: Caiado recuou de leve no vencedor (1.45%) mas subiu no 3º lugar do 1º turno (16.50%). O contraste que o define ficou mais nítido: é o MELHOR da 3ª via na urna declarada (5% na BTG/Nexus, à frente de Renan e Zema) e vale um sétimo de Renan no mercado (1,45% contra 10,05%). O mercado precifica notoriedade, não intenção de voto. Na Gerp 08/Jul tem a menor margem de derrota no 2º turno contra Lula (40x36), o que o sustenta como o nome mais competitivo do campo num cenário de enfraquecimento de Flávio, e o dia trouxe justamente isso: Moraes suspendeu as visitas de Flávio ao pai por 90 dias. STF impeach 2.75%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0.85%",
    poll: "Zema no piso: Poly 0.85% (vol USD 4,3M). Mas marca 4% no 1º turno da BTG/Nexus 13/Jul, o MESMO de Renan Santos, que vale 10.05% no mercado. É a maior distorção relativa entre urna declarada e preço no painel da 3ª via. Na Gerp 08/Jul aparece com 2% e perde o 2º turno para Lula por 41% x 36%. Ainda não anunciou o vice.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "13/Jul: Zema segue no piso a 0.85% no vencedor. A BTG/Nexus o dá com 4% no 1º turno, exatamente o mesmo de Renan Santos, que o mercado precifica em 10,05%. Ou seja: mesma intenção de voto declarada, um doze avos do preço. É a maior distorção relativa do painel e um caso limpo da tese do AFOS, porque a divergência aqui não é entre mercado e pesquisa em geral, é entre dois candidatos com a MESMA medição de urna e preços incomparáveis. Sem vice anunciado. STF impeach 2.75%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio estável a Poly 0.15% no presidencial (anomalia de legado, vol USD 13,4M acumulado, o maior do book). Não aparece nos cenários presidenciais da BTG/Nexus 13/Jul nem das nacionais de 08/Jul. O foco é a reeleição em SP, onde a Datafolha 05/Jul o dá liderando o governo com 46% x Haddad 30% e aprovação de 45%. No Senado por cadeiras, o PL segue líder (87.50%).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera (Datafolha 05/Jul: 46% x Haddad 30%, aprovação de 45%). O mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 13,4M). Não é testado no presidencial por nenhuma nacional recente. No mercado de Senado por número de cadeiras, o PL segue na liderança (87.50%), sinal de capilaridade institucional da legenda num dia em que a cúpula do partido (Valdemar) aparece cercando a candidatura de Flávio. STF impeach 2.75%."
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
