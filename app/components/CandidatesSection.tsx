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
    polymarket: "64,50%",
    poll: "NACIONAL NOVA EM 17/Ago: a BTG/Nexus (n=2.003, telefone, campo 14 a 16/Ago, BR-03317/2026, margem de 2pp) lhe dá 41% no 1º turno e 47% no returno. ⭐ CONTRA A PRÓPRIA CASA É ESTABILIDADE: ele saiu de 40% para 41%, o adversário de 35% para 36%, e a DISTÂNCIA ficou nos mesmos 5 pontos. No returno o resultado é IDÊNTICO, 47 a 44. Cada movimento de 1 ponto cabe dentro da margem. NO PREÇO, leitura confirmada de 17/Ago, 18:48 BRT (21:48 UTC), com a trava aprovada em DUAS passadas. Em 64,50% (vol USD 8,52M acumulado), queda de 2,00pp, devolvendo o que subiu na véspera. A distância para o segundo colocado FECHOU de 37,05pp para 33,05pp. ⛔ Sem superlativo: o topo da série segue em 66,50%, de 01/Ago, e 5 dos 90 dias gravados desde 19/Mai estão acima do fechamento de hoje.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "SEM PREÇO CERTIFICADO EM 18/Ago, E ISSO É O REGISTRO DO DIA. A trava de captura do AFOS faz duas leituras separadas por 8 minutos e só libera se concordarem dentro de 0,20pp; ela rodou CINCO vezes entre 20:30 e 21:37 e bloqueou as cinco. Nas dez leituras dessa janela ele apareceu em 63,50% em TODAS, com amplitude de 0,00pp, o contrato mais estável do livro, mas a trava certifica a captura inteira ou nenhuma. O valor ao lado é o de 17/Ago, 18:48 BRT. NENHUMA PESQUISA NACIONAL NOVA: a última segue sendo a Nexus/BTG de 17/Ago. Em pesquisas ESTADUAIS de hoje ele aparece atrás no Paraná, com 35% contra 52% no 2º turno, e à frente em Pernambuco, com 58% contra 24%; estadual não entra no painel nacional e está aqui como cobertura. Datafolha e Veritá publicam em 21/Ago, as duas já em campo."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "31,45%",
    poll: "NACIONAL NOVA EM 17/Ago: a BTG/Nexus o leva de 35% para 36% no 1º turno e repete 44% no returno. ⚠️ O ganho de 1 ponto está dentro da margem de 2pp da casa, e a distância para o líder NÃO mudou, segue em 5 pontos. NO PREÇO, leitura confirmada de 17/Ago, 18:48 BRT (21:48 UTC). Em 31,45% (vol USD 8,46M acumulado), ALTA DE 2,00pp, quarto dia seguido subindo e o maior movimento do dia entre os contratos grandes. ⛔ NÃO é recorde: dos 90 dias da série desde 19/Mai, 2 estão acima, e o topo é 33,20%, de 02/Jun. ⚠️ CAUSAÇÃO: a pesquisa do dia não encurtou distância nenhuma, então ela não explica o encurtamento de 4,00pp no preço. Passou o dia em atrito no próprio campo, acusando Caiado de ajudar o líder depois de Kassab dizer que Caiado tem chance zero, segundo o Estadão.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "SEM PREÇO CERTIFICADO EM 18/Ago, e ele foi um dos contratos que impediram a certificação: discordou 0,30pp entre amostras no presidencial, lido entre 32,45% e 32,75%, e 1,00pp no livro de segundo lugar, entre 86,50% e 87,50%. O valor ao lado é o de 17/Ago, 18:48 BRT. SEM SUPERLATIVO: o topo da série de 88 dias é 33,20%, de 02/Jun, e nenhuma leitura desta noite o superou. Em pesquisa ESTADUAL do Paraná ele aparece com 52% contra 35% no 2º turno, segundo Poder360 e CartaCapital, e estadual não entra no painel nacional."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "4,05%",
    poll: "NACIONAL NOVA EM 17/Ago: a BTG/Nexus o mantém em 4% no 1º turno. 🔴 ELE APARECE ATRÁS DE CAIADO, que tem 5%, e empatado com Zema, que tem 4%. NO PREÇO, leitura confirmada de 17/Ago, 18:48 BRT (21:48 UTC). Em 4,05% (vol USD 9,95M acumulado), queda continuada, e o valor fica ABAIXO do piso de 4,80% gravado na série de 90 dias. ⚠️ RESSALVA DE FORMA: o book dele é fino e oscilou entre 3,75% e 4,15% em menos de dez minutos durante a captura, então o movimento merece leitura mais frouxa que a dos dois primeiros. No contrato de 3º LUGAR ele cedeu de 53,00% para 52,50%, e a distância para o segundo daquele book encolheu de 15,50pp para 14,00pp. ⭐ Os dois universos discordam sobre quem é o terceiro: a pesquisa põe Caiado à frente, o mercado põe ele.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "SEM PREÇO CERTIFICADO EM 18/Ago, e o comportamento dele separa duas coisas. No contrato PRESIDENCIAL ficou parado em 3,95% nas dez leituras da noite, com amplitude de 0,00pp. Nos contratos de POSIÇÃO se mexeu: 0,35pp no de segundo lugar e 0,50pp no de terceiro, onde foi lido entre 56,50% e 57,00%. O piso da série de 88 dias foi tocado em 18/Ago, com 3,60%, contra teto de 17,90% em 09/Jun. A DIVERGÊNCIA COM A URNA CONTINUA: a Nexus/BTG de 17/Ago dá 5% a Caiado e 4% a ele, enquanto o mercado o mantém muito à frente no contrato de terceiro lugar."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "Nenhuma nacional da janela o inclui em cenário presidencial, e a BTG/Nexus de 17/Ago também não. A ressalva do painel segue valendo como ato datado: ele abriu campanha ao GOVERNO DE SÃO PAULO em 16/Ago, segundo O Globo e o Times Brasil. Ele não é candidato à Presidência, e qualquer cenário presidencial que o inclua é hipótese de pesquisa, não candidatura em curso. NO PREÇO, leitura confirmada de 17/Ago, 18:48 BRT (21:48 UTC). Em 0,05% (vol USD 7,20M acumulado), estável e abaixo do corte de 0,5% que o painel usa para separar preço de ruído.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "SEM PREÇO CERTIFICADO EM 18/Ago. Ele NÃO é candidato à Presidência e disputa o governo de São Paulo, então qualquer cenário presidencial que o inclua é hipótese de pesquisa, não candidatura em curso. O preço segue abaixo do corte de 0,5% que o painel usa para separar preço de ruído, e nessa faixa a variação não sustenta interpretação."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,25%",
    poll: "⭐ NACIONAL NOVA EM 17/Ago E ELA O PROMOVE: a BTG/Nexus lhe dá 5% no 1º turno, ACIMA dos 4% de Renan Santos. Na intenção declarada ele passa a ser o terceiro nome do quadro. NO PREÇO, leitura confirmada de 17/Ago, 18:48 BRT (21:48 UTC), o cruzamento de contrato se repete e troca de sinal: na VITÓRIA ele caiu de 0,60% para 0,25% (vol USD 6,07M acumulado), abaixo do piso de 0,50% da série de 90 dias; na POSIÇÃO ele SUBIU, com o 3º lugar do 1º turno indo de 37,50% para 38,50%, e a distância dele para o primeiro daquele book fechou de 15,50pp para 14,00pp. São perguntas diferentes e o painel não as soma. Kassab, vice na chapa dele, disse que ele tem chance zero e depois afirmou que foi mal interpretado, segundo Folha de S.Paulo e Estadão.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "SEM PREÇO CERTIFICADO EM 18/Ago. Ele ficou ESTÁVEL em 0,45% no presidencial nas dez leituras da noite, e oscilou 0,50pp no contrato de terceiro lugar, entre 37,00% e 37,50%. O valor ao lado é o de 17/Ago, 18:48 BRT. Na intenção declarada ele segue sendo o terceiro nome, com 5% na Nexus/BTG de 17/Ago contra 4% de Renan Santos, e no preço continua muito atrás dele. São perguntas diferentes e o painel não as soma."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,25%",
    poll: "NACIONAL NOVA EM 17/Ago: a BTG/Nexus lhe dá 4% no 1º turno, acima dos 2% que a Quaest de 14/Ago media, e empatado com Renan Santos dentro da margem de 2pp. NO PREÇO, leitura confirmada de 17/Ago, 18:48 BRT (21:48 UTC). Em 0,25% (vol USD 5,62M acumulado), alta de 0,10pp, e o preço segue abaixo do corte de 0,5% que o painel usa para separar preço de ruído. No contrato de 3º lugar ele tem 4,95%. Iniciou a semana de campanha com promessa de superpresídio e críticas a ministros do STF, segundo Folha de S.Paulo e Valor Econômico.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "SEM PREÇO CERTIFICADO EM 18/Ago. O preço segue abaixo do corte de 0,5% que o painel usa para separar preço de ruído. Na urna a Nexus/BTG de 17/Ago lhe dá 4% no 1º turno, empatado com Renan Santos dentro da margem de 2pp, e essa leitura de urna vale por si, independente do preço."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "Nenhuma nacional da janela o testa em cenário presidencial, e a BTG/Nexus de 17/Ago também não. Ausência de teste é informação que o painel registra, em vez de repetir dado antigo como se fosse novo. Ele abriu campanha à REELEIÇÃO ao governo de São Paulo em 16/Ago, segundo O Globo e a Folha de S.Paulo. NO PREÇO, leitura confirmada de 17/Ago, 18:48 BRT (21:48 UTC). Em 0,05% (vol USD 13,93M acumulado), estável, abaixo do corte de 0,5% e sobre o MAIOR volume acumulado de todo o book presidencial, conferido nesta captura. Volume alto com probabilidade no piso é convicção já precificada, não movimento.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "SEM PREÇO CERTIFICADO EM 18/Ago. Ele abriu campanha à REELEIÇÃO ao governo de São Paulo em 16/Ago e não é candidato à Presidência. O contrato dele segue com preço no piso e sobre o MAIOR volume acumulado de todo o livro presidencial, acima do próprio líder. Volume alto com probabilidade no piso é convicção já precificada num desfecho que a realidade descartou, e é por isso que a linha permanece no painel com o estado eleitoral declarado, em vez de ser apagada."
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
