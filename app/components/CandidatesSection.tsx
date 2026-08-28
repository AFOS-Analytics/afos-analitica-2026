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
    poll: "PESQUISA NOVA NESTA QUINTA, E ELA TRAZ EMPATE TÉCNICO NOS DOIS TURNOS. A PoderData/Aya (n=2.400, telefone, campo 23 a 26/Ago, BR-04974/2026) lhe dá 38% no 1º turno contra 35%, e 45% no 2º turno contra 44%, os dois dentro da margem de 2pp. A comparação com a própria casa é o que informa: eram 41% a 35% em 13/Ago, seis pontos, e são três agora. Ele segue vencendo os quatro cenários de 2º turno testados. A BTG/Nexus de 24/Ago, de maior confiabilidade na régua da casa, o mantém em 41%. NO PREÇO, leitura confirmada de 27/Ago, 22:49 BRT (01:49 UTC de 28/Ago), em 57,50% (vol USD 9,30M acumulado), QUEDA de 5,00pp.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "QUEDA de 5,00pp, de 62,50% para 57,50% (vol USD 9,30M acumulado), leitura confirmada de 27/Ago, 22:49 BRT (01:49 UTC de 28/Ago), e ela foi contínua, em cinco leituras sucessivas ao longo do dia. ⭐ É O MENOR PATAMAR DESDE 01/Jul: a última leitura abaixo disso foi em 30/Jun às 16:30 UTC, com 55,50%, conferido no backup do banco contra o registro completo desde 14/Abr. SEM SUPERLATIVO DE TOPO: a maior leitura dele no período é 67,50%, de 16/Ago. A DISTÂNCIA para Flávio Bolsonaro estreitou de 26,95pp para 20,65pp, e desta vez ela encurtou pelos dois lados. ⛔ Isso NÃO é o vão mais estreito de nada: em maio o segundo colocado esteve à frente do primeiro. Ele foi à sabatina do Jornal Nacional nesta quinta, chamou as acusações sobre o filho de ilações e negou blindagem, segundo O Globo."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "36,85%",
    poll: "A PoderData/Aya de hoje o dá em 35% no 1º turno, a 3 pontos do líder, e em 44% no 2º turno, a 1 ponto. Os dois cenários ficam dentro da margem de 2pp, ou seja, empate técnico nos dois. A rejeição está empatada em 49% para os dois primeiros colocados. A Gerp de 26/Ago o dava À FRENTE no 1º turno com 38% e a Indexa/Broadcast o dava atrás com 34%, e as duas mediram na mesma semana. NO PREÇO, leitura confirmada de 27/Ago, 22:49 BRT (01:49 UTC de 28/Ago), em 36,85% (vol USD 9,11M acumulado), ALTA de 1,30pp.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "ALTA de 1,30pp, de 35,55% para 36,85% (vol USD 9,11M acumulado), leitura confirmada de 27/Ago, 22:49 BRT (01:49 UTC de 28/Ago). É a maior alta do dia entre os contratos de vencedor. ⭐ É o patamar mais alto dele desde 13/Mai, conferido no backup contra a série inteira desde 14/Abr: o último ponto acima disso foi em 13/Mai às 02:00 UTC, com 42,80%. ⛔ NÃO é recorde: o topo da série é 45,50%, de 06/Mai. 🔻 No contrato de 2º LUGAR do 1º turno ele CEDEU 3,00pp, de 87,50% para 84,50%, no mesmo dia em que Augusto Cury passou a valer 3,70% naquele contrato. 🏛️ A propaganda do adversário passou a circular com o áudio em que ele chama Daniel Vorcaro de irmão ao pedir dinheiro, segundo Estadão e Terra. O áudio foi revelado em maio pelo Intercept Brasil; o que é novo é o uso eleitoral."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "2,35%",
    poll: "A PoderData/Aya de hoje o mede em 4% no 1º turno, EMPATADO com Ronaldo Caiado e com Augusto Cury, e em 37% no 2º turno contra o líder. A Gerp de 26/Ago o dava em 3% e a Indexa em 4%. Na urna ele está onde estava nas rodadas anteriores. NO PREÇO, leitura confirmada de 27/Ago, 22:49 BRT (01:49 UTC de 28/Ago), em 2,35% (vol USD 11,65M acumulado). 🔴 No contrato de 3º LUGAR ele CEDEU 9,50pp e está em 36,00%, contra 33,50% de Caiado e 23,75% de Cury.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "🔴 O CONTRATO TOCOU O PISO DE TODA A SÉRIE NESTA QUINTA: o registro marcou 1,70% em quatro leituras seguidas, entre 19:00 e 00:00 UTC, e nenhum dos 350 pontos gravados desde 14/Abr ficou abaixo disso, conferido no backup do banco. Uma hora depois da captura das 21:46 ele já estava de volta a 2,35% (vol USD 11,65M acumulado), leitura confirmada de 27/Ago, 22:49 BRT (01:49 UTC de 28/Ago). É recuperação dentro do dia, não reversão de tendência: em 25/Ago ele valia 3,10%, e o máximo da série dele é 49,60%, de 28/Abr. 🔻 A MAIOR VARIAÇÃO ISOLADA DO PAINEL NO DIA está no contrato de 3º LUGAR: cedeu 9,50pp, de 45,50% para 36,00%, o menor patamar dele ali desde 27/Mai, e ele segue sendo o nome mais caro daquele contrato. Nesta quinta ele foi entrevistado no Jornal Nacional, disse que vai adotar regime de exceção em favelas e defendeu que o Brasil tenha bomba atômica, segundo Folha de S.Paulo."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "Nenhuma nacional da janela o testa em cenário presidencial de 1º turno, inclusive a PoderData/Aya de hoje. A pesquisa do JOTA divulgada em 26/Ago (BR-07806/2026, 6.000 entrevistas pela internet, campo de 27/Jul a 24/Ago) testou um cenário de 2º turno com ele no lugar de Lula, mas os números não saíram de forma que o painel pudesse conferir em fonte, e por isso nada dela entrou na tabela. NO PREÇO, leitura confirmada de 27/Ago, 22:49 BRT (01:49 UTC de 28/Ago), em 0,05% (vol USD 7,30M acumulado), estável e abaixo do corte de 0,5% que o painel usa para separar preço de ruído.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Ele NÃO é candidato à Presidência, então qualquer cenário presidencial que o inclua é hipótese de pesquisa, não candidatura em curso. O preço segue abaixo do corte de 0,5%, e nessa faixa a variação não sustenta interpretação. ⚠️ O caso Lulinha avançou em três frentes nesta quinta, com a PF apurando pedido de lobista, o advogado do filho do presidente pedindo investigação sobre vazamentos e o Ministério Público da Espanha analisando denúncia sobre uma empresa ligada ao caso, e nada disso passa pelo contrato dele."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,15%",
    poll: "A PoderData/Aya de hoje o mede em 4% no 1º turno, EMPATADO com Renan Santos e com Augusto Cury, e o coloca EMPATADO TECNICAMENTE com o líder no 2º turno, por 43% a 44%. A Indexa de 26/Ago o dava em 5% e a Gerp em 3%. NO PREÇO, leitura confirmada de 27/Ago, 22:49 BRT (01:49 UTC de 28/Ago), o cruzamento de contrato se repete: na VITÓRIA ele cedeu 0,30pp e está em 0,15% (vol USD 6,80M acumulado); no 3º LUGAR do 1º turno cedeu 5,50pp e está em 33,50%. São perguntas diferentes e o painel não as soma.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "QUEDA nos dois contratos: 0,30pp no de vencedor, para 0,15% (vol USD 6,80M acumulado), leitura confirmada de 27/Ago, 22:49 BRT (01:49 UTC de 28/Ago), abaixo do corte de 0,5%; e 5,50pp no de 3º LUGAR, para 33,50%, o menor patamar dele ali desde 14/Ago. ⭐ E A URNA DIZ O OPOSTO: a PoderData o dá empatado tecnicamente com o líder no 2º turno, por 43% a 44%, o segundo cenário de returno mais apertado da rodada. É um caso em que o preço de vencedor e a intenção de voto no returno apontam para lados diferentes, e o painel publica os dois sem escolher. O contrato de impeachment de ministro do STF não se moveu: segue em 3,40%, quarto dia seguido."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,15%",
    poll: "A PoderData/Aya de hoje o mede em 2% no 1º turno e o coloca EMPATADO TECNICAMENTE com o líder no 2º turno, por 43% a 44%. A Gerp e a Indexa de 26/Ago o mediam em 1% cada uma e a BTG/Nexus de 24/Ago em 3%, então os 2% de hoje ficam no meio dessa amplitude. NO PREÇO, leitura confirmada de 27/Ago, 22:49 BRT (01:49 UTC de 28/Ago), em 0,15% (vol USD 6,21M acumulado), sem variação e abaixo do corte de 0,5%.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "SEM VARIAÇÃO em 0,15% (vol USD 6,21M acumulado), leitura confirmada de 27/Ago, 22:49 BRT (01:49 UTC de 28/Ago), abaixo do corte de 0,5% que o painel usa para separar preço de ruído. ⭐ E ele é o segundo caso do dia em que urna e preço apontam para lados diferentes: a PoderData o dá empatado tecnicamente com o líder no 2º turno, por 43% a 44%, com o contrato de vencedor no piso da tabela. As quatro casas da semana o medem entre 1% e 3% no 1º turno, e a diferença entre institutos segue maior do que qualquer movimento do preço."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "Nenhuma nacional da janela o inclui em cenário presidencial, inclusive a PoderData/Aya de hoje. A ressalva do painel segue valendo como ato datado: ele abriu campanha ao GOVERNO DE SÃO PAULO em 16/Ago, segundo O Globo e o Times Brasil. NO PREÇO, leitura confirmada de 27/Ago, 22:49 BRT (01:49 UTC de 28/Ago), em 0,05% (vol USD 14,06M acumulado), estável, abaixo do corte de 0,5% e sobre o MAIOR volume acumulado de todo o livro presidencial.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Estável em 0,05% (vol USD 14,06M acumulado), leitura confirmada de 27/Ago, 22:49 BRT (01:49 UTC de 28/Ago). O contrato dele reúne o maior volume acumulado do livro e o preço mais baixo entre os nomes acompanhados, o que descreve um mercado onde muita gente já negociou a hipótese e hoje a trata como encerrada. 📌 Ele voltou ao noticiário nesta quinta afirmando que o caso Dark Horse está esclarecido mesmo sem explicações de Flávio Bolsonaro, segundo Folha de S.Paulo."
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
