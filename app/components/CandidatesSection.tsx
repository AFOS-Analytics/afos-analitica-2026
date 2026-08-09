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
    poll: "SEM PESQUISA NACIONAL NOVA há QUATRO dias, a 56 dias do 1º turno. Seguem valendo as duas de 05/Ago: Genial/Quaest (n=2.004, presencial em 120 municípios, margem 2pp, BR-06591/2026) com 39% no 1º turno e 44% x 39% no returno, e Meio/Ideia (n=1.500, telefônica, margem 2,5pp, BR-04579/2026) com 43% e 48,5% x 43%. Ele vence os OITO cenários de returno das duas somadas. APROVAÇÃO em 48% contra 47% na Quaest. A cobertura de hoje traz recortes daquela mesma rodada, por escolaridade e por posicionamento, e não medição nova. Preço da leitura de 09/Ago, 17:34 UTC: 63,50% (vol USD 8,18M acumulado), queda de 1,00pp que rompe por baixo o platô de cinco dias. HÁ TRÊS NACIONAIS PREVISTAS PARA AMANHÃ, entre elas a Palver com n=5.000.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "O PREÇO DELE VOLTOU A SE MEXER, E PARA BAIXO. Caiu 1,00pp, de 64,50% para 63,50%, na primeira variação desde 04/Ago, e o gap sobre Flávio foi a +36,55pp. O QUE IMPORTA É DE ONDE VEIO O ENCOLHIMENTO: o adversário ficou parado pelo terceiro dia, então o gap encolheu só por este lado. Quando as duas pontas se movem há transferência entre os dois nomes; quando só o líder cede, o que existe é perda de preço no favorito, e a probabilidade pode não ter ido para o segundo colocado. Desde 01/Ago o gap caiu em SETE dos oito dias, com um único dia parado, saindo de +41,80pp. A JANELA DO PREÇO PRECISA SER DITA: na série de 89 dias, de 11/Mai a hoje, o topo dele é 66,50%, do fechamento de 01/Ago, e 13 dos 89 dias tiveram valor igual ou maior que o de agora. NO TABULEIRO o dia foi de papelada: declarou patrimônio ao TSE, cerca de R$ 4,7 milhões, 35% menos que em 2022, com os veículos divergindo na casa decimal entre R$ 4,7 e R$ 4,8 milhões, e o painel registra a divergência em vez de escolher. Um levantamento conta 26 palanques estaduais para ele contra 16 do adversário. NENHUM ATO JUDICIAL NOVO hoje, e o painel não atribui causa à queda do preço porque não há evento para atribuir."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "26,95%",
    poll: "SEM PESQUISA NACIONAL NOVA há QUATRO dias. Seguem valendo os 30% da Quaest, contra 28% em 15/Jul da mesma casa, e os 35% da Meio/Ideia, contra 32% em 08/Jul. Nos returnos, 39% e 43%, e perde os dois. O gap contra Lula fica em 9pp e 8pp. UM RECORTE PUBLICADO EM 09/Ago mostra ele ampliando vantagem entre eleitores com ensino médio e superior, e é leitura da rodada de 05/Ago, não pesquisa nova. Preço da leitura de 09/Ago, 17:34 UTC: 26,95% (vol USD 8,09M acumulado), terceiro dia parado no mesmo valor.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "ELE GANHOU TERRENO SEM SE MOVER, E ISSO PRECISA SER DITO ASSIM. O contrato de vencedor ficou em 26,95% pelo TERCEIRO dia seguido, e o gap para Lula encolheu porque o líder cedeu 1,00pp, não porque ele subiu. A sequência de seis dias de alta dele terminou em 06/Ago. NO CONTRATO DE 2º LUGAR A QUEDA ESTANCOU em 81,50%, o mesmo de ontem, depois de perder 6,00pp entre 06 e 08/Ago. Estancar não é recuperar, e o nível segue 6,00pp abaixo do de 06/Ago. O VICE SEGUE SENDO O PASSIVO: está na lista de emendas Pix que Dino mandou a PF investigar, com R$ 6,2 milhões enviados a São José da Laje que a auditoria do TCU não conseguiu rastrear, e Gilmar Mendes disse não conhecê-lo. A CHAPA FECHOU UM QUADRO QUE AGORA TEM NÚMERO: 2026 tem 92,3% de chapas de um só partido, a maior proporção desde a redemocratização, e é a primeira eleição do século sem mulher em chapa competitiva. A REJEIÇÃO SEGUE SENDO O NÚMERO MAIS DURO DELE: 54% não votariam nele, contra 41% que votariam. Ressalva de série: na série de 89 dias, de 11/Mai a hoje, o topo dele é 43,30%, de 12/Mai, o piso é 22,00%, de 03/Jul, e 30 dos 89 dias tiveram valor igual ou maior que o de agora. UMA MATÉRIA SOBRE ELE FOI VERIFICADA E NÃO ENTROU: a de que Moraes acionou a PGR pela ausência dele na PF circulou hoje nos agregadores, mas o evento é de julho."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "7,80%",
    poll: "SEM PESQUISA NACIONAL NOVA há QUATRO dias. Seguem valendo os 4% da Quaest, contra 3% em 15/Jul da mesma casa, e os 4,7% da Meio/Ideia, contra 2% em 08/Jul. Na Ideia ele fica à frente de Zema, que tem 2,6%, e atrás só de Caiado, com 5,7%. Nos returnos é o pior colocado das duas rodadas: perde para Lula por 45% x 35% e por 48% x 34,7%. Declarou R$ 795 mil em bens ao TSE, com o vice informando R$ 1,6 milhão. Preço da leitura de 09/Ago, 17:34 UTC: 7,80% (vol USD 9,27M acumulado), alta de 0,15pp e terceiro dia seguido de subida.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "O MOVIMENTO MAIS FORTE DO PAINEL HOJE É DELE, E ACONTECEU NO BOOK MAIS FINO. No contrato de 3º lugar do 1º turno ele SALTOU 6,00pp, de 58,50% para 64,50%, enquanto Caiado caiu 5,50pp, para 25,50%, em espelho quase exato. ONTEM ISSO NÃO ACONTECEU: Caiado caiu e ele ficou parado, e o painel registrou que a probabilidade saía do book em vez de migrar dentro dele. Hoje ela migrou. Dois dias seguidos apontando mecanismos opostos são a razão de o painel descrever mecanismo em vez de tendência. O VÃO ENTRE O PREÇO E A URNA AUMENTOU: com 7,80% no mercado e 4% a 4,7% nas pesquisas, a distância vai de 3,10pp a 3,80pp, sempre do lado do PREÇO. No contrato de 2º lugar ele abriu sobre Lula, com 8,25% contra 6,75%, distância de 1,50pp quando ontem eram 0,10pp, e quem se moveu ali foi Lula. A SEQUÊNCIA DA URNA É O QUE MAIS PESA CONTRA A LEITURA DE CRESCIMENTO: seis nacionais consecutivas o medem entre 3% e 4,7%, depois dos 7,8% da AtlasIntel de 29/Jul. Na série de 89 dias o máximo é 17,90% e o mínimo 5,50%, e 77 dos 89 dias tiveram valor igual ou maior que o de hoje, então 7,80% descreve a metade baixa do próprio histórico. Reportagem de 09/Ago aponta que a aposta dele no interior esbarra na estrutura do Missão."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "NENHUMA das duas nacionais em vigor o testa, em nenhum cenário, nem de 1º turno nem de returno, e não saiu pesquisa nacional nova desde então, então ele segue sem urna própria. Ausência de teste é informação que o painel registra, em vez de repetir dado antigo como se fosse novo. Preço da leitura de 09/Ago, 17:34 UTC: 0,05% (vol USD 6,78M acumulado), queda de 0,10pp até o piso que o mercado precifica.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "O agravante de leitura permanece e o painel repete: ele NÃO é candidato à Presidência, disputa o governo de São Paulo, e qualquer cenário que o inclua é hipótese de pesquisa e não candidatura em curso. Nesse nível de preço, o painel registra o nível e não a oscilação, porque variações de centésimos ali têm valor informativo quase nulo. O volume acumulado dele, USD 6,78M, é maior que o de vários nomes com preço acima do dele, o que mede história negociada e não convicção atual."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1,25%",
    poll: "SEM PESQUISA NACIONAL NOVA há QUATRO dias. Segue sendo o nome mais votado do pelotão nas duas em vigor: 5,7% na Meio/Ideia, contra 4% em 08/Jul da mesma casa, e 4% na Quaest, o mesmo de 15/Jul. Nos returnos tem 40% contra 48,5% de Lula na Ideia, a MENOR distância entre os quatro adversários testados naquela rodada, e 37% contra 45% na Quaest. Preço da leitura de 09/Ago, 17:34 UTC: 1,25% (vol USD 5,60M), queda de 0,10pp e terceiro dia seguido de baixa.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "OS DOIS PREÇOS DELE CAÍRAM PELO TERCEIRO DIA SEGUIDO: o presidencial de 1,35% para 1,25%, e o de 3º lugar do 1º turno de 31,00% para 25,50%. Em três dias são 10,00pp perdidos naquele contrato, desde os 33,50% de 06/Ago. A DIFERENÇA EM RELAÇÃO A ONTEM É O MECANISMO E NÃO A DIREÇÃO: hoje Renan Santos subiu 6,00pp contra os 5,50pp que ele perdeu, ou seja, a probabilidade migrou entre os dois; ontem Renan ficou parado e ela saiu do book. Registrar isso separadamente evita transformar dois dias diferentes numa tendência que o dado não sustenta. A DIVERGÊNCIA ENTRE INSTITUTOS SOBRE ELE SEGUE SENDO O DADO MAIS INTERESSANTE DO PELOTÃO, e ela está exposta no mesmo campo: 4% numa casa e 5,7% na outra, com as duas colhendo de 31/Jul a 03/Ago. No mês inteiro o leque vai de 3,1% na AtlasIntel a 6% na Nexus de 27/Jul. Duas réguas medindo a mesma semana e chegando a números que diferem em 1,7pp é exatamente o tipo de coisa que este painel existe para registrar, em vez de escolher uma e chamar de verdade."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,45%",
    poll: "PARADO NA URNA NAS DUAS CASAS EM VIGOR: 2% na Quaest, o mesmo de 15/Jul, e 2,6% na Meio/Ideia, praticamente os 2,5% de 08/Jul, e não saiu pesquisa nacional nova há quatro dias. Nos returnos é o adversário que Lula bate com MAIS FOLGA na Quaest, por 46% x 34%, e perde por 48,5% x 37% na Ideia. REGISTROU CANDIDATURA NO TSE EM 06/Ago, declarando R$ 178,7 milhões de patrimônio, com o vice Girão informando R$ 34,1 milhões. Preço da leitura de 09/Ago, 17:34 UTC: 0,45% (vol USD 5,02M), queda de 0,10pp, que o devolve abaixo do corte de 0,5%.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "VOLTOU A FICAR ABAIXO DO CORTE DE 0,5% DEPOIS DE UM ÚNICO DIA ACIMA DELE. Caiu 0,10pp, para 0,45%, e o corte é o que o painel usa para separar preço de ruído. Em 06/Ago ele protocolou registro no TSE, declarando R$ 178,7 milhões de patrimônio, num prazo que só se encerra em 15/Ago, e o vice dele declarou R$ 34,1 milhões. O primeiro presidenciável registrado no TSE foi Renan Santos, não ele. O QUE NÃO MUDOU FOI A URNA: ele não se move há um mês em nenhuma das duas casas, e segue sendo o adversário mais confortável para Lula entre os testados na Quaest. No contrato de 3º lugar do 1º turno está em 3,35%. Ressalva de série, e ela é grande: o máximo dele foi 10,10%, em 26/Abr, então 0,45% é uma fração pequena daquele nível e movimentos nessa faixa têm valor informativo quase nulo."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "NENHUMA das duas nacionais em vigor o testa em qualquer cenário presidencial, de 1º turno ou de returno, e não saiu pesquisa nacional nova desde então. Ele disputa a REELEIÇÃO no governo de São Paulo, oficializada pelo Republicanos em 01/Ago, e o partido declarou neutralidade na disputa presidencial. Preço da leitura de 09/Ago, 17:34 UTC: 0,05% no presidencial, com o maior volume acumulado do book, USD 13,87M.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "O presidencial dele em 0,05% com o maior volume acumulado do book é a anomalia de legado que serve de lembrete permanente de método: volume mede história negociada e não convicção atual. O contrato acumulou esse valor ao longo de meses em que ele era tratado como candidato provável, e o preço diz que o mercado não o considera mais na disputa. O painel registra o nível e NÃO o compara com a história dele, e a razão é de coleta: a série do AFOS tem apenas três dias para esse nome, entre 28/Abr e 14/Mai, e não sustenta afirmação de extremo."
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
