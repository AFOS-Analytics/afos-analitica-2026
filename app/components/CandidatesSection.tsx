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
    polymarket: "63,50%",
    poll: "⭐ NACIONAL NOVA EM 21/Ago: a Veritá (n=3.840, campo 16 a 20/Ago, BR-04006/2026, margem de 2pp) lhe dá 39,3% no 1º turno, contra 39,1% do segundo colocado, ou seja EMPATE TÉCNICO dentro da margem, e 42% no 2º turno contra 47,3%. Quatro dias antes a BTG/Nexus media 41% x 36%, cinco pontos de vantagem. ⚠️ Os dois institutos não medem o mesmo cenário: esta rodada inclui Pablo Marçal e a anterior não, e a Veritá tem confiabilidade 2 na régua da casa contra 4 da BTG/Nexus. O painel publica as duas e declara a diferença. NO PREÇO, leitura confirmada de 21/Ago, 15:59 BRT (18:59 UTC), em 63,50% (vol USD 8,80M acumulado), SEM VARIAÇÃO pelo quarto dia seguido.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "SEM VARIAÇÃO pelo QUARTO dia seguido, em 63,50% (vol USD 8,80M acumulado), leitura confirmada de 21/Ago, 15:59 BRT (18:59 UTC). A DISTÂNCIA para Flávio Bolsonaro encurtou 0,20pp e foi a 30,45pp, no QUINTO dia seguido de aproximação: eram 37,05pp em 16/Ago, 33,05pp em 17, 31,45pp em 18, 30,95pp em 19 e 30,65pp em 20, somando 6,60pp em cinco dias. A FONTE DO ENCURTAMENTO MUDOU NO MEIO: dos 6,60pp, 3,00pp saíram dele, todos entre 16 e 18/Ago, e ele está parado há quatro dias. A URNA VOLTOU A FALAR: a Veritá de 21/Ago mede empate técnico no 1º turno, 39,3% contra 39,1%, e o põe atrás no 2º turno, 42% contra 47,3%. SEM SUPERLATIVO: o topo da série segue em 67,50%, de 16/Ago."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "33,05%",
    poll: "⭐ NACIONAL NOVA EM 21/Ago: a Veritá o leva a 39,1% no 1º turno, a 0,2 ponto do líder, e a 47,3% no 2º turno contra 42%. É o primeiro returno deste recorte em que uma nacional o põe à frente. ⚠️ A BTG/Nexus de 17/Ago, de confiabilidade 4 contra 2 da Veritá, o media em 36% e 44%. NO PREÇO, leitura confirmada de 21/Ago, 15:59 BRT (18:59 UTC), em 33,05% (vol USD 8,72M acumulado), alta de 0,20pp e quinto dia seguido encurtando a distância para o líder. ⛔ NÃO é recorde: na série de 174 leituras desde 23/Mai, só 2 marcam 33,05% ou acima, e as duas são 33,20%, de 02/Jun e de 18/Ago.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "ALTA de 0,20pp, de 32,85% para 33,05% (vol USD 8,72M acumulado), leitura confirmada de 21/Ago, 15:59 BRT (18:59 UTC), QUINTO dia seguido encurtando a distância para o líder, que foi a 30,45pp. NA URNA, a Veritá de 21/Ago o põe a 0,2 ponto no 1º turno, 39,1% contra 39,3%, e à frente no 2º turno, 47,3% contra 42%. SEM SUPERLATIVO: 33,05% não é recorde, e o topo da série de 174 leituras desde 23/Mai é 33,20%, de 02/Jun e 18/Ago. NÃO HÁ leitura nova confirmada em 21/Ago para o contrato de 2º lugar, que segue em 87,50% desde 20/Ago."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "4,30%",
    poll: "⭐ NACIONAL NOVA EM 21/Ago: a Veritá o dá em 3,8% no 1º turno, ATRÁS de Pablo Marçal, que é testado pela primeira vez numa nacional e aparece com 5,2%, e à frente de Ronaldo Caiado, com 3,3%. NO PREÇO, leitura confirmada de 21/Ago, 15:59 BRT (18:59 UTC), em 4,30% (vol USD 10,46M acumulado), queda de 0,15pp. No contrato de 3º LUGAR ele segue em 55,50%, contra 35,00% de Caiado. ⭐ Os dois universos discordam de quem é o terceiro, e agora com um nome novo na conta: o mercado o mantém como terceiro provável e a urna põe Marçal nesse lugar.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "QUEDA de 0,15pp, de 4,45% para 4,30% (vol USD 10,46M acumulado), leitura confirmada de 21/Ago, 15:59 BRT (18:59 UTC). No contrato de 3º LUGAR segue em 55,50%, contra 35,00% de Ronaldo Caiado, que subiu 0,50pp. NA URNA, a Veritá de 21/Ago o põe em 3,8%, ATRÁS de Pablo Marçal, que estreia com 5,2%: o preço o mantém como terceiro provável e a pesquisa põe outro nome nesse lugar."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "Nenhuma nacional da janela o testa em cenário presidencial, e a Veritá de 21/Ago também não. Ausência de teste é informação que o painel registra, em vez de repetir dado antigo como se fosse novo. NO PREÇO, leitura confirmada de 21/Ago, 15:59 BRT (18:59 UTC), em 0,05% (vol USD 7,28M acumulado), estável e abaixo do corte de 0,5% que o painel usa para separar preço de ruído.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Ele NÃO é candidato à Presidência e disputa o governo de São Paulo, então qualquer cenário presidencial que o inclua é hipótese de pesquisa, não candidatura em curso. O preço segue abaixo do corte de 0,5% que o painel usa para separar preço de ruído, e nessa faixa a variação não sustenta interpretação."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,45%",
    poll: "🔴 NACIONAL NOVA EM 21/Ago E ELA O REBAIXA: a Veritá lhe dá 3,3% no 1º turno, atrás de Pablo Marçal (5,2%) e de Renan Santos (3,8%), quando a BTG/Nexus de 17/Ago o tinha em 5% e à frente dos dois. NO PREÇO, leitura confirmada de 21/Ago, 15:59 BRT (18:59 UTC), o cruzamento de contrato se repete com sinal trocado: na VITÓRIA ele subiu de 0,35% para 0,45% (vol USD 6,42M acumulado), ainda abaixo do piso de 0,5%; na POSIÇÃO, o 3º lugar do 1º turno subiu 0,50pp e está em 35,00%. São perguntas diferentes e o painel não as soma.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "ALTA de 0,10pp, de 0,35% para 0,45% (vol USD 6,42M acumulado), leitura confirmada de 21/Ago, 15:59 BRT (18:59 UTC), ainda abaixo do corte de 0,5% que o painel usa para separar preço de ruído. No contrato de 3º lugar subiu 0,50pp, para 35,00%. NA URNA ele caiu de 5% na BTG/Nexus de 17/Ago para 3,3% na Veritá de 21/Ago, e passou a figurar atrás de Marçal e de Renan Santos."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,15%",
    poll: "NACIONAL NOVA EM 21/Ago: a Veritá lhe dá 1,3% no 1º turno, o menor valor dele no recorte de 30 dias, quando a BTG/Nexus de 17/Ago media 4%. NO PREÇO, leitura confirmada de 21/Ago, 15:59 BRT (18:59 UTC), em 0,15% (vol USD 5,80M acumulado), sem variação e abaixo do corte de 0,5%. No contrato de 3º lugar ele tem 4,90%.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "SEM VARIAÇÃO em 0,15% (vol USD 5,80M acumulado), leitura confirmada de 21/Ago, 15:59 BRT (18:59 UTC), abaixo do corte de 0,5% que o painel usa para separar preço de ruído. No contrato de 3º lugar ele tem 4,90%. NA URNA, a Veritá de 21/Ago lhe dá 1,3%, contra 4% na BTG/Nexus de 17/Ago."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "Nenhuma nacional da janela o inclui em cenário presidencial, e a Veritá de 21/Ago também não. A ressalva do painel segue valendo como ato datado: ele abriu campanha ao GOVERNO DE SÃO PAULO em 16/Ago, segundo O Globo e o Times Brasil. Ele não é candidato à Presidência, e qualquer cenário presidencial que o inclua é hipótese de pesquisa, não candidatura em curso. NO PREÇO, leitura confirmada de 21/Ago, 15:59 BRT (18:59 UTC), em 0,05% (vol USD 14,00M acumulado), estável, abaixo do corte de 0,5% e sobre o MAIOR volume acumulado de todo o book presidencial.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Ele abriu campanha à REELEIÇÃO ao governo de São Paulo em 16/Ago e não é candidato à Presidência. Em 18/Ago defendeu ajuste fiscal suave e disse que o Brasil não precisa da solução do Milei, segundo o Valor Econômico. O contrato dele segue com preço no piso e sobre o MAIOR volume acumulado de todo o livro presidencial, acima do próprio líder. Volume alto com probabilidade no piso é convicção já precificada num desfecho que a realidade descartou."
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
