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
    poll: "AS DUAS NACIONAIS MAIS RECENTES SÃO A BTG/NEXUS DE 08/Set (n=2.002, campo 04 a 07/Set, margem de 2pp, BR-06790/2026) E A QUAEST DE 07/Set (n=2.004, campo 03 a 06/Set, margem de 2pp, BR-01720/2026). ⭐ AS DUAS ENCURTAM A DISPUTA NO 2º TURNO: a BTG/Nexus dá Flávio Bolsonaro à frente por 46% a 45% e a Quaest registra empate em 41% a 41%. Com a Veritá de 06/Set, são três nacionais seguidas sem dar o par a Lula, contra a Datafolha de 03/Set (46% a 44%) e a Quaest de 02/Set (42% a 41%), as duas no sentido oposto. A BTG/Nexus o mede em 39% no 1º turno, no cenário sem Pablo Marçal, e a Quaest em 36%, contra 35% e 29% do segundo colocado. ⚠️ AS TRÊS CASAS DE CAMPO SOBREPOSTO DISCORDAM SOBRE O TAMANHO DA VANTAGEM DELE NO 1º TURNO: 7 pontos na Quaest, 4 na BTG/Nexus e a Veritá pôs o segundo colocado 0,5 ponto à frente. São 7,5 pontos de amplitude entre casas, mais que o dobro da margem de erro que cada uma declara. A aprovação do governo é de 43% contra 50% na Quaest e 45% contra 50% na BTG/Nexus, com as duas casas chegando ao mesmo número de desaprovação. NO PREÇO, o contrato de vencedor CEDEU 3,00pp e está em 54,50% (vol USD 10,13M acumulado), leitura confirmada de 08/Set, 12:00 BRT, e o vão para o segundo caiu de 18,05pp para 10,65pp. No contrato de 2º lugar do 1º turno está em 9,70% (vol USD 480 mil).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "AS DUAS MEDIÇÕES DESTA PÁGINA ANDARAM PARA O MESMO LADO PELA PRIMEIRA VEZ NESTA JANELA. O contrato de vencedor CEDEU 3,00pp e está em 54,50% (vol USD 10,13M acumulado), leitura confirmada de 08/Set, 12:00 BRT, e a distância para o segundo caiu de 18,05pp para 10,65pp, com USD 660 mil de dinheiro novo no livro presidencial. No mesmo intervalo entraram duas nacionais e as duas encurtam o 2º turno. São grandezas diferentes e não se subtraem: a pesquisa mede intenção de voto declarada e o contrato mede probabilidade de vencer a eleição. Em 08/Set reuniu auxiliares para discutir a reação à decisão de André Mendonça que afastou o diretor-geral da Polícia Federal, segundo O Globo."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "43,85%",
    poll: "AS DUAS NACIONAIS MAIS RECENTES SÃO A BTG/NEXUS DE 08/Set (n=2.002, campo 04 a 07/Set, margem de 2pp, BR-06790/2026) E A QUAEST DE 07/Set (n=2.004, campo 03 a 06/Set, margem de 2pp, BR-01720/2026). ⭐ AS DUAS ENCURTAM A DISPUTA NO 2º TURNO: a BTG/Nexus dá Flávio Bolsonaro à frente por 46% a 45% e a Quaest registra empate em 41% a 41%. Com a Veritá de 06/Set, são três nacionais seguidas sem dar o par a Lula, contra a Datafolha de 03/Set (46% a 44%) e a Quaest de 02/Set (42% a 41%), as duas no sentido oposto. ⭐ A BTG/NEXUS O PÕE À FRENTE NO 2º TURNO, 46% a 45%, e é a primeira vez que essa casa faz isso: na rodada dela de 31/Ago o mesmo par saía 46% a 45% para o outro lado. ⚠️ O ponto de diferença cabe inteiro na margem de 2 pontos, então o que a pesquisa mede é EMPATE TÉCNICO e não liderança. No 1º turno a casa o mede em 35% no cenário sem Pablo Marçal e em 34% no cenário com ele, e a Quaest o mantém em 29% pela segunda rodada seguida. As duas casas medem a rejeição dele acima da do líder, 55% contra 53% e 50% contra 49%. NO PREÇO, o contrato de vencedor SUBIU 4,40pp e está em 43,85% (vol USD 9,91M acumulado), leitura confirmada de 08/Set, 12:00 BRT, o maior movimento da rodada. No contrato de 2º lugar do 1º turno cedeu 1,00pp e está em 88,50% (vol USD 644 mil).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "O PREÇO E A PESQUISA ANDARAM NA MESMA DIREÇÃO, e é a primeira vez nesta janela. O contrato de vencedor SUBIU 4,40pp e está em 43,85% (vol USD 9,91M acumulado), leitura confirmada de 08/Set, 12:00 BRT, com o vão para o líder caindo de 18,05pp para 10,65pp, no mesmo dia em que a BTG/Nexus o pôs à frente no 2º turno por 46% a 45%. No contrato de 2º lugar do 1º turno cedeu 1,00pp e está em 88,50% (vol USD 644 mil). Na série gravada desde 14/Abr o contrato de vencedor dele vai de 22,00% a 45,50%, e a leitura de hoje fica dentro dessa faixa. Em 07/Set, no ato da avenida Paulista, ligou o líder a Alexandre de Moraes e disse que indicaria cinco ministros ao Supremo, segundo JOTA, O Globo e Folha de S.Paulo."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "1,30%",
    poll: "AS DUAS NACIONAIS MAIS RECENTES SÃO A BTG/NEXUS DE 08/Set (n=2.002, campo 04 a 07/Set, margem de 2pp, BR-06790/2026) E A QUAEST DE 07/Set (n=2.004, campo 03 a 06/Set, margem de 2pp, BR-01720/2026). ⭐ AS DUAS ENCURTAM A DISPUTA NO 2º TURNO: a BTG/Nexus dá Flávio Bolsonaro à frente por 46% a 45% e a Quaest registra empate em 41% a 41%. Com a Veritá de 06/Set, são três nacionais seguidas sem dar o par a Lula, contra a Datafolha de 03/Set (46% a 44%) e a Quaest de 02/Set (42% a 41%), as duas no sentido oposto. A BTG/Nexus o mede em 4% no 1º turno, contra 3% que a mesma casa media em 31/Ago, e a Quaest o mantém em 3%. Nos pares de 2º turno as duas o dão perdendo com folga: 47% a 39% na BTG/Nexus e 42% a 37% na Quaest. NO PREÇO, o contrato de vencedor CEDEU 0,25pp e está em 1,30% (vol USD 12,83M acumulado), leitura confirmada de 08/Set, 12:00 BRT, a 0,10pp do piso da série dele. No contrato de 3º LUGAR do 1º turno SUBIU 5,00pp e está em 29,50% (vol USD 282 mil).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "O LIVRO DE 3º LUGAR DESFEZ EM UM DIA O MOVIMENTO DA VÉSPERA. Ele SUBIU 5,00pp e está em 29,50% (vol USD 282 mil), leitura confirmada de 08/Set, 12:00 BRT, enquanto Augusto Cury cedeu 6,55pp, exatamente o inverso do que os dois fizeram em 07/Set. ⚠️ O livro é fino, com USD 282 mil e USD 129 mil acumulados nesses dois nomes, contra USD 145,26M do presidencial, e movimento grande em livro fino pede leitura mais cautelosa. No contrato de vencer a eleição cedeu 0,25pp para 1,30%, a 0,10pp do piso da série, e segue com o maior volume acumulado entre os nomes acima do piso de publicação. Em 07/Set lançou manifesto em ato no Ibirapuera e pediu a prisão de Alexandre de Moraes e Dias Toffoli, segundo Folha de S.Paulo."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "Nenhuma das duas nacionais que entraram em 07 e 08/Set o testa em cenário presidencial, e a Veritá de 06/Set também não. NO PREÇO, ele está em 0,05% (vol USD 7,43M acumulado) no contrato de VENCEDOR, abaixo do piso de 0,5% que o painel usa para separar preço de ruído, e esta rodada não publica preço novo para ele.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Ele está em 0,05% (vol USD 7,43M acumulado) no contrato de VENCEDOR, abaixo do piso de 0,5%, e esta rodada não publica preço novo para ele. Não é candidato à Presidência: disputa o governo de São Paulo. O preço presidencial dele é resíduo de livro, não medida de campanha."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,15%",
    poll: "AS DUAS NACIONAIS MAIS RECENTES SÃO A BTG/NEXUS DE 08/Set (n=2.002, campo 04 a 07/Set, margem de 2pp, BR-06790/2026) E A QUAEST DE 07/Set (n=2.004, campo 03 a 06/Set, margem de 2pp, BR-01720/2026). ⭐ AS DUAS ENCURTAM A DISPUTA NO 2º TURNO: a BTG/Nexus dá Flávio Bolsonaro à frente por 46% a 45% e a Quaest registra empate em 41% a 41%. Com a Veritá de 06/Set, são três nacionais seguidas sem dar o par a Lula, contra a Datafolha de 03/Set (46% a 44%) e a Quaest de 02/Set (42% a 41%), as duas no sentido oposto. A BTG/Nexus o mede em 4% no 1º turno e a Quaest em 3%. ⭐ O NÚMERO QUE MAIS INFORMA É O DO 2º TURNO: 46% a 43% na BTG/Nexus, a menor margem entre os três pares em que essa casa dá a vitória ao líder, e 41% a 38% na Quaest, o par mais apertado dela depois do que envolve o segundo colocado. NO PREÇO, ele está em 0,15% (vol USD 7,25M acumulado) no contrato de VENCEDOR, abaixo do piso de 0,5%, e esta rodada não publica preço novo para ele nesse contrato.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "Ele está em 0,15% (vol USD 7,25M acumulado) no contrato de VENCEDOR, abaixo do piso de 0,5%, e esta rodada não publica preço novo para ele nesse contrato. No contrato de 3º LUGAR do 1º turno, que é outro mercado, SUBIU 0,50pp e está em 10,00% (vol USD 115 mil), leitura confirmada de 08/Set, 12:00 BRT. NAS DUAS CASAS DA SEMANA ELE TEM O PAR DE 2º TURNO MAIS APERTADO DEPOIS DO QUE ENVOLVE O SEGUNDO COLOCADO, e o painel registra os dois sem escolher entre eles."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,15%",
    poll: "AS DUAS NACIONAIS MAIS RECENTES SÃO A BTG/NEXUS DE 08/Set (n=2.002, campo 04 a 07/Set, margem de 2pp, BR-06790/2026) E A QUAEST DE 07/Set (n=2.004, campo 03 a 06/Set, margem de 2pp, BR-01720/2026). ⭐ AS DUAS ENCURTAM A DISPUTA NO 2º TURNO: a BTG/Nexus dá Flávio Bolsonaro à frente por 46% a 45% e a Quaest registra empate em 41% a 41%. Com a Veritá de 06/Set, são três nacionais seguidas sem dar o par a Lula, contra a Datafolha de 03/Set (46% a 44%) e a Quaest de 02/Set (42% a 41%), as duas no sentido oposto. A BTG/Nexus o mede em 1% no cenário sem Pablo Marçal e em 2% no cenário com ele, e a Quaest em 2%, diferenças que cabem dentro da margem de 2 pontos de cada casa. Nos pares de 2º turno ele é o mais folgado das duas: 47% a 40% na BTG/Nexus e 44% a 33% na Quaest. NO PREÇO, ele está em 0,15% (vol USD 6,65M acumulado) no contrato de VENCEDOR, abaixo do piso de 0,5%.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Ele está em 0,15% (vol USD 6,65M acumulado) no contrato de VENCEDOR, abaixo do piso de 0,5%, e esta rodada não publica preço novo para ele nesse contrato. No contrato de 3º LUGAR do 1º turno, que é outro mercado, segue em 0,85% (vol USD 51 mil), sem variação, leitura confirmada de 08/Set, 12:00 BRT, atrás de Pablo Marçal, que está em 1,75%. O par de 2º turno dele é o mais folgado nas duas casas da semana."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "Nenhuma das duas nacionais que entraram em 07 e 08/Set o testa em cenário presidencial de 1º turno, e a Veritá de 06/Set também não. NO PREÇO, ele está em 0,05% (vol USD 14,07M acumulado) no contrato de VENCEDOR, abaixo do piso de 0,5% que o painel usa para separar preço de ruído, e esta rodada não publica preço novo para ele.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Ele está em 0,05% (vol USD 14,07M acumulado) no contrato de VENCEDOR, abaixo do piso de 0,5%, e esta rodada não publica preço novo para ele. Não é candidato à Presidência: disputa a reeleição em São Paulo. O livro dele é o maior do painel em volume acumulado num contrato que paga 0,05%, e essa combinação é a assinatura de um mercado que já resolveu a pergunta."
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
