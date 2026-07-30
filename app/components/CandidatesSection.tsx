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
    poll: "Lula SOBE 1,00pp e volta a Poly 63,50% (vol USD 7,74M acumulado), a 66 dias do 1º turno, com o gap sobre Flávio abrindo de +38,55pp para +39,55pp. O valor IGUALA pela terceira vez o topo da série do AFOS, marcado em 26, em 28 e agora em 30/Jul, sem superá-lo em nenhuma das três. A urna do dia é a PoderData/Aya (n=2.400, campo 26-29/Jul, margem 2pp, BR-07845/2026): 41% x 35% de Flávio no 1º turno e 46% x 43% no returno.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "O PREÇO SUBIU E A URNA NÃO MEXEU, e é a terceira vez em sete dias. A comparação que vale é a da PoderData contra ela mesma, e nela o gap do 1º turno está PARADO em 6pp: eram 40% x 34% em 16/Jul, são 41% x 35% agora, com os dois primeiros subindo 1pp dentro da margem de 2pp. O aperto só aparece se a régua for trocada no meio da medição, comparando com os 9,1pp da AtlasIntel de ontem, e isso é efeito de casa, não movimento. O que mudou na rodada foi a avaliação: aprovação pessoal a 43% x 49%, e a GESTÃO com 47% de ruim ou péssimo, alta de 10pp contra a rodada de 22/Jul do instituto, a maior variação de um indicador isolado no recorte. A rejeição EMPATOU em 49% com a de Flávio."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "23,95%",
    poll: "Flávio fica ESTÁVEL em Poly 23,95% (vol USD 7,71M acumulado) e a sequência de quatro fechamentos diários seguidos em alta, que vinha de 22,90% em 25/Jul, foi interrompida sem queda. O gap abriu 1,00pp por movimento do adversário, não dele. Nos sub-mercados, SOBE 0,50pp no 2º lugar do 1º turno, para 79,00% (vol USD 215 mil), a maior marca dele naquele book no acompanhamento do painel, e fica parado em 6,25% no 3º lugar.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "A NOVIDADE DA URNA É A REJEIÇÃO EMPATADA. A PoderData dá 49% para ele e 49% para Lula, quando a AtlasIntel de 29/Jul media 52,9% contra 49,4%. Em todas as nacionais recentes, com exceção da Gerp de 22/Jul, a rejeição dele vinha igual ou acima da de Lula, e o painel vinha chamando essa assimetria de restrição estrutural da candidatura. Uma leitura não desfaz a série, mas fica registrado que nesta ela não apareceu. Na intenção de voto ele sobe de 34% para 35% dentro da própria casa. Segue SEM vice, com o prazo de 05/Ago a menos de uma semana, e a representação protocolada pelo PT no TSE nesta quinta atribui a ele impulsionamento do conteúdo da rede de perfis, alegação da federação que o painel não verificou de forma independente."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "8,45%",
    poll: "Renan CAI 0,25pp para Poly 8,45% (vol USD 8,59M acumulado), abaixo de todo fechamento diário da última semana, mas o número dele hoje não é esse. É o book de 2º lugar do 1º turno, que DESABOU de 11,70% para 6,10%, queda de 5,60pp num contrato de USD 1,09M, enquanto o de 3º lugar SUBIU 0,50pp, para 62,00% (vol USD 164 mil). O dinheiro não o eliminou, o RECLASSIFICOU: tirou dele a chance de disputar o returno e o cravou no 3º lugar.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "O PAINEL DESFAZ O PRÓPRIO ACHADO DE ONTEM. Em 29/Jul foi registrado que a distância entre preço e urna caíra a 0,90pp e que, pela primeira vez, o estreitamento viera pelo lado da URNA, que subira a 7,8% na AtlasIntel. Um instituto depois, a PoderData o dá em 4% e a distância REABRE para 4,45pp. Mais importante que a comparação entre casas: dentro da PRÓPRIA PoderData ele CAI de 6% em 16/Jul para 4% agora, mesma casa, mesmo método telefônico, mesma margem, e essa queda de 2pp é a maior variação individual da rodada. Convergência medida contra um único levantamento não é tendência. A dispersão entre institutos segue com seis pontos de amplitude no mesmo mês: 7,8%, 6%, 5%, 4% e 3%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,15%",
    poll: "Haddad CAI nos dois contratos em que aparece: 0,10pp no de vencedor, para Poly 0,15%, e 0,30pp no de 2º lugar do 1º turno, para 0,85%. É o inverso exato do sinal cruzado de 29/Jul, quando subira no book de colocação e ficara parado no de vencedor. A PoderData NÃO o testa em nenhum cenário, nem de 1º turno nem de returno, então ele não tem urna nova nesta rodada.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "O agravante de leitura permanece e o painel repete com clareza: ele NÃO é candidato à Presidência, disputa o governo de São Paulo, e o cenário que o favorece é hipótese de pesquisa e não candidatura em curso. A leitura favorável mais recente segue sendo a da AtlasIntel de 29/Jul, num dos dois cenários de returno SEM Lula, onde aparece com 44,3% contra 43,7% de Flávio, empate técnico dentro da margem de 1pp. Ausência de teste numa rodada nacional é informação, e o painel a registra em vez de repetir o dado da véspera como se fosse novo."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "2,55%",
    poll: "Caiado é o ÚNICO nome do painel em que preço e urna subiram juntos hoje. No mercado sobe 0,20pp, para Poly 2,55% (vol USD 5,20M), acumulando 0,65pp em dois pregões, de 1,90% em 28/Jul, e sobe 0,30pp no 2º lugar do 1º turno, para 0,90%. No book de 3º lugar fica PARADO em 25,50% (vol USD 37 mil). Na urna, a PoderData o devolve a 5%, alta de 1pp dentro da própria casa contra 16/Jul.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "A DIVERGÊNCIA SOBRE ELE NÃO FECHOU. Em 29/Jul o painel registrou que a terceira medição tinha ficado do lado da leitura baixa, com a AtlasIntel cortando-o a 3,1%, metade dos 6% da BTG/Nexus. A PoderData o devolve a 5%, entre as duas, e a dispersão continua de pé. O dado estadual é o descompasso mais nítido da rodada: a Genial/Quaest desta quinta o dá LIDERANDO Goiás com 33%, à frente de Flávio (27%) e de Lula (23%), no mesmo levantamento em que a desaprovação do governo estadual dele é de 59%. Governar mal avaliado e liderar a corrida presidencial no próprio estado são fatos compatíveis, e o painel registra os dois sem transformar um no outro."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,55%",
    poll: "Zema CAI 0,20pp para Poly 0,55% (vol USD 4,57M) e fica em 4,50% no 3º lugar do 1º turno, devolvendo exatamente o que subira na véspera. Na urna, a PoderData o corta de 4% para 3% dentro da própria casa, contra a rodada de 16/Jul. É o único nome do painel que caiu nas DUAS medidas no mesmo dia.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "É o segundo instituto seguido a medi-lo abaixo de 3%, depois dos 2,8% da AtlasIntel de 29/Jul, que ainda o colocou perdendo o returno nacional para Lula por 48,6% a 39,6%. Segue SEM vice, com o prazo de 05/Ago a menos de uma semana. Ressalva de série, e ela é grande: o máximo dele na série do AFOS é 10,10%, de 26/Abr, então 0,55% está a pouco mais de um vigésimo daquele nível, e movimentos de 0,20pp nessa faixa têm baixíssimo valor informativo."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,15%",
    poll: "Tarcísio estável a Poly 0,15% no presidencial, com o volume acumulado mais alto entre todos os nomes com preço vivo no book nesta captura, USD 13,66M. Não aparece nos cenários presidenciais das nacionais: a PoderData de 30/Jul não o testa, e ele reiterou em 28/Jul que o candidato dele segue sendo Flávio, ao liberar aliados e prefeitos da base para apoiarem Caiado.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "O presidencial dele em 0,15% com o maior volume acumulado do book é a anomalia de legado que serve de lembrete permanente de método: volume mede história negociada e não convicção atual. O contrato acumulou USD 13,66M ao longo de meses em que ele era tratado como candidato provável, e o preço de hoje diz que o mercado não o considera mais na disputa. Somar volume alto com preço baixo e concluir alguma coisa sobre força de candidatura seria ler o passado do book como se fosse o presente dele."
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
