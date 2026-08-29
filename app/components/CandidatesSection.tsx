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
    polymarket: "56,50%",
    poll: "PESQUISA NACIONAL NOVA nesta sexta: a Vox Brasil de 29/Ago (n=2.100, presencial, campo 25 a 27/Ago, BR-05519/2026). Ela lhe dá 37,1% no 1º turno contra 34,8%, uma distância de 2,3 pontos, e 44,5% no 2º turno contra 45,1%, atrás por 0,6 ponto dentro da margem de 2,15pp, ou seja, empate técnico. Contra a própria Vox de 31/Jul ele cede 3,4pp no 1º turno e 3,0pp no 2º. Rejeição de 52,7%, segundo CNN Brasil. NO PREÇO, leitura confirmada de 29/Ago, 13:27 BRT (16:27 UTC), em 56,50% (vol USD 9,42M acumulado), QUEDA de 1,00pp.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "QUEDA de 1,00pp, para 56,50% (vol USD 9,42M acumulado), leitura confirmada de 29/Ago, 13:27 BRT (16:27 UTC). A distância para o segundo colocado caiu para 17,55pp, o menor valor da janela de 20 dias, e a série mostra esse estreitamento correndo desde 10/Ago, quando ela era de 36,40pp. Na campanha, estreou no horário eleitoral do rádio com foco em educação, segundo InfoMoney, chamou o adversário de pior dos Bolsonaros, segundo Estadão, e a campanha lançou um site que liga o rival a milícia e ao Banco Master, segundo Poder360. O caso que envolve o filho segue sob apuração da Polícia Federal."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "38,95%",
    poll: "PESQUISA NACIONAL NOVA nesta sexta: a Vox Brasil de 29/Ago (n=2.100, presencial, campo 25 a 27/Ago, BR-05519/2026). Ela o dá em 34,8% no 1º turno, a 2,3 pontos do líder, e em 45,1% no 2º turno, à frente por 0,6 ponto dentro da margem de 2,15pp, ou seja, empate técnico. Nas duas leituras da Vox o sinal do 2º turno mudou de lado: em 31/Jul ele estava 6,4 pontos atrás. Na janela de 30 dias do painel ele já aparecia à frente do returno na Gerp de 26/Ago, na Veritá de 21/Ago e na Gerp de 11/Ago. NO PREÇO, leitura confirmada de 29/Ago, 13:27 BRT (16:27 UTC), em 38,95% (vol USD 9,21M acumulado), ALTA de 3,30pp.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "ALTA de 3,30pp, de 35,65% para 38,95% (vol USD 9,21M acumulado), leitura confirmada de 29/Ago, 13:27 BRT (16:27 UTC). É a MAIOR variação do painel nesta sexta, e desta vez os DOIS livros dele andaram na mesma direção: o de 2º LUGAR do 1º turno subiu 1,50pp, para 86,50%. É o inverso da véspera, quando os dois discordaram. A ordem dos fatos merece registro: o preço dele começou a subir na NOITE de 28/Ago, antes de a pesquisa sair. Na entrevista à TV Globo tentou vincular o Banco Master ao adversário e prometeu respeitar o resultado, segundo O Globo, e negou-se a prestar contas sobre o caso Dark Horse, segundo Folha de S.Paulo."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "2,25%",
    poll: "PESQUISA NACIONAL NOVA nesta sexta: a Vox Brasil de 29/Ago (n=2.100, presencial, campo 25 a 27/Ago, BR-05519/2026). Ela o mede em 3,3% no 1º turno, o quarto nome da tabela, à frente de Romeu Zema, com 2,8%, e de Augusto Cury, com 2,6%, e atrás de Ronaldo Caiado, com 5,0%. NO PREÇO, leitura confirmada de 29/Ago, 13:27 BRT (16:27 UTC), em 2,25% (vol USD 11,81M acumulado), QUEDA de 0,65pp.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "QUEDA de 0,65pp, para 2,25% (vol USD 11,81M acumulado), leitura confirmada de 29/Ago, 13:27 BRT (16:27 UTC), devolvendo as duas altas seguidas que tinha feito depois do piso de 27/Ago. E PERDEU a liderança do contrato de 3º LUGAR do 1º turno, que ocupava desde 09/Ago: caiu 3,00pp, para 32,50%, enquanto Ronaldo Caiado subiu para 36,50%. O livro dele acumula USD 11,81M, o maior entre os candidatos do painel, num contrato que hoje paga menos de 3%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "Nenhuma nacional da janela o testa em cenário presidencial de 1º turno, inclusive a Vox Brasil de 29/Ago. NO PREÇO, leitura confirmada de 29/Ago, 13:27 BRT (16:27 UTC), em 0,05% (vol USD 7,41M acumulado), estável e abaixo do corte de 0,5% que o painel usa para separar preço de ruído.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Sem variação, em 0,05% (vol USD 7,41M acumulado), leitura confirmada de 29/Ago, 13:27 BRT (16:27 UTC), abaixo do corte de 0,5% que o painel usa para separar preço de ruído. Não é candidato à Presidência: disputa o governo de São Paulo. O preço presidencial dele é resíduo de livro, não medida de campanha."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,25%",
    poll: "PESQUISA NACIONAL NOVA nesta sexta: a Vox Brasil de 29/Ago (n=2.100, presencial, campo 25 a 27/Ago, BR-05519/2026). Ela o coloca em 5,0% no 1º turno, o TERCEIRO nome da tabela, à frente de Renan Santos, de Romeu Zema e de Augusto Cury. No 2º turno perde para o líder por 45,5% a 41,1%, distância de 4,4 pontos. NO PREÇO, leitura confirmada de 29/Ago, 13:27 BRT (16:27 UTC), em 0,25% (vol USD 6,89M acumulado), sem variação e abaixo do corte de 0,5%.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "ASSUMIU a liderança do contrato de 3º LUGAR do 1º turno, com 36,50%, alta de 2,00pp, encerrando uma ponta que pertencia a Renan Santos desde 09/Ago. No contrato de vencedor segue em 0,25% (vol USD 6,89M acumulado), leitura confirmada de 29/Ago, 13:27 BRT (16:27 UTC), sem variação e abaixo do corte de 0,5%. E A DISTÂNCIA ENTRE OS DOIS INSTRUMENTOS É O DADO: a urna declarada lhe dá 5,0% no 1º turno e o preço de vencedor paga 0,25%. As duas grandezas não se subtraem, porque uma mede intenção de voto e a outra, chance de vencer."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,05%",
    poll: "PESQUISA NACIONAL NOVA nesta sexta: a Vox Brasil de 29/Ago (n=2.100, presencial, campo 25 a 27/Ago, BR-05519/2026). Ela o mede em 2,8% no 1º turno e testa um cenário de 2º turno em que ele perde para o líder por 45,5% a 39,3%, distância de 6,2 pontos. NO PREÇO, leitura confirmada de 29/Ago, 13:27 BRT (16:27 UTC), em 0,05% (vol USD 6,32M acumulado), queda de 0,10pp e abaixo do corte de 0,5%.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "QUEDA de 0,10pp, para 0,05% (vol USD 6,32M acumulado), leitura confirmada de 29/Ago, 13:27 BRT (16:27 UTC), abaixo do corte de 0,5%. A distância de 6,2 pontos no cenário de 2º turno da Vox é maior que a de Ronaldo Caiado, de 4,4 pontos, no mesmo levantamento. O nome não entrou no rateio de tempo do horário eleitoral, que ficou com quatro candidatos."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "Nenhuma nacional da janela o inclui em cenário presidencial, inclusive a Vox Brasil de 29/Ago. A ressalva do painel segue valendo como ato datado: ele abriu campanha ao GOVERNO DE SÃO PAULO em 16/Ago, segundo O Globo e o Times Brasil. NO PREÇO, leitura confirmada de 29/Ago, 13:27 BRT (16:27 UTC), em 0,05% (vol USD 14,06M acumulado), estável, abaixo do corte de 0,5% e sobre o MAIOR volume acumulado de todo o livro presidencial.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Sem variação, em 0,05% (vol USD 14,06M acumulado), leitura confirmada de 29/Ago, 13:27 BRT (16:27 UTC). Não é candidato à Presidência: disputa a reeleição em São Paulo. É o MAIOR volume acumulado de todo o livro presidencial sustentando o menor preço, e isso é fato sobre o histórico do contrato, não sobre a candidatura de hoje."
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
