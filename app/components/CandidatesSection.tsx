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
    polymarket: "54,50%",
    poll: "A NACIONAL DE FECHAMENTO DESTA QUINTA É A DATAFOLHA (n=2.002, campo 01 a 03/Set, margem de 2pp, BR-03669/2026), a terceira nacional em 48 horas. Ela lhe dá 39% no cenário com Pablo Marçal e 38% no cenário sem, contra 39% nos dois cenários da rodada da mesma casa de 21/Ago. No 2º turno vence o segundo colocado por 46% a 44%, Ronaldo Caiado por 46% a 41% e Romeu Zema por 48% a 39%. Avaliação do governo: 45% aprovam e 51% desaprovam. NO PREÇO, leitura confirmada de 03/Set, 23:45 BRT (04/Set, 02:45 UTC), em 54,50% (vol USD 9,67M acumulado), SEM VARIAÇÃO.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "SEM VARIAÇÃO, em 54,50% (vol USD 9,67M acumulado), leitura confirmada de 03/Set, 23:45 BRT (04/Set, 02:45 UTC). O preço dele não se move há mais de oito horas. A distância para o segundo colocado CAIU para 11,65pp, contra 12,00pp às 17:28 e 16,55pp em 01/Set, e encolheu nas quatro leituras seguidas, sempre por movimento do outro lado. NA URNA DECLARADA, A DATAFOLHA REDUZ PELA METADE A DISTÂNCIA DO 2º TURNO DENTRO DA PRÓPRIA CASA: 46% a 44%, contra 47% a 43% em 21/Ago. Declarou zerada a fila do INSS em cerimônia no Planalto, com 261 mil pedidos acima de 45 dias ainda em aberto, segundo Metrópoles e Poder360."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "42,85%",
    poll: "A NACIONAL DE FECHAMENTO DESTA QUINTA É A DATAFOLHA (n=2.002, campo 01 a 03/Set, margem de 2pp, BR-03669/2026), a terceira nacional em 48 horas. Ela o dá em 32% no cenário com Marçal e em 33% no cenário sem, os mesmos números da rodada da casa de 21/Ago. No 2º turno encosta a 2 pontos, 44% contra 46%, depois de 43% contra 47% em 21/Ago. AS TRÊS NACIONAIS DA JANELA DISCORDAM NO SINAL DESSE PAR: a Quaest de 02/Set deu o líder à frente por 42% a 41%, a PoderData de 03/Set o deu à frente por 45% a 44%, e a Datafolha dá o líder à frente por 46% a 44%. NO PREÇO, leitura confirmada de 03/Set, 23:45 BRT (04/Set, 02:45 UTC), em 42,85% (vol USD 9,64M acumulado), ALTA de 0,35pp.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "ALTA de 0,35pp, para 42,85% (vol USD 9,64M acumulado), leitura confirmada de 03/Set, 23:45 BRT (04/Set, 02:45 UTC), e foi o ÚNICO dos dezenove nomes do livro presidencial a se mover desde a leitura das 17:28. A distância para o líder caiu para 11,65pp. No contrato de 2º lugar do 1º turno, porém, ele cedeu 2,00pp e está em 83,50%, a maior cessão dele em qualquer contrato nesta leitura. Usou a crise no Supremo para tentar impulsionar o ato de 7 de Setembro, segundo Folha de S.Paulo."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "1,75%",
    poll: "A ÚNICA NACIONAL COM NÚMEROS PUBLICADOS NESTA QUINTA É A PODERDATA (n=3.000, campo 30/Ago a 02/Set, margem de 2pp, BR-07561/2026, contratante o próprio instituto). Outras duas tinham divulgação marcada no registro do TSE, a Datafolha e a 100 Cidades, e nenhuma das duas tinha números publicados no momento desta leitura. Ela o mede em 3% no 1º turno, contra 4% na rodada da mesma casa de 27/Ago. Num 2º turno perde para o líder por 44% a 39%, e a mesma casa media 44% a 37% em 27/Ago, ou seja, a margem contra ele encolheu 2 pontos dentro da casa. NO PREÇO, leitura confirmada de 03/Set, 15:22 BRT (18:22 UTC), em 1,75% (vol USD 12,48M acumulado), QUEDA de 0,45pp.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "QUEDA de 0,45pp, para 1,75% (vol USD 12,48M acumulado), leitura confirmada de 03/Set, 15:22 BRT (18:22 UTC). No contrato de 3º lugar do 1º turno caiu 1,00pp e passa a 27,00% num contrato de USD 266 mil, contra 55,85% de Augusto Cury no mesmo mercado. NA URNA DECLARADA ELE CEDEU de 4% em 27/Ago para 3%, no mesmo intervalo em que Augusto Cury saiu de 4% para 10% dentro do mesmo instituto. O único lugar em que ele melhora é o 2º turno contra o líder, onde a margem contra ele caiu de 7 para 5 pontos dentro da casa. Pediu impeachment de Alexandre de Moraes e de Dias Toffoli no Senado, segundo Poder360."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "A nacional desta quinta não o testa em cenário presidencial de 1º turno. NO PREÇO, ele está em 0,05% (vol USD 7,43M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5% que o painel usa para separar preço de ruído, e esta rodada não publica preço novo para ele.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Ele está em 0,05% (vol USD 7,43M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%, e esta rodada não publica preço novo para ele. Não é candidato à Presidência: disputa o governo de São Paulo. O preço presidencial dele é resíduo de livro, não medida de campanha."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,25%",
    poll: "A ÚNICA NACIONAL COM NÚMEROS PUBLICADOS NESTA QUINTA É A PODERDATA (n=3.000, campo 30/Ago a 02/Set, margem de 2pp, BR-07561/2026, contratante o próprio instituto). Outras duas tinham divulgação marcada no registro do TSE, a Datafolha e a 100 Cidades, e nenhuma das duas tinha números publicados no momento desta leitura. Ela o coloca em 2% no 1º turno, contra 4% na rodada da mesma casa de 27/Ago. Num 2º turno perde para o líder por 44% a 42%. O 2º TURNO CONTRA ELE JÁ TEM TRÊS RESULTADOS DIFERENTES NA MESMA SEMANA, todos com campo sobreposto: 44% a 42% aqui, 42% a 37% na Genial/Quaest de 02/Set e 45% a 43% a favor dele na Real Time Big Data de 01/Set. NO PREÇO, ele está em 0,25% (vol USD 7,11M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%, e esta rodada não publica preço novo para ele nesse contrato.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "Ele está em 0,25% (vol USD 7,11M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%, e esta rodada não publica preço novo para ele nesse contrato. No contrato de 3º LUGAR do 1º turno, que é outro mercado, ele SUBIU 2,50pp e está em 11,00% (vol USD 111 mil), o maior movimento de alta do painel nesta rodada. AS TRÊS CASAS DA SEMANA DÃO TRÊS RESULTADOS PARA O MESMO PAR DE 2º TURNO, de 2 pontos atrás do líder a 5 pontos, e o painel registra as três sem escolher entre elas. Defendeu o afastamento de Alexandre de Moraes e o impeachment no Senado, segundo Valor Econômico."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,15%",
    poll: "A ÚNICA NACIONAL COM NÚMEROS PUBLICADOS NESTA QUINTA É A PODERDATA (n=3.000, campo 30/Ago a 02/Set, margem de 2pp, BR-07561/2026, contratante o próprio instituto). Outras duas tinham divulgação marcada no registro do TSE, a Datafolha e a 100 Cidades, e nenhuma das duas tinha números publicados no momento desta leitura. Ela o mede em 1% no 1º turno, contra 2% na rodada da mesma casa de 27/Ago. Num 2º turno perde para o líder por 44% a 42%, margem de 2 pontos. A Genial/Quaest de 02/Set mediu o mesmo par em 44% a 33%, margem de 11, e a Real Time Big Data de 01/Set em 43% a 40%, margem de 3: são três casas e três margens, de 2, 3 e 11 pontos, na mesma semana. NO PREÇO, ele está em 0,15% (vol USD 6,51M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Ele está em 0,15% (vol USD 6,51M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%, e esta rodada não publica preço novo para ele nesse contrato. No contrato de 3º LUGAR do 1º turno, que é outro mercado, está em 0,80% (vol USD 49 mil). O par de 2º turno dele contra o líder é onde as três casas da semana mais discordam: as margens contra ele foram de 11, 3 e 2 pontos em três dias."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "A nacional desta quinta não o testa em cenário presidencial de 1º turno. NO PREÇO, ele está em 0,05% (vol USD 14,07M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5% que o painel usa para separar preço de ruído, e esta rodada não publica preço novo para ele.",
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
