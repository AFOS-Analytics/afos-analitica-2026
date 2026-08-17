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
    risk: "O DIA TROUXE URNA NOVA E NENHUMA LEITURA DE MERCADO NOVA. A PoderData publicou a primeira nacional desde 11/Ago, e o achado está na comparação da casa com ela mesma: no 1º turno a distância não se mexeu em quatro semanas, foram 6pp em 16/Jul, 6pp em 30/Jul e 6pp agora, com os dois primeiros repetindo os mesmos percentuais; no returno, no mesmo intervalo, caiu de 3pp para 1pp. Um turno parado e o outro estreitando. A REJEIÇÃO SAIU EMPATADA EM 48% para os dois primeiros, o que retira a base de qualquer leitura fácil sobre quem tem mais espaço para crescer. Ele lançou a campanha à reeleição no Estádio da Vila Euclides, em São Bernardo, segundo TVT News e G1. RESSALVA DE SÉRIE, medida sobre todos os 173 pontos gravados desde 16/Mai e não sobre o último de cada dia: 29 tiveram valor igual ou maior que 63,50%, com topo de 66,50% em 01/Ago às 23:00."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "31,45%",
    poll: "NACIONAL NOVA EM 17/Ago: a BTG/Nexus o leva de 35% para 36% no 1º turno e repete 44% no returno. ⚠️ O ganho de 1 ponto está dentro da margem de 2pp da casa, e a distância para o líder NÃO mudou, segue em 5 pontos. NO PREÇO, leitura confirmada de 17/Ago, 18:48 BRT (21:48 UTC). Em 31,45% (vol USD 8,46M acumulado), ALTA DE 2,00pp, quarto dia seguido subindo e o maior movimento do dia entre os contratos grandes. ⛔ NÃO é recorde: dos 90 dias da série desde 19/Mai, 2 estão acima, e o topo é 33,20%, de 02/Jun. ⚠️ CAUSAÇÃO: a pesquisa do dia não encurtou distância nenhuma, então ela não explica o encurtamento de 4,00pp no preço. Passou o dia em atrito no próprio campo, acusando Caiado de ajudar o líder depois de Kassab dizer que Caiado tem chance zero, segundo o Estadão.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "O FATO DO DIA SOBRE ELE NÃO É PREÇO NEM PESQUISA, É REGISTRO. Folha de S.Paulo e G1 informam que ele aparece no cadastro do TSE filiado ao Missão, o partido pelo qual Renan Santos disputa, sem ter conhecimento disso, e que isso travou o registro formal da candidatura presidencial dele pelo PL. O G1 registra que o PL fala em fraude. O prazo de registro se encerra em 15/Ago, o que dá dois dias. NA URNA ele repetiu os 35% da própria casa no 1º turno e encurtou o returno de 43% para 45%. NENHUMA CAUSA É ATRIBUÍDA: não há leitura de mercado nova em 13/Ago para comparar com o episódio do registro. RESSALVA DE SÉRIE, sobre os 172 pontos desde 16/Mai: 51 tiveram valor igual ou maior que 27,65%, com topo de 33,20% em 02/Jun às 19:30 e piso de 22,00% em 03/Jul às 01:00."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "4,05%",
    poll: "NACIONAL NOVA EM 17/Ago: a BTG/Nexus o mantém em 4% no 1º turno. 🔴 ELE APARECE ATRÁS DE CAIADO, que tem 5%, e empatado com Zema, que tem 4%. NO PREÇO, leitura confirmada de 17/Ago, 18:48 BRT (21:48 UTC). Em 4,05% (vol USD 9,95M acumulado), queda continuada, e o valor fica ABAIXO do piso de 4,80% gravado na série de 90 dias. ⚠️ RESSALVA DE FORMA: o book dele é fino e oscilou entre 3,75% e 4,15% em menos de dez minutos durante a captura, então o movimento merece leitura mais frouxa que a dos dois primeiros. No contrato de 3º LUGAR ele cedeu de 53,00% para 52,50%, e a distância para o segundo daquele book encolheu de 15,50pp para 14,00pp. ⭐ Os dois universos discordam sobre quem é o terceiro: a pesquisa põe Caiado à frente, o mercado põe ele.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "O DIA O SEPAROU DO RESTO DO PELOTÃO, E PARA PIOR. A PoderData testou quatro nomes no returno contra o líder e, segundo CNN Brasil e Bnews, três empataram e só ele perdeu. É a primeira vez na janela que o pelotão se divide assim, e a divisão NÃO segue o preço: ele é precificado bem acima de Caiado e de Zema, que empataram. O EFEITO DE MÉTODO segue sendo a leitura sobre ele, com o mesmo nome indo de 4% a 10% conforme o ambiente da entrevista, ressalva declarada pela própria Palver. NO TABULEIRO, a Gazeta do Povo publicou o plano de governo dele, e o partido pelo qual ele disputa é o mesmo em que o segundo colocado apareceu filiado sem saber."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "Nenhuma nacional da janela o inclui em cenário presidencial, e a BTG/Nexus de 17/Ago também não. A ressalva do painel segue valendo como ato datado: ele abriu campanha ao GOVERNO DE SÃO PAULO em 16/Ago, segundo O Globo e o Times Brasil. Ele não é candidato à Presidência, e qualquer cenário presidencial que o inclua é hipótese de pesquisa, não candidatura em curso. NO PREÇO, leitura confirmada de 17/Ago, 18:48 BRT (21:48 UTC). Em 0,05% (vol USD 7,20M acumulado), estável e abaixo do corte de 0,5% que o painel usa para separar preço de ruído.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "O AGRAVANTE PERMANECE E PRECISA SER DITO COM CLAREZA: ele NÃO é candidato à Presidência e disputa o governo de São Paulo, então qualquer cenário presidencial que o inclua é hipótese de pesquisa, e não candidatura em curso. A PoderData de 13/Ago não o testa. No preço ele está em faixa onde variação não tem valor informativo, e é por isso que o painel registra o número sem construir leitura sobre ele."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,25%",
    poll: "⭐ NACIONAL NOVA EM 17/Ago E ELA O PROMOVE: a BTG/Nexus lhe dá 5% no 1º turno, ACIMA dos 4% de Renan Santos. Na intenção declarada ele passa a ser o terceiro nome do quadro. NO PREÇO, leitura confirmada de 17/Ago, 18:48 BRT (21:48 UTC), o cruzamento de contrato se repete e troca de sinal: na VITÓRIA ele caiu de 0,60% para 0,25% (vol USD 6,07M acumulado), abaixo do piso de 0,50% da série de 90 dias; na POSIÇÃO ele SUBIU, com o 3º lugar do 1º turno indo de 37,50% para 38,50%, e a distância dele para o primeiro daquele book fechou de 15,50pp para 14,00pp. São perguntas diferentes e o painel não as soma. Kassab, vice na chapa dele, disse que ele tem chance zero e depois afirmou que foi mal interpretado, segundo Folha de S.Paulo e Estadão.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "O CONTRASTE DELE FICOU MAIOR HOJE, E QUEM O AUMENTOU FOI A URNA. Ele empata com o líder no returno pela segunda vez em quatro dias, e o preço de vitória em vigor está abaixo de 1%. Empatar num returno hipotético e vencer a eleição são perguntas diferentes, e o painel não as subtrai: a distância entre as duas medições é justamente o que esta seção existe para mostrar. NO TABULEIRO, em São Paulo ele atacou as trajetórias dos dois primeiros e criticou a atuação do STF, segundo o Goiás 246."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,25%",
    poll: "NACIONAL NOVA EM 17/Ago: a BTG/Nexus lhe dá 4% no 1º turno, acima dos 2% que a Quaest de 14/Ago media, e empatado com Renan Santos dentro da margem de 2pp. NO PREÇO, leitura confirmada de 17/Ago, 18:48 BRT (21:48 UTC). Em 0,25% (vol USD 5,62M acumulado), alta de 0,10pp, e o preço segue abaixo do corte de 0,5% que o painel usa para separar preço de ruído. No contrato de 3º lugar ele tem 4,95%. Iniciou a semana de campanha com promessa de superpresídio e críticas a ministros do STF, segundo Folha de S.Paulo e Valor Econômico.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "O CONTRASTE DO DIA É DELE: empata com o líder no returno da PoderData e é precificado em 0,35% para vencer a eleição, abaixo do corte de 0,5% que o painel usa para separar preço de ruído. Enquanto estiver nessa faixa a variação de preço não sustenta interpretação, mas o empate no returno é leitura de urna e vale por si. NO TABULEIRO ele segue sendo o único do pelotão com registro de candidatura já apresentado ao TSE, feito em 06/Ago com R$ 178,7 milhões declarados. O prazo dos demais se encerra em 15/Ago."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "Nenhuma nacional da janela o testa em cenário presidencial, e a BTG/Nexus de 17/Ago também não. Ausência de teste é informação que o painel registra, em vez de repetir dado antigo como se fosse novo. Ele abriu campanha à REELEIÇÃO ao governo de São Paulo em 16/Ago, segundo O Globo e a Folha de S.Paulo. NO PREÇO, leitura confirmada de 17/Ago, 18:48 BRT (21:48 UTC). Em 0,05% (vol USD 13,93M acumulado), estável, abaixo do corte de 0,5% e sobre o MAIOR volume acumulado de todo o book presidencial, conferido nesta captura. Volume alto com probabilidade no piso é convicção já precificada, não movimento.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "O CONTRASTE DELE SEGUE SENDO O MAIS EXTREMO DO BOOK: com USD 13,91M acumulados, este é o maior volume de todo o mercado presidencial, e o preço está no piso, em 0,05%. Volume alto com probabilidade no piso não é movimento, é convicção já precificada. NO TABULEIRO DE HOJE ele acionou o STF contra o presidente depois de o empréstimo do Banco do Brasil a São Paulo ser citado em debate, e o Valor Econômico informou que a Fazenda liberou a operação em seguida. Nenhuma nacional da janela o testa no cenário presidencial."
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
