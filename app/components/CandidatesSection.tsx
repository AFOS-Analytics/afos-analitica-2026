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
    polymarket: "62,50%",
    poll: "DUAS NACIONAIS NOVAS NESTA QUARTA, E ELAS SE CONTRADIZEM. A Indexa/Broadcast (n=2.000, telefone, campo 20 a 23/Ago, BR-06366/2026) lhe dá 39% no 1º turno contra 34%, e 46% no 2º turno contra 41%. A Gerp (n=2.400, campo 21 a 25/Ago, BR-03547/2026) lhe dá 37% e o coloca ATRÁS por 1 ponto, com 42% contra 47% no 2º turno. A BTG/Nexus de 24/Ago, de maior confiabilidade na régua da casa, o mantém em 41%. NO PREÇO, leitura confirmada de 26/Ago, 15:19 BRT (18:19 UTC), em 62,50% (vol USD 9,03M acumulado), SEM VARIAÇÃO pelo terceiro dia seguido.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "SEM VARIAÇÃO em 62,50% (vol USD 9,03M acumulado), leitura confirmada de 26/Ago, 15:19 BRT (18:19 UTC), terceiro dia seguido parado. ⭐ A DISTÂNCIA para Flávio Bolsonaro ESTREITOU de 27,85pp para 26,95pp, e ela é a mais estreita desde 21/Jun, conferida no backup do banco contra o registro completo desde 14/Abr. Ela estreitou sem que ele cedesse nada: quem se moveu foi o outro lado. SEM SUPERLATIVO DE TOPO: a maior leitura dele desde 14/Abr é 67,50%, de 16/Ago. A aprovação do governo aparece negativa nas duas pesquisas de hoje, 46% contra 50% na Indexa e 43% contra 51% na Gerp. Ele acionou o TSE contra Renan Santos e Ronaldo Caiado por ataques no debate, e é o sabatinado do Jornal Nacional em 27/Ago."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "35,55%",
    poll: "AS DUAS NACIONAIS DE HOJE O MEDEM EM LUGARES OPOSTOS. A Gerp o dá em 38% no 1º turno, À FRENTE de Lula pela primeira vez na tabela deste painel, e vencendo o 2º turno por 47% a 42%. A Indexa o dá em 34% no cenário sem Pablo Marçal e 33% no cenário com ele, e perdendo o 2º turno por 41% a 46%. São dez pontos de distância entre as duas casas sobre a mesma disputa. NO PREÇO, leitura confirmada de 26/Ago, 15:19 BRT (18:19 UTC), em 35,55% (vol USD 8,94M acumulado), ALTA de 0,90pp, a maior do dia entre os contratos de vencedor.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "ALTA de 0,90pp, de 34,65% para 35,55% (vol USD 8,94M acumulado), leitura confirmada de 26/Ago, 15:19 BRT (18:19 UTC). ⭐ É o patamar mais alto dele desde 13/Mai, conferido no backup contra a série inteira desde 14/Abr. ⛔ NÃO é recorde: o topo da série é 45,50%, de 06/Mai, e o preço de hoje está 9,95pp abaixo dele. No contrato de 2º LUGAR do 1º turno ele ficou parado em 87,50%. 🏛️ O caso Master voltou ao noticiário nesta quarta, com o depoimento marcado de Daniel Vorcaro à Polícia Federal e busca e apreensão em instituto de previdência de Campo Grande. 📌 O CEO da Indexa disse ao Estadão que ele vem recuperando eleitores depois do caso, e o preço andou na mesma direção no mesmo dia."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "2,75%",
    poll: "A Gerp o dá em 3% no 1º turno e a Indexa em 4%, contra os 3% da BTG/Nexus de 24/Ago. As duas casas de hoje DISCORDAM sobre quem é o terceiro colocado: a Indexa põe Ronaldo Caiado à frente por 5% a 4% e a Gerp dá empate em 3%. NO PREÇO, leitura confirmada de 26/Ago, 15:19 BRT (18:19 UTC), em 2,75% (vol USD 11,23M acumulado), queda de 0,20pp. 🔴 No contrato de 3º LUGAR ele CEDEU 6,00pp e está em 45,50%, contra 39,00% de Caiado.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "🔴 A MAIOR VARIAÇÃO DO PAINEL NO DIA é dele e está no contrato de 3º LUGAR: cedeu 6,00pp, de 51,50% para 45,50%. No presidencial, queda de 0,20pp para 2,75% (vol USD 11,23M acumulado), leitura confirmada de 26/Ago, 15:19 BRT (18:19 UTC). ⚠️ DESTA VEZ OS DOIS CEDERAM: Ronaldo Caiado também caiu, 3,00pp, e mesmo assim o vão entre eles ENCURTOU de 9,50pp para 6,50pp, porque ele caiu o dobro. Nesta quarta Lula acionou o TSE contra ele e contra Caiado por ataques no debate, pedindo retirada de publicações, e ele quer explorar o caso Lulinha na sabatina do Jornal Nacional, segundo Folha de S.Paulo."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "Nenhuma nacional da janela o testa em cenário presidencial de 1º turno. A pesquisa do JOTA divulgada nesta quarta (BR-07806/2026, 6.000 entrevistas pela internet, campo de 27/Jul a 24/Ago) testou um cenário de 2º turno com ele no lugar de Lula, mas os números não saíram de forma que o painel pudesse conferir em fonte, e por isso nada dela entrou na tabela. NO PREÇO, leitura confirmada de 26/Ago, 15:19 BRT (18:19 UTC), em 0,05% (vol USD 7,30M acumulado), estável e abaixo do corte de 0,5% que o painel usa para separar preço de ruído.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Ele NÃO é candidato à Presidência, então qualquer cenário presidencial que o inclua é hipótese de pesquisa, não candidatura em curso. O preço segue abaixo do corte de 0,5%, e nessa faixa a variação não sustenta interpretação. ⚠️ O caso do INSS chegou nesta quarta ao flanco familiar do governo, com a Polícia Federal afirmando que um lobista pediu ação de Lulinha para fechar negócios do Careca do INSS, segundo Folha de S.Paulo, e isso não passa pelo contrato dele."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,45%",
    poll: "A Indexa o dá em 5% no 1º turno, À FRENTE de Renan Santos, e perdendo o 2º turno para Lula por 38% a 44%. A Gerp o dá em 3%, EMPATADO com Renan. A BTG/Nexus de 24/Ago o mantinha em 5%. NO PREÇO, leitura confirmada de 26/Ago, 15:19 BRT (18:19 UTC), o cruzamento de contrato se repete: na VITÓRIA ele cedeu 0,10pp e está em 0,45% (vol USD 6,59M acumulado); no 3º LUGAR do 1º turno cedeu 3,00pp e está em 39,00%. São perguntas diferentes e o painel não as soma.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "QUEDA nos dois contratos, e mesmo assim aproximação: cedeu 3,00pp no 3º LUGAR, para 39,00%, e ainda assim ENCURTOU a distância para Renan Santos, de 9,50pp para 6,50pp, porque o outro caiu 6,00pp. No presidencial, queda de 0,10pp para 0,45% (vol USD 6,59M acumulado), leitura confirmada de 26/Ago, 15:19 BRT (18:19 UTC), abaixo do corte de 0,5%. 🏛️ Nesta quarta ele defendeu a possibilidade de impeachment de ministros do STF e pediu quebra do sigilo dos casos ligados ao Master, segundo O Globo, e foi sabatinado por O Globo, CBN e Valor. O contrato de impeachment de ministro não se moveu: segue em 3,40%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,15%",
    poll: "As duas nacionais de hoje o medem em 1% no 1º turno, contra 3% na BTG/Nexus de 24/Ago. O piso da faixa de 30 dias dele caiu de 1,3% para 1% por causa delas. A Indexa o testou em 2º turno contra Lula e mediu 34% a 45%. NO PREÇO, leitura confirmada de 26/Ago, 15:19 BRT (18:19 UTC), em 0,15% (vol USD 5,99M acumulado), queda de 0,10pp e abaixo do corte de 0,5%.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "QUEDA de 0,10pp, de 0,25% para 0,15% (vol USD 5,99M acumulado), leitura confirmada de 26/Ago, 15:19 BRT (18:19 UTC), abaixo do corte de 0,5% que o painel usa para separar preço de ruído. Na urna ele perdeu dois terços do patamar que a BTG/Nexus media, indo de 3% para 1% nas duas casas que publicaram hoje, e as três pesquisas têm campo em janelas que se sobrepõem. É um caso em que a diferença entre institutos é maior do que qualquer movimento do preço."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "Nenhuma nacional da janela o inclui em cenário presidencial, inclusive as duas de hoje. A ressalva do painel segue valendo como ato datado: ele abriu campanha ao GOVERNO DE SÃO PAULO em 16/Ago, segundo O Globo e o Times Brasil. NO PREÇO, leitura confirmada de 26/Ago, 15:19 BRT (18:19 UTC), em 0,05% (vol USD 14,06M acumulado), estável, abaixo do corte de 0,5% e sobre o MAIOR volume acumulado de todo o livro presidencial.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Estável em 0,05% (vol USD 14,06M acumulado), leitura confirmada de 26/Ago, 15:19 BRT (18:19 UTC). O contrato dele reúne o maior volume acumulado do livro e o preço mais baixo entre os nomes acompanhados, o que descreve um mercado onde muita gente já negociou a hipótese e hoje a trata como encerrada. 📌 Nesta quarta ele afirmou que Flávio Bolsonaro já explicou suas relações com Daniel Vorcaro, segundo O Globo, e essa é a única aparição dele no noticiário presidencial do dia."
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
