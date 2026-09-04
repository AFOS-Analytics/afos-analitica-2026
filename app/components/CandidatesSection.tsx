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
    poll: "A ÚLTIMA NACIONAL COM NÚMEROS PUBLICADOS SEGUE SENDO A DATAFOLHA DE 03/Set (n=2.002, campo 01 a 03/Set, margem de 2pp, BR-03669/2026). NENHUMA PESQUISA NACIONAL FOI DIVULGADA EM 04/Set, e o registro do TSE mostra por quê: sete nacionais estão em campo neste momento e a primeira divulgação marcada é 06/Set. Ela lhe dá 39% no cenário com Pablo Marçal e 38% no cenário sem. No 2º turno vence o segundo colocado por 46% a 44%, Ronaldo Caiado por 46% a 41% e Romeu Zema por 48% a 39%. Avaliação do governo: 45% aprovam e 51% desaprovam. NO PREÇO, leitura confirmada de 04/Set, 19:07 BRT (22:07 UTC), em 55,50% (vol USD 9,72M acumulado), ALTA de 1,00pp.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "ALTA de 1,00pp, para 55,50% (vol USD 9,72M acumulado), leitura confirmada de 04/Set, 19:07 BRT (22:07 UTC). A DISTÂNCIA PARA O SEGUNDO REABRIU 3,70pp, de 11,65pp para 15,35pp, depois de encolher em quatro leituras seguidas. E ISSO ACONTECEU NUM DIA SEM NENHUMA PESQUISA NACIONAL NOVA, ou seja, sem informação de intenção de voto entrando no mercado. O painel registra a coincidência de datas e não atribui causa. No contrato de 2º lugar do 1º turno, porém, ele cedeu 4,70pp e está em 5,80% (vol USD 467 mil). Afirmou ter dito a Donald Trump que o Brasil não aceita ingerência nas eleições, segundo G1 e Gazeta do Povo."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "40,15%",
    poll: "A ÚLTIMA NACIONAL COM NÚMEROS PUBLICADOS SEGUE SENDO A DATAFOLHA DE 03/Set (n=2.002, campo 01 a 03/Set, margem de 2pp, BR-03669/2026). NENHUMA PESQUISA NACIONAL FOI DIVULGADA EM 04/Set, e o registro do TSE mostra por quê: sete nacionais estão em campo neste momento e a primeira divulgação marcada é 06/Set. Ela o dá em 32% no cenário com Marçal e em 33% no cenário sem. No 2º turno fica a 2 pontos, 44% contra 46%. AS TRÊS NACIONAIS DA JANELA SEGUEM DISCORDANDO NO SINAL DESSE PAR: a Quaest de 02/Set deu o líder à frente por 42% a 41%, a PoderData de 03/Set o deu à frente por 45% a 44%, e a Datafolha dá o líder à frente por 46% a 44%. NO PREÇO, leitura confirmada de 04/Set, 19:07 BRT (22:07 UTC), em 40,15% (vol USD 9,68M acumulado), QUEDA de 2,70pp.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "QUEDA de 2,70pp, para 40,15% (vol USD 9,68M acumulado), leitura confirmada de 04/Set, 19:07 BRT (22:07 UTC), e é a MAIOR VARIAÇÃO de qualquer nome do livro presidencial nesta leitura. A distância para o líder voltou a 15,35pp. OS DOIS CONTRATOS DELE ANDARAM EM SENTIDOS CONTRÁRIOS NA MESMA LEITURA: no de 2º lugar do 1º turno ele SUBIU 4,00pp e está em 87,50% (vol USD 586 mil). São mercados diferentes sobre o mesmo nome, e o painel registra a discordância sem interpretá-la. Disse que a decisão de Edson Fachin na crise do Supremo é luz no fim do túnel, segundo Valor Econômico."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "1,85%",
    poll: "A ÚLTIMA NACIONAL COM NÚMEROS PUBLICADOS SEGUE SENDO A DATAFOLHA DE 03/Set (n=2.002, campo 01 a 03/Set, margem de 2pp, BR-03669/2026). NENHUMA PESQUISA NACIONAL FOI DIVULGADA EM 04/Set, e o registro do TSE mostra por quê: sete nacionais estão em campo neste momento e a primeira divulgação marcada é 06/Set. Ela o mede em 4% no cenário com Marçal e 3% no cenário sem. A DISPERSÃO ENTRE CASAS NESTA JANELA VAI DE 3% A 7,6%: 3% na Genial/Quaest e na PoderData, 3% a 4% na Datafolha, 6% na Real Time Big Data de 01/Set e 7,6% na AtlasIntel de 31/Ago. NO PREÇO, leitura confirmada de 04/Set, 19:07 BRT (22:07 UTC), em 1,85% (vol USD 12,64M acumulado), ALTA de 0,10pp.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "ALTA de 0,10pp, para 1,85% (vol USD 12,64M acumulado), leitura confirmada de 04/Set, 19:07 BRT (22:07 UTC). No contrato de 3º lugar do 1º turno subiu 1,50pp e passa a 23,50% num contrato de USD 277 mil, recuperando parte dos 4,50pp que tinha cedido na leitura anterior, contra 54,65% de Augusto Cury no mesmo mercado. Entre os quatro nomes acima de 1% no contrato de vencedor, é o de maior volume acumulado, acima do líder e do segundo colocado, num contrato precificado abaixo de 2%. O pedido de impeachment que ele protocolou contra Alexandre de Moraes e Dias Toffoli segue em tramitação, segundo Gazeta do Povo."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "A última nacional com números publicados, a Datafolha de 03/Set, não o testa em cenário presidencial de 1º turno, e nenhuma pesquisa nacional foi divulgada em 04/Set. NO PREÇO, ele está em 0,05% (vol USD 7,43M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5% que o painel usa para separar preço de ruído, e esta rodada não publica preço novo para ele.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Ele está em 0,05% (vol USD 7,43M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%, e esta rodada não publica preço novo para ele. Não é candidato à Presidência: disputa o governo de São Paulo. O preço presidencial dele é resíduo de livro, não medida de campanha."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,15%",
    poll: "A ÚLTIMA NACIONAL COM NÚMEROS PUBLICADOS SEGUE SENDO A DATAFOLHA DE 03/Set (n=2.002, campo 01 a 03/Set, margem de 2pp, BR-03669/2026). NENHUMA PESQUISA NACIONAL FOI DIVULGADA EM 04/Set, e o registro do TSE mostra por quê: sete nacionais estão em campo neste momento e a primeira divulgação marcada é 06/Set. Ela o coloca em 4% nos dois cenários de 1º turno e o dá perdendo o 2º turno por 46% a 41%. O 2º TURNO CONTRA ELE JÁ TEM QUATRO RESULTADOS DIFERENTES NA MESMA SEMANA: 46% a 41% na Datafolha de 03/Set, 44% a 42% na PoderData do mesmo dia, 42% a 37% na Genial/Quaest de 02/Set e 45% a 43% a favor dele na Real Time Big Data de 01/Set. NO PREÇO, ele está em 0,15% (vol USD 7,15M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%, e esta rodada não publica preço novo para ele nesse contrato.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "Ele está em 0,15% (vol USD 7,15M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%, e esta rodada não publica preço novo para ele nesse contrato. No contrato de 3º LUGAR do 1º turno, que é outro mercado, ele CEDEU 0,50pp e está em 9,50% (vol USD 114 mil), leitura confirmada de 04/Set, 19:07 BRT (22:07 UTC). AS QUATRO CASAS DA SEMANA DÃO QUATRO RESULTADOS PARA O MESMO PAR DE 2º TURNO, e o painel registra os quatro sem escolher entre eles. Levou a crise do Supremo à propaganda de TV e participou de sabatina da Folha e do UOL nesta sexta, segundo Folha de S.Paulo."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,15%",
    poll: "A ÚLTIMA NACIONAL COM NÚMEROS PUBLICADOS SEGUE SENDO A DATAFOLHA DE 03/Set (n=2.002, campo 01 a 03/Set, margem de 2pp, BR-03669/2026). NENHUMA PESQUISA NACIONAL FOI DIVULGADA EM 04/Set, e o registro do TSE mostra por quê: sete nacionais estão em campo neste momento e a primeira divulgação marcada é 06/Set. Ela o mede em 2% nos dois cenários de 1º turno e o dá perdendo o 2º turno por 48% a 39%, margem de 9 pontos. As quatro casas da semana mediram esse par em 3, 11, 2 e 9 pontos, e é o par com a maior dispersão entre casas da janela. NO PREÇO, ele está em 0,15% (vol USD 6,55M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Ele está em 0,15% (vol USD 6,55M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5%, e esta rodada não publica preço novo para ele nesse contrato. No contrato de 3º LUGAR do 1º turno, que é outro mercado, está em 0,70% (vol USD 49 mil), leitura confirmada de 04/Set, 19:07 BRT (22:07 UTC). O par de 2º turno dele contra o líder é onde as casas da semana mais discordam: as margens contra ele foram de 11, 3, 2 e 9 pontos."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "A última nacional com números publicados, a Datafolha de 03/Set, não o testa em cenário presidencial de 1º turno, e nenhuma pesquisa nacional foi divulgada em 04/Set. NO PREÇO, ele está em 0,05% (vol USD 14,07M acumulado) no contrato de VENCEDOR, abaixo do corte de 0,5% que o painel usa para separar preço de ruído, e esta rodada não publica preço novo para ele.",
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
