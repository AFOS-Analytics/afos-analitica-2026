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
    poll: "⭐ NACIONAL NOVA EM 24/Ago: a BTG/Nexus (n=2.006, campo 21 a 23/Ago, BR-09028/2026, margem de 2pp, confiabilidade 4) lhe dá 41% no 1º turno sem Pablo Marçal e 40% no cenário com ele, e 46% no 2º turno contra 45%. Ele lidera os dois cenários. ⚠️ Na mesma rodada ele é o candidato MAIS REJEITADO, com 49% contra 48% do segundo colocado, segundo Poder360. NO PREÇO, leitura confirmada de 24/Ago, 18:25 BRT (21:25 UTC), em 62,50% (vol USD 8,92M acumulado), SEM VARIAÇÃO em relação a 23/Ago.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "SEM VARIAÇÃO em 62,50% (vol USD 8,92M acumulado), leitura confirmada de 24/Ago, 18:25 BRT (21:25 UTC). A DISTÂNCIA para Flávio Bolsonaro encurtou 1,80pp e foi a 27,45pp, a menor desde 21/Jun pelo critério de fechamento diário. ⭐ A FONTE DO ENCURTAMENTO É INTEIRA DO OUTRO LADO: ele ficou parado e o adversário subiu 1,80pp. ⚠️ Estreitamento não é inédito nesta série: em 05/Mai a distância chegou a ser NEGATIVA em 7,80pp. SEM SUPERLATIVO: a maior leitura dele desde 14/Abr é 67,50%, de 16/Ago. Ele não participou do primeiro debate presidencial, em 23/Ago."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "35,05%",
    poll: "⭐ NACIONAL NOVA EM 24/Ago: a BTG/Nexus o dá em 37% no cenário sem Pablo Marçal e 34% no cenário com ele, e em 45% no 2º turno contra 46%. Contra a rodada da MESMA casa em 17/Ago ele sobe 1 ponto no 1º turno, movimento que cabe inteiro dentro da margem de 2pp. ⚠️ A distância no 2º turno caiu de 3 pontos para 1, mas NÃO é mínimo da série: a mesma casa já mediu 46 a 45 em 03/Ago. NO PREÇO, leitura confirmada de 24/Ago, 18:25 BRT (21:25 UTC), em 35,05% (vol USD 8,84M acumulado), ALTA de 1,80pp, a maior do livro no dia.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "ALTA de 1,80pp, de 33,25% para 35,05% (vol USD 8,84M acumulado), leitura confirmada de 24/Ago, 18:25 BRT (21:25 UTC). ⭐ É o valor mais alto dele desde 13/Mai, conferido ponto a ponto contra os 341 registros da série desde 14/Abr. ⛔ NÃO é recorde: o topo da série é 45,50%, de 06/Mai, e o preço de hoje está 10,45pp abaixo dele. NA URNA, a BTG/Nexus de 24/Ago mede o 2º turno em 46% a 45%. No contrato de 2º lugar do 1º turno ele paga 85,50%, com queda de 1,00pp."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "2,90%",
    poll: "🔴 NACIONAL NOVA EM 24/Ago E ELA O REBAIXA: a BTG/Nexus o dá em 3% no 1º turno, o MENOR valor dele na janela de 30 dias, contra 4% na rodada da mesma casa em 17/Ago. Ele fica empatado com Romeu Zema e atrás de Ronaldo Caiado, que tem 5%. NO PREÇO, leitura confirmada de 24/Ago, 18:25 BRT (21:25 UTC), em 2,90% (vol USD 10,94M acumulado), queda de 0,55pp. No contrato de 3º LUGAR ele tem 54,00%, com queda de 2,00pp, contra 39,00% de Caiado. ⭐ Os dois universos seguem discordando de quem é o terceiro: a urna o põe atrás de Caiado e o preço o põe 15,00pp à frente.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "QUEDA de 0,55pp, de 3,45% para 2,90% (vol USD 10,94M acumulado), leitura confirmada de 24/Ago, 18:25 BRT (21:25 UTC). No contrato de 3º LUGAR cedeu 2,00pp e está em 54,00%, contra 39,00% de Ronaldo Caiado, que também cedeu 2,00pp. NA URNA, a BTG/Nexus de 24/Ago o põe em 3%, o menor valor dele na janela. Os dois instrumentos caíram juntos no dia, o que é raro no caso dele. Ele foi um dos três que compareceram ao debate de 23/Ago."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "Nenhuma nacional da janela o testa em cenário presidencial, e a BTG/Nexus de 24/Ago também não. Ausência de teste é informação que o painel registra, em vez de repetir dado antigo como se fosse novo. NO PREÇO, leitura confirmada de 24/Ago, 18:25 BRT (21:25 UTC), em 0,05% (vol USD 7,30M acumulado), estável e abaixo do corte de 0,5% que o painel usa para separar preço de ruído.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Ele NÃO é candidato à Presidência e disputa o governo de São Paulo, então qualquer cenário presidencial que o inclua é hipótese de pesquisa, não candidatura em curso. O preço segue abaixo do corte de 0,5% que o painel usa para separar preço de ruído, e nessa faixa a variação não sustenta interpretação."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,70%",
    poll: "NACIONAL NOVA EM 24/Ago: a BTG/Nexus o mantém em 5% no 1º turno, mesmo valor da rodada anterior da casa, e o coloca à FRENTE de Renan Santos, que caiu para 3%. A mesma pesquisa o testou em 2º turno contra o líder e mediu 46% a 42%, segundo Metrópoles. NO PREÇO, leitura confirmada de 24/Ago, 18:25 BRT (21:25 UTC), o cruzamento de contrato se repete com sinal trocado: na VITÓRIA ele subiu 0,15pp e passou a 0,70% (vol USD 6,55M acumulado), acima do piso de 0,5%; na POSIÇÃO, o 3º lugar do 1º turno cedeu 2,00pp e está em 39,00%. São perguntas diferentes e o painel não as soma.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "ALTA de 0,15pp, de 0,55% para 0,70% (vol USD 6,55M acumulado), leitura confirmada de 24/Ago, 18:25 BRT (21:25 UTC), voltando a ficar acima do corte de 0,5% que o painel usa para separar preço de ruído. No contrato de 3º lugar cedeu 2,00pp, para 39,00%. NA URNA ele segue em 5% na BTG/Nexus de 24/Ago e passou a figurar à frente de Renan Santos, que caiu para 3%. Ele participou do primeiro debate presidencial, em 23/Ago."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,30%",
    poll: "NACIONAL NOVA EM 24/Ago: a BTG/Nexus lhe dá 3% no 1º turno, o mesmo patamar que a casa vem medindo desde 03/Ago, o que o empata com Renan Santos nesta rodada. A Veritá de 21/Ago lhe dava 1,3%, o menor valor dele no recorte de 30 dias. NO PREÇO, leitura confirmada de 24/Ago, 18:25 BRT (21:25 UTC), em 0,30% (vol USD 5,93M acumulado), queda de 0,15pp e abaixo do corte de 0,5%. No contrato de 3º lugar ele tem 2,25%.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "QUEDA de 0,15pp, de 0,45% para 0,30% (vol USD 5,93M acumulado), leitura confirmada de 24/Ago, 18:25 BRT (21:25 UTC), abaixo do corte de 0,5% que o painel usa para separar preço de ruído. No contrato de 3º lugar ele tem 2,25%. 🔴 Ele DESISTIU do primeiro debate presidencial às 12h01 de 23/Ago, depois de confirmadas as ausências dos dois primeiros colocados, segundo a Gazeta do Povo."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "Nenhuma nacional da janela o inclui em cenário presidencial, e a BTG/Nexus de 24/Ago também não. A ressalva do painel segue valendo como ato datado: ele abriu campanha ao GOVERNO DE SÃO PAULO em 16/Ago, segundo O Globo e o Times Brasil. Ele não é candidato à Presidência, e qualquer cenário presidencial que o inclua é hipótese de pesquisa, não candidatura em curso. NO PREÇO, leitura confirmada de 24/Ago, 18:25 BRT (21:25 UTC), em 0,05% (vol USD 14,03M acumulado), estável, abaixo do corte de 0,5% e sobre o MAIOR volume acumulado de todo o livro presidencial.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Ele abriu campanha à REELEIÇÃO ao governo de São Paulo em 16/Ago e não é candidato à Presidência. O contrato dele segue com preço no piso e sobre o MAIOR volume acumulado de todo o livro presidencial, USD 14,03M, acima do próprio líder. Volume alto com probabilidade no piso é convicção já precificada num desfecho que a realidade descartou."
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
