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
    poll: "SEM PESQUISA NACIONAL NOVA, a 58 dias do 1º turno. Seguem valendo as duas de 05/Ago: Genial/Quaest (n=2.004, presencial em 120 municípios, margem 2pp, BR-06591/2026) com 39% no 1º turno e 44% x 39% no returno, e Meio/Ideia (n=1.500, telefônica, margem 2,5pp, BR-04579/2026) com 43% e 48,5% x 43%. Ele vence os OITO cenários de returno das duas somadas. APROVAÇÃO em 48% contra 47% na Quaest. O QUE CHEGOU DE NOVO FORAM OS RECORTES da Quaest, divulgados em 06 e 07/Ago: ele lidera entre idosos, entre católicos e entre quem não tem religião, e abre mais de 16 pontos entre as mulheres. Preço da leitura de 07/Ago, 19:44 UTC: 64,50% (vol USD 8,11M acumulado).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "O PREÇO DELE ESTÁ PARADO EM 64,50% PELO QUARTO DIA SEGUIDO, de 04 a 07/Ago, e é isso que dá o sentido do movimento do gap: ele encolheu pelo SEXTO dia seguido, de +41,80pp em 01/Ago para +37,55pp hoje, e nesta ponta final o estreitamento inteiro é subida do segundo colocado, não queda dele. A JANELA DO PREÇO PRECISA SER DITA: na série de 88 dias, de 10/Mai a hoje, o topo dele é 66,50%, do fechamento de 01/Ago, e apenas 8 dos 88 dias tiveram valor igual ou maior que o de agora. O RISCO DO DIA É JUDICIAL E É SOBRE O FILHO: o Estadão publicou em 07/Ago a reconstituição do dia em que a PF suspeitou dos negócios de Fábio Luís Lula da Silva, a PF vai convocar um ex-chefe de gabinete do presidente para depor sobre repasses de lobista, e a campanha adversária avalia levar o caso para a estreia do horário eleitoral. O painel registra que isso ocorreu e não estima efeito, porque o preço não se moveu e atribuir imobilidade a uma causa seria inventar relação que o dado não mostra. NA URNA, a aprovação segue sem medição nova, com 48% x 47% na Quaest, 48,5% x 49% na Meio/Ideia e 47% x 48% na BTG/Nexus, as três dentro de qualquer margem uma da outra. REJEIÇÃO em 52% na Quaest, menor que a do segundo colocado. No Congresso, a conversa com Alcolumbre é esperada para segunda-feira, e o fim da escala 6x1 já foi empurrado para depois da eleição."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "26,95%",
    poll: "SEM PESQUISA NACIONAL NOVA. Seguem valendo os 30% da Quaest, contra 28% em 15/Jul da mesma casa, e os 35% da Meio/Ideia, contra 32% em 08/Jul. Nos returnos, 39% e 43%, e perde os dois. O gap contra Lula fica em 9pp e 8pp. NOS RECORTES da Quaest divulgados em 06 e 07/Ago ele vence entre evangélicos, e é o único segmento grande em que aparece à frente. Preço da leitura de 07/Ago, 19:44 UTC: 26,95% (vol USD 8,08M acumulado), sexto dia seguido de aproximação.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "O DIA TEVE DOIS PREÇOS DELE ANDANDO PARA LADOS OPOSTOS, E ESSA É A INFORMAÇÃO. No contrato de vencedor ele subiu 0,10pp, para 26,95%, completando seis dias de aproximação desde os 24,70% de 01/Ago. No contrato de 2º LUGAR do 1º turno ele CAIU 4,50pp, de 87,50% para 83,00%, o maior movimento de qualquer book deste painel na rodada. Não há contradição aritmética, porque ganhar chance de vencer tira chance de ficar em segundo, mas o tamanho merece ser dito. O VICE VIROU O PASSIVO DA SEMANA: a defesa de Alfredo Gaspar pediu à PGR e ao STF exame de DNA em até 72 horas para afastar uma acusação de estupro, o PL deixou brecha para ele voltar a disputar o Senado, O Globo apurou em 07/Ago que a indicação foi de última hora, sem ligação do próprio Flávio e com voo de madrugada, e Dino mandou a PF investigar emendas Pix apontadas pelo TCU com um repasse do vice na lista. O próprio Flávio disse em 06/Ago que tentou ter uma vice mulher e atribuiu a falha aos caciques do Centrão. A REJEIÇÃO SEGUE SENDO O NÚMERO MAIS DURO DELE: 54% não votariam nele, contra 41% que votariam, e é a mais alta entre os dois primeiros colocados, os únicos com rejeição divulgada naquela rodada. Ressalva de série no mercado: na série de 88 dias, de 10/Mai a hoje, o topo dele é 43,30%, de 12/Mai, o piso é 22,00%, de 03/Jul, e 28 dos 88 dias tiveram valor igual ou maior que o de agora."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "7,25%",
    poll: "SEM PESQUISA NACIONAL NOVA. Seguem valendo os 4% da Quaest, contra 3% em 15/Jul da mesma casa, e os 4,7% da Meio/Ideia, contra 2% em 08/Jul. Na Ideia ele fica à frente de Zema, que tem 2,6%, e atrás só de Caiado, com 5,7%. Nos returnos é o pior colocado das duas rodadas: perde para Lula por 45% x 35% e por 48% x 34,7%. Preço da leitura de 07/Ago, 19:44 UTC: 7,25% (vol USD 9,19M acumulado), alta de 0,35pp.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "O VÃO ENTRE O PREÇO E A URNA AUMENTOU HOJE, PORQUE O PREÇO SUBIU E A URNA FICOU ONDE ESTAVA. Com 7,25% no mercado e 4% a 4,7% nas pesquisas, a distância vai de 2,55pp a 3,25pp, sempre do lado do PREÇO. No contrato de 3º lugar do 1º turno ele subiu 2,50pp, de 56,00% para 58,50%, e essa alta é o espelho exato da queda de 2,00pp de Caiado no mesmo book, o que descreve transferência entre os dois nomes. Em 06/Ago o movimento tinha sido o inverso. A SEQUÊNCIA DA URNA É O QUE MAIS PESA E ELA JÁ TEM SEIS LEITURAS: depois dos 7,8% da AtlasIntel de 29/Jul, seis nacionais seguidas o mediram entre 3% e 4,7%. Uma leitura isolada alta contra seis na faixa baixa é o padrão de fora da curva, e o painel registra assim em vez de tratar a exceção como cenário. O VOLUME SEGUE SENDO A ANOMALIA: com USD 9,19M acumulados, ele tem mais dinheiro negociado que Lula, que tem USD 8,11M, com um preço que é menos de um nono. Volume mede história negociada, não convicção atual. Ressalva de série, e ela é grande: na janela de 88 dias, de 10/Mai a hoje, o mínimo é 5,50% e o máximo é 17,90%, então os 7,25% de agora estão na metade baixa do próprio histórico."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,15%",
    poll: "NENHUMA das duas nacionais em vigor o testa, em nenhum cenário, nem de 1º turno nem de returno, e não saiu pesquisa nacional nova desde então, então ele segue sem urna própria. Ausência de teste é informação que o painel registra, em vez de repetir dado antigo como se fosse novo. Preço da leitura de 07/Ago, 19:44 UTC: 0,15% (vol USD 6,77M acumulado), sem variação contra 06/Ago.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "O agravante de leitura permanece e o painel repete: ele NÃO é candidato à Presidência, disputa o governo de São Paulo, e qualquer cenário que o inclua é hipótese de pesquisa e não candidatura em curso. Nesse nível de preço, o painel registra o nível e não a oscilação, porque variações de centésimos ali têm valor informativo quase nulo. O volume acumulado dele, USD 6,77M, é maior que o de vários nomes com preço acima do dele, o que mede história negociada e não convicção atual."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1,55%",
    poll: "SEM PESQUISA NACIONAL NOVA. Segue sendo o nome mais votado do pelotão nas duas em vigor: 5,7% na Meio/Ideia, contra 4% em 08/Jul da mesma casa, e 4% na Quaest, o mesmo de 15/Jul. Nos returnos tem 40% contra 48,5% de Lula na Ideia, a MENOR distância entre os quatro adversários testados naquela rodada, e 37% contra 45% na Quaest. Preço da leitura de 07/Ago, 19:44 UTC: 1,55% (vol USD 5,58M), queda de 0,30pp.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "OS DOIS PREÇOS DELE CAÍRAM HOJE: o presidencial de 1,85% para 1,55%, e o de 3º lugar do 1º turno de 35,50% para 33,50%. Essa queda de 2,00pp espelha exatamente a alta de Renan Santos no mesmo book, o que descreve transferência de probabilidade entre os dois nomes e não movimento do pelotão como bloco. Em 06/Ago o movimento tinha sido o inverso, com ele subindo 10,50pp naquele contrato. Dois dias seguidos de troca entre os mesmos dois nomes, em direções opostas, descrevem um book disputado. A DIVERGÊNCIA ENTRE INSTITUTOS SOBRE ELE SEGUE SENDO O DADO MAIS INTERESSANTE DO PELOTÃO, e ela está exposta no mesmo campo: 4% numa casa e 5,7% na outra, com as duas colhendo de 31/Jul a 03/Ago. No mês inteiro o leque vai de 3,1% na AtlasIntel a 6% na Nexus de 27/Jul. Duas réguas medindo a mesma semana e chegando a números que diferem em 1,7pp é exatamente o tipo de coisa que este painel existe para registrar, em vez de escolher uma e chamar de verdade. A campanha dele anunciou que Roberto Azevêdo vai coordenar a área internacional, o movimento de quadro mais concreto do pelotão nesta semana."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,45%",
    poll: "PARADO NA URNA NAS DUAS CASAS EM VIGOR: 2% na Quaest, o mesmo de 15/Jul, e 2,6% na Meio/Ideia, praticamente os 2,5% de 08/Jul, e não saiu pesquisa nacional nova desde então. Nos returnos é o adversário que Lula bate com MAIS FOLGA na Quaest, por 46% x 34%, e perde por 48,5% x 37% na Ideia. FOI O PRIMEIRO PRESIDENCIÁVEL A REGISTRAR CANDIDATURA, em 07/Ago, declarando R$ 178,7 milhões de patrimônio. Preço da leitura de 07/Ago, 19:44 UTC: 0,45% (vol USD 4,83M), sem variação contra 06/Ago.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "REGISTROU CANDIDATURA E FOI PRESSIONADO A SAIR DELA NO MESMO DIA. Em 07/Ago ele foi o primeiro presidenciável a protocolar registro, declarando R$ 178,7 milhões de patrimônio, num prazo que só se encerra em 15/Ago. No mesmo dia, apareceu a notícia de que Nikolas Ferreira tenta convencê-lo a desistir da corrida presidencial e disputar o Senado. Ainda em 07/Ago, ele chamou o Judiciário de poder incendiário, depois da entrevista ao g1 e à GloboNews em 06/Ago em que defendeu privatizar tudo a começar pela Petrobras e retaliação aos Estados Unidos pelo tarifaço. O QUE NÃO MUDOU FOI A URNA: ele não se move há um mês em nenhuma das duas casas, e segue sendo o adversário mais confortável para Lula entre os testados na Quaest. No contrato de 3º lugar do 1º turno está em 3,70%. Ressalva de série, e ela é grande: o máximo dele foi 10,10%, em 26/Abr, então 0,45% é uma fração pequena daquele nível e movimentos nessa faixa têm valor informativo quase nulo."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "NENHUMA das duas nacionais em vigor o testa em qualquer cenário presidencial, de 1º turno ou de returno, e não saiu pesquisa nacional nova desde então. Ele disputa a REELEIÇÃO no governo de São Paulo, oficializada pelo Republicanos em 01/Ago, e o partido declarou neutralidade na disputa presidencial. Preço da leitura de 07/Ago, 19:44 UTC: 0,05% no presidencial, com o maior volume acumulado do book, USD 13,87M.",
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
