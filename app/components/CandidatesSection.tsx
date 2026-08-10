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
    poll: "DUAS NACIONAIS NOVAS EM 10/Ago, e elas discordam entre si. BTG/Nexus (n=2.001, telefônica, campo 07 a 09/Ago, margem 2pp, BR-08428/2026): 40% no 1º turno, com a diferença de 5pp FORA da margem, e 47% x 44% no returno. Palver, estreia (n=5.000, questionário pela internet, margem 3pp, BR-06596/2026): 44% e EMPATE em 46% x 46%. Somando as quatro rodadas desde 05/Ago ele vai de 39% a 44% e lidera o 1º turno em todas. APROVAÇÃO PIOROU NAS DUAS: 46% x 49% na Nexus, ante 47% x 48% na própria rodada de 03/Ago, e 45% x 55% na Palver. Preço da leitura confirmada de 09/Ago, 17:34 UTC: 63,50% (vol USD 8,18M acumulado), sem leitura de preço nova em 10/Ago.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "O DIA TROUXE PESQUISA E NÃO TROUXE PREÇO. Não há leitura de preço nova em 10/Ago, então o valor desta ficha é o confirmado de 09/Ago às 17:34 UTC, 63,50%, e nada aqui atribui movimento de preço ao dia de hoje. O QUE MUDOU FOI A URNA, E EM DUAS DIREÇÕES. Na intenção de voto ele segue à frente em todas as quatro nacionais da janela, e na BTG/Nexus a vantagem de 5pp fica fora da margem. Na avaliação de governo as duas leituras de hoje pioraram, e é a primeira vez na janela em que nenhuma casa do dia lhe dá saldo positivo. A DISPERSÃO É MENOR DO LADO DELE, e isso importa: as quatro leituras de 1º turno cabem numa faixa de 5pp, contra 10pp do adversário, ou seja, a incerteza de medição está concentrada no outro. O CRUZAMENTO DE DIREÇÃO É O DADO DA SEMANA: até a leitura de 09/Ago o gap de mercado vinha encolhendo, com queda em seis dos sete últimos pregões, de +38,90pp em 03/Ago para +36,55pp, enquanto o gap da BTG/Nexus ABRIU dentro da própria casa, de 4pp para 5pp no 1º turno e de 1pp para 3pp no returno. Dois instrumentos, a mesma disputa, sentidos opostos, e o painel não diz qual está certo. NO TABULEIRO, as campanhas lançaram slogans, ele e Alckmin apresentaram programa de governo, e a Folha de S.Paulo noticiou apoio do presidente da Câmara depois de o partido dele rejeitar coligação com o adversário. RESSALVA DE SÉRIE: 14 dos 88 dias tiveram preço igual ou maior que 63,50%, com topo de 66,50% em 01/Ago."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "26,95%",
    poll: "A FAIXA É O DADO, NÃO O PONTO: nas quatro nacionais desde 05/Ago ele aparece com 30% na Quaest, 35% na Ideia, 35% na BTG/Nexus de hoje e 40% na Palver de hoje, uma amplitude de 10pp, o DOBRO da do líder. A PALVER LHE DEU O MELHOR CENÁRIO DA JANELA, com empate em 46% x 46% no returno, e é a primeira vez que uma nacional não aponta derrota dele ali. Na BTG/Nexus caiu de 37% em 03/Ago para 35%, e é essa queda que abre o gap do 1º turno de 4pp para 5pp. REJEIÇÃO de 50% na Nexus, a mais alta da rodada, e de 51% na Palver. Preço da leitura confirmada de 09/Ago, 17:34 UTC: 26,95% (vol USD 8,09M acumulado), sem leitura nova em 10/Ago.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "O NÚMERO MAIS INFORMATIVO SOBRE ELE HOJE NÃO É UM NÚMERO, É UMA FAIXA DE 10pp. Quatro casas mediram a mesma semana e o puseram em 30%, 35%, 35% e 40% no 1º turno. Do lado do líder a mesma faixa é de 5pp. Qualquer manchete que fixe um valor está escolhendo uma casa, e é por isso que esta ficha publica o conjunto. AS DUAS DE HOJE ILUSTRAM A DISTÂNCIA: a BTG/Nexus, telefônica, dá 35% e derrota no returno por 47% x 44%; a Palver, pela internet, dá 40% e empate em 46% x 46%. DENTRO DA PRÓPRIA CASA O MOVIMENTO FOI CONTRA ELE: a Nexus tinha 37% em 03/Ago e agora tem 35%, e o gap do 1º turno abriu por causa disso, invertendo o aperto de 9pp para 4pp que a mesma série mostrara uma semana antes. A REJEIÇÃO SEGUE SENDO O TETO: 50% e 51%, e nas duas casas ele fica no topo ou a um ponto dele. NO PREÇO não há leitura nova em 10/Ago; o valor confirmado é o de 09/Ago às 17:34 UTC, 26,95%, que fechava o terceiro dia no mesmo nível, com 81,50% no book de 2º lugar. NO TABULEIRO, o Estadão e O Globo publicaram recorte ESTADUAL da Ideia/ACSP em São Paulo, com 44% contra 39% no returno, e o painel registra que o dado é estadual e por isso não entra na leitura nacional. Uma rodada da Quaest indica que o apoio de Milei a ele aumenta a chance de voto no adversário. RESSALVA DE SÉRIE: 26 dos 88 dias tiveram valor igual ou maior, com topo de 34,40% em 13/Mai e piso de 22,00% em 03/Jul."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "7,80%",
    poll: "O CASO DE MÉTODO DA SEMANA É ELE. Palver, pela internet, n=5.000: 10%, isolado em terceiro, o melhor resultado dele em qualquer nacional da janela. BTG/Nexus, por telefone, no MESMO dia: 4%. Genial/Quaest presencial de 05/Ago: 4%. Meio/Ideia por telefone: 4,7%. A PRÓPRIA PALVER avaliou que o formato digital pode ter impulsionado o desempenho dele, que mantém base ativa nesse ambiente, e informou que testa abordagens para reduzir esse efeito em pesquisas online. Preço da leitura confirmada de 09/Ago, 17:34 UTC: 7,80% (vol USD 9,27M acumulado), sem leitura nova em 10/Ago.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "ESTE É O CRUZAMENTO MAIS LIMPO QUE O PAINEL PODE MOSTRAR, E ELE NÃO DEPENDE DE JUÍZO NENHUM. O mesmo nome, na mesma semana: 4% presencial, 4,7% por telefone, 4% por telefone de novo, e 10% pela internet. Seis pontos de distância entre a leitura mais alta e a mais baixa, num candidato que nenhuma casa põe em dois dígitos fora do ambiente online. A RESSALVA NÃO É DESTE PAINEL, É DA CASA QUE MEDIU ALTO: a Palver declarou o efeito do formato digital e disse que testa abordagens para reduzi-lo. Repetir a declaração dela vale mais do que julgar o número, porque medir e julgar são coisas diferentes. O PREÇO CONFIRMADO FICA ENTRE OS DOIS MÉTODOS: 7,80% na leitura de 09/Ago, acima dos 4% a 4,7% do telefone e do presencial, abaixo dos 10% da internet. E AO MESMO TEMPO PERTO DO PISO DA PRÓPRIA HISTÓRIA: na série de 88 dias, 84 deles tiveram valor igual ou maior, com máximo de 17,90% em 09/Jun e mínimo de 6,80% em 06/Ago. Teto na urna e piso no preço, na mesma semana, e as duas coisas são verdade. VOLUME: maior do book presidencial entre os nomes acima de 1%, com USD 9,27M acumulados. NA IMPRENSA, o UOL e a CartaCapital publicaram em 10/Ago matérias discutindo se pesquisa online superdimensiona o desempenho dele, o que torna os 10% um dado sob discussão pública e não um patamar consolidado."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "Nenhuma das duas rodadas de 10/Ago o testa em qualquer cenário, nem de 1º turno nem de returno, e o mesmo valia para as duas de 05/Ago. Ele segue sem urna. Preço da leitura confirmada de 09/Ago, 17:34 UTC: 0,05% (vol USD 6,78M acumulado), no piso que o mercado precifica.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "O AGRAVANTE PERMANECE E PRECISA SER DITO COM CLAREZA: ele NÃO é candidato à Presidência e disputa o governo de São Paulo, então qualquer cenário presidencial que o inclua é hipótese de pesquisa, e não candidatura em curso. Nenhuma das duas nacionais de 10/Ago o testa. Não há leitura de preço nova no dia, e o valor confirmado de 09/Ago é 0,05%, no piso que o mercado precifica, faixa em que variação não tem valor informativo."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1,25%",
    poll: "DADO NOVO NO RETURNO: a BTG/Nexus de 10/Ago aponta EMPATE de Lula com ele, na mesma rodada em que o líder vence o segundo colocado por 47% x 44%. É o único nome fora dos dois primeiros a conseguir isso na janela. No 1º turno tem 5% na Nexus, à frente de Renan Santos e de Zema. Seguem valendo os 4% da Quaest e os 5,7% da Meio/Ideia, de 05/Ago, e na Ideia ele é o adversário que chega mais perto no returno, com 40% contra 48,5%. A PALVER NÃO O TESTA no cenário publicado, e a ausência fica registrada como ausência. Preço da leitura confirmada de 09/Ago, 17:34 UTC: 1,25% (vol USD 5,60M acumulado).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "O DADO DELE HOJE VEM DO RETURNO E É O MELHOR DO PELOTÃO. A BTG/Nexus aponta empate de Lula com ele na mesma rodada em que o líder vence o segundo colocado, e somado aos 40% contra 48,5% da Meio/Ideia o quadro é de um terceiro nome que aparece melhor no confronto direto do que na largada. É EXATAMENTE O OPOSTO DO QUE O PREÇO MOSTRA: 1,25% na leitura confirmada de 09/Ago, contra 4% a 5,7% de intenção declarada, e é a maior distância entre urna e preço de todo o pelotão. O PAINEL NÃO SUBTRAI UMA DA OUTRA, porque as duas grandezas não são a mesma: a urna mede intenção agora, o contrato mede probabilidade de vencer no fim, e a diferença entre elas é o objeto do painel, não um erro a corrigir. Não há leitura de preço nova em 10/Ago; o valor confirmado de 09/Ago fechava o terceiro dia seguido de queda nos dois books, com 25,50% no de 3º lugar. A AUSÊNCIA TAMBÉM É INFORMAÇÃO: a Palver, maior amostra do dia, não o inclui no cenário publicado, e isso reduz a base de comparação entre casas sobre ele."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,45%",
    poll: "A BTG/Nexus de 10/Ago lhe dá 3% no 1º turno. A Palver não o testa no cenário publicado. Seguem valendo os 2% da Genial/Quaest e os 2,6% da Meio/Ideia, de 05/Ago, com returnos de 34% contra 46% e de 37% contra 48,5%. Preço da leitura confirmada de 09/Ago, 17:34 UTC: 0,45% (vol USD 5,02M acumulado), ABAIXO do corte de 0,5% que o painel usa para separar preço de ruído.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "A LEITURA SOBRE ELE SEGUE SUSPENSA POR TAMANHO DE PREÇO. O valor confirmado de 09/Ago é 0,45%, abaixo do corte de 0,5% que o painel usa para separar preço de ruído, e enquanto estiver nessa faixa a variação não sustenta interpretação. Não há leitura de preço nova em 10/Ago. NA URNA a BTG/Nexus lhe dá 3%, e ele segue sendo o nome do pelotão que Lula bate com mais folga nos returnos das rodadas de 05/Ago. NO TABULEIRO ele é o único do pelotão com registro de candidatura já apresentado ao TSE, feito em 06/Ago, com R$ 178,7 milhões de patrimônio declarado e o vice Girão informando R$ 34,1 milhões. O prazo de registro se encerra em 15/Ago, e a partir dali a ausência de registro dos demais passa a ser fato, e não pendência. Ressalva de série que segue valendo: o máximo dele foi 10,10%, em 26/Abr."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "Nenhuma das duas rodadas de 10/Ago o testa em qualquer cenário presidencial, e o mesmo valia para as de 05/Ago. Ausência de teste é informação que o painel registra, em vez de repetir dado antigo como se fosse novo. Ele disputa a REELEIÇÃO no governo de São Paulo, oficializada pelo Republicanos em 01/Ago. Preço da leitura confirmada de 09/Ago, 17:34 UTC: 0,05% (vol USD 13,87M acumulado).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "O CONTRASTE DELE É O MAIS EXTREMO DO BOOK E VALE REGISTRAR: com USD 13,87M acumulados, este é o MAIOR volume de todo o mercado presidencial, e o preço está no piso, em 0,05%. Volume alto com probabilidade no piso não é movimento, é convicção já precificada: muito dinheiro passou por ali para chegar à conclusão de que ele não disputa. Não há leitura de preço nova em 10/Ago, e o nível é baixo o bastante para que variações nesta faixa tenham valor informativo quase nulo. Ele disputa a reeleição em São Paulo, e nenhuma nacional da janela o testa no cenário presidencial."
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
