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
    poll: "A ÚLTIMA NACIONAL COM NÚMEROS PUBLICADOS SEGUE SENDO A DATAFOLHA DE 03/Set (n=2.002, campo 01 a 03/Set, margem de 2pp, BR-03669/2026). NENHUMA PESQUISA NACIONAL FOI DIVULGADA EM 04 NEM EM 05/Set, e o registro do TSE mostra por quê: oito nacionais estão em campo neste momento e as divulgações marcadas vão de 06 a 10/Set. Ela lhe dá 39% no cenário com Pablo Marçal e 38% no cenário sem. No 2º turno vence o segundo colocado por 46% a 44%, Ronaldo Caiado por 46% a 41% e Romeu Zema por 48% a 39%. Avaliação do governo: 45% aprovam e 51% desaprovam. NO PREÇO, esta rodada não publica valor novo para o contrato de vencedor, que segue em 55,50% (vol USD 9,76M acumulado) pela leitura confirmada de 04/Set, 19:53 BRT. No contrato de 2º lugar do 1º turno ele CEDEU 2,25pp e está em 5,35% (vol USD 470 mil), leitura confirmada de 05/Set, 13:29 BRT.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "O contrato de vencedor não recebeu preço novo nesta rodada e segue em 55,50% (vol USD 9,76M acumulado), leitura confirmada de 04/Set, 19:53 BRT. O QUE SE MOVEU FOI O CONTRATO DE 2º LUGAR DO 1º TURNO, em que ele CEDEU 2,25pp e está em 5,35% (vol USD 470 mil), segunda queda seguida nesse mercado, leitura confirmada de 05/Set, 13:29 BRT. São mercados diferentes: um mede quem vence a eleição e o outro mede quem termina o 1º turno em segundo. Reuniu-se com o presidente do Supremo antes de evento no Planalto e os dois trataram da crise no tribunal, segundo Valor Econômico e Folha de S.Paulo."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "40,15%",
    poll: "A ÚLTIMA NACIONAL COM NÚMEROS PUBLICADOS SEGUE SENDO A DATAFOLHA DE 03/Set (n=2.002, campo 01 a 03/Set, margem de 2pp, BR-03669/2026). NENHUMA PESQUISA NACIONAL FOI DIVULGADA EM 04 NEM EM 05/Set, e o registro do TSE mostra por quê: oito nacionais estão em campo neste momento e as divulgações marcadas vão de 06 a 10/Set. Ela o dá em 32% no cenário com Marçal e em 33% no cenário sem. No 2º turno fica a 2 pontos, 44% contra 46%. AS TRÊS NACIONAIS DA JANELA SEGUEM DISCORDANDO NO SINAL DESSE PAR: a Quaest de 02/Set deu o líder à frente por 42% a 41%, a PoderData de 03/Set o deu à frente por 45% a 44%, e a Datafolha dá o líder à frente por 46% a 44%. NO PREÇO, esta rodada não publica valor novo para o contrato de vencedor, que segue em 40,15% (vol USD 9,69M acumulado) pela leitura confirmada de 04/Set, 19:53 BRT. No contrato de 2º lugar do 1º turno ele SUBIU 2,00pp e está em 89,50% (vol USD 597 mil), leitura confirmada de 05/Set, 13:29 BRT.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "O contrato de vencedor não recebeu preço novo nesta rodada e segue em 40,15% (vol USD 9,69M acumulado), leitura confirmada de 04/Set, 19:53 BRT. NO CONTRATO DE 2º LUGAR DO 1º TURNO ELE SUBIU 2,00pp E CHEGOU A 89,50% (vol USD 597 mil), o valor mais alto que esta página já registrou nesse livro, leitura confirmada de 05/Set, 13:29 BRT. Um mercado mede quem vence a eleição e o outro mede quem termina o 1º turno em segundo, e o painel não os soma. Disse que o presidente do Senado e Alexandre de Moraes buscam autoproteção, segundo Folha de S.Paulo, e que Moraes não tem condição de seguir no Supremo, segundo Correio Braziliense."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "1,85%",
    poll: "A ÚLTIMA NACIONAL COM NÚMEROS PUBLICADOS SEGUE SENDO A DATAFOLHA DE 03/Set (n=2.002, campo 01 a 03/Set, margem de 2pp, BR-03669/2026). NENHUMA PESQUISA NACIONAL FOI DIVULGADA EM 04 NEM EM 05/Set, e o registro do TSE mostra por quê: oito nacionais estão em campo neste momento e as divulgações marcadas vão de 06 a 10/Set. Ela o mede em 4% no cenário com Marçal e 3% no cenário sem. A DISPERSÃO ENTRE CASAS NESTA JANELA VAI DE 3% A 7,6%: 3% na Genial/Quaest e na PoderData, 3% a 4% na Datafolha, 6% na Real Time Big Data de 01/Set e 7,6% na AtlasIntel de 31/Ago. NO PREÇO, esta rodada não publica valor novo para o contrato de vencedor, que segue em 1,85% (vol USD 12,68M acumulado) pela leitura confirmada de 04/Set, 19:53 BRT. No contrato de 3º lugar do 1º turno ele SUBIU 1,00pp e está em 24,50% (vol USD 278 mil), leitura confirmada de 05/Set, 13:29 BRT.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "O contrato de vencedor não recebeu preço novo nesta rodada e segue em 1,85% (vol USD 12,68M acumulado), leitura confirmada de 04/Set, 19:53 BRT. No contrato de 3º lugar do 1º turno subiu 1,00pp e passa a 24,50% num contrato de USD 278 mil, segunda alta seguida, contra 51,95% de Augusto Cury no mesmo mercado, que cedeu 1,60pp. Entre os quatro nomes acima de 1% no contrato de vencedor, é o de maior volume acumulado, acima do líder e do segundo colocado, num contrato precificado abaixo de 2%. O pedido de impeachment que ele protocolou contra Alexandre de Moraes e Dias Toffoli segue em tramitação, segundo Gazeta do Povo."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "A última nacional com números publicados, a Datafolha de 03/Set, não o testa em cenário presidencial de 1º turno, e nenhuma pesquisa nacional foi divulgada em 04 nem em 05/Set. NO PREÇO, ele está em 0,05% (vol USD 7,43M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5% que o painel usa para separar preço de ruído, e esta rodada não publica preço novo para ele.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Ele está em 0,05% (vol USD 7,43M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%, e esta rodada não publica preço novo para ele. Não é candidato à Presidência: disputa o governo de São Paulo. O preço presidencial dele é resíduo de livro, não medida de campanha."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,15%",
    poll: "A ÚLTIMA NACIONAL COM NÚMEROS PUBLICADOS SEGUE SENDO A DATAFOLHA DE 03/Set (n=2.002, campo 01 a 03/Set, margem de 2pp, BR-03669/2026). NENHUMA PESQUISA NACIONAL FOI DIVULGADA EM 04 NEM EM 05/Set, e o registro do TSE mostra por quê: oito nacionais estão em campo neste momento e as divulgações marcadas vão de 06 a 10/Set. Ela o coloca em 4% nos dois cenários de 1º turno e o dá perdendo o 2º turno por 46% a 41%. O 2º TURNO CONTRA ELE JÁ TEM QUATRO RESULTADOS DIFERENTES NA MESMA SEMANA: 46% a 41% na Datafolha de 03/Set, 44% a 42% na PoderData do mesmo dia, 42% a 37% na Genial/Quaest de 02/Set e 45% a 43% a favor dele na Real Time Big Data de 01/Set. NO PREÇO, ele está em 0,15% (vol USD 7,15M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%, e esta rodada não publica preço novo para ele nesse contrato.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "Ele está em 0,15% (vol USD 7,15M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%, e esta rodada não publica preço novo para ele nesse contrato. No contrato de 3º LUGAR do 1º turno, que é outro mercado, ele SUBIU 0,50pp e está em 9,50% (vol USD 114 mil), leitura confirmada de 05/Set, 13:29 BRT. AS QUATRO CASAS DA SEMANA DÃO QUATRO RESULTADOS PARA O MESMO PAR DE 2º TURNO, e o painel registra os quatro sem escolher entre eles. Levou a crise do Supremo à propaganda de TV e participou de sabatina da Folha e do UOL nesta sexta, segundo Folha de S.Paulo."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,15%",
    poll: "A ÚLTIMA NACIONAL COM NÚMEROS PUBLICADOS SEGUE SENDO A DATAFOLHA DE 03/Set (n=2.002, campo 01 a 03/Set, margem de 2pp, BR-03669/2026). NENHUMA PESQUISA NACIONAL FOI DIVULGADA EM 04 NEM EM 05/Set, e o registro do TSE mostra por quê: oito nacionais estão em campo neste momento e as divulgações marcadas vão de 06 a 10/Set. Ela o mede em 2% nos dois cenários de 1º turno e o dá perdendo o 2º turno por 48% a 39%, margem de 9 pontos. As quatro casas da semana mediram esse par em 3, 11, 2 e 9 pontos, e é o par com a maior dispersão entre casas da janela. NO PREÇO, ele está em 0,15% (vol USD 6,55M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Ele está em 0,15% (vol USD 6,55M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%, e esta rodada não publica preço novo para ele nesse contrato. No contrato de 3º LUGAR do 1º turno, que é outro mercado, está em 0,70% (vol USD 49 mil), leitura confirmada de 05/Set, 13:29 BRT. O par de 2º turno dele contra o líder é onde as casas da semana mais discordam: as margens contra ele foram de 11, 3, 2 e 9 pontos."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "A última nacional com números publicados, a Datafolha de 03/Set, não o testa em cenário presidencial de 1º turno, e nenhuma pesquisa nacional foi divulgada em 04 nem em 05/Set. NO PREÇO, ele está em 0,05% (vol USD 14,07M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5% que o painel usa para separar preço de ruído, e esta rodada não publica preço novo para ele.",
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
