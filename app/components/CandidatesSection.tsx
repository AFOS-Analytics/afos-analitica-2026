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
    polymarket: "62,50%",
    poll: "Lula CAI 1,00pp no dia em que saiu a maior pesquisa do recorte: Poly 62,50% (vol USD 7,73M acumulado), a 67 dias do 1º turno, com o gap sobre Flávio recuando de +39,65pp para +38,55pp. É o inverso exato de ontem, quando o preço subiu 1,00pp sem urna alguma. Ressalva de nível: 62,50% não é queda de patamar, é o mesmo valor de 25 e de 27/Jul, e o topo da série do AFOS marcou 63,50% em 26 e em 28/Jul. A URNA NOVA é a AtlasIntel/Bloomberg (n=5.021, campo 22 a 27/Jul, margem de 1pp, BR-08602/2026), a de maior amostra do recorte: 44,9% no 1º turno contra 35,8% de Flávio, gap de 9,1pp, e vitória nos SEIS cenários de returno em que ele aparece. Contra a rodada de 01/Jul do mesmo instituto, os DOIS primeiros colocados caem e o gap estreita de 9,7pp para 9,1pp, tudo dentro da margem de 1pp, ou seja, a urna diz estabilidade.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "O DADO QUE O PAINEL TEM OBRIGAÇÃO DE DESTACAR está dentro da própria AtlasIntel: a vitória mais apertada de Lula no returno NÃO é contra Flávio, é contra JAIR Bolsonaro, 49,2% a 43,9%, uma vantagem de 5,3pp contra os 6,3pp do cenário com o filho. A diferença entre os dois cenários, 1,0pp, está no limite da margem, então isso não desfaz empate nenhum e sim sugere que, pelo mesmo instituto e no mesmo campo, o nome do pai testa igual ou melhor. Nos dois cenários SEM ele: Haddad 44,3% x Flávio 43,7%, empate técnico, e Alckmin 45,8% x Flávio 42,7%. APROVAÇÃO: 47,6% contra 51,2% de desaprovação, com a aprovação subindo 1,7pp e a desaprovação caindo 1,1pp contra a rodada de 01/Jul, dois movimentos fora da margem, ainda que a desaprovação siga à frente. REJEIÇÃO: 49,4%, que fica 4,5pp acima da intenção de voto dele; em Flávio essa distância é de 17,1pp. ESTADUAIS: perde São Paulo nos dois turnos, 30% x 34% no 1º e 35% x 40% no returno (Genial/Quaest), e domina o Nordeste, 52% na Bahia e 54% no Ceará. EVENTOS: reclamou publicamente de corporativismo de juízes e procuradores e defendeu reforma de instituições (Folha de S.Paulo); a Justiça Eleitoral de São Paulo o multou em R$ 15 mil por propaganda antecipada (Estadão, G1, Valor). STF impeach 2,85%. Volume no presidencial em USD 116,49M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "23,95%",
    poll: "Flávio SOBE 0,10pp para Poly 23,95% (vol USD 7,70M acumulado), e o movimento pequeno tem leitura de série: é o QUARTO fechamento diário seguido em alta no histórico do AFOS, que saiu de 22,90% em 25/Jul. Como o favorito caiu 1,00pp, o gap contra ele estreitou 1,10pp e foi a +38,55pp, o mais estreito desde 24/Jul pelo fechamento diário. Nos sub-mercados, ficou PARADO em 78,00% no 2º lugar do 1º turno pelo segundo pregão e CAIU 1,50pp no 3º lugar, para 6,25%. Na urna, a AtlasIntel de 29/Jul o mede em 35,8% no 1º turno, recuo de 0,8pp contra a rodada de 01/Jul do instituto, e em 42,9% no returno contra 49,2% de Lula. Nas estaduais, LIDERA São Paulo, o maior colégio eleitoral do país, nos dois turnos: 34% x 30% no 1º e 40% x 35% no returno (Genial/Quaest, n=1.650, campo 23 a 27/Jul, BR-09998/2026).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "A CONTA DA PRÓPRIA CONVENÇÃO CHEGOU. Depois de Moraes dar 48 horas em 28/Jul, citando risco de nova violação das medidas cautelares, a defesa de Jair Bolsonaro informou ao STF nesta quarta que ele NÃO autorizou o uso da própria imagem e voz no vídeo gerado por inteligência artificial exibido na convenção do PL, e sustentou que não poderia tê-lo feito por estar proibido de receber visitas (Folha de S.Paulo, O Globo, Estadão, G1, 29/Jul). No mesmo dia, a campanha dele disse ao TSE que o vídeo é legal e não engana o eleitorado, e o PT acionou o TSE por outra peça de IA, em que ele pilota um caça ao lado de Javier Milei. Ministros do TSE veem abuso e querem frear o uso de IA em campanha; o STF se prepara para agir caso o TSE não puna (Estadão, O Globo). O NÚMERO MAIS DURO da urna nova é a rejeição de 52,9%, a mais alta entre os testados, que fica 17,1pp acima da própria intenção de voto no 1º turno; em Lula essa distância é de 4,5pp. E há o achado interno ao levantamento: JAIR perde o returno por 5,3pp e ele perde por 6,3pp. Segue sem vice definida, com o prazo de 05/Ago a menos de uma semana, e vetou a mãe como suplente no arranjo do Rio (O Globo). STF impeach 2,85%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "8,60%",
    poll: "Renan CAI 0,15pp para Poly 8,60% (vol USD 8,59M acumulado), mas o número dele que importa hoje não é o preço, é a DISTÂNCIA. A AtlasIntel de 29/Jul, com n=5.021 e margem de 1pp, o mede em 7,8% no 1º turno, a segunda melhor leitura nacional dele no recorte, atrás só dos 9% da Real Time de 21/Jul. Contra 8,60% de preço, a divergência que o painel acompanha desde junho caiu para 0,80pp. Nos sub-mercados, caiu 0,40pp no 2º lugar do 1º turno, para 11,75%, e RECUPEROU 1,00pp no 3º lugar, para 61,50%, revertendo parte da transferência para Caiado dos dois pregões anteriores. No returno, é o cenário mais confortável de Lula em toda a rodada: 47,6% a 30,2%.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "O ACHADO DE MÉTODO DO DIA é sobre a MECÂNICA da convergência, não sobre o nível. Nas semanas anteriores a distância entre preço e urna estreitava porque o PREÇO cedia, enquanto a urna ficava em 3%. Nesta rodada ela estreitou porque a URNA subiu, e subiu na pesquisa de maior amostra do recorte. São duas coisas diferentes acontecendo com o mesmo número, e a segunda é mais relevante, porque significa que o voto declarado se moveu na direção que o preço já apontava. Continua valendo que probabilidade de vitória e intenção de voto são grandezas diferentes, que não se subtraem uma da outra, e que convergência não é prova de acerto de ninguém. A DISPERSÃO ENTRE INSTITUTOS não se resolveu com a maior amostra do recorte: seguem de pé 9% na Real Time de 21/Jul, 7,8% na AtlasIntel de hoje, 6% na PoderData/Aya de 16/Jul, 5% na BTG/Nexus de 27/Jul e 3% em Datafolha, Gerp e Indexa, ou seja, seis pontos percentuais de amplitude para o mesmo nome no mesmo mês. Ressalva de série: 8,60% não é máximo nem mínimo, com pico de 17,90% em 09/Jun e piso de 5,30% em 26/Abr. NOTA DE CAPTURA: o 3º lugar dele foi o ÚNICO book que a trava reprovou na 1ª rodada, com 1,00pp de divergência, e os 61,50% publicados são o valor que repetiu nas três leituras seguintes. STF impeach 2,85%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,25%",
    poll: "Haddad teve o melhor dado de urna do pelotão, e por uma razão de método: é NACIONAL, ao contrário do de Zema na véspera. Num dos dois cenários de returno SEM Lula da AtlasIntel de 29/Jul, ele aparece com 44,3% contra 43,7% de Flávio, empate técnico dentro da margem de 1pp, e é o resultado mais apertado de toda a rodada. O preço acompanhou onde podia: ESTÁVEL em Poly 0,25% (vol USD 6,38M acumulado) no contrato de vencedor pelo segundo pregão, e ALTA de 0,35pp no book de 2º lugar do 1º turno, para 1,20%, com volume acumulado de USD 687 mil. Não é testado no cenário principal de 1º turno por nenhuma nacional.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "29/Jul: subir na chance de chegar ao returno e não subir na de ganhar é sinal cruzado, e no caso dele há um agravante de leitura que o painel precisa dizer com clareza: ele NÃO é candidato à Presidência, disputa o governo de São Paulo, e o cenário que o favorece é hipótese de pesquisa e não candidatura em curso. Na corrida estadual, que não entra neste painel de escopo nacional, a Genial/Quaest de 29/Jul o coloca com 26% contra 41% de Tarcísio no 1º turno, e a Paraná Pesquisas dá Tarcísio 51,8% x Haddad 38,3% no returno. Ressalva de método que vale para todo o pelotão: com preço em 0,25% e volume acumulado de USD 6,38M, ele é mais um exemplo de que volume mede história negociada e não convicção atual. STF impeach 2,85%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "2,35%",
    poll: "Caiado INVERTEU o sinal dos dois pregões anteriores, e a inversão é o achado. Vinha subindo forte no book de terceiro colocado e caindo no de vencedor; hoje SOBE 0,45pp no vencedor, para Poly 2,35% (vol USD 5,20M acumulado), e CAI 1,00pp no 3º lugar do 1º turno, para 25,50%, com Renan Santos recuperando 1,00pp naquele mesmo book. Os 2,35% desta captura estão acima de todo fechamento diário da série do AFOS desde 20/Jun, quando a série marcou 2,30%, e o máximo da série é 2,40%, de 14/Abr e de 19/Jun. Ou seja, o preço dele voltou ao alto da própria faixa histórica.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "A TERCEIRA MEDIÇÃO CHEGOU E DESMONTOU O EMPATE TÉCNICO. A AtlasIntel de 29/Jul, com n=5.021 e margem de 1pp, o mede em 3,1% no 1º turno, metade dos 6% que a BTG/Nexus mediu dois dias antes, e no returno o coloca perdendo por 48,2% a 38,9%, 9,3pp de distância, longe dos 45% a 43% da Nexus e mais perto dos 47% a 40% da Datafolha de 24/Jul. A divergência que o painel registrou em 27/Jul ficou, portanto, do lado da Datafolha. Preço de vencedor subindo e urna piorando no mesmo dia é divergência de direção, e o painel registra as duas sem escolher qual está certa. POLITICAMENTE foi o melhor dia dele: Tarcísio de Freitas deu aval para aliados apoiarem sua candidatura presidencial (CNN Brasil) e ele adotou a estratégia de atacar Lula e Flávio na mesma medida, dizendo que Flávio perdeu a própria convenção para um argentino e um avatar (Folha de S.Paulo, Estadão). Ressalva de escala: 2,35% segue sendo patamar baixo em absoluto, num book onde o favorito vale 62,50%. STF impeach 2,85%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,75%",
    poll: "Zema SOBE 0,20pp para Poly 0,75% (vol USD 4,57M) e CAI 0,10pp no 3º lugar do 1º turno, para 4,50%. A urna nacional de hoje reenquadra o melhor dado dele, que era ESTADUAL: a AtlasIntel de 29/Jul o mede em 2,8% no 1º turno e o coloca perdendo o returno NACIONAL para Lula por 48,6% a 39,6%, 9,0pp de distância. Na véspera, a Genial/Quaest de Minas Gerais o mostrava numericamente à frente de Lula por 39% a 37% num returno ESTADUAL, no estado que governou por dois mandatos. Returno estadual e returno nacional são perguntas diferentes, e a de hoje é a segunda.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "29/Jul: ressalva de série, e ela é grande. O máximo dele na série do AFOS é 10,10%, de 26/Abr, então 0,75% está a menos de um décimo daquele nível, e uma alta de 0,20pp num preço abaixo de 1% parece grande em termos relativos e é pouco dinheiro em termos absolutos. Ele pretende intensificar a presença na campanha ao governo de Minas Gerais (Folha de S.Paulo, 29/Jul), num estado onde o quadro partidário se mexeu muito nesta quarta: o Republicanos anunciou Cleitinho fora da disputa e prepara acordo com o PL em torno de Marcelo Aro, enquanto o próprio senador nega a desistência (G1, Folha de S.Paulo, O Globo). Segue SEM vice anunciado, com o prazo de 05/Ago a menos de uma semana. STF impeach 2,85%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,15%",
    poll: "Tarcísio estável a Poly 0,15% no presidencial, com o volume acumulado mais alto entre todos os nomes com preço vivo no book nesta captura, USD 13,66M. Não aparece nos cenários presidenciais das nacionais, incluindo a AtlasIntel de 29/Jul. O fato do dia que atravessa o recorte nacional é político e não de urna: ele deu aval para aliados apoiarem a candidatura presidencial de Caiado (CNN Brasil, 29/Jul). Na disputa estadual de São Paulo, que não entra neste painel, a Genial/Quaest o dá com 41% contra 26% de Haddad no 1º turno e com 55% de aprovação. No Senado por cadeiras, o PL ficou em 71,00%, estável, e o MDB subiu 0,35pp, para 17,60%.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "29/Jul: o presidencial dele em 0,15% com o maior volume acumulado do book é a anomalia de legado que serve de lembrete permanente de método, porque volume mede história negociada e não convicção atual. RESSALVA DE BASE sobre o Senado: aquele book soma USD 292 mil de volume acumulado contra USD 116,49M do presidencial, então movimento em percentual não significa dinheiro grande. NOTA DE CAPTURA: a trava de dupla leitura REPROVOU a 1ª rodada por 1,00pp de divergência no 3º lugar de Renan Santos e APROVOU a 2ª sem nenhuma divergência nos cinco books eleitorais, num total de quatro leituras ao longo de dezesseis minutos, então todos os preços entram firmes e não há faixa. Ressalva à parte para a inflação, que NÃO é coberta pela trava e soma USD 80 mil: a faixa modal VOLTOU para 5,00% a 5,49%, com 37,95%, enquanto a de 4,50% a 4,99% caiu de 39,25% para 34,70%, ou seja, a virada de ontem se desfez em um pregão. STF impeach 2,85%."
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
