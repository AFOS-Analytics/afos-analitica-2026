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
    polymarket: "66,50%",
    poll: "SEM NACIONAL NOVA EM 16/Ago. Segue a Genial/Quaest de 14/Ago (n=2.004, presencial, campo 10 a 13/Ago, BR-06773/2026) com 38% no 1º turno e 43% x 40% no returno, e os 38% são o piso das nove nacionais desde 05/Ago. Rejeição em 52%, abaixo dos 54% do adversário. ⭐ RECORTE NOVO DIVULGADO EM 15/Ago, que mede FIRMEZA e não nível: 77% dos eleitores dele dizem que a decisão é definitiva e 22% dizem que ainda podem mudar, segundo o G1. NO PREÇO, leitura confirmada de 16/Ago, 16:56 BRT (19:56 UTC). Em 66,50% (vol USD 8,40M acumulado), alta de 2,00pp. Esse valor IGUALA o topo da série de 174 pontos desde 18/Mai, sem nenhum ponto acima, e o único outro dia nesse nível foi 01/Ago. ⚠️ O ponto foi gravado às 05:01 BRT, antes dos atos de campanha do dia.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "O DIA TROUXE URNA NOVA E NENHUMA LEITURA DE MERCADO NOVA. A PoderData publicou a primeira nacional desde 11/Ago, e o achado está na comparação da casa com ela mesma: no 1º turno a distância não se mexeu em quatro semanas, foram 6pp em 16/Jul, 6pp em 30/Jul e 6pp agora, com os dois primeiros repetindo os mesmos percentuais; no returno, no mesmo intervalo, caiu de 3pp para 1pp. Um turno parado e o outro estreitando. A REJEIÇÃO SAIU EMPATADA EM 48% para os dois primeiros, o que retira a base de qualquer leitura fácil sobre quem tem mais espaço para crescer. Ele lançou a campanha à reeleição no Estádio da Vila Euclides, em São Bernardo, segundo TVT News e G1. RESSALVA DE SÉRIE, medida sobre todos os 173 pontos gravados desde 16/Mai e não sobre o último de cada dia: 29 tiveram valor igual ou maior que 63,50%, com topo de 66,50% em 01/Ago às 23:00."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "29,45%",
    poll: "SEM NACIONAL NOVA EM 16/Ago. Segue a Genial/Quaest de 14/Ago com 31% no 1º turno e 40% no returno, a 3pp do líder, tendo ganhado 1 ponto em cada turno contra a própria casa de 05/Ago. Rejeição de 54%, a maior do quadro. ⭐ Nos recortes divulgados depois, o voto nele aparece entre os dois mais consolidados, segundo o G1, e entre independentes ele marca 35% contra 29% do líder no returno, segundo O Globo. NO PREÇO, leitura confirmada de 16/Ago, 16:56 BRT (19:56 UTC). Em 29,45% (vol USD 8,34M acumulado), alta de 1,30pp e terceiro dia seguido de alta. Mesmo subindo ele ficou mais longe do líder, porque o líder subiu 2,00pp. NO PRIMEIRO DIA DE CAMPANHA abriu em Copacabana, e o ato foi estimado em 8,9 mil pessoas pelo monitor da USP/Cebrap, segundo o Estadão.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "O FATO DO DIA SOBRE ELE NÃO É PREÇO NEM PESQUISA, É REGISTRO. Folha de S.Paulo e G1 informam que ele aparece no cadastro do TSE filiado ao Missão, o partido pelo qual Renan Santos disputa, sem ter conhecimento disso, e que isso travou o registro formal da candidatura presidencial dele pelo PL. O G1 registra que o PL fala em fraude. O prazo de registro se encerra em 15/Ago, o que dá dois dias. NA URNA ele repetiu os 35% da própria casa no 1º turno e encurtou o returno de 43% para 45%. NENHUMA CAUSA É ATRIBUÍDA: não há leitura de mercado nova em 13/Ago para comparar com o episódio do registro. RESSALVA DE SÉRIE, sobre os 172 pontos desde 16/Mai: 51 tiveram valor igual ou maior que 27,65%, com topo de 33,20% em 02/Jun às 19:30 e piso de 22,00% em 03/Jul às 01:00."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "4,70%",
    poll: "SEM NACIONAL NOVA EM 16/Ago. A Genial/Quaest de 14/Ago o mantém em 4% no 1º turno, exatamente o mesmo valor de 05/Ago, ou seja, nove dias sem avanço contra a própria régua. Seguem os 5% da Gerp, os 4% da BTG/Nexus, os 4,7% da Meio/Ideia e os 10% da Palver pela internet. NO PREÇO, leitura confirmada de 16/Ago, 16:56 BRT (19:56 UTC). Em 4,70% (vol USD 9,77M acumulado), queda de 2,45pp e rompimento para baixo dos 5%, no quinto dia seguido de queda desde os 8,00% de 12/Ago. ⭐ No contrato de 3º LUGAR, porém, ele segue em 53,00%, a maior probabilidade daquele book: o mercado o mantém como primeiro do pelotão e ao mesmo tempo o afasta da vitória. Abriu campanha na Faculdade de Direito da USP, segundo O Globo.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "O DIA O SEPAROU DO RESTO DO PELOTÃO, E PARA PIOR. A PoderData testou quatro nomes no returno contra o líder e, segundo CNN Brasil e Bnews, três empataram e só ele perdeu. É a primeira vez na janela que o pelotão se divide assim, e a divisão NÃO segue o preço: ele é precificado bem acima de Caiado e de Zema, que empataram. O EFEITO DE MÉTODO segue sendo a leitura sobre ele, com o mesmo nome indo de 4% a 10% conforme o ambiente da entrevista, ressalva declarada pela própria Palver. NO TABULEIRO, a Gazeta do Povo publicou o plano de governo dele, e o partido pelo qual ele disputa é o mesmo em que o segundo colocado apareceu filiado sem saber."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "Nenhuma nacional da janela o inclui em cenário presidencial. ⭐ Em 16/Ago a ressalva do painel virou ATO PÚBLICO DATADO: ele abriu formalmente campanha ao GOVERNO DE SÃO PAULO e discursou no ato de abertura do presidente, no ABC, segundo O Globo e o Times Brasil. Ele não é candidato à Presidência, e qualquer cenário presidencial que o inclua é hipótese de pesquisa, não candidatura em curso. NO PREÇO, leitura confirmada de 16/Ago, 16:56 BRT (19:56 UTC). Em 0,05% (vol USD 7,09M acumulado), queda de 0,10pp e abaixo do corte de 0,5% que o painel usa para separar preço de ruído.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "O AGRAVANTE PERMANECE E PRECISA SER DITO COM CLAREZA: ele NÃO é candidato à Presidência e disputa o governo de São Paulo, então qualquer cenário presidencial que o inclua é hipótese de pesquisa, e não candidatura em curso. A PoderData de 13/Ago não o testa. No preço ele está em faixa onde variação não tem valor informativo, e é por isso que o painel registra o número sem construir leitura sobre ele."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,60%",
    poll: "SEM NACIONAL NOVA EM 16/Ago. A Genial/Quaest de 14/Ago lhe dá 4% no 1º turno, o mesmo de 05/Ago, e rejeição de 35%, a mais baixa do quadro, com desconhecimento alto declarado pela casa. Rejeição baixa com desconhecimento alto não é aceitação, porque a maior parte do eleitorado ainda não formou opinião. NO PREÇO, leitura confirmada de 16/Ago, 16:56 BRT (19:56 UTC). ⭐ O CRUZAMENTO DE CONTRATO DO DIA: na VITÓRIA ele caiu 0,45pp e passou a 0,60% (vol USD 5,92M acumulado), encostando no corte de 0,5%; na POSIÇÃO ele subiu, com o 3º lugar do 1º turno indo de 31,50% em 12/Ago para 37,50%, alta de 6,00pp. São perguntas diferentes e o painel não as soma. Abriu campanha com missa em Goiânia e carreata por Goiás, segundo Folha de S.Paulo e G1.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "O CONTRASTE DELE FICOU MAIOR HOJE, E QUEM O AUMENTOU FOI A URNA. Ele empata com o líder no returno pela segunda vez em quatro dias, e o preço de vitória em vigor está abaixo de 1%. Empatar num returno hipotético e vencer a eleição são perguntas diferentes, e o painel não as subtrai: a distância entre as duas medições é justamente o que esta seção existe para mostrar. NO TABULEIRO, em São Paulo ele atacou as trajetórias dos dois primeiros e criticou a atuação do STF, segundo o Goiás 246."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,15%",
    poll: "SEM NACIONAL NOVA EM 16/Ago. A Genial/Quaest de 14/Ago o mantém em 2% no 1º turno, o mesmo valor de 05/Ago. Seguem os 3% da BTG/Nexus e os 2,6% da Meio/Ideia. 🔴 RECORTE NOVO DIVULGADO EM 15/Ago: ele tem o eleitorado menos convicto do quadro, segundo o G1, dado sobre a solidez do apoio e não sobre o tamanho dele. NO PREÇO, leitura confirmada de 16/Ago, 16:56 BRT (19:56 UTC). Em 0,15% (vol USD 5,49M acumulado), queda de 0,20pp e abaixo do corte de 0,5%. No contrato de 3º lugar ele tem 5,00%. Abriu campanha com missa em Montes Claros, com promessa de superpresídio e críticas a ministros do STF, segundo Folha de S.Paulo e Valor Econômico.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "O CONTRASTE DO DIA É DELE: empata com o líder no returno da PoderData e é precificado em 0,35% para vencer a eleição, abaixo do corte de 0,5% que o painel usa para separar preço de ruído. Enquanto estiver nessa faixa a variação de preço não sustenta interpretação, mas o empate no returno é leitura de urna e vale por si. NO TABULEIRO ele segue sendo o único do pelotão com registro de candidatura já apresentado ao TSE, feito em 06/Ago com R$ 178,7 milhões declarados. O prazo dos demais se encerra em 15/Ago."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "Nenhuma nacional da janela o testa em cenário presidencial, e ausência de teste é informação que o painel registra em vez de repetir dado antigo como se fosse novo. ⭐ Em 16/Ago a ressalva virou ATO PÚBLICO DATADO: ele abriu campanha à REELEIÇÃO ao governo de São Paulo, em Osasco, segundo O Globo e a Folha de S.Paulo, e sem a presença do candidato à Presidência apoiado pelo mesmo campo. NO PREÇO, leitura confirmada de 16/Ago, 16:56 BRT (19:56 UTC). Em 0,05% (vol USD 13,92M acumulado), estável, abaixo do corte de 0,5% e sobre o maior volume acumulado de todo o book presidencial. Volume alto com probabilidade no piso é convicção já precificada, não movimento.",
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
