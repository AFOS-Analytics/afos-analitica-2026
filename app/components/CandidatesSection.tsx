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
    poll: "DUAS NACIONAIS DIVULGADAS NESTA SEGUNDA, as primeiras desde a Vox Brasil de 29/Ago: a AtlasIntel/Bloomberg (n=5.014, formulário eletrônico, campo 25 a 30/Ago, BR-07972/2026) e a BTG/Nexus (n=2.005, telefone, campo 28 a 30/Ago, BR-08900/2026). A AtlasIntel lhe dá 43,4% no 1º turno contra 33,7%, distância de 9,7 pontos, e 47,1% no 2º turno contra 42,6%, distância de 4,5 pontos. A BTG/Nexus lhe dá 39% e 46% contra 45%. Rejeição de 52,0% pela AtlasIntel e 49% pela Nexus, e nas duas casas ele é menos rejeitado que o segundo colocado. NO PREÇO, leitura confirmada de 31/Ago, 13:43 BRT (16:43 UTC), em 55,50% (vol USD 9,53M acumulado), SEM VARIAÇÃO.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "SEM VARIAÇÃO, em 55,50% (vol USD 9,53M acumulado), leitura confirmada de 31/Ago, 13:43 BRT (16:43 UTC). O preço dele não sai de 55,50% pelo terceiro dia seguido, em 19 capturas da série desde a tarde de 29/Ago. A distância para o segundo colocado ABRIU para 16,45pp, contra 14,40pp na véspera, e a abertura veio inteira do lado do adversário. É a primeira rodada da semana em que a urna declarada e o preço andam na mesma direção no 1º turno. O TSE suspendeu a peça de propaganda da campanha dele que listava um currículo do adversário citando o Banco Master e a rachadinha, segundo O Globo, Folha de S.Paulo e Terra, e a Justiça Eleitoral suspendeu a que o chamava de funcionário fantasma, segundo G1."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "39,05%",
    poll: "DUAS NACIONAIS DIVULGADAS NESTA SEGUNDA, as primeiras desde a Vox Brasil de 29/Ago: a AtlasIntel/Bloomberg (n=5.014, formulário eletrônico, campo 25 a 30/Ago, BR-07972/2026) e a BTG/Nexus (n=2.005, telefone, campo 28 a 30/Ago, BR-08900/2026). A AtlasIntel o dá em 33,7% no 1º turno, a 9,7 pontos do líder, e em 42,6% no 2º turno, a 4,5 pontos. A BTG/Nexus o dá em 33% e 45%, a 1 ponto no returno e dentro da margem de 2pp, ou seja, empate técnico. Na comparação da Nexus com ela mesma, contra 24/Ago, ele cede 4 pontos no 1º turno. É o mais rejeitado nas duas casas, com 52,7% e 50%. NO PREÇO, leitura confirmada de 31/Ago, 13:43 BRT (16:43 UTC), em 39,05% (vol USD 9,37M acumulado), QUEDA de 2,05pp.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "QUEDA de 2,05pp, de 41,10% para 39,05% (vol USD 9,37M acumulado), leitura confirmada de 31/Ago, 13:43 BRT (16:43 UTC). É a MAIOR variação do painel nesta segunda, e desfaz boa parte da subida de quatro fechamentos seguidos que o levou de 35,50% em 27/Ago a 41,20% em 30/Ago. O movimento é de queda nas duas medições ao mesmo tempo, no preço e na urna declarada. No contrato de 2º lugar do 1º turno segue em 85,50%, sem variação, ou seja, o mercado continua tratando como quase certo que ele chega ao returno. Disse que indicará ao Supremo ministros contrários ao aborto, às drogas e às injustiças, segundo Gazeta do Povo."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "1,85%",
    poll: "DUAS NACIONAIS DIVULGADAS NESTA SEGUNDA, as primeiras desde a Vox Brasil de 29/Ago: a AtlasIntel/Bloomberg (n=5.014, formulário eletrônico, campo 25 a 30/Ago, BR-07972/2026) e a BTG/Nexus (n=2.005, telefone, campo 28 a 30/Ago, BR-08900/2026). A AtlasIntel o mede em 7,6% no 1º turno, praticamente empatado com Augusto Cury, com 7,8%, na terceira posição, e é a melhor marca dele numa nacional da janela. A BTG/Nexus o mede em 3%, sem variação contra 24/Ago. As duas casas discordam em 4,6 pontos sobre ele, a maior distância entre elas sobre um mesmo nome nesta rodada. Num 2º turno hipotético da AtlasIntel ele perde por 47,5% a 26,0%. NO PREÇO, leitura confirmada de 31/Ago, 13:43 BRT (16:43 UTC), em 1,85% (vol USD 11,95M acumulado), QUEDA de 0,40pp.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "QUEDA de 0,40pp, para 1,85% (vol USD 11,95M acumulado), leitura confirmada de 31/Ago, 13:43 BRT (16:43 UTC). A MELHOR PESQUISA E A PIOR DECISÃO JUDICIAL DELE NO MESMO DIA: Dias Toffoli suspendeu a propaganda eleitoral da chapa, o repasse de recursos e o direito de participar de debate, segundo G1, depois de citar indícios de ilicitude no registro e adiar o julgamento, segundo Folha de S.Paulo e O Globo. A AtlasIntel dá a ele 67% de imagem negativa, a maior entre os presidenciáveis, segundo CartaCapital. O livro dele acumula USD 11,95M, o maior do painel entre os nomes abaixo dos dois primeiros, num contrato que paga menos de 2%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "Nenhuma das duas nacionais divulgadas nesta segunda o testa em cenário presidencial de 1º turno. NO PREÇO, esta rodada não publica preço novo para ele: o último publicado é o de 30/Ago, 16:40 BRT, em 0,05% (vol USD 7,41M acumulado), abaixo do corte de 0,5% que o painel usa para separar preço de ruído.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Esta rodada não publica preço novo para ele, e o último publicado é o de 30/Ago, 16:40 BRT, em 0,05% (vol USD 7,41M acumulado), abaixo do corte de 0,5% que o painel usa para separar preço de ruído. Não é candidato à Presidência: disputa o governo de São Paulo. O preço presidencial dele é resíduo de livro, não medida de campanha."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,15%",
    poll: "DUAS NACIONAIS DIVULGADAS NESTA SEGUNDA, as primeiras desde a Vox Brasil de 29/Ago: a AtlasIntel/Bloomberg (n=5.014, formulário eletrônico, campo 25 a 30/Ago, BR-07972/2026) e a BTG/Nexus (n=2.005, telefone, campo 28 a 30/Ago, BR-08900/2026). A BTG/Nexus o coloca em 5% no 1º turno, sem variação contra a rodada da própria casa de 24/Ago, mas agora como QUARTO nome da tabela dela, atrás de Augusto Cury, que saltou para 11%. Num 2º turno da AtlasIntel ele perde para o líder por 46,6% a 41,0%, distância de 5,6 pontos, a mais estreita entre os cenários alternativos testados. NO PREÇO, esta rodada não publica preço novo para ele: o último publicado é o de 30/Ago, 16:40 BRT, em 0,15% (vol USD 6,97M acumulado).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "Esta rodada não publica preço novo para ele, e o último publicado é o de 30/Ago, 16:40 BRT, em 0,15% (vol USD 6,97M acumulado), abaixo do corte de 0,5%. PERDEU A TERCEIRA POSIÇÃO NA URNA DECLARADA: era o terceiro nome da terceira via nas nacionais e o primeiro do contrato de 3º lugar do 1º turno, e nesta segunda foi ultrapassado por Augusto Cury na BTG/Nexus. A distância entre os 5% que a urna lhe dá e os 0,15% da probabilidade implícita é grande, e as duas grandezas não se subtraem: uma mede intenção de voto e a outra, chance de vitória."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,05%",
    poll: "DUAS NACIONAIS DIVULGADAS NESTA SEGUNDA, as primeiras desde a Vox Brasil de 29/Ago: a AtlasIntel/Bloomberg (n=5.014, formulário eletrônico, campo 25 a 30/Ago, BR-07972/2026) e a BTG/Nexus (n=2.005, telefone, campo 28 a 30/Ago, BR-08900/2026). A BTG/Nexus o mede em 1% no 1º turno, contra 3% na rodada da própria casa de 24/Ago, uma perda de 2 pontos que o coloca no último lugar da tabela dela. Num 2º turno da AtlasIntel ele perde para o líder por 47,0% a 40,7%, distância de 6,3 pontos, mais larga que a de Caiado. NO PREÇO, esta rodada não publica preço novo para ele: o último publicado é o de 30/Ago, 16:40 BRT, em 0,05% (vol USD 6,37M acumulado).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Esta rodada não publica preço novo para ele, e o último publicado é o de 30/Ago, 16:40 BRT, em 0,05% (vol USD 6,37M acumulado), abaixo do corte de 0,5%. Cedeu 2 pontos na BTG/Nexus, de 3% para 1%, e é o último nome da tabela dela. O registro de candidatura dele está entre os que o TSE começou a julgar em 31 de agosto."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "Nenhuma das duas nacionais divulgadas nesta segunda o testa em cenário presidencial de 1º turno. NO PREÇO, esta rodada não publica preço novo para ele: o último publicado é o de 30/Ago, 16:40 BRT, em 0,05% (vol USD 14,06M acumulado), abaixo do corte de 0,5% que o painel usa para separar preço de ruído.",
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
