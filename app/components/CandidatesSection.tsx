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
    poll: "NACIONAL NOVA EM 17/Ago: a BTG/Nexus (n=2.003, telefone, campo 14 a 16/Ago, BR-03317/2026, margem de 2pp) lhe dá 41% no 1º turno e 47% no returno. ⭐ CONTRA A PRÓPRIA CASA É ESTABILIDADE: ele saiu de 40% para 41%, o adversário de 35% para 36%, e a DISTÂNCIA ficou nos mesmos 5 pontos. No returno o resultado é IDÊNTICO, 47 a 44. Cada movimento de 1 ponto cabe dentro da margem. NO PREÇO, leitura confirmada de 17/Ago, 18:48 BRT (21:48 UTC), com a trava aprovada em DUAS passadas. Em 64,50% (vol USD 8,52M acumulado), queda de 2,00pp, devolvendo o que subiu na véspera. A distância para o segundo colocado FECHOU de 37,05pp para 33,05pp. ⛔ Sem superlativo: o topo da série segue em 66,50%, de 01/Ago, e 5 dos 90 dias gravados desde 19/Mai estão acima do fechamento de hoje.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "SEM VARIAÇÃO pelo segundo dia seguido, em 63,50% (vol USD 8,69M acumulado), leitura confirmada de 19/Ago, 14:58 BRT. A DISTÂNCIA para Flávio Bolsonaro encurtou 0,50pp e foi a 30,95pp, no TERCEIRO dia seguido de aproximação: eram 37,05pp em 16/Ago, 33,05pp em 17/Ago e 31,45pp em 18/Ago, somando 6,10pp em três dias. E O ENCURTAMENTO NÃO VEIO DELE: em dois dias ele não perdeu preço nenhum, e a aproximação inteira é do adversário subindo. A URNA SEGUE MUDA: nenhuma pesquisa nacional nova desde 17/Ago, e aquela mediu a distância entre os dois INALTERADA em 5 pontos. Em pesquisa ESTADUAL do Distrito Federal ele aparece com 39% contra 44% no 2º turno e é aprovado por 54% naquele eleitorado, segundo a CNN Brasil; estadual não entra no painel nacional. SEM SUPERLATIVO: o topo da série de 88 dias segue em 66,50%, de 01/Ago. Datafolha nacional em 21/Ago."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "32,55%",
    poll: "NACIONAL NOVA EM 17/Ago: a BTG/Nexus o leva de 35% para 36% no 1º turno e repete 44% no returno. ⚠️ O ganho de 1 ponto está dentro da margem de 2pp da casa, e a distância para o líder NÃO mudou, segue em 5 pontos. NO PREÇO, leitura confirmada de 17/Ago, 18:48 BRT (21:48 UTC). Em 31,45% (vol USD 8,46M acumulado), ALTA DE 2,00pp, quarto dia seguido subindo e o maior movimento do dia entre os contratos grandes. ⛔ NÃO é recorde: dos 90 dias da série desde 19/Mai, 2 estão acima, e o topo é 33,20%, de 02/Jun. ⚠️ CAUSAÇÃO: a pesquisa do dia não encurtou distância nenhuma, então ela não explica o encurtamento de 4,00pp no preço. Passou o dia em atrito no próprio campo, acusando Caiado de ajudar o líder depois de Kassab dizer que Caiado tem chance zero, segundo o Estadão.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "ALTA de 0,50pp, de 32,05% para 32,55% (vol USD 8,63M acumulado), leitura confirmada de 19/Ago, 14:58 BRT, SEXTO dia seguido subindo. Ele é o único responsável pelo encurtamento da distância nos dois últimos dias, porque o líder ficou parado. NÃO É RECORDE: dos 88 dias da série desde 22/Mai, 2 marcaram valor igual ou acima de 32,55%, e o topo segue em 33,20%, de 02/Jun. NO TABULEIRO ele decidiu limitar a participação em debates do 1º turno e só comparecer quando Lula estiver presente, segundo Folha de S.Paulo e O Globo. Em pesquisa ESTADUAL do Distrito Federal aparece com 44% contra 39% no 2º turno; estadual não entra no painel nacional."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "4,05%",
    poll: "NACIONAL NOVA EM 17/Ago: a BTG/Nexus o mantém em 4% no 1º turno. 🔴 ELE APARECE ATRÁS DE CAIADO, que tem 5%, e empatado com Zema, que tem 4%. NO PREÇO, leitura confirmada de 17/Ago, 18:48 BRT (21:48 UTC). Em 4,05% (vol USD 9,95M acumulado), queda continuada, e o valor fica ABAIXO do piso de 4,80% gravado na série de 90 dias. ⚠️ RESSALVA DE FORMA: o book dele é fino e oscilou entre 3,75% e 4,15% em menos de dez minutos durante a captura, então o movimento merece leitura mais frouxa que a dos dois primeiros. No contrato de 3º LUGAR ele cedeu de 53,00% para 52,50%, e a distância para o segundo daquele book encolheu de 15,50pp para 14,00pp. ⭐ Os dois universos discordam sobre quem é o terceiro: a pesquisa põe Caiado à frente, o mercado põe ele.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "QUEDA de 0,35pp, de 4,40% para 4,05% (vol USD 10,14M acumulado), leitura confirmada de 19/Ago, 14:58 BRT, devolvendo o que subiu na véspera. Ele segue perto do piso: 86 dos 88 dias da série estão acima de 4,05%, e o piso foi tocado em 18/Ago, com 3,60%. NO CONTRATO DE 3º LUGAR ele ficou ESTÁVEL em 57,00% e mesmo assim ABRIU distância, de 20,00pp para 21,00pp, porque quem cedeu foi Ronaldo Caiado. A divergência com a urna continua sem resolução: a Nexus/BTG de 17/Ago dá 5% a Caiado e 4% a ele."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "Nenhuma nacional da janela o inclui em cenário presidencial, e a BTG/Nexus de 17/Ago também não. A ressalva do painel segue valendo como ato datado: ele abriu campanha ao GOVERNO DE SÃO PAULO em 16/Ago, segundo O Globo e o Times Brasil. Ele não é candidato à Presidência, e qualquer cenário presidencial que o inclua é hipótese de pesquisa, não candidatura em curso. NO PREÇO, leitura confirmada de 17/Ago, 18:48 BRT (21:48 UTC). Em 0,05% (vol USD 7,20M acumulado), estável e abaixo do corte de 0,5% que o painel usa para separar preço de ruído.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Ele NÃO é candidato à Presidência e disputa o governo de São Paulo, então qualquer cenário presidencial que o inclua é hipótese de pesquisa, não candidatura em curso. O preço segue abaixo do corte de 0,5% que o painel usa para separar preço de ruído, e nessa faixa a variação não sustenta interpretação."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,55%",
    poll: "⭐ NACIONAL NOVA EM 17/Ago E ELA O PROMOVE: a BTG/Nexus lhe dá 5% no 1º turno, ACIMA dos 4% de Renan Santos. Na intenção declarada ele passa a ser o terceiro nome do quadro. NO PREÇO, leitura confirmada de 17/Ago, 18:48 BRT (21:48 UTC), o cruzamento de contrato se repete e troca de sinal: na VITÓRIA ele caiu de 0,60% para 0,25% (vol USD 6,07M acumulado), abaixo do piso de 0,50% da série de 90 dias; na POSIÇÃO ele SUBIU, com o 3º lugar do 1º turno indo de 37,50% para 38,50%, e a distância dele para o primeiro daquele book fechou de 15,50pp para 14,00pp. São perguntas diferentes e o painel não as soma. Kassab, vice na chapa dele, disse que ele tem chance zero e depois afirmou que foi mal interpretado, segundo Folha de S.Paulo e Estadão.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "DEVOLVEU o que tinha subido: de 0,80% para 0,55% (vol USD 6,35M acumulado), leitura confirmada de 19/Ago, 14:58 BRT, desfazendo a alta da véspera, e no contrato de TERCEIRO LUGAR cedeu de 37,00% para 36,00%. SEM SUPERLATIVO: 85 dos 86 dias da série desde 22/Mai estão acima de 0,55%, e o teto é 2,40%, de 19/Jun. O PSD confirmou a candidatura dele à Presidência. Na intenção declarada ele segue como o terceiro nome, com 5% na Nexus/BTG de 17/Ago contra 4% de Renan Santos."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,15%",
    poll: "NACIONAL NOVA EM 17/Ago: a BTG/Nexus lhe dá 4% no 1º turno, acima dos 2% que a Quaest de 14/Ago media, e empatado com Renan Santos dentro da margem de 2pp. NO PREÇO, leitura confirmada de 17/Ago, 18:48 BRT (21:48 UTC). Em 0,25% (vol USD 5,62M acumulado), alta de 0,10pp, e o preço segue abaixo do corte de 0,5% que o painel usa para separar preço de ruído. No contrato de 3º lugar ele tem 4,95%. Iniciou a semana de campanha com promessa de superpresídio e críticas a ministros do STF, segundo Folha de S.Paulo e Valor Econômico.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "SEM VARIAÇÃO em 0,15% (vol USD 5,72M acumulado), leitura confirmada de 19/Ago, 14:58 BRT, abaixo do corte de 0,5% que o painel usa para separar preço de ruído. Nessa faixa a variação não sustenta interpretação. No contrato de 3º lugar ele marca 4,85%. Na urna a Nexus/BTG de 17/Ago lhe dá 4% no 1º turno."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "Nenhuma nacional da janela o testa em cenário presidencial, e a BTG/Nexus de 17/Ago também não. Ausência de teste é informação que o painel registra, em vez de repetir dado antigo como se fosse novo. Ele abriu campanha à REELEIÇÃO ao governo de São Paulo em 16/Ago, segundo O Globo e a Folha de S.Paulo. NO PREÇO, leitura confirmada de 17/Ago, 18:48 BRT (21:48 UTC). Em 0,05% (vol USD 13,93M acumulado), estável, abaixo do corte de 0,5% e sobre o MAIOR volume acumulado de todo o book presidencial, conferido nesta captura. Volume alto com probabilidade no piso é convicção já precificada, não movimento.",
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
