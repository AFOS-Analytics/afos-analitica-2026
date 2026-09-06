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
    polymarket: "56,50%",
    poll: "A NACIONAL MAIS RECENTE É A VERITÁ DE 06/Set (n=3.804, campo 01 a 04/Set, margem de 2pp, BR-09426/2026), a primeira divulgada depois de dois dias sem nenhuma. ⚠️ ELA NÃO TRAZ CENÁRIO DE 2º TURNO, então a leitura mais recente desse par segue sendo a Datafolha de 03/Set. O registro do TSE traz outras dez nacionais com divulgação marcada entre 07 e 11/Set. A Veritá o mede em 38,4% no 1º turno, ATRÁS de Flávio Bolsonaro por 0,5 ponto, distância que cabe dentro da margem de 2 pontos e por isso configura empate técnico. Em 21/Ago a mesma casa dava 39,3% a ele contra 39,1%. A Datafolha de 03/Set segue como a leitura de 2º turno mais recente e o dá vencendo os quatro pares que testou, com avaliação do governo em 45% de aprovação contra 51% de desaprovação. NO PREÇO, o contrato de vencedor SUBIU 1,00pp e está em 56,50% (vol USD 9,83M acumulado), leitura confirmada de 06/Set, 13:53 BRT. No contrato de 2º lugar do 1º turno SUBIU 2,55pp e está em 7,90% (vol USD 474 mil).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "AS DUAS MEDIÇÕES DESTA PÁGINA APONTARAM PARA LADOS OPOSTOS EM 06/Set. O contrato de vencedor SUBIU 1,00pp e está em 56,50% (vol USD 9,83M acumulado), leitura confirmada de 06/Set, 13:53 BRT, e a distância para o segundo colocado abriu de 15,35pp para 16,80pp. No mesmo dia a Veritá o mediu em 38,4% no 1º turno, atrás do adversário por 0,5 ponto. São grandezas diferentes: a pesquisa mede intenção de voto declarada no 1º turno e o contrato mede probabilidade de vencer a eleição, e elas não se subtraem. Em 05/Set fez ato de campanha no interior de São Paulo, pediu voto para Fernando Haddad e não tratou da crise no Supremo, segundo O Globo e CartaCapital."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "39,70%",
    poll: "A NACIONAL MAIS RECENTE É A VERITÁ DE 06/Set (n=3.804, campo 01 a 04/Set, margem de 2pp, BR-09426/2026), a primeira divulgada depois de dois dias sem nenhuma. ⚠️ ELA NÃO TRAZ CENÁRIO DE 2º TURNO, então a leitura mais recente desse par segue sendo a Datafolha de 03/Set. O registro do TSE traz outras dez nacionais com divulgação marcada entre 07 e 11/Set. ELA O PÕE NUMERICAMENTE À FRENTE NO 1º TURNO, 38,9% contra 38,4% de Lula. ⚠️ Os 0,5 ponto cabem dentro da margem de 2 pontos, então o que a pesquisa mede é EMPATE TÉCNICO e não liderança. É a segunda nacional da janela a trazer essa ordem, depois da Gerp de 26/Ago, que deu 38% a 37%, e a Veritá tem confiabilidade 2 na régua da casa. As demais nacionais da janela seguem dando o líder à frente por margens de 3 a 9,7 pontos. NO PREÇO, o contrato de vencedor CEDEU 0,45pp e está em 39,70% (vol USD 9,74M acumulado), leitura confirmada de 06/Set, 13:53 BRT. No contrato de 2º lugar do 1º turno segue em 89,50% (vol USD 612 mil), sem variação.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "O PREÇO ANDOU CONTRA A PESQUISA EM 06/Set. O contrato de vencedor CEDEU 0,45pp e está em 39,70% (vol USD 9,74M acumulado), leitura confirmada de 06/Set, 13:53 BRT, com a distância para o líder abrindo de 15,35pp para 16,80pp, no mesmo dia em que a Veritá o pôs à frente no 1º turno por 0,5 ponto. No contrato de 2º lugar do 1º turno segue em 89,50% (vol USD 612 mil), sem variação, e na série gravada desde 14/Abr só um ponto já ficou acima disso, os 90,50% de 21/Ago. Interrompeu a campanha em 05/Set para visitar no Paraná um condenado pela trama golpista e voltou a cobrar o afastamento de Alexandre de Moraes, segundo O Globo e Folha de S.Paulo."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "1,60%",
    poll: "A NACIONAL MAIS RECENTE É A VERITÁ DE 06/Set (n=3.804, campo 01 a 04/Set, margem de 2pp, BR-09426/2026), a primeira divulgada depois de dois dias sem nenhuma. ⚠️ ELA NÃO TRAZ CENÁRIO DE 2º TURNO, então a leitura mais recente desse par segue sendo a Datafolha de 03/Set. O registro do TSE traz outras dez nacionais com divulgação marcada entre 07 e 11/Set. A Veritá o mede em 3,7% no 1º turno, à frente de Ronaldo Caiado (1,9%) e de Pablo Marçal (1,4%). A DISPERSÃO ENTRE CASAS NESTA JANELA VAI DE 3% A 7,6%, e os 3,7% ficam na parte de baixo dela. NO PREÇO, o contrato de vencedor CEDEU 0,25pp e está em 1,60% (vol USD 12,70M acumulado), leitura confirmada de 06/Set, 13:53 BRT. No contrato de 3º lugar do 1º turno SUBIU 1,50pp e está em 26,00% (vol USD 279 mil), terceira alta seguida.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "O contrato de vencedor CEDEU 0,25pp e está em 1,60% (vol USD 12,70M acumulado), leitura confirmada de 06/Set, 13:53 BRT. No contrato de 3º lugar do 1º turno SUBIU 1,50pp e passa a 26,00% num contrato de USD 279 mil, terceira alta seguida, contra 56,20% de Augusto Cury no mesmo mercado, que subiu 4,25pp. Entre os quatro nomes acima de 1% no contrato de vencedor, é o de maior volume acumulado, acima do líder e do segundo colocado, num contrato precificado abaixo de 2%. Volume acumulado é dinheiro que já passou pelo contrato desde a abertura e não diz para que lado ele foi. O pedido de impeachment que ele protocolou contra Alexandre de Moraes e Dias Toffoli segue em tramitação, segundo Gazeta do Povo."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "A nacional mais recente, a Veritá de 06/Set, não o testa em cenário presidencial de 1º turno, e a Datafolha de 03/Set também não. NO PREÇO, ele está em 0,05% (vol USD 7,43M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5% que o painel usa para separar preço de ruído, e esta rodada não publica preço novo para ele.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Ele está em 0,05% (vol USD 7,43M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%, e esta rodada não publica preço novo para ele. Não é candidato à Presidência: disputa o governo de São Paulo. O preço presidencial dele é resíduo de livro, não medida de campanha."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,15%",
    poll: "A NACIONAL MAIS RECENTE É A VERITÁ DE 06/Set (n=3.804, campo 01 a 04/Set, margem de 2pp, BR-09426/2026), a primeira divulgada depois de dois dias sem nenhuma. ⚠️ ELA NÃO TRAZ CENÁRIO DE 2º TURNO, então a leitura mais recente desse par segue sendo a Datafolha de 03/Set. O registro do TSE traz outras dez nacionais com divulgação marcada entre 07 e 11/Set. A Veritá o põe em 1,9% no 1º turno, abaixo dos 4% que a Datafolha de 03/Set media. O 2º TURNO CONTRA ELE JÁ TEM QUATRO RESULTADOS DIFERENTES NA MESMA SEMANA: 46% a 41% na Datafolha de 03/Set, 44% a 42% na PoderData do mesmo dia, 42% a 37% na Genial/Quaest de 02/Set e 45% a 43% a favor dele na Real Time Big Data de 01/Set, e a Veritá não testou esse par. NO PREÇO, ele está em 0,15% (vol USD 7,16M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%, e esta rodada não publica preço novo para ele nesse contrato.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "Ele está em 0,15% (vol USD 7,16M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%, e esta rodada não publica preço novo para ele nesse contrato. No contrato de 3º LUGAR do 1º turno, que é outro mercado, ele SUBIU 0,50pp e voltou a 10,00% (vol USD 114 mil), leitura confirmada de 06/Set, 13:53 BRT. AS QUATRO CASAS DA SEMANA DÃO QUATRO RESULTADOS PARA O MESMO PAR DE 2º TURNO, e o painel registra os quatro sem escolher entre eles. Levou a crise do Supremo e o caso Master ao horário eleitoral, segundo Valor Econômico."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,15%",
    poll: "A NACIONAL MAIS RECENTE É A VERITÁ DE 06/Set (n=3.804, campo 01 a 04/Set, margem de 2pp, BR-09426/2026), a primeira divulgada depois de dois dias sem nenhuma. ⚠️ ELA NÃO TRAZ CENÁRIO DE 2º TURNO, então a leitura mais recente desse par segue sendo a Datafolha de 03/Set. O registro do TSE traz outras dez nacionais com divulgação marcada entre 07 e 11/Set. A Veritá o mede em 0,3% no 1º turno, abaixo dos 2% que a Datafolha de 03/Set media. As quatro casas da semana mediram o par de 2º turno contra ele em 3, 11, 2 e 9 pontos, e a Veritá não testou esse par. NO PREÇO, ele está em 0,15% (vol USD 6,56M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Ele está em 0,15% (vol USD 6,56M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%, e esta rodada não publica preço novo para ele nesse contrato. No contrato de 3º LUGAR do 1º turno, que é outro mercado, SUBIU 0,15pp e está em 0,85% (vol USD 49 mil), leitura confirmada de 06/Set, 13:53 BRT. O par de 2º turno dele contra o líder é onde as casas da semana mais discordam: as margens contra ele foram de 11, 3, 2 e 9 pontos."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "A nacional mais recente, a Veritá de 06/Set, não o testa em cenário presidencial de 1º turno, e a Datafolha de 03/Set também não. NO PREÇO, ele está em 0,05% (vol USD 14,07M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5% que o painel usa para separar preço de ruído, e esta rodada não publica preço novo para ele.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Ele está em 0,05% (vol USD 14,07M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%, e esta rodada não publica preço novo para ele. Não é candidato à Presidência: disputa a reeleição em São Paulo. O livro dele é o maior do painel em volume acumulado num contrato que paga 0,05%, e essa combinação é a assinatura de um mercado que já resolveu a pergunta."
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
