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
    polymarket: "57,50%",
    poll: "SEM PESQUISA NACIONAL NOVA nesta sexta; a mais recente segue sendo a PoderData/Aya de 27/Ago (n=2.400, telefone, campo 23 a 26/Ago, BR-04974/2026). Ela lhe dá 38% no 1º turno contra 35%, e 45% no 2º turno contra 44%, os dois dentro da margem de 2pp. A série ESTADUAL da Quaest divulgada nesta semana, que não entra na tabela do painel por ser de escopo estadual, o mostra em EMPATE TÉCNICO com o adversário nos três maiores colégios eleitorais do país, e liderando na Bahia por 50% a 17%. NO PREÇO, leitura confirmada de 28/Ago, 15:31 BRT (18:31 UTC), em 57,50% (vol USD 9,34M acumulado), SEM VARIAÇÃO depois de ceder 5,00pp na véspera.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "O preço PAROU depois de cinco leituras sucessivas de queda, e ficou em 57,50% (vol USD 9,34M acumulado), leitura confirmada de 28/Ago, 15:31 BRT (18:31 UTC). A distância para o segundo colocado ALARGOU, de 20,65pp para 21,85pp, e alargou inteiramente pelo lado do adversário, que cedeu 1,20pp. Na campanha, abriu o horário eleitoral associando o rival a rachadinha, ao ex-banqueiro do Banco Master e a um grupo de matadores de aluguel, segundo Folha de S.Paulo. E pediu ao chefe da Polícia Federal que se apaziguasse com o relator no Supremo, segundo Estadão."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "35,65%",
    poll: "SEM PESQUISA NACIONAL NOVA nesta sexta; a mais recente segue sendo a PoderData/Aya de 27/Ago (n=2.400, telefone, campo 23 a 26/Ago, BR-04974/2026). Ela o dá em 35% no 1º turno, a 3 pontos do líder, e em 44% no 2º turno, a 1 ponto, os dois dentro da margem de 2pp. Na série estadual da Quaest ele aparece em empate técnico nos três maiores colégios e lidera em Roraima, por 52% a 17%. NO PREÇO, leitura confirmada de 28/Ago, 15:31 BRT (18:31 UTC), em 35,65% (vol USD 9,13M acumulado), QUEDA de 1,20pp.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "QUEDA de 1,20pp, de 36,85% para 35,65% (vol USD 9,13M acumulado), leitura confirmada de 28/Ago, 15:31 BRT (18:31 UTC). É a MAIOR variação do painel nesta sexta, e devolve com folga a alta de 1,30pp da véspera: em dois dias o saldo dele no contrato de vencedor é de 0,10pp NEGATIVO. Mas os DOIS livros dele discordaram no mesmo dia: o de 2º LUGAR do 1º turno SUBIU 0,50pp, para 85,00%. O mercado ficou menos convencido de que ele vence e mais convencido de que ele chega. No dia, foi sabatinado no Jornal Nacional e viu a propaganda do adversário estrear com o áudio dele e o ex-banqueiro do Master."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "2,90%",
    poll: "SEM PESQUISA NACIONAL NOVA nesta sexta; a mais recente segue sendo a PoderData/Aya de 27/Ago (n=2.400, telefone, campo 23 a 26/Ago, BR-04974/2026). Ela o mede em 4% no 1º turno, EMPATADO com Ronaldo Caiado e com Augusto Cury, e em 37% no 2º turno contra o líder. NO PREÇO, leitura confirmada de 28/Ago, 15:31 BRT (18:31 UTC), em 2,90% (vol USD 11,73M acumulado), ALTA de 0,55pp.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "ALTA de 0,55pp, para 2,90% (vol USD 11,73M acumulado), leitura confirmada de 28/Ago, 15:31 BRT (18:31 UTC). É a segunda alta seguida depois de o contrato ter TOCADO o piso de toda a série em 27/Ago, quando o registro marcou 1,70%. No contrato de 3º LUGAR ele cedeu 0,50pp e está em 35,50%, onde segue na frente, mas a vantagem ali caiu para 1,00pp: Caiado tem 34,50% e Cury 26,70%, os três dentro de 8,80pp. O livro dele acumula USD 11,73M, o maior entre os candidatos do painel, num contrato que hoje paga menos de 3%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "Nenhuma nacional da janela o testa em cenário presidencial de 1º turno. NO PREÇO, leitura confirmada de 28/Ago, 15:31 BRT (18:31 UTC), em 0,05% (vol USD 7,30M acumulado), estável e abaixo do corte de 0,5% que o painel usa para separar preço de ruído.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Sem variação, em 0,05% (vol USD 7,30M acumulado), leitura confirmada de 28/Ago, 15:31 BRT (18:31 UTC), abaixo do corte de 0,5% que o painel usa para separar preço de ruído. Não é candidato à Presidência: disputa o governo de São Paulo, e na estreia do horário eleitoral trouxe o presidente para o programa dele e pediu voto sem preconceito, segundo O Globo."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,25%",
    poll: "SEM PESQUISA NACIONAL NOVA nesta sexta; a mais recente segue sendo a PoderData/Aya de 27/Ago (n=2.400, telefone, campo 23 a 26/Ago, BR-04974/2026). Ela o mede em 4% no 1º turno, EMPATADO com Renan Santos e com Augusto Cury, e o coloca EMPATADO TECNICAMENTE com o líder no 2º turno, por 43% a 44%. Na série estadual da Quaest ele LIDERA a disputa presidencial em Goiás, com 32% contra 27% do segundo colocado e 20% do líder, segundo Diário da Manhã. NO PREÇO, leitura confirmada de 28/Ago, 15:31 BRT (18:31 UTC), em 0,25% (vol USD 6,88M acumulado), ALTA de 0,10pp.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "ALTA nos dois contratos: 0,10pp no de vencedor, para 0,25% (vol USD 6,88M acumulado), leitura confirmada de 28/Ago, 15:31 BRT (18:31 UTC), ainda abaixo do corte de 0,5%; e 1,00pp no de 3º LUGAR, para 34,50%, onde encostou a 1,00pp do primeiro colocado. E A URNA SEGUE DIZENDO OUTRA COISA: a PoderData de 27/Ago o dá empatado tecnicamente com o líder no 2º turno, por 43% a 44%. É um caso em que o preço de vencedor e a intenção de voto no returno apontam para lados diferentes, e o painel publica os dois sem escolher. O primeiro programa dele no horário eleitoral vai ao ar no sábado, segundo VEJA."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,15%",
    poll: "SEM PESQUISA NACIONAL NOVA nesta sexta; a mais recente segue sendo a PoderData/Aya de 27/Ago (n=2.400, telefone, campo 23 a 26/Ago, BR-04974/2026). Ela o mede em 2% no 1º turno e o coloca EMPATADO TECNICAMENTE com o líder no 2º turno, por 43% a 44%. NO PREÇO, leitura confirmada de 28/Ago, 15:31 BRT (18:31 UTC), em 0,15% (vol USD 6,27M acumulado), sem variação e abaixo do corte de 0,5%.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Sem variação, em 0,15% (vol USD 6,27M acumulado), leitura confirmada de 28/Ago, 15:31 BRT (18:31 UTC), abaixo do corte de 0,5%. Mantém 1,55% no contrato de 3º lugar do 1º turno, livro fino em que qualquer movimento vale pouco. O nome não entrou no rateio de tempo do horário eleitoral, que ficou com quatro candidatos."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "Nenhuma nacional da janela o inclui em cenário presidencial. A ressalva do painel segue valendo como ato datado: ele abriu campanha ao GOVERNO DE SÃO PAULO em 16/Ago, segundo O Globo e o Times Brasil. NO PREÇO, leitura confirmada de 28/Ago, 15:31 BRT (18:31 UTC), em 0,05% (vol USD 14,06M acumulado), estável, abaixo do corte de 0,5% e sobre o MAIOR volume acumulado de todo o livro presidencial.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Sem variação, em 0,05% (vol USD 14,06M acumulado), leitura confirmada de 28/Ago, 15:31 BRT (18:31 UTC). Não é candidato à Presidência. Na estreia do horário eleitoral em São Paulo ele ignorou o candidato presidencial do próprio campo e relembrou a ação após uma tragédia, segundo O Globo. É o MAIOR volume acumulado de todo o livro presidencial sustentando o menor preço, e isso é fato sobre o histórico do contrato, não sobre a candidatura de hoje."
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
