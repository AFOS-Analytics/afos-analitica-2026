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
    polymarket: "63,50%",
    poll: "Lula SOBE 1,00pp e volta ao topo da série: Poly 63,50% (vol USD 7,69M acumulado), a 68 dias do 1º turno, com o gap sobre Flávio em +39,65pp. O número IGUALA o topo da série do AFOS, marcado em 26/Jul às 22:30 UTC, e não o supera; o maior gap da série segue sendo +39,80pp, da mesma madrugada. NÃO HOUVE URNA NACIONAL nesta terça, então o preço subiu sem âncora de pesquisa. A última nacional continua sendo a BTG/Nexus de 27/Jul (n=2.004, campo 24 a 26/Jul, BR-01489/2026), com 42% no 1º turno e 47% x 43% no returno. As três pesquisas do dia são ESTADUAIS: 55% x 21% de Flávio em Pernambuco, empate técnico em Minas Gerais nos dois turnos com Zema numericamente à frente por 39% x 37% no returno, e 42% x 46% de Flávio no Rio de Janeiro.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "CRUZAMENTO RARO registrado nesta semana, e ele não é entre mercado e pesquisa, é entre mercado e modelo. A fala é de 24/Jul e NÃO de hoje: Felipe Nunes, diretor da Quaest, afirmou no Expert XP daquela sexta que a probabilidade de reeleição de Lula saiu de cerca de 38% para perto de 60%, num modelo que associa aprovação do governo à probabilidade de reeleição, com a virada começando em maio (InfoMoney, 25/Jul; Brasil 247, 27/Jul). O Polymarket marca 63,50%. É a primeira vez neste painel em que as duas fontes estimam a MESMA grandeza, probabilidade de vitória, e não probabilidade contra intenção de voto. Os dois números ficam lado a lado e o painel NÃO subtrai um do outro, porque perto de 60% não é valor exato. Proximidade não é validação, assim como divergência não seria prova de erro. EVENTOS: noticiou-se que Trump prorrogará por um ano a emergência nacional sobre o Brasil, com aviso previsto no Federal Register de 29/Jul, o que mantém a base jurídica das sobretaxas sem criar sanção nova; e o governo brasileiro formalizou em 27/Jul o pedido de consultas na OMC. STF impeach CAIU 0,60pp, para 2,80%. Volume no presidencial em USD 116,26M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "23,85%",
    poll: "Flávio PARADO no vencedor pelo segundo pregão: Poly 23,85% (vol USD 7,69M acumulado), e SOBE 1,50pp no 2º lugar do 1º turno, para 78,00%. É o inverso exato do sinal de ontem, quando subiu no vencedor e caiu no 2º lugar. Como o favorito subiu 1,00pp e ele não se moveu, o gap contra ele abriu para +39,65pp. SEM URNA NACIONAL nesta terça. Nas estaduais, o dia corta nos dois sentidos: no Rio de Janeiro, seu estado, a Real Time Big Data (n=2.000, campo 23 a 27/Jul, BR-06074/2026) o coloca à FRENTE de Lula no returno por 46% a 42%; em Pernambuco, a Genial/Quaest (n=900, BR-03810/2026) o mede em 21% contra 55%, trinta e quatro pontos de distância.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 28/Jul: faltou ao depoimento na Polícia Federal e enviou defesa por escrito ao STF no inquérito que apura calúnia contra Lula, sustentando que o presidente voltou a associá-lo a traidores da pátria e a citar enforcamento; Moraes mandou a PGR se manifestar sobre o depoimento cancelado (G1, O Globo, CartaCapital). O recorte de gênero da Datafolha de 24/Jul, publicado nesta terça, mostra Lula com 50% contra 40% dele entre mulheres no 2º turno, com a rejeição dele sendo a mais alta nesse grupo. A campanha dele pediu ao TSE a rejeição da ação sobre o vídeo de IA de Jair Bolsonaro, citando máscara de Lula e post sobre o Master. O PT acionou a PGR para investigar gastos com a ida de Milei à convenção do PL. Segue sem vice definida, com o prazo de 05/Ago à vista e disputa interna aberta. STF impeach 2,80%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "8,75%",
    poll: "Renan tem o pior dia do recorte, e a razão é a consistência e não o tamanho: CAIU nos TRÊS books em que aparece. Poly 8,75% no vencedor (queda 0,80pp, vol USD 8,58M acumulado), perdendo a casa dos 9%; 12,15% no 2º lugar do 1º turno (queda 0,50pp); e 60,50% no 3º lugar (queda 1,50pp). Ontem os books dele andaram em direções opostas, o que permitia ler realocação interna; hoje andaram juntos para baixo, o que é saída de dinheiro em todas as frentes. Do outro lado da conta está Caiado, que somou 11,00pp no 3º lugar em dois pregões. SEM URNA NACIONAL nesta terça: a última leitura segue sendo a BTG/Nexus de 27/Jul, que o mede em 5% no 1º turno.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "28/Jul: a distorção que o painel acompanha desde junho segue sendo a maior do recorte, agora com 8,75% de probabilidade implícita contra 5% na última nacional e 3% em três institutos de julho, e ela estreitou por movimento do PREÇO e não da urna. A dispersão entre institutos não foi resolvida hoje, porque nenhuma nacional saiu: continuam os três patamares, 3% em Datafolha 24/Jul, Gerp 22/Jul e Indexa 21/Jul, 5% na BTG/Nexus de 27/Jul e 9% na Real Time de 21/Jul. Segue valendo que probabilidade de vitória e intenção de voto são grandezas diferentes, e o painel registra a distância sem chamar nenhuma das duas fontes de errada. Ressalva de série: 8,75% não é máximo nem mínimo dele, com pico de 17,90% em 09/Jun e piso de 5,30% em 26/Abr. STF impeach 2,80%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,25%",
    poll: "Haddad ESTÁVEL em Poly 0,25% (vol USD 6,38M acumulado) depois de dois pregões seguidos de queda. Não é testado para presidente por nenhuma nacional, incluindo a BTG/Nexus de 27/Jul e a Datafolha de 24/Jul, então o preço dele é resíduo de nome conhecido e não tem lastro de urna no cargo precificado. No book de 2º lugar do 1º turno marca 0,85% com volume acumulado de USD 687 mil, um dos casos em que volume alto convive com preço próximo de zero. A chapa dele ao governo de São Paulo foi oficializada em 25/Jul, com Márcio França (PSB) de vice.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "28/Jul: sem fato novo próprio no dia. O que vale registrar é de método e vale para todo o pelotão: com preço em 0,25% e volume acumulado de USD 6,38M, ele é mais um exemplo de que volume mede história negociada e não convicção atual. A disputa de São Paulo é estadual e não entra neste painel, de escopo nacional. STF impeach 2,80%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1,90%",
    poll: "Caiado SOBE forte no book de colocação e CAI no de vencedor, e essa separação é o achado do dia. No 3º lugar do 1º turno saiu da faixa de 19,00% a 19,50% para 26,50%, somando 11,00pp em dois pregões contando os 15,50% de 26/Jul. No contrato presidencial ficou em Poly 1,90% (queda 0,05pp, vol USD 5,19M acumulado). Ou seja, o mercado está reprecificando quem termina em TERCEIRO, não quem ganha a eleição, e a contrapartida é a queda de Renan Santos no mesmo book. SEM URNA NACIONAL nesta terça: a última que o testa é a BTG/Nexus de 27/Jul, com 6% no 1º turno e empate técnico com Lula no returno, 45% a 43%, ainda sem terceira medição para desempatar contra a Datafolha de 24/Jul (47% x 40%).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "CONTRAPONTO GEOGRÁFICO em 28/Jul, e o painel mostra com o mesmo destaque que deu ao empate técnico nacional: o Poder360 registra que Caiado lidera em Goiás e que Goiás é o ÚNICO estado em que a terceira via aparece competitiva, valendo 3,2% do eleitorado nacional. Competitividade nacional medida em cenário de returno e competitividade concentrada em um estado não são a mesma coisa. Some a isso que a alta do dia ficou restrita ao book de terceiro colocado e não se transferiu para o de presidente, o que enfraquece a leitura de avanço real. Ressalva de escala: 1,90% segue sendo patamar baixo em absoluto, e 0,05pp num book desse tamanho é pouco dinheiro. Nota de captura, desta vez positiva: a trava de dupla leitura APROVOU a captura de hoje sem nenhuma divergência, então o 26,50% entra como preço firme e não como faixa, ao contrário de ontem. STF impeach 2,80%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,55%",
    poll: "Zema teve o melhor dado de urna do pelotão, e ele é ESTADUAL. Na Genial/Quaest de Minas Gerais (n=1.482, campo 22 a 26/Jul, margem 3pp, BR-09333/2026 e MG-03490/2026), aparece com 39% contra 37% de Lula num cenário de 2º turno, numericamente à FRENTE e dentro da margem, no estado que governou por dois mandatos. É o único nome do pelotão à frente de Lula em algum cenário de returno nesta rodada. O preço não reagiu: Poly 0,55% (estável, vol USD 4,55M) e 4,60% no 3º lugar do 1º turno. Na última nacional, a BTG/Nexus de 27/Jul, tem 3% no 1º turno e perde o returno para Lula por 46% a 42%.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "28/Jul: a distância entre 39% em Minas e 3% na última nacional é a explicação para o preço não ter se movido, e é o registro de método que interessa aqui: resultado de 2º turno num estado não se transfere para o país, ainda que Minas seja o terceiro maior colégio eleitoral. Segue SEM vice anunciado, com o prazo de 05/Ago a uma semana. O noticiário desta terça cita um senador e um cientista político entre os cotados e traz o presidente do Democracia Cristã elogiando uma eventual chapa dele com Joaquim Barbosa, sem nenhuma confirmação do Novo (Folha de S.Paulo, Estadão). Ele foi oficializado candidato em 27/Jul e o preço caiu naquele pregão, no terceiro lançamento seguido a terminar assim; hoje o preço ficou parado. STF impeach 2,80%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,15%",
    poll: "Tarcísio estável a Poly 0,15% no presidencial, com o volume acumulado mais alto entre todos os mercados do book nesta captura, USD 13,65M. Não aparece nos cenários presidenciais das nacionais. Confirmou candidatura à reeleição em São Paulo, disputa estadual que não entra neste painel de escopo nacional. No Senado por cadeiras, o PL ficou em 71,00%, estável, e o MDB caiu 1,00pp, para 17,25%.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "28/Jul: o presidencial dele em 0,15% com o maior volume acumulado do book é a anomalia de legado que serve de lembrete permanente de método, porque volume mede história negociada e não convicção atual. RESSALVA DE BASE sobre o Senado: aquele book soma USD 292 mil de volume acumulado contra USD 116,26M do presidencial, então movimento em percentual não significa dinheiro grande. NOTA DE CAPTURA, e hoje ela é boa: a trava de dupla leitura PASSOU sem nenhuma divergência nos cinco books que cobre, ao contrário das duas rodadas bloqueadas ontem, então nada nesta atualização entra como faixa. Ressalva à parte para a inflação: aquele mercado NÃO é coberto pela trava, soma USD 79 mil e nesta terça mudou de faixa modal, com 4,50% a 4,99% indo a 39,25% e passando à frente da faixa de 5,00% a 5,49%, que ficou em 38,15%. STF impeach 2,80%."
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
