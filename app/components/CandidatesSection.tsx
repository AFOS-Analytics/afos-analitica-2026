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
    polymarket: "55,50%",
    poll: "A ÚNICA NACIONAL DESTA QUARTA É A GENIAL/QUAEST (n=2.004, campo 30/Ago a 01/Set, margem de 2pp, BR-07065/2026). A casa publicou DOIS cenários de 1º turno, um com Pablo Marçal e outro sem, e um cenário espontâneo. Ela lhe dá 37% nos dois cenários estimulados, contra 38% na rodada da mesma casa de 14/Ago, e 28% no espontâneo. Vence os cinco cenários de 2º turno: 42% a 41% contra o segundo colocado, 42% a 37% contra Ronaldo Caiado, 44% a 33% contra Romeu Zema, 43% a 36% contra Renan Santos e 40% a 34% contra Augusto Cury. Rejeição de 53%. NO PREÇO, leitura confirmada de 02/Set, 20:26 BRT (23:26 UTC), em 55,50% (vol USD 9,59M acumulado), SEM VARIAÇÃO.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "SEM VARIAÇÃO, em 55,50% (vol USD 9,59M acumulado), leitura confirmada de 02/Set, 20:26 BRT (23:26 UTC). O preço dele não sai de 55,50% pelo quinto dia seguido. A distância para o segundo colocado CAIU para 14,85pp, contra 16,55pp na véspera, e a compressão veio inteira do lado do adversário. NA URNA DECLARADA, O 2º TURNO CONTRA RONALDO CAIADO INVERTE O DA VÉSPERA: aqui ele vence por 42% a 37%, enquanto a Real Time Big Data de 01/Set, com campo que se sobrepõe, o dava atrás por 45% a 43%. São 7pp de diferença na margem do mesmo par entre duas casas que mediram a mesma semana. Conversou com Fachin, Dino e Gilmar sobre a crise no Supremo e se distanciou de Moraes, segundo Folha de S.Paulo e O Globo."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "40,65%",
    poll: "A ÚNICA NACIONAL DESTA QUARTA É A GENIAL/QUAEST (n=2.004, campo 30/Ago a 01/Set, margem de 2pp, BR-07065/2026). A casa publicou DOIS cenários de 1º turno, um com Pablo Marçal e outro sem, e um cenário espontâneo. Ela o dá em 30% no cenário com Marçal e em 29% no cenário sem, contra 31% na rodada da mesma casa de 14/Ago, e 20% no espontâneo. No 2º turno ele fica a 1 ponto do líder, 41% contra 42%, e essa distância era de 5pp em 05/Ago e de 3pp em 14/Ago na mesma casa. Rejeição de 55%, a maior entre os treze nomes testados. NO PREÇO, leitura confirmada de 02/Set, 20:26 BRT (23:26 UTC), em 40,65% (vol USD 9,48M acumulado), ALTA de 1,70pp.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "ALTA de 1,70pp, para 40,65% (vol USD 9,48M acumulado), leitura confirmada de 02/Set, 20:26 BRT (23:26 UTC). É o único movimento de alta entre os nomes do presidencial acima do piso, e como o líder ficou parado a distância entre os dois caiu para 14,85pp. AS DUAS MEDIÇÕES APONTAM PARA LADOS DIFERENTES NO MESMO DIA: no 1º turno ele cedeu dentro da própria casa, de 31% para 29% ou 30%, e no 2º turno encostou a 1 ponto, fechando três rodadas seguidas da Quaest em que essa distância só encolheu. O contrato pergunta quem vence a eleição, não quem lidera o 1º turno. Chamou o encontro de André Mendonça com Daniel Vorcaro de cortina de fumaça e defendeu o ministro, segundo Poder360 e O Globo."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "2,20%",
    poll: "A ÚNICA NACIONAL DESTA QUARTA É A GENIAL/QUAEST (n=2.004, campo 30/Ago a 01/Set, margem de 2pp, BR-07065/2026). A casa publicou DOIS cenários de 1º turno, um com Pablo Marçal e outro sem, e um cenário espontâneo. Ela o mede em 3% nos dois cenários estimulados, contra 4% na rodada da mesma casa de 14/Ago. Num 2º turno perde para o líder por 43% a 36%, margem de 7 pontos que é exatamente a mesma medida pela Real Time Big Data na véspera, e é o único par em que as duas casas da semana coincidem. Rejeição de 28%. NO PREÇO, leitura confirmada de 02/Set, 20:26 BRT (23:26 UTC), em 2,20% (vol USD 12,36M acumulado), QUEDA de 0,35pp.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "QUEDA de 0,35pp, para 2,20% (vol USD 12,36M acumulado), leitura confirmada de 02/Set, 20:26 BRT (23:26 UTC). No contrato de 3º lugar do 1º turno caiu 2,00pp, para 28,00%, e a distância para Augusto Cury, que está em 52,40%, quase dobrou. AS REDES DELE VOLTARAM AO AR nesta quarta, depois de a decisão que travava a campanha digital ter sido revista em 01/Set, segundo G1. Protocolou pedido de impeachment contra Alexandre de Moraes e Dias Toffoli, segundo G1. Na urna declarada ele cedeu de 4% para 3% dentro da própria casa, no mesmo intervalo em que Augusto Cury saiu de 2% para 10%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "A única nacional desta quarta não o testa em cenário presidencial de 1º turno. NO PREÇO, ele está em 0,05% (vol USD 7,42M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5% que o painel usa para separar preço de ruído, e esta rodada não publica preço novo para ele.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Ele está em 0,05% (vol USD 7,42M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%, e esta rodada não publica preço novo para ele. Não é candidato à Presidência: disputa o governo de São Paulo. O preço presidencial dele é resíduo de livro, não medida de campanha."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,25%",
    poll: "A ÚNICA NACIONAL DESTA QUARTA É A GENIAL/QUAEST (n=2.004, campo 30/Ago a 01/Set, margem de 2pp, BR-07065/2026). A casa publicou DOIS cenários de 1º turno, um com Pablo Marçal e outro sem, e um cenário espontâneo. Ela o coloca em 1% no 1º turno, contra 4% na rodada da mesma casa de 14/Ago. NUM 2º TURNO ELE PERDE PARA O LÍDER, POR 42% A 37%, e a Real Time Big Data de 01/Set, com campo que se sobrepõe, o dava à frente por 45% a 43%: são 7pp de diferença na margem do mesmo par entre duas casas que mediram a mesma semana. Rejeição de 40%. NO PREÇO, ele está em 0,25% (vol USD 7,05M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%, e esta rodada não publica preço novo para ele nesse contrato.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "Ele está em 0,25% (vol USD 7,05M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%, e esta rodada não publica preço novo para ele nesse contrato. No contrato de 3º LUGAR do 1º turno, que é outro mercado, ele CAIU 4,50pp e está em 8,50% (vol USD 110 mil). O CENÁRIO QUE O COLOCAVA À FRENTE DO LÍDER NA VÉSPERA NÃO SE REPRODUZIU: a casa seguinte, com campo sobreposto, o coloca 5 pontos atrás. O painel registra as duas leituras e não escolhe entre elas. Reagiu ao 1% da pesquisa dizendo que o eleitor ainda está conhecendo os candidatos, segundo O Globo."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,15%",
    poll: "A ÚNICA NACIONAL DESTA QUARTA É A GENIAL/QUAEST (n=2.004, campo 30/Ago a 01/Set, margem de 2pp, BR-07065/2026). A casa publicou DOIS cenários de 1º turno, um com Pablo Marçal e outro sem, e um cenário espontâneo. Ela o mede em 1% no 1º turno, contra 2% na rodada da mesma casa de 14/Ago. Num 2º turno perde para o líder por 44% a 33%, margem de 11 pontos, e a Real Time Big Data de 01/Set mediu o mesmo par em 43% a 40%, margem de 3: são 8pp de diferença, a maior entre os pares que as duas casas testaram. Rejeição de 38%. NO PREÇO, ele está em 0,15% (vol USD 6,47M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Ele está em 0,15% (vol USD 6,47M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%, e esta rodada não publica preço novo para ele nesse contrato. No contrato de 3º LUGAR do 1º turno, que é outro mercado, está em 0,80% (vol USD 49 mil). O par de 2º turno dele contra o líder é onde as duas casas desta semana mais discordam, com 8pp de diferença na margem."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "A única nacional desta quarta não o testa em cenário presidencial de 1º turno. NO PREÇO, ele está em 0,05% (vol USD 14,07M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5% que o painel usa para separar preço de ruído, e esta rodada não publica preço novo para ele.",
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
