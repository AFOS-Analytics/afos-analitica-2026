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
    poll: "SEM NACIONAL NOVA NESTA TERÇA. A mais recente segue sendo a BTG/Nexus de 24/Ago (n=2.006, campo 21 a 23/Ago, BR-09028/2026, margem de 2pp, confiabilidade 4), que lhe dá 41% no 1º turno sem Pablo Marçal e 40% no cenário com ele, e 46% no 2º turno contra 45%. A leva divulgada hoje pela Quaest é toda ESTADUAL e não entra neste painel, que só cruza escopo nacional. ⚠️ Na rodada da BTG/Nexus ele é o candidato MAIS REJEITADO, com 49% contra 48% do segundo colocado, segundo Poder360. NO PREÇO, leitura confirmada de 25/Ago, 15:22 BRT (18:22 UTC), em 62,50% (vol USD 8,97M acumulado), SEM VARIAÇÃO pelo segundo dia seguido.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "SEM VARIAÇÃO em 62,50% (vol USD 8,97M acumulado), leitura confirmada de 25/Ago, 15:22 BRT (18:22 UTC), segundo dia seguido parado. A DISTÂNCIA para Flávio Bolsonaro voltou a ABRIR, de 27,45pp para 27,85pp, e ela abriu sem que ele ganhasse nada: quem cedeu foi o outro lado. ⚠️ Movimento nessa faixa é rotina deste livro: contra a série inteira desde 14/Abr, conferida no backup do banco, a menor distância já registrada entre os dois é NEGATIVA em 8,00pp, de 06/Mai. SEM SUPERLATIVO: a maior leitura dele desde 14/Abr é 67,50%, de 16/Ago. Ele confirmou presença na sabatina do Jornal Nacional, marcada para 27/Ago, segundo Valor Econômico, Poder360 e Metrópoles de 25/Ago, depois de ter faltado ao debate da Band em 23/Ago."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "34,65%",
    poll: "SEM NACIONAL NOVA NESTA TERÇA. A BTG/Nexus de 24/Ago segue sendo a mais recente e o dá em 37% no cenário sem Pablo Marçal e 34% no cenário com ele, e em 45% no 2º turno contra 46%. NO PREÇO, leitura confirmada de 25/Ago, 15:22 BRT (18:22 UTC), em 34,65% (vol USD 8,89M acumulado), QUEDA de 0,40pp, devolvendo parte da alta de 1,80pp de ontem. ⭐ No contrato de 2º LUGAR do 1º turno ele foi na direção CONTRÁRIA e subiu 2,00pp, para 87,50%.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "QUEDA de 0,40pp, de 35,05% para 34,65% (vol USD 8,89M acumulado), leitura confirmada de 25/Ago, 15:22 BRT (18:22 UTC). ⭐ O DIA DELE TEM DOIS SINAIS OPOSTOS: cedeu no contrato de vitória e subiu 2,00pp no de 2º lugar, chegando a 87,50%. O mercado ficou mais convicto de que ele CHEGA ao 2º turno e um pouco menos convicto de que ele VENCE, e as duas perguntas não se somam. Mesmo com a queda, o patamar segue o mais alto desde 13/Mai, conferido no backup contra a série inteira desde 14/Abr. ⛔ NÃO é recorde: o topo da série é 45,50%, de 06/Mai, e o preço de hoje está 10,85pp abaixo dele. 🏛️ O Globo de 25/Ago registra que ele administra o desgaste do caso Dark Horse depois da decisão do ministro Flávio Dino."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "2,95%",
    poll: "SEM NACIONAL NOVA NESTA TERÇA. A BTG/Nexus de 24/Ago segue o dando em 3% no 1º turno, o MENOR valor dele na janela de 30 dias, atrás de Ronaldo Caiado, que tem 5%. NO PREÇO, leitura confirmada de 25/Ago, 15:22 BRT (18:22 UTC), em 2,95% (vol USD 11,09M acumulado), alta de 0,05pp que fica abaixo do que a dupla leitura distingue de ruído. 🔴 No contrato de 3º LUGAR ele CEDEU 2,50pp e está em 51,50%, contra 42,00% de Caiado. ⭐ O vão entre os dois caiu de 15,00pp para 9,50pp, ou seja, o preço andou na direção da ordem que a urna já mostrava, sem que a ordem do contrato se invertesse.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "No presidencial, alta de 0,05pp para 2,95% (vol USD 11,09M acumulado), leitura confirmada de 25/Ago, 15:22 BRT (18:22 UTC), movimento abaixo do que a dupla leitura distingue de ruído. 🔴 A MAIOR PERDA DO PAINEL NO DIA é dele e está no contrato de 3º LUGAR: cedeu 2,50pp, para 51,50%, enquanto Ronaldo Caiado subia 3,00pp. ⚠️ O vão de 9,50pp NÃO é piso da série: o mesmo livro esteve em 3,5pp em 22/Ago às 19h30, e o fechamento daquele dia marcava 15,5pp. Fechamento de dia esconde piso, e por isso a conferência foi feita no backup, ponto a ponto. A BBC de 24/Ago registra que ele liderou as atenções nas redes durante o debate de 23/Ago."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "Nenhuma nacional da janela o testa em cenário presidencial. Ausência de teste é informação que o painel registra, em vez de repetir dado antigo como se fosse novo. NO PREÇO, leitura confirmada de 25/Ago, 15:22 BRT (18:22 UTC), em 0,05% (vol USD 7,30M acumulado), estável e abaixo do corte de 0,5% que o painel usa para separar preço de ruído.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Ele NÃO é candidato à Presidência e disputa o governo de São Paulo, então qualquer cenário presidencial que o inclua é hipótese de pesquisa, não candidatura em curso. O preço segue abaixo do corte de 0,5% que o painel usa para separar preço de ruído, e nessa faixa a variação não sustenta interpretação."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,55%",
    poll: "SEM NACIONAL NOVA NESTA TERÇA. A BTG/Nexus de 24/Ago o mantém em 5% no 1º turno e à FRENTE de Renan Santos, que tem 3%. A mesma pesquisa o testou em 2º turno contra o líder e mediu 46% a 42%, segundo Metrópoles. NO PREÇO, leitura confirmada de 25/Ago, 15:22 BRT (18:22 UTC), o cruzamento de contrato se repete com sinal trocado: na VITÓRIA ele cedeu 0,15pp e voltou a 0,55% (vol USD 6,59M acumulado); na POSIÇÃO, o 3º lugar do 1º turno SUBIU 3,00pp e está em 42,00%. São perguntas diferentes e o painel não as soma.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "⭐ A MAIOR ALTA DO PAINEL NO DIA é dele: 3,00pp no contrato de 3º LUGAR, chegando a 42,00%. No presidencial ele foi na direção contrária, com queda de 0,15pp para 0,55% (vol USD 6,59M acumulado), leitura confirmada de 25/Ago, 15:22 BRT (18:22 UTC), de volta ao piso de 0,5% que o painel usa para separar preço de ruído. O movimento do 3º lugar aproxima o preço da ordem que a urna já mostrava, que o põe à frente por 5% a 3%, e a ordem do contrato NÃO se inverteu: o adversário segue com 51,50%. ⭐ E ELE FOI O SABATINADO DO JORNAL NACIONAL EM 25/Ago, o segundo da série que Romeu Zema abriu em 24/Ago. Ele também participou do primeiro debate presidencial, em 23/Ago."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,25%",
    poll: "SEM NACIONAL NOVA NESTA TERÇA. A BTG/Nexus de 24/Ago lhe dá 3% no 1º turno, o mesmo patamar que a casa vem medindo desde 03/Ago. A Veritá de 21/Ago lhe dava 1,3%, o menor valor dele no recorte de 30 dias. NO PREÇO, leitura confirmada de 25/Ago, 15:22 BRT (18:22 UTC), em 0,25% (vol USD 5,98M acumulado), queda de 0,05pp e abaixo do corte de 0,5%.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "QUEDA de 0,05pp, de 0,30% para 0,25% (vol USD 5,98M acumulado), leitura confirmada de 25/Ago, 15:22 BRT (18:22 UTC), abaixo do corte de 0,5% que o painel usa para separar preço de ruído. ⭐ A EXPOSIÇÃO DELE FOI EM 24/Ago E A COBERTURA CIRCULOU EM 25/Ago: ele ABRIU a série de sabatinas do Jornal Nacional, 40 minutos com Renata Vasconcellos e César Tralli, segundo BBC e O Globo. Em 25/Ago foi sabatinado de novo, por CBN, O Globo e Valor. Nas sabatinas minimizou a situação fiscal de Minas Gerais, criticou o STF, disse que o Judiciário é usado para fazer política, não garantiu aumento real do salário mínimo e buscou se afastar de acusações de ligação da Cemig com o Banco Master. O contrato não registrou nada disso."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "Nenhuma nacional da janela o inclui em cenário presidencial. A ressalva do painel segue valendo como ato datado: ele abriu campanha ao GOVERNO DE SÃO PAULO em 16/Ago, segundo O Globo e o Times Brasil. Ele não é candidato à Presidência, e qualquer cenário presidencial que o inclua é hipótese de pesquisa, não candidatura em curso. NO PREÇO, leitura confirmada de 25/Ago, 15:22 BRT (18:22 UTC), em 0,05% (vol USD 14,03M acumulado), estável, abaixo do corte de 0,5% e sobre o MAIOR volume acumulado de todo o livro presidencial.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Ele abriu campanha à REELEIÇÃO ao governo de São Paulo em 16/Ago e não é candidato à Presidência. O contrato dele segue com preço no piso e sobre o MAIOR volume acumulado de todo o livro presidencial, USD 14,03M, acima do próprio líder. Volume alto com probabilidade no piso é convicção já precificada num desfecho que a realidade descartou. 🏛️ Em 25/Ago ele declarou que a polícia cumprirá decisão do STF e enviará à PF provas sobre uma ONG ligada ao caso Dark Horse, segundo O Globo."
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
