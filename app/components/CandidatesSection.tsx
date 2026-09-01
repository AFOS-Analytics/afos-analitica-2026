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
    poll: "A ÚNICA NACIONAL DESTA TERÇA É A REAL TIME BIG DATA (n=2.000, campo 27 a 31/Ago, margem de 2pp, BR-03490/2026), a primeira do painel cujo campo alcança 31/Ago. A casa publicou DOIS cenários de 1º turno, um com Pablo Marçal e outro sem. Ela lhe dá 38% nos dois cenários. No 2º turno empata com o segundo colocado em 44% a 44%, e PERDE PARA RONALDO CAIADO POR 45% A 43%. Contra Romeu Zema vence por 43% a 40%, contra Renan Santos por 44% a 37% e contra Pablo Marçal por 44% a 40%. Rejeição de 50%, empatada com a do segundo colocado. NO PREÇO, leitura confirmada de 01/Set, 20:34 BRT (23:34 UTC), em 55,50% (vol USD 9,56M acumulado), SEM VARIAÇÃO.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "SEM VARIAÇÃO, em 55,50% (vol USD 9,56M acumulado), leitura confirmada de 01/Set, 20:34 BRT (23:34 UTC). O preço dele não sai de 55,50% pelo quarto dia seguido. A distância para o segundo colocado abriu para 16,55pp, contra 16,45pp na véspera, e a abertura veio do lado do adversário. NA URNA DECLARADA ELE APARECE ATRÁS NUM 2º TURNO PELA PRIMEIRA VEZ CONTRA UM NOME QUE NÃO É O SEGUNDO COLOCADO: perde para Ronaldo Caiado por 45% a 43%. Nas 41 simulações de 2º turno da base do painel ele já ficou atrás em quatro, e as quatro eram contra o mesmo adversário. A propaganda dele que usava o Rap do Silva foi suspensa por não apresentar o vice, segundo Estadão, CartaCapital e Metrópoles."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "38,95%",
    poll: "A ÚNICA NACIONAL DESTA TERÇA É A REAL TIME BIG DATA (n=2.000, campo 27 a 31/Ago, margem de 2pp, BR-03490/2026), a primeira do painel cujo campo alcança 31/Ago. A casa publicou DOIS cenários de 1º turno, um com Pablo Marçal e outro sem. Ela o dá em 29% no cenário com Marçal e em 30% no cenário sem, abaixo dos 33,7% da AtlasIntel e dos 33% da BTG/Nexus, as duas de 31/Ago. No 2º turno ele empata com o líder em 44% a 44%, depois de aparecer atrás nas duas leituras da véspera. Rejeição de 50%, empatada com a do líder. NO PREÇO, leitura confirmada de 01/Set, 20:34 BRT (23:34 UTC), em 38,95% (vol USD 9,43M acumulado), QUEDA de 0,10pp.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "QUEDA de 0,10pp, para 38,95% (vol USD 9,43M acumulado), leitura confirmada de 01/Set, 20:34 BRT (23:34 UTC). Depois de ceder 2,05pp na véspera, ele reteve quase toda a posição nesta terça. No contrato de 2º lugar do 1º turno SUBIU 0,50pp, para 86,00%, ou seja, o mercado tratou o dia como confirmação da chegada dele ao returno. Cobrou a saída do ministro citado na apuração da Polícia Federal, segundo Folha de S.Paulo, e pediu o afastamento dele junto com a oposição, segundo Tribuna do Sertão. Um pedido para afastá-lo do mandato de senador foi levado ao Supremo, segundo Folha de S.Paulo."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "2,55%",
    poll: "A ÚNICA NACIONAL DESTA TERÇA É A REAL TIME BIG DATA (n=2.000, campo 27 a 31/Ago, margem de 2pp, BR-03490/2026), a primeira do painel cujo campo alcança 31/Ago. A casa publicou DOIS cenários de 1º turno, um com Pablo Marçal e outro sem. Ela o mede em 6% no cenário com Marçal, entre os 3% da BTG/Nexus e os 7,6% da AtlasIntel, as duas de 31/Ago. Num 2º turno perde para o líder por 44% a 37%. Rejeição de 40%. NO PREÇO, leitura confirmada de 01/Set, 20:34 BRT (23:34 UTC), em 2,55% (vol USD 12,30M acumulado), ALTA de 0,70pp.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "ALTA de 0,70pp, para 2,55% (vol USD 12,30M acumulado), leitura confirmada de 01/Set, 20:34 BRT (23:34 UTC). É a maior variação entre os nomes do presidencial nesta rodada, e ela devolve mais do que a queda de 0,40pp da véspera. A DECISÃO QUE TRAVAVA A CAMPANHA DELE FOI REVISTA: Dias Toffoli liberou a propaganda eleitoral da chapa nas redes, segundo Folha de S.Paulo, revertendo a suspensão que também atingia repasse de recursos e direito a debate. A decisão anterior foi criticada dentro do TSE, segundo G1. Em contrapartida ele perdeu a liderança do contrato de 3º lugar do 1º turno para Augusto Cury, e está em 30,00% contra 46,65%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "A única nacional desta terça não o testa em cenário presidencial de 1º turno. NO PREÇO, esta rodada não publica preço novo para ele: o último publicado é o de 30/Ago, 16:40 BRT, em 0,05% (vol USD 7,41M acumulado), abaixo do corte de 0,5% que o painel usa para separar preço de ruído.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Esta rodada não publica preço novo para ele, e o último publicado é o de 30/Ago, 16:40 BRT, em 0,05% (vol USD 7,41M acumulado), abaixo do corte de 0,5%. Não é candidato à Presidência: disputa o governo de São Paulo. Disse que não há amigos e inimigos no caso do banco e defendeu a apuração sobre o envolvimento do empresário com o Supremo, segundo Folha de S.Paulo. O preço presidencial dele é resíduo de livro, não medida de campanha."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,25%",
    poll: "A ÚNICA NACIONAL DESTA TERÇA É A REAL TIME BIG DATA (n=2.000, campo 27 a 31/Ago, margem de 2pp, BR-03490/2026), a primeira do painel cujo campo alcança 31/Ago. A casa publicou DOIS cenários de 1º turno, um com Pablo Marçal e outro sem. Ela o coloca em 4% no 1º turno, atrás de Augusto Cury e de Renan Santos. NUM 2º TURNO ELE VENCE O LÍDER, POR 45% A 43%: nas 41 simulações de 2º turno da base do painel o líder já ficou atrás em quatro, e as quatro eram contra o segundo colocado, então é a primeira vez que um nome fora dele aparece à frente. Rejeição de 39%, onze pontos abaixo da dos dois primeiros. NO PREÇO, esta rodada não publica preço novo para ele: ele está em 0,25% (vol USD 7,03M acumulado), abaixo do corte de 0,5%.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "Esta rodada não publica preço novo para ele, e ele segue abaixo do corte de 0,5%, em 0,25% (vol USD 7,03M acumulado). É O NOME QUE PRODUZIU O NÚMERO MAIS FORTE DA RODADA, e ele é de pesquisa e não de preço: com 4% no 1º turno, aparece à frente do líder num 2º turno simulado, por 45% a 43%. A leitura correta não é que ele esteja competitivo, é que o eleitorado que rejeita o líder tem menos resistência a ele do que ao segundo colocado, cuja rejeição é de 50% contra 39% dele. O preço não reage porque o contrato mede chance de vencer a eleição, e para vencer é preciso primeiro chegar ao 2º turno, que é onde os 4% o deixam de fora."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,05%",
    poll: "A ÚNICA NACIONAL DESTA TERÇA É A REAL TIME BIG DATA (n=2.000, campo 27 a 31/Ago, margem de 2pp, BR-03490/2026), a primeira do painel cujo campo alcança 31/Ago. A casa publicou DOIS cenários de 1º turno, um com Pablo Marçal e outro sem. Ela o mede em 2% no 1º turno. Num 2º turno perde para o líder por 43% a 40%, distância de 3 pontos, a mais estreita entre os cenários em que o líder vence. Rejeição de 36%, a menor da tabela depois da de Augusto Cury. NO PREÇO, esta rodada não publica preço novo para ele: o último publicado é o de 30/Ago, 16:40 BRT, em 0,05% (vol USD 6,37M acumulado).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Esta rodada não publica preço novo para ele, e o último publicado é o de 30/Ago, 16:40 BRT, em 0,05% (vol USD 6,37M acumulado), abaixo do corte de 0,5%. No contrato de 3º lugar do 1º turno está em 0,80%. Cobrou publicamente a saída do ministro citado na apuração da Polícia Federal, segundo Folha de S.Paulo, e aparece no noticiário da terça por esse tema e não por agenda própria de campanha."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "A única nacional desta terça não o testa em cenário presidencial de 1º turno. NO PREÇO, esta rodada não publica preço novo para ele: o último publicado é o de 30/Ago, 16:40 BRT, em 0,05% (vol USD 14,06M acumulado), abaixo do corte de 0,5% que o painel usa para separar preço de ruído.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Esta rodada não publica preço novo para ele, e o último publicado é o de 30/Ago, 16:40 BRT, em 0,05% (vol USD 14,06M acumulado), abaixo do corte de 0,5%. Não é candidato à Presidência: disputa a reeleição em São Paulo. O livro dele é o maior do painel em volume acumulado, USD 14,06M, num contrato que paga 0,05%, e essa combinação é a assinatura de um mercado que já resolveu a pergunta."
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
