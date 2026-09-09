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
    polymarket: "52,50%",
    poll: "AS TRÊS NACIONAIS MAIS RECENTES SAÍRAM NO MESMO DIA, 09/Set: IDEIA/CANAL MEIO (n=1.500, campo 04 a 07/Set, margem de 2,5pp, BR-07935/2026), PALVER (n=5.000, campo 04 a 07/Set, margem de 3pp, BR-05420/2026) e GERP (n=2.400, campo 03 a 08/Set, margem de 2pp, BR-00251/2026). ⭐ ELAS DISCORDAM NO SINAL DO 1º TURNO: Lula à frente por 38,4% a 37,3% na Ideia/Canal Meio, empate exato em 40% na Palver e Flávio Bolsonaro à frente por 37% a 34% na Gerp, com 4,1 pontos entre as pontas e campo quase inteiramente sobreposto. ⚠️ NO 2º TURNO NENHUMA DAS TRÊS DÁ O PAR A LULA: 46% a 46%, 46% a 44% e 47% a 40%. É o sexto resultado nacional seguido desde 06/Set em que ele não aparece à frente, depois da Veritá de 06/Set, da Quaest de 07/Set e da BTG/Nexus de 08/Set. NO PREÇO, o contrato de vencedor CEDEU 2,00pp e está em 52,50% (vol USD 10,20M acumulado), leitura de 09/Set, 16:51 BRT, e o vão para o segundo caiu de 10,65pp para 6,25pp. No contrato de 2º lugar do 1º turno ele SUBIU 9,90pp e está em 19,60% (vol USD 537 mil).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "AS DUAS MEDIÇÕES DESTA PÁGINA ANDARAM PARA O MESMO LADO PELO SEGUNDO DIA. O contrato de vencedor CEDEU 2,00pp e está em 52,50% (vol USD 10,20M acumulado), leitura de 09/Set, 16:51 BRT, e a distância para o segundo caiu de 10,65pp para 6,25pp. ⭐ O MOVIMENTO MAIOR ESTÁ NO OUTRO LIVRO: no contrato de 2º lugar do 1º turno ele subiu 9,90pp, de 9,70% para 19,60%, ou seja o mercado passou a ver como bem mais provável que ele termine o 1º turno em segundo. No mesmo dia entraram três nacionais e nenhuma lhe dá o 2º turno. São grandezas diferentes e não se subtraem: a pesquisa mede intenção de voto declarada e o contrato mede probabilidade. Em 09/Set defendeu a quebra completa do sigilo do caso Master como resposta à crise no Judiciário, segundo Folha de S.Paulo e UOL."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "46,25%",
    poll: "AS TRÊS NACIONAIS MAIS RECENTES SAÍRAM NO MESMO DIA, 09/Set: IDEIA/CANAL MEIO (n=1.500, campo 04 a 07/Set, margem de 2,5pp, BR-07935/2026), PALVER (n=5.000, campo 04 a 07/Set, margem de 3pp, BR-05420/2026) e GERP (n=2.400, campo 03 a 08/Set, margem de 2pp, BR-00251/2026). ⭐ ELAS DISCORDAM NO SINAL DO 1º TURNO: Lula à frente por 38,4% a 37,3% na Ideia/Canal Meio, empate exato em 40% na Palver e Flávio Bolsonaro à frente por 37% a 34% na Gerp, com 4,1 pontos entre as pontas e campo quase inteiramente sobreposto. ⚠️ NO 2º TURNO NENHUMA DAS TRÊS DÁ O PAR A LULA: 46% a 46%, 46% a 44% e 47% a 40%. É o sexto resultado nacional seguido desde 06/Set em que ele não aparece à frente, depois da Veritá de 06/Set, da Quaest de 07/Set e da BTG/Nexus de 08/Set. Ele fica entre 37% e 40% no 1º turno das três e vence ou empata o 2º turno nas três, com os 7 pontos da Gerp e o zero da Ideia/Canal Meio marcando o intervalo que as casas cobrem no mesmo par. NO PREÇO, o contrato de vencedor SUBIU 2,40pp e está em 46,25% (vol USD 10,01M acumulado), leitura de 09/Set, 16:51 BRT. No contrato de 2º lugar do 1º turno CEDEU 10,00pp e está em 78,50% (vol USD 696 mil), o maior movimento da rodada.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "OS DOIS CONTRATOS DELE ANDARAM EM DIREÇÕES OPOSTAS E DIZEM A MESMA COISA: subiu 2,40pp no de vencedor, para 46,25%, e cedeu 10,00pp no de 2º lugar do 1º turno, para 78,50%, leitura de 09/Set, 16:51 BRT. Ficar menos provável de terminar em segundo é o outro lado de ficar mais provável de ganhar o 1º turno. Nas três nacionais do dia ele vence ou empata o 2º turno em todas. Em 09/Set criticou a decisão de Flávio Dino que reintegrou o diretor-geral da Polícia Federal, chamou-a de canetada e disse que o adversário quer vencer no tapetão, segundo Folha de S.Paulo, G1, O Globo e Gazeta do Povo."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "1,85%",
    poll: "AS TRÊS NACIONAIS MAIS RECENTES SAÍRAM NO MESMO DIA, 09/Set: IDEIA/CANAL MEIO (n=1.500, campo 04 a 07/Set, margem de 2,5pp, BR-07935/2026), PALVER (n=5.000, campo 04 a 07/Set, margem de 3pp, BR-05420/2026) e GERP (n=2.400, campo 03 a 08/Set, margem de 2pp, BR-00251/2026). ⭐ ELAS DISCORDAM NO SINAL DO 1º TURNO: Lula à frente por 38,4% a 37,3% na Ideia/Canal Meio, empate exato em 40% na Palver e Flávio Bolsonaro à frente por 37% a 34% na Gerp, com 4,1 pontos entre as pontas e campo quase inteiramente sobreposto. ⚠️ NO 2º TURNO NENHUMA DAS TRÊS DÁ O PAR A LULA: 46% a 46%, 46% a 44% e 47% a 40%. É o sexto resultado nacional seguido desde 06/Set em que ele não aparece à frente, depois da Veritá de 06/Set, da Quaest de 07/Set e da BTG/Nexus de 08/Set. ⭐ ELE É O NÚMERO QUE MAIS DESTOA ENTRE AS TRÊS: 11% na Palver contra 4% na Ideia/Canal Meio e 4% na Gerp, e os 7 pontos superam a soma das margens das duas casas. Na Ideia/Canal Meio ele perde o 2º turno para Lula por 46% a 40,3%. NO PREÇO, o contrato de vencedor SUBIU 0,55pp e está em 1,85% (vol USD 12,98M acumulado), leitura de 09/Set, 16:51 BRT. No contrato de 3º LUGAR do 1º turno esta rodada não publica preço novo.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "SOBE 0,55pp no contrato de vencedor, para 1,85% (vol USD 12,98M acumulado), leitura de 09/Set, 16:51 BRT, e o contrato dele acumula mais dinheiro que o do próprio líder, apesar do preço baixo. ⚠️ A discordância entre as casas sobre ele é a maior do dia: a pesquisa de maior amostra, a Palver com n=5.000, o põe em 11%, e as outras duas em 4%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "Nenhuma das três nacionais que saíram em 09/Set o testa em cenário presidencial. NO PREÇO, ele está em 0,05% (vol USD 7,43M acumulado) no contrato de VENCEDOR, no piso do livro e abaixo do corte de 0,5% que o painel usa para separar preço de ruído, leitura de 09/Set, 16:51 BRT.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Parado no piso do livro, 0,05%, leitura de 09/Set, 16:51 BRT. Não é candidato à Presidência: disputa o governo de São Paulo, e por isso não aparece nos cenários presidenciais das três nacionais do dia."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,25%",
    poll: "AS TRÊS NACIONAIS MAIS RECENTES SAÍRAM NO MESMO DIA, 09/Set: IDEIA/CANAL MEIO (n=1.500, campo 04 a 07/Set, margem de 2,5pp, BR-07935/2026), PALVER (n=5.000, campo 04 a 07/Set, margem de 3pp, BR-05420/2026) e GERP (n=2.400, campo 03 a 08/Set, margem de 2pp, BR-00251/2026). ⭐ ELAS DISCORDAM NO SINAL DO 1º TURNO: Lula à frente por 38,4% a 37,3% na Ideia/Canal Meio, empate exato em 40% na Palver e Flávio Bolsonaro à frente por 37% a 34% na Gerp, com 4,1 pontos entre as pontas e campo quase inteiramente sobreposto. ⚠️ NO 2º TURNO NENHUMA DAS TRÊS DÁ O PAR A LULA: 46% a 46%, 46% a 44% e 47% a 40%. É o sexto resultado nacional seguido desde 06/Set em que ele não aparece à frente, depois da Veritá de 06/Set, da Quaest de 07/Set e da BTG/Nexus de 08/Set. As três o medem em 5% na Gerp, 4% na Ideia/Canal Meio e 1% na Palver, e os 4 pontos entre as pontas superam a soma das margens das duas casas. ⭐ NA IDEIA/CANAL MEIO ELE TEM O PAR DE 2º TURNO MAIS APERTADO ENTRE OS DESAFIANTES TESTADOS NAQUELA CASA: perde por 46% a 42%. NO PREÇO, ele SUBIU 0,10pp e está em 0,25% (vol USD 7,35M acumulado) no contrato de VENCEDOR, leitura de 09/Set, 16:51 BRT, ainda abaixo do corte de 0,5%. No contrato de 3º LUGAR do 1º turno esta rodada não publica preço novo.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "Sobe 0,10pp no contrato de vencedor, para 0,25% (vol USD 7,35M acumulado), leitura de 09/Set, 16:51 BRT, e segue abaixo do corte de 0,5% que separa preço de ruído. O número que mais informa sobre ele segue sendo o de 2º turno, e na Ideia/Canal Meio de 09/Set é o mais apertado entre os desafiantes daquela casa."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,15%",
    poll: "AS TRÊS NACIONAIS MAIS RECENTES SAÍRAM NO MESMO DIA, 09/Set: IDEIA/CANAL MEIO (n=1.500, campo 04 a 07/Set, margem de 2,5pp, BR-07935/2026), PALVER (n=5.000, campo 04 a 07/Set, margem de 3pp, BR-05420/2026) e GERP (n=2.400, campo 03 a 08/Set, margem de 2pp, BR-00251/2026). ⭐ ELAS DISCORDAM NO SINAL DO 1º TURNO: Lula à frente por 38,4% a 37,3% na Ideia/Canal Meio, empate exato em 40% na Palver e Flávio Bolsonaro à frente por 37% a 34% na Gerp, com 4,1 pontos entre as pontas e campo quase inteiramente sobreposto. ⚠️ NO 2º TURNO NENHUMA DAS TRÊS DÁ O PAR A LULA: 46% a 46%, 46% a 44% e 47% a 40%. É o sexto resultado nacional seguido desde 06/Set em que ele não aparece à frente, depois da Veritá de 06/Set, da Quaest de 07/Set e da BTG/Nexus de 08/Set. As três o medem em 1,5% na Ideia/Canal Meio, 1% na Gerp e 1% na Palver, diferenças que cabem dentro da margem de cada casa. Na Ideia/Canal Meio ele perde o 2º turno por 46% a 38%. NO PREÇO, ele está em 0,15% (vol USD 6,70M acumulado) no contrato de VENCEDOR, sem variação, leitura de 09/Set, 16:51 BRT, abaixo do corte de 0,5%. No contrato de 3º LUGAR do 1º turno esta rodada não publica preço novo.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Parado em 0,15% no contrato de vencedor (vol USD 6,70M acumulado), leitura de 09/Set, 16:51 BRT, abaixo do corte de 0,5%. Nas três nacionais do dia ele varia 0,5 ponto entre as casas, o que é menos que a margem de qualquer uma delas."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "Nenhuma das três nacionais que saíram em 09/Set o testa em cenário presidencial de 1º turno. NO PREÇO, ele está em 0,05% (vol USD 14,07M acumulado) no contrato de VENCEDOR, no piso do livro e abaixo do corte de 0,5%, leitura de 09/Set, 16:51 BRT.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Parado no piso do livro, 0,05%, leitura de 09/Set, 16:51 BRT, e ainda assim o contrato dele é o de maior volume acumulado do painel presidencial, USD 14,07M. Preço no piso com volume alto mede quanto já se negociou, não quanto se espera dele agora. Em 08/Set cobrou do Senado uma posição sobre o Supremo e disse que André Mendonça representa uma esperança, segundo G1 e UOL."
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
