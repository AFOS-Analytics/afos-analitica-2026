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
    poll: "SEM NACIONAL NOVA EM 14/Ago até esta captura: a Quaest divulga hoje uma rodada com 13 candidatos e os resultados ainda não estavam publicados. Segue valendo a PoderData/Aya de 13/Ago (n=2.400, telefônica, campo 09 a 12/Ago, BR-06868/2026) com 41% no 1º turno e 46% x 45% no returno. Rejeição em 48%, empatada com a do adversário. NO PREÇO, leitura nova em 14/Ago, confirmada às 14:46 BRT (17:46 UTC). Em 63,50% (vol USD 8,25M acumulado), o mesmo valor de 12/Ago e o sexto dia consecutivo nesse patamar na série gravada.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "O DIA TROUXE URNA NOVA E NENHUMA LEITURA DE MERCADO NOVA. A PoderData publicou a primeira nacional desde 11/Ago, e o achado está na comparação da casa com ela mesma: no 1º turno a distância não se mexeu em quatro semanas, foram 6pp em 16/Jul, 6pp em 30/Jul e 6pp agora, com os dois primeiros repetindo os mesmos percentuais; no returno, no mesmo intervalo, caiu de 3pp para 1pp. Um turno parado e o outro estreitando. A REJEIÇÃO SAIU EMPATADA EM 48% para os dois primeiros, o que retira a base de qualquer leitura fácil sobre quem tem mais espaço para crescer. Ele lançou a campanha à reeleição no Estádio da Vila Euclides, em São Bernardo, segundo TVT News e G1. RESSALVA DE SÉRIE, medida sobre todos os 173 pontos gravados desde 16/Mai e não sobre o último de cada dia: 29 tiveram valor igual ou maior que 63,50%, com topo de 66,50% em 01/Ago às 23:00."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "27,85%",
    poll: "SEM NACIONAL NOVA EM 14/Ago até esta captura. Segue valendo a PoderData/Aya de 13/Ago, que lhe dá 35% no 1º turno, o mesmo valor de 30/Jul, e 45% no returno, contra 43% na rodada anterior, a 1pp do líder. Rejeição em 48%, exatamente igual à dele. Seguem os 28,7% da CNT/MDA, os 34,1% da Futura e os 38% da Gerp, de 11/Ago. NO PREÇO, leitura nova em 14/Ago, confirmada às 14:46 BRT (17:46 UTC). Em 27,85% (vol USD 8,20M acumulado), alta de 0,20pp desde 12/Ago, e ele foi o único nome acima de 1% a subir. NO CARTÓRIO, o vínculo indevido dele com o Missão foi cancelado e a filiação ao PL foi restabelecida, segundo Folha de S.Paulo e G1.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "O FATO DO DIA SOBRE ELE NÃO É PREÇO NEM PESQUISA, É REGISTRO. Folha de S.Paulo e G1 informam que ele aparece no cadastro do TSE filiado ao Missão, o partido pelo qual Renan Santos disputa, sem ter conhecimento disso, e que isso travou o registro formal da candidatura presidencial dele pelo PL. O G1 registra que o PL fala em fraude. O prazo de registro se encerra em 15/Ago, o que dá dois dias. NA URNA ele repetiu os 35% da própria casa no 1º turno e encurtou o returno de 43% para 45%. NENHUMA CAUSA É ATRIBUÍDA: não há leitura de mercado nova em 13/Ago para comparar com o episódio do registro. RESSALVA DE SÉRIE, sobre os 172 pontos desde 16/Mai: 51 tiveram valor igual ou maior que 27,65%, com topo de 33,20% em 02/Jun às 19:30 e piso de 22,00% em 03/Jul às 01:00."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "7,15%",
    poll: "A PoderData de 13/Ago o testou no returno e ele é o ÚNICO do pelotão que o líder vence nesse cenário, segundo o Bnews, enquanto empata com os outros três. Os percentuais de 1º turno dele naquela rodada não saíram nas matérias capturadas, e seguem os 5% da Gerp, os 4% da Genial/Quaest e da BTG/Nexus, os 4,7% da Meio/Ideia e os 10% da Palver pela internet. NO PREÇO, leitura nova em 14/Ago, confirmada às 14:46 BRT (17:46 UTC). Em 7,15% (vol USD 9,59M acumulado), queda de 0,30pp desde 12/Ago, a maior entre os nomes acima de 1%. Ele mantém o maior volume acumulado do book presidencial nessa faixa.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "O DIA O SEPAROU DO RESTO DO PELOTÃO, E PARA PIOR. A PoderData testou quatro nomes no returno contra o líder e, segundo CNN Brasil e Bnews, três empataram e só ele perdeu. É a primeira vez na janela que o pelotão se divide assim, e a divisão NÃO segue o preço: ele é precificado bem acima de Caiado e de Zema, que empataram. O EFEITO DE MÉTODO segue sendo a leitura sobre ele, com o mesmo nome indo de 4% a 10% conforme o ambiente da entrevista, ressalva declarada pela própria Palver. NO TABULEIRO, a Gazeta do Povo publicou o plano de governo dele, e o partido pelo qual ele disputa é o mesmo em que o segundo colocado apareceu filiado sem saber."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,15%",
    poll: "A PoderData de 13/Ago não o testa em cenário presidencial, e o mesmo valia para as três de 11/Ago. Ele segue sem urna no cenário presidencial, porque disputa o governo de São Paulo. NO PREÇO, não há leitura nova em 14/Ago, porque ele está abaixo do corte de 0,5% que o painel usa para separar preço de ruído. O valor exibido é o da última leitura confirmada, de 12/Ago, 16:41 BRT. Em 0,15% (vol USD 7,06M acumulado).",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "O AGRAVANTE PERMANECE E PRECISA SER DITO COM CLAREZA: ele NÃO é candidato à Presidência e disputa o governo de São Paulo, então qualquer cenário presidencial que o inclua é hipótese de pesquisa, e não candidatura em curso. A PoderData de 13/Ago não o testa. No preço ele está em faixa onde variação não tem valor informativo, e é por isso que o painel registra o número sem construir leitura sobre ele."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1,05%",
    poll: "A PoderData de 13/Ago o põe em EMPATE com o líder no returno, segundo CNN Brasil e Bnews, o segundo empate dele em quatro dias depois do da BTG/Nexus de 10/Ago. Os percentuais de 1º turno naquela rodada não saíram nas matérias capturadas, e seguem os 4% da Gerp e da Genial/Quaest, os 5,7% da Meio/Ideia e os 5% da BTG/Nexus. NO PREÇO, leitura nova em 14/Ago, confirmada às 14:46 BRT (17:46 UTC). Em 1,05% (vol USD 5,70M acumulado), alta de 0,10pp desde 12/Ago, e ele é o único do pelotão com leitura nova nesta rodada.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "O CONTRASTE DELE FICOU MAIOR HOJE, E QUEM O AUMENTOU FOI A URNA. Ele empata com o líder no returno pela segunda vez em quatro dias, e o preço de vitória em vigor está abaixo de 1%. Empatar num returno hipotético e vencer a eleição são perguntas diferentes, e o painel não as subtrai: a distância entre as duas medições é justamente o que esta seção existe para mostrar. NO TABULEIRO, em São Paulo ele atacou as trajetórias dos dois primeiros e criticou a atuação do STF, segundo o Goiás 246."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,35%",
    poll: "A PoderData de 13/Ago o põe em EMPATE com o líder no returno, segundo CNN Brasil e Bnews, e é a primeira vez na janela que ele aparece nessa condição. Os percentuais de 1º turno naquela rodada não saíram nas matérias capturadas, e seguem os 2% da Gerp, os 3% da BTG/Nexus, os 2% da Genial/Quaest e os 2,6% da Meio/Ideia. NO PREÇO, não há leitura nova em 14/Ago, porque ele está abaixo do corte de 0,5% que o painel usa para separar preço de ruído. O valor exibido é o da última leitura confirmada, de 12/Ago, 16:41 BRT. Em 0,35% (vol USD 5,07M acumulado). Ele é o único do pelotão com registro de candidatura já apresentado ao TSE, feito em 06/Ago, e por isso o prazo de 15/Ago não o pressiona.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "O CONTRASTE DO DIA É DELE: empata com o líder no returno da PoderData e é precificado em 0,35% para vencer a eleição, abaixo do corte de 0,5% que o painel usa para separar preço de ruído. Enquanto estiver nessa faixa a variação de preço não sustenta interpretação, mas o empate no returno é leitura de urna e vale por si. NO TABULEIRO ele segue sendo o único do pelotão com registro de candidatura já apresentado ao TSE, feito em 06/Ago com R$ 178,7 milhões declarados. O prazo dos demais se encerra em 15/Ago."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "A PoderData de 13/Ago não o testa em cenário presidencial, e o mesmo valia para as três de 11/Ago e as de 10 e 05/Ago. Ausência de teste é informação que o painel registra, em vez de repetir dado antigo como se fosse novo. Ele disputa a REELEIÇÃO no governo de São Paulo. NO PREÇO, não há leitura nova em 14/Ago, porque ele está abaixo do corte de 0,5% que o painel usa para separar preço de ruído. O valor exibido é o da última leitura confirmada, de 12/Ago, 16:41 BRT. Em 0,05% (vol USD 13,91M acumulado), sobre o maior volume acumulado de todo o book presidencial.",
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
