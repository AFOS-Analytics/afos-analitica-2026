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
    polymarket: "41,50%",
    poll: "AS DUAS NACIONAIS DIVULGADAS EM 21/Set DISCORDAM NO SINAL DOS DOIS TURNOS: BTG/Nexus (n=2.006, telefone CATI, campo de 18 a 20/Set, margem de 2,0pp, BR-00485/2026) e Palver (n=5.000, internet, campo de 15 a 18/Set, margem de 2,8pp, BR-00860/2026). A BTG/Nexus o dá à frente nos dois turnos, 40% a 37% no 1º e 46% a 45% no 2º. A Palver o dá atrás nos dois, 41% a 42% no 1º e 43% a 47% no 2º. As duas casas declaram empate técnico nos dois turnos, e o painel registra as duas sem escolher qual descreve melhor o eleitorado.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "O CONTRATO DE VENCEDOR NÃO RECEBE PREÇO NOVO NESTA RODADA: ele segue nos 41,50% (vol USD 11,47M acumulado) da leitura confirmada de 21/Set às 00:06 BRT, com o vão de 17,55pp para Flávio Bolsonaro. No contrato de 2º lugar do 1º turno ele cede 0,30pp, para 29,25% (vol USD 0,88M acumulado), na leitura confirmada de 21/Set, 16:21 BRT. O que se moveu hoje não foi o par presidencial, e sim o livro de 3º lugar do 1º turno, onde a distância entre os dois primeiros encolheu de 19,95pp para 5,25pp.",
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "59,05%",
    poll: "AS DUAS NACIONAIS DIVULGADAS EM 21/Set DISCORDAM NO SINAL DOS DOIS TURNOS: BTG/Nexus (n=2.006, telefone CATI, campo de 18 a 20/Set, margem de 2,0pp, BR-00485/2026) e Palver (n=5.000, internet, campo de 15 a 18/Set, margem de 2,8pp, BR-00860/2026). A Palver o dá à frente nos dois turnos, 42% a 41% no 1º e 47% a 43% no 2º. A BTG/Nexus o dá atrás nos dois, 37% a 40% no 1º e 45% a 46% no 2º. As duas declaram empate técnico, e a diferença entre elas está no método, telefone contra internet, e na janela de campo, que fecha em 20/Set numa e em 18/Set na outra.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "O CONTRATO DE VENCEDOR NÃO RECEBE PREÇO NOVO NESTA RODADA: ele segue nos 59,05% (vol USD 11,18M acumulado) da leitura confirmada de 21/Set às 00:06 BRT, com vão de 17,55pp sobre Lula. No contrato de 2º lugar do 1º turno ele cai 2,00pp, para 68,50% (vol USD 1,05M acumulado), na leitura confirmada de 21/Set, 16:21 BRT, e essa é a maior queda da rodada fora do livro de 3º lugar. Em 21/Set o Ministério da Justiça oficializou a demissão de Eduardo Bolsonaro do cargo de escrivão da Polícia Federal por abandono de cargo, formalizando um desligamento que a própria PF recomendou em julho. O painel não afirma que o ato moveu preço.",
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "0,75%",
    poll: "AS DUAS NACIONAIS DIVULGADAS EM 21/Set DISCORDAM NO SINAL DOS DOIS TURNOS: BTG/Nexus (n=2.006, telefone CATI, campo de 18 a 20/Set, margem de 2,0pp, BR-00485/2026) e Palver (n=5.000, internet, campo de 15 a 18/Set, margem de 2,8pp, BR-00860/2026). Nenhuma das duas publica o número dele no 1º turno. Na Datafolha de 17/Set ele tinha 3% e na Futura/100% Cidades do mesmo dia 3,4%, atrás de Augusto Cury nas duas.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "NO CONTRATO DE 3º LUGAR DO 1º TURNO ELE CAI 7,00pp, PARA 45,50% (vol USD 0,36M acumulado), na leitura confirmada de 21/Set, 16:21 BRT, a maior queda de qualquer contrato do painel nesta rodada. A dianteira dele sobre Augusto Cury naquele livro encolheu de 19,95pp para 5,25pp em pouco mais de dezesseis horas. No de vencedor fica em 0,75% (vol USD 13,89M acumulado), sem preço novo nesta rodada, e é o segundo maior volume do livro presidencial inteiro: volume mede interesse acumulado desde a abertura, não probabilidade de agora.",
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "AS DUAS NACIONAIS DIVULGADAS EM 21/Set DISCORDAM NO SINAL DOS DOIS TURNOS: BTG/Nexus (n=2.006, telefone CATI, campo de 18 a 20/Set, margem de 2,0pp, BR-00485/2026) e Palver (n=5.000, internet, campo de 15 a 18/Set, margem de 2,8pp, BR-00860/2026). Nenhuma das duas o testa em cenário presidencial de 1º turno: ele não é candidato à Presidência e disputa o governo de São Paulo.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Parado no piso do livro, 0,05%, na leitura confirmada de 21/Set às 00:06 BRT, sem preço novo nesta rodada. Não é candidato à Presidência: disputa o governo de São Paulo, e por isso não aparece nos cenários presidenciais de 1º turno. O topo da série dele no contrato de vencedor é de 7,60%, medido no backup do banco.",
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,05%",
    poll: "AS DUAS NACIONAIS DIVULGADAS EM 21/Set DISCORDAM NO SINAL DOS DOIS TURNOS: BTG/Nexus (n=2.006, telefone CATI, campo de 18 a 20/Set, margem de 2,0pp, BR-00485/2026) e Palver (n=5.000, internet, campo de 15 a 18/Set, margem de 2,8pp, BR-00860/2026). Nenhuma das duas publica o número dele no 1º turno. Na Datafolha de 17/Set ele era o quarto colocado, com 4%, e na Futura/100% Cidades tinha 4,5%.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "NO CONTRATO DE 3º LUGAR DO 1º TURNO ELE SOBE 4,00pp, PARA 15,50% (vol USD 0,14M acumulado), na leitura confirmada de 21/Set, 16:21 BRT, a terceira maior alta da rodada, e mantém a terceira posição daquele livro. No de vencedor segue em 0,05%, na leitura confirmada de 21/Set às 00:06 BRT, sem preço novo nesta rodada e abaixo do corte de 0,5% que o painel usa para tratar preço fino como ruído.",
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,15%",
    poll: "AS DUAS NACIONAIS DIVULGADAS EM 21/Set DISCORDAM NO SINAL DOS DOIS TURNOS: BTG/Nexus (n=2.006, telefone CATI, campo de 18 a 20/Set, margem de 2,0pp, BR-00485/2026) e Palver (n=5.000, internet, campo de 15 a 18/Set, margem de 2,8pp, BR-00860/2026). Nenhuma das duas publica o número dele no 1º turno. Na Datafolha de 17/Set ele tinha 2% e na Futura/100% Cidades 1,0%.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "No contrato de 3º lugar do 1º turno ele cai 0,55pp, para 0,50% (vol USD 67 mil acumulados), na leitura confirmada de 21/Set, 16:21 BRT. No de vencedor segue em 0,15%, na leitura confirmada de 21/Set às 00:06 BRT, sem preço novo nesta rodada e abaixo do corte de 0,5%. O topo da série dele no contrato de vencedor é de 12,00%, em 13/Mai, medido no backup do banco.",
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "AS DUAS NACIONAIS DIVULGADAS EM 21/Set DISCORDAM NO SINAL DOS DOIS TURNOS: BTG/Nexus (n=2.006, telefone CATI, campo de 18 a 20/Set, margem de 2,0pp, BR-00485/2026) e Palver (n=5.000, internet, campo de 15 a 18/Set, margem de 2,8pp, BR-00860/2026). Nenhuma das duas o testa em cenário presidencial de 1º turno.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Parado no piso do livro, 0,05%, na leitura confirmada de 21/Set às 00:06 BRT, sem preço novo nesta rodada, e ainda assim o contrato dele é o de maior volume acumulado do livro presidencial, USD 14,08M contra USD 13,89M do segundo colocado. Preço no piso com volume alto mede interesse passado, não probabilidade de agora.",
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
